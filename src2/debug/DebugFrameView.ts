'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { XAtom } from '../XAtom';
import { View, ViewElement, Action, Element } from '../View';
import { CallFrame } from './CallFrame';
import { stat } from 'fs';
import { join } from 'path';

@View({
  name: 'xatom-debug-frame',
  template: `<div class="xatom-group-item"></div>`
})
export class DebugFrameView {
  public element: HTMLElement;
  @Element('.xatom-group-item') itemElement: HTMLButtonElement;
  @Action('click', '.xatom-group-item') openFrame () {
    // open file
    atom.workspace.open(this.data.filePath, {
      initialLine: this.data.lineNumber || 0,
      initialColumn: this.data.columnNumber || 0
    });
  }
  constructor (
    private viewElement: ViewElement,
    private data: CallFrame) {
    this.element = this.getElement();
  }
  async viewDidLoad () {
    // if (this.data) {
    //   const fileExists = await new Promise<boolean>((resolve) => {
    //     stat(this.data.filePath, (err) => resolve(err ? false : true));
    //   });
    //   if (fileExists) {
    //     // test
    //   }
    // }
    const project = XAtom.project.getActive();
    const filePath = this.data.filePath.replace(join(project.projectPath, '/'), '');

    this.itemElement.innerHTML = `
      <div class="xatom-debug-frame-name">
        ${this.data.functionName || 'anonymous'}
      </div>
      <div class="xatom-debug-frame-location">
        <div class="xatom-debug-frame-file">${filePath}</div>
        <div class="xatom-debug-frame-position">${this.data.lineNumber + 1}:${this.data.columnNumber}</div>
      </div>`;
    // this.itemElement.setAttribute('data-name', filePath);
  }
  getElement () {
    return this.viewElement.element;
  }
}
