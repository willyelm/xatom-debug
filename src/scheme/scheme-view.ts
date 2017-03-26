'use babel'
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import {
  createGroupButtons,
  createButton,
  createIcon,
  createIconFromPath,
  createText,
  createSelect,
  createOption,
  createElement,
  createInput,
  insertElement,
  attachEventFromObject
} from '../element/index'
import { Plugin } from '../plugin/index'
import { EventEmitter }  from 'events'

export interface SchemeOptions {
  didSelectPlugin?: Function,
  didChange?: Function
}

export class SchemeView {
  private element: HTMLElement
  private listElement: HTMLElement
  private editorElement: HTMLElement
  private data: Object = {}
  private events: EventEmitter
  private panel: any
  constructor (options: SchemeOptions) {
    this.events = new EventEmitter()
    this.element = document.createElement('atom-bugs-scheme')
    this.listElement = createElement('atom-bugs-scheme-list')
    this.editorElement = createElement('atom-bugs-scheme-editor', {
      className: 'native-key-bindings'
    })
    insertElement(this.element, [
      createElement('atom-bugs-scheme-content', {
        elements: [ this.listElement, this.editorElement ]
      }),
      createElement('atom-bugs-scheme-buttons', {
        elements: [
          createButton({
            click: () => this.close()
          }, [createText('Close')])
        ]
      })
    ])
    this.panel = atom.workspace.addModalPanel({
      item: this.element,
      visible: false
    })
    attachEventFromObject(this.events, [
      'didSelectPlugin',
      'didChange'
    ], options)
  }
  open (activePlugin?: Plugin) {
    if (activePlugin) {
      this.openPlugin(activePlugin)
    }
    this.panel.show()
  }
  close () {
    this.panel.hide()
  }
  openPlugin (plugin: Plugin) {
    let id = this.getPluginId(plugin)
    // fund plugin and activate
    let item = this.listElement.querySelector(`[id="${id}"]`)
    if (!item.classList.contains('active')) {
      // remove active
      let items = this.listElement.querySelectorAll('atom-bugs-scheme-item.active');
      Array.from(items, (item: HTMLElement) => item.classList.remove('active'))
      // add active class
      item.classList.add('active');
      this.editorElement.innerHTML = '';
      // build options
      let optionVisibles = []
      let optionElements = Object.keys(plugin.options).map((name) => {
        let config = plugin.options[name];
        let configElement = createElement('atom-bugs-scheme-config', {
          elements: [
            createElement('scheme-label', {
              elements: [createText(config.title)]
            })
          ]
        })
        this.data[name] = config.default
        switch (config.type) {
          case 'string':
          case 'number':
            let controlType = 'createControlText'
            if (Array.isArray(config.enum)) {
              controlType = 'createControlSelect'
            }
            insertElement(configElement, this[controlType](name, config))
            break;
          case 'object':
            console.log('object')
            break;
          case 'array':
            console.log('array')
            break;
        }
        if (config.visible) {
          let visible = config.visible
          optionVisibles.push(() => this.analizeVisibleControl(configElement, config.visible))
          this.events.on('didChange', () => this.analizeVisibleControl(configElement, config.visible))
        }
        return configElement
      })
      // verify visibles after element creation
      optionVisibles.forEach((analize) => analize())
      // insert option elements to editor
      insertElement(this.editorElement, optionElements)
    }
  }
  createControlText (key: string, config: any) {
    let inputElement = createInput({
      placeholder: config.default,
      change: (value) => {
        this.data[key] = value
        this.events.emit('didChange')
      }
    })
    return createElement('scheme-control', {
      elements: [inputElement]
    })
  }
  analizeVisibleControl (element: HTMLElement, visible: any) {
    Object.keys(visible).forEach((name) => {
      let rules = visible[name];
      let show = false
      if (rules.contains && Array.isArray(rules.contains)) {
        show = rules.contains.includes(this.data[name])
      }
      element.style.display = show ? '' : 'none'
    })
  }
  createControlSelect (key: string, config: any) {
    let selectOptions = config.enum.map((value) => createOption(value, value))
    return createElement('scheme-control', {
      elements: [
        createSelect({
          change: (value) => {
            this.data[key] = value
            this.events.emit('didChange')
          }
        }, selectOptions)
      ]
    })
  }
  getPluginId (plugin: Plugin) {
    let token = btoa(plugin.name)
    return `plugin-${token}`
  }
  getConfiguration () {
    return this.data;
  }
  addPlugin (plugin: Plugin) {
    let item = createElement('atom-bugs-scheme-item', {
      id: this.getPluginId(plugin),
      click: () => {
        this.openPlugin(plugin)
      },
      elements: [
        createIconFromPath(plugin.iconPath),
        createText(plugin.name)
      ]
    })
    insertElement(this.listElement, [item])
    // this.scheme.icon.style.backgroundImage = `url(${plugin.iconPath})`;
    // this.scheme.name.nodeValue = ` ${plugin.name}`;
  }
  getElement () {
    return this.element
  }
  destroy () {
    this.element.remove()
    this.panel.destroy()
  }
}
