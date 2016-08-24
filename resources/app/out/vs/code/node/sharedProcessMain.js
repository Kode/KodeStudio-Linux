/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["require","exports","vs/base/common/winjs.base","vs/nls!vs/code/node/sharedProcessMain","vs/nls","vs/base/common/types","vs/base/common/platform","path","vs/base/common/errors","vs/base/common/objects","vs/base/common/event","vs/platform/instantiation/common/instantiation","fs","vs/base/common/lifecycle","vs/platform/platform","vs/base/common/async","vs/base/node/pfs","vs/base/common/json","vs/base/common/uri","vs/base/common/strings","os","vs/platform/environment/common/environment","vs/platform/package","vs/base/common/arrays","vs/base/common/collections","vs/base/common/jsonFormatter","vs/base/common/eventEmitter","vs/platform/product","vs/platform/instantiation/common/descriptors","vs/base/common/paths","vs/platform/configuration/common/configuration","vs/base/common/assert","vs/platform/instantiation/common/serviceCollection","vs/base/common/uuid","vs/base/parts/ipc/common/ipc","vs/platform/jsonschemas/common/jsonContributionRegistry","vs/platform/extensions/common/extensionsRegistry","vs/base/common/timer","vs/base/node/proxy","url","vs/base/parts/ipc/node/ipc.net","vs/platform/telemetry/node/appInsightsAppender","vs/nls!vs/base/common/json","vs/base/node/request","vs/base/node/zip","vs/base/common/jsonEdit","vs/base/node/userSettings","vs/nls!vs/base/common/errors","vs/base/common/severity","vs/nls!vs/base/node/zip","vs/nls!vs/code/node/argv","vs/code/node/argv","vs/base/common/map","vs/platform/telemetry/common/telemetryService","vs/nls!vs/platform/configuration/common/configurationRegistry","vs/nls!vs/platform/extensionManagement/common/extensionManagement","vs/nls!vs/platform/extensionManagement/node/extensionManagementService","vs/nls!vs/platform/extensions/common/extensionsRegistry","vs/nls!vs/platform/extensions/node/extensionValidator","vs/nls!vs/platform/telemetry/common/telemetryService","vs/platform/event/common/eventService","vs/platform/extensionManagement/common/extensionManagementIpc","vs/base/common/graph","vs/base/node/flow","vs/base/common/callbackList","vs/platform/extensionManagement/node/extensionManagementService","vs/platform/configuration/node/nodeConfigurationService","vs/platform/event/common/event","vs/platform/extensionManagement/common/extensionManagement","vs/base/common/cancellation","vs/platform/instantiation/common/instantiationService","vs/base/node/extfs","vs/base/common/stopwatch","vs/nls!vs/base/common/severity","vs/platform/telemetry/node/commonProperties","vs/platform/configuration/common/configurationRegistry","vs/platform/extensions/node/extensionValidator","semver","vs/base/node/paths","vs/platform/environment/node/environmentService","vs/platform/telemetry/common/telemetry","vs/platform/telemetry/common/telemetryIpc","http-proxy-agent","minimist","applicationinsights","vs/base/common/winjs.base.raw","https-proxy-agent","yauzl","net","https","http","zlib","assert","vs/code/node/sharedProcessMain"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[23], __M([0,1]), function (require, exports) {
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

define(__m[31], __M([0,1]), function (require, exports) {
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

define(__m[24], __M([0,1]), function (require, exports) {
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
define(__m[52], __M([0,1]), function (require, exports) {
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

define(__m[6], __M([0,1]), function (require, exports) {
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

define(__m[29], __M([0,1,6]), function (require, exports, platform_1) {
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

define(__m[72], __M([0,1,6]), function (require, exports, platform_1) {
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

define(__m[19], __M([0,1,52]), function (require, exports, map_1) {
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

define(__m[5], __M([0,1]), function (require, exports) {
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

define(__m[62], __M([0,1,5,24]), function (require, exports, types_1, collections_1) {
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






define(__m[13], __M([0,1,5]), function (require, exports, types_1) {
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

define(__m[9], __M([0,1,5]), function (require, exports, Types) {
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

define(__m[18], __M([0,1,6]), function (require, exports, platform) {
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






define(__m[33], __M([0,1]), function (require, exports) {
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
define(__m[63], __M([0,1,92]), function (require, exports, assert) {
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
define(__m[71], __M([0,1,33,19,6,63,12,7]), function (require, exports, uuid, strings, platform, flow, fs, paths) {
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
define(__m[78], __M([0,1,18]), function (require, exports, uri_1) {
    "use strict";
    var pathsPath = uri_1.default.parse(require.toUrl('paths')).fsPath;
    var paths = require.__$__nodeRequire(pathsPath);
    exports.getAppDataPath = paths.getAppDataPath;
    exports.getUserDataPath = paths.getUserDataPath;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[38], __M([0,1,39,5,82,86]), function (require, exports, url_1, types_1, HttpProxyAgent, HttpsProxyAgent) {
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

define(__m[47], __M([4,3]), function(nls, data) { return nls.create("vs/base/common/errors", data); });
define(__m[8], __M([0,1,47,9,6,5,23,19]), function (require, exports, nls, objects, platform, types, arrays, strings) {
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

define(__m[64], __M([0,1,8]), function (require, exports, errors_1) {
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

define(__m[10], __M([0,1,64]), function (require, exports, callbackList_1) {
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
define(__m[69], __M([0,1,10]), function (require, exports, event_1) {
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






define(__m[26], __M([0,1,8]), function (require, exports, Errors) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var EmitterEvent = (function () {
        function EmitterEvent(eventType, data) {
            if (eventType === void 0) { eventType = null; }
            if (data === void 0) { data = null; }
            this._type = eventType;
            this._data = data;
        }
        EmitterEvent.prototype.getType = function () {
            return this._type;
        };
        EmitterEvent.prototype.getData = function () {
            return this._data;
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
            return {
                dispose: function () {
                    if (!bound) {
                        // Already called
                        return;
                    }
                    bound._removeListener(eventType, listener);
                    // Prevent leakers from holding on to the event emitter
                    bound = null;
                    listener = null;
                }
            };
        };
        EventEmitter.prototype.addListener2 = function (eventType, listener) {
            return this.addListener(eventType, listener);
        };
        EventEmitter.prototype.addOneTimeDisposableListener = function (eventType, listener) {
            var disposable = this.addListener(eventType, function (value) {
                disposable.dispose();
                listener(value);
            });
            return disposable;
        };
        EventEmitter.prototype.addBulkListener = function (listener) {
            var _this = this;
            this._bulkListeners.push(listener);
            return {
                dispose: function () {
                    _this._removeBulkListener(listener);
                }
            };
        };
        EventEmitter.prototype.addBulkListener2 = function (listener) {
            return this.addBulkListener(listener);
        };
        EventEmitter.prototype.addEmitter = function (eventEmitter) {
            var _this = this;
            return eventEmitter.addBulkListener2(function (events) {
                var newEvents = events;
                if (_this._deferredCnt === 0) {
                    _this._emitEvents(newEvents);
                }
                else {
                    // Collect for later
                    _this._collectedEvents.push.apply(_this._collectedEvents, newEvents);
                }
            });
        };
        EventEmitter.prototype.addEmitter2 = function (eventEmitter) {
            return this.addEmitter(eventEmitter);
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
                    safeInvoke1Arg(listeners[i], data);
                }
            }
        };
        EventEmitter.prototype._emitToBulkListeners = function (events) {
            var bulkListeners = this._bulkListeners.slice(0);
            for (var i = 0, len = bulkListeners.length; i < len; i++) {
                safeInvoke1Arg(bulkListeners[i], events);
            }
        };
        EventEmitter.prototype._emitEvents = function (events) {
            if (this._bulkListeners.length > 0) {
                this._emitToBulkListeners(events);
            }
            for (var i = 0, len = events.length; i < len; i++) {
                var e = events[i];
                this._emitToSpecificTypeListeners(e.getType(), e.getData());
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
            var result = safeInvokeNoArg(callback);
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
                safeInvoke1Arg(queueElement.target, queueElement.arg);
            }
        };
        return OrderGuaranteeEventEmitter;
    }(EventEmitter));
    exports.OrderGuaranteeEventEmitter = OrderGuaranteeEventEmitter;
    function safeInvokeNoArg(func) {
        try {
            return func();
        }
        catch (e) {
            Errors.onUnexpectedError(e);
        }
    }
    function safeInvoke1Arg(func, arg1) {
        try {
            return func(arg1);
        }
        catch (e) {
            Errors.onUnexpectedError(e);
        }
    }
});

define(__m[37], __M([0,1,6,8,72]), function (require, exports, Platform, errors, precision) {
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
    var TimeKeeper = (function () {
        function TimeKeeper() {
            this.cleaningIntervalId = -1;
            this.collectedEvents = [];
            this.listeners = [];
        }
        TimeKeeper.prototype.isEnabled = function () {
            return exports.ENABLE_TIMER;
        };
        TimeKeeper.prototype.start = function (topic, name, start, description) {
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
        TimeKeeper.prototype.dispose = function () {
            if (this.cleaningIntervalId !== -1) {
                Platform.clearInterval(this.cleaningIntervalId);
                this.cleaningIntervalId = -1;
            }
        };
        TimeKeeper.prototype.addListener = function (listener) {
            var _this = this;
            this.listeners.push(listener);
            return {
                dispose: function () {
                    for (var i = 0; i < _this.listeners.length; i++) {
                        if (_this.listeners[i] === listener) {
                            _this.listeners.splice(i, 1);
                            return;
                        }
                    }
                }
            };
        };
        TimeKeeper.prototype.addEvent = function (event) {
            event.id = TimeKeeper.EVENT_ID;
            TimeKeeper.EVENT_ID++;
            this.collectedEvents.push(event);
            // expire items from the front of the cache
            if (this.collectedEvents.length > TimeKeeper._EVENT_CACHE_LIMIT) {
                this.collectedEvents.shift();
            }
        };
        TimeKeeper.prototype.initAutoCleaning = function () {
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
        TimeKeeper.prototype.getCollectedEvents = function () {
            return this.collectedEvents.slice(0);
        };
        TimeKeeper.prototype.clearCollectedEvents = function () {
            this.collectedEvents = [];
        };
        TimeKeeper.prototype._onEventStopped = function (event) {
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
        TimeKeeper.prototype.setInitialCollectedEvents = function (events, startTime) {
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
        TimeKeeper._MAX_TIMER_LENGTH = 60000; // 1 minute
        /**
         * Every 2 minutes, a sweep of current started timers is done.
         */
        TimeKeeper._CLEAN_UP_INTERVAL = 120000; // 2 minutes
        /**
         * Collect at most 1000 events.
         */
        TimeKeeper._EVENT_CACHE_LIMIT = 1000;
        TimeKeeper.EVENT_ID = 1;
        TimeKeeper.PARSE_TIME = new Date();
        return TimeKeeper;
    }());
    exports.TimeKeeper = TimeKeeper;
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

define(__m[2], __M([85,8]), function (winjs, __Errors__) {
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





define(__m[15], __M([0,1,8,6,2,69,13]), function (require, exports, errors, platform, winjs_base_1, cancellation_1, lifecycle_1) {
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
define(__m[16], __M([0,1,2,71,29,7,15,12]), function (require, exports, winjs_base_1, extfs, paths, path_1, async_1, fs) {
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
define(__m[34], __M([0,1,2,13,10]), function (require, exports, winjs_base_1, lifecycle_1, event_1) {
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
define(__m[40], __M([0,1,88,2,10,34]), function (require, exports, net_1, winjs_base_1, event_1, ipc_1) {
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

define(__m[42], __M([4,3]), function(nls, data) { return nls.create("vs/base/common/json", data); });
define(__m[17], __M([0,1,42]), function (require, exports, nls_1) {
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

define(__m[25], __M([0,1,17]), function (require, exports, Json) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function applyEdit(text, edit) {
        return text.substring(0, edit.offset) + edit.content + text.substring(edit.offset + edit.length);
    }
    exports.applyEdit = applyEdit;
    function applyEdits(text, edits) {
        for (var i = edits.length - 1; i >= 0; i--) {
            text = applyEdit(text, edits[i]);
        }
        return text;
    }
    exports.applyEdits = applyEdits;
    function format(documentText, range, options) {
        var initialIndentLevel;
        var value;
        var rangeStart;
        var rangeEnd;
        if (range) {
            rangeStart = range.offset;
            rangeEnd = rangeStart + range.length;
            while (rangeStart > 0 && !isEOL(documentText, rangeStart - 1)) {
                rangeStart--;
            }
            var scanner_1 = Json.createScanner(documentText, true);
            scanner_1.setPosition(rangeEnd);
            scanner_1.scan();
            rangeEnd = scanner_1.getPosition();
            value = documentText.substring(rangeStart, rangeEnd);
            initialIndentLevel = computeIndentLevel(value, 0, options);
        }
        else {
            value = documentText;
            rangeStart = 0;
            rangeEnd = documentText.length;
            initialIndentLevel = 0;
        }
        var eol = getEOL(options, documentText);
        var lineBreak = false;
        var indentLevel = 0;
        var indentValue;
        if (options.insertSpaces) {
            indentValue = repeat(' ', options.tabSize);
        }
        else {
            indentValue = '\t';
        }
        var scanner = Json.createScanner(value, false);
        function newLineAndIndent() {
            return eol + repeat(indentValue, initialIndentLevel + indentLevel);
        }
        function scanNext() {
            var token = scanner.scan();
            lineBreak = false;
            while (token === Json.SyntaxKind.Trivia || token === Json.SyntaxKind.LineBreakTrivia) {
                lineBreak = lineBreak || (token === Json.SyntaxKind.LineBreakTrivia);
                token = scanner.scan();
            }
            return token;
        }
        var editOperations = [];
        function addEdit(text, startOffset, endOffset) {
            if (documentText.substring(startOffset, endOffset) !== text) {
                editOperations.push({ offset: startOffset, length: endOffset - startOffset, content: text });
            }
        }
        var firstToken = scanNext();
        if (firstToken !== Json.SyntaxKind.EOF) {
            var firstTokenStart = scanner.getTokenOffset() + rangeStart;
            var initialIndent = repeat(indentValue, initialIndentLevel);
            addEdit(initialIndent, rangeStart, firstTokenStart);
        }
        while (firstToken !== Json.SyntaxKind.EOF) {
            var firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + rangeStart;
            var secondToken = scanNext();
            var replaceContent = '';
            while (!lineBreak && (secondToken === Json.SyntaxKind.LineCommentTrivia || secondToken === Json.SyntaxKind.BlockCommentTrivia)) {
                // comments on the same line: keep them on the same line, but ignore them otherwise
                var commentTokenStart = scanner.getTokenOffset() + rangeStart;
                addEdit(' ', firstTokenEnd, commentTokenStart);
                firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + rangeStart;
                replaceContent = secondToken === Json.SyntaxKind.LineCommentTrivia ? newLineAndIndent() : '';
                secondToken = scanNext();
            }
            if (secondToken === Json.SyntaxKind.CloseBraceToken) {
                if (firstToken !== Json.SyntaxKind.OpenBraceToken) {
                    indentLevel--;
                    replaceContent = newLineAndIndent();
                }
            }
            else if (secondToken === Json.SyntaxKind.CloseBracketToken) {
                if (firstToken !== Json.SyntaxKind.OpenBracketToken) {
                    indentLevel--;
                    replaceContent = newLineAndIndent();
                }
            }
            else if (secondToken !== Json.SyntaxKind.EOF) {
                switch (firstToken) {
                    case Json.SyntaxKind.OpenBracketToken:
                    case Json.SyntaxKind.OpenBraceToken:
                        indentLevel++;
                        replaceContent = newLineAndIndent();
                        break;
                    case Json.SyntaxKind.CommaToken:
                    case Json.SyntaxKind.LineCommentTrivia:
                        replaceContent = newLineAndIndent();
                        break;
                    case Json.SyntaxKind.BlockCommentTrivia:
                        if (lineBreak) {
                            replaceContent = newLineAndIndent();
                        }
                        else {
                            // symbol following comment on the same line: keep on same line, separate with ' '
                            replaceContent = ' ';
                        }
                        break;
                    case Json.SyntaxKind.ColonToken:
                        replaceContent = ' ';
                        break;
                    case Json.SyntaxKind.NullKeyword:
                    case Json.SyntaxKind.TrueKeyword:
                    case Json.SyntaxKind.FalseKeyword:
                    case Json.SyntaxKind.NumericLiteral:
                        if (secondToken === Json.SyntaxKind.NullKeyword || secondToken === Json.SyntaxKind.FalseKeyword || secondToken === Json.SyntaxKind.NumericLiteral) {
                            replaceContent = ' ';
                        }
                        break;
                }
                if (lineBreak && (secondToken === Json.SyntaxKind.LineCommentTrivia || secondToken === Json.SyntaxKind.BlockCommentTrivia)) {
                    replaceContent = newLineAndIndent();
                }
            }
            var secondTokenStart = scanner.getTokenOffset() + rangeStart;
            addEdit(replaceContent, firstTokenEnd, secondTokenStart);
            firstToken = secondToken;
        }
        return editOperations;
    }
    exports.format = format;
    function repeat(s, count) {
        var result = '';
        for (var i = 0; i < count; i++) {
            result += s;
        }
        return result;
    }
    function computeIndentLevel(content, offset, options) {
        var i = 0;
        var nChars = 0;
        var tabSize = options.tabSize || 4;
        while (i < content.length) {
            var ch = content.charAt(i);
            if (ch === ' ') {
                nChars++;
            }
            else if (ch === '\t') {
                nChars += tabSize;
            }
            else {
                break;
            }
            i++;
        }
        return Math.floor(nChars / tabSize);
    }
    function getEOL(options, text) {
        for (var i = 0; i < text.length; i++) {
            var ch = text.charAt(i);
            if (ch === '\r') {
                if (i + 1 < text.length && text.charAt(i + 1) === '\n') {
                    return '\r\n';
                }
                return '\r';
            }
            else if (ch === '\n') {
                return '\n';
            }
        }
        return (options && options.eol) || '\n';
    }
    function isEOL(text, offset) {
        return '\r\n'.indexOf(text.charAt(offset)) !== -1;
    }
});

define(__m[45], __M([0,1,17,25]), function (require, exports, json_1, jsonFormatter_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function removeProperty(text, path, formattingOptions) {
        return setProperty(text, path, void 0, formattingOptions);
    }
    exports.removeProperty = removeProperty;
    function setProperty(text, path, value, formattingOptions, getInsertionIndex) {
        var errors = [];
        var root = json_1.parseTree(text, errors);
        var parent = void 0;
        var lastSegment = void 0;
        while (path.length > 0) {
            lastSegment = path.pop();
            parent = json_1.findNodeAtLocation(root, path);
            if (parent === void 0 && value !== void 0) {
                if (typeof lastSegment === 'string') {
                    value = (_a = {}, _a[lastSegment] = value, _a);
                }
                else {
                    value = [value];
                }
            }
            else {
                break;
            }
        }
        if (!parent) {
            // empty document
            if (value === void 0) {
                throw new Error('Can not delete in empty document');
            }
            return withFormatting(text, { offset: root ? root.offset : 0, length: root ? root.length : 0, content: JSON.stringify(value) }, formattingOptions);
        }
        else if (parent.type === 'object' && typeof lastSegment === 'string') {
            var existing = json_1.findNodeAtLocation(parent, [lastSegment]);
            if (existing !== void 0) {
                if (value === void 0) {
                    var propertyIndex = parent.children.indexOf(existing.parent);
                    var removeBegin = void 0;
                    var removeEnd = existing.parent.offset + existing.parent.length;
                    if (propertyIndex > 0) {
                        // remove the comma of the previous node
                        var previous = parent.children[propertyIndex - 1];
                        removeBegin = previous.offset + previous.length;
                    }
                    else {
                        removeBegin = parent.offset + 1;
                        if (parent.children.length > 1) {
                            // remove the comma of the next node
                            var next = parent.children[1];
                            removeEnd = next.offset;
                        }
                    }
                    return withFormatting(text, { offset: removeBegin, length: removeEnd - removeBegin, content: '' }, formattingOptions);
                }
                else {
                    // set value of existing property
                    return [{ offset: existing.offset, length: existing.length, content: JSON.stringify(value) }];
                }
            }
            else {
                if (value === void 0) {
                    throw new Error("Property " + lastSegment + " does not exist.");
                }
                var newProperty = JSON.stringify(lastSegment) + ": " + JSON.stringify(value);
                var index = getInsertionIndex ? getInsertionIndex(parent.children.map(function (p) { return p.children[0].value; })) : parent.children.length;
                var edit = void 0;
                if (index > 0) {
                    var previous = parent.children[index - 1];
                    edit = { offset: previous.offset + previous.length, length: 0, content: ',' + newProperty };
                }
                else if (parent.children.length === 0) {
                    edit = { offset: parent.offset + 1, length: 0, content: newProperty };
                }
                else {
                    edit = { offset: parent.offset + 1, length: 0, content: newProperty + ',' };
                }
                return withFormatting(text, edit, formattingOptions);
            }
        }
        else if (parent.type === 'array' && typeof lastSegment === 'number') {
            throw new Error('Array modification not supported yet');
        }
        else {
            throw new Error("Can not add " + (typeof lastSegment !== 'number' ? 'index' : 'property') + " to parent of type " + parent.type);
        }
        var _a;
    }
    exports.setProperty = setProperty;
    function withFormatting(text, edit, formattingOptions) {
        // apply the edit
        var newText = jsonFormatter_1.applyEdit(text, edit);
        // format the new text
        var begin = edit.offset;
        var end = edit.offset + edit.content.length;
        var edits = jsonFormatter_1.format(newText, { offset: begin, length: end - begin }, formattingOptions);
        // apply the formatting edits and track the begin and end offsets of the changes
        for (var i = edits.length - 1; i >= 0; i--) {
            var edit_1 = edits[i];
            newText = jsonFormatter_1.applyEdit(newText, edit_1);
            begin = Math.min(begin, edit_1.offset);
            end = Math.max(end, edit_1.offset + edit_1.length);
            end += edit_1.content.length - edit_1.length;
        }
        // create a single edit with all changes
        var editLength = text.length - (newText.length - end) - begin;
        return [{ offset: begin, length: editLength, content: newText.substring(begin, end) }];
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[46], __M([0,1,12,7,17,9,2,10]), function (require, exports, fs, path, json, objects, winjs_base_1, event_1) {
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

define(__m[73], __M([4,3]), function(nls, data) { return nls.create("vs/base/common/severity", data); });
define(__m[48], __M([0,1,73,19]), function (require, exports, nls, strings) {
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

define(__m[49], __M([4,3]), function(nls, data) { return nls.create("vs/base/node/zip", data); });
define(__m[50], __M([4,3]), function(nls, data) { return nls.create("vs/code/node/argv", data); });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[51], __M([0,1,20,83,50]), function (require, exports, os, minimist, nls_1) {
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

define(__m[54], __M([4,3]), function(nls, data) { return nls.create("vs/platform/configuration/common/configurationRegistry", data); });
define(__m[55], __M([4,3]), function(nls, data) { return nls.create("vs/platform/extensionManagement/common/extensionManagement", data); });
define(__m[56], __M([4,3]), function(nls, data) { return nls.create("vs/platform/extensionManagement/node/extensionManagementService", data); });
define(__m[57], __M([4,3]), function(nls, data) { return nls.create("vs/platform/extensions/common/extensionsRegistry", data); });
define(__m[58], __M([4,3]), function(nls, data) { return nls.create("vs/platform/extensions/node/extensionValidator", data); });
define(__m[59], __M([4,3]), function(nls, data) { return nls.create("vs/platform/telemetry/common/telemetryService", data); });





define(__m[60], __M([0,1,26]), function (require, exports, eventEmitter_1) {
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
        }
        return EventService;
    }(eventEmitter_1.EventEmitter));
    exports.EventService = EventService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[61], __M([0,1,34]), function (require, exports, ipc_1) {
    'use strict';
    var ExtensionManagementChannel = (function () {
        function ExtensionManagementChannel(service) {
            this.service = service;
        }
        ExtensionManagementChannel.prototype.call = function (command, arg) {
            switch (command) {
                case 'event:onInstallExtension': return ipc_1.eventToCall(this.service.onInstallExtension);
                case 'event:onDidInstallExtension': return ipc_1.eventToCall(this.service.onDidInstallExtension);
                case 'event:onUninstallExtension': return ipc_1.eventToCall(this.service.onUninstallExtension);
                case 'event:onDidUninstallExtension': return ipc_1.eventToCall(this.service.onDidUninstallExtension);
                case 'install': return this.service.install(arg);
                case 'uninstall': return this.service.uninstall(arg);
                case 'getInstalled': return this.service.getInstalled(arg);
            }
        };
        return ExtensionManagementChannel;
    }());
    exports.ExtensionManagementChannel = ExtensionManagementChannel;
    var ExtensionManagementChannelClient = (function () {
        function ExtensionManagementChannelClient(channel) {
            this.channel = channel;
            this._onInstallExtension = ipc_1.eventFromCall(this.channel, 'event:onInstallExtension');
            this._onDidInstallExtension = ipc_1.eventFromCall(this.channel, 'event:onDidInstallExtension');
            this._onUninstallExtension = ipc_1.eventFromCall(this.channel, 'event:onUninstallExtension');
            this._onDidUninstallExtension = ipc_1.eventFromCall(this.channel, 'event:onDidUninstallExtension');
        }
        Object.defineProperty(ExtensionManagementChannelClient.prototype, "onInstallExtension", {
            get: function () { return this._onInstallExtension; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtensionManagementChannelClient.prototype, "onDidInstallExtension", {
            get: function () { return this._onDidInstallExtension; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtensionManagementChannelClient.prototype, "onUninstallExtension", {
            get: function () { return this._onUninstallExtension; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtensionManagementChannelClient.prototype, "onDidUninstallExtension", {
            get: function () { return this._onDidUninstallExtension; },
            enumerable: true,
            configurable: true
        });
        ExtensionManagementChannelClient.prototype.install = function (arg) {
            return this.channel.call('install', arg);
        };
        ExtensionManagementChannelClient.prototype.uninstall = function (extension) {
            return this.channel.call('uninstall', extension);
        };
        ExtensionManagementChannelClient.prototype.getInstalled = function (includeDuplicateVersions) {
            return this.channel.call('getInstalled', includeDuplicateVersions);
        };
        return ExtensionManagementChannelClient;
    }());
    exports.ExtensionManagementChannelClient = ExtensionManagementChannelClient;
});






define(__m[28], __M([0,1,8]), function (require, exports, errors_1) {
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

define(__m[11], __M([0,1]), function (require, exports) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[30], __M([0,1,11]), function (require, exports, instantiation_1) {
    "use strict";
    exports.IConfigurationService = instantiation_1.createDecorator('configurationService');
    function getConfigurationValue(config, settingPath, defaultValue) {
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
        var result = accessSetting(config, path);
        return typeof result === 'undefined'
            ? defaultValue
            : result;
    }
    exports.getConfigurationValue = getConfigurationValue;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[21], __M([0,1,11]), function (require, exports, instantiation_1) {
    "use strict";
    exports.IEnvironmentService = instantiation_1.createDecorator('environmentService');
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
define(__m[66], __M([0,1,16,12,7,2,15,17,25,45,13,10,21]), function (require, exports, pfs_1, fs_1, path, winjs_base_1, async_1, json_1, jsonFormatter_1, jsonEdit_1, lifecycle_1, event_1, environment_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * Configuration service to be used in the node side.
     * TODO@Joao:
     * 	- defaults handling
     *  - async reading
     *
     * At some point, an async get() on the configuration service would be
     * much easier to implement and reason about. IConfigurationService2?
     */
    var NodeConfigurationService = (function () {
        function NodeConfigurationService(environmentService) {
            var _this = this;
            this._onDidUpdateConfiguration = new event_1.Emitter();
            this.cache = {};
            this.disposables = [];
            this.delayer = new async_1.Delayer(300);
            // TODO@joao cleanup!
            this.configurationPath = path.join(environmentService.userDataPath, 'User', 'settings.json');
            // TODO@joao sync?
            this.load();
            this.watcher = fs_1.watch(path.dirname(this.configurationPath));
            this.disposables.push(lifecycle_1.toDisposable(function () {
                _this.watcher.removeAllListeners();
                _this.watcher.close();
            }));
            this.watcher.on('change', function () { return _this.delayer.trigger(function () { return _this.load(); }); });
        }
        Object.defineProperty(NodeConfigurationService.prototype, "onDidUpdateConfiguration", {
            get: function () { return this._onDidUpdateConfiguration.event; },
            enumerable: true,
            configurable: true
        });
        NodeConfigurationService.prototype.getConfiguration = function (section) {
            return this._getConfiguration(section);
        };
        NodeConfigurationService.prototype.setUserConfiguration = function (key, value) {
            var _this = this;
            return pfs_1.readFile(this.configurationPath, 'utf8').then(function (content) {
                // todo: revisit when defaults are read as well
                var config = _this.getConfiguration('editor');
                var tabSize = typeof config.tabSize === 'number' ? config.tabSize : 4;
                var insertSpaces = typeof config.insertSpaces === 'boolean' ? config.insertSpaces : false;
                var path = typeof key === 'string' ? key.split('.') : key;
                var edits = jsonEdit_1.setProperty(content, path, value, { insertSpaces: insertSpaces, tabSize: tabSize, eol: '\n' });
                content = jsonFormatter_1.applyEdits(content, edits);
                return pfs_1.writeFile(_this.configurationPath, content, 'utf8');
            });
        };
        NodeConfigurationService.prototype.loadConfiguration = function (section) {
            return winjs_base_1.TPromise.wrapError(new Error('not implemented'));
        };
        NodeConfigurationService.prototype._getConfiguration = function (section) {
            if (section === void 0) { section = ''; }
            var value = this.cache;
            var parts = section
                .split('.')
                .filter(function (p) { return !!p; });
            while (parts.length && value) {
                var part = parts.shift();
                value = value[part];
            }
            return value;
        };
        NodeConfigurationService.prototype.load = function () {
            var content = '{}';
            try {
                // TODO@Joao: is sync really the way to go?
                content = fs_1.readFileSync(this.configurationPath, 'utf8');
            }
            catch (error) {
                content = '{}';
            }
            try {
                this.cache = json_1.parse(content) || {};
            }
            catch (error) {
            }
        };
        NodeConfigurationService.prototype.hasWorkspaceConfiguration = function () {
            return false;
        };
        NodeConfigurationService.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        NodeConfigurationService = __decorate([
            __param(0, environment_1.IEnvironmentService)
        ], NodeConfigurationService);
        return NodeConfigurationService;
    }());
    exports.NodeConfigurationService = NodeConfigurationService;
});

define(__m[67], __M([0,1,11]), function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IEventService = instantiation_1.createDecorator('eventService');
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[68], __M([0,1,55,11]), function (require, exports, nls, instantiation_1) {
    'use strict';
    exports.IExtensionManagementService = instantiation_1.createDecorator('extensionManagementService');
    exports.IExtensionGalleryService = instantiation_1.createDecorator('extensionGalleryService');
    (function (SortBy) {
        SortBy[SortBy["NoneOrRelevance"] = 0] = "NoneOrRelevance";
        SortBy[SortBy["LastUpdatedDate"] = 1] = "LastUpdatedDate";
        SortBy[SortBy["Title"] = 2] = "Title";
        SortBy[SortBy["PublisherName"] = 3] = "PublisherName";
        SortBy[SortBy["InstallCount"] = 4] = "InstallCount";
        SortBy[SortBy["PublishedDate"] = 5] = "PublishedDate";
        SortBy[SortBy["AverageRating"] = 6] = "AverageRating";
    })(exports.SortBy || (exports.SortBy = {}));
    var SortBy = exports.SortBy;
    (function (SortOrder) {
        SortOrder[SortOrder["Default"] = 0] = "Default";
        SortOrder[SortOrder["Ascending"] = 1] = "Ascending";
        SortOrder[SortOrder["Descending"] = 2] = "Descending";
    })(exports.SortOrder || (exports.SortOrder = {}));
    var SortOrder = exports.SortOrder;
    exports.IExtensionTipsService = instantiation_1.createDecorator('extensionTipsService');
    exports.ExtensionsLabel = nls.localize(0, null);
    exports.ExtensionsChannelId = 'extensions';
});

define(__m[32], __M([0,1,23]), function (require, exports, arrays_1) {
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

define(__m[70], __M([0,1,2,8,5,31,62,28,11,32]), function (require, exports, winjs_base_1, errors_1, types_1, assert, graph_1, descriptors_1, instantiation_1, serviceCollection_1) {
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
define(__m[22], __M([0,1,7,18]), function (require, exports, path, uri_1) {
    "use strict";
    var rootPath = path.dirname(uri_1.default.parse(require.toUrl('')).fsPath);
    var packageJsonPath = path.join(rootPath, 'package.json');
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = require.__$__nodeRequire(packageJsonPath);
});

define(__m[14], __M([0,1,5,31]), function (require, exports, Types, Assert) {
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

define(__m[35], __M([0,1,14,26]), function (require, exports, platform, eventEmitter_1) {
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
            this.eventEmitter = new eventEmitter_1.EventEmitter();
        }
        JSONContributionRegistry.prototype.addRegistryChangedListener = function (callback) {
            return this.eventEmitter.addListener2('registryChanged', callback);
        };
        JSONContributionRegistry.prototype.registerSchema = function (uri, unresolvedSchemaContent) {
            this.schemasById[normalizeId(uri)] = unresolvedSchemaContent;
            this.eventEmitter.emit('registryChanged', {});
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

define(__m[36], __M([0,1,57,8,29,48,35,14]), function (require, exports, nls, errors_1, paths, severity_1, jsonContributionRegistry_1, platform_1) {
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
                    enum: ['Languages', 'Snippets', 'Linters', 'Themes', 'Debuggers', 'Productivity', 'Other']
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
                    type: 'string',
                    defaultSnippets: [{ label: 'onLanguage', body: 'onLanguage:{{languageId}}' }, { label: 'onCommand', body: 'onCommand:{{commandId}}' }, { label: 'onDebug', body: 'onDebug:{{type}}' }, { label: 'workspaceContains', body: 'workspaceContains:{{fileName}}' }],
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
});

define(__m[75], __M([0,1,54,10,14,9,36,35]), function (require, exports, nls, event_1, platform, objects, extensionsRegistry_1, JSONContributionRegistry) {
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

define(__m[76], __M([0,1,58,36,77]), function (require, exports, nls, extensionsRegistry_1, semver_1) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[27], __M([0,1,7,18]), function (require, exports, path, uri_1) {
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
define(__m[79], __M([0,1,78,27,22,20,7,16,51,18,2]), function (require, exports, paths, product_1, package_1, os, path, pfs_1, argv_1, uri_1, winjs_base_1) {
    "use strict";
    var EnvironmentService = (function () {
        function EnvironmentService() {
            var argv = argv_1.parseArgs(process.argv);
            this._appRoot = path.dirname(uri_1.default.parse(require.toUrl('')).fsPath);
            this._userDataPath = paths.getUserDataPath(process.platform, package_1.default.name, process.argv);
            this._userHome = path.join(os.homedir(), product_1.default.dataFolderName);
            this._extensionsPath = argv.extensionHomePath || path.join(this._userHome, 'extensions');
            this._extensionsPath = path.normalize(this._extensionsPath);
            this._extensionDevelopmentPath = argv.extensionDevelopmentPath;
        }
        Object.defineProperty(EnvironmentService.prototype, "appRoot", {
            get: function () { return this._appRoot; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "userHome", {
            get: function () { return this._userHome; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "userDataPath", {
            get: function () { return this._userDataPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "extensionsPath", {
            get: function () { return this._extensionsPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "extensionDevelopmentPath", {
            get: function () { return this._extensionDevelopmentPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "isBuilt", {
            get: function () { return !process.env['VSCODE_DEV']; },
            enumerable: true,
            configurable: true
        });
        EnvironmentService.prototype.createPaths = function () {
            var promises = [this.userHome, this.extensionsPath]
                .map(function (p) { return pfs_1.mkdirp(p); });
            return winjs_base_1.TPromise.join(promises);
        };
        return EnvironmentService;
    }());
    exports.EnvironmentService = EnvironmentService;
});

define(__m[80], __M([0,1,2,37,11]), function (require, exports, winjs_base_1, timer_1, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.ITelemetryService = instantiation_1.createDecorator('telemetryService');
    exports.NullTelemetryService = {
        _serviceBrand: undefined,
        timedPublicLog: function (name, data) {
            return timer_1.nullEvent;
        },
        publicLog: function (eventName, data) {
            return winjs_base_1.TPromise.as(null);
        },
        isOptedIn: true,
        getTelemetryInfo: function () {
            return winjs_base_1.TPromise.as({
                instanceId: 'someValue.instanceId',
                sessionId: 'someValue.sessionId',
                machineId: 'someValue.machineId'
            });
        }
    };
    function combinedAppender() {
        var appenders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            appenders[_i - 0] = arguments[_i];
        }
        return { log: function (e, d) { return appenders.forEach(function (a) { return a.log(e, d); }); } };
    }
    exports.combinedAppender = combinedAppender;
    exports.NullAppender = { log: function () { return null; } };
    // --- util
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[81], __M([0,1,2]), function (require, exports, winjs_base_1) {
    'use strict';
    var TelemetryAppenderChannel = (function () {
        function TelemetryAppenderChannel(appender) {
            this.appender = appender;
        }
        TelemetryAppenderChannel.prototype.call = function (command, _a) {
            var eventName = _a.eventName, data = _a.data;
            this.appender.log(eventName, data);
            return winjs_base_1.TPromise.as(null);
        };
        return TelemetryAppenderChannel;
    }());
    exports.TelemetryAppenderChannel = TelemetryAppenderChannel;
    var TelemetryAppenderClient = (function () {
        function TelemetryAppenderClient(channel) {
            this.channel = channel;
        }
        TelemetryAppenderClient.prototype.log = function (eventName, data) {
            return this.channel.call('log', { eventName: eventName, data: data });
        };
        TelemetryAppenderClient.prototype.dispose = function () {
            // TODO
        };
        return TelemetryAppenderClient;
    }());
    exports.TelemetryAppenderClient = TelemetryAppenderClient;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[53], __M([0,1,59,19,11,30,75,2,13,37,9,14]), function (require, exports, nls_1, strings_1, instantiation_1, configuration_1, configurationRegistry_1, winjs_base_1, lifecycle_1, timer_1, objects_1, platform_1) {
    'use strict';
    var TelemetryService = (function () {
        function TelemetryService(config, _configurationService) {
            var _this = this;
            this._configurationService = _configurationService;
            this._disposables = [];
            this._cleanupPatterns = [];
            this._appender = config.appender;
            this._commonProperties = config.commonProperties || winjs_base_1.TPromise.as({});
            this._piiPaths = config.piiPaths || [];
            this._userOptIn = typeof config.userOptIn === 'undefined' ? true : config.userOptIn;
            // static cleanup patterns for:
            // #1 `file:///DANGEROUS/PATH/resources/app/Useful/Information`
            // #2 // Any other file path that doesn't match the approved form above should be cleaned.
            // #3 "Error: ENOENT; no such file or directory" is often followed with PII, clean it
            for (var _i = 0, _a = this._piiPaths; _i < _a.length; _i++) {
                var piiPath = _a[_i];
                this._cleanupPatterns.push([new RegExp(strings_1.escapeRegExpCharacters(piiPath), 'gi'), '']);
            }
            this._cleanupPatterns.push([/file:\/\/\/.*?\/resources\/app\//gi, ''], [/file:\/\/\/.*/gi, ''], [/ENOENT: no such file or directory.*?\'([^\']+)\'/gi, 'ENOENT: no such file or directory']);
            this._timeKeeper = new timer_1.TimeKeeper();
            this._disposables.push(this._timeKeeper);
            this._disposables.push(this._timeKeeper.addListener(function (events) { return _this._onTelemetryTimerEventStop(events); }));
            if (this._configurationService) {
                this._updateUserOptIn();
                this._configurationService.onDidUpdateConfiguration(this._updateUserOptIn, this, this._disposables);
                this.publicLog('optInStatus', { optIn: this._userOptIn });
            }
        }
        TelemetryService.prototype._updateUserOptIn = function () {
            var config = this._configurationService.getConfiguration(TELEMETRY_SECTION_ID);
            this._userOptIn = config ? config.enableTelemetry : this._userOptIn;
        };
        TelemetryService.prototype._onTelemetryTimerEventStop = function (events) {
            for (var i = 0; i < events.length; i++) {
                var event_1 = events[i];
                var data = event_1.data || {};
                data.duration = event_1.timeTaken();
                this.publicLog(event_1.name, data);
            }
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
        TelemetryService.prototype.timedPublicLog = function (name, data) {
            var topic = 'public';
            var event = this._timeKeeper.start(topic, name);
            if (data) {
                event.data = data;
            }
            return event;
        };
        TelemetryService.prototype.publicLog = function (eventName, data) {
            var _this = this;
            // don't send events when the user is optout unless the event is the opt{in|out} signal
            if (!this._userOptIn && eventName !== 'optInStatus') {
                return winjs_base_1.TPromise.as(undefined);
            }
            return this._commonProperties.then(function (values) {
                // (first) add common properties
                data = objects_1.mixin(data, values);
                // (last) remove all PII from data
                data = objects_1.cloneAndChange(data, function (value) {
                    if (typeof value === 'string') {
                        return _this._cleanupInfo(value);
                    }
                });
                _this._appender.log(eventName, data);
            }, function (err) {
                // unsure what to do now...
                console.error(err);
            });
        };
        TelemetryService.prototype._cleanupInfo = function (stack) {
            // sanitize with configured cleanup patterns
            for (var _i = 0, _a = this._cleanupPatterns; _i < _a.length; _i++) {
                var tuple = _a[_i];
                var regexp = tuple[0], replaceValue = tuple[1];
                stack = stack.replace(regexp, replaceValue);
            }
            return stack;
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
                'default': true
            }
        }
    });
});

define(__m[41], __M([0,1,84,5,9,2]), function (require, exports, appInsights, types_1, objects_1, winjs_base_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
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
    var AppInsightsAppender = (function () {
        function AppInsightsAppender(_eventPrefix, _defaultData, aiKeyOrClientFactory // allow factory function for testing
            ) {
            this._eventPrefix = _eventPrefix;
            this._defaultData = _defaultData;
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
            var _a = AppInsightsAppender._getData(data), properties = _a.properties, measurements = _a.measurements;
            this._aiClient.trackEvent(this._eventPrefix + '/' + eventName, properties, measurements);
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
        };
        return AppInsightsAppender;
    }());
    exports.AppInsightsAppender = AppInsightsAppender;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[74], __M([0,1,6,20,2,33]), function (require, exports, Platform, os, winjs_base_1, uuid) {
    "use strict";
    function resolveCommonProperties(commit, version) {
        var result = Object.create(null);
        result['sessionID'] = uuid.generateUuid() + Date.now();
        result['commitHash'] = commit;
        result['version'] = version;
        result['common.osVersion'] = os.release();
        result['common.platform'] = Platform.Platform[Platform.platform];
        // dynamic properties which value differs on each call
        var seq = 0;
        var startTime = Date.now();
        Object.defineProperties(result, {
            'timestamp': {
                get: function () { return new Date(); },
                enumerable: true
            },
            'common.timesincesessionstart': {
                get: function () { return Date.now() - startTime; },
                enumerable: true
            },
            'common.sequence': {
                get: function () { return seq++; },
                enumerable: true
            }
        });
        return winjs_base_1.TPromise.as(result);
    }
    exports.resolveCommonProperties = resolveCommonProperties;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[44], __M([0,1,49,7,12,15,16,2,87]), function (require, exports, nls, path, fs_1, async_1, pfs_1, winjs_base_1, yauzl_1) {
    "use strict";
    function modeFromEntry(entry) {
        var attr = entry.externalFileAttributes >> 16 || 33188;
        return [448 /* S_IRWXU */, 56 /* S_IRWXG */, 7 /* S_IRWXO */]
            .map(function (mask) { return attr & mask; })
            .reduce(function (a, b) { return a + b; }, attr & 61440 /* S_IFMT */);
    }
    function extractEntry(stream, fileName, mode, targetPath, options) {
        var dirName = path.dirname(fileName);
        var targetDirName = path.join(targetPath, dirName);
        var targetFileName = path.join(targetPath, fileName);
        return pfs_1.mkdirp(targetDirName).then(function () { return new winjs_base_1.Promise(function (c, e) {
            var istream = fs_1.createWriteStream(targetFileName, { mode: mode });
            istream.once('finish', function () { return c(null); });
            istream.once('error', e);
            stream.once('error', e);
            stream.pipe(istream);
        }); });
    }
    function extractZip(zipfile, targetPath, options) {
        return new winjs_base_1.Promise(function (c, e) {
            var throttler = new async_1.SimpleThrottler();
            var last = winjs_base_1.TPromise.as(null);
            zipfile.once('error', e);
            zipfile.once('close', function () { return last.then(c, e); });
            zipfile.on('entry', function (entry) {
                if (!options.sourcePathRegex.test(entry.fileName)) {
                    return;
                }
                var fileName = entry.fileName.replace(options.sourcePathRegex, '');
                // directory file names end with '/'
                if (/\/$/.test(fileName)) {
                    var targetFileName = path.join(targetPath, fileName);
                    last = pfs_1.mkdirp(targetFileName);
                    return;
                }
                var stream = async_1.ninvoke(zipfile, zipfile.openReadStream, entry);
                var mode = modeFromEntry(entry);
                last = throttler.queue(function () { return stream.then(function (stream) { return extractEntry(stream, fileName, mode, targetPath, options); }); });
            });
        });
    }
    function extract(zipPath, targetPath, options) {
        if (options === void 0) { options = {}; }
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
define(__m[43], __M([0,1,2,5,89,90,39,12,9,91]), function (require, exports, winjs_base_1, types_1, https, http, url_1, fs_1, objects_1, zlib_1) {
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









define(__m[65], __M([0,1,56,20,7,5,16,9,13,23,44,2,43,38,21,15,10,46,77,24,76,22]), function (require, exports, nls, os_1, path, types, pfs, objects_1, lifecycle_1, arrays_1, zip_1, winjs_base_1, request_1, proxy_1, environment_1, async_1, event_1, userSettings_1, semver, collections_1, extensionValidator_1, package_1) {
    'use strict';
    function parseManifest(raw) {
        return new winjs_base_1.Promise(function (c, e) {
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
    function validate(zipPath, extension, version) {
        return zip_1.buffer(zipPath, 'extension/package.json')
            .then(function (buffer) { return parseManifest(buffer.toString('utf8')); })
            .then(function (_a) {
            var manifest = _a.manifest;
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
    function getExtensionId(extension, version) {
        return extension.publisher + "." + extension.name + "-" + version;
    }
    var ExtensionManagementService = (function () {
        function ExtensionManagementService(environmentService) {
            this.environmentService = environmentService;
            this._onInstallExtension = new event_1.Emitter();
            this.onInstallExtension = this._onInstallExtension.event;
            this._onDidInstallExtension = new event_1.Emitter();
            this.onDidInstallExtension = this._onDidInstallExtension.event;
            this._onUninstallExtension = new event_1.Emitter();
            this.onUninstallExtension = this._onUninstallExtension.event;
            this._onDidUninstallExtension = new event_1.Emitter();
            this.onDidUninstallExtension = this._onDidUninstallExtension.event;
            this.extensionsPath = environmentService.extensionsPath;
            this.obsoletePath = path.join(this.extensionsPath, '.obsolete');
            this.obsoleteFileLimiter = new async_1.Limiter(1);
        }
        ExtensionManagementService.prototype.install = function (arg) {
            var _this = this;
            var id;
            var result;
            if (types.isString(arg)) {
                var zipPath_1 = arg;
                result = validate(zipPath_1).then(function (manifest) {
                    id = getExtensionId(manifest, manifest.version);
                    _this._onInstallExtension.fire({ id: id });
                    return _this.installValidExtension(zipPath_1, id);
                });
            }
            else {
                var extension_1 = arg;
                id = getExtensionId(extension_1, extension_1.versions[0].version);
                this._onInstallExtension.fire({ id: id, gallery: extension_1 });
                result = this.isObsolete(id).then(function (obsolete) {
                    if (obsolete) {
                        return winjs_base_1.TPromise.wrapError(new Error(nls.localize(4, null, extension_1.displayName || extension_1.name)));
                    }
                    return _this.installFromGallery(arg);
                });
            }
            return result.then(function (local) { return _this._onDidInstallExtension.fire({ id: id, local: local }); }, function (error) { _this._onDidInstallExtension.fire({ id: id, error: error }); return winjs_base_1.TPromise.wrapError(error); });
        };
        ExtensionManagementService.prototype.installFromGallery = function (extension) {
            var _this = this;
            return this.getLastValidExtensionVersion(extension).then(function (versionInfo) {
                var version = versionInfo.version;
                var url = versionInfo.downloadUrl;
                var headers = versionInfo.downloadHeaders;
                var zipPath = path.join(os_1.tmpdir(), extension.id);
                var id = getExtensionId(extension, version);
                var metadata = {
                    id: extension.id,
                    publisherId: extension.publisherId,
                    publisherDisplayName: extension.publisherDisplayName
                };
                return _this.request(url)
                    .then(function (opts) { return objects_1.assign(opts, { headers: headers }); })
                    .then(function (opts) { return request_1.download(zipPath, opts); })
                    .then(function () { return validate(zipPath, extension, version); })
                    .then(function () { return _this.installValidExtension(zipPath, id, metadata); });
            });
        };
        ExtensionManagementService.prototype.getLastValidExtensionVersion = function (extension) {
            return this._getLastValidExtensionVersion(extension, extension.versions);
        };
        ExtensionManagementService.prototype._getLastValidExtensionVersion = function (extension, versions) {
            var _this = this;
            if (!versions.length) {
                return winjs_base_1.TPromise.wrapError(new Error(nls.localize(5, null, extension.displayName || extension.name)));
            }
            var headers = { 'accept-encoding': 'gzip' };
            var version = versions[0];
            return this.request(version.manifestUrl)
                .then(function (opts) { return objects_1.assign(opts, { headers: headers }); })
                .then(function (opts) { return request_1.json(opts); })
                .then(function (manifest) {
                var desc = {
                    isBuiltin: false,
                    engines: { vscode: manifest.engines.vscode },
                    main: manifest.main
                };
                if (!extensionValidator_1.isValidExtensionVersion(package_1.default.version, desc, [])) {
                    return _this._getLastValidExtensionVersion(extension, versions.slice(1));
                }
                return version;
            });
        };
        ExtensionManagementService.prototype.installValidExtension = function (zipPath, id, metadata) {
            if (metadata === void 0) { metadata = null; }
            var extensionPath = path.join(this.extensionsPath, id);
            var manifestPath = path.join(extensionPath, 'package.json');
            return zip_1.extract(zipPath, extensionPath, { sourcePath: 'extension', overwrite: true })
                .then(function () { return pfs.readFile(manifestPath, 'utf8'); })
                .then(function (raw) { return parseManifest(raw); })
                .then(function (_a) {
                var manifest = _a.manifest;
                return pfs.readdir(extensionPath).then(function (children) {
                    var readme = children.filter(function (child) { return /^readme(\.txt|\.md|)$/i.test(child); })[0];
                    var readmeUrl = readme ? "file://" + extensionPath + "/" + readme : null;
                    var local = { id: id, manifest: manifest, metadata: metadata, path: extensionPath, readmeUrl: readmeUrl };
                    var rawManifest = objects_1.assign(manifest, { __metadata: metadata });
                    return pfs.writeFile(manifestPath, JSON.stringify(rawManifest, null, '\t'))
                        .then(function () { return local; });
                });
            });
        };
        ExtensionManagementService.prototype.uninstall = function (extension) {
            var _this = this;
            var id = extension.id;
            var extensionPath = path.join(this.extensionsPath, id);
            return pfs.exists(extensionPath)
                .then(function (exists) { return exists ? null : winjs_base_1.Promise.wrapError(new Error(nls.localize(6, null))); })
                .then(function () { return _this._onUninstallExtension.fire(id); })
                .then(function () { return _this.setObsolete(id); })
                .then(function () { return pfs.rimraf(extensionPath); })
                .then(function () { return _this.unsetObsolete(id); })
                .then(function () { return _this._onDidUninstallExtension.fire(id); });
        };
        ExtensionManagementService.prototype.getInstalled = function (includeDuplicateVersions) {
            if (includeDuplicateVersions === void 0) { includeDuplicateVersions = false; }
            var all = this.getAllInstalled();
            if (includeDuplicateVersions) {
                return all;
            }
            return all.then(function (extensions) {
                var byId = collections_1.values(collections_1.groupBy(extensions, function (p) { return (p.manifest.publisher + "." + p.manifest.name); }));
                return byId.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.manifest.version, b.manifest.version); })[0]; });
            });
        };
        ExtensionManagementService.prototype.getAllInstalled = function () {
            var _this = this;
            var limiter = new async_1.Limiter(10);
            return this.getObsoleteExtensions()
                .then(function (obsolete) {
                return pfs.readdir(_this.extensionsPath)
                    .then(function (extensions) { return extensions.filter(function (id) { return !obsolete[id]; }); })
                    .then(function (extensionIds) { return winjs_base_1.Promise.join(extensionIds.map(function (id) {
                    var extensionPath = path.join(_this.extensionsPath, id);
                    var each = function () { return pfs.readdir(extensionPath).then(function (children) {
                        var readme = children.filter(function (child) { return /^readme(\.txt|\.md|)$/i.test(child); })[0];
                        var readmeUrl = readme ? "file://" + extensionPath + "/" + readme : null;
                        return pfs.readFile(path.join(extensionPath, 'package.json'), 'utf8')
                            .then(function (raw) { return parseManifest(raw); })
                            .then(function (_a) {
                            var manifest = _a.manifest, metadata = _a.metadata;
                            return ({ id: id, manifest: manifest, metadata: metadata, path: extensionPath, readmeUrl: readmeUrl });
                        });
                    }).then(null, function () { return null; }); };
                    return limiter.queue(each);
                })); })
                    .then(function (result) { return result.filter(function (a) { return !!a; }); });
            });
        };
        ExtensionManagementService.prototype.removeDeprecatedExtensions = function () {
            var _this = this;
            var outdated = this.getOutdatedExtensionIds()
                .then(function (extensions) { return extensions.map(function (e) { return getExtensionId(e.manifest, e.manifest.version); }); });
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
        ExtensionManagementService.prototype.getOutdatedExtensionIds = function () {
            return this.getAllInstalled()
                .then(function (extensions) { return collections_1.values(collections_1.groupBy(extensions, function (p) { return (p.manifest.publisher + "." + p.manifest.name); })); })
                .then(function (versions) { return arrays_1.flatten(versions.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.manifest.version, b.manifest.version); }).slice(1); })); });
        };
        ExtensionManagementService.prototype.isObsolete = function (id) {
            return this.withObsoleteExtensions(function (obsolete) { return !!obsolete[id]; });
        };
        ExtensionManagementService.prototype.setObsolete = function (id) {
            return this.withObsoleteExtensions(function (obsolete) { return objects_1.assign(obsolete, (_a = {}, _a[id] = true, _a)); var _a; });
        };
        ExtensionManagementService.prototype.unsetObsolete = function (id) {
            return this.withObsoleteExtensions(function (obsolete) { return delete obsolete[id]; });
        };
        ExtensionManagementService.prototype.getObsoleteExtensions = function () {
            return this.withObsoleteExtensions(function (obsolete) { return obsolete; });
        };
        ExtensionManagementService.prototype.withObsoleteExtensions = function (fn) {
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
        ExtensionManagementService.prototype.request = function (url) {
            var settings = winjs_base_1.TPromise.join([
                // TODO@Joao we need a nice configuration service here!
                userSettings_1.UserSettings.getValue(this.environmentService.userDataPath, 'http.proxy'),
                userSettings_1.UserSettings.getValue(this.environmentService.userDataPath, 'http.proxyStrictSSL')
            ]);
            return settings.then(function (settings) {
                var proxyUrl = settings[0];
                var strictSSL = settings[1];
                var agent = proxy_1.getProxyAgent(url, { proxyUrl: proxyUrl, strictSSL: strictSSL });
                return { url: url, agent: agent, strictSSL: strictSSL };
            });
        };
        ExtensionManagementService.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        ExtensionManagementService = __decorate([
            __param(0, environment_1.IEnvironmentService)
        ], ExtensionManagementService);
        return ExtensionManagementService;
    }());
    exports.ExtensionManagementService = ExtensionManagementService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[93], __M([0,1,12,6,27,22,40,2,32,28,70,21,79,67,60,61,68,65,30,66,80,74,81,53,41]), function (require, exports, fs, platform, product_1, package_1, ipc_net_1, winjs_base_1, serviceCollection_1, descriptors_1, instantiationService_1, environment_1, environmentService_1, event_1, eventService_1, extensionManagementIpc_1, extensionManagement_1, extensionManagementService_1, configuration_1, nodeConfigurationService_1, telemetry_1, commonProperties_1, telemetryIpc_1, telemetryService_1, appInsightsAppender_1) {
    "use strict";
    function quit(err) {
        if (err) {
            console.error(err.stack || err);
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
    var eventPrefix = 'monacoworkbench';
    function main(server) {
        var services = new serviceCollection_1.ServiceCollection();
        services.set(event_1.IEventService, new descriptors_1.SyncDescriptor(eventService_1.EventService));
        services.set(environment_1.IEnvironmentService, new descriptors_1.SyncDescriptor(environmentService_1.EnvironmentService));
        services.set(extensionManagement_1.IExtensionManagementService, new descriptors_1.SyncDescriptor(extensionManagementService_1.ExtensionManagementService));
        services.set(configuration_1.IConfigurationService, new descriptors_1.SyncDescriptor(nodeConfigurationService_1.NodeConfigurationService));
        var instantiationService = new instantiationService_1.InstantiationService(services);
        instantiationService.invokeFunction(function (accessor) {
            var appenders = [];
            if (product_1.default.aiConfig && product_1.default.aiConfig.key) {
                appenders.push(new appInsightsAppender_1.AppInsightsAppender(eventPrefix, null, product_1.default.aiConfig.key));
            }
            if (product_1.default.aiConfig && product_1.default.aiConfig.asimovKey) {
                appenders.push(new appInsightsAppender_1.AppInsightsAppender(eventPrefix, null, product_1.default.aiConfig.asimovKey));
            }
            // It is important to dispose the AI adapter properly because
            // only then they flush remaining data.
            process.once('exit', function () { return appenders.forEach(function (a) { return a.dispose(); }); });
            var appender = telemetry_1.combinedAppender.apply(void 0, appenders);
            server.registerChannel('telemetryAppender', new telemetryIpc_1.TelemetryAppenderChannel(appender));
            var services = new serviceCollection_1.ServiceCollection();
            var _a = accessor.get(environment_1.IEnvironmentService), appRoot = _a.appRoot, extensionsPath = _a.extensionsPath, extensionDevelopmentPath = _a.extensionDevelopmentPath, isBuilt = _a.isBuilt;
            if (isBuilt && !extensionDevelopmentPath && product_1.default.enableTelemetry) {
                var config = {
                    appender: appender,
                    commonProperties: commonProperties_1.resolveCommonProperties(product_1.default.commit, package_1.default.version),
                    piiPaths: [appRoot, extensionsPath]
                };
                services.set(telemetry_1.ITelemetryService, new descriptors_1.SyncDescriptor(telemetryService_1.TelemetryService, config));
            }
            else {
                services.set(telemetry_1.ITelemetryService, telemetry_1.NullTelemetryService);
            }
            var instantiationService2 = instantiationService.createChild(services);
            instantiationService2.invokeFunction(function (accessor) {
                var extensionManagementService = accessor.get(extensionManagement_1.IExtensionManagementService);
                var channel = new extensionManagementIpc_1.ExtensionManagementChannel(extensionManagementService);
                server.registerChannel('extensions', channel);
                // eventually clean up old extensions
                setTimeout(function () { return extensionManagementService.removeDeprecatedExtensions(); }, 5000);
            });
        });
    }
    function setupIPC(hook) {
        function setup(retry) {
            return ipc_net_1.serve(hook).then(null, function (err) {
                if (!retry || platform.isWindows || err.code !== 'EADDRINUSE') {
                    return winjs_base_1.TPromise.wrapError(err);
                }
                // should retry, not windows and eaddrinuse
                return ipc_net_1.connect(hook).then(function (client) {
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
        .then(function (r) { return main(r[0]); })
        .then(function () { return setupPlanB(process.env['VSCODE_PID']); })
        .done(null, quit);
});

}).call(this);
//# sourceMappingURL=sharedProcessMain.js.map
