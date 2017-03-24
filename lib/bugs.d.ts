import { ToolbarView } from './scheme/index';
import { DebugAreaView } from './debug-area/debug-area-view';
import { EditorManager } from './editor/index';
import { PluginManager } from './plugin/index';
export declare class Bugs {
    pluginManager: PluginManager;
    editorManager: EditorManager;
    toolbarView: ToolbarView;
    debugView: DebugAreaView;
    constructor();
    getToolbarElement(): HTMLElement;
    getConsoleElement(): HTMLElement;
    getDebugAreaElement(): HTMLElement;
    destroy(): void;
}
