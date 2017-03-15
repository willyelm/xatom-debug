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
        console.log('workspace', atom.workspace);
        console.log('project', atom.project);
        let projects = atom.project['getPaths']();
        this.bugs.panelView.setPaths(projects);
        atom.project.onDidChangePaths((projects) => this.bugs.panelView.setPaths(projects));
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