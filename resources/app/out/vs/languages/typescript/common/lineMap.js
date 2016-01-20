/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/strings'], function (require, exports, strings) {
    var LineMap;
    (function (LineMap) {
        function create(text) {
            var lineStarts = strings.computeLineStarts(text);
            function getOffset(position) {
                return lineStarts[position.lineNumber - 1] + position.column - 1;
            }
            function getSpanFromRange(range) {
                var start = lineStarts[range.startLineNumber - 1] + range.startColumn - 1;
                var length = lineStarts[range.endLineNumber - 1] + range.endColumn - 1 - start;
                return {
                    start: start,
                    length: length
                };
            }
            function getPositionFromOffset(position) {
                var line = 1;
                for (line = 1; line < lineStarts.length; line++) {
                    if (lineStarts[line] > position) {
                        break;
                    }
                }
                return {
                    lineNumber: line,
                    column: 1 + position - lineStarts[line - 1]
                };
            }
            function getRangeFromSpan(span) {
                var startPosition = getPositionFromOffset(span.start);
                var endPosition = getPositionFromOffset(span.start + span.length);
                return {
                    startLineNumber: startPosition.lineNumber,
                    startColumn: startPosition.column,
                    endLineNumber: endPosition.lineNumber,
                    endColumn: endPosition.column,
                };
            }
            return {
                getOffset: getOffset,
                getSpanFromRange: getSpanFromRange,
                getPositionFromOffset: getPositionFromOffset,
                getRangeFromSpan: getRangeFromSpan
            };
        }
        LineMap.create = create;
    })(LineMap || (LineMap = {}));
    return LineMap;
});
//# sourceMappingURL=lineMap.js.map