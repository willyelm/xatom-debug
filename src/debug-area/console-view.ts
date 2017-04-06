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
  createElement,
  insertElement,
  attachEventFromObject
} from '../element/index'

import { EventEmitter }  from 'events'
import { parse } from 'path'

export interface ConsoleOptions {
  didRequestProperties?: Function
}
export class ConsoleView {

  private element: HTMLElement
  private outputElement: HTMLElement
  private events: EventEmitter

  constructor (options?: ConsoleOptions) {
    this.events = new EventEmitter()
    this.outputElement = createElement('atom-bugs-console-output')
    this.element = createElement('atom-bugs-console', {
      elements: [
        createElement('atom-bugs-controls', {
          elements: [
            createButton({}, createText('Console'))
          ]
        }),
        this.outputElement
      ]
    })
    this.element.setAttribute('tabindex', '-1')
    attachEventFromObject(this.events, [
      'didRequestProperties'
    ], options)
  }

  clearConsole () {
    this.outputElement.innerHTML = ''
  }

  requestProperties (result: any, inspectorView: any) {
    this.events.emit('didRequestProperties', result, inspectorView)
  }

  createEmptyLine (options?) {
    let line = createElement('atom-bugs-console-line', options)
    insertElement(this.outputElement, line)
    return line
  }

  createConsoleLine (entry: string, options?) {
    let line = createElement('atom-bugs-console-line', options)
    if (entry && entry.length > 0) {
      line.innerHTML = entry
    }
    setTimeout (() => {
      this.outputElement.scrollTop = this.outputElement.scrollHeight
    }, 250)
    return insertElement(this.outputElement, line)
  }

  getElement () {
    return this.element
  }

  destroy () {
    this.element.remove()
  }
}
