'use babel'
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { EventEmitter }  from 'events'

export interface Breakpoint {
  lineNumber: number,
  filePath: string,
  condition: string,
  marker: any
}

export type Breakpoints = Array<Breakpoint>

export class BreakpointManager {

  private breakpoints: Breakpoints = []

  constructor () {}

  public getBreakpoints (): Breakpoints {
    return this.breakpoints
  }

  getBreakpoint (filePath: String, lineNumber: Number): Breakpoint {
    let index = this.breakpoints.findIndex((item) => {
      return (item.filePath === filePath && item.lineNumber === lineNumber)
    })
    return this.breakpoints[index]
  }

  getBreakpointsFromFile(filePath: String): Breakpoints {
    return this.breakpoints.filter((item) => {
      return (item.filePath === filePath)
    })
  }

  removeBreakpoint (breakpoint: Breakpoint): Promise<boolean> {
    return new Promise ((resolve, reject) => {
      let index = this.breakpoints.indexOf(breakpoint)
      if(index != -1) {
        if (breakpoint.marker) breakpoint.marker.destroy()
      	this.breakpoints.splice(index, 1)
        return resolve(true)
      }
      return reject('Breakpoint does not exists')
    })
  }

  addBreakpoint (marker: any, lineNumber: number, filePath: string, condition?: string): Promise<Breakpoint> {
    return new Promise((resolve, reject) => {
      let breakpoint = {
        lineNumber,
        filePath,
        marker,
        condition: condition || ''
      } as Breakpoint
      let index = this.breakpoints.push(breakpoint)
      if (index > -1) {
        resolve(breakpoint)
      } else {
        reject('Unable to add breakpoint')
      }
    })
  }
  getPlainBreakpoints (): Breakpoints {
    return this.breakpoints.map((b) => {
      return {
        filePath: b.filePath,
        lineNumber: b.lineNumber,
        condition: b.condition
      } as Breakpoint
    })
  }
}
