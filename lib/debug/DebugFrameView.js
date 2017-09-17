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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { XAtom } from '../XAtom';
import { View, ViewElement, Action, Element } from '../View';
import { join } from 'path';
let DebugFrameView = class DebugFrameView {
    constructor(viewElement, data) {
        this.viewElement = viewElement;
        this.data = data;
        this.element = this.getElement();
    }
    openFrame() {
        // open file
        atom.workspace.open(this.data.filePath, {
            initialLine: this.data.lineNumber || 0,
            initialColumn: this.data.columnNumber || 0
        });
    }
    viewDidLoad() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    getElement() {
        return this.viewElement.element;
    }
};
__decorate([
    Element('.xatom-group-item'),
    __metadata("design:type", HTMLButtonElement)
], DebugFrameView.prototype, "itemElement", void 0);
__decorate([
    Action('click', '.xatom-group-item'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugFrameView.prototype, "openFrame", null);
DebugFrameView = __decorate([
    View({
        name: 'xatom-debug-frame',
        template: `<div class="xatom-group-item"></div>`
    }),
    __metadata("design:paramtypes", [ViewElement, Object])
], DebugFrameView);
export { DebugFrameView };
//# sourceMappingURL=DebugFrameView.js.map