/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
'use babel';

import {
  createGroupButtons,
  createButton,
  createIcon,
  createIconFromPath,
  createText,
  createElement,
  insertElement
} from '../element/index';

export class SchemeEditorView {
  private element: HTMLElement;
  constructor () {
    this.element = document.createElement('atom-bugs-scheme-panel');

  }
  getElement () {
    return this.element;
  }
  destroy () {
    this.element.remove();
  }
}
