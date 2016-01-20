/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'vs/nls', 'vs/base/common/lifecycle', 'vs/base/browser/dom', 'vs/base/common/eventEmitter', 'vs/base/common/errors', 'vs/base/common/timer', 'vs/editor/common/viewModel/viewEventHandler', 'vs/editor/browser/controller/keyboardHandler', 'vs/editor/browser/controller/pointerHandler', 'vs/editor/browser/viewLayout/layoutProvider', 'vs/editor/browser/config/configuration', 'vs/editor/browser/view/viewEventDispatcher', 'vs/editor/browser/view/viewController', 'vs/editor/browser/view/viewOverlays', 'vs/editor/browser/viewParts/viewZones/viewZones', 'vs/editor/browser/viewParts/lines/viewLines', 'vs/editor/browser/viewParts/overviewRuler/overviewRuler', 'vs/editor/browser/viewParts/overviewRuler/decorationsOverviewRuler', 'vs/editor/browser/viewParts/viewCursors/viewCursors', 'vs/editor/browser/viewParts/contentWidgets/contentWidgets', 'vs/editor/browser/viewParts/overlayWidgets/overlayWidgets', 'vs/editor/browser/viewParts/currentLineHighlight/currentLineHighlight', 'vs/editor/browser/viewParts/selections/selections', 'vs/editor/browser/viewParts/decorations/decorations', 'vs/editor/browser/viewParts/glyphMargin/glyphMargin', 'vs/editor/browser/viewParts/linesDecorations/linesDecorations', 'vs/editor/browser/viewParts/lineNumbers/lineNumbers', 'vs/editor/browser/viewParts/scrollDecoration/scrollDecoration', 'vs/base/browser/browser', 'vs/editor/common/editorCommon', 'vs/editor/browser/editorBrowser', 'vs/editor/common/core/range'], function (require, exports, nls, Lifecycle, DomUtils, EventEmitter, Errors, Timer, viewEventHandler_1, keyboardHandler_1, pointerHandler_1, layoutProvider_1, configuration_1, viewEventDispatcher_1, viewController_1, viewOverlays_1, viewZones_1, viewLines_1, overviewRuler_1, decorationsOverviewRuler_1, viewCursors_1, contentWidgets_1, overlayWidgets_1, currentLineHighlight_1, selections_1, decorations_1, glyphMargin_1, linesDecorations_1, lineNumbers_1, scrollDecoration_1, Browser, EditorCommon, EditorBrowser, range_1) {
    var View = (function (_super) {
        __extends(View, _super);
        function View(editorId, configuration, model, keybindingService) {
            var _this = this;
            _super.call(this);
            this._isDisposed = false;
            this._editorId = editorId;
            this._renderAnimationFrame = null;
            this.outgoingEventBus = new EventEmitter.EventEmitter();
            var viewController = new viewController_1.ViewController(model, configuration, this.outgoingEventBus);
            this.listenersToRemove = [];
            this.listenersToDispose = [];
            // The event dispatcher will always go through _renderOnce before dispatching any events
            this.eventDispatcher = new viewEventDispatcher_1.ViewEventDispatcher(function (callback) { return _this._renderOnce(callback); });
            // These two dom nodes must be constructed up front, since references are needed in the layout provider (scrolling & co.)
            this.linesContent = document.createElement('div');
            this.linesContent.className = EditorBrowser.ClassNames.LINES_CONTENT + ' monaco-editor-background';
            this.domNode = document.createElement('div');
            configuration_1.Configuration.applyEditorStyling(this.domNode, configuration.editor.stylingInfo);
            this.overflowGuardContainer = document.createElement('div');
            this.overflowGuardContainer.className = EditorBrowser.ClassNames.OVERFLOW_GUARD;
            // The layout provider has such responsibilities as:
            // - scrolling (i.e. viewport / full size) & co.
            // - whitespaces (a.k.a. view zones) management & co.
            // - line heights updating & co.
            this.layoutProvider = new layoutProvider_1.LayoutProvider(configuration, model, this.eventDispatcher, this.linesContent, this.domNode, this.overflowGuardContainer);
            this.eventDispatcher.addEventHandler(this.layoutProvider);
            // The view context is passed on to most classes (basically to reduce param. counts in ctors)
            this.context = new ViewContext(editorId, configuration, model, this.eventDispatcher, function (eventHandler) { return _this.eventDispatcher.addEventHandler(eventHandler); }, function (eventHandler) { return _this.eventDispatcher.removeEventHandler(eventHandler); });
            this.createTextArea(keybindingService);
            this.createViewParts();
            // Keyboard handler
            this.keyboardHandler = new keyboardHandler_1.KeyboardHandler(this.context, viewController, this.createKeyboardHandlerHelper());
            // Pointer handler
            this.pointerHandler = new pointerHandler_1.PointerHandler(this.context, viewController, this.createPointerHandlerHelper());
            this.hasFocus = false;
            this.codeEditorHelper = null;
            this.eventDispatcher.addEventHandler(this);
            // The view lines rendering calls model.getLineTokens() that might emit events that its tokens have changed.
            // This delayed processing of incoming model events acts as a guard against undesired/unexpected recursion.
            this.handleAccumulatedModelEventsTimeout = -1;
            this.accumulatedModelEvents = [];
            this.listenersToRemove.push(model.addBulkListener(function (events) {
                _this.accumulatedModelEvents = _this.accumulatedModelEvents.concat(events);
                if (_this.handleAccumulatedModelEventsTimeout === -1) {
                    _this.handleAccumulatedModelEventsTimeout = setTimeout(function () {
                        _this.handleAccumulatedModelEventsTimeout = -1;
                        _this._flushAnyAccumulatedEvents();
                    });
                }
            }));
        }
        View.prototype._flushAnyAccumulatedEvents = function () {
            var toEmit = this.accumulatedModelEvents;
            this.accumulatedModelEvents = [];
            if (toEmit.length > 0) {
                this.eventDispatcher.emitMany(toEmit);
            }
        };
        View.prototype.createTextArea = function (keybindingService) {
            var _this = this;
            // Text Area (The focus will always be in the textarea when the cursor is blinking)
            this.textArea = document.createElement('textarea');
            this._keybindingService = keybindingService.createScoped(this.textArea);
            this._editorTextFocusContextKey = this._keybindingService.createKey(EditorCommon.KEYBINDING_CONTEXT_EDITOR_TEXT_FOCUS, undefined);
            this.textArea.className = EditorBrowser.ClassNames.TEXTAREA;
            this.textArea.setAttribute('wrap', 'off');
            this.textArea.setAttribute('autocorrect', 'off');
            this.textArea.setAttribute('autocapitalize', 'off');
            this.textArea.setAttribute('spellcheck', 'false');
            this.textArea.setAttribute('aria-label', nls.localize('editorViewAccessibleLabel', "Editor content"));
            this.textArea.setAttribute('role', 'textbox');
            this.textArea.setAttribute('aria-multiline', 'true');
            DomUtils.StyleMutator.setTop(this.textArea, 0);
            DomUtils.StyleMutator.setLeft(this.textArea, 0);
            // Give textarea same font size & line height as editor, for the IME case (when the textarea is visible)
            DomUtils.StyleMutator.setFontSize(this.textArea, this.context.configuration.editor.fontSize);
            DomUtils.StyleMutator.setLineHeight(this.textArea, this.context.configuration.editor.lineHeight);
            this.listenersToDispose.push(DomUtils.addDisposableListener(this.textArea, 'focus', function () { return _this._setHasFocus(true); }));
            this.listenersToDispose.push(DomUtils.addDisposableListener(this.textArea, 'blur', function () { return _this._setHasFocus(false); }));
            // On top of the text area, we position a dom node to cover it up
            // (there have been reports of tiny blinking cursors)
            // (in WebKit the textarea is 1px by 1px because it cannot handle input to a 0x0 textarea)
            this.textAreaCover = document.createElement('div');
            if (this.context.configuration.editor.glyphMargin) {
                this.textAreaCover.className = 'monaco-editor-background ' + EditorBrowser.ClassNames.GLYPH_MARGIN + ' ' + EditorBrowser.ClassNames.TEXTAREA_COVER;
            }
            else {
                if (this.context.configuration.editor.lineNumbers) {
                    this.textAreaCover.className = 'monaco-editor-background ' + EditorBrowser.ClassNames.LINE_NUMBERS + ' ' + EditorBrowser.ClassNames.TEXTAREA_COVER;
                }
                else {
                    this.textAreaCover.className = 'monaco-editor-background ' + EditorBrowser.ClassNames.TEXTAREA_COVER;
                }
            }
            this.textAreaCover.style.position = 'absolute';
            DomUtils.StyleMutator.setWidth(this.textAreaCover, 1);
            DomUtils.StyleMutator.setHeight(this.textAreaCover, 1);
            DomUtils.StyleMutator.setTop(this.textAreaCover, 0);
            DomUtils.StyleMutator.setLeft(this.textAreaCover, 0);
        };
        View.prototype.createViewParts = function () {
            var _this = this;
            this.viewParts = [];
            // View Lines
            this.viewLines = new viewLines_1.ViewLines(this.context, this.layoutProvider);
            // View Zones
            this.viewZones = new viewZones_1.ViewZones(this.context, this.layoutProvider);
            this.viewParts.push(this.viewZones);
            // Decorations overview ruler
            var decorationsOverviewRuler = new decorationsOverviewRuler_1.DecorationsOverviewRuler(this.context, this.layoutProvider.getScrollHeight(), function (lineNumber) { return _this.layoutProvider.getVerticalOffsetForLineNumber(lineNumber); });
            this.viewParts.push(decorationsOverviewRuler);
            var scrollDecoration = new scrollDecoration_1.ScrollDecorationViewPart(this.context);
            this.viewParts.push(scrollDecoration);
            var contentViewOverlays = new viewOverlays_1.ContentViewOverlays(this.context, this.layoutProvider);
            this.viewParts.push(contentViewOverlays);
            contentViewOverlays.addDynamicOverlay(new currentLineHighlight_1.CurrentLineHighlightOverlay(this.context, this.layoutProvider));
            contentViewOverlays.addDynamicOverlay(new selections_1.SelectionsOverlay(this.context));
            contentViewOverlays.addDynamicOverlay(new decorations_1.DecorationsOverlay(this.context));
            var marginViewOverlays = new viewOverlays_1.MarginViewOverlays(this.context, this.layoutProvider);
            this.viewParts.push(marginViewOverlays);
            marginViewOverlays.addDynamicOverlay(new glyphMargin_1.GlyphMarginOverlay(this.context));
            marginViewOverlays.addDynamicOverlay(new linesDecorations_1.LinesDecorationsOverlay(this.context));
            marginViewOverlays.addDynamicOverlay(new lineNumbers_1.LineNumbersOverlay(this.context));
            // Content widgets
            this.contentWidgets = new contentWidgets_1.ViewContentWidgets(this.context, this.domNode);
            this.viewParts.push(this.contentWidgets);
            var viewCursors = new viewCursors_1.ViewCursors(this.context);
            this.viewParts.push(viewCursors);
            // Overlay widgets
            this.overlayWidgets = new overlayWidgets_1.ViewOverlayWidgets(this.context);
            this.viewParts.push(this.overlayWidgets);
            // -------------- Wire dom nodes up
            this.linesContentContainer = this.layoutProvider.getScrollbarContainerDomNode();
            this.linesContentContainer.style.position = 'absolute';
            if (decorationsOverviewRuler) {
                var overviewRulerData = this.layoutProvider.getOverviewRulerInsertData();
                overviewRulerData.parent.insertBefore(decorationsOverviewRuler.getDomNode(), overviewRulerData.insertBefore);
            }
            this.linesContent.appendChild(contentViewOverlays.getDomNode());
            this.linesContent.appendChild(this.viewZones.domNode);
            this.linesContent.appendChild(this.viewLines.domNode);
            this.linesContent.appendChild(this.contentWidgets.domNode);
            this.linesContent.appendChild(viewCursors.getDomNode());
            this.overflowGuardContainer.appendChild(marginViewOverlays.getDomNode());
            this.overflowGuardContainer.appendChild(this.linesContentContainer);
            this.overflowGuardContainer.appendChild(scrollDecoration.getDomNode());
            this.overflowGuardContainer.appendChild(this.overlayWidgets.domNode);
            this.overflowGuardContainer.appendChild(this.textArea);
            this.overflowGuardContainer.appendChild(this.textAreaCover);
            this.domNode.appendChild(this.overflowGuardContainer);
            this.domNode.appendChild(this.contentWidgets.overflowingContentWidgetsDomNode);
        };
        View.prototype._flushAccumulatedAndRenderNow = function () {
            this._flushAnyAccumulatedEvents();
            this._renderNow();
        };
        View.prototype.createPointerHandlerHelper = function () {
            var _this = this;
            return {
                viewDomNode: this.domNode,
                linesContentDomNode: this.linesContent,
                focusTextArea: function () {
                    if (_this._isDisposed) {
                        throw new Error('ViewImpl.pointerHandler.focusTextArea: View is disposed');
                    }
                    _this.focus();
                },
                isDirty: function () {
                    return (_this.accumulatedModelEvents.length > 0);
                },
                getScrollTop: function () {
                    if (_this._isDisposed) {
                        throw new Error('ViewImpl.pointerHandler.getScrollTop: View is disposed');
                    }
                    return _this.layoutProvider.getScrollTop();
                },
                setScrollTop: function (scrollTop) {
                    if (_this._isDisposed) {
                        throw new Error('ViewImpl.pointerHandler.setScrollTop: View is disposed');
                    }
                    _this.layoutProvider.setScrollTop(scrollTop);
                },
                getScrollLeft: function () {
                    if (_this._isDisposed) {
                        throw new Error('ViewImpl.pointerHandler.getScrollLeft: View is disposed');
                    }
                    return _this.layoutProvider.getScrollLeft();
                },
                setScrollLeft: function (scrollLeft) {
                    if (_this._isDisposed) {
                        throw new Error('ViewImpl.pointerHandler.setScrollLeft: View is disposed');
                    }
                    _this.layoutProvider.setScrollLeft(scrollLeft);
                },
                isAfterLines: function (verticalOffset) {
                    if (_this._isDisposed) {
                        throw new Error('ViewImpl.pointerHandler.isAfterLines: View is disposed');
                    }
                    return _this.layoutProvider.isAfterLines(verticalOffset);
                },
                getLineNumberAtVerticalOffset: function (verticalOffset) {
                    if (_this._isDisposed) {
                        throw new Error('ViewImpl.pointerHandler.getLineNumberAtVerticalOffset: View is disposed');
                    }
                    return _this.layoutProvider.getLineNumberAtVerticalOffset(verticalOffset);
                },
                getVerticalOffsetForLineNumber: function (lineNumber) {
                    if (_this._isDisposed) {
                        throw new Error('ViewImpl.pointerHandler.getVerticalOffsetForLineNumber: View is disposed');
                    }
                    return _this.layoutProvider.getVerticalOffsetForLineNumber(lineNumber);
                },
                getWhitespaceAtVerticalOffset: function (verticalOffset) {
                    if (_this._isDisposed) {
                        throw new Error('ViewImpl.pointerHandler.getWhitespaceAtVerticalOffset: View is disposed');
                    }
                    return _this.layoutProvider.getWhitespaceAtVerticalOffset(verticalOffset);
                },
                shouldSuppressMouseDownOnViewZone: function (viewZoneId) {
                    if (_this._isDisposed) {
                        throw new Error('ViewImpl.pointerHandler.shouldSuppressMouseDownOnViewZone: View is disposed');
                    }
                    return _this.viewZones.shouldSuppressMouseDownOnViewZone(viewZoneId);
                },
                getPositionFromDOMInfo: function (spanNode, offset) {
                    if (_this._isDisposed) {
                        throw new Error('ViewImpl.pointerHandler.getPositionFromDOMInfo: View is disposed');
                    }
                    _this._flushAccumulatedAndRenderNow();
                    return _this.viewLines.getPositionFromDOMInfo(spanNode, offset);
                },
                visibleRangeForPosition2: function (lineNumber, column) {
                    if (_this._isDisposed) {
                        throw new Error('ViewImpl.pointerHandler.visibleRangeForPosition2: View is disposed');
                    }
                    _this._flushAccumulatedAndRenderNow();
                    var visibleRanges = _this.viewLines.visibleRangesForRange2(new range_1.Range(lineNumber, column, lineNumber, column), 0);
                    if (!visibleRanges) {
                        return null;
                    }
                    return visibleRanges[0];
                },
                getLineWidth: function (lineNumber) {
                    if (_this._isDisposed) {
                        throw new Error('ViewImpl.pointerHandler.getLineWidth: View is disposed');
                    }
                    _this._flushAccumulatedAndRenderNow();
                    return _this.viewLines.getLineWidth(lineNumber);
                }
            };
        };
        View.prototype.createKeyboardHandlerHelper = function () {
            var _this = this;
            return {
                viewDomNode: this.domNode,
                textArea: this.textArea,
                visibleRangeForPositionRelativeToEditor: function (lineNumber, column) {
                    if (_this._isDisposed) {
                        throw new Error('ViewImpl.keyboardHandler.visibleRangeForPositionRelativeToEditor: View is disposed');
                    }
                    _this._flushAccumulatedAndRenderNow();
                    var linesViewPortData = _this.layoutProvider.getLinesViewportData();
                    var correctionTop = 0;
                    var visibleRanges = _this.viewLines.visibleRangesForRange2(new range_1.Range(lineNumber, column, lineNumber, column), linesViewPortData.visibleRangesDeltaTop);
                    if (!visibleRanges) {
                        return null;
                    }
                    return visibleRanges[0];
                }
            };
        };
        // --- begin event handlers
        View.prototype.onLayoutChanged = function (layoutInfo) {
            if (Browser.isChrome) {
                // Access overflowGuardContainer.clientWidth to prevent relayouting bug in Chrome
                // See Bug 19676: Editor misses a layout event
                var clientWidth = this.overflowGuardContainer.clientWidth + 'px';
            }
            DomUtils.StyleMutator.setWidth(this.domNode, layoutInfo.width);
            DomUtils.StyleMutator.setHeight(this.domNode, layoutInfo.height);
            DomUtils.StyleMutator.setWidth(this.overflowGuardContainer, layoutInfo.width);
            DomUtils.StyleMutator.setHeight(this.overflowGuardContainer, layoutInfo.height);
            DomUtils.StyleMutator.setWidth(this.linesContent, 1000000);
            DomUtils.StyleMutator.setHeight(this.linesContent, 1000000);
            DomUtils.StyleMutator.setLeft(this.linesContentContainer, layoutInfo.contentLeft);
            DomUtils.StyleMutator.setWidth(this.linesContentContainer, layoutInfo.contentWidth);
            DomUtils.StyleMutator.setHeight(this.linesContentContainer, layoutInfo.contentHeight);
            this.outgoingEventBus.emit(EditorCommon.EventType.ViewLayoutChanged, layoutInfo);
            return false;
        };
        View.prototype.onConfigurationChanged = function (e) {
            if (e.stylingInfo) {
                configuration_1.Configuration.applyEditorStyling(this.domNode, this.context.configuration.editor.stylingInfo);
            }
            // Give textarea same font size & line height as editor, for the IME case (when the textarea is visible)
            DomUtils.StyleMutator.setFontSize(this.textArea, this.context.configuration.editor.fontSize);
            DomUtils.StyleMutator.setLineHeight(this.textArea, this.context.configuration.editor.lineHeight);
            return false;
        };
        View.prototype.onScrollChanged = function (e) {
            this.outgoingEventBus.emit('scroll', {
                scrollTop: this.layoutProvider.getScrollTop(),
                scrollLeft: this.layoutProvider.getScrollLeft()
            });
            return false;
        };
        View.prototype.onScrollHeightChanged = function (scrollHeight) {
            this.outgoingEventBus.emit('scrollSize', {
                scrollWidth: this.layoutProvider.getScrollWidth(),
                scrollHeight: this.layoutProvider.getScrollHeight()
            });
            return _super.prototype.onScrollHeightChanged.call(this, scrollHeight);
        };
        View.prototype.onViewFocusChanged = function (isFocused) {
            DomUtils.toggleClass(this.domNode, 'focused', isFocused);
            if (isFocused) {
                this._editorTextFocusContextKey.set(true);
                this.outgoingEventBus.emit(EditorCommon.EventType.ViewFocusGained, {});
            }
            else {
                this._editorTextFocusContextKey.reset();
                this.outgoingEventBus.emit(EditorCommon.EventType.ViewFocusLost, {});
            }
            return false;
        };
        // --- end event handlers
        View.prototype.dispose = function () {
            this._isDisposed = true;
            if (this.handleAccumulatedModelEventsTimeout !== -1) {
                clearTimeout(this.handleAccumulatedModelEventsTimeout);
                this.handleAccumulatedModelEventsTimeout = -1;
            }
            if (this._renderAnimationFrame !== null) {
                this._renderAnimationFrame.dispose();
                this._renderAnimationFrame = null;
            }
            this.accumulatedModelEvents = [];
            this.eventDispatcher.removeEventHandler(this);
            this.outgoingEventBus.dispose();
            this.listenersToRemove.forEach(function (element) {
                element();
            });
            this.listenersToRemove = [];
            this.listenersToDispose = Lifecycle.disposeAll(this.listenersToDispose);
            this.keyboardHandler.dispose();
            this.pointerHandler.dispose();
            this.viewLines.dispose();
            // Destroy IViewPart second
            for (var i = 0, len = this.viewParts.length; i < len; i++) {
                this.viewParts[i].dispose();
            }
            this.viewParts = [];
            this.layoutProvider.dispose();
            this._keybindingService.dispose();
        };
        View.prototype.getCodeEditorHelper = function () {
            var _this = this;
            if (!this.codeEditorHelper) {
                this.codeEditorHelper = {
                    getScrollTop: function () {
                        if (_this._isDisposed) {
                            throw new Error('ViewImpl.codeEditorHelper.getScrollTop: View is disposed');
                        }
                        return _this.layoutProvider.getScrollTop();
                    },
                    setScrollTop: function (scrollTop) {
                        if (_this._isDisposed) {
                            throw new Error('ViewImpl.codeEditorHelper.setScrollTop: View is disposed');
                        }
                        _this.layoutProvider.setScrollTop(scrollTop);
                    },
                    getScrollLeft: function () {
                        if (_this._isDisposed) {
                            throw new Error('ViewImpl.codeEditorHelper.getScrollLeft: View is disposed');
                        }
                        return _this.layoutProvider.getScrollLeft();
                    },
                    setScrollLeft: function (scrollLeft) {
                        if (_this._isDisposed) {
                            throw new Error('ViewImpl.codeEditorHelper.setScrollLeft: View is disposed');
                        }
                        _this.layoutProvider.setScrollLeft(scrollLeft);
                    },
                    getScrollHeight: function () {
                        if (_this._isDisposed) {
                            throw new Error('ViewImpl.codeEditorHelper.getScrollHeight: View is disposed');
                        }
                        return _this.layoutProvider.getScrollHeight();
                    },
                    getScrollWidth: function () {
                        if (_this._isDisposed) {
                            throw new Error('ViewImpl.codeEditorHelper.getScrollWidth: View is disposed');
                        }
                        return _this.layoutProvider.getScrollWidth();
                    },
                    getVerticalOffsetForPosition: function (modelLineNumber, modelColumn) {
                        if (_this._isDisposed) {
                            throw new Error('ViewImpl.codeEditorHelper.getVerticalOffsetForPosition: View is disposed');
                        }
                        var modelPosition = _this.context.model.validateModelPosition({
                            lineNumber: modelLineNumber,
                            column: modelColumn
                        });
                        var viewPosition = _this.context.model.convertModelPositionToViewPosition(modelPosition.lineNumber, modelPosition.column);
                        return _this.layoutProvider.getVerticalOffsetForLineNumber(viewPosition.lineNumber);
                    },
                    delegateVerticalScrollbarMouseDown: function (browserEvent) {
                        if (_this._isDisposed) {
                            throw new Error('ViewImpl.codeEditorHelper.delegateVerticalScrollbarMouseDown: View is disposed');
                        }
                        _this.layoutProvider.delegateVerticalScrollbarMouseDown(browserEvent);
                    },
                    getOffsetForColumn: function (modelLineNumber, modelColumn) {
                        if (_this._isDisposed) {
                            throw new Error('ViewImpl.codeEditorHelper.getOffsetForColumn: View is disposed');
                        }
                        var modelPosition = _this.context.model.validateModelPosition({
                            lineNumber: modelLineNumber,
                            column: modelColumn
                        });
                        var viewPosition = _this.context.model.convertModelPositionToViewPosition(modelPosition.lineNumber, modelPosition.column);
                        _this._flushAccumulatedAndRenderNow();
                        var visibleRanges = _this.viewLines.visibleRangesForRange2(new range_1.Range(viewPosition.lineNumber, viewPosition.column, viewPosition.lineNumber, viewPosition.column), 0);
                        if (!visibleRanges) {
                            return -1;
                        }
                        return visibleRanges[0].left;
                    }
                };
            }
            return this.codeEditorHelper;
        };
        View.prototype.getCenteredRangeInViewport = function () {
            if (this._isDisposed) {
                throw new Error('ViewImpl.getCenteredRangeInViewport: View is disposed');
            }
            var viewLineNumber = this.layoutProvider.getCenteredViewLineNumberInViewport();
            var viewModel = this.context.model;
            var currentCenteredViewRange = new range_1.Range(viewLineNumber, 1, viewLineNumber, viewModel.getLineMaxColumn(viewLineNumber));
            return viewModel.convertViewRangeToModelRange(currentCenteredViewRange);
        };
        //	public getLineInfoProvider():view.ILineInfoProvider {
        //		return this.viewLines;
        //	}
        View.prototype.getInternalEventBus = function () {
            if (this._isDisposed) {
                throw new Error('ViewImpl.getInternalEventBus: View is disposed');
            }
            return this.outgoingEventBus;
        };
        View.prototype.saveState = function () {
            if (this._isDisposed) {
                throw new Error('ViewImpl.saveState: View is disposed');
            }
            return this.layoutProvider.saveState();
        };
        View.prototype.restoreState = function (state) {
            if (this._isDisposed) {
                throw new Error('ViewImpl.restoreState: View is disposed');
            }
            this._flushAnyAccumulatedEvents();
            return this.layoutProvider.restoreState(state);
        };
        View.prototype.focus = function () {
            if (this._isDisposed) {
                throw new Error('ViewImpl.focus: View is disposed');
            }
            // Chrome does not trigger the focus event at all if focus is in url bar and clicking into the editor
            // Calling .focus() and then .select() seems to be a good workaround for Chrome in this case
            var state = DomUtils.saveParentsScrollTop(this.textArea);
            this.textArea.focus();
            DomUtils.selectTextInInputElement(this.textArea);
            DomUtils.restoreParentsScrollTop(this.textArea, state);
            // IE does not trigger the focus event immediately, so we must help it a little bit
            this._setHasFocus(true);
        };
        View.prototype.isFocused = function () {
            if (this._isDisposed) {
                throw new Error('ViewImpl.isFocused: View is disposed');
            }
            return this.hasFocus;
        };
        View.prototype.createOverviewRuler = function (cssClassName, minimumHeight, maximumHeight) {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('ViewImpl.createOverviewRuler: View is disposed');
            }
            return new overviewRuler_1.OverviewRuler(this.context, cssClassName, this.layoutProvider.getScrollHeight(), minimumHeight, maximumHeight, function (lineNumber) { return _this.layoutProvider.getVerticalOffsetForLineNumber(lineNumber); });
        };
        View.prototype.change = function (callback) {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('ViewImpl.change: View is disposed');
            }
            var zonesHaveChanged = false;
            this._renderOnce(function () {
                // Handle events to avoid "adjusting" newly inserted view zones
                _this._flushAnyAccumulatedEvents();
                var changeAccessor = {
                    addZone: function (zone) {
                        zonesHaveChanged = true;
                        return _this.viewZones.addZone(zone);
                    },
                    removeZone: function (id) {
                        zonesHaveChanged = _this.viewZones.removeZone(id) || zonesHaveChanged;
                    },
                    layoutZone: function (id) {
                        zonesHaveChanged = _this.viewZones.layoutZone(id) || zonesHaveChanged;
                    }
                };
                var r = null;
                try {
                    r = callback(changeAccessor);
                }
                catch (e) {
                    Errors.onUnexpectedError(e);
                }
                // Invalidate changeAccessor
                changeAccessor.addZone = null;
                changeAccessor.removeZone = null;
                if (zonesHaveChanged) {
                    _this.context.privateViewEventBus.emit(EditorCommon.EventType.ViewZonesChanged, null);
                }
                return r;
            });
            return zonesHaveChanged;
        };
        View.prototype.getWhitespaces = function () {
            if (this._isDisposed) {
                throw new Error('ViewImpl.getWhitespaces: View is disposed');
            }
            return this.layoutProvider.getWhitespaces();
        };
        View.prototype.addContentWidget = function (widgetData) {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('ViewImpl.addContentWidget: View is disposed');
            }
            this._renderOnce(function () {
                _this.contentWidgets.addWidget(widgetData.widget);
                _this.layoutContentWidget(widgetData);
            });
        };
        View.prototype.layoutContentWidget = function (widgetData) {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('ViewImpl.layoutContentWidget: View is disposed');
            }
            this._renderOnce(function () {
                var position1 = widgetData.position ? widgetData.position.position : null;
                var preference1 = widgetData.position ? widgetData.position.preference : null;
                _this.contentWidgets.setWidgetPosition(widgetData.widget, position1, preference1);
            });
        };
        View.prototype.removeContentWidget = function (widgetData) {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('ViewImpl.removeContentWidget: View is disposed');
            }
            this._renderOnce(function () {
                _this.contentWidgets.removeWidget(widgetData.widget);
            });
        };
        View.prototype.addOverlayWidget = function (widgetData) {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('ViewImpl.addOverlayWidget: View is disposed');
            }
            this._renderOnce(function () {
                _this.overlayWidgets.addWidget(widgetData.widget);
                _this.layoutOverlayWidget(widgetData);
            });
        };
        View.prototype.layoutOverlayWidget = function (widgetData) {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('ViewImpl.layoutOverlayWidget: View is disposed');
            }
            this._renderOnce(function () {
                var preference2 = widgetData.position ? widgetData.position.preference : null;
                _this.overlayWidgets.setWidgetPosition(widgetData.widget, preference2);
            });
        };
        View.prototype.removeOverlayWidget = function (widgetData) {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('ViewImpl.removeOverlayWidget: View is disposed');
            }
            this._renderOnce(function () {
                _this.overlayWidgets.removeWidget(widgetData.widget);
            });
        };
        View.prototype.render = function (now) {
            if (this._isDisposed) {
                throw new Error('ViewImpl.render: View is disposed');
            }
            // Force a render with a layout event
            this.layoutProvider.emitLayoutChangedEvent();
            if (now) {
                this._flushAccumulatedAndRenderNow();
            }
        };
        View.prototype.renderOnce = function (callback) {
            if (this._isDisposed) {
                throw new Error('ViewImpl.renderOnce: View is disposed');
            }
            return this._renderOnce(callback);
        };
        // --- end Code Editor APIs
        View.prototype._renderOnce = function (callback) {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('ViewImpl._renderOnce: View is disposed');
            }
            return this.outgoingEventBus.deferredEmit(function () {
                try {
                    var r = callback ? callback() : null;
                }
                finally {
                    _this._scheduleRender();
                }
                return r;
            });
        };
        View.prototype._scheduleRender = function () {
            if (this._isDisposed) {
                throw new Error('ViewImpl._scheduleRender: View is disposed');
            }
            if (this._renderAnimationFrame === null) {
                this._renderAnimationFrame = DomUtils.runAtThisOrScheduleAtNextAnimationFrame(this._onRenderScheduled.bind(this), 100);
            }
        };
        View.prototype._onRenderScheduled = function () {
            this._renderAnimationFrame = null;
            this._flushAccumulatedAndRenderNow();
        };
        View.prototype._renderNow = function () {
            if (this._isDisposed) {
                throw new Error('ViewImpl._renderNow: View is disposed');
            }
            this.actualRender();
        };
        View.prototype.createRenderingContext = function (linesViewportData) {
            var _this = this;
            var vInfo = this.layoutProvider.getCurrentViewport();
            var deltaTop = linesViewportData.visibleRangesDeltaTop;
            var r = {
                linesViewportData: linesViewportData,
                scrollWidth: this.layoutProvider.getScrollWidth(),
                scrollHeight: this.layoutProvider.getScrollHeight(),
                visibleRange: linesViewportData.visibleRange,
                bigNumbersDelta: linesViewportData.bigNumbersDelta,
                viewportWidth: vInfo.width,
                viewportHeight: vInfo.height,
                viewportLeft: vInfo.left,
                viewportTop: vInfo.top,
                getScrolledTopFromAbsoluteTop: function (absoluteTop) {
                    return _this.layoutProvider.getScrolledTopFromAbsoluteTop(absoluteTop);
                },
                getViewportVerticalOffsetForLineNumber: function (lineNumber) {
                    var verticalOffset = _this.layoutProvider.getVerticalOffsetForLineNumber(lineNumber);
                    var scrolledTop = _this.layoutProvider.getScrolledTopFromAbsoluteTop(verticalOffset);
                    return scrolledTop;
                },
                getDecorationsInViewport: function () { return linesViewportData.getDecorationsInViewport(); },
                linesVisibleRangesForRange: function (range, includeNewLines) {
                    return _this.viewLines.linesVisibleRangesForRange(range, includeNewLines);
                },
                visibleRangeForPosition: function (position) {
                    var visibleRanges = _this.viewLines.visibleRangesForRange2(new range_1.Range(position.lineNumber, position.column, position.lineNumber, position.column), deltaTop);
                    if (!visibleRanges) {
                        return null;
                    }
                    return visibleRanges[0];
                },
                lineIsVisible: function (lineNumber) {
                    return linesViewportData.visibleRange.startLineNumber <= lineNumber && lineNumber <= linesViewportData.visibleRange.endLineNumber;
                }
            };
            return r;
        };
        View.prototype.actualRender = function () {
            if (this._isDisposed) {
                throw new Error('ViewImpl.actualRender: View is disposed');
            }
            if (!DomUtils.isInDOM(this.domNode)) {
                return;
            }
            var t = Timer.start(Timer.Topic.EDITOR, 'View.render');
            var i, len;
            try {
                for (i = 0, len = this.viewParts.length; i < len; i++) {
                    this.viewParts[i].onBeforeForcedLayout();
                }
                var linesViewportData = this.viewLines.render();
                var renderingContext = this.createRenderingContext(linesViewportData);
                // Render the rest of the parts
                for (i = 0, len = this.viewParts.length; i < len; i++) {
                    this.viewParts[i].onReadAfterForcedLayout(renderingContext);
                }
                for (i = 0, len = this.viewParts.length; i < len; i++) {
                    this.viewParts[i].onWriteAfterForcedLayout();
                }
            }
            catch (err) {
                Errors.onUnexpectedError(err);
            }
            t.stop();
        };
        View.prototype._setHasFocus = function (newHasFocus) {
            if (this.hasFocus !== newHasFocus) {
                this.hasFocus = newHasFocus;
                this.context.privateViewEventBus.emit(EditorCommon.EventType.ViewFocusChanged, this.hasFocus);
            }
        };
        return View;
    })(viewEventHandler_1.ViewEventHandler);
    exports.View = View;
    var ViewContext = (function () {
        function ViewContext(editorId, configuration, model, privateViewEventBus, addEventHandler, removeEventHandler) {
            this.editorId = editorId;
            this.configuration = configuration;
            this.model = model;
            this.privateViewEventBus = privateViewEventBus;
            this.addEventHandler = addEventHandler;
            this.removeEventHandler = removeEventHandler;
        }
        return ViewContext;
    })();
});
//# sourceMappingURL=viewImpl.js.map