import { DebugView, ToolbarView } from './ui/index';
export declare class ClientConsole {
    private debugView;
    constructor(debugView: DebugView);
    log(message: string): void;
    clear(): void;
}
export declare class Client {
    private debugView;
    private toolbarView;
    console: ClientConsole;
    constructor(debugView: DebugView, toolbarView: ToolbarView);
    stop(): void;
    pause(): void;
    resume(): void;
    break(filePath: string, lineNumber: number): void;
}
