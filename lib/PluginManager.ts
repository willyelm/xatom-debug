'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { EventEmitter }  from 'events';

export interface Plugin {
  iconPath: String,
  name: String
}

export const pluginActions: Array<string> = [
  'didRun',
  'didStop',
  'didPause',
  'didResume',
  'didStepOver',
  'didStepInto',
  'didStepOut',
  'didAddBreakpoint',
  'didRemoveBreakpoint',
  'didEvaluateExpression',
  'didRequestProperties'
];

export class PluginManager {

  private plugins: Array<Plugin>;
  public activePlugin: Plugin;
  public events: EventEmitter;

  constructor () {
    this.plugins = [];
    this.events = new EventEmitter();
    pluginActions.forEach((name) => {
      this[name] = function () {
        // console.log('emit', name);
        // arguments.unshift(name);
        return this.events.emit(name, arguments);
      }
      this.events.on(name, (args) => {
        if (this.activePlugin && this.activePlugin[name]) {
          this.activePlugin[name].apply(this.activePlugin, args);
        }
      })
    })
  }

  activatePlugin (plugin: Plugin) {
    this.activePlugin = plugin;
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
