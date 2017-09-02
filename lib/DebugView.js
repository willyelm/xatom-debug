'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { View } from './View';
export class DebugNavigatorView extends View {
    constructor() {
        super('xatom-debug-navigator', `<h1>Hello World</h1>`);
        atom.workspace['addRightPanel']({
            item: this.getElement(),
            visible: true
        });
    }
}
