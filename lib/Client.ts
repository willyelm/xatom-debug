'use babel';

import { DebugView } from './ui/index';

export class ClientConsole {
  constructor (private view: DebugView) {}
  log (message: string): void {
    this.view.consoleCreateLine(message);
  }
  clear (): void {
    this.view.consoleClear();
  }
}

export class Client {
  public console: ClientConsole;
  constructor (private debugView: DebugView) {
    this.console = new ClientConsole(debugView);
  }
  pause (filePath: string, lineNumber: number) {
    this.debugView.togglePause(true);
    this.debugView.setPausedScript(filePath, lineNumber);
    // this.debugView.;
  }
  resume () {
    // this.debugView.;
  }
}
