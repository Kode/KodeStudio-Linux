/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports"], function (require, exports) {
    var _space = ' '.charCodeAt(0);
    var _tab = '\t'.charCodeAt(0);
    var _lowerThan = '<'.charCodeAt(0);
    var _greaterThan = '>'.charCodeAt(0);
    var _ampersand = '&'.charCodeAt(0);
    var _carriageReturn = '\r'.charCodeAt(0);
    var _lineSeparator = '\u2028'.charCodeAt(0); //http://www.fileformat.info/info/unicode/char/2028/index.htm
    var _bom = 65279;
    function renderLine(input) {
        var lineText = input.lineContent;
        var lineTextLength = lineText.length;
        var tabSize = input.tabSize;
        var actualLineParts = input.parts;
        var renderWhitespace = input.renderWhitespace;
        var charBreakIndex = (input.stopRenderingLineAfter === -1 ? lineTextLength : input.stopRenderingLineAfter - 1);
        if (lineTextLength === 0) {
            return {
                charOffsetInPart: [],
                lastRenderedPartIndex: 0,
                // This is basically for IE's hit test to work
                output: ['<span><span>&nbsp;</span></span>']
            };
        }
        if (actualLineParts.length === 0) {
            throw new Error('Cannot render non empty line without line parts!');
        }
        var charIndex = 0;
        var out = [];
        var charOffsetInPartArr = [];
        var charOffsetInPart = 0;
        out.push('<span>');
        for (var partIndex = 0, partIndexLen = actualLineParts.length; partIndex < partIndexLen; partIndex++) {
            var part = actualLineParts[partIndex];
            out.push('<span class="');
            out.push('token ');
            out.push(part.type.replace(/[^a-z0-9\-]/gi, ' '));
            out.push('">');
            var partRendersWhitespace = false;
            if (renderWhitespace) {
                partRendersWhitespace = (/whitespace$/.test(part.type));
            }
            var toCharIndex = lineTextLength;
            if (partIndex + 1 < partIndexLen) {
                toCharIndex = Math.min(lineTextLength, actualLineParts[partIndex + 1].startIndex);
            }
            charOffsetInPart = 0;
            var tabsCharDelta = 0;
            for (; charIndex < toCharIndex; charIndex++) {
                charOffsetInPartArr[charIndex] = charOffsetInPart;
                var charCode = lineText.charCodeAt(charIndex);
                switch (charCode) {
                    case _tab:
                        var insertSpacesCount = tabSize - (charIndex + tabsCharDelta) % tabSize;
                        tabsCharDelta += insertSpacesCount - 1;
                        charOffsetInPart += insertSpacesCount - 1;
                        if (insertSpacesCount > 0) {
                            out.push(partRendersWhitespace ? '&rarr;' : '&nbsp;');
                            insertSpacesCount--;
                        }
                        while (insertSpacesCount > 0) {
                            out.push('&nbsp;');
                            insertSpacesCount--;
                        }
                        break;
                    case _space:
                        out.push(partRendersWhitespace ? '&middot;' : '&nbsp;');
                        break;
                    case _lowerThan:
                        out.push('&lt;');
                        break;
                    case _greaterThan:
                        out.push('&gt;');
                        break;
                    case _ampersand:
                        out.push('&amp;');
                        break;
                    case 0:
                        out.push('&#00;');
                        break;
                    case _bom:
                    case _lineSeparator:
                        out.push('\ufffd');
                        break;
                    case _carriageReturn:
                        // zero width space, because carriage return would introduce a line break
                        out.push('&#8203');
                        break;
                    default:
                        out.push(lineText.charAt(charIndex));
                }
                charOffsetInPart++;
                if (charIndex >= charBreakIndex) {
                    out.push('&hellip;</span></span>');
                    charOffsetInPartArr[charOffsetInPartArr.length - 1]++;
                    return {
                        charOffsetInPart: charOffsetInPartArr,
                        lastRenderedPartIndex: partIndex,
                        output: out
                    };
                }
            }
            out.push('</span>');
        }
        out.push('</span>');
        // When getting client rects for the last character, we will position the
        // text range at the end of the span, insteaf of at the beginning of next span
        charOffsetInPartArr.push(charOffsetInPart);
        return {
            charOffsetInPart: charOffsetInPartArr,
            lastRenderedPartIndex: actualLineParts.length - 1,
            output: out
        };
    }
    exports.renderLine = renderLine;
});
//# sourceMappingURL=viewLineRenderer.js.map