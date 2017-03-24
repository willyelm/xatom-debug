'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { EventEmitter }  from 'events';
import { Storage }  from '../scheme/storage';

export interface Breakpoint {
  lineNumber: number,
  filePath: string,
  marker: any
}

export type Breakpoints = Array<Breakpoint>;

export class BreakpointManager {

  private breakpoints: Breakpoints = [];
  private storage: Storage = new Storage('breakpoints.json');

  constructor () {}

  public getBreakpoints (): Breakpoints {
    return this.breakpoints
  }

  getBreakpoint (filePath: String, lineNumber: Number): Breakpoint {
    let index = this.breakpoints.findIndex((item) => {
      return (item.filePath === filePath && item.lineNumber === lineNumber)
    })
    return this.breakpoints[index];
  }

  getBreakpointsFromFile(filePath: String): Breakpoints {
    return this.breakpoints.filter((item) => {
      return (item.filePath === filePath)
    });
  }

  removeBreakpoint (breakpoint: Breakpoint): Promise<boolean> {
    return new Promise ((resolve, reject) => {
      let index = this.breakpoints.indexOf(breakpoint);
      if(index != -1) {
        // this.events.emit('removeBreakpoint', breakpoint.filePath, breakpoint.lineNumber);
        breakpoint.marker.destroy();
      	this.breakpoints.splice(index, 1);
        this.saveBreakpoints();
        return resolve(true);
      }
      return reject('breakpoint does not exists');
    })
  }

  addBreakpoint (marker: any, lineNumber: number, filePath: string): Promise<Breakpoint> {
    return new Promise((resolve, reject) => {
      let breakpoint = {
        lineNumber,
        filePath,
        marker
      } as Breakpoint
      let index = this.breakpoints.push(breakpoint);
      if (index > -1) {
        this.saveBreakpoints();
        resolve(breakpoint);
      } else {
        reject('unable to add breakpoint');
      }
    })
  }

  getSavedBreakpoints (): Promise<Breakpoints> {
    return this.storage.read();
  }

  saveBreakpoints () {
    let format = this.breakpoints.map((b) => {
      return {
        filePath: b.filePath,
        lineNumber: b.lineNumber
      }
    })
    return this.storage.saveFromObject(format);
  }
}
