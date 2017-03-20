'use babel';
export class ClientConsole {
    constructor(debugView) {
        this.debugView = debugView;
    }
    log(message) {
        this.debugView.consoleCreateLine(message);
    }
    clear() {
        this.debugView.consoleClear();
    }
}
export class Client {
    constructor(debugView, toolbarView, editorView, breakpointManager) {
        this.debugView = debugView;
        this.toolbarView = toolbarView;
        this.editorView = editorView;
        this.breakpointManager = breakpointManager;
        this.console = new ClientConsole(debugView);
    }
    stop() {
        this.debugView.togglePause(false);
        this.toolbarView.toggleRun(true);
        this.editorView.removeMarkers();
        this.debugView.consoleClear();
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
        this.debugView.callStackClear();
    }
    getBreakpoints() {
        return this.breakpointManager.getBreakpoints();
    }
    activateBreakpoint(filePath, lineNumber) {
        this.debugView.breakOnFile(filePath, lineNumber);
    }
    showCallStack(items) {
        this.debugView.insertCallStackFromFrames(items);
    }
    showEvaluation(result, range) {
        this.editorView.addEvaluationMarker(result, range);
    }
}
//# sourceMappingURL=Client.js.map