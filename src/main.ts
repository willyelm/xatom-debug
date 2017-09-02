'use babel'
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { XAtomDebug } from './XAtomDebug'
const { CompositeDisposable } = require('atom')

export default {
  subscriptions: null,
  toolbarPanel: null,
  debugPanel: null,
  consolePanel: null,
  debug: null,

  activate (state: any) {
    require('atom-package-deps').install('xatom-debug', true)
    // create atom bugs instance
    this.debug = new XAtomDebug();
    this.debug.toolbarView.didRun(() => {
      this.consolePanel.show()
      this.debugPanel.show()
      this.debug.debugView.adjustDebugArea()
    })
    this.debug.toolbarView.didStop(() => {
      this.consolePanel.hide()
      this.debugPanel.hide()
    })
    this.debug.toolbarView.didToggleConsole(() => {
      this.consolePanel[this.consolePanel.visible ? 'hide' : 'show']()
    })
    this.debug.toolbarView.didToggleDebugArea(() => {
      this.debugPanel[this.debugPanel.visible ? 'hide' : 'show']()
      this.debug.debugView.adjustDebugArea()
    })
    // set Paths
    let projects = atom.project['getPaths']()
    this.debug.toolbarView.setPaths(projects)
    // observe path changes
    atom.project.onDidChangePaths((projects) => this.debug.toolbarView.setPaths(projects))
    // Toolbar Panel
    atom.config['observe']('xatom-debug.toolbarStyle', (value) => {
      if (value === 'HeaderPanel') {
        this.debug.toolbarView.displayAsTitleBar()
      } else {
        this.debug.toolbarView.displayDefault()
      }
      if (this.toolbarPanel) {
        this.toolbarPanel.destroy()
        this.toolbarPanel = atom.workspace[`add${value}`]({
          item: this.debug.getToolbarElement(),
          visible: atom.config.get('xatom-debug.showToolbar')
        });
      }
    })
    atom.config['observe']('xatom-debug.showToolbar', (value) => {
      const method = atom.config.get('xatom-debug.toolbarStyle');
      this.toolbarPanel = atom.workspace[`add${method}`]({
        item: this.debug.getToolbarElement(),
        visible: value
      });
    })
    // Console Panel
    this.consolePanel = atom.workspace.addBottomPanel({
      item: this.debug.getConsoleElement(),
      visible: false
    });
    // Debug Area Panel
    this.debugPanel = atom.workspace.addRightPanel({
      item: this.debug.getDebugAreaElement(),
      visible: false
    });
    // add commands
    let commands = atom.commands.add('atom-workspace', {
      'xatom-debug:toggle': () => {
        if (this.toolbarPanel.visible) {
          this.toolbarPanel.hide()
          this.debugPanel.hide()
          this.consolePanel.hide()
        } else {
          this.toolbarPanel.show()
          this.debugPanel.show()
          if (this.debug.toolbarView.isRunning) {
            this.consolePanel.hide()
          }
        }
      },
      'xatom-debug:run': () => this.debug.pluginManager.run({}),
      'xatom-debug:stop': () => this.debug.pluginManager.stop(),
      'xatom-debug:pause': () => this.debug.pluginManager.pause(),
      'xatom-debug:step-over': () => this.debug.pluginManager.stepOver(),
      'xatom-debug:step-into': () => this.debug.pluginManager.stepInto(),
      'xatom-debug:step-out': () => this.debug.pluginManager.stepOut(),
      'xatom-debug:add-breakpoint': (event) => {
        let editor = atom.workspace.getActiveTextEditor()
        this.debug.editorManager.addBreakpointFromEvent(event, editor)
      },
      'xatom-debug:edit-breakpoint': (event) => {
        this.debug.editorManager.editBreakpointFromEvent(event)
      },
      'xatom-debug:remove-breakpoint': (event) => {
        this.debug.editorManager.removeBreakpointFromEvent(event)
      }
    });
    this.subscriptions = new CompositeDisposable();
    // add commands subs
    this.subscriptions.add(commands);
  },

  provideXAtomDebugPlugin () {
    return this.debug.pluginManager;
  },

  deactivate () {
    this.subscriptions.dispose();
    // destroys views
    this.debug.destroy();
    // destroy panels
    this.toolbarPanel.destroy();
    this.debugPanel.destroy();
    this.consolePanel.destroy();
  }
};
