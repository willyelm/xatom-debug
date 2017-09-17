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
import { XAtom } from '../XAtom';
import { Storage } from '../storage';
const { CompositeDisposable, Emitter, Range, Disposable } = require('atom');
export class BreakpointManager {
    constructor() {
        this.emitter = new Emitter();
        this.markers = new CompositeDisposable();
        this.lineEventListener = (e) => {
            const element = e.target;
            if (element.classList.contains('line-number')) {
                const filePath = this.currentEditor.getPath();
                const lineNumber = parseInt(element.textContent, 0) - 1;
                this
                    .find(filePath, lineNumber)
                    .then((breakpoint) => {
                    if (breakpoint) {
                        this.remove(filePath, lineNumber);
                    }
                    else {
                        this.add(filePath, lineNumber);
                    }
                });
            }
        };
    }
    get() {
        const project = XAtom.project.getActive();
        if (project) {
            return Storage.breakpoint.find({
                projectId: project._id
            });
        }
        else {
            return Promise.resolve([]);
        }
    }
    restore() {
        const project = XAtom.project.getActive();
        if (this.currentEditor && project) {
            return Storage
                .breakpoint
                .find({
                projectId: project._id,
                filePath: this.currentEditor.getPath()
            })
                .then((breakpoints) => {
                breakpoints.forEach((b) => {
                    this.createMarker(this.currentEditor, b.lineNumber);
                });
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
    attachEditor(editor) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dettachEditor();
            this.markers = new CompositeDisposable();
            this.lineNumbers = yield this.getEditorLineNumbers(editor);
            this.currentEditor = editor;
            this.lineNumbers.addEventListener('click', this.lineEventListener);
            this.restore();
        });
    }
    dettachEditor() {
        this.markers.dispose();
        if (this.currentEditor && this.lineNumbers) {
            this.lineNumbers.removeEventListener('click', this.lineEventListener);
        }
    }
    static getMarkerFromLineNumber(lineNumber) {
        const range = new Range([lineNumber, 0], [lineNumber, 0]);
        const editor = atom.workspace.getCenter().getActivePaneItem();
        return editor
            .getLineNumberDecorations({
            class: 'xatom-breakpoint'
        })
            .find((d) => {
            return range.isEqual(d.getMarker().getBufferRange());
        });
    }
    add(filePath, lineNumber) {
        const project = XAtom.project.getActive();
        return Storage
            .breakpoint
            .insert({
            projectId: project._id,
            condition: '',
            filePath,
            lineNumber,
            columnNumber: 0
        })
            .then((result) => {
            if (this.currentEditor && this.currentEditor.getPath() === filePath) {
                this.createMarker(this.currentEditor, lineNumber);
                this.emitter.emit('didAdd', result);
            }
            return result;
        });
    }
    remove(filePath, lineNumber) {
        const project = XAtom.project.getActive();
        const breakpointData = {
            filePath,
            lineNumber,
            columnNumber: 0,
            condition: ''
        };
        return Storage
            .breakpoint
            .remove({
            projectId: project._id,
            filePath,
            lineNumber
        })
            .then(() => {
            this.emitter.emit('didRemove', breakpointData);
            const currentMarker = BreakpointManager.getMarkerFromLineNumber(lineNumber);
            if (currentMarker) {
                currentMarker.destroy();
            }
        });
    }
    find(filePath, lineNumber) {
        const project = XAtom.project.getActive();
        return Storage.breakpoint.findOne({
            projectId: project._id,
            filePath,
            lineNumber
        });
    }
    createMarker(editor, lineNumber) {
        let range = new Range([lineNumber, 0], [lineNumber, 0]);
        let marker = editor.markBufferRange(range);
        let decorator = editor.decorateMarker(marker, {
            type: 'line-number',
            class: 'xatom-breakpoint'
        });
        this.markers.add(new Disposable(() => marker.destroy()));
    }
    onDidAdd(cb) {
        return this.emitter.on('didAdd', cb);
    }
    onDidRemove(cb) {
        return this.emitter.on('didRemove', cb);
    }
    destroy() {
        this.emitter.dispose();
        this.markers.dispose();
    }
}
//# sourceMappingURL=BreakpointManager.js.map