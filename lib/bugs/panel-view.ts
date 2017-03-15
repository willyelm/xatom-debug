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
  private currentScheme: {
    icon: HTMLElement,
    name: Text
  };
  constructor () {
    this.element = document.createElement('atom-bugs-panel');
    this.currentScheme = {
      icon: createIconFromPath(''),
      name: createText('')
    };

    // Icon
    insertElement(this.element, createIcon('logo'))
    // Run
    insertElement(this.element, createButton({
      click () {
        let panel = document.createElement('div');
        panel.innerHTML = '<div class="figure"></div>';
        atom.workspace.addModalPanel({
          item: panel
        })
      }
    },[
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
        this.currentScheme.icon,
        this.currentScheme.name
      ])
    ]))
  }
  getSelectedSchemeName () {
    return 'Node.js';
  }
  setScheme (scheme) {
    this.currentScheme.icon.style.backgroundImage = `url(${scheme.iconPath})`;
    this.currentScheme.name.nodeValue = ` ${scheme.name}`
  }
  getElement () {
    return this.element;
  }
  destroy () {
    this.element.remove();
  }
}
