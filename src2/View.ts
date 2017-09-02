'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { EventEmitter } from 'events';
import 'reflect-metadata';

const viewControllerRegistry = new EventEmitter();
viewControllerRegistry.setMaxListeners(0);

function getViewController (target: any): Promise<{
  viewController: ViewController,
  complete: Function
}> {
  return new Promise ((resolve, reject) => {
    viewControllerRegistry.on('viewControllerLoad', function eventListener (controller: ViewController) {
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
    })
  })
}

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
    getViewController(target).then(async ({ viewController, complete }) => {
      const el = await getHTMLElement(viewController, query);
      el.addEventListener(eventName, (event) => {
        if (target[key]) {
          target[key].apply(viewController.controller, [event]);
        }
      });
      complete();
    });
    return descriptor;
  }
}

export function Element (query: string) {
  return <any> function (target, key, descriptor) {
    getViewController(target).then(async ({ viewController, complete }) => {
      const el = await getHTMLElement(viewController, query);
      target[key] = el;
      complete();
    });
    return descriptor;
  }
}


export function ElementObserver (query: string) {
  return <any> function (target, key, descriptor) {
    getViewController(target).then(async ({ viewController, complete }) => {
      const el = await getHTMLElement(viewController, query);
      target[key] = el;
      complete();
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
  public tasks: Array<any> = [];
  constructor (public viewElement: ViewElement) {
    // do something
  }
}

export function View (options: { name: string, template?: string }) {
  return <any> function (target: any, key: string, descriptor: Object) {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target, key);
    const element = new ViewElement(options.name, options.template);
    const controller = new ViewController(element);
    const paramValues = paramTypes.map((param) => {
      if (param === ViewElement) return element;
      if (param === ViewController) return controller;
      return null;
    });
    const createView: any = function () {
      target.apply(this, paramValues);
      controller.controller = this;
      viewControllerRegistry.emit('viewControllerLoad', controller);
      if (this.viewDidLoad) {
        Promise.all(controller.tasks).then(() => {
          this.viewDidLoad();
        })
      }
      return controller.controller;
    };
    createView.prototype = target.prototype;
    return createView;
  }
}
