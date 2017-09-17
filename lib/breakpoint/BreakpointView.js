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
import { XAtom } from '../XAtom';
import { View, ViewElement, Action, Element } from '../View';
import { join } from 'path';
let BreakpointView = class BreakpointView {
    constructor(viewElement, data) {
        this.viewElement = viewElement;
        this.data = data;
        this.element = this.getElement();
    }
    openBreakpoint() {
        atom.workspace.open(this.data.filePath, {
            initialLine: this.data.lineNumber || 0,
            initialColumn: this.data.columnNumber || 0
        });
    }
    viewDidLoad() {
        const project = XAtom.project.getActive();
        const filePath = this.data.filePath.replace(join(project.projectPath, '/'), '');
        this.itemElement.innerHTML = `${filePath}
      ${this.data.lineNumber + 1}:${this.data.columnNumber}`;
        this.itemElement.setAttribute('data-name', this.data.filePath);
    }
    getElement() {
        return this.viewElement.element;
    }
};
__decorate([
    Element('.xatom-debug-breakpoint'),
    __metadata("design:type", HTMLButtonElement)
], BreakpointView.prototype, "itemElement", void 0);
__decorate([
    Action('click', '.xatom-debug-breakpoint'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BreakpointView.prototype, "openBreakpoint", null);
BreakpointView = __decorate([
    View({
        name: 'xatom-debug-breakpoint',
        template: `<div class="xatom-group-item">
    <div class="list-tree">
      <span class="xatom-debug-breakpoint name icon icon-file-text"></span>
    </div>
  </div>`
    }),
    __metadata("design:paramtypes", [ViewElement, Object])
], BreakpointView);
export { BreakpointView };
//# sourceMappingURL=BreakpointView.js.map