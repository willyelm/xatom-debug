import { ToolbarView, SchemeView } from '../scheme/index';
import { DebugAreaView, ConsoleView, CallStackFrames } from '../debug-area/index';
import { EditorManager, Breakpoints } from '../editor/index';
export declare class PluginClientConsole {
    private consoleView;
    constructor(consoleView: ConsoleView);
    log(message: string): void;
    info(message: string): void;
    error(message: string): void;
    output(type: string, items: Array<any>): void;
    clear(): void;
}
export declare class PluginClientStatus {
    private toolbarView;
    constructor(toolbarView: ToolbarView);
    startLoading(): void;
    stopLoading(): void;
    update(message: string): void;
    reset(): void;
}
export interface ClientOptions {
    debugView: DebugAreaView;
    toolbarView: ToolbarView;
    consoleView: ConsoleView;
    schemeView: SchemeView;
    editorManager: EditorManager;
}
export declare class PluginClient {
    private options;
    console: PluginClientConsole;
    status: PluginClientStatus;
    private debugView;
    private consoleView;
    private schemeView;
    private toolbarView;
    private editorManager;
    constructor(options: ClientOptions);
    stop(): void;
    run(): void;
    pause(): void;
    resume(): void;
    getPathFromFile(file: string): string;
    getPath(file: string): string;
    getOptions(): Promise<Object>;
    getBreakpoints(): Breakpoints;
    activateBreakpoint(filePath: string, lineNumber: number): void;
    setCallStack(items: CallStackFrames): void;
    setScope(scope: any): void;
}
