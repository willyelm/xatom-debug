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
import { ToolbarView } from './scheme/index';
import { DebugAreaView, ConsoleView } from './debug-area/index';
import { EditorManager } from './editor/index';
import { PluginManager, PluginClient } from './plugin/index';
import { Storage } from './scheme/storage';
export class Bugs {
    constructor() {
        this.storage = new Storage();
        this.pluginManager = new PluginManager();
        // Create Editor Manager
        this.editorManager = new EditorManager({
            pluginManager: this.pluginManager,
            didAddBreakpoint: (filePath, lineNumber) => {
                this.debugView.createBreakpointLine(filePath, lineNumber);
            },
            didRemoveBreakpoint: (filePath, lineNumber) => {
                this.debugView.removeBreakpointLine(filePath, lineNumber);
            },
            didBreak: (filePath, lineNumber) => __awaiter(this, void 0, void 0, function* () {
                let textEditor = yield atom.workspace.open(filePath, {
                    initialLine: lineNumber - 1,
                    initialColumn: 0
                });
                this.editorManager.createBreakMarker(textEditor, lineNumber);
            }),
            didChange: () => {
                this.storage.saveObjectFromKey('breakpoints', this.editorManager.getPlainBreakpoints());
            }
        });
        // Create toolbar
        this.toolbarView = new ToolbarView({
            didRun: () => {
                let editor = atom.workspace.getActiveTextEditor();
                let currentFile = editor.getPath();
                let run = this.pluginManager.run({
                    currentFile
                });
            },
            didStop: () => {
                this.pluginManager.stop();
            },
            didOpenSchemeEditor: () => {
                console.log('open editor');
            },
            didChangePath: (pathName) => __awaiter(this, void 0, void 0, function* () {
                this.storage.setPath(pathName);
                let data = yield this.storage.read().catch(() => {
                    // no saved file found.
                });
                if (data) {
                    this.editorManager.restoreBreakpoints(data.breakpoints || []);
                }
            })
        });
        // Console View
        this.consoleView = new ConsoleView();
        // Create debug area
        this.debugView = new DebugAreaView({
            didPause: () => this.pluginManager.pause(),
            didResume: () => this.pluginManager.resume(),
            didStepOver: () => this.pluginManager.stepOver(),
            didStepInto: () => this.pluginManager.stepInto(),
            didStepOut: () => this.pluginManager.stepOut(),
            didOpenFile: (filePath, lineNumber, columnNumber) => {
                atom.workspace.open(filePath, {
                    initialLine: lineNumber - 1,
                    initialColumn: columnNumber - 1
                });
            },
            didRequestProperties: (result, inspectView) => {
                return this.pluginManager.requestProperties(result, inspectView);
            }
        });
        // Atom bugs plugin client
        let client = new PluginClient({
            debugView: this.debugView,
            consoleView: this.consoleView,
            toolbarView: this.toolbarView,
            editorManager: this.editorManager
        });
        // Add editor features
        atom.workspace['observeActivePaneItem']((editor) => {
            this.editorManager.addFeatures(editor);
        });
        // Listen plugin addition
        this.pluginManager.didAddPlugin((plugin) => {
            // Register client
            if (plugin.register)
                plugin.register(client);
            // Activate Selected Plugin
            if (!this.pluginManager.activePlugin) {
                this.pluginManager.activatePlugin(plugin);
                this.toolbarView.setScheme(plugin);
            }
        });
    }
    getToolbarElement() {
        return this.toolbarView.getElement();
    }
    getConsoleElement() {
        return this.consoleView.getElement();
    }
    getDebugAreaElement() {
        return this.debugView.getElement();
    }
    destroy() {
        // destroy all
        this.toolbarView.destroy();
        this.debugView.destroy();
    }
}
//# sourceMappingURL=bugs.js.map