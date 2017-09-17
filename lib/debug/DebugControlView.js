'use babel';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const { CompositeDisposable, Emitter, Disposable } = require('atom');
import { View, Action, Element, ViewElement } from '../View';
import { DEBUG_AREA_URI } from './DebugAreaView';
let DebugControlView = class DebugControlView {
    constructor(viewElement) {
        this.viewElement = viewElement;
        this.subscriptions = new CompositeDisposable();
        this.emitter = new Emitter();
        this.panel = atom.workspace.addBottomPanel({
            item: this.getElement(),
            visible: false
        });
    }
    collapse() {
        atom.workspace.toggle(DEBUG_AREA_URI);
    }
    continue() {
        const type = this.stateIconElement.getAttribute('name');
        if (type === 'continue') {
            this.emitter.emit('didContinue');
        }
        else {
            this.emitter.emit('didPause');
        }
    }
    stepOver() {
        this.emitter.emit('didStepOver');
    }
    stepInto() {
        this.emitter.emit('didStepInto');
    }
    stepOut() {
        this.emitter.emit('didStepOut');
    }
    onDidContinue(cb) {
        return this.emitter.on('didContinue', cb);
    }
    onDidPause(cb) {
        return this.emitter.on('didPause', cb);
    }
    onDidStepOver(cb) {
        return this.emitter.on('didStepOver', cb);
    }
    onDidStepInto(cb) {
        return this.emitter.on('didStepInto', cb);
    }
    onDidStepOut(cb) {
        return this.emitter.on('didStepOut', cb);
    }
    isPauseOnExceptionEnabled() {
        return this.pauseExceptionElement.checked;
    }
    isBreakpointsDisabled() {
        return this.breakpointDisabledElement.checked;
    }
    enableControls() {
        this.stateIconElement.setAttribute('name', 'continue');
        this.stepOverElement.disabled = false;
        this.stepIntoElement.disabled = false;
        this.stepOutElement.disabled = false;
    }
    disableControls() {
        this.stateIconElement.setAttribute('name', 'pause');
        this.stepOverElement.disabled = true;
        this.stepIntoElement.disabled = true;
        this.stepOutElement.disabled = true;
    }
    getElement() {
        return this.viewElement.element;
    }
    hide() {
        this.panel.hide();
    }
    show() {
        this.panel.show();
    }
    viewDidLoad() {
        this.subscriptions.add(atom.tooltips.add(this.stateElement, {
            title: () => {
                const type = this.stateIconElement.getAttribute('name');
                return type === 'continue' ? 'Resume Execution' : 'Pause Execution';
            }
        }), atom.tooltips.add(this.stepOverElement, { title: 'Step Over' }), atom.tooltips.add(this.stepIntoElement, { title: 'Step Into' }), atom.tooltips.add(this.stepOutElement, { title: 'Step Out' }));
    }
    destroy() {
        this.hide();
        this.viewElement.element.remove();
        this.subscriptions.dispose();
    }
};
__decorate([
    Element('.xatom-debug-state'),
    __metadata("design:type", HTMLButtonElement)
], DebugControlView.prototype, "stateElement", void 0);
__decorate([
    Element('.xatom-debug-state .xatom-icon'),
    __metadata("design:type", HTMLElement)
], DebugControlView.prototype, "stateIconElement", void 0);
__decorate([
    Element('.xatom-debug-pause-exception'),
    __metadata("design:type", HTMLInputElement)
], DebugControlView.prototype, "pauseExceptionElement", void 0);
__decorate([
    Element('.xatom-debug-disable-breakpoints'),
    __metadata("design:type", HTMLInputElement)
], DebugControlView.prototype, "breakpointDisabledElement", void 0);
__decorate([
    Element('.xatom-debug-step-over'),
    __metadata("design:type", HTMLButtonElement)
], DebugControlView.prototype, "stepOverElement", void 0);
__decorate([
    Element('.xatom-debug-step-into'),
    __metadata("design:type", HTMLButtonElement)
], DebugControlView.prototype, "stepIntoElement", void 0);
__decorate([
    Element('.xatom-debug-step-out'),
    __metadata("design:type", HTMLButtonElement)
], DebugControlView.prototype, "stepOutElement", void 0);
__decorate([
    Action('click', '.xatom-debug-collapse'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugControlView.prototype, "collapse", null);
__decorate([
    Action('click', '.xatom-debug-state'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugControlView.prototype, "continue", null);
__decorate([
    Action('click', '.xatom-debug-step-over'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugControlView.prototype, "stepOver", null);
__decorate([
    Action('click', '.xatom-debug-step-into'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugControlView.prototype, "stepInto", null);
__decorate([
    Action('click', '.xatom-debug-step-out'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugControlView.prototype, "stepOut", null);
DebugControlView = __decorate([
    View({
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
    }),
    __metadata("design:paramtypes", [ViewElement])
], DebugControlView);
export { DebugControlView };
//# sourceMappingURL=DebugControlView.js.map