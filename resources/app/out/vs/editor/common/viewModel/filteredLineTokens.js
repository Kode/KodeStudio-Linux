/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/editorCommon', 'vs/editor/common/core/arrays'], function (require, exports, EditorCommon, arrays_1) {
    var FilteredLineTokens = (function () {
        /**
         * [startOffset; endOffset) (i.e. do not include endOffset)
         */
        function FilteredLineTokens(original, startOffset, endOffset, deltaStartIndex) {
            this._original = original;
            this._startOffset = startOffset;
            this._endOffset = endOffset;
            this._deltaStartIndex = deltaStartIndex;
            this.inflatedTokens = EditorCommon.LineTokensBinaryEncoding.sliceAndInflate(original.getBinaryEncodedTokensMap(), original.getBinaryEncodedTokens(), startOffset, endOffset, deltaStartIndex);
        }
        FilteredLineTokens.prototype.getTokens = function () {
            return this.inflatedTokens;
        };
        FilteredLineTokens.prototype.getFauxIndentLength = function () {
            return this._deltaStartIndex;
        };
        FilteredLineTokens.prototype.getTextLength = function () {
            return this._endOffset - this._startOffset + this._deltaStartIndex;
        };
        FilteredLineTokens.prototype.equals = function (other) {
            if (other instanceof FilteredLineTokens) {
                var otherFilteredLineTokens = other;
                if (this._startOffset !== otherFilteredLineTokens._startOffset) {
                    return false;
                }
                if (this._endOffset !== otherFilteredLineTokens._endOffset) {
                    return false;
                }
                if (this._deltaStartIndex !== otherFilteredLineTokens._deltaStartIndex) {
                    return false;
                }
                return this._original.equals(otherFilteredLineTokens._original);
            }
            return false;
        };
        FilteredLineTokens.prototype.findIndexOfOffset = function (offset) {
            return arrays_1.Arrays.findIndexInSegmentsArray(this.inflatedTokens, offset);
        };
        return FilteredLineTokens;
    })();
    exports.FilteredLineTokens = FilteredLineTokens;
    var IdentityFilteredLineTokens = (function () {
        function IdentityFilteredLineTokens(original, textLength) {
            this._original = original;
            this._textLength = textLength;
        }
        IdentityFilteredLineTokens.prototype.getTokens = function () {
            return EditorCommon.LineTokensBinaryEncoding.inflateArr(this._original.getBinaryEncodedTokensMap(), this._original.getBinaryEncodedTokens());
        };
        IdentityFilteredLineTokens.prototype.getFauxIndentLength = function () {
            return 0;
        };
        IdentityFilteredLineTokens.prototype.getTextLength = function () {
            return this._textLength;
        };
        IdentityFilteredLineTokens.prototype.equals = function (other) {
            if (other instanceof IdentityFilteredLineTokens) {
                var otherFilteredLineTokens = other;
                return this._original.equals(otherFilteredLineTokens._original);
            }
            return false;
        };
        IdentityFilteredLineTokens.prototype.findIndexOfOffset = function (offset) {
            return this._original.findIndexOfOffset(offset);
        };
        return IdentityFilteredLineTokens;
    })();
    exports.IdentityFilteredLineTokens = IdentityFilteredLineTokens;
});
//# sourceMappingURL=filteredLineTokens.js.map