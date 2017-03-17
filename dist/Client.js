'use babel';
export class ClientConsole {
    constructor(view) {
        this.view = view;
    }
    log(message) {
        this.view.consoleCreateLine(message);
    }
    clear() {
        this.view.consoleClear();
    }
}
export class Client {
    constructor(debugView) {
        this.debugView = debugView;
        this.console = new ClientConsole(debugView);
    }
    pause(filePath, lineNumber) {
        this.debugView.togglePause(true);
        this.debugView.setPausedScript(filePath, lineNumber);
    }
    resume() {
    }
}
//# sourceMappingURL=Client.js.map