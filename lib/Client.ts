'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { DebugView, ToolbarView } from './ui/index';

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
  constructor (private debugView: DebugView,
    private toolbarView: ToolbarView) {
    this.console = new ClientConsole(debugView);
  }
  stop () {
    this.debugView.togglePause(false);
    this.toolbarView.toggleRun(true);
    this.debugView.consoleClear();
  }
  pause () {
    this.debugView.togglePause(true);
    // this.debugView.setPausedScript(filePath, lineNumber);
    // this.debugView.;
  }
  resume () {
    this.debugView.togglePause(false);
  }
  break (filePath: string, lineNumber: number) {
    this.debugView.breakOnFile(filePath, lineNumber);
  }
}
