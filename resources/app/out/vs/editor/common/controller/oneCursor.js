/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/strings', 'vs/editor/common/core/position', 'vs/editor/common/core/range', 'vs/editor/common/commands/shiftCommand', 'vs/editor/common/commands/replaceCommand', 'vs/editor/common/commands/surroundSelectionCommand', 'vs/editor/common/core/selection', 'vs/editor/common/modes', 'vs/editor/common/controller/cursorMoveHelper', 'vs/editor/common/editorCommon', 'vs/base/common/errors', 'vs/editor/common/modes/supports/onEnter'], function (require, exports, Strings, position_1, range_1, shiftCommand_1, replaceCommand_1, surroundSelectionCommand_1, selection_1, modes_1, cursorMoveHelper_1, EditorCommon, Errors, onEnter_1) {
    var OneCursor = (function () {
        function OneCursor(editorId, model, configuration, modeConfiguration, viewModelHelper) {
            this.editorId = editorId;
            this.model = model;
            this.configuration = configuration;
            this.modeConfiguration = modeConfiguration;
            this.viewModelHelper = viewModelHelper;
            this.helper = new CursorHelper(this.model, this.configuration);
            this.bracketDecorations = [];
            this._set(new range_1.Range(1, 1, 1, 1), 0, new position_1.Position(1, 1), 0, new range_1.Range(1, 1, 1, 1), new position_1.Position(1, 1));
        }
        OneCursor.prototype._set = function (selectionStart, selectionStartLeftoverVisibleColumns, position, leftoverVisibleColumns, viewSelectionStart, viewPosition) {
            this.selectionStart = selectionStart;
            this.selectionStartLeftoverVisibleColumns = selectionStartLeftoverVisibleColumns;
            this.position = position;
            this.leftoverVisibleColumns = leftoverVisibleColumns;
            this.viewSelectionStart = viewSelectionStart;
            this.viewPosition = viewPosition;
            this._cachedSelection = OneCursor.computeSelection(this.selectionStart, this.position);
            this._cachedViewSelection = OneCursor.computeSelection(this.viewSelectionStart, this.viewPosition);
            this._selStartMarker = this._ensureMarker(this._selStartMarker, this._cachedSelection.startLineNumber, this._cachedSelection.startColumn, true);
            this._selEndMarker = this._ensureMarker(this._selEndMarker, this._cachedSelection.endLineNumber, this._cachedSelection.endColumn, false);
            this._selDirection = this._cachedSelection.getDirection();
        };
        OneCursor.prototype._ensureMarker = function (markerId, lineNumber, column, stickToPreviousCharacter) {
            if (!markerId) {
                return this.model._addMarker(lineNumber, column, stickToPreviousCharacter);
            }
            else {
                this.model._changeMarker(markerId, lineNumber, column);
                this.model._changeMarkerStickiness(markerId, stickToPreviousCharacter);
                return markerId;
            }
        };
        OneCursor.prototype.saveState = function () {
            return {
                selectionStart: this.selectionStart,
                viewSelectionStart: this.viewSelectionStart,
                position: this.position,
                viewPosition: this.viewPosition,
                leftoverVisibleColumns: this.leftoverVisibleColumns,
                selectionStartLeftoverVisibleColumns: this.selectionStartLeftoverVisibleColumns
            };
        };
        OneCursor.prototype.restoreState = function (state) {
            var position = this.model.validatePosition(state.position);
            var selectionStart;
            if (state.selectionStart) {
                selectionStart = this.model.validateRange(state.selectionStart);
            }
            else {
                selectionStart = new range_1.Range(position.lineNumber, position.column, position.lineNumber, position.column);
            }
            var viewPosition = this.viewModelHelper.validateViewPosition(state.viewPosition.lineNumber, state.viewPosition.column, position);
            var viewSelectionStart;
            if (state.viewSelectionStart) {
                viewSelectionStart = this.viewModelHelper.validateViewRange(state.viewSelectionStart.startLineNumber, state.viewSelectionStart.startColumn, state.viewSelectionStart.endLineNumber, state.viewSelectionStart.endColumn, selectionStart);
            }
            else {
                viewSelectionStart = this.viewModelHelper.convertModelRangeToViewRange(selectionStart);
            }
            this._set(selectionStart, state.selectionStartLeftoverVisibleColumns, position, state.leftoverVisibleColumns, viewSelectionStart, viewPosition);
        };
        OneCursor.prototype.updateModeConfiguration = function (modeConfiguration) {
            this.modeConfiguration = modeConfiguration;
        };
        OneCursor.prototype.duplicate = function () {
            var result = new OneCursor(this.editorId, this.model, this.configuration, this.modeConfiguration, this.viewModelHelper);
            result._set(this.selectionStart, this.selectionStartLeftoverVisibleColumns, this.position, this.leftoverVisibleColumns, this.viewSelectionStart, this.viewPosition);
            return result;
        };
        OneCursor.prototype.dispose = function () {
            this.model._removeMarker(this._selStartMarker);
            this.model._removeMarker(this._selEndMarker);
            this.bracketDecorations = this.model.deltaDecorations(this.bracketDecorations, [], this.editorId);
        };
        OneCursor.prototype.adjustBracketDecorations = function () {
            var bracketMatch = null;
            var selection = this.getSelection();
            if (selection.isEmpty()) {
                bracketMatch = this.model.matchBracket(this.position, /*inaccurateResultAcceptable*/ true);
            }
            var newDecorations = [];
            if (bracketMatch && bracketMatch.brackets) {
                var options = {
                    stickiness: EditorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                    className: 'bracket-match'
                };
                newDecorations.push({ range: bracketMatch.brackets[0], options: options });
                newDecorations.push({ range: bracketMatch.brackets[1], options: options });
            }
            this.bracketDecorations = this.model.deltaDecorations(this.bracketDecorations, newDecorations, this.editorId);
        };
        OneCursor.computeSelection = function (selectionStart, position) {
            var startLineNumber, startColumn, endLineNumber, endColumn;
            if (selectionStart.isEmpty()) {
                startLineNumber = selectionStart.startLineNumber;
                startColumn = selectionStart.startColumn;
                endLineNumber = position.lineNumber;
                endColumn = position.column;
            }
            else {
                if (position.isBeforeOrEqual(selectionStart.getStartPosition())) {
                    startLineNumber = selectionStart.endLineNumber;
                    startColumn = selectionStart.endColumn;
                    endLineNumber = position.lineNumber;
                    endColumn = position.column;
                }
                else {
                    startLineNumber = selectionStart.startLineNumber;
                    startColumn = selectionStart.startColumn;
                    endLineNumber = position.lineNumber;
                    endColumn = position.column;
                }
            }
            return new selection_1.Selection(startLineNumber, startColumn, endLineNumber, endColumn);
        };
        OneCursor.prototype.setSelection = function (desiredSelection) {
            var position = this.model.validatePosition({
                lineNumber: desiredSelection.positionLineNumber,
                column: desiredSelection.positionColumn
            });
            var selectionStartPosition = this.model.validatePosition({
                lineNumber: desiredSelection.selectionStartLineNumber,
                column: desiredSelection.selectionStartColumn
            });
            var selectionStart = new range_1.Range(selectionStartPosition.lineNumber, selectionStartPosition.column, selectionStartPosition.lineNumber, selectionStartPosition.column);
            var viewPosition = this.viewModelHelper.convertModelPositionToViewPosition(position.lineNumber, position.column);
            var viewSelectionStart = this.viewModelHelper.convertModelRangeToViewRange(selectionStart);
            this._set(selectionStart, 0, position, 0, viewSelectionStart, viewPosition);
        };
        // -------------------- START modifications
        OneCursor.prototype.setSelectionStart = function (rng, viewRng) {
            this._set(rng, this.selectionStartLeftoverVisibleColumns, this.position, this.leftoverVisibleColumns, viewRng, this.viewPosition);
        };
        OneCursor.prototype.collapseSelection = function () {
            var selectionStart = new range_1.Range(this.position.lineNumber, this.position.column, this.position.lineNumber, this.position.column);
            var viewSelectionStart = new range_1.Range(this.viewPosition.lineNumber, this.viewPosition.column, this.viewPosition.lineNumber, this.viewPosition.column);
            this._set(selectionStart, 0, this.position, this.leftoverVisibleColumns, viewSelectionStart, this.viewPosition);
        };
        OneCursor.prototype.moveModelPosition = function (inSelectionMode, lineNumber, column, leftoverVisibleColumns, ensureInEditableRange) {
            var viewPosition = this.viewModelHelper.convertModelPositionToViewPosition(lineNumber, column);
            this._move(inSelectionMode, lineNumber, column, viewPosition.lineNumber, viewPosition.column, leftoverVisibleColumns, ensureInEditableRange);
        };
        OneCursor.prototype.moveViewPosition = function (inSelectionMode, viewLineNumber, viewColumn, leftoverVisibleColumns, ensureInEditableRange) {
            var modelPosition = this.viewModelHelper.convertViewToModelPosition(viewLineNumber, viewColumn);
            this._move(inSelectionMode, modelPosition.lineNumber, modelPosition.column, viewLineNumber, viewColumn, leftoverVisibleColumns, ensureInEditableRange);
        };
        OneCursor.prototype._move = function (inSelectionMode, lineNumber, column, viewLineNumber, viewColumn, leftoverVisibleColumns, ensureInEditableRange) {
            if (ensureInEditableRange) {
                var editableRange = this.model.getEditableRange();
                if (lineNumber < editableRange.startLineNumber || (lineNumber === editableRange.startLineNumber && column < editableRange.startColumn)) {
                    lineNumber = editableRange.startLineNumber;
                    column = editableRange.startColumn;
                    var viewPosition = this.viewModelHelper.convertModelPositionToViewPosition(lineNumber, column);
                    viewLineNumber = viewPosition.lineNumber;
                    viewColumn = viewPosition.column;
                }
                else if (lineNumber > editableRange.endLineNumber || (lineNumber === editableRange.endLineNumber && column > editableRange.endColumn)) {
                    lineNumber = editableRange.endLineNumber;
                    column = editableRange.endColumn;
                    var viewPosition = this.viewModelHelper.convertModelPositionToViewPosition(lineNumber, column);
                    viewLineNumber = viewPosition.lineNumber;
                    viewColumn = viewPosition.column;
                }
            }
            this._actualMove(inSelectionMode, new position_1.Position(lineNumber, column), new position_1.Position(viewLineNumber, viewColumn), leftoverVisibleColumns);
        };
        OneCursor.prototype._actualMove = function (inSelectionMode, position, viewPosition, leftoverVisibleColumns) {
            if (inSelectionMode) {
                // move just position
                this._set(this.selectionStart, this.selectionStartLeftoverVisibleColumns, position, leftoverVisibleColumns, this.viewSelectionStart, viewPosition);
            }
            else {
                // move everything
                var selectionStart = new range_1.Range(position.lineNumber, position.column, position.lineNumber, position.column);
                var viewSelectionStart = new range_1.Range(viewPosition.lineNumber, viewPosition.column, viewPosition.lineNumber, viewPosition.column);
                this._set(selectionStart, leftoverVisibleColumns, position, leftoverVisibleColumns, viewSelectionStart, viewPosition);
            }
        };
        OneCursor.prototype._recoverSelectionFromMarkers = function () {
            var start = this.model._getMarker(this._selStartMarker);
            var end = this.model._getMarker(this._selEndMarker);
            if (this._selDirection === EditorCommon.SelectionDirection.LTR) {
                return new selection_1.Selection(start.lineNumber, start.column, end.lineNumber, end.column);
            }
            return new selection_1.Selection(end.lineNumber, end.column, start.lineNumber, start.column);
        };
        OneCursor.prototype.recoverSelectionFromMarkers = function (ctx) {
            ctx.cursorPositionChangeReason = 'recoverFromMarkers';
            ctx.shouldPushStackElementBefore = true;
            ctx.shouldPushStackElementAfter = true;
            ctx.shouldReveal = false;
            ctx.shouldRevealHorizontal = false;
            var recoveredSelection = this._recoverSelectionFromMarkers();
            var selectionStart = new range_1.Range(recoveredSelection.selectionStartLineNumber, recoveredSelection.selectionStartColumn, recoveredSelection.selectionStartLineNumber, recoveredSelection.selectionStartColumn);
            var position = new position_1.Position(recoveredSelection.positionLineNumber, recoveredSelection.positionColumn);
            var viewSelectionStart = this.viewModelHelper.convertModelRangeToViewRange(selectionStart);
            var viewPosition = this.viewModelHelper.convertViewToModelPosition(position.lineNumber, position.column);
            this._set(selectionStart, 0, position, 0, viewSelectionStart, viewPosition);
            return true;
        };
        // -------------------- END modifications
        // -------------------- START reading API
        OneCursor.prototype.getSelectionStart = function () {
            return this.selectionStart;
        };
        OneCursor.prototype.getPosition = function () {
            return this.position;
        };
        OneCursor.prototype.getSelection = function () {
            return this._cachedSelection;
        };
        OneCursor.prototype.getViewPosition = function () {
            return this.viewPosition;
        };
        OneCursor.prototype.getViewSelection = function () {
            return this._cachedViewSelection;
        };
        OneCursor.prototype.getValidViewPosition = function () {
            return this.viewModelHelper.validateViewPosition(this.viewPosition.lineNumber, this.viewPosition.column, this.position);
        };
        OneCursor.prototype.hasSelection = function () {
            return (!this.getSelection().isEmpty() || !this.selectionStart.isEmpty());
        };
        OneCursor.prototype.getBracketsDecorations = function () {
            return this.bracketDecorations;
        };
        OneCursor.prototype.getLeftoverVisibleColumns = function () {
            return this.leftoverVisibleColumns;
        };
        OneCursor.prototype.getSelectionStartLeftoverVisibleColumns = function () {
            return this.selectionStartLeftoverVisibleColumns;
        };
        OneCursor.prototype.setSelectionStartLeftoverVisibleColumns = function (value) {
            this.selectionStartLeftoverVisibleColumns = value;
        };
        // -- utils
        OneCursor.prototype.validatePosition = function (position) {
            return this.model.validatePosition(position);
        };
        OneCursor.prototype.validateViewPosition = function (viewLineNumber, viewColumn, modelPosition) {
            return this.viewModelHelper.validateViewPosition(viewLineNumber, viewColumn, modelPosition);
        };
        OneCursor.prototype.convertViewToModelPosition = function (lineNumber, column) {
            return this.viewModelHelper.convertViewToModelPosition(lineNumber, column);
        };
        OneCursor.prototype.convertModelPositionToViewPosition = function (lineNumber, column) {
            return this.viewModelHelper.convertModelPositionToViewPosition(lineNumber, column);
        };
        // -- model
        OneCursor.prototype.findWord = function (position, preference, skipSyntaxTokens) {
            return this.helper.findWord(position, preference, skipSyntaxTokens);
        };
        OneCursor.prototype.getLeftOfPosition = function (lineNumber, column) {
            return this.helper.getLeftOfPosition(this.model, lineNumber, column);
        };
        OneCursor.prototype.getRightOfPosition = function (lineNumber, column) {
            return this.helper.getRightOfPosition(this.model, lineNumber, column);
        };
        OneCursor.prototype.getPositionUp = function (lineNumber, column, leftoverVisibleColumns, count) {
            return this.helper.getPositionUp(this.model, lineNumber, column, leftoverVisibleColumns, count);
        };
        OneCursor.prototype.getPositionDown = function (lineNumber, column, leftoverVisibleColumns, count) {
            return this.helper.getPositionDown(this.model, lineNumber, column, leftoverVisibleColumns, count);
        };
        OneCursor.prototype.getColumnAtBeginningOfLine = function (lineNumber, column) {
            return this.helper.getColumnAtBeginningOfLine(this.model, lineNumber, column);
        };
        OneCursor.prototype.getColumnAtEndOfLine = function (lineNumber, column) {
            return this.helper.getColumnAtEndOfLine(this.model, lineNumber, column);
        };
        // -- view
        OneCursor.prototype.getViewLineMaxColumn = function (lineNumber) {
            return this.viewModelHelper.viewModel.getLineMaxColumn(lineNumber);
        };
        OneCursor.prototype.getLeftOfViewPosition = function (lineNumber, column) {
            return this.helper.getLeftOfPosition(this.viewModelHelper.viewModel, lineNumber, column);
        };
        OneCursor.prototype.getRightOfViewPosition = function (lineNumber, column) {
            return this.helper.getRightOfPosition(this.viewModelHelper.viewModel, lineNumber, column);
        };
        OneCursor.prototype.getViewPositionUp = function (lineNumber, column, leftoverVisibleColumns, count) {
            return this.helper.getPositionUp(this.viewModelHelper.viewModel, lineNumber, column, leftoverVisibleColumns, count);
        };
        OneCursor.prototype.getViewPositionDown = function (lineNumber, column, leftoverVisibleColumns, count) {
            return this.helper.getPositionDown(this.viewModelHelper.viewModel, lineNumber, column, leftoverVisibleColumns, count);
        };
        OneCursor.prototype.getColumnAtBeginningOfViewLine = function (lineNumber, column) {
            return this.helper.getColumnAtBeginningOfLine(this.viewModelHelper.viewModel, lineNumber, column);
        };
        OneCursor.prototype.getColumnAtEndOfViewLine = function (lineNumber, column) {
            return this.helper.getColumnAtEndOfLine(this.viewModelHelper.viewModel, lineNumber, column);
        };
        return OneCursor;
    })();
    exports.OneCursor = OneCursor;
    var OneCursorOp = (function () {
        function OneCursorOp() {
        }
        // -------------------- START handlers that simply change cursor state
        OneCursorOp.jumpToBracket = function (cursor, ctx) {
            var bracketDecorations = cursor.getBracketsDecorations();
            if (bracketDecorations.length !== 2) {
                return false;
            }
            var firstBracket = cursor.model.getDecorationRange(bracketDecorations[0]);
            var secondBracket = cursor.model.getDecorationRange(bracketDecorations[1]);
            var position = cursor.getPosition();
            if (Utils.isPositionAtRangeEdges(position, firstBracket) || Utils.isPositionInsideRange(position, firstBracket)) {
                cursor.moveModelPosition(false, secondBracket.endLineNumber, secondBracket.endColumn, 0, false);
                return true;
            }
            if (Utils.isPositionAtRangeEdges(position, secondBracket) || Utils.isPositionInsideRange(position, secondBracket)) {
                cursor.moveModelPosition(false, firstBracket.endLineNumber, firstBracket.endColumn, 0, false);
                return true;
            }
            return false;
        };
        OneCursorOp.moveTo = function (cursor, inSelectionMode, position, viewPosition, eventSource, ctx) {
            var validatedPosition = cursor.model.validatePosition(position);
            var validatedViewPosition;
            if (viewPosition) {
                validatedViewPosition = cursor.validateViewPosition(viewPosition.lineNumber, viewPosition.column, validatedPosition);
            }
            else {
                validatedViewPosition = cursor.convertModelPositionToViewPosition(validatedPosition.lineNumber, validatedPosition.column);
            }
            var reason = (eventSource === 'mouse' ? 'explicit' : null);
            if (eventSource === 'api') {
                ctx.shouldRevealVerticalInCenter = true;
            }
            if (reason) {
                ctx.cursorPositionChangeReason = reason;
            }
            cursor.moveViewPosition(inSelectionMode, validatedViewPosition.lineNumber, validatedViewPosition.column, 0, false);
            return true;
        };
        OneCursorOp.moveLeft = function (cursor, inSelectionMode, ctx) {
            var viewLineNumber, viewColumn;
            if (cursor.hasSelection() && !inSelectionMode) {
                // If we are in selection mode, move left without selection cancels selection and puts cursor at the beginning of the selection
                var viewSelection = cursor.getViewSelection();
                var viewSelectionStart = cursor.validateViewPosition(viewSelection.startLineNumber, viewSelection.startColumn, cursor.getSelection().getStartPosition());
                viewLineNumber = viewSelectionStart.lineNumber;
                viewColumn = viewSelectionStart.column;
            }
            else {
                var validatedViewPosition = cursor.getValidViewPosition();
                var r = cursor.getLeftOfViewPosition(validatedViewPosition.lineNumber, validatedViewPosition.column);
                viewLineNumber = r.lineNumber;
                viewColumn = r.column;
            }
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveViewPosition(inSelectionMode, viewLineNumber, viewColumn, 0, true);
            return true;
        };
        OneCursorOp.moveWordLeft = function (cursor, inSelectionMode, ctx) {
            var position = cursor.getPosition();
            var lineNumber = position.lineNumber;
            var column = position.column;
            var wentUp = false;
            if (column === 1) {
                if (lineNumber > 1) {
                    wentUp = true;
                    lineNumber = lineNumber - 1;
                    column = cursor.model.getLineMaxColumn(lineNumber);
                }
            }
            var word = cursor.findWord(new position_1.Position(lineNumber, column), 'left', true);
            if (word) {
                column = word.start + 1;
            }
            else {
                column = 1;
            }
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveModelPosition(inSelectionMode, lineNumber, column, 0, true);
            return true;
        };
        OneCursorOp.moveRight = function (cursor, inSelectionMode, ctx) {
            var viewLineNumber, viewColumn;
            if (cursor.hasSelection() && !inSelectionMode) {
                // If we are in selection mode, move right without selection cancels selection and puts cursor at the end of the selection
                var viewSelection = cursor.getViewSelection();
                var viewSelectionEnd = cursor.validateViewPosition(viewSelection.endLineNumber, viewSelection.endColumn, cursor.getSelection().getEndPosition());
                viewLineNumber = viewSelectionEnd.lineNumber;
                viewColumn = viewSelectionEnd.column;
            }
            else {
                var validatedViewPosition = cursor.getValidViewPosition();
                ;
                var r = cursor.getRightOfViewPosition(validatedViewPosition.lineNumber, validatedViewPosition.column);
                viewLineNumber = r.lineNumber;
                viewColumn = r.column;
            }
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveViewPosition(inSelectionMode, viewLineNumber, viewColumn, 0, true);
            return true;
        };
        OneCursorOp.moveWordRight = function (cursor, inSelectionMode, ctx) {
            var position = cursor.getPosition();
            var lineNumber = position.lineNumber;
            var column = position.column;
            var wentDown = false;
            if (column === cursor.model.getLineMaxColumn(lineNumber)) {
                if (lineNumber < cursor.model.getLineCount()) {
                    wentDown = true;
                    lineNumber = lineNumber + 1;
                    column = 1;
                }
            }
            var word = cursor.findWord(new position_1.Position(lineNumber, column), 'right', true);
            if (word) {
                column = word.end + 1;
            }
            else {
                column = cursor.model.getLineMaxColumn(lineNumber);
            }
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveModelPosition(inSelectionMode, lineNumber, column, 0, true);
            return true;
        };
        OneCursorOp.moveDown = function (cursor, inSelectionMode, isPaged, ctx) {
            var linesCount = isPaged ? cursor.configuration.editor.pageSize : 1;
            var viewLineNumber, viewColumn;
            if (cursor.hasSelection() && !inSelectionMode) {
                // If we are in selection mode, move down acts relative to the end of selection
                var viewSelection = cursor.getViewSelection();
                var viewSelectionEnd = cursor.validateViewPosition(viewSelection.endLineNumber, viewSelection.endColumn, cursor.getSelection().getEndPosition());
                viewLineNumber = viewSelectionEnd.lineNumber;
                viewColumn = viewSelectionEnd.column;
            }
            else {
                var validatedViewPosition = cursor.getValidViewPosition();
                ;
                viewLineNumber = validatedViewPosition.lineNumber;
                viewColumn = validatedViewPosition.column;
            }
            var r = cursor.getViewPositionDown(viewLineNumber, viewColumn, cursor.getLeftoverVisibleColumns(), linesCount);
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveViewPosition(inSelectionMode, r.lineNumber, r.column, r.leftoverVisibleColumns, true);
            return true;
        };
        OneCursorOp.translateDown = function (cursor, ctx) {
            var selection = cursor.getViewSelection();
            var selectionStart = cursor.getViewPositionDown(selection.selectionStartLineNumber, selection.selectionStartColumn, cursor.getSelectionStartLeftoverVisibleColumns(), 1);
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveViewPosition(false, selectionStart.lineNumber, selectionStart.column, cursor.getLeftoverVisibleColumns(), true);
            var position = cursor.getViewPositionDown(selection.positionLineNumber, selection.positionColumn, cursor.getLeftoverVisibleColumns(), 1);
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveViewPosition(true, position.lineNumber, position.column, position.leftoverVisibleColumns, true);
            cursor.setSelectionStartLeftoverVisibleColumns(selectionStart.leftoverVisibleColumns);
            return true;
        };
        OneCursorOp.moveUp = function (cursor, inSelectionMode, isPaged, ctx) {
            var linesCount = isPaged ? cursor.configuration.editor.pageSize : 1;
            var viewLineNumber, viewColumn;
            if (cursor.hasSelection() && !inSelectionMode) {
                // If we are in selection mode, move up acts relative to the beginning of selection
                var viewSelection = cursor.getViewSelection();
                var viewSelectionStart = cursor.validateViewPosition(viewSelection.startLineNumber, viewSelection.startColumn, cursor.getSelection().getStartPosition());
                viewLineNumber = viewSelectionStart.lineNumber;
                viewColumn = viewSelectionStart.column;
            }
            else {
                var validatedViewPosition = cursor.getValidViewPosition();
                viewLineNumber = validatedViewPosition.lineNumber;
                viewColumn = validatedViewPosition.column;
            }
            var r = cursor.getViewPositionUp(viewLineNumber, viewColumn, cursor.getLeftoverVisibleColumns(), linesCount);
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveViewPosition(inSelectionMode, r.lineNumber, r.column, r.leftoverVisibleColumns, true);
            return true;
        };
        OneCursorOp.translateUp = function (cursor, ctx) {
            var selection = cursor.getViewSelection();
            var selectionStart = cursor.getViewPositionUp(selection.selectionStartLineNumber, selection.selectionStartColumn, cursor.getSelectionStartLeftoverVisibleColumns(), 1);
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveViewPosition(false, selectionStart.lineNumber, selectionStart.column, cursor.getLeftoverVisibleColumns(), true);
            var position = cursor.getViewPositionUp(selection.positionLineNumber, selection.positionColumn, cursor.getLeftoverVisibleColumns(), 1);
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveViewPosition(true, position.lineNumber, position.column, position.leftoverVisibleColumns, true);
            cursor.setSelectionStartLeftoverVisibleColumns(selectionStart.leftoverVisibleColumns);
            return true;
        };
        OneCursorOp.moveToBeginningOfLine = function (cursor, inSelectionMode, ctx) {
            var validatedViewPosition = cursor.getValidViewPosition();
            var viewLineNumber = validatedViewPosition.lineNumber;
            var viewColumn = validatedViewPosition.column;
            viewColumn = cursor.getColumnAtBeginningOfViewLine(viewLineNumber, viewColumn);
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveViewPosition(inSelectionMode, viewLineNumber, viewColumn, 0, true);
            return true;
        };
        OneCursorOp.moveToEndOfLine = function (cursor, inSelectionMode, ctx) {
            var validatedViewPosition = cursor.getValidViewPosition();
            var viewLineNumber = validatedViewPosition.lineNumber;
            var viewColumn = validatedViewPosition.column;
            viewColumn = cursor.getColumnAtEndOfViewLine(viewLineNumber, viewColumn);
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveViewPosition(inSelectionMode, viewLineNumber, viewColumn, 0, true);
            return true;
        };
        OneCursorOp.expandLineSelection = function (cursor, ctx) {
            ctx.cursorPositionChangeReason = 'explicit';
            var viewSel = cursor.getViewSelection();
            var viewStartLineNumber = viewSel.startLineNumber;
            var viewStartColumn = viewSel.startColumn;
            var viewEndLineNumber = viewSel.endLineNumber;
            var viewEndColumn = viewSel.endColumn;
            var viewEndMaxColumn = cursor.getViewLineMaxColumn(viewEndLineNumber);
            if (viewStartColumn !== 1 || viewEndColumn !== viewEndMaxColumn) {
                viewStartColumn = 1;
                viewEndColumn = viewEndMaxColumn;
            }
            else {
                // Expand selection with one more line down
                var moveResult = cursor.getViewPositionDown(viewEndLineNumber, viewEndColumn, 0, 1);
                viewEndLineNumber = moveResult.lineNumber;
                viewEndColumn = cursor.getViewLineMaxColumn(viewEndLineNumber);
            }
            cursor.moveViewPosition(false, viewStartLineNumber, viewStartColumn, 0, true);
            cursor.moveViewPosition(true, viewEndLineNumber, viewEndColumn, 0, true);
            return true;
        };
        OneCursorOp.moveToBeginningOfBuffer = function (cursor, inSelectionMode, ctx) {
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveModelPosition(inSelectionMode, 1, 1, 0, true);
            return true;
        };
        OneCursorOp.moveToEndOfBuffer = function (cursor, inSelectionMode, ctx) {
            var lastLineNumber = cursor.model.getLineCount();
            var lastColumn = cursor.model.getLineMaxColumn(lastLineNumber);
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveModelPosition(inSelectionMode, lastLineNumber, lastColumn, 0, true);
            return true;
        };
        OneCursorOp.selectAll = function (cursor, ctx) {
            var selectEntireBuffer = true;
            var newSelectionStartLineNumber, newSelectionStartColumn, newPositionLineNumber, newPositionColumn;
            if (cursor.model.hasEditableRange()) {
                // Toggle between selecting editable range and selecting the entire buffer
                var editableRange = cursor.model.getEditableRange();
                var selection = cursor.getSelection();
                if (!selection.equalsRange(editableRange)) {
                    // Selection is not editable range => select editable range
                    selectEntireBuffer = false;
                    newSelectionStartLineNumber = editableRange.startLineNumber;
                    newSelectionStartColumn = editableRange.startColumn;
                    newPositionLineNumber = editableRange.endLineNumber;
                    newPositionColumn = editableRange.endColumn;
                }
            }
            if (selectEntireBuffer) {
                newSelectionStartLineNumber = 1;
                newSelectionStartColumn = 1;
                newPositionLineNumber = cursor.model.getLineCount();
                newPositionColumn = cursor.model.getLineMaxColumn(newPositionLineNumber);
            }
            cursor.moveModelPosition(false, newSelectionStartLineNumber, newSelectionStartColumn, 0, false);
            cursor.moveModelPosition(true, newPositionLineNumber, newPositionColumn, 0, false);
            ctx.shouldReveal = false;
            ctx.shouldRevealHorizontal = false;
            return true;
        };
        OneCursorOp.line = function (cursor, inSelectionMode, position, viewPosition, ctx) {
            // TODO@Alex -> select in editable range
            var validatedPosition = cursor.validatePosition(position);
            var validatedViewPosition;
            if (viewPosition) {
                validatedViewPosition = cursor.validateViewPosition(viewPosition.lineNumber, viewPosition.column, validatedPosition);
            }
            else {
                validatedViewPosition = cursor.convertModelPositionToViewPosition(validatedPosition.lineNumber, validatedPosition.column);
            }
            var viewLineNumber, viewColumn;
            if (!inSelectionMode || !cursor.hasSelection()) {
                var viewSelectionStartRange = new range_1.Range(validatedViewPosition.lineNumber, 1, validatedViewPosition.lineNumber, cursor.getViewLineMaxColumn(validatedViewPosition.lineNumber));
                var r1 = cursor.convertViewToModelPosition(viewSelectionStartRange.startLineNumber, viewSelectionStartRange.startColumn);
                var r2 = cursor.convertViewToModelPosition(viewSelectionStartRange.endLineNumber, viewSelectionStartRange.endColumn);
                cursor.setSelectionStart(new range_1.Range(r1.lineNumber, r1.column, r2.lineNumber, r2.column), viewSelectionStartRange);
                viewLineNumber = viewSelectionStartRange.endLineNumber;
                viewColumn = viewSelectionStartRange.endColumn;
            }
            else {
                viewLineNumber = validatedViewPosition.lineNumber;
                if (validatedPosition.isBeforeOrEqual(cursor.getSelectionStart().getStartPosition())) {
                    viewColumn = 1;
                }
                else {
                    viewColumn = cursor.getViewLineMaxColumn(viewLineNumber);
                }
            }
            ctx.cursorPositionChangeReason = 'explicit';
            ctx.shouldRevealHorizontal = false;
            cursor.moveViewPosition(cursor.hasSelection(), viewLineNumber, viewColumn, 0, false);
            return true;
        };
        OneCursorOp.word = function (cursor, inSelectionMode, position, preference, ctx) {
            // TODO@Alex -> select in editable range
            var validatedPosition = cursor.validatePosition(position);
            var word = cursor.findWord(validatedPosition, preference);
            var wordStartColumn, wordEndColumn;
            var lineNumber, column;
            if (!inSelectionMode || !cursor.hasSelection()) {
                if (word) {
                    wordStartColumn = word.start + 1;
                    wordEndColumn = word.end + 1;
                }
                else {
                    var maxColumn = cursor.model.getLineMaxColumn(validatedPosition.lineNumber);
                    if (validatedPosition.column === maxColumn || preference === 'left') {
                        wordStartColumn = validatedPosition.column - 1;
                        wordEndColumn = validatedPosition.column;
                    }
                    else {
                        wordStartColumn = validatedPosition.column;
                        wordEndColumn = validatedPosition.column + 1;
                    }
                    if (wordStartColumn <= 1) {
                        wordStartColumn = 1;
                    }
                    if (wordEndColumn >= maxColumn) {
                        wordEndColumn = maxColumn;
                    }
                }
                var selectionStartRange = new range_1.Range(validatedPosition.lineNumber, wordStartColumn, validatedPosition.lineNumber, wordEndColumn);
                var r1 = cursor.convertModelPositionToViewPosition(validatedPosition.lineNumber, wordStartColumn);
                var r2 = cursor.convertModelPositionToViewPosition(validatedPosition.lineNumber, wordEndColumn);
                cursor.setSelectionStart(selectionStartRange, new range_1.Range(r1.lineNumber, r1.column, r2.lineNumber, r2.column));
                lineNumber = selectionStartRange.endLineNumber;
                column = selectionStartRange.endColumn;
            }
            else {
                wordStartColumn = word ? word.start + 1 : validatedPosition.column;
                wordEndColumn = word ? word.end + 1 : validatedPosition.column;
                lineNumber = validatedPosition.lineNumber;
                if (validatedPosition.isBeforeOrEqual(cursor.getSelectionStart().getStartPosition())) {
                    column = wordStartColumn;
                }
                else {
                    column = wordEndColumn;
                }
            }
            ctx.cursorPositionChangeReason = 'explicit';
            cursor.moveModelPosition(cursor.hasSelection(), lineNumber, column, 0, false);
            return true;
        };
        OneCursorOp.cancelSelection = function (cursor, ctx) {
            if (!cursor.hasSelection()) {
                return false;
            }
            cursor.collapseSelection();
            return true;
        };
        // -------------------- STOP handlers that simply change cursor state
        // -------------------- START type interceptors & co.
        OneCursorOp._typeInterceptorEnter = function (cursor, ch, ctx) {
            if (ch !== '\n') {
                return false;
            }
            return this._enter(cursor, false, ctx);
        };
        OneCursorOp.lineInsertBefore = function (cursor, ctx) {
            var lineNumber = cursor.getPosition().lineNumber;
            if (lineNumber === 1) {
                ctx.executeCommand = new replaceCommand_1.ReplaceCommandWithoutChangingPosition(new range_1.Range(1, 1, 1, 1), '\n');
                return true;
            }
            lineNumber--;
            var column = cursor.model.getLineMaxColumn(lineNumber);
            return this._enter(cursor, false, ctx, new position_1.Position(lineNumber, column), new range_1.Range(lineNumber, column, lineNumber, column));
        };
        OneCursorOp.lineInsertAfter = function (cursor, ctx) {
            var position = cursor.getPosition();
            var column = cursor.model.getLineMaxColumn(position.lineNumber);
            return this._enter(cursor, false, ctx, new position_1.Position(position.lineNumber, column), new range_1.Range(position.lineNumber, column, position.lineNumber, column));
        };
        OneCursorOp.lineBreakInsert = function (cursor, ctx) {
            return this._enter(cursor, true, ctx);
        };
        OneCursorOp._enter = function (cursor, keepPosition, ctx, position, range) {
            if (typeof position === 'undefined') {
                position = cursor.getPosition();
            }
            if (typeof range === 'undefined') {
                range = cursor.getSelection();
            }
            ctx.shouldPushStackElementBefore = true;
            var r = onEnter_1.getEnterActionAtPosition(cursor.model, position.lineNumber, position.column);
            var enterAction = r.enterAction;
            var indentation = r.indentation;
            if (enterAction.indentAction === modes_1.IndentAction.None) {
                // Nothing special
                this.actualType(cursor, '\n' + cursor.configuration.normalizeIndentation(indentation + enterAction.appendText), keepPosition, ctx, range);
            }
            else if (enterAction.indentAction === modes_1.IndentAction.Indent) {
                // Indent once
                this.actualType(cursor, '\n' + cursor.configuration.normalizeIndentation(indentation + enterAction.appendText), keepPosition, ctx, range);
            }
            else if (enterAction.indentAction === modes_1.IndentAction.IndentOutdent) {
                // Ultra special
                var normalIndent = cursor.configuration.normalizeIndentation(indentation);
                var increasedIndent = cursor.configuration.normalizeIndentation(indentation + enterAction.appendText);
                var typeText = '\n' + increasedIndent + '\n' + normalIndent;
                if (keepPosition) {
                    ctx.executeCommand = new replaceCommand_1.ReplaceCommandWithoutChangingPosition(range, typeText);
                }
                else {
                    ctx.executeCommand = new replaceCommand_1.ReplaceCommandWithOffsetCursorState(range, typeText, -1, increasedIndent.length - normalIndent.length);
                }
            }
            else if (enterAction.indentAction === modes_1.IndentAction.Outdent) {
                var desiredIndentCount = shiftCommand_1.ShiftCommand.unshiftIndentCount(indentation, indentation.length + 1, cursor.configuration.getIndentationOptions().tabSize);
                var actualIndentation = '';
                for (var i = 0; i < desiredIndentCount; i++) {
                    actualIndentation += '\t';
                }
                this.actualType(cursor, '\n' + cursor.configuration.normalizeIndentation(actualIndentation + enterAction.appendText), keepPosition, ctx, range);
            }
            return true;
        };
        OneCursorOp._typeInterceptorAutoClosingCloseChar = function (cursor, ch, ctx) {
            if (!cursor.configuration.editor.autoClosingBrackets) {
                return false;
            }
            var selection = cursor.getSelection();
            if (!selection.isEmpty() || !cursor.modeConfiguration.autoClosingPairsClose.hasOwnProperty(ch)) {
                return false;
            }
            var position = cursor.getPosition();
            var lineText = cursor.model.getLineContent(position.lineNumber);
            var beforeCharacter = lineText[position.column - 1];
            if (beforeCharacter !== ch) {
                return false;
            }
            var typeSelection = new range_1.Range(position.lineNumber, position.column, position.lineNumber, position.column + 1);
            ctx.executeCommand = new replaceCommand_1.ReplaceCommand(typeSelection, ch);
            return true;
        };
        OneCursorOp._typeInterceptorAutoClosingOpenChar = function (cursor, ch, ctx) {
            if (!cursor.configuration.editor.autoClosingBrackets) {
                return false;
            }
            var selection = cursor.getSelection();
            if (!selection.isEmpty() || !cursor.modeConfiguration.autoClosingPairsOpen.hasOwnProperty(ch)) {
                return false;
            }
            if (!cursor.model.getMode().characterPairSupport) {
                return false;
            }
            var position = cursor.getPosition();
            var lineText = cursor.model.getLineContent(position.lineNumber);
            var beforeCharacter = lineText[position.column - 1];
            // Only consider auto closing the pair if a space follows or if another autoclosed pair follows
            if (beforeCharacter) {
                var isBeforeCloseBrace = false;
                for (var closeBrace in cursor.modeConfiguration.autoClosingPairsClose) {
                    if (beforeCharacter === closeBrace) {
                        isBeforeCloseBrace = true;
                        break;
                    }
                }
                if (!isBeforeCloseBrace && !/\s/.test(beforeCharacter)) {
                    return false;
                }
            }
            var lineContext = cursor.model.getLineContext(position.lineNumber);
            var shouldAutoClosePair = false;
            try {
                shouldAutoClosePair = cursor.model.getMode().characterPairSupport.shouldAutoClosePair(ch, lineContext, position.column - 1);
            }
            catch (e) {
                Errors.onUnexpectedError(e);
            }
            if (!shouldAutoClosePair) {
                return false;
            }
            ctx.shouldPushStackElementBefore = true;
            var closeCharacter = cursor.modeConfiguration.autoClosingPairsOpen[ch];
            ctx.executeCommand = new replaceCommand_1.ReplaceCommandWithOffsetCursorState(selection, ch + closeCharacter, 0, -closeCharacter.length);
            return true;
        };
        OneCursorOp._typeInterceptorSurroundSelection = function (cursor, ch, ctx) {
            if (!cursor.configuration.editor.autoClosingBrackets) {
                return false;
            }
            var selection = cursor.getSelection();
            if (selection.isEmpty() || !cursor.modeConfiguration.surroundingPairs.hasOwnProperty(ch)) {
                return false;
            }
            var selectionContainsOnlyWhitespace = true, lineNumber, startIndex, endIndex, charIndex, charCode, lineText, _tab = '\t'.charCodeAt(0), _space = ' '.charCodeAt(0);
            for (lineNumber = selection.startLineNumber; lineNumber <= selection.endLineNumber; lineNumber++) {
                lineText = cursor.model.getLineContent(lineNumber);
                startIndex = (lineNumber === selection.startLineNumber ? selection.startColumn - 1 : 0);
                endIndex = (lineNumber === selection.endLineNumber ? selection.endColumn - 1 : lineText.length);
                for (charIndex = startIndex; charIndex < endIndex; charIndex++) {
                    charCode = lineText.charCodeAt(charIndex);
                    if (charCode !== _tab && charCode !== _space) {
                        selectionContainsOnlyWhitespace = false;
                        // Break outer loop
                        lineNumber = selection.endLineNumber + 1;
                        // Break inner loop
                        charIndex = endIndex;
                    }
                }
            }
            if (selectionContainsOnlyWhitespace) {
                return false;
            }
            var closeCharacter = cursor.modeConfiguration.surroundingPairs[ch];
            ctx.shouldPushStackElementBefore = true;
            ctx.shouldPushStackElementAfter = true;
            ctx.executeCommand = new surroundSelectionCommand_1.SurroundSelectionCommand(selection, ch, closeCharacter);
            return true;
        };
        OneCursorOp._typeInterceptorElectricChar = function (cursor, ch, ctx) {
            var _this = this;
            if (!cursor.modeConfiguration.electricChars.hasOwnProperty(ch)) {
                return false;
            }
            ctx.postOperationRunnable = function (postOperationCtx) { return _this._typeInterceptorElectricCharRunnable(cursor, postOperationCtx); };
            return this.actualType(cursor, ch, false, ctx);
        };
        OneCursorOp._typeInterceptorElectricCharRunnable = function (cursor, ctx) {
            var position = cursor.getPosition();
            var lineText = cursor.model.getLineContent(position.lineNumber);
            var lineContext = cursor.model.getLineContext(position.lineNumber);
            var electricAction;
            if (cursor.model.getMode().electricCharacterSupport) {
                try {
                    electricAction = cursor.model.getMode().electricCharacterSupport.onElectricCharacter(lineContext, position.column - 2);
                }
                catch (e) {
                    Errors.onUnexpectedError(e);
                }
            }
            if (electricAction) {
                var matchBracketType = electricAction.matchBracketType;
                var appendText = electricAction.appendText;
                if (matchBracketType) {
                    var match = null;
                    if (matchBracketType) {
                        match = cursor.model.findMatchingBracketUp(matchBracketType, position);
                    }
                    if (match) {
                        var matchLineNumber = match.startLineNumber;
                        var matchLine = cursor.model.getLineContent(matchLineNumber);
                        var matchLineIndentation = Strings.getLeadingWhitespace(matchLine);
                        var newIndentation = cursor.configuration.normalizeIndentation(matchLineIndentation);
                        var lineFirstNonBlankColumn = cursor.model.getLineFirstNonWhitespaceColumn(position.lineNumber) || position.column;
                        var oldIndentation = lineText.substring(0, lineFirstNonBlankColumn - 1);
                        if (oldIndentation !== newIndentation) {
                            var prefix = lineText.substring(lineFirstNonBlankColumn - 1, position.column - 1);
                            var typeText = newIndentation + prefix;
                            var typeSelection = new range_1.Range(position.lineNumber, 1, position.lineNumber, position.column);
                            ctx.shouldPushStackElementAfter = true;
                            ctx.executeCommand = new replaceCommand_1.ReplaceCommand(typeSelection, typeText);
                        }
                    }
                }
                else if (appendText) {
                    var columnDeltaOffset = -appendText.length;
                    if (electricAction.advanceCount) {
                        columnDeltaOffset += electricAction.advanceCount;
                    }
                    ctx.shouldPushStackElementAfter = true;
                    ctx.executeCommand = new replaceCommand_1.ReplaceCommandWithOffsetCursorState(cursor.getSelection(), appendText, 0, columnDeltaOffset);
                }
            }
        };
        OneCursorOp.actualType = function (cursor, text, keepPosition, ctx, range) {
            if (typeof range === 'undefined') {
                range = cursor.getSelection();
            }
            if (keepPosition) {
                ctx.executeCommand = new replaceCommand_1.ReplaceCommandWithoutChangingPosition(range, text);
            }
            else {
                ctx.executeCommand = new replaceCommand_1.ReplaceCommand(range, text);
            }
            return true;
        };
        OneCursorOp.type = function (cursor, ch, ctx) {
            if (this._typeInterceptorEnter(cursor, ch, ctx)) {
                return true;
            }
            if (this._typeInterceptorAutoClosingCloseChar(cursor, ch, ctx)) {
                return true;
            }
            if (this._typeInterceptorAutoClosingOpenChar(cursor, ch, ctx)) {
                return true;
            }
            if (this._typeInterceptorSurroundSelection(cursor, ch, ctx)) {
                return true;
            }
            if (this._typeInterceptorElectricChar(cursor, ch, ctx)) {
                return true;
            }
            return this.actualType(cursor, ch, false, ctx);
        };
        OneCursorOp.replacePreviousChar = function (cursor, txt, ctx) {
            var pos = cursor.getPosition();
            var range;
            if (pos.column > 1) {
                range = new range_1.Range(pos.lineNumber, pos.column - 1, pos.lineNumber, pos.column);
            }
            else {
                range = new range_1.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column);
            }
            ctx.executeCommand = new replaceCommand_1.ReplaceCommand(range, txt);
            return true;
        };
        OneCursorOp._goodIndentForLine = function (cursor, lineNumber) {
            var lastLineNumber = lineNumber - 1;
            for (lastLineNumber = lineNumber - 1; lastLineNumber >= 1; lastLineNumber--) {
                var lineText = cursor.model.getLineContent(lastLineNumber);
                var nonWhitespaceIdx = Strings.lastNonWhitespaceIndex(lineText);
                if (nonWhitespaceIdx >= 0) {
                    break;
                }
            }
            if (lastLineNumber < 1) {
                // No previous line with content found
                return '\t';
            }
            var r = onEnter_1.getEnterActionAtPosition(cursor.model, lastLineNumber, cursor.model.getLineMaxColumn(lastLineNumber));
            var indentation;
            if (r.enterAction.indentAction === modes_1.IndentAction.Outdent) {
                var desiredIndentCount = shiftCommand_1.ShiftCommand.unshiftIndentCount(r.indentation, r.indentation.length, cursor.configuration.getIndentationOptions().tabSize);
                indentation = '';
                for (var i = 0; i < desiredIndentCount; i++) {
                    indentation += '\t';
                }
                indentation = cursor.configuration.normalizeIndentation(indentation);
            }
            else {
                indentation = r.indentation;
            }
            var result = indentation + r.enterAction.appendText;
            if (result.length === 0) {
                // good position is at column 1, but we gotta do something...
                return '\t';
            }
            return result;
        };
        OneCursorOp.tab = function (cursor, ctx) {
            var selection = cursor.getSelection();
            if (selection.isEmpty()) {
                var typeText = '';
                if (cursor.model.getLineMaxColumn(selection.startLineNumber) === 1) {
                    // Line is empty => indent straight to the right place
                    typeText = cursor.configuration.normalizeIndentation(this._goodIndentForLine(cursor, selection.startLineNumber));
                }
                else {
                    var position = cursor.getPosition();
                    if (cursor.configuration.getIndentationOptions().insertSpaces) {
                        var nextTabColumn = cursorMoveHelper_1.CursorMoveHelper.nextTabColumn(position.column - 1, cursor.configuration.getIndentationOptions().tabSize);
                        for (var i = position.column; i <= nextTabColumn; i++) {
                            typeText += ' ';
                        }
                    }
                    else {
                        typeText = '\t';
                    }
                }
                ctx.executeCommand = new replaceCommand_1.ReplaceCommand(selection, typeText);
                return true;
            }
            else {
                return this.indent(cursor, ctx);
            }
        };
        OneCursorOp.indent = function (cursor, ctx) {
            var selection = cursor.getSelection();
            ctx.shouldPushStackElementBefore = true;
            ctx.shouldPushStackElementAfter = true;
            ctx.executeCommand = new shiftCommand_1.ShiftCommand(selection, {
                isUnshift: false,
                tabSize: cursor.configuration.getIndentationOptions().tabSize,
                oneIndent: cursor.configuration.getOneIndent()
            });
            ctx.shouldRevealHorizontal = false;
            return true;
        };
        OneCursorOp.outdent = function (cursor, ctx) {
            var selection = cursor.getSelection();
            ctx.shouldPushStackElementBefore = true;
            ctx.shouldPushStackElementAfter = true;
            ctx.executeCommand = new shiftCommand_1.ShiftCommand(selection, {
                isUnshift: true,
                tabSize: cursor.configuration.getIndentationOptions().tabSize,
                oneIndent: cursor.configuration.getOneIndent()
            });
            ctx.shouldRevealHorizontal = false;
            return true;
        };
        OneCursorOp.paste = function (cursor, text, pasteOnNewLine, ctx) {
            var position = cursor.getPosition();
            ctx.cursorPositionChangeReason = 'paste';
            if (pasteOnNewLine && text.charAt(text.length - 1) === '\n') {
                if (text.indexOf('\n') === text.length - 1) {
                    // Paste entire line at the beginning of line
                    var typeSelection = new range_1.Range(position.lineNumber, 1, position.lineNumber, 1);
                    ctx.executeCommand = new replaceCommand_1.ReplaceCommand(typeSelection, text);
                    return true;
                }
            }
            ctx.executeCommand = new replaceCommand_1.ReplaceCommand(cursor.getSelection(), text);
            return true;
        };
        // -------------------- END type interceptors & co.
        // -------------------- START delete handlers & co.
        OneCursorOp._autoClosingPairDelete = function (cursor, ctx) {
            // Returns true if delete was handled.
            if (!cursor.configuration.editor.autoClosingBrackets) {
                return false;
            }
            var position = cursor.getPosition();
            var lineText = cursor.model.getLineContent(position.lineNumber);
            var character = lineText[position.column - 2];
            if (!cursor.modeConfiguration.autoClosingPairsOpen.hasOwnProperty(character)) {
                return false;
            }
            var afterCharacter = lineText[position.column - 1];
            var closeCharacter = cursor.modeConfiguration.autoClosingPairsOpen[character];
            if (afterCharacter !== closeCharacter) {
                return false;
            }
            var deleteSelection = new range_1.Range(position.lineNumber, position.column - 1, position.lineNumber, position.column + 1);
            ctx.executeCommand = new replaceCommand_1.ReplaceCommand(deleteSelection, '');
            return true;
        };
        OneCursorOp.deleteLeft = function (cursor, ctx) {
            if (this._autoClosingPairDelete(cursor, ctx)) {
                // This was a case for an auto-closing pair delete
                return true;
            }
            var deleteSelection = cursor.getSelection();
            if (deleteSelection.isEmpty()) {
                var position = cursor.getPosition();
                var leftOfPosition = cursor.getLeftOfPosition(position.lineNumber, position.column);
                deleteSelection = new range_1.Range(leftOfPosition.lineNumber, leftOfPosition.column, position.lineNumber, position.column);
            }
            if (deleteSelection.isEmpty()) {
                // Probably at beginning of file => ignore
                return true;
            }
            if (deleteSelection.startLineNumber !== deleteSelection.endLineNumber) {
                ctx.shouldPushStackElementBefore = true;
            }
            ctx.executeCommand = new replaceCommand_1.ReplaceCommand(deleteSelection, '');
            return true;
        };
        OneCursorOp.deleteWordLeft = function (cursor, ctx) {
            if (this._autoClosingPairDelete(cursor, ctx)) {
                // This was a case for an auto-closing pair delete
                return true;
            }
            var selection = cursor.getSelection();
            if (selection.isEmpty()) {
                var position = cursor.getPosition();
                var lineNumber = position.lineNumber;
                var column = position.column;
                if (lineNumber === 1 && column === 1) {
                    // Ignore deleting at beginning of file
                    return true;
                }
                // extend selection to the left until start of word
                var word = cursor.findWord(position, 'left', true);
                if (word) {
                    if (word.end + 1 < column) {
                        column = word.end + 1;
                    }
                    else {
                        column = word.start + 1;
                    }
                }
                else {
                    column = 1;
                }
                var deleteSelection = new range_1.Range(lineNumber, column, lineNumber, position.column);
                if (!deleteSelection.isEmpty()) {
                    ctx.executeCommand = new replaceCommand_1.ReplaceCommand(deleteSelection, '');
                    return true;
                }
            }
            return this.deleteLeft(cursor, ctx);
        };
        OneCursorOp.deleteRight = function (cursor, ctx) {
            var deleteSelection = cursor.getSelection();
            if (deleteSelection.isEmpty()) {
                var position = cursor.getPosition();
                var rightOfPosition = cursor.getRightOfPosition(position.lineNumber, position.column);
                deleteSelection = new range_1.Range(rightOfPosition.lineNumber, rightOfPosition.column, position.lineNumber, position.column);
            }
            if (deleteSelection.isEmpty()) {
                // Probably at end of file => ignore
                return true;
            }
            if (deleteSelection.startLineNumber !== deleteSelection.endLineNumber) {
                ctx.shouldPushStackElementBefore = true;
            }
            ctx.executeCommand = new replaceCommand_1.ReplaceCommand(deleteSelection, '');
            return true;
        };
        OneCursorOp.deleteWordRight = function (cursor, ctx) {
            var selection = cursor.getSelection();
            if (selection.isEmpty()) {
                var position = cursor.getPosition();
                var lineNumber = position.lineNumber;
                var column = position.column;
                var lineCount = cursor.model.getLineCount();
                var maxColumn = cursor.model.getLineMaxColumn(lineNumber);
                if (lineNumber === lineCount && column === maxColumn) {
                    // Ignore deleting at end of file
                    return true;
                }
                var word = cursor.findWord(new position_1.Position(lineNumber, column), 'right', true);
                if (word) {
                    if (word.start + 1 > column) {
                        column = word.start + 1;
                    }
                    else {
                        column = word.end + 1;
                    }
                }
                else {
                    column = maxColumn;
                }
                var deleteSelection = new range_1.Range(lineNumber, column, lineNumber, position.column);
                if (!deleteSelection.isEmpty()) {
                    ctx.executeCommand = new replaceCommand_1.ReplaceCommand(deleteSelection, '');
                    return true;
                }
            }
            // fall back to normal deleteRight behavior
            return this.deleteRight(cursor, ctx);
        };
        OneCursorOp.deleteAllLeft = function (cursor, ctx) {
            if (this._autoClosingPairDelete(cursor, ctx)) {
                // This was a case for an auto-closing pair delete
                return true;
            }
            var selection = cursor.getSelection();
            if (selection.isEmpty()) {
                var position = cursor.getPosition();
                var lineNumber = position.lineNumber;
                var column = position.column;
                if (column === 1) {
                    // Ignore deleting at beginning of line
                    return true;
                }
                var deleteSelection = new range_1.Range(lineNumber, 1, lineNumber, column);
                if (!deleteSelection.isEmpty()) {
                    ctx.executeCommand = new replaceCommand_1.ReplaceCommand(deleteSelection, '');
                    return true;
                }
            }
            return this.deleteLeft(cursor, ctx);
        };
        OneCursorOp.deleteAllRight = function (cursor, ctx) {
            var selection = cursor.getSelection();
            if (selection.isEmpty()) {
                var position = cursor.getPosition();
                var lineNumber = position.lineNumber;
                var column = position.column;
                var maxColumn = cursor.model.getLineMaxColumn(lineNumber);
                if (column === maxColumn) {
                    // Ignore deleting at end of file
                    return true;
                }
                var deleteSelection = new range_1.Range(lineNumber, column, lineNumber, maxColumn);
                if (!deleteSelection.isEmpty()) {
                    ctx.executeCommand = new replaceCommand_1.ReplaceCommand(deleteSelection, '');
                    return true;
                }
            }
            return this.deleteRight(cursor, ctx);
        };
        OneCursorOp.cut = function (cursor, enableEmptySelectionClipboard, ctx) {
            var selection = cursor.getSelection();
            if (selection.isEmpty()) {
                if (enableEmptySelectionClipboard) {
                    // This is a full line cut
                    var position = cursor.getPosition();
                    var startLineNumber, startColumn, endLineNumber, endColumn;
                    if (position.lineNumber < cursor.model.getLineCount()) {
                        // Cutting a line in the middle of the model
                        startLineNumber = position.lineNumber;
                        startColumn = 1;
                        endLineNumber = position.lineNumber + 1;
                        endColumn = 1;
                    }
                    else if (position.lineNumber > 1) {
                        // Cutting the last line & there are more than 1 lines in the model
                        startLineNumber = position.lineNumber - 1;
                        startColumn = cursor.model.getLineMaxColumn(position.lineNumber - 1);
                        endLineNumber = position.lineNumber;
                        endColumn = cursor.model.getLineMaxColumn(position.lineNumber);
                    }
                    else {
                        // Cutting the single line that the model contains
                        startLineNumber = position.lineNumber;
                        startColumn = 1;
                        endLineNumber = position.lineNumber;
                        endColumn = cursor.model.getLineMaxColumn(position.lineNumber);
                    }
                    var deleteSelection = new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn);
                    if (!deleteSelection.isEmpty()) {
                        ctx.executeCommand = new replaceCommand_1.ReplaceCommand(deleteSelection, '');
                    }
                }
                else {
                    // Cannot cut empty selection
                    return false;
                }
            }
            else {
                // Delete left or right, they will both result in the selection being deleted
                this.deleteRight(cursor, ctx);
            }
            return true;
        };
        return OneCursorOp;
    })();
    exports.OneCursorOp = OneCursorOp;
    var CursorHelper = (function () {
        function CursorHelper(model, configuration) {
            this.model = model;
            this.configuration = configuration;
            this.moveHelper = new cursorMoveHelper_1.CursorMoveHelper(this.configuration);
        }
        CursorHelper.prototype.getLeftOfPosition = function (model, lineNumber, column) {
            return this.moveHelper.getLeftOfPosition(model, lineNumber, column);
        };
        CursorHelper.prototype.getRightOfPosition = function (model, lineNumber, column) {
            return this.moveHelper.getRightOfPosition(model, lineNumber, column);
        };
        CursorHelper.prototype.getPositionUp = function (model, lineNumber, column, leftoverVisibleColumns, count) {
            return this.moveHelper.getPositionUp(model, lineNumber, column, leftoverVisibleColumns, count);
        };
        CursorHelper.prototype.getPositionDown = function (model, lineNumber, column, leftoverVisibleColumns, count) {
            return this.moveHelper.getPositionDown(model, lineNumber, column, leftoverVisibleColumns, count);
        };
        CursorHelper.prototype.getColumnAtBeginningOfLine = function (model, lineNumber, column) {
            return this.moveHelper.getColumnAtBeginningOfLine(model, lineNumber, column);
        };
        CursorHelper.prototype.getColumnAtEndOfLine = function (model, lineNumber, column) {
            return this.moveHelper.getColumnAtEndOfLine(model, lineNumber, column);
        };
        /**
         * ATTENTION: This works with 0-based columns (as oposed to the regular 1-based columns)
         */
        CursorHelper.prototype.nextTabColumn = function (column) {
            return cursorMoveHelper_1.CursorMoveHelper.nextTabColumn(column, this.configuration.getIndentationOptions().tabSize);
        };
        /**
         * ATTENTION: This works with 0-based columns (as oposed to the regular 1-based columns)
         */
        CursorHelper.prototype.prevTabColumn = function (column) {
            return cursorMoveHelper_1.CursorMoveHelper.prevTabColumn(column, this.configuration.getIndentationOptions().tabSize);
        };
        CursorHelper.prototype.findWord = function (position, preference, skipSyntaxTokens) {
            if (skipSyntaxTokens === void 0) { skipSyntaxTokens = false; }
            var words = this.model.getWords(position.lineNumber);
            var searchIndex, i, len;
            if (skipSyntaxTokens) {
                searchIndex = position.column - 1;
                if (preference === 'left') {
                    for (i = words.length - 1; i >= 0; i--) {
                        if (words[i].start >= searchIndex) {
                            continue;
                        }
                        return words[i];
                    }
                }
                else {
                    for (i = 0, len = words.length; i < len; i++) {
                        if (words[i].end <= searchIndex) {
                            continue;
                        }
                        return words[i];
                    }
                }
            }
            else {
                searchIndex = position.column;
                if (preference === 'left') {
                    if (searchIndex !== 1) {
                        searchIndex = searchIndex - 0.1;
                    }
                }
                else {
                    if (searchIndex !== this.model.getLineMaxColumn(position.lineNumber)) {
                        searchIndex = searchIndex + 0.1;
                    }
                }
                searchIndex = searchIndex - 1;
                for (i = 0, len = words.length; i < len; i++) {
                    if (words[i].start <= searchIndex && searchIndex <= words[i].end) {
                        return words[i];
                    }
                }
            }
            return null;
        };
        return CursorHelper;
    })();
    var Utils = (function () {
        function Utils() {
        }
        /**
         * Range contains position (including edges)?
         */
        Utils.rangeContainsPosition = function (range, position) {
            if (position.lineNumber < range.startLineNumber || position.lineNumber > range.endLineNumber) {
                return false;
            }
            if (position.lineNumber === range.startLineNumber && position.column < range.startColumn) {
                return false;
            }
            if (position.lineNumber === range.endLineNumber && position.column > range.endColumn) {
                return false;
            }
            return true;
        };
        /**
         * Tests if position is contained inside range.
         * If position is either the starting or ending of a range, false is returned.
         */
        Utils.isPositionInsideRange = function (position, range) {
            if (position.lineNumber < range.startLineNumber) {
                return false;
            }
            if (position.lineNumber > range.endLineNumber) {
                return false;
            }
            if (position.lineNumber === range.startLineNumber && position.column < range.startColumn) {
                return false;
            }
            if (position.lineNumber === range.endLineNumber && position.column > range.endColumn) {
                return false;
            }
            return true;
        };
        Utils.isPositionAtRangeEdges = function (position, range) {
            if (position.lineNumber === range.startLineNumber && position.column === range.startColumn) {
                return true;
            }
            if (position.lineNumber === range.endLineNumber && position.column === range.endColumn) {
                return true;
            }
            return false;
        };
        return Utils;
    })();
});
//# sourceMappingURL=oneCursor.js.map