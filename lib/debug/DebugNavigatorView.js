'use babel';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { View, ViewElement } from '../View';
import { GroupView } from '../GroupView';
import { DebugFrameView } from './DebugFrameView';
export const DEBUG_NAVIGATOR_URI = 'xatom://debug-navigator';
let DebugNavigatorView = class DebugNavigatorView {
    constructor(viewElement) {
        this.viewElement = viewElement;
        this.element = this.getElement();
        // Variables
        this.variableGroupView = new GroupView(null, {
            title: 'Variables'
        });
        this.element.appendChild(this.variableGroupView.getElement());
        // Watch
        this.watchGroupView = new GroupView(null, {
            title: 'Watch'
        });
        this.element.appendChild(this.watchGroupView.getElement());
        // Call Frames
        this.frameGroupView = new GroupView(null, {
            title: 'Call Frames',
            selectable: true
        });
        this.element.appendChild(this.frameGroupView.getElement());
    }
    // Variables
    addVariable(variable) {
    }
    setVariables(variables) {
        this.clearVariables();
        variables.forEach((variable) => this.addVariable(variable));
    }
    clearVariables() {
        this.variableGroupView.removeItems();
    }
    // Watch
    addWatchVariable(expression) {
        //
    }
    // Frames
    addFrame(frame) {
        const item = new DebugFrameView(null, frame);
        return this.frameGroupView.addItem(item.getElement(), frame);
    }
    setFrames(frames) {
        this.clearFrames();
        frames.forEach((frame, index) => {
            const groupItem = this.addFrame(frame);
            if (index === 0) {
                this.frameGroupView.activate(groupItem);
            }
        });
    }
    clearFrames() {
        this.frameGroupView.removeItems();
    }
    getElement() {
        return this.viewElement.element;
    }
    getTitle() {
        return 'Debug Navigator';
    }
    getURI() {
        return DEBUG_NAVIGATOR_URI;
    }
    getDefaultLocation() {
        return 'right';
    }
    getAllowedLocations() {
        return ['right', 'center', 'left'];
    }
    destroy() {
        atom.workspace.hide(DEBUG_NAVIGATOR_URI);
        this.viewElement.element.remove();
    }
};
DebugNavigatorView = __decorate([
    View({
        name: 'xatom-debug-navigator'
    }),
    __metadata("design:paramtypes", [ViewElement])
], DebugNavigatorView);
export { DebugNavigatorView };
//# sourceMappingURL=DebugNavigatorView.js.map