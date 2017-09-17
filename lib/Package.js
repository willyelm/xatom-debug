'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
export class XAtomDebugPackage {
    activate() {
        const { XAtomDebug } = require('./XAtomDebug');
        this.xAtomDebug = new XAtomDebug();
    }
    deactivate() {
        if (this.xAtomDebug) {
            this.xAtomDebug.destroy();
        }
    }
    providePlugin() {
        return this.xAtomDebug.getProvider();
    }
    deserializeBreakpointNavigatorView(serialized) {
        const { BreakpointNavigatorView } = require('./Breakpoint');
        return new BreakpointNavigatorView(null);
    }
}
module.exports = new XAtomDebugPackage();
//# sourceMappingURL=Package.js.map