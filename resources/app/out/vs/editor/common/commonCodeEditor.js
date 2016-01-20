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
define(["require", "exports", 'vs/editor/common/editorCommon', 'vs/base/common/winjs.base', 'vs/base/common/objects', 'vs/base/common/errors', 'vs/base/common/eventEmitter', 'vs/editor/common/controller/cursor', 'vs/editor/common/viewModel/characterHardWrappingLineMapper', 'vs/editor/common/viewModel/splitLinesCollection', 'vs/editor/common/viewModel/viewModel', 'vs/base/common/timer', 'vs/base/common/actions', 'vs/editor/common/controller/cursorMoveHelper', 'vs/base/common/lifecycle', 'vs/editor/common/editorAction', 'vs/editor/common/core/range', 'vs/editor/common/core/position', 'vs/editor/common/core/selection', 'vs/editor/common/core/editorState'], function (require, exports, EditorCommon, winjs_base_1, Objects, errors_1, EventEmitter, cursor_1, characterHardWrappingLineMapper_1, splitLinesCollection_1, viewModel_1, Timer, actions_1, cursorMoveHelper_1, lifecycle_1, editorAction_1, range_1, position_1, selection_1, editorState_1) {
    var EDITOR_ID = 0;
    var CommonCodeEditor = (function (_super) {
        __extends(CommonCodeEditor, _super);
        function CommonCodeEditor(domElement, options, instantiationService, codeEditorService, keybindingService, telemetryService) {
            var _this = this;
            _super.call(this);
            this.domElement = domElement;
            this.id = (++EDITOR_ID);
            this._codeEditorService = codeEditorService;
            var timerEvent = Timer.start(Timer.Topic.EDITOR, 'CodeEditor.ctor');
            this._lifetimeDispose = [];
            this._keybindingService = keybindingService.createScoped(domElement);
            this._editorIdContextKey = this._keybindingService.createKey('editorId', this.getId());
            this._editorFocusContextKey = this._keybindingService.createKey(EditorCommon.KEYBINDING_CONTEXT_EDITOR_FOCUS, undefined);
            this._editorTabMovesFocusKey = this._keybindingService.createKey(EditorCommon.KEYBINDING_CONTEXT_EDITOR_TAB_MOVES_FOCUS, false);
            this._hasMultipleSelectionsKey = this._keybindingService.createKey(EditorCommon.KEYBINDING_CONTEXT_EDITOR_HAS_MULTIPLE_SELECTIONS, false);
            this._hasNonEmptySelectionKey = this._keybindingService.createKey(EditorCommon.KEYBINDING_CONTEXT_EDITOR_HAS_NON_EMPTY_SELECTION, false);
            this._langIdKey = this._keybindingService.createKey(EditorCommon.KEYBINDING_CONTEXT_EDITOR_LANGUAGE_ID, undefined);
            // listeners that are kept during the whole editor lifetime
            this._decorationTypeKeysToIds = {};
            options = options || {};
            var model = null;
            if (options.model) {
                model = options.model;
                delete options.model;
            }
            this._configuration = this._createConfiguration(options, function (tabSize) {
                if (_this.model) {
                    return _this.model.guessIndentation(tabSize);
                }
                return null;
            });
            if (this._configuration.editor.tabFocusMode) {
                this._editorTabMovesFocusKey.set(true);
            }
            this._lifetimeDispose.push(this._configuration.onDidChange(function (e) { return _this.emit(EditorCommon.EventType.ConfigurationChanged, e); }));
            this.forcedWidgetFocusCount = 0;
            this._telemetryService = telemetryService;
            this._instantiationService = instantiationService.createChild({
                keybindingService: this._keybindingService
            });
            this._attachModel(model);
            // Create editor contributions
            this.contributions = {};
            timerEvent.stop();
            this._codeEditorService.addCodeEditor(this);
        }
        CommonCodeEditor.prototype.getId = function () {
            return this.getEditorType() + ':' + this.id;
        };
        CommonCodeEditor.prototype.getEditorType = function () {
            return EditorCommon.EditorType.ICodeEditor;
        };
        CommonCodeEditor.prototype.destroy = function () {
            this.dispose();
        };
        CommonCodeEditor.prototype.dispose = function () {
            this._codeEditorService.removeCodeEditor(this);
            this._lifetimeDispose = lifecycle_1.disposeAll(this._lifetimeDispose);
            var contributionId;
            for (contributionId in this.contributions) {
                if (this.contributions.hasOwnProperty(contributionId)) {
                    this.contributions[contributionId].dispose();
                }
            }
            this.contributions = {};
            this._postDetachModelCleanup(this._detachModel());
            this._configuration.dispose();
            this._keybindingService.dispose();
            this.emit(EditorCommon.EventType.Disposed, {});
            _super.prototype.dispose.call(this);
        };
        CommonCodeEditor.prototype.captureState = function () {
            var flags = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                flags[_i - 0] = arguments[_i];
            }
            return new editorState_1.EditorState(this, flags);
        };
        CommonCodeEditor.prototype.updateOptions = function (newOptions) {
            this._configuration.updateOptions(newOptions);
            if (this._configuration.editor.tabFocusMode) {
                this._editorTabMovesFocusKey.set(true);
            }
            else {
                this._editorTabMovesFocusKey.reset();
            }
        };
        CommonCodeEditor.prototype.getConfiguration = function () {
            return Objects.clone(this._configuration.editor);
        };
        CommonCodeEditor.prototype.getRawConfiguration = function () {
            return this._configuration.getRawOptions();
        };
        CommonCodeEditor.prototype.getIndentationOptions = function () {
            return Objects.clone(this._configuration.getIndentationOptions());
        };
        CommonCodeEditor.prototype.normalizeIndentation = function (str) {
            return this._configuration.normalizeIndentation(str);
        };
        CommonCodeEditor.prototype.getValue = function (options) {
            if (options === void 0) { options = null; }
            if (this.model) {
                var preserveBOM = (options && options.preserveBOM) ? true : false;
                var eolPreference = EditorCommon.EndOfLinePreference.TextDefined;
                if (options && options.lineEnding && options.lineEnding === '\n') {
                    eolPreference = EditorCommon.EndOfLinePreference.LF;
                }
                else if (options && options.lineEnding && options.lineEnding === '\r\n') {
                    eolPreference = EditorCommon.EndOfLinePreference.CRLF;
                }
                return this.model.getValue(eolPreference, preserveBOM);
            }
            return '';
        };
        CommonCodeEditor.prototype.setValue = function (newValue) {
            if (this.model) {
                this.model.setValue(newValue);
            }
        };
        CommonCodeEditor.prototype.getModel = function () {
            return this.model;
        };
        CommonCodeEditor.prototype.setModel = function (model) {
            if (model === void 0) { model = null; }
            if (this.model === model) {
                // Current model is the new model
                return;
            }
            var timerEvent = Timer.start(Timer.Topic.EDITOR, 'CodeEditor.setModel');
            var detachedModel = this._detachModel();
            this._attachModel(model);
            var oldModelUrl = null;
            var newModelUrl = null;
            if (detachedModel) {
                oldModelUrl = detachedModel.getAssociatedResource().toString();
            }
            if (model) {
                newModelUrl = model.getAssociatedResource().toString();
            }
            var e = {
                oldModelUrl: oldModelUrl,
                newModelUrl: newModelUrl
            };
            timerEvent.stop();
            this.emit(EditorCommon.EventType.ModelChanged, e);
            this._postDetachModelCleanup(detachedModel);
        };
        CommonCodeEditor.prototype.getVisibleColumnFromPosition = function (rawPosition) {
            if (!this.model) {
                return rawPosition.column;
            }
            var position = this.model.validatePosition(rawPosition);
            return cursorMoveHelper_1.CursorMoveHelper.visibleColumnFromColumn(this.model, position.lineNumber, position.column, this._configuration.getIndentationOptions().tabSize) + 1;
        };
        CommonCodeEditor.prototype.getPosition = function () {
            if (!this.cursor) {
                return null;
            }
            return this.cursor.getPosition().clone();
        };
        CommonCodeEditor.prototype.setPosition = function (position, reveal, revealVerticalInCenter, revealHorizontal) {
            if (reveal === void 0) { reveal = false; }
            if (revealVerticalInCenter === void 0) { revealVerticalInCenter = false; }
            if (revealHorizontal === void 0) { revealHorizontal = false; }
            if (!this.cursor) {
                return;
            }
            if (!position_1.Position.isIPosition(position)) {
                throw new Error('Invalid arguments');
            }
            this.cursor.setSelections('api', [{
                    selectionStartLineNumber: position.lineNumber,
                    selectionStartColumn: position.column,
                    positionLineNumber: position.lineNumber,
                    positionColumn: position.column
                }]);
            if (reveal) {
                this.revealPosition(position, revealVerticalInCenter, revealHorizontal);
            }
        };
        CommonCodeEditor.prototype._sendRevealRange = function (range, verticalType, revealHorizontal) {
            if (!this.model || !this.cursor) {
                return;
            }
            if (!range_1.Range.isIRange(range)) {
                throw new Error('Invalid arguments');
            }
            var validatedRange = this.model.validateRange(range);
            var revealRangeEvent = {
                range: validatedRange,
                viewRange: null,
                verticalType: verticalType,
                revealHorizontal: revealHorizontal
            };
            this.cursor.emit(EditorCommon.EventType.CursorRevealRange, revealRangeEvent);
        };
        CommonCodeEditor.prototype.revealLine = function (lineNumber) {
            this._sendRevealRange({
                startLineNumber: lineNumber,
                startColumn: 1,
                endLineNumber: lineNumber,
                endColumn: 1
            }, EditorCommon.VerticalRevealType.Simple, false);
        };
        CommonCodeEditor.prototype.revealLineInCenter = function (lineNumber) {
            this._sendRevealRange({
                startLineNumber: lineNumber,
                startColumn: 1,
                endLineNumber: lineNumber,
                endColumn: 1
            }, EditorCommon.VerticalRevealType.Center, false);
        };
        CommonCodeEditor.prototype.revealLineInCenterIfOutsideViewport = function (lineNumber) {
            this._sendRevealRange({
                startLineNumber: lineNumber,
                startColumn: 1,
                endLineNumber: lineNumber,
                endColumn: 1
            }, EditorCommon.VerticalRevealType.CenterIfOutsideViewport, false);
        };
        CommonCodeEditor.prototype.revealPosition = function (position, revealVerticalInCenter, revealHorizontal) {
            if (revealVerticalInCenter === void 0) { revealVerticalInCenter = false; }
            if (revealHorizontal === void 0) { revealHorizontal = false; }
            if (!position_1.Position.isIPosition(position)) {
                throw new Error('Invalid arguments');
            }
            this._sendRevealRange({
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            }, revealVerticalInCenter ? EditorCommon.VerticalRevealType.Center : EditorCommon.VerticalRevealType.Simple, revealHorizontal);
        };
        CommonCodeEditor.prototype.revealPositionInCenter = function (position) {
            if (!position_1.Position.isIPosition(position)) {
                throw new Error('Invalid arguments');
            }
            this._sendRevealRange({
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            }, EditorCommon.VerticalRevealType.Center, true);
        };
        CommonCodeEditor.prototype.revealPositionInCenterIfOutsideViewport = function (position) {
            if (!position_1.Position.isIPosition(position)) {
                throw new Error('Invalid arguments');
            }
            this._sendRevealRange({
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            }, EditorCommon.VerticalRevealType.CenterIfOutsideViewport, true);
        };
        CommonCodeEditor.prototype.getSelection = function () {
            if (!this.cursor) {
                return null;
            }
            return this.cursor.getSelection().clone();
        };
        CommonCodeEditor.prototype.getSelections = function () {
            if (!this.cursor) {
                return null;
            }
            var selections = this.cursor.getSelections();
            var result = [];
            for (var i = 0, len = selections.length; i < len; i++) {
                result[i] = selections[i].clone();
            }
            return result;
        };
        CommonCodeEditor.prototype.setSelection = function (something, reveal, revealVerticalInCenter, revealHorizontal) {
            if (reveal === void 0) { reveal = false; }
            if (revealVerticalInCenter === void 0) { revealVerticalInCenter = false; }
            if (revealHorizontal === void 0) { revealHorizontal = false; }
            var isSelection = selection_1.Selection.isISelection(something);
            var isRange = range_1.Range.isIRange(something);
            if (!isSelection && !isRange) {
                throw new Error('Invalid arguments');
            }
            if (isSelection) {
                this._setSelectionImpl(something, reveal, revealVerticalInCenter, revealHorizontal);
            }
            else if (isRange) {
                // act as if it was an IRange
                var selection = {
                    selectionStartLineNumber: something.startLineNumber,
                    selectionStartColumn: something.startColumn,
                    positionLineNumber: something.endLineNumber,
                    positionColumn: something.endColumn
                };
                this._setSelectionImpl(selection, reveal, revealVerticalInCenter, revealHorizontal);
            }
        };
        CommonCodeEditor.prototype._setSelectionImpl = function (sel, reveal, revealVerticalInCenter, revealHorizontal) {
            if (!this.cursor) {
                return;
            }
            var selection = selection_1.Selection.createSelection(sel.selectionStartLineNumber, sel.selectionStartColumn, sel.positionLineNumber, sel.positionColumn);
            this.cursor.setSelections('api', [selection]);
            if (reveal) {
                this.revealRange(selection, revealVerticalInCenter, revealHorizontal);
            }
        };
        CommonCodeEditor.prototype.revealLines = function (startLineNumber, endLineNumber) {
            this._sendRevealRange({
                startLineNumber: startLineNumber,
                startColumn: 1,
                endLineNumber: endLineNumber,
                endColumn: 1
            }, EditorCommon.VerticalRevealType.Simple, false);
        };
        CommonCodeEditor.prototype.revealLinesInCenter = function (startLineNumber, endLineNumber) {
            this._sendRevealRange({
                startLineNumber: startLineNumber,
                startColumn: 1,
                endLineNumber: endLineNumber,
                endColumn: 1
            }, EditorCommon.VerticalRevealType.Center, false);
        };
        CommonCodeEditor.prototype.revealLinesInCenterIfOutsideViewport = function (startLineNumber, endLineNumber) {
            this._sendRevealRange({
                startLineNumber: startLineNumber,
                startColumn: 1,
                endLineNumber: endLineNumber,
                endColumn: 1
            }, EditorCommon.VerticalRevealType.CenterIfOutsideViewport, false);
        };
        CommonCodeEditor.prototype.revealRange = function (range, revealVerticalInCenter, revealHorizontal) {
            if (revealVerticalInCenter === void 0) { revealVerticalInCenter = false; }
            if (revealHorizontal === void 0) { revealHorizontal = true; }
            this._sendRevealRange(range, revealVerticalInCenter ? EditorCommon.VerticalRevealType.Center : EditorCommon.VerticalRevealType.Simple, revealHorizontal);
        };
        CommonCodeEditor.prototype.revealRangeInCenter = function (range) {
            this._sendRevealRange(range, EditorCommon.VerticalRevealType.Center, true);
        };
        CommonCodeEditor.prototype.revealRangeInCenterIfOutsideViewport = function (range) {
            this._sendRevealRange(range, EditorCommon.VerticalRevealType.CenterIfOutsideViewport, true);
        };
        CommonCodeEditor.prototype.setSelections = function (ranges) {
            if (!this.cursor) {
                return;
            }
            if (!ranges || ranges.length === 0) {
                throw new Error('Invalid arguments');
            }
            for (var i = 0, len = ranges.length; i < len; i++) {
                if (!selection_1.Selection.isISelection(ranges[i])) {
                    throw new Error('Invalid arguments');
                }
            }
            this.cursor.setSelections('api', ranges);
        };
        CommonCodeEditor.prototype.onVisible = function () {
        };
        CommonCodeEditor.prototype.onHide = function () {
        };
        CommonCodeEditor.prototype.beginForcedWidgetFocus = function () {
            this.forcedWidgetFocusCount++;
        };
        CommonCodeEditor.prototype.endForcedWidgetFocus = function () {
            this.forcedWidgetFocusCount--;
        };
        CommonCodeEditor.prototype.getContribution = function (id) {
            return this.contributions[id] || null;
        };
        CommonCodeEditor.prototype.addAction = function (descriptor) {
            var action = this._instantiationService.createInstance(editorAction_1.DynamicEditorAction, descriptor, this);
            this.contributions[action.getId()] = action;
        };
        CommonCodeEditor.prototype.getActions = function () {
            var result = [];
            var id;
            for (id in this.contributions) {
                if (this.contributions.hasOwnProperty(id)) {
                    var contribution = this.contributions[id];
                    // contribution instanceof IAction
                    if (actions_1.isAction(contribution)) {
                        result.push(contribution);
                    }
                }
            }
            return result;
        };
        CommonCodeEditor.prototype.getAction = function (id) {
            var contribution = this.contributions[id];
            if (contribution) {
                // contribution instanceof IAction
                if (actions_1.isAction(contribution)) {
                    return contribution;
                }
            }
            return null;
        };
        CommonCodeEditor.prototype.trigger = function (source, handlerId, payload) {
            var candidate = this.getAction(handlerId);
            if (candidate !== null) {
                if (candidate.enabled) {
                    this._telemetryService.publicLog('editorActionInvoked', { name: candidate.label });
                    winjs_base_1.TPromise.as(candidate.run()).done(null, errors_1.onUnexpectedError);
                }
            }
            else {
                // forward to handler dispatcher
                var r = this._configuration.handlerDispatcher.trigger(source, handlerId, payload);
                if (!r) {
                }
            }
        };
        CommonCodeEditor.prototype.executeCommand = function (source, command) {
            // forward to handler dispatcher
            return this._configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.ExecuteCommand, command);
        };
        CommonCodeEditor.prototype.executeEdits = function (source, edits) {
            var _this = this;
            if (!this.cursor) {
                // no view, no cursor
                return false;
            }
            if (this._configuration.editor.readOnly) {
                // read only editor => sorry!
                return false;
            }
            this.model.pushEditOperations(this.cursor.getSelections(), edits, function () {
                return _this.cursor.getSelections();
            });
            return true;
        };
        CommonCodeEditor.prototype.executeCommands = function (source, commands) {
            // forward to handler dispatcher
            return this._configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.ExecuteCommands, commands);
        };
        CommonCodeEditor.prototype.changeDecorations = function (callback) {
            if (!this.model) {
                //			console.warn('Cannot change decorations on editor that is not attached to a model');
                // callback will not be called
                return null;
            }
            return this.model.changeDecorations(callback, this.id);
        };
        CommonCodeEditor.prototype.getLineDecorations = function (lineNumber) {
            if (!this.model) {
                return null;
            }
            return this.model.getLineDecorations(lineNumber, this.id, this._configuration.editor.readOnly);
        };
        CommonCodeEditor.prototype.deltaDecorations = function (oldDecorations, newDecorations) {
            if (!this.model) {
                return [];
            }
            if (oldDecorations.length === 0 && newDecorations.length === 0) {
                return oldDecorations;
            }
            return this.model.deltaDecorations(oldDecorations, newDecorations, this.id);
        };
        CommonCodeEditor.prototype.setDecorations = function (decorationTypeKey, ranges) {
            var opts = this._codeEditorService.resolveDecorationType(decorationTypeKey);
            var oldDecorationIds = this._decorationTypeKeysToIds[decorationTypeKey] || [];
            this._decorationTypeKeysToIds[decorationTypeKey] = this.deltaDecorations(oldDecorationIds, ranges.map(function (r) {
                var decOpts;
                if (r.hoverMessage) {
                    decOpts = Objects.clone(opts);
                    decOpts.htmlMessage = r.hoverMessage;
                }
                else {
                    decOpts = opts;
                }
                return {
                    range: r.range,
                    options: decOpts
                };
            }));
        };
        CommonCodeEditor.prototype.removeDecorations = function (decorationTypeKey) {
            if (this._decorationTypeKeysToIds.hasOwnProperty(decorationTypeKey)) {
                this.deltaDecorations(this._decorationTypeKeysToIds[decorationTypeKey], []);
                delete this._decorationTypeKeysToIds[decorationTypeKey];
            }
        };
        CommonCodeEditor.prototype.addTypingListener = function (character, callback) {
            var _this = this;
            if (!this.cursor) {
                return function () {
                    // no-op
                };
            }
            this.cursor.addTypingListener(character, callback);
            return function () {
                if (_this.cursor) {
                    _this.cursor.removeTypingListener(character, callback);
                }
            };
        };
        CommonCodeEditor.prototype.getLayoutInfo = function () {
            return this._configuration.editor.layoutInfo;
        };
        CommonCodeEditor.prototype._attachModel = function (model) {
            var _this = this;
            this.model = model ? model : null;
            this.listenersToRemove = [];
            this.viewModel = null;
            this.cursor = null;
            if (this.model) {
                this._configuration.resetIndentationOptions();
                this.domElement.setAttribute('data-mode-id', this.model.getMode().getId());
                this._langIdKey.set(this.model.getMode().getId());
                this.model.setStopLineTokenizationAfter(this._configuration.editor.stopLineTokenizationAfter);
                this._configuration.setIsDominatedByLongLines(this.model.isDominatedByLongLines(this._configuration.editor.longLineBoundary));
                this.model.onBeforeAttached();
                var hardWrappingLineMapperFactory = new characterHardWrappingLineMapper_1.CharacterHardWrappingLineMapperFactory(this._configuration.editor.wordWrapBreakBeforeCharacters, this._configuration.editor.wordWrapBreakAfterCharacters, this._configuration.editor.wordWrapBreakObtrusiveCharacters);
                var linesCollection = new splitLinesCollection_1.SplitLinesCollection(this.model, hardWrappingLineMapperFactory, this._configuration.getIndentationOptions().tabSize, this._configuration.editor.wrappingInfo.wrappingColumn, this._configuration.editor.typicalFullwidthCharacterWidth / this._configuration.editor.typicalHalfwidthCharacterWidth, EditorCommon.wrappingIndentFromString(this._configuration.editor.wrappingIndent));
                this.viewModel = new viewModel_1.ViewModel(linesCollection, this.id, this._configuration, this.model, function () { return _this.getCenteredRangeInViewport(); });
                var viewModelHelper = {
                    viewModel: this.viewModel,
                    convertModelPositionToViewPosition: function (lineNumber, column) {
                        return _this.viewModel.convertModelPositionToViewPosition(lineNumber, column);
                    },
                    convertModelRangeToViewRange: function (modelRange) {
                        return _this.viewModel.convertModelRangeToViewRange(modelRange);
                    },
                    convertViewToModelPosition: function (lineNumber, column) {
                        return _this.viewModel.convertViewPositionToModelPosition(lineNumber, column);
                    },
                    validateViewPosition: function (viewLineNumber, viewColumn, modelPosition) {
                        return _this.viewModel.validateViewPosition(viewLineNumber, viewColumn, modelPosition);
                    },
                    validateViewRange: function (viewStartLineNumber, viewStartColumn, viewEndLineNumber, viewEndColumn, modelRange) {
                        return _this.viewModel.validateViewRange(viewStartLineNumber, viewStartColumn, viewEndLineNumber, viewEndColumn, modelRange);
                    }
                };
                this.cursor = new cursor_1.Cursor(this.id, this._configuration, this.model, viewModelHelper, this._enableEmptySelectionClipboard());
                this.viewModel.addEventSource(this.cursor);
                this._createView();
                this.listenersToRemove.push(this._getViewInternalEventBus().addBulkListener(function (events) {
                    for (var i = 0, len = events.length; i < len; i++) {
                        var eventType = events[i].getType();
                        var e = events[i].getData();
                        switch (eventType) {
                            case EditorCommon.EventType.ViewFocusGained:
                                _this.emit(EditorCommon.EventType.EditorTextFocus);
                                // In IE, the focus is not synchronous, so we give it a little help
                                _this.emit(EditorCommon.EventType.EditorFocus, {});
                                break;
                            case 'scroll':
                                _this.emit('scroll', e);
                                break;
                            case 'scrollSize':
                                _this.emit('scrollSize', e);
                                break;
                            case EditorCommon.EventType.ViewFocusLost:
                                _this.emit(EditorCommon.EventType.EditorTextBlur);
                                break;
                            case EditorCommon.EventType.ContextMenu:
                                _this.emit(EditorCommon.EventType.ContextMenu, e);
                                break;
                            case EditorCommon.EventType.MouseDown:
                                _this.emit(EditorCommon.EventType.MouseDown, e);
                                break;
                            case EditorCommon.EventType.MouseUp:
                                _this.emit(EditorCommon.EventType.MouseUp, e);
                                break;
                            case EditorCommon.EventType.KeyUp:
                                _this.emit(EditorCommon.EventType.KeyUp, e);
                                break;
                            case EditorCommon.EventType.MouseMove:
                                _this.emit(EditorCommon.EventType.MouseMove, e);
                                break;
                            case EditorCommon.EventType.MouseLeave:
                                _this.emit(EditorCommon.EventType.MouseLeave, e);
                                break;
                            case EditorCommon.EventType.KeyDown:
                                _this.emit(EditorCommon.EventType.KeyDown, e);
                                break;
                            case EditorCommon.EventType.ViewLayoutChanged:
                                _this.emit(EditorCommon.EventType.EditorLayout, e);
                                break;
                            default:
                        }
                    }
                }));
                this.listenersToRemove.push(this.model.addBulkListener(function (events) {
                    for (var i = 0, len = events.length; i < len; i++) {
                        var eventType = events[i].getType();
                        var e = events[i].getData();
                        switch (eventType) {
                            case EditorCommon.EventType.ModelDecorationsChanged:
                                _this.emit(EditorCommon.EventType.ModelDecorationsChanged, e);
                                break;
                            case EditorCommon.EventType.ModelModeChanged:
                                _this.domElement.setAttribute('data-mode-id', _this.model.getMode().getId());
                                _this._langIdKey.set(_this.model.getMode().getId());
                                _this.emit(EditorCommon.EventType.ModelModeChanged, e);
                                break;
                            case EditorCommon.EventType.ModelModeSupportChanged:
                                _this.emit(EditorCommon.EventType.ModelModeSupportChanged, e);
                                break;
                            case EditorCommon.EventType.ModelContentChanged:
                                // TODO@Alex
                                _this.emit(EditorCommon.EventType.ModelContentChanged, e);
                                _this.emit('change', {});
                                break;
                            case EditorCommon.EventType.ModelDispose:
                                // Someone might destroy the model from under the editor, so prevent any exceptions by setting a null model
                                _this.setModel(null);
                                break;
                            default:
                        }
                    }
                }));
                var _hasNonEmptySelection = function (e) {
                    var allSelections = [e.selection].concat(e.secondarySelections);
                    return allSelections.some(function (s) { return !s.isEmpty(); });
                };
                this.listenersToRemove.push(this.cursor.addBulkListener(function (events) {
                    var updateHasMultipleCursors = false, hasMultipleCursors = false, updateHasNonEmptySelection = false, hasNonEmptySelection = false;
                    for (var i = 0, len = events.length; i < len; i++) {
                        var eventType = events[i].getType();
                        var e = events[i].getData();
                        switch (eventType) {
                            case EditorCommon.EventType.CursorPositionChanged:
                                var cursorPositionChangedEvent = e;
                                updateHasMultipleCursors = true;
                                hasMultipleCursors = (cursorPositionChangedEvent.secondaryPositions.length > 0);
                                _this.emit(EditorCommon.EventType.CursorPositionChanged, e);
                                break;
                            case EditorCommon.EventType.CursorSelectionChanged:
                                var cursorSelectionChangedEvent = e;
                                updateHasMultipleCursors = true;
                                hasMultipleCursors = (cursorSelectionChangedEvent.secondarySelections.length > 0);
                                updateHasNonEmptySelection = true;
                                hasNonEmptySelection = _hasNonEmptySelection(cursorSelectionChangedEvent);
                                _this.emit(EditorCommon.EventType.CursorSelectionChanged, e);
                                break;
                            default:
                        }
                    }
                    if (updateHasMultipleCursors) {
                        if (hasMultipleCursors) {
                            _this._hasMultipleSelectionsKey.set(true);
                        }
                        else {
                            _this._hasMultipleSelectionsKey.reset();
                        }
                    }
                    if (updateHasNonEmptySelection) {
                        if (hasNonEmptySelection) {
                            _this._hasNonEmptySelectionKey.set(true);
                        }
                        else {
                            _this._hasNonEmptySelectionKey.reset();
                        }
                    }
                }));
            }
            else {
                this.hasView = false;
            }
        };
        CommonCodeEditor.prototype._postDetachModelCleanup = function (detachedModel) {
            if (detachedModel) {
                this._decorationTypeKeysToIds = {};
                detachedModel.removeAllDecorationsWithOwnerId(this.id);
            }
        };
        CommonCodeEditor.prototype._detachModel = function () {
            if (this.model) {
                this.model.onBeforeDetached();
            }
            this.hasView = false;
            this.listenersToRemove.forEach(function (element) {
                element();
            });
            this.listenersToRemove = [];
            if (this.cursor) {
                this.cursor.dispose();
                this.cursor = null;
            }
            if (this.viewModel) {
                this.viewModel.dispose();
                this.viewModel = null;
            }
            var result = this.model;
            this.model = null;
            this.domElement.removeAttribute('data-mode-id');
            return result;
        };
        return CommonCodeEditor;
    })(EventEmitter.EventEmitter);
    exports.CommonCodeEditor = CommonCodeEditor;
});
//# sourceMappingURL=commonCodeEditor.js.map