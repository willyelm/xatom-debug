'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

const { CompositeDisposable, Range, Emitter, Disposable } = require('atom');
import { Breakpoint, BreakpointManager } from './Breakpoint';


export class Location {
  private lineMarker: any;
  private lineNumberMarker: any;
  private editor: any;
  constructor (private location: Breakpoint) {
    this.openEditor(location);
  }
  async openEditor (location: Breakpoint) {
    this.editor = <any> await atom.workspace.open(location.filePath, {
      initialLine: location.lineNumber || 0,
      initialColumn: location.columnNumber || 0
    });
    this.editor
      .getGutters()
      .filter((gutter) => gutter.name !== 'line-number')
      .forEach((gutter) => {
        gutter.hide();
      });
    const range = new Range(
      [location.lineNumber, location.columnNumber],
      [location.lineNumber, location.columnNumber]);
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
  }
  destroy () {
    if (this.editor) {
      this.editor
        .getGutters()
        .filter((gutter) => gutter.name !== 'line-number')
        .forEach((gutter) => gutter.show());
    }
    if (this.lineMarker) this.lineMarker.destroy();
    if (this.lineNumberMarker) this.lineNumberMarker.destroy();
  }
}
