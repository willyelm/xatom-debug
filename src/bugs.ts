'use babel'
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { ToolbarView, SchemeEditorView } from './scheme/index'
import { DebugAreaView, ConsoleView } from './debug-area/index'
import { PluginManager, PluginClient } from './plugin/index'
import { EditorManager } from './editor/index'
import { Storage }  from './storage'

export class Bugs {

  public storage: Storage = new Storage()
  public pluginManager: PluginManager = new PluginManager()
  public editorManager: EditorManager
  public schemeEditorView: SchemeEditorView
  public schemeEditorPanel: any
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
          initialLine: lineNumber - 1,
          initialColumn: 0
        })
        this.editorManager.createBreakMarker(textEditor, lineNumber)
      },
      didChange: () => {
        this.storage.saveObjectFromKey('breakpoints', this.editorManager.getPlainBreakpoints())
      }
    })
    // Scheme Editor
    this.schemeEditorView = new SchemeEditorView()
    this.schemeEditorPanel = atom.workspace.addRightPanel({
      item: this.schemeEditorView.getElement(),
      visible: false
    });
    // Create toolbar
    this.toolbarView = new ToolbarView({
      didRun: () => {
        let editor = atom.workspace.getActiveTextEditor()
        let currentFile = editor.getPath()
        let run = this.pluginManager.run({
          currentFile
        })
      },
      didStop: () => {
        this.pluginManager.stop()
      },
      didOpenSchemeEditor: () => {
        console.log(this.schemeEditorPanel)
      },
      didChangePath: async (pathName) => {
        this.storage.setPath(pathName)
        this.debugView.setWorkspace(pathName)
        let data: any = await this.storage.read().catch(() => {
          // no saved file found.
        })
        if (data) {
          this.editorManager.restoreBreakpoints(data.breakpoints || [])
        }
      }
    })
    // Console View
    this.consoleView = new ConsoleView()
    // Create debug area
    this.debugView = new DebugAreaView({
      didPause: () => this.pluginManager.pause(),
      didResume: () => this.pluginManager.resume(),
      didStepOver: () => this.pluginManager.stepOver(),
      didStepInto: () => this.pluginManager.stepInto(),
      didStepOut: () => this.pluginManager.stepOut(),
      didOpenFile: (filePath: string, lineNumber: number, columnNumber: number) => {
        atom.workspace.open(filePath, {
          initialLine: lineNumber - 1,
          initialColumn: columnNumber - 1
        })
      },
      didRequestProperties: (result, inspectView) => {
        return this.pluginManager.requestProperties(result, inspectView)
      }
    })
    // Atom bugs plugin client
    let client = new PluginClient({
      debugView: this.debugView,
      consoleView: this.consoleView,
      toolbarView: this.toolbarView,
      editorManager: this.editorManager
    })
    // Add editor features
    atom.workspace['observeActivePaneItem']((editor) => {
      this.editorManager.addFeatures(editor)
    })
    // Listen plugin addition
    this.pluginManager.didAddPlugin((plugin) => {
      // Register client
      if (plugin.register) plugin.register(client)
      // Activate Selected Plugin
      if (!this.pluginManager.activePlugin) {
        this.pluginManager.activatePlugin(plugin)
        this.toolbarView.setScheme(plugin)
      }
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
    this.schemeEditorView.destroy()
    this.schemeEditorPanel.destroy()
  }

}
