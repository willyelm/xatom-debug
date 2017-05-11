'use babel'
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import {
 createIcon,
 createText,
 createInput,
 createButton,
 createElement,
 insertElement,
 attachEventFromObject
} from '../element/index'

import { BreakpointManager, Breakpoint, Breakpoints } from './breakpoint-manager'
import { PluginManager } from '../plugin/index'
import { InspectorView } from '../inspector/index'
import { EventEmitter }  from 'events'
import { get } from 'lodash'

export interface EditorOptions {
  pluginManager: PluginManager,
  didAddBreakpoint?: Function,
  didRemoveBreakpoint?: Function,
  didBreak?: Function,
  didChange?: Function
}

export class EditorManager {

  private currentEditor: any

  private currentBreakMarker: any
  private currentExpressionMarker: any
  private currentEvaluationMarker: any

  private activateExpressionListerner: boolean = true
  private evaluateHandler: any

  public breakpointManager: BreakpointManager
  private pluginManager: PluginManager
  private events: EventEmitter

  constructor (options: EditorOptions) {
    this.events = new EventEmitter()
    this.breakpointManager = new BreakpointManager()
    this.pluginManager = options.pluginManager
    attachEventFromObject(this.events, [
      'didAddBreakpoint',
      'didRemoveBreakpoint',
      'didChangeBreakpoint',
      'didBreak',
      'didChange'
    ], options)
  }

  restoreBreakpoints (breakpoints: Breakpoints) {
    breakpoints.forEach(({filePath, lineNumber, condition}) => {
      let marker
      if (get(this, 'currentEditor.getPath') && filePath === this.currentEditor.getPath()) {
        marker = this.createBreakpointMarkerForEditor(this.currentEditor, lineNumber)
      }
      this.breakpointManager.addBreakpoint(marker, lineNumber, filePath, condition)
      this.events.emit('didAddBreakpoint', filePath, lineNumber)
    })
  }

  getBreakpointFromEvent (event: any) {
    let line: HTMLElement = event.target
    let lineNumber = parseInt(line.getAttribute('data-buffer-row'), 0)
    let editor = atom.workspace.getActiveTextEditor()
    let filePath = editor.getPath()
    return this.breakpointManager.getBreakpoint(filePath, lineNumber)
  }

  removeBreakpointFromEvent (event: any) {
    let breakpoint = this.getBreakpointFromEvent(event)
    if (breakpoint) {
      this.removeBreakpoint(breakpoint)
    }
  }

  editBreakpointFromEvent (event: any) {
    let editor = atom.workspace.getActiveTextEditor()
    let breakpoint = this.getBreakpointFromEvent(event)
    if (breakpoint) {
      let range = [[breakpoint.lineNumber, 0], [breakpoint.lineNumber, 0]]
      let marker: any = editor.markBufferRange(range)
      let conditionInput = document.createElement('atom-text-editor')
      conditionInput.setAttribute('mini', 'true')
      let miniEditor = conditionInput['getModel']()
      miniEditor.setText(breakpoint.condition)
      miniEditor.setGrammar(editor.getGrammar())
      let conditionButton = createButton({
        click: () => {
          let miniEditor = conditionInput['getModel']()
          let conditionText = miniEditor.getText()
          breakpoint.condition = conditionText
          setTimeout(() => {
            this.events.emit('didChangeBreakpoint', breakpoint.filePath, breakpoint.lineNumber, breakpoint.condition)
            this.pluginManager.changeBreakpoint(breakpoint.filePath, breakpoint.lineNumber, breakpoint.condition)
            this.events.emit('didChange')
          }, 500)
          breakpointEditor.remove()
          marker.destroy()
        }
      }, createIcon('check'))
      // conditionButton.classList.add('btn-success')

      let breakpointEditor: HTMLElement = createElement('div', {
        elements: [
          conditionInput,
          conditionButton,
          createElement('bugs-breakpoint-edit-arrow')
        ]
      })
      let decorator = editor.decorateMarker(marker, {
        type: 'overlay',
        class: 'bugs-breakpoint-edit',
        item: breakpointEditor
      })
      setTimeout(() => {
        conditionInput.focus()
        conditionInput.addEventListener('blur', (e: FocusEvent) => {
          if(e.relatedTarget !== conditionButton) {
            breakpointEditor.remove()
            marker.destroy()
          }
        })
      }, 0)
    }
  }

