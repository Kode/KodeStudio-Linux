/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports"], function (require, exports) {
    /**
     * @returns The character offset of the {{position}} using the {{tree}}.
     */
    function getOffset(file, position) {
        return file.getPositionOfLineAndCharacter(position.lineNumber - 1, position.column - 1);
    }
    exports.getOffset = getOffset;
    /**
     * @returns The character offset of the start position using the {{tree}}.
     */
    function getStartOffset(file, range) {
        return file.getPositionOfLineAndCharacter(range.startLineNumber - 1, range.startColumn - 1);
    }
    exports.getStartOffset = getStartOffset;
    /**
     * @returns The character offset of the end position using the {{tree}}.
     */
    function getEndOffset(file, range) {
        return file.getPositionOfLineAndCharacter(range.endLineNumber - 1, range.endColumn - 1);
    }
    exports.getEndOffset = getEndOffset;
    function getPosition(file, offset) {
        offset = sanitizePosition(file, offset);
        var lineAndCharactor = file.getLineAndCharacterOfPosition(offset);
        return {
            lineNumber: 1 + lineAndCharactor.line,
            column: 1 + lineAndCharactor.character
        };
    }
    exports.getPosition = getPosition;
    /**
     * @returns The {{IRange}} for the {{start}} and {{end}} parameters using the {{tree}}.
     */
    function getRange(file, startOrSpan, endOrEmpty, empty) {
        var start, end;
        if (typeof endOrEmpty === 'number') {
            end = endOrEmpty;
        }
        else {
            empty = endOrEmpty;
        }
        if (typeof startOrSpan === 'number') {
            start = startOrSpan;
        }
        else {
            start = startOrSpan.start;
            end = start + startOrSpan.length;
        }
        start = sanitizePosition(file, start);
        end = sanitizePosition(file, end);
        if (empty) {
            var p1 = file.getLineAndCharacterOfPosition(start);
            return {
                startLineNumber: 1 + p1.line,
                startColumn: 1 + p1.character,
                endLineNumber: 1 + p1.line,
                endColumn: 1 + p1.character
            };
        }
        else {
            var p1 = file.getLineAndCharacterOfPosition(start), p2 = file.getLineAndCharacterOfPosition(end);
            return {
                startLineNumber: 1 + p1.line,
                startColumn: 1 + p1.character,
                endLineNumber: 1 + p2.line,
                endColumn: 1 + p2.character
            };
        }
    }
    exports.getRange = getRange;
    function sanitizePosition(sourceFile, position) {
        var length = sourceFile.getFullWidth();
        // The value `length` is a valid position and denotes the end of the text
        return position > length ? length : position;
    }
});
//# sourceMappingURL=converter.js.map