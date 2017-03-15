'use babel';
export class BugsSchemeView {
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
//# sourceMappingURL=scheme-view.js.map