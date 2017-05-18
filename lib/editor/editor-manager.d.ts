import { BreakpointManager, Breakpoint, Breakpoints } from './breakpoint-manager';
import { PluginManager } from '../plugin/index';
export interface EditorOptions {
    pluginManager: PluginManager;
    didAddBreakpoint?: Function;
    didRemoveBreakpoint?: Function;
    didEvaluateExpression?: Function;
    didBreak?: Function;
    didChange?: Function;
}
export declare class EditorManager {
    private currentEditor;
    private currentBreakMarker;
    private currentExpressionMarker;
    private currentEvaluationMarker;
    private currentEvaluationElement;
    private activateExpressionListerner;
    private evaluateHandler;
    breakpointManager: BreakpointManager;
    private pluginManager;
    private events;
    constructor(options: EditorOptions);
    restoreBreakpoints(breakpoints: Breakpoints): void;
    getBreakpointFromEvent(event: any): Breakpoint;
    removeBreakpointFromEvent(event: any): void;
    editBreakpointFromEvent(event: any): void;
    destroy(): void;
    breakOnFile(filePath: string, lineNumber: number): void;
    createBreakMarker(editor: any, lineNumber: number): void;
    removeMarkers(): void;
    removeBreakMarker(): void;
    removeExpressionMarker(): void;
    addFeatures(editor: any): Promise<void>;
    private removeBreakpoint(breakpoint);
    private listenBreakpoints(e, editor);
    private createBreakpointMarkerForEditor(editor, lineNumber);
    private getEditorPositionFromEvent(editor, e);
    private getEditorWordRangeFromPosition(editor, position);
    private listenExpressionEvaluations(e, editor);
    createEditorEvaluationView(editor: any, range: any): {
        insertFromResult: (result: any) => void;
    };
    createInspectorOverlay(result: any): HTMLElement;
    addEditorEvaluationMarker(editor: any, result: any, range: any): void;
    removeEvaluationMarker(): void;
}
