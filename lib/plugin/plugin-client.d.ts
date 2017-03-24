import { ToolbarView } from '../scheme/toolbar-view';
import { DebugAreaView, CallStackFrames } from '../debug-area/debug-area-view';
import { EditorManager, Breakpoints } from '../editor/index';
export declare class PluginClientConsole {
    private debugView;
    constructor(debugView: DebugAreaView);
    log(message: string): void;
    clear(): void;
}
export interface ClientOptions {
    debugView: DebugAreaView;
    toolbarView: ToolbarView;
    editorManager: EditorManager;
}
export declare class PluginClient {
    private options;
    console: PluginClientConsole;
    private debugView;
    private toolbarView;
    private editorManager;
    constructor(options: ClientOptions);
    stop(): void;
    run(): void;
    pause(): void;
    resume(): void;
    getBreakpoints(): Breakpoints;
    activateBreakpoint(filePath: string, lineNumber: number): void;
    setCallStack(items: CallStackFrames): void;
    setScope(scope: any): void;
}
