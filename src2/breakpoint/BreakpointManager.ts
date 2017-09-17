'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { XAtom } from '../XAtom';
import { Storage } from '../storage';
import { Project } from '../Project';
import { Breakpoint, Breakpoints } from './Breakpoint';

const {
  CompositeDisposable,
  Emitter,
  Range,
  Disposable
} = require('atom');

export class BreakpointManager {
  private emitter = new Emitter();
  private lineNumbers: HTMLElement;
  private currentEditor: any;
  private lineEventListener: EventListenerOrEventListenerObject;
  private markers = new CompositeDisposable();
  constructor () {
    this.lineEventListener = (e) => {
      const element = (<HTMLElement> e.target);
      if (element.classList.contains('line-number')) {
        const filePath = this.currentEditor.getPath();
        const lineNumber = parseInt(element.textContent, 0) - 1;
        this
          .find(filePath, lineNumber)
          .then((breakpoint) => {
            if (breakpoint) {
              this.remove(filePath, lineNumber);
            } else {
              this.add(filePath, lineNumber)
            }
          });
      }
    };
  }
  get (): Promise<Breakpoints> {
    const project = XAtom.project.getActive();
    if (project) {
      return Storage.breakpoint.find({
        projectId: project._id
      });
    } else {
      return Promise.resolve([]);
    }
  }
  restore () {
    const project = XAtom.project.getActive();
    if (this.currentEditor && project) {
      return Storage
        .breakpoint
        .find({
          projectId: project._id,
          filePath: this.currentEditor.getPath()
        })
        .then((breakpoints) => {
          breakpoints.forEach((b) => {
            this.createMarker(this.currentEditor, b.lineNumber);
          });
        });
    }
  }
  getEditorLineNumbers (editor): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const gutters = editor.getGutters();
      const lineGutter = gutters.find((g) => g.name === 'line-number');
      if (lineGutter) {
        resolve(lineGutter.element);
      } else {
        reject('Unable to find line numbers');
      }
    });
  }
  async attachEditor (editor: any) {
    this.dettachEditor();
    this.markers = new CompositeDisposable();
    this.lineNumbers = await this.getEditorLineNumbers(editor);
    this.currentEditor = editor;
    this.lineNumbers.addEventListener('click', this.lineEventListener);
    this.restore();
  }
  dettachEditor () {
    this.markers.dispose();
    if (this.currentEditor && this.lineNumbers) {
      this.lineNumbers.removeEventListener('click', this.lineEventListener);
    }
  }
  static getMarkerFromLineNumber (lineNumber: number) {
    const range = new Range([lineNumber, 0], [lineNumber, 0]);
    const editor = atom.workspace.getCenter().getActivePaneItem();
    return editor
    .getLineNumberDecorations({
      class: 'xatom-breakpoint'
    })
    .find((d) => {
      return range.isEqual(d.getMarker().getBufferRange());
    });
  }
  add (filePath: string, lineNumber: number) {
    const project = XAtom.project.getActive();
    return Storage
      .breakpoint
      .insert({
        projectId: project._id,
        condition: '',
        filePath,
        lineNumber,
        columnNumber: 0
      })
      .then((result) => {
        if (this.currentEditor && this.currentEditor.getPath() === filePath) {
          this.createMarker(this.currentEditor, lineNumber);
          this.emitter.emit('didAdd', result);
        }
        return result;
      });
  }
  remove (filePath: string, lineNumber: number) {
    const project = XAtom.project.getActive();
    const breakpointData: Breakpoint = {
      filePath,
      lineNumber,
      columnNumber: 0,
      condition: ''
    };
    return Storage
      .breakpoint
      .remove({
        projectId: project._id,
        filePath,
        lineNumber
      })
      .then(() => {
        this.emitter.emit('didRemove', breakpointData);
        const currentMarker = BreakpointManager.getMarkerFromLineNumber(lineNumber);
        if (currentMarker) {
          currentMarker.destroy();
        }
      });
  }
  find (filePath: string, lineNumber: number) {
    const project = XAtom.project.getActive();
    return Storage.breakpoint.findOne({
      projectId: project._id,
      filePath,
      lineNumber
    });
  }
  createMarker (editor: any, lineNumber: number) {
    let range = new Range([lineNumber, 0], [lineNumber, 0]);
    let marker = editor.markBufferRange(range);
    let decorator = editor.decorateMarker(marker, {
      type: 'line-number',
      class: 'xatom-breakpoint'
    });
    this.markers.add(new Disposable(() => marker.destroy()));
  }
  onDidAdd (cb) {
    return this.emitter.on('didAdd', cb);
  }
  onDidRemove (cb) {
    return this.emitter.on('didRemove', cb);
  }
  destroy () {
    this.emitter.dispose();
    this.markers.dispose();
  }
}
