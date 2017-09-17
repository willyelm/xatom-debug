'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const { Emitter } = require('atom');
export class ProjectManager {
    constructor() {
        this.emitter = new Emitter();
    }
    setActive(project) {
        this.project = project;
        this.emitter.emit('didChange', project);
    }
    onDidChange(cb) {
        return this.emitter.on('didChange', cb);
    }
    getActive() {
        return this.project;
    }
}
//# sourceMappingURL=Project.js.map