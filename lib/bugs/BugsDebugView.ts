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

export class BugsDebugView {
  private element: HTMLElement;
  constructor () {
    this.element = document.createElement('atom-bugs-debug');
    this.element.innerHTML = `
      <atom-bugs-area>
        <atom-bugs-controls>
          <button class="btn btn-default"><i class="bugs-icon bugs-icon-pause"></i></button>
          <button class="btn btn-default"><i class="bugs-icon bugs-icon-step-over"></i></button>
          <button class="btn btn-default"><i class="bugs-icon bugs-icon-step-into"></i></button>
          <button class="btn btn-default"><i class="bugs-icon bugs-icon-step-out"></i></button>
        </atom-bugs-controls>
        <atom-bugs-control-group>
          <atom-bugs-control-title> Breakpoints </atom-bugs-control-title>
          <atom-bugs-control-content>
            some content
          </atom-bugs-control-content>
        </atom-bugs-control-group>
      </atom-bugs-area>
      <atom-bugs-console>
        <atom-bugs-console-line>Text Sample</atom-bugs-console-line>
        <atom-bugs-console-line>Another Sample</atom-bugs-console-line>
      </atom-bugs-console>
    `
  }
  getElement () {
    return this.element;
  }
  destroy () {
    this.element.remove();
  }
}
