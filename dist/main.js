'use babel';
import { BugsToolbarView, BugsBreakpointManager, BugsPluginManager } from './bugs/index';
const { CompositeDisposable } = require('atom');
export default {
    subscriptions: null,
    breakpointManager: null,
    pluginManager: null,
    toolbarView: null,
    panelView: null,
    activate(state) {
        this.toolbarView = new BugsToolbarView();
        this.breakpointManager = new BugsBreakpointManager();
        this.pluginManager = new BugsPluginManager();
        this.panelView = atom.workspace.addTopPanel({
            item: this.toolbarView.getElement(),
            visible: true
        });
        this.pluginManager.didAddPlugin((plugin) => {
            let currentPlugin = this.toolbarView.getSelectedScheme();
            if (plugin.name === currentPlugin.name) {
                this.toolbarView.setScheme(plugin);
            }
        });
        this.toolbarView.didOpenSchemeEditor(() => {
            console.log('open editor');
        });
        let projects = atom.project['getPaths']();
        this.toolbarView.setPaths(projects);
        atom.project.onDidChangePaths((projects) => this.toolbarView.setPaths(projects));
        atom.workspace['observeActivePaneItem']((editor) => {
            if (editor.getPath && editor.editorElement) {
                this.breakpointManager.observeEditor(editor);
            }
        });
        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-bugs:debug': () => this.debug()
        }));
    },
    provideBugsService() {
        return this.pluginManager;
    },
    deactivate() {
        this.subscriptions.dispose();
        this.panelView.destroy();
        this.toolbarView.destroy();
    },
    debug() {
        console.log('toggle');
    }
};
//# sourceMappingURL=main.js.map