/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports"], function (require, exports) {
    var Position = (function () {
        function Position(lineNumber, column) {
            this.lineNumber = lineNumber;
            this.column = column;
        }
        Position.prototype.equals = function (other) {
            return (!!other && this.lineNumber === other.lineNumber && this.column === other.column);
        };
        Position.prototype.isBefore = function (other) {
            if (this.lineNumber < other.lineNumber) {
                return true;
            }
            if (other.lineNumber < this.lineNumber) {
                return false;
            }
            return this.column < other.column;
        };
        Position.prototype.isBeforeOrEqual = function (other) {
            if (this.lineNumber < other.lineNumber) {
                return true;
            }
            if (other.lineNumber < this.lineNumber) {
                return false;
            }
            return this.column <= other.column;
        };
        Position.prototype.clone = function () {
            return new Position(this.lineNumber, this.column);
        };
        Position.prototype.toString = function () {
            return '(' + this.lineNumber + ',' + this.column + ')';
        };
        // ---
        Position.lift = function (pos) {
            return new Position(pos.lineNumber, pos.column);
        };
        Position.isIPosition = function (obj) {
            return (obj
                && (typeof obj.lineNumber === 'number')
                && (typeof obj.column === 'number'));
        };
        Position.asEmptyRange = function (position) {
            return {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            };
        };
        Position.startPosition = function (range) {
            return {
                lineNumber: range.startLineNumber,
                column: range.startColumn
            };
        };
        Position.endPosition = function (range) {
            return {
                lineNumber: range.endLineNumber,
                column: range.endColumn
            };
        };
        return Position;
    })();
    exports.Position = Position;
});
//# sourceMappingURL=position.js.map