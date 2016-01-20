/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/viewLayout/verticalObjects'], function (require, exports, verticalObjects_1) {
    /**
     * Layouting of objects that take vertical space (by having a height) and push down other objects.
     *
     * These objects are basically either text (lines) or spaces between those lines (whitespaces).
     * This provides commodity operations for working with lines that contain whitespace that pushes lines lower (vertically).
     * This is a thin wrapper around VerticalObjects.VerticalObjects, with knowledge of the editor.
     */
    var LinesLayout = (function () {
        function LinesLayout(configuration, model) {
            this.configuration = configuration;
            this.model = model;
            this.verticalObjects = new verticalObjects_1.VerticalObjects();
            this.verticalObjects.replaceLines(model.getLineCount());
        }
        /**
         * Insert a new whitespace of a certain height after a line number.
         * The whitespace has a "sticky" characteristic.
         * Irrespective of edits above or below `afterLineNumber`, the whitespace will follow the initial line.
         *
         * @param afterLineNumber The conceptual position of this whitespace. The whitespace will follow this line as best as possible even when deleting/inserting lines above/below.
         * @param heightInPx The height of the whitespace, in pixels.
         * @return An id that can be used later to mutate or delete the whitespace
         */
        LinesLayout.prototype.insertWhitespace = function (afterLineNumber, ordinal, height) {
            return this.verticalObjects.insertWhitespace(afterLineNumber, ordinal, height);
        };
        /**
         * Change the height of an existing whitespace
         *
         * @param id The whitespace to change
         * @param newHeightInPx The new height of the whitespace, in pixels
         * @return Returns true if the whitespace is found and if the new height is different than the old height
         */
        LinesLayout.prototype.changeWhitespace = function (id, newHeight) {
            return this.verticalObjects.changeWhitespace(id, newHeight);
        };
        /**
         * Change the line number after which an existing whitespace flows.
         *
         * @param id The whitespace to change
         * @param newAfterLineNumber The new line number the whitespace will follow
         * @return Returns true if the whitespace is found and if the new line number is different than the old line number
         */
        LinesLayout.prototype.changeAfterLineNumberForWhitespace = function (id, newAfterLineNumber) {
            return this.verticalObjects.changeAfterLineNumberForWhitespace(id, newAfterLineNumber);
        };
        /**
         * Remove an existing whitespace.
         *
         * @param id The whitespace to remove
         * @return Returns true if the whitespace is found and it is removed.
         */
        LinesLayout.prototype.removeWhitespace = function (id) {
            return this.verticalObjects.removeWhitespace(id);
        };
        /**
         * Event handler, call when the model associated to this view has been flushed.
         */
        LinesLayout.prototype.onModelFlushed = function () {
            this.verticalObjects.replaceLines(this.model.getLineCount());
        };
        /**
         * Event handler, call when the model has had lines deleted.
         */
        LinesLayout.prototype.onModelLinesDeleted = function (e) {
            this.verticalObjects.onModelLinesDeleted(e.fromLineNumber, e.toLineNumber);
        };
        /**
         * Event handler, call when the model has had lines inserted.
         */
        LinesLayout.prototype.onModelLinesInserted = function (e) {
            this.verticalObjects.onModelLinesInserted(e.fromLineNumber, e.toLineNumber);
        };
        /**
         * Get the vertical offset (the sum of heights for all objects above) a certain line number.
         *
         * @param lineNumber The line number
         * @return The sum of heights for all objects above `lineNumber`.
         */
        LinesLayout.prototype.getVerticalOffsetForLineNumber = function (lineNumber) {
            return this.verticalObjects.getVerticalOffsetForLineNumber(lineNumber, this.configuration.editor.lineHeight);
        };
        LinesLayout.prototype.getLinesTotalHeight = function () {
            return this.verticalObjects.getTotalHeight(this.configuration.editor.lineHeight);
        };
        /**
         * Get the sum of heights for all objects and compute basically the `scrollHeight` for the editor content.
         *
         * Take into account the `scrollBeyondLastLine` and `reserveHorizontalScrollbarHeight` and produce a scrollHeight that is at least as large as `viewport`.height.
         *
         * @param viewport The viewport.
         * @param reserveHorizontalScrollbarHeight The height of the horizontal scrollbar.
         * @return Basically, the `scrollHeight` for the editor content.
         */
        LinesLayout.prototype.getTotalHeight = function (viewport, reserveHorizontalScrollbarHeight) {
            var totalLinesHeight = this.getLinesTotalHeight();
            //		if (this.context.configuration.editor.autoSize) {
            //			return linesHeight;
            //		}
            if (this.configuration.editor.scrollBeyondLastLine) {
                totalLinesHeight += viewport.height - this.configuration.editor.lineHeight;
            }
            else {
                totalLinesHeight += reserveHorizontalScrollbarHeight;
            }
            return Math.max(viewport.height, totalLinesHeight);
        };
        LinesLayout.prototype.isAfterLines = function (verticalOffset) {
            return this.verticalObjects.isAfterLines(verticalOffset, this.configuration.editor.lineHeight);
        };
        /**
         * Find the first line number that is at or after vertical offset `verticalOffset`.
         * i.e. if getVerticalOffsetForLine(line) is x and getVerticalOffsetForLine(line + 1) is y, then
         * getLineNumberAtOrAfterVerticalOffset(i) = line, x <= i < y.
         *
         * @param verticalOffset The vertical offset to search at.
         * @return The line number at or after vertical offset `verticalOffset`.
         */
        LinesLayout.prototype.getLineNumberAtOrAfterVerticalOffset = function (verticalOffset) {
            return this.verticalObjects.getLineNumberAtOrAfterVerticalOffset(verticalOffset, this.configuration.editor.lineHeight);
        };
        /**
         * Get the height, in pixels, for line `lineNumber`.
         *
         * @param lineNumber The line number
         * @return The height, in pixels, for line `lineNumber`.
         */
        LinesLayout.prototype.getHeightForLineNumber = function (lineNumber) {
            return this.configuration.editor.lineHeight;
        };
        /**
         * Get a list of whitespaces that are positioned inside `viewport`.
         *
         * @param viewport The viewport.
         * @return An array with all the whitespaces in the viewport. If no whitespace is in viewport, the array is empty.
         */
        LinesLayout.prototype.getWhitespaceViewportData = function (visibleBox) {
            return this.verticalObjects.getWhitespaceViewportData(visibleBox.top, visibleBox.top + visibleBox.height, this.configuration.editor.lineHeight);
        };
        LinesLayout.prototype.getWhitespaces = function () {
            return this.verticalObjects.getWhitespaces(this.configuration.editor.lineHeight);
        };
        /**
         * Get exactly the whitespace that is layouted at `verticalOffset`.
         *
         * @param verticalOffset The vertical offset.
         * @return Precisely the whitespace that is layouted at `verticaloffset` or null.
         */
        LinesLayout.prototype.getWhitespaceAtVerticalOffset = function (verticalOffset) {
            return this.verticalObjects.getWhitespaceAtVerticalOffset(verticalOffset, this.configuration.editor.lineHeight);
        };
        /**
         * Get all the lines and their relative vertical offsets that are positioned inside `viewport`.
         *
         * @param viewport The viewport.
         * @return A structure describing the lines positioned between `verticalOffset1` and `verticalOffset2`.
         */
        LinesLayout.prototype.getLinesViewportData = function (visibleBox) {
            var viewportData = this.verticalObjects.getLinesViewportData(visibleBox.top, visibleBox.top + visibleBox.height, this.configuration.editor.lineHeight);
            var decorationsResolver = this.model.getDecorationsResolver(viewportData.startLineNumber, viewportData.endLineNumber);
            viewportData.getDecorationsInViewport = function () { return decorationsResolver.getDecorations(); };
            viewportData.getInlineDecorationsForLineInViewport = function (lineNumber) { return decorationsResolver.getInlineDecorations(lineNumber); };
            return viewportData;
        };
        /**
         * Get the line that appears visually in the center of `viewport`.
         *
         * @param viewport The viewport.
         * @return The line number that is closest to the center of `viewport`.
         */
        LinesLayout.prototype.getCenteredLineInViewport = function (visibleBox) {
            return this.verticalObjects.getCenteredLineInViewport(visibleBox.top, visibleBox.top + visibleBox.height, this.configuration.editor.lineHeight);
        };
        /**
         * Returns the accumulated height of whitespaces before the given line number.
         *
         * @param lineNumber The line number
         */
        LinesLayout.prototype.getWhitespaceAccumulatedHeightBeforeLineNumber = function (lineNumber) {
            return this.verticalObjects.getWhitespaceAccumulatedHeightBeforeLineNumber(lineNumber);
        };
        /**
         * Returns if there is any whitespace in the document.
         */
        LinesLayout.prototype.hasWhitespace = function () {
            return this.verticalObjects.hasWhitespace();
        };
        return LinesLayout;
    })();
    exports.LinesLayout = LinesLayout;
});
//# sourceMappingURL=linesLayout.js.map