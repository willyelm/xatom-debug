'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { Collection } from './Collection';

export namespace Storage {

  export const project = new Collection('projects');
  export const breakpoint = new Collection('breakpoints');
  export const expression = new Collection('expressions');

}
