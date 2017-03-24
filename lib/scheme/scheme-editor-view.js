'use babel';
export class SchemeEditorView {
    constructor() {
        this.element = document.createElement('atom-bugs-scheme-editor');
        this.element.innerHTML = '<h1> Hello World </h1>';
    }
    getElement() {
        return this.element;
    }
    destroy() {
        this.element.remove();
    }
}
//# sourceMappingURL=scheme-editor-view.js.map