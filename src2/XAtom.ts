'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { BreakpointManager } from './breakpoint';
import { ProjectManager } from './Project';

export namespace XAtom {
  export const breakpoints = new BreakpointManager();
  export const project = new ProjectManager();
}
