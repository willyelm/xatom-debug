'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { createButton, createText, createElement, insertElement, attachEventFromObject } from '../element/index';
import { EventEmitter } from 'events';
export class SchemeView {
    constructor(options) {
        this.events = new EventEmitter();
        this.element = document.createElement('atom-bugs-scheme');
        this.listElement = createElement('atom-bugs-scheme-list');
        this.editorElement = createElement('atom-bugs-scheme-editor');
        insertElement(this.element, [
            createElement('atom-bugs-scheme-content', {
                elements: [this.listElement, this.editorElement]
            }),
            createElement('atom-bugs-scheme-buttons', {
                elements: [
                    createButton({
                        click: () => this.close()
                    }, [createText('Close')])
                ]
            })
        ]);
        this.panel = atom.workspace.addModalPanel({
            item: this.element,
            visible: false
        });
        attachEventFromObject(this.events, [
            'didSelectPlugin',
            'didChange'
        ], options);
    }
    open() {
        this.panel.show();
    }
    close() {
        this.panel.hide();
    }
    addPlugin(plugin) {
        console.log('add plugin', plugin);
    }
    getElement() {
        return this.element;
    }
    destroy() {
        this.element.remove();
        this.panel.destroy();
    }
}
//# sourceMappingURL=scheme-view.js.map