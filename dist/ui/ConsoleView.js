'use babel';
import { createElement } from '../element/index';
export class ConsoleView {
    constructor() {
        this.element = createElement('atom-bugs-console');
        this.element.setAttribute('tabindex', '-1');
    }
    getElement() {
        return this.element;
    }
}
//# sourceMappingURL=ConsoleView.js.map