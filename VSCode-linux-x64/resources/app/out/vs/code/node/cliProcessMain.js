/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["exports","require","vs/base/common/winjs.base","vs/nls!vs/code/node/cliProcessMain","vs/platform/instantiation/common/instantiation","vs/base/common/types","vs/nls","vs/base/common/objects","path","vs/base/common/event","vs/platform/log/common/log","vs/base/common/strings","vs/base/common/lifecycle","vs/platform/configuration/common/configuration","vs/platform/registry/common/platform","vs/base/common/errors","vs/base/node/pfs","vs/platform/configuration/common/configurationRegistry","vs/base/common/platform","vs/platform/environment/common/environment","vs/base/common/arrays","vs/platform/node/package","vs/base/common/async","vs/base/common/uri","vs/base/common/paths","vs/base/common/severity","fs","os","vs/platform/telemetry/common/telemetry","vs/platform/extensionManagement/common/extensionManagementUtil","vs/base/common/assert","vs/base/common/network","vs/base/node/extfs","vs/platform/instantiation/common/serviceCollection","vs/platform/node/product","vs/base/node/request","vs/base/common/errorMessage","vs/platform/extensionManagement/common/extensionManagement","vs/platform/request/node/request","vs/platform/extensions/node/extensionValidator","vs/base/common/uuid","vs/platform/dialogs/common/dialogs","vs/platform/instantiation/common/descriptors","vs/platform/configuration/common/configurationModels","vs/base/common/map","vs/base/common/json","vs/base/common/mime","vs/nls!vs/platform/request/node/request","vs/platform/dialogs/node/dialogService","vs/platform/request/node/requestService","vs/nls!vs/platform/node/zip","vs/nls!vs/platform/extensions/node/extensionValidator","vs/platform/extensionManagement/common/extensionNls","vs/platform/extensions/common/extensions","vs/platform/extensionManagement/node/extensionsManifestCache","vs/nls!vs/platform/extensionManagement/node/extensionManagementService","vs/nls!vs/platform/extensionManagement/common/extensionManagement","vs/nls!vs/platform/dialogs/node/dialogService","vs/nls!vs/platform/dialogs/common/dialogs","vs/platform/download/common/download","vs/nls!vs/platform/configuration/common/configurationRegistry","vs/nls!vs/base/common/severity","vs/nls!vs/base/common/errorMessage","vs/platform/instantiation/common/instantiationService","vs/base/node/config","vs/platform/extensionManagement/node/extensionLifecycle","vs/platform/extensionManagement/node/extensionGalleryService","vs/platform/log/node/spdlogService","url","vs/base/node/proxy","vs/platform/environment/node/environmentService","vs/base/common/collections","vs/base/common/amd","vs/base/node/paths","vs/nls!vs/platform/telemetry/common/telemetryService","vs/platform/jsonschemas/common/jsonContributionRegistry","vs/base/common/glob","semver","vs/base/common/labels","vs/platform/configuration/node/configuration","vs/platform/configuration/node/configurationService","vs/base/common/graph","vs/platform/state/common/state","vs/platform/state/node/stateService","vs/base/common/date","vs/platform/telemetry/common/telemetryService","vs/platform/telemetry/common/telemetryUtils","vs/platform/telemetry/node/appInsightsAppender","vs/platform/extensionManagement/node/extensionManagementService","vs/platform/telemetry/node/commonProperties","vs/base/common/decorators","vs/platform/node/zip","yauzl","yazl","applicationinsights","vs/base/common/resources","crypto","zlib","child_process","vs/base/common/cancellation","readline","vs/code/node/cliProcessMain"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[30/*vs/base/common/assert*/], __M([1/*require*/,0/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Throws an error with the provided message if the provided value does not evaluate to a true Javascript value.
     */
    function ok(value, message) {
        if (!value || value === null) {
            throw new Error(message ? 'Assertion failed (' + message + ')' : 'Assertion Failed');
        }
    }
    exports.ok = ok;
});

define(__m[71/*vs/base/common/collections*/], __M([1/*require*/,0/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    /**
     * Returns an array which contains all values that reside
     * in the given set.
     */
    function values(from) {
        var result = [];
        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                result.push(from[key]);
            }
        }
        return result;
    }
    exports.values = values;
    function size(from) {
        var count = 0;
        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                count += 1;
            }
        }
        return count;
    }
    exports.size = size;
    function first(from) {
        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                return from[key];
            }
        }
        return undefined;
    }
    exports.first = first;
    /**
     * Iterates over each entry in the provided set. The iterator allows
     * to remove elements and will stop when the callback returns {{false}}.
     */
    function forEach(from, callback) {
        var _loop_1 = function (key) {
            if (hasOwnProperty.call(from, key)) {
                var result = callback({ key: key, value: from[key] }, function () {
                    delete from[key];
                });
                if (result === false) {
                    return { value: void 0 };
                }
            }
        };
        for (var key in from) {
            var state_1 = _loop_1(key);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    }
    exports.forEach = forEach;
    /**
     * Removes an element from the dictionary. Returns {{false}} if the property
     * does not exists.
     */
    function remove(from, key) {
        if (!hasOwnProperty.call(from, key)) {
            return false;
        }
        delete from[key];
        return true;
    }
    exports.remove = remove;
    /**
     * Groups the collection into a dictionary based on the provided
     * group function.
     */
    function groupBy(data, groupFn) {
        var result = Object.create(null);
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var element = data_1[_i];
            var key = groupFn(element);
            var target = result[key];
            if (!target) {
                target = result[key] = [];
            }
            target.push(element);
        }
        return result;
    }
    exports.groupBy = groupBy;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[90/*vs/base/common/decorators*/], __M([1/*require*/,0/*exports*/]), function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function createDecorator(mapFn) {
        return function (target, key, descriptor) {
            var fnKey = null;
            var fn = null;
            if (typeof descriptor.value === 'function') {
                fnKey = 'value';
                fn = descriptor.value;
            }
            else if (typeof descriptor.get === 'function') {
                fnKey = 'get';
                fn = descriptor.get;
            }
            if (!fn) {
                throw new Error('not supported');
            }
            descriptor[fnKey] = mapFn(fn, key);
        };
    }
    exports.createDecorator = createDecorator;
    function memoize(target, key, descriptor) {
        var fnKey = null;
        var fn = null;
        if (typeof descriptor.value === 'function') {
            fnKey = 'value';
            fn = descriptor.value;
            if (fn.length !== 0) {
                console.warn('Memoize should only be used in functions with zero parameters');
            }
        }
        else if (typeof descriptor.get === 'function') {
            fnKey = 'get';
            fn = descriptor.get;
        }
        if (!fn) {
            throw new Error('not supported');
        }
        var memoizeKey = "$memoize$" + key;
        descriptor[fnKey] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!this.hasOwnProperty(memoizeKey)) {
                Object.defineProperty(this, memoizeKey, {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: fn.apply(this, args)
                });
            }
            return this[memoizeKey];
        };
    }
    exports.memoize = memoize;
    function debounce(delay, reducer, initialValueProvider) {
        return createDecorator(function (fn, key) {
            var timerKey = "$debounce$" + key;
            var resultKey = "$debounce$result$" + key;
            return function () {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (!this[resultKey]) {
                    this[resultKey] = initialValueProvider ? initialValueProvider() : void 0;
                }
                clearTimeout(this[timerKey]);
                if (reducer) {
                    this[resultKey] = reducer.apply(void 0, [this[resultKey]].concat(args));
                    args = [this[resultKey]];
                }
                this[timerKey] = setTimeout(function () {
                    fn.apply(_this, args);
                    _this[resultKey] = initialValueProvider ? initialValueProvider() : void 0;
                }, delay);
            };
        });
    }
    exports.debounce = debounce;
});

define(__m[45/*vs/base/common/json*/], __M([1/*require*/,0/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScanError;
    (function (ScanError) {
        ScanError[ScanError["None"] = 0] = "None";
        ScanError[ScanError["UnexpectedEndOfComment"] = 1] = "UnexpectedEndOfComment";
        ScanError[ScanError["UnexpectedEndOfString"] = 2] = "UnexpectedEndOfString";
        ScanError[ScanError["UnexpectedEndOfNumber"] = 3] = "UnexpectedEndOfNumber";
        ScanError[ScanError["InvalidUnicode"] = 4] = "InvalidUnicode";
        ScanError[ScanError["InvalidEscapeCharacter"] = 5] = "InvalidEscapeCharacter";
        ScanError[ScanError["InvalidCharacter"] = 6] = "InvalidCharacter";
    })(ScanError = exports.ScanError || (exports.ScanError = {}));
    var SyntaxKind;
    (function (SyntaxKind) {
        SyntaxKind[SyntaxKind["Unknown"] = 0] = "Unknown";
        SyntaxKind[SyntaxKind["OpenBraceToken"] = 1] = "OpenBraceToken";
        SyntaxKind[SyntaxKind["CloseBraceToken"] = 2] = "CloseBraceToken";
        SyntaxKind[SyntaxKind["OpenBracketToken"] = 3] = "OpenBracketToken";
        SyntaxKind[SyntaxKind["CloseBracketToken"] = 4] = "CloseBracketToken";
        SyntaxKind[SyntaxKind["CommaToken"] = 5] = "CommaToken";
        SyntaxKind[SyntaxKind["ColonToken"] = 6] = "ColonToken";
        SyntaxKind[SyntaxKind["NullKeyword"] = 7] = "NullKeyword";
        SyntaxKind[SyntaxKind["TrueKeyword"] = 8] = "TrueKeyword";
        SyntaxKind[SyntaxKind["FalseKeyword"] = 9] = "FalseKeyword";
        SyntaxKind[SyntaxKind["StringLiteral"] = 10] = "StringLiteral";
        SyntaxKind[SyntaxKind["NumericLiteral"] = 11] = "NumericLiteral";
        SyntaxKind[SyntaxKind["LineCommentTrivia"] = 12] = "LineCommentTrivia";
        SyntaxKind[SyntaxKind["BlockCommentTrivia"] = 13] = "BlockCommentTrivia";
        SyntaxKind[SyntaxKind["LineBreakTrivia"] = 14] = "LineBreakTrivia";
        SyntaxKind[SyntaxKind["Trivia"] = 15] = "Trivia";
        SyntaxKind[SyntaxKind["EOF"] = 16] = "EOF";
    })(SyntaxKind = exports.SyntaxKind || (exports.SyntaxKind = {}));
    /**
     * Creates a JSON scanner on the given text.
     * If ignoreTrivia is set, whitespaces or comments are ignored.
     */
    function createScanner(text, ignoreTrivia) {
        if (ignoreTrivia === void 0) { ignoreTrivia = false; }
        var pos = 0, len = text.length, value = '', tokenOffset = 0, token = 0 /* Unknown */, scanError = 0 /* None */;
        function scanHexDigits(count, exact) {
            var digits = 0;
            var value = 0;
            while (digits < count || !exact) {
                var ch = text.charCodeAt(pos);
                if (ch >= 48 /* _0 */ && ch <= 57 /* _9 */) {
                    value = value * 16 + ch - 48 /* _0 */;
                }
                else if (ch >= 65 /* A */ && ch <= 70 /* F */) {
                    value = value * 16 + ch - 65 /* A */ + 10;
                }
                else if (ch >= 97 /* a */ && ch <= 102 /* f */) {
                    value = value * 16 + ch - 97 /* a */ + 10;
                }
                else {
                    break;
                }
                pos++;
                digits++;
            }
            if (digits < count) {
                value = -1;
            }
            return value;
        }
        function setPosition(newPosition) {
            pos = newPosition;
            value = '';
            tokenOffset = 0;
            token = 0 /* Unknown */;
            scanError = 0 /* None */;
        }
        function scanNumber() {
            var start = pos;
            if (text.charCodeAt(pos) === 48 /* _0 */) {
                pos++;
            }
            else {
                pos++;
                while (pos < text.length && isDigit(text.charCodeAt(pos))) {
                    pos++;
                }
            }
            if (pos < text.length && text.charCodeAt(pos) === 46 /* dot */) {
                pos++;
                if (pos < text.length && isDigit(text.charCodeAt(pos))) {
                    pos++;
                    while (pos < text.length && isDigit(text.charCodeAt(pos))) {
                        pos++;
                    }
                }
                else {
                    scanError = 3 /* UnexpectedEndOfNumber */;
                    return text.substring(start, pos);
                }
            }
            var end = pos;
            if (pos < text.length && (text.charCodeAt(pos) === 69 /* E */ || text.charCodeAt(pos) === 101 /* e */)) {
                pos++;
                if (pos < text.length && text.charCodeAt(pos) === 43 /* plus */ || text.charCodeAt(pos) === 45 /* minus */) {
                    pos++;
                }
                if (pos < text.length && isDigit(text.charCodeAt(pos))) {
                    pos++;
                    while (pos < text.length && isDigit(text.charCodeAt(pos))) {
                        pos++;
                    }
                    end = pos;
                }
                else {
                    scanError = 3 /* UnexpectedEndOfNumber */;
                }
            }
            return text.substring(start, end);
        }
        function scanString() {
            var result = '', start = pos;
            while (true) {
                if (pos >= len) {
                    result += text.substring(start, pos);
                    scanError = 2 /* UnexpectedEndOfString */;
                    break;
                }
                var ch = text.charCodeAt(pos);
                if (ch === 34 /* doubleQuote */) {
                    result += text.substring(start, pos);
                    pos++;
                    break;
                }
                if (ch === 92 /* backslash */) {
                    result += text.substring(start, pos);
                    pos++;
                    if (pos >= len) {
                        scanError = 2 /* UnexpectedEndOfString */;
                        break;
                    }
                    ch = text.charCodeAt(pos++);
                    switch (ch) {
                        case 34 /* doubleQuote */:
                            result += '\"';
                            break;
                        case 92 /* backslash */:
                            result += '\\';
                            break;
                        case 47 /* slash */:
                            result += '/';
                            break;
                        case 98 /* b */:
                            result += '\b';
                            break;
                        case 102 /* f */:
                            result += '\f';
                            break;
                        case 110 /* n */:
                            result += '\n';
                            break;
                        case 114 /* r */:
                            result += '\r';
                            break;
                        case 116 /* t */:
                            result += '\t';
                            break;
                        case 117 /* u */:
                            var ch_1 = scanHexDigits(4, true);
                            if (ch_1 >= 0) {
                                result += String.fromCharCode(ch_1);
                            }
                            else {
                                scanError = 4 /* InvalidUnicode */;
                            }
                            break;
                        default:
                            scanError = 5 /* InvalidEscapeCharacter */;
                    }
                    start = pos;
                    continue;
                }
                if (ch >= 0 && ch <= 0x1f) {
                    if (isLineBreak(ch)) {
                        result += text.substring(start, pos);
                        scanError = 2 /* UnexpectedEndOfString */;
                        break;
                    }
                    else {
                        scanError = 6 /* InvalidCharacter */;
                        // mark as error but continue with string
                    }
                }
                pos++;
            }
            return result;
        }
        function scanNext() {
            value = '';
            scanError = 0 /* None */;
            tokenOffset = pos;
            if (pos >= len) {
                // at the end
                tokenOffset = len;
                return token = 16 /* EOF */;
            }
            var code = text.charCodeAt(pos);
            // trivia: whitespace
            if (isWhiteSpace(code)) {
                do {
                    pos++;
                    value += String.fromCharCode(code);
                    code = text.charCodeAt(pos);
                } while (isWhiteSpace(code));
                return token = 15 /* Trivia */;
            }
            // trivia: newlines
            if (isLineBreak(code)) {
                pos++;
                value += String.fromCharCode(code);
                if (code === 13 /* carriageReturn */ && text.charCodeAt(pos) === 10 /* lineFeed */) {
                    pos++;
                    value += '\n';
                }
                return token = 14 /* LineBreakTrivia */;
            }
            switch (code) {
                // tokens: []{}:,
                case 123 /* openBrace */:
                    pos++;
                    return token = 1 /* OpenBraceToken */;
                case 125 /* closeBrace */:
                    pos++;
                    return token = 2 /* CloseBraceToken */;
                case 91 /* openBracket */:
                    pos++;
                    return token = 3 /* OpenBracketToken */;
                case 93 /* closeBracket */:
                    pos++;
                    return token = 4 /* CloseBracketToken */;
                case 58 /* colon */:
                    pos++;
                    return token = 6 /* ColonToken */;
                case 44 /* comma */:
                    pos++;
                    return token = 5 /* CommaToken */;
                // strings
                case 34 /* doubleQuote */:
                    pos++;
                    value = scanString();
                    return token = 10 /* StringLiteral */;
                // comments
                case 47 /* slash */:
                    var start = pos - 1;
                    // Single-line comment
                    if (text.charCodeAt(pos + 1) === 47 /* slash */) {
                        pos += 2;
                        while (pos < len) {
                            if (isLineBreak(text.charCodeAt(pos))) {
                                break;
                            }
                            pos++;
                        }
                        value = text.substring(start, pos);
                        return token = 12 /* LineCommentTrivia */;
                    }
                    // Multi-line comment
                    if (text.charCodeAt(pos + 1) === 42 /* asterisk */) {
                        pos += 2;
                        var safeLength = len - 1; // For lookahead.
                        var commentClosed = false;
                        while (pos < safeLength) {
                            var ch = text.charCodeAt(pos);
                            if (ch === 42 /* asterisk */ && text.charCodeAt(pos + 1) === 47 /* slash */) {
                                pos += 2;
                                commentClosed = true;
                                break;
                            }
                            pos++;
                        }
                        if (!commentClosed) {
                            pos++;
                            scanError = 1 /* UnexpectedEndOfComment */;
                        }
                        value = text.substring(start, pos);
                        return token = 13 /* BlockCommentTrivia */;
                    }
                    // just a single slash
                    value += String.fromCharCode(code);
                    pos++;
                    return token = 0 /* Unknown */;
                // numbers
                case 45 /* minus */:
                    value += String.fromCharCode(code);
                    pos++;
                    if (pos === len || !isDigit(text.charCodeAt(pos))) {
                        return token = 0 /* Unknown */;
                    }
                // found a minus, followed by a number so
                // we fall through to proceed with scanning
                // numbers
                case 48 /* _0 */:
                case 49 /* _1 */:
                case 50 /* _2 */:
                case 51 /* _3 */:
                case 52 /* _4 */:
                case 53 /* _5 */:
                case 54 /* _6 */:
                case 55 /* _7 */:
                case 56 /* _8 */:
                case 57 /* _9 */:
                    value += scanNumber();
                    return token = 11 /* NumericLiteral */;
                // literals and unknown symbols
                default:
                    // is a literal? Read the full word.
                    while (pos < len && isUnknownContentCharacter(code)) {
                        pos++;
                        code = text.charCodeAt(pos);
                    }
                    if (tokenOffset !== pos) {
                        value = text.substring(tokenOffset, pos);
                        // keywords: true, false, null
                        switch (value) {
                            case 'true': return token = 8 /* TrueKeyword */;
                            case 'false': return token = 9 /* FalseKeyword */;
                            case 'null': return token = 7 /* NullKeyword */;
                        }
                        return token = 0 /* Unknown */;
                    }
                    // some
                    value += String.fromCharCode(code);
                    pos++;
                    return token = 0 /* Unknown */;
            }
        }
        function isUnknownContentCharacter(code) {
            if (isWhiteSpace(code) || isLineBreak(code)) {
                return false;
            }
            switch (code) {
                case 125 /* closeBrace */:
                case 93 /* closeBracket */:
                case 123 /* openBrace */:
                case 91 /* openBracket */:
                case 34 /* doubleQuote */:
                case 58 /* colon */:
                case 44 /* comma */:
                case 47 /* slash */:
                    return false;
            }
            return true;
        }
        function scanNextNonTrivia() {
            var result;
            do {
                result = scanNext();
            } while (result >= 12 /* LineCommentTrivia */ && result <= 15 /* Trivia */);
            return result;
        }
        return {
            setPosition: setPosition,
            getPosition: function () { return pos; },
            scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
            getToken: function () { return token; },
            getTokenValue: function () { return value; },
            getTokenOffset: function () { return tokenOffset; },
            getTokenLength: function () { return pos - tokenOffset; },
            getTokenError: function () { return scanError; }
        };
    }
    exports.createScanner = createScanner;
    function isWhiteSpace(ch) {
        return ch === 32 /* space */ || ch === 9 /* tab */ || ch === 11 /* verticalTab */ || ch === 12 /* formFeed */ ||
            ch === 160 /* nonBreakingSpace */ || ch === 5760 /* ogham */ || ch >= 8192 /* enQuad */ && ch <= 8203 /* zeroWidthSpace */ ||
            ch === 8239 /* narrowNoBreakSpace */ || ch === 8287 /* mathematicalSpace */ || ch === 12288 /* ideographicSpace */ || ch === 65279 /* byteOrderMark */;
    }
    function isLineBreak(ch) {
        return ch === 10 /* lineFeed */ || ch === 13 /* carriageReturn */ || ch === 8232 /* lineSeparator */ || ch === 8233 /* paragraphSeparator */;
    }
    function isDigit(ch) {
        return ch >= 48 /* _0 */ && ch <= 57 /* _9 */;
    }
    var CharacterCodes;
    (function (CharacterCodes) {
        CharacterCodes[CharacterCodes["nullCharacter"] = 0] = "nullCharacter";
        CharacterCodes[CharacterCodes["maxAsciiCharacter"] = 127] = "maxAsciiCharacter";
        CharacterCodes[CharacterCodes["lineFeed"] = 10] = "lineFeed";
        CharacterCodes[CharacterCodes["carriageReturn"] = 13] = "carriageReturn";
        CharacterCodes[CharacterCodes["lineSeparator"] = 8232] = "lineSeparator";
        CharacterCodes[CharacterCodes["paragraphSeparator"] = 8233] = "paragraphSeparator";
        // REVIEW: do we need to support this?  The scanner doesn't, but our IText does.  This seems
        // like an odd disparity?  (Or maybe it's completely fine for them to be different).
        CharacterCodes[CharacterCodes["nextLine"] = 133] = "nextLine";
        // Unicode 3.0 space characters
        CharacterCodes[CharacterCodes["space"] = 32] = "space";
        CharacterCodes[CharacterCodes["nonBreakingSpace"] = 160] = "nonBreakingSpace";
        CharacterCodes[CharacterCodes["enQuad"] = 8192] = "enQuad";
        CharacterCodes[CharacterCodes["emQuad"] = 8193] = "emQuad";
        CharacterCodes[CharacterCodes["enSpace"] = 8194] = "enSpace";
        CharacterCodes[CharacterCodes["emSpace"] = 8195] = "emSpace";
        CharacterCodes[CharacterCodes["threePerEmSpace"] = 8196] = "threePerEmSpace";
        CharacterCodes[CharacterCodes["fourPerEmSpace"] = 8197] = "fourPerEmSpace";
        CharacterCodes[CharacterCodes["sixPerEmSpace"] = 8198] = "sixPerEmSpace";
        CharacterCodes[CharacterCodes["figureSpace"] = 8199] = "figureSpace";
        CharacterCodes[CharacterCodes["punctuationSpace"] = 8200] = "punctuationSpace";
        CharacterCodes[CharacterCodes["thinSpace"] = 8201] = "thinSpace";
        CharacterCodes[CharacterCodes["hairSpace"] = 8202] = "hairSpace";
        CharacterCodes[CharacterCodes["zeroWidthSpace"] = 8203] = "zeroWidthSpace";
        CharacterCodes[CharacterCodes["narrowNoBreakSpace"] = 8239] = "narrowNoBreakSpace";
        CharacterCodes[CharacterCodes["ideographicSpace"] = 12288] = "ideographicSpace";
        CharacterCodes[CharacterCodes["mathematicalSpace"] = 8287] = "mathematicalSpace";
        CharacterCodes[CharacterCodes["ogham"] = 5760] = "ogham";
        CharacterCodes[CharacterCodes["_"] = 95] = "_";
        CharacterCodes[CharacterCodes["$"] = 36] = "$";
        CharacterCodes[CharacterCodes["_0"] = 48] = "_0";
        CharacterCodes[CharacterCodes["_1"] = 49] = "_1";
        CharacterCodes[CharacterCodes["_2"] = 50] = "_2";
        CharacterCodes[CharacterCodes["_3"] = 51] = "_3";
        CharacterCodes[CharacterCodes["_4"] = 52] = "_4";
        CharacterCodes[CharacterCodes["_5"] = 53] = "_5";
        CharacterCodes[CharacterCodes["_6"] = 54] = "_6";
        CharacterCodes[CharacterCodes["_7"] = 55] = "_7";
        CharacterCodes[CharacterCodes["_8"] = 56] = "_8";
        CharacterCodes[CharacterCodes["_9"] = 57] = "_9";
        CharacterCodes[CharacterCodes["a"] = 97] = "a";
        CharacterCodes[CharacterCodes["b"] = 98] = "b";
        CharacterCodes[CharacterCodes["c"] = 99] = "c";
        CharacterCodes[CharacterCodes["d"] = 100] = "d";
        CharacterCodes[CharacterCodes["e"] = 101] = "e";
        CharacterCodes[CharacterCodes["f"] = 102] = "f";
        CharacterCodes[CharacterCodes["g"] = 103] = "g";
        CharacterCodes[CharacterCodes["h"] = 104] = "h";
        CharacterCodes[CharacterCodes["i"] = 105] = "i";
        CharacterCodes[CharacterCodes["j"] = 106] = "j";
        CharacterCodes[CharacterCodes["k"] = 107] = "k";
        CharacterCodes[CharacterCodes["l"] = 108] = "l";
        CharacterCodes[CharacterCodes["m"] = 109] = "m";
        CharacterCodes[CharacterCodes["n"] = 110] = "n";
        CharacterCodes[CharacterCodes["o"] = 111] = "o";
        CharacterCodes[CharacterCodes["p"] = 112] = "p";
        CharacterCodes[CharacterCodes["q"] = 113] = "q";
        CharacterCodes[CharacterCodes["r"] = 114] = "r";
        CharacterCodes[CharacterCodes["s"] = 115] = "s";
        CharacterCodes[CharacterCodes["t"] = 116] = "t";
        CharacterCodes[CharacterCodes["u"] = 117] = "u";
        CharacterCodes[CharacterCodes["v"] = 118] = "v";
        CharacterCodes[CharacterCodes["w"] = 119] = "w";
        CharacterCodes[CharacterCodes["x"] = 120] = "x";
        CharacterCodes[CharacterCodes["y"] = 121] = "y";
        CharacterCodes[CharacterCodes["z"] = 122] = "z";
        CharacterCodes[CharacterCodes["A"] = 65] = "A";
        CharacterCodes[CharacterCodes["B"] = 66] = "B";
        CharacterCodes[CharacterCodes["C"] = 67] = "C";
        CharacterCodes[CharacterCodes["D"] = 68] = "D";
        CharacterCodes[CharacterCodes["E"] = 69] = "E";
        CharacterCodes[CharacterCodes["F"] = 70] = "F";
        CharacterCodes[CharacterCodes["G"] = 71] = "G";
        CharacterCodes[CharacterCodes["H"] = 72] = "H";
        CharacterCodes[CharacterCodes["I"] = 73] = "I";
        CharacterCodes[CharacterCodes["J"] = 74] = "J";
        CharacterCodes[CharacterCodes["K"] = 75] = "K";
        CharacterCodes[CharacterCodes["L"] = 76] = "L";
        CharacterCodes[CharacterCodes["M"] = 77] = "M";
        CharacterCodes[CharacterCodes["N"] = 78] = "N";
        CharacterCodes[CharacterCodes["O"] = 79] = "O";
        CharacterCodes[CharacterCodes["P"] = 80] = "P";
        CharacterCodes[CharacterCodes["Q"] = 81] = "Q";
        CharacterCodes[CharacterCodes["R"] = 82] = "R";
        CharacterCodes[CharacterCodes["S"] = 83] = "S";
        CharacterCodes[CharacterCodes["T"] = 84] = "T";
        CharacterCodes[CharacterCodes["U"] = 85] = "U";
        CharacterCodes[CharacterCodes["V"] = 86] = "V";
        CharacterCodes[CharacterCodes["W"] = 87] = "W";
        CharacterCodes[CharacterCodes["X"] = 88] = "X";
        CharacterCodes[CharacterCodes["Y"] = 89] = "Y";
        CharacterCodes[CharacterCodes["Z"] = 90] = "Z";
        CharacterCodes[CharacterCodes["ampersand"] = 38] = "ampersand";
        CharacterCodes[CharacterCodes["asterisk"] = 42] = "asterisk";
        CharacterCodes[CharacterCodes["at"] = 64] = "at";
        CharacterCodes[CharacterCodes["backslash"] = 92] = "backslash";
        CharacterCodes[CharacterCodes["bar"] = 124] = "bar";
        CharacterCodes[CharacterCodes["caret"] = 94] = "caret";
        CharacterCodes[CharacterCodes["closeBrace"] = 125] = "closeBrace";
        CharacterCodes[CharacterCodes["closeBracket"] = 93] = "closeBracket";
        CharacterCodes[CharacterCodes["closeParen"] = 41] = "closeParen";
        CharacterCodes[CharacterCodes["colon"] = 58] = "colon";
        CharacterCodes[CharacterCodes["comma"] = 44] = "comma";
        CharacterCodes[CharacterCodes["dot"] = 46] = "dot";
        CharacterCodes[CharacterCodes["doubleQuote"] = 34] = "doubleQuote";
        CharacterCodes[CharacterCodes["equals"] = 61] = "equals";
        CharacterCodes[CharacterCodes["exclamation"] = 33] = "exclamation";
        CharacterCodes[CharacterCodes["greaterThan"] = 62] = "greaterThan";
        CharacterCodes[CharacterCodes["lessThan"] = 60] = "lessThan";
        CharacterCodes[CharacterCodes["minus"] = 45] = "minus";
        CharacterCodes[CharacterCodes["openBrace"] = 123] = "openBrace";
        CharacterCodes[CharacterCodes["openBracket"] = 91] = "openBracket";
        CharacterCodes[CharacterCodes["openParen"] = 40] = "openParen";
        CharacterCodes[CharacterCodes["percent"] = 37] = "percent";
        CharacterCodes[CharacterCodes["plus"] = 43] = "plus";
        CharacterCodes[CharacterCodes["question"] = 63] = "question";
        CharacterCodes[CharacterCodes["semicolon"] = 59] = "semicolon";
        CharacterCodes[CharacterCodes["singleQuote"] = 39] = "singleQuote";
        CharacterCodes[CharacterCodes["slash"] = 47] = "slash";
        CharacterCodes[CharacterCodes["tilde"] = 126] = "tilde";
        CharacterCodes[CharacterCodes["backspace"] = 8] = "backspace";
        CharacterCodes[CharacterCodes["formFeed"] = 12] = "formFeed";
        CharacterCodes[CharacterCodes["byteOrderMark"] = 65279] = "byteOrderMark";
        CharacterCodes[CharacterCodes["tab"] = 9] = "tab";
        CharacterCodes[CharacterCodes["verticalTab"] = 11] = "verticalTab";
    })(CharacterCodes || (CharacterCodes = {}));
    var ParseErrorCode;
    (function (ParseErrorCode) {
        ParseErrorCode[ParseErrorCode["InvalidSymbol"] = 0] = "InvalidSymbol";
        ParseErrorCode[ParseErrorCode["InvalidNumberFormat"] = 1] = "InvalidNumberFormat";
        ParseErrorCode[ParseErrorCode["PropertyNameExpected"] = 2] = "PropertyNameExpected";
        ParseErrorCode[ParseErrorCode["ValueExpected"] = 3] = "ValueExpected";
        ParseErrorCode[ParseErrorCode["ColonExpected"] = 4] = "ColonExpected";
        ParseErrorCode[ParseErrorCode["CommaExpected"] = 5] = "CommaExpected";
        ParseErrorCode[ParseErrorCode["CloseBraceExpected"] = 6] = "CloseBraceExpected";
        ParseErrorCode[ParseErrorCode["CloseBracketExpected"] = 7] = "CloseBracketExpected";
        ParseErrorCode[ParseErrorCode["EndOfFileExpected"] = 8] = "EndOfFileExpected";
    })(ParseErrorCode = exports.ParseErrorCode || (exports.ParseErrorCode = {}));
    function getLiteralNodeType(value) {
        switch (typeof value) {
            case 'boolean': return 'boolean';
            case 'number': return 'number';
            case 'string': return 'string';
            default: return 'null';
        }
    }
    /**
     * Parses the given text and returns the object the JSON content represents. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
     * Therefore always check the errors list to find out if the input was valid.
     */
    function parse(text, errors, options) {
        if (errors === void 0) { errors = []; }
        var currentProperty = null;
        var currentParent = [];
        var previousParents = [];
        function onValue(value) {
            if (Array.isArray(currentParent)) {
                currentParent.push(value);
            }
            else if (currentProperty) {
                currentParent[currentProperty] = value;
            }
        }
        var visitor = {
            onObjectBegin: function () {
                var object = {};
                onValue(object);
                previousParents.push(currentParent);
                currentParent = object;
                currentProperty = null;
            },
            onObjectProperty: function (name) {
                currentProperty = name;
            },
            onObjectEnd: function () {
                currentParent = previousParents.pop();
            },
            onArrayBegin: function () {
                var array = [];
                onValue(array);
                previousParents.push(currentParent);
                currentParent = array;
                currentProperty = null;
            },
            onArrayEnd: function () {
                currentParent = previousParents.pop();
            },
            onLiteralValue: onValue,
            onError: function (error) {
                errors.push({ error: error });
            }
        };
        visit(text, visitor, options);
        return currentParent[0];
    }
    exports.parse = parse;
    /**
     * Parses the given text and returns a tree representation the JSON content. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
     */
    function parseTree(text, errors, options) {
        if (errors === void 0) { errors = []; }
        var currentParent = { type: 'array', offset: -1, length: -1, children: [] }; // artificial root
        function ensurePropertyComplete(endOffset) {
            if (currentParent.type === 'property') {
                currentParent.length = endOffset - currentParent.offset;
                currentParent = currentParent.parent;
            }
        }
        function onValue(valueNode) {
            currentParent.children.push(valueNode);
            return valueNode;
        }
        var visitor = {
            onObjectBegin: function (offset) {
                currentParent = onValue({ type: 'object', offset: offset, length: -1, parent: currentParent, children: [] });
            },
            onObjectProperty: function (name, offset, length) {
                currentParent = onValue({ type: 'property', offset: offset, length: -1, parent: currentParent, children: [] });
                currentParent.children.push({ type: 'string', value: name, offset: offset, length: length, parent: currentParent });
            },
            onObjectEnd: function (offset, length) {
                currentParent.length = offset + length - currentParent.offset;
                currentParent = currentParent.parent;
                ensurePropertyComplete(offset + length);
            },
            onArrayBegin: function (offset, length) {
                currentParent = onValue({ type: 'array', offset: offset, length: -1, parent: currentParent, children: [] });
            },
            onArrayEnd: function (offset, length) {
                currentParent.length = offset + length - currentParent.offset;
                currentParent = currentParent.parent;
                ensurePropertyComplete(offset + length);
            },
            onLiteralValue: function (value, offset, length) {
                onValue({ type: getLiteralNodeType(value), offset: offset, length: length, parent: currentParent, value: value });
                ensurePropertyComplete(offset + length);
            },
            onSeparator: function (sep, offset, length) {
                if (currentParent.type === 'property') {
                    if (sep === ':') {
                        currentParent.columnOffset = offset;
                    }
                    else if (sep === ',') {
                        ensurePropertyComplete(offset);
                    }
                }
            },
            onError: function (error) {
                errors.push({ error: error });
            }
        };
        visit(text, visitor, options);
        var result = currentParent.children[0];
        if (result) {
            delete result.parent;
        }
        return result;
    }
    exports.parseTree = parseTree;
    function findNodeAtLocation(root, path) {
        if (!root) {
            return void 0;
        }
        var node = root;
        for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
            var segment = path_1[_i];
            if (typeof segment === 'string') {
                if (node.type !== 'object') {
                    return void 0;
                }
                var found = false;
                for (var _a = 0, _b = node.children; _a < _b.length; _a++) {
                    var propertyNode = _b[_a];
                    if (propertyNode.children[0].value === segment) {
                        node = propertyNode.children[1];
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    return void 0;
                }
            }
            else {
                var index = segment;
                if (node.type !== 'array' || index < 0 || index >= node.children.length) {
                    return void 0;
                }
                node = node.children[index];
            }
        }
        return node;
    }
    exports.findNodeAtLocation = findNodeAtLocation;
    function getNodeValue(node) {
        if (node.type === 'array') {
            return node.children.map(getNodeValue);
        }
        else if (node.type === 'object') {
            var obj = {};
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var prop = _a[_i];
                obj[prop.children[0].value] = getNodeValue(prop.children[1]);
            }
            return obj;
        }
        return node.value;
    }
    exports.getNodeValue = getNodeValue;
    /**
     * Parses the given text and invokes the visitor functions for each object, array and literal reached.
     */
    function visit(text, visitor, options) {
        var _scanner = createScanner(text, false);
        function toNoArgVisit(visitFunction) {
            return visitFunction ? function () { return visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength()); } : function () { return true; };
        }
        function toOneArgVisit(visitFunction) {
            return visitFunction ? function (arg) { return visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength()); } : function () { return true; };
        }
        var onObjectBegin = toNoArgVisit(visitor.onObjectBegin), onObjectProperty = toOneArgVisit(visitor.onObjectProperty), onObjectEnd = toNoArgVisit(visitor.onObjectEnd), onArrayBegin = toNoArgVisit(visitor.onArrayBegin), onArrayEnd = toNoArgVisit(visitor.onArrayEnd), onLiteralValue = toOneArgVisit(visitor.onLiteralValue), onSeparator = toOneArgVisit(visitor.onSeparator), onError = toOneArgVisit(visitor.onError);
        var disallowComments = options && options.disallowComments;
        var disallowTrailingComma = options && options.disallowTrailingComma;
        function scanNext() {
            while (true) {
                var token = _scanner.scan();
                switch (token) {
                    case 12 /* LineCommentTrivia */:
                    case 13 /* BlockCommentTrivia */:
                        if (disallowComments) {
                            handleError(0 /* InvalidSymbol */);
                        }
                        break;
                    case 0 /* Unknown */:
                        handleError(0 /* InvalidSymbol */);
                        break;
                    case 15 /* Trivia */:
                    case 14 /* LineBreakTrivia */:
                        break;
                    default:
                        return token;
                }
            }
        }
        function handleError(error, skipUntilAfter, skipUntil) {
            if (skipUntilAfter === void 0) { skipUntilAfter = []; }
            if (skipUntil === void 0) { skipUntil = []; }
            onError(error);
            if (skipUntilAfter.length + skipUntil.length > 0) {
                var token = _scanner.getToken();
                while (token !== 16 /* EOF */) {
                    if (skipUntilAfter.indexOf(token) !== -1) {
                        scanNext();
                        break;
                    }
                    else if (skipUntil.indexOf(token) !== -1) {
                        break;
                    }
                    token = scanNext();
                }
            }
        }
        function parseString(isValue) {
            var value = _scanner.getTokenValue();
            if (isValue) {
                onLiteralValue(value);
            }
            else {
                onObjectProperty(value);
            }
            scanNext();
            return true;
        }
        function parseLiteral() {
            switch (_scanner.getToken()) {
                case 11 /* NumericLiteral */:
                    var value = 0;
                    try {
                        value = JSON.parse(_scanner.getTokenValue());
                        if (typeof value !== 'number') {
                            handleError(1 /* InvalidNumberFormat */);
                            value = 0;
                        }
                    }
                    catch (e) {
                        handleError(1 /* InvalidNumberFormat */);
                    }
                    onLiteralValue(value);
                    break;
                case 7 /* NullKeyword */:
                    onLiteralValue(null);
                    break;
                case 8 /* TrueKeyword */:
                    onLiteralValue(true);
                    break;
                case 9 /* FalseKeyword */:
                    onLiteralValue(false);
                    break;
                default:
                    return false;
            }
            scanNext();
            return true;
        }
        function parseProperty() {
            if (_scanner.getToken() !== 10 /* StringLiteral */) {
                handleError(2 /* PropertyNameExpected */, [], [2 /* CloseBraceToken */, 5 /* CommaToken */]);
                return false;
            }
            parseString(false);
            if (_scanner.getToken() === 6 /* ColonToken */) {
                onSeparator(':');
                scanNext(); // consume colon
                if (!parseValue()) {
                    handleError(3 /* ValueExpected */, [], [2 /* CloseBraceToken */, 5 /* CommaToken */]);
                }
            }
            else {
                handleError(4 /* ColonExpected */, [], [2 /* CloseBraceToken */, 5 /* CommaToken */]);
            }
            return true;
        }
        function parseObject() {
            onObjectBegin();
            scanNext(); // consume open brace
            var needsComma = false;
            while (_scanner.getToken() !== 2 /* CloseBraceToken */ && _scanner.getToken() !== 16 /* EOF */) {
                if (_scanner.getToken() === 5 /* CommaToken */) {
                    if (!needsComma) {
                        handleError(3 /* ValueExpected */, [], []);
                    }
                    onSeparator(',');
                    scanNext(); // consume comma
                    if (_scanner.getToken() === 2 /* CloseBraceToken */ && !disallowTrailingComma) {
                        break;
                    }
                }
                else if (needsComma) {
                    handleError(5 /* CommaExpected */, [], []);
                }
                if (!parseProperty()) {
                    handleError(3 /* ValueExpected */, [], [2 /* CloseBraceToken */, 5 /* CommaToken */]);
                }
                needsComma = true;
            }
            onObjectEnd();
            if (_scanner.getToken() !== 2 /* CloseBraceToken */) {
                handleError(6 /* CloseBraceExpected */, [2 /* CloseBraceToken */], []);
            }
            else {
                scanNext(); // consume close brace
            }
            return true;
        }
        function parseArray() {
            onArrayBegin();
            scanNext(); // consume open bracket
            var needsComma = false;
            while (_scanner.getToken() !== 4 /* CloseBracketToken */ && _scanner.getToken() !== 16 /* EOF */) {
                if (_scanner.getToken() === 5 /* CommaToken */) {
                    if (!needsComma) {
                        handleError(3 /* ValueExpected */, [], []);
                    }
                    onSeparator(',');
                    scanNext(); // consume comma
                    if (_scanner.getToken() === 4 /* CloseBracketToken */ && !disallowTrailingComma) {
                        break;
                    }
                }
                else if (needsComma) {
                    handleError(5 /* CommaExpected */, [], []);
                }
                if (!parseValue()) {
                    handleError(3 /* ValueExpected */, [], [4 /* CloseBracketToken */, 5 /* CommaToken */]);
                }
                needsComma = true;
            }
            onArrayEnd();
            if (_scanner.getToken() !== 4 /* CloseBracketToken */) {
                handleError(7 /* CloseBracketExpected */, [4 /* CloseBracketToken */], []);
            }
            else {
                scanNext(); // consume close bracket
            }
            return true;
        }
        function parseValue() {
            switch (_scanner.getToken()) {
                case 3 /* OpenBracketToken */:
                    return parseArray();
                case 1 /* OpenBraceToken */:
                    return parseObject();
                case 10 /* StringLiteral */:
                    return parseString(true);
                default:
                    return parseLiteral();
            }
        }
        scanNext();
        if (_scanner.getToken() === 16 /* EOF */) {
            return true;
        }
        if (!parseValue()) {
            handleError(3 /* ValueExpected */, [], []);
            return false;
        }
        if (_scanner.getToken() !== 16 /* EOF */) {
            handleError(8 /* EndOfFileExpected */, [], []);
        }
        return true;
    }
    exports.visit = visit;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[84/*vs/base/common/date*/], __M([1/*require*/,0/*exports*/,11/*vs/base/common/strings*/]), function (require, exports, strings_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function toLocalISOString(date) {
        return date.getFullYear() +
            '-' + strings_1.pad(date.getMonth() + 1, 2) +
            '-' + strings_1.pad(date.getDate(), 2) +
            'T' + strings_1.pad(date.getHours(), 2) +
            ':' + strings_1.pad(date.getMinutes(), 2) +
            ':' + strings_1.pad(date.getSeconds(), 2) +
            '.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
            'Z';
    }
    exports.toLocalISOString = toLocalISOString;
});

define(__m[81/*vs/base/common/graph*/], __M([1/*require*/,0/*exports*/,5/*vs/base/common/types*/,71/*vs/base/common/collections*/]), function (require, exports, types_1, collections_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function newNode(data) {
        return {
            data: data,
            incoming: Object.create(null),
            outgoing: Object.create(null)
        };
    }
    var Graph = /** @class */ (function () {
        function Graph(_hashFn) {
            this._hashFn = _hashFn;
            this._nodes = Object.create(null);
            // empty
        }
        Graph.prototype.roots = function () {
            var ret = [];
            collections_1.forEach(this._nodes, function (entry) {
                if (types_1.isEmptyObject(entry.value.outgoing)) {
                    ret.push(entry.value);
                }
            });
            return ret;
        };
        Graph.prototype.traverse = function (start, inwards, callback) {
            var startNode = this.lookup(start);
            if (!startNode) {
                return;
            }
            this._traverse(startNode, inwards, Object.create(null), callback);
        };
        Graph.prototype._traverse = function (node, inwards, seen, callback) {
            var _this = this;
            var key = this._hashFn(node.data);
            if (seen[key]) {
                return;
            }
            seen[key] = true;
            callback(node.data);
            var nodes = inwards ? node.outgoing : node.incoming;
            collections_1.forEach(nodes, function (entry) { return _this._traverse(entry.value, inwards, seen, callback); });
        };
        Graph.prototype.insertEdge = function (from, to) {
            var fromNode = this.lookupOrInsertNode(from), toNode = this.lookupOrInsertNode(to);
            fromNode.outgoing[this._hashFn(to)] = toNode;
            toNode.incoming[this._hashFn(from)] = fromNode;
        };
        Graph.prototype.removeNode = function (data) {
            var key = this._hashFn(data);
            delete this._nodes[key];
            collections_1.forEach(this._nodes, function (entry) {
                delete entry.value.outgoing[key];
                delete entry.value.incoming[key];
            });
        };
        Graph.prototype.lookupOrInsertNode = function (data) {
            var key = this._hashFn(data);
            var node = this._nodes[key];
            if (!node) {
                node = newNode(data);
                this._nodes[key] = node;
            }
            return node;
        };
        Graph.prototype.lookup = function (data) {
            return this._nodes[this._hashFn(data)];
        };
        Object.defineProperty(Graph.prototype, "length", {
            get: function () {
                return Object.keys(this._nodes).length;
            },
            enumerable: true,
            configurable: true
        });
        Graph.prototype.toString = function () {
            var data = [];
            collections_1.forEach(this._nodes, function (entry) {
                data.push(entry.key + ", (incoming)[" + Object.keys(entry.value.incoming).join(', ') + "], (outgoing)[" + Object.keys(entry.value.outgoing).join(',') + "]");
            });
            return data.join('\n');
        };
        return Graph;
    }());
    exports.Graph = Graph;
});

define(__m[78/*vs/base/common/labels*/], __M([1/*require*/,0/*exports*/,23/*vs/base/common/uri*/,24/*vs/base/common/paths*/,11/*vs/base/common/strings*/,31/*vs/base/common/network*/,18/*vs/base/common/platform*/,95/*vs/base/common/resources*/]), function (require, exports, uri_1, paths_1, strings_1, network_1, platform_1, resources_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @deprecated use LabelService instead
     */
    function getPathLabel(resource, userHomeProvider, rootProvider) {
        if (!resource) {
            return null;
        }
        if (typeof resource === 'string') {
            resource = uri_1.URI.file(resource);
        }
        // return early if we can resolve a relative path label from the root
        var baseResource = rootProvider ? rootProvider.getWorkspaceFolder(resource) : null;
        if (baseResource) {
            var hasMultipleRoots = rootProvider.getWorkspace().folders.length > 1;
            var pathLabel = void 0;
            if (resources_1.isEqual(baseResource.uri, resource, !platform_1.isLinux)) {
                pathLabel = ''; // no label if paths are identical
            }
            else {
                pathLabel = paths_1.normalize(strings_1.ltrim(resource.path.substr(baseResource.uri.path.length), paths_1.sep), true);
            }
            if (hasMultipleRoots) {
                var rootName = (baseResource && baseResource.name) ? baseResource.name : paths_1.basename(baseResource.uri.fsPath);
                pathLabel = pathLabel ? (rootName + ' • ' + pathLabel) : rootName; // always show root basename if there are multiple
            }
            return pathLabel;
        }
        // return if the resource is neither file:// nor untitled:// and no baseResource was provided
        if (resource.scheme !== network_1.Schemas.file && resource.scheme !== network_1.Schemas.untitled) {
            return resource.with({ query: null, fragment: null }).toString(true);
        }
        // convert c:\something => C:\something
        if (hasDriveLetter(resource.fsPath)) {
            return paths_1.normalize(normalizeDriveLetter(resource.fsPath), true);
        }
        // normalize and tildify (macOS, Linux only)
        var res = paths_1.normalize(resource.fsPath, true);
        if (!platform_1.isWindows && userHomeProvider) {
            res = tildify(res, userHomeProvider.userHome);
        }
        return res;
    }
    exports.getPathLabel = getPathLabel;
    function getBaseLabel(resource) {
        if (!resource) {
            return null;
        }
        if (typeof resource === 'string') {
            resource = uri_1.URI.file(resource);
        }
        var base = paths_1.basename(resource.path) || (resource.scheme === network_1.Schemas.file ? resource.fsPath : resource.path) /* can be empty string if '/' is passed in */;
        // convert c: => C:
        if (hasDriveLetter(base)) {
            return normalizeDriveLetter(base);
        }
        return base;
    }
    exports.getBaseLabel = getBaseLabel;
    function hasDriveLetter(path) {
        return platform_1.isWindows && path && path[1] === ':';
    }
    function normalizeDriveLetter(path) {
        if (hasDriveLetter(path)) {
            return path.charAt(0).toUpperCase() + path.slice(1);
        }
        return path;
    }
    exports.normalizeDriveLetter = normalizeDriveLetter;
    var normalizedUserHomeCached = Object.create(null);
    function tildify(path, userHome) {
        if (platform_1.isWindows || !path || !userHome) {
            return path; // unsupported
        }
        // Keep a normalized user home path as cache to prevent accumulated string creation
        var normalizedUserHome = normalizedUserHomeCached.original === userHome ? normalizedUserHomeCached.normalized : void 0;
        if (!normalizedUserHome) {
            normalizedUserHome = "" + strings_1.rtrim(userHome, paths_1.sep) + paths_1.sep;
            normalizedUserHomeCached = { original: userHome, normalized: normalizedUserHome };
        }
        // Linux: case sensitive, macOS: case insensitive
        if (platform_1.isLinux ? strings_1.startsWith(path, normalizedUserHome) : strings_1.startsWithIgnoreCase(path, normalizedUserHome)) {
            path = "~/" + path.substr(normalizedUserHome.length);
        }
        return path;
    }
    exports.tildify = tildify;
    function untildify(path, userHome) {
        return path.replace(/^~($|\/|\\)/, userHome + "$1");
    }
    exports.untildify = untildify;
    /**
     * Shortens the paths but keeps them easy to distinguish.
     * Replaces not important parts with ellipsis.
     * Every shorten path matches only one original path and vice versa.
     *
     * Algorithm for shortening paths is as follows:
     * 1. For every path in list, find unique substring of that path.
     * 2. Unique substring along with ellipsis is shortened path of that path.
     * 3. To find unique substring of path, consider every segment of length from 1 to path.length of path from end of string
     *    and if present segment is not substring to any other paths then present segment is unique path,
     *    else check if it is not present as suffix of any other path and present segment is suffix of path itself,
     *    if it is true take present segment as unique path.
     * 4. Apply ellipsis to unique segment according to whether segment is present at start/in-between/end of path.
     *
     * Example 1
     * 1. consider 2 paths i.e. ['a\\b\\c\\d', 'a\\f\\b\\c\\d']
     * 2. find unique path of first path,
     * 	a. 'd' is present in path2 and is suffix of path2, hence not unique of present path.
     * 	b. 'c' is present in path2 and 'c' is not suffix of present path, similarly for 'b' and 'a' also.
     * 	c. 'd\\c' is suffix of path2.
     *  d. 'b\\c' is not suffix of present path.
     *  e. 'a\\b' is not present in path2, hence unique path is 'a\\b...'.
     * 3. for path2, 'f' is not present in path1 hence unique is '...\\f\\...'.
     *
     * Example 2
     * 1. consider 2 paths i.e. ['a\\b', 'a\\b\\c'].
     * 	a. Even if 'b' is present in path2, as 'b' is suffix of path1 and is not suffix of path2, unique path will be '...\\b'.
     * 2. for path2, 'c' is not present in path1 hence unique path is '..\\c'.
     */
    var ellipsis = '\u2026';
    var unc = '\\\\';
    var home = '~';
    function shorten(paths) {
        var shortenedPaths = new Array(paths.length);
        // for every path
        var match = false;
        for (var pathIndex = 0; pathIndex < paths.length; pathIndex++) {
            var path = paths[pathIndex];
            if (path === '') {
                shortenedPaths[pathIndex] = "." + paths_1.nativeSep;
                continue;
            }
            if (!path) {
                shortenedPaths[pathIndex] = path;
                continue;
            }
            match = true;
            // trim for now and concatenate unc path (e.g. \\network) or root path (/etc, ~/etc) later
            var prefix = '';
            if (path.indexOf(unc) === 0) {
                prefix = path.substr(0, path.indexOf(unc) + unc.length);
                path = path.substr(path.indexOf(unc) + unc.length);
            }
            else if (path.indexOf(paths_1.nativeSep) === 0) {
                prefix = path.substr(0, path.indexOf(paths_1.nativeSep) + paths_1.nativeSep.length);
                path = path.substr(path.indexOf(paths_1.nativeSep) + paths_1.nativeSep.length);
            }
            else if (path.indexOf(home) === 0) {
                prefix = path.substr(0, path.indexOf(home) + home.length);
                path = path.substr(path.indexOf(home) + home.length);
            }
            // pick the first shortest subpath found
            var segments = path.split(paths_1.nativeSep);
            for (var subpathLength = 1; match && subpathLength <= segments.length; subpathLength++) {
                for (var start = segments.length - subpathLength; match && start >= 0; start--) {
                    match = false;
                    var subpath = segments.slice(start, start + subpathLength).join(paths_1.nativeSep);
                    // that is unique to any other path
                    for (var otherPathIndex = 0; !match && otherPathIndex < paths.length; otherPathIndex++) {
                        // suffix subpath treated specially as we consider no match 'x' and 'x/...'
                        if (otherPathIndex !== pathIndex && paths[otherPathIndex] && paths[otherPathIndex].indexOf(subpath) > -1) {
                            var isSubpathEnding = (start + subpathLength === segments.length);
                            // Adding separator as prefix for subpath, such that 'endsWith(src, trgt)' considers subpath as directory name instead of plain string.
                            // prefix is not added when either subpath is root directory or path[otherPathIndex] does not have multiple directories.
                            var subpathWithSep = (start > 0 && paths[otherPathIndex].indexOf(paths_1.nativeSep) > -1) ? paths_1.nativeSep + subpath : subpath;
                            var isOtherPathEnding = strings_1.endsWith(paths[otherPathIndex], subpathWithSep);
                            match = !isSubpathEnding || isOtherPathEnding;
                        }
                    }
                    // found unique subpath
                    if (!match) {
                        var result = '';
                        // preserve disk drive or root prefix
                        if (strings_1.endsWith(segments[0], ':') || prefix !== '') {
                            if (start === 1) {
                                // extend subpath to include disk drive prefix
                                start = 0;
                                subpathLength++;
                                subpath = segments[0] + paths_1.nativeSep + subpath;
                            }
                            if (start > 0) {
                                result = segments[0] + paths_1.nativeSep;
                            }
                            result = prefix + result;
                        }
                        // add ellipsis at the beginning if neeeded
                        if (start > 0) {
                            result = result + ellipsis + paths_1.nativeSep;
                        }
                        result = result + subpath;
                        // add ellipsis at the end if needed
                        if (start + subpathLength < segments.length) {
                            result = result + paths_1.nativeSep + ellipsis;
                        }
                        shortenedPaths[pathIndex] = result;
                    }
                }
            }
            if (match) {
                shortenedPaths[pathIndex] = path; // use full path if no unique subpaths found
            }
        }
        return shortenedPaths;
    }
    exports.shorten = shorten;
    var Type;
    (function (Type) {
        Type[Type["TEXT"] = 0] = "TEXT";
        Type[Type["VARIABLE"] = 1] = "VARIABLE";
        Type[Type["SEPARATOR"] = 2] = "SEPARATOR";
    })(Type || (Type = {}));
    /**
     * Helper to insert values for specific template variables into the string. E.g. "this $(is) a $(template)" can be
     * passed to this function together with an object that maps "is" and "template" to strings to have them replaced.
     * @param value string to which templating is applied
     * @param values the values of the templates to use
     */
    function template(template, values) {
        if (values === void 0) { values = Object.create(null); }
        var segments = [];
        var inVariable = false;
        var char;
        var curVal = '';
        for (var i = 0; i < template.length; i++) {
            char = template[i];
            // Beginning of variable
            if (char === '$' || (inVariable && char === '{')) {
                if (curVal) {
                    segments.push({ value: curVal, type: Type.TEXT });
                }
                curVal = '';
                inVariable = true;
            }
            // End of variable
            else if (char === '}' && inVariable) {
                var resolved = values[curVal];
                // Variable
                if (typeof resolved === 'string') {
                    if (resolved.length) {
                        segments.push({ value: resolved, type: Type.VARIABLE });
                    }
                }
                // Separator
                else if (resolved) {
                    var prevSegment = segments[segments.length - 1];
                    if (!prevSegment || prevSegment.type !== Type.SEPARATOR) {
                        segments.push({ value: resolved.label, type: Type.SEPARATOR }); // prevent duplicate separators
                    }
                }
                curVal = '';
                inVariable = false;
            }
            // Text or Variable Name
            else {
                curVal += char;
            }
        }
        // Tail
        if (curVal && !inVariable) {
            segments.push({ value: curVal, type: Type.TEXT });
        }
        return segments.filter(function (segment, index) {
            // Only keep separator if we have values to the left and right
            if (segment.type === Type.SEPARATOR) {
                var left = segments[index - 1];
                var right = segments[index + 1];
                return [left, right].every(function (segment) { return segment && (segment.type === Type.VARIABLE || segment.type === Type.TEXT) && segment.value.length > 0; });
            }
            // accept any TEXT and VARIABLE
            return true;
        }).map(function (segment) { return segment.value; }).join('');
    }
    exports.template = template;
    /**
     * Handles mnemonics for menu items. Depending on OS:
     * - Windows: Supported via & character (replace && with &)
     * -   Linux: Supported via & character (replace && with &)
     * -   macOS: Unsupported (replace && with empty string)
     */
    function mnemonicMenuLabel(label, forceDisableMnemonics) {
        if (platform_1.isMacintosh || forceDisableMnemonics) {
            return label.replace(/\(&&\w\)|&&/g, '');
        }
        return label.replace(/&&/g, '&');
    }
    exports.mnemonicMenuLabel = mnemonicMenuLabel;
    /**
     * Handles mnemonics for buttons. Depending on OS:
     * - Windows: Supported via & character (replace && with &)
     * -   Linux: Supported via _ character (replace && with _)
     * -   macOS: Unsupported (replace && with empty string)
     */
    function mnemonicButtonLabel(label) {
        if (platform_1.isMacintosh) {
            return label.replace(/\(&&\w\)|&&/g, '');
        }
        return label.replace(/&&/g, platform_1.isWindows ? '&' : '_');
    }
    exports.mnemonicButtonLabel = mnemonicButtonLabel;
    function unmnemonicLabel(label) {
        return label.replace(/&/g, '&&');
    }
    exports.unmnemonicLabel = unmnemonicLabel;
});

define(__m[76/*vs/base/common/glob*/], __M([1/*require*/,0/*exports*/,20/*vs/base/common/arrays*/,11/*vs/base/common/strings*/,24/*vs/base/common/paths*/,44/*vs/base/common/map*/,2/*vs/base/common/winjs.base*/,22/*vs/base/common/async*/]), function (require, exports, arrays, strings, paths, map_1, winjs_base_1, async_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function getEmptyExpression() {
        return Object.create(null);
    }
    exports.getEmptyExpression = getEmptyExpression;
    var GLOBSTAR = '**';
    var GLOB_SPLIT = '/';
    var PATH_REGEX = '[/\\\\]'; // any slash or backslash
    var NO_PATH_REGEX = '[^/\\\\]'; // any non-slash and non-backslash
    var ALL_FORWARD_SLASHES = /\//g;
    function starsToRegExp(starCount) {
        switch (starCount) {
            case 0:
                return '';
            case 1:
                return NO_PATH_REGEX + "*?"; // 1 star matches any number of characters except path separator (/ and \) - non greedy (?)
            default:
                // Matches:  (Path Sep OR Path Val followed by Path Sep OR Path Sep followed by Path Val) 0-many times
                // Group is non capturing because we don't need to capture at all (?:...)
                // Overall we use non-greedy matching because it could be that we match too much
                return "(?:" + PATH_REGEX + "|" + NO_PATH_REGEX + "+" + PATH_REGEX + "|" + PATH_REGEX + NO_PATH_REGEX + "+)*?";
        }
    }
    function splitGlobAware(pattern, splitChar) {
        if (!pattern) {
            return [];
        }
        var segments = [];
        var inBraces = false;
        var inBrackets = false;
        var char;
        var curVal = '';
        for (var i = 0; i < pattern.length; i++) {
            char = pattern[i];
            switch (char) {
                case splitChar:
                    if (!inBraces && !inBrackets) {
                        segments.push(curVal);
                        curVal = '';
                        continue;
                    }
                    break;
                case '{':
                    inBraces = true;
                    break;
                case '}':
                    inBraces = false;
                    break;
                case '[':
                    inBrackets = true;
                    break;
                case ']':
                    inBrackets = false;
                    break;
            }
            curVal += char;
        }
        // Tail
        if (curVal) {
            segments.push(curVal);
        }
        return segments;
    }
    exports.splitGlobAware = splitGlobAware;
    function parseRegExp(pattern) {
        if (!pattern) {
            return '';
        }
        var regEx = '';
        // Split up into segments for each slash found
        var segments = splitGlobAware(pattern, GLOB_SPLIT);
        // Special case where we only have globstars
        if (segments.every(function (s) { return s === GLOBSTAR; })) {
            regEx = '.*';
        }
        // Build regex over segments
        else {
            var previousSegmentWasGlobStar_1 = false;
            segments.forEach(function (segment, index) {
                // Globstar is special
                if (segment === GLOBSTAR) {
                    // if we have more than one globstar after another, just ignore it
                    if (!previousSegmentWasGlobStar_1) {
                        regEx += starsToRegExp(2);
                        previousSegmentWasGlobStar_1 = true;
                    }
                    return;
                }
                // States
                var inBraces = false;
                var braceVal = '';
                var inBrackets = false;
                var bracketVal = '';
                var char;
                for (var i = 0; i < segment.length; i++) {
                    char = segment[i];
                    // Support brace expansion
                    if (char !== '}' && inBraces) {
                        braceVal += char;
                        continue;
                    }
                    // Support brackets
                    if (inBrackets && (char !== ']' || !bracketVal) /* ] is literally only allowed as first character in brackets to match it */) {
                        var res = void 0;
                        // range operator
                        if (char === '-') {
                            res = char;
                        }
                        // negation operator (only valid on first index in bracket)
                        else if ((char === '^' || char === '!') && !bracketVal) {
                            res = '^';
                        }
                        // glob split matching is not allowed within character ranges
                        // see http://man7.org/linux/man-pages/man7/glob.7.html
                        else if (char === GLOB_SPLIT) {
                            res = '';
                        }
                        // anything else gets escaped
                        else {
                            res = strings.escapeRegExpCharacters(char);
                        }
                        bracketVal += res;
                        continue;
                    }
                    switch (char) {
                        case '{':
                            inBraces = true;
                            continue;
                        case '[':
                            inBrackets = true;
                            continue;
                        case '}':
                            var choices = splitGlobAware(braceVal, ',');
                            // Converts {foo,bar} => [foo|bar]
                            var braceRegExp = "(?:" + choices.map(function (c) { return parseRegExp(c); }).join('|') + ")";
                            regEx += braceRegExp;
                            inBraces = false;
                            braceVal = '';
                            break;
                        case ']':
                            regEx += ('[' + bracketVal + ']');
                            inBrackets = false;
                            bracketVal = '';
                            break;
                        case '?':
                            regEx += NO_PATH_REGEX; // 1 ? matches any single character except path separator (/ and \)
                            continue;
                        case '*':
                            regEx += starsToRegExp(1);
                            continue;
                        default:
                            regEx += strings.escapeRegExpCharacters(char);
                    }
                }
                // Tail: Add the slash we had split on if there is more to come and the remaining pattern is not a globstar
                // For example if pattern: some/**/*.js we want the "/" after some to be included in the RegEx to prevent
                // a folder called "something" to match as well.
                // However, if pattern: some/**, we tolerate that we also match on "something" because our globstar behaviour
                // is to match 0-N segments.
                if (index < segments.length - 1 && (segments[index + 1] !== GLOBSTAR || index + 2 < segments.length)) {
                    regEx += PATH_REGEX;
                }
                // reset state
                previousSegmentWasGlobStar_1 = false;
            });
        }
        return regEx;
    }
    // regexes to check for trival glob patterns that just check for String#endsWith
    var T1 = /^\*\*\/\*\.[\w\.-]+$/; // **/*.something
    var T2 = /^\*\*\/([\w\.-]+)\/?$/; // **/something
    var T3 = /^{\*\*\/[\*\.]?[\w\.-]+\/?(,\*\*\/[\*\.]?[\w\.-]+\/?)*}$/; // {**/*.something,**/*.else} or {**/package.json,**/project.json}
    var T3_2 = /^{\*\*\/[\*\.]?[\w\.-]+(\/(\*\*)?)?(,\*\*\/[\*\.]?[\w\.-]+(\/(\*\*)?)?)*}$/; // Like T3, with optional trailing /**
    var T4 = /^\*\*((\/[\w\.-]+)+)\/?$/; // **/something/else
    var T5 = /^([\w\.-]+(\/[\w\.-]+)*)\/?$/; // something/else
    var CACHE = new map_1.LRUCache(10000); // bounded to 10000 elements
    var FALSE = function () {
        return false;
    };
    var NULL = function () {
        return null;
    };
    function parsePattern(arg1, options) {
        if (!arg1) {
            return NULL;
        }
        // Handle IRelativePattern
        var pattern;
        if (typeof arg1 !== 'string') {
            pattern = arg1.pattern;
        }
        else {
            pattern = arg1;
        }
        // Whitespace trimming
        pattern = pattern.trim();
        // Check cache
        var patternKey = pattern + "_" + !!options.trimForExclusions;
        var parsedPattern = CACHE.get(patternKey);
        if (parsedPattern) {
            return wrapRelativePattern(parsedPattern, arg1);
        }
        // Check for Trivias
        var match;
        if (T1.test(pattern)) { // common pattern: **/*.txt just need endsWith check
            var base_1 = pattern.substr(4); // '**/*'.length === 4
            parsedPattern = function (path, basename) {
                return path && strings.endsWith(path, base_1) ? pattern : null;
            };
        }
        else if (match = T2.exec(trimForExclusions(pattern, options))) { // common pattern: **/some.txt just need basename check
            parsedPattern = trivia2(match[1], pattern);
        }
        else if ((options.trimForExclusions ? T3_2 : T3).test(pattern)) { // repetition of common patterns (see above) {**/*.txt,**/*.png}
            parsedPattern = trivia3(pattern, options);
        }
        else if (match = T4.exec(trimForExclusions(pattern, options))) { // common pattern: **/something/else just need endsWith check
            parsedPattern = trivia4and5(match[1].substr(1), pattern, true);
        }
        else if (match = T5.exec(trimForExclusions(pattern, options))) { // common pattern: something/else just need equals check
            parsedPattern = trivia4and5(match[1], pattern, false);
        }
        // Otherwise convert to pattern
        else {
            parsedPattern = toRegExp(pattern);
        }
        // Cache
        CACHE.set(patternKey, parsedPattern);
        return wrapRelativePattern(parsedPattern, arg1);
    }
    function wrapRelativePattern(parsedPattern, arg2) {
        if (typeof arg2 === 'string') {
            return parsedPattern;
        }
        return function (path, basename) {
            if (!paths.isEqualOrParent(path, arg2.base)) {
                return null;
            }
            return parsedPattern(arg2.pathToRelative(arg2.base, path), basename);
        };
    }
    function trimForExclusions(pattern, options) {
        return options.trimForExclusions && strings.endsWith(pattern, '/**') ? pattern.substr(0, pattern.length - 2) : pattern; // dropping **, tailing / is dropped later
    }
    // common pattern: **/some.txt just need basename check
    function trivia2(base, originalPattern) {
        var slashBase = "/" + base;
        var backslashBase = "\\" + base;
        var parsedPattern = function (path, basename) {
            if (!path) {
                return null;
            }
            if (basename) {
                return basename === base ? originalPattern : null;
            }
            return path === base || strings.endsWith(path, slashBase) || strings.endsWith(path, backslashBase) ? originalPattern : null;
        };
        var basenames = [base];
        parsedPattern.basenames = basenames;
        parsedPattern.patterns = [originalPattern];
        parsedPattern.allBasenames = basenames;
        return parsedPattern;
    }
    // repetition of common patterns (see above) {**/*.txt,**/*.png}
    function trivia3(pattern, options) {
        var parsedPatterns = aggregateBasenameMatches(pattern.slice(1, -1).split(',')
            .map(function (pattern) { return parsePattern(pattern, options); })
            .filter(function (pattern) { return pattern !== NULL; }), pattern);
        var n = parsedPatterns.length;
        if (!n) {
            return NULL;
        }
        if (n === 1) {
            return parsedPatterns[0];
        }
        var parsedPattern = function (path, basename) {
            for (var i = 0, n_1 = parsedPatterns.length; i < n_1; i++) {
                if (parsedPatterns[i](path, basename)) {
                    return pattern;
                }
            }
            return null;
        };
        var withBasenames = arrays.first(parsedPatterns, function (pattern) { return !!pattern.allBasenames; });
        if (withBasenames) {
            parsedPattern.allBasenames = withBasenames.allBasenames;
        }
        var allPaths = parsedPatterns.reduce(function (all, current) { return current.allPaths ? all.concat(current.allPaths) : all; }, []);
        if (allPaths.length) {
            parsedPattern.allPaths = allPaths;
        }
        return parsedPattern;
    }
    // common patterns: **/something/else just need endsWith check, something/else just needs and equals check
    function trivia4and5(path, pattern, matchPathEnds) {
        var nativePath = paths.nativeSep !== paths.sep ? path.replace(ALL_FORWARD_SLASHES, paths.nativeSep) : path;
        var nativePathEnd = paths.nativeSep + nativePath;
        var parsedPattern = matchPathEnds ? function (path, basename) {
            return path && (path === nativePath || strings.endsWith(path, nativePathEnd)) ? pattern : null;
        } : function (path, basename) {
            return path && path === nativePath ? pattern : null;
        };
        parsedPattern.allPaths = [(matchPathEnds ? '*/' : './') + path];
        return parsedPattern;
    }
    function toRegExp(pattern) {
        try {
            var regExp_1 = new RegExp("^" + parseRegExp(pattern) + "$");
            return function (path, basename) {
                regExp_1.lastIndex = 0; // reset RegExp to its initial state to reuse it!
                return path && regExp_1.test(path) ? pattern : null;
            };
        }
        catch (error) {
            return NULL;
        }
    }
    function match(arg1, path, hasSibling) {
        if (!arg1 || !path) {
            return false;
        }
        return parse(arg1)(path, undefined, hasSibling);
    }
    exports.match = match;
    function parse(arg1, options) {
        if (options === void 0) { options = {}; }
        if (!arg1) {
            return FALSE;
        }
        // Glob with String
        if (typeof arg1 === 'string' || isRelativePattern(arg1)) {
            var parsedPattern_1 = parsePattern(arg1, options);
            if (parsedPattern_1 === NULL) {
                return FALSE;
            }
            var resultPattern = function (path, basename) {
                return !!parsedPattern_1(path, basename);
            };
            if (parsedPattern_1.allBasenames) {
                resultPattern.allBasenames = parsedPattern_1.allBasenames;
            }
            if (parsedPattern_1.allPaths) {
                resultPattern.allPaths = parsedPattern_1.allPaths;
            }
            return resultPattern;
        }
        // Glob with Expression
        return parsedExpression(arg1, options);
    }
    exports.parse = parse;
    function hasSiblingPromiseFn(siblingsFn) {
        if (!siblingsFn) {
            return undefined;
        }
        var siblings;
        return function (name) {
            if (!siblings) {
                siblings = (siblingsFn() || winjs_base_1.TPromise.as([]))
                    .then(function (list) { return list ? listToMap(list) : {}; });
            }
            return siblings.then(function (map) { return !!map[name]; });
        };
    }
    exports.hasSiblingPromiseFn = hasSiblingPromiseFn;
    function hasSiblingFn(siblingsFn) {
        if (!siblingsFn) {
            return undefined;
        }
        var siblings;
        return function (name) {
            if (!siblings) {
                var list = siblingsFn();
                siblings = list ? listToMap(list) : {};
            }
            return !!siblings[name];
        };
    }
    exports.hasSiblingFn = hasSiblingFn;
    function listToMap(list) {
        var map = {};
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var key = list_1[_i];
            map[key] = true;
        }
        return map;
    }
    function isRelativePattern(obj) {
        var rp = obj;
        return rp && typeof rp.base === 'string' && typeof rp.pattern === 'string' && typeof rp.pathToRelative === 'function';
    }
    exports.isRelativePattern = isRelativePattern;
    /**
     * Same as `parse`, but the ParsedExpression is guaranteed to return a Promise
     */
    function parseToAsync(expression, options) {
        var parsedExpression = parse(expression, options);
        return function (path, basename, hasSibling) {
            var result = parsedExpression(path, basename, hasSibling);
            return result instanceof winjs_base_1.TPromise ? result : winjs_base_1.TPromise.as(result);
        };
    }
    exports.parseToAsync = parseToAsync;
    function getBasenameTerms(patternOrExpression) {
        return patternOrExpression.allBasenames || [];
    }
    exports.getBasenameTerms = getBasenameTerms;
    function getPathTerms(patternOrExpression) {
        return patternOrExpression.allPaths || [];
    }
    exports.getPathTerms = getPathTerms;
    function parsedExpression(expression, options) {
        var parsedPatterns = aggregateBasenameMatches(Object.getOwnPropertyNames(expression)
            .map(function (pattern) { return parseExpressionPattern(pattern, expression[pattern], options); })
            .filter(function (pattern) { return pattern !== NULL; }));
        var n = parsedPatterns.length;
        if (!n) {
            return NULL;
        }
        if (!parsedPatterns.some(function (parsedPattern) { return parsedPattern.requiresSiblings; })) {
            if (n === 1) {
                return parsedPatterns[0];
            }
            var resultExpression_1 = function (path, basename) {
                for (var i = 0, n_2 = parsedPatterns.length; i < n_2; i++) {
                    // Pattern matches path
                    var result = parsedPatterns[i](path, basename);
                    if (result) {
                        return result;
                    }
                }
                return null;
            };
            var withBasenames_1 = arrays.first(parsedPatterns, function (pattern) { return !!pattern.allBasenames; });
            if (withBasenames_1) {
                resultExpression_1.allBasenames = withBasenames_1.allBasenames;
            }
            var allPaths_1 = parsedPatterns.reduce(function (all, current) { return current.allPaths ? all.concat(current.allPaths) : all; }, []);
            if (allPaths_1.length) {
                resultExpression_1.allPaths = allPaths_1;
            }
            return resultExpression_1;
        }
        var resultExpression = function (path, basename, hasSibling) {
            var name;
            for (var i = 0, n_3 = parsedPatterns.length; i < n_3; i++) {
                // Pattern matches path
                var parsedPattern = parsedPatterns[i];
                if (parsedPattern.requiresSiblings && hasSibling) {
                    if (!basename) {
                        basename = paths.basename(path);
                    }
                    if (!name) {
                        name = basename.substr(0, basename.length - paths.extname(path).length);
                    }
                }
                var result = parsedPattern(path, basename, name, hasSibling);
                if (result) {
                    return result;
                }
            }
            return null;
        };
        var withBasenames = arrays.first(parsedPatterns, function (pattern) { return !!pattern.allBasenames; });
        if (withBasenames) {
            resultExpression.allBasenames = withBasenames.allBasenames;
        }
        var allPaths = parsedPatterns.reduce(function (all, current) { return current.allPaths ? all.concat(current.allPaths) : all; }, []);
        if (allPaths.length) {
            resultExpression.allPaths = allPaths;
        }
        return resultExpression;
    }
    function parseExpressionPattern(pattern, value, options) {
        if (value === false) {
            return NULL; // pattern is disabled
        }
        var parsedPattern = parsePattern(pattern, options);
        if (parsedPattern === NULL) {
            return NULL;
        }
        // Expression Pattern is <boolean>
        if (typeof value === 'boolean') {
            return parsedPattern;
        }
        // Expression Pattern is <SiblingClause>
        if (value) {
            var when_1 = value.when;
            if (typeof when_1 === 'string') {
                var result = function (path, basename, name, hasSibling) {
                    if (!hasSibling || !parsedPattern(path, basename)) {
                        return null;
                    }
                    var clausePattern = when_1.replace('$(basename)', name);
                    var matched = hasSibling(clausePattern);
                    return async_1.isThenable(matched) ?
                        matched.then(function (m) { return m ? pattern : null; }) :
                        matched ? pattern : null;
                };
                result.requiresSiblings = true;
                return result;
            }
        }
        // Expression is Anything
        return parsedPattern;
    }
    function aggregateBasenameMatches(parsedPatterns, result) {
        var basenamePatterns = parsedPatterns.filter(function (parsedPattern) { return !!parsedPattern.basenames; });
        if (basenamePatterns.length < 2) {
            return parsedPatterns;
        }
        var basenames = basenamePatterns.reduce(function (all, current) { return all.concat(current.basenames); }, []);
        var patterns;
        if (result) {
            patterns = [];
            for (var i = 0, n = basenames.length; i < n; i++) {
                patterns.push(result);
            }
        }
        else {
            patterns = basenamePatterns.reduce(function (all, current) { return all.concat(current.patterns); }, []);
        }
        var aggregate = function (path, basename) {
            if (!path) {
                return null;
            }
            if (!basename) {
                var i = void 0;
                for (i = path.length; i > 0; i--) {
                    var ch = path.charCodeAt(i - 1);
                    if (ch === 47 /* Slash */ || ch === 92 /* Backslash */) {
                        break;
                    }
                }
                basename = path.substr(i);
            }
            var index = basenames.indexOf(basename);
            return index !== -1 ? patterns[index] : null;
        };
        aggregate.basenames = basenames;
        aggregate.patterns = patterns;
        aggregate.allBasenames = basenames;
        var aggregatedPatterns = parsedPatterns.filter(function (parsedPattern) { return !parsedPattern.basenames; });
        aggregatedPatterns.push(aggregate);
        return aggregatedPatterns;
    }
});

define(__m[46/*vs/base/common/mime*/], __M([1/*require*/,0/*exports*/,24/*vs/base/common/paths*/,11/*vs/base/common/strings*/,76/*vs/base/common/glob*/]), function (require, exports, paths, strings, glob_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MIME_TEXT = 'text/plain';
    exports.MIME_BINARY = 'application/octet-stream';
    exports.MIME_UNKNOWN = 'application/unknown';
    var registeredAssociations = [];
    var nonUserRegisteredAssociations = [];
    var userRegisteredAssociations = [];
    /**
     * Associate a text mime to the registry.
     */
    function registerTextMime(association, warnOnOverwrite) {
        if (warnOnOverwrite === void 0) { warnOnOverwrite = false; }
        // Register
        var associationItem = toTextMimeAssociationItem(association);
        registeredAssociations.push(associationItem);
        if (!associationItem.userConfigured) {
            nonUserRegisteredAssociations.push(associationItem);
        }
        else {
            userRegisteredAssociations.push(associationItem);
        }
        // Check for conflicts unless this is a user configured association
        if (warnOnOverwrite && !associationItem.userConfigured) {
            registeredAssociations.forEach(function (a) {
                if (a.mime === associationItem.mime || a.userConfigured) {
                    return; // same mime or userConfigured is ok
                }
                if (associationItem.extension && a.extension === associationItem.extension) {
                    console.warn("Overwriting extension <<" + associationItem.extension + ">> to now point to mime <<" + associationItem.mime + ">>");
                }
                if (associationItem.filename && a.filename === associationItem.filename) {
                    console.warn("Overwriting filename <<" + associationItem.filename + ">> to now point to mime <<" + associationItem.mime + ">>");
                }
                if (associationItem.filepattern && a.filepattern === associationItem.filepattern) {
                    console.warn("Overwriting filepattern <<" + associationItem.filepattern + ">> to now point to mime <<" + associationItem.mime + ">>");
                }
                if (associationItem.firstline && a.firstline === associationItem.firstline) {
                    console.warn("Overwriting firstline <<" + associationItem.firstline + ">> to now point to mime <<" + associationItem.mime + ">>");
                }
            });
        }
    }
    exports.registerTextMime = registerTextMime;
    function toTextMimeAssociationItem(association) {
        return {
            id: association.id,
            mime: association.mime,
            filename: association.filename,
            extension: association.extension,
            filepattern: association.filepattern,
            firstline: association.firstline,
            userConfigured: association.userConfigured,
            filenameLowercase: association.filename ? association.filename.toLowerCase() : void 0,
            extensionLowercase: association.extension ? association.extension.toLowerCase() : void 0,
            filepatternLowercase: association.filepattern ? association.filepattern.toLowerCase() : void 0,
            filepatternOnPath: association.filepattern ? association.filepattern.indexOf(paths.sep) >= 0 : false
        };
    }
    /**
     * Clear text mimes from the registry.
     */
    function clearTextMimes(onlyUserConfigured) {
        if (!onlyUserConfigured) {
            registeredAssociations = [];
            nonUserRegisteredAssociations = [];
            userRegisteredAssociations = [];
        }
        else {
            registeredAssociations = registeredAssociations.filter(function (a) { return !a.userConfigured; });
            userRegisteredAssociations = [];
        }
    }
    exports.clearTextMimes = clearTextMimes;
    /**
     * Given a file, return the best matching mime type for it
     */
    function guessMimeTypes(path, firstLine) {
        if (!path) {
            return [exports.MIME_UNKNOWN];
        }
        path = path.toLowerCase();
        var filename = paths.basename(path);
        // 1.) User configured mappings have highest priority
        var configuredMime = guessMimeTypeByPath(path, filename, userRegisteredAssociations);
        if (configuredMime) {
            return [configuredMime, exports.MIME_TEXT];
        }
        // 2.) Registered mappings have middle priority
        var registeredMime = guessMimeTypeByPath(path, filename, nonUserRegisteredAssociations);
        if (registeredMime) {
            return [registeredMime, exports.MIME_TEXT];
        }
        // 3.) Firstline has lowest priority
        if (firstLine) {
            var firstlineMime = guessMimeTypeByFirstline(firstLine);
            if (firstlineMime) {
                return [firstlineMime, exports.MIME_TEXT];
            }
        }
        return [exports.MIME_UNKNOWN];
    }
    exports.guessMimeTypes = guessMimeTypes;
    function guessMimeTypeByPath(path, filename, associations) {
        var filenameMatch;
        var patternMatch;
        var extensionMatch;
        // We want to prioritize associations based on the order they are registered so that the last registered
        // association wins over all other. This is for https://github.com/Microsoft/vscode/issues/20074
        for (var i = associations.length - 1; i >= 0; i--) {
            var association = associations[i];
            // First exact name match
            if (filename === association.filenameLowercase) {
                filenameMatch = association;
                break; // take it!
            }
            // Longest pattern match
            if (association.filepattern) {
                if (!patternMatch || association.filepattern.length > patternMatch.filepattern.length) {
                    var target = association.filepatternOnPath ? path : filename; // match on full path if pattern contains path separator
                    if (glob_1.match(association.filepatternLowercase, target)) {
                        patternMatch = association;
                    }
                }
            }
            // Longest extension match
            if (association.extension) {
                if (!extensionMatch || association.extension.length > extensionMatch.extension.length) {
                    if (strings.endsWith(filename, association.extensionLowercase)) {
                        extensionMatch = association;
                    }
                }
            }
        }
        // 1.) Exact name match has second highest prio
        if (filenameMatch) {
            return filenameMatch.mime;
        }
        // 2.) Match on pattern
        if (patternMatch) {
            return patternMatch.mime;
        }
        // 3.) Match on extension comes next
        if (extensionMatch) {
            return extensionMatch.mime;
        }
        return null;
    }
    function guessMimeTypeByFirstline(firstLine) {
        if (strings.startsWithUTF8BOM(firstLine)) {
            firstLine = firstLine.substr(1);
        }
        if (firstLine.length > 0) {
            for (var i = 0; i < registeredAssociations.length; ++i) {
                var association = registeredAssociations[i];
                if (!association.firstline) {
                    continue;
                }
                var matches = firstLine.match(association.firstline);
                if (matches && matches.length > 0) {
                    return association.mime;
                }
            }
        }
        return null;
    }
    function isUnspecific(mime) {
        if (!mime) {
            return true;
        }
        if (typeof mime === 'string') {
            return mime === exports.MIME_BINARY || mime === exports.MIME_TEXT || mime === exports.MIME_UNKNOWN;
        }
        return mime.length === 1 && isUnspecific(mime[0]);
    }
    exports.isUnspecific = isUnspecific;
    /**
     * Returns a suggestion for the filename by the following logic:
     * 1. If a relevant extension exists and is an actual filename extension (starting with a dot), suggest the prefix appended by the first one.
     * 2. Otherwise, if there are other extensions, suggest the first one.
     * 3. Otherwise, suggest the prefix.
     */
    function suggestFilename(langId, prefix) {
        var extensions = registeredAssociations
            .filter(function (assoc) { return !assoc.userConfigured && assoc.extension && assoc.id === langId; })
            .map(function (assoc) { return assoc.extension; });
        var extensionsWithDotFirst = extensions
            .filter(function (assoc) { return strings.startsWith(assoc, '.'); });
        if (extensionsWithDotFirst.length > 0) {
            return prefix + extensionsWithDotFirst[0];
        }
        return extensions[0] || prefix;
    }
    exports.suggestFilename = suggestFilename;
    // Known media mimes that we can handle
    var mapExtToMediaMimes = {
        '.bmp': 'image/bmp',
        '.gif': 'image/gif',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpg',
        '.jpe': 'image/jpg',
        '.png': 'image/png',
        '.tiff': 'image/tiff',
        '.tif': 'image/tiff',
        '.ico': 'image/x-icon',
        '.tga': 'image/x-tga',
        '.psd': 'image/vnd.adobe.photoshop',
        '.webp': 'image/webp',
        '.mid': 'audio/midi',
        '.midi': 'audio/midi',
        '.mp4a': 'audio/mp4',
        '.mpga': 'audio/mpeg',
        '.mp2': 'audio/mpeg',
        '.mp2a': 'audio/mpeg',
        '.mp3': 'audio/mpeg',
        '.m2a': 'audio/mpeg',
        '.m3a': 'audio/mpeg',
        '.oga': 'audio/ogg',
        '.ogg': 'audio/ogg',
        '.spx': 'audio/ogg',
        '.aac': 'audio/x-aac',
        '.wav': 'audio/x-wav',
        '.wma': 'audio/x-ms-wma',
        '.mp4': 'video/mp4',
        '.mp4v': 'video/mp4',
        '.mpg4': 'video/mp4',
        '.mpeg': 'video/mpeg',
        '.mpg': 'video/mpeg',
        '.mpe': 'video/mpeg',
        '.m1v': 'video/mpeg',
        '.m2v': 'video/mpeg',
        '.ogv': 'video/ogg',
        '.qt': 'video/quicktime',
        '.mov': 'video/quicktime',
        '.webm': 'video/webm',
        '.mkv': 'video/x-matroska',
        '.mk3d': 'video/x-matroska',
        '.mks': 'video/x-matroska',
        '.wmv': 'video/x-ms-wmv',
        '.flv': 'video/x-flv',
        '.avi': 'video/x-msvideo',
        '.movie': 'video/x-sgi-movie'
    };
    function getMediaMime(path) {
        var ext = paths.extname(path);
        return mapExtToMediaMimes[ext.toLowerCase()];
    }
    exports.getMediaMime = getMediaMime;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[73/*vs/base/node/paths*/], __M([1/*require*/,0/*exports*/,72/*vs/base/common/amd*/]), function (require, exports, amd_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var pathsPath = amd_1.getPathFromAmdModule(require, 'paths');
    var paths = require.__$__nodeRequire(pathsPath);
    exports.getAppDataPath = paths.getAppDataPath;
    exports.getDefaultUserDataPath = paths.getDefaultUserDataPath;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(__m[69/*vs/base/node/proxy*/], __M([1/*require*/,0/*exports*/,68/*url*/,5/*vs/base/common/types*/]), function (require, exports, url_1, types_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function getSystemProxyURI(requestURL) {
        if (requestURL.protocol === 'http:') {
            return process.env.HTTP_PROXY || process.env.http_proxy || null;
        }
        else if (requestURL.protocol === 'https:') {
            return process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy || null;
        }
        return null;
    }
    function getProxyAgent(rawRequestURL, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var requestURL, proxyURL, proxyEndpoint, opts, Ctor, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        requestURL = url_1.parse(rawRequestURL);
                        proxyURL = options.proxyUrl || getSystemProxyURI(requestURL);
                        if (!proxyURL) {
                            return [2 /*return*/, null];
                        }
                        proxyEndpoint = url_1.parse(proxyURL);
                        if (!/^https?:$/.test(proxyEndpoint.protocol)) {
                            return [2 /*return*/, null];
                        }
                        opts = {
                            host: proxyEndpoint.hostname,
                            port: Number(proxyEndpoint.port),
                            auth: proxyEndpoint.auth,
                            rejectUnauthorized: types_1.isBoolean(options.strictSSL) ? options.strictSSL : true
                        };
                        if (!(requestURL.protocol === 'http:')) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve_1, reject_1) { require(['http-proxy-agent'], resolve_1, reject_1); })];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, new Promise(function (resolve_2, reject_2) { require(['https-proxy-agent'], resolve_2, reject_2); })];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        Ctor = _a;
                        return [2 /*return*/, new Ctor(opts)];
                }
            });
        });
    }
    exports.getProxyAgent = getProxyAgent;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[64/*vs/base/node/config*/], __M([1/*require*/,0/*exports*/,26/*fs*/,8/*path*/,7/*vs/base/common/objects*/,12/*vs/base/common/lifecycle*/,9/*vs/base/common/event*/,45/*vs/base/common/json*/,32/*vs/base/node/extfs*/,18/*vs/base/common/platform*/]), function (require, exports, fs, path_1, objects, lifecycle_1, event_1, json, extfs, platform_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A simple helper to watch a configured file for changes and process its contents as JSON object.
     * Supports:
     * - comments in JSON files and errors
     * - symlinks for the config file itself
     * - delayed processing of changes to accomodate for lots of changes
     * - configurable defaults
     */
    var ConfigWatcher = /** @class */ (function () {
        function ConfigWatcher(_path, options) {
            if (options === void 0) { options = { changeBufferDelay: 0, defaultConfig: Object.create(null), onError: function (error) { return console.error(error); } }; }
            this._path = _path;
            this.options = options;
            this.disposables = [];
            this.configName = path_1.basename(this._path);
            this._onDidUpdateConfiguration = new event_1.Emitter();
            this.disposables.push(this._onDidUpdateConfiguration);
            this.registerWatcher();
            this.initAsync();
        }
        Object.defineProperty(ConfigWatcher.prototype, "path", {
            get: function () {
                return this._path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigWatcher.prototype, "hasParseErrors", {
            get: function () {
                return this.parseErrors && this.parseErrors.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigWatcher.prototype, "onDidUpdateConfiguration", {
            get: function () {
                return this._onDidUpdateConfiguration.event;
            },
            enumerable: true,
            configurable: true
        });
        ConfigWatcher.prototype.initAsync = function () {
            var _this = this;
            this.loadAsync(function (config) {
                if (!_this.loaded) {
                    _this.updateCache(config); // prevent race condition if config was loaded sync already
                }
                if (_this.options.initCallback) {
                    _this.options.initCallback(_this.getConfig());
                }
            });
        };
        ConfigWatcher.prototype.updateCache = function (value) {
            this.cache = value;
            this.loaded = true;
        };
        ConfigWatcher.prototype.loadSync = function () {
            try {
                return this.parse(fs.readFileSync(this._path).toString());
            }
            catch (error) {
                return this.options.defaultConfig;
            }
        };
        ConfigWatcher.prototype.loadAsync = function (callback) {
            var _this = this;
            fs.readFile(this._path, function (error, raw) {
                if (error) {
                    return callback(_this.options.defaultConfig);
                }
                return callback(_this.parse(raw.toString()));
            });
        };
        ConfigWatcher.prototype.parse = function (raw) {
            var res;
            try {
                this.parseErrors = [];
                res = this.options.parse ? this.options.parse(raw, this.parseErrors) : json.parse(raw, this.parseErrors);
            }
            catch (error) {
                // Ignore parsing errors
            }
            return res || this.options.defaultConfig;
        };
        ConfigWatcher.prototype.registerWatcher = function () {
            var _this = this;
            // Watch the parent of the path so that we detect ADD and DELETES
            var parentFolder = path_1.dirname(this._path);
            this.watch(parentFolder, true);
            // Check if the path is a symlink and watch its target if so
            fs.lstat(this._path, function (err, stat) {
                if (err || stat.isDirectory()) {
                    return; // path is not a valid file
                }
                // We found a symlink
                if (stat.isSymbolicLink()) {
                    fs.readlink(_this._path, function (err, realPath) {
                        if (err) {
                            return; // path is not a valid symlink
                        }
                        _this.watch(realPath, false);
                    });
                }
            });
        };
        ConfigWatcher.prototype.watch = function (path, isParentFolder) {
            var _this = this;
            if (this.disposed) {
                return; // avoid watchers that will never get disposed by checking for being disposed
            }
            this.disposables.push(extfs.watch(path, function (type, file) { return _this.onConfigFileChange(type, file, isParentFolder); }, function (error) { return _this.options.onError(error); }));
        };
        ConfigWatcher.prototype.onConfigFileChange = function (eventType, filename, isParentFolder) {
            var _this = this;
            if (isParentFolder) {
                // Windows: in some cases the filename contains artifacts from the absolute path
                // see https://github.com/nodejs/node/issues/19170
                // As such, we have to ensure that the filename basename is used for comparison.
                if (platform_1.isWindows && filename && filename !== this.configName) {
                    filename = path_1.basename(filename);
                }
                if (filename !== this.configName) {
                    return; // a change to a sibling file that is not our config file
                }
            }
            if (this.timeoutHandle) {
                global.clearTimeout(this.timeoutHandle);
                this.timeoutHandle = null;
            }
            // we can get multiple change events for one change, so we buffer through a timeout
            this.timeoutHandle = global.setTimeout(function () { return _this.reload(); }, this.options.changeBufferDelay);
        };
        ConfigWatcher.prototype.reload = function (callback) {
            var _this = this;
            this.loadAsync(function (currentConfig) {
                if (!objects.equals(currentConfig, _this.cache)) {
                    _this.updateCache(currentConfig);
                    _this._onDidUpdateConfiguration.fire({ config: _this.cache });
                }
                if (callback) {
                    return callback(currentConfig);
                }
            });
        };
        ConfigWatcher.prototype.getConfig = function () {
            this.ensureLoaded();
            return this.cache;
        };
        ConfigWatcher.prototype.getValue = function (key, fallback) {
            this.ensureLoaded();
            if (!key) {
                return fallback;
            }
            var value = this.cache ? this.cache[key] : void 0;
            return typeof value !== 'undefined' ? value : fallback;
        };
        ConfigWatcher.prototype.ensureLoaded = function () {
            if (!this.loaded) {
                this.updateCache(this.loadSync());
            }
        };
        ConfigWatcher.prototype.dispose = function () {
            this.disposed = true;
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        return ConfigWatcher;
    }());
    exports.ConfigWatcher = ConfigWatcher;
});

define(__m[62/*vs/nls!vs/base/common/errorMessage*/], __M([6/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/base/common/errorMessage", data); });
define(__m[36/*vs/base/common/errorMessage*/], __M([1/*require*/,0/*exports*/,62/*vs/nls!vs/base/common/errorMessage*/,5/*vs/base/common/types*/,20/*vs/base/common/arrays*/]), function (require, exports, nls, types, arrays) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function exceptionToErrorMessage(exception, verbose) {
        if (exception.message) {
            if (verbose && (exception.stack || exception.stacktrace)) {
                return nls.localize(0, null, detectSystemErrorMessage(exception), exception.stack || exception.stacktrace);
            }
            return detectSystemErrorMessage(exception);
        }
        return nls.localize(1, null);
    }
    function detectSystemErrorMessage(exception) {
        // See https://nodejs.org/api/errors.html#errors_class_system_error
        if (typeof exception.code === 'string' && typeof exception.errno === 'number' && typeof exception.syscall === 'string') {
            return nls.localize(2, null, exception.message);
        }
        return exception.message;
    }
    /**
     * Tries to generate a human readable error message out of the error. If the verbose parameter
     * is set to true, the error message will include stacktrace details if provided.
     *
     * @returns A string containing the error message.
     */
    function toErrorMessage(error, verbose) {
        if (error === void 0) { error = null; }
        if (verbose === void 0) { verbose = false; }
        if (!error) {
            return nls.localize(3, null);
        }
        if (Array.isArray(error)) {
            var errors = arrays.coalesce(error);
            var msg = toErrorMessage(errors[0], verbose);
            if (errors.length > 1) {
                return nls.localize(4, null, msg, errors.length);
            }
            return msg;
        }
        if (types.isString(error)) {
            return error;
        }
        if (error.detail) {
            var detail = error.detail;
            if (detail.error) {
                return exceptionToErrorMessage(detail.error, verbose);
            }
            if (detail.exception) {
                return exceptionToErrorMessage(detail.exception, verbose);
            }
        }
        if (error.stack) {
            return exceptionToErrorMessage(error, verbose);
        }
        if (error.message) {
            return error.message;
        }
        return nls.localize(5, null);
    }
    exports.toErrorMessage = toErrorMessage;
});

define(__m[61/*vs/nls!vs/base/common/severity*/], __M([6/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/base/common/severity", data); });
define(__m[25/*vs/base/common/severity*/], __M([1/*require*/,0/*exports*/,61/*vs/nls!vs/base/common/severity*/,11/*vs/base/common/strings*/]), function (require, exports, nls, strings) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Severity;
    (function (Severity) {
        Severity[Severity["Ignore"] = 0] = "Ignore";
        Severity[Severity["Info"] = 1] = "Info";
        Severity[Severity["Warning"] = 2] = "Warning";
        Severity[Severity["Error"] = 3] = "Error";
    })(Severity || (Severity = {}));
    (function (Severity) {
        var _error = 'error';
        var _warning = 'warning';
        var _warn = 'warn';
        var _info = 'info';
        var _displayStrings = Object.create(null);
        _displayStrings[Severity.Error] = nls.localize(0, null);
        _displayStrings[Severity.Warning] = nls.localize(1, null);
        _displayStrings[Severity.Info] = nls.localize(2, null);
        /**
         * Parses 'error', 'warning', 'warn', 'info' in call casings
         * and falls back to ignore.
         */
        function fromValue(value) {
            if (!value) {
                return Severity.Ignore;
            }
            if (strings.equalsIgnoreCase(_error, value)) {
                return Severity.Error;
            }
            if (strings.equalsIgnoreCase(_warning, value) || strings.equalsIgnoreCase(_warn, value)) {
                return Severity.Warning;
            }
            if (strings.equalsIgnoreCase(_info, value)) {
                return Severity.Info;
            }
            return Severity.Ignore;
        }
        Severity.fromValue = fromValue;
    })(Severity || (Severity = {}));
    exports.default = Severity;
});


define(__m[60/*vs/nls!vs/platform/configuration/common/configurationRegistry*/], __M([6/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/configuration/common/configurationRegistry", data); });
define(__m[58/*vs/nls!vs/platform/dialogs/common/dialogs*/], __M([6/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/dialogs/common/dialogs", data); });
define(__m[57/*vs/nls!vs/platform/dialogs/node/dialogService*/], __M([6/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/dialogs/node/dialogService", data); });
define(__m[56/*vs/nls!vs/platform/extensionManagement/common/extensionManagement*/], __M([6/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/extensionManagement/common/extensionManagement", data); });
define(__m[55/*vs/nls!vs/platform/extensionManagement/node/extensionManagementService*/], __M([6/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/extensionManagement/node/extensionManagementService", data); });
define(__m[51/*vs/nls!vs/platform/extensions/node/extensionValidator*/], __M([6/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/extensions/node/extensionValidator", data); });
define(__m[50/*vs/nls!vs/platform/node/zip*/], __M([6/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/node/zip", data); });
define(__m[47/*vs/nls!vs/platform/request/node/request*/], __M([6/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/request/node/request", data); });
define(__m[74/*vs/nls!vs/platform/telemetry/common/telemetryService*/], __M([6/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/telemetry/common/telemetryService", data); });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[48/*vs/platform/dialogs/node/dialogService*/], __M([1/*require*/,0/*exports*/,100/*readline*/,2/*vs/base/common/winjs.base*/,25/*vs/base/common/severity*/,57/*vs/nls!vs/platform/dialogs/node/dialogService*/,15/*vs/base/common/errors*/]), function (require, exports, readline, winjs_base_1, severity_1, nls_1, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CommandLineDialogService = /** @class */ (function () {
        function CommandLineDialogService() {
        }
        CommandLineDialogService.prototype.show = function (severity, message, options) {
            var _this = this;
            var promise = new winjs_base_1.TPromise(function (c, e) {
                var rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                    terminal: true
                });
                rl.prompt();
                rl.write(_this.toQuestion(message, options));
                rl.prompt();
                rl.once('line', function (answer) {
                    rl.close();
                    c(_this.toOption(answer, options));
                });
                rl.once('SIGINT', function () {
                    rl.close();
                    e(errors_1.canceled());
                });
            });
            return promise;
        };
        CommandLineDialogService.prototype.toQuestion = function (message, options) {
            return options.reduce(function (previousValue, currentValue, currentIndex) {
                return previousValue + currentValue + '(' + currentIndex + ')' + (currentIndex < options.length - 1 ? ' | ' : '\n');
            }, message + ' ');
        };
        CommandLineDialogService.prototype.toOption = function (answer, options) {
            var value = parseInt(answer);
            if (!isNaN(value)) {
                return value;
            }
            answer = answer.toLocaleLowerCase();
            for (var i = 0; i < options.length; i++) {
                if (options[i].toLocaleLowerCase() === answer) {
                    return i;
                }
            }
            return -1;
        };
        CommandLineDialogService.prototype.confirm = function (confirmation) {
            return this.show(severity_1.default.Info, confirmation.message, [confirmation.primaryButton, confirmation.secondaryButton || nls_1.localize(0, null)]).then(function (index) {
                return {
                    confirmed: index === 0
                };
            });
        };
        return CommandLineDialogService;
    }());
    exports.CommandLineDialogService = CommandLineDialogService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define(__m[29/*vs/platform/extensionManagement/common/extensionManagementUtil*/], __M([1/*require*/,0/*exports*/,11/*vs/base/common/strings*/]), function (require, exports, strings_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function areSameExtensions(a, b) {
        if (a.uuid && b.uuid) {
            return a.uuid === b.uuid;
        }
        if (a.id === b.id) {
            return true;
        }
        return strings_1.compareIgnoreCase(a.id, b.id) === 0;
    }
    exports.areSameExtensions = areSameExtensions;
    function adoptToGalleryExtensionId(id) {
        return id.toLocaleLowerCase();
    }
    exports.adoptToGalleryExtensionId = adoptToGalleryExtensionId;
    function getGalleryExtensionId(publisher, name) {
        return publisher.toLocaleLowerCase() + "." + name.toLocaleLowerCase();
    }
    exports.getGalleryExtensionId = getGalleryExtensionId;
    function getGalleryExtensionIdFromLocal(local) {
        return local.manifest ? getGalleryExtensionId(local.manifest.publisher, local.manifest.name) : local.identifier.id;
    }
    exports.getGalleryExtensionIdFromLocal = getGalleryExtensionIdFromLocal;
    exports.LOCAL_EXTENSION_ID_REGEX = /^([^.]+\..+)-(\d+\.\d+\.\d+(-.*)?)$/;
    function getIdFromLocalExtensionId(localExtensionId) {
        var matches = exports.LOCAL_EXTENSION_ID_REGEX.exec(localExtensionId);
        if (matches && matches[1]) {
            return adoptToGalleryExtensionId(matches[1]);
        }
        return adoptToGalleryExtensionId(localExtensionId);
    }
    exports.getIdFromLocalExtensionId = getIdFromLocalExtensionId;
    function getLocalExtensionId(id, version) {
        return id + "-" + version;
    }
    exports.getLocalExtensionId = getLocalExtensionId;
    function groupByExtension(extensions, getExtensionIdentifier) {
        var byExtension = [];
        var findGroup = function (extension) {
            for (var _i = 0, byExtension_1 = byExtension; _i < byExtension_1.length; _i++) {
                var group = byExtension_1[_i];
                if (group.some(function (e) { return areSameExtensions(getExtensionIdentifier(e), getExtensionIdentifier(extension)); })) {
                    return group;
                }
            }
            return null;
        };
        for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
            var extension = extensions_1[_i];
            var group = findGroup(extension);
            if (group) {
                group.push(extension);
            }
            else {
                byExtension.push([extension]);
            }
        }
        return byExtension;
    }
    exports.groupByExtension = groupByExtension;
    function getLocalExtensionTelemetryData(extension) {
        return {
            id: getGalleryExtensionIdFromLocal(extension),
            name: extension.manifest.name,
            galleryId: null,
            publisherId: extension.metadata ? extension.metadata.publisherId : null,
            publisherName: extension.manifest.publisher,
            publisherDisplayName: extension.metadata ? extension.metadata.publisherDisplayName : null,
            dependencies: extension.manifest.extensionDependencies && extension.manifest.extensionDependencies.length > 0
        };
    }
    exports.getLocalExtensionTelemetryData = getLocalExtensionTelemetryData;
    /* __GDPR__FRAGMENT__
        "GalleryExtensionTelemetryData" : {
            "id" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
            "name": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
            "galleryId": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
            "publisherId": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
            "publisherName": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
            "publisherDisplayName": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
            "dependencies": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
            "${include}": [
                "${GalleryExtensionTelemetryData2}"
            ]
        }
    */
    function getGalleryExtensionTelemetryData(extension) {
        return __assign({ id: extension.identifier.id, name: extension.name, galleryId: extension.identifier.uuid, publisherId: extension.publisherId, publisherName: extension.publisher, publisherDisplayName: extension.publisherDisplayName, dependencies: extension.properties.dependencies.length > 0 }, extension.telemetryData);
    }
    exports.getGalleryExtensionTelemetryData = getGalleryExtensionTelemetryData;
    exports.BetterMergeDisabledNowKey = 'extensions/bettermergedisablednow';
    exports.BetterMergeId = 'pprice.better-merge';
    function getMaliciousExtensionsSet(report) {
        var result = new Set();
        for (var _i = 0, report_1 = report; _i < report_1.length; _i++) {
            var extension = report_1[_i];
            if (extension.malicious) {
                result.add(extension.id.id);
            }
        }
        return result;
    }
    exports.getMaliciousExtensionsSet = getMaliciousExtensionsSet;
    var nonWorkspaceExtensions = new Set();
    function isWorkspaceExtension(manifest, configurationService) {
        var extensionId = getGalleryExtensionId(manifest.publisher, manifest.name);
        var configuredWorkspaceExtensions = configurationService.getValue('_workbench.workspaceExtensions') || [];
        if (configuredWorkspaceExtensions.length) {
            if (configuredWorkspaceExtensions.indexOf(extensionId) !== -1) {
                return true;
            }
            if (configuredWorkspaceExtensions.indexOf("-" + extensionId) !== -1) {
                return false;
            }
        }
        if (manifest.main) {
            if ((manifest.categories || []).indexOf('Workspace Extension') !== -1) {
                return true;
            }
            return !nonWorkspaceExtensions.has(extensionId);
        }
        return false;
    }
    exports.isWorkspaceExtension = isWorkspaceExtension;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[52/*vs/platform/extensionManagement/common/extensionNls*/], __M([1/*require*/,0/*exports*/,7/*vs/base/common/objects*/]), function (require, exports, objects_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var nlsRegex = /^%([\w\d.-]+)%$/i;
    function localizeManifest(manifest, translations) {
        var patcher = function (value) {
            if (typeof value !== 'string') {
                return undefined;
            }
            var match = nlsRegex.exec(value);
            if (!match) {
                return undefined;
            }
            return translations[match[1]] || value;
        };
        return objects_1.cloneAndChange(manifest, patcher);
    }
    exports.localizeManifest = localizeManifest;
});

define(__m[53/*vs/platform/extensions/common/extensions*/], __M([1/*require*/,0/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MANIFEST_CACHE_FOLDER = 'CachedExtensions';
    exports.USER_MANIFEST_CACHE_FILE = 'user';
    exports.BUILTIN_MANIFEST_CACHE_FILE = 'builtin';
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(__m[54/*vs/platform/extensionManagement/node/extensionsManifestCache*/], __M([1/*require*/,0/*exports*/,12/*vs/base/common/lifecycle*/,8/*path*/,53/*vs/platform/extensions/common/extensions*/,16/*vs/base/node/pfs*/]), function (require, exports, lifecycle_1, path_1, extensions_1, pfs) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtensionsManifestCache = /** @class */ (function (_super) {
        __extends(ExtensionsManifestCache, _super);
        function ExtensionsManifestCache(environmentService, extensionsManagementServuce) {
            var _this = _super.call(this) || this;
            _this.environmentService = environmentService;
            _this.extensionsManifestCache = path_1.join(_this.environmentService.userDataPath, extensions_1.MANIFEST_CACHE_FOLDER, extensions_1.USER_MANIFEST_CACHE_FILE);
            _this._register(extensionsManagementServuce.onDidInstallExtension(function (e) { return _this.onDidInstallExtension(e); }));
            _this._register(extensionsManagementServuce.onDidUninstallExtension(function (e) { return _this.onDidUnInstallExtension(e); }));
            return _this;
        }
        ExtensionsManifestCache.prototype.onDidInstallExtension = function (e) {
            if (!e.error) {
                this.invalidate();
            }
        };
        ExtensionsManifestCache.prototype.onDidUnInstallExtension = function (e) {
            if (!e.error) {
                this.invalidate();
            }
        };
        ExtensionsManifestCache.prototype.invalidate = function () {
            pfs.del(this.extensionsManifestCache).then(function () { }, function () { });
        };
        return ExtensionsManifestCache;
    }(lifecycle_1.Disposable));
    exports.ExtensionsManifestCache = ExtensionsManifestCache;
});

define(__m[42/*vs/platform/instantiation/common/descriptors*/], __M([1/*require*/,0/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SyncDescriptor = /** @class */ (function () {
        function SyncDescriptor(ctor) {
            var _staticArguments = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                _staticArguments[_i - 1] = arguments[_i];
            }
            this.ctor = ctor;
            this.staticArguments = _staticArguments;
        }
        return SyncDescriptor;
    }());
    exports.SyncDescriptor = SyncDescriptor;
    exports.createSyncDescriptor = function (ctor) {
        var staticArguments = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            staticArguments[_i - 1] = arguments[_i];
        }
        return new (SyncDescriptor.bind.apply(SyncDescriptor, [void 0, ctor].concat(staticArguments)))();
    };
});

define(__m[41/*vs/platform/dialogs/common/dialogs*/], __M([1/*require*/,0/*exports*/,4/*vs/platform/instantiation/common/instantiation*/,24/*vs/base/common/paths*/,58/*vs/nls!vs/platform/dialogs/common/dialogs*/]), function (require, exports, instantiation_1, paths_1, nls_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IDialogService = instantiation_1.createDecorator('dialogService');
    var MAX_CONFIRM_FILES = 10;
    function getConfirmMessage(start, resourcesToConfirm) {
        var message = [start];
        message.push('');
        message.push.apply(message, resourcesToConfirm.slice(0, MAX_CONFIRM_FILES).map(function (r) { return paths_1.basename(r.fsPath); }));
        if (resourcesToConfirm.length > MAX_CONFIRM_FILES) {
            if (resourcesToConfirm.length - MAX_CONFIRM_FILES === 1) {
                message.push(nls_1.localize(0, null));
            }
            else {
                message.push(nls_1.localize(1, null, resourcesToConfirm.length - MAX_CONFIRM_FILES));
            }
        }
        message.push('');
        return message.join('\n');
    }
    exports.getConfirmMessage = getConfirmMessage;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[59/*vs/platform/download/common/download*/], __M([1/*require*/,0/*exports*/,4/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IDownloadService = instantiation_1.createDecorator('downloadService');
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[19/*vs/platform/environment/common/environment*/], __M([1/*require*/,0/*exports*/,4/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IEnvironmentService = instantiation_1.createDecorator('environmentService');
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[37/*vs/platform/extensionManagement/common/extensionManagement*/], __M([1/*require*/,0/*exports*/,56/*vs/nls!vs/platform/extensionManagement/common/extensionManagement*/,4/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, nls_1, instantiation_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EXTENSION_IDENTIFIER_PATTERN = '^([a-z0-9A-Z][a-z0-9\-A-Z]*)\\.([a-z0-9A-Z][a-z0-9\-A-Z]*)$';
    exports.EXTENSION_IDENTIFIER_REGEX = new RegExp(exports.EXTENSION_IDENTIFIER_PATTERN);
    function isIExtensionIdentifier(thing) {
        return thing
            && typeof thing === 'object'
            && typeof thing.id === 'string'
            && (!thing.uuid || typeof thing.uuid === 'string');
    }
    exports.isIExtensionIdentifier = isIExtensionIdentifier;
    var LocalExtensionType;
    (function (LocalExtensionType) {
        LocalExtensionType[LocalExtensionType["System"] = 0] = "System";
        LocalExtensionType[LocalExtensionType["User"] = 1] = "User";
    })(LocalExtensionType = exports.LocalExtensionType || (exports.LocalExtensionType = {}));
    exports.IExtensionManagementService = instantiation_1.createDecorator('extensionManagementService');
    exports.IExtensionGalleryService = instantiation_1.createDecorator('extensionGalleryService');
    var SortBy;
    (function (SortBy) {
        SortBy[SortBy["NoneOrRelevance"] = 0] = "NoneOrRelevance";
        SortBy[SortBy["LastUpdatedDate"] = 1] = "LastUpdatedDate";
        SortBy[SortBy["Title"] = 2] = "Title";
        SortBy[SortBy["PublisherName"] = 3] = "PublisherName";
        SortBy[SortBy["InstallCount"] = 4] = "InstallCount";
        SortBy[SortBy["PublishedDate"] = 5] = "PublishedDate";
        SortBy[SortBy["AverageRating"] = 6] = "AverageRating";
        SortBy[SortBy["WeightedRating"] = 12] = "WeightedRating";
    })(SortBy = exports.SortBy || (exports.SortBy = {}));
    var SortOrder;
    (function (SortOrder) {
        SortOrder[SortOrder["Default"] = 0] = "Default";
        SortOrder[SortOrder["Ascending"] = 1] = "Ascending";
        SortOrder[SortOrder["Descending"] = 2] = "Descending";
    })(SortOrder = exports.SortOrder || (exports.SortOrder = {}));
    var StatisticType;
    (function (StatisticType) {
        StatisticType["Uninstall"] = "uninstall";
    })(StatisticType = exports.StatisticType || (exports.StatisticType = {}));
    var InstallOperation;
    (function (InstallOperation) {
        InstallOperation[InstallOperation["None"] = 0] = "None";
        InstallOperation[InstallOperation["Install"] = 1] = "Install";
        InstallOperation[InstallOperation["Update"] = 2] = "Update";
    })(InstallOperation = exports.InstallOperation || (exports.InstallOperation = {}));
    exports.IExtensionManagementServerService = instantiation_1.createDecorator('extensionManagementServerService');
    var EnablementState;
    (function (EnablementState) {
        EnablementState[EnablementState["Disabled"] = 0] = "Disabled";
        EnablementState[EnablementState["WorkspaceDisabled"] = 1] = "WorkspaceDisabled";
        EnablementState[EnablementState["Enabled"] = 2] = "Enabled";
        EnablementState[EnablementState["WorkspaceEnabled"] = 3] = "WorkspaceEnabled";
    })(EnablementState = exports.EnablementState || (exports.EnablementState = {}));
    exports.IExtensionEnablementService = instantiation_1.createDecorator('extensionEnablementService');
    exports.IExtensionTipsService = instantiation_1.createDecorator('extensionTipsService');
    var ExtensionRecommendationReason;
    (function (ExtensionRecommendationReason) {
        ExtensionRecommendationReason[ExtensionRecommendationReason["Workspace"] = 0] = "Workspace";
        ExtensionRecommendationReason[ExtensionRecommendationReason["File"] = 1] = "File";
        ExtensionRecommendationReason[ExtensionRecommendationReason["Executable"] = 2] = "Executable";
        ExtensionRecommendationReason[ExtensionRecommendationReason["DynamicWorkspace"] = 3] = "DynamicWorkspace";
        ExtensionRecommendationReason[ExtensionRecommendationReason["Experimental"] = 4] = "Experimental";
    })(ExtensionRecommendationReason = exports.ExtensionRecommendationReason || (exports.ExtensionRecommendationReason = {}));
    exports.ExtensionsLabel = nls_1.localize(0, null);
    exports.ExtensionsChannelId = 'extensions';
    exports.PreferencesLabel = nls_1.localize(1, null);
});

define(__m[33/*vs/platform/instantiation/common/serviceCollection*/], __M([1/*require*/,0/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ServiceCollection = /** @class */ (function () {
        function ServiceCollection() {
            var entries = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                entries[_i] = arguments[_i];
            }
            this._entries = new Map();
            for (var _a = 0, entries_1 = entries; _a < entries_1.length; _a++) {
                var _b = entries_1[_a], id = _b[0], service = _b[1];
                this.set(id, service);
            }
        }
        ServiceCollection.prototype.set = function (id, instanceOrDescriptor) {
            var result = this._entries.get(id);
            this._entries.set(id, instanceOrDescriptor);
            return result;
        };
        ServiceCollection.prototype.forEach = function (callback) {
            this._entries.forEach(function (value, key) { return callback(key, value); });
        };
        ServiceCollection.prototype.has = function (id) {
            return this._entries.has(id);
        };
        ServiceCollection.prototype.get = function (id) {
            return this._entries.get(id);
        };
        return ServiceCollection;
    }());
    exports.ServiceCollection = ServiceCollection;
});

define(__m[63/*vs/platform/instantiation/common/instantiationService*/], __M([1/*require*/,0/*exports*/,15/*vs/base/common/errors*/,5/*vs/base/common/types*/,30/*vs/base/common/assert*/,81/*vs/base/common/graph*/,42/*vs/platform/instantiation/common/descriptors*/,4/*vs/platform/instantiation/common/instantiation*/,33/*vs/platform/instantiation/common/serviceCollection*/]), function (require, exports, errors_1, types_1, assert, graph_1, descriptors_1, instantiation_1, serviceCollection_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var InstantiationService = /** @class */ (function () {
        function InstantiationService(services, strict) {
            if (services === void 0) { services = new serviceCollection_1.ServiceCollection(); }
            if (strict === void 0) { strict = false; }
            this._services = services;
            this._strict = strict;
            this._services.set(instantiation_1.IInstantiationService, this);
        }
        InstantiationService.prototype.createChild = function (services) {
            var _this = this;
            this._services.forEach(function (id, thing) {
                if (services.has(id)) {
                    return;
                }
                // If we copy descriptors we might end up with
                // multiple instances of the same service
                if (thing instanceof descriptors_1.SyncDescriptor) {
                    thing = _this._createAndCacheServiceInstance(id, thing);
                }
                services.set(id, thing);
            });
            return new InstantiationService(services, this._strict);
        };
        InstantiationService.prototype.invokeFunction = function (signature) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var accessor;
            try {
                accessor = {
                    get: function (id, isOptional) {
                        var result = _this._getOrCreateServiceInstance(id);
                        if (!result && isOptional !== instantiation_1.optional) {
                            throw new Error("[invokeFunction] unknown service '" + id + "'");
                        }
                        return result;
                    }
                };
                return signature.apply(undefined, [accessor].concat(args));
            }
            finally {
                accessor.get = function () {
                    throw errors_1.illegalState('service accessor is only valid during the invocation of its target method');
                };
            }
        };
        InstantiationService.prototype.createInstance = function (param) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            if (param instanceof descriptors_1.SyncDescriptor) {
                // sync
                return this._createInstance(param, rest);
            }
            else {
                // sync, just ctor
                return this._createInstance(new descriptors_1.SyncDescriptor(param), rest);
            }
        };
        InstantiationService.prototype._createInstance = function (desc, args) {
            // arguments given by createInstance-call and/or the descriptor
            var staticArgs = desc.staticArguments.concat(args);
            // arguments defined by service decorators
            var serviceDependencies = instantiation_1._util.getServiceDependencies(desc.ctor).sort(function (a, b) { return a.index - b.index; });
            var serviceArgs = [];
            for (var _i = 0, serviceDependencies_1 = serviceDependencies; _i < serviceDependencies_1.length; _i++) {
                var dependency = serviceDependencies_1[_i];
                var service = this._getOrCreateServiceInstance(dependency.id);
                if (!service && this._strict && !dependency.optional) {
                    throw new Error("[createInstance] " + desc.ctor.name + " depends on UNKNOWN service " + dependency.id + ".");
                }
                serviceArgs.push(service);
            }
            var firstServiceArgPos = serviceDependencies.length > 0 ? serviceDependencies[0].index : staticArgs.length;
            // check for argument mismatches, adjust static args if needed
            if (staticArgs.length !== firstServiceArgPos) {
                console.warn("[createInstance] First service dependency of " + desc.ctor.name + " at position " + (firstServiceArgPos + 1) + " conflicts with " + staticArgs.length + " static arguments");
                var delta = firstServiceArgPos - staticArgs.length;
                if (delta > 0) {
                    staticArgs = staticArgs.concat(new Array(delta));
                }
                else {
                    staticArgs = staticArgs.slice(0, firstServiceArgPos);
                }
            }
            // // check for missing args
            // for (let i = 0; i < serviceArgs.length; i++) {
            // 	if (!serviceArgs[i]) {
            // 		console.warn(`${desc.ctor.name} MISSES service dependency ${serviceDependencies[i].id}`, new Error().stack);
            // 	}
            // }
            // now create the instance
            var argArray = [desc.ctor];
            argArray.push.apply(argArray, staticArgs);
            argArray.push.apply(argArray, serviceArgs);
            return types_1.create.apply(null, argArray);
        };
        InstantiationService.prototype._getOrCreateServiceInstance = function (id) {
            var thing = this._services.get(id);
            if (thing instanceof descriptors_1.SyncDescriptor) {
                return this._createAndCacheServiceInstance(id, thing);
            }
            else {
                return thing;
            }
        };
        InstantiationService.prototype._createAndCacheServiceInstance = function (id, desc) {
            assert.ok(this._services.get(id) instanceof descriptors_1.SyncDescriptor);
            var graph = new graph_1.Graph(function (data) { return data.id.toString(); });
            function throwCycleError() {
                var err = new Error('[createInstance] cyclic dependency between services');
                err.message = graph.toString();
                throw err;
            }
            var count = 0;
            var stack = [{ id: id, desc: desc }];
            while (stack.length) {
                var item = stack.pop();
                graph.lookupOrInsertNode(item);
                // TODO@joh use the graph to find a cycle
                // a weak heuristic for cycle checks
                if (count++ > 100) {
                    throwCycleError();
                }
                // check all dependencies for existence and if the need to be created first
                var dependencies = instantiation_1._util.getServiceDependencies(item.desc.ctor);
                for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
                    var dependency = dependencies_1[_i];
                    var instanceOrDesc = this._services.get(dependency.id);
                    if (!instanceOrDesc && !dependency.optional) {
                        console.warn("[createInstance] " + id + " depends on " + dependency.id + " which is NOT registered.");
                    }
                    if (instanceOrDesc instanceof descriptors_1.SyncDescriptor) {
                        var d = { id: dependency.id, desc: instanceOrDesc };
                        graph.insertEdge(item, d);
                        stack.push(d);
                    }
                }
            }
            while (true) {
                var roots = graph.roots();
                // if there is no more roots but still
                // nodes in the graph we have a cycle
                if (roots.length === 0) {
                    if (graph.length !== 0) {
                        throwCycleError();
                    }
                    break;
                }
                for (var _a = 0, roots_1 = roots; _a < roots_1.length; _a++) {
                    var root = roots_1[_a];
                    // create instance and overwrite the service collections
                    var instance = this._createInstance(root.data.desc, []);
                    this._services.set(root.data.id, instance);
                    graph.removeNode(root.data);
                }
            }
            return this._services.get(id);
        };
        return InstantiationService;
    }());
    exports.InstantiationService = InstantiationService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/













define(__m[10/*vs/platform/log/common/log*/], __M([1/*require*/,0/*exports*/,4/*vs/platform/instantiation/common/instantiation*/,12/*vs/base/common/lifecycle*/,18/*vs/base/common/platform*/,9/*vs/base/common/event*/]), function (require, exports, instantiation_1, lifecycle_1, platform_1, event_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ILogService = instantiation_1.createDecorator('logService');
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["Trace"] = 0] = "Trace";
        LogLevel[LogLevel["Debug"] = 1] = "Debug";
        LogLevel[LogLevel["Info"] = 2] = "Info";
        LogLevel[LogLevel["Warning"] = 3] = "Warning";
        LogLevel[LogLevel["Error"] = 4] = "Error";
        LogLevel[LogLevel["Critical"] = 5] = "Critical";
        LogLevel[LogLevel["Off"] = 6] = "Off";
    })(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
    exports.DEFAULT_LOG_LEVEL = LogLevel.Info;
    var AbstractLogService = /** @class */ (function (_super) {
        __extends(AbstractLogService, _super);
        function AbstractLogService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.level = exports.DEFAULT_LOG_LEVEL;
            _this._onDidChangeLogLevel = _this._register(new event_1.Emitter());
            _this.onDidChangeLogLevel = _this._onDidChangeLogLevel.event;
            return _this;
        }
        AbstractLogService.prototype.setLevel = function (level) {
            if (this.level !== level) {
                this.level = level;
                this._onDidChangeLogLevel.fire(this.level);
            }
        };
        AbstractLogService.prototype.getLevel = function () {
            return this.level;
        };
        return AbstractLogService;
    }(lifecycle_1.Disposable));
    exports.AbstractLogService = AbstractLogService;
    var ConsoleLogMainService = /** @class */ (function (_super) {
        __extends(ConsoleLogMainService, _super);
        function ConsoleLogMainService(logLevel) {
            if (logLevel === void 0) { logLevel = exports.DEFAULT_LOG_LEVEL; }
            var _this = _super.call(this) || this;
            _this.setLevel(logLevel);
            _this.useColors = !platform_1.isWindows;
            return _this;
        }
        ConsoleLogMainService.prototype.trace = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Trace) {
                if (this.useColors) {
                    console.log.apply(console, ["\u001B[90m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
                }
                else {
                    console.log.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
                }
            }
        };
        ConsoleLogMainService.prototype.debug = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Debug) {
                if (this.useColors) {
                    console.log.apply(console, ["\u001B[90m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
                }
                else {
                    console.log.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
                }
            }
        };
        ConsoleLogMainService.prototype.info = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Info) {
                if (this.useColors) {
                    console.log.apply(console, ["\u001B[90m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
                }
                else {
                    console.log.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
                }
            }
        };
        ConsoleLogMainService.prototype.warn = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Warning) {
                if (this.useColors) {
                    console.warn.apply(console, ["\u001B[93m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
                }
                else {
                    console.warn.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
                }
            }
        };
        ConsoleLogMainService.prototype.error = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Error) {
                if (this.useColors) {
                    console.error.apply(console, ["\u001B[91m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
                }
                else {
                    console.error.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
                }
            }
        };
        ConsoleLogMainService.prototype.critical = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Critical) {
                if (this.useColors) {
                    console.error.apply(console, ["\u001B[90m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
                }
                else {
                    console.error.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
                }
            }
        };
        ConsoleLogMainService.prototype.dispose = function () {
            // noop
        };
        return ConsoleLogMainService;
    }(AbstractLogService));
    exports.ConsoleLogMainService = ConsoleLogMainService;
    var ConsoleLogService = /** @class */ (function (_super) {
        __extends(ConsoleLogService, _super);
        function ConsoleLogService(logLevel) {
            if (logLevel === void 0) { logLevel = exports.DEFAULT_LOG_LEVEL; }
            var _this = _super.call(this) || this;
            _this.setLevel(logLevel);
            return _this;
        }
        ConsoleLogService.prototype.trace = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Trace) {
                console.log.apply(console, ['%cTRACE', 'color: #888', message].concat(args));
            }
        };
        ConsoleLogService.prototype.debug = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Debug) {
                console.log.apply(console, ['%cDEBUG', 'background: #eee; color: #888', message].concat(args));
            }
        };
        ConsoleLogService.prototype.info = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Info) {
                console.log.apply(console, ['%c INFO', 'color: #33f', message].concat(args));
            }
        };
        ConsoleLogService.prototype.warn = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Warning) {
                console.log.apply(console, ['%c WARN', 'color: #993', message].concat(args));
            }
        };
        ConsoleLogService.prototype.error = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Error) {
                console.log.apply(console, ['%c  ERR', 'color: #f33', message].concat(args));
            }
        };
        ConsoleLogService.prototype.critical = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Critical) {
                console.log.apply(console, ['%cCRITI', 'background: #f33; color: white', message].concat(args));
            }
        };
        ConsoleLogService.prototype.dispose = function () { };
        return ConsoleLogService;
    }(AbstractLogService));
    exports.ConsoleLogService = ConsoleLogService;
    var MultiplexLogService = /** @class */ (function (_super) {
        __extends(MultiplexLogService, _super);
        function MultiplexLogService(logServices) {
            var _this = _super.call(this) || this;
            _this.logServices = logServices;
            if (logServices.length) {
                _this.setLevel(logServices[0].getLevel());
            }
            return _this;
        }
        MultiplexLogService.prototype.setLevel = function (level) {
            for (var _i = 0, _a = this.logServices; _i < _a.length; _i++) {
                var logService = _a[_i];
                logService.setLevel(level);
            }
            _super.prototype.setLevel.call(this, level);
        };
        MultiplexLogService.prototype.trace = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
                var logService = _b[_a];
                logService.trace.apply(logService, [message].concat(args));
            }
        };
        MultiplexLogService.prototype.debug = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
                var logService = _b[_a];
                logService.debug.apply(logService, [message].concat(args));
            }
        };
        MultiplexLogService.prototype.info = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
                var logService = _b[_a];
                logService.info.apply(logService, [message].concat(args));
            }
        };
        MultiplexLogService.prototype.warn = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
                var logService = _b[_a];
                logService.warn.apply(logService, [message].concat(args));
            }
        };
        MultiplexLogService.prototype.error = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
                var logService = _b[_a];
                logService.error.apply(logService, [message].concat(args));
            }
        };
        MultiplexLogService.prototype.critical = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
                var logService = _b[_a];
                logService.critical.apply(logService, [message].concat(args));
            }
        };
        MultiplexLogService.prototype.dispose = function () {
            for (var _i = 0, _a = this.logServices; _i < _a.length; _i++) {
                var logService = _a[_i];
                logService.dispose();
            }
        };
        return MultiplexLogService;
    }(AbstractLogService));
    exports.MultiplexLogService = MultiplexLogService;
    var DelegatedLogService = /** @class */ (function (_super) {
        __extends(DelegatedLogService, _super);
        function DelegatedLogService(logService) {
            var _this = _super.call(this) || this;
            _this.logService = logService;
            _this._register(logService);
            return _this;
        }
        Object.defineProperty(DelegatedLogService.prototype, "onDidChangeLogLevel", {
            get: function () {
                return this.logService.onDidChangeLogLevel;
            },
            enumerable: true,
            configurable: true
        });
        DelegatedLogService.prototype.setLevel = function (level) {
            this.logService.setLevel(level);
        };
        DelegatedLogService.prototype.getLevel = function () {
            return this.logService.getLevel();
        };
        DelegatedLogService.prototype.trace = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            (_a = this.logService).trace.apply(_a, [message].concat(args));
        };
        DelegatedLogService.prototype.debug = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            (_a = this.logService).debug.apply(_a, [message].concat(args));
        };
        DelegatedLogService.prototype.info = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            (_a = this.logService).info.apply(_a, [message].concat(args));
        };
        DelegatedLogService.prototype.warn = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            (_a = this.logService).warn.apply(_a, [message].concat(args));
        };
        DelegatedLogService.prototype.error = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            (_a = this.logService).error.apply(_a, [message].concat(args));
        };
        DelegatedLogService.prototype.critical = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            (_a = this.logService).critical.apply(_a, [message].concat(args));
        };
        return DelegatedLogService;
    }(lifecycle_1.Disposable));
    exports.DelegatedLogService = DelegatedLogService;
    var NullLogService = /** @class */ (function () {
        function NullLogService() {
            this.onDidChangeLogLevel = new event_1.Emitter().event;
        }
        NullLogService.prototype.setLevel = function (level) { };
        NullLogService.prototype.getLevel = function () { return LogLevel.Info; };
        NullLogService.prototype.trace = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        NullLogService.prototype.debug = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        NullLogService.prototype.info = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        NullLogService.prototype.warn = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        NullLogService.prototype.error = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        NullLogService.prototype.critical = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        NullLogService.prototype.dispose = function () { };
        return NullLogService;
    }());
    exports.NullLogService = NullLogService;
    function getLogLevel(environmentService) {
        if (environmentService.verbose) {
            return LogLevel.Trace;
        }
        if (typeof environmentService.args.log === 'string') {
            var logLevel = environmentService.args.log.toLowerCase();
            switch (logLevel) {
                case 'trace':
                    return LogLevel.Trace;
                case 'debug':
                    return LogLevel.Debug;
                case 'info':
                    return LogLevel.Info;
                case 'warn':
                    return LogLevel.Warning;
                case 'error':
                    return LogLevel.Error;
                case 'critical':
                    return LogLevel.Critical;
                case 'off':
                    return LogLevel.Off;
            }
        }
        return exports.DEFAULT_LOG_LEVEL;
    }
    exports.getLogLevel = getLogLevel;
});














var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(__m[65/*vs/platform/extensionManagement/node/extensionLifecycle*/], __M([1/*require*/,0/*exports*/,12/*vs/base/common/lifecycle*/,2/*vs/base/common/winjs.base*/,10/*vs/platform/log/common/log*/,98/*child_process*/,36/*vs/base/common/errorMessage*/,8/*path*/,22/*vs/base/common/async*/,9/*vs/base/common/event*/,31/*vs/base/common/network*/]), function (require, exports, lifecycle_1, winjs_base_1, log_1, child_process_1, errorMessage_1, path_1, async_1, event_1, network_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtensionsLifecycle = /** @class */ (function (_super) {
        __extends(ExtensionsLifecycle, _super);
        function ExtensionsLifecycle(logService) {
            var _this = _super.call(this) || this;
            _this.logService = logService;
            _this.processesLimiter = new async_1.Limiter(5); // Run max 5 processes in parallel
            return _this;
        }
        ExtensionsLifecycle.prototype.uninstall = function (extension) {
            var _this = this;
            var uninstallScript = this.parseUninstallScript(extension);
            if (uninstallScript) {
                this.logService.info(extension.identifier.id, 'Running Uninstall hook');
                return this.processesLimiter.queue(function () {
                    return _this.runUninstallHook(uninstallScript.uninstallHook, uninstallScript.args, extension)
                        .then(function () { return _this.logService.info(extension.identifier.id, 'Finished running uninstall hook'); }, function (err) { return _this.logService.error(extension.identifier.id, "Failed to run uninstall hook: " + err); });
                });
            }
            return winjs_base_1.TPromise.as(null);
        };
        ExtensionsLifecycle.prototype.parseUninstallScript = function (extension) {
            if (extension.location.scheme === network_1.Schemas.file && extension.manifest && extension.manifest['scripts'] && typeof extension.manifest['scripts']['vscode:uninstall'] === 'string') {
                var uninstallScript = extension.manifest['scripts']['vscode:uninstall'].split(' ');
                if (uninstallScript.length < 2 || uninstallScript[0] !== 'node' || !uninstallScript[1]) {
                    this.logService.warn(extension.identifier.id, 'Uninstall script should be a node script');
                    return null;
                }
                return { uninstallHook: path_1.posix.join(extension.location.fsPath, uninstallScript[1]), args: uninstallScript.slice(2) || [] };
            }
            return null;
        };
        ExtensionsLifecycle.prototype.runUninstallHook = function (lifecycleHook, args, extension) {
            var _this = this;
            return new winjs_base_1.TPromise(function (c, e) {
                var extensionLifecycleProcess = _this.start(lifecycleHook, args, extension);
                var timeoutHandler;
                var onexit = function (error) {
                    clearTimeout(timeoutHandler);
                    timeoutHandler = null;
                    if (error) {
                        e(error);
                    }
                    else {
                        c(null);
                    }
                };
                // on error
                extensionLifecycleProcess.on('error', function (err) {
                    if (timeoutHandler) {
                        onexit(errorMessage_1.toErrorMessage(err) || 'Unknown');
                    }
                });
                // on exit
                extensionLifecycleProcess.on('exit', function (code, signal) {
                    if (timeoutHandler) {
                        onexit(code ? "Process exited with code " + code : void 0);
                    }
                });
                // timeout: kill process after waiting for 5s
                timeoutHandler = setTimeout(function () {
                    timeoutHandler = null;
                    extensionLifecycleProcess.kill();
                    e('timed out');
                }, 5000);
            });
        };
        ExtensionsLifecycle.prototype.start = function (uninstallHook, args, extension) {
            var opts = {
                silent: true,
                execArgv: undefined
            };
            var extensionUninstallProcess = child_process_1.fork(uninstallHook, ['--type=extensionUninstall'].concat(args), opts);
            extensionUninstallProcess.stdout.setEncoding('utf8');
            extensionUninstallProcess.stderr.setEncoding('utf8');
            var onStdout = event_1.fromNodeEventEmitter(extensionUninstallProcess.stdout, 'data');
            var onStderr = event_1.fromNodeEventEmitter(extensionUninstallProcess.stderr, 'data');
            var onOutput = event_1.anyEvent(event_1.mapEvent(onStdout, function (o) { return ({ data: "%c" + o, format: [''] }); }), event_1.mapEvent(onStderr, function (o) { return ({ data: "%c" + o, format: ['color: red'] }); }));
            // Debounce all output, so we can render it in the Chrome console as a group
            var onDebouncedOutput = event_1.debounceEvent(onOutput, function (r, o) {
                return r
                    ? { data: r.data + o.data, format: r.format.concat(o.format) }
                    : { data: o.data, format: o.format };
            }, 100);
            // Print out extension host output
            onDebouncedOutput(function (data) {
                console.group(extension.identifier.id);
                console.log.apply(console, [data.data].concat(data.format));
                console.groupEnd();
            });
            return extensionUninstallProcess;
        };
        ExtensionsLifecycle = __decorate([
            __param(0, log_1.ILogService)
        ], ExtensionsLifecycle);
        return ExtensionsLifecycle;
    }(lifecycle_1.Disposable));
    exports.ExtensionsLifecycle = ExtensionsLifecycle;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/













define(__m[67/*vs/platform/log/node/spdlogService*/], __M([1/*require*/,0/*exports*/,8/*path*/,10/*vs/platform/log/common/log*/]), function (require, exports, path, log_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function createSpdLogService(processName, logLevel, logsFolder) {
        // Do not crash if spdlog cannot be loaded
        try {
            var _spdlog = require.__$__nodeRequire('spdlog');
            _spdlog.setAsyncMode(8192, 500);
            var logfilePath = path.join(logsFolder, processName + ".log");
            var logger = new _spdlog.RotatingLogger(processName, logfilePath, 1024 * 1024 * 5, 6);
            logger.setLevel(0);
            return new SpdLogService(logger, logLevel);
        }
        catch (e) {
            console.error(e);
        }
        return new log_1.NullLogService();
    }
    exports.createSpdLogService = createSpdLogService;
    function createRotatingLogger(name, filename, filesize, filecount) {
        var _spdlog = require.__$__nodeRequire('spdlog');
        return new _spdlog.RotatingLogger(name, filename, filesize, filecount);
    }
    exports.createRotatingLogger = createRotatingLogger;
    var SpdLogService = /** @class */ (function (_super) {
        __extends(SpdLogService, _super);
        function SpdLogService(logger, level) {
            if (level === void 0) { level = log_1.LogLevel.Error; }
            var _this = _super.call(this) || this;
            _this.logger = logger;
            _this.setLevel(level);
            return _this;
        }
        SpdLogService.prototype.trace = function () {
            if (this.getLevel() <= log_1.LogLevel.Trace) {
                this.logger.trace(this.format(arguments));
            }
        };
        SpdLogService.prototype.debug = function () {
            if (this.getLevel() <= log_1.LogLevel.Debug) {
                this.logger.debug(this.format(arguments));
            }
        };
        SpdLogService.prototype.info = function () {
            if (this.getLevel() <= log_1.LogLevel.Info) {
                this.logger.info(this.format(arguments));
            }
        };
        SpdLogService.prototype.warn = function () {
            if (this.getLevel() <= log_1.LogLevel.Warning) {
                this.logger.warn(this.format(arguments));
            }
        };
        SpdLogService.prototype.error = function () {
            if (this.getLevel() <= log_1.LogLevel.Error) {
                var arg = arguments[0];
                if (arg instanceof Error) {
                    var array = Array.prototype.slice.call(arguments);
                    array[0] = arg.stack;
                    this.logger.error(this.format(array));
                }
                else {
                    this.logger.error(this.format(arguments));
                }
            }
        };
        SpdLogService.prototype.critical = function () {
            if (this.getLevel() <= log_1.LogLevel.Critical) {
                this.logger.critical(this.format(arguments));
            }
        };
        SpdLogService.prototype.dispose = function () {
            this.logger.drop();
        };
        SpdLogService.prototype.format = function (args) {
            var result = '';
            for (var i = 0; i < args.length; i++) {
                var a = args[i];
                if (typeof a === 'object') {
                    try {
                        a = JSON.stringify(a);
                    }
                    catch (e) { }
                }
                result += (i > 0 ? ' ' : '') + a;
            }
            return result;
        };
        return SpdLogService;
    }(log_1.AbstractLogService));
});

define(__m[39/*vs/platform/extensions/node/extensionValidator*/], __M([1/*require*/,0/*exports*/,51/*vs/nls!vs/platform/extensions/node/extensionValidator*/,21/*vs/platform/node/package*/]), function (require, exports, nls, package_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var VERSION_REGEXP = /^(\^|>=)?((\d+)|x)\.((\d+)|x)\.((\d+)|x)(\-.*)?$/;
    function isValidVersionStr(version) {
        version = version.trim();
        return (version === '*' || VERSION_REGEXP.test(version));
    }
    exports.isValidVersionStr = isValidVersionStr;
    function parseVersion(version) {
        if (!isValidVersionStr(version)) {
            return null;
        }
        version = version.trim();
        if (version === '*') {
            return {
                hasCaret: false,
                hasGreaterEquals: false,
                majorBase: 0,
                majorMustEqual: false,
                minorBase: 0,
                minorMustEqual: false,
                patchBase: 0,
                patchMustEqual: false,
                preRelease: null
            };
        }
        var m = version.match(VERSION_REGEXP);
        return {
            hasCaret: m[1] === '^',
            hasGreaterEquals: m[1] === '>=',
            majorBase: m[2] === 'x' ? 0 : parseInt(m[2], 10),
            majorMustEqual: (m[2] === 'x' ? false : true),
            minorBase: m[4] === 'x' ? 0 : parseInt(m[4], 10),
            minorMustEqual: (m[4] === 'x' ? false : true),
            patchBase: m[6] === 'x' ? 0 : parseInt(m[6], 10),
            patchMustEqual: (m[6] === 'x' ? false : true),
            preRelease: m[8] || null
        };
    }
    exports.parseVersion = parseVersion;
    function normalizeVersion(version) {
        if (!version) {
            return null;
        }
        var majorBase = version.majorBase, majorMustEqual = version.majorMustEqual, minorBase = version.minorBase, minorMustEqual = version.minorMustEqual, patchBase = version.patchBase, patchMustEqual = version.patchMustEqual;
        if (version.hasCaret) {
            if (majorBase === 0) {
                patchMustEqual = false;
            }
            else {
                minorMustEqual = false;
                patchMustEqual = false;
            }
        }
        return {
            majorBase: majorBase,
            majorMustEqual: majorMustEqual,
            minorBase: minorBase,
            minorMustEqual: minorMustEqual,
            patchBase: patchBase,
            patchMustEqual: patchMustEqual,
            isMinimum: version.hasGreaterEquals
        };
    }
    exports.normalizeVersion = normalizeVersion;
    function isValidVersion(_version, _desiredVersion) {
        var version;
        if (typeof _version === 'string') {
            version = normalizeVersion(parseVersion(_version));
        }
        else {
            version = _version;
        }
        var desiredVersion;
        if (typeof _desiredVersion === 'string') {
            desiredVersion = normalizeVersion(parseVersion(_desiredVersion));
        }
        else {
            desiredVersion = _desiredVersion;
        }
        if (!version || !desiredVersion) {
            return false;
        }
        var majorBase = version.majorBase;
        var minorBase = version.minorBase;
        var patchBase = version.patchBase;
        var desiredMajorBase = desiredVersion.majorBase;
        var desiredMinorBase = desiredVersion.minorBase;
        var desiredPatchBase = desiredVersion.patchBase;
        var majorMustEqual = desiredVersion.majorMustEqual;
        var minorMustEqual = desiredVersion.minorMustEqual;
        var patchMustEqual = desiredVersion.patchMustEqual;
        if (desiredVersion.isMinimum) {
            if (majorBase > desiredMajorBase) {
                return true;
            }
            if (majorBase < desiredMajorBase) {
                return false;
            }
            if (minorBase > desiredMinorBase) {
                return true;
            }
            if (minorBase < desiredMinorBase) {
                return false;
            }
            return patchBase >= desiredPatchBase;
        }
        // Anything < 1.0.0 is compatible with >= 1.0.0, except exact matches
        if (majorBase === 1 && desiredMajorBase === 0 && (!majorMustEqual || !minorMustEqual || !patchMustEqual)) {
            desiredMajorBase = 1;
            desiredMinorBase = 0;
            desiredPatchBase = 0;
            majorMustEqual = true;
            minorMustEqual = false;
            patchMustEqual = false;
        }
        if (majorBase < desiredMajorBase) {
            // smaller major version
            return false;
        }
        if (majorBase > desiredMajorBase) {
            // higher major version
            return (!majorMustEqual);
        }
        // at this point, majorBase are equal
        if (minorBase < desiredMinorBase) {
            // smaller minor version
            return false;
        }
        if (minorBase > desiredMinorBase) {
            // higher minor version
            return (!minorMustEqual);
        }
        // at this point, minorBase are equal
        if (patchBase < desiredPatchBase) {
            // smaller patch version
            return false;
        }
        if (patchBase > desiredPatchBase) {
            // higher patch version
            return (!patchMustEqual);
        }
        // at this point, patchBase are equal
        return true;
    }
    exports.isValidVersion = isValidVersion;
    function isValidExtensionVersion(version, extensionDesc, notices) {
        if (extensionDesc.isBuiltin || typeof extensionDesc.main === 'undefined') {
            // No version check for builtin or declarative extensions
            return true;
        }
        return isVersionValid(version, extensionDesc.engines.vscode, notices);
    }
    exports.isValidExtensionVersion = isValidExtensionVersion;
    function isEngineValid(engine) {
        // TODO@joao: discuss with alex '*' doesn't seem to be a valid engine version
        return engine === '*' || isVersionValid(package_1.default.version, engine);
    }
    exports.isEngineValid = isEngineValid;
    function isVersionValid(currentVersion, requestedVersion, notices) {
        if (notices === void 0) { notices = []; }
        var desiredVersion = normalizeVersion(parseVersion(requestedVersion));
        if (!desiredVersion) {
            notices.push(nls.localize(0, null, requestedVersion));
            return false;
        }
        // enforce that a breaking API version is specified.
        // for 0.X.Y, that means up to 0.X must be specified
        // otherwise for Z.X.Y, that means Z must be specified
        if (desiredVersion.majorBase === 0) {
            // force that major and minor must be specific
            if (!desiredVersion.majorMustEqual || !desiredVersion.minorMustEqual) {
                notices.push(nls.localize(1, null, requestedVersion));
                return false;
            }
        }
        else {
            // force that major must be specific
            if (!desiredVersion.majorMustEqual) {
                notices.push(nls.localize(2, null, requestedVersion));
                return false;
            }
        }
        if (!isValidVersion(currentVersion, desiredVersion)) {
            notices.push(nls.localize(3, null, currentVersion, requestedVersion));
            return false;
        }
        return true;
    }
    exports.isVersionValid = isVersionValid;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/






define(__m[70/*vs/platform/environment/node/environmentService*/], __M([1/*require*/,0/*exports*/,96/*crypto*/,73/*vs/base/node/paths*/,27/*os*/,8/*path*/,90/*vs/base/common/decorators*/,21/*vs/platform/node/package*/,34/*vs/platform/node/product*/,84/*vs/base/common/date*/,18/*vs/base/common/platform*/,72/*vs/base/common/amd*/,23/*vs/base/common/uri*/]), function (require, exports, crypto, paths, os, path, decorators_1, package_1, product_1, date_1, platform_1, amd_1, uri_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Read this before there's any chance it is overwritten
    // Related to https://github.com/Microsoft/vscode/issues/30624
    var xdgRuntimeDir = process.env['XDG_RUNTIME_DIR'];
    function getNixIPCHandle(userDataPath, type) {
        if (xdgRuntimeDir) {
            var scope = crypto.createHash('md5').update(userDataPath).digest('hex').substr(0, 8);
            return path.join(xdgRuntimeDir, "vscode-" + scope + "-" + package_1.default.version + "-" + type + ".sock");
        }
        return path.join(userDataPath, package_1.default.version + "-" + type + ".sock");
    }
    function getWin32IPCHandle(userDataPath, type) {
        var scope = crypto.createHash('md5').update(userDataPath).digest('hex');
        return "\\\\.\\pipe\\" + scope + "-" + package_1.default.version + "-" + type + "-sock";
    }
    function getIPCHandle(userDataPath, type) {
        if (platform_1.isWindows) {
            return getWin32IPCHandle(userDataPath, type);
        }
        return getNixIPCHandle(userDataPath, type);
    }
    function getCLIPath(execPath, appRoot, isBuilt) {
        // Windows
        if (platform_1.isWindows) {
            if (isBuilt) {
                return path.join(path.dirname(execPath), 'bin', product_1.default.applicationName + ".cmd");
            }
            return path.join(appRoot, 'scripts', 'code-cli.bat');
        }
        // Linux
        if (platform_1.isLinux) {
            if (isBuilt) {
                return path.join(path.dirname(execPath), 'bin', "" + product_1.default.applicationName);
            }
            return path.join(appRoot, 'scripts', 'code-cli.sh');
        }
        // macOS
        if (isBuilt) {
            return path.join(appRoot, 'bin', 'code');
        }
        return path.join(appRoot, 'scripts', 'code-cli.sh');
    }
    var EnvironmentService = /** @class */ (function () {
        function EnvironmentService(_args, _execPath) {
            this._args = _args;
            this._execPath = _execPath;
            if (!process.env['VSCODE_LOGS']) {
                var key = date_1.toLocalISOString(new Date()).replace(/-|:|\.\d+Z$/g, '');
                process.env['VSCODE_LOGS'] = path.join(this.userDataPath, 'logs', key);
            }
            this.logsPath = process.env['VSCODE_LOGS'];
        }
        Object.defineProperty(EnvironmentService.prototype, "args", {
            get: function () { return this._args; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appRoot", {
            get: function () { return path.dirname(amd_1.getPathFromAmdModule(require, '')); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "execPath", {
            get: function () { return this._execPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "cliPath", {
            get: function () { return getCLIPath(this.execPath, this.appRoot, this.isBuilt); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "userHome", {
            get: function () { return os.homedir(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "userDataPath", {
            get: function () {
                if (process.env['VSCODE_PORTABLE']) {
                    return path.join(process.env['VSCODE_PORTABLE'], 'user-data');
                }
                return parseUserDataDir(this._args, process);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appNameLong", {
            get: function () { return product_1.default.nameLong; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appQuality", {
            get: function () { return product_1.default.quality; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appSettingsHome", {
            get: function () { return path.join(this.userDataPath, 'User'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appSettingsPath", {
            get: function () { return path.join(this.appSettingsHome, 'settings.json'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "settingsSearchBuildId", {
            get: function () { return product_1.default.settingsSearchBuildId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "settingsSearchUrl", {
            get: function () { return product_1.default.settingsSearchUrl; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appKeybindingsPath", {
            get: function () { return path.join(this.appSettingsHome, 'keybindings.json'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "isExtensionDevelopment", {
            get: function () { return !!this._args.extensionDevelopmentPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "backupHome", {
            get: function () { return path.join(this.userDataPath, 'Backups'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "backupWorkspacesPath", {
            get: function () { return path.join(this.backupHome, 'workspaces.json'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "workspacesHome", {
            get: function () { return path.join(this.userDataPath, 'Workspaces'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "installSourcePath", {
            get: function () { return path.join(this.userDataPath, 'installSource'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "builtinExtensionsPath", {
            get: function () {
                var fromArgs = parsePathArg(this._args['builtin-extensions-dir'], process);
                if (fromArgs) {
                    return fromArgs;
                }
                else {
                    return path.normalize(path.join(amd_1.getPathFromAmdModule(require, ''), '..', 'extensions'));
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "extensionsPath", {
            get: function () {
                var fromArgs = parsePathArg(this._args['extensions-dir'], process);
                if (fromArgs) {
                    return fromArgs;
                }
                else if (process.env['VSCODE_EXTENSIONS']) {
                    return process.env['VSCODE_EXTENSIONS'];
                }
                else if (process.env['VSCODE_PORTABLE']) {
                    return path.join(process.env['VSCODE_PORTABLE'], 'extensions');
                }
                else {
                    return path.join(this.userHome, product_1.default.dataFolderName, 'extensions');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "extensionDevelopmentLocationURI", {
            get: function () {
                var s = this._args.extensionDevelopmentPath;
                if (s) {
                    if (/^[^:/?#]+?:\/\//.test(s)) {
                        return uri_1.URI.parse(s);
                    }
                    return uri_1.URI.file(path.normalize(s));
                }
                return void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "extensionTestsPath", {
            get: function () { return this._args.extensionTestsPath ? path.normalize(this._args.extensionTestsPath) : this._args.extensionTestsPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "disableExtensions", {
            get: function () {
                if (this._args['disable-extensions']) {
                    return true;
                }
                var disableExtensions = this._args['disable-extension'];
                if (disableExtensions) {
                    if (typeof disableExtensions === 'string') {
                        return [disableExtensions];
                    }
                    if (Array.isArray(disableExtensions) && disableExtensions.length > 0) {
                        return disableExtensions;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "skipGettingStarted", {
            get: function () { return this._args['skip-getting-started']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "skipReleaseNotes", {
            get: function () { return this._args['skip-release-notes']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "skipAddToRecentlyOpened", {
            get: function () { return this._args['skip-add-to-recently-opened']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "debugExtensionHost", {
            get: function () { return parseExtensionHostPort(this._args, this.isBuilt); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "debugSearch", {
            get: function () { return parseSearchPort(this._args, this.isBuilt); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "isBuilt", {
            get: function () { return !process.env['VSCODE_DEV']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "verbose", {
            get: function () { return this._args.verbose; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "log", {
            get: function () { return this._args.log; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "wait", {
            get: function () { return this._args.wait; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "logExtensionHostCommunication", {
            get: function () { return this._args.logExtensionHostCommunication; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "performance", {
            get: function () { return this._args.performance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "status", {
            get: function () { return this._args.status; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "mainIPCHandle", {
            get: function () { return getIPCHandle(this.userDataPath, 'main'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "sharedIPCHandle", {
            get: function () { return getIPCHandle(this.userDataPath, 'shared'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "nodeCachedDataDir", {
            get: function () { return this.isBuilt ? path.join(this.userDataPath, 'CachedData', product_1.default.commit || new Array(41).join('0')) : undefined; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "disableUpdates", {
            get: function () { return !!this._args['disable-updates']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "disableCrashReporter", {
            get: function () { return !!this._args['disable-crash-reporter']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "driverHandle", {
            get: function () { return this._args['driver']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "driverVerbose", {
            get: function () { return this._args['driver-verbose']; },
            enumerable: true,
            configurable: true
        });
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "appRoot", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "cliPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "userHome", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "userDataPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "appSettingsHome", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "appSettingsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "settingsSearchBuildId", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "settingsSearchUrl", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "appKeybindingsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "isExtensionDevelopment", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "backupHome", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "backupWorkspacesPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "workspacesHome", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "installSourcePath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "builtinExtensionsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "extensionsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "extensionDevelopmentLocationURI", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "extensionTestsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "debugExtensionHost", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "debugSearch", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "mainIPCHandle", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "sharedIPCHandle", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "nodeCachedDataDir", null);
        return EnvironmentService;
    }());
    exports.EnvironmentService = EnvironmentService;
    function parseExtensionHostPort(args, isBuild) {
        return parseDebugPort(args.debugPluginHost, args.debugBrkPluginHost, 5870, isBuild, args.debugId);
    }
    exports.parseExtensionHostPort = parseExtensionHostPort;
    function parseSearchPort(args, isBuild) {
        return parseDebugPort(args.debugSearch, args.debugBrkSearch, 5876, isBuild);
    }
    exports.parseSearchPort = parseSearchPort;
    function parseDebugPort(debugArg, debugBrkArg, defaultBuildPort, isBuild, debugId) {
        var portStr = debugBrkArg || debugArg;
        var port = Number(portStr) || (!isBuild ? defaultBuildPort : null);
        var brk = port ? Boolean(!!debugBrkArg) : false;
        return { port: port, break: brk, debugId: debugId };
    }
    exports.parseDebugPort = parseDebugPort;
    function parsePathArg(arg, process) {
        if (!arg) {
            return undefined;
        }
        // Determine if the arg is relative or absolute, if relative use the original CWD
        // (VSCODE_CWD), not the potentially overridden one (process.cwd()).
        var resolved = path.resolve(arg);
        if (path.normalize(arg) === resolved) {
            return resolved;
        }
        else {
            return path.resolve(process.env['VSCODE_CWD'] || process.cwd(), arg);
        }
    }
    function parseUserDataDir(args, process) {
        return parsePathArg(args['user-data-dir'], process) || path.resolve(paths.getDefaultUserDataPath(process.platform));
    }
    exports.parseUserDataDir = parseUserDataDir;
});

define(__m[14/*vs/platform/registry/common/platform*/], __M([1/*require*/,0/*exports*/,5/*vs/base/common/types*/,30/*vs/base/common/assert*/]), function (require, exports, Types, Assert) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var RegistryImpl = /** @class */ (function () {
        function RegistryImpl() {
            this.data = {};
        }
        RegistryImpl.prototype.add = function (id, data) {
            Assert.ok(Types.isString(id));
            Assert.ok(Types.isObject(data));
            Assert.ok(!this.data.hasOwnProperty(id), 'There is already an extension with this id');
            this.data[id] = data;
        };
        RegistryImpl.prototype.knows = function (id) {
            return this.data.hasOwnProperty(id);
        };
        RegistryImpl.prototype.as = function (id) {
            return this.data[id] || null;
        };
        return RegistryImpl;
    }());
    exports.Registry = new RegistryImpl();
});

define(__m[75/*vs/platform/jsonschemas/common/jsonContributionRegistry*/], __M([1/*require*/,0/*exports*/,14/*vs/platform/registry/common/platform*/,9/*vs/base/common/event*/]), function (require, exports, platform, event_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Extensions = {
        JSONContribution: 'base.contributions.json'
    };
    function normalizeId(id) {
        if (id.length > 0 && id.charAt(id.length - 1) === '#') {
            return id.substring(0, id.length - 1);
        }
        return id;
    }
    var JSONContributionRegistry = /** @class */ (function () {
        function JSONContributionRegistry() {
            this._onDidChangeSchema = new event_1.Emitter();
            this.onDidChangeSchema = this._onDidChangeSchema.event;
            this.schemasById = {};
        }
        JSONContributionRegistry.prototype.registerSchema = function (uri, unresolvedSchemaContent) {
            this.schemasById[normalizeId(uri)] = unresolvedSchemaContent;
            this._onDidChangeSchema.fire(uri);
        };
        JSONContributionRegistry.prototype.notifySchemaChanged = function (uri) {
            this._onDidChangeSchema.fire(uri);
        };
        JSONContributionRegistry.prototype.getSchemaContributions = function () {
            return {
                schemas: this.schemasById,
            };
        };
        return JSONContributionRegistry;
    }());
    var jsonContributionRegistry = new JSONContributionRegistry();
    platform.Registry.add(exports.Extensions.JSONContribution, jsonContributionRegistry);
});

define(__m[17/*vs/platform/configuration/common/configurationRegistry*/], __M([1/*require*/,0/*exports*/,60/*vs/nls!vs/platform/configuration/common/configurationRegistry*/,9/*vs/base/common/event*/,14/*vs/platform/registry/common/platform*/,5/*vs/base/common/types*/,11/*vs/base/common/strings*/,75/*vs/platform/jsonschemas/common/jsonContributionRegistry*/]), function (require, exports, nls, event_1, platform_1, types, strings, jsonContributionRegistry_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Extensions = {
        Configuration: 'base.contributions.configuration'
    };
    var ConfigurationScope;
    (function (ConfigurationScope) {
        ConfigurationScope[ConfigurationScope["APPLICATION"] = 1] = "APPLICATION";
        ConfigurationScope[ConfigurationScope["WINDOW"] = 2] = "WINDOW";
        ConfigurationScope[ConfigurationScope["RESOURCE"] = 3] = "RESOURCE";
    })(ConfigurationScope = exports.ConfigurationScope || (exports.ConfigurationScope = {}));
    exports.allSettings = { properties: {}, patternProperties: {} };
    exports.applicationSettings = { properties: {}, patternProperties: {} };
    exports.windowSettings = { properties: {}, patternProperties: {} };
    exports.resourceSettings = { properties: {}, patternProperties: {} };
    exports.editorConfigurationSchemaId = 'vscode://schemas/settings/editor';
    var contributionRegistry = platform_1.Registry.as(jsonContributionRegistry_1.Extensions.JSONContribution);
    var ConfigurationRegistry = /** @class */ (function () {
        function ConfigurationRegistry() {
            this.overrideIdentifiers = [];
            this._onDidSchemaChange = new event_1.Emitter();
            this.onDidSchemaChange = this._onDidSchemaChange.event;
            this._onDidRegisterConfiguration = new event_1.Emitter();
            this.onDidRegisterConfiguration = this._onDidRegisterConfiguration.event;
            this.configurationContributors = [];
            this.editorConfigurationSchema = { properties: {}, patternProperties: {}, additionalProperties: false, errorMessage: 'Unknown editor configuration setting' };
            this.configurationProperties = {};
            this.excludedConfigurationProperties = {};
            this.computeOverridePropertyPattern();
            contributionRegistry.registerSchema(exports.editorConfigurationSchemaId, this.editorConfigurationSchema);
        }
        ConfigurationRegistry.prototype.registerConfiguration = function (configuration, validate) {
            if (validate === void 0) { validate = true; }
            this.registerConfigurations([configuration], [], validate);
        };
        ConfigurationRegistry.prototype.registerConfigurations = function (configurations, defaultConfigurations, validate) {
            var _this = this;
            if (validate === void 0) { validate = true; }
            var configurationNode = this.toConfiguration(defaultConfigurations);
            if (configurationNode) {
                configurations.push(configurationNode);
            }
            var properties = [];
            configurations.forEach(function (configuration) {
                properties.push.apply(properties, _this.validateAndRegisterProperties(configuration, validate)); // fills in defaults
                _this.configurationContributors.push(configuration);
                _this.registerJSONConfiguration(configuration);
                _this.updateSchemaForOverrideSettingsConfiguration(configuration);
            });
            this._onDidRegisterConfiguration.fire(properties);
        };
        ConfigurationRegistry.prototype.notifyConfigurationSchemaUpdated = function (configuration) {
            contributionRegistry.notifySchemaChanged(exports.editorConfigurationSchemaId);
        };
        ConfigurationRegistry.prototype.registerOverrideIdentifiers = function (overrideIdentifiers) {
            var _a;
            (_a = this.overrideIdentifiers).push.apply(_a, overrideIdentifiers);
            this.updateOverridePropertyPatternKey();
        };
        ConfigurationRegistry.prototype.toConfiguration = function (defaultConfigurations) {
            var configurationNode = {
                id: 'defaultOverrides',
                title: nls.localize(0, null),
                properties: {}
            };
            for (var _i = 0, defaultConfigurations_1 = defaultConfigurations; _i < defaultConfigurations_1.length; _i++) {
                var defaultConfiguration = defaultConfigurations_1[_i];
                for (var key in defaultConfiguration.defaults) {
                    var defaultValue = defaultConfiguration.defaults[key];
                    if (exports.OVERRIDE_PROPERTY_PATTERN.test(key) && typeof defaultValue === 'object') {
                        configurationNode.properties[key] = {
                            type: 'object',
                            default: defaultValue,
                            description: nls.localize(1, null, key),
                            $ref: exports.editorConfigurationSchemaId
                        };
                    }
                }
            }
            return Object.keys(configurationNode.properties).length ? configurationNode : null;
        };
        ConfigurationRegistry.prototype.validateAndRegisterProperties = function (configuration, validate, scope, overridable) {
            if (validate === void 0) { validate = true; }
            if (scope === void 0) { scope = 2 /* WINDOW */; }
            if (overridable === void 0) { overridable = false; }
            scope = types.isUndefinedOrNull(configuration.scope) ? scope : configuration.scope;
            overridable = configuration.overridable || overridable;
            var propertyKeys = [];
            var properties = configuration.properties;
            if (properties) {
                for (var key in properties) {
                    var message = void 0;
                    if (validate && (message = validateProperty(key))) {
                        console.warn(message);
                        delete properties[key];
                        continue;
                    }
                    // fill in default values
                    var property = properties[key];
                    var defaultValue = property.default;
                    if (types.isUndefined(defaultValue)) {
                        property.default = getDefaultValue(property.type);
                    }
                    // Inherit overridable property from parent
                    if (overridable) {
                        property.overridable = true;
                    }
                    if (exports.OVERRIDE_PROPERTY_PATTERN.test(key)) {
                        property.scope = void 0; // No scope for overridable properties `[${identifier}]`
                    }
                    else {
                        property.scope = types.isUndefinedOrNull(property.scope) ? scope : property.scope;
                    }
                    // Add to properties maps
                    // Property is included by default if 'included' is unspecified
                    if (properties[key].hasOwnProperty('included') && !properties[key].included) {
                        this.excludedConfigurationProperties[key] = properties[key];
                        delete properties[key];
                        continue;
                    }
                    else {
                        this.configurationProperties[key] = properties[key];
                    }
                    propertyKeys.push(key);
                }
            }
            var subNodes = configuration.allOf;
            if (subNodes) {
                for (var _i = 0, subNodes_1 = subNodes; _i < subNodes_1.length; _i++) {
                    var node = subNodes_1[_i];
                    propertyKeys.push.apply(propertyKeys, this.validateAndRegisterProperties(node, validate, scope, overridable));
                }
            }
            return propertyKeys;
        };
        ConfigurationRegistry.prototype.getConfigurations = function () {
            return this.configurationContributors;
        };
        ConfigurationRegistry.prototype.getConfigurationProperties = function () {
            return this.configurationProperties;
        };
        ConfigurationRegistry.prototype.getExcludedConfigurationProperties = function () {
            return this.excludedConfigurationProperties;
        };
        ConfigurationRegistry.prototype.registerJSONConfiguration = function (configuration) {
            function register(configuration) {
                var properties = configuration.properties;
                if (properties) {
                    for (var key in properties) {
                        exports.allSettings.properties[key] = properties[key];
                        switch (properties[key].scope) {
                            case 1 /* APPLICATION */:
                                exports.applicationSettings.properties[key] = properties[key];
                                break;
                            case 2 /* WINDOW */:
                                exports.windowSettings.properties[key] = properties[key];
                                break;
                            case 3 /* RESOURCE */:
                                exports.resourceSettings.properties[key] = properties[key];
                                break;
                        }
                    }
                }
                var subNodes = configuration.allOf;
                if (subNodes) {
                    subNodes.forEach(register);
                }
            }
            register(configuration);
            this._onDidSchemaChange.fire();
        };
        ConfigurationRegistry.prototype.updateSchemaForOverrideSettingsConfiguration = function (configuration) {
            if (configuration.id !== SETTINGS_OVERRRIDE_NODE_ID) {
                this.update(configuration);
                contributionRegistry.registerSchema(exports.editorConfigurationSchemaId, this.editorConfigurationSchema);
            }
        };
        ConfigurationRegistry.prototype.updateOverridePropertyPatternKey = function () {
            var patternProperties = exports.allSettings.patternProperties[this.overridePropertyPattern];
            if (!patternProperties) {
                patternProperties = {
                    type: 'object',
                    description: nls.localize(2, null),
                    errorMessage: 'Unknown Identifier. Use language identifiers',
                    $ref: exports.editorConfigurationSchemaId
                };
            }
            delete exports.allSettings.patternProperties[this.overridePropertyPattern];
            delete exports.applicationSettings.patternProperties[this.overridePropertyPattern];
            delete exports.windowSettings.patternProperties[this.overridePropertyPattern];
            delete exports.resourceSettings.patternProperties[this.overridePropertyPattern];
            this.computeOverridePropertyPattern();
            exports.allSettings.patternProperties[this.overridePropertyPattern] = patternProperties;
            exports.applicationSettings.patternProperties[this.overridePropertyPattern] = patternProperties;
            exports.windowSettings.patternProperties[this.overridePropertyPattern] = patternProperties;
            exports.resourceSettings.patternProperties[this.overridePropertyPattern] = patternProperties;
            this._onDidSchemaChange.fire();
        };
        ConfigurationRegistry.prototype.update = function (configuration) {
            var _this = this;
            var properties = configuration.properties;
            if (properties) {
                for (var key in properties) {
                    if (properties[key].overridable) {
                        this.editorConfigurationSchema.properties[key] = this.getConfigurationProperties()[key];
                    }
                }
            }
            var subNodes = configuration.allOf;
            if (subNodes) {
                subNodes.forEach(function (subNode) { return _this.update(subNode); });
            }
        };
        ConfigurationRegistry.prototype.computeOverridePropertyPattern = function () {
            this.overridePropertyPattern = this.overrideIdentifiers.length ? OVERRIDE_PATTERN_WITH_SUBSTITUTION.replace('${0}', this.overrideIdentifiers.map(function (identifier) { return strings.createRegExp(identifier, false).source; }).join('|')) : OVERRIDE_PROPERTY;
        };
        return ConfigurationRegistry;
    }());
    var SETTINGS_OVERRRIDE_NODE_ID = 'override';
    var OVERRIDE_PROPERTY = '\\[.*\\]$';
    var OVERRIDE_PATTERN_WITH_SUBSTITUTION = '\\[(${0})\\]$';
    exports.OVERRIDE_PROPERTY_PATTERN = new RegExp(OVERRIDE_PROPERTY);
    function getDefaultValue(type) {
        var t = Array.isArray(type) ? type[0] : type;
        switch (t) {
            case 'boolean':
                return false;
            case 'integer':
            case 'number':
                return 0;
            case 'string':
                return '';
            case 'array':
                return [];
            case 'object':
                return {};
            default:
                return null;
        }
    }
    var configurationRegistry = new ConfigurationRegistry();
    platform_1.Registry.add(exports.Extensions.Configuration, configurationRegistry);
    function validateProperty(property) {
        if (exports.OVERRIDE_PROPERTY_PATTERN.test(property)) {
            return nls.localize(3, null, property);
        }
        if (configurationRegistry.getConfigurationProperties()[property] !== void 0) {
            return nls.localize(4, null, property);
        }
        return null;
    }
    exports.validateProperty = validateProperty;
    function getScopes() {
        var scopes = {};
        var configurationProperties = configurationRegistry.getConfigurationProperties();
        for (var _i = 0, _a = Object.keys(configurationProperties); _i < _a.length; _i++) {
            var key = _a[_i];
            scopes[key] = configurationProperties[key].scope;
        }
        scopes['launch'] = 3 /* RESOURCE */;
        scopes['task'] = 3 /* RESOURCE */;
        return scopes;
    }
    exports.getScopes = getScopes;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[13/*vs/platform/configuration/common/configuration*/], __M([1/*require*/,0/*exports*/,7/*vs/base/common/objects*/,5/*vs/base/common/types*/,23/*vs/base/common/uri*/,14/*vs/platform/registry/common/platform*/,4/*vs/platform/instantiation/common/instantiation*/,17/*vs/platform/configuration/common/configurationRegistry*/]), function (require, exports, objects, types, uri_1, platform_1, instantiation_1, configurationRegistry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IConfigurationService = instantiation_1.createDecorator('configurationService');
    function isConfigurationOverrides(thing) {
        return thing
            && typeof thing === 'object'
            && (!thing.overrideIdentifier || typeof thing.overrideIdentifier === 'string')
            && (!thing.resource || thing.resource instanceof uri_1.URI);
    }
    exports.isConfigurationOverrides = isConfigurationOverrides;
    var ConfigurationTarget;
    (function (ConfigurationTarget) {
        ConfigurationTarget[ConfigurationTarget["USER"] = 1] = "USER";
        ConfigurationTarget[ConfigurationTarget["WORKSPACE"] = 2] = "WORKSPACE";
        ConfigurationTarget[ConfigurationTarget["WORKSPACE_FOLDER"] = 3] = "WORKSPACE_FOLDER";
        ConfigurationTarget[ConfigurationTarget["DEFAULT"] = 4] = "DEFAULT";
        ConfigurationTarget[ConfigurationTarget["MEMORY"] = 5] = "MEMORY";
    })(ConfigurationTarget = exports.ConfigurationTarget || (exports.ConfigurationTarget = {}));
    function ConfigurationTargetToString(configurationTarget) {
        switch (configurationTarget) {
            case 1 /* USER */: return 'USER';
            case 2 /* WORKSPACE */: return 'WORKSPACE';
            case 3 /* WORKSPACE_FOLDER */: return 'WORKSPACE_FOLDER';
            case 4 /* DEFAULT */: return 'DEFAULT';
            case 5 /* MEMORY */: return 'MEMORY';
        }
    }
    exports.ConfigurationTargetToString = ConfigurationTargetToString;
    function compare(from, to) {
        var added = to.keys.filter(function (key) { return from.keys.indexOf(key) === -1; });
        var removed = from.keys.filter(function (key) { return to.keys.indexOf(key) === -1; });
        var updated = [];
        for (var _i = 0, _a = from.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            var value1 = getConfigurationValue(from.contents, key);
            var value2 = getConfigurationValue(to.contents, key);
            if (!objects.equals(value1, value2)) {
                updated.push(key);
            }
        }
        return { added: added, removed: removed, updated: updated };
    }
    exports.compare = compare;
    function toOverrides(raw, conflictReporter) {
        var overrides = [];
        var configurationProperties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
        for (var _i = 0, _a = Object.keys(raw); _i < _a.length; _i++) {
            var key = _a[_i];
            if (configurationRegistry_1.OVERRIDE_PROPERTY_PATTERN.test(key)) {
                var overrideRaw = {};
                for (var keyInOverrideRaw in raw[key]) {
                    if (configurationProperties[keyInOverrideRaw] && configurationProperties[keyInOverrideRaw].overridable) {
                        overrideRaw[keyInOverrideRaw] = raw[key][keyInOverrideRaw];
                    }
                }
                overrides.push({
                    identifiers: [overrideIdentifierFromKey(key).trim()],
                    contents: toValuesTree(overrideRaw, conflictReporter)
                });
            }
        }
        return overrides;
    }
    exports.toOverrides = toOverrides;
    function toValuesTree(properties, conflictReporter) {
        var root = Object.create(null);
        for (var key in properties) {
            addToValueTree(root, key, properties[key], conflictReporter);
        }
        return root;
    }
    exports.toValuesTree = toValuesTree;
    function addToValueTree(settingsTreeRoot, key, value, conflictReporter) {
        var segments = key.split('.');
        var last = segments.pop();
        var curr = settingsTreeRoot;
        for (var i = 0; i < segments.length; i++) {
            var s = segments[i];
            var obj = curr[s];
            switch (typeof obj) {
                case 'undefined':
                    obj = curr[s] = Object.create(null);
                    break;
                case 'object':
                    break;
                default:
                    conflictReporter("Ignoring " + key + " as " + segments.slice(0, i + 1).join('.') + " is " + JSON.stringify(obj));
                    return;
            }
            curr = obj;
        }
        if (typeof curr === 'object') {
            curr[last] = value; // workaround https://github.com/Microsoft/vscode/issues/13606
        }
        else {
            conflictReporter("Ignoring " + key + " as " + segments.join('.') + " is " + JSON.stringify(curr));
        }
    }
    exports.addToValueTree = addToValueTree;
    function removeFromValueTree(valueTree, key) {
        var segments = key.split('.');
        doRemoveFromValueTree(valueTree, segments);
    }
    exports.removeFromValueTree = removeFromValueTree;
    function doRemoveFromValueTree(valueTree, segments) {
        var first = segments.shift();
        if (segments.length === 0) {
            // Reached last segment
            delete valueTree[first];
            return;
        }
        if (Object.keys(valueTree).indexOf(first) !== -1) {
            var value = valueTree[first];
            if (typeof value === 'object' && !Array.isArray(value)) {
                doRemoveFromValueTree(value, segments);
                if (Object.keys(value).length === 0) {
                    delete valueTree[first];
                }
            }
        }
    }
    /**
     * A helper function to get the configuration value with a specific settings path (e.g. config.some.setting)
     */
    function getConfigurationValue(config, settingPath, defaultValue) {
        function accessSetting(config, path) {
            var current = config;
            for (var i = 0; i < path.length; i++) {
                if (typeof current !== 'object' || current === null) {
                    return undefined;
                }
                current = current[path[i]];
            }
            return current;
        }
        var path = settingPath.split('.');
        var result = accessSetting(config, path);
        return typeof result === 'undefined' ? defaultValue : result;
    }
    exports.getConfigurationValue = getConfigurationValue;
    function merge(base, add, overwrite) {
        Object.keys(add).forEach(function (key) {
            if (key in base) {
                if (types.isObject(base[key]) && types.isObject(add[key])) {
                    merge(base[key], add[key], overwrite);
                }
                else if (overwrite) {
                    base[key] = add[key];
                }
            }
            else {
                base[key] = add[key];
            }
        });
    }
    exports.merge = merge;
    function getConfigurationKeys() {
        var properties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
        return Object.keys(properties);
    }
    exports.getConfigurationKeys = getConfigurationKeys;
    function getDefaultValues() {
        var valueTreeRoot = Object.create(null);
        var properties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
        for (var key in properties) {
            var value = properties[key].default;
            addToValueTree(valueTreeRoot, key, value, function (message) { return console.error("Conflict in default settings: " + message); });
        }
        return valueTreeRoot;
    }
    exports.getDefaultValues = getDefaultValues;
    function overrideIdentifierFromKey(key) {
        return key.substring(1, key.length - 1);
    }
    exports.overrideIdentifierFromKey = overrideIdentifierFromKey;
    function keyFromOverrideIdentifier(overrideIdentifier) {
        return "[" + overrideIdentifier + "]";
    }
    exports.keyFromOverrideIdentifier = keyFromOverrideIdentifier;
});














define(__m[43/*vs/platform/configuration/common/configurationModels*/], __M([1/*require*/,0/*exports*/,45/*vs/base/common/json*/,44/*vs/base/common/map*/,20/*vs/base/common/arrays*/,5/*vs/base/common/types*/,7/*vs/base/common/objects*/,17/*vs/platform/configuration/common/configurationRegistry*/,13/*vs/platform/configuration/common/configuration*/]), function (require, exports, json, map_1, arrays, types, objects, configurationRegistry_1, configuration_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConfigurationModel = /** @class */ (function () {
        function ConfigurationModel(_contents, _keys, _overrides) {
            if (_contents === void 0) { _contents = {}; }
            if (_keys === void 0) { _keys = []; }
            if (_overrides === void 0) { _overrides = []; }
            this._contents = _contents;
            this._keys = _keys;
            this._overrides = _overrides;
            this.isFrozen = false;
        }
        Object.defineProperty(ConfigurationModel.prototype, "contents", {
            get: function () {
                return this.checkAndFreeze(this._contents);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationModel.prototype, "overrides", {
            get: function () {
                return this.checkAndFreeze(this._overrides);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationModel.prototype, "keys", {
            get: function () {
                return this.checkAndFreeze(this._keys);
            },
            enumerable: true,
            configurable: true
        });
        ConfigurationModel.prototype.getValue = function (section) {
            return section ? configuration_1.getConfigurationValue(this.contents, section) : this.contents;
        };
        ConfigurationModel.prototype.override = function (identifier) {
            var overrideContents = this.getContentsForOverrideIdentifer(identifier);
            if (!overrideContents || typeof overrideContents !== 'object' || !Object.keys(overrideContents).length) {
                // If there are no valid overrides, return self
                return this;
            }
            var contents = {};
            for (var _i = 0, _a = arrays.distinct(Object.keys(this.contents).concat(Object.keys(overrideContents))); _i < _a.length; _i++) {
                var key = _a[_i];
                var contentsForKey = this.contents[key];
                var overrideContentsForKey = overrideContents[key];
                // If there are override contents for the key, clone and merge otherwise use base contents
                if (overrideContentsForKey) {
                    // Clone and merge only if base contents and override contents are of type object otherwise just override
                    if (typeof contentsForKey === 'object' && typeof overrideContentsForKey === 'object') {
                        contentsForKey = objects.deepClone(contentsForKey);
                        this.mergeContents(contentsForKey, overrideContentsForKey);
                    }
                    else {
                        contentsForKey = overrideContentsForKey;
                    }
                }
                contents[key] = contentsForKey;
            }
            return new ConfigurationModel(contents);
        };
        ConfigurationModel.prototype.merge = function () {
            var others = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                others[_i] = arguments[_i];
            }
            var contents = objects.deepClone(this.contents);
            var overrides = objects.deepClone(this.overrides);
            var keys = this.keys.slice();
            for (var _a = 0, others_1 = others; _a < others_1.length; _a++) {
                var other = others_1[_a];
                this.mergeContents(contents, other.contents);
                var _loop_1 = function (otherOverride) {
                    var override = overrides.filter(function (o) { return arrays.equals(o.identifiers, otherOverride.identifiers); })[0];
                    if (override) {
                        this_1.mergeContents(override.contents, otherOverride.contents);
                    }
                    else {
                        overrides.push(objects.deepClone(otherOverride));
                    }
                };
                var this_1 = this;
                for (var _b = 0, _c = other.overrides; _b < _c.length; _b++) {
                    var otherOverride = _c[_b];
                    _loop_1(otherOverride);
                }
                for (var _d = 0, _e = other.keys; _d < _e.length; _d++) {
                    var key = _e[_d];
                    if (keys.indexOf(key) === -1) {
                        keys.push(key);
                    }
                }
            }
            return new ConfigurationModel(contents, keys, overrides);
        };
        ConfigurationModel.prototype.freeze = function () {
            this.isFrozen = true;
            return this;
        };
        ConfigurationModel.prototype.mergeContents = function (source, target) {
            for (var _i = 0, _a = Object.keys(target); _i < _a.length; _i++) {
                var key = _a[_i];
                if (key in source) {
                    if (types.isObject(source[key]) && types.isObject(target[key])) {
                        this.mergeContents(source[key], target[key]);
                        continue;
                    }
                }
                source[key] = objects.deepClone(target[key]);
            }
        };
        ConfigurationModel.prototype.checkAndFreeze = function (data) {
            if (this.isFrozen && !Object.isFrozen(data)) {
                return objects.deepFreeze(data);
            }
            return data;
        };
        ConfigurationModel.prototype.getContentsForOverrideIdentifer = function (identifier) {
            for (var _i = 0, _a = this.overrides; _i < _a.length; _i++) {
                var override = _a[_i];
                if (override.identifiers.indexOf(identifier) !== -1) {
                    return override.contents;
                }
            }
            return null;
        };
        ConfigurationModel.prototype.toJSON = function () {
            return {
                contents: this.contents,
                overrides: this.overrides,
                keys: this.keys
            };
        };
        // Update methods
        ConfigurationModel.prototype.setValue = function (key, value) {
            this.addKey(key);
            configuration_1.addToValueTree(this.contents, key, value, function (e) { throw new Error(e); });
        };
        ConfigurationModel.prototype.removeValue = function (key) {
            if (this.removeKey(key)) {
                configuration_1.removeFromValueTree(this.contents, key);
            }
        };
        ConfigurationModel.prototype.addKey = function (key) {
            var index = this.keys.length;
            for (var i = 0; i < index; i++) {
                if (key.indexOf(this.keys[i]) === 0) {
                    index = i;
                }
            }
            this.keys.splice(index, 1, key);
        };
        ConfigurationModel.prototype.removeKey = function (key) {
            var index = this.keys.indexOf(key);
            if (index !== -1) {
                this.keys.splice(index, 1);
                return true;
            }
            return false;
        };
        return ConfigurationModel;
    }());
    exports.ConfigurationModel = ConfigurationModel;
    var DefaultConfigurationModel = /** @class */ (function (_super) {
        __extends(DefaultConfigurationModel, _super);
        function DefaultConfigurationModel() {
            var _this = this;
            var contents = configuration_1.getDefaultValues();
            var keys = configuration_1.getConfigurationKeys();
            var overrides = [];
            for (var _i = 0, _a = Object.keys(contents); _i < _a.length; _i++) {
                var key = _a[_i];
                if (configurationRegistry_1.OVERRIDE_PROPERTY_PATTERN.test(key)) {
                    overrides.push({
                        identifiers: [configuration_1.overrideIdentifierFromKey(key).trim()],
                        contents: configuration_1.toValuesTree(contents[key], function (message) { return console.error("Conflict in default settings file: " + message); })
                    });
                }
            }
            _this = _super.call(this, contents, keys, overrides) || this;
            return _this;
        }
        return DefaultConfigurationModel;
    }(ConfigurationModel));
    exports.DefaultConfigurationModel = DefaultConfigurationModel;
    var ConfigurationModelParser = /** @class */ (function () {
        function ConfigurationModelParser(_name) {
            this._name = _name;
            this._configurationModel = null;
            this._parseErrors = [];
        }
        Object.defineProperty(ConfigurationModelParser.prototype, "configurationModel", {
            get: function () {
                return this._configurationModel || new ConfigurationModel();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationModelParser.prototype, "errors", {
            get: function () {
                return this._parseErrors;
            },
            enumerable: true,
            configurable: true
        });
        ConfigurationModelParser.prototype.parse = function (content) {
            var raw = this.parseContent(content);
            var configurationModel = this.parseRaw(raw);
            this._configurationModel = new ConfigurationModel(configurationModel.contents, configurationModel.keys, configurationModel.overrides);
        };
        ConfigurationModelParser.prototype.parseContent = function (content) {
            var raw = {};
            var currentProperty = null;
            var currentParent = [];
            var previousParents = [];
            var parseErrors = [];
            function onValue(value) {
                if (Array.isArray(currentParent)) {
                    currentParent.push(value);
                }
                else if (currentProperty) {
                    currentParent[currentProperty] = value;
                }
            }
            var visitor = {
                onObjectBegin: function () {
                    var object = {};
                    onValue(object);
                    previousParents.push(currentParent);
                    currentParent = object;
                    currentProperty = null;
                },
                onObjectProperty: function (name) {
                    currentProperty = name;
                },
                onObjectEnd: function () {
                    currentParent = previousParents.pop();
                },
                onArrayBegin: function () {
                    var array = [];
                    onValue(array);
                    previousParents.push(currentParent);
                    currentParent = array;
                    currentProperty = null;
                },
                onArrayEnd: function () {
                    currentParent = previousParents.pop();
                },
                onLiteralValue: onValue,
                onError: function (error) {
                    parseErrors.push({ error: error });
                }
            };
            if (content) {
                try {
                    json.visit(content, visitor);
                    raw = currentParent[0] || {};
                }
                catch (e) {
                    console.error("Error while parsing settings file " + this._name + ": " + e);
                    this._parseErrors = [e];
                }
            }
            return raw;
        };
        ConfigurationModelParser.prototype.parseRaw = function (raw) {
            var _this = this;
            var contents = configuration_1.toValuesTree(raw, function (message) { return console.error("Conflict in settings file " + _this._name + ": " + message); });
            var keys = Object.keys(raw);
            var overrides = configuration_1.toOverrides(raw, function (message) { return console.error("Conflict in settings file " + _this._name + ": " + message); });
            return { contents: contents, keys: keys, overrides: overrides };
        };
        return ConfigurationModelParser;
    }());
    exports.ConfigurationModelParser = ConfigurationModelParser;
    var Configuration = /** @class */ (function () {
        function Configuration(_defaultConfiguration, _userConfiguration, _workspaceConfiguration, _folderConfigurations, _memoryConfiguration, _memoryConfigurationByResource, _freeze) {
            if (_workspaceConfiguration === void 0) { _workspaceConfiguration = new ConfigurationModel(); }
            if (_folderConfigurations === void 0) { _folderConfigurations = new map_1.ResourceMap(); }
            if (_memoryConfiguration === void 0) { _memoryConfiguration = new ConfigurationModel(); }
            if (_memoryConfigurationByResource === void 0) { _memoryConfigurationByResource = new map_1.ResourceMap(); }
            if (_freeze === void 0) { _freeze = true; }
            this._defaultConfiguration = _defaultConfiguration;
            this._userConfiguration = _userConfiguration;
            this._workspaceConfiguration = _workspaceConfiguration;
            this._folderConfigurations = _folderConfigurations;
            this._memoryConfiguration = _memoryConfiguration;
            this._memoryConfigurationByResource = _memoryConfigurationByResource;
            this._freeze = _freeze;
            this._workspaceConsolidatedConfiguration = null;
            this._foldersConsolidatedConfigurations = new map_1.ResourceMap();
        }
        Configuration.prototype.getValue = function (section, overrides, workspace) {
            var consolidateConfigurationModel = this.getConsolidateConfigurationModel(overrides, workspace);
            return consolidateConfigurationModel.getValue(section);
        };
        Configuration.prototype.updateValue = function (key, value, overrides) {
            if (overrides === void 0) { overrides = {}; }
            var memoryConfiguration;
            if (overrides.resource) {
                memoryConfiguration = this._memoryConfigurationByResource.get(overrides.resource);
                if (!memoryConfiguration) {
                    memoryConfiguration = new ConfigurationModel();
                    this._memoryConfigurationByResource.set(overrides.resource, memoryConfiguration);
                }
            }
            else {
                memoryConfiguration = this._memoryConfiguration;
            }
            if (value === void 0) {
                memoryConfiguration.removeValue(key);
            }
            else {
                memoryConfiguration.setValue(key, value);
            }
            if (!overrides.resource) {
                this._workspaceConsolidatedConfiguration = null;
            }
        };
        Configuration.prototype.inspect = function (key, overrides, workspace) {
            var consolidateConfigurationModel = this.getConsolidateConfigurationModel(overrides, workspace);
            var folderConfigurationModel = this.getFolderConfigurationModelForResource(overrides.resource, workspace);
            var memoryConfigurationModel = overrides.resource ? this._memoryConfigurationByResource.get(overrides.resource) || this._memoryConfiguration : this._memoryConfiguration;
            return {
                default: overrides.overrideIdentifier ? this._defaultConfiguration.freeze().override(overrides.overrideIdentifier).getValue(key) : this._defaultConfiguration.freeze().getValue(key),
                user: overrides.overrideIdentifier ? this._userConfiguration.freeze().override(overrides.overrideIdentifier).getValue(key) : this._userConfiguration.freeze().getValue(key),
                workspace: workspace ? overrides.overrideIdentifier ? this._workspaceConfiguration.freeze().override(overrides.overrideIdentifier).getValue(key) : this._workspaceConfiguration.freeze().getValue(key) : void 0,
                workspaceFolder: folderConfigurationModel ? overrides.overrideIdentifier ? folderConfigurationModel.freeze().override(overrides.overrideIdentifier).getValue(key) : folderConfigurationModel.freeze().getValue(key) : void 0,
                memory: overrides.overrideIdentifier ? memoryConfigurationModel.freeze().override(overrides.overrideIdentifier).getValue(key) : memoryConfigurationModel.freeze().getValue(key),
                value: consolidateConfigurationModel.getValue(key)
            };
        };
        Configuration.prototype.keys = function (workspace) {
            var folderConfigurationModel = this.getFolderConfigurationModelForResource(null, workspace);
            return {
                default: this._defaultConfiguration.freeze().keys,
                user: this._userConfiguration.freeze().keys,
                workspace: this._workspaceConfiguration.freeze().keys,
                workspaceFolder: folderConfigurationModel ? folderConfigurationModel.freeze().keys : []
            };
        };
        Configuration.prototype.updateDefaultConfiguration = function (defaultConfiguration) {
            this._defaultConfiguration = defaultConfiguration;
            this._workspaceConsolidatedConfiguration = null;
            this._foldersConsolidatedConfigurations.clear();
        };
        Configuration.prototype.updateUserConfiguration = function (userConfiguration) {
            this._userConfiguration = userConfiguration;
            this._workspaceConsolidatedConfiguration = null;
            this._foldersConsolidatedConfigurations.clear();
        };
        Configuration.prototype.updateWorkspaceConfiguration = function (workspaceConfiguration) {
            this._workspaceConfiguration = workspaceConfiguration;
            this._workspaceConsolidatedConfiguration = null;
            this._foldersConsolidatedConfigurations.clear();
        };
        Configuration.prototype.updateFolderConfiguration = function (resource, configuration) {
            this._folderConfigurations.set(resource, configuration);
            this._foldersConsolidatedConfigurations.delete(resource);
        };
        Configuration.prototype.deleteFolderConfiguration = function (resource) {
            this.folders.delete(resource);
            this._foldersConsolidatedConfigurations.delete(resource);
        };
        Object.defineProperty(Configuration.prototype, "defaults", {
            get: function () {
                return this._defaultConfiguration;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Configuration.prototype, "user", {
            get: function () {
                return this._userConfiguration;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Configuration.prototype, "workspace", {
            get: function () {
                return this._workspaceConfiguration;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Configuration.prototype, "folders", {
            get: function () {
                return this._folderConfigurations;
            },
            enumerable: true,
            configurable: true
        });
        Configuration.prototype.getConsolidateConfigurationModel = function (overrides, workspace) {
            var configurationModel = this.getConsolidatedConfigurationModelForResource(overrides, workspace);
            return overrides.overrideIdentifier ? configurationModel.override(overrides.overrideIdentifier) : configurationModel;
        };
        Configuration.prototype.getConsolidatedConfigurationModelForResource = function (_a, workspace) {
            var resource = _a.resource;
            var consolidateConfiguration = this.getWorkspaceConsolidatedConfiguration();
            if (workspace && resource) {
                var root = workspace.getFolder(resource);
                if (root) {
                    consolidateConfiguration = this.getFolderConsolidatedConfiguration(root.uri) || consolidateConfiguration;
                }
                var memoryConfigurationForResource = this._memoryConfigurationByResource.get(resource);
                if (memoryConfigurationForResource) {
                    consolidateConfiguration = consolidateConfiguration.merge(memoryConfigurationForResource);
                }
            }
            return consolidateConfiguration;
        };
        Configuration.prototype.getWorkspaceConsolidatedConfiguration = function () {
            if (!this._workspaceConsolidatedConfiguration) {
                this._workspaceConsolidatedConfiguration = this._defaultConfiguration.merge(this._userConfiguration, this._workspaceConfiguration, this._memoryConfiguration);
                if (this._freeze) {
                    this._workspaceConfiguration = this._workspaceConfiguration.freeze();
                }
            }
            return this._workspaceConsolidatedConfiguration;
        };
        Configuration.prototype.getFolderConsolidatedConfiguration = function (folder) {
            var folderConsolidatedConfiguration = this._foldersConsolidatedConfigurations.get(folder);
            if (!folderConsolidatedConfiguration) {
                var workspaceConsolidateConfiguration = this.getWorkspaceConsolidatedConfiguration();
                var folderConfiguration = this._folderConfigurations.get(folder);
                if (folderConfiguration) {
                    folderConsolidatedConfiguration = workspaceConsolidateConfiguration.merge(folderConfiguration);
                    if (this._freeze) {
                        folderConsolidatedConfiguration = folderConsolidatedConfiguration.freeze();
                    }
                    this._foldersConsolidatedConfigurations.set(folder, folderConsolidatedConfiguration);
                }
                else {
                    folderConsolidatedConfiguration = workspaceConsolidateConfiguration;
                }
            }
            return folderConsolidatedConfiguration;
        };
        Configuration.prototype.getFolderConfigurationModelForResource = function (resource, workspace) {
            if (workspace && resource) {
                var root = workspace.getFolder(resource);
                if (root) {
                    return this._folderConfigurations.get(root.uri);
                }
            }
            return null;
        };
        Configuration.prototype.toData = function () {
            var _this = this;
            return {
                defaults: {
                    contents: this._defaultConfiguration.contents,
                    overrides: this._defaultConfiguration.overrides,
                    keys: this._defaultConfiguration.keys
                },
                user: {
                    contents: this._userConfiguration.contents,
                    overrides: this._userConfiguration.overrides,
                    keys: this._userConfiguration.keys
                },
                workspace: {
                    contents: this._workspaceConfiguration.contents,
                    overrides: this._workspaceConfiguration.overrides,
                    keys: this._workspaceConfiguration.keys
                },
                folders: this._folderConfigurations.keys().reduce(function (result, folder) {
                    var _a = _this._folderConfigurations.get(folder), contents = _a.contents, overrides = _a.overrides, keys = _a.keys;
                    result[folder.toString()] = { contents: contents, overrides: overrides, keys: keys };
                    return result;
                }, Object.create({})),
                isComplete: true
            };
        };
        Configuration.prototype.allKeys = function (workspace) {
            var keys = this.keys(workspace);
            var all = keys.default.slice();
            var addKeys = function (keys) {
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var key = keys_1[_i];
                    if (all.indexOf(key) === -1) {
                        all.push(key);
                    }
                }
            };
            addKeys(keys.user);
            addKeys(keys.workspace);
            for (var _i = 0, _a = this.folders.keys(); _i < _a.length; _i++) {
                var resource = _a[_i];
                addKeys(this.folders.get(resource).keys);
            }
            return all;
        };
        return Configuration;
    }());
    exports.Configuration = Configuration;
    var AbstractConfigurationChangeEvent = /** @class */ (function () {
        function AbstractConfigurationChangeEvent() {
        }
        AbstractConfigurationChangeEvent.prototype.doesConfigurationContains = function (configuration, config) {
            var _a;
            var changedKeysTree = configuration.contents;
            var requestedTree = configuration_1.toValuesTree((_a = {}, _a[config] = true, _a), function () { });
            var key;
            while (typeof requestedTree === 'object' && (key = Object.keys(requestedTree)[0])) { // Only one key should present, since we added only one property
                changedKeysTree = changedKeysTree[key];
                if (!changedKeysTree) {
                    return false; // Requested tree is not found
                }
                requestedTree = requestedTree[key];
            }
            return true;
        };
        AbstractConfigurationChangeEvent.prototype.updateKeys = function (configuration, keys, resource) {
            for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                var key = keys_2[_i];
                configuration.setValue(key, {});
            }
        };
        return AbstractConfigurationChangeEvent;
    }());
    exports.AbstractConfigurationChangeEvent = AbstractConfigurationChangeEvent;
    var ConfigurationChangeEvent = /** @class */ (function (_super) {
        __extends(ConfigurationChangeEvent, _super);
        function ConfigurationChangeEvent(_changedConfiguration, _changedConfigurationByResource) {
            if (_changedConfiguration === void 0) { _changedConfiguration = new ConfigurationModel(); }
            if (_changedConfigurationByResource === void 0) { _changedConfigurationByResource = new map_1.ResourceMap(); }
            var _this = _super.call(this) || this;
            _this._changedConfiguration = _changedConfiguration;
            _this._changedConfigurationByResource = _changedConfigurationByResource;
            return _this;
        }
        Object.defineProperty(ConfigurationChangeEvent.prototype, "changedConfiguration", {
            get: function () {
                return this._changedConfiguration;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationChangeEvent.prototype, "changedConfigurationByResource", {
            get: function () {
                return this._changedConfigurationByResource;
            },
            enumerable: true,
            configurable: true
        });
        ConfigurationChangeEvent.prototype.change = function (arg1, arg2) {
            if (arg1 instanceof ConfigurationChangeEvent) {
                this._changedConfiguration = this._changedConfiguration.merge(arg1._changedConfiguration);
                for (var _i = 0, _a = arg1._changedConfigurationByResource.keys(); _i < _a.length; _i++) {
                    var resource = _a[_i];
                    var changedConfigurationByResource = this.getOrSetChangedConfigurationForResource(resource);
                    changedConfigurationByResource = changedConfigurationByResource.merge(arg1._changedConfigurationByResource.get(resource));
                    this._changedConfigurationByResource.set(resource, changedConfigurationByResource);
                }
            }
            else {
                this.changeWithKeys(arg1, arg2);
            }
            return this;
        };
        ConfigurationChangeEvent.prototype.telemetryData = function (source, sourceConfig) {
            this._source = source;
            this._sourceConfig = sourceConfig;
            return this;
        };
        Object.defineProperty(ConfigurationChangeEvent.prototype, "affectedKeys", {
            get: function () {
                var keys = this._changedConfiguration.keys.slice();
                this._changedConfigurationByResource.forEach(function (model) { return keys.push.apply(keys, model.keys); });
                return arrays.distinct(keys);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationChangeEvent.prototype, "source", {
            get: function () {
                return this._source;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationChangeEvent.prototype, "sourceConfig", {
            get: function () {
                return this._sourceConfig;
            },
            enumerable: true,
            configurable: true
        });
        ConfigurationChangeEvent.prototype.affectsConfiguration = function (config, resource) {
            var configurationModelsToSearch = [this._changedConfiguration];
            if (resource) {
                var model = this._changedConfigurationByResource.get(resource);
                if (model) {
                    configurationModelsToSearch.push(model);
                }
            }
            else {
                configurationModelsToSearch.push.apply(configurationModelsToSearch, this._changedConfigurationByResource.values());
            }
            for (var _i = 0, configurationModelsToSearch_1 = configurationModelsToSearch; _i < configurationModelsToSearch_1.length; _i++) {
                var configuration = configurationModelsToSearch_1[_i];
                if (this.doesConfigurationContains(configuration, config)) {
                    return true;
                }
            }
            return false;
        };
        ConfigurationChangeEvent.prototype.changeWithKeys = function (keys, resource) {
            var changedConfiguration = resource ? this.getOrSetChangedConfigurationForResource(resource) : this._changedConfiguration;
            this.updateKeys(changedConfiguration, keys);
        };
        ConfigurationChangeEvent.prototype.getOrSetChangedConfigurationForResource = function (resource) {
            var changedConfigurationByResource = this._changedConfigurationByResource.get(resource);
            if (!changedConfigurationByResource) {
                changedConfigurationByResource = new ConfigurationModel();
                this._changedConfigurationByResource.set(resource, changedConfigurationByResource);
            }
            return changedConfigurationByResource;
        };
        return ConfigurationChangeEvent;
    }(AbstractConfigurationChangeEvent));
    exports.ConfigurationChangeEvent = ConfigurationChangeEvent;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/













define(__m[79/*vs/platform/configuration/node/configuration*/], __M([1/*require*/,0/*exports*/,12/*vs/base/common/lifecycle*/,15/*vs/base/common/errors*/,43/*vs/platform/configuration/common/configurationModels*/,64/*vs/base/node/config*/,9/*vs/base/common/event*/,2/*vs/base/common/winjs.base*/]), function (require, exports, lifecycle_1, errors_1, configurationModels_1, config_1, event_1, winjs_base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserConfiguration = /** @class */ (function (_super) {
        __extends(UserConfiguration, _super);
        function UserConfiguration(settingsPath) {
            var _this = _super.call(this) || this;
            _this._onDidChangeConfiguration = _this._register(new event_1.Emitter());
            _this.onDidChangeConfiguration = _this._onDidChangeConfiguration.event;
            _this.userConfigModelWatcher = new config_1.ConfigWatcher(settingsPath, {
                changeBufferDelay: 300, onError: function (error) { return errors_1.onUnexpectedError(error); }, defaultConfig: new configurationModels_1.ConfigurationModelParser(settingsPath), parse: function (content, parseErrors) {
                    var userConfigModelParser = new configurationModels_1.ConfigurationModelParser(settingsPath);
                    userConfigModelParser.parse(content);
                    parseErrors = userConfigModelParser.errors.slice();
                    return userConfigModelParser;
                }
            });
            _this._register(_this.userConfigModelWatcher);
            // Listeners
            _this._register(_this.userConfigModelWatcher.onDidUpdateConfiguration(function () { return _this._onDidChangeConfiguration.fire(_this.configurationModel); }));
            return _this;
        }
        Object.defineProperty(UserConfiguration.prototype, "configurationModel", {
            get: function () {
                return this.userConfigModelWatcher.getConfig().configurationModel;
            },
            enumerable: true,
            configurable: true
        });
        UserConfiguration.prototype.reload = function () {
            var _this = this;
            return new winjs_base_1.TPromise(function (c) { return _this.userConfigModelWatcher.reload(function () { return c(null); }); });
        };
        return UserConfiguration;
    }(lifecycle_1.Disposable));
    exports.UserConfiguration = UserConfiguration;
});























define(__m[80/*vs/platform/configuration/node/configurationService*/], __M([1/*require*/,0/*exports*/,14/*vs/platform/registry/common/platform*/,17/*vs/platform/configuration/common/configurationRegistry*/,12/*vs/base/common/lifecycle*/,13/*vs/platform/configuration/common/configuration*/,43/*vs/platform/configuration/common/configurationModels*/,9/*vs/base/common/event*/,19/*vs/platform/environment/common/environment*/,2/*vs/base/common/winjs.base*/,7/*vs/base/common/objects*/,79/*vs/platform/configuration/node/configuration*/]), function (require, exports, platform_1, configurationRegistry_1, lifecycle_1, configuration_1, configurationModels_1, event_1, environment_1, winjs_base_1, objects_1, configuration_2) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConfigurationService = /** @class */ (function (_super) {
        __extends(ConfigurationService, _super);
        function ConfigurationService(environmentService) {
            var _this = _super.call(this) || this;
            _this._onDidChangeConfiguration = _this._register(new event_1.Emitter());
            _this.onDidChangeConfiguration = _this._onDidChangeConfiguration.event;
            _this.userConfiguration = _this._register(new configuration_2.UserConfiguration(environmentService.appSettingsPath));
            _this.reset();
            // Listeners
            _this._register(_this.userConfiguration.onDidChangeConfiguration(function () { return _this.onDidChangeUserConfiguration(); }));
            _this._register(platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).onDidRegisterConfiguration(function (configurationProperties) { return _this.onDidRegisterConfiguration(configurationProperties); }));
            return _this;
        }
        Object.defineProperty(ConfigurationService.prototype, "configuration", {
            get: function () {
                return this._configuration;
            },
            enumerable: true,
            configurable: true
        });
        ConfigurationService.prototype.getConfigurationData = function () {
            return this.configuration.toData();
        };
        ConfigurationService.prototype.getValue = function (arg1, arg2) {
            var section = typeof arg1 === 'string' ? arg1 : void 0;
            var overrides = configuration_1.isConfigurationOverrides(arg1) ? arg1 : configuration_1.isConfigurationOverrides(arg2) ? arg2 : {};
            return this.configuration.getValue(section, overrides, null);
        };
        ConfigurationService.prototype.updateValue = function (key, value, arg3, arg4) {
            return winjs_base_1.TPromise.wrapError(new Error('not supported'));
        };
        ConfigurationService.prototype.inspect = function (key) {
            return this.configuration.inspect(key, {}, null);
        };
        ConfigurationService.prototype.keys = function () {
            return this.configuration.keys(null);
        };
        ConfigurationService.prototype.reloadConfiguration = function (folder) {
            var _this = this;
            return folder ? winjs_base_1.TPromise.as(null) :
                this.userConfiguration.reload().then(function () { return _this.onDidChangeUserConfiguration(); });
        };
        ConfigurationService.prototype.onDidChangeUserConfiguration = function () {
            var _this = this;
            var changedKeys = [];
            var _a = configuration_1.compare(this._configuration.user, this.userConfiguration.configurationModel), added = _a.added, updated = _a.updated, removed = _a.removed;
            changedKeys = added.concat(updated, removed);
            if (changedKeys.length) {
                var oldConfiguartion_1 = this._configuration;
                this.reset();
                changedKeys = changedKeys.filter(function (key) { return !objects_1.equals(oldConfiguartion_1.getValue(key, {}, null), _this._configuration.getValue(key, {}, null)); });
                if (changedKeys.length) {
                    this.trigger(changedKeys, 1 /* USER */);
                }
            }
        };
        ConfigurationService.prototype.onDidRegisterConfiguration = function (keys) {
            this.reset(); // reset our caches
            this.trigger(keys, 4 /* DEFAULT */);
        };
        ConfigurationService.prototype.reset = function () {
            var defaults = new configurationModels_1.DefaultConfigurationModel();
            var user = this.userConfiguration.configurationModel;
            this._configuration = new configurationModels_1.Configuration(defaults, user);
        };
        ConfigurationService.prototype.trigger = function (keys, source) {
            this._onDidChangeConfiguration.fire(new configurationModels_1.ConfigurationChangeEvent().change(keys).telemetryData(source, this.getTargetConfiguration(source)));
        };
        ConfigurationService.prototype.getTargetConfiguration = function (target) {
            switch (target) {
                case 4 /* DEFAULT */:
                    return this._configuration.defaults.contents;
                case 1 /* USER */:
                    return this._configuration.user.contents;
            }
            return {};
        };
        ConfigurationService = __decorate([
            __param(0, environment_1.IEnvironmentService)
        ], ConfigurationService);
        return ConfigurationService;
    }(lifecycle_1.Disposable));
    exports.ConfigurationService = ConfigurationService;
});

define(__m[38/*vs/platform/request/node/request*/], __M([1/*require*/,0/*exports*/,47/*vs/nls!vs/platform/request/node/request*/,4/*vs/platform/instantiation/common/instantiation*/,17/*vs/platform/configuration/common/configurationRegistry*/,14/*vs/platform/registry/common/platform*/]), function (require, exports, nls_1, instantiation_1, configurationRegistry_1, platform_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IRequestService = instantiation_1.createDecorator('requestService2');
    platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration)
        .registerConfiguration({
        id: 'http',
        order: 15,
        title: nls_1.localize(0, null),
        type: 'object',
        properties: {
            'http.proxy': {
                type: 'string',
                pattern: '^https?://([^:]*(:[^@]*)?@)?([^:]+)(:\\d+)?/?$|^$',
                description: nls_1.localize(1, null)
            },
            'http.proxyStrictSSL': {
                type: 'boolean',
                default: true,
                description: nls_1.localize(2, null)
            },
            'http.proxyAuthorization': {
                type: ['null', 'string'],
                default: null,
                description: nls_1.localize(3, null)
            }
        }
    });
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[82/*vs/platform/state/common/state*/], __M([1/*require*/,0/*exports*/,4/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IStateService = instantiation_1.createDecorator('stateService');
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[83/*vs/platform/state/node/stateService*/], __M([1/*require*/,0/*exports*/,8/*path*/,26/*fs*/,19/*vs/platform/environment/common/environment*/,32/*vs/base/node/extfs*/,5/*vs/base/common/types*/,10/*vs/platform/log/common/log*/]), function (require, exports, path, fs, environment_1, extfs_1, types_1, log_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var FileStorage = /** @class */ (function () {
        function FileStorage(dbPath, onError) {
            this.dbPath = dbPath;
            this.onError = onError;
            this.database = null;
        }
        FileStorage.prototype.ensureLoaded = function () {
            if (!this.database) {
                this.database = this.loadSync();
            }
        };
        FileStorage.prototype.getItem = function (key, defaultValue) {
            this.ensureLoaded();
            var res = this.database[key];
            if (types_1.isUndefinedOrNull(res)) {
                return defaultValue;
            }
            return res;
        };
        FileStorage.prototype.setItem = function (key, data) {
            this.ensureLoaded();
            // Remove an item when it is undefined or null
            if (types_1.isUndefinedOrNull(data)) {
                return this.removeItem(key);
            }
            // Shortcut for primitives that did not change
            if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
                if (this.database[key] === data) {
                    return;
                }
            }
            this.database[key] = data;
            this.saveSync();
        };
        FileStorage.prototype.removeItem = function (key) {
            this.ensureLoaded();
            // Only update if the key is actually present (not undefined)
            if (!types_1.isUndefined(this.database[key])) {
                this.database[key] = void 0;
                this.saveSync();
            }
        };
        FileStorage.prototype.loadSync = function () {
            try {
                return JSON.parse(fs.readFileSync(this.dbPath).toString()); // invalid JSON or permission issue can happen here
            }
            catch (error) {
                if (error && error.code !== 'ENOENT') {
                    this.onError(error);
                }
                return {};
            }
        };
        FileStorage.prototype.saveSync = function () {
            try {
                extfs_1.writeFileAndFlushSync(this.dbPath, JSON.stringify(this.database, null, 4)); // permission issue can happen here
            }
            catch (error) {
                this.onError(error);
            }
        };
        return FileStorage;
    }());
    exports.FileStorage = FileStorage;
    var StateService = /** @class */ (function () {
        function StateService(environmentService, logService) {
            this.fileStorage = new FileStorage(path.join(environmentService.userDataPath, 'storage.json'), function (error) { return logService.error(error); });
        }
        StateService.prototype.getItem = function (key, defaultValue) {
            return this.fileStorage.getItem(key, defaultValue);
        };
        StateService.prototype.setItem = function (key, data) {
            this.fileStorage.setItem(key, data);
        };
        StateService.prototype.removeItem = function (key) {
            this.fileStorage.removeItem(key);
        };
        StateService = __decorate([
            __param(0, environment_1.IEnvironmentService), __param(1, log_1.ILogService)
        ], StateService);
        return StateService;
    }());
    exports.StateService = StateService;
});

define(__m[28/*vs/platform/telemetry/common/telemetry*/], __M([1/*require*/,0/*exports*/,4/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ITelemetryService = instantiation_1.createDecorator('telemetryService');
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[85/*vs/platform/telemetry/common/telemetryService*/], __M([1/*require*/,0/*exports*/,74/*vs/nls!vs/platform/telemetry/common/telemetryService*/,11/*vs/base/common/strings*/,4/*vs/platform/instantiation/common/instantiation*/,13/*vs/platform/configuration/common/configuration*/,17/*vs/platform/configuration/common/configurationRegistry*/,2/*vs/base/common/winjs.base*/,12/*vs/base/common/lifecycle*/,7/*vs/base/common/objects*/,14/*vs/platform/registry/common/platform*/]), function (require, exports, nls_1, strings_1, instantiation_1, configuration_1, configurationRegistry_1, winjs_base_1, lifecycle_1, objects_1, platform_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TelemetryService = /** @class */ (function () {
        function TelemetryService(config, _configurationService) {
            this._configurationService = _configurationService;
            this._disposables = [];
            this._cleanupPatterns = [];
            this._appender = config.appender;
            this._commonProperties = config.commonProperties || winjs_base_1.TPromise.as({});
            this._piiPaths = config.piiPaths || [];
            this._userOptIn = true;
            // static cleanup pattern for: `file:///DANGEROUS/PATH/resources/app/Useful/Information`
            this._cleanupPatterns = [/file:\/\/\/.*?\/resources\/app\//gi];
            for (var _i = 0, _a = this._piiPaths; _i < _a.length; _i++) {
                var piiPath = _a[_i];
                this._cleanupPatterns.push(new RegExp(strings_1.escapeRegExpCharacters(piiPath), 'gi'));
            }
            if (this._configurationService) {
                this._updateUserOptIn();
                this._configurationService.onDidChangeConfiguration(this._updateUserOptIn, this, this._disposables);
                /* __GDPR__
                    "optInStatus" : {
                        "optIn" : { "classification": "SystemMetaData", "purpose": "BusinessInsight", "isMeasurement": true }
                    }
                */
                this.publicLog('optInStatus', { optIn: this._userOptIn });
            }
        }
        TelemetryService.prototype._updateUserOptIn = function () {
            var config = this._configurationService.getValue(TELEMETRY_SECTION_ID);
            this._userOptIn = config ? config.enableTelemetry : this._userOptIn;
        };
        Object.defineProperty(TelemetryService.prototype, "isOptedIn", {
            get: function () {
                return this._userOptIn;
            },
            enumerable: true,
            configurable: true
        });
        TelemetryService.prototype.getTelemetryInfo = function () {
            return this._commonProperties.then(function (values) {
                // well known properties
                var sessionId = values['sessionID'];
                var instanceId = values['common.instanceId'];
                var machineId = values['common.machineId'];
                return { sessionId: sessionId, instanceId: instanceId, machineId: machineId };
            });
        };
        TelemetryService.prototype.dispose = function () {
            this._disposables = lifecycle_1.dispose(this._disposables);
        };
        TelemetryService.prototype.publicLog = function (eventName, data, anonymizeFilePaths) {
            var _this = this;
            // don't send events when the user is optout
            if (!this._userOptIn) {
                return winjs_base_1.TPromise.as(undefined);
            }
            return this._commonProperties.then(function (values) {
                // (first) add common properties
                data = objects_1.mixin(data, values);
                // (last) remove all PII from data
                data = objects_1.cloneAndChange(data, function (value) {
                    if (typeof value === 'string') {
                        return _this._cleanupInfo(value, anonymizeFilePaths);
                    }
                    return undefined;
                });
                _this._appender.log(eventName, data);
            }, function (err) {
                // unsure what to do now...
                console.error(err);
            });
        };
        TelemetryService.prototype._cleanupInfo = function (stack, anonymizeFilePaths) {
            var updatedStack = stack;
            if (anonymizeFilePaths) {
                var cleanUpIndexes = [];
                for (var _i = 0, _a = this._cleanupPatterns; _i < _a.length; _i++) {
                    var regexp = _a[_i];
                    while (true) {
                        var result = regexp.exec(stack);
                        if (!result) {
                            break;
                        }
                        cleanUpIndexes.push([result.index, regexp.lastIndex]);
                    }
                }
                var nodeModulesRegex = /^[\\\/]?(node_modules|node_modules\.asar)[\\\/]/;
                var fileRegex = /(file:\/\/)?([a-zA-Z]:(\\\\|\\|\/)|(\\\\|\\|\/))?([\w-\._]+(\\\\|\\|\/))+[\w-\._]*/g;
                var _loop_1 = function () {
                    var result = fileRegex.exec(stack);
                    if (!result) {
                        return "break";
                    }
                    // Anoynimize user file paths that do not need to be retained or cleaned up.
                    if (!nodeModulesRegex.test(result[0]) && cleanUpIndexes.every(function (_a) {
                        var x = _a[0], y = _a[1];
                        return result.index < x || result.index >= y;
                    })) {
                        updatedStack = updatedStack.slice(0, result.index) + result[0].replace(/./g, 'a') + updatedStack.slice(fileRegex.lastIndex);
                    }
                };
                while (true) {
                    var state_1 = _loop_1();
                    if (state_1 === "break")
                        break;
                }
            }
            // sanitize with configured cleanup patterns
            for (var _b = 0, _c = this._cleanupPatterns; _b < _c.length; _b++) {
                var regexp = _c[_b];
                updatedStack = updatedStack.replace(regexp, '');
            }
            return updatedStack;
        };
        TelemetryService.IDLE_START_EVENT_NAME = 'UserIdleStart';
        TelemetryService.IDLE_STOP_EVENT_NAME = 'UserIdleStop';
        TelemetryService = __decorate([
            __param(1, instantiation_1.optional(configuration_1.IConfigurationService))
        ], TelemetryService);
        return TelemetryService;
    }());
    exports.TelemetryService = TelemetryService;
    var TELEMETRY_SECTION_ID = 'telemetry';
    platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).registerConfiguration({
        'id': TELEMETRY_SECTION_ID,
        'order': 110,
        'type': 'object',
        'title': nls_1.localize(0, null),
        'properties': {
            'telemetry.enableTelemetry': {
                'type': 'boolean',
                'description': nls_1.localize(1, null),
                'default': false,
                'tags': ['usesOnlineServices']
            }
        }
    });
});










define(__m[86/*vs/platform/telemetry/common/telemetryUtils*/], __M([1/*require*/,0/*exports*/,2/*vs/base/common/winjs.base*/,46/*vs/base/common/mime*/,24/*vs/base/common/paths*/,13/*vs/platform/configuration/common/configuration*/,10/*vs/platform/log/common/log*/]), function (require, exports, winjs_base_1, mime_1, paths, configuration_1, log_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NullTelemetryService = new /** @class */ (function () {
        function class_1() {
        }
        class_1.prototype.publicLog = function (eventName, data) {
            return winjs_base_1.TPromise.wrap(null);
        };
        class_1.prototype.getTelemetryInfo = function () {
            return winjs_base_1.TPromise.wrap({
                instanceId: 'someValue.instanceId',
                sessionId: 'someValue.sessionId',
                machineId: 'someValue.machineId'
            });
        };
        return class_1;
    }());
    function combinedAppender() {
        var appenders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            appenders[_i] = arguments[_i];
        }
        return {
            log: function (e, d) { return appenders.forEach(function (a) { return a.log(e, d); }); },
            dispose: function () { return winjs_base_1.TPromise.join(appenders.map(function (a) { return a.dispose(); })); }
        };
    }
    exports.combinedAppender = combinedAppender;
    exports.NullAppender = { log: function () { return null; }, dispose: function () { return winjs_base_1.TPromise.as(null); } };
    var LogAppender = /** @class */ (function () {
        function LogAppender(_logService) {
            this._logService = _logService;
            this.commonPropertiesRegex = /^sessionID$|^version$|^timestamp$|^commitHash$|^common\./;
        }
        LogAppender.prototype.dispose = function () {
            return winjs_base_1.TPromise.as(undefined);
        };
        LogAppender.prototype.log = function (eventName, data) {
            var _this = this;
            var strippedData = {};
            Object.keys(data).forEach(function (key) {
                if (!_this.commonPropertiesRegex.test(key)) {
                    strippedData[key] = data[key];
                }
            });
            this._logService.trace("telemetry/" + eventName, strippedData);
        };
        LogAppender = __decorate([
            __param(0, log_1.ILogService)
        ], LogAppender);
        return LogAppender;
    }());
    exports.LogAppender = LogAppender;
    function telemetryURIDescriptor(uri, hashPath) {
        var fsPath = uri && uri.fsPath;
        return fsPath ? { mimeType: mime_1.guessMimeTypes(fsPath).join(', '), ext: paths.extname(fsPath), path: hashPath(fsPath) } : {};
    }
    exports.telemetryURIDescriptor = telemetryURIDescriptor;
    /**
     * Only add settings that cannot contain any personal/private information of users (PII).
     */
    var configurationValueWhitelist = [
        'editor.tabCompletion',
        'editor.fontFamily',
        'editor.fontWeight',
        'editor.fontSize',
        'editor.lineHeight',
        'editor.letterSpacing',
        'editor.lineNumbers',
        'editor.rulers',
        'editor.wordSeparators',
        'editor.tabSize',
        'editor.insertSpaces',
        'editor.detectIndentation',
        'editor.roundedSelection',
        'editor.scrollBeyondLastLine',
        'editor.minimap.enabled',
        'editor.minimap.side',
        'editor.minimap.renderCharacters',
        'editor.minimap.maxColumn',
        'editor.find.seedSearchStringFromSelection',
        'editor.find.autoFindInSelection',
        'editor.wordWrap',
        'editor.wordWrapColumn',
        'editor.wrappingIndent',
        'editor.mouseWheelScrollSensitivity',
        'editor.multiCursorModifier',
        'editor.quickSuggestions',
        'editor.quickSuggestionsDelay',
        'editor.parameterHints.enabled',
        'editor.parameterHints.cycle',
        'editor.autoClosingBrackets',
        'editor.autoClosingQuotes',
        'editor.autoSurround',
        'editor.autoIndent',
        'editor.formatOnType',
        'editor.formatOnPaste',
        'editor.suggestOnTriggerCharacters',
        'editor.acceptSuggestionOnEnter',
        'editor.acceptSuggestionOnCommitCharacter',
        'editor.snippetSuggestions',
        'editor.emptySelectionClipboard',
        'editor.wordBasedSuggestions',
        'editor.suggestSelection',
        'editor.suggestFontSize',
        'editor.suggestLineHeight',
        'editor.selectionHighlight',
        'editor.occurrencesHighlight',
        'editor.overviewRulerLanes',
        'editor.overviewRulerBorder',
        'editor.cursorBlinking',
        'editor.cursorStyle',
        'editor.mouseWheelZoom',
        'editor.fontLigatures',
        'editor.hideCursorInOverviewRuler',
        'editor.renderWhitespace',
        'editor.renderControlCharacters',
        'editor.renderIndentGuides',
        'editor.renderLineHighlight',
        'editor.codeLens',
        'editor.folding',
        'editor.showFoldingControls',
        'editor.matchBrackets',
        'editor.glyphMargin',
        'editor.useTabStops',
        'editor.trimAutoWhitespace',
        'editor.stablePeek',
        'editor.dragAndDrop',
        'editor.formatOnSave',
        'editor.colorDecorators',
        'breadcrumbs.enabled',
        'breadcrumbs.filePath',
        'breadcrumbs.symbolPath',
        'breadcrumbs.useQuickPick',
        'explorer.openEditors.visible',
        'extensions.autoUpdate',
        'files.associations',
        'files.autoGuessEncoding',
        'files.autoSave',
        'files.autoSaveDelay',
        'files.encoding',
        'files.eol',
        'files.hotExit',
        'files.trimTrailingWhitespace',
        'git.confirmSync',
        'git.enabled',
        'http.proxyStrictSSL',
        'javascript.validate.enable',
        'php.builtInCompletions.enable',
        'php.validate.enable',
        'php.validate.run',
        'terminal.integrated.fontFamily',
        'window.openFilesInNewWindow',
        'window.restoreWindows',
        'window.zoomLevel',
        'workbench.editor.enablePreview',
        'workbench.editor.enablePreviewFromQuickOpen',
        'workbench.editor.showTabs',
        'workbench.editor.swipeToNavigate',
        'workbench.sideBar.location',
        'workbench.startupEditor',
        'workbench.statusBar.visible',
        'workbench.welcome.enabled',
    ];
    function configurationTelemetry(telemetryService, configurationService) {
        return configurationService.onDidChangeConfiguration(function (event) {
            if (event.source !== 4 /* DEFAULT */) {
                /* __GDPR__
                    "updateConfiguration" : {
                        "configurationSource" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                        "configurationKeys": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                    }
                */
                telemetryService.publicLog('updateConfiguration', {
                    configurationSource: configuration_1.ConfigurationTargetToString(event.source),
                    configurationKeys: flattenKeys(event.sourceConfig)
                });
                /* __GDPR__
                    "updateConfigurationValues" : {
                        "configurationSource" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                        "configurationValues": { "classification": "CustomerContent", "purpose": "FeatureInsight" }
                    }
                */
                telemetryService.publicLog('updateConfigurationValues', {
                    configurationSource: configuration_1.ConfigurationTargetToString(event.source),
                    configurationValues: flattenValues(event.sourceConfig, configurationValueWhitelist)
                });
            }
        });
    }
    exports.configurationTelemetry = configurationTelemetry;
    function keybindingsTelemetry(telemetryService, keybindingService) {
        return keybindingService.onDidUpdateKeybindings(function (event) {
            if (event.source === 2 /* User */ && event.keybindings) {
                /* __GDPR__
                    "updateKeybindings" : {
                        "bindings": { "classification": "CustomerContent", "purpose": "FeatureInsight" }
                    }
                */
                telemetryService.publicLog('updateKeybindings', {
                    bindings: event.keybindings.map(function (binding) { return ({
                        key: binding.key,
                        command: binding.command,
                        when: binding.when,
                        args: binding.args ? true : undefined
                    }); })
                });
            }
        });
    }
    exports.keybindingsTelemetry = keybindingsTelemetry;
    function flattenKeys(value) {
        if (!value) {
            return [];
        }
        var result = [];
        flatKeys(result, '', value);
        return result;
    }
    function flatKeys(result, prefix, value) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.keys(value)
                .forEach(function (key) { return flatKeys(result, prefix ? prefix + "." + key : key, value[key]); });
        }
        else {
            result.push(prefix);
        }
    }
    function flattenValues(value, keys) {
        if (!value) {
            return [];
        }
        return keys.reduce(function (array, key) {
            var _a;
            var v = key.split('.')
                .reduce(function (tmp, k) { return tmp && typeof tmp === 'object' ? tmp[k] : undefined; }, value);
            if (typeof v !== 'undefined') {
                array.push((_a = {}, _a[key] = v, _a));
            }
            return array;
        }, []);
    }
});










define(__m[87/*vs/platform/telemetry/node/appInsightsAppender*/], __M([1/*require*/,0/*exports*/,94/*applicationinsights*/,5/*vs/base/common/types*/,7/*vs/base/common/objects*/,2/*vs/base/common/winjs.base*/,10/*vs/platform/log/common/log*/]), function (require, exports, appInsights, types_1, objects_1, winjs_base_1, log_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var _initialized = false;
    function ensureAIEngineIsInitialized() {
        if (_initialized === false) {
            // we need to pass some fake key, otherwise AI throws an exception
            appInsights.setup('2588e01f-f6c9-4cd6-a348-143741f8d702')
                .setAutoCollectConsole(false)
                .setAutoCollectExceptions(false)
                .setAutoCollectPerformance(false)
                .setAutoCollectRequests(false);
            _initialized = true;
        }
    }
    function getClient(aiKey) {
        ensureAIEngineIsInitialized();
        var client = appInsights.getClient(aiKey);
        client.channel.setOfflineMode(true);
        client.context.tags[client.context.keys.deviceMachineName] = ''; //prevent App Insights from reporting machine name
        if (aiKey.indexOf('AIF-') === 0) {
            client.config.endpointUrl = 'https://vortex.data.microsoft.com/collect/v1';
        }
        return client;
    }
    var AppInsightsAppender = /** @class */ (function () {
        function AppInsightsAppender(_eventPrefix, _defaultData, aiKeyOrClientFactory, // allow factory function for testing
        _logService) {
            this._eventPrefix = _eventPrefix;
            this._defaultData = _defaultData;
            this._logService = _logService;
            if (!this._defaultData) {
                this._defaultData = Object.create(null);
            }
            if (typeof aiKeyOrClientFactory === 'string') {
                this._aiClient = getClient(aiKeyOrClientFactory);
            }
            else if (typeof aiKeyOrClientFactory === 'function') {
                this._aiClient = aiKeyOrClientFactory();
            }
        }
        AppInsightsAppender._getData = function (data) {
            var properties = Object.create(null);
            var measurements = Object.create(null);
            var flat = Object.create(null);
            AppInsightsAppender._flaten(data, flat);
            for (var prop in flat) {
                // enforce property names less than 150 char, take the last 150 char
                prop = prop.length > 150 ? prop.substr(prop.length - 149) : prop;
                var value = flat[prop];
                if (typeof value === 'number') {
                    measurements[prop] = value;
                }
                else if (typeof value === 'boolean') {
                    measurements[prop] = value ? 1 : 0;
                }
                else if (typeof value === 'string') {
                    //enforce property value to be less than 1024 char, take the first 1024 char
                    properties[prop] = value.substring(0, 1023);
                }
                else if (typeof value !== 'undefined' && value !== null) {
                    properties[prop] = value;
                }
            }
            return {
                properties: properties,
                measurements: measurements
            };
        };
        AppInsightsAppender._flaten = function (obj, result, order, prefix) {
            if (order === void 0) { order = 0; }
            if (!obj) {
                return;
            }
            for (var _i = 0, _a = Object.getOwnPropertyNames(obj); _i < _a.length; _i++) {
                var item = _a[_i];
                var value = obj[item];
                var index = prefix ? prefix + item : item;
                if (Array.isArray(value)) {
                    result[index] = objects_1.safeStringify(value);
                }
                else if (value instanceof Date) {
                    // TODO unsure why this is here and not in _getData
                    result[index] = value.toISOString();
                }
                else if (types_1.isObject(value)) {
                    if (order < 2) {
                        AppInsightsAppender._flaten(value, result, order + 1, index + '.');
                    }
                    else {
                        result[index] = objects_1.safeStringify(value);
                    }
                }
                else {
                    result[index] = value;
                }
            }
        };
        AppInsightsAppender.prototype.log = function (eventName, data) {
            if (!this._aiClient) {
                return;
            }
            data = objects_1.mixin(data, this._defaultData);
            data = AppInsightsAppender._getData(data);
            if (this._logService) {
                this._logService.trace("telemetry/" + eventName, data);
            }
            this._aiClient.trackEvent(this._eventPrefix + '/' + eventName, data.properties, data.measurements);
        };
        AppInsightsAppender.prototype.dispose = function () {
            var _this = this;
            if (this._aiClient) {
                return new winjs_base_1.TPromise(function (resolve) {
                    _this._aiClient.sendPendingData(function () {
                        // all data flushed
                        _this._aiClient = undefined;
                        resolve(void 0);
                    });
                });
            }
            return undefined;
        };
        AppInsightsAppender = __decorate([
            __param(3, log_1.ILogService)
        ], AppInsightsAppender);
        return AppInsightsAppender;
    }());
    exports.AppInsightsAppender = AppInsightsAppender;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[89/*vs/platform/telemetry/node/commonProperties*/], __M([1/*require*/,0/*exports*/,18/*vs/base/common/platform*/,27/*os*/,40/*vs/base/common/uuid*/,16/*vs/base/node/pfs*/]), function (require, exports, Platform, os, uuid, pfs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function resolveCommonProperties(commit, version, machineId, installSourcePath) {
        var result = Object.create(null);
        // __GDPR__COMMON__ "common.machineId" : { "endPoint": "MacAddressHash", "classification": "EndUserPseudonymizedInformation", "purpose": "FeatureInsight" }
        result['common.machineId'] = machineId;
        // __GDPR__COMMON__ "sessionID" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
        result['sessionID'] = uuid.generateUuid() + Date.now();
        // __GDPR__COMMON__ "commitHash" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
        result['commitHash'] = commit;
        // __GDPR__COMMON__ "version" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
        result['version'] = version;
        // __GDPR__COMMON__ "common.platformVersion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
        result['common.platformVersion'] = (os.release() || '').replace(/^(\d+)(\.\d+)?(\.\d+)?(.*)/, '$1$2$3');
        // __GDPR__COMMON__ "common.platform" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
        result['common.platform'] = Platform.PlatformToString(Platform.platform);
        // __GDPR__COMMON__ "common.nodePlatform" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
        result['common.nodePlatform'] = process.platform;
        // __GDPR__COMMON__ "common.nodeArch" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
        result['common.nodeArch'] = process.arch;
        // dynamic properties which value differs on each call
        var seq = 0;
        var startTime = Date.now();
        Object.defineProperties(result, {
            // __GDPR__COMMON__ "timestamp" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
            'timestamp': {
                get: function () { return new Date(); },
                enumerable: true
            },
            // __GDPR__COMMON__ "common.timesincesessionstart" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
            'common.timesincesessionstart': {
                get: function () { return Date.now() - startTime; },
                enumerable: true
            },
            // __GDPR__COMMON__ "common.sequence" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
            'common.sequence': {
                get: function () { return seq++; },
                enumerable: true
            }
        });
        return pfs_1.readFile(installSourcePath, 'utf8').then(function (contents) {
            // __GDPR__COMMON__ "common.source" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
            result['common.source'] = contents.slice(0, 30);
            return result;
        }, function (error) {
            return result;
        });
    }
    exports.resolveCommonProperties = resolveCommonProperties;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/













define(__m[91/*vs/platform/node/zip*/], __M([1/*require*/,0/*exports*/,50/*vs/nls!vs/platform/node/zip*/,8/*path*/,26/*fs*/,22/*vs/base/common/async*/,16/*vs/base/node/pfs*/,2/*vs/base/common/winjs.base*/,92/*yauzl*/,93/*yazl*/,9/*vs/base/common/event*/]), function (require, exports, nls, path, fs_1, async_1, pfs_1, winjs_base_1, yauzl_1, yazl, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtractError = /** @class */ (function (_super) {
        __extends(ExtractError, _super);
        function ExtractError(type, cause) {
            var _this = this;
            var message = cause.message;
            switch (type) {
                case 'CorruptZip':
                    message = "Corrupt ZIP: " + message;
                    break;
            }
            _this = _super.call(this, message) || this;
            _this.type = type;
            _this.cause = cause;
            return _this;
        }
        return ExtractError;
    }(Error));
    exports.ExtractError = ExtractError;
    function modeFromEntry(entry) {
        var attr = entry.externalFileAttributes >> 16 || 33188;
        return [448 /* S_IRWXU */, 56 /* S_IRWXG */, 7 /* S_IRWXO */]
            .map(function (mask) { return attr & mask; })
            .reduce(function (a, b) { return a + b; }, attr & 61440 /* S_IFMT */);
    }
    function toExtractError(err) {
        if (err instanceof ExtractError) {
            return err;
        }
        var type = void 0;
        if (/end of central directory record signature not found/.test(err.message)) {
            type = 'CorruptZip';
        }
        return new ExtractError(type, err);
    }
    function extractEntry(stream, fileName, mode, targetPath, options, token) {
        var dirName = path.dirname(fileName);
        var targetDirName = path.join(targetPath, dirName);
        if (targetDirName.indexOf(targetPath) !== 0) {
            return winjs_base_1.TPromise.wrapError(new Error(nls.localize(0, null, fileName)));
        }
        var targetFileName = path.join(targetPath, fileName);
        var istream;
        event_1.once(token.onCancellationRequested)(function () {
            if (istream) {
                istream.close();
            }
        });
        return pfs_1.mkdirp(targetDirName, void 0, token).then(function () { return new winjs_base_1.TPromise(function (c, e) {
            if (token.isCancellationRequested) {
                return;
            }
            istream = fs_1.createWriteStream(targetFileName, { mode: mode });
            istream.once('close', function () { return c(null); });
            istream.once('error', e);
            stream.once('error', e);
            stream.pipe(istream);
        }); });
    }
    function extractZip(zipfile, targetPath, options, logService, token) {
        var last = async_1.createCancelablePromise(function () { return Promise.resolve(null); });
        var extractedEntriesCount = 0;
        event_1.once(token.onCancellationRequested)(function () {
            logService.debug(targetPath, 'Cancelled.');
            last.cancel();
            zipfile.close();
        });
        return new Promise(function (c, e) {
            var throttler = new async_1.SimpleThrottler();
            var readNextEntry = function (token) {
                if (token.isCancellationRequested) {
                    return;
                }
                extractedEntriesCount++;
                zipfile.readEntry();
            };
            zipfile.once('error', e);
            zipfile.once('close', function () { return last.then(function () {
                if (token.isCancellationRequested || zipfile.entryCount === extractedEntriesCount) {
                    c(null);
                }
                else {
                    e(new ExtractError('Incomplete', new Error(nls.localize(1, null, extractedEntriesCount, zipfile.entryCount))));
                }
            }, e); });
            zipfile.readEntry();
            zipfile.on('entry', function (entry) {
                if (token.isCancellationRequested) {
                    return;
                }
                if (!options.sourcePathRegex.test(entry.fileName)) {
                    readNextEntry(token);
                    return;
                }
                var fileName = entry.fileName.replace(options.sourcePathRegex, '');
                // directory file names end with '/'
                if (/\/$/.test(fileName)) {
                    var targetFileName_1 = path.join(targetPath, fileName);
                    last = async_1.createCancelablePromise(function (token) { return pfs_1.mkdirp(targetFileName_1, void 0, token).then(function () { return readNextEntry(token); }); });
                    return;
                }
                var stream = async_1.ninvoke(zipfile, zipfile.openReadStream, entry);
                var mode = modeFromEntry(entry);
                last = async_1.createCancelablePromise(function (token) { return throttler.queue(function () { return stream.then(function (stream) { return extractEntry(stream, fileName, mode, targetPath, options, token).then(function () { return readNextEntry(token); }); }); }); });
            });
        });
    }
    function openZip(zipFile, lazy) {
        if (lazy === void 0) { lazy = false; }
        return async_1.nfcall(yauzl_1.open, zipFile, lazy ? { lazyEntries: true } : void 0)
            .then(null, function (err) { return winjs_base_1.TPromise.wrapError(toExtractError(err)); });
    }
    function zip(zipPath, files) {
        return new winjs_base_1.TPromise(function (c, e) {
            var zip = new yazl.ZipFile();
            files.forEach(function (f) { return f.contents ? zip.addBuffer(typeof f.contents === 'string' ? Buffer.from(f.contents, 'utf8') : f.contents, f.path) : zip.addFile(f.localPath, f.path); });
            zip.end();
            var zipStream = fs_1.createWriteStream(zipPath);
            zip.outputStream.pipe(zipStream);
            zip.outputStream.once('error', e);
            zipStream.once('error', e);
            zipStream.once('finish', function () { return c(zipPath); });
        });
    }
    exports.zip = zip;
    function extract(zipPath, targetPath, options, logService, token) {
        if (options === void 0) { options = {}; }
        var sourcePathRegex = new RegExp(options.sourcePath ? "^" + options.sourcePath : '');
        var promise = openZip(zipPath, true);
        if (options.overwrite) {
            promise = promise.then(function (zipfile) { return pfs_1.rimraf(targetPath).then(function () { return zipfile; }); });
        }
        return promise.then(function (zipfile) { return extractZip(zipfile, targetPath, { sourcePathRegex: sourcePathRegex }, logService, token); });
    }
    exports.extract = extract;
    function read(zipPath, filePath) {
        return openZip(zipPath).then(function (zipfile) {
            return new winjs_base_1.TPromise(function (c, e) {
                zipfile.on('entry', function (entry) {
                    if (entry.fileName === filePath) {
                        async_1.ninvoke(zipfile, zipfile.openReadStream, entry).then(function (stream) { return c(stream); }, function (err) { return e(err); });
                    }
                });
                zipfile.once('close', function () { return e(new Error(nls.localize(2, null, filePath))); });
            });
        });
    }
    function buffer(zipPath, filePath) {
        return read(zipPath, filePath).then(function (stream) {
            return new winjs_base_1.TPromise(function (c, e) {
                var buffers = [];
                stream.once('error', e);
                stream.on('data', function (b) { return buffers.push(b); });
                stream.on('end', function () { return c(Buffer.concat(buffers)); });
            });
        });
    }
    exports.buffer = buffer;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

























































define(__m[88/*vs/platform/extensionManagement/node/extensionManagementService*/], __M([1/*require*/,0/*exports*/,55/*vs/nls!vs/platform/extensionManagement/node/extensionManagementService*/,8/*path*/,16/*vs/base/node/pfs*/,15/*vs/base/common/errors*/,7/*vs/base/common/objects*/,12/*vs/base/common/lifecycle*/,20/*vs/base/common/arrays*/,91/*vs/platform/node/zip*/,2/*vs/base/common/winjs.base*/,37/*vs/platform/extensionManagement/common/extensionManagement*/,29/*vs/platform/extensionManagement/common/extensionManagementUtil*/,52/*vs/platform/extensionManagement/common/extensionNls*/,19/*vs/platform/environment/common/environment*/,22/*vs/base/common/async*/,9/*vs/base/common/event*/,77/*semver*/,23/*vs/base/common/uri*/,21/*vs/platform/node/package*/,18/*vs/base/common/platform*/,10/*vs/platform/log/common/log*/,54/*vs/platform/extensionManagement/node/extensionsManifestCache*/,41/*vs/platform/dialogs/common/dialogs*/,25/*vs/base/common/severity*/,65/*vs/platform/extensionManagement/node/extensionLifecycle*/,36/*vs/base/common/errorMessage*/,28/*vs/platform/telemetry/common/telemetry*/,39/*vs/platform/extensions/node/extensionValidator*/,27/*os*/,40/*vs/base/common/uuid*/,59/*vs/platform/download/common/download*/,4/*vs/platform/instantiation/common/instantiation*/,31/*vs/base/common/network*/]), function (require, exports, nls, path, pfs, errors, objects_1, lifecycle_1, arrays_1, zip_1, winjs_base_1, extensionManagement_1, extensionManagementUtil_1, extensionNls_1, environment_1, async_1, event_1, semver, uri_1, package_1, platform_1, log_1, extensionsManifestCache_1, dialogs_1, severity_1, extensionLifecycle_1, errorMessage_1, telemetry_1, extensionValidator_1, os_1, uuid_1, download_1, instantiation_1, network_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ERROR_SCANNING_SYS_EXTENSIONS = 'scanningSystem';
    var ERROR_SCANNING_USER_EXTENSIONS = 'scanningUser';
    var INSTALL_ERROR_UNSET_UNINSTALLED = 'unsetUninstalled';
    var INSTALL_ERROR_INCOMPATIBLE = 'incompatible';
    var INSTALL_ERROR_DOWNLOADING = 'downloading';
    var INSTALL_ERROR_VALIDATING = 'validating';
    var INSTALL_ERROR_GALLERY = 'gallery';
    var INSTALL_ERROR_LOCAL = 'local';
    var INSTALL_ERROR_EXTRACTING = 'extracting';
    var INSTALL_ERROR_RENAMING = 'renaming';
    var INSTALL_ERROR_DELETING = 'deleting';
    var INSTALL_ERROR_MALICIOUS = 'malicious';
    var ERROR_UNKNOWN = 'unknown';
    var ExtensionManagementError = /** @class */ (function (_super) {
        __extends(ExtensionManagementError, _super);
        function ExtensionManagementError(message, code) {
            var _this = _super.call(this, message) || this;
            _this.code = code;
            return _this;
        }
        return ExtensionManagementError;
    }(Error));
    exports.ExtensionManagementError = ExtensionManagementError;
    function parseManifest(raw) {
        return new winjs_base_1.TPromise(function (c, e) {
            try {
                var manifest = JSON.parse(raw);
                var metadata = manifest.__metadata || null;
                delete manifest.__metadata;
                c({ manifest: manifest, metadata: metadata });
            }
            catch (err) {
                e(new Error(nls.localize(0, null)));
            }
        });
    }
    function validateLocalExtension(zipPath) {
        return zip_1.buffer(zipPath, 'extension/package.json')
            .then(function (buffer) { return parseManifest(buffer.toString('utf8')); })
            .then(function (_a) {
            var manifest = _a.manifest;
            return winjs_base_1.TPromise.as(manifest);
        });
    }
    exports.validateLocalExtension = validateLocalExtension;
    function readManifest(extensionPath) {
        var promises = [
            pfs.readFile(path.join(extensionPath, 'package.json'), 'utf8')
                .then(function (raw) { return parseManifest(raw); }),
            pfs.readFile(path.join(extensionPath, 'package.nls.json'), 'utf8')
                .then(null, function (err) { return err.code !== 'ENOENT' ? winjs_base_1.TPromise.wrapError(err) : '{}'; })
                .then(function (raw) { return JSON.parse(raw); })
        ];
        return winjs_base_1.TPromise.join(promises).then(function (_a) {
            var _b = _a[0], manifest = _b.manifest, metadata = _b.metadata, translations = _a[1];
            return {
                manifest: extensionNls_1.localizeManifest(manifest, translations),
                metadata: metadata
            };
        });
    }
    var ExtensionManagementService = /** @class */ (function (_super) {
        __extends(ExtensionManagementService, _super);
        function ExtensionManagementService(environmentService, dialogService, galleryService, logService, downloadService, telemetryService) {
            var _this = _super.call(this) || this;
            _this.dialogService = dialogService;
            _this.galleryService = galleryService;
            _this.logService = logService;
            _this.downloadService = downloadService;
            _this.telemetryService = telemetryService;
            _this.lastReportTimestamp = 0;
            _this.installingExtensions = new Map();
            _this.uninstallingExtensions = new Map();
            _this._onInstallExtension = new event_1.Emitter();
            _this.onInstallExtension = _this._onInstallExtension.event;
            _this._onDidInstallExtension = new event_1.Emitter();
            _this.onDidInstallExtension = _this._onDidInstallExtension.event;
            _this._onUninstallExtension = new event_1.Emitter();
            _this.onUninstallExtension = _this._onUninstallExtension.event;
            _this._onDidUninstallExtension = new event_1.Emitter();
            _this.onDidUninstallExtension = _this._onDidUninstallExtension.event;
            _this.systemExtensionsPath = environmentService.builtinExtensionsPath;
            _this.extensionsPath = environmentService.extensionsPath;
            _this.uninstalledPath = path.join(_this.extensionsPath, '.obsolete');
            _this.uninstalledFileLimiter = new async_1.Limiter(1);
            _this.manifestCache = _this._register(new extensionsManifestCache_1.ExtensionsManifestCache(environmentService, _this));
            _this.extensionLifecycle = _this._register(new extensionLifecycle_1.ExtensionsLifecycle(_this.logService));
            _this._register(lifecycle_1.toDisposable(function () {
                _this.installingExtensions.forEach(function (promise) { return promise.cancel(); });
                _this.uninstallingExtensions.forEach(function (promise) { return promise.cancel(); });
                _this.installingExtensions.clear();
                _this.uninstallingExtensions.clear();
            }));
            return _this;
        }
        ExtensionManagementService.prototype.zip = function (extension) {
            return winjs_base_1.TPromise.wrap(this.collectFiles(extension))
                .then(function (files) { return zip_1.zip(path.join(os_1.tmpdir(), uuid_1.generateUuid()), files); })
                .then(function (path) { return uri_1.URI.file(path); });
        };
        ExtensionManagementService.prototype.unzip = function (zipLocation, type) {
            return this.install(zipLocation, type);
        };
        ExtensionManagementService.prototype.collectFiles = function (extension) {
            var _this = this;
            var collectFilesFromDirectory = function (dir) { return __awaiter(_this, void 0, void 0, function () {
                var entries, stats, promise;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pfs.readdir(dir)];
                        case 1:
                            entries = _a.sent();
                            entries = entries.map(function (e) { return path.join(dir, e); });
                            return [4 /*yield*/, Promise.all(entries.map(function (e) { return pfs.stat(e); }))];
                        case 2:
                            stats = _a.sent();
                            promise = Promise.resolve([]);
                            stats.forEach(function (stat, index) {
                                var entry = entries[index];
                                if (stat.isFile()) {
                                    promise = promise.then(function (result) { return (result.concat([entry])); });
                                }
                                if (stat.isDirectory()) {
                                    promise = promise
                                        .then(function (result) { return collectFilesFromDirectory(entry)
                                        .then(function (files) { return (result.concat(files)); }); });
                                }
                            });
                            return [2 /*return*/, promise];
                    }
                });
            }); };
            return collectFilesFromDirectory(extension.location.fsPath)
                .then(function (files) { return files.map(function (f) { return ({ path: "extension/" + path.relative(extension.location.fsPath, f), localPath: f }); }); });
        };
        ExtensionManagementService.prototype.install = function (vsix, type) {
            var _this = this;
            if (type === void 0) { type = 1 /* User */; }
            return winjs_base_1.TPromise.wrap(async_1.createCancelablePromise(function (token) {
                return _this.downloadVsix(vsix)
                    .then(function (downloadLocation) {
                    var zipPath = path.resolve(downloadLocation.fsPath);
                    return validateLocalExtension(zipPath)
                        .then(function (manifest) {
                        var identifier = { id: getLocalExtensionIdFromManifest(manifest) };
                        if (manifest.engines && manifest.engines.vscode && !extensionValidator_1.isEngineValid(manifest.engines.vscode)) {
                            return winjs_base_1.TPromise.wrapError(new Error(nls.localize(1, null, identifier.id, package_1.default.version)));
                        }
                        return _this.removeIfExists(identifier.id)
                            .then(function () { return _this.checkOutdated(manifest)
                            .then(function (validated) {
                            if (validated) {
                                _this.logService.info('Installing the extension:', identifier.id);
                                _this._onInstallExtension.fire({ identifier: identifier, zipPath: zipPath });
                                return _this.getMetadata(extensionManagementUtil_1.getGalleryExtensionId(manifest.publisher, manifest.name))
                                    .then(function (metadata) { return _this.installFromZipPath(identifier, zipPath, metadata, type, token); }, function (error) { return _this.installFromZipPath(identifier, zipPath, null, type, token); })
                                    .then(function () { _this.logService.info('Successfully installed the extension:', identifier.id); return identifier; }, function (e) {
                                    _this.logService.error('Failed to install the extension:', identifier.id, e.message);
                                    return winjs_base_1.TPromise.wrapError(e);
                                });
                            }
                            return null;
                        }); }, function (e) { return winjs_base_1.TPromise.wrapError(new Error(nls.localize(2, null, manifest.displayName || manifest.name))); });
                    });
                });
            }));
        };
        ExtensionManagementService.prototype.downloadVsix = function (vsix) {
            if (vsix.scheme === network_1.Schemas.file) {
                return winjs_base_1.TPromise.as(vsix);
            }
            if (!this.downloadService) {
                throw new Error('Download service is not available');
            }
            var downloadedLocation = path.join(os_1.tmpdir(), uuid_1.generateUuid());
            return this.downloadService.download(vsix, downloadedLocation).then(function () { return uri_1.URI.file(downloadedLocation); });
        };
        ExtensionManagementService.prototype.removeIfExists = function (id) {
            var _this = this;
            return this.getInstalled(1 /* User */)
                .then(function (installed) { return installed.filter(function (i) { return i.identifier.id === id; })[0]; })
                .then(function (existing) { return existing ? _this.removeExtension(existing, 'existing') : null; });
        };
        ExtensionManagementService.prototype.checkOutdated = function (manifest) {
            var _this = this;
            var extensionIdentifier = { id: extensionManagementUtil_1.getGalleryExtensionId(manifest.publisher, manifest.name) };
            return this.getInstalled(1 /* User */)
                .then(function (installedExtensions) {
                var newer = installedExtensions.filter(function (local) { return extensionManagementUtil_1.areSameExtensions(extensionIdentifier, { id: extensionManagementUtil_1.getGalleryExtensionIdFromLocal(local) }) && semver.gt(local.manifest.version, manifest.version); })[0];
                if (newer) {
                    var message = nls.localize(3, null);
                    var buttons = [
                        nls.localize(4, null),
                        nls.localize(5, null)
                    ];
                    return _this.dialogService.show(severity_1.default.Info, message, buttons, { cancelId: 1 })
                        .then(function (value) {
                        if (value === 0) {
                            return _this.uninstall(newer, true).then(function () { return true; });
                        }
                        return winjs_base_1.TPromise.wrapError(errors.canceled());
                    });
                }
                return true;
            });
        };
        ExtensionManagementService.prototype.installFromZipPath = function (identifier, zipPath, metadata, type, token) {
            var _this = this;
            return this.toNonCancellablePromise(this.getInstalled()
                .then(function (installed) {
                var operation = _this.getOperation({ id: extensionManagementUtil_1.getIdFromLocalExtensionId(identifier.id), uuid: identifier.uuid }, installed);
                return _this.installExtension({ zipPath: zipPath, id: identifier.id, metadata: metadata }, type, token)
                    .then(function (local) { return _this.installDependenciesAndPackExtensions(local, null).then(function () { return local; }, function (error) { return _this.uninstall(local, true).then(function () { return winjs_base_1.TPromise.wrapError(error); }, function () { return winjs_base_1.TPromise.wrapError(error); }); }); })
                    .then(function (local) { _this._onDidInstallExtension.fire({ identifier: identifier, zipPath: zipPath, local: local, operation: operation }); return local; }, function (error) { _this._onDidInstallExtension.fire({ identifier: identifier, zipPath: zipPath, operation: operation, error: error }); return winjs_base_1.TPromise.wrapError(error); });
            }));
        };
        ExtensionManagementService.prototype.installFromGallery = function (extension) {
            var _this = this;
            var cancellablePromise = this.installingExtensions.get(extension.identifier.id);
            if (!cancellablePromise) {
                var cancellationToken_1, successCallback_1, errorCallback_1;
                cancellablePromise = async_1.createCancelablePromise(function (token) { cancellationToken_1 = token; return new winjs_base_1.TPromise(function (c, e) { successCallback_1 = c; errorCallback_1 = e; }); });
                this.installingExtensions.set(extension.identifier.id, cancellablePromise);
                try {
                    var startTime_1 = new Date().getTime();
                    var identifier_1 = { id: getLocalExtensionIdFromGallery(extension, extension.version), uuid: extension.identifier.uuid };
                    var telemetryData_1 = extensionManagementUtil_1.getGalleryExtensionTelemetryData(extension);
                    var operation_1 = 1 /* Install */;
                    this.logService.info('Installing extension:', extension.name);
                    this._onInstallExtension.fire({ identifier: identifier_1, gallery: extension });
                    this.checkMalicious(extension)
                        .then(function () { return _this.getInstalled(1 /* User */); })
                        .then(function (installed) {
                        var existingExtension = installed.filter(function (i) { return extensionManagementUtil_1.areSameExtensions(i.galleryIdentifier, extension.identifier); })[0];
                        operation_1 = existingExtension ? 2 /* Update */ : 1 /* Install */;
                        return _this.downloadInstallableExtension(extension, operation_1)
                            .then(function (installableExtension) { return _this.installExtension(installableExtension, 1 /* User */, cancellationToken_1).then(function (local) { return async_1.always(pfs.rimraf(installableExtension.zipPath), function () { return null; }).then(function () { return local; }); }); })
                            .then(function (local) { return _this.installDependenciesAndPackExtensions(local, existingExtension)
                            .then(function () { return local; }, function (error) { return _this.uninstall(local, true).then(function () { return winjs_base_1.TPromise.wrapError(error); }, function () { return winjs_base_1.TPromise.wrapError(error); }); }); });
                    })
                        .then(function (local) {
                        _this.installingExtensions.delete(extension.identifier.id);
                        _this.logService.info("Extensions installed successfully:", extension.identifier.id);
                        _this._onDidInstallExtension.fire({ identifier: identifier_1, gallery: extension, local: local, operation: operation_1 });
                        _this.reportTelemetry(_this.getTelemetryEvent(operation_1), telemetryData_1, new Date().getTime() - startTime_1, void 0);
                        successCallback_1(null);
                    }, function (error) {
                        _this.installingExtensions.delete(extension.identifier.id);
                        var errorCode = error && error.code ? error.code : ERROR_UNKNOWN;
                        _this.logService.error("Failed to install extension:", extension.identifier.id, error ? error.message : errorCode);
                        _this._onDidInstallExtension.fire({ identifier: identifier_1, gallery: extension, operation: operation_1, error: errorCode });
                        _this.reportTelemetry(_this.getTelemetryEvent(operation_1), telemetryData_1, new Date().getTime() - startTime_1, error);
                        errorCallback_1(error);
                    });
                }
                catch (error) {
                    this.installingExtensions.delete(extension.identifier.id);
                    errorCallback_1(error);
                }
            }
            return winjs_base_1.TPromise.wrap(cancellablePromise);
        };
        ExtensionManagementService.prototype.reinstallFromGallery = function (extension) {
            var _this = this;
            if (!this.galleryService.isEnabled()) {
                return winjs_base_1.TPromise.wrapError(new Error(nls.localize(6, null)));
            }
            return this.findGalleryExtension(extension)
                .then(function (galleryExtension) {
                if (galleryExtension) {
                    return _this.setUninstalled(extension)
                        .then(function () { return _this.removeUninstalledExtension(extension)
                        .then(function () { return _this.installFromGallery(galleryExtension); }, function (e) { return winjs_base_1.TPromise.wrapError(new Error(nls.localize(7, null, errorMessage_1.toErrorMessage(e)))); }); });
                }
                return winjs_base_1.TPromise.wrapError(new Error(nls.localize(8, null)));
            });
        };
        ExtensionManagementService.prototype.getOperation = function (extensionToInstall, installed) {
            return installed.some(function (i) { return extensionManagementUtil_1.areSameExtensions({ id: extensionManagementUtil_1.getGalleryExtensionIdFromLocal(i), uuid: i.identifier.uuid }, extensionToInstall); }) ? 2 /* Update */ : 1 /* Install */;
        };
        ExtensionManagementService.prototype.getTelemetryEvent = function (operation) {
            return operation === 2 /* Update */ ? 'extensionGallery:update' : 'extensionGallery:install';
        };
        ExtensionManagementService.prototype.checkMalicious = function (extension) {
            return this.getExtensionsReport()
                .then(function (report) {
                if (extensionManagementUtil_1.getMaliciousExtensionsSet(report).has(extension.identifier.id)) {
                    throw new ExtensionManagementError(INSTALL_ERROR_MALICIOUS, nls.localize(9, null));
                }
                else {
                    return null;
                }
            });
        };
        ExtensionManagementService.prototype.downloadInstallableExtension = function (extension, operation) {
            var _this = this;
            var metadata = {
                id: extension.identifier.uuid,
                publisherId: extension.publisherId,
                publisherDisplayName: extension.publisherDisplayName,
            };
            return this.galleryService.loadCompatibleVersion(extension)
                .then(function (compatible) {
                if (compatible) {
                    _this.logService.trace('Started downloading extension:', extension.name);
                    return _this.galleryService.download(compatible, operation)
                        .then(function (zipPath) {
                        _this.logService.info('Downloaded extension:', extension.name, zipPath);
                        return validateLocalExtension(zipPath)
                            .then(function (manifest) { return ({ zipPath: zipPath, id: getLocalExtensionIdFromManifest(manifest), metadata: metadata }); }, function (error) { return winjs_base_1.TPromise.wrapError(new ExtensionManagementError(_this.joinErrors(error).message, INSTALL_ERROR_VALIDATING)); });
                    }, function (error) { return winjs_base_1.TPromise.wrapError(new ExtensionManagementError(_this.joinErrors(error).message, INSTALL_ERROR_DOWNLOADING)); });
                }
                else {
                    return winjs_base_1.TPromise.wrapError(new ExtensionManagementError(nls.localize(10, null, extension.identifier.id, package_1.default.version), INSTALL_ERROR_INCOMPATIBLE));
                }
            }, function (error) { return winjs_base_1.TPromise.wrapError(new ExtensionManagementError(_this.joinErrors(error).message, INSTALL_ERROR_GALLERY)); });
        };
        ExtensionManagementService.prototype.installExtension = function (installableExtension, type, token) {
            var _this = this;
            return this.unsetUninstalledAndGetLocal(installableExtension.id)
                .then(function (local) {
                if (local) {
                    return local;
                }
                return _this.extractAndInstall(installableExtension, type, token);
            }, function (e) {
                if (platform_1.isMacintosh) {
                    return winjs_base_1.TPromise.wrapError(new ExtensionManagementError(nls.localize(11, null), INSTALL_ERROR_UNSET_UNINSTALLED));
                }
                return winjs_base_1.TPromise.wrapError(new ExtensionManagementError(nls.localize(12, null), INSTALL_ERROR_UNSET_UNINSTALLED));
            });
        };
        ExtensionManagementService.prototype.unsetUninstalledAndGetLocal = function (id) {
            var _this = this;
            return this.isUninstalled(id)
                .then(function (isUninstalled) {
                if (isUninstalled) {
                    _this.logService.trace('Removing the extension from uninstalled list:', id);
                    // If the same version of extension is marked as uninstalled, remove it from there and return the local.
                    return _this.unsetUninstalled(id)
                        .then(function () {
                        _this.logService.info('Removed the extension from uninstalled list:', id);
                        return _this.getInstalled(1 /* User */);
                    })
                        .then(function (installed) { return installed.filter(function (i) { return i.identifier.id === id; })[0]; });
                }
                return null;
            });
        };
        ExtensionManagementService.prototype.extractAndInstall = function (_a, type, token) {
            var _this = this;
            var zipPath = _a.zipPath, id = _a.id, metadata = _a.metadata;
            var location = type === 1 /* User */ ? this.extensionsPath : this.systemExtensionsPath;
            var tempPath = path.join(location, "." + id);
            var extensionPath = path.join(location, id);
            return pfs.rimraf(extensionPath)
                .then(function () { return _this.extractAndRename(id, zipPath, tempPath, extensionPath, token); }, function (e) { return winjs_base_1.TPromise.wrapError(new ExtensionManagementError(nls.localize(13, null, extensionPath, id), INSTALL_ERROR_DELETING)); })
                .then(function () {
                _this.logService.info('Installation completed.', id);
                return _this.scanExtension(id, location, type);
            })
                .then(function (local) {
                if (metadata) {
                    local.metadata = metadata;
                    return _this.saveMetadataForLocalExtension(local);
                }
                return local;
            });
        };
        ExtensionManagementService.prototype.extractAndRename = function (id, zipPath, extractPath, renamePath, token) {
            var _this = this;
            return this.extract(id, zipPath, extractPath, token)
                .then(function () { return _this.rename(id, extractPath, renamePath, Date.now() + (2 * 60 * 1000) /* Retry for 2 minutes */)
                .then(function () { return _this.logService.info('Renamed to', renamePath); }, function (e) {
                _this.logService.info('Rename failed. Deleting from extracted location', extractPath);
                return async_1.always(pfs.rimraf(extractPath), function () { return null; }).then(function () { return winjs_base_1.TPromise.wrapError(e); });
            }); });
        };
        ExtensionManagementService.prototype.extract = function (id, zipPath, extractPath, token) {
            var _this = this;
            this.logService.trace("Started extracting the extension from " + zipPath + " to " + extractPath);
            return pfs.rimraf(extractPath)
                .then(function () { return zip_1.extract(zipPath, extractPath, { sourcePath: 'extension', overwrite: true }, _this.logService, token)
                .then(function () { return _this.logService.info("Extracted extension to " + extractPath + ":", id); }, function (e) { return async_1.always(pfs.rimraf(extractPath), function () { return null; })
                .then(function () { return winjs_base_1.TPromise.wrapError(new ExtensionManagementError(e.message, e instanceof zip_1.ExtractError ? e.type : INSTALL_ERROR_EXTRACTING)); }); }); }, function (e) { return winjs_base_1.TPromise.wrapError(new ExtensionManagementError(_this.joinErrors(e).message, INSTALL_ERROR_DELETING)); });
        };
        ExtensionManagementService.prototype.rename = function (id, extractPath, renamePath, retryUntil) {
            var _this = this;
            return pfs.rename(extractPath, renamePath)
                .then(null, function (error) {
                if (platform_1.isWindows && error && error.code === 'EPERM' && Date.now() < retryUntil) {
                    _this.logService.info("Failed renaming " + extractPath + " to " + renamePath + " with 'EPERM' error. Trying again...");
                    return _this.rename(id, extractPath, renamePath, retryUntil);
                }
                return winjs_base_1.TPromise.wrapError(new ExtensionManagementError(error.message || nls.localize(14, null, extractPath, renamePath), error.code || INSTALL_ERROR_RENAMING));
            });
        };
        ExtensionManagementService.prototype.installDependenciesAndPackExtensions = function (installed, existing) {
            var _this = this;
            if (this.galleryService.isEnabled()) {
                var dependenciesAndPackExtensions_1 = installed.manifest.extensionDependencies || [];
                if (installed.manifest.extensionPack) {
                    var _loop_1 = function (extension) {
                        // add only those extensions which are new in currently installed extension
                        if (!(existing && existing.manifest.extensionPack && existing.manifest.extensionPack.some(function (old) { return extensionManagementUtil_1.areSameExtensions({ id: old }, { id: extension }); }))) {
                            if (dependenciesAndPackExtensions_1.every(function (e) { return !extensionManagementUtil_1.areSameExtensions({ id: e }, { id: extension }); })) {
                                dependenciesAndPackExtensions_1.push(extension);
                            }
                        }
                    };
                    for (var _i = 0, _a = installed.manifest.extensionPack; _i < _a.length; _i++) {
                        var extension = _a[_i];
                        _loop_1(extension);
                    }
                }
                if (dependenciesAndPackExtensions_1.length) {
                    return this.getInstalled()
                        .then(function (installed) {
                        // filter out installing and installed extensions
                        var names = dependenciesAndPackExtensions_1.filter(function (id) { return !_this.installingExtensions.has(extensionManagementUtil_1.adoptToGalleryExtensionId(id)) && installed.every(function (_a) {
                            var galleryIdentifier = _a.galleryIdentifier;
                            return !extensionManagementUtil_1.areSameExtensions(galleryIdentifier, { id: id });
                        }); });
                        if (names.length) {
                            return _this.galleryService.query({ names: names, pageSize: dependenciesAndPackExtensions_1.length })
                                .then(function (galleryResult) {
                                var extensionsToInstall = galleryResult.firstPage;
                                return winjs_base_1.TPromise.join(extensionsToInstall.map(function (e) { return _this.installFromGallery(e); }))
                                    .then(function () { return null; }, function (errors) { return _this.rollback(extensionsToInstall).then(function () { return winjs_base_1.TPromise.wrapError(errors); }, function () { return winjs_base_1.TPromise.wrapError(errors); }); });
                            });
                        }
                        return null;
                    });
                }
            }
            return winjs_base_1.TPromise.as(null);
        };
        ExtensionManagementService.prototype.rollback = function (extensions) {
            var _this = this;
            return this.getInstalled(1 /* User */)
                .then(function (installed) {
                return winjs_base_1.TPromise.join(installed.filter(function (local) { return extensions.some(function (galleryExtension) { return local.identifier.id === getLocalExtensionIdFromGallery(galleryExtension, galleryExtension.version); }); }) // Only check id (pub.name-version) because we want to rollback the exact version
                    .map(function (local) { return _this.uninstall(local, true); }));
            })
                .then(function () { return null; }, function () { return null; });
        };
        ExtensionManagementService.prototype.uninstall = function (extension, force) {
            var _this = this;
            if (force === void 0) { force = false; }
            return this.toNonCancellablePromise(this.getInstalled(1 /* User */)
                .then(function (installed) {
                var promises = installed
                    .filter(function (e) { return e.manifest.publisher === extension.manifest.publisher && e.manifest.name === extension.manifest.name; })
                    .map(function (e) { return _this.checkForDependenciesAndUninstall(e, installed); });
                return winjs_base_1.TPromise.join(promises).then(function () { return null; }, function (error) { return winjs_base_1.TPromise.wrapError(_this.joinErrors(error)); });
            }));
        };
        ExtensionManagementService.prototype.updateMetadata = function (local, metadata) {
            var _this = this;
            local.metadata = metadata;
            return this.saveMetadataForLocalExtension(local)
                .then(function (localExtension) {
                _this.manifestCache.invalidate();
                return localExtension;
            });
        };
        ExtensionManagementService.prototype.saveMetadataForLocalExtension = function (local) {
            if (!local.metadata) {
                return winjs_base_1.TPromise.as(local);
            }
            var manifestPath = path.join(this.extensionsPath, local.identifier.id, 'package.json');
            return pfs.readFile(manifestPath, 'utf8')
                .then(function (raw) { return parseManifest(raw); })
                .then(function (_a) {
                var manifest = _a.manifest;
                return objects_1.assign(manifest, { __metadata: local.metadata });
            })
                .then(function (manifest) { return pfs.writeFile(manifestPath, JSON.stringify(manifest, null, '\t')); })
                .then(function () { return local; });
        };
        ExtensionManagementService.prototype.getMetadata = function (extensionName) {
            return this.findGalleryExtensionByName(extensionName)
                .then(function (galleryExtension) { return galleryExtension ? { id: galleryExtension.identifier.uuid, publisherDisplayName: galleryExtension.publisherDisplayName, publisherId: galleryExtension.publisherId } : null; });
        };
        ExtensionManagementService.prototype.findGalleryExtension = function (local) {
            var _this = this;
            if (local.identifier.uuid) {
                return this.findGalleryExtensionById(local.identifier.uuid)
                    .then(function (galleryExtension) { return galleryExtension ? galleryExtension : _this.findGalleryExtensionByName(extensionManagementUtil_1.getGalleryExtensionIdFromLocal(local)); });
            }
            return this.findGalleryExtensionByName(extensionManagementUtil_1.getGalleryExtensionIdFromLocal(local));
        };
        ExtensionManagementService.prototype.findGalleryExtensionById = function (uuid) {
            return this.galleryService.query({ ids: [uuid], pageSize: 1 }).then(function (galleryResult) { return galleryResult.firstPage[0]; });
        };
        ExtensionManagementService.prototype.findGalleryExtensionByName = function (name) {
            return this.galleryService.query({ names: [name], pageSize: 1 }).then(function (galleryResult) { return galleryResult.firstPage[0]; });
        };
        ExtensionManagementService.prototype.joinErrors = function (errorOrErrors) {
            var errors = Array.isArray(errorOrErrors) ? errorOrErrors : [errorOrErrors];
            if (errors.length === 1) {
                return errors[0] instanceof Error ? errors[0] : new Error(errors[0]);
            }
            return errors.reduce(function (previousValue, currentValue) {
                return new Error("" + previousValue.message + (previousValue.message ? ',' : '') + (currentValue instanceof Error ? currentValue.message : currentValue));
            }, new Error(''));
        };
        ExtensionManagementService.prototype.checkForDependenciesAndUninstall = function (extension, installed) {
            var _this = this;
            return this.preUninstallExtension(extension)
                .then(function () {
                var packedExtensions = _this.getAllPackExtensionsToUninstall(extension, installed);
                if (packedExtensions.length) {
                    return _this.uninstallExtensions(extension, packedExtensions, installed);
                }
                return _this.uninstallExtensions(extension, [], installed);
            })
                .then(function () { return _this.postUninstallExtension(extension); }, function (error) {
                _this.postUninstallExtension(extension, new ExtensionManagementError(error instanceof Error ? error.message : error, INSTALL_ERROR_LOCAL));
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        ExtensionManagementService.prototype.uninstallExtensions = function (extension, otherExtensionsToUninstall, installed) {
            var _this = this;
            var dependents = this.getDependents(extension, installed);
            if (dependents.length) {
                var remainingDependents = dependents.filter(function (dependent) { return extension !== dependent && otherExtensionsToUninstall.indexOf(dependent) === -1; });
                if (remainingDependents.length) {
                    return winjs_base_1.TPromise.wrapError(new Error(this.getDependentsErrorMessage(extension, remainingDependents)));
                }
            }
            return winjs_base_1.TPromise.join([this.uninstallExtension(extension)].concat(otherExtensionsToUninstall.map(function (d) { return _this.doUninstall(d); }))).then(function () { return null; });
        };
        ExtensionManagementService.prototype.getDependentsErrorMessage = function (extension, dependents) {
            if (dependents.length === 1) {
                return nls.localize(15, null, extension.manifest.displayName || extension.manifest.name, dependents[0].manifest.displayName || dependents[0].manifest.name);
            }
            if (dependents.length === 2) {
                return nls.localize(16, null, extension.manifest.displayName || extension.manifest.name, dependents[0].manifest.displayName || dependents[0].manifest.name, dependents[1].manifest.displayName || dependents[1].manifest.name);
            }
            return nls.localize(17, null, extension.manifest.displayName || extension.manifest.name, dependents[0].manifest.displayName || dependents[0].manifest.name, dependents[1].manifest.displayName || dependents[1].manifest.name);
        };
        ExtensionManagementService.prototype.getAllPackExtensionsToUninstall = function (extension, installed, checked) {
            if (checked === void 0) { checked = []; }
            if (checked.indexOf(extension) !== -1) {
                return [];
            }
            checked.push(extension);
            if (!extension.manifest.extensionPack || extension.manifest.extensionPack.length === 0) {
                return [];
            }
            var packedExtensions = installed.filter(function (i) { return extension.manifest.extensionPack.some(function (id) { return extensionManagementUtil_1.areSameExtensions({ id: id }, i.galleryIdentifier); }); });
            var packOfPackedExtensions = [];
            for (var _i = 0, packedExtensions_1 = packedExtensions; _i < packedExtensions_1.length; _i++) {
                var packedExtension = packedExtensions_1[_i];
                packOfPackedExtensions.push.apply(packOfPackedExtensions, this.getAllPackExtensionsToUninstall(packedExtension, installed, checked));
            }
            return packedExtensions.concat(packOfPackedExtensions);
        };
        ExtensionManagementService.prototype.getDependents = function (extension, installed) {
            return installed.filter(function (e) { return e.manifest.extensionDependencies && e.manifest.extensionDependencies.some(function (id) { return extensionManagementUtil_1.areSameExtensions({ id: id }, extension.galleryIdentifier); }); });
        };
        ExtensionManagementService.prototype.doUninstall = function (extension) {
            var _this = this;
            return this.preUninstallExtension(extension)
                .then(function () { return _this.uninstallExtension(extension); })
                .then(function () { return _this.postUninstallExtension(extension); }, function (error) {
                _this.postUninstallExtension(extension, new ExtensionManagementError(error instanceof Error ? error.message : error, INSTALL_ERROR_LOCAL));
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        ExtensionManagementService.prototype.preUninstallExtension = function (extension) {
            var _this = this;
            return pfs.exists(extension.location.fsPath)
                .then(function (exists) { return exists ? null : winjs_base_1.TPromise.wrapError(new Error(nls.localize(18, null))); })
                .then(function () {
                _this.logService.info('Uninstalling extension:', extension.identifier.id);
                _this._onUninstallExtension.fire(extension.identifier);
            });
        };
        ExtensionManagementService.prototype.uninstallExtension = function (local) {
            var _this = this;
            var id = extensionManagementUtil_1.getGalleryExtensionIdFromLocal(local);
            var promise = this.uninstallingExtensions.get(id);
            if (!promise) {
                // Set all versions of the extension as uninstalled
                promise = async_1.createCancelablePromise(function (token) { return _this.scanUserExtensions(false)
                    .then(function (userExtensions) { return _this.setUninstalled.apply(_this, userExtensions.filter(function (u) { return extensionManagementUtil_1.areSameExtensions({ id: extensionManagementUtil_1.getGalleryExtensionIdFromLocal(u), uuid: u.identifier.uuid }, { id: id, uuid: local.identifier.uuid }); })); })
                    .then(function () { _this.uninstallingExtensions.delete(id); }); });
                this.uninstallingExtensions.set(id, promise);
            }
            return winjs_base_1.TPromise.wrap(promise);
        };
        ExtensionManagementService.prototype.postUninstallExtension = function (extension, error) {
            return __awaiter(this, void 0, void 0, function () {
                var errorcode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!error) return [3 /*break*/, 1];
                            this.logService.error('Failed to uninstall extension:', extension.identifier.id, error.message);
                            return [3 /*break*/, 3];
                        case 1:
                            this.logService.info('Successfully uninstalled extension:', extension.identifier.id);
                            if (!extension.identifier.uuid) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.galleryService.reportStatistic(extension.manifest.publisher, extension.manifest.name, extension.manifest.version, "uninstall" /* Uninstall */)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            this.reportTelemetry('extensionGallery:uninstall', extensionManagementUtil_1.getLocalExtensionTelemetryData(extension), void 0, error);
                            errorcode = error ? error instanceof ExtensionManagementError ? error.code : ERROR_UNKNOWN : void 0;
                            this._onDidUninstallExtension.fire({ identifier: extension.identifier, error: errorcode });
                            return [2 /*return*/];
                    }
                });
            });
        };
        ExtensionManagementService.prototype.getInstalled = function (type) {
            var _this = this;
            if (type === void 0) { type = null; }
            var promises = [];
            if (type === null || type === 0 /* System */) {
                promises.push(this.scanSystemExtensions().then(null, function (e) { return new ExtensionManagementError(_this.joinErrors(e).message, ERROR_SCANNING_SYS_EXTENSIONS); }));
            }
            if (type === null || type === 1 /* User */) {
                promises.push(this.scanUserExtensions(true).then(null, function (e) { return new ExtensionManagementError(_this.joinErrors(e).message, ERROR_SCANNING_USER_EXTENSIONS); }));
            }
            return winjs_base_1.TPromise.join(promises).then(arrays_1.flatten, function (errors) { return winjs_base_1.TPromise.wrapError(_this.joinErrors(errors)); });
        };
        ExtensionManagementService.prototype.scanSystemExtensions = function () {
            var _this = this;
            this.logService.trace('Started scanning system extensions');
            return this.scanExtensions(this.systemExtensionsPath, 0 /* System */)
                .then(function (result) {
                _this.logService.info('Scanned system extensions:', result.length);
                return result;
            });
        };
        ExtensionManagementService.prototype.scanUserExtensions = function (excludeOutdated) {
            var _this = this;
            this.logService.trace('Started scanning user extensions');
            return winjs_base_1.TPromise.join([this.getUninstalledExtensions(), this.scanExtensions(this.extensionsPath, 1 /* User */)])
                .then(function (_a) {
                var uninstalled = _a[0], extensions = _a[1];
                extensions = extensions.filter(function (e) { return !uninstalled[e.identifier.id]; });
                if (excludeOutdated) {
                    var byExtension = extensionManagementUtil_1.groupByExtension(extensions, function (e) { return ({ id: extensionManagementUtil_1.getGalleryExtensionIdFromLocal(e), uuid: e.identifier.uuid }); });
                    extensions = byExtension.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.manifest.version, b.manifest.version); })[0]; });
                }
                _this.logService.info('Scanned user extensions:', extensions.length);
                return extensions;
            });
        };
        ExtensionManagementService.prototype.scanExtensions = function (root, type) {
            var _this = this;
            var limiter = new async_1.Limiter(10);
            return pfs.readdir(root)
                .then(function (extensionsFolders) { return winjs_base_1.TPromise.join(extensionsFolders.map(function (extensionFolder) { return limiter.queue(function () { return _this.scanExtension(extensionFolder, root, type); }); })); })
                .then(function (extensions) { return extensions.filter(function (e) { return e && e.identifier; }); });
        };
        ExtensionManagementService.prototype.scanExtension = function (folderName, root, type) {
            if (type === 1 /* User */ && folderName.indexOf('.') === 0) { // Do not consider user exension folder starting with `.`
                return winjs_base_1.TPromise.as(null);
            }
            var extensionPath = path.join(root, folderName);
            return pfs.readdir(extensionPath)
                .then(function (children) { return readManifest(extensionPath)
                .then(function (_a) {
                var manifest = _a.manifest, metadata = _a.metadata;
                var readme = children.filter(function (child) { return /^readme(\.txt|\.md|)$/i.test(child); })[0];
                var readmeUrl = readme ? uri_1.URI.file(path.join(extensionPath, readme)).toString() : null;
                var changelog = children.filter(function (child) { return /^changelog(\.txt|\.md|)$/i.test(child); })[0];
                var changelogUrl = changelog ? uri_1.URI.file(path.join(extensionPath, changelog)).toString() : null;
                if (manifest.extensionDependencies) {
                    manifest.extensionDependencies = manifest.extensionDependencies.map(function (id) { return extensionManagementUtil_1.adoptToGalleryExtensionId(id); });
                }
                if (manifest.extensionPack) {
                    manifest.extensionPack = manifest.extensionPack.map(function (id) { return extensionManagementUtil_1.adoptToGalleryExtensionId(id); });
                }
                var identifier = { id: type === 0 /* System */ ? folderName : getLocalExtensionIdFromManifest(manifest), uuid: metadata ? metadata.id : null };
                var galleryIdentifier = { id: extensionManagementUtil_1.getGalleryExtensionId(manifest.publisher, manifest.name), uuid: identifier.uuid };
                return { type: type, identifier: identifier, galleryIdentifier: galleryIdentifier, manifest: manifest, metadata: metadata, location: uri_1.URI.file(extensionPath), readmeUrl: readmeUrl, changelogUrl: changelogUrl };
            }); })
                .then(null, function () { return null; });
        };
        ExtensionManagementService.prototype.removeDeprecatedExtensions = function () {
            var _this = this;
            return this.removeUninstalledExtensions()
                .then(function () { return _this.removeOutdatedExtensions(); });
        };
        ExtensionManagementService.prototype.removeUninstalledExtensions = function () {
            var _this = this;
            return this.getUninstalledExtensions()
                .then(function (uninstalled) { return _this.scanExtensions(_this.extensionsPath, 1 /* User */) // All user extensions
                .then(function (extensions) {
                var toRemove = extensions.filter(function (e) { return uninstalled[e.identifier.id]; });
                return winjs_base_1.TPromise.join(toRemove.map(function (e) { return _this.extensionLifecycle.uninstall(e).then(function () { return _this.removeUninstalledExtension(e); }); }));
            }); }).then(function () { return null; });
        };
        ExtensionManagementService.prototype.removeOutdatedExtensions = function () {
            var _this = this;
            return this.scanExtensions(this.extensionsPath, 1 /* User */) // All user extensions
                .then(function (extensions) {
                var toRemove = [];
                // Outdated extensions
                var byExtension = extensionManagementUtil_1.groupByExtension(extensions, function (e) { return ({ id: extensionManagementUtil_1.getGalleryExtensionIdFromLocal(e), uuid: e.identifier.uuid }); });
                toRemove.push.apply(toRemove, arrays_1.flatten(byExtension.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.manifest.version, b.manifest.version); }).slice(1); })));
                return winjs_base_1.TPromise.join(toRemove.map(function (extension) { return _this.removeExtension(extension, 'outdated'); }));
            }).then(function () { return null; });
        };
        ExtensionManagementService.prototype.removeUninstalledExtension = function (extension) {
            var _this = this;
            return this.removeExtension(extension, 'uninstalled')
                .then(function () { return _this.withUninstalledExtensions(function (uninstalled) { return delete uninstalled[extension.identifier.id]; }); })
                .then(function () { return null; });
        };
        ExtensionManagementService.prototype.removeExtension = function (extension, type) {
            var _this = this;
            this.logService.trace("Deleting " + type + " extension from disk", extension.identifier.id);
            return pfs.rimraf(extension.location.fsPath).then(function () { return _this.logService.info('Deleted from disk', extension.identifier.id); });
        };
        ExtensionManagementService.prototype.isUninstalled = function (id) {
            return this.filterUninstalled(id).then(function (uninstalled) { return uninstalled.length === 1; });
        };
        ExtensionManagementService.prototype.filterUninstalled = function () {
            var ids = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                ids[_i] = arguments[_i];
            }
            return this.withUninstalledExtensions(function (allUninstalled) {
                var uninstalled = [];
                for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                    var id = ids_1[_i];
                    if (!!allUninstalled[id]) {
                        uninstalled.push(id);
                    }
                }
                return uninstalled;
            });
        };
        ExtensionManagementService.prototype.setUninstalled = function () {
            var extensions = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                extensions[_i] = arguments[_i];
            }
            var ids = extensions.map(function (e) { return e.identifier.id; });
            return this.withUninstalledExtensions(function (uninstalled) { return objects_1.assign(uninstalled, ids.reduce(function (result, id) { result[id] = true; return result; }, {})); });
        };
        ExtensionManagementService.prototype.unsetUninstalled = function (id) {
            return this.withUninstalledExtensions(function (uninstalled) { return delete uninstalled[id]; });
        };
        ExtensionManagementService.prototype.getUninstalledExtensions = function () {
            return this.withUninstalledExtensions(function (uninstalled) { return uninstalled; });
        };
        ExtensionManagementService.prototype.withUninstalledExtensions = function (fn) {
            var _this = this;
            return this.uninstalledFileLimiter.queue(function () {
                var result = null;
                return pfs.readFile(_this.uninstalledPath, 'utf8')
                    .then(null, function (err) { return err.code === 'ENOENT' ? winjs_base_1.TPromise.as('{}') : winjs_base_1.TPromise.wrapError(err); })
                    .then(function (raw) { try {
                    return JSON.parse(raw);
                }
                catch (e) {
                    return {};
                } })
                    .then(function (uninstalled) { result = fn(uninstalled); return uninstalled; })
                    .then(function (uninstalled) {
                    if (Object.keys(uninstalled).length === 0) {
                        return pfs.rimraf(_this.uninstalledPath);
                    }
                    else {
                        var raw = JSON.stringify(uninstalled);
                        return pfs.writeFile(_this.uninstalledPath, raw);
                    }
                })
                    .then(function () { return result; });
            });
        };
        ExtensionManagementService.prototype.getExtensionsReport = function () {
            var now = new Date().getTime();
            if (!this.reportedExtensions || now - this.lastReportTimestamp > 1000 * 60 * 5) { // 5 minute cache freshness
                this.reportedExtensions = this.updateReportCache();
                this.lastReportTimestamp = now;
            }
            return this.reportedExtensions;
        };
        ExtensionManagementService.prototype.updateReportCache = function () {
            var _this = this;
            this.logService.trace('ExtensionManagementService.refreshReportedCache');
            return this.galleryService.getExtensionsReport()
                .then(function (result) {
                _this.logService.trace("ExtensionManagementService.refreshReportedCache - got " + result.length + " reported extensions from service");
                return result;
            }, function (err) {
                _this.logService.trace('ExtensionManagementService.refreshReportedCache - failed to get extension report');
                return [];
            });
        };
        ExtensionManagementService.prototype.toNonCancellablePromise = function (promise) {
            return new winjs_base_1.TPromise(function (c, e) { return promise.then(function (result) { return c(result); }, function (error) { return e(error); }); });
        };
        ExtensionManagementService.prototype.reportTelemetry = function (eventName, extensionData, duration, error) {
            var errorcode = error ? error instanceof ExtensionManagementError ? error.code : ERROR_UNKNOWN : void 0;
            /* __GDPR__
                "extensionGallery:install" : {
                    "success": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                    "duration" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                    "errorcode": { "classification": "CallstackOrException", "purpose": "PerformanceAndHealth" },
                    "recommendationReason": { "retiredFromVersion": "1.23.0", "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                    "${include}": [
                        "${GalleryExtensionTelemetryData}"
                    ]
                }
            */
            /* __GDPR__
                "extensionGallery:uninstall" : {
                    "success": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                    "duration" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                    "errorcode": { "classification": "CallstackOrException", "purpose": "PerformanceAndHealth" },
                    "${include}": [
                        "${GalleryExtensionTelemetryData}"
                    ]
                }
            */
            /* __GDPR__
                "extensionGallery:update" : {
                    "success": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                    "duration" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                    "errorcode": { "classification": "CallstackOrException", "purpose": "PerformanceAndHealth" },
                    "${include}": [
                        "${GalleryExtensionTelemetryData}"
                    ]
                }
            */
            this.telemetryService.publicLog(eventName, objects_1.assign(extensionData, { success: !error, duration: duration, errorcode: errorcode }));
        };
        ExtensionManagementService = __decorate([
            __param(0, environment_1.IEnvironmentService),
            __param(1, dialogs_1.IDialogService),
            __param(2, extensionManagement_1.IExtensionGalleryService),
            __param(3, log_1.ILogService),
            __param(4, instantiation_1.optional(download_1.IDownloadService)),
            __param(5, telemetry_1.ITelemetryService)
        ], ExtensionManagementService);
        return ExtensionManagementService;
    }(lifecycle_1.Disposable));
    exports.ExtensionManagementService = ExtensionManagementService;
    function getLocalExtensionIdFromGallery(extension, version) {
        return extensionManagementUtil_1.getLocalExtensionId(extension.identifier.id, version);
    }
    exports.getLocalExtensionIdFromGallery = getLocalExtensionIdFromGallery;
    function getLocalExtensionIdFromManifest(manifest) {
        return extensionManagementUtil_1.getLocalExtensionId(extensionManagementUtil_1.getGalleryExtensionId(manifest.publisher, manifest.name), manifest.version);
    }
    exports.getLocalExtensionIdFromManifest = getLocalExtensionIdFromManifest;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



































define(__m[35/*vs/base/node/request*/], __M([1/*require*/,0/*exports*/,2/*vs/base/common/winjs.base*/,5/*vs/base/common/types*/,68/*url*/,26/*fs*/,7/*vs/base/common/objects*/,97/*zlib*/,15/*vs/base/common/errors*/]), function (require, exports, winjs_base_1, types_1, url_1, fs_1, objects_1, zlib_1, errors_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function getNodeRequest(options) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, module, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        endpoint = url_1.parse(options.url);
                        if (!(endpoint.protocol === 'https:')) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve_1, reject_1) { require(['https'], resolve_1, reject_1); })];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, new Promise(function (resolve_2, reject_2) { require(['http'], resolve_2, reject_2); })];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        module = _a;
                        return [2 /*return*/, module.request];
                }
            });
        });
    }
    function request(options, token) {
        var req;
        var rawRequestPromise = options.getRawRequest
            ? winjs_base_1.TPromise.as(options.getRawRequest(options))
            : winjs_base_1.TPromise.wrap(getNodeRequest(options));
        return rawRequestPromise.then(function (rawRequest) {
            return new winjs_base_1.TPromise(function (c, e) {
                var endpoint = url_1.parse(options.url);
                var opts = {
                    hostname: endpoint.hostname,
                    port: endpoint.port ? parseInt(endpoint.port) : (endpoint.protocol === 'https:' ? 443 : 80),
                    protocol: endpoint.protocol,
                    path: endpoint.path,
                    method: options.type || 'GET',
                    headers: options.headers,
                    agent: options.agent,
                    rejectUnauthorized: types_1.isBoolean(options.strictSSL) ? options.strictSSL : true
                };
                if (options.user && options.password) {
                    opts.auth = options.user + ':' + options.password;
                }
                req = rawRequest(opts, function (res) {
                    var followRedirects = types_1.isNumber(options.followRedirects) ? options.followRedirects : 3;
                    if (res.statusCode >= 300 && res.statusCode < 400 && followRedirects > 0 && res.headers['location']) {
                        request(objects_1.assign({}, options, {
                            url: res.headers['location'],
                            followRedirects: followRedirects - 1
                        }), token).then(c, e);
                    }
                    else {
                        var stream = res;
                        if (res.headers['content-encoding'] === 'gzip') {
                            stream = stream.pipe(zlib_1.createGunzip());
                        }
                        c({ res: res, stream: stream });
                    }
                });
                req.on('error', e);
                if (options.timeout) {
                    req.setTimeout(options.timeout);
                }
                if (options.data) {
                    if (typeof options.data === 'string') {
                        req.write(options.data);
                    }
                    else {
                        options.data.pipe(req);
                        return;
                    }
                }
                req.end();
                token.onCancellationRequested(function () {
                    req.abort();
                    e(errors_1.canceled());
                });
            });
        });
    }
    exports.request = request;
    function isSuccess(context) {
        return (context.res.statusCode >= 200 && context.res.statusCode < 300) || context.res.statusCode === 1223;
    }
    function hasNoContent(context) {
        return context.res.statusCode === 204;
    }
    function download(filePath, context) {
        return new winjs_base_1.TPromise(function (c, e) {
            var out = fs_1.createWriteStream(filePath);
            out.once('finish', function () { return c(null); });
            context.stream.once('error', e);
            context.stream.pipe(out);
        });
    }
    exports.download = download;
    function asText(context) {
        return new winjs_base_1.TPromise(function (c, e) {
            if (!isSuccess(context)) {
                return e('Server returned ' + context.res.statusCode);
            }
            if (hasNoContent(context)) {
                return c(null);
            }
            var buffer = [];
            context.stream.on('data', function (d) { return buffer.push(d); });
            context.stream.on('end', function () { return c(buffer.join('')); });
            context.stream.on('error', e);
        });
    }
    exports.asText = asText;
    function asJson(context) {
        return new winjs_base_1.TPromise(function (c, e) {
            if (!isSuccess(context)) {
                return e('Server returned ' + context.res.statusCode);
            }
            if (hasNoContent(context)) {
                return c(null);
            }
            var buffer = [];
            context.stream.on('data', function (d) { return buffer.push(d); });
            context.stream.on('end', function () {
                try {
                    c(JSON.parse(buffer.join('')));
                }
                catch (err) {
                    e(err);
                }
            });
            context.stream.on('error', e);
        });
    }
    exports.asJson = asJson;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/




















define(__m[66/*vs/platform/extensionManagement/node/extensionGalleryService*/], __M([1/*require*/,0/*exports*/,27/*os*/,8/*path*/,2/*vs/base/common/winjs.base*/,20/*vs/base/common/arrays*/,15/*vs/base/common/errors*/,29/*vs/platform/extensionManagement/common/extensionManagementUtil*/,7/*vs/base/common/objects*/,38/*vs/platform/request/node/request*/,28/*vs/platform/telemetry/common/telemetry*/,35/*vs/base/node/request*/,21/*vs/platform/node/package*/,34/*vs/platform/node/product*/,39/*vs/platform/extensions/node/extensionValidator*/,19/*vs/platform/environment/common/environment*/,16/*vs/base/node/pfs*/,32/*vs/base/node/extfs*/,40/*vs/base/common/uuid*/,44/*vs/base/common/map*/,99/*vs/base/common/cancellation*/]), function (require, exports, os_1, path, winjs_base_1, arrays_1, errors_1, extensionManagementUtil_1, objects_1, request_1, telemetry_1, request_2, package_1, product_1, extensionValidator_1, environment_1, pfs_1, extfs_1, uuid_1, map_1, cancellation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Flags;
    (function (Flags) {
        Flags[Flags["None"] = 0] = "None";
        Flags[Flags["IncludeVersions"] = 1] = "IncludeVersions";
        Flags[Flags["IncludeFiles"] = 2] = "IncludeFiles";
        Flags[Flags["IncludeCategoryAndTags"] = 4] = "IncludeCategoryAndTags";
        Flags[Flags["IncludeSharedAccounts"] = 8] = "IncludeSharedAccounts";
        Flags[Flags["IncludeVersionProperties"] = 16] = "IncludeVersionProperties";
        Flags[Flags["ExcludeNonValidated"] = 32] = "ExcludeNonValidated";
        Flags[Flags["IncludeInstallationTargets"] = 64] = "IncludeInstallationTargets";
        Flags[Flags["IncludeAssetUri"] = 128] = "IncludeAssetUri";
        Flags[Flags["IncludeStatistics"] = 256] = "IncludeStatistics";
        Flags[Flags["IncludeLatestVersionOnly"] = 512] = "IncludeLatestVersionOnly";
        Flags[Flags["Unpublished"] = 4096] = "Unpublished";
    })(Flags || (Flags = {}));
    function flagsToString() {
        var flags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            flags[_i] = arguments[_i];
        }
        return String(flags.reduce(function (r, f) { return r | f; }, 0));
    }
    var FilterType;
    (function (FilterType) {
        FilterType[FilterType["Tag"] = 1] = "Tag";
        FilterType[FilterType["ExtensionId"] = 4] = "ExtensionId";
        FilterType[FilterType["Category"] = 5] = "Category";
        FilterType[FilterType["ExtensionName"] = 7] = "ExtensionName";
        FilterType[FilterType["Target"] = 8] = "Target";
        FilterType[FilterType["Featured"] = 9] = "Featured";
        FilterType[FilterType["SearchText"] = 10] = "SearchText";
        FilterType[FilterType["ExcludeWithFlags"] = 12] = "ExcludeWithFlags";
    })(FilterType || (FilterType = {}));
    var AssetType = {
        Icon: 'Microsoft.VisualStudio.Services.Icons.Default',
        Details: 'Microsoft.VisualStudio.Services.Content.Details',
        Changelog: 'Microsoft.VisualStudio.Services.Content.Changelog',
        Manifest: 'Microsoft.VisualStudio.Code.Manifest',
        VSIX: 'Microsoft.VisualStudio.Services.VSIXPackage',
        License: 'Microsoft.VisualStudio.Services.Content.License',
        Repository: 'Microsoft.VisualStudio.Services.Links.Source'
    };
    var PropertyType = {
        Dependency: 'Microsoft.VisualStudio.Code.ExtensionDependencies',
        ExtensionPack: 'Microsoft.VisualStudio.Code.ExtensionPack',
        Engine: 'Microsoft.VisualStudio.Code.Engine'
    };
    var DefaultPageSize = 10;
    var DefaultQueryState = {
        pageNumber: 1,
        pageSize: DefaultPageSize,
        sortBy: 0 /* NoneOrRelevance */,
        sortOrder: 0 /* Default */,
        flags: Flags.None,
        criteria: [],
        assetTypes: []
    };
    var Query = /** @class */ (function () {
        function Query(state) {
            if (state === void 0) { state = DefaultQueryState; }
            this.state = state;
        }
        Object.defineProperty(Query.prototype, "pageNumber", {
            get: function () { return this.state.pageNumber; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Query.prototype, "pageSize", {
            get: function () { return this.state.pageSize; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Query.prototype, "sortBy", {
            get: function () { return this.state.sortBy; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Query.prototype, "sortOrder", {
            get: function () { return this.state.sortOrder; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Query.prototype, "flags", {
            get: function () { return this.state.flags; },
            enumerable: true,
            configurable: true
        });
        Query.prototype.withPage = function (pageNumber, pageSize) {
            if (pageSize === void 0) { pageSize = this.state.pageSize; }
            return new Query(objects_1.assign({}, this.state, { pageNumber: pageNumber, pageSize: pageSize }));
        };
        Query.prototype.withFilter = function (filterType) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            var criteria = this.state.criteria.concat(values.map(function (value) { return ({ filterType: filterType, value: value }); }));
            return new Query(objects_1.assign({}, this.state, { criteria: criteria }));
        };
        Query.prototype.withSortBy = function (sortBy) {
            return new Query(objects_1.assign({}, this.state, { sortBy: sortBy }));
        };
        Query.prototype.withSortOrder = function (sortOrder) {
            return new Query(objects_1.assign({}, this.state, { sortOrder: sortOrder }));
        };
        Query.prototype.withFlags = function () {
            var flags = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                flags[_i] = arguments[_i];
            }
            return new Query(objects_1.assign({}, this.state, { flags: flags.reduce(function (r, f) { return r | f; }, 0) }));
        };
        Query.prototype.withAssetTypes = function () {
            var assetTypes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                assetTypes[_i] = arguments[_i];
            }
            return new Query(objects_1.assign({}, this.state, { assetTypes: assetTypes }));
        };
        Object.defineProperty(Query.prototype, "raw", {
            get: function () {
                var _a = this.state, criteria = _a.criteria, pageNumber = _a.pageNumber, pageSize = _a.pageSize, sortBy = _a.sortBy, sortOrder = _a.sortOrder, flags = _a.flags, assetTypes = _a.assetTypes;
                var filters = [{ criteria: criteria, pageNumber: pageNumber, pageSize: pageSize, sortBy: sortBy, sortOrder: sortOrder }];
                return { filters: filters, assetTypes: assetTypes, flags: flags };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Query.prototype, "searchText", {
            get: function () {
                var criterium = this.state.criteria.filter(function (criterium) { return criterium.filterType === FilterType.SearchText; })[0];
                return criterium ? criterium.value : '';
            },
            enumerable: true,
            configurable: true
        });
        return Query;
    }());
    function getStatistic(statistics, name) {
        var result = (statistics || []).filter(function (s) { return s.statisticName === name; })[0];
        return result ? result.value : 0;
    }
    function getCoreTranslationAssets(version) {
        var coreTranslationAssetPrefix = 'Microsoft.VisualStudio.Code.Translation.';
        var result = version.files.filter(function (f) { return f.assetType.indexOf(coreTranslationAssetPrefix) === 0; });
        return result.reduce(function (result, file) {
            result[file.assetType.substring(coreTranslationAssetPrefix.length)] = getVersionAsset(version, file.assetType);
            return result;
        }, {});
    }
    function getVersionAsset(version, type) {
        var result = version.files.filter(function (f) { return f.assetType === type; })[0];
        if (type === AssetType.Repository) {
            if (version.properties) {
                var results = version.properties.filter(function (p) { return p.key === type; });
                var gitRegExp_1 = new RegExp('((git|ssh|http(s)?)|(git@[\w\.]+))(:(//)?)([\w\.@\:/\-~]+)(\.git)(/)?');
                var uri = results.filter(function (r) { return gitRegExp_1.test(r.value); })[0];
                if (!uri) {
                    return {
                        uri: null,
                        fallbackUri: null
                    };
                }
                return {
                    uri: uri.value,
                    fallbackUri: uri.value,
                };
            }
        }
        if (!result) {
            if (type === AssetType.Icon) {
                var uri = require.toUrl('./media/defaultIcon.png');
                return { uri: uri, fallbackUri: uri };
            }
            if (type === AssetType.Repository) {
                return {
                    uri: null,
                    fallbackUri: null
                };
            }
            return null;
        }
        if (type === AssetType.VSIX) {
            return {
                uri: version.fallbackAssetUri + "/" + type + "?redirect=true",
                fallbackUri: version.fallbackAssetUri + "/" + type
            };
        }
        return {
            uri: version.assetUri + "/" + type,
            fallbackUri: version.fallbackAssetUri + "/" + type
        };
    }
    function getExtensions(version, property) {
        var values = version.properties ? version.properties.filter(function (p) { return p.key === property; }) : [];
        var value = values.length > 0 && values[0].value;
        return value ? value.split(',').map(function (v) { return extensionManagementUtil_1.adoptToGalleryExtensionId(v); }) : [];
    }
    function getEngine(version) {
        var values = version.properties ? version.properties.filter(function (p) { return p.key === PropertyType.Engine; }) : [];
        return (values.length > 0 && values[0].value) || '';
    }
    function getIsPreview(flags) {
        return flags.indexOf('preview') !== -1;
    }
    function toExtension(galleryExtension, version, index, query, querySource) {
        var assets = {
            manifest: getVersionAsset(version, AssetType.Manifest),
            readme: getVersionAsset(version, AssetType.Details),
            changelog: getVersionAsset(version, AssetType.Changelog),
            download: getVersionAsset(version, AssetType.VSIX),
            icon: getVersionAsset(version, AssetType.Icon),
            license: getVersionAsset(version, AssetType.License),
            repository: getVersionAsset(version, AssetType.Repository),
            coreTranslations: getCoreTranslationAssets(version)
        };
        return {
            identifier: {
                id: extensionManagementUtil_1.getGalleryExtensionId(galleryExtension.publisher.publisherName, galleryExtension.extensionName),
                uuid: galleryExtension.extensionId
            },
            name: galleryExtension.extensionName,
            version: version.version,
            date: version.lastUpdated,
            displayName: galleryExtension.displayName,
            publisherId: galleryExtension.publisher.publisherId,
            publisher: galleryExtension.publisher.publisherName,
            publisherDisplayName: galleryExtension.publisher.displayName,
            description: galleryExtension.shortDescription || '',
            installCount: getStatistic(galleryExtension.statistics, 'install') + getStatistic(galleryExtension.statistics, 'updateCount'),
            rating: getStatistic(galleryExtension.statistics, 'averagerating'),
            ratingCount: getStatistic(galleryExtension.statistics, 'ratingcount'),
            assets: assets,
            properties: {
                dependencies: getExtensions(version, PropertyType.Dependency),
                extensionPack: getExtensions(version, PropertyType.ExtensionPack),
                engine: getEngine(version)
            },
            /* __GDPR__FRAGMENT__
                "GalleryExtensionTelemetryData2" : {
                    "index" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                    "searchText": { "classification": "CustomerContent", "purpose": "FeatureInsight" },
                    "querySource": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                }
            */
            telemetryData: {
                index: ((query.pageNumber - 1) * query.pageSize) + index,
                searchText: query.searchText,
                querySource: querySource
            },
            preview: getIsPreview(galleryExtension.flags)
        };
    }
    var ExtensionGalleryService = /** @class */ (function () {
        function ExtensionGalleryService(requestService, environmentService, telemetryService) {
            this.requestService = requestService;
            this.environmentService = environmentService;
            this.telemetryService = telemetryService;
            var config = product_1.default.extensionsGallery;
            this.extensionsGalleryUrl = config && config.serviceUrl;
            this.extensionsControlUrl = config && config.controlUrl;
            this.commonHeadersPromise = resolveMarketplaceHeaders(this.environmentService);
        }
        ExtensionGalleryService.prototype.api = function (path) {
            if (path === void 0) { path = ''; }
            return "" + this.extensionsGalleryUrl + path;
        };
        ExtensionGalleryService.prototype.isEnabled = function () {
            return !!this.extensionsGalleryUrl;
        };
        ExtensionGalleryService.prototype.getExtension = function (_a, version) {
            var id = _a.id, uuid = _a.uuid;
            var query = new Query()
                .withFlags(Flags.IncludeAssetUri, Flags.IncludeStatistics, Flags.IncludeFiles, Flags.IncludeVersionProperties)
                .withPage(1, 1)
                .withFilter(FilterType.Target, 'Microsoft.VisualStudio.Code')
                .withFilter(FilterType.ExcludeWithFlags, flagsToString(Flags.Unpublished));
            if (uuid) {
                query = query.withFilter(FilterType.ExtensionId, uuid);
            }
            else {
                query = query.withFilter(FilterType.ExtensionName, id);
            }
            return this.queryGallery(query, cancellation_1.CancellationToken.None).then(function (_a) {
                var galleryExtensions = _a.galleryExtensions;
                if (galleryExtensions.length) {
                    var galleryExtension = galleryExtensions[0];
                    var versionAsset = version ? galleryExtension.versions.filter(function (v) { return v.version === version; })[0] : galleryExtension.versions[0];
                    if (versionAsset) {
                        return toExtension(galleryExtension, versionAsset, 0, query);
                    }
                }
                return null;
            });
        };
        ExtensionGalleryService.prototype.query = function (options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            if (!this.isEnabled()) {
                return winjs_base_1.TPromise.wrapError(new Error('No extension gallery service configured.'));
            }
            var type = options.names ? 'ids' : (options.text ? 'text' : 'all');
            var text = options.text || '';
            var pageSize = objects_1.getOrDefault(options, function (o) { return o.pageSize; }, 50);
            /* __GDPR__
                "galleryService:query" : {
                    "type" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                    "text": { "classification": "CustomerContent", "purpose": "FeatureInsight" }
                }
            */
            this.telemetryService.publicLog('galleryService:query', { type: type, text: text });
            var query = new Query()
                .withFlags(Flags.IncludeLatestVersionOnly, Flags.IncludeAssetUri, Flags.IncludeStatistics, Flags.IncludeFiles, Flags.IncludeVersionProperties)
                .withPage(1, pageSize)
                .withFilter(FilterType.Target, 'Microsoft.VisualStudio.Code')
                .withFilter(FilterType.ExcludeWithFlags, flagsToString(Flags.Unpublished));
            if (text) {
                // Use category filter instead of "category:themes"
                text = text.replace(/\bcategory:("([^"]*)"|([^"]\S*))(\s+|\b|$)/g, function (_, quotedCategory, category) {
                    query = query.withFilter(FilterType.Category, category || quotedCategory);
                    return '';
                });
                // Use tag filter instead of "tag:debuggers"
                text = text.replace(/\btag:("([^"]*)"|([^"]\S*))(\s+|\b|$)/g, function (_, quotedTag, tag) {
                    query = query.withFilter(FilterType.Tag, tag || quotedTag);
                    return '';
                });
                text = text.trim();
                if (text) {
                    text = text.length < 200 ? text : text.substring(0, 200);
                    query = query.withFilter(FilterType.SearchText, text);
                }
                query = query.withSortBy(0 /* NoneOrRelevance */);
            }
            else if (options.ids) {
                query = query.withFilter.apply(query, [FilterType.ExtensionId].concat(options.ids));
            }
            else if (options.names) {
                query = query.withFilter.apply(query, [FilterType.ExtensionName].concat(options.names));
            }
            else {
                query = query.withSortBy(4 /* InstallCount */);
            }
            if (typeof options.sortBy === 'number') {
                query = query.withSortBy(options.sortBy);
            }
            if (typeof options.sortOrder === 'number') {
                query = query.withSortOrder(options.sortOrder);
            }
            return this.queryGallery(query, cancellation_1.CancellationToken.None).then(function (_a) {
                var galleryExtensions = _a.galleryExtensions, total = _a.total;
                var extensions = galleryExtensions.map(function (e, index) { return toExtension(e, e.versions[0], index, query, options.source); });
                var pageSize = query.pageSize;
                var getPage = function (pageIndex, ct) {
                    if (ct.isCancellationRequested) {
                        return winjs_base_1.TPromise.wrapError(errors_1.canceled());
                    }
                    var nextPageQuery = query.withPage(pageIndex + 1);
                    return _this.queryGallery(nextPageQuery, ct)
                        .then(function (_a) {
                        var galleryExtensions = _a.galleryExtensions;
                        return galleryExtensions.map(function (e, index) { return toExtension(e, e.versions[0], index, nextPageQuery, options.source); });
                    });
                };
                return { firstPage: extensions, total: total, pageSize: pageSize, getPage: getPage };
            });
        };
        ExtensionGalleryService.prototype.queryGallery = function (query, token) {
            var _this = this;
            return this.commonHeadersPromise.then(function (commonHeaders) {
                var data = JSON.stringify(query.raw);
                var headers = objects_1.assign({}, commonHeaders, {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json;api-version=3.0-preview.1',
                    'Accept-Encoding': 'gzip',
                    'Content-Length': data.length
                });
                return _this.requestService.request({
                    type: 'POST',
                    url: _this.api('/extensionquery'),
                    data: data,
                    headers: headers
                }, token).then(function (context) {
                    if (context.res.statusCode >= 400 && context.res.statusCode < 500) {
                        return { galleryExtensions: [], total: 0 };
                    }
                    return request_2.asJson(context).then(function (result) {
                        var r = result.results[0];
                        var galleryExtensions = r.extensions;
                        var resultCount = r.resultMetadata && r.resultMetadata.filter(function (m) { return m.metadataType === 'ResultCount'; })[0];
                        var total = resultCount && resultCount.metadataItems.filter(function (i) { return i.name === 'TotalCount'; })[0].count || 0;
                        return { galleryExtensions: galleryExtensions, total: total };
                    });
                });
            });
        };
        ExtensionGalleryService.prototype.reportStatistic = function (publisher, name, version, type) {
            var _this = this;
            if (!this.isEnabled()) {
                return winjs_base_1.TPromise.as(null);
            }
            return this.commonHeadersPromise.then(function (commonHeaders) {
                var headers = __assign({}, commonHeaders, { Accept: '*/*;api-version=4.0-preview.1' });
                return _this.requestService.request({
                    type: 'POST',
                    url: _this.api("/publishers/" + publisher + "/extensions/" + name + "/" + version + "/stats?statType=" + type),
                    headers: headers
                }, cancellation_1.CancellationToken.None).then(null, function () { return null; });
            });
        };
        ExtensionGalleryService.prototype.download = function (extension, operation) {
            var _this = this;
            var zipPath = path.join(os_1.tmpdir(), uuid_1.generateUuid());
            var data = extensionManagementUtil_1.getGalleryExtensionTelemetryData(extension);
            var startTime = new Date().getTime();
            /* __GDPR__
                "galleryService:downloadVSIX" : {
                    "duration": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                    "${include}": [
                        "${GalleryExtensionTelemetryData}"
                    ]
                }
            */
            var log = function (duration) { return _this.telemetryService.publicLog('galleryService:downloadVSIX', objects_1.assign(data, { duration: duration })); };
            var operationParam = operation === 1 /* Install */ ? 'install' : operation === 2 /* Update */ ? 'update' : '';
            var downloadAsset = operationParam ? {
                uri: extension.assets.download.uri + "&" + operationParam + "=true",
                fallbackUri: extension.assets.download.fallbackUri + "?" + operationParam + "=true"
            } : extension.assets.download;
            return this.getAsset(downloadAsset)
                .then(function (context) { return request_2.download(zipPath, context); })
                .then(function () { return log(new Date().getTime() - startTime); })
                .then(function () { return zipPath; });
        };
        ExtensionGalleryService.prototype.getReadme = function (extension, token) {
            return this.getAsset(extension.assets.readme, {}, token)
                .then(request_2.asText);
        };
        ExtensionGalleryService.prototype.getManifest = function (extension, token) {
            return this.getAsset(extension.assets.manifest, {}, token)
                .then(request_2.asText)
                .then(JSON.parse);
        };
        ExtensionGalleryService.prototype.getCoreTranslation = function (extension, languageId) {
            var asset = extension.assets.coreTranslations[languageId.toUpperCase()];
            if (asset) {
                return this.getAsset(asset)
                    .then(request_2.asText)
                    .then(JSON.parse);
            }
            return winjs_base_1.TPromise.as(null);
        };
        ExtensionGalleryService.prototype.getChangelog = function (extension, token) {
            return this.getAsset(extension.assets.changelog, {}, token)
                .then(request_2.asText);
        };
        ExtensionGalleryService.prototype.loadAllDependencies = function (extensions, token) {
            return this.getDependenciesReccursively(extensions.map(function (e) { return e.id; }), [], token);
        };
        ExtensionGalleryService.prototype.loadCompatibleVersion = function (extension) {
            var _this = this;
            if (extension.properties.engine && extensionValidator_1.isEngineValid(extension.properties.engine)) {
                return winjs_base_1.TPromise.wrap(extension);
            }
            var query = new Query()
                .withFlags(Flags.IncludeVersions, Flags.IncludeFiles, Flags.IncludeVersionProperties)
                .withPage(1, 1)
                .withFilter(FilterType.Target, 'Microsoft.VisualStudio.Code')
                .withFilter(FilterType.ExcludeWithFlags, flagsToString(Flags.Unpublished))
                .withAssetTypes(AssetType.Manifest, AssetType.VSIX)
                .withFilter(FilterType.ExtensionId, extension.identifier.uuid);
            return this.queryGallery(query, cancellation_1.CancellationToken.None)
                .then(function (_a) {
                var galleryExtensions = _a.galleryExtensions;
                var rawExtension = galleryExtensions[0];
                if (!rawExtension) {
                    return null;
                }
                return _this.getLastValidExtensionVersion(rawExtension, rawExtension.versions)
                    .then(function (rawVersion) {
                    if (rawVersion) {
                        extension.properties.dependencies = getExtensions(rawVersion, PropertyType.Dependency);
                        extension.properties.engine = getEngine(rawVersion);
                        extension.assets.download = getVersionAsset(rawVersion, AssetType.VSIX);
                        extension.version = rawVersion.version;
                        return extension;
                    }
                    return null;
                });
            });
        };
        ExtensionGalleryService.prototype.loadDependencies = function (extensionNames, token) {
            var _a;
            if (!extensionNames || extensionNames.length === 0) {
                return winjs_base_1.TPromise.as([]);
            }
            var query = (_a = new Query()
                .withFlags(Flags.IncludeLatestVersionOnly, Flags.IncludeAssetUri, Flags.IncludeStatistics, Flags.IncludeFiles, Flags.IncludeVersionProperties)
                .withPage(1, extensionNames.length)
                .withFilter(FilterType.Target, 'Microsoft.VisualStudio.Code')
                .withFilter(FilterType.ExcludeWithFlags, flagsToString(Flags.Unpublished))
                .withAssetTypes(AssetType.Icon, AssetType.License, AssetType.Details, AssetType.Manifest, AssetType.VSIX)).withFilter.apply(_a, [FilterType.ExtensionName].concat(extensionNames));
            return this.queryGallery(query, token).then(function (result) {
                var dependencies = [];
                var ids = [];
                for (var index = 0; index < result.galleryExtensions.length; index++) {
                    var rawExtension = result.galleryExtensions[index];
                    if (ids.indexOf(rawExtension.extensionId) === -1) {
                        dependencies.push(toExtension(rawExtension, rawExtension.versions[0], index, query, 'dependencies'));
                        ids.push(rawExtension.extensionId);
                    }
                }
                return dependencies;
            });
        };
        ExtensionGalleryService.prototype.getDependenciesReccursively = function (toGet, result, token) {
            var _this = this;
            if (!toGet || !toGet.length) {
                return winjs_base_1.TPromise.wrap(result);
            }
            toGet = result.length ? toGet.filter(function (e) { return !ExtensionGalleryService.hasExtensionByName(result, e); }) : toGet;
            if (!toGet.length) {
                return winjs_base_1.TPromise.wrap(result);
            }
            return this.loadDependencies(toGet, token)
                .then(function (loadedDependencies) {
                var dependenciesSet = new Set();
                for (var _i = 0, loadedDependencies_1 = loadedDependencies; _i < loadedDependencies_1.length; _i++) {
                    var dep = loadedDependencies_1[_i];
                    if (dep.properties.dependencies) {
                        dep.properties.dependencies.forEach(function (d) { return dependenciesSet.add(d); });
                    }
                }
                result = arrays_1.distinct(result.concat(loadedDependencies), function (d) { return d.identifier.uuid; });
                var dependencies = [];
                dependenciesSet.forEach(function (d) { return !ExtensionGalleryService.hasExtensionByName(result, d) && dependencies.push(d); });
                return _this.getDependenciesReccursively(dependencies, result, token);
            });
        };
        ExtensionGalleryService.prototype.getAsset = function (asset, options, token) {
            var _this = this;
            if (options === void 0) { options = {}; }
            if (token === void 0) { token = cancellation_1.CancellationToken.None; }
            return this.commonHeadersPromise.then(function (commonHeaders) {
                var baseOptions = { type: 'GET' };
                var headers = objects_1.assign({}, commonHeaders, options.headers || {});
                options = objects_1.assign({}, options, baseOptions, { headers: headers });
                var url = asset.uri;
                var fallbackUrl = asset.fallbackUri;
                var firstOptions = objects_1.assign({}, options, { url: url });
                return _this.requestService.request(firstOptions, token)
                    .then(function (context) {
                    if (context.res.statusCode === 200) {
                        return winjs_base_1.TPromise.as(context);
                    }
                    return request_2.asText(context)
                        .then(function (message) { return winjs_base_1.TPromise.wrapError(new Error("Expected 200, got back " + context.res.statusCode + " instead.\n\n" + message)); });
                })
                    .then(null, function (err) {
                    if (errors_1.isPromiseCanceledError(err)) {
                        return winjs_base_1.TPromise.wrapError(err);
                    }
                    var message = errors_1.getErrorMessage(err);
                    /* __GDPR__
                        "galleryService:requestError" : {
                            "url" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                            "cdn": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                            "message": { "classification": "CallstackOrException", "purpose": "FeatureInsight" }
                        }
                    */
                    _this.telemetryService.publicLog('galleryService:requestError', { url: url, cdn: true, message: message });
                    /* __GDPR__
                        "galleryService:cdnFallback" : {
                            "url" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                            "message": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                        }
                    */
                    _this.telemetryService.publicLog('galleryService:cdnFallback', { url: url, message: message });
                    var fallbackOptions = objects_1.assign({}, options, { url: fallbackUrl });
                    return _this.requestService.request(fallbackOptions, token).then(null, function (err) {
                        if (errors_1.isPromiseCanceledError(err)) {
                            return winjs_base_1.TPromise.wrapError(err);
                        }
                        var message = errors_1.getErrorMessage(err);
                        /* __GDPR__
                            "galleryService:requestError" : {
                                "url" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                                "cdn": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                                "message": { "classification": "CallstackOrException", "purpose": "FeatureInsight" }
                            }
                        */
                        _this.telemetryService.publicLog('galleryService:requestError', { url: fallbackUrl, cdn: false, message: message });
                        return winjs_base_1.TPromise.wrapError(err);
                    });
                });
            });
        };
        ExtensionGalleryService.prototype.getLastValidExtensionVersion = function (extension, versions) {
            var version = this.getLastValidExtensionVersionFromProperties(extension, versions);
            if (version) {
                return version;
            }
            return this.getLastValidExtensionVersionReccursively(extension, versions);
        };
        ExtensionGalleryService.prototype.getLastValidExtensionVersionFromProperties = function (extension, versions) {
            for (var _i = 0, versions_1 = versions; _i < versions_1.length; _i++) {
                var version = versions_1[_i];
                var engine = getEngine(version);
                if (!engine) {
                    return null;
                }
                if (extensionValidator_1.isEngineValid(engine)) {
                    return winjs_base_1.TPromise.wrap(version);
                }
            }
            return null;
        };
        ExtensionGalleryService.prototype.getLastValidExtensionVersionReccursively = function (extension, versions) {
            var _this = this;
            if (!versions.length) {
                return null;
            }
            var version = versions[0];
            var asset = getVersionAsset(version, AssetType.Manifest);
            var headers = { 'Accept-Encoding': 'gzip' };
            return this.getAsset(asset, { headers: headers })
                .then(function (context) { return request_2.asJson(context); })
                .then(function (manifest) {
                var engine = manifest.engines.vscode;
                if (!extensionValidator_1.isEngineValid(engine)) {
                    return _this.getLastValidExtensionVersionReccursively(extension, versions.slice(1));
                }
                version.properties = version.properties || [];
                version.properties.push({ key: PropertyType.Engine, value: manifest.engines.vscode });
                return version;
            });
        };
        ExtensionGalleryService.hasExtensionByName = function (extensions, name) {
            for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
                var extension = extensions_1[_i];
                if (extension.publisher + "." + extension.name === name) {
                    return true;
                }
            }
            return false;
        };
        ExtensionGalleryService.prototype.getExtensionsReport = function () {
            if (!this.isEnabled()) {
                return winjs_base_1.TPromise.wrapError(new Error('No extension gallery service configured.'));
            }
            if (!this.extensionsControlUrl) {
                return winjs_base_1.TPromise.as([]);
            }
            return this.requestService.request({ type: 'GET', url: this.extensionsControlUrl }, cancellation_1.CancellationToken.None).then(function (context) {
                if (context.res.statusCode !== 200) {
                    return winjs_base_1.TPromise.wrapError(new Error('Could not get extensions report.'));
                }
                return request_2.asJson(context).then(function (result) {
                    var map = new Map();
                    for (var _i = 0, _a = result.malicious; _i < _a.length; _i++) {
                        var id = _a[_i];
                        var ext = map.get(id) || { id: { id: id }, malicious: true, slow: false };
                        ext.malicious = true;
                        map.set(id, ext);
                    }
                    return winjs_base_1.TPromise.as(map_1.values(map));
                });
            });
        };
        ExtensionGalleryService = __decorate([
            __param(0, request_1.IRequestService),
            __param(1, environment_1.IEnvironmentService),
            __param(2, telemetry_1.ITelemetryService)
        ], ExtensionGalleryService);
        return ExtensionGalleryService;
    }());
    exports.ExtensionGalleryService = ExtensionGalleryService;
    function resolveMarketplaceHeaders(environmentService) {
        var marketplaceMachineIdFile = path.join(environmentService.userDataPath, 'machineid');
        return pfs_1.readFile(marketplaceMachineIdFile, 'utf8').then(function (contents) {
            if (uuid_1.isUUID(contents)) {
                return contents;
            }
            return winjs_base_1.TPromise.wrap(null); // invalid marketplace UUID
        }, function (error) {
            return winjs_base_1.TPromise.wrap(null); // error reading ID file
        }).then(function (uuid) {
            if (!uuid) {
                uuid = uuid_1.generateUuid();
                try {
                    extfs_1.writeFileAndFlushSync(marketplaceMachineIdFile, uuid);
                }
                catch (error) {
                    //noop
                }
            }
            return {
                'X-Market-Client-Id': "VSCode " + package_1.default.version,
                'User-Agent': "VSCode " + package_1.default.version,
                'X-Market-User-Id': uuid
            };
        });
    }
    exports.resolveMarketplaceHeaders = resolveMarketplaceHeaders;
});










define(__m[49/*vs/platform/request/node/requestService*/], __M([1/*require*/,0/*exports*/,2/*vs/base/common/winjs.base*/,7/*vs/base/common/objects*/,35/*vs/base/node/request*/,69/*vs/base/node/proxy*/,13/*vs/platform/configuration/common/configuration*/,10/*vs/platform/log/common/log*/]), function (require, exports, winjs_base_1, objects_1, request_1, proxy_1, configuration_1, log_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * This service exposes the `request` API, while using the global
     * or configured proxy settings.
     */
    var RequestService = /** @class */ (function () {
        function RequestService(configurationService, logService) {
            var _this = this;
            this.logService = logService;
            this.disposables = [];
            this.configure(configurationService.getValue());
            configurationService.onDidChangeConfiguration(function () { return _this.configure(configurationService.getValue()); }, this, this.disposables);
        }
        RequestService.prototype.configure = function (config) {
            this.proxyUrl = config.http && config.http.proxy;
            this.strictSSL = config.http && config.http.proxyStrictSSL;
            this.authorization = config.http && config.http.proxyAuthorization;
        };
        RequestService.prototype.request = function (options, token, requestFn) {
            var _this = this;
            if (requestFn === void 0) { requestFn = request_1.request; }
            this.logService.trace('RequestService#request', options.url);
            var _a = this, proxyUrl = _a.proxyUrl, strictSSL = _a.strictSSL;
            var agentPromise = options.agent ? winjs_base_1.TPromise.wrap(options.agent) : winjs_base_1.TPromise.wrap(proxy_1.getProxyAgent(options.url, { proxyUrl: proxyUrl, strictSSL: strictSSL }));
            return agentPromise.then(function (agent) {
                options.agent = agent;
                options.strictSSL = strictSSL;
                if (_this.authorization) {
                    options.headers = objects_1.assign(options.headers || {}, { 'Proxy-Authorization': _this.authorization });
                }
                return requestFn(options, token);
            });
        };
        RequestService = __decorate([
            __param(0, configuration_1.IConfigurationService),
            __param(1, log_1.ILogService)
        ], RequestService);
        return RequestService;
    }());
    exports.RequestService = RequestService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/












































define(__m[101/*vs/code/node/cliProcessMain*/], __M([1/*require*/,0/*exports*/,3/*vs/nls!vs/code/node/cliProcessMain*/,34/*vs/platform/node/product*/,21/*vs/platform/node/package*/,8/*path*/,77/*semver*/,2/*vs/base/common/winjs.base*/,22/*vs/base/common/async*/,33/*vs/platform/instantiation/common/serviceCollection*/,42/*vs/platform/instantiation/common/descriptors*/,63/*vs/platform/instantiation/common/instantiationService*/,19/*vs/platform/environment/common/environment*/,70/*vs/platform/environment/node/environmentService*/,37/*vs/platform/extensionManagement/common/extensionManagement*/,88/*vs/platform/extensionManagement/node/extensionManagementService*/,66/*vs/platform/extensionManagement/node/extensionGalleryService*/,28/*vs/platform/telemetry/common/telemetry*/,86/*vs/platform/telemetry/common/telemetryUtils*/,85/*vs/platform/telemetry/common/telemetryService*/,89/*vs/platform/telemetry/node/commonProperties*/,38/*vs/platform/request/node/request*/,49/*vs/platform/request/node/requestService*/,13/*vs/platform/configuration/common/configuration*/,80/*vs/platform/configuration/node/configurationService*/,87/*vs/platform/telemetry/node/appInsightsAppender*/,16/*vs/base/node/pfs*/,78/*vs/base/common/labels*/,82/*vs/platform/state/common/state*/,83/*vs/platform/state/node/stateService*/,67/*vs/platform/log/node/spdlogService*/,10/*vs/platform/log/common/log*/,15/*vs/base/common/errors*/,41/*vs/platform/dialogs/common/dialogs*/,48/*vs/platform/dialogs/node/dialogService*/,29/*vs/platform/extensionManagement/common/extensionManagementUtil*/,25/*vs/base/common/severity*/,23/*vs/base/common/uri*/]), function (require, exports, nls_1, product_1, package_1, path, semver, winjs_base_1, async_1, serviceCollection_1, descriptors_1, instantiationService_1, environment_1, environmentService_1, extensionManagement_1, extensionManagementService_1, extensionGalleryService_1, telemetry_1, telemetryUtils_1, telemetryService_1, commonProperties_1, request_1, requestService_1, configuration_1, configurationService_1, appInsightsAppender_1, pfs_1, labels_1, state_1, stateService_1, spdlogService_1, log_1, errors_1, dialogs_1, dialogService_1, extensionManagementUtil_1, severity_1, uri_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var notFound = function (id) { return nls_1.localize(0, null, id); };
    var notInstalled = function (id) { return nls_1.localize(1, null, id); };
    var useId = nls_1.localize(2, null, 'ms-vscode.csharp');
    function getId(manifest, withVersion) {
        if (withVersion) {
            return manifest.publisher + "." + manifest.name + "@" + manifest.version;
        }
        else {
            return manifest.publisher + "." + manifest.name;
        }
    }
    var Main = /** @class */ (function () {
        function Main(environmentService, extensionManagementService, extensionGalleryService, dialogService) {
            this.environmentService = environmentService;
            this.extensionManagementService = extensionManagementService;
            this.extensionGalleryService = extensionGalleryService;
            this.dialogService = dialogService;
        }
        Main.prototype.run = function (argv) {
            // TODO@joao - make this contributable
            var returnPromise;
            if (argv['install-source']) {
                returnPromise = this.setInstallSource(argv['install-source']);
            }
            else if (argv['list-extensions']) {
                returnPromise = this.listExtensions(argv['show-versions']);
            }
            else if (argv['install-extension']) {
                var arg = argv['install-extension'];
                var args = typeof arg === 'string' ? [arg] : arg;
                returnPromise = this.installExtension(args);
            }
            else if (argv['uninstall-extension']) {
                var arg = argv['uninstall-extension'];
                var ids = typeof arg === 'string' ? [arg] : arg;
                returnPromise = this.uninstallExtension(ids);
            }
            return returnPromise || winjs_base_1.TPromise.as(null);
        };
        Main.prototype.setInstallSource = function (installSource) {
            return pfs_1.writeFile(this.environmentService.installSourcePath, installSource.slice(0, 30));
        };
        Main.prototype.listExtensions = function (showVersions) {
            return this.extensionManagementService.getInstalled(1 /* User */).then(function (extensions) {
                extensions.forEach(function (e) { return console.log(getId(e.manifest, showVersions)); });
            });
        };
        Main.prototype.installExtension = function (extensions) {
            var _this = this;
            var vsixTasks = extensions
                .filter(function (e) { return /\.vsix$/i.test(e); })
                .map(function (id) { return function () {
                var extension = path.isAbsolute(id) ? id : path.join(process.cwd(), id);
                return _this.extensionManagementService.install(uri_1.URI.file(extension)).then(function () {
                    console.log(nls_1.localize(3, null, labels_1.getBaseLabel(extension)));
                }, function (error) {
                    if (errors_1.isPromiseCanceledError(error)) {
                        console.log(nls_1.localize(4, null, labels_1.getBaseLabel(extension)));
                        return null;
                    }
                    else {
                        return winjs_base_1.TPromise.wrapError(error);
                    }
                });
            }; });
            var galleryTasks = extensions
                .filter(function (e) { return !/\.vsix$/i.test(e); })
                .map(function (id) { return function () {
                return _this.extensionManagementService.getInstalled(1 /* User */)
                    .then(function (installed) { return _this.extensionGalleryService.query({ names: [id], source: 'cli' })
                    .then(null, function (err) {
                    if (err.responseText) {
                        try {
                            var response = JSON.parse(err.responseText);
                            return winjs_base_1.TPromise.wrapError(response.message);
                        }
                        catch (e) {
                            // noop
                        }
                    }
                    return winjs_base_1.TPromise.wrapError(err);
                })
                    .then(function (result) {
                    var extension = result.firstPage[0];
                    if (!extension) {
                        return winjs_base_1.TPromise.wrapError(new Error(notFound(id) + "\n" + useId));
                    }
                    var installedExtension = installed.filter(function (e) { return extensionManagementUtil_1.areSameExtensions({ id: extensionManagementUtil_1.getGalleryExtensionIdFromLocal(e) }, { id: id }); })[0];
                    if (installedExtension) {
                        var outdated = semver.gt(extension.version, installedExtension.manifest.version);
                        if (outdated) {
                            var updateMessage = nls_1.localize(5, null, id, installedExtension.manifest.version, extension.version);
                            return _this.dialogService.show(severity_1.default.Info, updateMessage, [nls_1.localize(6, null), nls_1.localize(7, null)])
                                .then(function (option) {
                                if (option === 0) {
                                    return _this.installFromGallery(id, extension);
                                }
                                console.log(nls_1.localize(8, null, id));
                                return winjs_base_1.TPromise.as(null);
                            });
                        }
                        else {
                            console.log(nls_1.localize(9, null, id));
                            return winjs_base_1.TPromise.as(null);
                        }
                    }
                    else {
                        console.log(nls_1.localize(10, null, id));
                        return _this.installFromGallery(id, extension);
                    }
                }); });
            }; });
            return async_1.sequence(vsixTasks.concat(galleryTasks));
        };
        Main.prototype.installFromGallery = function (id, extension) {
            console.log(nls_1.localize(11, null));
            return this.extensionManagementService.installFromGallery(extension)
                .then(function () { return console.log(nls_1.localize(12, null, id, extension.version)); }, function (error) {
                if (errors_1.isPromiseCanceledError(error)) {
                    console.log(nls_1.localize(13, null, id));
                    return null;
                }
                else {
                    return winjs_base_1.TPromise.wrapError(error);
                }
            });
        };
        Main.prototype.uninstallExtension = function (extensions) {
            var _this = this;
            function getExtensionId(extensionDescription) {
                return __awaiter(this, void 0, void 0, function () {
                    var zipPath, manifest;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!/\.vsix$/i.test(extensionDescription)) {
                                    return [2 /*return*/, extensionDescription];
                                }
                                zipPath = path.isAbsolute(extensionDescription) ? extensionDescription : path.join(process.cwd(), extensionDescription);
                                return [4 /*yield*/, extensionManagementService_1.validateLocalExtension(zipPath)];
                            case 1:
                                manifest = _a.sent();
                                return [2 /*return*/, getId(manifest)];
                        }
                    });
                });
            }
            return async_1.sequence(extensions.map(function (extension) { return function () {
                return getExtensionId(extension).then(function (id) {
                    return _this.extensionManagementService.getInstalled(1 /* User */).then(function (installed) {
                        var extension = installed.filter(function (e) { return extensionManagementUtil_1.areSameExtensions({ id: extensionManagementUtil_1.getGalleryExtensionIdFromLocal(e) }, { id: id }); })[0];
                        if (!extension) {
                            return winjs_base_1.TPromise.wrapError(new Error(notInstalled(id) + "\n" + useId));
                        }
                        console.log(nls_1.localize(14, null, id));
                        return _this.extensionManagementService.uninstall(extension, true)
                            .then(function () { return console.log(nls_1.localize(15, null, id)); });
                    });
                });
            }; }));
        };
        Main = __decorate([
            __param(0, environment_1.IEnvironmentService),
            __param(1, extensionManagement_1.IExtensionManagementService),
            __param(2, extensionManagement_1.IExtensionGalleryService),
            __param(3, dialogs_1.IDialogService)
        ], Main);
        return Main;
    }());
    var eventPrefix = 'monacoworkbench';
    function main(argv) {
        var services = new serviceCollection_1.ServiceCollection();
        var environmentService = new environmentService_1.EnvironmentService(argv, process.execPath);
        var logService = spdlogService_1.createSpdLogService('cli', log_1.getLogLevel(environmentService), environmentService.logsPath);
        process.once('exit', function () { return logService.dispose(); });
        logService.info('main', argv);
        services.set(environment_1.IEnvironmentService, environmentService);
        services.set(log_1.ILogService, logService);
        services.set(state_1.IStateService, new descriptors_1.SyncDescriptor(stateService_1.StateService));
        var instantiationService = new instantiationService_1.InstantiationService(services);
        return instantiationService.invokeFunction(function (accessor) {
            var envService = accessor.get(environment_1.IEnvironmentService);
            var stateService = accessor.get(state_1.IStateService);
            return winjs_base_1.TPromise.join([envService.appSettingsHome, envService.extensionsPath].map(function (p) { return pfs_1.mkdirp(p); })).then(function () {
                var appRoot = envService.appRoot, extensionsPath = envService.extensionsPath, extensionDevelopmentLocationURI = envService.extensionDevelopmentLocationURI, isBuilt = envService.isBuilt, installSourcePath = envService.installSourcePath;
                var services = new serviceCollection_1.ServiceCollection();
                services.set(configuration_1.IConfigurationService, new descriptors_1.SyncDescriptor(configurationService_1.ConfigurationService));
                services.set(request_1.IRequestService, new descriptors_1.SyncDescriptor(requestService_1.RequestService));
                services.set(extensionManagement_1.IExtensionManagementService, new descriptors_1.SyncDescriptor(extensionManagementService_1.ExtensionManagementService));
                services.set(extensionManagement_1.IExtensionGalleryService, new descriptors_1.SyncDescriptor(extensionGalleryService_1.ExtensionGalleryService));
                services.set(dialogs_1.IDialogService, new descriptors_1.SyncDescriptor(dialogService_1.CommandLineDialogService));
                var appenders = [];
                if (isBuilt && !extensionDevelopmentLocationURI && !envService.args['disable-telemetry'] && product_1.default.enableTelemetry) {
                    if (product_1.default.aiConfig && product_1.default.aiConfig.asimovKey) {
                        appenders.push(new appInsightsAppender_1.AppInsightsAppender(eventPrefix, null, product_1.default.aiConfig.asimovKey, logService));
                    }
                    var config = {
                        appender: telemetryUtils_1.combinedAppender.apply(void 0, appenders),
                        commonProperties: commonProperties_1.resolveCommonProperties(product_1.default.commit, package_1.default.version, stateService.getItem('telemetry.machineId'), installSourcePath),
                        piiPaths: [appRoot, extensionsPath]
                    };
                    services.set(telemetry_1.ITelemetryService, new descriptors_1.SyncDescriptor(telemetryService_1.TelemetryService, config));
                }
                else {
                    services.set(telemetry_1.ITelemetryService, telemetryUtils_1.NullTelemetryService);
                }
                var instantiationService2 = instantiationService.createChild(services);
                var main = instantiationService2.createInstance(Main);
                return main.run(argv).then(function () {
                    // Dispose the AI adapter so that remaining data gets flushed.
                    return telemetryUtils_1.combinedAppender.apply(void 0, appenders).dispose();
                });
            });
        });
    }
    exports.main = main;
});

}).call(this);
//# sourceMappingURL=cliProcessMain.js.map
