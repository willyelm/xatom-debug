'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { parse } from 'path';
import { EventEmitter } from 'events';
const { CompositeDisposable } = require('atom');
import { createGroupButtons, createButton, createIcon, createIconFromPath, createText, createElement, createSelect, createOption, insertElement, attachEventFromObject } from '../element/index';
export class ToolbarView {
    constructor(options) {
        this.subscriptions = new CompositeDisposable();
        this.events = new EventEmitter();
        this.element = createElement('atom-bugs-toolbar');
        // create schemes
        this.scheme = {
            icon: createIconFromPath(''),
            name: createText('')
        };
        // create scheme path
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
                createIcon('arrow-down'),
                this.schemePath.select,
                createElement('div', {
                    className: 'bugs-scheme-arrow'
                })
            ]),
            createButton({
                click: () => {
                    this.events.emit('didOpenScheme');
                }
            }, [
                this.scheme.icon,
                this.scheme.name
            ])
        ]));
        attachEventFromObject(this.events, [
            'didRun',
            'didStop',
            'didChangePath',
            'didOpenScheme'
        ], options);
    }
    didRun(cb) {
        this.events.on('didRun', cb);
    }
    didStop(cb) {
        this.events.on('didStop', cb);
    }
    setPathName(pathName) {
        let baseName = parse(pathName).base;
        this.schemePath.name.nodeValue = ` ${baseName}`;
        this.events.emit('didChangePath', pathName);
    }
    toggleRun(status) {
        this.stopButton['disabled'] = status;
        this.runButton['disabled'] = !status;
    }
    setScheme(plugin) {
        // set element icon bg
        this.scheme.icon.style.backgroundImage = `url(${plugin.iconPath})`;
        // set element scheme name
        this.scheme.name.nodeValue = ` ${plugin.name}`;
    }
    setPaths(paths) {
        // clear old list
        this.schemePath.select.innerHTML = '';
        // add new paths
        paths.forEach((p, index) => {
            // activate first
            if (index === 0) {
                this.setPathName(p);
            }
            // insert option to path select
            insertElement(this.schemePath.select, createOption(parse(p).base, p));
        });
    }
    getElement() {
        return this.element;
    }
    destroy() {
        this.element.remove();
        this.subscriptions.dispose();
    }
}
//# sourceMappingURL=toolbar-view.js.map