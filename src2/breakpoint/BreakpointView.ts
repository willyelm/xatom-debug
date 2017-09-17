'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { XAtom } from '../XAtom';
import { View, ViewElement, Action, Element } from '../View';
import { Breakpoint } from './Breakpoint';
import { stat } from 'fs';
import { join } from 'path';

@View({
  name: 'xatom-debug-breakpoint',
  template: `<div class="xatom-group-item">
    <div class="list-tree">
      <span class="xatom-debug-breakpoint name icon icon-file-text"></span>
    </div>
  </div>`
})
export class BreakpointView {
  public element: HTMLElement;
  @Element('.xatom-debug-breakpoint') itemElement: HTMLButtonElement;
  @Action('click', '.xatom-debug-breakpoint') openBreakpoint () {
    atom.workspace.open(this.data.filePath, {
      initialLine: this.data.lineNumber || 0,
      initialColumn: this.data.columnNumber || 0
    });
  }
  constructor (
    private viewElement: ViewElement,
    private data: Breakpoint) {
    this.element = this.getElement();
  }
  viewDidLoad () {
    const project = XAtom.project.getActive();
    const filePath = this.data.filePath.replace(join(project.projectPath, '/'), '');
    this.itemElement.innerHTML = `${filePath}
      ${this.data.lineNumber + 1}:${this.data.columnNumber}`;
    this.itemElement.setAttribute('data-name', this.data.filePath);
  }
  getElement () {
    return this.viewElement.element;
  }
}
