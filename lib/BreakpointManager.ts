'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { EventEmitter }  from 'events';

export class BreakpointManager {

  private breakpoints: Array<any> = [];
  public events: EventEmitter;

  constructor () {
    this.events = new EventEmitter();
  }

  public didAddBreakpoint (callback) {
    this.events.on('addBreakpoint', callback);
  }

  public didRemoveBreakpoint (callback) {
    this.events.on('removeBreakpoint', callback);
  }

  getHandler (editor) {
    let sourceFile = editor.getPath()
    return (e) => {
      let element = e.target
      if (element.classList.contains('line-number')) {
        // toggle breakpoints
        let lineNumber = Number(element.textContent)
        let exists = this.getBreakpoint(sourceFile, lineNumber)
        if (exists) {
          exists.remove();
        } else {
          let range = [[lineNumber - 1, 0], [lineNumber - 1, 0]]
          let marker = editor.markBufferRange(range)
          let decorator = editor.decorateMarker(marker, {
            type: 'line-number',
            class: 'bugs-breakpoint'
          })
          this.addBreakpoint(marker, lineNumber, sourceFile)
        }
      }
    }
  }

  observeEditor (editor: any) {
    let handler = this.getHandler(editor);
    editor.editorElement.removeEventListener('click', handler);
    editor.editorElement.addEventListener('click', handler);
  }

  getBreakpoint (filePath: String, lineNumber: Number) {
    let index = this.breakpoints.findIndex((item) => {
      return (item.filePath === filePath && item.lineNumber === lineNumber)
    })
    return this.breakpoints[index];
  }

  addBreakpoint (marker: any, lineNumber: Number, filePath: String) {
    this.events.emit('addBreakpoint', filePath, lineNumber);
    let index = this.breakpoints.push({
      lineNumber,
      filePath,
      remove: () =>  {
        this.breakpoints.splice(index - 1, 1);
        marker.destroy();
        this.events.emit('removeBreakpoint', filePath, lineNumber);
      }
    });
  }
}
