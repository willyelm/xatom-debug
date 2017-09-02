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
import { View, ViewElement } from './View';
export const SCHEME_EDITOR_URI = 'xatom://scheme-editor';
let SchemeEditorView = class SchemeEditorView {
    constructor(viewElement) {
        this.viewElement = viewElement;
    }
    setPlugins(plugins) {
        console.log('add plugins', plugins);
    }
    getElement() {
        return this.viewElement.element;
    }
    getTitle() {
        return 'Scheme Editor';
    }
    getURI() {
        return SCHEME_EDITOR_URI;
    }
    getPreferredLocation() {
        return 'center';
    }
    getAllowedLocations() {
        return ['center'];
    }
    destroy() {
        atom.workspace.hide(SCHEME_EDITOR_URI);
        this.viewElement.element.remove();
    }
};
SchemeEditorView = __decorate([
    View({
        name: 'xatom-scheme-editor',
        template: `<h1>Scheme Editor</h1>`
    }),
    __metadata("design:paramtypes", [ViewElement])
], SchemeEditorView);
export { SchemeEditorView };
//# sourceMappingURL=SchemeEditorView.js.map