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
define(["require", "exports", 'vs/base/common/eventEmitter', 'vs/base/common/strings', 'vs/editor/common/core/position', 'vs/editor/common/core/range', 'vs/editor/common/model/modelLine', 'vs/editor/common/editorCommon', 'vs/base/common/platform'], function (require, exports, eventEmitter_1, Strings, position_1, range_1, modelLine_1, EditorCommon, Platform) {
    var __space = ' '.charCodeAt(0);
    var __tab = '\t'.charCodeAt(0);
    var LIMIT_FIND_COUNT = 999;
    var DEFAULT_PLATFORM_EOL = (Platform.isLinux || Platform.isMacintosh) ? '\n' : '\r\n';
    var TextModel = (function (_super) {
        __extends(TextModel, _super);
        function TextModel(allowedEventTypes, rawText) {
            allowedEventTypes.push(EditorCommon.EventType.ModelContentChanged);
            _super.call(this, allowedEventTypes);
            this._constructLines(rawText);
            this._setVersionId(1);
            this._isDisposed = false;
            this._isDisposing = false;
        }
        TextModel.prototype.getVersionId = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.getVersionId: Model is disposed');
            }
            return this._versionId;
        };
        TextModel.prototype.getAlternativeVersionId = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.getAlternativeVersionId: Model is disposed');
            }
            return this._alternativeVersionId;
        };
        TextModel.prototype._increaseVersionId = function () {
            this._setVersionId(this._versionId + 1);
        };
        TextModel.prototype._setVersionId = function (newVersionId) {
            this._versionId = newVersionId;
            this._alternativeVersionId = this._versionId;
        };
        TextModel.prototype._overwriteAlternativeVersionId = function (newAlternativeVersionId) {
            this._alternativeVersionId = newAlternativeVersionId;
        };
        TextModel.prototype.isDisposed = function () {
            return this._isDisposed;
        };
        TextModel.prototype.dispose = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.dispose: Model is disposed');
            }
            this._isDisposed = true;
            // Null out members, such that any use of a disposed model will throw exceptions sooner rather than later
            this._lines = null;
            this._EOL = null;
            this._BOM = null;
            _super.prototype.dispose.call(this);
        };
        TextModel.prototype._createContentChangedFlushEvent = function () {
            return {
                changeType: EditorCommon.EventType.ModelContentChangedFlush,
                detail: null,
                // TODO@Alex -> remove these fields from here
                versionId: -1,
                isUndoing: false,
                isRedoing: false
            };
        };
        TextModel.prototype._emitContentChanged2 = function (startLineNumber, startColumn, endLineNumber, endColumn, rangeLength, text, isUndoing, isRedoing) {
            var e = {
                range: new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn),
                rangeLength: rangeLength,
                text: text,
                eol: this._EOL,
                versionId: this.getVersionId(),
                isUndoing: isUndoing,
                isRedoing: isRedoing
            };
            if (!this._isDisposing) {
                this.emit(EditorCommon.EventType.ModelContentChanged2, e);
            }
        };
        TextModel.prototype._resetValue = function (e, newValue) {
            this._constructLines(TextModel.toRawText(newValue));
            this._increaseVersionId();
            e.detail = this.toRawText();
            e.versionId = this._versionId;
        };
        TextModel.prototype.toRawText = function () {
            return {
                BOM: this._BOM,
                EOL: this._EOL,
                lines: this.getLinesContent(),
                length: this.getValueLength()
            };
        };
        TextModel.prototype.setValue = function (newValue) {
            if (this._isDisposed) {
                throw new Error('TextModel.setValue: Model is disposed');
            }
            if (newValue === null) {
                // There's nothing to do
                return;
            }
            var oldFullModelRange = this.getFullModelRange();
            var oldModelValueLength = this.getValueLengthInRange(oldFullModelRange);
            var endLineNumber = this.getLineCount();
            var endColumn = this.getLineMaxColumn(endLineNumber);
            var e = this._createContentChangedFlushEvent();
            this._resetValue(e, newValue);
            this._emitModelContentChangedFlushEvent(e);
            this._emitContentChanged2(1, 1, endLineNumber, endColumn, oldModelValueLength, this.getValue(), false, false);
        };
        TextModel.prototype.getValue = function (eol, preserveBOM) {
            if (preserveBOM === void 0) { preserveBOM = false; }
            if (this._isDisposed) {
                throw new Error('TextModel.getValue: Model is disposed');
            }
            var fullModelRange = this.getFullModelRange();
            var fullModelValue = this.getValueInRange(fullModelRange, eol);
            if (preserveBOM) {
                return this._BOM + fullModelValue;
            }
            return fullModelValue;
        };
        TextModel.prototype.getValueLength = function (eol, preserveBOM) {
            if (preserveBOM === void 0) { preserveBOM = false; }
            if (this._isDisposed) {
                throw new Error('TextModel.getValueLength: Model is disposed');
            }
            var fullModelRange = this.getFullModelRange();
            var fullModelValue = this.getValueLengthInRange(fullModelRange, eol);
            if (preserveBOM) {
                return this._BOM.length + fullModelValue;
            }
            return fullModelValue;
        };
        TextModel.prototype.getEmptiedValueInRange = function (rawRange, fillCharacter, eol) {
            if (fillCharacter === void 0) { fillCharacter = ''; }
            if (eol === void 0) { eol = EditorCommon.EndOfLinePreference.TextDefined; }
            if (this._isDisposed) {
                throw new Error('TextModel.getEmptiedValueInRange: Model is disposed');
            }
            var range = this.validateRange(rawRange);
            if (range.isEmpty()) {
                return '';
            }
            if (range.startLineNumber === range.endLineNumber) {
                return this._repeatCharacter(fillCharacter, range.endColumn - range.startColumn);
            }
            var lineEnding = this._getEndOfLine(eol), startLineIndex = range.startLineNumber - 1, endLineIndex = range.endLineNumber - 1, resultLines = [];
            resultLines.push(this._repeatCharacter(fillCharacter, this._lines[startLineIndex].text.length - range.startColumn + 1));
            for (var i = startLineIndex + 1; i < endLineIndex; i++) {
                resultLines.push(this._repeatCharacter(fillCharacter, this._lines[i].text.length));
            }
            resultLines.push(this._repeatCharacter(fillCharacter, range.endColumn - 1));
            return resultLines.join(lineEnding);
        };
        TextModel.prototype._repeatCharacter = function (fillCharacter, count) {
            var r = '';
            for (var i = 0; i < count; i++) {
                r += fillCharacter;
            }
            return r;
        };
        TextModel.prototype.getValueInRange = function (rawRange, eol) {
            if (eol === void 0) { eol = EditorCommon.EndOfLinePreference.TextDefined; }
            if (this._isDisposed) {
                throw new Error('TextModel.getValueInRange: Model is disposed');
            }
            var range = this.validateRange(rawRange);
            if (range.isEmpty()) {
                return '';
            }
            if (range.startLineNumber === range.endLineNumber) {
                return this._lines[range.startLineNumber - 1].text.substring(range.startColumn - 1, range.endColumn - 1);
            }
            var lineEnding = this._getEndOfLine(eol), startLineIndex = range.startLineNumber - 1, endLineIndex = range.endLineNumber - 1, resultLines = [];
            resultLines.push(this._lines[startLineIndex].text.substring(range.startColumn - 1));
            for (var i = startLineIndex + 1; i < endLineIndex; i++) {
                resultLines.push(this._lines[i].text);
            }
            resultLines.push(this._lines[endLineIndex].text.substring(0, range.endColumn - 1));
            return resultLines.join(lineEnding);
        };
        TextModel.prototype.getValueLengthInRange = function (rawRange, eol) {
            if (eol === void 0) { eol = EditorCommon.EndOfLinePreference.TextDefined; }
            if (this._isDisposed) {
                throw new Error('TextModel.getValueInRange: Model is disposed');
            }
            var range = this.validateRange(rawRange);
            if (range.isEmpty()) {
                return 0;
            }
            if (range.startLineNumber === range.endLineNumber) {
                return (range.endColumn - range.startColumn);
            }
            var lineEndingLength = this._getEndOfLine(eol).length, startLineIndex = range.startLineNumber - 1, endLineIndex = range.endLineNumber - 1, result = 0;
            result += (this._lines[startLineIndex].text.length - range.startColumn + 1);
            for (var i = startLineIndex + 1; i < endLineIndex; i++) {
                result += lineEndingLength + this._lines[i].text.length;
            }
            result += lineEndingLength + (range.endColumn - 1);
            return result;
        };
        TextModel.prototype.isDominatedByLongLines = function (longLineBoundary) {
            if (this._isDisposed) {
                throw new Error('TextModel.isDominatedByLongLines: Model is disposed');
            }
            var smallLineCharCount = 0, longLineCharCount = 0, i, len, lines = this._lines, lineLength;
            for (i = 0, len = this._lines.length; i < len; i++) {
                lineLength = lines[i].text.length;
                if (lineLength >= longLineBoundary) {
                    longLineCharCount += lineLength;
                }
                else {
                    smallLineCharCount += lineLength;
                }
            }
            return (longLineCharCount > smallLineCharCount);
        };
        TextModel.prototype._extractIndentationFactors = function () {
            var i, len, j, lenJ, charCode, prevLineCharCode, lines = this._lines, 
            /**
             * number of lines with indentation
             */
            linesWithIndentationCount = 0, 
            /**
             * text on current line
             */
            currentLineText, 
            /**
             * the content of the previous line that had non whitespace characters
             */
            previousLineTextWithContent = '', 
            /**
             * the char index at which `previousLineTextWithContent` has a non whitespace character
             */
            previousLineIndentation = 0, 
            /**
             * does `currentLineText` have non whitespace characters?
             */
            currentLineHasContent, 
            /**
             * the char index at which `currentLineText` has a non whitespace character
             */
            currentLineIndentation, 
            /**
             * relativeSpaceCounts[i] contains the number of times (i spaces) have been encountered in a relative indentation
             */
            relativeSpaceCounts = [], 
            /**
             * The total number of tabs that appear in indentations
             */
            linesIndentedWithTabs = 0, 
            /**
             * absoluteSpaceCounts[i] contains the number of times (i spaces) have been encounted in an indentation
             */
            absoluteSpaceCounts = [], tmpTabCounts, tmpSpaceCounts;
            for (i = 0, len = lines.length; i < len; i++) {
                currentLineText = lines[i].text;
                currentLineHasContent = false;
                currentLineIndentation = 0;
                tmpSpaceCounts = 0;
                tmpTabCounts = 0;
                for (j = 0, lenJ = currentLineText.length; j < lenJ; j++) {
                    charCode = currentLineText.charCodeAt(j);
                    if (charCode === __tab) {
                        tmpTabCounts++;
                    }
                    else if (charCode === __space) {
                        tmpSpaceCounts++;
                    }
                    else {
                        // Hit non whitespace character on this line
                        currentLineHasContent = true;
                        currentLineIndentation = j;
                        break;
                    }
                }
                // Ignore `space` if it occurs exactly once in the indentation
                if (tmpSpaceCounts === 1) {
                    tmpSpaceCounts = 0;
                }
                if (currentLineHasContent && (tmpTabCounts > 0 || tmpSpaceCounts > 0)) {
                    linesWithIndentationCount++;
                    if (tmpTabCounts > 0) {
                        linesIndentedWithTabs++;
                    }
                    if (tmpSpaceCounts > 0) {
                        absoluteSpaceCounts[tmpSpaceCounts] = (absoluteSpaceCounts[tmpSpaceCounts] || 0) + 1;
                    }
                }
                if (currentLineHasContent) {
                    // Only considering lines with content, look at the relative indentation between previous line's indentation and current line's indentation
                    // This can go both ways (e.g.):
                    //  - previousLineIndentation: "\t\t"
                    //  - currentLineIndentation: "\t    "
                    //  => This should count 1 tab and 4 spaces
                    tmpSpaceCounts = 0;
                    var stillMatchingIndentation = true;
                    for (j = 0; j < previousLineIndentation && j < currentLineIndentation; j++) {
                        prevLineCharCode = previousLineTextWithContent.charCodeAt(j);
                        charCode = currentLineText.charCodeAt(j);
                        if (stillMatchingIndentation && prevLineCharCode !== charCode) {
                            stillMatchingIndentation = false;
                        }
                        if (!stillMatchingIndentation) {
                            if (prevLineCharCode === __space) {
                                tmpSpaceCounts++;
                            }
                            if (charCode === __space) {
                                tmpSpaceCounts++;
                            }
                        }
                    }
                    for (; j < previousLineIndentation; j++) {
                        prevLineCharCode = previousLineTextWithContent.charCodeAt(j);
                        if (prevLineCharCode === __space) {
                            tmpSpaceCounts++;
                        }
                    }
                    for (; j < currentLineIndentation; j++) {
                        charCode = currentLineText.charCodeAt(j);
                        if (charCode === __space) {
                            tmpSpaceCounts++;
                        }
                    }
                    // Ignore `space` if it occurs exactly once in the indentation
                    if (tmpSpaceCounts === 1) {
                        tmpSpaceCounts = 0;
                    }
                    if (tmpSpaceCounts > 0) {
                        relativeSpaceCounts[tmpSpaceCounts] = (relativeSpaceCounts[tmpSpaceCounts] || 0) + 1;
                    }
                    previousLineIndentation = currentLineIndentation;
                    previousLineTextWithContent = currentLineText;
                }
            }
            return {
                linesWithIndentationCount: linesWithIndentationCount,
                linesIndentedWithTabs: linesIndentedWithTabs,
                relativeSpaceCounts: relativeSpaceCounts,
                absoluteSpaceCounts: absoluteSpaceCounts
            };
        };
        TextModel.prototype.guessIndentation = function (defaultTabSize) {
            if (this._isDisposed) {
                throw new Error('TextModel.guessIndentation: Model is disposed');
            }
            var i, len, factors = this._extractIndentationFactors(), linesWithIndentationCount = factors.linesWithIndentationCount, linesIndentedWithTabs = factors.linesIndentedWithTabs, absoluteSpaceCounts = factors.absoluteSpaceCounts, relativeSpaceCounts = factors.relativeSpaceCounts;
            // Count the absolute number of times tabs or spaces have been used as indentation
            var linesIndentedWithSpaces = 0;
            for (i = 1, len = absoluteSpaceCounts.length; i < len; i++) {
                linesIndentedWithSpaces += (absoluteSpaceCounts[i] || 0);
            }
            var candidate, candidateScore, penalization, m, scores = [];
            for (candidate = 2, len = absoluteSpaceCounts.length; candidate < len; candidate++) {
                if (!absoluteSpaceCounts[candidate]) {
                    continue;
                }
                // Try to compute a score that `candidate` is the `tabSize`
                candidateScore = 0;
                penalization = 0;
                for (m = candidate; m < len; m += candidate) {
                    if (absoluteSpaceCounts[m]) {
                        candidateScore += absoluteSpaceCounts[m];
                    }
                    else {
                        // Penalize this candidate, but penalize less with every mutliple..
                        penalization += candidate / m;
                    }
                }
                scores[candidate] = candidateScore / (1 + penalization);
            }
            // console.log('----------');
            // console.log('linesWithIndentationCount: ', linesWithIndentationCount);
            // console.log('linesIndentedWithTabs: ', linesIndentedWithTabs);
            // console.log('absoluteSpaceCounts: ', absoluteSpaceCounts);
            // console.log('relativeSpaceCounts: ', relativeSpaceCounts);
            // console.log('=> linesIndentedWithSpaces: ', linesIndentedWithSpaces);
            // console.log('=> scores: ', scores);
            var bestCandidate = defaultTabSize, bestCandidateScore = 0;
            var allowedGuesses = [2, 4, 6, 8];
            for (i = 0; i < allowedGuesses.length; i++) {
                candidate = allowedGuesses[i];
                candidateScore = (scores[candidate] || 0) + (relativeSpaceCounts[candidate] || 0);
                if (candidateScore > bestCandidateScore) {
                    bestCandidate = candidate;
                    bestCandidateScore = candidateScore;
                }
            }
            var insertSpaces = true;
            if (linesIndentedWithTabs > linesIndentedWithSpaces) {
                // More lines indented with tabs
                insertSpaces = false;
            }
            return {
                insertSpaces: insertSpaces,
                tabSize: bestCandidate
            };
        };
        TextModel.prototype.getLineCount = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.getLineCount: Model is disposed');
            }
            return this._lines.length;
        };
        TextModel.prototype.getLineContent = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModel.getLineContent: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            return this._lines[lineNumber - 1].text;
        };
        TextModel.prototype.getLinesContent = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.getLineContent: Model is disposed');
            }
            var r = [];
            for (var i = 0, len = this._lines.length; i < len; i++) {
                r[i] = this._lines[i].text;
            }
            return r;
        };
        TextModel.prototype.getEOL = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.getEOL: Model is disposed');
            }
            return this._EOL;
        };
        TextModel.prototype.setEOL = function (eol) {
            var newEOL = (eol === EditorCommon.EndOfLineSequence.CRLF ? '\r\n' : '\n');
            if (this._EOL === newEOL) {
                // Nothing to do
                return;
            }
            var oldFullModelRange = this.getFullModelRange();
            var oldModelValueLength = this.getValueLengthInRange(oldFullModelRange);
            var endLineNumber = this.getLineCount();
            var endColumn = this.getLineMaxColumn(endLineNumber);
            this._EOL = newEOL;
            this._increaseVersionId();
            var e = this._createContentChangedFlushEvent();
            e.detail = this.toRawText();
            e.versionId = this._versionId;
            this._emitModelContentChangedFlushEvent(e);
            this._emitContentChanged2(1, 1, endLineNumber, endColumn, oldModelValueLength, this.getValue(), false, false);
        };
        TextModel.prototype.getLineMinColumn = function (lineNumber) {
            return 1;
        };
        TextModel.prototype.getLineMaxColumn = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModel.getLineMaxColumn: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            return this._lines[lineNumber - 1].text.length + 1;
        };
        TextModel.prototype.getLineFirstNonWhitespaceColumn = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModel.getLineFirstNonWhitespaceColumn: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            var result = Strings.firstNonWhitespaceIndex(this._lines[lineNumber - 1].text);
            if (result === -1) {
                return 0;
            }
            return result + 1;
        };
        TextModel.prototype.getLineLastNonWhitespaceColumn = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModel.getLineLastNonWhitespaceColumn: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            var result = Strings.lastNonWhitespaceIndex(this._lines[lineNumber - 1].text);
            if (result === -1) {
                return 0;
            }
            return result + 2;
        };
        TextModel.prototype.validateLineNumber = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModel.validateLineNumber: Model is disposed');
            }
            if (lineNumber < 1) {
                lineNumber = 1;
            }
            if (lineNumber > this._lines.length) {
                lineNumber = this._lines.length;
            }
            return lineNumber;
        };
        TextModel.prototype.validatePosition = function (position) {
            if (this._isDisposed) {
                throw new Error('TextModel.validatePosition: Model is disposed');
            }
            var lineNumber = position.lineNumber ? position.lineNumber : 1;
            var column = position.column ? position.column : 1;
            if (lineNumber < 1) {
                lineNumber = 1;
            }
            if (lineNumber > this._lines.length) {
                lineNumber = this._lines.length;
            }
            if (column < 1) {
                column = 1;
            }
            var maxColumn = this.getLineMaxColumn(lineNumber);
            if (column > maxColumn) {
                column = maxColumn;
            }
            return new position_1.Position(lineNumber, column);
        };
        TextModel.prototype.validateRange = function (range) {
            if (this._isDisposed) {
                throw new Error('TextModel.validateRange: Model is disposed');
            }
            var start = this.validatePosition(new position_1.Position(range.startLineNumber, range.startColumn));
            var end = this.validatePosition(new position_1.Position(range.endLineNumber, range.endColumn));
            return new range_1.Range(start.lineNumber, start.column, end.lineNumber, end.column);
        };
        TextModel.prototype.modifyPosition = function (rawPosition, offset) {
            if (this._isDisposed) {
                throw new Error('TextModel.modifyPosition: Model is disposed');
            }
            var position = this.validatePosition(rawPosition);
            // Handle positive offsets, one line at a time
            while (offset > 0) {
                var maxColumn = this.getLineMaxColumn(position.lineNumber);
                // Get to end of line
                if (position.column < maxColumn) {
                    var subtract = Math.min(offset, maxColumn - position.column);
                    offset -= subtract;
                    position.column += subtract;
                }
                if (offset === 0) {
                    break;
                }
                // Go to next line
                offset -= this._EOL.length;
                if (offset < 0) {
                    throw new Error('TextModel.modifyPosition: Breaking line terminators');
                }
                ++position.lineNumber;
                if (position.lineNumber > this._lines.length) {
                    throw new Error('TextModel.modifyPosition: Offset goes beyond the end of the model');
                }
                position.column = 1;
            }
            // Handle negative offsets, one line at a time
            while (offset < 0) {
                // Get to the start of the line
                if (position.column > 1) {
                    var add = Math.min(-offset, position.column - 1);
                    offset += add;
                    position.column -= add;
                }
                if (offset === 0) {
                    break;
                }
                // Go to the previous line
                offset += this._EOL.length;
                if (offset > 0) {
                    throw new Error('TextModel.modifyPosition: Breaking line terminators');
                }
                --position.lineNumber;
                if (position.lineNumber < 1) {
                    throw new Error('TextModel.modifyPosition: Offset goes beyond the beginning of the model');
                }
                position.column = this.getLineMaxColumn(position.lineNumber);
            }
            return position;
        };
        TextModel.prototype.getFullModelRange = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.getFullModelRange: Model is disposed');
            }
            var lineCount = this.getLineCount();
            return new range_1.Range(1, 1, lineCount, this.getLineMaxColumn(lineCount));
        };
        TextModel.prototype._emitModelContentChangedFlushEvent = function (e) {
            if (!this._isDisposing) {
                this.emit(EditorCommon.EventType.ModelContentChanged, e);
            }
        };
        TextModel.toRawText = function (rawText) {
            // Count the number of lines that end with \r\n
            var carriageReturnCnt = 0, lastCarriageReturnIndex = -1;
            while ((lastCarriageReturnIndex = rawText.indexOf('\r', lastCarriageReturnIndex + 1)) !== -1) {
                carriageReturnCnt++;
            }
            // Split the text into liens
            var lines = rawText.split(/\r\n|\r|\n/);
            // Remove the BOM (if present)
            var BOM = '';
            if (Strings.startsWithUTF8BOM(lines[0])) {
                BOM = Strings.UTF8_BOM_CHARACTER;
                lines[0] = lines[0].substr(1);
            }
            var lineFeedCnt = lines.length - 1;
            var EOL = '';
            if (lineFeedCnt === 0) {
                // This is an empty file or a file with precisely one line
                EOL = DEFAULT_PLATFORM_EOL;
            }
            else if (carriageReturnCnt > lineFeedCnt / 2) {
                // More than half of the file contains \r\n ending lines
                EOL = '\r\n';
            }
            else {
                // At least one line more ends in \n
                EOL = '\n';
            }
            return {
                BOM: BOM,
                EOL: EOL,
                lines: lines,
                length: rawText.length
            };
        };
        TextModel.prototype._constructLines = function (rawText) {
            var rawLines = rawText.lines, modelLines = [], i, len;
            for (i = 0, len = rawLines.length; i < len; i++) {
                modelLines.push(new modelLine_1.ModelLine(i + 1, rawLines[i]));
            }
            this._BOM = rawText.BOM;
            this._EOL = rawText.EOL;
            this._lines = modelLines;
        };
        TextModel.prototype._getEndOfLine = function (eol) {
            switch (eol) {
                case EditorCommon.EndOfLinePreference.LF:
                    return '\n';
                case EditorCommon.EndOfLinePreference.CRLF:
                    return '\r\n';
                case EditorCommon.EndOfLinePreference.TextDefined:
                    return this.getEOL();
            }
            throw new Error('Unknown EOL preference');
        };
        TextModel.prototype.findMatches = function (searchString, rawSearchScope, isRegex, matchCase, wholeWord, limitResultCount) {
            if (limitResultCount === void 0) { limitResultCount = LIMIT_FIND_COUNT; }
            if (this._isDisposed) {
                throw new Error('Model.findMatches: Model is disposed');
            }
            var regex = Strings.createSafeRegExp(searchString, isRegex, matchCase, wholeWord);
            if (!regex) {
                return [];
            }
            var searchRange;
            if (range_1.Range.isIRange(rawSearchScope)) {
                searchRange = rawSearchScope;
            }
            else {
                searchRange = this.getFullModelRange();
            }
            return this._doFindMatches(searchRange, regex, limitResultCount);
        };
        TextModel.prototype.findNextMatch = function (searchString, rawSearchStart, isRegex, matchCase, wholeWord) {
            if (this._isDisposed) {
                throw new Error('Model.findNextMatch: Model is disposed');
            }
            var regex = Strings.createSafeRegExp(searchString, isRegex, matchCase, wholeWord);
            if (!regex) {
                return null;
            }
            var searchStart = this.validatePosition(rawSearchStart), lineCount = this.getLineCount(), startLineNumber = searchStart.lineNumber, text, r;
            // Look in first line
            text = this._lines[startLineNumber - 1].text.substring(searchStart.column - 1);
            r = this._findMatchInLine(regex, text, startLineNumber, searchStart.column - 1);
            if (r) {
                return r;
            }
            for (var i = 1; i < lineCount; i++) {
                var lineIndex = (startLineNumber + i - 1) % lineCount;
                text = this._lines[lineIndex].text;
                r = this._findMatchInLine(regex, text, lineIndex + 1, 0);
                if (r) {
                    return r;
                }
            }
            return null;
        };
        TextModel.prototype.findPreviousMatch = function (searchString, rawSearchStart, isRegex, matchCase, wholeWord) {
            if (this._isDisposed) {
                throw new Error('Model.findPreviousMatch: Model is disposed');
            }
            var regex = Strings.createSafeRegExp(searchString, isRegex, matchCase, wholeWord);
            if (!regex) {
                return null;
            }
            var searchStart = this.validatePosition(rawSearchStart), lineCount = this.getLineCount(), startLineNumber = searchStart.lineNumber, text, r;
            // Look in first line
            text = this._lines[startLineNumber - 1].text.substring(0, searchStart.column - 1);
            r = this._findLastMatchInLine(regex, text, startLineNumber);
            if (r) {
                return r;
            }
            for (var i = 1; i < lineCount; i++) {
                var lineIndex = (lineCount + startLineNumber - i - 1) % lineCount;
                text = this._lines[lineIndex].text;
                r = this._findLastMatchInLine(regex, text, lineIndex + 1);
                if (r) {
                    return r;
                }
            }
            return null;
        };
        TextModel.prototype._doFindMatches = function (searchRange, searchRegex, limitResultCount) {
            var result = [], text, counter = 0;
            // Early case for a search range that starts & stops on the same line number
            if (searchRange.startLineNumber === searchRange.endLineNumber) {
                text = this._lines[searchRange.startLineNumber - 1].text.substring(searchRange.startColumn - 1, searchRange.endColumn - 1);
                counter = this._findMatchesInLine(searchRegex, text, searchRange.startLineNumber, searchRange.startColumn - 1, counter, result, limitResultCount);
                return result;
            }
            // Collect results from first line
            text = this._lines[searchRange.startLineNumber - 1].text.substring(searchRange.startColumn - 1);
            counter = this._findMatchesInLine(searchRegex, text, searchRange.startLineNumber, searchRange.startColumn - 1, counter, result, limitResultCount);
            // Collect results from middle lines
            for (var lineNumber = searchRange.startLineNumber + 1; lineNumber < searchRange.endLineNumber && counter < limitResultCount; lineNumber++) {
                counter = this._findMatchesInLine(searchRegex, this._lines[lineNumber - 1].text, lineNumber, 0, counter, result, limitResultCount);
            }
            // Collect results from last line
            if (counter < limitResultCount) {
                text = this._lines[searchRange.endLineNumber - 1].text.substring(0, searchRange.endColumn - 1);
                counter = this._findMatchesInLine(searchRegex, text, searchRange.endLineNumber, 0, counter, result, limitResultCount);
            }
            return result;
        };
        TextModel.prototype._findMatchInLine = function (searchRegex, text, lineNumber, deltaOffset) {
            var m = searchRegex.exec(text);
            if (!m) {
                return null;
            }
            return new range_1.Range(lineNumber, m.index + 1 + deltaOffset, lineNumber, m.index + 1 + m[0].length + deltaOffset);
        };
        TextModel.prototype._findLastMatchInLine = function (searchRegex, text, lineNumber) {
            var bestResult = null;
            var m;
            while ((m = searchRegex.exec(text))) {
                var result = new range_1.Range(lineNumber, m.index + 1, lineNumber, m.index + 1 + m[0].length);
                if (result.equalsRange(bestResult)) {
                    break;
                }
                bestResult = result;
            }
            return bestResult;
        };
        TextModel.prototype._findMatchesInLine = function (searchRegex, text, lineNumber, deltaOffset, counter, result, limitResultCount) {
            var m;
            // Reset regex to search from the beginning
            searchRegex.lastIndex = 0;
            do {
                m = searchRegex.exec(text);
                if (m) {
                    var range = new range_1.Range(lineNumber, m.index + 1 + deltaOffset, lineNumber, m.index + 1 + m[0].length + deltaOffset);
                    // Exit early if the regex matches the same range
                    if (range.equalsRange(result[result.length - 1])) {
                        return counter;
                    }
                    result.push(range);
                    counter++;
                    if (counter >= limitResultCount) {
                        return counter;
                    }
                }
            } while (m);
            return counter;
        };
        return TextModel;
    })(eventEmitter_1.OrderGuaranteeEventEmitter);
    exports.TextModel = TextModel;
});
//# sourceMappingURL=textModel.js.map