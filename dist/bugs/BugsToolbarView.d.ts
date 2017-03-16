export declare class BugsToolbarView {
    private element;
    private runButton;
    private stopButton;
    private stepButtons;
    private scheme;
    private schemePath;
    private selectPath;
    private events;
    constructor();
    private setPathName(name);
    getSelectedScheme(): {
        name: string;
    };
    setScheme(plugin: any): void;
    didOpenSchemeEditor(callback: any): void;
    didRun(callback: any): void;
    didStop(callback: any): void;
    setPaths(paths: Array<string>): void;
    getElement(): HTMLElement;
    destroy(): void;
}
