'use babel';
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
    clear() {
        this.consoleView.clearConsole();
    }
}
export class PluginClient {
    constructor(options) {
        this.options = options;
        this.debugView = options.debugView;
        this.toolbarView = options.toolbarView;
        this.consoleView = options.consoleView;
        this.editorManager = options.editorManager;
        this.console = new PluginClientConsole(this.consoleView);
    }
    status(text, options) {
        this.toolbarView.setStatus(text, options);
    }
    stop() {
        this.debugView.togglePause(false);
        this.toolbarView.toggleRun(true);
        this.editorManager.removeMarkers();
        this.consoleView.clearConsole();
        this.debugView.clearCallStack();
        this.debugView.clearScope();
    }
    run() {
        this.toolbarView.toggleRun(false);
    }
    pause() {
        this.debugView.togglePause(true);
        // this.debugView.setPausedScript(filePath, lineNumber);
    }
    resume() {
        this.debugView.togglePause(false);
        this.debugView.clearCallStack();
        this.debugView.clearScope();
    }
    getBreakpoints() {
        return this.editorManager.getBreakpoints();
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