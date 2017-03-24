import { ToolbarView } from '../scheme/toolbar-view';
import { DebugAreaView, ConsoleView, CallStackFrames } from '../debug-area/index';
import { EditorManager, Breakpoints } from '../editor/index';
export declare class PluginClientConsole {
    private consoleView;
    constructor(consoleView: ConsoleView);
    log(message: string): void;
    clear(): void;
}
export interface ClientOptions {
    debugView: DebugAreaView;
    toolbarView: ToolbarView;
    consoleView: ConsoleView;
    editorManager: EditorManager;
}
export declare class PluginClient {
    private options;
    console: PluginClientConsole;
    private debugView;
    private consoleView;
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
