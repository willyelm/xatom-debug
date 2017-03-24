import { Plugin } from '../plugin/index';
export interface SchemeOptions {
    didSelectPlugin?: Function;
    didChange?: Function;
}
export declare class SchemeView {
    private element;
    private events;
    private panel;
    constructor(options: SchemeOptions);
    open(): void;
    close(): void;
    addPlugin(plugin: Plugin): void;
    getElement(): HTMLElement;
    destroy(): void;
}
