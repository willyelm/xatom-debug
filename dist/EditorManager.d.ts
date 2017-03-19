import { BreakpointManager } from './BreakpointManager';
export declare class EditorManager {
    private breakpointManager;
    private currentEditor;
    private currentBreakMarker;
    private breakpointHandler;
    private expressionHandler;
    constructor(breakpointManager: BreakpointManager);
    createBreakMarker(editor: any, lineNumber: any): void;
    removeBreakMarker(): void;
    addFeatures(editor: any): void;
    private breakpointListener(e);
    private expressionListener(e);
}
