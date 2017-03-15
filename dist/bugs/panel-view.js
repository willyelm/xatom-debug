'use babel';
import { parse } from 'path';
import { createGroupButtons, createButton, createIcon, createIconFromPath, createText, createElement, createSelect, createOption, insertElement } from '../element/index';
export class BugsPanelView {
    constructor() {
        this.element = document.createElement('atom-bugs-panel');
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
        insertElement(this.element, createIcon('logo'));
        insertElement(this.element, createButton({
            click: () => {
                let currentPlugin = this.scheme.plugin;
                console.log('run', currentPlugin);
            }
        }, [
            createIcon('run'),
            createText('Run')
        ]));
        insertElement(this.element, createButton({
            click: () => {
                let currentPlugin = this.scheme.plugin;
                console.log('pause', currentPlugin);
            }
        }, [
            createIcon('stop')
        ]));
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
                click() {
                    let panel = document.createElement('div');
                    atom.workspace.addModalPanel({
                        item: panel
                    });
                }
            }, [
                this.scheme.icon,
                this.scheme.name
            ])
        ]));
    }
    getSelectedSchemeName() {
        return 'Node.js';
    }
    setScheme(plugin) {
        this.scheme.icon.style.backgroundImage = `url(${plugin.iconPath})`;
        this.scheme.name.nodeValue = ` ${plugin.name}`;
        this.scheme.plugin = plugin;
    }
    setPathName(name) {
        let baseName = parse(name).base;
        this.schemePath.name.nodeValue = ` ${baseName}`;
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
//# sourceMappingURL=panel-view.js.map