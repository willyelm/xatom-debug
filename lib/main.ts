'use babel';

import {
  BugsToolbarView,
  BugsBreakpointManager,
  BugsPluginManager
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
  panelView: null,

  activate (state: any) {
    // Create bugs instances
    this.toolbarView = new BugsToolbarView();
    this.breakpointManager = new BugsBreakpointManager();
    this.pluginManager = new BugsPluginManager();

    // Add Top Panel
    this.panelView = atom.workspace.addTopPanel({
      item: this.toolbarView.getElement(),
      visible: true
    });
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

    // console.log('workspace', atom.workspace)
    // console.log('project', atom.project)
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
      'atom-bugs:debug': () => this.debug()
    }));
  },

  provideBugsService () {
    return this.pluginManager;
  },

  deactivate () {
    this.subscriptions.dispose();
    this.panelView.destroy();
    this.toolbarView.destroy();
  },

  debug () {
    // toggle debug
    console.log('toggle')
  }
};
