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
define(["require", "exports", 'vs/editor/common/viewModel/viewEventHandler', 'vs/editor/browser/editorBrowser', 'vs/css!./lineNumbers'], function (require, exports, viewEventHandler_1, EditorBrowser) {
    var LineNumbersOverlay = (function (_super) {
        __extends(LineNumbersOverlay, _super);
        function LineNumbersOverlay(context) {
            _super.call(this);
            this._context = context;
            this._lineNumbersLeft = 0;
            this._lineNumbersWidth = 0;
            this._renderResult = null;
            this._context.addEventHandler(this);
        }
        LineNumbersOverlay.prototype.dispose = function () {
            this._context.removeEventHandler(this);
            this._context = null;
            this._renderResult = null;
        };
        // --- begin event handlers
        LineNumbersOverlay.prototype.onModelFlushed = function () {
            return true;
        };
        LineNumbersOverlay.prototype.onModelDecorationsChanged = function (e) {
            return false;
        };
        LineNumbersOverlay.prototype.onModelLinesDeleted = function (e) {
            return true;
        };
        LineNumbersOverlay.prototype.onModelLineChanged = function (e) {
            return true;
        };
        LineNumbersOverlay.prototype.onModelLinesInserted = function (e) {
            return true;
        };
        LineNumbersOverlay.prototype.onCursorPositionChanged = function (e) {
            return false;
        };
        LineNumbersOverlay.prototype.onCursorSelectionChanged = function (e) {
            return false;
        };
        LineNumbersOverlay.prototype.onCursorRevealRange = function (e) {
            return false;
        };
        LineNumbersOverlay.prototype.onConfigurationChanged = function (e) {
            return true;
        };
        LineNumbersOverlay.prototype.onLayoutChanged = function (layoutInfo) {
            this._lineNumbersLeft = layoutInfo.lineNumbersLeft;
            this._lineNumbersWidth = layoutInfo.lineNumbersWidth;
            return true;
        };
        LineNumbersOverlay.prototype.onScrollChanged = function (e) {
            return e.vertical;
        };
        LineNumbersOverlay.prototype.onZonesChanged = function () {
            return true;
        };
        LineNumbersOverlay.prototype.onScrollWidthChanged = function (scrollWidth) {
            return false;
        };
        LineNumbersOverlay.prototype.onScrollHeightChanged = function (scrollHeight) {
            return false;
        };
        // --- end event handlers
        LineNumbersOverlay.prototype.shouldCallRender2 = function (ctx) {
            if (!this.shouldRender) {
                return false;
            }
            this.shouldRender = false;
            if (!this._context.configuration.editor.lineNumbers) {
                this._renderResult = null;
                return false;
            }
            var output = {};
            var lineHeight = this._context.configuration.editor.lineHeight.toString(), lineNumber, renderLineNumber;
            var common = '<div class="' + EditorBrowser.ClassNames.LINE_NUMBERS + '" style="left:' + this._lineNumbersLeft.toString() + 'px;width:' + this._lineNumbersWidth.toString() + 'px;height:' + lineHeight + 'px;">';
            for (lineNumber = ctx.visibleRange.startLineNumber; lineNumber <= ctx.visibleRange.endLineNumber; lineNumber++) {
                renderLineNumber = this._context.model.getLineRenderLineNumber(lineNumber);
                if (renderLineNumber) {
                    var lineOutput = [
                        common,
                        this._context.model.getLineRenderLineNumber(lineNumber),
                        '</div>'
                    ];
                    output[lineNumber.toString()] = lineOutput;
                }
            }
            this._renderResult = output;
            return true;
        };
        LineNumbersOverlay.prototype.render2 = function (lineNumber) {
            if (this._renderResult && this._renderResult.hasOwnProperty(lineNumber.toString())) {
                return this._renderResult[lineNumber.toString()];
            }
            return null;
        };
        return LineNumbersOverlay;
    })(viewEventHandler_1.ViewEventHandler);
    exports.LineNumbersOverlay = LineNumbersOverlay;
});
//# sourceMappingURL=lineNumbers.js.map