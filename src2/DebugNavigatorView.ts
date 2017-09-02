'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { View, ViewElement } from './View';

export const DEBUG_NAVIGATOR_URI = 'xatom://debug-navigator';

@View({
  name: 'xatom-debug-area',
  template: `<h1>Debug Navigator</h1>`
})
export class DebugNavigatorView {
  public element: HTMLElement;
  constructor (private viewElement: ViewElement) {
    this.element = this.getElement();
  }
  getElement () {
    return this.viewElement.element;
  }
  getTitle () {
    return 'Debug Navigator';
  }
  getURI () {
    return DEBUG_NAVIGATOR_URI;
  }
  getDefaultLocation () {
    return 'right';
  }
  getAllowedLocations () {
    return ['right', 'center', 'left'];
  }
  destroy () {
    atom.workspace.hide(DEBUG_NAVIGATOR_URI);
    this.viewElement.element.remove();
  }
}
