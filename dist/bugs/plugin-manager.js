'use babel';
export class BugsPluginManager {
    constructor() {
        this.plugins = [];
    }
    addPlugin(plugin) {
        console.log('adding plugin', plugin);
        this.plugins.push(plugin);
    }
    removePlugin(plugin) {
        console.log('removing plugin', plugin);
    }
}
//# sourceMappingURL=plugin-manager.js.map