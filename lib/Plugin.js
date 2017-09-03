'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const { CompositeDisposable, Range, Emitter, Disposable } = require('atom');
import { createSession } from './Session';
export class PluginManager {
    constructor(toolbarView, debugControlView, debugAreaView, debugNavigatorView, breakpointManager) {
        this.toolbarView = toolbarView;
        this.debugControlView = debugControlView;
        this.debugAreaView = debugAreaView;
        this.debugNavigatorView = debugNavigatorView;
        this.breakpointManager = breakpointManager;
        this.emitter = new Emitter();
        this.plugins = [];
    }
    execute(functionName, functionArgs) {
        const plugin = this.getActivePlugin();
        if (plugin[functionName]) {
            plugin[functionName].apply(plugin, functionArgs);
        }
    }
    setActivePlugin(plugin) {
        this.activePlugin = plugin;
    }
    getSession() {
        return createSession(this.toolbarView, this.debugControlView, this.debugAreaView, this.debugNavigatorView, this.breakpointManager);
    }
    getActivePlugin() {
        return this.activePlugin;
    }
    onDidChangePlugins(callback) {
        return this.emitter.on('didChangePlugins', callback);
    }
    addPlugin(name, plugin) {
        const item = {
            name,
            plugin
        };
        this.plugins.push(item);
        this.activePlugin = plugin;
        this.emitter.emit('didChangePlugins', this.plugins);
    }
    removePlugin(pluginName) {
        const index = this.plugins.findIndex((p) => p.name === pluginName);
        if (index > -1)
            this.plugins.splice(index, 1);
        this.emitter.emit('didChangePlugins', this.plugins);
    }
    destroy() {
    }
}
//# sourceMappingURL=Plugin.js.map