'use babel';

export interface BugsPlugin {
  iconPath: String,
  name: String
}

export class BugsPluginManager {
  private plugins: Array<BugsPlugin>;
  constructor (private panelView) {
    this.plugins = [];
  }
  getPlugins () {
    return this.plugins;
  }
  addPlugin (plugin: BugsPlugin) {
    this.plugins.push(plugin);
    let activeName = this.panelView.getSelectedSchemeName();
    if (plugin.name === activeName) {
      this.panelView.setScheme(plugin);
    }
  }
  removePlugin (plugin: BugsPlugin) {
    
  }
}
