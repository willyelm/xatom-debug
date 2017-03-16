import { BugsPlugin } from './BugsPlugin';
export declare class BugsPluginManager {
    private plugins;
    private events;
    constructor();
    didAddPlugin(callback: any): void;
    getPlugins(): BugsPlugin[];
    addPlugin(plugin: BugsPlugin): void;
    removePlugin(plugin: BugsPlugin): void;
}
