export declare class Storage {
    storagePath: string;
    filePath: string;
    constructor();
    setPath(configFile: string): void;
    isPathPresent(): Promise<{}>;
    createPath(): Promise<{}>;
    save(content: string): Promise<{}>;
    read(): Promise<{}>;
    saveObjectFromKey(key: any, object: any): Promise<{}>;
    saveFromObject(content: any): Promise<{}>;
}
