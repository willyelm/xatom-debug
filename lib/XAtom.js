'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { BreakpointManager } from './breakpoint';
import { ProjectManager } from './Project';
export var XAtom;
(function (XAtom) {
    XAtom.breakpoints = new BreakpointManager();
    XAtom.project = new ProjectManager();
})(XAtom || (XAtom = {}));
//# sourceMappingURL=XAtom.js.map