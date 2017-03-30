import { Plugin } from '../plugin/index';
export interface SchemeOptions {
    didSelectPlugin?: Function;
    didChange?: Function;
}
export declare class SchemeView {
    private element;
    private listElement;
    private editorElement;
    private data;
    private events;
    private panel;
    private activePlugin;
    private plugins;
    constructor(options: SchemeOptions);
    open(activePlugin?: Plugin): void;
    close(): void;
    activatePlugin(plugin: Plugin): void;
    openPlugin(plugin: Plugin): void;
    createControlText(pluginName: string, key: string, config: any): any;
    createControlSelect(pluginName: string, key: string, config: any): any;
    createArrayItem(data: any, index: number): any;
    createControlArray(pluginName: string, key: string, config: any): any;
    createControlObject(pluginName: string, key: string, config: any): any;
    createObjectItem(data: any, index: string): any;
    analizeVisibleControl(pluginName: string, element: HTMLElement, visible: any): void;
    getPluginId(plugin: Plugin): string;
    restoreData(data: any): void;
    getData(): Object;
    getPluginDefaultOptions(plugin: Plugin): any;
    getActivePluginOptions(): Promise<Object>;
    addPlugin(plugin: Plugin): void;
    getElement(): HTMLElement;
    destroy(): void;
}
