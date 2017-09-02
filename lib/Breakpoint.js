'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const { CompositeDisposable, Emitter, Range, Disposable } = require('atom');
const cuid = require('cuid');
import { Storage } from './Storage';
export class BreakpointManager {
    constructor() {
        this.emitter = new Emitter();
        this.breakpoints = [];
        this.lineEventListener = (e) => {
            const element = e.target;
            if (element.classList.contains('line-number')) {
                const filePath = this.currentEditor.getPath();
                const lineNumber = parseInt(element.textContent, 0);
                const breakpoint = this.getBreakpoint(filePath, lineNumber);
                if (breakpoint) {
                    this.removeBreakpoint(filePath, lineNumber);
                }
                else {
                    this.addBreakpoint(filePath, lineNumber);
                }
            }
        };
    }
    setBreakpoints(breakpoints) {
        this.breakpoints = breakpoints;
    }
    getBreakpoints() {
        return this.breakpoints;
    }
    getEditorLineNumbers(editor) {
        return new Promise((resolve, reject) => {
            const gutters = editor.getGutters();
            const lineGutter = gutters.find((g) => g.name === 'line-number');
            if (lineGutter) {
                resolve(lineGutter.element);
            }
            else {
                reject('Unable to find line numbers');
            }
        });
    }
    attachBreakpoints(editor) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dettachBreakpoints();
            this.currentEditor = editor;
            // Listen gutter line number
            const lineNumbers = yield this.getEditorLineNumbers(editor);
            lineNumbers.addEventListener('click', this.lineEventListener);
            // Restore breakpoint markers
            const breakpoints = this.breakpoints.filter((b) => {
                return b.filePath === editor.getPath();
            });
            breakpoints.forEach((b) => {
                if (b.marker)
                    b.marker.destroy();
                b.marker = this.createMarker(editor, b.lineNumber - 1);
            });
        });
    }
    dettachBreakpoints() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentEditor) {
                const lineNumbers = yield this.getEditorLineNumbers(this.currentEditor);
                lineNumbers.removeEventListener('click', this.lineEventListener);
            }
        });
    }
    addBreakpoint(filePath, lineNumber) {
        const breakpoint = {
            filePath,
            lineNumber,
            columnNumber: 0
        };
        this.breakpoints.push(breakpoint);
        if (this.currentEditor && this.currentEditor.getPath() === filePath) {
            breakpoint.marker = this.createMarker(this.currentEditor, lineNumber - 1);
        }
        this.emitter.emit('didAddBreakpoint', breakpoint);
        Storage
            .breakpoints
            .sublevel(this.projectPath)
            .put(cuid(), {
            filePath,
            lineNumber
        }, (err, data) => {
            console.log('put', err, data);
        });
    }
    removeBreakpoint(filePath, lineNumber) {
        const breakpoint = this.getBreakpoint(filePath, lineNumber);
        const index = this.breakpoints.indexOf(breakpoint);
        if (breakpoint.marker) {
            breakpoint.marker.destroy();
        }
        if (index > -1) {
            this.emitter.emit('didRemoveBreakpoint', breakpoint);
            this.breakpoints.splice(index, 1);
        }
    }
    getBreakpoint(filePath, lineNumber) {
        return this.breakpoints.find((b) => {
            return b.filePath === filePath && b.lineNumber === lineNumber;
        });
    }
    createMarker(editor, lineNumber) {
        let range = new Range([lineNumber, 0], [lineNumber, 0]);
        let marker = editor.markBufferRange(range);
        let decorator = editor.decorateMarker(marker, {
            type: 'line-number',
            class: 'xatom-breakpoint'
        });
        return marker;
    }
    onDidAddBreakpoint(cb) {
        return this.emitter.on('didAddBreakpoint', cb);
    }
    onDidRemoveBreakpoint(cb) {
        return this.emitter.on('didRemoveBreakpoint', cb);
    }
    destroy() {
    }
}
//# sourceMappingURL=Breakpoint.js.map