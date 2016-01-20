/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/modes', 'vs/editor/common/core/arrays'], function (require, exports, modes, arrays_1) {
    var SimpleTokenTypeClassificationMode = (function () {
        function SimpleTokenTypeClassificationMode(id, tokenTypeClassificationSupport) {
            this._id = id;
            this.tokenTypeClassificationSupport = tokenTypeClassificationSupport;
        }
        SimpleTokenTypeClassificationMode.prototype.getId = function () {
            return this._id;
        };
        SimpleTokenTypeClassificationMode.prototype.toSimplifiedMode = function () {
            return this;
        };
        return SimpleTokenTypeClassificationMode;
    })();
    function createMockMode(id, wordRegExp) {
        if (wordRegExp === void 0) { wordRegExp = null; }
        var tokenTypeClassificationSupport;
        if (wordRegExp) {
            tokenTypeClassificationSupport = {
                getWordDefinition: function () { return wordRegExp; }
            };
        }
        return new SimpleTokenTypeClassificationMode(id, tokenTypeClassificationSupport);
    }
    exports.createMockMode = createMockMode;
    function createLineContextFromTokenText(tokens) {
        var line = '';
        var processedTokens = [];
        var indexSoFar = 0;
        for (var i = 0; i < tokens.length; ++i) {
            processedTokens.push({ startIndex: indexSoFar, type: tokens[i].type, bracket: (tokens[i].bracket ? tokens[i].bracket : modes.Bracket.None) });
            line += tokens[i].text;
            indexSoFar += tokens[i].text.length;
        }
        return new TestLineContext(line, processedTokens, null);
    }
    exports.createLineContextFromTokenText = createLineContextFromTokenText;
    function createLineContext(line, tokens) {
        return new TestLineContext(line, tokens.tokens, tokens.modeTransitions);
    }
    exports.createLineContext = createLineContext;
    var TestLineContext = (function () {
        function TestLineContext(line, tokens, modeTransitions) {
            this.modeTransitions = modeTransitions;
            this._line = line;
            this._tokens = tokens;
        }
        TestLineContext.prototype.getLineContent = function () {
            return this._line;
        };
        TestLineContext.prototype.getTokenCount = function () {
            return this._tokens.length;
        };
        TestLineContext.prototype.getTokenStartIndex = function (tokenIndex) {
            return this._tokens[tokenIndex].startIndex;
        };
        TestLineContext.prototype.getTokenEndIndex = function (tokenIndex) {
            if (tokenIndex + 1 < this._tokens.length) {
                return this._tokens[tokenIndex + 1].startIndex;
            }
            return this._line.length;
        };
        TestLineContext.prototype.getTokenType = function (tokenIndex) {
            return this._tokens[tokenIndex].type;
        };
        TestLineContext.prototype.getTokenBracket = function (tokenIndex) {
            return this._tokens[tokenIndex].bracket;
        };
        TestLineContext.prototype.findIndexOfOffset = function (offset) {
            return arrays_1.Arrays.findIndexInSegmentsArray(this._tokens, offset);
        };
        TestLineContext.prototype.getTokenText = function (tokenIndex) {
            var startIndex = this._tokens[tokenIndex].startIndex;
            var endIndex = tokenIndex + 1 < this._tokens.length ? this._tokens[tokenIndex + 1].startIndex : this._line.length;
            return this._line.substring(startIndex, endIndex);
        };
        return TestLineContext;
    })();
});
//# sourceMappingURL=modesTestUtils.js.map