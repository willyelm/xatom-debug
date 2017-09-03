'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { DebugControlView } from './DebugControlView';
import { DebugAreaView, DEBUG_AREA_URI } from './DebugAreaView';
import { DebugNavigatorView, DEBUG_NAVIGATOR_URI } from './DebugNavigatorView';
import { Breakpoint, BreakpointManager } from './Breakpoint';
import { Location } from './Location';

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
