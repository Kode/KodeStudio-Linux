/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/base/common/htmlContent", ["require", "exports"], function (require, exports) {
    'use strict';
    function htmlContentElementCodeEqual(a, b) {
        if (!a && !b) {
            return true;
        }
        if (!a || !b) {
            return false;
        }
        return (a.language === b.language
            && a.value === b.value);
    }
    function htmlContentElementEqual(a, b) {
        return (a.formattedText === b.formattedText
            && a.text === b.text
            && a.className === b.className
            && a.style === b.style
            && a.customStyle === b.customStyle
            && a.tagName === b.tagName
            && a.isText === b.isText
            && a.role === b.role
            && a.markdown === b.markdown
            && htmlContentElementCodeEqual(a.code, b.code)
            && htmlContentElementArrEquals(a.children, b.children));
    }
    function htmlContentElementArrEquals(a, b) {
        if (!a && !b) {
            return true;
        }
        if (!a || !b) {
            return false;
        }
        var aLen = a.length, bLen = b.length;
        if (aLen !== bLen) {
            return false;
        }
        for (var i = 0; i < aLen; i++) {
            if (!htmlContentElementEqual(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
    exports.htmlContentElementArrEquals = htmlContentElementArrEquals;
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

define("vs/base/common/network", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var Schemas;
    (function (Schemas) {
        /**
         * A schema that is used for models that exist in memory
         * only and that have no correspondence on a server or such.
         */
        Schemas.inMemory = 'inmemory';
        Schemas.http = 'http';
        Schemas.https = 'https';
        Schemas.file = 'file';
    })(Schemas = exports.Schemas || (exports.Schemas = {}));
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

define("vs/base/common/filters", ["require", "exports", 'vs/base/common/strings'], function (require, exports, strings) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // Combined filters
    /**
     * @returns A filter which combines the provided set
     * of filters with an or. The *first* filters that
     * matches defined the return value of the returned
     * filter.
     */
    function or() {
        var filter = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            filter[_i - 0] = arguments[_i];
        }
        return function (word, wordToMatchAgainst) {
            for (var i = 0, len = filter.length; i < len; i++) {
                var match = filter[i](word, wordToMatchAgainst);
                if (match) {
                    return match;
                }
            }
            return null;
        };
    }
    exports.or = or;
    /**
     * @returns A filter which combines the provided set
     * of filters with an and. The combines matches are
     * returned if *all* filters match.
     */
    function and() {
        var filter = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            filter[_i - 0] = arguments[_i];
        }
        return function (word, wordToMatchAgainst) {
            var result = [];
            for (var i = 0, len = filter.length; i < len; i++) {
                var match = filter[i](word, wordToMatchAgainst);
                if (!match) {
                    return null;
                }
                result = result.concat(match);
            }
            return result;
        };
    }
    exports.and = and;
    // Prefix
    exports.matchesStrictPrefix = function (word, wordToMatchAgainst) { return _matchesPrefix(false, word, wordToMatchAgainst); };
    exports.matchesPrefix = function (word, wordToMatchAgainst) { return _matchesPrefix(true, word, wordToMatchAgainst); };
    function _matchesPrefix(ignoreCase, word, wordToMatchAgainst) {
        if (wordToMatchAgainst.length === 0 || wordToMatchAgainst.length < word.length) {
            return null;
        }
        if (ignoreCase) {
            word = word.toLowerCase();
            wordToMatchAgainst = wordToMatchAgainst.toLowerCase();
        }
        for (var i = 0; i < word.length; i++) {
            if (word[i] !== wordToMatchAgainst[i]) {
                return null;
            }
        }
        return word.length > 0 ? [{ start: 0, end: word.length }] : [];
    }
    // Contiguous Substring
    function matchesContiguousSubString(word, wordToMatchAgainst) {
        var index = wordToMatchAgainst.toLowerCase().indexOf(word.toLowerCase());
        if (index === -1) {
            return null;
        }
        return [{ start: index, end: index + word.length }];
    }
    exports.matchesContiguousSubString = matchesContiguousSubString;
    // Substring
    function matchesSubString(word, wordToMatchAgainst) {
        return _matchesSubString(word.toLowerCase(), wordToMatchAgainst.toLowerCase(), 0, 0);
    }
    exports.matchesSubString = matchesSubString;
    function _matchesSubString(word, wordToMatchAgainst, i, j) {
        if (i === word.length) {
            return [];
        }
        else if (j === wordToMatchAgainst.length) {
            return null;
        }
        else {
            if (word[i] === wordToMatchAgainst[j]) {
                var result = null;
                if (result = _matchesSubString(word, wordToMatchAgainst, i + 1, j + 1)) {
                    return join({ start: j, end: j + 1 }, result);
                }
            }
            return _matchesSubString(word, wordToMatchAgainst, i, j + 1);
        }
    }
    // CamelCase
    function isLower(code) {
        return 97 <= code && code <= 122;
    }
    function isUpper(code) {
        return 65 <= code && code <= 90;
    }
    function isNumber(code) {
        return 48 <= code && code <= 57;
    }
    function isWhitespace(code) {
        return [32, 9, 10, 13].indexOf(code) > -1;
    }
    function isAlphanumeric(code) {
        return isLower(code) || isUpper(code) || isNumber(code);
    }
    function join(head, tail) {
        if (tail.length === 0) {
            tail = [head];
        }
        else if (head.end === tail[0].start) {
            tail[0].start = head.start;
        }
        else {
            tail.unshift(head);
        }
        return tail;
    }
    function nextAnchor(camelCaseWord, start) {
        for (var i = start; i < camelCaseWord.length; i++) {
            var c = camelCaseWord.charCodeAt(i);
            if (isUpper(c) || isNumber(c) || (i > 0 && !isAlphanumeric(camelCaseWord.charCodeAt(i - 1)))) {
                return i;
            }
        }
        return camelCaseWord.length;
    }
    function _matchesCamelCase(word, camelCaseWord, i, j) {
        if (i === word.length) {
            return [];
        }
        else if (j === camelCaseWord.length) {
            return null;
        }
        else if (word[i] !== camelCaseWord[j].toLowerCase()) {
            return null;
        }
        else {
            var result = null;
            var nextUpperIndex = j + 1;
            result = _matchesCamelCase(word, camelCaseWord, i + 1, j + 1);
            while (!result && (nextUpperIndex = nextAnchor(camelCaseWord, nextUpperIndex)) < camelCaseWord.length) {
                result = _matchesCamelCase(word, camelCaseWord, i + 1, nextUpperIndex);
                nextUpperIndex++;
            }
            return result === null ? null : join({ start: j, end: j + 1 }, result);
        }
    }
    // Heuristic to avoid computing camel case matcher for words that don't
    // look like camelCaseWords.
    function isCamelCaseWord(word) {
        if (word.length > 60) {
            return false;
        }
        var upper = 0, lower = 0, alpha = 0, numeric = 0, code = 0;
        for (var i = 0; i < word.length; i++) {
            code = word.charCodeAt(i);
            if (isUpper(code)) {
                upper++;
            }
            if (isLower(code)) {
                lower++;
            }
            if (isAlphanumeric(code)) {
                alpha++;
            }
            if (isNumber(code)) {
                numeric++;
            }
        }
        var upperPercent = upper / word.length;
        var lowerPercent = lower / word.length;
        var alphaPercent = alpha / word.length;
        var numericPercent = numeric / word.length;
        return lowerPercent > 0.2 && upperPercent < 0.8 && alphaPercent > 0.6 && numericPercent < 0.2;
    }
    // Heuristic to avoid computing camel case matcher for words that don't
    // look like camel case patterns.
    function isCamelCasePattern(word) {
        var upper = 0, lower = 0, code = 0, whitespace = 0;
        for (var i = 0; i < word.length; i++) {
            code = word.charCodeAt(i);
            if (isUpper(code)) {
                upper++;
            }
            if (isLower(code)) {
                lower++;
            }
            if (isWhitespace(code)) {
                whitespace++;
            }
        }
        if ((upper === 0 || lower === 0) && whitespace === 0) {
            return word.length <= 30;
        }
        else {
            return upper <= 5;
        }
    }
    function matchesCamelCase(word, camelCaseWord) {
        if (camelCaseWord.length === 0) {
            return null;
        }
        if (!isCamelCasePattern(word)) {
            return null;
        }
        if (!isCamelCaseWord(camelCaseWord)) {
            return null;
        }
        var result = null;
        var i = 0;
        while (i < camelCaseWord.length && (result = _matchesCamelCase(word.toLowerCase(), camelCaseWord, 0, i)) === null) {
            i = nextAnchor(camelCaseWord, i + 1);
        }
        return result;
    }
    exports.matchesCamelCase = matchesCamelCase;
    // Fuzzy
    (function (SubstringMatching) {
        SubstringMatching[SubstringMatching["Contiguous"] = 0] = "Contiguous";
        SubstringMatching[SubstringMatching["Separate"] = 1] = "Separate";
    })(exports.SubstringMatching || (exports.SubstringMatching = {}));
    var SubstringMatching = exports.SubstringMatching;
    var fuzzyContiguousFilter = or(exports.matchesPrefix, matchesCamelCase, matchesContiguousSubString);
    var fuzzySeparateFilter = or(exports.matchesPrefix, matchesCamelCase, matchesSubString);
    var fuzzyRegExpCache = {};
    function matchesFuzzy(word, wordToMatchAgainst, enableSeparateSubstringMatching) {
        if (enableSeparateSubstringMatching === void 0) { enableSeparateSubstringMatching = false; }
        // Form RegExp for wildcard matches
        var regexp = fuzzyRegExpCache[word];
        if (!regexp) {
            regexp = new RegExp(strings.convertSimple2RegExpPattern(word), 'i');
            fuzzyRegExpCache[word] = regexp;
        }
        // RegExp Filter
        var match = regexp.exec(wordToMatchAgainst);
        if (match) {
            return [{ start: match.index, end: match.index + match[0].length }];
        }
        // Default Filter
        return enableSeparateSubstringMatching ? fuzzySeparateFilter(word, wordToMatchAgainst) : fuzzyContiguousFilter(word, wordToMatchAgainst);
    }
    exports.matchesFuzzy = matchesFuzzy;
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

define("vs/editor/common/core/arrays", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var Arrays;
    (function (Arrays) {
        /**
         * Given a sorted array of natural number segments, find the segment containing a natural number.
         *    For example, the segments [0, 5), [5, 9), [9, infinity) will be represented in the following manner:
         *       [{ startIndex: 0 }, { startIndex: 5 }, { startIndex: 9 }]
         *    Searching for 0, 1, 2, 3 or 4 will return 0.
         *    Searching for 5, 6, 7 or 8 will return 1.
         *    Searching for 9, 10, 11, ... will return 2.
         * @param arr A sorted array representing natural number segments
         * @param desiredIndex The search
         * @return The index of the containing segment in the array.
         */
        function findIndexInSegmentsArray(arr, desiredIndex) {
            var low = 0, high = arr.length - 1, mid;
            while (low < high) {
                mid = low + Math.ceil((high - low) / 2);
                if (arr[mid].startIndex > desiredIndex) {
                    high = mid - 1;
                }
                else {
                    low = mid;
                }
            }
            return low;
        }
        Arrays.findIndexInSegmentsArray = findIndexInSegmentsArray;
    })(Arrays = exports.Arrays || (exports.Arrays = {}));
});

define("vs/editor/common/core/idGenerator", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var IdGenerator = (function () {
        function IdGenerator(prefix) {
            this._prefix = prefix;
            this._lastId = 0;
        }
        IdGenerator.prototype.generate = function () {
            return this._prefix + (++this._lastId);
        };
        return IdGenerator;
    }());
    exports.IdGenerator = IdGenerator;
});

define("vs/editor/common/core/position", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var Position = (function () {
        function Position(lineNumber, column) {
            this.lineNumber = lineNumber;
            this.column = column;
        }
        Position.prototype.equals = function (other) {
            return Position.equals(this, other);
        };
        Position.equals = function (a, b) {
            if (!a && !b) {
                return true;
            }
            return (!!a &&
                !!b &&
                a.lineNumber === b.lineNumber &&
                a.column === b.column);
        };
        Position.prototype.isBefore = function (other) {
            return Position.isBefore(this, other);
        };
        Position.isBefore = function (a, b) {
            if (a.lineNumber < b.lineNumber) {
                return true;
            }
            if (b.lineNumber < a.lineNumber) {
                return false;
            }
            return a.column < b.column;
        };
        Position.prototype.isBeforeOrEqual = function (other) {
            return Position.isBeforeOrEqual(this, other);
        };
        Position.isBeforeOrEqual = function (a, b) {
            if (a.lineNumber < b.lineNumber) {
                return true;
            }
            if (b.lineNumber < a.lineNumber) {
                return false;
            }
            return a.column <= b.column;
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
    }());
    exports.Position = Position;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/editor/common/core/range", ["require", "exports", 'vs/editor/common/core/position'], function (require, exports, position_1) {
    'use strict';
    var Range = (function () {
        function Range(startLineNumber, startColumn, endLineNumber, endColumn) {
            if ((startLineNumber > endLineNumber) || (startLineNumber === endLineNumber && startColumn > endColumn)) {
                this.startLineNumber = endLineNumber;
                this.startColumn = endColumn;
                this.endLineNumber = startLineNumber;
                this.endColumn = startColumn;
            }
            else {
                this.startLineNumber = startLineNumber;
                this.startColumn = startColumn;
                this.endLineNumber = endLineNumber;
                this.endColumn = endColumn;
            }
        }
        Range.prototype.isEmpty = function () {
            return Range.isEmpty(this);
        };
        Range.prototype.containsPosition = function (position) {
            return Range.containsPosition(this, position);
        };
        Range.prototype.containsRange = function (range) {
            return Range.containsRange(this, range);
        };
        Range.prototype.plusRange = function (range) {
            return Range.plusRange(this, range);
        };
        Range.prototype.intersectRanges = function (range) {
            return Range.intersectRanges(this, range);
        };
        Range.prototype.equalsRange = function (other) {
            return Range.equalsRange(this, other);
        };
        Range.prototype.getEndPosition = function () {
            return new position_1.Position(this.endLineNumber, this.endColumn);
        };
        Range.prototype.getStartPosition = function () {
            return new position_1.Position(this.startLineNumber, this.startColumn);
        };
        Range.prototype.cloneRange = function () {
            return new Range(this.startLineNumber, this.startColumn, this.endLineNumber, this.endColumn);
        };
        Range.prototype.toString = function () {
            return '[' + this.startLineNumber + ',' + this.startColumn + ' -> ' + this.endLineNumber + ',' + this.endColumn + ']';
        };
        Range.prototype.setEndPosition = function (endLineNumber, endColumn) {
            return new Range(this.startLineNumber, this.startColumn, endLineNumber, endColumn);
        };
        Range.prototype.setStartPosition = function (startLineNumber, startColumn) {
            return new Range(startLineNumber, startColumn, this.endLineNumber, this.endColumn);
        };
        Range.prototype.collapseToStart = function () {
            return new Range(this.startLineNumber, this.startColumn, this.startLineNumber, this.startColumn);
        };
        // ---
        Range.lift = function (range) {
            if (!range) {
                return null;
            }
            return new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
        };
        Range.isIRange = function (obj) {
            return (obj
                && (typeof obj.startLineNumber === 'number')
                && (typeof obj.startColumn === 'number')
                && (typeof obj.endLineNumber === 'number')
                && (typeof obj.endColumn === 'number'));
        };
        Range.isEmpty = function (range) {
            return (range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn);
        };
        Range.containsPosition = function (range, position) {
            if (position.lineNumber < range.startLineNumber || position.lineNumber > range.endLineNumber) {
                return false;
            }
            if (position.lineNumber === range.startLineNumber && position.column < range.startColumn) {
                return false;
            }
            if (position.lineNumber === range.endLineNumber && position.column > range.endColumn) {
                return false;
            }
            return true;
        };
        Range.containsRange = function (range, otherRange) {
            if (otherRange.startLineNumber < range.startLineNumber || otherRange.endLineNumber < range.startLineNumber) {
                return false;
            }
            if (otherRange.startLineNumber > range.endLineNumber || otherRange.endLineNumber > range.endLineNumber) {
                return false;
            }
            if (otherRange.startLineNumber === range.startLineNumber && otherRange.startColumn < range.startColumn) {
                return false;
            }
            if (otherRange.endLineNumber === range.endLineNumber && otherRange.endColumn > range.endColumn) {
                return false;
            }
            return true;
        };
        Range.areIntersectingOrTouching = function (a, b) {
            // Check if `a` is before `b`
            if (a.endLineNumber < b.startLineNumber || (a.endLineNumber === b.startLineNumber && a.endColumn < b.startColumn)) {
                return false;
            }
            // Check if `b` is before `a`
            if (b.endLineNumber < a.startLineNumber || (b.endLineNumber === a.startLineNumber && b.endColumn < a.startColumn)) {
                return false;
            }
            // These ranges must intersect
            return true;
        };
        Range.intersectRanges = function (a, b) {
            var resultStartLineNumber = a.startLineNumber, resultStartColumn = a.startColumn, resultEndLineNumber = a.endLineNumber, resultEndColumn = a.endColumn, otherStartLineNumber = b.startLineNumber, otherStartColumn = b.startColumn, otherEndLineNumber = b.endLineNumber, otherEndColumn = b.endColumn;
            if (resultStartLineNumber < otherStartLineNumber) {
                resultStartLineNumber = otherStartLineNumber;
                resultStartColumn = otherStartColumn;
            }
            else if (resultStartLineNumber === otherStartLineNumber) {
                resultStartColumn = Math.max(resultStartColumn, otherStartColumn);
            }
            if (resultEndLineNumber > otherEndLineNumber) {
                resultEndLineNumber = otherEndLineNumber;
                resultEndColumn = otherEndColumn;
            }
            else if (resultEndLineNumber === otherEndLineNumber) {
                resultEndColumn = Math.min(resultEndColumn, otherEndColumn);
            }
            // Check if selection is now empty
            if (resultStartLineNumber > resultEndLineNumber) {
                return null;
            }
            if (resultStartLineNumber === resultEndLineNumber && resultStartColumn > resultEndColumn) {
                return null;
            }
            return new Range(resultStartLineNumber, resultStartColumn, resultEndLineNumber, resultEndColumn);
        };
        Range.plusRange = function (a, b) {
            var startLineNumber, startColumn, endLineNumber, endColumn;
            if (b.startLineNumber < a.startLineNumber) {
                startLineNumber = b.startLineNumber;
                startColumn = b.startColumn;
            }
            else if (b.startLineNumber === a.startLineNumber) {
                startLineNumber = b.startLineNumber;
                startColumn = Math.min(b.startColumn, a.startColumn);
            }
            else {
                startLineNumber = a.startLineNumber;
                startColumn = a.startColumn;
            }
            if (b.endLineNumber > a.endLineNumber) {
                endLineNumber = b.endLineNumber;
                endColumn = b.endColumn;
            }
            else if (b.endLineNumber === a.endLineNumber) {
                endLineNumber = b.endLineNumber;
                endColumn = Math.max(b.endColumn, a.endColumn);
            }
            else {
                endLineNumber = a.endLineNumber;
                endColumn = a.endColumn;
            }
            return new Range(startLineNumber, startColumn, endLineNumber, endColumn);
        };
        Range.equalsRange = function (a, b) {
            return (!!a &&
                !!b &&
                a.startLineNumber === b.startLineNumber &&
                a.startColumn === b.startColumn &&
                a.endLineNumber === b.endLineNumber &&
                a.endColumn === b.endColumn);
        };
        /**
         * A function that compares ranges, useful for sorting ranges
         * It will first compare ranges on the startPosition and then on the endPosition
         */
        Range.compareRangesUsingStarts = function (a, b) {
            if (a.startLineNumber === b.startLineNumber) {
                if (a.startColumn === b.startColumn) {
                    if (a.endLineNumber === b.endLineNumber) {
                        return a.endColumn - b.endColumn;
                    }
                    return a.endLineNumber - b.endLineNumber;
                }
                return a.startColumn - b.startColumn;
            }
            return a.startLineNumber - b.startLineNumber;
        };
        /**
         * A function that compares ranges, useful for sorting ranges
         * It will first compare ranges on the endPosition and then on the startPosition
         */
        Range.compareRangesUsingEnds = function (a, b) {
            if (a.endLineNumber === b.endLineNumber) {
                if (a.endColumn === b.endColumn) {
                    if (a.startLineNumber === b.startLineNumber) {
                        return a.startColumn - b.startColumn;
                    }
                    return a.startLineNumber - b.startLineNumber;
                }
                return a.endColumn - b.endColumn;
            }
            return a.endLineNumber - b.endLineNumber;
        };
        Range.spansMultipleLines = function (range) {
            return range.endLineNumber > range.startLineNumber;
        };
        Range.collapseToStart = function (range) {
            return {
                startLineNumber: range.startLineNumber,
                startColumn: range.startColumn,
                endLineNumber: range.startLineNumber,
                endColumn: range.startColumn
            };
        };
        return Range;
    }());
    exports.Range = Range;
});

define("vs/editor/common/model/indentationGuesser", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var __space = ' '.charCodeAt(0);
    var __tab = '\t'.charCodeAt(0);
    /**
     * Compute the diff in spaces between two line's indentation.
     */
    function spacesDiff(a, aLength, b, bLength) {
        // This can go both ways (e.g.):
        //  - a: "\t"
        //  - b: "\t    "
        //  => This should count 1 tab and 4 spaces
        var i;
        for (i = 0; i < aLength && i < bLength; i++) {
            var aCharCode = a.charCodeAt(i);
            var bCharCode = b.charCodeAt(i);
            if (aCharCode !== bCharCode) {
                break;
            }
        }
        var aSpacesCnt = 0, aTabsCount = 0;
        for (var j = i; j < aLength; j++) {
            var aCharCode = a.charCodeAt(j);
            if (aCharCode === __space) {
                aSpacesCnt++;
            }
            else {
                aTabsCount++;
            }
        }
        var bSpacesCnt = 0, bTabsCount = 0;
        for (var j = i; j < bLength; j++) {
            var bCharCode = b.charCodeAt(j);
            if (bCharCode === __space) {
                bSpacesCnt++;
            }
            else {
                bTabsCount++;
            }
        }
        if (aSpacesCnt > 0 && aTabsCount > 0) {
            return 0;
        }
        if (bSpacesCnt > 0 && bTabsCount > 0) {
            return 0;
        }
        var tabsDiff = Math.abs(aTabsCount - bTabsCount);
        var spacesDiff = Math.abs(aSpacesCnt - bSpacesCnt);
        if (tabsDiff === 0) {
            return spacesDiff;
        }
        if (spacesDiff % tabsDiff === 0) {
            return spacesDiff / tabsDiff;
        }
        return 0;
    }
    function guessIndentation(lines, defaultTabSize, defaultInsertSpaces) {
        var linesIndentedWithTabsCount = 0; // number of lines that contain at least one tab in indentation
        var linesIndentedWithSpacesCount = 0; // number of lines that contain only spaces in indentation
        var previousLineText = ''; // content of latest line that contained non-whitespace chars
        var previousLineIndentation = 0; // index at which latest line contained the first non-whitespace char
        var ALLOWED_TAB_SIZE_GUESSES = [2, 4, 6, 8]; // limit guesses for `tabSize` to 2, 4, 6 or 8.
        var MAX_ALLOWED_TAB_SIZE_GUESS = 8; // max(2,4,6,8) = 8
        var spacesDiffCount = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // `tabSize` scores
        for (var i = 0, len = lines.length; i < len; i++) {
            var currentLineText = lines[i];
            var currentLineHasContent = false; // does `currentLineText` contain non-whitespace chars
            var currentLineIndentation = 0; // index at which `currentLineText` contains the first non-whitespace char
            var currentLineSpacesCount = 0; // count of spaces found in `currentLineText` indentation
            var currentLineTabsCount = 0; // count of tabs found in `currentLineText` indentation
            for (var j = 0, lenJ = currentLineText.length; j < lenJ; j++) {
                var charCode = currentLineText.charCodeAt(j);
                if (charCode === __tab) {
                    currentLineTabsCount++;
                }
                else if (charCode === __space) {
                    currentLineSpacesCount++;
                }
                else {
                    // Hit non whitespace character on this line
                    currentLineHasContent = true;
                    currentLineIndentation = j;
                    break;
                }
            }
            // Ignore empty or only whitespace lines
            if (!currentLineHasContent) {
                continue;
            }
            if (currentLineTabsCount > 0) {
                linesIndentedWithTabsCount++;
            }
            else if (currentLineSpacesCount > 1) {
                linesIndentedWithSpacesCount++;
            }
            var currentSpacesDiff = spacesDiff(previousLineText, previousLineIndentation, currentLineText, currentLineIndentation);
            if (currentSpacesDiff <= MAX_ALLOWED_TAB_SIZE_GUESS) {
                spacesDiffCount[currentSpacesDiff]++;
            }
            previousLineText = currentLineText;
            previousLineIndentation = currentLineIndentation;
        }
        // Take into account the last line as well
        var deltaSpacesCount = spacesDiff(previousLineText, previousLineIndentation, '', 0);
        if (deltaSpacesCount <= MAX_ALLOWED_TAB_SIZE_GUESS) {
            spacesDiffCount[deltaSpacesCount]++;
        }
        var insertSpaces = defaultInsertSpaces;
        if (linesIndentedWithTabsCount !== linesIndentedWithSpacesCount) {
            insertSpaces = (linesIndentedWithTabsCount < linesIndentedWithSpacesCount);
        }
        var tabSize = defaultTabSize;
        var tabSizeScore = (insertSpaces ? 0 : 0.1 * lines.length);
        // console.log("score threshold: " + tabSizeScore);
        ALLOWED_TAB_SIZE_GUESSES.forEach(function (possibleTabSize) {
            var possibleTabSizeScore = spacesDiffCount[possibleTabSize];
            if (possibleTabSizeScore > tabSizeScore) {
                tabSizeScore = possibleTabSizeScore;
                tabSize = possibleTabSize;
            }
        });
        // console.log('--------------------------');
        // console.log('linesIndentedWithTabsCount: ' + linesIndentedWithTabsCount + ', linesIndentedWithSpacesCount: ' + linesIndentedWithSpacesCount);
        // console.log('spacesDiffCount: ' + spacesDiffCount);
        // console.log('tabSize: ' + tabSize + ', tabSizeScore: ' + tabSizeScore);
        return {
            insertSpaces: insertSpaces,
            tabSize: tabSize
        };
    }
    exports.guessIndentation = guessIndentation;
});

define("vs/editor/common/modes", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    (function (IndentAction) {
        IndentAction[IndentAction["None"] = 0] = "None";
        IndentAction[IndentAction["Indent"] = 1] = "Indent";
        IndentAction[IndentAction["IndentOutdent"] = 2] = "IndentOutdent";
        IndentAction[IndentAction["Outdent"] = 3] = "Outdent";
    })(exports.IndentAction || (exports.IndentAction = {}));
    var IndentAction = exports.IndentAction;
});

define("vs/editor/common/modes/abstractState", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var AbstractState = (function () {
        function AbstractState(mode, stateData) {
            if (stateData === void 0) { stateData = null; }
            this.mode = mode;
            this.stateData = stateData;
        }
        AbstractState.prototype.getMode = function () {
            return this.mode;
        };
        AbstractState.prototype.clone = function () {
            var result = this.makeClone();
            result.initializeFrom(this);
            return result;
        };
        AbstractState.prototype.makeClone = function () {
            throw new Error('Abstract Method');
        };
        AbstractState.prototype.initializeFrom = function (other) {
            this.stateData = other.stateData !== null ? other.stateData.clone() : null;
        };
        AbstractState.prototype.getStateData = function () {
            return this.stateData;
        };
        AbstractState.prototype.setStateData = function (state) {
            this.stateData = state;
        };
        AbstractState.prototype.equals = function (other) {
            if (other === null || this.mode !== other.getMode()) {
                return false;
            }
            if (other instanceof AbstractState) {
                return AbstractState.safeEquals(this.stateData, other.stateData);
            }
            return false;
        };
        AbstractState.prototype.tokenize = function (stream) {
            throw new Error('Abstract Method');
        };
        AbstractState.safeEquals = function (a, b) {
            if (a === null && b === null) {
                return true;
            }
            if (a === null || b === null) {
                return false;
            }
            return a.equals(b);
        };
        AbstractState.safeClone = function (state) {
            if (state) {
                return state.clone();
            }
            return null;
        };
        return AbstractState;
    }());
    exports.AbstractState = AbstractState;
});

define("vs/editor/common/modes/lineStream", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var LineStream = (function () {
        function LineStream(source) {
            this._source = source;
            this.sourceLength = source.length;
            this._pos = 0;
            this.whitespace = '\t \u00a0';
            this.whitespaceArr = this.stringToArray(this.whitespace);
            this.separators = '';
            this.separatorsArr = this.stringToArray(this.separators);
            this.tokenStart = -1;
            this.tokenEnd = -1;
        }
        LineStream.prototype.stringToArray = function (str) {
            if (!LineStream.STRING_TO_ARRAY_CACHE.hasOwnProperty(str)) {
                LineStream.STRING_TO_ARRAY_CACHE[str] = this.actualStringToArray(str);
            }
            return LineStream.STRING_TO_ARRAY_CACHE[str];
        };
        LineStream.prototype.actualStringToArray = function (str) {
            var maxCharCode = 0;
            for (var i = 0; i < str.length; i++) {
                maxCharCode = Math.max(maxCharCode, str.charCodeAt(i));
            }
            var r = [];
            for (var i = 0; i <= maxCharCode; i++) {
                r[i] = false;
            }
            for (var i = 0; i < str.length; i++) {
                r[str.charCodeAt(i)] = true;
            }
            return r;
        };
        LineStream.prototype.pos = function () {
            return this._pos;
        };
        LineStream.prototype.eos = function () {
            return this._pos >= this.sourceLength;
        };
        LineStream.prototype.peek = function () {
            // Check EOS
            if (this._pos >= this.sourceLength) {
                throw new Error('Stream is at the end');
            }
            return this._source[this._pos];
        };
        LineStream.prototype.next = function () {
            // Check EOS
            if (this._pos >= this.sourceLength) {
                throw new Error('Stream is at the end');
            }
            // Reset peeked token
            this.tokenStart = -1;
            this.tokenEnd = -1;
            return this._source[this._pos++];
        };
        LineStream.prototype.next2 = function () {
            // Check EOS
            if (this._pos >= this.sourceLength) {
                throw new Error('Stream is at the end');
            }
            // Reset peeked token
            this.tokenStart = -1;
            this.tokenEnd = -1;
            this._pos++;
        };
        LineStream.prototype.advance = function (n) {
            if (n === 0) {
                return '';
            }
            var oldPos = this._pos;
            this._pos += n;
            // Reset peeked token
            this.tokenStart = -1;
            this.tokenEnd = -1;
            return this._source.substring(oldPos, this._pos);
        };
        LineStream.prototype._advance2 = function (n) {
            if (n === 0) {
                return n;
            }
            this._pos += n;
            // Reset peeked token
            this.tokenStart = -1;
            this.tokenEnd = -1;
            return n;
        };
        LineStream.prototype.advanceToEOS = function () {
            var oldPos = this._pos;
            this._pos = this.sourceLength;
            this.resetPeekedToken();
            return this._source.substring(oldPos, this._pos);
        };
        LineStream.prototype.goBack = function (n) {
            this._pos -= n;
            this.resetPeekedToken();
        };
        LineStream.prototype.createPeeker = function (condition) {
            var _this = this;
            if (condition instanceof RegExp) {
                return function () {
                    var result = condition.exec(_this._source.substr(_this._pos));
                    if (result === null) {
                        return 0;
                    }
                    else if (result.index !== 0) {
                        throw new Error('Regular expression must begin with the character "^"');
                    }
                    return result[0].length;
                };
            }
            else if ((condition instanceof String || (typeof condition) === 'string') && condition) {
                return function () {
                    var len = condition.length, match = _this._pos + len <= _this.sourceLength;
                    for (var i = 0; match && i < len; i++) {
                        match = _this._source.charCodeAt(_this._pos + i) === condition.charCodeAt(i);
                    }
                    return match ? len : 0;
                };
            }
            throw new Error('Condition must be either a regular expression, function or a non-empty string');
        };
        // --- BEGIN `_advanceIfStringCaseInsensitive`
        LineStream.prototype._advanceIfStringCaseInsensitive = function (condition) {
            var oldPos = this._pos, source = this._source, len = condition.length, i;
            if (len < 1 || oldPos + len > this.sourceLength) {
                return 0;
            }
            for (i = 0; i < len; i++) {
                if (source.charAt(oldPos + i).toLowerCase() !== condition.charAt(i).toLowerCase()) {
                    return 0;
                }
            }
            return len;
        };
        LineStream.prototype.advanceIfStringCaseInsensitive = function (condition) {
            return this.advance(this._advanceIfStringCaseInsensitive(condition));
        };
        LineStream.prototype.advanceIfStringCaseInsensitive2 = function (condition) {
            return this._advance2(this._advanceIfStringCaseInsensitive(condition));
        };
        // --- END
        // --- BEGIN `advanceIfString`
        LineStream.prototype._advanceIfString = function (condition) {
            var oldPos = this._pos, source = this._source, len = condition.length, i;
            if (len < 1 || oldPos + len > this.sourceLength) {
                return 0;
            }
            for (i = 0; i < len; i++) {
                if (source.charCodeAt(oldPos + i) !== condition.charCodeAt(i)) {
                    return 0;
                }
            }
            return len;
        };
        LineStream.prototype.advanceIfString = function (condition) {
            return this.advance(this._advanceIfString(condition));
        };
        LineStream.prototype.advanceIfString2 = function (condition) {
            return this._advance2(this._advanceIfString(condition));
        };
        // --- END
        // --- BEGIN `advanceIfString`
        LineStream.prototype._advanceIfCharCode = function (charCode) {
            if (this._pos < this.sourceLength && this._source.charCodeAt(this._pos) === charCode) {
                return 1;
            }
            return 0;
        };
        LineStream.prototype.advanceIfCharCode = function (charCode) {
            return this.advance(this._advanceIfCharCode(charCode));
        };
        LineStream.prototype.advanceIfCharCode2 = function (charCode) {
            return this._advance2(this._advanceIfCharCode(charCode));
        };
        // --- END
        // --- BEGIN `advanceIfRegExp`
        LineStream.prototype._advanceIfRegExp = function (condition) {
            if (this._pos >= this.sourceLength) {
                return 0;
            }
            if (!condition.test(this._source.substr(this._pos))) {
                return 0;
            }
            return RegExp.lastMatch.length;
        };
        LineStream.prototype.advanceIfRegExp = function (condition) {
            return this.advance(this._advanceIfRegExp(condition));
        };
        LineStream.prototype.advanceIfRegExp2 = function (condition) {
            return this._advance2(this._advanceIfRegExp(condition));
        };
        // --- END
        LineStream.prototype.advanceLoop = function (condition, isWhile, including) {
            if (this.eos()) {
                return '';
            }
            var peeker = this.createPeeker(condition);
            var oldPos = this._pos;
            var n = 0;
            var f = null;
            if (isWhile) {
                f = function (n) {
                    return n > 0;
                };
            }
            else {
                f = function (n) {
                    return n === 0;
                };
            }
            while (!this.eos() && f(n = peeker())) {
                if (n > 0) {
                    this.advance(n);
                }
                else {
                    this.next();
                }
            }
            if (including && !this.eos()) {
                this.advance(n);
            }
            return this._source.substring(oldPos, this._pos);
        };
        LineStream.prototype.advanceWhile = function (condition) {
            return this.advanceLoop(condition, true, false);
        };
        LineStream.prototype.advanceUntil = function (condition, including) {
            return this.advanceLoop(condition, false, including);
        };
        // --- BEGIN `advanceUntilString`
        LineStream.prototype._advanceUntilString = function (condition, including) {
            if (this.eos() || condition.length === 0) {
                return 0;
            }
            var oldPos = this._pos;
            var index = this._source.indexOf(condition, oldPos);
            if (index === -1) {
                // String was not found => advanced to `eos`
                return (this.sourceLength - oldPos);
            }
            if (including) {
                // String was found => advance to include `condition`
                return (index + condition.length - oldPos);
            }
            // String was found => advance right before `condition`
            return (index - oldPos);
        };
        LineStream.prototype.advanceUntilString = function (condition, including) {
            return this.advance(this._advanceUntilString(condition, including));
        };
        LineStream.prototype.advanceUntilString2 = function (condition, including) {
            return this._advance2(this._advanceUntilString(condition, including));
        };
        // --- END
        LineStream.prototype.resetPeekedToken = function () {
            this.tokenStart = -1;
            this.tokenEnd = -1;
        };
        LineStream.prototype.setTokenRules = function (separators, whitespace) {
            if (this.separators !== separators || this.whitespace !== whitespace) {
                this.separators = separators;
                this.separatorsArr = this.stringToArray(this.separators);
                this.whitespace = whitespace;
                this.whitespaceArr = this.stringToArray(this.whitespace);
                this.resetPeekedToken();
            }
        };
        // --- tokens
        LineStream.prototype.peekToken = function () {
            if (this.tokenStart !== -1) {
                return this._source.substring(this.tokenStart, this.tokenEnd);
            }
            var source = this._source, sourceLength = this.sourceLength, whitespaceArr = this.whitespaceArr, separatorsArr = this.separatorsArr, tokenStart = this._pos;
            // Check EOS
            if (tokenStart >= sourceLength) {
                throw new Error('Stream is at the end');
            }
            // Skip whitespace
            while (whitespaceArr[source.charCodeAt(tokenStart)] && tokenStart < sourceLength) {
                tokenStart++;
            }
            var tokenEnd = tokenStart;
            // If a separator is hit, it is a token
            if (separatorsArr[source.charCodeAt(tokenEnd)] && tokenEnd < sourceLength) {
                tokenEnd++;
            }
            else {
                // Advance until a separator or a whitespace is hit
                while (!separatorsArr[source.charCodeAt(tokenEnd)] && !whitespaceArr[source.charCodeAt(tokenEnd)] && tokenEnd < sourceLength) {
                    tokenEnd++;
                }
            }
            // Cache peeked token
            this.tokenStart = tokenStart;
            this.tokenEnd = tokenEnd;
            return source.substring(tokenStart, tokenEnd);
        };
        LineStream.prototype.nextToken = function () {
            // Check EOS
            if (this._pos >= this.sourceLength) {
                throw new Error('Stream is at the end');
            }
            // Peek token if necessary
            var result;
            if (this.tokenStart === -1) {
                result = this.peekToken();
            }
            else {
                result = this._source.substring(this.tokenStart, this.tokenEnd);
            }
            // Advance to tokenEnd
            this._pos = this.tokenEnd;
            // Reset peeked token
            this.tokenStart = -1;
            this.tokenEnd = -1;
            return result;
        };
        // -- whitespace
        LineStream.prototype.peekWhitespace = function () {
            var source = this._source, sourceLength = this.sourceLength, whitespaceArr = this.whitespaceArr, peek = this._pos;
            while (whitespaceArr[source.charCodeAt(peek)] && peek < sourceLength) {
                peek++;
            }
            return source.substring(this._pos, peek);
        };
        // --- BEGIN `advanceIfRegExp`
        LineStream.prototype._skipWhitespace = function () {
            var source = this._source, sourceLength = this.sourceLength, whitespaceArr = this.whitespaceArr, oldPos = this._pos, peek = this._pos;
            while (whitespaceArr[source.charCodeAt(peek)] && peek < sourceLength) {
                peek++;
            }
            return (peek - oldPos);
        };
        LineStream.prototype.skipWhitespace = function () {
            return this.advance(this._skipWhitespace());
        };
        LineStream.prototype.skipWhitespace2 = function () {
            return this._advance2(this._skipWhitespace());
        };
        LineStream.STRING_TO_ARRAY_CACHE = {};
        return LineStream;
    }());
    exports.LineStream = LineStream;
});

define("vs/editor/common/modes/modesFilters", ["require", "exports", 'vs/base/common/arrays', 'vs/base/common/filters'], function (require, exports, arrays_1, filters) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function wrapBaseFilter(filter) {
        return function (word, suggestion) {
            var result = filter(word, suggestion.filterText || suggestion.label);
            return arrays_1.isFalsyOrEmpty(result) ? undefined : result;
        };
    }
    exports.StrictPrefix = wrapBaseFilter(filters.matchesStrictPrefix);
    exports.Prefix = wrapBaseFilter(filters.matchesPrefix);
    exports.CamelCase = wrapBaseFilter(filters.matchesCamelCase);
    exports.ContiguousSubString = wrapBaseFilter(filters.matchesContiguousSubString);
    // Combined Filters
    function or(first, second) {
        return function (word, suggestion) { return first(word, suggestion) || second(word, suggestion); };
    }
    exports.or = or;
    function and(first, second) {
        return function (word, suggestion) { return first(word, suggestion) && second(word, suggestion); };
    }
    exports.and = and;
    exports.DefaultFilter = or(or(exports.Prefix, exports.CamelCase), exports.ContiguousSubString);
});

define("vs/editor/common/modes/monarch/monarchCommon", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /*
     * This module exports common types and functionality shared between
     * the Monarch compiler that compiles JSON to ILexer, and the Monarch
     * Tokenizer (that highlights at runtime)
     */
    /*
     * Type definitions to be used internally to Monarch.
     * Inside monarch we use fully typed definitions and compiled versions of the more abstract JSON descriptions.
     */
    (function (MonarchBracket) {
        MonarchBracket[MonarchBracket["None"] = 0] = "None";
        MonarchBracket[MonarchBracket["Open"] = 1] = "Open";
        MonarchBracket[MonarchBracket["Close"] = -1] = "Close";
    })(exports.MonarchBracket || (exports.MonarchBracket = {}));
    var MonarchBracket = exports.MonarchBracket;
    // Small helper functions
    /**
     * Is a string null, undefined, or empty?
     */
    function empty(s) {
        return (s ? false : true);
    }
    exports.empty = empty;
    /**
     * Puts a string to lower case if 'ignoreCase' is set.
     */
    function fixCase(lexer, str) {
        return (lexer.ignoreCase && str ? str.toLowerCase() : str);
    }
    exports.fixCase = fixCase;
    /**
     * Ensures there are no bad characters in a CSS token class.
     */
    function sanitize(s) {
        return s.replace(/[&<>'"_]/g, '-'); // used on all output token CSS classes
    }
    exports.sanitize = sanitize;
    // Logging
    /**
     * Logs a message.
     */
    function log(lexer, msg) {
        console.log(lexer.name + ": " + msg);
    }
    exports.log = log;
    // Throwing errors
    /**
     * Throws error. May actually just log the error and continue.
     */
    function throwError(lexer, msg) {
        throw new Error(lexer.name + ": " + msg);
    }
    exports.throwError = throwError;
    // Helper functions for rule finding and substitution
    /**
     * substituteMatches is used on lexer strings and can substitutes predefined patterns:
     * 		$$  => $
     * 		$#  => id
     * 		$n  => matched entry n
     * 		@attr => contents of lexer[attr]
     *
     * See documentation for more info
     */
    function substituteMatches(lexer, str, id, matches, state) {
        var re = /\$((\$)|(#)|(\d\d?)|[sS](\d\d?)|@(\w+))/g;
        var stateMatches = null;
        return str.replace(re, function (full, sub, dollar, hash, n, s, attr, ofs, total) {
            if (!empty(dollar)) {
                return '$'; // $$
            }
            if (!empty(hash)) {
                return fixCase(lexer, id); // default $#
            }
            if (!empty(n) && n < matches.length) {
                return fixCase(lexer, matches[n]); // $n
            }
            if (!empty(attr) && lexer && typeof (lexer[attr]) === 'string') {
                return lexer[attr]; //@attribute
            }
            if (stateMatches === null) {
                stateMatches = state.split('.');
                stateMatches.unshift(state);
            }
            if (!empty(s) && s < stateMatches.length) {
                return fixCase(lexer, stateMatches[s]); //$Sn
            }
            return '';
        });
    }
    exports.substituteMatches = substituteMatches;
    /**
     * Find the tokenizer rules for a specific state (i.e. next action)
     */
    function findRules(lexer, state) {
        while (state && state.length > 0) {
            var rules = lexer.tokenizer[state];
            if (rules) {
                return rules;
            }
            var idx = state.lastIndexOf('.');
            if (idx < 0) {
                state = null; // no further parent
            }
            else {
                state = state.substr(0, idx);
            }
        }
        return null;
    }
    exports.findRules = findRules;
    /**
     * Is a certain state defined? In contrast to 'findRules' this works on a ILexerMin.
     * This is used during compilation where we may know the defined states
     * but not yet whether the corresponding rules are correct.
     */
    function stateExists(lexer, state) {
        while (state && state.length > 0) {
            var exist = lexer.stateNames[state];
            if (exist) {
                return true;
            }
            var idx = state.lastIndexOf('.');
            if (idx < 0) {
                state = null; // no further parent
            }
            else {
                state = state.substr(0, idx);
            }
        }
        return false;
    }
    exports.stateExists = stateExists;
});

define("vs/editor/common/modes/monarch/monarchCompile", ["require", "exports", 'vs/base/common/objects', 'vs/editor/common/modes/monarch/monarchCommon'], function (require, exports, objects, monarchCommon) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /*
     * Type helpers
     *
     * Note: this is just for sanity checks on the JSON description which is
     * helpful for the programmer. No checks are done anymore once the lexer is
     * already 'compiled and checked'.
     *
     */
    function isArrayOf(elemType, obj) {
        if (!obj) {
            return false;
        }
        if (!(Array.isArray(obj))) {
            return false;
        }
        var idx;
        for (idx in obj) {
            if (obj.hasOwnProperty(idx)) {
                if (!(elemType(obj[idx]))) {
                    return false;
                }
            }
        }
        return true;
    }
    function bool(prop, def, onerr) {
        if (typeof (prop) === 'boolean') {
            return prop;
        }
        if (onerr && (prop || def === undefined)) {
            onerr(); // type is wrong, or there is no default
        }
        return (def === undefined ? null : def);
    }
    function string(prop, def, onerr) {
        if (typeof (prop) === 'string') {
            return prop;
        }
        if (onerr && (prop || def === undefined)) {
            onerr(); // type is wrong, or there is no default
        }
        return (def === undefined ? null : def);
    }
    // Lexer helpers
    /**
     * Compiles a regular expression string, adding the 'i' flag if 'ignoreCase' is set.
     * Also replaces @\w+ or sequences with the content of the specified attribute
     */
    function compileRegExp(lexer, str) {
        if (typeof (str) !== 'string') {
            return null;
        }
        var n = 0;
        while (str.indexOf('@') >= 0 && n < 5) {
            n++;
            str = str.replace(/@(\w+)/g, function (s, attr) {
                var sub = '';
                if (typeof (lexer[attr]) === 'string') {
                    sub = lexer[attr];
                }
                else if (lexer[attr] && lexer[attr] instanceof RegExp) {
                    sub = lexer[attr].source;
                }
                else {
                    if (lexer[attr] === undefined) {
                        monarchCommon.throwError(lexer, 'language definition does not contain attribute \'' + attr + '\', used at: ' + str);
                    }
                    else {
                        monarchCommon.throwError(lexer, 'attribute reference \'' + attr + '\' must be a string, used at: ' + str);
                    }
                }
                return (monarchCommon.empty(sub) ? '' : '(?:' + sub + ')');
            });
        }
        return new RegExp(str, (lexer.ignoreCase ? 'i' : ''));
    }
    /**
     * Compiles guard functions for case matches.
     * This compiles 'cases' attributes into efficient match functions.
     *
     */
    function selectScrutinee(id, matches, state, num) {
        if (num < 0) {
            return id;
        }
        if (num < matches.length) {
            return matches[num];
        }
        if (num >= 100) {
            num = num - 100;
            var parts = state.split('.');
            parts.unshift(state);
            if (num < parts.length) {
                return parts[num];
            }
        }
        return null;
    }
    function createGuard(lexer, ruleName, tkey, val) {
        // get the scrutinee and pattern
        var scrut = -1; // -1: $!, 0-99: $n, 100+n: $Sn
        var oppat = tkey;
        var matches = tkey.match(/^\$(([sS]?)(\d\d?)|#)(.*)$/);
        if (matches) {
            if (matches[3]) {
                scrut = parseInt(matches[3]);
                if (matches[2]) {
                    scrut = scrut + 100; // if [sS] present
                }
            }
            oppat = matches[4];
        }
        // get operator
        var op = '~';
        var pat = oppat;
        if (!oppat || oppat.length === 0) {
            op = '!=';
            pat = '';
        }
        else if (/^\w*$/.test(pat)) {
            op = '==';
        }
        else {
            matches = oppat.match(/^(@|!@|~|!~|==|!=)(.*)$/);
            if (matches) {
                op = matches[1];
                pat = matches[2];
            }
        }
        // set the tester function
        var tester;
        // special case a regexp that matches just words
        if ((op === '~' || op === '!~') && /^(\w|\|)*$/.test(pat)) {
            var inWords = objects.createKeywordMatcher(pat.split('|'), lexer.ignoreCase);
            tester = function (s) { return (op === '~' ? inWords(s) : !inWords(s)); };
        }
        else if (op === '@' || op === '!@') {
            var words = lexer[pat];
            if (!words) {
                monarchCommon.throwError(lexer, 'the @ match target \'' + pat + '\' is not defined, in rule: ' + ruleName);
            }
            if (!(isArrayOf(function (elem) { return (typeof (elem) === 'string'); }, words))) {
                monarchCommon.throwError(lexer, 'the @ match target \'' + pat + '\' must be an array of strings, in rule: ' + ruleName);
            }
            var inWords = objects.createKeywordMatcher(words, lexer.ignoreCase);
            tester = function (s) { return (op === '@' ? inWords(s) : !inWords(s)); };
        }
        else if (op === '~' || op === '!~') {
            if (pat.indexOf('$') < 0) {
                // precompile regular expression
                var re = compileRegExp(lexer, '^' + pat + '$');
                tester = function (s) { return (op === '~' ? re.test(s) : !re.test(s)); };
            }
            else {
                tester = function (s, id, matches, state) {
                    var re = compileRegExp(lexer, '^' + monarchCommon.substituteMatches(lexer, pat, id, matches, state) + '$');
                    return re.test(s);
                };
            }
        }
        else {
            if (pat.indexOf('$') < 0) {
                var patx = monarchCommon.fixCase(lexer, pat);
                tester = function (s) { return (op === '==' ? s === patx : s !== patx); };
            }
            else {
                var patx = monarchCommon.fixCase(lexer, pat);
                tester = function (s, id, matches, state, eos) {
                    var patexp = monarchCommon.substituteMatches(lexer, patx, id, matches, state);
                    return (op === '==' ? s === patexp : s !== patexp);
                };
            }
        }
        // return the branch object
        if (scrut === -1) {
            return {
                name: tkey, value: val, test: function (id, matches, state, eos) {
                    return tester(id, id, matches, state, eos);
                }
            };
        }
        else {
            return {
                name: tkey, value: val, test: function (id, matches, state, eos) {
                    var scrutinee = selectScrutinee(id, matches, state, scrut);
                    return tester(!scrutinee ? '' : scrutinee, id, matches, state, eos);
                }
            };
        }
    }
    /**
     * Compiles an action: i.e. optimize regular expressions and case matches
     * and do many sanity checks.
     *
     * This is called only during compilation but if the lexer definition
     * contains user functions as actions (which is usually not allowed), then this
     * may be called during lexing. It is important therefore to compile common cases efficiently
     */
    function compileAction(lexer, ruleName, action) {
        if (!action) {
            return { token: '' };
        }
        else if (typeof (action) === 'string') {
            return action; // { token: action };
        }
        else if (action.token || action.token === '') {
            if (typeof (action.token) !== 'string') {
                monarchCommon.throwError(lexer, 'a \'token\' attribute must be of type string, in rule: ' + ruleName);
                return { token: '' };
            }
            else {
                // only copy specific typed fields (only happens once during compile Lexer)
                var newAction = { token: action.token };
                if (action.token.indexOf('$') >= 0) {
                    newAction.tokenSubst = true;
                }
                if (typeof (action.bracket) === 'string') {
                    if (action.bracket === '@open') {
                        newAction.bracket = monarchCommon.MonarchBracket.Open;
                    }
                    else if (action.bracket === '@close') {
                        newAction.bracket = monarchCommon.MonarchBracket.Close;
                    }
                    else {
                        monarchCommon.throwError(lexer, 'a \'bracket\' attribute must be either \'@open\' or \'@close\', in rule: ' + ruleName);
                    }
                }
                if (action.next) {
                    if (typeof (action.next) !== 'string') {
                        monarchCommon.throwError(lexer, 'the next state must be a string value in rule: ' + ruleName);
                    }
                    else {
                        var next = action.next;
                        if (!/^(@pop|@push|@popall)$/.test(next)) {
                            if (next[0] === '@') {
                                next = next.substr(1); // peel off starting @ sign
                            }
                            if (next.indexOf('$') < 0) {
                                if (!monarchCommon.stateExists(lexer, monarchCommon.substituteMatches(lexer, next, '', [], ''))) {
                                    monarchCommon.throwError(lexer, 'the next state \'' + action.next + '\' is not defined in rule: ' + ruleName);
                                }
                            }
                        }
                        newAction.next = next;
                    }
                }
                if (typeof (action.goBack) === 'number') {
                    newAction.goBack = action.goBack;
                }
                if (typeof (action.switchTo) === 'string') {
                    newAction.switchTo = action.switchTo;
                }
                if (typeof (action.log) === 'string') {
                    newAction.log = action.log;
                }
                if (typeof (action.nextEmbedded) === 'string') {
                    newAction.nextEmbedded = action.nextEmbedded;
                    lexer.usesEmbedded = true;
                }
                return newAction;
            }
        }
        else if (Array.isArray(action)) {
            var results = [];
            var idx;
            for (idx in action) {
                if (action.hasOwnProperty(idx)) {
                    results[idx] = compileAction(lexer, ruleName, action[idx]);
                }
            }
            return { group: results };
        }
        else if (action.cases) {
            // build an array of test cases
            var cases = [];
            // for each case, push a test function and result value
            var tkey;
            for (tkey in action.cases) {
                if (action.cases.hasOwnProperty(tkey)) {
                    var val = compileAction(lexer, ruleName, action.cases[tkey]);
                    // what kind of case
                    if (tkey === '@default' || tkey === '@' || tkey === '') {
                        cases.push({ test: null, value: val, name: tkey });
                    }
                    else if (tkey === '@eos') {
                        cases.push({ test: function (id, matches, state, eos) { return eos; }, value: val, name: tkey });
                    }
                    else {
                        cases.push(createGuard(lexer, ruleName, tkey, val)); // call separate function to avoid local variable capture
                    }
                }
            }
            // create a matching function
            var def = lexer.defaultToken;
            return {
                test: function (id, matches, state, eos) {
                    var idx;
                    for (idx in cases) {
                        if (cases.hasOwnProperty(idx)) {
                            var didmatch = (!cases[idx].test || cases[idx].test(id, matches, state, eos));
                            if (didmatch) {
                                return cases[idx].value;
                            }
                        }
                    }
                    return def;
                }
            };
        }
        else {
            monarchCommon.throwError(lexer, 'an action must be a string, an object with a \'token\' or \'cases\' attribute, or an array of actions; in rule: ' + ruleName);
            return '';
        }
    }
    /**
     * Helper class for creating matching rules
     */
    var Rule = (function () {
        function Rule(name) {
            this.regex = new RegExp('');
            this.action = { token: '' };
            this.matchOnlyAtLineStart = false;
            this.name = '';
            this.name = name;
        }
        Rule.prototype.setRegex = function (lexer, re) {
            var sregex;
            if (typeof (re) === 'string') {
                sregex = re;
            }
            else if (re instanceof RegExp) {
                sregex = re.source;
            }
            else {
                monarchCommon.throwError(lexer, 'rules must start with a match string or regular expression: ' + this.name);
            }
            this.matchOnlyAtLineStart = (sregex.length > 0 && sregex[0] === '^');
            this.name = this.name + ': ' + sregex;
            this.regex = compileRegExp(lexer, '^(?:' + (this.matchOnlyAtLineStart ? sregex.substr(1) : sregex) + ')');
        };
        Rule.prototype.setAction = function (lexer, act) {
            this.action = compileAction(lexer, this.name, act);
        };
        return Rule;
    }());
    /**
     * Compiles a json description function into json where all regular expressions,
     * case matches etc, are compiled and all include rules are expanded.
     * We also compile the bracket definitions, supply defaults, and do many sanity checks.
     * If the 'jsonStrict' parameter is 'false', we allow at certain locations
     * regular expression objects and functions that get called during lexing.
     * (Currently we have no samples that need this so perhaps we should always have
     * jsonStrict to true).
     */
    function compile(json) {
        if (!json || typeof (json) !== 'object') {
            throw new Error('Monarch: expecting a language definition object');
        }
        // Get names
        if (typeof (json.name) !== 'string') {
            throw new Error('Monarch: a language definition must include a string \'name\' attribute');
        }
        // Create our lexer
        var lexer = {};
        lexer.name = json.name;
        lexer.displayName = string(json.displayName, lexer.name);
        lexer.noThrow = false; // raise exceptions during compilation
        lexer.maxStack = 100;
        // Set standard fields: be defensive about types
        lexer.start = string(json.start);
        lexer.ignoreCase = bool(json.ignoreCase, false);
        lexer.lineComment = string(json.lineComment, '//');
        lexer.blockCommentStart = string(json.blockCommentStart, '/*');
        lexer.blockCommentEnd = string(json.blockCommentEnd, '*/');
        lexer.tokenPostfix = string(json.tokenPostfix, '.' + lexer.name);
        lexer.defaultToken = string(json.defaultToken, 'source', function () { monarchCommon.throwError(lexer, 'the \'defaultToken\' must be a string'); });
        lexer.usesEmbedded = false; // becomes true if we find a nextEmbedded action
        lexer.wordDefinition = json.wordDefinition || undefined;
        // COMPAT: with earlier monarch versions
        if (!lexer.lineComment && json.lineComments) {
            if (typeof (json.lineComments) === 'string') {
                lexer.lineComment = json.lineComments;
            }
            else if (typeof (json.lineComments[0]) === 'string') {
                lexer.lineComment = json.lineComments[0];
            }
        }
        lexer.suggestSupport = {
            textualCompletions: true,
            disableAutoTrigger: false,
            triggerCharacters: [],
            snippets: []
        };
        if (typeof json.suggestSupport !== 'undefined') {
            var suggestSupport = json.suggestSupport;
            if (Array.isArray(suggestSupport.snippets)) {
                var _snippets = suggestSupport.snippets;
                for (var i = 0, len = _snippets.length; i < len; i++) {
                    if (typeof _snippets[i] === 'string') {
                        lexer.suggestSupport.snippets.push({
                            type: 'snippet',
                            label: _snippets[i],
                            codeSnippet: _snippets[i]
                        });
                    }
                    else {
                        lexer.suggestSupport.snippets.push(_snippets[i]);
                    }
                }
            }
            if (Array.isArray(suggestSupport.triggerCharacters)) {
                lexer.suggestSupport.triggerCharacters = suggestSupport.triggerCharacters;
            }
            if (typeof suggestSupport.textualCompletions !== 'undefined') {
                lexer.suggestSupport.textualCompletions = suggestSupport.textualCompletions;
            }
            if (typeof suggestSupport.disableAutoTrigger !== 'undefined') {
                lexer.suggestSupport.disableAutoTrigger = suggestSupport.disableAutoTrigger;
            }
        }
        // For calling compileAction later on
        var lexerMin = json;
        lexerMin.name = lexer.name;
        lexerMin.displayName = lexer.displayName;
        lexerMin.ignoreCase = lexer.ignoreCase;
        lexerMin.noThrow = lexer.noThrow;
        lexerMin.usesEmbedded = lexer.usesEmbedded;
        lexerMin.stateNames = json.tokenizer;
        lexerMin.defaultToken = lexer.defaultToken;
        // Compile an array of rules into newrules where RegExp objects are created.
        function addRules(state, newrules, rules) {
            var idx;
            for (idx in rules) {
                if (rules.hasOwnProperty(idx)) {
                    var rule = rules[idx];
                    var include = rule.include;
                    if (include) {
                        if (typeof (include) !== 'string') {
                            monarchCommon.throwError(lexer, 'an \'include\' attribute must be a string at: ' + state);
                        }
                        if (include[0] === '@') {
                            include = include.substr(1); // peel off starting @
                        }
                        if (!json.tokenizer[include]) {
                            monarchCommon.throwError(lexer, 'include target \'' + include + '\' is not defined at: ' + state);
                        }
                        addRules(state + '.' + include, newrules, json.tokenizer[include]);
                    }
                    else {
                        var newrule = new Rule(state);
                        // Set up new rule attributes
                        if (Array.isArray(rule) && rule.length >= 1 && rule.length <= 3) {
                            newrule.setRegex(lexerMin, rule[0]);
                            if (rule.length >= 3) {
                                if (typeof (rule[1]) === 'string') {
                                    newrule.setAction(lexerMin, { token: rule[1], next: rule[2] });
                                }
                                else if (typeof (rule[1]) === 'object') {
                                    var rule1 = rule[1];
                                    rule1.next = rule[2];
                                    newrule.setAction(lexerMin, rule1);
                                }
                                else {
                                    monarchCommon.throwError(lexer, 'a next state as the last element of a rule can only be given if the action is either an object or a string, at: ' + state);
                                }
                            }
                            else {
                                newrule.setAction(lexerMin, rule[1]);
                            }
                        }
                        else {
                            if (!rule.regex) {
                                monarchCommon.throwError(lexer, 'a rule must either be an array, or an object with a \'regex\' or \'include\' field at: ' + state);
                            }
                            if (rule.name) {
                                newrule.name = string(rule.name);
                            }
                            if (rule.matchOnlyAtStart) {
                                newrule.matchOnlyAtLineStart = bool(rule.matchOnlyAtLineStart);
                            }
                            newrule.setRegex(lexerMin, rule.regex);
                            newrule.setAction(lexerMin, rule.action);
                        }
                        newrules.push(newrule);
                    }
                }
            }
        }
        // compile the tokenizer rules
        if (!json.tokenizer || typeof (json.tokenizer) !== 'object') {
            monarchCommon.throwError(lexer, 'a language definition must define the \'tokenizer\' attribute as an object');
        }
        lexer.tokenizer = [];
        var key;
        for (key in json.tokenizer) {
            if (json.tokenizer.hasOwnProperty(key)) {
                if (!lexer.start) {
                    lexer.start = key;
                }
                var rules = json.tokenizer[key];
                lexer.tokenizer[key] = new Array();
                addRules('tokenizer.' + key, lexer.tokenizer[key], rules);
            }
        }
        lexer.usesEmbedded = lexerMin.usesEmbedded; // can be set during compileAction
        // Set simple brackets
        if (json.brackets) {
            if (!(Array.isArray(json.brackets))) {
                monarchCommon.throwError(lexer, 'the \'brackets\' attribute must be defined as an array');
            }
        }
        else {
            json.brackets = [
                { open: '{', close: '}', token: 'delimiter.curly' },
                { open: '[', close: ']', token: 'delimiter.square' },
                { open: '(', close: ')', token: 'delimiter.parenthesis' },
                { open: '<', close: '>', token: 'delimiter.angle' }];
        }
        var brackets = [];
        for (var bracketIdx in json.brackets) {
            if (json.brackets.hasOwnProperty(bracketIdx)) {
                var desc = json.brackets[bracketIdx];
                if (desc && Array.isArray(desc) && desc.length === 3) {
                    desc = { token: desc[2], open: desc[0], close: desc[1] };
                }
                if (desc.open === desc.close) {
                    monarchCommon.throwError(lexer, 'open and close brackets in a \'brackets\' attribute must be different: ' + desc.open +
                        '\n hint: use the \'bracket\' attribute if matching on equal brackets is required.');
                }
                if (typeof (desc.open) === 'string' && typeof (desc.token) === 'string') {
                    brackets.push({
                        token: string(desc.token) + lexer.tokenPostfix,
                        open: monarchCommon.fixCase(lexer, string(desc.open)),
                        close: monarchCommon.fixCase(lexer, string(desc.close))
                    });
                }
                else {
                    monarchCommon.throwError(lexer, 'every element in the \'brackets\' array must be a \'{open,close,token}\' object or array');
                }
            }
        }
        lexer.brackets = brackets;
        // Set default auto closing pairs
        var autoClosingPairs;
        if (json.autoClosingPairs) {
            if (!(Array.isArray(json.autoClosingPairs))) {
                monarchCommon.throwError(lexer, 'the \'autoClosingPairs\' attribute must be an array of string pairs (as arrays)');
            }
            autoClosingPairs = json.autoClosingPairs.slice(0);
        }
        else {
            autoClosingPairs = [['"', '"'], ['\'', '\''], ['@brackets']];
        }
        // set auto closing pairs
        lexer.autoClosingPairs = [];
        if (autoClosingPairs) {
            for (var autoClosingPairIdx in autoClosingPairs) {
                if (autoClosingPairs.hasOwnProperty(autoClosingPairIdx)) {
                    var pair = autoClosingPairs[autoClosingPairIdx];
                    var openClose;
                    if (pair === '@brackets' || pair[0] === '@brackets') {
                        var bidx;
                        for (bidx in brackets) {
                            if (brackets.hasOwnProperty(bidx)) {
                                if (brackets[bidx].open && brackets[bidx].open.length === 1 &&
                                    brackets[bidx].close && brackets[bidx].close.length === 1) {
                                    openClose = { open: brackets[bidx].open, close: brackets[bidx].close, notIn: ['string', 'comment'] };
                                    lexer.autoClosingPairs.push(openClose);
                                }
                            }
                        }
                    }
                    else if (Array.isArray(pair) && pair.length === 2 &&
                        typeof (pair[0]) === 'string' && pair[0].length === 1 &&
                        typeof (pair[1]) === 'string' && pair[1].length === 1) {
                        openClose = { open: monarchCommon.fixCase(lexer, pair[0]), close: monarchCommon.fixCase(lexer, pair[1]), notIn: ['string', 'comment'] };
                        lexer.autoClosingPairs.push(openClose);
                    }
                    else if (typeof (pair.open) === 'string' && pair.open.length === 1 &&
                        typeof (pair.close) === 'string' && pair.close.length === 1) {
                        openClose = { open: monarchCommon.fixCase(lexer, pair.open[0]), close: monarchCommon.fixCase(lexer, pair.close[0]), notIn: ['string', 'comment'] };
                        lexer.autoClosingPairs.push(openClose);
                    }
                    else {
                        monarchCommon.throwError(lexer, 'every element in an \'autoClosingPairs\' array must be a pair of 1 character strings, or a \'@brackets\' directive');
                    }
                }
            }
        }
        // Set enhanced brackets
        // var enhancedBrackets : IRegexBracketPair[] = [];
        // if (json.enhancedBrackets) {
        // 	if (!(Array.isArray(<any>json.enhancedBrackets))) {
        // 		monarchCommon.throwError(lexer, 'the \'enhancedBrackets\' attribute must be defined as an array');
        // 	}
        // 	for (var bracketIdx in json.enhancedBrackets) {
        // 		if (json.enhancedBrackets.hasOwnProperty(bracketIdx)) {
        // 			var desc = <any> json.enhancedBrackets[bracketIdx];
        // 			if (desc.hasOwnProperty('openTrigger') && typeof (desc.openTrigger) !== 'string') {
        // 				monarchCommon.throwError(lexer, 'openTrigger in the \'enhancedBrackets\' array must be a string');
        // 			}
        // 			if (desc.hasOwnProperty('open') && !(desc.open instanceof RegExp)) {
        // 				monarchCommon.throwError(lexer, 'open in the \'enhancedBrackets\' array must be a regex');
        // 			}
        // 			if (desc.hasOwnProperty('closeComplete') && typeof (desc.closeComplete) !== 'string') {
        // 				monarchCommon.throwError(lexer, 'closeComplete in the \'enhancedBrackets\' array must be a string');
        // 			}
        // 			if (desc.hasOwnProperty('matchCase') && typeof (desc.matchCase) !== 'boolean') {
        // 				monarchCommon.throwError(lexer, 'matchCase in the \'enhancedBrackets\' array must be a boolean');
        // 			}
        // 			if (desc.hasOwnProperty('closeTrigger') && typeof (desc.closeTrigger) !== 'string') {
        // 				monarchCommon.throwError(lexer, 'closeTrigger in the \'enhancedBrackets\' array must be a string');
        // 			}
        // 			if (desc.hasOwnProperty('close') && !(desc.close instanceof RegExp)) {
        // 				monarchCommon.throwError(lexer, 'close in the \'enhancedBrackets\' array must be a regex');
        // 			}
        // 			if (desc.hasOwnProperty('tokenType')) {
        // 				if (typeof (desc.tokenType) !== 'string') {
        // 					monarchCommon.throwError(lexer, 'tokenType in the \'enhancedBrackets\' array must be a string');
        // 				}
        // 				else {
        // 					desc.tokenType += lexer.tokenPostfix;
        // 				}
        // 			}
        // 			enhancedBrackets.push(desc);
        // 		}
        // 	}
        // }
        // lexer.enhancedBrackets = enhancedBrackets;
        var standardBrackets = [];
        for (var i = 0; i < brackets.length; ++i) {
            standardBrackets.push([brackets[i].open, brackets[i].close]);
        }
        lexer.standardBrackets = standardBrackets;
        lexer.outdentTriggers = string(json.outdentTriggers, '');
        // Disable throw so the syntax highlighter goes, no matter what
        lexer.noThrow = true;
        return lexer;
    }
    exports.compile = compile;
});

define("vs/editor/common/modes/supports", ["require", "exports", 'vs/base/common/strings', 'vs/editor/common/core/arrays'], function (require, exports, strings, arrays_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var Token = (function () {
        function Token(startIndex, type) {
            this.startIndex = startIndex;
            this.type = type;
        }
        Token.prototype.toString = function () {
            return '(' + this.startIndex + ', ' + this.type + ')';
        };
        return Token;
    }());
    exports.Token = Token;
    function handleEvent(context, offset, runner) {
        var modeTransitions = context.modeTransitions;
        if (modeTransitions.length === 1) {
            return runner(modeTransitions[0].mode, context, offset);
        }
        var modeIndex = arrays_1.Arrays.findIndexInSegmentsArray(modeTransitions, offset);
        var nestedMode = modeTransitions[modeIndex].mode;
        var modeStartIndex = modeTransitions[modeIndex].startIndex;
        var firstTokenInModeIndex = context.findIndexOfOffset(modeStartIndex);
        var nextCharacterAfterModeIndex = -1;
        var nextTokenAfterMode = -1;
        if (modeIndex + 1 < modeTransitions.length) {
            nextTokenAfterMode = context.findIndexOfOffset(modeTransitions[modeIndex + 1].startIndex);
            nextCharacterAfterModeIndex = context.getTokenStartIndex(nextTokenAfterMode);
        }
        else {
            nextTokenAfterMode = context.getTokenCount();
            nextCharacterAfterModeIndex = context.getLineContent().length;
        }
        var firstTokenCharacterOffset = context.getTokenStartIndex(firstTokenInModeIndex);
        var newCtx = new FilteredLineContext(context, nestedMode, firstTokenInModeIndex, nextTokenAfterMode, firstTokenCharacterOffset, nextCharacterAfterModeIndex);
        return runner(nestedMode, newCtx, offset - firstTokenCharacterOffset);
    }
    exports.handleEvent = handleEvent;
    /**
     * Returns {{true}} if the line token at the specified
     * offset matches one of the provided types. Matching
     * happens on a substring start from the end, unless
     * anywhereInToken is set to true in which case matches
     * happen on a substring at any position.
     */
    function isLineToken(context, offset, types, anywhereInToken) {
        if (anywhereInToken === void 0) { anywhereInToken = false; }
        if (!Array.isArray(types) || types.length === 0) {
            return false;
        }
        if (context.getLineContent().length <= offset) {
            return false;
        }
        var tokenIdx = context.findIndexOfOffset(offset);
        var type = context.getTokenType(tokenIdx);
        for (var i = 0, len = types.length; i < len; i++) {
            if (anywhereInToken) {
                if (type.indexOf(types[i]) >= 0) {
                    return true;
                }
            }
            else {
                if (strings.endsWith(type, types[i])) {
                    return true;
                }
            }
        }
        return false;
    }
    exports.isLineToken = isLineToken;
    var FilteredLineContext = (function () {
        function FilteredLineContext(actual, mode, firstTokenInModeIndex, nextTokenAfterMode, firstTokenCharacterOffset, nextCharacterAfterModeIndex) {
            this.modeTransitions = [{
                    startIndex: 0,
                    mode: mode
                }];
            this._actual = actual;
            this._firstTokenInModeIndex = firstTokenInModeIndex;
            this._nextTokenAfterMode = nextTokenAfterMode;
            this._firstTokenCharacterOffset = firstTokenCharacterOffset;
            this._nextCharacterAfterModeIndex = nextCharacterAfterModeIndex;
        }
        FilteredLineContext.prototype.getLineContent = function () {
            var actualLineContent = this._actual.getLineContent();
            return actualLineContent.substring(this._firstTokenCharacterOffset, this._nextCharacterAfterModeIndex);
        };
        FilteredLineContext.prototype.getTokenCount = function () {
            return this._nextTokenAfterMode - this._firstTokenInModeIndex;
        };
        FilteredLineContext.prototype.findIndexOfOffset = function (offset) {
            return this._actual.findIndexOfOffset(offset + this._firstTokenCharacterOffset) - this._firstTokenInModeIndex;
        };
        FilteredLineContext.prototype.getTokenStartIndex = function (tokenIndex) {
            return this._actual.getTokenStartIndex(tokenIndex + this._firstTokenInModeIndex) - this._firstTokenCharacterOffset;
        };
        FilteredLineContext.prototype.getTokenEndIndex = function (tokenIndex) {
            return this._actual.getTokenEndIndex(tokenIndex + this._firstTokenInModeIndex) - this._firstTokenCharacterOffset;
        };
        FilteredLineContext.prototype.getTokenType = function (tokenIndex) {
            return this._actual.getTokenType(tokenIndex + this._firstTokenInModeIndex);
        };
        FilteredLineContext.prototype.getTokenText = function (tokenIndex) {
            return this._actual.getTokenText(tokenIndex + this._firstTokenInModeIndex);
        };
        return FilteredLineContext;
    }());
    exports.FilteredLineContext = FilteredLineContext;
    function ignoreBracketsInToken(tokenType) {
        return /\b(comment|string|regex)\b/.test(tokenType);
    }
    exports.ignoreBracketsInToken = ignoreBracketsInToken;
    // TODO@Martin: find a better home for this code:
    // TODO@Martin: modify suggestSupport to return a boolean if snippets should be presented or not
    //       and turn this into a real registry
    var SnippetsRegistry = (function () {
        function SnippetsRegistry() {
        }
        SnippetsRegistry.registerDefaultSnippets = function (modeId, snippets) {
            this._defaultSnippets[modeId] = (this._defaultSnippets[modeId] || []).concat(snippets);
        };
        SnippetsRegistry.registerSnippets = function (modeId, path, snippets) {
            var snippetsByMode = this._snippets[modeId];
            if (!snippetsByMode) {
                this._snippets[modeId] = snippetsByMode = {};
            }
            snippetsByMode[path] = snippets;
        };
        SnippetsRegistry.getSnippets = function (model, position) {
            var word = model.getWordAtPosition(position);
            var currentPrefix = word ? word.word.substring(0, position.column - word.startColumn) : '';
            var result = {
                currentWord: currentPrefix,
                suggestions: []
            };
            // to avoid that snippets are too prominent in the intellisense proposals:
            // - force that the current prefix matches with the snippet prefix
            // if there's no prfix, only show snippets at the beginning of the line, or after a whitespace
            var filter = null;
            if (currentPrefix.length === 0) {
                if (position.column > 1) {
                    var previousCharacter = model.getValueInRange({ startLineNumber: position.lineNumber, startColumn: position.column - 1, endLineNumber: position.lineNumber, endColumn: position.column });
                    if (previousCharacter.trim().length !== 0) {
                        return result;
                    }
                }
            }
            else {
                var lowerCasePrefix_1 = currentPrefix.toLowerCase();
                filter = function (p) {
                    return strings.startsWith(p.label.toLowerCase(), lowerCasePrefix_1);
                };
            }
            var modeId = model.getMode().getId();
            var snippets = [];
            var snipppetsByMode = this._snippets[modeId];
            if (snipppetsByMode) {
                for (var s in snipppetsByMode) {
                    snippets = snippets.concat(snipppetsByMode[s]);
                }
            }
            var defaultSnippets = this._defaultSnippets[modeId];
            if (defaultSnippets) {
                snippets = snippets.concat(defaultSnippets);
            }
            result.suggestions = filter ? snippets.filter(filter) : snippets;
            // if (result.suggestions.length > 0) {
            // 	if (word) {
            // 		// Push also the current word as first suggestion, to avoid unexpected snippet acceptance on Enter.
            // 		result.suggestions = result.suggestions.slice(0);
            // 		result.suggestions.unshift({
            // 			codeSnippet: word.word,
            // 			label: word.word,
            // 			type: 'text'
            // 		});
            // 	}
            // 	result.incomplete = true;
            // }
            return result;
        };
        SnippetsRegistry._defaultSnippets = Object.create(null);
        SnippetsRegistry._snippets = Object.create(null);
        return SnippetsRegistry;
    }());
    exports.SnippetsRegistry = SnippetsRegistry;
});

define("vs/editor/common/modes/supports/characterPair", ["require", "exports", 'vs/editor/common/modes/supports'], function (require, exports, supports_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var CharacterPairSupport = (function () {
        function CharacterPairSupport(modeId, contribution) {
            this._modeId = modeId;
            this._autoClosingPairs = contribution.autoClosingPairs;
            this._surroundingPairs = Array.isArray(contribution.surroundingPairs) ? contribution.surroundingPairs : contribution.autoClosingPairs;
        }
        CharacterPairSupport.prototype.getAutoClosingPairs = function () {
            return this._autoClosingPairs;
        };
        CharacterPairSupport.prototype.shouldAutoClosePair = function (character, context, offset) {
            var _this = this;
            return supports_1.handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this._modeId === nestedMode.getId()) {
                    // Always complete on empty line
                    if (context.getTokenCount() === 0) {
                        return true;
                    }
                    var tokenIndex = context.findIndexOfOffset(offset - 1);
                    var tokenType = context.getTokenType(tokenIndex);
                    for (var i = 0; i < _this._autoClosingPairs.length; ++i) {
                        if (_this._autoClosingPairs[i].open === character) {
                            if (_this._autoClosingPairs[i].notIn) {
                                for (var notInIndex = 0; notInIndex < _this._autoClosingPairs[i].notIn.length; ++notInIndex) {
                                    if (tokenType.indexOf(_this._autoClosingPairs[i].notIn[notInIndex]) > -1) {
                                        return false;
                                    }
                                }
                            }
                            break;
                        }
                    }
                    return true;
                }
                else if (nestedMode.richEditSupport && nestedMode.richEditSupport.characterPair) {
                    return nestedMode.richEditSupport.characterPair.shouldAutoClosePair(character, context, offset);
                }
                else {
                    return null;
                }
            });
        };
        CharacterPairSupport.prototype.getSurroundingPairs = function () {
            return this._surroundingPairs;
        };
        return CharacterPairSupport;
    }());
    exports.CharacterPairSupport = CharacterPairSupport;
});

define("vs/editor/common/modes/supports/declarationSupport", ["require", "exports", 'vs/editor/common/modes/supports'], function (require, exports, supports_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var DeclarationSupport = (function () {
        /**
         * Provide the token type postfixes for the tokens where a declaration can be found in the 'tokens' argument.
         */
        function DeclarationSupport(modeId, contribution) {
            this._modeId = modeId;
            this.contribution = contribution;
        }
        DeclarationSupport.prototype.canFindDeclaration = function (context, offset) {
            var _this = this;
            return supports_1.handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this._modeId === nestedMode.getId()) {
                    return (!Array.isArray(_this.contribution.tokens) ||
                        _this.contribution.tokens.length < 1 ||
                        supports_1.isLineToken(context, offset, _this.contribution.tokens));
                }
                else if (nestedMode.declarationSupport) {
                    return nestedMode.declarationSupport.canFindDeclaration(context, offset);
                }
                else {
                    return false;
                }
            });
        };
        DeclarationSupport.prototype.findDeclaration = function (resource, position) {
            return this.contribution.findDeclaration(resource, position);
        };
        return DeclarationSupport;
    }());
    exports.DeclarationSupport = DeclarationSupport;
});

define("vs/editor/common/modes/supports/parameterHintsSupport", ["require", "exports", 'vs/editor/common/modes/supports'], function (require, exports, supports_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ParameterHintsSupport = (function () {
        function ParameterHintsSupport(modeId, contribution) {
            this._modeId = modeId;
            this.contribution = contribution;
        }
        ParameterHintsSupport.prototype.getParameterHintsTriggerCharacters = function () {
            return this.contribution.triggerCharacters;
        };
        ParameterHintsSupport.prototype.shouldTriggerParameterHints = function (context, offset) {
            var _this = this;
            return supports_1.handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this._modeId === nestedMode.getId()) {
                    if (!Array.isArray(_this.contribution.excludeTokens)) {
                        return true;
                    }
                    if (_this.contribution.excludeTokens.length === 1 && _this.contribution.excludeTokens[0] === '*') {
                        return false;
                    }
                    return !supports_1.isLineToken(context, offset - 1, _this.contribution.excludeTokens);
                }
                else if (nestedMode.parameterHintsSupport) {
                    return nestedMode.parameterHintsSupport.shouldTriggerParameterHints(context, offset);
                }
                else {
                    return false;
                }
            });
        };
        ParameterHintsSupport.prototype.getParameterHints = function (resource, position) {
            return this.contribution.getParameterHints(resource, position);
        };
        return ParameterHintsSupport;
    }());
    exports.ParameterHintsSupport = ParameterHintsSupport;
});

define("vs/editor/common/modes/supports/referenceSupport", ["require", "exports", 'vs/editor/common/modes/supports'], function (require, exports, supports_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ReferenceSupport = (function () {
        /**
         * Provide the token type postfixes for the tokens where a reference can be found in the 'tokens' argument.
         */
        function ReferenceSupport(modeId, contribution) {
            this._modeId = modeId;
            this.contribution = contribution;
        }
        ReferenceSupport.prototype.canFindReferences = function (context, offset) {
            var _this = this;
            return supports_1.handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this._modeId === nestedMode.getId()) {
                    return (!Array.isArray(_this.contribution.tokens) ||
                        _this.contribution.tokens.length < 1 ||
                        supports_1.isLineToken(context, offset, _this.contribution.tokens));
                }
                else if (nestedMode.referenceSupport) {
                    return nestedMode.referenceSupport.canFindReferences(context, offset);
                }
                else {
                    return false;
                }
            });
        };
        ReferenceSupport.prototype.findReferences = function (resource, position, includeDeclaration) {
            return this.contribution.findReferences(resource, position, includeDeclaration);
        };
        return ReferenceSupport;
    }());
    exports.ReferenceSupport = ReferenceSupport;
});

define("vs/editor/common/modes/supports/richEditBrackets", ["require", "exports", 'vs/base/common/strings', 'vs/editor/common/core/range'], function (require, exports, strings, range_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var RichEditBrackets = (function () {
        function RichEditBrackets(modeId, brackets) {
            var _this = this;
            this.brackets = brackets.map(function (b) {
                return {
                    modeId: modeId,
                    open: b[0],
                    close: b[1],
                    forwardRegex: getRegexForBracketPair({ open: b[0], close: b[1] }),
                    reversedRegex: getReversedRegexForBracketPair({ open: b[0], close: b[1] })
                };
            });
            this.forwardRegex = getRegexForBrackets(this.brackets);
            this.reversedRegex = getReversedRegexForBrackets(this.brackets);
            this.textIsBracket = {};
            this.textIsOpenBracket = {};
            this.maxBracketLength = 0;
            this.brackets.forEach(function (b) {
                _this.textIsBracket[b.open] = b;
                _this.textIsBracket[b.close] = b;
                _this.textIsOpenBracket[b.open] = true;
                _this.textIsOpenBracket[b.close] = false;
                _this.maxBracketLength = Math.max(_this.maxBracketLength, b.open.length);
                _this.maxBracketLength = Math.max(_this.maxBracketLength, b.close.length);
            });
        }
        return RichEditBrackets;
    }());
    exports.RichEditBrackets = RichEditBrackets;
    function once(keyFn, computeFn) {
        var cache = {};
        return function (input) {
            var key = keyFn(input);
            if (!cache.hasOwnProperty(key)) {
                cache[key] = computeFn(input);
            }
            return cache[key];
        };
    }
    var getRegexForBracketPair = once(function (input) { return (input.open + ";" + input.close); }, function (input) {
        return createOrRegex([input.open, input.close]);
    });
    var getReversedRegexForBracketPair = once(function (input) { return (input.open + ";" + input.close); }, function (input) {
        return createOrRegex([toReversedString(input.open), toReversedString(input.close)]);
    });
    var getRegexForBrackets = once(function (input) { return input.map(function (b) { return (b.open + ";" + b.close); }).join(';'); }, function (input) {
        var pieces = [];
        input.forEach(function (b) {
            pieces.push(b.open);
            pieces.push(b.close);
        });
        return createOrRegex(pieces);
    });
    var getReversedRegexForBrackets = once(function (input) { return input.map(function (b) { return (b.open + ";" + b.close); }).join(';'); }, function (input) {
        var pieces = [];
        input.forEach(function (b) {
            pieces.push(toReversedString(b.open));
            pieces.push(toReversedString(b.close));
        });
        return createOrRegex(pieces);
    });
    function createOrRegex(pieces) {
        var regexStr = "(" + pieces.map(strings.escapeRegExpCharacters).join(')|(') + ")";
        return strings.createRegExp(regexStr, true, false, false, false);
    }
    function toReversedString(str) {
        var reversedStr = '';
        for (var i = str.length - 1; i >= 0; i--) {
            reversedStr += str.charAt(i);
        }
        return reversedStr;
    }
    var BracketsUtils = (function () {
        function BracketsUtils() {
        }
        BracketsUtils._findPrevBracketInText = function (reversedBracketRegex, lineNumber, reversedText, offset) {
            var m = reversedText.match(reversedBracketRegex);
            if (!m) {
                return null;
            }
            var matchOffset = reversedText.length - m.index;
            var matchLength = m[0].length;
            var absoluteMatchOffset = offset + matchOffset;
            return new range_1.Range(lineNumber, absoluteMatchOffset - matchLength + 1, lineNumber, absoluteMatchOffset + 1);
        };
        BracketsUtils.findPrevBracketInToken = function (reversedBracketRegex, lineNumber, lineText, currentTokenStart, currentTokenEnd) {
            // Because JS does not support backwards regex search, we search forwards in a reversed string with a reversed regex ;)
            var currentTokenReversedText = '';
            for (var index = currentTokenEnd - 1; index >= currentTokenStart; index--) {
                currentTokenReversedText += lineText.charAt(index);
            }
            return this._findPrevBracketInText(reversedBracketRegex, lineNumber, currentTokenReversedText, currentTokenStart);
        };
        BracketsUtils.findNextBracketInText = function (bracketRegex, lineNumber, text, offset) {
            var m = text.match(bracketRegex);
            if (!m) {
                return null;
            }
            var matchOffset = m.index;
            var matchLength = m[0].length;
            var absoluteMatchOffset = offset + matchOffset;
            return new range_1.Range(lineNumber, absoluteMatchOffset + 1, lineNumber, absoluteMatchOffset + 1 + matchLength);
        };
        BracketsUtils.findNextBracketInToken = function (bracketRegex, lineNumber, lineText, currentTokenStart, currentTokenEnd) {
            var currentTokenText = lineText.substring(currentTokenStart, currentTokenEnd);
            return this.findNextBracketInText(bracketRegex, lineNumber, currentTokenText, currentTokenStart);
        };
        return BracketsUtils;
    }());
    exports.BracketsUtils = BracketsUtils;
});

define("vs/editor/common/modes/supports/electricCharacter", ["require", "exports", 'vs/base/common/strings', 'vs/editor/common/modes/supports', 'vs/editor/common/modes/supports/richEditBrackets'], function (require, exports, strings, supports_1, richEditBrackets_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var BracketElectricCharacterSupport = (function () {
        function BracketElectricCharacterSupport(modeId, brackets, contribution) {
            this._modeId = modeId;
            this.contribution = contribution || {};
            this.brackets = new Brackets(modeId, brackets, this.contribution.docComment, this.contribution.caseInsensitive);
        }
        BracketElectricCharacterSupport.prototype.getElectricCharacters = function () {
            if (Array.isArray(this.contribution.embeddedElectricCharacters)) {
                return this.contribution.embeddedElectricCharacters.concat(this.brackets.getElectricCharacters());
            }
            return this.brackets.getElectricCharacters();
        };
        BracketElectricCharacterSupport.prototype.onElectricCharacter = function (context, offset) {
            var _this = this;
            return supports_1.handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this._modeId === nestedMode.getId()) {
                    return _this.brackets.onElectricCharacter(context, offset);
                }
                else if (nestedMode.richEditSupport && nestedMode.richEditSupport.electricCharacter) {
                    return nestedMode.richEditSupport.electricCharacter.onElectricCharacter(context, offset);
                }
                else {
                    return null;
                }
            });
        };
        return BracketElectricCharacterSupport;
    }());
    exports.BracketElectricCharacterSupport = BracketElectricCharacterSupport;
    var Brackets = (function () {
        function Brackets(modeId, richEditBrackets, docComment, caseInsensitive) {
            if (docComment === void 0) { docComment = null; }
            if (caseInsensitive === void 0) { caseInsensitive = false; }
            this._modeId = modeId;
            this._richEditBrackets = richEditBrackets;
            this._docComment = docComment ? docComment : null;
        }
        Brackets.prototype.getElectricCharacters = function () {
            var result = [];
            if (this._richEditBrackets) {
                for (var i = 0, len = this._richEditBrackets.brackets.length; i < len; i++) {
                    var bracketPair = this._richEditBrackets.brackets[i];
                    var lastChar = bracketPair.close.charAt(bracketPair.close.length - 1);
                    result.push(lastChar);
                }
            }
            // Doc comments
            if (this._docComment) {
                result.push(this._docComment.open.charAt(this._docComment.open.length - 1));
            }
            // Filter duplicate entries
            result = result.filter(function (item, pos, array) {
                return array.indexOf(item) === pos;
            });
            return result;
        };
        Brackets.prototype.onElectricCharacter = function (context, offset) {
            if (context.getTokenCount() === 0) {
                return null;
            }
            return (this._onElectricCharacterDocComment(context, offset) ||
                this._onElectricCharacterStandardBrackets(context, offset));
        };
        Brackets.prototype.containsTokenTypes = function (fullTokenSpec, tokensToLookFor) {
            var array = tokensToLookFor.split('.');
            for (var i = 0; i < array.length; ++i) {
                if (fullTokenSpec.indexOf(array[i]) < 0) {
                    return false;
                }
            }
            return true;
        };
        Brackets.prototype._onElectricCharacterStandardBrackets = function (context, offset) {
            if (!this._richEditBrackets || this._richEditBrackets.brackets.length === 0) {
                return null;
            }
            var reversedBracketRegex = this._richEditBrackets.reversedRegex;
            var lineText = context.getLineContent();
            var tokenIndex = context.findIndexOfOffset(offset);
            var tokenStart = context.getTokenStartIndex(tokenIndex);
            var tokenEnd = offset + 1;
            var firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(context.getLineContent());
            if (firstNonWhitespaceIndex !== -1 && firstNonWhitespaceIndex < tokenStart) {
                return null;
            }
            if (!supports_1.ignoreBracketsInToken(context.getTokenType(tokenIndex))) {
                var r = richEditBrackets_1.BracketsUtils.findPrevBracketInToken(reversedBracketRegex, 1, lineText, tokenStart, tokenEnd);
                if (r) {
                    var text = lineText.substring(r.startColumn - 1, r.endColumn - 1);
                    var isOpen = this._richEditBrackets.textIsOpenBracket[text];
                    if (!isOpen) {
                        return {
                            matchOpenBracket: text
                        };
                    }
                }
            }
            return null;
        };
        Brackets.prototype._onElectricCharacterDocComment = function (context, offset) {
            // We only auto-close, so do nothing if there is no closing part.
            if (!this._docComment || !this._docComment.close) {
                return null;
            }
            var line = context.getLineContent();
            var char = line[offset];
            // See if the right electric character was pressed
            if (char !== this._docComment.open.charAt(this._docComment.open.length - 1)) {
                return null;
            }
            // If this line already contains the closing tag, do nothing.
            if (line.indexOf(this._docComment.close, offset) >= 0) {
                return null;
            }
            // If we're not in a documentation comment, do nothing.
            var lastTokenIndex = context.findIndexOfOffset(offset);
            if (!this.containsTokenTypes(context.getTokenType(lastTokenIndex), this._docComment.scope)) {
                return null;
            }
            if (line.substring(context.getTokenStartIndex(lastTokenIndex), offset + 1 /* include electric char*/) !== this._docComment.open) {
                return null;
            }
            return { appendText: this._docComment.close };
        };
        return Brackets;
    }());
    exports.Brackets = Brackets;
});

define("vs/editor/common/viewModel/prefixSumComputer", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var PrefixSumComputer = (function () {
        function PrefixSumComputer(values) {
            this.values = values;
            this.prefixSum = [];
            for (var i = 0, len = this.values.length; i < len; i++) {
                this.prefixSum[i] = 0;
            }
            this.prefixSumValidIndex = -1;
        }
        PrefixSumComputer.prototype.getCount = function () {
            return this.values.length;
        };
        PrefixSumComputer.prototype.insertValue = function (insertIndex, value) {
            this.values.splice(insertIndex, 0, value);
            this.prefixSum.splice(insertIndex, 0, 0);
            if (insertIndex - 1 < this.prefixSumValidIndex) {
                this.prefixSumValidIndex = insertIndex - 1;
            }
        };
        PrefixSumComputer.prototype.insertValues = function (insertIndex, values) {
            if (values.length === 0) {
                return;
            }
            this.values = this.values.slice(0, insertIndex).concat(values).concat(this.values.slice(insertIndex));
            this.prefixSum = this.prefixSum.slice(0, insertIndex).concat(PrefixSumComputer._zeroArray(values.length)).concat(this.prefixSum.slice(insertIndex));
            if (insertIndex - 1 < this.prefixSumValidIndex) {
                this.prefixSumValidIndex = insertIndex - 1;
            }
        };
        PrefixSumComputer._zeroArray = function (count) {
            var r = new Array(count);
            for (var i = 0; i < count; i++) {
                r[i] = 0;
            }
            return r;
        };
        PrefixSumComputer.prototype.changeValue = function (index, value) {
            if (this.values[index] === value) {
                return;
            }
            this.values[index] = value;
            if (index - 1 < this.prefixSumValidIndex) {
                this.prefixSumValidIndex = index - 1;
            }
        };
        PrefixSumComputer.prototype.removeValues = function (startIndex, cnt) {
            this.values.splice(startIndex, cnt);
            this.prefixSum.splice(startIndex, cnt);
            if (startIndex - 1 < this.prefixSumValidIndex) {
                this.prefixSumValidIndex = startIndex - 1;
            }
        };
        PrefixSumComputer.prototype.getTotalValue = function () {
            if (this.values.length === 0) {
                return 0;
            }
            return this.getAccumulatedValue(this.values.length - 1);
        };
        PrefixSumComputer.prototype.getAccumulatedValue = function (index) {
            if (index < 0) {
                return 0;
            }
            if (index <= this.prefixSumValidIndex) {
                return this.prefixSum[index];
            }
            var startIndex = this.prefixSumValidIndex + 1;
            if (startIndex === 0) {
                this.prefixSum[0] = this.values[0];
                startIndex++;
            }
            if (index >= this.values.length) {
                index = this.values.length - 1;
            }
            for (var i = startIndex; i <= index; i++) {
                this.prefixSum[i] = this.prefixSum[i - 1] + this.values[i];
            }
            this.prefixSumValidIndex = Math.max(this.prefixSumValidIndex, index);
            return this.prefixSum[index];
        };
        PrefixSumComputer.prototype.getIndexOf = function (accumulatedValue, result) {
            var low = 0, high = this.values.length - 1, mid, midStart, midStop;
            while (low <= high) {
                mid = low + ((high - low) / 2) | 0;
                midStop = this.getAccumulatedValue(mid);
                midStart = midStop - this.values[mid];
                if (accumulatedValue < midStart) {
                    high = mid - 1;
                }
                else if (accumulatedValue >= midStop) {
                    low = mid + 1;
                }
                else {
                    break;
                }
            }
            result.index = mid;
            result.remainder = accumulatedValue - midStart;
        };
        return PrefixSumComputer;
    }());
    exports.PrefixSumComputer = PrefixSumComputer;
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

define("vs/editor/common/model/editStack", ["require", "exports", 'vs/base/common/errors'], function (require, exports, errors_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var EditStack = (function () {
        function EditStack(model) {
            this.model = model;
            this.currentOpenStackElement = null;
            this.past = [];
            this.future = [];
        }
        EditStack.prototype.pushStackElement = function () {
            if (this.currentOpenStackElement !== null) {
                this.past.push(this.currentOpenStackElement);
                this.currentOpenStackElement = null;
            }
        };
        EditStack.prototype.clear = function () {
            this.currentOpenStackElement = null;
            this.past = [];
            this.future = [];
        };
        EditStack.prototype.pushEditOperation = function (beforeCursorState, editOperations, cursorStateComputer) {
            // No support for parallel universes :(
            this.future = [];
            if (!this.currentOpenStackElement) {
                this.currentOpenStackElement = {
                    beforeVersionId: this.model.getAlternativeVersionId(),
                    beforeCursorState: beforeCursorState,
                    editOperations: [],
                    afterCursorState: null,
                    afterVersionId: -1
                };
            }
            var inverseEditOperation = {
                operations: this.model.applyEdits(editOperations)
            };
            this.currentOpenStackElement.editOperations.push(inverseEditOperation);
            try {
                this.currentOpenStackElement.afterCursorState = cursorStateComputer ? cursorStateComputer(inverseEditOperation.operations) : null;
            }
            catch (e) {
                errors_1.onUnexpectedError(e);
                this.currentOpenStackElement.afterCursorState = null;
            }
            this.currentOpenStackElement.afterVersionId = this.model.getVersionId();
            return this.currentOpenStackElement.afterCursorState;
        };
        EditStack.prototype.undo = function () {
            this.pushStackElement();
            if (this.past.length > 0) {
                var pastStackElement = this.past.pop();
                try {
                    // Apply all operations in reverse order
                    for (var i = pastStackElement.editOperations.length - 1; i >= 0; i--) {
                        pastStackElement.editOperations[i] = {
                            operations: this.model.applyEdits(pastStackElement.editOperations[i].operations)
                        };
                    }
                }
                catch (e) {
                    this.clear();
                    return null;
                }
                this.future.push(pastStackElement);
                return {
                    selections: pastStackElement.beforeCursorState,
                    recordedVersionId: pastStackElement.beforeVersionId
                };
            }
            return null;
        };
        EditStack.prototype.redo = function () {
            if (this.future.length > 0) {
                if (this.currentOpenStackElement) {
                    throw new Error('How is this possible?');
                }
                var futureStackElement = this.future.pop();
                try {
                    // Apply all operations
                    for (var i = 0; i < futureStackElement.editOperations.length; i++) {
                        futureStackElement.editOperations[i] = {
                            operations: this.model.applyEdits(futureStackElement.editOperations[i].operations)
                        };
                    }
                }
                catch (e) {
                    this.clear();
                    return null;
                }
                this.past.push(futureStackElement);
                return {
                    selections: futureStackElement.afterCursorState,
                    recordedVersionId: futureStackElement.afterVersionId
                };
            }
            return null;
        };
        return EditStack;
    }());
    exports.EditStack = EditStack;
});

define("vs/editor/common/model/tokensBinaryEncoding", ["require", "exports", 'vs/base/common/errors', 'vs/base/common/strings'], function (require, exports, errors_1, strings) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var InflatedToken = (function () {
        function InflatedToken(startIndex, type) {
            this.startIndex = startIndex;
            this.type = type;
        }
        InflatedToken.prototype.toString = function () {
            return '{ ' + this.startIndex + ', \'' + this.type + '\'}';
        };
        return InflatedToken;
    }());
    exports.START_INDEX_MASK = 0xffffffff;
    exports.TYPE_MASK = 0xffff;
    exports.START_INDEX_OFFSET = 1;
    exports.TYPE_OFFSET = Math.pow(2, 32);
    var DEFAULT_TOKEN = {
        startIndex: 0,
        type: ''
    };
    var INFLATED_TOKENS_EMPTY_TEXT = [];
    var DEFLATED_TOKENS_EMPTY_TEXT = [];
    var INFLATED_TOKENS_NON_EMPTY_TEXT = [DEFAULT_TOKEN];
    var DEFLATED_TOKENS_NON_EMPTY_TEXT = [0];
    function deflateArr(map, tokens) {
        if (tokens.length === 0) {
            return DEFLATED_TOKENS_EMPTY_TEXT;
        }
        if (tokens.length === 1 && tokens[0].startIndex === 0 && !tokens[0].type) {
            return DEFLATED_TOKENS_NON_EMPTY_TEXT;
        }
        var i, len, deflatedToken, deflated, token, inflateMap = map._inflate, deflateMap = map._deflate, prevStartIndex = -1, result = new Array(tokens.length);
        for (i = 0, len = tokens.length; i < len; i++) {
            token = tokens[i];
            if (token.startIndex <= prevStartIndex) {
                token.startIndex = prevStartIndex + 1;
                errors_1.onUnexpectedError({
                    message: 'Invalid tokens detected',
                    tokens: tokens
                });
            }
            if (deflateMap.hasOwnProperty(token.type)) {
                deflatedToken = deflateMap[token.type];
            }
            else {
                deflatedToken = inflateMap.length;
                deflateMap[token.type] = deflatedToken;
                inflateMap.push(token.type);
            }
            // http://stackoverflow.com/a/2803010
            // All numbers in JavaScript are actually IEEE-754 compliant floating-point doubles.
            // These have a 53-bit mantissa which should mean that any integer value with a magnitude
            // of approximately 9 quadrillion or less -- more specifically, 9,007,199,254,740,991 --
            // will be represented accurately.
            // http://stackoverflow.com/a/6729252
            // Bitwise operations cast numbers to 32bit representation in JS
            // 32 bits for startIndex => up to 2^32 = 4,294,967,296
            // 16 bits for token => up to 2^16 = 65,536
            // [token][startIndex]
            deflated = deflatedToken * exports.TYPE_OFFSET + token.startIndex * exports.START_INDEX_OFFSET;
            result[i] = deflated;
            prevStartIndex = token.startIndex;
        }
        return result;
    }
    exports.deflateArr = deflateArr;
    function inflate(map, binaryEncodedToken) {
        if (binaryEncodedToken === 0) {
            return DEFAULT_TOKEN;
        }
        var startIndex = (binaryEncodedToken / exports.START_INDEX_OFFSET) & exports.START_INDEX_MASK;
        var deflatedType = (binaryEncodedToken / exports.TYPE_OFFSET) & exports.TYPE_MASK;
        return new InflatedToken(startIndex, map._inflate[deflatedType]);
    }
    exports.inflate = inflate;
    function getStartIndex(binaryEncodedToken) {
        return (binaryEncodedToken / exports.START_INDEX_OFFSET) & exports.START_INDEX_MASK;
    }
    exports.getStartIndex = getStartIndex;
    function getType(map, binaryEncodedToken) {
        var deflatedType = (binaryEncodedToken / exports.TYPE_OFFSET) & exports.TYPE_MASK;
        if (deflatedType === 0) {
            return strings.empty;
        }
        return map._inflate[deflatedType];
    }
    exports.getType = getType;
    function inflateArr(map, binaryEncodedTokens) {
        if (binaryEncodedTokens.length === 0) {
            return INFLATED_TOKENS_EMPTY_TEXT;
        }
        if (binaryEncodedTokens.length === 1 && binaryEncodedTokens[0] === 0) {
            return INFLATED_TOKENS_NON_EMPTY_TEXT;
        }
        var result = new Array(binaryEncodedTokens.length), i, len, deflated, startIndex, deflatedType, inflateMap = map._inflate;
        for (i = 0, len = binaryEncodedTokens.length; i < len; i++) {
            deflated = binaryEncodedTokens[i];
            startIndex = (deflated / exports.START_INDEX_OFFSET) & exports.START_INDEX_MASK;
            deflatedType = (deflated / exports.TYPE_OFFSET) & exports.TYPE_MASK;
            result[i] = new InflatedToken(startIndex, inflateMap[deflatedType]);
        }
        return result;
    }
    exports.inflateArr = inflateArr;
    function findIndexOfOffset(binaryEncodedTokens, offset) {
        return findIndexInSegmentsArray(binaryEncodedTokens, offset);
    }
    exports.findIndexOfOffset = findIndexOfOffset;
    function sliceAndInflate(map, binaryEncodedTokens, startOffset, endOffset, deltaStartIndex) {
        if (binaryEncodedTokens.length === 0) {
            return INFLATED_TOKENS_EMPTY_TEXT;
        }
        if (binaryEncodedTokens.length === 1 && binaryEncodedTokens[0] === 0) {
            return INFLATED_TOKENS_NON_EMPTY_TEXT;
        }
        var startIndex = findIndexInSegmentsArray(binaryEncodedTokens, startOffset), i, len, originalToken, originalStartIndex, newStartIndex, deflatedType, result = [], inflateMap = map._inflate;
        originalToken = binaryEncodedTokens[startIndex];
        deflatedType = (originalToken / exports.TYPE_OFFSET) & exports.TYPE_MASK;
        newStartIndex = 0;
        result.push(new InflatedToken(newStartIndex, inflateMap[deflatedType]));
        for (i = startIndex + 1, len = binaryEncodedTokens.length; i < len; i++) {
            originalToken = binaryEncodedTokens[i];
            originalStartIndex = (originalToken / exports.START_INDEX_OFFSET) & exports.START_INDEX_MASK;
            if (originalStartIndex >= endOffset) {
                break;
            }
            deflatedType = (originalToken / exports.TYPE_OFFSET) & exports.TYPE_MASK;
            newStartIndex = originalStartIndex - startOffset + deltaStartIndex;
            result.push(new InflatedToken(newStartIndex, inflateMap[deflatedType]));
        }
        return result;
    }
    exports.sliceAndInflate = sliceAndInflate;
    function findIndexInSegmentsArray(arr, desiredIndex) {
        var low = 0, high = arr.length - 1, mid, value;
        while (low < high) {
            mid = low + Math.ceil((high - low) / 2);
            value = arr[mid] & 0xffffffff;
            if (value > desiredIndex) {
                high = mid - 1;
            }
            else {
                low = mid;
            }
        }
        return low;
    }
    exports.findIndexInSegmentsArray = findIndexInSegmentsArray;
});

define("vs/editor/common/editorCommon", ["require", "exports", 'vs/editor/common/model/tokensBinaryEncoding'], function (require, exports, TokensBinaryEncoding) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * The direction of a selection.
     */
    (function (SelectionDirection) {
        /**
         * The selection starts above where it ends.
         */
        SelectionDirection[SelectionDirection["LTR"] = 0] = "LTR";
        /**
         * The selection starts below where it ends.
         */
        SelectionDirection[SelectionDirection["RTL"] = 1] = "RTL";
    })(exports.SelectionDirection || (exports.SelectionDirection = {}));
    var SelectionDirection = exports.SelectionDirection;
    (function (WrappingIndent) {
        WrappingIndent[WrappingIndent["None"] = 0] = "None";
        WrappingIndent[WrappingIndent["Same"] = 1] = "Same";
        WrappingIndent[WrappingIndent["Indent"] = 2] = "Indent";
    })(exports.WrappingIndent || (exports.WrappingIndent = {}));
    var WrappingIndent = exports.WrappingIndent;
    function wrappingIndentFromString(wrappingIndent) {
        if (wrappingIndent === 'indent') {
            return WrappingIndent.Indent;
        }
        else if (wrappingIndent === 'same') {
            return WrappingIndent.Same;
        }
        else {
            return WrappingIndent.None;
        }
    }
    exports.wrappingIndentFromString = wrappingIndentFromString;
    /**
     * Vertical Lane in the overview ruler of the editor.
     */
    (function (OverviewRulerLane) {
        OverviewRulerLane[OverviewRulerLane["Left"] = 1] = "Left";
        OverviewRulerLane[OverviewRulerLane["Center"] = 2] = "Center";
        OverviewRulerLane[OverviewRulerLane["Right"] = 4] = "Right";
        OverviewRulerLane[OverviewRulerLane["Full"] = 7] = "Full";
    })(exports.OverviewRulerLane || (exports.OverviewRulerLane = {}));
    var OverviewRulerLane = exports.OverviewRulerLane;
    /**
     * End of line character preference.
     */
    (function (EndOfLinePreference) {
        /**
         * Use the end of line character identified in the text buffer.
         */
        EndOfLinePreference[EndOfLinePreference["TextDefined"] = 0] = "TextDefined";
        /**
         * Use line feed (\n) as the end of line character.
         */
        EndOfLinePreference[EndOfLinePreference["LF"] = 1] = "LF";
        /**
         * Use carriage return and line feed (\r\n) as the end of line character.
         */
        EndOfLinePreference[EndOfLinePreference["CRLF"] = 2] = "CRLF";
    })(exports.EndOfLinePreference || (exports.EndOfLinePreference = {}));
    var EndOfLinePreference = exports.EndOfLinePreference;
    /**
     * The default end of line to use when instantiating models.
     */
    (function (DefaultEndOfLine) {
        /**
         * Use line feed (\n) as the end of line character.
         */
        DefaultEndOfLine[DefaultEndOfLine["LF"] = 1] = "LF";
        /**
         * Use carriage return and line feed (\r\n) as the end of line character.
         */
        DefaultEndOfLine[DefaultEndOfLine["CRLF"] = 2] = "CRLF";
    })(exports.DefaultEndOfLine || (exports.DefaultEndOfLine = {}));
    var DefaultEndOfLine = exports.DefaultEndOfLine;
    /**
     * End of line character preference.
     */
    (function (EndOfLineSequence) {
        /**
         * Use line feed (\n) as the end of line character.
         */
        EndOfLineSequence[EndOfLineSequence["LF"] = 0] = "LF";
        /**
         * Use carriage return and line feed (\r\n) as the end of line character.
         */
        EndOfLineSequence[EndOfLineSequence["CRLF"] = 1] = "CRLF";
    })(exports.EndOfLineSequence || (exports.EndOfLineSequence = {}));
    var EndOfLineSequence = exports.EndOfLineSequence;
    exports.LineTokensBinaryEncoding = TokensBinaryEncoding;
    (function (TrackedRangeStickiness) {
        TrackedRangeStickiness[TrackedRangeStickiness["AlwaysGrowsWhenTypingAtEdges"] = 0] = "AlwaysGrowsWhenTypingAtEdges";
        TrackedRangeStickiness[TrackedRangeStickiness["NeverGrowsWhenTypingAtEdges"] = 1] = "NeverGrowsWhenTypingAtEdges";
        TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingBefore"] = 2] = "GrowsOnlyWhenTypingBefore";
        TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingAfter"] = 3] = "GrowsOnlyWhenTypingAfter";
    })(exports.TrackedRangeStickiness || (exports.TrackedRangeStickiness = {}));
    var TrackedRangeStickiness = exports.TrackedRangeStickiness;
    (function (VerticalRevealType) {
        VerticalRevealType[VerticalRevealType["Simple"] = 0] = "Simple";
        VerticalRevealType[VerticalRevealType["Center"] = 1] = "Center";
        VerticalRevealType[VerticalRevealType["CenterIfOutsideViewport"] = 2] = "CenterIfOutsideViewport";
    })(exports.VerticalRevealType || (exports.VerticalRevealType = {}));
    var VerticalRevealType = exports.VerticalRevealType;
    /**
     * Type of hit element with the mouse in the editor.
     */
    (function (MouseTargetType) {
        /**
         * Mouse is on top of an unknown element.
         */
        MouseTargetType[MouseTargetType["UNKNOWN"] = 0] = "UNKNOWN";
        /**
         * Mouse is on top of the textarea used for input.
         */
        MouseTargetType[MouseTargetType["TEXTAREA"] = 1] = "TEXTAREA";
        /**
         * Mouse is on top of the glyph margin
         */
        MouseTargetType[MouseTargetType["GUTTER_GLYPH_MARGIN"] = 2] = "GUTTER_GLYPH_MARGIN";
        /**
         * Mouse is on top of the line numbers
         */
        MouseTargetType[MouseTargetType["GUTTER_LINE_NUMBERS"] = 3] = "GUTTER_LINE_NUMBERS";
        /**
         * Mouse is on top of the line decorations
         */
        MouseTargetType[MouseTargetType["GUTTER_LINE_DECORATIONS"] = 4] = "GUTTER_LINE_DECORATIONS";
        /**
         * Mouse is on top of the whitespace left in the gutter by a view zone.
         */
        MouseTargetType[MouseTargetType["GUTTER_VIEW_ZONE"] = 5] = "GUTTER_VIEW_ZONE";
        /**
         * Mouse is on top of text in the content.
         */
        MouseTargetType[MouseTargetType["CONTENT_TEXT"] = 6] = "CONTENT_TEXT";
        /**
         * Mouse is on top of empty space in the content (e.g. after line text or below last line)
         */
        MouseTargetType[MouseTargetType["CONTENT_EMPTY"] = 7] = "CONTENT_EMPTY";
        /**
         * Mouse is on top of a view zone in the content.
         */
        MouseTargetType[MouseTargetType["CONTENT_VIEW_ZONE"] = 8] = "CONTENT_VIEW_ZONE";
        /**
         * Mouse is on top of a content widget.
         */
        MouseTargetType[MouseTargetType["CONTENT_WIDGET"] = 9] = "CONTENT_WIDGET";
        /**
         * Mouse is on top of the decorations overview ruler.
         */
        MouseTargetType[MouseTargetType["OVERVIEW_RULER"] = 10] = "OVERVIEW_RULER";
        /**
         * Mouse is on top of a scrollbar.
         */
        MouseTargetType[MouseTargetType["SCROLLBAR"] = 11] = "SCROLLBAR";
        /**
         * Mouse is on top of an overlay widget.
         */
        MouseTargetType[MouseTargetType["OVERLAY_WIDGET"] = 12] = "OVERLAY_WIDGET";
    })(exports.MouseTargetType || (exports.MouseTargetType = {}));
    var MouseTargetType = exports.MouseTargetType;
    exports.KEYBINDING_CONTEXT_EDITOR_TEXT_FOCUS = 'editorTextFocus';
    exports.KEYBINDING_CONTEXT_EDITOR_FOCUS = 'editorFocus';
    exports.KEYBINDING_CONTEXT_EDITOR_TAB_MOVES_FOCUS = 'editorTabMovesFocus';
    exports.KEYBINDING_CONTEXT_EDITOR_HAS_MULTIPLE_SELECTIONS = 'editorHasMultipleSelections';
    exports.KEYBINDING_CONTEXT_EDITOR_HAS_NON_EMPTY_SELECTION = 'editorHasSelection';
    exports.KEYBINDING_CONTEXT_EDITOR_LANGUAGE_ID = 'editorLangId';
    exports.SHOW_ACCESSIBILITY_HELP_ACTION_ID = 'editor.action.showAccessibilityHelp';
    exports.ViewEventNames = {
        ModelFlushedEvent: 'modelFlushedEvent',
        LinesDeletedEvent: 'linesDeletedEvent',
        LinesInsertedEvent: 'linesInsertedEvent',
        LineChangedEvent: 'lineChangedEvent',
        TokensChangedEvent: 'tokensChangedEvent',
        DecorationsChangedEvent: 'decorationsChangedEvent',
        CursorPositionChangedEvent: 'cursorPositionChangedEvent',
        CursorSelectionChangedEvent: 'cursorSelectionChangedEvent',
        RevealRangeEvent: 'revealRangeEvent',
        LineMappingChangedEvent: 'lineMappingChangedEvent',
        ScrollRequestEvent: 'scrollRequestEvent'
    };
    (function (CodeEditorStateFlag) {
        CodeEditorStateFlag[CodeEditorStateFlag["Value"] = 0] = "Value";
        CodeEditorStateFlag[CodeEditorStateFlag["Selection"] = 1] = "Selection";
        CodeEditorStateFlag[CodeEditorStateFlag["Position"] = 2] = "Position";
        CodeEditorStateFlag[CodeEditorStateFlag["Scroll"] = 3] = "Scroll";
    })(exports.CodeEditorStateFlag || (exports.CodeEditorStateFlag = {}));
    var CodeEditorStateFlag = exports.CodeEditorStateFlag;
    exports.EditorType = {
        ICodeEditor: 'vs.editor.ICodeEditor',
        IDiffEditor: 'vs.editor.IDiffEditor'
    };
    exports.ClassName = {
        EditorWarningDecoration: 'greensquiggly',
        EditorErrorDecoration: 'redsquiggly'
    };
    exports.EventType = {
        Disposed: 'disposed',
        ConfigurationChanged: 'configurationChanged',
        ModelDispose: 'modelDispose',
        ModelChanged: 'modelChanged',
        ModelTokensChanged: 'modelTokensChanged',
        ModelModeChanged: 'modelsModeChanged',
        ModelModeSupportChanged: 'modelsModeSupportChanged',
        ModelOptionsChanged: 'modelOptionsChanged',
        ModelContentChanged: 'contentChanged',
        ModelContentChanged2: 'contentChanged2',
        ModelContentChangedFlush: 'flush',
        ModelContentChangedLinesDeleted: 'linesDeleted',
        ModelContentChangedLinesInserted: 'linesInserted',
        ModelContentChangedLineChanged: 'lineChanged',
        EditorTextBlur: 'blur',
        EditorTextFocus: 'focus',
        EditorFocus: 'widgetFocus',
        EditorBlur: 'widgetBlur',
        ModelDecorationsChanged: 'decorationsChanged',
        CursorPositionChanged: 'positionChanged',
        CursorSelectionChanged: 'selectionChanged',
        CursorRevealRange: 'revealRange',
        CursorScrollRequest: 'scrollRequest',
        ViewFocusGained: 'focusGained',
        ViewFocusLost: 'focusLost',
        ViewFocusChanged: 'focusChanged',
        ViewScrollWidthChanged: 'scrollWidthChanged',
        ViewScrollHeightChanged: 'scrollHeightChanged',
        ViewScrollChanged: 'scrollChanged',
        ViewZonesChanged: 'zonesChanged',
        ViewLayoutChanged: 'viewLayoutChanged',
        ContextMenu: 'contextMenu',
        MouseDown: 'mousedown',
        MouseUp: 'mouseup',
        MouseMove: 'mousemove',
        MouseLeave: 'mouseleave',
        KeyDown: 'keydown',
        KeyUp: 'keyup',
        EditorLayout: 'editorLayout',
        DiffUpdated: 'diffUpdated'
    };
    exports.Handler = {
        ExecuteCommand: 'executeCommand',
        ExecuteCommands: 'executeCommands',
        CursorLeft: 'cursorLeft',
        CursorLeftSelect: 'cursorLeftSelect',
        CursorWordLeft: 'cursorWordLeft',
        CursorWordStartLeft: 'cursorWordStartLeft',
        CursorWordEndLeft: 'cursorWordEndLeft',
        CursorWordLeftSelect: 'cursorWordLeftSelect',
        CursorWordStartLeftSelect: 'cursorWordStartLeftSelect',
        CursorWordEndLeftSelect: 'cursorWordEndLeftSelect',
        CursorRight: 'cursorRight',
        CursorRightSelect: 'cursorRightSelect',
        CursorWordRight: 'cursorWordRight',
        CursorWordStartRight: 'cursorWordStartRight',
        CursorWordEndRight: 'cursorWordEndRight',
        CursorWordRightSelect: 'cursorWordRightSelect',
        CursorWordStartRightSelect: 'cursorWordStartRightSelect',
        CursorWordEndRightSelect: 'cursorWordEndRightSelect',
        CursorUp: 'cursorUp',
        CursorUpSelect: 'cursorUpSelect',
        CursorDown: 'cursorDown',
        CursorDownSelect: 'cursorDownSelect',
        CursorPageUp: 'cursorPageUp',
        CursorPageUpSelect: 'cursorPageUpSelect',
        CursorPageDown: 'cursorPageDown',
        CursorPageDownSelect: 'cursorPageDownSelect',
        CursorHome: 'cursorHome',
        CursorHomeSelect: 'cursorHomeSelect',
        CursorEnd: 'cursorEnd',
        CursorEndSelect: 'cursorEndSelect',
        ExpandLineSelection: 'expandLineSelection',
        CursorTop: 'cursorTop',
        CursorTopSelect: 'cursorTopSelect',
        CursorBottom: 'cursorBottom',
        CursorBottomSelect: 'cursorBottomSelect',
        CursorColumnSelectLeft: 'cursorColumnSelectLeft',
        CursorColumnSelectRight: 'cursorColumnSelectRight',
        CursorColumnSelectUp: 'cursorColumnSelectUp',
        CursorColumnSelectPageUp: 'cursorColumnSelectPageUp',
        CursorColumnSelectDown: 'cursorColumnSelectDown',
        CursorColumnSelectPageDown: 'cursorColumnSelectPageDown',
        AddCursorDown: 'addCursorDown',
        AddCursorUp: 'addCursorUp',
        CursorUndo: 'cursorUndo',
        MoveTo: 'moveTo',
        MoveToSelect: 'moveToSelect',
        ColumnSelect: 'columnSelect',
        CreateCursor: 'createCursor',
        LastCursorMoveToSelect: 'lastCursorMoveToSelect',
        JumpToBracket: 'jumpToBracket',
        Type: 'type',
        ReplacePreviousChar: 'replacePreviousChar',
        Paste: 'paste',
        Tab: 'tab',
        Indent: 'indent',
        Outdent: 'outdent',
        DeleteLeft: 'deleteLeft',
        DeleteRight: 'deleteRight',
        DeleteWordLeft: 'deleteWordLeft',
        DeleteWordStartLeft: 'deleteWordStartLeft',
        DeleteWordEndLeft: 'deleteWordEndLeft',
        DeleteWordRight: 'deleteWordRight',
        DeleteWordStartRight: 'deleteWordStartRight',
        DeleteWordEndRight: 'deleteWordEndRight',
        DeleteAllLeft: 'deleteAllLeft',
        DeleteAllRight: 'deleteAllRight',
        Enter: 'enter',
        RemoveSecondaryCursors: 'removeSecondaryCursors',
        CancelSelection: 'cancelSelection',
        Cut: 'cut',
        Undo: 'undo',
        Redo: 'redo',
        WordSelect: 'wordSelect',
        WordSelectDrag: 'wordSelectDrag',
        LastCursorWordSelect: 'lastCursorWordSelect',
        LineSelect: 'lineSelect',
        LineSelectDrag: 'lineSelectDrag',
        LastCursorLineSelect: 'lastCursorLineSelect',
        LastCursorLineSelectDrag: 'lastCursorLineSelectDrag',
        LineInsertBefore: 'lineInsertBefore',
        LineInsertAfter: 'lineInsertAfter',
        LineBreakInsert: 'lineBreakInsert',
        SelectAll: 'selectAll',
        ScrollLineUp: 'scrollLineUp',
        ScrollLineDown: 'scrollLineDown',
        ScrollPageUp: 'scrollPageUp',
        ScrollPageDown: 'scrollPageDown'
    };
    var VisibleRange = (function () {
        function VisibleRange(top, left, width) {
            this.top = top;
            this.left = left;
            this.width = width;
        }
        return VisibleRange;
    }());
    exports.VisibleRange = VisibleRange;
    (function (TextEditorCursorStyle) {
        TextEditorCursorStyle[TextEditorCursorStyle["Line"] = 1] = "Line";
        TextEditorCursorStyle[TextEditorCursorStyle["Block"] = 2] = "Block";
        TextEditorCursorStyle[TextEditorCursorStyle["Underline"] = 3] = "Underline";
    })(exports.TextEditorCursorStyle || (exports.TextEditorCursorStyle = {}));
    var TextEditorCursorStyle = exports.TextEditorCursorStyle;
    function cursorStyleFromString(cursorStyle) {
        if (cursorStyle === 'line') {
            return TextEditorCursorStyle.Line;
        }
        else if (cursorStyle === 'block') {
            return TextEditorCursorStyle.Block;
        }
        else if (cursorStyle === 'underline') {
            return TextEditorCursorStyle.Underline;
        }
        return TextEditorCursorStyle.Line;
    }
    exports.cursorStyleFromString = cursorStyleFromString;
    function cursorStyleToString(cursorStyle) {
        if (cursorStyle === TextEditorCursorStyle.Line) {
            return 'line';
        }
        else if (cursorStyle === TextEditorCursorStyle.Block) {
            return 'block';
        }
        else if (cursorStyle === TextEditorCursorStyle.Underline) {
            return 'underline';
        }
        else {
            throw new Error('cursorStyleToString: Unknown cursorStyle');
        }
    }
    exports.cursorStyleToString = cursorStyleToString;
    var HorizontalRange = (function () {
        function HorizontalRange(left, width) {
            this.left = left;
            this.width = width;
        }
        return HorizontalRange;
    }());
    exports.HorizontalRange = HorizontalRange;
    var LineVisibleRanges = (function () {
        function LineVisibleRanges(lineNumber, ranges) {
            this.lineNumber = lineNumber;
            this.ranges = ranges;
        }
        return LineVisibleRanges;
    }());
    exports.LineVisibleRanges = LineVisibleRanges;
});

define("vs/editor/common/model/modelLine", ["require", "exports", 'vs/base/common/strings', 'vs/editor/common/editorCommon'], function (require, exports, strings, editorCommon_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var NO_OP_TOKENS_ADJUSTER = {
        adjust: function () { },
        finish: function () { }
    };
    var NO_OP_MARKERS_ADJUSTER = {
        adjustDelta: function () { },
        adjustSet: function () { },
        finish: function () { }
    };
    var MarkerMoveSemantics;
    (function (MarkerMoveSemantics) {
        MarkerMoveSemantics[MarkerMoveSemantics["MarkerDefined"] = 0] = "MarkerDefined";
        MarkerMoveSemantics[MarkerMoveSemantics["ForceMove"] = 1] = "ForceMove";
        MarkerMoveSemantics[MarkerMoveSemantics["ForceStay"] = 2] = "ForceStay";
    })(MarkerMoveSemantics || (MarkerMoveSemantics = {}));
    var ModelLine = (function () {
        function ModelLine(lineNumber, text) {
            this.lineNumber = lineNumber;
            this.text = text;
            this.isInvalid = false;
        }
        // --- BEGIN STATE
        ModelLine.prototype.setState = function (state) {
            this._state = state;
        };
        ModelLine.prototype.getState = function () {
            return this._state || null;
        };
        // --- END STATE
        // --- BEGIN MODE TRANSITIONS
        ModelLine.prototype._setModeTransitions = function (topLevelMode, modeTransitions) {
            var desired = toModeTransitions(topLevelMode, modeTransitions);
            if (desired === null) {
                // saving memory
                if (typeof this._modeTransitions === 'undefined') {
                    return;
                }
                this._modeTransitions = null;
                return;
            }
            this._modeTransitions = desired;
        };
        ModelLine.prototype.getModeTransitions = function () {
            if (this._modeTransitions) {
                return this._modeTransitions;
            }
            return DefaultModeTransitions.INSTANCE;
        };
        // --- END MODE TRANSITIONS
        // --- BEGIN TOKENS
        ModelLine.prototype.setTokens = function (map, tokens, topLevelMode, modeTransitions) {
            this._setLineTokens(map, tokens);
            this._setModeTransitions(topLevelMode, modeTransitions);
        };
        ModelLine.prototype._setLineTokens = function (map, tokens) {
            var desired = toLineTokens(map, tokens, this.text.length);
            if (desired === null) {
                // saving memory
                if (typeof this._lineTokens === 'undefined') {
                    return;
                }
                this._lineTokens = null;
                return;
            }
            this._lineTokens = desired;
        };
        ModelLine.prototype.getTokens = function () {
            if (this._lineTokens) {
                return this._lineTokens;
            }
            if (this.text.length === 0) {
                return EmptyLineTokens.INSTANCE;
            }
            return DefaultLineTokens.INSTANCE;
        };
        // --- END TOKENS
        ModelLine.prototype._createTokensAdjuster = function () {
            if (!this._lineTokens) {
                // This line does not have real tokens, so there is nothing to adjust
                return NO_OP_TOKENS_ADJUSTER;
            }
            var lineTokens = this._lineTokens;
            var BIN = editorCommon_1.LineTokensBinaryEncoding;
            var tokens = lineTokens.getBinaryEncodedTokens();
            var tokensLength = tokens.length;
            var tokensIndex = 0;
            var currentTokenStartIndex = 0;
            var adjust = function (toColumn, delta, minimumAllowedColumn) {
                // console.log('before call: tokensIndex: ' + tokensIndex + ': ' + String(this.getTokens()));
                // console.log('adjustTokens: ' + toColumn + ' with delta: ' + delta + ' and [' + minimumAllowedColumn + ']');
                // console.log('currentTokenStartIndex: ' + currentTokenStartIndex);
                var minimumAllowedIndex = minimumAllowedColumn - 1;
                while (currentTokenStartIndex < toColumn && tokensIndex < tokensLength) {
                    if (currentTokenStartIndex > 0 && delta !== 0) {
                        // adjust token's `startIndex` by `delta`
                        var deflatedType = (tokens[tokensIndex] / BIN.TYPE_OFFSET) & BIN.TYPE_MASK;
                        var newStartIndex = Math.max(minimumAllowedIndex, currentTokenStartIndex + delta);
                        var newToken = deflatedType * BIN.TYPE_OFFSET + newStartIndex * BIN.START_INDEX_OFFSET;
                        if (delta < 0) {
                            // pop all previous tokens that have become `collapsed`
                            while (tokensIndex > 0) {
                                var prevTokenStartIndex = (tokens[tokensIndex - 1] / BIN.START_INDEX_OFFSET) & BIN.START_INDEX_MASK;
                                if (prevTokenStartIndex >= newStartIndex) {
                                    // Token at `tokensIndex` - 1 is now `collapsed` => pop it
                                    tokens.splice(tokensIndex - 1, 1);
                                    tokensLength--;
                                    tokensIndex--;
                                }
                                else {
                                    break;
                                }
                            }
                        }
                        tokens[tokensIndex] = newToken;
                    }
                    tokensIndex++;
                    if (tokensIndex < tokensLength) {
                        currentTokenStartIndex = (tokens[tokensIndex] / BIN.START_INDEX_OFFSET) & BIN.START_INDEX_MASK;
                    }
                }
                // console.log('after call: tokensIndex: ' + tokensIndex + ': ' + String(this.getTokens()));
            };
            var finish = function (delta, lineTextLength) {
                adjust(Number.MAX_VALUE, delta, 1);
            };
            return {
                adjust: adjust,
                finish: finish
            };
        };
        ModelLine.prototype._setText = function (text) {
            this.text = text;
            if (this._lineTokens) {
                var BIN = editorCommon_1.LineTokensBinaryEncoding, map = this._lineTokens.getBinaryEncodedTokensMap(), tokens = this._lineTokens.getBinaryEncodedTokens(), lineTextLength = this.text.length;
                // Remove overflowing tokens
                while (tokens.length > 0) {
                    var lastTokenStartIndex = (tokens[tokens.length - 1] / BIN.START_INDEX_OFFSET) & BIN.START_INDEX_MASK;
                    if (lastTokenStartIndex < lineTextLength) {
                        // Valid token
                        break;
                    }
                    // This token now overflows the text => remove it
                    tokens.pop();
                }
                this._setLineTokens(map, tokens);
            }
        };
        // private _printMarkers(): string {
        // 	if (!this._markers) {
        // 		return '[]';
        // 	}
        // 	if (this._markers.length === 0) {
        // 		return '[]';
        // 	}
        // 	var markers = this._markers;
        // 	var printMarker = (m:ILineMarker) => {
        // 		if (m.stickToPreviousCharacter) {
        // 			return '|' + m.column;
        // 		}
        // 		return m.column + '|';
        // 	};
        // 	return '[' + markers.map(printMarker).join(', ') + ']';
        // }
        ModelLine.prototype._createMarkersAdjuster = function (changedMarkers) {
            var _this = this;
            if (!this._markers) {
                return NO_OP_MARKERS_ADJUSTER;
            }
            if (this._markers.length === 0) {
                return NO_OP_MARKERS_ADJUSTER;
            }
            this._markers.sort(ModelLine._compareMarkers);
            var markers = this._markers;
            var markersLength = markers.length;
            var markersIndex = 0;
            var marker = markers[markersIndex];
            // console.log('------------- INITIAL MARKERS: ' + this._printMarkers());
            var adjustMarkerBeforeColumn = function (toColumn, moveSemantics) {
                if (marker.column < toColumn) {
                    return true;
                }
                if (marker.column > toColumn) {
                    return false;
                }
                if (moveSemantics === MarkerMoveSemantics.ForceMove) {
                    return false;
                }
                if (moveSemantics === MarkerMoveSemantics.ForceStay) {
                    return true;
                }
                return marker.stickToPreviousCharacter;
            };
            var adjustDelta = function (toColumn, delta, minimumAllowedColumn, moveSemantics) {
                // console.log('------------------------------');
                // console.log('adjustDelta called: toColumn: ' + toColumn + ', delta: ' + delta + ', minimumAllowedColumn: ' + minimumAllowedColumn + ', moveSemantics: ' + MarkerMoveSemantics[moveSemantics]);
                // console.log('BEFORE::: markersIndex: ' + markersIndex + ' : ' + this._printMarkers());
                while (markersIndex < markersLength && adjustMarkerBeforeColumn(toColumn, moveSemantics)) {
                    if (delta !== 0) {
                        var newColumn = Math.max(minimumAllowedColumn, marker.column + delta);
                        if (marker.column !== newColumn) {
                            changedMarkers[marker.id] = true;
                            marker.oldLineNumber = marker.oldLineNumber || _this.lineNumber;
                            marker.oldColumn = marker.oldColumn || marker.column;
                            marker.column = newColumn;
                        }
                    }
                    markersIndex++;
                    if (markersIndex < markersLength) {
                        marker = markers[markersIndex];
                    }
                }
                // console.log('AFTER::: markersIndex: ' + markersIndex + ' : ' + this._printMarkers());
            };
            var adjustSet = function (toColumn, newColumn, moveSemantics) {
                // console.log('------------------------------');
                // console.log('adjustSet called: toColumn: ' + toColumn + ', newColumn: ' + newColumn + ', moveSemantics: ' + MarkerMoveSemantics[moveSemantics]);
                // console.log('BEFORE::: markersIndex: ' + markersIndex + ' : ' + this._printMarkers());
                while (markersIndex < markersLength && adjustMarkerBeforeColumn(toColumn, moveSemantics)) {
                    if (marker.column !== newColumn) {
                        changedMarkers[marker.id] = true;
                        marker.oldLineNumber = marker.oldLineNumber || _this.lineNumber;
                        marker.oldColumn = marker.oldColumn || marker.column;
                        marker.column = newColumn;
                    }
                    markersIndex++;
                    if (markersIndex < markersLength) {
                        marker = markers[markersIndex];
                    }
                }
                // console.log('AFTER::: markersIndex: ' + markersIndex + ' : ' + this._printMarkers());
            };
            var finish = function (delta, lineTextLength) {
                adjustDelta(Number.MAX_VALUE, delta, 1, MarkerMoveSemantics.MarkerDefined);
                // console.log('------------- FINAL MARKERS: ' + this._printMarkers());
            };
            return {
                adjustDelta: adjustDelta,
                adjustSet: adjustSet,
                finish: finish
            };
        };
        ModelLine.prototype.applyEdits = function (changedMarkers, edits) {
            var deltaColumn = 0;
            var resultText = this.text;
            var tokensAdjuster = this._createTokensAdjuster();
            var markersAdjuster = this._createMarkersAdjuster(changedMarkers);
            for (var i = 0, len = edits.length; i < len; i++) {
                var edit = edits[i];
                // console.log();
                // console.log('=============================');
                // console.log('EDIT #' + i + ' [ ' + edit.startColumn + ' -> ' + edit.endColumn + ' ] : <<<' + edit.text + '>>>, forceMoveMarkers: ' + edit.forceMoveMarkers);
                // console.log('deltaColumn: ' + deltaColumn);
                var startColumn = deltaColumn + edit.startColumn;
                var endColumn = deltaColumn + edit.endColumn;
                var deletingCnt = endColumn - startColumn;
                var insertingCnt = edit.text.length;
                // Adjust tokens & markers before this edit
                // console.log('Adjust tokens & markers before this edit');
                tokensAdjuster.adjust(edit.startColumn - 1, deltaColumn, 1);
                markersAdjuster.adjustDelta(edit.startColumn, deltaColumn, 1, edit.forceMoveMarkers ? MarkerMoveSemantics.ForceMove : (deletingCnt > 0 ? MarkerMoveSemantics.ForceStay : MarkerMoveSemantics.MarkerDefined));
                // Adjust tokens & markers for the common part of this edit
                var commonLength = Math.min(deletingCnt, insertingCnt);
                if (commonLength > 0) {
                    // console.log('Adjust tokens & markers for the common part of this edit');
                    tokensAdjuster.adjust(edit.startColumn - 1 + commonLength, deltaColumn, startColumn);
                    if (!edit.forceMoveMarkers) {
                        markersAdjuster.adjustDelta(edit.startColumn + commonLength, deltaColumn, startColumn, edit.forceMoveMarkers ? MarkerMoveSemantics.ForceMove : (deletingCnt > insertingCnt ? MarkerMoveSemantics.ForceStay : MarkerMoveSemantics.MarkerDefined));
                    }
                }
                // Perform the edit & update `deltaColumn`
                resultText = resultText.substring(0, startColumn - 1) + edit.text + resultText.substring(endColumn - 1);
                deltaColumn += insertingCnt - deletingCnt;
                // Adjust tokens & markers inside this edit
                // console.log('Adjust tokens & markers inside this edit');
                tokensAdjuster.adjust(edit.endColumn, deltaColumn, startColumn);
                markersAdjuster.adjustSet(edit.endColumn, startColumn + insertingCnt, edit.forceMoveMarkers ? MarkerMoveSemantics.ForceMove : MarkerMoveSemantics.MarkerDefined);
            }
            // Wrap up tokens & markers; adjust remaining if needed
            tokensAdjuster.finish(deltaColumn, resultText.length);
            markersAdjuster.finish(deltaColumn, resultText.length);
            // Save the resulting text
            this._setText(resultText);
            return deltaColumn;
        };
        ModelLine.prototype.split = function (changedMarkers, splitColumn, forceMoveMarkers) {
            // console.log('--> split @ ' + splitColumn + '::: ' + this._printMarkers());
            var myText = this.text.substring(0, splitColumn - 1);
            var otherText = this.text.substring(splitColumn - 1);
            var otherMarkers = null;
            if (this._markers) {
                this._markers.sort(ModelLine._compareMarkers);
                for (var i = 0, len = this._markers.length; i < len; i++) {
                    var marker = this._markers[i];
                    if (marker.column > splitColumn
                        || (marker.column === splitColumn
                            && (forceMoveMarkers
                                || !marker.stickToPreviousCharacter))) {
                        var myMarkers = this._markers.slice(0, i);
                        otherMarkers = this._markers.slice(i);
                        this._markers = myMarkers;
                        break;
                    }
                }
                if (otherMarkers) {
                    for (var i = 0, len = otherMarkers.length; i < len; i++) {
                        var marker = otherMarkers[i];
                        changedMarkers[marker.id] = true;
                        marker.oldLineNumber = marker.oldLineNumber || this.lineNumber;
                        marker.oldColumn = marker.oldColumn || marker.column;
                        marker.column -= splitColumn - 1;
                    }
                }
            }
            this._setText(myText);
            var otherLine = new ModelLine(this.lineNumber + 1, otherText);
            if (otherMarkers) {
                otherLine.addMarkers(otherMarkers);
            }
            return otherLine;
        };
        ModelLine.prototype.append = function (changedMarkers, other) {
            // console.log('--> append: THIS :: ' + this._printMarkers());
            // console.log('--> append: OTHER :: ' + this._printMarkers());
            var thisTextLength = this.text.length;
            this._setText(this.text + other.text);
            var otherLineTokens = other._lineTokens;
            if (otherLineTokens) {
                // Other has real tokens
                var otherTokens = otherLineTokens.getBinaryEncodedTokens();
                // Adjust other tokens
                if (thisTextLength > 0) {
                    var BIN = editorCommon_1.LineTokensBinaryEncoding;
                    for (var i = 0, len = otherTokens.length; i < len; i++) {
                        var token = otherTokens[i];
                        var deflatedStartIndex = (token / BIN.START_INDEX_OFFSET) & BIN.START_INDEX_MASK;
                        var deflatedType = (token / BIN.TYPE_OFFSET) & BIN.TYPE_MASK;
                        var newStartIndex = deflatedStartIndex + thisTextLength;
                        var newToken = deflatedType * BIN.TYPE_OFFSET + newStartIndex * BIN.START_INDEX_OFFSET;
                        otherTokens[i] = newToken;
                    }
                }
                // Append other tokens
                var myLineTokens = this._lineTokens;
                if (myLineTokens) {
                    // I have real tokens
                    this._setLineTokens(myLineTokens.getBinaryEncodedTokensMap(), myLineTokens.getBinaryEncodedTokens().concat(otherTokens));
                }
                else {
                    // I don't have real tokens
                    this._setLineTokens(otherLineTokens.getBinaryEncodedTokensMap(), otherTokens);
                }
            }
            if (other._markers) {
                // Other has markers
                var otherMarkers = other._markers;
                // Adjust other markers
                for (var i = 0, len = otherMarkers.length; i < len; i++) {
                    var marker = otherMarkers[i];
                    changedMarkers[marker.id] = true;
                    marker.oldLineNumber = marker.oldLineNumber || other.lineNumber;
                    marker.oldColumn = marker.oldColumn || marker.column;
                    marker.column += thisTextLength;
                }
                this.addMarkers(otherMarkers);
            }
        };
        ModelLine.prototype.addMarker = function (marker) {
            marker.line = this;
            if (!this._markers) {
                this._markers = [marker];
            }
            else {
                this._markers.push(marker);
            }
        };
        ModelLine.prototype.addMarkers = function (markers) {
            if (markers.length === 0) {
                return;
            }
            var i, len;
            for (i = 0, len = markers.length; i < len; i++) {
                markers[i].line = this;
            }
            if (!this._markers) {
                this._markers = markers.slice(0);
            }
            else {
                this._markers = this._markers.concat(markers);
            }
        };
        ModelLine._compareMarkers = function (a, b) {
            if (a.column === b.column) {
                return (a.stickToPreviousCharacter ? 0 : 1) - (b.stickToPreviousCharacter ? 0 : 1);
            }
            return a.column - b.column;
        };
        ModelLine.prototype.removeMarker = function (marker) {
            var index = this._indexOfMarkerId(marker.id);
            if (index >= 0) {
                this._markers.splice(index, 1);
            }
            marker.line = null;
        };
        ModelLine.prototype.removeMarkers = function (deleteMarkers) {
            if (!this._markers) {
                return;
            }
            for (var i = 0, len = this._markers.length; i < len; i++) {
                var marker = this._markers[i];
                if (deleteMarkers[marker.id]) {
                    marker.line = null;
                    this._markers.splice(i, 1);
                    len--;
                    i--;
                }
            }
        };
        ModelLine.prototype.getMarkers = function () {
            if (!this._markers) {
                return [];
            }
            return this._markers.slice(0);
        };
        ModelLine.prototype.updateLineNumber = function (changedMarkers, newLineNumber) {
            if (this._markers) {
                var markers = this._markers, i, len, marker;
                for (i = 0, len = markers.length; i < len; i++) {
                    marker = markers[i];
                    changedMarkers[marker.id] = true;
                    marker.oldLineNumber = marker.oldLineNumber || this.lineNumber;
                }
            }
            this.lineNumber = newLineNumber;
        };
        ModelLine.prototype.deleteLine = function (changedMarkers, setMarkersColumn, setMarkersOldLineNumber) {
            // console.log('--> deleteLine: ');
            if (this._markers) {
                var markers = this._markers, i, len, marker;
                // Mark all these markers as changed
                for (i = 0, len = markers.length; i < len; i++) {
                    marker = markers[i];
                    changedMarkers[marker.id] = true;
                    marker.oldColumn = marker.oldColumn || marker.column;
                    marker.oldLineNumber = marker.oldLineNumber || setMarkersOldLineNumber;
                    marker.column = setMarkersColumn;
                }
                return markers;
            }
            return [];
        };
        ModelLine.prototype._indexOfMarkerId = function (markerId) {
            if (this._markers) {
                var markers = this._markers, i, len;
                for (i = 0, len = markers.length; i < len; i++) {
                    if (markers[i].id === markerId) {
                        return i;
                    }
                }
            }
            return -1;
        };
        return ModelLine;
    }());
    exports.ModelLine = ModelLine;
    function areDeflatedTokens(tokens) {
        return (typeof tokens[0] === 'number');
    }
    function toLineTokens(map, tokens, textLength) {
        if (textLength === 0) {
            return null;
        }
        if (!tokens || tokens.length === 0) {
            return null;
        }
        if (tokens.length === 1) {
            if (areDeflatedTokens(tokens)) {
                if (tokens[0] === 0) {
                    return null;
                }
            }
            else {
                if (tokens[0].startIndex === 0 && tokens[0].type === '') {
                    return null;
                }
            }
        }
        return new LineTokens(map, tokens);
    }
    var getStartIndex = editorCommon_1.LineTokensBinaryEncoding.getStartIndex;
    var getType = editorCommon_1.LineTokensBinaryEncoding.getType;
    var findIndexOfOffset = editorCommon_1.LineTokensBinaryEncoding.findIndexOfOffset;
    var LineTokens = (function () {
        function LineTokens(map, tokens) {
            this.map = map;
            if (areDeflatedTokens(tokens)) {
                this._tokens = tokens;
            }
            else {
                this._tokens = editorCommon_1.LineTokensBinaryEncoding.deflateArr(map, tokens);
            }
        }
        LineTokens.prototype.toString = function () {
            return editorCommon_1.LineTokensBinaryEncoding.inflateArr(this.map, this._tokens).toString();
        };
        LineTokens.prototype.getBinaryEncodedTokensMap = function () {
            return this.map;
        };
        LineTokens.prototype.getBinaryEncodedTokens = function () {
            return this._tokens;
        };
        LineTokens.prototype.getTokenCount = function () {
            return this._tokens.length;
        };
        LineTokens.prototype.getTokenStartIndex = function (tokenIndex) {
            return getStartIndex(this._tokens[tokenIndex]);
        };
        LineTokens.prototype.getTokenType = function (tokenIndex) {
            return getType(this.map, this._tokens[tokenIndex]);
        };
        LineTokens.prototype.getTokenEndIndex = function (tokenIndex, textLength) {
            if (tokenIndex + 1 < this._tokens.length) {
                return getStartIndex(this._tokens[tokenIndex + 1]);
            }
            return textLength;
        };
        LineTokens.prototype.equals = function (other) {
            return this === other;
        };
        LineTokens.prototype.findIndexOfOffset = function (offset) {
            return findIndexOfOffset(this._tokens, offset);
        };
        return LineTokens;
    }());
    exports.LineTokens = LineTokens;
    var EmptyLineTokens = (function () {
        function EmptyLineTokens() {
        }
        EmptyLineTokens.prototype.getBinaryEncodedTokens = function () {
            return EmptyLineTokens.TOKENS;
        };
        EmptyLineTokens.prototype.getBinaryEncodedTokensMap = function () {
            return null;
        };
        EmptyLineTokens.prototype.getTokenCount = function () {
            return 0;
        };
        EmptyLineTokens.prototype.getTokenStartIndex = function (tokenIndex) {
            return 0;
        };
        EmptyLineTokens.prototype.getTokenType = function (tokenIndex) {
            return strings.empty;
        };
        EmptyLineTokens.prototype.getTokenEndIndex = function (tokenIndex, textLength) {
            return 0;
        };
        EmptyLineTokens.prototype.equals = function (other) {
            return other === this;
        };
        EmptyLineTokens.prototype.findIndexOfOffset = function (offset) {
            return 0;
        };
        EmptyLineTokens.INSTANCE = new EmptyLineTokens();
        EmptyLineTokens.TOKENS = [];
        return EmptyLineTokens;
    }());
    var DefaultLineTokens = (function () {
        function DefaultLineTokens() {
        }
        DefaultLineTokens.prototype.getBinaryEncodedTokensMap = function () {
            return null;
        };
        DefaultLineTokens.prototype.getBinaryEncodedTokens = function () {
            return DefaultLineTokens.TOKENS;
        };
        DefaultLineTokens.prototype.getTokenCount = function () {
            return 1;
        };
        DefaultLineTokens.prototype.getTokenStartIndex = function (tokenIndex) {
            return 0;
        };
        DefaultLineTokens.prototype.getTokenType = function (tokenIndex) {
            return strings.empty;
        };
        DefaultLineTokens.prototype.getTokenEndIndex = function (tokenIndex, textLength) {
            return textLength;
        };
        DefaultLineTokens.prototype.equals = function (other) {
            return this === other;
        };
        DefaultLineTokens.prototype.findIndexOfOffset = function (offset) {
            return 0;
        };
        DefaultLineTokens.INSTANCE = new DefaultLineTokens();
        DefaultLineTokens.TOKENS = [0];
        return DefaultLineTokens;
    }());
    exports.DefaultLineTokens = DefaultLineTokens;
    function toModeTransitions(topLevelMode, modeTransitions) {
        if (!modeTransitions || modeTransitions.length === 0) {
            return null;
        }
        else if (modeTransitions.length === 1 && modeTransitions[0].startIndex === 0) {
            if (modeTransitions[0].mode === topLevelMode) {
                return null;
            }
            else {
                return new SingleModeTransition(modeTransitions[0].mode);
            }
        }
        return new ModeTransitions(modeTransitions);
    }
    var DefaultModeTransitions = (function () {
        function DefaultModeTransitions() {
        }
        DefaultModeTransitions.prototype.toArray = function (topLevelMode) {
            return [{
                    startIndex: 0,
                    mode: topLevelMode
                }];
        };
        DefaultModeTransitions.INSTANCE = new DefaultModeTransitions();
        return DefaultModeTransitions;
    }());
    var SingleModeTransition = (function () {
        function SingleModeTransition(mode) {
            this._mode = mode;
        }
        SingleModeTransition.prototype.toArray = function (topLevelMode) {
            return [{
                    startIndex: 0,
                    mode: this._mode
                }];
        };
        return SingleModeTransition;
    }());
    var ModeTransitions = (function () {
        function ModeTransitions(modeTransitions) {
            this._modeTransitions = modeTransitions;
        }
        ModeTransitions.prototype.toArray = function (topLevelMode) {
            return this._modeTransitions.slice(0);
        };
        return ModeTransitions;
    }());
});

define("vs/editor/common/model/tokenIterator", ["require", "exports", 'vs/editor/common/editorCommon'], function (require, exports, editorCommon) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var getStartIndex = editorCommon.LineTokensBinaryEncoding.getStartIndex;
    var inflate = editorCommon.LineTokensBinaryEncoding.inflate;
    var TokenIterator = (function () {
        function TokenIterator(model, position) {
            this._model = model;
            this._currentLineNumber = position.lineNumber;
            this._currentTokenIndex = 0;
            this._readLineTokens(this._currentLineNumber);
            this._next = null;
            this._prev = null;
            // start with a position to next/prev run
            var columnIndex = position.column - 1, tokenEndIndex = Number.MAX_VALUE;
            for (var i = this._currentTokens.length - 1; i >= 0; i--) {
                if (getStartIndex(this._currentTokens[i]) <= columnIndex && columnIndex <= tokenEndIndex) {
                    this._currentTokenIndex = i;
                    this._next = this._current();
                    this._prev = this._current();
                    break;
                }
                tokenEndIndex = getStartIndex(this._currentTokens[i]);
            }
        }
        TokenIterator.prototype._readLineTokens = function (lineNumber) {
            this._currentLineTokens = this._model.getLineTokens(lineNumber, false);
            this._currentTokens = this._currentLineTokens.getBinaryEncodedTokens();
            this._map = this._currentLineTokens.getBinaryEncodedTokensMap();
        };
        TokenIterator.prototype._advanceNext = function () {
            this._prev = this._next;
            this._next = null;
            if (this._currentTokenIndex + 1 < this._currentTokens.length) {
                // There are still tokens on current line
                this._currentTokenIndex++;
                this._next = this._current();
            }
            else {
                // find the next line with tokens
                while (this._currentLineNumber + 1 <= this._model.getLineCount()) {
                    this._currentLineNumber++;
                    this._readLineTokens(this._currentLineNumber);
                    if (this._currentTokens.length > 0) {
                        this._currentTokenIndex = 0;
                        this._next = this._current();
                        break;
                    }
                }
                if (this._next === null) {
                    // prepare of a previous run
                    this._readLineTokens(this._currentLineNumber);
                    this._currentTokenIndex = this._currentTokens.length;
                    this._advancePrev();
                    this._next = null;
                }
            }
        };
        TokenIterator.prototype._advancePrev = function () {
            this._next = this._prev;
            this._prev = null;
            if (this._currentTokenIndex > 0) {
                // There are still tokens on current line
                this._currentTokenIndex--;
                this._prev = this._current();
            }
            else {
                // find previous line with tokens
                while (this._currentLineNumber > 1) {
                    this._currentLineNumber--;
                    this._readLineTokens(this._currentLineNumber);
                    if (this._currentTokens.length > 0) {
                        this._currentTokenIndex = this._currentTokens.length - 1;
                        this._prev = this._current();
                        break;
                    }
                }
            }
        };
        TokenIterator.prototype._current = function () {
            return {
                token: inflate(this._map, this._currentTokens[this._currentTokenIndex]),
                lineNumber: this._currentLineNumber,
                startColumn: getStartIndex(this._currentTokens[this._currentTokenIndex]) + 1,
                endColumn: this._currentTokenIndex + 1 < this._currentTokens.length ? getStartIndex(this._currentTokens[this._currentTokenIndex + 1]) + 1 : this._model.getLineContent(this._currentLineNumber).length + 1
            };
        };
        TokenIterator.prototype.hasNext = function () {
            return this._next !== null;
        };
        TokenIterator.prototype.next = function () {
            var result = this._next;
            this._advanceNext();
            return result;
        };
        TokenIterator.prototype.hasPrev = function () {
            return this._prev !== null;
        };
        TokenIterator.prototype.prev = function () {
            var result = this._prev;
            this._advancePrev();
            return result;
        };
        TokenIterator.prototype._invalidate = function () {
            // replace all public functions with errors
            var errorFn = function () {
                throw new Error('iteration isn\'t valid anymore');
            };
            this.hasNext = errorFn;
            this.next = errorFn;
            this.hasPrev = errorFn;
            this.prev = errorFn;
        };
        return TokenIterator;
    }());
    exports.TokenIterator = TokenIterator;
});

define("vs/editor/common/modes/supports/onEnter", ["require", "exports", 'vs/base/common/errors', 'vs/base/common/strings', 'vs/editor/common/core/position', 'vs/editor/common/modes', 'vs/editor/common/modes/supports'], function (require, exports, errors_1, strings, position_1, modes_1, supports_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var OnEnterSupport = (function () {
        function OnEnterSupport(modeId, opts) {
            opts = opts || {};
            opts.brackets = opts.brackets || [
                ['(', ')'],
                ['{', '}'],
                ['[', ']']
            ];
            this._modeId = modeId;
            this._brackets = opts.brackets.map(function (bracket) {
                return {
                    open: bracket[0],
                    openRegExp: OnEnterSupport._createOpenBracketRegExp(bracket[0]),
                    close: bracket[1],
                    closeRegExp: OnEnterSupport._createCloseBracketRegExp(bracket[1]),
                };
            });
            this._regExpRules = opts.regExpRules || [];
            this._indentationRules = opts.indentationRules;
        }
        OnEnterSupport.prototype.onEnter = function (model, position) {
            var _this = this;
            var context = model.getLineContext(position.lineNumber);
            return supports_1.handleEvent(context, position.column - 1, function (nestedMode, context, offset) {
                if (_this._modeId === nestedMode.getId()) {
                    return _this._onEnter(model, position);
                }
                else if (nestedMode.richEditSupport && nestedMode.richEditSupport.onEnter) {
                    return nestedMode.richEditSupport.onEnter.onEnter(model, position);
                }
                else {
                    return null;
                }
            });
        };
        OnEnterSupport.prototype._onEnter = function (model, position) {
            var lineText = model.getLineContent(position.lineNumber);
            var beforeEnterText = lineText.substr(0, position.column - 1);
            var afterEnterText = lineText.substr(position.column - 1);
            var oneLineAboveText = position.lineNumber === 1 ? '' : model.getLineContent(position.lineNumber - 1);
            return this._actualOnEnter(oneLineAboveText, beforeEnterText, afterEnterText);
        };
        OnEnterSupport.prototype._actualOnEnter = function (oneLineAboveText, beforeEnterText, afterEnterText) {
            // (1): `regExpRules`
            for (var i = 0, len = this._regExpRules.length; i < len; i++) {
                var rule = this._regExpRules[i];
                if (rule.beforeText.test(beforeEnterText)) {
                    if (rule.afterText) {
                        if (rule.afterText.test(afterEnterText)) {
                            return rule.action;
                        }
                    }
                    else {
                        return rule.action;
                    }
                }
            }
            // (2): Special indent-outdent
            if (beforeEnterText.length > 0 && afterEnterText.length > 0) {
                for (var i = 0, len = this._brackets.length; i < len; i++) {
                    var bracket = this._brackets[i];
                    if (bracket.openRegExp.test(beforeEnterText) && bracket.closeRegExp.test(afterEnterText)) {
                        return OnEnterSupport._INDENT_OUTDENT;
                    }
                }
            }
            // (3): Indentation Support
            if (this._indentationRules) {
                if (this._indentationRules.increaseIndentPattern && this._indentationRules.increaseIndentPattern.test(beforeEnterText)) {
                    return OnEnterSupport._INDENT;
                }
                if (this._indentationRules.indentNextLinePattern && this._indentationRules.indentNextLinePattern.test(beforeEnterText)) {
                    return OnEnterSupport._INDENT;
                }
                if (/^\s/.test(beforeEnterText)) {
                    // No reason to run regular expressions if there is nothing to outdent from
                    if (this._indentationRules.decreaseIndentPattern && this._indentationRules.decreaseIndentPattern.test(afterEnterText)) {
                        return OnEnterSupport._OUTDENT;
                    }
                    if (this._indentationRules.indentNextLinePattern && this._indentationRules.indentNextLinePattern.test(oneLineAboveText)) {
                        return OnEnterSupport._OUTDENT;
                    }
                }
            }
            // (4): Open bracket based logic
            if (beforeEnterText.length > 0) {
                for (var i = 0, len = this._brackets.length; i < len; i++) {
                    var bracket = this._brackets[i];
                    if (bracket.openRegExp.test(beforeEnterText)) {
                        return OnEnterSupport._INDENT;
                    }
                }
            }
            return null;
        };
        OnEnterSupport._createOpenBracketRegExp = function (bracket) {
            var str = strings.escapeRegExpCharacters(bracket);
            if (!/\B/.test(str.charAt(0))) {
                str = '\\b' + str;
            }
            str += '\\s*$';
            return OnEnterSupport._safeRegExp(str);
        };
        OnEnterSupport._createCloseBracketRegExp = function (bracket) {
            var str = strings.escapeRegExpCharacters(bracket);
            if (!/\B/.test(str.charAt(str.length - 1))) {
                str = str + '\\b';
            }
            str = '^\\s*' + str;
            return OnEnterSupport._safeRegExp(str);
        };
        OnEnterSupport._safeRegExp = function (def) {
            try {
                return new RegExp(def);
            }
            catch (err) {
                errors_1.onUnexpectedError(err);
                return null;
            }
        };
        OnEnterSupport._INDENT = { indentAction: modes_1.IndentAction.Indent };
        OnEnterSupport._INDENT_OUTDENT = { indentAction: modes_1.IndentAction.IndentOutdent };
        OnEnterSupport._OUTDENT = { indentAction: modes_1.IndentAction.Outdent };
        return OnEnterSupport;
    }());
    exports.OnEnterSupport = OnEnterSupport;
    function getRawEnterActionAtPosition(model, lineNumber, column) {
        var result;
        var richEditSupport = model.getMode().richEditSupport;
        if (richEditSupport && richEditSupport.onEnter) {
            try {
                result = richEditSupport.onEnter.onEnter(model, new position_1.Position(lineNumber, column));
            }
            catch (e) {
                errors_1.onUnexpectedError(e);
            }
        }
        return result;
    }
    exports.getRawEnterActionAtPosition = getRawEnterActionAtPosition;
    function getEnterActionAtPosition(model, lineNumber, column) {
        var lineText = model.getLineContent(lineNumber);
        var indentation = strings.getLeadingWhitespace(lineText);
        if (indentation.length > column - 1) {
            indentation = indentation.substring(0, column - 1);
        }
        var enterAction = getRawEnterActionAtPosition(model, lineNumber, column);
        if (!enterAction) {
            enterAction = {
                indentAction: modes_1.IndentAction.None,
                appendText: '',
            };
        }
        else {
            if (!enterAction.appendText) {
                if ((enterAction.indentAction === modes_1.IndentAction.Indent) ||
                    (enterAction.indentAction === modes_1.IndentAction.IndentOutdent)) {
                    enterAction.appendText = '\t';
                }
                else {
                    enterAction.appendText = '';
                }
            }
        }
        if (enterAction.removeText) {
            indentation = indentation.substring(0, indentation.length - 1);
        }
        return {
            enterAction: enterAction,
            indentation: indentation
        };
    }
    exports.getEnterActionAtPosition = getEnterActionAtPosition;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/modes/supports/suggestSupport", ["require", "exports", 'vs/base/common/winjs.base', 'vs/editor/common/modes/modesFilters', 'vs/editor/common/modes/supports'], function (require, exports, winjs_base_1, modesFilters_1, supports_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var SuggestSupport = (function () {
        function SuggestSupport(modeId, contribution) {
            this._modeId = modeId;
            this.contribution = contribution;
            this.suggest = function (resource, position) { return contribution.suggest(resource, position); };
            if (typeof contribution.getSuggestionDetails === 'function') {
                this.getSuggestionDetails = function (resource, position, suggestion) { return contribution.getSuggestionDetails(resource, position, suggestion); };
            }
        }
        SuggestSupport.prototype.shouldAutotriggerSuggest = function (context, offset, triggeredByCharacter) {
            var _this = this;
            return supports_1.handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this._modeId === nestedMode.getId()) {
                    if (_this.contribution.disableAutoTrigger) {
                        return false;
                    }
                    if (!Array.isArray(_this.contribution.excludeTokens)) {
                        return true;
                    }
                    if (_this.contribution.excludeTokens.length === 1 && _this.contribution.excludeTokens[0] === '*') {
                        return false;
                    }
                    return !supports_1.isLineToken(context, offset - 1, _this.contribution.excludeTokens, true);
                }
                else if (nestedMode.suggestSupport) {
                    return nestedMode.suggestSupport.shouldAutotriggerSuggest(context, offset, triggeredByCharacter);
                }
                else {
                    return false;
                }
            });
        };
        SuggestSupport.prototype.getFilter = function () {
            return modesFilters_1.DefaultFilter;
        };
        SuggestSupport.prototype.getTriggerCharacters = function () {
            return this.contribution.triggerCharacters;
        };
        SuggestSupport.prototype.shouldShowEmptySuggestionList = function () {
            return true;
        };
        return SuggestSupport;
    }());
    exports.SuggestSupport = SuggestSupport;
    var TextualSuggestSupport = (function () {
        function TextualSuggestSupport(modeId, editorWorkerService) {
            this._modeId = modeId;
            this._editorWorkerService = editorWorkerService;
        }
        TextualSuggestSupport.prototype.suggest = function (resource, position, triggerCharacter) {
            return this._editorWorkerService.textualSuggest(resource, position);
        };
        TextualSuggestSupport.prototype.getFilter = function () {
            return modesFilters_1.StrictPrefix;
        };
        TextualSuggestSupport.prototype.getTriggerCharacters = function () {
            return [];
        };
        TextualSuggestSupport.prototype.shouldShowEmptySuggestionList = function () {
            return true;
        };
        TextualSuggestSupport.prototype.shouldAutotriggerSuggest = function (context, offset, triggeredByCharacter) {
            var _this = this;
            return supports_1.handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this._modeId === nestedMode.getId()) {
                    return true;
                }
                else if (nestedMode.suggestSupport) {
                    return nestedMode.suggestSupport.shouldAutotriggerSuggest(context, offset, triggeredByCharacter);
                }
                else {
                    return false;
                }
            });
        };
        return TextualSuggestSupport;
    }());
    exports.TextualSuggestSupport = TextualSuggestSupport;
    var PredefinedResultSuggestSupport = (function (_super) {
        __extends(PredefinedResultSuggestSupport, _super);
        function PredefinedResultSuggestSupport(modeId, modelService, predefined, triggerCharacters, disableAutoTrigger) {
            _super.call(this, modeId, {
                triggerCharacters: triggerCharacters,
                disableAutoTrigger: disableAutoTrigger,
                excludeTokens: [],
                suggest: function (resource, position) {
                    var model = modelService.getModel(resource);
                    var result = _addSuggestionsAtPosition(model, position, predefined, null);
                    return winjs_base_1.TPromise.as(result);
                }
            });
        }
        return PredefinedResultSuggestSupport;
    }(SuggestSupport));
    exports.PredefinedResultSuggestSupport = PredefinedResultSuggestSupport;
    var TextualAndPredefinedResultSuggestSupport = (function (_super) {
        __extends(TextualAndPredefinedResultSuggestSupport, _super);
        function TextualAndPredefinedResultSuggestSupport(modeId, modelService, editorWorkerService, predefined, triggerCharacters, disableAutoTrigger) {
            _super.call(this, modeId, {
                triggerCharacters: triggerCharacters,
                disableAutoTrigger: disableAutoTrigger,
                excludeTokens: [],
                suggest: function (resource, position) {
                    return editorWorkerService.textualSuggest(resource, position).then(function (textualSuggestions) {
                        var model = modelService.getModel(resource);
                        var result = _addSuggestionsAtPosition(model, position, predefined, textualSuggestions);
                        return result;
                    });
                }
            });
        }
        return TextualAndPredefinedResultSuggestSupport;
    }(SuggestSupport));
    exports.TextualAndPredefinedResultSuggestSupport = TextualAndPredefinedResultSuggestSupport;
    function _addSuggestionsAtPosition(model, position, predefined, superSuggestions) {
        if (!predefined || predefined.length === 0) {
            return superSuggestions;
        }
        if (!superSuggestions) {
            superSuggestions = [];
        }
        superSuggestions.push({
            currentWord: model.getWordUntilPosition(position).word,
            suggestions: predefined.slice(0)
        });
        return superSuggestions;
    }
    function filterSuggestions(value) {
        if (!value) {
            return;
        }
        // filter suggestions
        var accept = modesFilters_1.DefaultFilter, result = [];
        result.push({
            currentWord: value.currentWord,
            suggestions: value.suggestions.filter(function (element) { return !!accept(value.currentWord, element); }),
            incomplete: value.incomplete
        });
        return result;
    }
    exports.filterSuggestions = filterSuggestions;
});

define("vs/editor/common/modes/monarch/monarchDefinition", ["require", "exports", 'vs/editor/common/modes/supports/suggestSupport'], function (require, exports, suggestSupport_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function createRichEditSupport(lexer) {
        return {
            wordPattern: lexer.wordDefinition,
            comments: {
                lineComment: lexer.lineComment,
                blockComment: [lexer.blockCommentStart, lexer.blockCommentEnd]
            },
            brackets: lexer.standardBrackets,
            __electricCharacterSupport: {
                // regexBrackets: lexer.enhancedBrackets,
                caseInsensitive: lexer.ignoreCase,
                embeddedElectricCharacters: lexer.outdentTriggers.split('')
            },
            __characterPairSupport: {
                autoClosingPairs: lexer.autoClosingPairs
            }
        };
    }
    exports.createRichEditSupport = createRichEditSupport;
    function createSuggestSupport(modelService, editorWorkerService, modeId, lexer) {
        if (lexer.suggestSupport.textualCompletions) {
            return new suggestSupport_1.TextualAndPredefinedResultSuggestSupport(modeId, modelService, editorWorkerService, lexer.suggestSupport.snippets, lexer.suggestSupport.triggerCharacters, lexer.suggestSupport.disableAutoTrigger);
        }
        else {
            return new suggestSupport_1.PredefinedResultSuggestSupport(modeId, modelService, lexer.suggestSupport.snippets, lexer.suggestSupport.triggerCharacters, lexer.suggestSupport.disableAutoTrigger);
        }
    }
    exports.createSuggestSupport = createSuggestSupport;
});

define("vs/nls!vs/base/common/severity",['vs/nls', 'vs/nls!vs/editor/common/worker/editorWorkerServer'], function(nls, data) { return nls.create("vs/base/common/severity", data); });
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

define("vs/nls!vs/editor/common/config/defaultConfig",['vs/nls', 'vs/nls!vs/editor/common/worker/editorWorkerServer'], function(nls, data) { return nls.create("vs/editor/common/config/defaultConfig", data); });
define("vs/editor/common/config/defaultConfig", ["require", "exports", 'vs/nls!vs/editor/common/config/defaultConfig'], function (require, exports, nls) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.USUAL_WORD_SEPARATORS = '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?';
    exports.DEFAULT_INDENTATION = {
        tabSize: 4,
        insertSpaces: true,
        detectIndentation: true
    };
    var ConfigClass = (function () {
        function ConfigClass() {
            this.editor = {
                experimentalScreenReader: true,
                rulers: [],
                wordSeparators: exports.USUAL_WORD_SEPARATORS,
                selectionClipboard: false,
                ariaLabel: nls.localize(0, null),
                lineNumbers: true,
                selectOnLineNumbers: true,
                lineNumbersMinChars: 5,
                glyphMargin: false,
                lineDecorationsWidth: 10,
                revealHorizontalRightPadding: 30,
                roundedSelection: true,
                theme: 'vs',
                readOnly: false,
                scrollbar: {
                    verticalScrollbarSize: 14,
                    horizontal: 'auto',
                    useShadows: true,
                    verticalHasArrows: false,
                    horizontalHasArrows: false
                },
                overviewRulerLanes: 2,
                cursorBlinking: 'blink',
                cursorStyle: 'line',
                fontLigatures: false,
                hideCursorInOverviewRuler: false,
                scrollBeyondLastLine: true,
                automaticLayout: false,
                wrappingColumn: 300,
                wrappingIndent: 'same',
                wordWrapBreakBeforeCharacters: '{([+',
                wordWrapBreakAfterCharacters: ' \t})]?|&,;',
                wordWrapBreakObtrusiveCharacters: '.',
                tabFocusMode: false,
                // stopLineTokenizationAfter
                // stopRenderingLineAfter
                longLineBoundary: 300,
                forcedTokenizationBoundary: 1000,
                // Features
                hover: true,
                contextmenu: true,
                mouseWheelScrollSensitivity: 1,
                quickSuggestions: true,
                quickSuggestionsDelay: 10,
                iconsInSuggestions: true,
                autoClosingBrackets: true,
                formatOnType: false,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: true,
                selectionHighlight: true,
                outlineMarkers: false,
                referenceInfos: true,
                folding: true,
                renderWhitespace: false,
                fontFamily: '',
                fontSize: 0,
                lineHeight: 0
            };
        }
        return ConfigClass;
    }());
    exports.DefaultConfig = new ConfigClass();
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/model/textModel", ["require", "exports", 'vs/base/common/eventEmitter', 'vs/base/common/strings', 'vs/editor/common/core/position', 'vs/editor/common/core/range', 'vs/editor/common/editorCommon', 'vs/editor/common/model/modelLine', 'vs/editor/common/model/indentationGuesser', 'vs/editor/common/config/defaultConfig'], function (require, exports, eventEmitter_1, strings, position_1, range_1, editorCommon, modelLine_1, indentationGuesser_1, defaultConfig_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var LIMIT_FIND_COUNT = 999;
    var TextModel = (function (_super) {
        __extends(TextModel, _super);
        function TextModel(allowedEventTypes, rawText) {
            allowedEventTypes.push(editorCommon.EventType.ModelContentChanged, editorCommon.EventType.ModelOptionsChanged);
            _super.call(this, allowedEventTypes);
            this._options = rawText.options;
            this._constructLines(rawText);
            this._setVersionId(1);
            this._isDisposed = false;
            this._isDisposing = false;
        }
        TextModel.prototype.getOptions = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.getOptions: Model is disposed');
            }
            return this._options;
        };
        TextModel.prototype.updateOptions = function (newOpts) {
            var somethingChanged = false;
            var changed = {
                tabSize: false,
                insertSpaces: false
            };
            if (typeof newOpts.insertSpaces !== 'undefined') {
                if (this._options.insertSpaces !== newOpts.insertSpaces) {
                    somethingChanged = true;
                    changed.insertSpaces = true;
                    this._options.insertSpaces = newOpts.insertSpaces;
                }
            }
            if (typeof newOpts.tabSize !== 'undefined') {
                if (this._options.tabSize !== newOpts.tabSize) {
                    somethingChanged = true;
                    changed.tabSize = true;
                    this._options.tabSize = newOpts.tabSize;
                }
            }
            if (somethingChanged) {
                this.emit(editorCommon.EventType.ModelOptionsChanged, changed);
            }
        };
        TextModel.prototype.detectIndentation = function (defaultInsertSpaces, defaultTabSize) {
            var lines = this._lines.map(function (line) { return line.text; });
            var guessedIndentation = indentationGuesser_1.guessIndentation(lines, defaultTabSize, defaultInsertSpaces);
            this.updateOptions({
                insertSpaces: guessedIndentation.insertSpaces,
                tabSize: guessedIndentation.tabSize
            });
        };
        TextModel.prototype._normalizeIndentationFromWhitespace = function (str) {
            var tabSize = this._options.tabSize;
            var insertSpaces = this._options.insertSpaces;
            var spacesCnt = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charAt(i) === '\t') {
                    spacesCnt += tabSize;
                }
                else {
                    spacesCnt++;
                }
            }
            var result = '';
            if (!insertSpaces) {
                var tabsCnt = Math.floor(spacesCnt / tabSize);
                spacesCnt = spacesCnt % tabSize;
                for (var i = 0; i < tabsCnt; i++) {
                    result += '\t';
                }
            }
            for (var i = 0; i < spacesCnt; i++) {
                result += ' ';
            }
            return result;
        };
        TextModel.prototype.normalizeIndentation = function (str) {
            var firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(str);
            if (firstNonWhitespaceIndex === -1) {
                firstNonWhitespaceIndex = str.length;
            }
            return this._normalizeIndentationFromWhitespace(str.substring(0, firstNonWhitespaceIndex)) + str.substring(firstNonWhitespaceIndex);
        };
        TextModel.prototype.getOneIndent = function () {
            var tabSize = this._options.tabSize;
            var insertSpaces = this._options.insertSpaces;
            if (insertSpaces) {
                var result = '';
                for (var i = 0; i < tabSize; i++) {
                    result += ' ';
                }
                return result;
            }
            else {
                return '\t';
            }
        };
        TextModel.prototype.getVersionId = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.getVersionId: Model is disposed');
            }
            return this._versionId;
        };
        TextModel.prototype.getAlternativeVersionId = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.getAlternativeVersionId: Model is disposed');
            }
            return this._alternativeVersionId;
        };
        TextModel.prototype._increaseVersionId = function () {
            this._setVersionId(this._versionId + 1);
        };
        TextModel.prototype._setVersionId = function (newVersionId) {
            this._versionId = newVersionId;
            this._alternativeVersionId = this._versionId;
        };
        TextModel.prototype._overwriteAlternativeVersionId = function (newAlternativeVersionId) {
            this._alternativeVersionId = newAlternativeVersionId;
        };
        TextModel.prototype.isDisposed = function () {
            return this._isDisposed;
        };
        TextModel.prototype.dispose = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.dispose: Model is disposed');
            }
            this._isDisposed = true;
            // Null out members, such that any use of a disposed model will throw exceptions sooner rather than later
            this._lines = null;
            this._EOL = null;
            this._BOM = null;
            _super.prototype.dispose.call(this);
        };
        TextModel.prototype._createContentChangedFlushEvent = function () {
            return {
                changeType: editorCommon.EventType.ModelContentChangedFlush,
                detail: null,
                // TODO@Alex -> remove these fields from here
                versionId: -1,
                isUndoing: false,
                isRedoing: false
            };
        };
        TextModel.prototype._emitContentChanged2 = function (startLineNumber, startColumn, endLineNumber, endColumn, rangeLength, text, isUndoing, isRedoing) {
            var e = {
                range: new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn),
                rangeLength: rangeLength,
                text: text,
                eol: this._EOL,
                versionId: this.getVersionId(),
                isUndoing: isUndoing,
                isRedoing: isRedoing
            };
            if (!this._isDisposing) {
                this.emit(editorCommon.EventType.ModelContentChanged2, e);
            }
        };
        TextModel.prototype._resetValue = function (e, newValue) {
            this._constructLines(newValue);
            this._increaseVersionId();
            e.detail = this.toRawText();
            e.versionId = this._versionId;
        };
        TextModel.prototype.toRawText = function () {
            return {
                BOM: this._BOM,
                EOL: this._EOL,
                lines: this.getLinesContent(),
                length: this.getValueLength(),
                options: this._options
            };
        };
        TextModel.prototype.equals = function (other) {
            if (this._BOM !== other.BOM) {
                return false;
            }
            if (this._EOL !== other.EOL) {
                return false;
            }
            if (this._lines.length !== other.lines.length) {
                return false;
            }
            for (var i = 0, len = this._lines.length; i < len; i++) {
                if (this._lines[i].text !== other.lines[i]) {
                    return false;
                }
            }
            return true;
        };
        TextModel.prototype.setValue = function (value) {
            if (this._isDisposed) {
                throw new Error('TextModel.setValue: Model is disposed');
            }
            var rawText = null;
            if (value !== null) {
                rawText = TextModel.toRawText(value, {
                    tabSize: this._options.tabSize,
                    insertSpaces: this._options.insertSpaces,
                    detectIndentation: false,
                    defaultEOL: this._options.defaultEOL
                });
            }
            this.setValueFromRawText(rawText);
        };
        TextModel.prototype.setValueFromRawText = function (newValue) {
            if (this._isDisposed) {
                throw new Error('TextModel.setValueFromRawText: Model is disposed');
            }
            if (newValue === null) {
                // There's nothing to do
                return;
            }
            var oldFullModelRange = this.getFullModelRange();
            var oldModelValueLength = this.getValueLengthInRange(oldFullModelRange);
            var endLineNumber = this.getLineCount();
            var endColumn = this.getLineMaxColumn(endLineNumber);
            var e = this._createContentChangedFlushEvent();
            this._resetValue(e, newValue);
            this._emitModelContentChangedFlushEvent(e);
            this._emitContentChanged2(1, 1, endLineNumber, endColumn, oldModelValueLength, this.getValue(), false, false);
        };
        TextModel.prototype.getValue = function (eol, preserveBOM) {
            if (preserveBOM === void 0) { preserveBOM = false; }
            if (this._isDisposed) {
                throw new Error('TextModel.getValue: Model is disposed');
            }
            var fullModelRange = this.getFullModelRange();
            var fullModelValue = this.getValueInRange(fullModelRange, eol);
            if (preserveBOM) {
                return this._BOM + fullModelValue;
            }
            return fullModelValue;
        };
        TextModel.prototype.getValueLength = function (eol, preserveBOM) {
            if (preserveBOM === void 0) { preserveBOM = false; }
            if (this._isDisposed) {
                throw new Error('TextModel.getValueLength: Model is disposed');
            }
            var fullModelRange = this.getFullModelRange();
            var fullModelValue = this.getValueLengthInRange(fullModelRange, eol);
            if (preserveBOM) {
                return this._BOM.length + fullModelValue;
            }
            return fullModelValue;
        };
        TextModel.prototype.getEmptiedValueInRange = function (rawRange, fillCharacter, eol) {
            if (fillCharacter === void 0) { fillCharacter = ''; }
            if (eol === void 0) { eol = editorCommon.EndOfLinePreference.TextDefined; }
            if (this._isDisposed) {
                throw new Error('TextModel.getEmptiedValueInRange: Model is disposed');
            }
            var range = this.validateRange(rawRange);
            if (range.isEmpty()) {
                return '';
            }
            if (range.startLineNumber === range.endLineNumber) {
                return this._repeatCharacter(fillCharacter, range.endColumn - range.startColumn);
            }
            var lineEnding = this._getEndOfLine(eol), startLineIndex = range.startLineNumber - 1, endLineIndex = range.endLineNumber - 1, resultLines = [];
            resultLines.push(this._repeatCharacter(fillCharacter, this._lines[startLineIndex].text.length - range.startColumn + 1));
            for (var i = startLineIndex + 1; i < endLineIndex; i++) {
                resultLines.push(this._repeatCharacter(fillCharacter, this._lines[i].text.length));
            }
            resultLines.push(this._repeatCharacter(fillCharacter, range.endColumn - 1));
            return resultLines.join(lineEnding);
        };
        TextModel.prototype._repeatCharacter = function (fillCharacter, count) {
            var r = '';
            for (var i = 0; i < count; i++) {
                r += fillCharacter;
            }
            return r;
        };
        TextModel.prototype.getValueInRange = function (rawRange, eol) {
            if (eol === void 0) { eol = editorCommon.EndOfLinePreference.TextDefined; }
            if (this._isDisposed) {
                throw new Error('TextModel.getValueInRange: Model is disposed');
            }
            var range = this.validateRange(rawRange);
            if (range.isEmpty()) {
                return '';
            }
            if (range.startLineNumber === range.endLineNumber) {
                return this._lines[range.startLineNumber - 1].text.substring(range.startColumn - 1, range.endColumn - 1);
            }
            var lineEnding = this._getEndOfLine(eol), startLineIndex = range.startLineNumber - 1, endLineIndex = range.endLineNumber - 1, resultLines = [];
            resultLines.push(this._lines[startLineIndex].text.substring(range.startColumn - 1));
            for (var i = startLineIndex + 1; i < endLineIndex; i++) {
                resultLines.push(this._lines[i].text);
            }
            resultLines.push(this._lines[endLineIndex].text.substring(0, range.endColumn - 1));
            return resultLines.join(lineEnding);
        };
        TextModel.prototype.getValueLengthInRange = function (rawRange, eol) {
            if (eol === void 0) { eol = editorCommon.EndOfLinePreference.TextDefined; }
            if (this._isDisposed) {
                throw new Error('TextModel.getValueInRange: Model is disposed');
            }
            var range = this.validateRange(rawRange);
            if (range.isEmpty()) {
                return 0;
            }
            if (range.startLineNumber === range.endLineNumber) {
                return (range.endColumn - range.startColumn);
            }
            var lineEndingLength = this._getEndOfLine(eol).length, startLineIndex = range.startLineNumber - 1, endLineIndex = range.endLineNumber - 1, result = 0;
            result += (this._lines[startLineIndex].text.length - range.startColumn + 1);
            for (var i = startLineIndex + 1; i < endLineIndex; i++) {
                result += lineEndingLength + this._lines[i].text.length;
            }
            result += lineEndingLength + (range.endColumn - 1);
            return result;
        };
        TextModel.prototype.isDominatedByLongLines = function (longLineBoundary) {
            if (this._isDisposed) {
                throw new Error('TextModel.isDominatedByLongLines: Model is disposed');
            }
            var smallLineCharCount = 0, longLineCharCount = 0, i, len, lines = this._lines, lineLength;
            for (i = 0, len = this._lines.length; i < len; i++) {
                lineLength = lines[i].text.length;
                if (lineLength >= longLineBoundary) {
                    longLineCharCount += lineLength;
                }
                else {
                    smallLineCharCount += lineLength;
                }
            }
            return (longLineCharCount > smallLineCharCount);
        };
        TextModel.prototype.getLineCount = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.getLineCount: Model is disposed');
            }
            return this._lines.length;
        };
        TextModel.prototype.getLineContent = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModel.getLineContent: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            return this._lines[lineNumber - 1].text;
        };
        TextModel.prototype.getLinesContent = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.getLineContent: Model is disposed');
            }
            var r = [];
            for (var i = 0, len = this._lines.length; i < len; i++) {
                r[i] = this._lines[i].text;
            }
            return r;
        };
        TextModel.prototype.getEOL = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.getEOL: Model is disposed');
            }
            return this._EOL;
        };
        TextModel.prototype.setEOL = function (eol) {
            var newEOL = (eol === editorCommon.EndOfLineSequence.CRLF ? '\r\n' : '\n');
            if (this._EOL === newEOL) {
                // Nothing to do
                return;
            }
            var oldFullModelRange = this.getFullModelRange();
            var oldModelValueLength = this.getValueLengthInRange(oldFullModelRange);
            var endLineNumber = this.getLineCount();
            var endColumn = this.getLineMaxColumn(endLineNumber);
            this._EOL = newEOL;
            this._increaseVersionId();
            var e = this._createContentChangedFlushEvent();
            e.detail = this.toRawText();
            e.versionId = this._versionId;
            this._emitModelContentChangedFlushEvent(e);
            this._emitContentChanged2(1, 1, endLineNumber, endColumn, oldModelValueLength, this.getValue(), false, false);
        };
        TextModel.prototype.getLineMinColumn = function (lineNumber) {
            return 1;
        };
        TextModel.prototype.getLineMaxColumn = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModel.getLineMaxColumn: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            return this._lines[lineNumber - 1].text.length + 1;
        };
        TextModel.prototype.getLineFirstNonWhitespaceColumn = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModel.getLineFirstNonWhitespaceColumn: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            var result = strings.firstNonWhitespaceIndex(this._lines[lineNumber - 1].text);
            if (result === -1) {
                return 0;
            }
            return result + 1;
        };
        TextModel.prototype.getLineLastNonWhitespaceColumn = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModel.getLineLastNonWhitespaceColumn: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            var result = strings.lastNonWhitespaceIndex(this._lines[lineNumber - 1].text);
            if (result === -1) {
                return 0;
            }
            return result + 2;
        };
        TextModel.prototype.validateLineNumber = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModel.validateLineNumber: Model is disposed');
            }
            if (lineNumber < 1) {
                lineNumber = 1;
            }
            if (lineNumber > this._lines.length) {
                lineNumber = this._lines.length;
            }
            return lineNumber;
        };
        TextModel.prototype.validatePosition = function (position) {
            if (this._isDisposed) {
                throw new Error('TextModel.validatePosition: Model is disposed');
            }
            var lineNumber = position.lineNumber ? position.lineNumber : 1;
            var column = position.column ? position.column : 1;
            if (lineNumber < 1) {
                lineNumber = 1;
            }
            if (lineNumber > this._lines.length) {
                lineNumber = this._lines.length;
            }
            if (column < 1) {
                column = 1;
            }
            var maxColumn = this.getLineMaxColumn(lineNumber);
            if (column > maxColumn) {
                column = maxColumn;
            }
            return new position_1.Position(lineNumber, column);
        };
        TextModel.prototype.validateRange = function (range) {
            if (this._isDisposed) {
                throw new Error('TextModel.validateRange: Model is disposed');
            }
            var start = this.validatePosition(new position_1.Position(range.startLineNumber, range.startColumn));
            var end = this.validatePosition(new position_1.Position(range.endLineNumber, range.endColumn));
            return new range_1.Range(start.lineNumber, start.column, end.lineNumber, end.column);
        };
        TextModel.prototype.modifyPosition = function (rawPosition, offset) {
            if (this._isDisposed) {
                throw new Error('TextModel.modifyPosition: Model is disposed');
            }
            var position = this.validatePosition(rawPosition);
            // Handle positive offsets, one line at a time
            while (offset > 0) {
                var maxColumn = this.getLineMaxColumn(position.lineNumber);
                // Get to end of line
                if (position.column < maxColumn) {
                    var subtract = Math.min(offset, maxColumn - position.column);
                    offset -= subtract;
                    position.column += subtract;
                }
                if (offset === 0) {
                    break;
                }
                // Go to next line
                offset -= this._EOL.length;
                if (offset < 0) {
                    throw new Error('TextModel.modifyPosition: Breaking line terminators');
                }
                ++position.lineNumber;
                if (position.lineNumber > this._lines.length) {
                    throw new Error('TextModel.modifyPosition: Offset goes beyond the end of the model');
                }
                position.column = 1;
            }
            // Handle negative offsets, one line at a time
            while (offset < 0) {
                // Get to the start of the line
                if (position.column > 1) {
                    var add = Math.min(-offset, position.column - 1);
                    offset += add;
                    position.column -= add;
                }
                if (offset === 0) {
                    break;
                }
                // Go to the previous line
                offset += this._EOL.length;
                if (offset > 0) {
                    throw new Error('TextModel.modifyPosition: Breaking line terminators');
                }
                --position.lineNumber;
                if (position.lineNumber < 1) {
                    throw new Error('TextModel.modifyPosition: Offset goes beyond the beginning of the model');
                }
                position.column = this.getLineMaxColumn(position.lineNumber);
            }
            return position;
        };
        TextModel.prototype.getFullModelRange = function () {
            if (this._isDisposed) {
                throw new Error('TextModel.getFullModelRange: Model is disposed');
            }
            var lineCount = this.getLineCount();
            return new range_1.Range(1, 1, lineCount, this.getLineMaxColumn(lineCount));
        };
        TextModel.prototype._emitModelContentChangedFlushEvent = function (e) {
            if (!this._isDisposing) {
                this.emit(editorCommon.EventType.ModelContentChanged, e);
            }
        };
        TextModel.toRawText = function (rawText, opts) {
            // Count the number of lines that end with \r\n
            var carriageReturnCnt = 0, lastCarriageReturnIndex = -1;
            while ((lastCarriageReturnIndex = rawText.indexOf('\r', lastCarriageReturnIndex + 1)) !== -1) {
                carriageReturnCnt++;
            }
            // Split the text into liens
            var lines = rawText.split(/\r\n|\r|\n/);
            // Remove the BOM (if present)
            var BOM = '';
            if (strings.startsWithUTF8BOM(lines[0])) {
                BOM = strings.UTF8_BOM_CHARACTER;
                lines[0] = lines[0].substr(1);
            }
            var lineFeedCnt = lines.length - 1;
            var EOL = '';
            if (lineFeedCnt === 0) {
                // This is an empty file or a file with precisely one line
                EOL = (opts.defaultEOL === editorCommon.DefaultEndOfLine.LF ? '\n' : '\r\n');
            }
            else if (carriageReturnCnt > lineFeedCnt / 2) {
                // More than half of the file contains \r\n ending lines
                EOL = '\r\n';
            }
            else {
                // At least one line more ends in \n
                EOL = '\n';
            }
            var resolvedOpts;
            if (opts.detectIndentation) {
                var guessedIndentation = indentationGuesser_1.guessIndentation(lines, opts.tabSize, opts.insertSpaces);
                resolvedOpts = {
                    tabSize: guessedIndentation.tabSize,
                    insertSpaces: guessedIndentation.insertSpaces,
                    defaultEOL: opts.defaultEOL
                };
            }
            else {
                resolvedOpts = {
                    tabSize: opts.tabSize,
                    insertSpaces: opts.insertSpaces,
                    defaultEOL: opts.defaultEOL
                };
            }
            return {
                BOM: BOM,
                EOL: EOL,
                lines: lines,
                length: rawText.length,
                options: resolvedOpts
            };
        };
        TextModel.prototype._constructLines = function (rawText) {
            var rawLines = rawText.lines, modelLines = [], i, len;
            for (i = 0, len = rawLines.length; i < len; i++) {
                modelLines.push(new modelLine_1.ModelLine(i + 1, rawLines[i]));
            }
            this._BOM = rawText.BOM;
            this._EOL = rawText.EOL;
            this._lines = modelLines;
        };
        TextModel.prototype._getEndOfLine = function (eol) {
            switch (eol) {
                case editorCommon.EndOfLinePreference.LF:
                    return '\n';
                case editorCommon.EndOfLinePreference.CRLF:
                    return '\r\n';
                case editorCommon.EndOfLinePreference.TextDefined:
                    return this.getEOL();
            }
            throw new Error('Unknown EOL preference');
        };
        TextModel.prototype.findMatches = function (searchString, rawSearchScope, isRegex, matchCase, wholeWord, limitResultCount) {
            if (limitResultCount === void 0) { limitResultCount = LIMIT_FIND_COUNT; }
            if (this._isDisposed) {
                throw new Error('Model.findMatches: Model is disposed');
            }
            var regex = strings.createSafeRegExp(searchString, isRegex, matchCase, wholeWord);
            if (!regex) {
                return [];
            }
            var searchRange;
            if (range_1.Range.isIRange(rawSearchScope)) {
                searchRange = rawSearchScope;
            }
            else {
                searchRange = this.getFullModelRange();
            }
            return this._doFindMatches(searchRange, regex, limitResultCount);
        };
        TextModel.prototype.findNextMatch = function (searchString, rawSearchStart, isRegex, matchCase, wholeWord) {
            if (this._isDisposed) {
                throw new Error('Model.findNextMatch: Model is disposed');
            }
            var regex = strings.createSafeRegExp(searchString, isRegex, matchCase, wholeWord);
            if (!regex) {
                return null;
            }
            var searchStart = this.validatePosition(rawSearchStart), lineCount = this.getLineCount(), startLineNumber = searchStart.lineNumber, text, r;
            // Look in first line
            text = this._lines[startLineNumber - 1].text.substring(searchStart.column - 1);
            r = this._findMatchInLine(regex, text, startLineNumber, searchStart.column - 1);
            if (r) {
                return r;
            }
            for (var i = 1; i <= lineCount; i++) {
                var lineIndex = (startLineNumber + i - 1) % lineCount;
                text = this._lines[lineIndex].text;
                r = this._findMatchInLine(regex, text, lineIndex + 1, 0);
                if (r) {
                    return r;
                }
            }
            return null;
        };
        TextModel.prototype.findPreviousMatch = function (searchString, rawSearchStart, isRegex, matchCase, wholeWord) {
            if (this._isDisposed) {
                throw new Error('Model.findPreviousMatch: Model is disposed');
            }
            var regex = strings.createSafeRegExp(searchString, isRegex, matchCase, wholeWord);
            if (!regex) {
                return null;
            }
            var searchStart = this.validatePosition(rawSearchStart), lineCount = this.getLineCount(), startLineNumber = searchStart.lineNumber, text, r;
            // Look in first line
            text = this._lines[startLineNumber - 1].text.substring(0, searchStart.column - 1);
            r = this._findLastMatchInLine(regex, text, startLineNumber);
            if (r) {
                return r;
            }
            for (var i = 1; i <= lineCount; i++) {
                var lineIndex = (lineCount + startLineNumber - i - 1) % lineCount;
                text = this._lines[lineIndex].text;
                r = this._findLastMatchInLine(regex, text, lineIndex + 1);
                if (r) {
                    return r;
                }
            }
            return null;
        };
        TextModel.prototype._doFindMatches = function (searchRange, searchRegex, limitResultCount) {
            var result = [], text, counter = 0;
            // Early case for a search range that starts & stops on the same line number
            if (searchRange.startLineNumber === searchRange.endLineNumber) {
                text = this._lines[searchRange.startLineNumber - 1].text.substring(searchRange.startColumn - 1, searchRange.endColumn - 1);
                counter = this._findMatchesInLine(searchRegex, text, searchRange.startLineNumber, searchRange.startColumn - 1, counter, result, limitResultCount);
                return result;
            }
            // Collect results from first line
            text = this._lines[searchRange.startLineNumber - 1].text.substring(searchRange.startColumn - 1);
            counter = this._findMatchesInLine(searchRegex, text, searchRange.startLineNumber, searchRange.startColumn - 1, counter, result, limitResultCount);
            // Collect results from middle lines
            for (var lineNumber = searchRange.startLineNumber + 1; lineNumber < searchRange.endLineNumber && counter < limitResultCount; lineNumber++) {
                counter = this._findMatchesInLine(searchRegex, this._lines[lineNumber - 1].text, lineNumber, 0, counter, result, limitResultCount);
            }
            // Collect results from last line
            if (counter < limitResultCount) {
                text = this._lines[searchRange.endLineNumber - 1].text.substring(0, searchRange.endColumn - 1);
                counter = this._findMatchesInLine(searchRegex, text, searchRange.endLineNumber, 0, counter, result, limitResultCount);
            }
            return result;
        };
        TextModel.prototype._findMatchInLine = function (searchRegex, text, lineNumber, deltaOffset) {
            var m = searchRegex.exec(text);
            if (!m) {
                return null;
            }
            return new range_1.Range(lineNumber, m.index + 1 + deltaOffset, lineNumber, m.index + 1 + m[0].length + deltaOffset);
        };
        TextModel.prototype._findLastMatchInLine = function (searchRegex, text, lineNumber) {
            var bestResult = null;
            var m;
            while ((m = searchRegex.exec(text))) {
                var result = new range_1.Range(lineNumber, m.index + 1, lineNumber, m.index + 1 + m[0].length);
                if (result.equalsRange(bestResult)) {
                    break;
                }
                bestResult = result;
            }
            return bestResult;
        };
        TextModel.prototype._findMatchesInLine = function (searchRegex, text, lineNumber, deltaOffset, counter, result, limitResultCount) {
            var m;
            // Reset regex to search from the beginning
            searchRegex.lastIndex = 0;
            do {
                m = searchRegex.exec(text);
                if (m) {
                    var range = new range_1.Range(lineNumber, m.index + 1 + deltaOffset, lineNumber, m.index + 1 + m[0].length + deltaOffset);
                    // Exit early if the regex matches the same range
                    if (range.equalsRange(result[result.length - 1])) {
                        return counter;
                    }
                    result.push(range);
                    counter++;
                    if (counter >= limitResultCount) {
                        return counter;
                    }
                }
            } while (m);
            return counter;
        };
        TextModel.DEFAULT_CREATION_OPTIONS = {
            tabSize: defaultConfig_1.DEFAULT_INDENTATION.tabSize,
            insertSpaces: defaultConfig_1.DEFAULT_INDENTATION.insertSpaces,
            detectIndentation: false,
            defaultEOL: editorCommon.DefaultEndOfLine.LF
        };
        return TextModel;
    }(eventEmitter_1.OrderGuaranteeEventEmitter));
    exports.TextModel = TextModel;
    var RawText = (function () {
        function RawText() {
        }
        RawText.fromString = function (rawText, opts) {
            return TextModel.toRawText(rawText, opts);
        };
        RawText.fromStringWithModelOptions = function (rawText, model) {
            var opts = model.getOptions();
            return TextModel.toRawText(rawText, {
                tabSize: opts.tabSize,
                insertSpaces: opts.insertSpaces,
                detectIndentation: false,
                defaultEOL: opts.defaultEOL
            });
        };
        return RawText;
    }());
    exports.RawText = RawText;
});

define("vs/editor/common/modes/nullMode", ["require", "exports", 'vs/editor/common/config/defaultConfig'], function (require, exports, defaultConfig_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var NullState = (function () {
        function NullState(mode, stateData) {
            this.mode = mode;
            this.stateData = stateData;
        }
        NullState.prototype.clone = function () {
            var stateDataClone = (this.stateData ? this.stateData.clone() : null);
            return new NullState(this.mode, stateDataClone);
        };
        NullState.prototype.equals = function (other) {
            if (this.mode !== other.getMode()) {
                return false;
            }
            var otherStateData = other.getStateData();
            if (!this.stateData && !otherStateData) {
                return true;
            }
            if (this.stateData && otherStateData) {
                return this.stateData.equals(otherStateData);
            }
            return false;
        };
        NullState.prototype.getMode = function () {
            return this.mode;
        };
        NullState.prototype.tokenize = function (stream) {
            stream.advanceToEOS();
            return { type: '' };
        };
        NullState.prototype.getStateData = function () {
            return this.stateData;
        };
        NullState.prototype.setStateData = function (stateData) {
            this.stateData = stateData;
        };
        return NullState;
    }());
    exports.NullState = NullState;
    var NullMode = (function () {
        function NullMode() {
            this.richEditSupport = {
                wordDefinition: NullMode.DEFAULT_WORD_REGEXP
            };
        }
        /**
         * Create a word definition regular expression based on default word separators.
         * Optionally provide allowed separators that should be included in words.
         *
         * The default would look like this:
         * /(-?\d*\.\d\w*)|([^\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g
         */
        NullMode.createWordRegExp = function (allowInWords) {
            if (allowInWords === void 0) { allowInWords = ''; }
            var usualSeparators = defaultConfig_1.USUAL_WORD_SEPARATORS;
            var source = '(-?\\d*\\.\\d\\w*)|([^';
            for (var i = 0; i < usualSeparators.length; i++) {
                if (allowInWords.indexOf(usualSeparators[i]) >= 0) {
                    continue;
                }
                source += '\\' + usualSeparators[i];
            }
            source += '\\s]+)';
            return new RegExp(source, 'g');
        };
        NullMode.prototype.getId = function () {
            return NullMode.ID;
        };
        NullMode.prototype.toSimplifiedMode = function () {
            return this;
        };
        // catches numbers (including floating numbers) in the first group, and alphanum in the second
        NullMode.DEFAULT_WORD_REGEXP = NullMode.createWordRegExp();
        NullMode.ID = 'vs.editor.modes.nullMode';
        return NullMode;
    }());
    exports.NullMode = NullMode;
    function nullTokenize(mode, buffer, state, deltaOffset, stopAtOffset) {
        if (deltaOffset === void 0) { deltaOffset = 0; }
        var tokens = [
            {
                startIndex: deltaOffset,
                type: ''
            }
        ];
        var modeTransitions = [
            {
                startIndex: deltaOffset,
                mode: mode
            }
        ];
        return {
            tokens: tokens,
            actualStopOffset: deltaOffset + buffer.length,
            endState: state,
            modeTransitions: modeTransitions
        };
    }
    exports.nullTokenize = nullTokenize;
});

define("vs/editor/common/model/textModelWithTokensHelpers", ["require", "exports", 'vs/editor/common/core/arrays', 'vs/editor/common/modes/nullMode'], function (require, exports, arrays_1, nullMode_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var WordHelper = (function () {
        function WordHelper() {
        }
        WordHelper._safeGetWordDefinition = function (mode) {
            return (mode.richEditSupport ? mode.richEditSupport.wordDefinition : null);
        };
        WordHelper.ensureValidWordDefinition = function (wordDefinition) {
            var result = nullMode_1.NullMode.DEFAULT_WORD_REGEXP;
            if (wordDefinition && (wordDefinition instanceof RegExp)) {
                if (!wordDefinition.global) {
                    var flags = 'g';
                    if (wordDefinition.ignoreCase) {
                        flags += 'i';
                    }
                    if (wordDefinition.multiline) {
                        flags += 'm';
                    }
                    result = new RegExp(wordDefinition.source, flags);
                }
                else {
                    result = wordDefinition;
                }
            }
            result.lastIndex = 0;
            return result;
        };
        WordHelper.massageWordDefinitionOf = function (mode) {
            return WordHelper.ensureValidWordDefinition(WordHelper._safeGetWordDefinition(mode));
        };
        WordHelper.getWords = function (textSource, lineNumber) {
            if (!textSource._lineIsTokenized(lineNumber)) {
                return WordHelper._getWordsInText(textSource.getLineContent(lineNumber), WordHelper.massageWordDefinitionOf(textSource.getMode()));
            }
            var r = [], txt = textSource.getLineContent(lineNumber);
            if (txt.length > 0) {
                var modeTransitions = textSource._getLineModeTransitions(lineNumber), i, len, k, lenK, currentModeStartIndex, currentModeEndIndex, currentWordDefinition, currentModeText, words, startWord, endWord, word;
                // Go through all the modes
                for (i = 0, currentModeStartIndex = 0, len = modeTransitions.length; i < len; i++) {
                    currentWordDefinition = WordHelper.massageWordDefinitionOf(modeTransitions[i].mode);
                    currentModeStartIndex = modeTransitions[i].startIndex;
                    currentModeEndIndex = (i + 1 < len ? modeTransitions[i + 1].startIndex : txt.length);
                    currentModeText = txt.substring(currentModeStartIndex, currentModeEndIndex);
                    words = currentModeText.match(currentWordDefinition);
                    if (!words) {
                        continue;
                    }
                    endWord = 0;
                    for (k = 0, lenK = words.length; k < lenK; k++) {
                        word = words[k];
                        if (word.length > 0) {
                            startWord = currentModeText.indexOf(word, endWord);
                            endWord = startWord + word.length;
                            r.push({
                                start: currentModeStartIndex + startWord,
                                end: currentModeStartIndex + endWord
                            });
                        }
                    }
                }
            }
            return r;
        };
        WordHelper._getWordsInText = function (text, wordDefinition) {
            var words = text.match(wordDefinition) || [], k, startWord, endWord, startColumn, endColumn, word, r = [];
            for (k = 0; k < words.length; k++) {
                word = words[k].trim();
                if (word.length > 0) {
                    startWord = text.indexOf(word, endWord);
                    endWord = startWord + word.length;
                    startColumn = startWord;
                    endColumn = endWord;
                    r.push({
                        start: startColumn,
                        end: endColumn
                    });
                }
            }
            return r;
        };
        WordHelper._getWordAtColumn = function (txt, column, modeIndex, modeTransitions) {
            var modeStartIndex = modeTransitions[modeIndex].startIndex, modeEndIndex = (modeIndex + 1 < modeTransitions.length ? modeTransitions[modeIndex + 1].startIndex : txt.length), mode = modeTransitions[modeIndex].mode;
            return WordHelper._getWordAtText(column, WordHelper.massageWordDefinitionOf(mode), txt.substring(modeStartIndex, modeEndIndex), modeStartIndex);
        };
        WordHelper.getWordAtPosition = function (textSource, position) {
            if (!textSource._lineIsTokenized(position.lineNumber)) {
                return WordHelper._getWordAtText(position.column, WordHelper.massageWordDefinitionOf(textSource.getMode()), textSource.getLineContent(position.lineNumber), 0);
            }
            var result = null;
            var txt = textSource.getLineContent(position.lineNumber), modeTransitions = textSource._getLineModeTransitions(position.lineNumber), columnIndex = position.column - 1, modeIndex = arrays_1.Arrays.findIndexInSegmentsArray(modeTransitions, columnIndex);
            result = WordHelper._getWordAtColumn(txt, position.column, modeIndex, modeTransitions);
            if (!result && modeIndex > 0 && modeTransitions[modeIndex].startIndex === columnIndex) {
                // The position is right at the beginning of `modeIndex`, so try looking at `modeIndex` - 1 too
                result = WordHelper._getWordAtColumn(txt, position.column, modeIndex - 1, modeTransitions);
            }
            return result;
        };
        WordHelper._getWordAtText = function (column, wordDefinition, text, textOffset) {
            // console.log('_getWordAtText: ', column, text, textOffset);
            var words = text.match(wordDefinition), k, startWord, endWord, startColumn, endColumn, word;
            if (words) {
                for (k = 0; k < words.length; k++) {
                    word = words[k].trim();
                    if (word.length > 0) {
                        startWord = text.indexOf(word, endWord);
                        endWord = startWord + word.length;
                        startColumn = textOffset + startWord + 1;
                        endColumn = textOffset + endWord + 1;
                        if (startColumn <= column && column <= endColumn) {
                            return {
                                word: word,
                                startColumn: startColumn,
                                endColumn: endColumn
                            };
                        }
                    }
                }
            }
            return null;
        };
        return WordHelper;
    }());
    exports.WordHelper = WordHelper;
});

define("vs/editor/common/modes/supports/richEditSupport", ["require", "exports", 'vs/editor/common/modes/nullMode', 'vs/editor/common/modes/supports/characterPair', 'vs/editor/common/modes/supports/electricCharacter', 'vs/editor/common/modes/supports/onEnter', 'vs/editor/common/modes/supports/richEditBrackets'], function (require, exports, nullMode_1, characterPair_1, electricCharacter_1, onEnter_1, richEditBrackets_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var RichEditSupport = (function () {
        function RichEditSupport(modeId, previous, rawConf) {
            var prev = null;
            if (previous instanceof RichEditSupport) {
                prev = previous._conf;
            }
            this._conf = RichEditSupport._mergeConf(prev, rawConf);
            if (this._conf.brackets) {
                this.brackets = new richEditBrackets_1.RichEditBrackets(modeId, this._conf.brackets);
            }
            this._handleOnEnter(modeId, this._conf);
            this._handleComments(modeId, this._conf);
            if (this._conf.__characterPairSupport) {
                this.characterPair = new characterPair_1.CharacterPairSupport(modeId, this._conf.__characterPairSupport);
            }
            if (this._conf.__electricCharacterSupport || this._conf.brackets) {
                this.electricCharacter = new electricCharacter_1.BracketElectricCharacterSupport(modeId, this.brackets, this._conf.__electricCharacterSupport);
            }
            this.wordDefinition = this._conf.wordPattern || nullMode_1.NullMode.DEFAULT_WORD_REGEXP;
        }
        RichEditSupport._mergeConf = function (prev, current) {
            return {
                comments: (prev ? current.comments || prev.comments : current.comments),
                brackets: (prev ? current.brackets || prev.brackets : current.brackets),
                wordPattern: (prev ? current.wordPattern || prev.wordPattern : current.wordPattern),
                indentationRules: (prev ? current.indentationRules || prev.indentationRules : current.indentationRules),
                onEnterRules: (prev ? current.onEnterRules || prev.onEnterRules : current.onEnterRules),
                __electricCharacterSupport: (prev ? current.__electricCharacterSupport || prev.__electricCharacterSupport : current.__electricCharacterSupport),
                __characterPairSupport: (prev ? current.__characterPairSupport || prev.__characterPairSupport : current.__characterPairSupport),
            };
        };
        RichEditSupport.prototype._handleOnEnter = function (modeId, conf) {
            // on enter
            var onEnter = {};
            var empty = true;
            if (conf.brackets) {
                empty = false;
                onEnter.brackets = conf.brackets;
            }
            if (conf.indentationRules) {
                empty = false;
                onEnter.indentationRules = conf.indentationRules;
            }
            if (conf.onEnterRules) {
                empty = false;
                onEnter.regExpRules = conf.onEnterRules;
            }
            if (!empty) {
                this.onEnter = new onEnter_1.OnEnterSupport(modeId, onEnter);
            }
        };
        RichEditSupport.prototype._handleComments = function (modeId, conf) {
            var commentRule = conf.comments;
            // comment configuration
            if (commentRule) {
                this.comments = {};
                if (commentRule.lineComment) {
                    this.comments.lineCommentToken = commentRule.lineComment;
                }
                if (commentRule.blockComment) {
                    var _a = commentRule.blockComment, blockStart = _a[0], blockEnd = _a[1];
                    this.comments.blockCommentStartToken = blockStart;
                    this.comments.blockCommentEndToken = blockEnd;
                }
            }
        };
        return RichEditSupport;
    }());
    exports.RichEditSupport = RichEditSupport;
});

define("vs/editor/common/modes/supports/tokenizationSupport", ["require", "exports", 'vs/editor/common/modes/lineStream', 'vs/editor/common/modes/nullMode', 'vs/editor/common/modes/supports'], function (require, exports, lineStream_1, nullMode_1, supports_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function isFunction(something) {
        return typeof something === 'function';
    }
    var TokenizationSupport = (function () {
        function TokenizationSupport(mode, customization, supportsNestedModes, shouldGenerateEmbeddedModels) {
            this._mode = mode;
            this.customization = customization;
            this.supportsNestedModes = supportsNestedModes;
            this._embeddedModesListeners = {};
            if (this.supportsNestedModes) {
                if (!this._mode.registerSupport) {
                    throw new Error('Cannot be a mode with nested modes unless I can emit a tokenizationSupport changed event!');
                }
            }
            this.shouldGenerateEmbeddedModels = shouldGenerateEmbeddedModels;
            this.defaults = {
                enterNestedMode: !isFunction(customization.enterNestedMode),
                getNestedMode: !isFunction(customization.getNestedMode),
                getNestedModeInitialState: !isFunction(customization.getNestedModeInitialState),
                getLeavingNestedModeData: !isFunction(customization.getLeavingNestedModeData),
                onReturningFromNestedMode: !isFunction(customization.onReturningFromNestedMode)
            };
        }
        TokenizationSupport.prototype.dispose = function () {
            for (var listener in this._embeddedModesListeners) {
                this._embeddedModesListeners[listener].dispose();
                delete this._embeddedModesListeners[listener];
            }
        };
        TokenizationSupport.prototype.getInitialState = function () {
            return this.customization.getInitialState();
        };
        TokenizationSupport.prototype.tokenize = function (line, state, deltaOffset, stopAtOffset) {
            if (deltaOffset === void 0) { deltaOffset = 0; }
            if (stopAtOffset === void 0) { stopAtOffset = deltaOffset + line.length; }
            if (state.getMode() !== this._mode) {
                return this._nestedTokenize(line, state, deltaOffset, stopAtOffset, [], []);
            }
            else {
                return this._myTokenize(line, state, deltaOffset, stopAtOffset, [], []);
            }
        };
        /**
         * Precondition is: nestedModeState.getMode() !== this
         * This means we are in a nested mode when parsing starts on this line.
         */
        TokenizationSupport.prototype._nestedTokenize = function (buffer, nestedModeState, deltaOffset, stopAtOffset, prependTokens, prependModeTransitions) {
            var myStateBeforeNestedMode = nestedModeState.getStateData();
            var leavingNestedModeData = this.getLeavingNestedModeData(buffer, myStateBeforeNestedMode);
            // Be sure to give every embedded mode the
            // opportunity to leave nested mode.
            // i.e. Don't go straight to the most nested mode
            var stepOnceNestedState = nestedModeState;
            while (stepOnceNestedState.getStateData() && stepOnceNestedState.getStateData().getMode() !== this._mode) {
                stepOnceNestedState = stepOnceNestedState.getStateData();
            }
            var nestedMode = stepOnceNestedState.getMode();
            if (!leavingNestedModeData) {
                // tokenization will not leave nested mode
                var result;
                if (nestedMode.tokenizationSupport) {
                    result = nestedMode.tokenizationSupport.tokenize(buffer, nestedModeState, deltaOffset, stopAtOffset);
                }
                else {
                    // The nested mode doesn't have tokenization support,
                    // unfortunatelly this means we have to fake it
                    result = nullMode_1.nullTokenize(nestedMode, buffer, nestedModeState, deltaOffset);
                }
                result.tokens = prependTokens.concat(result.tokens);
                result.modeTransitions = prependModeTransitions.concat(result.modeTransitions);
                return result;
            }
            var nestedModeBuffer = leavingNestedModeData.nestedModeBuffer;
            if (nestedModeBuffer.length > 0) {
                // Tokenize with the nested mode
                var nestedModeLineTokens;
                if (nestedMode.tokenizationSupport) {
                    nestedModeLineTokens = nestedMode.tokenizationSupport.tokenize(nestedModeBuffer, nestedModeState, deltaOffset, stopAtOffset);
                }
                else {
                    // The nested mode doesn't have tokenization support,
                    // unfortunatelly this means we have to fake it
                    nestedModeLineTokens = nullMode_1.nullTokenize(nestedMode, nestedModeBuffer, nestedModeState, deltaOffset);
                }
                // Save last state of nested mode
                nestedModeState = nestedModeLineTokens.endState;
                // Prepend nested mode's result to our result
                prependTokens = prependTokens.concat(nestedModeLineTokens.tokens);
                prependModeTransitions = prependModeTransitions.concat(nestedModeLineTokens.modeTransitions);
            }
            var bufferAfterNestedMode = leavingNestedModeData.bufferAfterNestedMode;
            var myStateAfterNestedMode = leavingNestedModeData.stateAfterNestedMode;
            myStateAfterNestedMode.setStateData(myStateBeforeNestedMode.getStateData());
            this.onReturningFromNestedMode(myStateAfterNestedMode, nestedModeState);
            return this._myTokenize(bufferAfterNestedMode, myStateAfterNestedMode, deltaOffset + nestedModeBuffer.length, stopAtOffset, prependTokens, prependModeTransitions);
        };
        /**
         * Precondition is: state.getMode() === this
         * This means we are in the current mode when parsing starts on this line.
         */
        TokenizationSupport.prototype._myTokenize = function (buffer, myState, deltaOffset, stopAtOffset, prependTokens, prependModeTransitions) {
            var _this = this;
            var lineStream = new lineStream_1.LineStream(buffer);
            var tokenResult, beforeTokenizeStreamPos;
            var previousType = null;
            var retokenize = null;
            myState = myState.clone();
            if (prependModeTransitions.length <= 0 || prependModeTransitions[prependModeTransitions.length - 1].mode !== this._mode) {
                // Avoid transitioning to the same mode (this can happen in case of empty embedded modes)
                prependModeTransitions.push({
                    startIndex: deltaOffset,
                    mode: this._mode
                });
            }
            var maxPos = Math.min(stopAtOffset - deltaOffset, buffer.length);
            while (lineStream.pos() < maxPos) {
                beforeTokenizeStreamPos = lineStream.pos();
                do {
                    tokenResult = myState.tokenize(lineStream);
                    if (tokenResult === null || tokenResult === undefined ||
                        ((tokenResult.type === undefined || tokenResult.type === null) &&
                            (tokenResult.nextState === undefined || tokenResult.nextState === null))) {
                        throw new Error('Tokenizer must return a valid state');
                    }
                    if (tokenResult.nextState) {
                        tokenResult.nextState.setStateData(myState.getStateData());
                        myState = tokenResult.nextState;
                    }
                    if (lineStream.pos() <= beforeTokenizeStreamPos) {
                        throw new Error('Stream did not advance while tokenizing. Mode id is ' + this._mode.getId() + ' (stuck at token type: "' + tokenResult.type + '", prepend tokens: "' + (prependTokens.map(function (t) { return t.type; }).join(',')) + '").');
                    }
                } while (!tokenResult.type && tokenResult.type !== '');
                if (previousType !== tokenResult.type || tokenResult.dontMergeWithPrev || previousType === null) {
                    prependTokens.push(new supports_1.Token(beforeTokenizeStreamPos + deltaOffset, tokenResult.type));
                }
                previousType = tokenResult.type;
                if (this.supportsNestedModes && this.enterNestedMode(myState)) {
                    var currentEmbeddedLevels = this._getEmbeddedLevel(myState);
                    if (currentEmbeddedLevels < TokenizationSupport.MAX_EMBEDDED_LEVELS) {
                        var nestedModeState = this.getNestedModeInitialState(myState);
                        // Re-emit tokenizationSupport change events from all modes that I ever embedded
                        var embeddedMode = nestedModeState.state.getMode();
                        if (typeof embeddedMode.addSupportChangedListener === 'function' && !this._embeddedModesListeners.hasOwnProperty(embeddedMode.getId())) {
                            var emitting = false;
                            this._embeddedModesListeners[embeddedMode.getId()] = embeddedMode.addSupportChangedListener(function (e) {
                                if (emitting) {
                                    return;
                                }
                                if (e.tokenizationSupport) {
                                    emitting = true;
                                    _this._mode.registerSupport('tokenizationSupport', function (mode) {
                                        return mode.tokenizationSupport;
                                    });
                                    emitting = false;
                                }
                            });
                        }
                        if (!lineStream.eos()) {
                            // There is content from the embedded mode
                            var restOfBuffer = buffer.substr(lineStream.pos());
                            var result = this._nestedTokenize(restOfBuffer, nestedModeState.state, deltaOffset + lineStream.pos(), stopAtOffset, prependTokens, prependModeTransitions);
                            result.retokenize = result.retokenize || nestedModeState.missingModePromise;
                            return result;
                        }
                        else {
                            // Transition to the nested mode state
                            myState = nestedModeState.state;
                            retokenize = nestedModeState.missingModePromise;
                        }
                    }
                }
            }
            return {
                tokens: prependTokens,
                actualStopOffset: lineStream.pos() + deltaOffset,
                modeTransitions: prependModeTransitions,
                endState: myState,
                retokenize: retokenize
            };
        };
        TokenizationSupport.prototype._getEmbeddedLevel = function (state) {
            var result = -1;
            while (state) {
                result++;
                state = state.getStateData();
            }
            return result;
        };
        TokenizationSupport.prototype.enterNestedMode = function (state) {
            if (this.defaults.enterNestedMode) {
                return false;
            }
            return this.customization.enterNestedMode(state);
        };
        TokenizationSupport.prototype.getNestedMode = function (state) {
            if (this.defaults.getNestedMode) {
                return null;
            }
            return this.customization.getNestedMode(state);
        };
        TokenizationSupport._validatedNestedMode = function (input) {
            var mode = new nullMode_1.NullMode(), missingModePromise = null;
            if (input && input.mode) {
                mode = input.mode;
            }
            if (input && input.missingModePromise) {
                missingModePromise = input.missingModePromise;
            }
            return {
                mode: mode,
                missingModePromise: missingModePromise
            };
        };
        TokenizationSupport.prototype.getNestedModeInitialState = function (state) {
            if (this.defaults.getNestedModeInitialState) {
                var nestedMode = TokenizationSupport._validatedNestedMode(this.getNestedMode(state));
                var missingModePromise = nestedMode.missingModePromise;
                var nestedModeState;
                if (nestedMode.mode.tokenizationSupport) {
                    nestedModeState = nestedMode.mode.tokenizationSupport.getInitialState();
                }
                else {
                    nestedModeState = new nullMode_1.NullState(nestedMode.mode, null);
                }
                nestedModeState.setStateData(state);
                return {
                    state: nestedModeState,
                    missingModePromise: missingModePromise
                };
            }
            return this.customization.getNestedModeInitialState(state);
        };
        TokenizationSupport.prototype.getLeavingNestedModeData = function (line, state) {
            if (this.defaults.getLeavingNestedModeData) {
                return null;
            }
            return this.customization.getLeavingNestedModeData(line, state);
        };
        TokenizationSupport.prototype.onReturningFromNestedMode = function (myStateAfterNestedMode, lastNestedModeState) {
            if (this.defaults.onReturningFromNestedMode) {
                return null;
            }
            return this.customization.onReturningFromNestedMode(myStateAfterNestedMode, lastNestedModeState);
        };
        TokenizationSupport.MAX_EMBEDDED_LEVELS = 5;
        return TokenizationSupport;
    }());
    exports.TokenizationSupport = TokenizationSupport;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/modes/monarch/monarchLexer", ["require", "exports", 'vs/editor/common/modes/abstractState', 'vs/editor/common/modes/lineStream', 'vs/editor/common/modes/monarch/monarchCommon', 'vs/editor/common/modes/supports/tokenizationSupport'], function (require, exports, abstractState_1, lineStream_1, monarchCommon, tokenizationSupport_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * The MonarchLexer class implements a monaco lexer that highlights source code.
     * It takes a compiled lexer to guide the tokenizer and maintains a stack of
     * lexer states.
     */
    var MonarchLexer = (function (_super) {
        __extends(MonarchLexer, _super);
        function MonarchLexer(mode, modeService, lexer, stack, embeddedMode) {
            _super.call(this, mode);
            this.id = MonarchLexer.ID++; // for debugging, assigns unique id to each instance
            this.modeService = modeService;
            this.lexer = lexer; // (compiled) lexer description
            this.stack = (stack ? stack : [lexer.start]); // stack of states
            this.embeddedMode = (embeddedMode ? embeddedMode : null); // are we scanning an embedded section?
            // did we encounter an embedded start on this line?
            // no need for cloning or equality since it is used only within a line
            this.embeddedEntered = false;
            // regular expression group matching
            // these never need cloning or equality since they are only used within a line match
            this.groupActions = null;
            this.groupMatches = null;
            this.groupMatched = null;
            this.groupRule = null;
        }
        MonarchLexer.prototype.makeClone = function () {
            return new MonarchLexer(this.getMode(), this.modeService, this.lexer, this.stack.slice(0), this.embeddedMode);
        };
        MonarchLexer.prototype.equals = function (other) {
            if (!_super.prototype.equals.call(this, other)) {
                return false;
            }
            if (!(other instanceof MonarchLexer)) {
                return false;
            }
            var otherm = other;
            if ((this.stack.length !== otherm.stack.length) || (this.lexer.name !== otherm.lexer.name) ||
                (this.embeddedMode !== otherm.embeddedMode)) {
                return false;
            }
            var idx;
            for (idx in this.stack) {
                if (this.stack.hasOwnProperty(idx)) {
                    if (this.stack[idx] !== otherm.stack[idx]) {
                        return false;
                    }
                }
            }
            return true;
        };
        /**
         * The main tokenizer: this function gets called by monaco to tokenize lines
         * Note: we don't want to raise exceptions here and always keep going..
         *
         * TODO: there are many optimizations possible here for the common cases
         * but for now I concentrated on functionality and correctness.
         */
        MonarchLexer.prototype.tokenize = function (stream, noConsumeIsOk) {
            var stackLen0 = this.stack.length; // these are saved to check progress
            var groupLen0 = 0;
            var state = this.stack[0]; // the current state
            this.embeddedEntered = false;
            var matches = null;
            var matched = null;
            var action = null;
            var next = null;
            var rule = null;
            // check if we need to process group matches first
            if (this.groupActions) {
                groupLen0 = this.groupActions.length;
                matches = this.groupMatches;
                matched = this.groupMatched.shift();
                action = this.groupActions.shift();
                rule = this.groupRule;
                // cleanup if necessary
                if (this.groupActions.length === 0) {
                    this.groupActions = null;
                    this.groupMatches = null;
                    this.groupMatched = null;
                    this.groupRule = null;
                }
            }
            else {
                // nothing to do
                if (stream.eos()) {
                    return { type: '' };
                }
                // get the entire line
                var line = stream.advanceToEOS();
                stream.goBack(line.length);
                // get the rules for this state
                var rules = this.lexer.tokenizer[state];
                if (!rules) {
                    rules = monarchCommon.findRules(this.lexer, state); // do parent matching
                }
                if (!rules) {
                    monarchCommon.throwError(this.lexer, 'tokenizer state is not defined: ' + state);
                }
                else {
                    // try each rule until we match
                    rule = null;
                    var pos = stream.pos();
                    var idx;
                    for (idx in rules) {
                        if (rules.hasOwnProperty(idx)) {
                            rule = rules[idx];
                            if (pos === 0 || !rule.matchOnlyAtLineStart) {
                                matches = line.match(rule.regex);
                                if (matches) {
                                    matched = matches[0];
                                    action = rule.action;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            // We matched 'rule' with 'matches' and 'action'
            if (!matches) {
                matches = [''];
                matched = '';
            }
            if (!action) {
                // bad: we didn't match anything, and there is no action to take
                // we need to advance the stream or we get progress trouble
                if (!stream.eos()) {
                    matches = [stream.peek()];
                    matched = matches[0];
                }
                action = this.lexer.defaultToken;
            }
            // advance stream
            stream.advance(matched.length);
            // maybe call action function (used for 'cases')
            while (action.test) {
                var callres = action.test(matched, matches, state, stream.eos());
                action = callres;
            }
            // set the result: either a string or an array of actions
            var result = null;
            if (typeof (action) === 'string' || Array.isArray(action)) {
                result = action;
            }
            else if (action.group) {
                result = action.group;
            }
            else if (action.token !== null && action.token !== undefined) {
                result = action.token;
                // do $n replacements?
                if (action.tokenSubst) {
                    result = monarchCommon.substituteMatches(this.lexer, result, matched, matches, state);
                }
                // enter embedded mode?
                if (action.nextEmbedded) {
                    if (action.nextEmbedded === '@pop') {
                        if (!this.embeddedMode) {
                            monarchCommon.throwError(this.lexer, 'cannot pop embedded mode if not inside one');
                        }
                        this.embeddedMode = null;
                    }
                    else if (this.embeddedMode) {
                        monarchCommon.throwError(this.lexer, 'cannot enter embedded mode from within an embedded mode');
                    }
                    else {
                        this.embeddedMode = monarchCommon.substituteMatches(this.lexer, action.nextEmbedded, matched, matches, state);
                        // substitute language alias to known modes to support syntax highlighting
                        var embeddedMode = this.modeService.getModeIdForLanguageName(this.embeddedMode);
                        if (this.embeddedMode && embeddedMode) {
                            this.embeddedMode = embeddedMode;
                        }
                        this.embeddedEntered = true;
                    }
                }
                // state transformations
                if (action.goBack) {
                    stream.goBack(action.goBack);
                }
                if (action.switchTo && typeof action.switchTo === 'string') {
                    var nextState = monarchCommon.substituteMatches(this.lexer, action.switchTo, matched, matches, state); // switch state without a push...
                    if (nextState[0] === '@') {
                        nextState = nextState.substr(1); // peel off starting '@'
                    }
                    if (!monarchCommon.findRules(this.lexer, nextState)) {
                        monarchCommon.throwError(this.lexer, 'trying to switch to a state \'' + nextState + '\' that is undefined in rule: ' + rule.name);
                    }
                    else {
                        this.stack[0] = nextState;
                    }
                    next = null;
                }
                else if (action.transform && typeof action.transform === 'function') {
                    this.stack = action.transform(this.stack); // if you need to do really funky stuff...
                    next = null;
                }
                else if (action.next) {
                    if (action.next === '@push') {
                        if (this.stack.length >= this.lexer.maxStack) {
                            monarchCommon.throwError(this.lexer, 'maximum tokenizer stack size reached: [' +
                                this.stack[0] + ',' + this.stack[1] + ',...,' +
                                this.stack[this.stack.length - 2] + ',' + this.stack[this.stack.length - 1] + ']');
                        }
                        else {
                            this.stack.unshift(state);
                        }
                    }
                    else if (action.next === '@pop') {
                        if (this.stack.length <= 1) {
                            monarchCommon.throwError(this.lexer, 'trying to pop an empty stack in rule: ' + rule.name);
                        }
                        else {
                            this.stack.shift();
                        }
                    }
                    else if (action.next === '@popall') {
                        if (this.stack.length > 1) {
                            this.stack = [this.stack[this.stack.length - 1]];
                        }
                    }
                    else {
                        var nextState = monarchCommon.substituteMatches(this.lexer, action.next, matched, matches, state);
                        if (nextState[0] === '@') {
                            nextState = nextState.substr(1); // peel off starting '@'
                        }
                        if (!monarchCommon.findRules(this.lexer, nextState)) {
                            monarchCommon.throwError(this.lexer, 'trying to set a next state \'' + nextState + '\' that is undefined in rule: ' + rule.name);
                        }
                        else {
                            this.stack.unshift(nextState);
                        }
                    }
                }
                if (action.log && typeof (action.log) === 'string') {
                    monarchCommon.log(this.lexer, this.lexer.displayName + ': ' + monarchCommon.substituteMatches(this.lexer, action.log, matched, matches, state));
                }
            }
            // check result
            if (result === null) {
                monarchCommon.throwError(this.lexer, 'lexer rule has no well-defined action in rule: ' + rule.name);
                result = this.lexer.defaultToken;
            }
            // is the result a group match?
            if (Array.isArray(result)) {
                if (this.groupActions && this.groupActions.length > 0) {
                    monarchCommon.throwError(this.lexer, 'groups cannot be nested: ' + rule.name);
                }
                if (matches.length !== result.length + 1) {
                    monarchCommon.throwError(this.lexer, 'matched number of groups does not match the number of actions in rule: ' + rule.name);
                }
                var totalLen = 0;
                for (var i = 1; i < matches.length; i++) {
                    totalLen += matches[i].length;
                }
                if (totalLen !== matched.length) {
                    monarchCommon.throwError(this.lexer, 'with groups, all characters should be matched in consecutive groups in rule: ' + rule.name);
                }
                this.groupMatches = matches;
                this.groupMatched = matches.slice(1);
                this.groupActions = result.slice(0);
                this.groupRule = rule;
                stream.goBack(matched.length);
                return this.tokenize(stream); // call recursively to initiate first result match
            }
            else {
                // check for '@rematch'
                if (result === '@rematch') {
                    stream.goBack(matched.length);
                    matched = ''; // better set the next state too..
                    matches = null;
                    result = '';
                }
                // check progress
                if (matched.length === 0) {
                    if (stackLen0 !== this.stack.length || state !== this.stack[0]
                        || (!this.groupActions ? 0 : this.groupActions.length) !== groupLen0) {
                        if (!noConsumeIsOk) {
                            return this.tokenize(stream); // tokenize again in the new state
                        }
                    }
                    else {
                        monarchCommon.throwError(this.lexer, 'no progress in tokenizer in rule: ' + rule.name);
                        stream.advanceToEOS(); // must make progress or editor loops
                    }
                }
                // return the result (and check for brace matching)
                // todo: for efficiency we could pre-sanitize tokenPostfix and substitutions
                if (result.indexOf('@brackets') === 0) {
                    var rest = result.substr('@brackets'.length);
                    var bracket = findBracket(this.lexer, matched);
                    if (!bracket) {
                        monarchCommon.throwError(this.lexer, '@brackets token returned but no bracket defined as: ' + matched);
                        bracket = { token: '', bracketType: monarchCommon.MonarchBracket.None };
                    }
                    return { type: monarchCommon.sanitize(bracket.token + rest) };
                }
                else {
                    var token = (result === '' ? '' : result + this.lexer.tokenPostfix);
                    return { type: monarchCommon.sanitize(token) };
                }
            }
        };
        MonarchLexer.ID = 0;
        return MonarchLexer;
    }(abstractState_1.AbstractState));
    exports.MonarchLexer = MonarchLexer;
    /**
     * Searches for a bracket in the 'brackets' attribute that matches the input.
     */
    function findBracket(lexer, matched) {
        if (!matched) {
            return null;
        }
        matched = monarchCommon.fixCase(lexer, matched);
        var brackets = lexer.brackets;
        for (var i = 0; i < brackets.length; i++) {
            var bracket = brackets[i];
            if (bracket.open === matched) {
                return { token: bracket.token, bracketType: monarchCommon.MonarchBracket.Open };
            }
            else if (bracket.close === matched) {
                return { token: bracket.token, bracketType: monarchCommon.MonarchBracket.Close };
            }
        }
        return null;
    }
    function createTokenizationSupport(modeService, mode, lexer) {
        return new tokenizationSupport_1.TokenizationSupport(mode, {
            getInitialState: function () {
                return new MonarchLexer(mode, modeService, lexer);
            },
            enterNestedMode: function (state) {
                if (state instanceof MonarchLexer) {
                    return state.embeddedEntered;
                }
                return false;
            },
            getNestedMode: function (rawState) {
                var mime = rawState.embeddedMode;
                if (!modeService.isRegisteredMode(mime)) {
                    // unknown mode
                    return {
                        mode: modeService.getMode('text/plain'),
                        missingModePromise: null
                    };
                }
                var mode = modeService.getMode(mime);
                if (mode) {
                    // mode is available
                    return {
                        mode: mode,
                        missingModePromise: null
                    };
                }
                // mode is not yet loaded
                return {
                    mode: modeService.getMode('text/plain'),
                    missingModePromise: modeService.getOrCreateMode(mime).then(function () { return null; })
                };
            },
            getLeavingNestedModeData: function (line, state) {
                // state = state.clone();
                var mstate = state.clone();
                var stream = new lineStream_1.LineStream(line);
                while (!stream.eos() && mstate.embeddedMode) {
                    mstate.tokenize(stream, true); // allow no consumption for @rematch
                }
                if (mstate.embeddedMode) {
                    return null; // don't leave yet
                }
                var end = stream.pos();
                return {
                    nestedModeBuffer: line.substring(0, end),
                    bufferAfterNestedMode: line.substring(end),
                    stateAfterNestedMode: mstate
                };
            }
        }, lexer.usesEmbedded, false);
    }
    exports.createTokenizationSupport = createTokenizationSupport;
});

define("vs/nls!vs/editor/common/model/textModelWithTokens",['vs/nls', 'vs/nls!vs/editor/common/worker/editorWorkerServer'], function(nls, data) { return nls.create("vs/editor/common/model/textModelWithTokens", data); });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/model/textModelWithTokens", ["require", "exports", 'vs/nls!vs/editor/common/model/textModelWithTokens', 'vs/base/common/async', 'vs/base/common/errors', 'vs/base/common/lifecycle', 'vs/base/common/stopwatch', 'vs/base/common/timer', 'vs/base/common/winjs.base', 'vs/editor/common/config/defaultConfig', 'vs/editor/common/core/arrays', 'vs/editor/common/editorCommon', 'vs/editor/common/model/textModel', 'vs/editor/common/model/textModelWithTokensHelpers', 'vs/editor/common/model/tokenIterator', 'vs/editor/common/modes/nullMode', 'vs/editor/common/modes/supports', 'vs/editor/common/modes/supports/richEditBrackets'], function (require, exports, nls, async_1, errors_1, lifecycle_1, stopwatch_1, timer, winjs_base_1, defaultConfig_1, arrays_1, editorCommon, textModel_1, textModelWithTokensHelpers_1, tokenIterator_1, nullMode_1, supports_1, richEditBrackets_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var TokensInflatorMap = (function () {
        function TokensInflatorMap() {
            this._inflate = [''];
            this._deflate = { '': 0 };
        }
        return TokensInflatorMap;
    }());
    exports.TokensInflatorMap = TokensInflatorMap;
    var ModeToModelBinder = (function () {
        function ModeToModelBinder(modePromise, model) {
            var _this = this;
            this._modePromise = modePromise;
            // Create an external mode promise that fires after the mode is set to the model
            this._externalModePromise = new winjs_base_1.TPromise(function (c, e, p) {
                _this._externalModePromise_c = c;
                _this._externalModePromise_e = e;
            }, function () {
                // this promise cannot be canceled
            });
            this._model = model;
            this._isDisposed = false;
            // Ensure asynchronicity
            winjs_base_1.TPromise.timeout(0).then(function () {
                return _this._modePromise;
            }).then(function (mode) {
                if (_this._isDisposed) {
                    _this._externalModePromise_c(false);
                    return;
                }
                var model = _this._model;
                _this.dispose();
                model.setMode(mode);
                model._warmUpTokens();
                _this._externalModePromise_c(true);
            }).done(null, function (err) {
                _this._externalModePromise_e(err);
                errors_1.onUnexpectedError(err);
            });
        }
        ModeToModelBinder.prototype.getModePromise = function () {
            return this._externalModePromise;
        };
        ModeToModelBinder.prototype.dispose = function () {
            this._modePromise = null;
            this._model = null;
            this._isDisposed = true;
        };
        return ModeToModelBinder;
    }());
    var FullModelRetokenizer = (function () {
        function FullModelRetokenizer(retokenizePromise, model) {
            var _this = this;
            this._retokenizePromise = retokenizePromise;
            this._model = model;
            this._isDisposed = false;
            this.isFulfilled = false;
            // Ensure asynchronicity
            winjs_base_1.TPromise.timeout(0).then(function () {
                return _this._retokenizePromise;
            }).then(function () {
                if (_this._isDisposed) {
                    return;
                }
                _this.isFulfilled = true;
                _this._model.onRetokenizerFulfilled();
            }).done(null, errors_1.onUnexpectedError);
        }
        FullModelRetokenizer.prototype.getRange = function () {
            return null;
        };
        FullModelRetokenizer.prototype.dispose = function () {
            this._retokenizePromise = null;
            this._model = null;
            this._isDisposed = true;
        };
        return FullModelRetokenizer;
    }());
    exports.FullModelRetokenizer = FullModelRetokenizer;
    var LineContext = (function () {
        function LineContext(topLevelMode, line) {
            this.modeTransitions = line.getModeTransitions().toArray(topLevelMode);
            this._text = line.text;
            this._lineTokens = line.getTokens();
        }
        LineContext.prototype.getLineContent = function () {
            return this._text;
        };
        LineContext.prototype.getTokenCount = function () {
            return this._lineTokens.getTokenCount();
        };
        LineContext.prototype.getTokenStartIndex = function (tokenIndex) {
            return this._lineTokens.getTokenStartIndex(tokenIndex);
        };
        LineContext.prototype.getTokenEndIndex = function (tokenIndex) {
            return this._lineTokens.getTokenEndIndex(tokenIndex, this._text.length);
        };
        LineContext.prototype.getTokenType = function (tokenIndex) {
            return this._lineTokens.getTokenType(tokenIndex);
        };
        LineContext.prototype.getTokenText = function (tokenIndex) {
            var startIndex = this._lineTokens.getTokenStartIndex(tokenIndex);
            var endIndex = this._lineTokens.getTokenEndIndex(tokenIndex, this._text.length);
            return this._text.substring(startIndex, endIndex);
        };
        LineContext.prototype.findIndexOfOffset = function (offset) {
            return this._lineTokens.findIndexOfOffset(offset);
        };
        return LineContext;
    }());
    var TextModelWithTokens = (function (_super) {
        __extends(TextModelWithTokens, _super);
        function TextModelWithTokens(allowedEventTypes, rawText, shouldAutoTokenize, modeOrPromise) {
            var _this = this;
            allowedEventTypes.push(editorCommon.EventType.ModelTokensChanged);
            allowedEventTypes.push(editorCommon.EventType.ModelModeChanged);
            allowedEventTypes.push(editorCommon.EventType.ModelModeSupportChanged);
            _super.call(this, allowedEventTypes, rawText);
            this._shouldAutoTokenize = shouldAutoTokenize;
            this._shouldSimplifyMode = (rawText.length > TextModelWithTokens.MODEL_SYNC_LIMIT);
            this._shouldDenyMode = (rawText.length > TextModelWithTokens.MODEL_TOKENIZATION_LIMIT);
            this._stopLineTokenizationAfter = defaultConfig_1.DefaultConfig.editor.stopLineTokenizationAfter;
            if (!modeOrPromise) {
                this._mode = new nullMode_1.NullMode();
            }
            else if (winjs_base_1.TPromise.is(modeOrPromise)) {
                // TODO@Alex: To avoid mode id changes, we check if this promise is resolved
                var promiseValue = modeOrPromise._value;
                if (promiseValue && typeof promiseValue.getId === 'function') {
                    // The promise is already resolved
                    this._mode = this._massageMode(promiseValue);
                    this._resetModeListener(this._mode);
                }
                else {
                    var modePromise = modeOrPromise;
                    this._modeToModelBinder = new ModeToModelBinder(modePromise, this);
                    this._mode = new nullMode_1.NullMode();
                }
            }
            else {
                this._mode = this._massageMode(modeOrPromise);
                this._resetModeListener(this._mode);
            }
            this._revalidateTokensTimeout = -1;
            this._scheduleRetokenizeNow = new async_1.RunOnceScheduler(function () { return _this._retokenizeNow(); }, 200);
            this._retokenizers = [];
            this._resetTokenizationState();
        }
        TextModelWithTokens.prototype.dispose = function () {
            if (this._modeToModelBinder) {
                this._modeToModelBinder.dispose();
                this._modeToModelBinder = null;
            }
            this._resetModeListener(null);
            this._clearTimers();
            this._mode = null;
            this._lastState = null;
            this._tokensInflatorMap = null;
            this._retokenizers = lifecycle_1.disposeAll(this._retokenizers);
            this._scheduleRetokenizeNow.dispose();
            _super.prototype.dispose.call(this);
        };
        TextModelWithTokens.prototype.isTooLargeForHavingAMode = function () {
            return this._shouldDenyMode;
        };
        TextModelWithTokens.prototype.isTooLargeForHavingARichMode = function () {
            return this._shouldSimplifyMode;
        };
        TextModelWithTokens.prototype._massageMode = function (mode) {
            if (this.isTooLargeForHavingAMode()) {
                return new nullMode_1.NullMode();
            }
            if (this.isTooLargeForHavingARichMode()) {
                return mode.toSimplifiedMode();
            }
            return mode;
        };
        TextModelWithTokens.prototype.whenModeIsReady = function () {
            var _this = this;
            if (this._modeToModelBinder) {
                // Still waiting for some mode to load
                return this._modeToModelBinder.getModePromise().then(function () { return _this._mode; });
            }
            return winjs_base_1.TPromise.as(this._mode);
        };
        TextModelWithTokens.prototype.onRetokenizerFulfilled = function () {
            this._scheduleRetokenizeNow.schedule();
        };
        TextModelWithTokens.prototype._retokenizeNow = function () {
            var fulfilled = this._retokenizers.filter(function (r) { return r.isFulfilled; });
            this._retokenizers = this._retokenizers.filter(function (r) { return !r.isFulfilled; });
            var hasFullModel = false;
            for (var i = 0; i < fulfilled.length; i++) {
                if (!fulfilled[i].getRange()) {
                    hasFullModel = true;
                }
            }
            if (hasFullModel) {
                // Just invalidate all the lines
                for (var i = 0, len = this._lines.length; i < len; i++) {
                    this._lines[i].isInvalid = true;
                }
                this._invalidLineStartIndex = 0;
            }
            else {
                var minLineNumber = Number.MAX_VALUE;
                for (var i = 0; i < fulfilled.length; i++) {
                    var range = fulfilled[i].getRange();
                    minLineNumber = Math.min(minLineNumber, range.startLineNumber);
                    for (var lineNumber = range.startLineNumber; lineNumber <= range.endLineNumber; lineNumber++) {
                        this._lines[lineNumber - 1].isInvalid = true;
                    }
                }
                if (minLineNumber - 1 < this._invalidLineStartIndex) {
                    if (this._invalidLineStartIndex < this._lines.length) {
                        this._lines[this._invalidLineStartIndex].isInvalid = true;
                    }
                    this._invalidLineStartIndex = minLineNumber - 1;
                }
            }
            this._beginBackgroundTokenization();
            for (var i = 0; i < fulfilled.length; i++) {
                fulfilled[i].dispose();
            }
        };
        TextModelWithTokens.prototype._createRetokenizer = function (retokenizePromise, lineNumber) {
            return new FullModelRetokenizer(retokenizePromise, this);
        };
        TextModelWithTokens.prototype._resetValue = function (e, newValue) {
            _super.prototype._resetValue.call(this, e, newValue);
            // Cancel tokenization, clear all tokens and begin tokenizing
            this._resetTokenizationState();
        };
        TextModelWithTokens.prototype._resetMode = function (e, newMode) {
            // Cancel tokenization, clear all tokens and begin tokenizing
            this._mode = newMode;
            this._resetModeListener(newMode);
            this._resetTokenizationState();
            this.emitModelTokensChangedEvent(1, this.getLineCount());
        };
        TextModelWithTokens.prototype._resetModeListener = function (newMode) {
            var _this = this;
            if (this._modeListener) {
                this._modeListener.dispose();
                this._modeListener = null;
            }
            if (newMode && typeof newMode.addSupportChangedListener === 'function') {
                this._modeListener = newMode.addSupportChangedListener(function (e) { return _this._onModeSupportChanged(e); });
            }
        };
        TextModelWithTokens.prototype._onModeSupportChanged = function (e) {
            this._emitModelModeSupportChangedEvent(e);
            if (e.tokenizationSupport) {
                this._resetTokenizationState();
                this.emitModelTokensChangedEvent(1, this.getLineCount());
            }
        };
        TextModelWithTokens.prototype._resetTokenizationState = function () {
            this._retokenizers = lifecycle_1.disposeAll(this._retokenizers);
            this._scheduleRetokenizeNow.cancel();
            this._clearTimers();
            for (var i = 0; i < this._lines.length; i++) {
                this._lines[i].setState(null);
            }
            this._initializeTokenizationState();
            this._tokenizationElapsedTime = 0;
            this._tokenizationTotalCharacters = 1;
        };
        TextModelWithTokens.prototype._clearTimers = function () {
            if (this._revalidateTokensTimeout !== -1) {
                clearTimeout(this._revalidateTokensTimeout);
                this._revalidateTokensTimeout = -1;
            }
        };
        TextModelWithTokens.prototype._initializeTokenizationState = function () {
            // Initialize tokenization states
            var initialState = null;
            if (this._mode.tokenizationSupport) {
                try {
                    initialState = this._mode.tokenizationSupport.getInitialState();
                }
                catch (e) {
                    e.friendlyMessage = TextModelWithTokens.MODE_TOKENIZATION_FAILED_MSG;
                    errors_1.onUnexpectedError(e);
                    this._mode = new nullMode_1.NullMode();
                }
            }
            if (!initialState) {
                initialState = new nullMode_1.NullState(this._mode, null);
            }
            this._lines[0].setState(initialState);
            this._lastState = null;
            this._tokensInflatorMap = new TokensInflatorMap();
            this._invalidLineStartIndex = 0;
            this._beginBackgroundTokenization();
        };
        TextModelWithTokens.prototype.setStopLineTokenizationAfter = function (stopLineTokenizationAfter) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.setStopLineTokenizationAfter: Model is disposed');
            }
            this._stopLineTokenizationAfter = stopLineTokenizationAfter;
        };
        TextModelWithTokens.prototype.getLineTokens = function (lineNumber, inaccurateTokensAcceptable) {
            if (inaccurateTokensAcceptable === void 0) { inaccurateTokensAcceptable = false; }
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.getLineTokens: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            if (!inaccurateTokensAcceptable) {
                this._updateTokensUntilLine(lineNumber, true);
            }
            return this._lines[lineNumber - 1].getTokens();
        };
        TextModelWithTokens.prototype.getLineContext = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.getLineContext: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            this._updateTokensUntilLine(lineNumber, true);
            return new LineContext(this._mode, this._lines[lineNumber - 1]);
        };
        TextModelWithTokens.prototype._getInternalTokens = function (lineNumber) {
            this._updateTokensUntilLine(lineNumber, true);
            return this._lines[lineNumber - 1].getTokens();
        };
        TextModelWithTokens.prototype.setValue = function (value, newModeOrPromise) {
            if (newModeOrPromise === void 0) { newModeOrPromise = null; }
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.setValue: Model is disposed');
            }
            var rawText = null;
            if (value !== null) {
                rawText = textModel_1.TextModel.toRawText(value, {
                    tabSize: this._options.tabSize,
                    insertSpaces: this._options.insertSpaces,
                    detectIndentation: false,
                    defaultEOL: this._options.defaultEOL
                });
            }
            this.setValueFromRawText(rawText, newModeOrPromise);
        };
        TextModelWithTokens.prototype.setValueFromRawText = function (value, newModeOrPromise) {
            if (newModeOrPromise === void 0) { newModeOrPromise = null; }
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.setValueFromRawText: Model is disposed');
            }
            if (value !== null) {
                _super.prototype.setValueFromRawText.call(this, value);
            }
            if (newModeOrPromise) {
                if (this._modeToModelBinder) {
                    this._modeToModelBinder.dispose();
                    this._modeToModelBinder = null;
                }
                if (winjs_base_1.TPromise.is(newModeOrPromise)) {
                    this._modeToModelBinder = new ModeToModelBinder(newModeOrPromise, this);
                }
                else {
                    var actualNewMode = this._massageMode(newModeOrPromise);
                    if (this._mode !== actualNewMode) {
                        var e2 = {
                            oldMode: this._mode,
                            newMode: actualNewMode
                        };
                        this._resetMode(e2, actualNewMode);
                        this._emitModelModeChangedEvent(e2);
                    }
                }
            }
        };
        TextModelWithTokens.prototype.getMode = function () {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.getMode: Model is disposed');
            }
            return this._mode;
        };
        TextModelWithTokens.prototype.setMode = function (newModeOrPromise) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.setMode: Model is disposed');
            }
            if (!newModeOrPromise) {
                // There's nothing to do
                return;
            }
            this.setValueFromRawText(null, newModeOrPromise);
        };
        TextModelWithTokens.prototype.getModeAtPosition = function (_lineNumber, _column) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.getModeAtPosition: Model is disposed');
            }
            var validPosition = this.validatePosition({
                lineNumber: _lineNumber,
                column: _column
            });
            var lineNumber = validPosition.lineNumber;
            var column = validPosition.column;
            if (column === 1) {
                return this.getStateBeforeLine(lineNumber).getMode();
            }
            else if (column === this.getLineMaxColumn(lineNumber)) {
                return this.getStateAfterLine(lineNumber).getMode();
            }
            else {
                var modeTransitions = this._getLineModeTransitions(lineNumber);
                var modeTransitionIndex = arrays_1.Arrays.findIndexInSegmentsArray(modeTransitions, column - 1);
                return modeTransitions[modeTransitionIndex].mode;
            }
        };
        TextModelWithTokens.prototype._invalidateLine = function (lineIndex) {
            this._lines[lineIndex].isInvalid = true;
            if (lineIndex < this._invalidLineStartIndex) {
                if (this._invalidLineStartIndex < this._lines.length) {
                    this._lines[this._invalidLineStartIndex].isInvalid = true;
                }
                this._invalidLineStartIndex = lineIndex;
                this._beginBackgroundTokenization();
            }
        };
        TextModelWithTokens.prototype._updateLineTokens = function (lineIndex, map, topLevelMode, r) {
            this._lines[lineIndex].setTokens(map, r.tokens, topLevelMode, r.modeTransitions);
        };
        TextModelWithTokens.prototype._beginBackgroundTokenization = function () {
            var _this = this;
            if (this._shouldAutoTokenize && this._revalidateTokensTimeout === -1) {
                this._revalidateTokensTimeout = setTimeout(function () {
                    _this._revalidateTokensTimeout = -1;
                    _this._revalidateTokensNow();
                }, 0);
            }
        };
        TextModelWithTokens.prototype._warmUpTokens = function () {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens._warmUpTokens: Model is disposed');
            }
            // Warm up first 100 lines (if it takes less than 50ms)
            var maxLineNumber = Math.min(100, this.getLineCount());
            var toLineNumber = maxLineNumber;
            for (var lineNumber = 1; lineNumber <= maxLineNumber; lineNumber++) {
                var text = this._lines[lineNumber - 1].text;
                if (text.length >= 200) {
                    // This line is over 200 chars long, so warm up without it
                    toLineNumber = lineNumber - 1;
                    break;
                }
            }
            this._revalidateTokensNow(toLineNumber);
        };
        TextModelWithTokens.prototype._revalidateTokensNow = function (toLineNumber) {
            if (toLineNumber === void 0) { toLineNumber = this._invalidLineStartIndex + 1000000; }
            var t1 = timer.start(timer.Topic.EDITOR, 'backgroundTokenization');
            toLineNumber = Math.min(this._lines.length, toLineNumber);
            var MAX_ALLOWED_TIME = 20, fromLineNumber = this._invalidLineStartIndex + 1, tokenizedChars = 0, currentCharsToTokenize = 0, currentEstimatedTimeToTokenize = 0, stopLineTokenizationAfter = this._stopLineTokenizationAfter, sw = stopwatch_1.StopWatch.create(false), elapsedTime;
            // Tokenize at most 1000 lines. Estimate the tokenization speed per character and stop when:
            // - MAX_ALLOWED_TIME is reached
            // - tokenizing the next line would go above MAX_ALLOWED_TIME
            for (var lineNumber = fromLineNumber; lineNumber <= toLineNumber; lineNumber++) {
                elapsedTime = sw.elapsed();
                if (elapsedTime > MAX_ALLOWED_TIME) {
                    // Stop if MAX_ALLOWED_TIME is reached
                    toLineNumber = lineNumber - 1;
                    break;
                }
                // Compute how many characters will be tokenized for this line
                currentCharsToTokenize = this._lines[lineNumber - 1].text.length;
                if (stopLineTokenizationAfter !== -1 && currentCharsToTokenize > stopLineTokenizationAfter) {
                    currentCharsToTokenize = stopLineTokenizationAfter;
                }
                if (tokenizedChars > 0) {
                    // If we have enough history, estimate how long tokenizing this line would take
                    currentEstimatedTimeToTokenize = (elapsedTime / tokenizedChars) * currentCharsToTokenize;
                    if (elapsedTime + currentEstimatedTimeToTokenize > MAX_ALLOWED_TIME) {
                        // Tokenizing this line will go above MAX_ALLOWED_TIME
                        toLineNumber = lineNumber - 1;
                        break;
                    }
                }
                this._updateTokensUntilLine(lineNumber, false);
                tokenizedChars += currentCharsToTokenize;
            }
            elapsedTime = sw.elapsed();
            //		console.log('TOKENIZED LOCAL (' + this._mode.getId() + ') ' + tokenizedChars + '\t in \t' + elapsedTime + '\t speed \t' + tokenizedChars/elapsedTime);
            //		console.log('TOKENIZED GLOBAL(' + this._mode.getId() + ') ' + this._tokenizationTotalCharacters + '\t in*\t' + this._tokenizationElapsedTime + '\t speed*\t' + this._tokenizationTotalCharacters/this._tokenizationElapsedTime);
            var t2 = timer.start(timer.Topic.EDITOR, '**speed: ' + this._tokenizationTotalCharacters / this._tokenizationElapsedTime);
            t2.stop();
            if (fromLineNumber <= toLineNumber) {
                this.emitModelTokensChangedEvent(fromLineNumber, toLineNumber);
            }
            if (this._invalidLineStartIndex < this._lines.length) {
                this._beginBackgroundTokenization();
            }
            t1.stop();
        };
        TextModelWithTokens.prototype.getStateBeforeLine = function (lineNumber) {
            this._updateTokensUntilLine(lineNumber - 1, true);
            return this._lines[lineNumber - 1].getState();
        };
        TextModelWithTokens.prototype.getStateAfterLine = function (lineNumber) {
            this._updateTokensUntilLine(lineNumber, true);
            return lineNumber < this._lines.length ? this._lines[lineNumber].getState() : this._lastState;
        };
        TextModelWithTokens.prototype._getLineModeTransitions = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens._getLineModeTransitions: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            this._updateTokensUntilLine(lineNumber, true);
            return this._lines[lineNumber - 1].getModeTransitions().toArray(this._mode);
        };
        TextModelWithTokens.prototype._updateTokensUntilLine = function (lineNumber, emitEvents) {
            var linesLength = this._lines.length;
            var endLineIndex = lineNumber - 1;
            var stopLineTokenizationAfter = this._stopLineTokenizationAfter;
            if (stopLineTokenizationAfter === -1) {
                stopLineTokenizationAfter = 1000000000; // 1 billion, if a line is so long, you have other trouble :).
            }
            var sw = stopwatch_1.StopWatch.create(false);
            var tokenizedCharacters = 0;
            var fromLineNumber = this._invalidLineStartIndex + 1, toLineNumber = lineNumber;
            // Validate all states up to and including endLineIndex
            for (var lineIndex = this._invalidLineStartIndex; lineIndex <= endLineIndex; lineIndex++) {
                var endStateIndex = lineIndex + 1;
                var r = null;
                var text = this._lines[lineIndex].text;
                if (this._mode.tokenizationSupport) {
                    try {
                        // Tokenize only the first X characters
                        r = this._mode.tokenizationSupport.tokenize(this._lines[lineIndex].text, this._lines[lineIndex].getState(), 0, stopLineTokenizationAfter);
                        tokenizedCharacters = r ? r.actualStopOffset : this._lines[lineIndex].text.length;
                    }
                    catch (e) {
                        e.friendlyMessage = TextModelWithTokens.MODE_TOKENIZATION_FAILED_MSG;
                        errors_1.onUnexpectedError(e);
                    }
                    if (r && r.retokenize) {
                        this._retokenizers.push(this._createRetokenizer(r.retokenize, lineIndex + 1));
                    }
                    if (r && r.tokens && r.tokens.length > 0) {
                        // Cannot have a stop offset before the last token
                        r.actualStopOffset = Math.max(r.actualStopOffset, r.tokens[r.tokens.length - 1].startIndex + 1);
                    }
                    if (r && r.actualStopOffset < text.length) {
                        // Treat the rest of the line (if above limit) as one default token
                        r.tokens.push({
                            startIndex: r.actualStopOffset,
                            type: ''
                        });
                        // Use as end state the starting state
                        r.endState = this._lines[lineIndex].getState();
                    }
                }
                if (!r) {
                    r = nullMode_1.nullTokenize(this._mode, text, this._lines[lineIndex].getState());
                }
                if (!r.modeTransitions) {
                    r.modeTransitions = [];
                }
                if (r.modeTransitions.length === 0) {
                    // Make sure there is at least the transition to the top-most mode
                    r.modeTransitions.push({
                        startIndex: 0,
                        mode: this._mode
                    });
                }
                this._updateLineTokens(lineIndex, this._tokensInflatorMap, this._mode, r);
                if (this._lines[lineIndex].isInvalid) {
                    this._lines[lineIndex].isInvalid = false;
                }
                if (endStateIndex < linesLength) {
                    if (this._lines[endStateIndex].getState() !== null && r.endState.equals(this._lines[endStateIndex].getState())) {
                        // The end state of this line remains the same
                        var nextInvalidLineIndex = lineIndex + 1;
                        while (nextInvalidLineIndex < linesLength) {
                            if (this._lines[nextInvalidLineIndex].isInvalid) {
                                break;
                            }
                            if (nextInvalidLineIndex + 1 < linesLength) {
                                if (this._lines[nextInvalidLineIndex + 1].getState() === null) {
                                    break;
                                }
                            }
                            else {
                                if (this._lastState === null) {
                                    break;
                                }
                            }
                            nextInvalidLineIndex++;
                        }
                        this._invalidLineStartIndex = Math.max(this._invalidLineStartIndex, nextInvalidLineIndex);
                        lineIndex = nextInvalidLineIndex - 1; // -1 because the outer loop increments it
                    }
                    else {
                        this._lines[endStateIndex].setState(r.endState);
                    }
                }
                else {
                    this._lastState = r.endState;
                }
            }
            this._invalidLineStartIndex = Math.max(this._invalidLineStartIndex, endLineIndex + 1);
            this._tokenizationElapsedTime += sw.elapsed();
            this._tokenizationTotalCharacters += tokenizedCharacters;
            if (emitEvents && fromLineNumber <= toLineNumber) {
                this.emitModelTokensChangedEvent(fromLineNumber, toLineNumber);
            }
        };
        TextModelWithTokens.prototype.emitModelTokensChangedEvent = function (fromLineNumber, toLineNumber) {
            var e = {
                fromLineNumber: fromLineNumber,
                toLineNumber: toLineNumber
            };
            if (!this._isDisposing) {
                this.emit(editorCommon.EventType.ModelTokensChanged, e);
            }
        };
        TextModelWithTokens.prototype._emitModelModeChangedEvent = function (e) {
            if (!this._isDisposing) {
                this.emit(editorCommon.EventType.ModelModeChanged, e);
            }
        };
        TextModelWithTokens.prototype._emitModelModeSupportChangedEvent = function (e) {
            if (!this._isDisposing) {
                this.emit(editorCommon.EventType.ModelModeSupportChanged, e);
            }
        };
        // Having tokens allows implementing additional helper methods
        TextModelWithTokens.prototype._lineIsTokenized = function (lineNumber) {
            return this._invalidLineStartIndex > lineNumber - 1;
        };
        TextModelWithTokens.prototype._getWordDefinition = function () {
            return textModelWithTokensHelpers_1.WordHelper.massageWordDefinitionOf(this._mode);
        };
        TextModelWithTokens.prototype.getWordAtPosition = function (position) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.getWordAtPosition: Model is disposed');
            }
            return textModelWithTokensHelpers_1.WordHelper.getWordAtPosition(this, this.validatePosition(position));
        };
        TextModelWithTokens.prototype.getWordUntilPosition = function (position) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.getWordUntilPosition: Model is disposed');
            }
            var wordAtPosition = this.getWordAtPosition(position);
            if (!wordAtPosition) {
                return {
                    word: '',
                    startColumn: position.column,
                    endColumn: position.column
                };
            }
            return {
                word: wordAtPosition.word.substr(0, position.column - wordAtPosition.startColumn),
                startColumn: wordAtPosition.startColumn,
                endColumn: position.column
            };
        };
        TextModelWithTokens.prototype.getWords = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.getWords: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            return textModelWithTokensHelpers_1.WordHelper.getWords(this, this.validateLineNumber(lineNumber));
        };
        TextModelWithTokens.prototype.tokenIterator = function (position, callback) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.tokenIterator: Model is disposed');
            }
            var iter = new tokenIterator_1.TokenIterator(this, this.validatePosition(position));
            var result = callback(iter);
            iter._invalidate();
            return result;
        };
        TextModelWithTokens.prototype.findMatchingBracketUp = function (bracket, _position) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.findMatchingBracketUp: Model is disposed');
            }
            var position = this.validatePosition(_position);
            var modeTransitions = this._lines[position.lineNumber - 1].getModeTransitions().toArray(this._mode);
            var currentModeIndex = arrays_1.Arrays.findIndexInSegmentsArray(modeTransitions, position.column - 1);
            var currentMode = modeTransitions[currentModeIndex];
            var currentModeBrackets = currentMode.mode.richEditSupport ? currentMode.mode.richEditSupport.brackets : null;
            if (!currentModeBrackets) {
                return null;
            }
            var data = currentModeBrackets.textIsBracket[bracket];
            if (!data) {
                return null;
            }
            return this._findMatchingBracketUp(data, position);
        };
        TextModelWithTokens.prototype.matchBracket = function (position, inaccurateResultAcceptable) {
            if (inaccurateResultAcceptable === void 0) { inaccurateResultAcceptable = false; }
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.matchBracket: Model is disposed');
            }
            return this._matchBracket(this.validatePosition(position));
        };
        TextModelWithTokens.prototype._matchBracket = function (position) {
            var tokensMap = this._tokensInflatorMap;
            var lineNumber = position.lineNumber;
            var lineText = this._lines[lineNumber - 1].text;
            var lineTokens = this._lines[lineNumber - 1].getTokens();
            var tokens = lineTokens.getBinaryEncodedTokens();
            var currentTokenIndex = lineTokens.findIndexOfOffset(position.column - 1);
            var currentTokenStart = getStartIndex(tokens[currentTokenIndex]);
            var modeTransitions = this._lines[lineNumber - 1].getModeTransitions().toArray(this._mode);
            var currentModeIndex = arrays_1.Arrays.findIndexInSegmentsArray(modeTransitions, position.column - 1);
            var currentMode = modeTransitions[currentModeIndex];
            var currentModeBrackets = currentMode.mode.richEditSupport ? currentMode.mode.richEditSupport.brackets : null;
            // If position is in between two tokens, try first looking in the previous token
            if (currentTokenIndex > 0 && currentTokenStart === position.column - 1) {
                var prevTokenIndex = currentTokenIndex - 1;
                var prevTokenType = getType(tokensMap, tokens[prevTokenIndex]);
                // check that previous token is not to be ignored
                if (!supports_1.ignoreBracketsInToken(prevTokenType)) {
                    var prevTokenStart = getStartIndex(tokens[prevTokenIndex]);
                    var prevMode = currentMode;
                    var prevModeBrackets = currentModeBrackets;
                    // check if previous token is in a different mode
                    if (currentModeIndex > 0 && currentMode.startIndex === position.column - 1) {
                        prevMode = modeTransitions[currentModeIndex - 1];
                        prevModeBrackets = prevMode.mode.richEditSupport ? prevMode.mode.richEditSupport.brackets : null;
                    }
                    if (prevModeBrackets) {
                        // limit search in case previous token is very large, there's no need to go beyond `maxBracketLength`
                        prevTokenStart = Math.max(prevTokenStart, position.column - 1 - prevModeBrackets.maxBracketLength);
                        var foundBracket = richEditBrackets_1.BracketsUtils.findPrevBracketInToken(prevModeBrackets.reversedRegex, lineNumber, lineText, prevTokenStart, currentTokenStart);
                        // check that we didn't hit a bracket too far away from position
                        if (foundBracket && foundBracket.startColumn <= position.column && position.column <= foundBracket.endColumn) {
                            var foundBracketText = lineText.substring(foundBracket.startColumn - 1, foundBracket.endColumn - 1);
                            var r = this._matchFoundBracket(foundBracket, prevModeBrackets.textIsBracket[foundBracketText], prevModeBrackets.textIsOpenBracket[foundBracketText]);
                            // check that we can actually match this bracket
                            if (r) {
                                return r;
                            }
                        }
                    }
                }
            }
            // check that the token is not to be ignored
            if (!supports_1.ignoreBracketsInToken(getType(tokensMap, tokens[currentTokenIndex]))) {
                if (currentModeBrackets) {
                    // limit search to not go before `maxBracketLength`
                    currentTokenStart = Math.max(currentTokenStart, position.column - 1 - currentModeBrackets.maxBracketLength);
                    // limit search to not go after `maxBracketLength`
                    var currentTokenEnd = (currentTokenIndex + 1 < tokens.length ? getStartIndex(tokens[currentTokenIndex + 1]) : lineText.length);
                    currentTokenEnd = Math.min(currentTokenEnd, position.column - 1 + currentModeBrackets.maxBracketLength);
                    // it might still be the case that [currentTokenStart -> currentTokenEnd] contains multiple brackets
                    while (true) {
                        var foundBracket = richEditBrackets_1.BracketsUtils.findNextBracketInText(currentModeBrackets.forwardRegex, lineNumber, lineText.substring(currentTokenStart, currentTokenEnd), currentTokenStart);
                        if (!foundBracket) {
                            // there are no brackets in this text
                            break;
                        }
                        // check that we didn't hit a bracket too far away from position
                        if (foundBracket.startColumn <= position.column && position.column <= foundBracket.endColumn) {
                            var foundBracketText = lineText.substring(foundBracket.startColumn - 1, foundBracket.endColumn - 1);
                            var r = this._matchFoundBracket(foundBracket, currentModeBrackets.textIsBracket[foundBracketText], currentModeBrackets.textIsOpenBracket[foundBracketText]);
                            // check that we can actually match this bracket
                            if (r) {
                                return r;
                            }
                        }
                        currentTokenStart = foundBracket.endColumn - 1;
                    }
                }
            }
            return {
                brackets: null,
                isAccurate: true
            };
        };
        TextModelWithTokens.prototype._matchFoundBracket = function (foundBracket, data, isOpen) {
            if (isOpen) {
                var matched = this._findMatchingBracketDown(data, foundBracket.getEndPosition());
                if (matched) {
                    return {
                        brackets: [foundBracket, matched],
                        isAccurate: true
                    };
                }
            }
            else {
                var matched = this._findMatchingBracketUp(data, foundBracket.getStartPosition());
                if (matched) {
                    return {
                        brackets: [foundBracket, matched],
                        isAccurate: true
                    };
                }
            }
            return null;
        };
        TextModelWithTokens.prototype._findMatchingBracketUp = function (bracket, position) {
            // console.log('_findMatchingBracketUp: ', 'bracket: ', JSON.stringify(bracket), 'startPosition: ', String(position));
            var modeId = bracket.modeId;
            var tokensMap = this._tokensInflatorMap;
            var reversedBracketRegex = bracket.reversedRegex;
            var count = -1;
            for (var lineNumber = position.lineNumber; lineNumber >= 1; lineNumber--) {
                var lineTokens = this._lines[lineNumber - 1].getTokens();
                var lineText = this._lines[lineNumber - 1].text;
                var tokens = lineTokens.getBinaryEncodedTokens();
                var modeTransitions = this._lines[lineNumber - 1].getModeTransitions().toArray(this._mode);
                var currentModeIndex = modeTransitions.length - 1;
                var currentModeStart = modeTransitions[currentModeIndex].startIndex;
                var currentModeId = modeTransitions[currentModeIndex].mode.getId();
                var tokensLength = tokens.length - 1;
                var currentTokenEnd = lineText.length;
                if (lineNumber === position.lineNumber) {
                    tokensLength = lineTokens.findIndexOfOffset(position.column - 1);
                    currentTokenEnd = position.column - 1;
                    currentModeIndex = arrays_1.Arrays.findIndexInSegmentsArray(modeTransitions, position.column - 1);
                    currentModeStart = modeTransitions[currentModeIndex].startIndex;
                    currentModeId = modeTransitions[currentModeIndex].mode.getId();
                }
                for (var tokenIndex = tokensLength; tokenIndex >= 0; tokenIndex--) {
                    var currentToken = tokens[tokenIndex];
                    var currentTokenType = getType(tokensMap, currentToken);
                    var currentTokenStart = getStartIndex(currentToken);
                    if (currentTokenStart < currentModeStart) {
                        currentModeIndex--;
                        currentModeStart = modeTransitions[currentModeIndex].startIndex;
                        currentModeId = modeTransitions[currentModeIndex].mode.getId();
                    }
                    if (currentModeId === modeId && !supports_1.ignoreBracketsInToken(currentTokenType)) {
                        while (true) {
                            var r = richEditBrackets_1.BracketsUtils.findPrevBracketInToken(reversedBracketRegex, lineNumber, lineText, currentTokenStart, currentTokenEnd);
                            if (!r) {
                                break;
                            }
                            var hitText = lineText.substring(r.startColumn - 1, r.endColumn - 1);
                            if (hitText === bracket.open) {
                                count++;
                            }
                            else if (hitText === bracket.close) {
                                count--;
                            }
                            if (count === 0) {
                                return r;
                            }
                            currentTokenEnd = r.startColumn - 1;
                        }
                    }
                    currentTokenEnd = currentTokenStart;
                }
            }
            return null;
        };
        TextModelWithTokens.prototype._findMatchingBracketDown = function (bracket, position) {
            // console.log('_findMatchingBracketDown: ', 'bracket: ', JSON.stringify(bracket), 'startPosition: ', String(position));
            var modeId = bracket.modeId;
            var tokensMap = this._tokensInflatorMap;
            var bracketRegex = bracket.forwardRegex;
            var count = 1;
            for (var lineNumber = position.lineNumber, lineCount = this.getLineCount(); lineNumber <= lineCount; lineNumber++) {
                var lineTokens = this._lines[lineNumber - 1].getTokens();
                var lineText = this._lines[lineNumber - 1].text;
                var tokens = lineTokens.getBinaryEncodedTokens();
                var modeTransitions = this._lines[lineNumber - 1].getModeTransitions().toArray(this._mode);
                var currentModeIndex = 0;
                var nextModeStart = (currentModeIndex + 1 < modeTransitions.length ? modeTransitions[currentModeIndex + 1].startIndex : lineText.length + 1);
                var currentModeId = modeTransitions[currentModeIndex].mode.getId();
                var startTokenIndex = 0;
                var currentTokenStart = getStartIndex(startTokenIndex);
                if (lineNumber === position.lineNumber) {
                    startTokenIndex = lineTokens.findIndexOfOffset(position.column - 1);
                    currentTokenStart = Math.max(currentTokenStart, position.column - 1);
                    currentModeIndex = arrays_1.Arrays.findIndexInSegmentsArray(modeTransitions, position.column - 1);
                    nextModeStart = (currentModeIndex + 1 < modeTransitions.length ? modeTransitions[currentModeIndex + 1].startIndex : lineText.length + 1);
                    currentModeId = modeTransitions[currentModeIndex].mode.getId();
                }
                for (var tokenIndex = startTokenIndex, tokensLength = tokens.length; tokenIndex < tokensLength; tokenIndex++) {
                    var currentToken = tokens[tokenIndex];
                    var currentTokenType = getType(tokensMap, currentToken);
                    var currentTokenEnd = tokenIndex + 1 < tokensLength ? getStartIndex(tokens[tokenIndex + 1]) : lineText.length;
                    if (currentTokenStart >= nextModeStart) {
                        currentModeIndex++;
                        nextModeStart = (currentModeIndex + 1 < modeTransitions.length ? modeTransitions[currentModeIndex + 1].startIndex : lineText.length + 1);
                        currentModeId = modeTransitions[currentModeIndex].mode.getId();
                    }
                    if (currentModeId === modeId && !supports_1.ignoreBracketsInToken(currentTokenType)) {
                        while (true) {
                            var r = richEditBrackets_1.BracketsUtils.findNextBracketInToken(bracketRegex, lineNumber, lineText, currentTokenStart, currentTokenEnd);
                            if (!r) {
                                break;
                            }
                            var hitText = lineText.substring(r.startColumn - 1, r.endColumn - 1);
                            if (hitText === bracket.open) {
                                count++;
                            }
                            else if (hitText === bracket.close) {
                                count--;
                            }
                            if (count === 0) {
                                return r;
                            }
                            currentTokenStart = r.endColumn - 1;
                        }
                    }
                    currentTokenStart = currentTokenEnd;
                }
            }
            return null;
        };
        TextModelWithTokens.prototype.findPrevBracket = function (_position) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.findPrevBracket: Model is disposed');
            }
            var position = this.validatePosition(_position);
            var tokensMap = this._tokensInflatorMap;
            var reversedBracketRegex = /[\(\)\[\]\{\}]/; // TODO@Alex: use mode's brackets
            for (var lineNumber = position.lineNumber; lineNumber >= 1; lineNumber--) {
                var lineTokens = this._lines[lineNumber - 1].getTokens();
                var lineText = this._lines[lineNumber - 1].text;
                var tokens = lineTokens.getBinaryEncodedTokens();
                var tokensLength = tokens.length - 1;
                var currentTokenEnd = lineText.length;
                if (lineNumber === position.lineNumber) {
                    tokensLength = lineTokens.findIndexOfOffset(position.column - 1);
                    currentTokenEnd = position.column - 1;
                }
                for (var tokenIndex = tokensLength; tokenIndex >= 0; tokenIndex--) {
                    var currentToken = tokens[tokenIndex];
                    var currentTokenType = getType(tokensMap, currentToken);
                    var currentTokenStart = getStartIndex(currentToken);
                    if (!supports_1.ignoreBracketsInToken(currentTokenType)) {
                        var r = richEditBrackets_1.BracketsUtils.findPrevBracketInToken(reversedBracketRegex, lineNumber, lineText, currentTokenStart, currentTokenEnd);
                        if (r) {
                            return this._toFoundBracket(r);
                        }
                    }
                    currentTokenEnd = currentTokenStart;
                }
            }
            return null;
        };
        TextModelWithTokens.prototype.findNextBracket = function (_position) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.findNextBracket: Model is disposed');
            }
            var position = this.validatePosition(_position);
            var tokensMap = this._tokensInflatorMap;
            var bracketRegex = /[\(\)\[\]\{\}]/; // TODO@Alex: use mode's brackets
            for (var lineNumber = position.lineNumber, lineCount = this.getLineCount(); lineNumber <= lineCount; lineNumber++) {
                var lineTokens = this._lines[lineNumber - 1].getTokens();
                var lineText = this._lines[lineNumber - 1].text;
                var tokens = lineTokens.getBinaryEncodedTokens();
                var startTokenIndex = 0;
                var currentTokenStart = getStartIndex(startTokenIndex);
                if (lineNumber === position.lineNumber) {
                    startTokenIndex = lineTokens.findIndexOfOffset(position.column - 1);
                    currentTokenStart = Math.max(currentTokenStart, position.column - 1);
                }
                for (var tokenIndex = startTokenIndex, tokensLength = tokens.length; tokenIndex < tokensLength; tokenIndex++) {
                    var currentToken = tokens[tokenIndex];
                    var currentTokenType = getType(tokensMap, currentToken);
                    var currentTokenEnd = tokenIndex + 1 < tokensLength ? getStartIndex(tokens[tokenIndex + 1]) : lineText.length;
                    if (!supports_1.ignoreBracketsInToken(currentTokenType)) {
                        var r = richEditBrackets_1.BracketsUtils.findNextBracketInToken(bracketRegex, lineNumber, lineText, currentTokenStart, currentTokenEnd);
                        if (r) {
                            return this._toFoundBracket(r);
                        }
                    }
                    currentTokenStart = currentTokenEnd;
                }
            }
            return null;
        };
        TextModelWithTokens.prototype._toFoundBracket = function (r) {
            if (!r) {
                return null;
            }
            var text = this.getValueInRange(r);
            // TODO@Alex: use mode's brackets
            switch (text) {
                case '(': return { range: r, open: '(', close: ')', isOpen: true };
                case ')': return { range: r, open: '(', close: ')', isOpen: false };
                case '[': return { range: r, open: '[', close: ']', isOpen: true };
                case ']': return { range: r, open: '[', close: ']', isOpen: false };
                case '{': return { range: r, open: '{', close: '}', isOpen: true };
                case '}': return { range: r, open: '{', close: '}', isOpen: false };
            }
            return null;
        };
        TextModelWithTokens.MODE_TOKENIZATION_FAILED_MSG = nls.localize(0, null);
        TextModelWithTokens.MODEL_SYNC_LIMIT = 5 * 1024 * 1024; // 5 MB
        TextModelWithTokens.MODEL_TOKENIZATION_LIMIT = 20 * 1024 * 1024; // 20 MB
        return TextModelWithTokens;
    }(textModel_1.TextModel));
    exports.TextModelWithTokens = TextModelWithTokens;
    var getType = editorCommon.LineTokensBinaryEncoding.getType;
    var getStartIndex = editorCommon.LineTokensBinaryEncoding.getStartIndex;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/model/mirrorModel", ["require", "exports", 'vs/base/common/lifecycle', 'vs/editor/common/editorCommon', 'vs/editor/common/model/modelLine', 'vs/editor/common/model/textModel', 'vs/editor/common/model/textModelWithTokens', 'vs/editor/common/viewModel/prefixSumComputer'], function (require, exports, lifecycle_1, editorCommon, modelLine_1, textModel_1, textModelWithTokens_1, prefixSumComputer_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var AbstractMirrorModel = (function (_super) {
        __extends(AbstractMirrorModel, _super);
        function AbstractMirrorModel(allowedEventTypes, versionId, value, mode, associatedResource) {
            _super.call(this, allowedEventTypes.concat([editorCommon.EventType.ModelDispose]), value, false, mode);
            this._setVersionId(versionId);
            this._associatedResource = associatedResource;
        }
        AbstractMirrorModel.prototype.getModeId = function () {
            if (this._isDisposed) {
                throw new Error('AbstractMirrorModel.getModeId: Model is disposed');
            }
            return this.getMode().getId();
        };
        AbstractMirrorModel.prototype.getEmbeddedAtPosition = function (position) {
            return null;
        };
        AbstractMirrorModel.prototype.getAllEmbedded = function () {
            return [];
        };
        AbstractMirrorModel.prototype._constructLines = function (rawText) {
            _super.prototype._constructLines.call(this, rawText);
            // Force EOL to be \n
            this._EOL = '\n';
        };
        AbstractMirrorModel.prototype.destroy = function () {
            this.dispose();
        };
        AbstractMirrorModel.prototype.dispose = function () {
            this.emit(editorCommon.EventType.ModelDispose);
            _super.prototype.dispose.call(this);
        };
        AbstractMirrorModel.prototype.getAssociatedResource = function () {
            if (this._isDisposed) {
                throw new Error('AbstractMirrorModel.getAssociatedResource: Model is disposed');
            }
            return this._associatedResource;
        };
        AbstractMirrorModel.prototype._ensurePrefixSum = function () {
            if (!this._lineStarts) {
                var lineStartValues = [], eolLength = this.getEOL().length;
                for (var i = 0, len = this._lines.length; i < len; i++) {
                    lineStartValues.push(this._lines[i].text.length + eolLength);
                }
                this._lineStarts = new prefixSumComputer_1.PrefixSumComputer(lineStartValues);
            }
        };
        AbstractMirrorModel.prototype.getRangeFromOffsetAndLength = function (offset, length) {
            if (this._isDisposed) {
                throw new Error('AbstractMirrorModel.getRangeFromOffsetAndLength: Model is disposed');
            }
            var startPosition = this.getPositionFromOffset(offset), endPosition = this.getPositionFromOffset(offset + length);
            return {
                startLineNumber: startPosition.lineNumber,
                startColumn: startPosition.column,
                endLineNumber: endPosition.lineNumber,
                endColumn: endPosition.column
            };
        };
        AbstractMirrorModel.prototype.getOffsetAndLengthFromRange = function (range) {
            if (this._isDisposed) {
                throw new Error('AbstractMirrorModel.getOffsetAndLengthFromRange: Model is disposed');
            }
            var startOffset = this.getOffsetFromPosition({ lineNumber: range.startLineNumber, column: range.startColumn }), endOffset = this.getOffsetFromPosition({ lineNumber: range.endLineNumber, column: range.endColumn });
            return {
                offset: startOffset,
                length: endOffset - startOffset
            };
        };
        AbstractMirrorModel.prototype.getPositionFromOffset = function (offset) {
            if (this._isDisposed) {
                throw new Error('AbstractMirrorModel.getPositionFromOffset: Model is disposed');
            }
            this._ensurePrefixSum();
            var r = {
                index: 0,
                remainder: 0
            };
            this._lineStarts.getIndexOf(offset, r);
            return {
                lineNumber: r.index + 1,
                column: this.getEOL().length + r.remainder
            };
        };
        AbstractMirrorModel.prototype.getOffsetFromPosition = function (position) {
            if (this._isDisposed) {
                throw new Error('AbstractMirrorModel.getOffsetFromPosition: Model is disposed');
            }
            return this.getLineStart(position.lineNumber) + position.column - 1 /* column isn't zero-index based */;
        };
        AbstractMirrorModel.prototype.getLineStart = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('AbstractMirrorModel.getLineStart: Model is disposed');
            }
            this._ensurePrefixSum();
            var lineIndex = Math.min(lineNumber, this._lines.length) - 1;
            return this._lineStarts.getAccumulatedValue(lineIndex - 1);
        };
        AbstractMirrorModel.prototype.getAllWordsWithRange = function () {
            if (this._isDisposed) {
                throw new Error('AbstractMirrorModel.getAllWordsWithRange: Model is disposed');
            }
            if (this._lines.length > 10000) {
                // This is a very heavy method, unavailable for very heavy models
                return [];
            }
            var result = [], i;
            var toTextRange = function (info) {
                var s = line.text.substring(info.start, info.end);
                var r = { startLineNumber: i + 1, startColumn: info.start + 1, endLineNumber: i + 1, endColumn: info.end + 1 };
                result.push({ text: s, range: r });
            };
            for (i = 0; i < this._lines.length; i++) {
                var line = this._lines[i];
                this.wordenize(line.text).forEach(toTextRange);
            }
            return result;
        };
        AbstractMirrorModel.prototype.getAllWords = function () {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('AbstractMirrorModel.getAllWords: Model is disposed');
            }
            var result = [];
            this._lines.forEach(function (line) {
                _this.wordenize(line.text).forEach(function (info) {
                    result.push(line.text.substring(info.start, info.end));
                });
            });
            return result;
        };
        AbstractMirrorModel.prototype.getAllUniqueWords = function (skipWordOnce) {
            if (this._isDisposed) {
                throw new Error('AbstractMirrorModel.getAllUniqueWords: Model is disposed');
            }
            var foundSkipWord = false;
            var uniqueWords = {};
            return this.getAllWords().filter(function (word) {
                if (skipWordOnce && !foundSkipWord && skipWordOnce === word) {
                    foundSkipWord = true;
                    return false;
                }
                else if (uniqueWords[word]) {
                    return false;
                }
                else {
                    uniqueWords[word] = true;
                    return true;
                }
            });
        };
        //	// TODO@Joh, TODO@Alex - remove these and make sure the super-things work
        AbstractMirrorModel.prototype.wordenize = function (content) {
            var result = [];
            var match;
            var wordsRegexp = this._getWordDefinition();
            while (match = wordsRegexp.exec(content)) {
                result.push({ start: match.index, end: match.index + match[0].length });
            }
            return result;
        };
        return AbstractMirrorModel;
    }(textModelWithTokens_1.TextModelWithTokens));
    exports.AbstractMirrorModel = AbstractMirrorModel;
    var MirrorModelEmbedded = (function (_super) {
        __extends(MirrorModelEmbedded, _super);
        function MirrorModelEmbedded(actualModel, includeRanges, mode, url) {
            _super.call(this, ['changed'], actualModel.getVersionId(), MirrorModelEmbedded._getMirrorValueWithinRanges(actualModel, includeRanges), mode, url);
            this._actualModel = actualModel;
        }
        MirrorModelEmbedded._getMirrorValueWithinRanges = function (actualModel, includeRanges) {
            var resultingText = '', prevLineAdded = 1, prevColumnAdded = 1, i;
            for (i = 0; i < includeRanges.length; i++) {
                var includeRange = includeRanges[i];
                resultingText += actualModel.getEmptiedValueInRange({
                    startLineNumber: prevLineAdded,
                    startColumn: prevColumnAdded,
                    endLineNumber: includeRange.startLineNumber,
                    endColumn: includeRange.startColumn
                }, ' ');
                resultingText += actualModel.getValueInRange(includeRange);
                prevLineAdded = includeRange.endLineNumber;
                prevColumnAdded = includeRange.endColumn;
            }
            var lastLineNumber = actualModel.getLineCount(), lastColumn = actualModel.getLineMaxColumn(lastLineNumber);
            resultingText += actualModel.getEmptiedValueInRange({
                startLineNumber: prevLineAdded,
                startColumn: prevColumnAdded,
                endLineNumber: lastLineNumber,
                endColumn: lastColumn
            }, ' ');
            var actualModelOptions = actualModel.getOptions();
            return textModel_1.TextModel.toRawText(resultingText, {
                tabSize: actualModelOptions.tabSize,
                insertSpaces: actualModelOptions.insertSpaces,
                detectIndentation: false,
                defaultEOL: actualModelOptions.defaultEOL
            });
        };
        MirrorModelEmbedded.prototype.setIncludedRanges = function (newIncludedRanges) {
            var prevVersionId = this.getVersionId();
            // Force recreating of line starts (when used)
            this._lineStarts = null;
            this._constructLines(MirrorModelEmbedded._getMirrorValueWithinRanges(this._actualModel, newIncludedRanges));
            this._resetTokenizationState();
            this._setVersionId(prevVersionId + 1);
            this.emit('changed', {});
        };
        return MirrorModelEmbedded;
    }(AbstractMirrorModel));
    exports.MirrorModelEmbedded = MirrorModelEmbedded;
    var EmbeddedModeRange = (function () {
        function EmbeddedModeRange(mode) {
            this.mode = mode;
            this.ranges = [];
        }
        return EmbeddedModeRange;
    }());
    function createTestMirrorModelFromString(value, mode, associatedResource) {
        if (mode === void 0) { mode = null; }
        return new MirrorModel(null, 0, textModel_1.TextModel.toRawText(value, textModel_1.TextModel.DEFAULT_CREATION_OPTIONS), mode, associatedResource);
    }
    exports.createTestMirrorModelFromString = createTestMirrorModelFromString;
    var MirrorModel = (function (_super) {
        __extends(MirrorModel, _super);
        function MirrorModel(resourceService, versionId, value, mode, associatedResource) {
            _super.call(this, ['changed'], versionId, value, mode, associatedResource);
            this._resourceService = resourceService;
            this._embeddedModels = {};
            this._updateEmbeddedModels();
        }
        MirrorModel.prototype.getEmbeddedAtPosition = function (position) {
            if (this._isDisposed) {
                throw new Error('MirrorModel.getEmbeddedAtPosition: Model is disposed');
            }
            var modeAtPosition = this.getModeAtPosition(position.lineNumber, position.column);
            if (this._embeddedModels.hasOwnProperty(modeAtPosition.getId())) {
                return this._embeddedModels[modeAtPosition.getId()];
            }
            return null;
        };
        MirrorModel.prototype.getAllEmbedded = function () {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('MirrorModel.getAllEmbedded: Model is disposed');
            }
            return Object.keys(this._embeddedModels).map(function (embeddedModeId) { return _this._embeddedModels[embeddedModeId]; });
        };
        MirrorModel.prototype.dispose = function () {
            var _this = this;
            _super.prototype.dispose.call(this);
            var embeddedModels = Object.keys(this._embeddedModels).map(function (modeId) { return _this._embeddedModels[modeId]; });
            embeddedModels.forEach(function (embeddedModel) { return _this._resourceService.remove(embeddedModel.getAssociatedResource()); });
            lifecycle_1.disposeAll(embeddedModels);
            this._embeddedModels = {};
        };
        MirrorModel.prototype.setMode = function (newModeOrPromise) {
            _super.prototype.setMode.call(this, newModeOrPromise);
            this._updateEmbeddedModels();
        };
        MirrorModel._getModesRanges = function (model) {
            var encounteredModesRanges = {};
            var getOrCreateEmbeddedModeRange = function (modeId, mode) {
                if (!encounteredModesRanges.hasOwnProperty(modeId)) {
                    encounteredModesRanges[modeId] = new EmbeddedModeRange(mode);
                }
                return encounteredModesRanges[modeId];
            };
            var lineCount = model.getLineCount();
            var currentModeId = model.getMode().getId();
            var currentMode = model.getMode();
            var currentStartLineNumber = 1, currentStartColumn = 1;
            for (var lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
                var modeTransitions = model._getLineModeTransitions(lineNumber);
                for (var i = 0; i < modeTransitions.length; i++) {
                    var modeTransition = modeTransitions[i];
                    if (modeTransition.mode.getId() !== currentModeId) {
                        var modeRange = getOrCreateEmbeddedModeRange(currentModeId, currentMode);
                        modeRange.ranges.push({
                            startLineNumber: currentStartLineNumber,
                            startColumn: currentStartColumn,
                            endLineNumber: lineNumber,
                            endColumn: modeTransition.startIndex + 1
                        });
                        currentModeId = modeTransition.mode.getId();
                        currentMode = modeTransition.mode;
                        currentStartLineNumber = lineNumber;
                        currentStartColumn = modeTransition.startIndex + 1;
                    }
                }
            }
            var lastLineNumber = lineCount;
            var lastColumn = model.getLineMaxColumn(lastLineNumber);
            if (currentStartLineNumber !== lastLineNumber || currentStartColumn !== lastColumn) {
                var modeRange = getOrCreateEmbeddedModeRange(currentModeId, currentMode);
                modeRange.ranges.push({
                    startLineNumber: currentStartLineNumber,
                    startColumn: currentStartColumn,
                    endLineNumber: lastLineNumber,
                    endColumn: lastColumn
                });
            }
            return encounteredModesRanges;
        };
        MirrorModel.prototype._updateEmbeddedModels = function () {
            if (!this._resourceService || !this.getMode().tokenizationSupport || !this.getMode().tokenizationSupport.shouldGenerateEmbeddedModels) {
                return false;
            }
            var newModesRanges = MirrorModel._getModesRanges(this);
            // Empty out embedded models that have disappeared
            var oldNestedModesIds = Object.keys(this._embeddedModels);
            for (var i = 0; i < oldNestedModesIds.length; i++) {
                var oldNestedModeId = oldNestedModesIds[i];
                if (!newModesRanges.hasOwnProperty(oldNestedModeId)) {
                    this._embeddedModels[oldNestedModeId].setIncludedRanges([{
                            startLineNumber: 1,
                            startColumn: 1,
                            endLineNumber: 1,
                            endColumn: 1
                        }]);
                }
            }
            var newNestedModesIds = Object.keys(newModesRanges);
            for (var i = 0; i < newNestedModesIds.length; i++) {
                var newNestedModeId = newNestedModesIds[i];
                if (this._embeddedModels.hasOwnProperty(newNestedModeId)) {
                    this._embeddedModels[newNestedModeId].setIncludedRanges(newModesRanges[newNestedModeId].ranges);
                }
                else {
                    // TODO@Alex: implement derived resources (embedded mirror models) better
                    var embeddedModelUrl = this.getAssociatedResource().withFragment(this.getAssociatedResource().fragment + 'URL_MARSHAL_REMOVE' + newNestedModeId);
                    this._embeddedModels[newNestedModeId] = new MirrorModelEmbedded(this, newModesRanges[newNestedModeId].ranges, newModesRanges[newNestedModeId].mode, embeddedModelUrl);
                    this._resourceService.insert(this._embeddedModels[newNestedModeId].getAssociatedResource(), this._embeddedModels[newNestedModeId]);
                }
            }
            return false;
        };
        MirrorModel.prototype.onEvents = function (events) {
            if (this._isDisposed) {
                throw new Error('MirrorModel.onEvents: Model is disposed');
            }
            var changed = false;
            for (var i = 0, len = events.contentChanged.length; i < len; i++) {
                var contentChangedEvent = events.contentChanged[i];
                // Force recreating of line starts
                this._lineStarts = null;
                this._setVersionId(contentChangedEvent.versionId);
                switch (contentChangedEvent.changeType) {
                    case editorCommon.EventType.ModelContentChangedFlush:
                        this._onLinesFlushed(contentChangedEvent);
                        changed = true;
                        break;
                    case editorCommon.EventType.ModelContentChangedLinesDeleted:
                        this._onLinesDeleted(contentChangedEvent);
                        changed = true;
                        break;
                    case editorCommon.EventType.ModelContentChangedLinesInserted:
                        this._onLinesInserted(contentChangedEvent);
                        changed = true;
                        break;
                    case editorCommon.EventType.ModelContentChangedLineChanged:
                        this._onLineChanged(contentChangedEvent);
                        changed = true;
                        break;
                }
            }
            var shouldFlushMarkers = false;
            if (changed) {
                this.emit('changed', {});
                shouldFlushMarkers = this._updateEmbeddedModels();
            }
            return shouldFlushMarkers;
        };
        MirrorModel.prototype._onLinesFlushed = function (e) {
            // Flush my lines
            this._constructLines(e.detail);
            this._resetTokenizationState();
        };
        MirrorModel.prototype._onLineChanged = function (e) {
            this._lines[e.lineNumber - 1].applyEdits({}, [{
                    startColumn: 1,
                    endColumn: Number.MAX_VALUE,
                    text: e.detail,
                    forceMoveMarkers: false
                }]);
            this._invalidateLine(e.lineNumber - 1);
        };
        MirrorModel.prototype._onLinesDeleted = function (e) {
            var fromLineIndex = e.fromLineNumber - 1, toLineIndex = e.toLineNumber - 1;
            // Save first line's state
            var firstLineState = this._lines[fromLineIndex].getState();
            this._lines.splice(fromLineIndex, toLineIndex - fromLineIndex + 1);
            if (fromLineIndex < this._lines.length) {
                // This check is always true in real world, but the tests forced this
                // Restore first line's state
                this._lines[fromLineIndex].setState(firstLineState);
                // Invalidate line
                this._invalidateLine(fromLineIndex);
            }
        };
        MirrorModel.prototype._onLinesInserted = function (e) {
            var lineIndex, i, splitLines = e.detail.split('\n');
            for (lineIndex = e.fromLineNumber - 1, i = 0; lineIndex < e.toLineNumber; lineIndex++, i++) {
                this._lines.splice(lineIndex, 0, new modelLine_1.ModelLine(0, splitLines[i]));
            }
            if (e.fromLineNumber >= 2) {
                // This check is always true in real world, but the tests forced this
                this._invalidateLine(e.fromLineNumber - 2);
            }
        };
        return MirrorModel;
    }(AbstractMirrorModel));
    exports.MirrorModel = MirrorModel;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/model/textModelWithMarkers", ["require", "exports", 'vs/editor/common/core/idGenerator', 'vs/editor/common/core/position', 'vs/editor/common/model/textModelWithTokens'], function (require, exports, idGenerator_1, position_1, textModelWithTokens_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var LineMarker = (function () {
        function LineMarker(id, column, stickToPreviousCharacter) {
            this.id = id;
            this.column = column;
            this.stickToPreviousCharacter = stickToPreviousCharacter;
            this.oldLineNumber = 0;
            this.oldColumn = 0;
            this.line = null;
        }
        LineMarker.prototype.toString = function () {
            return '{\'' + this.id + '\';' + this.column + ',' + this.stickToPreviousCharacter + ',[' + this.oldLineNumber + ',' + this.oldColumn + ']}';
        };
        return LineMarker;
    }());
    exports.LineMarker = LineMarker;
    var _INSTANCE_COUNT = 0;
    var TextModelWithMarkers = (function (_super) {
        __extends(TextModelWithMarkers, _super);
        function TextModelWithMarkers(allowedEventTypes, rawText, modeOrPromise) {
            _super.call(this, allowedEventTypes, rawText, true, modeOrPromise);
            this._markerIdGenerator = new idGenerator_1.IdGenerator((++_INSTANCE_COUNT) + ';');
            this._markerIdToMarker = {};
        }
        TextModelWithMarkers.prototype.dispose = function () {
            this._markerIdToMarker = null;
            _super.prototype.dispose.call(this);
        };
        TextModelWithMarkers.prototype._resetValue = function (e, newValue) {
            _super.prototype._resetValue.call(this, e, newValue);
            // Destroy all my markers
            this._markerIdToMarker = {};
        };
        TextModelWithMarkers.prototype._addMarker = function (lineNumber, column, stickToPreviousCharacter) {
            if (this._isDisposed) {
                throw new Error('TextModelWithMarkers._addMarker: Model is disposed');
            }
            var pos = this.validatePosition(new position_1.Position(lineNumber, column));
            var marker = new LineMarker(this._markerIdGenerator.generate(), pos.column, stickToPreviousCharacter);
            this._markerIdToMarker[marker.id] = marker;
            this._lines[pos.lineNumber - 1].addMarker(marker);
            return marker.id;
        };
        TextModelWithMarkers.prototype._addMarkers = function (newMarkers) {
            var addMarkersPerLine = Object.create(null);
            var result = [];
            for (var i = 0, len = newMarkers.length; i < len; i++) {
                var newMarker = newMarkers[i];
                var marker = new LineMarker(this._markerIdGenerator.generate(), newMarker.column, newMarker.stickToPreviousCharacter);
                this._markerIdToMarker[marker.id] = marker;
                if (!addMarkersPerLine[newMarker.lineNumber]) {
                    addMarkersPerLine[newMarker.lineNumber] = [];
                }
                addMarkersPerLine[newMarker.lineNumber].push(marker);
                result.push(marker.id);
            }
            var lineNumbers = Object.keys(addMarkersPerLine);
            for (var i = 0, len = lineNumbers.length; i < len; i++) {
                var lineNumber = parseInt(lineNumbers[i], 10);
                this._lines[lineNumber - 1].addMarkers(addMarkersPerLine[lineNumbers[i]]);
            }
            return result;
        };
        TextModelWithMarkers.prototype._changeMarker = function (id, lineNumber, column) {
            if (this._isDisposed) {
                throw new Error('TextModelWithMarkers._changeMarker: Model is disposed');
            }
            if (this._markerIdToMarker.hasOwnProperty(id)) {
                var marker = this._markerIdToMarker[id];
                var newPos = this.validatePosition(new position_1.Position(lineNumber, column));
                if (newPos.lineNumber !== marker.line.lineNumber) {
                    // Move marker between lines
                    marker.line.removeMarker(marker);
                    this._lines[newPos.lineNumber - 1].addMarker(marker);
                }
                // Update marker column
                marker.column = newPos.column;
            }
        };
        TextModelWithMarkers.prototype._changeMarkerStickiness = function (id, newStickToPreviousCharacter) {
            if (this._isDisposed) {
                throw new Error('TextModelWithMarkers._changeMarkerStickiness: Model is disposed');
            }
            if (this._markerIdToMarker.hasOwnProperty(id)) {
                var marker = this._markerIdToMarker[id];
                if (marker.stickToPreviousCharacter !== newStickToPreviousCharacter) {
                    marker.stickToPreviousCharacter = newStickToPreviousCharacter;
                }
            }
        };
        TextModelWithMarkers.prototype._getMarker = function (id) {
            if (this._isDisposed) {
                throw new Error('TextModelWithMarkers._getMarker: Model is disposed');
            }
            if (this._markerIdToMarker.hasOwnProperty(id)) {
                var marker = this._markerIdToMarker[id];
                return new position_1.Position(marker.line.lineNumber, marker.column);
            }
            return null;
        };
        TextModelWithMarkers.prototype._getMarkersCount = function () {
            return Object.keys(this._markerIdToMarker).length;
        };
        TextModelWithMarkers.prototype._getLineMarkers = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModelWithMarkers._getLineMarkers: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            return this._lines[lineNumber - 1].getMarkers();
        };
        TextModelWithMarkers.prototype._removeMarker = function (id) {
            if (this._isDisposed) {
                throw new Error('TextModelWithMarkers._removeMarker: Model is disposed');
            }
            if (this._markerIdToMarker.hasOwnProperty(id)) {
                var marker = this._markerIdToMarker[id];
                marker.line.removeMarker(marker);
                delete this._markerIdToMarker[id];
            }
        };
        TextModelWithMarkers.prototype._removeMarkers = function (ids) {
            var removeMarkersPerLine = Object.create(null);
            for (var i = 0, len = ids.length; i < len; i++) {
                var id = ids[i];
                if (!this._markerIdToMarker.hasOwnProperty(id)) {
                    continue;
                }
                var marker = this._markerIdToMarker[id];
                var lineNumber = marker.line.lineNumber;
                if (!removeMarkersPerLine[lineNumber]) {
                    removeMarkersPerLine[lineNumber] = Object.create(null);
                }
                removeMarkersPerLine[lineNumber][id] = true;
                delete this._markerIdToMarker[id];
            }
            var lineNumbers = Object.keys(removeMarkersPerLine);
            for (var i = 0, len = lineNumbers.length; i < len; i++) {
                var lineNumber = parseInt(lineNumbers[i], 10);
                this._lines[lineNumber - 1].removeMarkers(removeMarkersPerLine[lineNumbers[i]]);
            }
        };
        TextModelWithMarkers.prototype._getMarkersInMap = function (markersMap) {
            if (this._isDisposed) {
                throw new Error('TextModelWithMarkers._getMarkersInMap: Model is disposed');
            }
            var result = [], markerId;
            for (markerId in markersMap) {
                if (markersMap.hasOwnProperty(markerId) && this._markerIdToMarker.hasOwnProperty(markerId)) {
                    result.push(this._markerIdToMarker[markerId]);
                }
            }
            return result;
        };
        return TextModelWithMarkers;
    }(textModelWithTokens_1.TextModelWithTokens));
    exports.TextModelWithMarkers = TextModelWithMarkers;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/model/textModelWithTrackedRanges", ["require", "exports", 'vs/editor/common/core/idGenerator', 'vs/editor/common/core/range', 'vs/editor/common/editorCommon', 'vs/editor/common/model/textModelWithMarkers', 'vs/editor/common/model/textModelWithTokens'], function (require, exports, idGenerator_1, range_1, editorCommon, textModelWithMarkers_1, textModelWithTokens_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var TrackedRangeModelRetokenizer = (function (_super) {
        __extends(TrackedRangeModelRetokenizer, _super);
        function TrackedRangeModelRetokenizer(retokenizePromise, lineNumber, model) {
            _super.call(this, retokenizePromise, model);
            this.trackedRangeId = model.addTrackedRange({
                startLineNumber: lineNumber,
                startColumn: 1,
                endLineNumber: lineNumber,
                endColumn: model.getLineMaxColumn(lineNumber)
            }, editorCommon.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges);
        }
        TrackedRangeModelRetokenizer.prototype.getRange = function () {
            return this._model.getTrackedRange(this.trackedRangeId);
        };
        TrackedRangeModelRetokenizer.prototype.dispose = function () {
            var model = this._model;
            // if this .dispose() is being called as part of the model.dispose(), then the tracked ranges might no longer be available (e.g. throw exceptions)
            if (model.isValidTrackedRange(this.trackedRangeId)) {
                model.removeTrackedRange(this.trackedRangeId);
            }
            _super.prototype.dispose.call(this);
        };
        return TrackedRangeModelRetokenizer;
    }(textModelWithTokens_1.FullModelRetokenizer));
    var TrackedRange = (function () {
        function TrackedRange(id, startMarkedId, endMarkerId) {
            this.id = id;
            this.startMarkerId = startMarkedId;
            this.endMarkerId = endMarkerId;
        }
        return TrackedRange;
    }());
    var _INSTANCE_COUNT = 0;
    var TextModelWithTrackedRanges = (function (_super) {
        __extends(TextModelWithTrackedRanges, _super);
        function TextModelWithTrackedRanges(allowedEventTypes, rawText, modeOrPromise) {
            _super.call(this, allowedEventTypes, rawText, modeOrPromise);
            this._rangeIdGenerator = new idGenerator_1.IdGenerator((++_INSTANCE_COUNT) + ';');
            this._ranges = {};
            this._markerIdToRangeId = {};
            this._multiLineTrackedRanges = {};
        }
        TextModelWithTrackedRanges.prototype._createRetokenizer = function (retokenizePromise, lineNumber) {
            return new TrackedRangeModelRetokenizer(retokenizePromise, lineNumber, this);
        };
        TextModelWithTrackedRanges.prototype.dispose = function () {
            this._ranges = null;
            this._markerIdToRangeId = null;
            this._multiLineTrackedRanges = null;
            _super.prototype.dispose.call(this);
        };
        TextModelWithTrackedRanges.prototype._resetValue = function (e, newValue) {
            _super.prototype._resetValue.call(this, e, newValue);
            // Destroy all my tracked ranges
            this._ranges = {};
            this._markerIdToRangeId = {};
            this._multiLineTrackedRanges = {};
        };
        TextModelWithTrackedRanges.prototype._setRangeIsMultiLine = function (rangeId, rangeIsMultiLine) {
            var rangeWasMultiLine = this._multiLineTrackedRanges.hasOwnProperty(rangeId);
            if (!rangeWasMultiLine && rangeIsMultiLine) {
                this._multiLineTrackedRanges[rangeId] = true;
            }
            else if (rangeWasMultiLine && !rangeIsMultiLine) {
                delete this._multiLineTrackedRanges[rangeId];
            }
        };
        TextModelWithTrackedRanges.prototype._shouldStartMarkerSticksToPreviousCharacter = function (stickiness) {
            if (stickiness === editorCommon.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges || stickiness === editorCommon.TrackedRangeStickiness.GrowsOnlyWhenTypingBefore) {
                return true;
            }
            return false;
        };
        TextModelWithTrackedRanges.prototype._shouldEndMarkerSticksToPreviousCharacter = function (stickiness) {
            if (stickiness === editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges || stickiness === editorCommon.TrackedRangeStickiness.GrowsOnlyWhenTypingBefore) {
                return true;
            }
            return false;
        };
        TextModelWithTrackedRanges.prototype._getTrackedRangesCount = function () {
            return Object.keys(this._ranges).length;
        };
        TextModelWithTrackedRanges.prototype.addTrackedRange = function (textRange, stickiness) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTrackedRanges.addTrackedRange: Model is disposed');
            }
            textRange = this.validateRange(textRange);
            var startMarkerSticksToPreviousCharacter = this._shouldStartMarkerSticksToPreviousCharacter(stickiness);
            var endMarkerSticksToPreviousCharacter = this._shouldEndMarkerSticksToPreviousCharacter(stickiness);
            var startMarkerId = this._addMarker(textRange.startLineNumber, textRange.startColumn, startMarkerSticksToPreviousCharacter);
            var endMarkerId = this._addMarker(textRange.endLineNumber, textRange.endColumn, endMarkerSticksToPreviousCharacter);
            var range = new TrackedRange(this._rangeIdGenerator.generate(), startMarkerId, endMarkerId);
            this._ranges[range.id] = range;
            this._markerIdToRangeId[startMarkerId] = range.id;
            this._markerIdToRangeId[endMarkerId] = range.id;
            this._setRangeIsMultiLine(range.id, (textRange.startLineNumber !== textRange.endLineNumber));
            return range.id;
        };
        TextModelWithTrackedRanges.prototype._addTrackedRanges = function (textRanges, stickinessArr) {
            var addMarkers = [];
            for (var i = 0, len = textRanges.length; i < len; i++) {
                var textRange = textRanges[i];
                var stickiness = stickinessArr[i];
                addMarkers.push({
                    lineNumber: textRange.startLineNumber,
                    column: textRange.startColumn,
                    stickToPreviousCharacter: this._shouldStartMarkerSticksToPreviousCharacter(stickiness)
                });
                addMarkers.push({
                    lineNumber: textRange.endLineNumber,
                    column: textRange.endColumn,
                    stickToPreviousCharacter: this._shouldEndMarkerSticksToPreviousCharacter(stickiness)
                });
            }
            var markerIds = this._addMarkers(addMarkers);
            var result = [];
            for (var i = 0, len = textRanges.length; i < len; i++) {
                var textRange = textRanges[i];
                var startMarkerId = markerIds[2 * i];
                var endMarkerId = markerIds[2 * i + 1];
                var range = new TrackedRange(this._rangeIdGenerator.generate(), startMarkerId, endMarkerId);
                this._ranges[range.id] = range;
                this._markerIdToRangeId[startMarkerId] = range.id;
                this._markerIdToRangeId[endMarkerId] = range.id;
                this._setRangeIsMultiLine(range.id, (textRange.startLineNumber !== textRange.endLineNumber));
                result.push(range.id);
            }
            return result;
        };
        TextModelWithTrackedRanges.prototype.changeTrackedRange = function (rangeId, newTextRange) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTrackedRanges.changeTrackedRange: Model is disposed');
            }
            if (this._ranges.hasOwnProperty(rangeId)) {
                newTextRange = this.validateRange(newTextRange);
                var range = this._ranges[rangeId];
                this._changeMarker(range.startMarkerId, newTextRange.startLineNumber, newTextRange.startColumn);
                this._changeMarker(range.endMarkerId, newTextRange.endLineNumber, newTextRange.endColumn);
                this._setRangeIsMultiLine(range.id, (newTextRange.startLineNumber !== newTextRange.endLineNumber));
            }
        };
        TextModelWithTrackedRanges.prototype.changeTrackedRangeStickiness = function (rangeId, newStickiness) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTrackedRanges.changeTrackedRangeStickiness: Model is disposed');
            }
            if (this._ranges.hasOwnProperty(rangeId)) {
                var range = this._ranges[rangeId];
                this._changeMarkerStickiness(range.startMarkerId, this._shouldStartMarkerSticksToPreviousCharacter(newStickiness));
                this._changeMarkerStickiness(range.endMarkerId, this._shouldEndMarkerSticksToPreviousCharacter(newStickiness));
            }
        };
        TextModelWithTrackedRanges.prototype.isValidTrackedRange = function (rangeId) {
            if (this._isDisposed || !this._ranges) {
                return false;
            }
            return this._ranges.hasOwnProperty(rangeId);
        };
        TextModelWithTrackedRanges.prototype.removeTrackedRange = function (rangeId) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTrackedRanges.removeTrackedRange: Model is disposed');
            }
            if (this._ranges.hasOwnProperty(rangeId)) {
                var range = this._ranges[rangeId];
                this._removeMarker(range.startMarkerId);
                this._removeMarker(range.endMarkerId);
                this._setRangeIsMultiLine(range.id, false);
                delete this._ranges[range.id];
                delete this._markerIdToRangeId[range.startMarkerId];
                delete this._markerIdToRangeId[range.endMarkerId];
            }
        };
        TextModelWithTrackedRanges.prototype.removeTrackedRanges = function (ids) {
            var removeMarkers = [];
            for (var i = 0, len = ids.length; i < len; i++) {
                var rangeId = ids[i];
                if (!this._ranges.hasOwnProperty(rangeId)) {
                    continue;
                }
                var range = this._ranges[rangeId];
                removeMarkers.push(range.startMarkerId);
                removeMarkers.push(range.endMarkerId);
                this._setRangeIsMultiLine(range.id, false);
                delete this._ranges[range.id];
                delete this._markerIdToRangeId[range.startMarkerId];
                delete this._markerIdToRangeId[range.endMarkerId];
            }
            if (removeMarkers.length > 0) {
                this._removeMarkers(removeMarkers);
            }
        };
        TextModelWithTrackedRanges.prototype._newEditorRange = function (startPosition, endPosition) {
            if (endPosition.isBefore(startPosition)) {
                // This tracked range has turned in on itself (end marker before start marker)
                // This can happen in extreme editing conditions where lots of text is removed and lots is added
                // Treat it as a collapsed range
                return new range_1.Range(startPosition.lineNumber, startPosition.column, startPosition.lineNumber, startPosition.column);
            }
            return new range_1.Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
        };
        TextModelWithTrackedRanges.prototype.getTrackedRange = function (rangeId) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTrackedRanges.getTrackedRange: Model is disposed');
            }
            var range = this._ranges[rangeId];
            var startMarker = this._getMarker(range.startMarkerId);
            var endMarker = this._getMarker(range.endMarkerId);
            return this._newEditorRange(startMarker, endMarker);
        };
        /**
         * Fetch only multi-line ranges that intersect with the given line number range
         */
        TextModelWithTrackedRanges.prototype._getMultiLineTrackedRanges = function (filterStartLineNumber, filterEndLineNumber) {
            var result = [], rangeId, range, startMarker, endMarker;
            for (rangeId in this._multiLineTrackedRanges) {
                if (this._multiLineTrackedRanges.hasOwnProperty(rangeId)) {
                    range = this._ranges[rangeId];
                    startMarker = this._getMarker(range.startMarkerId);
                    if (startMarker.lineNumber > filterEndLineNumber) {
                        continue;
                    }
                    endMarker = this._getMarker(range.endMarkerId);
                    if (endMarker.lineNumber < filterStartLineNumber) {
                        continue;
                    }
                    result.push({
                        id: range.id,
                        range: this._newEditorRange(startMarker, endMarker)
                    });
                }
            }
            return result;
        };
        TextModelWithTrackedRanges.prototype.getLinesTrackedRanges = function (startLineNumber, endLineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTrackedRanges.getLinesTrackedRanges: Model is disposed');
            }
            var result = this._getMultiLineTrackedRanges(startLineNumber, endLineNumber), resultMap = {}, lineMarkers, lineMarker, rangeId, i, len, lineNumber, startMarker, endMarker;
            for (i = 0, len = result.length; i < len; i++) {
                resultMap[result[i].id] = true;
            }
            for (lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
                lineMarkers = this._getLineMarkers(lineNumber);
                for (i = 0, len = lineMarkers.length; i < len; i++) {
                    lineMarker = lineMarkers[i];
                    if (this._markerIdToRangeId.hasOwnProperty(lineMarker.id)) {
                        rangeId = this._markerIdToRangeId[lineMarker.id];
                        if (!resultMap.hasOwnProperty(rangeId)) {
                            startMarker = this._getMarker(this._ranges[rangeId].startMarkerId);
                            endMarker = this._getMarker(this._ranges[rangeId].endMarkerId);
                            result.push({
                                id: rangeId,
                                range: this._newEditorRange(startMarker, endMarker)
                            });
                            resultMap[rangeId] = true;
                        }
                    }
                }
            }
            return result;
        };
        TextModelWithTrackedRanges.prototype._onChangedMarkers = function (changedMarkers) {
            var changedRanges = {}, changedRange, range, rangeId, marker, i, len;
            for (i = 0, len = changedMarkers.length; i < len; i++) {
                marker = changedMarkers[i];
                if (this._markerIdToRangeId.hasOwnProperty(marker.id)) {
                    rangeId = this._markerIdToRangeId[marker.id];
                    range = this._ranges[rangeId];
                    if (changedRanges.hasOwnProperty(range.id)) {
                        changedRange = changedRanges[range.id];
                    }
                    else {
                        changedRange = {
                            startLineNumber: 0,
                            startColumn: 0,
                            endLineNumber: 0,
                            endColumn: 0
                        };
                        changedRanges[range.id] = changedRange;
                    }
                    if (marker.id === range.startMarkerId) {
                        changedRange.startLineNumber = marker.oldLineNumber;
                        changedRange.startColumn = marker.oldColumn;
                    }
                    else {
                        changedRange.endLineNumber = marker.oldLineNumber;
                        changedRange.endColumn = marker.oldColumn;
                    }
                    this._setRangeIsMultiLine(range.id, (this._getMarker(range.startMarkerId).lineNumber !== this._getMarker(range.endMarkerId).lineNumber));
                }
            }
            return changedRanges;
        };
        return TextModelWithTrackedRanges;
    }(textModelWithMarkers_1.TextModelWithMarkers));
    exports.TextModelWithTrackedRanges = TextModelWithTrackedRanges;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/model/textModelWithDecorations", ["require", "exports", 'vs/base/common/errors', 'vs/base/common/htmlContent', 'vs/base/common/strings', 'vs/editor/common/core/idGenerator', 'vs/editor/common/core/range', 'vs/editor/common/editorCommon', 'vs/editor/common/model/textModelWithTrackedRanges'], function (require, exports, errors_1, htmlContent_1, strings, idGenerator_1, range_1, editorCommon, textModelWithTrackedRanges_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var DeferredEventsBuilder = (function () {
        function DeferredEventsBuilder() {
            this.changedMarkers = {};
            this.oldDecorationRange = {};
            this.oldDecorationOptions = {};
            this.newOrChangedDecorations = {};
            this.removedDecorations = {};
        }
        // --- Build decoration events
        DeferredEventsBuilder.prototype.addNewDecoration = function (id) {
            this.newOrChangedDecorations[id] = true;
        };
        DeferredEventsBuilder.prototype.addRemovedDecoration = function (id, ownerId, range, options) {
            if (this.newOrChangedDecorations.hasOwnProperty(id)) {
                delete this.newOrChangedDecorations[id];
            }
            if (!this.oldDecorationRange.hasOwnProperty(id)) {
                this.oldDecorationRange[id] = range;
            }
            if (!this.oldDecorationOptions.hasOwnProperty(id)) {
                this.oldDecorationOptions[id] = options;
            }
            this.removedDecorations[id] = true;
        };
        DeferredEventsBuilder.prototype.addMovedDecoration = function (id, oldRange) {
            if (!this.oldDecorationRange.hasOwnProperty(id)) {
                this.oldDecorationRange[id] = oldRange;
            }
            this.newOrChangedDecorations[id] = true;
        };
        DeferredEventsBuilder.prototype.addUpdatedDecoration = function (id, oldOptions) {
            if (!this.oldDecorationOptions.hasOwnProperty(id)) {
                this.oldDecorationOptions[id] = oldOptions;
            }
            this.newOrChangedDecorations[id] = true;
        };
        return DeferredEventsBuilder;
    }());
    exports.DeferredEventsBuilder = DeferredEventsBuilder;
    var _INSTANCE_COUNT = 0;
    var TextModelWithDecorations = (function (_super) {
        __extends(TextModelWithDecorations, _super);
        function TextModelWithDecorations(allowedEventTypes, rawText, modeOrPromise) {
            allowedEventTypes.push(editorCommon.EventType.ModelDecorationsChanged);
            _super.call(this, allowedEventTypes, rawText, modeOrPromise);
            // Initialize decorations
            this._decorationIdGenerator = new idGenerator_1.IdGenerator((++_INSTANCE_COUNT) + ';');
            this.decorations = {};
            this.rangeIdToDecorationId = {};
            this._currentDeferredEvents = null;
        }
        TextModelWithDecorations.prototype.dispose = function () {
            this.decorations = null;
            this.rangeIdToDecorationId = null;
            _super.prototype.dispose.call(this);
        };
        TextModelWithDecorations.prototype._resetValue = function (e, newValue) {
            _super.prototype._resetValue.call(this, e, newValue);
            // Destroy all my decorations
            this.decorations = {};
            this.rangeIdToDecorationId = {};
        };
        TextModelWithDecorations.prototype.changeDecorations = function (callback, ownerId) {
            var _this = this;
            if (ownerId === void 0) { ownerId = 0; }
            if (this._isDisposed) {
                throw new Error('TextModelWithDecorations.changeDecorations: Model is disposed');
            }
            return this._withDeferredEvents(function (deferredEventsBuilder) {
                var changeAccessor = {
                    addDecoration: function (range, options) {
                        return _this._addDecorationImpl(deferredEventsBuilder, ownerId, _this.validateRange(range), _normalizeOptions(options));
                    },
                    changeDecoration: function (id, newRange) {
                        _this._changeDecorationImpl(deferredEventsBuilder, id, _this.validateRange(newRange));
                    },
                    changeDecorationOptions: function (id, options) {
                        _this._changeDecorationOptionsImpl(deferredEventsBuilder, id, _normalizeOptions(options));
                    },
                    removeDecoration: function (id) {
                        _this._removeDecorationImpl(deferredEventsBuilder, id);
                    },
                    deltaDecorations: function (oldDecorations, newDecorations) {
                        return _this._deltaDecorationsImpl(deferredEventsBuilder, ownerId, oldDecorations, _this._normalizeDeltaDecorations(newDecorations));
                    }
                };
                var result = null;
                try {
                    result = callback(changeAccessor);
                }
                catch (e) {
                    errors_1.onUnexpectedError(e);
                }
                // Invalidate change accessor
                changeAccessor.addDecoration = null;
                changeAccessor.changeDecoration = null;
                changeAccessor.removeDecoration = null;
                changeAccessor.deltaDecorations = null;
                return result;
            });
        };
        TextModelWithDecorations.prototype.deltaDecorations = function (oldDecorations, newDecorations, ownerId) {
            if (ownerId === void 0) { ownerId = 0; }
            if (this._isDisposed) {
                throw new Error('TextModelWithDecorations.deltaDecorations: Model is disposed');
            }
            if (!oldDecorations) {
                oldDecorations = [];
            }
            return this.changeDecorations(function (changeAccessor) {
                return changeAccessor.deltaDecorations(oldDecorations, newDecorations);
            }, ownerId);
        };
        TextModelWithDecorations.prototype.removeAllDecorationsWithOwnerId = function (ownerId) {
            if (this._isDisposed) {
                throw new Error('TextModelWithDecorations.removeAllDecorationsWithOwnerId: Model is disposed');
            }
            var decorationId;
            var decoration;
            var toRemove = [];
            for (decorationId in this.decorations) {
                if (this.decorations.hasOwnProperty(decorationId)) {
                    decoration = this.decorations[decorationId];
                    if (decoration.ownerId === ownerId) {
                        toRemove.push(decoration.id);
                    }
                }
            }
            this._removeDecorationsImpl(null, toRemove);
        };
        TextModelWithDecorations.prototype.getDecorationOptions = function (decorationId) {
            if (this._isDisposed) {
                throw new Error('TextModelWithDecorations.getDecorationOptions: Model is disposed');
            }
            if (this.decorations.hasOwnProperty(decorationId)) {
                return this.decorations[decorationId].options;
            }
            return null;
        };
        TextModelWithDecorations.prototype.getDecorationRange = function (decorationId) {
            if (this._isDisposed) {
                throw new Error('TextModelWithDecorations.getDecorationRange: Model is disposed');
            }
            if (this.decorations.hasOwnProperty(decorationId)) {
                var decoration = this.decorations[decorationId];
                return this.getTrackedRange(decoration.rangeId);
            }
            return null;
        };
        TextModelWithDecorations.prototype.getLineDecorations = function (lineNumber, ownerId, filterOutValidation) {
            if (ownerId === void 0) { ownerId = 0; }
            if (filterOutValidation === void 0) { filterOutValidation = false; }
            if (this._isDisposed) {
                throw new Error('TextModelWithDecorations.getLineDecorations: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                return [];
            }
            return this.getLinesDecorations(lineNumber, lineNumber, ownerId, filterOutValidation);
        };
        TextModelWithDecorations.prototype._getDecorationsInRange = function (startLineNumber, startColumn, endLineNumber, endColumn, ownerId, filterOutValidation) {
            var result = [], decoration, lineRanges = this.getLinesTrackedRanges(startLineNumber, endLineNumber), i, lineRange, len;
            for (i = 0, len = lineRanges.length; i < len; i++) {
                lineRange = lineRanges[i];
                // Look at line range only if there is a corresponding decoration for it
                if (this.rangeIdToDecorationId.hasOwnProperty(lineRange.id)) {
                    decoration = this.decorations[this.rangeIdToDecorationId[lineRange.id]];
                    if (ownerId && decoration.ownerId && decoration.ownerId !== ownerId) {
                        continue;
                    }
                    if (filterOutValidation) {
                        if (decoration.options.className === editorCommon.ClassName.EditorErrorDecoration || decoration.options.className === editorCommon.ClassName.EditorWarningDecoration) {
                            continue;
                        }
                    }
                    if (lineRange.range.startLineNumber === startLineNumber && lineRange.range.endColumn < startColumn) {
                        continue;
                    }
                    if (lineRange.range.endLineNumber === endLineNumber && lineRange.range.startColumn > endColumn) {
                        continue;
                    }
                    result.push({
                        id: decoration.id,
                        ownerId: decoration.ownerId,
                        range: lineRange.range,
                        options: decoration.options
                    });
                }
            }
            return result;
        };
        TextModelWithDecorations.prototype.getLinesDecorations = function (startLineNumber, endLineNumber, ownerId, filterOutValidation) {
            if (ownerId === void 0) { ownerId = 0; }
            if (filterOutValidation === void 0) { filterOutValidation = false; }
            if (this._isDisposed) {
                throw new Error('TextModelWithDecorations.getLinesDecorations: Model is disposed');
            }
            var lineCount = this.getLineCount();
            startLineNumber = Math.min(lineCount, Math.max(1, startLineNumber));
            endLineNumber = Math.min(lineCount, Math.max(1, endLineNumber));
            return this._getDecorationsInRange(startLineNumber, 1, endLineNumber, Number.MAX_VALUE, ownerId, filterOutValidation);
        };
        TextModelWithDecorations.prototype.getDecorationsInRange = function (range, ownerId, filterOutValidation) {
            if (this._isDisposed) {
                throw new Error('TextModelWithDecorations.getDecorationsInRange: Model is disposed');
            }
            var validatedRange = this.validateRange(range);
            return this._getDecorationsInRange(validatedRange.startLineNumber, validatedRange.startColumn, validatedRange.endLineNumber, validatedRange.endColumn, ownerId, filterOutValidation);
        };
        TextModelWithDecorations.prototype.getAllDecorations = function (ownerId, filterOutValidation) {
            if (ownerId === void 0) { ownerId = 0; }
            if (filterOutValidation === void 0) { filterOutValidation = false; }
            if (this._isDisposed) {
                throw new Error('TextModelWithDecorations.getAllDecorations: Model is disposed');
            }
            var result = [];
            var decorationId;
            var decoration;
            for (decorationId in this.decorations) {
                if (this.decorations.hasOwnProperty(decorationId)) {
                    decoration = this.decorations[decorationId];
                    if (ownerId && decoration.ownerId && decoration.ownerId !== ownerId) {
                        continue;
                    }
                    if (filterOutValidation) {
                        if (decoration.options.className === editorCommon.ClassName.EditorErrorDecoration || decoration.options.className === editorCommon.ClassName.EditorWarningDecoration) {
                            continue;
                        }
                    }
                    result.push({
                        id: decoration.id,
                        ownerId: decoration.ownerId,
                        range: this.getTrackedRange(decoration.rangeId),
                        options: decoration.options
                    });
                }
            }
            return result;
        };
        TextModelWithDecorations.prototype._withDeferredEvents = function (callback) {
            var _this = this;
            return this.deferredEmit(function () {
                var createDeferredEvents = _this._currentDeferredEvents ? false : true;
                if (createDeferredEvents) {
                    _this._currentDeferredEvents = new DeferredEventsBuilder();
                }
                try {
                    var result = callback(_this._currentDeferredEvents);
                    if (createDeferredEvents) {
                        _this._handleCollectedEvents(_this._currentDeferredEvents);
                    }
                }
                finally {
                    if (createDeferredEvents) {
                        _this._currentDeferredEvents = null;
                    }
                }
                return result;
            });
        };
        TextModelWithDecorations.prototype._handleCollectedEvents = function (b) {
            // Normalize changed markers into an array
            var changedMarkers = this._getMarkersInMap(b.changedMarkers);
            // Collect changed tracked ranges
            var changedRanges = this._onChangedMarkers(changedMarkers);
            // Collect decoration change events with the deferred event builder
            this._onChangedRanges(b, changedRanges);
            // Emit a single decorations changed event
            this._handleCollectedDecorationsEvents(b);
            // Reset markers for next round of events
            for (var i = 0, len = changedMarkers.length; i < len; i++) {
                changedMarkers[i].oldLineNumber = 0;
                changedMarkers[i].oldColumn = 0;
            }
        };
        TextModelWithDecorations.prototype._onChangedRanges = function (eventBuilder, changedRanges) {
            var rangeId;
            var decorationId;
            for (rangeId in changedRanges) {
                if (changedRanges.hasOwnProperty(rangeId) && this.rangeIdToDecorationId.hasOwnProperty(rangeId)) {
                    decorationId = this.rangeIdToDecorationId[rangeId];
                    eventBuilder.addMovedDecoration(decorationId, changedRanges[rangeId]);
                }
            }
        };
        TextModelWithDecorations.prototype._handleCollectedDecorationsEvents = function (b) {
            var decorationId, addedOrChangedDecorations = [], removedDecorations = [], decorationIds = [], decorationData, oldRange;
            for (decorationId in b.newOrChangedDecorations) {
                if (b.newOrChangedDecorations.hasOwnProperty(decorationId)) {
                    decorationIds.push(decorationId);
                    decorationData = this._getDecorationData(decorationId);
                    decorationData.isForValidation = (decorationData.options.className === editorCommon.ClassName.EditorErrorDecoration || decorationData.options.className === editorCommon.ClassName.EditorWarningDecoration);
                    addedOrChangedDecorations.push(decorationData);
                    if (b.oldDecorationRange.hasOwnProperty(decorationId)) {
                        oldRange = b.oldDecorationRange[decorationId];
                        oldRange.startLineNumber = oldRange.startLineNumber || decorationData.range.startLineNumber;
                        oldRange.startColumn = oldRange.startColumn || decorationData.range.startColumn;
                        oldRange.endLineNumber = oldRange.endLineNumber || decorationData.range.endLineNumber;
                        oldRange.endColumn = oldRange.endColumn || decorationData.range.endColumn;
                    }
                }
            }
            for (decorationId in b.removedDecorations) {
                if (b.removedDecorations.hasOwnProperty(decorationId)) {
                    decorationIds.push(decorationId);
                    removedDecorations.push(decorationId);
                }
            }
            if (decorationIds.length > 0) {
                var e = {
                    ids: decorationIds,
                    addedOrChangedDecorations: addedOrChangedDecorations,
                    removedDecorations: removedDecorations,
                    oldOptions: b.oldDecorationOptions,
                    oldRanges: b.oldDecorationRange
                };
                this.emitModelDecorationsChangedEvent(e);
            }
        };
        TextModelWithDecorations.prototype._getDecorationData = function (decorationId) {
            var decoration = this.decorations[decorationId];
            return {
                id: decoration.id,
                ownerId: decoration.ownerId,
                range: this.getTrackedRange(decoration.rangeId),
                isForValidation: false,
                options: decoration.options
            };
        };
        TextModelWithDecorations.prototype.emitModelDecorationsChangedEvent = function (e) {
            if (!this._isDisposing) {
                this.emit(editorCommon.EventType.ModelDecorationsChanged, e);
            }
        };
        TextModelWithDecorations.prototype._normalizeDeltaDecorations = function (deltaDecorations) {
            var result = [];
            for (var i = 0, len = deltaDecorations.length; i < len; i++) {
                var deltaDecoration = deltaDecorations[i];
                result.push(new ModelDeltaDecoration(i, this.validateRange(deltaDecoration.range), _normalizeOptions(deltaDecoration.options)));
            }
            return result;
        };
        TextModelWithDecorations.prototype._addDecorationImpl = function (eventBuilder, ownerId, range, options) {
            var rangeId = this.addTrackedRange(range, options.stickiness);
            var decoration = new ModelInternalDecoration(this._decorationIdGenerator.generate(), ownerId, rangeId, options);
            this.decorations[decoration.id] = decoration;
            this.rangeIdToDecorationId[rangeId] = decoration.id;
            eventBuilder.addNewDecoration(decoration.id);
            return decoration.id;
        };
        TextModelWithDecorations.prototype._addDecorationsImpl = function (eventBuilder, ownerId, newDecorations) {
            var rangeIds = this._addTrackedRanges(newDecorations.map(function (d) { return d.range; }), newDecorations.map(function (d) { return d.options.stickiness; }));
            var result = [];
            for (var i = 0, len = newDecorations.length; i < len; i++) {
                var rangeId = rangeIds[i];
                var decoration = new ModelInternalDecoration(this._decorationIdGenerator.generate(), ownerId, rangeId, newDecorations[i].options);
                this.decorations[decoration.id] = decoration;
                this.rangeIdToDecorationId[rangeId] = decoration.id;
                eventBuilder.addNewDecoration(decoration.id);
                result.push(decoration.id);
            }
            return result;
        };
        TextModelWithDecorations.prototype._changeDecorationImpl = function (eventBuilder, id, newRange) {
            if (this.decorations.hasOwnProperty(id)) {
                var decoration = this.decorations[id];
                var oldRange = this.getTrackedRange(decoration.rangeId);
                this.changeTrackedRange(decoration.rangeId, newRange);
                eventBuilder.addMovedDecoration(id, oldRange);
            }
        };
        TextModelWithDecorations.prototype._changeDecorationOptionsImpl = function (eventBuilder, id, options) {
            if (this.decorations.hasOwnProperty(id)) {
                var decoration = this.decorations[id];
                var oldOptions = decoration.options;
                if (oldOptions.stickiness !== options.stickiness) {
                    this.changeTrackedRangeStickiness(decoration.rangeId, options.stickiness);
                }
                decoration.options = options;
                eventBuilder.addUpdatedDecoration(id, oldOptions);
            }
        };
        TextModelWithDecorations.prototype._removeDecorationImpl = function (eventBuilder, id) {
            if (this.decorations.hasOwnProperty(id)) {
                var decoration = this.decorations[id];
                var oldRange = null;
                if (eventBuilder) {
                    oldRange = this.getTrackedRange(decoration.rangeId);
                }
                this.removeTrackedRange(decoration.rangeId);
                delete this.rangeIdToDecorationId[decoration.rangeId];
                delete this.decorations[id];
                if (eventBuilder) {
                    eventBuilder.addRemovedDecoration(id, decoration.ownerId, oldRange, decoration.options);
                }
            }
        };
        TextModelWithDecorations.prototype._removeDecorationsImpl = function (eventBuilder, ids) {
            var removeTrackedRanges = [];
            for (var i = 0, len = ids.length; i < len; i++) {
                var id = ids[i];
                if (!this.decorations.hasOwnProperty(id)) {
                    continue;
                }
                var decoration = this.decorations[id];
                if (eventBuilder) {
                    var oldRange = this.getTrackedRange(decoration.rangeId);
                    eventBuilder.addRemovedDecoration(id, decoration.ownerId, oldRange, decoration.options);
                }
                removeTrackedRanges.push(decoration.rangeId);
                delete this.rangeIdToDecorationId[decoration.rangeId];
                delete this.decorations[id];
            }
            if (removeTrackedRanges.length > 0) {
                this.removeTrackedRanges(removeTrackedRanges);
            }
        };
        TextModelWithDecorations.prototype._resolveOldDecorations = function (oldDecorations) {
            var result = [];
            for (var i = 0, len = oldDecorations.length; i < len; i++) {
                var id = oldDecorations[i];
                if (!this.decorations.hasOwnProperty(id)) {
                    continue;
                }
                var decoration = this.decorations[id];
                result.push({
                    id: id,
                    range: this.getTrackedRange(decoration.rangeId),
                    options: decoration.options
                });
            }
            return result;
        };
        TextModelWithDecorations.prototype._deltaDecorationsImpl = function (eventBuilder, ownerId, oldDecorationsIds, newDecorations) {
            if (oldDecorationsIds.length === 0) {
                // Nothing to remove
                return this._addDecorationsImpl(eventBuilder, ownerId, newDecorations);
            }
            if (newDecorations.length === 0) {
                // Nothing to add
                this._removeDecorationsImpl(eventBuilder, oldDecorationsIds);
                return [];
            }
            var oldDecorations = this._resolveOldDecorations(oldDecorationsIds);
            oldDecorations.sort(function (a, b) { return range_1.Range.compareRangesUsingStarts(a.range, b.range); });
            newDecorations.sort(function (a, b) { return range_1.Range.compareRangesUsingStarts(a.range, b.range); });
            var result = [], oldDecorationsIndex = 0, oldDecorationsLength = oldDecorations.length, newDecorationsIndex = 0, newDecorationsLength = newDecorations.length, decorationsToAdd = [], decorationsToRemove = [];
            while (oldDecorationsIndex < oldDecorationsLength && newDecorationsIndex < newDecorationsLength) {
                var oldDecoration = oldDecorations[oldDecorationsIndex];
                var newDecoration = newDecorations[newDecorationsIndex];
                var comparison = range_1.Range.compareRangesUsingStarts(oldDecoration.range, newDecoration.range);
                if (comparison < 0) {
                    // `oldDecoration` is before `newDecoration` => remove `oldDecoration`
                    decorationsToRemove.push(oldDecoration.id);
                    oldDecorationsIndex++;
                    continue;
                }
                if (comparison > 0) {
                    // `newDecoration` is before `oldDecoration` => add `newDecoration`
                    decorationsToAdd.push(newDecoration);
                    newDecorationsIndex++;
                    continue;
                }
                // The ranges of `oldDecoration` and `newDecoration` are equal
                if (!oldDecoration.options.equals(newDecoration.options)) {
                    // The options do not match => remove `oldDecoration`
                    decorationsToRemove.push(oldDecoration.id);
                    oldDecorationsIndex++;
                    continue;
                }
                // Bingo! We can reuse `oldDecoration` for `newDecoration`
                result[newDecoration.index] = oldDecoration.id;
                oldDecorationsIndex++;
                newDecorationsIndex++;
            }
            while (oldDecorationsIndex < oldDecorationsLength) {
                // No more new decorations => remove decoration at `oldDecorationsIndex`
                decorationsToRemove.push(oldDecorations[oldDecorationsIndex].id);
                oldDecorationsIndex++;
            }
            while (newDecorationsIndex < newDecorationsLength) {
                // No more old decorations => add decoration at `newDecorationsIndex`
                decorationsToAdd.push(newDecorations[newDecorationsIndex]);
                newDecorationsIndex++;
            }
            // Remove `decorationsToRemove`
            if (decorationsToRemove.length > 0) {
                this._removeDecorationsImpl(eventBuilder, decorationsToRemove);
            }
            // Add `decorationsToAdd`
            if (decorationsToAdd.length > 0) {
                var newIds = this._addDecorationsImpl(eventBuilder, ownerId, decorationsToAdd);
                for (var i = 0, len = decorationsToAdd.length; i < len; i++) {
                    result[decorationsToAdd[i].index] = newIds[i];
                }
            }
            return result;
        };
        return TextModelWithDecorations;
    }(textModelWithTrackedRanges_1.TextModelWithTrackedRanges));
    exports.TextModelWithDecorations = TextModelWithDecorations;
    function cleanClassName(className) {
        return className.replace(/[^a-z0-9\-]/gi, ' ');
    }
    var ModelInternalDecoration = (function () {
        function ModelInternalDecoration(id, ownerId, rangeId, options) {
            this.id = id;
            this.ownerId = ownerId;
            this.rangeId = rangeId;
            this.options = options;
        }
        return ModelInternalDecoration;
    }());
    var ModelDecorationOptions = (function () {
        function ModelDecorationOptions(options) {
            this.stickiness = options.stickiness || editorCommon.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges;
            this.className = cleanClassName(options.className || strings.empty);
            this.hoverMessage = options.hoverMessage || strings.empty;
            this.htmlMessage = options.htmlMessage || [];
            this.isWholeLine = options.isWholeLine || false;
            this.overviewRuler = _normalizeOverviewRulerOptions(options.overviewRuler, options.showInOverviewRuler);
            this.glyphMarginClassName = cleanClassName(options.glyphMarginClassName || strings.empty);
            this.linesDecorationsClassName = cleanClassName(options.linesDecorationsClassName || strings.empty);
            this.inlineClassName = cleanClassName(options.inlineClassName || strings.empty);
        }
        ModelDecorationOptions._overviewRulerEquals = function (a, b) {
            return (a.color === b.color
                && a.position === b.position
                && a.darkColor === b.darkColor);
        };
        ModelDecorationOptions.prototype.equals = function (other) {
            return (this.stickiness === other.stickiness
                && this.className === other.className
                && this.hoverMessage === other.hoverMessage
                && this.isWholeLine === other.isWholeLine
                && this.showInOverviewRuler === other.showInOverviewRuler
                && this.glyphMarginClassName === other.glyphMarginClassName
                && this.linesDecorationsClassName === other.linesDecorationsClassName
                && this.inlineClassName === other.inlineClassName
                && htmlContent_1.htmlContentElementArrEquals(this.htmlMessage, other.htmlMessage)
                && ModelDecorationOptions._overviewRulerEquals(this.overviewRuler, other.overviewRuler));
        };
        return ModelDecorationOptions;
    }());
    var ModelDeltaDecoration = (function () {
        function ModelDeltaDecoration(index, range, options) {
            this.index = index;
            this.range = range;
            this.options = options;
        }
        return ModelDeltaDecoration;
    }());
    function _normalizeOptions(options) {
        return new ModelDecorationOptions(options);
    }
    var ModelDecorationOverviewRulerOptions = (function () {
        function ModelDecorationOverviewRulerOptions(options, legacyShowInOverviewRuler) {
            this.color = strings.empty;
            this.darkColor = strings.empty;
            this.position = editorCommon.OverviewRulerLane.Center;
            if (legacyShowInOverviewRuler) {
                this.color = legacyShowInOverviewRuler;
            }
            if (options && options.color) {
                this.color = options.color;
            }
            if (options && options.darkColor) {
                this.darkColor = options.darkColor;
            }
            if (options && options.hasOwnProperty('position')) {
                this.position = options.position;
            }
        }
        return ModelDecorationOverviewRulerOptions;
    }());
    function _normalizeOverviewRulerOptions(options, legacyShowInOverviewRuler) {
        if (legacyShowInOverviewRuler === void 0) { legacyShowInOverviewRuler = null; }
        return new ModelDecorationOverviewRulerOptions(options, legacyShowInOverviewRuler);
    }
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/model/editableTextModel", ["require", "exports", 'vs/editor/common/core/range', 'vs/editor/common/editorCommon', 'vs/editor/common/model/editStack', 'vs/editor/common/model/modelLine', 'vs/editor/common/model/textModelWithDecorations'], function (require, exports, range_1, editorCommon, editStack_1, modelLine_1, textModelWithDecorations_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var EditableTextModel = (function (_super) {
        __extends(EditableTextModel, _super);
        function EditableTextModel(allowedEventTypes, rawText, modeOrPromise) {
            allowedEventTypes.push(editorCommon.EventType.ModelContentChanged);
            allowedEventTypes.push(editorCommon.EventType.ModelContentChanged2);
            _super.call(this, allowedEventTypes, rawText, modeOrPromise);
            this._commandManager = new editStack_1.EditStack(this);
            this._isUndoing = false;
            this._isRedoing = false;
            this._hasEditableRange = false;
            this._editableRangeId = null;
        }
        EditableTextModel.prototype.dispose = function () {
            this._commandManager = null;
            _super.prototype.dispose.call(this);
        };
        EditableTextModel.prototype._resetValue = function (e, newValue) {
            _super.prototype._resetValue.call(this, e, newValue);
            // Destroy my edit history and settings
            this._commandManager = new editStack_1.EditStack(this);
            this._hasEditableRange = false;
            this._editableRangeId = null;
        };
        EditableTextModel.prototype.pushStackElement = function () {
            if (this._isDisposed) {
                throw new Error('EditableTextModel.pushStackElement: Model is disposed');
            }
            this._commandManager.pushStackElement();
        };
        EditableTextModel.prototype.pushEditOperations = function (beforeCursorState, editOperations, cursorStateComputer) {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('EditableTextModel.pushEditOperations: Model is disposed');
            }
            return this.deferredEmit(function () {
                return _this._commandManager.pushEditOperation(beforeCursorState, editOperations, cursorStateComputer);
            });
        };
        /**
         * Transform operations such that they represent the same logic edit,
         * but that they also do not cause OOM crashes.
         */
        EditableTextModel.prototype._reduceOperations = function (operations) {
            if (operations.length < 1000) {
                // We know from empirical testing that a thousand edits work fine regardless of their shape.
                return operations;
            }
            // At one point, due to how events are emitted and how each operation is handled,
            // some operations can trigger a high ammount of temporary string allocations,
            // that will immediately get edited again.
            // e.g. a formatter inserting ridiculous ammounts of \n on a model with a single line
            // Therefore, the strategy is to collapse all the operations into a huge single edit operation
            return [this._toSingleEditOperation(operations)];
        };
        EditableTextModel.prototype._toSingleEditOperation = function (operations) {
            var forceMoveMarkers = false, firstEditRange = operations[0].range, lastEditRange = operations[operations.length - 1].range, entireEditRange = new range_1.Range(firstEditRange.startLineNumber, firstEditRange.startColumn, lastEditRange.endLineNumber, lastEditRange.endColumn), lastEndLineNumber = firstEditRange.startLineNumber, lastEndColumn = firstEditRange.startColumn, result = [];
            for (var i = 0, len = operations.length; i < len; i++) {
                var operation = operations[i], range = operation.range;
                forceMoveMarkers = forceMoveMarkers || operation.forceMoveMarkers;
                // (1) -- Push old text
                for (var lineNumber = lastEndLineNumber; lineNumber < range.startLineNumber; lineNumber++) {
                    if (lineNumber === lastEndLineNumber) {
                        result.push(this._lines[lineNumber - 1].text.substring(lastEndColumn - 1));
                    }
                    else {
                        result.push('\n');
                        result.push(this._lines[lineNumber - 1].text);
                    }
                }
                if (range.startLineNumber === lastEndLineNumber) {
                    result.push(this._lines[range.startLineNumber - 1].text.substring(lastEndColumn - 1, range.startColumn - 1));
                }
                else {
                    result.push('\n');
                    result.push(this._lines[range.startLineNumber - 1].text.substring(0, range.startColumn - 1));
                }
                // (2) -- Push new text
                if (operation.lines) {
                    for (var j = 0, lenJ = operation.lines.length; j < lenJ; j++) {
                        if (j !== 0) {
                            result.push('\n');
                        }
                        result.push(operation.lines[j]);
                    }
                }
                lastEndLineNumber = operation.range.endLineNumber;
                lastEndColumn = operation.range.endColumn;
            }
            return {
                sortIndex: 0,
                identifier: operations[0].identifier,
                range: entireEditRange,
                rangeLength: this.getValueLengthInRange(entireEditRange),
                lines: result.join('').split('\n'),
                forceMoveMarkers: forceMoveMarkers
            };
        };
        EditableTextModel._sortOpsAscending = function (a, b) {
            var r = range_1.Range.compareRangesUsingEnds(a.range, b.range);
            if (r === 0) {
                return a.sortIndex - b.sortIndex;
            }
            return r;
        };
        EditableTextModel._sortOpsDescending = function (a, b) {
            var r = range_1.Range.compareRangesUsingEnds(a.range, b.range);
            if (r === 0) {
                return b.sortIndex - a.sortIndex;
            }
            return -r;
        };
        EditableTextModel.prototype.applyEdits = function (rawOperations) {
            if (rawOperations.length === 0) {
                return [];
            }
            var operations = [];
            for (var i = 0; i < rawOperations.length; i++) {
                var op = rawOperations[i];
                var validatedRange = this.validateRange(op.range);
                operations[i] = {
                    sortIndex: i,
                    identifier: op.identifier,
                    range: validatedRange,
                    rangeLength: this.getValueLengthInRange(validatedRange),
                    lines: op.text ? op.text.split(/\r\n|\r|\n/) : null,
                    forceMoveMarkers: op.forceMoveMarkers
                };
            }
            // Sort operations ascending
            operations.sort(EditableTextModel._sortOpsAscending);
            for (var i = 0, count = operations.length - 1; i < count; i++) {
                var rangeEnd = operations[i].range.getEndPosition();
                var nextRangeStart = operations[i + 1].range.getStartPosition();
                if (nextRangeStart.isBefore(rangeEnd)) {
                    // overlapping ranges
                    throw new Error('Overlapping ranges are not allowed!');
                }
            }
            operations = this._reduceOperations(operations);
            var editableRange = this.getEditableRange();
            var editableRangeStart = editableRange.getStartPosition();
            var editableRangeEnd = editableRange.getEndPosition();
            for (var i = 0; i < operations.length; i++) {
                var operationRange = operations[i].range;
                if (!editableRangeStart.isBeforeOrEqual(operationRange.getStartPosition()) || !operationRange.getEndPosition().isBeforeOrEqual(editableRangeEnd)) {
                    throw new Error('Editing outside of editable range not allowed!');
                }
            }
            // Delta encode operations
            var reverseRanges = EditableTextModel._getInverseEditRanges(operations);
            var reverseOperations = [];
            for (var i = 0; i < operations.length; i++) {
                reverseOperations[i] = {
                    identifier: operations[i].identifier,
                    range: reverseRanges[i],
                    text: this.getValueInRange(operations[i].range),
                    forceMoveMarkers: operations[i].forceMoveMarkers
                };
            }
            this._applyEdits(operations);
            return reverseOperations;
        };
        /**
         * Assumes `operations` are validated and sorted ascending
         */
        EditableTextModel._getInverseEditRanges = function (operations) {
            var result = [];
            var prevOpEndLineNumber;
            var prevOpEndColumn;
            var prevOp = null;
            for (var i = 0, len = operations.length; i < len; i++) {
                var op = operations[i];
                var startLineNumber = void 0;
                var startColumn = void 0;
                if (prevOp) {
                    if (prevOp.range.endLineNumber === op.range.startLineNumber) {
                        startLineNumber = prevOpEndLineNumber;
                        startColumn = prevOpEndColumn + (op.range.startColumn - prevOp.range.endColumn);
                    }
                    else {
                        startLineNumber = prevOpEndLineNumber + (op.range.startLineNumber - prevOp.range.endLineNumber);
                        startColumn = op.range.startColumn;
                    }
                }
                else {
                    startLineNumber = op.range.startLineNumber;
                    startColumn = op.range.startColumn;
                }
                var resultRange = void 0;
                if (op.lines && op.lines.length > 0) {
                    // the operation inserts something
                    var lineCount = op.lines.length;
                    var firstLine = op.lines[0];
                    var lastLine = op.lines[lineCount - 1];
                    if (lineCount === 1) {
                        // single line insert
                        resultRange = new range_1.Range(startLineNumber, startColumn, startLineNumber, startColumn + firstLine.length);
                    }
                    else {
                        // multi line insert
                        resultRange = new range_1.Range(startLineNumber, startColumn, startLineNumber + lineCount - 1, lastLine.length + 1);
                    }
                }
                else {
                    // There is nothing to insert
                    resultRange = new range_1.Range(startLineNumber, startColumn, startLineNumber, startColumn);
                }
                prevOpEndLineNumber = resultRange.endLineNumber;
                prevOpEndColumn = resultRange.endColumn;
                result.push(resultRange);
                prevOp = op;
            }
            return result;
        };
        EditableTextModel.prototype._applyEdits = function (operations) {
            var _this = this;
            // Sort operations descending
            operations.sort(EditableTextModel._sortOpsDescending);
            this._withDeferredEvents(function (deferredEventsBuilder) {
                var contentChangedEvents = [];
                var contentChanged2Events = [];
                var lineEditsQueue = [];
                var queueLineEdit = function (lineEdit) {
                    if (lineEdit.startColumn === lineEdit.endColumn && lineEdit.text.length === 0) {
                        // empty edit => ignore it
                        return;
                    }
                    lineEditsQueue.push(lineEdit);
                };
                var flushLineEdits = function () {
                    if (lineEditsQueue.length === 0) {
                        return;
                    }
                    lineEditsQueue.reverse();
                    // `lineEditsQueue` now contains edits from smaller (line number,column) to larger (line number,column)
                    var currentLineNumber = lineEditsQueue[0].lineNumber, currentLineNumberStart = 0;
                    for (var i = 1, len = lineEditsQueue.length; i < len; i++) {
                        var lineNumber = lineEditsQueue[i].lineNumber;
                        if (lineNumber === currentLineNumber) {
                            continue;
                        }
                        _this._invalidateLine(currentLineNumber - 1);
                        _this._lines[currentLineNumber - 1].applyEdits(deferredEventsBuilder.changedMarkers, lineEditsQueue.slice(currentLineNumberStart, i));
                        contentChangedEvents.push(_this._createLineChangedEvent(currentLineNumber));
                        currentLineNumber = lineNumber;
                        currentLineNumberStart = i;
                    }
                    _this._invalidateLine(currentLineNumber - 1);
                    _this._lines[currentLineNumber - 1].applyEdits(deferredEventsBuilder.changedMarkers, lineEditsQueue.slice(currentLineNumberStart, lineEditsQueue.length));
                    contentChangedEvents.push(_this._createLineChangedEvent(currentLineNumber));
                    lineEditsQueue = [];
                };
                var minTouchedLineNumber = operations[operations.length - 1].range.startLineNumber;
                var maxTouchedLineNumber = operations[0].range.endLineNumber + 1;
                var totalLinesCountDelta = 0;
                for (var i = 0, len = operations.length; i < len; i++) {
                    var op = operations[i];
                    // console.log();
                    // console.log('-------------------');
                    // console.log('OPERATION #' + (i));
                    // console.log('op: ', op);
                    // console.log('<<<\n' + this._lines.map(l => l.text).join('\n') + '\n>>>');
                    var startLineNumber = op.range.startLineNumber;
                    var startColumn = op.range.startColumn;
                    var endLineNumber = op.range.endLineNumber;
                    var endColumn = op.range.endColumn;
                    if (startLineNumber === endLineNumber && startColumn === endColumn && (!op.lines || op.lines.length === 0)) {
                        // no-op
                        continue;
                    }
                    var deletingLinesCnt = endLineNumber - startLineNumber;
                    var insertingLinesCnt = (op.lines ? op.lines.length - 1 : 0);
                    var editingLinesCnt = Math.min(deletingLinesCnt, insertingLinesCnt);
                    totalLinesCountDelta += (insertingLinesCnt - deletingLinesCnt);
                    // Iterating descending to overlap with previous op
                    // in case there are common lines being edited in both
                    for (var j = editingLinesCnt; j >= 0; j--) {
                        var editLineNumber = startLineNumber + j;
                        queueLineEdit({
                            lineNumber: editLineNumber,
                            startColumn: (editLineNumber === startLineNumber ? startColumn : 1),
                            endColumn: (editLineNumber === endLineNumber ? endColumn : _this.getLineMaxColumn(editLineNumber)),
                            text: (op.lines ? op.lines[j] : ''),
                            forceMoveMarkers: op.forceMoveMarkers
                        });
                    }
                    if (editingLinesCnt < deletingLinesCnt) {
                        // Must delete some lines
                        // Flush any pending line edits
                        flushLineEdits();
                        var spliceStartLineNumber = startLineNumber + editingLinesCnt;
                        var spliceStartColumn = _this.getLineMaxColumn(spliceStartLineNumber);
                        var endLineRemains = _this._lines[endLineNumber - 1].split(deferredEventsBuilder.changedMarkers, endColumn, false);
                        _this._invalidateLine(spliceStartLineNumber - 1);
                        var spliceCnt = endLineNumber - spliceStartLineNumber;
                        // Collect all these markers
                        var markersOnDeletedLines = [];
                        for (var j = 0; j < spliceCnt; j++) {
                            var deleteLineIndex = spliceStartLineNumber + j;
                            markersOnDeletedLines = markersOnDeletedLines.concat(_this._lines[deleteLineIndex].deleteLine(deferredEventsBuilder.changedMarkers, spliceStartColumn, deleteLineIndex + 1));
                        }
                        _this._lines.splice(spliceStartLineNumber, spliceCnt);
                        // Reconstruct first line
                        _this._lines[spliceStartLineNumber - 1].append(deferredEventsBuilder.changedMarkers, endLineRemains);
                        _this._lines[spliceStartLineNumber - 1].addMarkers(markersOnDeletedLines);
                        contentChangedEvents.push(_this._createLineChangedEvent(spliceStartLineNumber));
                        contentChangedEvents.push(_this._createLinesDeletedEvent(spliceStartLineNumber + 1, spliceStartLineNumber + spliceCnt));
                    }
                    if (editingLinesCnt < insertingLinesCnt) {
                        // Must insert some lines
                        // Flush any pending line edits
                        flushLineEdits();
                        var spliceLineNumber = startLineNumber + editingLinesCnt;
                        var spliceColumn = (spliceLineNumber === startLineNumber ? startColumn : 1);
                        if (op.lines) {
                            spliceColumn += op.lines[editingLinesCnt].length;
                        }
                        // Split last line
                        var leftoverLine = _this._lines[spliceLineNumber - 1].split(deferredEventsBuilder.changedMarkers, spliceColumn, op.forceMoveMarkers);
                        contentChangedEvents.push(_this._createLineChangedEvent(spliceLineNumber));
                        _this._invalidateLine(spliceLineNumber - 1);
                        // Lines in the middle
                        var newLinesContent = [];
                        for (var j = editingLinesCnt + 1; j <= insertingLinesCnt; j++) {
                            var newLineNumber = startLineNumber + j;
                            _this._lines.splice(newLineNumber - 1, 0, new modelLine_1.ModelLine(newLineNumber, op.lines[j]));
                            newLinesContent.push(op.lines[j]);
                        }
                        newLinesContent[newLinesContent.length - 1] += leftoverLine.text;
                        // Last line
                        _this._lines[startLineNumber + insertingLinesCnt - 1].append(deferredEventsBuilder.changedMarkers, leftoverLine);
                        contentChangedEvents.push(_this._createLinesInsertedEvent(spliceLineNumber + 1, startLineNumber + insertingLinesCnt, newLinesContent.join('\n')));
                    }
                    contentChanged2Events.push({
                        range: new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn),
                        rangeLength: op.rangeLength,
                        text: op.lines ? op.lines.join(_this.getEOL()) : '',
                        eol: _this._EOL,
                        versionId: -1,
                        isUndoing: _this._isUndoing,
                        isRedoing: _this._isRedoing
                    });
                }
                flushLineEdits();
                maxTouchedLineNumber = Math.max(1, Math.min(_this.getLineCount(), maxTouchedLineNumber + totalLinesCountDelta));
                if (totalLinesCountDelta !== 0) {
                    // must update line numbers all the way to the bottom
                    maxTouchedLineNumber = _this.getLineCount();
                }
                for (var lineNumber = minTouchedLineNumber; lineNumber <= maxTouchedLineNumber; lineNumber++) {
                    _this._lines[lineNumber - 1].updateLineNumber(deferredEventsBuilder.changedMarkers, lineNumber);
                }
                if (contentChangedEvents.length !== 0 || contentChanged2Events.length !== 0) {
                    if (contentChangedEvents.length === 0) {
                        // Fabricate a fake line changed event to get an event out
                        // This most likely occurs when there edit operations are no-ops
                        contentChangedEvents.push(_this._createLineChangedEvent(minTouchedLineNumber));
                    }
                    var versionBumps = Math.max(contentChangedEvents.length, contentChanged2Events.length);
                    var finalVersionId = _this.getVersionId() + versionBumps;
                    _this._setVersionId(finalVersionId);
                    for (var i = contentChangedEvents.length - 1, versionId = finalVersionId; i >= 0; i--, versionId--) {
                        contentChangedEvents[i].versionId = versionId;
                    }
                    for (var i = contentChanged2Events.length - 1, versionId = finalVersionId; i >= 0; i--, versionId--) {
                        contentChanged2Events[i].versionId = versionId;
                    }
                    for (var i = 0, len = contentChangedEvents.length; i < len; i++) {
                        _this.emit(editorCommon.EventType.ModelContentChanged, contentChangedEvents[i]);
                    }
                    for (var i = 0, len = contentChanged2Events.length; i < len; i++) {
                        _this.emit(editorCommon.EventType.ModelContentChanged2, contentChanged2Events[i]);
                    }
                }
                // this._assertLineNumbersOK();
            });
        };
        EditableTextModel.prototype._assertLineNumbersOK = function () {
            var foundMarkersCnt = 0;
            for (var i = 0, len = this._lines.length; i < len; i++) {
                var line = this._lines[i];
                var lineNumber = i + 1;
                if (line.lineNumber !== lineNumber) {
                    throw new Error('Invalid lineNumber at line: ' + lineNumber + '; text is: ' + this.getValue());
                }
                var markers = line.getMarkers();
                for (var j = 0, lenJ = markers.length; j < lenJ; j++) {
                    foundMarkersCnt++;
                    var markerId = markers[j].id;
                    var marker = this._markerIdToMarker[markerId];
                    if (marker.line !== line) {
                        throw new Error('Misplaced marker with id ' + markerId);
                    }
                }
            }
            var totalMarkersCnt = Object.keys(this._markerIdToMarker).length;
            if (totalMarkersCnt !== foundMarkersCnt) {
                throw new Error('There are misplaced markers!');
            }
        };
        EditableTextModel.prototype.undo = function () {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('EditableTextModel.undo: Model is disposed');
            }
            return this._withDeferredEvents(function () {
                _this._isUndoing = true;
                var r = _this._commandManager.undo();
                _this._isUndoing = false;
                if (!r) {
                    return null;
                }
                _this._overwriteAlternativeVersionId(r.recordedVersionId);
                return r.selections;
            });
        };
        EditableTextModel.prototype.redo = function () {
            var _this = this;
            if (this._isDisposed) {
                throw new Error('EditableTextModel.redo: Model is disposed');
            }
            return this._withDeferredEvents(function () {
                _this._isRedoing = true;
                var r = _this._commandManager.redo();
                _this._isRedoing = false;
                if (!r) {
                    return null;
                }
                _this._overwriteAlternativeVersionId(r.recordedVersionId);
                return r.selections;
            });
        };
        EditableTextModel.prototype.setEditableRange = function (range) {
            if (this._isDisposed) {
                throw new Error('EditableTextModel.setEditableRange: Model is disposed');
            }
            this._commandManager.clear();
            if (this._hasEditableRange) {
                this.removeTrackedRange(this._editableRangeId);
                this._editableRangeId = null;
                this._hasEditableRange = false;
            }
            if (range) {
                this._hasEditableRange = true;
                this._editableRangeId = this.addTrackedRange(range, editorCommon.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges);
            }
        };
        EditableTextModel.prototype.hasEditableRange = function () {
            if (this._isDisposed) {
                throw new Error('EditableTextModel.hasEditableRange: Model is disposed');
            }
            return this._hasEditableRange;
        };
        EditableTextModel.prototype.getEditableRange = function () {
            if (this._isDisposed) {
                throw new Error('EditableTextModel.getEditableRange: Model is disposed');
            }
            if (this._hasEditableRange) {
                return this.getTrackedRange(this._editableRangeId);
            }
            else {
                return this.getFullModelRange();
            }
        };
        EditableTextModel.prototype._createLineChangedEvent = function (lineNumber) {
            return {
                changeType: editorCommon.EventType.ModelContentChangedLineChanged,
                lineNumber: lineNumber,
                detail: this._lines[lineNumber - 1].text,
                versionId: -1,
                isUndoing: this._isUndoing,
                isRedoing: this._isRedoing
            };
        };
        EditableTextModel.prototype._createLinesDeletedEvent = function (fromLineNumber, toLineNumber) {
            return {
                changeType: editorCommon.EventType.ModelContentChangedLinesDeleted,
                fromLineNumber: fromLineNumber,
                toLineNumber: toLineNumber,
                versionId: -1,
                isUndoing: this._isUndoing,
                isRedoing: this._isRedoing
            };
        };
        EditableTextModel.prototype._createLinesInsertedEvent = function (fromLineNumber, toLineNumber, newLinesContent) {
            return {
                changeType: editorCommon.EventType.ModelContentChangedLinesInserted,
                fromLineNumber: fromLineNumber,
                toLineNumber: toLineNumber,
                detail: newLinesContent,
                versionId: -1,
                isUndoing: this._isUndoing,
                isRedoing: this._isRedoing
            };
        };
        return EditableTextModel;
    }(textModelWithDecorations_1.TextModelWithDecorations));
    exports.EditableTextModel = EditableTextModel;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/model/model", ["require", "exports", 'vs/base/common/uri', 'vs/editor/common/editorCommon', 'vs/editor/common/model/editableTextModel', 'vs/editor/common/model/textModel'], function (require, exports, uri_1, editorCommon_1, editableTextModel_1, textModel_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // The hierarchy is:
    // Model -> EditableTextModel -> TextModelWithDecorations -> TextModelWithTrackedRanges -> TextModelWithMarkers -> TextModelWithTokens -> TextModel
    var MODEL_ID = 0;
    var aliveModels = {};
    // var LAST_CNT = 0;
    // setInterval(() => {
    // 	var cnt = Object.keys(aliveModels).length;
    // 	if (cnt === LAST_CNT) {
    // 		return;
    // 	}
    // 	console.warn('ALIVE MODELS:');
    // 	console.log(Object.keys(aliveModels).join('\n'));
    // 	LAST_CNT = cnt;
    // }, 100);
    var Model = (function (_super) {
        __extends(Model, _super);
        /**
         * Instantiates a new model
         * @param rawText
         *   The raw text buffer. It may start with a UTF-16 BOM, which can be
         *   optionally preserved when doing a getValue call. The lines may be
         *   separated by different EOL combinations, such as \n or \r\n. These
         *   can also be preserved when doing a getValue call.
         * @param mode
         *   The language service name this model is bound to.
         * @param associatedResource
         *   The resource associated with this model. If the value is not provided an
         *   unique in memory URL is constructed as the associated resource.
         */
        function Model(rawText, options, modeOrPromise, associatedResource) {
            if (associatedResource === void 0) { associatedResource = null; }
            _super.call(this, [
                editorCommon_1.EventType.ModelDispose
            ], textModel_1.TextModel.toRawText(rawText, options), modeOrPromise);
            // Generate a new unique model id
            MODEL_ID++;
            this.id = '$model' + MODEL_ID;
            if (typeof associatedResource === 'undefined' || associatedResource === null) {
                this._associatedResource = uri_1.default.parse('inmemory://model/' + MODEL_ID);
            }
            else {
                this._associatedResource = associatedResource;
            }
            if (aliveModels[String(this._associatedResource)]) {
                throw new Error('Cannot instantiate a second Model with the same URI!');
            }
            this._attachedEditorCount = 0;
            aliveModels[String(this._associatedResource)] = true;
            // console.log('ALIVE MODELS: ' + Object.keys(aliveModels).join('\n'));
        }
        Model.prototype.getModeId = function () {
            return this.getMode().getId();
        };
        Model.prototype.destroy = function () {
            this.dispose();
        };
        Model.prototype.dispose = function () {
            this._isDisposing = true;
            delete aliveModels[String(this._associatedResource)];
            this.emit(editorCommon_1.EventType.ModelDispose);
            _super.prototype.dispose.call(this);
            this._isDisposing = false;
            // console.log('ALIVE MODELS: ' + Object.keys(aliveModels).join('\n'));
        };
        Model.prototype.onBeforeAttached = function () {
            if (this._isDisposed) {
                throw new Error('Model.onBeforeAttached: Model is disposed');
            }
            this._attachedEditorCount++;
            // Warm up tokens for the editor
            this._warmUpTokens();
        };
        Model.prototype.onBeforeDetached = function () {
            if (this._isDisposed) {
                throw new Error('Model.onBeforeDetached: Model is disposed');
            }
            this._attachedEditorCount--;
            // Intentional empty (for now)
        };
        Model.prototype.isAttachedToEditor = function () {
            return this._attachedEditorCount > 0;
        };
        Model.prototype.getAssociatedResource = function () {
            if (this._isDisposed) {
                throw new Error('Model.getAssociatedResource: Model is disposed');
            }
            return this._associatedResource;
        };
        Model.DEFAULT_CREATION_OPTIONS = textModel_1.TextModel.DEFAULT_CREATION_OPTIONS;
        return Model;
    }(editableTextModel_1.EditableTextModel));
    exports.Model = Model;
});

define("vs/nls!vs/editor/common/modes/modesRegistry",['vs/nls', 'vs/nls!vs/editor/common/worker/editorWorkerServer'], function(nls, data) { return nls.create("vs/editor/common/modes/modesRegistry", data); });
define("vs/nls!vs/editor/common/services/modeServiceImpl",['vs/nls', 'vs/nls!vs/editor/common/worker/editorWorkerServer'], function(nls, data) { return nls.create("vs/editor/common/services/modeServiceImpl", data); });
define("vs/nls!vs/editor/common/services/modelServiceImpl",['vs/nls', 'vs/nls!vs/editor/common/worker/editorWorkerServer'], function(nls, data) { return nls.create("vs/editor/common/services/modelServiceImpl", data); });
define("vs/nls!vs/platform/extensions/common/abstractExtensionService",['vs/nls', 'vs/nls!vs/editor/common/worker/editorWorkerServer'], function(nls, data) { return nls.create("vs/platform/extensions/common/abstractExtensionService", data); });
define("vs/nls!vs/platform/extensions/common/extensionsRegistry",['vs/nls', 'vs/nls!vs/editor/common/worker/editorWorkerServer'], function(nls, data) { return nls.create("vs/platform/extensions/common/extensionsRegistry", data); });
define("vs/nls!vs/platform/jsonschemas/common/jsonContributionRegistry",['vs/nls', 'vs/nls!vs/editor/common/worker/editorWorkerServer'], function(nls, data) { return nls.create("vs/platform/jsonschemas/common/jsonContributionRegistry", data); });
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

define("vs/editor/common/services/editorWorkerService", ["require", "exports", 'vs/platform/instantiation/common/instantiation'], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.ID_EDITOR_WORKER_SERVICE = 'editorWorkerService';
    exports.IEditorWorkerService = instantiation_1.createDecorator(exports.ID_EDITOR_WORKER_SERVICE);
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define("vs/editor/common/modes/abstractMode", ["require", "exports", 'vs/base/common/eventEmitter', 'vs/base/common/winjs.base', 'vs/platform/instantiation/common/descriptors', 'vs/editor/common/modes/nullMode', 'vs/editor/common/modes/supports/suggestSupport', 'vs/editor/common/services/editorWorkerService'], function (require, exports, eventEmitter_1, winjs_base_1, descriptors_1, nullMode_1, suggestSupport_1, editorWorkerService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function createWordRegExp(allowInWords) {
        if (allowInWords === void 0) { allowInWords = ''; }
        return nullMode_1.NullMode.createWordRegExp(allowInWords);
    }
    exports.createWordRegExp = createWordRegExp;
    var ModeWorkerManager = (function () {
        function ModeWorkerManager(descriptor, workerModuleId, workerClassName, superWorkerModuleId, instantiationService) {
            this._descriptor = descriptor;
            this._workerDescriptor = descriptors_1.createAsyncDescriptor2(workerModuleId, workerClassName);
            this._superWorkerModuleId = superWorkerModuleId;
            this._instantiationService = instantiationService;
            this._workerPiecePromise = null;
        }
        ModeWorkerManager.prototype.worker = function (runner) {
            return this._getOrCreateWorker().then(runner);
        };
        ModeWorkerManager.prototype._getOrCreateWorker = function () {
            var _this = this;
            if (!this._workerPiecePromise) {
                // TODO@Alex: workaround for missing `bundles` config
                // First, load the code of the worker super class
                var superWorkerCodePromise = (this._superWorkerModuleId ? ModeWorkerManager._loadModule(this._superWorkerModuleId) : winjs_base_1.TPromise.as(null));
                this._workerPiecePromise = superWorkerCodePromise.then(function () {
                    // Second, load the code of the worker (without instantiating it)
                    return ModeWorkerManager._loadModule(_this._workerDescriptor.moduleName);
                }).then(function () {
                    // Then, load & instantiate all the participants
                    var participants = _this._descriptor.workerParticipants;
                    return winjs_base_1.TPromise.join(participants.map(function (participant) {
                        return _this._instantiationService.createInstance(participant);
                    }));
                }).then(function (participants) {
                    // Finally, create the mode worker instance
                    return _this._instantiationService.createInstance(_this._workerDescriptor, _this._descriptor.id, participants);
                });
            }
            return this._workerPiecePromise;
        };
        ModeWorkerManager._loadModule = function (moduleName) {
            return new winjs_base_1.TPromise(function (c, e, p) {
                require([moduleName], c, e);
            }, function () {
                // Cannot cancel loading code
            });
        };
        return ModeWorkerManager;
    }());
    exports.ModeWorkerManager = ModeWorkerManager;
    var AbstractMode = (function () {
        function AbstractMode(modeId) {
            this._modeId = modeId;
            this._eventEmitter = new eventEmitter_1.EventEmitter();
            this._simplifiedMode = null;
        }
        AbstractMode.prototype.getId = function () {
            return this._modeId;
        };
        AbstractMode.prototype.toSimplifiedMode = function () {
            if (!this._simplifiedMode) {
                this._simplifiedMode = new SimplifiedMode(this);
            }
            return this._simplifiedMode;
        };
        AbstractMode.prototype.addSupportChangedListener = function (callback) {
            return this._eventEmitter.addListener2('modeSupportChanged', callback);
        };
        AbstractMode.prototype.registerSupport = function (support, callback) {
            var _this = this;
            var supportImpl = callback(this);
            this[support] = supportImpl;
            this._eventEmitter.emit('modeSupportChanged', _createModeSupportChangedEvent(support));
            return {
                dispose: function () {
                    if (_this[support] === supportImpl) {
                        delete _this[support];
                        _this._eventEmitter.emit('modeSupportChanged', _createModeSupportChangedEvent(support));
                    }
                }
            };
        };
        return AbstractMode;
    }());
    exports.AbstractMode = AbstractMode;
    var SimplifiedMode = (function () {
        function SimplifiedMode(sourceMode) {
            var _this = this;
            this._sourceMode = sourceMode;
            this._eventEmitter = new eventEmitter_1.EventEmitter();
            this._id = 'vs.editor.modes.simplifiedMode:' + sourceMode.getId();
            this._assignSupports();
            if (this._sourceMode.addSupportChangedListener) {
                this._sourceMode.addSupportChangedListener(function (e) {
                    if (e.tokenizationSupport || e.richEditSupport) {
                        _this._assignSupports();
                        var newEvent = SimplifiedMode._createModeSupportChangedEvent(e);
                        _this._eventEmitter.emit('modeSupportChanged', newEvent);
                    }
                });
            }
        }
        SimplifiedMode.prototype.getId = function () {
            return this._id;
        };
        SimplifiedMode.prototype.toSimplifiedMode = function () {
            return this;
        };
        SimplifiedMode.prototype._assignSupports = function () {
            this.tokenizationSupport = this._sourceMode.tokenizationSupport;
            this.richEditSupport = this._sourceMode.richEditSupport;
        };
        SimplifiedMode._createModeSupportChangedEvent = function (originalModeEvent) {
            var event = {
                codeLensSupport: false,
                tokenizationSupport: originalModeEvent.tokenizationSupport,
                occurrencesSupport: false,
                declarationSupport: false,
                typeDeclarationSupport: false,
                navigateTypesSupport: false,
                referenceSupport: false,
                suggestSupport: false,
                parameterHintsSupport: false,
                extraInfoSupport: false,
                outlineSupport: false,
                logicalSelectionSupport: false,
                formattingSupport: false,
                inplaceReplaceSupport: false,
                emitOutputSupport: false,
                linkSupport: false,
                configSupport: false,
                quickFixSupport: false,
                richEditSupport: originalModeEvent.richEditSupport,
            };
            return event;
        };
        return SimplifiedMode;
    }());
    exports.isDigit = (function () {
        var _0 = '0'.charCodeAt(0), _1 = '1'.charCodeAt(0), _2 = '2'.charCodeAt(0), _3 = '3'.charCodeAt(0), _4 = '4'.charCodeAt(0), _5 = '5'.charCodeAt(0), _6 = '6'.charCodeAt(0), _7 = '7'.charCodeAt(0), _8 = '8'.charCodeAt(0), _9 = '9'.charCodeAt(0), _a = 'a'.charCodeAt(0), _b = 'b'.charCodeAt(0), _c = 'c'.charCodeAt(0), _d = 'd'.charCodeAt(0), _e = 'e'.charCodeAt(0), _f = 'f'.charCodeAt(0), _A = 'A'.charCodeAt(0), _B = 'B'.charCodeAt(0), _C = 'C'.charCodeAt(0), _D = 'D'.charCodeAt(0), _E = 'E'.charCodeAt(0), _F = 'F'.charCodeAt(0);
        return function isDigit(character, base) {
            var c = character.charCodeAt(0);
            switch (base) {
                case 1:
                    return c === _0;
                case 2:
                    return c >= _0 && c <= _1;
                case 3:
                    return c >= _0 && c <= _2;
                case 4:
                    return c >= _0 && c <= _3;
                case 5:
                    return c >= _0 && c <= _4;
                case 6:
                    return c >= _0 && c <= _5;
                case 7:
                    return c >= _0 && c <= _6;
                case 8:
                    return c >= _0 && c <= _7;
                case 9:
                    return c >= _0 && c <= _8;
                case 10:
                    return c >= _0 && c <= _9;
                case 11:
                    return (c >= _0 && c <= _9) || (c === _a) || (c === _A);
                case 12:
                    return (c >= _0 && c <= _9) || (c >= _a && c <= _b) || (c >= _A && c <= _B);
                case 13:
                    return (c >= _0 && c <= _9) || (c >= _a && c <= _c) || (c >= _A && c <= _C);
                case 14:
                    return (c >= _0 && c <= _9) || (c >= _a && c <= _d) || (c >= _A && c <= _D);
                case 15:
                    return (c >= _0 && c <= _9) || (c >= _a && c <= _e) || (c >= _A && c <= _E);
                default:
                    return (c >= _0 && c <= _9) || (c >= _a && c <= _f) || (c >= _A && c <= _F);
            }
        };
    })();
    var FrankensteinMode = (function (_super) {
        __extends(FrankensteinMode, _super);
        function FrankensteinMode(descriptor, editorWorkerService) {
            _super.call(this, descriptor.id);
            if (editorWorkerService) {
                this.suggestSupport = new suggestSupport_1.TextualSuggestSupport(this.getId(), editorWorkerService);
            }
        }
        FrankensteinMode = __decorate([
            __param(1, editorWorkerService_1.IEditorWorkerService)
        ], FrankensteinMode);
        return FrankensteinMode;
    }(AbstractMode));
    exports.FrankensteinMode = FrankensteinMode;
    function _createModeSupportChangedEvent() {
        var changedSupports = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            changedSupports[_i - 0] = arguments[_i];
        }
        var event = {
            codeLensSupport: false,
            tokenizationSupport: false,
            occurrencesSupport: false,
            declarationSupport: false,
            typeDeclarationSupport: false,
            navigateTypesSupport: false,
            referenceSupport: false,
            suggestSupport: false,
            parameterHintsSupport: false,
            extraInfoSupport: false,
            outlineSupport: false,
            logicalSelectionSupport: false,
            formattingSupport: false,
            inplaceReplaceSupport: false,
            emitOutputSupport: false,
            linkSupport: false,
            configSupport: false,
            quickFixSupport: false,
            richEditSupport: false
        };
        changedSupports.forEach(function (support) { return event[support] = true; });
        return event;
    }
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/modes/monarch/monarch", ["require", "exports", 'vs/editor/common/modes/abstractMode', 'vs/editor/common/modes/monarch/monarchDefinition', 'vs/editor/common/modes/monarch/monarchLexer', 'vs/editor/common/modes/supports/richEditSupport'], function (require, exports, abstractMode_1, monarchDefinition_1, monarchLexer_1, richEditSupport_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * The MonarchMode creates a Monaco language mode given a certain language description
     */
    var MonarchMode = (function (_super) {
        __extends(MonarchMode, _super);
        function MonarchMode(modeId, lexer, modeService, modelService, editorWorkerService) {
            _super.call(this, modeId);
            this.tokenizationSupport = monarchLexer_1.createTokenizationSupport(modeService, this, lexer);
            this.richEditSupport = new richEditSupport_1.RichEditSupport(this.getId(), null, monarchDefinition_1.createRichEditSupport(lexer));
            this.suggestSupport = monarchDefinition_1.createSuggestSupport(modelService, editorWorkerService, this.getId(), lexer);
        }
        return MonarchMode;
    }(abstractMode_1.AbstractMode));
    exports.MonarchMode = MonarchMode;
});

define("vs/editor/common/services/modeService", ["require", "exports", 'vs/platform/instantiation/common/instantiation'], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IModeService = instantiation_1.createDecorator('modeService');
});

define("vs/editor/common/services/modelService", ["require", "exports", 'vs/platform/instantiation/common/instantiation'], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IModelService = instantiation_1.createDecorator('modelService');
});

define("vs/editor/common/services/resourceService", ["require", "exports", 'vs/platform/instantiation/common/instantiation'], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // Resource Service
    exports.ResourceEvents = {
        ADDED: 'resource.added',
        REMOVED: 'resource.removed',
        CHANGED: 'resource.changed'
    };
    exports.IResourceService = instantiation_1.createDecorator('resourceService');
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/services/resourceServiceImpl", ["require", "exports", 'vs/base/common/eventEmitter', 'vs/editor/common/services/resourceService'], function (require, exports, eventEmitter_1, resourceService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ResourceService = (function (_super) {
        __extends(ResourceService, _super);
        function ResourceService() {
            _super.call(this);
            this.serviceId = resourceService_1.IResourceService;
            this.data = {};
            this.unbinds = {};
        }
        ResourceService.prototype.addListener_ = function (eventType, listener) {
            return _super.prototype.addListener.call(this, eventType, listener);
        };
        ResourceService.prototype.addListener2_ = function (eventType, listener) {
            return _super.prototype.addListener2.call(this, eventType, listener);
        };
        ResourceService.prototype._anonymousModelId = function (input) {
            var r = '';
            for (var i = 0; i < input.length; i++) {
                var ch = input[i];
                if (ch >= '0' && ch <= '9') {
                    r += '0';
                    continue;
                }
                if (ch >= 'a' && ch <= 'z') {
                    r += 'a';
                    continue;
                }
                if (ch >= 'A' && ch <= 'Z') {
                    r += 'A';
                    continue;
                }
                r += ch;
            }
            return r;
        };
        ResourceService.prototype.insert = function (url, element) {
            var _this = this;
            // console.log('INSERT: ' + url.toString());
            if (this.contains(url)) {
                // There already exists a model with this id => this is a programmer error
                throw new Error('ResourceService: Cannot add model ' + this._anonymousModelId(url.toString()) + ' because it already exists!');
            }
            // add resource
            var key = url.toString();
            this.data[key] = element;
            this.unbinds[key] = [];
            this.unbinds[key].push(element.addBulkListener(function (value) {
                _this.emit(resourceService_1.ResourceEvents.CHANGED, { url: url, originalEvents: value });
            }));
            // event
            this.emit(resourceService_1.ResourceEvents.ADDED, { url: url, addedElement: element });
        };
        ResourceService.prototype.get = function (url) {
            if (!this.data[url.toString()]) {
                return null;
            }
            return this.data[url.toString()];
        };
        ResourceService.prototype.all = function () {
            var _this = this;
            return Object.keys(this.data).map(function (key) {
                return _this.data[key];
            });
        };
        ResourceService.prototype.contains = function (url) {
            return !!this.data[url.toString()];
        };
        ResourceService.prototype.remove = function (url) {
            // console.log('REMOVE: ' + url.toString());
            if (!this.contains(url)) {
                return;
            }
            var key = url.toString(), element = this.data[key];
            // stop listen
            while (this.unbinds[key].length > 0) {
                this.unbinds[key].pop()();
            }
            // removal
            delete this.unbinds[key];
            delete this.data[key];
            // event
            this.emit(resourceService_1.ResourceEvents.REMOVED, { url: url, removedElement: element });
        };
        return ResourceService;
    }(eventEmitter_1.EventEmitter));
    exports.ResourceService = ResourceService;
});

define("vs/editor/common/worker/validationHelper", ["require", "exports", 'vs/base/common/async', 'vs/base/common/lifecycle', 'vs/editor/common/services/resourceService'], function (require, exports, async_1, lifecycle_1, resourceService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ValidationModel = (function () {
        function ValidationModel(model, changeCallback) {
            var _this = this;
            this._toDispose = [];
            this._changeCallback = changeCallback;
            this._model = model;
            this._isDirty = false;
            this._toDispose.push({
                dispose: model.addBulkListener(function (events) { return _this._onModelChanged(events); })
            });
        }
        ValidationModel.prototype.dispose = function () {
            this._toDispose = lifecycle_1.disposeAll(this._toDispose);
            this._changeCallback = null;
        };
        ValidationModel.prototype.markAsClean = function () {
            this._isDirty = false;
        };
        ValidationModel.prototype.markAsDirty = function () {
            this._isDirty = true;
        };
        ValidationModel.prototype.isDirty = function () {
            return this._isDirty;
        };
        ValidationModel.prototype.getMirrorModel = function () {
            return this._model;
        };
        ValidationModel.prototype._onModelChanged = function (events) {
            var containsChanged = false;
            for (var i = 0; !containsChanged && i < events.length; i++) {
                if (events[i].getType() === 'changed') {
                    containsChanged = true;
                }
            }
            if (containsChanged) {
                this._changeCallback(this);
            }
        };
        return ValidationModel;
    }());
    var ValidationHelper = (function () {
        function ValidationHelper(resourceService, modeId, callback) {
            var _this = this;
            this._toDispose = [];
            this._resourceService = resourceService;
            this._callback = callback;
            this._filter = function (resource) { return (resource.getMode().getId() === modeId); };
            this._validationDelay = 500;
            this._models = {};
            this._isDueToConfigurationChange = false;
            this._toDispose.push(this._resourceService.addListener2_(resourceService_1.ResourceEvents.ADDED, function (e) {
                _this._onResourceAdded(e);
            }));
            this._toDispose.push(this._resourceService.addListener2_(resourceService_1.ResourceEvents.REMOVED, function (e) {
                _this._onResourceRemoved(e);
            }));
            this._validate = new async_1.RunOnceScheduler(function () { return _this._invokeCallback(); }, this._validationDelay);
            this._toDispose.push(this._validate);
            this._resourceService.all().forEach(function (element) { return _this._addElement(element); });
        }
        ValidationHelper.prototype.dispose = function () {
            var _this = this;
            this._toDispose = lifecycle_1.disposeAll(this._toDispose);
            lifecycle_1.disposeAll(Object.keys(this._models).map(function (modelUrl) { return _this._models[modelUrl]; }));
            this._models = null;
        };
        ValidationHelper.prototype.trigger = function () {
            this._validate.schedule();
        };
        ValidationHelper.prototype.triggerDueToConfigurationChange = function () {
            this._isDueToConfigurationChange = true;
            this._validate.schedule();
        };
        ValidationHelper.prototype._addElement = function (element) {
            var _this = this;
            if (!this._filter(element)) {
                return;
            }
            var model = element;
            var validationModel = new ValidationModel(model, function (model) { return _this._onChanged(model); });
            this._models[model.getAssociatedResource().toString()] = validationModel;
            this._onChanged(validationModel);
        };
        ValidationHelper.prototype._onResourceAdded = function (e) {
            var stringUrl = e.url.toString();
            if (this._models.hasOwnProperty(stringUrl)) {
                this._models[stringUrl].dispose();
            }
            this._addElement(e.addedElement);
        };
        ValidationHelper.prototype._onResourceRemoved = function (e) {
            var stringUrl = e.url.toString();
            if (this._models.hasOwnProperty(stringUrl)) {
                this._models[stringUrl].dispose();
                delete this._models[stringUrl];
            }
        };
        ValidationHelper.prototype._onChanged = function (model) {
            model.markAsDirty();
            this._validate.schedule();
        };
        ValidationHelper.prototype._invokeCallback = function () {
            var _this = this;
            if (!this._isEnabled) {
                return;
            }
            var dirtyModels = [];
            var cleanModels = [];
            Object.keys(this._models)
                .map(function (modelUrl) { return _this._models[modelUrl]; })
                .forEach(function (model) {
                if (model.isDirty()) {
                    dirtyModels.push(model.getMirrorModel().getAssociatedResource());
                    model.markAsClean();
                }
                else {
                    cleanModels.push(model.getMirrorModel().getAssociatedResource());
                }
            });
            var isDueToConfigurationChange = this._isDueToConfigurationChange;
            this._isDueToConfigurationChange = false;
            var toValidate = dirtyModels;
            if (isDueToConfigurationChange) {
                toValidate = toValidate.concat(cleanModels);
            }
            this._callback(toValidate);
        };
        ValidationHelper.prototype.enable = function () {
            this._isEnabled = true;
            this.trigger();
        };
        return ValidationHelper;
    }());
    exports.ValidationHelper = ValidationHelper;
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

define("vs/platform/extensions/common/extensions", ["require", "exports", 'vs/platform/instantiation/common/instantiation'], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IExtensionService = instantiation_1.createDecorator('extensionService');
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

define("vs/platform/markers/common/markers", ["require", "exports", 'vs/platform/instantiation/common/instantiation'], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IMarkerService = instantiation_1.createDecorator('markerService');
    (function (MarkerType) {
        MarkerType[MarkerType["transient"] = 1] = "transient";
        MarkerType[MarkerType["permanent"] = 2] = "permanent";
    })(exports.MarkerType || (exports.MarkerType = {}));
    var MarkerType = exports.MarkerType;
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

define("vs/editor/common/modes/modesRegistry", ["require", "exports", 'vs/nls!vs/editor/common/modes/modesRegistry', 'vs/base/common/event', 'vs/platform/platform'], function (require, exports, nls, event_1, platform_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // Define extension point ids
    exports.Extensions = {
        ModesRegistry: 'editor.modesRegistry'
    };
    var EditorModesRegistry = (function () {
        function EditorModesRegistry() {
            this._onDidAddCompatModes = new event_1.Emitter();
            this.onDidAddCompatModes = this._onDidAddCompatModes.event;
            this._onDidAddLanguages = new event_1.Emitter();
            this.onDidAddLanguages = this._onDidAddLanguages.event;
            this._workerParticipants = [];
            this._compatModes = [];
            this._languages = [];
        }
        // --- worker participants
        EditorModesRegistry.prototype.registerWorkerParticipants = function (participants) {
            this._workerParticipants = participants;
        };
        EditorModesRegistry.prototype.registerWorkerParticipant = function (modeId, moduleId, ctorName) {
            if (typeof modeId !== 'string') {
                throw new Error('InvalidArgument: expected `modeId` to be a string');
            }
            if (typeof moduleId !== 'string') {
                throw new Error('InvalidArgument: expected `moduleId` to be a string');
            }
            this._workerParticipants.push({
                modeId: modeId,
                moduleId: moduleId,
                ctorName: ctorName
            });
        };
        EditorModesRegistry.prototype.getWorkerParticipantsForMode = function (modeId) {
            return this._workerParticipants.filter(function (p) { return p.modeId === modeId; });
        };
        EditorModesRegistry.prototype.getWorkerParticipants = function () {
            return this._workerParticipants;
        };
        // --- compat modes
        EditorModesRegistry.prototype.registerCompatModes = function (def) {
            this._compatModes = this._compatModes.concat(def);
            this._onDidAddCompatModes.fire(def);
        };
        EditorModesRegistry.prototype.registerCompatMode = function (def) {
            this._compatModes.push(def);
            this._onDidAddCompatModes.fire([def]);
        };
        EditorModesRegistry.prototype.getCompatModes = function () {
            return this._compatModes.slice(0);
        };
        // --- languages
        EditorModesRegistry.prototype.registerLanguage = function (def) {
            this._languages.push(def);
            this._onDidAddLanguages.fire([def]);
        };
        EditorModesRegistry.prototype.registerLanguages = function (def) {
            this._languages = this._languages.concat(def);
            this._onDidAddLanguages.fire(def);
        };
        EditorModesRegistry.prototype.getLanguages = function () {
            return this._languages.slice(0);
        };
        return EditorModesRegistry;
    }());
    exports.EditorModesRegistry = EditorModesRegistry;
    exports.ModesRegistry = new EditorModesRegistry();
    platform_1.Registry.add(exports.Extensions.ModesRegistry, exports.ModesRegistry);
    exports.ModesRegistry.registerLanguage({
        id: 'plaintext',
        extensions: ['.txt', '.gitignore'],
        aliases: [nls.localize(0, null), 'text'],
        mimetypes: ['text/plain']
    });
});

define("vs/editor/common/services/languagesRegistry", ["require", "exports", 'vs/base/common/errors', 'vs/base/common/event', 'vs/base/common/mime', 'vs/base/common/strings', 'vs/editor/common/modes/modesRegistry'], function (require, exports, errors_1, event_1, mime, strings, modesRegistry_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var LanguagesRegistry = (function () {
        function LanguagesRegistry(useModesRegistry) {
            var _this = this;
            if (useModesRegistry === void 0) { useModesRegistry = true; }
            this._onDidAddModes = new event_1.Emitter();
            this.onDidAddModes = this._onDidAddModes.event;
            this.knownModeIds = {};
            this.mime2LanguageId = {};
            this.name2LanguageId = {};
            this.id2Name = {};
            this.name2Extensions = {};
            this.compatModes = {};
            this.lowerName2Id = {};
            this.id2ConfigurationFiles = {};
            if (useModesRegistry) {
                this._registerCompatModes(modesRegistry_1.ModesRegistry.getCompatModes());
                modesRegistry_1.ModesRegistry.onDidAddCompatModes(function (m) { return _this._registerCompatModes(m); });
                this._registerLanguages(modesRegistry_1.ModesRegistry.getLanguages());
                modesRegistry_1.ModesRegistry.onDidAddLanguages(function (m) { return _this._registerLanguages(m); });
            }
        }
        LanguagesRegistry.prototype._registerCompatModes = function (defs) {
            var addedModes = [];
            for (var i = 0; i < defs.length; i++) {
                var def = defs[i];
                this._registerLanguage({
                    id: def.id,
                    extensions: def.extensions,
                    filenames: def.filenames,
                    firstLine: def.firstLine,
                    aliases: def.aliases,
                    mimetypes: def.mimetypes
                });
                this.compatModes[def.id] = {
                    moduleId: def.moduleId,
                    ctorName: def.ctorName
                };
                addedModes.push(def.id);
            }
            this._onDidAddModes.fire(addedModes);
        };
        LanguagesRegistry.prototype._registerLanguages = function (desc) {
            var addedModes = [];
            for (var i = 0; i < desc.length; i++) {
                this._registerLanguage(desc[i]);
                addedModes.push(desc[i].id);
            }
            this._onDidAddModes.fire(addedModes);
        };
        LanguagesRegistry.prototype._registerLanguage = function (lang) {
            this.knownModeIds[lang.id] = true;
            var primaryMime = null;
            if (typeof lang.mimetypes !== 'undefined' && Array.isArray(lang.mimetypes)) {
                for (var i = 0; i < lang.mimetypes.length; i++) {
                    if (!primaryMime) {
                        primaryMime = lang.mimetypes[i];
                    }
                    this.mime2LanguageId[lang.mimetypes[i]] = lang.id;
                }
            }
            if (!primaryMime) {
                primaryMime = 'text/x-' + lang.id;
                this.mime2LanguageId[primaryMime] = lang.id;
            }
            if (Array.isArray(lang.extensions)) {
                for (var _i = 0, _a = lang.extensions; _i < _a.length; _i++) {
                    var extension = _a[_i];
                    mime.registerTextMime({ mime: primaryMime, extension: extension });
                }
            }
            if (Array.isArray(lang.filenames)) {
                for (var _b = 0, _c = lang.filenames; _b < _c.length; _b++) {
                    var filename = _c[_b];
                    mime.registerTextMime({ mime: primaryMime, filename: filename });
                }
            }
            if (Array.isArray(lang.filenamePatterns)) {
                for (var _d = 0, _e = lang.filenamePatterns; _d < _e.length; _d++) {
                    var filenamePattern = _e[_d];
                    mime.registerTextMime({ mime: primaryMime, filepattern: filenamePattern });
                }
            }
            if (typeof lang.firstLine === 'string' && lang.firstLine.length > 0) {
                var firstLineRegexStr = lang.firstLine;
                if (firstLineRegexStr.charAt(0) !== '^') {
                    firstLineRegexStr = '^' + firstLineRegexStr;
                }
                try {
                    var firstLineRegex = new RegExp(firstLineRegexStr);
                    if (!strings.regExpLeadsToEndlessLoop(firstLineRegex)) {
                        mime.registerTextMime({ mime: primaryMime, firstline: firstLineRegex });
                    }
                }
                catch (err) {
                    // Most likely, the regex was bad
                    errors_1.onUnexpectedError(err);
                }
            }
            this.lowerName2Id[lang.id.toLowerCase()] = lang.id;
            if (typeof lang.aliases !== 'undefined' && Array.isArray(lang.aliases)) {
                for (var i = 0; i < lang.aliases.length; i++) {
                    if (!lang.aliases[i] || lang.aliases[i].length === 0) {
                        continue;
                    }
                    this.lowerName2Id[lang.aliases[i].toLowerCase()] = lang.id;
                }
            }
            if (!this.id2Name[lang.id]) {
                var bestName = null;
                if (typeof lang.aliases !== 'undefined' && Array.isArray(lang.aliases) && lang.aliases.length > 0) {
                    bestName = lang.aliases[0];
                }
                else {
                    bestName = lang.id;
                }
                if (bestName) {
                    this.name2LanguageId[bestName] = lang.id;
                    this.name2Extensions[bestName] = lang.extensions;
                    this.id2Name[lang.id] = bestName || '';
                }
            }
            if (typeof lang.configuration === 'string') {
                this.id2ConfigurationFiles[lang.id] = this.id2ConfigurationFiles[lang.id] || [];
                this.id2ConfigurationFiles[lang.id].push(lang.configuration);
            }
        };
        LanguagesRegistry.prototype.isRegisteredMode = function (mimetypeOrModeId) {
            // Is this a known mime type ?
            if (hasOwnProperty.call(this.mime2LanguageId, mimetypeOrModeId)) {
                return true;
            }
            // Is this a known mode id ?
            return hasOwnProperty.call(this.knownModeIds, mimetypeOrModeId);
        };
        LanguagesRegistry.prototype.getRegisteredModes = function () {
            return Object.keys(this.knownModeIds);
        };
        LanguagesRegistry.prototype.getRegisteredLanguageNames = function () {
            return Object.keys(this.name2LanguageId);
        };
        LanguagesRegistry.prototype.getLanguageName = function (modeId) {
            return this.id2Name[modeId] || null;
        };
        LanguagesRegistry.prototype.getModeIdForLanguageNameLowercase = function (languageNameLower) {
            return this.lowerName2Id[languageNameLower] || null;
        };
        LanguagesRegistry.prototype.getConfigurationFiles = function (modeId) {
            return this.id2ConfigurationFiles[modeId] || [];
        };
        LanguagesRegistry.prototype.getMimeForMode = function (theModeId) {
            for (var _mime in this.mime2LanguageId) {
                if (this.mime2LanguageId.hasOwnProperty(_mime)) {
                    var modeId = this.mime2LanguageId[_mime];
                    if (modeId === theModeId) {
                        return _mime;
                    }
                }
            }
            return null;
        };
        LanguagesRegistry.prototype.extractModeIds = function (commaSeparatedMimetypesOrCommaSeparatedIdsOrName) {
            var _this = this;
            if (!commaSeparatedMimetypesOrCommaSeparatedIdsOrName) {
                return [];
            }
            return (commaSeparatedMimetypesOrCommaSeparatedIdsOrName.
                split(',').
                map(function (mimeTypeOrIdOrName) { return mimeTypeOrIdOrName.trim(); }).
                map(function (mimeTypeOrIdOrName) {
                return _this.mime2LanguageId[mimeTypeOrIdOrName] || mimeTypeOrIdOrName;
            }).
                filter(function (modeId) {
                return _this.knownModeIds[modeId];
            }));
        };
        LanguagesRegistry.prototype.getModeIdsFromLanguageName = function (languageName) {
            if (!languageName) {
                return [];
            }
            if (hasOwnProperty.call(this.name2LanguageId, languageName)) {
                return [this.name2LanguageId[languageName]];
            }
            return [];
        };
        LanguagesRegistry.prototype.getModeIdsFromFilenameOrFirstLine = function (filename, firstLine) {
            if (!filename && !firstLine) {
                return [];
            }
            var mimeTypes = mime.guessMimeTypes(filename, firstLine);
            return this.extractModeIds(mimeTypes.join(','));
        };
        LanguagesRegistry.prototype.getCompatMode = function (modeId) {
            return this.compatModes[modeId] || null;
        };
        LanguagesRegistry.prototype.getExtensions = function (languageName) {
            return this.name2Extensions[languageName];
        };
        return LanguagesRegistry;
    }());
    exports.LanguagesRegistry = LanguagesRegistry;
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

define("vs/platform/extensions/common/abstractExtensionService", ["require", "exports", 'vs/nls!vs/platform/extensions/common/abstractExtensionService', 'vs/base/common/severity', 'vs/base/common/winjs.base', 'vs/platform/extensions/common/extensions', 'vs/platform/extensions/common/extensionsRegistry'], function (require, exports, nls, severity_1, winjs_base_1, extensions_1, extensionsRegistry_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var hasOwnProperty = Object.hasOwnProperty;
    var ActivatedExtension = (function () {
        function ActivatedExtension(activationFailed) {
            this.activationFailed = activationFailed;
        }
        return ActivatedExtension;
    }());
    exports.ActivatedExtension = ActivatedExtension;
    var AbstractExtensionService = (function () {
        function AbstractExtensionService(isReadyByDefault) {
            var _this = this;
            this.serviceId = extensions_1.IExtensionService;
            if (isReadyByDefault) {
                this._onReady = winjs_base_1.TPromise.as(true);
                this._onReadyC = function (v) { };
            }
            else {
                this._onReady = new winjs_base_1.TPromise(function (c, e, p) {
                    _this._onReadyC = c;
                }, function () {
                    console.warn('You should really not try to cancel this ready promise!');
                });
            }
            this._activatingExtensions = {};
            this._activatedExtensions = {};
        }
        AbstractExtensionService.prototype._triggerOnReady = function () {
            this._onReadyC(true);
        };
        AbstractExtensionService.prototype.onReady = function () {
            return this._onReady;
        };
        AbstractExtensionService.prototype.getExtensionsStatus = function () {
            return null;
        };
        AbstractExtensionService.prototype.isActivated = function (extensionId) {
            return hasOwnProperty.call(this._activatedExtensions, extensionId);
        };
        AbstractExtensionService.prototype.activateByEvent = function (activationEvent) {
            var _this = this;
            return this._onReady.then(function () {
                extensionsRegistry_1.ExtensionsRegistry.triggerActivationEventListeners(activationEvent);
                var activateExtensions = extensionsRegistry_1.ExtensionsRegistry.getExtensionDescriptionsForActivationEvent(activationEvent);
                return _this._activateExtensions(activateExtensions, 0);
            });
        };
        AbstractExtensionService.prototype.activateById = function (extensionId) {
            var _this = this;
            return this._onReady.then(function () {
                var desc = extensionsRegistry_1.ExtensionsRegistry.getExtensionDescription(extensionId);
                if (!desc) {
                    throw new Error('Extension `' + extensionId + '` is not known');
                }
                return _this._activateExtensions([desc], 0);
            });
        };
        /**
         * Handle semantics related to dependencies for `currentExtension`.
         * semantics: `redExtensions` must wait for `greenExtensions`.
         */
        AbstractExtensionService.prototype._handleActivateRequest = function (currentExtension, greenExtensions, redExtensions) {
            var depIds = (typeof currentExtension.extensionDependencies === 'undefined' ? [] : currentExtension.extensionDependencies);
            var currentExtensionGetsGreenLight = true;
            for (var j = 0, lenJ = depIds.length; j < lenJ; j++) {
                var depId = depIds[j];
                var depDesc = extensionsRegistry_1.ExtensionsRegistry.getExtensionDescription(depId);
                if (!depDesc) {
                    // Error condition 1: unknown dependency
                    this._showMessage(severity_1.default.Error, nls.localize(0, null, depId, currentExtension.id));
                    this._activatedExtensions[currentExtension.id] = this._createFailedExtension();
                    return;
                }
                if (hasOwnProperty.call(this._activatedExtensions, depId)) {
                    var dep = this._activatedExtensions[depId];
                    if (dep.activationFailed) {
                        // Error condition 2: a dependency has already failed activation
                        this._showMessage(severity_1.default.Error, nls.localize(1, null, depId, currentExtension.id));
                        this._activatedExtensions[currentExtension.id] = this._createFailedExtension();
                        return;
                    }
                }
                else {
                    // must first wait for the dependency to activate
                    currentExtensionGetsGreenLight = false;
                    greenExtensions[depId] = depDesc;
                }
            }
            if (currentExtensionGetsGreenLight) {
                greenExtensions[currentExtension.id] = currentExtension;
            }
            else {
                redExtensions.push(currentExtension);
            }
        };
        AbstractExtensionService.prototype._activateExtensions = function (extensionDescriptions, recursionLevel) {
            var _this = this;
            // console.log(recursionLevel, '_activateExtensions: ', extensionDescriptions.map(p => p.id));
            if (extensionDescriptions.length === 0) {
                return winjs_base_1.TPromise.as(void 0);
            }
            extensionDescriptions = extensionDescriptions.filter(function (p) { return !hasOwnProperty.call(_this._activatedExtensions, p.id); });
            if (extensionDescriptions.length === 0) {
                return winjs_base_1.TPromise.as(void 0);
            }
            if (recursionLevel > 10) {
                // More than 10 dependencies deep => most likely a dependency loop
                for (var i = 0, len = extensionDescriptions.length; i < len; i++) {
                    // Error condition 3: dependency loop
                    this._showMessage(severity_1.default.Error, nls.localize(2, null, extensionDescriptions[i].id));
                    this._activatedExtensions[extensionDescriptions[i].id] = this._createFailedExtension();
                }
                return winjs_base_1.TPromise.as(void 0);
            }
            var greenMap = Object.create(null), red = [];
            for (var i = 0, len = extensionDescriptions.length; i < len; i++) {
                this._handleActivateRequest(extensionDescriptions[i], greenMap, red);
            }
            // Make sure no red is also green
            for (var i = 0, len = red.length; i < len; i++) {
                if (greenMap[red[i].id]) {
                    delete greenMap[red[i].id];
                }
            }
            var green = Object.keys(greenMap).map(function (id) { return greenMap[id]; });
            // console.log('greenExtensions: ', green.map(p => p.id));
            // console.log('redExtensions: ', red.map(p => p.id));
            if (red.length === 0) {
                // Finally reached only leafs!
                return winjs_base_1.TPromise.join(green.map(function (p) { return _this._activateExtension(p); })).then(function (_) { return void 0; });
            }
            return this._activateExtensions(green, recursionLevel + 1).then(function (_) {
                return _this._activateExtensions(red, recursionLevel + 1);
            });
        };
        AbstractExtensionService.prototype._activateExtension = function (extensionDescription) {
            var _this = this;
            if (hasOwnProperty.call(this._activatedExtensions, extensionDescription.id)) {
                return winjs_base_1.TPromise.as(void 0);
            }
            if (hasOwnProperty.call(this._activatingExtensions, extensionDescription.id)) {
                return this._activatingExtensions[extensionDescription.id];
            }
            this._activatingExtensions[extensionDescription.id] = this._actualActivateExtension(extensionDescription).then(null, function (err) {
                _this._showMessage(severity_1.default.Error, nls.localize(3, null, extensionDescription.id, err.message));
                console.error('Activating extension `' + extensionDescription.id + '` failed: ', err.message);
                console.log('Here is the error stack: ', err.stack);
                // Treat the extension as being empty
                return _this._createFailedExtension();
            }).then(function (x) {
                _this._activatedExtensions[extensionDescription.id] = x;
                delete _this._activatingExtensions[extensionDescription.id];
            });
            return this._activatingExtensions[extensionDescription.id];
        };
        return AbstractExtensionService;
    }());
    exports.AbstractExtensionService = AbstractExtensionService;
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

define("vs/platform/telemetry/common/telemetry", ["require", "exports", 'vs/platform/instantiation/common/instantiation'], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.ID = 'telemetryService';
    exports.ITelemetryService = instantiation_1.createDecorator(exports.ID);
    function anonymize(input) {
        if (!input) {
            return input;
        }
        var r = '';
        for (var i = 0; i < input.length; i++) {
            var ch = input[i];
            if (ch >= '0' && ch <= '9') {
                r += '0';
                continue;
            }
            if (ch >= 'a' && ch <= 'z') {
                r += 'a';
                continue;
            }
            if (ch >= 'A' && ch <= 'Z') {
                r += 'A';
                continue;
            }
            r += ch;
        }
        return r;
    }
    exports.anonymize = anonymize;
});

define("vs/platform/telemetry/common/abstractTelemetryService", ["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/errors', 'vs/base/common/types', 'vs/base/common/platform', 'vs/base/common/timer', 'vs/base/common/objects', 'vs/platform/platform', 'vs/platform/telemetry/common/telemetry'], function (require, exports, winjs_base_1, Errors, Types, Platform, timer_1, objects_1, platform_1, telemetry_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var DefaultTelemetryServiceConfig = {
        enableTelemetry: true,
        enableHardIdle: true,
        enableSoftIdle: true,
        userOptIn: true,
        cleanupPatterns: []
    };
    /**
     * Base class for main process telemetry services
     */
    var AbstractTelemetryService = (function () {
        function AbstractTelemetryService(config) {
            var _this = this;
            this.serviceId = telemetry_1.ITelemetryService;
            this.sessionId = 'SESSION_ID_NOT_SET';
            this.timeKeeper = new timer_1.TimeKeeper();
            this.toUnbind = [];
            this.appenders = [];
            this.timeKeeperListener = function (events) { return _this.onTelemetryTimerEventStop(events); };
            this.timeKeeper.addListener(this.timeKeeperListener);
            this.toUnbind.push(Errors.errorHandler.addListener(this.onErrorEvent.bind(this)));
            this.errorBuffer = Object.create(null);
            this.enableGlobalErrorHandler();
            this.errorFlushTimeout = -1;
            this.config = objects_1.withDefaults(config, DefaultTelemetryServiceConfig);
        }
        AbstractTelemetryService.prototype._safeStringify = function (data) {
            return objects_1.safeStringify(data);
        };
        AbstractTelemetryService.prototype.onTelemetryTimerEventStop = function (events) {
            for (var i = 0; i < events.length; i++) {
                var event_1 = events[i];
                var data = event_1.data || {};
                data.duration = event_1.timeTaken();
                this.publicLog(event_1.name, data);
            }
        };
        AbstractTelemetryService.prototype.onErrorEvent = function (e) {
            if (!e) {
                return;
            }
            var error = Object.create(null);
            // unwrap nested errors from loader
            if (e.detail && e.detail.stack) {
                e = e.detail;
            }
            // work around behavior in workerServer.ts that breaks up Error.stack
            var stack = Array.isArray(e.stack) ? e.stack.join('\n') : e.stack;
            var message = e.message ? e.message : this._safeStringify(e);
            // errors without a stack are not useful telemetry
            if (!stack) {
                return;
            }
            error['message'] = this.cleanupInfo(message);
            error['stack'] = this.cleanupInfo(stack);
            this.addErrortoBuffer(error);
        };
        AbstractTelemetryService.prototype.addErrortoBuffer = function (e) {
            if (this.errorBuffer[e.stack]) {
                this.errorBuffer[e.stack].count++;
            }
            else {
                e.count = 1;
                this.errorBuffer[e.stack] = e;
            }
            this.tryScheduleErrorFlush();
        };
        AbstractTelemetryService.prototype.tryScheduleErrorFlush = function () {
            var _this = this;
            if (this.errorFlushTimeout === -1) {
                this.errorFlushTimeout = setTimeout(function () { return _this.flushErrorBuffer(); }, AbstractTelemetryService.ERROR_FLUSH_TIMEOUT);
            }
        };
        AbstractTelemetryService.prototype.flushErrorBuffer = function () {
            if (this.errorBuffer) {
                for (var stack in this.errorBuffer) {
                    this.publicLog('UnhandledError', this.errorBuffer[stack]);
                }
            }
            this.errorBuffer = Object.create(null);
            this.errorFlushTimeout = -1;
        };
        AbstractTelemetryService.prototype.cleanupInfo = function (stack) {
            // `file:///DANGEROUS/PATH/resources/app/Useful/Information`
            var reg = /file:\/\/\/.*?\/resources\/app\//gi;
            stack = stack.replace(reg, '');
            // Any other file path that doesn't match the approved form above should be cleaned.
            reg = /file:\/\/\/.*/gi;
            stack = stack.replace(reg, '');
            // "Error: ENOENT; no such file or directory" is often followed with PII, clean it
            reg = /ENOENT: no such file or directory.*?\'([^\']+)\'/gi;
            stack = stack.replace(reg, 'ENOENT: no such file or directory');
            // sanitize with configured cleanup patterns
            for (var _i = 0, _a = this.config.cleanupPatterns; _i < _a.length; _i++) {
                var pattern = _a[_i];
                stack = stack.replace(pattern, '');
            }
            return stack;
        };
        AbstractTelemetryService.prototype.enableGlobalErrorHandler = function () {
            if (Types.isFunction(Platform.globals.onerror)) {
                this.oldOnError = Platform.globals.onerror;
            }
            var that = this;
            var newHandler = function (message, filename, line, column, e) {
                that.onUncaughtError(message, filename, line, column, e);
                if (that.oldOnError) {
                    that.oldOnError.apply(this, arguments);
                }
            };
            Platform.globals.onerror = newHandler;
        };
        AbstractTelemetryService.prototype.onUncaughtError = function (message, filename, line, column, e) {
            filename = this.cleanupInfo(filename);
            message = this.cleanupInfo(message);
            var data = {
                message: message,
                filename: filename,
                line: line,
                column: column
            };
            if (e) {
                data.error = {
                    name: e.name,
                    message: e.message
                };
                if (e.stack) {
                    if (Array.isArray(e.stack)) {
                        e.stack = e.stack.join('\n');
                    }
                    data.stack = this.cleanupInfo(e.stack);
                }
            }
            if (!data.stack) {
                data.stack = data.message;
            }
            this.addErrortoBuffer(data);
        };
        AbstractTelemetryService.prototype.loadTelemetryAppendersFromRegistery = function () {
            var appendersRegistry = platform_1.Registry.as(exports.Extenstions.TelemetryAppenders).getTelemetryAppenderDescriptors();
            for (var i = 0; i < appendersRegistry.length; i++) {
                var descriptor = appendersRegistry[i];
                var appender = this.instantiationService.createInstance(descriptor);
                this.addTelemetryAppender(appender);
            }
        };
        AbstractTelemetryService.prototype.getSessionId = function () {
            return this.sessionId;
        };
        AbstractTelemetryService.prototype.getMachineId = function () {
            return this.machineId;
        };
        AbstractTelemetryService.prototype.getInstanceId = function () {
            return this.instanceId;
        };
        AbstractTelemetryService.prototype.getTelemetryInfo = function () {
            return winjs_base_1.TPromise.as({
                instanceId: this.instanceId,
                sessionId: this.sessionId,
                machineId: this.machineId
            });
        };
        AbstractTelemetryService.prototype.dispose = function () {
            if (this.errorFlushTimeout !== -1) {
                clearTimeout(this.errorFlushTimeout);
                this.flushErrorBuffer();
            }
            while (this.toUnbind.length) {
                this.toUnbind.pop()();
            }
            this.timeKeeper.removeListener(this.timeKeeperListener);
            this.timeKeeper.dispose();
            for (var i = 0; i < this.appenders.length; i++) {
                this.appenders[i].dispose();
            }
        };
        AbstractTelemetryService.prototype.start = function (name, data) {
            var topic = 'public';
            var event = this.timeKeeper.start(topic, name);
            if (data) {
                event.data = data;
            }
            return event;
        };
        AbstractTelemetryService.prototype.publicLog = function (eventName, data) {
            this.handleEvent(eventName, data);
        };
        AbstractTelemetryService.prototype.getAppendersCount = function () {
            return this.appenders.length;
        };
        AbstractTelemetryService.prototype.getAppenders = function () {
            return this.appenders;
        };
        AbstractTelemetryService.prototype.addTelemetryAppender = function (appender) {
            this.appenders.push(appender);
        };
        AbstractTelemetryService.prototype.removeTelemetryAppender = function (appender) {
            var index = this.appenders.indexOf(appender);
            if (index > -1) {
                this.appenders.splice(index, 1);
            }
        };
        AbstractTelemetryService.prototype.setInstantiationService = function (instantiationService) {
            this.instantiationService = instantiationService;
            if (this.instantiationService) {
                this.loadTelemetryAppendersFromRegistery();
            }
        };
        AbstractTelemetryService.prototype.handleEvent = function (eventName, data) {
            throw new Error('Not implemented!');
        };
        AbstractTelemetryService.ERROR_FLUSH_TIMEOUT = 5 * 1000;
        return AbstractTelemetryService;
    }());
    exports.AbstractTelemetryService = AbstractTelemetryService;
    exports.Extenstions = {
        TelemetryAppenders: 'telemetry.appenders'
    };
    var TelemetryAppendersRegistry = (function () {
        function TelemetryAppendersRegistry() {
            this.telemetryAppenderDescriptors = [];
        }
        TelemetryAppendersRegistry.prototype.registerTelemetryAppenderDescriptor = function (descriptor) {
            this.telemetryAppenderDescriptors.push(descriptor);
        };
        TelemetryAppendersRegistry.prototype.getTelemetryAppenderDescriptors = function () {
            return this.telemetryAppenderDescriptors;
        };
        return TelemetryAppendersRegistry;
    }());
    platform_1.Registry.add(exports.Extenstions.TelemetryAppenders, new TelemetryAppendersRegistry());
});

define("vs/platform/thread/common/thread", ["require", "exports", 'vs/platform/instantiation/common/instantiation'], function (require, exports, instantiation) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // --- thread service (web workers)
    exports.IThreadService = instantiation.createDecorator('threadService');
    var IRemotableCtorMap = (function () {
        function IRemotableCtorMap() {
        }
        return IRemotableCtorMap;
    }());
    exports.IRemotableCtorMap = IRemotableCtorMap;
    var IRemotableCtorAffinityMap = (function () {
        function IRemotableCtorAffinityMap() {
        }
        return IRemotableCtorAffinityMap;
    }());
    exports.IRemotableCtorAffinityMap = IRemotableCtorAffinityMap;
    var Remotable = (function () {
        function Remotable() {
        }
        Remotable.getId = function (ctor) {
            return (ctor[Remotable.PROP_NAME] || null);
        };
        Remotable.MainContext = function (identifier) {
            return function (target) {
                Remotable._ensureUnique(identifier);
                Remotable.Registry.MainContext[identifier] = target;
                target[Remotable.PROP_NAME] = identifier;
            };
        };
        Remotable.ExtHostContext = function (identifier) {
            return function (target) {
                Remotable._ensureUnique(identifier);
                Remotable.Registry.ExtHostContext[identifier] = target;
                target[Remotable.PROP_NAME] = identifier;
            };
        };
        Remotable.WorkerContext = function (identifier, whichWorker) {
            return function (target) {
                Remotable._ensureUnique(identifier);
                Remotable.Registry.WorkerContext[identifier] = {
                    ctor: target,
                    affinity: whichWorker
                };
                target[Remotable.PROP_NAME] = identifier;
            };
        };
        Remotable._ensureUnique = function (identifier) {
            if (Remotable.Registry.MainContext[identifier] || Remotable.Registry.ExtHostContext[identifier] || Remotable.Registry.WorkerContext[identifier]) {
                throw new Error('Duplicate Remotable identifier found');
            }
        };
        Remotable.PROP_NAME = '$__REMOTABLE_ID';
        Remotable.Registry = {
            MainContext: Object.create(null),
            ExtHostContext: Object.create(null),
            WorkerContext: Object.create(null),
        };
        return Remotable;
    }());
    exports.Remotable = Remotable;
    (function (ThreadAffinity) {
        ThreadAffinity[ThreadAffinity["None"] = 0] = "None";
        ThreadAffinity[ThreadAffinity["Group1"] = 1] = "Group1";
        ThreadAffinity[ThreadAffinity["Group2"] = 2] = "Group2";
        ThreadAffinity[ThreadAffinity["Group3"] = 3] = "Group3";
        ThreadAffinity[ThreadAffinity["Group4"] = 4] = "Group4";
        ThreadAffinity[ThreadAffinity["Group5"] = 5] = "Group5";
        ThreadAffinity[ThreadAffinity["Group6"] = 6] = "Group6";
        ThreadAffinity[ThreadAffinity["Group7"] = 7] = "Group7";
        ThreadAffinity[ThreadAffinity["Group8"] = 8] = "Group8";
        ThreadAffinity[ThreadAffinity["Group9"] = 9] = "Group9";
        ThreadAffinity[ThreadAffinity["All"] = 10] = "All";
    })(exports.ThreadAffinity || (exports.ThreadAffinity = {}));
    var ThreadAffinity = exports.ThreadAffinity;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define("vs/editor/common/services/modeServiceImpl", ["require", "exports", 'vs/nls!vs/editor/common/services/modeServiceImpl', 'vs/base/common/errors', 'vs/base/common/event', 'vs/base/common/lifecycle', 'vs/base/common/objects', 'vs/base/common/paths', 'vs/base/common/winjs.base', 'vs/base/common/mime', 'vs/platform/instantiation/common/descriptors', 'vs/platform/extensions/common/extensionsRegistry', 'vs/platform/thread/common/thread', 'vs/editor/common/modes/abstractMode', 'vs/editor/common/modes/modesRegistry', 'vs/editor/common/modes/monarch/monarchCompile', 'vs/editor/common/modes/monarch/monarchDefinition', 'vs/editor/common/modes/monarch/monarchLexer', 'vs/editor/common/modes/supports/declarationSupport', 'vs/editor/common/modes/supports/parameterHintsSupport', 'vs/editor/common/modes/supports/referenceSupport', 'vs/editor/common/modes/supports/richEditSupport', 'vs/editor/common/modes/supports/suggestSupport', 'vs/editor/common/services/languagesRegistry', 'vs/editor/common/services/modeService', 'vs/platform/configuration/common/configuration'], function (require, exports, nls, errors_1, event_1, lifecycle_1, objects, paths, winjs_base_1, mime, descriptors_1, extensionsRegistry_1, thread_1, abstractMode_1, modesRegistry_1, monarchCompile_1, monarchDefinition_1, monarchLexer_1, declarationSupport_1, parameterHintsSupport_1, referenceSupport_1, richEditSupport_1, suggestSupport_1, languagesRegistry_1, modeService_1, configuration_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var languagesExtPoint = extensionsRegistry_1.ExtensionsRegistry.registerExtensionPoint('languages', {
        description: nls.localize(0, null),
        type: 'array',
        defaultSnippets: [{ body: [{ id: '', aliases: [], extensions: [] }] }],
        items: {
            type: 'object',
            defaultSnippets: [{ body: { id: '', extensions: [] } }],
            properties: {
                id: {
                    description: nls.localize(1, null),
                    type: 'string'
                },
                aliases: {
                    description: nls.localize(2, null),
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                extensions: {
                    description: nls.localize(3, null),
                    default: ['.foo'],
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                filenames: {
                    description: nls.localize(4, null),
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                filenamePatterns: {
                    description: nls.localize(5, null),
                    default: ['bar*foo.txt'],
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                mimetypes: {
                    description: nls.localize(6, null),
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                firstLine: {
                    description: nls.localize(7, null),
                    type: 'string'
                },
                configuration: {
                    description: nls.localize(8, null),
                    type: 'string'
                }
            }
        }
    });
    function isUndefinedOrStringArray(value) {
        if (typeof value === 'undefined') {
            return true;
        }
        if (!Array.isArray(value)) {
            return false;
        }
        return value.every(function (item) { return typeof item === 'string'; });
    }
    function isValidLanguageExtensionPoint(value, collector) {
        if (!value) {
            collector.error(nls.localize(9, null, languagesExtPoint.name));
            return false;
        }
        if (typeof value.id !== 'string') {
            collector.error(nls.localize(10, null, 'id'));
            return false;
        }
        if (!isUndefinedOrStringArray(value.extensions)) {
            collector.error(nls.localize(11, null, 'extensions'));
            return false;
        }
        if (!isUndefinedOrStringArray(value.filenames)) {
            collector.error(nls.localize(12, null, 'filenames'));
            return false;
        }
        if (typeof value.firstLine !== 'undefined' && typeof value.firstLine !== 'string') {
            collector.error(nls.localize(13, null, 'firstLine'));
            return false;
        }
        if (typeof value.configuration !== 'undefined' && typeof value.configuration !== 'string') {
            collector.error(nls.localize(14, null, 'configuration'));
            return false;
        }
        if (!isUndefinedOrStringArray(value.aliases)) {
            collector.error(nls.localize(15, null, 'aliases'));
            return false;
        }
        if (!isUndefinedOrStringArray(value.mimetypes)) {
            collector.error(nls.localize(16, null, 'mimetypes'));
            return false;
        }
        return true;
    }
    var ModeServiceImpl = (function () {
        function ModeServiceImpl(threadService, extensionService) {
            var _this = this;
            this.serviceId = modeService_1.IModeService;
            this._onDidAddModes = new event_1.Emitter();
            this.onDidAddModes = this._onDidAddModes.event;
            this._onDidCreateMode = new event_1.Emitter();
            this.onDidCreateMode = this._onDidCreateMode.event;
            this._threadService = threadService;
            this._extensionService = extensionService;
            this._activationPromises = {};
            this._instantiatedModes = {};
            this._config = {};
            this._registry = new languagesRegistry_1.LanguagesRegistry();
            this._registry.onDidAddModes(function (modes) { return _this._onDidAddModes.fire(modes); });
        }
        ModeServiceImpl.prototype.getConfigurationForMode = function (modeId) {
            return this._config[modeId] || {};
        };
        ModeServiceImpl.prototype.configureMode = function (mimetype, options) {
            var modeId = this.getModeId(mimetype);
            if (modeId) {
                this.configureModeById(modeId, options);
            }
        };
        ModeServiceImpl.prototype.configureModeById = function (modeId, options) {
            var previousOptions = this._config[modeId] || {};
            var newOptions = objects.mixin(objects.clone(previousOptions), options);
            if (objects.equals(previousOptions, newOptions)) {
                // This configure call is a no-op
                return;
            }
            this._config[modeId] = newOptions;
            var mode = this.getMode(modeId);
            if (mode && mode.configSupport) {
                mode.configSupport.configure(this.getConfigurationForMode(modeId));
            }
        };
        ModeServiceImpl.prototype.configureAllModes = function (config) {
            var _this = this;
            if (!config) {
                return;
            }
            var modes = this._registry.getRegisteredModes();
            modes.forEach(function (modeIdentifier) {
                var configuration = config[modeIdentifier];
                _this.configureModeById(modeIdentifier, configuration);
            });
        };
        ModeServiceImpl.prototype.isRegisteredMode = function (mimetypeOrModeId) {
            return this._registry.isRegisteredMode(mimetypeOrModeId);
        };
        ModeServiceImpl.prototype.isCompatMode = function (modeId) {
            var compatModeData = this._registry.getCompatMode(modeId);
            return (compatModeData ? true : false);
        };
        ModeServiceImpl.prototype.getRegisteredModes = function () {
            return this._registry.getRegisteredModes();
        };
        ModeServiceImpl.prototype.getRegisteredLanguageNames = function () {
            return this._registry.getRegisteredLanguageNames();
        };
        ModeServiceImpl.prototype.getExtensions = function (alias) {
            return this._registry.getExtensions(alias);
        };
        ModeServiceImpl.prototype.getMimeForMode = function (modeId) {
            return this._registry.getMimeForMode(modeId);
        };
        ModeServiceImpl.prototype.getLanguageName = function (modeId) {
            return this._registry.getLanguageName(modeId);
        };
        ModeServiceImpl.prototype.getModeIdForLanguageName = function (alias) {
            return this._registry.getModeIdForLanguageNameLowercase(alias);
        };
        ModeServiceImpl.prototype.getModeId = function (commaSeparatedMimetypesOrCommaSeparatedIds) {
            var modeIds = this._registry.extractModeIds(commaSeparatedMimetypesOrCommaSeparatedIds);
            if (modeIds.length > 0) {
                return modeIds[0];
            }
            return null;
        };
        ModeServiceImpl.prototype.getConfigurationFiles = function (modeId) {
            return this._registry.getConfigurationFiles(modeId);
        };
        // --- instantiation
        ModeServiceImpl.prototype.lookup = function (commaSeparatedMimetypesOrCommaSeparatedIds) {
            var r = [];
            var modeIds = this._registry.extractModeIds(commaSeparatedMimetypesOrCommaSeparatedIds);
            for (var i = 0; i < modeIds.length; i++) {
                var modeId = modeIds[i];
                r.push({
                    modeId: modeId,
                    isInstantiated: this._instantiatedModes.hasOwnProperty(modeId)
                });
            }
            return r;
        };
        ModeServiceImpl.prototype.getMode = function (commaSeparatedMimetypesOrCommaSeparatedIds) {
            var modeIds = this._registry.extractModeIds(commaSeparatedMimetypesOrCommaSeparatedIds);
            var isPlainText = false;
            for (var i = 0; i < modeIds.length; i++) {
                if (this._instantiatedModes.hasOwnProperty(modeIds[i])) {
                    return this._instantiatedModes[modeIds[i]];
                }
                isPlainText = isPlainText || (modeIds[i] === 'plaintext');
            }
            if (isPlainText) {
                // Try to do it synchronously
                var r = null;
                this.getOrCreateMode(commaSeparatedMimetypesOrCommaSeparatedIds).then(function (mode) {
                    r = mode;
                }).done(null, errors_1.onUnexpectedError);
                return r;
            }
        };
        ModeServiceImpl.prototype.getModeIdByLanguageName = function (languageName) {
            var modeIds = this._registry.getModeIdsFromLanguageName(languageName);
            if (modeIds.length > 0) {
                return modeIds[0];
            }
            return null;
        };
        ModeServiceImpl.prototype.getModeIdByFilenameOrFirstLine = function (filename, firstLine) {
            var modeIds = this._registry.getModeIdsFromFilenameOrFirstLine(filename, firstLine);
            if (modeIds.length > 0) {
                return modeIds[0];
            }
            return null;
        };
        ModeServiceImpl.prototype.onReady = function () {
            return this._extensionService.onReady();
        };
        ModeServiceImpl.prototype.getOrCreateMode = function (commaSeparatedMimetypesOrCommaSeparatedIds) {
            var _this = this;
            return this.onReady().then(function () {
                var modeId = _this.getModeId(commaSeparatedMimetypesOrCommaSeparatedIds);
                // Fall back to plain text if no mode was found
                return _this._getOrCreateMode(modeId || 'plaintext');
            });
        };
        ModeServiceImpl.prototype.getOrCreateModeByLanguageName = function (languageName) {
            var _this = this;
            return this.onReady().then(function () {
                var modeId = _this.getModeIdByLanguageName(languageName);
                // Fall back to plain text if no mode was found
                return _this._getOrCreateMode(modeId || 'plaintext');
            });
        };
        ModeServiceImpl.prototype.getOrCreateModeByFilenameOrFirstLine = function (filename, firstLine) {
            var _this = this;
            return this.onReady().then(function () {
                var modeId = _this.getModeIdByFilenameOrFirstLine(filename, firstLine);
                // Fall back to plain text if no mode was found
                return _this._getOrCreateMode(modeId || 'plaintext');
            });
        };
        ModeServiceImpl.prototype._getOrCreateMode = function (modeId) {
            var _this = this;
            if (this._instantiatedModes.hasOwnProperty(modeId)) {
                return winjs_base_1.TPromise.as(this._instantiatedModes[modeId]);
            }
            if (this._activationPromises.hasOwnProperty(modeId)) {
                return this._activationPromises[modeId];
            }
            var c, e;
            var promise = new winjs_base_1.TPromise(function (cc, ee, pp) { c = cc; e = ee; });
            this._activationPromises[modeId] = promise;
            this._createMode(modeId).then(function (mode) {
                _this._instantiatedModes[modeId] = mode;
                delete _this._activationPromises[modeId];
                _this._onDidCreateMode.fire(mode);
                _this._extensionService.activateByEvent("onLanguage:" + modeId).done(null, errors_1.onUnexpectedError);
                return _this._instantiatedModes[modeId];
            }).then(c, e);
            return promise;
        };
        ModeServiceImpl.prototype._createMode = function (modeId) {
            var _this = this;
            var modeDescriptor = this._createModeDescriptor(modeId);
            var compatModeData = this._registry.getCompatMode(modeId);
            if (compatModeData) {
                // This is a compatibility mode
                var compatModeAsyncDescriptor = descriptors_1.createAsyncDescriptor1(compatModeData.moduleId, compatModeData.ctorName);
                return this._threadService.createInstance(compatModeAsyncDescriptor, modeDescriptor).then(function (compatMode) {
                    if (compatMode.configSupport) {
                        compatMode.configSupport.configure(_this.getConfigurationForMode(modeId));
                    }
                    return compatMode;
                });
            }
            return winjs_base_1.TPromise.as(this._threadService.createInstance(abstractMode_1.FrankensteinMode, modeDescriptor));
        };
        ModeServiceImpl.prototype._createModeDescriptor = function (modeId) {
            var workerParticipants = modesRegistry_1.ModesRegistry.getWorkerParticipantsForMode(modeId);
            return {
                id: modeId,
                workerParticipants: workerParticipants.map(function (p) { return descriptors_1.createAsyncDescriptor0(p.moduleId, p.ctorName); })
            };
        };
        ModeServiceImpl.prototype._registerModeSupport = function (mode, support, callback) {
            if (mode.registerSupport) {
                return mode.registerSupport(support, callback);
            }
            else {
                console.warn('Cannot register support ' + support + ' on mode ' + mode.getId() + ' because it does not support it.');
                return lifecycle_1.empty;
            }
        };
        ModeServiceImpl.prototype.registerModeSupport = function (modeId, support, callback) {
            var _this = this;
            if (this._instantiatedModes.hasOwnProperty(modeId)) {
                return this._registerModeSupport(this._instantiatedModes[modeId], support, callback);
            }
            var cc;
            var promise = new winjs_base_1.TPromise(function (c, e) { cc = c; });
            var disposable = this.onDidCreateMode(function (mode) {
                if (mode.getId() !== modeId) {
                    return;
                }
                cc(_this._registerModeSupport(mode, support, callback));
                disposable.dispose();
            });
            return {
                dispose: function () {
                    promise.done(function (disposable) { return disposable.dispose(); }, null);
                }
            };
        };
        ModeServiceImpl.prototype.doRegisterMonarchDefinition = function (modeId, lexer) {
            var _this = this;
            return lifecycle_1.combinedDispose(this.registerTokenizationSupport(modeId, function (mode) {
                return monarchLexer_1.createTokenizationSupport(_this, mode, lexer);
            }), this.registerRichEditSupport(modeId, monarchDefinition_1.createRichEditSupport(lexer)));
        };
        ModeServiceImpl.prototype.registerMonarchDefinition = function (modelService, editorWorkerService, modeId, language) {
            var lexer = monarchCompile_1.compile(objects.clone(language));
            return this.doRegisterMonarchDefinition(modeId, lexer);
        };
        ModeServiceImpl.prototype.registerCodeLensSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'codeLensSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerRichEditSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'richEditSupport', function (mode) { return new richEditSupport_1.RichEditSupport(modeId, mode.richEditSupport, support); });
        };
        ModeServiceImpl.prototype.registerDeclarativeDeclarationSupport = function (modeId, contribution) {
            return this.registerModeSupport(modeId, 'declarationSupport', function (mode) { return new declarationSupport_1.DeclarationSupport(modeId, contribution); });
        };
        ModeServiceImpl.prototype.registerExtraInfoSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'extraInfoSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerFormattingSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'formattingSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerInplaceReplaceSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'inplaceReplaceSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerOccurrencesSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'occurrencesSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerOutlineSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'outlineSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerDeclarativeParameterHintsSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'parameterHintsSupport', function (mode) { return new parameterHintsSupport_1.ParameterHintsSupport(modeId, support); });
        };
        ModeServiceImpl.prototype.registerQuickFixSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'quickFixSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerDeclarativeReferenceSupport = function (modeId, contribution) {
            return this.registerModeSupport(modeId, 'referenceSupport', function (mode) { return new referenceSupport_1.ReferenceSupport(modeId, contribution); });
        };
        ModeServiceImpl.prototype.registerRenameSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'renameSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerDeclarativeSuggestSupport = function (modeId, declaration) {
            return this.registerModeSupport(modeId, 'suggestSupport', function (mode) { return new suggestSupport_1.SuggestSupport(modeId, declaration); });
        };
        ModeServiceImpl.prototype.registerTokenizationSupport = function (modeId, callback) {
            return this.registerModeSupport(modeId, 'tokenizationSupport', callback);
        };
        return ModeServiceImpl;
    }());
    exports.ModeServiceImpl = ModeServiceImpl;
    var MainThreadModeServiceImpl = (function (_super) {
        __extends(MainThreadModeServiceImpl, _super);
        function MainThreadModeServiceImpl(threadService, extensionService, configurationService) {
            var _this = this;
            _super.call(this, threadService, extensionService);
            this._configurationService = configurationService;
            this._hasInitialized = false;
            languagesExtPoint.setHandler(function (extensions) {
                var allValidLanguages = [];
                for (var i = 0, len = extensions.length; i < len; i++) {
                    var extension = extensions[i];
                    if (!Array.isArray(extension.value)) {
                        extension.collector.error(nls.localize(17, null, languagesExtPoint.name));
                        continue;
                    }
                    for (var j = 0, lenJ = extension.value.length; j < lenJ; j++) {
                        var ext = extension.value[j];
                        if (isValidLanguageExtensionPoint(ext, extension.collector)) {
                            var configuration = (ext.configuration ? paths.join(extension.description.extensionFolderPath, ext.configuration) : ext.configuration);
                            allValidLanguages.push({
                                id: ext.id,
                                extensions: ext.extensions,
                                filenames: ext.filenames,
                                filenamePatterns: ext.filenamePatterns,
                                firstLine: ext.firstLine,
                                aliases: ext.aliases,
                                mimetypes: ext.mimetypes,
                                configuration: configuration
                            });
                        }
                    }
                }
                modesRegistry_1.ModesRegistry.registerLanguages(allValidLanguages);
            });
            this._configurationService.addListener(configuration_1.ConfigurationServiceEventTypes.UPDATED, function (e) { return _this.onConfigurationChange(e.config); });
        }
        MainThreadModeServiceImpl.prototype.onReady = function () {
            var _this = this;
            if (!this._onReadyPromise) {
                this._onReadyPromise = this._configurationService.loadConfiguration().then(function (configuration) {
                    return _this._extensionService.onReady().then(function () {
                        _this.onConfigurationChange(configuration);
                        return true;
                    });
                });
            }
            return this._onReadyPromise;
        };
        MainThreadModeServiceImpl.prototype.onConfigurationChange = function (configuration) {
            var _this = this;
            // Clear user configured mime associations
            mime.clearTextMimes(true /* user configured */);
            // Register based on settings
            if (configuration.files && configuration.files.associations) {
                Object.keys(configuration.files.associations).forEach(function (pattern) {
                    mime.registerTextMime({ mime: _this.getMimeForMode(configuration.files.associations[pattern]), filepattern: pattern, userConfigured: true });
                });
            }
        };
        MainThreadModeServiceImpl.prototype._getModeServiceWorkerHelper = function () {
            var r = this._threadService.getRemotable(ModeServiceWorkerHelper);
            if (!this._hasInitialized) {
                this._hasInitialized = true;
                var initData = {
                    compatModes: modesRegistry_1.ModesRegistry.getCompatModes(),
                    languages: modesRegistry_1.ModesRegistry.getLanguages(),
                    workerParticipants: modesRegistry_1.ModesRegistry.getWorkerParticipants()
                };
                r._initialize(initData);
                modesRegistry_1.ModesRegistry.onDidAddCompatModes(function (m) { return r._acceptCompatModes(m); });
                modesRegistry_1.ModesRegistry.onDidAddLanguages(function (m) { return r._acceptLanguages(m); });
            }
            return r;
        };
        MainThreadModeServiceImpl.prototype.configureModeById = function (modeId, options) {
            this._getModeServiceWorkerHelper().configureModeById(modeId, options);
            _super.prototype.configureModeById.call(this, modeId, options);
        };
        MainThreadModeServiceImpl.prototype._createMode = function (modeId) {
            // Instantiate mode also in worker
            this._getModeServiceWorkerHelper().instantiateMode(modeId);
            return _super.prototype._createMode.call(this, modeId);
        };
        MainThreadModeServiceImpl.prototype.registerMonarchDefinition = function (modelService, editorWorkerService, modeId, language) {
            this._getModeServiceWorkerHelper().registerMonarchDefinition(modeId, language);
            var lexer = monarchCompile_1.compile(objects.clone(language));
            return lifecycle_1.combinedDispose(_super.prototype.doRegisterMonarchDefinition.call(this, modeId, lexer), this.registerModeSupport(modeId, 'suggestSupport', function (mode) {
                return monarchDefinition_1.createSuggestSupport(modelService, editorWorkerService, modeId, lexer);
            }));
        };
        return MainThreadModeServiceImpl;
    }(ModeServiceImpl));
    exports.MainThreadModeServiceImpl = MainThreadModeServiceImpl;
    var ModeServiceWorkerHelper = (function () {
        function ModeServiceWorkerHelper(modeService) {
            this._modeService = modeService;
        }
        ModeServiceWorkerHelper.prototype._initialize = function (initData) {
            modesRegistry_1.ModesRegistry.registerCompatModes(initData.compatModes);
            modesRegistry_1.ModesRegistry.registerLanguages(initData.languages);
            modesRegistry_1.ModesRegistry.registerWorkerParticipants(initData.workerParticipants);
        };
        ModeServiceWorkerHelper.prototype._acceptCompatModes = function (modes) {
            modesRegistry_1.ModesRegistry.registerCompatModes(modes);
        };
        ModeServiceWorkerHelper.prototype._acceptLanguages = function (languages) {
            modesRegistry_1.ModesRegistry.registerLanguages(languages);
        };
        ModeServiceWorkerHelper.prototype.instantiateMode = function (modeId) {
            this._modeService.getOrCreateMode(modeId).done(null, errors_1.onUnexpectedError);
        };
        ModeServiceWorkerHelper.prototype.configureModeById = function (modeId, options) {
            this._modeService.configureMode(modeId, options);
        };
        ModeServiceWorkerHelper.prototype.registerMonarchDefinition = function (modeId, language) {
            this._modeService.registerMonarchDefinition(null, null, modeId, language);
        };
        ModeServiceWorkerHelper = __decorate([
            thread_1.Remotable.WorkerContext('ModeServiceWorkerHelper', thread_1.ThreadAffinity.All),
            __param(0, modeService_1.IModeService)
        ], ModeServiceWorkerHelper);
        return ModeServiceWorkerHelper;
    }());
    exports.ModeServiceWorkerHelper = ModeServiceWorkerHelper;
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
define("vs/editor/common/services/modelServiceImpl", ["require", "exports", 'vs/nls!vs/editor/common/services/modelServiceImpl', 'vs/base/common/errors', 'vs/base/common/event', 'vs/base/common/severity', 'vs/base/common/uri', 'vs/platform/telemetry/common/telemetry', 'vs/platform/thread/common/thread', 'vs/editor/common/core/range', 'vs/editor/common/editorCommon', 'vs/editor/common/model/mirrorModel', 'vs/editor/common/model/model', 'vs/editor/common/services/modeService', 'vs/editor/common/services/modelService', 'vs/editor/common/services/resourceService', 'vs/base/common/platform', 'vs/platform/configuration/common/configuration', 'vs/editor/common/config/defaultConfig'], function (require, exports, nls, errors_1, event_1, severity_1, uri_1, telemetry_1, thread_1, range_1, editorCommon, mirrorModel_1, model_1, modeService_1, modelService_1, resourceService_1, platform, configuration_1, defaultConfig_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function MODEL_ID(resource) {
        return resource.toString();
    }
    var ModelData = (function () {
        function ModelData(model, eventsHandler) {
            var _this = this;
            this.model = model;
            this.isSyncedToWorkers = false;
            this._markerDecorations = [];
            this._modelEventsListener = model.addBulkListener2(function (events) { return eventsHandler(_this, events); });
        }
        ModelData.prototype.dispose = function () {
            this._markerDecorations = this.model.deltaDecorations(this._markerDecorations, []);
            this._modelEventsListener.dispose();
            this._modelEventsListener = null;
            this.model = null;
        };
        ModelData.prototype.getModelId = function () {
            return MODEL_ID(this.model.getAssociatedResource());
        };
        ModelData.prototype.acceptMarkerDecorations = function (newDecorations) {
            this._markerDecorations = this.model.deltaDecorations(this._markerDecorations, newDecorations);
        };
        return ModelData;
    }());
    var ModelMarkerHandler = (function () {
        function ModelMarkerHandler() {
        }
        ModelMarkerHandler.setMarkers = function (modelData, markers) {
            var _this = this;
            // Limit to the first 500 errors/warnings
            markers = markers.slice(0, 500);
            var newModelDecorations = markers.map(function (marker) {
                return {
                    range: _this._createDecorationRange(modelData.model, marker),
                    options: _this._createDecorationOption(marker)
                };
            });
            modelData.acceptMarkerDecorations(newModelDecorations);
        };
        ModelMarkerHandler._createDecorationRange = function (model, rawMarker) {
            var marker = model.validateRange(new range_1.Range(rawMarker.startLineNumber, rawMarker.startColumn, rawMarker.endLineNumber, rawMarker.endColumn));
            var ret = new range_1.Range(marker.startLineNumber, marker.startColumn, marker.endLineNumber, marker.endColumn);
            if (ret.isEmpty()) {
                var word = model.getWordAtPosition(ret.getStartPosition());
                if (word) {
                    ret.startColumn = word.startColumn;
                    ret.endColumn = word.endColumn;
                }
                else {
                    var maxColumn = model.getLineLastNonWhitespaceColumn(marker.startLineNumber) ||
                        model.getLineMaxColumn(marker.startLineNumber);
                    if (maxColumn === 1) {
                    }
                    else if (ret.endColumn >= maxColumn) {
                        // behind eol
                        ret.endColumn = maxColumn;
                        ret.startColumn = maxColumn - 1;
                    }
                    else {
                        // extend marker to width = 1
                        ret.endColumn += 1;
                    }
                }
            }
            else if (rawMarker.endColumn === Number.MAX_VALUE && rawMarker.startColumn === 1 && ret.startLineNumber === ret.endLineNumber) {
                var minColumn = model.getLineFirstNonWhitespaceColumn(rawMarker.startLineNumber);
                if (minColumn < ret.endColumn) {
                    ret.startColumn = minColumn;
                    rawMarker.startColumn = minColumn;
                }
            }
            return ret;
        };
        ModelMarkerHandler._createDecorationOption = function (marker) {
            var className;
            var color;
            var darkColor;
            var htmlMessage = null;
            switch (marker.severity) {
                case severity_1.default.Ignore:
                    // do something
                    break;
                case severity_1.default.Warning:
                case severity_1.default.Info:
                    className = editorCommon.ClassName.EditorWarningDecoration;
                    color = 'rgba(18,136,18,0.7)';
                    darkColor = 'rgba(18,136,18,0.7)';
                    break;
                case severity_1.default.Error:
                default:
                    className = editorCommon.ClassName.EditorErrorDecoration;
                    color = 'rgba(255,18,18,0.7)';
                    darkColor = 'rgba(255,18,18,0.7)';
                    break;
            }
            if (typeof marker.message === 'string') {
                htmlMessage = [{ isText: true, text: marker.message }];
            }
            else if (Array.isArray(marker.message)) {
                htmlMessage = marker.message;
            }
            else if (marker.message) {
                htmlMessage = [marker.message];
            }
            if (marker.source) {
                htmlMessage.unshift({ isText: true, text: "[" + marker.source + "] " });
            }
            return {
                stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                className: className,
                htmlMessage: htmlMessage,
                overviewRuler: {
                    color: color,
                    darkColor: darkColor,
                    position: editorCommon.OverviewRulerLane.Right
                }
            };
        };
        return ModelMarkerHandler;
    }());
    var ModelServiceImpl = (function () {
        function ModelServiceImpl(threadService, markerService, modeService, configurationService, messageService) {
            var _this = this;
            this.serviceId = modelService_1.IModelService;
            this._modelCreationOptions = {
                tabSize: defaultConfig_1.DEFAULT_INDENTATION.tabSize,
                insertSpaces: defaultConfig_1.DEFAULT_INDENTATION.insertSpaces,
                detectIndentation: defaultConfig_1.DEFAULT_INDENTATION.detectIndentation,
                defaultEOL: (platform.isLinux || platform.isMacintosh) ? editorCommon.DefaultEndOfLine.LF : editorCommon.DefaultEndOfLine.CRLF
            };
            this._threadService = threadService;
            this._markerService = markerService;
            this._modeService = modeService;
            this._workerHelper = this._threadService.getRemotable(ModelServiceWorkerHelper);
            this._configurationService = configurationService;
            this._messageService = messageService;
            this._hasShownMigrationMessage = false;
            var readConfig = function (config) {
                var eol = config.files && config.files.eol;
                var shouldShowMigrationMessage = false;
                var tabSize = defaultConfig_1.DEFAULT_INDENTATION.tabSize;
                if (config.editor && typeof config.editor.tabSize !== 'undefined') {
                    var parsedTabSize = parseInt(config.editor.tabSize, 10);
                    if (!isNaN(parsedTabSize)) {
                        tabSize = parsedTabSize;
                    }
                    shouldShowMigrationMessage = shouldShowMigrationMessage || (config.editor.tabSize === 'auto');
                }
                var insertSpaces = defaultConfig_1.DEFAULT_INDENTATION.insertSpaces;
                if (config.editor && typeof config.editor.insertSpaces !== 'undefined') {
                    insertSpaces = (config.editor.insertSpaces === 'false' ? false : Boolean(config.editor.insertSpaces));
                    shouldShowMigrationMessage = shouldShowMigrationMessage || (config.editor.insertSpaces === 'auto');
                }
                var newDefaultEOL = _this._modelCreationOptions.defaultEOL;
                if (eol === '\r\n') {
                    newDefaultEOL = editorCommon.DefaultEndOfLine.CRLF;
                }
                else if (eol === '\n') {
                    newDefaultEOL = editorCommon.DefaultEndOfLine.LF;
                }
                var detectIndentation = defaultConfig_1.DEFAULT_INDENTATION.detectIndentation;
                if (config.editor && typeof config.editor.detectIndentation !== 'undefined') {
                    detectIndentation = (config.editor.detectIndentation === 'false' ? false : Boolean(config.editor.detectIndentation));
                }
                _this._setModelOptions({
                    tabSize: tabSize,
                    insertSpaces: insertSpaces,
                    detectIndentation: detectIndentation,
                    defaultEOL: newDefaultEOL
                });
                if (shouldShowMigrationMessage && !_this._hasShownMigrationMessage) {
                    _this._hasShownMigrationMessage = true;
                    _this._messageService.show(severity_1.default.Info, nls.localize(0, null));
                }
            };
            this._configurationServiceSubscription = this._configurationService.addListener2(configuration_1.ConfigurationServiceEventTypes.UPDATED, function (e) {
                readConfig(e.config);
            });
            this._configurationService.loadConfiguration().then(function (config) {
                readConfig(config);
            });
            this._models = {};
            this._onModelAdded = new event_1.Emitter();
            this._onModelRemoved = new event_1.Emitter();
            this._onModelModeChanged = new event_1.Emitter();
            if (this._markerService) {
                this._markerServiceSubscription = this._markerService.onMarkerChanged(this._handleMarkerChange, this);
            }
        }
        ModelServiceImpl.prototype.getCreationOptions = function () {
            return this._modelCreationOptions;
        };
        ModelServiceImpl.prototype._setModelOptions = function (newOpts) {
            if ((this._modelCreationOptions.detectIndentation === newOpts.detectIndentation)
                && (this._modelCreationOptions.insertSpaces === newOpts.insertSpaces)
                && (this._modelCreationOptions.tabSize === newOpts.tabSize)) {
                // Same indent opts, no need to touch created models
                this._modelCreationOptions = newOpts;
                return;
            }
            this._modelCreationOptions = newOpts;
            // Update options on all models
            for (var modelId in this._models) {
                if (this._models.hasOwnProperty(modelId)) {
                    var modelData = this._models[modelId];
                    if (this._modelCreationOptions.detectIndentation) {
                        modelData.model.detectIndentation(this._modelCreationOptions.insertSpaces, this._modelCreationOptions.tabSize);
                    }
                    else {
                        modelData.model.updateOptions({
                            insertSpaces: this._modelCreationOptions.insertSpaces,
                            tabSize: this._modelCreationOptions.tabSize
                        });
                    }
                }
            }
        };
        ModelServiceImpl.prototype.dispose = function () {
            if (this._markerServiceSubscription) {
                this._markerServiceSubscription.dispose();
            }
            this._configurationServiceSubscription.dispose();
        };
        ModelServiceImpl.prototype._handleMarkerChange = function (changedResources) {
            var _this = this;
            changedResources.forEach(function (resource) {
                var modelId = MODEL_ID(resource);
                var modelData = _this._models[modelId];
                if (!modelData) {
                    return;
                }
                ModelMarkerHandler.setMarkers(modelData, _this._markerService.read({ resource: resource, take: 500 }));
            });
        };
        // --- begin IModelService
        ModelServiceImpl.prototype._shouldSyncModelToWorkers = function (model) {
            if (model.isTooLargeForHavingARichMode()) {
                return false;
            }
            // Only sync models with compat modes to the workers
            return this._modeService.isCompatMode(model.getMode().getId());
        };
        ModelServiceImpl.prototype._createModelData = function (value, modeOrPromise, resource) {
            var _this = this;
            // create & save the model
            var model = new model_1.Model(value, this._modelCreationOptions, modeOrPromise, resource);
            var modelId = MODEL_ID(model.getAssociatedResource());
            if (this._models[modelId]) {
                // There already exists a model with this id => this is a programmer error
                throw new Error('ModelService: Cannot add model ' + telemetry_1.anonymize(modelId) + ' because it already exists!');
            }
            var modelData = new ModelData(model, function (modelData, events) { return _this._onModelEvents(modelData, events); });
            this._models[modelId] = modelData;
            return modelData;
        };
        ModelServiceImpl.prototype.createModel = function (value, modeOrPromise, resource) {
            var modelData = this._createModelData(value, modeOrPromise, resource);
            // handle markers (marker service => model)
            if (this._markerService) {
                ModelMarkerHandler.setMarkers(modelData, this._markerService.read({ resource: modelData.model.getAssociatedResource() }));
            }
            if (this._shouldSyncModelToWorkers(modelData.model)) {
                // send this model to the workers
                this._beginWorkerSync(modelData);
            }
            this._onModelAdded.fire(modelData.model);
            return modelData.model;
        };
        ModelServiceImpl.prototype.destroyModel = function (resource) {
            // We need to support that not all models get disposed through this service (i.e. model.dispose() should work!)
            var modelData = this._models[MODEL_ID(resource)];
            if (!modelData) {
                return;
            }
            modelData.model.dispose();
        };
        ModelServiceImpl.prototype.getModels = function () {
            var ret = [];
            for (var modelId in this._models) {
                if (this._models.hasOwnProperty(modelId)) {
                    ret.push(this._models[modelId].model);
                }
            }
            return ret;
        };
        ModelServiceImpl.prototype.getModel = function (resource) {
            var modelId = MODEL_ID(resource);
            var modelData = this._models[modelId];
            if (!modelData) {
                return null;
            }
            return modelData.model;
        };
        Object.defineProperty(ModelServiceImpl.prototype, "onModelAdded", {
            get: function () {
                return this._onModelAdded ? this._onModelAdded.event : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelServiceImpl.prototype, "onModelRemoved", {
            get: function () {
                return this._onModelRemoved ? this._onModelRemoved.event : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelServiceImpl.prototype, "onModelModeChanged", {
            get: function () {
                return this._onModelModeChanged ? this._onModelModeChanged.event : null;
            },
            enumerable: true,
            configurable: true
        });
        // --- end IModelService
        ModelServiceImpl.prototype._beginWorkerSync = function (modelData) {
            if (modelData.isSyncedToWorkers) {
                throw new Error('Model is already being synced to workers!');
            }
            modelData.isSyncedToWorkers = true;
            this._workerHelper.$_acceptNewModel(ModelServiceImpl._getBoundModelData(modelData.model));
        };
        ModelServiceImpl.prototype._stopWorkerSync = function (modelData) {
            if (!modelData.isSyncedToWorkers) {
                throw new Error('Model is already not being synced to workers!');
            }
            modelData.isSyncedToWorkers = false;
            this._workerHelper.$_acceptDidDisposeModel(modelData.model.getAssociatedResource());
        };
        ModelServiceImpl.prototype._onModelDisposing = function (model) {
            var _this = this;
            var modelId = MODEL_ID(model.getAssociatedResource());
            var modelData = this._models[modelId];
            // TODO@Joh why are we removing markers here?
            if (this._markerService) {
                var markers = this._markerService.read({ resource: model.getAssociatedResource() }), owners = Object.create(null);
                markers.forEach(function (marker) { return owners[marker.owner] = _this; });
                Object.keys(owners).forEach(function (owner) { return _this._markerService.changeOne(owner, model.getAssociatedResource(), []); });
            }
            if (modelData.isSyncedToWorkers) {
                // Dispose model in workers
                this._stopWorkerSync(modelData);
            }
            delete this._models[modelId];
            modelData.dispose();
            this._onModelRemoved.fire(model);
        };
        ModelServiceImpl._getBoundModelData = function (model) {
            return {
                url: model.getAssociatedResource(),
                versionId: model.getVersionId(),
                value: model.toRawText(),
                modeId: model.getMode().getId()
            };
        };
        ModelServiceImpl.prototype._onModelEvents = function (modelData, events) {
            // First look for dispose
            for (var i = 0, len = events.length; i < len; i++) {
                var e = events[i];
                if (e.getType() === editorCommon.EventType.ModelDispose) {
                    this._onModelDisposing(modelData.model);
                    // no more processing since model got disposed
                    return;
                }
            }
            // Second, look for mode change
            for (var i = 0, len = events.length; i < len; i++) {
                var e = events[i];
                if (e.getType() === editorCommon.EventType.ModelModeChanged) {
                    var wasSyncedToWorkers = modelData.isSyncedToWorkers;
                    var shouldSyncToWorkers = this._shouldSyncModelToWorkers(modelData.model);
                    this._onModelModeChanged.fire({
                        model: modelData.model,
                        oldModeId: e.getData().oldMode.getId()
                    });
                    if (wasSyncedToWorkers) {
                        if (shouldSyncToWorkers) {
                            // true -> true
                            // Forward mode change to all the workers
                            this._workerHelper.$_acceptDidChangeModelMode(modelData.getModelId(), modelData.model.getMode().getId());
                        }
                        else {
                            // true -> false
                            // Stop worker sync for this model
                            this._stopWorkerSync(modelData);
                            // no more processing since we have removed the model from the workers
                            return;
                        }
                    }
                    else {
                        if (shouldSyncToWorkers) {
                            // false -> true
                            // Begin syncing this model to the workers
                            this._beginWorkerSync(modelData);
                            // no more processing since we are sending the latest state
                            return;
                        }
                        else {
                            // false -> false
                            // no more processing since this model was not synced and will not be synced
                            return;
                        }
                    }
                }
            }
            if (!modelData.isSyncedToWorkers) {
                return;
            }
            // Finally, look for model content changes
            var eventsForWorkers = { contentChanged: [] };
            for (var i = 0, len = events.length; i < len; i++) {
                var e = events[i];
                if (e.getType() === editorCommon.EventType.ModelContentChanged) {
                    eventsForWorkers.contentChanged.push(e.getData());
                }
            }
            if (eventsForWorkers.contentChanged.length > 0) {
                // Forward events to all the workers
                this._workerHelper.$_acceptModelEvents(modelData.getModelId(), eventsForWorkers);
            }
        };
        return ModelServiceImpl;
    }());
    exports.ModelServiceImpl = ModelServiceImpl;
    var ModelServiceWorkerHelper = (function () {
        function ModelServiceWorkerHelper(resourceService, modeService) {
            this._resourceService = resourceService;
            this._modeService = modeService;
        }
        ModelServiceWorkerHelper.prototype.$_acceptNewModel = function (data) {
            var _this = this;
            // Create & insert the mirror model eagerly in the resource service
            var mirrorModel = new mirrorModel_1.MirrorModel(this._resourceService, data.versionId, data.value, null, data.url);
            this._resourceService.insert(mirrorModel.getAssociatedResource(), mirrorModel);
            // Block worker execution until the mode is instantiated
            return this._modeService.getOrCreateMode(data.modeId).then(function (mode) {
                // Changing mode should trigger a remove & an add, therefore:
                // (1) Remove from resource service
                _this._resourceService.remove(mirrorModel.getAssociatedResource());
                // (2) Change mode
                mirrorModel.setMode(mode);
                // (3) Insert again to resource service (it will have the new mode)
                _this._resourceService.insert(mirrorModel.getAssociatedResource(), mirrorModel);
            });
        };
        ModelServiceWorkerHelper.prototype.$_acceptDidChangeModelMode = function (modelId, newModeId) {
            var _this = this;
            var mirrorModel = this._resourceService.get(uri_1.default.parse(modelId));
            // Block worker execution until the mode is instantiated
            return this._modeService.getOrCreateMode(newModeId).then(function (mode) {
                // Changing mode should trigger a remove & an add, therefore:
                // (1) Remove from resource service
                _this._resourceService.remove(mirrorModel.getAssociatedResource());
                // (2) Change mode
                mirrorModel.setMode(mode);
                // (3) Insert again to resource service (it will have the new mode)
                _this._resourceService.insert(mirrorModel.getAssociatedResource(), mirrorModel);
            });
        };
        ModelServiceWorkerHelper.prototype.$_acceptDidDisposeModel = function (url) {
            var model = this._resourceService.get(url);
            this._resourceService.remove(url);
            if (model) {
                model.dispose();
            }
        };
        ModelServiceWorkerHelper.prototype.$_acceptModelEvents = function (modelId, events) {
            var model = this._resourceService.get(uri_1.default.parse(modelId));
            if (!model) {
                throw new Error('Received model events for missing model ' + telemetry_1.anonymize(modelId));
            }
            try {
                model.onEvents(events);
            }
            catch (err) {
                errors_1.onUnexpectedError(err);
            }
        };
        ModelServiceWorkerHelper = __decorate([
            thread_1.Remotable.WorkerContext('ModelServiceWorkerHelper', thread_1.ThreadAffinity.All),
            __param(0, resourceService_1.IResourceService),
            __param(1, modeService_1.IModeService)
        ], ModelServiceWorkerHelper);
        return ModelServiceWorkerHelper;
    }());
    exports.ModelServiceWorkerHelper = ModelServiceWorkerHelper;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("vs/platform/markers/common/markerService", ["require", "exports", 'vs/base/common/arrays', 'vs/base/common/network', 'vs/base/common/strings', 'vs/base/common/collections', 'vs/base/common/uri', 'vs/base/common/event', 'vs/base/common/severity', 'vs/platform/thread/common/thread', './markers'], function (require, exports, arrays, network, strings, collections, uri_1, event_1, severity_1, thread_1, markers_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var Key;
    (function (Key) {
        function fromValue(value) {
            var regexp = /^(.*)→(.*)$/.exec(value);
            return {
                owner: regexp[1],
                resource: uri_1.default.parse(regexp[2])
            };
        }
        Key.fromValue = fromValue;
        function valueOf(k) {
            return k.owner + '→' + k.resource;
        }
        Key.valueOf = valueOf;
        var _selectorPattern = '^({0})→({1})$';
        function selector(owner, resource) {
            return new RegExp(strings.format(_selectorPattern, owner ? strings.escapeRegExpCharacters(owner) : '.*', resource ? strings.escapeRegExpCharacters(resource.toString()) : '.*'));
        }
        Key.selector = selector;
        function raw(owner, resource) {
            return owner + '→' + resource;
        }
        Key.raw = raw;
    })(Key || (Key = {}));
    var MarkerService = (function () {
        function MarkerService() {
            this.serviceId = markers_1.IMarkerService;
            this._data = Object.create(null);
            this._stats = this._emptyStats();
            this._onMarkerChanged = new event_1.Emitter();
        }
        MarkerService.prototype.getStatistics = function () {
            return this._stats;
        };
        Object.defineProperty(MarkerService.prototype, "onMarkerChanged", {
            // ---- IMarkerService ------------------------------------------
            get: function () {
                return this._onMarkerChanged ? this._onMarkerChanged.event : null;
            },
            enumerable: true,
            configurable: true
        });
        MarkerService.prototype.changeOne = function (owner, resource, markers) {
            if (this._doChangeOne(owner, resource, markers)) {
                this._onMarkerChanged.fire([resource]);
            }
        };
        MarkerService.prototype.remove = function (owner, resources) {
            if (arrays.isFalsyOrEmpty(resources)) {
                return;
            }
            var changedResources;
            for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
                var resource = resources_1[_i];
                if (this._doChangeOne(owner, resource, undefined)) {
                    if (!changedResources) {
                        changedResources = [];
                    }
                    changedResources.push(resource);
                }
            }
            if (changedResources) {
                this._onMarkerChanged.fire(changedResources);
            }
        };
        MarkerService.prototype._doChangeOne = function (owner, resource, markers) {
            var key = Key.raw(owner, resource), oldMarkers = this._data[key], hasOldMarkers = !arrays.isFalsyOrEmpty(oldMarkers), getsNewMarkers = !arrays.isFalsyOrEmpty(markers), oldStats = this._computeStats(oldMarkers), newStats = this._computeStats(markers);
            if (!hasOldMarkers && !getsNewMarkers) {
                return;
            }
            if (getsNewMarkers) {
                this._data[key] = markers;
            }
            else if (hasOldMarkers) {
                delete this._data[key];
            }
            if (this._isStatRelevant(resource)) {
                this._updateStatsMinus(oldStats);
                this._updateStatsPlus(newStats);
            }
            return true;
        };
        MarkerService.prototype.changeAll = function (owner, data) {
            var _this = this;
            var changedResources = Object.create(null);
            // remove and record old markers
            var oldStats = this._emptyStats();
            this._forEach(owner, undefined, undefined, -1, function (e, r) {
                var resource = Key.fromValue(e.key).resource;
                if (_this._isStatRelevant(resource)) {
                    _this._updateStatsPlus(oldStats, _this._computeStats(e.value));
                }
                changedResources[resource.toString()] = resource;
                r();
            });
            this._updateStatsMinus(oldStats);
            // add and record new markers
            if (!arrays.isFalsyOrEmpty(data)) {
                var newStats_1 = this._emptyStats();
                data.forEach(function (d) {
                    changedResources[d.resource.toString()] = d.resource;
                    collections.lookupOrInsert(_this._data, Key.raw(owner, d.resource), []).push(d.marker);
                    if (_this._isStatRelevant(d.resource)) {
                        _this._updateStatsMarker(newStats_1, d.marker);
                    }
                });
                this._updateStatsPlus(newStats_1);
            }
            this._onMarkerChanged.fire(collections.values(changedResources));
        };
        MarkerService.prototype.read = function (filter) {
            var _this = this;
            if (filter === void 0) { filter = Object.create(null); }
            var ret = [];
            this._forEach(filter.owner, filter.resource, filter.selector, filter.take, function (entry) { return _this._fromEntry(entry, ret); });
            return ret;
        };
        MarkerService.prototype._isStatRelevant = function (resource) {
            //TODO@Dirk this is a hack
            return resource.scheme !== network.Schemas.inMemory;
        };
        MarkerService.prototype._forEach = function (owner, resource, regexp, take, callback) {
            //TODO@Joh: be smart and use an index
            var selector = regexp || Key.selector(owner, resource), took = 0;
            collections.forEach(this._data, function (entry, remove) {
                if (selector.test(entry.key)) {
                    callback(entry, remove);
                    if (take > 0 && took++ >= take) {
                        return false;
                    }
                }
            });
        };
        MarkerService.prototype._fromEntry = function (entry, bucket) {
            var key = Key.fromValue(entry.key);
            entry.value.forEach(function (data) {
                // before reading, we sanitize the data
                MarkerService._sanitize(data);
                bucket.push({
                    owner: key.owner,
                    resource: key.resource,
                    code: data.code,
                    message: data.message,
                    source: data.source,
                    severity: data.severity,
                    startLineNumber: data.startLineNumber,
                    startColumn: data.startColumn,
                    endLineNumber: data.endLineNumber,
                    endColumn: data.endColumn
                });
            });
        };
        MarkerService.prototype._computeStats = function (markers) {
            var errors = 0, warnings = 0, infos = 0, unknwons = 0;
            if (markers) {
                for (var i = 0; i < markers.length; i++) {
                    var marker = markers[i];
                    if (marker.severity) {
                        switch (marker.severity) {
                            case severity_1.default.Error:
                                errors++;
                                break;
                            case severity_1.default.Warning:
                                warnings++;
                                break;
                            case severity_1.default.Info:
                                infos++;
                                break;
                            default:
                                unknwons++;
                                break;
                        }
                    }
                    else {
                        unknwons++;
                    }
                }
            }
            return {
                errors: errors,
                warnings: warnings,
                infos: infos,
                unknwons: unknwons
            };
        };
        MarkerService.prototype._emptyStats = function () {
            return { errors: 0, warnings: 0, infos: 0, unknwons: 0 };
        };
        MarkerService.prototype._updateStatsPlus = function (toUpdate, toAdd) {
            if (!toAdd) {
                toAdd = toUpdate;
                toUpdate = this._stats;
            }
            toUpdate.errors += toAdd.errors;
            toUpdate.warnings += toAdd.warnings;
            toUpdate.infos += toAdd.infos;
            toUpdate.unknwons += toAdd.unknwons;
        };
        MarkerService.prototype._updateStatsMinus = function (toUpdate, toSubtract) {
            if (!toSubtract) {
                toSubtract = toUpdate;
                toUpdate = this._stats;
            }
            toUpdate.errors -= toSubtract.errors;
            toUpdate.warnings -= toSubtract.warnings;
            toUpdate.infos -= toSubtract.infos;
            toUpdate.unknwons -= toSubtract.unknwons;
        };
        MarkerService.prototype._updateStatsMarker = function (toUpdate, marker) {
            switch (marker.severity) {
                case severity_1.default.Error:
                    toUpdate.errors++;
                    break;
                case severity_1.default.Warning:
                    toUpdate.warnings++;
                    break;
                case severity_1.default.Info:
                    toUpdate.infos++;
                    break;
                default:
                    toUpdate.unknwons++;
                    break;
            }
        };
        MarkerService._sanitize = function (data) {
            data.code = data.code || null;
            data.startLineNumber = data.startLineNumber > 0 ? data.startLineNumber : 1;
            data.startColumn = data.startColumn > 0 ? data.startColumn : 1;
            data.endLineNumber = data.endLineNumber >= data.startLineNumber ? data.endLineNumber : data.startLineNumber;
            data.endColumn = data.endColumn > 0 ? data.endColumn : data.startColumn;
        };
        return MarkerService;
    }());
    exports.MarkerService = MarkerService;
    var SecondaryMarkerService = (function (_super) {
        __extends(SecondaryMarkerService, _super);
        function SecondaryMarkerService(threadService) {
            _super.call(this);
            this._proxy = threadService.getRemotable(MainProcessMarkerService);
        }
        SecondaryMarkerService.prototype.changeOne = function (owner, resource, markers) {
            this._proxy.changeOne(owner, resource, markers);
        };
        SecondaryMarkerService.prototype.changeAll = function (owner, data) {
            this._proxy.changeAll(owner, data);
        };
        return SecondaryMarkerService;
    }(MarkerService));
    exports.SecondaryMarkerService = SecondaryMarkerService;
    var MainProcessMarkerService = (function (_super) {
        __extends(MainProcessMarkerService, _super);
        function MainProcessMarkerService(threadService) {
            _super.call(this);
            threadService.registerRemotableInstance(MainProcessMarkerService, this);
        }
        MainProcessMarkerService.prototype.changeOne = function (owner, resource, markers) {
            _super.prototype.changeOne.call(this, owner, resource, markers);
        };
        MainProcessMarkerService.prototype.changeAll = function (owner, data) {
            _super.prototype.changeAll.call(this, owner, data);
        };
        MainProcessMarkerService = __decorate([
            thread_1.Remotable.MainContext('MainProcessMarkerService')
        ], MainProcessMarkerService);
        return MainProcessMarkerService;
    }(MarkerService));
    exports.MainProcessMarkerService = MainProcessMarkerService;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define("vs/platform/telemetry/common/abstractRemoteTelemetryService", ["require", "exports", 'vs/platform/telemetry/common/abstractTelemetryService', 'vs/platform/telemetry/common/telemetry', 'vs/platform/thread/common/thread'], function (require, exports, AbstractTelemetryService, telemetry_1, thread_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * Helper always instantiated in the main process to receive telemetry events from remote telemetry services
     */
    var RemoteTelemetryServiceHelper = (function () {
        function RemoteTelemetryServiceHelper(telemetryService) {
            this._telemetryService = telemetryService;
        }
        RemoteTelemetryServiceHelper.prototype._handleRemoteTelemetryEvent = function (eventName, data) {
            this._telemetryService.publicLog(eventName, data);
        };
        RemoteTelemetryServiceHelper.prototype.getTelemetryInfo = function () {
            return this._telemetryService.getTelemetryInfo();
        };
        RemoteTelemetryServiceHelper = __decorate([
            thread_1.Remotable.MainContext('RemoteTelemetryServiceHelper'),
            __param(0, telemetry_1.ITelemetryService)
        ], RemoteTelemetryServiceHelper);
        return RemoteTelemetryServiceHelper;
    }());
    exports.RemoteTelemetryServiceHelper = RemoteTelemetryServiceHelper;
    /**
     * Base class for remote telemetry services (instantiated in extension host or in web workers)
     */
    var AbstractRemoteTelemetryService = (function (_super) {
        __extends(AbstractRemoteTelemetryService, _super);
        function AbstractRemoteTelemetryService(threadService) {
            // Log all events including public, since they will be forwarded to the main which will do the real filtering
            _super.call(this);
            this._proxy = threadService.getRemotable(RemoteTelemetryServiceHelper);
        }
        AbstractRemoteTelemetryService.prototype.getTelemetryInfo = function () {
            return this._proxy.getTelemetryInfo();
        };
        AbstractRemoteTelemetryService.prototype.addTelemetryAppender = function (appender) {
            throw new Error('Telemetry appenders are not supported in this execution envirnoment');
        };
        AbstractRemoteTelemetryService.prototype.handleEvent = function (eventName, data) {
            this._proxy._handleRemoteTelemetryEvent(eventName, data);
        };
        return AbstractRemoteTelemetryService;
    }(AbstractTelemetryService.AbstractTelemetryService));
    exports.AbstractRemoteTelemetryService = AbstractRemoteTelemetryService;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/platform/telemetry/common/workerTelemetryService", ["require", "exports", 'vs/platform/telemetry/common/abstractRemoteTelemetryService'], function (require, exports, abstractRemoteTelemetryService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var WorkerTelemetryService = (function (_super) {
        __extends(WorkerTelemetryService, _super);
        function WorkerTelemetryService() {
            _super.apply(this, arguments);
        }
        WorkerTelemetryService.prototype.handleEvent = function (eventName, data) {
            data = data || {};
            data['workerTelemetry'] = true;
            _super.prototype.handleEvent.call(this, eventName, data);
        };
        return WorkerTelemetryService;
    }(abstractRemoteTelemetryService_1.AbstractRemoteTelemetryService));
    exports.WorkerTelemetryService = WorkerTelemetryService;
});

define("vs/platform/thread/common/threadService", ["require", "exports", 'vs/base/common/winjs.base', './thread'], function (require, exports, winjs_base_1, thread) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.THREAD_SERVICE_PROPERTY_NAME = '__$$__threadService';
    function findMember(proto, target) {
        for (var i in proto) {
            if (proto[i] === target) {
                return i;
            }
        }
        throw new Error('Member not found in prototype');
    }
    function findThreadService(obj) {
        var threadService = obj[exports.THREAD_SERVICE_PROPERTY_NAME];
        if (!threadService) {
            throw new Error('Objects that use thread attributes must be instantiated with the thread service');
        }
        return threadService;
    }
    function OneWorkerFn(type, target, conditionOrAffinity, affinity) {
        if (affinity === void 0) { affinity = thread.ThreadAffinity.None; }
        var methodName = findMember(type.prototype, target), condition;
        if (typeof conditionOrAffinity === 'function') {
            condition = conditionOrAffinity;
        }
        else if (typeof conditionOrAffinity !== 'undefined') {
            affinity = conditionOrAffinity;
        }
        type.prototype[methodName] = function () {
            var param = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                param[_i - 0] = arguments[_i];
            }
            if (!condition) {
                return findThreadService(this).OneWorker(this, methodName, target, param, affinity);
            }
            else {
                var that_1 = this, promise = condition.call(that_1);
                if (!winjs_base_1.TPromise.is(promise)) {
                    promise = winjs_base_1.TPromise.as(promise);
                }
                return promise.then(function () {
                    return findThreadService(that_1).OneWorker(that_1, methodName, target, param, affinity);
                });
            }
        };
    }
    exports.OneWorkerAttr = OneWorkerFn;
    function AllWorkersAttr(type, target) {
        var methodName = findMember(type.prototype, target);
        type.prototype[methodName] = function () {
            var param = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                param[_i - 0] = arguments[_i];
            }
            return findThreadService(this).AllWorkers(this, methodName, target, param);
        };
    }
    exports.AllWorkersAttr = AllWorkersAttr;
});

define("vs/platform/thread/common/abstractThreadService", ["require", "exports", 'vs/base/common/winjs.base', 'vs/platform/thread/common/thread', 'vs/platform/thread/common/threadService', 'vs/platform/instantiation/common/descriptors'], function (require, exports, winjs_base_1, thread_1, threadService_1, descriptors_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var AbstractThreadService = (function () {
        function AbstractThreadService(isInMainThread) {
            this.isInMainThread = isInMainThread;
            this._boundObjects = {};
            this._pendingObjects = [];
            this._localObjMap = Object.create(null);
            this._proxyObjMap = Object.create(null);
        }
        AbstractThreadService.prototype.setInstantiationService = function (service) {
            this._instantiationService = service;
        };
        AbstractThreadService.prototype.createInstance = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i - 0] = arguments[_i];
            }
            return this._doCreateInstance(params);
        };
        AbstractThreadService.prototype._doCreateInstance = function (params) {
            var _this = this;
            var instanceOrPromise = this._instantiationService.createInstance.apply(this._instantiationService, params);
            if (winjs_base_1.TPromise.is(instanceOrPromise)) {
                var objInstantiated_1;
                objInstantiated_1 = instanceOrPromise.then(function (instance) {
                    if (instance.asyncCtor) {
                        var initPromise = instance.asyncCtor();
                        if (winjs_base_1.TPromise.is(initPromise)) {
                            return initPromise.then(function () {
                                return instance;
                            });
                        }
                    }
                    return instance;
                });
                this._pendingObjects.push(objInstantiated_1);
                return objInstantiated_1.then(function (instance) {
                    var r = _this._finishInstance(instance);
                    for (var i = 0; i < _this._pendingObjects.length; i++) {
                        if (_this._pendingObjects[i] === objInstantiated_1) {
                            _this._pendingObjects.splice(i, 1);
                            break;
                        }
                    }
                    return r;
                });
            }
            return this._finishInstance(instanceOrPromise);
        };
        AbstractThreadService.prototype._finishInstance = function (instance) {
            instance[threadService_1.THREAD_SERVICE_PROPERTY_NAME] = this;
            this._boundObjects[instance.getId()] = instance;
            if (instance.creationDone) {
                instance.creationDone();
            }
            return instance;
        };
        AbstractThreadService.prototype.handle = function (rpcId, methodName, args) {
            if (!this._localObjMap[rpcId]) {
                throw new Error('Unknown actor ' + rpcId);
            }
            var actor = this._localObjMap[rpcId];
            var method = actor[methodName];
            if (typeof method !== 'function') {
                throw new Error('Unknown method ' + methodName + ' on actor ' + rpcId);
            }
            return method.apply(actor, args);
        };
        AbstractThreadService.prototype._getOrCreateProxyInstance = function (remoteCom, id, descriptor) {
            if (this._proxyObjMap[id]) {
                return this._proxyObjMap[id];
            }
            var result = createProxyFromCtor(remoteCom, id, descriptor.ctor);
            this._proxyObjMap[id] = result;
            return result;
        };
        AbstractThreadService.prototype._registerLocalInstance = function (id, obj) {
            this._localObjMap[id] = obj;
        };
        AbstractThreadService.prototype._getOrCreateLocalInstance = function (id, descriptor) {
            if (this._localObjMap[id]) {
                return this._localObjMap[id];
            }
            var result = this._instantiationService.createInstance(descriptor);
            this._registerLocalInstance(id, result);
            return result;
        };
        AbstractThreadService.prototype.getRemotable = function (ctor) {
            var id = thread_1.Remotable.getId(ctor);
            if (!id) {
                throw new Error('Unknown Remotable: <<' + id + '>>');
            }
            var desc = descriptors_1.createSyncDescriptor(ctor);
            if (thread_1.Remotable.Registry.MainContext[id]) {
                return this._registerAndInstantiateMainProcessActor(id, desc);
            }
            if (thread_1.Remotable.Registry.ExtHostContext[id]) {
                return this._registerAndInstantiateExtHostActor(id, desc);
            }
            if (thread_1.Remotable.Registry.WorkerContext[id]) {
                return this._registerAndInstantiateWorkerActor(id, desc, thread_1.Remotable.Registry.WorkerContext[id].affinity);
            }
            throw new Error('Unknown Remotable: <<' + id + '>>');
        };
        AbstractThreadService.prototype.registerRemotableInstance = function (ctor, instance) {
            var id = thread_1.Remotable.getId(ctor);
            if (!id) {
                throw new Error('Unknown Remotable: <<' + id + '>>');
            }
            if (thread_1.Remotable.Registry.MainContext[id]) {
                return this._registerMainProcessActor(id, instance);
            }
            if (thread_1.Remotable.Registry.ExtHostContext[id]) {
                return this._registerExtHostActor(id, instance);
            }
            if (thread_1.Remotable.Registry.WorkerContext[id]) {
                return this._registerWorkerActor(id, instance);
            }
            throw new Error('Unknown Remotable: <<' + id + '>>');
        };
        return AbstractThreadService;
    }());
    exports.AbstractThreadService = AbstractThreadService;
    function createProxyFromCtor(remote, id, ctor) {
        var result = {
            $__IS_REMOTE_OBJ: true
        };
        for (var prop in ctor.prototype) {
            if (typeof ctor.prototype[prop] === 'function') {
                result[prop] = createMethodProxy(remote, id, prop);
            }
        }
        return result;
    }
    function createMethodProxy(remote, proxyId, path) {
        return function () {
            var myArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                myArgs[_i - 0] = arguments[_i];
            }
            return remote.callOnRemote(proxyId, path, myArgs);
        };
    }
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/platform/thread/common/workerThreadService", ["require", "exports", 'vs/base/common/winjs.base', 'vs/platform/thread/common/abstractThreadService', 'vs/platform/thread/common/thread'], function (require, exports, winjs_base_1, abstractThreadService, thread_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var WorkerThreadService = (function (_super) {
        __extends(WorkerThreadService, _super);
        function WorkerThreadService(remoteCom) {
            _super.call(this, false);
            this.serviceId = thread_1.IThreadService;
            this._remoteCom = remoteCom;
            this._remoteCom.setManyHandler(this);
        }
        WorkerThreadService.prototype._handleRequest = function (identifier, memberName, args) {
            var _this = this;
            if (!this._boundObjects.hasOwnProperty(identifier)) {
                // Wait until all objects are constructed
                return winjs_base_1.TPromise.join(this._pendingObjects.slice(0)).then(function () {
                    if (!_this._boundObjects.hasOwnProperty(identifier)) {
                        return winjs_base_1.TPromise.wrapError(new Error('Bound object `' + identifier + '` was not found.'));
                    }
                    //					console.log(identifier + ' > ' + memberName);
                    var obj = _this._boundObjects[identifier];
                    return winjs_base_1.TPromise.as(obj[memberName].apply(obj, args));
                });
            }
            //			console.log(identifier + ' > ' + memberName);
            var obj = this._boundObjects[identifier];
            return winjs_base_1.TPromise.as(obj[memberName].apply(obj, args));
        };
        WorkerThreadService.prototype.dispatch = function (data) {
            try {
                var args = data.payload;
                var result = this._handleRequest(args[0], args[1], args[2]);
                return winjs_base_1.TPromise.is(result) ? result : winjs_base_1.TPromise.as(result);
            }
            catch (e) {
                // handler error
                return winjs_base_1.TPromise.wrapError(e);
            }
        };
        WorkerThreadService.prototype.OneWorker = function (obj, methodName, target, params, affinity) {
            return target.apply(obj, params);
        };
        WorkerThreadService.prototype.AllWorkers = function (obj, methodName, target, params) {
            return target.apply(obj, params);
        };
        WorkerThreadService.prototype.addStatusListener = function (listener) {
            // Nothing to do
        };
        WorkerThreadService.prototype.removeStatusListener = function (listener) {
            // Nothing to do
        };
        WorkerThreadService.prototype._registerAndInstantiateMainProcessActor = function (id, descriptor) {
            return this._getOrCreateProxyInstance(this._remoteCom, id, descriptor);
        };
        WorkerThreadService.prototype._registerMainProcessActor = function (id, actor) {
            throw new Error('Not supported in this runtime context!');
        };
        WorkerThreadService.prototype._registerAndInstantiateExtHostActor = function (id, descriptor) {
            throw new Error('Not supported in this runtime context: Cannot communicate from Worker directly to Extension Host!');
        };
        WorkerThreadService.prototype._registerExtHostActor = function (id, actor) {
            throw new Error('Not supported in this runtime context!');
        };
        WorkerThreadService.prototype._registerAndInstantiateWorkerActor = function (id, descriptor, whichWorker) {
            return this._getOrCreateLocalInstance(id, descriptor);
        };
        WorkerThreadService.prototype._registerWorkerActor = function (id, actor) {
            this._registerLocalInstance(id, actor);
        };
        return WorkerThreadService;
    }(abstractThreadService.AbstractThreadService));
    exports.WorkerThreadService = WorkerThreadService;
});

define("vs/platform/workspace/common/workspace", ["require", "exports", 'vs/platform/instantiation/common/instantiation'], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IWorkspaceContextService = instantiation_1.createDecorator('contextService');
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/editor/common/languages.common", ["require", "exports", 'vs/base/common/assert', 'vs/base/common/async', 'vs/base/common/callbackList', 'vs/base/common/cancellation', 'vs/base/common/collections', 'vs/base/common/event', 'vs/base/common/events', 'vs/base/common/lifecycle', 'vs/base/common/paths', 'vs/base/common/uri', 'vs/platform/platform', 'vs/platform/jsonschemas/common/jsonContributionRegistry', 'vs/platform/files/common/files', 'vs/platform/request/common/request', 'vs/platform/workspace/common/workspace', 'vs/platform/telemetry/common/telemetry', 'vs/platform/thread/common/thread', 'vs/platform/thread/common/threadService', 'vs/editor/common/editorCommon', 'vs/editor/common/modes', 'vs/editor/common/modes/abstractMode', 'vs/editor/common/modes/abstractState', 'vs/editor/common/modes/monarch/monarch', 'vs/editor/common/modes/monarch/monarchCompile', 'vs/editor/common/modes/supports/declarationSupport', 'vs/editor/common/modes/supports/parameterHintsSupport', 'vs/editor/common/modes/supports/referenceSupport', 'vs/editor/common/modes/supports/richEditSupport', 'vs/editor/common/modes/supports/suggestSupport', 'vs/editor/common/modes/supports/tokenizationSupport', 'vs/editor/common/services/modelService', 'vs/editor/common/services/modeService'], function (require, exports) {
    'use strict';
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/worker/editorWorkerServer", ["require", "exports", 'vs/base/common/severity', 'vs/platform/event/common/eventService', 'vs/platform/extensions/common/abstractExtensionService', 'vs/platform/instantiation/common/instantiationService', 'vs/platform/markers/common/markerService', 'vs/platform/request/common/baseRequestService', 'vs/platform/telemetry/common/workerTelemetryService', 'vs/platform/thread/common/workerThreadService', 'vs/platform/workspace/common/baseWorkspaceContextService', 'vs/editor/common/services/modeServiceImpl', 'vs/editor/common/services/modelServiceImpl', 'vs/editor/common/services/resourceServiceImpl', 'vs/editor/common/languages.common', 'vs/editor/common/worker/validationHelper'], function (require, exports, severity_1, eventService_1, abstractExtensionService_1, instantiationService_1, markerService_1, baseRequestService_1, workerTelemetryService_1, workerThreadService_1, baseWorkspaceContextService_1, modeServiceImpl_1, modelServiceImpl_1, resourceServiceImpl_1) {
    'use strict';
    var WorkerExtensionService = (function (_super) {
        __extends(WorkerExtensionService, _super);
        function WorkerExtensionService() {
            _super.call(this, true);
        }
        WorkerExtensionService.prototype._showMessage = function (severity, msg) {
            switch (severity) {
                case severity_1.default.Error:
                    console.error(msg);
                    break;
                case severity_1.default.Warning:
                    console.warn(msg);
                    break;
                case severity_1.default.Info:
                    console.info(msg);
                    break;
                default:
                    console.log(msg);
            }
        };
        WorkerExtensionService.prototype._createFailedExtension = function () {
            throw new Error('unexpected');
        };
        WorkerExtensionService.prototype._actualActivateExtension = function (extensionDescription) {
            throw new Error('unexpected');
        };
        return WorkerExtensionService;
    }(abstractExtensionService_1.AbstractExtensionService));
    var EditorWorkerServer = (function () {
        function EditorWorkerServer() {
        }
        EditorWorkerServer.prototype.initialize = function (mainThread, complete, error, progress, initData) {
            var extensionService = new WorkerExtensionService();
            var contextService = new baseWorkspaceContextService_1.BaseWorkspaceContextService(initData.contextService.workspace, initData.contextService.configuration, initData.contextService.options);
            this.threadService = new workerThreadService_1.WorkerThreadService(mainThread.getRemoteCom());
            this.threadService.setInstantiationService(instantiationService_1.createInstantiationService({ threadService: this.threadService }));
            var telemetryServiceInstance = new workerTelemetryService_1.WorkerTelemetryService(this.threadService);
            var resourceService = new resourceServiceImpl_1.ResourceService();
            var markerService = new markerService_1.SecondaryMarkerService(this.threadService);
            var modeService = new modeServiceImpl_1.ModeServiceImpl(this.threadService, extensionService);
            var requestService = new baseRequestService_1.BaseRequestService(contextService, telemetryServiceInstance);
            var _services = {
                threadService: this.threadService,
                extensionService: extensionService,
                modeService: modeService,
                contextService: contextService,
                eventService: new eventService_1.EventService(),
                resourceService: resourceService,
                markerService: markerService,
                telemetryService: telemetryServiceInstance,
                requestService: requestService
            };
            var instantiationService = instantiationService_1.createInstantiationService(_services);
            this.threadService.setInstantiationService(instantiationService);
            // Instantiate thread actors
            this.threadService.getRemotable(modeServiceImpl_1.ModeServiceWorkerHelper);
            this.threadService.getRemotable(modelServiceImpl_1.ModelServiceWorkerHelper);
            complete(undefined);
        };
        EditorWorkerServer.prototype.request = function (mainThread, complete, error, progress, data) {
            this.threadService.dispatch(data).then(complete, error, progress);
        };
        return EditorWorkerServer;
    }());
    exports.EditorWorkerServer = EditorWorkerServer;
    exports.value = new EditorWorkerServer();
});

//# sourceMappingURL=editorWorkerServer.js.map
