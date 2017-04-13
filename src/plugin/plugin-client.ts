'use babel'
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import {
  createGroupButtons,
  createButton,
  createIcon,
  createIconFromPath,
  createText,
  createElement,
  insertElement,
  attachEventFromObject
} from '../element/index'
import { ToolbarView, SchemeView } from '../scheme/index'
import { InspectorView } from '../inspector/index'
import { DebugAreaView, ConsoleView, CallStackFrames } from '../debug-area/index'
import { EditorManager, Breakpoints } from '../editor/index'
import { join } from 'path'
import { get } from 'lodash'

export class PluginClientConsole {
  constructor (private consoleView: ConsoleView) {}
  log (message: string): void {
    this.consoleView.createConsoleLine(message)
  }
  info (message: string): void {
    this.consoleView.createConsoleLine(message, {
      className: 'line-info'
    })
  }
  error (message: string): void {
    this.consoleView.createConsoleLine(message, {
      className: 'line-error'
    })
  }
  output (type: string, items: Array<any>) {
    let lineElement = this.consoleView.createEmptyLine({
      className: `line-${type}`
    })
    items.forEach((result) => {
      if (result.type === 'object') {
        result = [{
          value: result
        }]
      }
      let inspector = new InspectorView({
        result,
        didRequestProperties: (props, inspectorView) => {
          this.consoleView.requestProperties(props, inspectorView)
        }
      })
      insertElement(lineElement, inspector.getElement())
    })
  }
  clear (): void {
    this.consoleView.clearConsole()
  }
}

export class PluginClientStatus {
  constructor (private toolbarView: ToolbarView) {}
  startLoading () {
    this.toolbarView.setStatusLoading(true)
  }
  stopLoading () {
    this.toolbarView.setStatusLoading(false)
  }
  update (message: string): void {
    this.toolbarView.setStatus(message)
  }
  reset () {
    this.toolbarView.resetStatus()
  }
}

export interface ClientOptions {
  debugView: DebugAreaView,
  toolbarView: ToolbarView,
  consoleView: ConsoleView,
  schemeView: SchemeView,
  editorManager: EditorManager
}

export class PluginClient {
  public console: PluginClientConsole
  public status: PluginClientStatus
  private debugView: DebugAreaView
  private consoleView: ConsoleView
  private schemeView: SchemeView
  private toolbarView: ToolbarView
  private editorManager: EditorManager
  constructor (private options: ClientOptions) {
    this.debugView = options.debugView
    this.toolbarView = options.toolbarView
    this.schemeView = options.schemeView
    this.consoleView = options.consoleView
    this.editorManager = options.editorManager
    this.console = new PluginClientConsole(this.consoleView)
    this.status = new PluginClientStatus(this.toolbarView)
  }
  stop (): void {
    this.debugView.togglePause(false)
    this.toolbarView.toggleRun(true)
    this.editorManager.removeMarkers()
    this.debugView.clearCallStack()
    this.debugView.clearScope()
  }
  run (): void {
    this.toolbarView.toggleRun(false)
    this.consoleView.clearConsole()
  }
  pause (): void {
    this.debugView.togglePause(true)
    // this.debugView.setPausedScript(filePath, lineNumber)
  }
  resume (): void {
    this.debugView.togglePause(false)
    this.debugView.clearCallStack()
    this.debugView.clearScope()
  }
  getPathFromFile (file: string) {
    return join(this.toolbarView.getPathName(), file)
  }
  getPath (file: string) {
    return this.toolbarView.getPathName()
  }
  getOptions () {
    return this.schemeView.getActivePluginOptions()
  }
  getBreakpoints (): Breakpoints {
    return this.editorManager.getBreakpoints()
  }
  activateBreakpoint (filePath: string, lineNumber: number): void {
    this.editorManager.breakOnFile(filePath, lineNumber)
  }
  setCallStack (items: CallStackFrames) {
    this.debugView.insertCallStackFromFrames(items)
  }
  setScope (scope: any) {
    this.debugView.insertScope(scope)
  }
}
