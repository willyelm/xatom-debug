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
const { CompositeDisposable, Range, Emitter, Disposable } = require('atom');
export class Location {
    constructor(location) {
        this.location = location;
        this.openEditor(location);
    }
    openEditor(location) {
        return __awaiter(this, void 0, void 0, function* () {
            this.editor = (yield atom.workspace.open(location.filePath, {
                initialLine: location.lineNumber || 0,
                initialColumn: location.columnNumber || 0
            }));
            this.editor
                .getGutters()
                .filter((gutter) => gutter.name !== 'line-number')
                .forEach((gutter) => {
                gutter.hide();
            });
            const range = new Range([location.lineNumber, location.columnNumber], [location.lineNumber, location.columnNumber]);
            this.lineMarker = this.editor.markBufferRange(range);
            this.lineNumberMarker = this.editor.markBufferRange(range);
            this.editor.decorateMarker(this.lineMarker, {
                type: 'line',
                class: 'xatom-debug-location'
            });
            this.editor.decorateMarker(this.lineNumberMarker, {
                type: 'line-number',
                class: 'xatom-debug-location'
            });
            atom.focus();
        });
    }
    destroy() {
        if (this.editor) {
            this.editor
                .getGutters()
                .filter((gutter) => gutter.name !== 'line-number')
                .forEach((gutter) => gutter.show());
        }
        if (this.lineMarker)
            this.lineMarker.destroy();
        if (this.lineNumberMarker)
            this.lineNumberMarker.destroy();
    }
}
//# sourceMappingURL=Location.js.map