'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import {
  DebugView,
  CallStackFrames,
  ToolbarView,
  EditorView
} from './ui/index';
import { Breakpoint, BreakpointManager } from './BreakpointManager';

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
    private toolbarView: ToolbarView,
    private editorView: EditorView,
    private breakpointManager: BreakpointManager) {
    this.console = new ClientConsole(debugView);
  }
  stop (): void {
    this.debugView.togglePause(false);
    this.toolbarView.toggleRun(true);
    this.editorView.removeMarkers();
    this.debugView.consoleClear();
  }
  run (): void {
    this.toolbarView.toggleRun(false);
  }
  pause (): void {
    this.debugView.togglePause(true);
    // this.debugView.setPausedScript(filePath, lineNumber);
  }
  resume (): void {
    this.debugView.togglePause(false);
    this.debugView.callStackClear();
  }
  getBreakpoints (): Array<Breakpoint> {
    return this.breakpointManager.getBreakpoints();
  }
  activateBreakpoint (filePath: string, lineNumber: number): void {
    this.debugView.breakOnFile(filePath, lineNumber);
  }
  showCallStack (items: CallStackFrames) {
    this.debugView.insertCallStackFromFrames(items);
  }
  showEvaluation (result: any, range: any) {
    this.editorView.addEvaluationMarker(result, range);
  }
}
