'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const { CompositeDisposable, Disposable } = require('atom');
import { ToolbarView } from './ToolbarView';
import { DebugControlView } from './DebugControlView';
// import { OutputView, OUTPUT_URI } from './OutputView';
import { DebugAreaView, DEBUG_AREA_URI } from './DebugAreaView';
import { DebugNavigatorView, DEBUG_NAVIGATOR_URI } from './DebugNavigatorView';
import { SchemeEditorView, SCHEME_EDITOR_URI } from './SchemeEditorView';
import { PluginManager } from './Plugin';
import { Session } from './Session';
import { Storage } from './Storage';
import { Breakpoint, BreakpointManager } from './Breakpoint';

export class XAtomDebug {
  private toolbarView: ToolbarView;
  private schemeEditorView: SchemeEditorView;
  private debugControlView: DebugControlView;
  private debugAreaView: DebugAreaView;
  private debugNavigatorView: DebugNavigatorView;
  private subscriptions: any;
  private pluginManager: PluginManager;
  private breakpointManager: BreakpointManager;
  activate (): void {
    // views
    this.toolbarView = new ToolbarView(null);
    this.schemeEditorView = new SchemeEditorView(null);
    this.debugControlView = new DebugControlView(null);
    this.debugNavigatorView = new DebugNavigatorView(null);
    this.debugAreaView = new DebugAreaView(null);
    // managers
    this.breakpointManager = new BreakpointManager();
    this.pluginManager = new PluginManager(
      this.toolbarView,
      this.debugControlView,
      this.debugAreaView,
      this.debugNavigatorView,
      this.breakpointManager
    );
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
        let project = await Storage.findOne({
          path: projectPath
        });
        if (project) {
          const breakpoints = await project.breakpoints.getItems();
          this.breakpointManager.setBreakpoints(breakpoints);
        } else {
          project = await Storage.put({
            path: projectPath
          });
        }
        this.breakpointManager.storage = project.breakpoints;
      }),
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
        this.breakpointManager.attachBreakpoints(item);
      }),
      // Listean Breakpoints
      this.breakpointManager.onDidAddBreakpoint((b: Breakpoint) => {
        this.pluginManager.execute('addBreakpoint', [b]);
      }),
      this.breakpointManager.onDidRemoveBreakpoint((b: Breakpoint) => {
        this.pluginManager.execute('removeBreakpoint', [b]);
      }),
      // Register panel toggle views
      atom.workspace.addOpener((uri) => {
        if (uri === DEBUG_NAVIGATOR_URI) return this.debugNavigatorView;
        if (uri === DEBUG_AREA_URI) return this.debugAreaView;
        if (uri === SCHEME_EDITOR_URI) return this.schemeEditorView;
      }),
      // Destroy panel views when package is deactivated
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach((item) => {
          if (item instanceof DebugNavigatorView ||
            item instanceof DebugAreaView ||
            item instanceof SchemeEditorView) {
            item.destroy();
          }
        });
      })
    );
  }
  bind (object: any, functionName: string): Function {
    return object[functionName].bind(object);
  }
  providePlugin () {
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
  deactivate (): void {
    this.subscriptions.dispose();
    this.toolbarView.destroy();
    this.breakpointManager.destroy();
    this.pluginManager.destroy();
  }
}

module.exports = new XAtomDebug();
