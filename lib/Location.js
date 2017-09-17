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
import { get } from 'lodash';
export class Location {
    constructor(location, type) {
        this.location = location;
        this.openEditor(location);
        this.setClassName(type);
    }
    setClassName(type) {
        let typeClass = '';
        if (type) {
            typeClass = `xatom-debug-location-${type}`;
        }
        this.className = `xatom-debug-location ${typeClass}`;
    }
    markLocation(location) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.lineDecorator)
                this.lineDecorator.destroy();
            if (this.lineNumberDecorator)
                this.lineNumberDecorator.destroy();
            if (this.lineMarker)
                this.lineMarker.destroy();
            if (this.lineNumberMarker)
                this.lineNumberMarker.destroy();
            const range = new Range([location.lineNumber, location.columnNumber], [location.lineNumber, location.columnNumber]);
            this.lineMarker = this.editor.markBufferRange(range);
            this.lineNumberMarker = this.editor.markBufferRange(range);
            this.lineDecorator = this.editor.decorateMarker(this.lineMarker, {
                type: 'line',
                class: this.className
            });
            this.lineNumberDecorator = this.editor.decorateMarker(this.lineNumberMarker, {
                type: 'line-number',
                class: this.className
            });
            atom.focus();
        });
    }
    updateDecorators() {
        this.lineDecorator.setProperties({
            type: 'line',
            class: this.className
        });
        this.lineNumberDecorator.setProperties({
            type: 'line-number',
            class: this.className
        });
    }
    openEditor(location) {
        return __awaiter(this, void 0, void 0, function* () {
            const lineRange = new Range([location.lineNumber, 0], [location.lineNumber, 0]);
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
            const decorator = this.editor
                .getLineNumberDecorations({
                class: 'xatom-breakpoint'
            })
                .find((d) => {
                return lineRange.isEqual(d.getMarker().getBufferRange());
            });
            if (decorator) {
                this.setClassName('breakpoint');
            }
            this.markLocation(location);
            this.editor.onDidAddDecoration((decoration) => {
                const className = get(decoration, 'properties.class');
                const isBreakpoint = className === 'xatom-breakpoint';
                if (isBreakpoint && lineRange.isEqual(decoration.getMarker().getBufferRange())) {
                    this.setClassName('breakpoint');
                    this.updateDecorators();
                }
            });
        });
    }
    destroy() {
        if (this.editor) {
            this
                .editor
                .getGutters()
                .filter((gutter) => gutter.name !== 'line-number')
                .forEach((gutter) => gutter.show());
        }
        if (this.lineDecorator)
            this.lineDecorator.destroy();
        if (this.lineNumberDecorator)
            this.lineNumberDecorator.destroy();
        if (this.lineMarker)
            this.lineMarker.destroy();
        if (this.lineNumberMarker)
            this.lineNumberMarker.destroy();
    }
}
//# sourceMappingURL=Location.js.map