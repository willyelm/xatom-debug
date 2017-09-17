'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { Collection } from './Collection';
export var Storage;
(function (Storage) {
    Storage.project = new Collection('projects');
    Storage.breakpoint = new Collection('breakpoints');
    Storage.expression = new Collection('expressions');
})(Storage || (Storage = {}));
//# sourceMappingURL=Storage.js.map