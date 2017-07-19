import { ToolbarView, SchemeView } from './scheme/index';
import { DebugAreaView, ConsoleView } from './debug-area/index';
import { PluginManager } from './plugin/index';
import { EditorManager } from './editor/index';
import { Storage } from './storage';
export declare class XAtomDebug {
    storage: Storage;
    pluginManager: PluginManager;
    editorManager: EditorManager;
    schemeView: SchemeView;
    toolbarView: ToolbarView;
    debugView: DebugAreaView;
    consoleView: ConsoleView;
    constructor();
    getToolbarElement(): HTMLElement;
    getConsoleElement(): HTMLElement;
    getDebugAreaElement(): HTMLElement;
    destroy(): void;
}
