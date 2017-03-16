module.exports = {
  projectName: 'Atom Bugs',
  description: 'A Simple Javascript Debugger for Atom',
  getMessage () {
    return `${this.projectName}: ${this.description}`
  }
}
