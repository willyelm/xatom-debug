'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { EventEmitter }  from 'events';

export interface Breakpoint {
  lineNumber: number,
  filePath: string,
  marker: any
}

export class BreakpointManager {

  private breakpoints: Array<Breakpoint> = [];
  public events: EventEmitter;

  constructor () {
    this.events = new EventEmitter();
  }

  public getBreakpoints (): Array<Breakpoint> {
    return this.breakpoints;
  }

  public didAddBreakpoint (callback: Function) {
    this.events.on('addBreakpoint', callback);
  }

  public didRemoveBreakpoint (callback: Function) {
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
          this.removeBreakpoint(exists);
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

  getBreakpoint (filePath: String, lineNumber: Number): Breakpoint {
    let index = this.breakpoints.findIndex((item) => {
      return (item.filePath === filePath && item.lineNumber === lineNumber)
    })
    return this.breakpoints[index];
  }

  removeBreakpoint (breakpoint: Breakpoint): boolean {
    let index = this.breakpoints.indexOf(breakpoint);
    if(index != -1) {
      this.events.emit('removeBreakpoint', breakpoint.filePath, breakpoint.lineNumber);
      breakpoint.marker.destroy();
    	this.breakpoints.splice(index, 1);
      return true;
    }
    return false;
  }

  addBreakpoint (marker: any, lineNumber: number, filePath: string) {
    this.events.emit('addBreakpoint', filePath, lineNumber);
    let index = this.breakpoints.push({
      lineNumber,
      filePath,
      marker
    } as Breakpoint);
  }
}
