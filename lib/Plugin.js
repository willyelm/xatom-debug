'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const { CompositeDisposable, Range, Emitter, Disposable } = require('atom');
import { DEBUG_AREA_URI } from './DebugAreaView';
import { DEBUG_NAVIGATOR_URI } from './DebugNavigatorView';
export class Location {
    constructor(location) {
        this.location = location;
        this.openEditor(location);
    }
    openEditor(location) {
        return __awaiter(this, void 0, void 0, function* () {
            this.editor = (yield atom.workspace.open(location.filePath, {
                initialLine: location.lineNumber || 0,
                initialColumn: location.columnNumber || 0
            }));
            this.editor
                .getGutters()
                .filter((gutter) => gutter.name !== 'line-number')
                .forEach((gutter) => {
                gutter.hide();
            });
            const range = new Range([location.lineNumber, location.columnNumber], [location.lineNumber, location.columnNumber]);
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
        });
    }
    destroy() {
        if (this.editor) {
            this.editor
                .getGutters()
                .filter((gutter) => gutter.name !== 'line-number')
                .forEach((gutter) => gutter.show());
        }
        if (this.lineMarker)
            this.lineMarker.destroy();
        if (this.lineNumberMarker)
            this.lineNumberMarker.destroy();
    }
}
export function createSession(toolbarView, debugControlView, debugAreaView, debugNavigatorView, breakpointManager) {
    let currentLocation;
    return {
        getScheme() {
            const editor = atom.workspace.getCenter().getActivePaneItem();
            if (!atom.workspace.isTextEditor(editor))
                return;
            return {
                currentPath: editor.getPath()
            };
        },
        getBreakpoints() {
            return breakpointManager.getBreakpoints();
        },
        location(location) {
            return __awaiter(this, void 0, void 0, function* () {
                if (currentLocation)
                    currentLocation.destroy();
                currentLocation = new Location(location);
            });
        },
        status(o) {
            toolbarView.setStatusText(o.text);
            toolbarView.setStatusLoading(o.loading || false);
            toolbarView.setStatusState(o.type || '');
        },
        pause() {
            debugControlView.enableControls();
        },
        resume() {
            debugControlView.disableControls();
        },
        start() {
            toolbarView.disableControls();
            debugControlView.show();
            atom.workspace.open(DEBUG_AREA_URI, {});
            atom.workspace.open(DEBUG_NAVIGATOR_URI, {});
        },
        end() {
            if (currentLocation)
                currentLocation.destroy();
            toolbarView.enableControls();
            debugControlView.hide();
            atom.workspace.hide(DEBUG_AREA_URI);
            atom.workspace.hide(DEBUG_NAVIGATOR_URI);
        }
    };
}
export class PluginManager {
    constructor(toolbarView, debugControlView, debugAreaView, debugNavigatorView, breakpointManager) {
        this.toolbarView = toolbarView;
        this.debugControlView = debugControlView;
        this.debugAreaView = debugAreaView;
        this.debugNavigatorView = debugNavigatorView;
        this.breakpointManager = breakpointManager;
        this.emitter = new Emitter();
        this.plugins = [];
    }
    execute(functionName, functionArgs) {
        const plugin = this.getActivePlugin();
        if (plugin[functionName]) {
            plugin[functionName].apply(plugin, functionArgs);
        }
    }
    setActivePlugin(plugin) {
        this.activePlugin = plugin;
    }
    getSession() {
        return createSession(this.toolbarView, this.debugControlView, this.debugAreaView, this.debugNavigatorView, this.breakpointManager);
    }
    getActivePlugin() {
        return this.activePlugin;
    }
    onDidChangePlugins(callback) {
        return this.emitter.on('didChangePlugins', callback);
    }
    addPlugin(name, plugin) {
        const item = {
            name,
            plugin
        };
        this.plugins.push(item);
        this.activePlugin = plugin;
        this.emitter.emit('didChangePlugins', this.plugins);
    }
    removePlugin(pluginName) {
        const index = this.plugins.findIndex((p) => p.name === pluginName);
        if (index > -1)
            this.plugins.splice(index, 1);
        this.emitter.emit('didChangePlugins', this.plugins);
    }
    destroy() {
    }
}
//# sourceMappingURL=Plugin.js.map