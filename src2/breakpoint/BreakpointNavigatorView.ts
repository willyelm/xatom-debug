'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

const { CompositeDisposable, Disposable } = require('atom');
import { XAtom } from '../XAtom';
import { View, ViewElement } from '../View';
import { Project } from '../Project';
import { GroupView } from '../GroupView';
import { Breakpoint } from './Breakpoint';
import { BreakpointView } from './BreakpointView';

export const BREAKPOINT_NAVIGATOR_URI = 'xatom://breakpoint-navigator';

@View({
  name: 'xatom-breakpoint-navigator'
})
export class BreakpointNavigatorView {
  public element: HTMLElement;
  private subscriptions: any;
  private breakpointGroupView: GroupView;
  constructor (private viewElement: ViewElement) {
    this.breakpointGroupView = new GroupView(null, {
      title: '&nbsp;',
      actions: {
        'Remove All': () => this.removeAll()
      }
    });
    this.element = this.getElement();
    this.element.appendChild(this.breakpointGroupView.getElement());
    this.setCurrentBreakpoints();
    this.subscriptions = new CompositeDisposable(
      XAtom.project.onDidChange(() => this.setCurrentBreakpoints()),
      XAtom.breakpoints.onDidAdd((b: Breakpoint) => this.addBreakpoint(b)),
      XAtom.breakpoints.onDidRemove((b: Breakpoint) => this.removeBreakpoint(b))
    );
  }
  addBreakpoint (breakpoint: Breakpoint) {
    const item = new BreakpointView(null, breakpoint);
    this.breakpointGroupView.addItem(item.getElement(), {
      filePath: breakpoint.filePath,
      lineNumber: breakpoint.lineNumber
    });
  }
  removeBreakpoint (breakpoint: Breakpoint) {
    this.breakpointGroupView.removeItem({
      filePath: breakpoint.filePath,
      lineNumber: breakpoint.lineNumber
    });
  }
  async removeAll () {
    const breakpoints = await XAtom.breakpoints.get();
    breakpoints.forEach((b) => XAtom.breakpoints.remove(b.filePath, b.lineNumber));
  }
  async setCurrentBreakpoints () {
    this.breakpointGroupView.removeItems();
    const breakpoints = await XAtom.breakpoints.get();
    breakpoints.forEach((b) => this.addBreakpoint(b));
  }
  getElement () {
    return this.viewElement.element;
  }
  getTitle () {
    return 'Breakpoints';
  }
  getURI () {
    return BREAKPOINT_NAVIGATOR_URI;
  }
  serialize() {
    return {
      deserializer: 'XAtom/BreakpointNavigatorView'
    };
  }
  getDefaultLocation () {
    return 'right';
  }
  getAllowedLocations () {
    return ['right', 'center', 'left'];
  }
  destroy () {
    atom.workspace.hide(BREAKPOINT_NAVIGATOR_URI);
    this.viewElement.element.remove();
    this.subscriptions.dispose();
  }
}
