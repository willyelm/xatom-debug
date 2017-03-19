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
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { ToolbarView, DebugView, EditorView } from './ui/index';
import { PluginManager } from './PluginManager';
import { BreakpointManager } from './BreakpointManager';
import { Client } from './Client';
const { CompositeDisposable } = require('atom');
export default {
    subscriptions: null,
    breakpointManager: null,
    pluginManager: null,
    toolbarView: null,
    debugView: null,
    editorView: null,
    schemeView: null,
    toolbarPanel: null,
    debugPanel: null,
    consolePanel: null,
    createManagers() {
        // Create manager intances
        this.breakpointManager = new BreakpointManager();
        // observe editors
        this.editorView = new EditorView(this.breakpointManager);
        this.pluginManager = new PluginManager();
        atom.workspace['observeActivePaneItem']((editor) => {
            this.editorView.addFeatures(editor);
        });
        // Atom Bugs Client
        let client = new Client(this.debugView, this.toolbarView, this.editorView, this.breakpointManager);
        // Listen plugin addition
        this.pluginManager.didAddPlugin((plugin) => {
            // Register client
            if (plugin.registerClient)
                plugin.registerClient(client);
            // Activate Selected Plugin
            if (!this.pluginManager.activePlugin) {
                this.pluginManager.activatePlugin(plugin);
                this.toolbarView.setScheme(plugin);
            }
        });
        // Evaluate Expression
        this.editorView.didEvaluateExpression((expression, range) => {
            this.pluginManager.didEvaluateExpression(expression, range);
        });
        // Add Breakpoint
        this.breakpointManager.didAddBreakpoint((filePath, fileNumber) => {
            this.pluginManager.didAddBreakpoint(filePath, fileNumber);
        });
        // Remove Breakpoint
        this.breakpointManager.didRemoveBreakpoint((filePath, fileNumber) => {
            this.pluginManager.didRemoveBreakpoint(filePath, fileNumber);
        });
    },
    createToolbar() {
        // Create Toolbar View
        this.toolbarView = new ToolbarView();
        // Open Scheme Editor
        // this.toolbarView.didOpenSchemeEditor(() => {
        //   console.log('open editor')
        // })
        this.toolbarView.didRun(() => {
            let editor = atom.workspace.getActiveTextEditor();
            let currentFile = editor.getPath();
            let run = this.pluginManager.didRun({
                currentFile
            });
        });
        this.toolbarView.didStop(() => this.pluginManager.didStop());
        // set Paths
        let projects = atom.project['getPaths']();
        this.toolbarView.setPaths(projects);
        // observe path changes
        atom.project.onDidChangePaths((projects) => this.toolbarView.setPaths(projects));
    },
    createDebugArea() {
        // Create view instances
        this.debugView = new DebugView();
        this.debugView.didPause(() => this.pluginManager.didPause());
        this.debugView.didResume(() => this.pluginManager.didResume());
        this.debugView.didStepOver(() => this.pluginManager.didStepOver());
        this.debugView.didStepInto(() => this.pluginManager.didStepInto());
        this.debugView.didStepOut(() => this.pluginManager.didStepOut());
        this.debugView.didBreak((filePath, lineNumber) => __awaiter(this, void 0, void 0, function* () {
            // /[^(?:<> \n)]+\/[a-zA-Z0-9_ \-\/\-\.\*\+]+(:[0-9:]+)?/g
            let textEditor = yield atom.workspace.open(filePath, {
                initialLine: lineNumber,
                initialColumn: 0
            });
            this.editorView.createBreakMarker(textEditor, lineNumber);
        }));
    },
    activate(state) {
        this.createToolbar();
        this.createDebugArea();
        this.createManagers();
        // Toolbar Panel
        this.toolbarPanel = atom.workspace.addTopPanel({
            item: this.toolbarView.getElement(),
            visible: true
        });
        // Console Panel
        this.consolePanel = atom.workspace.addBottomPanel({
            item: this.debugView.getConsoleElement(),
            visible: true
        });
        // Debug Area Panel
        this.debugPanel = atom.workspace.addRightPanel({
            item: this.debugView.getDebugElement(),
            visible: true
        });
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();
        // this.subscriptions.add(atom.commands.add('atom-workspace', {
        //   'atom-bugs:debug': () => this.debug()
        // }));
    },
    provideBugsService() {
        return this.pluginManager;
    },
    deactivate() {
        this.subscriptions.dispose();
        // destroy panels
        this.toolbarPanel.destroy();
        this.debugPanel.destroy();
        this.consolePanel.destroy();
        // destroys views
        this.toolbarView.destroy();
        this.debugView.destroy();
        this.editorView.destroy();
    }
};
//# sourceMappingURL=main.js.map