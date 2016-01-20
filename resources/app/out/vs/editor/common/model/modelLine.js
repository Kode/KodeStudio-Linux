/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/strings', 'vs/editor/common/editorCommon'], function (require, exports, Strings, EditorCommon) {
    var NO_OP_TOKENS_ADJUSTER = {
        adjust: function () { },
        finish: function () { }
    };
    var NO_OP_MARKERS_ADJUSTER = {
        adjust: function () { },
        finish: function () { }
    };
    var ModelLine = (function () {
        function ModelLine(lineNumber, text) {
            this.lineNumber = lineNumber;
            this.text = text;
            this.isInvalid = false;
        }
        // --- BEGIN STATE
        ModelLine.prototype.setState = function (state) {
            this._state = state;
        };
        ModelLine.prototype.getState = function () {
            return this._state || null;
        };
        // --- END STATE
        // --- BEGIN MODE TRANSITIONS
        ModelLine.prototype._setModeTransitions = function (topLevelMode, modeTransitions) {
            var desired = toModeTransitions(topLevelMode, modeTransitions);
            if (desired === null) {
                // saving memory
                if (typeof this._modeTransitions === 'undefined') {
                    return;
                }
                this._modeTransitions = null;
                return;
            }
            this._modeTransitions = desired;
        };
        ModelLine.prototype.getModeTransitions = function () {
            if (this._modeTransitions) {
                return this._modeTransitions;
            }
            return DefaultModeTransitions.INSTANCE;
        };
        // --- END MODE TRANSITIONS
        // --- BEGIN TOKENS
        ModelLine.prototype.setTokens = function (map, tokens, topLevelMode, modeTransitions) {
            this._setLineTokens(map, tokens);
            this._setModeTransitions(topLevelMode, modeTransitions);
        };
        ModelLine.prototype._setLineTokens = function (map, tokens) {
            var desired = toLineTokens(map, tokens, this.text.length);
            if (desired === null) {
                // saving memory
                if (typeof this._lineTokens === 'undefined') {
                    return;
                }
                this._lineTokens = null;
                return;
            }
            this._lineTokens = desired;
        };
        ModelLine.prototype.getTokens = function () {
            if (this._lineTokens) {
                return this._lineTokens;
            }
            if (this.text.length === 0) {
                return EmptyLineTokens.INSTANCE;
            }
            return DefaultLineTokens.INSTANCE;
        };
        // --- END TOKENS
        ModelLine.prototype._createTokensAdjuster = function () {
            if (!this._lineTokens) {
                // This line does not have real tokens, so there is nothing to adjust
                return NO_OP_TOKENS_ADJUSTER;
            }
            var lineTokens = this._lineTokens;
            var BIN = EditorCommon.LineTokensBinaryEncoding;
            var tokens = lineTokens.getBinaryEncodedTokens();
            var tokensLength = tokens.length;
            var tokensIndex = 0;
            var currentTokenStartIndex = 0;
            var adjust = function (toColumn, delta, minimumAllowedColumn) {
                // console.log('before call: tokensIndex: ' + tokensIndex + ': ' + String(this.getTokens()));
                // console.log('adjustTokens: ' + toColumn + ' with delta: ' + delta + ' and [' + minimumAllowedColumn + ']');
                // console.log('currentTokenStartIndex: ' + currentTokenStartIndex);
                var minimumAllowedIndex = minimumAllowedColumn - 1;
                while (currentTokenStartIndex < toColumn && tokensIndex < tokensLength) {
                    if (currentTokenStartIndex > 0 && delta !== 0) {
                        // adjust token's `startIndex` by `delta`
                        var deflatedType = (tokens[tokensIndex] / BIN.TYPE_OFFSET) & BIN.TYPE_MASK;
                        var deflatedBracket = (tokens[tokensIndex] / BIN.BRACKET_OFFSET) & BIN.BRACKET_MASK;
                        var newStartIndex = Math.max(minimumAllowedIndex, currentTokenStartIndex + delta);
                        var newToken = deflatedBracket * BIN.BRACKET_OFFSET + deflatedType * BIN.TYPE_OFFSET + newStartIndex * BIN.START_INDEX_OFFSET;
                        if (delta < 0) {
                            // pop all previous tokens that have become `collapsed`
                            while (tokensIndex > 0) {
                                var prevTokenStartIndex = (tokens[tokensIndex - 1] / BIN.START_INDEX_OFFSET) & BIN.START_INDEX_MASK;
                                if (prevTokenStartIndex >= newStartIndex) {
                                    // Token at `tokensIndex` - 1 is now `collapsed` => pop it
                                    tokens.splice(tokensIndex - 1, 1);
                                    tokensLength--;
                                    tokensIndex--;
                                }
                                else {
                                    break;
                                }
                            }
                        }
                        tokens[tokensIndex] = newToken;
                    }
                    tokensIndex++;
                    if (tokensIndex < tokensLength) {
                        currentTokenStartIndex = (tokens[tokensIndex] / BIN.START_INDEX_OFFSET) & BIN.START_INDEX_MASK;
                    }
                }
                // console.log('after call: tokensIndex: ' + tokensIndex + ': ' + String(this.getTokens()));
            };
            var finish = function (delta, lineTextLength) {
                adjust(Number.MAX_VALUE, delta, 1);
            };
            return {
                adjust: adjust,
                finish: finish
            };
        };
        ModelLine.prototype._setText = function (text) {
            this.text = text;
            if (this._lineTokens) {
                var BIN = EditorCommon.LineTokensBinaryEncoding, map = this._lineTokens.getBinaryEncodedTokensMap(), tokens = this._lineTokens.getBinaryEncodedTokens(), lineTextLength = this.text.length;
                // Remove overflowing tokens
                while (tokens.length > 0) {
                    var lastTokenStartIndex = (tokens[tokens.length - 1] / BIN.START_INDEX_OFFSET) & BIN.START_INDEX_MASK;
                    if (lastTokenStartIndex < lineTextLength) {
                        // Valid token
                        break;
                    }
                    // This token now overflows the text => remove it
                    tokens.pop();
                }
                this._setLineTokens(map, tokens);
            }
        };
        // private _printMarkers(): string {
        // 	if (!this._markers) {
        // 		return '[]';
        // 	}
        // 	if (this._markers.length === 0) {
        // 		return '[]';
        // 	}
        // 	var markers = this._markers;
        // 	var printMarker = (m:ILineMarker) => {
        // 		if (m.stickToPreviousCharacter) {
        // 			return '|' + m.column;
        // 		}
        // 		return m.column + '|';
        // 	}
        // 	return '[' + markers.map(printMarker).join(', ') + ']';
        // }
        ModelLine.prototype._createMarkersAdjuster = function (changedMarkers) {
            var _this = this;
            if (!this._markers) {
                return NO_OP_MARKERS_ADJUSTER;
            }
            if (this._markers.length === 0) {
                return NO_OP_MARKERS_ADJUSTER;
            }
            this._markers.sort(ModelLine._compareMarkers);
            var markers = this._markers;
            var markersLength = markers.length;
            var markersIndex = 0;
            var marker = markers[markersIndex];
            // console.log('------------- INITIAL MARKERS: ' + this._printMarkers());
            var adjust = function (toColumn, delta, minimumAllowedColumn, forceStickToPrevious, forceMoveMarkers) {
                // console.log('------------------------------');
                // console.log('adjust called: toColumn: ' + toColumn + ', delta: ' + delta + ', minimumAllowedColumn: ' + minimumAllowedColumn + ', forceStickToPrevious: ' + forceStickToPrevious + ', forceMoveMarkers:' + forceMoveMarkers);
                // console.log('BEFORE::: markersIndex: ' + markersIndex + ' : ' + this._printMarkers());
                while (markersIndex < markersLength
                    && (marker.column < toColumn
                        || (!forceMoveMarkers
                            && marker.column === toColumn
                            && (forceStickToPrevious || marker.stickToPreviousCharacter)))) {
                    if (delta !== 0) {
                        var newColumn = Math.max(minimumAllowedColumn, marker.column + delta);
                        if (marker.column !== newColumn) {
                            changedMarkers[marker.id] = true;
                            marker.oldLineNumber = marker.oldLineNumber || _this.lineNumber;
                            marker.oldColumn = marker.oldColumn || marker.column;
                            marker.column = Math.max(minimumAllowedColumn, marker.column + delta);
                        }
                    }
                    markersIndex++;
                    if (markersIndex < markersLength) {
                        marker = markers[markersIndex];
                    }
                }
                // console.log('AFTER::: markersIndex: ' + markersIndex + ' : ' + this._printMarkers());
            };
            var finish = function (delta, lineTextLength) {
                adjust(Number.MAX_VALUE, delta, 1, false, false);
                // console.log('------------- FINAL MARKERS: ' + this._printMarkers());
            };
            return {
                adjust: adjust,
                finish: finish
            };
        };
        ModelLine.prototype.applyEdits = function (changedMarkers, edits) {
            var deltaColumn = 0;
            var resultText = this.text;
            var tokensAdjuster = this._createTokensAdjuster();
            var markersAdjuster = this._createMarkersAdjuster(changedMarkers);
            for (var i = 0, len = edits.length; i < len; i++) {
                var edit = edits[i];
                // console.log();
                // console.log('=============================');
                // console.log('EDIT #' + i + ' [ ' + edit.startColumn + ' -> ' + edit.endColumn + ' ] : <<<' + edit.text + '>>>, forceMoveMarkers: ' + edit.forceMoveMarkers);
                // console.log('deltaColumn: ' + deltaColumn);
                var startColumn = deltaColumn + edit.startColumn;
                var endColumn = deltaColumn + edit.endColumn;
                var deletingCnt = endColumn - startColumn;
                var insertingCnt = edit.text.length;
                // Adjust tokens & markers before this edit
                // console.log('Adjust tokens & markers before this edit');
                tokensAdjuster.adjust(edit.startColumn - 1, deltaColumn, 1);
                markersAdjuster.adjust(edit.startColumn, deltaColumn, 1, deletingCnt > 0, edit.forceMoveMarkers);
                // Adjust tokens & markers for the common part of this edit
                var commonLength = Math.min(deletingCnt, insertingCnt);
                if (commonLength > 0) {
                    // console.log('Adjust tokens & markers for the common part of this edit');
                    tokensAdjuster.adjust(edit.startColumn - 1 + commonLength, deltaColumn, startColumn);
                    markersAdjuster.adjust(edit.startColumn + commonLength, deltaColumn, startColumn, deletingCnt > insertingCnt, edit.forceMoveMarkers);
                }
                // Perform the edit & update `deltaColumn`
                resultText = resultText.substring(0, startColumn - 1) + edit.text + resultText.substring(endColumn - 1);
                deltaColumn += insertingCnt - deletingCnt;
                // Adjust tokens & markers inside this edit
                // console.log('Adjust tokens & markers inside this edit');
                tokensAdjuster.adjust(edit.endColumn, deltaColumn, startColumn);
                markersAdjuster.adjust(edit.endColumn, deltaColumn, startColumn, false, edit.forceMoveMarkers);
            }
            // Wrap up tokens & markers; adjust remaining if needed
            tokensAdjuster.finish(deltaColumn, resultText.length);
            markersAdjuster.finish(deltaColumn, resultText.length);
            // Save the resulting text
            this._setText(resultText);
            return deltaColumn;
        };
        ModelLine.prototype.split = function (changedMarkers, splitColumn, forceMoveMarkers) {
            // console.log('--> split @ ' + splitColumn + '::: ' + this._printMarkers());
            var myText = this.text.substring(0, splitColumn - 1);
            var otherText = this.text.substring(splitColumn - 1);
            var otherMarkers = null;
            if (this._markers) {
                this._markers.sort(ModelLine._compareMarkers);
                for (var i = 0, len = this._markers.length; i < len; i++) {
                    var marker = this._markers[i];
                    if (marker.column > splitColumn
                        || (marker.column === splitColumn
                            && (forceMoveMarkers
                                || !marker.stickToPreviousCharacter))) {
                        var myMarkers = this._markers.slice(0, i);
                        otherMarkers = this._markers.slice(i);
                        this._markers = myMarkers;
                        break;
                    }
                }
                if (otherMarkers) {
                    for (var i = 0, len = otherMarkers.length; i < len; i++) {
                        var marker = otherMarkers[i];
                        changedMarkers[marker.id] = true;
                        marker.oldLineNumber = marker.oldLineNumber || this.lineNumber;
                        marker.oldColumn = marker.oldColumn || marker.column;
                        marker.column -= splitColumn - 1;
                    }
                }
            }
            this._setText(myText);
            var otherLine = new ModelLine(this.lineNumber + 1, otherText);
            if (otherMarkers) {
                otherLine.addMarkers(otherMarkers);
            }
            return otherLine;
        };
        ModelLine.prototype.append = function (changedMarkers, other) {
            // console.log('--> append: THIS :: ' + this._printMarkers());
            // console.log('--> append: OTHER :: ' + this._printMarkers());
            var thisTextLength = this.text.length;
            this._setText(this.text + other.text);
            var otherLineTokens = other._lineTokens;
            if (otherLineTokens) {
                // Other has real tokens
                var otherTokens = otherLineTokens.getBinaryEncodedTokens();
                // Adjust other tokens
                if (thisTextLength > 0) {
                    var BIN = EditorCommon.LineTokensBinaryEncoding;
                    for (var i = 0, len = otherTokens.length; i < len; i++) {
                        var token = otherTokens[i];
                        var deflatedStartIndex = (token / BIN.START_INDEX_OFFSET) & BIN.START_INDEX_MASK;
                        var deflatedType = (token / BIN.TYPE_OFFSET) & BIN.TYPE_MASK;
                        var deflatedBracket = (token / BIN.BRACKET_OFFSET) & BIN.BRACKET_MASK;
                        var newStartIndex = deflatedStartIndex + thisTextLength;
                        var newToken = deflatedBracket * BIN.BRACKET_OFFSET + deflatedType * BIN.TYPE_OFFSET + newStartIndex * BIN.START_INDEX_OFFSET;
                        otherTokens[i] = newToken;
                    }
                }
                // Append other tokens
                var myLineTokens = this._lineTokens;
                if (myLineTokens) {
                    // I have real tokens
                    this._setLineTokens(myLineTokens.getBinaryEncodedTokensMap(), myLineTokens.getBinaryEncodedTokens().concat(otherTokens));
                }
                else {
                    // I don't have real tokens
                    this._setLineTokens(otherLineTokens.getBinaryEncodedTokensMap(), otherTokens);
                }
            }
            if (other._markers) {
                // Other has markers
                var otherMarkers = other._markers;
                // Adjust other markers
                for (var i = 0, len = otherMarkers.length; i < len; i++) {
                    var marker = otherMarkers[i];
                    changedMarkers[marker.id] = true;
                    marker.oldLineNumber = marker.oldLineNumber || other.lineNumber;
                    marker.oldColumn = marker.oldColumn || marker.column;
                    marker.column += thisTextLength;
                }
                this.addMarkers(otherMarkers);
            }
        };
        ModelLine.prototype.addMarker = function (marker) {
            marker.line = this;
            if (!this._markers) {
                this._markers = [marker];
            }
            else {
                this._markers.push(marker);
            }
        };
        ModelLine.prototype.addMarkers = function (markers) {
            if (markers.length === 0) {
                return;
            }
            var i, len;
            for (i = 0, len = markers.length; i < len; i++) {
                markers[i].line = this;
            }
            if (!this._markers) {
                this._markers = markers.slice(0);
            }
            else {
                this._markers = this._markers.concat(markers);
            }
        };
        ModelLine._compareMarkers = function (a, b) {
            if (a.column === b.column) {
                return (a.stickToPreviousCharacter ? 0 : 1) - (b.stickToPreviousCharacter ? 0 : 1);
            }
            return a.column - b.column;
        };
        ModelLine.prototype.removeMarker = function (marker) {
            var index = this._indexOfMarkerId(marker.id);
            if (index >= 0) {
                this._markers.splice(index, 1);
            }
            marker.line = null;
        };
        ModelLine.prototype.removeMarkers = function (deleteMarkers) {
            if (!this._markers) {
                return;
            }
            for (var i = 0, len = this._markers.length; i < len; i++) {
                var marker = this._markers[i];
                if (deleteMarkers[marker.id]) {
                    marker.line = null;
                    this._markers.splice(i, 1);
                    len--;
                    i--;
                }
            }
        };
        ModelLine.prototype.getMarkers = function () {
            if (!this._markers) {
                return [];
            }
            return this._markers.slice(0);
        };
        ModelLine.prototype.updateLineNumber = function (changedMarkers, newLineNumber) {
            if (this._markers) {
                var markers = this._markers, i, len, marker;
                for (i = 0, len = markers.length; i < len; i++) {
                    marker = markers[i];
                    changedMarkers[marker.id] = true;
                    marker.oldLineNumber = marker.oldLineNumber || this.lineNumber;
                }
            }
            this.lineNumber = newLineNumber;
        };
        ModelLine.prototype.deleteLine = function (changedMarkers, setMarkersColumn, setMarkersOldLineNumber) {
            // console.log('--> deleteLine: ');
            if (this._markers) {
                var markers = this._markers, i, len, marker;
                // Mark all these markers as changed
                for (i = 0, len = markers.length; i < len; i++) {
                    marker = markers[i];
                    changedMarkers[marker.id] = true;
                    marker.oldColumn = marker.oldColumn || marker.column;
                    marker.oldLineNumber = marker.oldLineNumber || setMarkersOldLineNumber;
                    marker.column = setMarkersColumn;
                }
                return markers;
            }
            return [];
        };
        ModelLine.prototype._indexOfMarkerId = function (markerId) {
            if (this._markers) {
                var markers = this._markers, i, len;
                for (i = 0, len = markers.length; i < len; i++) {
                    if (markers[i].id === markerId) {
                        return i;
                    }
                }
            }
            return -1;
        };
        return ModelLine;
    })();
    exports.ModelLine = ModelLine;
    function areDeflatedTokens(tokens) {
        return (typeof tokens[0] === 'number');
    }
    function toLineTokens(map, tokens, textLength) {
        if (textLength === 0) {
            return null;
        }
        if (!tokens || tokens.length === 0) {
            return null;
        }
        if (tokens.length === 1) {
            if (areDeflatedTokens(tokens)) {
                if (tokens[0] === 0) {
                    return null;
                }
            }
            else {
                if (tokens[0].startIndex === 0 && tokens[0].type === '' && !tokens[0].bracket) {
                    return null;
                }
            }
        }
        return new LineTokens(map, tokens);
    }
    var getStartIndex = EditorCommon.LineTokensBinaryEncoding.getStartIndex;
    var getType = EditorCommon.LineTokensBinaryEncoding.getType;
    var getBracket = EditorCommon.LineTokensBinaryEncoding.getBracket;
    var findIndexOfOffset = EditorCommon.LineTokensBinaryEncoding.findIndexOfOffset;
    var LineTokens = (function () {
        function LineTokens(map, tokens) {
            this.map = map;
            if (areDeflatedTokens(tokens)) {
                this._tokens = tokens;
            }
            else {
                this._tokens = EditorCommon.LineTokensBinaryEncoding.deflateArr(map, tokens);
            }
        }
        LineTokens.prototype.toString = function () {
            return EditorCommon.LineTokensBinaryEncoding.inflateArr(this.map, this._tokens).toString();
        };
        LineTokens.prototype.getBinaryEncodedTokensMap = function () {
            return this.map;
        };
        LineTokens.prototype.getBinaryEncodedTokens = function () {
            return this._tokens;
        };
        LineTokens.prototype.getTokenCount = function () {
            return this._tokens.length;
        };
        LineTokens.prototype.getTokenStartIndex = function (tokenIndex) {
            return getStartIndex(this._tokens[tokenIndex]);
        };
        LineTokens.prototype.getTokenType = function (tokenIndex) {
            return getType(this.map, this._tokens[tokenIndex]);
        };
        LineTokens.prototype.getTokenBracket = function (tokenIndex) {
            return getBracket(this._tokens[tokenIndex]);
        };
        LineTokens.prototype.getTokenEndIndex = function (tokenIndex, textLength) {
            if (tokenIndex + 1 < this._tokens.length) {
                return getStartIndex(this._tokens[tokenIndex + 1]);
            }
            return textLength;
        };
        LineTokens.prototype.equals = function (other) {
            return this === other;
        };
        LineTokens.prototype.findIndexOfOffset = function (offset) {
            return findIndexOfOffset(this._tokens, offset);
        };
        return LineTokens;
    })();
    exports.LineTokens = LineTokens;
    var EmptyLineTokens = (function () {
        function EmptyLineTokens() {
        }
        EmptyLineTokens.prototype.getBinaryEncodedTokens = function () {
            return EmptyLineTokens.TOKENS;
        };
        EmptyLineTokens.prototype.getBinaryEncodedTokensMap = function () {
            return null;
        };
        EmptyLineTokens.prototype.getTokenCount = function () {
            return 0;
        };
        EmptyLineTokens.prototype.getTokenStartIndex = function (tokenIndex) {
            return 0;
        };
        EmptyLineTokens.prototype.getTokenType = function (tokenIndex) {
            return Strings.empty;
        };
        EmptyLineTokens.prototype.getTokenBracket = function (tokenIndex) {
            return 0;
        };
        EmptyLineTokens.prototype.getTokenEndIndex = function (tokenIndex, textLength) {
            return 0;
        };
        EmptyLineTokens.prototype.equals = function (other) {
            return other === this;
        };
        EmptyLineTokens.prototype.findIndexOfOffset = function (offset) {
            return 0;
        };
        EmptyLineTokens.INSTANCE = new EmptyLineTokens();
        EmptyLineTokens.TOKENS = [];
        return EmptyLineTokens;
    })();
    var DefaultLineTokens = (function () {
        function DefaultLineTokens() {
        }
        DefaultLineTokens.prototype.getBinaryEncodedTokensMap = function () {
            return null;
        };
        DefaultLineTokens.prototype.getBinaryEncodedTokens = function () {
            return DefaultLineTokens.TOKENS;
        };
        DefaultLineTokens.prototype.getTokenCount = function () {
            return 1;
        };
        DefaultLineTokens.prototype.getTokenStartIndex = function (tokenIndex) {
            return 0;
        };
        DefaultLineTokens.prototype.getTokenType = function (tokenIndex) {
            return Strings.empty;
        };
        DefaultLineTokens.prototype.getTokenBracket = function (tokenIndex) {
            return 0;
        };
        DefaultLineTokens.prototype.getTokenEndIndex = function (tokenIndex, textLength) {
            return textLength;
        };
        DefaultLineTokens.prototype.equals = function (other) {
            return this === other;
        };
        DefaultLineTokens.prototype.findIndexOfOffset = function (offset) {
            return 0;
        };
        DefaultLineTokens.INSTANCE = new DefaultLineTokens();
        DefaultLineTokens.TOKENS = [0];
        return DefaultLineTokens;
    })();
    exports.DefaultLineTokens = DefaultLineTokens;
    function toModeTransitions(topLevelMode, modeTransitions) {
        if (!modeTransitions || modeTransitions.length === 0) {
            return null;
        }
        else if (modeTransitions.length === 1 && modeTransitions[0].startIndex === 0) {
            if (modeTransitions[0].mode === topLevelMode) {
                return null;
            }
            else {
                return new SingleModeTransition(modeTransitions[0].mode);
            }
        }
        return new ModeTransitions(modeTransitions);
    }
    var DefaultModeTransitions = (function () {
        function DefaultModeTransitions() {
        }
        DefaultModeTransitions.prototype.toArray = function (topLevelMode) {
            return [{
                    startIndex: 0,
                    mode: topLevelMode
                }];
        };
        DefaultModeTransitions.INSTANCE = new DefaultModeTransitions();
        return DefaultModeTransitions;
    })();
    var SingleModeTransition = (function () {
        function SingleModeTransition(mode) {
            this._mode = mode;
        }
        SingleModeTransition.prototype.toArray = function (topLevelMode) {
            return [{
                    startIndex: 0,
                    mode: this._mode
                }];
        };
        return SingleModeTransition;
    })();
    var ModeTransitions = (function () {
        function ModeTransitions(modeTransitions) {
            this._modeTransitions = modeTransitions;
        }
        ModeTransitions.prototype.toArray = function (topLevelMode) {
            return this._modeTransitions.slice(0);
        };
        return ModeTransitions;
    })();
});
//# sourceMappingURL=modelLine.js.map