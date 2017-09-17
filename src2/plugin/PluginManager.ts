'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const { CompositeDisposable, Range, Emitter, Disposable } = require('atom');
import { ToolbarView } from '../ToolbarView';
import {
  DebugControlView,
  DebugAreaView,
  DebugNavigatorView,
  DEBUG_AREA_URI,
  DEBUG_NAVIGATOR_URI
} from '../debug';
import { PluginSession, createSession } from './PluginSession';
import { Plugin } from './Plugin';

export class PluginManager {
  private emitter = new Emitter();
  private activePlugin: Plugin;
  public plugins: Array<any> = [];
  constructor (
    private toolbarView: ToolbarView,
    private debugControlView: DebugControlView,
    private debugAreaView: DebugAreaView,
    private debugNavigatorView: DebugNavigatorView) {}
  execute (functionName: string, functionArgs?: any[]) {
    const plugin = this.getActivePlugin();
    if (plugin[functionName]) {
      plugin[functionName].apply(plugin, functionArgs);
    }
  }
  setActivePlugin (plugin: Plugin): void {
    this.activePlugin = plugin;
  }
  getSession (): PluginSession {
    return createSession(
      this.toolbarView,
      this.debugControlView,
      this.debugAreaView,
      this.debugNavigatorView
    );
  }
  getActivePlugin (): Plugin {
    return this.activePlugin;
  }
  onDidChangePlugins (callback: Function) {
    return this.emitter.on('didChangePlugins', callback);
  }
  addPlugin (name: string, plugin: any) {
    const item = {
      name,
      plugin
    };
    this.plugins.push(item);
    this.activePlugin = plugin;
    this.emitter.emit('didChangePlugins', this.plugins);
  }
  removePlugin (pluginName: string) {
    const index = this.plugins.findIndex((p) => p.name === pluginName);
    if (index > -1) this.plugins.splice(index, 1);
    this.emitter.emit('didChangePlugins', this.plugins);
  }
  destroy () {
    this.plugins = [];
    this.emitter.dispose();
  }
}
