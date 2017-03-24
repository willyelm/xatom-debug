import { Plugin } from '../plugin/index';
export declare class SchemeView {
    private element;
    constructor();
    createEditorForPlugin(plugin: Plugin): void;
    getElement(): HTMLElement;
    destroy(): void;
}
