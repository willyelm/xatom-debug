/// <reference types="node" />
import { EventEmitter } from 'events';
export interface Plugin {
    iconPath: string;
    name: string;
    options: any;
}
export declare class PluginManager {
    plugins: Array<Plugin>;
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
    run(): void;
    stop(): void;
    pause(): void;
    resume(): void;
    stepOver(): void;
    stepInto(): void;
    stepOut(): void;
    getPlugins(): Plugin[];
    addPlugin(plugin: Plugin): void;
    getPluginFromName(pluginName: string): Plugin;
    removePlugin(plugin: Plugin): void;
}
