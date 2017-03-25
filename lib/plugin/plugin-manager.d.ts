/// <reference types="node" />
import { EventEmitter } from 'events';
export interface Plugin {
    iconPath: string;
    name: string;
}
export declare class PluginManager {
    private plugins;
    activePlugin: Plugin;
    events: EventEmitter;
    constructor();
    activatePlugin(plugin: Plugin): void;
    didAddPlugin(callback: any): void;
    private callOnActivePlugin(actionName, args?);
    requestProperties(result: any, inspectView: any): void;
    requestScopeProperties(result: any, inspectView: any): void;
    evaluateExpression(expression: string, range: any): void;
    addBreakpoint(filePath: string, fileNumber: number): void;
    removeBreakpoint(filePath: string, fileNumber: number): void;
    run(settings: any): void;
    stop(): void;
    pause(): void;
    resume(): void;
    stepOver(): void;
    stepInto(): void;
    stepOut(): void;
    getPlugins(): Plugin[];
    addPlugin(plugin: Plugin): void;
    removePlugin(plugin: Plugin): void;
}
