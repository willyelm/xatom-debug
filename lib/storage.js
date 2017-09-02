'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const path = require('path');
const LevelUp = require('levelup');
const Sublevel = require('level-sublevel');
const dbPath = path.join(atom['configDirPath'], 'xatom-debug');
const db = Sublevel(LevelUp(dbPath, {
    valueEncoding: 'json'
}));
export var Storage;
(function (Storage) {
    Storage.projects = db.sublevel('projects');
    Storage.breakpoints = db.sublevel('breakpoints');
    Storage.expressions = db.sublevel('expressions');
})(Storage || (Storage = {}));
//# sourceMappingURL=Storage.js.map