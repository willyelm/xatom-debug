/// <reference types="node" />
import { EventEmitter } from 'events';
export interface Plugin {
    iconPath: String;
    name: String;
}
export declare class PluginManager {
    private plugins;
    events: EventEmitter;
    constructor();
    didAddPlugin(callback: any): void;
    getPlugins(): Plugin[];
    addPlugin(plugin: Plugin): void;
    removePlugin(plugin: Plugin): void;
}
