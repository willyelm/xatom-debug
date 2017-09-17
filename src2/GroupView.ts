'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const { CompositeDisposable, Emitter, Disposable } = require('atom');
import { get, forEach, isEqual } from 'lodash';
import { View, ViewElement, Element } from './View';
import { CallFrame } from './debug';

export interface GroupViewOptions {
  title: string;
  selectable?: boolean;
  actions?: any;
}

@View({
  name: 'xatom-group',
  template: `<header class="xatom-group-header"></header>
  <section class="xatom-group-body"></section>`
})
export class GroupView {
  public element: HTMLElement;
  private groupItems: any[] = [];
  private emitter = new Emitter();
  @Element('.xatom-group-body') contentElement: HTMLButtonElement;
  @Element('.xatom-group-header') headerElement: HTMLElement;
  constructor (
    private viewElement: ViewElement,
    private options: GroupViewOptions) {
    this.element = this.getElement();
  }
  removeItems () {
    if (this.contentElement){
      this.contentElement.innerHTML = '';
    }
  }
  getItem (data: any) {
    return this.groupItems.find((groupItem) => {
      return isEqual(groupItem.data, data);
    });
  }
  removeItem (data: any) {
    const groupItem = this.getItem(data);
    if (groupItem) {
      groupItem.item.remove();
      const index = this.groupItems.indexOf(groupItem);
      this.groupItems.splice(index, 1);
    }
  }
  activate (item) {
    this.groupItems.forEach((groupItem) => {
      if (groupItem === item) {
        groupItem.item.classList.add('active');
        this.emitter.emit('didSelect', groupItem);
      } else {
        groupItem.item.classList.remove('active');
      }
    });
  }
  onDidSelect (cb: Function) {
    return this.emitter.on('didSelect', cb);
  }
  addItem (item: HTMLElement, data: any) {
    const groupItem = {
      item,
      data
    }
    this.groupItems.push(groupItem);
    if (this.options.selectable) {
      item.addEventListener('click', () => this.activate(groupItem));
    }
    this.contentElement.appendChild(groupItem.item);
    return groupItem;
  }
  viewDidLoad () {
    // <i class="xatom-icon" name="step-over"></i>
    this.headerElement.innerHTML = `<span class="xatom-group-title"> ${this.options.title} </span>`;
    forEach(get(this, 'options.actions', []), (value, key) => {
      const button = document.createElement('button');
      button.innerText = key.toString();
      button.classList.add('btn');
      button.addEventListener('click', () => value());
      this.headerElement.appendChild(button);
    })
  }
  getElement () {
    return this.viewElement.element;
  }
}
