'use babel';

import {
  BugsToolbarView,
  BugsBreakpointManager,
  BugsPluginManager,
  BugsDebugView
} from './bugs/index';

const { CompositeDisposable } = require('atom');

// function delay(milliseconds: number) {
//   return new Promise<void>(resolve => {
//     setTimeout(resolve, milliseconds);
//   });
// }
//
// async function dramaticWelcome() {
//     console.log("Hello");
//     for (let i = 0; i < 3; i++) {
//         await delay(500);
//         console.log(".");
//     }
//     console.log("World!");
// }
//
// dramaticWelcome();

export default {
  subscriptions: null,

  breakpointManager: null,
  pluginManager: null,

  toolbarView: null,
  schemeView: null,
  debugView: null,

  toolbarPanel: null,


  activate (state: any) {

    // Create bugs instances
    this.toolbarView = new BugsToolbarView();
    this.debugView = new BugsDebugView();
    this.breakpointManager = new BugsBreakpointManager();
    this.pluginManager = new BugsPluginManager();

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

    console.log('this.debugPanel', this.debugPanel)

    // Activate Selected Plugin
    this.pluginManager.didAddPlugin((plugin) => {
      let currentPlugin = this.toolbarView.getSelectedScheme()
      if (plugin.name === currentPlugin.name) {
        this.toolbarView.setScheme(plugin);
      }
    })
    // Open Scheme Editor
    this.toolbarView.didOpenSchemeEditor(() => {
      console.log('open editor')
    })
    // set Paths
    let projects = atom.project['getPaths']()
    this.toolbarView.setPaths(projects)
    // observe path changes
    atom.project.onDidChangePaths((projects) => this.toolbarView.setPaths(projects))
    // observe editors
    atom.workspace['observeActivePaneItem']((editor) => {
      if (editor.getPath && editor.editorElement) {
        this.breakpointManager.observeEditor(editor)
      }
    })
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-bugs:debug': () => this.debug(),
      'atom-bugs:pause': () => this.debug(),
      'atom-bugs:stop': () => this.debug()
    }));
  },

  provideBugsService () {
    return this.pluginManager;
  },

  deactivate () {
    this.subscriptions.dispose();
    // destroy panels
    this.toolbarPanel.destroy();
    this.debugPanel.destroy();
    // destroys views
    this.toolbarView.destroy();
    this.debugView.destroy();
  },

  debug () {
    // toggle debug
    console.log('toggle')
  }
};
