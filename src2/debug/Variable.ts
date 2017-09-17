'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

export interface Variable {
  filePath: string;
  functionName: string;
  lineNumber: number;
  columnNumber: number;
}

export type Variables = Array<Variable>;
