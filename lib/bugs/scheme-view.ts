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

export class BugsSchemeView {
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
