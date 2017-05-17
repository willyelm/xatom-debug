'use babel'
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { get } from 'lodash'
import { insertElement, createElement, createText } from './element'

export function createTextEditor (options) {
  let input = document.createElement('atom-text-editor')
  input.setAttribute('mini', 'true')
  let editor = input['getModel']()
  if (options.placeholder) {
    editor.setPlaceholderText(options.placeholder)
  }
  if (options.change) {
    editor.onDidChange(() => {
      let text = editor.getText()
      options.change(text)
    })
  }
  if (options.value) {
    editor.setText(options.value)
  }
  if (options.keyEvents) {
    input.addEventListener('keyup', (e) => {
      if (options.keyEvents[e.keyCode]) {
        options.keyEvents[e.keyCode]()
      }
    })
  }
  return input
}

export function createInput (options) {
  let input = createElement('input')
  let handler = null
  let inputType = 'text'
  let className = 'form-control'
  if (options.placeholder) {
    input.setAttribute('placeholder', options.placeholder)
  }
  if (options.type) {
    inputType = options.type
  }
  if (options.className) {
    className = options.className
  }
  if (get(options, 'value')) {
    switch(inputType) {
      case 'text':
        input.value = options.value
        break
      case 'checkbox':
        input.checked = options.value
        break
    }
  }
  if (options.readOnly === true) {
    input.setAttribute('readonly', true)
  }
  input.className = className;
  input.setAttribute('type', inputType)
  if (options.change) {
    switch(inputType) {
      case 'text':
        input.addEventListener('keydown', (e) => {
          clearTimeout(handler)
          handler = setTimeout(() => {
            options.change(input.value)
          }, 500)
        })
        break
      case 'checkbox':
        input.addEventListener('change', (e) => options.change(input.checked))
        break
    }
  }
  return input
}
