export interface BugsPlugin {
    iconPath: String;
}
export declare class BugsPluginManager {
    private plugins;
    constructor();
    addPlugin(plugin: BugsPlugin): void;
    removePlugin(plugin: BugsPlugin): void;
}
