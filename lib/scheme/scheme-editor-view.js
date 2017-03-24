'use babel';
export class SchemeView {
    constructor() {
        this.element = document.createElement('atom-bugs-scheme-editor');
        this.element.innerHTML = '<h1> Hello World </h1>';
    }
    createEditorForPlugin(plugin) {
    }
    getElement() {
        return this.element;
    }
    destroy() {
        this.element.remove();
    }
}
//# sourceMappingURL=scheme-editor-view.js.map