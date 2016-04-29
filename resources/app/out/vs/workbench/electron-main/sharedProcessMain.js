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

define("vs/base/common/assert", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
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

define("vs/base/common/collections", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function createStringDictionary() {
        return Object.create(null);
    }
    exports.createStringDictionary = createStringDictionary;
    function createNumberDictionary() {
        return Object.create(null);
    }
    exports.createNumberDictionary = createNumberDictionary;
    function lookup(from, what, alternate) {
        if (alternate === void 0) { alternate = null; }
        var key = String(what);
        if (contains(from, key)) {
            return from[key];
        }
        return alternate;
    }
    exports.lookup = lookup;
    function lookupOrInsert(from, stringOrNumber, alternate) {
        var key = String(stringOrNumber);
        if (contains(from, key)) {
            return from[key];
        }
        else {
            if (typeof alternate === 'function') {
                alternate = alternate();
            }
            from[key] = alternate;
            return alternate;
        }
    }
    exports.lookupOrInsert = lookupOrInsert;
    function insert(into, data, hashFn) {
        into[hashFn(data)] = data;
    }
    exports.insert = insert;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function contains(from, what) {
        return hasOwnProperty.call(from, what);
    }
    exports.contains = contains;
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
    function forEach(from, callback) {
        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                var result = callback({ key: key, value: from[key] }, function () {
                    delete from[key];
                });
                if (result === false) {
                    return;
                }
            }
        }
    }
    exports.forEach = forEach;
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
        var result = createStringDictionary();
        data.forEach(function (element) { return lookupOrInsert(result, groupFn(element), []).push(element); });
        return result;
    }
    exports.groupBy = groupBy;
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

