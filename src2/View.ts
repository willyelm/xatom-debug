'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { EventEmitter } from 'events';
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

function getHTMLElement (controller: ViewController, query: string): Promise<HTMLElement> {
  return new Promise ((resolve, reject) => {
    const el = controller.viewElement.element.querySelector(query);
    if (el) {
      resolve(<HTMLElement> el);
    } else {
      reject(`element '${query}' does not exists`);
    }
  })
}


export function Action (eventName: string, query: string) {
  return function (target, key, descriptor) {
    viewRegistry.push({
      target,
      async create (viewController: ViewController, instance: any) {
        const el = await getHTMLElement(viewController, query);
        el.addEventListener(eventName, (event) => {
          if (instance[key]) {
            instance[key](event);
          }
        });
      }
    });
    return descriptor;
  }
}

export function Element (query: string) {
  return <any> function (target, key, descriptor) {
    viewRegistry.push({
      target,
      async create (viewController: ViewController, instance: any) {
        const el = await getHTMLElement(viewController, query);
        instance[key] = el;
      }
    });
    return descriptor;
  }
}

export class ViewElement {
  public element: HTMLElement;
  constructor (elementName: string, template?: string) {
    this.element = document.createElement(elementName);
    this.element.innerHTML = template || '';
  }
}

export class ViewController {
  public controller: any;
  constructor (public viewElement: ViewElement) {
    // do something
  }
}

export function View (options: { name: string, template?: string }) {
  return <any> function createView (target: any, key: string, descriptor: Object) {
    const instance: any = function () {
      const paramTypes = Reflect.getMetadata('design:paramtypes', target, key);
      const viewElement = new ViewElement(options.name, options.template);
      const viewController = new ViewController(viewElement);
      const paramValues = paramTypes.map((param, index) => {
        if (param === ViewElement) return viewElement;
        if (param === ViewController) return viewController;
        return arguments[index];
      });
      target.apply(this, paramValues);
      const load = viewRegistry
        .filter(({target}) => {
          return Object.getPrototypeOf(this) === target;
        })
        .map(({create}) => {
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
  }
}
