/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/core/position', 'vs/editor/common/viewModel/prefixSumComputer', 'vs/editor/common/viewModel/filteredLineTokens', 'vs/editor/common/editorCommon'], function (require, exports, position_1, prefixSumComputer_1, filteredLineTokens_1, EditorCommon) {
    var tmpOutputPosition = {
        outputLineIndex: 0,
        outputOffset: 0
    };
    var IdentitySplitLine = (function () {
        function IdentitySplitLine() {
        }
        IdentitySplitLine.prototype.getOutputLineCount = function () {
            return 1;
        };
        IdentitySplitLine.prototype.getOutputLineContent = function (model, myLineNumber, outputLineIndex) {
            return model.getLineContent(myLineNumber);
        };
        IdentitySplitLine.prototype.getOutputLineMinColumn = function (model, myLineNumber, outputLineIndex) {
            return model.getLineMinColumn(myLineNumber);
        };
        IdentitySplitLine.prototype.getOutputLineMaxColumn = function (model, myLineNumber, outputLineIndex) {
            return model.getLineMaxColumn(myLineNumber);
        };
        IdentitySplitLine.prototype.getOutputLineTokens = function (model, myLineNumber, outputLineIndex, inaccurateTokensAcceptable) {
            return new filteredLineTokens_1.IdentityFilteredLineTokens(model.getLineTokens(myLineNumber, inaccurateTokensAcceptable), model.getLineMaxColumn(myLineNumber) - 1);
        };
        IdentitySplitLine.prototype.getInputColumnOfOutputPosition = function (outputLineIndex, outputColumn) {
            return outputColumn;
        };
        IdentitySplitLine.prototype.getOutputPositionOfInputPosition = function (deltaLineNumber, inputColumn) {
            return new position_1.Position(deltaLineNumber, inputColumn);
        };
        IdentitySplitLine.INSTANCE = new IdentitySplitLine();
        return IdentitySplitLine;
    })();
    var SplitLine = (function () {
        function SplitLine(positionMapper) {
            this.positionMapper = positionMapper;
            this.wrappedIndent = this.positionMapper.getWrappedLinesIndent();
            this.wrappedIndentLength = this.wrappedIndent.length;
            this.outputLineCount = this.positionMapper.getOutputLineCount();
        }
        SplitLine.prototype.getOutputLineCount = function () {
            return this.outputLineCount;
        };
        SplitLine.prototype.getInputStartOffsetOfOutputLineIndex = function (outputLineIndex) {
            return this.positionMapper.getInputOffsetOfOutputPosition(outputLineIndex, 0);
        };
        SplitLine.prototype.getInputEndOffsetOfOutputLineIndex = function (model, myLineNumber, outputLineIndex) {
            if (outputLineIndex + 1 === this.outputLineCount) {
                return model.getLineMaxColumn(myLineNumber) - 1;
            }
            return this.positionMapper.getInputOffsetOfOutputPosition(outputLineIndex + 1, 0);
        };
        SplitLine.prototype.getOutputLineContent = function (model, myLineNumber, outputLineIndex) {
            var startOffset = this.getInputStartOffsetOfOutputLineIndex(outputLineIndex);
            var endOffset = this.getInputEndOffsetOfOutputLineIndex(model, myLineNumber, outputLineIndex);
            var r = model.getLineContent(myLineNumber).substring(startOffset, endOffset);
            if (outputLineIndex > 0) {
                r = this.wrappedIndent + r;
            }
            return r;
        };
        SplitLine.prototype.getOutputLineMinColumn = function (model, myLineNumber, outputLineIndex) {
            if (outputLineIndex > 0) {
                return this.wrappedIndentLength + 1;
            }
            return 1;
        };
        SplitLine.prototype.getOutputLineMaxColumn = function (model, myLineNumber, outputLineIndex) {
            return this.getOutputLineContent(model, myLineNumber, outputLineIndex).length + 1;
        };
        SplitLine.prototype.getOutputLineTokens = function (model, myLineNumber, outputLineIndex, inaccurateTokensAcceptable) {
            var startOffset = this.getInputStartOffsetOfOutputLineIndex(outputLineIndex);
            var endOffset = this.getInputEndOffsetOfOutputLineIndex(model, myLineNumber, outputLineIndex);
            var deltaStartIndex = 0;
            if (outputLineIndex > 0) {
                deltaStartIndex = this.wrappedIndentLength;
            }
            return new filteredLineTokens_1.FilteredLineTokens(model.getLineTokens(myLineNumber, inaccurateTokensAcceptable), startOffset, endOffset, deltaStartIndex);
        };
        SplitLine.prototype.getInputColumnOfOutputPosition = function (outputLineIndex, outputColumn) {
            var adjustedColumn = outputColumn - 1;
            if (outputLineIndex > 0) {
                if (adjustedColumn < this.wrappedIndentLength) {
                    adjustedColumn = 0;
                }
                else {
                    adjustedColumn -= this.wrappedIndentLength;
                }
            }
            return this.positionMapper.getInputOffsetOfOutputPosition(outputLineIndex, adjustedColumn) + 1;
        };
        SplitLine.prototype.getOutputPositionOfInputPosition = function (deltaLineNumber, inputColumn) {
            this.positionMapper.getOutputPositionOfInputOffset(inputColumn - 1, tmpOutputPosition);
            var outputLineIndex = tmpOutputPosition.outputLineIndex;
            var outputColumn = tmpOutputPosition.outputOffset + 1;
            if (outputLineIndex > 0) {
                outputColumn += this.wrappedIndentLength;
            }
            //		console.log('in -> out ' + deltaLineNumber + ',' + inputColumn + ' ===> ' + (deltaLineNumber+outputLineIndex) + ',' + outputColumn);
            return new position_1.Position(deltaLineNumber + outputLineIndex, outputColumn);
        };
        return SplitLine;
    })();
    exports.SplitLine = SplitLine;
    function createSplitLine(linePositionMapperFactory, text, tabSize, wrappingColumn, columnsForFullWidthChar, wrappingIndent) {
        var positionMapper = linePositionMapperFactory.createLineMapping(text, tabSize, wrappingColumn, columnsForFullWidthChar, wrappingIndent);
        if (positionMapper === null) {
            // No mapping needed
            return IdentitySplitLine.INSTANCE;
        }
        else {
            return new SplitLine(positionMapper);
        }
    }
    var SplitLinesCollection = (function () {
        function SplitLinesCollection(model, linePositionMapperFactory, tabSize, wrappingColumn, columnsForFullWidthChar, wrappingIndent) {
            this.model = model;
            this._validModelVersionId = -1;
            this.tabSize = tabSize;
            this.wrappingColumn = wrappingColumn;
            this.columnsForFullWidthChar = columnsForFullWidthChar;
            this.wrappingIndent = wrappingIndent;
            this.linePositionMapperFactory = linePositionMapperFactory;
            this.constructLines();
            this.tmpIndexOfResult = {
                index: 0,
                remainder: 0
            };
        }
        SplitLinesCollection.prototype._ensureValidState = function () {
            var modelVersion = this.model.getVersionId();
            if (modelVersion !== this._validModelVersionId) {
                throw new Error('SplitLinesCollection: attempt to access a \'newer\' model');
            }
        };
        SplitLinesCollection.prototype.constructLines = function () {
            this.lines = [];
            var line, values = [], linesContent = this.model.getLinesContent();
            for (var i = 0, lineCount = linesContent.length; i < lineCount; i++) {
                line = createSplitLine(this.linePositionMapperFactory, linesContent[i], this.tabSize, this.wrappingColumn, this.columnsForFullWidthChar, this.wrappingIndent);
                values[i] = line.getOutputLineCount();
                this.lines[i] = line;
            }
            this._validModelVersionId = this.model.getVersionId();
            this.prefixSumComputer = new prefixSumComputer_1.PrefixSumComputer(values);
        };
        SplitLinesCollection.prototype.setTabSize = function (newTabSize, emit) {
            if (this.tabSize === newTabSize) {
                return false;
            }
            this.tabSize = newTabSize;
            this.constructLines();
            emit(EditorCommon.ViewEventNames.ModelFlushedEvent, null);
            return true;
        };
        SplitLinesCollection.prototype.setWrappingIndent = function (newWrappingIndent, emit) {
            if (this.wrappingIndent === newWrappingIndent) {
                return false;
            }
            this.wrappingIndent = newWrappingIndent;
            this.constructLines();
            emit(EditorCommon.ViewEventNames.ModelFlushedEvent, null);
            return true;
        };
        SplitLinesCollection.prototype.setWrappingColumn = function (newWrappingColumn, columnsForFullWidthChar, emit) {
            if (this.wrappingColumn === newWrappingColumn && this.columnsForFullWidthChar === columnsForFullWidthChar) {
                return false;
            }
            this.wrappingColumn = newWrappingColumn;
            this.columnsForFullWidthChar = columnsForFullWidthChar;
            this.constructLines();
            emit(EditorCommon.ViewEventNames.ModelFlushedEvent, null);
            return true;
        };
        SplitLinesCollection.prototype.onModelFlushed = function (versionId, emit) {
            this.constructLines();
            emit(EditorCommon.ViewEventNames.ModelFlushedEvent, null);
        };
        SplitLinesCollection.prototype.onModelLinesDeleted = function (versionId, fromLineNumber, toLineNumber, emit) {
            if (versionId <= this._validModelVersionId) {
                return;
            }
            this._validModelVersionId = versionId;
            var outputFromLineNumber = (fromLineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(fromLineNumber - 2) + 1);
            var outputToLineNumber = this.prefixSumComputer.getAccumulatedValue(toLineNumber - 1);
            this.lines.splice(fromLineNumber - 1, toLineNumber - fromLineNumber + 1);
            this.prefixSumComputer.removeValues(fromLineNumber - 1, toLineNumber - fromLineNumber + 1);
            var e = {
                fromLineNumber: outputFromLineNumber,
                toLineNumber: outputToLineNumber
            };
            emit(EditorCommon.ViewEventNames.LinesDeletedEvent, e);
        };
        SplitLinesCollection.prototype.onModelLinesInserted = function (versionId, fromLineNumber, toLineNumber, text, emit) {
            if (versionId <= this._validModelVersionId) {
                return;
            }
            this._validModelVersionId = versionId;
            var outputFromLineNumber = (fromLineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(fromLineNumber - 2) + 1);
            var line, outputLineCount, totalOutputLineCount = 0;
            var insertLines = [], insertPrefixSumValues = [];
            for (var i = 0, len = text.length; i < len; i++) {
                var line = createSplitLine(this.linePositionMapperFactory, text[i], this.tabSize, this.wrappingColumn, this.columnsForFullWidthChar, this.wrappingIndent);
                insertLines.push(line);
                outputLineCount = line.getOutputLineCount();
                totalOutputLineCount += outputLineCount;
                insertPrefixSumValues.push(outputLineCount);
            }
            this.lines = this.lines.slice(0, fromLineNumber - 1).concat(insertLines).concat(this.lines.slice(fromLineNumber - 1));
            this.prefixSumComputer.insertValues(fromLineNumber - 1, insertPrefixSumValues);
            var e = {
                fromLineNumber: outputFromLineNumber,
                toLineNumber: outputFromLineNumber + totalOutputLineCount - 1
            };
            emit(EditorCommon.ViewEventNames.LinesInsertedEvent, e);
        };
        SplitLinesCollection.prototype.onModelLineChanged = function (versionId, lineNumber, newText, emit) {
            if (versionId <= this._validModelVersionId) {
                return;
            }
            this._validModelVersionId = versionId;
            var lineIndex = lineNumber - 1;
            var oldOutputLineCount = this.lines[lineIndex].getOutputLineCount();
            var line = createSplitLine(this.linePositionMapperFactory, newText, this.tabSize, this.wrappingColumn, this.columnsForFullWidthChar, this.wrappingIndent);
            this.lines[lineIndex] = line;
            var newOutputLineCount = this.lines[lineIndex].getOutputLineCount();
            var lineMappingChanged = false, changeFrom = 0, changeTo = -1, insertFrom = 0, insertTo = -1, deleteFrom = 0, deleteTo = -1;
            if (oldOutputLineCount > newOutputLineCount) {
                changeFrom = (lineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(lineNumber - 2) + 1);
                changeTo = changeFrom + newOutputLineCount - 1;
                deleteFrom = changeTo + 1;
                deleteTo = deleteFrom + (oldOutputLineCount - newOutputLineCount) - 1;
                lineMappingChanged = true;
            }
            else if (oldOutputLineCount < newOutputLineCount) {
                changeFrom = (lineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(lineNumber - 2) + 1);
                changeTo = changeFrom + oldOutputLineCount - 1;
                insertFrom = changeTo + 1;
                insertTo = insertFrom + (newOutputLineCount - oldOutputLineCount) - 1;
                lineMappingChanged = true;
            }
            else {
                changeFrom = (lineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(lineNumber - 2) + 1);
                changeTo = changeFrom + newOutputLineCount - 1;
            }
            this.prefixSumComputer.changeValue(lineIndex, newOutputLineCount);
            var i, e1, e2, e3;
            if (changeFrom <= changeTo) {
                for (var i = changeFrom; i <= changeTo; i++) {
                    e1 = {
                        lineNumber: i
                    };
                    emit(EditorCommon.ViewEventNames.LineChangedEvent, e1);
                }
            }
            if (insertFrom <= insertTo) {
                e2 = {
                    fromLineNumber: insertFrom,
                    toLineNumber: insertTo
                };
                emit(EditorCommon.ViewEventNames.LinesInsertedEvent, e2);
            }
            if (deleteFrom <= deleteTo) {
                e3 = {
                    fromLineNumber: deleteFrom,
                    toLineNumber: deleteTo
                };
                emit(EditorCommon.ViewEventNames.LinesDeletedEvent, e3);
            }
            return lineMappingChanged;
        };
        SplitLinesCollection.prototype.getOutputLineCount = function () {
            this._ensureValidState();
            return this.prefixSumComputer.getTotalValue();
        };
        SplitLinesCollection.prototype.getOutputLineContent = function (outputLineNumber) {
            this._ensureValidState();
            this.prefixSumComputer.getIndexOf(outputLineNumber - 1, this.tmpIndexOfResult);
            var lineIndex = this.tmpIndexOfResult.index;
            var remainder = this.tmpIndexOfResult.remainder;
            return this.lines[lineIndex].getOutputLineContent(this.model, lineIndex + 1, remainder);
        };
        SplitLinesCollection.prototype.getOutputLineMinColumn = function (outputLineNumber) {
            this._ensureValidState();
            this.prefixSumComputer.getIndexOf(outputLineNumber - 1, this.tmpIndexOfResult);
            var lineIndex = this.tmpIndexOfResult.index;
            var remainder = this.tmpIndexOfResult.remainder;
            return this.lines[lineIndex].getOutputLineMinColumn(this.model, lineIndex + 1, remainder);
        };
        SplitLinesCollection.prototype.getOutputLineMaxColumn = function (outputLineNumber) {
            this._ensureValidState();
            this.prefixSumComputer.getIndexOf(outputLineNumber - 1, this.tmpIndexOfResult);
            var lineIndex = this.tmpIndexOfResult.index;
            var remainder = this.tmpIndexOfResult.remainder;
            return this.lines[lineIndex].getOutputLineMaxColumn(this.model, lineIndex + 1, remainder);
        };
        SplitLinesCollection.prototype.getOutputLineTokens = function (outputLineNumber, inaccurateTokensAcceptable) {
            this._ensureValidState();
            this.prefixSumComputer.getIndexOf(outputLineNumber - 1, this.tmpIndexOfResult);
            var lineIndex = this.tmpIndexOfResult.index;
            var remainder = this.tmpIndexOfResult.remainder;
            return this.lines[lineIndex].getOutputLineTokens(this.model, lineIndex + 1, remainder, inaccurateTokensAcceptable);
        };
        SplitLinesCollection.prototype.convertOutputPositionToInputPosition = function (viewLineNumber, viewColumn) {
            this._ensureValidState();
            this.prefixSumComputer.getIndexOf(viewLineNumber - 1, this.tmpIndexOfResult);
            var lineIndex = this.tmpIndexOfResult.index;
            var remainder = this.tmpIndexOfResult.remainder;
            var inputColumn = this.lines[lineIndex].getInputColumnOfOutputPosition(remainder, viewColumn);
            //		console.log('out -> in ' + viewLineNumber + ',' + viewColumn + ' ===> ' + (lineIndex+1) + ',' + inputColumn);
            return new position_1.Position(lineIndex + 1, inputColumn);
        };
        SplitLinesCollection.prototype.convertInputPositionToOutputPosition = function (inputLineNumber, inputColumn) {
            this._ensureValidState();
            if (inputLineNumber > this.lines.length) {
                inputLineNumber = this.lines.length;
            }
            var deltaLineNumber = 1 + (inputLineNumber === 1 ? 0 : this.prefixSumComputer.getAccumulatedValue(inputLineNumber - 2));
            var r = this.lines[inputLineNumber - 1].getOutputPositionOfInputPosition(deltaLineNumber, inputColumn);
            //		console.log('in -> out ' + inputLineNumber + ',' + inputColumn + ' ===> ' + r.lineNumber + ',' + r.column);
            return r;
        };
        return SplitLinesCollection;
    })();
    exports.SplitLinesCollection = SplitLinesCollection;
});
//# sourceMappingURL=splitLinesCollection.js.map