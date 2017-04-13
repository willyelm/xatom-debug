export interface ToolbarOptions {
    didOpenScheme?: Function;
    didRun?: Function;
    didChangePath?: Function;
    didStop?: Function;
    didToggleConsole?: Function;
    didToggleDebugArea?: Function;
}
export declare class ToolbarView {
    isRunning: boolean;
    private element;
    private logoElement;
    private statusTextElement;
    private statusLoadingElement;
    private runButton;
    private stopButton;
    private stepButtons;
    private scheme;
    private schemePath;
    private activePath;
    private events;
    private subscriptions;
    constructor(options: ToolbarOptions);
    private toggleAtomTitleBar(value);
    displayAsTitleBar(): void;
    displayDefault(): void;
    didRun(cb: Function): void;
    didStop(cb: Function): void;
    didToggleConsole(cb: any): void;
    didToggleDebugArea(cb: any): void;
    setStatusLoading(value: boolean): void;
    resetStatus(): HTMLElement;
    setStatus(text: string): HTMLElement;
    toggleLogo(state: boolean): void;
    private setPathName(pathName);
    getPathName(): string;
    toggleRun(status: boolean): void;
    setScheme(plugin: any): void;
    setPaths(paths: Array<string>): void;
    getElement(): HTMLElement;
    destroy(): void;
}
