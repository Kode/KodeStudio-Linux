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
define(["require", "exports", 'vs/editor/common/viewModel/viewEventHandler', 'vs/css!./decorations'], function (require, exports, viewEventHandler_1) {
    var DecorationsOverlay = (function (_super) {
        __extends(DecorationsOverlay, _super);
        function DecorationsOverlay(context) {
            _super.call(this);
            this._context = context;
            this._renderResult = null;
            this._context.addEventHandler(this);
        }
        DecorationsOverlay.prototype.dispose = function () {
            this._context.removeEventHandler(this);
            this._context = null;
            this._renderResult = null;
        };
        // --- begin event handlers
        DecorationsOverlay.prototype.onModelFlushed = function () {
            return true;
        };
        DecorationsOverlay.prototype.onModelDecorationsChanged = function (e) {
            return true;
        };
        DecorationsOverlay.prototype.onModelLinesDeleted = function (e) {
            return true;
        };
        DecorationsOverlay.prototype.onModelLineChanged = function (e) {
            return true;
        };
        DecorationsOverlay.prototype.onModelLinesInserted = function (e) {
            return true;
        };
        DecorationsOverlay.prototype.onCursorPositionChanged = function (e) {
            return false;
        };
        DecorationsOverlay.prototype.onCursorSelectionChanged = function (e) {
            return false;
        };
        DecorationsOverlay.prototype.onCursorRevealRange = function (e) {
            return false;
        };
        DecorationsOverlay.prototype.onConfigurationChanged = function (e) {
            return true;
        };
        DecorationsOverlay.prototype.onLayoutChanged = function (layoutInfo) {
            return true;
        };
        DecorationsOverlay.prototype.onScrollChanged = function (e) {
            return e.vertical;
        };
        DecorationsOverlay.prototype.onZonesChanged = function () {
            return true;
        };
        DecorationsOverlay.prototype.onScrollWidthChanged = function (scrollWidth) {
            return true;
        };
        DecorationsOverlay.prototype.onScrollHeightChanged = function (scrollHeight) {
            return false;
        };
        // --- end event handlers
        DecorationsOverlay.prototype.shouldCallRender2 = function (ctx) {
            if (!this.shouldRender) {
                return false;
            }
            this.shouldRender = false;
            var output = {}, lineOutput, decorations = ctx.getDecorationsInViewport(), d, rng, linesVisibleRanges, lineVisibleRanges, visibleRange, lineHeight = this._context.configuration.editor.lineHeight.toString(), i, lenI, j, lenJ, k, lenK, piecesCount = 0;
            for (i = 0, lenI = decorations.length; i < lenI; i++) {
                d = decorations[i];
                rng = d.range;
                if (!d.options.className) {
                    continue;
                }
                if (d.options.isWholeLine) {
                    for (j = rng.startLineNumber; j <= rng.endLineNumber; j++) {
                        if (!ctx.lineIsVisible(j)) {
                            continue;
                        }
                        if (output.hasOwnProperty(j.toString())) {
                            lineOutput = output[j.toString()];
                        }
                        else {
                            lineOutput = [];
                            output[j.toString()] = lineOutput;
                        }
                        piecesCount++;
                        lineOutput.push('<div class="cdr ');
                        lineOutput.push(d.options.className);
                        lineOutput.push('" style="left:0;width:100%;height:');
                        lineOutput.push(lineHeight.toString());
                        lineOutput.push('px;"></div>');
                    }
                }
                else {
                    linesVisibleRanges = ctx.linesVisibleRangesForRange(rng, false);
                    if (linesVisibleRanges) {
                        for (j = 0, lenJ = linesVisibleRanges.length; j < lenJ; j++) {
                            lineVisibleRanges = linesVisibleRanges[j];
                            if (output.hasOwnProperty(lineVisibleRanges.lineNumber.toString())) {
                                lineOutput = output[lineVisibleRanges.lineNumber.toString()];
                            }
                            else {
                                lineOutput = [];
                                output[lineVisibleRanges.lineNumber.toString()] = lineOutput;
                            }
                            for (k = 0, lenK = lineVisibleRanges.ranges.length; k < lenK; k++) {
                                visibleRange = lineVisibleRanges.ranges[k];
                                piecesCount++;
                                lineOutput.push('<div class="cdr ');
                                lineOutput.push(d.options.className);
                                lineOutput.push('" style="left:');
                                lineOutput.push(visibleRange.left.toString());
                                lineOutput.push('px;width:');
                                lineOutput.push(visibleRange.width.toString());
                                lineOutput.push('px;height:');
                                lineOutput.push(lineHeight.toString());
                                lineOutput.push('px;"></div>');
                            }
                        }
                    }
                }
            }
            this._renderResult = output;
            return true;
        };
        DecorationsOverlay.prototype.render2 = function (lineNumber) {
            if (this._renderResult && this._renderResult.hasOwnProperty(lineNumber.toString())) {
                return this._renderResult[lineNumber.toString()];
            }
            return null;
        };
        return DecorationsOverlay;
    })(viewEventHandler_1.ViewEventHandler);
    exports.DecorationsOverlay = DecorationsOverlay;
});
//# sourceMappingURL=decorations.js.map