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

export class DebugView {

  private element: HTMLElement;
  private consoleElement: HTMLElement;
  private debugAreaElement: HTMLElement;

  private pauseButton: HTMLElement;
  private resumeButton: HTMLElement;
  private events: EventEmitter;

  constructor () {

    this.events = new EventEmitter();
    this.element = document.createElement('atom-bugs-debug');
    this.consoleElement = createElement('atom-bugs-console');
    this.consoleElement.setAttribute('tabindex', '-1');

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

    this.togglePause(false);

    this.debugAreaElement = createElement('atom-bugs-area');
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
      createElement('atom-bugs-control-group', {
        elements: [
          createElement('atom-bugs-control-title', {
            elements: [createText('Breakpoints')]
          }),
          createElement('atom-bugs-control-content', {
            elements: [createText('Some Content')]
          })
        ]
      })
    ])
    insertElement(this.element, this.debugAreaElement)
    insertElement(this.element, this.consoleElement)
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
    ])
    this.events.emit('didBreak', filePath, lineNumber)
  }

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

  getElement () {
    return this.element;
  }

  destroy () {
    this.element.remove();
  }
}
