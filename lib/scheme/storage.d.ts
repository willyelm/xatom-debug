export declare class Storage {
    configFile: string;
    storagePath: string;
    filePath: string;
    constructor(configFile: string);
    isPathPresent(): Promise<{}>;
    createPath(): Promise<{}>;
    save(content: string): Promise<{}>;
    read(): Promise<{}>;
    saveFromObject(content: any): Promise<{}>;
}
