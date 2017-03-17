'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import {
  ToolbarView,
  DebugView
} from './ui/index';

import { PluginManager } from './PluginManager'
import { BreakpointManager } from './BreakpointManager'
import { Client } from './Client'

const { CompositeDisposable } = require('atom');

export default {

  subscriptions: null,
  breakpointManager: null,
  pluginManager: null,
  activePlugin: null,

  toolbarView: null,
  schemeView: null,
  debugView: null,

  toolbarPanel: null,
  debugPanel: null,

  createPanels () {
    // Toolbar Panel
    this.toolbarPanel = atom.workspace.addTopPanel({
      item: this.toolbarView.getElement(),
      visible: true
    });
    // Debug Area Panel
    this.debugPanel = atom.workspace.addTopPanel({
      item: this.debugView.getElement(),
      visible: true
    });
  },

  createManagers () {
    // Atom Bugs Client
    let client = new Client(this.debugView);
    // Create manager intances
    this.breakpointManager = new BreakpointManager();
    this.pluginManager = new PluginManager();
    // Activate Selected Plugin
    this.pluginManager.didAddPlugin((plugin) => {
      if (plugin.registerClient) plugin.registerClient(client)
      if (this.activePlugin === null) {
        this.activePlugin = plugin;
        this.toolbarView.setScheme(plugin);
      }
    })
  },

  createToolbar () {
    // Create Toolbar View
    this.toolbarView = new ToolbarView();
    // Open Scheme Editor
    this.toolbarView.didOpenSchemeEditor(() => {
      console.log('open editor')
    })
    this.toolbarView.didRun(async () => {
      let editor = atom.workspace.getActiveTextEditor();
      let currentFile = editor.getPath();
      let run = await this.activePlugin.run({
        currentFile
        // other setup here
      })
      if (run) {
        this.toolbarView.stopButton['disabled'] = false;
        this.toolbarView.runButton['disabled'] = true;
      }
    })
    this.toolbarView.didStop(async () => {
      let stop = await this.activePlugin.stop();
      if (stop) {
        this.toolbarView.stopButton['disabled'] = true;
        this.toolbarView.runButton['disabled'] = false;
        this.debugView.togglePause(false);
      }
    })
  },

  createDebugArea () {
    // Create view instances
    this.debugView = new DebugView();
    this.debugView.didPause(() => {
      console.log('paused')
    })
    this.debugView.didResume(() => {
      console.log('resume')
    })
  },

  activate (state: any) {

    this.createToolbar();
    this.createDebugArea();
    this.createPanels();
    this.createManagers();

    // set Paths
    let projects = atom.project['getPaths']()
    this.toolbarView.setPaths(projects)
    // observe path changes
    atom.project.onDidChangePaths((projects) => this.toolbarView.setPaths(projects))
    // observe editors
    atom.workspace['observeActivePaneItem']((editor) => {
      if (editor && editor.getPath && editor.editorElement) {
        this.breakpointManager.observeEditor(editor)
      }
    })
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    // this.subscriptions = new CompositeDisposable();
    // this.subscriptions.add(atom.commands.add('atom-workspace', {
    //   'atom-bugs:debug': () => this.debug(),
    //   'atom-bugs:pause': () => this.debug(),
    //   'atom-bugs:stop': () => this.debug()
    // }));
  },

  provideBugsService () {
    return this.pluginManager;
  },

  deactivate () {
    // this.subscriptions.dispose();
    // destroy panels
    this.toolbarPanel.destroy();
    this.debugPanel.destroy();
    // destroys views
    this.toolbarView.destroy();
    this.debugView.destroy();
  }
};
