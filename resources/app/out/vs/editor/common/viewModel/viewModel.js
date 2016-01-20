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
define(["require", "exports", 'vs/base/common/eventEmitter', 'vs/base/common/strings', 'vs/editor/common/core/selection', 'vs/editor/common/core/range', 'vs/editor/common/viewModel/viewModelDecorations', 'vs/editor/common/viewModel/viewModelCursors', 'vs/base/common/lifecycle', 'vs/editor/common/core/position', 'vs/editor/common/editorCommon'], function (require, exports, eventEmitter_1, Strings, selection_1, range_1, viewModelDecorations_1, viewModelCursors_1, lifecycle_1, position_1, EditorCommon) {
    var ViewModel = (function (_super) {
        __extends(ViewModel, _super);
        function ViewModel(lines, editorId, configuration, model, getCurrentCenteredModelRange) {
            var _this = this;
            _super.call(this);
            this.lines = lines;
            this.editorId = editorId;
            this.configuration = configuration;
            this.model = model;
            this.getCurrentCenteredModelRange = getCurrentCenteredModelRange;
            this.decorations = new viewModelDecorations_1.ViewModelDecorations(this.editorId, this.configuration, {
                convertModelRangeToViewRange: function (modelRange, isWholeLine) {
                    if (isWholeLine) {
                        return _this.convertWholeLineModelRangeToViewRange(modelRange);
                    }
                    return _this.convertModelRangeToViewRange(modelRange);
                }
            });
            this.decorations.reset(this.model);
            this.cursors = new viewModelCursors_1.ViewModelCursors(this.configuration, this);
            this._updateShouldForceTokenization();
            this.listenersToRemove = [];
            this._toDispose = [];
            this.listenersToRemove.push(this.model.addBulkListener(function (events) { return _this.onEvents(events); }));
            this._toDispose.push(this.configuration.onDidChange(function (e) {
                _this.onEvents([new eventEmitter_1.EmitterEvent(EditorCommon.EventType.ConfigurationChanged, e)]);
            }));
        }
        ViewModel.prototype.dispose = function () {
            this.listenersToRemove.forEach(function (element) {
                element();
            });
            this._toDispose = lifecycle_1.disposeAll(this._toDispose);
            this.listenersToRemove = [];
            this.decorations.dispose();
            this.decorations = null;
            this.lines = null;
            this.configuration = null;
            this.model = null;
        };
        ViewModel.prototype._updateShouldForceTokenization = function () {
            this.shouldForceTokenization = (this.lines.getOutputLineCount() <= this.configuration.editor.forcedTokenizationBoundary);
        };
        ViewModel.prototype._onTabSizeChange = function (newTabSize) {
            var _this = this;
            var lineMappingChanged = this.lines.setTabSize(newTabSize, function (eventType, payload) { return _this.emit(eventType, payload); });
            if (lineMappingChanged) {
                this.emit(EditorCommon.ViewEventNames.LineMappingChangedEvent);
                this.decorations.onLineMappingChanged(function (eventType, payload) { return _this.emit(eventType, payload); });
                this.cursors.onLineMappingChanged(function (eventType, payload) { return _this.emit(eventType, payload); });
                this._updateShouldForceTokenization();
            }
            return lineMappingChanged;
        };
        ViewModel.prototype._onWrappingIndentChange = function (newWrappingIndent) {
            var _this = this;
            var lineMappingChanged = this.lines.setWrappingIndent(EditorCommon.wrappingIndentFromString(newWrappingIndent), function (eventType, payload) { return _this.emit(eventType, payload); });
            if (lineMappingChanged) {
                this.emit(EditorCommon.ViewEventNames.LineMappingChangedEvent);
                this.decorations.onLineMappingChanged(function (eventType, payload) { return _this.emit(eventType, payload); });
                this.cursors.onLineMappingChanged(function (eventType, payload) { return _this.emit(eventType, payload); });
                this._updateShouldForceTokenization();
            }
            return lineMappingChanged;
        };
        ViewModel.prototype._restoreCenteredModelRange = function (range) {
            // modelLine -> viewLine
            var newCenteredViewRange = this.convertModelRangeToViewRange(range);
            // Send a reveal event to restore the centered content
            var restoreRevealEvent = {
                range: newCenteredViewRange,
                verticalType: EditorCommon.VerticalRevealType.Center,
                revealHorizontal: false
            };
            this.emit(EditorCommon.ViewEventNames.RevealRangeEvent, restoreRevealEvent);
        };
        ViewModel.prototype._onWrappingColumnChange = function (newWrappingColumn, columnsForFullWidthChar) {
            var _this = this;
            var lineMappingChanged = this.lines.setWrappingColumn(newWrappingColumn, columnsForFullWidthChar, function (eventType, payload) { return _this.emit(eventType, payload); });
            if (lineMappingChanged) {
                this.emit(EditorCommon.ViewEventNames.LineMappingChangedEvent);
                this.decorations.onLineMappingChanged(function (eventType, payload) { return _this.emit(eventType, payload); });
                this.cursors.onLineMappingChanged(function (eventType, payload) { return _this.emit(eventType, payload); });
                this._updateShouldForceTokenization();
            }
            return lineMappingChanged;
        };
        ViewModel.prototype.addEventSource = function (eventSource) {
            var _this = this;
            this.listenersToRemove.push(eventSource.addBulkListener(function (events) { return _this.onEvents(events); }));
        };
        ViewModel.prototype.onEvents = function (events) {
            var _this = this;
            this.deferredEmit(function () {
                var hasContentChange = events.some(function (e) { return e.getType() === EditorCommon.EventType.ModelContentChanged; }), previousCenteredModelRange;
                if (!hasContentChange) {
                    // We can only convert the current centered view range to the current centered model range if the model has no changes.
                    previousCenteredModelRange = _this.getCurrentCenteredModelRange();
                }
                var i, len, e, data, shouldUpdateForceTokenization = false, modelContentChangedEvent, hadOtherModelChange = false, hadModelLineChangeThatChangedLineMapping = false, revealPreviousCenteredModelRange = false;
                for (i = 0, len = events.length; i < len; i++) {
                    e = events[i];
                    data = e.getData();
                    switch (e.getType()) {
                        case EditorCommon.EventType.ModelContentChanged:
                            modelContentChangedEvent = data;
                            switch (modelContentChangedEvent.changeType) {
                                case EditorCommon.EventType.ModelContentChangedFlush:
                                    _this.onModelFlushed(modelContentChangedEvent);
                                    hadOtherModelChange = true;
                                    break;
                                case EditorCommon.EventType.ModelContentChangedLinesDeleted:
                                    _this.onModelLinesDeleted(modelContentChangedEvent);
                                    hadOtherModelChange = true;
                                    break;
                                case EditorCommon.EventType.ModelContentChangedLinesInserted:
                                    _this.onModelLinesInserted(modelContentChangedEvent);
                                    hadOtherModelChange = true;
                                    break;
                                case EditorCommon.EventType.ModelContentChangedLineChanged:
                                    hadModelLineChangeThatChangedLineMapping = _this.onModelLineChanged(modelContentChangedEvent);
                                    break;
                                default:
                                    console.info('ViewModel received unknown event: ');
                                    console.info(e);
                            }
                            shouldUpdateForceTokenization = true;
                            break;
                        case EditorCommon.EventType.ModelTokensChanged:
                            _this.onModelTokensChanged(data);
                            break;
                        case EditorCommon.EventType.ModelModeChanged:
                            // That's ok, a model tokens changed event will follow shortly
                            break;
                        case EditorCommon.EventType.ModelModeSupportChanged:
                            // That's ok, no work to do
                            break;
                        case EditorCommon.EventType.ModelPropertiesChanged:
                            // Ignore
                            break;
                        case EditorCommon.EventType.ModelContentChanged2:
                            // Ignore
                            break;
                        case EditorCommon.EventType.ModelDecorationsChanged:
                            _this.onModelDecorationsChanged(data);
                            break;
                        case EditorCommon.EventType.ModelDispose:
                            // Ignore, since the editor will take care of this and destroy the view shortly
                            break;
                        case EditorCommon.EventType.CursorPositionChanged:
                            _this.onCursorPositionChanged(data);
                            break;
                        case EditorCommon.EventType.CursorSelectionChanged:
                            _this.onCursorSelectionChanged(data);
                            break;
                        case EditorCommon.EventType.CursorRevealRange:
                            _this.onCursorRevealRange(data);
                            break;
                        case EditorCommon.EventType.CursorScrollRequest:
                            _this.onCursorScrollRequest(data);
                            break;
                        case EditorCommon.EventType.ConfigurationChanged:
                            revealPreviousCenteredModelRange = _this._onTabSizeChange(_this.configuration.getIndentationOptions().tabSize) || revealPreviousCenteredModelRange;
                            revealPreviousCenteredModelRange = _this._onWrappingIndentChange(_this.configuration.editor.wrappingIndent) || revealPreviousCenteredModelRange;
                            revealPreviousCenteredModelRange = _this._onWrappingColumnChange(_this.configuration.editor.wrappingInfo.wrappingColumn, _this.configuration.editor.typicalFullwidthCharacterWidth / _this.configuration.editor.typicalHalfwidthCharacterWidth) || revealPreviousCenteredModelRange;
                            if (data.readOnly) {
                                // Must read again all decorations due to readOnly filtering
                                _this.decorations.reset(_this.model);
                                var decorationsChangedEvent = {
                                    inlineDecorationsChanged: false
                                };
                                _this.emit(EditorCommon.ViewEventNames.DecorationsChangedEvent, decorationsChangedEvent);
                            }
                            _this.emit(e.getType(), data);
                            break;
                        default:
                            console.info('View received unknown event: ');
                            console.info(e);
                    }
                }
                if (shouldUpdateForceTokenization) {
                    _this._updateShouldForceTokenization();
                }
                if (!hadOtherModelChange && hadModelLineChangeThatChangedLineMapping) {
                    _this.emit(EditorCommon.ViewEventNames.LineMappingChangedEvent);
                    _this.decorations.onLineMappingChanged(function (eventType, payload) { return _this.emit(eventType, payload); });
                    _this.cursors.onLineMappingChanged(function (eventType, payload) { return _this.emit(eventType, payload); });
                    _this._updateShouldForceTokenization();
                }
                if (revealPreviousCenteredModelRange && previousCenteredModelRange) {
                    _this._restoreCenteredModelRange(previousCenteredModelRange);
                }
            });
        };
        // --- begin inbound event conversion
        ViewModel.prototype.onModelFlushed = function (e) {
            var _this = this;
            this.lines.onModelFlushed(e.versionId, function (eventType, payload) { return _this.emit(eventType, payload); });
            this.decorations.reset(this.model);
        };
        ViewModel.prototype.onModelDecorationsChanged = function (e) {
            var _this = this;
            this.decorations.onModelDecorationsChanged(e, function (eventType, payload) { return _this.emit(eventType, payload); });
        };
        ViewModel.prototype.onModelLinesDeleted = function (e) {
            var _this = this;
            this.lines.onModelLinesDeleted(e.versionId, e.fromLineNumber, e.toLineNumber, function (eventType, payload) { return _this.emit(eventType, payload); });
        };
        ViewModel.prototype.onModelTokensChanged = function (e) {
            var viewStartLineNumber = this.convertModelPositionToViewPosition(e.fromLineNumber, 1).lineNumber;
            var viewEndLineNumber = this.convertModelPositionToViewPosition(e.toLineNumber, this.model.getLineMaxColumn(e.toLineNumber)).lineNumber;
            var e = {
                fromLineNumber: viewStartLineNumber,
                toLineNumber: viewEndLineNumber
            };
            this.emit(EditorCommon.ViewEventNames.TokensChangedEvent, e);
        };
        ViewModel.prototype.onModelLineChanged = function (e) {
            var _this = this;
            var lineMappingChanged = this.lines.onModelLineChanged(e.versionId, e.lineNumber, e.detail, function (eventType, payload) { return _this.emit(eventType, payload); });
            return lineMappingChanged;
        };
        ViewModel.prototype.onModelLinesInserted = function (e) {
            var _this = this;
            this.lines.onModelLinesInserted(e.versionId, e.fromLineNumber, e.toLineNumber, e.detail.split('\n'), function (eventType, payload) { return _this.emit(eventType, payload); });
        };
        ViewModel.prototype.validateViewRange = function (viewStartLineNumber, viewStartColumn, viewEndLineNumber, viewEndColumn, modelRange) {
            var validViewStart = this.validateViewPosition(viewStartColumn, viewStartColumn, modelRange.getStartPosition());
            var validViewEnd = this.validateViewPosition(viewEndLineNumber, viewEndColumn, modelRange.getEndPosition());
            return new range_1.Range(validViewStart.lineNumber, validViewStart.column, validViewEnd.lineNumber, validViewEnd.column);
        };
        ViewModel.prototype.validateViewPosition = function (viewLineNumber, viewColumn, modelPosition) {
            if (viewLineNumber < 1) {
                viewLineNumber = 1;
            }
            var lineCount = this.getLineCount();
            if (viewLineNumber > lineCount) {
                viewLineNumber = lineCount;
            }
            var viewMinColumn = this.getLineMinColumn(viewLineNumber);
            var viewMaxColumn = this.getLineMaxColumn(viewLineNumber);
            if (viewColumn < viewMinColumn) {
                viewColumn = viewMinColumn;
            }
            if (viewColumn > viewMaxColumn) {
                viewColumn = viewMaxColumn;
            }
            var computedModelPosition = this.convertViewPositionToModelPosition(viewLineNumber, viewColumn);
            if (computedModelPosition.equals(modelPosition)) {
                return new position_1.Position(viewLineNumber, viewColumn);
            }
            return this.convertModelPositionToViewPosition(modelPosition.lineNumber, modelPosition.column);
        };
        ViewModel.prototype.validateViewSelection = function (viewSelection, modelSelection) {
            var modelSelectionStart = new position_1.Position(modelSelection.selectionStartLineNumber, modelSelection.selectionStartColumn);
            var modelPosition = new position_1.Position(modelSelection.positionLineNumber, modelSelection.positionColumn);
            var viewSelectionStart = this.validateViewPosition(viewSelection.selectionStartLineNumber, viewSelection.selectionStartColumn, modelSelectionStart);
            var viewPosition = this.validateViewPosition(viewSelection.positionLineNumber, viewSelection.positionColumn, modelPosition);
            return new selection_1.Selection(viewSelectionStart.lineNumber, viewSelectionStart.column, viewPosition.lineNumber, viewPosition.column);
        };
        ViewModel.prototype.onCursorPositionChanged = function (e) {
            var _this = this;
            this.cursors.onCursorPositionChanged(e, function (eventType, payload) { return _this.emit(eventType, payload); });
        };
        ViewModel.prototype.onCursorSelectionChanged = function (e) {
            var _this = this;
            this.cursors.onCursorSelectionChanged(e, function (eventType, payload) { return _this.emit(eventType, payload); });
        };
        ViewModel.prototype.onCursorRevealRange = function (e) {
            var _this = this;
            this.cursors.onCursorRevealRange(e, function (eventType, payload) { return _this.emit(eventType, payload); });
        };
        ViewModel.prototype.onCursorScrollRequest = function (e) {
            var _this = this;
            this.cursors.onCursorScrollRequest(e, function (eventType, payload) { return _this.emit(eventType, payload); });
        };
        // --- end inbound event conversion
        ViewModel.prototype.getLineCount = function () {
            return this.lines.getOutputLineCount();
        };
        ViewModel.prototype.getLineContent = function (lineNumber) {
            return this.lines.getOutputLineContent(lineNumber);
        };
        ViewModel.prototype.getLineMinColumn = function (lineNumber) {
            return this.lines.getOutputLineMinColumn(lineNumber);
        };
        ViewModel.prototype.getLineMaxColumn = function (lineNumber) {
            return this.lines.getOutputLineMaxColumn(lineNumber);
        };
        ViewModel.prototype.getLineFirstNonWhitespaceColumn = function (lineNumber) {
            var result = Strings.firstNonWhitespaceIndex(this.getLineContent(lineNumber));
            if (result === -1) {
                return 0;
            }
            return result + 1;
        };
        ViewModel.prototype.getLineLastNonWhitespaceColumn = function (lineNumber) {
            var result = Strings.lastNonWhitespaceIndex(this.getLineContent(lineNumber));
            if (result === -1) {
                return 0;
            }
            return result + 2;
        };
        ViewModel.prototype.getLineTokens = function (lineNumber) {
            return this.lines.getOutputLineTokens(lineNumber, !this.shouldForceTokenization);
        };
        ViewModel.prototype.getLineRenderLineNumber = function (viewLineNumber) {
            var modelPosition = this.convertViewPositionToModelPosition(viewLineNumber, 1);
            if (modelPosition.column !== 1) {
                return '';
            }
            var modelLineNumber = modelPosition.lineNumber;
            if (typeof this.configuration.editor.lineNumbers === 'function') {
                return this.configuration.editor.lineNumbers(modelLineNumber);
            }
            return modelLineNumber.toString();
        };
        ViewModel.prototype.getDecorationsResolver = function (startLineNumber, endLineNumber) {
            return this.decorations.getDecorationsResolver(startLineNumber, endLineNumber);
        };
        ViewModel.prototype.getAllDecorations = function () {
            return this.decorations.getAllDecorations();
        };
        ViewModel.prototype.getValueInRange = function (range, eol) {
            var modelRange = this.convertViewRangeToModelRange(range);
            return this.model.getValueInRange(modelRange, eol);
        };
        ViewModel.prototype.getModelLineContent = function (modelLineNumber) {
            return this.model.getLineContent(modelLineNumber);
        };
        ViewModel.prototype.getSelections = function () {
            return this.cursors.getSelections();
        };
        ViewModel.prototype.getModelLineMaxColumn = function (modelLineNumber) {
            return this.model.getLineMaxColumn(modelLineNumber);
        };
        ViewModel.prototype.validateModelPosition = function (position) {
            return this.model.validatePosition(position);
        };
        ViewModel.prototype.convertViewPositionToModelPosition = function (viewLineNumber, viewColumn) {
            return this.lines.convertOutputPositionToInputPosition(viewLineNumber, viewColumn);
        };
        ViewModel.prototype.convertViewRangeToModelRange = function (viewRange) {
            var start = this.convertViewPositionToModelPosition(viewRange.startLineNumber, viewRange.startColumn);
            var end = this.convertViewPositionToModelPosition(viewRange.endLineNumber, viewRange.endColumn);
            return new range_1.Range(start.lineNumber, start.column, end.lineNumber, end.column);
        };
        ViewModel.prototype.convertModelPositionToViewPosition = function (modelLineNumber, modelColumn) {
            return this.lines.convertInputPositionToOutputPosition(modelLineNumber, modelColumn);
        };
        ViewModel.prototype.convertModelSelectionToViewSelection = function (modelSelection) {
            var selectionStart = this.convertModelPositionToViewPosition(modelSelection.selectionStartLineNumber, modelSelection.selectionStartColumn);
            var position = this.convertModelPositionToViewPosition(modelSelection.positionLineNumber, modelSelection.positionColumn);
            return new selection_1.Selection(selectionStart.lineNumber, selectionStart.column, position.lineNumber, position.column);
        };
        ViewModel.prototype.convertModelRangeToViewRange = function (modelRange) {
            var start = this.convertModelPositionToViewPosition(modelRange.startLineNumber, modelRange.startColumn);
            var end = this.convertModelPositionToViewPosition(modelRange.endLineNumber, modelRange.endColumn);
            return new range_1.Range(start.lineNumber, start.column, end.lineNumber, end.column);
        };
        ViewModel.prototype.convertWholeLineModelRangeToViewRange = function (modelRange) {
            var start = this.convertModelPositionToViewPosition(modelRange.startLineNumber, 1);
            var end = this.convertModelPositionToViewPosition(modelRange.endLineNumber, this.model.getLineMaxColumn(modelRange.endLineNumber));
            return new range_1.Range(start.lineNumber, start.column, end.lineNumber, end.column);
        };
        return ViewModel;
    })(eventEmitter_1.EventEmitter);
    exports.ViewModel = ViewModel;
});
//# sourceMappingURL=viewModel.js.map