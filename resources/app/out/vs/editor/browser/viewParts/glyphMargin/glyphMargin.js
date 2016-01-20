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
define(["require", "exports", 'vs/editor/common/viewModel/viewEventHandler', 'vs/css!./glyphMargin'], function (require, exports, viewEventHandler_1) {
    var GlyphMarginOverlay = (function (_super) {
        __extends(GlyphMarginOverlay, _super);
        function GlyphMarginOverlay(context) {
            _super.call(this);
            this._context = context;
            this._glyphMarginLeft = 0;
            this._glyphMarginWidth = 0;
            this._renderResult = null;
            this._context.addEventHandler(this);
        }
        GlyphMarginOverlay.prototype.dispose = function () {
            this._context.removeEventHandler(this);
            this._context = null;
            this._renderResult = null;
        };
        // --- begin event handlers
        GlyphMarginOverlay.prototype.onModelFlushed = function () {
            return true;
        };
        GlyphMarginOverlay.prototype.onModelDecorationsChanged = function (e) {
            return true;
        };
        GlyphMarginOverlay.prototype.onModelLinesDeleted = function (e) {
            return true;
        };
        GlyphMarginOverlay.prototype.onModelLineChanged = function (e) {
            return true;
        };
        GlyphMarginOverlay.prototype.onModelLinesInserted = function (e) {
            return true;
        };
        GlyphMarginOverlay.prototype.onCursorPositionChanged = function (e) {
            return false;
        };
        GlyphMarginOverlay.prototype.onCursorSelectionChanged = function (e) {
            return false;
        };
        GlyphMarginOverlay.prototype.onCursorRevealRange = function (e) {
            return false;
        };
        GlyphMarginOverlay.prototype.onConfigurationChanged = function (e) {
            return true;
        };
        GlyphMarginOverlay.prototype.onLayoutChanged = function (layoutInfo) {
            this._glyphMarginLeft = layoutInfo.glyphMarginLeft;
            this._glyphMarginWidth = layoutInfo.glyphMarginWidth;
            return true;
        };
        GlyphMarginOverlay.prototype.onScrollChanged = function (e) {
            return e.vertical;
        };
        GlyphMarginOverlay.prototype.onZonesChanged = function () {
            return true;
        };
        GlyphMarginOverlay.prototype.onScrollWidthChanged = function (scrollWidth) {
            return false;
        };
        GlyphMarginOverlay.prototype.onScrollHeightChanged = function (scrollHeight) {
            return false;
        };
        // --- end event handlers
        GlyphMarginOverlay.prototype.shouldCallRender2 = function (ctx) {
            if (!this.shouldRender) {
                return false;
            }
            this.shouldRender = false;
            if (!this._context.configuration.editor.glyphMargin) {
                this._renderResult = null;
                return false;
            }
            var output = {};
            var count = 0;
            var decorations = ctx.getDecorationsInViewport(), lineHeight = this._context.configuration.editor.lineHeight.toString(), d, rng, i, lenI, classNames = {}, lineClassNames, className, lineOutput, lineNumber, lineNumberStr;
            for (i = 0, lenI = decorations.length; i < lenI; i++) {
                d = decorations[i];
                if (!d.options.glyphMarginClassName) {
                    continue;
                }
                rng = d.range;
                for (lineNumber = rng.startLineNumber; lineNumber <= rng.endLineNumber; lineNumber++) {
                    if (!ctx.lineIsVisible(lineNumber)) {
                        continue;
                    }
                    lineNumberStr = lineNumber.toString();
                    if (!classNames.hasOwnProperty(lineNumberStr)) {
                        classNames[lineNumberStr] = {};
                    }
                    classNames[lineNumberStr][d.options.glyphMarginClassName] = true;
                }
            }
            var left = this._glyphMarginLeft.toString(), width = this._glyphMarginWidth.toString();
            var common = '" style="left:' + left + 'px;width:' + width + 'px' + ';height:' + lineHeight + 'px;"></div>';
            for (lineNumberStr in classNames) {
                lineClassNames = classNames[lineNumberStr];
                lineOutput = [];
                lineOutput.push('<div class="cgmr');
                for (className in lineClassNames) {
                    // Count one more glyph
                    count++;
                    lineOutput.push(' ');
                    lineOutput.push(className);
                }
                lineOutput.push(common);
                output[lineNumberStr] = lineOutput;
            }
            this._renderResult = output;
            return true;
        };
        GlyphMarginOverlay.prototype.render2 = function (lineNumber) {
            if (this._renderResult && this._renderResult.hasOwnProperty(lineNumber.toString())) {
                return this._renderResult[lineNumber.toString()];
            }
            return null;
        };
        return GlyphMarginOverlay;
    })(viewEventHandler_1.ViewEventHandler);
    exports.GlyphMarginOverlay = GlyphMarginOverlay;
});
//# sourceMappingURL=glyphMargin.js.map