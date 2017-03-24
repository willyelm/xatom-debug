export interface ToolbarOptions {
    didOpenScheme?: Function;
    didRun?: Function;
    didChangePath?: Function;
    didStop?: Function;
}
export declare class ToolbarView {
    private element;
    private logoElement;
    private runButton;
    private stopButton;
    private stepButtons;
    private scheme;
    private schemePath;
    private selectPath;
    private events;
    private subscriptions;
    constructor(options: ToolbarOptions);
    didRun(cb: Function): void;
    didStop(cb: Function): void;
    toggleLogo(state: boolean): void;
    private setPathName(pathName);
    toggleRun(status: boolean): void;
    setScheme(plugin: any): void;
    setPaths(paths: Array<string>): void;
    getElement(): HTMLElement;
    destroy(): void;
}
