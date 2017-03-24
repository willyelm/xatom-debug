import { ToolbarView, SchemeEditorView } from './scheme/index';
import { DebugAreaView, ConsoleView } from './debug-area/index';
import { PluginManager } from './plugin/index';
import { EditorManager } from './editor/index';
import { Storage } from './storage';
export declare class Bugs {
    storage: Storage;
    pluginManager: PluginManager;
    editorManager: EditorManager;
    schemeEditorView: SchemeEditorView;
    schemeEditorPanel: any;
    toolbarView: ToolbarView;
    debugView: DebugAreaView;
    consoleView: ConsoleView;
    constructor();
    getToolbarElement(): HTMLElement;
    getConsoleElement(): HTMLElement;
    getDebugAreaElement(): HTMLElement;
    destroy(): void;
}
