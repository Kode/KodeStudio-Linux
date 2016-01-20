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
    var _FSL = '/'.charCodeAt(0);
    var _NWL = '\n'.charCodeAt(0);
    var _CAR = '\r'.charCodeAt(0);
    var _LFD = '\f'.charCodeAt(0);
    var _DLR = '$'.charCodeAt(0);
    var _HSH = '#'.charCodeAt(0);
    var _CUL = '{'.charCodeAt(0);
    var _EQS = '='.charCodeAt(0);
    var _BNG = '!'.charCodeAt(0);
    var _LAN = '<'.charCodeAt(0);
    var _RAN = '>'.charCodeAt(0);
    var _DOT = '.'.charCodeAt(0);
    var customTokenValue = scanner.TokenType.CustomToken;
    exports.VariableName = customTokenValue++;
    exports.InterpolationFunction = customTokenValue++;
    exports.Default = customTokenValue++;
    exports.EqualsOperator = customTokenValue++;
    exports.NotEqualsOperator = customTokenValue++;
    exports.GreaterEqualsOperator = customTokenValue++;
    exports.SmallerEqualsOperator = customTokenValue++;
    exports.Ellipsis = customTokenValue++;
    var SassScanner = (function (_super) {
        __extends(SassScanner, _super);
        function SassScanner() {
            _super.apply(this, arguments);
        }
        SassScanner.prototype.scan = function (ignoreWhitespace) {
            if (ignoreWhitespace === void 0) { ignoreWhitespace = true; }
            var result = {
                type: undefined,
                text: undefined,
                offset: this.stream.pos(),
                len: 0
            };
            // SingleLine Comments
            if (this.sassComment()) {
                if (!this.ignoreComment) {
                    return this.finishToken(result, scanner.TokenType.SingleLineComment);
                }
                else {
                    return this.scan(ignoreWhitespace);
                }
            }
            // sass variable
            if (this.stream.advanceIfChar(_DLR)) {
                var content = ['$'];
                if (this.ident(content)) {
                    return this.finishToken(result, exports.VariableName, content.join(''));
                }
                else {
                    this.stream.goBackTo(result.offset);
                }
            }
            // Sass: interpolation function #{..})
            if (this.stream.advanceIfChars([_HSH, _CUL])) {
                return this.finishToken(result, exports.InterpolationFunction);
            }
            // operator ==
            if (this.stream.advanceIfChars([_EQS, _EQS])) {
                return this.finishToken(result, exports.EqualsOperator);
            }
            // operator !=
            if (this.stream.advanceIfChars([_BNG, _EQS])) {
                return this.finishToken(result, exports.NotEqualsOperator);
            }
            // operators <, <=
            if (this.stream.advanceIfChar(_LAN)) {
                if (this.stream.advanceIfChar(_EQS)) {
                    return this.finishToken(result, exports.SmallerEqualsOperator);
                }
                return this.finishToken(result, scanner.TokenType.Delim);
            }
            // ooperators >, >=
            if (this.stream.advanceIfChar(_RAN)) {
                if (this.stream.advanceIfChar(_EQS)) {
                    return this.finishToken(result, exports.GreaterEqualsOperator);
                }
                return this.finishToken(result, scanner.TokenType.Delim);
            }
            // ellipis
            if (this.stream.advanceIfChars([_DOT, _DOT, _DOT])) {
                return this.finishToken(result, exports.Ellipsis);
            }
            return _super.prototype.scan.call(this, ignoreWhitespace);
        };
        SassScanner.prototype.sassComment = function () {
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
        return SassScanner;
    })(scanner.Scanner);
    exports.SassScanner = SassScanner;
});
//# sourceMappingURL=sassScanner.js.map