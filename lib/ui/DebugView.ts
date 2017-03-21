'use babel';
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
  insertElement
} from '../element/index';
import { EventEmitter }  from 'events';
import { parse } from 'path';

export interface CallStackFrame {
  name: string,
  columnNumber: number,
  lineNumber: number,
  filePath: string
}

export type CallStackFrames = Array<CallStackFrame>;

export class DebugView {

  private consoleElement: HTMLElement;
  private debugAreaElement: HTMLElement;
  private callStackContentElement: HTMLElement;

  private pauseButton: HTMLElement;
  private resumeButton: HTMLElement;
  private events: EventEmitter;

  constructor () {

    this.events = new EventEmitter();
    this.consoleElement = createElement('atom-bugs-console');
    this.consoleElement.setAttribute('tabindex', '-1');

    this.pauseButton = createButton({
      click: () => {
        this.events.emit('didPause')
      }
    }, [createIcon('pause'), createText('Pause')]);

    this.resumeButton = createButton({
      click: () => {
        this.events.emit('didResume')
      }
    }, [createIcon('resume'), createText('Resume')])

    this.togglePause(false);

    this.debugAreaElement = createElement('atom-bugs-area');
    this.callStackContentElement = createElement('atom-bugs-group-content', {
      elements: [
        createText('Not Paused')
      ]
    });

    insertElement(this.debugAreaElement, [
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
          createElement('atom-bugs-group-content', {
            elements: [createText('Some Content')]
          })
        ]
      }),
      createElement('atom-bugs-group', {
        elements: [
          createElement('atom-bugs-group-header', {
            elements: [createText('Breakpoints')]
          }),
          createElement('atom-bugs-group-content', {
            elements: [createText('Some Content')]
          })
        ]
      })
    ])
  }

  public didResume (callback) {
    this.events.on('didResume', callback)
  }

  public didPause (callback) {
    this.events.on('didPause', callback)
  }
  public didStepOver (callback) {
    this.events.on('didStepOver', callback)
  }
  public didStepInto (callback) {
    this.events.on('didStepInto', callback)
  }
  public didStepOut (callback) {
    this.events.on('didStepOut', callback)
  }
  public didBreak (callback) {
    this.events.on('didBreak', callback)
  }

  public didOpenFile (callback) {
    this.events.on('didOpenFile', callback)
  }

  togglePause (status: boolean) {
    this.resumeButton.style.display = status ? null : 'none';
    this.pauseButton.style.display = status ? 'none' : null;
  }

  // setPausedScript (filePath: string, lineNumber: number) {
  //   this.consoleCreateLine('', [
  //     createText('Pause on'),
  //     createText(`${filePath}:${lineNumber}`)
  //   ])
  // }

  breakOnFile (filePath: string, lineNumber: number) {
    this.consoleCreateLine('', [
      createText('Break on'),
      createText(`${filePath}:${lineNumber}`)
    ]);
    this.events.emit('didBreak', filePath, lineNumber);
  }

  // Debug
  createFrameLine (frame: CallStackFrame, indicate: boolean) {
    let file = parse(frame.filePath);
    let indicator = createIcon(indicate ? 'arrow-right-solid' : '');
    if (indicate) {
      indicator.classList.add('active');
    }
    return createElement('atom-bugs-group-item', {
      options: {
        click: () => {
          this.events.emit('didOpenFile',
            frame.filePath,
            frame.lineNumber,
            frame.columnNumber);
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
    });
  }

  insertCallStackFromFrames (frames: CallStackFrames) {
    this.callStackClear();
    frames.forEach((frame, index) => {
      return insertElement(this.callStackContentElement,
        this.createFrameLine(frame, index === 0))
    })
  }

  callStackClear () {
    this.callStackContentElement.innerHTML = '';
  }

  getDebugElement () {
    return this.debugAreaElement;
  }
  // Console
  consoleClear () {
    this.consoleElement.innerHTML = '';
  }

  consoleCreateLine (entry: string, elements?) {
    let line = createElement('atom-bugs-console-line');
    if (entry && entry.length > 0) {
      line.innerHTML = entry;
    }
    if (elements) {
      insertElement(line, elements)
    }
    setTimeout (() => {
      this.consoleElement.scrollTop = this.consoleElement.scrollHeight;
    }, 250);
    return insertElement(this.consoleElement, line);
  }

  getConsoleElement () {
    return this.consoleElement;
  }

  // Destroy all
  destroy () {
    this.consoleElement.remove();
    this.debugAreaElement.remove();
  }
}
