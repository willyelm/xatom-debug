import { Breakpoints } from './breakpoint-manager';
import { PluginManager } from '../plugin/index';
export interface EditorOptions {
    pluginManager: PluginManager;
    didAddBreakpoint?: Function;
    didRemoveBreakpoint?: Function;
    didBreak?: Function;
    didChange?: Function;
}
export declare class EditorManager {
    private currentEditor;
    private currentBreakMarker;
    private currentExpressionMarker;
    private currentEvaluationMarker;
    private activateExpressionListerner;
    private evaluateHandler;
    private breakpointManager;
    private pluginManager;
    private events;
    constructor(options: EditorOptions);
    restoreBreakpoints(breakpoints: Breakpoints): void;
    getBreakpoints(): Breakpoints;
    getPlainBreakpoints(): Breakpoints;
    destroy(): void;
    breakOnFile(filePath: string, lineNumber: number): void;
    createBreakMarker(editor: any, lineNumber: number): void;
    removeMarkers(): void;
    removeBreakMarker(): void;
    removeExpressionMarker(): void;
    addFeatures(editor: any): Promise<void>;
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
