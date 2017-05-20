'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { createButton, createIcon, createText, createTextEditor, createElement, insertElement, attachEventFromObject } from '../element/index';
import { InspectorView } from '../inspector/index';
import { EventEmitter } from 'events';
const { CompositeDisposable } = require('atom');
import { parse } from 'path';
export class DebugAreaView {
    constructor(options) {
        this.subscriptions = new CompositeDisposable();
        this.events = new EventEmitter();
        this.pauseButton = createButton({
            click: () => {
                this.events.emit('didPause');
            }
        }, [createIcon('pause'), createText('Pause')]);
        this.resumeButton = createButton({
            click: () => {
                this.events.emit('didResume');
            }
        }, [createIcon('resume'), createText('Resume')]);
        this.togglePause(false);
        let watchInputElement = createTextEditor({
            placeholder: 'Add watch expression',
            keyEvents: {
                '13': () => createExpression(),
                '27': () => resetExpression()
            }
        });
        var resetExpression = () => {
            watchInputElement.getModel().setText('');
            watchInputElement.style.display = 'none';
        };
        var createExpression = () => {
            let watchExpressionText = watchInputElement.getModel().getText();
            if (watchExpressionText.trim().length > 0) {
                this.createExpressionLine(watchExpressionText);
            }
            resetExpression();
        };
        watchInputElement.addEventListener('blur', createExpression);
        resetExpression();
        this.watchExpressionsContentElement = createElement('div');
        this.element = createElement('xatom-debug-area');
        this.watchExpressionContentElement = createElement('xatom-debug-group-content', {
            className: 'watch',
            elements: [watchInputElement, this.watchExpressionsContentElement]
        });
        this.scopeContentElement = createElement('xatom-debug-group-content', {
            className: 'scope'
        });
        this.callStackContentElement = createElement('xatom-debug-group-content', {
            className: 'callstack'
        });
        this.breakpointContentElement = createElement('xatom-debug-group-content', {
            className: 'breakpoint'
        });
        this.resizeElement = createElement('xatom-debug-resize', {
            className: 'resize-left'
        });
        insertElement(this.element, [
            this.resizeElement,
            createElement('xatom-debug-controls', {
                elements: [
                    this.pauseButton,
                    this.resumeButton,
                    createButton({
                        tooltip: {
                            subscriptions: this.subscriptions,
                            title: 'Step Over'
                        },
                        click: () => {
                            this.events.emit('didStepOver');
                        }
                    }, [createIcon('step-over')]),
                    createButton({
                        tooltip: {
                            subscriptions: this.subscriptions,
                            title: 'Step Into'
                        },
                        click: () => {
                            this.events.emit('didStepInto');
                        }
                    }, [createIcon('step-into')]),
                    createButton({
                        tooltip: {
                            subscriptions: this.subscriptions,
                            title: 'Step Out'
                        },
                        click: () => {
                            this.events.emit('didStepOut');
                        }
                    }, [createIcon('step-out')])
                ]
            }),
            createElement('xatom-debug-group', {
                elements: [
                    createElement('xatom-debug-group-header', {
                        elements: [
                            createText('Watch Expressions'),
                            createButton({
                                click: () => {
                                    watchInputElement.style.display = null;
                                    watchInputElement.focus();
                                }
                            }, createIcon('add')),
                            createButton({
                                click: () => {
                                    // refresh
                                }
                            }, createIcon('refresh'))
                        ]
                    }),
                    this.watchExpressionContentElement
                ]
            }),
            createElement('xatom-debug-group', {
                elements: [
                    createElement('xatom-debug-group-header', {
                        elements: [createText('Variables')]
                    }),
                    this.scopeContentElement
                ]
            }),
            createElement('xatom-debug-group', {
                elements: [
                    createElement('xatom-debug-group-header', {
                        elements: [createText('Call Stack')]
                    }),
                    this.callStackContentElement
                ]
            }),
            createElement('xatom-debug-group', {
                elements: [
                    createElement('xatom-debug-group-header', {
                        elements: [createText('Breakpoints')]
                    }),
                    this.breakpointContentElement
                ]
            })
        ]);
        attachEventFromObject(this.events, [
            'didPause',
            'didResume',
            'didStepOver',
            'didStepInto',
            'didStepOut',
            'didBreak',
            'didOpenFile',
            'didRequestProperties',
            'didEvaluateExpression',
            'didOpenFrame'
        ], options);
        window.addEventListener('resize', () => this.adjustDebugArea());
        setTimeout(() => this.adjustDebugArea(), 0);
        this.resizeDebugArea();
    }
    adjustDebugArea() {
        let ignoreElements = ['xatom-debug-controls', 'xatom-debug-group xatom-debug-group-header'];
        let reduce = ignoreElements.reduce((value, query) => {
            let el = this.element.querySelectorAll(query);
            Array.from(el).forEach((child) => {
                value += child.clientHeight;
            });
            return value;
        }, 6);
        let contents = this.element.querySelectorAll('xatom-debug-group xatom-debug-group-content');
        let items = Array.from(contents);
        let availableHeight = (this.element.clientHeight - reduce) / items.length;
        items.forEach((el) => {
            el.style.height = `${availableHeight}px`;
        });
    }
    resizeDebugArea() {
        let initialEvent;
        let resize = (targetEvent) => {
            let offset = initialEvent.screenX - targetEvent.screenX;
            let width = this.element.clientWidth + offset;
            if (width > 240 && width < 600) {
                this.element.style.width = `${width}px`;
            }
            initialEvent = targetEvent;
        };
        this.resizeElement.addEventListener('mousedown', (e) => {
            initialEvent = e;
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mouseup', resize);
                document.removeEventListener('mousemove', resize);
            });
        });
    }
    togglePause(status) {
        this.resumeButton.style.display = status ? null : 'none';
        this.pauseButton.style.display = status ? 'none' : null;
    }
    // Debug
    createFrameLine(frame, indicate) {
        let file = parse(frame.filePath);
        let indicator = createIcon(indicate ? 'arrow-right-solid' : '');
        if (indicate) {
            indicator.classList.add('active');
        }
        return createElement('xatom-debug-group-item', {
            options: {
                click: () => {
                    this.events.emit('didOpenFrame', frame);
                    this.events.emit('didOpenFile', frame.filePath, frame.lineNumber, frame.columnNumber);
                }
            },
            elements: [
                createElement('span', {
                    elements: [indicator, createText(frame.name || '(anonymous)')]
                }),
                createElement('span', {
                    className: 'file-reference',
                    elements: [
                        createText(file.base),
                        createElement('span', {
                            className: 'file-position',
                            elements: [createText(`${frame.lineNumber + 1}${frame.columnNumber > 0 ? ':' + frame.columnNumber : ''}`)]
                        })
                    ]
                })
            ]
        });
    }
    getBreakpointId(filePath, lineNumber) {
        let token = btoa(`${filePath}${lineNumber}`);
        return `breakpoint-${token}`;
    }
    setWorkspace(projectPath) {
        this.projectPath = projectPath;
    }
    createExpressionLine(expressionText) {
        let expressionResult = createElement('div');
        // this.watchExpressionsContentElement
        insertElement(this.watchExpressionsContentElement, createElement('xatom-debug-group-item', {
            options: {
                click() { }
            },
            elements: [
                createText(expressionText),
                expressionResult
            ]
        }));
        // if is running...
        this.events.emit('didEvaluateExpression', expressionText, {
            insertFromResult: (result) => {
                if (result.type === 'object') {
                    result = [{
                            value: result
                        }];
                }
                let inspector = new InspectorView({
                    result,
                    didRequestProperties: (result, inspectorView) => {
                        this.events.emit('didRequestProperties', result, inspectorView);
                    }
                });
                insertElement(expressionResult, inspector.getElement());
            }
        });
    }
    createBreakpointLine(filePath, lineNumber) {
        // let file = parse(filePath)
        let shortName = filePath;
        if (this.projectPath) {
            shortName = filePath.replace(this.projectPath, '');
        }
        insertElement(this.breakpointContentElement, createElement('xatom-debug-group-item', {
            id: this.getBreakpointId(filePath, lineNumber),
            options: {
                click: () => {
                    this.events.emit('didOpenFile', filePath, lineNumber, 0);
                }
            },
            elements: [
                createIcon('break'),
                createElement('span', {
                    // className: 'file-reference',
                    elements: [
                        createElement('span', {
                            className: 'file-position',
                            elements: [createText(String(lineNumber + 1))]
                        }),
                        createText(shortName)
                    ]
                })
            ]
        }));
    }
    removeBreakpointLine(filePath, lineNumber) {
        let id = this.getBreakpointId(filePath, lineNumber);
        let element = this.breakpointContentElement.querySelector(`[id='${id}']`);
        if (element) {
            element.remove();
        }
    }
    clearBreakpoints() {
        this.breakpointContentElement.innerHTML = '';
    }
    insertCallStackFromFrames(frames) {
        this.clearCallStack();
        frames.forEach((frame, index) => {
            return insertElement(this.callStackContentElement, this.createFrameLine(frame, index === 0));
        });
    }
    clearCallStack() {
        this.callStackContentElement.innerHTML = '';
    }
    insertScopeVariables(scope) {
        if (scope) {
            // render scope variables
            this.clearScope();
            let inspector = new InspectorView({
                result: scope,
                didRequestProperties: (result, inspectorView) => {
                    this.events.emit('didRequestProperties', result, inspectorView);
                }
            });
            insertElement(this.scopeContentElement, inspector.getElement());
            // update watch expressions
        }
    }
    clearScope() {
        this.scopeContentElement.innerHTML = '';
    }
    getElement() {
        return this.element;
    }
    // Destroy all
    destroy() {
        this.element.remove();
        this.subscriptions.dispose();
        window.removeEventListener('resize', () => this.adjustDebugArea());
    }
}
//# sourceMappingURL=debug-area-view.js.map