import { DebugView, ToolbarView, EditorView } from './ui/index';
import { Breakpoint, BreakpointManager } from './BreakpointManager';
export declare class ClientConsole {
    private debugView;
    constructor(debugView: DebugView);
    log(message: string): void;
    clear(): void;
}
export declare class Client {
    private debugView;
    private toolbarView;
    private editorView;
    private breakpointManager;
    console: ClientConsole;
    constructor(debugView: DebugView, toolbarView: ToolbarView, editorView: EditorView, breakpointManager: BreakpointManager);
    stop(): void;
    run(): void;
    pause(): void;
    resume(): void;
    getBreakpoints(): Array<Breakpoint>;
    activateBreakpoint(filePath: string, lineNumber: number): void;
    showEvaluation(result: string, range: any): void;
}
