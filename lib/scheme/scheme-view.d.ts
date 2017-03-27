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
    constructor(options: SchemeOptions);
    open(activePlugin?: Plugin): void;
    close(): void;
    openPlugin(plugin: Plugin): void;
    createControlText(pluginName: string, key: string, config: any): any;
    createControlSelect(pluginName: string, key: string, config: any): any;
    analizeVisibleControl(pluginName: string, element: HTMLElement, visible: any): void;
    getPluginId(plugin: Plugin): string;
    restoreData(data: any): void;
    getData(): Object;
    getConfigurationForPlugin(plugin: Plugin): any;
    addPlugin(plugin: Plugin): void;
    getElement(): HTMLElement;
    destroy(): void;
}
