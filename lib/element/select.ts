'use babel';

import { insertElement, createElement, createText } from './element'

export function createSelect (options, elements?) {
  return createElement('select', {
    elements: elements || options,
    options: elements ? options : null
  });
}

export function createOption (name: string, value: string) {
  let option = createElement('option', {
    elements: [createText(name)]
  });
  option.setAttribute('value', value);
  return option;
}
