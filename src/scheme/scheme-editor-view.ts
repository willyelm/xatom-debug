'use babel'
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
} from '../element/index'

export class SchemeEditorView {
  private element: HTMLElement
  constructor () {
    this.element = document.createElement('atom-bugs-scheme-editor')
    this.element.innerHTML = '<h1> Hello World </h1>'
  }
  getElement () {
    return this.element
  }
  destroy () {
    this.element.remove()
  }
}
