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
define(["require", "exports", 'vs/editor/common/core/range', 'vs/editor/common/model/editStack', 'vs/editor/common/model/modelLine', 'vs/editor/common/model/textModelWithDecorations', 'vs/editor/common/editorCommon'], function (require, exports, range_1, editStack_1, modelLine_1, textModelWithDecorations_1, EditorCommon) {
    var EditableTextModel = (function (_super) {
        __extends(EditableTextModel, _super);
        function EditableTextModel(allowedEventTypes, rawText, modeOrPromise) {
            allowedEventTypes.push(EditorCommon.EventType.ModelContentChanged);
            allowedEventTypes.push(EditorCommon.EventType.ModelContentChanged2);
            _super.call(this, allowedEventTypes, rawText, modeOrPromise);
            this._commandManager = new editStack_1.EditStack(this);
            this._isUndoing = false;
            this._isRedoing = false;
            this._hasEditableRange = false;
            this._editableRangeId = null;
        }
        EditableTextModel.prototype.dispose = function () {
            this._commandManager = null;
            _super.prototype.dispose.call(this);
        };
        EditableTextModel.prototype._resetValue = function (e, newValue) {
            _super.prototype._resetValue.call(this, e, newValue);
            // Destroy my edit history and settings
            this._commandManager = new editStack_1.EditStack(this);
            this._hasEditableRange = false;
            this._editableRangeId = null;
        };
        EditableTextModel.prototype.pushStackElement = function () {
            if (this._isDisposed) {
                throw new Error('EditableTextModel.pushStackElement: Model is disposed');
            }
            this._commandManager.pushStackElement();
        };
        EditableTextModel.prototype.pushEditOperations = function (beforeCursorState, editOperations, cursorStateComputer) {
            if (this._isDisposed) {
                throw new Error('EditableTextModel.pushEditOperations: Model is disposed');
            }
            return this._commandManager.pushEditOperation(beforeCursorState, editOperations, cursorStateComputer);
        };
        /**
         * Transform operations such that they represent the same logic edit,
         * but that they also do not cause OOM crashes.
         */
        EditableTextModel.prototype._reduceOperations = function (operations) {
            if (operations.length < 1000) {
                // We know from empirical testing that a thousand edits work fine regardless of their shape.
                return operations;
            }
            // At one point, due to how events are emitted and how each operation is handled,
            // some operations can trigger a high ammount of temporary string allocations,
            // that will immediately get edited again.
            // e.g. a formatter inserting ridiculous ammounts of \n on a model with a single line
            // Therefore, the strategy is to collapse all the operations into a huge single edit operation
            return [this._toSingleEditOperation(operations)];
        };
        EditableTextModel.prototype._toSingleEditOperation = function (operations) {
            var forceMoveMarkers = false, firstEditRange = operations[0].range, lastEditRange = operations[operations.length - 1].range, entireEditRange = new range_1.Range(firstEditRange.startLineNumber, firstEditRange.startColumn, lastEditRange.endLineNumber, lastEditRange.endColumn), lastEndLineNumber = firstEditRange.startLineNumber, lastEndColumn = firstEditRange.startColumn, result = [];
            for (var i = 0, len = operations.length; i < len; i++) {
                var operation = operations[i], range = operation.range;
                forceMoveMarkers = forceMoveMarkers || operation.forceMoveMarkers;
                // (1) -- Push old text
                for (var lineNumber = lastEndLineNumber; lineNumber < range.startLineNumber; lineNumber++) {
                    if (lineNumber === lastEndLineNumber) {
                        result.push(this._lines[lineNumber - 1].text.substring(lastEndColumn - 1));
                    }
                    else {
                        result.push('\n');
                        result.push(this._lines[lineNumber - 1].text);
                    }
                }
                if (range.startLineNumber === lastEndLineNumber) {
                    result.push(this._lines[range.startLineNumber - 1].text.substring(lastEndColumn - 1, range.startColumn - 1));
                }
                else {
                    result.push('\n');
                    result.push(this._lines[range.startLineNumber - 1].text.substring(0, range.startColumn - 1));
                }
                // (2) -- Push new text
                if (operation.lines) {
                    for (var j = 0, lenJ = operation.lines.length; j < lenJ; j++) {
                        if (j !== 0) {
                            result.push('\n');
                        }
                        result.push(operation.lines[j]);
                    }
                }
                lastEndLineNumber = operation.range.endLineNumber;
                lastEndColumn = operation.range.endColumn;
            }
            return {
                identifier: operations[0].identifier,
                range: entireEditRange,
                lines: result.join('').split('\n'),
                forceMoveMarkers: forceMoveMarkers
            };
        };
        EditableTextModel.prototype.applyEdits = function (rawOperations) {
            var operations = [];
            for (var i = 0; i < rawOperations.length; i++) {
                var op = rawOperations[i];
                operations[i] = {
                    identifier: op.identifier,
                    range: this.validateRange(op.range),
                    lines: op.text ? op.text.split(/\r\n|\r|\n/) : null,
                    forceMoveMarkers: op.forceMoveMarkers
                };
            }
            // Sort operations
            operations.sort(function (a, b) {
                return range_1.Range.compareRangesUsingEnds(a.range, b.range);
            });
            // Operations can not overlap!
            for (var i = operations.length - 2; i >= 0; i--) {
                if (operations[i + 1].range.getStartPosition().isBeforeOrEqual(operations[i].range.getEndPosition())) {
                    throw new Error('Overlapping ranges are not allowed!');
                }
            }
            operations = this._reduceOperations(operations);
            var editableRange = this.getEditableRange();
            var editableRangeStart = editableRange.getStartPosition();
            var editableRangeEnd = editableRange.getEndPosition();
            for (i = 0; i < operations.length; i++) {
                var operationRange = operations[i].range;
                if (!editableRangeStart.isBeforeOrEqual(operationRange.getStartPosition()) || !operationRange.getEndPosition().isBeforeOrEqual(editableRangeEnd)) {
                    throw new Error('Editing outside of editable range not allowed!');
                }
            }
            // Delta encode operations
            var deltaOperations = EditableTextModel._toDeltaOperations(operations);
            var reverseRanges = EditableTextModel._getInverseEditRanges(deltaOperations);
            var reverseOperations = [];
            for (var i = 0; i < operations.length; i++) {
                reverseOperations[i] = {
                    identifier: operations[i].identifier,
                    range: reverseRanges[i],
                    text: this.getValueInRange(operations[i].range),
                    forceMoveMarkers: operations[i].forceMoveMarkers
                };
            }
            this._applyEdits(deltaOperations);
            return reverseOperations;
        };
        EditableTextModel._toDeltaOperation = function (base, operation) {
            var deltaStartLineNumber = operation.range.startLineNumber - (base ? base.range.endLineNumber : 0);
            var deltaStartColumn = operation.range.startColumn - (deltaStartLineNumber === 0 ? base.range.endColumn : 0);
            var deltaEndLineNumber = operation.range.endLineNumber - (base ? base.range.endLineNumber : 0);
            var deltaEndColumn = operation.range.endColumn - (deltaEndLineNumber === 0 ? base.range.endColumn : 0);
            return {
                original: operation,
                isNoOp: (operation.range.startLineNumber === operation.range.endLineNumber
                    && operation.range.startColumn === operation.range.endColumn
                    && (!operation.lines || operation.lines.length === 0)),
                deltaStartLineNumber: deltaStartLineNumber,
                deltaStartColumn: deltaStartColumn,
                deltaEndLineNumber: deltaEndLineNumber,
                deltaEndColumn: deltaEndColumn
            };
        };
        /**
         * Assumes `operations` are validated and sorted ascending
         */
        EditableTextModel._getInverseEditRanges = function (operations) {
            var lineNumber = 0, column = 0, result = [];
            for (var i = 0, len = operations.length; i < len; i++) {
                var op = operations[i];
                var startLineNumber = op.deltaStartLineNumber + lineNumber;
                var startColumn = op.deltaStartColumn + (op.deltaStartLineNumber === 0 ? column : 0);
                var resultRange;
                if (op.original.lines && op.original.lines.length > 0) {
                    // There is something to insert
                    if (op.original.lines.length === 1) {
                        // Single line insert
                        resultRange = new range_1.Range(startLineNumber, startColumn, startLineNumber, startColumn + op.original.lines[0].length);
                    }
                    else {
                        // Multi line insert
                        resultRange = new range_1.Range(startLineNumber, startColumn, startLineNumber + op.original.lines.length - 1, op.original.lines[op.original.lines.length - 1].length + 1);
                    }
                }
                else {
                    // There is nothing to insert
                    resultRange = new range_1.Range(startLineNumber, startColumn, startLineNumber, startColumn);
                }
                lineNumber = resultRange.endLineNumber;
                column = resultRange.endColumn;
                result.push(resultRange);
            }
            return result;
        };
        EditableTextModel.prototype._generateSequentialEdits = function (operations) {
            var r = [], lineNumber = 0, column = 0;
            for (var i = 0, len = operations.length; i < len; i++) {
                var op = operations[i];
                var startLineNumber = op.deltaStartLineNumber + lineNumber;
                var startColumn = op.deltaStartColumn + (op.deltaStartLineNumber === 0 ? column : 0);
                var endLineNumber = op.deltaEndLineNumber + lineNumber;
                var endColumn = op.deltaEndColumn + (op.deltaEndLineNumber === 0 ? column : 0);
                var range = new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn);
                var valueInRangeLength = this.getValueLengthInRange(range);
                r.push({
                    range: range,
                    rangeLength: valueInRangeLength,
                    text: op.original.lines ? op.original.lines.join(this.getEOL()) : ''
                });
                if (op.original.lines && op.original.lines.length > 0) {
                    // There is something to insert
                    if (op.original.lines.length === 1) {
                        // Single line insert
                        lineNumber = startLineNumber;
                        column = startColumn + op.original.lines[0].length;
                    }
                    else {
                        // Multi line insert
                        lineNumber = startLineNumber + op.original.lines.length - 1;
                        column = op.original.lines[op.original.lines.length - 1].length + 1;
                    }
                }
                else {
                    // There is nothing to insert
                    lineNumber = startLineNumber;
                    column = startColumn;
                }
            }
            return r;
        };
        EditableTextModel.prototype._applyEdits = function (operations) {
            var _this = this;
            var sequentialEdits = this._generateSequentialEdits(operations);
            // console.log(sequentialEdits);
            this._withDeferredEvents(function (deferredEventsBuilder) {
                var baseLineNumber = 0, baseColumn = 0, deltaLines = 0, adjustedLineNumbers = 0, currentLineEdits = [], currentLineNumber = 0;
                var adjustLineNumbers = function (toLineNumber, delta) {
                    // console.log('adjustLineNumbers: ' + toLineNumber + ' by ' + delta + ', lines.length: ' + this._lines.length);
                    if (delta !== 0) {
                        for (var lineNumber = adjustedLineNumbers + 1; lineNumber <= toLineNumber; lineNumber++) {
                            _this._lines[lineNumber - 1].updateLineNumber(deferredEventsBuilder.changedMarkers, lineNumber);
                        }
                    }
                    adjustedLineNumbers = toLineNumber;
                };
                var pushLineEdit = function (editLineNumber, startColumn, endColumn, text, forceMoveMarkers) {
                    // console.log('pushLineEdit: ' + editLineNumber + '(' + this._lines[editLineNumber - 1].text + ')' + ': [' + startColumn + ' -> ' + endColumn + ']: <<' + text + '>>');
                    // Apply previous edits if they were for a different line
                    if (editLineNumber !== currentLineNumber) {
                        if (currentLineEdits.length > 0) {
                            _this._applyLineEdits(deferredEventsBuilder, currentLineNumber, currentLineEdits);
                            currentLineEdits = [];
                        }
                        currentLineNumber = editLineNumber;
                    }
                    if (startColumn === endColumn && text.length === 0) {
                        // empty edit => ignore it
                        return;
                    }
                    currentLineEdits.push({
                        startColumn: startColumn,
                        endColumn: endColumn,
                        text: text,
                        forceMoveMarkers: forceMoveMarkers
                    });
                };
                var flushLineEdits = function () {
                    // console.log('flushLineEdits');
                    var r = 0;
                    if (currentLineEdits.length > 0) {
                        r = _this._applyLineEdits(deferredEventsBuilder, currentLineNumber, currentLineEdits);
                        currentLineEdits = [];
                    }
                    currentLineNumber = 0;
                    return r;
                };
                var lastContentChanged2VersionId = _this.getVersionId();
                var lastRealOpIndex = 0;
                for (var i = operations.length - 1; i >= 0; i--) {
                    if (!operations[i].isNoOp) {
                        lastRealOpIndex = i;
                        break;
                    }
                }
                for (var i = 0, len = operations.length; i < len; i++) {
                    var op = operations[i];
                    var startLineNumber = op.deltaStartLineNumber + baseLineNumber;
                    var startColumn = op.deltaStartColumn + (op.deltaStartLineNumber === 0 ? baseColumn : 0);
                    var endLineNumber = op.deltaEndLineNumber + baseLineNumber;
                    var endColumn = op.deltaEndColumn + (op.deltaEndLineNumber === 0 ? baseColumn : 0);
                    baseLineNumber = startLineNumber + (op.original.lines ? op.original.lines.length - 1 : 0);
                    baseColumn = endColumn;
                    if (op.isNoOp) {
                        continue;
                    }
                    // console.log();
                    // console.log('-------------------');
                    // console.log('OPERATION #' + (i));
                    // console.log('<<<\n' + this._lines.map(l => l.text).join('\n') + '\n>>>');
                    // if (currentLineEdits.length > 0) {
                    // 	console.log('PENDING on line ' + currentLineNumber + ': ' + currentLineEdits.map(e => '[' + e.startColumn + ', ' + e.endColumn + ']: <<' + e.text + '>>'));
                    // }
                    // console.log('baseLineNumber: ' + baseLineNumber + ', baseColumn: ' + baseColumn);
                    // console.log('deltaOp: [' + op.deltaStartLineNumber + ',' + op.deltaStartColumn + '] -> [' + op.deltaEndLineNumber + ',' + op.deltaEndColumn + '] : <<' + op.original.lines + '>>');
                    // console.log('op: [' + startLineNumber + ',' + startColumn + '] -> [' + endLineNumber + ',' + endColumn + '] : <<' + op.original.lines + '>>');
                    var deletingLinesCnt = endLineNumber - startLineNumber;
                    var insertingLinesCnt = (op.original.lines ? op.original.lines.length - 1 : 0);
                    var editingLinesCnt = Math.min(deletingLinesCnt, insertingLinesCnt);
                    var lastLineEndColumn = 0, lastLineDeltaColumn = 0;
                    for (var j = 0; j <= editingLinesCnt; j++) {
                        var editLineNumber = startLineNumber + j;
                        var editLineStartColumn = (editLineNumber === startLineNumber ? startColumn : 1);
                        var editLineEndColumn = (editLineNumber === endLineNumber ? endColumn : _this.getLineMaxColumn(editLineNumber));
                        var editLineText = (op.original.lines ? op.original.lines[j] : '');
                        pushLineEdit(editLineNumber, editLineStartColumn, editLineEndColumn, editLineText, op.original.forceMoveMarkers);
                        if (j === editingLinesCnt) {
                            lastLineEndColumn = editLineEndColumn;
                        }
                    }
                    // console.log('baseColumn = endColumn: ' + endColumn);
                    if (editingLinesCnt < deletingLinesCnt) {
                        // Must delete some lines
                        // Flush pending edits on last edited line
                        lastLineDeltaColumn = flushLineEdits();
                        var splitColumn = lastLineEndColumn + lastLineDeltaColumn;
                        // Must delete lines
                        baseColumn = splitColumn;
                        // console.log('splitColumn would be: ' + splitColumn);
                        // console.log('baseColumn = startColumn: ' + startColumn);
                        // Split last line and collect remaining
                        var endLineRemains = _this._lines[endLineNumber - 1].split(deferredEventsBuilder.changedMarkers, endColumn, false);
                        // this.emitModelContentChangedLineChangedEvent(endLineNumber - 1);
                        _this._invalidateLine(startLineNumber + editingLinesCnt - 1);
                        var spliceStart = startLineNumber + editingLinesCnt;
                        var spliceCnt = deletingLinesCnt - editingLinesCnt;
                        adjustLineNumbers(startLineNumber + editingLinesCnt, deltaLines);
                        deltaLines -= spliceCnt;
                        var markersOnDeletedLines = [];
                        for (var j = 0; j < spliceCnt; j++) {
                            var deleteLineIndex = spliceStart + j;
                            // Collect all these markers
                            markersOnDeletedLines = markersOnDeletedLines.concat(_this._lines[deleteLineIndex].deleteLine(deferredEventsBuilder.changedMarkers, splitColumn, deleteLineIndex + 1));
                        }
                        _this._lines.splice(spliceStart, spliceCnt);
                        // Reconstruct first line
                        _this._lines[spliceStart - 1].append(deferredEventsBuilder.changedMarkers, endLineRemains);
                        _this._lines[spliceStart - 1].addMarkers(markersOnDeletedLines);
                        _this.emitModelContentChangedLineChangedEvent(spliceStart);
                        _this.emitModelContentChangedLinesDeletedEvent(spliceStart + 1, spliceStart + spliceCnt);
                    }
                    if (editingLinesCnt < insertingLinesCnt) {
                        // Must insert some lines
                        // Flush pending edits on last edited line
                        lastLineDeltaColumn = flushLineEdits();
                        // Split last line
                        var splitColumn = lastLineEndColumn + lastLineDeltaColumn;
                        var leftoverLine = _this._lines[startLineNumber + editingLinesCnt - 1].split(deferredEventsBuilder.changedMarkers, splitColumn, op.original.forceMoveMarkers);
                        _this.emitModelContentChangedLineChangedEvent(startLineNumber + editingLinesCnt);
                        _this._invalidateLine(startLineNumber + editingLinesCnt - 1);
                        // Must insert some lines
                        baseColumn = op.original.lines[op.original.lines.length - 1].length + 1;
                        // console.log('baseColumn = op.original.lines[op.original.lines.length - 1].length + 1: ' + (op.original.lines[op.original.lines.length - 1].length + 1));
                        adjustLineNumbers(startLineNumber + editingLinesCnt, deltaLines);
                        deltaLines += insertingLinesCnt - editingLinesCnt;
                        var newLinesContent = [];
                        // Lines in the middle
                        for (var j = editingLinesCnt + 1; j <= insertingLinesCnt; j++) {
                            var editLineNumber = startLineNumber + j;
                            // console.log('line in the middle: ' + editLineNumber);
                            _this._lines.splice(editLineNumber - 1, 0, new modelLine_1.ModelLine(editLineNumber, op.original.lines[j]));
                            newLinesContent.push(op.original.lines[j]);
                        }
                        newLinesContent[newLinesContent.length - 1] += leftoverLine.text;
                        // Last line
                        _this._lines[startLineNumber + insertingLinesCnt - 1].append(deferredEventsBuilder.changedMarkers, leftoverLine);
                        _this.emitModelContentChangedLinesInsertedEvent(startLineNumber + editingLinesCnt + 1, startLineNumber + insertingLinesCnt, newLinesContent.join('\n'));
                    }
                    // console.log('~~~');
                    // console.log('RESULT: ');
                    // console.log('baseLineNumber: ' + baseLineNumber + ', baseColumn: ' + baseColumn);
                    // console.log('<<<\n' + this._lines.map(l => l.text).join('\n') + '\n>>>');
                    // if (currentLineEdits.length > 0) {
                    // 	console.log('PENDING on line ' + currentLineNumber + ': ' + currentLineEdits.map(e => '[' + e.startColumn + ', ' + e.endColumn + ']: <<' + e.text + '>>'));
                    // }
                    // console.log('op: [' + startLineNumber + ',' + startColumn + '] -> [' + endLineNumber + ',' + endColumn + '] : <<' + op.original.lines + '>>');
                    if (i === lastRealOpIndex) {
                        flushLineEdits();
                    }
                    var seqEdit = sequentialEdits[i];
                    if (_this.getVersionId() === lastContentChanged2VersionId) {
                        _this._increaseVersionId();
                    }
                    lastContentChanged2VersionId = _this.getVersionId();
                    // let lastContentChanged2VersionId = this.getVersionId();
                    // this._increaseVersionId();
                    _this._emitContentChanged2(seqEdit.range.startLineNumber, seqEdit.range.startColumn, seqEdit.range.endLineNumber, seqEdit.range.endColumn, seqEdit.rangeLength, seqEdit.text, _this._isUndoing, _this._isRedoing);
                }
                adjustLineNumbers(_this._lines.length, deltaLines);
            });
        };
        EditableTextModel.prototype._assertLineNumbersOK = function () {
            var foundMarkersCnt = 0;
            for (var i = 0, len = this._lines.length; i < len; i++) {
                var line = this._lines[i];
                var lineNumber = i + 1;
                if (line.lineNumber !== lineNumber) {
                    throw new Error('Invalid lineNumber at line: ' + lineNumber + '; text is: ' + this.getValue());
                }
                var markers = line.getMarkers();
                for (var j = 0, lenJ = markers.length; j < lenJ; j++) {
                    foundMarkersCnt++;
                    var markerId = markers[j].id;
                    var marker = this._markerIdToMarker[markerId];
                    if (marker.line !== line) {
                        throw new Error('Misplaced marker with id ' + markerId);
                    }
                }
            }
            var totalMarkersCnt = Object.keys(this._markerIdToMarker).length;
            if (totalMarkersCnt !== foundMarkersCnt) {
                throw new Error('There are misplaced markers!');
            }
        };
        EditableTextModel.prototype._applyLineEdits = function (deferredEventsBuilder, lineNumber, edits) {
            this._invalidateLine(lineNumber - 1);
            var result = this._lines[lineNumber - 1].applyEdits(deferredEventsBuilder.changedMarkers, edits);
            this.emitModelContentChangedLineChangedEvent(lineNumber);
            return result;
        };
        EditableTextModel._toDeltaOperations = function (operations) {
            var result = [];
            for (var i = 0; i < operations.length; i++) {
                result[i] = EditableTextModel._toDeltaOperation(i > 0 ? operations[i - 1] : null, operations[i]);
            }
            return result;
        };
        EditableTextModel.prototype.undo = function () {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('EditableTextModel.undo: Model is disposed');
            }
            return this._withDeferredEvents(function () {
                _this._isUndoing = true;
                var r = _this._commandManager.undo();
                _this._isUndoing = false;
                if (!r) {
                    return null;
                }
                _this._overwriteAlternativeVersionId(r.recordedVersionId);
                return r.selections;
            });
        };
        EditableTextModel.prototype.redo = function () {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('EditableTextModel.redo: Model is disposed');
            }
            return this._withDeferredEvents(function () {
                _this._isRedoing = true;
                var r = _this._commandManager.redo();
                _this._isRedoing = false;
                if (!r) {
                    return null;
                }
                _this._overwriteAlternativeVersionId(r.recordedVersionId);
                return r.selections;
            });
        };
        EditableTextModel.prototype.setEditableRange = function (range) {
            if (this._isDisposed) {
                throw new Error('EditableTextModel.setEditableRange: Model is disposed');
            }
            this._commandManager.clear();
            if (this._hasEditableRange) {
                this.removeTrackedRange(this._editableRangeId);
                this._editableRangeId = null;
                this._hasEditableRange = false;
            }
            if (range) {
                this._hasEditableRange = true;
                this._editableRangeId = this.addTrackedRange(range, EditorCommon.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges);
            }
        };
        EditableTextModel.prototype.hasEditableRange = function () {
            if (this._isDisposed) {
                throw new Error('EditableTextModel.hasEditableRange: Model is disposed');
            }
            return this._hasEditableRange;
        };
        EditableTextModel.prototype.getEditableRange = function () {
            if (this._isDisposed) {
                throw new Error('EditableTextModel.getEditableRange: Model is disposed');
            }
            if (this._hasEditableRange) {
                return this.getTrackedRange(this._editableRangeId);
            }
            else {
                return this.getFullModelRange();
            }
        };
        EditableTextModel.prototype._updateLineNumbers = function (changedMarkers, startLineNumber) {
            var lines = this._lines, i, len, j, lenJ, markers, marker;
            for (i = startLineNumber - 1, len = lines.length; i < len; i++) {
                lines[i].updateLineNumber(changedMarkers, i + 1);
            }
        };
        EditableTextModel.prototype.emitModelContentChangedLineChangedEvent = function (lineNumber) {
            this._increaseVersionId();
            var e = {
                changeType: EditorCommon.EventType.ModelContentChangedLineChanged,
                lineNumber: lineNumber,
                detail: this._lines[lineNumber - 1].text,
                versionId: this.getVersionId(),
                isUndoing: this._isUndoing,
                isRedoing: this._isRedoing
            };
            if (!this._isDisposing) {
                this.emit(EditorCommon.EventType.ModelContentChanged, e);
            }
        };
        EditableTextModel.prototype.emitModelContentChangedLinesDeletedEvent = function (fromLineNumber, toLineNumber) {
            this._increaseVersionId();
            var e = {
                changeType: EditorCommon.EventType.ModelContentChangedLinesDeleted,
                fromLineNumber: fromLineNumber,
                toLineNumber: toLineNumber,
                versionId: this.getVersionId(),
                isUndoing: this._isUndoing,
                isRedoing: this._isRedoing
            };
            if (!this._isDisposing) {
                this.emit(EditorCommon.EventType.ModelContentChanged, e);
            }
        };
        EditableTextModel.prototype.emitModelContentChangedLinesInsertedEvent = function (fromLineNumber, toLineNumber, newLinesContent) {
            this._increaseVersionId();
            var e = {
                changeType: EditorCommon.EventType.ModelContentChangedLinesInserted,
                fromLineNumber: fromLineNumber,
                toLineNumber: toLineNumber,
                detail: newLinesContent,
                versionId: this.getVersionId(),
                isUndoing: this._isUndoing,
                isRedoing: this._isRedoing
            };
            if (!this._isDisposing) {
                this.emit(EditorCommon.EventType.ModelContentChanged, e);
            }
        };
        return EditableTextModel;
    })(textModelWithDecorations_1.TextModelWithDecorations);
    exports.EditableTextModel = EditableTextModel;
});
//# sourceMappingURL=editableTextModel.js.map