  destroy () {
    this.currentBreakMarker = undefined
    this.currentExpressionMarker = undefined
    this.currentEvaluationMarker = undefined
    this.removeMarkers()
  }

  breakOnFile (filePath: string, lineNumber: number) {
    // this.createConsoleLine('', [
    //   createText('Break on'),
    //   createText(`${filePath}:${lineNumber}`)
    // ])
    this.events.emit('didBreak', filePath, lineNumber)
  }

  createBreakMarker (editor, lineNumber: number) {
    this.removeBreakMarker()
    let range = [[lineNumber, 0], [lineNumber, 0]]
    this.currentBreakMarker = editor.markBufferRange(range)
    editor.decorateMarker(this.currentBreakMarker, {
      type: 'line',
      class: 'bugs-break-line'
    })
  }

  removeMarkers () {
    this.removeBreakMarker()
    this.removeExpressionMarker()
    this.removeEvaluationMarker()
  }

  removeBreakMarker () {
    if (this.currentBreakMarker) {
      this.currentBreakMarker.destroy()
    }
  }

  removeExpressionMarker () {
    if (this.currentExpressionMarker) {
      this.currentExpressionMarker.destroy()
    }
  }

  async addFeatures (editor) {
    // restore breakpoints
    if (get(editor, 'getPath', false)) {
      let sourceFile = editor.getPath()
      let breakpoints = await this.breakpointManager.getBreakpointsFromFile(sourceFile)
      breakpoints.forEach((breakpoint: Breakpoint) => {
        if (breakpoint.marker) breakpoint.marker.destroy()
        breakpoint.marker = this.createBreakpointMarkerForEditor(editor, breakpoint.lineNumber)
      })
    }
    this.currentEditor = editor
    if (get(editor, 'editorElement.addEventListener', false) &&
      !get(editor, 'editorElement.__atomBugsEnabledFeatures', false)) {
      let breakpointHandler = (e) => this.listenBreakpoints(e, editor)
      let expressionHandler = (e) => this.listenExpressionEvaluations(e, editor)
      // add breakpoint handler
      editor.editorElement.__atomBugsEnabledFeatures = true
      editor.editorElement.addEventListener('click', breakpointHandler)
      editor.editorElement.addEventListener('mousemove', expressionHandler)
      editor.onDidDestroy(() => {
        editor.editorElement.removeEventListener('click', breakpointHandler)
        editor.editorElement.removeEventListener('mousemove', expressionHandler)
      })
    }
  }

  private removeBreakpoint (breakpoint: Breakpoint) {
    let sourceFile = breakpoint.filePath
    let lineNumber = breakpoint.lineNumber
    return this
      .breakpointManager
      .removeBreakpoint(breakpoint)
      .then(() => {
        this.events.emit('didRemoveBreakpoint', sourceFile, lineNumber)
        this.pluginManager.removeBreakpoint(sourceFile, lineNumber)
      })
  }

  private listenBreakpoints (e: MouseEvent, editor: any) {
    let element = e.target as HTMLElement
    if (element.classList.contains('line-number')) {
      // toggle breakpoints
      let lineNumber = Number(element.textContent) - 1
      if (lineNumber >= 0) {
        let sourceFile = editor.getPath()
        let exists = this.breakpointManager.getBreakpoint(sourceFile, lineNumber)
        if (exists) {
          this.removeBreakpoint(exists)
        } else {
          let marker = this.createBreakpointMarkerForEditor(editor, lineNumber)
          this
            .breakpointManager
            .addBreakpoint(marker, lineNumber, sourceFile)
            .then(() => {
              this.events.emit('didAddBreakpoint', sourceFile, lineNumber)
              this.pluginManager.addBreakpoint(sourceFile, lineNumber)
            })
        }
        this.events.emit('didChange')
      }
    }
  }

  private createBreakpointMarkerForEditor (editor: any, lineNumber: any) {
    let range = [[lineNumber, 0], [lineNumber, 0]]
    let marker = editor.markBufferRange(range)
    let decorator = editor.decorateMarker(marker, {
      type: 'line-number',
      class: 'bugs-breakpoint'
    })
    return marker
  }

