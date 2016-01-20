/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/modes/nullMode', 'vs/editor/common/core/range', 'vs/editor/common/editorCommon', 'vs/editor/common/core/arrays', 'vs/base/common/errors'], function (require, exports, nullMode_1, range_1, EditorCommon, arrays_1, Errors) {
    var getType = EditorCommon.LineTokensBinaryEncoding.getType;
    var getBracket = EditorCommon.LineTokensBinaryEncoding.getBracket;
    var getStartIndex = EditorCommon.LineTokensBinaryEncoding.getStartIndex;
    var WordHelper = (function () {
        function WordHelper() {
        }
        WordHelper._safeGetWordDefinition = function (mode) {
            var result = null;
            if (mode.tokenTypeClassificationSupport) {
                try {
                    result = mode.tokenTypeClassificationSupport.getWordDefinition();
                }
                catch (e) {
                    Errors.onUnexpectedError(e);
                }
            }
            return result;
        };
        WordHelper.ensureValidWordDefinition = function (wordDefinition) {
            var result = nullMode_1.NullMode.DEFAULT_WORD_REGEXP;
            if (wordDefinition && (wordDefinition instanceof RegExp)) {
                if (!wordDefinition.global) {
                    var flags = 'g';
                    if (wordDefinition.ignoreCase) {
                        flags += 'i';
                    }
                    if (wordDefinition.multiline) {
                        flags += 'm';
                    }
                    result = new RegExp(wordDefinition.source, flags);
                }
                else {
                    result = wordDefinition;
                }
            }
            result.lastIndex = 0;
            return result;
        };
        WordHelper.massageWordDefinitionOf = function (mode) {
            return WordHelper.ensureValidWordDefinition(WordHelper._safeGetWordDefinition(mode));
        };
        WordHelper.getWords = function (textSource, lineNumber) {
            if (!textSource._lineIsTokenized(lineNumber)) {
                return WordHelper._getWordsInText(textSource.getLineContent(lineNumber), WordHelper.massageWordDefinitionOf(textSource.getMode()));
            }
            var r = [], txt = textSource.getLineContent(lineNumber);
            if (txt.length > 0) {
                var modeTransitions = textSource._getLineModeTransitions(lineNumber), i, len, k, lenK, currentModeStartIndex, currentModeEndIndex, currentWordDefinition, currentModeText, words, startWord, endWord, word;
                // Go through all the modes
                for (i = 0, currentModeStartIndex = 0, len = modeTransitions.length; i < len; i++) {
                    currentWordDefinition = WordHelper.massageWordDefinitionOf(modeTransitions[i].mode);
                    currentModeStartIndex = modeTransitions[i].startIndex;
                    currentModeEndIndex = (i + 1 < len ? modeTransitions[i + 1].startIndex : txt.length);
                    currentModeText = txt.substring(currentModeStartIndex, currentModeEndIndex);
                    words = currentModeText.match(currentWordDefinition);
                    if (!words) {
                        continue;
                    }
                    endWord = 0;
                    for (k = 0, lenK = words.length; k < lenK; k++) {
                        word = words[k];
                        if (word.length > 0) {
                            startWord = currentModeText.indexOf(word, endWord);
                            endWord = startWord + word.length;
                            r.push({
                                start: currentModeStartIndex + startWord,
                                end: currentModeStartIndex + endWord
                            });
                        }
                    }
                }
            }
            return r;
        };
        WordHelper._getWordsInText = function (text, wordDefinition) {
            var words = text.match(wordDefinition) || [], k, startWord, endWord, startColumn, endColumn, word, r = [];
            for (k = 0; k < words.length; k++) {
                word = words[k].trim();
                if (word.length > 0) {
                    startWord = text.indexOf(word, endWord);
                    endWord = startWord + word.length;
                    startColumn = startWord;
                    endColumn = endWord;
                    r.push({
                        start: startColumn,
                        end: endColumn
                    });
                }
            }
            return r;
        };
        WordHelper._getWordAtColumn = function (txt, column, modeIndex, modeTransitions) {
            var modeStartIndex = modeTransitions[modeIndex].startIndex, modeEndIndex = (modeIndex + 1 < modeTransitions.length ? modeTransitions[modeIndex + 1].startIndex : txt.length), mode = modeTransitions[modeIndex].mode;
            return WordHelper._getWordAtText(column, WordHelper.massageWordDefinitionOf(mode), txt.substring(modeStartIndex, modeEndIndex), modeStartIndex);
        };
        WordHelper.getWordAtPosition = function (textSource, position) {
            if (!textSource._lineIsTokenized(position.lineNumber)) {
                return WordHelper._getWordAtText(position.column, WordHelper.massageWordDefinitionOf(textSource.getMode()), textSource.getLineContent(position.lineNumber), 0);
            }
            var result = null;
            var txt = textSource.getLineContent(position.lineNumber), modeTransitions = textSource._getLineModeTransitions(position.lineNumber), columnIndex = position.column - 1, modeIndex = arrays_1.Arrays.findIndexInSegmentsArray(modeTransitions, columnIndex);
            result = WordHelper._getWordAtColumn(txt, position.column, modeIndex, modeTransitions);
            if (!result && modeIndex > 0 && modeTransitions[modeIndex].startIndex === columnIndex) {
                // The position is right at the beginning of `modeIndex`, so try looking at `modeIndex` - 1 too
                result = WordHelper._getWordAtColumn(txt, position.column, modeIndex - 1, modeTransitions);
            }
            return result;
        };
        WordHelper._getWordAtText = function (column, wordDefinition, text, textOffset) {
            // console.log('_getWordAtText: ', column, text, textOffset);
            var words = text.match(wordDefinition), k, startWord, endWord, startColumn, endColumn, word;
            if (words) {
                for (k = 0; k < words.length; k++) {
                    word = words[k].trim();
                    if (word.length > 0) {
                        startWord = text.indexOf(word, endWord);
                        endWord = startWord + word.length;
                        startColumn = textOffset + startWord + 1;
                        endColumn = textOffset + endWord + 1;
                        if (startColumn <= column && column <= endColumn) {
                            return {
                                word: word,
                                startColumn: startColumn,
                                endColumn: endColumn
                            };
                        }
                    }
                }
            }
            return null;
        };
        return WordHelper;
    })();
    exports.WordHelper = WordHelper;
    var BracketsHelper = (function () {
        function BracketsHelper() {
        }
        BracketsHelper._sign = function (n) {
            return n < 0 ? -1 : n > 0 ? 1 : 0;
        };
        BracketsHelper._findMatchingBracketUp = function (textSource, type, lineNumber, tokenIndex, initialCount) {
            var i, end, j, count = initialCount;
            for (i = lineNumber; i >= 1; i--) {
                var lineTokens = textSource.getLineTokens(i, false), tokens = lineTokens.getBinaryEncodedTokens(), tokensMap = lineTokens.getBinaryEncodedTokensMap(), lineText = textSource.getLineContent(i);
                for (j = (i === lineNumber ? tokenIndex : tokens.length) - 1; j >= 0; j--) {
                    if (getType(tokensMap, tokens[j]) === type) {
                        count += BracketsHelper._sign(getBracket(tokens[j]));
                        if (count === 0) {
                            end = (j === tokens.length - 1 ? lineText.length : getStartIndex(tokens[j + 1]));
                            return new range_1.Range(i, getStartIndex(tokens[j]) + 1, i, end + 1);
                        }
                    }
                }
            }
            return null;
        };
        BracketsHelper._findMatchingBracketDown = function (textSource, type, lineNumber, tokenIndex, inaccurateResultAcceptable) {
            var i, len, end, j, lenJ, count = 1;
            for (i = lineNumber, len = textSource.getLineCount(); i <= len; i++) {
                if (inaccurateResultAcceptable && !textSource._lineIsTokenized(i)) {
                    return {
                        range: null,
                        isAccurate: false
                    };
                }
                var lineTokens = textSource.getLineTokens(i, false), tokens = lineTokens.getBinaryEncodedTokens(), tokensMap = lineTokens.getBinaryEncodedTokensMap(), lineText = textSource.getLineContent(i);
                for (j = (i === lineNumber ? tokenIndex + 1 : 0), lenJ = tokens.length; j < lenJ; j++) {
                    if (getType(tokensMap, tokens[j]) === type) {
                        count += BracketsHelper._sign(getBracket(tokens[j]));
                        if (count === 0) {
                            end = (j === tokens.length - 1 ? lineText.length : getStartIndex(tokens[j + 1]));
                            return {
                                range: new range_1.Range(i, getStartIndex(tokens[j]) + 1, i, end + 1),
                                isAccurate: true
                            };
                        }
                    }
                }
            }
            return {
                range: null,
                isAccurate: true
            };
        };
        BracketsHelper.findMatchingBracketUp = function (textSource, tokenType, position) {
            var i, len, end, columnIndex = position.column - 1, tokenIndex = -1, lineTokens = textSource.getLineTokens(position.lineNumber, false), tokens = lineTokens.getBinaryEncodedTokens(), lineText = textSource.getLineContent(position.lineNumber);
            for (i = 0, len = tokens.length; tokenIndex === -1 && i < len; i++) {
                end = i === len - 1 ? lineText.length : getStartIndex(tokens[i + 1]);
                if (getStartIndex(tokens[i]) <= columnIndex && columnIndex <= end) {
                    tokenIndex = i;
                }
            }
            // Start looking one token after the bracket
            return BracketsHelper._findMatchingBracketUp(textSource, tokenType, position.lineNumber, tokenIndex + 1, 0);
        };
        BracketsHelper.matchBracket = function (textSource, position, inaccurateResultAcceptable) {
            if (inaccurateResultAcceptable && !textSource._lineIsTokenized(position.lineNumber)) {
                return {
                    brackets: null,
                    isAccurate: false
                };
            }
            var lineText = textSource.getLineContent(position.lineNumber), i, len;
            var result = {
                brackets: null,
                isAccurate: true
            };
            if (lineText.length > 0) {
                var columnIndex = position.column - 1;
                var token;
                var end;
                var lineTokens = textSource.getLineTokens(position.lineNumber, false), tokens = lineTokens.getBinaryEncodedTokens(), tokensMap = lineTokens.getBinaryEncodedTokensMap(), tokenStartIndex, tokenBracket, tokenType;
                for (i = 0, len = tokens.length; result.brackets === null && i < len; i++) {
                    token = tokens[i];
                    tokenStartIndex = getStartIndex(token);
                    tokenType = getType(tokensMap, token);
                    tokenBracket = getBracket(token);
                    end = i === len - 1 ? lineText.length : getStartIndex(tokens[i + 1]);
                    if (tokenStartIndex <= columnIndex && columnIndex <= end) {
                        if (tokenBracket < 0) {
                            var upMatch = BracketsHelper._findMatchingBracketUp(textSource, tokenType, position.lineNumber, i, -1);
                            if (upMatch) {
                                result.brackets = [new range_1.Range(position.lineNumber, tokenStartIndex + 1, position.lineNumber, end + 1), upMatch];
                            }
                        }
                        if (result.brackets === null && tokenBracket > 0) {
                            var downMatch = BracketsHelper._findMatchingBracketDown(textSource, tokenType, position.lineNumber, i, inaccurateResultAcceptable);
                            result.isAccurate = downMatch.isAccurate;
                            if (downMatch.range) {
                                result.brackets = [new range_1.Range(position.lineNumber, tokenStartIndex + 1, position.lineNumber, end + 1), downMatch.range];
                            }
                        }
                    }
                }
            }
            return result;
        };
        return BracketsHelper;
    })();
    exports.BracketsHelper = BracketsHelper;
});
//# sourceMappingURL=textModelWithTokensHelpers.js.map