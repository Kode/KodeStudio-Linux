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
define(["require", "exports", 'vs/languages/css/common/parser/cssScanner'], function (require, exports, scanner) {
    var _PRC = '%'.charCodeAt(0);
    var _LPA = '('.charCodeAt(0);
    var _FSL = '/'.charCodeAt(0);
    var _NWL = '\n'.charCodeAt(0);
    var _CAR = '\r'.charCodeAt(0);
    var _LFD = '\f'.charCodeAt(0);
    var _TIC = '`'.charCodeAt(0);
    var _DOT = '.'.charCodeAt(0);
    var customTokenValue = scanner.TokenType.CustomToken;
    exports.Ellipsis = customTokenValue++;
    var LessScanner = (function (_super) {
        __extends(LessScanner, _super);
        function LessScanner() {
            _super.apply(this, arguments);
        }
        LessScanner.prototype.scan = function (ignoreWhitespace) {
            if (ignoreWhitespace === void 0) { ignoreWhitespace = true; }
            var result = {
                type: undefined,
                text: undefined,
                offset: this.stream.pos(),
                len: 0
            };
            // SingleLine Comments
            if (this.lessComment()) {
                if (!this.ignoreComment) {
                    return this.finishToken(result, scanner.TokenType.SingleLineComment);
                }
                else {
                    return this.scan(ignoreWhitespace);
                }
            }
            // LESS: escaped JavaScript code `var a = "dddd"`
            var tokenType = this.escapedJavaScript();
            if (tokenType !== null) {
                return this.finishToken(result, tokenType);
            }
            if (this.stream.advanceIfChars([_DOT, _DOT, _DOT])) {
                return this.finishToken(result, exports.Ellipsis);
            }
            return _super.prototype.scan.call(this, ignoreWhitespace);
        };
        LessScanner.prototype.lessComment = function () {
            if (this.stream.advanceIfChars([_FSL, _FSL])) {
                this.stream.advanceWhileChar(function (ch) {
                    switch (ch) {
                        case _NWL:
                        case _CAR:
                        case _LFD:
                            return false;
                        default:
                            return true;
                    }
                });
                return true;
            }
            else {
                return false;
            }
        };
        LessScanner.prototype.escapedJavaScript = function () {
            var ch = this.stream.peekChar();
            if (ch === _TIC) {
                this.stream.advance(1);
                this.stream.advanceWhileChar(function (ch) { return ch !== _TIC; });
                return this.stream.advanceIfChar(_TIC) ? scanner.TokenType.EscapedJavaScript : scanner.TokenType.BadEscapedJavaScript;
            }
            return null;
        };
        return LessScanner;
    })(scanner.Scanner);
    exports.LessScanner = LessScanner;
});
//# sourceMappingURL=lessScanner.js.map