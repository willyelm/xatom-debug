export interface CallStackFrame {
    name: string;
    columnNumber: number;
    lineNumber: number;
    filePath: string;
}
export declare type CallStackFrames = Array<CallStackFrame>;
export interface DebugAreaOptions {
    didPause?: Function;
    didResume?: Function;
    didStepOver?: Function;
    didStepInto?: Function;
    didStepOut?: Function;
    didBreak?: Function;
    didOpenFile?: Function;
    didRequestProperties?: Function;
}
export declare class DebugAreaView {
    private element;
    private callStackContentElement;
    private scopeContentElement;
    private breakpointContentElement;
    private resizeElement;
    private pauseButton;
    private resumeButton;
    private events;
    constructor(options?: DebugAreaOptions);
    adjustDebugArea(): void;
    resizeDebugArea(): void;
    togglePause(status: boolean): void;
    createFrameLine(frame: CallStackFrame, indicate: boolean): any;
    getBreakpointId(filePath: string, lineNumber: number): string;
    createBreakpointLine(filePath: string, lineNumber: number): void;
    removeBreakpointLine(filePath: string, lineNumber: number): void;
    clearBreakpoints(): void;
    insertCallStackFromFrames(frames: CallStackFrames): void;
    clearCallStack(): void;
    insertScope(scope: any): void;
    clearScope(): void;
    getElement(): HTMLElement;
    destroy(): void;
}