  private getEditorPositionFromEvent (editor, e: MouseEvent) {
    let lines = editor.editorElement.querySelector('.lines')
    var clientX = e.clientX
    var clientY = e.clientY
    let clientRect = lines.getBoundingClientRect()
    let screenPosition = editor.editorElement.screenPositionForPixelPosition({
      top: (clientY - clientRect.top) + editor.editorElement.getScrollTop(),
      left: (clientX - clientRect.left) + editor.editorElement.getScrollLeft()
    })
    return editor.bufferPositionForScreenPosition(screenPosition)
  }

  private getEditorWordRangeFromPosition (editor, position) {
    let prevRow = editor.buffer.previousNonBlankRow(position.row)
    let endRow = editor.buffer.nextNonBlankRow(position.row)
    if (!endRow) {
      endRow = position.row
    }
    let startWord = position
    let endWord = position
    // /\()"':,.<>~!@#$%^&*|+=[]{}`?-…
    editor.scanInBufferRange(/[ \,\{\}\(\\)\[\]^\n]+/gm, [[prevRow, 0], position], (s) => {
      if (s.matchText) {
        startWord = s.range.end
      }
    })
    editor.scanInBufferRange(/[ \,\{\}\(\.\\)\[\]\:\/\n]+/g, [position, [endRow, 50]], (s) => {
      if (s.matchText) {
        endWord = s.range.start
        s.stop()
      }
    })
    return [startWord, endWord]
  }

  private listenExpressionEvaluations (e: MouseEvent, editor: any) {
    if (this.activateExpressionListerner) {
      let sourceFile = editor.getPath()
      let bufferPosition = this.getEditorPositionFromEvent(editor, e)
      let scanRange = this.getEditorWordRangeFromPosition(editor, bufferPosition)
      let expression = editor.getTextInBufferRange(scanRange)
      clearTimeout(this.evaluateHandler)
      this.evaluateHandler = setTimeout(() => {
        if (expression && String(expression).trim().length > 0) {
          let evaluationView = this.createEditorEvaluationView(editor, scanRange)
          this
            .pluginManager
            .evaluateExpression(expression, evaluationView)
        }
      }, 500)
    }
  }

  createEditorEvaluationView (editor: any, range: any) {
    return {
      insertFromResult: (result) => {
        this.addEditorEvaluationMarker(editor, result, range)
      }
    }
  }

  createInspectorOverlay (result: any) {
    let element = createElement('xatom-debug-overlay', {
      className: 'native-key-bindings'
    })
    element.setAttribute('tabindex', '0')
    let inspector = new InspectorView({
      result,
      didRequestProperties: (result, inspectorView) => {
        this.pluginManager.requestProperties(result, inspectorView)
      }
    })
    return insertElement(element, [
      createElement('xatom-debug-overlay-header', {
        elements: [ createText(result.className || result.type) ]
      }),
      inspector.getElement()
    ])
  }

  addEditorEvaluationMarker (editor: any, result: any, range) {
    // highlight expression
    this.removeExpressionMarker()
    this.currentExpressionMarker = editor.markBufferRange(range)
    editor.decorateMarker(this.currentExpressionMarker, {
      type: 'highlight',
      class: 'bugs-expression'
    })
    // overlay inspector
    this.removeEvaluationMarker()
    let element = this.createInspectorOverlay(result)
    this.currentEvaluationMarker = editor.markBufferRange(range)
    editor.decorateMarker(this.currentEvaluationMarker, {
      type: 'overlay',
      class: 'bugs-expression-overlay',
      item: element
    })
    setTimeout(() => {
      let close = () => {
        this.activateExpressionListerner = true
        this.removeEvaluationMarker()
      }
      // let autoClose = setTimeout(close, 15000)
      element.addEventListener('mouseenter', () => {
        // clearTimeout(autoClose)
        this.activateExpressionListerner = false
        element.addEventListener('mouseleave', () => close())
      })
    }, 0)
  }

  removeEvaluationMarker () {
    if (this.currentEvaluationMarker) {
      this.currentEvaluationMarker.destroy()
      this.currentEvaluationMarker = undefined
    }
  }
}
