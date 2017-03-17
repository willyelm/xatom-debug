import { DebugView } from './ui/index';
export declare class ClientConsole {
    private debugView;
    constructor(debugView: DebugView);
    log(message: string): void;
    clear(): void;
}
export declare class Client {
    private debugView;
    console: ClientConsole;
    constructor(debugView: DebugView);
    pause(filePath: string, lineNumber: number): void;
    resume(): void;
}
