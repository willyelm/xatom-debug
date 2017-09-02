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
import { View, ViewElement, Element, Action } from './View';
import { SCHEME_EDITOR_URI } from './SchemeEditorView';
import { parse } from 'path';
let ToolbarView = class ToolbarView {
    constructor(viewElement) {
        this.viewElement = viewElement;
        this.emitter = new Emitter();
        atom.workspace.addHeaderPanel({
            item: this.getElement(),
            visible: true
        });
    }
    // @ElementAction('change', function changeProject () {
    //   const selectedProject = this.projectElement['value'];
    //   console.log('selectedProject', selectedProject)
    // })
    clickRun() {
        this.emitter.emit('didClickRun');
    }
    clickStop() {
        this.emitter.emit('didClickStop');
    }
    clickScheme() {
        atom.workspace.toggle(SCHEME_EDITOR_URI);
    }
    changeProject() {
        const selectedProject = this.projectElement['value'];
        this.emitter.emit('didSelectProject', selectedProject);
    }
    setProjects(projects) {
        this.projectElement.innerHTML = '';
        projects.forEach((directory, index) => {
            const option = document.createElement('option');
            const name = parse(directory.path).base;
            option.value = directory.path;
            option.innerText = name;
            if (index === 0) {
                this.emitter.emit('didSelectProject', directory.path);
            }
            this.projectElement.appendChild(option);
        });
    }
    onDidRun(callback) {
        return this.emitter.on('didClickRun', callback);
    }
    onDidStop(callback) {
        return this.emitter.on('didClickStop', callback);
    }
    onDidSelectProject(callback) {
        return this.emitter.on('didSelectProject', callback);
    }
    disableControls() {
        this.projectElement.disabled = true;
        this.runElement.disabled = true;
        this.schemeElement.disabled = true;
        this.projectElement.parentNode.disabled = true;
        this.stopElement.disabled = false;
    }
    enableControls() {
        this.projectElement.disabled = false;
        this.runElement.disabled = false;
        this.schemeElement.disabled = false;
        this.projectElement.parentNode.disabled = false;
        this.stopElement.disabled = true;
    }
    setStatusLoading(value) {
        this.statusElement.classList[value ? 'add' : 'remove']('loading');
    }
    setStatusState(type) {
        const iconElement = this.statusElement.querySelector('.xatom-icon');
        iconElement.setAttribute('name', type);
    }
    setStatusText(text) {
        const textElement = this.statusElement.querySelector('.xatom-debug-status-text');
        this.statusElement.style.display = 'block';
        textElement.textContent = text;
    }
    getElement() {
        return this.viewElement.element;
    }
    viewDidLoad() {
        this.setProjects(atom.project.getDirectories());
    }
    destroy() {
        this.viewElement.element.remove();
    }
};
__decorate([
    Element('.xatom-debug-run'),
    __metadata("design:type", HTMLButtonElement)
], ToolbarView.prototype, "runElement", void 0);
__decorate([
    Element('.xatom-debug-stop'),
    __metadata("design:type", HTMLButtonElement)
], ToolbarView.prototype, "stopElement", void 0);
__decorate([
    Element('.xatom-debug-project'),
    __metadata("design:type", HTMLSelectElement)
], ToolbarView.prototype, "projectElement", void 0);
__decorate([
    Element('.xatom-debug-scheme'),
    __metadata("design:type", HTMLButtonElement)
], ToolbarView.prototype, "schemeElement", void 0);
__decorate([
    Element('.xatom-debug-status'),
    __metadata("design:type", HTMLElement)
], ToolbarView.prototype, "statusElement", void 0);
__decorate([
    Action('click', '.xatom-debug-run'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolbarView.prototype, "clickRun", null);
__decorate([
    Action('click', '.xatom-debug-stop'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolbarView.prototype, "clickStop", null);
__decorate([
    Action('click', '.xatom-debug-scheme'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolbarView.prototype, "clickScheme", null);
__decorate([
    Action('change', '.xatom-debug-project'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolbarView.prototype, "changeProject", null);
ToolbarView = __decorate([
    View({
        name: 'xatom-debug-toolbar',
        template: `<div class="btn-toolbar">
    <div class="btn-group">
      <button class="xatom-debug-run btn">
        <i class="xatom-icon" name="run"></i>
      </button>
    </div>
    <div class="btn-group">
      <button class="xatom-debug-stop btn" disabled="true">
        <i class="xatom-icon" name="stop"></i>
      </button>
    </div>
    <div class="btn-group xatom-debug-scheme-group">
      <button class="btn btn-separator btn-select">
        <select class="xatom-debug-project"></select>
        <span class="arrow"></span>
      </button>
      <button class="btn xatom-debug-scheme"> Select scheme </button>
    </div>
    <div class="btn-group">
      <div class="btn xatom-debug-status" style="display:none;">
        <i class="xatom-icon" name=""></i>
        <span class="xatom-debug-status-text"><span>
      </div>
    </div>
  </div>`
    }),
    __metadata("design:paramtypes", [ViewElement])
], ToolbarView);
export { ToolbarView };
//# sourceMappingURL=ToolbarView.js.map