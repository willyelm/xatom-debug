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
                change: (value) => this.setPathName(value)
            }, [])
        };
        this.runButton = createButton({
            click: () => {
                this.events.emit('didRun');
            }
        }, [
            createIcon('run')
        ]);
        this.stopButton = createButton({
            disabled: true,
            click: () => {
                this.events.emit('didStop');
            }
        }, [
            createIcon('stop')
        ]);
        this.logoElement = createIcon('logo');
        this.toggleLogo(false);
        atom.config['observe']('atom-bugs.showToolbarIcon', (value) => this.toggleLogo(value));
        insertElement(this.element, this.logoElement);
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
        // status
        // this.statusElement = createElement('bugs-scheme-status', {
        //   elements: [
        //     createText('Not Running')
        //   ]
        // })
        // insertElement(this.element, this.statusElement)
        // toggle panes
        let toggleButtons = createGroupButtons([
            createButton({
                click: () => this.events.emit('didToggleConsole')
            }, [createIcon('panel-bottom')]),
            createButton({
                click: () => this.events.emit('didToggleDebugArea')
            }, [createIcon('panel-right')])
        ]);
        toggleButtons.classList.add('bugs-toggle-buttons');
        insertElement(this.element, toggleButtons);
        attachEventFromObject(this.events, [
            'didRun',
            'didStop',
            'didChangePath',
            'didOpenScheme',
            'didToggleDebugArea',
            'didToggleConsole'
        ], options);
    }
    didRun(cb) {
        this.events.on('didRun', cb);
    }
    didStop(cb) {
        this.events.on('didStop', cb);
    }
    didToggleConsole(cb) {
        this.events.on('didToggleConsole', cb);
    }
    didToggleDebugArea(cb) {
        this.events.on('didToggleDebugArea', cb);
    }
    setStatus(text, options) {
        this.statusElement.innerHTML = '';
        if (options) {
            if (options.icon) {
                let icon = insertElement(this.statusElement, createIcon(options.icon));
                icon.classList.add(options.type || '');
            }
        }
        insertElement(this.statusElement, createText(text));
    }
    toggleLogo(state) {
        this.logoElement.style.display = state ? null : 'none';
    }
    setPathName(pathName) {
        this.activePath = pathName;
        let baseName = parse(pathName).base;
        this.schemePath.name.nodeValue = ` ${baseName}`;
        // this.setStatusText(`Not Running`)
        this.events.emit('didChangePath', pathName);
    }
    getPathName() {
        return this.activePath;
    }
    toggleRun(status) {
        this.stopButton['disabled'] = status;
        this.runButton['disabled'] = !status;
        this.isRunning = !status;
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