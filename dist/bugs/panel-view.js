'use babel';
import { createGroupButtons, createButton, createIcon, createIconFromPath, createText, createElement, insertElement } from '../element/index';
export class BugsPanelView {
    constructor() {
        this.element = document.createElement('atom-bugs-panel');
        insertElement(this.element, createIcon('logo'));
        insertElement(this.element, createButton([
            createIcon('run'),
            createText('Run')
        ]));
        insertElement(this.element, createButton([
            createIcon('stop')
        ]));
        insertElement(this.element, createGroupButtons([
            createButton({
                className: 'bugs-scheme'
            }, [
                createIcon('atom'),
                createText('atom-bugs'),
                createElement('div', {
                    className: 'bugs-scheme-arrow'
                })
            ]),
            createButton([
                createIconFromPath('atom://atom-bugs-nodejs/icons/nodejs.svg'),
                createText('Node.js')
            ])
        ]));
    }
    getElement() {
        return this.element;
    }
    destroy() {
        this.element.remove();
    }
}
//# sourceMappingURL=panel-view.js.map