'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const { CompositeDisposable, Emitter, Disposable } = require('atom');
import { View, Action, Element, ViewElement } from '../View';
import { DEBUG_AREA_URI } from './DebugAreaView';

@View({
  name: 'xatom-debug-control',
  template: `<div class="btn-toolbar">
    <div class="btn-group">
      <button class="xatom-debug-collapse btn">
        <i class="xatom-icon" name="collapse-in"></i>
      </button>
    </div>
    <div class="btn-group">
      <button class="xatom-debug-state btn">
        <i class="xatom-icon" name="pause"></i>
      </button>
    </div>
    <div class="btn-group">
      <button class="xatom-debug-step-over btn" disabled="true">
        <i class="xatom-icon" name="step-over"></i>
      </button>
    </div>
    <div class="btn-group">
      <button class="xatom-debug-step-into btn" disabled="true">
        <i class="xatom-icon" name="step-into"></i>
      </button>
    </div>
    <div class="btn-group">
      <button class="xatom-debug-step-out btn" disabled="true">
        <i class="xatom-icon" name="step-out"></i>
      </button>
    </div>
    <div class="btn-group">
      <div class="checkbox">
        <label>
          <input type="checkbox" class="xatom-debug-pause-exception input-checkbox">
          <div class="checkbox-text"> Pause on exception </div>
        </label>
      </div>
    </div>
    <div class="btn-group">
      <div class="checkbox">
        <label>
          <input type="checkbox" class="xatom-debug-disable-breakpoints input-checkbox">
          <div class="checkbox-text"> Disable breakpoints </div>
        </label>
      </div>
    </div>
  </div>`
})
export class DebugControlView {
  private panel: any;
  private subscriptions = new CompositeDisposable();
  public emitter = new Emitter();
  constructor (private viewElement: ViewElement) {
    this.panel = atom.workspace.addBottomPanel({
      item: this.getElement(),
      visible: false
    });
  }
  @Element('.xatom-debug-state') stateElement: HTMLButtonElement;
  @Element('.xatom-debug-state .xatom-icon') stateIconElement: HTMLElement;
  @Element('.xatom-debug-pause-exception') pauseExceptionElement: HTMLInputElement;
  @Element('.xatom-debug-disable-breakpoints') breakpointDisabledElement: HTMLInputElement;
  @Element('.xatom-debug-step-over') stepOverElement: HTMLButtonElement;
  @Element('.xatom-debug-step-into') stepIntoElement: HTMLButtonElement;
  @Element('.xatom-debug-step-out') stepOutElement: HTMLButtonElement;
  @Action('click', '.xatom-debug-collapse') collapse () {
    atom.workspace.toggle(DEBUG_AREA_URI);
  }
  @Action('click', '.xatom-debug-state') continue () {
    const type = this.stateIconElement.getAttribute('name');
    if (type === 'continue') {
      this.emitter.emit('didContinue');
    } else {
      this.emitter.emit('didPause');
    }
  }
  @Action('click', '.xatom-debug-step-over') stepOver () {
    this.emitter.emit('didStepOver');
  }
  @Action('click', '.xatom-debug-step-into') stepInto () {
    this.emitter.emit('didStepInto');
  }
  @Action('click', '.xatom-debug-step-out') stepOut () {
    this.emitter.emit('didStepOut');
  }
  onDidContinue (cb) {
    return this.emitter.on('didContinue', cb);
  }
  onDidPause (cb) {
    return this.emitter.on('didPause', cb);
  }
  onDidStepOver (cb) {
    return this.emitter.on('didStepOver', cb);
  }
  onDidStepInto (cb) {
    return this.emitter.on('didStepInto', cb);
  }
  onDidStepOut (cb) {
    return this.emitter.on('didStepOut', cb);
  }
  isPauseOnExceptionEnabled (): boolean {
    return this.pauseExceptionElement.checked;
  }
  isBreakpointsDisabled (): boolean {
    return this.breakpointDisabledElement.checked;
  }
  enableControls () {
    this.stateIconElement.setAttribute('name', 'continue');
    this.stepOverElement.disabled = false;
    this.stepIntoElement.disabled = false;
    this.stepOutElement.disabled = false;
  }
  disableControls () {
    this.stateIconElement.setAttribute('name', 'pause');
    this.stepOverElement.disabled = true;
    this.stepIntoElement.disabled = true;
    this.stepOutElement.disabled = true;
  }
  getElement () {
    return this.viewElement.element;
  }
  hide () {
    this.panel.hide();
  }
  show () {
    this.panel.show();
  }
  viewDidLoad () {
    this.subscriptions.add(
      atom.tooltips.add(this.stateElement, {
        title: () => {
          const type = this.stateIconElement.getAttribute('name');
          return type === 'continue' ? 'Resume Execution' : 'Pause Execution';
        }
      }),
      atom.tooltips.add(this.stepOverElement, { title: 'Step Over' }),
      atom.tooltips.add(this.stepIntoElement, { title: 'Step Into' }),
      atom.tooltips.add(this.stepOutElement, { title: 'Step Out' })
    );
  }
  destroy () {
    this.hide();
    this.viewElement.element.remove();
    this.subscriptions.dispose();
  }
}
