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
const { CompositeDisposable } = require('atom')
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
  didRequestProperties?: Function,
  didOpenFrame?: Function
}

export class DebugAreaView {

  private element: HTMLElement
  private callStackContentElement: HTMLElement
  private scopeContentElement: HTMLElement
  private breakpointContentElement: HTMLElement
  private resizeElement: HTMLElement

  private pauseButton: HTMLElement
  private resumeButton: HTMLElement
  private events: EventEmitter
  private projectPath: string;
  private subscriptions:any = new CompositeDisposable();

  constructor (options?: DebugAreaOptions) {

    this.events = new EventEmitter()

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

    this.element = createElement('xatom-debug-area')
    this.callStackContentElement = createElement('xatom-debug-group-content', {
      className: 'callstack'
    })
    this.scopeContentElement = createElement('xatom-debug-group-content', {
      className: 'scope'
    })
    this.breakpointContentElement = createElement('xatom-debug-group-content', {
      className: 'breakpoint'
    })
    this.resizeElement = createElement('xatom-debug-resize', {
      className: 'resize-left'
    });

    insertElement(this.element, [
      this.resizeElement,
      createElement('xatom-debug-controls', {
        elements: [
          this.pauseButton,
          this.resumeButton,
          createButton({
            tooltip: {
              subscriptions: this.subscriptions,
              title: 'Step Over'
            },
            click: () => {
              this.events.emit('didStepOver')
            }
          }, [createIcon('step-over')]),
          createButton({
            tooltip: {
              subscriptions: this.subscriptions,
              title: 'Step Into'
            },
            click: () => {
              this.events.emit('didStepInto')
            }
          }, [createIcon('step-into')]),
          createButton({
            tooltip: {
              subscriptions: this.subscriptions,
              title: 'Step Out'
            },
            click: () => {
              this.events.emit('didStepOut')
            }
          }, [createIcon('step-out')])
        ]
      }),
      createElement('xatom-debug-group', {
        elements: [
          createElement('xatom-debug-group-header', {
            elements: [createText('Call Stack')]
          }),
          this.callStackContentElement
        ]
      }),
      createElement('xatom-debug-group', {
        elements: [
          createElement('xatom-debug-group-header', {
            elements: [createText('Variables')]
          }),
          this.scopeContentElement
        ]
      }),
      createElement('xatom-debug-group', {
        elements: [
          createElement('xatom-debug-group-header', {
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
      'didRequestProperties',
      'didOpenFrame'
    ], options)
    window.addEventListener('resize', () => this.adjustDebugArea())
    setTimeout(() => this.adjustDebugArea(), 0)
    this.resizeDebugArea()
  }

  adjustDebugArea () {
    let ignoreElements = ['xatom-debug-controls', 'xatom-debug-group xatom-debug-group-header']
    let reduce = ignoreElements.reduce((value, query): number => {
      let el = this.element.querySelectorAll(query)
      Array.from(el).forEach((child: HTMLElement) => {
        value += child.clientHeight;
      })
      return value
    }, 6)
    let contents = this.element.querySelectorAll('xatom-debug-group xatom-debug-group-content');
    let items = Array.from(contents);
    let availableHeight = (this.element.clientHeight - reduce) / items.length;
    items.forEach((el: HTMLElement) => {
      el.style.height = `${availableHeight}px`;
    })
  }

  resizeDebugArea () {
    let initialEvent
    let resize = (targetEvent) => {
      let offset = initialEvent.screenX - targetEvent.screenX
      let width = this.element.clientWidth + offset;
      if (width > 240 && width < 600) {
        this.element.style.width = `${width}px`;
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

  // Debug
  createFrameLine (frame: CallStackFrame, indicate: boolean) {
    let file = parse(frame.filePath)
    let indicator = createIcon(indicate ? 'arrow-right-solid' : '')
    if (indicate) {
      indicator.classList.add('active')
    }
    return createElement('xatom-debug-group-item', {
      options: {
        click: () => {
          this.events.emit('didOpenFrame', frame)
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
              elements: [ createText(`${frame.lineNumber + 1}${ frame.columnNumber > 0 ? ':' + frame.columnNumber : '' }`) ]
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

  setWorkspace (projectPath) {
    this.projectPath = projectPath;
  }

  createBreakpointLine (filePath: string, lineNumber: number) {
    // let file = parse(filePath)
    let shortName = filePath;
    if (this.projectPath) {
      shortName = filePath.replace(this.projectPath, '');
    }
    insertElement(this.breakpointContentElement, createElement('xatom-debug-group-item', {
      id: this.getBreakpointId(filePath, lineNumber),
      options: {
        click: () => {
          this.events.emit('didOpenFile', filePath, lineNumber, 0)
        }
      },
      elements: [
        createIcon('break'),
        createElement('span', {
          // className: 'file-reference',
          elements: [
            createElement('span', {
              className: 'file-position',
              elements: [ createText(String(lineNumber + 1)) ]
            }),
            createText(shortName)
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
    if (scope) {
      this.clearScope()
      let inspector = new InspectorView({
        result: scope,
        didRequestProperties: (result, inspectorView) => {
          this.events.emit('didRequestProperties', result, inspectorView)
        }
      })
      insertElement(this.scopeContentElement, inspector.getElement())
    }
  }

  clearScope () {
    this.scopeContentElement.innerHTML = ''
  }

  getElement () {
    return this.element
  }

  // Destroy all
  destroy () {
    this.element.remove()
    this.subscriptions.dispose()
    window.removeEventListener('resize', () => this.adjustDebugArea())
  }
}
