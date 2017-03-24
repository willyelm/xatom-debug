'use babel'
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import {
  createGroupButtons,
  createButton,
  createIcon,
  createIconFromPath,
  createText,
  createElement,
  insertElement,
  attachEventFromObject
} from '../element/index'
import { InspectorView } from '../inspector/index'
import { EventEmitter }  from 'events'
import { parse } from 'path'

export interface CallStackFrame {
  name: string,
  columnNumber: number,
  lineNumber: number,
  filePath: string
}

export type CallStackFrames = Array<CallStackFrame>

export interface DebugAreaOptions {
  didPause?: Function,
  didResume?: Function,
  didStepOver?: Function,
  didStepInto?: Function,
  didStepOut?: Function,
  didBreak?: Function,
  didOpenFile?: Function,
  didRequestProperties?: Function
}

export class DebugAreaView {

  private consoleElement: HTMLElement
  private debugAreaElement: HTMLElement
  private callStackContentElement: HTMLElement
  private scopeContentElement: HTMLElement
  private breakpointContentElement: HTMLElement
  private resizeElement: HTMLElement

  private pauseButton: HTMLElement
  private resumeButton: HTMLElement
  private events: EventEmitter

  constructor (options?: DebugAreaOptions) {

    this.events = new EventEmitter()
    this.consoleElement = createElement('atom-bugs-console')
    this.consoleElement.setAttribute('tabindex', '-1')

    this.pauseButton = createButton({
      click: () => {
        this.events.emit('didPause')
      }
    }, [createIcon('pause'), createText('Pause')])

    this.resumeButton = createButton({
      click: () => {
        this.events.emit('didResume')
      }
    }, [createIcon('resume'), createText('Resume')])

    this.togglePause(false)

    this.debugAreaElement = createElement('atom-bugs-area')
    this.callStackContentElement = createElement('atom-bugs-group-content', {
      className: 'callstack'
    })
    this.scopeContentElement = createElement('atom-bugs-group-content', {
      className: 'scope'
    })
    this.breakpointContentElement = createElement('atom-bugs-group-content', {
      className: 'breakpoint'
    })
    this.resizeElement = createElement('atom-bugs-resize', {
      className: 'resize-left'
    });

    insertElement(this.debugAreaElement, [
      this.resizeElement,
      createElement('atom-bugs-controls', {
        elements: [
          this.pauseButton,
          this.resumeButton,
          createButton({
            click: () => {
              this.events.emit('didStepOver')
            }
          }, [createIcon('step-over')]),
          createButton({
            click: () => {
              this.events.emit('didStepInto')
            }
          }, [createIcon('step-into')]),
          createButton({
            click: () => {
              this.events.emit('didStepOut')
            }
          }, [createIcon('step-out')])
        ]
      }),
      createElement('atom-bugs-group', {
        elements: [
          createElement('atom-bugs-group-header', {
            elements: [createText('Call Stack')]
          }),
          this.callStackContentElement
        ]
      }),
      createElement('atom-bugs-group', {
        elements: [
          createElement('atom-bugs-group-header', {
            elements: [createText('Scope')]
          }),
          this.scopeContentElement
        ]
      }),
      createElement('atom-bugs-group', {
        elements: [
          createElement('atom-bugs-group-header', {
            elements: [createText('Breakpoints')]
          }),
          this.breakpointContentElement
        ]
      })
    ])
    attachEventFromObject(this.events, [
      'didPause',
      'didResume',
      'didStepOver',
      'didStepInto',
      'didStepOut',
      'didBreak',
      'didOpenFile',
      'didRequestProperties'
    ], options)
    window.addEventListener('resize', () => this.adjustDebugArea())
    setTimeout(() => this.adjustDebugArea(), 0)
    this.resizeDebugArea()
  }

  adjustDebugArea () {
    let ignoreElements = ['atom-bugs-controls', 'atom-bugs-group atom-bugs-group-header']
    let reduce = ignoreElements.reduce((value, query): number => {
      let el = this.debugAreaElement.querySelectorAll(query)
      Array.from(el).forEach((child: HTMLElement) => {
        value += child.clientHeight;
      })
      return value
    }, 6)
    let contents = this.debugAreaElement.querySelectorAll('atom-bugs-group atom-bugs-group-content');
    let items = Array.from(contents);
    let availableHeight = (this.debugAreaElement.clientHeight - reduce) / items.length;
    items.forEach((el: HTMLElement) => {
      el.style.height = `${availableHeight}px`;
    })
  }

