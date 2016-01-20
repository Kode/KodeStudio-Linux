/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports"], function (require, exports) {
    var CursorMoveHelper = (function () {
        function CursorMoveHelper(configuration) {
            this.configuration = configuration;
        }
        CursorMoveHelper.prototype.getLeftOfPosition = function (model, lineNumber, column) {
            if (column > model.getLineMinColumn(lineNumber)) {
                column = column - 1;
            }
            else if (lineNumber > 1) {
                lineNumber = lineNumber - 1;
                column = model.getLineMaxColumn(lineNumber);
            }
            return {
                lineNumber: lineNumber,
                column: column
            };
        };
        CursorMoveHelper.prototype.getRightOfPosition = function (model, lineNumber, column) {
            if (column < model.getLineMaxColumn(lineNumber)) {
                column = column + 1;
            }
            else if (lineNumber < model.getLineCount()) {
                lineNumber = lineNumber + 1;
                column = model.getLineMinColumn(lineNumber);
            }
            return {
                lineNumber: lineNumber,
                column: column
            };
        };
        CursorMoveHelper.prototype.getPositionUp = function (model, lineNumber, column, leftoverVisibleColumns, count) {
            var currentVisibleColumn = this.visibleColumnFromColumn(model, lineNumber, column) + leftoverVisibleColumns;
            lineNumber = lineNumber - count;
            if (lineNumber < 1) {
                lineNumber = 1;
                column = model.getLineMinColumn(lineNumber);
            }
            else {
                column = this.columnFromVisibleColumn(model, lineNumber, currentVisibleColumn);
            }
            leftoverVisibleColumns = currentVisibleColumn - this.visibleColumnFromColumn(model, lineNumber, column);
            return {
                lineNumber: lineNumber,
                column: column,
                leftoverVisibleColumns: leftoverVisibleColumns
            };
        };
        CursorMoveHelper.prototype.getPositionDown = function (model, lineNumber, column, leftoverVisibleColumns, count) {
            var currentVisibleColumn = this.visibleColumnFromColumn(model, lineNumber, column) + leftoverVisibleColumns;
            lineNumber = lineNumber + count;
            var lineCount = model.getLineCount();
            if (lineNumber > lineCount) {
                lineNumber = lineCount;
                column = model.getLineMaxColumn(lineNumber);
            }
            else {
                column = this.columnFromVisibleColumn(model, lineNumber, currentVisibleColumn);
            }
            leftoverVisibleColumns = currentVisibleColumn - this.visibleColumnFromColumn(model, lineNumber, column);
            return {
                lineNumber: lineNumber,
                column: column,
                leftoverVisibleColumns: leftoverVisibleColumns
            };
        };
        CursorMoveHelper.prototype.getColumnAtBeginningOfLine = function (model, lineNumber, column) {
            var firstNonBlankColumn = model.getLineFirstNonWhitespaceColumn(lineNumber) || 1;
            var minColumn = model.getLineMinColumn(lineNumber);
            if (column !== minColumn && column <= firstNonBlankColumn) {
                column = minColumn;
            }
            else {
                column = firstNonBlankColumn;
            }
            return column;
        };
        CursorMoveHelper.prototype.getColumnAtEndOfLine = function (model, lineNumber, column) {
            var maxColumn = model.getLineMaxColumn(lineNumber);
            var lastNonBlankColumn = model.getLineLastNonWhitespaceColumn(lineNumber) || maxColumn;
            if (column !== maxColumn && column >= lastNonBlankColumn) {
                column = maxColumn;
            }
            else {
                column = lastNonBlankColumn;
            }
            return column;
        };
        CursorMoveHelper.prototype.visibleColumnFromColumn = function (model, lineNumber, column) {
            return CursorMoveHelper.visibleColumnFromColumn(model, lineNumber, column, this.configuration.getIndentationOptions().tabSize);
        };
        CursorMoveHelper.visibleColumnFromColumn = function (model, lineNumber, column, tabSize) {
            return CursorMoveHelper.visibleColumnFromColumn2(model.getLineContent(lineNumber), column, tabSize);
        };
        CursorMoveHelper.visibleColumnFromColumn2 = function (line, column, tabSize) {
            var result = 0;
            for (var i = 0; i < column - 1; i++) {
                result = (line.charAt(i) === '\t') ? CursorMoveHelper.nextTabColumn(result, tabSize) : result + 1;
            }
            return result;
        };
        CursorMoveHelper.prototype.columnFromVisibleColumn = function (model, lineNumber, visibleColumn) {
            var line = model.getLineContent(lineNumber);
            var lastVisibleColumn = -1;
            var thisVisibleColumn = 0;
            for (var i = 0; i < line.length && thisVisibleColumn <= visibleColumn; i++) {
                lastVisibleColumn = thisVisibleColumn;
                thisVisibleColumn = (line.charAt(i) === '\t') ? CursorMoveHelper.nextTabColumn(thisVisibleColumn, this.configuration.getIndentationOptions().tabSize) : thisVisibleColumn + 1;
            }
            // Choose the closest
            thisVisibleColumn = Math.abs(visibleColumn - thisVisibleColumn);
            lastVisibleColumn = Math.abs(visibleColumn - lastVisibleColumn);
            var result;
            if (thisVisibleColumn < lastVisibleColumn) {
                result = i + 1;
            }
            else {
                result = i;
            }
            var minColumn = model.getLineMinColumn(lineNumber);
            if (result < minColumn) {
                result = minColumn;
            }
            return result;
        };
        /**
         * ATTENTION: This works with 0-based columns (as oposed to the regular 1-based columns)
         */
        CursorMoveHelper.nextTabColumn = function (column, tabSize) {
            return column + tabSize - column % tabSize;
        };
        /**
         * ATTENTION: This works with 0-based columns (as oposed to the regular 1-based columns)
         */
        CursorMoveHelper.prevTabColumn = function (column, tabSize) {
            return column - 1 - (column - 1) % tabSize;
        };
        return CursorMoveHelper;
    })();
    exports.CursorMoveHelper = CursorMoveHelper;
});
//# sourceMappingURL=cursorMoveHelper.js.map