'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { CompositeDisposable, Emitter, Range, Disposable } = require('atom');
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
        this.restoreMarkers();
    }
    getBreakpoints() {
        return this.breakpoints;
    }
    restoreMarkers() {
        if (this.currentEditor) {
            this
                .breakpoints
                .filter((b) => b.filePath === this.currentEditor.getPath())
                .forEach((b) => {
                if (b.marker)
                    b.marker.destroy();
                b.marker = this.createMarker(this.currentEditor, b.lineNumber - 1);
            });
        }
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
            this.lineNumbers = yield this.getEditorLineNumbers(editor);
            this.currentEditor = editor;
            // Listen gutter line number
            this.lineNumbers.addEventListener('click', this.lineEventListener);
            // Restore breakpoint markers
            this.restoreMarkers();
        });
    }
    dettachBreakpoints() {
        if (this.currentEditor && this.lineNumbers) {
            this.lineNumbers.removeEventListener('click', this.lineEventListener);
        }
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
        this.storage.put({
            filePath,
            lineNumber
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
            this.storage.delete({
                filePath,
                lineNumber
            });
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