define("vs/base/common/stopwatch", ["require", "exports", 'vs/base/common/platform'], function (require, exports, platform_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var hasPerformanceNow = (platform_1.globals.performance && typeof platform_1.globals.performance.now === 'function');
    var StopWatch = (function () {
        function StopWatch(highResolution) {
            this._highResolution = hasPerformanceNow && highResolution;
            this._startTime = this._now();
            this._stopTime = -1;
        }
        StopWatch.create = function (highResolution) {
            if (highResolution === void 0) { highResolution = true; }
            return new StopWatch(highResolution);
        };
        StopWatch.prototype.stop = function () {
            this._stopTime = this._now();
        };
        StopWatch.prototype.elapsed = function () {
            if (this._stopTime !== -1) {
                return this._stopTime - this._startTime;
            }
            return this._now() - this._startTime;
        };
        StopWatch.prototype._now = function () {
            return this._highResolution ? platform_1.globals.performance.now() : new Date().getTime();
        };
        return StopWatch;
    }());
    exports.StopWatch = StopWatch;
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

define("vs/base/common/graph", ["require", "exports", 'vs/base/common/types', 'vs/base/common/collections'], function (require, exports, objects, collections) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function newNode(data) {
        return {
            data: data,
            incoming: {},
            outgoing: {}
        };
    }
    exports.newNode = newNode;
    var Graph = (function () {
        function Graph(_hashFn) {
            this._hashFn = _hashFn;
            this._nodes = Object.create(null);
            // empty
        }
        Graph.prototype.roots = function () {
            var ret = [];
            collections.forEach(this._nodes, function (entry) {
                if (objects.isEmptyObject(entry.value.outgoing)) {
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
            this._traverse(startNode, inwards, {}, callback);
        };
        Graph.prototype._traverse = function (node, inwards, seen, callback) {
            var _this = this;
            var key = this._hashFn(node.data);
            if (collections.contains(seen, key)) {
                return;
            }
            seen[key] = true;
            callback(node.data);
            var nodes = inwards ? node.outgoing : node.incoming;
            collections.forEach(nodes, function (entry) { return _this._traverse(entry.value, inwards, seen, callback); });
        };
        Graph.prototype.insertEdge = function (from, to) {
            var fromNode = this.lookupOrInsertNode(from), toNode = this.lookupOrInsertNode(to);
            fromNode.outgoing[this._hashFn(to)] = toNode;
            toNode.incoming[this._hashFn(from)] = fromNode;
        };
        Graph.prototype.removeNode = function (data) {
            var key = this._hashFn(data);
            delete this._nodes[key];
            collections.forEach(this._nodes, function (entry) {
                delete entry.value.outgoing[key];
                delete entry.value.incoming[key];
            });
        };
        Graph.prototype.lookupOrInsertNode = function (data) {
            var key = this._hashFn(data), node = collections.lookup(this._nodes, key);
            if (!node) {
                node = newNode(data);
                this._nodes[key] = node;
            }
            return node;
        };
        Graph.prototype.lookup = function (data) {
            return collections.lookup(this._nodes, this._hashFn(data));
        };
        Object.defineProperty(Graph.prototype, "length", {
            get: function () {
                return Object.keys(this._nodes).length;
            },
            enumerable: true,
            configurable: true
        });
        return Graph;
    }());
    exports.Graph = Graph;
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

define("vs/nls!vs/base/common/errors",['vs/nls', 'vs/nls!vs/workbench/electron-main/sharedProcessMain'], function(nls, data) { return nls.create("vs/base/common/errors", data); });
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/base/common/eventEmitter", ["require", "exports", 'vs/base/common/errors'], function (require, exports, Errors) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var EmitterEvent = (function () {
        function EmitterEvent(eventType, data, emitterType) {
            if (emitterType === void 0) { emitterType = null; }
            this._type = eventType;
            this._data = data;
            this._emitterType = emitterType;
        }
        EmitterEvent.prototype.getType = function () {
            return this._type;
        };
        EmitterEvent.prototype.getData = function () {
            return this._data;
        };
        EmitterEvent.prototype.getEmitterType = function () {
            return this._emitterType;
        };
        return EmitterEvent;
    }());
    exports.EmitterEvent = EmitterEvent;
    var EventEmitter = (function () {
        function EventEmitter(allowedEventTypes) {
            if (allowedEventTypes === void 0) { allowedEventTypes = null; }
            this._listeners = {};
            this._bulkListeners = [];
            this._collectedEvents = [];
            this._deferredCnt = 0;
            if (allowedEventTypes) {
                this._allowedEventTypes = {};
                for (var i = 0; i < allowedEventTypes.length; i++) {
                    this._allowedEventTypes[allowedEventTypes[i]] = true;
                }
            }
            else {
                this._allowedEventTypes = null;
            }
        }
        EventEmitter.prototype.dispose = function () {
            this._listeners = {};
            this._bulkListeners = [];
            this._collectedEvents = [];
            this._deferredCnt = 0;
            this._allowedEventTypes = null;
        };
        EventEmitter.prototype.addListener = function (eventType, listener) {
            if (eventType === '*') {
                throw new Error('Use addBulkListener(listener) to register your listener!');
            }
            if (this._allowedEventTypes && !this._allowedEventTypes.hasOwnProperty(eventType)) {
                throw new Error('This object will never emit this event type!');
            }
            if (this._listeners.hasOwnProperty(eventType)) {
                this._listeners[eventType].push(listener);
            }
            else {
                this._listeners[eventType] = [listener];
            }
            var bound = this;
            return function () {
                if (!bound) {
                    // Already called
                    return;
                }
                bound._removeListener(eventType, listener);
                // Prevent leakers from holding on to the event emitter
                bound = null;
                listener = null;
            };
        };
        EventEmitter.prototype.addListener2 = function (eventType, listener) {
            var dispose = this.addListener(eventType, listener);
            return {
                dispose: dispose
            };
        };
        EventEmitter.prototype.on = function (eventType, listener) {
            return this.addListener(eventType, listener);
        };
        EventEmitter.prototype.addOneTimeListener = function (eventType, listener) {
            var unbind = this.addListener(eventType, function (value) {
                unbind();
                listener(value);
            });
            return unbind;
        };
        EventEmitter.prototype.addOneTimeDisposableListener = function (eventType, listener) {
            var dispose = this.addOneTimeListener(eventType, listener);
            return {
                dispose: dispose
            };
        };
        EventEmitter.prototype.addBulkListener = function (listener) {
            var _this = this;
            this._bulkListeners.push(listener);
            return function () {
                _this._removeBulkListener(listener);
            };
        };
        EventEmitter.prototype.addBulkListener2 = function (listener) {
            var dispose = this.addBulkListener(listener);
            return {
                dispose: dispose
            };
        };
        EventEmitter.prototype.addEmitter = function (eventEmitter, emitterType) {
            var _this = this;
            if (emitterType === void 0) { emitterType = null; }
            return eventEmitter.addBulkListener(function (events) {
                var newEvents = events;
                if (emitterType) {
                    // If the emitter has an emitterType, recreate events
                    newEvents = [];
                    for (var i = 0, len = events.length; i < len; i++) {
                        newEvents.push(new EmitterEvent(events[i].getType(), events[i].getData(), emitterType));
                    }
                }
                if (_this._deferredCnt === 0) {
                    _this._emitEvents(newEvents);
                }
                else {
                    // Collect for later
                    _this._collectedEvents.push.apply(_this._collectedEvents, newEvents);
                }
            });
        };
        EventEmitter.prototype.addEmitter2 = function (eventEmitter, emitterType) {
            var dispose = this.addEmitter(eventEmitter, emitterType);
            return {
                dispose: dispose
            };
        };
        EventEmitter.prototype.addEmitterTypeListener = function (eventType, emitterType, listener) {
            if (emitterType) {
                if (eventType === '*') {
                    throw new Error('Bulk listeners cannot specify an emitter type');
                }
                return this.addListener(eventType + '/' + emitterType, listener);
            }
            else {
                return this.addListener(eventType, listener);
            }
        };
        EventEmitter.prototype._removeListener = function (eventType, listener) {
            if (this._listeners.hasOwnProperty(eventType)) {
                var listeners = this._listeners[eventType];
                for (var i = 0, len = listeners.length; i < len; i++) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
        };
        EventEmitter.prototype._removeBulkListener = function (listener) {
            for (var i = 0, len = this._bulkListeners.length; i < len; i++) {
                if (this._bulkListeners[i] === listener) {
                    this._bulkListeners.splice(i, 1);
                    break;
                }
            }
        };
        EventEmitter.prototype._emitToSpecificTypeListeners = function (eventType, data) {
            if (this._listeners.hasOwnProperty(eventType)) {
                var listeners = this._listeners[eventType].slice(0);
                for (var i = 0, len = listeners.length; i < len; i++) {
                    try {
                        listeners[i](data);
                    }
                    catch (e) {
                        Errors.onUnexpectedError(e);
                    }
                }
            }
        };
        EventEmitter.prototype._emitToBulkListeners = function (events) {
            var bulkListeners = this._bulkListeners.slice(0);
            for (var i = 0, len = bulkListeners.length; i < len; i++) {
                try {
                    bulkListeners[i](events);
                }
                catch (e) {
                    Errors.onUnexpectedError(e);
                }
            }
        };
        EventEmitter.prototype._emitEvents = function (events) {
            if (this._bulkListeners.length > 0) {
                this._emitToBulkListeners(events);
            }
            for (var i = 0, len = events.length; i < len; i++) {
                var e = events[i];
                this._emitToSpecificTypeListeners(e.getType(), e.getData());
                if (e.getEmitterType()) {
                    this._emitToSpecificTypeListeners(e.getType() + '/' + e.getEmitterType(), e.getData());
                }
            }
        };
        EventEmitter.prototype.emit = function (eventType, data) {
            if (data === void 0) { data = {}; }
            if (this._allowedEventTypes && !this._allowedEventTypes.hasOwnProperty(eventType)) {
                throw new Error('Cannot emit this event type because it wasn\'t white-listed!');
            }
            // Early return if no listeners would get this
            if (!this._listeners.hasOwnProperty(eventType) && this._bulkListeners.length === 0) {
                return;
            }
            var emitterEvent = new EmitterEvent(eventType, data);
            if (this._deferredCnt === 0) {
                this._emitEvents([emitterEvent]);
            }
            else {
                // Collect for later
                this._collectedEvents.push(emitterEvent);
            }
        };
        EventEmitter.prototype.deferredEmit = function (callback) {
            this._deferredCnt = this._deferredCnt + 1;
            var result = null;
            try {
                result = callback();
            }
            catch (e) {
                Errors.onUnexpectedError(e);
            }
            this._deferredCnt = this._deferredCnt - 1;
            if (this._deferredCnt === 0) {
                this._emitCollected();
            }
            return result;
        };
        EventEmitter.prototype._emitCollected = function () {
            // Flush collected events
            var events = this._collectedEvents;
            this._collectedEvents = [];
            if (events.length > 0) {
                this._emitEvents(events);
            }
        };
        return EventEmitter;
    }());
    exports.EventEmitter = EventEmitter;
    var EmitQueueElement = (function () {
        function EmitQueueElement(target, arg) {
            this.target = target;
            this.arg = arg;
        }
        return EmitQueueElement;
    }());
    /**
     * Same as EventEmitter, but guarantees events are delivered in order to each listener
     */
    var OrderGuaranteeEventEmitter = (function (_super) {
        __extends(OrderGuaranteeEventEmitter, _super);
        function OrderGuaranteeEventEmitter(allowedEventTypes) {
            if (allowedEventTypes === void 0) { allowedEventTypes = null; }
            _super.call(this, allowedEventTypes);
            this._emitQueue = [];
        }
        OrderGuaranteeEventEmitter.prototype._emitToSpecificTypeListeners = function (eventType, data) {
            if (this._listeners.hasOwnProperty(eventType)) {
                var listeners = this._listeners[eventType];
                for (var i = 0, len = listeners.length; i < len; i++) {
                    this._emitQueue.push(new EmitQueueElement(listeners[i], data));
                }
            }
        };
        OrderGuaranteeEventEmitter.prototype._emitToBulkListeners = function (events) {
            var bulkListeners = this._bulkListeners;
            for (var i = 0, len = bulkListeners.length; i < len; i++) {
                this._emitQueue.push(new EmitQueueElement(bulkListeners[i], events));
            }
        };
        OrderGuaranteeEventEmitter.prototype._emitEvents = function (events) {
            _super.prototype._emitEvents.call(this, events);
            while (this._emitQueue.length > 0) {
                var queueElement = this._emitQueue.shift();
                try {
                    queueElement.target(queueElement.arg);
                }
                catch (e) {
                    Errors.onUnexpectedError(e);
                }
            }
        };
        return OrderGuaranteeEventEmitter;
    }(EventEmitter));
    exports.OrderGuaranteeEventEmitter = OrderGuaranteeEventEmitter;
});

define("vs/base/common/timer", ["require", "exports", 'vs/base/common/platform', 'vs/base/common/errors', 'vs/base/common/stopwatch'], function (require, exports, Platform, errors, precision) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.ENABLE_TIMER = false;
    var msWriteProfilerMark = Platform.globals['msWriteProfilerMark'];
    (function (Topic) {
        Topic[Topic["EDITOR"] = 0] = "EDITOR";
        Topic[Topic["LANGUAGES"] = 1] = "LANGUAGES";
        Topic[Topic["WORKER"] = 2] = "WORKER";
        Topic[Topic["WORKBENCH"] = 3] = "WORKBENCH";
        Topic[Topic["STARTUP"] = 4] = "STARTUP";
    })(exports.Topic || (exports.Topic = {}));
    var Topic = exports.Topic;
    var NullTimerEvent = (function () {
        function NullTimerEvent() {
        }
        NullTimerEvent.prototype.stop = function () {
            return;
        };
        NullTimerEvent.prototype.timeTaken = function () {
            return -1;
        };
        return NullTimerEvent;
    }());
    var TimerEvent = (function () {
        function TimerEvent(timeKeeper, name, topic, startTime, description) {
            this.timeKeeper = timeKeeper;
            this.name = name;
            this.description = description;
            this.topic = topic;
            this.stopTime = null;
            if (startTime) {
                this.startTime = startTime;
                return;
            }
            this.startTime = new Date();
            this.sw = precision.StopWatch.create();
            if (msWriteProfilerMark) {
                var profilerName = ['Monaco', this.topic, this.name, 'start'];
                msWriteProfilerMark(profilerName.join('|'));
            }
        }
        TimerEvent.prototype.stop = function (stopTime) {
            // already stopped
            if (this.stopTime !== null) {
                return;
            }
            if (stopTime) {
                this.stopTime = stopTime;
                this.sw = null;
                this.timeKeeper._onEventStopped(this);
                return;
            }
            this.stopTime = new Date();
            if (this.sw) {
                this.sw.stop();
            }
            this.timeKeeper._onEventStopped(this);
            if (msWriteProfilerMark) {
                var profilerName = ['Monaco', this.topic, this.name, 'stop'];
                msWriteProfilerMark(profilerName.join('|'));
            }
        };
        TimerEvent.prototype.timeTaken = function () {
            if (this.sw) {
                return this.sw.elapsed();
            }
            if (this.stopTime) {
                return this.stopTime.getTime() - this.startTime.getTime();
            }
            return -1;
        };
        return TimerEvent;
    }());
    var TimeKeeper /*extends EventEmitter.EventEmitter*/ = (function () {
        function TimeKeeper /*extends EventEmitter.EventEmitter*/() {
            this.cleaningIntervalId = -1;
            this.collectedEvents = [];
            this.listeners = [];
        }
        TimeKeeper /*extends EventEmitter.EventEmitter*/.prototype.isEnabled = function () {
            return exports.ENABLE_TIMER;
        };
        TimeKeeper /*extends EventEmitter.EventEmitter*/.prototype.start = function (topic, name, start, description) {
            if (!this.isEnabled()) {
                return exports.nullEvent;
            }
            var strTopic;
            if (typeof topic === 'string') {
                strTopic = topic;
            }
            else if (topic === Topic.EDITOR) {
                strTopic = 'Editor';
            }
            else if (topic === Topic.LANGUAGES) {
                strTopic = 'Languages';
            }
            else if (topic === Topic.WORKER) {
                strTopic = 'Worker';
            }
            else if (topic === Topic.WORKBENCH) {
                strTopic = 'Workbench';
            }
            else if (topic === Topic.STARTUP) {
                strTopic = 'Startup';
            }
            this.initAutoCleaning();
            var event = new TimerEvent(this, name, strTopic, start, description);
            this.addEvent(event);
            return event;
        };
        TimeKeeper /*extends EventEmitter.EventEmitter*/.prototype.dispose = function () {
            if (this.cleaningIntervalId !== -1) {
                Platform.clearInterval(this.cleaningIntervalId);
                this.cleaningIntervalId = -1;
            }
        };
        TimeKeeper /*extends EventEmitter.EventEmitter*/.prototype.addListener = function (listener) {
            this.listeners.push(listener);
        };
        TimeKeeper /*extends EventEmitter.EventEmitter*/.prototype.removeListener = function (listener) {
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i] === listener) {
                    this.listeners.splice(i, 1);
                    return;
                }
            }
        };
        TimeKeeper /*extends EventEmitter.EventEmitter*/.prototype.addEvent = function (event) {
            event.id = TimeKeeper.EVENT_ID;
            TimeKeeper.EVENT_ID++;
            this.collectedEvents.push(event);
            // expire items from the front of the cache
            if (this.collectedEvents.length > TimeKeeper._EVENT_CACHE_LIMIT) {
                this.collectedEvents.shift();
            }
        };
        TimeKeeper /*extends EventEmitter.EventEmitter*/.prototype.initAutoCleaning = function () {
            var _this = this;
            if (this.cleaningIntervalId === -1) {
                this.cleaningIntervalId = Platform.setInterval(function () {
                    var now = Date.now();
                    _this.collectedEvents.forEach(function (event) {
                        if (!event.stopTime && (now - event.startTime.getTime()) >= TimeKeeper._MAX_TIMER_LENGTH) {
                            event.stop();
                        }
                    });
                }, TimeKeeper._CLEAN_UP_INTERVAL);
            }
        };
        TimeKeeper /*extends EventEmitter.EventEmitter*/.prototype.getCollectedEvents = function () {
            return this.collectedEvents.slice(0);
        };
        TimeKeeper /*extends EventEmitter.EventEmitter*/.prototype.clearCollectedEvents = function () {
            this.collectedEvents = [];
        };
        TimeKeeper /*extends EventEmitter.EventEmitter*/.prototype._onEventStopped = function (event) {
            var emitEvents = [event];
            var listeners = this.listeners.slice(0);
            for (var i = 0; i < listeners.length; i++) {
                try {
                    listeners[i](emitEvents);
                }
                catch (e) {
                    errors.onUnexpectedError(e);
                }
            }
        };
        TimeKeeper /*extends EventEmitter.EventEmitter*/.prototype.setInitialCollectedEvents = function (events, startTime) {
            var _this = this;
            if (!this.isEnabled()) {
                return;
            }
            if (startTime) {
                TimeKeeper.PARSE_TIME = startTime;
            }
            events.forEach(function (event) {
                var e = new TimerEvent(_this, event.name, event.topic, event.startTime, event.description);
                e.stop(event.stopTime);
                _this.addEvent(e);
            });
        };
        /**
         * After being started for 1 minute, all timers are automatically stopped.
         */
        TimeKeeper /*extends EventEmitter.EventEmitter*/._MAX_TIMER_LENGTH = 60000; // 1 minute
        /**
         * Every 2 minutes, a sweep of current started timers is done.
         */
        TimeKeeper /*extends EventEmitter.EventEmitter*/._CLEAN_UP_INTERVAL = 120000; // 2 minutes
        /**
         * Collect at most 1000 events.
         */
        TimeKeeper /*extends EventEmitter.EventEmitter*/._EVENT_CACHE_LIMIT = 1000;
        TimeKeeper /*extends EventEmitter.EventEmitter*/.EVENT_ID = 1;
        TimeKeeper /*extends EventEmitter.EventEmitter*/.PARSE_TIME = new Date();
        return TimeKeeper /*extends EventEmitter.EventEmitter*/;
    }());
    exports.TimeKeeper /*extends EventEmitter.EventEmitter*/ = TimeKeeper /*extends EventEmitter.EventEmitter*/;
    var timeKeeper = new TimeKeeper();
    exports.nullEvent = new NullTimerEvent();
    function start(topic, name, start, description) {
        return timeKeeper.start(topic, name, start, description);
    }
    exports.start = start;
    function getTimeKeeper() {
        return timeKeeper;
    }
    exports.getTimeKeeper = getTimeKeeper;
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

define("vs/nls!vs/base/common/json",['vs/nls', 'vs/nls!vs/workbench/electron-main/sharedProcessMain'], function(nls, data) { return nls.create("vs/base/common/json", data); });
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

define("vs/nls!vs/base/common/severity",['vs/nls', 'vs/nls!vs/workbench/electron-main/sharedProcessMain'], function(nls, data) { return nls.create("vs/base/common/severity", data); });
define("vs/base/common/severity", ["require", "exports", 'vs/nls!vs/base/common/severity', 'vs/base/common/strings'], function (require, exports, nls, strings) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var Severity;
    (function (Severity) {
        Severity[Severity["Ignore"] = 0] = "Ignore";
        Severity[Severity["Info"] = 1] = "Info";
        Severity[Severity["Warning"] = 2] = "Warning";
        Severity[Severity["Error"] = 3] = "Error";
    })(Severity || (Severity = {}));
    var Severity;
    (function (Severity) {
        var _error = 'error', _warning = 'warning', _warn = 'warn', _info = 'info';
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
        function toString(value) {
            return _displayStrings[value] || strings.empty;
        }
        Severity.toString = toString;
        function compare(a, b) {
            return b - a;
        }
        Severity.compare = compare;
    })(Severity || (Severity = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Severity;
});

define("vs/nls!vs/base/node/zip",['vs/nls', 'vs/nls!vs/workbench/electron-main/sharedProcessMain'], function(nls, data) { return nls.create("vs/base/node/zip", data); });
define("vs/nls!vs/platform/configuration/common/configurationRegistry",['vs/nls', 'vs/nls!vs/workbench/electron-main/sharedProcessMain'], function(nls, data) { return nls.create("vs/platform/configuration/common/configurationRegistry", data); });
define("vs/nls!vs/platform/extensions/common/extensionsRegistry",['vs/nls', 'vs/nls!vs/workbench/electron-main/sharedProcessMain'], function(nls, data) { return nls.create("vs/platform/extensions/common/extensionsRegistry", data); });
define("vs/nls!vs/platform/extensions/node/extensionValidator",['vs/nls', 'vs/nls!vs/workbench/electron-main/sharedProcessMain'], function(nls, data) { return nls.create("vs/platform/extensions/node/extensionValidator", data); });
define("vs/nls!vs/platform/jsonschemas/common/jsonContributionRegistry",['vs/nls', 'vs/nls!vs/workbench/electron-main/sharedProcessMain'], function(nls, data) { return nls.create("vs/platform/jsonschemas/common/jsonContributionRegistry", data); });
define("vs/nls!vs/workbench/parts/extensions/common/extensions",['vs/nls', 'vs/nls!vs/workbench/electron-main/sharedProcessMain'], function(nls, data) { return nls.create("vs/workbench/parts/extensions/common/extensions", data); });
define("vs/nls!vs/workbench/parts/extensions/node/extensionsService",['vs/nls', 'vs/nls!vs/workbench/electron-main/sharedProcessMain'], function(nls, data) { return nls.create("vs/workbench/parts/extensions/node/extensionsService", data); });
define("vs/nls!vs/workbench/services/request/node/requestService",['vs/nls', 'vs/nls!vs/workbench/electron-main/sharedProcessMain'], function(nls, data) { return nls.create("vs/workbench/services/request/node/requestService", data); });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/platform/instantiation/common/descriptors", ["require", "exports", 'vs/base/common/errors'], function (require, exports, errors) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var AbstractDescriptor = (function () {
        function AbstractDescriptor(_staticArguments) {
            this._staticArguments = _staticArguments;
            // empty
        }
        AbstractDescriptor.prototype.appendStaticArguments = function (more) {
            this._staticArguments.push.apply(this._staticArguments, more);
        };
        AbstractDescriptor.prototype.staticArguments = function (nth) {
            if (isNaN(nth)) {
                return this._staticArguments.slice(0);
            }
            else {
                return this._staticArguments[nth];
            }
        };
        AbstractDescriptor.prototype._validate = function (type) {
            if (!type) {
                throw errors.illegalArgument('can not be falsy');
            }
        };
        return AbstractDescriptor;
    }());
    exports.AbstractDescriptor = AbstractDescriptor;
    var SyncDescriptor = (function (_super) {
        __extends(SyncDescriptor, _super);
        function SyncDescriptor(_ctor) {
            var staticArguments = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                staticArguments[_i - 1] = arguments[_i];
            }
            _super.call(this, staticArguments);
            this._ctor = _ctor;
        }
        Object.defineProperty(SyncDescriptor.prototype, "ctor", {
            get: function () {
                return this._ctor;
            },
            enumerable: true,
            configurable: true
        });
        SyncDescriptor.prototype.equals = function (other) {
            if (other === this) {
                return true;
            }
            if (!(other instanceof SyncDescriptor)) {
                return false;
            }
            return other.ctor === this.ctor;
        };
        SyncDescriptor.prototype.bind = function () {
            var moreStaticArguments = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                moreStaticArguments[_i - 0] = arguments[_i];
            }
            var allArgs = [];
            allArgs = allArgs.concat(this.staticArguments());
            allArgs = allArgs.concat(moreStaticArguments);
            return new (SyncDescriptor.bind.apply(SyncDescriptor, [void 0].concat([this._ctor], allArgs)))();
        };
        return SyncDescriptor;
    }(AbstractDescriptor));
    exports.SyncDescriptor = SyncDescriptor;
    exports.createSyncDescriptor = function (ctor) {
        var staticArguments = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            staticArguments[_i - 1] = arguments[_i];
        }
        return new (SyncDescriptor.bind.apply(SyncDescriptor, [void 0].concat([ctor], staticArguments)))();
    };
    var AsyncDescriptor = (function (_super) {
        __extends(AsyncDescriptor, _super);
        function AsyncDescriptor(_moduleName, _ctorName) {
            var staticArguments = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                staticArguments[_i - 2] = arguments[_i];
            }
            _super.call(this, staticArguments);
            this._moduleName = _moduleName;
            this._ctorName = _ctorName;
            if (typeof _moduleName !== 'string') {
                throw new Error('Invalid AsyncDescriptor arguments, expected `moduleName` to be a string!');
            }
        }
        AsyncDescriptor.create = function (moduleName, ctorName) {
            return new AsyncDescriptor(moduleName, ctorName);
        };
        Object.defineProperty(AsyncDescriptor.prototype, "moduleName", {
            get: function () {
                return this._moduleName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AsyncDescriptor.prototype, "ctorName", {
            get: function () {
                return this._ctorName;
            },
            enumerable: true,
            configurable: true
        });
        AsyncDescriptor.prototype.equals = function (other) {
            if (other === this) {
                return true;
            }
            if (!(other instanceof AsyncDescriptor)) {
                return false;
            }
            return other.moduleName === this.moduleName &&
                other.ctorName === this.ctorName;
        };
        AsyncDescriptor.prototype.bind = function () {
            var moreStaticArguments = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                moreStaticArguments[_i - 0] = arguments[_i];
            }
            var allArgs = [];
            allArgs = allArgs.concat(this.staticArguments());
            allArgs = allArgs.concat(moreStaticArguments);
            return new (AsyncDescriptor.bind.apply(AsyncDescriptor, [void 0].concat([this.moduleName, this.ctorName], allArgs)))();
        };
        return AsyncDescriptor;
    }(AbstractDescriptor));
    exports.AsyncDescriptor = AsyncDescriptor;
    var _createAsyncDescriptor = function (moduleName, ctorName) {
        var staticArguments = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            staticArguments[_i - 2] = arguments[_i];
        }
        return new (AsyncDescriptor.bind.apply(AsyncDescriptor, [void 0].concat([moduleName, ctorName], staticArguments)))();
    };
    exports.createAsyncDescriptor0 = _createAsyncDescriptor;
    exports.createAsyncDescriptor1 = _createAsyncDescriptor;
    exports.createAsyncDescriptor2 = _createAsyncDescriptor;
    exports.createAsyncDescriptor3 = _createAsyncDescriptor;
    exports.createAsyncDescriptor4 = _createAsyncDescriptor;
    exports.createAsyncDescriptor5 = _createAsyncDescriptor;
    exports.createAsyncDescriptor6 = _createAsyncDescriptor;
    exports.createAsyncDescriptor7 = _createAsyncDescriptor;
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/platform/configuration/common/configuration", ["require", "exports", 'vs/platform/instantiation/common/instantiation'], function (require, exports, instantiation_1) {
    "use strict";
    exports.IConfigurationService = instantiation_1.createDecorator('configurationService');
    var ConfigurationServiceEventTypes = (function () {
        function ConfigurationServiceEventTypes() {
        }
        /**
         * This event happens after configuration is updated either programmatically
         * or through a file change. It will include a IConfigurationServiceEvent
         * object that includes the new config and which section was updated
         * or null if entire config was updated.
         *
         * Subscribers can use the provided updated configuration
         * rather than re-pulling for updates
         */
        ConfigurationServiceEventTypes.UPDATED = 'update';
        return ConfigurationServiceEventTypes;
    }());
    exports.ConfigurationServiceEventTypes = ConfigurationServiceEventTypes;
    function extractSetting(config, settingPath) {
        function accessSetting(config, path) {
            var current = config;
            for (var i = 0; i < path.length; i++) {
                current = current[path[i]];
                if (!current) {
                    return undefined;
                }
            }
            return current;
        }
        var path = settingPath.split('.');
        return accessSetting(config, path);
    }
    exports.extractSetting = extractSetting;
});

