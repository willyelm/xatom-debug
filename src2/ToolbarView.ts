'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

const { CompositeDisposable, Emitter, Disposable } = require('atom');
import { View, ViewElement, Element, Action } from './View';
import { SCHEME_EDITOR_URI } from './SchemeEditorView';

import { parse } from 'path';

@View({
  name: 'xatom-debug-toolbar',
  template: `<div class="btn-toolbar">
    <div class="btn-group">
      <button class="xatom-debug-run btn">
        <i class="xatom-icon" name="run"></i>
      </button>
    </div>
    <div class="btn-group">
      <button class="xatom-debug-stop btn" disabled="true">
        <i class="xatom-icon" name="stop"></i>
      </button>
    </div>
    <div class="btn-group xatom-debug-scheme-group">
      <button class="btn btn-separator btn-select">
        <select class="xatom-debug-project"></select>
        <span class="arrow"></span>
      </button>
      <button class="btn xatom-debug-scheme"> Select scheme </button>
    </div>
    <div class="btn-group">
      <div class="btn xatom-debug-status" style="display:none;">
        <i class="xatom-icon" name=""></i>
        <span class="xatom-debug-status-text"><span>
      </div>
    </div>
  </div>`
})
export class ToolbarView {
  public emitter = new Emitter();
  constructor (private viewElement: ViewElement) {
    atom.workspace.addHeaderPanel({
      item: this.getElement(),
      visible: true
    });
  }
  @Element('.xatom-debug-run') runElement: HTMLButtonElement;
  @Element('.xatom-debug-stop') stopElement: HTMLButtonElement;
  @Element('.xatom-debug-project') projectElement: HTMLSelectElement;
  @Element('.xatom-debug-scheme') schemeElement: HTMLButtonElement;
  @Element('.xatom-debug-status') statusElement: HTMLElement;
  // @ElementAction('change', function changeProject () {
  //   const selectedProject = this.projectElement['value'];
  //   console.log('selectedProject', selectedProject)
  // })
  @Action('click', '.xatom-debug-run') clickRun () {
    this.emitter.emit('didClickRun');
  }
  @Action('click', '.xatom-debug-stop') clickStop () {
    this.emitter.emit('didClickStop');
  }
  @Action('click', '.xatom-debug-scheme') clickScheme () {
    atom.workspace.toggle(SCHEME_EDITOR_URI);
  }
  @Action('change', '.xatom-debug-project') changeProject () {
    const selectedProject = this.projectElement['value'];
    this.emitter.emit('didSelectProject', selectedProject);
  }
  setProjects (projects: any[]) {
    this.projectElement.innerHTML = '';
    projects.forEach((directory, index) => {
      const option = document.createElement('option');
      const name = parse(directory.path).base;
      option.value = directory.path;
      option.innerText = name;
      if (index === 0) {
        this.emitter.emit('didSelectProject', directory.path);
      }
      this.projectElement.appendChild(option);
    });
  }
  onDidRun (callback: Function) {
    return this.emitter.on('didClickRun', callback);
  }
  onDidStop (callback: Function) {
    return this.emitter.on('didClickStop', callback);
  }
  onDidSelectProject (callback: Function) {
    return this.emitter.on('didSelectProject', callback);
  }
  disableControls () {
    this.projectElement.disabled = true;
    this.runElement.disabled = true;
    this.schemeElement.disabled = true;
    (<HTMLButtonElement> this.projectElement.parentNode).disabled = true;
    this.stopElement.disabled = false;
  }
  enableControls () {
    this.projectElement.disabled = false;
    this.runElement.disabled = false;
    this.schemeElement.disabled = false;
    (<HTMLButtonElement> this.projectElement.parentNode).disabled = false;
    this.stopElement.disabled = true;
  }
  setStatusLoading (value: boolean) {
    this.statusElement.classList[value ? 'add' : 'remove']('loading');
  }
  setStatusState (type: string) {
    const iconElement = this.statusElement.querySelector('.xatom-icon');
    iconElement.setAttribute('name', type);
  }
  setStatusText (text: string) {
    const textElement = this.statusElement.querySelector('.xatom-debug-status-text');
    this.statusElement.style.display = 'block';
    textElement.textContent = text;
  }
  getElement (): HTMLElement {
    return this.viewElement.element;
  }
  viewDidLoad () {
    this.setProjects(atom.project.getDirectories());
  }
  destroy () {
    this.viewElement.element.remove();
  }
}
