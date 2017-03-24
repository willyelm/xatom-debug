export interface ConsoleOptions {
}
export declare class ConsoleView {
    private element;
    private events;
    constructor(options?: ConsoleOptions);
    clearConsole(): void;
    createConsoleLine(entry: string, elements?: any): HTMLElement;
    getElement(): HTMLElement;
    destroy(): void;
}
