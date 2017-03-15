'use babel';

import { Bugs } from './bugs/index';
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
  bugs: null,
  panelView: null,

  activate (state: any) {
    this.bugs = new Bugs();
    this.panelView = atom.workspace.addTopPanel({
      item: this.bugs.getPanelViewElement(),
      visible: true
    });
    //
    console.log('workspace', atom.workspace)
    console.log('project', atom.project)
    // set Paths
    let projects = atom.project['getPaths']()
    this.bugs.panelView.setPaths(projects)
    // observe path changes
    atom.project.onDidChangePaths((projects) => this.bugs.panelView.setPaths(projects))
    // observe editors
    atom.workspace.observeTextEditors((editor) => {
      if (!editor.getPath || !editor.editorElement) return
      this.bugs.observeEditor(editor)
    });
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-bugs:debug': () => this.debug()
    }));
  },

  provideBugsService () {
    return this.bugs.pluginManager;
  },

  deactivate () {
    this.subscriptions.dispose();
    this.bugs.destroy();
  },

  debug () {
    // toggle debug
    console.log('toggle')
  }
};
