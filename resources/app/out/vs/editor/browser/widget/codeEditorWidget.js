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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", 'vs/editor/common/editorCommon', 'vs/base/browser/browser', 'vs/editor/browser/standalone/colorizer', 'vs/base/common/errors', 'vs/base/browser/dom', 'vs/editor/browser/config/configuration', 'vs/editor/browser/view/viewImpl', 'vs/editor/browser/editorBrowserExtensions', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/services/codeEditorService', 'vs/editor/common/core/range', 'vs/editor/common/core/selection', 'vs/platform/instantiation/common/instantiation', 'vs/platform/telemetry/common/telemetry', 'vs/platform/keybinding/common/keybindingService', 'vs/editor/common/commonCodeEditor', 'vs/css!./media/editor', 'vs/css!./media/tokens', 'vs/css!./media/default-theme'], function (require, exports, EditorCommon, Browser, colorizer_1, errors_1, DOM, configuration_1, viewImpl_1, editorBrowserExtensions_1, editorCommonExtensions_1, codeEditorService_1, range_1, selection_1, instantiation_1, telemetry_1, keybindingService_1, commonCodeEditor_1) {
    var CodeEditorWidget = (function (_super) {
        __extends(CodeEditorWidget, _super);
        function CodeEditorWidget(domElement, options, instantiationService, codeEditorService, keybindingService, telemetryService) {
            var _this = this;
            this.domElement = domElement;
            _super.call(this, domElement, options, instantiationService, codeEditorService, keybindingService, telemetryService);
            // track focus of the domElement and all its anchestors
            this.focusTracker = DOM.trackFocus(this.domElement);
            this.focusTracker.addFocusListener(function () {
                if (_this.forcedWidgetFocusCount === 0) {
                    _this._editorFocusContextKey.set(true);
                    _this.emit(EditorCommon.EventType.EditorFocus, {});
                }
            });
            this.focusTracker.addBlurListener(function () {
                if (_this.forcedWidgetFocusCount === 0) {
                    _this._editorFocusContextKey.reset();
                    _this.emit(EditorCommon.EventType.EditorBlur, {});
                }
            });
            this.contentWidgets = {};
            this.overlayWidgets = {};
            var contributionDescriptors = [].concat(editorBrowserExtensions_1.EditorBrowserRegistry.getEditorContributions()).concat(editorCommonExtensions_1.CommonEditorRegistry.getEditorContributions());
            for (var i = 0, len = contributionDescriptors.length; i < len; i++) {
                try {
                    var contribution = contributionDescriptors[i].createInstance(this._instantiationService, this);
                    this.contributions[contribution.getId()] = contribution;
                }
                catch (err) {
                    console.error('Could not instantiate contribution ' + contribution.getId());
                    errors_1.onUnexpectedError(err);
                }
            }
        }
        CodeEditorWidget.prototype._createConfiguration = function (options, indentationGuesser) {
            return new configuration_1.Configuration(options, this.domElement, indentationGuesser);
        };
        CodeEditorWidget.prototype.dispose = function () {
            this.contentWidgets = {};
            this.overlayWidgets = {};
            this.focusTracker.dispose();
            _super.prototype.dispose.call(this);
        };
        CodeEditorWidget.prototype.colorizeModelLine = function (lineNumber, model) {
            if (model === void 0) { model = this.model; }
            if (!model) {
                return '';
            }
            var content = model.getLineContent(lineNumber);
            var tokens = model.getLineTokens(lineNumber, false);
            var inflatedTokens = EditorCommon.LineTokensBinaryEncoding.inflateArr(tokens.getBinaryEncodedTokensMap(), tokens.getBinaryEncodedTokens());
            var indent = this._configuration.getIndentationOptions();
            return colorizer_1.colorizeLine(content, inflatedTokens, indent.tabSize);
        };
        CodeEditorWidget.prototype.getView = function () {
            return this._view;
        };
        CodeEditorWidget.prototype.getDomNode = function () {
            if (!this.hasView) {
                return null;
            }
            return this._view.domNode;
        };
        CodeEditorWidget.prototype.getCenteredRangeInViewport = function () {
            if (!this.hasView) {
                return null;
            }
            return this._view.getCenteredRangeInViewport();
        };
        CodeEditorWidget.prototype.setScrollTop = function (newScrollTop) {
            if (!this.hasView) {
                return;
            }
            if (typeof newScrollTop !== 'number') {
                throw new Error('Invalid arguments');
            }
            this._view.getCodeEditorHelper().setScrollTop(newScrollTop);
        };
        CodeEditorWidget.prototype.getScrollTop = function () {
            if (!this.hasView) {
                return -1;
            }
            return this._view.getCodeEditorHelper().getScrollTop();
        };
        CodeEditorWidget.prototype.delegateVerticalScrollbarMouseDown = function (browserEvent) {
            if (!this.hasView) {
                return;
            }
            this._view.getCodeEditorHelper().delegateVerticalScrollbarMouseDown(browserEvent);
        };
        CodeEditorWidget.prototype.setScrollLeft = function (newScrollLeft) {
            if (!this.hasView) {
                return;
            }
            if (typeof newScrollLeft !== 'number') {
                throw new Error('Invalid arguments');
            }
            this._view.getCodeEditorHelper().setScrollLeft(newScrollLeft);
        };
        CodeEditorWidget.prototype.getScrollLeft = function () {
            if (!this.hasView) {
                return -1;
            }
            return this._view.getCodeEditorHelper().getScrollLeft();
        };
        CodeEditorWidget.prototype.getScrollWidth = function () {
            if (!this.hasView) {
                return -1;
            }
            return this._view.getCodeEditorHelper().getScrollWidth();
        };
        CodeEditorWidget.prototype.getScrollHeight = function () {
            if (!this.hasView) {
                return -1;
            }
            return this._view.getCodeEditorHelper().getScrollHeight();
        };
        CodeEditorWidget.prototype.saveViewState = function () {
            if (!this.cursor || !this.hasView) {
                return null;
            }
            var cursorState = this.cursor.saveState();
            var viewState = this._view.saveState();
            return {
                cursorState: cursorState,
                viewState: viewState
            };
        };
        CodeEditorWidget.prototype.restoreViewState = function (state) {
            if (!this.cursor || !this.hasView) {
                return;
            }
            var s = state;
            if (s && s.cursorState && s.viewState) {
                var codeEditorState = s;
                var cursorState = codeEditorState.cursorState;
                if (Array.isArray(cursorState)) {
                    this.cursor.restoreState(cursorState);
                }
                else {
                    // Backwards compatibility
                    this.cursor.restoreState([cursorState]);
                }
                this._view.restoreState(codeEditorState.viewState);
            }
        };
        CodeEditorWidget.prototype.layout = function (dimension) {
            this._configuration.observeReferenceElement(dimension);
        };
        CodeEditorWidget.prototype.focus = function () {
            if (!this.hasView) {
                return;
            }
            this._view.focus();
        };
        CodeEditorWidget.prototype.isFocused = function () {
            return this.hasView && this._view.isFocused();
        };
        CodeEditorWidget.prototype.addContentWidget = function (widget) {
            var widgetData = {
                widget: widget,
                position: widget.getPosition()
            };
            if (this.contentWidgets.hasOwnProperty(widget.getId())) {
                console.warn('Overwriting a content widget with the same id.');
            }
            this.contentWidgets[widget.getId()] = widgetData;
            if (this.hasView) {
                this._view.addContentWidget(widgetData);
            }
        };
        CodeEditorWidget.prototype.layoutContentWidget = function (widget) {
            var widgetId = widget.getId();
            if (this.contentWidgets.hasOwnProperty(widgetId)) {
                var widgetData = this.contentWidgets[widgetId];
                widgetData.position = widget.getPosition();
                if (this.hasView) {
                    this._view.layoutContentWidget(widgetData);
                }
            }
        };
        CodeEditorWidget.prototype.removeContentWidget = function (widget) {
            var widgetId = widget.getId();
            if (this.contentWidgets.hasOwnProperty(widgetId)) {
                var widgetData = this.contentWidgets[widgetId];
                delete this.contentWidgets[widgetId];
                if (this.hasView) {
                    this._view.removeContentWidget(widgetData);
                }
            }
        };
        CodeEditorWidget.prototype.addOverlayWidget = function (widget) {
            var widgetData = {
                widget: widget,
                position: widget.getPosition()
            };
            if (this.overlayWidgets.hasOwnProperty(widget.getId())) {
                console.warn('Overwriting an overlay widget with the same id.');
            }
            this.overlayWidgets[widget.getId()] = widgetData;
            if (this.hasView) {
                this._view.addOverlayWidget(widgetData);
            }
        };
        CodeEditorWidget.prototype.layoutOverlayWidget = function (widget) {
            var widgetId = widget.getId();
            if (this.overlayWidgets.hasOwnProperty(widgetId)) {
                var widgetData = this.overlayWidgets[widgetId];
                widgetData.position = widget.getPosition();
                if (this.hasView) {
                    this._view.layoutOverlayWidget(widgetData);
                }
            }
        };
        CodeEditorWidget.prototype.removeOverlayWidget = function (widget) {
            var widgetId = widget.getId();
            if (this.overlayWidgets.hasOwnProperty(widgetId)) {
                var widgetData = this.overlayWidgets[widgetId];
                delete this.overlayWidgets[widgetId];
                if (this.hasView) {
                    this._view.removeOverlayWidget(widgetData);
                }
            }
        };
        CodeEditorWidget.prototype.changeViewZones = function (callback) {
            if (!this.hasView) {
                //			console.warn('Cannot change view zones on editor that is not attached to a model, since there is no view.');
                return;
            }
            var hasChanges = this._view.change(callback);
            if (hasChanges) {
                this.emit(EditorCommon.EventType.ViewZonesChanged);
            }
        };
        CodeEditorWidget.prototype.getWhitespaces = function () {
            if (!this.hasView) {
                return [];
            }
            return this._view.getWhitespaces();
        };
        CodeEditorWidget.prototype.getTopForLineNumber = function (lineNumber) {
            if (!this.hasView) {
                return -1;
            }
            return this._view.getCodeEditorHelper().getVerticalOffsetForPosition(lineNumber, 1);
        };
        CodeEditorWidget.prototype.getTopForPosition = function (lineNumber, column) {
            if (!this.hasView) {
                return -1;
            }
            return this._view.getCodeEditorHelper().getVerticalOffsetForPosition(lineNumber, column);
        };
        CodeEditorWidget.prototype.getScrolledVisiblePosition = function (rawPosition) {
            if (!this.hasView) {
                return null;
            }
            var position = this.model.validatePosition(rawPosition);
            var helper = this._view.getCodeEditorHelper();
            var layoutInfo = this._configuration.editor.layoutInfo;
            var top = helper.getVerticalOffsetForPosition(position.lineNumber, position.column) - helper.getScrollTop();
            var left = helper.getOffsetForColumn(position.lineNumber, position.column) + layoutInfo.glyphMarginWidth + layoutInfo.lineNumbersWidth + layoutInfo.decorationsWidth - helper.getScrollLeft();
            return {
                top: top,
                left: left,
                height: this._configuration.editor.lineHeight
            };
        };
        CodeEditorWidget.prototype.getOffsetForColumn = function (lineNumber, column) {
            if (!this.hasView) {
                return -1;
            }
            return this._view.getCodeEditorHelper().getOffsetForColumn(lineNumber, column);
        };
        CodeEditorWidget.prototype.render = function () {
            if (!this.hasView) {
                return;
            }
            this._view.render(true);
        };
        CodeEditorWidget.prototype._attachModel = function (model) {
            var _this = this;
            this._view = null;
            _super.prototype._attachModel.call(this, model);
            if (this._view) {
                this.domElement.appendChild(this._view.domNode);
                this._view.renderOnce(function () {
                    var widgetId;
                    for (widgetId in _this.contentWidgets) {
                        if (_this.contentWidgets.hasOwnProperty(widgetId)) {
                            _this._view.addContentWidget(_this.contentWidgets[widgetId]);
                        }
                    }
                    for (widgetId in _this.overlayWidgets) {
                        if (_this.overlayWidgets.hasOwnProperty(widgetId)) {
                            _this._view.addOverlayWidget(_this.overlayWidgets[widgetId]);
                        }
                    }
                    _this._view.render(false);
                    _this.hasView = true;
                });
            }
        };
        CodeEditorWidget.prototype._enableEmptySelectionClipboard = function () {
            return Browser.enableEmptySelectionClipboard;
        };
        CodeEditorWidget.prototype._createView = function () {
            this._view = new viewImpl_1.View(this.id, this._configuration, this.viewModel, this._keybindingService);
        };
        CodeEditorWidget.prototype._getViewInternalEventBus = function () {
            return this._view.getInternalEventBus();
        };
        CodeEditorWidget.prototype._detachModel = function () {
            var removeDomNode = null;
            if (this._view) {
                this._view.dispose();
                removeDomNode = this._view.domNode;
                this._view = null;
            }
            var result = _super.prototype._detachModel.call(this);
            if (removeDomNode) {
                this.domElement.removeChild(removeDomNode);
            }
            return result;
        };
        CodeEditorWidget = __decorate([
            __param(2, instantiation_1.IInstantiationService),
            __param(3, codeEditorService_1.ICodeEditorService),
            __param(4, keybindingService_1.IKeybindingService),
            __param(5, telemetry_1.ITelemetryService)
        ], CodeEditorWidget);
        return CodeEditorWidget;
    })(commonCodeEditor_1.CommonCodeEditor);
    exports.CodeEditorWidget = CodeEditorWidget;
    var OverlayWidget2 = (function () {
        function OverlayWidget2(id, position) {
            this._id = id;
            this._position = position;
            this._domNode = document.createElement('div');
            this._domNode.className = this._id.replace(/\./g, '-').replace(/[^a-z0-9\-]/, '');
        }
        OverlayWidget2.prototype.getId = function () {
            return this._id;
        };
        OverlayWidget2.prototype.getDomNode = function () {
            return this._domNode;
        };
        OverlayWidget2.prototype.getPosition = function () {
            return this._position;
        };
        return OverlayWidget2;
    })();
    (function (EditCursorState) {
        EditCursorState[EditCursorState["EndOfLastEditOperation"] = 0] = "EndOfLastEditOperation";
    })(exports.EditCursorState || (exports.EditCursorState = {}));
    var EditCursorState = exports.EditCursorState;
    var CommandRunner = (function () {
        function CommandRunner(ops, editCursorState) {
            this._ops = ops;
            this._editCursorState = editCursorState;
        }
        CommandRunner.prototype.getEditOperations = function (model, builder) {
            if (this._ops.length === 0) {
                return;
            }
            // Sort them in ascending order by range starts
            this._ops.sort(function (o1, o2) {
                return range_1.Range.compareRangesUsingStarts(o1.range, o2.range);
            });
            // Merge operations that touch each other
            var resultOps = [];
            var previousOp = this._ops[0];
            for (var i = 1; i < this._ops.length; i++) {
                if (previousOp.range.endLineNumber === this._ops[i].range.startLineNumber && previousOp.range.endColumn === this._ops[i].range.startColumn) {
                    // These operations are one after another and can be merged
                    previousOp.range = range_1.Range.plusRange(previousOp.range, this._ops[i].range);
                    previousOp.text = previousOp.text + this._ops[i].text;
                }
                else {
                    resultOps.push(previousOp);
                    previousOp = this._ops[i];
                }
            }
            resultOps.push(previousOp);
            for (var i = 0; i < resultOps.length; i++) {
                builder.addEditOperation(range_1.Range.lift(resultOps[i].range), resultOps[i].text);
            }
        };
        CommandRunner.prototype.computeCursorState = function (model, helper) {
            var inverseEditOperations = helper.getInverseEditOperations();
            var srcRange = inverseEditOperations[inverseEditOperations.length - 1].range;
            return selection_1.Selection.createSelection(srcRange.endLineNumber, srcRange.endColumn, srcRange.endLineNumber, srcRange.endColumn);
        };
        return CommandRunner;
    })();
    exports.CommandRunner = CommandRunner;
});
//# sourceMappingURL=codeEditorWidget.js.map