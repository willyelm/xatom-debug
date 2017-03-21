'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import {
 createIcon,
 createText,
 createButton,
 createElement,
 insertElement
} from '../element/index';
import { BreakpointManager } from '../BreakpointManager';
import { EventEmitter }  from 'events';

export class EditorView {

  private currentEditor: any;
  private currentBreakMarker: any;
  private currentExpressionMarker: any;
  private currentEvaluationMarker: any;
  private activateExpressionListerner: boolean = true;
  private breakpointHandler: Function;
  private expressionHandler: Function;
  private evaluateHandler: any;
  private events: EventEmitter;

  constructor (private breakpointManager: BreakpointManager) {
    this.events = new EventEmitter();
    this.breakpointHandler = this.breakpointListener.bind(this);
    this.expressionHandler = this.expressionListener.bind(this);
  }

  destroy () {
    this.currentBreakMarker = undefined;
    this.currentExpressionMarker = undefined;
    this.currentEvaluationMarker = undefined;
    this.removeMarkers();
  }

  didEvaluateExpression (cb: Function) {
    this.events.on('evaluateExpression', cb);
  }

  didRequestProperties (cb: Function) {
    this.events.on('requestProperties', cb);
  }

  createBreakMarker (editor, lineNumber: number) {
    this.removeBreakMarker();
    let range = [[lineNumber - 1, 0], [lineNumber - 1, 0]];
    this.currentBreakMarker = editor.markBufferRange(range);
    editor.decorateMarker(this.currentBreakMarker, {
      type: 'line',
      class: 'bugs-break-line'
    })
  }

  removeMarkers () {
    this.removeBreakMarker();
    this.removeExpressionMarker();
    this.removeEvaluationMarker();
  }

  removeBreakMarker () {
    if (this.currentBreakMarker) {
      this.currentBreakMarker.destroy();
    }
  }

  removeExpressionMarker () {
    if (this.currentExpressionMarker) {
      this.currentExpressionMarker.destroy();
    }
  }

  addFeatures (editor) {
    // Observe active editor
    atom.workspace['observeActivePaneItem']((editor) => {
      if (this.currentEditor && this.currentEditor.editorElement) {
        // remove breakpoint handler
        this.currentEditor.editorElement.removeEventListener('click', this.breakpointHandler);
        this.currentEditor.editorElement.removeEventListener('mousemove', this.expressionHandler);
        // remove expression evaluator
      }
      if (editor && editor.getPath && editor.editorElement) {
        this.currentEditor = editor;
        // add breakpoint handler
        this.currentEditor.editorElement.addEventListener('click', this.breakpointHandler)
        this.currentEditor.editorElement.addEventListener('mousemove', this.expressionHandler);
      }
    })
  }

  private breakpointListener (e: MouseEvent) {
    let element = e.target as HTMLElement;
    if (element.classList.contains('line-number')) {
      // toggle breakpoints
      let sourceFile = this.currentEditor.getPath();
      let lineNumber = Number(element.textContent)
      let exists = this.breakpointManager.getBreakpoint(sourceFile, lineNumber)
      if (exists) {
        this.breakpointManager.removeBreakpoint(exists);
      } else {
        let range = [[lineNumber - 1, 0], [lineNumber - 1, 0]]
        let marker = this.currentEditor.markBufferRange(range)
        let decorator = this.currentEditor.decorateMarker(marker, {
          type: 'line-number',
          class: 'bugs-breakpoint'
        })
        this.breakpointManager.addBreakpoint(marker, lineNumber, sourceFile)
      }
    }
  }

  private getPositionFromEvent (e: MouseEvent) {
    let lines = this.currentEditor.editorElement.querySelector('.lines');
    var clientX = e.clientX;
    var clientY = e.clientY;
    let clientRect = lines.getBoundingClientRect();
    let screenPosition = this.currentEditor.screenPositionForPixelPosition({
      top: (clientY - clientRect.top) + this.currentEditor.editorElement.getScrollTop(),
      left: (clientX - clientRect.left) + this.currentEditor.editorElement.getScrollLeft()
    });
    return this.currentEditor.bufferPositionForScreenPosition(screenPosition);
  }

  private getWordRangeFromPosition (position) {
    let prevRow = this.currentEditor.buffer.previousNonBlankRow(position.row);
    let endRow = this.currentEditor.buffer.nextNonBlankRow(position.row);
    if (!endRow) {
      endRow = position.row;
    }
    let startWord = position;
    let endWord = position;
    this.currentEditor.scanInBufferRange(/[ \,\{\}\(\;\)\[\]^\n]+/gm, [[prevRow, 0], position], (s) => {
      if (s.matchText) {
        startWord = s.range.end;
      }
    })
    this.currentEditor.scanInBufferRange(/[ \,\{\}\(\.\;\)\[\]\n]+/g, [position, [endRow, 50]], (s) => {
      if (s.matchText) {
        endWord = s.range.start;
        s.stop();
      }
    })
    return [startWord, endWord];
  }

