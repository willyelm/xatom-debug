'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { ToolbarView } from '../scheme/toolbar-view';
import { DebugAreaView, CallStackFrames } from '../debug-area/debug-area-view';
import { EditorManager, Breakpoints } from '../editor/index';

export class PluginClientConsole {
  constructor (private debugView: DebugAreaView) {}
  log (message: string): void {
    this.debugView.createConsoleLine(message);
  }
  clear (): void {
    this.debugView.clearConsole();
  }
}

export interface ClientOptions {
  debugView: DebugAreaView,
  toolbarView: ToolbarView,
  editorManager: EditorManager
}

export class PluginClient {
  public console: PluginClientConsole;
  private debugView: DebugAreaView;
  private toolbarView: ToolbarView;
  private editorManager: EditorManager;
  constructor (private options: ClientOptions) {
    this.debugView = options.debugView;
    this.toolbarView = options.toolbarView;
    this.editorManager = options.editorManager;
    this.console = new PluginClientConsole(this.debugView);
  }
  stop (): void {
    this.debugView.togglePause(false);
    this.toolbarView.toggleRun(true);
    this.editorManager.removeMarkers();
    this.debugView.clearConsole();
    this.debugView.clearCallStack();
    this.debugView.clearScope();
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
    this.debugView.clearCallStack();
    this.debugView.clearScope();
  }
  getBreakpoints (): Breakpoints {
    return this.editorManager.getBreakpoints();
  }
  activateBreakpoint (filePath: string, lineNumber: number): void {
    this.editorManager.breakOnFile(filePath, lineNumber);
  }
  setCallStack (items: CallStackFrames) {
    this.debugView.insertCallStackFromFrames(items);
  }
  setScope (scope: any) {
    this.debugView.insertScope(scope);
  }
}
