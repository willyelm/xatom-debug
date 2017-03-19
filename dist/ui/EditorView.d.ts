import { BreakpointManager } from '../BreakpointManager';
export declare class EditorView {
    private breakpointManager;
    private currentEditor;
    private currentBreakMarker;
    private currentExpressionMarker;
    private currentEvaluationMarker;
    private breakpointHandler;
    private expressionHandler;
    private evaluateHandler;
    private events;
    constructor(breakpointManager: BreakpointManager);
    destroy(): void;
    didEvaluateExpression(cb: Function): void;
    createBreakMarker(editor: any, lineNumber: number): void;
    removeMarkers(): void;
    removeBreakMarker(): void;
    removeExpressionMarker(): void;
    addFeatures(editor: any): void;
    private breakpointListener(e);
    private expressionListener(e);
    addEvaluationMarker(result: any, range: any): void;
    removeEvaluationMarker(): void;
}