define("vs/platform/event/common/event", ["require", "exports", 'vs/platform/instantiation/common/instantiation'], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IEventService = instantiation_1.createDecorator('eventService');
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/platform/event/common/eventService", ["require", "exports", 'vs/base/common/eventEmitter', './event'], function (require, exports, eventEmitter_1, event_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // --- implementation ------------------------------------------
    var EventService = (function (_super) {
        __extends(EventService, _super);
        function EventService() {
            _super.call(this);
            this.serviceId = event_1.IEventService;
        }
        return EventService;
    }(eventEmitter_1.EventEmitter));
    exports.EventService = EventService;
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

define("vs/platform/instantiation/common/instantiationService", ["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/errors', 'vs/base/common/strings', 'vs/base/common/types', 'vs/base/common/collections', './descriptors', 'vs/base/common/graph', './instantiation'], function (require, exports, winjs, errors, strings, types, collections, descriptors, graph_1, instantiation) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var IInstantiationService = instantiation.IInstantiationService;
    /**
     * Creates a new instance of an instantiation service.
     */
    function createInstantiationService(services) {
        if (services === void 0) { services = Object.create(null); }
        var result = new InstantiationService(services, new AccessLock());
        return result;
    }
    exports.createInstantiationService = createInstantiationService;
    var AccessLock = (function () {
        function AccessLock() {
            this._value = 0;
        }
        Object.defineProperty(AccessLock.prototype, "locked", {
            get: function () {
                return this._value === 0;
            },
            enumerable: true,
            configurable: true
        });
        AccessLock.prototype.runUnlocked = function (r) {
            this._value++;
            try {
                return r();
            }
            finally {
                this._value--;
            }
        };
        return AccessLock;
    }());
    var ServicesMap = (function () {
        function ServicesMap(_services, _lock) {
            var _this = this;
            this._services = _services;
            this._lock = _lock;
            collections.forEach(this._services, function (entry) {
                // add a accessor to myselves
                _this.registerService(entry.key, entry.value);
            });
        }
        ServicesMap.prototype.registerService = function (name, service) {
            var _this = this;
            // add a accessor to myselves
            Object.defineProperty(this, name, {
                get: function () {
                    if (_this._lock.locked) {
                        throw errors.illegalState('the services map can only be used during construction');
                    }
                    if (!service) {
                        throw errors.illegalArgument(strings.format('service with \'{0}\' not found', name));
                    }
                    if (service instanceof descriptors.SyncDescriptor) {
                        var cached = _this._services[name];
                        if (cached instanceof descriptors.SyncDescriptor) {
                            _this._ensureInstances(name, service);
                            service = _this._services[name];
                        }
                        else {
                            service = cached;
                        }
                    }
                    return service;
                },
                set: function (value) {
                    throw errors.illegalState('services cannot be changed');
                },
                configurable: false,
                enumerable: false
            });
            // add to services map
            this._services[name] = service;
        };
        Object.defineProperty(ServicesMap.prototype, "lock", {
            get: function () {
                return this._lock;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServicesMap.prototype, "services", {
            get: function () {
                return this._services;
            },
            enumerable: true,
            configurable: true
        });
        ServicesMap.prototype._ensureInstances = function (serviceId, desc) {
            var seen = Object.create(null);
            var graph = new graph_1.Graph(function (i) { return i.serviceId; });
            var stack = [{ serviceId: serviceId, desc: desc }];
            while (stack.length) {
                var item = stack.pop();
                graph.lookupOrInsertNode(item);
                // check for cycles between the descriptors
                if (seen[item.serviceId]) {
                    throw new Error("[createInstance] cyclic dependency: " + Object.keys(seen).join('>>'));
                }
                seen[item.serviceId] = true;
                // check all dependencies for existence and if the need to be created first
                var dependencies = instantiation._util.getServiceDependencies(item.desc.ctor);
                if (Array.isArray(dependencies)) {
                    for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
                        var dependency = dependencies_1[_i];
                        var instanceOrDesc = this.services[dependency.serviceId];
                        if (!instanceOrDesc) {
                            throw new Error("[createInstance] " + serviceId + " depends on " + dependency.serviceId + " which is NOT registered.");
                        }
                        if (instanceOrDesc instanceof descriptors.SyncDescriptor) {
                            var d = { serviceId: dependency.serviceId, desc: instanceOrDesc };
                            stack.push(d);
                            graph.insertEdge(item, d);
                        }
                    }
                }
            }
            while (true) {
                var roots = graph.roots();
                // if there is no more roots but still
                // nodes in the graph we have a cycle
                if (roots.length === 0) {
                    if (graph.length !== 0) {
                        throw new Error('[createInstance] cyclinc dependency!');
                    }
                    break;
                }
                for (var _a = 0, roots_1 = roots; _a < roots_1.length; _a++) {
                    var root = roots_1[_a];
                    var instance = this.createInstance(root.data.desc, []);
                    this._services[root.data.serviceId] = instance;
                    graph.removeNode(root.data);
                }
            }
        };
        ServicesMap.prototype.invokeFunction = function (fn, args) {
            var _this = this;
            return this._lock.runUnlocked(function () {
                var accessor = {
                    get: function (id) {
                        var value = instantiation._util.getServiceId(id);
                        return _this[value];
                    }
                };
                return fn.apply(undefined, [accessor].concat(args));
            });
        };
        ServicesMap.prototype.createInstance = function (descriptor, args) {
            var _this = this;
            var allArguments = [];
            var serviceInjections = instantiation._util.getServiceDependencies(descriptor.ctor) || [];
            var fixedArguments = descriptor.staticArguments().concat(args);
            var expectedFirstServiceIndex = fixedArguments.length;
            var actualFirstServiceIndex = Number.MAX_VALUE;
            serviceInjections.forEach(function (si) {
                // @IServiceName
                var serviceId = si.serviceId, index = si.index;
                var service = _this._lock.runUnlocked(function () { return _this[serviceId]; });
                allArguments[index] = service;
                actualFirstServiceIndex = Math.min(actualFirstServiceIndex, si.index);
            });
            // insert the fixed arguments into the array of all ctor
            // arguments. don't overwrite existing values tho it indicates
            // something is off
            var i = 0;
            for (var _i = 0, fixedArguments_1 = fixedArguments; _i < fixedArguments_1.length; _i++) {
                var arg = fixedArguments_1[_i];
                var hasValue = allArguments[i] !== void 0;
                if (!hasValue) {
                    allArguments[i] = arg;
                }
                i += 1;
            }
            allArguments.unshift(descriptor.ctor); // ctor is first arg
            // services are the last arguments of ctor-calls. We check if static ctor arguments
            // (like those from a [sync|async] desriptor) or args that are passed by createInstance
            // don't override positions of those arguments
            if (actualFirstServiceIndex !== Number.MAX_VALUE
                && actualFirstServiceIndex !== expectedFirstServiceIndex) {
                var msg = ("[createInstance] constructor '" + descriptor.ctor.name + "' has first") +
                    (" service dependency at position " + (actualFirstServiceIndex + 1) + " but is called with") +
                    (" " + (expectedFirstServiceIndex - 1) + " static arguments that are expected to come first");
                // throw new Error(msg);
                console.warn(msg);
            }
            return this._lock.runUnlocked(function () {
                var instance = types.create.apply(null, allArguments);
                descriptor._validate(instance);
                return instance;
            });
        };
        return ServicesMap;
    }());
    var InstantiationService = (function () {
        function InstantiationService(services, lock) {
            this.serviceId = IInstantiationService;
            services['instantiationService'] = this;
            this._servicesMap = new ServicesMap(services, lock);
        }
        InstantiationService.prototype.createChild = function (services) {
            var childServices = {};
            // copy existing services
            collections.forEach(this._servicesMap.services, function (entry) {
                childServices[entry.key] = entry.value;
            });
            // insert new services (might overwrite)
            collections.forEach(services, function (entry) {
                childServices[entry.key] = entry.value;
            });
            return new InstantiationService(childServices, this._servicesMap.lock);
        };
        InstantiationService.prototype.registerService = function (name, service) {
            this._servicesMap.registerService(name, service);
        };
        InstantiationService.prototype.addSingleton = function (id, instanceOrDescriptor) {
            var name = instantiation._util.getServiceId(id);
            this._servicesMap.registerService(name, instanceOrDescriptor);
        };
        InstantiationService.prototype.getInstance = function (id) {
            var _this = this;
            var name = instantiation._util.getServiceId(id);
            var result = this._servicesMap.lock.runUnlocked(function () { return _this._servicesMap[name]; });
            return result;
        };
        InstantiationService.prototype.createInstance = function (param) {
            var rest = new Array(arguments.length - 1);
            for (var i = 1, len = arguments.length; i < len; i++) {
                rest[i - 1] = arguments[i];
            }
            if (param instanceof descriptors.SyncDescriptor) {
                return this._servicesMap.createInstance(param, rest);
            }
            else if (param instanceof descriptors.AsyncDescriptor) {
                return this._createInstanceAsync(param, rest);
            }
            else {
                return this._servicesMap.createInstance(new descriptors.SyncDescriptor(param), rest);
            }
        };
        InstantiationService.prototype._createInstanceAsync = function (descriptor, args) {
            var _this = this;
            var canceled;
            return new winjs.TPromise(function (c, e, p) {
                require([descriptor.moduleName], function (_module) {
                    if (canceled) {
                        e(canceled);
                    }
                    if (!_module) {
                        return e(errors.illegalArgument('module not found: ' + descriptor.moduleName));
                    }
                    var ctor;
                    if (!descriptor.ctorName) {
                        ctor = _module;
                    }
                    else {
                        ctor = _module[descriptor.ctorName];
                    }
                    if (typeof ctor !== 'function') {
                        return e(errors.illegalArgument('not a function: ' + descriptor.ctorName || descriptor.moduleName));
                    }
                    try {
                        args.unshift.apply(args, descriptor.staticArguments()); // instead of spread in ctor call
                        c(_this._servicesMap.createInstance(new descriptors.SyncDescriptor(ctor), args));
                    }
                    catch (error) {
                        return e(error);
                    }
                }, e);
            }, function () {
                canceled = errors.canceled();
            });
        };
        InstantiationService.prototype.invokeFunction = function (signature) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return this._servicesMap.invokeFunction(signature, args);
        };
        return InstantiationService;
    }());
});

define("vs/platform/platform", ["require", "exports", 'vs/base/common/types', 'vs/base/common/assert'], function (require, exports, Types, Assert) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var RegistryImpl = (function () {
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
    /**
     * A base class for registries that leverage the instantiation service to create instances.
     */
    var BaseRegistry = (function () {
        function BaseRegistry() {
            this.toBeInstantiated = [];
            this.instances = [];
        }
        BaseRegistry.prototype.setInstantiationService = function (service) {
            this.instantiationService = service;
            while (this.toBeInstantiated.length > 0) {
                var entry = this.toBeInstantiated.shift();
                this.instantiate(entry);
            }
        };
        BaseRegistry.prototype.instantiate = function (ctor) {
            var instance = this.instantiationService.createInstance(ctor);
            this.instances.push(instance);
        };
        BaseRegistry.prototype._register = function (ctor) {
            if (this.instantiationService) {
                this.instantiate(ctor);
            }
            else {
                this.toBeInstantiated.push(ctor);
            }
        };
        BaseRegistry.prototype._getInstances = function () {
            return this.instances.slice(0);
        };
        BaseRegistry.prototype._setInstances = function (instances) {
            this.instances = instances;
        };
        return BaseRegistry;
    }());
    exports.BaseRegistry = BaseRegistry;
});

define("vs/platform/jsonschemas/common/jsonContributionRegistry", ["require", "exports", 'vs/nls!vs/platform/jsonschemas/common/jsonContributionRegistry', 'vs/platform/platform', 'vs/base/common/eventEmitter'], function (require, exports, nls, platform, eventEmitter_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.Extensions = {
        JSONContribution: 'base.contributions.json'
    };
    function normalizeId(id) {
        if (id.length > 0 && id.charAt(id.length - 1) === '#') {
            return id.substring(0, id.length - 1);
        }
        return id;
    }
    var JSONContributionRegistry = (function () {
        function JSONContributionRegistry() {
            this.schemasById = {};
            this.schemaAssociations = {};
            this.eventEmitter = new eventEmitter_1.EventEmitter();
        }
        JSONContributionRegistry.prototype.addRegistryChangedListener = function (callback) {
            return this.eventEmitter.addListener2('registryChanged', callback);
        };
        JSONContributionRegistry.prototype.registerSchema = function (uri, unresolvedSchemaContent) {
            this.schemasById[normalizeId(uri)] = unresolvedSchemaContent;
            this.eventEmitter.emit('registryChanged', {});
        };
        JSONContributionRegistry.prototype.addSchemaFileAssociation = function (pattern, uri) {
            var uris = this.schemaAssociations[pattern];
            if (!uris) {
                uris = [];
                this.schemaAssociations[pattern] = uris;
            }
            uris.push(uri);
            this.eventEmitter.emit('registryChanged', {});
        };
        JSONContributionRegistry.prototype.getSchemaContributions = function () {
            return {
                schemas: this.schemasById,
                schemaAssociations: this.schemaAssociations
            };
        };
        return JSONContributionRegistry;
    }());
    var jsonContributionRegistry = new JSONContributionRegistry();
    platform.Registry.add(exports.Extensions.JSONContribution, jsonContributionRegistry);
    // preload the schema-schema with a version that contains descriptions.
    jsonContributionRegistry.registerSchema('http://json-schema.org/draft-04/schema#', {
        'id': 'http://json-schema.org/draft-04/schema#',
        'title': nls.localize(0, null),
        '$schema': 'http://json-schema.org/draft-04/schema#',
        'definitions': {
            'schemaArray': {
                'type': 'array',
                'minItems': 1,
                'items': { '$ref': '#' }
            },
            'positiveInteger': {
                'type': 'integer',
                'minimum': 0
            },
            'positiveIntegerDefault0': {
                'allOf': [{ '$ref': '#/definitions/positiveInteger' }, { 'default': 0 }]
            },
            'simpleTypes': {
                'type': 'string',
                'enum': ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string']
            },
            'stringArray': {
                'type': 'array',
                'items': { 'type': 'string' },
                'minItems': 1,
                'uniqueItems': true
            }
        },
        'type': 'object',
        'properties': {
            'id': {
                'type': 'string',
                'format': 'uri',
                'description': nls.localize(1, null)
            },
            '$schema': {
                'type': 'string',
                'format': 'uri',
                'description': nls.localize(2, null)
            },
            'title': {
                'type': 'string',
                'description': nls.localize(3, null)
            },
            'description': {
                'type': 'string',
                'description': nls.localize(4, null)
            },
            'default': {
                'description': nls.localize(5, null)
            },
            'multipleOf': {
                'type': 'number',
                'minimum': 0,
                'exclusiveMinimum': true,
                'description': nls.localize(6, null)
            },
            'maximum': {
                'type': 'number',
                'description': nls.localize(7, null)
            },
            'exclusiveMaximum': {
                'type': 'boolean',
                'default': false,
                'description': nls.localize(8, null)
            },
            'minimum': {
                'type': 'number',
                'description': nls.localize(9, null)
            },
            'exclusiveMinimum': {
                'type': 'boolean',
                'default': false,
                'description': nls.localize(10, null)
            },
            'maxLength': {
                'allOf': [
                    { '$ref': '#/definitions/positiveInteger' }
                ],
                'description': nls.localize(11, null)
            },
            'minLength': {
                'allOf': [
                    { '$ref': '#/definitions/positiveIntegerDefault0' }
                ],
                'description': nls.localize(12, null)
            },
            'pattern': {
                'type': 'string',
                'format': 'regex',
                'description': nls.localize(13, null)
            },
            'additionalItems': {
                'anyOf': [
                    { 'type': 'boolean' },
                    { '$ref': '#' }
                ],
                'default': {},
                'description': nls.localize(14, null)
            },
            'items': {
                'anyOf': [
                    { '$ref': '#' },
                    { '$ref': '#/definitions/schemaArray' }
                ],
                'default': {},
                'description': nls.localize(15, null)
            },
            'maxItems': {
                'allOf': [
                    { '$ref': '#/definitions/positiveInteger' }
                ],
                'description': nls.localize(16, null)
            },
            'minItems': {
                'allOf': [
                    { '$ref': '#/definitions/positiveIntegerDefault0' }
                ],
                'description': nls.localize(17, null)
            },
            'uniqueItems': {
                'type': 'boolean',
                'default': false,
                'description': nls.localize(18, null)
            },
            'maxProperties': {
                'allOf': [
                    { '$ref': '#/definitions/positiveInteger' }
                ],
                'description': nls.localize(19, null)
            },
            'minProperties': {
                'allOf': [
                    { '$ref': '#/definitions/positiveIntegerDefault0' },
                ],
                'description': nls.localize(20, null)
            },
            'required': {
                'allOf': [
                    { '$ref': '#/definitions/stringArray' }
                ],
                'description': nls.localize(21, null)
            },
            'additionalProperties': {
                'anyOf': [
                    { 'type': 'boolean' },
                    { '$ref': '#' }
                ],
                'default': {},
                'description': nls.localize(22, null)
            },
            'definitions': {
                'type': 'object',
                'additionalProperties': { '$ref': '#' },
                'default': {},
                'description': nls.localize(23, null)
            },
            'properties': {
                'type': 'object',
                'additionalProperties': { '$ref': '#' },
                'default': {},
                'description': nls.localize(24, null)
            },
            'patternProperties': {
                'type': 'object',
                'additionalProperties': { '$ref': '#' },
                'default': {},
                'description': nls.localize(25, null)
            },
            'dependencies': {
                'type': 'object',
                'additionalProperties': {
                    'anyOf': [
                        { '$ref': '#' },
                        { '$ref': '#/definitions/stringArray' }
                    ]
                },
                'description': nls.localize(26, null)
            },
            'enum': {
                'type': 'array',
                'minItems': 1,
                'uniqueItems': true,
                'description': nls.localize(27, null)
            },
            'type': {
                'anyOf': [
                    { '$ref': '#/definitions/simpleTypes' },
                    {
                        'type': 'array',
                        'items': { '$ref': '#/definitions/simpleTypes' },
                        'minItems': 1,
                        'uniqueItems': true
                    }
                ],
                'description': nls.localize(28, null)
            },
            'format': {
                'anyOf': [
                    {
                        'type': 'string',
                        'description': nls.localize(29, null),
                        'enum': ['date-time', 'uri', 'email', 'hostname', 'ipv4', 'ipv6', 'regex']
                    }, {
                        'type': 'string'
                    }
                ]
            },
            'allOf': {
                'allOf': [
                    { '$ref': '#/definitions/schemaArray' }
                ],
                'description': nls.localize(30, null)
            },
            'anyOf': {
                'allOf': [
                    { '$ref': '#/definitions/schemaArray' }
                ],
                'description': nls.localize(31, null)
            },
            'oneOf': {
                'allOf': [
                    { '$ref': '#/definitions/schemaArray' }
                ],
                'description': nls.localize(32, null)
            },
            'not': {
                'allOf': [
                    { '$ref': '#' }
                ],
                'description': nls.localize(33, null)
            }
        },
        'dependencies': {
            'exclusiveMaximum': ['maximum'],
            'exclusiveMinimum': ['minimum']
        },
        'default': {}
    });
});

define("vs/platform/extensions/common/extensionsRegistry", ["require", "exports", 'vs/nls!vs/platform/extensions/common/extensionsRegistry', 'vs/base/common/errors', 'vs/base/common/paths', 'vs/base/common/severity', 'vs/platform/jsonschemas/common/jsonContributionRegistry', 'vs/platform/platform'], function (require, exports, nls, errors_1, paths, severity_1, jsonContributionRegistry_1, platform_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ExtensionMessageCollector = (function () {
        function ExtensionMessageCollector(messageHandler, source) {
            this._messageHandler = messageHandler;
            this._source = source;
        }
        ExtensionMessageCollector.prototype._msg = function (type, message) {
            this._messageHandler({
                type: type,
                message: message,
                source: this._source
            });
        };
        ExtensionMessageCollector.prototype.error = function (message) {
            this._msg(severity_1.default.Error, message);
        };
        ExtensionMessageCollector.prototype.warn = function (message) {
            this._msg(severity_1.default.Warning, message);
        };
        ExtensionMessageCollector.prototype.info = function (message) {
            this._msg(severity_1.default.Info, message);
        };
        return ExtensionMessageCollector;
    }());
    function isValidExtensionDescription(extensionFolderPath, extensionDescription, notices) {
        if (!extensionDescription) {
            notices.push(nls.localize(0, null));
            return false;
        }
        if (typeof extensionDescription.publisher !== 'string') {
            notices.push(nls.localize(1, null, 'publisher'));
            return false;
        }
        if (typeof extensionDescription.name !== 'string') {
            notices.push(nls.localize(2, null, 'name'));
            return false;
        }
        if (typeof extensionDescription.version !== 'string') {
            notices.push(nls.localize(3, null, 'version'));
            return false;
        }
        if (!extensionDescription.engines) {
            notices.push(nls.localize(4, null, 'engines'));
            return false;
        }
        if (typeof extensionDescription.engines.vscode !== 'string') {
            notices.push(nls.localize(5, null, 'engines.vscode'));
            return false;
        }
        if (typeof extensionDescription.extensionDependencies !== 'undefined') {
            if (!_isStringArray(extensionDescription.extensionDependencies)) {
                notices.push(nls.localize(6, null, 'extensionDependencies'));
                return false;
            }
        }
        if (typeof extensionDescription.activationEvents !== 'undefined') {
            if (!_isStringArray(extensionDescription.activationEvents)) {
                notices.push(nls.localize(7, null, 'activationEvents'));
                return false;
            }
            if (typeof extensionDescription.main === 'undefined') {
                notices.push(nls.localize(8, null, 'activationEvents', 'main'));
                return false;
            }
        }
        if (typeof extensionDescription.main !== 'undefined') {
            if (typeof extensionDescription.main !== 'string') {
                notices.push(nls.localize(9, null, 'main'));
                return false;
            }
            else {
                var normalizedAbsolutePath = paths.normalize(paths.join(extensionFolderPath, extensionDescription.main));
                if (normalizedAbsolutePath.indexOf(extensionFolderPath)) {
                    notices.push(nls.localize(10, null, normalizedAbsolutePath, extensionFolderPath));
                }
            }
            if (typeof extensionDescription.activationEvents === 'undefined') {
                notices.push(nls.localize(11, null, 'activationEvents', 'main'));
                return false;
            }
        }
        return true;
    }
    exports.isValidExtensionDescription = isValidExtensionDescription;
    var hasOwnProperty = Object.hasOwnProperty;
    var schemaRegistry = platform_1.Registry.as(jsonContributionRegistry_1.Extensions.JSONContribution);
    var ExtensionPoint = (function () {
        function ExtensionPoint(name, registry) {
            this.name = name;
            this._registry = registry;
            this._handler = null;
            this._messageHandler = null;
        }
        ExtensionPoint.prototype.setHandler = function (handler) {
            if (this._handler) {
                throw new Error('Handler already set!');
            }
            this._handler = handler;
            this._handle();
        };
        ExtensionPoint.prototype.handle = function (messageHandler) {
            this._messageHandler = messageHandler;
            this._handle();
        };
        ExtensionPoint.prototype._handle = function () {
            var _this = this;
            if (!this._handler || !this._messageHandler) {
                return;
            }
            this._registry.registerPointListener(this.name, function (descriptions) {
                var users = descriptions.map(function (desc) {
                    return {
                        description: desc,
                        value: desc.contributes[_this.name],
                        collector: new ExtensionMessageCollector(_this._messageHandler, desc.extensionFolderPath)
                    };
                });
                _this._handler(users);
            });
        };
        return ExtensionPoint;
    }());
    var schemaId = 'vscode://schemas/vscode-extensions';
    var schema = {
        default: {
            'name': '{{name}}',
            'description': '{{description}}',
            'author': '{{author}}',
            'version': '{{1.0.0}}',
            'main': '{{pathToMain}}',
            'dependencies': {}
        },
        properties: {
            // engines: {
            // 	required: [ 'vscode' ],
            // 	properties: {
            // 		'vscode': {
            // 			type: 'string',
            // 			description: nls.localize('vscode.extension.engines.vscode', 'Specifies that this package only runs inside VSCode of the given version.'),
            // 		}
            // 	}
            // },
            displayName: {
                description: nls.localize(12, null),
                type: 'string'
            },
            categories: {
                description: nls.localize(13, null),
                type: 'array',
                items: {
                    type: 'string',
                    enum: ['Languages', 'Snippets', 'Linters', 'Themes', 'Debuggers', 'Other']
                }
            },
            galleryBanner: {
                type: 'object',
                description: nls.localize(14, null),
                properties: {
                    color: {
                        description: nls.localize(15, null),
                        type: 'string'
                    },
                    theme: {
                        description: nls.localize(16, null),
                        type: 'string',
                        enum: ['dark', 'light']
                    }
                }
            },
            publisher: {
                description: nls.localize(17, null),
                type: 'string'
            },
            activationEvents: {
                description: nls.localize(18, null),
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            extensionDependencies: {
                description: nls.localize(19, null),
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            scripts: {
                type: 'object',
                properties: {
                    'vscode:prepublish': {
                        description: nls.localize(20, null),
                        type: 'string'
                    }
                }
            },
            contributes: {
                description: nls.localize(21, null),
                type: 'object',
                properties: {},
                default: {}
            }
        }
    };
    var ExtensionsRegistryImpl = (function () {
        function ExtensionsRegistryImpl() {
            this._extensionsMap = {};
            this._extensionsArr = [];
            this._activationMap = {};
            this._pointListeners = [];
            this._extensionPoints = {};
            this._oneTimeActivationEventListeners = {};
        }
        ExtensionsRegistryImpl.prototype.registerPointListener = function (point, handler) {
            var entry = {
                extensionPoint: point,
                listener: handler
            };
            this._pointListeners.push(entry);
            this._triggerPointListener(entry, ExtensionsRegistryImpl._filterWithExtPoint(this.getAllExtensionDescriptions(), point));
        };
        ExtensionsRegistryImpl.prototype.registerExtensionPoint = function (extensionPoint, jsonSchema) {
            if (hasOwnProperty.call(this._extensionPoints, extensionPoint)) {
                throw new Error('Duplicate extension point: ' + extensionPoint);
            }
            var result = new ExtensionPoint(extensionPoint, this);
            this._extensionPoints[extensionPoint] = result;
            schema.properties['contributes'].properties[extensionPoint] = jsonSchema;
            schemaRegistry.registerSchema(schemaId, schema);
            return result;
        };
        ExtensionsRegistryImpl.prototype.handleExtensionPoints = function (messageHandler) {
            var _this = this;
            Object.keys(this._extensionPoints).forEach(function (extensionPointName) {
                _this._extensionPoints[extensionPointName].handle(messageHandler);
            });
        };
        ExtensionsRegistryImpl.prototype._triggerPointListener = function (handler, desc) {
            // console.log('_triggerPointListeners: ' + desc.length + ' OF ' + handler.extensionPoint);
            if (!desc || desc.length === 0) {
                return;
            }
            try {
                handler.listener(desc);
            }
            catch (e) {
                errors_1.onUnexpectedError(e);
            }
        };
        ExtensionsRegistryImpl.prototype.registerExtensions = function (extensionDescriptions) {
            for (var i = 0, len = extensionDescriptions.length; i < len; i++) {
                var extensionDescription = extensionDescriptions[i];
                if (hasOwnProperty.call(this._extensionsMap, extensionDescription.id)) {
                    // No overwriting allowed!
                    console.error('Extension `' + extensionDescription.id + '` is already registered');
                    continue;
                }
                this._extensionsMap[extensionDescription.id] = extensionDescription;
                this._extensionsArr.push(extensionDescription);
                if (Array.isArray(extensionDescription.activationEvents)) {
                    for (var j = 0, lenJ = extensionDescription.activationEvents.length; j < lenJ; j++) {
                        var activationEvent = extensionDescription.activationEvents[j];
                        this._activationMap[activationEvent] = this._activationMap[activationEvent] || [];
                        this._activationMap[activationEvent].push(extensionDescription);
                    }
                }
            }
            for (var i = 0, len = this._pointListeners.length; i < len; i++) {
                var listenerEntry = this._pointListeners[i];
                var descriptions = ExtensionsRegistryImpl._filterWithExtPoint(extensionDescriptions, listenerEntry.extensionPoint);
                this._triggerPointListener(listenerEntry, descriptions);
            }
        };
        ExtensionsRegistryImpl._filterWithExtPoint = function (input, point) {
            return input.filter(function (desc) {
                return (desc.contributes && hasOwnProperty.call(desc.contributes, point));
            });
        };
        ExtensionsRegistryImpl.prototype.getExtensionDescriptionsForActivationEvent = function (activationEvent) {
            if (!hasOwnProperty.call(this._activationMap, activationEvent)) {
                return [];
            }
            return this._activationMap[activationEvent].slice(0);
        };
        ExtensionsRegistryImpl.prototype.getAllExtensionDescriptions = function () {
            return this._extensionsArr.slice(0);
        };
        ExtensionsRegistryImpl.prototype.getExtensionDescription = function (extensionId) {
            if (!hasOwnProperty.call(this._extensionsMap, extensionId)) {
                return null;
            }
            return this._extensionsMap[extensionId];
        };
        ExtensionsRegistryImpl.prototype.registerOneTimeActivationEventListener = function (activationEvent, listener) {
            if (!hasOwnProperty.call(this._oneTimeActivationEventListeners, activationEvent)) {
                this._oneTimeActivationEventListeners[activationEvent] = [];
            }
            this._oneTimeActivationEventListeners[activationEvent].push(listener);
        };
        ExtensionsRegistryImpl.prototype.triggerActivationEventListeners = function (activationEvent) {
            if (hasOwnProperty.call(this._oneTimeActivationEventListeners, activationEvent)) {
                var listeners = this._oneTimeActivationEventListeners[activationEvent];
                delete this._oneTimeActivationEventListeners[activationEvent];
                for (var i = 0, len = listeners.length; i < len; i++) {
                    var listener = listeners[i];
                    try {
                        listener();
                    }
                    catch (e) {
                        errors_1.onUnexpectedError(e);
                    }
                }
            }
        };
        return ExtensionsRegistryImpl;
    }());
    function _isStringArray(arr) {
        if (!Array.isArray(arr)) {
            return false;
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            if (typeof arr[i] !== 'string') {
                return false;
            }
        }
        return true;
    }
    var PRExtensions = {
        ExtensionsRegistry: 'ExtensionsRegistry'
    };
    platform_1.Registry.add(PRExtensions.ExtensionsRegistry, new ExtensionsRegistryImpl());
    exports.ExtensionsRegistry = platform_1.Registry.as(PRExtensions.ExtensionsRegistry);
    schemaRegistry.registerSchema(schemaId, schema);
    schemaRegistry.addSchemaFileAssociation('/package.json', schemaId);
});

define("vs/platform/configuration/common/configurationRegistry", ["require", "exports", 'vs/nls!vs/platform/configuration/common/configurationRegistry', 'vs/base/common/event', 'vs/platform/platform', 'vs/base/common/objects', 'vs/platform/extensions/common/extensionsRegistry', 'vs/platform/jsonschemas/common/jsonContributionRegistry'], function (require, exports, nls, event_1, platform, objects, extensionsRegistry_1, JSONContributionRegistry) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.Extensions = {
        Configuration: 'base.contributions.configuration'
    };
    var schemaId = 'vscode://schemas/settings';
    var contributionRegistry = platform.Registry.as(JSONContributionRegistry.Extensions.JSONContribution);
    var ConfigurationRegistry = (function () {
        function ConfigurationRegistry() {
            this.configurationContributors = [];
            this.configurationSchema = { allOf: [] };
            this._onDidRegisterConfiguration = new event_1.Emitter();
            contributionRegistry.registerSchema(schemaId, this.configurationSchema);
            contributionRegistry.addSchemaFileAssociation('vscode://defaultsettings/settings.json', schemaId);
            contributionRegistry.addSchemaFileAssociation('%APP_SETTINGS_HOME%/settings.json', schemaId);
            contributionRegistry.addSchemaFileAssociation('/.vscode/settings.json', schemaId);
        }
        Object.defineProperty(ConfigurationRegistry.prototype, "onDidRegisterConfiguration", {
            get: function () {
                return this._onDidRegisterConfiguration.event;
            },
            enumerable: true,
            configurable: true
        });
        ConfigurationRegistry.prototype.registerConfiguration = function (configuration) {
            this.configurationContributors.push(configuration);
            this.registerJSONConfiguration(configuration);
            this._onDidRegisterConfiguration.fire(this);
        };
        ConfigurationRegistry.prototype.getConfigurations = function () {
            return this.configurationContributors.slice(0);
        };
        ConfigurationRegistry.prototype.registerJSONConfiguration = function (configuration) {
            var schema = objects.clone(configuration);
            this.configurationSchema.allOf.push(schema);
            contributionRegistry.registerSchema(schemaId, this.configurationSchema);
        };
        return ConfigurationRegistry;
    }());
    var configurationRegistry = new ConfigurationRegistry();
    platform.Registry.add(exports.Extensions.Configuration, configurationRegistry);
    var configurationExtPoint = extensionsRegistry_1.ExtensionsRegistry.registerExtensionPoint('configuration', {
        description: nls.localize(0, null),
        type: 'object',
        defaultSnippets: [{ body: { title: '', properties: {} } }],
        properties: {
            title: {
                description: nls.localize(1, null),
                type: 'string'
            },
            properties: {
                description: nls.localize(2, null),
                type: 'object',
                additionalProperties: {
                    $ref: 'http://json-schema.org/draft-04/schema#'
                }
            }
        }
    });
    configurationExtPoint.setHandler(function (extensions) {
        for (var i = 0; i < extensions.length; i++) {
            var configuration = extensions[i].value;
            var collector = extensions[i].collector;
            if (configuration.type && configuration.type !== 'object') {
                collector.warn(nls.localize(3, null));
            }
            else {
                configuration.type = 'object';
            }
            if (configuration.title && (typeof configuration.title !== 'string')) {
                collector.error(nls.localize(4, null));
            }
            if (configuration.properties && (typeof configuration.properties !== 'object')) {
                collector.error(nls.localize(5, null));
                return;
            }
            var clonedConfiguration = objects.clone(configuration);
            clonedConfiguration.id = extensions[i].description.id;
            configurationRegistry.registerConfiguration(clonedConfiguration);
        }
    });
});

define("vs/platform/configuration/common/model", ["require", "exports", 'vs/base/common/objects', 'vs/platform/platform', 'vs/base/common/types', 'vs/base/common/json', './configurationRegistry'], function (require, exports, objects, platform, types, json, configurationRegistry) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.CONFIG_DEFAULT_NAME = 'settings';
    function setNode(root, key, value) {
        var segments = key.split('.');
        var last = segments.pop();
        var curr = root;
        segments.forEach(function (s) {
            var obj = curr[s];
            switch (typeof obj) {
                case 'undefined':
                    obj = curr[s] = Object.create(null);
                    break;
                case 'object':
                    break;
                default:
                    console.log('Conflicting configuration setting: ' + key + ' at ' + s + ' with ' + JSON.stringify(obj));
            }
            curr = obj;
        });
        curr[last] = value;
    }
    function newConfigFile(value) {
        try {
            var root = Object.create(null);
            var contents = json.parse(value) || {};
            for (var key in contents) {
                setNode(root, key, contents[key]);
            }
            return {
                contents: root
            };
        }
        catch (e) {
            return {
                contents: {},
                parseError: e
            };
        }
    }
    exports.newConfigFile = newConfigFile;
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
    function consolidate(configMap) {
        var finalConfig = Object.create(null);
        var parseErrors = [];
        var regexp = /\/(team\.)?([^\.]*)*\.json/;
        // For each config file in .vscode folder
        Object.keys(configMap).forEach(function (configFileName) {
            var config = objects.clone(configMap[configFileName]);
            var matches = regexp.exec(configFileName);
            if (!matches) {
                return;
            }
            // If a file is team.foo.json, it indicates team settings, strip this away
            var isTeamSetting = !!matches[1];
            // Extract the config key from the file name (except for settings.json which is the default)
            var configElement = finalConfig;
            if (matches && matches[2] && matches[2] !== exports.CONFIG_DEFAULT_NAME) {
                // Use the name of the file as top level config section for all settings inside
                var configSection = matches[2];
                var element = configElement[configSection];
                if (!element) {
                    element = Object.create(null);
                    configElement[configSection] = element;
                }
                configElement = element;
            }
            merge(configElement, config.contents, !isTeamSetting /* user settings overrule team settings */);
            if (config.parseError) {
                parseErrors.push(configFileName);
            }
        });
        return {
            contents: finalConfig,
            parseErrors: parseErrors
        };
    }
    exports.consolidate = consolidate;
    // defaults...
    function processDefaultValues(withConfig) {
        var configurations = platform.Registry.as(configurationRegistry.Extensions.Configuration).getConfigurations();
        var visit = function (config, isFirst) {
            withConfig(config, isFirst);
            if (Array.isArray(config.allOf)) {
                config.allOf.forEach(function (c) {
                    visit(c, false);
                });
            }
        };
        configurations.sort(function (c1, c2) {
            if (typeof c1.order !== 'number') {
                return 1;
            }
            if (typeof c2.order !== 'number') {
                return -1;
            }
            return c1.order - c2.order;
        }).forEach(function (config) {
            visit(config, true);
        });
    }
    function getDefaultValues() {
        var ret = Object.create(null);
        var handleConfig = function (config, isTop) {
            if (config.properties) {
                Object.keys(config.properties).forEach(function (key) {
                    var prop = config.properties[key];
                    var value = prop.default;
                    if (types.isUndefined(prop.default)) {
                        value = getDefaultValue(prop.type);
                    }
                    setNode(ret, key, value);
                });
            }
        };
        processDefaultValues(handleConfig);
        return ret;
    }
    exports.getDefaultValues = getDefaultValues;
    function getDefaultValuesContent() {
        var lastEntry = -1;
        var result = [];
        result.push('{');
        var handleConfig = function (config, isTop) {
            if (config.title) {
                if (isTop) {
                    result.push('');
                    result.push('\t//-------- ' + config.title + ' --------');
                }
                else {
                    result.push('\t// ' + config.title);
                }
                result.push('');
            }
            if (config.properties) {
                Object.keys(config.properties).forEach(function (key) {
                    var prop = config.properties[key];
                    var defaultValue = prop.default;
                    if (types.isUndefined(defaultValue)) {
                        defaultValue = getDefaultValue(prop.type);
                    }
                    if (prop.description) {
                        result.push('\t// ' + prop.description);
                    }
                    var valueString = JSON.stringify(defaultValue, null, '\t');
                    if (valueString && (typeof defaultValue === 'object')) {
                        valueString = addIndent(valueString);
                    }
                    if (lastEntry !== -1) {
                        result[lastEntry] += ',';
                    }
                    lastEntry = result.length;
                    result.push('\t' + JSON.stringify(key) + ': ' + valueString);
                    result.push('');
                });
            }
        };
        processDefaultValues(handleConfig);
        result.push('}');
        return result.join('\n');
    }
    exports.getDefaultValuesContent = getDefaultValuesContent;
    function addIndent(str) {
        return str.split('\n').join('\n\t');
    }
    function getDefaultValue(type) {
        var t = Array.isArray(type) ? type[0] : type;
        switch (t) {
            case 'boolean':
                return false;
            case 'integer':
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
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/platform/configuration/common/configurationService", ["require", "exports", 'vs/base/common/paths', 'vs/base/common/winjs.base', 'vs/base/common/eventEmitter', 'vs/base/common/objects', 'vs/base/common/errors', './model', 'vs/base/common/lifecycle', 'vs/base/common/collections', './configuration', 'vs/platform/files/common/files', './configurationRegistry', 'vs/platform/platform', 'vs/base/common/event', 'vs/platform/extensions/common/extensionsRegistry', 'fs', 'path'], function (require, exports, paths, winjs, eventEmitter, objects, errors, model, lifecycle, collections, configuration_1, Files, configurationRegistry_1, platform_1, event_1, extensionsRegistry_1, fs, path) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ConfigurationService = (function (_super) {
        __extends(ConfigurationService, _super);
        function ConfigurationService(contextService, eventService, workspaceSettingsRootFolder) {
            var _this = this;
            if (workspaceSettingsRootFolder === void 0) { workspaceSettingsRootFolder = '.vscode'; }
            _super.call(this);
            this.serviceId = configuration_1.IConfigurationService;
            this.contextService = contextService;
            this.eventService = eventService;
            this.workspaceSettingsRootFolder = workspaceSettingsRootFolder;
            this.workspaceFilePathToConfiguration = Object.create(null);
            var unbind = this.eventService.addListener(Files.EventType.FILE_CHANGES, function (events) { return _this.handleFileEvents(events); });
            var subscription = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).onDidRegisterConfiguration(function () { return _this.reloadAndEmit(); });
            this.callOnDispose = function () {
                unbind();
                subscription.dispose();
            };
            this.onDidUpdateConfiguration = event_1.fromEventEmitter(this, configuration_1.ConfigurationServiceEventTypes.UPDATED);
        }
        ConfigurationService.prototype.dispose = function () {
            this.callOnDispose = lifecycle.cAll(this.callOnDispose);
            _super.prototype.dispose.call(this);
        };
        ConfigurationService.prototype.loadConfiguration = function (section) {
            if (!this.loadConfigurationPromise) {
                this.loadConfigurationPromise = this.doLoadConfiguration();
            }
            return this.loadConfigurationPromise.then(function (res) {
                var result = section ? res.merged[section] : res.merged;
                var parseErrors = res.consolidated.parseErrors;
                if (res.globals.parseErrors) {
                    parseErrors.push.apply(parseErrors, res.globals.parseErrors);
                }
                if (parseErrors.length > 0) {
                    if (!result) {
                        result = {};
                    }
                    result.$parseErrors = parseErrors;
                }
                return result;
            });
        };
        ConfigurationService.findKha = function (values) {
            if (values.kha) {
                var khapath = values.kha.khaPath;
                if (khapath.length > 0) {
                    return khapath;
                }
            }
            return path.join(extensionsRegistry_1.ExtensionsRegistry.getExtensionDescription('ktx.kha').extensionFolderPath, 'Kha');
        };
        ConfigurationService.prototype.doLoadConfiguration = function () {
            var _this = this;
            // Load globals
            return this.loadGlobalConfiguration().then(function (globals) {
                // Load workspace locals
                return _this.loadWorkspaceConfiguration().then(function (values) {
                    // Consolidate
                    var consolidated = model.consolidate(values);
                    // Override with workspace locals
                    var merged = objects.mixin(objects.clone(globals.contents), // target: global/default values (but dont modify!)
                    consolidated.contents, // source: workspace configured values
                    true // overwrite
                    );
                    try {
                        if (fs.statSync(_this.contextService.toResource('khafile.js').fsPath).isFile()) {
                            var exec = process.execPath;
                            if (exec.indexOf('Electron Helper') >= 0) {
                                var dir = exec.substring(0, exec.lastIndexOf('/'));
                                exec = paths.join(dir, '..', '..', '..', '..', 'MacOS', 'Electron');
                            }
                            merged = objects.mixin(merged, {
                                launch: {
                                    configurations: [
                                        {
                                            name: 'Launch',
                                            type: 'chrome',
                                            request: 'launch',
                                            file: 'build/debug-html5',
                                            sourceMaps: true,
                                            runtimeExecutable: exec,
                                            kha: ConfigurationService.findKha(merged),
                                            cwd: _this.contextService.getWorkspace().resource.fsPath
                                        }
                                    ]
                                }
                            }, true);
                        }
                    }
                    catch (error) {
                    }
                    return {
                        merged: merged,
                        consolidated: consolidated,
                        globals: globals
                    };
                });
            });
        };
        ConfigurationService.prototype.loadGlobalConfiguration = function () {
            return winjs.TPromise.as({
                contents: model.getDefaultValues()
            });
        };
        ConfigurationService.prototype.hasWorkspaceConfiguration = function () {
            return !!this.workspaceFilePathToConfiguration['.vscode/' + model.CONFIG_DEFAULT_NAME + '.json'];
        };
        ConfigurationService.prototype.loadWorkspaceConfiguration = function (section) {
            var _this = this;
            // once: when invoked for the first time we fetch *all* json
            // files using the bulk stats and content routes
            if (!this.bulkFetchFromWorkspacePromise) {
                this.bulkFetchFromWorkspacePromise = this.resolveStat(this.contextService.toResource(this.workspaceSettingsRootFolder)).then(function (stat) {
                    if (!stat.isDirectory) {
                        return winjs.TPromise.as([]);
                    }
                    return _this.resolveContents(stat.children.filter(function (stat) { return paths.extname(stat.resource.fsPath) === '.json'; }).map(function (stat) { return stat.resource; }));
                }, function (err) {
                    if (err) {
                        return []; // never fail this call
                    }
                }).then(function (contents) {
                    contents.forEach(function (content) { return _this.workspaceFilePathToConfiguration[_this.contextService.toWorkspaceRelativePath(content.resource)] = winjs.TPromise.as(model.newConfigFile(content.value)); });
                }, errors.onUnexpectedError);
            }
            // on change: join on *all* configuration file promises so that
            // we can merge them into a single configuration object. this
            // happens whenever a config file changes, is deleted, or added
            return this.bulkFetchFromWorkspacePromise.then(function () {
                return winjs.TPromise.join(_this.workspaceFilePathToConfiguration);
            });
        };
        ConfigurationService.prototype.reloadAndEmit = function () {
            var _this = this;
            return this.reloadConfiguration().then(function (config) { return _this.emit(configuration_1.ConfigurationServiceEventTypes.UPDATED, { config: config }); });
        };
        ConfigurationService.prototype.reloadConfiguration = function (section) {
            this.loadConfigurationPromise = null;
            return this.loadConfiguration(section);
        };
        ConfigurationService.prototype.handleFileEvents = function (event) {
            var events = event.changes;
            var affectedByChanges = false;
            for (var i = 0, len = events.length; i < len; i++) {
                var workspacePath = this.contextService.toWorkspaceRelativePath(events[i].resource);
                if (!workspacePath) {
                    continue; // event is not inside workspace
                }
                // Handle case where ".vscode" got deleted
                if (workspacePath === this.workspaceSettingsRootFolder && events[i].type === Files.FileChangeType.DELETED) {
                    this.workspaceFilePathToConfiguration = Object.create(null);
                    affectedByChanges = true;
                }
                // outside my folder or not a *.json file
                if (paths.extname(workspacePath) !== '.json' || !paths.isEqualOrParent(workspacePath, this.workspaceSettingsRootFolder)) {
                    continue;
                }
                // insert 'fetch-promises' for add and update events and
                // remove promises for delete events
                switch (events[i].type) {
                    case Files.FileChangeType.DELETED:
                        affectedByChanges = collections.remove(this.workspaceFilePathToConfiguration, workspacePath);
                        break;
                    case Files.FileChangeType.UPDATED:
                    case Files.FileChangeType.ADDED:
                        this.workspaceFilePathToConfiguration[workspacePath] = this.resolveContent(events[i].resource).then(function (content) { return model.newConfigFile(content.value); }, errors.onUnexpectedError);
                        affectedByChanges = true;
                }
            }
            if (affectedByChanges) {
                this.reloadAndEmit();
            }
        };
        return ConfigurationService;
    }(eventEmitter.EventEmitter));
    exports.ConfigurationService = ConfigurationService;
});

define("vs/platform/extensions/node/extensionValidator", ["require", "exports", 'vs/nls!vs/platform/extensions/node/extensionValidator', 'vs/platform/extensions/common/extensionsRegistry', 'semver'], function (require, exports, nls, extensionsRegistry_1, semver_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var VERSION_REGEXP = /^(\^)?((\d+)|x)\.((\d+)|x)\.((\d+)|x)(\-.*)?$/;
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
            hasCaret: !!m[1],
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
            patchMustEqual: patchMustEqual
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
        var desiredVersion = normalizeVersion(parseVersion(extensionDesc.engines.vscode));
        if (!desiredVersion) {
            notices.push(nls.localize(0, null, extensionDesc.engines.vscode));
            return false;
        }
        // enforce that a breaking API version is specified.
        // for 0.X.Y, that means up to 0.X must be specified
        // otherwise for Z.X.Y, that means Z must be specified
        if (desiredVersion.majorBase === 0) {
            // force that major and minor must be specific
            if (!desiredVersion.majorMustEqual || !desiredVersion.minorMustEqual) {
                notices.push(nls.localize(1, null, extensionDesc.engines.vscode));
                return false;
            }
        }
        else {
            // force that major must be specific
            if (!desiredVersion.majorMustEqual) {
                notices.push(nls.localize(2, null, extensionDesc.engines.vscode));
                return false;
            }
        }
        if (!isValidVersion(version, desiredVersion)) {
            notices.push(nls.localize(3, null, version, extensionDesc.engines.vscode));
            return false;
        }
        return true;
    }
    exports.isValidExtensionVersion = isValidExtensionVersion;
    function isValidExtensionDescription(version, extensionFolderPath, extensionDescription, notices) {
        if (!extensionsRegistry_1.isValidExtensionDescription(extensionFolderPath, extensionDescription, notices)) {
            return false;
        }
        if (!semver_1.valid(extensionDescription.version)) {
            notices.push(nls.localize(4, null));
            return false;
        }
        return isValidExtensionVersion(version, extensionDescription, notices);
    }
    exports.isValidExtensionDescription = isValidExtensionDescription;
});

