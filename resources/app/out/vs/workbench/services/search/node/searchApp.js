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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/base/common/events", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var Event = (function () {
        function Event(originalEvent) {
            this.time = (new Date()).getTime();
            this.originalEvent = originalEvent;
            this.source = null;
        }
        return Event;
    }());
    exports.Event = Event;
    var PropertyChangeEvent = (function (_super) {
        __extends(PropertyChangeEvent, _super);
        function PropertyChangeEvent(key, oldValue, newValue, originalEvent) {
            _super.call(this, originalEvent);
            this.key = key;
            this.oldValue = oldValue;
            this.newValue = newValue;
        }
        return PropertyChangeEvent;
    }(Event));
    exports.PropertyChangeEvent = PropertyChangeEvent;
    var ViewerEvent = (function (_super) {
        __extends(ViewerEvent, _super);
        function ViewerEvent(element, originalEvent) {
            _super.call(this, originalEvent);
            this.element = element;
        }
        return ViewerEvent;
    }(Event));
    exports.ViewerEvent = ViewerEvent;
    exports.EventType = {
        PROPERTY_CHANGED: 'propertyChanged',
        SELECTION: 'selection',
        FOCUS: 'focus',
        BLUR: 'blur',
        HIGHLIGHT: 'highlight',
        EXPAND: 'expand',
        COLLAPSE: 'collapse',
        TOGGLE: 'toggle',
        CONTENTS_CHANGED: 'contentsChanged',
        BEFORE_RUN: 'beforeRun',
        RUN: 'run',
        EDIT: 'edit',
        SAVE: 'save',
        CANCEL: 'cancel',
        CHANGE: 'change',
        DISPOSE: 'dispose',
    };
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/common/scorer", ["require", "exports"], function (require, exports) {
    'use strict';
    // Based on material from:
    /*!
    * string_score.js: String Scoring Algorithm 0.1.22
    *
    * http://joshaven.com/string_score
    * https://github.com/joshaven/string_score
    *
    * Copyright (C) 2009-2014 Joshaven Potter <yourtech@gmail.com>
    * Special thanks to all of the contributors listed here https://github.com/joshaven/string_score
    * MIT License: http://opensource.org/licenses/MIT
    *
    * Date: Tue Mar 1 2011
    * Updated: Tue Mar 10 2015
    */
    /**
     * Compute a score for the given string and the given query.
     *
     * Rules:
     * Character score: 1
     * Same case bonus: 1
     * Upper case bonus: 1
     * Start of word/path bonus: 7
     * Start of string bonus: 8
     */
    var wordPathBoundary = ['-', '_', ' ', '/', '\\', '.'];
    function score(target, query, cache) {
        if (!target || !query) {
            return 0; // return early if target or query are undefined
        }
        var hash = target + query;
        var cached = cache && cache[hash];
        if (typeof cached === 'number') {
            return cached;
        }
        var queryLen = query.length;
        var targetLower = target.toLowerCase();
        var queryLower = query.toLowerCase();
        var index = 0;
        var lastIndexOf = -1;
        var score = 0;
        while (index < queryLen) {
            var indexOf = targetLower.indexOf(queryLower[index], lastIndexOf + 1);
            if (indexOf < 0) {
                score = 0; // This makes sure that the query is contained in the target
                break;
            }
            lastIndexOf = indexOf;
            // Character Match Bonus
            score += 1;
            // Same Case Bonous
            if (target[indexOf] === query[indexOf]) {
                score += 1;
            }
            // Prefix Bonus
            if (indexOf === 0) {
                score += 8;
            }
            else if (wordPathBoundary.some(function (w) { return w === target[indexOf - 1]; })) {
                score += 7;
            }
            else if (isUpper(target.charCodeAt(indexOf))) {
                score += 1;
            }
            index++;
        }
        if (cache) {
            cache[hash] = score;
        }
        return score;
    }
    exports.score = score;
    function isUpper(code) {
        return 65 <= code && code <= 90;
    }
    /**
     * A fast method to check if a given string would produce a score > 0 for the given query.
     */
    function matches(target, queryLower) {
        if (!target || !queryLower) {
            return false; // return early if target or query are undefined
        }
        var queryLen = queryLower.length;
        var targetLower = target.toLowerCase();
        var index = 0;
        var lastIndexOf = -1;
        while (index < queryLen) {
            var indexOf = targetLower.indexOf(queryLower[index], lastIndexOf + 1);
            if (indexOf < 0) {
                return false;
            }
            lastIndexOf = indexOf;
            index++;
        }
        return true;
    }
    exports.matches = matches;
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

