'use babel';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { View } from './View';
import ResizeObserver from 'resize-observer-polyfill';
const Terminal = require('xterm');
const path = require('path');
Terminal.loadAddon('fit');
export const OUTPUT_URI = 'xatom-debug://output';
let OutputView = class OutputView {
    constructor() {
        this._openTerminal();
        this._handleEvents();
    }
    serialize() {
        return {
            deserializer: 'TerminalView'
        };
    }
    destroy() {
        // Stop Observing Resize Events
        this._resizeObserver.disconnect();
        // Kill the Pseudoterminal (pty) Process
        if (this.pty)
            this.pty.kill();
        // Destroy the Terminal Instance
        if (this.terminal)
            this.terminal.destroy();
        // Detach from the DOM
        etch.destroy(this);
        // Dispose of Disposables
        this.disposables.dispose();
    }
    _handleEvents() {
        // Transfer Focus to Terminal
        this.element.addEventListener('focus', () => this.terminal.focus());
        // Observe Resize Events
        this._resizeObserver = new ResizeObserver(this._didResize.bind(this));
        this._resizeObserver.observe(this.element);
        // Process Terminal Input Events
        this.terminal.on('data', (data) => {
            return this.pty.write(data);
        });
        // Process Terminal Output Events
        this.pty.on('data', (data) => {
            return this.terminal.write(data);
        });
        // Process Terminal Exit Events
        this.pty.on('exit', () => {
            let pane = atom.workspace.paneForItem(this);
            if (pane)
                pane.destroyItem(this);
        });
    }
    //
    // Resizes the terminal instance to fit its parent container. Once the new
    // dimensions are established, the calculated columns and rows are passed to
    // the pseudoterminal (pty) to remain consistent.
    //
    _didResize() {
        // Resize Terminal to Container
        this.terminal.fit();
        // Update Pseudoterminal Process w/New Dimensions
        this.pty.resize(this.terminal.cols, this.terminal.rows);
    }
    render() {
        return -view;
        attributes = {};
        {
            tabindex: 0;
        }
    }
};
OutputView = __decorate([
    View({
        name: 'xatom-debug-output'
    }),
    __metadata("design:paramtypes", [])
], OutputView);
export { OutputView };
/>;
;
update();
{
    return etch.update(this);
}
_openTerminal();
{
    this.pty = this._openPseudoterminal();
    this.terminal = new Terminal();
    this.terminal.open(this.element, true);
    this.applyThemeStyles();
}
_openPseudoterminal();
{
    const projectPaths = atom.project.getPaths();
    let cwd;
    if (projectPaths.length > 0) {
        cwd = projectPaths[0];
    }
    else {
        cwd = process.env.HOME;
    }
    return spawnPty(process.env.SHELL, [], {
        name: 'xterm-color',
        cwd: path.resolve(cwd),
        env: process.env
    });
}
//
// Clears the contents of the terminal buffer. This is a simple proxy to the
// `clear()` function on the Xterm instance.
//
clear();
{
    this.terminal.clear();
}
//
// Copies the current selection to the Atom clipboard.
//
copySelection();
{
    let selectedText = window.getSelection().toString();
    let preparedText = this._prepareTextForClipboard(selectedText);
    atom.clipboard.write(preparedText);
}
//
// Pastes the contents of the Atom clipboard to the terminal (via the
// pseudoterminal).
//
pasteFromClipboard();
{
    let text = atom.clipboard.read();
    this.pty.write(text);
}
//
// Xterm.js replaces all spaces with non-breaking space characters. Before
// writing the selection to the clipboard, we need to convert these back to
// standard space characters.
//
// This method was lifted from the Xterm.js source, with some slight
// modifications.
//
_prepareTextForClipboard(text);
{
    const space = String.fromCharCode(32);
    const nonBreakingSpace = String.fromCharCode(160);
    const allNonBreakingSpaces = new RegExp(nonBreakingSpace, 'g');
    return text.split('\n').map((line) => {
        return line.replace(/\s+$/g, '').replace(allNonBreakingSpaces, space);
    }).join('\n');
}
getDefaultLocation();
{
    return 'bottom';
}
getElement();
{
    return this.viewElement.element;
}
getIconName();
{
    return 'terminal';
}
getTitle();
{
    return 'Terminal';
}
//# sourceMappingURL=OutputView0.js.map