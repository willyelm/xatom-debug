'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

const path = require('path');
const LevelUp = require('levelup')
const Sublevel = require('level-sublevel')

const dbPath = path.join(atom['configDirPath'], 'xatom-debug');
const db = Sublevel(LevelUp(dbPath, {
  valueEncoding: 'json'
}));

export namespace Storage {
  export const projects = db.sublevel('projects');
  export const breakpoints = db.sublevel('breakpoints');
  export const expressions = db.sublevel('expressions');
}
