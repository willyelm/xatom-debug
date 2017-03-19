'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { createButton, createIcon, createText, createElement, insertElement } from '../element/index';
import { EventEmitter } from 'events';
export class DebugView {
    constructor() {
        this.events = new EventEmitter();
        this.consoleElement = createElement('atom-bugs-console');
        this.consoleElement.setAttribute('tabindex', '-1');
        this.pauseButton = createButton({
            click: () => {
                this.events.emit('didPause');
            }
        }, [createIcon('pause'), createText('Pause')]);
        this.resumeButton = createButton({
            click: () => {
                this.events.emit('didResume');
            }
        }, [createIcon('resume'), createText('Resume')]);
        this.togglePause(false);
        this.debugAreaElement = createElement('atom-bugs-area');
        insertElement(this.debugAreaElement, [
            createElement('atom-bugs-controls', {
                elements: [
                    this.pauseButton,
                    this.resumeButton,
                    createButton({
                        click: () => {
                            this.events.emit('didStepOver');
                        }
                    }, [createIcon('step-over')]),
                    createButton({
                        click: () => {
                            this.events.emit('didStepInto');
                        }
                    }, [createIcon('step-into')]),
                    createButton({
                        click: () => {
                            this.events.emit('didStepOut');
                        }
                    }, [createIcon('step-out')])
                ]
            }),
            createElement('atom-bugs-control-group', {
                elements: [
                    createElement('atom-bugs-control-title', {
                        elements: [createText('Call Stack')]
                    }),
                    createElement('atom-bugs-control-content', {
                        elements: [createText('Some Content')]
                    }),
                    createElement('atom-bugs-control-title', {
                        elements: [createText('Scope')]
                    }),
                    createElement('atom-bugs-control-content', {
                        elements: [createText('Some Content')]
                    }),
                    createElement('atom-bugs-control-title', {
                        elements: [createText('Breakpoints')]
                    }),
                    createElement('atom-bugs-control-content', {
                        elements: [createText('Some Content')]
                    })
                ]
            })
        ]);
    }
    didResume(callback) {
        this.events.on('didResume', callback);
    }
    didPause(callback) {
        this.events.on('didPause', callback);
    }
    didStepOver(callback) {
        this.events.on('didStepOver', callback);
    }
    didStepInto(callback) {
        this.events.on('didStepInto', callback);
    }
    didStepOut(callback) {
        this.events.on('didStepOut', callback);
    }
    didBreak(callback) {
        this.events.on('didBreak', callback);
    }
    togglePause(status) {
        this.resumeButton.style.display = status ? null : 'none';
        this.pauseButton.style.display = status ? 'none' : null;
    }
    // setPausedScript (filePath: string, lineNumber: number) {
    //   this.consoleCreateLine('', [
    //     createText('Pause on'),
    //     createText(`${filePath}:${lineNumber}`)
    //   ])
    // }
    breakOnFile(filePath, lineNumber) {
        this.consoleCreateLine('', [
            createText('Break on'),
            createText(`${filePath}:${lineNumber}`)
        ]);
        this.events.emit('didBreak', filePath, lineNumber);
    }
    consoleClear() {
        this.consoleElement.innerHTML = '';
    }
    consoleCreateLine(entry, elements) {
        let line = createElement('atom-bugs-console-line');
        if (entry && entry.length > 0) {
            line.innerHTML = entry;
        }
        if (elements) {
            insertElement(line, elements);
        }
        setTimeout(() => {
            this.consoleElement.scrollTop = this.consoleElement.scrollHeight;
        }, 250);
        return insertElement(this.consoleElement, line);
    }
    getConsoleElement() {
        return this.consoleElement;
    }
    getDebugElement() {
        return this.debugAreaElement;
    }
    destroy() {
        this.consoleElement.remove();
        this.debugAreaElement.remove();
    }
}
//# sourceMappingURL=DebugView.js.map