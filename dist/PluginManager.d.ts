/// <reference types="node" />
import { EventEmitter } from 'events';
export interface Plugin {
    iconPath: String;
    name: String;
}
export declare const pluginActions: Array<string>;
export declare class PluginManager {
    private plugins;
    activePlugin: Plugin;
    events: EventEmitter;
    constructor();
    activatePlugin(plugin: Plugin): void;
    didAddPlugin(callback: any): void;
    getPlugins(): Plugin[];
    addPlugin(plugin: Plugin): void;
    removePlugin(plugin: Plugin): void;
}
