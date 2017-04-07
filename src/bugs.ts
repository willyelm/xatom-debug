'use babel'
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { ToolbarView, SchemeView } from './scheme/index'
import { DebugAreaView, ConsoleView } from './debug-area/index'
import { PluginManager, PluginClient } from './plugin/index'
import { EditorManager } from './editor/index'
import { Storage }  from './storage'

export class Bugs {
  public storage: Storage = new Storage()
  public pluginManager: PluginManager = new PluginManager()
  public editorManager: EditorManager
  public schemeView: SchemeView
  public toolbarView: ToolbarView
  public debugView: DebugAreaView
  public consoleView: ConsoleView
  constructor () {
    // Create Editor Manager
    this.editorManager = new EditorManager({
      pluginManager: this.pluginManager,
      didAddBreakpoint: (filePath, lineNumber) => {
        this.debugView.createBreakpointLine(filePath, lineNumber)
      },
      didRemoveBreakpoint: (filePath, lineNumber) => {
        this.debugView.removeBreakpointLine(filePath, lineNumber)
      },
      didBreak: async (filePath, lineNumber) => {
        let textEditor = await atom.workspace.open(filePath, {
          initialLine: lineNumber,
          initialColumn: 0
        })
        this.editorManager.createBreakMarker(textEditor, lineNumber)
      },
      didChange: () => {
        this.storage.saveObjectFromKey('breakpoints', this.editorManager.getPlainBreakpoints())
      }
    })
    // Scheme Editor
    this.schemeView = new SchemeView({
      didSelectPlugin: (plugin) => {
        this.pluginManager.activatePlugin(plugin)
        this.toolbarView.setScheme(plugin)
        this.storage.saveObjectFromKey('currentPluginName', plugin.name)
      },
      didChange: () => {
        this.storage.saveObjectFromKey('schemes', this.schemeView.getData())
      }
    })
    // Create toolbar
    this.toolbarView = new ToolbarView({
      didRun: () => {
        this.schemeView.activatePlugin(this.pluginManager.activePlugin)
        this.pluginManager.run()
      },
      didStop: () => this.pluginManager.stop(),
      didOpenScheme: () => this.schemeView.open(this.pluginManager.activePlugin),
      didChangePath: async (pathName) => {
        this.storage.setPath(pathName)
        this.debugView.setWorkspace(pathName)
        let data: any = await this.storage.read().catch(() => {
          // no saved file found.
        })
        if (data) {
          this.editorManager.restoreBreakpoints(data.breakpoints || [])
          this.schemeView.restoreData(data.schemes)
          let plugin = this.pluginManager.getPluginFromName(data.currentPluginName)
          if (plugin) {
            this.pluginManager.activatePlugin(plugin)
            this.toolbarView.setScheme(plugin)
          }
        }
        // Activate Selected Plugin
        if (!this.pluginManager.activePlugin) {
          let firstPlugin = this.pluginManager.plugins[0]
          this.pluginManager.activatePlugin(firstPlugin)
          this.toolbarView.setScheme(firstPlugin)
        }
      }
    })
    // Console View
    this.consoleView = new ConsoleView({
      didRequestProperties: (result, inspectView) => {
        return this.pluginManager.requestProperties(result, inspectView)
      }
    })
    // Create debug area
    this.debugView = new DebugAreaView({
      didPause: () => this.pluginManager.pause(),
      didResume: () => this.pluginManager.resume(),
      didStepOver: () => this.pluginManager.stepOver(),
      didStepInto: () => this.pluginManager.stepInto(),
      didStepOut: () => this.pluginManager.stepOut(),
      didOpenFile: (filePath: string, lineNumber: number, columnNumber: number) => {
        atom.workspace.open(filePath, {
          initialLine: lineNumber,
          initialColumn: columnNumber
        })
      },
      didOpenFrame: (frame: any) => {
        this.debugView.insertScope(frame.scope)
      },
      didRequestProperties: (result, inspectView) => {
        return this.pluginManager.requestProperties(result, inspectView)
      }
    })
    // Atom bugs plugin client
    let client = new PluginClient({
      debugView: this.debugView,
      consoleView: this.consoleView,
      schemeView: this.schemeView,
      toolbarView: this.toolbarView,
      editorManager: this.editorManager
    })
    // Add editor features
    atom.workspace['observeActivePaneItem']((editor) => {
      if (editor) {
        this.editorManager.addFeatures(editor)
      }
    })
    // Listen plugin addition
    this.pluginManager.didAddPlugin((plugin) => {
      this.schemeView.addPlugin(plugin)
      // Register client
      if (plugin.register) plugin.register(client)
    })
  }

  getToolbarElement () {
    return this.toolbarView.getElement()
  }
  getConsoleElement () {
    return this.consoleView.getElement()
  }
  getDebugAreaElement () {
    return this.debugView.getElement()
  }

  destroy () {
    // destroy all
    this.toolbarView.destroy()
    this.debugView.destroy()
    this.consoleView.destroy()
    this.schemeView.destroy()
  }
}
