'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { get } from 'lodash';
import { createElement } from './element';
export function createInput(options) {
    let input = createElement('input');
    let handler = null;
    let inputType = 'text';
    let className = 'form-control';
    if (options.placeholder) {
        input.setAttribute('placeholder', options.placeholder);
    }
    if (options.type) {
        inputType = options.type;
    }
    if (options.className) {
        className = options.className;
    }
    if (get(options, 'value')) {
        switch (inputType) {
            case 'text':
                input.value = options.value;
                break;
            case 'checkbox':
                input.checked = options.value;
                break;
        }
    }
    if (options.readOnly === true) {
        input.setAttribute('readonly', true);
    }
    input.className = className;
    input.setAttribute('type', inputType);
    if (options.change) {
        switch (inputType) {
            case 'text':
                input.addEventListener('keydown', (e) => {
                    clearTimeout(handler);
                    handler = setTimeout(() => {
                        options.change(input.value);
                    }, 500);
                });
                break;
            case 'checkbox':
                input.addEventListener('change', (e) => options.change(input.checked));
                break;
        }
    }
    return input;
}
//# sourceMappingURL=input.js.map