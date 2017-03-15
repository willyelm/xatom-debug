import { BugsPanelView } from './panel-view';
export declare class Bugs {
    private breakpoints;
    private pluginManager;
    panelView: BugsPanelView;
    constructor();
    getPanelViewElement(): HTMLElement;
    destroy(): void;
    observeEditor(editor: any): void;
    getBreakpoint(filePath: String, lineNumber: Number): any;
    addBreakpoint(marker: any, lineNumber: Number, filePath: String): void;
}
