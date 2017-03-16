'use babel';

import { BugsPlugin } from './BugsPlugin';
import { EventEmitter }  from 'events';

export class BugsPluginManager {

  private plugins: Array<BugsPlugin>;
  private events: EventEmitter;

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

  addPlugin (plugin: BugsPlugin) {
    this.plugins.push(plugin);
    this.events.emit('addPlugin', plugin);
  }

  removePlugin (plugin: BugsPlugin) {

  }
}
