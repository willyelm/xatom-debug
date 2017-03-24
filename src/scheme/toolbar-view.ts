'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { parse } from 'path';
import { EventEmitter }  from 'events';
const { CompositeDisposable } = require('atom');
import {
  createGroupButtons,
  createButton,
  createIcon,
  createIconFromPath,
  createText,
  createElement,
  createSelect,
  createOption,
  insertElement,
  attachEventFromObject
} from '../element/index';

export interface ToolbarOptions {
  didOpenSchemeEditor?: Function,
  didRun?: Function,
  didChangePath?: Function,
  didStop?: Function
}

export class ToolbarView {
  private element: HTMLElement;
  private runButton: HTMLElement;
  private stopButton: HTMLElement;
  private stepButtons: HTMLElement;
  private scheme: {
    icon: HTMLElement,
    name: Text
  };
  private schemePath: {
    select: HTMLElement,
    name: Text
  };
  private selectPath: HTMLElement;
  private events: EventEmitter;
  private subscriptions:any = new CompositeDisposable();

  constructor (options: ToolbarOptions) {

    this.events = new EventEmitter();
    this.element = createElement('atom-bugs-toolbar');
    // create schemes
    this.scheme = {
      icon: createIconFromPath(''),
      name: createText('')
    };
    // create scheme path
    this.schemePath = {
      name: createText('Current File'),
      select: createSelect({
        change: (e) => this.setPathName(e.target.value)
      }, [])
    }
    this.runButton = createButton({
      click: () => {
        this.events.emit('didRun');
      }
    },[
      createIcon('run'),
      createText('Run')
    ]);
    this.stopButton = createButton({
      disabled: true,
      click: () => {
        this.events.emit('didStop');
      }
    },[
      createIcon('stop')
    ]);

    insertElement(this.element, createIcon('logo'))
    insertElement(this.element, this.runButton)
    insertElement(this.element, this.stopButton)
    insertElement(this.element, createGroupButtons([
      createButton({
        className: 'bugs-scheme'
      }, [
        createIcon('atom'),
        this.schemePath.name,
        this.schemePath.select,
        createElement('div', {
          className: 'bugs-scheme-arrow'
        })
      ]),
      createButton({
        click: () => {
          this.events.emit('openEditor');
        }
      }, [
        this.scheme.icon,
        this.scheme.name
      ])
    ]))

    attachEventFromObject(this.events, [
      'didRun',
      'didStop',
      'didChangePath',
      'didOpenSchemeEditor'
    ], options);
  }

  private setPathName (pathName: string) {
    let baseName = parse(pathName).base
    this.schemePath.name.nodeValue = ` ${baseName}`
    this.events.emit('didChangePath', pathName);
  }

  public toggleRun (status: boolean) {
    this.stopButton['disabled'] = status;
    this.runButton['disabled'] = !status;
  }

  public setScheme (plugin) {
    // set element icon bg
    this.scheme.icon.style.backgroundImage = `url(${plugin.iconPath})`;
    // set element scheme name
    this.scheme.name.nodeValue = ` ${plugin.name}`;
  }

  public setPaths (paths: Array<string>) {
    // clear old list
    this.schemePath.select.innerHTML = '';
    // add new paths
    paths.forEach((p: string, index: number) => {
      // activate first
      if (index === 0) {
        this.setPathName(p)
      }
      // insert option to path select
      insertElement(this.schemePath.select, createOption(parse(p).base, p))
    })
  }

  public getElement (): HTMLElement {
    return this.element;
  }

  public destroy () {
    this.element.remove();
    this.subscriptions.dispose();
  }
}
