'use babel';
import { createElement } from './element';
export function createGroupButtons(options, elements) {
    return createElement('div', {
        className: `btn-group`,
        elements: elements || options,
        options
    });
}
export function createButton(options, elements) {
    return createElement('button', {
        className: `btn btn-default`,
        elements: elements || options,
        options
    });
}
//# sourceMappingURL=button.js.map