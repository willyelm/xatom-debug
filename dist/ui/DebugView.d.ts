export interface CallStackFrame {
    name: string;
    columnNumber: number;
    lineNumber: number;
    filePath: string;
}
export declare type CallStackFrames = Array<CallStackFrame>;
export declare class DebugView {
    private consoleElement;
    private debugAreaElement;
    private callStackContentElement;
    private pauseButton;
    private resumeButton;
    private events;
    constructor();
    didResume(callback: any): void;
    didPause(callback: any): void;
    didStepOver(callback: any): void;
    didStepInto(callback: any): void;
    didStepOut(callback: any): void;
    didBreak(callback: any): void;
    didOpenFile(callback: any): void;
    togglePause(status: boolean): void;
    breakOnFile(filePath: string, lineNumber: number): void;
    createFrameLine(frame: CallStackFrame, indicate: boolean): any;
    insertCallStackFromFrames(frames: CallStackFrames): void;
    callStackClear(): void;
    getDebugElement(): HTMLElement;
    consoleClear(): void;
    consoleCreateLine(entry: string, elements?: any): HTMLElement;
    getConsoleElement(): HTMLElement;
    destroy(): void;
}
