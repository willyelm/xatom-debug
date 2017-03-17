'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { EventEmitter } from 'events';
export class PluginManager {
    constructor() {
        this.plugins = [];
        this.events = new EventEmitter();
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