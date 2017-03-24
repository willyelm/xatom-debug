import { ToolbarView } from './scheme/index';
import { DebugAreaView, ConsoleView } from './debug-area/index';
import { EditorManager } from './editor/index';
import { PluginManager } from './plugin/index';
import { Storage } from './scheme/storage';
export declare class Bugs {
    storage: Storage;
    pluginManager: PluginManager;
    editorManager: EditorManager;
    toolbarView: ToolbarView;
    debugView: DebugAreaView;
    consoleView: ConsoleView;
    constructor();
    getToolbarElement(): HTMLElement;
    getConsoleElement(): HTMLElement;
    getDebugAreaElement(): HTMLElement;
    destroy(): void;
}
