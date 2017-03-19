'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { EventEmitter } from 'events';
export const pluginActions = [
    'didRun',
    'didStop',
    'didPause',
    'didResume',
    'didStepOver',
    'didStepInto',
    'didStepOut',
    'didAddBreakpoint',
    'didRemoveBreakpoint',
    'didEvaluateExpression'
];
export class PluginManager {
    constructor() {
        this.plugins = [];
        this.events = new EventEmitter();
        pluginActions.forEach((name) => {
            this[name] = function () {
                // console.log('emit', name);
                // arguments.unshift(name);
                return this.events.emit(name, arguments);
            };
            this.events.on(name, (args) => {
                if (this.activePlugin && this.activePlugin[name]) {
                    this.activePlugin[name].apply(this.activePlugin, args);
                }
            });
        });
    }
    activatePlugin(plugin) {
        this.activePlugin = plugin;
    }
    didAddPlugin(callback) {
        this.events.on('addPlugin', callback);
    }
    getPlugins() {
        return this.plugins;
    }
    addPlugin(plugin) {
        this.plugins.push(plugin);
        this.events.emit('addPlugin', plugin);
    }
    removePlugin(plugin) {
    }
}
//# sourceMappingURL=PluginManager.js.map