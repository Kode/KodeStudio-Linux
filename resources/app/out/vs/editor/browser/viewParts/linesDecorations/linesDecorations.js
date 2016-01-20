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
define(["require", "exports", 'vs/editor/common/viewModel/viewEventHandler', 'vs/css!./linesDecorations'], function (require, exports, viewEventHandler_1) {
    var LinesDecorationsOverlay = (function (_super) {
        __extends(LinesDecorationsOverlay, _super);
        function LinesDecorationsOverlay(context) {
            _super.call(this);
            this._context = context;
            this._decorationsLeft = 0;
            this._decorationsWidth = 0;
            this._renderResult = null;
            this._context.addEventHandler(this);
        }
        LinesDecorationsOverlay.prototype.dispose = function () {
            this._context.removeEventHandler(this);
            this._context = null;
            this._renderResult = null;
        };
        // --- begin event handlers
        LinesDecorationsOverlay.prototype.onModelFlushed = function () {
            return true;
        };
        LinesDecorationsOverlay.prototype.onModelDecorationsChanged = function (e) {
            return true;
        };
        LinesDecorationsOverlay.prototype.onModelLinesDeleted = function (e) {
            return true;
        };
        LinesDecorationsOverlay.prototype.onModelLineChanged = function (e) {
            return true;
        };
        LinesDecorationsOverlay.prototype.onModelLinesInserted = function (e) {
            return true;
        };
        LinesDecorationsOverlay.prototype.onCursorPositionChanged = function (e) {
            return false;
        };
        LinesDecorationsOverlay.prototype.onCursorSelectionChanged = function (e) {
            return false;
        };
        LinesDecorationsOverlay.prototype.onCursorRevealRange = function (e) {
            return false;
        };
        LinesDecorationsOverlay.prototype.onConfigurationChanged = function (e) {
            return true;
        };
        LinesDecorationsOverlay.prototype.onLayoutChanged = function (layoutInfo) {
            this._decorationsLeft = layoutInfo.decorationsLeft;
            this._decorationsWidth = layoutInfo.decorationsWidth;
            return true;
        };
        LinesDecorationsOverlay.prototype.onScrollChanged = function (e) {
            return e.vertical;
        };
        LinesDecorationsOverlay.prototype.onZonesChanged = function () {
            return true;
        };
        LinesDecorationsOverlay.prototype.onScrollWidthChanged = function (scrollWidth) {
            return false;
        };
        LinesDecorationsOverlay.prototype.onScrollHeightChanged = function (scrollHeight) {
            return false;
        };
        // --- end event handlers
        LinesDecorationsOverlay.prototype.shouldCallRender2 = function (ctx) {
            if (!this.shouldRender) {
                return false;
            }
            this.shouldRender = false;
            var output = {};
            var renderedCount = 0;
            var decorations = ctx.getDecorationsInViewport(), lineHeight = this._context.configuration.editor.lineHeight.toString(), d, rng, i, lenI, classNames = {}, lineClassNames, className, lineOutput, lineNumber, lineNumberStr;
            ;
            for (i = 0, lenI = decorations.length; i < lenI; i++) {
                d = decorations[i];
                if (!d.options.linesDecorationsClassName) {
                    continue;
                }
                rng = d.range;
                for (lineNumber = rng.startLineNumber; lineNumber <= rng.endLineNumber; lineNumber++) {
                    if (!ctx.lineIsVisible(lineNumber)) {
                        continue;
                    }
                    lineNumberStr = lineNumber.toString();
                    //					oldTop = ctx.getViewportVerticalOffsetForLineNumber(j);
                    if (!classNames.hasOwnProperty(lineNumberStr)) {
                        classNames[lineNumberStr] = {};
                    }
                    classNames[lineNumberStr][d.options.linesDecorationsClassName] = true;
                }
            }
            var left = this._decorationsLeft.toString(), width = this._decorationsWidth.toString();
            var common = '" style="left:' + left + 'px;width:' + width + 'px' + ';height:' + lineHeight + 'px;"></div>';
            for (lineNumberStr in classNames) {
                lineClassNames = classNames[lineNumberStr];
                lineOutput = [];
                lineOutput.push('<div class="cldr');
                for (className in lineClassNames) {
                    // Count one more glyph
                    renderedCount++;
                    lineOutput.push(' ');
                    lineOutput.push(className);
                }
                lineOutput.push(common);
                output[lineNumberStr] = lineOutput;
            }
            this._renderResult = output;
            return true;
        };
        LinesDecorationsOverlay.prototype.render2 = function (lineNumber) {
            if (this._renderResult && this._renderResult.hasOwnProperty(lineNumber.toString())) {
                return this._renderResult[lineNumber.toString()];
            }
            return null;
        };
        return LinesDecorationsOverlay;
    })(viewEventHandler_1.ViewEventHandler);
    exports.LinesDecorationsOverlay = LinesDecorationsOverlay;
});
//# sourceMappingURL=linesDecorations.js.map