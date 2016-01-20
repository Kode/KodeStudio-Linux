/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports"], function (require, exports) {
    exports.ClassNames = {
        TEXTAREA_COVER: 'textAreaCover',
        TEXTAREA: 'inputarea',
        LINES_CONTENT: 'lines-content',
        OVERFLOW_GUARD: 'overflow-guard',
        VIEW_LINES: 'view-lines',
        VIEW_LINE: 'view-line',
        SCROLLABLE_ELEMENT: 'editor-scrollable',
        CONTENT_WIDGETS: 'contentWidgets',
        OVERFLOWING_CONTENT_WIDGETS: 'overflowingContentWidgets',
        OVERLAY_WIDGETS: 'overlayWidgets',
        MARGIN_VIEW_OVERLAYS: 'margin-view-overlays',
        LINE_NUMBERS: 'line-numbers',
        GLYPH_MARGIN: 'glyph-margin',
        SCROLL_DECORATION: 'scroll-decoration',
        VIEW_CURSORS_LAYER: 'cursors-layer',
        VIEW_ZONES: 'view-zones'
    };
    var VisibleRange = (function () {
        function VisibleRange(top, left, width) {
            this.top = top;
            this.left = left;
            this.width = width;
        }
        return VisibleRange;
    })();
    exports.VisibleRange = VisibleRange;
    var HorizontalRange = (function () {
        function HorizontalRange(left, width) {
            this.left = left;
            this.width = width;
        }
        return HorizontalRange;
    })();
    exports.HorizontalRange = HorizontalRange;
    var LineVisibleRanges = (function () {
        function LineVisibleRanges(lineNumber, ranges) {
            this.lineNumber = lineNumber;
            this.ranges = ranges;
        }
        return LineVisibleRanges;
    })();
    exports.LineVisibleRanges = LineVisibleRanges;
    /**
     * A positioning preference for rendering content widgets.
     */
    (function (ContentWidgetPositionPreference) {
        /**
         * Place the content widget exactly at a position
         */
        ContentWidgetPositionPreference[ContentWidgetPositionPreference["EXACT"] = 0] = "EXACT";
        /**
         * Place the content widget above a position
         */
        ContentWidgetPositionPreference[ContentWidgetPositionPreference["ABOVE"] = 1] = "ABOVE";
        /**
         * Place the content widget below a position
         */
        ContentWidgetPositionPreference[ContentWidgetPositionPreference["BELOW"] = 2] = "BELOW";
    })(exports.ContentWidgetPositionPreference || (exports.ContentWidgetPositionPreference = {}));
    var ContentWidgetPositionPreference = exports.ContentWidgetPositionPreference;
    /**
     * A positioning preference for rendering overlay widgets.
     */
    (function (OverlayWidgetPositionPreference) {
        /**
         * Position the overlay widget in the top right corner
         */
        OverlayWidgetPositionPreference[OverlayWidgetPositionPreference["TOP_RIGHT_CORNER"] = 0] = "TOP_RIGHT_CORNER";
        /**
         * Position the overlay widget in the bottom right corner
         */
        OverlayWidgetPositionPreference[OverlayWidgetPositionPreference["BOTTOM_RIGHT_CORNER"] = 1] = "BOTTOM_RIGHT_CORNER";
        /**
         * Position the overlay widget in the top center
         */
        OverlayWidgetPositionPreference[OverlayWidgetPositionPreference["TOP_CENTER"] = 2] = "TOP_CENTER";
    })(exports.OverlayWidgetPositionPreference || (exports.OverlayWidgetPositionPreference = {}));
    var OverlayWidgetPositionPreference = exports.OverlayWidgetPositionPreference;
});
//# sourceMappingURL=editorBrowser.js.map