'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { createButton, createIconFromPath, createText, createSelect, createOption, createElement, createInput, insertElement, attachEventFromObject } from '../element/index';
import { EventEmitter } from 'events';
export class SchemeView {
    constructor(options) {
        this.data = {};
        this.events = new EventEmitter();
        this.element = document.createElement('atom-bugs-scheme');
        this.listElement = createElement('atom-bugs-scheme-list');
        this.editorElement = createElement('atom-bugs-scheme-editor', {
            className: 'native-key-bindings'
        });
        insertElement(this.element, [
            createElement('atom-bugs-scheme-content', {
                elements: [this.listElement, this.editorElement]
            }),
            createElement('atom-bugs-scheme-buttons', {
                elements: [
                    createButton({
                        click: () => this.close()
                    }, [createText('Close')])
                ]
            })
        ]);
        this.panel = atom.workspace.addModalPanel({
            item: this.element,
            visible: false
        });
        attachEventFromObject(this.events, [
            'didSelectPlugin',
            'didChange'
        ], options);
    }
    open(activePlugin) {
        if (activePlugin) {
            this.openPlugin(activePlugin);
        }
        this.panel.show();
    }
    close() {
        this.panel.hide();
    }
    openPlugin(plugin) {
        let id = this.getPluginId(plugin);
        // fund plugin and activate
        let item = this.listElement.querySelector(`[id="${id}"]`);
        if (!item.classList.contains('active')) {
            // remove active
            let items = this.listElement.querySelectorAll('atom-bugs-scheme-item.active');
            Array.from(items, (item) => item.classList.remove('active'));
            // add active class
            item.classList.add('active');
            this.editorElement.innerHTML = '';
            // build options
            let optionVisibles = [];
            let optionElements = Object.keys(plugin.options).map((name) => {
                let config = plugin.options[name];
                let configElement = createElement('atom-bugs-scheme-config', {
                    elements: [
                        createElement('scheme-label', {
                            elements: [createText(config.title)]
                        })
                    ]
                });
                if (this.data[plugin.name][name] === undefined) {
                    this.data[plugin.name][name] = config.default;
                }
                switch (config.type) {
                    case 'string':
                    case 'number':
                        let controlType = 'createControlText';
                        if (Array.isArray(config.enum)) {
                            controlType = 'createControlSelect';
                        }
                        insertElement(configElement, this[controlType](plugin.name, name, config));
                        break;
                    case 'object':
                        console.log('object');
                        break;
                    case 'array':
                        console.log('array');
                        break;
                }
                if (config.visible) {
                    let visible = config.visible;
                    let visibleHandler = () => this.analizeVisibleControl(plugin.name, configElement, config.visible);
                    optionVisibles.push(visibleHandler);
                    this.events.on('didChange', visibleHandler);
                }
                return configElement;
            });
            // verify visibles after element creation
            optionVisibles.forEach((analize) => analize());
            // insert option elements to editor
            insertElement(this.editorElement, optionElements);
        }
    }
    createControlText(pluginName, key, config) {
        let inputElement = createInput({
            placeholder: config.default,
            value: this.data[pluginName][key],
            change: (value) => {
                this.data[pluginName][key] = value;
                this.events.emit('didChange');
            }
        });
        if (this.data[pluginName][key] !== config.default) {
            inputElement.value = this.data[pluginName][key];
        }
        return createElement('scheme-control', {
            elements: [inputElement]
        });
    }
    createControlSelect(pluginName, key, config) {
        let selectOptions = config.enum.map((value) => createOption(value, value));
        let selectElement = createSelect({
            change: (value) => {
                this.data[pluginName][key] = value;
                this.events.emit('didChange');
            }
        }, selectOptions);
        selectElement.value = this.data[pluginName][key];
        return createElement('scheme-control', {
            elements: [selectElement]
        });
    }
    analizeVisibleControl(pluginName, element, visible) {
        Object.keys(visible).forEach((name) => {
            let rules = visible[name];
            let show = false;
            if (rules.contains && Array.isArray(rules.contains)) {
                show = rules.contains.includes(this.data[pluginName][name]);
            }
            element.style.display = show ? '' : 'none';
        });
    }
    getPluginId(plugin) {
        let token = btoa(plugin.name);
        return `plugin-${token}`;
    }
    restoreData(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    getConfigurationForPlugin(plugin) {
        return this.data[plugin.name];
    }
    addPlugin(plugin) {
        let item = createElement('atom-bugs-scheme-item', {
            id: this.getPluginId(plugin),
            click: () => {
                this.openPlugin(plugin);
            },
            elements: [
                createIconFromPath(plugin.iconPath),
                createText(plugin.name)
            ]
        });
        this.data[plugin.name] = {};
        insertElement(this.listElement, [item]);
        // this.scheme.icon.style.backgroundImage = `url(${plugin.iconPath})`;
        // this.scheme.name.nodeValue = ` ${plugin.name}`;
    }
    getElement() {
        return this.element;
    }
    destroy() {
        this.element.remove();
        this.panel.destroy();
    }
}
//# sourceMappingURL=scheme-view.js.map