import { Breakpoints } from './breakpoint-manager';
import { PluginManager } from '../plugin/index';
export interface EditorOptions {
    pluginManager: PluginManager;
    didAddBreakpoint?: Function;
    didRemoveBreakpoint?: Function;
    didBreak?: Function;
}
export declare class EditorManager {
    private currentEditor;
    private currentBreakMarker;
    private currentExpressionMarker;
    private currentEvaluationMarker;
    private activateExpressionListerner;
    private breakpointHandler;
    private expressionHandler;
    private evaluateHandler;
    private breakpointManager;
    private pluginManager;
    private events;
    constructor(options: EditorOptions);
    getBreakpoints(): Breakpoints;
    destroy(): void;
    breakOnFile(filePath: string, lineNumber: number): void;
    createBreakMarker(editor: any, lineNumber: number): void;
    removeMarkers(): void;
    removeBreakMarker(): void;
    removeExpressionMarker(): void;
    addFeatures(editor: any): void;
    private breakpointListener(e);
    private createBreakpointMarker(lineNumber);
    private getPositionFromEvent(e);
    private getWordRangeFromPosition(position);
    private expressionListener(e);
    createEvaluationView(range: any): {
        insertFromResult: (result: any) => void;
    };
    createInspectorOverlay(result: any): HTMLElement;
    addEvaluationMarker(result: any, range: any): void;
    removeEvaluationMarker(): void;
}
