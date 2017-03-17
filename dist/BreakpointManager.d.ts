/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class BreakpointManager {
    private breakpoints;
    events: EventEmitter;
    constructor();
    didAddBreakpoint(callback: any): void;
    didRemoveBreakpoint(callback: any): void;
    getHandler(editor: any): (e: any) => void;
    observeEditor(editor: any): void;
    getBreakpoint(filePath: String, lineNumber: Number): any;
    addBreakpoint(marker: any, lineNumber: Number, filePath: String): void;
}
