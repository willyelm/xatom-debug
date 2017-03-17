'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { parse } from 'path';
import { EventEmitter }  from 'events';
import {
  createGroupButtons,
  createButton,
  createIcon,
  createIconFromPath,
  createText,
  createElement,
  createSelect,
  createOption,
  insertElement
} from '../element/index';

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

  constructor () {

    this.events = new EventEmitter();
    this.element = document.createElement('atom-bugs-toolbar');
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

    // Icon
    insertElement(this.element, createIcon('logo'))
    // Run
    insertElement(this.element, this.runButton)
    // Stop
    insertElement(this.element, this.stopButton)
    // Scheme Buttons
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
  }

  private setPathName (name: string) {
    let baseName = parse(name).base
    this.schemePath.name.nodeValue = ` ${baseName}`
  }

  public setScheme (plugin) {
    // set element icon bg
    this.scheme.icon.style.backgroundImage = `url(${plugin.iconPath})`;
    // set element scheme name
    this.scheme.name.nodeValue = ` ${plugin.name}`;
  }

  public didOpenSchemeEditor (callback) {
    this.events.on('openEditor', callback)
  }

  public didRun (callback) {
    this.events.on('didRun', callback)
  }

  public didStop (callback) {
    this.events.on('didStop', callback)
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
  }
}
