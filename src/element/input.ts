'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { insertElement, createElement, createText } from './element'

export function createInput (options) {
  let input = createElement('input')
  let handler = null
  if (options.placeholder) {
    input.setAttribute('placeholder', options.placeholder)
  }
  if (options.change) {
    input.addEventListener('keydown', (e) => {
      clearTimeout(handler)
      handler = setTimeout(() => {
        options.change(input.value)
      }, 500)
    })
  }
  return input
}
