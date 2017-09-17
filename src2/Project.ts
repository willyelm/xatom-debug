'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

const { Emitter } = require('atom');
import { Item } from './Storage';

export interface Project extends Item {
  projectPath: string
}

export class ProjectManager {
  private project: Project;
  private emitter = new Emitter();
  constructor () {

  }
  setActive (project: Project) {
    this.project = project;
    this.emitter.emit('didChange', project);
  }
  onDidChange (cb) {
    return this.emitter.on('didChange', cb);
  }
  getActive () {
    return this.project;
  }
}
