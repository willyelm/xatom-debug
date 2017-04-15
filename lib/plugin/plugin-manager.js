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
    activatePlugin(plugin) {
        this.activePlugin = plugin;
    }
    didAddPlugin(callback) {
        this.events.on('addPlugin', callback);
    }
    callOnActivePlugin(actionName, args) {
        if (this.activePlugin && this.activePlugin[actionName]) {
            this.activePlugin[actionName].apply(this.activePlugin, args || []);
        }
    }
    requestProperties(result, inspectView) {
        return this.callOnActivePlugin('didRequestProperties', [
            result,
            inspectView
        ]);
    }
    requestScopeProperties(result, inspectView) {
        return this.callOnActivePlugin('didRequestScopeProperties', [
            result,
            inspectView
        ]);
    }
    evaluateExpression(expression, range) {
        return this.callOnActivePlugin('didEvaluateExpression', [
            expression,
            range
        ]);
    }
    addBreakpoint(filePath, fileNumber, condition) {
        return this.callOnActivePlugin('didAddBreakpoint', [
            filePath,
            fileNumber,
            condition
        ]);
    }
    changeBreakpoint(filePath, fileNumber, condition) {
        return this.callOnActivePlugin('didChangeBreakpoint', [
            filePath,
            fileNumber,
            condition
        ]);
    }
    removeBreakpoint(filePath, fileNumber, condition) {
        return this.callOnActivePlugin('didRemoveBreakpoint', [
            filePath,
            fileNumber,
            condition
        ]);
    }
    run() {
        return this.callOnActivePlugin('didRun');
    }
    stop() {
        return this.callOnActivePlugin('didStop');
    }
    pause() {
        return this.callOnActivePlugin('didPause');
    }
    resume() {
        return this.callOnActivePlugin('didResume');
    }
    stepOver() {
        return this.callOnActivePlugin('didStepOver');
    }
    stepInto() {
        return this.callOnActivePlugin('didStepInto');
    }
    stepOut() {
        return this.callOnActivePlugin('didStepOut');
    }
    getPlugins() {
        return this.plugins;
    }
    addPlugin(plugin) {
        this.plugins.push(plugin);
        this.events.emit('addPlugin', plugin);
    }
    getPluginFromName(pluginName) {
        return this.plugins.find((p) => {
            return (p.name === pluginName);
        });
    }
    removePlugin(plugin) {
    }
}
//# sourceMappingURL=plugin-manager.js.map