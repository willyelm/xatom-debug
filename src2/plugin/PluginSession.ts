'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { XAtom } from '../XAtom';
import {
  DebugControlView,
  DebugNavigatorView,
  DebugAreaView,
  CallFrames,
  DEBUG_NAVIGATOR_URI,
  DEBUG_AREA_URI
} from '../debug';
import { Breakpoint, BREAKPOINT_NAVIGATOR_URI } from '../breakpoint';
import { Location } from '../Location';

export interface PluginSession {
  getControlOptions (): void;
  getSchemeOptions (): void;
  start (): void;
  end (): void;
  status (options: {
    text: string,
    type?: 'error' | 'warning' | 'success',
    loading: boolean
  }): void;
}

export function createSession (
  toolbarView,
  debugControlView: DebugControlView,
  debugAreaView: DebugAreaView,
  debugNavigatorView: DebugNavigatorView) {
  let currentLocation;
  return <PluginSession> {
    getControlOptions (): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve({
          pauseOnException: debugControlView.isPauseOnExceptionEnabled(),
          disableBreakpoints: debugControlView.isBreakpointsDisabled()
        });
      });
    },
    getSchemeOptions (): Promise<any> {
      const editor = atom.workspace.getCenter().getActivePaneItem();
      if (!atom.workspace.isTextEditor(editor)) return;
      return new Promise((resolve, reject) => {
        resolve({
          currentPath: editor.getPath()
        });
      });
    },
    getBreakpoints (): Promise<any> {
      return XAtom.breakpoints.get();
    },
    async markLocation (location: Breakpoint, type?: string) {
      if (currentLocation) currentLocation.destroy();

      return currentLocation = new Location(location, type);
    },
    async markException (location: Breakpoint) {
      return this.markLocation(location, 'exception');
    },
    // async markBreakpoint (location: Breakpoint) {
    //   return this.markLocation(location, 'breakpoint');
    // },
    setFrames (frames: CallFrames) {
      debugNavigatorView.setFrames(frames);
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
      atom.workspace.open(BREAKPOINT_NAVIGATOR_URI, {});
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
