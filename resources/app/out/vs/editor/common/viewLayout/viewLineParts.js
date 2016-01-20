/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/strings', 'vs/editor/common/core/arrays'], function (require, exports, Strings, arrays_1) {
    function createLineParts(lineNumber, lineContent, lineTokens, rawLineDecorations, renderWhitespace) {
        if (renderWhitespace) {
            rawLineDecorations = insertWhitespace(lineNumber, lineContent, lineTokens.getFauxIndentLength(), rawLineDecorations);
        }
        if (rawLineDecorations.length > 0) {
            return new ViewLineParts(lineNumber, lineTokens, lineContent, rawLineDecorations);
        }
        else {
            return new FastViewLineParts(lineTokens, lineContent);
        }
    }
    exports.createLineParts = createLineParts;
    function trimEmptyTrailingPart(parts, lineContent) {
        if (parts.length <= 1) {
            return parts;
        }
        var lastPartStartIndex = parts[parts.length - 1].startIndex;
        if (lastPartStartIndex < lineContent.length) {
            // All is good
            return parts;
        }
        // Remove last line part
        return parts.slice(0, parts.length - 1);
    }
    function insertWhitespace(lineNumber, lineContent, fauxIndentLength, rawLineDecorations) {
        if (lineContent.length === 0) {
            return rawLineDecorations;
        }
        var prepend = null, append = null, computeTrailing = true;
        var firstNonWhitespaceIndex = Strings.firstNonWhitespaceIndex(lineContent);
        if (firstNonWhitespaceIndex !== 0) {
            // There is leading whitespace
            if (firstNonWhitespaceIndex === -1) {
                // The entire string is whitespace
                computeTrailing = false;
                prepend = {
                    startLineNumber: lineNumber,
                    endLineNumber: lineNumber,
                    startColumn: 1,
                    endColumn: lineContent.length + 1
                };
            }
            else {
                prepend = {
                    startLineNumber: lineNumber,
                    endLineNumber: lineNumber,
                    startColumn: 1,
                    endColumn: firstNonWhitespaceIndex + 1
                };
            }
        }
        // Adjust prepend to `fauxIndentLength`
        if (prepend) {
            if (fauxIndentLength + 1 >= prepend.endColumn) {
                prepend = null;
            }
            else {
                prepend.startColumn = fauxIndentLength + 1;
            }
        }
        if (computeTrailing) {
            var lastNonWhitespaceIndex = Strings.lastNonWhitespaceIndex(lineContent);
            if (lastNonWhitespaceIndex !== lineContent.length - 1) {
                // There is trailing whitespace
                // No need to handle the case that the entire string is empty, since it is handled above
                append = {
                    startLineNumber: lineNumber,
                    endLineNumber: lineNumber,
                    startColumn: lastNonWhitespaceIndex + 2,
                    endColumn: lineContent.length + 1
                };
            }
        }
        if (prepend || append) {
            var result = rawLineDecorations.slice(0);
            if (prepend) {
                result.unshift({
                    options: {
                        inlineClassName: 'leading whitespace'
                    },
                    range: prepend
                });
            }
            if (append) {
                result.push({
                    options: {
                        inlineClassName: 'trailing whitespace'
                    },
                    range: append
                });
            }
            return result;
        }
        return rawLineDecorations;
    }
    var FastViewLineParts = (function () {
        function FastViewLineParts(lineTokens, lineContent) {
            this.lineTokens = lineTokens;
            this.parts = lineTokens.getTokens();
            this.parts = trimEmptyTrailingPart(this.parts, lineContent);
        }
        FastViewLineParts.prototype.getParts = function () {
            return this.parts;
        };
        FastViewLineParts.prototype.equals = function (other) {
            if (other instanceof FastViewLineParts) {
                var otherFastLineParts = other;
                return this.lineTokens.equals(otherFastLineParts.lineTokens);
            }
            return false;
        };
        FastViewLineParts.prototype.findIndexOfOffset = function (offset) {
            return arrays_1.Arrays.findIndexInSegmentsArray(this.parts, offset);
        };
        return FastViewLineParts;
    })();
    exports.FastViewLineParts = FastViewLineParts;
    var ViewLineParts = (function () {
        function ViewLineParts(lineNumber, lineTokens, lineContent, rawLineDecorations) {
            // lineDecorations might overlap on top of each other, so they need to be normalized
            var lineDecorations = LineDecorationsNormalizer.normalize(lineNumber, rawLineDecorations), lineDecorationsIndex = 0, lineDecorationsLength = lineDecorations.length;
            var actualLineTokens = lineTokens.getTokens(), nextStartOffset, currentTokenEndOffset, currentTokenClassName;
            var parts = [];
            for (var i = 0, len = actualLineTokens.length; i < len; i++) {
                nextStartOffset = actualLineTokens[i].startIndex;
                currentTokenEndOffset = (i + 1 < len ? actualLineTokens[i + 1].startIndex : lineTokens.getTextLength());
                currentTokenClassName = actualLineTokens[i].type;
                while (lineDecorationsIndex < lineDecorationsLength && lineDecorations[lineDecorationsIndex].startOffset < currentTokenEndOffset) {
                    if (lineDecorations[lineDecorationsIndex].startOffset > nextStartOffset) {
                        // the first decorations starts after the token
                        parts.push(new LinePart(nextStartOffset, currentTokenClassName));
                        nextStartOffset = lineDecorations[lineDecorationsIndex].startOffset;
                    }
                    parts.push(new LinePart(nextStartOffset, currentTokenClassName + ' ' + lineDecorations[lineDecorationsIndex].className));
                    if (lineDecorations[lineDecorationsIndex].endOffset >= currentTokenEndOffset) {
                        // this decoration goes on to the next token
                        nextStartOffset = currentTokenEndOffset;
                        break;
                    }
                    else {
                        // this decorations stops inside this token
                        nextStartOffset = lineDecorations[lineDecorationsIndex].endOffset + 1;
                        lineDecorationsIndex++;
                    }
                }
                if (nextStartOffset < currentTokenEndOffset) {
                    parts.push(new LinePart(nextStartOffset, currentTokenClassName));
                }
            }
            this.parts = parts;
            this.lastPartIndex = parts.length - 1;
            this.lastEndOffset = currentTokenEndOffset;
        }
        ViewLineParts.prototype.getParts = function () {
            return this.parts;
        };
        ViewLineParts.prototype.equals = function (other) {
            if (other instanceof ViewLineParts) {
                var otherSimpleLineParts = other;
                if (this.lastPartIndex !== otherSimpleLineParts.lastPartIndex) {
                    return false;
                }
                if (this.lastEndOffset !== otherSimpleLineParts.lastEndOffset) {
                    return false;
                }
                for (var i = 0, len = this.parts.length; i < len; i++) {
                    if (this.parts[i].startIndex !== otherSimpleLineParts.parts[i].startIndex) {
                        return false;
                    }
                    if (this.parts[i].type !== otherSimpleLineParts.parts[i].type) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        };
        ViewLineParts.prototype.findIndexOfOffset = function (offset) {
            return arrays_1.Arrays.findIndexInSegmentsArray(this.parts, offset);
        };
        return ViewLineParts;
    })();
    exports.ViewLineParts = ViewLineParts;
    var LinePart = (function () {
        function LinePart(startIndex, type) {
            this.startIndex = startIndex;
            this.type = type;
        }
        return LinePart;
    })();
    var DecorationSegment = (function () {
        function DecorationSegment(startOffset, endOffset, className) {
            this.startOffset = startOffset;
            this.endOffset = endOffset;
            this.className = className;
        }
        return DecorationSegment;
    })();
    exports.DecorationSegment = DecorationSegment;
    var Stack = (function () {
        function Stack() {
            this.stopOffsets = [];
            this.classNames = [];
            this.count = 0;
        }
        Stack.prototype.consumeLowerThan = function (maxStopOffset, nextStartOffset, result) {
            while (this.count > 0 && this.stopOffsets[0] < maxStopOffset) {
                var i = 0;
                // Take all equal stopping offsets
                while (i + 1 < this.count && this.stopOffsets[i] === this.stopOffsets[i + 1]) {
                    i++;
                }
                // Basically we are consuming the first i + 1 elements of the stack
                result.push(new DecorationSegment(nextStartOffset, this.stopOffsets[i], this.classNames.join(' ')));
                nextStartOffset = this.stopOffsets[i] + 1;
                // Consume them
                this.stopOffsets.splice(0, i + 1);
                this.classNames.splice(0, i + 1);
                this.count -= (i + 1);
            }
            if (this.count > 0 && nextStartOffset < maxStopOffset) {
                result.push(new DecorationSegment(nextStartOffset, maxStopOffset - 1, this.classNames.join(' ')));
                nextStartOffset = maxStopOffset;
            }
            return nextStartOffset;
        };
        Stack.prototype.insert = function (stopOffset, className) {
            if (this.count === 0 || this.stopOffsets[this.count - 1] <= stopOffset) {
                // Insert at the end
                this.stopOffsets.push(stopOffset);
                this.classNames.push(className);
            }
            else {
                // Find the insertion position for `stopOffset`
                for (var i = 0; i < this.count; i++) {
                    if (this.stopOffsets[i] >= stopOffset) {
                        this.stopOffsets.splice(i, 0, stopOffset);
                        this.classNames.splice(i, 0, className);
                        break;
                    }
                }
            }
            this.count++;
            return;
        };
        return Stack;
    })();
    var LineDecorationsNormalizer = (function () {
        function LineDecorationsNormalizer() {
        }
        /**
         * Normalize line decorations. Overlapping decorations will generate multiple segments
         */
        LineDecorationsNormalizer.normalize = function (lineNumber, lineDecorations) {
            var result = [];
            if (lineDecorations.length === 0) {
                return result;
            }
            var stack = new Stack(), nextStartOffset = 0, d, currentStartOffset, currentEndOffset, i, len;
            for (i = 0, len = lineDecorations.length; i < len; i++) {
                d = lineDecorations[i];
                if (d.range.endLineNumber < lineNumber || d.range.startLineNumber > lineNumber) {
                    // Ignore decorations that sit outside this line
                    continue;
                }
                if (d.range.startLineNumber === d.range.endLineNumber && d.range.startColumn === d.range.endColumn) {
                    // Ignore empty range decorations
                    continue;
                }
                currentStartOffset = (d.range.startLineNumber === lineNumber ? d.range.startColumn - 1 : 0);
                currentEndOffset = (d.range.endLineNumber === lineNumber ? d.range.endColumn - 2 : LineDecorationsNormalizer.MAX_LINE_LENGTH - 1);
                if (currentEndOffset < 0) {
                    // An empty decoration (endColumn === 1)
                    continue;
                }
                nextStartOffset = stack.consumeLowerThan(currentStartOffset, nextStartOffset, result);
                if (stack.count === 0) {
                    nextStartOffset = currentStartOffset;
                }
                stack.insert(currentEndOffset, d.options.inlineClassName);
            }
            stack.consumeLowerThan(LineDecorationsNormalizer.MAX_LINE_LENGTH, nextStartOffset, result);
            return result;
        };
        /**
         * A number that is guaranteed to be larger than the maximum line column
         */
        LineDecorationsNormalizer.MAX_LINE_LENGTH = 10000000;
        return LineDecorationsNormalizer;
    })();
    exports.LineDecorationsNormalizer = LineDecorationsNormalizer;
});
//# sourceMappingURL=viewLineParts.js.map