'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { ToolbarView } from './scheme/index';
import { DebugAreaView } from './debug-area/debug-area-view';
import { EditorManager } from './editor/index';
import { PluginManager, PluginClient } from './plugin/index';

export class Bugs {

  public pluginManager: PluginManager = new PluginManager();
  public editorManager: EditorManager;
  public toolbarView: ToolbarView;
  public debugView: DebugAreaView;

  constructor () {
    // Create Editor Manager
    this.editorManager = new EditorManager({
      pluginManager: this.pluginManager,
      didAddBreakpoint: (filePath, lineNumber) => {
        this.debugView.createBreakpointLine(filePath, lineNumber);
      },
      didRemoveBreakpoint: (filePath, lineNumber) => {
        this.debugView.removeBreakpointLine(filePath, lineNumber);
      },
      didBreak: async (filePath, lineNumber) => {
        let textEditor = await atom.workspace.open(filePath, {
          initialLine: lineNumber - 1,
          initialColumn: 0
        })
        this.editorManager.createBreakMarker(textEditor, lineNumber);
      },
    });
    // Create toolbar
    this.toolbarView = new ToolbarView({
      didRun: () => {
        let editor = atom.workspace.getActiveTextEditor();
        let currentFile = editor.getPath();
        let run = this.pluginManager.run({
          currentFile
        })
      },
      didStop: () => {
        this.pluginManager.stop()
      },
      didOpenSchemeEditor: () => {
        console.log('open editor')
      }
    });
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
        return this.pluginManager.requestProperties(result, inspectView);
      }
    });
    // Atom bugs plugin client
    let client = new PluginClient({
      debugView: this.debugView,
      toolbarView: this.toolbarView,
      editorManager: this.editorManager
    });
    // Add editor features
    atom.workspace['observeActivePaneItem']((editor) => {
      this.editorManager.addFeatures(editor);
    })
    // Listen plugin addition
    this.pluginManager.didAddPlugin((plugin) => {
      // Register client
      if (plugin.register) plugin.register(client)
      // Activate Selected Plugin
      if (!this.pluginManager.activePlugin) {
        this.pluginManager.activatePlugin(plugin);
        this.toolbarView.setScheme(plugin);
      }
    });
  }

  getToolbarElement () {
    return this.toolbarView.getElement();
  }
  getConsoleElement () {
    return this.debugView.getConsoleElement();
  }
  getDebugAreaElement () {
    return this.debugView.getDebugElement();
  }

  destroy () {
    // destroy all
    this.toolbarView.destroy();
    this.debugView.destroy();
  }

}
