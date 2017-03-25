'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { EventEmitter }  from 'events';

export interface Plugin {
  iconPath: string,
  name: string,
  options: any
}

export class PluginManager {

  private plugins: Array<Plugin>;
  public activePlugin: Plugin;
  public events: EventEmitter;

  constructor () {
    this.plugins = [];
    this.events = new EventEmitter();
  }

  activatePlugin (plugin: Plugin) {
    this.activePlugin = plugin;
  }

  public didAddPlugin (callback) {
    this.events.on('addPlugin', callback);
  }

  private callOnActivePlugin (actionName, args?) {
    if (this.activePlugin && this.activePlugin[actionName]) {
      this.activePlugin[actionName].apply(this.activePlugin, args || []);
    }
  }

  public requestProperties (result, inspectView) {
    return this.callOnActivePlugin('didRequestProperties', [
      result,
      inspectView]);
  }

  public requestScopeProperties (result, inspectView) {
    return this.callOnActivePlugin('didRequestScopeProperties', [
      result,
      inspectView]);
  }

  public evaluateExpression (expression: string, range) {
    return this.callOnActivePlugin('didEvaluateExpression', [
      expression,
      range]);
  }

  public addBreakpoint (filePath: string, fileNumber: number) {
    return this.callOnActivePlugin('didAddBreakpoint', [
      filePath,
      fileNumber]);
  }

  public removeBreakpoint (filePath: string, fileNumber: number) {
    return this.callOnActivePlugin('didRemoveBreakpoint', [
      filePath,
      fileNumber]);
  }

  public run (settings: any) {
    return this.callOnActivePlugin('didRun', [settings]);
  }

  public stop () {
    return this.callOnActivePlugin('didStop');
  }

  public pause () {
    return this.callOnActivePlugin('didPause');
  }

  public resume () {
    return this.callOnActivePlugin('didResume');
  }

  public stepOver () {
    return this.callOnActivePlugin('didStepOver');
  }

  public stepInto () {
    return this.callOnActivePlugin('didStepInto');
  }

  public stepOut () {
    return this.callOnActivePlugin('didStepOut');
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
