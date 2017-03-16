'use babel';
export class BugsSchemeEditorView {
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
//# sourceMappingURL=BugsSchemeEditorView.js.map