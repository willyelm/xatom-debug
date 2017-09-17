'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { View, ViewElement } from '../View';
import { GroupView } from '../GroupView';
import { DebugFrameView } from './DebugFrameView';
import { CallFrames, CallFrame } from './CallFrame';

export const DEBUG_NAVIGATOR_URI = 'xatom://debug-navigator';

@View({
  name: 'xatom-debug-navigator'
})
export class DebugNavigatorView {
  public element: HTMLElement;
  public frameGroupView: GroupView;
  public watchGroupView: GroupView;
  public variableGroupView: GroupView;
  constructor (private viewElement: ViewElement) {
    this.element = this.getElement();
    // Variables
    this.variableGroupView = new GroupView(null, {
      title: 'Variables'
    });
    this.element.appendChild(this.variableGroupView.getElement());
    // Watch
    this.watchGroupView = new GroupView(null, {
      title: 'Watch'
    });
    this.element.appendChild(this.watchGroupView.getElement());
    // Call Frames
    this.frameGroupView = new GroupView(null, {
      title: 'Call Frames',
      selectable: true
    });
    this.element.appendChild(this.frameGroupView.getElement());
  }
  // Variables
  addVariable (variable: any) {

  }
  setVariables (variables: any) {
    this.clearVariables();
    variables.forEach((variable) => this.addVariable(variable));
  }
  clearVariables () {
    this.variableGroupView.removeItems();
  }
  // Watch
  addWatchVariable (expression: string) {
    //
  }
  // Frames
  addFrame (frame: CallFrame) {
    const item = new DebugFrameView(null, frame);
    return this.frameGroupView.addItem(item.getElement(), frame);
  }
  setFrames (frames: CallFrames) {
    this.clearFrames();
    frames.forEach((frame, index) => {
      const groupItem = this.addFrame(frame);
      if (index === 0) {
        this.frameGroupView.activate(groupItem);
      }
    });
  }
  clearFrames () {
    this.frameGroupView.removeItems();
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
