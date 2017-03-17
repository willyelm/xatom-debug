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
    constructor(debugView, toolbarView) {
        this.debugView = debugView;
        this.toolbarView = toolbarView;
        this.console = new ClientConsole(debugView);
    }
    stop() {
        this.debugView.togglePause(false);
        this.toolbarView.toggleRun(true);
        this.debugView.consoleClear();
    }
    pause() {
        this.debugView.togglePause(true);
        // this.debugView.setPausedScript(filePath, lineNumber);
        // this.debugView.;
    }
    resume() {
        this.debugView.togglePause(false);
    }
    break(filePath, lineNumber) {
        this.debugView.breakOnFile(filePath, lineNumber);
    }
}
//# sourceMappingURL=Client.js.map