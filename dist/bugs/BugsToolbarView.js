'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { parse } from 'path';
import { EventEmitter } from 'events';
import { createGroupButtons, createButton, createIcon, createIconFromPath, createText, createElement, createSelect, createOption, insertElement } from '../element/index';
export class BugsToolbarView {
    constructor() {
        this.events = new EventEmitter();
        this.element = document.createElement('atom-bugs-toolbar');
        this.scheme = {
            icon: createIconFromPath(''),
            name: createText(''),
            plugin: null
        };
        this.schemePath = {
            name: createText('Current File'),
            select: createSelect({
                change: (e) => this.setPathName(e.target.value)
            }, [])
        };
        this.runButton = createButton({
            click: () => __awaiter(this, void 0, void 0, function* () {
                let currentPlugin = this.scheme.plugin;
                let run = yield currentPlugin.run();
                if (run) {
                    this.events.emit('didRun', currentPlugin, run);
                    this.stopButton['disabled'] = false;
                }
            })
        }, [
            createIcon('run'),
            createText('Run')
        ]);
        this.stopButton = createButton({
            disabled: true,
            click: () => __awaiter(this, void 0, void 0, function* () {
                let currentPlugin = this.scheme.plugin;
                let stop = yield currentPlugin.stop();
                if (stop) {
                    this.events.emit('didStop', currentPlugin, stop);
                    this.stopButton['disabled'] = true;
                }
            })
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
                    this.events.emit('openEditor', this.scheme.plugin);
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
    getSelectedScheme() {
        return {
            name: 'Node.js'
        };
    }
    setScheme(plugin) {
        this.scheme.icon.style.backgroundImage = `url(${plugin.iconPath})`;
        this.scheme.name.nodeValue = ` ${plugin.name}`;
        this.scheme.plugin = plugin;
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
//# sourceMappingURL=BugsToolbarView.js.map