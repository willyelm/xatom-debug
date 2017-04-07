'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { Bugs } from './bugs';
const { CompositeDisposable } = require('atom');
export default {
    subscriptions: null,
    toolbarPanel: null,
    debugPanel: null,
    consolePanel: null,
    bugs: null,
    activate(state) {
        require('atom-package-deps').install('atom-bugs', true);
        // create atom bugs instance
        this.bugs = new Bugs();
        this.bugs.toolbarView.didRun(() => {
            this.consolePanel.show();
            this.debugPanel.show();
            this.bugs.debugView.adjustDebugArea();
        });
        this.bugs.toolbarView.didStop(() => this.consolePanel.hide());
        this.bugs.toolbarView.didToggleConsole(() => {
            this.consolePanel[this.consolePanel.visible ? 'hide' : 'show']();
        });
        this.bugs.toolbarView.didToggleDebugArea(() => {
            this.debugPanel[this.debugPanel.visible ? 'hide' : 'show']();
            this.bugs.debugView.adjustDebugArea();
        });
        // set Paths
        let projects = atom.project['getPaths']();
        this.bugs.toolbarView.setPaths(projects);
        // observe path changes
        atom.project.onDidChangePaths((projects) => this.bugs.toolbarView.setPaths(projects));
        // Toolbar Panel
        atom.config['observe']('atom-bugs.toolbarStyle', (value) => {
            if (this.toolbarPanel) {
                this.toolbarPanel.destroy();
            }
            if (value === 'HeaderPanel') {
                this.bugs.toolbarView.displayAsTitleBar();
            }
            else {
                this.bugs.toolbarView.displayDefault();
            }
            this.toolbarPanel = atom.workspace[`add${value}`]({
                item: this.bugs.getToolbarElement()
            });
        });
        // Console Panel
        this.consolePanel = atom.workspace.addBottomPanel({
            item: this.bugs.getConsoleElement(),
            visible: false
        });
        // Debug Area Panel
        this.debugPanel = atom.workspace.addRightPanel({
            item: this.bugs.getDebugAreaElement(),
            visible: false
        });
        // add commands
        let commands = atom.commands.add('atom-workspace', {
            'atom-bugs:toggle': () => {
                let visible = this.toolbarPanel.visible;
                if (visible) {
                    this.toolbarPanel.hide();
                    this.debugPanel.hide();
                    this.consolePanel.hide();
                }
                else {
                    this.toolbarPanel.show();
                    this.debugPanel.show();
                    if (this.bugs.toolbarView.isRunning) {
                        this.consolePanel.hide();
                    }
                }
            },
            'atom-bugs:run': () => this.bugs.pluginManager.run({}),
            'atom-bugs:stop': () => this.bugs.pluginManager.stop(),
            'atom-bugs:pause': () => this.bugs.pluginManager.pause(),
            'atom-bugs:step-over': () => this.bugs.pluginManager.stepOver(),
            'atom-bugs:step-into': () => this.bugs.pluginManager.stepInto(),
            'atom-bugs:step-out': () => this.bugs.pluginManager.stepOut()
        });
        this.subscriptions = new CompositeDisposable();
        // add commands subs
        this.subscriptions.add(commands);
    },
    provideService() {
        return this.bugs.pluginManager;
    },
    deactivate() {
        this.subscriptions.dispose();
        // destroys views
        this.bugs.destroy();
        // destroy panels
        this.toolbarPanel.destroy();
        this.debugPanel.destroy();
        this.consolePanel.destroy();
    }
};
//# sourceMappingURL=main.js.map