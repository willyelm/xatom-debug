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
import { XAtom } from '../XAtom';
import { DEBUG_NAVIGATOR_URI, DEBUG_AREA_URI } from '../debug';
import { BREAKPOINT_NAVIGATOR_URI } from '../breakpoint';
import { Location } from '../Location';
export function createSession(toolbarView, debugControlView, debugAreaView, debugNavigatorView) {
    let currentLocation;
    return {
        getControlOptions() {
            return new Promise((resolve, reject) => {
                resolve({
                    pauseOnException: debugControlView.isPauseOnExceptionEnabled(),
                    disableBreakpoints: debugControlView.isBreakpointsDisabled()
                });
            });
        },
        getSchemeOptions() {
            const editor = atom.workspace.getCenter().getActivePaneItem();
            if (!atom.workspace.isTextEditor(editor))
                return;
            return new Promise((resolve, reject) => {
                resolve({
                    currentPath: editor.getPath()
                });
            });
        },
        getBreakpoints() {
            return XAtom.breakpoints.get();
        },
        markLocation(location, type) {
            return __awaiter(this, void 0, void 0, function* () {
                if (currentLocation)
                    currentLocation.destroy();
                return currentLocation = new Location(location, type);
            });
        },
        markException(location) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.markLocation(location, 'exception');
            });
        },
        // async markBreakpoint (location: Breakpoint) {
        //   return this.markLocation(location, 'breakpoint');
        // },
        setFrames(frames) {
            debugNavigatorView.setFrames(frames);
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
            atom.workspace.open(BREAKPOINT_NAVIGATOR_URI, {});
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
//# sourceMappingURL=PluginSession.js.map