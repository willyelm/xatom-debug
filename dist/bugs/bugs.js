'use babel';
const { TextEditor } = require('atom');
import { BugsPluginManager } from './plugin-manager';
import { BugsPanelView } from './panel-view';
export class Bugs {
    constructor() {
        this.breakpoints = [];
        this.pluginManager = new BugsPluginManager();
        this.panelView = new BugsPanelView();
    }
    getPanelViewElement() {
        return this.panelView.getElement();
    }
    destroy() {
        this.panelView.destroy();
    }
    observeEditor(editor) {
        let sourceFile = editor.getPath();
        editor.editorElement.addEventListener('click', (e) => {
            let element = e.target;
            if (element.classList.contains('line-number')) {
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
        });
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
//# sourceMappingURL=bugs.js.map