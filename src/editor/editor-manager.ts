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
 insertElement,
 attachEventFromObject
} from '../element/index';

import { BreakpointManager, Breakpoint, Breakpoints } from './breakpoint-manager';
import { PluginManager } from '../plugin/index';
import { InspectorView } from '../inspector/index';
import { EventEmitter }  from 'events';

export interface EditorOptions {
  pluginManager: PluginManager,
  didAddBreakpoint?: Function,
  didRemoveBreakpoint?: Function,
  didBreak?: Function,
  didChange?: Function
}

export class EditorManager {

  private currentEditor: any;

  private currentBreakMarker: any;
  private currentExpressionMarker: any;
  private currentEvaluationMarker: any;

  private activateExpressionListerner: boolean = true;

  private breakpointHandler: Function;
  private expressionHandler: Function;
  private evaluateHandler: any;

  private breakpointManager: BreakpointManager;
  private pluginManager: PluginManager;
  private events: EventEmitter;

  constructor (options: EditorOptions) {
    this.events = new EventEmitter();
    this.breakpointManager = new BreakpointManager();
    this.breakpointHandler = this.breakpointListener.bind(this);
    this.expressionHandler = this.expressionListener.bind(this);
    this.pluginManager = options.pluginManager;
    attachEventFromObject(this.events, [
      'didAddBreakpoint',
      'didRemoveBreakpoint',
      'didBreak',
      'didChange'
    ], options);
  }

  restoreBreakpoints (breakpoints: Breakpoints) {
    breakpoints.forEach(({filePath, lineNumber}) => {
      let marker
      if (this.currentEditor && filePath === this.currentEditor.getPath()) {
        marker = this.createBreakpointMarker(lineNumber);
      }
      this.breakpointManager.addBreakpoint(marker, lineNumber, filePath);
      this.events.emit('didAddBreakpoint', filePath, lineNumber);
    })
  }

  getBreakpoints (): Breakpoints {
    return this.breakpointManager.getBreakpoints();
  }

  getPlainBreakpoints (): Breakpoints {
    return this.breakpointManager.getPlainBreakpoints();
  }

  destroy () {
    this.currentBreakMarker = undefined;
    this.currentExpressionMarker = undefined;
    this.currentEvaluationMarker = undefined;
    this.removeMarkers();
  }

  breakOnFile (filePath: string, lineNumber: number) {
    // this.createConsoleLine('', [
    //   createText('Break on'),
    //   createText(`${filePath}:${lineNumber}`)
    // ]);
    this.events.emit('didBreak', filePath, lineNumber);
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

  async addFeatures (editor) {
    // Observe active editor
    if (this.currentEditor && this.currentEditor.editorElement) {
      // remove breakpoint handler
      this.currentEditor.editorElement.removeEventListener('click', this.breakpointHandler);
      // remove expression evaluator
      this.currentEditor.editorElement.removeEventListener('mousemove', this.expressionHandler);
    }
    if (editor && editor.getPath && editor.editorElement !== null) {
      this.currentEditor = editor;
      // restore breakpoints
      let sourceFile = editor.getPath();
      let breakpoints = await this.breakpointManager.getBreakpointsFromFile(sourceFile);
      breakpoints.forEach((breakpoint: Breakpoint) => {
        if (breakpoint.marker) {
          breakpoint.marker.destroy();
        }
        breakpoint.marker = this.createBreakpointMarker(breakpoint.lineNumber);
      })
      // add breakpoint handler
      this.currentEditor.editorElement.addEventListener('click', this.breakpointHandler)
      this.currentEditor.editorElement.addEventListener('mousemove', this.expressionHandler);
    }
  }

  private breakpointListener (e: MouseEvent) {
    let element = e.target as HTMLElement;
    if (element.classList.contains('line-number')) {
      // toggle breakpoints
      let sourceFile = this.currentEditor.getPath();
      let lineNumber = Number(element.textContent)
      let exists = this.breakpointManager.getBreakpoint(sourceFile, lineNumber)
      if (exists) {
        this
          .breakpointManager
          .removeBreakpoint(exists)
          .then(() => {
            this.events.emit('didRemoveBreakpoint', sourceFile, lineNumber);
            this.pluginManager.removeBreakpoint(sourceFile, lineNumber);
          });
      } else {
        let marker = this.createBreakpointMarker(lineNumber);
        this
          .breakpointManager
          .addBreakpoint(marker, lineNumber, sourceFile)
          .then(() => {
            this.events.emit('didAddBreakpoint', sourceFile, lineNumber);
            this.pluginManager.addBreakpoint(sourceFile, lineNumber);
          })
      }
      this.events.emit('didChange');
    }
  }

  private createBreakpointMarker (lineNumber: any) {
    let range = [[lineNumber - 1, 0], [lineNumber - 1, 0]]
    let marker = this.currentEditor.markBufferRange(range)
    let decorator = this.currentEditor.decorateMarker(marker, {
      type: 'line-number',
      class: 'bugs-breakpoint'
    })
    return marker;
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
          this.pluginManager.evaluateExpression(expression, this.createEvaluationView(scanRange));
        }
      }, 500);
    }
  }

  createEvaluationView (range: any) {
    return {
      insertFromResult: (result) => {
        this.addEvaluationMarker(result, range);
      }
    }
  }

  createInspectorOverlay (result: any) {
    let element = createElement('atom-bugs-overlay', {
      className: 'native-key-bindings'
    });
    element.setAttribute('tabindex', '0');
    let inspector = new InspectorView({
      result,
      didRequestProperties: (result, inspectorView) => {
        this.pluginManager.requestProperties(result, inspectorView)
      }
    });
    return insertElement(element, [
      createElement('atom-bugs-overlay-header', {
        elements: [ createText(result.className || result.type) ]
      }),
      inspector.getElement()
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
      let close = () => {
        this.activateExpressionListerner = true;
        this.removeEvaluationMarker();
      }
      // let autoClose = setTimeout(close, 15000);
      element.addEventListener('mouseenter', () => {
        // clearTimeout(autoClose);
        this.activateExpressionListerner = false;
        element.addEventListener('mouseleave', () => close());
      });
    }, 0);
  }

  removeEvaluationMarker () {
    if (this.currentEvaluationMarker) {
      this.currentEvaluationMarker.destroy();
      this.currentEvaluationMarker = undefined;
    }
  }
}
