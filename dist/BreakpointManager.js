'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
export class BreakpointManager {
    constructor() {
        this.breakpoints = [];
    }
    getHandler(editor) {
        let sourceFile = editor.getPath();
        return (e) => {
            let element = e.target;
            if (element.classList.contains('line-number')) {
                // toggle breakpoints
                let lineNumber = Number(element.textContent);
                let exists = this.getBreakpoint(sourceFile, lineNumber);
                if (exists) {
                    exists.remove();
                }
                else {
                    let range = [[lineNumber - 1, 0], [lineNumber - 1, 0]];
                    let marker = editor.markBufferRange(range);
                    let decorator = editor.decorateMarker(marker, {
                        type: 'line-number',
                        class: 'bugs-breakpoint'
                    });
                    this.addBreakpoint(marker, lineNumber, sourceFile);
                }
            }
        };
    }
    observeEditor(editor) {
        let handler = this.getHandler(editor);
        editor.editorElement.removeEventListener('click', handler);
        editor.editorElement.addEventListener('click', handler);
    }
    getBreakpoint(filePath, lineNumber) {
        let index = this.breakpoints.findIndex((item) => {
            return (item.filePath === filePath && item.lineNumber === lineNumber);
        });
        return this.breakpoints[index];
    }
    addBreakpoint(marker, lineNumber, filePath) {
        let self = this;
        let index = this.breakpoints.push({
            lineNumber,
            filePath,
            remove() {
                self.breakpoints.splice(index - 1, 1);
                marker.destroy();
            }
        });
    }
}
//# sourceMappingURL=BreakpointManager.js.map