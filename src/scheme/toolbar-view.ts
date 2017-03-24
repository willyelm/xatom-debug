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
  didOpenScheme?: Function,
  didRun?: Function,
  didChangePath?: Function,
  didStop?: Function
}

export class ToolbarView {
  private element: HTMLElement;
  private logoElement: HTMLElement;
  private statusElement: HTMLElement;
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

    this.logoElement = createIcon('logo')
    this.toggleLogo(false)

    atom.config['observe']('atom-bugs.showToolbarIcon', (value) => this.toggleLogo(value))

    insertElement(this.element, this.logoElement)

    insertElement(this.element, this.runButton)
    insertElement(this.element, this.stopButton)
    insertElement(this.element, createGroupButtons([
      createButton({
        className: 'bugs-scheme'
      }, [
        createIcon('atom'),
        this.schemePath.name,
        createIcon('arrow-down'),
        this.schemePath.select,
        createElement('div', {
          className: 'bugs-scheme-arrow'
        })
      ]),
      createButton({
        click: () => {
          this.events.emit('didOpenScheme');
        }
      }, [
        this.scheme.icon,
        this.scheme.name
      ])
    ]))
    // status
    this.statusElement = createElement('bugs-scheme-status', {
      elements: [
        createText('Not Running')
      ]
    })
    insertElement(this.element, this.statusElement)

    attachEventFromObject(this.events, [
      'didRun',
      'didStop',
      'didChangePath',
      'didOpenScheme'
    ], options);
  }

  public didRun (cb: Function) {
    this.events.on('didRun', cb)
  }
  public didStop (cb: Function) {
    this.events.on('didStop', cb)
  }
  public setStatus(text: string, options?: any) {
    this.statusElement.innerHTML = '';
    if (options) {
      if (options.icon) {
        let icon = insertElement(this.statusElement, createIcon(options.icon))
        icon.classList.add(options.type || '')
      }
    }
    insertElement(this.statusElement, createText(text))
  }

  toggleLogo (state: boolean) {
    this.logoElement.style.display = state ? null : 'none';
  }

  private setPathName (pathName: string) {
    let baseName = parse(pathName).base
    this.schemePath.name.nodeValue = ` ${baseName}`
    // this.setStatusText(`Not Running`)
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
