/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
define("vs/base/common/arrays", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * Returns the last element of an array.
     * @param array The array.
     * @param n Which element from the end (default ist zero).
     */
    function tail(array, n) {
        if (n === void 0) { n = 0; }
        return array[array.length - (1 + n)];
    }
    exports.tail = tail;
    /**
     * Iterates the provided array and allows to remove
     * elements while iterating.
     */
    function forEach(array, callback) {
        for (var i = 0, len = array.length; i < len; i++) {
            callback(array[i], function () {
                array.splice(i, 1);
                i--;
                len--;
            });
        }
    }
    exports.forEach = forEach;
    function equals(one, other, itemEquals) {
        if (one.length !== other.length) {
            return false;
        }
        for (var i = 0, len = one.length; i < len; i++) {
            if (!itemEquals(one[i], other[i])) {
                return false;
            }
        }
        return true;
    }
    exports.equals = equals;
    function binarySearch(array, key, comparator) {
        var low = 0, high = array.length - 1;
        while (low <= high) {
            var mid = ((low + high) / 2) | 0;
            var comp = comparator(array[mid], key);
            if (comp < 0) {
                low = mid + 1;
            }
            else if (comp > 0) {
                high = mid - 1;
            }
            else {
                return mid;
            }
        }
        return -(low + 1);
    }
    exports.binarySearch = binarySearch;
    /**
     * Takes a sorted array and a function p. The array is sorted in such a way that all elements where p(x) is false
     * are located before all elements where p(x) is true.
     * @returns the least x for which p(x) is true or array.length if no element fullfills the given function.
     */
    function findFirst(array, p) {
        var low = 0, high = array.length;
        if (high === 0) {
            return 0; // no children
        }
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (p(array[mid])) {
                high = mid;
            }
            else {
                low = mid + 1;
            }
        }
        return low;
    }
    exports.findFirst = findFirst;
    function merge(arrays, hashFn) {
        var result = new Array();
        if (!hashFn) {
            for (var i = 0, len = arrays.length; i < len; i++) {
                result.push.apply(result, arrays[i]);
            }
        }
        else {
            var map = {};
            for (var i = 0; i < arrays.length; i++) {
                for (var j = 0; j < arrays[i].length; j++) {
                    var element = arrays[i][j], hash = hashFn(element);
                    if (!map.hasOwnProperty(hash)) {
                        map[hash] = true;
                        result.push(element);
                    }
                }
            }
        }
        return result;
    }
    exports.merge = merge;
    /**
     * @returns a new array with all undefined or null values removed. The original array is not modified at all.
     */
    function coalesce(array) {
        if (!array) {
            return array;
        }
        return array.filter(function (e) { return !!e; });
    }
    exports.coalesce = coalesce;
    /**
     * @returns true if the given item is contained in the array.
     */
    function contains(array, item) {
        return array.indexOf(item) >= 0;
    }
    exports.contains = contains;
    /**
     * Swaps the elements in the array for the provided positions.
     */
    function swap(array, pos1, pos2) {
        var element1 = array[pos1];
        var element2 = array[pos2];
        array[pos1] = element2;
        array[pos2] = element1;
    }
    exports.swap = swap;
    /**
     * Moves the element in the array for the provided positions.
     */
    function move(array, from, to) {
        array.splice(to, 0, array.splice(from, 1)[0]);
    }
    exports.move = move;
    /**
     * @returns {{false}} if the provided object is an array
     * 	and not empty.
     */
    function isFalsyOrEmpty(obj) {
        return !Array.isArray(obj) || obj.length === 0;
    }
    exports.isFalsyOrEmpty = isFalsyOrEmpty;
    /**
     * Removes duplicates from the given array. The optional keyFn allows to specify
     * how elements are checked for equalness by returning a unique string for each.
     */
    function distinct(array, keyFn) {
        if (!keyFn) {
            return array.filter(function (element, position) {
                return array.indexOf(element) === position;
            });
        }
        var seen = {};
        return array.filter(function (elem) {
            var key = keyFn(elem);
            if (seen[key]) {
                return false;
            }
            seen[key] = true;
            return true;
        });
    }
    exports.distinct = distinct;
    function first(array, fn, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = null; }
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (fn(element)) {
                return element;
            }
        }
        return notFoundValue;
    }
    exports.first = first;
    function commonPrefixLength(one, other, equals) {
        if (equals === void 0) { equals = function (a, b) { return a === b; }; }
        var result = 0;
        for (var i = 0, len = Math.min(one.length, other.length); i < len && equals(one[i], other[i]); i++) {
            result++;
        }
        return result;
    }
    exports.commonPrefixLength = commonPrefixLength;
    function flatten(arr) {
        return arr.reduce(function (r, v) { return r.concat(v); }, []);
    }
    exports.flatten = flatten;
});

define("vs/base/common/lifecycle", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.empty = Object.freeze({
        dispose: function () { }
    });
    function dispose(disposable) {
        if (disposable) {
            disposable.dispose();
        }
        return null;
    }
    exports.dispose = dispose;
    function disposeAll(arr) {
        if (arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i]) {
                    arr[i].dispose();
                }
            }
        }
        return [];
    }
    exports.disposeAll = disposeAll;
    function combinedDispose() {
        var disposables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            disposables[_i - 0] = arguments[_i];
        }
        return {
            dispose: function () { return disposeAll(disposables); }
        };
    }
    exports.combinedDispose = combinedDispose;
    function combinedDispose2(disposables) {
        return {
            dispose: function () { return disposeAll(disposables); }
        };
    }
    exports.combinedDispose2 = combinedDispose2;
    function fnToDisposable(fn) {
        return {
            dispose: function () { return fn(); }
        };
    }
    exports.fnToDisposable = fnToDisposable;
    function toDisposable() {
        var fns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fns[_i - 0] = arguments[_i];
        }
        return combinedDispose2(fns.map(fnToDisposable));
    }
    exports.toDisposable = toDisposable;
    function callAll(arg) {
        if (!arg) {
            return null;
        }
        else if (typeof arg === 'function') {
            arg();
            return null;
        }
        else if (Array.isArray(arg)) {
            while (arg.length > 0) {
                arg.pop()();
            }
            return arg;
        }
        else {
            return null;
        }
    }
    /**
     * Calls all functions that are being passed to it.
     */
    exports.cAll = callAll;
    var Disposable = (function () {
        function Disposable() {
            this._toDispose = [];
        }
        Disposable.prototype.dispose = function () {
            this._toDispose = disposeAll(this._toDispose);
        };
        Disposable.prototype._register = function (t) {
            this._toDispose.push(t);
            return t;
        };
        return Disposable;
    }());
    exports.Disposable = Disposable;
});

define("vs/base/common/platform", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // --- THIS FILE IS TEMPORARY UNTIL ENV.TS IS CLEANED UP. IT CAN SAFELY BE USED IN ALL TARGET EXECUTION ENVIRONMENTS (node & dom) ---
    var _isWindows = false;
    var _isMacintosh = false;
    var _isLinux = false;
    var _isNative = false;
    var _isWeb = false;
    var _isQunit = false;
    var _locale = undefined;
    var _language = undefined;
    // OS detection
    if (typeof process === 'object') {
        _isWindows = (process.platform === 'win32');
        _isMacintosh = (process.platform === 'darwin');
        _isLinux = (process.platform === 'linux');
        var vscode_nls_config = process.env['VSCODE_NLS_CONFIG'];
        if (vscode_nls_config) {
            try {
                var nlsConfig = JSON.parse(vscode_nls_config);
                var resolved = nlsConfig.availableLanguages['*'];
                _locale = nlsConfig.locale;
                // VSCode's default language is 'en'
                _language = resolved ? resolved : 'en';
            }
            catch (e) {
            }
        }
        _isNative = true;
    }
    else if (typeof navigator === 'object') {
        var userAgent = navigator.userAgent;
        _isWindows = userAgent.indexOf('Windows') >= 0;
        _isMacintosh = userAgent.indexOf('Macintosh') >= 0;
        _isLinux = userAgent.indexOf('Linux') >= 0;
        _isWeb = true;
        _locale = navigator.language;
        _language = _locale;
        _isQunit = !!self.QUnit;
    }
    (function (Platform) {
        Platform[Platform["Web"] = 0] = "Web";
        Platform[Platform["Mac"] = 1] = "Mac";
        Platform[Platform["Linux"] = 2] = "Linux";
        Platform[Platform["Windows"] = 3] = "Windows";
    })(exports.Platform || (exports.Platform = {}));
    var Platform = exports.Platform;
    exports._platform = Platform.Web;
    if (_isNative) {
        if (_isMacintosh) {
            exports._platform = Platform.Mac;
        }
        else if (_isWindows) {
            exports._platform = Platform.Windows;
        }
        else if (_isLinux) {
            exports._platform = Platform.Linux;
        }
    }
    exports.isWindows = _isWindows;
    exports.isMacintosh = _isMacintosh;
    exports.isLinux = _isLinux;
    exports.isNative = _isNative;
    exports.isWeb = _isWeb;
    exports.isQunit = _isQunit;
    exports.platform = exports._platform;
    /**
     * The language used for the user interface. The format of
     * the string is all lower case (e.g. zh-tw for Traditional
     * Chinese)
     */
    exports.language = _language;
    /**
     * The OS locale or the locale specified by --locale. The format of
     * the string is all lower case (e.g. zh-tw for Traditional
     * Chinese)
     */
    exports.locale = _locale;
    var _globals = (typeof self === 'object' ? self : global);
    exports.globals = _globals;
    function hasWebWorkerSupport() {
        return typeof _globals.Worker !== 'undefined';
    }
    exports.hasWebWorkerSupport = hasWebWorkerSupport;
    exports.setTimeout = _globals.setTimeout.bind(_globals);
    exports.clearTimeout = _globals.clearTimeout.bind(_globals);
    exports.setInterval = _globals.setInterval.bind(_globals);
    exports.clearInterval = _globals.clearInterval.bind(_globals);
});

define("vs/base/common/strings", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * The empty string.
     */
    exports.empty = '';
    /**
     * @returns the provided number with the given number of preceding zeros.
     */
    function pad(n, l, char) {
        if (char === void 0) { char = '0'; }
        var str = '' + n;
        var r = [str];
        for (var i = str.length; i < l; i++) {
            r.push(char);
        }
        return r.reverse().join('');
    }
    exports.pad = pad;
    var _formatRegexp = /{(\d+)}/g;
    /**
     * Helper to produce a string with a variable number of arguments. Insert variable segments
     * into the string using the {n} notation where N is the index of the argument following the string.
     * @param value string to which formatting is applied
     * @param args replacements for {n}-entries
     */
    function format(value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (args.length === 0) {
            return value;
        }
        return value.replace(_formatRegexp, function (match, group) {
            var idx = parseInt(group, 10);
            return isNaN(idx) || idx < 0 || idx >= args.length ?
                match :
                args[idx];
        });
    }
    exports.format = format;
    /**
     * Converts HTML characters inside the string to use entities instead. Makes the string safe from
     * being used e.g. in HTMLElement.innerHTML.
     */
    function escape(html) {
        return html.replace(/[<|>|&]/g, function (match) {
            switch (match) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                default: return match;
            }
        });
    }
    exports.escape = escape;
    /**
     * Escapes regular expression characters in a given string
     */
    function escapeRegExpCharacters(value) {
        return value.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&');
    }
    exports.escapeRegExpCharacters = escapeRegExpCharacters;
    /**
     * Removes all occurrences of needle from the beginning and end of haystack.
     * @param haystack string to trim
     * @param needle the thing to trim (default is a blank)
     */
    function trim(haystack, needle) {
        if (needle === void 0) { needle = ' '; }
        var trimmed = ltrim(haystack, needle);
        return rtrim(trimmed, needle);
    }
    exports.trim = trim;
    /**
     * Removes all occurrences of needle from the beginning of haystack.
     * @param haystack string to trim
     * @param needle the thing to trim
     */
    function ltrim(haystack, needle) {
        if (!haystack || !needle) {
            return haystack;
        }
        var needleLen = needle.length;
        if (needleLen === 0 || haystack.length === 0) {
            return haystack;
        }
        var offset = 0, idx = -1;
        while ((idx = haystack.indexOf(needle, offset)) === offset) {
            offset = offset + needleLen;
        }
        return haystack.substring(offset);
    }
    exports.ltrim = ltrim;
    /**
     * Removes all occurrences of needle from the end of haystack.
     * @param haystack string to trim
     * @param needle the thing to trim
     */
    function rtrim(haystack, needle) {
        if (!haystack || !needle) {
            return haystack;
        }
        var needleLen = needle.length, haystackLen = haystack.length;
        if (needleLen === 0 || haystackLen === 0) {
            return haystack;
        }
        var offset = haystackLen, idx = -1;
        while (true) {
            idx = haystack.lastIndexOf(needle, offset - 1);
            if (idx === -1 || idx + needleLen !== offset) {
                break;
            }
            if (idx === 0) {
                return '';
            }
            offset = idx;
        }
        return haystack.substring(0, offset);
    }
    exports.rtrim = rtrim;
    function convertSimple2RegExpPattern(pattern) {
        return pattern.replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&').replace(/[\*]/g, '.*');
    }
    exports.convertSimple2RegExpPattern = convertSimple2RegExpPattern;
    function stripWildcards(pattern) {
        return pattern.replace(/\*/g, '');
    }
    exports.stripWildcards = stripWildcards;
    /**
     * Determines if haystack starts with needle.
     */
    function startsWith(haystack, needle) {
        if (haystack.length < needle.length) {
            return false;
        }
        for (var i = 0; i < needle.length; i++) {
            if (haystack[i] !== needle[i]) {
                return false;
            }
        }
        return true;
    }
    exports.startsWith = startsWith;
    /**
     * Determines if haystack ends with needle.
     */
    function endsWith(haystack, needle) {
        var diff = haystack.length - needle.length;
        if (diff > 0) {
            return haystack.lastIndexOf(needle) === haystack.length - needle.length;
        }
        else if (diff === 0) {
            return haystack === needle;
        }
        else {
            return false;
        }
    }
    exports.endsWith = endsWith;
    function createRegExp(searchString, isRegex, matchCase, wholeWord, global) {
        if (searchString === '') {
            throw new Error('Cannot create regex from empty string');
        }
        if (!isRegex) {
            searchString = searchString.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&');
        }
        if (wholeWord) {
            if (!/\B/.test(searchString.charAt(0))) {
                searchString = '\\b' + searchString;
            }
            if (!/\B/.test(searchString.charAt(searchString.length - 1))) {
                searchString = searchString + '\\b';
            }
        }
        var modifiers = '';
        if (global) {
            modifiers += 'g';
        }
        if (!matchCase) {
            modifiers += 'i';
        }
        return new RegExp(searchString, modifiers);
    }
    exports.createRegExp = createRegExp;
    /**
     * Create a regular expression only if it is valid and it doesn't lead to endless loop.
     */
    function createSafeRegExp(searchString, isRegex, matchCase, wholeWord) {
        if (searchString === '') {
            return null;
        }
        // Try to create a RegExp out of the params
        var regex = null;
        try {
            regex = createRegExp(searchString, isRegex, matchCase, wholeWord, true);
        }
        catch (err) {
            return null;
        }
        // Guard against endless loop RegExps & wrap around try-catch as very long regexes produce an exception when executed the first time
        try {
            if (regExpLeadsToEndlessLoop(regex)) {
                return null;
            }
        }
        catch (err) {
            return null;
        }
        return regex;
    }
    exports.createSafeRegExp = createSafeRegExp;
    function regExpLeadsToEndlessLoop(regexp) {
        // Exit early if it's one of these special cases which are meant to match
        // against an empty string
        if (regexp.source === '^' || regexp.source === '^$' || regexp.source === '$') {
            return false;
        }
        // We check against an empty string. If the regular expression doesn't advance
        // (e.g. ends in an endless loop) it will match an empty string.
        var match = regexp.exec('');
        return (match && regexp.lastIndex === 0);
    }
    exports.regExpLeadsToEndlessLoop = regExpLeadsToEndlessLoop;
    /**
     * The normalize() method returns the Unicode Normalization Form of a given string. The form will be
     * the Normalization Form Canonical Composition.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize}
     */
    exports.canNormalize = typeof (''.normalize) === 'function';
    var nonAsciiCharactersPattern = /[^\u0000-\u0080]/;
    var normalizedCache = Object.create(null);
    var cacheCounter = 0;
    function normalizeNFC(str) {
        if (!exports.canNormalize || !str) {
            return str;
        }
        var cached = normalizedCache[str];
        if (cached) {
            return cached;
        }
        var res;
        if (nonAsciiCharactersPattern.test(str)) {
            res = str.normalize('NFC');
        }
        else {
            res = str;
        }
        // Use the cache for fast lookup but do not let it grow unbounded
        if (cacheCounter < 10000) {
            normalizedCache[str] = res;
            cacheCounter++;
        }
        return res;
    }
    exports.normalizeNFC = normalizeNFC;
    /**
     * Returns first index of the string that is not whitespace.
     * If string is empty or contains only whitespaces, returns -1
     */
    function firstNonWhitespaceIndex(str) {
        for (var i = 0, len = str.length; i < len; i++) {
            if (str.charAt(i) !== ' ' && str.charAt(i) !== '\t') {
                return i;
            }
        }
        return -1;
    }
    exports.firstNonWhitespaceIndex = firstNonWhitespaceIndex;
    /**
     * Returns the leading whitespace of the string.
     * If the string contains only whitespaces, returns entire string
     */
    function getLeadingWhitespace(str) {
        for (var i = 0, len = str.length; i < len; i++) {
            if (str.charAt(i) !== ' ' && str.charAt(i) !== '\t') {
                return str.substring(0, i);
            }
        }
        return str;
    }
    exports.getLeadingWhitespace = getLeadingWhitespace;
    /**
     * Returns last index of the string that is not whitespace.
     * If string is empty or contains only whitespaces, returns -1
     */
    function lastNonWhitespaceIndex(str) {
        for (var i = str.length - 1; i >= 0; i--) {
            if (str.charAt(i) !== ' ' && str.charAt(i) !== '\t') {
                return i;
            }
        }
        return -1;
    }
    exports.lastNonWhitespaceIndex = lastNonWhitespaceIndex;
    function localeCompare(strA, strB) {
        return strA.localeCompare(strB);
    }
    exports.localeCompare = localeCompare;
    function isAsciiChar(code) {
        return (code >= 97 && code <= 122) || (code >= 65 && code <= 90);
    }
    function equalsIgnoreCase(a, b) {
        var len1 = a.length, len2 = b.length;
        if (len1 !== len2) {
            return false;
        }
        for (var i = 0; i < len1; i++) {
            var codeA = a.charCodeAt(i), codeB = b.charCodeAt(i);
            if (codeA === codeB) {
                continue;
            }
            else if (isAsciiChar(codeA) && isAsciiChar(codeB)) {
                var diff = Math.abs(codeA - codeB);
                if (diff !== 0 && diff !== 32) {
                    return false;
                }
            }
            else {
                if (String.fromCharCode(codeA).toLocaleLowerCase() !== String.fromCharCode(codeB).toLocaleLowerCase()) {
                    return false;
                }
            }
        }
        return true;
    }
    exports.equalsIgnoreCase = equalsIgnoreCase;
    /**
     * @returns the length of the common prefix of the two strings.
     */
    function commonPrefixLength(a, b) {
        var i, len = Math.min(a.length, b.length);
        for (i = 0; i < len; i++) {
            if (a.charCodeAt(i) !== b.charCodeAt(i)) {
                return i;
            }
        }
        return len;
    }
    exports.commonPrefixLength = commonPrefixLength;
    /**
     * @returns the length of the common suffix of the two strings.
     */
    function commonSuffixLength(a, b) {
        var i, len = Math.min(a.length, b.length);
        var aLastIndex = a.length - 1;
        var bLastIndex = b.length - 1;
        for (i = 0; i < len; i++) {
            if (a.charCodeAt(aLastIndex - i) !== b.charCodeAt(bLastIndex - i)) {
                return i;
            }
        }
        return len;
    }
    exports.commonSuffixLength = commonSuffixLength;
    // --- unicode
    // http://en.wikipedia.org/wiki/Surrogate_pair
    // Returns the code point starting at a specified index in a string
    // Code points U+0000 to U+D7FF and U+E000 to U+FFFF are represented on a single character
    // Code points U+10000 to U+10FFFF are represented on two consecutive characters
    //export function getUnicodePoint(str:string, index:number, len:number):number {
    //	let chrCode = str.charCodeAt(index);
    //	if (0xD800 <= chrCode && chrCode <= 0xDBFF && index + 1 < len) {
    //		let nextChrCode = str.charCodeAt(index + 1);
    //		if (0xDC00 <= nextChrCode && nextChrCode <= 0xDFFF) {
    //			return (chrCode - 0xD800) << 10 + (nextChrCode - 0xDC00) + 0x10000;
    //		}
    //	}
    //	return chrCode;
    //}
    //export function isLeadSurrogate(chr:string) {
    //	let chrCode = chr.charCodeAt(0);
    //	return ;
    //}
    //
    //export function isTrailSurrogate(chr:string) {
    //	let chrCode = chr.charCodeAt(0);
    //	return 0xDC00 <= chrCode && chrCode <= 0xDFFF;
    //}
    function isFullWidthCharacter(charCode) {
        // Do a cheap trick to better support wrapping of wide characters, treat them as 2 columns
        // http://jrgraphix.net/research/unicode_blocks.php
        //          2E80 — 2EFF   CJK Radicals Supplement
        //          2F00 — 2FDF   Kangxi Radicals
        //          2FF0 — 2FFF   Ideographic Description Characters
        //          3000 — 303F   CJK Symbols and Punctuation
        //          3040 — 309F   Hiragana
        //          30A0 — 30FF   Katakana
        //          3100 — 312F   Bopomofo
        //          3130 — 318F   Hangul Compatibility Jamo
        //          3190 — 319F   Kanbun
        //          31A0 — 31BF   Bopomofo Extended
        //          31F0 — 31FF   Katakana Phonetic Extensions
        //          3200 — 32FF   Enclosed CJK Letters and Months
        //          3300 — 33FF   CJK Compatibility
        //          3400 — 4DBF   CJK Unified Ideographs Extension A
        //          4DC0 — 4DFF   Yijing Hexagram Symbols
        //          4E00 — 9FFF   CJK Unified Ideographs
        //          A000 — A48F   Yi Syllables
        //          A490 — A4CF   Yi Radicals
        //          AC00 — D7AF   Hangul Syllables
        // [IGNORE] D800 — DB7F   High Surrogates
        // [IGNORE] DB80 — DBFF   High Private Use Surrogates
        // [IGNORE] DC00 — DFFF   Low Surrogates
        // [IGNORE] E000 — F8FF   Private Use Area
        //          F900 — FAFF   CJK Compatibility Ideographs
        // [IGNORE] FB00 — FB4F   Alphabetic Presentation Forms
        // [IGNORE] FB50 — FDFF   Arabic Presentation Forms-A
        // [IGNORE] FE00 — FE0F   Variation Selectors
        // [IGNORE] FE20 — FE2F   Combining Half Marks
        // [IGNORE] FE30 — FE4F   CJK Compatibility Forms
        // [IGNORE] FE50 — FE6F   Small Form Variants
        // [IGNORE] FE70 — FEFF   Arabic Presentation Forms-B
        //          FF00 — FFEF   Halfwidth and Fullwidth Forms
        //               [https://en.wikipedia.org/wiki/Halfwidth_and_fullwidth_forms]
        //               of which FF01 - FF5E fullwidth ASCII of 21 to 7E
        // [IGNORE]    and FF65 - FFDC halfwidth of Katakana and Hangul
        // [IGNORE] FFF0 — FFFF   Specials
        return ((charCode >= 0x2E80 && charCode <= 0xD7AF)
            || (charCode >= 0xF900 && charCode <= 0xFAFF)
            || (charCode >= 0xFF01 && charCode <= 0xFF5E));
    }
    exports.isFullWidthCharacter = isFullWidthCharacter;
    /**
     * Computes the difference score for two strings. More similar strings have a higher score.
     * We use largest common subsequence dynamic programming approach but penalize in the end for length differences.
     * Strings that have a large length difference will get a bad default score 0.
     * Complexity - both time and space O(first.length * second.length)
     * Dynamic programming LCS computation http://en.wikipedia.org/wiki/Longest_common_subsequence_problem
     *
     * @param first a string
     * @param second a string
     */
    function difference(first, second, maxLenDelta) {
        if (maxLenDelta === void 0) { maxLenDelta = 4; }
        var lengthDifference = Math.abs(first.length - second.length);
        // We only compute score if length of the currentWord and length of entry.name are similar.
        if (lengthDifference > maxLenDelta) {
            return 0;
        }
        // Initialize LCS (largest common subsequence) matrix.
        var LCS = [];
        var zeroArray = [];
        var i, j;
        for (i = 0; i < second.length + 1; ++i) {
            zeroArray.push(0);
        }
        for (i = 0; i < first.length + 1; ++i) {
            LCS.push(zeroArray);
        }
        for (i = 1; i < first.length + 1; ++i) {
            for (j = 1; j < second.length + 1; ++j) {
                if (first[i - 1] === second[j - 1]) {
                    LCS[i][j] = LCS[i - 1][j - 1] + 1;
                }
                else {
                    LCS[i][j] = Math.max(LCS[i - 1][j], LCS[i][j - 1]);
                }
            }
        }
        return LCS[first.length][second.length] - Math.sqrt(lengthDifference);
    }
    exports.difference = difference;
    /**
     * Returns an array in which every entry is the offset of a
     * line. There is always one entry which is zero.
     */
    function computeLineStarts(text) {
        var regexp = /\r\n|\r|\n/g, ret = [0], match;
        while ((match = regexp.exec(text))) {
            ret.push(regexp.lastIndex);
        }
        return ret;
    }
    exports.computeLineStarts = computeLineStarts;
    /**
     * Given a string and a max length returns a shorted version. Shorting
     * happens at favorable positions - such as whitespace or punctuation characters.
     */
    function lcut(text, n) {
        if (text.length < n) {
            return text;
        }
        var segments = text.split(/\b/), count = 0;
        for (var i = segments.length - 1; i >= 0; i--) {
            count += segments[i].length;
            if (count > n) {
                segments.splice(0, i);
                break;
            }
        }
        return segments.join(exports.empty).replace(/^\s/, exports.empty);
    }
    exports.lcut = lcut;
    // Escape codes
    // http://en.wikipedia.org/wiki/ANSI_escape_code
    var EL = /\x1B\x5B[12]?K/g; // Erase in line
    var LF = /\xA/g; // line feed
    var COLOR_START = /\x1b\[\d+m/g; // Color
    var COLOR_END = /\x1b\[0?m/g; // Color
    function removeAnsiEscapeCodes(str) {
        if (str) {
            str = str.replace(EL, '');
            str = str.replace(LF, '\n');
            str = str.replace(COLOR_START, '');
            str = str.replace(COLOR_END, '');
        }
        return str;
    }
    exports.removeAnsiEscapeCodes = removeAnsiEscapeCodes;
    // -- UTF-8 BOM
    var __utf8_bom = 65279;
    exports.UTF8_BOM_CHARACTER = String.fromCharCode(__utf8_bom);
    function startsWithUTF8BOM(str) {
        return (str && str.length > 0 && str.charCodeAt(0) === __utf8_bom);
    }
    exports.startsWithUTF8BOM = startsWithUTF8BOM;
});

define("vs/base/common/paths", ["require", "exports", 'vs/base/common/platform', 'vs/base/common/strings'], function (require, exports, platform_1, strings_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * The forward slash path separator.
     */
    exports.sep = '/';
    /**
     * The native path separator depending on the OS.
     */
    exports.nativeSep = platform_1.isWindows ? '\\' : '/';
    function relative(from, to) {
        from = normalize(from);
        to = normalize(to);
        var fromParts = from.split(exports.sep), toParts = to.split(exports.sep);
        while (fromParts.length > 0 && toParts.length > 0) {
            if (fromParts[0] === toParts[0]) {
                fromParts.shift();
                toParts.shift();
            }
            else {
                break;
            }
        }
        for (var i = 0, len = fromParts.length; i < len; i++) {
            toParts.unshift('..');
        }
        return toParts.join(exports.sep);
    }
    exports.relative = relative;
    var _dotSegment = /[\\\/]\.\.?[\\\/]?|[\\\/]?\.\.?[\\\/]/;
    function normalize(path, toOSPath) {
        if (!path) {
            return path;
        }
        // a path is already normal if it contains no .. or . parts
        // and already uses the proper path separator
        if (!_dotSegment.test(path)) {
            // badSep is the path separator we don't want. Usually
            // the backslash, unless isWindows && toOSPath
            var badSep = toOSPath && platform_1.isWindows ? '/' : '\\';
            if (path.indexOf(badSep) === -1) {
                return path;
            }
        }
        var parts = path.split(/[\\\/]/);
        for (var i = 0, len = parts.length; i < len; i++) {
            if (parts[i] === '.' && !!parts[i + 1]) {
                parts.splice(i, 1);
                i -= 1;
            }
            else if (parts[i] === '..' && !!parts[i - 1]) {
                parts.splice(i - 1, 2);
                i -= 2;
            }
        }
        return parts.join(toOSPath ? exports.nativeSep : exports.sep);
    }
    exports.normalize = normalize;
    function dirnames(path) {
        var value = path, done = false;
        function next() {
            if (value === '.' || value === '/' || value === '\\') {
                value = undefined;
                done = true;
            }
            else {
                value = dirname(value);
            }
            return {
                value: value,
                done: done
            };
        }
        return {
            next: next
        };
    }
    exports.dirnames = dirnames;
    /**
     * @returns the directory name of a path.
     */
    function dirname(path) {
        var idx = ~path.lastIndexOf('/') || ~path.lastIndexOf('\\');
        if (idx === 0) {
            return '.';
        }
        else if (~idx === 0) {
            return path[0];
        }
        else {
            return path.substring(0, ~idx);
        }
    }
    exports.dirname = dirname;
    /**
     * @returns the base name of a path.
     */
    function basename(path) {
        var idx = ~path.lastIndexOf('/') || ~path.lastIndexOf('\\');
        if (idx === 0) {
            return path;
        }
        else if (~idx === path.length - 1) {
            return basename(path.substring(0, path.length - 1));
        }
        else {
            return path.substr(~idx + 1);
        }
    }
    exports.basename = basename;
    /**
     * @returns {{.far}} from boo.far or the empty string.
     */
    function extname(path) {
        path = basename(path);
        var idx = ~path.lastIndexOf('.');
        return idx ? path.substring(~idx) : '';
    }
    exports.extname = extname;
    function getRootLength(path) {
        if (!path) {
            return 0;
        }
        path = path.replace(/\/|\\/g, '/');
        if (path[0] === '/') {
            if (path[1] !== '/') {
                // /far/boo
                return 1;
            }
            else {
                // //server/far/boo
                return 2;
            }
        }
        if (path[1] === ':') {
            if (path[2] === '/') {
                // c:/boo/far.txt
                return 3;
            }
            else {
                // c:
                return 2;
            }
        }
        if (path.indexOf('file:///') === 0) {
            return 8; // 8 -> 'file:///'.length
        }
        var idx = path.indexOf('://');
        if (idx !== -1) {
            return idx + 3; // 3 -> "://".length
        }
        return 0;
    }
    function join() {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i - 0] = arguments[_i];
        }
        var rootLen = getRootLength(parts[0]), root;
        // simply preserve things like c:/, //localhost/, file:///, http://, etc
        root = parts[0].substr(0, rootLen);
        parts[0] = parts[0].substr(rootLen);
        var allParts = [], endsWithSep = /[\\\/]$/.test(parts[parts.length - 1]);
        for (var i = 0; i < parts.length; i++) {
            allParts.push.apply(allParts, parts[i].split(/\/|\\/));
        }
        for (var i = 0; i < allParts.length; i++) {
            var part = allParts[i];
            if (part === '.' || part.length === 0) {
                allParts.splice(i, 1);
                i -= 1;
            }
            else if (part === '..' && !!allParts[i - 1] && allParts[i - 1] !== '..') {
                allParts.splice(i - 1, 2);
                i -= 2;
            }
        }
        if (endsWithSep) {
            allParts.push('');
        }
        var ret = allParts.join('/');
        if (root) {
            ret = root.replace(/\/|\\/g, '/') + ret;
        }
        return ret;
    }
    exports.join = join;
    function isUNC(path) {
        if (!platform_1.isWindows || !path) {
            return false; // UNC is a windows concept
        }
        path = this.normalize(path, true);
        return path[0] === exports.nativeSep && path[1] === exports.nativeSep;
    }
    exports.isUNC = isUNC;
    function isPosixAbsolute(path) {
        return path && path[0] === '/';
    }
    function makeAbsolute(path, isPathNormalized) {
        return isPosixAbsolute(!isPathNormalized ? normalize(path) : path) ? path : exports.sep + path;
    }
    exports.makeAbsolute = makeAbsolute;
    function isRelative(path) {
        return path && path.length > 1 && path[0] === '.';
    }
    exports.isRelative = isRelative;
    var _slash = '/'.charCodeAt(0);
    function isEqualOrParent(path, candidate) {
        if (path === candidate) {
            return true;
        }
        path = normalize(path);
        candidate = normalize(candidate);
        var candidateLen = candidate.length;
        var lastCandidateChar = candidate.charCodeAt(candidateLen - 1);
        if (lastCandidateChar === _slash) {
            candidate = candidate.substring(0, candidateLen - 1);
            candidateLen -= 1;
        }
        if (path === candidate) {
            return true;
        }
        if (!platform_1.isLinux) {
            // case insensitive
            path = path.toLowerCase();
            candidate = candidate.toLowerCase();
        }
        if (path === candidate) {
            return true;
        }
        if (path.indexOf(candidate) !== 0) {
            return false;
        }
        var char = path.charCodeAt(candidateLen);
        return char === _slash;
    }
    exports.isEqualOrParent = isEqualOrParent;
    // Reference: https://en.wikipedia.org/wiki/Filename
    var INVALID_FILE_CHARS = platform_1.isWindows ? /[\\/:\*\?"<>\|]/g : /[\\/]/g;
    var WINDOWS_FORBIDDEN_NAMES = /^(con|prn|aux|clock\$|nul|lpt[0-9]|com[0-9])$/i;
    function isValidBasename(name) {
        if (!name || name.length === 0 || /^\s+$/.test(name)) {
            return false; // require a name that is not just whitespace
        }
        INVALID_FILE_CHARS.lastIndex = 0; // the holy grail of software development
        if (INVALID_FILE_CHARS.test(name)) {
            return false; // check for certain invalid file characters
        }
        if (platform_1.isWindows && WINDOWS_FORBIDDEN_NAMES.test(name)) {
            return false; // check for certain invalid file names
        }
        if (name === '.' || name === '..') {
            return false; // check for reserved values
        }
        if (platform_1.isWindows && strings_1.endsWith(name, '.')) {
            return false; // Windows: file cannot end with a "."
        }
        if (platform_1.isWindows && name.length !== name.trim().length) {
            return false; // Windows: file cannot end with a whitespace
        }
        return true;
    }
    exports.isValidBasename = isValidBasename;
    exports.isAbsoluteRegex = /^((\/|[a-zA-Z]:\\)[^\(\)<>\\'\"\[\]]+)/;
    /**
     * If you have access to node, it is recommended to use node's path.isAbsolute().
     * This is a simple regex based approach.
     */
    function isAbsolute(path) {
        return exports.isAbsoluteRegex.test(path);
    }
    exports.isAbsolute = isAbsolute;
});

define("vs/base/common/types", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * @returns whether the provided parameter is a JavaScript Array or not.
     */
    function isArray(array) {
        if (Array.isArray) {
            return Array.isArray(array);
        }
        if (array && typeof (array.length) === 'number' && array.constructor === Array) {
            return true;
        }
        return false;
    }
    exports.isArray = isArray;
    /**
     * @returns whether the provided parameter is a JavaScript String or not.
     */
    function isString(str) {
        if (typeof (str) === 'string' || str instanceof String) {
            return true;
        }
        return false;
    }
    exports.isString = isString;
    /**
     * @returns whether the provided parameter is a JavaScript Array and each element in the array is a string.
     */
    function isStringArray(value) {
        return isArray(value) && value.every(function (elem) { return isString(elem); });
    }
    exports.isStringArray = isStringArray;
    /**
     * @returns whether the provided parameter is a JavaScript Object or not.
     */
    function isObject(obj) {
        // Needed for IE8
        if (typeof obj === 'undefined' || obj === null) {
            return false;
        }
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    exports.isObject = isObject;
    /**
     * @returns whether the provided parameter is a JavaScript Number or not.
     */
    function isNumber(obj) {
        if ((typeof (obj) === 'number' || obj instanceof Number) && !isNaN(obj)) {
            return true;
        }
        return false;
    }
    exports.isNumber = isNumber;
    /**
     * @returns whether the provided parameter is a JavaScript Boolean or not.
     */
    function isBoolean(obj) {
        return obj === true || obj === false;
    }
    exports.isBoolean = isBoolean;
    /**
     * @returns whether the provided parameter is undefined.
     */
    function isUndefined(obj) {
        return typeof (obj) === 'undefined';
    }
    exports.isUndefined = isUndefined;
    /**
     * @returns whether the provided parameter is undefined or null.
     */
    function isUndefinedOrNull(obj) {
        return isUndefined(obj) || obj === null;
    }
    exports.isUndefinedOrNull = isUndefinedOrNull;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    /**
     * @returns whether the provided parameter is an empty JavaScript Object or not.
     */
    function isEmptyObject(obj) {
        if (!isObject(obj)) {
            return false;
        }
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }
    exports.isEmptyObject = isEmptyObject;
    /**
     * @returns whether the provided parameter is a JavaScript Function or not.
     */
    function isFunction(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    }
    exports.isFunction = isFunction;
    /**
     * @returns whether the provided parameters is are JavaScript Function or not.
     */
    function areFunctions() {
        var objects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objects[_i - 0] = arguments[_i];
        }
        return objects && objects.length > 0 && objects.every(function (object) { return isFunction(object); });
    }
    exports.areFunctions = areFunctions;
    function validateConstraints(args, constraints) {
        var len = Math.min(args.length, constraints.length);
        for (var i = 0; i < len; i++) {
            validateConstraint(args[i], constraints[i]);
        }
    }
    exports.validateConstraints = validateConstraints;
    function validateConstraint(arg, constraint) {
        if (typeof constraint === 'string') {
            if (typeof arg !== constraint) {
                throw new Error("argument does not match constraint: typeof " + constraint);
            }
        }
        else if (typeof constraint === 'function') {
            if (arg instanceof constraint) {
                return;
            }
            if (arg && arg.constructor === constraint) {
                return;
            }
            if (constraint.length === 1 && constraint.call(undefined, arg) === true) {
                return;
            }
            throw new Error("argument does not match one of these constraints: arg instanceof constraint, arg.constructor === constraint, nor constraint(arg) === true");
        }
    }
    exports.validateConstraint = validateConstraint;
    /**
     * Creates a new object of the provided class and will call the constructor with
     * any additional argument supplied.
     */
    function create(ctor) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var obj = Object.create(ctor.prototype);
        ctor.apply(obj, args);
        return obj;
    }
    exports.create = create;
});

define("vs/base/common/objects", ["require", "exports", 'vs/base/common/types'], function (require, exports, Types) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function clone(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        if (obj instanceof RegExp) {
            return obj;
        }
        var result = (Array.isArray(obj)) ? [] : {};
        Object.keys(obj).forEach(function (key) {
            if (obj[key] && typeof obj[key] === 'object') {
                result[key] = clone(obj[key]);
            }
            else {
                result[key] = obj[key];
            }
        });
        return result;
    }
    exports.clone = clone;
    function deepClone(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        var result = (Array.isArray(obj)) ? [] : {};
        Object.getOwnPropertyNames(obj).forEach(function (key) {
            if (obj[key] && typeof obj[key] === 'object') {
                result[key] = deepClone(obj[key]);
            }
            else {
                result[key] = obj[key];
            }
        });
        return result;
    }
    exports.deepClone = deepClone;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function cloneAndChange(obj, changer) {
        return _cloneAndChange(obj, changer, []);
    }
    exports.cloneAndChange = cloneAndChange;
    function _cloneAndChange(obj, changer, encounteredObjects) {
        if (Types.isUndefinedOrNull(obj)) {
            return obj;
        }
        var changed = changer(obj);
        if (typeof changed !== 'undefined') {
            return changed;
        }
        if (Types.isArray(obj)) {
            var r1 = [];
            for (var i1 = 0; i1 < obj.length; i1++) {
                r1.push(_cloneAndChange(obj[i1], changer, encounteredObjects));
            }
            return r1;
        }
        if (Types.isObject(obj)) {
            if (encounteredObjects.indexOf(obj) >= 0) {
                throw new Error('Cannot clone recursive data-structure');
            }
            encounteredObjects.push(obj);
            var r2 = {};
            for (var i2 in obj) {
                if (hasOwnProperty.call(obj, i2)) {
                    r2[i2] = _cloneAndChange(obj[i2], changer, encounteredObjects);
                }
            }
            encounteredObjects.pop();
            return r2;
        }
        return obj;
    }
    // DON'T USE THESE FUNCTION UNLESS YOU KNOW HOW CHROME
    // WORKS... WE HAVE SEEN VERY WEIRD BEHAVIOUR WITH CHROME >= 37
    ///**
    // * Recursively call Object.freeze on object and any properties that are objects.
    // */
    //export function deepFreeze(obj:any):void {
    //	Object.freeze(obj);
    //	Object.keys(obj).forEach((key) => {
    //		if(!(typeof obj[key] === 'object') || Object.isFrozen(obj[key])) {
    //			return;
    //		}
    //
    //		deepFreeze(obj[key]);
    //	});
    //	if(!Object.isFrozen(obj)) {
    //		console.log('too warm');
    //	}
    //}
    //
    //export function deepSeal(obj:any):void {
    //	Object.seal(obj);
    //	Object.keys(obj).forEach((key) => {
    //		if(!(typeof obj[key] === 'object') || Object.isSealed(obj[key])) {
    //			return;
    //		}
    //
    //		deepSeal(obj[key]);
    //	});
    //	if(!Object.isSealed(obj)) {
    //		console.log('NOT sealed');
    //	}
    //}
    /**
     * Copies all properties of source into destination. The optional parameter "overwrite" allows to control
     * if existing properties on the destination should be overwritten or not. Defaults to true (overwrite).
     */
    function mixin(destination, source, overwrite) {
        if (overwrite === void 0) { overwrite = true; }
        if (!Types.isObject(destination)) {
            return source;
        }
        if (Types.isObject(source)) {
            Object.keys(source).forEach(function (key) {
                if (key in destination) {
                    if (overwrite) {
                        if (Types.isObject(destination[key]) && Types.isObject(source[key])) {
                            mixin(destination[key], source[key], overwrite);
                        }
                        else {
                            destination[key] = source[key];
                        }
                    }
                }
                else {
                    destination[key] = source[key];
                }
            });
        }
        return destination;
    }
    exports.mixin = mixin;
    function assign(destination) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        sources.forEach(function (source) { return Object.keys(source).forEach(function (key) { return destination[key] = source[key]; }); });
        return destination;
    }
    exports.assign = assign;
    function toObject(arr, keyMap, valueMap) {
        if (valueMap === void 0) { valueMap = function (x) { return x; }; }
        return arr.reduce(function (o, d) { return assign(o, (_a = {}, _a[keyMap(d)] = valueMap(d), _a)); var _a; }, Object.create(null));
    }
    exports.toObject = toObject;
    /**
     * Returns a new object that has all values of {{obj}}
     * plus those from {{defaults}}.
     */
    function withDefaults(obj, defaults) {
        return mixin(clone(defaults), obj || {});
    }
    exports.withDefaults = withDefaults;
    function equals(one, other) {
        if (one === other) {
            return true;
        }
        if (one === null || one === undefined || other === null || other === undefined) {
            return false;
        }
        if (typeof one !== typeof other) {
            return false;
        }
        if (typeof one !== 'object') {
            return false;
        }
        if ((Array.isArray(one)) !== (Array.isArray(other))) {
            return false;
        }
        var i, key;
        if (Array.isArray(one)) {
            if (one.length !== other.length) {
                return false;
            }
            for (i = 0; i < one.length; i++) {
                if (!equals(one[i], other[i])) {
                    return false;
                }
            }
        }
        else {
            var oneKeys = [];
            for (key in one) {
                oneKeys.push(key);
            }
            oneKeys.sort();
            var otherKeys = [];
            for (key in other) {
                otherKeys.push(key);
            }
            otherKeys.sort();
            if (!equals(oneKeys, otherKeys)) {
                return false;
            }
            for (i = 0; i < oneKeys.length; i++) {
                if (!equals(one[oneKeys[i]], other[oneKeys[i]])) {
                    return false;
                }
            }
        }
        return true;
    }
    exports.equals = equals;
    function ensureProperty(obj, property, defaultValue) {
        if (typeof obj[property] === 'undefined') {
            obj[property] = defaultValue;
        }
    }
    exports.ensureProperty = ensureProperty;
    function arrayToHash(array) {
        var result = {};
        for (var i = 0; i < array.length; ++i) {
            result[array[i]] = true;
        }
        return result;
    }
    exports.arrayToHash = arrayToHash;
    /**
     * Given an array of strings, returns a function which, given a string
     * returns true or false whether the string is in that array.
     */
    function createKeywordMatcher(arr, caseInsensitive) {
        if (caseInsensitive === void 0) { caseInsensitive = false; }
        if (caseInsensitive) {
            arr = arr.map(function (x) { return x.toLowerCase(); });
        }
        var hash = arrayToHash(arr);
        if (caseInsensitive) {
            return function (word) {
                return hash[word.toLowerCase()] !== undefined && hash.hasOwnProperty(word.toLowerCase());
            };
        }
        else {
            return function (word) {
                return hash[word] !== undefined && hash.hasOwnProperty(word);
            };
        }
    }
    exports.createKeywordMatcher = createKeywordMatcher;
    /**
     * Started from TypeScript's __extends function to make a type a subclass of a specific class.
     * Modified to work with properties already defined on the derivedClass, since we can't get TS
     * to call this method before the constructor definition.
     */
    function derive(baseClass, derivedClass) {
        for (var prop in baseClass) {
            if (baseClass.hasOwnProperty(prop)) {
                derivedClass[prop] = baseClass[prop];
            }
        }
        derivedClass = derivedClass || function () { };
        var basePrototype = baseClass.prototype;
        var derivedPrototype = derivedClass.prototype;
        derivedClass.prototype = Object.create(basePrototype);
        for (var prop in derivedPrototype) {
            if (derivedPrototype.hasOwnProperty(prop)) {
                // handle getters and setters properly
                Object.defineProperty(derivedClass.prototype, prop, Object.getOwnPropertyDescriptor(derivedPrototype, prop));
            }
        }
        // Cast to any due to Bug 16188:PropertyDescriptor set and get function should be optional.
        Object.defineProperty(derivedClass.prototype, 'constructor', { value: derivedClass, writable: true, configurable: true, enumerable: true });
    }
    exports.derive = derive;
    /**
     * Calls JSON.Stringify with a replacer to break apart any circular references.
     * This prevents JSON.stringify from throwing the exception
     *  "Uncaught TypeError: Converting circular structure to JSON"
     */
    function safeStringify(obj) {
        var seen = [];
        return JSON.stringify(obj, function (key, value) {
            if (Types.isObject(value) || Array.isArray(value)) {
                if (seen.indexOf(value) !== -1) {
                    return '[Circular]';
                }
                else {
                    seen.push(value);
                }
            }
            return value;
        });
    }
    exports.safeStringify = safeStringify;
});

define("vs/base/common/uri", ["require", "exports", 'vs/base/common/platform'], function (require, exports, platform) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
    function fixedEncodeURIComponent(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, function (c) { return '%' + c.charCodeAt(0).toString(16).toUpperCase(); });
    }
    /**
     * Uniform Resource Identifier (URI) http://tools.ietf.org/html/rfc3986.
     * This class is a simple parser which creates the basic component paths
     * (http://tools.ietf.org/html/rfc3986#section-3) with minimal validation
     * and encoding.
     *
     *       foo://example.com:8042/over/there?name=ferret#nose
     *       \_/   \______________/\_________/ \_________/ \__/
     *        |           |            |            |        |
     *     scheme     authority       path        query   fragment
     *        |   _____________________|__
     *       / \ /                        \
     *       urn:example:animal:ferret:nose
     *
     *
     */
    var URI = (function () {
        function URI() {
            this._scheme = URI._empty;
            this._authority = URI._empty;
            this._path = URI._empty;
            this._query = URI._empty;
            this._fragment = URI._empty;
        }
        Object.defineProperty(URI.prototype, "scheme", {
            /**
             * scheme is the 'http' part of 'http://www.msft.com/some/path?query#fragment'.
             * The part before the first colon.
             */
            get: function () {
                return this._scheme;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "authority", {
            /**
             * authority is the 'www.msft.com' part of 'http://www.msft.com/some/path?query#fragment'.
             * The part between the first double slashes and the next slash.
             */
            get: function () {
                return this._authority;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "path", {
            /**
             * path is the '/some/path' part of 'http://www.msft.com/some/path?query#fragment'.
             */
            get: function () {
                return this._path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "query", {
            /**
             * query is the 'query' part of 'http://www.msft.com/some/path?query#fragment'.
             */
            get: function () {
                return this._query;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "fragment", {
            /**
             * fragment is the 'fragment' part of 'http://www.msft.com/some/path?query#fragment'.
             */
            get: function () {
                return this._fragment;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "fsPath", {
            /**
             * Returns a string representing the corresponding file system path of this URI.
             * Will handle UNC paths and normalize windows drive letters to lower-case. Also
             * uses the platform specific path separator. Will *not* validate the path for
             * invalid characters and semantics. Will *not* look at the scheme of this URI.
             */
            get: function () {
                if (!this._fsPath) {
                    var value;
                    if (this._authority && this.scheme === 'file') {
                        // unc path: file://shares/c$/far/boo
                        value = "//" + this._authority + this._path;
                    }
                    else if (URI._driveLetterPath.test(this._path)) {
                        // windows drive letter: file:///c:/far/boo
                        value = this._path[1].toLowerCase() + this._path.substr(2);
                    }
                    else {
                        // other path
                        value = this._path;
                    }
                    if (platform.isWindows) {
                        value = value.replace(/\//g, '\\');
                    }
                    this._fsPath = value;
                }
                return this._fsPath;
            },
            enumerable: true,
            configurable: true
        });
        // ---- modify to new -------------------------
        URI.prototype.with = function (scheme, authority, path, query, fragment) {
            var ret = new URI();
            ret._scheme = scheme || this.scheme;
            ret._authority = authority || this.authority;
            ret._path = path || this.path;
            ret._query = query || this.query;
            ret._fragment = fragment || this.fragment;
            URI._validate(ret);
            return ret;
        };
        URI.prototype.withScheme = function (value) {
            return this.with(value, undefined, undefined, undefined, undefined);
        };
        URI.prototype.withAuthority = function (value) {
            return this.with(undefined, value, undefined, undefined, undefined);
        };
        URI.prototype.withPath = function (value) {
            return this.with(undefined, undefined, value, undefined, undefined);
        };
        URI.prototype.withQuery = function (value) {
            return this.with(undefined, undefined, undefined, value, undefined);
        };
        URI.prototype.withFragment = function (value) {
            return this.with(undefined, undefined, undefined, undefined, value);
        };
        // ---- parse & validate ------------------------
        URI.parse = function (value) {
            var ret = new URI();
            var data = URI._parseComponents(value);
            ret._scheme = data.scheme;
            ret._authority = decodeURIComponent(data.authority);
            ret._path = decodeURIComponent(data.path);
            ret._query = decodeURIComponent(data.query);
            ret._fragment = decodeURIComponent(data.fragment);
            URI._validate(ret);
            return ret;
        };
        URI.file = function (path) {
            path = path.replace(/\\/g, '/');
            path = path.replace(/%/g, '%25');
            path = path.replace(/#/g, '%23');
            path = path.replace(/\?/g, '%3F');
            // makes sure something like 'C:/Users' isn't
            // parsed as scheme='C', path='Users'
            path = URI._driveLetter.test(path)
                ? '/' + path
                : path;
            var data = URI._parseComponents(path);
            if (data.scheme || data.fragment || data.query) {
                throw new Error('Path contains a scheme, fragment or a query. Can not convert it to a file uri.');
            }
            var ret = new URI();
            ret._scheme = 'file';
            ret._authority = data.authority;
            ret._path = decodeURIComponent(data.path[0] === '/' ? data.path : '/' + data.path); // path starts with slash
            ret._query = data.query;
            ret._fragment = data.fragment;
            URI._validate(ret);
            return ret;
        };
        URI._parseComponents = function (value) {
            var ret = {
                scheme: URI._empty,
                authority: URI._empty,
                path: URI._empty,
                query: URI._empty,
                fragment: URI._empty,
            };
            var match = URI._regexp.exec(value);
            if (match) {
                ret.scheme = match[2] || ret.scheme;
                ret.authority = match[4] || ret.authority;
                ret.path = match[5] || ret.path;
                ret.query = match[7] || ret.query;
                ret.fragment = match[9] || ret.fragment;
            }
            return ret;
        };
        URI.create = function (scheme, authority, path, query, fragment) {
            return new URI().with(scheme, authority, path, query, fragment);
        };
        URI._validate = function (ret) {
            // validation
            // path, http://tools.ietf.org/html/rfc3986#section-3.3
            // If a URI contains an authority component, then the path component
            // must either be empty or begin with a slash ("/") character.  If a URI
            // does not contain an authority component, then the path cannot begin
            // with two slash characters ("//").
            if (ret.authority && ret.path && ret.path[0] !== '/') {
                throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
            }
            if (!ret.authority && ret.path.indexOf('//') === 0) {
                throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
            }
        };
        URI.prototype.toString = function () {
            if (!this._formatted) {
                var parts = [];
                if (this._scheme) {
                    parts.push(this._scheme);
                    parts.push(':');
                }
                if (this._authority || this._scheme === 'file') {
                    parts.push('//');
                }
                if (this._authority) {
                    var authority = this._authority, idx;
                    authority = authority.toLowerCase();
                    idx = authority.indexOf(':');
                    if (idx === -1) {
                        parts.push(fixedEncodeURIComponent(authority));
                    }
                    else {
                        parts.push(fixedEncodeURIComponent(authority.substr(0, idx)));
                        parts.push(authority.substr(idx));
                    }
                }
                if (this._path) {
                    // encode every segment of the path
                    var path = this._path, segments;
                    // lower-case win drive letters in /C:/fff
                    if (URI._driveLetterPath.test(path)) {
                        path = '/' + path[1].toLowerCase() + path.substr(2);
                    }
                    else if (URI._driveLetter.test(path)) {
                        path = path[0].toLowerCase() + path.substr(1);
                    }
                    segments = path.split('/');
                    for (var i = 0, len = segments.length; i < len; i++) {
                        segments[i] = fixedEncodeURIComponent(segments[i]);
                    }
                    parts.push(segments.join('/'));
                }
                if (this._query) {
                    // in http(s) querys often use 'key=value'-pairs and
                    // ampersand characters for multiple pairs
                    var encoder = /https?/i.test(this.scheme)
                        ? encodeURI
                        : fixedEncodeURIComponent;
                    parts.push('?');
                    parts.push(encoder(this._query));
                }
                if (this._fragment) {
                    parts.push('#');
                    parts.push(fixedEncodeURIComponent(this._fragment));
                }
                this._formatted = parts.join('');
            }
            return this._formatted;
        };
        URI.prototype.toJSON = function () {
            return {
                scheme: this.scheme,
                authority: this.authority,
                path: this.path,
                fsPath: this.fsPath,
                query: this.query,
                fragment: this.fragment.replace(/URL_MARSHAL_REMOVE.*$/, ''),
                external: this.toString().replace(/#?URL_MARSHAL_REMOVE.*$/, ''),
                $mid: 1
            };
        };
        URI.revive = function (data) {
            var result = new URI();
            result._scheme = data.scheme;
            result._authority = data.authority;
            result._path = data.path;
            result._query = data.query;
            result._fragment = data.fragment;
            result._fsPath = data.fsPath;
            result._formatted = data.external;
            URI._validate(result);
            return result;
        };
        URI._empty = '';
        URI._regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
        URI._driveLetterPath = /^\/[a-zA-z]:/;
        URI._driveLetter = /^[a-zA-z]:/;
        return URI;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = URI;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/base/common/uuid", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ValueUUID = (function () {
        function ValueUUID(_value) {
            this._value = _value;
            // empty
        }
        ValueUUID.prototype.asHex = function () {
            return this._value;
        };
        ValueUUID.prototype.equals = function (other) {
            return this.asHex() === other.asHex();
        };
        return ValueUUID;
    }());
    var V4UUID = (function (_super) {
        __extends(V4UUID, _super);
        function V4UUID() {
            _super.call(this, [
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                '-',
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                '-',
                '4',
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                '-',
                V4UUID._oneOf(V4UUID._timeHighBits),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                '-',
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
            ].join(''));
        }
        V4UUID._oneOf = function (array) {
            var idx = Math.floor(array.length * Math.random());
            return array[idx];
        };
        V4UUID._randomHex = function () {
            return V4UUID._oneOf(V4UUID._chars);
        };
        V4UUID._chars = ['0', '1', '2', '3', '4', '5', '6', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        V4UUID._timeHighBits = ['8', '9', 'a', 'b'];
        return V4UUID;
    }(ValueUUID));
    /**
     * An empty UUID that contains only zeros.
     */
    exports.empty = new ValueUUID('00000000-0000-0000-0000-000000000000');
    function v4() {
        return new V4UUID();
    }
    exports.v4 = v4;
    var _UUIDPattern = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
    /**
     * Parses a UUID that is of the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.
     * @param value A uuid string.
     */
    function parse(value) {
        if (!_UUIDPattern.test(value)) {
            throw new Error('invalid uuid');
        }
        return new ValueUUID(value);
    }
    exports.parse = parse;
    function generateUuid() {
        return v4().asHex();
    }
    exports.generateUuid = generateUuid;
});

/// <loc filename="Metadata\base_loc_oam.xml" format="messagebundle" />
/*! @minifier_do_not_preserve
  © Microsoft. All rights reserved.

  This library is supported for use in Windows Store apps only.

  Build: 1.0.9200.20602.win8_ldr.130108-1504

  Version: Microsoft.WinJS.1.0
*/

/*
	Note: Copied out of base.js.
	Changes:
		- we have only kept the first 2554 lines.
		- we have patched WinJS.xhr to add the hedader X-Requested-With:XMLHttpRequest
		- we have wrapped the entire code in an if statement to make WinJS re-entrant (if already defined)
		- we have to define setImmediate if not running in IE 10 since its a IE 10 only function
		- we have removed some getter syntax
*/

// MONACO CHANGE: Make WinJS re-entrant (if already defined)
if (typeof WinJS === 'undefined') {

// MONACO CHANGE: define setImmediate
(function (global) {
    if (!global.setImmediate) {
        if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
            // running in node
            global.setImmediate = function(callback) {
                return process.nextTick(callback);
            };
        } else {
            // running in browser
            global.setImmediate = function(callback) {
                return setTimeout(callback, 0);
            };
        }
	}

})(this);

/// <reference path="ms-appx://Microsoft.WinJS.1.0/js/base.js" />
(function baseInit(global, undefined) {
    "use strict";

    function initializeProperties(target, members) {
        var keys = Object.keys(members);
        var properties;
        var i, len;
        for (i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            var enumerable = key.charCodeAt(0) !== /*_*/95;
            var member = members[key];
            if (member && typeof member === 'object') {
                if (member.value !== undefined || typeof member.get === 'function' || typeof member.set === 'function') {
                    if (member.enumerable === undefined) {
                        member.enumerable = enumerable;
                    }
                    properties = properties || {};
                    properties[key] = member;
                    continue;
                }
            }
            if (!enumerable) {
                properties = properties || {};
                properties[key] = { value: member, enumerable: enumerable, configurable: true, writable: true }
                continue;
            }
            target[key] = member;
        }
        if (properties) {
            Object.defineProperties(target, properties);
        }
    }

    (function (rootNamespace) {

        // Create the rootNamespace in the global namespace
        if (!global[rootNamespace]) {
            global[rootNamespace] = Object.create(Object.prototype);
        }

        // Cache the rootNamespace we just created in a local variable
        var _rootNamespace = global[rootNamespace];
        if (!_rootNamespace.Namespace) {
            _rootNamespace.Namespace = Object.create(Object.prototype);
        }

        function defineWithParent(parentNamespace, name, members) {
            /// <signature helpKeyword="WinJS.Namespace.defineWithParent">
            /// <summary locid="WinJS.Namespace.defineWithParent">
            /// Defines a new namespace with the specified name under the specified parent namespace.
            /// </summary>
            /// <param name="parentNamespace" type="Object" locid="WinJS.Namespace.defineWithParent_p:parentNamespace">
            /// The parent namespace.
            /// </param>
            /// <param name="name" type="String" locid="WinJS.Namespace.defineWithParent_p:name">
            /// The name of the new namespace.
            /// </param>
            /// <param name="members" type="Object" locid="WinJS.Namespace.defineWithParent_p:members">
            /// The members of the new namespace.
            /// </param>
            /// <returns type="Object" locid="WinJS.Namespace.defineWithParent_returnValue">
            /// The newly-defined namespace.
            /// </returns>
            /// </signature>
            var currentNamespace = parentNamespace,
                namespaceFragments = name.split(".");

            for (var i = 0, len = namespaceFragments.length; i < len; i++) {
                var namespaceName = namespaceFragments[i];
                if (!currentNamespace[namespaceName]) {
                    Object.defineProperty(currentNamespace, namespaceName,
                        { value: {}, writable: false, enumerable: true, configurable: true }
                    );
                }
                currentNamespace = currentNamespace[namespaceName];
            }

            if (members) {
                initializeProperties(currentNamespace, members);
            }

            return currentNamespace;
        }

        function define(name, members) {
            /// <signature helpKeyword="WinJS.Namespace.define">
            /// <summary locid="WinJS.Namespace.define">
            /// Defines a new namespace with the specified name.
            /// </summary>
            /// <param name="name" type="String" locid="WinJS.Namespace.define_p:name">
            /// The name of the namespace. This could be a dot-separated name for nested namespaces.
            /// </param>
            /// <param name="members" type="Object" locid="WinJS.Namespace.define_p:members">
            /// The members of the new namespace.
            /// </param>
            /// <returns type="Object" locid="WinJS.Namespace.define_returnValue">
            /// The newly-defined namespace.
            /// </returns>
            /// </signature>
            return defineWithParent(global, name, members);
        }

        // Establish members of the "WinJS.Namespace" namespace
        Object.defineProperties(_rootNamespace.Namespace, {

            defineWithParent: { value: defineWithParent, writable: true, enumerable: true, configurable: true },

            define: { value: define, writable: true, enumerable: true, configurable: true }

        });

    })("WinJS");

    (function (WinJS) {

        function define(constructor, instanceMembers, staticMembers) {
            /// <signature helpKeyword="WinJS.Class.define">
            /// <summary locid="WinJS.Class.define">
            /// Defines a class using the given constructor and the specified instance members.
            /// </summary>
            /// <param name="constructor" type="Function" locid="WinJS.Class.define_p:constructor">
            /// A constructor function that is used to instantiate this class.
            /// </param>
            /// <param name="instanceMembers" type="Object" locid="WinJS.Class.define_p:instanceMembers">
            /// The set of instance fields, properties, and methods made available on the class.
            /// </param>
            /// <param name="staticMembers" type="Object" locid="WinJS.Class.define_p:staticMembers">
            /// The set of static fields, properties, and methods made available on the class.
            /// </param>
            /// <returns type="Function" locid="WinJS.Class.define_returnValue">
            /// The newly-defined class.
            /// </returns>
            /// </signature>
            constructor = constructor || function () { };
            WinJS.Utilities.markSupportedForProcessing(constructor);
            if (instanceMembers) {
                initializeProperties(constructor.prototype, instanceMembers);
            }
            if (staticMembers) {
                initializeProperties(constructor, staticMembers);
            }
            return constructor;
        }

        function derive(baseClass, constructor, instanceMembers, staticMembers) {
            /// <signature helpKeyword="WinJS.Class.derive">
            /// <summary locid="WinJS.Class.derive">
            /// Creates a sub-class based on the supplied baseClass parameter, using prototypal inheritance.
            /// </summary>
            /// <param name="baseClass" type="Function" locid="WinJS.Class.derive_p:baseClass">
            /// The class to inherit from.
            /// </param>
            /// <param name="constructor" type="Function" locid="WinJS.Class.derive_p:constructor">
            /// A constructor function that is used to instantiate this class.
            /// </param>
            /// <param name="instanceMembers" type="Object" locid="WinJS.Class.derive_p:instanceMembers">
            /// The set of instance fields, properties, and methods to be made available on the class.
            /// </param>
            /// <param name="staticMembers" type="Object" locid="WinJS.Class.derive_p:staticMembers">
            /// The set of static fields, properties, and methods to be made available on the class.
            /// </param>
            /// <returns type="Function" locid="WinJS.Class.derive_returnValue">
            /// The newly-defined class.
            /// </returns>
            /// </signature>
            if (baseClass) {
                constructor = constructor || function () { };
                var basePrototype = baseClass.prototype;
                constructor.prototype = Object.create(basePrototype);
                WinJS.Utilities.markSupportedForProcessing(constructor);
                Object.defineProperty(constructor.prototype, "constructor", { value: constructor, writable: true, configurable: true, enumerable: true });
                if (instanceMembers) {
                    initializeProperties(constructor.prototype, instanceMembers);
                }
                if (staticMembers) {
                    initializeProperties(constructor, staticMembers);
                }
                return constructor;
            } else {
                return define(constructor, instanceMembers, staticMembers);
            }
        }

        function mix(constructor) {
            /// <signature helpKeyword="WinJS.Class.mix">
            /// <summary locid="WinJS.Class.mix">
            /// Defines a class using the given constructor and the union of the set of instance members
            /// specified by all the mixin objects. The mixin parameter list is of variable length.
            /// </summary>
            /// <param name="constructor" locid="WinJS.Class.mix_p:constructor">
            /// A constructor function that is used to instantiate this class.
            /// </param>
            /// <returns type="Function" locid="WinJS.Class.mix_returnValue">
            /// The newly-defined class.
            /// </returns>
            /// </signature>
            constructor = constructor || function () { };
            var i, len;
            for (i = 1, len = arguments.length; i < len; i++) {
                initializeProperties(constructor.prototype, arguments[i]);
            }
            return constructor;
        }

        // Establish members of "WinJS.Class" namespace
        WinJS.Namespace.define("WinJS.Class", {
            define: define,
            derive: derive,
            mix: mix
        });

    })(global.WinJS);

})(this);


(function baseUtilsInit(global, WinJS) {
    "use strict";

    var hasWinRT = !!global.Windows;

    var strings = {
		// MONACOCHANGE
        //get notSupportedForProcessing() { return WinJS.Resources._getWinJSString("base/notSupportedForProcessing").value; }
		notSupportedForProcessing: "Value is not supported within a declarative processing context, if you want it to be supported mark it using WinJS.Utilities.markSupportedForProcessing. The value was: '{0}'"
    };

    function nop(v) {
        return v;
    }

    function getMemberFiltered(name, root, filter) {
        return name.split(".").reduce(function (currentNamespace, name) {
            if (currentNamespace) {
                return filter(currentNamespace[name]);
            }
            return null;
        }, root);
    }

    // Establish members of "WinJS.Utilities" namespace
    WinJS.Namespace.define("WinJS.Utilities", {
        // Used for mocking in tests
        _setHasWinRT: {
            value: function (value) {
                hasWinRT = value;
            },
            configurable: false,
            writable: false,
            enumerable: false
        },

        /// <field type="Boolean" locid="WinJS.Utilities.hasWinRT" helpKeyword="WinJS.Utilities.hasWinRT">Determine if WinRT is accessible in this script context.</field>
        hasWinRT: {
            get: function () { return hasWinRT; },
            configurable: false,
            enumerable: true
        },

        _getMemberFiltered: getMemberFiltered,

        getMember: function (name, root) {
            /// <signature helpKeyword="WinJS.Utilities.getMember">
            /// <summary locid="WinJS.Utilities.getMember">
            /// Gets the leaf-level type or namespace specified by the name parameter.
            /// </summary>
            /// <param name="name" locid="WinJS.Utilities.getMember_p:name">
            /// The name of the member.
            /// </param>
            /// <param name="root" locid="WinJS.Utilities.getMember_p:root">
            /// The root to start in. Defaults to the global object.
            /// </param>
            /// <returns type="Object" locid="WinJS.Utilities.getMember_returnValue">
            /// The leaf-level type or namespace in the specified parent namespace.
            /// </returns>
            /// </signature>
            if (!name) {
                return null;
            }
            return getMemberFiltered(name, root || global, nop);
        },

        ready: function (callback, async) {
            /// <signature helpKeyword="WinJS.Utilities.ready">
            /// <summary locid="WinJS.Utilities.ready">
            /// Ensures that the specified function executes only after the DOMContentLoaded event has fired
            /// for the current page.
            /// </summary>
            /// <returns type="WinJS.Promise" locid="WinJS.Utilities.ready_returnValue">A promise that completes after DOMContentLoaded has occurred.</returns>
            /// <param name="callback" optional="true" locid="WinJS.Utilities.ready_p:callback">
            /// A function that executes after DOMContentLoaded has occurred.
            /// </param>
            /// <param name="async" optional="true" locid="WinJS.Utilities.ready_p:async">
            /// If true, the callback should be executed asynchronously.
            /// </param>
            /// </signature>
            return new WinJS.Promise(function (c, e) {
                function complete() {
                    if (callback) {
                        try {
                            callback();
                            c();
                        }
                        catch (err) {
                            e(err);
                        }
                    }
                    else {
                        c();
                    }
                }

                var readyState = WinJS.Utilities.testReadyState;
                if (!readyState) {
                    if (global.document) {
                        readyState = document.readyState;
                    }
                    else {
                        readyState = "complete";
                    }
                }
                if (readyState === "complete" || (global.document && document.body !== null)) {
                    if (async) {
                        global.setImmediate(complete);
                    }
                    else {
                        complete();
                    }
                }
                else {
                    global.addEventListener("DOMContentLoaded", complete, false);
                }
            });
        },

        /// <field type="Boolean" locid="WinJS.Utilities.strictProcessing" helpKeyword="WinJS.Utilities.strictProcessing">Determines if strict declarative processing is enabled in this script context.</field>
        strictProcessing: {
            get: function () { return true; },
            configurable: false,
            enumerable: true,
        },

        markSupportedForProcessing: {
            value: function (func) {
                /// <signature helpKeyword="WinJS.Utilities.markSupportedForProcessing">
                /// <summary locid="WinJS.Utilities.markSupportedForProcessing">
                /// Marks a function as being compatible with declarative processing, such as WinJS.UI.processAll
                /// or WinJS.Binding.processAll.
                /// </summary>
                /// <param name="func" type="Function" locid="WinJS.Utilities.markSupportedForProcessing_p:func">
                /// The function to be marked as compatible with declarative processing.
                /// </param>
                /// <returns type="Function" locid="WinJS.Utilities.markSupportedForProcessing_returnValue">
                /// The input function.
                /// </returns>
                /// </signature>
                func.supportedForProcessing = true;
                return func;
            },
            configurable: false,
            writable: false,
            enumerable: true
        },

        requireSupportedForProcessing: {
            value: function (value) {
                /// <signature helpKeyword="WinJS.Utilities.requireSupportedForProcessing">
                /// <summary locid="WinJS.Utilities.requireSupportedForProcessing">
                /// Asserts that the value is compatible with declarative processing, such as WinJS.UI.processAll
                /// or WinJS.Binding.processAll. If it is not compatible an exception will be thrown.
                /// </summary>
                /// <param name="value" type="Object" locid="WinJS.Utilities.requireSupportedForProcessing_p:value">
                /// The value to be tested for compatibility with declarative processing. If the
                /// value is a function it must be marked with a property 'supportedForProcessing'
                /// with a value of true.
                /// </param>
                /// <returns type="Object" locid="WinJS.Utilities.requireSupportedForProcessing_returnValue">
                /// The input value.
                /// </returns>
                /// </signature>
                var supportedForProcessing = true;

                supportedForProcessing = supportedForProcessing && !(value === global);
                supportedForProcessing = supportedForProcessing && !(value === global.location);
                supportedForProcessing = supportedForProcessing && !(value instanceof HTMLIFrameElement);
                supportedForProcessing = supportedForProcessing && !(typeof value === "function" && !value.supportedForProcessing);

                switch (global.frames.length) {
                    case 0:
                        break;

                    case 1:
                        supportedForProcessing = supportedForProcessing && !(value === global.frames[0]);
                        break;

                    default:
                        for (var i = 0, len = global.frames.length; supportedForProcessing && i < len; i++) {
                            supportedForProcessing = supportedForProcessing && !(value === global.frames[i]);
                        }
                        break;
                }

                if (supportedForProcessing) {
                    return value;
                }

                throw new WinJS.ErrorFromName("WinJS.Utilities.requireSupportedForProcessing", WinJS.Resources._formatString(strings.notSupportedForProcessing, value));
            },
            configurable: false,
            writable: false,
            enumerable: true
        },

    });

    WinJS.Namespace.define("WinJS", {
        validation: false,

        strictProcessing: {
            value: function () {
                /// <signature helpKeyword="WinJS.strictProcessing">
                /// <summary locid="WinJS.strictProcessing">
                /// Strict processing is always enforced, this method has no effect.
                /// </summary>
                /// </signature>
            },
            configurable: false,
            writable: false,
            enumerable: false
        },
    });
})(this, this.WinJS);


(function logInit(WinJS) {
    "use strict";

    var spaceR = /\s+/g;
    var typeR = /^(error|warn|info|log)$/;

    function format(message, tag, type) {
        /// <signature helpKeyword="WinJS.Utilities.formatLog">
        /// <summary locid="WinJS.Utilities.formatLog">
        /// Adds tags and type to a logging message.
        /// </summary>
        /// <param name="message" type="String" locid="WinJS.Utilities.startLog_p:message">The message to be formatted.</param>
        /// <param name="tag" type="String" locid="WinJS.Utilities.startLog_p:tag">The tag(s) to be applied to the message. Multiple tags should be separated by spaces.</param>
        /// <param name="type" type="String" locid="WinJS.Utilities.startLog_p:type">The type of the message.</param>
        /// <returns type="String" locid="WinJS.Utilities.startLog_returnValue">The formatted message.</returns>
        /// </signature>
        var m = message;
        if (typeof (m) === "function") { m = m(); }

        return ((type && typeR.test(type)) ? ("") : (type ? (type + ": ") : "")) +
            (tag ? tag.replace(spaceR, ":") + ": " : "") +
            m;
    }
    function defAction(message, tag, type) {
        var m = WinJS.Utilities.formatLog(message, tag, type);
        console[(type && typeR.test(type)) ? type : "log"](m);
    }
    function escape(s) {
        // \s (whitespace) is used as separator, so don't escape it
        return s.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
    }
    WinJS.Namespace.define("WinJS.Utilities", {
        startLog: function (options) {
            /// <signature helpKeyword="WinJS.Utilities.startLog">
            /// <summary locid="WinJS.Utilities.startLog">
            /// Configures a logger that writes messages containing the specified tags from WinJS.log to console.log.
            /// </summary>
            /// <param name="options" type="String" locid="WinJS.Utilities.startLog_p:options">The tags for messages to log. Multiple tags should be separated by spaces.</param>
            /// </signature>
            /// <signature>
            /// <summary locid="WinJS.Utilities.startLog2">
            /// Configure a logger to write WinJS.log output.
            /// </summary>
            /// <param name="options" type="Object" locid="WinJS.Utilities.startLog_p:options2">
            /// May contain .type, .tags, .excludeTags and .action properties.
            /// - .type is a required tag.
            /// - .excludeTags is a space-separated list of tags, any of which will result in a message not being logged.
            /// - .tags is a space-separated list of tags, any of which will result in a message being logged.
            /// - .action is a function that, if present, will be called with the log message, tags and type. The default is to log to the console.
            /// </param>
            /// </signature>
            options = options || {};
            if (typeof options === "string") {
                options = { tags: options };
            }
            var el = options.type && new RegExp("^(" + escape(options.type).replace(spaceR, " ").split(" ").join("|") + ")$");
            var not = options.excludeTags && new RegExp("(^|\\s)(" + escape(options.excludeTags).replace(spaceR, " ").split(" ").join("|") + ")(\\s|$)", "i");
            var has = options.tags && new RegExp("(^|\\s)(" + escape(options.tags).replace(spaceR, " ").split(" ").join("|") + ")(\\s|$)", "i");
            var action = options.action || defAction;

            if (!el && !not && !has && !WinJS.log) {
                WinJS.log = action;
                return;
            }

            var result = function (message, tag, type) {
                if (!((el && !el.test(type))          // if the expected log level is not satisfied
                    || (not && not.test(tag))         // if any of the excluded categories exist
                    || (has && !has.test(tag)))) {    // if at least one of the included categories doesn't exist
                        action(message, tag, type);
                    }

                result.next && result.next(message, tag, type);
            };
            result.next = WinJS.log;
            WinJS.log = result;
        },
        stopLog: function () {
            /// <signature helpKeyword="WinJS.Utilities.stopLog">
            /// <summary locid="WinJS.Utilities.stopLog">
            /// Removes the previously set up logger.
            /// </summary>
            /// </signature>
            delete WinJS.log;
        },
        formatLog: format
    });
})(this.WinJS);

(function eventsInit(WinJS, undefined) {
    "use strict";


    function createEventProperty(name) {
        var eventPropStateName = "_on" + name + "state";

        return {
            get: function () {
                var state = this[eventPropStateName];
                return state && state.userHandler;
            },
            set: function (handler) {
                var state = this[eventPropStateName];
                if (handler) {
                    if (!state) {
                        state = { wrapper: function (evt) { return state.userHandler(evt); }, userHandler: handler };
                        Object.defineProperty(this, eventPropStateName, { value: state, enumerable: false, writable:true, configurable: true });
                        this.addEventListener(name, state.wrapper, false);
                    }
                    state.userHandler = handler;
                } else if (state) {
                    this.removeEventListener(name, state.wrapper, false);
                    this[eventPropStateName] = null;
                }
            },
            enumerable: true
        }
    }

    function createEventProperties(events) {
        /// <signature helpKeyword="WinJS.Utilities.createEventProperties">
        /// <summary locid="WinJS.Utilities.createEventProperties">
        /// Creates an object that has one property for each name passed to the function.
        /// </summary>
        /// <param name="events" locid="WinJS.Utilities.createEventProperties_p:events">
        /// A variable list of property names.
        /// </param>
        /// <returns type="Object" locid="WinJS.Utilities.createEventProperties_returnValue">
        /// The object with the specified properties. The names of the properties are prefixed with 'on'.
        /// </returns>
        /// </signature>
        var props = {};
        for (var i = 0, len = arguments.length; i < len; i++) {
            var name = arguments[i];
            props["on" + name] = createEventProperty(name);
        }
        return props;
    }

    var EventMixinEvent = WinJS.Class.define(
        function EventMixinEvent_ctor(type, detail, target) {
            this.detail = detail;
            this.target = target;
            this.timeStamp = Date.now();
            this.type = type;
        },
        {
            bubbles: { value: false, writable: false },
            cancelable: { value: false, writable: false },
            currentTarget: {
                get: function () { return this.target; }
            },
            defaultPrevented: {
                get: function () { return this._preventDefaultCalled; }
            },
            trusted: { value: false, writable: false },
            eventPhase: { value: 0, writable: false },
            target: null,
            timeStamp: null,
            type: null,

            preventDefault: function () {
                this._preventDefaultCalled = true;
            },
            stopImmediatePropagation: function () {
                this._stopImmediatePropagationCalled = true;
            },
            stopPropagation: function () {
            }
        }, {
            supportedForProcessing: false,
        }
    );

    var eventMixin = {
        _listeners: null,

        addEventListener: function (type, listener, useCapture) {
            /// <signature helpKeyword="WinJS.Utilities.eventMixin.addEventListener">
            /// <summary locid="WinJS.Utilities.eventMixin.addEventListener">
            /// Adds an event listener to the control.
            /// </summary>
            /// <param name="type" locid="WinJS.Utilities.eventMixin.addEventListener_p:type">
            /// The type (name) of the event.
            /// </param>
            /// <param name="listener" locid="WinJS.Utilities.eventMixin.addEventListener_p:listener">
            /// The listener to invoke when the event gets raised.
            /// </param>
            /// <param name="useCapture" locid="WinJS.Utilities.eventMixin.addEventListener_p:useCapture">
            /// if true initiates capture, otherwise false.
            /// </param>
            /// </signature>
            useCapture = useCapture || false;
            this._listeners = this._listeners || {};
            var eventListeners = (this._listeners[type] = this._listeners[type] || []);
            for (var i = 0, len = eventListeners.length; i < len; i++) {
                var l = eventListeners[i];
                if (l.useCapture === useCapture && l.listener === listener) {
                    return;
                }
            }
            eventListeners.push({ listener: listener, useCapture: useCapture });
        },
        dispatchEvent: function (type, details) {
            /// <signature helpKeyword="WinJS.Utilities.eventMixin.dispatchEvent">
            /// <summary locid="WinJS.Utilities.eventMixin.dispatchEvent">
            /// Raises an event of the specified type and with the specified additional properties.
            /// </summary>
            /// <param name="type" locid="WinJS.Utilities.eventMixin.dispatchEvent_p:type">
            /// The type (name) of the event.
            /// </param>
            /// <param name="details" locid="WinJS.Utilities.eventMixin.dispatchEvent_p:details">
            /// The set of additional properties to be attached to the event object when the event is raised.
            /// </param>
            /// <returns type="Boolean" locid="WinJS.Utilities.eventMixin.dispatchEvent_returnValue">
            /// true if preventDefault was called on the event.
            /// </returns>
            /// </signature>
            var listeners = this._listeners && this._listeners[type];
            if (listeners) {
                var eventValue = new EventMixinEvent(type, details, this);
                // Need to copy the array to protect against people unregistering while we are dispatching
                listeners = listeners.slice(0, listeners.length);
                for (var i = 0, len = listeners.length; i < len && !eventValue._stopImmediatePropagationCalled; i++) {
                    listeners[i].listener(eventValue);
                }
                return eventValue.defaultPrevented || false;
            }
            return false;
        },
        removeEventListener: function (type, listener, useCapture) {
            /// <signature helpKeyword="WinJS.Utilities.eventMixin.removeEventListener">
            /// <summary locid="WinJS.Utilities.eventMixin.removeEventListener">
            /// Removes an event listener from the control.
            /// </summary>
            /// <param name="type" locid="WinJS.Utilities.eventMixin.removeEventListener_p:type">
            /// The type (name) of the event.
            /// </param>
            /// <param name="listener" locid="WinJS.Utilities.eventMixin.removeEventListener_p:listener">
            /// The listener to remove.
            /// </param>
            /// <param name="useCapture" locid="WinJS.Utilities.eventMixin.removeEventListener_p:useCapture">
            /// Specifies whether to initiate capture.
            /// </param>
            /// </signature>
            useCapture = useCapture || false;
            var listeners = this._listeners && this._listeners[type];
            if (listeners) {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    var l = listeners[i];
                    if (l.listener === listener && l.useCapture === useCapture) {
                        listeners.splice(i, 1);
                        if (listeners.length === 0) {
                            delete this._listeners[type];
                        }
                        // Only want to remove one element for each call to removeEventListener
                        break;
                    }
                }
            }
        }
    };

    WinJS.Namespace.define("WinJS.Utilities", {
        _createEventProperty: createEventProperty,
        createEventProperties: createEventProperties,
        eventMixin: eventMixin
    });

})(this.WinJS);


(function resourcesInit(global, WinJS, undefined) {
    "use strict";

    var resourceMap;
    var mrtEventHook = false;
    var contextChangedET = "contextchanged";

    var ListenerType = WinJS.Class.mix(WinJS.Class.define(null, { /* empty */ }, { supportedForProcessing: false }), WinJS.Utilities.eventMixin);
    var listeners = new ListenerType();

    var strings = {
		// MONACO CHANGE
        //get malformedFormatStringInput() { return WinJS.Resources._getWinJSString("base/malformedFormatStringInput").value; },
		malformedFormatStringInput: "Malformed, did you mean to escape your '{0}'?"
    };

    WinJS.Namespace.define("WinJS.Resources", {
        addEventListener: function (type, listener, useCapture) {
            /// <signature helpKeyword="WinJS.Resources.addEventListener">
            /// <summary locid="WinJS.Resources.addEventListener">
            /// Registers an event handler for the specified event.
            /// </summary>
            /// <param name="type" type="String" locid="WinJS.Resources.addEventListener_p:type">
            /// The name of the event to handle.
            /// </param>
            /// <param name="listener" type="Function" locid="WinJS.Resources.addEventListener_p:listener">
            /// The listener to invoke when the event gets raised.
            /// </param>
            /// <param name="useCapture" type="Boolean" locid="WinJS.Resources.addEventListener_p:useCapture">
            /// Set to true to register the event handler for the capturing phase; set to false to register for the bubbling phase.
            /// </param>
            /// </signature>
            if (WinJS.Utilities.hasWinRT && !mrtEventHook) {
                if (type === contextChangedET) {
                    try {
                        Windows.ApplicationModel.Resources.Core.ResourceManager.current.defaultContext.qualifierValues.addEventListener("mapchanged", function (e) {
                            WinJS.Resources.dispatchEvent(contextChangedET, { qualifier: e.key, changed: e.target[e.key] });
                        }, false);

                        mrtEventHook = true;
                    } catch (e) {
                    }
                }
            }
            listeners.addEventListener(type, listener, useCapture);
        },
        removeEventListener: listeners.removeEventListener.bind(listeners),
        dispatchEvent: listeners.dispatchEvent.bind(listeners),

        _formatString: function (string) {
            var args = arguments;
            if (args.length > 1) {
                string = string.replace(/({{)|(}})|{(\d+)}|({)|(})/g, function (unused, left, right, index, illegalLeft, illegalRight) {
                    if (illegalLeft || illegalRight) { throw WinJS.Resources._formatString(strings.malformedFormatStringInput, illegalLeft || illegalRight); }
                    return (left && "{") || (right && "}") || args[(index|0) + 1];
                });
            }
            return string;
        },

        _getStringWinRT: function (resourceId) {
            if (!resourceMap) {
                var mainResourceMap = Windows.ApplicationModel.Resources.Core.ResourceManager.current.mainResourceMap;
                try {
                    resourceMap = mainResourceMap.getSubtree('Resources');
                }
                catch (e) {
                }
                if (!resourceMap) {
                    resourceMap = mainResourceMap;
                }
            }

            var stringValue;
            var langValue;
            var resCandidate;
            try {
                resCandidate = resourceMap.getValue(resourceId);
                if (resCandidate) {
                    stringValue = resCandidate.valueAsString;
                    if (stringValue === undefined) {
                        stringValue = resCandidate.toString();
                    }
                }
            }
            catch (e) {}

            if (!stringValue) {
                return { value: resourceId, empty: true };
            }

            try {
                langValue = resCandidate.getQualifierValue("Language");
            }
            catch (e) {
                return { value: stringValue };
            }

            return { value: stringValue, lang: langValue };
        },

        _getStringJS: function (resourceId) {
            var str = global.strings && global.strings[resourceId];
            if (typeof str === "string") {
                str = { value: str };
            }
            return str || { value: resourceId, empty: true };
        }
    });

    Object.defineProperties(WinJS.Resources, WinJS.Utilities.createEventProperties(contextChangedET));

    var getStringImpl;

    WinJS.Resources.getString = function (resourceId) {
        /// <signature helpKeyword="WinJS.Resources.getString">
        /// <summary locid="WinJS.Resources.getString">
        /// Retrieves the resource string that has the specified resource id.
        /// </summary>
        /// <param name="resourceId" type="Number" locid="WinJS.Resources.getString._p:resourceId">
        /// The resource id of the string to retrieve.
        /// </param>
        /// <returns type="Object" locid="WinJS.Resources.getString_returnValue">
        /// An object that can contain these properties:
        ///
        /// value:
        /// The value of the requested string. This property is always present.
        ///
        /// empty:
        /// A value that specifies whether the requested string wasn't found.
        /// If its true, the string wasn't found. If its false or undefined,
        /// the requested string was found.
        ///
        /// lang:
        /// The language of the string, if specified. This property is only present
        /// for multi-language resources.
        ///
        /// </returns>
        /// </signature>
        getStringImpl =
            getStringImpl ||
                (WinJS.Utilities.hasWinRT
                    ? WinJS.Resources._getStringWinRT
                    : WinJS.Resources._getStringJS);

        return getStringImpl(resourceId);
    };


})(this, this.WinJS);


(function promiseInit(global, WinJS, undefined) {
    "use strict";

    global.Debug && (global.Debug.setNonUserCodeExceptions = true);

    var ListenerType = WinJS.Class.mix(WinJS.Class.define(null, { /*empty*/ }, { supportedForProcessing: false }), WinJS.Utilities.eventMixin);
    var promiseEventListeners = new ListenerType();
    // make sure there is a listeners collection so that we can do a more trivial check below
    promiseEventListeners._listeners = {};
    var errorET = "error";
    var canceledName = "Canceled";
    var tagWithStack = false;
    var tag = {
        promise:            0x01,
        thenPromise:        0x02,
        errorPromise:       0x04,
        exceptionPromise:   0x08,
        completePromise:    0x10,
    };
    tag.all = tag.promise | tag.thenPromise | tag.errorPromise | tag.exceptionPromise | tag.completePromise;

    //
    // Global error counter, for each error which enters the system we increment this once and then
    // the error number travels with the error as it traverses the tree of potential handlers.
    //
    // When someone has registered to be told about errors (WinJS.Promise.callonerror) promises
    // which are in error will get tagged with a ._errorId field. This tagged field is the
    // contract by which nested promises with errors will be identified as chaining for the
    // purposes of the callonerror semantics. If a nested promise in error is encountered without
    // a ._errorId it will be assumed to be foreign and treated as an interop boundary and
    // a new error id will be minted.
    //
    var error_number = 1;

    //
    // The state machine has a interesting hiccup in it with regards to notification, in order
    // to flatten out notification and avoid recursion for synchronous completion we have an
    // explicit set of *_notify states which are responsible for notifying their entire tree
    // of children. They can do this because they know that immediate children are always
    // ThenPromise instances and we can therefore reach into their state to access the
    // _listeners collection.
    //
    // So, what happens is that a Promise will be fulfilled through the _completed or _error
    // messages at which point it will enter a *_notify state and be responsible for to move
    // its children into an (as appropriate) success or error state and also notify that child's
    // listeners of the state transition, until leaf notes are reached.
    //

    var state_created,              // -> working
        state_working,              // -> error | error_notify | success | success_notify | canceled | waiting
        state_waiting,              // -> error | error_notify | success | success_notify | waiting_canceled
        state_waiting_canceled,     // -> error | error_notify | success | success_notify | canceling
        state_canceled,             // -> error | error_notify | success | success_notify | canceling
        state_canceling,            // -> error_notify
        state_success_notify,       // -> success
        state_success,              // -> .
        state_error_notify,         // -> error
        state_error;                // -> .

    // Noop function, used in the various states to indicate that they don't support a given
    // message. Named with the somewhat cute name '_' because it reads really well in the states.

    function _() { }

    // Initial state
    //
    state_created = {
        name: "created",
        enter: function (promise) {
            promise._setState(state_working);
        },
        cancel: _,
        done: _,
        then: _,
        _completed: _,
        _error: _,
        _notify: _,
        _progress: _,
        _setCompleteValue: _,
        _setErrorValue: _
    };

    // Ready state, waiting for a message (completed/error/progress), able to be canceled
    //
    state_working = {
        name: "working",
        enter: _,
        cancel: function (promise) {
            promise._setState(state_canceled);
        },
        done: done,
        then: then,
        _completed: completed,
        _error: error,
        _notify: _,
        _progress: progress,
        _setCompleteValue: setCompleteValue,
        _setErrorValue: setErrorValue
    };

    // Waiting state, if a promise is completed with a value which is itself a promise
    // (has a then() method) it signs up to be informed when that child promise is
    // fulfilled at which point it will be fulfilled with that value.
    //
    state_waiting = {
        name: "waiting",
        enter: function (promise) {
            var waitedUpon = promise._value;
            var error = function (value) {
                if (waitedUpon._errorId) {
                    promise._chainedError(value, waitedUpon);
                } else {
                    // Because this is an interop boundary we want to indicate that this
                    //  error has been handled by the promise infrastructure before we
                    //  begin a new handling chain.
                    //
                    callonerror(promise, value, detailsForHandledError, waitedUpon, error);
                    promise._error(value);
                }
            };
            error.handlesOnError = true;
            waitedUpon.then(
                promise._completed.bind(promise),
                error,
                promise._progress.bind(promise)
            );
        },
        cancel: function (promise) {
            promise._setState(state_waiting_canceled);
        },
        done: done,
        then: then,
        _completed: completed,
        _error: error,
        _notify: _,
        _progress: progress,
        _setCompleteValue: setCompleteValue,
        _setErrorValue: setErrorValue
    };

    // Waiting canceled state, when a promise has been in a waiting state and receives a
    // request to cancel its pending work it will forward that request to the child promise
    // and then waits to be informed of the result. This promise moves itself into the
    // canceling state but understands that the child promise may instead push it to a
    // different state.
    //
    state_waiting_canceled = {
        name: "waiting_canceled",
        enter: function (promise) {
            // Initiate a transition to canceling. Triggering a cancel on the promise
            // that we are waiting upon may result in a different state transition
            // before the state machine pump runs again.
            promise._setState(state_canceling);
            var waitedUpon = promise._value;
            if (waitedUpon.cancel) {
                waitedUpon.cancel();
            }
        },
        cancel: _,
        done: done,
        then: then,
        _completed: completed,
        _error: error,
        _notify: _,
        _progress: progress,
        _setCompleteValue: setCompleteValue,
        _setErrorValue: setErrorValue
    };

    // Canceled state, moves to the canceling state and then tells the promise to do
    // whatever it might need to do on cancelation.
    //
    state_canceled = {
        name: "canceled",
        enter: function (promise) {
            // Initiate a transition to canceling. The _cancelAction may change the state
            // before the state machine pump runs again.
            promise._setState(state_canceling);
            promise._cancelAction();
        },
        cancel: _,
        done: done,
        then: then,
        _completed: completed,
        _error: error,
        _notify: _,
        _progress: progress,
        _setCompleteValue: setCompleteValue,
        _setErrorValue: setErrorValue
    };

    // Canceling state, commits to the promise moving to an error state with an error
    // object whose 'name' and 'message' properties contain the string "Canceled"
    //
    state_canceling = {
        name: "canceling",
        enter: function (promise) {
            var error = new Error(canceledName);
            error.name = error.message;
            promise._value = error;
            promise._setState(state_error_notify);
        },
        cancel: _,
        done: _,
        then: _,
        _completed: _,
        _error: _,
        _notify: _,
        _progress: _,
        _setCompleteValue: _,
        _setErrorValue: _
    };

    // Success notify state, moves a promise to the success state and notifies all children
    //
    state_success_notify = {
        name: "complete_notify",
        enter: function (promise) {
            promise.done = CompletePromise.prototype.done;
            promise.then = CompletePromise.prototype.then;
            if (promise._listeners) {
                var queue = [promise];
                var p;
                while (queue.length) {
                    p = queue.pop();
                    p._state._notify(p, queue);
                }
            }
            promise._setState(state_success);
        },
        cancel: _,
        done: null, /*error to get here */
        then: null, /*error to get here */
        _completed: _,
        _error: _,
        _notify: notifySuccess,
        _progress: _,
        _setCompleteValue: _,
        _setErrorValue: _
    };

    // Success state, moves a promise to the success state and does NOT notify any children.
    // Some upstream promise is owning the notification pass.
    //
    state_success = {
        name: "success",
        enter: function (promise) {
            promise.done = CompletePromise.prototype.done;
            promise.then = CompletePromise.prototype.then;
            promise._cleanupAction();
        },
        cancel: _,
        done: null, /*error to get here */
        then: null, /*error to get here */
        _completed: _,
        _error: _,
        _notify: notifySuccess,
        _progress: _,
        _setCompleteValue: _,
        _setErrorValue: _
    };

    // Error notify state, moves a promise to the error state and notifies all children
    //
    state_error_notify = {
        name: "error_notify",
        enter: function (promise) {
            promise.done = ErrorPromise.prototype.done;
            promise.then = ErrorPromise.prototype.then;
            if (promise._listeners) {
                var queue = [promise];
                var p;
                while (queue.length) {
                    p = queue.pop();
                    p._state._notify(p, queue);
                }
            }
            promise._setState(state_error);
        },
        cancel: _,
        done: null, /*error to get here*/
        then: null, /*error to get here*/
        _completed: _,
        _error: _,
        _notify: notifyError,
        _progress: _,
        _setCompleteValue: _,
        _setErrorValue: _
    };

    // Error state, moves a promise to the error state and does NOT notify any children.
    // Some upstream promise is owning the notification pass.
    //
    state_error = {
        name: "error",
        enter: function (promise) {
            promise.done = ErrorPromise.prototype.done;
            promise.then = ErrorPromise.prototype.then;
            promise._cleanupAction();
        },
        cancel: _,
        done: null, /*error to get here*/
        then: null, /*error to get here*/
        _completed: _,
        _error: _,
        _notify: notifyError,
        _progress: _,
        _setCompleteValue: _,
        _setErrorValue: _
    };

    //
    // The statemachine implementation follows a very particular pattern, the states are specified
    // as static stateless bags of functions which are then indirected through the state machine
    // instance (a Promise). As such all of the functions on each state have the promise instance
    // passed to them explicitly as a parameter and the Promise instance members do a little
    // dance where they indirect through the state and insert themselves in the argument list.
    //
    // We could instead call directly through the promise states however then every caller
    // would have to remember to do things like pumping the state machine to catch state transitions.
    //

    var PromiseStateMachine = WinJS.Class.define(null, {
        _listeners: null,
        _nextState: null,
        _state: null,
        _value: null,

        cancel: function () {
            /// <signature helpKeyword="WinJS.PromiseStateMachine.cancel">
            /// <summary locid="WinJS.PromiseStateMachine.cancel">
            /// Attempts to cancel the fulfillment of a promised value. If the promise hasn't
            /// already been fulfilled and cancellation is supported, the promise enters
            /// the error state with a value of Error("Canceled").
            /// </summary>
            /// </signature>
            this._state.cancel(this);
            this._run();
        },
        done: function Promise_done(onComplete, onError, onProgress) {
            /// <signature helpKeyword="WinJS.PromiseStateMachine.done">
            /// <summary locid="WinJS.PromiseStateMachine.done">
            /// Allows you to specify the work to be done on the fulfillment of the promised value,
            /// the error handling to be performed if the promise fails to fulfill
            /// a value, and the handling of progress notifications along the way.
            ///
            /// After the handlers have finished executing, this function throws any error that would have been returned
            /// from then() as a promise in the error state.
            /// </summary>
            /// <param name="onComplete" type="Function" locid="WinJS.PromiseStateMachine.done_p:onComplete">
            /// The function to be called if the promise is fulfilled successfully with a value.
            /// The fulfilled value is passed as the single argument. If the value is null,
            /// the fulfilled value is returned. The value returned
            /// from the function becomes the fulfilled value of the promise returned by
            /// then(). If an exception is thrown while executing the function, the promise returned
            /// by then() moves into the error state.
            /// </param>
            /// <param name="onError" type="Function" optional="true" locid="WinJS.PromiseStateMachine.done_p:onError">
            /// The function to be called if the promise is fulfilled with an error. The error
            /// is passed as the single argument. If it is null, the error is forwarded.
            /// The value returned from the function is the fulfilled value of the promise returned by then().
            /// </param>
            /// <param name="onProgress" type="Function" optional="true" locid="WinJS.PromiseStateMachine.done_p:onProgress">
            /// the function to be called if the promise reports progress. Data about the progress
            /// is passed as the single argument. Promises are not required to support
            /// progress.
            /// </param>
            /// </signature>
            this._state.done(this, onComplete, onError, onProgress);
        },
        then: function Promise_then(onComplete, onError, onProgress) {
            /// <signature helpKeyword="WinJS.PromiseStateMachine.then">
            /// <summary locid="WinJS.PromiseStateMachine.then">
            /// Allows you to specify the work to be done on the fulfillment of the promised value,
            /// the error handling to be performed if the promise fails to fulfill
            /// a value, and the handling of progress notifications along the way.
            /// </summary>
            /// <param name="onComplete" type="Function" locid="WinJS.PromiseStateMachine.then_p:onComplete">
            /// The function to be called if the promise is fulfilled successfully with a value.
            /// The value is passed as the single argument. If the value is null, the value is returned.
            /// The value returned from the function becomes the fulfilled value of the promise returned by
            /// then(). If an exception is thrown while this function is being executed, the promise returned
            /// by then() moves into the error state.
            /// </param>
            /// <param name="onError" type="Function" optional="true" locid="WinJS.PromiseStateMachine.then_p:onError">
            /// The function to be called if the promise is fulfilled with an error. The error
            /// is passed as the single argument. If it is null, the error is forwarded.
            /// The value returned from the function becomes the fulfilled value of the promise returned by then().
            /// </param>
            /// <param name="onProgress" type="Function" optional="true" locid="WinJS.PromiseStateMachine.then_p:onProgress">
            /// The function to be called if the promise reports progress. Data about the progress
            /// is passed as the single argument. Promises are not required to support
            /// progress.
            /// </param>
            /// <returns type="WinJS.Promise" locid="WinJS.PromiseStateMachine.then_returnValue">
            /// The promise whose value is the result of executing the complete or
            /// error function.
            /// </returns>
            /// </signature>
            return this._state.then(this, onComplete, onError, onProgress);
        },

        _chainedError: function (value, context) {
            var result = this._state._error(this, value, detailsForChainedError, context);
            this._run();
            return result;
        },
        _completed: function (value) {
            var result = this._state._completed(this, value);
            this._run();
            return result;
        },
        _error: function (value) {
            var result = this._state._error(this, value, detailsForError);
            this._run();
            return result;
        },
        _progress: function (value) {
            this._state._progress(this, value);
        },
        _setState: function (state) {
            this._nextState = state;
        },
        _setCompleteValue: function (value) {
            this._state._setCompleteValue(this, value);
            this._run();
        },
        _setChainedErrorValue: function (value, context) {
            var result = this._state._setErrorValue(this, value, detailsForChainedError, context);
            this._run();
            return result;
        },
        _setExceptionValue: function (value) {
            var result = this._state._setErrorValue(this, value, detailsForException);
            this._run();
            return result;
        },
        _run: function () {
            while (this._nextState) {
                this._state = this._nextState;
                this._nextState = null;
                this._state.enter(this);
            }
        }
    }, {
        supportedForProcessing: false
    });

    //
    // Implementations of shared state machine code.
    //

    function completed(promise, value) {
        var targetState;
        if (value && typeof value === "object" && typeof value.then === "function") {
            targetState = state_waiting;
        } else {
            targetState = state_success_notify;
        }
        promise._value = value;
        promise._setState(targetState);
    }
    function createErrorDetails(exception, error, promise, id, parent, handler) {
        return {
            exception: exception,
            error: error,
            promise: promise,
            handler: handler,
            id: id,
            parent: parent
        };
    }
    function detailsForHandledError(promise, errorValue, context, handler) {
        var exception = context._isException;
        var errorId = context._errorId;
        return createErrorDetails(
            exception ? errorValue : null,
            exception ? null : errorValue,
            promise,
            errorId,
            context,
            handler
        );
    }
    function detailsForChainedError(promise, errorValue, context) {
        var exception = context._isException;
        var errorId = context._errorId;
        setErrorInfo(promise, errorId, exception);
        return createErrorDetails(
            exception ? errorValue : null,
            exception ? null : errorValue,
            promise,
            errorId,
            context
        );
    }
    function detailsForError(promise, errorValue) {
        var errorId = ++error_number;
        setErrorInfo(promise, errorId);
        return createErrorDetails(
            null,
            errorValue,
            promise,
            errorId
        );
    }
    function detailsForException(promise, exceptionValue) {
        var errorId = ++error_number;
        setErrorInfo(promise, errorId, true);
        return createErrorDetails(
            exceptionValue,
            null,
            promise,
            errorId
        );
    }
    function done(promise, onComplete, onError, onProgress) {
        pushListener(promise, { c: onComplete, e: onError, p: onProgress });
    }
    function error(promise, value, onerrorDetails, context) {
        promise._value = value;
        callonerror(promise, value, onerrorDetails, context);
        promise._setState(state_error_notify);
    }
    function notifySuccess(promise, queue) {
        var value = promise._value;
        var listeners = promise._listeners;
        if (!listeners) {
            return;
        }
        promise._listeners = null;
        var i, len;
        for (i = 0, len = Array.isArray(listeners) ? listeners.length : 1; i < len; i++) {
            var listener = len === 1 ? listeners : listeners[i];
            var onComplete = listener.c;
            var target = listener.promise;
            if (target) {
                try {
                    target._setCompleteValue(onComplete ? onComplete(value) : value);
                } catch (ex) {
                    target._setExceptionValue(ex);
                }
                if (target._state !== state_waiting && target._listeners) {
                    queue.push(target);
                }
            } else {
                CompletePromise.prototype.done.call(promise, onComplete);
            }
        }
    }
    function notifyError(promise, queue) {
        var value = promise._value;
        var listeners = promise._listeners;
        if (!listeners) {
            return;
        }
        promise._listeners = null;
        var i, len;
        for (i = 0, len = Array.isArray(listeners) ? listeners.length : 1; i < len; i++) {
            var listener = len === 1 ? listeners : listeners[i];
            var onError = listener.e;
            var target = listener.promise;
            if (target) {
                try {
                    if (onError) {
                        if (!onError.handlesOnError) {
                            callonerror(target, value, detailsForHandledError, promise, onError);
                        }
                        target._setCompleteValue(onError(value))
                    } else {
                        target._setChainedErrorValue(value, promise);
                    }
                } catch (ex) {
                    target._setExceptionValue(ex);
                }
                if (target._state !== state_waiting && target._listeners) {
                    queue.push(target);
                }
            } else {
                ErrorPromise.prototype.done.call(promise, null, onError);
            }
        }
    }
    function callonerror(promise, value, onerrorDetailsGenerator, context, handler) {
        if (promiseEventListeners._listeners[errorET]) {
            if (value instanceof Error && value.message === canceledName) {
                return;
            }
            promiseEventListeners.dispatchEvent(errorET, onerrorDetailsGenerator(promise, value, context, handler));
        }
    }
    function progress(promise, value) {
        var listeners = promise._listeners;
        if (listeners) {
            var i, len;
            for (i = 0, len = Array.isArray(listeners) ? listeners.length : 1; i < len; i++) {
                var listener = len === 1 ? listeners : listeners[i];
                var onProgress = listener.p;
                if (onProgress) {
                    try { onProgress(value); } catch (ex) { }
                }
                if (!(listener.c || listener.e) && listener.promise) {
                    listener.promise._progress(value);
                }
            }
        }
    }
    function pushListener(promise, listener) {
        var listeners = promise._listeners;
        if (listeners) {
            // We may have either a single listener (which will never be wrapped in an array)
            // or 2+ listeners (which will be wrapped). Since we are now adding one more listener
            // we may have to wrap the single listener before adding the second.
            listeners = Array.isArray(listeners) ? listeners : [listeners];
            listeners.push(listener);
        } else {
            listeners = listener;
        }
        promise._listeners = listeners;
    }
    // The difference beween setCompleteValue()/setErrorValue() and complete()/error() is that setXXXValue() moves
    // a promise directly to the success/error state without starting another notification pass (because one
    // is already ongoing).
    function setErrorInfo(promise, errorId, isException) {
        promise._isException = isException || false;
        promise._errorId = errorId;
    }
    function setErrorValue(promise, value, onerrorDetails, context) {
        promise._value = value;
        callonerror(promise, value, onerrorDetails, context);
        promise._setState(state_error);
    }
    function setCompleteValue(promise, value) {
        var targetState;
        if (value && typeof value === "object" && typeof value.then === "function") {
            targetState = state_waiting;
        } else {
            targetState = state_success;
        }
        promise._value = value;
        promise._setState(targetState);
    }
    function then(promise, onComplete, onError, onProgress) {
        var result = new ThenPromise(promise);
        pushListener(promise, { promise: result, c: onComplete, e: onError, p: onProgress });
        return result;
    }

    //
    // Internal implementation detail promise, ThenPromise is created when a promise needs
    // to be returned from a then() method.
    //
    var ThenPromise = WinJS.Class.derive(PromiseStateMachine,
        function (creator) {

            if (tagWithStack && (tagWithStack === true || (tagWithStack & tag.thenPromise))) {
                this._stack = WinJS.Promise._getStack();
            }

            this._creator = creator;
            this._setState(state_created);
            this._run();
        }, {
            _creator: null,

            _cancelAction: function () { if (this._creator) { this._creator.cancel(); } },
            _cleanupAction: function () { this._creator = null; }
        }, {
            supportedForProcessing: false
        }
    );

    //
    // Slim promise implementations for already completed promises, these are created
    // under the hood on synchronous completion paths as well as by WinJS.Promise.wrap
    // and WinJS.Promise.wrapError.
    //

    var ErrorPromise = WinJS.Class.define(
        function ErrorPromise_ctor(value) {

            if (tagWithStack && (tagWithStack === true || (tagWithStack & tag.errorPromise))) {
                this._stack = WinJS.Promise._getStack();
            }

            this._value = value;
            callonerror(this, value, detailsForError);
        }, {
            cancel: function () {
                /// <signature helpKeyword="WinJS.PromiseStateMachine.cancel">
                /// <summary locid="WinJS.PromiseStateMachine.cancel">
                /// Attempts to cancel the fulfillment of a promised value. If the promise hasn't
                /// already been fulfilled and cancellation is supported, the promise enters
                /// the error state with a value of Error("Canceled").
                /// </summary>
                /// </signature>
            },
            done: function ErrorPromise_done(unused, onError) {
                /// <signature helpKeyword="WinJS.PromiseStateMachine.done">
                /// <summary locid="WinJS.PromiseStateMachine.done">
                /// Allows you to specify the work to be done on the fulfillment of the promised value,
                /// the error handling to be performed if the promise fails to fulfill
                /// a value, and the handling of progress notifications along the way.
                ///
                /// After the handlers have finished executing, this function throws any error that would have been returned
                /// from then() as a promise in the error state.
                /// </summary>
                /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.done_p:onComplete">
                /// The function to be called if the promise is fulfilled successfully with a value.
                /// The fulfilled value is passed as the single argument. If the value is null,
                /// the fulfilled value is returned. The value returned
                /// from the function becomes the fulfilled value of the promise returned by
                /// then(). If an exception is thrown while executing the function, the promise returned
                /// by then() moves into the error state.
                /// </param>
                /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onError">
                /// The function to be called if the promise is fulfilled with an error. The error
                /// is passed as the single argument. If it is null, the error is forwarded.
                /// The value returned from the function is the fulfilled value of the promise returned by then().
                /// </param>
                /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onProgress">
                /// the function to be called if the promise reports progress. Data about the progress
                /// is passed as the single argument. Promises are not required to support
                /// progress.
                /// </param>
                /// </signature>
                var value = this._value;
                if (onError) {
                    try {
                        if (!onError.handlesOnError) {
                            callonerror(null, value, detailsForHandledError, this, onError);
                        }
                        var result = onError(value);
                        if (result && typeof result === "object" && typeof result.done === "function") {
                            // If a promise is returned we need to wait on it.
                            result.done();
                        }
                        return;
                    } catch (ex) {
                        value = ex;
                    }
                }
                if (value instanceof Error && value.message === canceledName) {
                    // suppress cancel
                    return;
                }
                // force the exception to be thrown asyncronously to avoid any try/catch blocks
                //
                setImmediate(function () {
                    throw value;
                });
            },
            then: function ErrorPromise_then(unused, onError) {
                /// <signature helpKeyword="WinJS.PromiseStateMachine.then">
                /// <summary locid="WinJS.PromiseStateMachine.then">
                /// Allows you to specify the work to be done on the fulfillment of the promised value,
                /// the error handling to be performed if the promise fails to fulfill
                /// a value, and the handling of progress notifications along the way.
                /// </summary>
                /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.then_p:onComplete">
                /// The function to be called if the promise is fulfilled successfully with a value.
                /// The value is passed as the single argument. If the value is null, the value is returned.
                /// The value returned from the function becomes the fulfilled value of the promise returned by
                /// then(). If an exception is thrown while this function is being executed, the promise returned
                /// by then() moves into the error state.
                /// </param>
                /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onError">
                /// The function to be called if the promise is fulfilled with an error. The error
                /// is passed as the single argument. If it is null, the error is forwarded.
                /// The value returned from the function becomes the fulfilled value of the promise returned by then().
                /// </param>
                /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onProgress">
                /// The function to be called if the promise reports progress. Data about the progress
                /// is passed as the single argument. Promises are not required to support
                /// progress.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.PromiseStateMachine.then_returnValue">
                /// The promise whose value is the result of executing the complete or
                /// error function.
                /// </returns>
                /// </signature>

                // If the promise is already in a error state and no error handler is provided
                // we optimize by simply returning the promise instead of creating a new one.
                //
                if (!onError) { return this; }
                var result;
                var value = this._value;
                try {
                    if (!onError.handlesOnError) {
                        callonerror(null, value, detailsForHandledError, this, onError);
                    }
                    result = new CompletePromise(onError(value));
                } catch (ex) {
                    // If the value throw from the error handler is the same as the value
                    // provided to the error handler then there is no need for a new promise.
                    //
                    if (ex === value) {
                        result = this;
                    } else {
                        result = new ExceptionPromise(ex);
                    }
                }
                return result;
            }
        }, {
            supportedForProcessing: false
        }
    );

    var ExceptionPromise = WinJS.Class.derive(ErrorPromise,
        function ExceptionPromise_ctor(value) {

            if (tagWithStack && (tagWithStack === true || (tagWithStack & tag.exceptionPromise))) {
                this._stack = WinJS.Promise._getStack();
            }

            this._value = value;
            callonerror(this, value, detailsForException);
        }, {
            /* empty */
        }, {
            supportedForProcessing: false
        }
    );

    var CompletePromise = WinJS.Class.define(
        function CompletePromise_ctor(value) {

            if (tagWithStack && (tagWithStack === true || (tagWithStack & tag.completePromise))) {
                this._stack = WinJS.Promise._getStack();
            }

            if (value && typeof value === "object" && typeof value.then === "function") {
                var result = new ThenPromise(null);
                result._setCompleteValue(value);
                return result;
            }
            this._value = value;
        }, {
            cancel: function () {
                /// <signature helpKeyword="WinJS.PromiseStateMachine.cancel">
                /// <summary locid="WinJS.PromiseStateMachine.cancel">
                /// Attempts to cancel the fulfillment of a promised value. If the promise hasn't
                /// already been fulfilled and cancellation is supported, the promise enters
                /// the error state with a value of Error("Canceled").
                /// </summary>
                /// </signature>
            },
            done: function CompletePromise_done(onComplete) {
                /// <signature helpKeyword="WinJS.PromiseStateMachine.done">
                /// <summary locid="WinJS.PromiseStateMachine.done">
                /// Allows you to specify the work to be done on the fulfillment of the promised value,
                /// the error handling to be performed if the promise fails to fulfill
                /// a value, and the handling of progress notifications along the way.
                ///
                /// After the handlers have finished executing, this function throws any error that would have been returned
                /// from then() as a promise in the error state.
                /// </summary>
                /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.done_p:onComplete">
                /// The function to be called if the promise is fulfilled successfully with a value.
                /// The fulfilled value is passed as the single argument. If the value is null,
                /// the fulfilled value is returned. The value returned
                /// from the function becomes the fulfilled value of the promise returned by
                /// then(). If an exception is thrown while executing the function, the promise returned
                /// by then() moves into the error state.
                /// </param>
                /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onError">
                /// The function to be called if the promise is fulfilled with an error. The error
                /// is passed as the single argument. If it is null, the error is forwarded.
                /// The value returned from the function is the fulfilled value of the promise returned by then().
                /// </param>
                /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onProgress">
                /// the function to be called if the promise reports progress. Data about the progress
                /// is passed as the single argument. Promises are not required to support
                /// progress.
                /// </param>
                /// </signature>
                if (!onComplete) { return; }
                try {
                    var result = onComplete(this._value);
                    if (result && typeof result === "object" && typeof result.done === "function") {
                        result.done();
                    }
                } catch (ex) {
                    // force the exception to be thrown asynchronously to avoid any try/catch blocks
                    setImmediate(function () {
                        throw ex;
                    });
                }
            },
            then: function CompletePromise_then(onComplete) {
                /// <signature helpKeyword="WinJS.PromiseStateMachine.then">
                /// <summary locid="WinJS.PromiseStateMachine.then">
                /// Allows you to specify the work to be done on the fulfillment of the promised value,
                /// the error handling to be performed if the promise fails to fulfill
                /// a value, and the handling of progress notifications along the way.
                /// </summary>
                /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.then_p:onComplete">
                /// The function to be called if the promise is fulfilled successfully with a value.
                /// The value is passed as the single argument. If the value is null, the value is returned.
                /// The value returned from the function becomes the fulfilled value of the promise returned by
                /// then(). If an exception is thrown while this function is being executed, the promise returned
                /// by then() moves into the error state.
                /// </param>
                /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onError">
                /// The function to be called if the promise is fulfilled with an error. The error
                /// is passed as the single argument. If it is null, the error is forwarded.
                /// The value returned from the function becomes the fulfilled value of the promise returned by then().
                /// </param>
                /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onProgress">
                /// The function to be called if the promise reports progress. Data about the progress
                /// is passed as the single argument. Promises are not required to support
                /// progress.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.PromiseStateMachine.then_returnValue">
                /// The promise whose value is the result of executing the complete or
                /// error function.
                /// </returns>
                /// </signature>
                try {
                    // If the value returned from the completion handler is the same as the value
                    // provided to the completion handler then there is no need for a new promise.
                    //
                    var newValue = onComplete ? onComplete(this._value) : this._value;
                    return newValue === this._value ? this : new CompletePromise(newValue);
                } catch (ex) {
                    return new ExceptionPromise(ex);
                }
            }
        }, {
            supportedForProcessing: false
        }
    );

    //
    // Promise is the user-creatable WinJS.Promise object.
    //

    function timeout(timeoutMS) {
        var id;
        return new WinJS.Promise(
            function (c) {
                if (timeoutMS) {
                    id = setTimeout(c, timeoutMS);
                } else {
                    setImmediate(c);
                }
            },
            function () {
                if (id) {
                    clearTimeout(id);
                }
            }
        );
    }

    function timeoutWithPromise(timeout, promise) {
        var cancelPromise = function () { promise.cancel(); }
        var cancelTimeout = function () { timeout.cancel(); }
        timeout.then(cancelPromise);
        promise.then(cancelTimeout, cancelTimeout);
        return promise;
    }

    var staticCanceledPromise;

    var Promise = WinJS.Class.derive(PromiseStateMachine,
        function Promise_ctor(init, oncancel) {
            /// <signature helpKeyword="WinJS.Promise">
            /// <summary locid="WinJS.Promise">
            /// A promise provides a mechanism to schedule work to be done on a value that
            /// has not yet been computed. It is a convenient abstraction for managing
            /// interactions with asynchronous APIs.
            /// </summary>
            /// <param name="init" type="Function" locid="WinJS.Promise_p:init">
            /// The function that is called during construction of the  promise. The function
            /// is given three arguments (complete, error, progress). Inside this function
            /// you should add event listeners for the notifications supported by this value.
            /// </param>
            /// <param name="oncancel" optional="true" locid="WinJS.Promise_p:oncancel">
            /// The function to call if a consumer of this promise wants
            /// to cancel its undone work. Promises are not required to
            /// support cancellation.
            /// </param>
            /// </signature>

            if (tagWithStack && (tagWithStack === true || (tagWithStack & tag.promise))) {
                this._stack = WinJS.Promise._getStack();
            }

            this._oncancel = oncancel;
            this._setState(state_created);
            this._run();

            try {
                var complete = this._completed.bind(this);
                var error = this._error.bind(this);
                var progress = this._progress.bind(this);
                init(complete, error, progress);
            } catch (ex) {
                this._setExceptionValue(ex);
            }
        }, {
            _oncancel: null,

            _cancelAction: function () {
				try {
            		if (this._oncancel) {
						this._oncancel();
					} else {
						throw new Error('Promise did not implement oncancel');
					}
				} catch (ex) {
					// Access fields to get them created
					var msg = ex.message;
					var stack = ex.stack;
					promiseEventListeners.dispatchEvent('error', ex);
				}
            },
            _cleanupAction: function () { this._oncancel = null; }
        }, {

            addEventListener: function Promise_addEventListener(eventType, listener, capture) {
                /// <signature helpKeyword="WinJS.Promise.addEventListener">
                /// <summary locid="WinJS.Promise.addEventListener">
                /// Adds an event listener to the control.
                /// </summary>
                /// <param name="eventType" locid="WinJS.Promise.addEventListener_p:eventType">
                /// The type (name) of the event.
                /// </param>
                /// <param name="listener" locid="WinJS.Promise.addEventListener_p:listener">
                /// The listener to invoke when the event is raised.
                /// </param>
                /// <param name="capture" locid="WinJS.Promise.addEventListener_p:capture">
                /// Specifies whether or not to initiate capture.
                /// </param>
                /// </signature>
                promiseEventListeners.addEventListener(eventType, listener, capture);
            },
            any: function Promise_any(values) {
                /// <signature helpKeyword="WinJS.Promise.any">
                /// <summary locid="WinJS.Promise.any">
                /// Returns a promise that is fulfilled when one of the input promises
                /// has been fulfilled.
                /// </summary>
                /// <param name="values" type="Array" locid="WinJS.Promise.any_p:values">
                /// An array that contains promise objects or objects whose property
                /// values include promise objects.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.any_returnValue">
                /// A promise that on fulfillment yields the value of the input (complete or error).
                /// </returns>
                /// </signature>
                return new Promise(
                    function (complete, error, progress) {
                        var keys = Object.keys(values);
                        var errors = Array.isArray(values) ? [] : {};
                        if (keys.length === 0) {
                            complete();
                        }
                        var canceled = 0;
                        keys.forEach(function (key) {
                            Promise.as(values[key]).then(
                                function () { complete({ key: key, value: values[key] }); },
                                function (e) {
                                    if (e instanceof Error && e.name === canceledName) {
                                        if ((++canceled) === keys.length) {
                                            complete(WinJS.Promise.cancel);
                                        }
                                        return;
                                    }
                                    error({ key: key, value: values[key] });
                                }
                            );
                        });
                    },
                    function () {
                        var keys = Object.keys(values);
                        keys.forEach(function (key) {
                            var promise = Promise.as(values[key]);
                            if (typeof promise.cancel === "function") {
                                promise.cancel();
                            }
                        });
                    }
                );
            },
            as: function Promise_as(value) {
                /// <signature helpKeyword="WinJS.Promise.as">
                /// <summary locid="WinJS.Promise.as">
                /// Returns a promise. If the object is already a promise it is returned;
                /// otherwise the object is wrapped in a promise.
                /// </summary>
                /// <param name="value" locid="WinJS.Promise.as_p:value">
                /// The value to be treated as a promise.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.as_returnValue">
                /// A promise.
                /// </returns>
                /// </signature>
                if (value && typeof value === "object" && typeof value.then === "function") {
                    return value;
                }
                return new CompletePromise(value);
            },
            /// <field type="WinJS.Promise" helpKeyword="WinJS.Promise.cancel" locid="WinJS.Promise.cancel">
            /// Canceled promise value, can be returned from a promise completion handler
            /// to indicate cancelation of the promise chain.
            /// </field>
            cancel: {
                get: function () {
                    return (staticCanceledPromise = staticCanceledPromise || new ErrorPromise(new WinJS.ErrorFromName(canceledName)));
                }
            },
            dispatchEvent: function Promise_dispatchEvent(eventType, details) {
                /// <signature helpKeyword="WinJS.Promise.dispatchEvent">
                /// <summary locid="WinJS.Promise.dispatchEvent">
                /// Raises an event of the specified type and properties.
                /// </summary>
                /// <param name="eventType" locid="WinJS.Promise.dispatchEvent_p:eventType">
                /// The type (name) of the event.
                /// </param>
                /// <param name="details" locid="WinJS.Promise.dispatchEvent_p:details">
                /// The set of additional properties to be attached to the event object.
                /// </param>
                /// <returns type="Boolean" locid="WinJS.Promise.dispatchEvent_returnValue">
                /// Specifies whether preventDefault was called on the event.
                /// </returns>
                /// </signature>
                return promiseEventListeners.dispatchEvent(eventType, details);
            },
            is: function Promise_is(value) {
                /// <signature helpKeyword="WinJS.Promise.is">
                /// <summary locid="WinJS.Promise.is">
                /// Determines whether a value fulfills the promise contract.
                /// </summary>
                /// <param name="value" locid="WinJS.Promise.is_p:value">
                /// A value that may be a promise.
                /// </param>
                /// <returns type="Boolean" locid="WinJS.Promise.is_returnValue">
                /// true if the specified value is a promise, otherwise false.
                /// </returns>
                /// </signature>
                return value && typeof value === "object" && typeof value.then === "function";
            },
            join: function Promise_join(values) {
                /// <signature helpKeyword="WinJS.Promise.join">
                /// <summary locid="WinJS.Promise.join">
                /// Creates a promise that is fulfilled when all the values are fulfilled.
                /// </summary>
                /// <param name="values" type="Object" locid="WinJS.Promise.join_p:values">
                /// An object whose fields contain values, some of which may be promises.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.join_returnValue">
                /// A promise whose value is an object with the same field names as those of the object in the values parameter, where
                /// each field value is the fulfilled value of a promise.
                /// </returns>
                /// </signature>
                return new Promise(
                    function (complete, error, progress) {
                        var keys = Object.keys(values);
                        var errors = Array.isArray(values) ? [] : {};
                        var results = Array.isArray(values) ? [] : {};
                        var undefineds = 0;
                        var pending = keys.length;
                        var argDone = function (key) {
                            if ((--pending) === 0) {
                                var errorCount = Object.keys(errors).length;
                                if (errorCount === 0) {
                                    complete(results);
                                } else {
                                    var canceledCount = 0;
                                    keys.forEach(function (key) {
                                        var e = errors[key];
                                        if (e instanceof Error && e.name === canceledName) {
                                            canceledCount++;
                                        }
                                    });
                                    if (canceledCount === errorCount) {
                                        complete(WinJS.Promise.cancel);
                                    } else {
                                        error(errors);
                                    }
                                }
                            } else {
                                progress({ Key: key, Done: true });
                            }
                        };
                        keys.forEach(function (key) {
                            var value = values[key];
                            if (value === undefined) {
                                undefineds++;
                            } else {
                                Promise.then(value,
                                    function (value) { results[key] = value; argDone(key); },
                                    function (value) { errors[key] = value; argDone(key); }
                                );
                            }
                        });
                        pending -= undefineds;
                        if (pending === 0) {
                            complete(results);
                            return;
                        }
                    },
                    function () {
                        Object.keys(values).forEach(function (key) {
                            var promise = Promise.as(values[key]);
                            if (typeof promise.cancel === "function") {
                                promise.cancel();
                            }
                        });
                    }
                );
            },
            removeEventListener: function Promise_removeEventListener(eventType, listener, capture) {
                /// <signature helpKeyword="WinJS.Promise.removeEventListener">
                /// <summary locid="WinJS.Promise.removeEventListener">
                /// Removes an event listener from the control.
                /// </summary>
                /// <param name='eventType' locid="WinJS.Promise.removeEventListener_eventType">
                /// The type (name) of the event.
                /// </param>
                /// <param name='listener' locid="WinJS.Promise.removeEventListener_listener">
                /// The listener to remove.
                /// </param>
                /// <param name='capture' locid="WinJS.Promise.removeEventListener_capture">
                /// Specifies whether or not to initiate capture.
                /// </param>
                /// </signature>
                promiseEventListeners.removeEventListener(eventType, listener, capture);
            },
            supportedForProcessing: false,
            then: function Promise_then(value, onComplete, onError, onProgress) {
                /// <signature helpKeyword="WinJS.Promise.then">
                /// <summary locid="WinJS.Promise.then">
                /// A static version of the promise instance method then().
                /// </summary>
                /// <param name="value" locid="WinJS.Promise.then_p:value">
                /// the value to be treated as a promise.
                /// </param>
                /// <param name="onComplete" type="Function" locid="WinJS.Promise.then_p:complete">
                /// The function to be called if the promise is fulfilled with a value.
                /// If it is null, the promise simply
                /// returns the value. The value is passed as the single argument.
                /// </param>
                /// <param name="onError" type="Function" optional="true" locid="WinJS.Promise.then_p:error">
                /// The function to be called if the promise is fulfilled with an error. The error
                /// is passed as the single argument.
                /// </param>
                /// <param name="onProgress" type="Function" optional="true" locid="WinJS.Promise.then_p:progress">
                /// The function to be called if the promise reports progress. Data about the progress
                /// is passed as the single argument. Promises are not required to support
                /// progress.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.then_returnValue">
                /// A promise whose value is the result of executing the provided complete function.
                /// </returns>
                /// </signature>
                return Promise.as(value).then(onComplete, onError, onProgress);
            },
            thenEach: function Promise_thenEach(values, onComplete, onError, onProgress) {
                /// <signature helpKeyword="WinJS.Promise.thenEach">
                /// <summary locid="WinJS.Promise.thenEach">
                /// Performs an operation on all the input promises and returns a promise
                /// that has the shape of the input and contains the result of the operation
                /// that has been performed on each input.
                /// </summary>
                /// <param name="values" locid="WinJS.Promise.thenEach_p:values">
                /// A set of values (which could be either an array or an object) of which some or all are promises.
                /// </param>
                /// <param name="onComplete" type="Function" locid="WinJS.Promise.thenEach_p:complete">
                /// The function to be called if the promise is fulfilled with a value.
                /// If the value is null, the promise returns the value.
                /// The value is passed as the single argument.
                /// </param>
                /// <param name="onError" type="Function" optional="true" locid="WinJS.Promise.thenEach_p:error">
                /// The function to be called if the promise is fulfilled with an error. The error
                /// is passed as the single argument.
                /// </param>
                /// <param name="onProgress" type="Function" optional="true" locid="WinJS.Promise.thenEach_p:progress">
                /// The function to be called if the promise reports progress. Data about the progress
                /// is passed as the single argument. Promises are not required to support
                /// progress.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.thenEach_returnValue">
                /// A promise that is the result of calling Promise.join on the values parameter.
                /// </returns>
                /// </signature>
                var result = Array.isArray(values) ? [] : {};
                Object.keys(values).forEach(function (key) {
                    result[key] = Promise.as(values[key]).then(onComplete, onError, onProgress);
                });
                return Promise.join(result);
            },
            timeout: function Promise_timeout(time, promise) {
                /// <signature helpKeyword="WinJS.Promise.timeout">
                /// <summary locid="WinJS.Promise.timeout">
                /// Creates a promise that is fulfilled after a timeout.
                /// </summary>
                /// <param name="timeout" type="Number" optional="true" locid="WinJS.Promise.timeout_p:timeout">
                /// The timeout period in milliseconds. If this value is zero or not specified
                /// setImmediate is called, otherwise setTimeout is called.
                /// </param>
                /// <param name="promise" type="Promise" optional="true" locid="WinJS.Promise.timeout_p:promise">
                /// A promise that will be canceled if it doesn't complete before the
                /// timeout has expired.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.timeout_returnValue">
                /// A promise that is completed asynchronously after the specified timeout.
                /// </returns>
                /// </signature>
                var to = timeout(time);
                return promise ? timeoutWithPromise(to, promise) : to;
            },
            wrap: function Promise_wrap(value) {
                /// <signature helpKeyword="WinJS.Promise.wrap">
                /// <summary locid="WinJS.Promise.wrap">
                /// Wraps a non-promise value in a promise. You can use this function if you need
                /// to pass a value to a function that requires a promise.
                /// </summary>
                /// <param name="value" locid="WinJS.Promise.wrap_p:value">
                /// Some non-promise value to be wrapped in a promise.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.wrap_returnValue">
                /// A promise that is successfully fulfilled with the specified value
                /// </returns>
                /// </signature>
                return new CompletePromise(value);
            },
            wrapError: function Promise_wrapError(error) {
                /// <signature helpKeyword="WinJS.Promise.wrapError">
                /// <summary locid="WinJS.Promise.wrapError">
                /// Wraps a non-promise error value in a promise. You can use this function if you need
                /// to pass an error to a function that requires a promise.
                /// </summary>
                /// <param name="error" locid="WinJS.Promise.wrapError_p:error">
                /// A non-promise error value to be wrapped in a promise.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.wrapError_returnValue">
                /// A promise that is in an error state with the specified value.
                /// </returns>
                /// </signature>
                return new ErrorPromise(error);
            },

            _veryExpensiveTagWithStack: {
                get: function () { return tagWithStack; },
                set: function (value) { tagWithStack = value; }
            },
            _veryExpensiveTagWithStack_tag: tag,
            _getStack: function () {
                if (Debug.debuggerEnabled) {
                    try { throw new Error(); } catch (e) { return e.stack; }
                }
            },

        }
    );
    Object.defineProperties(Promise, WinJS.Utilities.createEventProperties(errorET));

    var SignalPromise = WinJS.Class.derive(PromiseStateMachine,
        function (cancel) {
            this._oncancel = cancel;
            this._setState(state_created);
            this._run();
        }, {
            _cancelAction: function () { this._oncancel && this._oncancel(); },
            _cleanupAction: function () { this._oncancel = null; }
        }, {
            supportedForProcessing: false
        }
    );

    var Signal = WinJS.Class.define(
        function Signal_ctor(oncancel) {
            this._promise = new SignalPromise(oncancel);
        }, {
            promise: {
                get: function () { return this._promise; }
            },

            cancel: function Signal_cancel() {
                this._promise.cancel();
            },
            complete: function Signal_complete(value) {
                this._promise._completed(value);
            },
            error: function Signal_error(value) {
                this._promise._error(value);
            },
            progress: function Signal_progress(value) {
                this._promise._progress(value);
            }
        }, {
            supportedForProcessing: false,
        }
    );

    // Publish WinJS.Promise
    //
    WinJS.Namespace.define("WinJS", {
        Promise: Promise,
        _Signal: Signal
    });

}(this, this.WinJS));

(function errorsInit(global, WinJS) {
    "use strict";


    WinJS.Namespace.define("WinJS", {
        // ErrorFromName establishes a simple pattern for returning error codes.
        //
        ErrorFromName: WinJS.Class.derive(Error, function (name, message) {
            /// <signature helpKeyword="WinJS.ErrorFromName">
            /// <summary locid="WinJS.ErrorFromName">
            /// Creates an Error object with the specified name and message properties.
            /// </summary>
            /// <param name="name" type="String" locid="WinJS.ErrorFromName_p:name">The name of this error. The name is meant to be consumed programmatically and should not be localized.</param>
            /// <param name="message" type="String" optional="true" locid="WinJS.ErrorFromName_p:message">The message for this error. The message is meant to be consumed by humans and should be localized.</param>
            /// <returns type="Error" locid="WinJS.ErrorFromName_returnValue">Error instance with .name and .message properties populated</returns>
            /// </signature>
            this.name = name;
            this.message = message || name;
        }, {
            /* empty */
        }, {
            supportedForProcessing: false,
        })
    });

})(this, this.WinJS);


(function xhrInit(WinJS) {
    "use strict";


    WinJS.Namespace.define("WinJS", {
        xhr: function (options) {
            /// <signature helpKeyword="WinJS.xhr">
            /// <summary locid="WinJS.xhr">
            /// Wraps calls to XMLHttpRequest in a promise.
            /// </summary>
            /// <param name="options" type="Object" locid="WinJS.xhr_p:options">
            /// The options that are applied to the XMLHttpRequest object. They are: type,
            /// url, user, password, headers, responseType, data, and customRequestInitializer.
            /// </param>
            /// <returns type="WinJS.Promise" locid="WinJS.xhr_returnValue">
            /// A promise that returns the XMLHttpRequest object when it completes.
            /// </returns>
            /// </signature>
            var req;
            return new WinJS.Promise(
                function (c, e, p) {
                    /// <returns value="c(new XMLHttpRequest())" locid="WinJS.xhr.constructor._returnValue" />
                    req = new XMLHttpRequest();
                    req.onreadystatechange = function () {
                        if (req._canceled) { return; }

                        if (req.readyState === 4) {
							// MONACO CHANGE: Handle 1223: http://bugs.jquery.com/ticket/1450
                            if ((req.status >= 200 && req.status < 300) || req.status === 1223) {
                                c(req);
                            } else {
                                e(req);
                            }
                            req.onreadystatechange = function () { };
                        } else {
                            p(req);
                        }
                    };

                    req.open(
                        options.type || "GET",
                        options.url,
                        // Promise based XHR does not support sync.
                        //
                        true,
                        options.user,
                        options.password
                    );
                    req.responseType = options.responseType || "";

                    Object.keys(options.headers || {}).forEach(function (k) {
                        req.setRequestHeader(k, options.headers[k]);
                    });

                    if (options.customRequestInitializer) {
                        options.customRequestInitializer(req);
                    }

                    req.send(options.data);
                },
                function () {
                    req._canceled = true;
                    req.abort();
                }
            );
        }
    });

})(this.WinJS);


(function safeHTMLInit(global, WinJS, undefined) {
    "use strict";


    var setInnerHTML,
        setInnerHTMLUnsafe,
        setOuterHTML,
        setOuterHTMLUnsafe,
        insertAdjacentHTML,
        insertAdjacentHTMLUnsafe;

    var strings = {
		// MONACO CHANGE
        //get nonStaticHTML() { return WinJS.Resources._getWinJSString("base/nonStaticHTML").value; },
		nonStaticHTML: "Unable to add dynamic content. A script attempted to inject dynamic content, or elements previously modified dynamically, that might be unsafe. For example, using the innerHTML property or the document.write method to add a script element will generate this exception. If the content is safe and from a trusted source, use a method to explicitly manipulate elements and attributes, such as createElement, or use setInnerHTMLUnsafe (or other unsafe method)."
    };

    setInnerHTML = setInnerHTMLUnsafe = function (element, text) {
        /// <signature helpKeyword="WinJS.Utilities.setInnerHTML">
        /// <summary locid="WinJS.Utilities.setInnerHTML">
        /// Sets the innerHTML property of the specified element to the specified text.
        /// </summary>
        /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.setInnerHTML_p:element">
        /// The element on which the innerHTML property is to be set.
        /// </param>
        /// <param name="text" type="String" locid="WinJS.Utilities.setInnerHTML_p:text">
        /// The value to be set to the innerHTML property.
        /// </param>
        /// </signature>
        element.innerHTML = text;
    };
    setOuterHTML = setOuterHTMLUnsafe = function (element, text) {
        /// <signature helpKeyword="WinJS.Utilities.setOuterHTML">
        /// <summary locid="WinJS.Utilities.setOuterHTML">
        /// Sets the outerHTML property of the specified element to the specified text.
        /// </summary>
        /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.setOuterHTML_p:element">
        /// The element on which the outerHTML property is to be set.
        /// </param>
        /// <param name="text" type="String" locid="WinJS.Utilities.setOuterHTML_p:text">
        /// The value to be set to the outerHTML property.
        /// </param>
        /// </signature>
        element.outerHTML = text;
    };
    insertAdjacentHTML = insertAdjacentHTMLUnsafe = function (element, position, text) {
        /// <signature helpKeyword="WinJS.Utilities.insertAdjacentHTML">
        /// <summary locid="WinJS.Utilities.insertAdjacentHTML">
        /// Calls insertAdjacentHTML on the specified element.
        /// </summary>
        /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.insertAdjacentHTML_p:element">
        /// The element on which insertAdjacentHTML is to be called.
        /// </param>
        /// <param name="position" type="String" locid="WinJS.Utilities.insertAdjacentHTML_p:position">
        /// The position relative to the element at which to insert the HTML.
        /// </param>
        /// <param name="text" type="String" locid="WinJS.Utilities.insertAdjacentHTML_p:text">
        /// The value to be provided to insertAdjacentHTML.
        /// </param>
        /// </signature>
        element.insertAdjacentHTML(position, text);
    };

    var msApp = global.MSApp;
    if (msApp) {
        setInnerHTMLUnsafe = function (element, text) {
            /// <signature helpKeyword="WinJS.Utilities.setInnerHTMLUnsafe">
            /// <summary locid="WinJS.Utilities.setInnerHTMLUnsafe">
            /// Sets the innerHTML property of the specified element to the specified text.
            /// </summary>
            /// <param name='element' type='HTMLElement' locid="WinJS.Utilities.setInnerHTMLUnsafe_p:element">
            /// The element on which the innerHTML property is to be set.
            /// </param>
            /// <param name='text' type="String" locid="WinJS.Utilities.setInnerHTMLUnsafe_p:text">
            /// The value to be set to the innerHTML property.
            /// </param>
            /// </signature>
            msApp.execUnsafeLocalFunction(function () {
                element.innerHTML = text;
            });
        };
        setOuterHTMLUnsafe = function (element, text) {
            /// <signature helpKeyword="WinJS.Utilities.setOuterHTMLUnsafe">
            /// <summary locid="WinJS.Utilities.setOuterHTMLUnsafe">
            /// Sets the outerHTML property of the specified element to the specified text
            /// in the context of msWWA.execUnsafeLocalFunction.
            /// </summary>
            /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.setOuterHTMLUnsafe_p:element">
            /// The element on which the outerHTML property is to be set.
            /// </param>
            /// <param name="text" type="String" locid="WinJS.Utilities.setOuterHTMLUnsafe_p:text">
            /// The value to be set to the outerHTML property.
            /// </param>
            /// </signature>
            msApp.execUnsafeLocalFunction(function () {
                element.outerHTML = text;
            });
        };
        insertAdjacentHTMLUnsafe = function (element, position, text) {
            /// <signature helpKeyword="WinJS.Utilities.insertAdjacentHTMLUnsafe">
            /// <summary locid="WinJS.Utilities.insertAdjacentHTMLUnsafe">
            /// Calls insertAdjacentHTML on the specified element in the context
            /// of msWWA.execUnsafeLocalFunction.
            /// </summary>
            /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.insertAdjacentHTMLUnsafe_p:element">
            /// The element on which insertAdjacentHTML is to be called.
            /// </param>
            /// <param name="position" type="String" locid="WinJS.Utilities.insertAdjacentHTMLUnsafe_p:position">
            /// The position relative to the element at which to insert the HTML.
            /// </param>
            /// <param name="text" type="String" locid="WinJS.Utilities.insertAdjacentHTMLUnsafe_p:text">
            /// Value to be provided to insertAdjacentHTML.
            /// </param>
            /// </signature>
            msApp.execUnsafeLocalFunction(function () {
                element.insertAdjacentHTML(position, text);
            });
        };
    }
    else if (global.msIsStaticHTML) {
        var check = function (str) {
            if (!global.msIsStaticHTML(str)) {
                throw new WinJS.ErrorFromName("WinJS.Utitilies.NonStaticHTML", strings.nonStaticHTML);
            }
        }
        // If we ever get isStaticHTML we can attempt to recreate the behavior we have in the local
        // compartment, in the mean-time all we can do is sanitize the input.
        //
        setInnerHTML = function (element, text) {
            /// <signature helpKeyword="WinJS.Utilities.setInnerHTML">
            /// <summary locid="WinJS.Utilities.msIsStaticHTML.setInnerHTML">
            /// Sets the innerHTML property of a element to the specified text
            /// if it passes a msIsStaticHTML check.
            /// </summary>
            /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.msIsStaticHTML.setInnerHTML_p:element">
            /// The element on which the innerHTML property is to be set.
            /// </param>
            /// <param name="text" type="String" locid="WinJS.Utilities.msIsStaticHTML.setInnerHTML_p:text">
            /// The value to be set to the innerHTML property.
            /// </param>
            /// </signature>
            check(text);
            element.innerHTML = text;
        };
        setOuterHTML = function (element, text) {
            /// <signature helpKeyword="WinJS.Utilities.setOuterHTML">
            /// <summary locid="WinJS.Utilities.msIsStaticHTML.setOuterHTML">
            /// Sets the outerHTML property of a element to the specified text
            /// if it passes a msIsStaticHTML check.
            /// </summary>
            /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.msIsStaticHTML.setOuterHTML_p:element">
            /// The element on which the outerHTML property is to be set.
            /// </param>
            /// <param name="text" type="String" locid="WinJS.Utilities.msIsStaticHTML.setOuterHTML_p:text">
            /// The value to be set to the outerHTML property.
            /// </param>
            /// </signature>
            check(text);
            element.outerHTML = text;
        };
        insertAdjacentHTML = function (element, position, text) {
            /// <signature helpKeyword="WinJS.Utilities.insertAdjacentHTML">
            /// <summary locid="WinJS.Utilities.msIsStaticHTML.insertAdjacentHTML">
            /// Calls insertAdjacentHTML on the element if it passes
            /// a msIsStaticHTML check.
            /// </summary>
            /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.msIsStaticHTML.insertAdjacentHTML_p:element">
            /// The element on which insertAdjacentHTML is to be called.
            /// </param>
            /// <param name="position" type="String" locid="WinJS.Utilities.msIsStaticHTML.insertAdjacentHTML_p:position">
            /// The position relative to the element at which to insert the HTML.
            /// </param>
            /// <param name="text" type="String" locid="WinJS.Utilities.msIsStaticHTML.insertAdjacentHTML_p:text">
            /// The value to be provided to insertAdjacentHTML.
            /// </param>
            /// </signature>
            check(text);
            element.insertAdjacentHTML(position, text);
        };
    }

    WinJS.Namespace.define("WinJS.Utilities", {
        setInnerHTML: setInnerHTML,
        setInnerHTMLUnsafe: setInnerHTMLUnsafe,
        setOuterHTML: setOuterHTML,
        setOuterHTMLUnsafe: setOuterHTMLUnsafe,
        insertAdjacentHTML: insertAdjacentHTML,
        insertAdjacentHTMLUnsafe: insertAdjacentHTMLUnsafe
    });

}(this, this.WinJS));



// MONACO CHANGE
} // if (typeof WinJS === 'undefined')

(function(global) {

    if (typeof exports === 'undefined' && typeof define === 'function' && define.amd) {
        define("vs/base/common/winjs.base.raw", global.WinJS);
    } else {
        module.exports = global.WinJS;
    }

})(this);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/node/flow", ["require", "exports", 'assert'], function (require, exports, assert) {
    'use strict';
    /**
     * Executes the given function (fn) over the given array of items (list) in parallel and returns the resulting errors and results as
     * array to the callback (callback). The resulting errors and results are evaluated by calling the provided callback function.
     */
    function parallel(list, fn, callback) {
        var results = new Array(list.length);
        var errors = new Array(list.length);
        var didErrorOccur = false;
        var doneCount = 0;
        if (list.length === 0) {
            return callback(null, []);
        }
        list.forEach(function (item, index) {
            fn(item, function (error, result) {
                if (error) {
                    didErrorOccur = true;
                    results[index] = null;
                    errors[index] = error;
                }
                else {
                    results[index] = result;
                    errors[index] = null;
                }
                if (++doneCount === list.length) {
                    return callback(didErrorOccur ? errors : null, results);
                }
            });
        });
    }
    exports.parallel = parallel;
    function loop(param, fn, callback) {
        // Assert
        assert.ok(param, 'Missing first parameter');
        assert.ok(typeof (fn) === 'function', 'Second parameter must be a function that is called for each element');
        assert.ok(typeof (callback) === 'function', 'Third parameter must be a function that is called on error and success');
        // Param is function, execute to retrieve array
        if (typeof (param) === 'function') {
            try {
                param(function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        loop(result, fn, callback);
                    }
                });
            }
            catch (error) {
                callback(error, null);
            }
        }
        else {
            var results_1 = [];
            var looper_1 = function (i) {
                // Still work to do
                if (i < param.length) {
                    // Execute function on array element
                    try {
                        fn(param[i], function (error, result) {
                            // A method might only send a boolean value as return value (e.g. fs.exists), support this case gracefully
                            if (error === true || error === false) {
                                result = error;
                                error = null;
                            }
                            // Quit looping on error
                            if (error) {
                                callback(error, null);
                            }
                            else {
                                if (result) {
                                    results_1.push(result);
                                }
                                process.nextTick(function () {
                                    looper_1(i + 1);
                                });
                            }
                        }, i, param.length);
                    }
                    catch (error) {
                        callback(error, null);
                    }
                }
                else {
                    callback(null, results_1);
                }
            };
            // Start looping with first element in array
            looper_1(0);
        }
    }
    exports.loop = loop;
    function Sequence(sequences) {
        // Assert
        assert.ok(sequences.length > 1, 'Need at least one error handler and one function to process sequence');
        sequences.forEach(function (sequence) {
            assert.ok(typeof (sequence) === 'function');
        });
        // Execute in Loop
        var errorHandler = sequences.splice(0, 1)[0]; //Remove error handler
        var sequenceResult = null;
        loop(sequences, function (sequence, clb) {
            var sequenceFunction = function (error, result) {
                // A method might only send a boolean value as return value (e.g. fs.exists), support this case gracefully
                if (error === true || error === false) {
                    result = error;
                    error = null;
                }
                // Handle Error and Result
                if (error) {
                    clb(error, null);
                }
                else {
                    sequenceResult = result; //Remember result of sequence
                    clb(null, null); //Don't pass on result to Looper as we are not aggregating it
                }
            };
            // We call the sequence function setting "this" to be the callback we define here
            // and we pass in the "sequenceResult" as first argument. Doing all this avoids having
            // to pass in a callback to the sequence because the callback is already "this".
            try {
                sequence.call(sequenceFunction, sequenceResult);
            }
            catch (error) {
                clb(error, null);
            }
        }, function (error, result) {
            if (error) {
                errorHandler(error);
            }
        });
    }
    function sequence(sequences) {
        Sequence((Array.isArray(sequences)) ? sequences : Array.prototype.slice.call(arguments));
    }
    exports.sequence = sequence;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/node/extfs", ["require", "exports", 'vs/base/common/uuid', 'vs/base/common/strings', 'vs/base/common/platform', 'vs/base/node/flow', 'fs', 'path'], function (require, exports, uuid, strings, platform, flow, fs, paths) {
    'use strict';
    var loop = flow.loop;
    function readdir(path, callback) {
        // Mac: uses NFD unicode form on disk, but we want NFC
        // See also https://github.com/nodejs/node/issues/2165
        if (platform.isMacintosh) {
            return readdirNormalize(path, function (error, children) {
                if (error) {
                    return callback(error, null);
                }
                return callback(null, children.map(function (c) { return strings.normalizeNFC(c); }));
            });
        }
        return readdirNormalize(path, callback);
    }
    exports.readdir = readdir;
    function readdirNormalize(path, callback) {
        fs.readdir(path, function (error, children) {
            if (error) {
                return callback(error, null);
            }
            // Bug in node: In some environments we get "." and ".." as entries from the call to readdir().
            // For example Sharepoint via WebDav on Windows includes them. We never want those
            // entries in the result set though because they are not valid children of the folder
            // for our concerns.
            // See https://github.com/nodejs/node/issues/4002
            return callback(null, children.filter(function (c) { return c !== '.' && c !== '..'; }));
        });
    }
    function mkdirp(path, mode, callback) {
        fs.exists(path, function (exists) {
            if (exists) {
                return isDirectory(path, function (err, itIs) {
                    if (err) {
                        return callback(err);
                    }
                    if (!itIs) {
                        return callback(new Error('"' + path + '" is not a directory.'));
                    }
                    callback(null);
                });
            }
            mkdirp(paths.dirname(path), mode, function (err) {
                if (err) {
                    callback(err);
                    return;
                }
                if (mode) {
                    fs.mkdir(path, mode, function (error) {
                        if (error) {
                            return callback(error);
                        }
                        fs.chmod(path, mode, callback); // we need to explicitly chmod because of https://github.com/nodejs/node/issues/1104
                    });
                }
                else {
                    fs.mkdir(path, null, callback);
                }
            });
        });
    }
    exports.mkdirp = mkdirp;
    function isDirectory(path, callback) {
        fs.stat(path, function (error, stat) {
            if (error) {
                return callback(error);
            }
            callback(null, stat.isDirectory());
        });
    }
    function copy(source, target, callback, copiedSources) {
        if (!copiedSources) {
            copiedSources = Object.create(null);
        }
        fs.stat(source, function (error, stat) {
            if (error) {
                return callback(error);
            }
            if (!stat.isDirectory()) {
                return pipeFs(source, target, stat.mode & 511, callback);
            }
            if (copiedSources[source]) {
                return callback(null); // escape when there are cycles (can happen with symlinks)
            }
            else {
                copiedSources[source] = true; // remember as copied
            }
            mkdirp(target, stat.mode & 511, function (err) {
                readdir(source, function (err, files) {
                    loop(files, function (file, clb) {
                        copy(paths.join(source, file), paths.join(target, file), clb, copiedSources);
                    }, callback);
                });
            });
        });
    }
    exports.copy = copy;
    function pipeFs(source, target, mode, callback) {
        var callbackHandled = false;
        var readStream = fs.createReadStream(source);
        var writeStream = fs.createWriteStream(target, { mode: mode });
        var onError = function (error) {
            if (!callbackHandled) {
                callbackHandled = true;
                callback(error);
            }
        };
        readStream.on('error', onError);
        writeStream.on('error', onError);
        readStream.on('end', function () {
            writeStream.end(function () {
                if (!callbackHandled) {
                    callbackHandled = true;
                    fs.chmod(target, mode, callback); // we need to explicitly chmod because of https://github.com/nodejs/node/issues/1104
                }
            });
        });
        // In node 0.8 there is no easy way to find out when the pipe operation has finished. As such, we use the end property = false
        // so that we are in charge of calling end() on the write stream and we will be notified when the write stream is really done.
        // We can do this because file streams have an end() method that allows to pass in a callback.
        // In node 0.10 there is an event 'finish' emitted from the write stream that can be used. See
        // https://groups.google.com/forum/?fromgroups=#!topic/nodejs/YWQ1sRoXOdI
        readStream.pipe(writeStream, { end: false });
    }
    // Deletes the given path by first moving it out of the workspace. This has two benefits. For one, the operation can return fast because
    // after the rename, the contents are out of the workspace although not yet deleted. The greater benefit however is that this operation
    // will fail in case any file is used by another process. fs.unlink() in node will not bail if a file unlinked is used by another process.
    // However, the consequences are bad as outlined in all the related bugs from https://github.com/joyent/node/issues/7164
    function del(path, tmpFolder, callback, done) {
        fs.exists(path, function (exists) {
            if (!exists) {
                return callback(null);
            }
            fs.stat(path, function (err, stat) {
                if (err || !stat) {
                    return callback(err);
                }
                // Special windows workaround: A file or folder that ends with a "." cannot be moved to another place
                // because it is not a valid file name. In this case, we really have to do the deletion without prior move.
                if (path[path.length - 1] === '.' || strings.endsWith(path, './') || strings.endsWith(path, '.\\')) {
                    return rmRecursive(path, callback);
                }
                var pathInTemp = paths.join(tmpFolder, uuid.generateUuid());
                fs.rename(path, pathInTemp, function (error) {
                    if (error) {
                        return rmRecursive(path, callback); // if rename fails, delete without tmp dir
                    }
                    // Return early since the move succeeded
                    callback(null);
                    // do the heavy deletion outside the callers callback
                    rmRecursive(pathInTemp, function (error) {
                        if (error) {
                            console.error(error);
                        }
                        if (done) {
                            done(error);
                        }
                    });
                });
            });
        });
    }
    exports.del = del;
    function rmRecursive(path, callback) {
        if (path === '\\' || path === '/') {
            return callback(new Error('Will not delete root!'));
        }
        fs.exists(path, function (exists) {
            if (!exists) {
                callback(null);
            }
            else {
                fs.lstat(path, function (err, stat) {
                    if (err || !stat) {
                        callback(err);
                    }
                    else if (!stat.isDirectory() || stat.isSymbolicLink() /* !!! never recurse into links when deleting !!! */) {
                        var mode = stat.mode;
                        if (!(mode & 128)) {
                            fs.chmod(path, mode | 128, function (err) {
                                if (err) {
                                    callback(err);
                                }
                                else {
                                    fs.unlink(path, callback);
                                }
                            });
                        }
                        else {
                            fs.unlink(path, callback);
                        }
                    }
                    else {
                        readdir(path, function (err, children) {
                            if (err || !children) {
                                callback(err);
                            }
                            else if (children.length === 0) {
                                fs.rmdir(path, callback);
                            }
                            else {
                                var firstError_1 = null;
                                var childrenLeft_1 = children.length;
                                children.forEach(function (child) {
                                    rmRecursive(paths.join(path, child), function (err) {
                                        childrenLeft_1--;
                                        if (err) {
                                            firstError_1 = firstError_1 || err;
                                        }
                                        if (childrenLeft_1 === 0) {
                                            if (firstError_1) {
                                                callback(firstError_1);
                                            }
                                            else {
                                                fs.rmdir(path, callback);
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    function mv(source, target, callback) {
        if (source === target) {
            return callback(null);
        }
        function updateMtime(err) {
            if (err) {
                return callback(err);
            }
            fs.stat(target, function (error, stat) {
                if (error) {
                    return callback(error);
                }
                if (stat.isDirectory()) {
                    return callback(null);
                }
                fs.open(target, 'a', null, function (err, fd) {
                    if (err) {
                        return callback(err);
                    }
                    fs.futimes(fd, stat.atime, new Date(), function (err) {
                        if (err) {
                            return callback(err);
                        }
                        fs.close(fd, callback);
                    });
                });
            });
        }
        // Try native rename()
        fs.rename(source, target, function (err) {
            if (!err) {
                return updateMtime(null);
            }
            // In two cases we fallback to classic copy and delete:
            //
            // 1.) The EXDEV error indicates that source and target are on different devices
            // In this case, fallback to using a copy() operation as there is no way to
            // rename() between different devices.
            //
            // 2.) The user tries to rename a file/folder that ends with a dot. This is not
            // really possible to move then, at least on UNC devices.
            if (err && source.toLowerCase() !== target.toLowerCase() && (err.code === 'EXDEV') || strings.endsWith(source, '.')) {
                return copy(source, target, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    rmRecursive(source, updateMtime);
                });
            }
            return callback(err);
        });
    }
    exports.mv = mv;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/node/proxy", ["require", "exports", 'url', 'vs/base/common/types', 'http-proxy-agent', 'https-proxy-agent'], function (require, exports, url_1, types_1, HttpProxyAgent, HttpsProxyAgent) {
    'use strict';
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
        var requestURL = url_1.parse(rawRequestURL);
        var proxyURL = options.proxyUrl || getSystemProxyURI(requestURL);
        if (!proxyURL) {
            return null;
        }
        var proxyEndpoint = url_1.parse(proxyURL);
        if (!/^https?:$/.test(proxyEndpoint.protocol)) {
            return null;
        }
        var opts = {
            host: proxyEndpoint.hostname,
            port: Number(proxyEndpoint.port),
            auth: proxyEndpoint.auth,
            rejectUnauthorized: types_1.isBoolean(options.strictSSL) ? options.strictSSL : true
        };
        return requestURL.protocol === 'http:' ? new HttpProxyAgent(opts) : new HttpsProxyAgent(opts);
    }
    exports.getProxyAgent = getProxyAgent;
});

define("vs/nls!vs/base/common/errors",['vs/nls', 'vs/nls!vs/workbench/electron-main/main'], function(nls, data) { return nls.create("vs/base/common/errors", data); });
define("vs/base/common/errors", ["require", "exports", 'vs/nls!vs/base/common/errors', 'vs/base/common/objects', 'vs/base/common/platform', 'vs/base/common/types', 'vs/base/common/arrays', 'vs/base/common/strings'], function (require, exports, nls, objects, platform, types, arrays, strings) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // Avoid circular dependency on EventEmitter by implementing a subset of the interface.
    var ErrorHandler = (function () {
        function ErrorHandler() {
            this.listeners = [];
            this.unexpectedErrorHandler = function (e) {
                platform.setTimeout(function () {
                    if (e.stack) {
                        throw new Error(e.message + '\n\n' + e.stack);
                    }
                    throw e;
                }, 0);
            };
        }
        ErrorHandler.prototype.addListener = function (listener) {
            var _this = this;
            this.listeners.push(listener);
            return function () {
                _this._removeListener(listener);
            };
        };
        ErrorHandler.prototype.emit = function (e) {
            this.listeners.forEach(function (listener) {
                listener(e);
            });
        };
        ErrorHandler.prototype._removeListener = function (listener) {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        };
        ErrorHandler.prototype.setUnexpectedErrorHandler = function (newUnexpectedErrorHandler) {
            this.unexpectedErrorHandler = newUnexpectedErrorHandler;
        };
        ErrorHandler.prototype.getUnexpectedErrorHandler = function () {
            return this.unexpectedErrorHandler;
        };
        ErrorHandler.prototype.onUnexpectedError = function (e) {
            this.unexpectedErrorHandler(e);
            this.emit(e);
        };
        return ErrorHandler;
    }());
    exports.ErrorHandler = ErrorHandler;
    exports.errorHandler = new ErrorHandler();
    function setUnexpectedErrorHandler(newUnexpectedErrorHandler) {
        exports.errorHandler.setUnexpectedErrorHandler(newUnexpectedErrorHandler);
    }
    exports.setUnexpectedErrorHandler = setUnexpectedErrorHandler;
    function onUnexpectedError(e) {
        // ignore errors from cancelled promises
        if (!isPromiseCanceledError(e)) {
            exports.errorHandler.onUnexpectedError(e);
        }
    }
    exports.onUnexpectedError = onUnexpectedError;
    function onUnexpectedPromiseError(promise) {
        return promise.then(null, onUnexpectedError);
    }
    exports.onUnexpectedPromiseError = onUnexpectedPromiseError;
    function transformErrorForSerialization(error) {
        if (error instanceof Error) {
            var name_1 = error.name, message = error.message;
            var stack = error.stacktrace || error.stack;
            return {
                $isError: true,
                name: name_1,
                message: message,
                stack: stack
            };
        }
        // return as is
        return error;
    }
    exports.transformErrorForSerialization = transformErrorForSerialization;
    /**
     * The base class for all connection errors originating from XHR requests.
     */
    var ConnectionError = (function () {
        function ConnectionError(arg) {
            this.status = arg.status;
            this.statusText = arg.statusText;
            this.name = 'ConnectionError';
            try {
                this.responseText = arg.responseText;
            }
            catch (e) {
                this.responseText = '';
            }
            this.errorMessage = null;
            this.errorCode = null;
            this.errorObject = null;
            if (this.responseText) {
                try {
                    var errorObj = JSON.parse(this.responseText);
                    this.errorMessage = errorObj.message;
                    this.errorCode = errorObj.code;
                    this.errorObject = errorObj;
                }
                catch (error) {
                }
            }
        }
        Object.defineProperty(ConnectionError.prototype, "message", {
            get: function () {
                return this.connectionErrorToMessage(this, false);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionError.prototype, "verboseMessage", {
            get: function () {
                return this.connectionErrorToMessage(this, true);
            },
            enumerable: true,
            configurable: true
        });
        ConnectionError.prototype.connectionErrorDetailsToMessage = function (error, verbose) {
            var errorCode = error.errorCode;
            var errorMessage = error.errorMessage;
            if (errorCode !== null && errorMessage !== null) {
                return nls.localize(0, null, strings.rtrim(errorMessage, '.'), errorCode);






            }
            if (errorMessage !== null) {
                return errorMessage;
            }
            if (verbose && error.responseText !== null) {
                return error.responseText;
            }
            return null;
        };
        ConnectionError.prototype.connectionErrorToMessage = function (error, verbose) {
            var details = this.connectionErrorDetailsToMessage(error, verbose);
            // Status Code based Error
            if (error.status === 401) {
                if (details !== null) {
                    return nls.localize(1, null, details);





                }
                return nls.localize(2, null);
            }
            // Return error details if present
            if (details) {
                return details;
            }
            // Fallback to HTTP Status and Code
            if (error.status > 0 && error.statusText !== null) {
                if (verbose && error.responseText !== null && error.responseText.length > 0) {
                    return nls.localize(3, null, error.statusText, error.status, error.responseText);
                }
                return nls.localize(4, null, error.statusText, error.status);
            }
            // Finally its an Unknown Connection Error
            if (verbose && error.responseText !== null && error.responseText.length > 0) {
                return nls.localize(5, null, error.responseText);
            }
            return nls.localize(6, null);
        };
        return ConnectionError;
    }());
    exports.ConnectionError = ConnectionError;
    // Bug: Can not subclass a JS Type. Do it manually (as done in WinJS.Class.derive)
    objects.derive(Error, ConnectionError);
    function xhrToErrorMessage(xhr, verbose) {
        var ce = new ConnectionError(xhr);
        if (verbose) {
            return ce.verboseMessage;
        }
        else {
            return ce.message;
        }
    }
    function exceptionToErrorMessage(exception, verbose) {
        if (exception.message) {
            if (verbose && (exception.stack || exception.stacktrace)) {
                return nls.localize(7, null, detectSystemErrorMessage(exception), exception.stack || exception.stacktrace);
            }
            return detectSystemErrorMessage(exception);
        }
        return nls.localize(8, null);
    }
    function detectSystemErrorMessage(exception) {
        // See https://nodejs.org/api/errors.html#errors_class_system_error
        if (typeof exception.code === 'string' && typeof exception.errno === 'number' && typeof exception.syscall === 'string') {
            return nls.localize(9, null, exception.message);
        }
        return exception.message;
    }
    /**
     * Tries to generate a human readable error message out of the error. If the verbose parameter
     * is set to true, the error message will include stacktrace details if provided.
     * @returns A string containing the error message.
     */
    function toErrorMessage(error, verbose) {
        if (error === void 0) { error = null; }
        if (verbose === void 0) { verbose = false; }
        if (!error) {
            return nls.localize(10, null);
        }
        if (Array.isArray(error)) {
            var errors = arrays.coalesce(error);
            var msg = toErrorMessage(errors[0], verbose);
            if (errors.length > 1) {
                return nls.localize(11, null, msg, errors.length);
            }
            return msg;
        }
        if (types.isString(error)) {
            return error;
        }
        if (!types.isUndefinedOrNull(error.status)) {
            return xhrToErrorMessage(error, verbose);
        }
        if (error.detail) {
            var detail = error.detail;
            if (detail.error) {
                if (detail.error && !types.isUndefinedOrNull(detail.error.status)) {
                    return xhrToErrorMessage(detail.error, verbose);
                }
                if (types.isArray(detail.error)) {
                    for (var i = 0; i < detail.error.length; i++) {
                        if (detail.error[i] && !types.isUndefinedOrNull(detail.error[i].status)) {
                            return xhrToErrorMessage(detail.error[i], verbose);
                        }
                    }
                }
                else {
                    return exceptionToErrorMessage(detail.error, verbose);
                }
            }
            if (detail.exception) {
                if (!types.isUndefinedOrNull(detail.exception.status)) {
                    return xhrToErrorMessage(detail.exception, verbose);
                }
                return exceptionToErrorMessage(detail.exception, verbose);
            }
        }
        if (error.stack) {
            return exceptionToErrorMessage(error, verbose);
        }
        if (error.message) {
            return error.message;
        }
        return nls.localize(12, null);
    }
    exports.toErrorMessage = toErrorMessage;
    var canceledName = 'Canceled';
    /**
     * Checks if the given error is a promise in canceled state
     */
    function isPromiseCanceledError(error) {
        return error instanceof Error && error.name === canceledName && error.message === canceledName;
    }
    exports.isPromiseCanceledError = isPromiseCanceledError;
    /**
     * Returns an error that signals cancellation.
     */
    function canceled() {
        var error = new Error(canceledName);
        error.name = error.message;
        return error;
    }
    exports.canceled = canceled;
    /**
     * Returns an error that signals something is not implemented.
     */
    function notImplemented() {
        return new Error(nls.localize(13, null));
    }
    exports.notImplemented = notImplemented;
    function illegalArgument(name) {
        if (name) {
            return new Error(nls.localize(14, null, name));
        }
        else {
            return new Error(nls.localize(15, null));
        }
    }
    exports.illegalArgument = illegalArgument;
    function illegalState(name) {
        if (name) {
            return new Error(nls.localize(16, null, name));
        }
        else {
            return new Error(nls.localize(17, null));
        }
    }
    exports.illegalState = illegalState;
    function readonly() {
        return new Error('readonly property cannot be changed');
    }
    exports.readonly = readonly;
    function loaderError(err) {
        if (platform.isWeb) {
            return new Error(nls.localize(18, null));
        }
        return new Error(nls.localize(19, null, JSON.stringify(err)));
    }
    exports.loaderError = loaderError;
    function create(message, options) {
        if (options === void 0) { options = {}; }
        var result = new Error(message);
        if (types.isNumber(options.severity)) {
            result.severity = options.severity;
        }
        if (options.actions) {
            result.actions = options.actions;
        }
        return result;
    }
    exports.create = create;
});

define("vs/base/common/callbackList", ["require", "exports", 'vs/base/common/errors'], function (require, exports, errors_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var CallbackList = (function () {
        function CallbackList() {
        }
        CallbackList.prototype.add = function (callback, context, bucket) {
            var _this = this;
            if (context === void 0) { context = null; }
            if (!this._callbacks) {
                this._callbacks = [];
                this._contexts = [];
            }
            this._callbacks.push(callback);
            this._contexts.push(context);
            if (Array.isArray(bucket)) {
                bucket.push({ dispose: function () { return _this.remove(callback, context); } });
            }
        };
        CallbackList.prototype.remove = function (callback, context) {
            if (context === void 0) { context = null; }
            if (!this._callbacks) {
                return;
            }
            var foundCallbackWithDifferentContext = false;
            for (var i = 0, len = this._callbacks.length; i < len; i++) {
                if (this._callbacks[i] === callback) {
                    if (this._contexts[i] === context) {
                        // callback & context match => remove it
                        this._callbacks.splice(i, 1);
                        this._contexts.splice(i, 1);
                        return;
                    }
                    else {
                        foundCallbackWithDifferentContext = true;
                    }
                }
            }
            if (foundCallbackWithDifferentContext) {
                throw new Error('When adding a listener with a context, you should remove it with the same context');
            }
        };
        CallbackList.prototype.invoke = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (!this._callbacks) {
                return;
            }
            var ret = [], callbacks = this._callbacks.slice(0), contexts = this._contexts.slice(0);
            for (var i = 0, len = callbacks.length; i < len; i++) {
                try {
                    ret.push(callbacks[i].apply(contexts[i], args));
                }
                catch (e) {
                    errors_1.onUnexpectedError(e);
                }
            }
            return ret;
        };
        CallbackList.prototype.isEmpty = function () {
            return !this._callbacks || this._callbacks.length === 0;
        };
        CallbackList.prototype.dispose = function () {
            this._callbacks = undefined;
            this._contexts = undefined;
        };
        return CallbackList;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CallbackList;
});

define("vs/base/common/event", ["require", "exports", 'vs/base/common/callbackList'], function (require, exports, callbackList_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var Event;
    (function (Event) {
        var _disposable = { dispose: function () { } };
        Event.None = function () { return _disposable; };
    })(Event || (Event = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Event;
    /**
     * The Emitter can be used to expose an Event to the public
     * to fire it from the insides.
     * Sample:
        class Document {
    
            private _onDidChange = new Emitter<(value:string)=>any>();
    
            public onDidChange = this._onDidChange.event;
    
            // getter-style
            // get onDidChange(): Event<(value:string)=>any> {
            // 	return this._onDidChange.event;
            // }
    
            private _doIt() {
                //...
                this._onDidChange.fire(value);
            }
        }
     */
    var Emitter = (function () {
        function Emitter(_options) {
            this._options = _options;
        }
        Object.defineProperty(Emitter.prototype, "event", {
            /**
             * For the public to allow to subscribe
             * to events from this Emitter
             */
            get: function () {
                var _this = this;
                if (!this._event) {
                    this._event = function (listener, thisArgs, disposables) {
                        if (!_this._callbacks) {
                            _this._callbacks = new callbackList_1.default();
                        }
                        if (_this._options && _this._options.onFirstListenerAdd && _this._callbacks.isEmpty()) {
                            _this._options.onFirstListenerAdd(_this);
                        }
                        _this._callbacks.add(listener, thisArgs);
                        var result;
                        result = {
                            dispose: function () {
                                result.dispose = Emitter._noop;
                                if (!_this._disposed) {
                                    _this._callbacks.remove(listener, thisArgs);
                                    if (_this._options && _this._options.onLastListenerRemove && _this._callbacks.isEmpty()) {
                                        _this._options.onLastListenerRemove(_this);
                                    }
                                }
                            }
                        };
                        if (Array.isArray(disposables)) {
                            disposables.push(result);
                        }
                        return result;
                    };
                }
                return this._event;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * To be kept private to fire an event to
         * subscribers
         */
        Emitter.prototype.fire = function (event) {
            if (this._callbacks) {
                this._callbacks.invoke.call(this._callbacks, event);
            }
        };
        Emitter.prototype.dispose = function () {
            if (this._callbacks) {
                this._callbacks.dispose();
                this._callbacks = undefined;
                this._disposed = true;
            }
        };
        Emitter._noop = function () { };
        return Emitter;
    }());
    exports.Emitter = Emitter;
    /**
     * Creates an Event which is backed-up by the event emitter. This allows
     * to use the existing eventing pattern and is likely using less memory.
     * Sample:
     *
     * 	class Document {
     *
     *		private _eventbus = new EventEmitter();
     *
     *		public onDidChange = fromEventEmitter(this._eventbus, 'changed');
     *
     *		// getter-style
     *		// get onDidChange(): Event<(value:string)=>any> {
     *		// 	cache fromEventEmitter result and return
     *		// }
     *
     *		private _doIt() {
     *			// ...
     *			this._eventbus.emit('changed', value)
     *		}
     *	}
     */
    function fromEventEmitter(emitter, eventType) {
        return function (listener, thisArgs, disposables) {
            var result = emitter.addListener2(eventType, function () {
                listener.apply(thisArgs, arguments);
            });
            if (Array.isArray(disposables)) {
                disposables.push(result);
            }
            return result;
        };
    }
    exports.fromEventEmitter = fromEventEmitter;
    function mapEvent(event, map) {
        return function (listener, thisArgs, disposables) {
            return event(function (i) { return listener(map(i)); }, thisArgs, disposables);
        };
    }
    exports.mapEvent = mapEvent;
    var EventDelayerState;
    (function (EventDelayerState) {
        EventDelayerState[EventDelayerState["Idle"] = 0] = "Idle";
        EventDelayerState[EventDelayerState["Running"] = 1] = "Running";
    })(EventDelayerState || (EventDelayerState = {}));
    /**
     * The EventDelayer is useful in situations in which you want
     * to delay firing your events during some code.
     * You can wrap that code and be sure that the event will not
     * be fired during that wrap.
     *
     * ```
     * const emitter: Emitter;
     * const delayer = new EventDelayer();
     * const delayedEvent = delayer.delay(emitter.event);
     *
     * delayedEvent(console.log);
     *
     * delayer.wrap(() => {
     *   emitter.fire(); // event will not be fired yet
     * });
     *
     * // event will only be fired at this point
     * ```
     */
    var EventBufferer = (function () {
        function EventBufferer() {
            this.buffers = [];
        }
        EventBufferer.prototype.wrapEvent = function (event) {
            var _this = this;
            return function (listener, thisArgs, disposables) {
                return event(function (i) {
                    var buffer = _this.buffers[_this.buffers.length - 1];
                    if (buffer) {
                        buffer.push(function () { return listener.call(thisArgs, i); });
                    }
                    else {
                        listener.call(thisArgs, i);
                    }
                }, void 0, disposables);
            };
        };
        EventBufferer.prototype.bufferEvents = function (fn) {
            var buffer = [];
            this.buffers.push(buffer);
            fn();
            this.buffers.pop();
            buffer.forEach(function (flush) { return flush(); });
        };
        return EventBufferer;
    }());
    exports.EventBufferer = EventBufferer;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/common/cancellation", ["require", "exports", 'vs/base/common/event'], function (require, exports, event_1) {
    'use strict';
    var CancellationToken;
    (function (CancellationToken) {
        CancellationToken.None = Object.freeze({
            isCancellationRequested: false,
            onCancellationRequested: event_1.default.None
        });
        CancellationToken.Cancelled = Object.freeze({
            isCancellationRequested: true,
            onCancellationRequested: event_1.default.None
        });
    })(CancellationToken = exports.CancellationToken || (exports.CancellationToken = {}));
    var shortcutEvent = Object.freeze(function (callback, context) {
        var handle = setTimeout(callback.bind(context), 0);
        return { dispose: function () { clearTimeout(handle); } };
    });
    var MutableToken = (function () {
        function MutableToken() {
            this._isCancelled = false;
        }
        MutableToken.prototype.cancel = function () {
            if (!this._isCancelled) {
                this._isCancelled = true;
                if (this._emitter) {
                    this._emitter.fire(undefined);
                    this._emitter = undefined;
                }
            }
        };
        Object.defineProperty(MutableToken.prototype, "isCancellationRequested", {
            get: function () {
                return this._isCancelled;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MutableToken.prototype, "onCancellationRequested", {
            get: function () {
                if (this._isCancelled) {
                    return shortcutEvent;
                }
                if (!this._emitter) {
                    this._emitter = new event_1.Emitter();
                }
                return this._emitter.event;
            },
            enumerable: true,
            configurable: true
        });
        return MutableToken;
    }());
    var CancellationTokenSource = (function () {
        function CancellationTokenSource() {
        }
        Object.defineProperty(CancellationTokenSource.prototype, "token", {
            get: function () {
                if (!this._token) {
                    // be lazy and create the token only when
                    // actually needed
                    this._token = new MutableToken();
                }
                return this._token;
            },
            enumerable: true,
            configurable: true
        });
        CancellationTokenSource.prototype.cancel = function () {
            if (!this._token) {
                // save an object by returning the default
                // cancelled token when cancellation happens
                // before someone asks for the token
                this._token = CancellationToken.Cancelled;
            }
            else {
                this._token.cancel();
            }
        };
        CancellationTokenSource.prototype.dispose = function () {
            this.cancel();
        };
        return CancellationTokenSource;
    }());
    exports.CancellationTokenSource = CancellationTokenSource;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

define("vs/base/common/winjs.base", ['./winjs.base.raw', 'vs/base/common/errors'], function (raw, __Errors__) {
	'use strict';

	var winjs = raw;

	var outstandingPromiseErrors = {};
	function promiseErrorHandler(e) {

		//
		// e.detail looks like: { exception, error, promise, handler, id, parent }
		//
		var details = e.detail;
		var id = details.id;

		// If the error has a parent promise then this is not the origination of the
		//  error so we check if it has a handler, and if so we mark that the error
		//  was handled by removing it from outstandingPromiseErrors
		//
		if (details.parent) {
			if (details.handler && outstandingPromiseErrors) {
				delete outstandingPromiseErrors[id];
			}
			return;
		}

		// Indicate that this error was originated and needs to be handled
		outstandingPromiseErrors[id] = details;

		// The first time the queue fills up this iteration, schedule a timeout to
		// check if any errors are still unhandled.
		if (Object.keys(outstandingPromiseErrors).length === 1) {
			setTimeout(function () {
				var errors = outstandingPromiseErrors;
				outstandingPromiseErrors = {};
				Object.keys(errors).forEach(function (errorId) {
					var error = errors[errorId];
					if(error.exception) {
						__Errors__.onUnexpectedError(error.exception);
					} else if(error.error) {
						__Errors__.onUnexpectedError(error.error);
					}
					console.log("WARNING: Promise with no error callback:" + error.id);
					console.log(error);
					if(error.exception) {
						console.log(error.exception.stack);
					}
				});
			}, 0);
		}
	}

	winjs.Promise.addEventListener("error", promiseErrorHandler);


	function decoratePromise(promise, completeCallback, errorCallback) {
		var pc, pe, pp;

		var resultPromise = new winjs.Promise(
			function (c, e, p) {
				pc = c;
				pe = e;
				pp = p;
			}, function () {
				promise.cancel();
			}
		);

		promise.then(function (r) {
			if (completeCallback) {
				completeCallback(r);
			}
			pc(r);
		}, function (e) {
			if (errorCallback) {
				errorCallback(e);
			}
			pe(e);
		}, pp);

		return resultPromise;
	}

	return {
		decoratePromise: decoratePromise,
		Class: winjs.Class,
		xhr: winjs.xhr,
		Promise: winjs.Promise,
		TPromise: winjs.Promise,
		PPromise: winjs.Promise,
		Utilities: winjs.Utilities
	};
});
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/base/common/async", ["require", "exports", 'vs/base/common/errors', 'vs/base/common/winjs.base', 'vs/base/common/platform', 'vs/base/common/cancellation', 'vs/base/common/lifecycle'], function (require, exports, errors, winjs_base_1, platform, cancellation_1, lifecycle_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function isThenable(obj) {
        return obj && typeof obj.then === 'function';
    }
    function asWinJsPromise(callback) {
        var source = new cancellation_1.CancellationTokenSource();
        return new winjs_base_1.TPromise(function (resolve, reject) {
            var item = callback(source.token);
            if (isThenable(item)) {
                item.then(resolve, reject);
            }
            else {
                resolve(item);
            }
        }, function () {
            source.cancel();
        });
    }
    exports.asWinJsPromise = asWinJsPromise;
    /**
     * A helper to prevent accumulation of sequential async tasks.
     *
     * Imagine a mail man with the sole task of delivering letters. As soon as
     * a letter submitted for delivery, he drives to the destination, delivers it
     * and returns to his base. Imagine that during the trip, N more letters were submitted.
     * When the mail man returns, he picks those N letters and delivers them all in a
     * single trip. Even though N+1 submissions occurred, only 2 deliveries were made.
     *
     * The throttler implements this via the queue() method, by providing it a task
     * factory. Following the example:
     *
     * 		var throttler = new Throttler();
     * 		var letters = [];
     *
     * 		function letterReceived(l) {
     * 			letters.push(l);
     * 			throttler.queue(() => { return makeTheTrip(); });
     * 		}
     */
    var Throttler = (function () {
        function Throttler() {
            this.activePromise = null;
            this.queuedPromise = null;
            this.queuedPromiseFactory = null;
        }
        Throttler.prototype.queue = function (promiseFactory) {
            var _this = this;
            if (this.activePromise) {
                this.queuedPromiseFactory = promiseFactory;
                if (!this.queuedPromise) {
                    var onComplete_1 = function () {
                        _this.queuedPromise = null;
                        var result = _this.queue(_this.queuedPromiseFactory);
                        _this.queuedPromiseFactory = null;
                        return result;
                    };
                    this.queuedPromise = new winjs_base_1.Promise(function (c, e, p) {
                        _this.activePromise.then(onComplete_1, onComplete_1, p).done(c);
                    }, function () {
                        _this.activePromise.cancel();
                    });
                }
                return new winjs_base_1.Promise(function (c, e, p) {
                    _this.queuedPromise.then(c, e, p);
                }, function () {
                    // no-op
                });
            }
            this.activePromise = promiseFactory();
            return new winjs_base_1.Promise(function (c, e, p) {
                _this.activePromise.done(function (result) {
                    _this.activePromise = null;
                    c(result);
                }, function (err) {
                    _this.activePromise = null;
                    e(err);
                }, p);
            }, function () {
                _this.activePromise.cancel();
            });
        };
        return Throttler;
    }());
    exports.Throttler = Throttler;
    /**
     * A helper to delay execution of a task that is being requested often.
     *
     * Following the throttler, now imagine the mail man wants to optimize the number of
     * trips proactively. The trip itself can be long, so the he decides not to make the trip
     * as soon as a letter is submitted. Instead he waits a while, in case more
     * letters are submitted. After said waiting period, if no letters were submitted, he
     * decides to make the trip. Imagine that N more letters were submitted after the first
     * one, all within a short period of time between each other. Even though N+1
     * submissions occurred, only 1 delivery was made.
     *
     * The delayer offers this behavior via the trigger() method, into which both the task
     * to be executed and the waiting period (delay) must be passed in as arguments. Following
     * the example:
     *
     * 		var delayer = new Delayer(WAITING_PERIOD);
     * 		var letters = [];
     *
     * 		function letterReceived(l) {
     * 			letters.push(l);
     * 			delayer.trigger(() => { return makeTheTrip(); });
     * 		}
     */
    var Delayer = (function () {
        function Delayer(defaultDelay) {
            this.defaultDelay = defaultDelay;
            this.timeout = null;
            this.completionPromise = null;
            this.onSuccess = null;
            this.task = null;
        }
        Delayer.prototype.trigger = function (task, delay) {
            var _this = this;
            if (delay === void 0) { delay = this.defaultDelay; }
            this.task = task;
            this.cancelTimeout();
            if (!this.completionPromise) {
                this.completionPromise = new winjs_base_1.Promise(function (c) {
                    _this.onSuccess = c;
                }, function () {
                    // no-op
                }).then(function () {
                    _this.completionPromise = null;
                    _this.onSuccess = null;
                    var task = _this.task;
                    _this.task = null;
                    return task();
                });
            }
            this.timeout = setTimeout(function () {
                _this.timeout = null;
                _this.onSuccess(null);
            }, delay);
            return this.completionPromise;
        };
        Delayer.prototype.isTriggered = function () {
            return this.timeout !== null;
        };
        Delayer.prototype.cancel = function () {
            this.cancelTimeout();
            if (this.completionPromise) {
                this.completionPromise.cancel();
                this.completionPromise = null;
            }
        };
        Delayer.prototype.cancelTimeout = function () {
            if (this.timeout !== null) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
        };
        return Delayer;
    }());
    exports.Delayer = Delayer;
    /**
     * A helper to delay execution of a task that is being requested often, while
     * preventing accumulation of consecutive executions, while the task runs.
     *
     * Simply combine the two mail man strategies from the Throttler and Delayer
     * helpers, for an analogy.
     */
    var ThrottledDelayer = (function (_super) {
        __extends(ThrottledDelayer, _super);
        function ThrottledDelayer(defaultDelay) {
            _super.call(this, defaultDelay);
            this.throttler = new Throttler();
        }
        ThrottledDelayer.prototype.trigger = function (promiseFactory, delay) {
            var _this = this;
            return _super.prototype.trigger.call(this, function () { return _this.throttler.queue(promiseFactory); }, delay);
        };
        return ThrottledDelayer;
    }(Delayer));
    exports.ThrottledDelayer = ThrottledDelayer;
    /**
     * Similar to the ThrottledDelayer, except it also guarantees that the promise
     * factory doesn't get called more often than every `minimumPeriod` milliseconds.
     */
    var PeriodThrottledDelayer = (function (_super) {
        __extends(PeriodThrottledDelayer, _super);
        function PeriodThrottledDelayer(defaultDelay, minimumPeriod) {
            if (minimumPeriod === void 0) { minimumPeriod = 0; }
            _super.call(this, defaultDelay);
            this.minimumPeriod = minimumPeriod;
            this.periodThrottler = new Throttler();
        }
        PeriodThrottledDelayer.prototype.trigger = function (promiseFactory, delay) {
            var _this = this;
            return _super.prototype.trigger.call(this, function () {
                return _this.periodThrottler.queue(function () {
                    return winjs_base_1.Promise.join([
                        winjs_base_1.TPromise.timeout(_this.minimumPeriod),
                        promiseFactory()
                    ]).then(function (r) { return r[1]; });
                });
            }, delay);
        };
        return PeriodThrottledDelayer;
    }(ThrottledDelayer));
    exports.PeriodThrottledDelayer = PeriodThrottledDelayer;
    var PromiseSource = (function () {
        function PromiseSource() {
            var _this = this;
            this._value = new winjs_base_1.TPromise(function (c, e) {
                _this._completeCallback = c;
                _this._errorCallback = e;
            });
        }
        Object.defineProperty(PromiseSource.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        PromiseSource.prototype.complete = function (value) {
            this._completeCallback(value);
        };
        PromiseSource.prototype.error = function (err) {
            this._errorCallback(err);
        };
        return PromiseSource;
    }());
    exports.PromiseSource = PromiseSource;
    var ShallowCancelThenPromise = (function (_super) {
        __extends(ShallowCancelThenPromise, _super);
        function ShallowCancelThenPromise(outer) {
            var completeCallback, errorCallback, progressCallback;
            _super.call(this, function (c, e, p) {
                completeCallback = c;
                errorCallback = e;
                progressCallback = p;
            }, function () {
                // cancel this promise but not the
                // outer promise
                errorCallback(errors.canceled());
            });
            outer.then(completeCallback, errorCallback, progressCallback);
        }
        return ShallowCancelThenPromise;
    }(winjs_base_1.TPromise));
    exports.ShallowCancelThenPromise = ShallowCancelThenPromise;
    /**
     * Returns a new promise that joins the provided promise. Upon completion of
     * the provided promise the provided function will always be called. This
     * method is comparable to a try-finally code block.
     * @param promise a promise
     * @param f a function that will be call in the success and error case.
     */
    function always(promise, f) {
        return new winjs_base_1.TPromise(function (c, e, p) {
            promise.done(function (result) {
                try {
                    f(result);
                }
                catch (e1) {
                    errors.onUnexpectedError(e1);
                }
                c(result);
            }, function (err) {
                try {
                    f(err);
                }
                catch (e1) {
                    errors.onUnexpectedError(e1);
                }
                e(err);
            }, function (progress) {
                p(progress);
            });
        }, function () {
            promise.cancel();
        });
    }
    exports.always = always;
    /**
     * Runs the provided list of promise factories in sequential order. The returned
     * promise will complete to an array of results from each promise.
     */
    function sequence(promiseFactory) {
        var results = [];
        // reverse since we start with last element using pop()
        promiseFactory = promiseFactory.reverse();
        function next() {
            if (promiseFactory.length) {
                return promiseFactory.pop()();
            }
            return null;
        }
        function thenHandler(result) {
            if (result) {
                results.push(result);
            }
            var n = next();
            if (n) {
                return n.then(thenHandler);
            }
            return winjs_base_1.TPromise.as(results);
        }
        return winjs_base_1.TPromise.as(null).then(thenHandler);
    }
    exports.sequence = sequence;
    function once(fn) {
        var _this = this;
        var didCall = false;
        var result;
        return function () {
            if (didCall) {
                return result;
            }
            didCall = true;
            result = fn.apply(_this, arguments);
            return result;
        };
    }
    exports.once = once;
    /**
     * A helper to queue N promises and run them all with a max degree of parallelism. The helper
     * ensures that at any time no more than M promises are running at the same time.
     */
    var Limiter = (function () {
        function Limiter(maxDegreeOfParalellism) {
            this.maxDegreeOfParalellism = maxDegreeOfParalellism;
            this.outstandingPromises = [];
            this.runningPromises = 0;
        }
        Limiter.prototype.queue = function (promiseFactory) {
            var _this = this;
            return new winjs_base_1.TPromise(function (c, e, p) {
                _this.outstandingPromises.push({
                    factory: promiseFactory,
                    c: c,
                    e: e,
                    p: p
                });
                _this.consume();
            });
        };
        Limiter.prototype.consume = function () {
            var _this = this;
            while (this.outstandingPromises.length && this.runningPromises < this.maxDegreeOfParalellism) {
                var iLimitedTask = this.outstandingPromises.shift();
                this.runningPromises++;
                var promise = iLimitedTask.factory();
                promise.done(iLimitedTask.c, iLimitedTask.e, iLimitedTask.p);
                promise.done(function () { return _this.consumed(); }, function () { return _this.consumed(); });
            }
        };
        Limiter.prototype.consumed = function () {
            this.runningPromises--;
            this.consume();
        };
        return Limiter;
    }());
    exports.Limiter = Limiter;
    var TimeoutTimer = (function (_super) {
        __extends(TimeoutTimer, _super);
        function TimeoutTimer() {
            _super.call(this);
            this._token = -1;
        }
        TimeoutTimer.prototype.dispose = function () {
            this.cancel();
            _super.prototype.dispose.call(this);
        };
        TimeoutTimer.prototype.cancel = function () {
            if (this._token !== -1) {
                platform.clearTimeout(this._token);
                this._token = -1;
            }
        };
        TimeoutTimer.prototype.cancelAndSet = function (runner, timeout) {
            var _this = this;
            this.cancel();
            this._token = platform.setTimeout(function () {
                _this._token = -1;
                runner();
            }, timeout);
        };
        TimeoutTimer.prototype.setIfNotSet = function (runner, timeout) {
            var _this = this;
            if (this._token !== -1) {
                // timer is already set
                return;
            }
            this._token = platform.setTimeout(function () {
                _this._token = -1;
                runner();
            }, timeout);
        };
        return TimeoutTimer;
    }(lifecycle_1.Disposable));
    exports.TimeoutTimer = TimeoutTimer;
    var IntervalTimer = (function (_super) {
        __extends(IntervalTimer, _super);
        function IntervalTimer() {
            _super.call(this);
            this._token = -1;
        }
        IntervalTimer.prototype.dispose = function () {
            this.cancel();
            _super.prototype.dispose.call(this);
        };
        IntervalTimer.prototype.cancel = function () {
            if (this._token !== -1) {
                platform.clearInterval(this._token);
                this._token = -1;
            }
        };
        IntervalTimer.prototype.cancelAndSet = function (runner, interval) {
            this.cancel();
            this._token = platform.setInterval(function () {
                runner();
            }, interval);
        };
        return IntervalTimer;
    }(lifecycle_1.Disposable));
    exports.IntervalTimer = IntervalTimer;
    var RunOnceScheduler = (function () {
        function RunOnceScheduler(runner, timeout) {
            this.timeoutToken = -1;
            this.runner = runner;
            this.timeout = timeout;
            this.timeoutHandler = this.onTimeout.bind(this);
        }
        /**
         * Dispose RunOnceScheduler
         */
        RunOnceScheduler.prototype.dispose = function () {
            this.cancel();
            this.runner = null;
        };
        /**
         * Cancel current scheduled runner (if any).
         */
        RunOnceScheduler.prototype.cancel = function () {
            if (this.isScheduled()) {
                platform.clearTimeout(this.timeoutToken);
                this.timeoutToken = -1;
            }
        };
        /**
         * Replace runner. If there is a runner already scheduled, the new runner will be called.
         */
        RunOnceScheduler.prototype.setRunner = function (runner) {
            this.runner = runner;
        };
        /**
         * Set timeout. This change will only impact new schedule calls.
         */
        RunOnceScheduler.prototype.setTimeout = function (timeout) {
            this.timeout = timeout;
        };
        /**
         * Cancel previous runner (if any) & schedule a new runner.
         */
        RunOnceScheduler.prototype.schedule = function () {
            this.cancel();
            this.timeoutToken = platform.setTimeout(this.timeoutHandler, this.timeout);
        };
        /**
         * Returns true if scheduled.
         */
        RunOnceScheduler.prototype.isScheduled = function () {
            return this.timeoutToken !== -1;
        };
        RunOnceScheduler.prototype.onTimeout = function () {
            this.timeoutToken = -1;
            if (this.runner) {
                this.runner();
            }
        };
        return RunOnceScheduler;
    }());
    exports.RunOnceScheduler = RunOnceScheduler;
    function nfcall(fn) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new winjs_base_1.Promise(function (c, e) { return fn.apply(void 0, args.concat([function (err, result) { return err ? e(err) : c(result); }])); });
    }
    exports.nfcall = nfcall;
    function ninvoke(thisArg, fn) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return new winjs_base_1.Promise(function (c, e) { return fn.call.apply(fn, [thisArg].concat(args, [function (err, result) { return err ? e(err) : c(result); }])); });
    }
    exports.ninvoke = ninvoke;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/common/service", ["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/objects', 'vs/base/common/lifecycle', 'vs/base/common/event'], function (require, exports, winjs_base_1, objects_1, lifecycle_1, event_1) {
    'use strict';
    var RequestType;
    (function (RequestType) {
        RequestType[RequestType["Common"] = 0] = "Common";
        RequestType[RequestType["Cancel"] = 1] = "Cancel";
    })(RequestType || (RequestType = {}));
    var ResponseType;
    (function (ResponseType) {
        ResponseType[ResponseType["Initialize"] = 0] = "Initialize";
        ResponseType[ResponseType["Success"] = 1] = "Success";
        ResponseType[ResponseType["Progress"] = 2] = "Progress";
        ResponseType[ResponseType["Error"] = 3] = "Error";
        ResponseType[ResponseType["ErrorObj"] = 4] = "ErrorObj";
    })(ResponseType || (ResponseType = {}));
    var ServiceState;
    (function (ServiceState) {
        ServiceState[ServiceState["Uninitialized"] = 0] = "Uninitialized";
        ServiceState[ServiceState["Idle"] = 1] = "Idle";
    })(ServiceState || (ServiceState = {}));
    var ServiceEventProperty = '$__SERVICE_EVENT';
    /**
     * Use this as a property decorator.
     */
    function ServiceEvent(target, key) {
        target[key] = (_a = {}, _a[ServiceEventProperty] = true, _a);
        var _a;
    }
    exports.ServiceEvent = ServiceEvent;
    function isServiceEvent(target) {
        return target[ServiceEventProperty];
    }
    exports.isServiceEvent = isServiceEvent;
    var Server = (function () {
        function Server(protocol) {
            var _this = this;
            this.protocol = protocol;
            this.services = Object.create(null);
            this.activeRequests = Object.create(null);
            this.protocol.onMessage(function (r) { return _this.onMessage(r); });
            this.protocol.send({ type: ResponseType.Initialize });
        }
        Server.prototype.registerService = function (serviceName, service) {
            this.services[serviceName] = service;
        };
        Server.prototype.onMessage = function (request) {
            switch (request.type) {
                case RequestType.Common:
                    this.onCommonRequest(request);
                    break;
                case RequestType.Cancel:
                    this.onCancelRequest(request);
                    break;
            }
        };
        Server.prototype.onCommonRequest = function (request) {
            var service = this.services[request.serviceName];
            var servicePrototype = service.constructor.prototype;
            var prototypeMethod = servicePrototype && servicePrototype[request.name];
            var isEvent = prototypeMethod && prototypeMethod[ServiceEventProperty];
            var method = service[request.name];
            var promise;
            if (isEvent) {
                var disposable_1;
                promise = new winjs_base_1.Promise(function (c, e, p) { return disposable_1 = method.call(service, p); }, function () { return disposable_1.dispose(); });
            }
            else {
                if (!method) {
                    promise = winjs_base_1.Promise.wrapError(new Error(request.name + " is not a valid method on " + request.serviceName));
                }
                else {
                    try {
                        promise = method.call.apply(method, [service].concat(request.args));
                    }
                    catch (err) {
                        promise = winjs_base_1.Promise.wrapError(err);
                    }
                }
                if (!winjs_base_1.Promise.is(promise)) {
                    var message = "'" + request.name + "' did not return a promise";
                    console.warn(message);
                    promise = winjs_base_1.Promise.wrapError(new Error(message));
                }
            }
            this.onPromiseRequest(promise, request);
        };
        Server.prototype.onPromiseRequest = function (promise, request) {
            var _this = this;
            var id = request.id;
            var requestPromise = promise.then(function (data) {
                _this.protocol.send({ id: id, data: data, type: ResponseType.Success });
                delete _this.activeRequests[request.id];
            }, function (data) {
                if (data instanceof Error) {
                    _this.protocol.send({ id: id, data: {
                            message: data.message,
                            name: data.name,
                            stack: data.stack ? data.stack.split('\n') : void 0
                        }, type: ResponseType.Error });
                }
                else {
                    _this.protocol.send({ id: id, data: data, type: ResponseType.ErrorObj });
                }
                delete _this.activeRequests[request.id];
            }, function (data) {
                _this.protocol.send({ id: id, data: data, type: ResponseType.Progress });
            });
            this.activeRequests[request.id] = lifecycle_1.fnToDisposable(function () { return requestPromise.cancel(); });
        };
        Server.prototype.onCancelRequest = function (request) {
            var disposable = this.activeRequests[request.id];
            if (disposable) {
                disposable.dispose();
                delete this.activeRequests[request.id];
            }
        };
        Server.prototype.dispose = function () {
            var _this = this;
            Object.keys(this.activeRequests).forEach(function (id) {
                _this.activeRequests[id].dispose();
            });
            this.activeRequests = null;
        };
        return Server;
    }());
    exports.Server = Server;
    var Client = (function () {
        function Client(protocol) {
            var _this = this;
            this.protocol = protocol;
            this.state = ServiceState.Uninitialized;
            this.bufferedRequests = [];
            this.handlers = Object.create(null);
            this.lastRequestId = 0;
            this.protocol.onMessage(function (r) { return _this.onMessage(r); });
        }
        Client.prototype.getService = function (serviceName, serviceCtor) {
            var _this = this;
            var props = Object.keys(serviceCtor.prototype)
                .filter(function (key) { return key !== 'constructor'; });
            return props.reduce(function (service, key) {
                if (serviceCtor.prototype[key][ServiceEventProperty]) {
                    var promise_1;
                    var emitter_1 = new event_1.Emitter({
                        onFirstListenerAdd: function () {
                            promise_1 = _this.request(serviceName, key)
                                .then(null, null, function (event) { return emitter_1.fire(event); });
                        },
                        onLastListenerRemove: function () {
                            promise_1.cancel();
                            promise_1 = null;
                        }
                    });
                    return objects_1.assign(service, (_a = {}, _a[key] = emitter_1.event, _a));
                }
                return objects_1.assign(service, (_b = {}, _b[key] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    return _this.request.apply(_this, [serviceName, key].concat(args));
                }, _b));
                var _a, _b;
            }, {});
        };
        Client.prototype.request = function (serviceName, name) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var request = {
                raw: {
                    id: this.lastRequestId++,
                    type: RequestType.Common,
                    serviceName: serviceName,
                    name: name,
                    args: args
                }
            };
            if (this.state === ServiceState.Uninitialized) {
                return this.bufferRequest(request);
            }
            return this.doRequest(request);
        };
        Client.prototype.doRequest = function (request) {
            var _this = this;
            var id = request.raw.id;
            return new winjs_base_1.Promise(function (c, e, p) {
                _this.handlers[id] = function (response) {
                    switch (response.type) {
                        case ResponseType.Success:
                            delete _this.handlers[id];
                            c(response.data);
                            break;
                        case ResponseType.Error:
                            delete _this.handlers[id];
                            var error = new Error(response.data.message);
                            error.stack = response.data.stack;
                            error.name = response.data.name;
                            e(error);
                            break;
                        case ResponseType.ErrorObj:
                            delete _this.handlers[id];
                            e(response.data);
                            break;
                        case ResponseType.Progress:
                            p(response.data);
                            break;
                    }
                };
                _this.send(request.raw);
            }, function () { return _this.send({ id: id, type: RequestType.Cancel }); });
        };
        Client.prototype.bufferRequest = function (request) {
            var _this = this;
            var flushedRequest = null;
            return new winjs_base_1.Promise(function (c, e, p) {
                _this.bufferedRequests.push(request);
                request.flush = function () {
                    request.flush = null;
                    flushedRequest = _this.doRequest(request).then(c, e, p);
                };
            }, function () {
                request.flush = null;
                if (_this.state !== ServiceState.Uninitialized) {
                    if (flushedRequest) {
                        flushedRequest.cancel();
                        flushedRequest = null;
                    }
                    return;
                }
                var idx = _this.bufferedRequests.indexOf(request);
                if (idx === -1) {
                    return;
                }
                _this.bufferedRequests.splice(idx, 1);
            });
        };
        Client.prototype.onMessage = function (response) {
            if (this.state === ServiceState.Uninitialized && response.type === ResponseType.Initialize) {
                this.state = ServiceState.Idle;
                this.bufferedRequests.forEach(function (r) { return r.flush && r.flush(); });
                this.bufferedRequests = null;
                return;
            }
            var handler = this.handlers[response.id];
            if (handler) {
                handler(response);
            }
        };
        Client.prototype.send = function (raw) {
            try {
                this.protocol.send(raw);
            }
            catch (err) {
            }
        };
        return Client;
    }());
    exports.Client = Client;
    /**
     * Useful when the service itself is needed right away but the client
     * is wrapped within a promise.
     */
    function getService(clientPromise, serviceName, serviceCtor) {
        var _servicePromise;
        var servicePromise = function () {
            if (!_servicePromise) {
                _servicePromise = clientPromise.then(function (client) { return client.getService(serviceName, serviceCtor); });
            }
            return _servicePromise;
        };
        return Object.keys(serviceCtor.prototype)
            .filter(function (key) { return key !== 'constructor'; })
            .reduce(function (result, key) {
            if (isServiceEvent(serviceCtor.prototype[key])) {
                var promise_2;
                var disposable_2;
                var emitter_2 = new event_1.Emitter({
                    onFirstListenerAdd: function () {
                        promise_2 = servicePromise().then(function (service) {
                            disposable_2 = service[key](function (e) { return emitter_2.fire(e); });
                        });
                    },
                    onLastListenerRemove: function () {
                        if (disposable_2) {
                            disposable_2.dispose();
                            disposable_2 = null;
                        }
                        promise_2.cancel();
                        promise_2 = null;
                    }
                });
                return objects_1.assign(result, (_a = {}, _a[key] = emitter_2.event, _a));
            }
            return objects_1.assign(result, (_b = {},
                _b[key] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    return servicePromise().then(function (service) { return service[key].apply(service, args); });
                },
                _b
            ));
            var _a, _b;
        }, {});
    }
    exports.getService = getService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/node/env", ["require", "exports", 'vs/base/common/platform', 'vs/base/common/winjs.base', 'child_process'], function (require, exports, platform, winjs_base_1, cp) {
    'use strict';
    function getUserEnvironment() {
        if (platform.isWindows) {
            return winjs_base_1.TPromise.as({});
        }
        return new winjs_base_1.TPromise(function (c, e) {
            var child = cp.spawn(process.env.SHELL, ['-ilc', 'env'], {
                detached: true,
                stdio: ['ignore', 'pipe', process.stderr],
            });
            child.stdout.setEncoding('utf8');
            child.on('error', function () { return c({}); });
            var buffer = '';
            child.stdout.on('data', function (d) { buffer += d; });
            child.on('close', function (code, signal) {
                if (code !== 0) {
                    return c({});
                }
                var result = Object.create(null);
                buffer.split('\n').forEach(function (line) {
                    var pos = line.indexOf('=');
                    if (pos > 0) {
                        var key = line.substring(0, pos);
                        var value = line.substring(pos + 1);
                        if (!key || typeof result[key] === 'string') {
                            return;
                        }
                        result[key] = value;
                    }
                });
                c(result);
            });
        });
    }
    exports.getUserEnvironment = getUserEnvironment;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/node/pfs", ["require", "exports", 'vs/base/common/winjs.base', 'vs/base/node/extfs', 'vs/base/common/paths', 'path', 'vs/base/common/async', 'fs'], function (require, exports, winjs_base_1, extfs, paths, path_1, async_1, fs) {
    'use strict';
    function isRoot(path) {
        return path === path_1.dirname(path);
    }
    exports.isRoot = isRoot;
    function readdir(path) {
        return async_1.nfcall(extfs.readdir, path);
    }
    exports.readdir = readdir;
    function exists(path) {
        return new winjs_base_1.Promise(function (c) { return fs.exists(path, c); });
    }
    exports.exists = exists;
    function chmod(path, mode) {
        return async_1.nfcall(fs.chmod, path, mode);
    }
    exports.chmod = chmod;
    function mkdirp(path, mode) {
        var mkdir = function () { return async_1.nfcall(fs.mkdir, path, mode)
            .then(null, function (err) {
            if (err.code === 'EEXIST') {
                return async_1.nfcall(fs.stat, path)
                    .then(function (stat) { return stat.isDirectory
                    ? null
                    : winjs_base_1.Promise.wrapError(new Error("'" + path + "' exists and is not a directory.")); });
            }
            return winjs_base_1.TPromise.wrapError(err);
        }); };
        if (isRoot(path)) {
            return winjs_base_1.TPromise.as(true);
        }
        return mkdir().then(null, function (err) {
            if (err.code === 'ENOENT') {
                return mkdirp(path_1.dirname(path), mode).then(mkdir);
            }
            return winjs_base_1.TPromise.wrapError(err);
        });
    }
    exports.mkdirp = mkdirp;
    function rimraf(path) {
        return stat(path).then(function (stat) {
            if (stat.isDirectory()) {
                return readdir(path)
                    .then(function (children) { return winjs_base_1.TPromise.join(children.map(function (child) { return rimraf(path_1.join(path, child)); })); })
                    .then(function () { return rmdir(path); });
            }
            else {
                return unlink(path);
            }
        }, function (err) {
            if (err.code === 'ENOENT') {
                return;
            }
            return winjs_base_1.TPromise.wrapError(err);
        });
    }
    exports.rimraf = rimraf;
    function realpath(path) {
        return async_1.nfcall(fs.realpath, path, null);
    }
    exports.realpath = realpath;
    function stat(path) {
        return async_1.nfcall(fs.stat, path);
    }
    exports.stat = stat;
    function lstat(path) {
        return async_1.nfcall(fs.lstat, path);
    }
    exports.lstat = lstat;
    function mstat(paths) {
        return doStatMultiple(paths.slice(0));
    }
    exports.mstat = mstat;
    function rename(oldPath, newPath) {
        return async_1.nfcall(fs.rename, oldPath, newPath);
    }
    exports.rename = rename;
    function rmdir(path) {
        return async_1.nfcall(fs.rmdir, path);
    }
    exports.rmdir = rmdir;
    function unlink(path) {
        return async_1.nfcall(fs.unlink, path);
    }
    exports.unlink = unlink;
    function symlink(target, path, type) {
        return async_1.nfcall(fs.symlink, target, path, type);
    }
    exports.symlink = symlink;
    function readlink(path) {
        return async_1.nfcall(fs.readlink, path);
    }
    exports.readlink = readlink;
    function doStatMultiple(paths) {
        var path = paths.shift();
        return stat(path).then(function (value) {
            return {
                path: path,
                stats: value
            };
        }, function (err) {
            if (paths.length === 0) {
                return err;
            }
            return mstat(paths);
        });
    }
    function readFile(path, encoding) {
        return async_1.nfcall(fs.readFile, path, encoding);
    }
    exports.readFile = readFile;
    function writeFile(path, data, encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        return async_1.nfcall(fs.writeFile, path, data, encoding);
    }
    exports.writeFile = writeFile;
    /**
    * Read a dir and return only subfolders
    */
    function readDirsInDir(dirPath) {
        return readdir(dirPath).then(function (children) {
            return winjs_base_1.TPromise.join(children.map(function (child) { return dirExistsWithResult(paths.join(dirPath, child), child); })).then(function (subdirs) {
                return removeNull(subdirs);
            });
        });
    }
    exports.readDirsInDir = readDirsInDir;
    function dirExistsWithResult(path, successResult) {
        return dirExists(path).then(function (exists) {
            return exists ? successResult : null;
        });
    }
    /**
    * `path` exists and is a directory
    */
    function dirExists(path) {
        return stat(path).then(function (stat) { return stat.isDirectory(); }, function () { return false; });
    }
    exports.dirExists = dirExists;
    /**
    * `path` exists and is a file.
    */
    function fileExists(path) {
        return stat(path).then(function (stat) { return stat.isFile(); }, function () { return false; });
    }
    exports.fileExists = fileExists;
    /**
    * Read dir at `path` and return only files matching `pattern`
    */
    function readFiles(path, pattern) {
        return readdir(path).then(function (children) {
            children = children.filter(function (child) {
                return pattern.test(child);
            });
            var fileChildren = children.map(function (child) {
                return fileExistsWithResult(paths.join(path, child), child);
            });
            return winjs_base_1.TPromise.join(fileChildren).then(function (subdirs) {
                return removeNull(subdirs);
            });
        });
    }
    exports.readFiles = readFiles;
    function fileExistsWithResult(path, successResult) {
        return fileExists(path).then(function (exists) {
            return exists ? successResult : null;
        }, function (err) {
            return winjs_base_1.TPromise.wrapError(err);
        });
    }
    exports.fileExistsWithResult = fileExistsWithResult;
    function removeNull(arr) {
        return arr.filter(function (item) { return (item !== null); });
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/node/request", ["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/types', 'https', 'http', 'url', 'fs', 'vs/base/common/objects'], function (require, exports, winjs_base_1, types_1, https, http, url_1, fs_1, objects_1) {
    'use strict';
    function request(options) {
        var req;
        return new winjs_base_1.TPromise(function (c, e) {
            var endpoint = url_1.parse(options.url);
            var opts = {
                hostname: endpoint.hostname,
                port: endpoint.port ? parseInt(endpoint.port) : (endpoint.protocol === 'https:' ? 443 : 80),
                path: endpoint.path,
                method: options.type || 'GET',
                headers: options.headers,
                agent: options.agent,
                rejectUnauthorized: types_1.isBoolean(options.strictSSL) ? options.strictSSL : true
            };
            if (options.user && options.password) {
                opts.auth = options.user + ':' + options.password;
            }
            var protocol = endpoint.protocol === 'https:' ? https : http;
            req = protocol.request(opts, function (res) {
                if (res.statusCode >= 300 && res.statusCode < 400 && options.followRedirects && options.followRedirects > 0 && res.headers['location']) {
                    c(request(objects_1.assign({}, options, {
                        url: res.headers['location'],
                        followRedirects: options.followRedirects - 1
                    })));
                }
                else {
                    c({ req: req, res: res });
                }
            });
            req.on('error', e);
            if (options.timeout) {
                req.setTimeout(options.timeout);
            }
            if (options.data) {
                req.write(options.data);
            }
            req.end();
        }, function () { return req && req.abort(); });
    }
    exports.request = request;
    function download(filePath, opts) {
        return request(objects_1.assign(opts, { followRedirects: 3 })).then(function (pair) { return new winjs_base_1.TPromise(function (c, e) {
            var out = fs_1.createWriteStream(filePath);
            out.once('finish', function () { return c(null); });
            pair.res.once('error', e);
            pair.res.pipe(out);
        }); });
    }
    exports.download = download;
    function json(opts) {
        return request(opts).then(function (pair) { return new winjs_base_1.Promise(function (c, e) {
            if (!((pair.res.statusCode >= 200 && pair.res.statusCode < 300) || pair.res.statusCode === 1223)) {
                return e('Server returned ' + pair.res.statusCode);
            }
            if (pair.res.statusCode === 204) {
                return c(null);
            }
            if (!/application\/json/.test(pair.res.headers['content-type'])) {
                return e('Response doesn\'t appear to be JSON');
            }
            var buffer = [];
            pair.res.on('data', function (d) { return buffer.push(d); });
            pair.res.on('end', function () { return c(JSON.parse(buffer.join(''))); });
            pair.res.on('error', e);
        }); });
    }
    exports.json = json;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/node/service.net", ["require", "exports", 'net', 'vs/base/common/event', 'vs/base/common/service', 'vs/base/common/winjs.base'], function (require, exports, net, event_1, service_1, winjs_base_1) {
    'use strict';
    function bufferIndexOf(buffer, value, start) {
        if (start === void 0) { start = 0; }
        while (start < buffer.length && buffer[start] !== value) {
            start++;
        }
        return start;
    }
    var Protocol = (function () {
        function Protocol(socket) {
            this.socket = socket;
            this.buffer = null;
        }
        Protocol.prototype.send = function (message) {
            this.socket.write(JSON.stringify(message));
            this.socket.write(Protocol.Boundary);
        };
        Protocol.prototype.onMessage = function (callback) {
            var _this = this;
            this.socket.on('data', function (data) {
                var lastIndex = 0;
                var index = 0;
                while ((index = bufferIndexOf(data, 0, lastIndex)) < data.length) {
                    var dataToParse = data.slice(lastIndex, index);
                    if (_this.buffer) {
                        callback(JSON.parse(Buffer.concat([_this.buffer, dataToParse]).toString('utf8')));
                        _this.buffer = null;
                    }
                    else {
                        callback(JSON.parse(dataToParse.toString('utf8')));
                    }
                    lastIndex = index + 1;
                }
                if (index - lastIndex > 0) {
                    var dataToBuffer = data.slice(lastIndex, index);
                    if (_this.buffer) {
                        _this.buffer = Buffer.concat([_this.buffer, dataToBuffer]);
                    }
                    else {
                        _this.buffer = dataToBuffer;
                    }
                }
            });
        };
        Protocol.Boundary = new Buffer([0]);
        return Protocol;
    }());
    var Server = (function () {
        function Server(server) {
            var _this = this;
            this.server = server;
            this.services = Object.create(null);
            this.server.on('connection', function (socket) {
                var ipcServer = new service_1.Server(new Protocol(socket));
                Object.keys(_this.services)
                    .forEach(function (name) { return ipcServer.registerService(name, _this.services[name]); });
                socket.once('close', function () { return ipcServer.dispose(); });
            });
        }
        Server.prototype.registerService = function (serviceName, service) {
            this.services[serviceName] = service;
        };
        Server.prototype.dispose = function () {
            this.services = null;
            this.server.close();
            this.server = null;
        };
        return Server;
    }());
    exports.Server = Server;
    var Client = (function () {
        function Client(socket) {
            var _this = this;
            this.socket = socket;
            this._onClose = new event_1.Emitter();
            this.ipcClient = new service_1.Client(new Protocol(socket));
            socket.once('close', function () { return _this._onClose.fire(); });
        }
        Object.defineProperty(Client.prototype, "onClose", {
            get: function () { return this._onClose.event; },
            enumerable: true,
            configurable: true
        });
        Client.prototype.getService = function (serviceName, serviceCtor) {
            return this.ipcClient.getService(serviceName, serviceCtor);
        };
        Client.prototype.dispose = function () {
            this.socket.end();
            this.socket = null;
            this.ipcClient = null;
        };
        return Client;
    }());
    exports.Client = Client;
    function serve(hook) {
        return new winjs_base_1.TPromise(function (c, e) {
            var server = net.createServer();
            server.on('error', e);
            server.listen(hook, function () {
                server.removeListener('error', e);
                c(new Server(server));
            });
        });
    }
    exports.serve = serve;
    function connect(hook) {
        return new winjs_base_1.TPromise(function (c, e) {
            var socket = net.createConnection(hook, function () {
                socket.removeListener('error', e);
                c(new Client(socket));
            });
            socket.once('error', e);
        });
    }
    exports.connect = connect;
});

define("vs/nls!vs/base/common/json",['vs/nls', 'vs/nls!vs/workbench/electron-main/main'], function(nls, data) { return nls.create("vs/base/common/json", data); });
define("vs/base/common/json", ["require", "exports", 'vs/nls!vs/base/common/json'], function (require, exports, nls) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    (function (ScanError) {
        ScanError[ScanError["None"] = 0] = "None";
        ScanError[ScanError["UnexpectedEndOfComment"] = 1] = "UnexpectedEndOfComment";
        ScanError[ScanError["UnexpectedEndOfString"] = 2] = "UnexpectedEndOfString";
        ScanError[ScanError["UnexpectedEndOfNumber"] = 3] = "UnexpectedEndOfNumber";
        ScanError[ScanError["InvalidUnicode"] = 4] = "InvalidUnicode";
        ScanError[ScanError["InvalidEscapeCharacter"] = 5] = "InvalidEscapeCharacter";
    })(exports.ScanError || (exports.ScanError = {}));
    var ScanError = exports.ScanError;
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
    })(exports.SyntaxKind || (exports.SyntaxKind = {}));
    var SyntaxKind = exports.SyntaxKind;
    function createScanner(text, ignoreTrivia) {
        if (ignoreTrivia === void 0) { ignoreTrivia = false; }
        var pos = 0, len = text.length, value = '', tokenOffset = 0, token = SyntaxKind.Unknown, scanError = ScanError.None;
        function scanHexDigits(count, exact) {
            var digits = 0;
            var value = 0;
            while (digits < count || !exact) {
                var ch = text.charCodeAt(pos);
                if (ch >= CharacterCodes._0 && ch <= CharacterCodes._9) {
                    value = value * 16 + ch - CharacterCodes._0;
                }
                else if (ch >= CharacterCodes.A && ch <= CharacterCodes.F) {
                    value = value * 16 + ch - CharacterCodes.A + 10;
                }
                else if (ch >= CharacterCodes.a && ch <= CharacterCodes.f) {
                    value = value * 16 + ch - CharacterCodes.a + 10;
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
        function scanNumber() {
            var start = pos;
            if (text.charCodeAt(pos) === CharacterCodes._0) {
                pos++;
            }
            else {
                pos++;
                while (pos < text.length && isDigit(text.charCodeAt(pos))) {
                    pos++;
                }
            }
            if (pos < text.length && text.charCodeAt(pos) === CharacterCodes.dot) {
                pos++;
                if (pos < text.length && isDigit(text.charCodeAt(pos))) {
                    pos++;
                    while (pos < text.length && isDigit(text.charCodeAt(pos))) {
                        pos++;
                    }
                }
                else {
                    scanError = ScanError.UnexpectedEndOfNumber;
                    return text.substring(start, end);
                }
            }
            var end = pos;
            if (pos < text.length && (text.charCodeAt(pos) === CharacterCodes.E || text.charCodeAt(pos) === CharacterCodes.e)) {
                pos++;
                if (pos < text.length && text.charCodeAt(pos) === CharacterCodes.plus || text.charCodeAt(pos) === CharacterCodes.minus) {
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
                    scanError = ScanError.UnexpectedEndOfNumber;
                }
            }
            return text.substring(start, end);
        }
        function scanString() {
            var result = '', start = pos;
            while (true) {
                if (pos >= len) {
                    result += text.substring(start, pos);
                    scanError = ScanError.UnexpectedEndOfString;
                    break;
                }
                var ch = text.charCodeAt(pos);
                if (ch === CharacterCodes.doubleQuote) {
                    result += text.substring(start, pos);
                    pos++;
                    break;
                }
                if (ch === CharacterCodes.backslash) {
                    result += text.substring(start, pos);
                    pos++;
                    if (pos >= len) {
                        scanError = ScanError.UnexpectedEndOfString;
                        break;
                    }
                    ch = text.charCodeAt(pos++);
                    switch (ch) {
                        case CharacterCodes.doubleQuote:
                            result += '\"';
                            break;
                        case CharacterCodes.backslash:
                            result += '\\';
                            break;
                        case CharacterCodes.slash:
                            result += '/';
                            break;
                        case CharacterCodes.b:
                            result += '\b';
                            break;
                        case CharacterCodes.f:
                            result += '\f';
                            break;
                        case CharacterCodes.n:
                            result += '\n';
                            break;
                        case CharacterCodes.r:
                            result += '\r';
                            break;
                        case CharacterCodes.t:
                            result += '\t';
                            break;
                        case CharacterCodes.u:
                            var ch = scanHexDigits(4, true);
                            if (ch >= 0) {
                                result += String.fromCharCode(ch);
                            }
                            else {
                                scanError = ScanError.InvalidUnicode;
                            }
                            break;
                        default:
                            scanError = ScanError.InvalidEscapeCharacter;
                    }
                    start = pos;
                    continue;
                }
                if (isLineBreak(ch)) {
                    result += text.substring(start, pos);
                    scanError = ScanError.UnexpectedEndOfString;
                    break;
                }
                pos++;
            }
            return result;
        }
        function scanNext() {
            value = '';
            scanError = ScanError.None;
            tokenOffset = pos;
            if (pos >= len) {
                // at the end
                tokenOffset = len;
                return token = SyntaxKind.EOF;
            }
            var code = text.charCodeAt(pos);
            // trivia: whitespace
            if (isWhiteSpace(code)) {
                do {
                    pos++;
                    value += String.fromCharCode(code);
                    code = text.charCodeAt(pos);
                } while (isWhiteSpace(code));
                return token = SyntaxKind.Trivia;
            }
            // trivia: newlines
            if (isLineBreak(code)) {
                pos++;
                value += String.fromCharCode(code);
                if (code === CharacterCodes.carriageReturn && text.charCodeAt(pos) === CharacterCodes.lineFeed) {
                    pos++;
                    value += '\n';
                }
                return token = SyntaxKind.LineBreakTrivia;
            }
            switch (code) {
                // tokens: []{}:,
                case CharacterCodes.openBrace:
                    pos++;
                    return token = SyntaxKind.OpenBraceToken;
                case CharacterCodes.closeBrace:
                    pos++;
                    return token = SyntaxKind.CloseBraceToken;
                case CharacterCodes.openBracket:
                    pos++;
                    return token = SyntaxKind.OpenBracketToken;
                case CharacterCodes.closeBracket:
                    pos++;
                    return token = SyntaxKind.CloseBracketToken;
                case CharacterCodes.colon:
                    pos++;
                    return token = SyntaxKind.ColonToken;
                case CharacterCodes.comma:
                    pos++;
                    return token = SyntaxKind.CommaToken;
                // strings
                case CharacterCodes.doubleQuote:
                    pos++;
                    value = scanString();
                    return token = SyntaxKind.StringLiteral;
                // comments
                case CharacterCodes.slash:
                    var start = pos - 1;
                    // Single-line comment
                    if (text.charCodeAt(pos + 1) === CharacterCodes.slash) {
                        pos += 2;
                        while (pos < len) {
                            if (isLineBreak(text.charCodeAt(pos))) {
                                break;
                            }
                            pos++;
                        }
                        value = text.substring(start, pos);
                        return token = SyntaxKind.LineCommentTrivia;
                    }
                    // Multi-line comment
                    if (text.charCodeAt(pos + 1) === CharacterCodes.asterisk) {
                        pos += 2;
                        var safeLength = len - 1; // For lookahead.
                        var commentClosed = false;
                        while (pos < safeLength) {
                            var ch = text.charCodeAt(pos);
                            if (ch === CharacterCodes.asterisk && text.charCodeAt(pos + 1) === CharacterCodes.slash) {
                                pos += 2;
                                commentClosed = true;
                                break;
                            }
                            pos++;
                        }
                        if (!commentClosed) {
                            pos++;
                            scanError = ScanError.UnexpectedEndOfComment;
                        }
                        value = text.substring(start, pos);
                        return token = SyntaxKind.BlockCommentTrivia;
                    }
                    // just a single slash
                    value += String.fromCharCode(code);
                    pos++;
                    return token = SyntaxKind.Unknown;
                // numbers
                case CharacterCodes.minus:
                    value += String.fromCharCode(code);
                    pos++;
                    if (pos === len || !isDigit(text.charCodeAt(pos))) {
                        return token = SyntaxKind.Unknown;
                    }
                // found a minus, followed by a number so
                // we fall through to proceed with scanning
                // numbers
                case CharacterCodes._0:
                case CharacterCodes._1:
                case CharacterCodes._2:
                case CharacterCodes._3:
                case CharacterCodes._4:
                case CharacterCodes._5:
                case CharacterCodes._6:
                case CharacterCodes._7:
                case CharacterCodes._8:
                case CharacterCodes._9:
                    value += scanNumber();
                    return token = SyntaxKind.NumericLiteral;
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
                            case 'true': return token = SyntaxKind.TrueKeyword;
                            case 'false': return token = SyntaxKind.FalseKeyword;
                            case 'null': return token = SyntaxKind.NullKeyword;
                        }
                        return token = SyntaxKind.Unknown;
                    }
                    // some
                    value += String.fromCharCode(code);
                    pos++;
                    return token = SyntaxKind.Unknown;
            }
        }
        function isUnknownContentCharacter(code) {
            if (isWhiteSpace(code) || isLineBreak(code)) {
                return false;
            }
            switch (code) {
                case CharacterCodes.closeBrace:
                case CharacterCodes.closeBracket:
                case CharacterCodes.openBrace:
                case CharacterCodes.openBracket:
                case CharacterCodes.doubleQuote:
                case CharacterCodes.colon:
                case CharacterCodes.comma:
                    return false;
            }
            return true;
        }
        function scanNextNonTrivia() {
            var result;
            do {
                result = scanNext();
            } while (result >= SyntaxKind.LineCommentTrivia && result <= SyntaxKind.Trivia);
            return result;
        }
        return {
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
        return ch === CharacterCodes.space || ch === CharacterCodes.tab || ch === CharacterCodes.verticalTab || ch === CharacterCodes.formFeed ||
            ch === CharacterCodes.nonBreakingSpace || ch === CharacterCodes.ogham || ch >= CharacterCodes.enQuad && ch <= CharacterCodes.zeroWidthSpace ||
            ch === CharacterCodes.narrowNoBreakSpace || ch === CharacterCodes.mathematicalSpace || ch === CharacterCodes.ideographicSpace || ch === CharacterCodes.byteOrderMark;
    }
    function isLineBreak(ch) {
        return ch === CharacterCodes.lineFeed || ch === CharacterCodes.carriageReturn || ch === CharacterCodes.lineSeparator || ch === CharacterCodes.paragraphSeparator;
    }
    function isDigit(ch) {
        return ch >= CharacterCodes._0 && ch <= CharacterCodes._9;
    }
    function isLetter(ch) {
        return ch >= CharacterCodes.a && ch <= CharacterCodes.z || ch >= CharacterCodes.A && ch <= CharacterCodes.Z;
    }
    exports.isLetter = isLetter;
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
    /**
     * Takes JSON with JavaScript-style comments and remove
     * them. Optionally replaces every none-newline character
     * of comments with a replaceCharacter
     */
    function stripComments(text, replaceCh) {
        var _scanner = createScanner(text), parts = [], kind, offset = 0, pos;
        do {
            pos = _scanner.getPosition();
            kind = _scanner.scan();
            switch (kind) {
                case SyntaxKind.LineCommentTrivia:
                case SyntaxKind.BlockCommentTrivia:
                case SyntaxKind.EOF:
                    if (offset !== pos) {
                        parts.push(text.substring(offset, pos));
                    }
                    if (replaceCh !== void 0) {
                        parts.push(_scanner.getTokenValue().replace(/[^\r\n]/g, replaceCh));
                    }
                    offset = _scanner.getPosition();
                    break;
            }
        } while (kind !== SyntaxKind.EOF);
        return parts.join('');
    }
    exports.stripComments = stripComments;
    function parse(text, errors) {
        if (errors === void 0) { errors = []; }
        var noMatch = Object();
        var _scanner = createScanner(text, true);
        function scanNext() {
            var token = _scanner.scan();
            while (token === SyntaxKind.Unknown) {
                handleError(nls.localize(0, null));
                token = _scanner.scan();
            }
            return token;
        }
        function handleError(message, skipUntilAfter, skipUntil) {
            if (skipUntilAfter === void 0) { skipUntilAfter = []; }
            if (skipUntil === void 0) { skipUntil = []; }
            errors.push(message);
            if (skipUntilAfter.length + skipUntil.length > 0) {
                var token = _scanner.getToken();
                while (token !== SyntaxKind.EOF) {
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
        function parseString() {
            if (_scanner.getToken() !== SyntaxKind.StringLiteral) {
                return noMatch;
            }
            var value = _scanner.getTokenValue();
            scanNext();
            return value;
        }
        function parseLiteral() {
            var value;
            switch (_scanner.getToken()) {
                case SyntaxKind.NumericLiteral:
                    try {
                        value = JSON.parse(_scanner.getTokenValue());
                        if (typeof value !== 'number') {
                            handleError(nls.localize(1, null));
                            value = 0;
                        }
                    }
                    catch (e) {
                        value = 0;
                    }
                    break;
                case SyntaxKind.NullKeyword:
                    value = null;
                    break;
                case SyntaxKind.TrueKeyword:
                    value = true;
                    break;
                case SyntaxKind.FalseKeyword:
                    value = false;
                    break;
                default:
                    return noMatch;
            }
            scanNext();
            return value;
        }
        function parseProperty(result) {
            var key = parseString();
            if (key === noMatch) {
                handleError(nls.localize(2, null), [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
                return false;
            }
            if (_scanner.getToken() === SyntaxKind.ColonToken) {
                scanNext(); // consume colon
                var value = parseValue();
                if (value !== noMatch) {
                    result[key] = value;
                }
                else {
                    handleError(nls.localize(3, null), [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
                }
            }
            else {
                handleError(nls.localize(4, null), [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
            }
            return true;
        }
        function parseObject() {
            if (_scanner.getToken() !== SyntaxKind.OpenBraceToken) {
                return noMatch;
            }
            var obj = {};
            scanNext(); // consume open brace
            var needsComma = false;
            while (_scanner.getToken() !== SyntaxKind.CloseBraceToken && _scanner.getToken() !== SyntaxKind.EOF) {
                if (_scanner.getToken() === SyntaxKind.CommaToken) {
                    if (!needsComma) {
                        handleError(nls.localize(5, null), [], []);
                    }
                    scanNext(); // consume comma
                }
                else if (needsComma) {
                    handleError(nls.localize(6, null), [], []);
                }
                var propertyParsed = parseProperty(obj);
                if (!propertyParsed) {
                    handleError(nls.localize(7, null), [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
                }
                needsComma = true;
            }
            if (_scanner.getToken() !== SyntaxKind.CloseBraceToken) {
                handleError(nls.localize(8, null), [SyntaxKind.CloseBraceToken], []);
            }
            else {
                scanNext(); // consume close brace
            }
            return obj;
        }
        function parseArray() {
            if (_scanner.getToken() !== SyntaxKind.OpenBracketToken) {
                return noMatch;
            }
            var arr = [];
            scanNext(); // consume open bracket
            var needsComma = false;
            while (_scanner.getToken() !== SyntaxKind.CloseBracketToken && _scanner.getToken() !== SyntaxKind.EOF) {
                if (_scanner.getToken() === SyntaxKind.CommaToken) {
                    if (!needsComma) {
                        handleError(nls.localize(9, null), [], []);
                    }
                    scanNext(); // consume comma
                }
                else if (needsComma) {
                    handleError(nls.localize(10, null), [], []);
                }
                var value = parseValue();
                if (value === noMatch) {
                    handleError(nls.localize(11, null), [], [SyntaxKind.CloseBracketToken, SyntaxKind.CommaToken]);
                }
                else {
                    arr.push(value);
                }
                needsComma = true;
            }
            if (_scanner.getToken() !== SyntaxKind.CloseBracketToken) {
                handleError(nls.localize(12, null), [SyntaxKind.CloseBracketToken], []);
            }
            else {
                scanNext(); // consume close bracket
            }
            return arr;
        }
        function parseValue() {
            var result = parseArray();
            if (result !== noMatch) {
                return result;
            }
            result = parseObject();
            if (result !== noMatch) {
                return result;
            }
            result = parseString();
            if (result !== noMatch) {
                return result;
            }
            return parseLiteral();
        }
        scanNext();
        var value = parseValue();
        if (value === noMatch) {
            handleError(nls.localize(13, null), [], []);
            return void 0;
        }
        if (_scanner.getToken() !== SyntaxKind.EOF) {
            handleError(nls.localize(14, null), [], []);
        }
        return value;
    }
    exports.parse = parse;
});

define("vs/nls!vs/base/common/keyCodes",['vs/nls', 'vs/nls!vs/workbench/electron-main/main'], function(nls, data) { return nls.create("vs/base/common/keyCodes", data); });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/common/keyCodes", ["require", "exports", 'vs/nls!vs/base/common/keyCodes', 'vs/base/common/platform'], function (require, exports, nls, defaultPlatform) {
    'use strict';
    /**
     * Virtual Key Codes, the value does not hold any inherent meaning.
     * Inspired somewhat from https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
     * But these are "more general", as they should work across browsers & OS`s.
     */
    (function (KeyCode) {
        /**
         * Placed first to cover the 0 value of the enum.
         */
        KeyCode[KeyCode["Unknown"] = 0] = "Unknown";
        KeyCode[KeyCode["Backspace"] = 1] = "Backspace";
        KeyCode[KeyCode["Tab"] = 2] = "Tab";
        KeyCode[KeyCode["Enter"] = 3] = "Enter";
        KeyCode[KeyCode["Shift"] = 4] = "Shift";
        KeyCode[KeyCode["Ctrl"] = 5] = "Ctrl";
        KeyCode[KeyCode["Alt"] = 6] = "Alt";
        KeyCode[KeyCode["PauseBreak"] = 7] = "PauseBreak";
        KeyCode[KeyCode["CapsLock"] = 8] = "CapsLock";
        KeyCode[KeyCode["Escape"] = 9] = "Escape";
        KeyCode[KeyCode["Space"] = 10] = "Space";
        KeyCode[KeyCode["PageUp"] = 11] = "PageUp";
        KeyCode[KeyCode["PageDown"] = 12] = "PageDown";
        KeyCode[KeyCode["End"] = 13] = "End";
        KeyCode[KeyCode["Home"] = 14] = "Home";
        KeyCode[KeyCode["LeftArrow"] = 15] = "LeftArrow";
        KeyCode[KeyCode["UpArrow"] = 16] = "UpArrow";
        KeyCode[KeyCode["RightArrow"] = 17] = "RightArrow";
        KeyCode[KeyCode["DownArrow"] = 18] = "DownArrow";
        KeyCode[KeyCode["Insert"] = 19] = "Insert";
        KeyCode[KeyCode["Delete"] = 20] = "Delete";
        KeyCode[KeyCode["KEY_0"] = 21] = "KEY_0";
        KeyCode[KeyCode["KEY_1"] = 22] = "KEY_1";
        KeyCode[KeyCode["KEY_2"] = 23] = "KEY_2";
        KeyCode[KeyCode["KEY_3"] = 24] = "KEY_3";
        KeyCode[KeyCode["KEY_4"] = 25] = "KEY_4";
        KeyCode[KeyCode["KEY_5"] = 26] = "KEY_5";
        KeyCode[KeyCode["KEY_6"] = 27] = "KEY_6";
        KeyCode[KeyCode["KEY_7"] = 28] = "KEY_7";
        KeyCode[KeyCode["KEY_8"] = 29] = "KEY_8";
        KeyCode[KeyCode["KEY_9"] = 30] = "KEY_9";
        KeyCode[KeyCode["KEY_A"] = 31] = "KEY_A";
        KeyCode[KeyCode["KEY_B"] = 32] = "KEY_B";
        KeyCode[KeyCode["KEY_C"] = 33] = "KEY_C";
        KeyCode[KeyCode["KEY_D"] = 34] = "KEY_D";
        KeyCode[KeyCode["KEY_E"] = 35] = "KEY_E";
        KeyCode[KeyCode["KEY_F"] = 36] = "KEY_F";
        KeyCode[KeyCode["KEY_G"] = 37] = "KEY_G";
        KeyCode[KeyCode["KEY_H"] = 38] = "KEY_H";
        KeyCode[KeyCode["KEY_I"] = 39] = "KEY_I";
        KeyCode[KeyCode["KEY_J"] = 40] = "KEY_J";
        KeyCode[KeyCode["KEY_K"] = 41] = "KEY_K";
        KeyCode[KeyCode["KEY_L"] = 42] = "KEY_L";
        KeyCode[KeyCode["KEY_M"] = 43] = "KEY_M";
        KeyCode[KeyCode["KEY_N"] = 44] = "KEY_N";
        KeyCode[KeyCode["KEY_O"] = 45] = "KEY_O";
        KeyCode[KeyCode["KEY_P"] = 46] = "KEY_P";
        KeyCode[KeyCode["KEY_Q"] = 47] = "KEY_Q";
        KeyCode[KeyCode["KEY_R"] = 48] = "KEY_R";
        KeyCode[KeyCode["KEY_S"] = 49] = "KEY_S";
        KeyCode[KeyCode["KEY_T"] = 50] = "KEY_T";
        KeyCode[KeyCode["KEY_U"] = 51] = "KEY_U";
        KeyCode[KeyCode["KEY_V"] = 52] = "KEY_V";
        KeyCode[KeyCode["KEY_W"] = 53] = "KEY_W";
        KeyCode[KeyCode["KEY_X"] = 54] = "KEY_X";
        KeyCode[KeyCode["KEY_Y"] = 55] = "KEY_Y";
        KeyCode[KeyCode["KEY_Z"] = 56] = "KEY_Z";
        KeyCode[KeyCode["Meta"] = 57] = "Meta";
        KeyCode[KeyCode["ContextMenu"] = 58] = "ContextMenu";
        KeyCode[KeyCode["F1"] = 59] = "F1";
        KeyCode[KeyCode["F2"] = 60] = "F2";
        KeyCode[KeyCode["F3"] = 61] = "F3";
        KeyCode[KeyCode["F4"] = 62] = "F4";
        KeyCode[KeyCode["F5"] = 63] = "F5";
        KeyCode[KeyCode["F6"] = 64] = "F6";
        KeyCode[KeyCode["F7"] = 65] = "F7";
        KeyCode[KeyCode["F8"] = 66] = "F8";
        KeyCode[KeyCode["F9"] = 67] = "F9";
        KeyCode[KeyCode["F10"] = 68] = "F10";
        KeyCode[KeyCode["F11"] = 69] = "F11";
        KeyCode[KeyCode["F12"] = 70] = "F12";
        KeyCode[KeyCode["F13"] = 71] = "F13";
        KeyCode[KeyCode["F14"] = 72] = "F14";
        KeyCode[KeyCode["F15"] = 73] = "F15";
        KeyCode[KeyCode["F16"] = 74] = "F16";
        KeyCode[KeyCode["F17"] = 75] = "F17";
        KeyCode[KeyCode["F18"] = 76] = "F18";
        KeyCode[KeyCode["F19"] = 77] = "F19";
        KeyCode[KeyCode["NumLock"] = 78] = "NumLock";
        KeyCode[KeyCode["ScrollLock"] = 79] = "ScrollLock";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the ';:' key
         */
        KeyCode[KeyCode["US_SEMICOLON"] = 80] = "US_SEMICOLON";
        /**
         * For any country/region, the '+' key
         * For the US standard keyboard, the '=+' key
         */
        KeyCode[KeyCode["US_EQUAL"] = 81] = "US_EQUAL";
        /**
         * For any country/region, the ',' key
         * For the US standard keyboard, the ',<' key
         */
        KeyCode[KeyCode["US_COMMA"] = 82] = "US_COMMA";
        /**
         * For any country/region, the '-' key
         * For the US standard keyboard, the '-_' key
         */
        KeyCode[KeyCode["US_MINUS"] = 83] = "US_MINUS";
        /**
         * For any country/region, the '.' key
         * For the US standard keyboard, the '.>' key
         */
        KeyCode[KeyCode["US_DOT"] = 84] = "US_DOT";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the '/?' key
         */
        KeyCode[KeyCode["US_SLASH"] = 85] = "US_SLASH";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the '`~' key
         */
        KeyCode[KeyCode["US_BACKTICK"] = 86] = "US_BACKTICK";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the '[{' key
         */
        KeyCode[KeyCode["US_OPEN_SQUARE_BRACKET"] = 87] = "US_OPEN_SQUARE_BRACKET";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the '\|' key
         */
        KeyCode[KeyCode["US_BACKSLASH"] = 88] = "US_BACKSLASH";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the ']}' key
         */
        KeyCode[KeyCode["US_CLOSE_SQUARE_BRACKET"] = 89] = "US_CLOSE_SQUARE_BRACKET";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the ''"' key
         */
        KeyCode[KeyCode["US_QUOTE"] = 90] = "US_QUOTE";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         */
        KeyCode[KeyCode["OEM_8"] = 91] = "OEM_8";
        /**
         * Either the angle bracket key or the backslash key on the RT 102-key keyboard.
         */
        KeyCode[KeyCode["OEM_102"] = 92] = "OEM_102";
        KeyCode[KeyCode["NUMPAD_0"] = 93] = "NUMPAD_0";
        KeyCode[KeyCode["NUMPAD_1"] = 94] = "NUMPAD_1";
        KeyCode[KeyCode["NUMPAD_2"] = 95] = "NUMPAD_2";
        KeyCode[KeyCode["NUMPAD_3"] = 96] = "NUMPAD_3";
        KeyCode[KeyCode["NUMPAD_4"] = 97] = "NUMPAD_4";
        KeyCode[KeyCode["NUMPAD_5"] = 98] = "NUMPAD_5";
        KeyCode[KeyCode["NUMPAD_6"] = 99] = "NUMPAD_6";
        KeyCode[KeyCode["NUMPAD_7"] = 100] = "NUMPAD_7";
        KeyCode[KeyCode["NUMPAD_8"] = 101] = "NUMPAD_8";
        KeyCode[KeyCode["NUMPAD_9"] = 102] = "NUMPAD_9";
        KeyCode[KeyCode["NUMPAD_MULTIPLY"] = 103] = "NUMPAD_MULTIPLY";
        KeyCode[KeyCode["NUMPAD_ADD"] = 104] = "NUMPAD_ADD";
        KeyCode[KeyCode["NUMPAD_SEPARATOR"] = 105] = "NUMPAD_SEPARATOR";
        KeyCode[KeyCode["NUMPAD_SUBTRACT"] = 106] = "NUMPAD_SUBTRACT";
        KeyCode[KeyCode["NUMPAD_DECIMAL"] = 107] = "NUMPAD_DECIMAL";
        KeyCode[KeyCode["NUMPAD_DIVIDE"] = 108] = "NUMPAD_DIVIDE";
        /**
         * Placed last to cover the length of the enum.
         */
        KeyCode[KeyCode["MAX_VALUE"] = 109] = "MAX_VALUE";
    })(exports.KeyCode || (exports.KeyCode = {}));
    var KeyCode = exports.KeyCode;
    var Mapping = (function () {
        function Mapping(fromKeyCode, toKeyCode) {
            this._fromKeyCode = fromKeyCode;
            this._toKeyCode = toKeyCode;
        }
        Mapping.prototype.fromKeyCode = function (keyCode) {
            return this._fromKeyCode[keyCode];
        };
        Mapping.prototype.toKeyCode = function (str) {
            if (this._toKeyCode.hasOwnProperty(str)) {
                return this._toKeyCode[str];
            }
            return KeyCode.Unknown;
        };
        return Mapping;
    }());
    function createMapping(fill1, fill2) {
        var MAP = [];
        fill1(MAP);
        var REVERSE_MAP = {};
        for (var i = 0, len = MAP.length; i < len; i++) {
            if (!MAP[i]) {
                continue;
            }
            REVERSE_MAP[MAP[i]] = i;
        }
        fill2(REVERSE_MAP);
        var FINAL_REVERSE_MAP = {};
        for (var entry in REVERSE_MAP) {
            if (REVERSE_MAP.hasOwnProperty(entry)) {
                FINAL_REVERSE_MAP[entry] = REVERSE_MAP[entry];
                FINAL_REVERSE_MAP[entry.toLowerCase()] = REVERSE_MAP[entry];
            }
        }
        return new Mapping(MAP, FINAL_REVERSE_MAP);
    }
    var STRING = createMapping(function (TO_STRING_MAP) {
        TO_STRING_MAP[KeyCode.Unknown] = 'unknown';
        TO_STRING_MAP[KeyCode.Backspace] = 'Backspace';
        TO_STRING_MAP[KeyCode.Tab] = 'Tab';
        TO_STRING_MAP[KeyCode.Enter] = 'Enter';
        TO_STRING_MAP[KeyCode.Shift] = 'Shift';
        TO_STRING_MAP[KeyCode.Ctrl] = 'Ctrl';
        TO_STRING_MAP[KeyCode.Alt] = 'Alt';
        TO_STRING_MAP[KeyCode.PauseBreak] = 'PauseBreak';
        TO_STRING_MAP[KeyCode.CapsLock] = 'CapsLock';
        TO_STRING_MAP[KeyCode.Escape] = 'Escape';
        TO_STRING_MAP[KeyCode.Space] = 'Space';
        TO_STRING_MAP[KeyCode.PageUp] = 'PageUp';
        TO_STRING_MAP[KeyCode.PageDown] = 'PageDown';
        TO_STRING_MAP[KeyCode.End] = 'End';
        TO_STRING_MAP[KeyCode.Home] = 'Home';
        TO_STRING_MAP[KeyCode.LeftArrow] = 'LeftArrow';
        TO_STRING_MAP[KeyCode.UpArrow] = 'UpArrow';
        TO_STRING_MAP[KeyCode.RightArrow] = 'RightArrow';
        TO_STRING_MAP[KeyCode.DownArrow] = 'DownArrow';
        TO_STRING_MAP[KeyCode.Insert] = 'Insert';
        TO_STRING_MAP[KeyCode.Delete] = 'Delete';
        TO_STRING_MAP[KeyCode.KEY_0] = '0';
        TO_STRING_MAP[KeyCode.KEY_1] = '1';
        TO_STRING_MAP[KeyCode.KEY_2] = '2';
        TO_STRING_MAP[KeyCode.KEY_3] = '3';
        TO_STRING_MAP[KeyCode.KEY_4] = '4';
        TO_STRING_MAP[KeyCode.KEY_5] = '5';
        TO_STRING_MAP[KeyCode.KEY_6] = '6';
        TO_STRING_MAP[KeyCode.KEY_7] = '7';
        TO_STRING_MAP[KeyCode.KEY_8] = '8';
        TO_STRING_MAP[KeyCode.KEY_9] = '9';
        TO_STRING_MAP[KeyCode.KEY_A] = 'A';
        TO_STRING_MAP[KeyCode.KEY_B] = 'B';
        TO_STRING_MAP[KeyCode.KEY_C] = 'C';
        TO_STRING_MAP[KeyCode.KEY_D] = 'D';
        TO_STRING_MAP[KeyCode.KEY_E] = 'E';
        TO_STRING_MAP[KeyCode.KEY_F] = 'F';
        TO_STRING_MAP[KeyCode.KEY_G] = 'G';
        TO_STRING_MAP[KeyCode.KEY_H] = 'H';
        TO_STRING_MAP[KeyCode.KEY_I] = 'I';
        TO_STRING_MAP[KeyCode.KEY_J] = 'J';
        TO_STRING_MAP[KeyCode.KEY_K] = 'K';
        TO_STRING_MAP[KeyCode.KEY_L] = 'L';
        TO_STRING_MAP[KeyCode.KEY_M] = 'M';
        TO_STRING_MAP[KeyCode.KEY_N] = 'N';
        TO_STRING_MAP[KeyCode.KEY_O] = 'O';
        TO_STRING_MAP[KeyCode.KEY_P] = 'P';
        TO_STRING_MAP[KeyCode.KEY_Q] = 'Q';
        TO_STRING_MAP[KeyCode.KEY_R] = 'R';
        TO_STRING_MAP[KeyCode.KEY_S] = 'S';
        TO_STRING_MAP[KeyCode.KEY_T] = 'T';
        TO_STRING_MAP[KeyCode.KEY_U] = 'U';
        TO_STRING_MAP[KeyCode.KEY_V] = 'V';
        TO_STRING_MAP[KeyCode.KEY_W] = 'W';
        TO_STRING_MAP[KeyCode.KEY_X] = 'X';
        TO_STRING_MAP[KeyCode.KEY_Y] = 'Y';
        TO_STRING_MAP[KeyCode.KEY_Z] = 'Z';
        TO_STRING_MAP[KeyCode.ContextMenu] = 'ContextMenu';
        TO_STRING_MAP[KeyCode.F1] = 'F1';
        TO_STRING_MAP[KeyCode.F2] = 'F2';
        TO_STRING_MAP[KeyCode.F3] = 'F3';
        TO_STRING_MAP[KeyCode.F4] = 'F4';
        TO_STRING_MAP[KeyCode.F5] = 'F5';
        TO_STRING_MAP[KeyCode.F6] = 'F6';
        TO_STRING_MAP[KeyCode.F7] = 'F7';
        TO_STRING_MAP[KeyCode.F8] = 'F8';
        TO_STRING_MAP[KeyCode.F9] = 'F9';
        TO_STRING_MAP[KeyCode.F10] = 'F10';
        TO_STRING_MAP[KeyCode.F11] = 'F11';
        TO_STRING_MAP[KeyCode.F12] = 'F12';
        TO_STRING_MAP[KeyCode.F13] = 'F13';
        TO_STRING_MAP[KeyCode.F14] = 'F14';
        TO_STRING_MAP[KeyCode.F15] = 'F15';
        TO_STRING_MAP[KeyCode.F16] = 'F16';
        TO_STRING_MAP[KeyCode.F17] = 'F17';
        TO_STRING_MAP[KeyCode.F18] = 'F18';
        TO_STRING_MAP[KeyCode.F19] = 'F19';
        TO_STRING_MAP[KeyCode.NumLock] = 'NumLock';
        TO_STRING_MAP[KeyCode.ScrollLock] = 'ScrollLock';
        TO_STRING_MAP[KeyCode.US_SEMICOLON] = ';';
        TO_STRING_MAP[KeyCode.US_EQUAL] = '=';
        TO_STRING_MAP[KeyCode.US_COMMA] = ',';
        TO_STRING_MAP[KeyCode.US_MINUS] = '-';
        TO_STRING_MAP[KeyCode.US_DOT] = '.';
        TO_STRING_MAP[KeyCode.US_SLASH] = '/';
        TO_STRING_MAP[KeyCode.US_BACKTICK] = '`';
        TO_STRING_MAP[KeyCode.US_OPEN_SQUARE_BRACKET] = '[';
        TO_STRING_MAP[KeyCode.US_BACKSLASH] = '\\';
        TO_STRING_MAP[KeyCode.US_CLOSE_SQUARE_BRACKET] = ']';
        TO_STRING_MAP[KeyCode.US_QUOTE] = '\'';
        TO_STRING_MAP[KeyCode.OEM_8] = 'OEM_8';
        TO_STRING_MAP[KeyCode.OEM_102] = 'OEM_102';
        TO_STRING_MAP[KeyCode.NUMPAD_0] = 'NumPad0';
        TO_STRING_MAP[KeyCode.NUMPAD_1] = 'NumPad1';
        TO_STRING_MAP[KeyCode.NUMPAD_2] = 'NumPad2';
        TO_STRING_MAP[KeyCode.NUMPAD_3] = 'NumPad3';
        TO_STRING_MAP[KeyCode.NUMPAD_4] = 'NumPad4';
        TO_STRING_MAP[KeyCode.NUMPAD_5] = 'NumPad5';
        TO_STRING_MAP[KeyCode.NUMPAD_6] = 'NumPad6';
        TO_STRING_MAP[KeyCode.NUMPAD_7] = 'NumPad7';
        TO_STRING_MAP[KeyCode.NUMPAD_8] = 'NumPad8';
        TO_STRING_MAP[KeyCode.NUMPAD_9] = 'NumPad9';
        TO_STRING_MAP[KeyCode.NUMPAD_MULTIPLY] = 'NumPad_Multiply';
        TO_STRING_MAP[KeyCode.NUMPAD_ADD] = 'NumPad_Add';
        TO_STRING_MAP[KeyCode.NUMPAD_SEPARATOR] = 'NumPad_Separator';
        TO_STRING_MAP[KeyCode.NUMPAD_SUBTRACT] = 'NumPad_Subtract';
        TO_STRING_MAP[KeyCode.NUMPAD_DECIMAL] = 'NumPad_Decimal';
        TO_STRING_MAP[KeyCode.NUMPAD_DIVIDE] = 'NumPad_Divide';
        // for (let i = 0; i < KeyCode.MAX_VALUE; i++) {
        // 	if (!TO_STRING_MAP[i]) {
        // 		console.warn('Missing string representation for ' + KeyCode[i]);
        // 	}
        // }
    }, function (FROM_STRING_MAP) {
        FROM_STRING_MAP['\r'] = KeyCode.Enter;
    });
    var USER_SETTINGS = createMapping(function (TO_USER_SETTINGS_MAP) {
        for (var i = 0, len = STRING._fromKeyCode.length; i < len; i++) {
            TO_USER_SETTINGS_MAP[i] = STRING._fromKeyCode[i];
        }
        TO_USER_SETTINGS_MAP[KeyCode.LeftArrow] = 'Left';
        TO_USER_SETTINGS_MAP[KeyCode.UpArrow] = 'Up';
        TO_USER_SETTINGS_MAP[KeyCode.RightArrow] = 'Right';
        TO_USER_SETTINGS_MAP[KeyCode.DownArrow] = 'Down';
    }, function (FROM_USER_SETTINGS_MAP) {
        FROM_USER_SETTINGS_MAP['OEM_1'] = KeyCode.US_SEMICOLON;
        FROM_USER_SETTINGS_MAP['OEM_PLUS'] = KeyCode.US_EQUAL;
        FROM_USER_SETTINGS_MAP['OEM_COMMA'] = KeyCode.US_COMMA;
        FROM_USER_SETTINGS_MAP['OEM_MINUS'] = KeyCode.US_MINUS;
        FROM_USER_SETTINGS_MAP['OEM_PERIOD'] = KeyCode.US_DOT;
        FROM_USER_SETTINGS_MAP['OEM_2'] = KeyCode.US_SLASH;
        FROM_USER_SETTINGS_MAP['OEM_3'] = KeyCode.US_BACKTICK;
        FROM_USER_SETTINGS_MAP['OEM_4'] = KeyCode.US_OPEN_SQUARE_BRACKET;
        FROM_USER_SETTINGS_MAP['OEM_5'] = KeyCode.US_BACKSLASH;
        FROM_USER_SETTINGS_MAP['OEM_6'] = KeyCode.US_CLOSE_SQUARE_BRACKET;
        FROM_USER_SETTINGS_MAP['OEM_7'] = KeyCode.US_QUOTE;
        FROM_USER_SETTINGS_MAP['OEM_8'] = KeyCode.OEM_8;
        FROM_USER_SETTINGS_MAP['OEM_102'] = KeyCode.OEM_102;
    });
    var KeyCode;
    (function (KeyCode) {
        function toString(key) {
            return STRING.fromKeyCode(key);
        }
        KeyCode.toString = toString;
        function fromString(key) {
            return STRING.toKeyCode(key);
        }
        KeyCode.fromString = fromString;
    })(KeyCode = exports.KeyCode || (exports.KeyCode = {}));
    // Binary encoding strategy:
    // 15:  1 bit for ctrlCmd
    // 14:  1 bit for shift
    // 13:  1 bit for alt
    // 12:  1 bit for winCtrl
    //  0: 12 bits for keyCode (up to a maximum keyCode of 4096. Given we have 83 at this point thats good enough)
    var BIN_CTRLCMD_MASK = 1 << 15;
    var BIN_SHIFT_MASK = 1 << 14;
    var BIN_ALT_MASK = 1 << 13;
    var BIN_WINCTRL_MASK = 1 << 12;
    var BIN_KEYCODE_MASK = 0x00000fff;
    var BinaryKeybindings = (function () {
        function BinaryKeybindings() {
        }
        BinaryKeybindings.extractFirstPart = function (keybinding) {
            return keybinding & 0x0000ffff;
        };
        BinaryKeybindings.extractChordPart = function (keybinding) {
            return (keybinding >> 16) & 0x0000ffff;
        };
        BinaryKeybindings.hasChord = function (keybinding) {
            return (this.extractChordPart(keybinding) !== 0);
        };
        BinaryKeybindings.hasCtrlCmd = function (keybinding) {
            return (keybinding & BIN_CTRLCMD_MASK ? true : false);
        };
        BinaryKeybindings.hasShift = function (keybinding) {
            return (keybinding & BIN_SHIFT_MASK ? true : false);
        };
        BinaryKeybindings.hasAlt = function (keybinding) {
            return (keybinding & BIN_ALT_MASK ? true : false);
        };
        BinaryKeybindings.hasWinCtrl = function (keybinding) {
            return (keybinding & BIN_WINCTRL_MASK ? true : false);
        };
        BinaryKeybindings.extractKeyCode = function (keybinding) {
            return (keybinding & BIN_KEYCODE_MASK);
        };
        return BinaryKeybindings;
    }());
    exports.BinaryKeybindings = BinaryKeybindings;
    var KeyMod = (function () {
        function KeyMod() {
        }
        KeyMod.chord = function (firstPart, secondPart) {
            return firstPart | ((secondPart & 0x0000ffff) << 16);
        };
        KeyMod.CtrlCmd = BIN_CTRLCMD_MASK;
        KeyMod.Shift = BIN_SHIFT_MASK;
        KeyMod.Alt = BIN_ALT_MASK;
        KeyMod.WinCtrl = BIN_WINCTRL_MASK;
        return KeyMod;
    }());
    exports.KeyMod = KeyMod;
    /**
     * A set of usual keybindings that can be reused in code
     */
    var CommonKeybindings = (function () {
        function CommonKeybindings() {
        }
        CommonKeybindings.ENTER = KeyCode.Enter;
        CommonKeybindings.SHIFT_ENTER = KeyMod.Shift | KeyCode.Enter;
        CommonKeybindings.CTRLCMD_ENTER = KeyMod.CtrlCmd | KeyCode.Enter;
        CommonKeybindings.WINCTRL_ENTER = KeyMod.WinCtrl | KeyCode.Enter;
        CommonKeybindings.TAB = KeyCode.Tab;
        CommonKeybindings.SHIFT_TAB = KeyMod.Shift | KeyCode.Tab;
        CommonKeybindings.ESCAPE = KeyCode.Escape;
        CommonKeybindings.SPACE = KeyCode.Space;
        CommonKeybindings.DELETE = KeyCode.Delete;
        CommonKeybindings.SHIFT_DELETE = KeyMod.Shift | KeyCode.Delete;
        CommonKeybindings.CTRLCMD_BACKSPACE = KeyMod.CtrlCmd | KeyCode.Backspace;
        CommonKeybindings.UP_ARROW = KeyCode.UpArrow;
        CommonKeybindings.SHIFT_UP_ARROW = KeyMod.Shift | KeyCode.UpArrow;
        CommonKeybindings.CTRLCMD_UP_ARROW = KeyMod.CtrlCmd | KeyCode.UpArrow;
        CommonKeybindings.DOWN_ARROW = KeyCode.DownArrow;
        CommonKeybindings.SHIFT_DOWN_ARROW = KeyMod.Shift | KeyCode.DownArrow;
        CommonKeybindings.CTRLCMD_DOWN_ARROW = KeyMod.CtrlCmd | KeyCode.DownArrow;
        CommonKeybindings.LEFT_ARROW = KeyCode.LeftArrow;
        CommonKeybindings.RIGHT_ARROW = KeyCode.RightArrow;
        CommonKeybindings.PAGE_UP = KeyCode.PageUp;
        CommonKeybindings.SHIFT_PAGE_UP = KeyMod.Shift | KeyCode.PageUp;
        CommonKeybindings.PAGE_DOWN = KeyCode.PageDown;
        CommonKeybindings.SHIFT_PAGE_DOWN = KeyMod.Shift | KeyCode.PageDown;
        CommonKeybindings.F2 = KeyCode.F2;
        CommonKeybindings.CTRLCMD_S = KeyMod.CtrlCmd | KeyCode.KEY_S;
        CommonKeybindings.CTRLCMD_C = KeyMod.CtrlCmd | KeyCode.KEY_C;
        CommonKeybindings.CTRLCMD_V = KeyMod.CtrlCmd | KeyCode.KEY_V;
        return CommonKeybindings;
    }());
    exports.CommonKeybindings = CommonKeybindings;
    var Keybinding = (function () {
        function Keybinding(keybinding) {
            this.value = keybinding;
        }
        /**
         * Format the binding to a format appropiate for rendering in the UI
         */
        Keybinding._toUSLabel = function (value, Platform) {
            return _asString(value, (Platform.isMacintosh ? MacUIKeyLabelProvider.INSTANCE : ClassicUIKeyLabelProvider.INSTANCE), Platform);
        };
        /**
         * Format the binding to a format appropiate for placing in an aria-label.
         */
        Keybinding._toUSAriaLabel = function (value, Platform) {
            return _asString(value, AriaKeyLabelProvider.INSTANCE, Platform);
        };
        /**
         * Format the binding to a format appropiate for rendering in the UI
         */
        Keybinding._toUSHTMLLabel = function (value, Platform) {
            return _asHTML(value, (Platform.isMacintosh ? MacUIKeyLabelProvider.INSTANCE : ClassicUIKeyLabelProvider.INSTANCE), Platform);
        };
        /**
         * Format the binding to a format appropiate for rendering in the UI
         */
        Keybinding._toCustomLabel = function (value, labelProvider, Platform) {
            return _asString(value, labelProvider, Platform);
        };
        /**
         * Format the binding to a format appropiate for rendering in the UI
         */
        Keybinding._toCustomHTMLLabel = function (value, labelProvider, Platform) {
            return _asHTML(value, labelProvider, Platform);
        };
        /**
         * This prints the binding in a format suitable for electron's accelerators.
         * See https://github.com/atom/electron/blob/master/docs/api/accelerator.md
         */
        Keybinding._toElectronAccelerator = function (value, Platform) {
            if (BinaryKeybindings.hasChord(value)) {
                // Electron cannot handle chords
                return null;
            }
            return _asString(value, ElectronAcceleratorLabelProvider.INSTANCE, Platform);
        };
        Keybinding.getUserSettingsKeybindingRegex = function () {
            if (!this._cachedKeybindingRegex) {
                var numpadKey = 'numpad(0|1|2|3|4|5|6|7|8|9|_multiply|_add|_subtract|_decimal|_divide|_separator)';
                var oemKey = '`|\\-|=|\\[|\\]|\\\\\\\\|;|\'|,|\\.|\\/|oem_8|oem_102';
                var specialKey = 'left|up|right|down|pageup|pagedown|end|home|tab|enter|escape|space|backspace|delete|pausebreak|capslock|insert|contextmenu|numlock|scrolllock';
                var casualKey = '[a-z]|[0-9]|f(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19)';
                var key = '((' + [numpadKey, oemKey, specialKey, casualKey].join(')|(') + '))';
                var mod = '((ctrl|shift|alt|cmd|win|meta)\\+)*';
                var keybinding = '(' + mod + key + ')';
                this._cachedKeybindingRegex = '"\\s*(' + keybinding + '(\\s+' + keybinding + ')?' + ')\\s*"';
            }
            return this._cachedKeybindingRegex;
        };
        /**
         * Format the binding to a format appropiate for the user settings file.
         */
        Keybinding.toUserSettingsLabel = function (value, Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            var result = _asString(value, UserSettingsKeyLabelProvider.INSTANCE, Platform);
            result = result.toLowerCase();
            if (Platform.isMacintosh) {
                result = result.replace(/meta/g, 'cmd');
            }
            else if (Platform.isWindows) {
                result = result.replace(/meta/g, 'win');
            }
            return result;
        };
        Keybinding.fromUserSettingsLabel = function (input, Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            if (!input) {
                return null;
            }
            input = input.toLowerCase().trim();
            var ctrlCmd = false, shift = false, alt = false, winCtrl = false, key = '';
            while (/^(ctrl|shift|alt|meta|win|cmd)(\+|\-)/.test(input)) {
                if (/^ctrl(\+|\-)/.test(input)) {
                    if (Platform.isMacintosh) {
                        winCtrl = true;
                    }
                    else {
                        ctrlCmd = true;
                    }
                    input = input.substr('ctrl-'.length);
                }
                if (/^shift(\+|\-)/.test(input)) {
                    shift = true;
                    input = input.substr('shift-'.length);
                }
                if (/^alt(\+|\-)/.test(input)) {
                    alt = true;
                    input = input.substr('alt-'.length);
                }
                if (/^meta(\+|\-)/.test(input)) {
                    if (Platform.isMacintosh) {
                        ctrlCmd = true;
                    }
                    else {
                        winCtrl = true;
                    }
                    input = input.substr('meta-'.length);
                }
                if (/^win(\+|\-)/.test(input)) {
                    if (Platform.isMacintosh) {
                        ctrlCmd = true;
                    }
                    else {
                        winCtrl = true;
                    }
                    input = input.substr('win-'.length);
                }
                if (/^cmd(\+|\-)/.test(input)) {
                    if (Platform.isMacintosh) {
                        ctrlCmd = true;
                    }
                    else {
                        winCtrl = true;
                    }
                    input = input.substr('cmd-'.length);
                }
            }
            var chord = 0;
            var firstSpaceIdx = input.indexOf(' ');
            if (firstSpaceIdx > 0) {
                key = input.substring(0, firstSpaceIdx);
                chord = Keybinding.fromUserSettingsLabel(input.substring(firstSpaceIdx), Platform);
            }
            else {
                key = input;
            }
            var keyCode = USER_SETTINGS.toKeyCode(key);
            var result = 0;
            if (ctrlCmd) {
                result |= KeyMod.CtrlCmd;
            }
            if (shift) {
                result |= KeyMod.Shift;
            }
            if (alt) {
                result |= KeyMod.Alt;
            }
            if (winCtrl) {
                result |= KeyMod.WinCtrl;
            }
            result |= keyCode;
            return KeyMod.chord(result, chord);
        };
        Keybinding.prototype.hasCtrlCmd = function () {
            return BinaryKeybindings.hasCtrlCmd(this.value);
        };
        Keybinding.prototype.hasShift = function () {
            return BinaryKeybindings.hasShift(this.value);
        };
        Keybinding.prototype.hasAlt = function () {
            return BinaryKeybindings.hasAlt(this.value);
        };
        Keybinding.prototype.hasWinCtrl = function () {
            return BinaryKeybindings.hasWinCtrl(this.value);
        };
        Keybinding.prototype.extractKeyCode = function () {
            return BinaryKeybindings.extractKeyCode(this.value);
        };
        /**
         * Format the binding to a format appropiate for rendering in the UI
         */
        Keybinding.prototype._toUSLabel = function (Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            return Keybinding._toUSLabel(this.value, Platform);
        };
        /**
         * Format the binding to a format appropiate for placing in an aria-label.
         */
        Keybinding.prototype._toUSAriaLabel = function (Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            return Keybinding._toUSAriaLabel(this.value, Platform);
        };
        /**
         * Format the binding to a format appropiate for rendering in the UI
         */
        Keybinding.prototype._toUSHTMLLabel = function (Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            return Keybinding._toUSHTMLLabel(this.value, Platform);
        };
        /**
         * Format the binding to a format appropiate for rendering in the UI
         */
        Keybinding.prototype.toCustomLabel = function (labelProvider, Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            return Keybinding._toCustomLabel(this.value, labelProvider, Platform);
        };
        /**
         * Format the binding to a format appropiate for rendering in the UI
         */
        Keybinding.prototype.toCustomHTMLLabel = function (labelProvider, Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            return Keybinding._toCustomHTMLLabel(this.value, labelProvider, Platform);
        };
        /**
         * This prints the binding in a format suitable for electron's accelerators.
         * See https://github.com/atom/electron/blob/master/docs/api/accelerator.md
         */
        Keybinding.prototype._toElectronAccelerator = function (Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            return Keybinding._toElectronAccelerator(this.value, Platform);
        };
        /**
         * Format the binding to a format appropiate for the user settings file.
         */
        Keybinding.prototype.toUserSettingsLabel = function (Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            return Keybinding.toUserSettingsLabel(this.value, Platform);
        };
        Keybinding._cachedKeybindingRegex = null;
        return Keybinding;
    }());
    exports.Keybinding = Keybinding;
    /**
     * Print for Electron
     */
    var ElectronAcceleratorLabelProvider = (function () {
        function ElectronAcceleratorLabelProvider() {
            this.ctrlKeyLabel = 'Ctrl';
            this.shiftKeyLabel = 'Shift';
            this.altKeyLabel = 'Alt';
            this.cmdKeyLabel = 'Cmd';
            this.windowsKeyLabel = 'Super';
            this.modifierSeparator = '+';
        }
        ElectronAcceleratorLabelProvider.prototype.getLabelForKey = function (keyCode) {
            switch (keyCode) {
                case KeyCode.UpArrow:
                    return 'Up';
                case KeyCode.DownArrow:
                    return 'Down';
                case KeyCode.LeftArrow:
                    return 'Left';
                case KeyCode.RightArrow:
                    return 'Right';
            }
            return KeyCode.toString(keyCode);
        };
        ElectronAcceleratorLabelProvider.INSTANCE = new ElectronAcceleratorLabelProvider();
        return ElectronAcceleratorLabelProvider;
    }());
    exports.ElectronAcceleratorLabelProvider = ElectronAcceleratorLabelProvider;
    /**
     * Print for Mac UI
     */
    var MacUIKeyLabelProvider = (function () {
        function MacUIKeyLabelProvider() {
            this.ctrlKeyLabel = '\u2303';
            this.shiftKeyLabel = '\u21E7';
            this.altKeyLabel = '\u2325';
            this.cmdKeyLabel = '\u2318';
            this.windowsKeyLabel = nls.localize(0, null);
            this.modifierSeparator = '';
        }
        MacUIKeyLabelProvider.prototype.getLabelForKey = function (keyCode) {
            switch (keyCode) {
                case KeyCode.LeftArrow:
                    return MacUIKeyLabelProvider.leftArrowUnicodeLabel;
                case KeyCode.UpArrow:
                    return MacUIKeyLabelProvider.upArrowUnicodeLabel;
                case KeyCode.RightArrow:
                    return MacUIKeyLabelProvider.rightArrowUnicodeLabel;
                case KeyCode.DownArrow:
                    return MacUIKeyLabelProvider.downArrowUnicodeLabel;
            }
            return KeyCode.toString(keyCode);
        };
        MacUIKeyLabelProvider.INSTANCE = new MacUIKeyLabelProvider();
        MacUIKeyLabelProvider.leftArrowUnicodeLabel = String.fromCharCode(8592);
        MacUIKeyLabelProvider.upArrowUnicodeLabel = String.fromCharCode(8593);
        MacUIKeyLabelProvider.rightArrowUnicodeLabel = String.fromCharCode(8594);
        MacUIKeyLabelProvider.downArrowUnicodeLabel = String.fromCharCode(8595);
        return MacUIKeyLabelProvider;
    }());
    exports.MacUIKeyLabelProvider = MacUIKeyLabelProvider;
    /**
     * Aria label provider for Mac.
     */
    var AriaKeyLabelProvider = (function () {
        function AriaKeyLabelProvider() {
            this.ctrlKeyLabel = nls.localize(1, null);
            this.shiftKeyLabel = nls.localize(2, null);
            this.altKeyLabel = nls.localize(3, null);
            this.cmdKeyLabel = nls.localize(4, null);
            this.windowsKeyLabel = nls.localize(5, null);
            this.modifierSeparator = '+';
        }
        AriaKeyLabelProvider.prototype.getLabelForKey = function (keyCode) {
            return KeyCode.toString(keyCode);
        };
        AriaKeyLabelProvider.INSTANCE = new MacUIKeyLabelProvider();
        return AriaKeyLabelProvider;
    }());
    exports.AriaKeyLabelProvider = AriaKeyLabelProvider;
    /**
     * Print for Windows, Linux UI
     */
    var ClassicUIKeyLabelProvider = (function () {
        function ClassicUIKeyLabelProvider() {
            this.ctrlKeyLabel = nls.localize(6, null);
            this.shiftKeyLabel = nls.localize(7, null);
            this.altKeyLabel = nls.localize(8, null);
            this.cmdKeyLabel = nls.localize(9, null);
            this.windowsKeyLabel = nls.localize(10, null);
            this.modifierSeparator = '+';
        }
        ClassicUIKeyLabelProvider.prototype.getLabelForKey = function (keyCode) {
            return KeyCode.toString(keyCode);
        };
        ClassicUIKeyLabelProvider.INSTANCE = new ClassicUIKeyLabelProvider();
        return ClassicUIKeyLabelProvider;
    }());
    exports.ClassicUIKeyLabelProvider = ClassicUIKeyLabelProvider;
    /**
     * Print for the user settings file.
     */
    var UserSettingsKeyLabelProvider = (function () {
        function UserSettingsKeyLabelProvider() {
            this.ctrlKeyLabel = 'Ctrl';
            this.shiftKeyLabel = 'Shift';
            this.altKeyLabel = 'Alt';
            this.cmdKeyLabel = 'Meta';
            this.windowsKeyLabel = 'Meta';
            this.modifierSeparator = '+';
        }
        UserSettingsKeyLabelProvider.prototype.getLabelForKey = function (keyCode) {
            return USER_SETTINGS.fromKeyCode(keyCode);
        };
        UserSettingsKeyLabelProvider.INSTANCE = new UserSettingsKeyLabelProvider();
        return UserSettingsKeyLabelProvider;
    }());
    function _asString(keybinding, labelProvider, Platform) {
        var result = [], ctrlCmd = BinaryKeybindings.hasCtrlCmd(keybinding), shift = BinaryKeybindings.hasShift(keybinding), alt = BinaryKeybindings.hasAlt(keybinding), winCtrl = BinaryKeybindings.hasWinCtrl(keybinding), keyCode = BinaryKeybindings.extractKeyCode(keybinding);
        var keyLabel = labelProvider.getLabelForKey(keyCode);
        if (!keyLabel) {
            // cannot trigger this key code under this kb layout
            return '';
        }
        // translate modifier keys: Ctrl-Shift-Alt-Meta
        if ((ctrlCmd && !Platform.isMacintosh) || (winCtrl && Platform.isMacintosh)) {
            result.push(labelProvider.ctrlKeyLabel);
        }
        if (shift) {
            result.push(labelProvider.shiftKeyLabel);
        }
        if (alt) {
            result.push(labelProvider.altKeyLabel);
        }
        if (ctrlCmd && Platform.isMacintosh) {
            result.push(labelProvider.cmdKeyLabel);
        }
        if (winCtrl && !Platform.isMacintosh) {
            result.push(labelProvider.windowsKeyLabel);
        }
        // the actual key
        result.push(keyLabel);
        var actualResult = result.join(labelProvider.modifierSeparator);
        if (BinaryKeybindings.hasChord(keybinding)) {
            return actualResult + ' ' + _asString(BinaryKeybindings.extractChordPart(keybinding), labelProvider, Platform);
        }
        return actualResult;
    }
    function _pushKey(result, str) {
        if (result.length > 0) {
            result.push({
                tagName: 'span',
                text: '+'
            });
        }
        result.push({
            tagName: 'span',
            className: 'monaco-kbkey',
            text: str
        });
    }
    function _asHTML(keybinding, labelProvider, Platform, isChord) {
        if (isChord === void 0) { isChord = false; }
        var result = [], ctrlCmd = BinaryKeybindings.hasCtrlCmd(keybinding), shift = BinaryKeybindings.hasShift(keybinding), alt = BinaryKeybindings.hasAlt(keybinding), winCtrl = BinaryKeybindings.hasWinCtrl(keybinding), keyCode = BinaryKeybindings.extractKeyCode(keybinding);
        var keyLabel = labelProvider.getLabelForKey(keyCode);
        if (!keyLabel) {
            // cannot trigger this key code under this kb layout
            return [];
        }
        // translate modifier keys: Ctrl-Shift-Alt-Meta
        if ((ctrlCmd && !Platform.isMacintosh) || (winCtrl && Platform.isMacintosh)) {
            _pushKey(result, labelProvider.ctrlKeyLabel);
        }
        if (shift) {
            _pushKey(result, labelProvider.shiftKeyLabel);
        }
        if (alt) {
            _pushKey(result, labelProvider.altKeyLabel);
        }
        if (ctrlCmd && Platform.isMacintosh) {
            _pushKey(result, labelProvider.cmdKeyLabel);
        }
        if (winCtrl && !Platform.isMacintosh) {
            _pushKey(result, labelProvider.windowsKeyLabel);
        }
        // the actual key
        _pushKey(result, keyLabel);
        var chordTo = null;
        if (BinaryKeybindings.hasChord(keybinding)) {
            chordTo = _asHTML(BinaryKeybindings.extractChordPart(keybinding), labelProvider, Platform, true);
            result.push({
                tagName: 'span',
                text: ' '
            });
            result = result.concat(chordTo);
        }
        if (isChord) {
            return result;
        }
        return [{
                tagName: 'span',
                className: 'monaco-kb',
                children: result
            }];
    }
});


define("vs/nls!vs/workbench/electron-main/menus",['vs/nls', 'vs/nls!vs/workbench/electron-main/main'], function(nls, data) { return nls.create("vs/workbench/electron-main/menus", data); });
define("vs/nls!vs/workbench/electron-main/windows",['vs/nls', 'vs/nls!vs/workbench/electron-main/main'], function(nls, data) { return nls.create("vs/workbench/electron-main/windows", data); });
define("vs/nls!vs/workbench/parts/git/electron-main/askpassService",['vs/nls', 'vs/nls!vs/workbench/electron-main/main'], function(nls, data) { return nls.create("vs/workbench/parts/git/electron-main/askpassService", data); });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/electron-main/env", ["require", "exports", 'crypto', 'fs', 'path', 'os', 'electron', 'vs/base/common/arrays', 'vs/base/common/strings', 'vs/base/common/paths', 'vs/base/common/platform', 'vs/base/common/uri', 'vs/base/common/types'], function (require, exports, crypto, fs, path, os, electron_1, arrays, strings, paths, platform, uri_1, types) {
    'use strict';
    exports.isBuilt = !process.env.VSCODE_DEV;
    exports.appRoot = path.dirname(uri_1.default.parse(require.toUrl('')).fsPath);
    var productContents;
    try {
        productContents = JSON.parse(fs.readFileSync(path.join(exports.appRoot, 'product.json'), 'utf8'));
    }
    catch (error) {
        productContents = Object.create(null);
    }
    exports.product = productContents;
    exports.product.nameShort = exports.product.nameShort + (exports.isBuilt ? '' : ' Dev');
    exports.product.nameLong = exports.product.nameLong + (exports.isBuilt ? '' : ' Dev');
    exports.product.dataFolderName = exports.product.dataFolderName + (exports.isBuilt ? '' : '-dev');
    exports.updateUrl = exports.product.updateUrl;
    exports.quality = exports.product.quality;
    exports.mainIPCHandle = getMainIPCHandle();
    exports.sharedIPCHandle = getSharedIPCHandle();
    exports.version = electron_1.app.getVersion();
    exports.cliArgs = parseCli();
    exports.appHome = electron_1.app.getPath('userData');
    exports.appSettingsHome = path.join(exports.appHome, 'User');
    if (!fs.existsSync(exports.appSettingsHome)) {
        fs.mkdirSync(exports.appSettingsHome);
    }
    exports.appSettingsPath = path.join(exports.appSettingsHome, 'settings.json');
    exports.appKeybindingsPath = path.join(exports.appSettingsHome, 'keybindings.json');
    exports.userHome = path.join(electron_1.app.getPath('home'), exports.product.dataFolderName);
    if (!fs.existsSync(exports.userHome)) {
        fs.mkdirSync(exports.userHome);
    }
    exports.userExtensionsHome = exports.cliArgs.pluginHomePath || path.join(exports.userHome, 'extensions');
    if (!fs.existsSync(exports.userExtensionsHome)) {
        fs.mkdirSync(exports.userExtensionsHome);
    }
    // Helper to identify if we have plugin tests to run from the command line without debugger
    exports.isTestingFromCli = exports.cliArgs.extensionTestsPath && !exports.cliArgs.debugBrkPluginHost;
    function log() {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i - 0] = arguments[_i];
        }
        if (exports.cliArgs.verboseLogging) {
            console.log.apply(null, a);
        }
    }
    exports.log = log;
    function parseCli() {
        // We need to do some argv massaging. First, remove the Electron executable
        var args = Array.prototype.slice.call(process.argv, 1);
        // Then, when in dev, remove the first non option argument, it will be the app location
        if (!exports.isBuilt) {
            var i = (function () {
                for (var j = 0; j < args.length; j++) {
                    if (args[j][0] !== '-') {
                        return j;
                    }
                }
                return -1;
            })();
            if (i > -1) {
                args.splice(i, 1);
            }
        }
        // Finally, any extra arguments in the 'argv' file should be prepended
        if (fs.existsSync(path.join(exports.appRoot, 'argv'))) {
            var extraargs = JSON.parse(fs.readFileSync(path.join(exports.appRoot, 'argv'), 'utf8'));
            args = extraargs.concat(args);
        }
        var opts = parseOpts(args);
        var gotoLineMode = !!opts['g'] || !!opts['goto'];
        var debugBrkPluginHostPort = parseNumber(args, '--debugBrkPluginHost', 5870);
        var debugPluginHostPort;
        var debugBrkPluginHost;
        if (debugBrkPluginHostPort) {
            debugPluginHostPort = debugBrkPluginHostPort;
            debugBrkPluginHost = true;
        }
        else {
            debugPluginHostPort = parseNumber(args, '--debugPluginHost', 5870, exports.isBuilt ? void 0 : 5870);
        }
        var pathArguments = parsePathArguments(args, gotoLineMode);
        return {
            pathArguments: pathArguments,
            programStart: parseNumber(args, '--timestamp', 0, 0),
            enablePerformance: !!opts['p'],
            verboseLogging: !!opts['verbose'],
            debugPluginHostPort: debugPluginHostPort,
            debugBrkPluginHost: debugBrkPluginHost,
            logPluginHostCommunication: !!opts['logPluginHostCommunication'],
            firstrun: !!opts['squirrel-firstrun'],
            openNewWindow: !!opts['n'] || !!opts['new-window'],
            openInSameWindow: !!opts['r'] || !!opts['reuse-window'],
            gotoLineMode: gotoLineMode,
            diffMode: (!!opts['d'] || !!opts['diff']) && pathArguments.length === 2,
            pluginHomePath: normalizePath(parseString(args, '--extensionHomePath')),
            extensionDevelopmentPath: normalizePath(parseString(args, '--extensionDevelopmentPath')),
            extensionTestsPath: normalizePath(parseString(args, '--extensionTestsPath')),
            disableExtensions: !!opts['disableExtensions'] || !!opts['disable-extensions'],
            locale: parseString(args, '--locale'),
            waitForWindowClose: !!opts['w'] || !!opts['wait']
        };
    }
    function getIPCHandleName() {
        var handleName = electron_1.app.getName();
        if (!exports.isBuilt) {
            handleName += '-dev';
        }
        // Support to run VS Code multiple times as different user
        // by making the socket unique over the logged in user
        var userId = uniqueUserId();
        if (userId) {
            handleName += ('-' + userId);
        }
        if (process.platform === 'win32') {
            return '\\\\.\\pipe\\' + handleName;
        }
        return path.join(os.tmpdir(), handleName);
    }
    function getMainIPCHandle() {
        return getIPCHandleName() + (process.platform === 'win32' ? '-sock' : '.sock');
    }
    function getSharedIPCHandle() {
        return getIPCHandleName() + '-shared' + (process.platform === 'win32' ? '-sock' : '.sock');
    }
    function uniqueUserId() {
        var username;
        if (platform.isWindows) {
            username = process.env.USERNAME;
        }
        else {
            username = process.env.USER;
        }
        if (!username) {
            return ''; // fail gracefully if there is no user name
        }
        // use sha256 to ensure the userid value can be used in filenames and are unique
        return crypto.createHash('sha256').update(username).digest('hex').substr(0, 6);
    }
    function parseOpts(argv) {
        return argv
            .filter(function (a) { return /^-/.test(a); })
            .map(function (a) { return a.replace(/^-*/, ''); })
            .reduce(function (r, a) { r[a] = true; return r; }, {});
    }
    function parsePathArguments(argv, gotoLineMode) {
        return arrays.coalesce(// no invalid paths
        arrays.distinct(// no duplicates
        argv.filter(function (a) { return !(/^-/.test(a)); }) // arguments without leading "-"
            .map(function (arg) {
            var pathCandidate = arg;
            var parsedPath;
            if (gotoLineMode) {
                parsedPath = parseLineAndColumnAware(arg);
                pathCandidate = parsedPath.path;
            }
            if (pathCandidate) {
                pathCandidate = massagePath(pathCandidate);
            }
            var realPath;
            try {
                realPath = fs.realpathSync(pathCandidate);
            }
            catch (error) {
                // in case of an error, assume the user wants to create this file
                // if the path is relative, we join it to the cwd
                realPath = path.normalize(path.isAbsolute(pathCandidate) ? pathCandidate : path.join(process.cwd(), pathCandidate));
            }
            if (!paths.isValidBasename(path.basename(realPath))) {
                return null; // do not allow invalid file names
            }
            if (gotoLineMode) {
                parsedPath.path = realPath;
                return toLineAndColumnPath(parsedPath);
            }
            return realPath;
        }), function (element) {
            return element && (platform.isWindows || platform.isMacintosh) ? element.toLowerCase() : element; // only linux is case sensitive on the fs
        }));
    }
    function massagePath(path) {
        if (platform.isWindows) {
            path = strings.rtrim(path, '"'); // https://github.com/Microsoft/vscode/issues/1498
        }
        // Trim whitespaces
        path = strings.trim(strings.trim(path, ' '), '\t');
        // Trim '.' chars on Windows to prevent invalid file names
        if (platform.isWindows) {
            path = strings.rtrim(resolvePath(path), '.');
        }
        return path;
    }
    function normalizePath(p) {
        return p ? path.normalize(p) : p;
    }
    function resolvePath(p) {
        return p ? path.resolve(p) : p;
    }
    function parseNumber(argv, key, defaultValue, fallbackValue) {
        var value;
        for (var i = 0; i < argv.length; i++) {
            var segments = argv[i].split('=');
            if (segments[0] === key) {
                value = Number(segments[1]) || defaultValue;
                break;
            }
        }
        return types.isNumber(value) ? value : fallbackValue;
    }
    function parseString(argv, key, defaultValue, fallbackValue) {
        var value;
        for (var i = 0; i < argv.length; i++) {
            var segments = argv[i].split('=');
            if (segments[0] === key) {
                value = String(segments[1]) || defaultValue;
                break;
            }
        }
        return types.isString(value) ? strings.trim(value, '"') : fallbackValue;
    }
    function getPlatformIdentifier() {
        if (process.platform === 'linux') {
            return "linux-" + process.arch;
        }
        return process.platform;
    }
    exports.getPlatformIdentifier = getPlatformIdentifier;
    function parseLineAndColumnAware(rawPath) {
        var segments = rawPath.split(':'); // C:\file.txt:<line>:<column>
        var path;
        var line = null;
        var column = null;
        segments.forEach(function (segment) {
            var segmentAsNumber = Number(segment);
            if (!types.isNumber(segmentAsNumber)) {
                path = !!path ? [path, segment].join(':') : segment; // a colon can well be part of a path (e.g. C:\...)
            }
            else if (line === null) {
                line = segmentAsNumber;
            }
            else if (column === null) {
                column = segmentAsNumber;
            }
        });
        return {
            path: path,
            line: line !== null ? line : void 0,
            column: column !== null ? column : line !== null ? 1 : void 0 // if we have a line, make sure column is also set
        };
    }
    exports.parseLineAndColumnAware = parseLineAndColumnAware;
    function toLineAndColumnPath(parsedPath) {
        var segments = [parsedPath.path];
        if (types.isNumber(parsedPath.line)) {
            segments.push(String(parsedPath.line));
        }
        if (types.isNumber(parsedPath.column)) {
            segments.push(String(parsedPath.column));
        }
        return segments.join(':');
    }
    exports.toLineAndColumnPath = toLineAndColumnPath;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/electron-main/storage", ["require", "exports", 'path', 'fs', 'events', 'vs/workbench/electron-main/env'], function (require, exports, path, fs, events, env) {
    'use strict';
    var dbPath = path.join(env.appHome, 'storage.json');
    var database = null;
    var EventTypes = {
        STORE: 'store'
    };
    var eventEmitter = new events.EventEmitter();
    function onStore(clb) {
        eventEmitter.addListener(EventTypes.STORE, clb);
        return function () { return eventEmitter.removeListener(EventTypes.STORE, clb); };
    }
    exports.onStore = onStore;
    function getItem(key, defaultValue) {
        if (!database) {
            database = load();
        }
        var res = database[key];
        if (typeof res === 'undefined') {
            return defaultValue;
        }
        return database[key];
    }
    exports.getItem = getItem;
    function setItem(key, data) {
        if (!database) {
            database = load();
        }
        // Shortcut for primitives that did not change
        if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
            if (database[key] === data) {
                return;
            }
        }
        var oldValue = database[key];
        database[key] = data;
        save();
        eventEmitter.emit(EventTypes.STORE, key, oldValue, data);
    }
    exports.setItem = setItem;
    function removeItem(key) {
        if (!database) {
            database = load();
        }
        if (database[key]) {
            var oldValue = database[key];
            delete database[key];
            save();
            eventEmitter.emit(EventTypes.STORE, key, oldValue, null);
        }
    }
    exports.removeItem = removeItem;
    function load() {
        try {
            return JSON.parse(fs.readFileSync(dbPath).toString());
        }
        catch (error) {
            if (env.cliArgs.verboseLogging) {
                console.error(error);
            }
            return {};
        }
    }
    function save() {
        fs.writeFileSync(dbPath, JSON.stringify(database, null, 4));
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/electron-main/window", ["require", "exports", 'path', 'os', 'electron', 'vs/base/common/winjs.base', 'vs/base/common/platform', 'vs/base/common/objects', 'vs/workbench/electron-main/env', 'vs/workbench/electron-main/storage'], function (require, exports, path, os, electron_1, winjs_base_1, platform, objects, env, storage) {
    'use strict';
    (function (WindowMode) {
        WindowMode[WindowMode["Maximized"] = 0] = "Maximized";
        WindowMode[WindowMode["Normal"] = 1] = "Normal";
        WindowMode[WindowMode["Minimized"] = 2] = "Minimized";
    })(exports.WindowMode || (exports.WindowMode = {}));
    var WindowMode = exports.WindowMode;
    exports.defaultWindowState = function (mode) {
        if (mode === void 0) { mode = WindowMode.Normal; }
        return {
            width: 1024,
            height: 768,
            mode: mode
        };
    };
    (function (ReadyState) {
        /**
         * This window has not loaded any HTML yet
         */
        ReadyState[ReadyState["NONE"] = 0] = "NONE";
        /**
         * This window is loading HTML
         */
        ReadyState[ReadyState["LOADING"] = 1] = "LOADING";
        /**
         * This window is navigating to another HTML
         */
        ReadyState[ReadyState["NAVIGATING"] = 2] = "NAVIGATING";
        /**
         * This window is done loading HTML
         */
        ReadyState[ReadyState["READY"] = 3] = "READY";
    })(exports.ReadyState || (exports.ReadyState = {}));
    var ReadyState = exports.ReadyState;
    var VSCodeWindow = (function () {
        function VSCodeWindow(config) {
            this._lastFocusTime = -1;
            this._readyState = ReadyState.NONE;
            this._extensionDevelopmentPath = config.extensionDevelopmentPath;
            this.whenReadyCallbacks = [];
            // Load window state
            this.restoreWindowState(config.state);
            // For VS theme we can show directly because background is white
            var usesLightTheme = /vs($| )/.test(storage.getItem(VSCodeWindow.themeStorageKey));
            var showDirectly = usesLightTheme;
            if (showDirectly && !global.windowShow) {
                global.windowShow = new Date().getTime();
            }
            var options = {
                width: this.windowState.width,
                height: this.windowState.height,
                x: this.windowState.x,
                y: this.windowState.y,
                backgroundColor: usesLightTheme ? '#FFFFFF' : '#1E1E1E',
                minWidth: VSCodeWindow.MIN_WIDTH,
                minHeight: VSCodeWindow.MIN_HEIGHT,
                show: showDirectly && this.currentWindowMode !== WindowMode.Maximized,
                title: env.product.nameLong
            };
            if (platform.isLinux) {
                // Windows and Mac are better off using the embedded icon(s)
                options.icon = path.join(env.appRoot, 'resources/linux/code.png');
            }
            // Create the browser window.
            this._win = new electron_1.BrowserWindow(options);
            this._id = this._win.id;
            if (showDirectly && this.currentWindowMode === WindowMode.Maximized) {
                this.win.maximize();
                if (!this.win.isVisible()) {
                    this.win.show(); // to reduce flicker from the default window size to maximize, we only show after maximize
                }
            }
            if (showDirectly) {
                this._lastFocusTime = new Date().getTime(); // since we show directly, we need to set the last focus time too
            }
            if (storage.getItem(VSCodeWindow.menuBarHiddenKey, false)) {
                this.setMenuBarVisibility(false); // respect configured menu bar visibility
            }
            this.registerListeners();
        }
        Object.defineProperty(VSCodeWindow.prototype, "isPluginDevelopmentHost", {
            get: function () {
                return !!this._extensionDevelopmentPath;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VSCodeWindow.prototype, "extensionDevelopmentPath", {
            get: function () {
                return this._extensionDevelopmentPath;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VSCodeWindow.prototype, "config", {
            get: function () {
                return this.currentConfig;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VSCodeWindow.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VSCodeWindow.prototype, "win", {
            get: function () {
                return this._win;
            },
            enumerable: true,
            configurable: true
        });
        VSCodeWindow.prototype.focus = function () {
            if (!this._win) {
                return;
            }
            // Windows 10: https://github.com/Microsoft/vscode/issues/929
            if (platform.isWindows && os.release() && os.release().indexOf('10.') === 0 && !this._win.isFocused()) {
                this._win.minimize();
                this._win.focus();
            }
            else {
                if (this._win.isMinimized()) {
                    this._win.restore();
                }
                this._win.focus();
            }
        };
        Object.defineProperty(VSCodeWindow.prototype, "lastFocusTime", {
            get: function () {
                return this._lastFocusTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VSCodeWindow.prototype, "openedWorkspacePath", {
            get: function () {
                return this.currentConfig.workspacePath;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VSCodeWindow.prototype, "openedFilePath", {
            get: function () {
                return this.currentConfig.filesToOpen && this.currentConfig.filesToOpen[0] && this.currentConfig.filesToOpen[0].filePath;
            },
            enumerable: true,
            configurable: true
        });
        VSCodeWindow.prototype.setReady = function () {
            this._readyState = ReadyState.READY;
            // inform all waiting promises that we are ready now
            while (this.whenReadyCallbacks.length) {
                this.whenReadyCallbacks.pop()(this);
            }
        };
        VSCodeWindow.prototype.ready = function () {
            var _this = this;
            return new winjs_base_1.TPromise(function (c) {
                if (_this._readyState === ReadyState.READY) {
                    return c(_this);
                }
                // otherwise keep and call later when we are ready
                _this.whenReadyCallbacks.push(c);
            });
        };
        Object.defineProperty(VSCodeWindow.prototype, "readyState", {
            get: function () {
                return this._readyState;
            },
            enumerable: true,
            configurable: true
        });
        VSCodeWindow.prototype.registerListeners = function () {
            var _this = this;
            // Remember that we loaded
            this._win.webContents.on('did-finish-load', function () {
                _this._readyState = ReadyState.LOADING;
                // Associate properties from the load request if provided
                if (_this.pendingLoadConfig) {
                    _this.currentConfig = _this.pendingLoadConfig;
                    _this.pendingLoadConfig = null;
                }
                // To prevent flashing, we set the window visible after the page has finished to load but before VSCode is loaded
                if (!_this.win.isVisible()) {
                    if (!global.windowShow) {
                        global.windowShow = new Date().getTime();
                    }
                    if (_this.currentWindowMode === WindowMode.Maximized) {
                        _this.win.maximize();
                    }
                    if (!_this.win.isVisible()) {
                        _this.win.show();
                    }
                }
            });
            // App commands support
            this._win.on('app-command', function (e, cmd) {
                if (_this.readyState !== ReadyState.READY) {
                    return; // window must be ready
                }
                // Support navigation via mouse buttons 4/5
                if (cmd === 'browser-backward') {
                    _this.send('vscode:runAction', 'workbench.action.navigateBack');
                }
                else if (cmd === 'browser-forward') {
                    _this.send('vscode:runAction', 'workbench.action.navigateForward');
                }
            });
            // Handle code that wants to open links
            this._win.webContents.on('new-window', function (event, url) {
                event.preventDefault();
                electron_1.shell.openExternal(url);
            });
            // Window Focus
            this._win.on('focus', function () {
                _this._lastFocusTime = new Date().getTime();
            });
            // Window Failed to load
            this._win.webContents.on('did-fail-load', function (event, errorCode, errorDescription) {
                console.warn('[electron event]: fail to load, ', errorDescription);
            });
            // Prevent any kind of navigation triggered by the user!
            // But do not touch this in dev version because it will prevent "Reload" from dev tools
            if (env.isBuilt) {
                this._win.webContents.on('will-navigate', function (event) {
                    if (event) {
                        event.preventDefault();
                    }
                });
            }
        };
        VSCodeWindow.prototype.load = function (config) {
            var _this = this;
            // If this is the first time the window is loaded, we associate the paths
            // directly with the window because we assume the loading will just work
            if (this.readyState === ReadyState.NONE) {
                this.currentConfig = config;
            }
            else {
                this.pendingLoadConfig = config;
                this._readyState = ReadyState.NAVIGATING;
            }
            // Load URL
            this._win.loadURL(this.getUrl(config));
            // Make window visible if it did not open in N seconds because this indicates an error
            if (!config.isBuilt) {
                this.showTimeoutHandle = setTimeout(function () {
                    if (_this._win && !_this._win.isVisible() && !_this._win.isMinimized()) {
                        _this._win.show();
                        _this._win.focus();
                        _this._win.webContents.openDevTools();
                    }
                }, 10000);
            }
        };
        VSCodeWindow.prototype.reload = function (cli) {
            // Inherit current properties but overwrite some
            var configuration = objects.mixin({}, this.currentConfig);
            delete configuration.filesToOpen;
            delete configuration.filesToCreate;
            delete configuration.filesToDiff;
            delete configuration.extensionsToInstall;
            // Some configuration things get inherited if the window is being reloaded and we are
            // in plugin development mode. These options are all development related.
            if (this.isPluginDevelopmentHost && cli) {
                configuration.verboseLogging = cli.verboseLogging;
                configuration.logPluginHostCommunication = cli.logPluginHostCommunication;
                configuration.debugPluginHostPort = cli.debugPluginHostPort;
                configuration.debugBrkPluginHost = cli.debugBrkPluginHost;
                configuration.pluginHomePath = cli.pluginHomePath;
            }
            // Load config
            this.load(configuration);
        };
        VSCodeWindow.prototype.getUrl = function (config) {
            var url = require.toUrl('vs/workbench/electron-browser/index.html');
            // Config
            url += '?config=' + encodeURIComponent(JSON.stringify(config));
            return url;
        };
        VSCodeWindow.prototype.serializeWindowState = function () {
            if (this.win.isFullScreen()) {
                return exports.defaultWindowState(); // ignore state when in fullscreen mode and return defaults
            }
            var state = Object.create(null);
            var mode;
            // get window mode
            if (!platform.isMacintosh && this.win.isMaximized()) {
                mode = WindowMode.Maximized;
            }
            else if (this.win.isMinimized()) {
                mode = WindowMode.Minimized;
            }
            else {
                mode = WindowMode.Normal;
            }
            // we don't want to save minimized state, only maximized or normal
            if (mode === WindowMode.Maximized) {
                state.mode = WindowMode.Maximized;
            }
            else if (mode !== WindowMode.Minimized) {
                state.mode = WindowMode.Normal;
            }
            // only consider non-minimized window states
            if (mode === WindowMode.Normal || mode === WindowMode.Maximized) {
                var pos = this.win.getPosition();
                var size = this.win.getSize();
                state.x = pos[0];
                state.y = pos[1];
                state.width = size[0];
                state.height = size[1];
            }
            return state;
        };
        VSCodeWindow.prototype.restoreWindowState = function (state) {
            if (state) {
                try {
                    state = this.validateWindowState(state);
                }
                catch (err) {
                    env.log("Unexpected error validating window state: " + err + "\n" + err.stack); // somehow display API can be picky about the state to validate
                }
            }
            if (!state) {
                state = exports.defaultWindowState();
            }
            this.windowState = state;
            this.currentWindowMode = this.windowState.mode;
        };
        VSCodeWindow.prototype.validateWindowState = function (state) {
            if (!state) {
                return null;
            }
            if ([state.x, state.y, state.width, state.height].some(function (n) { return typeof n !== 'number'; })) {
                return null;
            }
            if (state.width <= 0 || state.height <= 0) {
                return null;
            }
            var displays = electron_1.screen.getAllDisplays();
            // Single Monitor: be strict about x/y positioning
            if (displays.length === 1) {
                var displayBounds = displays[0].bounds;
                // Careful with maximized: in that mode x/y can well be negative!
                if (state.mode !== WindowMode.Maximized && displayBounds.width > 0 && displayBounds.height > 0 /* Linux X11 sessions sometimes report wrong display bounds */) {
                    if (state.x < displayBounds.x) {
                        state.x = displayBounds.x; // prevent window from falling out of the screen to the left
                    }
                    if (state.y < displayBounds.y) {
                        state.y = displayBounds.y; // prevent window from falling out of the screen to the top
                    }
                    if (state.x > (displayBounds.x + displayBounds.width)) {
                        state.x = displayBounds.x; // prevent window from falling out of the screen to the right
                    }
                    if (state.y > (displayBounds.y + displayBounds.height)) {
                        state.y = displayBounds.y; // prevent window from falling out of the screen to the bottom
                    }
                    if (state.width > displayBounds.width) {
                        state.width = displayBounds.width; // prevent window from exceeding display bounds width
                    }
                    if (state.height > displayBounds.height) {
                        state.height = displayBounds.height; // prevent window from exceeding display bounds height
                    }
                }
                if (state.mode === WindowMode.Maximized) {
                    return exports.defaultWindowState(WindowMode.Maximized); // when maximized, make sure we have good values when the user restores the window
                }
                return state;
            }
            // Multi Monitor: be less strict because metrics can be crazy
            var bounds = { x: state.x, y: state.y, width: state.width, height: state.height };
            var display = electron_1.screen.getDisplayMatching(bounds);
            if (display && display.bounds.x + display.bounds.width > bounds.x && display.bounds.y + display.bounds.height > bounds.y) {
                if (state.mode === WindowMode.Maximized) {
                    var defaults = exports.defaultWindowState(WindowMode.Maximized); // when maximized, make sure we have good values when the user restores the window
                    defaults.x = state.x; // carefull to keep x/y position so that the window ends up on the correct monitor
                    defaults.y = state.y;
                    return defaults;
                }
                return state;
            }
            return null;
        };
        VSCodeWindow.prototype.getBounds = function () {
            var pos = this.win.getPosition();
            var dimension = this.win.getSize();
            return { x: pos[0], y: pos[1], width: dimension[0], height: dimension[1] };
        };
        VSCodeWindow.prototype.toggleFullScreen = function () {
            var willBeFullScreen = !this.win.isFullScreen();
            this.win.setFullScreen(willBeFullScreen);
            // Windows & Linux: Hide the menu bar but still allow to bring it up by pressing the Alt key
            if (platform.isWindows || platform.isLinux) {
                if (willBeFullScreen) {
                    this.setMenuBarVisibility(false);
                }
                else {
                    this.setMenuBarVisibility(!storage.getItem(VSCodeWindow.menuBarHiddenKey, false)); // restore as configured
                }
            }
        };
        VSCodeWindow.prototype.setMenuBarVisibility = function (visible) {
            this.win.setMenuBarVisibility(visible);
            this.win.setAutoHideMenuBar(!visible);
        };
        VSCodeWindow.prototype.sendWhenReady = function (channel) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.ready().then(function () {
                _this.send.apply(_this, [channel].concat(args));
            });
        };
        VSCodeWindow.prototype.send = function (channel) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            (_a = this._win.webContents).send.apply(_a, [channel].concat(args));
            var _a;
        };
        VSCodeWindow.prototype.dispose = function () {
            if (this.showTimeoutHandle) {
                clearTimeout(this.showTimeoutHandle);
            }
            this._win = null; // Important to dereference the window object to allow for GC
        };
        VSCodeWindow.menuBarHiddenKey = 'menuBarHidden';
        VSCodeWindow.themeStorageKey = 'theme'; // TODO@Ben this key is only used to find out if a window can be shown instantly because of light theme, remove once we have support for bg color
        VSCodeWindow.MIN_WIDTH = 200;
        VSCodeWindow.MIN_HEIGHT = 120;
        return VSCodeWindow;
    }());
    exports.VSCodeWindow = VSCodeWindow;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/electron-main/lifecycle", ["require", "exports", 'events', 'electron', 'vs/base/common/winjs.base', 'vs/workbench/electron-main/window', 'vs/workbench/electron-main/env'], function (require, exports, events, electron_1, winjs_base_1, window_1, env) {
    'use strict';
    var eventEmitter = new events.EventEmitter();
    var EventTypes = {
        BEFORE_QUIT: 'before-quit'
    };
    /**
     * Due to the way we handle lifecycle with eventing, the general app.on('before-quit')
     * event cannot be used because it can be called twice on shutdown. Instead the onBeforeQuit
     * handler in this module can be used and it is only called once on a shutdown sequence.
     */
    function onBeforeQuit(clb) {
        eventEmitter.addListener(EventTypes.BEFORE_QUIT, clb);
        return function () { return eventEmitter.removeListener(EventTypes.BEFORE_QUIT, clb); };
    }
    exports.onBeforeQuit = onBeforeQuit;
    var Lifecycle = (function () {
        function Lifecycle() {
            this.windowToCloseRequest = Object.create(null);
            this.quitRequested = false;
            this.oneTimeListenerTokenGenerator = 0;
        }
        Lifecycle.prototype.ready = function () {
            this.registerListeners();
        };
        Lifecycle.prototype.registerListeners = function () {
            var _this = this;
            // before-quit
            electron_1.app.on('before-quit', function (e) {
                env.log('Lifecycle#before-quit');
                if (!_this.quitRequested) {
                    eventEmitter.emit(EventTypes.BEFORE_QUIT); // only send this if this is the first quit request we have
                }
                _this.quitRequested = true;
            });
            // window-all-closed
            electron_1.app.on('window-all-closed', function () {
                env.log('Lifecycle#window-all-closed');
                // Windows/Linux: we quit when all windows have closed
                // Mac: we only quit when quit was requested
                // --wait: we quit when all windows are closed
                if (_this.quitRequested || process.platform !== 'darwin' || env.cliArgs.waitForWindowClose) {
                    electron_1.app.quit();
                }
            });
        };
        Lifecycle.prototype.registerWindow = function (vscodeWindow) {
            var _this = this;
            // Window Before Closing: Main -> Renderer
            vscodeWindow.win.on('close', function (e) {
                var windowId = vscodeWindow.id;
                env.log('Lifecycle#window-before-close', windowId);
                // The window already acknowledged to be closed
                if (_this.windowToCloseRequest[windowId]) {
                    env.log('Lifecycle#window-close', windowId);
                    delete _this.windowToCloseRequest[windowId];
                    return;
                }
                // Otherwise prevent unload and handle it from window
                e.preventDefault();
                _this.unload(vscodeWindow).done(function (veto) {
                    if (!veto) {
                        _this.windowToCloseRequest[windowId] = true;
                        vscodeWindow.win.close();
                    }
                    else {
                        _this.quitRequested = false;
                        delete _this.windowToCloseRequest[windowId];
                    }
                });
            });
        };
        Lifecycle.prototype.unload = function (vscodeWindow) {
            var _this = this;
            env.log('Lifecycle#unload()', vscodeWindow.id);
            // Always allow to unload a window that is not yet ready
            if (vscodeWindow.readyState !== window_1.ReadyState.READY) {
                return winjs_base_1.TPromise.as(false);
            }
            return new winjs_base_1.TPromise(function (c) {
                var oneTimeEventToken = _this.oneTimeListenerTokenGenerator++;
                var oneTimeOkEvent = 'vscode:ok' + oneTimeEventToken;
                var oneTimeCancelEvent = 'vscode:cancel' + oneTimeEventToken;
                electron_1.ipcMain.once(oneTimeOkEvent, function () {
                    c(false); // no veto
                });
                electron_1.ipcMain.once(oneTimeCancelEvent, function () {
                    // Any cancellation also cancels a pending quit if present
                    if (_this.pendingQuitPromiseComplete) {
                        _this.pendingQuitPromiseComplete(true /* veto */);
                        _this.pendingQuitPromiseComplete = null;
                        _this.pendingQuitPromise = null;
                    }
                    c(true); // veto
                });
                vscodeWindow.send('vscode:beforeUnload', { okChannel: oneTimeOkEvent, cancelChannel: oneTimeCancelEvent });
            });
        };
        /**
         * A promise that completes to indicate if the quit request has been veto'd
         * by the user or not.
         */
        Lifecycle.prototype.quit = function () {
            var _this = this;
            env.log('Lifecycle#quit()');
            if (!this.pendingQuitPromise) {
                this.pendingQuitPromise = new winjs_base_1.TPromise(function (c) {
                    // Store as field to access it from a window cancellation
                    _this.pendingQuitPromiseComplete = c;
                    electron_1.app.once('will-quit', function () {
                        if (_this.pendingQuitPromiseComplete) {
                            _this.pendingQuitPromiseComplete(false /* no veto */);
                            _this.pendingQuitPromiseComplete = null;
                            _this.pendingQuitPromise = null;
                        }
                    });
                    electron_1.app.quit();
                });
            }
            return this.pendingQuitPromise;
        };
        return Lifecycle;
    }());
    exports.Lifecycle = Lifecycle;
    exports.manager = new Lifecycle();
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/node/userSettings", ["require", "exports", 'fs', 'path', 'vs/base/common/json', 'vs/base/common/objects', 'vs/base/common/winjs.base', 'vs/base/common/event'], function (require, exports, fs, path, json, objects, winjs_base_1, event_1) {
    'use strict';
    var UserSettings = (function () {
        function UserSettings(appSettingsPath, appKeybindingsPath) {
            this.appSettingsPath = appSettingsPath;
            this.appKeybindingsPath = appKeybindingsPath;
            this._onChange = new event_1.Emitter();
            this.registerWatchers();
        }
        UserSettings.getValue = function (contextService, key, fallback) {
            return new winjs_base_1.TPromise(function (c, e) {
                var appSettingsPath = contextService.getConfiguration().env.appSettingsPath;
                fs.readFile(appSettingsPath, function (error /* ignore */, fileContents) {
                    var root = Object.create(null);
                    var content = fileContents ? fileContents.toString() : '{}';
                    var contents = Object.create(null);
                    try {
                        contents = json.parse(content);
                    }
                    catch (error) {
                    }
                    for (var key_1 in contents) {
                        UserSettings.setNode(root, key_1, contents[key_1]);
                    }
                    return c(UserSettings.doGetValue(root, key, fallback));
                });
            });
        };
        Object.defineProperty(UserSettings.prototype, "onChange", {
            get: function () {
                return this._onChange.event;
            },
            enumerable: true,
            configurable: true
        });
        UserSettings.prototype.getValue = function (key, fallback) {
            return UserSettings.doGetValue(this.globalSettings.settings, key, fallback);
        };
        UserSettings.doGetValue = function (globalSettings, key, fallback) {
            if (!key) {
                return fallback;
            }
            var value = globalSettings;
            var parts = key.split('\.');
            while (parts.length && value) {
                var part = parts.shift();
                value = value[part];
            }
            return typeof value !== 'undefined' ? value : fallback;
        };
        UserSettings.prototype.registerWatchers = function () {
            var _this = this;
            this.watcher = fs.watch(path.dirname(this.appSettingsPath));
            this.watcher.on('change', function (eventType, fileName) { return _this.onSettingsFileChange(eventType, fileName); });
        };
        UserSettings.prototype.onSettingsFileChange = function (eventType, fileName) {
            var _this = this;
            // we can get multiple change events for one change, so we buffer through a timeout
            if (this.timeoutHandle) {
                global.clearTimeout(this.timeoutHandle);
                this.timeoutHandle = null;
            }
            this.timeoutHandle = global.setTimeout(function () {
                // Reload
                var didChange = _this.loadSync();
                // Emit event
                if (didChange) {
                    _this._onChange.fire(_this.globalSettings);
                }
            }, UserSettings.CHANGE_BUFFER_DELAY);
        };
        UserSettings.prototype.loadSync = function () {
            var loadedSettings = this.doLoadSync();
            if (!objects.equals(loadedSettings, this.globalSettings)) {
                // Keep in class
                this.globalSettings = loadedSettings;
                return true; // changed value
            }
            return false; // no changed value
        };
        UserSettings.prototype.doLoadSync = function () {
            var settings = this.doLoadSettingsSync();
            return {
                settings: settings.contents,
                settingsParseErrors: settings.parseErrors,
                keybindings: this.doLoadKeybindingsSync()
            };
        };
        UserSettings.prototype.doLoadSettingsSync = function () {
            var root = Object.create(null);
            var content = '{}';
            try {
                content = fs.readFileSync(this.appSettingsPath).toString();
            }
            catch (error) {
            }
            var contents = Object.create(null);
            try {
                contents = json.parse(content);
            }
            catch (error) {
                // parse problem
                return {
                    contents: Object.create(null),
                    parseErrors: [this.appSettingsPath]
                };
            }
            for (var key in contents) {
                UserSettings.setNode(root, key, contents[key]);
            }
            return {
                contents: root
            };
        };
        UserSettings.setNode = function (root, key, value) {
            var segments = key.split('.');
            var last = segments.pop();
            var curr = root;
            segments.forEach(function (s) {
                var obj = curr[s];
                switch (typeof obj) {
                    case 'undefined':
                        obj = curr[s] = {};
                        break;
                    case 'object':
                        break;
                    default:
                        console.log('Conflicting user settings: ' + key + ' at ' + s + ' with ' + JSON.stringify(obj));
                }
                curr = obj;
            });
            curr[last] = value;
        };
        UserSettings.prototype.doLoadKeybindingsSync = function () {
            try {
                return json.parse(fs.readFileSync(this.appKeybindingsPath).toString());
            }
            catch (error) {
            }
            return [];
        };
        UserSettings.prototype.dispose = function () {
            if (this.watcher) {
                this.watcher.close();
                this.watcher = null;
            }
        };
        UserSettings.CHANGE_BUFFER_DELAY = 300;
        return UserSettings;
    }());
    exports.UserSettings = UserSettings;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/workbench/electron-main/settings", ["require", "exports", 'electron', 'vs/workbench/electron-main/env', 'vs/workbench/node/userSettings'], function (require, exports, electron_1, env, userSettings_1) {
    'use strict';
    var SettingsManager = (function (_super) {
        __extends(SettingsManager, _super);
        function SettingsManager() {
            var _this = this;
            _super.call(this, env.appSettingsPath, env.appKeybindingsPath);
            electron_1.app.on('will-quit', function () {
                _this.dispose();
            });
        }
        SettingsManager.prototype.loadSync = function () {
            var settingsChanged = _super.prototype.loadSync.call(this);
            // Store into global so that any renderer can access the value with remote.getGlobal()
            if (settingsChanged) {
                global.globalSettingsValue = JSON.stringify(this.globalSettings);
            }
            return settingsChanged;
        };
        return SettingsManager;
    }(userSettings_1.UserSettings));
    exports.SettingsManager = SettingsManager;
    exports.manager = new SettingsManager();
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/workbench/electron-main/win32/auto-updater.win32", ["require", "exports", 'events', 'path', 'os', 'child_process', 'vs/base/node/pfs', 'vs/base/node/extfs', 'vs/base/common/types', 'vs/base/common/winjs.base', 'vs/base/node/request', 'vs/base/node/proxy', 'vs/workbench/electron-main/settings', 'vs/workbench/electron-main/lifecycle'], function (require, exports, events, path, os, cp, pfs, extfs_1, types_1, winjs_base_1, request_1, proxy_1, settings_1, lifecycle_1) {
    'use strict';
    var Win32AutoUpdaterImpl = (function (_super) {
        __extends(Win32AutoUpdaterImpl, _super);
        function Win32AutoUpdaterImpl() {
            _super.call(this);
            this.url = null;
            this.currentRequest = null;
        }
        Object.defineProperty(Win32AutoUpdaterImpl.prototype, "cachePath", {
            get: function () {
                var result = path.join(os.tmpdir(), 'vscode-update');
                return new winjs_base_1.TPromise(function (c, e) { return extfs_1.mkdirp(result, null, function (err) { return err ? e(err) : c(result); }); });
            },
            enumerable: true,
            configurable: true
        });
        Win32AutoUpdaterImpl.prototype.setFeedURL = function (url) {
            this.url = url;
        };
        Win32AutoUpdaterImpl.prototype.checkForUpdates = function () {
            var _this = this;
            if (!this.url) {
                throw new Error('No feed url set.');
            }
            if (this.currentRequest) {
                return;
            }
            this.emit('checking-for-update');
            var proxyUrl = settings_1.manager.getValue('http.proxy');
            var strictSSL = settings_1.manager.getValue('http.proxyStrictSSL', true);
            var agent = proxy_1.getProxyAgent(this.url, { proxyUrl: proxyUrl, strictSSL: strictSSL });
            this.currentRequest = request_1.json({ url: this.url, agent: agent })
                .then(function (update) {
                if (!update || !update.url || !update.version) {
                    _this.emit('update-not-available');
                    return _this.cleanup();
                }
                _this.emit('update-available');
                return _this.cleanup(update.version).then(function () {
                    return _this.getUpdatePackagePath(update.version).then(function (updatePackagePath) {
                        return pfs.exists(updatePackagePath).then(function (exists) {
                            if (exists) {
                                return winjs_base_1.TPromise.as(updatePackagePath);
                            }
                            var url = update.url;
                            var downloadPath = updatePackagePath + ".tmp";
                            var agent = proxy_1.getProxyAgent(url, { proxyUrl: proxyUrl, strictSSL: strictSSL });
                            return request_1.download(downloadPath, { url: url, agent: agent, strictSSL: strictSSL })
                                .then(function () { return pfs.rename(downloadPath, updatePackagePath); })
                                .then(function () { return updatePackagePath; });
                        });
                    }).then(function (updatePackagePath) {
                        _this.emit('update-downloaded', {}, update.releaseNotes, update.version, new Date(), _this.url, function () { return _this.quitAndUpdate(updatePackagePath); });
                    });
                });
            })
                .then(null, function (e) {
                if (types_1.isString(e) && /^Server returned/.test(e)) {
                    return;
                }
                _this.emit('update-not-available');
                _this.emit('error', e);
            })
                .then(function () { return _this.currentRequest = null; });
        };
        Win32AutoUpdaterImpl.prototype.getUpdatePackagePath = function (version) {
            return this.cachePath.then(function (cachePath) { return path.join(cachePath, "CodeSetup-" + version + ".exe"); });
        };
        Win32AutoUpdaterImpl.prototype.quitAndUpdate = function (updatePackagePath) {
            lifecycle_1.manager.quit().done(function (vetod) {
                if (vetod) {
                    return;
                }
                cp.spawn(updatePackagePath, ['/silent', '/mergetasks=runcode,!desktopicon,!quicklaunchicon'], {
                    detached: true,
                    stdio: ['ignore', 'ignore', 'ignore']
                });
            });
        };
        Win32AutoUpdaterImpl.prototype.cleanup = function (exceptVersion) {
            if (exceptVersion === void 0) { exceptVersion = null; }
            var filter = exceptVersion ? function (one) { return !(new RegExp(exceptVersion + "\\.exe$").test(one)); } : function () { return true; };
            return this.cachePath
                .then(function (cachePath) { return pfs.readdir(cachePath)
                .then(function (all) { return winjs_base_1.Promise.join(all
                .filter(filter)
                .map(function (one) { return pfs.unlink(path.join(cachePath, one)).then(null, function () { return null; }); })); }); });
        };
        return Win32AutoUpdaterImpl;
    }(events.EventEmitter));
    exports.Win32AutoUpdaterImpl = Win32AutoUpdaterImpl;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/workbench/electron-main/update-manager", ["require", "exports", 'fs', 'path', 'events', 'electron', 'vs/base/common/platform', 'vs/workbench/electron-main/env', 'vs/workbench/electron-main/settings', 'vs/workbench/electron-main/win32/auto-updater.win32', 'vs/workbench/electron-main/lifecycle'], function (require, exports, fs, path, events, electron, platform, env, settings, auto_updater_win32_1, lifecycle_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    (function (State) {
        State[State["Uninitialized"] = 0] = "Uninitialized";
        State[State["Idle"] = 1] = "Idle";
        State[State["CheckingForUpdate"] = 2] = "CheckingForUpdate";
        State[State["UpdateAvailable"] = 3] = "UpdateAvailable";
        State[State["UpdateDownloaded"] = 4] = "UpdateDownloaded";
    })(exports.State || (exports.State = {}));
    var State = exports.State;
    (function (ExplicitState) {
        ExplicitState[ExplicitState["Implicit"] = 0] = "Implicit";
        ExplicitState[ExplicitState["Explicit"] = 1] = "Explicit";
    })(exports.ExplicitState || (exports.ExplicitState = {}));
    var ExplicitState = exports.ExplicitState;
    var UpdateManager = (function (_super) {
        __extends(UpdateManager, _super);
        function UpdateManager() {
            _super.call(this);
            this._state = State.Uninitialized;
            this.explicitState = ExplicitState.Implicit;
            this._availableUpdate = null;
            this._lastCheckDate = null;
            this._feedUrl = null;
            this._channel = null;
            if (platform.isWindows) {
                this.raw = new auto_updater_win32_1.Win32AutoUpdaterImpl();
            }
            else if (platform.isMacintosh) {
                this.raw = electron.autoUpdater;
            }
            if (this.raw) {
                this.initRaw();
            }
        }
        UpdateManager.prototype.initRaw = function () {
            var _this = this;
            this.raw.on('error', function (event, message) {
                _this.emit('error', event, message);
                _this.setState(State.Idle);
            });
            this.raw.on('checking-for-update', function () {
                _this.emit('checking-for-update');
                _this.setState(State.CheckingForUpdate);
            });
            this.raw.on('update-available', function () {
                _this.emit('update-available');
                _this.setState(State.UpdateAvailable);
            });
            this.raw.on('update-not-available', function () {
                _this.emit('update-not-available', _this.explicitState === ExplicitState.Explicit);
                _this.setState(State.Idle);
            });
            this.raw.on('update-downloaded', function (event, releaseNotes, version, date, url, rawQuitAndUpdate) {
                var data = {
                    releaseNotes: releaseNotes,
                    version: version,
                    date: date,
                    quitAndUpdate: function () { return _this.quitAndUpdate(rawQuitAndUpdate); }
                };
                _this.emit('update-downloaded', data);
                _this.setState(State.UpdateDownloaded, data);
            });
        };
        UpdateManager.prototype.quitAndUpdate = function (rawQuitAndUpdate) {
            lifecycle_1.manager.quit().done(function (vetod) {
                if (vetod) {
                    return;
                }
                rawQuitAndUpdate();
            });
        };
        Object.defineProperty(UpdateManager.prototype, "feedUrl", {
            get: function () {
                return this._feedUrl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateManager.prototype, "channel", {
            get: function () {
                return this._channel;
            },
            enumerable: true,
            configurable: true
        });
        UpdateManager.prototype.initialize = function () {
            var _this = this;
            if (this.feedUrl) {
                return; // already initialized
            }
            var channel = UpdateManager.getUpdateChannel();
            var feedUrl = UpdateManager.getUpdateFeedUrl(channel);
            if (!feedUrl) {
                return; // updates not available
            }
            this._channel = channel;
            this._feedUrl = feedUrl;
            this.raw.setFeedURL(feedUrl);
            this.setState(State.Idle);
            // Check for updates on startup after 30 seconds
            var timer = setTimeout(function () { return _this.checkForUpdates(); }, 30 * 1000);
            // Clear timer when checking for update
            this.on('error', function (error, message) { return console.error(error, message); });
            // Clear timer when checking for update
            this.on('checking-for-update', function () { return clearTimeout(timer); });
            // If update not found, try again in 10 minutes
            this.on('update-not-available', function () {
                timer = setTimeout(function () { return _this.checkForUpdates(); }, 10 * 60 * 1000);
            });
        };
        Object.defineProperty(UpdateManager.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateManager.prototype, "availableUpdate", {
            get: function () {
                return this._availableUpdate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateManager.prototype, "lastCheckDate", {
            get: function () {
                return this._lastCheckDate;
            },
            enumerable: true,
            configurable: true
        });
        UpdateManager.prototype.checkForUpdates = function (explicit) {
            if (explicit === void 0) { explicit = false; }
            this.explicitState = explicit ? ExplicitState.Explicit : ExplicitState.Implicit;
            this._lastCheckDate = new Date();
            this.raw.checkForUpdates();
        };
        UpdateManager.prototype.setState = function (state, availableUpdate) {
            if (availableUpdate === void 0) { availableUpdate = null; }
            this._state = state;
            this._availableUpdate = availableUpdate;
            this.emit('change');
        };
        UpdateManager.getUpdateChannel = function () {
            var channel = settings.manager.getValue('update.channel') || 'default';
            return channel === 'none' ? null : env.quality;
        };
        UpdateManager.getUpdateFeedUrl = function (channel) {
            if (!channel) {
                return null;
            }
            if (platform.isLinux) {
                return null;
            }
            if (platform.isWindows && !fs.existsSync(path.join(path.dirname(process.execPath), 'unins000.exe'))) {
                return null;
            }
            if (!env.updateUrl || !env.product.commit) {
                return null;
            }
            return env.updateUrl + "/api/update/" + env.getPlatformIdentifier() + "/" + channel + "/" + env.product.commit;
        };
        return UpdateManager;
    }(events.EventEmitter));
    exports.UpdateManager = UpdateManager;
    exports.Instance = new UpdateManager();
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/electron-main/sharedProcess", ["require", "exports", 'child_process', 'vs/base/common/uri', 'vs/base/common/objects', 'vs/workbench/electron-main/env', 'vs/workbench/electron-main/settings', 'vs/workbench/electron-main/update-manager'], function (require, exports, cp, uri_1, objects_1, env, settings_1, update_manager_1) {
    "use strict";
    var boostrapPath = uri_1.default.parse(require.toUrl('bootstrap')).fsPath;
    function getEnvironment() {
        var configuration = objects_1.assign({}, env.cliArgs);
        configuration.execPath = process.execPath;
        configuration.appName = env.product.nameLong;
        configuration.appRoot = env.appRoot;
        configuration.version = env.version;
        configuration.commitHash = env.product.commit;
        configuration.appSettingsHome = env.appSettingsHome;
        configuration.appSettingsPath = env.appSettingsPath;
        configuration.appKeybindingsPath = env.appKeybindingsPath;
        configuration.userExtensionsHome = env.userExtensionsHome;
        configuration.isBuilt = env.isBuilt;
        configuration.updateFeedUrl = update_manager_1.Instance.feedUrl;
        configuration.updateChannel = update_manager_1.Instance.channel;
        configuration.extensionsGallery = env.product.extensionsGallery;
        return configuration;
    }
    function _spawnSharedProcess() {
        // Make sure the nls configuration travels to the shared process.
        var opts = {
            env: objects_1.assign(objects_1.assign({}, process.env), {
                AMD_ENTRYPOINT: 'vs/workbench/electron-main/sharedProcessMain'
            })
        };
        var result = cp.fork(boostrapPath, ['--type=SharedProcess'], opts);
        // handshake
        result.once('message', function () {
            result.send({
                configuration: {
                    env: getEnvironment()
                },
                contextServiceOptions: {
                    globalSettings: settings_1.manager.globalSettings
                }
            });
        });
        return result;
    }
    var spawnCount = 0;
    function spawnSharedProcess() {
        var child;
        var spawn = function () {
            if (++spawnCount > 10) {
                return;
            }
            child = _spawnSharedProcess();
            child.on('exit', spawn);
        };
        spawn();
        return {
            dispose: function () {
                if (child) {
                    child.removeListener('exit', spawn);
                    child.kill();
                    child = null;
                }
            }
        };
    }
    exports.spawnSharedProcess = spawnSharedProcess;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/electron-main/windows", ["require", "exports", 'events', 'path', 'fs', 'electron', 'vs/base/common/platform', 'vs/workbench/electron-main/env', 'vs/workbench/electron-main/window', 'vs/workbench/electron-main/lifecycle', 'vs/nls!vs/workbench/electron-main/windows', 'vs/base/common/paths', 'vs/base/common/arrays', 'vs/base/common/objects', 'vs/workbench/electron-main/storage', 'vs/workbench/electron-main/settings', 'vs/workbench/electron-main/update-manager'], function (require, exports, events, path, fs, electron_1, platform, env, window, lifecycle, nls, paths, arrays, objects, storage, settings, update_manager_1) {
    'use strict';
    var eventEmitter = new events.EventEmitter();
    var EventTypes = {
        OPEN: 'open',
        CLOSE: 'close',
        READY: 'ready'
    };
    function onOpen(clb) {
        eventEmitter.addListener(EventTypes.OPEN, clb);
        return function () { return eventEmitter.removeListener(EventTypes.OPEN, clb); };
    }
    exports.onOpen = onOpen;
    function onReady(clb) {
        eventEmitter.addListener(EventTypes.READY, clb);
        return function () { return eventEmitter.removeListener(EventTypes.READY, clb); };
    }
    exports.onReady = onReady;
    function onClose(clb) {
        eventEmitter.addListener(EventTypes.CLOSE, clb);
        return function () { return eventEmitter.removeListener(EventTypes.CLOSE, clb); };
    }
    exports.onClose = onClose;
    var WindowError;
    (function (WindowError) {
        WindowError[WindowError["UNRESPONSIVE"] = 0] = "UNRESPONSIVE";
        WindowError[WindowError["CRASHED"] = 1] = "CRASHED";
    })(WindowError || (WindowError = {}));
    var WindowsManager = (function () {
        function WindowsManager() {
        }
        WindowsManager.prototype.ready = function (initialUserEnv) {
            this.registerListeners();
            this.initialUserEnv = initialUserEnv;
            this.windowsState = storage.getItem(WindowsManager.windowsStateStorageKey) || { openedFolders: [] };
        };
        WindowsManager.prototype.registerListeners = function () {
            var _this = this;
            electron_1.app.on('activate', function (event, hasVisibleWindows) {
                env.log('App#activate');
                // Mac only event: reopen last window when we get activated
                if (!hasVisibleWindows) {
                    // We want to open the previously opened folder, so we dont pass on the path argument
                    var cliArgWithoutPath = objects.clone(env.cliArgs);
                    cliArgWithoutPath.pathArguments = [];
                    _this.windowsState.openedFolders = []; // make sure we do not restore too much
                    _this.open({ cli: cliArgWithoutPath });
                }
            });
            var macOpenFiles = [];
            var runningTimeout = null;
            electron_1.app.on('open-file', function (event, path) {
                env.log('App#open-file: ', path);
                event.preventDefault();
                // Keep in array because more might come!
                macOpenFiles.push(path);
                // Clear previous handler if any
                if (runningTimeout !== null) {
                    clearTimeout(runningTimeout);
                    runningTimeout = null;
                }
                // Handle paths delayed in case more are coming!
                runningTimeout = setTimeout(function () {
                    _this.open({ cli: env.cliArgs, pathsToOpen: macOpenFiles, preferNewWindow: true /* dropping on the dock prefers to open in a new window */ });
                    macOpenFiles = [];
                    runningTimeout = null;
                }, 100);
            });
            settings.manager.onChange(function (newSettings) {
                _this.sendToAll('vscode:optionsChange', JSON.stringify({ globalSettings: newSettings }));
            }, this);
            electron_1.ipcMain.on('vscode:startCrashReporter', function (event, config) {
                electron_1.crashReporter.start(config);
            });
            electron_1.ipcMain.on('vscode:windowOpen', function (event, paths, forceNewWindow) {
                env.log('IPC#vscode-windowOpen: ', paths);
                if (paths && paths.length) {
                    _this.open({ cli: env.cliArgs, pathsToOpen: paths, forceNewWindow: forceNewWindow });
                }
            });
            electron_1.ipcMain.on('vscode:workbenchLoaded', function (event, windowId) {
                env.log('IPC#vscode-workbenchLoaded');
                var win = _this.getWindowById(windowId);
                if (win) {
                    win.setReady();
                    // Event
                    eventEmitter.emit(EventTypes.READY, win);
                }
            });
            electron_1.ipcMain.on('vscode:openFilePicker', function () {
                env.log('IPC#vscode-openFilePicker');
                _this.openFilePicker();
            });
            electron_1.ipcMain.on('vscode:openFolderPicker', function () {
                env.log('IPC#vscode-openFolderPicker');
                _this.openFolderPicker();
            });
            electron_1.ipcMain.on('vscode:closeFolder', function (event, windowId) {
                env.log('IPC#vscode-closeFolder');
                var win = _this.getWindowById(windowId);
                if (win) {
                    _this.open({ cli: env.cliArgs, forceEmpty: true, windowToUse: win });
                }
            });
            electron_1.ipcMain.on('vscode:openNewWindow', function () {
                env.log('IPC#vscode-openNewWindow');
                _this.openNewWindow();
            });
            electron_1.ipcMain.on('vscode:openFileFolderPicker', function () {
                env.log('IPC#vscode-openFileFolderPicker');
                _this.openFolderPicker();
            });
            electron_1.ipcMain.on('vscode:reloadWindow', function (event, windowId) {
                env.log('IPC#vscode:reloadWindow');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    _this.reload(vscodeWindow);
                }
            });
            electron_1.ipcMain.on('vscode:toggleFullScreen', function (event, windowId) {
                env.log('IPC#vscode:toggleFullScreen');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.toggleFullScreen();
                }
            });
            electron_1.ipcMain.on('vscode:setFullScreen', function (event, windowId, fullscreen) {
                env.log('IPC#vscode:setFullScreen');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.win.setFullScreen(fullscreen);
                }
            });
            electron_1.ipcMain.on('vscode:toggleDevTools', function (event, windowId) {
                env.log('IPC#vscode:toggleDevTools');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.win.webContents.toggleDevTools();
                }
            });
            electron_1.ipcMain.on('vscode:openDevTools', function (event, windowId) {
                env.log('IPC#vscode:openDevTools');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.win.webContents.openDevTools();
                    vscodeWindow.win.show();
                }
            });
            electron_1.ipcMain.on('vscode:setRepresentedFilename', function (event, windowId, fileName) {
                env.log('IPC#vscode:setRepresentedFilename');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.win.setRepresentedFilename(fileName);
                }
            });
            electron_1.ipcMain.on('vscode:setMenuBarVisibility', function (event, windowId, visibility) {
                env.log('IPC#vscode:setMenuBarVisibility');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.win.setMenuBarVisibility(visibility);
                }
            });
            electron_1.ipcMain.on('vscode:flashFrame', function (event, windowId) {
                env.log('IPC#vscode:flashFrame');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.win.flashFrame(!vscodeWindow.win.isFocused());
                }
            });
            electron_1.ipcMain.on('vscode:focusWindow', function (event, windowId) {
                env.log('IPC#vscode:focusWindow');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.win.focus();
                }
            });
            electron_1.ipcMain.on('vscode:setDocumentEdited', function (event, windowId, edited) {
                env.log('IPC#vscode:setDocumentEdited');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow && vscodeWindow.win.isDocumentEdited() !== edited) {
                    vscodeWindow.win.setDocumentEdited(edited);
                }
            });
            electron_1.ipcMain.on('vscode:toggleMenuBar', function (event, windowId) {
                env.log('IPC#vscode:toggleMenuBar');
                // Update in settings
                var menuBarHidden = storage.getItem(window.VSCodeWindow.menuBarHiddenKey, false);
                var newMenuBarHidden = !menuBarHidden;
                storage.setItem(window.VSCodeWindow.menuBarHiddenKey, newMenuBarHidden);
                // Update across windows
                WindowsManager.WINDOWS.forEach(function (w) { return w.setMenuBarVisibility(!newMenuBarHidden); });
                // Inform user if menu bar is now hidden
                if (newMenuBarHidden) {
                    var vscodeWindow = _this.getWindowById(windowId);
                    if (vscodeWindow) {
                        vscodeWindow.send('vscode:showInfoMessage', nls.localize(0, null));
                    }
                }
            });
            electron_1.ipcMain.on('vscode:changeTheme', function (event, theme) {
                _this.sendToAll('vscode:changeTheme', theme);
                storage.setItem(window.VSCodeWindow.themeStorageKey, theme);
            });
            electron_1.ipcMain.on('vscode:broadcast', function (event, windowId, target, broadcast) {
                if (broadcast.channel && broadcast.payload) {
                    if (target) {
                        var otherWindowsWithTarget = WindowsManager.WINDOWS.filter(function (w) { return w.id !== windowId && typeof w.openedWorkspacePath === 'string'; });
                        var directTargetMatch = otherWindowsWithTarget.filter(function (w) { return _this.isPathEqual(target, w.openedWorkspacePath); });
                        var parentTargetMatch = otherWindowsWithTarget.filter(function (w) { return paths.isEqualOrParent(target, w.openedWorkspacePath); });
                        var targetWindow = directTargetMatch.length ? directTargetMatch[0] : parentTargetMatch[0]; // prefer direct match over parent match
                        if (targetWindow) {
                            targetWindow.send('vscode:broadcast', broadcast);
                        }
                    }
                    else {
                        _this.sendToAll('vscode:broadcast', broadcast, [windowId]);
                    }
                }
            });
            electron_1.ipcMain.on('vscode:log', function (event, logEntry) {
                var args = [];
                try {
                    var parsed_1 = JSON.parse(logEntry.arguments);
                    args.push.apply(args, Object.getOwnPropertyNames(parsed_1).map(function (o) { return parsed_1[o]; }));
                }
                catch (error) {
                    args.push(logEntry.arguments);
                }
                console[logEntry.severity].apply(console, args);
            });
            electron_1.ipcMain.on('vscode:exit', function (event, code) {
                process.exit(code);
            });
            electron_1.ipcMain.on('vscode:closeExtensionHostWindow', function (event, extensionDevelopmentPath) {
                var windowOnExtension = _this.findWindow(null, null, extensionDevelopmentPath);
                if (windowOnExtension) {
                    windowOnExtension.win.close();
                }
            });
            update_manager_1.Instance.on('update-downloaded', function (update) {
                _this.sendToFocused('vscode:telemetry', { eventName: 'update:downloaded', data: { version: update.version } });
                _this.sendToAll('vscode:update-downloaded', JSON.stringify({
                    releaseNotes: update.releaseNotes,
                    version: update.version,
                    date: update.date
                }));
            });
            electron_1.ipcMain.on('vscode:update-apply', function () {
                env.log('IPC#vscode:update-apply');
                if (update_manager_1.Instance.availableUpdate) {
                    update_manager_1.Instance.availableUpdate.quitAndUpdate();
                }
            });
            update_manager_1.Instance.on('update-not-available', function (explicit) {
                _this.sendToFocused('vscode:telemetry', { eventName: 'update:notAvailable', data: { explicit: explicit } });
                if (explicit) {
                    _this.sendToFocused('vscode:update-not-available', '');
                }
            });
            lifecycle.onBeforeQuit(function () {
                // 0-1 window open: Do not keep the list but just rely on the active window to be stored
                if (WindowsManager.WINDOWS.length < 2) {
                    _this.windowsState.openedFolders = [];
                    return;
                }
                // 2-N windows open: Keep a list of windows that are opened on a specific folder to restore it in the next session as needed
                _this.windowsState.openedFolders = WindowsManager.WINDOWS.filter(function (w) { return w.readyState === window.ReadyState.READY && !!w.openedWorkspacePath && !w.isPluginDevelopmentHost; }).map(function (w) {
                    return {
                        workspacePath: w.openedWorkspacePath,
                        uiState: w.serializeWindowState()
                    };
                });
            });
            electron_1.app.on('will-quit', function () {
                storage.setItem(WindowsManager.windowsStateStorageKey, _this.windowsState);
            });
            var loggedStartupTimes = false;
            onReady(function (window) {
                if (loggedStartupTimes) {
                    return; // only for the first window
                }
                loggedStartupTimes = true;
                window.send('vscode:telemetry', { eventName: 'startupTime', data: { ellapsed: Date.now() - global.vscodeStart } });
            });
        };
        WindowsManager.prototype.reload = function (win, cli) {
            // Only reload when the window has not vetoed this
            lifecycle.manager.unload(win).done(function (veto) {
                if (!veto) {
                    win.reload(cli);
                }
            });
        };
        WindowsManager.prototype.open = function (openConfig) {
            var _this = this;
            var iPathsToOpen;
            var usedWindows = [];
            // Find paths from provided paths if any
            if (openConfig.pathsToOpen && openConfig.pathsToOpen.length > 0) {
                iPathsToOpen = openConfig.pathsToOpen.map(function (pathToOpen) {
                    var iPath = _this.toIPath(pathToOpen, false, openConfig.cli && openConfig.cli.gotoLineMode);
                    // Warn if the requested path to open does not exist
                    if (!iPath) {
                        var options = {
                            title: env.product.nameLong,
                            type: 'info',
                            buttons: [nls.localize(1, null)],
                            message: nls.localize(2, null),
                            detail: nls.localize(3, null, pathToOpen),
                            noLink: true
                        };
                        var activeWindow = electron_1.BrowserWindow.getFocusedWindow();
                        if (activeWindow) {
                            electron_1.dialog.showMessageBox(activeWindow, options);
                        }
                        else {
                            electron_1.dialog.showMessageBox(options);
                        }
                    }
                    return iPath;
                });
                // get rid of nulls
                iPathsToOpen = arrays.coalesce(iPathsToOpen);
                if (iPathsToOpen.length === 0) {
                    return null; // indicate to outside that open failed
                }
            }
            else if (openConfig.forceEmpty) {
                iPathsToOpen = [Object.create(null)];
            }
            else {
                var ignoreFileNotFound = openConfig.cli.pathArguments.length > 0; // we assume the user wants to create this file from command line
                iPathsToOpen = this.cliToPaths(openConfig.cli, ignoreFileNotFound);
            }
            var filesToOpen = [];
            var filesToDiff = [];
            var foldersToOpen = iPathsToOpen.filter(function (iPath) { return iPath.workspacePath && !iPath.filePath && !iPath.installExtensionPath; });
            var emptyToOpen = iPathsToOpen.filter(function (iPath) { return !iPath.workspacePath && !iPath.filePath && !iPath.installExtensionPath; });
            var extensionsToInstall = iPathsToOpen.filter(function (iPath) { return iPath.installExtensionPath; }).map(function (ipath) { return ipath.filePath; });
            var filesToCreate = iPathsToOpen.filter(function (iPath) { return !!iPath.filePath && iPath.createFilePath && !iPath.installExtensionPath; });
            // Diff mode needs special care
            var candidates = iPathsToOpen.filter(function (iPath) { return !!iPath.filePath && !iPath.createFilePath && !iPath.installExtensionPath; });
            if (openConfig.cli.diffMode && candidates.length === 2) {
                filesToDiff = candidates;
                foldersToOpen = []; // diff is always in empty workspace
                filesToCreate = []; // diff ignores other files that do not exist
            }
            else {
                filesToOpen = candidates;
            }
            var configuration;
            // Handle files to open/diff or to create when we dont open a folder
            if (!foldersToOpen.length && (filesToOpen.length > 0 || filesToCreate.length > 0 || filesToDiff.length > 0 || extensionsToInstall.length > 0)) {
                // Let the user settings override how files are open in a new window or same window unless we are forced
                var openFilesInNewWindow = void 0;
                if (openConfig.forceNewWindow) {
                    openFilesInNewWindow = true;
                }
                else {
                    openFilesInNewWindow = openConfig.preferNewWindow;
                    if (openFilesInNewWindow && !openConfig.cli.extensionDevelopmentPath) {
                        openFilesInNewWindow = settings.manager.getValue('window.openFilesInNewWindow', openFilesInNewWindow);
                    }
                }
                // Open Files in last instance if any and flag tells us so
                var lastActiveWindow = this.getLastActiveWindow();
                if (!openFilesInNewWindow && lastActiveWindow) {
                    lastActiveWindow.focus();
                    lastActiveWindow.ready().then(function (readyWindow) {
                        readyWindow.send('vscode:openFiles', {
                            filesToOpen: filesToOpen,
                            filesToCreate: filesToCreate,
                            filesToDiff: filesToDiff
                        });
                        if (extensionsToInstall.length) {
                            readyWindow.send('vscode:installExtensions', { extensionsToInstall: extensionsToInstall });
                        }
                    });
                    usedWindows.push(lastActiveWindow);
                }
                else {
                    configuration = this.toConfiguration(openConfig.userEnv || this.initialUserEnv, openConfig.cli, null, filesToOpen, filesToCreate, filesToDiff, extensionsToInstall);
                    var browserWindow = this.openInBrowserWindow(configuration, true /* new window */);
                    usedWindows.push(browserWindow);
                    openConfig.forceNewWindow = true; // any other folders to open must open in new window then
                }
            }
            // Handle folders to open
            var openInNewWindow = openConfig.preferNewWindow || openConfig.forceNewWindow;
            if (foldersToOpen.length > 0) {
                // Check for existing instances
                var windowsOnWorkspacePath_1 = arrays.coalesce(foldersToOpen.map(function (iPath) { return _this.findWindow(iPath.workspacePath); }));
                if (windowsOnWorkspacePath_1.length > 0) {
                    var browserWindow = windowsOnWorkspacePath_1[0];
                    browserWindow.focus(); // just focus one of them
                    browserWindow.ready().then(function (readyWindow) {
                        readyWindow.send('vscode:openFiles', {
                            filesToOpen: filesToOpen,
                            filesToCreate: filesToCreate,
                            filesToDiff: filesToDiff
                        });
                        if (extensionsToInstall.length) {
                            readyWindow.send('vscode:installExtensions', { extensionsToInstall: extensionsToInstall });
                        }
                    });
                    usedWindows.push(browserWindow);
                    // Reset these because we handled them
                    filesToOpen = [];
                    filesToCreate = [];
                    filesToDiff = [];
                    extensionsToInstall = [];
                    openInNewWindow = true; // any other folders to open must open in new window then
                }
                // Open remaining ones
                foldersToOpen.forEach(function (folderToOpen) {
                    if (windowsOnWorkspacePath_1.some(function (win) { return _this.isPathEqual(win.openedWorkspacePath, folderToOpen.workspacePath); })) {
                        return; // ignore folders that are already open
                    }
                    configuration = _this.toConfiguration(openConfig.userEnv || _this.initialUserEnv, openConfig.cli, folderToOpen.workspacePath, filesToOpen, filesToCreate, filesToDiff, extensionsToInstall);
                    var browserWindow = _this.openInBrowserWindow(configuration, openInNewWindow, openInNewWindow ? void 0 : openConfig.windowToUse);
                    usedWindows.push(browserWindow);
                    // Reset these because we handled them
                    filesToOpen = [];
                    filesToCreate = [];
                    filesToDiff = [];
                    extensionsToInstall = [];
                    openInNewWindow = true; // any other folders to open must open in new window then
                });
            }
            // Handle empty
            if (emptyToOpen.length > 0) {
                emptyToOpen.forEach(function () {
                    var configuration = _this.toConfiguration(openConfig.userEnv || _this.initialUserEnv, openConfig.cli);
                    var browserWindow = _this.openInBrowserWindow(configuration, openInNewWindow, openInNewWindow ? void 0 : openConfig.windowToUse);
                    usedWindows.push(browserWindow);
                    openInNewWindow = true; // any other folders to open must open in new window then
                });
            }
            // Remember in recent document list
            iPathsToOpen.forEach(function (iPath) {
                if (iPath.filePath || iPath.workspacePath) {
                    electron_1.app.addRecentDocument(iPath.filePath || iPath.workspacePath);
                }
            });
            // Emit events
            iPathsToOpen.forEach(function (iPath) { return eventEmitter.emit(EventTypes.OPEN, iPath); });
            return arrays.distinct(usedWindows);
        };
        WindowsManager.prototype.openPluginDevelopmentHostWindow = function (openConfig) {
            var _this = this;
            // Reload an existing plugin development host window on the same path
            // We currently do not allow more than one extension development window
            // on the same plugin path.
            var res = WindowsManager.WINDOWS.filter(function (w) { return w.config && _this.isPathEqual(w.config.extensionDevelopmentPath, openConfig.cli.extensionDevelopmentPath); });
            if (res && res.length === 1) {
                this.reload(res[0], openConfig.cli);
                res[0].focus(); // make sure it gets focus and is restored
                return;
            }
            // Fill in previously opened workspace unless an explicit path is provided
            if (openConfig.cli.pathArguments.length === 0) {
                var workspaceToOpen = this.windowsState.lastPluginDevelopmentHostWindow && this.windowsState.lastPluginDevelopmentHostWindow.workspacePath;
                if (workspaceToOpen) {
                    openConfig.cli.pathArguments = [workspaceToOpen];
                }
            }
            // Make sure we are not asked to open a path that is already opened
            if (openConfig.cli.pathArguments.length > 0) {
                res = WindowsManager.WINDOWS.filter(function (w) { return w.openedWorkspacePath && openConfig.cli.pathArguments.indexOf(w.openedWorkspacePath) >= 0; });
                if (res.length) {
                    openConfig.cli.pathArguments = [];
                }
            }
            // Open it
            this.open({ cli: openConfig.cli, forceNewWindow: true, forceEmpty: openConfig.cli.pathArguments.length === 0 });
        };
        WindowsManager.prototype.toConfiguration = function (userEnv, cli, workspacePath, filesToOpen, filesToCreate, filesToDiff, extensionsToInstall) {
            var configuration = objects.mixin({}, cli); // inherit all properties from CLI
            configuration.execPath = process.execPath;
            configuration.workspacePath = workspacePath;
            configuration.filesToOpen = filesToOpen;
            configuration.filesToCreate = filesToCreate;
            configuration.filesToDiff = filesToDiff;
            configuration.extensionsToInstall = extensionsToInstall;
            configuration.appName = env.product.nameLong;
            configuration.applicationName = env.product.applicationName;
            configuration.darwinBundleIdentifier = env.product.darwinBundleIdentifier;
            configuration.appRoot = env.appRoot;
            configuration.version = env.version;
            configuration.commitHash = env.product.commit;
            configuration.appSettingsHome = env.appSettingsHome;
            configuration.appSettingsPath = env.appSettingsPath;
            configuration.appKeybindingsPath = env.appKeybindingsPath;
            configuration.userExtensionsHome = env.userExtensionsHome;
            configuration.extensionTips = env.product.extensionTips;
            configuration.sharedIPCHandle = env.sharedIPCHandle;
            configuration.isBuilt = env.isBuilt;
            configuration.crashReporter = env.product.crashReporter;
            configuration.extensionsGallery = env.product.extensionsGallery;
            configuration.welcomePage = env.product.welcomePage;
            configuration.productDownloadUrl = env.product.downloadUrl;
            configuration.releaseNotesUrl = env.product.releaseNotesUrl;
            configuration.licenseUrl = env.product.licenseUrl;
            configuration.updateFeedUrl = update_manager_1.Instance.feedUrl;
            configuration.updateChannel = update_manager_1.Instance.channel;
            configuration.recentPaths = this.getRecentlyOpenedPaths(workspacePath, filesToOpen);
            configuration.aiConfig = env.product.aiConfig;
            configuration.sendASmile = env.product.sendASmile;
            configuration.enableTelemetry = env.product.enableTelemetry;
            configuration.userEnv = userEnv;
            return configuration;
        };
        WindowsManager.prototype.getRecentlyOpenedPaths = function (workspacePath, filesToOpen) {
            // Get from storage
            var openedPathsList = storage.getItem(WindowsManager.openedPathsListStorageKey);
            if (!openedPathsList) {
                openedPathsList = { folders: [], files: [] };
            }
            var recentPaths = openedPathsList.folders.concat(openedPathsList.files);
            // Add currently files to open to the beginning if any
            if (filesToOpen) {
                recentPaths.unshift.apply(recentPaths, filesToOpen.map(function (f) { return f.filePath; }));
            }
            // Add current workspace path to beginning if set
            if (workspacePath) {
                recentPaths.unshift(workspacePath);
            }
            // Clear those dupes
            recentPaths = arrays.distinct(recentPaths);
            // Make sure it is bounded
            return recentPaths.slice(0, 10);
        };
        WindowsManager.prototype.toIPath = function (anyPath, ignoreFileNotFound, gotoLineMode) {
            if (!anyPath) {
                return null;
            }
            var parsedPath;
            if (gotoLineMode) {
                parsedPath = env.parseLineAndColumnAware(anyPath);
                anyPath = parsedPath.path;
            }
            var candidate = path.normalize(anyPath);
            try {
                var candidateStat = fs.statSync(candidate);
                if (candidateStat) {
                    return candidateStat.isFile() ?
                        {
                            filePath: candidate,
                            lineNumber: gotoLineMode ? parsedPath.line : void 0,
                            columnNumber: gotoLineMode ? parsedPath.column : void 0,
                            installExtensionPath: /\.vsix$/i.test(candidate)
                        } :
                        { workspacePath: candidate };
                }
            }
            catch (error) {
                if (ignoreFileNotFound) {
                    return { filePath: candidate, createFilePath: true }; // assume this is a file that does not yet exist
                }
            }
            return null;
        };
        WindowsManager.prototype.cliToPaths = function (cli, ignoreFileNotFound) {
            var _this = this;
            // Check for pass in candidate or last opened path
            var candidates = [];
            if (cli.pathArguments.length > 0) {
                candidates = cli.pathArguments;
            }
            else {
                var reopenFolders = settings.manager.getValue('window.reopenFolders', 'one');
                var lastActiveFolder = this.windowsState.lastActiveWindow && this.windowsState.lastActiveWindow.workspacePath;
                // Restore all
                if (reopenFolders === 'all') {
                    var lastOpenedFolders = this.windowsState.openedFolders.map(function (o) { return o.workspacePath; });
                    // If we have a last active folder, move it to the end
                    if (lastActiveFolder) {
                        lastOpenedFolders.splice(lastOpenedFolders.indexOf(lastActiveFolder), 1);
                        lastOpenedFolders.push(lastActiveFolder);
                    }
                    candidates.push.apply(candidates, lastOpenedFolders);
                }
                else if (lastActiveFolder && (reopenFolders === 'one' || reopenFolders !== 'none')) {
                    candidates.push(lastActiveFolder);
                }
            }
            var iPaths = candidates.map(function (candidate) { return _this.toIPath(candidate, ignoreFileNotFound, cli.gotoLineMode); }).filter(function (path) { return !!path; });
            if (iPaths.length > 0) {
                return iPaths;
            }
            // No path provided, return empty to open empty
            return [Object.create(null)];
        };
        WindowsManager.prototype.openInBrowserWindow = function (configuration, forceNewWindow, windowToUse) {
            var _this = this;
            var vscodeWindow;
            if (!forceNewWindow) {
                vscodeWindow = windowToUse || this.getLastActiveWindow();
                if (vscodeWindow) {
                    vscodeWindow.focus();
                }
            }
            // New window
            if (!vscodeWindow) {
                vscodeWindow = new window.VSCodeWindow({
                    state: this.getNewWindowState(configuration),
                    extensionDevelopmentPath: configuration.extensionDevelopmentPath
                });
                WindowsManager.WINDOWS.push(vscodeWindow);
                // Window Events
                vscodeWindow.win.webContents.on('crashed', function () { return _this.onWindowError(vscodeWindow, WindowError.CRASHED); });
                vscodeWindow.win.on('unresponsive', function () { return _this.onWindowError(vscodeWindow, WindowError.UNRESPONSIVE); });
                vscodeWindow.win.on('close', function () { return _this.onBeforeWindowClose(vscodeWindow); });
                vscodeWindow.win.on('closed', function () { return _this.onWindowClosed(vscodeWindow); });
                // Lifecycle
                lifecycle.manager.registerWindow(vscodeWindow);
            }
            else {
                // Some configuration things get inherited if the window is being reused and we are
                // in plugin development host mode. These options are all development related.
                var currentWindowConfig = vscodeWindow.config;
                if (!configuration.extensionDevelopmentPath && currentWindowConfig && !!currentWindowConfig.extensionDevelopmentPath) {
                    configuration.extensionDevelopmentPath = currentWindowConfig.extensionDevelopmentPath;
                    configuration.verboseLogging = currentWindowConfig.verboseLogging;
                    configuration.logPluginHostCommunication = currentWindowConfig.logPluginHostCommunication;
                    configuration.debugBrkPluginHost = currentWindowConfig.debugBrkPluginHost;
                    configuration.debugPluginHostPort = currentWindowConfig.debugPluginHostPort;
                    configuration.pluginHomePath = currentWindowConfig.pluginHomePath;
                }
            }
            // Only load when the window has not vetoed this
            lifecycle.manager.unload(vscodeWindow).done(function (veto) {
                if (!veto) {
                    // Load it
                    vscodeWindow.load(configuration);
                }
            });
            return vscodeWindow;
        };
        WindowsManager.prototype.getNewWindowState = function (configuration) {
            var _this = this;
            // plugin development host Window - load from stored settings if any
            if (!!configuration.extensionDevelopmentPath && this.windowsState.lastPluginDevelopmentHostWindow) {
                return this.windowsState.lastPluginDevelopmentHostWindow.uiState;
            }
            // Known Folder - load from stored settings if any
            if (configuration.workspacePath) {
                var stateForWorkspace = this.windowsState.openedFolders.filter(function (o) { return _this.isPathEqual(o.workspacePath, configuration.workspacePath); }).map(function (o) { return o.uiState; });
                if (stateForWorkspace.length) {
                    return stateForWorkspace[0];
                }
            }
            // First Window
            var lastActive = this.getLastActiveWindow();
            if (!lastActive && this.windowsState.lastActiveWindow) {
                return this.windowsState.lastActiveWindow.uiState;
            }
            //
            // In any other case, we do not have any stored settings for the window state, so we come up with something smart
            //
            // We want the new window to open on the same display that the last active one is in
            var displayToUse;
            var displays = electron_1.screen.getAllDisplays();
            // Single Display
            if (displays.length === 1) {
                displayToUse = displays[0];
            }
            else {
                // on mac there is 1 menu per window so we need to use the monitor where the cursor currently is
                if (platform.isMacintosh) {
                    var cursorPoint = electron_1.screen.getCursorScreenPoint();
                    displayToUse = electron_1.screen.getDisplayNearestPoint(cursorPoint);
                }
                // if we have a last active window, use that display for the new window
                if (!displayToUse && lastActive) {
                    displayToUse = electron_1.screen.getDisplayMatching(lastActive.getBounds());
                }
                // fallback to first display
                if (!displayToUse) {
                    displayToUse = displays[0];
                }
            }
            var defaultState = window.defaultWindowState();
            defaultState.x = displayToUse.bounds.x + (displayToUse.bounds.width / 2) - (defaultState.width / 2);
            defaultState.y = displayToUse.bounds.y + (displayToUse.bounds.height / 2) - (defaultState.height / 2);
            return this.ensureNoOverlap(defaultState);
        };
        WindowsManager.prototype.ensureNoOverlap = function (state) {
            if (WindowsManager.WINDOWS.length === 0) {
                return state;
            }
            var existingWindowBounds = WindowsManager.WINDOWS.map(function (win) { return win.getBounds(); });
            while (existingWindowBounds.some(function (b) { return b.x === state.x || b.y === state.y; })) {
                state.x += 30;
                state.y += 30;
            }
            return state;
        };
        WindowsManager.prototype.openFilePicker = function () {
            var _this = this;
            this.getFileOrFolderPaths(false, function (paths) {
                if (paths && paths.length) {
                    _this.open({ cli: env.cliArgs, pathsToOpen: paths });
                }
            });
        };
        WindowsManager.prototype.openFolderPicker = function () {
            var _this = this;
            this.getFileOrFolderPaths(true, function (paths) {
                if (paths && paths.length) {
                    _this.open({ cli: env.cliArgs, pathsToOpen: paths });
                }
            });
        };
        WindowsManager.prototype.getFileOrFolderPaths = function (isFolder, clb) {
            var workingDir = storage.getItem(WindowsManager.workingDirPickerStorageKey);
            var focussedWindow = this.getFocusedWindow();
            var pickerProperties;
            if (platform.isMacintosh) {
                pickerProperties = ['multiSelections', 'openDirectory', 'openFile', 'createDirectory'];
            }
            else {
                pickerProperties = ['multiSelections', isFolder ? 'openDirectory' : 'openFile', 'createDirectory'];
            }
            electron_1.dialog.showOpenDialog(focussedWindow && focussedWindow.win, {
                defaultPath: workingDir,
                properties: pickerProperties
            }, function (paths) {
                if (paths && paths.length > 0) {
                    // Remember path in storage for next time
                    storage.setItem(WindowsManager.workingDirPickerStorageKey, path.dirname(paths[0]));
                    // Return
                    clb(paths);
                }
                else {
                    clb(void (0));
                }
            });
        };
        WindowsManager.prototype.focusLastActive = function (cli) {
            var lastActive = this.getLastActiveWindow();
            if (lastActive) {
                lastActive.focus();
                return lastActive;
            }
            // No window - open new one
            this.windowsState.openedFolders = []; // make sure we do not open too much
            var res = this.open({ cli: cli });
            return res && res[0];
        };
        WindowsManager.prototype.getLastActiveWindow = function () {
            if (WindowsManager.WINDOWS.length) {
                var lastFocussedDate_1 = Math.max.apply(Math, WindowsManager.WINDOWS.map(function (w) { return w.lastFocusTime; }));
                var res = WindowsManager.WINDOWS.filter(function (w) { return w.lastFocusTime === lastFocussedDate_1; });
                if (res && res.length) {
                    return res[0];
                }
            }
            return null;
        };
        WindowsManager.prototype.findWindow = function (workspacePath, filePath, extensionDevelopmentPath) {
            var _this = this;
            if (WindowsManager.WINDOWS.length) {
                // Sort the last active window to the front of the array of windows to test
                var windowsToTest = WindowsManager.WINDOWS.slice(0);
                var lastActiveWindow = this.getLastActiveWindow();
                if (lastActiveWindow) {
                    windowsToTest.splice(windowsToTest.indexOf(lastActiveWindow), 1);
                    windowsToTest.unshift(lastActiveWindow);
                }
                // Find it
                var res = windowsToTest.filter(function (w) {
                    // match on workspace
                    if (typeof w.openedWorkspacePath === 'string' && (_this.isPathEqual(w.openedWorkspacePath, workspacePath))) {
                        return true;
                    }
                    // match on file
                    if (typeof w.openedFilePath === 'string' && _this.isPathEqual(w.openedFilePath, filePath)) {
                        return true;
                    }
                    // match on file path
                    if (typeof w.openedWorkspacePath === 'string' && filePath && paths.isEqualOrParent(filePath, w.openedWorkspacePath)) {
                        return true;
                    }
                    // match on extension development path
                    if (typeof extensionDevelopmentPath === 'string' && w.extensionDevelopmentPath === extensionDevelopmentPath) {
                        return true;
                    }
                    return false;
                });
                if (res && res.length) {
                    return res[0];
                }
            }
            return null;
        };
        WindowsManager.prototype.openNewWindow = function () {
            this.open({ cli: env.cliArgs, forceNewWindow: true, forceEmpty: true });
        };
        WindowsManager.prototype.sendToFocused = function (channel) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var focusedWindow = this.getFocusedWindow() || this.getLastActiveWindow();
            if (focusedWindow) {
                focusedWindow.sendWhenReady.apply(focusedWindow, [channel].concat(args));
            }
        };
        WindowsManager.prototype.sendToAll = function (channel, payload, windowIdsToIgnore) {
            WindowsManager.WINDOWS.forEach(function (w) {
                if (windowIdsToIgnore && windowIdsToIgnore.indexOf(w.id) >= 0) {
                    return; // do not send if we are instructed to ignore it
                }
                w.sendWhenReady(channel, payload);
            });
        };
        WindowsManager.prototype.getFocusedWindow = function () {
            var win = electron_1.BrowserWindow.getFocusedWindow();
            if (win) {
                return this.getWindowById(win.id);
            }
            return null;
        };
        WindowsManager.prototype.getWindowById = function (windowId) {
            var res = WindowsManager.WINDOWS.filter(function (w) { return w.id === windowId; });
            if (res && res.length === 1) {
                return res[0];
            }
            return null;
        };
        WindowsManager.prototype.getWindows = function () {
            return WindowsManager.WINDOWS;
        };
        WindowsManager.prototype.getWindowCount = function () {
            return WindowsManager.WINDOWS.length;
        };
        WindowsManager.prototype.onWindowError = function (vscodeWindow, error) {
            var _this = this;
            console.error(error === WindowError.CRASHED ? '[VS Code]: render process crashed!' : '[VS Code]: detected unresponsive');
            // Unresponsive
            if (error === WindowError.UNRESPONSIVE) {
                electron_1.dialog.showMessageBox(vscodeWindow.win, {
                    title: env.product.nameLong,
                    type: 'warning',
                    buttons: [nls.localize(4, null), nls.localize(5, null), nls.localize(6, null)],
                    message: nls.localize(7, null),
                    detail: nls.localize(8, null),
                    noLink: true
                }, function (result) {
                    if (result === 0) {
                        vscodeWindow.reload();
                    }
                    else if (result === 2) {
                        _this.onBeforeWindowClose(vscodeWindow); // 'close' event will not be fired on destroy(), so run it manually
                        vscodeWindow.win.destroy(); // make sure to destroy the window as it is unresponsive
                    }
                });
            }
            else {
                electron_1.dialog.showMessageBox(vscodeWindow.win, {
                    title: env.product.nameLong,
                    type: 'warning',
                    buttons: [nls.localize(9, null), nls.localize(10, null)],
                    message: nls.localize(11, null),
                    detail: nls.localize(12, null),
                    noLink: true
                }, function (result) {
                    if (result === 0) {
                        vscodeWindow.reload();
                    }
                    else if (result === 1) {
                        _this.onBeforeWindowClose(vscodeWindow); // 'close' event will not be fired on destroy(), so run it manually
                        vscodeWindow.win.destroy(); // make sure to destroy the window as it has crashed
                    }
                });
            }
        };
        WindowsManager.prototype.onBeforeWindowClose = function (win) {
            var _this = this;
            if (win.readyState !== window.ReadyState.READY) {
                return; // only persist windows that are fully loaded
            }
            // On Window close, update our stored state of this window
            var state = { workspacePath: win.openedWorkspacePath, uiState: win.serializeWindowState() };
            if (win.isPluginDevelopmentHost) {
                this.windowsState.lastPluginDevelopmentHostWindow = state;
            }
            else {
                this.windowsState.lastActiveWindow = state;
                this.windowsState.openedFolders.forEach(function (o) {
                    if (_this.isPathEqual(o.workspacePath, win.openedWorkspacePath)) {
                        o.uiState = state.uiState;
                    }
                });
            }
        };
        WindowsManager.prototype.onWindowClosed = function (win) {
            // Tell window
            win.dispose();
            // Remove from our list so that Electron can clean it up
            var index = WindowsManager.WINDOWS.indexOf(win);
            WindowsManager.WINDOWS.splice(index, 1);
            // Emit
            eventEmitter.emit(EventTypes.CLOSE, win.id);
        };
        WindowsManager.prototype.isPathEqual = function (pathA, pathB) {
            if (pathA === pathB) {
                return true;
            }
            if (!pathA || !pathB) {
                return false;
            }
            pathA = path.normalize(pathA);
            pathB = path.normalize(pathB);
            if (pathA === pathB) {
                return true;
            }
            if (!platform.isLinux) {
                pathA = pathA.toLowerCase();
                pathB = pathB.toLowerCase();
            }
            return pathA === pathB;
        };
        WindowsManager.openedPathsListStorageKey = 'openedPathsList';
        WindowsManager.workingDirPickerStorageKey = 'pickerWorkingDir';
        WindowsManager.windowsStateStorageKey = 'windowsState';
        WindowsManager.WINDOWS = [];
        return WindowsManager;
    }());
    exports.WindowsManager = WindowsManager;
    exports.manager = new WindowsManager();
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/electron-main/menus", ["require", "exports", 'electron', 'vs/nls!vs/workbench/electron-main/menus', 'vs/base/common/platform', 'vs/base/common/arrays', 'vs/workbench/electron-main/windows', 'vs/workbench/electron-main/env', 'vs/workbench/electron-main/storage', 'vs/workbench/electron-main/update-manager', 'vs/base/common/keyCodes'], function (require, exports, electron_1, nls, platform, arrays, windows, env, storage, um, keyCodes_1) {
    'use strict';
    var UpdateManager = um.Instance;
    var VSCodeMenu = (function () {
        function VSCodeMenu() {
            this.actionIdKeybindingRequests = [];
            this.mapResolvedKeybindingToActionId = Object.create(null);
            this.mapLastKnownKeybindingToActionId = storage.getItem(VSCodeMenu.lastKnownKeybindingsMapStorageKey) || Object.create(null);
        }
        VSCodeMenu.prototype.ready = function () {
            this.registerListeners();
            this.install();
        };
        VSCodeMenu.prototype.registerListeners = function () {
            var _this = this;
            // Keep flag when app quits
            electron_1.app.on('will-quit', function () {
                _this.isQuitting = true;
            });
            // Listen to "open" & "close" event from window manager
            windows.onOpen(function (paths) { return _this.onOpen(paths); });
            windows.onClose(function (_) { return _this.onClose(windows.manager.getWindowCount()); });
            // Resolve keybindings when any first workbench is loaded
            windows.onReady(function (win) { return _this.resolveKeybindings(win); });
            // Listen to resolved keybindings
            electron_1.ipcMain.on('vscode:keybindingsResolved', function (event, rawKeybindings) {
                var keybindings = [];
                try {
                    keybindings = JSON.parse(rawKeybindings);
                }
                catch (error) {
                }
                // Fill hash map of resolved keybindings
                var needsMenuUpdate = false;
                keybindings.forEach(function (keybinding) {
                    var accelerator = new keyCodes_1.Keybinding(keybinding.binding)._toElectronAccelerator();
                    if (accelerator) {
                        _this.mapResolvedKeybindingToActionId[keybinding.id] = accelerator;
                        if (_this.mapLastKnownKeybindingToActionId[keybinding.id] !== accelerator) {
                            needsMenuUpdate = true; // we only need to update when something changed!
                        }
                    }
                });
                // A keybinding might have been unassigned, so we have to account for that too
                if (Object.keys(_this.mapLastKnownKeybindingToActionId).length !== Object.keys(_this.mapResolvedKeybindingToActionId).length) {
                    needsMenuUpdate = true;
                }
                if (needsMenuUpdate) {
                    storage.setItem(VSCodeMenu.lastKnownKeybindingsMapStorageKey, _this.mapResolvedKeybindingToActionId); // keep to restore instantly after restart
                    _this.mapLastKnownKeybindingToActionId = _this.mapResolvedKeybindingToActionId; // update our last known map
                    _this.updateMenu();
                }
            });
            // Listen to update manager
            UpdateManager.on('change', function () { return _this.updateMenu(); });
        };
        VSCodeMenu.prototype.resolveKeybindings = function (win) {
            if (this.keybindingsResolved) {
                return; // only resolve once
            }
            this.keybindingsResolved = true;
            // Resolve keybindings when workbench window is up
            if (this.actionIdKeybindingRequests.length) {
                win.send('vscode:resolveKeybindings', JSON.stringify(this.actionIdKeybindingRequests));
            }
        };
        VSCodeMenu.prototype.updateMenu = function () {
            var _this = this;
            // Due to limitations in Electron, it is not possible to update menu items dynamically. The suggested
            // workaround from Electron is to set the application menu again.
            // See also https://github.com/atom/electron/issues/846
            //
            // Run delayed to prevent updating menu while it is open
            if (!this.isQuitting) {
                setTimeout(function () {
                    if (!_this.isQuitting) {
                        _this.install();
                    }
                }, 10 /* delay this because there is an issue with updating a menu when it is open */);
            }
        };
        VSCodeMenu.prototype.onOpen = function (path) {
            this.addToOpenedPathsList(path.filePath || path.workspacePath, !!path.filePath);
            this.updateMenu();
        };
        VSCodeMenu.prototype.onClose = function (remainingWindowCount) {
            if (remainingWindowCount === 0 && platform.isMacintosh) {
                this.updateMenu();
            }
        };
        VSCodeMenu.prototype.install = function () {
            // Menus
            var menubar = new electron_1.Menu();
            // Mac: Application
            var macApplicationMenuItem;
            if (platform.isMacintosh) {
                var applicationMenu = new electron_1.Menu();
                macApplicationMenuItem = new electron_1.MenuItem({ label: env.product.nameShort, submenu: applicationMenu });
                this.setMacApplicationMenu(applicationMenu);
            }
            // File
            var fileMenu = new electron_1.Menu();
            var fileMenuItem = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(0, null)), submenu: fileMenu });
            this.setFileMenu(fileMenu);
            // Edit
            var editMenu = new electron_1.Menu();
            var editMenuItem = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(1, null)), submenu: editMenu });
            this.setEditMenu(editMenu);
            // View
            var viewMenu = new electron_1.Menu();
            var viewMenuItem = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(2, null)), submenu: viewMenu });
            this.setViewMenu(viewMenu);
            // Goto
            var gotoMenu = new electron_1.Menu();
            var gotoMenuItem = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(3, null)), submenu: gotoMenu });
            this.setGotoMenu(gotoMenu);
            // Mac: Window
            var macWindowMenuItem;
            if (platform.isMacintosh) {
                var windowMenu = new electron_1.Menu();
                macWindowMenuItem = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(4, null)), submenu: windowMenu, role: 'window' });
                this.setMacWindowMenu(windowMenu);
            }
            // Help
            var helpMenu = new electron_1.Menu();
            var helpMenuItem = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(5, null)), submenu: helpMenu, role: 'help' });
            this.setHelpMenu(helpMenu);
            // Menu Structure
            if (macApplicationMenuItem) {
                menubar.append(macApplicationMenuItem);
            }
            menubar.append(fileMenuItem);
            menubar.append(editMenuItem);
            menubar.append(viewMenuItem);
            menubar.append(gotoMenuItem);
            if (macWindowMenuItem) {
                menubar.append(macWindowMenuItem);
            }
            menubar.append(helpMenuItem);
            electron_1.Menu.setApplicationMenu(menubar);
            // Dock Menu
            if (platform.isMacintosh && !this.appMenuInstalled) {
                this.appMenuInstalled = true;
                var dockMenu = new electron_1.Menu();
                dockMenu.append(new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(6, null)), click: function () { return windows.manager.openNewWindow(); } }));
                electron_1.app.dock.setMenu(dockMenu);
            }
        };
        VSCodeMenu.prototype.addToOpenedPathsList = function (path, isFile) {
            if (!path) {
                return;
            }
            var mru = this.getOpenedPathsList();
            if (isFile || platform.isMacintosh /* on mac we don't treat files any different from folders */) {
                mru.files.unshift(path);
                mru.files = arrays.distinct(mru.files, function (f) { return platform.isLinux ? f : f.toLowerCase(); });
            }
            else {
                mru.folders.unshift(path);
                mru.folders = arrays.distinct(mru.folders, function (f) { return platform.isLinux ? f : f.toLowerCase(); });
            }
            // Make sure its bounded
            mru.folders = mru.folders.slice(0, VSCodeMenu.MAX_RECENT_ENTRIES);
            mru.files = mru.files.slice(0, VSCodeMenu.MAX_RECENT_ENTRIES);
            storage.setItem(windows.WindowsManager.openedPathsListStorageKey, mru);
        };
        VSCodeMenu.prototype.removeFromOpenedPathsList = function (path) {
            var mru = this.getOpenedPathsList();
            var index = mru.files.indexOf(path);
            if (index >= 0) {
                mru.files.splice(index, 1);
            }
            index = mru.folders.indexOf(path);
            if (index >= 0) {
                mru.folders.splice(index, 1);
            }
            storage.setItem(windows.WindowsManager.openedPathsListStorageKey, mru);
        };
        VSCodeMenu.prototype.clearOpenedPathsList = function () {
            storage.setItem(windows.WindowsManager.openedPathsListStorageKey, { folders: [], files: [] });
            electron_1.app.clearRecentDocuments();
            this.updateMenu();
        };
        VSCodeMenu.prototype.getOpenedPathsList = function () {
            var mru = storage.getItem(windows.WindowsManager.openedPathsListStorageKey);
            if (!mru) {
                mru = { folders: [], files: [] };
            }
            return mru;
        };
        VSCodeMenu.prototype.setMacApplicationMenu = function (macApplicationMenu) {
            var _this = this;
            var about = new electron_1.MenuItem({ label: nls.localize(7, null, env.product.nameLong), role: 'about' });
            var checkForUpdates = this.getUpdateMenuItems();
            var preferences = this.getPreferencesMenu();
            var hide = new electron_1.MenuItem({ label: nls.localize(8, null, env.product.nameLong), role: 'hide', accelerator: 'Command+H' });
            var hideOthers = new electron_1.MenuItem({ label: nls.localize(9, null), role: 'hideothers', accelerator: 'Command+Alt+H' });
            var showAll = new electron_1.MenuItem({ label: nls.localize(10, null), role: 'unhide' });
            var quit = new electron_1.MenuItem({ label: nls.localize(11, null, env.product.nameLong), click: function () { return _this.quit(); }, accelerator: 'Command+Q' });
            var actions = [about];
            actions.push.apply(actions, checkForUpdates);
            actions.push.apply(actions, [
                __separator__(),
                preferences,
                __separator__(),
                hide,
                hideOthers,
                showAll,
                __separator__(),
                quit
            ]);
            actions.forEach(function (i) { return macApplicationMenu.append(i); });
        };
        VSCodeMenu.prototype.setFileMenu = function (fileMenu) {
            var _this = this;
            var hasNoWindows = (windows.manager.getWindowCount() === 0);
            var newFile;
            if (hasNoWindows) {
                newFile = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(12, null)), accelerator: this.getAccelerator('workbench.action.files.newUntitledFile'), click: function () { return windows.manager.openNewWindow(); } });
            }
            else {
                newFile = this.createMenuItem(nls.localize(13, null), 'workbench.action.files.newUntitledFile');
            }
            var open = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(14, null)), accelerator: this.getAccelerator('workbench.action.files.openFileFolder'), click: function () { return windows.manager.openFolderPicker(); } });
            var openFile = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(15, null)), accelerator: this.getAccelerator('workbench.action.files.openFile'), click: function () { return windows.manager.openFilePicker(); } });
            var openFolder = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(16, null)), accelerator: this.getAccelerator('workbench.action.files.openFolder'), click: function () { return windows.manager.openFolderPicker(); } });
            var openRecentMenu = new electron_1.Menu();
            this.setOpenRecentMenu(openRecentMenu);
            var openRecent = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(17, null)), submenu: openRecentMenu, enabled: openRecentMenu.items.length > 0 });
            var saveFile = this.createMenuItem(nls.localize(18, null), 'workbench.action.files.save', windows.manager.getWindowCount() > 0);
            var saveFileAs = this.createMenuItem(nls.localize(19, null), 'workbench.action.files.saveAs', windows.manager.getWindowCount() > 0);
            var saveAllFiles = this.createMenuItem(nls.localize(20, null), 'workbench.action.files.saveAll', windows.manager.getWindowCount() > 0);
            var preferences = this.getPreferencesMenu();
            var newWindow = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(21, null)), accelerator: this.getAccelerator('workbench.action.newWindow'), click: function () { return windows.manager.openNewWindow(); } });
            var revertFile = this.createMenuItem(nls.localize(22, null), 'workbench.action.files.revert', windows.manager.getWindowCount() > 0);
            var closeWindow = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(23, null)), accelerator: this.getAccelerator('workbench.action.closeWindow'), click: function () { return windows.manager.getLastActiveWindow().win.close(); }, enabled: windows.manager.getWindowCount() > 0 });
            var closeFolder = this.createMenuItem(nls.localize(24, null), 'workbench.action.closeFolder');
            var closeEditor = this.createMenuItem(nls.localize(25, null), 'workbench.action.closeActiveEditor');
            var exit = this.createMenuItem(nls.localize(26, null), function () { return _this.quit(); });
            arrays.coalesce([
                newFile,
                newWindow,
                __separator__(),
                platform.isMacintosh ? open : null,
                !platform.isMacintosh ? openFile : null,
                !platform.isMacintosh ? openFolder : null,
                openRecent,
                __separator__(),
                saveFile,
                saveFileAs,
                saveAllFiles,
                __separator__(),
                !platform.isMacintosh ? preferences : null,
                !platform.isMacintosh ? __separator__() : null,
                revertFile,
                closeEditor,
                closeFolder,
                !platform.isMacintosh ? closeWindow : null,
                !platform.isMacintosh ? __separator__() : null,
                !platform.isMacintosh ? exit : null
            ]).forEach(function (item) { return fileMenu.append(item); });
        };
        VSCodeMenu.prototype.getPreferencesMenu = function () {
            var userSettings = this.createMenuItem(nls.localize(27, null), 'workbench.action.openGlobalSettings');
            var workspaceSettings = this.createMenuItem(nls.localize(28, null), 'workbench.action.openWorkspaceSettings');
            var kebindingSettings = this.createMenuItem(nls.localize(29, null), 'workbench.action.openGlobalKeybindings');
            var snippetsSettings = this.createMenuItem(nls.localize(30, null), 'workbench.action.openSnippets');
            var themeSelection = this.createMenuItem(nls.localize(31, null), 'workbench.action.selectTheme');
            var preferencesMenu = new electron_1.Menu();
            preferencesMenu.append(userSettings);
            preferencesMenu.append(workspaceSettings);
            preferencesMenu.append(__separator__());
            preferencesMenu.append(kebindingSettings);
            preferencesMenu.append(__separator__());
            preferencesMenu.append(snippetsSettings);
            preferencesMenu.append(__separator__());
            preferencesMenu.append(themeSelection);
            return new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(32, null)), submenu: preferencesMenu });
        };
        VSCodeMenu.prototype.quit = function () {
            var _this = this;
            // If the user selected to exit from an extension development host window, do not quit, but just
            // close the window unless this is the last window that is opened.
            var vscodeWindow = windows.manager.getFocusedWindow();
            if (vscodeWindow && vscodeWindow.isPluginDevelopmentHost && windows.manager.getWindowCount() > 1) {
                vscodeWindow.win.close();
            }
            else {
                setTimeout(function () {
                    _this.isQuitting = true;
                    electron_1.app.quit();
                }, 10 /* delay this because there is an issue with quitting while the menu is open */);
            }
        };
        VSCodeMenu.prototype.setOpenRecentMenu = function (openRecentMenu) {
            var _this = this;
            var recentList = this.getOpenedPathsList();
            // Folders
            recentList.folders.forEach(function (folder, index) {
                if (index < VSCodeMenu.MAX_RECENT_ENTRIES) {
                    openRecentMenu.append(_this.createOpenRecentMenuItem(folder));
                }
            });
            // Files
            if (recentList.files.length > 0) {
                if (recentList.folders.length > 0) {
                    openRecentMenu.append(__separator__());
                }
                recentList.files.forEach(function (file, index) {
                    if (index < VSCodeMenu.MAX_RECENT_ENTRIES) {
                        openRecentMenu.append(_this.createOpenRecentMenuItem(file));
                    }
                });
            }
            if (recentList.folders.length || recentList.files.length) {
                openRecentMenu.append(__separator__());
                openRecentMenu.append(new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(33, null)), click: function () { return _this.clearOpenedPathsList(); } }));
            }
        };
        VSCodeMenu.prototype.createOpenRecentMenuItem = function (path) {
            var _this = this;
            return new electron_1.MenuItem({
                label: path, click: function () {
                    var success = !!windows.manager.open({ cli: env.cliArgs, pathsToOpen: [path] });
                    if (!success) {
                        _this.removeFromOpenedPathsList(path);
                        _this.updateMenu();
                    }
                }
            });
        };
        VSCodeMenu.prototype.createRoleMenuItem = function (label, actionId, role) {
            var options = {
                label: mnemonicLabel(label),
                accelerator: this.getAccelerator(actionId),
                role: role,
                enabled: true
            };
            return new electron_1.MenuItem(options);
        };
        VSCodeMenu.prototype.setEditMenu = function (winLinuxEditMenu) {
            var undo;
            var redo;
            var cut;
            var copy;
            var paste;
            var selectAll;
            if (platform.isMacintosh) {
                undo = this.createDevToolsAwareMenuItem(nls.localize(34, null), 'undo', function (devTools) { return devTools.undo(); });
                redo = this.createDevToolsAwareMenuItem(nls.localize(35, null), 'redo', function (devTools) { return devTools.redo(); });
                cut = this.createRoleMenuItem(nls.localize(36, null), 'editor.action.clipboardCutAction', 'cut');
                copy = this.createRoleMenuItem(nls.localize(37, null), 'editor.action.clipboardCopyAction', 'copy');
                paste = this.createRoleMenuItem(nls.localize(38, null), 'editor.action.clipboardPasteAction', 'paste');
                selectAll = this.createDevToolsAwareMenuItem(nls.localize(39, null), 'editor.action.selectAll', function (devTools) { return devTools.selectAll(); });
            }
            else {
                undo = this.createMenuItem(nls.localize(40, null), 'undo');
                redo = this.createMenuItem(nls.localize(41, null), 'redo');
                cut = this.createMenuItem(nls.localize(42, null), 'editor.action.clipboardCutAction');
                copy = this.createMenuItem(nls.localize(43, null), 'editor.action.clipboardCopyAction');
                paste = this.createMenuItem(nls.localize(44, null), 'editor.action.clipboardPasteAction');
                selectAll = this.createMenuItem(nls.localize(45, null), 'editor.action.selectAll');
            }
            var find = this.createMenuItem(nls.localize(46, null), 'actions.find');
            var replace = this.createMenuItem(nls.localize(47, null), 'editor.action.startFindReplaceAction');
            var findInFiles = this.createMenuItem(nls.localize(48, null), 'workbench.view.search');
            [
                undo,
                redo,
                __separator__(),
                cut,
                copy,
                paste,
                selectAll,
                __separator__(),
                find,
                replace,
                __separator__(),
                findInFiles
            ].forEach(function (item) { return winLinuxEditMenu.append(item); });
        };
        VSCodeMenu.prototype.setViewMenu = function (viewMenu) {
            var explorer = this.createMenuItem(nls.localize(49, null), 'workbench.view.explorer');
            var search = this.createMenuItem(nls.localize(50, null), 'workbench.view.search');
            var git = this.createMenuItem(nls.localize(51, null), 'workbench.view.git');
            var debug = this.createMenuItem(nls.localize(52, null), 'workbench.view.debug');
            var commands = this.createMenuItem(nls.localize(53, null), 'workbench.action.showCommands');
            var markers = this.createMenuItem(nls.localize(54, null), 'workbench.action.showErrorsWarnings');
            var output = this.createMenuItem(nls.localize(55, null), 'workbench.action.output.toggleOutput');
            var debugConsole = this.createMenuItem(nls.localize(56, null), 'workbench.debug.action.toggleRepl');
            var fullscreen = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(57, null)), accelerator: this.getAccelerator('workbench.action.toggleFullScreen'), click: function () { return windows.manager.getLastActiveWindow().toggleFullScreen(); }, enabled: windows.manager.getWindowCount() > 0 });
            var toggleMenuBar = this.createMenuItem(nls.localize(58, null), 'workbench.action.toggleMenuBar');
            var splitEditor = this.createMenuItem(nls.localize(59, null), 'workbench.action.splitEditor');
            var toggleSidebar = this.createMenuItem(nls.localize(60, null), 'workbench.action.toggleSidebarVisibility');
            var moveSidebar = this.createMenuItem(nls.localize(61, null), 'workbench.action.toggleSidebarPosition');
            var togglePanel = this.createMenuItem(nls.localize(62, null), 'workbench.action.togglePanel');
            var toggleWordWrap = this.createMenuItem(nls.localize(63, null), 'editor.action.toggleWordWrap');
            var toggleRenderWhitespace = this.createMenuItem(nls.localize(64, null), 'editor.action.toggleRenderWhitespace');
            var zoomIn = this.createMenuItem(nls.localize(65, null), 'workbench.action.zoomIn');
            var zoomOut = this.createMenuItem(nls.localize(66, null), 'workbench.action.zoomOut');
            arrays.coalesce([
                explorer,
                search,
                git,
                debug,
                __separator__(),
                commands,
                markers,
                __separator__(),
                output,
                debugConsole,
                __separator__(),
                fullscreen,
                platform.isWindows || platform.isLinux ? toggleMenuBar : void 0,
                __separator__(),
                splitEditor,
                toggleSidebar,
                moveSidebar,
                togglePanel,
                __separator__(),
                toggleWordWrap,
                toggleRenderWhitespace,
                __separator__(),
                zoomIn,
                zoomOut
            ]).forEach(function (item) { return viewMenu.append(item); });
        };
        VSCodeMenu.prototype.setGotoMenu = function (gotoMenu) {
            var back = this.createMenuItem(nls.localize(67, null), 'workbench.action.navigateBack');
            var forward = this.createMenuItem(nls.localize(68, null), 'workbench.action.navigateForward');
            var navigateHistory = this.createMenuItem(nls.localize(69, null), 'workbench.action.openPreviousEditor');
            var gotoFile = this.createMenuItem(nls.localize(70, null), 'workbench.action.quickOpen');
            var gotoSymbol = this.createMenuItem(nls.localize(71, null), 'workbench.action.gotoSymbol');
            var gotoDefinition = this.createMenuItem(nls.localize(72, null), 'editor.action.goToDeclaration');
            var gotoLine = this.createMenuItem(nls.localize(73, null), 'workbench.action.gotoLine');
            [
                back,
                forward,
                __separator__(),
                navigateHistory,
                __separator__(),
                gotoFile,
                gotoSymbol,
                gotoDefinition,
                gotoLine
            ].forEach(function (item) { return gotoMenu.append(item); });
        };
        VSCodeMenu.prototype.setMacWindowMenu = function (macWindowMenu) {
            var minimize = new electron_1.MenuItem({ label: nls.localize(74, null), role: 'minimize', accelerator: 'Command+M', enabled: windows.manager.getWindowCount() > 0 });
            var close = new electron_1.MenuItem({ label: nls.localize(75, null), role: 'close', accelerator: 'Command+W', enabled: windows.manager.getWindowCount() > 0 });
            var bringAllToFront = new electron_1.MenuItem({ label: nls.localize(76, null), role: 'front', enabled: windows.manager.getWindowCount() > 0 });
            [
                minimize,
                close,
                __separator__(),
                bringAllToFront
            ].forEach(function (item) { return macWindowMenu.append(item); });
        };
        VSCodeMenu.prototype.setHelpMenu = function (helpMenu) {
            var toggleDevToolsItem = new electron_1.MenuItem({
                label: mnemonicLabel(nls.localize(77, null)),
                accelerator: this.getAccelerator('workbench.action.toggleDevTools'),
                click: toggleDevTools,
                enabled: (windows.manager.getWindowCount() > 0)
            });
            arrays.coalesce([
                env.product.documentationUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(78, null)), click: function () { return openUrl(env.product.documentationUrl, 'openDocumentationUrl'); } }) : null,
                env.product.releaseNotesUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(79, null)), click: function () { return openUrl(env.product.releaseNotesUrl, 'openReleaseNotesUrl'); } }) : null,
                (env.product.documentationUrl || env.product.releaseNotesUrl) ? __separator__() : null,
                env.product.twitterUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(80, null)), click: function () { return openUrl(env.product.twitterUrl, 'openTwitterUrl'); } }) : null,
                env.product.requestFeatureUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(81, null)), click: function () { return openUrl(env.product.requestFeatureUrl, 'openUserVoiceUrl'); } }) : null,
                env.product.reportIssueUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(82, null)), click: function () { return openUrl(env.product.reportIssueUrl, 'openReportIssues'); } }) : null,
                (env.product.twitterUrl || env.product.requestFeatureUrl || env.product.reportIssueUrl) ? __separator__() : null,
                env.product.licenseUrl ? new electron_1.MenuItem({
                    label: mnemonicLabel(nls.localize(83, null)), click: function () {
                        if (platform.language) {
                            var queryArgChar = env.product.licenseUrl.indexOf('?') > 0 ? '&' : '?';
                            openUrl("" + env.product.licenseUrl + queryArgChar + "lang=" + platform.language, 'openLicenseUrl');
                        }
                        else {
                            openUrl(env.product.licenseUrl, 'openLicenseUrl');
                        }
                    }
                }) : null,
                env.product.privacyStatementUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(84, null)), click: function () { return openUrl(env.product.privacyStatementUrl, 'openPrivacyStatement'); } }) : null,
                (env.product.licenseUrl || env.product.privacyStatementUrl) ? __separator__() : null,
                toggleDevToolsItem,
            ]).forEach(function (item) { return helpMenu.append(item); });
            if (!platform.isMacintosh) {
                var updateMenuItems = this.getUpdateMenuItems();
                if (updateMenuItems.length) {
                    helpMenu.append(__separator__());
                    updateMenuItems.forEach(function (i) { return helpMenu.append(i); });
                }
                helpMenu.append(__separator__());
                helpMenu.append(new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(85, null)), click: openAboutDialog }));
            }
        };
        VSCodeMenu.prototype.getUpdateMenuItems = function () {
            switch (UpdateManager.state) {
                case um.State.Uninitialized:
                    return [];
                case um.State.UpdateDownloaded:
                    var update_1 = UpdateManager.availableUpdate;
                    return [new electron_1.MenuItem({
                            label: nls.localize(86, null), click: function () {
                                reportMenuActionTelemetry('RestartToUpdate');
                                update_1.quitAndUpdate();
                            }
                        })];
                case um.State.CheckingForUpdate:
                    return [new electron_1.MenuItem({ label: nls.localize(87, null), enabled: false })];
                case um.State.UpdateAvailable:
                    var updateAvailableLabel = platform.isWindows
                        ? nls.localize(88, null)
                        : nls.localize(89, null);
                    return [new electron_1.MenuItem({ label: updateAvailableLabel, enabled: false })];
                default:
                    var result = [new electron_1.MenuItem({
                            label: nls.localize(90, null), click: function () { return setTimeout(function () {
                                reportMenuActionTelemetry('CheckForUpdate');
                                UpdateManager.checkForUpdates(true);
                            }, 0); }
                        })];
                    if (UpdateManager.lastCheckDate) {
                        result.push(new electron_1.MenuItem({ label: nls.localize(91, null, UpdateManager.lastCheckDate.toLocaleTimeString()), enabled: false }));
                    }
                    return result;
            }
        };
        VSCodeMenu.prototype.createMenuItem = function (arg1, arg2, arg3) {
            var label = mnemonicLabel(arg1);
            var click = (typeof arg2 === 'function') ? arg2 : function () { return windows.manager.sendToFocused('vscode:runAction', arg2); };
            var enabled = typeof arg3 === 'boolean' ? arg3 : windows.manager.getWindowCount() > 0;
            var actionId;
            if (typeof arg2 === 'string') {
                actionId = arg2;
            }
            var options = {
                label: label,
                accelerator: this.getAccelerator(actionId),
                click: click,
                enabled: enabled
            };
            return new electron_1.MenuItem(options);
        };
        VSCodeMenu.prototype.createDevToolsAwareMenuItem = function (label, actionId, devToolsFocusedFn) {
            return new electron_1.MenuItem({
                label: mnemonicLabel(label),
                accelerator: this.getAccelerator(actionId),
                enabled: windows.manager.getWindowCount() > 0,
                click: function () {
                    var windowInFocus = windows.manager.getFocusedWindow();
                    if (!windowInFocus) {
                        return;
                    }
                    if (windowInFocus.win.isDevToolsFocused()) {
                        devToolsFocusedFn(windowInFocus.win.devToolsWebContents);
                    }
                    else {
                        windows.manager.sendToFocused('vscode:runAction', actionId);
                    }
                }
            });
        };
        VSCodeMenu.prototype.getAccelerator = function (actionId) {
            if (actionId) {
                var resolvedKeybinding = this.mapResolvedKeybindingToActionId[actionId];
                if (resolvedKeybinding) {
                    return resolvedKeybinding; // keybinding is fully resolved
                }
                if (!this.keybindingsResolved) {
                    this.actionIdKeybindingRequests.push(actionId); // keybinding needs to be resolved
                }
                var lastKnownKeybinding = this.mapLastKnownKeybindingToActionId[actionId];
                return lastKnownKeybinding; // return the last known keybining (chance of mismatch is very low unless it changed)
            }
            return void (0);
        };
        VSCodeMenu.lastKnownKeybindingsMapStorageKey = 'lastKnownKeybindings';
        VSCodeMenu.MAX_RECENT_ENTRIES = 10;
        return VSCodeMenu;
    }());
    exports.VSCodeMenu = VSCodeMenu;
    function openAboutDialog() {
        var lastActiveWindow = windows.manager.getFocusedWindow() || windows.manager.getLastActiveWindow();
        electron_1.dialog.showMessageBox(lastActiveWindow && lastActiveWindow.win, {
            title: env.product.nameLong,
            type: 'info',
            message: env.product.nameLong,
            detail: nls.localize(92, null, electron_1.app.getVersion(), env.product.commit || 'Unknown', env.product.date || 'Unknown', process.versions['electron'], process.versions['chrome'], process.versions['node']),
            buttons: [nls.localize(93, null)],
            noLink: true
        }, function (result) { return null; });
        reportMenuActionTelemetry('showAboutDialog');
    }
    function openUrl(url, id) {
        electron_1.shell.openExternal(url);
        reportMenuActionTelemetry(id);
    }
    function toggleDevTools() {
        var w = windows.manager.getFocusedWindow();
        if (w && w.win) {
            w.win.webContents.toggleDevTools();
        }
    }
    function reportMenuActionTelemetry(id) {
        windows.manager.sendToFocused('vscode:telemetry', { eventName: 'workbenchActionExecuted', data: { id: id, from: 'menu' } });
    }
    function __separator__() {
        return new electron_1.MenuItem({ type: 'separator' });
    }
    function mnemonicLabel(label) {
        if (platform.isMacintosh) {
            return label.replace(/&&/g, ''); // no mnemonic support on mac
        }
        return label.replace(/&&/g, '&');
    }
    exports.manager = new VSCodeMenu();
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/parts/git/electron-main/askpassService", ["require", "exports", 'vs/nls!vs/workbench/parts/git/electron-main/askpassService', 'electron', 'vs/base/common/platform', 'vs/base/common/winjs.base'], function (require, exports, nls, electron_1, platform, winjs_base_1) {
    "use strict";
    var GitAskpassService = (function () {
        function GitAskpassService() {
            var _this = this;
            this.askpassCache = Object.create(null);
            electron_1.ipcMain.on('git:askpass', function (event, result) {
                _this.askpassCache[result.id].credentials = result.credentials;
            });
        }
        GitAskpassService.prototype.askpass = function (id, host, command) {
            var _this = this;
            return new winjs_base_1.TPromise(function (c, e) {
                var cachedResult = _this.askpassCache[id];
                if (typeof cachedResult !== 'undefined') {
                    return c(cachedResult.credentials);
                }
                if (command === 'fetch') {
                    return c({ username: '', password: '' });
                }
                var win = new electron_1.BrowserWindow({
                    alwaysOnTop: true,
                    skipTaskbar: true,
                    resizable: false,
                    width: 450,
                    height: platform.isWindows ? 280 : 260,
                    show: true,
                    title: nls.localize(0, null)
                });
                win.setMenuBarVisibility(false);
                _this.askpassCache[id] = {
                    window: win,
                    credentials: null
                };
                win.loadURL(require.toUrl('vs/workbench/parts/git/electron-main/index.html'));
                win.webContents.executeJavaScript('init(' + JSON.stringify({ id: id, host: host, command: command }) + ')');
                win.once('closed', function () {
                    c(_this.askpassCache[id].credentials);
                    setTimeout(function () { return delete _this.askpassCache[id]; }, 1000 * 10);
                });
            });
        };
        return GitAskpassService;
    }());
    exports.GitAskpassService = GitAskpassService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/electron-main/main", ["require", "exports", 'electron', 'fs', 'vs/nls!vs/workbench/electron-main/main', 'vs/base/common/objects', 'vs/base/common/platform', 'vs/workbench/electron-main/env', 'vs/workbench/electron-main/windows', 'vs/workbench/electron-main/lifecycle', 'vs/workbench/electron-main/menus', 'vs/workbench/electron-main/settings', 'vs/workbench/electron-main/update-manager', 'vs/base/node/service.net', 'vs/base/node/env', 'vs/base/common/winjs.base', 'vs/workbench/parts/git/electron-main/askpassService', 'vs/workbench/electron-main/sharedProcess'], function (require, exports, electron_1, fs, nls, objects_1, platform, env, windows, lifecycle, menu, settings, update_manager_1, service_net_1, env_1, winjs_base_1, askpassService_1, sharedProcess_1) {
    'use strict';
    var LaunchService = (function () {
        function LaunchService() {
        }
        LaunchService.prototype.start = function (args, userEnv) {
            env.log('Received data from other instance', args);
            // Otherwise handle in windows manager
            var usedWindows;
            if (!!args.extensionDevelopmentPath) {
                windows.manager.openPluginDevelopmentHostWindow({ cli: args, userEnv: userEnv });
            }
            else if (args.pathArguments.length === 0 && args.openNewWindow) {
                usedWindows = windows.manager.open({ cli: args, userEnv: userEnv, forceNewWindow: true, forceEmpty: true });
            }
            else if (args.pathArguments.length === 0) {
                usedWindows = [windows.manager.focusLastActive(args)];
            }
            else {
                usedWindows = windows.manager.open({ cli: args, userEnv: userEnv, forceNewWindow: args.waitForWindowClose || args.openNewWindow, preferNewWindow: !args.openInSameWindow });
            }
            // If the other instance is waiting to be killed, we hook up a window listener if one window
            // is being used and only then resolve the startup promise which will kill this second instance
            if (args.waitForWindowClose && usedWindows && usedWindows.length === 1 && usedWindows[0]) {
                var windowId_1 = usedWindows[0].id;
                return new winjs_base_1.TPromise(function (c, e) {
                    var unbind = windows.onClose(function (id) {
                        if (id === windowId_1) {
                            unbind();
                            c(null);
                        }
                    });
                });
            }
            return winjs_base_1.TPromise.as(null);
        };
        return LaunchService;
    }());
    exports.LaunchService = LaunchService;
    // We handle uncaught exceptions here to prevent electron from opening a dialog to the user
    process.on('uncaughtException', function (err) {
        if (err) {
            // take only the message and stack property
            var friendlyError = {
                message: err.message,
                stack: err.stack
            };
            // handle on client side
            windows.manager.sendToFocused('vscode:reportError', JSON.stringify(friendlyError));
        }
        console.error('[uncaught exception in main]: ' + err);
        if (err.stack) {
            console.error(err.stack);
        }
    });
    function quit(arg) {
        var exitCode = 0;
        if (typeof arg === 'string') {
            env.log(arg);
        }
        else {
            exitCode = 1; // signal error to the outside
            if (arg.stack) {
                console.error(arg.stack);
            }
            else {
                console.error('Startup error: ' + arg.toString());
            }
        }
        process.exit(exitCode);
    }
    function main(ipcServer, userEnv) {
        env.log('### VSCode main.js ###');
        env.log(env.appRoot, env.cliArgs);
        // Setup Windows mutex
        var windowsMutex = null;
        try {
            var Mutex_1 = require.__$__nodeRequire('windows-mutex').Mutex;
            windowsMutex = new Mutex_1(env.product.win32MutexName);
        }
        catch (e) {
        }
        // Register IPC services
        ipcServer.registerService('LaunchService', new LaunchService());
        ipcServer.registerService('GitAskpassService', new askpassService_1.GitAskpassService());
        // Used by sub processes to communicate back to the main instance
        process.env['VSCODE_PID'] = '' + process.pid;
        process.env['VSCODE_IPC_HOOK'] = env.mainIPCHandle;
        process.env['VSCODE_SHARED_IPC_HOOK'] = env.sharedIPCHandle;
        // Spawn shared process
        var sharedProcess = sharedProcess_1.spawnSharedProcess();
        // Make sure we associate the program with the app user model id
        // This will help Windows to associate the running program with
        // any shortcut that is pinned to the taskbar and prevent showing
        // two icons in the taskbar for the same app.
        if (platform.isWindows && env.product.win32AppUserModelId) {
            electron_1.app.setAppUserModelId(env.product.win32AppUserModelId);
        }
        // Set programStart in the global scope
        global.programStart = env.cliArgs.programStart;
        // Dispose on app quit
        electron_1.app.on('will-quit', function () {
            env.log('App#dispose: deleting running instance handle');
            if (ipcServer) {
                ipcServer.dispose();
                ipcServer = null;
            }
            sharedProcess.dispose();
            if (windowsMutex) {
                windowsMutex.release();
            }
        });
        // Lifecycle
        lifecycle.manager.ready();
        // Load settings
        settings.manager.loadSync();
        // Propagate to clients
        windows.manager.ready(userEnv);
        // Install Menu
        menu.manager.ready();
        // Install Tasks
        if (platform.isWindows && env.isBuilt) {
            electron_1.app.setUserTasks([
                {
                    title: nls.localize(0, null),
                    program: process.execPath,
                    arguments: '-n',
                    iconPath: process.execPath,
                    iconIndex: 0
                }
            ]);
        }
        // Setup auto update
        update_manager_1.Instance.initialize();
        // Open our first window
        if (env.cliArgs.openNewWindow && env.cliArgs.pathArguments.length === 0) {
            windows.manager.open({ cli: env.cliArgs, forceNewWindow: true, forceEmpty: true }); // new window if "-n" was used without paths
        }
        else if (global.macOpenFiles && global.macOpenFiles.length && (!env.cliArgs.pathArguments || !env.cliArgs.pathArguments.length)) {
            windows.manager.open({ cli: env.cliArgs, pathsToOpen: global.macOpenFiles }); // mac: open-file event received on startup
        }
        else {
            windows.manager.open({ cli: env.cliArgs, forceNewWindow: env.cliArgs.openNewWindow }); // default: read paths from cli
        }
    }
    function setupIPC() {
        function setup(retry) {
            return service_net_1.serve(env.mainIPCHandle).then(null, function (err) {
                if (err.code !== 'EADDRINUSE') {
                    return winjs_base_1.TPromise.wrapError(err);
                }
                // Since we are the second instance, we do not want to show the dock
                if (platform.isMacintosh) {
                    electron_1.app.dock.hide();
                }
                // Tests from CLI require to be the only instance currently (TODO@Ben support multiple instances and output)
                if (env.isTestingFromCli) {
                    var errorMsg = 'Running extension tests from the command line is currently only supported if no other instance of Code is running.';
                    console.error(errorMsg);
                    return winjs_base_1.TPromise.wrapError(errorMsg);
                }
                // there's a running instance, let's connect to it
                return service_net_1.connect(env.mainIPCHandle).then(function (client) {
                    env.log('Sending env to running instance...');
                    var service = client.getService('LaunchService', LaunchService);
                    return service.start(env.cliArgs, process.env)
                        .then(function () { return client.dispose(); })
                        .then(function () { return winjs_base_1.TPromise.wrapError('Sent env to running instance. Terminating...'); });
                }, function (err) {
                    if (!retry || platform.isWindows || err.code !== 'ECONNREFUSED') {
                        return winjs_base_1.TPromise.wrapError(err);
                    }
                    // it happens on Linux and OS X that the pipe is left behind
                    // let's delete it, since we can't connect to it
                    // and the retry the whole thing
                    try {
                        fs.unlinkSync(env.mainIPCHandle);
                    }
                    catch (e) {
                        env.log('Fatal error deleting obsolete instance handle', e);
                        return winjs_base_1.TPromise.wrapError(e);
                    }
                    return setup(false);
                });
            });
        }
        return setup(true);
    }
    // On some platforms we need to manually read from the global environment variables
    // and assign them to the process environment (e.g. when doubleclick app on Mac)
    env_1.getUserEnvironment()
        .then(function (userEnv) {
        objects_1.assign(process.env, userEnv);
        // Make sure the NLS Config travels to the rendered process
        // See also https://github.com/Microsoft/vscode/issues/4558
        userEnv['VSCODE_NLS_CONFIG'] = process.env['VSCODE_NLS_CONFIG'];
        return setupIPC()
            .then(function (ipcServer) { return main(ipcServer, userEnv); });
    })
        .done(null, quit);
});

//# sourceMappingURL=main.js.map
