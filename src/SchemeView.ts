'use babel'
/*!
 * XAtom Debug
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
  createTextEditor,
  insertElement,
  attachEventFromObject
} from './element'
import { Plugin } from './plugin'
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
  private activePlugin: Plugin
  private plugins: Array<Plugin> = []
  constructor (options: SchemeOptions) {
    this.events = new EventEmitter()
    this.element = document.createElement('xatom-debug-scheme')
    this.listElement = createElement('xatom-debug-scheme-list')
    // this.listElement.setAttribute('tabindex', '-1')
    this.editorElement = createElement('xatom-debug-scheme-editor', {
      // className: 'native-key-bindings'
    })
    insertElement(this.element, [
      createElement('xatom-debug-scheme-content', {
        elements: [ this.listElement, this.editorElement ]
      }),
      createElement('xatom-debug-scheme-buttons', {
        elements: [
          createButton({
            click: () => this.close()
          }, [createText('Close')])
        ]
      })
    ])
    let modalConfig = {
      item: this.element,
      visible: false
    }
    modalConfig['className'] = 'xatom-debug-modal'
    this.panel = atom.workspace.addModalPanel(modalConfig)
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
  activatePlugin (plugin: Plugin) {
    this.activePlugin = plugin
  }
  openPlugin (plugin: Plugin) {
    let id = this.getPluginId(plugin)
    // fund plugin and activate
    let item = this.listElement.querySelector(`[id="${id}"]`)
    if (!item.classList.contains('active')) {
      // remove active
      let items = this.listElement.querySelectorAll('xatom-debug-scheme-item.active');
      Array.from(items, (item: HTMLElement) => item.classList.remove('active'))
      this.activatePlugin(plugin)
      this.events.emit('didSelectPlugin', plugin)
      // add active class
      item.classList.add('active');
      this.editorElement.innerHTML = '';
      // build options
      let optionVisibles = []
      let optionElements = Object.keys(plugin.options).map((name) => {
        let config = plugin.options[name];
        let configElement = createElement('xatom-debug-scheme-config', {
          elements: [
            createElement('scheme-label', {
              elements: [createText(config.title)]
            })
          ]
        })
        if (!this.data[plugin.name]) {
          this.data[plugin.name] = {}
        }
        if (this.data[plugin.name][name] === undefined) {
          this.data[plugin.name][name] = config.default
        }
        let controlElement
        switch (config.type) {
          case 'string':
          case 'number':
            let controlType = 'createControlText'
            if (Array.isArray(config.enum)) {
              controlType = 'createControlSelect'
            }
            controlElement = this[controlType](plugin.name, name, config)
            break;
          case 'boolean':
            controlElement = this.createControlCheckbox(plugin.name, name, config)
            break;
          case 'object':
            controlElement = this.createControlObject(plugin.name, name, config)
            break;
          case 'array':
            controlElement = this.createControlArray(plugin.name, name, config)
            break;
        }
        if (controlElement) {
          insertElement(configElement, controlElement)
        }
        if (config.description && controlElement) {
          insertElement(controlElement, createElement('p', {
            className: 'text-muted',
            elements: [
              createText(config.description)
            ]
          }))
        }
        if (config.visible) {
          let visible = config.visible
          let visibleHandler = () => this.analizeVisibleControl(plugin.name, configElement, config.visible)
          optionVisibles.push(visibleHandler)
          this.events.on('didChange', visibleHandler)
        }
        return configElement
      })
      // verify visibles after element creation
      optionVisibles.forEach((analize) => analize())
      // insert option elements to editor
      insertElement(this.editorElement, optionElements)
    }
  }
  createControlText (pluginName: string, key: string, config: any) {
    let value = this.data[pluginName][key] || ''
    if (value === config.default) {
      value = null
    }
    let inputElement = createTextEditor({
      value,
      placeholder: config.default,
      // value: this.data[pluginName][key],
      change: (value) => {
        if (String(value).trim().length > 0) {
          this.data[pluginName][key] = value
        } else {
          this.data[pluginName][key] = config.default
        }
        this.events.emit('didChange')
      }
    })
    return createElement('scheme-control', {
      elements: [inputElement]
    })
  }
  createControlCheckbox (pluginName: string, key: string, config: any) {
    return createElement('scheme-control', {
      elements: [createInput({
        type: 'checkbox',
        className: 'input-checkbox',
        value: this.data[pluginName][key],
        change: (value) => {
          this.data[pluginName][key] = value
          this.events.emit('didChange')
        }
      })]
    })
  }
  createControlSelect (pluginName: string, key: string, config: any) {
    let selectOptions = config.enum.map((value) => createOption(value, value))
    let selectElement = createSelect({
      change: (value) => {
        this.data[pluginName][key] = value
        this.events.emit('didChange')
      }
    }, selectOptions)
    selectElement.value = this.data[pluginName][key]
    return createElement('scheme-control', {
      elements: [ selectElement ]
    })
  }
  createArrayItem (data: any, index: number) {
    let itemInput = createInput({
      readOnly: true,
      value: data[index]
    })
    let itemElement = createElement('div', {
      className: 'input-item',
      elements: [
        itemInput,
        createButton ({
          click: () => {
            itemElement.remove()
            data.splice(index, 1)
            this.events.emit('didChange')
          }
        }, createIcon('remove'))
      ]
    })
    return itemElement
  }

  createControlArray (pluginName: string, key: string, config: any) {
    let source = this.data[pluginName][key]
    let addInput: any = createTextEditor({})
    let itemsElement = createElement('div', {
      className: 'input-items'
    })
    let arrayElement = createElement('section', {
      className: 'input-array',
      elements: [
        itemsElement,
        createElement('div', {
          className: 'input-form',
          elements: [
            addInput,
            createButton({
              click: () => {
                let editor = addInput.getModel()
                let value = editor.getText()
                if (value.trim().length > 0) {
                  let index = source.push(value)
                  let itemElement = this.createArrayItem(source, index - 1)
                  editor.setText('')
                  insertElement(itemsElement, itemElement)
                  this.events.emit('didChange')
                }
              }
            }, createIcon('add'))
          ]
        })
      ]
    })
    // restore data
    source.forEach((item, index) => {
      insertElement(itemsElement, this.createArrayItem(source, index))
    })
    return createElement('scheme-control', {
      elements: [ arrayElement ]
    })
  }

  createControlObject (pluginName: string, key: string, config: any) {
    let source = this.data[pluginName][key]
    let nameInput: any = createTextEditor({})
    let valueInput: any = createTextEditor({})
    let itemsElement = createElement('div', {
      className: 'input-items'
    })
    let arrayElement = createElement('section', {
      className: 'input-object',
      elements: [
        itemsElement,
        createElement('div', {
          className: 'input-form',
          elements: [
            nameInput,
            valueInput,
            createButton({
              click: () => {
                let nameEditor = nameInput.getModel()
                let valueEditor = valueInput.getModel()
                let nameValue = nameEditor.getText()
                let value = valueEditor.getText()
                if (nameValue.trim().length > 0 && value.trim().length > 0) {
                  source[nameValue] = value
                  let itemElement = this.createObjectItem(source, nameValue)
                  nameEditor.setText('')
                  valueEditor.setText('')
                  insertElement(itemsElement, itemElement)
                  this.events.emit('didChange')
                }
              }
            }, createIcon('add'))
          ]
        })
      ]
    })
    // restore data
    Object.keys(source).forEach((name) => {
      insertElement(itemsElement, this.createObjectItem(source, name))
    })
    return createElement('scheme-control', {
      elements: [ arrayElement ]
    })
  }

  createObjectItem (data: any, index: string) {
    let nameInput = createInput({})
    let valueInput = createInput({})
    let itemElement = createElement('div', {
      className: 'input-item',
      elements: [
        nameInput,
        valueInput,
        createButton ({
          click: () => {
            itemElement.remove()
            delete data[index]
            this.events.emit('didChange')
          }
        }, createIcon('remove'))
      ]
    })
    nameInput.setAttribute('readonly', true)
    valueInput.setAttribute('readonly', true)
    nameInput.value = index
    valueInput.value = data[index]
    return itemElement
  }

  analizeVisibleControl (pluginName: string, element: HTMLElement, visible: any) {
    Object.keys(visible).forEach((name) => {
      let rules = visible[name];
      let show = false
      if (rules.contains && Array.isArray(rules.contains)) {
        show = rules.contains.includes(this.data[pluginName][name])
      }
      if (rules.is) {
        show = (this.data[pluginName][name] === rules.is)
      }
      element.style.display = show ? '' : 'none'
    })
  }
  getPluginId (plugin: Plugin): string {
    let token = btoa(plugin.name)
    return `plugin-${token}`
  }
  restoreData (data) {
    this.data = data || {}
  }
  getData (): Object {
    return this.data;
  }
  getPluginDefaultOptions (plugin: Plugin) {
    let defaults: any = {}
    Object
      .keys(plugin.options)
      .map((optionName) => {
        defaults[optionName] = plugin.options[optionName].default
      })
    return defaults
  }
  async getActivePluginOptions (): Promise<Object> {
    return new Promise((resolve, reject) => {
      let data = this.data[this.activePlugin.name]
      if (data && Object.keys(data).length > 0) {
        resolve(data)
      } else {
        resolve(this.getPluginDefaultOptions(this.activePlugin))
      }
    })
  }
  addPlugin (plugin: Plugin) {
    let item = createElement('xatom-debug-scheme-item', {
      id: this.getPluginId(plugin),
      options: {
        click: () => {
          this.openPlugin(plugin)
        }
      },
      elements: [
        createIconFromPath(plugin.iconPath),
        createText(plugin.name)
      ]
    })
    this.data[plugin.name] = {};
    this.plugins.push(plugin)
    insertElement(this.listElement, [item])
    if (!this.activePlugin) {
      this.activePlugin = plugin
    }
  }
  getElement (): HTMLElement {
    return this.element
  }
  destroy () {
    this.element.remove()
    this.panel.destroy()
  }
}
