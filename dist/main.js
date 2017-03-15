'use babel';
import { Bugs } from './bugs/index';
const { CompositeDisposable } = require('atom');
export default {
    subscriptions: null,
    bugs: null,
    panelView: null,
    activate(state) {
        this.bugs = new Bugs();
        this.panelView = atom.workspace.addTopPanel({
            item: this.bugs.getPanelViewElement(),
            visible: true
        });
        atom.workspace.observeTextEditors((editor) => {
            if (!editor.getPath || !editor.editorElement)
                return;
            this.bugs.observeEditor(editor);
        });
        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-bugs:debug': () => this.debug()
        }));
    },
    provideBugsService() {
        return this.bugs.pluginManager;
    },
    deactivate() {
        this.subscriptions.dispose();
        this.bugs.destroy();
    },
    debug() {
        console.log('toggle');
    }
};
//# sourceMappingURL=main.js.map