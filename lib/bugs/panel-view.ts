'use babel';

import {
  createGroupButtons,
  createButton,
  createIcon,
  createIconFromPath,
  createText,
  createElement,
  insertElement
} from '../element/index';

export class BugsPanelView {
  private element: HTMLElement;
  constructor () {
    this.element = document.createElement('atom-bugs-panel');
    // Icon
    insertElement(this.element, createIcon('logo'))
    // Run
    insertElement(this.element, createButton([
      createIcon('run'),
      createText('Run')
    ]))
    // Pause
    insertElement(this.element, createButton([
      createIcon('stop')
    ]))
    // Scheme Buttons
    insertElement(this.element, createGroupButtons([
      createButton({
        className: 'bugs-scheme'
      }, [
        createIcon('atom'),
        createText('atom-bugs'),
        createElement('div', {
          className: 'bugs-scheme-arrow'
        })
      ]),
      createButton([
        createIconFromPath('atom://atom-bugs-nodejs/icons/nodejs.svg'),
        createText('Node.js')
      ])
    ]))
  }
  getElement () {
    return this.element;
  }
  destroy () {
    this.element.remove();
  }
}
