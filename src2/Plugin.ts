'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const { CompositeDisposable, Range, Emitter, Disposable } = require('atom');
import { ToolbarView } from './ToolbarView';
import { DebugControlView } from './DebugControlView';
import { DebugAreaView, DEBUG_AREA_URI } from './DebugAreaView';
import { DebugNavigatorView, DEBUG_NAVIGATOR_URI } from './DebugNavigatorView';
import { Breakpoint, BreakpointManager } from './Breakpoint';

export interface Plugin {
  iconPath: string;
}

export interface Session {
  getScheme (): void;
  start (): void;
  end (): void;
  status (options: {
    text: string,
    type?: 'error' | 'warning' | 'success',
    loading: boolean
  }): void;
}

export class Location {
  private lineMarker: any;
  private lineNumberMarker: any;
  private editor: any;
  constructor (private location: Breakpoint) {
    this.openEditor(location);
  }
  async openEditor (location: Breakpoint) {
    this.editor = <any> await atom.workspace.open(location.filePath, {
      initialLine: location.lineNumber || 0,
      initialColumn: location.columnNumber || 0
    });
    this.editor
      .getGutters()
      .filter((gutter) => gutter.name !== 'line-number')
      .forEach((gutter) => {
        gutter.hide();
      });
    const range = new Range(
      [location.lineNumber, location.columnNumber],
      [location.lineNumber, location.columnNumber]);
    this.lineMarker = this.editor.markBufferRange(range);
    this.lineNumberMarker = this.editor.markBufferRange(range);
    this.editor.decorateMarker(this.lineMarker, {
      type: 'line',
      class: 'xatom-debug-location'
    });
    this.editor.decorateMarker(this.lineNumberMarker, {
      type: 'line-number',
      class: 'xatom-debug-location'
    });
    atom.focus();
  }
  destroy () {
    if (this.editor) {
      this.editor
        .getGutters()
        .filter((gutter) => gutter.name !== 'line-number')
        .forEach((gutter) => gutter.show());
    }
    if (this.lineMarker) this.lineMarker.destroy();
    if (this.lineNumberMarker) this.lineNumberMarker.destroy();
  }
}

export function createSession (toolbarView,
  debugControlView,
  debugAreaView,
  debugNavigatorView,
  breakpointManager) {
  let currentLocation;
  return <Session> {
    getScheme () {
      const editor = atom.workspace.getCenter().getActivePaneItem();
      if (!atom.workspace.isTextEditor(editor)) return;
      return {
        currentPath: editor.getPath()
      };
    },
    getBreakpoints () {
      return breakpointManager.getBreakpoints();
    },
    async location (location: Breakpoint) {
      if (currentLocation) currentLocation.destroy();
      currentLocation = new Location(location);
    },
    status (o): void  {
      toolbarView.setStatusText(o.text);
      toolbarView.setStatusLoading(o.loading || false);
      toolbarView.setStatusState(o.type || '');
    },
    pause () {
      debugControlView.enableControls();
    },
    resume () {
      debugControlView.disableControls();
    },
    start (): void {
      toolbarView.disableControls();
      debugControlView.show();
      atom.workspace.open(DEBUG_AREA_URI, {});
      atom.workspace.open(DEBUG_NAVIGATOR_URI, {});
    },
    end (): void {
      if (currentLocation) currentLocation.destroy();
      toolbarView.enableControls();
      debugControlView.hide();
      atom.workspace.hide(DEBUG_AREA_URI);
      atom.workspace.hide(DEBUG_NAVIGATOR_URI);
    }
  }
}

export class PluginManager {
  private emitter = new Emitter();
  private activePlugin: Plugin;
  public plugins: Array<any> = [];
  constructor (
    private toolbarView: ToolbarView,
    private debugControlView: DebugControlView,
    private debugAreaView: DebugAreaView,
    private debugNavigatorView: DebugNavigatorView,
    private breakpointManager: BreakpointManager) {}
  execute (functionName: string, functionArgs?: any[]) {
    const plugin = this.getActivePlugin();
    if (plugin[functionName]) {
      plugin[functionName].apply(plugin, functionArgs);
    }
  }
  setActivePlugin (plugin: Plugin): void {
    this.activePlugin = plugin;
  }
  getSession (): Session {
    return createSession(
      this.toolbarView,
      this.debugControlView,
      this.debugAreaView,
      this.debugNavigatorView,
      this.breakpointManager
    );
  }
  getActivePlugin (): Plugin {
    return this.activePlugin;
  }
  onDidChangePlugins (callback: Function) {
    return this.emitter.on('didChangePlugins', callback);
  }
  addPlugin (name: string, plugin: any) {
    const item = {
      name,
      plugin
    };
    this.plugins.push(item);
    this.activePlugin = plugin;
    this.emitter.emit('didChangePlugins', this.plugins);
  }
  removePlugin (pluginName: string) {
    const index = this.plugins.findIndex((p) => p.name === pluginName);
    if (index > -1) this.plugins.splice(index, 1);
    this.emitter.emit('didChangePlugins', this.plugins);
  }
  destroy () {

  }
}
