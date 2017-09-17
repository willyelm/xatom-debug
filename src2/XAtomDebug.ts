'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const { CompositeDisposable, Disposable } = require('atom');
import { XAtom } from './XAtom';
import { Project } from './Project';

import { ToolbarView } from './ToolbarView';
import {
  DebugControlView,
  DebugAreaView,
  DebugNavigatorView,
  DEBUG_NAVIGATOR_URI,
  DEBUG_AREA_URI
} from './debug';
import { Breakpoint, BreakpointManager, BreakpointNavigatorView, BREAKPOINT_NAVIGATOR_URI } from './breakpoint';
import { SchemeEditorView, SCHEME_EDITOR_URI } from './SchemeEditorView';
import { PluginManager, PluginSession } from './plugin';
import { Storage } from './storage';

export class XAtomDebug {
  private pluginManager: PluginManager;
  // static views
  private toolbarView = new ToolbarView(null);
  private debugControlView = new DebugControlView(null);
  // dynamic views
  private schemeEditorView = new SchemeEditorView(null);
  private debugAreaView = new DebugAreaView(null);
  private debugNavigatorView = new DebugNavigatorView(null);

  private subscriptions: any;
  constructor () {
    // managers
    this.pluginManager = new PluginManager(
      this.toolbarView,
      this.debugControlView,
      this.debugAreaView,
      this.debugNavigatorView
    );
    // subscriptions
    this.subscriptions = new CompositeDisposable(
      // Set projects
      atom.project.onDidChangePaths(() => {
        this.toolbarView.setProjects(atom.project.getDirectories());
      }),
      // Set Plugins
      this.pluginManager.onDidChangePlugins((plugins) => {
        this.schemeEditorView.setPlugins(plugins);
      }),
      // Listen Toolbar events
      this.toolbarView.onDidRun(() => this.pluginManager.execute('run')),
      this.toolbarView.onDidStop(() => this.pluginManager.execute('stop')),
      this.toolbarView.onDidSelectProject(async (projectPath) => {
        let project = await Storage.project.findOne({ projectPath });
        if (!project) {
          project = await Storage.project.insert(<Project> { projectPath });
        }
        XAtom.project.setActive(<Project> project);
      }),
      XAtom.project.onDidChange(() => XAtom.breakpoints.restore()),
      // Listen Debug Navigator events
      this.debugControlView.onDidContinue(() => this.pluginManager.execute('continue')),
      this.debugControlView.onDidPause(() => this.pluginManager.execute('pause')),
      this.debugControlView.onDidStepOver(() => this.pluginManager.execute('stepOver')),
      this.debugControlView.onDidStepInto(() => this.pluginManager.execute('stepInto')),
      this.debugControlView.onDidStepOut(() => this.pluginManager.execute('stepOut')),
      this.debugAreaView.onDidExitProcess(() => this.pluginManager.getSession().end()),
      // Observe text editors ::observeActiveTextEditor
      atom.workspace.getCenter().observeActivePaneItem((item) => {
        if (!atom.workspace.isTextEditor(item)) return;
        XAtom.breakpoints.attachEditor(item);
      }),
      // Listean Breakpoints
      XAtom.breakpoints.onDidAdd((b: Breakpoint) => {
        this.pluginManager.execute('addBreakpoint', [b]);
      }),
      XAtom.breakpoints.onDidRemove((b: Breakpoint) => {
        this.pluginManager.execute('removeBreakpoint', [b]);
      }),
      // Register panel toggle views
      atom.workspace.addOpener((uri) => {
        if (uri === DEBUG_NAVIGATOR_URI) return this.debugNavigatorView;
        if (uri === DEBUG_AREA_URI) return this.debugAreaView;
        if (uri === SCHEME_EDITOR_URI) return this.schemeEditorView;
        if (uri === BREAKPOINT_NAVIGATOR_URI) return new BreakpointNavigatorView(null);
      }),
      // Destroy panel views when package is deactivated
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach((item) => {
          if (item instanceof DebugNavigatorView ||
            item instanceof DebugAreaView ||
            item instanceof SchemeEditorView ||
            item instanceof BreakpointNavigatorView) {
            item.destroy();
          }
        });
      }),
      // Commands
      atom.commands.add('atom-workspace', {
        'XAtom: Toggle Debugger': () => {
          this.toolbarView.toggle();
        },
        'XAtom: Open Breakpoint Navigator': () => {
          atom.workspace.open(BREAKPOINT_NAVIGATOR_URI, {});
        }
      })
    );
  }
  bind (object: any, functionName: string): Function {
    return object[functionName].bind(object);
  }
  getProvider () {
    return {
      addPlugin: this.bind(this.pluginManager, 'addPlugin'),
      removePlugin: this.bind(this.pluginManager, 'removePlugin'),
      getSession: this.bind(this.pluginManager, 'getSession'),
      getLauncher: ()  => {
        return {
          start: this.bind(this.debugAreaView, 'startProcess')
        }
      }
    };
  }
  destroy (): void {
    XAtom.breakpoints.destroy();
    this.subscriptions.dispose();
    this.toolbarView.destroy();
    this.pluginManager.destroy();
  }
}
