'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { createText, createElement, insertElement } from '../element/index';
import { EventEmitter } from 'events';
export class InspectorView {
    constructor(options) {
        this.events = new EventEmitter();
        this.element = createElement('atom-bugs-inspector');
        this.element.addEventListener('mousewheel', (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
        });
        this.events.on('didRequestProperties', options.didRequestProperties);
        if (Array.isArray(options.result)) {
            this.createFromDescription(this.element, options.result);
        }
        else {
            this.createForElement(this.element, options.result);
        }
    }
    createFromDescription(element, descriptions) {
        let propertiesElement = createElement('section', {
            className: 'property-properties'
        });
        insertElement(element, [propertiesElement]);
        descriptions.forEach((desc) => {
            if (desc.value) {
                let valueElement = this.createValueForResult(desc.value);
                let propertyClass = 'property-name';
                if (desc.enumerable === false) {
                    propertyClass += ' syntax--variable property-muted';
                }
                else {
                    propertyClass += ' syntax--variable';
                }
                let iconElement = createElement('i', { className: 'bugs-icon' });
                let itemElement = createElement('atom-bugs-inspector-item', {
                    elements: [
                        iconElement,
                        createElement('span', {
                            className: propertyClass,
                            elements: [createText(`${desc.name}:`)]
                        }),
                        valueElement
                    ]
                });
                insertElement(propertiesElement, itemElement);
                if (desc.value && desc.value.objectId) {
                    let request = true;
                    iconElement.classList.add('bugs-icon-arrow-right');
                    iconElement.addEventListener('click', (e) => {
                        let properties = itemElement.querySelector('.property-properties');
                        if (iconElement.classList.contains('bugs-icon-arrow-right')) {
                            iconElement.classList.add('active');
                            iconElement.classList.remove('bugs-icon-arrow-right');
                            iconElement.classList.add('bugs-icon-arrow-down');
                            if (request) {
                                this.events.emit('didRequestProperties', desc.value, this.createInspectorView(valueElement));
                            }
                            else {
                                properties.style.display = null;
                            }
                            request = false;
                        }
                        else {
                            iconElement.classList.remove('active');
                            iconElement.classList.remove('bugs-icon-arrow-down');
                            iconElement.classList.add('bugs-icon-arrow-right');
                            properties.style.display = 'none';
                        }
                    });
                }
            }
        });
    }
    createInspectorView(element) {
        return {
            insertFromDescription: (descriptions) => {
                this.createFromDescription(element, descriptions);
            }
        };
    }
    createValueForResult(result) {
        let value = result.value;
        let valueClass = 'syntax--other';
        switch (result.type) {
            case 'string':
                value = `"${result.value}"`;
                valueClass = 'syntax--string';
                break;
            case 'boolean':
                valueClass = 'syntax--constant syntax--boolean';
                break;
            case 'number':
                value = result.value;
                valueClass = 'syntax--constant syntax--numeric';
                break;
            case 'object':
                switch (result.subtype) {
                    case 'date':
                        value = result.description;
                        break;
                    case 'null':
                        valueClass = 'syntax--constant syntax--null';
                        value = 'null';
                        break;
                    case 'undefined':
                        valueClass = 'syntax--constant syntax--null';
                        value = 'undefined';
                        break;
                    default:
                        valueClass = 'syntax--support syntax--class';
                        value = result.className || value;
                }
                break;
            case 'function':
                let shortName = result.description.match(/\s(.*?\(.*?\))/i);
                if (shortName && shortName[1]) {
                    value = shortName[1];
                    valueClass = 'syntax--other';
                }
                else {
                    value = 'function';
                    valueClass = 'syntax--keyword';
                }
                // valueClass = 'syntax--entity syntax--name syntax--function';
                break;
        }
        return createElement('span', {
            className: 'property-value',
            elements: [
                createElement('span', {
                    className: valueClass,
                    elements: [createText(value)]
                })
            ]
        });
    }
    createForElement(element, result) {
        if (result.objectId) {
            this.events.emit('didRequestProperties', result, this.createInspectorView(element));
        }
        else {
            // value
            insertElement(element, [
                this.createValueForResult(result)
            ]);
        }
    }
    getElement() {
        return this.element;
    }
}
//# sourceMappingURL=inspector-view.js.map