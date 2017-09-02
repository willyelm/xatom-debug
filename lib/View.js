'use babel';
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
import { EventEmitter } from 'events';
import 'reflect-metadata';
const viewControllerRegistry = new EventEmitter();
viewControllerRegistry.setMaxListeners(0);
function getViewController(target) {
    return new Promise((resolve, reject) => {
        viewControllerRegistry.on('viewControllerLoad', function eventListener(controller) {
            if (Object.getPrototypeOf(controller.controller) === target) {
                const task = new Promise((taskResolve, taskReject) => {
                    resolve({
                        viewController: controller,
                        complete: taskResolve
                    });
                });
                controller.tasks.push(task);
                viewControllerRegistry.removeListener('viewControllerLoad', eventListener);
            }
        });
    });
}
function getHTMLElement(controller, query) {
    return new Promise((resolve, reject) => {
        const el = controller.viewElement.element.querySelector(query);
        if (el) {
            resolve(el);
        }
        else {
            reject(`element '${query}' does not exists`);
        }
    });
}
export function Action(eventName, query) {
    return function (target, key, descriptor) {
        getViewController(target).then(({ viewController, complete }) => __awaiter(this, void 0, void 0, function* () {
            const el = yield getHTMLElement(viewController, query);
            el.addEventListener(eventName, (event) => {
                if (target[key]) {
                    target[key].apply(viewController.controller, [event]);
                }
            });
            complete();
        }));
        return descriptor;
    };
}
export function Element(query) {
    return function (target, key, descriptor) {
        getViewController(target).then(({ viewController, complete }) => __awaiter(this, void 0, void 0, function* () {
            const el = yield getHTMLElement(viewController, query);
            target[key] = el;
            complete();
        }));
        return descriptor;
    };
}
export function ElementObserver(query) {
    return function (target, key, descriptor) {
        getViewController(target).then(({ viewController, complete }) => __awaiter(this, void 0, void 0, function* () {
            const el = yield getHTMLElement(viewController, query);
            target[key] = el;
            complete();
        }));
        return descriptor;
    };
}
export class ViewElement {
    constructor(elementName, template) {
        this.element = document.createElement(elementName);
        this.element.innerHTML = template || '';
    }
}
export class ViewController {
    constructor(viewElement) {
        this.viewElement = viewElement;
        this.tasks = [];
        // do something
    }
}
export function View(options) {
    return function (target, key, descriptor) {
        const paramTypes = Reflect.getMetadata('design:paramtypes', target, key);
        const element = new ViewElement(options.name, options.template);
        const controller = new ViewController(element);
        const paramValues = paramTypes.map((param) => {
            if (param === ViewElement)
                return element;
            if (param === ViewController)
                return controller;
            return null;
        });
        const createView = function () {
            target.apply(this, paramValues);
            controller.controller = this;
            viewControllerRegistry.emit('viewControllerLoad', controller);
            if (this.viewDidLoad) {
                Promise.all(controller.tasks).then(() => {
                    this.viewDidLoad();
                });
            }
            return controller.controller;
        };
        createView.prototype = target.prototype;
        return createView;
    };
}
//# sourceMappingURL=View.js.map