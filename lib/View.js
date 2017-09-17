'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'reflect-metadata';
// const viewControllerRegistry = new EventEmitter();
const viewRegistry = [];
// viewControllerRegistry.setMaxListeners(0);
//
//
// function getViewController (target: any): Promise<{
//   viewController: ViewController,
//   complete: Function
// }> {
//   return new Promise ((resolve, reject) => {
//     viewControllerRegistry.on('viewControllerLoad', function eventListener (controller: ViewController) {
//       if (Object.getPrototypeOf(controller.controller) === target) {
//         const task = new Promise((taskResolve, taskReject) => {
//           resolve({
//             viewController: controller,
//             complete: taskResolve
//           });
//         });
//         console.log('register');
//         controller.tasks.push(task);
//         viewControllerRegistry.removeListener('viewControllerLoad', eventListener);
//       }
//     })
//   })
// }
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
        viewRegistry.push({
            target,
            create(viewController, instance) {
                return __awaiter(this, void 0, void 0, function* () {
                    const el = yield getHTMLElement(viewController, query);
                    el.addEventListener(eventName, (event) => {
                        if (instance[key]) {
                            instance[key](event);
                        }
                    });
                });
            }
        });
        return descriptor;
    };
}
export function Element(query) {
    return function (target, key, descriptor) {
        viewRegistry.push({
            target,
            create(viewController, instance) {
                return __awaiter(this, void 0, void 0, function* () {
                    const el = yield getHTMLElement(viewController, query);
                    instance[key] = el;
                });
            }
        });
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
        // do something
    }
}
export function View(options) {
    return function createView(target, key, descriptor) {
        const instance = function () {
            const paramTypes = Reflect.getMetadata('design:paramtypes', target, key);
            const viewElement = new ViewElement(options.name, options.template);
            const viewController = new ViewController(viewElement);
            const paramValues = paramTypes.map((param, index) => {
                if (param === ViewElement)
                    return viewElement;
                if (param === ViewController)
                    return viewController;
                return arguments[index];
            });
            target.apply(this, paramValues);
            const load = viewRegistry
                .filter(({ target }) => {
                return Object.getPrototypeOf(this) === target;
            })
                .map(({ create }) => {
                return create(viewController, this);
            })
                .reduce((r, p) => p.then(r), Promise.resolve())
                .then(() => {
                if (this.viewDidLoad) {
                    this.viewDidLoad();
                }
            });
        };
        instance.prototype = target.prototype;
        return instance;
    };
}
//# sourceMappingURL=View.js.map