'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ToolbarView, DebugView } from './ui/index';
import { PluginManager } from './PluginManager';
import { BreakpointManager } from './BreakpointManager';
import { Client } from './Client';
const { CompositeDisposable } = require('atom');
export default {
    subscriptions: null,
    breakpointManager: null,
    pluginManager: null,
    activePlugin: null,
    toolbarView: null,
    schemeView: null,
    debugView: null,
    toolbarPanel: null,
    debugPanel: null,
    createPanels() {
        this.toolbarPanel = atom.workspace.addTopPanel({
            item: this.toolbarView.getElement(),
            visible: true
        });
        this.debugPanel = atom.workspace.addTopPanel({
            item: this.debugView.getElement(),
            visible: true
        });
    },
    createManagers() {
        let client = new Client(this.debugView);
        this.breakpointManager = new BreakpointManager();
        this.pluginManager = new PluginManager();
        this.pluginManager.didAddPlugin((plugin) => {
            if (plugin.registerClient)
                plugin.registerClient(client);
            if (this.activePlugin === null) {
                this.activePlugin = plugin;
                this.toolbarView.setScheme(plugin);
            }
        });
    },
    createToolbar() {
        this.toolbarView = new ToolbarView();
        this.toolbarView.didOpenSchemeEditor(() => {
            console.log('open editor');
        });
        this.toolbarView.didRun(() => __awaiter(this, void 0, void 0, function* () {
            let editor = atom.workspace.getActiveTextEditor();
            let currentFile = editor.getPath();
            let run = yield this.activePlugin.run({
                currentFile
            });
            if (run) {
                this.toolbarView.stopButton['disabled'] = false;
                this.toolbarView.runButton['disabled'] = true;
            }
        }));
        this.toolbarView.didStop(() => __awaiter(this, void 0, void 0, function* () {
            let stop = yield this.activePlugin.stop();
            if (stop) {
                this.toolbarView.stopButton['disabled'] = true;
                this.toolbarView.runButton['disabled'] = false;
                this.debugView.togglePause(false);
            }
        }));
    },
    createDebugArea() {
        this.debugView = new DebugView();
    },
    activate(state) {
        this.createToolbar();
        this.createDebugArea();
        this.createPanels();
        this.createManagers();
        let projects = atom.project['getPaths']();
        this.toolbarView.setPaths(projects);
        atom.project.onDidChangePaths((projects) => this.toolbarView.setPaths(projects));
        atom.workspace['observeActivePaneItem']((editor) => {
            if (editor && editor.getPath && editor.editorElement) {
                this.breakpointManager.observeEditor(editor);
            }
        });
    },
    provideBugsService() {
        return this.pluginManager;
    },
    deactivate() {
        this.toolbarPanel.destroy();
        this.debugPanel.destroy();
        this.toolbarView.destroy();
        this.debugView.destroy();
    }
};
//# sourceMappingURL=main.js.map