'use babel';

export interface BugsPlugin {
  iconPath: String
}

export class BugsPluginManager {
  private plugins: Array<BugsPlugin>;
  constructor () {
    this.plugins = [];
  }
  addPlugin (plugin: BugsPlugin) {
    console.log('adding plugin', plugin);
    this.plugins.push(plugin);
  }
  removePlugin (plugin: BugsPlugin) {
    console.log('removing plugin', plugin);
  }
}
