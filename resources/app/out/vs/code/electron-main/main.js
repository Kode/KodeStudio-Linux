/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["require","exports","vs/base/common/winjs.base","vs/base/common/platform","vs/code/electron-main/env","vs/platform/instantiation/common/instantiation","vs/base/common/types","path","electron","vs/nls!vs/code/electron-main/main","vs/base/common/objects","vs/nls","events","vs/code/electron-main/storage","vs/base/common/errors","vs/code/electron-main/settings","vs/base/common/arrays","vs/code/electron-main/log","vs/base/common/event","vs/base/common/uri","fs","original-fs","vs/code/electron-main/lifecycle","vs/platform/package","os","vs/base/common/strings","vs/base/common/paths","vs/code/electron-main/windows","vs/code/electron-main/update-manager","vs/platform/instantiation/common/descriptors","child_process","vs/platform/instantiation/common/serviceCollection","vs/base/common/uuid","vs/platform/product","vs/base/common/async","vs/base/node/pfs","vs/base/parts/ipc/common/ipc","vs/code/electron-main/window","vs/base/node/extfs","vs/base/node/request","vs/base/node/proxy","vs/base/common/lifecycle","vs/nls!vs/code/electron-main/menus","vs/nls!vs/code/electron-main/windows","vs/nls!vs/code/node/argv","url","vs/base/common/cancellation","vs/nls!vs/workbench/parts/git/electron-main/askpassService","vs/code/electron-main/sharedProcess","vs/code/electron-main/menus","vs/base/node/crypto","vs/platform/instantiation/common/instantiationService","crypto","vs/base/node/flow","vs/base/common/graph","vs/base/common/callbackList","vs/base/parts/ipc/node/ipc.net","vs/nls!vs/base/common/errors","vs/base/common/map","vs/base/common/collections","vs/base/common/assert","vs/nls!vs/base/common/json","vs/base/common/json","vs/workbench/parts/git/common/git","vs/workbench/parts/git/common/gitIpc","vs/workbench/parts/git/electron-main/askpassService","vs/base/node/userSettings","vs/code/electron-main/auto-updater.linux","vs/code/electron-main/auto-updater.win32","vs/nls!vs/base/common/keyCodes","vs/base/common/keyCodes","vs/code/electron-main/launch","vs/code/node/argv","https","http","zlib","vs/base/common/winjs.base.raw","http-proxy-agent","https-proxy-agent","minimist","assert","vs/code/electron-main/main","net"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[16], __M([0,1]), function (require, exports) {
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
        if (itemEquals === void 0) { itemEquals = function (a, b) { return a === b; }; }
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
    /**
     * Returns the top N elements from the array.
     *
     * Faster than sorting the entire array when the array is a lot larger than N.
     *
     * @param array The unsorted array.
     * @param compare A sort function for the elements.
     * @param n The number of elements to return.
     * @return The first n elemnts from array when sorted with compare.
     */
    function top(array, compare, n) {
        var result = array.slice(0, n).sort(compare);
        var _loop_1 = function(i, m) {
            var element = array[i];
            if (compare(element, result[n - 1]) < 0) {
                result.pop();
                var j = findFirst(result, function (e) { return compare(element, e) < 0; });
                result.splice(j, 0, element);
            }
        };
        for (var i = n, m = array.length; i < m; i++) {
            _loop_1(i, m);
        }
        return result;
    }
    exports.top = top;
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
        var seen = Object.create(null);
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
    function uniqueFilter(keyFn) {
        var seen = Object.create(null);
        return function (element) {
            var key = keyFn(element);
            if (seen[key]) {
                return false;
            }
            seen[key] = true;
            return true;
        };
    }
    exports.uniqueFilter = uniqueFilter;
    function firstIndex(array, fn) {
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (fn(element)) {
                return i;
            }
        }
        return -1;
    }
    exports.firstIndex = firstIndex;
    function first(array, fn, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = null; }
        var index = firstIndex(array, fn);
        return index < 0 ? notFoundValue : array[index];
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
    function range(to, from) {
        if (from === void 0) { from = 0; }
        var result = [];
        for (var i = from; i < to; i++) {
            result.push(i);
        }
        return result;
    }
    exports.range = range;
    function fill(num, valueFn, arr) {
        if (arr === void 0) { arr = []; }
        for (var i = 0; i < num; i++) {
            arr[i] = valueFn();
        }
        return arr;
    }
    exports.fill = fill;
    function index(array, indexer, merger) {
        if (merger === void 0) { merger = function (t) { return t; }; }
        return array.reduce(function (r, t) {
            var key = indexer(t);
            r[key] = merger(t, r[key]);
            return r;
        }, Object.create(null));
    }
    exports.index = index;
});

