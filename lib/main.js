'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const { CompositeDisposable } = require('atom');
import { ToolbarView } from './ToolbarView';
import { DebugNavigatorView } from './DebugNavigatorView';
export class XAtomDebug {
    activate() {
        this.toolbarView = new ToolbarView();
        this.debugNavigatorView = new DebugNavigatorView();
        // create
    }
    deactivate() {
    }
}
module.exports = new XAtomDebug();