define("vs/platform/request/common/request", ["require", "exports", 'vs/platform/instantiation/common/instantiation'], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IRequestService = instantiation_1.createDecorator('requestService');
});

define("vs/platform/request/common/baseRequestService", ["require", "exports", 'vs/base/common/uri', 'vs/base/common/strings', 'vs/base/common/timer', 'vs/base/common/async', 'vs/base/common/winjs.base', 'vs/base/common/objects', 'vs/platform/request/common/request'], function (require, exports, uri_1, strings, Timer, Async, winjs, objects, request_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * Simple IRequestService implementation to allow sharing of this service implementation
     * between different layers of the platform.
     */
    var BaseRequestService = (function () {
        function BaseRequestService(contextService, telemetryService) {
            this.serviceId = request_1.IRequestService;
            var workspaceUri = null;
            var workspace = contextService.getWorkspace();
            this._serviceMap = workspace || Object.create(null);
            this._telemetryService = telemetryService;
            if (workspace) {
                workspaceUri = strings.rtrim(workspace.resource.toString(), '/') + '/';
            }
            this.computeOrigin(workspaceUri);
        }
        BaseRequestService.prototype.computeOrigin = function (workspaceUri) {
            if (workspaceUri) {
                // Find root server URL from configuration
                this._origin = workspaceUri;
                var urlPath = uri_1.default.parse(this._origin).path;
                if (urlPath && urlPath.length > 0) {
                    this._origin = this._origin.substring(0, this._origin.length - urlPath.length + 1);
                }
                if (!strings.endsWith(this._origin, '/')) {
                    this._origin += '/';
                }
            }
            else {
                this._origin = '/'; // Configuration not provided, fallback to default
            }
        };
        BaseRequestService.prototype.makeCrossOriginRequest = function (options) {
            return null;
        };
        BaseRequestService.prototype.makeRequest = function (options) {
            var timer = Timer.nullEvent;
            var isXhrRequestCORS = false;
            var url = options.url;
            if (!url) {
                throw new Error('IRequestService.makeRequest: Url is required');
            }
            if ((strings.startsWith(url, 'http://') || strings.startsWith(url, 'https://')) && this._origin && !strings.startsWith(url, this._origin)) {
                var coPromise = this.makeCrossOriginRequest(options);
                if (coPromise) {
                    return coPromise;
                }
                isXhrRequestCORS = true;
            }
            var xhrOptions = options;
            if (!isXhrRequestCORS) {
                var additionalHeaders = {};
                if (this._telemetryService) {
                    additionalHeaders['X-TelemetrySession'] = this._telemetryService.getSessionId();
                }
                additionalHeaders['X-Requested-With'] = 'XMLHttpRequest';
                xhrOptions.headers = objects.mixin(xhrOptions.headers, additionalHeaders);
            }
            if (options.timeout) {
                xhrOptions.customRequestInitializer = function (xhrRequest) {
                    xhrRequest.timeout = options.timeout;
                };
            }
            return Async.always(winjs.xhr(xhrOptions), (function (xhr) {
                if (timer.data) {
                    timer.data.status = xhr.status;
                }
                timer.stop();
            }));
        };
        return BaseRequestService;
    }());
    exports.BaseRequestService = BaseRequestService;
});

