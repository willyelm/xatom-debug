'use babel';
export class EditorManager {
    constructor(breakpointManager) {
        this.breakpointManager = breakpointManager;
        this.breakpointHandler = this.breakpointListener.bind(this);
        this.expressionHandler = this.expressionListener.bind(this);
    }
    createBreakMarker(editor, lineNumber) {
        this.removeBreakMarker();
        let range = [[lineNumber - 1, 0], [lineNumber - 1, 0]];
        this.currentBreakMarker = editor.markBufferRange(range);
        editor.decorateMarker(this.currentBreakMarker, {
            type: 'line',
            class: 'bugs-break-line'
        });
    }
    removeBreakMarker() {
        if (this.currentBreakMarker) {
            this.currentBreakMarker.destroy();
        }
    }
    addFeatures(editor) {
        // Observe active editor
        atom.workspace['observeActivePaneItem']((editor) => {
            if (this.currentEditor && this.currentEditor.editorElement) {
                // remove breakpoint handler
                this.currentEditor.editorElement.removeEventListener('click', this.breakpointHandler);
                this.currentEditor.editorElement.removeEventListener('mousemove', this.expressionHandler);
                // remove expression evaluator
            }
            if (editor && editor.getPath && editor.editorElement) {
                this.currentEditor = editor;
                // add breakpoint handler
                this.currentEditor.editorElement.addEventListener('click', this.breakpointHandler);
                this.currentEditor.editorElement.addEventListener('mousemove', this.expressionHandler);
            }
        });
    }
    breakpointListener(e) {
        let element = e.target;
        if (element.classList.contains('line-number')) {
            // toggle breakpoints
            let sourceFile = this.currentEditor.getPath();
            let lineNumber = Number(element.textContent);
            let exists = this.breakpointManager.getBreakpoint(sourceFile, lineNumber);
            if (exists) {
                this.breakpointManager.removeBreakpoint(exists);
            }
            else {
                let range = [[lineNumber - 1, 0], [lineNumber - 1, 0]];
                let marker = this.currentEditor.markBufferRange(range);
                let decorator = this.currentEditor.decorateMarker(marker, {
                    type: 'line-number',
                    class: 'bugs-breakpoint'
                });
                this.breakpointManager.addBreakpoint(marker, lineNumber, sourceFile);
            }
        }
    }
    expressionListener(e) {
        let sourceFile = this.currentEditor.getPath();
        let lines = this.currentEditor.editorElement.querySelector('.lines');
        var clientX = e.clientX;
        var clientY = e.clientY;
        let clientRect = lines.getBoundingClientRect();
        let screenPosition = this.currentEditor.screenPositionForPixelPosition({
            top: (clientY - clientRect.top) + this.currentEditor.editorElement.getScrollTop(),
            left: (clientX - clientRect.left) + this.currentEditor.editorElement.getScrollLeft()
        });
        let bufferPosition = this.currentEditor.bufferPositionForScreenPosition(screenPosition);
        let prevRow = this.currentEditor.buffer.previousNonBlankRow(bufferPosition.row);
        let endRow = this.currentEditor
            .buffer
            .nextNonBlankRow(bufferPosition.row);
        let startWord = bufferPosition;
        let endWord = bufferPosition;
        this.currentEditor.scanInBufferRange(/[ \,\{\}\(\;\)\[\]]+/gm, [[prevRow, 0], bufferPosition], (s) => {
            if (s.matchText) {
                startWord = s.range.end;
            }
        });
        this.currentEditor.scanInBufferRange(/[ \,\{\}\(\.\;\)\[\]\n]+/g, [bufferPosition, [endRow, 0]], (s) => {
            if (s.matchText) {
                endWord = s.range.start;
                s.stop();
            }
        });
        let scanRange = [startWord, endWord];
        // console.log(this.currentEditor.getTextInBufferRange(scanRange));
    }
}
//# sourceMappingURL=EditorManager.js.map