define(__m[60], __M([0,1]), function (require, exports) {
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

define(__m[59], __M([0,1]), function (require, exports) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(__m[58], __M([0,1]), function (require, exports) {
    'use strict';
    /**
     * A simple map to store value by a key object. Key can be any object that has toString() function to get
     * string value of the key.
     */
    var SimpleMap = (function () {
        function SimpleMap() {
            this.map = Object.create(null);
            this._size = 0;
        }
        Object.defineProperty(SimpleMap.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        SimpleMap.prototype.get = function (k) {
            var value = this.peek(k);
            return value ? value : null;
        };
        SimpleMap.prototype.keys = function () {
            var keys = [];
            for (var key in this.map) {
                keys.push(this.map[key].key);
            }
            return keys;
        };
        SimpleMap.prototype.values = function () {
            var values = [];
            for (var key in this.map) {
                values.push(this.map[key].value);
            }
            return values;
        };
        SimpleMap.prototype.entries = function () {
            var entries = [];
            for (var key in this.map) {
                entries.push(this.map[key]);
            }
            return entries;
        };
        SimpleMap.prototype.set = function (k, t) {
            if (this.get(k)) {
                return false; // already present!
            }
            this.push(k, t);
            return true;
        };
        SimpleMap.prototype.delete = function (k) {
            var value = this.get(k);
            if (value) {
                this.pop(k);
                return value;
            }
            return null;
        };
        SimpleMap.prototype.has = function (k) {
            return !!this.get(k);
        };
        SimpleMap.prototype.clear = function () {
            this.map = Object.create(null);
            this._size = 0;
        };
        SimpleMap.prototype.push = function (key, value) {
            var entry = { key: key, value: value };
            this.map[key.toString()] = entry;
            this._size++;
        };
        SimpleMap.prototype.pop = function (k) {
            delete this.map[k.toString()];
            this._size--;
        };
        SimpleMap.prototype.peek = function (k) {
            var entry = this.map[k.toString()];
            return entry ? entry.value : null;
        };
        return SimpleMap;
    }());
    exports.SimpleMap = SimpleMap;
    /**
     * A simple Map<T> that optionally allows to set a limit of entries to store. Once the limit is hit,
     * the cache will remove the entry that was last recently added. Or, if a ratio is provided below 1,
     * all elements will be removed until the ratio is full filled (e.g. 0.75 to remove 25% of old elements).
     */
    var LinkedMap = (function () {
        function LinkedMap(limit, ratio) {
            if (limit === void 0) { limit = Number.MAX_VALUE; }
            if (ratio === void 0) { ratio = 1; }
            this.limit = limit;
            this.map = Object.create(null);
            this._size = 0;
            this.ratio = limit * ratio;
        }
        Object.defineProperty(LinkedMap.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        LinkedMap.prototype.set = function (key, value) {
            if (this.map[key]) {
                return false; // already present!
            }
            var entry = { key: key, value: value };
            this.push(entry);
            if (this._size > this.limit) {
                this.trim();
            }
            return true;
        };
        LinkedMap.prototype.get = function (key) {
            var entry = this.map[key];
            return entry ? entry.value : null;
        };
        LinkedMap.prototype.delete = function (key) {
            var entry = this.map[key];
            if (entry) {
                this.map[key] = void 0;
                this._size--;
                if (entry.next) {
                    entry.next.prev = entry.prev; // [A]<-[x]<-[C] = [A]<-[C]
                }
                else {
                    this.head = entry.prev; // [A]-[x] = [A]
                }
                if (entry.prev) {
                    entry.prev.next = entry.next; // [A]->[x]->[C] = [A]->[C]
                }
                else {
                    this.tail = entry.next; // [x]-[A] = [A]
                }
                return entry.value;
            }
            return null;
        };
        LinkedMap.prototype.has = function (key) {
            return !!this.map[key];
        };
        LinkedMap.prototype.clear = function () {
            this.map = Object.create(null);
            this._size = 0;
            this.head = null;
            this.tail = null;
        };
        LinkedMap.prototype.push = function (entry) {
            if (this.head) {
                // [A]-[B] = [A]-[B]->[X]
                entry.prev = this.head;
                this.head.next = entry;
            }
            if (!this.tail) {
                this.tail = entry;
            }
            this.head = entry;
            this.map[entry.key] = entry;
            this._size++;
        };
        LinkedMap.prototype.trim = function () {
            if (this.tail) {
                // Remove all elements until ratio is reached
                if (this.ratio < this.limit) {
                    var index = 0;
                    var current = this.tail;
                    while (current.next) {
                        // Remove the entry
                        this.map[current.key] = void 0;
                        this._size--;
                        // if we reached the element that overflows our ratio condition
                        // make its next element the new tail of the Map and adjust the size
                        if (index === this.ratio) {
                            this.tail = current.next;
                            this.tail.prev = null;
                            break;
                        }
                        // Move on
                        current = current.next;
                        index++;
                    }
                }
                else {
                    this.map[this.tail.key] = void 0;
                    this._size--;
                    // [x]-[B] = [B]
                    this.tail = this.tail.next;
                    this.tail.prev = null;
                }
            }
        };
        return LinkedMap;
    }());
    exports.LinkedMap = LinkedMap;
    /**
     * A subclass of Map<T> that makes an entry the MRU entry as soon
     * as it is being accessed. In combination with the limit for the
     * maximum number of elements in the cache, it helps to remove those
     * entries from the cache that are LRU.
     */
    var LRUCache = (function (_super) {
        __extends(LRUCache, _super);
        function LRUCache(limit) {
            _super.call(this, limit);
        }
        LRUCache.prototype.get = function (key) {
            // Upon access of an entry, make it the head of
            // the linked map so that it is the MRU element
            var entry = this.map[key];
            if (entry) {
                this.delete(key);
                this.push(entry);
                return entry.value;
            }
            return null;
        };
        return LRUCache;
    }(LinkedMap));
    exports.LRUCache = LRUCache;
});

define(__m[3], __M([0,1]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // --- THIS FILE IS TEMPORARY UNTIL ENV.TS IS CLEANED UP. IT CAN SAFELY BE USED IN ALL TARGET EXECUTION ENVIRONMENTS (node & dom) ---
    var _isWindows = false;
    var _isMacintosh = false;
    var _isLinux = false;
    var _isRootUser = false;
    var _isNative = false;
    var _isWeb = false;
    var _isQunit = false;
    var _locale = undefined;
    var _language = undefined;
    exports.LANGUAGE_DEFAULT = 'en';
    // OS detection
    if (typeof process === 'object') {
        _isWindows = (process.platform === 'win32');
        _isMacintosh = (process.platform === 'darwin');
        _isLinux = (process.platform === 'linux');
        _isRootUser = !_isWindows && (process.getuid() === 0);
        var vscode_nls_config = process.env['VSCODE_NLS_CONFIG'];
        if (vscode_nls_config) {
            try {
                var nlsConfig = JSON.parse(vscode_nls_config);
                var resolved = nlsConfig.availableLanguages['*'];
                _locale = nlsConfig.locale;
                // VSCode's default language is 'en'
                _language = resolved ? resolved : exports.LANGUAGE_DEFAULT;
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
    exports.isRootUser = _isRootUser;
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
     * Chinese). The UI is not necessarily shown in the provided locale.
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

define(__m[26], __M([0,1,3]), function (require, exports, platform_1) {
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
    var _posixBadPath = /(\/\.\.?\/)|(\/\.\.?)$|^(\.\.?\/)|(\/\/+)|(\\)/;
    var _winBadPath = /(\\\.\.?\\)|(\\\.\.?)$|^(\.\.?\\)|(\\\\+)|(\/)/;
    function _isNormal(path, win) {
        return win
            ? !_winBadPath.test(path)
            : !_posixBadPath.test(path);
    }
    function normalize(path, toOSPath) {
        if (path === null || path === void 0) {
            return path;
        }
        var len = path.length;
        if (len === 0) {
            return '.';
        }
        var wantsBackslash = platform_1.isWindows && toOSPath;
        if (_isNormal(path, wantsBackslash)) {
            return path;
        }
        var sep = wantsBackslash ? '\\' : '/';
        var root = getRoot(path, sep);
        // skip the root-portion of the path
        var start = root.length;
        var skip = false;
        var res = '';
        for (var end = root.length; end <= len; end++) {
            // either at the end or at a path-separator character
            if (end === len || path.charCodeAt(end) === _slash || path.charCodeAt(end) === _backslash) {
                if (streql(path, start, end, '..')) {
                    // skip current and remove parent (if there is already something)
                    var prev_start = res.lastIndexOf(sep);
                    var prev_part = res.slice(prev_start + 1);
                    if ((root || prev_part.length > 0) && prev_part !== '..') {
                        res = prev_start === -1 ? '' : res.slice(0, prev_start);
                        skip = true;
                    }
                }
                else if (streql(path, start, end, '.') && (root || res || end < len - 1)) {
                    // skip current (if there is already something or if there is more to come)
                    skip = true;
                }
                if (!skip) {
                    var part = path.slice(start, end);
                    if (res !== '' && res[res.length - 1] !== sep) {
                        res += sep;
                    }
                    res += part;
                }
                start = end + 1;
                skip = false;
            }
        }
        return root + res;
    }
    exports.normalize = normalize;
    function streql(value, start, end, other) {
        return start + other.length === end && value.indexOf(other, start) === start;
    }
    /**
     * Computes the _root_ this path, like `getRoot('c:\files') === c:\`,
     * `getRoot('files:///files/path') === files:///`,
     * or `getRoot('\\server\shares\path') === \\server\shares\`
     */
    function getRoot(path, sep) {
        if (sep === void 0) { sep = '/'; }
        if (!path) {
            return '';
        }
        var len = path.length;
        var code = path.charCodeAt(0);
        if (code === _slash || code === _backslash) {
            code = path.charCodeAt(1);
            if (code === _slash || code === _backslash) {
                // UNC candidate \\localhost\shares\ddd
                //               ^^^^^^^^^^^^^^^^^^^
                code = path.charCodeAt(2);
                if (code !== _slash && code !== _backslash) {
                    var pos_1 = 3;
                    var start = pos_1;
                    for (; pos_1 < len; pos_1++) {
                        code = path.charCodeAt(pos_1);
                        if (code === _slash || code === _backslash) {
                            break;
                        }
                    }
                    code = path.charCodeAt(pos_1 + 1);
                    if (start !== pos_1 && code !== _slash && code !== _backslash) {
                        pos_1 += 1;
                        for (; pos_1 < len; pos_1++) {
                            code = path.charCodeAt(pos_1);
                            if (code === _slash || code === _backslash) {
                                return path.slice(0, pos_1 + 1) // consume this separator
                                    .replace(/[\\/]/g, sep);
                            }
                        }
                    }
                }
            }
            // /user/far
            // ^
            return sep;
        }
        else if ((code >= _A && code <= _Z) || (code >= _a && code <= _z)) {
            // check for windows drive letter c:\ or c:
            if (path.charCodeAt(1) === _colon) {
                code = path.charCodeAt(2);
                if (code === _slash || code === _backslash) {
                    // C:\fff
                    // ^^^
                    return path.slice(0, 2) + sep;
                }
                else {
                    // C:
                    // ^^
                    return path.slice(0, 2);
                }
            }
        }
        // check for URI
        // scheme://authority/path
        // ^^^^^^^^^^^^^^^^^^^
        var pos = path.indexOf('://');
        if (pos !== -1) {
            pos += 3; // 3 -> "://".length
            for (; pos < len; pos++) {
                code = path.charCodeAt(pos);
                if (code === _slash || code === _backslash) {
                    return path.slice(0, pos + 1); // consume this separator
                }
            }
        }
        return '';
    }
    exports.getRoot = getRoot;
    exports.join = function () {
        // Not using a function with var-args because of how TS compiles
        // them to JS - it would result in 2*n runtime cost instead
        // of 1*n, where n is parts.length.
        var value = '';
        for (var i = 0; i < arguments.length; i++) {
            var part = arguments[i];
            if (i > 0) {
                // add the separater between two parts unless
                // there already is one
                var last = value.charCodeAt(value.length - 1);
                if (last !== _slash && last !== _backslash) {
                    var next = part.charCodeAt(0);
                    if (next !== _slash && next !== _backslash) {
                        value += exports.sep;
                    }
                }
            }
            value += part;
        }
        return normalize(value);
    };
    /**
     * Check if the path follows this pattern: `\\hostname\sharename`.
     *
     * @see https://msdn.microsoft.com/en-us/library/gg465305.aspx
     * @return A boolean indication if the path is a UNC path, on none-windows
     * always false.
     */
    function isUNC(path) {
        if (!platform_1.isWindows) {
            // UNC is a windows concept
            return false;
        }
        if (!path || path.length < 5) {
            // at least \\a\b
            return false;
        }
        var code = path.charCodeAt(0);
        if (code !== _backslash) {
            return false;
        }
        code = path.charCodeAt(1);
        if (code !== _backslash) {
            return false;
        }
        var pos = 2;
        var start = pos;
        for (; pos < path.length; pos++) {
            code = path.charCodeAt(pos);
            if (code === _backslash) {
                break;
            }
        }
        if (start === pos) {
            return false;
        }
        code = path.charCodeAt(pos + 1);
        if (isNaN(code) || code === _backslash) {
            return false;
        }
        return true;
    }
    exports.isUNC = isUNC;
    function isPosixAbsolute(path) {
        return path && path[0] === '/';
    }
    function makePosixAbsolute(path) {
        return isPosixAbsolute(normalize(path)) ? path : exports.sep + path;
    }
    exports.makePosixAbsolute = makePosixAbsolute;
    var _slash = '/'.charCodeAt(0);
    var _backslash = '\\'.charCodeAt(0);
    var _colon = ':'.charCodeAt(0);
    var _a = 'a'.charCodeAt(0);
    var _A = 'A'.charCodeAt(0);
    var _z = 'z'.charCodeAt(0);
    var _Z = 'Z'.charCodeAt(0);
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
        if (platform_1.isWindows && name[name.length - 1] === '.') {
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

define(__m[25], __M([0,1,58]), function (require, exports, map_1) {
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
            return haystack.lastIndexOf(needle) === diff;
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
    var normalizedCache = new map_1.LinkedMap(10000); // bounded to 10000 elements
    function normalizeNFC(str) {
        if (!exports.canNormalize || !str) {
            return str;
        }
        var cached = normalizedCache.get(str);
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
        // Use the cache for fast lookup
        normalizedCache.set(str, res);
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
    function lastNonWhitespaceIndex(str, startIndex) {
        if (startIndex === void 0) { startIndex = str.length - 1; }
        for (var i = startIndex; i >= 0; i--) {
            if (str.charAt(i) !== ' ' && str.charAt(i) !== '\t') {
                return i;
            }
        }
        return -1;
    }
    exports.lastNonWhitespaceIndex = lastNonWhitespaceIndex;
    function compare(a, b) {
        if (a < b) {
            return -1;
        }
        else if (a > b) {
            return 1;
        }
        else {
            return 0;
        }
    }
    exports.compare = compare;
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
        charCode = +charCode; // @perf
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
    /**
     * Appends two strings. If the appended result is longer than maxLength,
     * trims the start of the result and replaces it with '...'.
     */
    function appendWithLimit(first, second, maxLength) {
        var newLength = first.length + second.length;
        if (newLength > maxLength) {
            first = '...' + first.substr(newLength - maxLength);
        }
        if (second.length > maxLength) {
            first += second.substr(second.length - maxLength);
        }
        else {
            first += second;
        }
        return first;
    }
    exports.appendWithLimit = appendWithLimit;
    function safeBtoa(str) {
        return btoa(encodeURIComponent(str)); // we use encodeURIComponent because btoa fails for non Latin 1 values
    }
    exports.safeBtoa = safeBtoa;
    function repeat(s, count) {
        var result = '';
        for (var i = 0; i < count; i++) {
            result += s;
        }
        return result;
    }
    exports.repeat = repeat;
});

define(__m[6], __M([0,1]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var _typeof = {
        number: 'number',
        string: 'string',
        undefined: 'undefined',
        object: 'object',
        function: 'function'
    };
    /**
     * @returns whether the provided parameter is a JavaScript Array or not.
     */
    function isArray(array) {
        if (Array.isArray) {
            return Array.isArray(array);
        }
        if (array && typeof (array.length) === _typeof.number && array.constructor === Array) {
            return true;
        }
        return false;
    }
    exports.isArray = isArray;
    /**
     * @returns whether the provided parameter is a JavaScript String or not.
     */
    function isString(str) {
        if (typeof (str) === _typeof.string || str instanceof String) {
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
     *
     * @returns whether the provided parameter is of type `object` but **not**
     *	`null`, an `array`, a `regexp`, nor a `date`.
     */
    function isObject(obj) {
        return typeof obj === _typeof.object
            && obj !== null
            && !Array.isArray(obj)
            && !(obj instanceof RegExp)
            && !(obj instanceof Date);
    }
    exports.isObject = isObject;
    /**
     * In **contrast** to just checking `typeof` this will return `false` for `NaN`.
     * @returns whether the provided parameter is a JavaScript Number or not.
     */
    function isNumber(obj) {
        if ((typeof (obj) === _typeof.number || obj instanceof Number) && !isNaN(obj)) {
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
        return typeof (obj) === _typeof.undefined;
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
        return typeof obj === _typeof.function;
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
        return objects && objects.length > 0 && objects.every(isFunction);
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
        if (isString(constraint)) {
            if (typeof arg !== constraint) {
                throw new Error("argument does not match constraint: typeof " + constraint);
            }
        }
        else if (isFunction(constraint)) {
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

define(__m[54], __M([0,1,6,59]), function (require, exports, types_1, collections_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function newNode(data) {
        return {
            data: data,
            incoming: Object.create(null),
            outgoing: Object.create(null)
        };
    }
    var Graph = (function () {
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
            if (collections_1.contains(seen, key)) {
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
            var key = this._hashFn(data), node = collections_1.lookup(this._nodes, key);
            if (!node) {
                node = newNode(data);
                this._nodes[key] = node;
            }
            return node;
        };
        Graph.prototype.lookup = function (data) {
            return collections_1.lookup(this._nodes, this._hashFn(data));
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






define(__m[41], __M([0,1,6]), function (require, exports, types_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.empty = Object.freeze({
        dispose: function () { }
    });
    function dispose() {
        var disposables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            disposables[_i - 0] = arguments[_i];
        }
        var first = disposables[0];
        if (types_1.isArray(first)) {
            disposables = first;
        }
        disposables.forEach(function (d) { return d && d.dispose(); });
        return [];
    }
    exports.dispose = dispose;
    function combinedDisposable(disposables) {
        return { dispose: function () { return dispose(disposables); } };
    }
    exports.combinedDisposable = combinedDisposable;
    function toDisposable() {
        var fns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fns[_i - 0] = arguments[_i];
        }
        return combinedDisposable(fns.map(function (fn) { return ({ dispose: fn }); }));
    }
    exports.toDisposable = toDisposable;
    var Disposable = (function () {
        function Disposable() {
            this._toDispose = [];
        }
        Disposable.prototype.dispose = function () {
            this._toDispose = dispose(this._toDispose);
        };
        Disposable.prototype._register = function (t) {
            this._toDispose.push(t);
            return t;
        };
        return Disposable;
    }());
    exports.Disposable = Disposable;
    var Disposables = (function (_super) {
        __extends(Disposables, _super);
        function Disposables() {
            _super.apply(this, arguments);
        }
        Disposables.prototype.add = function (arg) {
            if (!Array.isArray(arg)) {
                return this._register(arg);
            }
            else {
                for (var _i = 0, arg_1 = arg; _i < arg_1.length; _i++) {
                    var element = arg_1[_i];
                    return this._register(element);
                }
            }
        };
        return Disposables;
    }(Disposable));
    exports.Disposables = Disposables;
});

define(__m[10], __M([0,1,6]), function (require, exports, Types) {
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
    function getOrDefault(obj, fn, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        var result = fn(obj);
        return typeof result === 'undefined' ? defaultValue : result;
    }
    exports.getOrDefault = getOrDefault;
});

define(__m[19], __M([0,1,3]), function (require, exports, platform) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function _encode(ch) {
        return '%' + ch.charCodeAt(0).toString(16).toUpperCase();
    }
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
    function encodeURIComponent2(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, _encode);
    }
    function encodeNoop(str) {
        return str;
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
            this._formatted = null;
            this._fsPath = null;
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
            // ---- filesystem path -----------------------
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
        URI.prototype.with = function (change) {
            if (!change) {
                return this;
            }
            var scheme = change.scheme, authority = change.authority, path = change.path, query = change.query, fragment = change.fragment;
            if (scheme === void 0) {
                scheme = this.scheme;
            }
            else if (scheme === null) {
                scheme = '';
            }
            if (authority === void 0) {
                authority = this.authority;
            }
            else if (authority === null) {
                authority = '';
            }
            if (path === void 0) {
                path = this.path;
            }
            else if (path === null) {
                path = '';
            }
            if (query === void 0) {
                query = this.query;
            }
            else if (query === null) {
                query = '';
            }
            if (fragment === void 0) {
                fragment = this.fragment;
            }
            else if (fragment === null) {
                fragment = '';
            }
            if (scheme === this.scheme
                && authority === this.authority
                && path === this.path
                && query === this.query
                && fragment === this.fragment) {
                return this;
            }
            var ret = new URI();
            ret._scheme = scheme;
            ret._authority = authority;
            ret._path = path;
            ret._query = query;
            ret._fragment = fragment;
            URI._validate(ret);
            return ret;
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
            var ret = new URI();
            ret._scheme = 'file';
            // normalize to fwd-slashes
            path = path.replace(/\\/g, URI._slash);
            // check for authority as used in UNC shares
            // or use the path as given
            if (path[0] === URI._slash && path[0] === path[1]) {
                var idx = path.indexOf(URI._slash, 2);
                if (idx === -1) {
                    ret._authority = path.substring(2);
                }
                else {
                    ret._authority = path.substring(2, idx);
                    ret._path = path.substring(idx);
                }
            }
            else {
                ret._path = path;
            }
            // Ensure that path starts with a slash
            // or that it is at least a slash
            if (ret._path[0] !== URI._slash) {
                ret._path = URI._slash + ret._path;
            }
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
        URI.from = function (components) {
            return new URI().with(components);
        };
        URI._validate = function (ret) {
            // scheme, https://tools.ietf.org/html/rfc3986#section-3.1
            // ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
            if (ret.scheme && !URI._schemePattern.test(ret.scheme)) {
                throw new Error('[UriError]: Scheme contains illegal characters.');
            }
            // path, http://tools.ietf.org/html/rfc3986#section-3.3
            // If a URI contains an authority component, then the path component
            // must either be empty or begin with a slash ("/") character.  If a URI
            // does not contain an authority component, then the path cannot begin
            // with two slash characters ("//").
            if (ret.path) {
                if (ret.authority) {
                    if (!URI._singleSlashStart.test(ret.path)) {
                        throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
                    }
                }
                else {
                    if (URI._doubleSlashStart.test(ret.path)) {
                        throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
                    }
                }
            }
        };
        // ---- printing/externalize ---------------------------
        /**
         *
         * @param skipEncoding Do not encode the result, default is `false`
         */
        URI.prototype.toString = function (skipEncoding) {
            if (skipEncoding === void 0) { skipEncoding = false; }
            if (!skipEncoding) {
                if (!this._formatted) {
                    this._formatted = URI._asFormatted(this, false);
                }
                return this._formatted;
            }
            else {
                // we don't cache that
                return URI._asFormatted(this, true);
            }
        };
        URI._asFormatted = function (uri, skipEncoding) {
            var encoder = !skipEncoding
                ? encodeURIComponent2
                : encodeNoop;
            var parts = [];
            var scheme = uri.scheme, authority = uri.authority, path = uri.path, query = uri.query, fragment = uri.fragment;
            if (scheme) {
                parts.push(scheme, ':');
            }
            if (authority || scheme === 'file') {
                parts.push('//');
            }
            if (authority) {
                authority = authority.toLowerCase();
                var idx = authority.indexOf(':');
                if (idx === -1) {
                    parts.push(encoder(authority));
                }
                else {
                    parts.push(encoder(authority.substr(0, idx)), authority.substr(idx));
                }
            }
            if (path) {
                // lower-case windows drive letters in /C:/fff or C:/fff
                var m = URI._upperCaseDrive.exec(path);
                if (m) {
                    if (m[1]) {
                        path = '/' + m[2].toLowerCase() + path.substr(3); // "/c:".length === 3
                    }
                    else {
                        path = m[2].toLowerCase() + path.substr(2); // // "c:".length === 2
                    }
                }
                // encode every segement but not slashes
                // make sure that # and ? are always encoded
                // when occurring in paths - otherwise the result
                // cannot be parsed back again
                var lastIdx = 0;
                while (true) {
                    var idx = path.indexOf(URI._slash, lastIdx);
                    if (idx === -1) {
                        parts.push(encoder(path.substring(lastIdx)).replace(/[#?]/, _encode));
                        break;
                    }
                    parts.push(encoder(path.substring(lastIdx, idx)).replace(/[#?]/, _encode), URI._slash);
                    lastIdx = idx + 1;
                }
                ;
            }
            if (query) {
                parts.push('?', encoder(query));
            }
            if (fragment) {
                parts.push('#', encoder(fragment));
            }
            return parts.join(URI._empty);
        };
        URI.prototype.toJSON = function () {
            return {
                scheme: this.scheme,
                authority: this.authority,
                path: this.path,
                fsPath: this.fsPath,
                query: this.query,
                fragment: this.fragment,
                external: this.toString(),
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
        URI._slash = '/';
        URI._regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
        URI._driveLetterPath = /^\/[a-zA-z]:/;
        URI._upperCaseDrive = /^(\/)?([A-Z]:)/;
        URI._schemePattern = /^\w[\w\d+.-]*$/;
        URI._singleSlashStart = /^\//;
        URI._doubleSlashStart = /^\/\//;
        return URI;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = URI;
});






define(__m[32], __M([0,1]), function (require, exports) {
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

/**
 * Extracted from https://github.com/winjs/winjs
 * Version: 4.4.0(ec3258a9f3a36805a187848984e3bb938044178d)
 * Copyright (c) Microsoft Corporation.
 * All Rights Reserved.
 * Licensed under the MIT License.
 */
(function() {

var _modules = {};
_modules["WinJS/Core/_WinJS"] = {};

var _winjs = function(moduleId, deps, factory) {
    var exports = {};
    var exportsPassedIn = false;

    var depsValues = deps.map(function(dep) {
        if (dep === 'exports') {
            exportsPassedIn = true;
            return exports;
        }
        return _modules[dep];
    });

    var result = factory.apply({}, depsValues);

    _modules[moduleId] = exportsPassedIn ? exports : result;
};


_winjs("WinJS/Core/_Global", [], function () {
    "use strict";

    // Appease jshint
    /* global window, self, global */

    var globalObject =
        typeof window !== 'undefined' ? window :
        typeof self !== 'undefined' ? self :
        typeof global !== 'undefined' ? global :
        {};
    return globalObject;
});

_winjs("WinJS/Core/_BaseCoreUtils", ["WinJS/Core/_Global"], function baseCoreUtilsInit(_Global) {
    "use strict";

    var hasWinRT = !!_Global.Windows;

    function markSupportedForProcessing(func) {
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
    }

    return {
        hasWinRT: hasWinRT,
        markSupportedForProcessing: markSupportedForProcessing,
        _setImmediate: _Global.setImmediate ? _Global.setImmediate.bind(_Global) : function (handler) {
            _Global.setTimeout(handler, 0);
        }
    };
});
_winjs("WinJS/Core/_WriteProfilerMark", ["WinJS/Core/_Global"], function profilerInit(_Global) {
    "use strict";

    return _Global.msWriteProfilerMark || function () { };
});
_winjs("WinJS/Core/_Base", ["WinJS/Core/_WinJS","WinJS/Core/_Global","WinJS/Core/_BaseCoreUtils","WinJS/Core/_WriteProfilerMark"], function baseInit(_WinJS, _Global, _BaseCoreUtils, _WriteProfilerMark) {
    "use strict";

    function initializeProperties(target, members, prefix) {
        var keys = Object.keys(members);
        var isArray = Array.isArray(target);
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
                    if (prefix && member.setName && typeof member.setName === 'function') {
                        member.setName(prefix + "." + key);
                    }
                    properties = properties || {};
                    properties[key] = member;
                    continue;
                }
            }
            if (!enumerable) {
                properties = properties || {};
                properties[key] = { value: member, enumerable: enumerable, configurable: true, writable: true };
                continue;
            }
            if (isArray) {
                target.forEach(function (target) {
                    target[key] = member;
                });
            } else {
                target[key] = member;
            }
        }
        if (properties) {
            if (isArray) {
                target.forEach(function (target) {
                    Object.defineProperties(target, properties);
                });
            } else {
                Object.defineProperties(target, properties);
            }
        }
    }

    (function () {

        var _rootNamespace = _WinJS;
        if (!_rootNamespace.Namespace) {
            _rootNamespace.Namespace = Object.create(Object.prototype);
        }

        function createNamespace(parentNamespace, name) {
            var currentNamespace = parentNamespace || {};
            if (name) {
                var namespaceFragments = name.split(".");
                if (currentNamespace === _Global && namespaceFragments[0] === "WinJS") {
                    currentNamespace = _WinJS;
                    namespaceFragments.splice(0, 1);
                }
                for (var i = 0, len = namespaceFragments.length; i < len; i++) {
                    var namespaceName = namespaceFragments[i];
                    if (!currentNamespace[namespaceName]) {
                        Object.defineProperty(currentNamespace, namespaceName,
                            { value: {}, writable: false, enumerable: true, configurable: true }
                        );
                    }
                    currentNamespace = currentNamespace[namespaceName];
                }
            }
            return currentNamespace;
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
            var currentNamespace = createNamespace(parentNamespace, name);

            if (members) {
                initializeProperties(currentNamespace, members, name || "<ANONYMOUS>");
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
            return defineWithParent(_Global, name, members);
        }

        var LazyStates = {
            uninitialized: 1,
            working: 2,
            initialized: 3,
        };

        function lazy(f) {
            var name;
            var state = LazyStates.uninitialized;
            var result;
            return {
                setName: function (value) {
                    name = value;
                },
                get: function () {
                    switch (state) {
                        case LazyStates.initialized:
                            return result;

                        case LazyStates.uninitialized:
                            state = LazyStates.working;
                            try {
                                _WriteProfilerMark("WinJS.Namespace._lazy:" + name + ",StartTM");
                                result = f();
                            } finally {
                                _WriteProfilerMark("WinJS.Namespace._lazy:" + name + ",StopTM");
                                state = LazyStates.uninitialized;
                            }
                            f = null;
                            state = LazyStates.initialized;
                            return result;

                        case LazyStates.working:
                            throw "Illegal: reentrancy on initialization";

                        default:
                            throw "Illegal";
                    }
                },
                set: function (value) {
                    switch (state) {
                        case LazyStates.working:
                            throw "Illegal: reentrancy on initialization";

                        default:
                            state = LazyStates.initialized;
                            result = value;
                            break;
                    }
                },
                enumerable: true,
                configurable: true,
            };
        }

        // helper for defining AMD module members
        function moduleDefine(exports, name, members) {
            var target = [exports];
            var publicNS = null;
            if (name) {
                publicNS = createNamespace(_Global, name);
                target.push(publicNS);
            }
            initializeProperties(target, members, name || "<ANONYMOUS>");
            return publicNS;
        }

        // Establish members of the "WinJS.Namespace" namespace
        Object.defineProperties(_rootNamespace.Namespace, {

            defineWithParent: { value: defineWithParent, writable: true, enumerable: true, configurable: true },

            define: { value: define, writable: true, enumerable: true, configurable: true },

            _lazy: { value: lazy, writable: true, enumerable: true, configurable: true },

            _moduleDefine: { value: moduleDefine, writable: true, enumerable: true, configurable: true }

        });

    })();

    (function () {

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
            _BaseCoreUtils.markSupportedForProcessing(constructor);
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
                _BaseCoreUtils.markSupportedForProcessing(constructor);
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
        _WinJS.Namespace.define("WinJS.Class", {
            define: define,
            derive: derive,
            mix: mix
        });

    })();

    return {
        Namespace: _WinJS.Namespace,
        Class: _WinJS.Class
    };

});
_winjs("WinJS/Core/_ErrorFromName", ["WinJS/Core/_Base"], function errorsInit(_Base) {
    "use strict";

    var ErrorFromName = _Base.Class.derive(Error, function (name, message) {
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
    });

    _Base.Namespace.define("WinJS", {
        // ErrorFromName establishes a simple pattern for returning error codes.
        //
        ErrorFromName: ErrorFromName
    });

    return ErrorFromName;

});


_winjs("WinJS/Core/_Events", ["exports","WinJS/Core/_Base"], function eventsInit(exports, _Base) {
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
        };
    }

    function createEventProperties() {
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

    var EventMixinEvent = _Base.Class.define(
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
            /// The listener to invoke when the event is raised.
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

    _Base.Namespace._moduleDefine(exports, "WinJS.Utilities", {
        _createEventProperty: createEventProperty,
        createEventProperties: createEventProperties,
        eventMixin: eventMixin
    });

});


_winjs("WinJS/Core/_Trace", ["WinJS/Core/_Global"], function traceInit(_Global) {
    "use strict";

    function nop(v) {
        return v;
    }

    return {
        _traceAsyncOperationStarting: (_Global.Debug && _Global.Debug.msTraceAsyncOperationStarting && _Global.Debug.msTraceAsyncOperationStarting.bind(_Global.Debug)) || nop,
        _traceAsyncOperationCompleted: (_Global.Debug && _Global.Debug.msTraceAsyncOperationCompleted && _Global.Debug.msTraceAsyncOperationCompleted.bind(_Global.Debug)) || nop,
        _traceAsyncCallbackStarting: (_Global.Debug && _Global.Debug.msTraceAsyncCallbackStarting && _Global.Debug.msTraceAsyncCallbackStarting.bind(_Global.Debug)) || nop,
        _traceAsyncCallbackCompleted: (_Global.Debug && _Global.Debug.msTraceAsyncCallbackCompleted && _Global.Debug.msTraceAsyncCallbackCompleted.bind(_Global.Debug)) || nop
    };
});
_winjs("WinJS/Promise/_StateMachine", ["WinJS/Core/_Global","WinJS/Core/_BaseCoreUtils","WinJS/Core/_Base","WinJS/Core/_ErrorFromName","WinJS/Core/_Events","WinJS/Core/_Trace"], function promiseStateMachineInit(_Global, _BaseCoreUtils, _Base, _ErrorFromName, _Events, _Trace) {
    "use strict";

    _Global.Debug && (_Global.Debug.setNonUserCodeExceptions = true);

    var ListenerType = _Base.Class.mix(_Base.Class.define(null, { /*empty*/ }, { supportedForProcessing: false }), _Events.eventMixin);
    var promiseEventListeners = new ListenerType();
    // make sure there is a listeners collection so that we can do a more trivial check below
    promiseEventListeners._listeners = {};
    var errorET = "error";
    var canceledName = "Canceled";
    var tagWithStack = false;
    var tag = {
        promise: 0x01,
        thenPromise: 0x02,
        errorPromise: 0x04,
        exceptionPromise: 0x08,
        completePromise: 0x10,
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
            // We can special case our own intermediate promises which are not in a
            //  terminal state by just pushing this promise as a listener without
            //  having to create new indirection functions
            if (waitedUpon instanceof ThenPromise &&
                waitedUpon._state !== state_error &&
                waitedUpon._state !== state_success) {
                pushListener(waitedUpon, { promise: promise });
            } else {
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
            }
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
                    p = queue.shift();
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
                    p = queue.shift();
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

    var PromiseStateMachine = _Base.Class.define(null, {
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
            this._state.done(this, onComplete, onError, onProgress);
        },
        then: function Promise_then(onComplete, onError, onProgress) {
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
        var asyncOpID = _Trace._traceAsyncOperationStarting("WinJS.Promise.done");
        pushListener(promise, { c: onComplete, e: onError, p: onProgress, asyncOpID: asyncOpID });
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

            _Trace._traceAsyncOperationCompleted(listener.asyncOpID, _Global.Debug && _Global.Debug.MS_ASYNC_OP_STATUS_SUCCESS);

            if (target) {
                _Trace._traceAsyncCallbackStarting(listener.asyncOpID);
                try {
                    target._setCompleteValue(onComplete ? onComplete(value) : value);
                } catch (ex) {
                    target._setExceptionValue(ex);
                } finally {
                    _Trace._traceAsyncCallbackCompleted();
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

            var errorID = _Global.Debug && (value && value.name === canceledName ? _Global.Debug.MS_ASYNC_OP_STATUS_CANCELED : _Global.Debug.MS_ASYNC_OP_STATUS_ERROR);
            _Trace._traceAsyncOperationCompleted(listener.asyncOpID, errorID);

            if (target) {
                var asyncCallbackStarted = false;
                try {
                    if (onError) {
                        _Trace._traceAsyncCallbackStarting(listener.asyncOpID);
                        asyncCallbackStarted = true;
                        if (!onError.handlesOnError) {
                            callonerror(target, value, detailsForHandledError, promise, onError);
                        }
                        target._setCompleteValue(onError(value));
                    } else {
                        target._setChainedErrorValue(value, promise);
                    }
                } catch (ex) {
                    target._setExceptionValue(ex);
                } finally {
                    if (asyncCallbackStarted) {
                        _Trace._traceAsyncCallbackCompleted();
                    }
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
        var asyncOpID = _Trace._traceAsyncOperationStarting("WinJS.Promise.then");
        pushListener(promise, { promise: result, c: onComplete, e: onError, p: onProgress, asyncOpID: asyncOpID });
        return result;
    }

    //
    // Internal implementation detail promise, ThenPromise is created when a promise needs
    // to be returned from a then() method.
    //
    var ThenPromise = _Base.Class.derive(PromiseStateMachine,
        function (creator) {

            if (tagWithStack && (tagWithStack === true || (tagWithStack & tag.thenPromise))) {
                this._stack = Promise._getStack();
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

    var ErrorPromise = _Base.Class.define(
        function ErrorPromise_ctor(value) {

            if (tagWithStack && (tagWithStack === true || (tagWithStack & tag.errorPromise))) {
                this._stack = Promise._getStack();
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
                Promise._doneHandler(value);
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

    var ExceptionPromise = _Base.Class.derive(ErrorPromise,
        function ExceptionPromise_ctor(value) {

            if (tagWithStack && (tagWithStack === true || (tagWithStack & tag.exceptionPromise))) {
                this._stack = Promise._getStack();
            }

            this._value = value;
            callonerror(this, value, detailsForException);
        }, {
            /* empty */
        }, {
            supportedForProcessing: false
        }
    );

    var CompletePromise = _Base.Class.define(
        function CompletePromise_ctor(value) {

            if (tagWithStack && (tagWithStack === true || (tagWithStack & tag.completePromise))) {
                this._stack = Promise._getStack();
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
                    Promise._doneHandler(ex);
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
        return new Promise(
            function (c) {
                if (timeoutMS) {
                    id = _Global.setTimeout(c, timeoutMS);
                } else {
                    _BaseCoreUtils._setImmediate(c);
                }
            },
            function () {
                if (id) {
                    _Global.clearTimeout(id);
                }
            }
        );
    }

    function timeoutWithPromise(timeout, promise) {
        var cancelPromise = function () { promise.cancel(); };
        var cancelTimeout = function () { timeout.cancel(); };
        timeout.then(cancelPromise);
        promise.then(cancelTimeout, cancelTimeout);
        return promise;
    }

    var staticCanceledPromise;

    var Promise = _Base.Class.derive(PromiseStateMachine,
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
                this._stack = Promise._getStack();
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
                // BEGIN monaco change
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
                // END monaco change
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
                    function (complete, error) {
                        var keys = Object.keys(values);
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
                                            complete(Promise.cancel);
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
                    return (staticCanceledPromise = staticCanceledPromise || new ErrorPromise(new _ErrorFromName(canceledName)));
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
                                        complete(Promise.cancel);
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
                if (_Global.Debug && _Global.Debug.debuggerEnabled) {
                    try { throw new Error(); } catch (e) { return e.stack; }
                }
            },

            _cancelBlocker: function Promise__cancelBlocker(input, oncancel) {
                //
                // Returns a promise which on cancelation will still result in downstream cancelation while
                //  protecting the promise 'input' from being  canceled which has the effect of allowing
                //  'input' to be shared amoung various consumers.
                //
                if (!Promise.is(input)) {
                    return Promise.wrap(input);
                }
                var complete;
                var error;
                var output = new Promise(
                    function (c, e) {
                        complete = c;
                        error = e;
                    },
                    function () {
                        complete = null;
                        error = null;
                        oncancel && oncancel();
                    }
                );
                input.then(
                    function (v) { complete && complete(v); },
                    function (e) { error && error(e); }
                );
                return output;
            },

        }
    );
    Object.defineProperties(Promise, _Events.createEventProperties(errorET));

    Promise._doneHandler = function (value) {
        _BaseCoreUtils._setImmediate(function Promise_done_rethrow() {
            throw value;
        });
    };

    return {
        PromiseStateMachine: PromiseStateMachine,
        Promise: Promise,
        state_created: state_created
    };
});

_winjs("WinJS/Promise", ["WinJS/Core/_Base","WinJS/Promise/_StateMachine"], function promiseInit( _Base, _StateMachine) {
    "use strict";

    _Base.Namespace.define("WinJS", {
        Promise: _StateMachine.Promise
    });

    return _StateMachine.Promise;
});

var exported = _modules["WinJS/Core/_WinJS"];

if (typeof exports === 'undefined' && typeof define === 'function' && define.amd) {
    define("vs/base/common/winjs.base.raw", exported);
} else {
    module.exports = exported;
}

if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
    _modules["WinJS/Core/_BaseCoreUtils"]._setImmediate = function(handler) {
        return process.nextTick(handler);
    };
}

})();
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[53], __M([0,1,80]), function (require, exports, assert) {
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
define(__m[38], __M([0,1,32,25,3,53,20,7]), function (require, exports, uuid, strings, platform, flow, fs, paths) {
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
define(__m[40], __M([0,1,45,6,77,78]), function (require, exports, url_1, types_1, HttpProxyAgent, HttpsProxyAgent) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[48], __M([0,1,30,19,10]), function (require, exports, cp, uri_1, objects_1) {
    "use strict";
    var boostrapPath = uri_1.default.parse(require.toUrl('bootstrap')).fsPath;
    function _spawnSharedProcess(options) {
        var execArgv = [];
        var env = objects_1.assign({}, process.env, {
            AMD_ENTRYPOINT: 'vs/code/node/sharedProcessMain'
        });
        if (options.allowOutput) {
            env['VSCODE_ALLOW_IO'] = 'true';
        }
        if (options.debugPort) {
            execArgv.push("--debug=" + options.debugPort);
        }
        var result = cp.fork(boostrapPath, ['--type=SharedProcess'], { env: env, execArgv: execArgv });
        // handshake
        result.once('message', function () { return result.send('hey'); });
        return result;
    }
    function spawnSharedProcess(options) {
        if (options === void 0) { options = {}; }
        var spawnCount = 0;
        var child;
        var spawn = function () {
            if (++spawnCount > 10) {
                return;
            }
            child = _spawnSharedProcess(options);
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

define(__m[57], __M([11,9]), function(nls, data) { return nls.create("vs/base/common/errors", data); });
define(__m[14], __M([0,1,57,10,3,6,16,25]), function (require, exports, nls, objects, platform, types, arrays, strings) {
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
    function readonly(name) {
        return name
            ? new Error("readonly property '" + name + " cannot be changed'")
            : new Error('readonly property cannot be changed');
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

define(__m[55], __M([0,1,14]), function (require, exports, errors_1) {
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

define(__m[18], __M([0,1,55]), function (require, exports, callbackList_1) {
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
    function fromPromise(promise) {
        var toCancel = null;
        var listener = null;
        var emitter = new Emitter({
            onFirstListenerAdd: function () {
                toCancel = promise.then(function (event) { return listener = event(function (e) { return emitter.fire(e); }); }, function () { return null; });
            },
            onLastListenerRemove: function () {
                if (toCancel) {
                    toCancel.cancel();
                    toCancel = null;
                }
                if (listener) {
                    listener.dispose();
                    listener = null;
                }
            }
        });
        return emitter.event;
    }
    exports.fromPromise = fromPromise;
    function mapEvent(event, map) {
        return function (listener, thisArgs, disposables) {
            if (thisArgs === void 0) { thisArgs = null; }
            return event(function (i) { return listener.call(thisArgs, map(i)); }, null, disposables);
        };
    }
    exports.mapEvent = mapEvent;
    function filterEvent(event, filter) {
        return function (listener, thisArgs, disposables) {
            if (thisArgs === void 0) { thisArgs = null; }
            return event(function (e) { return filter(e) && listener.call(thisArgs, e); }, null, disposables);
        };
    }
    exports.filterEvent = filterEvent;
    function debounceEvent(event, merger, delay) {
        if (delay === void 0) { delay = 100; }
        var subscription;
        var output;
        var handle;
        var emitter = new Emitter({
            onFirstListenerAdd: function () {
                subscription = event(function (cur) {
                    output = merger(output, cur);
                    clearTimeout(handle);
                    handle = setTimeout(function () {
                        var _output = output;
                        output = undefined;
                        emitter.fire(_output);
                    }, delay);
                });
            },
            onLastListenerRemove: function () {
                subscription.dispose();
            }
        });
        return emitter.event;
    }
    exports.debounceEvent = debounceEvent;
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
define(__m[46], __M([0,1,18]), function (require, exports, event_1) {
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

define(__m[2], __M([76,14]), function (winjs, __Errors__) {
	'use strict';

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

	return {
		Promise: winjs.Promise,
		TPromise: winjs.Promise,
		PPromise: winjs.Promise
	};
});
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





define(__m[34], __M([0,1,14,3,2,46,41]), function (require, exports, errors, platform, winjs_base_1, cancellation_1, lifecycle_1) {
    'use strict';
    function isThenable(obj) {
        return obj && typeof obj.then === 'function';
    }
    function toThenable(arg) {
        if (isThenable(arg)) {
            return arg;
        }
        else {
            return winjs_base_1.TPromise.as(arg);
        }
    }
    exports.toThenable = toThenable;
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
     * Hook a cancellation token to a WinJS Promise
     */
    function wireCancellationToken(token, promise) {
        token.onCancellationRequested(function () { return promise.cancel(); });
        return promise;
    }
    exports.wireCancellationToken = wireCancellationToken;
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
     * 		function deliver() {
     * 			const lettersToDeliver = letters;
     * 			letters = [];
     * 			return makeTheTrip(lettersToDeliver);
     * 		}
     *
     * 		function onLetterReceived(l) {
     * 			letters.push(l);
     * 			throttler.queue(deliver);
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
    // TODO@Joao: can the previous throttler be replaced with this?
    var SimpleThrottler = (function () {
        function SimpleThrottler() {
            this.current = winjs_base_1.TPromise.as(null);
        }
        SimpleThrottler.prototype.queue = function (promiseTask) {
            return this.current = this.current.then(function () { return promiseTask(); });
        };
        return SimpleThrottler;
    }());
    exports.SimpleThrottler = SimpleThrottler;
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
         * Cancel previous runner (if any) & schedule a new runner.
         */
        RunOnceScheduler.prototype.schedule = function (delay) {
            if (delay === void 0) { delay = this.timeout; }
            this.cancel();
            this.timeoutToken = platform.setTimeout(this.timeoutHandler, delay);
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
define(__m[50], __M([0,1,20,52,2,34]), function (require, exports, fs, crypto, winjs_base_1, async_1) {
    'use strict';
    function checksum(path, sha1hash) {
        var promise = new winjs_base_1.TPromise(function (c, e) {
            var input = fs.createReadStream(path);
            var hash = crypto.createHash('sha1');
            var hashStream = hash;
            input.pipe(hashStream);
            var done = async_1.once(function (err, result) {
                input.removeAllListeners();
                hashStream.removeAllListeners();
                if (err) {
                    e(err);
                }
                else {
                    c(result);
                }
            });
            input.once('error', done);
            input.once('end', done);
            hashStream.once('error', done);
            hashStream.once('data', function (data) { return done(null, data.toString('hex')); });
        });
        return promise.then(function (hash) {
            if (hash !== sha1hash) {
                return winjs_base_1.TPromise.wrapError(new Error('Hash mismatch'));
            }
            return winjs_base_1.TPromise.as(null);
        });
    }
    exports.checksum = checksum;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[35], __M([0,1,2,38,26,7,34,20]), function (require, exports, winjs_base_1, extfs, paths, path_1, async_1, fs) {
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
        return lstat(path).then(function (stat) {
            if (stat.isDirectory() && !stat.isSymbolicLink()) {
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
define(__m[36], __M([0,1,2,41,18]), function (require, exports, winjs_base_1, lifecycle_1, event_1) {
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
    var State;
    (function (State) {
        State[State["Uninitialized"] = 0] = "Uninitialized";
        State[State["Idle"] = 1] = "Idle";
    })(State || (State = {}));
    var Server = (function () {
        function Server(protocol) {
            var _this = this;
            this.protocol = protocol;
            this.channels = Object.create(null);
            this.activeRequests = Object.create(null);
            this.protocol.onMessage(function (r) { return _this.onMessage(r); });
            this.protocol.send({ type: ResponseType.Initialize });
        }
        Server.prototype.registerChannel = function (channelName, channel) {
            this.channels[channelName] = channel;
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
            var _this = this;
            var channel = this.channels[request.channelName];
            var promise;
            try {
                promise = channel.call(request.name, request.arg);
            }
            catch (err) {
                promise = winjs_base_1.Promise.wrapError(err);
            }
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
            this.activeRequests[request.id] = lifecycle_1.toDisposable(function () { return requestPromise.cancel(); });
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
            this.state = State.Uninitialized;
            this.bufferedRequests = [];
            this.handlers = Object.create(null);
            this.lastRequestId = 0;
            this.protocol.onMessage(function (r) { return _this.onMessage(r); });
        }
        Client.prototype.getChannel = function (channelName) {
            var _this = this;
            var call = function (command, arg) { return _this.request(channelName, command, arg); };
            return { call: call };
        };
        Client.prototype.request = function (channelName, name, arg) {
            var request = {
                raw: {
                    id: this.lastRequestId++,
                    type: RequestType.Common,
                    channelName: channelName,
                    name: name,
                    arg: arg
                }
            };
            if (this.state === State.Uninitialized) {
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
                if (_this.state !== State.Uninitialized) {
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
            if (this.state === State.Uninitialized && response.type === ResponseType.Initialize) {
                this.state = State.Idle;
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
    function getDelayedChannel(promise) {
        var call = function (command, arg) { return promise.then(function (c) { return c.call(command, arg); }); };
        return { call: call };
    }
    exports.getDelayedChannel = getDelayedChannel;
    function getNextTickChannel(channel) {
        var didTick = false;
        var call = function (command, arg) {
            if (didTick) {
                return channel.call(command, arg);
            }
            return winjs_base_1.TPromise.timeout(0)
                .then(function () { return didTick = true; })
                .then(function () { return channel.call(command, arg); });
        };
        return { call: call };
    }
    exports.getNextTickChannel = getNextTickChannel;
    function eventToCall(event) {
        var disposable;
        return new winjs_base_1.Promise(function (c, e, p) { return disposable = event(p); }, function () { return disposable.dispose(); });
    }
    exports.eventToCall = eventToCall;
    function eventFromCall(channel, name) {
        var promise;
        var emitter = new event_1.Emitter({
            onFirstListenerAdd: function () {
                promise = channel.call(name, null).then(null, function (err) { return null; }, function (e) { return emitter.fire(e); });
            },
            onLastListenerRemove: function () {
                promise.cancel();
                promise = null;
            }
        });
        return emitter.event;
    }
    exports.eventFromCall = eventFromCall;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[56], __M([0,1,82,2,18,36]), function (require, exports, net_1, winjs_base_1, event_1, ipc_1) {
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
            try {
                this.socket.write(JSON.stringify(message));
                this.socket.write(Protocol.Boundary);
            }
            catch (e) {
            }
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
            this.channels = Object.create(null);
            this.server.on('connection', function (socket) {
                var ipcServer = new ipc_1.Server(new Protocol(socket));
                Object.keys(_this.channels)
                    .forEach(function (name) { return ipcServer.registerChannel(name, _this.channels[name]); });
                socket.once('close', function () { return ipcServer.dispose(); });
            });
        }
        Server.prototype.registerChannel = function (channelName, channel) {
            this.channels[channelName] = channel;
        };
        Server.prototype.dispose = function () {
            this.channels = null;
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
            this.ipcClient = new ipc_1.Client(new Protocol(socket));
            socket.once('close', function () { return _this._onClose.fire(); });
        }
        Object.defineProperty(Client.prototype, "onClose", {
            get: function () { return this._onClose.event; },
            enumerable: true,
            configurable: true
        });
        Client.prototype.getChannel = function (channelName) {
            return this.ipcClient.getChannel(channelName);
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
            var server = net_1.createServer();
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
            var socket = net_1.createConnection(hook, function () {
                socket.removeListener('error', e);
                c(new Client(socket));
            });
            socket.once('error', e);
        });
    }
    exports.connect = connect;
});

define(__m[61], __M([11,9]), function(nls, data) { return nls.create("vs/base/common/json", data); });
define(__m[62], __M([0,1,61]), function (require, exports, nls_1) {
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
    /**
     * Creates a JSON scanner on the given text.
     * If ignoreTrivia is set, whitespaces or comments are ignored.
     */
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
        function setPosition(newPosition) {
            pos = newPosition;
            value = '';
            tokenOffset = 0;
            token = SyntaxKind.Unknown;
            scanError = ScanError.None;
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
                    return text.substring(start, pos);
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
                            var ch_1 = scanHexDigits(4, true);
                            if (ch_1 >= 0) {
                                result += String.fromCharCode(ch_1);
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
    })(exports.ParseErrorCode || (exports.ParseErrorCode = {}));
    var ParseErrorCode = exports.ParseErrorCode;
    function getParseErrorMessage(errorCode) {
        switch (errorCode) {
            case ParseErrorCode.InvalidSymbol: return nls_1.localize(0, null);
            case ParseErrorCode.InvalidNumberFormat: return nls_1.localize(1, null);
            case ParseErrorCode.PropertyNameExpected: return nls_1.localize(2, null);
            case ParseErrorCode.ValueExpected: return nls_1.localize(3, null);
            case ParseErrorCode.ColonExpected: return nls_1.localize(4, null);
            case ParseErrorCode.CommaExpected: return nls_1.localize(5, null);
            case ParseErrorCode.CloseBraceExpected: return nls_1.localize(6, null);
            case ParseErrorCode.CloseBracketExpected: return nls_1.localize(7, null);
            case ParseErrorCode.EndOfFileExpected: return nls_1.localize(8, null);
            default:
                return '';
        }
    }
    exports.getParseErrorMessage = getParseErrorMessage;
    function getLiteralNodeType(value) {
        switch (typeof value) {
            case 'boolean': return 'boolean';
            case 'number': return 'number';
            case 'string': return 'string';
            default: return 'null';
        }
    }
    /**
     * For a given offset, evaluate the location in the JSON document. Each segment in the location path is either a property name or an array index.
     */
    function getLocation(text, position) {
        var segments = []; // strings or numbers
        var earlyReturnException = new Object();
        var previousNode = void 0;
        var previousNodeInst = {
            value: void 0,
            offset: void 0,
            length: void 0,
            type: void 0
        };
        var isAtPropertyKey = false;
        function setPreviousNode(value, offset, length, type) {
            previousNodeInst.value = value;
            previousNodeInst.offset = offset;
            previousNodeInst.length = length;
            previousNodeInst.type = type;
            previousNodeInst.columnOffset = void 0;
            previousNode = previousNodeInst;
        }
        try {
            visit(text, {
                onObjectBegin: function (offset, length) {
                    if (position <= offset) {
                        throw earlyReturnException;
                    }
                    previousNode = void 0;
                    isAtPropertyKey = position > offset;
                    segments.push(''); // push a placeholder (will be replaced or removed)
                },
                onObjectProperty: function (name, offset, length) {
                    if (position < offset) {
                        throw earlyReturnException;
                    }
                    setPreviousNode(name, offset, length, 'property');
                    segments[segments.length - 1] = name;
                    if (position <= offset + length) {
                        throw earlyReturnException;
                    }
                },
                onObjectEnd: function (offset, length) {
                    if (position <= offset) {
                        throw earlyReturnException;
                    }
                    previousNode = void 0;
                    segments.pop();
                },
                onArrayBegin: function (offset, length) {
                    if (position <= offset) {
                        throw earlyReturnException;
                    }
                    previousNode = void 0;
                    segments.push(0);
                },
                onArrayEnd: function (offset, length) {
                    if (position <= offset) {
                        throw earlyReturnException;
                    }
                    previousNode = void 0;
                    segments.pop();
                },
                onLiteralValue: function (value, offset, length) {
                    if (position < offset) {
                        throw earlyReturnException;
                    }
                    setPreviousNode(value, offset, length, getLiteralNodeType(value));
                    if (position <= offset + length) {
                        throw earlyReturnException;
                    }
                },
                onSeparator: function (sep, offset, length) {
                    if (position <= offset) {
                        throw earlyReturnException;
                    }
                    if (sep === ':' && previousNode.type === 'property') {
                        previousNode.columnOffset = offset;
                        isAtPropertyKey = false;
                        previousNode = void 0;
                    }
                    else if (sep === ',') {
                        var last = segments[segments.length - 1];
                        if (typeof last === 'number') {
                            segments[segments.length - 1] = last + 1;
                        }
                        else {
                            isAtPropertyKey = true;
                            segments[segments.length - 1] = '';
                        }
                        previousNode = void 0;
                    }
                }
            });
        }
        catch (e) {
            if (e !== earlyReturnException) {
                throw e;
            }
        }
        if (segments[segments.length - 1] === '') {
            segments.pop();
        }
        return {
            path: segments,
            previousNode: previousNode,
            isAtPropertyKey: isAtPropertyKey,
            matches: function (pattern) {
                var k = 0;
                for (var i = 0; k < pattern.length && i < segments.length; i++) {
                    if (pattern[k] === segments[i] || pattern[k] === '*') {
                        k++;
                    }
                    else if (pattern[k] !== '**') {
                        return false;
                    }
                }
                return k === pattern.length;
            }
        };
    }
    exports.getLocation = getLocation;
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
            ensurePropertyComplete(valueNode.offset + valueNode.length);
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
                ensurePropertyComplete(offset);
                currentParent.length = offset + length - currentParent.offset;
                currentParent = currentParent.parent;
            },
            onArrayBegin: function (offset, length) {
                currentParent = onValue({ type: 'array', offset: offset, length: -1, parent: currentParent, children: [] });
            },
            onArrayEnd: function (offset, length) {
                currentParent.length = offset + length - currentParent.offset;
                currentParent = currentParent.parent;
            },
            onLiteralValue: function (value, offset, length) {
                onValue({ type: getLiteralNodeType(value), offset: offset, length: length, parent: currentParent, value: value });
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
        function scanNext() {
            while (true) {
                var token = _scanner.scan();
                switch (token) {
                    case SyntaxKind.LineCommentTrivia:
                    case SyntaxKind.BlockCommentTrivia:
                        if (disallowComments) {
                            handleError(ParseErrorCode.InvalidSymbol);
                        }
                        break;
                    case SyntaxKind.Unknown:
                        handleError(ParseErrorCode.InvalidSymbol);
                        break;
                    case SyntaxKind.Trivia:
                    case SyntaxKind.LineBreakTrivia:
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
        function parseString(isValue) {
            if (_scanner.getToken() !== SyntaxKind.StringLiteral) {
                return false;
            }
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
                case SyntaxKind.NumericLiteral:
                    var value = 0;
                    try {
                        value = JSON.parse(_scanner.getTokenValue());
                        if (typeof value !== 'number') {
                            handleError(ParseErrorCode.InvalidNumberFormat);
                            value = 0;
                        }
                    }
                    catch (e) {
                        handleError(ParseErrorCode.InvalidNumberFormat);
                    }
                    onLiteralValue(value);
                    break;
                case SyntaxKind.NullKeyword:
                    onLiteralValue(null);
                    break;
                case SyntaxKind.TrueKeyword:
                    onLiteralValue(true);
                    break;
                case SyntaxKind.FalseKeyword:
                    onLiteralValue(false);
                    break;
                default:
                    return false;
            }
            scanNext();
            return true;
        }
        function parseProperty() {
            if (!parseString(false)) {
                handleError(ParseErrorCode.PropertyNameExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
                return false;
            }
            if (_scanner.getToken() === SyntaxKind.ColonToken) {
                onSeparator(':');
                scanNext(); // consume colon
                if (!parseValue()) {
                    handleError(ParseErrorCode.ValueExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
                }
            }
            else {
                handleError(ParseErrorCode.ColonExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
            }
            return true;
        }
        function parseObject() {
            if (_scanner.getToken() !== SyntaxKind.OpenBraceToken) {
                return false;
            }
            onObjectBegin();
            scanNext(); // consume open brace
            var needsComma = false;
            while (_scanner.getToken() !== SyntaxKind.CloseBraceToken && _scanner.getToken() !== SyntaxKind.EOF) {
                if (_scanner.getToken() === SyntaxKind.CommaToken) {
                    if (!needsComma) {
                        handleError(ParseErrorCode.ValueExpected, [], []);
                    }
                    onSeparator(',');
                    scanNext(); // consume comma
                }
                else if (needsComma) {
                    handleError(ParseErrorCode.CommaExpected, [], []);
                }
                if (!parseProperty()) {
                    handleError(ParseErrorCode.ValueExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
                }
                needsComma = true;
            }
            onObjectEnd();
            if (_scanner.getToken() !== SyntaxKind.CloseBraceToken) {
                handleError(ParseErrorCode.CloseBraceExpected, [SyntaxKind.CloseBraceToken], []);
            }
            else {
                scanNext(); // consume close brace
            }
            return true;
        }
        function parseArray() {
            if (_scanner.getToken() !== SyntaxKind.OpenBracketToken) {
                return false;
            }
            onArrayBegin();
            scanNext(); // consume open bracket
            var needsComma = false;
            while (_scanner.getToken() !== SyntaxKind.CloseBracketToken && _scanner.getToken() !== SyntaxKind.EOF) {
                if (_scanner.getToken() === SyntaxKind.CommaToken) {
                    if (!needsComma) {
                        handleError(ParseErrorCode.ValueExpected, [], []);
                    }
                    onSeparator(',');
                    scanNext(); // consume comma
                }
                else if (needsComma) {
                    handleError(ParseErrorCode.CommaExpected, [], []);
                }
                if (!parseValue()) {
                    handleError(ParseErrorCode.ValueExpected, [], [SyntaxKind.CloseBracketToken, SyntaxKind.CommaToken]);
                }
                needsComma = true;
            }
            onArrayEnd();
            if (_scanner.getToken() !== SyntaxKind.CloseBracketToken) {
                handleError(ParseErrorCode.CloseBracketExpected, [SyntaxKind.CloseBracketToken], []);
            }
            else {
                scanNext(); // consume close bracket
            }
            return true;
        }
        function parseValue() {
            return parseArray() || parseObject() || parseString(true) || parseLiteral();
        }
        scanNext();
        if (_scanner.getToken() === SyntaxKind.EOF) {
            return true;
        }
        if (!parseValue()) {
            handleError(ParseErrorCode.ValueExpected, [], []);
            return false;
        }
        if (_scanner.getToken() !== SyntaxKind.EOF) {
            handleError(ParseErrorCode.EndOfFileExpected, [], []);
        }
        return true;
    }
    exports.visit = visit;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[66], __M([0,1,20,7,62,10,2,18]), function (require, exports, fs, path, json, objects, winjs_base_1, event_1) {
    'use strict';
    var UserSettings = (function () {
        function UserSettings(appSettingsPath, appKeybindingsPath) {
            this.appSettingsPath = appSettingsPath;
            this.appKeybindingsPath = appKeybindingsPath;
            this._onChange = new event_1.Emitter();
            this.registerWatchers();
        }
        UserSettings.getValue = function (userDataPath, key, fallback) {
            // TODO@joao cleanup!
            var appSettingsPath = path.join(userDataPath, 'User', 'settings.json');
            return new winjs_base_1.TPromise(function (c, e) {
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

define(__m[69], __M([11,9]), function(nls, data) { return nls.create("vs/base/common/keyCodes", data); });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[70], __M([0,1,69,3]), function (require, exports, nls, defaultPlatform) {
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
        CommonKeybindings.WINCTRL_P = KeyMod.WinCtrl | KeyCode.KEY_P;
        CommonKeybindings.SHIFT_UP_ARROW = KeyMod.Shift | KeyCode.UpArrow;
        CommonKeybindings.CTRLCMD_UP_ARROW = KeyMod.CtrlCmd | KeyCode.UpArrow;
        CommonKeybindings.DOWN_ARROW = KeyCode.DownArrow;
        CommonKeybindings.WINCTRL_N = KeyMod.WinCtrl | KeyCode.KEY_N;
        CommonKeybindings.SHIFT_DOWN_ARROW = KeyMod.Shift | KeyCode.DownArrow;
        CommonKeybindings.CTRLCMD_DOWN_ARROW = KeyMod.CtrlCmd | KeyCode.DownArrow;
        CommonKeybindings.LEFT_ARROW = KeyCode.LeftArrow;
        CommonKeybindings.RIGHT_ARROW = KeyCode.RightArrow;
        CommonKeybindings.HOME = KeyCode.Home;
        CommonKeybindings.END = KeyCode.End;
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
         * See https://github.com/electron/electron/blob/master/docs/api/accelerator.md
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
         * See https://github.com/electron/electron/blob/master/docs/api/accelerator.md
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


define(__m[42], __M([11,9]), function(nls, data) { return nls.create("vs/code/electron-main/menus", data); });
define(__m[43], __M([11,9]), function(nls, data) { return nls.create("vs/code/electron-main/windows", data); });
define(__m[44], __M([11,9]), function(nls, data) { return nls.create("vs/code/node/argv", data); });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[72], __M([0,1,24,79,44]), function (require, exports, os, minimist, nls_1) {
    "use strict";
    var options = {
        string: [
            'locale',
            'user-data-dir',
            'extensionHomePath',
            'extensionDevelopmentPath',
            'extensionTestsPath',
            'timestamp',
            'install-extension',
            'uninstall-extension'
        ],
        boolean: [
            'help',
            'version',
            'wait',
            'diff',
            'goto',
            'new-window',
            'reuse-window',
            'performance',
            'verbose',
            'logExtensionHostCommunication',
            'disable-extensions',
            'list-extensions'
        ],
        alias: {
            help: 'h',
            version: 'v',
            wait: 'w',
            diff: 'd',
            goto: 'g',
            'new-window': 'n',
            'reuse-window': 'r',
            performance: 'p',
            'disable-extensions': 'disableExtensions'
        }
    };
    function parseArgs(args) {
        return minimist(args, options);
    }
    exports.parseArgs = parseArgs;
    var executable = 'code' + (os.platform() === 'win32' ? '.exe' : '');
    exports.optionsHelp = {
        '-d, --diff': nls_1.localize(0, null),
        '--disable-extensions': nls_1.localize(1, null),
        '-g, --goto': nls_1.localize(2, null),
        '--locale <locale>': nls_1.localize(3, null),
        '-n, --new-window': nls_1.localize(4, null),
        '-p, --performance': nls_1.localize(5, null),
        '-r, --reuse-window': nls_1.localize(6, null),
        '--user-data-dir <dir>': nls_1.localize(7, null),
        '--verbose': nls_1.localize(8, null),
        '-w, --wait': nls_1.localize(9, null),
        '--extensionHomePath': nls_1.localize(10, null),
        '--list-extensions': nls_1.localize(11, null),
        '--install-extension <ext>': nls_1.localize(12, null),
        '--uninstall-extension <ext>': nls_1.localize(13, null),
        '-v, --version': nls_1.localize(14, null),
        '-h, --help': nls_1.localize(15, null)
    };
    function formatOptions(options, columns) {
        var keys = Object.keys(options);
        var argLength = Math.max.apply(null, keys.map(function (k) { return k.length; })) + 2 /*left padding*/ + 1;
        if (columns - argLength < 25) {
            // Use a condensed version on narrow terminals
            return keys.reduce(function (r, key) { return r.concat([("  " + key), ("      " + options[key])]); }, []).join('\n');
        }
        var descriptionColumns = columns - argLength - 1;
        var result = '';
        keys.forEach(function (k) {
            var wrappedDescription = wrapText(options[k], descriptionColumns);
            var keyPadding = ' '.repeat(argLength - k.length - 2 /*left padding*/);
            if (result.length > 0) {
                result += '\n';
            }
            result += '  ' + k + keyPadding + wrappedDescription[0];
            for (var i = 1; i < wrappedDescription.length; i++) {
                result += '\n' + ' '.repeat(argLength) + wrappedDescription[i];
            }
        });
        return result;
    }
    exports.formatOptions = formatOptions;
    function wrapText(text, columns) {
        var lines = [];
        while (text.length) {
            var index = text.length < columns ? text.length : text.lastIndexOf(' ', columns);
            var line = text.slice(0, index).trim();
            text = text.slice(index);
            lines.push(line);
        }
        return lines;
    }
    function buildHelpMessage(version) {
        var columns = process.stdout.isTTY ? process.stdout.columns : 80;
        return "Visual Studio Code v" + version + "\n\n\nUsage: " + executable + " [arguments] [paths...]\n\nOptions:\n" + formatOptions(exports.optionsHelp, columns);
    }
    exports.buildHelpMessage = buildHelpMessage;
});

define(__m[47], __M([11,9]), function(nls, data) { return nls.create("vs/workbench/parts/git/electron-main/askpassService", data); });





define(__m[29], __M([0,1,14]), function (require, exports, errors_1) {
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
                throw errors_1.illegalArgument('can not be falsy');
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

define(__m[5], __M([0,1]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // ------ internal util
    var _util;
    (function (_util) {
        _util.DI_TARGET = '$di$target';
        _util.DI_DEPENDENCIES = '$di$dependencies';
        function getServiceDependencies(ctor) {
            return ctor[_util.DI_DEPENDENCIES] || [];
        }
        _util.getServiceDependencies = getServiceDependencies;
    })(_util = exports._util || (exports._util = {}));
    exports.IInstantiationService = createDecorator('instantiationService');
    function storeServiceDependency(id, target, index, optional) {
        if (target[_util.DI_TARGET] === target) {
            target[_util.DI_DEPENDENCIES].push({ id: id, index: index, optional: optional });
        }
        else {
            target[_util.DI_DEPENDENCIES] = [{ id: id, index: index, optional: optional }];
            target[_util.DI_TARGET] = target;
        }
    }
    /**
     * A *only* valid way to create a {{ServiceIdentifier}}.
     */
    function createDecorator(serviceId) {
        var id = function (target, key, index) {
            if (arguments.length !== 3) {
                throw new Error('@IServiceName-decorator can only be used to decorate a parameter');
            }
            storeServiceDependency(id, target, index, false);
        };
        id.toString = function () { return serviceId; };
        return id;
    }
    exports.createDecorator = createDecorator;
    /**
     * Mark a service dependency as optional.
     */
    function optional(serviceIdentifier) {
        return function (target, key, index) {
            if (arguments.length !== 3) {
                throw new Error('@optional-decorator can only be used to decorate a parameter');
            }
            storeServiceDependency(serviceIdentifier, target, index, true);
        };
    }
    exports.optional = optional;
});

define(__m[31], __M([0,1,16]), function (require, exports, arrays_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ServiceCollection = (function () {
        function ServiceCollection() {
            var entries = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                entries[_i - 0] = arguments[_i];
            }
            this._entries = [];
            for (var _c = 0, entries_1 = entries; _c < entries_1.length; _c++) {
                var entry = entries_1[_c];
                this.set(entry[0], entry[1]);
            }
        }
        ServiceCollection.prototype.set = function (id, instanceOrDescriptor) {
            var entry = [id, instanceOrDescriptor];
            var idx = arrays_1.binarySearch(this._entries, entry, ServiceCollection._entryCompare);
            if (idx < 0) {
                // new element
                this._entries.splice(~idx, 0, entry);
            }
            else {
                var old = this._entries[idx];
                this._entries[idx] = entry;
                return old[1];
            }
        };
        ServiceCollection.prototype.forEach = function (callback) {
            for (var _i = 0, _c = this._entries; _i < _c.length; _i++) {
                var entry = _c[_i];
                var id = entry[0], instanceOrDescriptor = entry[1];
                callback(id, instanceOrDescriptor);
            }
        };
        ServiceCollection.prototype.has = function (id) {
            return arrays_1.binarySearch(this._entries, ServiceCollection._searchEntry(id), ServiceCollection._entryCompare) >= 0;
        };
        ServiceCollection.prototype.get = function (id) {
            var idx = arrays_1.binarySearch(this._entries, ServiceCollection._searchEntry(id), ServiceCollection._entryCompare);
            if (idx >= 0) {
                return this._entries[idx][1];
            }
        };
        ServiceCollection._searchEntry = function (id) {
            ServiceCollection._dummy[0] = id;
            return ServiceCollection._dummy;
        };
        ServiceCollection._entryCompare = function (a, b) {
            var _a = a[0].toString();
            var _b = b[0].toString();
            if (_a < _b) {
                return -1;
            }
            else if (_a > _b) {
                return 1;
            }
            else {
                return 0;
            }
        };
        ServiceCollection._dummy = [undefined, undefined];
        return ServiceCollection;
    }());
    exports.ServiceCollection = ServiceCollection;
});

define(__m[51], __M([0,1,2,14,6,60,54,29,5,31]), function (require, exports, winjs_base_1, errors_1, types_1, assert, graph_1, descriptors_1, instantiation_1, serviceCollection_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var InstantiationService = (function () {
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
                            throw new Error("[invokeFunction] unkown service '" + id + "'");
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
            if (param instanceof descriptors_1.AsyncDescriptor) {
                // async
                return this._createInstanceAsync(param, rest);
            }
            else if (param instanceof descriptors_1.SyncDescriptor) {
                // sync
                return this._createInstance(param, rest);
            }
            else {
                // sync, just ctor
                return this._createInstance(new descriptors_1.SyncDescriptor(param), rest);
            }
        };
        InstantiationService.prototype._createInstanceAsync = function (descriptor, args) {
            var _this = this;
            var canceledError;
            return new winjs_base_1.TPromise(function (c, e, p) {
                require([descriptor.moduleName], function (_module) {
                    if (canceledError) {
                        e(canceledError);
                    }
                    if (!_module) {
                        return e(errors_1.illegalArgument('module not found: ' + descriptor.moduleName));
                    }
                    var ctor;
                    if (!descriptor.ctorName) {
                        ctor = _module;
                    }
                    else {
                        ctor = _module[descriptor.ctorName];
                    }
                    if (typeof ctor !== 'function') {
                        return e(errors_1.illegalArgument('not a function: ' + descriptor.ctorName || descriptor.moduleName));
                    }
                    try {
                        args.unshift.apply(args, descriptor.staticArguments()); // instead of spread in ctor call
                        c(_this._createInstance(new descriptors_1.SyncDescriptor(ctor), args));
                    }
                    catch (error) {
                        return e(error);
                    }
                }, e);
            }, function () {
                canceledError = errors_1.canceled();
            });
        };
        InstantiationService.prototype._createInstance = function (desc, args) {
            var _this = this;
            // arguments given by createInstance-call and/or the descriptor
            var staticArgs = desc.staticArguments().concat(args);
            // arguments defined by service decorators
            var serviceDependencies = instantiation_1._util.getServiceDependencies(desc.ctor).sort(function (a, b) { return a.index - b.index; });
            var serviceArgs = serviceDependencies.map(function (dependency) {
                var service = _this._getOrCreateServiceInstance(dependency.id);
                if (!service && _this._strict && !dependency.optional) {
                    throw new Error("[createInstance] " + desc.ctor.name + " depends on UNKNOWN service " + dependency.id + ".");
                }
                return service;
            });
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
            var instance = types_1.create.apply(null, argArray);
            desc._validate(instance);
            return instance;
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
                    if (!instanceOrDesc) {
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
define(__m[23], __M([0,1,7,19]), function (require, exports, path, uri_1) {
    "use strict";
    var rootPath = path.dirname(uri_1.default.parse(require.toUrl('')).fsPath);
    var packageJsonPath = path.join(rootPath, 'package.json');
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = require.__$__nodeRequire(packageJsonPath);
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[33], __M([0,1,7,19]), function (require, exports, path, uri_1) {
    "use strict";
    var rootPath = path.dirname(uri_1.default.parse(require.toUrl('')).fsPath);
    var productJsonPath = path.join(rootPath, 'product.json');
    var product = require.__$__nodeRequire(productJsonPath);
    if (process.env['VSCODE_DEV']) {
        product.nameShort += ' Dev';
        product.nameLong += ' Dev';
        product.dataFolderName += '-dev';
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = product;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[4], __M([0,1,52,21,7,24,8,35,16,25,26,2,3,19,6,5,33,72,23]), function (require, exports, crypto, fs, path, os, electron_1, pfs_1, arrays, strings, paths, winjs_base_1, platform, uri_1, types, instantiation_1, product_1, argv_1, package_1) {
    'use strict';
    exports.IEnvironmentService = instantiation_1.createDecorator('mainEnvironmentService');
    function getNumericValue(value, defaultValue, fallback) {
        if (fallback === void 0) { fallback = void 0; }
        var numericValue = parseInt(value);
        if (types.isNumber(numericValue)) {
            return numericValue;
        }
        if (value) {
            return defaultValue;
        }
        return fallback;
    }
    var EnvService = (function () {
        function EnvService() {
            this._appRoot = path.dirname(uri_1.default.parse(require.toUrl('')).fsPath);
            this._currentWorkingDirectory = process.env['VSCODE_CWD'] || process.cwd();
            this._appHome = electron_1.app.getPath('userData');
            this._appSettingsHome = path.join(this._appHome, 'User');
            this._appSettingsPath = path.join(this._appSettingsHome, 'settings.json');
            this._appKeybindingsPath = path.join(this._appSettingsHome, 'keybindings.json');
            // Remove the Electron executable
            var _a = process.argv, args = _a.slice(1);
            // If dev, remove the first non-option argument: it's the app location
            if (!this.isBuilt) {
                var index = arrays.firstIndex(args, function (a) { return !/^-/.test(a); });
                if (index > -1) {
                    args.splice(index, 1);
                }
            }
            // Finally, prepend any extra arguments from the 'argv' file
            if (fs.existsSync(path.join(this._appRoot, 'argv'))) {
                var extraargs = JSON.parse(fs.readFileSync(path.join(this._appRoot, 'argv'), 'utf8'));
                args = extraargs.concat(args);
            }
            var argv = argv_1.parseArgs(args);
            var debugBrkExtensionHostPort = getNumericValue(argv.debugBrkPluginHost, 5870);
            var debugExtensionHostPort = getNumericValue(argv.debugPluginHost, 5870, this.isBuilt ? void 0 : 5870);
            var pathArguments = parsePathArguments(this._currentWorkingDirectory, argv._, argv.goto);
            var timestamp = parseInt(argv.timestamp);
            var debugBrkFileWatcherPort = getNumericValue(argv.debugBrkFileWatcherPort, void 0);
            this._cliArgs = Object.freeze({
                pathArguments: pathArguments,
                programStart: types.isNumber(timestamp) ? timestamp : 0,
                enablePerformance: argv.performance,
                verboseLogging: argv.verbose,
                debugExtensionHostPort: debugBrkExtensionHostPort || debugExtensionHostPort,
                debugBrkExtensionHost: !!debugBrkExtensionHostPort,
                logExtensionHostCommunication: argv.logExtensionHostCommunication,
                debugBrkFileWatcherPort: debugBrkFileWatcherPort,
                openNewWindow: argv['new-window'],
                openInSameWindow: argv['reuse-window'],
                gotoLineMode: argv.goto,
                diffMode: argv.diff && pathArguments.length === 2,
                extensionsHomePath: normalizePath(argv.extensionHomePath),
                extensionDevelopmentPath: normalizePath(argv.extensionDevelopmentPath),
                extensionTestsPath: normalizePath(argv.extensionTestsPath),
                disableExtensions: argv['disable-extensions'],
                locale: argv.locale,
                waitForWindowClose: argv.wait
            });
            this._isTestingFromCli = this.cliArgs.extensionTestsPath && !this.cliArgs.debugBrkExtensionHost;
            this._userHome = path.join(os.homedir(), product_1.default.dataFolderName);
            this._userExtensionsHome = this.cliArgs.extensionsHomePath || path.join(this._userHome, 'extensions');
            var prefix = this.getIPCHandleBaseName();
            var suffix = process.platform === 'win32' ? '-sock' : '.sock';
            this._mainIPCHandle = prefix + "-" + package_1.default.version + suffix;
            this._sharedIPCHandle = prefix + "-" + package_1.default.version + "-shared" + suffix;
        }
        Object.defineProperty(EnvService.prototype, "cliArgs", {
            get: function () { return this._cliArgs; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "userExtensionsHome", {
            get: function () { return this._userExtensionsHome; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "isTestingFromCli", {
            get: function () { return this._isTestingFromCli; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "isBuilt", {
            get: function () { return !process.env['VSCODE_DEV']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "product", {
            get: function () { return product_1.default; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "updateUrl", {
            get: function () { return product_1.default.updateUrl; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "quality", {
            get: function () { return product_1.default.quality; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "userHome", {
            get: function () { return this._userHome; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "appRoot", {
            get: function () { return this._appRoot; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "currentWorkingDirectory", {
            get: function () { return this._currentWorkingDirectory; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "appHome", {
            get: function () { return this._appHome; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "appSettingsHome", {
            get: function () { return this._appSettingsHome; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "appSettingsPath", {
            get: function () { return this._appSettingsPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "appKeybindingsPath", {
            get: function () { return this._appKeybindingsPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "mainIPCHandle", {
            get: function () { return this._mainIPCHandle; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvService.prototype, "sharedIPCHandle", {
            get: function () { return this._sharedIPCHandle; },
            enumerable: true,
            configurable: true
        });
        EnvService.prototype.getIPCHandleBaseName = function () {
            var name = package_1.default.name;
            // Support to run VS Code multiple times as different user
            // by making the socket unique over the logged in user
            var userId = EnvService.getUniqueUserId();
            if (userId) {
                name += "-" + userId;
            }
            if (process.platform === 'win32') {
                return "\\\\.\\pipe\\" + name;
            }
            return path.join(os.tmpdir(), name);
        };
        EnvService.getUniqueUserId = function () {
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
        };
        EnvService.prototype.createPaths = function () {
            var promises = [this.appSettingsHome, this.userHome, this.userExtensionsHome]
                .map(function (p) { return pfs_1.mkdirp(p); });
            return winjs_base_1.TPromise.join(promises);
        };
        return EnvService;
    }());
    exports.EnvService = EnvService;
    function parsePathArguments(cwd, args, gotoLineMode) {
        var result = args.map(function (arg) {
            var pathCandidate = String(arg);
            var parsedPath;
            if (gotoLineMode) {
                parsedPath = parseLineAndColumnAware(pathCandidate);
                pathCandidate = parsedPath.path;
            }
            if (pathCandidate) {
                pathCandidate = preparePath(cwd, pathCandidate);
            }
            var realPath;
            try {
                realPath = fs.realpathSync(pathCandidate);
            }
            catch (error) {
                // in case of an error, assume the user wants to create this file
                // if the path is relative, we join it to the cwd
                realPath = path.normalize(path.isAbsolute(pathCandidate) ? pathCandidate : path.join(cwd, pathCandidate));
            }
            var basename = path.basename(realPath);
            if (basename /* can be empty if code is opened on root */ && !paths.isValidBasename(basename)) {
                return null; // do not allow invalid file names
            }
            if (gotoLineMode) {
                parsedPath.path = realPath;
                return toLineAndColumnPath(parsedPath);
            }
            return realPath;
        });
        var caseInsensitive = platform.isWindows || platform.isMacintosh;
        var distinct = arrays.distinct(result, function (e) { return e && caseInsensitive ? e.toLowerCase() : e; });
        return arrays.coalesce(distinct);
    }
    function preparePath(cwd, p) {
        // Trim trailing quotes
        if (platform.isWindows) {
            p = strings.rtrim(p, '"'); // https://github.com/Microsoft/vscode/issues/1498
        }
        // Trim whitespaces
        p = strings.trim(strings.trim(p, ' '), '\t');
        if (platform.isWindows) {
            // Resolve the path against cwd if it is relative
            p = path.resolve(cwd, p);
            // Trim trailing '.' chars on Windows to prevent invalid file names
            p = strings.rtrim(p, '.');
        }
        return p;
    }
    function normalizePath(p) {
        return p ? path.normalize(p) : p;
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(__m[17], __M([0,1,5,4]), function (require, exports, instantiation_1, env_1) {
    'use strict';
    exports.ILogService = instantiation_1.createDecorator('logService');
    var MainLogService = (function () {
        function MainLogService(envService) {
            this.envService = envService;
        }
        MainLogService.prototype.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var verboseLogging = this.envService.cliArgs.verboseLogging;
            if (verboseLogging) {
                console.log.apply(console, ["(" + new Date().toLocaleTimeString() + ")"].concat(args));
            }
        };
        MainLogService = __decorate([
            __param(0, env_1.IEnvironmentService)
        ], MainLogService);
        return MainLogService;
    }());
    exports.MainLogService = MainLogService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[15], __M([0,1,8,5,66,4]), function (require, exports, electron_1, instantiation_1, userSettings_1, env_1) {
    'use strict';
    exports.ISettingsService = instantiation_1.createDecorator('settingsService');
    var SettingsManager = (function (_super) {
        __extends(SettingsManager, _super);
        function SettingsManager(envService) {
            var _this = this;
            _super.call(this, envService.appSettingsPath, envService.appKeybindingsPath);
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
        SettingsManager = __decorate([
            __param(0, env_1.IEnvironmentService)
        ], SettingsManager);
        return SettingsManager;
    }(userSettings_1.UserSettings));
    exports.SettingsManager = SettingsManager;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[13], __M([0,1,7,21,12,4,5]), function (require, exports, path, fs, events_1, env_1, instantiation_1) {
    'use strict';
    var EventTypes = {
        STORE: 'store'
    };
    exports.IStorageService = instantiation_1.createDecorator('storageService');
    var StorageService = (function () {
        function StorageService(envService) {
            this.envService = envService;
            this.database = null;
            this.eventEmitter = new events_1.EventEmitter();
            this.dbPath = path.join(envService.appHome, 'storage.json');
        }
        StorageService.prototype.onStore = function (clb) {
            var _this = this;
            this.eventEmitter.addListener(EventTypes.STORE, clb);
            return function () { return _this.eventEmitter.removeListener(EventTypes.STORE, clb); };
        };
        StorageService.prototype.getItem = function (key, defaultValue) {
            if (!this.database) {
                this.database = this.load();
            }
            var res = this.database[key];
            if (typeof res === 'undefined') {
                return defaultValue;
            }
            return this.database[key];
        };
        StorageService.prototype.setItem = function (key, data) {
            if (!this.database) {
                this.database = this.load();
            }
            // Shortcut for primitives that did not change
            if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
                if (this.database[key] === data) {
                    return;
                }
            }
            var oldValue = this.database[key];
            this.database[key] = data;
            this.save();
            this.eventEmitter.emit(EventTypes.STORE, key, oldValue, data);
        };
        StorageService.prototype.removeItem = function (key) {
            if (!this.database) {
                this.database = this.load();
            }
            if (this.database[key]) {
                var oldValue = this.database[key];
                delete this.database[key];
                this.save();
                this.eventEmitter.emit(EventTypes.STORE, key, oldValue, null);
            }
        };
        StorageService.prototype.load = function () {
            try {
                return JSON.parse(fs.readFileSync(this.dbPath).toString());
            }
            catch (error) {
                if (this.envService.cliArgs.verboseLogging) {
                    console.error(error);
                }
                return {};
            }
        };
        StorageService.prototype.save = function () {
            fs.writeFileSync(this.dbPath, JSON.stringify(this.database, null, 4));
        };
        StorageService = __decorate([
            __param(0, env_1.IEnvironmentService)
        ], StorageService);
        return StorageService;
    }());
    exports.StorageService = StorageService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[37], __M([0,1,7,3,10,13,8,2,4,17]), function (require, exports, path, platform, objects, storage_1, electron_1, winjs_base_1, env_1, log_1) {
    'use strict';
    (function (WindowMode) {
        WindowMode[WindowMode["Maximized"] = 0] = "Maximized";
        WindowMode[WindowMode["Normal"] = 1] = "Normal";
        WindowMode[WindowMode["Minimized"] = 2] = "Minimized";
        WindowMode[WindowMode["Fullscreen"] = 3] = "Fullscreen";
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
        function VSCodeWindow(config, logService, envService, storageService) {
            this.logService = logService;
            this.envService = envService;
            this.storageService = storageService;
            this.options = config;
            this._lastFocusTime = -1;
            this._readyState = ReadyState.NONE;
            this._extensionDevelopmentPath = config.extensionDevelopmentPath;
            this.whenReadyCallbacks = [];
            // Load window state
            this.restoreWindowState(config.state);
            // For VS theme we can show directly because background is white
            var usesLightTheme = /vs($| )/.test(this.storageService.getItem(VSCodeWindow.themeStorageKey));
            if (!global.windowShow) {
                global.windowShow = Date.now();
            }
            // in case we are maximized or fullscreen, only show later after the call to maximize/fullscreen (see below)
            var isFullscreenOrMaximized = (this.currentWindowMode === WindowMode.Maximized || this.currentWindowMode === WindowMode.Fullscreen);
            var options = {
                width: this.windowState.width,
                height: this.windowState.height,
                x: this.windowState.x,
                y: this.windowState.y,
                backgroundColor: usesLightTheme ? '#FFFFFF' : platform.isMacintosh ? '#131313' : '#1E1E1E',
                minWidth: VSCodeWindow.MIN_WIDTH,
                minHeight: VSCodeWindow.MIN_HEIGHT,
                show: !isFullscreenOrMaximized,
                title: this.envService.product.nameLong,
                webPreferences: {
                    'backgroundThrottling': false // by default if Code is in the background, intervals and timeouts get throttled
                }
            };
            if (platform.isLinux) {
                options.icon = path.join(this.envService.appRoot, 'resources/linux/code.png'); // Windows and Mac are better off using the embedded icon(s)
            }
            // Create the browser window.
            this._win = new electron_1.BrowserWindow(options);
            this._id = this._win.id;
            if (isFullscreenOrMaximized) {
                this.win.maximize();
                if (this.currentWindowMode === WindowMode.Fullscreen) {
                    this.win.setFullScreen(true);
                }
                if (!this.win.isVisible()) {
                    this.win.show(); // to reduce flicker from the default window size to maximize, we only show after maximize
                }
            }
            this._lastFocusTime = Date.now(); // since we show directly, we need to set the last focus time too
            if (this.storageService.getItem(VSCodeWindow.menuBarHiddenKey, false)) {
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
            if (this._win.isMinimized()) {
                this._win.restore();
            }
            this._win.focus();
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
                        global.windowShow = Date.now();
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
                _this._lastFocusTime = Date.now();
            });
            // Window Failed to load
            this._win.webContents.on('did-fail-load', function (event, errorCode, errorDescription) {
                console.warn('[electron event]: fail to load, ', errorDescription);
            });
            // Prevent any kind of navigation triggered by the user!
            // But do not touch this in dev version because it will prevent "Reload" from dev tools
            if (this.envService.isBuilt) {
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
                configuration.logExtensionHostCommunication = cli.logExtensionHostCommunication;
                configuration.debugBrkFileWatcherPort = cli.debugBrkFileWatcherPort;
                configuration.debugExtensionHostPort = cli.debugExtensionHostPort;
                configuration.debugBrkExtensionHost = cli.debugBrkExtensionHost;
                configuration.extensionsHomePath = cli.extensionsHomePath;
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
                return {
                    mode: WindowMode.Fullscreen
                };
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
                    this.logService.log("Unexpected error validating window state: " + err + "\n" + err.stack); // somehow display API can be picky about the state to validate
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
            if (state.mode === WindowMode.Fullscreen) {
                if (this.options.allowFullscreen) {
                    return state;
                }
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
                    this.setMenuBarVisibility(!this.storageService.getItem(VSCodeWindow.menuBarHiddenKey, false)); // restore as configured
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
        VSCodeWindow.themeStorageKey = 'theme';
        VSCodeWindow.MIN_WIDTH = 200;
        VSCodeWindow.MIN_HEIGHT = 120;
        VSCodeWindow = __decorate([
            __param(1, log_1.ILogService),
            __param(2, env_1.IEnvironmentService),
            __param(3, storage_1.IStorageService)
        ], VSCodeWindow);
        return VSCodeWindow;
    }());
    exports.VSCodeWindow = VSCodeWindow;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[22], __M([0,1,12,8,2,37,4,5,17,13]), function (require, exports, events_1, electron_1, winjs_base_1, window_1, env_1, instantiation_1, log_1, storage_1) {
    'use strict';
    var EventTypes = {
        BEFORE_QUIT: 'before-quit'
    };
    exports.ILifecycleService = instantiation_1.createDecorator('lifecycleService');
    var LifecycleService = (function () {
        function LifecycleService(envService, logService, storageService) {
            this.envService = envService;
            this.logService = logService;
            this.storageService = storageService;
            this.eventEmitter = new events_1.EventEmitter();
            this.windowToCloseRequest = Object.create(null);
            this.quitRequested = false;
            this.oneTimeListenerTokenGenerator = 0;
            this._wasUpdated = false;
            this.handleUpdated();
        }
        LifecycleService.prototype.handleUpdated = function () {
            this._wasUpdated = !!this.storageService.getItem(LifecycleService.QUIT_FROM_UPDATE_MARKER);
            if (this._wasUpdated) {
                this.storageService.removeItem(LifecycleService.QUIT_FROM_UPDATE_MARKER); // remove the marker right after if found
            }
        };
        Object.defineProperty(LifecycleService.prototype, "wasUpdated", {
            get: function () {
                return this._wasUpdated;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Due to the way we handle lifecycle with eventing, the general app.on('before-quit')
         * event cannot be used because it can be called twice on shutdown. Instead the onBeforeQuit
         * handler in this module can be used and it is only called once on a shutdown sequence.
         */
        LifecycleService.prototype.onBeforeQuit = function (clb) {
            var _this = this;
            this.eventEmitter.addListener(EventTypes.BEFORE_QUIT, clb);
            return function () { return _this.eventEmitter.removeListener(EventTypes.BEFORE_QUIT, clb); };
        };
        LifecycleService.prototype.ready = function () {
            this.registerListeners();
        };
        LifecycleService.prototype.registerListeners = function () {
            var _this = this;
            // before-quit
            electron_1.app.on('before-quit', function (e) {
                _this.logService.log('Lifecycle#before-quit');
                if (!_this.quitRequested) {
                    _this.eventEmitter.emit(EventTypes.BEFORE_QUIT); // only send this if this is the first quit request we have
                }
                _this.quitRequested = true;
            });
            // window-all-closed
            electron_1.app.on('window-all-closed', function () {
                _this.logService.log('Lifecycle#window-all-closed');
                // Windows/Linux: we quit when all windows have closed
                // Mac: we only quit when quit was requested
                // --wait: we quit when all windows are closed
                if (_this.quitRequested || process.platform !== 'darwin' || _this.envService.cliArgs.waitForWindowClose) {
                    electron_1.app.quit();
                }
            });
        };
        LifecycleService.prototype.registerWindow = function (vscodeWindow) {
            var _this = this;
            // Window Before Closing: Main -> Renderer
            vscodeWindow.win.on('close', function (e) {
                var windowId = vscodeWindow.id;
                _this.logService.log('Lifecycle#window-before-close', windowId);
                // The window already acknowledged to be closed
                if (_this.windowToCloseRequest[windowId]) {
                    _this.logService.log('Lifecycle#window-close', windowId);
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
        LifecycleService.prototype.unload = function (vscodeWindow) {
            var _this = this;
            // Always allow to unload a window that is not yet ready
            if (vscodeWindow.readyState !== window_1.ReadyState.READY) {
                return winjs_base_1.TPromise.as(false);
            }
            this.logService.log('Lifecycle#unload()', vscodeWindow.id);
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
        LifecycleService.prototype.quit = function (fromUpdate) {
            var _this = this;
            this.logService.log('Lifecycle#quit()');
            if (!this.pendingQuitPromise) {
                this.pendingQuitPromise = new winjs_base_1.TPromise(function (c) {
                    // Store as field to access it from a window cancellation
                    _this.pendingQuitPromiseComplete = c;
                    electron_1.app.once('will-quit', function () {
                        if (_this.pendingQuitPromiseComplete) {
                            if (fromUpdate) {
                                _this.storageService.setItem(LifecycleService.QUIT_FROM_UPDATE_MARKER, true);
                            }
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
        LifecycleService.QUIT_FROM_UPDATE_MARKER = 'quit.from.update'; // use a marker to find out if an update was applied in the previous session
        LifecycleService = __decorate([
            __param(0, env_1.IEnvironmentService),
            __param(1, log_1.ILogService),
            __param(2, storage_1.IStorageService)
        ], LifecycleService);
        return LifecycleService;
    }());
    exports.LifecycleService = LifecycleService;
});

define(__m[63], __M([0,1,5]), function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    (function (RefType) {
        RefType[RefType["Head"] = 0] = "Head";
        RefType[RefType["RemoteHead"] = 1] = "RemoteHead";
        RefType[RefType["Tag"] = 2] = "Tag";
    })(exports.RefType || (exports.RefType = {}));
    var RefType = exports.RefType;
    // Model enums
    (function (StatusType) {
        StatusType[StatusType["INDEX"] = 0] = "INDEX";
        StatusType[StatusType["WORKING_TREE"] = 1] = "WORKING_TREE";
        StatusType[StatusType["MERGE"] = 2] = "MERGE";
    })(exports.StatusType || (exports.StatusType = {}));
    var StatusType = exports.StatusType;
    (function (Status) {
        Status[Status["INDEX_MODIFIED"] = 0] = "INDEX_MODIFIED";
        Status[Status["INDEX_ADDED"] = 1] = "INDEX_ADDED";
        Status[Status["INDEX_DELETED"] = 2] = "INDEX_DELETED";
        Status[Status["INDEX_RENAMED"] = 3] = "INDEX_RENAMED";
        Status[Status["INDEX_COPIED"] = 4] = "INDEX_COPIED";
        Status[Status["MODIFIED"] = 5] = "MODIFIED";
        Status[Status["DELETED"] = 6] = "DELETED";
        Status[Status["UNTRACKED"] = 7] = "UNTRACKED";
        Status[Status["IGNORED"] = 8] = "IGNORED";
        Status[Status["ADDED_BY_US"] = 9] = "ADDED_BY_US";
        Status[Status["ADDED_BY_THEM"] = 10] = "ADDED_BY_THEM";
        Status[Status["DELETED_BY_US"] = 11] = "DELETED_BY_US";
        Status[Status["DELETED_BY_THEM"] = 12] = "DELETED_BY_THEM";
        Status[Status["BOTH_ADDED"] = 13] = "BOTH_ADDED";
        Status[Status["BOTH_DELETED"] = 14] = "BOTH_DELETED";
        Status[Status["BOTH_MODIFIED"] = 15] = "BOTH_MODIFIED";
    })(exports.Status || (exports.Status = {}));
    var Status = exports.Status;
    // Model events
    exports.ModelEvents = {
        MODEL_UPDATED: 'ModelUpdated',
        STATUS_MODEL_UPDATED: 'StatusModelUpdated',
        HEAD_UPDATED: 'HEADUpdated',
        REFS_UPDATED: 'RefsUpdated',
        REMOTES_UPDATED: 'RemotesUpdated'
    };
    // Service enums
    (function (ServiceState) {
        ServiceState[ServiceState["NotInitialized"] = 0] = "NotInitialized";
        ServiceState[ServiceState["NotARepo"] = 1] = "NotARepo";
        ServiceState[ServiceState["NotAtRepoRoot"] = 2] = "NotAtRepoRoot";
        ServiceState[ServiceState["OK"] = 3] = "OK";
        ServiceState[ServiceState["Huge"] = 4] = "Huge";
        ServiceState[ServiceState["NoGit"] = 5] = "NoGit";
        ServiceState[ServiceState["Disabled"] = 6] = "Disabled";
        ServiceState[ServiceState["NotAWorkspace"] = 7] = "NotAWorkspace";
    })(exports.ServiceState || (exports.ServiceState = {}));
    var ServiceState = exports.ServiceState;
    (function (RawServiceState) {
        RawServiceState[RawServiceState["OK"] = 0] = "OK";
        RawServiceState[RawServiceState["GitNotFound"] = 1] = "GitNotFound";
        RawServiceState[RawServiceState["Disabled"] = 2] = "Disabled";
    })(exports.RawServiceState || (exports.RawServiceState = {}));
    var RawServiceState = exports.RawServiceState;
    exports.GitErrorCodes = {
        BadConfigFile: 'BadConfigFile',
        AuthenticationFailed: 'AuthenticationFailed',
        NoUserNameConfigured: 'NoUserNameConfigured',
        NoUserEmailConfigured: 'NoUserEmailConfigured',
        NoRemoteRepositorySpecified: 'NoRemoteRepositorySpecified',
        NotAGitRepository: 'NotAGitRepository',
        NotAtRepositoryRoot: 'NotAtRepositoryRoot',
        Conflict: 'Conflict',
        UnmergedChanges: 'UnmergedChanges',
        PushRejected: 'PushRejected',
        RemoteConnectionError: 'RemoteConnectionError',
        DirtyWorkTree: 'DirtyWorkTree',
        CantOpenResource: 'CantOpenResource',
        GitNotFound: 'GitNotFound',
        CantCreatePipe: 'CantCreatePipe',
        CantAccessRemote: 'CantAccessRemote',
        RepositoryNotFound: 'RepositoryNotFound'
    };
    (function (AutoFetcherState) {
        AutoFetcherState[AutoFetcherState["Disabled"] = 0] = "Disabled";
        AutoFetcherState[AutoFetcherState["Inactive"] = 1] = "Inactive";
        AutoFetcherState[AutoFetcherState["Active"] = 2] = "Active";
        AutoFetcherState[AutoFetcherState["Fetching"] = 3] = "Fetching";
    })(exports.AutoFetcherState || (exports.AutoFetcherState = {}));
    var AutoFetcherState = exports.AutoFetcherState;
    // Service events
    exports.ServiceEvents = {
        STATE_CHANGED: 'stateChanged',
        REPO_CHANGED: 'repoChanged',
        OPERATION_START: 'operationStart',
        OPERATION_END: 'operationEnd',
        OPERATION: 'operation',
        ERROR: 'error',
        DISPOSE: 'dispose'
    };
    // Service operations
    exports.ServiceOperations = {
        STATUS: 'status',
        INIT: 'init',
        ADD: 'add',
        STAGE: 'stage',
        BRANCH: 'branch',
        CHECKOUT: 'checkout',
        CLEAN: 'clean',
        UNDO: 'undo',
        RESET: 'reset',
        COMMIT: 'commit',
        COMMAND: 'command',
        BACKGROUND_FETCH: 'backgroundfetch',
        PULL: 'pull',
        PUSH: 'push',
        SYNC: 'sync'
    };
    exports.GIT_SERVICE_ID = 'gitService';
    exports.IGitService = instantiation_1.createDecorator(exports.GIT_SERVICE_ID);
    // Utils
    function isValidBranchName(value) {
        return !/^\.|\/\.|\.\.|~|\^|:|\/$|\.lock$|\.lock\/|\\|\*|\s|^\s*$/.test(value);
    }
    exports.isValidBranchName = isValidBranchName;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[64], __M([0,1,2,36,63]), function (require, exports, winjs_base_1, ipc_1, git_1) {
    'use strict';
    var RawFileStatusSerializer = {
        to: function (a) { return [a.x, a.y, a.path, a.mimetype, a.rename]; },
        from: function (b) { return ({ x: b[0], y: b[1], path: b[2], mimetype: b[3], rename: b[4] }); }
    };
    var BranchSerializer = {
        to: function (a) { return [a.name, a.commit, a.type, a.remote, a.upstream, a.ahead, a.behind]; },
        from: function (b) { return ({ name: b[0], commit: b[1], type: b[2], remote: b[3], upstream: b[4], ahead: b[5], behind: b[6] }); }
    };
    var RefSerializer = {
        to: function (a) { return [a.name, a.commit, a.type, a.remote]; },
        from: function (b) { return ({ name: b[0], commit: b[1], type: b[2], remote: b[3] }); }
    };
    var RemoteSerializer = {
        to: function (a) { return [a.name, a.url]; },
        from: function (b) { return ({ name: b[0], url: b[1] }); }
    };
    var RawStatusSerializer = {
        to: function (a) { return !a ? null : [
            a.repositoryRoot,
            a.state,
            a.status.map(RawFileStatusSerializer.to),
            BranchSerializer.to(a.HEAD),
            a.refs.map(RefSerializer.to),
            a.remotes.map(RemoteSerializer.to)
        ]; },
        from: function (b) { return !b ? null : {
            repositoryRoot: b[0],
            state: b[1],
            status: b[2].map(RawFileStatusSerializer.from),
            HEAD: BranchSerializer.from(b[3]),
            refs: b[4].map(RefSerializer.from),
            remotes: b[5].map(RemoteSerializer.from)
        }; }
    };
    var GitChannel = (function () {
        function GitChannel(service) {
            this.service = service;
        }
        GitChannel.prototype.call = function (command, args) {
            switch (command) {
                case 'getVersion': return this.service.then(function (s) { return s.getVersion(); });
                case 'serviceState': return this.service.then(function (s) { return s.serviceState(); });
                case 'statusCount': return this.service.then(function (s) { return s.statusCount(); });
                case 'status': return this.service.then(function (s) { return s.status(); }).then(RawStatusSerializer.to);
                case 'init': return this.service.then(function (s) { return s.init(); }).then(RawStatusSerializer.to);
                case 'add': return this.service.then(function (s) { return s.add(args); }).then(RawStatusSerializer.to);
                case 'stage': return this.service.then(function (s) { return s.stage(args[0], args[1]); }).then(RawStatusSerializer.to);
                case 'branch': return this.service.then(function (s) { return s.branch(args[0], args[1]); }).then(RawStatusSerializer.to);
                case 'checkout': return this.service.then(function (s) { return s.checkout(args[0], args[1]); }).then(RawStatusSerializer.to);
                case 'clean': return this.service.then(function (s) { return s.clean(args); }).then(RawStatusSerializer.to);
                case 'undo': return this.service.then(function (s) { return s.undo(); }).then(RawStatusSerializer.to);
                case 'reset': return this.service.then(function (s) { return s.reset(args[0], args[1]); }).then(RawStatusSerializer.to);
                case 'revertFiles': return this.service.then(function (s) { return s.revertFiles(args[0], args[1]); }).then(RawStatusSerializer.to);
                case 'fetch': return this.service.then(function (s) { return s.fetch(); }).then(RawStatusSerializer.to);
                case 'pull': return this.service.then(function (s) { return s.pull(args); }).then(RawStatusSerializer.to);
                case 'push': return this.service.then(function (s) { return s.push(args[0], args[1], args[2]); }).then(RawStatusSerializer.to);
                case 'sync': return this.service.then(function (s) { return s.sync(); }).then(RawStatusSerializer.to);
                case 'commit': return this.service.then(function (s) { return s.commit(args[0], args[1], args[2]); }).then(RawStatusSerializer.to);
                case 'detectMimetypes': return this.service.then(function (s) { return s.detectMimetypes(args[0], args[1]); });
                case 'show': return this.service.then(function (s) { return s.show(args[0], args[1]); });
                case 'onOutput': return this.service.then(function (s) { return ipc_1.eventToCall(s.onOutput); });
                case 'getCommitTemplate': return this.service.then(function (s) { return s.getCommitTemplate(); });
            }
        };
        return GitChannel;
    }());
    exports.GitChannel = GitChannel;
    var UnavailableGitChannel = (function () {
        function UnavailableGitChannel() {
        }
        UnavailableGitChannel.prototype.call = function (command) {
            switch (command) {
                case 'serviceState': return winjs_base_1.TPromise.as(git_1.RawServiceState.GitNotFound);
                default: return winjs_base_1.TPromise.as(null);
            }
        };
        return UnavailableGitChannel;
    }());
    exports.UnavailableGitChannel = UnavailableGitChannel;
    var GitChannelClient = (function () {
        function GitChannelClient(channel) {
            this.channel = channel;
            this._onOutput = ipc_1.eventFromCall(this.channel, 'onOutput');
        }
        Object.defineProperty(GitChannelClient.prototype, "onOutput", {
            get: function () { return this._onOutput; },
            enumerable: true,
            configurable: true
        });
        GitChannelClient.prototype.getVersion = function () {
            return this.channel.call('getVersion');
        };
        GitChannelClient.prototype.serviceState = function () {
            return this.channel.call('serviceState');
        };
        GitChannelClient.prototype.statusCount = function () {
            return this.channel.call('statusCount');
        };
        GitChannelClient.prototype.status = function () {
            return this.channel.call('status').then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.init = function () {
            return this.channel.call('init').then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.add = function (filesPaths) {
            return this.channel.call('add', filesPaths).then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.stage = function (filePath, content) {
            return this.channel.call('stage', [filePath, content]).then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.branch = function (name, checkout) {
            return this.channel.call('branch', [name, checkout]).then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.checkout = function (treeish, filePaths) {
            return this.channel.call('checkout', [treeish, filePaths]).then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.clean = function (filePaths) {
            return this.channel.call('clean', filePaths).then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.undo = function () {
            return this.channel.call('undo').then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.reset = function (treeish, hard) {
            return this.channel.call('reset', [treeish, hard]).then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.revertFiles = function (treeish, filePaths) {
            return this.channel.call('revertFiles', [treeish, filePaths]).then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.fetch = function () {
            return this.channel.call('fetch').then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.pull = function (rebase) {
            return this.channel.call('pull', rebase).then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.push = function (remote, name, options) {
            return this.channel.call('push', [remote, name, options]).then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.sync = function () {
            return this.channel.call('sync').then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.commit = function (message, amend, stage) {
            return this.channel.call('commit', [message, amend, stage]).then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.detectMimetypes = function (path, treeish) {
            return this.channel.call('detectMimetypes', [path, treeish]);
        };
        GitChannelClient.prototype.show = function (path, treeish) {
            return this.channel.call('show', [path, treeish]);
        };
        GitChannelClient.prototype.getCommitTemplate = function () {
            return this.channel.call('getCommitTemplate');
        };
        return GitChannelClient;
    }());
    exports.GitChannelClient = GitChannelClient;
    var AskpassChannel = (function () {
        function AskpassChannel(service) {
            this.service = service;
        }
        AskpassChannel.prototype.call = function (command) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            switch (command) {
                case 'askpass': return this.service.askpass(args[0], args[1], args[2]);
            }
        };
        return AskpassChannel;
    }());
    exports.AskpassChannel = AskpassChannel;
    var AskpassChannelClient = (function () {
        function AskpassChannelClient(channel) {
            this.channel = channel;
        }
        AskpassChannelClient.prototype.askpass = function (id, host, command) {
            return this.channel.call('askpass', id, host, command);
        };
        return AskpassChannelClient;
    }());
    exports.AskpassChannelClient = AskpassChannelClient;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[65], __M([0,1,47,8,3,2]), function (require, exports, nls, electron_1, platform, winjs_base_1) {
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
define(__m[39], __M([0,1,2,6,73,74,45,20,10,75]), function (require, exports, winjs_base_1, types_1, https, http, url_1, fs_1, objects_1, zlib_1) {
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
                    var stream = res;
                    if (res.headers['content-encoding'] === 'gzip') {
                        stream = stream.pipe(zlib_1.createGunzip());
                    }
                    c({ req: req, res: res, stream: stream });
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
            pair.stream.once('error', e);
            pair.stream.pipe(out);
        }); });
    }
    exports.download = download;
    function text(opts) {
        return request(opts).then(function (pair) { return new winjs_base_1.Promise(function (c, e) {
            if (!((pair.res.statusCode >= 200 && pair.res.statusCode < 300) || pair.res.statusCode === 1223)) {
                return e('Server returned ' + pair.res.statusCode);
            }
            if (pair.res.statusCode === 204) {
                return c(null);
            }
            var buffer = [];
            pair.stream.on('data', function (d) { return buffer.push(d); });
            pair.stream.on('end', function () { return c(buffer.join('')); });
            pair.stream.on('error', e);
        }); });
    }
    exports.text = text;
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
            pair.stream.on('data', function (d) { return buffer.push(d); });
            pair.stream.on('end', function () { return c(JSON.parse(buffer.join(''))); });
            pair.stream.on('error', e);
        }); });
    }
    exports.json = json;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[67], __M([0,1,12,6,39,40,15,4]), function (require, exports, events_1, types_1, request_1, proxy_1, settings_1, env_1) {
    'use strict';
    var LinuxAutoUpdaterImpl = (function (_super) {
        __extends(LinuxAutoUpdaterImpl, _super);
        function LinuxAutoUpdaterImpl(envService, settingsService) {
            _super.call(this);
            this.envService = envService;
            this.settingsService = settingsService;
            this.url = null;
            this.currentRequest = null;
        }
        LinuxAutoUpdaterImpl.prototype.setFeedURL = function (url) {
            this.url = url;
        };
        LinuxAutoUpdaterImpl.prototype.checkForUpdates = function () {
            var _this = this;
            if (!this.url) {
                throw new Error('No feed url set.');
            }
            if (this.currentRequest) {
                return;
            }
            this.emit('checking-for-update');
            var proxyUrl = this.settingsService.getValue('http.proxy');
            var strictSSL = this.settingsService.getValue('http.proxyStrictSSL', true);
            var agent = proxy_1.getProxyAgent(this.url, { proxyUrl: proxyUrl, strictSSL: strictSSL });
            this.currentRequest = request_1.json({ url: this.url, agent: agent })
                .then(function (update) {
                if (!update || !update.url || !update.version) {
                    _this.emit('update-not-available');
                }
                else {
                    _this.emit('update-available', null, _this.envService.product.downloadUrl);
                }
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
        LinuxAutoUpdaterImpl = __decorate([
            __param(0, env_1.IEnvironmentService),
            __param(1, settings_1.ISettingsService)
        ], LinuxAutoUpdaterImpl);
        return LinuxAutoUpdaterImpl;
    }(events_1.EventEmitter));
    exports.LinuxAutoUpdaterImpl = LinuxAutoUpdaterImpl;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[68], __M([0,1,7,35,50,12,24,30,38,6,2,39,40,15,22,4]), function (require, exports, path, pfs, crypto_1, events_1, os_1, child_process_1, extfs_1, types_1, winjs_base_1, request_1, proxy_1, settings_1, lifecycle_1, env_1) {
    'use strict';
    var Win32AutoUpdaterImpl = (function (_super) {
        __extends(Win32AutoUpdaterImpl, _super);
        function Win32AutoUpdaterImpl(lifecycleService, envService, settingsService) {
            _super.call(this);
            this.lifecycleService = lifecycleService;
            this.envService = envService;
            this.settingsService = settingsService;
            this.url = null;
            this.currentRequest = null;
        }
        Object.defineProperty(Win32AutoUpdaterImpl.prototype, "cachePath", {
            get: function () {
                var result = path.join(os_1.tmpdir(), 'vscode-update');
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
            var proxyUrl = this.settingsService.getValue('http.proxy');
            var strictSSL = this.settingsService.getValue('http.proxyStrictSSL', true);
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
                            var hash = update.hash;
                            var downloadPath = updatePackagePath + ".tmp";
                            var agent = proxy_1.getProxyAgent(url, { proxyUrl: proxyUrl, strictSSL: strictSSL });
                            return request_1.download(downloadPath, { url: url, agent: agent, strictSSL: strictSSL })
                                .then(hash ? function () { return crypto_1.checksum(downloadPath, update.hash); } : function () { return null; })
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
            var _this = this;
            return this.cachePath.then(function (cachePath) { return path.join(cachePath, "CodeSetup-" + _this.envService.quality + "-" + version + ".exe"); });
        };
        Win32AutoUpdaterImpl.prototype.quitAndUpdate = function (updatePackagePath) {
            this.lifecycleService.quit().done(function (vetod) {
                if (vetod) {
                    return;
                }
                child_process_1.spawn(updatePackagePath, ['/silent', '/mergetasks=runcode,!desktopicon,!quicklaunchicon'], {
                    detached: true,
                    stdio: ['ignore', 'ignore', 'ignore']
                });
            });
        };
        Win32AutoUpdaterImpl.prototype.cleanup = function (exceptVersion) {
            var _this = this;
            if (exceptVersion === void 0) { exceptVersion = null; }
            var filter = exceptVersion ? function (one) { return !(new RegExp(_this.envService.quality + "-" + exceptVersion + "\\.exe$").test(one)); } : function () { return true; };
            return this.cachePath
                .then(function (cachePath) { return pfs.readdir(cachePath)
                .then(function (all) { return winjs_base_1.Promise.join(all
                .filter(filter)
                .map(function (one) { return pfs.unlink(path.join(cachePath, one)).then(null, function () { return null; }); })); }); });
        };
        Win32AutoUpdaterImpl = __decorate([
            __param(0, lifecycle_1.ILifecycleService),
            __param(1, env_1.IEnvironmentService),
            __param(2, settings_1.ISettingsService)
        ], Win32AutoUpdaterImpl);
        return Win32AutoUpdaterImpl;
    }(events_1.EventEmitter));
    exports.Win32AutoUpdaterImpl = Win32AutoUpdaterImpl;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[28], __M([0,1,21,7,8,3,12,4,15,68,67,22,5]), function (require, exports, fs, path, electron, platform, events_1, env_1, settings_1, auto_updater_win32_1, auto_updater_linux_1, lifecycle_1, instantiation_1) {
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
    exports.IUpdateService = instantiation_1.createDecorator('updateService');
    var UpdateManager = (function (_super) {
        __extends(UpdateManager, _super);
        function UpdateManager(instantiationService, lifecycleService, envService, settingsService) {
            _super.call(this);
            this.lifecycleService = lifecycleService;
            this.envService = envService;
            this.settingsService = settingsService;
            this._state = State.Uninitialized;
            this.explicitState = ExplicitState.Implicit;
            this._availableUpdate = null;
            this._lastCheckDate = null;
            this._feedUrl = null;
            this._channel = null;
            if (platform.isWindows) {
                this.raw = instantiationService.createInstance(auto_updater_win32_1.Win32AutoUpdaterImpl);
            }
            else if (platform.isLinux) {
                this.raw = instantiationService.createInstance(auto_updater_linux_1.LinuxAutoUpdaterImpl);
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
            this.raw.on('update-available', function (event, url) {
                _this.emit('update-available', url);
                var data = null;
                if (url) {
                    data = {
                        releaseNotes: '',
                        version: '',
                        date: new Date(),
                        quitAndUpdate: function () { return electron.shell.openExternal(url); }
                    };
                }
                _this.setState(State.UpdateAvailable, data);
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
            this.lifecycleService.quit(true /* from update */).done(function (vetod) {
                if (vetod) {
                    return;
                }
                // for some reason updating on Mac causes the local storage not to be flushed.
                // we workaround this issue by forcing an explicit flush of the storage data.
                // see also https://github.com/Microsoft/vscode/issues/172
                if (platform.isMacintosh) {
                    electron.session.defaultSession.flushStorageData();
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
            var channel = this.getUpdateChannel();
            var feedUrl = this.getUpdateFeedUrl(channel);
            if (!feedUrl) {
                return; // updates not available
            }
            try {
                this.raw.setFeedURL(feedUrl);
            }
            catch (e) {
                return; // application not signed
            }
            this._channel = channel;
            this._feedUrl = feedUrl;
            this.setState(State.Idle);
            // Check for updates on startup after 30 seconds
            var timer = setTimeout(function () { return _this.checkForUpdates(); }, 30 * 1000);
            // Clear timer when checking for update
            this.on('error', function (error, message) { return console.error(error, message); });
            // Clear timer when checking for update
            this.on('checking-for-update', function () { return clearTimeout(timer); });
            // If update not found, try again in 1 hour
            this.on('update-not-available', function () {
                timer = setTimeout(function () { return _this.checkForUpdates(); }, 60 * 60 * 1000);
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
        UpdateManager.prototype.getUpdateChannel = function () {
            var channel = this.settingsService.getValue('update.channel') || 'default';
            return channel === 'none' ? null : this.envService.quality;
        };
        UpdateManager.prototype.getUpdateFeedUrl = function (channel) {
            if (!channel) {
                return null;
            }
            if (platform.isWindows && !fs.existsSync(path.join(path.dirname(process.execPath), 'unins000.exe'))) {
                return null;
            }
            if (!this.envService.updateUrl || !this.envService.product.commit) {
                return null;
            }
            return this.envService.updateUrl + "/api/update/" + env_1.getPlatformIdentifier() + "/" + channel + "/" + this.envService.product.commit;
        };
        UpdateManager = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, lifecycle_1.ILifecycleService),
            __param(2, env_1.IEnvironmentService),
            __param(3, settings_1.ISettingsService)
        ], UpdateManager);
        return UpdateManager;
    }(events_1.EventEmitter));
    exports.UpdateManager = UpdateManager;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[27], __M([0,1,7,21,3,43,26,16,10,23,12,13,37,8,4,22,15,28,17,5]), function (require, exports, path, fs, platform, nls, paths, arrays, objects, package_1, events_1, storage_1, window_1, electron_1, env_1, lifecycle_1, settings_1, update_manager_1, log_1, instantiation_1) {
    'use strict';
    var EventTypes = {
        OPEN: 'open',
        CLOSE: 'close',
        READY: 'ready'
    };
    var WindowError;
    (function (WindowError) {
        WindowError[WindowError["UNRESPONSIVE"] = 0] = "UNRESPONSIVE";
        WindowError[WindowError["CRASHED"] = 1] = "CRASHED";
    })(WindowError || (WindowError = {}));
    var ReopenFoldersSetting = {
        ALL: 'all',
        ONE: 'one',
        NONE: 'none'
    };
    exports.IWindowsService = instantiation_1.createDecorator('windowsService');
    var WindowsManager = (function () {
        function WindowsManager(instantiationService, logService, storageService, envService, lifecycleService, updateService, settingsService) {
            this.instantiationService = instantiationService;
            this.logService = logService;
            this.storageService = storageService;
            this.envService = envService;
            this.lifecycleService = lifecycleService;
            this.updateService = updateService;
            this.settingsService = settingsService;
            this.eventEmitter = new events_1.EventEmitter();
        }
        WindowsManager.prototype.onOpen = function (clb) {
            var _this = this;
            this.eventEmitter.addListener(EventTypes.OPEN, clb);
            return function () { return _this.eventEmitter.removeListener(EventTypes.OPEN, clb); };
        };
        WindowsManager.prototype.onReady = function (clb) {
            var _this = this;
            this.eventEmitter.addListener(EventTypes.READY, clb);
            return function () { return _this.eventEmitter.removeListener(EventTypes.READY, clb); };
        };
        WindowsManager.prototype.onClose = function (clb) {
            var _this = this;
            this.eventEmitter.addListener(EventTypes.CLOSE, clb);
            return function () { return _this.eventEmitter.removeListener(EventTypes.CLOSE, clb); };
        };
        WindowsManager.prototype.ready = function (initialUserEnv) {
            this.registerListeners();
            this.initialUserEnv = initialUserEnv;
            this.windowsState = this.storageService.getItem(WindowsManager.windowsStateStorageKey) || { openedFolders: [] };
        };
        WindowsManager.prototype.registerListeners = function () {
            var _this = this;
            electron_1.app.on('activate', function (event, hasVisibleWindows) {
                _this.logService.log('App#activate');
                // Mac only event: open new window when we get activated
                if (!hasVisibleWindows) {
                    _this.openNewWindow();
                }
            });
            var macOpenFiles = [];
            var runningTimeout = null;
            electron_1.app.on('open-file', function (event, path) {
                _this.logService.log('App#open-file: ', path);
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
                    _this.open({ cli: _this.envService.cliArgs, pathsToOpen: macOpenFiles, preferNewWindow: true /* dropping on the dock prefers to open in a new window */ });
                    macOpenFiles = [];
                    runningTimeout = null;
                }, 100);
            });
            this.settingsService.onChange(function (newSettings) {
                _this.sendToAll('vscode:optionsChange', JSON.stringify({ globalSettings: newSettings }));
            }, this);
            electron_1.ipcMain.on('vscode:startCrashReporter', function (event, config) {
                _this.logService.log('IPC#vscode:startCrashReporter');
                electron_1.crashReporter.start(config);
            });
            electron_1.ipcMain.on('vscode:windowOpen', function (event, paths, forceNewWindow) {
                _this.logService.log('IPC#vscode-windowOpen: ', paths);
                if (paths && paths.length) {
                    _this.open({ cli: _this.envService.cliArgs, pathsToOpen: paths, forceNewWindow: forceNewWindow });
                }
            });
            electron_1.ipcMain.on('vscode:workbenchLoaded', function (event, windowId) {
                _this.logService.log('IPC#vscode-workbenchLoaded');
                var win = _this.getWindowById(windowId);
                if (win) {
                    win.setReady();
                    // Event
                    _this.eventEmitter.emit(EventTypes.READY, win);
                }
            });
            electron_1.ipcMain.on('vscode:openFilePicker', function (event, forceNewWindow, path) {
                _this.logService.log('IPC#vscode-openFilePicker');
                _this.openFilePicker(forceNewWindow, path);
            });
            electron_1.ipcMain.on('vscode:openFolderPicker', function (event, forceNewWindow) {
                _this.logService.log('IPC#vscode-openFolderPicker');
                _this.openFolderPicker(forceNewWindow);
            });
            electron_1.ipcMain.on('vscode:openFileFolderPicker', function (event, forceNewWindow) {
                _this.logService.log('IPC#vscode-openFileFolderPicker');
                _this.openFileFolderPicker(forceNewWindow);
            });
            electron_1.ipcMain.on('vscode:closeFolder', function (event, windowId) {
                _this.logService.log('IPC#vscode-closeFolder');
                var win = _this.getWindowById(windowId);
                if (win) {
                    _this.open({ cli: _this.envService.cliArgs, forceEmpty: true, windowToUse: win });
                }
            });
            electron_1.ipcMain.on('vscode:openNewWindow', function () {
                _this.logService.log('IPC#vscode-openNewWindow');
                _this.openNewWindow();
            });
            electron_1.ipcMain.on('vscode:reloadWindow', function (event, windowId) {
                _this.logService.log('IPC#vscode:reloadWindow');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    _this.reload(vscodeWindow);
                }
            });
            electron_1.ipcMain.on('vscode:toggleFullScreen', function (event, windowId) {
                _this.logService.log('IPC#vscode:toggleFullScreen');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.toggleFullScreen();
                }
            });
            electron_1.ipcMain.on('vscode:setFullScreen', function (event, windowId, fullscreen) {
                _this.logService.log('IPC#vscode:setFullScreen');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.win.setFullScreen(fullscreen);
                }
            });
            electron_1.ipcMain.on('vscode:toggleDevTools', function (event, windowId) {
                _this.logService.log('IPC#vscode:toggleDevTools');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.win.webContents.toggleDevTools();
                }
            });
            electron_1.ipcMain.on('vscode:openDevTools', function (event, windowId) {
                _this.logService.log('IPC#vscode:openDevTools');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.win.webContents.openDevTools();
                    vscodeWindow.win.show();
                }
            });
            electron_1.ipcMain.on('vscode:setRepresentedFilename', function (event, windowId, fileName) {
                _this.logService.log('IPC#vscode:setRepresentedFilename');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.win.setRepresentedFilename(fileName);
                }
            });
            electron_1.ipcMain.on('vscode:setMenuBarVisibility', function (event, windowId, visibility) {
                _this.logService.log('IPC#vscode:setMenuBarVisibility');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.win.setMenuBarVisibility(visibility);
                }
            });
            electron_1.ipcMain.on('vscode:flashFrame', function (event, windowId) {
                _this.logService.log('IPC#vscode:flashFrame');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.win.flashFrame(!vscodeWindow.win.isFocused());
                }
            });
            electron_1.ipcMain.on('vscode:focusWindow', function (event, windowId) {
                _this.logService.log('IPC#vscode:focusWindow');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.win.focus();
                }
            });
            electron_1.ipcMain.on('vscode:setDocumentEdited', function (event, windowId, edited) {
                _this.logService.log('IPC#vscode:setDocumentEdited');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow && vscodeWindow.win.isDocumentEdited() !== edited) {
                    vscodeWindow.win.setDocumentEdited(edited);
                }
            });
            electron_1.ipcMain.on('vscode:toggleMenuBar', function (event, windowId) {
                _this.logService.log('IPC#vscode:toggleMenuBar');
                // Update in settings
                var menuBarHidden = _this.storageService.getItem(window_1.VSCodeWindow.menuBarHiddenKey, false);
                var newMenuBarHidden = !menuBarHidden;
                _this.storageService.setItem(window_1.VSCodeWindow.menuBarHiddenKey, newMenuBarHidden);
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
            electron_1.ipcMain.on('vscode:broadcast', function (event, windowId, target, broadcast) {
                if (broadcast.channel && broadcast.payload) {
                    _this.logService.log('IPC#vscode:broadcast', target, broadcast.channel, broadcast.payload);
                    // Handle specific events on main side
                    _this.onBroadcast(broadcast.channel, broadcast.payload);
                    // Send to windows
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
            electron_1.ipcMain.on('vscode:closeExtensionHostWindow', function (event, extensionDevelopmentPath) {
                _this.logService.log('IPC#vscode:closeExtensionHostWindow', extensionDevelopmentPath);
                var windowOnExtension = _this.findWindow(null, null, extensionDevelopmentPath);
                if (windowOnExtension) {
                    windowOnExtension.win.close();
                }
            });
            this.updateService.on('update-downloaded', function (update) {
                _this.sendToFocused('vscode:telemetry', { eventName: 'update:downloaded', data: { version: update.version } });
                _this.sendToAll('vscode:update-downloaded', JSON.stringify({
                    releaseNotes: update.releaseNotes,
                    version: update.version,
                    date: update.date
                }));
            });
            electron_1.ipcMain.on('vscode:update-apply', function () {
                _this.logService.log('IPC#vscode:update-apply');
                if (_this.updateService.availableUpdate) {
                    _this.updateService.availableUpdate.quitAndUpdate();
                }
            });
            this.updateService.on('update-not-available', function (explicit) {
                _this.sendToFocused('vscode:telemetry', { eventName: 'update:notAvailable', data: { explicit: explicit } });
                if (explicit) {
                    _this.sendToFocused('vscode:update-not-available', '');
                }
            });
            this.updateService.on('update-available', function (url) {
                if (url) {
                    _this.sendToFocused('vscode:update-available', url);
                }
            });
            this.lifecycleService.onBeforeQuit(function () {
                // 0-1 window open: Do not keep the list but just rely on the active window to be stored
                if (WindowsManager.WINDOWS.length < 2) {
                    _this.windowsState.openedFolders = [];
                    return;
                }
                // 2-N windows open: Keep a list of windows that are opened on a specific folder to restore it in the next session as needed
                _this.windowsState.openedFolders = WindowsManager.WINDOWS.filter(function (w) { return w.readyState === window_1.ReadyState.READY && !!w.openedWorkspacePath && !w.isPluginDevelopmentHost; }).map(function (w) {
                    return {
                        workspacePath: w.openedWorkspacePath,
                        uiState: w.serializeWindowState()
                    };
                });
            });
            electron_1.app.on('will-quit', function () {
                _this.storageService.setItem(WindowsManager.windowsStateStorageKey, _this.windowsState);
            });
            var loggedStartupTimes = false;
            this.onReady(function (window) {
                if (loggedStartupTimes) {
                    return; // only for the first window
                }
                loggedStartupTimes = true;
                window.send('vscode:telemetry', { eventName: 'startupTime', data: { ellapsed: Date.now() - global.vscodeStart } });
            });
        };
        WindowsManager.prototype.onBroadcast = function (event, payload) {
            // Theme changes
            if (event === 'vscode:changeTheme' && typeof payload === 'string') {
                this.storageService.setItem(window_1.VSCodeWindow.themeStorageKey, payload);
            }
        };
        WindowsManager.prototype.reload = function (win, cli) {
            // Only reload when the window has not vetoed this
            this.lifecycleService.unload(win).done(function (veto) {
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
                            title: _this.envService.product.nameLong,
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
            if (openConfig.diffMode) {
                if (candidates.length === 2) {
                    filesToDiff = candidates;
                }
                else {
                    emptyToOpen = [Object.create(null)]; // improper use of diffMode, open empty
                }
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
                        openFilesInNewWindow = this.settingsService.getValue('window.openFilesInNewWindow', openFilesInNewWindow);
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
            iPathsToOpen.forEach(function (iPath) { return _this.eventEmitter.emit(EventTypes.OPEN, iPath); });
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
            // Fill in previously opened workspace unless an explicit path is provided and we are not unit testing
            if (openConfig.cli.pathArguments.length === 0 && !openConfig.cli.extensionTestsPath) {
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
            configuration.appName = this.envService.product.nameLong;
            configuration.applicationName = this.envService.product.applicationName;
            configuration.darwinBundleIdentifier = this.envService.product.darwinBundleIdentifier;
            configuration.appRoot = this.envService.appRoot;
            configuration.version = package_1.default.version;
            configuration.commitHash = this.envService.product.commit;
            configuration.appSettingsHome = this.envService.appSettingsHome;
            configuration.appSettingsPath = this.envService.appSettingsPath;
            configuration.appKeybindingsPath = this.envService.appKeybindingsPath;
            configuration.userExtensionsHome = this.envService.userExtensionsHome;
            configuration.extensionTips = this.envService.product.extensionTips;
            configuration.mainIPCHandle = this.envService.mainIPCHandle;
            configuration.sharedIPCHandle = this.envService.sharedIPCHandle;
            configuration.isBuilt = this.envService.isBuilt;
            configuration.crashReporter = this.envService.product.crashReporter;
            configuration.extensionsGallery = this.envService.product.extensionsGallery;
            configuration.welcomePage = this.envService.product.welcomePage;
            configuration.productDownloadUrl = this.envService.product.downloadUrl;
            configuration.releaseNotesUrl = this.envService.product.releaseNotesUrl;
            configuration.licenseUrl = this.envService.product.licenseUrl;
            configuration.updateFeedUrl = this.updateService.feedUrl;
            configuration.updateChannel = this.updateService.channel;
            configuration.aiConfig = this.envService.product.aiConfig;
            configuration.sendASmile = this.envService.product.sendASmile;
            configuration.enableTelemetry = this.envService.product.enableTelemetry;
            configuration.userEnv = userEnv;
            var recents = this.getRecentlyOpenedPaths(workspacePath, filesToOpen);
            configuration.recentFiles = recents.files;
            configuration.recentFolders = recents.folders;
            return configuration;
        };
        WindowsManager.prototype.getRecentlyOpenedPaths = function (workspacePath, filesToOpen) {
            var files;
            var folders;
            // Get from storage
            var storedRecents = this.storageService.getItem(WindowsManager.openedPathsListStorageKey);
            if (storedRecents) {
                files = storedRecents.files || [];
                folders = storedRecents.folders || [];
            }
            else {
                files = [];
                folders = [];
            }
            // Add currently files to open to the beginning if any
            if (filesToOpen) {
                files.unshift.apply(files, filesToOpen.map(function (f) { return f.filePath; }));
            }
            // Add current workspace path to beginning if set
            if (workspacePath) {
                folders.unshift(workspacePath);
            }
            // Clear those dupes
            files = arrays.distinct(files);
            folders = arrays.distinct(folders);
            // Make sure it is bounded
            files = files.slice(0, 10);
            folders = folders.slice(0, 10);
            return { files: files, folders: folders };
        };
        WindowsManager.prototype.toIPath = function (anyPath, ignoreFileNotFound, gotoLineMode) {
            if (!anyPath) {
                return null;
            }
            var parsedPath;
            if (gotoLineMode) {
                parsedPath = env_1.parseLineAndColumnAware(anyPath);
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
                var reopenFolders = void 0;
                if (this.lifecycleService.wasUpdated) {
                    reopenFolders = ReopenFoldersSetting.ALL; // always reopen all folders when an update was applied
                }
                else {
                    reopenFolders = this.settingsService.getValue('window.reopenFolders', ReopenFoldersSetting.ONE);
                }
                var lastActiveFolder = this.windowsState.lastActiveWindow && this.windowsState.lastActiveWindow.workspacePath;
                // Restore all
                if (reopenFolders === ReopenFoldersSetting.ALL) {
                    var lastOpenedFolders = this.windowsState.openedFolders.map(function (o) { return o.workspacePath; });
                    // If we have a last active folder, move it to the end
                    if (lastActiveFolder) {
                        lastOpenedFolders.splice(lastOpenedFolders.indexOf(lastActiveFolder), 1);
                        lastOpenedFolders.push(lastActiveFolder);
                    }
                    candidates.push.apply(candidates, lastOpenedFolders);
                }
                else if (lastActiveFolder && (reopenFolders === ReopenFoldersSetting.ONE || reopenFolders !== ReopenFoldersSetting.NONE)) {
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
                vscodeWindow = this.instantiationService.createInstance(window_1.VSCodeWindow, {
                    state: this.getNewWindowState(configuration),
                    extensionDevelopmentPath: configuration.extensionDevelopmentPath,
                    allowFullscreen: this.lifecycleService.wasUpdated || this.settingsService.getValue('window.restoreFullscreen', false)
                });
                WindowsManager.WINDOWS.push(vscodeWindow);
                // Window Events
                vscodeWindow.win.webContents.removeAllListeners('devtools-reload-page'); // remove built in listener so we can handle this on our own
                vscodeWindow.win.webContents.on('devtools-reload-page', function () { return _this.reload(vscodeWindow); });
                vscodeWindow.win.webContents.on('crashed', function () { return _this.onWindowError(vscodeWindow, WindowError.CRASHED); });
                vscodeWindow.win.on('unresponsive', function () { return _this.onWindowError(vscodeWindow, WindowError.UNRESPONSIVE); });
                vscodeWindow.win.on('close', function () { return _this.onBeforeWindowClose(vscodeWindow); });
                vscodeWindow.win.on('closed', function () { return _this.onWindowClosed(vscodeWindow); });
                // Lifecycle
                this.lifecycleService.registerWindow(vscodeWindow);
            }
            else {
                // Some configuration things get inherited if the window is being reused and we are
                // in plugin development host mode. These options are all development related.
                var currentWindowConfig = vscodeWindow.config;
                if (!configuration.extensionDevelopmentPath && currentWindowConfig && !!currentWindowConfig.extensionDevelopmentPath) {
                    configuration.extensionDevelopmentPath = currentWindowConfig.extensionDevelopmentPath;
                    configuration.verboseLogging = currentWindowConfig.verboseLogging;
                    configuration.logExtensionHostCommunication = currentWindowConfig.logExtensionHostCommunication;
                    configuration.debugBrkFileWatcherPort = currentWindowConfig.debugBrkFileWatcherPort;
                    configuration.debugBrkExtensionHost = currentWindowConfig.debugBrkExtensionHost;
                    configuration.debugExtensionHostPort = currentWindowConfig.debugExtensionHostPort;
                    configuration.extensionsHomePath = currentWindowConfig.extensionsHomePath;
                }
            }
            // Only load when the window has not vetoed this
            this.lifecycleService.unload(vscodeWindow).done(function (veto) {
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
            var defaultState = window_1.defaultWindowState();
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
        WindowsManager.prototype.openFileFolderPicker = function (forceNewWindow) {
            this.doPickAndOpen({ pickFolders: true, pickFiles: true, forceNewWindow: forceNewWindow });
        };
        WindowsManager.prototype.openFilePicker = function (forceNewWindow, path) {
            this.doPickAndOpen({ pickFiles: true, forceNewWindow: forceNewWindow, path: path });
        };
        WindowsManager.prototype.openFolderPicker = function (forceNewWindow) {
            this.doPickAndOpen({ pickFolders: true, forceNewWindow: forceNewWindow });
        };
        WindowsManager.prototype.doPickAndOpen = function (options) {
            var _this = this;
            this.getFileOrFolderPaths(options, function (paths) {
                if (paths && paths.length) {
                    _this.open({ cli: _this.envService.cliArgs, pathsToOpen: paths, forceNewWindow: options.forceNewWindow });
                }
            });
        };
        WindowsManager.prototype.getFileOrFolderPaths = function (options, clb) {
            var _this = this;
            var workingDir = options.path || this.storageService.getItem(WindowsManager.workingDirPickerStorageKey);
            var focussedWindow = this.getFocusedWindow();
            var pickerProperties;
            if (options.pickFiles && options.pickFolders) {
                pickerProperties = ['multiSelections', 'openDirectory', 'openFile', 'createDirectory'];
            }
            else {
                pickerProperties = ['multiSelections', options.pickFolders ? 'openDirectory' : 'openFile', 'createDirectory'];
            }
            electron_1.dialog.showOpenDialog(focussedWindow && focussedWindow.win, {
                defaultPath: workingDir,
                properties: pickerProperties
            }, function (paths) {
                if (paths && paths.length > 0) {
                    // Remember path in storage for next time
                    _this.storageService.setItem(WindowsManager.workingDirPickerStorageKey, path.dirname(paths[0]));
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
            this.open({ cli: this.envService.cliArgs, forceNewWindow: true, forceEmpty: true });
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
                    title: this.envService.product.nameLong,
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
                    title: this.envService.product.nameLong,
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
            if (win.readyState !== window_1.ReadyState.READY) {
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
            this.eventEmitter.emit(EventTypes.CLOSE, win.id);
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
        WindowsManager = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, log_1.ILogService),
            __param(2, storage_1.IStorageService),
            __param(3, env_1.IEnvironmentService),
            __param(4, lifecycle_1.ILifecycleService),
            __param(5, update_manager_1.IUpdateService),
            __param(6, settings_1.ISettingsService)
        ], WindowsManager);
        return WindowsManager;
    }());
    exports.WindowsManager = WindowsManager;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[71], __M([0,1,27,2,17]), function (require, exports, windows_1, winjs_base_1, log_1) {
    'use strict';
    var LaunchChannel = (function () {
        function LaunchChannel(service) {
            this.service = service;
        }
        LaunchChannel.prototype.call = function (command) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            switch (command) {
                case 'start': return this.service.start(args[0], args[1]);
            }
        };
        return LaunchChannel;
    }());
    exports.LaunchChannel = LaunchChannel;
    var LaunchChannelClient = (function () {
        function LaunchChannelClient(channel) {
            this.channel = channel;
        }
        LaunchChannelClient.prototype.start = function (args, userEnv) {
            return this.channel.call('start', args, userEnv);
        };
        return LaunchChannelClient;
    }());
    exports.LaunchChannelClient = LaunchChannelClient;
    var LaunchService = (function () {
        function LaunchService(logService, windowsService) {
            this.logService = logService;
            this.windowsService = windowsService;
        }
        LaunchService.prototype.start = function (args, userEnv) {
            var _this = this;
            this.logService.log('Received data from other instance', args);
            // Otherwise handle in windows service
            var usedWindows;
            if (!!args.extensionDevelopmentPath) {
                this.windowsService.openPluginDevelopmentHostWindow({ cli: args, userEnv: userEnv });
            }
            else if (args.pathArguments.length === 0 && args.openNewWindow) {
                usedWindows = this.windowsService.open({ cli: args, userEnv: userEnv, forceNewWindow: true, forceEmpty: true });
            }
            else if (args.pathArguments.length === 0) {
                usedWindows = [this.windowsService.focusLastActive(args)];
            }
            else {
                usedWindows = this.windowsService.open({
                    cli: args,
                    userEnv: userEnv,
                    forceNewWindow: args.waitForWindowClose || args.openNewWindow,
                    preferNewWindow: !args.openInSameWindow,
                    diffMode: args.diffMode
                });
            }
            // If the other instance is waiting to be killed, we hook up a window listener if one window
            // is being used and only then resolve the startup promise which will kill this second instance
            if (args.waitForWindowClose && usedWindows && usedWindows.length === 1 && usedWindows[0]) {
                var windowId_1 = usedWindows[0].id;
                return new winjs_base_1.TPromise(function (c, e) {
                    var unbind = _this.windowsService.onClose(function (id) {
                        if (id === windowId_1) {
                            unbind();
                            c(null);
                        }
                    });
                });
            }
            return winjs_base_1.TPromise.as(null);
        };
        LaunchService = __decorate([
            __param(0, log_1.ILogService),
            __param(1, windows_1.IWindowsService)
        ], LaunchService);
        return LaunchService;
    }());
    exports.LaunchService = LaunchService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[49], __M([0,1,42,24,3,16,4,8,27,13,28,70,33,23]), function (require, exports, nls, os, platform, arrays, env, electron_1, windows_1, storage_1, update_manager_1, keyCodes_1, product_1, package_1) {
    'use strict';
    function generateNewIssueUrl(baseUrl, name, version, commit, date) {
        var osVersion = os.type() + " " + os.arch() + " " + os.release();
        var queryStringPrefix = baseUrl.indexOf('?') === -1 ? '?' : '&';
        var body = encodeURIComponent("- VSCode Version: " + name + " " + version + " (" + (product_1.default.commit || 'Commit unknown') + ", " + (product_1.default.date || 'Date unknown') + ")\n- OS Version: " + osVersion + "\n\nSteps to Reproduce:\n\n1.\n2.");
        return "" + baseUrl + queryStringPrefix + "body=" + body;
    }
    exports.generateNewIssueUrl = generateNewIssueUrl;
    var VSCodeMenu = (function () {
        function VSCodeMenu(storageService, updateService, windowsService, envService) {
            this.storageService = storageService;
            this.updateService = updateService;
            this.windowsService = windowsService;
            this.envService = envService;
            this.actionIdKeybindingRequests = [];
            this.mapResolvedKeybindingToActionId = Object.create(null);
            this.mapLastKnownKeybindingToActionId = this.storageService.getItem(VSCodeMenu.lastKnownKeybindingsMapStorageKey) || Object.create(null);
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
            // Listen to "open" & "close" event from window service
            this.windowsService.onOpen(function (paths) { return _this.onOpen(paths); });
            this.windowsService.onClose(function (_) { return _this.onClose(_this.windowsService.getWindowCount()); });
            // Resolve keybindings when any first workbench is loaded
            this.windowsService.onReady(function (win) { return _this.resolveKeybindings(win); });
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
                    _this.storageService.setItem(VSCodeMenu.lastKnownKeybindingsMapStorageKey, _this.mapResolvedKeybindingToActionId); // keep to restore instantly after restart
                    _this.mapLastKnownKeybindingToActionId = _this.mapResolvedKeybindingToActionId; // update our last known map
                    _this.updateMenu();
                }
            });
            // Listen to update service
            this.updateService.on('change', function () { return _this.updateMenu(); });
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
            // See also https://github.com/electron/electron/issues/846
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
            var _this = this;
            // Menus
            var menubar = new electron_1.Menu();
            // Mac: Application
            var macApplicationMenuItem;
            if (platform.isMacintosh) {
                var applicationMenu = new electron_1.Menu();
                macApplicationMenuItem = new electron_1.MenuItem({ label: this.envService.product.nameShort, submenu: applicationMenu });
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
                dockMenu.append(new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(6, null)), click: function () { return _this.windowsService.openNewWindow(); } }));
                electron_1.app.dock.setMenu(dockMenu);
            }
        };
        VSCodeMenu.prototype.addToOpenedPathsList = function (path, isFile) {
            if (!path) {
                return;
            }
            var mru = this.getOpenedPathsList();
            if (isFile) {
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
            this.storageService.setItem(windows_1.WindowsManager.openedPathsListStorageKey, mru);
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
            this.storageService.setItem(windows_1.WindowsManager.openedPathsListStorageKey, mru);
        };
        VSCodeMenu.prototype.clearOpenedPathsList = function () {
            this.storageService.setItem(windows_1.WindowsManager.openedPathsListStorageKey, { folders: [], files: [] });
            electron_1.app.clearRecentDocuments();
            this.updateMenu();
        };
        VSCodeMenu.prototype.getOpenedPathsList = function () {
            var mru = this.storageService.getItem(windows_1.WindowsManager.openedPathsListStorageKey);
            if (!mru) {
                mru = { folders: [], files: [] };
            }
            return mru;
        };
        VSCodeMenu.prototype.setMacApplicationMenu = function (macApplicationMenu) {
            var _this = this;
            var about = new electron_1.MenuItem({ label: nls.localize(7, null, this.envService.product.nameLong), role: 'about' });
            var checkForUpdates = this.getUpdateMenuItems();
            var preferences = this.getPreferencesMenu();
            var hide = new electron_1.MenuItem({ label: nls.localize(8, null, this.envService.product.nameLong), role: 'hide', accelerator: 'Command+H' });
            var hideOthers = new electron_1.MenuItem({ label: nls.localize(9, null), role: 'hideothers', accelerator: 'Command+Alt+H' });
            var showAll = new electron_1.MenuItem({ label: nls.localize(10, null), role: 'unhide' });
            var quit = new electron_1.MenuItem({ label: nls.localize(11, null, this.envService.product.nameLong), click: function () { return _this.quit(); }, accelerator: 'Command+Q' });
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
            var hasNoWindows = (this.windowsService.getWindowCount() === 0);
            var newFile;
            if (hasNoWindows) {
                newFile = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(12, null)), accelerator: this.getAccelerator('workbench.action.files.newUntitledFile'), click: function () { return _this.windowsService.openNewWindow(); } });
            }
            else {
                newFile = this.createMenuItem(nls.localize(13, null), 'workbench.action.files.newUntitledFile');
            }
            var open = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(14, null)), accelerator: this.getAccelerator('workbench.action.files.openFileFolder'), click: function () { return _this.windowsService.openFileFolderPicker(); } });
            var openFolder = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(15, null)), accelerator: this.getAccelerator('workbench.action.files.openFolder'), click: function () { return _this.windowsService.openFolderPicker(); } });
            var openFile;
            if (hasNoWindows) {
                openFile = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(16, null)), accelerator: this.getAccelerator('workbench.action.files.openFile'), click: function () { return _this.windowsService.openFilePicker(); } });
            }
            else {
                openFile = this.createMenuItem(nls.localize(17, null), 'workbench.action.files.openFile');
            }
            var openRecentMenu = new electron_1.Menu();
            this.setOpenRecentMenu(openRecentMenu);
            var openRecent = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(18, null)), submenu: openRecentMenu, enabled: openRecentMenu.items.length > 0 });
            var saveFile = this.createMenuItem(nls.localize(19, null), 'workbench.action.files.save', this.windowsService.getWindowCount() > 0);
            var saveFileAs = this.createMenuItem(nls.localize(20, null), 'workbench.action.files.saveAs', this.windowsService.getWindowCount() > 0);
            var saveAllFiles = this.createMenuItem(nls.localize(21, null), 'workbench.action.files.saveAll', this.windowsService.getWindowCount() > 0);
            var preferences = this.getPreferencesMenu();
            var newWindow = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(22, null)), accelerator: this.getAccelerator('workbench.action.newWindow'), click: function () { return _this.windowsService.openNewWindow(); } });
            var revertFile = this.createMenuItem(nls.localize(23, null), 'workbench.action.files.revert', this.windowsService.getWindowCount() > 0);
            var closeWindow = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(24, null)), accelerator: this.getAccelerator('workbench.action.closeWindow'), click: function () { return _this.windowsService.getLastActiveWindow().win.close(); }, enabled: this.windowsService.getWindowCount() > 0 });
            var closeFolder = this.createMenuItem(nls.localize(25, null), 'workbench.action.closeFolder');
            var closeEditor = this.createMenuItem(nls.localize(26, null), 'workbench.action.closeActiveEditor');
            var exit = this.createMenuItem(nls.localize(27, null), function () { return _this.quit(); });
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
            var userSettings = this.createMenuItem(nls.localize(28, null), 'workbench.action.openGlobalSettings');
            var workspaceSettings = this.createMenuItem(nls.localize(29, null), 'workbench.action.openWorkspaceSettings');
            var kebindingSettings = this.createMenuItem(nls.localize(30, null), 'workbench.action.openGlobalKeybindings');
            var snippetsSettings = this.createMenuItem(nls.localize(31, null), 'workbench.action.openSnippets');
            var themeSelection = this.createMenuItem(nls.localize(32, null), 'workbench.action.selectTheme');
            var preferencesMenu = new electron_1.Menu();
            preferencesMenu.append(userSettings);
            preferencesMenu.append(workspaceSettings);
            preferencesMenu.append(__separator__());
            preferencesMenu.append(kebindingSettings);
            preferencesMenu.append(__separator__());
            preferencesMenu.append(snippetsSettings);
            preferencesMenu.append(__separator__());
            preferencesMenu.append(themeSelection);
            return new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(33, null)), submenu: preferencesMenu });
        };
        VSCodeMenu.prototype.quit = function () {
            var _this = this;
            // If the user selected to exit from an extension development host window, do not quit, but just
            // close the window unless this is the last window that is opened.
            var vscodeWindow = this.windowsService.getFocusedWindow();
            if (vscodeWindow && vscodeWindow.isPluginDevelopmentHost && this.windowsService.getWindowCount() > 1) {
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
            openRecentMenu.append(this.createMenuItem(nls.localize(34, null), 'workbench.action.reopenClosedEditor'));
            var recentList = this.getOpenedPathsList();
            // Folders
            if (recentList.folders.length > 0) {
                openRecentMenu.append(__separator__());
                recentList.folders.forEach(function (folder, index) {
                    if (index < VSCodeMenu.MAX_RECENT_ENTRIES) {
                        openRecentMenu.append(_this.createOpenRecentMenuItem(folder));
                    }
                });
            }
            // Files
            var files = recentList.files;
            if (files.length > 0) {
                openRecentMenu.append(__separator__());
                files.forEach(function (file, index) {
                    if (index < VSCodeMenu.MAX_RECENT_ENTRIES) {
                        openRecentMenu.append(_this.createOpenRecentMenuItem(file));
                    }
                });
            }
            if (recentList.folders.length || files.length) {
                openRecentMenu.append(__separator__());
                openRecentMenu.append(new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(35, null)), click: function () { return _this.clearOpenedPathsList(); } }));
            }
        };
        VSCodeMenu.prototype.createOpenRecentMenuItem = function (path) {
            var _this = this;
            return new electron_1.MenuItem({
                label: path, click: function () {
                    var success = !!_this.windowsService.open({ cli: _this.envService.cliArgs, pathsToOpen: [path] });
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
                undo = this.createDevToolsAwareMenuItem(nls.localize(36, null), 'undo', function (devTools) { return devTools.undo(); });
                redo = this.createDevToolsAwareMenuItem(nls.localize(37, null), 'redo', function (devTools) { return devTools.redo(); });
                cut = this.createRoleMenuItem(nls.localize(38, null), 'editor.action.clipboardCutAction', 'cut');
                copy = this.createRoleMenuItem(nls.localize(39, null), 'editor.action.clipboardCopyAction', 'copy');
                paste = this.createRoleMenuItem(nls.localize(40, null), 'editor.action.clipboardPasteAction', 'paste');
                selectAll = this.createDevToolsAwareMenuItem(nls.localize(41, null), 'editor.action.selectAll', function (devTools) { return devTools.selectAll(); });
            }
            else {
                undo = this.createMenuItem(nls.localize(42, null), 'undo');
                redo = this.createMenuItem(nls.localize(43, null), 'redo');
                cut = this.createMenuItem(nls.localize(44, null), 'editor.action.clipboardCutAction');
                copy = this.createMenuItem(nls.localize(45, null), 'editor.action.clipboardCopyAction');
                paste = this.createMenuItem(nls.localize(46, null), 'editor.action.clipboardPasteAction');
                selectAll = this.createMenuItem(nls.localize(47, null), 'editor.action.selectAll');
            }
            var find = this.createMenuItem(nls.localize(48, null), 'actions.find');
            var replace = this.createMenuItem(nls.localize(49, null), 'editor.action.startFindReplaceAction');
            var findInFiles = this.createMenuItem(nls.localize(50, null), 'workbench.view.search');
            var replaceInFiles = this.createMenuItem(nls.localize(51, null), 'workbench.action.replaceInFiles');
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
                findInFiles,
                replaceInFiles
            ].forEach(function (item) { return winLinuxEditMenu.append(item); });
        };
        VSCodeMenu.prototype.setViewMenu = function (viewMenu) {
            var _this = this;
            var explorer = this.createMenuItem(nls.localize(52, null), 'workbench.view.explorer');
            var search = this.createMenuItem(nls.localize(53, null), 'workbench.view.search');
            var git = this.createMenuItem(nls.localize(54, null), 'workbench.view.git');
            var debug = this.createMenuItem(nls.localize(55, null), 'workbench.view.debug');
            var extensions = this.createMenuItem(nls.localize(56, null), 'workbench.view.extensions');
            var output = this.createMenuItem(nls.localize(57, null), 'workbench.action.output.toggleOutput');
            var debugConsole = this.createMenuItem(nls.localize(58, null), 'workbench.debug.action.toggleRepl');
            var integratedTerminal = this.createMenuItem(nls.localize(59, null), 'workbench.action.terminal.toggleTerminal');
            var problems = this.createMenuItem(nls.localize(60, null), 'workbench.actions.view.problems');
            var commands = this.createMenuItem(nls.localize(61, null), 'workbench.action.showCommands');
            var fullscreen = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(62, null)), accelerator: this.getAccelerator('workbench.action.toggleFullScreen'), click: function () { return _this.windowsService.getLastActiveWindow().toggleFullScreen(); }, enabled: this.windowsService.getWindowCount() > 0 });
            var toggleMenuBar = this.createMenuItem(nls.localize(63, null), 'workbench.action.toggleMenuBar');
            var splitEditor = this.createMenuItem(nls.localize(64, null), 'workbench.action.splitEditor');
            var toggleSidebar = this.createMenuItem(nls.localize(65, null), 'workbench.action.toggleSidebarVisibility');
            var moveSidebar = this.createMenuItem(nls.localize(66, null), 'workbench.action.toggleSidebarPosition');
            var togglePanel = this.createMenuItem(nls.localize(67, null), 'workbench.action.togglePanel');
            var toggleStatusbar = this.createMenuItem(nls.localize(68, null), 'workbench.action.toggleStatusbarVisibility');
            var toggleWordWrap = this.createMenuItem(nls.localize(69, null), 'editor.action.toggleWordWrap');
            var toggleRenderWhitespace = this.createMenuItem(nls.localize(70, null), 'editor.action.toggleRenderWhitespace');
            var toggleRenderControlCharacters = this.createMenuItem(nls.localize(71, null), 'editor.action.toggleRenderControlCharacter');
            var zoomIn = this.createMenuItem(nls.localize(72, null), 'workbench.action.zoomIn');
            var zoomOut = this.createMenuItem(nls.localize(73, null), 'workbench.action.zoomOut');
            var resetZoom = this.createMenuItem(nls.localize(74, null), 'workbench.action.zoomReset');
            arrays.coalesce([
                explorer,
                search,
                git,
                debug,
                extensions,
                __separator__(),
                output,
                problems,
                debugConsole,
                integratedTerminal,
                __separator__(),
                commands,
                __separator__(),
                fullscreen,
                platform.isWindows || platform.isLinux ? toggleMenuBar : void 0,
                __separator__(),
                splitEditor,
                moveSidebar,
                toggleSidebar,
                togglePanel,
                toggleStatusbar,
                __separator__(),
                toggleWordWrap,
                toggleRenderWhitespace,
                toggleRenderControlCharacters,
                __separator__(),
                zoomIn,
                zoomOut,
                resetZoom
            ]).forEach(function (item) { return viewMenu.append(item); });
        };
        VSCodeMenu.prototype.setGotoMenu = function (gotoMenu) {
            var back = this.createMenuItem(nls.localize(75, null), 'workbench.action.navigateBack');
            var forward = this.createMenuItem(nls.localize(76, null), 'workbench.action.navigateForward');
            var switchEditorMenu = new electron_1.Menu();
            var nextEditor = this.createMenuItem(nls.localize(77, null), 'workbench.action.nextEditor');
            var previousEditor = this.createMenuItem(nls.localize(78, null), 'workbench.action.previousEditor');
            var nextEditorInGroup = this.createMenuItem(nls.localize(79, null), 'workbench.action.openNextRecentlyUsedEditorInGroup');
            var previousEditorInGroup = this.createMenuItem(nls.localize(80, null), 'workbench.action.openPreviousRecentlyUsedEditorInGroup');
            [
                nextEditor,
                previousEditor,
                __separator__(),
                nextEditorInGroup,
                previousEditorInGroup
            ].forEach(function (item) { return switchEditorMenu.append(item); });
            var switchEditor = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(81, null)), submenu: switchEditorMenu, enabled: true });
            var switchGroupMenu = new electron_1.Menu();
            var focusFirstGroup = this.createMenuItem(nls.localize(82, null), 'workbench.action.focusFirstEditorGroup');
            var focusSecondGroup = this.createMenuItem(nls.localize(83, null), 'workbench.action.focusSecondEditorGroup');
            var focusThirdGroup = this.createMenuItem(nls.localize(84, null), 'workbench.action.focusThirdEditorGroup');
            var nextGroup = this.createMenuItem(nls.localize(85, null), 'workbench.action.focusNextGroup');
            var previousGroup = this.createMenuItem(nls.localize(86, null), 'workbench.action.focusPreviousGroup');
            [
                focusFirstGroup,
                focusSecondGroup,
                focusThirdGroup,
                __separator__(),
                nextGroup,
                previousGroup
            ].forEach(function (item) { return switchGroupMenu.append(item); });
            var switchGroup = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(87, null)), submenu: switchGroupMenu, enabled: true });
            var gotoFile = this.createMenuItem(nls.localize(88, null), 'workbench.action.quickOpen');
            var gotoSymbol = this.createMenuItem(nls.localize(89, null), 'workbench.action.gotoSymbol');
            var gotoDefinition = this.createMenuItem(nls.localize(90, null), 'editor.action.goToDeclaration');
            var gotoLine = this.createMenuItem(nls.localize(91, null), 'workbench.action.gotoLine');
            [
                back,
                forward,
                __separator__(),
                switchEditor,
                switchGroup,
                __separator__(),
                gotoFile,
                gotoSymbol,
                gotoDefinition,
                gotoLine
            ].forEach(function (item) { return gotoMenu.append(item); });
        };
        VSCodeMenu.prototype.setMacWindowMenu = function (macWindowMenu) {
            var minimize = new electron_1.MenuItem({ label: nls.localize(92, null), role: 'minimize', accelerator: 'Command+M', enabled: this.windowsService.getWindowCount() > 0 });
            var close = new electron_1.MenuItem({ label: nls.localize(93, null), role: 'close', accelerator: 'Command+W', enabled: this.windowsService.getWindowCount() > 0 });
            var bringAllToFront = new electron_1.MenuItem({ label: nls.localize(94, null), role: 'front', enabled: this.windowsService.getWindowCount() > 0 });
            [
                minimize,
                close,
                __separator__(),
                bringAllToFront
            ].forEach(function (item) { return macWindowMenu.append(item); });
        };
        VSCodeMenu.prototype.toggleDevTools = function () {
            var w = this.windowsService.getFocusedWindow();
            if (w && w.win) {
                w.win.webContents.toggleDevTools();
            }
        };
        VSCodeMenu.prototype.setHelpMenu = function (helpMenu) {
            var _this = this;
            var toggleDevToolsItem = new electron_1.MenuItem({
                label: mnemonicLabel(nls.localize(95, null)),
                accelerator: this.getAccelerator('workbench.action.toggleDevTools'),
                click: function () { return _this.toggleDevTools(); },
                enabled: (this.windowsService.getWindowCount() > 0)
            });
            var issueUrl = generateNewIssueUrl(product_1.default.reportIssueUrl, package_1.default.name, package_1.default.version, product_1.default.commit, product_1.default.date);
            arrays.coalesce([
                this.envService.product.documentationUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(96, null)), click: function () { return _this.openUrl(_this.envService.product.documentationUrl, 'openDocumentationUrl'); } }) : null,
                this.envService.product.releaseNotesUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(97, null)), click: function () { return _this.openUrl(_this.envService.product.releaseNotesUrl, 'openReleaseNotesUrl'); } }) : null,
                (this.envService.product.documentationUrl || this.envService.product.releaseNotesUrl) ? __separator__() : null,
                this.envService.product.twitterUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(98, null)), click: function () { return _this.openUrl(_this.envService.product.twitterUrl, 'openTwitterUrl'); } }) : null,
                this.envService.product.requestFeatureUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(99, null)), click: function () { return _this.openUrl(_this.envService.product.requestFeatureUrl, 'openUserVoiceUrl'); } }) : null,
                this.envService.product.reportIssueUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(100, null)), click: function () { return _this.openUrl(issueUrl, 'openReportIssues'); } }) : null,
                (this.envService.product.twitterUrl || this.envService.product.requestFeatureUrl || this.envService.product.reportIssueUrl) ? __separator__() : null,
                this.envService.product.licenseUrl ? new electron_1.MenuItem({
                    label: mnemonicLabel(nls.localize(101, null)), click: function () {
                        if (platform.language) {
                            var queryArgChar = _this.envService.product.licenseUrl.indexOf('?') > 0 ? '&' : '?';
                            _this.openUrl("" + _this.envService.product.licenseUrl + queryArgChar + "lang=" + platform.language, 'openLicenseUrl');
                        }
                        else {
                            _this.openUrl(_this.envService.product.licenseUrl, 'openLicenseUrl');
                        }
                    }
                }) : null,
                this.envService.product.privacyStatementUrl ? new electron_1.MenuItem({
                    label: mnemonicLabel(nls.localize(102, null)), click: function () {
                        if (platform.language) {
                            var queryArgChar = _this.envService.product.licenseUrl.indexOf('?') > 0 ? '&' : '?';
                            _this.openUrl("" + _this.envService.product.privacyStatementUrl + queryArgChar + "lang=" + platform.language, 'openPrivacyStatement');
                        }
                        else {
                            _this.openUrl(_this.envService.product.privacyStatementUrl, 'openPrivacyStatement');
                        }
                    }
                }) : null,
                (this.envService.product.licenseUrl || this.envService.product.privacyStatementUrl) ? __separator__() : null,
                toggleDevToolsItem,
            ]).forEach(function (item) { return helpMenu.append(item); });
            if (!platform.isMacintosh) {
                var updateMenuItems = this.getUpdateMenuItems();
                if (updateMenuItems.length) {
                    helpMenu.append(__separator__());
                    updateMenuItems.forEach(function (i) { return helpMenu.append(i); });
                }
                helpMenu.append(__separator__());
                helpMenu.append(new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(103, null)), click: function () { return _this.openAboutDialog(); } }));
            }
        };
        VSCodeMenu.prototype.getUpdateMenuItems = function () {
            var _this = this;
            switch (this.updateService.state) {
                case update_manager_1.State.Uninitialized:
                    return [];
                case update_manager_1.State.UpdateDownloaded:
                    var update_1 = this.updateService.availableUpdate;
                    return [new electron_1.MenuItem({
                            label: nls.localize(104, null), click: function () {
                                _this.reportMenuActionTelemetry('RestartToUpdate');
                                update_1.quitAndUpdate();
                            }
                        })];
                case update_manager_1.State.CheckingForUpdate:
                    return [new electron_1.MenuItem({ label: nls.localize(105, null), enabled: false })];
                case update_manager_1.State.UpdateAvailable:
                    if (platform.isLinux) {
                        var update_2 = this.updateService.availableUpdate;
                        return [new electron_1.MenuItem({
                                label: nls.localize(106, null), click: function () {
                                    update_2.quitAndUpdate();
                                }
                            })];
                    }
                    var updateAvailableLabel = platform.isWindows
                        ? nls.localize(107, null)
                        : nls.localize(108, null);
                    return [new electron_1.MenuItem({ label: updateAvailableLabel, enabled: false })];
                default:
                    var result = [new electron_1.MenuItem({
                            label: nls.localize(109, null), click: function () { return setTimeout(function () {
                                _this.reportMenuActionTelemetry('CheckForUpdate');
                                _this.updateService.checkForUpdates(true);
                            }, 0); }
                        })];
                    return result;
            }
        };
        VSCodeMenu.prototype.createMenuItem = function (arg1, arg2, arg3) {
            var _this = this;
            var label = mnemonicLabel(arg1);
            var click = (typeof arg2 === 'function') ? arg2 : function () { return _this.windowsService.sendToFocused('vscode:runAction', arg2); };
            var enabled = typeof arg3 === 'boolean' ? arg3 : this.windowsService.getWindowCount() > 0;
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
            var _this = this;
            return new electron_1.MenuItem({
                label: mnemonicLabel(label),
                accelerator: this.getAccelerator(actionId),
                enabled: this.windowsService.getWindowCount() > 0,
                click: function () {
                    var windowInFocus = _this.windowsService.getFocusedWindow();
                    if (!windowInFocus) {
                        return;
                    }
                    if (windowInFocus.win.webContents.isDevToolsFocused()) {
                        devToolsFocusedFn(windowInFocus.win.webContents.devToolsWebContents);
                    }
                    else {
                        _this.windowsService.sendToFocused('vscode:runAction', actionId);
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
        VSCodeMenu.prototype.openAboutDialog = function () {
            var lastActiveWindow = this.windowsService.getFocusedWindow() || this.windowsService.getLastActiveWindow();
            electron_1.dialog.showMessageBox(lastActiveWindow && lastActiveWindow.win, {
                title: this.envService.product.nameLong,
                type: 'info',
                message: this.envService.product.nameLong,
                detail: nls.localize(110, null, this.envService.product.kodeStudioVersion, this.envService.product.commit || 'Unknown', this.envService.product.date || 'Unknown', process.versions['electron'], process.versions['chrome'], process.versions['node']),
                buttons: [nls.localize(111, null)],
                noLink: true
            }, function (result) { return null; });
            this.reportMenuActionTelemetry('showAboutDialog');
        };
        VSCodeMenu.prototype.openUrl = function (url, id) {
            electron_1.shell.openExternal(url);
            this.reportMenuActionTelemetry(id);
        };
        VSCodeMenu.prototype.reportMenuActionTelemetry = function (id) {
            this.windowsService.sendToFocused('vscode:telemetry', { eventName: 'workbenchActionExecuted', data: { id: id, from: 'menu' } });
        };
        VSCodeMenu.lastKnownKeybindingsMapStorageKey = 'lastKnownKeybindings';
        VSCodeMenu.MAX_RECENT_ENTRIES = 10;
        VSCodeMenu = __decorate([
            __param(0, storage_1.IStorageService),
            __param(1, update_manager_1.IUpdateService),
            __param(2, windows_1.IWindowsService),
            __param(3, env.IEnvironmentService)
        ], VSCodeMenu);
        return VSCodeMenu;
    }());
    exports.VSCodeMenu = VSCodeMenu;
    function __separator__() {
        return new electron_1.MenuItem({ type: 'separator' });
    }
    function mnemonicLabel(label) {
        if (platform.isMacintosh) {
            return label.replace(/\(&&\w\)|&&/g, ''); // no mnemonic support on mac/linux
        }
        return label.replace(/&&/g, '&');
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[81], __M([0,1,9,21,8,10,3,4,27,22,49,15,28,56,2,64,65,48,71,5,51,31,29,17,13,30,32]), function (require, exports, nls, fs, electron_1, objects_1, platform, env_1, windows_1, lifecycle_1, menus_1, settings_1, update_manager_1, ipc_net_1, winjs_base_1, gitIpc_1, askpassService_1, sharedProcess_1, launch_1, instantiation_1, instantiationService_1, serviceCollection_1, descriptors_1, log_1, storage_1, cp, uuid_1) {
    'use strict';
    function quit(accessor, arg) {
        var logService = accessor.get(log_1.ILogService);
        var exitCode = 0;
        if (typeof arg === 'string') {
            logService.log(arg);
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
        process.exit(exitCode); // in main, process.exit === app.exit
    }
    function main(accessor, ipcServer, userEnv) {
        var instantiationService = accessor.get(instantiation_1.IInstantiationService);
        var logService = accessor.get(log_1.ILogService);
        var envService = accessor.get(env_1.IEnvironmentService);
        var windowsService = accessor.get(windows_1.IWindowsService);
        var lifecycleService = accessor.get(lifecycle_1.ILifecycleService);
        var updateService = accessor.get(update_manager_1.IUpdateService);
        var settingsService = accessor.get(settings_1.ISettingsService);
        // We handle uncaught exceptions here to prevent electron from opening a dialog to the user
        process.on('uncaughtException', function (err) {
            if (err) {
                // take only the message and stack property
                var friendlyError = {
                    message: err.message,
                    stack: err.stack
                };
                // handle on client side
                windowsService.sendToFocused('vscode:reportError', JSON.stringify(friendlyError));
            }
            console.error('[uncaught exception in main]: ' + err);
            if (err.stack) {
                console.error(err.stack);
            }
        });
        logService.log('### VSCode main.js ###');
        logService.log(envService.appRoot, envService.cliArgs);
        // Setup Windows mutex
        var windowsMutex = null;
        try {
            var Mutex_1 = require.__$__nodeRequire('windows-mutex').Mutex;
            windowsMutex = new Mutex_1(envService.product.win32MutexName);
        }
        catch (e) {
        }
        // Register IPC services
        var launchService = instantiationService.createInstance(launch_1.LaunchService);
        var launchChannel = new launch_1.LaunchChannel(launchService);
        ipcServer.registerChannel('launch', launchChannel);
        var askpassService = new askpassService_1.GitAskpassService();
        var askpassChannel = new gitIpc_1.AskpassChannel(askpassService);
        ipcServer.registerChannel('askpass', askpassChannel);
        // Used by sub processes to communicate back to the main instance
        process.env['VSCODE_PID'] = '' + process.pid;
        process.env['VSCODE_IPC_HOOK'] = envService.mainIPCHandle;
        process.env['VSCODE_SHARED_IPC_HOOK'] = envService.sharedIPCHandle;
        // Spawn shared process
        var sharedProcess = sharedProcess_1.spawnSharedProcess({
            allowOutput: !envService.isBuilt || envService.cliArgs.verboseLogging,
            debugPort: envService.isBuilt ? null : 5871
        });
        // Make sure we associate the program with the app user model id
        // This will help Windows to associate the running program with
        // any shortcut that is pinned to the taskbar and prevent showing
        // two icons in the taskbar for the same app.
        if (platform.isWindows && envService.product.win32AppUserModelId) {
            electron_1.app.setAppUserModelId(envService.product.win32AppUserModelId);
        }
        // Set programStart in the global scope
        global.programStart = envService.cliArgs.programStart;
        function dispose() {
            if (ipcServer) {
                ipcServer.dispose();
                ipcServer = null;
            }
            sharedProcess.dispose();
            if (windowsMutex) {
                windowsMutex.release();
            }
        }
        // Dispose on app quit
        electron_1.app.on('will-quit', function () {
            logService.log('App#will-quit: disposing resources');
            dispose();
        });
        // Dispose on vscode:exit
        electron_1.ipcMain.on('vscode:exit', function (event, code) {
            logService.log('IPC#vscode:exit', code);
            dispose();
            process.exit(code); // in main, process.exit === app.exit
        });
        // Lifecycle
        lifecycleService.ready();
        // Load settings
        settingsService.loadSync();
        // Propagate to clients
        windowsService.ready(userEnv);
        // Install Menu
        var menu = instantiationService.createInstance(menus_1.VSCodeMenu);
        menu.ready();
        // Install Tasks
        if (platform.isWindows && envService.isBuilt) {
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
        updateService.initialize();
        // Open our first window
        if (envService.cliArgs.openNewWindow && envService.cliArgs.pathArguments.length === 0) {
            windowsService.open({ cli: envService.cliArgs, forceNewWindow: true, forceEmpty: true }); // new window if "-n" was used without paths
        }
        else if (global.macOpenFiles && global.macOpenFiles.length && (!envService.cliArgs.pathArguments || !envService.cliArgs.pathArguments.length)) {
            windowsService.open({ cli: envService.cliArgs, pathsToOpen: global.macOpenFiles }); // mac: open-file event received on startup
        }
        else {
            windowsService.open({ cli: envService.cliArgs, forceNewWindow: envService.cliArgs.openNewWindow, diffMode: envService.cliArgs.diffMode }); // default: read paths from cli
        }
    }
    function setupIPC(accessor) {
        var logService = accessor.get(log_1.ILogService);
        var envService = accessor.get(env_1.IEnvironmentService);
        function setup(retry) {
            return ipc_net_1.serve(envService.mainIPCHandle).then(function (server) {
                if (platform.isMacintosh) {
                    electron_1.app.dock.show(); // dock might be hidden at this case due to a retry
                }
                return server;
            }, function (err) {
                if (err.code !== 'EADDRINUSE') {
                    return winjs_base_1.TPromise.wrapError(err);
                }
                // Since we are the second instance, we do not want to show the dock
                if (platform.isMacintosh) {
                    electron_1.app.dock.hide();
                }
                // there's a running instance, let's connect to it
                return ipc_net_1.connect(envService.mainIPCHandle).then(function (client) {
                    // Tests from CLI require to be the only instance currently (TODO@Ben support multiple instances and output)
                    if (envService.isTestingFromCli) {
                        var msg = 'Running extension tests from the command line is currently only supported if no other instance of Code is running.';
                        console.error(msg);
                        client.dispose();
                        return winjs_base_1.TPromise.wrapError(msg);
                    }
                    logService.log('Sending env to running instance...');
                    var channel = client.getChannel('launch');
                    var service = new launch_1.LaunchChannelClient(channel);
                    return service.start(envService.cliArgs, process.env)
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
                        fs.unlinkSync(envService.mainIPCHandle);
                    }
                    catch (e) {
                        logService.log('Fatal error deleting obsolete instance handle', e);
                        return winjs_base_1.TPromise.wrapError(e);
                    }
                    return setup(false);
                });
            });
        }
        return setup(true);
    }
    // TODO: isolate
    var services = new serviceCollection_1.ServiceCollection();
    services.set(env_1.IEnvironmentService, new descriptors_1.SyncDescriptor(env_1.EnvService));
    services.set(log_1.ILogService, new descriptors_1.SyncDescriptor(log_1.MainLogService));
    services.set(windows_1.IWindowsService, new descriptors_1.SyncDescriptor(windows_1.WindowsManager));
    services.set(lifecycle_1.ILifecycleService, new descriptors_1.SyncDescriptor(lifecycle_1.LifecycleService));
    services.set(storage_1.IStorageService, new descriptors_1.SyncDescriptor(storage_1.StorageService));
    services.set(update_manager_1.IUpdateService, new descriptors_1.SyncDescriptor(update_manager_1.UpdateManager));
    services.set(settings_1.ISettingsService, new descriptors_1.SyncDescriptor(settings_1.SettingsManager));
    var instantiationService = new instantiationService_1.InstantiationService(services);
    function getUnixUserEnvironment() {
        var promise = new winjs_base_1.TPromise(function (c, e) {
            var runAsNode = process.env['ATOM_SHELL_INTERNAL_RUN_AS_NODE'];
            var noAttach = process.env['ELECTRON_NO_ATTACH_CONSOLE'];
            var mark = uuid_1.generateUuid().replace(/-/g, '').substr(0, 12);
            var regex = new RegExp(mark + '(.*)' + mark);
            var env = objects_1.assign({}, process.env, {
                ATOM_SHELL_INTERNAL_RUN_AS_NODE: '1',
                ELECTRON_NO_ATTACH_CONSOLE: '1'
            });
            var command = "'" + process.execPath + "' -p '\"" + mark + "\" + JSON.stringify(process.env) + \"" + mark + "\"'";
            var child = cp.spawn(process.env.SHELL, ['-ilc', command], {
                detached: true,
                stdio: ['ignore', 'pipe', process.stderr],
                env: env
            });
            var buffers = [];
            child.on('error', function () { return c({}); });
            child.stdout.on('data', function (b) { return buffers.push(b); });
            child.on('close', function (code, signal) {
                if (code !== 0) {
                    return e(new Error('Failed to get environment'));
                }
                var raw = Buffer.concat(buffers).toString('utf8');
                var match = regex.exec(raw);
                var rawStripped = match ? match[1] : '{}';
                try {
                    var env_2 = JSON.parse(rawStripped);
                    if (runAsNode) {
                        env_2['ATOM_SHELL_INTERNAL_RUN_AS_NODE'] = runAsNode;
                    }
                    else {
                        delete env_2['ATOM_SHELL_INTERNAL_RUN_AS_NODE'];
                    }
                    if (noAttach) {
                        env_2['ELECTRON_NO_ATTACH_CONSOLE'] = noAttach;
                    }
                    else {
                        delete env_2['ELECTRON_NO_ATTACH_CONSOLE'];
                    }
                    c(env_2);
                }
                catch (err) {
                    e(err);
                }
            });
        });
        // swallow errors
        return promise.then(null, function () { return ({}); });
    }
    function getUserEnvironment() {
        return platform.isWindows ? winjs_base_1.TPromise.as({}) : getUnixUserEnvironment();
    }
    // On some platforms we need to manually read from the global environment variables
    // and assign them to the process environment (e.g. when doubleclick app on Mac)
    getUserEnvironment()
        .then(function (userEnv) {
        if (process.env['VSCODE_CLI'] !== '1') {
            objects_1.assign(process.env, userEnv);
        }
        // Make sure the NLS Config travels to the rendered process
        // See also https://github.com/Microsoft/vscode/issues/4558
        userEnv['VSCODE_NLS_CONFIG'] = process.env['VSCODE_NLS_CONFIG'];
        return instantiationService.invokeFunction(function (a) { return a.get(env_1.IEnvironmentService).createPaths(); })
            .then(function () { return instantiationService.invokeFunction(setupIPC); })
            .then(function (ipcServer) { return instantiationService.invokeFunction(main, ipcServer, userEnv); });
    })
        .done(null, function (err) { return instantiationService.invokeFunction(quit, err); });
});

}).call(this);
//# sourceMappingURL=main.js.map
