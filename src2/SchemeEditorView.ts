'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { View, ViewElement } from './View';

export const SCHEME_EDITOR_URI = 'xatom://scheme-editor';

@View({
  name: 'xatom-scheme-editor',
  template: `<h1>Scheme Editor</h1>`
})
export class SchemeEditorView {
  constructor (private viewElement: ViewElement) { }
  setPlugins (plugins: any[]) {
    console.log('add plugins', plugins);
  }
  getElement () {
    return this.viewElement.element;
  }
  getTitle () {
    return 'Scheme Editor';
  }
  getURI () {
    return SCHEME_EDITOR_URI;
  }
  getPreferredLocation () {
    return 'center';
  }
  getAllowedLocations () {
    return ['center'];
  }
  destroy () {
    atom.workspace.hide(SCHEME_EDITOR_URI);
    this.viewElement.element.remove();
  }
}
