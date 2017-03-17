/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
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
    constructor(debugView) {
        this.debugView = debugView;
        this.console = new ClientConsole(debugView);
    }
    pause(filePath, lineNumber) {
        this.debugView.togglePause(true);
        this.debugView.setPausedScript(filePath, lineNumber);
        // this.debugView.;
    }
    resume() {
        // this.debugView.;
    }
}
//# sourceMappingURL=Client.js.map