  resizeDebugArea () {
    let initialEvent
    let resize = (targetEvent) => {
      let offset = initialEvent.screenX - targetEvent.screenX
      let width = this.debugAreaElement.clientWidth + offset;
      if (width > 240 && width < 600) {
        this.debugAreaElement.style.width = `${width}px`;
      }
      initialEvent = targetEvent
    }
    this.resizeElement.addEventListener('mousedown', (e) => {
      initialEvent = e
      document.addEventListener('mousemove', resize)
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mouseup', resize)
        document.removeEventListener('mousemove', resize)
      })
    })
  }

  togglePause (status: boolean) {
    this.resumeButton.style.display = status ? null : 'none'
    this.pauseButton.style.display = status ? 'none' : null
  }

  // setPausedScript (filePath: string, lineNumber: number) {
  //   this.consoleCreateLine('', [
  //     createText('Pause on'),
  //     createText(`${filePath}:${lineNumber}`)
  //   ])
  // }

  // Debug
  createFrameLine (frame: CallStackFrame, indicate: boolean) {
    let file = parse(frame.filePath)
    let indicator = createIcon(indicate ? 'arrow-right-solid' : '')
    if (indicate) {
      indicator.classList.add('active')
    }
    return createElement('atom-bugs-group-item', {
      options: {
        click: () => {
          this.events.emit('didOpenFile',
            frame.filePath,
            frame.lineNumber,
            frame.columnNumber)
        }
      },
      elements: [
        createElement('span', {
          elements: [indicator, createText(frame.name || '(anonymous)')]
        }),
        createElement('span', {
          className: 'file-reference',
          elements: [
            createText(file.base),
            createElement('span', {
              className: 'file-position',
              elements: [ createText(`${frame.lineNumber}${ frame.columnNumber > 0 ? ':' + frame.columnNumber : '' }`) ]
            })
          ]
        })
      ]
    })
  }

  getBreakpointId (filePath: string, lineNumber: number) {
    let token = btoa(`${filePath}${lineNumber}`)
    return `breakpoint-${token}`
  }

  createBreakpointLine (filePath: string, lineNumber: number) {
    let file = parse(filePath)
    insertElement(this.breakpointContentElement, createElement('atom-bugs-group-item', {
      id: this.getBreakpointId(filePath, lineNumber),
      elements: [
        createIcon('break'),
        createElement('span', {
          className: 'file-reference',
          elements: [
            createText(file.base),
            createElement('span', {
              className: 'file-position',
              elements: [ createText(String(lineNumber)) ]
            })
          ]
        })
      ]
    }))
  }

  removeBreakpointLine (filePath: string, lineNumber: number) {
    let id = this.getBreakpointId(filePath, lineNumber)
    let element = this.breakpointContentElement.querySelector(`[id='${id}']`)
    if (element) {
      element.remove()
    }
  }

  clearBreakpoints () {
    this.breakpointContentElement.innerHTML = ''
  }

  insertCallStackFromFrames (frames: CallStackFrames) {
    this.clearCallStack()
    frames.forEach((frame, index) => {
      return insertElement(this.callStackContentElement,
        this.createFrameLine(frame, index === 0))
    })
  }

  clearCallStack () {
    this.callStackContentElement.innerHTML = ''
  }

  insertScope (scope) {
    this.clearScope()
    let inspector = new InspectorView({
      result: scope,
      didRequestProperties: (result, inspectorView) => {
        this.events.emit('didRequestProperties', result, inspectorView)
      }
    })
    insertElement(this.scopeContentElement, inspector.getElement())
  }

  clearScope () {
    this.scopeContentElement.innerHTML = ''
  }

  getDebugElement () {
    return this.debugAreaElement
  }
  // Console
  clearConsole () {
    this.consoleElement.innerHTML = ''
  }

  createConsoleLine (entry: string, elements?) {
    let line = createElement('atom-bugs-console-line')
    if (entry && entry.length > 0) {
      line.innerHTML = entry
    }
    if (elements) {
      insertElement(line, elements)
    }
    setTimeout (() => {
      this.consoleElement.scrollTop = this.consoleElement.scrollHeight
    }, 250)
    return insertElement(this.consoleElement, line)
  }

  getConsoleElement () {
    return this.consoleElement
  }

  // Destroy all
  destroy () {
    this.consoleElement.remove()
    this.debugAreaElement.remove()
    window.removeEventListener('resize', () => this.adjustDebugArea())
  }
}
