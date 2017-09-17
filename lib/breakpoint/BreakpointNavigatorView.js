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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const { CompositeDisposable, Disposable } = require('atom');
import { XAtom } from '../XAtom';
import { View, ViewElement } from '../View';
import { GroupView } from '../GroupView';
import { BreakpointView } from './BreakpointView';
export const BREAKPOINT_NAVIGATOR_URI = 'xatom://breakpoint-navigator';
let BreakpointNavigatorView = class BreakpointNavigatorView {
    constructor(viewElement) {
        this.viewElement = viewElement;
        this.breakpointGroupView = new GroupView(null, {
            title: '&nbsp;',
            actions: {
                'Remove All': () => this.removeAll()
            }
        });
        this.element = this.getElement();
        this.element.appendChild(this.breakpointGroupView.getElement());
        this.setCurrentBreakpoints();
        this.subscriptions = new CompositeDisposable(XAtom.project.onDidChange(() => this.setCurrentBreakpoints()), XAtom.breakpoints.onDidAdd((b) => this.addBreakpoint(b)), XAtom.breakpoints.onDidRemove((b) => this.removeBreakpoint(b)));
    }
    addBreakpoint(breakpoint) {
        const item = new BreakpointView(null, breakpoint);
        this.breakpointGroupView.addItem(item.getElement(), {
            filePath: breakpoint.filePath,
            lineNumber: breakpoint.lineNumber
        });
    }
    removeBreakpoint(breakpoint) {
        this.breakpointGroupView.removeItem({
            filePath: breakpoint.filePath,
            lineNumber: breakpoint.lineNumber
        });
    }
    removeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const breakpoints = yield XAtom.breakpoints.get();
            breakpoints.forEach((b) => XAtom.breakpoints.remove(b.filePath, b.lineNumber));
        });
    }
    setCurrentBreakpoints() {
        return __awaiter(this, void 0, void 0, function* () {
            this.breakpointGroupView.removeItems();
            const breakpoints = yield XAtom.breakpoints.get();
            breakpoints.forEach((b) => this.addBreakpoint(b));
        });
    }
    getElement() {
        return this.viewElement.element;
    }
    getTitle() {
        return 'Breakpoints';
    }
    getURI() {
        return BREAKPOINT_NAVIGATOR_URI;
    }
    serialize() {
        return {
            deserializer: 'XAtom/BreakpointNavigatorView'
        };
    }
    getDefaultLocation() {
        return 'right';
    }
    getAllowedLocations() {
        return ['right', 'center', 'left'];
    }
    destroy() {
        atom.workspace.hide(BREAKPOINT_NAVIGATOR_URI);
        this.viewElement.element.remove();
        this.subscriptions.dispose();
    }
};
BreakpointNavigatorView = __decorate([
    View({
        name: 'xatom-breakpoint-navigator'
    }),
    __metadata("design:paramtypes", [ViewElement])
], BreakpointNavigatorView);
export { BreakpointNavigatorView };
//# sourceMappingURL=BreakpointNavigatorView.js.map