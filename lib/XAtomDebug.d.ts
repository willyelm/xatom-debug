import { SchemeView } from './SchemeView';
import { ToolbarView } from './ToolbarView';
import { ConsoleView } from './ConsoleView';
import { DebugAreaView } from './DebugAreaView';
import { PluginManager } from './plugin';
import { EditorManager } from './editor';
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
