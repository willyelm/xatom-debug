import { ToolbarView, SchemeView } from '../scheme/index';
import { DebugAreaView, ConsoleView, CallStackFrames } from '../debug-area/index';
import { EditorManager, Breakpoints } from '../editor/index';
export declare class PluginClientConsole {
    private consoleView;
    constructor(consoleView: ConsoleView);
    log(message: string): void;
    info(message: string): void;
    clear(): void;
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
    private debugView;
    private consoleView;
    private schemeView;
    private toolbarView;
    private editorManager;
    constructor(options: ClientOptions);
    status(text: string, options?: any): void;
    stop(): void;
    run(): void;
    pause(): void;
    resume(): void;
    getPathFromFile(file: string): string;
    getOptions(): any;
    getBreakpoints(): Breakpoints;
    activateBreakpoint(filePath: string, lineNumber: number): void;
    setCallStack(items: CallStackFrames): void;
    setScope(scope: any): void;
}
