/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
'use babel';

import { DebugView } from './ui/index';

export class ClientConsole {
  constructor (private debugView: DebugView) {}
  log (message: string): void {
    this.debugView.consoleCreateLine(message);
  }
  clear (): void {
    this.debugView.consoleClear();
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
