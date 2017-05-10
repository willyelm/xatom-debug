'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { insertElement } from '../element/index';
import { InspectorView } from '../inspector/index';
import { join } from 'path';
export class PluginClientConsole {
    constructor(consoleView) {
        this.consoleView = consoleView;
    }
    log(message) {
        this.consoleView.createConsoleLine(message);
    }
    info(message) {
        this.consoleView.createConsoleLine(message, {
            className: 'line-info'
        });
    }
    error(message) {
        this.consoleView.createConsoleLine(message, {
            className: 'line-error'
        });
    }
    output(type, items) {
        let lineElement = this.consoleView.createEmptyLine({
            className: `line-${type}`
        });
        items.forEach((result) => {
            if (result.type === 'object') {
                result = [{
                        value: result
                    }];
            }
            let inspector = new InspectorView({
                result,
                didRequestProperties: (props, inspectorView) => {
                    this.consoleView.requestProperties(props, inspectorView);
                }
            });
            insertElement(lineElement, inspector.getElement());
        });
    }
    clear() {
        this.consoleView.clearConsole();
    }
}
export class PluginClientStatus {
    constructor(toolbarView) {
        this.toolbarView = toolbarView;
    }
    startLoading() {
        this.toolbarView.setStatusLoading(true);
    }
    stopLoading() {
        this.toolbarView.setStatusLoading(false);
    }
    update(message, icon) {
        this.toolbarView.setStatus(message, icon);
    }
    reset() {
        this.toolbarView.resetStatus();
    }
}
export class PluginClient {
    constructor(options) {
        this.options = options;
        this.debugView = options.debugView;
        this.toolbarView = options.toolbarView;
        this.schemeView = options.schemeView;
        this.consoleView = options.consoleView;
        this.editorManager = options.editorManager;
        this.console = new PluginClientConsole(this.consoleView);
        this.status = new PluginClientStatus(this.toolbarView);
    }
    stop() {
        this.debugView.togglePause(false);
        this.toolbarView.toggleRun(true);
        this.editorManager.removeMarkers();
        this.debugView.clearCallStack();
        this.debugView.clearScope();
    }
    run() {
        this.toolbarView.toggleRun(false);
        this.consoleView.clearConsole();
    }
    pause() {
        this.debugView.togglePause(true);
        // this.debugView.setPausedScript(filePath, lineNumber)
    }
    resume() {
        this.debugView.togglePause(false);
        this.debugView.clearCallStack();
        this.debugView.clearScope();
    }
    getPathFromFile(file) {
        return join(this.toolbarView.getPathName(), file);
    }
    getPath(file) {
        return this.toolbarView.getPathName();
    }
    getOptions() {
        return this.schemeView.getActivePluginOptions();
    }
    getBreakpoints() {
        return this.editorManager.breakpointManager.getBreakpoints();
    }
    activateBreakpoint(filePath, lineNumber) {
        this.editorManager.breakOnFile(filePath, lineNumber);
    }
    setCallStack(items) {
        this.debugView.insertCallStackFromFrames(items);
    }
    setScope(scope) {
        this.debugView.insertScope(scope);
    }
}
//# sourceMappingURL=plugin-client.js.map