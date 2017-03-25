'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { createButton, createIconFromPath, createText, createElement, insertElement, attachEventFromObject } from '../element/index';
import { EventEmitter } from 'events';
export class SchemeView {
    constructor(options) {
        this.events = new EventEmitter();
        this.element = document.createElement('atom-bugs-scheme');
        this.listElement = createElement('atom-bugs-scheme-list');
        this.editorElement = createElement('atom-bugs-scheme-editor');
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
        // remove active
        let items = this.listElement.querySelectorAll('atom-bugs-scheme-item.active');
        Array.from(items, (item) => item.classList.remove('active'));
        // fund plugin and activate
        let find = this.listElement.querySelector(`[id="${id}"]`);
        if (find) {
            find.classList.add('active');
            // build options
            console.log('build', plugin);
        }
    }
    getPluginId(plugin) {
        let token = btoa(plugin.name);
        return `plugin-${token}`;
    }
    addPlugin(plugin) {
        let item = createElement('atom-bugs-scheme-item', {
            id: this.getPluginId(plugin),
            click: () => {
                if (!item.classList.contains('active')) {
                    console.log('build options', plugin);
                }
            },
            elements: [
                createIconFromPath(plugin.iconPath),
                createText(plugin.name)
            ]
        });
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