'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { createButton, createText, createElement, insertElement, attachEventFromObject } from '../element/index';
import { EventEmitter } from 'events';
export class ConsoleView {
    constructor(options) {
        this.events = new EventEmitter();
        this.outputElement = createElement('xatom-debug-console-output');
        this.element = createElement('xatom-debug-console', {
            elements: [
                createElement('xatom-debug-controls', {
                    elements: [
                        createButton({}, createText('Console'))
                    ]
                }),
                this.outputElement
            ]
        });
        this.element.setAttribute('tabindex', '-1');
        attachEventFromObject(this.events, [
            'didRequestProperties'
        ], options);
    }
    clearConsole() {
        this.outputElement.innerHTML = '';
    }
    requestProperties(result, inspectorView) {
        this.events.emit('didRequestProperties', result, inspectorView);
    }
    createEmptyLine(options) {
        let line = createElement('xatom-debug-console-line', options);
        insertElement(this.outputElement, line);
        return line;
    }
    createConsoleLine(entry, options) {
        let line = createElement('xatom-debug-console-line', options);
        if (entry && entry.length > 0) {
            line.innerHTML = entry;
        }
        setTimeout(() => {
            this.outputElement.scrollTop = this.outputElement.scrollHeight;
        }, 250);
        return insertElement(this.outputElement, line);
    }
    getElement() {
        return this.element;
    }
    destroy() {
        this.element.remove();
    }
}
//# sourceMappingURL=console-view.js.map