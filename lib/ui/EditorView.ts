'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
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

  private  expressionListener (e: MouseEvent) {
    let sourceFile = this.currentEditor.getPath();
    let lines = this.currentEditor.editorElement.querySelector('.lines');
    var clientX = e.clientX;
    var clientY = e.clientY;
    let clientRect = lines.getBoundingClientRect();
    let screenPosition = this.currentEditor.screenPositionForPixelPosition({
      top: (clientY - clientRect.top) + this.currentEditor.editorElement.getScrollTop(),
      left: (clientX - clientRect.left) + this.currentEditor.editorElement.getScrollLeft()
    });
    let bufferPosition = this.currentEditor.bufferPositionForScreenPosition(screenPosition);
    let prevRow = this.currentEditor.buffer.previousNonBlankRow(bufferPosition.row);
    let endRow = this.currentEditor.buffer.nextNonBlankRow(bufferPosition.row);
    if (!endRow) {
      endRow = bufferPosition.row;
    }
    let startWord = bufferPosition;
    let endWord = bufferPosition;
    this.currentEditor.scanInBufferRange(/[ \,\{\}\(\;\)\[\]^\n]+/gm, [[prevRow, 0], bufferPosition], (s) => {
      if (s.matchText) {
        startWord = s.range.end;
      }
    })
    this.currentEditor.scanInBufferRange(/[ \,\{\}\(\.\;\)\[\]\n]+/g, [bufferPosition, [endRow, 50]], (s) => {
      if (s.matchText) {
        endWord = s.range.start;
        s.stop();
      }
    })
    let scanRange = [startWord, endWord];
    let expression = this.currentEditor.getTextInBufferRange(scanRange);
    clearTimeout(this.evaluateHandler)
    this.evaluateHandler = setTimeout(() => {
      if (expression && String(expression).trim().length > 0) {
        this.events.emit('evaluateExpression', expression, scanRange);
      }
    }, 250);
  }
  addEvaluationMarker (result, range) {
    // highlight expression
    this.removeExpressionMarker();
    this.currentExpressionMarker = this.currentEditor.markBufferRange(range)
    this.currentEditor.decorateMarker(this.currentExpressionMarker, {
      type: 'highlight',
      class: 'bugs-expression'
    })
    // overlay inspector
    this.removeEvaluationMarker();
    let element = document.createElement('atom-bugs-inspector');
    element.setAttribute('tabindex', '-1');
    element.className = 'native-key-bindings';
    element.innerHTML = JSON.stringify(result);
    this.currentEvaluationMarker = this.currentEditor.markBufferRange(range);
    this.currentEditor.decorateMarker(this.currentEvaluationMarker, {
      type: 'overlay',
      position: 'head',
      class: 'bugs-expression-overlay',
      item: element
    });
    setTimeout(() => {
      element.parentElement.addEventListener('mouseout', () => {
        this.removeEvaluationMarker();
      });
    }, 100);
  }
  removeEvaluationMarker () {
    if (this.currentEvaluationMarker) {
      this.currentEvaluationMarker.destroy();
    }
  }
}
