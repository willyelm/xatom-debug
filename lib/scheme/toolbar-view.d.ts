export interface ToolbarOptions {
    didOpenSchemeEditor?: Function;
    didRun?: Function;
    didChangePath?: Function;
    didStop?: Function;
}
export declare class ToolbarView {
    private element;
    private runButton;
    private stopButton;
    private stepButtons;
    private scheme;
    private schemePath;
    private selectPath;
    private events;
    private subscriptions;
    constructor(options: ToolbarOptions);
    private setPathName(pathName);
    toggleRun(status: boolean): void;
    setScheme(plugin: any): void;
    setPaths(paths: Array<string>): void;
    getElement(): HTMLElement;
    destroy(): void;
}
