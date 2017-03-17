'use babel';
export class SchemeEditorView {
    constructor() {
        this.element = document.createElement('atom-bugs-scheme-panel');
    }
    getElement() {
        return this.element;
    }
    destroy() {
        this.element.remove();
    }
}
//# sourceMappingURL=SchemeEditorView.js.map