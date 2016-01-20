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
define(["require", "exports", 'vs/base/browser/browser', 'vs/base/browser/dom', 'vs/editor/common/viewLayout/viewLineParts', 'vs/editor/browser/editorBrowser', 'vs/editor/common/viewLayout/viewLineRenderer'], function (require, exports, Browser, dom_1, viewLineParts_1, editorBrowser_1, viewLineRenderer_1) {
    var ViewLine = (function () {
        function ViewLine(context) {
            this._context = context;
            this._domNode = null;
            this._isInvalid = true;
            this._isMaybeInvalid = false;
            this._lineParts = null;
            this._charOffsetInPart = [];
            this._lastRenderedPartIndex = 0;
        }
        // --- begin IVisibleLineData
        ViewLine.prototype.getDomNode = function () {
            return this._domNode;
        };
        ViewLine.prototype.setDomNode = function (domNode) {
            this._domNode = domNode;
        };
        ViewLine.prototype.onContentChanged = function () {
            this._isInvalid = true;
        };
        ViewLine.prototype.onLinesInsertedAbove = function () {
            this._isMaybeInvalid = true;
        };
        ViewLine.prototype.onLinesDeletedAbove = function () {
            this._isMaybeInvalid = true;
        };
        ViewLine.prototype.onLineChangedAbove = function () {
            this._isMaybeInvalid = true;
        };
        ViewLine.prototype.onTokensChanged = function () {
            this._isMaybeInvalid = true;
        };
        ViewLine.prototype.onModelDecorationsChanged = function () {
            this._isMaybeInvalid = true;
        };
        ViewLine.prototype.onConfigurationChanged = function (e) {
            this._isInvalid = true;
        };
        ViewLine.prototype.shouldUpdateHTML = function (lineNumber, inlineDecorations) {
            var newLineParts = null;
            if (this._isMaybeInvalid || this._isInvalid) {
                // Compute new line parts only if there is some evidence that something might have changed
                newLineParts = viewLineParts_1.createLineParts(lineNumber, this._context.model.getLineContent(lineNumber), this._context.model.getLineTokens(lineNumber), inlineDecorations, this._context.configuration.editor.renderWhitespace);
            }
            // Decide if isMaybeInvalid flips isInvalid to true
            if (this._isMaybeInvalid) {
                if (!this._isInvalid) {
                    if (!this._lineParts || !this._lineParts.equals(newLineParts)) {
                        this._isInvalid = true;
                    }
                }
                this._isMaybeInvalid = false;
            }
            if (this._isInvalid) {
                this._lineParts = newLineParts;
            }
            return this._isInvalid;
        };
        ViewLine.prototype.getLineOuterHTML = function (out, lineNumber, deltaTop) {
            out.push('<div lineNumber="');
            out.push(lineNumber.toString());
            out.push('" style="top:');
            out.push(deltaTop.toString());
            out.push('px;height:');
            out.push(this._context.configuration.editor.lineHeight.toString());
            out.push('px;" class="');
            out.push(editorBrowser_1.ClassNames.VIEW_LINE);
            out.push('">');
            out.push(this.getLineInnerHTML(lineNumber));
            out.push('</div>');
        };
        ViewLine.prototype.getLineInnerHTML = function (lineNumber) {
            this._isInvalid = false;
            return this._render(lineNumber, this._lineParts).join('');
        };
        ViewLine.prototype.layoutLine = function (lineNumber, deltaTop) {
            var desiredLineNumber = String(lineNumber);
            var currentLineNumber = this._domNode.getAttribute('lineNumber');
            if (currentLineNumber !== desiredLineNumber) {
                this._domNode.setAttribute('lineNumber', desiredLineNumber);
            }
            dom_1.StyleMutator.setTop(this._domNode, deltaTop);
            dom_1.StyleMutator.setHeight(this._domNode, this._context.configuration.editor.lineHeight);
        };
        // --- end IVisibleLineData
        ViewLine.prototype._render = function (lineNumber, lineParts) {
            this._cachedWidth = -1;
            var r = viewLineRenderer_1.renderLine({
                lineContent: this._context.model.getLineContent(lineNumber),
                tabSize: this._context.configuration.getIndentationOptions().tabSize,
                stopRenderingLineAfter: this._context.configuration.editor.stopRenderingLineAfter,
                renderWhitespace: this._context.configuration.editor.renderWhitespace,
                parts: lineParts.getParts()
            });
            this._charOffsetInPart = r.charOffsetInPart;
            this._lastRenderedPartIndex = r.lastRenderedPartIndex;
            return r.output;
        };
        // --- Reading from the DOM methods
        ViewLine.prototype._getReadingTarget = function () {
            return this._domNode.firstChild;
        };
        /**
         * Width of the line in pixels
         */
        ViewLine.prototype.getWidth = function () {
            if (this._cachedWidth === -1) {
                this._cachedWidth = this._getReadingTarget().offsetWidth;
            }
            return this._cachedWidth;
        };
        /**
         * Visible ranges for a model range
         */
        ViewLine.prototype.getVisibleRangesForRange = function (startColumn, endColumn, endNode) {
            var stopRenderingLineAfter = this._context.configuration.editor.stopRenderingLineAfter;
            if (stopRenderingLineAfter !== -1 && startColumn > stopRenderingLineAfter && endColumn > stopRenderingLineAfter) {
                // This range is obviously not visible
                return null;
            }
            if (stopRenderingLineAfter !== -1 && startColumn > stopRenderingLineAfter) {
                startColumn = stopRenderingLineAfter;
            }
            if (stopRenderingLineAfter !== -1 && endColumn > stopRenderingLineAfter) {
                endColumn = stopRenderingLineAfter;
            }
            return this._readVisibleRangesForRange(startColumn, endColumn, endNode);
        };
        ViewLine.prototype._readVisibleRangesForRange = function (startColumn, endColumn, endNode) {
            var result;
            if (startColumn === endColumn) {
                result = this._readRawVisibleRangesForPosition(startColumn, endNode);
            }
            else {
                result = this._readRawVisibleRangesForRange(startColumn, endColumn, endNode);
            }
            if (!result || result.length <= 1) {
                return result;
            }
            result.sort(compareVisibleRanges);
            var output = [];
            var prevRange = result[0];
            for (var i = 1, len = result.length; i < len; i++) {
                var currRange = result[i];
                if (prevRange.left + prevRange.width + 0.3 /* account for browser's rounding errors*/ >= currRange.left) {
                    prevRange.width = Math.max(prevRange.width, currRange.left + currRange.width - prevRange.left);
                }
                else {
                    output.push(prevRange);
                    prevRange = currRange;
                }
            }
            output.push(prevRange);
            return output;
        };
        ViewLine.prototype._readRawVisibleRangesForPosition = function (column, endNode) {
            if (this._charOffsetInPart.length === 0) {
                // This line is empty
                return [new editorBrowser_1.HorizontalRange(0, 0)];
            }
            var partIndex = findIndexInArrayWithMax(this._lineParts, column - 1, this._lastRenderedPartIndex);
            var charOffsetInPart = this._charOffsetInPart[column - 1];
            return this._readRawVisibleRangesFrom(this._getReadingTarget(), partIndex, charOffsetInPart, partIndex, charOffsetInPart, endNode);
        };
        ViewLine.prototype._readRawVisibleRangesForRange = function (startColumn, endColumn, endNode) {
            if (startColumn === 1 && endColumn === this._charOffsetInPart.length) {
                // This branch helps IE with bidi text & gives a performance boost to other browsers when reading visible ranges for an entire line
                return [this._readRawVisibleRangeForEntireLine()];
            }
            var startPartIndex = findIndexInArrayWithMax(this._lineParts, startColumn - 1, this._lastRenderedPartIndex);
            var startCharOffsetInPart = this._charOffsetInPart[startColumn - 1];
            var endPartIndex = findIndexInArrayWithMax(this._lineParts, endColumn - 1, this._lastRenderedPartIndex);
            var endCharOffsetInPart = this._charOffsetInPart[endColumn - 1];
            return this._readRawVisibleRangesFrom(this._getReadingTarget(), startPartIndex, startCharOffsetInPart, endPartIndex, endCharOffsetInPart, endNode);
        };
        ViewLine.prototype._readRawVisibleRangeForEntireLine = function () {
            return new editorBrowser_1.HorizontalRange(0, this._getReadingTarget().offsetWidth);
        };
        ViewLine.prototype._readRawVisibleRangesFrom = function (domNode, startChildIndex, startOffset, endChildIndex, endOffset, endNode) {
            var range = RangeUtil.createRange();
            try {
                // Panic check
                var min = 0;
                var max = domNode.children.length - 1;
                if (min > max) {
                    return null;
                }
                startChildIndex = Math.min(max, Math.max(min, startChildIndex));
                endChildIndex = Math.min(max, Math.max(min, endChildIndex));
                // If crossing over to a span only to select offset 0, then use the previous span's maximum offset
                // Chrome is buggy and doesn't handle 0 offsets well sometimes.
                if (startChildIndex !== endChildIndex) {
                    if (endChildIndex > 0 && endOffset === 0) {
                        endChildIndex--;
                        endOffset = Number.MAX_VALUE;
                    }
                }
                var startElement = domNode.children[startChildIndex].firstChild;
                var endElement = domNode.children[endChildIndex].firstChild;
                if (!startElement || !endElement) {
                    return null;
                }
                startOffset = Math.min(startElement.textContent.length, Math.max(0, startOffset));
                endOffset = Math.min(endElement.textContent.length, Math.max(0, endOffset));
                range.setStart(startElement, startOffset);
                range.setEnd(endElement, endOffset);
                var clientRects = range.getClientRects();
                if (clientRects.length === 0) {
                    return null;
                }
                return this._createRawVisibleRangesFromClientRects(clientRects);
            }
            catch (e) {
                // This is life ...
                return null;
            }
            finally {
                RangeUtil.detachRange(range, endNode);
            }
        };
        ViewLine.prototype._createRawVisibleRangesFromClientRects = function (clientRects) {
            var result = [];
            for (var i = 0, len = clientRects.length; i < len; i++) {
                var cR = clientRects[i];
                result.push(new editorBrowser_1.HorizontalRange(cR.left, cR.width));
            }
            return result;
        };
        /**
         * Returns the column for the text found at a specific offset inside a rendered dom node
         */
        ViewLine.prototype.getColumnOfNodeOffset = function (lineNumber, spanNode, offset) {
            var spanIndex = -1;
            while (spanNode) {
                spanNode = spanNode.previousSibling;
                spanIndex++;
            }
            var lineParts = this._lineParts.getParts();
            if (spanIndex >= lineParts.length) {
                return this._context.configuration.editor.stopRenderingLineAfter;
            }
            if (offset === 0) {
                return lineParts[spanIndex].startIndex + 1;
            }
            var originalMin = lineParts[spanIndex].startIndex;
            var originalMax;
            var originalMaxStartOffset;
            if (spanIndex + 1 < lineParts.length) {
                // Stop searching characters at the beginning of the next part
                originalMax = lineParts[spanIndex + 1].startIndex;
                originalMaxStartOffset = this._charOffsetInPart[originalMax - 1] + this._charOffsetInPart[originalMax];
            }
            else {
                originalMax = this._context.model.getLineMaxColumn(lineNumber) - 1;
                originalMaxStartOffset = this._charOffsetInPart[originalMax];
            }
            var min = originalMin;
            var max = originalMax;
            if (this._context.configuration.editor.stopRenderingLineAfter !== -1) {
                max = Math.min(this._context.configuration.editor.stopRenderingLineAfter - 1, originalMax);
            }
            var nextStartOffset;
            var prevStartOffset;
            // Here are the variables and their relation plotted on an axis
            // prevStartOffset    a    midStartOffset    b    nextStartOffset
            // ------|------------|----------|-----------|-----------|--------->
            // Everything in (a;b] will match mid
            while (min < max) {
                var mid = Math.floor((min + max) / 2);
                var midStartOffset = this._charOffsetInPart[mid];
                if (mid === originalMax) {
                    // Using Number.MAX_VALUE to ensure that any offset after midStartOffset will match mid
                    nextStartOffset = Number.MAX_VALUE;
                }
                else if (mid + 1 === originalMax) {
                    // mid + 1 is already in next part and might have the _charOffsetInPart = 0
                    nextStartOffset = originalMaxStartOffset;
                }
                else {
                    nextStartOffset = this._charOffsetInPart[mid + 1];
                }
                if (mid === originalMin) {
                    // Using Number.MIN_VALUE to ensure that any offset before midStartOffset will match mid
                    prevStartOffset = Number.MIN_VALUE;
                }
                else {
                    prevStartOffset = this._charOffsetInPart[mid - 1];
                }
                var a = (prevStartOffset + midStartOffset) / 2;
                var b = (midStartOffset + nextStartOffset) / 2;
                if (a < offset && offset <= b) {
                    // Hit!
                    return mid + 1;
                }
                if (offset <= a) {
                    max = mid - 1;
                }
                else {
                    min = mid + 1;
                }
            }
            return min + 1;
        };
        return ViewLine;
    })();
    exports.ViewLine = ViewLine;
    var IEViewLine = (function (_super) {
        __extends(IEViewLine, _super);
        function IEViewLine(context) {
            _super.call(this, context);
        }
        IEViewLine.prototype._createRawVisibleRangesFromClientRects = function (clientRects) {
            var ratioX = screen.logicalXDPI / screen.deviceXDPI;
            var result = [];
            for (var i = 0, len = clientRects.length; i < len; i++) {
                var cR = clientRects[i];
                result[i] = new editorBrowser_1.HorizontalRange(cR.left * ratioX, cR.width * ratioX);
            }
            return result;
        };
        return IEViewLine;
    })(ViewLine);
    var WebKitViewLine = (function (_super) {
        __extends(WebKitViewLine, _super);
        function WebKitViewLine(context) {
            _super.call(this, context);
        }
        WebKitViewLine.prototype._readVisibleRangesForRange = function (startColumn, endColumn, endNode) {
            var output = _super.prototype._readVisibleRangesForRange.call(this, startColumn, endColumn, endNode);
            if (this._context.configuration.editor.fontLigatures && endColumn > 1 && startColumn === endColumn && endColumn === this._charOffsetInPart.length) {
                if (output.length === 1) {
                    var lastSpanBoundingClientRect = this._getReadingTarget().lastChild.getBoundingClientRect();
                    output[0].left = lastSpanBoundingClientRect.right;
                }
            }
            if (!output || output.length === 0 || startColumn === endColumn || (startColumn === 1 && endColumn === this._charOffsetInPart.length)) {
                return output;
            }
            // WebKit is buggy and returns an expanded range (to contain words in some cases)
            // The last client rect is enlarged (I think)
            // This is an attempt to patch things up
            // Find position of previous column
            var beforeEndVisibleRanges = this._readRawVisibleRangesForPosition(endColumn - 1, endNode);
            // Find position of last column
            var endVisibleRanges = this._readRawVisibleRangesForPosition(endColumn, endNode);
            if (beforeEndVisibleRanges && beforeEndVisibleRanges.length > 0 && endVisibleRanges && endVisibleRanges.length > 0) {
                var beforeEndVisibleRange = beforeEndVisibleRanges[0];
                var endVisibleRange = endVisibleRanges[0];
                var isLTR = (beforeEndVisibleRange.left <= endVisibleRange.left);
                var lastRange = output[output.length - 1];
                if (isLTR && lastRange.left < endVisibleRange.left) {
                    // Trim down the width of the last visible range to not go after the last column's position
                    lastRange.width = endVisibleRange.left - lastRange.left;
                }
            }
            return output;
        };
        return WebKitViewLine;
    })(ViewLine);
    var RangeUtil = (function () {
        function RangeUtil() {
        }
        RangeUtil.createRange = function () {
            if (!RangeUtil._handyReadyRange) {
                RangeUtil._handyReadyRange = document.createRange();
            }
            return RangeUtil._handyReadyRange;
        };
        RangeUtil.detachRange = function (range, endNode) {
            // Move range out of the span node, IE doesn't like having many ranges in
            // the same spot and will act badly for lines containing dashes ('-')
            range.selectNodeContents(endNode);
        };
        return RangeUtil;
    })();
    function compareVisibleRanges(a, b) {
        return a.left - b.left;
    }
    function findIndexInArrayWithMax(lineParts, desiredIndex, maxResult) {
        var r = lineParts.findIndexOfOffset(desiredIndex);
        return r <= maxResult ? r : maxResult;
    }
    exports.createLine = (function () {
        if (window.screen && window.screen.deviceXDPI && (navigator.userAgent.indexOf('Trident/6.0') >= 0 || navigator.userAgent.indexOf('Trident/5.0') >= 0)) {
            // IE11 doesn't need the screen.logicalXDPI / screen.deviceXDPI ratio multiplication
            // for TextRange.getClientRects() anymore
            return createIELine;
        }
        else if (Browser.isWebKit) {
            return createWebKitLine;
        }
        return createNormalLine;
    })();
    function createIELine(context) {
        return new IEViewLine(context);
    }
    function createWebKitLine(context) {
        return new WebKitViewLine(context);
    }
    function createNormalLine(context) {
        return new ViewLine(context);
    }
});
//# sourceMappingURL=viewLine.js.map