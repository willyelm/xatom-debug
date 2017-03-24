'use babel';
export class PluginClientConsole {
    constructor(debugView) {
        this.debugView = debugView;
    }
    log(message) {
        this.debugView.createConsoleLine(message);
    }
    clear() {
        this.debugView.clearConsole();
    }
}
export class PluginClient {
    constructor(options) {
        this.options = options;
        this.debugView = options.debugView;
        this.toolbarView = options.toolbarView;
        this.editorManager = options.editorManager;
        this.console = new PluginClientConsole(this.debugView);
    }
    stop() {
        this.debugView.togglePause(false);
        this.toolbarView.toggleRun(true);
        this.editorManager.removeMarkers();
        this.debugView.clearConsole();
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