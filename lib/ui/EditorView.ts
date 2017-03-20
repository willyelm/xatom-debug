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
    this.currentBreakMarker = null;
    this.currentExpressionMarker = null;
    this.currentEvaluationMarker = null;
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

  private  expressionListener (e: MouseEvent) {
    let sourceFile = this.currentEditor.getPath();
    let bufferPosition = this.getPositionFromEvent(e);
    let scanRange = this.getWordRangeFromPosition(bufferPosition);
    let expression = this.currentEditor.getTextInBufferRange(scanRange);
    clearTimeout(this.evaluateHandler)
    this.evaluateHandler = setTimeout(() => {
      if (expression && String(expression).trim().length > 0) {
        this.events.emit('evaluateExpression', expression, scanRange);
      }
    }, 250);
  }
  createInspectorForElement (element: HTMLElement, result: any, load?: boolean) {
    // value
    if (result.value) {
      console.log('value', result);
      insertElement(element, [createText(result.value)]);
    }
    // object
    if (result.objectId) {
      let loadProperties = () => {
        this.events.emit('requestProperties', result, {
          insertFromDescription: (descriptions: Array<any>) => {
            descriptions.forEach((desc) => {
              if (desc.value) {
                let valueElement = createElement('span', {
                  className: 'property-value'
                });
                let itemElement = insertElement(element, [
                  createElement('atom-bugs-inspector-item', {
                    elements: [
                      createIcon(''),
                      createElement('span', {
                        className: 'property-name',
                        elements: [ createText(desc.name) ]
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
        // get parent
        let icon = element.parentElement.querySelector('.bugs-icon');
        if (icon) {
          icon.classList.add('bugs-icon-indicate');
          icon.addEventListener('click', () => {
            // toggle
            loadProperties();
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
    element.setAttribute('tabindex', '-1');
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
      element.parentElement.addEventListener('mousemove', (e) => {
        e.stopPropagation();
      });
      // element.parentElement.addEventListener('mouseout', () => {
      //   this.removeEvaluationMarker();
      // });
    }, 100);
  }
  removeEvaluationMarker () {
    if (this.currentEvaluationMarker) {
      this.currentEvaluationMarker.destroy();
    }
  }
}
