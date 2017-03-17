'use babel';
export function createText(text) {
    return document.createTextNode(` ${text} `);
}
export function insertElement(target, elements) {
    if (!Array.isArray(elements)) {
        elements = [elements];
    }
    elements.forEach((el) => target.appendChild(el));
    return target;
}
export function createElement(tagName, options) {
    let element = document.createElement(tagName);
    if (options) {
        let extras = options.options || {};
        element.className = options.className || '';
        if (extras.className) {
            element.classList.add(extras.className);
        }
        if (extras.click) {
            element.addEventListener('click', (e) => extras.click(e));
        }
        if (extras.change) {
            element.addEventListener('change', (e) => extras.change(e));
        }
        if (extras.disabled) {
            element['disabled'] = extras.disabled;
        }
        if (options.elements) {
            let contents = Array.isArray(options.elements) ? options.elements : [options.elements];
            contents.forEach((content) => insertElement(element, content));
        }
    }
    return element;
}
//# sourceMappingURL=element.js.map