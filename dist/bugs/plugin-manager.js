'use babel';
export class BugsPluginManager {
    constructor(panelView) {
        this.panelView = panelView;
        this.plugins = [];
    }
    getPlugins() {
        return this.plugins;
    }
    addPlugin(plugin) {
        this.plugins.push(plugin);
        let activeName = this.panelView.getSelectedSchemeName();
        if (plugin.name === activeName) {
            this.panelView.setScheme(plugin);
        }
    }
    removePlugin(plugin) {
    }
}
//# sourceMappingURL=plugin-manager.js.map