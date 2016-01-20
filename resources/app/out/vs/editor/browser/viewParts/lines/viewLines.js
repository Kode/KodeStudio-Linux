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
define(["require", "exports", 'vs/base/browser/browser', 'vs/base/browser/dom', 'vs/base/common/async', 'vs/editor/browser/viewParts/lines/viewLine', 'vs/editor/browser/view/viewLayer', 'vs/editor/browser/editorBrowser', 'vs/editor/common/editorCommon', 'vs/editor/common/core/range'], function (require, exports, Browser, DomUtils, Schedulers, viewLine_1, viewLayer_1, EditorBrowser, EditorCommon, range_1) {
    var ViewLines = (function (_super) {
        __extends(ViewLines, _super);
        function ViewLines(context, layoutProvider) {
            var _this = this;
            _super.call(this, context);
            this._hasVerticalScroll = false;
            this._hasHorizontalScroll = false;
            this._layoutProvider = layoutProvider;
            this.domNode.className = EditorBrowser.ClassNames.VIEW_LINES;
            // --- width & height
            this._maxLineWidth = 0;
            this._asyncUpdateLineWidths = new Schedulers.RunOnceScheduler(function () {
                _this._updateLineWidths();
            }, 200);
            this._currentVisibleRange = new range_1.Range(1, 1, 1, 1);
            this._bigNumbersDelta = 0;
            this._lastCursorRevealRangeHorizontallyEvent = null;
            this.textRangeRestingSpot = document.createElement('div');
            this.textRangeRestingSpot.className = 'textRangeRestingSpot';
            this._hasVerticalScroll = true;
            this._hasHorizontalScroll = true;
        }
        ViewLines.prototype.dispose = function () {
            this._asyncUpdateLineWidths.dispose();
            this._layoutProvider = null;
            _super.prototype.dispose.call(this);
        };
        // ---- begin view event handlers
        ViewLines.prototype.onConfigurationChanged = function (e) {
            var shouldRender = _super.prototype.onConfigurationChanged.call(this, e);
            if (e.wrappingInfo) {
                this._maxLineWidth = 0;
            }
            return shouldRender;
        };
        ViewLines.prototype.onLayoutChanged = function (layoutInfo) {
            var shouldRender = _super.prototype.onLayoutChanged.call(this, layoutInfo);
            this._maxLineWidth = 0;
            return shouldRender;
        };
        ViewLines.prototype.onModelFlushed = function () {
            var shouldRender = _super.prototype.onModelFlushed.call(this);
            this._maxLineWidth = 0;
            return shouldRender;
        };
        ViewLines.prototype.onScrollWidthChanged = function (scrollWidth) {
            DomUtils.StyleMutator.setWidth(this.domNode, scrollWidth);
            return false;
        };
        ViewLines.prototype.onModelDecorationsChanged = function (e) {
            var shouldRender = _super.prototype.onModelDecorationsChanged.call(this, e);
            for (var i = 0; i < this._lines.length; i++) {
                this._lines[i].onModelDecorationsChanged();
            }
            return shouldRender || true;
        };
        ViewLines.prototype.onCursorRevealRange = function (e) {
            var newScrollTop = this._computeScrollTopToRevealRange(this._layoutProvider.getCurrentViewport(), e.range, e.verticalType);
            if (e.revealHorizontal) {
                this._lastCursorRevealRangeHorizontallyEvent = e;
            }
            this._layoutProvider.setScrollTop(newScrollTop);
            return true;
        };
        ViewLines.prototype.onCursorScrollRequest = function (e) {
            var currentScrollTop = this._layoutProvider.getScrollTop();
            var newScrollTop = currentScrollTop + e.deltaLines * this._context.configuration.editor.lineHeight;
            this._layoutProvider.setScrollTop(newScrollTop);
            return true;
        };
        ViewLines.prototype.onScrollChanged = function (e) {
            this._hasVerticalScroll = this._hasVerticalScroll || e.vertical;
            this._hasHorizontalScroll = this._hasHorizontalScroll || e.horizontal;
            return _super.prototype.onScrollChanged.call(this, e);
        };
        // ---- end view event handlers
        // ----------- HELPERS FOR OTHERS
        ViewLines.prototype.getPositionFromDOMInfo = function (spanNode, offset) {
            var lineNumber = this._getLineNumberFromDOMInfo(spanNode);
            if (lineNumber === -1) {
                // Couldn't find span node
                return null;
            }
            if (lineNumber < 1 || lineNumber > this._context.model.getLineCount()) {
                // lineNumber is outside range
                return null;
            }
            if (this._context.model.getLineMaxColumn(lineNumber) === 1) {
                // Line is empty
                return {
                    lineNumber: lineNumber,
                    column: 1
                };
            }
            var lineIndex = lineNumber - this._rendLineNumberStart;
            if (lineIndex < 0 || lineIndex >= this._lines.length) {
                // Couldn't find line
                return null;
            }
            var column = this._lines[lineIndex].getColumnOfNodeOffset(lineNumber, spanNode, offset);
            var minColumn = this._context.model.getLineMinColumn(lineNumber);
            if (column < minColumn) {
                column = minColumn;
            }
            return {
                lineNumber: lineNumber,
                column: column
            };
        };
        ViewLines.prototype._getLineNumberFromDOMInfo = function (spanNode) {
            while (spanNode && spanNode.nodeType === 1) {
                if (spanNode.className === EditorBrowser.ClassNames.VIEW_LINE) {
                    return parseInt(spanNode.getAttribute('lineNumber'), 10);
                }
                spanNode = spanNode.parentElement;
            }
            return -1;
        };
        ViewLines.prototype.getLineWidth = function (lineNumber) {
            var lineIndex = lineNumber - this._rendLineNumberStart;
            if (lineIndex < 0 || lineIndex >= this._lines.length) {
                return -1;
            }
            return this._lines[lineIndex].getWidth();
        };
        ViewLines.prototype.linesVisibleRangesForRange = function (range, includeNewLines) {
            if (this.shouldRender) {
                // Cannot read from the DOM because it is dirty
                // i.e. the model & the dom are out of sync, so I'd be reading something stale
                return null;
            }
            var originalEndLineNumber = range.endLineNumber;
            range = range_1.Range.intersectRanges(range, this._currentVisibleRange);
            if (!range) {
                return null;
            }
            var visibleRangesForLine, visibleRanges = [], lineNumber, lineIndex, startColumn, endColumn;
            var boundingClientRect = this.domNode.getBoundingClientRect();
            var clientRectDeltaLeft = boundingClientRect.left;
            var currentLineModelLineNumber, nextLineModelLineNumber;
            if (includeNewLines) {
                nextLineModelLineNumber = this._context.model.convertViewPositionToModelPosition(range.startLineNumber, 1).lineNumber;
            }
            for (lineNumber = range.startLineNumber; lineNumber <= range.endLineNumber; lineNumber++) {
                lineIndex = lineNumber - this._rendLineNumberStart;
                if (lineIndex < 0 || lineIndex >= this._lines.length) {
                    continue;
                }
                startColumn = lineNumber === range.startLineNumber ? range.startColumn : 1;
                endColumn = lineNumber === range.endLineNumber ? range.endColumn : this._context.model.getLineMaxColumn(lineNumber);
                visibleRangesForLine = this._lines[lineIndex].getVisibleRangesForRange(startColumn, endColumn, this.textRangeRestingSpot);
                if (!visibleRangesForLine || visibleRangesForLine.length === 0) {
                    continue;
                }
                for (var i = 0, len = visibleRangesForLine.length; i < len; i++) {
                    visibleRangesForLine[i].left = Math.max(0, visibleRangesForLine[i].left - clientRectDeltaLeft);
                }
                if (includeNewLines && lineNumber < originalEndLineNumber) {
                    currentLineModelLineNumber = nextLineModelLineNumber;
                    nextLineModelLineNumber = this._context.model.convertViewPositionToModelPosition(lineNumber + 1, 1).lineNumber;
                    if (currentLineModelLineNumber !== nextLineModelLineNumber) {
                        visibleRangesForLine[visibleRangesForLine.length - 1].width += ViewLines.LINE_FEED_WIDTH;
                    }
                }
                visibleRanges.push(new EditorBrowser.LineVisibleRanges(lineNumber, visibleRangesForLine));
            }
            if (visibleRanges.length === 0) {
                return null;
            }
            return visibleRanges;
        };
        ViewLines.prototype.visibleRangesForRange2 = function (range, deltaTop) {
            if (this.shouldRender) {
                // Cannot read from the DOM because it is dirty
                // i.e. the model & the dom are out of sync, so I'd be reading something stale
                return null;
            }
            range = range_1.Range.intersectRanges(range, this._currentVisibleRange);
            if (!range) {
                return null;
            }
            var result = [];
            var boundingClientRect = this.domNode.getBoundingClientRect();
            var clientRectDeltaLeft = boundingClientRect.left;
            for (var lineNumber = range.startLineNumber; lineNumber <= range.endLineNumber; lineNumber++) {
                var lineIndex = lineNumber - this._rendLineNumberStart;
                if (lineIndex < 0 || lineIndex >= this._lines.length) {
                    continue;
                }
                var startColumn = lineNumber === range.startLineNumber ? range.startColumn : 1;
                var endColumn = lineNumber === range.endLineNumber ? range.endColumn : this._context.model.getLineMaxColumn(lineNumber);
                var visibleRangesForLine = this._lines[lineIndex].getVisibleRangesForRange(startColumn, endColumn, this.textRangeRestingSpot);
                if (!visibleRangesForLine || visibleRangesForLine.length === 0) {
                    continue;
                }
                var adjustedLineNumberVerticalOffset = this._layoutProvider.getVerticalOffsetForLineNumber(lineNumber) - this._bigNumbersDelta + deltaTop;
                for (var i = 0, len = visibleRangesForLine.length; i < len; i++) {
                    result.push(new EditorBrowser.VisibleRange(adjustedLineNumberVerticalOffset, Math.max(0, visibleRangesForLine[i].left - clientRectDeltaLeft), visibleRangesForLine[i].width));
                }
            }
            if (result.length === 0) {
                return null;
            }
            return result;
        };
        // --- implementation
        ViewLines.prototype._createLine = function () {
            return viewLine_1.createLine(this._context);
        };
        ViewLines.prototype._renderAndUpdateLineHeights = function (linesViewportData) {
            _super.prototype._renderLines.call(this, linesViewportData);
            // Update internal current visible range
            this._currentVisibleRange = new range_1.Range(0 + this._rendLineNumberStart, 1, this._lines.length - 1 + this._rendLineNumberStart, this._context.model.getLineMaxColumn(this._lines.length - 1 + this._rendLineNumberStart));
            if (this._lastCursorRevealRangeHorizontallyEvent) {
                var newScrollLeft = this._computeScrollLeftToRevealRange(this._lastCursorRevealRangeHorizontallyEvent.range);
                this._lastCursorRevealRangeHorizontallyEvent = null;
                var isViewportWrapping = this._context.configuration.editor.wrappingInfo.isViewportWrapping;
                if (!isViewportWrapping) {
                    this._ensureMaxLineWidth(newScrollLeft.maxHorizontalOffset);
                }
                this._layoutProvider.setScrollLeft(newScrollLeft.scrollLeft);
            }
        };
        ViewLines.prototype._updateLineWidths = function () {
            var i, localMaxLineWidth = 1, widthInPx;
            // Read line widths
            for (i = 0; i < this._lines.length; i++) {
                widthInPx = this._lines[i].getWidth();
                localMaxLineWidth = Math.max(localMaxLineWidth, widthInPx);
            }
            this._ensureMaxLineWidth(localMaxLineWidth);
        };
        ViewLines.prototype.render = function () {
            var linesViewportData = this._layoutProvider.getLinesViewportData();
            this._bigNumbersDelta = linesViewportData.bigNumbersDelta;
            if (this.shouldRender) {
                this.shouldRender = false;
                this._renderAndUpdateLineHeights(linesViewportData);
                // Update max line width (not so important, it is just so the horizontal scrollbar doesn't get too small)
                this._asyncUpdateLineWidths.schedule();
            }
            if (this._hasVerticalScroll || this._hasHorizontalScroll) {
                if (Browser.canUseTranslate3d) {
                    var transform = 'translate3d(' + -this._layoutProvider.getScrollLeft() + 'px, ' + linesViewportData.visibleRangesDeltaTop + 'px, 0px)';
                    DomUtils.StyleMutator.setTransform(this.domNode.parentNode, transform);
                }
                else {
                    if (this._hasVerticalScroll) {
                        DomUtils.StyleMutator.setTop(this.domNode.parentNode, linesViewportData.visibleRangesDeltaTop);
                    }
                    if (this._hasHorizontalScroll) {
                        DomUtils.StyleMutator.setLeft(this.domNode.parentNode, -this._layoutProvider.getScrollLeft());
                    }
                }
                this._hasVerticalScroll = false;
                this._hasHorizontalScroll = false;
            }
            DomUtils.StyleMutator.setWidth(this.domNode, this._layoutProvider.getScrollWidth());
            DomUtils.StyleMutator.setHeight(this.domNode, Math.min(this._layoutProvider.getTotalHeight(), 1000000));
            linesViewportData.visibleRange = this._currentVisibleRange;
            return linesViewportData;
        };
        // --- width
        ViewLines.prototype._ensureMaxLineWidth = function (lineWidth) {
            if (this._maxLineWidth < lineWidth) {
                this._maxLineWidth = lineWidth;
                this._layoutProvider.onMaxLineWidthChanged(this._maxLineWidth);
            }
        };
        ViewLines.prototype._computeScrollTopToRevealRange = function (viewport, range, verticalType) {
            var viewportStartY = viewport.top, viewportHeight = viewport.height, viewportEndY = viewportStartY + viewportHeight, boxStartY, boxEndY;
            // Have a box that includes one extra line height (for the horizontal scrollbar)
            boxStartY = this._layoutProvider.getVerticalOffsetForLineNumber(range.startLineNumber);
            boxEndY = this._layoutProvider.getVerticalOffsetForLineNumber(range.endLineNumber) + this._layoutProvider.heightInPxForLine(range.endLineNumber);
            if (verticalType === EditorCommon.VerticalRevealType.Simple) {
                // Reveal one line more for the arrow down case, when the last line would be covered by the scrollbar
                boxEndY += this._context.configuration.editor.lineHeight;
            }
            var newScrollTop;
            if (verticalType === EditorCommon.VerticalRevealType.Center || verticalType === EditorCommon.VerticalRevealType.CenterIfOutsideViewport) {
                if (verticalType === EditorCommon.VerticalRevealType.CenterIfOutsideViewport && viewportStartY <= boxStartY && boxEndY <= viewportEndY) {
                    // Box is already in the viewport... do nothing
                    newScrollTop = viewportStartY;
                }
                else {
                    // Box is outside the viewport... center it
                    var boxMiddleY = (boxStartY + boxEndY) / 2;
                    newScrollTop = Math.max(0, boxMiddleY - viewportHeight / 2);
                }
            }
            else {
                newScrollTop = this._computeMinimumScrolling(viewportStartY, viewportEndY, boxStartY, boxEndY);
            }
            return newScrollTop;
        };
        ViewLines.prototype._computeScrollLeftToRevealRange = function (range) {
            var maxHorizontalOffset = 0;
            if (range.startLineNumber !== range.endLineNumber) {
                // Two or more lines? => scroll to base (That's how you see most of the two lines)
                return {
                    scrollLeft: 0,
                    maxHorizontalOffset: maxHorizontalOffset
                };
            }
            var viewport = this._layoutProvider.getCurrentViewport(), viewportStartX = viewport.left, viewportEndX = viewportStartX + viewport.width;
            var visibleRanges = this.visibleRangesForRange2(range, 0), boxStartX = Number.MAX_VALUE, boxEndX = 0;
            if (!visibleRanges) {
                // Unknown
                return {
                    scrollLeft: viewportStartX,
                    maxHorizontalOffset: maxHorizontalOffset
                };
            }
            var i, visibleRange;
            for (i = 0; i < visibleRanges.length; i++) {
                visibleRange = visibleRanges[i];
                if (visibleRange.left < boxStartX) {
                    boxStartX = visibleRange.left;
                }
                if (visibleRange.left + visibleRange.width > boxEndX) {
                    boxEndX = visibleRange.left + visibleRange.width;
                }
            }
            maxHorizontalOffset = boxEndX;
            boxStartX = Math.max(0, boxStartX - ViewLines.HORIZONTAL_EXTRA_PX);
            boxEndX += this._context.configuration.editor.revealHorizontalRightPadding;
            var newScrollLeft = this._computeMinimumScrolling(viewportStartX, viewportEndX, boxStartX, boxEndX);
            return {
                scrollLeft: newScrollLeft,
                maxHorizontalOffset: maxHorizontalOffset
            };
        };
        ViewLines.prototype._computeMinimumScrolling = function (viewportStart, viewportEnd, boxStart, boxEnd) {
            var viewportLength = viewportEnd - viewportStart, boxLength = boxEnd - boxStart;
            if (boxLength < viewportLength) {
                // The box would fit in the viewport
                if (boxStart < viewportStart) {
                    // The box is above the viewport
                    return boxStart;
                }
                else if (boxEnd > viewportEnd) {
                    // The box is below the viewport
                    return Math.max(0, boxEnd - viewportLength);
                }
            }
            else {
                // The box would not fit in the viewport
                // Reveal the beginning of the box
                return boxStart;
            }
            return viewportStart;
        };
        /**
         * Width to extends a line to render the line feed at the end of the line
         */
        ViewLines.LINE_FEED_WIDTH = 10;
        /**
         * Adds this ammount of pixels to the right of lines (no-one wants to type near the edge of the viewport)
         */
        ViewLines.HORIZONTAL_EXTRA_PX = 30;
        return ViewLines;
    })(viewLayer_1.ViewLayer);
    exports.ViewLines = ViewLines;
});
//# sourceMappingURL=viewLines.js.map