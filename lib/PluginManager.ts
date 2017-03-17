'use babel';

import { EventEmitter }  from 'events';

export interface Plugin {
  iconPath: String,
  name: String
}

export class PluginManager {

  private plugins: Array<Plugin>;
  public events: EventEmitter;

  constructor () {
    this.plugins = [];
    this.events = new EventEmitter();
  }

  didAddPlugin (callback) {
    this.events.on('addPlugin', callback);
  }

  getPlugins () {
    return this.plugins;
  }

  addPlugin (plugin: Plugin) {
    this.plugins.push(plugin);
    this.events.emit('addPlugin', plugin);
  }

  removePlugin (plugin: Plugin) {

  }
}