define("vs/base/common/glob", ["require", "exports", 'vs/base/common/strings', 'vs/base/common/paths'], function (require, exports, strings, paths) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var CACHE = Object.create(null);
    var PATH_REGEX = '[/\\\\]'; // any slash or backslash
    var NO_PATH_REGEX = '[^/\\\\]'; // any non-slash and non-backslash
    function starsToRegExp(starCount) {
        switch (starCount) {
            case 0:
                return '';
            case 1:
                return NO_PATH_REGEX + '*?'; // 1 star matches any number of characters except path separator (/ and \) - non greedy (?)
            default:
                // Matches:  (Path Sep    OR     Path Val followed by Path Sep     OR    Path Sep followed by Path Val) 0-many times
                // Group is non capturing because we don't need to capture at all (?:...)
                // Overall we use non-greedy matching because it could be that we match too much
                return '(?:' + PATH_REGEX + '|' + NO_PATH_REGEX + '+' + PATH_REGEX + '|' + PATH_REGEX + NO_PATH_REGEX + '+)*?';
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
        var segments = splitGlobAware(pattern, '/');
        // Special case where we only have globstars
        if (segments.every(function (s) { return s === '**'; })) {
            regEx = '.*';
        }
        else {
            var previousSegmentWasGlobStar_1 = false;
            segments.forEach(function (segment, index) {
                // Globstar is special
                if (segment === '**') {
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
                    if (char !== ']' && inBrackets) {
                        var res = void 0;
                        switch (char) {
                            case '-':
                                res = char;
                                break;
                            case '^':
                                res = char;
                                break;
                            default:
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
                            var braceRegExp = '(?:' + choices.reduce(function (prevValue, curValue, i, array) {
                                return prevValue + '|' + parseRegExp(curValue);
                            }, parseRegExp(choices[0]) /* parse the first segment as regex and give as initial value */) + ')';
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
                // Tail: Add the slash we had split on if there is more to come and the next one is not a globstar
                if (index < segments.length - 1 && segments[index + 1] !== '**') {
                    regEx += PATH_REGEX;
                }
                // reset state
                previousSegmentWasGlobStar_1 = false;
            });
        }
        return regEx;
    }
    function globToRegExp(pattern) {
        if (!pattern) {
            return null;
        }
        // Whitespace trimming
        pattern = pattern.trim();
        // Check cache
        if (CACHE[pattern]) {
            var cached = CACHE[pattern];
            cached.lastIndex = 0; // reset RegExp to its initial state to reuse it!
            return cached;
        }
        var regEx = parseRegExp(pattern);
        // Wrap it
        regEx = '^' + regEx + '$';
        // Convert to regexp and be ready for errors
        var result = toRegExp(regEx);
        // Make sure to cache
        CACHE[pattern] = result;
        return result;
    }
    function toRegExp(regEx) {
        try {
            return new RegExp(regEx);
        }
        catch (error) {
            return /.^/; // create a regex that matches nothing if we cannot parse the pattern
        }
    }
    function match(arg1, path, siblings) {
        if (!arg1 || !path) {
            return false;
        }
        // Glob with String
        if (typeof arg1 === 'string') {
            var regExp = globToRegExp(arg1);
            return regExp && regExp.test(path);
        }
        // Glob with Expression
        return matchExpression(arg1, path, siblings);
    }
    exports.match = match;
    function matchExpression(expression, path, siblings) {
        var patterns = Object.getOwnPropertyNames(expression);
        var basename;
        var _loop_1 = function(i) {
            var pattern = patterns[i];
            var value = expression[pattern];
            if (value === false) {
                return "continue"; // pattern is disabled
            }
            // Pattern matches path
            if (match(pattern, path)) {
                // Expression Pattern is <boolean>
                if (typeof value === 'boolean') {
                    return { value: pattern };
                }
                // Expression Pattern is <SiblingClause>
                if (value && typeof value.when === 'string') {
                    if (!siblings || !siblings.length) {
                        return "continue"; // pattern is malformed or we don't have siblings
                    }
                    if (!basename) {
                        basename = strings.rtrim(paths.basename(path), paths.extname(path));
                    }
                    var clause = value;
                    var clausePattern_1 = clause.when.replace('$(basename)', basename);
                    if (siblings.some(function (sibling) { return sibling === clausePattern_1; })) {
                        return { value: pattern };
                    }
                    else {
                        return "continue"; // pattern does not match in the end because the when clause is not satisfied
                    }
                }
                // Expression is Anything
                return { value: pattern };
            }
        };
        for (var i = 0; i < patterns.length; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object") return state_1.value;
            if (state_1 === "continue") continue;
        }
        return null;
    }
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

define("vs/base/common/mime", ["require", "exports", 'vs/base/common/paths', 'vs/base/common/types', 'vs/base/common/strings', 'vs/base/common/glob'], function (require, exports, paths, types, strings, glob_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.MIME_TEXT = 'text/plain';
    exports.MIME_BINARY = 'application/octet-stream';
    exports.MIME_UNKNOWN = 'application/unknown';
    var registeredAssociations = [];
    /**
     * Associate a text mime to the registry.
     */
    function registerTextMime(association) {
        // Register
        registeredAssociations.push(association);
        // Check for conflicts unless this is a user configured association
        if (!association.userConfigured) {
            registeredAssociations.forEach(function (a) {
                if (a.mime === association.mime || a.userConfigured) {
                    return; // same mime or userConfigured is ok
                }
                if (association.extension && a.extension === association.extension) {
                    console.warn("Overwriting extension <<" + association.extension + ">> to now point to mime <<" + association.mime + ">>");
                }
                if (association.filename && a.filename === association.filename) {
                    console.warn("Overwriting filename <<" + association.filename + ">> to now point to mime <<" + association.mime + ">>");
                }
                if (association.filepattern && a.filepattern === association.filepattern) {
                    console.warn("Overwriting filepattern <<" + association.filepattern + ">> to now point to mime <<" + association.mime + ">>");
                }
                if (association.firstline && a.firstline === association.firstline) {
                    console.warn("Overwriting firstline <<" + association.firstline + ">> to now point to mime <<" + association.mime + ">>");
                }
            });
        }
    }
    exports.registerTextMime = registerTextMime;
    /**
     * Clear text mimes from the registry.
     */
    function clearTextMimes(onlyUserConfigured) {
        if (!onlyUserConfigured) {
            registeredAssociations = [];
        }
        else {
            registeredAssociations = registeredAssociations.filter(function (a) { return !a.userConfigured; });
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
        // 1.) User configured mappings have highest priority
        var configuredMime = guessMimeTypeByPath(path, registeredAssociations.filter(function (a) { return a.userConfigured; }));
        if (configuredMime) {
            return [configuredMime, exports.MIME_TEXT];
        }
        // 2.) Registered mappings have middle priority
        var registeredMime = guessMimeTypeByPath(path, registeredAssociations.filter(function (a) { return !a.userConfigured; }));
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
    function guessMimeTypeByPath(path, associations) {
        var filename = paths.basename(path);
        var filenameMatch;
        var patternMatch;
        var extensionMatch;
        for (var i = 0; i < associations.length; i++) {
            var association = associations[i];
            // First exact name match
            if (association.filename && filename === association.filename.toLowerCase()) {
                filenameMatch = association;
                break; // take it!
            }
            // Longest pattern match
            if (association.filepattern) {
                var target = association.filepattern.indexOf(paths.sep) >= 0 ? path : filename; // match on full path if pattern contains path separator
                if (glob_1.match(association.filepattern.toLowerCase(), target)) {
                    if (!patternMatch || association.filepattern.length > patternMatch.filepattern.length) {
                        patternMatch = association;
                    }
                }
            }
            // Longest extension match
            if (association.extension) {
                if (strings.endsWith(filename, association.extension.toLowerCase())) {
                    if (!extensionMatch || association.extension.length > extensionMatch.extension.length) {
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
                // Make sure the entire line matches, not just a subpart.
                var matches = firstLine.match(association.firstline);
                if (matches && matches.length > 0 && matches[0].length === firstLine.length) {
                    return association.mime;
                }
            }
        }
        return null;
    }
    function isBinaryMime(mimes) {
        if (!mimes) {
            return false;
        }
        var mimeVals;
        if (types.isArray(mimes)) {
            mimeVals = mimes;
        }
        else {
            mimeVals = mimes.split(',').map(function (mime) { return mime.trim(); });
        }
        return mimeVals.indexOf(exports.MIME_BINARY) >= 0;
    }
    exports.isBinaryMime = isBinaryMime;
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
    function suggestFilename(theMime, prefix) {
        for (var i = 0; i < registeredAssociations.length; i++) {
            var association = registeredAssociations[i];
            if (association.userConfigured) {
                continue; // only support registered ones
            }
            if (association.mime === theMime && association.extension) {
                return prefix + association.extension;
            }
        }
        return null;
    }
    exports.suggestFilename = suggestFilename;
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
define("vs/base/node/stream", ["require", "exports", 'fs'], function (require, exports, fs) {
    'use strict';
    /**
     * Reads up to total bytes from the provided stream.
     */
    function readExactlyByStream(stream, totalBytes, callback) {
        var done = false;
        var buffer = new Buffer(totalBytes);
        var bytesRead = 0;
        stream.on('data', function (data) {
            var bytesToRead = Math.min(totalBytes - bytesRead, data.length);
            data.copy(buffer, bytesRead, 0, bytesToRead);
            bytesRead += bytesToRead;
            if (bytesRead === totalBytes) {
                stream.destroy(); // Will trigger the close event eventually
            }
        });
        stream.on('error', function (e) {
            if (!done) {
                done = true;
                callback(e, null, null);
            }
        });
        var onSuccess = function () {
            if (!done) {
                done = true;
                callback(null, buffer, bytesRead);
            }
        };
        stream.on('close', onSuccess);
    }
    exports.readExactlyByStream = readExactlyByStream;
    /**
     * Reads totalBytes from the provided file.
     */
    function readExactlyByFile(file, totalBytes, callback) {
        fs.open(file, 'r', null, function (err, fd) {
            if (err) {
                return callback(err, null, 0);
            }
            function end(err, resultBuffer, bytesRead) {
                fs.close(fd, function (closeError) {
                    if (closeError) {
                        return callback(closeError, null, bytesRead);
                    }
                    if (err && err.code === 'EISDIR') {
                        return callback(err, null, bytesRead); // we want to bubble this error up (file is actually a folder)
                    }
                    return callback(null, resultBuffer, bytesRead);
                });
            }
            var buffer = new Buffer(totalBytes);
            var bytesRead = 0;
            var zeroAttempts = 0;
            function loop() {
                fs.read(fd, buffer, bytesRead, totalBytes - bytesRead, null, function (err, moreBytesRead) {
                    if (err) {
                        return end(err, null, 0);
                    }
                    // Retry up to N times in case 0 bytes where read
                    if (moreBytesRead === 0) {
                        if (++zeroAttempts === 10) {
                            return end(null, buffer, bytesRead);
                        }
                        return loop();
                    }
                    bytesRead += moreBytesRead;
                    if (bytesRead === totalBytes) {
                        return end(null, buffer, bytesRead);
                    }
                    return loop();
                });
            }
            loop();
        });
    }
    exports.readExactlyByFile = readExactlyByFile;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/node/encoding", ["require", "exports", 'vs/base/node/stream', 'iconv-lite'], function (require, exports, stream, iconv) {
    'use strict';
    exports.UTF8 = 'utf8';
    exports.UTF8_with_bom = 'utf8bom';
    exports.UTF16be = 'utf16be';
    exports.UTF16le = 'utf16le';
    function decode(buffer, encoding, options) {
        return iconv.decode(buffer, toNodeEncoding(encoding), options);
    }
    exports.decode = decode;
    function encode(content, encoding, options) {
        return iconv.encode(content, toNodeEncoding(encoding), options);
    }
    exports.encode = encode;
    function encodingExists(encoding) {
        return iconv.encodingExists(toNodeEncoding(encoding));
    }
    exports.encodingExists = encodingExists;
    function decodeStream(encoding) {
        return iconv.decodeStream(toNodeEncoding(encoding));
    }
    exports.decodeStream = decodeStream;
    function encodeStream(encoding) {
        return iconv.encodeStream(toNodeEncoding(encoding));
    }
    exports.encodeStream = encodeStream;
    function toNodeEncoding(enc) {
        if (enc === exports.UTF8_with_bom) {
            return exports.UTF8; // iconv does not distinguish UTF 8 with or without BOM, so we need to help it
        }
        return enc;
    }
    function detectEncodingByBOMFromBuffer(buffer, bytesRead) {
        if (!buffer || bytesRead < 2) {
            return null;
        }
        var b0 = buffer.readUInt8(0);
        var b1 = buffer.readUInt8(1);
        // UTF-16 BE
        if (b0 === 0xFE && b1 === 0xFF) {
            return exports.UTF16be;
        }
        // UTF-16 LE
        if (b0 === 0xFF && b1 === 0xFE) {
            return exports.UTF16le;
        }
        if (bytesRead < 3) {
            return null;
        }
        var b2 = buffer.readUInt8(2);
        // UTF-8
        if (b0 === 0xEF && b1 === 0xBB && b2 === 0xBF) {
            return exports.UTF8;
        }
        return null;
    }
    exports.detectEncodingByBOMFromBuffer = detectEncodingByBOMFromBuffer;
    /**
     * Detects the Byte Order Mark in a given file.
     * If no BOM is detected, `encoding` will be null.
     */
    function detectEncodingByBOM(file, callback) {
        stream.readExactlyByFile(file, 3, function (err, buffer, bytesRead) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, detectEncodingByBOMFromBuffer(buffer, bytesRead));
        });
    }
    exports.detectEncodingByBOM = detectEncodingByBOM;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/node/mime", ["require", "exports", 'vs/base/common/mime', 'vs/base/node/stream', 'vs/base/node/encoding'], function (require, exports, mime, stream, encoding) {
    'use strict';
    /**
     * Lots of binary file types exists where the type can be determined by matching the first few bytes against some "magic patterns".
     * E.g. PDF files always start with %PDF- and the rest of the file contains mostly text, but sometimes binary data (for fonts and images).
     * In order to detect these types correctly (and independently from the file's extension), the content base mime type detection must be performed
     * on any file, not only on text files.
     *
     * Here is the original mime type detection in pseudocode:
     *
     * let mimes = [];
     *
     * read file extension
     *
     * if (file extension matches) {
     * 	if (file extension is bogus) {
     * 		// ignore.
     * 		// this covers *.manifest files which can contain arbitrary content, so the extension is of no value.
     * 		// a consequence of this is that the content based mime type becomes the most specific type in the array
     * 	} else {
     * 		mimes.push(associated mime type)	  // first element: most specific
     * 	}
     * }
     *
     * read file contents
     *
     * if (content based match found) {	// this is independent from text or binary
     * 	mimes.push(associated mime type)
     * 	if (a second mime exists for the match) {   // should be rare; text/plain should never be included here
     * 		// e.g. for svg: ['image/svg+xml', 'application/xml']
     * 		mimes.push(second mime)
     * 	}
     * }
     *
     * if (content == text)
     * 	mimes.push('text/plain')   // last element: least specific
     * else
     * 	mimes.push('application/octet-stream')    // last element: least specific
     */
    var BUFFER_READ_MAX_LEN = 512; // max buffer len to use when detecting encoding/mime
    function doDetectMimesFromStream(instream, callback) {
        stream.readExactlyByStream(instream, BUFFER_READ_MAX_LEN, function (err, buffer, bytesRead) {
            handleReadResult(err, buffer, bytesRead, callback);
        });
    }
    function doDetectMimesFromFile(absolutePath, callback) {
        stream.readExactlyByFile(absolutePath, BUFFER_READ_MAX_LEN, function (err, buffer, bytesRead) {
            handleReadResult(err, buffer, bytesRead, callback);
        });
    }
    function handleReadResult(err, buffer, bytesRead, callback) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, detectMimeAndEncodingFromBuffer(buffer, bytesRead));
    }
    function detectMimeAndEncodingFromBuffer(buffer, bytesRead) {
        var enc = encoding.detectEncodingByBOMFromBuffer(buffer, bytesRead);
        // Detect 0 bytes to see if file is binary (ignore for UTF 16 though)
        var isText = true;
        if (enc !== encoding.UTF16be && enc !== encoding.UTF16le) {
            for (var i = 0; i < bytesRead && i < BUFFER_READ_MAX_LEN; i++) {
                if (buffer.readInt8(i) === 0) {
                    isText = false;
                    break;
                }
            }
        }
        return {
            mimes: isText ? [mime.MIME_TEXT] : [mime.MIME_BINARY],
            encoding: enc
        };
    }
    exports.detectMimeAndEncodingFromBuffer = detectMimeAndEncodingFromBuffer;
    function filterAndSortMimes(detectedMimes, guessedMimes) {
        var mimes = detectedMimes;
        // Add extension based mime as first element as this is the desire of whoever created the file.
        // Never care about application/octet-stream or application/unknown as guessed mime, as this is the fallback of the guess which is never accurate
        var guessedMime = guessedMimes[0];
        if (guessedMime !== mime.MIME_BINARY && guessedMime !== mime.MIME_UNKNOWN) {
            mimes.unshift(guessedMime);
        }
        // Remove duplicate elements from array and sort unspecific mime to the end
        var uniqueSortedMimes = mimes.filter(function (element, position) {
            return element && mimes.indexOf(element) === position;
        }).sort(function (mimeA, mimeB) {
            if (mimeA === mime.MIME_BINARY) {
                return 1;
            }
            if (mimeB === mime.MIME_BINARY) {
                return -1;
            }
            if (mimeA === mime.MIME_TEXT) {
                return 1;
            }
            if (mimeB === mime.MIME_TEXT) {
                return -1;
            }
            return 0;
        });
        return uniqueSortedMimes;
    }
    /**
     * Opens the given stream to detect its mime type. Returns an array of mime types sorted from most specific to unspecific.
     * @param instream the readable stream to detect the mime types from.
     * @param nameHint an additional hint that can be used to detect a mime from a file extension.
     */
    function detectMimesFromStream(instream, nameHint, callback) {
        doDetectMimesFromStream(instream, function (error, result) {
            handleMimeResult(nameHint, error, result, callback);
        });
    }
    exports.detectMimesFromStream = detectMimesFromStream;
    /**
     * Opens the given file to detect its mime type. Returns an array of mime types sorted from most specific to unspecific.
     * @param absolutePath the absolute path of the file.
     */
    function detectMimesFromFile(absolutePath, callback) {
        doDetectMimesFromFile(absolutePath, function (error, result) {
            handleMimeResult(absolutePath, error, result, callback);
        });
    }
    exports.detectMimesFromFile = detectMimesFromFile;
    function handleMimeResult(nameHint, error, result, callback) {
        if (error) {
            return callback(error, null);
        }
        var filterAndSortedMimes = filterAndSortMimes(result.mimes, mime.guessMimeTypes(nameHint));
        result.mimes = filterAndSortedMimes;
        callback(null, result);
    }
});

define("vs/nls!vs/base/common/errors",['vs/nls', 'vs/nls!vs/workbench/services/search/node/searchApp'], function(nls, data) { return nls.create("vs/base/common/errors", data); });
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/base/node/service.cp", ["require", "exports", 'child_process', 'vs/base/common/winjs.base', 'vs/base/common/async', 'vs/base/common/objects', 'vs/base/common/service'], function (require, exports, cp, winjs_base_1, async_1, objects_1, service_1) {
    "use strict";
    var Server = (function (_super) {
        __extends(Server, _super);
        function Server() {
            var _this = this;
            _super.call(this, {
                send: function (r) { try {
                    process.send(r);
                }
                catch (e) { } },
                onMessage: function (cb) { return process.on('message', cb); }
            });
            process.once('disconnect', function () { return _this.dispose(); });
        }
        return Server;
    }(service_1.Server));
    exports.Server = Server;
    var Client = (function () {
        function Client(modulePath, options) {
            this.modulePath = modulePath;
            this.options = options;
            var timeout = options && options.timeout ? options.timeout : Number.MAX_VALUE;
            this.disposeDelayer = new async_1.Delayer(timeout);
            this.activeRequests = [];
            this.child = null;
            this._client = null;
            this.services = Object.create(null);
        }
        Client.prototype.getService = function (serviceName, serviceCtor) {
            var _this = this;
            return Object.keys(serviceCtor.prototype)
                .filter(function (key) { return key !== 'constructor'; })
                .reduce(function (service, key) { return objects_1.assign(service, (_a = {}, _a[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return _this.request.apply(_this, [serviceName, serviceCtor, key].concat(args));
            }, _a)); var _a; }, {});
        };
        Client.prototype.request = function (serviceName, serviceCtor, name) {
            var _this = this;
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            this.disposeDelayer.cancel();
            var service = this.services[serviceName];
            if (!service) {
                service = this.services[serviceName] = this.client.getService(serviceName, serviceCtor);
            }
            var request = service[name].apply(service, args);
            // Progress doesn't propagate across 'then', we need to create a promise wrapper
            var result = new winjs_base_1.Promise(function (c, e, p) {
                request.then(c, e, p).done(function () {
                    _this.activeRequests.splice(_this.activeRequests.indexOf(result), 1);
                    _this.disposeDelayer.trigger(function () { return _this.disposeClient(); });
                });
            }, function () { return request.cancel(); });
            this.activeRequests.push(result);
            return result;
        };
        Object.defineProperty(Client.prototype, "client", {
            get: function () {
                var _this = this;
                if (!this._client) {
                    var args = this.options && this.options.args ? this.options.args : [];
                    var forkOpts = undefined;
                    if (this.options) {
                        forkOpts = Object.create(null);
                        if (this.options.env) {
                            forkOpts.env = objects_1.assign(objects_1.clone(process.env), this.options.env);
                        }
                        if (typeof this.options.debug === 'number') {
                            forkOpts.execArgv = ['--nolazy', '--debug=' + this.options.debug];
                        }
                        if (typeof this.options.debugBrk === 'number') {
                            forkOpts.execArgv = ['--nolazy', '--debug-brk=' + this.options.debugBrk];
                        }
                    }
                    this.child = cp.fork(this.modulePath, args, forkOpts);
                    this._client = new service_1.Client({
                        send: function (r) { return _this.child && _this.child.connected && _this.child.send(r); },
                        onMessage: function (cb) {
                            _this.child.on('message', function (msg) {
                                // Handle console logs specially
                                if (msg && msg.type === '__$console') {
                                    var args_1 = ['%c[Service Library: ' + _this.options.serverName + ']', 'color: darkgreen'];
                                    try {
                                        var parsed_1 = JSON.parse(msg.arguments);
                                        args_1 = args_1.concat(Object.getOwnPropertyNames(parsed_1).map(function (o) { return parsed_1[o]; }));
                                    }
                                    catch (error) {
                                        args_1.push(msg.arguments);
                                    }
                                    console[msg.severity].apply(console, args_1);
                                }
                                else {
                                    cb(msg);
                                }
                            });
                        }
                    });
                    var onExit_1 = function () { return _this.disposeClient(); };
                    process.once('exit', onExit_1);
                    this.child.on('error', function (err) { return console.warn('Service "' + _this.options.serverName + '" errored with ' + err); });
                    this.child.on('exit', function (code, signal) {
                        process.removeListener('exit', onExit_1);
                        if (_this.activeRequests) {
                            _this.activeRequests.forEach(function (req) { return req.cancel(); });
                            _this.activeRequests = [];
                        }
                        if (code && signal !== 'SIGTERM') {
                            console.warn('Service "' + _this.options.serverName + '" crashed with exit code ' + code);
                            _this.disposeDelayer.cancel();
                            _this.disposeClient();
                        }
                    });
                }
                return this._client;
            },
            enumerable: true,
            configurable: true
        });
        Client.prototype.disposeClient = function () {
            if (this._client) {
                this.child.kill();
                this.child = null;
                this._client = null;
                this.services = Object.create(null);
            }
        };
        Client.prototype.dispose = function () {
            this.disposeDelayer.cancel();
            this.disposeDelayer = null;
            this.disposeClient();
            this.activeRequests = null;
        };
        return Client;
    }());
    exports.Client = Client;
});

define("vs/platform/instantiation/common/instantiation", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // ----------------------- internal util -----------------------
    var _util;
    (function (_util) {
        _util.DI_TARGET = '$di$target';
        _util.DI_DEPENDENCIES = '$di$dependencies';
        _util.DI_PROVIDES = '$di$provides_service';
        function getServiceId(id) {
            return id[_util.DI_PROVIDES];
        }
        _util.getServiceId = getServiceId;
        function getServiceDependencies(ctor) {
            return ctor[_util.DI_DEPENDENCIES];
        }
        _util.getServiceDependencies = getServiceDependencies;
    })(_util = exports._util || (exports._util = {}));
    exports.IInstantiationService = createDecorator('instantiationService');
    /**
     * A *only* valid way to create a {{ServiceIdentifier}}.
     */
    function createDecorator(serviceId) {
        var ret = function (target, key, index) {
            if (arguments.length !== 3) {
                throw new Error('@IServiceName-decorator can only be used to decorate a parameter');
            }
            if (target[_util.DI_TARGET] === target) {
                target[_util.DI_DEPENDENCIES].push({ serviceId: serviceId, index: index });
            }
            else {
                target[_util.DI_DEPENDENCIES] = [{ serviceId: serviceId, index: index }];
                target[_util.DI_TARGET] = target;
            }
        };
        ret[_util.DI_PROVIDES] = serviceId;
        // ret['type'] = undefined;
        return ret;
    }
    exports.createDecorator = createDecorator;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/platform/files/common/files", ["require", "exports", 'vs/base/common/paths', 'vs/base/common/events', 'vs/platform/instantiation/common/instantiation'], function (require, exports, paths, events, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IFileService = instantiation_1.createDecorator('fileService');
    /**
     * Possible changes that can occur to a file.
     */
    (function (FileChangeType) {
        FileChangeType[FileChangeType["UPDATED"] = 0] = "UPDATED";
        FileChangeType[FileChangeType["ADDED"] = 1] = "ADDED";
        FileChangeType[FileChangeType["DELETED"] = 2] = "DELETED";
    })(exports.FileChangeType || (exports.FileChangeType = {}));
    var FileChangeType = exports.FileChangeType;
    /**
     * Possible events to subscribe to
     */
    exports.EventType = {
        /**
        * Send on file changes.
        */
        FILE_CHANGES: 'files:fileChanges'
    };
    var FileChangesEvent = (function (_super) {
        __extends(FileChangesEvent, _super);
        function FileChangesEvent(changes) {
            _super.call(this);
            this._changes = changes;
        }
        Object.defineProperty(FileChangesEvent.prototype, "changes", {
            get: function () {
                return this._changes;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns true if this change event contains the provided file with the given change type. In case of
         * type DELETED, this method will also return true if a folder got deleted that is the parent of the
         * provided file path.
         */
        FileChangesEvent.prototype.contains = function (resource, type) {
            if (!resource) {
                return false;
            }
            return this.containsAny([resource], type);
        };
        /**
         * Returns true if this change event contains any of the provided files with the given change type. In case of
         * type DELETED, this method will also return true if a folder got deleted that is the parent of any of the
         * provided file paths.
         */
        FileChangesEvent.prototype.containsAny = function (resources, type) {
            if (!resources || !resources.length) {
                return false;
            }
            return this._changes.some(function (change) {
                if (change.type !== type) {
                    return false;
                }
                // For deleted also return true when deleted folder is parent of target path
                if (type === FileChangeType.DELETED) {
                    return resources.some(function (a) {
                        if (!a) {
                            return false;
                        }
                        return paths.isEqualOrParent(a.fsPath, change.resource.fsPath);
                    });
                }
                return resources.some(function (a) {
                    if (!a) {
                        return false;
                    }
                    return a.fsPath === change.resource.fsPath;
                });
            });
        };
        /**
         * Returns the changes that describe added files.
         */
        FileChangesEvent.prototype.getAdded = function () {
            return this.getOfType(FileChangeType.ADDED);
        };
        /**
         * Returns if this event contains added files.
         */
        FileChangesEvent.prototype.gotAdded = function () {
            return this.hasType(FileChangeType.ADDED);
        };
        /**
         * Returns the changes that describe deleted files.
         */
        FileChangesEvent.prototype.getDeleted = function () {
            return this.getOfType(FileChangeType.DELETED);
        };
        /**
         * Returns if this event contains deleted files.
         */
        FileChangesEvent.prototype.gotDeleted = function () {
            return this.hasType(FileChangeType.DELETED);
        };
        /**
         * Returns the changes that describe updated files.
         */
        FileChangesEvent.prototype.getUpdated = function () {
            return this.getOfType(FileChangeType.UPDATED);
        };
        /**
         * Returns if this event contains updated files.
         */
        FileChangesEvent.prototype.gotUpdated = function () {
            return this.hasType(FileChangeType.UPDATED);
        };
        FileChangesEvent.prototype.getOfType = function (type) {
            return this._changes.filter(function (change) { return change.type === type; });
        };
        FileChangesEvent.prototype.hasType = function (type) {
            return this._changes.some(function (change) {
                return change.type === type;
            });
        };
        return FileChangesEvent;
    }(events.Event));
    exports.FileChangesEvent = FileChangesEvent;
    (function (FileOperationResult) {
        FileOperationResult[FileOperationResult["FILE_IS_BINARY"] = 0] = "FILE_IS_BINARY";
        FileOperationResult[FileOperationResult["FILE_IS_DIRECTORY"] = 1] = "FILE_IS_DIRECTORY";
        FileOperationResult[FileOperationResult["FILE_NOT_FOUND"] = 2] = "FILE_NOT_FOUND";
        FileOperationResult[FileOperationResult["FILE_NOT_MODIFIED_SINCE"] = 3] = "FILE_NOT_MODIFIED_SINCE";
        FileOperationResult[FileOperationResult["FILE_MODIFIED_SINCE"] = 4] = "FILE_MODIFIED_SINCE";
        FileOperationResult[FileOperationResult["FILE_MOVE_CONFLICT"] = 5] = "FILE_MOVE_CONFLICT";
        FileOperationResult[FileOperationResult["FILE_READ_ONLY"] = 6] = "FILE_READ_ONLY";
        FileOperationResult[FileOperationResult["FILE_TOO_LARGE"] = 7] = "FILE_TOO_LARGE";
    })(exports.FileOperationResult || (exports.FileOperationResult = {}));
    var FileOperationResult = exports.FileOperationResult;
    exports.MAX_FILE_SIZE = 50 * 1024 * 1024;
    exports.AutoSaveConfiguration = {
        OFF: 'off',
        AFTER_DELAY: 'afterDelay',
        ON_FOCUS_CHANGE: 'onFocusChange'
    };
    exports.SUPPORTED_ENCODINGS = {
        utf8: {
            labelLong: 'UTF-8',
            labelShort: 'UTF-8',
            order: 1,
            alias: 'utf8bom'
        },
        utf8bom: {
            labelLong: 'UTF-8 with BOM',
            labelShort: 'UTF-8 with BOM',
            encodeOnly: true,
            order: 2,
            alias: 'utf8'
        },
        utf16le: {
            labelLong: 'UTF-16 LE',
            labelShort: 'UTF-16 LE',
            order: 3
        },
        utf16be: {
            labelLong: 'UTF-16 BE',
            labelShort: 'UTF-16 BE',
            order: 4
        },
        windows1252: {
            labelLong: 'Western (Windows 1252)',
            labelShort: 'Windows 1252',
            order: 5
        },
        iso88591: {
            labelLong: 'Western (ISO 8859-1)',
            labelShort: 'ISO 8859-1',
            order: 6
        },
        iso88593: {
            labelLong: 'Western (ISO 8859-3)',
            labelShort: 'ISO 8859-3',
            order: 7
        },
        iso885915: {
            labelLong: 'Western (ISO 8859-15)',
            labelShort: 'ISO 8859-15',
            order: 8
        },
        macroman: {
            labelLong: 'Western (Mac Roman)',
            labelShort: 'Mac Roman',
            order: 9
        },
        cp437: {
            labelLong: 'DOS (CP 437)',
            labelShort: 'CP437',
            order: 10
        },
        windows1256: {
            labelLong: 'Arabic (Windows 1256)',
            labelShort: 'Windows 1256',
            order: 11
        },
        iso88596: {
            labelLong: 'Arabic (ISO 8859-6)',
            labelShort: 'ISO 8859-6',
            order: 12
        },
        windows1257: {
            labelLong: 'Baltic (Windows 1257)',
            labelShort: 'Windows 1257',
            order: 13
        },
        iso88594: {
            labelLong: 'Baltic (ISO 8859-4)',
            labelShort: 'ISO 8859-4',
            order: 14
        },
        iso885914: {
            labelLong: 'Celtic (ISO 8859-14)',
            labelShort: 'ISO 8859-14',
            order: 15
        },
        windows1250: {
            labelLong: 'Central European (Windows 1250)',
            labelShort: 'Windows 1250',
            order: 16
        },
        iso88592: {
            labelLong: 'Central European (ISO 8859-2)',
            labelShort: 'ISO 8859-2',
            order: 17
        },
        windows1251: {
            labelLong: 'Cyrillic (Windows 1251)',
            labelShort: 'Windows 1251',
            order: 18
        },
        cp866: {
            labelLong: 'Cyrillic (CP 866)',
            labelShort: 'CP 866',
            order: 19
        },
        iso88595: {
            labelLong: 'Cyrillic (ISO 8859-5)',
            labelShort: 'ISO 8859-5',
            order: 20
        },
        koi8r: {
            labelLong: 'Cyrillic (KOI8-R)',
            labelShort: 'KOI8-R',
            order: 21
        },
        koi8u: {
            labelLong: 'Cyrillic (KOI8-U)',
            labelShort: 'KOI8-U',
            order: 22
        },
        iso885913: {
            labelLong: 'Estonian (ISO 8859-13)',
            labelShort: 'ISO 8859-13',
            order: 23
        },
        windows1253: {
            labelLong: 'Greek (Windows 1253)',
            labelShort: 'Windows 1253',
            order: 24
        },
        iso88597: {
            labelLong: 'Greek (ISO 8859-7)',
            labelShort: 'ISO 8859-7',
            order: 25
        },
        windows1255: {
            labelLong: 'Hebrew (Windows 1255)',
            labelShort: 'Windows 1255',
            order: 26
        },
        iso88598: {
            labelLong: 'Hebrew (ISO 8859-8)',
            labelShort: 'ISO 8859-8',
            order: 27
        },
        iso885910: {
            labelLong: 'Nordic (ISO 8859-10)',
            labelShort: 'ISO 8859-10',
            order: 28
        },
        iso885916: {
            labelLong: 'Romanian (ISO 8859-16)',
            labelShort: 'ISO 8859-16',
            order: 29
        },
        windows1254: {
            labelLong: 'Turkish (Windows 1254)',
            labelShort: 'Windows 1254',
            order: 30
        },
        iso88599: {
            labelLong: 'Turkish (ISO 8859-9)',
            labelShort: 'ISO 8859-9',
            order: 31
        },
        windows1258: {
            labelLong: 'Vietnamese (Windows 1258)',
            labelShort: 'Windows 1258',
            order: 32
        },
        gbk: {
            labelLong: 'Chinese (GBK)',
            labelShort: 'GBK',
            order: 33
        },
        gb18030: {
            labelLong: 'Chinese (GB18030)',
            labelShort: 'GB18030',
            order: 34
        },
        cp950: {
            labelLong: 'Traditional Chinese (Big5)',
            labelShort: 'Big5',
            order: 35
        },
        big5hkscs: {
            labelLong: 'Traditional Chinese (Big5-HKSCS)',
            labelShort: 'Big5-HKSCS',
            order: 36
        },
        shiftjis: {
            labelLong: 'Japanese (Shift JIS)',
            labelShort: 'Shift JIS',
            order: 37
        },
        eucjp: {
            labelLong: 'Japanese (EUC-JP)',
            labelShort: 'EUC-JP',
            order: 38
        },
        euckr: {
            labelLong: 'Korean (EUC-KR)',
            labelShort: 'EUC-KR',
            order: 39
        },
        windows874: {
            labelLong: 'Thai (Windows 874)',
            labelShort: 'Windows 874',
            order: 40
        },
        iso885911: {
            labelLong: 'Latin/Thai (ISO 8859-11)',
            labelShort: 'ISO 8859-11',
            order: 41
        },
        'koi8-ru': {
            labelLong: 'Cyrillic (KOI8-RU)',
            labelShort: 'KOI8-RU',
            order: 42
        },
        'koi8-t': {
            labelLong: 'Tajik (KOI8-T)',
            labelShort: 'KOI8-T',
            order: 43
        },
        GB2312: {
            labelLong: 'Simplified Chinese (GB 2312)',
            labelShort: 'GB 2312',
            order: 44
        }
    };
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/services/search/node/fileSearch", ["require", "exports", 'fs', 'path', 'vs/base/common/scorer', 'vs/base/common/arrays', 'vs/base/common/strings', 'vs/base/common/types', 'vs/base/common/glob', 'vs/base/node/extfs', 'vs/base/node/flow'], function (require, exports, fs, paths, scorer, arrays, strings, types, glob, extfs, flow) {
    'use strict';
    var FileWalker = (function () {
        function FileWalker(config) {
            this.config = config;
            this.filePattern = config.filePattern;
            this.excludePattern = config.excludePattern;
            this.includePattern = config.includePattern;
            this.maxResults = config.maxResults || null;
            this.maxFilesize = config.maxFilesize || null;
            this.walkedPaths = Object.create(null);
            this.resultCount = 0;
            this.isLimitHit = false;
            if (this.filePattern) {
                this.filePattern = this.filePattern.replace(/\\/g, '/'); // Normalize file patterns to forward slashes
                this.normalizedFilePatternLowercase = strings.stripWildcards(this.filePattern).toLowerCase();
            }
        }
        FileWalker.prototype.cancel = function () {
            this.isCanceled = true;
        };
        FileWalker.prototype.walk = function (rootFolders, extraFiles, onResult, done) {
            var _this = this;
            // Support that the file pattern is a full path to a file that exists
            this.checkFilePatternAbsoluteMatch(function (exists) {
                if (_this.isCanceled) {
                    return done(null, _this.isLimitHit);
                }
                // Report result from file pattern if matching
                if (exists) {
                    onResult({ path: _this.filePattern });
                    // Optimization: a match on an absolute path is a good result and we do not
                    // continue walking the entire root paths array for other matches because
                    // it is very unlikely that another file would match on the full absolute path
                    return done(null, _this.isLimitHit);
                }
                // For each extra file
                if (extraFiles) {
                    extraFiles.forEach(function (extraFilePath) {
                        if (glob.match(_this.excludePattern, extraFilePath)) {
                            return; // excluded
                        }
                        // File: Check for match on file pattern and include pattern
                        _this.matchFile(onResult, extraFilePath, extraFilePath /* no workspace relative path */);
                    });
                }
                // For each root folder
                flow.parallel(rootFolders, function (absolutePath, perEntryCallback) {
                    extfs.readdir(absolutePath, function (error, files) {
                        if (error || _this.isCanceled || _this.isLimitHit) {
                            return perEntryCallback(null, null);
                        }
                        // Support relative paths to files from a root resource
                        return _this.checkFilePatternRelativeMatch(absolutePath, function (match) {
                            if (_this.isCanceled || _this.isLimitHit) {
                                return perEntryCallback(null, null);
                            }
                            // Report result from file pattern if matching
                            if (match) {
                                onResult({ path: match });
                            }
                            return _this.doWalk(paths.normalize(absolutePath), '', files, onResult, perEntryCallback);
                        });
                    });
                }, function (err, result) {
                    done(err ? err[0] : null, _this.isLimitHit);
                });
            });
        };
        FileWalker.prototype.checkFilePatternAbsoluteMatch = function (clb) {
            if (!this.filePattern || !paths.isAbsolute(this.filePattern)) {
                return clb(false);
            }
            return fs.stat(this.filePattern, function (error, stat) {
                return clb(!error && !stat.isDirectory()); // only existing files
            });
        };
        FileWalker.prototype.checkFilePatternRelativeMatch = function (basePath, clb) {
            if (!this.filePattern || paths.isAbsolute(this.filePattern)) {
                return clb(null);
            }
            var absolutePath = paths.join(basePath, this.filePattern);
            return fs.stat(absolutePath, function (error, stat) {
                return clb(!error && !stat.isDirectory() ? absolutePath : null); // only existing files
            });
        };
        FileWalker.prototype.doWalk = function (absolutePath, relativeParentPathWithSlashes, files, onResult, done) {
            var _this = this;
            // Execute tasks on each file in parallel to optimize throughput
            flow.parallel(files, function (file, clb) {
                // Check canceled
                if (_this.isCanceled || _this.isLimitHit) {
                    return clb(null);
                }
                // If the user searches for the exact file name, we adjust the glob matching
                // to ignore filtering by siblings because the user seems to know what she
                // is searching for and we want to include the result in that case anyway
                var siblings = files;
                if (_this.config.filePattern === file) {
                    siblings = [];
                }
                // Check exclude pattern
                var currentRelativePathWithSlashes = relativeParentPathWithSlashes ? [relativeParentPathWithSlashes, file].join('/') : file;
                if (glob.match(_this.excludePattern, currentRelativePathWithSlashes, siblings)) {
                    return clb(null);
                }
                // Use lstat to detect links
                var currentAbsolutePath = [absolutePath, file].join(paths.sep);
                fs.lstat(currentAbsolutePath, function (error, lstat) {
                    if (error || _this.isCanceled || _this.isLimitHit) {
                        return clb(null);
                    }
                    // If the path is a link, we must instead use fs.stat() to find out if the
                    // link is a directory or not because lstat will always return the stat of
                    // the link which is always a file.
                    _this.statLinkIfNeeded(currentAbsolutePath, lstat, function (error, stat) {
                        if (error || _this.isCanceled || _this.isLimitHit) {
                            return clb(null);
                        }
                        // Directory: Follow directories
                        if (stat.isDirectory()) {
                            // to really prevent loops with links we need to resolve the real path of them
                            return _this.realPathIfNeeded(currentAbsolutePath, lstat, function (error, realpath) {
                                if (error || _this.isCanceled || _this.isLimitHit) {
                                    return clb(null);
                                }
                                if (_this.walkedPaths[realpath]) {
                                    return clb(null); // escape when there are cycles (can happen with symlinks)
                                }
                                _this.walkedPaths[realpath] = true; // remember as walked
                                // Continue walking
                                return extfs.readdir(currentAbsolutePath, function (error, children) {
                                    if (error || _this.isCanceled || _this.isLimitHit) {
                                        return clb(null);
                                    }
                                    _this.doWalk(currentAbsolutePath, currentRelativePathWithSlashes, children, onResult, clb);
                                });
                            });
                        }
                        else {
                            if (currentRelativePathWithSlashes === _this.filePattern) {
                                return clb(null); // ignore file if its path matches with the file pattern because checkFilePatternRelativeMatch() takes care of those
                            }
                            if (_this.maxFilesize && types.isNumber(stat.size) && stat.size > _this.maxFilesize) {
                                return clb(null); // ignore file if max file size is hit
                            }
                            _this.matchFile(onResult, currentAbsolutePath, currentRelativePathWithSlashes);
                        }
                        // Unwind
                        return clb(null);
                    });
                });
            }, function (error) {
                if (error) {
                    error = arrays.coalesce(error); // find any error by removing null values first
                }
                return done(error && error.length > 0 ? error[0] : null, null);
            });
        };
        FileWalker.prototype.matchFile = function (onResult, absolutePath, relativePathWithSlashes) {
            if (this.isFilePatternMatch(relativePathWithSlashes) && (!this.includePattern || glob.match(this.includePattern, relativePathWithSlashes))) {
                this.resultCount++;
                if (this.maxResults && this.resultCount > this.maxResults) {
                    this.isLimitHit = true;
                }
                if (!this.isLimitHit) {
                    onResult({
                        path: absolutePath
                    });
                }
            }
        };
        FileWalker.prototype.isFilePatternMatch = function (path) {
            // Check for search pattern
            if (this.filePattern) {
                if (this.filePattern === '*') {
                    return true; // support the all-matching wildcard
                }
                return scorer.matches(path, this.normalizedFilePatternLowercase);
            }
            // No patterns means we match all
            return true;
        };
        FileWalker.prototype.statLinkIfNeeded = function (path, lstat, clb) {
            if (lstat.isSymbolicLink()) {
                return fs.stat(path, clb); // stat the target the link points to
            }
            return clb(null, lstat); // not a link, so the stat is already ok for us
        };
        FileWalker.prototype.realPathIfNeeded = function (path, lstat, clb) {
            if (lstat.isSymbolicLink()) {
                return fs.realpath(path, function (error, realpath) {
                    if (error) {
                        return clb(error);
                    }
                    return clb(null, realpath);
                });
            }
            return clb(null, path);
        };
        return FileWalker;
    }());
    exports.FileWalker = FileWalker;
    var Engine = (function () {
        function Engine(config) {
            this.rootFolders = config.rootFolders;
            this.extraFiles = config.extraFiles;
            this.walker = new FileWalker(config);
        }
        Engine.prototype.search = function (onResult, onProgress, done) {
            this.walker.walk(this.rootFolders, this.extraFiles, onResult, done);
        };
        Engine.prototype.cancel = function () {
            this.walker.cancel();
        };
        return Engine;
    }());
    exports.Engine = Engine;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/services/search/node/textSearch", ["require", "exports", 'vs/base/common/strings', 'fs', 'vs/base/common/mime', 'vs/base/node/mime', 'vs/base/node/encoding'], function (require, exports, strings, fs, baseMime, mime_1, encoding_1) {
    'use strict';
    var Engine = (function () {
        function Engine(config, walker) {
            this.rootFolders = config.rootFolders;
            this.extraFiles = config.extraFiles;
            this.walker = walker;
            this.contentPattern = strings.createRegExp(config.contentPattern.pattern, config.contentPattern.isRegExp, config.contentPattern.isCaseSensitive, config.contentPattern.isWordMatch, true);
            this.isCanceled = false;
            this.limitReached = false;
            this.maxResults = config.maxResults;
            this.worked = 0;
            this.total = 0;
            this.fileEncoding = encoding_1.encodingExists(config.fileEncoding) ? config.fileEncoding : encoding_1.UTF8;
        }
        Engine.prototype.cancel = function () {
            this.isCanceled = true;
            this.walker.cancel();
        };
        Engine.prototype.search = function (onResult, onProgress, done) {
            var _this = this;
            var resultCounter = 0;
            var unwind = function (processed) {
                _this.worked += processed;
                // Emit progress() unless we got canceled or hit the limit
                if (processed && !_this.isDone && !_this.isCanceled && !_this.limitReached) {
                    onProgress({ total: _this.total, worked: _this.worked });
                }
                // Emit done()
                if (_this.worked === _this.total && _this.walkerIsDone && !_this.isDone) {
                    _this.isDone = true;
                    done(_this.walkerError, _this.limitReached);
                }
            };
            // Walk over the file system
            this.walker.walk(this.rootFolders, this.extraFiles, function (result) {
                _this.total++;
                // If the result is empty or we have reached the limit or we are canceled, ignore it
                if (_this.limitReached || _this.isCanceled) {
                    return unwind(1);
                }
                // Indicate progress to the outside
                onProgress({ total: _this.total, worked: _this.worked });
                var fileMatch = null;
                var doneCallback = function (error) {
                    if (!error && !_this.isCanceled && fileMatch && !fileMatch.isEmpty()) {
                        onResult(fileMatch.serialize());
                    }
                    return unwind(1);
                };
                var perLineCallback = function (line, lineNumber) {
                    if (_this.limitReached || _this.isCanceled) {
                        return; // return early if canceled or limit reached
                    }
                    var lineMatch = null;
                    var match = _this.contentPattern.exec(line);
                    // Record all matches into file result
                    while (match !== null && match[0].length > 0 && !_this.limitReached && !_this.isCanceled) {
                        resultCounter++;
                        if (_this.maxResults && resultCounter >= _this.maxResults) {
                            _this.limitReached = true;
                        }
                        if (fileMatch === null) {
                            fileMatch = new FileMatch(result.path);
                        }
                        if (lineMatch === null) {
                            lineMatch = new LineMatch(line, lineNumber);
                            fileMatch.addMatch(lineMatch);
                        }
                        lineMatch.addMatch(match.index, match[0].length);
                        match = _this.contentPattern.exec(line);
                    }
                };
                // Read lines buffered to support large files
                _this.readlinesAsync(result.path, perLineCallback, { bufferLength: 8096, encoding: _this.fileEncoding }, doneCallback);
            }, function (error, isLimitHit) {
                _this.walkerIsDone = true;
                _this.walkerError = error;
                unwind(0 /* walker is done, indicate this back to our handler to be able to unwind */);
            });
        };
        Engine.prototype.readlinesAsync = function (filename, perLineCallback, options, callback) {
            var _this = this;
            fs.open(filename, 'r', null, function (error, fd) {
                if (error) {
                    return callback(error);
                }
                var buffer = new Buffer(options.bufferLength);
                var pos;
                var i;
                var line = '';
                var lineNumber = 0;
                var lastBufferHadTraillingCR = false;
                var outer = _this;
                function decodeBuffer(buffer) {
                    if (options.encoding === encoding_1.UTF8 || options.encoding === encoding_1.UTF8_with_bom) {
                        return buffer.toString(); // much faster to use built in toString() when encoding is default
                    }
                    return encoding_1.decode(buffer, options.encoding);
                }
                function lineFinished(offset) {
                    line += decodeBuffer(buffer.slice(pos, i + offset));
                    perLineCallback(line, lineNumber);
                    line = '';
                    lineNumber++;
                    pos = i + offset;
                }
                function readFile(isFirstRead, clb) {
                    if (outer.limitReached || outer.isCanceled) {
                        return clb(null); // return early if canceled or limit reached
                    }
                    fs.read(fd, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {
                        if (error || bytesRead === 0 || outer.limitReached || outer.isCanceled) {
                            return clb(error); // return early if canceled or limit reached or no more bytes to read
                        }
                        pos = 0;
                        i = 0;
                        // Detect encoding and mime when this is the beginning of the file
                        if (isFirstRead) {
                            var mimeAndEncoding = mime_1.detectMimeAndEncodingFromBuffer(buffer, bytesRead);
                            if (mimeAndEncoding.mimes[mimeAndEncoding.mimes.length - 1] !== baseMime.MIME_TEXT) {
                                return clb(null); // skip files that seem binary
                            }
                            // Check for BOM offset
                            switch (mimeAndEncoding.encoding) {
                                case encoding_1.UTF8:
                                    pos = i = 3;
                                    options.encoding = encoding_1.UTF8;
                                    break;
                                case encoding_1.UTF16be:
                                    pos = i = 2;
                                    options.encoding = encoding_1.UTF16be;
                                    break;
                                case encoding_1.UTF16le:
                                    pos = i = 2;
                                    options.encoding = encoding_1.UTF16le;
                                    break;
                            }
                        }
                        if (lastBufferHadTraillingCR) {
                            if (buffer[i] === 0x0a) {
                                lineFinished(1);
                                i++;
                            }
                            else {
                                lineFinished(0);
                            }
                            lastBufferHadTraillingCR = false;
                        }
                        for (; i < bytesRead; ++i) {
                            if (buffer[i] === 0x0a) {
                                lineFinished(1);
                            }
                            else if (buffer[i] === 0x0d) {
                                if (i + 1 === bytesRead) {
                                    lastBufferHadTraillingCR = true;
                                }
                                else if (buffer[i + 1] === 0x0a) {
                                    lineFinished(2);
                                    i++;
                                }
                                else {
                                    lineFinished(1);
                                }
                            }
                        }
                        line += decodeBuffer(buffer.slice(pos, bytesRead));
                        readFile(false /* isFirstRead */, clb); // Continue reading
                    });
                }
                readFile(true /* isFirstRead */, function (error) {
                    if (error) {
                        return callback(error);
                    }
                    if (line.length) {
                        perLineCallback(line, lineNumber); // handle last line
                    }
                    fs.close(fd, function (error) {
                        callback(error);
                    });
                });
            });
        };
        return Engine;
    }());
    exports.Engine = Engine;
    var FileMatch = (function () {
        function FileMatch(path) {
            this.path = path;
            this.lineMatches = [];
        }
        FileMatch.prototype.addMatch = function (lineMatch) {
            this.lineMatches.push(lineMatch);
        };
        FileMatch.prototype.isEmpty = function () {
            return this.lineMatches.length === 0;
        };
        FileMatch.prototype.serialize = function () {
            var lineMatches = [];
            for (var i = 0; i < this.lineMatches.length; i++) {
                lineMatches.push(this.lineMatches[i].serialize());
            }
            return {
                path: this.path,
                lineMatches: lineMatches
            };
        };
        return FileMatch;
    }());
    var LineMatch = (function () {
        function LineMatch(preview, lineNumber) {
            this.preview = preview.replace(/(\r|\n)*$/, '');
            this.lineNumber = lineNumber;
            this.offsetAndLengths = [];
        }
        LineMatch.prototype.getText = function () {
            return this.preview;
        };
        LineMatch.prototype.getLineNumber = function () {
            return this.lineNumber;
        };
        LineMatch.prototype.addMatch = function (offset, length) {
            this.offsetAndLengths.push([offset, length]);
        };
        LineMatch.prototype.serialize = function () {
            var result = {
                preview: this.preview,
                lineNumber: this.lineNumber,
                offsetAndLengths: this.offsetAndLengths
            };
            return result;
        };
        return LineMatch;
    }());
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/services/search/node/rawSearchService", ["require", "exports", 'fs', 'graceful-fs', 'vs/base/common/winjs.base', 'vs/platform/files/common/files', 'vs/workbench/services/search/node/fileSearch', 'vs/workbench/services/search/node/textSearch'], function (require, exports, fs, gracefulFs, winjs_base_1, files_1, fileSearch_1, textSearch_1) {
    'use strict';
    gracefulFs.gracefulify(fs);
    var SearchService = (function () {
        function SearchService() {
        }
        SearchService.prototype.fileSearch = function (config) {
            var engine = new fileSearch_1.Engine(config);
            return this.doSearch(engine);
        };
        SearchService.prototype.textSearch = function (config) {
            var engine = new textSearch_1.Engine(config, new fileSearch_1.FileWalker({
                rootFolders: config.rootFolders,
                extraFiles: config.extraFiles,
                includePattern: config.includePattern,
                excludePattern: config.excludePattern,
                filePattern: config.filePattern,
                maxFilesize: files_1.MAX_FILE_SIZE
            }));
            return this.doSearch(engine);
        };
        SearchService.prototype.doSearch = function (engine) {
            return new winjs_base_1.PPromise(function (c, e, p) {
                engine.search(function (match) {
                    if (match) {
                        p(match);
                    }
                }, function (progress) {
                    p(progress);
                }, function (error, isLimitHit) {
                    if (error) {
                        e(error);
                    }
                    else {
                        c({
                            limitHit: isLimitHit
                        });
                    }
                });
            }, function () { return engine.cancel(); });
        };
        return SearchService;
    }());
    exports.SearchService = SearchService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/services/search/node/searchApp", ["require", "exports", 'vs/base/node/service.cp', 'vs/workbench/services/search/node/rawSearchService'], function (require, exports, service_cp_1, rawSearchService_1) {
    'use strict';
    var server = new service_cp_1.Server();
    server.registerService('SearchService', new rawSearchService_1.SearchService());
});

//# sourceMappingURL=searchApp.js.map
