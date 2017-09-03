'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DEBUG_AREA_URI } from './DebugAreaView';
import { DEBUG_NAVIGATOR_URI } from './DebugNavigatorView';
import { Location } from './Location';
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
//# sourceMappingURL=Session.js.map