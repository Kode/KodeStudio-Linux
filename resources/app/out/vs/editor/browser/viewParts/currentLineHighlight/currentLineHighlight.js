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
define(["require", "exports", 'vs/editor/common/viewModel/viewEventHandler', 'vs/css!./currentLineHighlight'], function (require, exports, viewEventHandler_1) {
    var CurrentLineHighlightOverlay = (function (_super) {
        __extends(CurrentLineHighlightOverlay, _super);
        function CurrentLineHighlightOverlay(context, layoutProvider) {
            _super.call(this);
            this._context = context;
            this._layoutProvider = layoutProvider;
            this._selectionIsEmpty = true;
            this._primaryCursorIsInEditableRange = true;
            this._primaryCursorLineNumber = 1;
            this._scrollWidth = this._layoutProvider.getScrollWidth();
            this._context.addEventHandler(this);
        }
        CurrentLineHighlightOverlay.prototype.dispose = function () {
            this._context.removeEventHandler(this);
            this._context = null;
        };
        // --- begin event handlers
        CurrentLineHighlightOverlay.prototype.onModelFlushed = function () {
            this._primaryCursorIsInEditableRange = true;
            this._selectionIsEmpty = true;
            this._primaryCursorLineNumber = 1;
            this._scrollWidth = this._layoutProvider.getScrollWidth();
            return true;
        };
        CurrentLineHighlightOverlay.prototype.onModelLinesDeleted = function (e) {
            return true;
        };
        CurrentLineHighlightOverlay.prototype.onModelLinesInserted = function (e) {
            return true;
        };
        CurrentLineHighlightOverlay.prototype.onCursorPositionChanged = function (e) {
            var hasChanged = false;
            if (this._primaryCursorIsInEditableRange !== e.isInEditableRange) {
                this._primaryCursorIsInEditableRange = e.isInEditableRange;
                hasChanged = true;
            }
            if (this._primaryCursorLineNumber !== e.position.lineNumber) {
                this._primaryCursorLineNumber = e.position.lineNumber;
                hasChanged = true;
            }
            return hasChanged;
        };
        CurrentLineHighlightOverlay.prototype.onCursorSelectionChanged = function (e) {
            var isEmpty = e.selection.isEmpty();
            if (this._selectionIsEmpty !== isEmpty) {
                this._selectionIsEmpty = isEmpty;
                return true;
            }
            return false;
        };
        CurrentLineHighlightOverlay.prototype.onConfigurationChanged = function (e) {
            return true;
        };
        CurrentLineHighlightOverlay.prototype.onLayoutChanged = function (layoutInfo) {
            return true;
        };
        CurrentLineHighlightOverlay.prototype.onScrollChanged = function (e) {
            return true;
        };
        CurrentLineHighlightOverlay.prototype.onZonesChanged = function () {
            return true;
        };
        CurrentLineHighlightOverlay.prototype.onScrollWidthChanged = function (scrollWidth) {
            if (this._scrollWidth !== scrollWidth) {
                this._scrollWidth = scrollWidth;
                return true;
            }
            return false;
        };
        // --- end event handlers
        CurrentLineHighlightOverlay.prototype.shouldCallRender2 = function (ctx) {
            if (!this.shouldRender) {
                return false;
            }
            this.shouldRender = false;
            this._scrollWidth = ctx.scrollWidth;
            return true;
        };
        CurrentLineHighlightOverlay.prototype.render2 = function (lineNumber) {
            if (lineNumber === this._primaryCursorLineNumber) {
                if (this._shouldShowCurrentLine()) {
                    return [
                        '<div class="current-line" style="width:',
                        String(this._scrollWidth),
                        'px; height:',
                        String(this._context.configuration.editor.lineHeight),
                        'px;"></div>'
                    ];
                }
                else {
                    return null;
                }
            }
            return null;
        };
        CurrentLineHighlightOverlay.prototype._shouldShowCurrentLine = function () {
            return this._selectionIsEmpty && this._primaryCursorIsInEditableRange && !this._context.configuration.editor.readOnly;
        };
        return CurrentLineHighlightOverlay;
    })(viewEventHandler_1.ViewEventHandler);
    exports.CurrentLineHighlightOverlay = CurrentLineHighlightOverlay;
});
//# sourceMappingURL=currentLineHighlight.js.map