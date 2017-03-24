export interface InspectorViewOptions {
    result: any;
    didRequestProperties: Function;
}
export declare class InspectorView {
    private element;
    private events;
    constructor(options: InspectorViewOptions);
    createFromDescription(element: any, descriptions: Array<any>): void;
    createInspectorView(element: HTMLElement): {
        insertFromDescription: (descriptions: any[]) => void;
    };
    createValueForResult(result: any): any;
    createForElement(element: HTMLElement, result: any): void;
    getElement(): HTMLElement;
}
