export declare class BreakpointManager {
    private breakpoints;
    constructor();
    getHandler(editor: any): (e: any) => void;
    observeEditor(editor: any): void;
    getBreakpoint(filePath: String, lineNumber: Number): any;
    addBreakpoint(marker: any, lineNumber: Number, filePath: String): void;
}