  private expressionListener (e: MouseEvent) {
    if (this.activateExpressionListerner) {
      let sourceFile = this.currentEditor.getPath();
      let bufferPosition = this.getPositionFromEvent(e);
      let scanRange = this.getWordRangeFromPosition(bufferPosition);
      let expression = this.currentEditor.getTextInBufferRange(scanRange);
      clearTimeout(this.evaluateHandler)
      this.evaluateHandler = setTimeout(() => {
        if (expression && String(expression).trim().length > 0) {
          this.events.emit('evaluateExpression', expression, scanRange);
        }
      }, 500);
    }
  }
  createInspectorForElement (element: HTMLElement, result: any, load?: boolean) {
    // value
    if (!load) {
      console.log('result', result);
      let value = result.value;
      let valueClass = 'syntax--other';
      if (value === null) {
        value = 'null';
      }
      if (value === undefined) {
        value = 'undefined';
      }
      switch(result.type) {
        case 'string':
          value = `"${value}"`;
          valueClass = 'syntax--string';
          break;
        case 'number':
          value = result.value;
          valueClass = 'syntax--constant syntax--numeric';
          break;
        case 'object':
          value = result.description || result.className || value;
          if (result.subtype) {
            valueClass = 'syntax--other';
          } else {
            valueClass = 'syntax--support syntax--class';
          }
          break;
        case 'function':
          value = 'function';//result.className;
          valueClass = 'syntax--keyword';
          // valueClass = 'syntax--entity syntax--name syntax--function';
          break;
      }
      insertElement(element, [
        createElement('span', {
          className: valueClass,
          elements: [createText(value)]
        })
      ]);
    }
    // object
    if (result.objectId) {
      let loadProperties = () => {
        this.events.emit('requestProperties', result, {
          insertFromDescription: (descriptions: Array<any>) => {
            let propertiesElement = createElement('section', {
              className: 'property-properties'
            })
            insertElement(element, [propertiesElement]);
            descriptions.forEach((desc) => {
              if (desc.value) {
                let valueElement = createElement('span', {
                  className: 'property-value'
                });
                let propertyClass = 'property-name';
                if (desc.enumerable === false) {
                  propertyClass += ' syntax--comment';
                } else {
                  propertyClass += ' syntax--variable';
                }
                insertElement(propertiesElement, [
                  createElement('atom-bugs-inspector-item', {
                    elements: [
                      createElement('i', { className: 'bugs-icon' }),
                      createElement('span', {
                        className: propertyClass,
                        elements: [ createText(`${desc.name}:`) ]
                      }),
                      valueElement
                    ]
                  })
                ]);
                this.createInspectorForElement(valueElement, desc.value, false);
              }
            });
          }
        })
      }
      if (load === true) {
        loadProperties();
      } else {
        let item = element.parentElement;
        let request = true;
        let icon = item.querySelector('.bugs-icon');
        if (icon) {
          icon.classList.add('bugs-icon-arrow-right');
          icon.addEventListener('click', (e) => {
            let properties = item.querySelector('.property-properties') as HTMLElement;
            if (icon.classList.contains('bugs-icon-arrow-right')) {
              icon.classList.add('active');
              icon.classList.remove('bugs-icon-arrow-right');
              icon.classList.add('bugs-icon-arrow-down');
              if (request) {
                loadProperties();
              } else {
                properties.style.display = null;
              }
              request = false;
            } else {
              icon.classList.remove('active');
              icon.classList.remove('bugs-icon-arrow-down');
              icon.classList.add('bugs-icon-arrow-right');
              properties.style.display = 'none';
            }
          })
        }
      }
    }
  }
  createInspectorOverlay (result: any) {
    let element = createElement('atom-bugs-overlay', {
      className: 'native-key-bindings'
    });
    let inspectorElement = createElement('atom-bugs-inspector');
    element.setAttribute('tabindex', '0');
    inspectorElement.addEventListener('mousewheel', (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
    });
    this.createInspectorForElement(inspectorElement, result, true);
    return insertElement(element, [
      createElement('atom-bugs-overlay-header', {
        elements: [ createText(result.className || result.type) ]
      }),
      inspectorElement
    ]);
  }
  addEvaluationMarker (result: any, range) {
    // highlight expression
    this.removeExpressionMarker();
    this.currentExpressionMarker = this.currentEditor.markBufferRange(range)
    this.currentEditor.decorateMarker(this.currentExpressionMarker, {
      type: 'highlight',
      class: 'bugs-expression'
    })
    // overlay inspector
    this.removeEvaluationMarker();
    let element = this.createInspectorOverlay(result);
    this.currentEvaluationMarker = this.currentEditor.markBufferRange(range);
    this.currentEditor.decorateMarker(this.currentEvaluationMarker, {
      type: 'overlay',
      class: 'bugs-expression-overlay',
      item: element
    });
    setTimeout(() => {
      // element.focus();
      // element.addEventListener('blur', () => {
      //   this.removeEvaluationMarker();
      // })
      element.addEventListener('mouseenter', () => {
        this.activateExpressionListerner = false;
        element.addEventListener('mouseleave', () => {
          this.activateExpressionListerner = true;
          // this.removeEvaluationMarker();
        })
      })
    }, 0);
    // wait to attach element
    // setTimeout(() => {
    //   // let overlay = element.parentElement;
    //   // overlay.addEventListener('mouseenter', () => {
    //   //   clearTimeout(this.evaluateHandler);
    //   //   overlay.addEventListener('mouseout', () => {
    //   //     this.removeEvaluationMarker();
    //   //   });
    //   // });
    // }, 100);
  }
  removeEvaluationMarker () {
    if (this.currentEvaluationMarker) {
      this.currentEvaluationMarker.destroy();
      this.currentEvaluationMarker = undefined;
    }
  }
}