define("vs/platform/workspace/common/workspace", ["require", "exports", 'vs/platform/instantiation/common/instantiation'], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IWorkspaceContextService = instantiation_1.createDecorator('contextService');
});

define("vs/platform/workspace/common/baseWorkspaceContextService", ["require", "exports", 'vs/base/common/uri', 'vs/base/common/paths', './workspace'], function (require, exports, uri_1, paths, workspace_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * Simple IWorkspaceContextService implementation to allow sharing of this service implementation
     * between different layers of the platform.
     */
    var BaseWorkspaceContextService = (function () {
        function BaseWorkspaceContextService(workspace, configuration, options) {
            if (options === void 0) { options = {}; }
            this.serviceId = workspace_1.IWorkspaceContextService;
            this.workspace = workspace;
            this.configuration = configuration;
            this.options = options;
        }
        BaseWorkspaceContextService.prototype.getWorkspace = function () {
            return this.workspace;
        };
        BaseWorkspaceContextService.prototype.getConfiguration = function () {
            return this.configuration;
        };
        BaseWorkspaceContextService.prototype.getOptions = function () {
            return this.options;
        };
        BaseWorkspaceContextService.prototype.isInsideWorkspace = function (resource) {
            if (resource && this.workspace) {
                return paths.isEqualOrParent(resource.fsPath, this.workspace.resource.fsPath);
            }
            return false;
        };
        BaseWorkspaceContextService.prototype.toWorkspaceRelativePath = function (resource) {
            if (this.isInsideWorkspace(resource)) {
                return paths.normalize(paths.relative(this.workspace.resource.fsPath, resource.fsPath));
            }
            return null;
        };
        BaseWorkspaceContextService.prototype.toResource = function (workspaceRelativePath) {
            if (typeof workspaceRelativePath === 'string' && this.workspace) {
                return uri_1.default.file(paths.join(this.workspace.resource.fsPath, workspaceRelativePath));
            }
            return null;
        };
        return BaseWorkspaceContextService;
    }());
    exports.BaseWorkspaceContextService = BaseWorkspaceContextService;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/workbench/common/events", ["require", "exports", 'vs/base/common/events'], function (require, exports, events_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * All workbench events are listed here. For DOM events, see Monaco.Base.DomUtils.EventType.
     */
    var EventType = (function () {
        function EventType() {
        }
        /**
         * Event type for when an editor is opened. This event is only sent once for a specific editor type until another
         * editor type gets opened. For example, when the user opens a file, the editorOpened event will be sent. If another
         * file is opened, this event will not be fired again. If the user opens, e.g. the diff editor, editorOpened will be
         * fired, since another editor type opened.
         */
        EventType.EDITOR_OPENED = 'editorOpened';
        /**
         * Event type for when an editor is closed because another editor type is opened.
         */
        EventType.EDITOR_CLOSED = 'editorClosed';
        /**
         * Event to indciate that an editor input is about to open. This event can be prevented to do something else instead.
         */
        EventType.EDITOR_INPUT_OPENING = 'editorInputOpening';
        /**
         * Event type for when the editor input is about to change. This event is being sent before (!) the input is being set
         * to the active editor. Use EDITOR_INPUT_CHANGED to react after the input has been set and displayed by the editor.
         *
         * Note: This event will also be emitted when multiple editors are open and the user sets focus from the active editor
         * to another one. This allows to detect a focus change of the active editor.
         */
        EventType.EDITOR_INPUT_CHANGING = 'editorInputChanging';
        /**
         * Event type to indicate that the editor options of the current active editor are changing.
         */
        EventType.EDITOR_OPTIONS_CHANGING = 'editorOptionsChanging';
        /**
         * Event type for when the editor input has been changed in the currently active editor. This event is being sent after
         * the input has been set and displayed by the editor.
         *
         * Note: This event will also be emitted when multiple editors are open and the user sets focus from the active editor
         * to another one. This allows to detect a focus change of the active editor.
         */
        EventType.EDITOR_INPUT_CHANGED = 'editorInputChanged';
        /**
         * Event type for when the editor input state changed.
         */
        EventType.EDITOR_INPUT_STATE_CHANGED = 'editorInputStateChanged';
        /**
         * Event type for when the editor input failed to be set to the editor.
         */
        EventType.EDITOR_SET_INPUT_ERROR = 'editorSetInputError';
        /**
         * Event type for when the editor position has been changed
         */
        EventType.EDITOR_POSITION_CHANGED = 'editorPositionChanged';
        /**
         * An event type that fires when a text editor changes its selection.
         */
        EventType.TEXT_EDITOR_SELECTION_CHANGED = 'textEditorSelectionChanged';
        /**
         * An event type that fires when a text editor mode changes.
         */
        EventType.TEXT_EDITOR_MODE_CHANGED = 'textEditorModeChanged';
        /**
         * An event type that fires when a text editor content changes.
         */
        EventType.TEXT_EDITOR_CONTENT_CHANGED = 'textEditorContentChanged';
        /**
         * An event type that fires when a text editor content options changed.
         */
        EventType.TEXT_EDITOR_CONTENT_OPTIONS_CHANGED = 'textEditorContentOptionsChanged';
        /**
         * An event type that fires when a text editor's configuration changes.
         */
        EventType.TEXT_EDITOR_CONFIGURATION_CHANGED = 'textEditorOptionsChanged';
        /**
         * Event type for when a composite is about to open.
         */
        EventType.COMPOSITE_OPENING = 'compositeOpening';
        /**
         * Event type for when a composite is opened.
         */
        EventType.COMPOSITE_OPENED = 'compositeOpened';
        /**
         * Event type for when a composite is closed.
         */
        EventType.COMPOSITE_CLOSED = 'compositeClosed';
        /**
         * Event type for when the workbench has been fully created.
         */
        EventType.WORKBENCH_CREATED = 'workbenchCreated';
        /**
         * Event type for when the workbench is about to being disposed.
         */
        EventType.WORKBENCH_DISPOSING = 'workbenchDisposing';
        /**
         * Event type for when the workbench is fully disposed.
         */
        EventType.WORKBENCH_DISPOSED = 'workbenchDisposed';
        /**
         * Event type for when an untitled file is becoming dirty.
         */
        EventType.UNTITLED_FILE_DIRTY = 'untitledFileDirty';
        /**
         * Event type for when an untitled file is deleted.
         */
        EventType.UNTITLED_FILE_DELETED = 'untitledFileDeleted';
        /**
         * Event type for when a resources encoding changes.
         */
        EventType.RESOURCE_ENCODING_CHANGED = 'resourceEncodingChanged';
        /**
         * Event type for when the workbench options change. Listeners should refresh their
         * assumption on workbench options after this event is emitted.
         */
        EventType.WORKBENCH_OPTIONS_CHANGED = 'workbenchOptionsChanged';
        return EventType;
    }());
    exports.EventType = EventType;
    /**
     * Editor events are being emitted when the editor input changes, shows, is being saved or when the editor content changes.
     */
    var EditorEvent = (function (_super) {
        __extends(EditorEvent, _super);
        function EditorEvent(editor, editorId, editorInput, editorOptions, position, originalEvent) {
            _super.call(this, originalEvent);
            this.editor = editor;
            this.editorId = editorId;
            this.editorInput = editorInput;
            this.editorOptions = editorOptions;
            this.position = position;
        }
        EditorEvent.prototype.prevent = function () {
            this.prevented = true;
        };
        EditorEvent.prototype.isPrevented = function () {
            return this.prevented;
        };
        return EditorEvent;
    }(events_1.Event));
    exports.EditorEvent = EditorEvent;
    /**
     * Editor input events are being emitted when the editor input state changes.
     */
    var EditorInputEvent = (function (_super) {
        __extends(EditorInputEvent, _super);
        function EditorInputEvent(editorInput, originalEvent) {
            _super.call(this, originalEvent);
            this.editorInput = editorInput;
        }
        return EditorInputEvent;
    }(events_1.Event));
    exports.EditorInputEvent = EditorInputEvent;
    /**
     * A subclass of EditorEvent for text editor selection changes.
     */
    var TextEditorSelectionEvent = (function (_super) {
        __extends(TextEditorSelectionEvent, _super);
        function TextEditorSelectionEvent(selection, editor, editorId, editorInput, editorOptions, position, originalEvent) {
            _super.call(this, editor, editorId, editorInput, editorOptions, position, originalEvent);
            this.selection = selection;
        }
        return TextEditorSelectionEvent;
    }(EditorEvent));
    exports.TextEditorSelectionEvent = TextEditorSelectionEvent;
    /**
     * Option change events are send when the options in the running instance change.
     */
    var OptionsChangeEvent = (function (_super) {
        __extends(OptionsChangeEvent, _super);
        function OptionsChangeEvent(key, before, after, originalEvent) {
            _super.call(this, originalEvent);
            this.key = key;
            this.before = before;
            this.after = after;
        }
        return OptionsChangeEvent;
    }(events_1.Event));
    exports.OptionsChangeEvent = OptionsChangeEvent;
    /**
     * Command events are emitted when an action is being executed through a command handler (Keybinding).
     */
    var CommandEvent = (function (_super) {
        __extends(CommandEvent, _super);
        function CommandEvent(actionId, originalEvent) {
            _super.call(this, originalEvent);
            this.actionId = actionId;
        }
        return CommandEvent;
    }(events_1.Event));
    exports.CommandEvent = CommandEvent;
    /**
     * Composite events are emitted when a composite opens or closes in the sidebar or panel.
     */
    var CompositeEvent = (function (_super) {
        __extends(CompositeEvent, _super);
        function CompositeEvent(compositeId, originalEvent) {
            _super.call(this, originalEvent);
            this.compositeId = compositeId;
        }
        return CompositeEvent;
    }(events_1.Event));
    exports.CompositeEvent = CompositeEvent;
    var ResourceEvent = (function (_super) {
        __extends(ResourceEvent, _super);
        function ResourceEvent(resource, originalEvent) {
            _super.call(this, originalEvent);
            this.resource = resource;
        }
        return ResourceEvent;
    }(events_1.Event));
    exports.ResourceEvent = ResourceEvent;
    var UntitledEditorEvent = (function (_super) {
        __extends(UntitledEditorEvent, _super);
        function UntitledEditorEvent() {
            _super.apply(this, arguments);
        }
        return UntitledEditorEvent;
    }(ResourceEvent));
    exports.UntitledEditorEvent = UntitledEditorEvent;
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
define("vs/workbench/parts/extensions/common/extensions", ["require", "exports", 'vs/nls!vs/workbench/parts/extensions/common/extensions', 'vs/platform/instantiation/common/instantiation'], function (require, exports, nls, instantiation_1) {
    'use strict';
    exports.IExtensionsService = instantiation_1.createDecorator('extensionsService');
    exports.IGalleryService = instantiation_1.createDecorator('galleryService');
    exports.IExtensionTipsService = instantiation_1.createDecorator('extensionTipsService');
    exports.ExtensionsLabel = nls.localize(0, null);
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
define("vs/workbench/services/configuration/node/configurationService", ["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/uri', 'vs/base/common/strings', 'vs/base/common/platform', 'vs/base/common/paths', 'vs/base/node/extfs', 'vs/base/common/objects', 'vs/platform/configuration/common/configurationService', 'vs/workbench/common/events', 'vs/platform/configuration/common/configuration', 'fs'], function (require, exports, winjs_base_1, uri_1, strings, platform, paths, extfs, objects, configurationService_1, events_1, configuration_1, fs) {
    'use strict';
    var ConfigurationService = (function (_super) {
        __extends(ConfigurationService, _super);
        function ConfigurationService(contextService, eventService) {
            _super.call(this, contextService, eventService);
            this.serviceId = configuration_1.IConfigurationService;
            this.registerListeners();
        }
        ConfigurationService.prototype.resolveContents = function (resources) {
            var _this = this;
            var contents = [];
            return winjs_base_1.TPromise.join(resources.map(function (resource) {
                return _this.resolveContent(resource).then(function (content) {
                    contents.push(content);
                });
            })).then(function () { return contents; });
        };
        ConfigurationService.prototype.resolveContent = function (resource) {
            return new winjs_base_1.TPromise(function (c, e) {
                fs.readFile(resource.fsPath, function (error, contents) {
                    if (error) {
                        e(error);
                    }
                    else {
                        c({
                            resource: resource,
                            value: contents.toString()
                        });
                    }
                });
            });
        };
        ConfigurationService.prototype.resolveStat = function (resource) {
            return new winjs_base_1.TPromise(function (c, e) {
                extfs.readdir(resource.fsPath, function (error, children) {
                    if (error) {
                        if (error.code === 'ENOTDIR') {
                            c({
                                resource: resource,
                                isDirectory: false
                            });
                        }
                        else {
                            e(error);
                        }
                    }
                    else {
                        c({
                            resource: resource,
                            isDirectory: true,
                            children: children.map(function (child) {
                                if (platform.isMacintosh) {
                                    child = strings.normalizeNFC(child); // Mac: uses NFD unicode form on disk, but we want NFC
                                }
                                return {
                                    resource: uri_1.default.file(paths.join(resource.fsPath, child))
                                };
                            })
                        });
                    }
                });
            });
        };
        ConfigurationService.prototype.registerListeners = function () {
            var _this = this;
            this.toDispose = this.eventService.addListener(events_1.EventType.WORKBENCH_OPTIONS_CHANGED, function (e) { return _this.onOptionsChanged(e); });
        };
        ConfigurationService.prototype.onOptionsChanged = function (e) {
            if (e.key === 'globalSettings') {
                this.reloadAndEmit();
            }
        };
        ConfigurationService.prototype.loadWorkspaceConfiguration = function (section) {
            // Return early if we don't have a workspace
            if (!this.contextService.getWorkspace()) {
                return winjs_base_1.TPromise.as({});
            }
            // Migrate as needed (.settings => .vscode)
            return _super.prototype.loadWorkspaceConfiguration.call(this, section);
        };
        ConfigurationService.prototype.loadGlobalConfiguration = function () {
            var _this = this;
            return _super.prototype.loadGlobalConfiguration.call(this).then(function (defaults) {
                var globalSettings = _this.contextService.getOptions().globalSettings;
                return {
                    contents: objects.mixin(objects.clone(defaults.contents), // target: default values (but don't modify!)
                    globalSettings.settings, // source: global configured values
                    true // overwrite
                    ),
                    parseErrors: globalSettings.settingsParseErrors
                };
            });
        };
        ConfigurationService.prototype.dispose = function () {
            this.toDispose();
        };
        return ConfigurationService;
    }(configurationService_1.ConfigurationService));
    exports.ConfigurationService = ConfigurationService;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/workbench/services/workspace/common/contextService", ["require", "exports", 'vs/workbench/common/events', 'vs/platform/instantiation/common/instantiation', 'vs/platform/workspace/common/baseWorkspaceContextService'], function (require, exports, events_1, instantiation_1, baseWorkspaceContextService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IWorkspaceContextService = instantiation_1.createDecorator('contextService');
    var WorkspaceContextService = (function (_super) {
        __extends(WorkspaceContextService, _super);
        function WorkspaceContextService(eventService, workspace, configuration, options) {
            if (options === void 0) { options = {}; }
            _super.call(this, workspace, configuration, options);
            this.eventService = eventService;
            this.serviceId = exports.IWorkspaceContextService;
        }
        WorkspaceContextService.prototype.updateOptions = function (key, value) {
            var oldValue = this.options[key];
            this.options[key] = value;
            this.eventService.emit(events_1.EventType.WORKBENCH_OPTIONS_CHANGED, new events_1.OptionsChangeEvent(key, oldValue, value));
        };
        return WorkspaceContextService;
    }(baseWorkspaceContextService_1.BaseWorkspaceContextService));
    exports.WorkspaceContextService = WorkspaceContextService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/node/zip", ["require", "exports", 'vs/nls!vs/base/node/zip', 'path', 'fs', 'vs/base/common/async', 'vs/base/node/pfs', 'vs/base/common/winjs.base', 'yauzl'], function (require, exports, nls, path, fs_1, async_1, pfs_1, winjs_base_1, yauzl_1) {
    "use strict";
    function modeFromEntry(entry) {
        var attr = entry.externalFileAttributes >> 16 || 33188;
        return [448 /* S_IRWXU */, 56 /* S_IRWXG */, 7 /* S_IRWXO */]
            .map(function (mask) { return attr & mask; })
            .reduce(function (a, b) { return a + b; }, attr & 61440 /* S_IFMT */);
    }
    function extractEntry(zipfile, entry, targetPath, options) {
        var fileName = entry.fileName.replace(options.sourcePathRegex, '');
        var dirName = path.dirname(fileName);
        var targetDirName = path.join(targetPath, dirName);
        var targetFileName = path.join(targetPath, fileName);
        var mode = modeFromEntry(entry);
        return async_1.ninvoke(zipfile, zipfile.openReadStream, entry)
            .then(function (ostream) { return pfs_1.mkdirp(targetDirName)
            .then(function () { return new winjs_base_1.Promise(function (c, e) {
            var istream = fs_1.createWriteStream(targetFileName, { mode: mode });
            istream.once('finish', function () { return c(null); });
            istream.once('error', e);
            ostream.once('error', e);
            ostream.pipe(istream);
        }); }); });
    }
    function extractZip(zipfile, targetPath, options) {
        return new winjs_base_1.Promise(function (c, e) {
            var promises = [];
            zipfile.once('error', e);
            zipfile.on('entry', function (entry) {
                if (!options.sourcePathRegex.test(entry.fileName)) {
                    return;
                }
                promises.push(extractEntry(zipfile, entry, targetPath, options));
            });
            zipfile.once('close', function () { return winjs_base_1.Promise.join(promises).done(c, e); });
        });
    }
    function extract(zipPath, targetPath, options) {
        var sourcePathRegex = new RegExp(options.sourcePath ? "^" + options.sourcePath : '');
        var promise = async_1.nfcall(yauzl_1.open, zipPath);
        if (options.overwrite) {
            promise = promise.then(function (zipfile) { pfs_1.rimraf(targetPath); return zipfile; });
        }
        return promise.then(function (zipfile) { return extractZip(zipfile, targetPath, { sourcePathRegex: sourcePathRegex }); });
    }
    exports.extract = extract;
    function read(zipPath, filePath) {
        return async_1.nfcall(yauzl_1.open, zipPath).then(function (zipfile) {
            return new winjs_base_1.TPromise(function (c, e) {
                zipfile.on('entry', function (entry) {
                    if (entry.fileName === filePath) {
                        async_1.ninvoke(zipfile, zipfile.openReadStream, entry).done(function (stream) { return c(stream); }, function (err) { return e(err); });
                    }
                });
                zipfile.once('close', function () { return e(new Error(nls.localize(0, null, filePath))); });
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define("vs/workbench/parts/extensions/node/extensionsService", ["require", "exports", 'vs/nls!vs/workbench/parts/extensions/node/extensionsService', 'os', 'path', 'vs/base/common/types', 'vs/base/common/service', 'vs/base/node/pfs', 'vs/base/common/objects', 'vs/base/common/arrays', 'vs/base/node/zip', 'vs/base/common/winjs.base', 'vs/workbench/parts/extensions/common/extensions', 'vs/base/node/request', 'vs/base/node/proxy', 'vs/workbench/services/workspace/common/contextService', 'vs/base/common/async', 'vs/base/common/event', 'vs/workbench/node/userSettings', 'semver', 'vs/base/common/collections', 'vs/platform/extensions/node/extensionValidator'], function (require, exports, nls, os_1, path, types, service_1, pfs, objects_1, arrays_1, zip_1, winjs_base_1, extensions_1, request_1, proxy_1, contextService_1, async_1, event_1, userSettings_1, semver, collections_1, extensionValidator_1) {
    'use strict';
    function parseManifest(raw) {
        return new winjs_base_1.Promise(function (c, e) {
            try {
                c(JSON.parse(raw));
            }
            catch (err) {
                e(new Error(nls.localize(0, null)));
            }
        });
    }
    function validate(zipPath, extension, version) {
        if (version === void 0) { version = extension && extension.version; }
        return zip_1.buffer(zipPath, 'extension/package.json')
            .then(function (buffer) { return parseManifest(buffer.toString('utf8')); })
            .then(function (manifest) {
            if (extension) {
                if (extension.name !== manifest.name) {
                    return winjs_base_1.Promise.wrapError(Error(nls.localize(1, null)));
                }
                if (extension.publisher !== manifest.publisher) {
                    return winjs_base_1.Promise.wrapError(Error(nls.localize(2, null)));
                }
                if (version !== manifest.version) {
                    return winjs_base_1.Promise.wrapError(Error(nls.localize(3, null)));
                }
            }
            return winjs_base_1.TPromise.as(manifest);
        });
    }
    function createExtension(manifest, galleryInformation, path) {
        var extension = {
            name: manifest.name,
            displayName: manifest.displayName || manifest.name,
            publisher: manifest.publisher,
            version: manifest.version,
            engines: { vscode: manifest.engines.vscode },
            description: manifest.description || ''
        };
        if (galleryInformation) {
            extension.galleryInformation = galleryInformation;
        }
        if (path) {
            extension.path = path;
        }
        return extension;
    }
    function getExtensionId(extension, version) {
        if (version === void 0) { version = extension.version; }
        return extension.publisher + "." + extension.name + "-" + version;
    }
    var ExtensionsService = (function () {
        function ExtensionsService(contextService) {
            this.contextService = contextService;
            this.serviceId = extensions_1.IExtensionsService;
            this._onInstallExtension = new event_1.Emitter();
            this.onInstallExtension = this._onInstallExtension.event;
            this._onDidInstallExtension = new event_1.Emitter();
            this.onDidInstallExtension = this._onDidInstallExtension.event;
            this._onUninstallExtension = new event_1.Emitter();
            this.onUninstallExtension = this._onUninstallExtension.event;
            this._onDidUninstallExtension = new event_1.Emitter();
            this.onDidUninstallExtension = this._onDidUninstallExtension.event;
            var env = contextService.getConfiguration().env;
            this.extensionsPath = env.userExtensionsHome;
            this.obsoletePath = path.join(this.extensionsPath, '.obsolete');
            this.obsoleteFileLimiter = new async_1.Limiter(1);
        }
        ExtensionsService.prototype.install = function (arg) {
            var _this = this;
            if (types.isString(arg)) {
                return this.installFromZip(arg);
            }
            var extension = arg;
            return this.isObsolete(extension).then(function (obsolete) {
                if (obsolete) {
                    return winjs_base_1.TPromise.wrapError(new Error(nls.localize(4, null, extension.name)));
                }
                return _this.installFromGallery(arg);
            });
        };
        ExtensionsService.prototype.installFromGallery = function (extension) {
            var _this = this;
            var galleryInformation = extension.galleryInformation;
            if (!galleryInformation) {
                return winjs_base_1.TPromise.wrapError(new Error(nls.localize(5, null)));
            }
            this._onInstallExtension.fire(extension);
            return this.getLastValidExtensionVersion(extension, extension.galleryInformation.versions).then(function (versionInfo) {
                var version = versionInfo.version;
                var url = versionInfo.downloadUrl;
                var headers = versionInfo.downloadHeaders;
                var zipPath = path.join(os_1.tmpdir(), galleryInformation.id);
                var extensionPath = path.join(_this.extensionsPath, getExtensionId(extension, version));
                var manifestPath = path.join(extensionPath, 'package.json');
                return _this.request(url)
                    .then(function (opts) { return objects_1.assign(opts, { headers: headers }); })
                    .then(function (opts) { return request_1.download(zipPath, opts); })
                    .then(function () { return validate(zipPath, extension, version); })
                    .then(function (manifest) { return zip_1.extract(zipPath, extensionPath, { sourcePath: 'extension', overwrite: true }).then(function () { return manifest; }); })
                    .then(function (manifest) { return objects_1.assign({ __metadata: galleryInformation }, manifest); })
                    .then(function (manifest) { return pfs.writeFile(manifestPath, JSON.stringify(manifest, null, '\t')); })
                    .then(function () { _this._onDidInstallExtension.fire({ extension: extension }); return extension; })
                    .then(null, function (error) { _this._onDidInstallExtension.fire({ extension: extension, error: error }); return winjs_base_1.TPromise.wrapError(error); });
            });
        };
        ExtensionsService.prototype.getLastValidExtensionVersion = function (extension, versions) {
            var _this = this;
            if (!versions.length) {
                return winjs_base_1.TPromise.wrapError(new Error(nls.localize(6, null, extension.displayName)));
            }
            var version = versions[0];
            return this.request(version.manifestUrl)
                .then(function (opts) { return request_1.json(opts); })
                .then(function (manifest) {
                var codeVersion = _this.contextService.getConfiguration().env.version;
                var desc = {
                    isBuiltin: false,
                    engines: { vscode: manifest.engines.vscode },
                    main: manifest.main
                };
                if (!extensionValidator_1.isValidExtensionVersion(codeVersion, desc, [])) {
                    return _this.getLastValidExtensionVersion(extension, versions.slice(1));
                }
                return version;
            });
        };
        ExtensionsService.prototype.installFromZip = function (zipPath) {
            var _this = this;
            return validate(zipPath).then(function (manifest) {
                var extensionPath = path.join(_this.extensionsPath, getExtensionId(manifest));
                _this._onInstallExtension.fire(manifest);
                return zip_1.extract(zipPath, extensionPath, { sourcePath: 'extension', overwrite: true })
                    .then(function () { return createExtension(manifest, manifest.__metadata, extensionPath); })
                    .then(function (extension) { _this._onDidInstallExtension.fire({ extension: extension }); return extension; });
            });
        };
        ExtensionsService.prototype.uninstall = function (extension) {
            var _this = this;
            var extensionPath = extension.path || path.join(this.extensionsPath, getExtensionId(extension));
            return pfs.exists(extensionPath)
                .then(function (exists) { return exists ? null : winjs_base_1.Promise.wrapError(new Error(nls.localize(7, null))); })
                .then(function () { return _this._onUninstallExtension.fire(extension); })
                .then(function () { return _this.setObsolete(extension); })
                .then(function () { return pfs.rimraf(extensionPath); })
                .then(function () { return _this.unsetObsolete(extension); })
                .then(function () { return _this._onDidUninstallExtension.fire(extension); });
        };
        ExtensionsService.prototype.getInstalled = function (includeDuplicateVersions) {
            if (includeDuplicateVersions === void 0) { includeDuplicateVersions = false; }
            var all = this.getAllInstalled();
            if (includeDuplicateVersions) {
                return all;
            }
            return all.then(function (extensions) {
                var byId = collections_1.values(collections_1.groupBy(extensions, function (p) { return (p.publisher + "." + p.name); }));
                return byId.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.version, b.version); })[0]; });
            });
        };
        ExtensionsService.prototype.getAllInstalled = function () {
            var _this = this;
            var limiter = new async_1.Limiter(10);
            return this.getObsoleteExtensions()
                .then(function (obsolete) {
                return pfs.readdir(_this.extensionsPath)
                    .then(function (extensions) { return extensions.filter(function (e) { return !obsolete[e]; }); })
                    .then(function (extensions) { return winjs_base_1.Promise.join(extensions.map(function (e) {
                    var extensionPath = path.join(_this.extensionsPath, e);
                    return limiter.queue(function () { return pfs.readFile(path.join(extensionPath, 'package.json'), 'utf8')
                        .then(function (raw) { return parseManifest(raw); })
                        .then(function (manifest) { return createExtension(manifest, manifest.__metadata, extensionPath); })
                        .then(null, function () { return null; }); });
                })); })
                    .then(function (result) { return result.filter(function (a) { return !!a; }); });
            });
        };
        ExtensionsService.prototype.removeDeprecatedExtensions = function () {
            var _this = this;
            var outdated = this.getOutdatedExtensions()
                .then(function (extensions) { return extensions.map(function (e) { return getExtensionId(e); }); });
            var obsolete = this.getObsoleteExtensions()
                .then(function (obsolete) { return Object.keys(obsolete); });
            return winjs_base_1.TPromise.join([outdated, obsolete])
                .then(function (result) { return arrays_1.flatten(result); })
                .then(function (extensionsIds) {
                return winjs_base_1.TPromise.join(extensionsIds.map(function (id) {
                    return pfs.rimraf(path.join(_this.extensionsPath, id))
                        .then(function () { return _this.withObsoleteExtensions(function (obsolete) { return delete obsolete[id]; }); });
                }));
            });
        };
        ExtensionsService.prototype.getOutdatedExtensions = function () {
            return this.getAllInstalled().then(function (plugins) {
                var byId = collections_1.values(collections_1.groupBy(plugins, function (p) { return (p.publisher + "." + p.name); }));
                var extensions = arrays_1.flatten(byId.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.version, b.version); }).slice(1); }));
                return extensions
                    .filter(function (e) { return !!e.path; });
            });
        };
        ExtensionsService.prototype.isObsolete = function (extension) {
            var id = getExtensionId(extension);
            return this.withObsoleteExtensions(function (obsolete) { return !!obsolete[id]; });
        };
        ExtensionsService.prototype.setObsolete = function (extension) {
            var id = getExtensionId(extension);
            return this.withObsoleteExtensions(function (obsolete) { return objects_1.assign(obsolete, (_a = {}, _a[id] = true, _a)); var _a; });
        };
        ExtensionsService.prototype.unsetObsolete = function (extension) {
            var id = getExtensionId(extension);
            return this.withObsoleteExtensions(function (obsolete) { return delete obsolete[id]; });
        };
        ExtensionsService.prototype.getObsoleteExtensions = function () {
            return this.withObsoleteExtensions(function (obsolete) { return obsolete; });
        };
        ExtensionsService.prototype.withObsoleteExtensions = function (fn) {
            var _this = this;
            return this.obsoleteFileLimiter.queue(function () {
                var result = null;
                return pfs.readFile(_this.obsoletePath, 'utf8')
                    .then(null, function (err) { return err.code === 'ENOENT' ? winjs_base_1.TPromise.as('{}') : winjs_base_1.TPromise.wrapError(err); })
                    .then(function (raw) { return JSON.parse(raw); })
                    .then(function (obsolete) { result = fn(obsolete); return obsolete; })
                    .then(function (obsolete) {
                    if (Object.keys(obsolete).length === 0) {
                        return pfs.rimraf(_this.obsoletePath);
                    }
                    else {
                        var raw = JSON.stringify(obsolete);
                        return pfs.writeFile(_this.obsoletePath, raw);
                    }
                })
                    .then(function () { return result; });
            });
        };
        // Helper for proxy business... shameful.
        // This should be pushed down and not rely on the context service
        ExtensionsService.prototype.request = function (url) {
            var settings = winjs_base_1.TPromise.join([
                userSettings_1.UserSettings.getValue(this.contextService, 'http.proxy'),
                userSettings_1.UserSettings.getValue(this.contextService, 'http.proxyStrictSSL')
            ]);
            return settings.then(function (settings) {
                var proxyUrl = settings[0];
                var strictSSL = settings[1];
                var agent = proxy_1.getProxyAgent(url, { proxyUrl: proxyUrl, strictSSL: strictSSL });
                return { url: url, agent: agent, strictSSL: strictSSL };
            });
        };
        __decorate([
            service_1.ServiceEvent
        ], ExtensionsService.prototype, "onInstallExtension", void 0);
        __decorate([
            service_1.ServiceEvent
        ], ExtensionsService.prototype, "onDidInstallExtension", void 0);
        __decorate([
            service_1.ServiceEvent
        ], ExtensionsService.prototype, "onUninstallExtension", void 0);
        __decorate([
            service_1.ServiceEvent
        ], ExtensionsService.prototype, "onDidUninstallExtension", void 0);
        ExtensionsService = __decorate([
            __param(0, contextService_1.IWorkspaceContextService)
        ], ExtensionsService);
        return ExtensionsService;
    }());
    exports.ExtensionsService = ExtensionsService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/services/request/node/rawHttpService", ["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/objects', 'vs/base/node/request', 'vs/base/node/proxy', 'zlib'], function (require, exports, winjs_base_1, objects_1, request_1, proxy_1, zlib_1) {
    'use strict';
    var proxyUrl = null;
    var strictSSL = true;
    function configure(_proxyUrl, _strictSSL) {
        proxyUrl = _proxyUrl;
        strictSSL = _strictSSL;
    }
    exports.configure = configure;
    function xhr(options) {
        var agent = proxy_1.getProxyAgent(options.url, { proxyUrl: proxyUrl, strictSSL: strictSSL });
        options = objects_1.assign({}, options);
        options = objects_1.assign(options, { agent: agent, strictSSL: strictSSL });
        return request_1.request(options).then(function (result) { return new winjs_base_1.TPromise(function (c, e, p) {
            var res = result.res;
            var stream = res;
            if (res.headers['content-encoding'] === 'gzip') {
                stream = stream.pipe(zlib_1.createGunzip());
            }
            var data = [];
            stream.on('data', function (c) { return data.push(c); });
            stream.on('end', function () {
                var status = res.statusCode;
                if (options.followRedirects > 0 && (status >= 300 && status <= 303 || status === 307)) {
                    var location_1 = res.headers['location'];
                    if (location_1) {
                        var newOptions = {
                            type: options.type, url: location_1, user: options.user, password: options.password, responseType: options.responseType, headers: options.headers,
                            timeout: options.timeout, followRedirects: options.followRedirects - 1, data: options.data
                        };
                        xhr(newOptions).done(c, e, p);
                        return;
                    }
                }
                var response = {
                    responseText: data.join(''),
                    status: status,
                    getResponseHeader: function (header) { return res.headers[header]; },
                    readyState: 4
                };
                if ((status >= 200 && status < 300) || status === 1223) {
                    c(response);
                }
                else {
                    e(response);
                }
            });
        }, function (err) {
            var message;
            if (agent) {
                message = 'Unable to to connect to ' + options.url + ' through a proxy . Error: ' + err.message;
            }
            else {
                message = 'Unable to to connect to ' + options.url + '. Error: ' + err.message;
            }
            return winjs_base_1.TPromise.wrapError({
                responseText: message,
                status: 404
            });
        }); });
    }
    exports.xhr = xhr;
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
define("vs/workbench/services/request/node/requestService", ["require", "exports", 'vs/base/common/winjs.base', 'vs/platform/configuration/common/configurationRegistry', 'vs/base/common/strings', 'vs/nls!vs/workbench/services/request/node/requestService', 'vs/base/common/lifecycle', 'vs/base/common/timer', 'vs/platform/platform', 'vs/base/common/async', 'vs/platform/configuration/common/configuration', 'vs/platform/request/common/baseRequestService', 'vs/workbench/services/request/node/rawHttpService'], function (require, exports, winjs_base_1, configurationRegistry_1, strings, nls, lifecycle, timer, platform, async, configuration_1, baseRequestService_1, rawHttpService) {
    'use strict';
    var RequestService = (function (_super) {
        __extends(RequestService, _super);
        function RequestService(contextService, configurationService, telemetryService) {
            var _this = this;
            _super.call(this, contextService, telemetryService);
            this.configurationService = configurationService;
            this.callOnDispose = [];
            // proxy setting updating
            this.callOnDispose.push(configurationService.addListener(configuration_1.ConfigurationServiceEventTypes.UPDATED, function (e) {
                _this.rawHttpServicePromise.then(function (rawHttpService) {
                    rawHttpService.configure(e.config.http && e.config.http.proxy, e.config.http.proxyStrictSSL);
                });
            }));
        }
        Object.defineProperty(RequestService.prototype, "rawHttpServicePromise", {
            get: function () {
                if (!this._rawHttpServicePromise) {
                    this._rawHttpServicePromise = this.configurationService.loadConfiguration().then(function (configuration) {
                        rawHttpService.configure(configuration.http && configuration.http.proxy, configuration.http.proxyStrictSSL);
                        return rawHttpService;
                    });
                }
                return this._rawHttpServicePromise;
            },
            enumerable: true,
            configurable: true
        });
        RequestService.prototype.dispose = function () {
            lifecycle.cAll(this.callOnDispose);
        };
        RequestService.prototype.makeRequest = function (options) {
            var url = options.url;
            if (!url) {
                throw new Error('IRequestService.makeRequest: Url is required.');
            }
            // Support file:// in native environment through XHR
            if (strings.startsWith(url, 'file://')) {
                return winjs_base_1.xhr(options).then(null, function (xhr) {
                    if (xhr.status === 0 && xhr.responseText) {
                        return xhr; // loading resources locally returns a status of 0 which in WinJS is an error so we need to handle it here
                    }
                    return winjs_base_1.Promise.wrapError({ status: 404, responseText: nls.localize(0, null) });
                });
            }
            return _super.prototype.makeRequest.call(this, options);
        };
        /**
         * Make a cross origin request using NodeJS.
         * Note: This method is also called from workers.
         */
        RequestService.prototype.makeCrossOriginRequest = function (options) {
            var timerVar = timer.nullEvent;
            return this.rawHttpServicePromise.then(function (rawHttpService) {
                return async.always(rawHttpService.xhr(options), (function (xhr) {
                    if (timerVar.data) {
                        timerVar.data.status = xhr.status;
                    }
                    timerVar.stop();
                }));
            });
        };
        return RequestService;
    }(baseRequestService_1.BaseRequestService));
    exports.RequestService = RequestService;
    // Configuration
    var confRegistry = platform.Registry.as(configurationRegistry_1.Extensions.Configuration);
    confRegistry.registerConfiguration({
        'id': 'http',
        'order': 9,
        'title': nls.localize(1, null),
        'type': 'object',
        'properties': {
            'http.proxy': {
                'type': 'string',
                'description': nls.localize(2, null)
            },
            'http.proxyStrictSSL': {
                'type': 'boolean',
                'default': true,
                'description': nls.localize(3, null)
            }
        }
    });
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/electron-main/sharedProcessMain", ["require", "exports", 'fs', 'vs/base/common/platform', 'vs/base/node/service.net', 'vs/base/common/winjs.base', 'vs/platform/instantiation/common/instantiationService', 'vs/platform/instantiation/common/descriptors', 'vs/platform/request/common/request', 'vs/workbench/services/request/node/requestService', 'vs/platform/workspace/common/workspace', 'vs/workbench/services/workspace/common/contextService', 'vs/platform/event/common/event', 'vs/platform/event/common/eventService', 'vs/platform/configuration/common/configuration', 'vs/workbench/services/configuration/node/configurationService', 'vs/workbench/parts/extensions/common/extensions', 'vs/workbench/parts/extensions/node/extensionsService'], function (require, exports, fs, platform, service_net_1, winjs_base_1, instantiationService_1, descriptors_1, request_1, requestService_1, workspace_1, contextService_1, event_1, eventService_1, configuration_1, configurationService_1, extensions_1, extensionsService_1) {
    "use strict";
    function quit(err) {
        if (err) {
            console.error(err);
        }
        process.exit(err ? 1 : 0);
    }
    /**
     * Plan B is to kill oneself if one's parent dies. Much drama.
     */
    function setupPlanB(parentPid) {
        setInterval(function () {
            try {
                process.kill(parentPid, 0); // throws an exception if the main process doesn't exist anymore.
            }
            catch (e) {
                process.exit();
            }
        }, 5000);
    }
    function main(server, initData) {
        var eventService = new eventService_1.EventService();
        var contextService = new contextService_1.WorkspaceContextService(eventService, null, initData.configuration, initData.contextServiceOptions);
        var configurationService = new configurationService_1.ConfigurationService(contextService, eventService);
        var requestService = new requestService_1.RequestService(contextService, configurationService);
        var instantiationService = instantiationService_1.createInstantiationService();
        instantiationService.addSingleton(event_1.IEventService, eventService);
        instantiationService.addSingleton(workspace_1.IWorkspaceContextService, contextService);
        instantiationService.addSingleton(configuration_1.IConfigurationService, configurationService);
        instantiationService.addSingleton(request_1.IRequestService, requestService);
        instantiationService.addSingleton(extensions_1.IExtensionsService, new descriptors_1.SyncDescriptor(extensionsService_1.ExtensionsService));
        var extensionService = instantiationService.getInstance(extensions_1.IExtensionsService);
        server.registerService('ExtensionService', extensionService);
        // eventually clean up old extensions
        setTimeout(function () { return extensionService.removeDeprecatedExtensions(); }, 5000);
    }
    function setupIPC(hook) {
        function setup(retry) {
            return service_net_1.serve(hook).then(null, function (err) {
                if (!retry || platform.isWindows || err.code !== 'EADDRINUSE') {
                    return winjs_base_1.TPromise.wrapError(err);
                }
                // should retry, not windows and eaddrinuse
                return service_net_1.connect(hook).then(function (client) {
                    // we could connect to a running instance. this is not good, abort
                    client.dispose();
                    return winjs_base_1.TPromise.wrapError(new Error('There is an instance already running.'));
                }, function (err) {
                    // it happens on Linux and OS X that the pipe is left behind
                    // let's delete it, since we can't connect to it
                    // and the retry the whole thing
                    try {
                        fs.unlinkSync(hook);
                    }
                    catch (e) {
                        return winjs_base_1.TPromise.wrapError(new Error('Error deleting the shared ipc hook.'));
                    }
                    return setup(false);
                });
            });
        }
        return setup(true);
    }
    function handshake() {
        return new winjs_base_1.TPromise(function (c, e) {
            process.once('message', c);
            process.once('error', e);
            process.send('hello');
        });
    }
    winjs_base_1.TPromise.join([setupIPC(process.env['VSCODE_SHARED_IPC_HOOK']), handshake()])
        .then(function (r) { return main(r[0], r[1]); })
        .then(function () { return setupPlanB(process.env['VSCODE_PID']); })
        .done(null, quit);
});

//# sourceMappingURL=sharedProcessMain.js.map
