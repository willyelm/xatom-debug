/// <reference types="node" />
import { EventEmitter } from 'events';
export interface Breakpoint {
    lineNumber: number;
    filePath: string;
    marker: any;
}
export declare class BreakpointManager {
    private breakpoints;
    events: EventEmitter;
    constructor();
    getBreakpoints(): Array<Breakpoint>;
    didAddBreakpoint(callback: Function): void;
    didRemoveBreakpoint(callback: Function): void;
    getHandler(editor: any): (e: any) => void;
    getBreakpoint(filePath: String, lineNumber: Number): Breakpoint;
    removeBreakpoint(breakpoint: Breakpoint): boolean;
    addBreakpoint(marker: any, lineNumber: number, filePath: string): void;
}
