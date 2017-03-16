'use babel';
import { BugsToolbarView, BugsBreakpointManager, BugsPluginManager, BugsDebugView } from './bugs/index';
const { CompositeDisposable } = require('atom');
export default {
    subscriptions: null,
    breakpointManager: null,
    pluginManager: null,
    toolbarView: null,
    schemeView: null,
    debugView: null,
    toolbarPanel: null,
    activate(state) {
        this.toolbarView = new BugsToolbarView();
        this.debugView = new BugsDebugView();
        this.breakpointManager = new BugsBreakpointManager();
        this.pluginManager = new BugsPluginManager();
        this.toolbarPanel = atom.workspace.addTopPanel({
            item: this.toolbarView.getElement(),
            visible: true
        });
        this.debugPanel = atom.workspace.addTopPanel({
            item: this.debugView.getElement(),
            visible: true
        });
        console.log('this.debugPanel', this.debugPanel);
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
            'atom-bugs:debug': () => this.debug(),
            'atom-bugs:pause': () => this.debug(),
            'atom-bugs:stop': () => this.debug()
        }));
    },
    provideBugsService() {
        return this.pluginManager;
    },
    deactivate() {
        this.subscriptions.dispose();
        this.toolbarPanel.destroy();
        this.debugPanel.destroy();
        this.toolbarView.destroy();
        this.debugView.destroy();
    },
    debug() {
        console.log('toggle');
    }
};
//# sourceMappingURL=main.js.map