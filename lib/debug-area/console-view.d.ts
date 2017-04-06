export interface ConsoleOptions {
    didRequestProperties?: Function;
}
export declare class ConsoleView {
    private element;
    private outputElement;
    private events;
    constructor(options?: ConsoleOptions);
    clearConsole(): void;
    requestProperties(result: any, inspectorView: any): void;
    createEmptyLine(options?: any): any;
    createConsoleLine(entry: string, options?: any): HTMLElement;
    getElement(): HTMLElement;
    destroy(): void;
}
