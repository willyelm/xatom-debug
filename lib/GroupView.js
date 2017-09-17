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
const { CompositeDisposable, Emitter, Disposable } = require('atom');
import { get, forEach, isEqual } from 'lodash';
import { View, ViewElement, Element } from './View';
let GroupView = class GroupView {
    constructor(viewElement, options) {
        this.viewElement = viewElement;
        this.options = options;
        this.groupItems = [];
        this.emitter = new Emitter();
        this.element = this.getElement();
    }
    removeItems() {
        if (this.contentElement) {
            this.contentElement.innerHTML = '';
        }
    }
    getItem(data) {
        return this.groupItems.find((groupItem) => {
            return isEqual(groupItem.data, data);
        });
    }
    removeItem(data) {
        const groupItem = this.getItem(data);
        if (groupItem) {
            groupItem.item.remove();
            const index = this.groupItems.indexOf(groupItem);
            this.groupItems.splice(index, 1);
        }
    }
    activate(item) {
        this.groupItems.forEach((groupItem) => {
            if (groupItem === item) {
                groupItem.item.classList.add('active');
                this.emitter.emit('didSelect', groupItem);
            }
            else {
                groupItem.item.classList.remove('active');
            }
        });
    }
    onDidSelect(cb) {
        return this.emitter.on('didSelect', cb);
    }
    addItem(item, data) {
        const groupItem = {
            item,
            data
        };
        this.groupItems.push(groupItem);
        if (this.options.selectable) {
            item.addEventListener('click', () => this.activate(groupItem));
        }
        this.contentElement.appendChild(groupItem.item);
        return groupItem;
    }
    viewDidLoad() {
        // <i class="xatom-icon" name="step-over"></i>
        this.headerElement.innerHTML = `<span class="xatom-group-title"> ${this.options.title} </span>`;
        forEach(get(this, 'options.actions', []), (value, key) => {
            const button = document.createElement('button');
            button.innerText = key.toString();
            button.classList.add('btn');
            button.addEventListener('click', () => value());
            this.headerElement.appendChild(button);
        });
    }
    getElement() {
        return this.viewElement.element;
    }
};
__decorate([
    Element('.xatom-group-body'),
    __metadata("design:type", HTMLButtonElement)
], GroupView.prototype, "contentElement", void 0);
__decorate([
    Element('.xatom-group-header'),
    __metadata("design:type", HTMLElement)
], GroupView.prototype, "headerElement", void 0);
GroupView = __decorate([
    View({
        name: 'xatom-group',
        template: `<header class="xatom-group-header"></header>
  <section class="xatom-group-body"></section>`
    }),
    __metadata("design:paramtypes", [ViewElement, Object])
], GroupView);
export { GroupView };
//# sourceMappingURL=GroupView.js.map