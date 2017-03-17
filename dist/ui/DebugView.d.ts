export declare class DebugView {
    private element;
    private consoleElement;
    private debugAreaElement;
    private pauseButton;
    private resumeButton;
    private events;
    constructor();
    didResume(callback: any): void;
    didPause(callback: any): void;
    didStepOver(callback: any): void;
    didStepInto(callback: any): void;
    didStepOut(callback: any): void;
    togglePause(status: boolean): void;
    setPausedScript(filePath: string, lineNumber: number): void;
    consoleClear(): void;
    consoleCreateLine(entry: string, elements?: any): HTMLElement;
    getElement(): HTMLElement;
    destroy(): void;
}
