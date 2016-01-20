/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/strings', 'vs/base/common/errors'], function (require, exports, Strings, Errors) {
    var InflatedToken = (function () {
        function InflatedToken(startIndex, type, bracket) {
            this.startIndex = startIndex;
            this.type = type;
            this.bracket = bracket;
        }
        InflatedToken.prototype.toString = function () {
            return '{ ' + this.startIndex + ', \'' + this.type + '\', ' + this.bracket + '}';
        };
        return InflatedToken;
    })();
    exports.START_INDEX_MASK = 0xffffffff;
    exports.TYPE_MASK = 0xffff;
    exports.BRACKET_MASK = 0xff;
    exports.START_INDEX_OFFSET = 1;
    exports.TYPE_OFFSET = Math.pow(2, 32);
    exports.BRACKET_OFFSET = Math.pow(2, 48);
    var DEFAULT_TOKEN = {
        startIndex: 0,
        type: '',
        bracket: 0
    };
    var INFLATED_TOKENS_EMPTY_TEXT = [];
    var DEFLATED_TOKENS_EMPTY_TEXT = [];
    var INFLATED_TOKENS_NON_EMPTY_TEXT = [DEFAULT_TOKEN];
    var DEFLATED_TOKENS_NON_EMPTY_TEXT = [0];
    function deflateArr(map, tokens) {
        if (tokens.length === 0) {
            return DEFLATED_TOKENS_EMPTY_TEXT;
        }
        if (tokens.length === 1 && tokens[0].startIndex === 0 && !tokens[0].type && !tokens[0].bracket) {
            return DEFLATED_TOKENS_NON_EMPTY_TEXT;
        }
        var i, len, deflatedToken, deflatedBracket, deflated, token, inflateMap = map._inflate, deflateMap = map._deflate, prevStartIndex = -1, result = new Array(tokens.length);
        for (i = 0, len = tokens.length; i < len; i++) {
            token = tokens[i];
            if (token.startIndex <= prevStartIndex) {
                token.startIndex = prevStartIndex + 1;
                Errors.onUnexpectedError({
                    message: 'Invalid tokens detected',
                    tokens: tokens
                });
            }
            if (deflateMap.hasOwnProperty(token.type)) {
                deflatedToken = deflateMap[token.type];
            }
            else {
                deflatedToken = inflateMap.length;
                deflateMap[token.type] = deflatedToken;
                inflateMap.push(token.type);
            }
            deflatedBracket = token.bracket;
            if (deflatedBracket < 0) {
                deflatedBracket = 2;
            }
            // http://stackoverflow.com/a/2803010
            // All numbers in JavaScript are actually IEEE-754 compliant floating-point doubles.
            // These have a 53-bit mantissa which should mean that any integer value with a magnitude
            // of approximately 9 quadrillion or less -- more specifically, 9,007,199,254,740,991 --
            // will be represented accurately.
            // http://stackoverflow.com/a/6729252
            // Bitwise operations cast numbers to 32bit representation in JS
            // 32 bits for startIndex => up to 2^32 = 4,294,967,296
            // 16 bits for token => up to 2^16 = 65,536
            // 2 bits for bracket => up to 2^2 = 4
            // [bracket][token][startIndex]
            deflated = deflatedBracket * exports.BRACKET_OFFSET + deflatedToken * exports.TYPE_OFFSET + token.startIndex * exports.START_INDEX_OFFSET;
            result[i] = deflated;
            prevStartIndex = token.startIndex;
        }
        return result;
    }
    exports.deflateArr = deflateArr;
    function inflate(map, binaryEncodedToken) {
        if (binaryEncodedToken === 0) {
            return DEFAULT_TOKEN;
        }
        var startIndex = (binaryEncodedToken / exports.START_INDEX_OFFSET) & exports.START_INDEX_MASK;
        var deflatedType = (binaryEncodedToken / exports.TYPE_OFFSET) & exports.TYPE_MASK;
        var deflatedBracket = (binaryEncodedToken / exports.BRACKET_OFFSET) & exports.BRACKET_MASK;
        if (deflatedBracket === 2) {
            deflatedBracket = -1;
        }
        return new InflatedToken(startIndex, map._inflate[deflatedType], deflatedBracket);
    }
    exports.inflate = inflate;
    function getStartIndex(binaryEncodedToken) {
        return (binaryEncodedToken / exports.START_INDEX_OFFSET) & exports.START_INDEX_MASK;
    }
    exports.getStartIndex = getStartIndex;
    function getType(map, binaryEncodedToken) {
        var deflatedType = (binaryEncodedToken / exports.TYPE_OFFSET) & exports.TYPE_MASK;
        if (deflatedType === 0) {
            return Strings.empty;
        }
        return map._inflate[deflatedType];
    }
    exports.getType = getType;
    function getBracket(binaryEncodedToken) {
        var deflatedBracket = (binaryEncodedToken / exports.BRACKET_OFFSET) & exports.BRACKET_MASK;
        if (deflatedBracket === 2) {
            deflatedBracket = -1;
        }
        return deflatedBracket;
    }
    exports.getBracket = getBracket;
    function inflateArr(map, binaryEncodedTokens) {
        if (binaryEncodedTokens.length === 0) {
            return INFLATED_TOKENS_EMPTY_TEXT;
        }
        if (binaryEncodedTokens.length === 1 && binaryEncodedTokens[0] === 0) {
            return INFLATED_TOKENS_NON_EMPTY_TEXT;
        }
        var result = new Array(binaryEncodedTokens.length), i, len, deflated, startIndex, deflatedBracket, deflatedType, inflateMap = map._inflate;
        for (i = 0, len = binaryEncodedTokens.length; i < len; i++) {
            deflated = binaryEncodedTokens[i];
            startIndex = (deflated / exports.START_INDEX_OFFSET) & exports.START_INDEX_MASK;
            deflatedType = (deflated / exports.TYPE_OFFSET) & exports.TYPE_MASK;
            deflatedBracket = (deflated / exports.BRACKET_OFFSET) & exports.BRACKET_MASK;
            if (deflatedBracket === 2) {
                deflatedBracket = -1;
            }
            result[i] = new InflatedToken(startIndex, inflateMap[deflatedType], deflatedBracket);
        }
        return result;
    }
    exports.inflateArr = inflateArr;
    function findIndexOfOffset(binaryEncodedTokens, offset) {
        return findIndexInSegmentsArray(binaryEncodedTokens, offset);
    }
    exports.findIndexOfOffset = findIndexOfOffset;
    function sliceAndInflate(map, binaryEncodedTokens, startOffset, endOffset, deltaStartIndex) {
        if (binaryEncodedTokens.length === 0) {
            return INFLATED_TOKENS_EMPTY_TEXT;
        }
        if (binaryEncodedTokens.length === 1 && binaryEncodedTokens[0] === 0) {
            return INFLATED_TOKENS_NON_EMPTY_TEXT;
        }
        var startIndex = findIndexInSegmentsArray(binaryEncodedTokens, startOffset), i, len, originalToken, originalStartIndex, newStartIndex, deflatedType, deflatedBracket, result = [], inflateMap = map._inflate;
        originalToken = binaryEncodedTokens[startIndex];
        deflatedType = (originalToken / exports.TYPE_OFFSET) & exports.TYPE_MASK;
        deflatedBracket = (originalToken / exports.BRACKET_OFFSET) & exports.BRACKET_MASK;
        newStartIndex = 0;
        result.push(new InflatedToken(newStartIndex, inflateMap[deflatedType], deflatedBracket));
        for (i = startIndex + 1, len = binaryEncodedTokens.length; i < len; i++) {
            originalToken = binaryEncodedTokens[i];
            originalStartIndex = (originalToken / exports.START_INDEX_OFFSET) & exports.START_INDEX_MASK;
            if (originalStartIndex >= endOffset) {
                break;
            }
            deflatedType = (originalToken / exports.TYPE_OFFSET) & exports.TYPE_MASK;
            deflatedBracket = (originalToken / exports.BRACKET_OFFSET) & exports.BRACKET_MASK;
            newStartIndex = originalStartIndex - startOffset + deltaStartIndex;
            result.push(new InflatedToken(newStartIndex, inflateMap[deflatedType], deflatedBracket));
        }
        return result;
    }
    exports.sliceAndInflate = sliceAndInflate;
    function findIndexInSegmentsArray(arr, desiredIndex) {
        var low = 0, high = arr.length - 1, mid, value;
        while (low < high) {
            mid = low + Math.ceil((high - low) / 2);
            value = arr[mid] & 0xffffffff;
            if (value > desiredIndex) {
                high = mid - 1;
            }
            else {
                low = mid;
            }
        }
        return low;
    }
    exports.findIndexInSegmentsArray = findIndexInSegmentsArray;
});
//# sourceMappingURL=tokensBinaryEncoding.js.map