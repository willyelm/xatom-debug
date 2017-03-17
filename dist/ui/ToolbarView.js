'use babel';
import { parse } from 'path';
import { EventEmitter } from 'events';
import { createGroupButtons, createButton, createIcon, createIconFromPath, createText, createElement, createSelect, createOption, insertElement } from '../element/index';
export class ToolbarView {
    constructor() {
        this.events = new EventEmitter();
        this.element = document.createElement('atom-bugs-toolbar');
        this.scheme = {
            icon: createIconFromPath(''),
            name: createText('')
        };
        this.schemePath = {
            name: createText('Current File'),
            select: createSelect({
                change: (e) => this.setPathName(e.target.value)
            }, [])
        };
        this.runButton = createButton({
            click: () => {
                this.events.emit('didRun');
            }
        }, [
            createIcon('run'),
            createText('Run')
        ]);
        this.stopButton = createButton({
            disabled: true,
            click: () => {
                this.events.emit('didStop');
            }
        }, [
            createIcon('stop')
        ]);
        insertElement(this.element, createIcon('logo'));
        insertElement(this.element, this.runButton);
        insertElement(this.element, this.stopButton);
        insertElement(this.element, createGroupButtons([
            createButton({
                className: 'bugs-scheme'
            }, [
                createIcon('atom'),
                this.schemePath.name,
                this.schemePath.select,
                createElement('div', {
                    className: 'bugs-scheme-arrow'
                })
            ]),
            createButton({
                click: () => {
                    this.events.emit('openEditor');
                }
            }, [
                this.scheme.icon,
                this.scheme.name
            ])
        ]));
    }
    setPathName(name) {
        let baseName = parse(name).base;
        this.schemePath.name.nodeValue = ` ${baseName}`;
    }
    setScheme(plugin) {
        this.scheme.icon.style.backgroundImage = `url(${plugin.iconPath})`;
        this.scheme.name.nodeValue = ` ${plugin.name}`;
    }
    didOpenSchemeEditor(callback) {
        this.events.on('openEditor', callback);
    }
    didRun(callback) {
        this.events.on('didRun', callback);
    }
    didStop(callback) {
        this.events.on('didStop', callback);
    }
    setPaths(paths) {
        this.schemePath.select.innerHTML = '';
        paths.forEach((p, index) => {
            if (index === 0) {
                this.setPathName(p);
            }
            insertElement(this.schemePath.select, createOption(parse(p).base, p));
        });
    }
    getElement() {
        return this.element;
    }
    destroy() {
        this.element.remove();
    }
}
//# sourceMappingURL=ToolbarView.js.map