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
    didEvaluateExpression?: Function;
    didOpenFrame?: Function;
}
export declare class DebugAreaView {
    private element;
    private callStackContentElement;
    private watchExpressionContentElement;
    private watchExpressionsContentElement;
    private scopeContentElement;
    private breakpointContentElement;
    private resizeElement;
    private pauseButton;
    private resumeButton;
    private events;
    private projectPath;
    private subscriptions;
    constructor(options?: DebugAreaOptions);
    adjustDebugArea(): void;
    resizeDebugArea(): void;
    togglePause(status: boolean): void;
    createFrameLine(frame: CallStackFrame, indicate: boolean): any;
    getBreakpointId(filePath: string, lineNumber: number): string;
    setWorkspace(projectPath: any): void;
    createExpressionLine(expressionText: string): void;
    createBreakpointLine(filePath: string, lineNumber: number): void;
    removeBreakpointLine(filePath: string, lineNumber: number): void;
    clearBreakpoints(): void;
    insertCallStackFromFrames(frames: CallStackFrames): void;
    clearCallStack(): void;
    insertScopeVariables(scope: any): void;
    clearScope(): void;
    getElement(): HTMLElement;
    destroy(): void;
}
