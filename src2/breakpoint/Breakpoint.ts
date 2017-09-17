'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { Item } from '../storage';

export interface Breakpoint extends Item {
  lineNumber: number,
  columnNumber: number,
  filePath: string,
  condition: string,
  marker?: any
}
export type Breakpoints = Array<Breakpoint>;
