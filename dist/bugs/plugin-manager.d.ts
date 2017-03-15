export interface BugsPlugin {
    iconPath: String;
    name: String;
}
export declare class BugsPluginManager {
    private panelView;
    private plugins;
    constructor(panelView: any);
    getPlugins(): BugsPlugin[];
    addPlugin(plugin: BugsPlugin): void;
    removePlugin(plugin: BugsPlugin): void;
}
