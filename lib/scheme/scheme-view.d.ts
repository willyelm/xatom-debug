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
    getPluginId(plugin: Plugin): string;
    getConfiguration(): any[];
    addPlugin(plugin: Plugin): void;
    getElement(): HTMLElement;
    destroy(): void;
}
