/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["require","exports","vs/workbench/api/node/extHost.protocol","vs/base/common/winjs.base","vs/base/common/errors","vs/workbench/api/node/extHostTypes","vs/base/common/event","vs/nls!vs/workbench/node/extensionHostProcess","vs/base/common/paths","vs/nls","vs/base/common/uri","vs/workbench/api/node/extHostTypeConverters","vs/base/common/types","vs/base/common/severity","vs/base/common/platform","vs/base/common/strings","vs/platform/extensions/common/extensionsRegistry","vs/base/common/lifecycle","vs/base/common/objects","vs/platform/instantiation/common/instantiation","vs/base/common/async","vs/base/node/pfs","vs/base/parts/ipc/common/ipc","vs/base/common/glob","vs/base/common/cancellation","vs/editor/common/modes/languageSelector","vs/platform/platform","vs/base/common/marshalling","vs/base/common/map","fs","vs/base/common/arrays","vs/base/node/flow","vs/workbench/node/extensionHostMain","vs/base/common/eventEmitter","vs/base/node/extfs","vs/workbench/api/node/extHost.api.impl","vs/base/common/collections","path","vs/editor/common/model/wordHelper","vs/base/parts/ipc/node/ipc.net","vs/workbench/api/node/extHostWorkspace","vs/editor/common/modes/languageFeatureRegistry","vs/editor/common/modes","vs/nls!vs/base/common/json","vs/base/common/json","vs/nls!vs/base/common/severity","vs/base/common/idGenerator","vs/editor/common/viewModel/prefixSumComputer","vs/editor/common/editorCommon","vs/nls!vs/platform/extensions/common/abstractExtensionService","vs/nls!vs/platform/extensions/common/extensionsRegistry","vs/nls!vs/platform/extensions/node/extensionValidator","vs/nls!vs/workbench/node/extensionHostMain","vs/nls!vs/workbench/node/extensionPoints","vs/platform/extensionManagement/common/extensionManagementIpc","vs/platform/extensions/common/ipcRemoteCom","vs/editor/common/model/mirrorModel2","vs/platform/editor/common/editor","vs/nls!vs/base/common/errors","vs/platform/jsonschemas/common/jsonContributionRegistry","vs/nls!vs/editor/common/editorCommon","vs/platform/extensions/common/abstractExtensionService","vs/platform/extensions/node/extensionValidator","semver","vs/platform/statusbar/common/statusbar","vs/platform/workspace/common/baseWorkspaceContextService","vs/base/common/assert","vs/base/common/uuid","vs/workbench/api/node/extHostApiCommands","vs/workbench/node/extensionPoints","vs/workbench/services/thread/common/abstractThreadService","vs/workbench/services/thread/common/extHostThreadService","vs/workbench/services/thread/common/threadService","vs/base/common/callbackList","vs/workbench/api/node/extHostCommands","vs/workbench/api/node/extHostConfiguration","vs/workbench/api/node/extHostDiagnostics","vs/workbench/api/node/extHostDocuments","vs/workbench/api/node/extHostEditors","vs/workbench/api/node/extHostFileSystemEventService","vs/workbench/api/node/extHostLanguageFeatures","vs/workbench/api/node/extHostLanguages","vs/workbench/api/node/extHostMessageService","vs/workbench/api/node/extHostOutputService","vs/workbench/api/node/extHostQuickOpen","vs/workbench/api/node/extHostStatusBar","vs/workbench/api/node/extHostStorage","vs/workbench/api/node/extHostExtensionService","vs/workbench/api/node/extHostTelemetry","net","vs/base/common/winjs.base.raw","assert","crypto","vs/workbench/node/extensionHostProcess"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[30], __M([0,1]), function (require, exports) {
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

define(__m[66], __M([0,1]), function (require, exports) {
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

define(__m[36], __M([0,1]), function (require, exports) {
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

define(__m[46], __M([0,1]), function (require, exports) {
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
        IdGenerator.prototype.nextId = function () {
            return this._prefix + (++this._lastId);
        };
        return IdGenerator;
    }());
    exports.IdGenerator = IdGenerator;
    exports.defaultGenerator = new IdGenerator('id#');
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
define(__m[28], __M([0,1]), function (require, exports) {
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

define(__m[14], __M([0,1]), function (require, exports) {
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

define(__m[8], __M([0,1,14]), function (require, exports, platform_1) {
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

define(__m[15], __M([0,1,28]), function (require, exports, map_1) {
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

define(__m[23], __M([0,1,15,8,28]), function (require, exports, strings, paths, map_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var PATH_REGEX = '[/\\\\]'; // any slash or backslash
    var NO_PATH_REGEX = '[^/\\\\]'; // any non-slash and non-backslash
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
    // regexes to check for trival glob patterns that just check for String#endsWith
    var T1 = /^\*\*\/\*\.[\w\.-]+$/; // **/*.something
    var T2 = /^\*\*\/[\w\.-]+$/; // **/something
    var T3 = /^{\*\*\/\*\.[\w\.-]+(,\*\*\/\*\.[\w\.-]+)*}$/; // {**/*.something,**/*.else}
    var Trivia;
    (function (Trivia) {
        Trivia[Trivia["T1"] = 0] = "T1";
        Trivia[Trivia["T2"] = 1] = "T2";
        Trivia[Trivia["T3"] = 2] = "T3"; // {**/*.something,**/*.else}
    })(Trivia || (Trivia = {}));
    var CACHE = new map_1.LinkedMap(10000); // bounded to 10000 elements
    function parsePattern(pattern) {
        if (!pattern) {
            return null;
        }
        // Whitespace trimming
        pattern = pattern.trim();
        // Check cache
        var parsedPattern = CACHE.get(pattern);
        if (parsedPattern) {
            if (parsedPattern.regexp) {
                parsedPattern.regexp.lastIndex = 0; // reset RegExp to its initial state to reuse it!
            }
            return parsedPattern;
        }
        parsedPattern = Object.create(null);
        // Check for Trivias
        if (T1.test(pattern)) {
            parsedPattern.trivia = Trivia.T1;
        }
        else if (T2.test(pattern)) {
            parsedPattern.trivia = Trivia.T2;
        }
        else if (T3.test(pattern)) {
            parsedPattern.trivia = Trivia.T3;
        }
        else {
            parsedPattern.regexp = toRegExp("^" + parseRegExp(pattern) + "$");
        }
        // Cache
        CACHE.set(pattern, parsedPattern);
        return parsedPattern;
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
            var parsedPattern = parsePattern(arg1);
            if (!parsedPattern) {
                return false;
            }
            // common pattern: **/*.txt just need endsWith check
            if (parsedPattern.trivia === Trivia.T1) {
                return strings.endsWith(path, arg1.substr(4)); // '**/*'.length === 4
            }
            // common pattern: **/some.txt just need basename check
            if (parsedPattern.trivia === Trivia.T2) {
                var base = arg1.substr(3); // '**/'.length === 3
                return path === base || strings.endsWith(path, "/" + base) || strings.endsWith(path, "\\" + base);
            }
            // repetition of common patterns (see above) {**/*.txt,**/*.png}
            if (parsedPattern.trivia === Trivia.T3) {
                return arg1.slice(1, -1).split(',').some(function (pattern) { return match(pattern, path); });
            }
            return parsedPattern.regexp.test(path);
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

define(__m[12], __M([0,1]), function (require, exports) {
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






define(__m[17], __M([0,1,12]), function (require, exports, types_1) {
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

define(__m[18], __M([0,1,12]), function (require, exports, Types) {
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

define(__m[10], __M([0,1,14]), function (require, exports, platform) {
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

define(__m[27], __M([0,1,10]), function (require, exports, uri_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function stringify(obj) {
        return JSON.stringify(obj, replacer);
    }
    exports.stringify = stringify;
    function parse(text) {
        return JSON.parse(text, reviver);
    }
    exports.parse = parse;
    function replacer(key, value) {
        // URI is done via toJSON-member
        if (value instanceof RegExp) {
            return {
                $mid: 2,
                source: value.source,
                flags: (value.global ? 'g' : '') + (value.ignoreCase ? 'i' : '') + (value.multiline ? 'm' : ''),
            };
        }
        return value;
    }
    function reviver(key, value) {
        var marshallingConst;
        if (value !== void 0 && value !== null) {
            marshallingConst = value.$mid;
        }
        if (marshallingConst === 1) {
            return uri_1.default.revive(value);
        }
        else if (marshallingConst === 2) {
            return new RegExp(value.source, value.flags);
        }
        else {
            return value;
        }
    }
});






define(__m[67], __M([0,1]), function (require, exports) {
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
define(__m[31], __M([0,1,91]), function (require, exports, assert) {
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
define(__m[34], __M([0,1,67,15,14,31,29,37]), function (require, exports, uuid, strings, platform, flow, fs, paths) {
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

define(__m[38], __M([0,1]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.USUAL_WORD_SEPARATORS = '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?';
    /**
     * Create a word definition regular expression based on default word separators.
     * Optionally provide allowed separators that should be included in words.
     *
     * The default would look like this:
     * /(-?\d*\.\d\w*)|([^\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g
     */
    function createWordRegExp(allowInWords) {
        if (allowInWords === void 0) { allowInWords = ''; }
        var usualSeparators = exports.USUAL_WORD_SEPARATORS;
        var source = '(-?\\d*\\.\\d\\w*)|([^';
        for (var i = 0; i < usualSeparators.length; i++) {
            if (allowInWords.indexOf(usualSeparators[i]) >= 0) {
                continue;
            }
            source += '\\' + usualSeparators[i];
        }
        source += '\\s]+)';
        return new RegExp(source, 'g');
    }
    exports.createWordRegExp = createWordRegExp;
    // catches numbers (including floating numbers) in the first group, and alphanum in the second
    exports.DEFAULT_WORD_REGEXP = createWordRegExp();
    function ensureValidWordDefinition(wordDefinition) {
        var result = exports.DEFAULT_WORD_REGEXP;
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
    }
    exports.ensureValidWordDefinition = ensureValidWordDefinition;
    function getWordAtText(column, wordDefinition, text, textOffset) {
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
    }
    exports.getWordAtText = getWordAtText;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[25], __M([0,1,23]), function (require, exports, glob_1) {
    'use strict';
    function matches(selection, uri, language) {
        return score(selection, uri, language) > 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = matches;
    function score(selector, uri, language) {
        if (Array.isArray(selector)) {
            // for each
            var values = selector.map(function (item) { return score(item, uri, language); });
            return Math.max.apply(Math, values);
        }
        else if (typeof selector === 'string') {
            // compare language id
            if (selector === language) {
                return 10;
            }
            else if (selector === '*') {
                return 5;
            }
            else {
                return 0;
            }
        }
        else if (selector) {
            // all must match but only highest score counts
            var filter = selector;
            var valueLanguage = 0;
            var valueScheme = 0;
            var valuePattern = 0;
            // language id
            if (filter.language) {
                if (filter.language === language) {
                    valueLanguage = 10;
                }
                else if (filter.language === '*') {
                    valueLanguage = 5;
                }
                else {
                    return 0;
                }
            }
            // scheme
            if (filter.scheme) {
                if (filter.scheme === uri.scheme) {
                    valueScheme = 10;
                }
                else {
                    return 0;
                }
            }
            // match fsPath with pattern
            if (filter.pattern) {
                if (filter.pattern === uri.fsPath) {
                    valuePattern = 10;
                }
                else if (glob_1.match(filter.pattern, uri.fsPath)) {
                    valuePattern = 5;
                }
                else {
                    return 0;
                }
            }
            return Math.max(valueLanguage, valueScheme, valuePattern);
        }
    }
    exports.score = score;
});

define(__m[47], __M([0,1]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var PrefixSumIndexOfResult = (function () {
        function PrefixSumIndexOfResult(index, remainder) {
            this.index = index;
            this.remainder = remainder;
        }
        return PrefixSumIndexOfResult;
    }());
    exports.PrefixSumIndexOfResult = PrefixSumIndexOfResult;
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
            insertIndex = Math.floor(insertIndex); //@perf
            value = Math.floor(value); //@perf
            this.values.splice(insertIndex, 0, value);
            this.prefixSum.splice(insertIndex, 0, 0);
            if (insertIndex - 1 < this.prefixSumValidIndex) {
                this.prefixSumValidIndex = insertIndex - 1;
            }
        };
        PrefixSumComputer.prototype.insertValues = function (insertIndex, values) {
            insertIndex = Math.floor(insertIndex); //@perf
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
            count = Math.floor(count); //@perf
            var r = [];
            for (var i = 0; i < count; i++) {
                r[i] = 0;
            }
            return r;
        };
        PrefixSumComputer.prototype.changeValue = function (index, value) {
            index = Math.floor(index); //@perf
            value = Math.floor(value); //@perf
            if (this.values[index] === value) {
                return;
            }
            this.values[index] = value;
            if (index - 1 < this.prefixSumValidIndex) {
                this.prefixSumValidIndex = index - 1;
            }
        };
        PrefixSumComputer.prototype.removeValues = function (startIndex, cnt) {
            startIndex = Math.floor(startIndex); //@perf
            cnt = Math.floor(cnt); //@perf
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
            index = Math.floor(index); //@perf
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
        PrefixSumComputer.prototype.getIndexOf = function (accumulatedValue) {
            accumulatedValue = Math.floor(accumulatedValue); //@perf
            var low = 0;
            var high = this.values.length - 1;
            var mid;
            var midStop;
            var midStart;
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
            return new PrefixSumIndexOfResult(mid, accumulatedValue - midStart);
        };
        return PrefixSumComputer;
    }());
    exports.PrefixSumComputer = PrefixSumComputer;
});

define(__m[56], __M([0,1,47]), function (require, exports, prefixSumComputer_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var MirrorModel2 = (function () {
        function MirrorModel2(uri, lines, eol, versionId) {
            this._uri = uri;
            this._lines = lines;
            this._eol = eol;
            this._versionId = versionId;
        }
        MirrorModel2.prototype.dispose = function () {
            this._lines.length = 0;
        };
        Object.defineProperty(MirrorModel2.prototype, "version", {
            get: function () {
                return this._versionId;
            },
            enumerable: true,
            configurable: true
        });
        MirrorModel2.prototype.getText = function () {
            return this._lines.join(this._eol);
        };
        MirrorModel2.prototype.onEvents = function (events) {
            var newEOL = null;
            for (var i = 0, len = events.length; i < len; i++) {
                var e = events[i];
                if (e.eol) {
                    newEOL = e.eol;
                }
            }
            if (newEOL && newEOL !== this._eol) {
                this._eol = newEOL;
                this._lineStarts = null;
            }
            // Update my lines
            var lastVersionId = -1;
            for (var i = 0, len = events.length; i < len; i++) {
                var e = events[i];
                this._acceptDeleteRange(e.range);
                this._acceptInsertText({
                    lineNumber: e.range.startLineNumber,
                    column: e.range.startColumn
                }, e.text);
                lastVersionId = Math.max(lastVersionId, e.versionId);
            }
            if (lastVersionId !== -1) {
                this._versionId = lastVersionId;
            }
        };
        MirrorModel2.prototype._ensureLineStarts = function () {
            if (!this._lineStarts) {
                var lineStartValues = [];
                var eolLength = this._eol.length;
                for (var i = 0, len = this._lines.length; i < len; i++) {
                    lineStartValues.push(this._lines[i].length + eolLength);
                }
                this._lineStarts = new prefixSumComputer_1.PrefixSumComputer(lineStartValues);
            }
        };
        /**
         * All changes to a line's text go through this method
         */
        MirrorModel2.prototype._setLineText = function (lineIndex, newValue) {
            this._lines[lineIndex] = newValue;
            if (this._lineStarts) {
                // update prefix sum
                this._lineStarts.changeValue(lineIndex, this._lines[lineIndex].length + this._eol.length);
            }
        };
        MirrorModel2.prototype._acceptDeleteRange = function (range) {
            if (range.startLineNumber === range.endLineNumber) {
                if (range.startColumn === range.endColumn) {
                    // Nothing to delete
                    return;
                }
                // Delete text on the affected line
                this._setLineText(range.startLineNumber - 1, this._lines[range.startLineNumber - 1].substring(0, range.startColumn - 1)
                    + this._lines[range.startLineNumber - 1].substring(range.endColumn - 1));
                return;
            }
            // Take remaining text on last line and append it to remaining text on first line
            this._setLineText(range.startLineNumber - 1, this._lines[range.startLineNumber - 1].substring(0, range.startColumn - 1)
                + this._lines[range.endLineNumber - 1].substring(range.endColumn - 1));
            // Delete middle lines
            this._lines.splice(range.startLineNumber, range.endLineNumber - range.startLineNumber);
            if (this._lineStarts) {
                // update prefix sum
                this._lineStarts.removeValues(range.startLineNumber, range.endLineNumber - range.startLineNumber);
            }
        };
        MirrorModel2.prototype._acceptInsertText = function (position, insertText) {
            if (insertText.length === 0) {
                // Nothing to insert
                return;
            }
            var insertLines = insertText.split(/\r\n|\r|\n/);
            if (insertLines.length === 1) {
                // Inserting text on one line
                this._setLineText(position.lineNumber - 1, this._lines[position.lineNumber - 1].substring(0, position.column - 1)
                    + insertLines[0]
                    + this._lines[position.lineNumber - 1].substring(position.column - 1));
                return;
            }
            // Append overflowing text from first line to the end of text to insert
            insertLines[insertLines.length - 1] += this._lines[position.lineNumber - 1].substring(position.column - 1);
            // Delete overflowing text from first line and insert text on first line
            this._setLineText(position.lineNumber - 1, this._lines[position.lineNumber - 1].substring(0, position.column - 1)
                + insertLines[0]);
            // Insert new lines & store lengths
            var newLengths = new Array(insertLines.length - 1);
            for (var i = 1; i < insertLines.length; i++) {
                this._lines.splice(position.lineNumber + i - 1, 0, insertLines[i]);
                newLengths[i - 1] = insertLines[i].length + this._eol.length;
            }
            if (this._lineStarts) {
                // update prefix sum
                this._lineStarts.insertValues(position.lineNumber, newLengths);
            }
        };
        return MirrorModel2;
    }());
    exports.MirrorModel2 = MirrorModel2;
});

define(__m[58], __M([9,7]), function(nls, data) { return nls.create("vs/base/common/errors", data); });
define(__m[4], __M([0,1,58,18,14,12,30,15]), function (require, exports, nls, objects, platform, types, arrays, strings) {
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

define(__m[73], __M([0,1,4]), function (require, exports, errors_1) {
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

define(__m[6], __M([0,1,73]), function (require, exports, callbackList_1) {
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
define(__m[24], __M([0,1,6]), function (require, exports, event_1) {
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






define(__m[33], __M([0,1,4]), function (require, exports, Errors) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

define(__m[3], __M([90,4]), function (winjs, __Errors__) {
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





define(__m[20], __M([0,1,4,14,3,24,17]), function (require, exports, errors, platform, winjs_base_1, cancellation_1, lifecycle_1) {
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
define(__m[21], __M([0,1,3,34,8,37,20,29]), function (require, exports, winjs_base_1, extfs, paths, path_1, async_1, fs) {
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
define(__m[22], __M([0,1,3,17,6]), function (require, exports, winjs_base_1, lifecycle_1, event_1) {
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
define(__m[39], __M([0,1,89,3,6,22]), function (require, exports, net_1, winjs_base_1, event_1, ipc_1) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[41], __M([0,1,6,25]), function (require, exports, event_1, languageSelector_1) {
    'use strict';
    var LanguageFeatureRegistry = (function () {
        function LanguageFeatureRegistry() {
            this._clock = 0;
            this._entries = [];
            this._onDidChange = new event_1.Emitter();
        }
        Object.defineProperty(LanguageFeatureRegistry.prototype, "onDidChange", {
            get: function () {
                return this._onDidChange.event;
            },
            enumerable: true,
            configurable: true
        });
        LanguageFeatureRegistry.prototype.register = function (selector, provider, isBuiltin) {
            var _this = this;
            if (isBuiltin === void 0) { isBuiltin = false; }
            var entry = {
                selector: selector,
                provider: provider,
                isBuiltin: isBuiltin,
                _score: -1,
                _time: this._clock++
            };
            this._entries.push(entry);
            this._lastCandidate = undefined;
            this._onDidChange.fire(this._entries.length);
            return {
                dispose: function () {
                    if (entry) {
                        var idx = _this._entries.indexOf(entry);
                        if (idx >= 0) {
                            _this._entries.splice(idx, 1);
                            _this._lastCandidate = undefined;
                            _this._onDidChange.fire(_this._entries.length);
                            entry = undefined;
                        }
                    }
                }
            };
        };
        LanguageFeatureRegistry.prototype.has = function (model) {
            return this.all(model).length > 0;
        };
        LanguageFeatureRegistry.prototype.all = function (model) {
            if (!model || model.isTooLargeForHavingAMode()) {
                return [];
            }
            this._updateScores(model);
            var result = [];
            // from registry
            for (var _i = 0, _a = this._entries; _i < _a.length; _i++) {
                var entry = _a[_i];
                if (entry._score > 0) {
                    result.push(entry.provider);
                }
            }
            return result;
        };
        LanguageFeatureRegistry.prototype.ordered = function (model) {
            var result = [];
            this._orderedForEach(model, function (entry) { return result.push(entry.provider); });
            return result;
        };
        LanguageFeatureRegistry.prototype.orderedGroups = function (model) {
            var result = [];
            var lastBucket;
            var lastBucketScore;
            this._orderedForEach(model, function (entry) {
                if (lastBucket && lastBucketScore === entry._score) {
                    lastBucket.push(entry.provider);
                }
                else {
                    lastBucketScore = entry._score;
                    lastBucket = [entry.provider];
                    result.push(lastBucket);
                }
            });
            return result;
        };
        LanguageFeatureRegistry.prototype._orderedForEach = function (model, callback) {
            if (!model || model.isTooLargeForHavingAMode()) {
                return;
            }
            this._updateScores(model);
            for (var from = 0; from < this._entries.length; from++) {
                var entry = this._entries[from];
                if (entry._score > 0) {
                    callback(entry);
                }
            }
        };
        LanguageFeatureRegistry.prototype._updateScores = function (model) {
            var candidate = {
                uri: model.uri.toString(),
                language: model.getModeId()
            };
            if (this._lastCandidate
                && this._lastCandidate.language === candidate.language
                && this._lastCandidate.uri === candidate.uri) {
                // nothing has changed
                return;
            }
            this._lastCandidate = candidate;
            for (var _i = 0, _a = this._entries; _i < _a.length; _i++) {
                var entry = _a[_i];
                entry._score = languageSelector_1.score(entry.selector, model.uri, model.getModeId());
                if (entry.isBuiltin && entry._score > 0) {
                    entry._score = .5;
                    entry._time = -1;
                }
            }
            // needs sorting
            this._entries.sort(LanguageFeatureRegistry._compareByScoreAndTime);
        };
        LanguageFeatureRegistry._compareByScoreAndTime = function (a, b) {
            if (a._score < b._score) {
                return 1;
            }
            else if (a._score > b._score) {
                return -1;
            }
            else if (a._time < b._time) {
                return 1;
            }
            else if (a._time > b._time) {
                return -1;
            }
            else {
                return 0;
            }
        };
        return LanguageFeatureRegistry;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LanguageFeatureRegistry;
});

define(__m[42], __M([0,1,41]), function (require, exports, languageFeatureRegistry_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * A document highlight kind.
     */
    (function (DocumentHighlightKind) {
        /**
         * A textual occurrence.
         */
        DocumentHighlightKind[DocumentHighlightKind["Text"] = 0] = "Text";
        /**
         * Read-access of a symbol, like reading a variable.
         */
        DocumentHighlightKind[DocumentHighlightKind["Read"] = 1] = "Read";
        /**
         * Write-access of a symbol, like writing to a variable.
         */
        DocumentHighlightKind[DocumentHighlightKind["Write"] = 2] = "Write";
    })(exports.DocumentHighlightKind || (exports.DocumentHighlightKind = {}));
    var DocumentHighlightKind = exports.DocumentHighlightKind;
    /**
     * A symbol kind.
     */
    (function (SymbolKind) {
        SymbolKind[SymbolKind["File"] = 0] = "File";
        SymbolKind[SymbolKind["Module"] = 1] = "Module";
        SymbolKind[SymbolKind["Namespace"] = 2] = "Namespace";
        SymbolKind[SymbolKind["Package"] = 3] = "Package";
        SymbolKind[SymbolKind["Class"] = 4] = "Class";
        SymbolKind[SymbolKind["Method"] = 5] = "Method";
        SymbolKind[SymbolKind["Property"] = 6] = "Property";
        SymbolKind[SymbolKind["Field"] = 7] = "Field";
        SymbolKind[SymbolKind["Constructor"] = 8] = "Constructor";
        SymbolKind[SymbolKind["Enum"] = 9] = "Enum";
        SymbolKind[SymbolKind["Interface"] = 10] = "Interface";
        SymbolKind[SymbolKind["Function"] = 11] = "Function";
        SymbolKind[SymbolKind["Variable"] = 12] = "Variable";
        SymbolKind[SymbolKind["Constant"] = 13] = "Constant";
        SymbolKind[SymbolKind["String"] = 14] = "String";
        SymbolKind[SymbolKind["Number"] = 15] = "Number";
        SymbolKind[SymbolKind["Boolean"] = 16] = "Boolean";
        SymbolKind[SymbolKind["Array"] = 17] = "Array";
        SymbolKind[SymbolKind["Object"] = 18] = "Object";
        SymbolKind[SymbolKind["Key"] = 19] = "Key";
        SymbolKind[SymbolKind["Null"] = 20] = "Null";
    })(exports.SymbolKind || (exports.SymbolKind = {}));
    var SymbolKind = exports.SymbolKind;
    /**
     * @internal
     */
    var SymbolKind;
    (function (SymbolKind) {
        /**
         * @internal
         */
        function from(kind) {
            switch (kind) {
                case SymbolKind.Method:
                    return 'method';
                case SymbolKind.Function:
                    return 'function';
                case SymbolKind.Constructor:
                    return 'constructor';
                case SymbolKind.Variable:
                    return 'variable';
                case SymbolKind.Class:
                    return 'class';
                case SymbolKind.Interface:
                    return 'interface';
                case SymbolKind.Namespace:
                    return 'namespace';
                case SymbolKind.Package:
                    return 'package';
                case SymbolKind.Module:
                    return 'module';
                case SymbolKind.Property:
                    return 'property';
                case SymbolKind.Enum:
                    return 'enum';
                case SymbolKind.String:
                    return 'string';
                case SymbolKind.File:
                    return 'file';
                case SymbolKind.Array:
                    return 'array';
                case SymbolKind.Number:
                    return 'number';
                case SymbolKind.Boolean:
                    return 'boolean';
                case SymbolKind.Object:
                    return 'object';
                case SymbolKind.Key:
                    return 'key';
                case SymbolKind.Null:
                    return 'null';
            }
            return 'property';
        }
        SymbolKind.from = from;
        /**
         * @internal
         */
        function to(type) {
            switch (type) {
                case 'method':
                    return SymbolKind.Method;
                case 'function':
                    return SymbolKind.Function;
                case 'constructor':
                    return SymbolKind.Constructor;
                case 'variable':
                    return SymbolKind.Variable;
                case 'class':
                    return SymbolKind.Class;
                case 'interface':
                    return SymbolKind.Interface;
                case 'namespace':
                    return SymbolKind.Namespace;
                case 'package':
                    return SymbolKind.Package;
                case 'module':
                    return SymbolKind.Module;
                case 'property':
                    return SymbolKind.Property;
                case 'enum':
                    return SymbolKind.Enum;
                case 'string':
                    return SymbolKind.String;
                case 'file':
                    return SymbolKind.File;
                case 'array':
                    return SymbolKind.Array;
                case 'number':
                    return SymbolKind.Number;
                case 'boolean':
                    return SymbolKind.Boolean;
                case 'object':
                    return SymbolKind.Object;
                case 'key':
                    return SymbolKind.Key;
                case 'null':
                    return SymbolKind.Null;
            }
            return SymbolKind.Property;
        }
        SymbolKind.to = to;
    })(SymbolKind = exports.SymbolKind || (exports.SymbolKind = {}));
    /**
     * Describes what to do with the indentation when pressing Enter.
     */
    (function (IndentAction) {
        /**
         * Insert new line and copy the previous line's indentation.
         */
        IndentAction[IndentAction["None"] = 0] = "None";
        /**
         * Insert new line and indent once (relative to the previous line's indentation).
         */
        IndentAction[IndentAction["Indent"] = 1] = "Indent";
        /**
         * Insert two new lines:
         *  - the first one indented which will hold the cursor
         *  - the second one at the same indentation level
         */
        IndentAction[IndentAction["IndentOutdent"] = 2] = "IndentOutdent";
        /**
         * Insert new line and outdent once (relative to the previous line's indentation).
         */
        IndentAction[IndentAction["Outdent"] = 3] = "Outdent";
    })(exports.IndentAction || (exports.IndentAction = {}));
    var IndentAction = exports.IndentAction;
    // --- feature registries ------
    /**
     * @internal
     */
    exports.ReferenceProviderRegistry = new languageFeatureRegistry_1.default();
    /**
     * @internal
     */
    exports.RenameProviderRegistry = new languageFeatureRegistry_1.default();
    /**
     * @internal
     */
    exports.SuggestRegistry = new languageFeatureRegistry_1.default();
    /**
     * @internal
     */
    exports.SignatureHelpProviderRegistry = new languageFeatureRegistry_1.default();
    /**
     * @internal
     */
    exports.HoverProviderRegistry = new languageFeatureRegistry_1.default();
    /**
     * @internal
     */
    exports.DocumentSymbolProviderRegistry = new languageFeatureRegistry_1.default();
    /**
     * @internal
     */
    exports.DocumentHighlightProviderRegistry = new languageFeatureRegistry_1.default();
    /**
     * @internal
     */
    exports.DefinitionProviderRegistry = new languageFeatureRegistry_1.default();
    /**
     * @internal
     */
    exports.CodeLensProviderRegistry = new languageFeatureRegistry_1.default();
    /**
     * @internal
     */
    exports.CodeActionProviderRegistry = new languageFeatureRegistry_1.default();
    /**
     * @internal
     */
    exports.DocumentFormattingEditProviderRegistry = new languageFeatureRegistry_1.default();
    /**
     * @internal
     */
    exports.DocumentRangeFormattingEditProviderRegistry = new languageFeatureRegistry_1.default();
    /**
     * @internal
     */
    exports.OnTypeFormattingEditProviderRegistry = new languageFeatureRegistry_1.default();
    /**
     * @internal
     */
    exports.LinkProviderRegistry = new languageFeatureRegistry_1.default();
});

define(__m[43], __M([9,7]), function(nls, data) { return nls.create("vs/base/common/json", data); });
define(__m[44], __M([0,1,43]), function (require, exports, nls_1) {
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

define(__m[45], __M([9,7]), function(nls, data) { return nls.create("vs/base/common/severity", data); });
define(__m[13], __M([0,1,45,15]), function (require, exports, nls, strings) {
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

define(__m[60], __M([9,7]), function(nls, data) { return nls.create("vs/editor/common/editorCommon", data); });





define(__m[48], __M([0,1,60,12]), function (require, exports, nls, types) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * Describes how to indent wrapped lines.
     */
    (function (WrappingIndent) {
        /**
         * No indentation => wrapped lines begin at column 1.
         */
        WrappingIndent[WrappingIndent["None"] = 0] = "None";
        /**
         * Same => wrapped lines get the same indentation as the parent.
         */
        WrappingIndent[WrappingIndent["Same"] = 1] = "Same";
        /**
         * Indent => wrapped lines get +1 indentation as the parent.
         */
        WrappingIndent[WrappingIndent["Indent"] = 2] = "Indent";
    })(exports.WrappingIndent || (exports.WrappingIndent = {}));
    var WrappingIndent = exports.WrappingIndent;
    var InternalEditorScrollbarOptions = (function () {
        /**
         * @internal
         */
        function InternalEditorScrollbarOptions(source) {
            this.arrowSize = source.arrowSize | 0;
            this.vertical = source.vertical | 0;
            this.horizontal = source.horizontal | 0;
            this.useShadows = Boolean(source.useShadows);
            this.verticalHasArrows = Boolean(source.verticalHasArrows);
            this.horizontalHasArrows = Boolean(source.horizontalHasArrows);
            this.handleMouseWheel = Boolean(source.handleMouseWheel);
            this.horizontalScrollbarSize = source.horizontalScrollbarSize | 0;
            this.horizontalSliderSize = source.horizontalSliderSize | 0;
            this.verticalScrollbarSize = source.verticalScrollbarSize | 0;
            this.verticalSliderSize = source.verticalSliderSize | 0;
            this.mouseWheelScrollSensitivity = Number(source.mouseWheelScrollSensitivity);
        }
        /**
         * @internal
         */
        InternalEditorScrollbarOptions.prototype.equals = function (other) {
            return (this.arrowSize === other.arrowSize
                && this.vertical === other.vertical
                && this.horizontal === other.horizontal
                && this.useShadows === other.useShadows
                && this.verticalHasArrows === other.verticalHasArrows
                && this.horizontalHasArrows === other.horizontalHasArrows
                && this.handleMouseWheel === other.handleMouseWheel
                && this.horizontalScrollbarSize === other.horizontalScrollbarSize
                && this.horizontalSliderSize === other.horizontalSliderSize
                && this.verticalScrollbarSize === other.verticalScrollbarSize
                && this.verticalSliderSize === other.verticalSliderSize
                && this.mouseWheelScrollSensitivity === other.mouseWheelScrollSensitivity);
        };
        /**
         * @internal
         */
        InternalEditorScrollbarOptions.prototype.clone = function () {
            return new InternalEditorScrollbarOptions(this);
        };
        return InternalEditorScrollbarOptions;
    }());
    exports.InternalEditorScrollbarOptions = InternalEditorScrollbarOptions;
    var EditorWrappingInfo = (function () {
        /**
         * @internal
         */
        function EditorWrappingInfo(source) {
            this.isViewportWrapping = Boolean(source.isViewportWrapping);
            this.wrappingColumn = source.wrappingColumn | 0;
            this.wrappingIndent = source.wrappingIndent | 0;
            this.wordWrapBreakBeforeCharacters = String(source.wordWrapBreakBeforeCharacters);
            this.wordWrapBreakAfterCharacters = String(source.wordWrapBreakAfterCharacters);
            this.wordWrapBreakObtrusiveCharacters = String(source.wordWrapBreakObtrusiveCharacters);
        }
        /**
         * @internal
         */
        EditorWrappingInfo.prototype.equals = function (other) {
            return (this.isViewportWrapping === other.isViewportWrapping
                && this.wrappingColumn === other.wrappingColumn
                && this.wrappingIndent === other.wrappingIndent
                && this.wordWrapBreakBeforeCharacters === other.wordWrapBreakBeforeCharacters
                && this.wordWrapBreakAfterCharacters === other.wordWrapBreakAfterCharacters
                && this.wordWrapBreakObtrusiveCharacters === other.wordWrapBreakObtrusiveCharacters);
        };
        /**
         * @internal
         */
        EditorWrappingInfo.prototype.clone = function () {
            return new EditorWrappingInfo(this);
        };
        return EditorWrappingInfo;
    }());
    exports.EditorWrappingInfo = EditorWrappingInfo;
    var InternalEditorViewOptions = (function () {
        /**
         * @internal
         */
        function InternalEditorViewOptions(source) {
            this.theme = String(source.theme);
            this.canUseTranslate3d = Boolean(source.canUseTranslate3d);
            this.experimentalScreenReader = Boolean(source.experimentalScreenReader);
            this.rulers = InternalEditorViewOptions._toSortedIntegerArray(source.rulers);
            this.ariaLabel = String(source.ariaLabel);
            this.lineNumbers = source.lineNumbers;
            this.selectOnLineNumbers = Boolean(source.selectOnLineNumbers);
            this.glyphMargin = Boolean(source.glyphMargin);
            this.revealHorizontalRightPadding = source.revealHorizontalRightPadding | 0;
            this.roundedSelection = Boolean(source.roundedSelection);
            this.overviewRulerLanes = source.overviewRulerLanes | 0;
            this.cursorBlinking = source.cursorBlinking | 0;
            this.mouseWheelZoom = Boolean(source.mouseWheelZoom);
            this.cursorStyle = source.cursorStyle | 0;
            this.hideCursorInOverviewRuler = Boolean(source.hideCursorInOverviewRuler);
            this.scrollBeyondLastLine = Boolean(source.scrollBeyondLastLine);
            this.editorClassName = String(source.editorClassName);
            this.stopRenderingLineAfter = source.stopRenderingLineAfter | 0;
            this.renderWhitespace = Boolean(source.renderWhitespace);
            this.renderControlCharacters = Boolean(source.renderControlCharacters);
            this.renderIndentGuides = Boolean(source.renderIndentGuides);
            this.scrollbar = source.scrollbar.clone();
        }
        InternalEditorViewOptions._toSortedIntegerArray = function (source) {
            if (!Array.isArray(source)) {
                return [];
            }
            var arrSource = source;
            var result = arrSource.map(function (el) {
                var r = parseInt(el, 10);
                if (isNaN(r)) {
                    return 0;
                }
                return r;
            });
            result.sort();
            return result;
        };
        InternalEditorViewOptions._numberArraysEqual = function (a, b) {
            if (a.length !== b.length) {
                return false;
            }
            for (var i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) {
                    return false;
                }
            }
            return true;
        };
        /**
         * @internal
         */
        InternalEditorViewOptions.prototype.equals = function (other) {
            return (this.theme === other.theme
                && this.canUseTranslate3d === other.canUseTranslate3d
                && this.experimentalScreenReader === other.experimentalScreenReader
                && InternalEditorViewOptions._numberArraysEqual(this.rulers, other.rulers)
                && this.ariaLabel === other.ariaLabel
                && this.lineNumbers === other.lineNumbers
                && this.selectOnLineNumbers === other.selectOnLineNumbers
                && this.glyphMargin === other.glyphMargin
                && this.revealHorizontalRightPadding === other.revealHorizontalRightPadding
                && this.roundedSelection === other.roundedSelection
                && this.overviewRulerLanes === other.overviewRulerLanes
                && this.cursorBlinking === other.cursorBlinking
                && this.mouseWheelZoom === other.mouseWheelZoom
                && this.cursorStyle === other.cursorStyle
                && this.hideCursorInOverviewRuler === other.hideCursorInOverviewRuler
                && this.scrollBeyondLastLine === other.scrollBeyondLastLine
                && this.editorClassName === other.editorClassName
                && this.stopRenderingLineAfter === other.stopRenderingLineAfter
                && this.renderWhitespace === other.renderWhitespace
                && this.renderControlCharacters === other.renderControlCharacters
                && this.renderIndentGuides === other.renderIndentGuides
                && this.scrollbar.equals(other.scrollbar));
        };
        /**
         * @internal
         */
        InternalEditorViewOptions.prototype.createChangeEvent = function (newOpts) {
            return {
                theme: this.theme !== newOpts.theme,
                canUseTranslate3d: this.canUseTranslate3d !== newOpts.canUseTranslate3d,
                experimentalScreenReader: this.experimentalScreenReader !== newOpts.experimentalScreenReader,
                rulers: (!InternalEditorViewOptions._numberArraysEqual(this.rulers, newOpts.rulers)),
                ariaLabel: this.ariaLabel !== newOpts.ariaLabel,
                lineNumbers: this.lineNumbers !== newOpts.lineNumbers,
                selectOnLineNumbers: this.selectOnLineNumbers !== newOpts.selectOnLineNumbers,
                glyphMargin: this.glyphMargin !== newOpts.glyphMargin,
                revealHorizontalRightPadding: this.revealHorizontalRightPadding !== newOpts.revealHorizontalRightPadding,
                roundedSelection: this.roundedSelection !== newOpts.roundedSelection,
                overviewRulerLanes: this.overviewRulerLanes !== newOpts.overviewRulerLanes,
                cursorBlinking: this.cursorBlinking !== newOpts.cursorBlinking,
                mouseWheelZoom: this.mouseWheelZoom !== newOpts.mouseWheelZoom,
                cursorStyle: this.cursorStyle !== newOpts.cursorStyle,
                hideCursorInOverviewRuler: this.hideCursorInOverviewRuler !== newOpts.hideCursorInOverviewRuler,
                scrollBeyondLastLine: this.scrollBeyondLastLine !== newOpts.scrollBeyondLastLine,
                editorClassName: this.editorClassName !== newOpts.editorClassName,
                stopRenderingLineAfter: this.stopRenderingLineAfter !== newOpts.stopRenderingLineAfter,
                renderWhitespace: this.renderWhitespace !== newOpts.renderWhitespace,
                renderControlCharacters: this.renderControlCharacters !== newOpts.renderControlCharacters,
                renderIndentGuides: this.renderIndentGuides !== newOpts.renderIndentGuides,
                scrollbar: (!this.scrollbar.equals(newOpts.scrollbar)),
            };
        };
        /**
         * @internal
         */
        InternalEditorViewOptions.prototype.clone = function () {
            return new InternalEditorViewOptions(this);
        };
        return InternalEditorViewOptions;
    }());
    exports.InternalEditorViewOptions = InternalEditorViewOptions;
    var EditorContribOptions = (function () {
        /**
         * @internal
         */
        function EditorContribOptions(source) {
            this.selectionClipboard = Boolean(source.selectionClipboard);
            this.hover = Boolean(source.hover);
            this.contextmenu = Boolean(source.contextmenu);
            this.quickSuggestions = Boolean(source.quickSuggestions);
            this.quickSuggestionsDelay = source.quickSuggestionsDelay || 0;
            this.parameterHints = Boolean(source.parameterHints);
            this.iconsInSuggestions = Boolean(source.iconsInSuggestions);
            this.formatOnType = Boolean(source.formatOnType);
            this.suggestOnTriggerCharacters = Boolean(source.suggestOnTriggerCharacters);
            this.acceptSuggestionOnEnter = Boolean(source.acceptSuggestionOnEnter);
            this.snippetSuggestions = source.snippetSuggestions;
            this.tabCompletion = source.tabCompletion;
            this.wordBasedSuggestions = source.wordBasedSuggestions;
            this.selectionHighlight = Boolean(source.selectionHighlight);
            this.referenceInfos = Boolean(source.referenceInfos);
            this.folding = Boolean(source.folding);
        }
        /**
         * @internal
         */
        EditorContribOptions.prototype.equals = function (other) {
            return (this.selectionClipboard === other.selectionClipboard
                && this.hover === other.hover
                && this.contextmenu === other.contextmenu
                && this.quickSuggestions === other.quickSuggestions
                && this.quickSuggestionsDelay === other.quickSuggestionsDelay
                && this.parameterHints === other.parameterHints
                && this.iconsInSuggestions === other.iconsInSuggestions
                && this.formatOnType === other.formatOnType
                && this.suggestOnTriggerCharacters === other.suggestOnTriggerCharacters
                && this.acceptSuggestionOnEnter === other.acceptSuggestionOnEnter
                && this.snippetSuggestions === other.snippetSuggestions
                && this.tabCompletion === other.tabCompletion
                && this.wordBasedSuggestions === other.wordBasedSuggestions
                && this.selectionHighlight === other.selectionHighlight
                && this.referenceInfos === other.referenceInfos
                && this.folding === other.folding);
        };
        /**
         * @internal
         */
        EditorContribOptions.prototype.clone = function () {
            return new EditorContribOptions(this);
        };
        return EditorContribOptions;
    }());
    exports.EditorContribOptions = EditorContribOptions;
    /**
     * Internal configuration options (transformed or computed) for the editor.
     */
    var InternalEditorOptions = (function () {
        /**
         * @internal
         */
        function InternalEditorOptions(source) {
            this.lineHeight = source.lineHeight | 0;
            this.readOnly = Boolean(source.readOnly);
            this.wordSeparators = String(source.wordSeparators);
            this.autoClosingBrackets = Boolean(source.autoClosingBrackets);
            this.useTabStops = Boolean(source.useTabStops);
            this.tabFocusMode = Boolean(source.tabFocusMode);
            this.layoutInfo = source.layoutInfo.clone();
            this.fontInfo = source.fontInfo.clone();
            this.viewInfo = source.viewInfo.clone();
            this.wrappingInfo = source.wrappingInfo.clone();
            this.contribInfo = source.contribInfo.clone();
        }
        /**
         * @internal
         */
        InternalEditorOptions.prototype.equals = function (other) {
            return (this.lineHeight === other.lineHeight
                && this.readOnly === other.readOnly
                && this.wordSeparators === other.wordSeparators
                && this.autoClosingBrackets === other.autoClosingBrackets
                && this.useTabStops === other.useTabStops
                && this.tabFocusMode === other.tabFocusMode
                && this.layoutInfo.equals(other.layoutInfo)
                && this.fontInfo.equals(other.fontInfo)
                && this.viewInfo.equals(other.viewInfo)
                && this.wrappingInfo.equals(other.wrappingInfo)
                && this.contribInfo.equals(other.contribInfo));
        };
        /**
         * @internal
         */
        InternalEditorOptions.prototype.createChangeEvent = function (newOpts) {
            return {
                lineHeight: (this.lineHeight !== newOpts.lineHeight),
                readOnly: (this.readOnly !== newOpts.readOnly),
                wordSeparators: (this.wordSeparators !== newOpts.wordSeparators),
                autoClosingBrackets: (this.autoClosingBrackets !== newOpts.autoClosingBrackets),
                useTabStops: (this.useTabStops !== newOpts.useTabStops),
                tabFocusMode: (this.tabFocusMode !== newOpts.tabFocusMode),
                layoutInfo: (!this.layoutInfo.equals(newOpts.layoutInfo)),
                fontInfo: (!this.fontInfo.equals(newOpts.fontInfo)),
                viewInfo: this.viewInfo.createChangeEvent(newOpts.viewInfo),
                wrappingInfo: (!this.wrappingInfo.equals(newOpts.wrappingInfo)),
                contribInfo: (!this.contribInfo.equals(newOpts.contribInfo)),
            };
        };
        /**
         * @internal
         */
        InternalEditorOptions.prototype.clone = function () {
            return new InternalEditorOptions(this);
        };
        return InternalEditorOptions;
    }());
    exports.InternalEditorOptions = InternalEditorOptions;
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
    /**
     * Describes the behaviour of decorations when typing/editing near their edges.
     */
    (function (TrackedRangeStickiness) {
        TrackedRangeStickiness[TrackedRangeStickiness["AlwaysGrowsWhenTypingAtEdges"] = 0] = "AlwaysGrowsWhenTypingAtEdges";
        TrackedRangeStickiness[TrackedRangeStickiness["NeverGrowsWhenTypingAtEdges"] = 1] = "NeverGrowsWhenTypingAtEdges";
        TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingBefore"] = 2] = "GrowsOnlyWhenTypingBefore";
        TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingAfter"] = 3] = "GrowsOnlyWhenTypingAfter";
    })(exports.TrackedRangeStickiness || (exports.TrackedRangeStickiness = {}));
    var TrackedRangeStickiness = exports.TrackedRangeStickiness;
    /**
     * Describes the reason the cursor has changed its position.
     */
    (function (CursorChangeReason) {
        /**
         * Unknown or not set.
         */
        CursorChangeReason[CursorChangeReason["NotSet"] = 0] = "NotSet";
        /**
         * A `model.setValue()` was called.
         */
        CursorChangeReason[CursorChangeReason["ContentFlush"] = 1] = "ContentFlush";
        /**
         * The `model` has been changed outside of this cursor and the cursor recovers its position from associated markers.
         */
        CursorChangeReason[CursorChangeReason["RecoverFromMarkers"] = 2] = "RecoverFromMarkers";
        /**
         * There was an explicit user gesture.
         */
        CursorChangeReason[CursorChangeReason["Explicit"] = 3] = "Explicit";
        /**
         * There was a Paste.
         */
        CursorChangeReason[CursorChangeReason["Paste"] = 4] = "Paste";
        /**
         * There was an Undo.
         */
        CursorChangeReason[CursorChangeReason["Undo"] = 5] = "Undo";
        /**
         * There was a Redo.
         */
        CursorChangeReason[CursorChangeReason["Redo"] = 6] = "Redo";
    })(exports.CursorChangeReason || (exports.CursorChangeReason = {}));
    var CursorChangeReason = exports.CursorChangeReason;
    /**
     * @internal
     */
    (function (VerticalRevealType) {
        VerticalRevealType[VerticalRevealType["Simple"] = 0] = "Simple";
        VerticalRevealType[VerticalRevealType["Center"] = 1] = "Center";
        VerticalRevealType[VerticalRevealType["CenterIfOutsideViewport"] = 2] = "CenterIfOutsideViewport";
    })(exports.VerticalRevealType || (exports.VerticalRevealType = {}));
    var VerticalRevealType = exports.VerticalRevealType;
    /**
     * A description for the overview ruler position.
     */
    var OverviewRulerPosition = (function () {
        /**
         * @internal
         */
        function OverviewRulerPosition(source) {
            this.width = source.width | 0;
            this.height = source.height | 0;
            this.top = source.top | 0;
            this.right = source.right | 0;
        }
        /**
         * @internal
         */
        OverviewRulerPosition.prototype.equals = function (other) {
            return (this.width === other.width
                && this.height === other.height
                && this.top === other.top
                && this.right === other.right);
        };
        /**
         * @internal
         */
        OverviewRulerPosition.prototype.clone = function () {
            return new OverviewRulerPosition(this);
        };
        return OverviewRulerPosition;
    }());
    exports.OverviewRulerPosition = OverviewRulerPosition;
    /**
     * The internal layout details of the editor.
     */
    var EditorLayoutInfo = (function () {
        /**
         * @internal
         */
        function EditorLayoutInfo(source) {
            this.width = source.width | 0;
            this.height = source.height | 0;
            this.glyphMarginLeft = source.glyphMarginLeft | 0;
            this.glyphMarginWidth = source.glyphMarginWidth | 0;
            this.glyphMarginHeight = source.glyphMarginHeight | 0;
            this.lineNumbersLeft = source.lineNumbersLeft | 0;
            this.lineNumbersWidth = source.lineNumbersWidth | 0;
            this.lineNumbersHeight = source.lineNumbersHeight | 0;
            this.decorationsLeft = source.decorationsLeft | 0;
            this.decorationsWidth = source.decorationsWidth | 0;
            this.decorationsHeight = source.decorationsHeight | 0;
            this.contentLeft = source.contentLeft | 0;
            this.contentWidth = source.contentWidth | 0;
            this.contentHeight = source.contentHeight | 0;
            this.verticalScrollbarWidth = source.verticalScrollbarWidth | 0;
            this.horizontalScrollbarHeight = source.horizontalScrollbarHeight | 0;
            this.overviewRuler = source.overviewRuler.clone();
        }
        /**
         * @internal
         */
        EditorLayoutInfo.prototype.equals = function (other) {
            return (this.width === other.width
                && this.height === other.height
                && this.glyphMarginLeft === other.glyphMarginLeft
                && this.glyphMarginWidth === other.glyphMarginWidth
                && this.glyphMarginHeight === other.glyphMarginHeight
                && this.lineNumbersLeft === other.lineNumbersLeft
                && this.lineNumbersWidth === other.lineNumbersWidth
                && this.lineNumbersHeight === other.lineNumbersHeight
                && this.decorationsLeft === other.decorationsLeft
                && this.decorationsWidth === other.decorationsWidth
                && this.decorationsHeight === other.decorationsHeight
                && this.contentLeft === other.contentLeft
                && this.contentWidth === other.contentWidth
                && this.contentHeight === other.contentHeight
                && this.verticalScrollbarWidth === other.verticalScrollbarWidth
                && this.horizontalScrollbarHeight === other.horizontalScrollbarHeight
                && this.overviewRuler.equals(other.overviewRuler));
        };
        /**
         * @internal
         */
        EditorLayoutInfo.prototype.clone = function () {
            return new EditorLayoutInfo(this);
        };
        return EditorLayoutInfo;
    }());
    exports.EditorLayoutInfo = EditorLayoutInfo;
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
    /**
     * A context key that is set when the editor's text has focus (cursor is blinking).
     */
    exports.KEYBINDING_CONTEXT_EDITOR_TEXT_FOCUS = 'editorTextFocus';
    /**
     * A context key that is set when the editor's text or an editor's widget has focus.
     */
    exports.KEYBINDING_CONTEXT_EDITOR_FOCUS = 'editorFocus';
    /**
     * @internal
     */
    exports.KEYBINDING_CONTEXT_EDITOR_TAB_MOVES_FOCUS = 'editorTabMovesFocus';
    /**
     * A context key that is set when the editor's text is readonly.
     */
    exports.KEYBINDING_CONTEXT_EDITOR_READONLY = 'editorReadonly';
    /**
     * A context key that is set when the editor has multiple selections (multiple cursors).
     */
    exports.KEYBINDING_CONTEXT_EDITOR_HAS_MULTIPLE_SELECTIONS = 'editorHasMultipleSelections';
    /**
     * A context key that is set when the editor has a non-collapsed selection.
     */
    exports.KEYBINDING_CONTEXT_EDITOR_HAS_NON_EMPTY_SELECTION = 'editorHasSelection';
    /**
     * A context key that is set to the language associated with the model associated with the editor.
     */
    exports.KEYBINDING_CONTEXT_EDITOR_LANGUAGE_ID = 'editorLangId';
    /**
     * @internal
     */
    exports.SHOW_ACCESSIBILITY_HELP_ACTION_ID = 'editor.action.showAccessibilityHelp';
    /**
     * @internal
     */
    var ModeContextKeys;
    (function (ModeContextKeys) {
        /**
         * @internal
         */
        ModeContextKeys.hasCompletionItemProvider = 'editorHasCompletionItemProvider';
        /**
         * @internal
         */
        ModeContextKeys.hasCodeActionsProvider = 'editorHasCodeActionsProvider';
        /**
         * @internal
         */
        ModeContextKeys.hasCodeLensProvider = 'editorHasCodeLensProvider';
        /**
         * @internal
         */
        ModeContextKeys.hasDefinitionProvider = 'editorHasDefinitionProvider';
        /**
         * @internal
         */
        ModeContextKeys.hasHoverProvider = 'editorHasHoverProvider';
        /**
         * @internal
         */
        ModeContextKeys.hasDocumentHighlightProvider = 'editorHasDocumentHighlightProvider';
        /**
         * @internal
         */
        ModeContextKeys.hasDocumentSymbolProvider = 'editorHasDocumentSymbolProvider';
        /**
         * @internal
         */
        ModeContextKeys.hasReferenceProvider = 'editorHasReferenceProvider';
        /**
         * @internal
         */
        ModeContextKeys.hasRenameProvider = 'editorHasRenameProvider';
        /**
         * @internal
         */
        ModeContextKeys.hasFormattingProvider = 'editorHasFormattingProvider';
        /**
         * @internal
         */
        ModeContextKeys.hasSignatureHelpProvider = 'editorHasSignatureHelpProvider';
    })(ModeContextKeys = exports.ModeContextKeys || (exports.ModeContextKeys = {}));
    var BareFontInfo = (function () {
        /**
         * @internal
         */
        function BareFontInfo(opts) {
            this.fontFamily = String(opts.fontFamily);
            this.fontSize = opts.fontSize | 0;
            this.lineHeight = opts.lineHeight | 0;
        }
        /**
         * @internal
         */
        BareFontInfo.prototype.getId = function () {
            return this.fontFamily + '-' + this.fontSize + '-' + this.lineHeight;
        };
        return BareFontInfo;
    }());
    exports.BareFontInfo = BareFontInfo;
    var FontInfo = (function (_super) {
        __extends(FontInfo, _super);
        /**
         * @internal
         */
        function FontInfo(opts) {
            _super.call(this, opts);
            this.typicalHalfwidthCharacterWidth = opts.typicalHalfwidthCharacterWidth;
            this.typicalFullwidthCharacterWidth = opts.typicalFullwidthCharacterWidth;
            this.spaceWidth = opts.spaceWidth;
            this.maxDigitWidth = opts.maxDigitWidth;
        }
        /**
         * @internal
         */
        FontInfo.prototype.equals = function (other) {
            return (this.fontFamily === other.fontFamily
                && this.fontSize === other.fontSize
                && this.lineHeight === other.lineHeight
                && this.typicalHalfwidthCharacterWidth === other.typicalHalfwidthCharacterWidth
                && this.typicalFullwidthCharacterWidth === other.typicalFullwidthCharacterWidth
                && this.spaceWidth === other.spaceWidth
                && this.maxDigitWidth === other.maxDigitWidth);
        };
        /**
         * @internal
         */
        FontInfo.prototype.clone = function () {
            return new FontInfo(this);
        };
        return FontInfo;
    }(BareFontInfo));
    exports.FontInfo = FontInfo;
    /**
     * @internal
     */
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
    /**
     * @internal
     */
    var Viewport = (function () {
        function Viewport(top, left, width, height) {
            this.top = top | 0;
            this.left = left | 0;
            this.width = width | 0;
            this.height = height | 0;
        }
        return Viewport;
    }());
    exports.Viewport = Viewport;
    /**
     * @internal
     */
    (function (CodeEditorStateFlag) {
        CodeEditorStateFlag[CodeEditorStateFlag["Value"] = 0] = "Value";
        CodeEditorStateFlag[CodeEditorStateFlag["Selection"] = 1] = "Selection";
        CodeEditorStateFlag[CodeEditorStateFlag["Position"] = 2] = "Position";
        CodeEditorStateFlag[CodeEditorStateFlag["Scroll"] = 3] = "Scroll";
    })(exports.CodeEditorStateFlag || (exports.CodeEditorStateFlag = {}));
    var CodeEditorStateFlag = exports.CodeEditorStateFlag;
    /**
     * The type of the `IEditor`.
     */
    exports.EditorType = {
        ICodeEditor: 'vs.editor.ICodeEditor',
        IDiffEditor: 'vs.editor.IDiffEditor'
    };
    /**
     * @internal
     */
    exports.ClassName = {
        EditorWarningDecoration: 'greensquiggly',
        EditorErrorDecoration: 'redsquiggly'
    };
    /**
     * @internal
     */
    exports.EventType = {
        Disposed: 'disposed',
        ConfigurationChanged: 'configurationChanged',
        ModelDispose: 'modelDispose',
        ModelChanged: 'modelChanged',
        ModelTokensChanged: 'modelTokensChanged',
        ModelModeChanged: 'modelsModeChanged',
        ModelModeSupportChanged: 'modelsModeSupportChanged',
        ModelOptionsChanged: 'modelOptionsChanged',
        ModelRawContentChanged: 'contentChanged',
        ModelContentChanged2: 'contentChanged2',
        ModelRawContentChangedFlush: 'flush',
        ModelRawContentChangedLinesDeleted: 'linesDeleted',
        ModelRawContentChangedLinesInserted: 'linesInserted',
        ModelRawContentChangedLineChanged: 'lineChanged',
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
    /**
     * Positions in the view for cursor move command.
     */
    exports.CursorMovePosition = {
        Left: 'left',
        Right: 'right',
        Up: 'up',
        Down: 'down',
        WrappedLineStart: 'wrappedLineStart',
        WrappedLineFirstNonWhitespaceCharacter: 'wrappedLineFirstNonWhitespaceCharacter',
        WrappedLineColumnCenter: 'wrappedLineColumnCenter',
        WrappedLineEnd: 'wrappedLineEnd',
        WrappedLineLastNonWhitespaceCharacter: 'wrappedLineLastNonWhitespaceCharacter',
        ViewPortTop: 'viewPortTop',
        ViewPortCenter: 'viewPortCenter',
        ViewPortBottom: 'viewPortBottom',
    };
    /**
     * Units for Cursor move 'by' argument
     */
    exports.CursorMoveByUnit = {
        Line: 'line',
        WrappedLine: 'wrappedLine',
        Character: 'character',
        HalfLine: 'halfLine'
    };
    ;
    /**
     * @internal
     */
    var isCursorMoveArgs = function (arg) {
        if (!types.isObject(arg)) {
            return false;
        }
        var cursorMoveArg = arg;
        if (!types.isString(cursorMoveArg.to)) {
            return false;
        }
        if (!types.isUndefined(cursorMoveArg.select) && !types.isBoolean(cursorMoveArg.select)) {
            return false;
        }
        if (!types.isUndefined(cursorMoveArg.by) && !types.isString(cursorMoveArg.by)) {
            return false;
        }
        if (!types.isUndefined(cursorMoveArg.value) && !types.isNumber(cursorMoveArg.value)) {
            return false;
        }
        return true;
    };
    /**
     * @internal
     */
    exports.CommandDescription = {
        CursorMove: {
            description: nls.localize(0, null),
            args: [
                {
                    name: nls.localize(1, null),
                    description: nls.localize(2, null),
                    constraint: isCursorMoveArgs
                }
            ]
        }
    };
    /**
     * Built-in commands.
     */
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
        CursorMove: 'cursorMove',
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
        CompositionStart: 'compositionStart',
        CompositionEnd: 'compositionEnd',
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
    /**
     * The style in which the editor's cursor should be rendered.
     */
    (function (TextEditorCursorStyle) {
        /**
         * As a vertical line (sitting between two characters).
         */
        TextEditorCursorStyle[TextEditorCursorStyle["Line"] = 1] = "Line";
        /**
         * As a block (sitting on top of a character).
         */
        TextEditorCursorStyle[TextEditorCursorStyle["Block"] = 2] = "Block";
        /**
         * As a horizontal line (sitting under a character).
         */
        TextEditorCursorStyle[TextEditorCursorStyle["Underline"] = 3] = "Underline";
    })(exports.TextEditorCursorStyle || (exports.TextEditorCursorStyle = {}));
    var TextEditorCursorStyle = exports.TextEditorCursorStyle;
    /**
     * The kind of animation in which the editor's cursor should be rendered.
     */
    (function (TextEditorCursorBlinkingStyle) {
        /**
         * Hidden
         */
        TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Hidden"] = 0] = "Hidden";
        /**
         * Blinking
         */
        TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Blink"] = 1] = "Blink";
        /**
         * Blinking with smooth fading
         */
        TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Smooth"] = 2] = "Smooth";
        /**
         * Blinking with prolonged filled state and smooth fading
         */
        TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Phase"] = 3] = "Phase";
        /**
         * Expand collapse animation on the y axis
         */
        TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Expand"] = 4] = "Expand";
        /**
         * No-Blinking
         */
        TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Solid"] = 5] = "Solid";
    })(exports.TextEditorCursorBlinkingStyle || (exports.TextEditorCursorBlinkingStyle = {}));
    var TextEditorCursorBlinkingStyle = exports.TextEditorCursorBlinkingStyle;
    /**
     * @internal
     */
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
    /**
     * @internal
     */
    var ColorZone = (function () {
        function ColorZone(from, to, colorId, position) {
            this.from = from | 0;
            this.to = to | 0;
            this.colorId = colorId | 0;
            this.position = position | 0;
        }
        return ColorZone;
    }());
    exports.ColorZone = ColorZone;
    /**
     * A zone in the overview ruler
     * @internal
     */
    var OverviewRulerZone = (function () {
        function OverviewRulerZone(startLineNumber, endLineNumber, position, forceHeight, color, darkColor) {
            this.startLineNumber = startLineNumber;
            this.endLineNumber = endLineNumber;
            this.position = position;
            this.forceHeight = forceHeight;
            this._color = color;
            this._darkColor = darkColor;
            this._colorZones = null;
        }
        OverviewRulerZone.prototype.getColor = function (useDarkColor) {
            if (useDarkColor) {
                return this._darkColor;
            }
            return this._color;
        };
        OverviewRulerZone.prototype.equals = function (other) {
            return (this.startLineNumber === other.startLineNumber
                && this.endLineNumber === other.endLineNumber
                && this.position === other.position
                && this.forceHeight === other.forceHeight
                && this._color === other._color
                && this._darkColor === other._darkColor);
        };
        OverviewRulerZone.prototype.compareTo = function (other) {
            if (this.startLineNumber === other.startLineNumber) {
                if (this.endLineNumber === other.endLineNumber) {
                    if (this.forceHeight === other.forceHeight) {
                        if (this.position === other.position) {
                            if (this._darkColor === other._darkColor) {
                                if (this._color === other._color) {
                                    return 0;
                                }
                                return this._color < other._color ? -1 : 1;
                            }
                            return this._darkColor < other._darkColor ? -1 : 1;
                        }
                        return this.position - other.position;
                    }
                    return this.forceHeight - other.forceHeight;
                }
                return this.endLineNumber - other.endLineNumber;
            }
            return this.startLineNumber - other.startLineNumber;
        };
        OverviewRulerZone.prototype.setColorZones = function (colorZones) {
            this._colorZones = colorZones;
        };
        OverviewRulerZone.prototype.getColorZones = function () {
            return this._colorZones;
        };
        return OverviewRulerZone;
    }());
    exports.OverviewRulerZone = OverviewRulerZone;
});

define(__m[49], __M([9,7]), function(nls, data) { return nls.create("vs/platform/extensions/common/abstractExtensionService", data); });
define(__m[50], __M([9,7]), function(nls, data) { return nls.create("vs/platform/extensions/common/extensionsRegistry", data); });
define(__m[51], __M([9,7]), function(nls, data) { return nls.create("vs/platform/extensions/node/extensionValidator", data); });
define(__m[52], __M([9,7]), function(nls, data) { return nls.create("vs/workbench/node/extensionHostMain", data); });
define(__m[53], __M([9,7]), function(nls, data) { return nls.create("vs/workbench/node/extensionPoints", data); });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[54], __M([0,1,22]), function (require, exports, ipc_1) {
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

define(__m[55], __M([0,1,3,27,4]), function (require, exports, winjs, marshalling, errors) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var pendingRPCReplies = {};
    var MessageFactory = (function () {
        function MessageFactory() {
        }
        MessageFactory.cancel = function (req) {
            return "{\"cancel\":\"" + req + "\"}";
        };
        MessageFactory.request = function (req, rpcId, method, args) {
            return "{\"req\":\"" + req + "\",\"rpcId\":\"" + rpcId + "\",\"method\":\"" + method + "\",\"args\":" + marshalling.stringify(args) + "}";
        };
        MessageFactory.replyOK = function (req, res) {
            if (typeof res === 'undefined') {
                return "{\"seq\":\"" + req + "\"}";
            }
            return "{\"seq\":\"" + req + "\",\"res\":" + marshalling.stringify(res) + "}";
        };
        MessageFactory.replyErr = function (req, err) {
            if (typeof err === 'undefined') {
                return "{\"seq\":\"" + req + "\",\"err\":null}";
            }
            return "{\"seq\":\"" + req + "\",\"err\":" + marshalling.stringify(errors.transformErrorForSerialization(err)) + "}";
        };
        return MessageFactory;
    }());
    var LazyPromise = (function () {
        function LazyPromise(onCancel) {
            this._onCancel = onCancel;
            this._actual = null;
            this._actualOk = null;
            this._actualErr = null;
            this._hasValue = false;
            this._value = null;
            this._hasErr = false;
            this._err = null;
            this._isCanceled = false;
        }
        LazyPromise.prototype._ensureActual = function () {
            var _this = this;
            if (!this._actual) {
                this._actual = new winjs.TPromise(function (c, e) {
                    _this._actualOk = c;
                    _this._actualErr = e;
                }, this._onCancel);
                if (this._hasValue) {
                    this._actualOk(this._value);
                }
                if (this._hasErr) {
                    this._actualErr(this._err);
                }
            }
            return this._actual;
        };
        LazyPromise.prototype.resolveOk = function (value) {
            if (this._isCanceled || this._hasErr) {
                return;
            }
            this._hasValue = true;
            this._value = value;
            if (this._actual) {
                this._actualOk(value);
            }
        };
        LazyPromise.prototype.resolveErr = function (err) {
            if (this._isCanceled || this._hasValue) {
                return;
            }
            this._hasErr = true;
            this._err = err;
            if (this._actual) {
                this._actualErr(err);
            }
        };
        LazyPromise.prototype.then = function (success, error) {
            if (this._isCanceled) {
                return;
            }
            return this._ensureActual().then(success, error);
        };
        LazyPromise.prototype.done = function (success, error) {
            if (this._isCanceled) {
                return;
            }
            this._ensureActual().done(success, error);
        };
        LazyPromise.prototype.cancel = function () {
            if (this._hasValue || this._hasErr) {
                return;
            }
            this._isCanceled = true;
            if (this._actual) {
                this._actual.cancel();
            }
            else {
                this._onCancel();
            }
        };
        return LazyPromise;
    }());
    function createRPC(serializeAndSend) {
        var lastMessageId = 0;
        return function rpc(rpcId, method, args) {
            var req = String(++lastMessageId);
            var result = new LazyPromise(function () {
                serializeAndSend(MessageFactory.cancel(req));
            });
            pendingRPCReplies[req] = result;
            serializeAndSend(MessageFactory.request(req, rpcId, method, args));
            return result;
        };
    }
    function create(send) {
        var rpc = createRPC(sendDelayed);
        var bigHandler = null;
        var invokedHandlers = Object.create(null);
        var messagesToSend = [];
        var messagesToReceive = [];
        var receiveOneMessage = function () {
            var rawmsg = messagesToReceive.shift();
            if (messagesToReceive.length > 0) {
                process.nextTick(receiveOneMessage);
            }
            var msg = marshalling.parse(rawmsg);
            if (msg.seq) {
                if (!pendingRPCReplies.hasOwnProperty(msg.seq)) {
                    console.warn('Got reply to unknown seq');
                    return;
                }
                var reply = pendingRPCReplies[msg.seq];
                delete pendingRPCReplies[msg.seq];
                if (msg.err) {
                    var err = msg.err;
                    if (msg.err.$isError) {
                        err = new Error();
                        err.name = msg.err.name;
                        err.message = msg.err.message;
                        err.stack = msg.err.stack;
                    }
                    reply.resolveErr(err);
                    return;
                }
                reply.resolveOk(msg.res);
                return;
            }
            if (msg.cancel) {
                if (invokedHandlers[msg.cancel]) {
                    invokedHandlers[msg.cancel].cancel();
                }
                return;
            }
            if (msg.err) {
                console.error(msg.err);
                return;
            }
            var rpcId = msg.rpcId;
            if (!bigHandler) {
                throw new Error('got message before big handler attached!');
            }
            var req = msg.req;
            invokedHandlers[req] = invokeHandler(rpcId, msg.method, msg.args);
            invokedHandlers[req].then(function (r) {
                delete invokedHandlers[req];
                sendDelayed(MessageFactory.replyOK(req, r));
            }, function (err) {
                delete invokedHandlers[req];
                sendDelayed(MessageFactory.replyErr(req, err));
            });
        };
        var r = {
            callOnRemote: rpc,
            setManyHandler: function (_bigHandler) {
                bigHandler = _bigHandler;
            },
            handle: function (rawmsg) {
                // console.log('RECEIVED ' + rawmsg.length + ' MESSAGES.');
                if (messagesToReceive.length === 0) {
                    process.nextTick(receiveOneMessage);
                }
                messagesToReceive = messagesToReceive.concat(rawmsg);
            }
        };
        function sendAccumulated() {
            var tmp = messagesToSend;
            messagesToSend = [];
            // console.log('SENDING ' + tmp.length + ' MESSAGES.');
            send(tmp);
        }
        function sendDelayed(value) {
            if (messagesToSend.length === 0) {
                process.nextTick(sendAccumulated);
            }
            messagesToSend.push(value);
        }
        function invokeHandler(rpcId, method, args) {
            try {
                return winjs.TPromise.as(bigHandler.handle(rpcId, method, args));
            }
            catch (err) {
                return winjs.TPromise.wrapError(err);
            }
        }
        return r;
    }
    exports.create = create;
});

define(__m[19], __M([0,1]), function (require, exports) {
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

define(__m[57], __M([0,1,19]), function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IEditorService = instantiation_1.createDecorator('editorService');
    /**
     * Possible locations for opening an editor.
     */
    (function (Position) {
        /** Opens the editor in the LEFT most position replacing the input currently showing */
        Position[Position["LEFT"] = 0] = "LEFT";
        /** Opens the editor in the CENTER position replacing the input currently showing */
        Position[Position["CENTER"] = 1] = "CENTER";
        /** Opens the editor in the RIGHT most position replacing the input currently showing */
        Position[Position["RIGHT"] = 2] = "RIGHT";
    })(exports.Position || (exports.Position = {}));
    var Position = exports.Position;
    exports.POSITIONS = [Position.LEFT, Position.CENTER, Position.RIGHT];
    (function (Direction) {
        Direction[Direction["LEFT"] = 0] = "LEFT";
        Direction[Direction["RIGHT"] = 1] = "RIGHT";
    })(exports.Direction || (exports.Direction = {}));
    var Direction = exports.Direction;
});

define(__m[26], __M([0,1,12,66]), function (require, exports, Types, Assert) {
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

define(__m[59], __M([0,1,26,33]), function (require, exports, platform, eventEmitter_1) {
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

define(__m[16], __M([0,1,50,4,8,13,59,26]), function (require, exports, nls, errors_1, paths, severity_1, jsonContributionRegistry_1, platform_1) {
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

define(__m[61], __M([0,1,49,13,3,16]), function (require, exports, nls, severity_1, winjs_base_1, extensionsRegistry_1) {
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

define(__m[62], __M([0,1,51,16,63]), function (require, exports, nls, extensionsRegistry_1, semver_1) {
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
define(__m[64], __M([0,1,19]), function (require, exports, instantiation_1) {
    'use strict';
    exports.IStatusbarService = instantiation_1.createDecorator('statusbarService');
    (function (StatusbarAlignment) {
        StatusbarAlignment[StatusbarAlignment["LEFT"] = 0] = "LEFT";
        StatusbarAlignment[StatusbarAlignment["RIGHT"] = 1] = "RIGHT";
    })(exports.StatusbarAlignment || (exports.StatusbarAlignment = {}));
    var StatusbarAlignment = exports.StatusbarAlignment;
});

define(__m[65], __M([0,1,10,8]), function (require, exports, uri_1, paths) {
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






define(__m[5], __M([0,1,10,4]), function (require, exports, uri_1, errors_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var Disposable = (function () {
        function Disposable(callOnDispose) {
            this._callOnDispose = callOnDispose;
        }
        Disposable.from = function () {
            var disposables = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                disposables[_i - 0] = arguments[_i];
            }
            return new Disposable(function () {
                if (disposables) {
                    for (var _i = 0, disposables_1 = disposables; _i < disposables_1.length; _i++) {
                        var disposable = disposables_1[_i];
                        if (disposable && typeof disposable.dispose === 'function') {
                            disposable.dispose();
                        }
                    }
                    disposables = undefined;
                }
            });
        };
        Disposable.prototype.dispose = function () {
            if (typeof this._callOnDispose === 'function') {
                this._callOnDispose();
                this._callOnDispose = undefined;
            }
        };
        return Disposable;
    }());
    exports.Disposable = Disposable;
    var Position = (function () {
        function Position(line, character) {
            if (line < 0) {
                throw errors_1.illegalArgument('line must be positive');
            }
            if (character < 0) {
                throw errors_1.illegalArgument('character must be positive');
            }
            this._line = line;
            this._character = character;
        }
        Position.Min = function () {
            var positions = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                positions[_i - 0] = arguments[_i];
            }
            var result = positions.pop();
            for (var _a = 0, positions_1 = positions; _a < positions_1.length; _a++) {
                var p = positions_1[_a];
                if (p.isBefore(result)) {
                    result = p;
                }
            }
            return result;
        };
        Position.Max = function () {
            var positions = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                positions[_i - 0] = arguments[_i];
            }
            var result = positions.pop();
            for (var _a = 0, positions_2 = positions; _a < positions_2.length; _a++) {
                var p = positions_2[_a];
                if (p.isAfter(result)) {
                    result = p;
                }
            }
            return result;
        };
        Position.is = function (other) {
            if (!other) {
                return false;
            }
            if (other instanceof Position) {
                return true;
            }
            var _a = other, line = _a.line, character = _a.character;
            if (typeof line === 'number' && typeof character === 'number') {
                return true;
            }
            return false;
        };
        Object.defineProperty(Position.prototype, "line", {
            get: function () {
                return this._line;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Position.prototype, "character", {
            get: function () {
                return this._character;
            },
            enumerable: true,
            configurable: true
        });
        Position.prototype.isBefore = function (other) {
            if (this._line < other._line) {
                return true;
            }
            if (other._line < this._line) {
                return false;
            }
            return this._character < other._character;
        };
        Position.prototype.isBeforeOrEqual = function (other) {
            if (this._line < other._line) {
                return true;
            }
            if (other._line < this._line) {
                return false;
            }
            return this._character <= other._character;
        };
        Position.prototype.isAfter = function (other) {
            return !this.isBeforeOrEqual(other);
        };
        Position.prototype.isAfterOrEqual = function (other) {
            return !this.isBefore(other);
        };
        Position.prototype.isEqual = function (other) {
            return this._line === other._line && this._character === other._character;
        };
        Position.prototype.compareTo = function (other) {
            if (this._line < other._line) {
                return -1;
            }
            else if (this._line > other.line) {
                return 1;
            }
            else {
                // equal line
                if (this._character < other._character) {
                    return -1;
                }
                else if (this._character > other._character) {
                    return 1;
                }
                else {
                    // equal line and character
                    return 0;
                }
            }
        };
        Position.prototype.translate = function (lineDeltaOrChange, characterDelta) {
            if (characterDelta === void 0) { characterDelta = 0; }
            if (lineDeltaOrChange === null || characterDelta === null) {
                throw errors_1.illegalArgument();
            }
            var lineDelta;
            if (typeof lineDeltaOrChange === 'undefined') {
                lineDelta = 0;
            }
            else if (typeof lineDeltaOrChange === 'number') {
                lineDelta = lineDeltaOrChange;
            }
            else {
                lineDelta = typeof lineDeltaOrChange.lineDelta === 'number' ? lineDeltaOrChange.lineDelta : 0;
                characterDelta = typeof lineDeltaOrChange.characterDelta === 'number' ? lineDeltaOrChange.characterDelta : 0;
            }
            if (lineDelta === 0 && characterDelta === 0) {
                return this;
            }
            return new Position(this.line + lineDelta, this.character + characterDelta);
        };
        Position.prototype.with = function (lineOrChange, character) {
            if (character === void 0) { character = this.character; }
            if (lineOrChange === null || character === null) {
                throw errors_1.illegalArgument();
            }
            var line;
            if (typeof lineOrChange === 'undefined') {
                line = this.line;
            }
            else if (typeof lineOrChange === 'number') {
                line = lineOrChange;
            }
            else {
                line = typeof lineOrChange.line === 'number' ? lineOrChange.line : this.line;
                character = typeof lineOrChange.character === 'number' ? lineOrChange.character : this.character;
            }
            if (line === this.line && character === this.character) {
                return this;
            }
            return new Position(line, character);
        };
        Position.prototype.toJSON = function () {
            return { line: this.line, character: this.character };
        };
        return Position;
    }());
    exports.Position = Position;
    var Range = (function () {
        function Range(startLineOrStart, startColumnOrEnd, endLine, endColumn) {
            var start;
            var end;
            if (typeof startLineOrStart === 'number' && typeof startColumnOrEnd === 'number' && typeof endLine === 'number' && typeof endColumn === 'number') {
                start = new Position(startLineOrStart, startColumnOrEnd);
                end = new Position(endLine, endColumn);
            }
            else if (startLineOrStart instanceof Position && startColumnOrEnd instanceof Position) {
                start = startLineOrStart;
                end = startColumnOrEnd;
            }
            if (!start || !end) {
                throw new Error('Invalid arguments');
            }
            if (start.isBefore(end)) {
                this._start = start;
                this._end = end;
            }
            else {
                this._start = end;
                this._end = start;
            }
        }
        Range.is = function (thing) {
            if (thing instanceof Range) {
                return true;
            }
            if (!thing) {
                return false;
            }
            return Position.is(thing.start)
                && Position.is(thing.end);
        };
        Object.defineProperty(Range.prototype, "start", {
            get: function () {
                return this._start;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Range.prototype, "end", {
            get: function () {
                return this._end;
            },
            enumerable: true,
            configurable: true
        });
        Range.prototype.contains = function (positionOrRange) {
            if (positionOrRange instanceof Range) {
                return this.contains(positionOrRange._start)
                    && this.contains(positionOrRange._end);
            }
            else if (positionOrRange instanceof Position) {
                if (positionOrRange.isBefore(this._start)) {
                    return false;
                }
                if (this._end.isBefore(positionOrRange)) {
                    return false;
                }
                return true;
            }
            return false;
        };
        Range.prototype.isEqual = function (other) {
            return this._start.isEqual(other._start) && this._end.isEqual(other._end);
        };
        Range.prototype.intersection = function (other) {
            var start = Position.Max(other.start, this._start);
            var end = Position.Min(other.end, this._end);
            if (start.isAfter(end)) {
                // this happens when there is no overlap:
                // |-----|
                //          |----|
                return;
            }
            return new Range(start, end);
        };
        Range.prototype.union = function (other) {
            if (this.contains(other)) {
                return this;
            }
            else if (other.contains(this)) {
                return other;
            }
            var start = Position.Min(other.start, this._start);
            var end = Position.Max(other.end, this.end);
            return new Range(start, end);
        };
        Object.defineProperty(Range.prototype, "isEmpty", {
            get: function () {
                return this._start.isEqual(this._end);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Range.prototype, "isSingleLine", {
            get: function () {
                return this._start.line === this._end.line;
            },
            enumerable: true,
            configurable: true
        });
        Range.prototype.with = function (startOrChange, end) {
            if (end === void 0) { end = this.end; }
            if (startOrChange === null || end === null) {
                throw errors_1.illegalArgument();
            }
            var start;
            if (!startOrChange) {
                start = this.start;
            }
            else if (Position.is(startOrChange)) {
                start = startOrChange;
            }
            else {
                start = startOrChange.start || this.start;
                end = startOrChange.end || this.end;
            }
            if (start.isEqual(this._start) && end.isEqual(this.end)) {
                return this;
            }
            return new Range(start, end);
        };
        Range.prototype.toJSON = function () {
            return [this.start, this.end];
        };
        return Range;
    }());
    exports.Range = Range;
    var Selection = (function (_super) {
        __extends(Selection, _super);
        function Selection(anchorLineOrAnchor, anchorColumnOrActive, activeLine, activeColumn) {
            var anchor;
            var active;
            if (typeof anchorLineOrAnchor === 'number' && typeof anchorColumnOrActive === 'number' && typeof activeLine === 'number' && typeof activeColumn === 'number') {
                anchor = new Position(anchorLineOrAnchor, anchorColumnOrActive);
                active = new Position(activeLine, activeColumn);
            }
            else if (anchorLineOrAnchor instanceof Position && anchorColumnOrActive instanceof Position) {
                anchor = anchorLineOrAnchor;
                active = anchorColumnOrActive;
            }
            if (!anchor || !active) {
                throw new Error('Invalid arguments');
            }
            _super.call(this, anchor, active);
            this._anchor = anchor;
            this._active = active;
        }
        Object.defineProperty(Selection.prototype, "anchor", {
            get: function () {
                return this._anchor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Selection.prototype, "active", {
            get: function () {
                return this._active;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Selection.prototype, "isReversed", {
            get: function () {
                return this._anchor === this._end;
            },
            enumerable: true,
            configurable: true
        });
        Selection.prototype.toJSON = function () {
            return {
                start: this.start,
                end: this.end,
                active: this.active,
                anchor: this.anchor
            };
        };
        return Selection;
    }(Range));
    exports.Selection = Selection;
    var TextEdit = (function () {
        function TextEdit(range, newText) {
            this.range = range;
            this.newText = newText;
        }
        TextEdit.replace = function (range, newText) {
            return new TextEdit(range, newText);
        };
        TextEdit.insert = function (position, newText) {
            return TextEdit.replace(new Range(position, position), newText);
        };
        TextEdit.delete = function (range) {
            return TextEdit.replace(range, '');
        };
        Object.defineProperty(TextEdit.prototype, "range", {
            get: function () {
                return this._range;
            },
            set: function (value) {
                if (!value) {
                    throw errors_1.illegalArgument('range');
                }
                this._range = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextEdit.prototype, "newText", {
            get: function () {
                return this._newText || '';
            },
            set: function (value) {
                this._newText = value;
            },
            enumerable: true,
            configurable: true
        });
        TextEdit.prototype.toJSON = function () {
            return {
                range: this.range,
                newText: this.newText
            };
        };
        return TextEdit;
    }());
    exports.TextEdit = TextEdit;
    var Uri = (function (_super) {
        __extends(Uri, _super);
        function Uri() {
            _super.apply(this, arguments);
        }
        return Uri;
    }(uri_1.default));
    exports.Uri = Uri;
    var WorkspaceEdit = (function () {
        function WorkspaceEdit() {
            this._values = [];
            this._index = Object.create(null);
        }
        WorkspaceEdit.prototype.replace = function (uri, range, newText) {
            var edit = new TextEdit(range, newText);
            var array = this.get(uri);
            if (array) {
                array.push(edit);
            }
            else {
                this.set(uri, [edit]);
            }
        };
        WorkspaceEdit.prototype.insert = function (resource, position, newText) {
            this.replace(resource, new Range(position, position), newText);
        };
        WorkspaceEdit.prototype.delete = function (resource, range) {
            this.replace(resource, range, '');
        };
        WorkspaceEdit.prototype.has = function (uri) {
            return typeof this._index[uri.toString()] !== 'undefined';
        };
        WorkspaceEdit.prototype.set = function (uri, edits) {
            var idx = this._index[uri.toString()];
            if (typeof idx === 'undefined') {
                var newLen = this._values.push([uri, edits]);
                this._index[uri.toString()] = newLen - 1;
            }
            else {
                this._values[idx][1] = edits;
            }
        };
        WorkspaceEdit.prototype.get = function (uri) {
            var idx = this._index[uri.toString()];
            return typeof idx !== 'undefined' && this._values[idx][1];
        };
        WorkspaceEdit.prototype.entries = function () {
            return this._values;
        };
        Object.defineProperty(WorkspaceEdit.prototype, "size", {
            get: function () {
                return this._values.length;
            },
            enumerable: true,
            configurable: true
        });
        WorkspaceEdit.prototype.toJSON = function () {
            return this._values;
        };
        return WorkspaceEdit;
    }());
    exports.WorkspaceEdit = WorkspaceEdit;
    (function (DiagnosticSeverity) {
        DiagnosticSeverity[DiagnosticSeverity["Hint"] = 3] = "Hint";
        DiagnosticSeverity[DiagnosticSeverity["Information"] = 2] = "Information";
        DiagnosticSeverity[DiagnosticSeverity["Warning"] = 1] = "Warning";
        DiagnosticSeverity[DiagnosticSeverity["Error"] = 0] = "Error";
    })(exports.DiagnosticSeverity || (exports.DiagnosticSeverity = {}));
    var DiagnosticSeverity = exports.DiagnosticSeverity;
    var Location = (function () {
        function Location(uri, range) {
            this.uri = uri;
            if (range instanceof Range) {
                this.range = range;
            }
            else if (range instanceof Position) {
                this.range = new Range(range, range);
            }
            else {
                throw new Error('Illegal argument');
            }
        }
        Location.prototype.toJSON = function () {
            return {
                uri: this.uri,
                range: this.range
            };
        };
        return Location;
    }());
    exports.Location = Location;
    var Diagnostic = (function () {
        function Diagnostic(range, message, severity) {
            if (severity === void 0) { severity = DiagnosticSeverity.Error; }
            this.range = range;
            this.message = message;
            this.severity = severity;
        }
        Diagnostic.prototype.toJSON = function () {
            return {
                severity: DiagnosticSeverity[this.severity],
                message: this.message,
                range: this.range,
                source: this.source,
                code: this.code,
            };
        };
        return Diagnostic;
    }());
    exports.Diagnostic = Diagnostic;
    var Hover = (function () {
        function Hover(contents, range) {
            if (!contents) {
                throw new Error('Illegal argument');
            }
            if (Array.isArray(contents)) {
                this.contents = contents;
            }
            else {
                this.contents = [contents];
            }
            this.range = range;
        }
        return Hover;
    }());
    exports.Hover = Hover;
    (function (DocumentHighlightKind) {
        DocumentHighlightKind[DocumentHighlightKind["Text"] = 0] = "Text";
        DocumentHighlightKind[DocumentHighlightKind["Read"] = 1] = "Read";
        DocumentHighlightKind[DocumentHighlightKind["Write"] = 2] = "Write";
    })(exports.DocumentHighlightKind || (exports.DocumentHighlightKind = {}));
    var DocumentHighlightKind = exports.DocumentHighlightKind;
    var DocumentHighlight = (function () {
        function DocumentHighlight(range, kind) {
            if (kind === void 0) { kind = DocumentHighlightKind.Text; }
            this.range = range;
            this.kind = kind;
        }
        DocumentHighlight.prototype.toJSON = function () {
            return {
                range: this.range,
                kind: DocumentHighlightKind[this.kind]
            };
        };
        return DocumentHighlight;
    }());
    exports.DocumentHighlight = DocumentHighlight;
    (function (SymbolKind) {
        SymbolKind[SymbolKind["File"] = 0] = "File";
        SymbolKind[SymbolKind["Module"] = 1] = "Module";
        SymbolKind[SymbolKind["Namespace"] = 2] = "Namespace";
        SymbolKind[SymbolKind["Package"] = 3] = "Package";
        SymbolKind[SymbolKind["Class"] = 4] = "Class";
        SymbolKind[SymbolKind["Method"] = 5] = "Method";
        SymbolKind[SymbolKind["Property"] = 6] = "Property";
        SymbolKind[SymbolKind["Field"] = 7] = "Field";
        SymbolKind[SymbolKind["Constructor"] = 8] = "Constructor";
        SymbolKind[SymbolKind["Enum"] = 9] = "Enum";
        SymbolKind[SymbolKind["Interface"] = 10] = "Interface";
        SymbolKind[SymbolKind["Function"] = 11] = "Function";
        SymbolKind[SymbolKind["Variable"] = 12] = "Variable";
        SymbolKind[SymbolKind["Constant"] = 13] = "Constant";
        SymbolKind[SymbolKind["String"] = 14] = "String";
        SymbolKind[SymbolKind["Number"] = 15] = "Number";
        SymbolKind[SymbolKind["Boolean"] = 16] = "Boolean";
        SymbolKind[SymbolKind["Array"] = 17] = "Array";
        SymbolKind[SymbolKind["Object"] = 18] = "Object";
        SymbolKind[SymbolKind["Key"] = 19] = "Key";
        SymbolKind[SymbolKind["Null"] = 20] = "Null";
    })(exports.SymbolKind || (exports.SymbolKind = {}));
    var SymbolKind = exports.SymbolKind;
    var SymbolInformation = (function () {
        function SymbolInformation(name, kind, range, uri, containerName) {
            this.name = name;
            this.kind = kind;
            this.location = new Location(uri, range);
            this.containerName = containerName;
        }
        SymbolInformation.prototype.toJSON = function () {
            return {
                name: this.name,
                kind: SymbolKind[this.kind],
                location: this.location,
                containerName: this.containerName
            };
        };
        return SymbolInformation;
    }());
    exports.SymbolInformation = SymbolInformation;
    var CodeLens = (function () {
        function CodeLens(range, command) {
            this.range = range;
            this.command = command;
        }
        Object.defineProperty(CodeLens.prototype, "isResolved", {
            get: function () {
                return !!this.command;
            },
            enumerable: true,
            configurable: true
        });
        return CodeLens;
    }());
    exports.CodeLens = CodeLens;
    var ParameterInformation = (function () {
        function ParameterInformation(label, documentation) {
            this.label = label;
            this.documentation = documentation;
        }
        return ParameterInformation;
    }());
    exports.ParameterInformation = ParameterInformation;
    var SignatureInformation = (function () {
        function SignatureInformation(label, documentation) {
            this.label = label;
            this.documentation = documentation;
            this.parameters = [];
        }
        return SignatureInformation;
    }());
    exports.SignatureInformation = SignatureInformation;
    var SignatureHelp = (function () {
        function SignatureHelp() {
            this.signatures = [];
        }
        return SignatureHelp;
    }());
    exports.SignatureHelp = SignatureHelp;
    (function (CompletionItemKind) {
        CompletionItemKind[CompletionItemKind["Text"] = 0] = "Text";
        CompletionItemKind[CompletionItemKind["Method"] = 1] = "Method";
        CompletionItemKind[CompletionItemKind["Function"] = 2] = "Function";
        CompletionItemKind[CompletionItemKind["Constructor"] = 3] = "Constructor";
        CompletionItemKind[CompletionItemKind["Field"] = 4] = "Field";
        CompletionItemKind[CompletionItemKind["Variable"] = 5] = "Variable";
        CompletionItemKind[CompletionItemKind["Class"] = 6] = "Class";
        CompletionItemKind[CompletionItemKind["Interface"] = 7] = "Interface";
        CompletionItemKind[CompletionItemKind["Module"] = 8] = "Module";
        CompletionItemKind[CompletionItemKind["Property"] = 9] = "Property";
        CompletionItemKind[CompletionItemKind["Unit"] = 10] = "Unit";
        CompletionItemKind[CompletionItemKind["Value"] = 11] = "Value";
        CompletionItemKind[CompletionItemKind["Enum"] = 12] = "Enum";
        CompletionItemKind[CompletionItemKind["Keyword"] = 13] = "Keyword";
        CompletionItemKind[CompletionItemKind["Snippet"] = 14] = "Snippet";
        CompletionItemKind[CompletionItemKind["Color"] = 15] = "Color";
        CompletionItemKind[CompletionItemKind["File"] = 16] = "File";
        CompletionItemKind[CompletionItemKind["Reference"] = 17] = "Reference";
    })(exports.CompletionItemKind || (exports.CompletionItemKind = {}));
    var CompletionItemKind = exports.CompletionItemKind;
    var CompletionItem = (function () {
        function CompletionItem(label, kind) {
            this.label = label;
            this.kind = kind;
        }
        CompletionItem.prototype.toJSON = function () {
            return {
                label: this.label,
                kind: CompletionItemKind[this.kind],
                detail: this.detail,
                documentation: this.documentation,
                sortText: this.sortText,
                filterText: this.filterText,
                insertText: this.insertText,
                textEdit: this.textEdit
            };
        };
        return CompletionItem;
    }());
    exports.CompletionItem = CompletionItem;
    var CompletionList = (function () {
        function CompletionList(items, isIncomplete) {
            if (items === void 0) { items = []; }
            if (isIncomplete === void 0) { isIncomplete = false; }
            this.items = items;
            this.isIncomplete = isIncomplete;
        }
        return CompletionList;
    }());
    exports.CompletionList = CompletionList;
    (function (ViewColumn) {
        ViewColumn[ViewColumn["One"] = 1] = "One";
        ViewColumn[ViewColumn["Two"] = 2] = "Two";
        ViewColumn[ViewColumn["Three"] = 3] = "Three";
    })(exports.ViewColumn || (exports.ViewColumn = {}));
    var ViewColumn = exports.ViewColumn;
    (function (StatusBarAlignment) {
        StatusBarAlignment[StatusBarAlignment["Left"] = 1] = "Left";
        StatusBarAlignment[StatusBarAlignment["Right"] = 2] = "Right";
    })(exports.StatusBarAlignment || (exports.StatusBarAlignment = {}));
    var StatusBarAlignment = exports.StatusBarAlignment;
    (function (EndOfLine) {
        EndOfLine[EndOfLine["LF"] = 1] = "LF";
        EndOfLine[EndOfLine["CRLF"] = 2] = "CRLF";
    })(exports.EndOfLine || (exports.EndOfLine = {}));
    var EndOfLine = exports.EndOfLine;
    (function (TextEditorRevealType) {
        TextEditorRevealType[TextEditorRevealType["Default"] = 0] = "Default";
        TextEditorRevealType[TextEditorRevealType["InCenter"] = 1] = "InCenter";
        TextEditorRevealType[TextEditorRevealType["InCenterIfOutsideViewport"] = 2] = "InCenterIfOutsideViewport";
    })(exports.TextEditorRevealType || (exports.TextEditorRevealType = {}));
    var TextEditorRevealType = exports.TextEditorRevealType;
    var DocumentLink = (function () {
        function DocumentLink(range, target) {
            if (!(target instanceof uri_1.default)) {
                throw errors_1.illegalArgument('target');
            }
            if (!Range.is(range) || range.isEmpty) {
                throw errors_1.illegalArgument('range');
            }
            this.range = range;
            this.target = target;
        }
        return DocumentLink;
    }());
    exports.DocumentLink = DocumentLink;
});

define(__m[11], __M([0,1,13,30,5,57,10]), function (require, exports, severity_1, arrays_1, types, editor_1, uri_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function toSelection(selection) {
        var selectionStartLineNumber = selection.selectionStartLineNumber, selectionStartColumn = selection.selectionStartColumn, positionLineNumber = selection.positionLineNumber, positionColumn = selection.positionColumn;
        var start = new types.Position(selectionStartLineNumber - 1, selectionStartColumn - 1);
        var end = new types.Position(positionLineNumber - 1, positionColumn - 1);
        return new types.Selection(start, end);
    }
    exports.toSelection = toSelection;
    function fromSelection(selection) {
        var anchor = selection.anchor, active = selection.active;
        return {
            selectionStartLineNumber: anchor.line + 1,
            selectionStartColumn: anchor.character + 1,
            positionLineNumber: active.line + 1,
            positionColumn: active.character + 1
        };
    }
    exports.fromSelection = fromSelection;
    function fromRange(range) {
        var start = range.start, end = range.end;
        return {
            startLineNumber: start.line + 1,
            startColumn: start.character + 1,
            endLineNumber: end.line + 1,
            endColumn: end.character + 1
        };
    }
    exports.fromRange = fromRange;
    function toRange(range) {
        var startLineNumber = range.startLineNumber, startColumn = range.startColumn, endLineNumber = range.endLineNumber, endColumn = range.endColumn;
        return new types.Range(startLineNumber - 1, startColumn - 1, endLineNumber - 1, endColumn - 1);
    }
    exports.toRange = toRange;
    function toPosition(position) {
        return new types.Position(position.lineNumber - 1, position.column - 1);
    }
    exports.toPosition = toPosition;
    function fromPosition(position) {
        return { lineNumber: position.line + 1, column: position.character + 1 };
    }
    exports.fromPosition = fromPosition;
    function fromDiagnosticSeverity(value) {
        switch (value) {
            case types.DiagnosticSeverity.Error:
                return severity_1.default.Error;
            case types.DiagnosticSeverity.Warning:
                return severity_1.default.Warning;
            case types.DiagnosticSeverity.Information:
                return severity_1.default.Info;
            case types.DiagnosticSeverity.Hint:
                return severity_1.default.Ignore;
        }
        return severity_1.default.Error;
    }
    exports.fromDiagnosticSeverity = fromDiagnosticSeverity;
    function toDiagnosticSeverty(value) {
        switch (value) {
            case severity_1.default.Info:
                return types.DiagnosticSeverity.Information;
            case severity_1.default.Warning:
                return types.DiagnosticSeverity.Warning;
            case severity_1.default.Error:
                return types.DiagnosticSeverity.Error;
            case severity_1.default.Ignore:
                return types.DiagnosticSeverity.Hint;
        }
        return types.DiagnosticSeverity.Error;
    }
    exports.toDiagnosticSeverty = toDiagnosticSeverty;
    function fromViewColumn(column) {
        var editorColumn = editor_1.Position.LEFT;
        if (typeof column !== 'number') {
        }
        else if (column === types.ViewColumn.Two) {
            editorColumn = editor_1.Position.CENTER;
        }
        else if (column === types.ViewColumn.Three) {
            editorColumn = editor_1.Position.RIGHT;
        }
        return editorColumn;
    }
    exports.fromViewColumn = fromViewColumn;
    function toViewColumn(position) {
        if (typeof position !== 'number') {
            return;
        }
        if (position === editor_1.Position.LEFT) {
            return types.ViewColumn.One;
        }
        else if (position === editor_1.Position.CENTER) {
            return types.ViewColumn.Two;
        }
        else if (position === editor_1.Position.RIGHT) {
            return types.ViewColumn.Three;
        }
    }
    exports.toViewColumn = toViewColumn;
    function isDecorationOptions(something) {
        return (typeof something.range !== 'undefined');
    }
    function isDecorationOptionsArr(something) {
        if (something.length === 0) {
            return true;
        }
        return isDecorationOptions(something[0]) ? true : false;
    }
    function fromRangeOrRangeWithMessage(ranges) {
        if (isDecorationOptionsArr(ranges)) {
            return ranges.map(function (r) {
                return {
                    range: fromRange(r.range),
                    hoverMessage: r.hoverMessage,
                    renderOptions: r.renderOptions
                };
            });
        }
        else {
            return ranges.map(function (r) {
                return {
                    range: fromRange(r)
                };
            });
        }
    }
    exports.fromRangeOrRangeWithMessage = fromRangeOrRangeWithMessage;
    exports.TextEdit = {
        from: function (edit) {
            return {
                text: edit.newText,
                range: fromRange(edit.range)
            };
        },
        to: function (edit) {
            return new types.TextEdit(toRange(edit.range), edit.text);
        }
    };
    var SymbolInformation;
    (function (SymbolInformation) {
        function fromOutlineEntry(entry) {
            return new types.SymbolInformation(entry.name, entry.kind, toRange(entry.location.range), entry.location.uri, entry.containerName);
        }
        SymbolInformation.fromOutlineEntry = fromOutlineEntry;
        function toOutlineEntry(symbol) {
            return {
                name: symbol.name,
                kind: symbol.kind,
                containerName: symbol.containerName,
                location: {
                    uri: symbol.location.uri,
                    range: fromRange(symbol.location.range)
                }
            };
        }
        SymbolInformation.toOutlineEntry = toOutlineEntry;
    })(SymbolInformation = exports.SymbolInformation || (exports.SymbolInformation = {}));
    function fromSymbolInformation(info) {
        return {
            name: info.name,
            type: types.SymbolKind[info.kind || types.SymbolKind.Property].toLowerCase(),
            range: fromRange(info.location.range),
            resourceUri: info.location.uri,
            containerName: info.containerName,
            parameters: '',
        };
    }
    exports.fromSymbolInformation = fromSymbolInformation;
    function toSymbolInformation(bearing) {
        return new types.SymbolInformation(bearing.name, types.SymbolKind[bearing.type.charAt(0).toUpperCase() + bearing.type.substr(1)], toRange(bearing.range), bearing.resourceUri, bearing.containerName);
    }
    exports.toSymbolInformation = toSymbolInformation;
    exports.location = {
        from: function (value) {
            return {
                range: fromRange(value.range),
                uri: value.uri
            };
        },
        to: function (value) {
            return new types.Location(value.uri, toRange(value.range));
        }
    };
    function fromHover(hover) {
        return {
            range: fromRange(hover.range),
            contents: hover.contents
        };
    }
    exports.fromHover = fromHover;
    function toHover(info) {
        return new types.Hover(info.contents, toRange(info.range));
    }
    exports.toHover = toHover;
    function toDocumentHighlight(occurrence) {
        return new types.DocumentHighlight(toRange(occurrence.range), occurrence.kind);
    }
    exports.toDocumentHighlight = toDocumentHighlight;
    exports.CompletionItemKind = {
        from: function (kind) {
            switch (kind) {
                case types.CompletionItemKind.Function: return 'function';
                case types.CompletionItemKind.Constructor: return 'constructor';
                case types.CompletionItemKind.Field: return 'field';
                case types.CompletionItemKind.Variable: return 'variable';
                case types.CompletionItemKind.Class: return 'class';
                case types.CompletionItemKind.Interface: return 'interface';
                case types.CompletionItemKind.Module: return 'module';
                case types.CompletionItemKind.Property: return 'property';
                case types.CompletionItemKind.Unit: return 'unit';
                case types.CompletionItemKind.Value: return 'value';
                case types.CompletionItemKind.Enum: return 'enum';
                case types.CompletionItemKind.Keyword: return 'keyword';
                case types.CompletionItemKind.Snippet: return 'snippet';
                case types.CompletionItemKind.Text: return 'text';
                case types.CompletionItemKind.Color: return 'color';
                case types.CompletionItemKind.File: return 'file';
                case types.CompletionItemKind.Reference: return 'reference';
            }
            return 'property';
        },
        to: function (type) {
            if (!type) {
                return types.CompletionItemKind.Property;
            }
            else {
                return types.CompletionItemKind[type.charAt(0).toUpperCase() + type.substr(1)];
            }
        }
    };
    exports.Suggest = {
        from: function (item) {
            var suggestion = {
                label: item.label,
                codeSnippet: item.insertText || item.label,
                type: exports.CompletionItemKind.from(item.kind),
                typeLabel: item.detail,
                documentationLabel: item.documentation,
                sortText: item.sortText,
                filterText: item.filterText
            };
            return suggestion;
        },
        to: function (container, position, suggestion) {
            var result = new types.CompletionItem(suggestion.label);
            result.insertText = suggestion.codeSnippet;
            result.kind = exports.CompletionItemKind.to(suggestion.type);
            result.detail = suggestion.typeLabel;
            result.documentation = suggestion.documentationLabel;
            result.sortText = suggestion.sortText;
            result.filterText = suggestion.filterText;
            var overwriteBefore = (typeof suggestion.overwriteBefore === 'number') ? suggestion.overwriteBefore : container.currentWord.length;
            var startPosition = new types.Position(position.line, Math.max(0, position.character - overwriteBefore));
            var endPosition = position;
            if (typeof suggestion.overwriteAfter === 'number') {
                endPosition = new types.Position(position.line, position.character + suggestion.overwriteAfter);
            }
            result.textEdit = types.TextEdit.replace(new types.Range(startPosition, endPosition), suggestion.codeSnippet);
            return result;
        }
    };
    var SignatureHelp;
    (function (SignatureHelp) {
        function from(signatureHelp) {
            return signatureHelp;
        }
        SignatureHelp.from = from;
        function to(hints) {
            return hints;
        }
        SignatureHelp.to = to;
    })(SignatureHelp = exports.SignatureHelp || (exports.SignatureHelp = {}));
    var DocumentLink;
    (function (DocumentLink) {
        function from(link) {
            return {
                range: fromRange(link.range),
                url: link.target.toString()
            };
        }
        DocumentLink.from = from;
        function to(link) {
            return new types.DocumentLink(toRange(link.range), uri_1.default.parse(link.url));
        }
        DocumentLink.to = to;
    })(DocumentLink = exports.DocumentLink || (exports.DocumentLink = {}));
    var Command;
    (function (Command) {
        var _delegateId = '_internal_delegate_command';
        var _cache = Object.create(null);
        var _idPool = 1;
        function initialize(commands) {
            return commands.registerCommand(_delegateId, function (id) {
                var command = _cache[id];
                if (!command) {
                    // handle already disposed delegations graceful
                    return;
                }
                return commands.executeCommand.apply(commands, [command.command].concat(command.arguments));
            });
        }
        Command.initialize = initialize;
        function from(command, disposables) {
            if (!command) {
                return;
            }
            var result = {
                id: command.command,
                title: command.title
            };
            if (!arrays_1.isFalsyOrEmpty(command.arguments)) {
                // redirect to delegate command and store actual command
                var id_1 = "delegate/" + _idPool++ + "/for/" + command.command;
                result.id = _delegateId;
                result.arguments = [id_1];
                _cache[id_1] = command;
                disposables.push({
                    dispose: function () {
                        delete _cache[id_1];
                    }
                });
            }
            return result;
        }
        Command.from = from;
        function to(command) {
            var result;
            if (command.id === _delegateId) {
                var key = command.arguments[0];
                result = _cache[key];
            }
            if (!result) {
                result = {
                    command: command.id,
                    title: command.title
                };
            }
            return result;
        }
        Command.to = to;
    })(Command = exports.Command || (exports.Command = {}));
});

define(__m[68], __M([0,1,10,3,11,5]), function (require, exports, uri_1, winjs_base_1, typeConverters, types) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function registerApiCommands(commands) {
        new ExtHostApiCommands(commands).registerCommands();
    }
    exports.registerApiCommands = registerApiCommands;
    var ExtHostApiCommands = (function () {
        function ExtHostApiCommands(commands) {
            this._disposables = [];
            this._commands = commands;
        }
        ExtHostApiCommands.prototype.registerCommands = function () {
            var _this = this;
            this._register('vscode.executeWorkspaceSymbolProvider', this._executeWorkspaceSymbolProvider, {
                description: 'Execute all workspace symbol provider.',
                args: [{ name: 'query', description: 'Search string', constraint: String }],
                returns: 'A promise that resolves to an array of SymbolInformation-instances.'
            });
            this._register('vscode.executeDefinitionProvider', this._executeDefinitionProvider, {
                description: 'Execute all definition provider.',
                args: [
                    { name: 'uri', description: 'Uri of a text document', constraint: uri_1.default },
                    { name: 'position', description: 'Position of a symbol', constraint: types.Position }
                ],
                returns: 'A promise that resolves to an array of Location-instances.'
            });
            this._register('vscode.executeHoverProvider', this._executeHoverProvider, {
                description: 'Execute all hover provider.',
                args: [
                    { name: 'uri', description: 'Uri of a text document', constraint: uri_1.default },
                    { name: 'position', description: 'Position of a symbol', constraint: types.Position }
                ],
                returns: 'A promise that resolves to an array of Hover-instances.'
            });
            this._register('vscode.executeDocumentHighlights', this._executeDocumentHighlights, {
                description: 'Execute document highlight provider.',
                args: [
                    { name: 'uri', description: 'Uri of a text document', constraint: uri_1.default },
                    { name: 'position', description: 'Position in a text document', constraint: types.Position }
                ],
                returns: 'A promise that resolves to an array of DocumentHighlight-instances.'
            });
            this._register('vscode.executeReferenceProvider', this._executeReferenceProvider, {
                description: 'Execute reference provider.',
                args: [
                    { name: 'uri', description: 'Uri of a text document', constraint: uri_1.default },
                    { name: 'position', description: 'Position in a text document', constraint: types.Position }
                ],
                returns: 'A promise that resolves to an array of Location-instances.'
            });
            this._register('vscode.executeDocumentRenameProvider', this._executeDocumentRenameProvider, {
                description: 'Execute rename provider.',
                args: [
                    { name: 'uri', description: 'Uri of a text document', constraint: uri_1.default },
                    { name: 'position', description: 'Position in a text document', constraint: types.Position },
                    { name: 'newName', description: 'The new symbol name', constraint: String }
                ],
                returns: 'A promise that resolves to a WorkspaceEdit.'
            });
            this._register('vscode.executeSignatureHelpProvider', this._executeSignatureHelpProvider, {
                description: 'Execute signature help provider.',
                args: [
                    { name: 'uri', description: 'Uri of a text document', constraint: uri_1.default },
                    { name: 'position', description: 'Position in a text document', constraint: types.Position },
                    { name: 'triggerCharacter', description: '(optional) Trigger signature help when the user types the character, like `,` or `(`', constraint: function (value) { return value === void 0 || typeof value === 'string'; } }
                ],
                returns: 'A promise that resolves to SignatureHelp.'
            });
            this._register('vscode.executeDocumentSymbolProvider', this._executeDocumentSymbolProvider, {
                description: 'Execute document symbol provider.',
                args: [
                    { name: 'uri', description: 'Uri of a text document', constraint: uri_1.default }
                ],
                returns: 'A promise that resolves to an array of SymbolInformation-instances.'
            });
            this._register('vscode.executeCompletionItemProvider', this._executeCompletionItemProvider, {
                description: 'Execute completion item provider.',
                args: [
                    { name: 'uri', description: 'Uri of a text document', constraint: uri_1.default },
                    { name: 'position', description: 'Position in a text document', constraint: types.Position },
                    { name: 'triggerCharacter', description: '(optional) Trigger completion when the user types the character, like `,` or `(`', constraint: function (value) { return value === void 0 || typeof value === 'string'; } }
                ],
                returns: 'A promise that resolves to a CompletionList-instance.'
            });
            this._register('vscode.executeCodeActionProvider', this._executeCodeActionProvider, {
                description: 'Execute code action provider.',
                args: [
                    { name: 'uri', description: 'Uri of a text document', constraint: uri_1.default },
                    { name: 'range', description: 'Range in a text document', constraint: types.Range }
                ],
                returns: 'A promise that resolves to an array of Command-instances.'
            });
            this._register('vscode.executeCodeLensProvider', this._executeCodeLensProvider, {
                description: 'Execute code lens provider.',
                args: [
                    { name: 'uri', description: 'Uri of a text document', constraint: uri_1.default }
                ],
                returns: 'A promise that resolves to an array of CodeLens-instances.'
            });
            this._register('vscode.executeFormatDocumentProvider', this._executeFormatDocumentProvider, {
                description: 'Execute document format provider.',
                args: [
                    { name: 'uri', description: 'Uri of a text document', constraint: uri_1.default },
                    { name: 'options', description: 'Formatting options' }
                ],
                returns: 'A promise that resolves to an array of TextEdits.'
            });
            this._register('vscode.executeFormatRangeProvider', this._executeFormatRangeProvider, {
                description: 'Execute range format provider.',
                args: [
                    { name: 'uri', description: 'Uri of a text document', constraint: uri_1.default },
                    { name: 'range', description: 'Range in a text document', constraint: types.Range },
                    { name: 'options', description: 'Formatting options' }
                ],
                returns: 'A promise that resolves to an array of TextEdits.'
            });
            this._register('vscode.executeFormatOnTypeProvider', this._executeFormatOnTypeProvider, {
                description: 'Execute document format provider.',
                args: [
                    { name: 'uri', description: 'Uri of a text document', constraint: uri_1.default },
                    { name: 'position', description: 'Position in a text document', constraint: types.Position },
                    { name: 'ch', description: 'Character that got typed', constraint: String },
                    { name: 'options', description: 'Formatting options' }
                ],
                returns: 'A promise that resolves to an array of TextEdits.'
            });
            this._register('vscode.executeLinkProvider', this._executeDocumentLinkProvider, {
                description: 'Execute document link provider.',
                args: [
                    { name: 'uri', description: 'Uri of a text document', constraint: uri_1.default }
                ],
                returns: 'A promise that resolves to an array of DocumentLink-instances.'
            });
            this._register('vscode.previewHtml', function (uri, position, label) {
                return _this._commands.executeCommand('_workbench.previewHtml', uri, typeof position === 'number' && typeConverters.fromViewColumn(position), label);
            }, {
                description: "\n\t\t\t\t\tRender the html of the resource in an editor view.\n\n\t\t\t\t\tLinks contained in the document will be handled by VS Code whereby it supports `file`-resources and\n\t\t\t\t\t[virtual](https://github.com/Microsoft/vscode/blob/master/src/vs/vscode.d.ts#L3295)-resources\n\t\t\t\t\tas well as triggering commands using the `command`-scheme. Use the query part of a command-uri to pass along JSON-encoded\n\t\t\t\t\targuments - note that URL-encoding must be applied. The snippet below defines a command-link that calls the _previewHtml_\n\t\t\t\t\tcommand and passes along an uri:\n\t\t\t\t\t```\n\t\t\t\t\tlet href = encodeURI('command:vscode.previewHtml?' + JSON.stringify(someUri));\n\t\t\t\t\tlet html = '<a href=\"' + href + '\">Show Resource...</a>.';\n\t\t\t\t\t```\n\t\t\t\t",
                args: [
                    { name: 'uri', description: 'Uri of the resource to preview.', constraint: function (value) { return value instanceof uri_1.default || typeof value === 'string'; } },
                    { name: 'column', description: '(optional) Column in which to preview.', constraint: function (value) { return typeof value === 'undefined' || (typeof value === 'number' && typeof types.ViewColumn[value] === 'string'); } },
                    { name: 'label', description: '(optional) An human readable string that is used as title for the preview.', constraint: function (v) { return typeof v === 'string' || typeof v === 'undefined'; } }
                ]
            });
            this._register('vscode.openFolder', function (uri, newWindow) {
                if (!uri) {
                    return _this._commands.executeCommand('_workbench.ipc', 'vscode:openFolderPicker', [newWindow]);
                }
                return _this._commands.executeCommand('_workbench.ipc', 'vscode:windowOpen', [[uri.fsPath], newWindow]);
            }, {
                description: 'Open a folder in the current window or new window depending on the newWindow argument. Note that opening in the same window will shutdown the current extension host process and start a new one on the given folder unless the newWindow parameter is set to true.',
                args: [
                    { name: 'uri', description: '(optional) Uri of the folder to open. If not provided, a native dialog will ask the user for the folder', constraint: function (value) { return value === void 0 || value instanceof uri_1.default; } },
                    { name: 'newWindow', description: '(optional) Wether to open the folder in a new window or the same. Defaults to opening in the same window.', constraint: function (value) { return value === void 0 || typeof value === 'boolean'; } }
                ]
            });
            this._register('vscode.startDebug', function (configuration) {
                return _this._commands.executeCommand('_workbench.startDebug', configuration);
            }, {
                description: 'Start a debugging session.',
                args: [
                    { name: 'configuration', description: '(optional) Name of the debug configuration from \'launch.json\' to use. Or a configuration json object to use.' }
                ]
            });
            this._register('vscode.diff', function (left, right, label) {
                return _this._commands.executeCommand('_workbench.diff', [left, right, label]);
            }, {
                description: 'Opens the provided resources in the diff editor to compare their contents.',
                args: [
                    { name: 'left', description: 'Left-hand side resource of the diff editor', constraint: uri_1.default },
                    { name: 'right', description: 'Right-hand side resource of the diff editor', constraint: uri_1.default },
                    { name: 'title', description: '(optional) Human readable title for the diff editor', constraint: function (v) { return v === void 0 || typeof v === 'string'; } }
                ]
            });
            this._register('vscode.open', function (resource, column) {
                return _this._commands.executeCommand('_workbench.open', [resource, typeConverters.fromViewColumn(column)]);
            }, {
                description: 'Opens the provided resource in the editor. Can be a text or binary file, or a http(s) url',
                args: [
                    { name: 'resource', description: 'Resource to open', constraint: uri_1.default },
                    { name: 'column', description: '(optional) Column in which to open', constraint: function (v) { return v === void 0 || typeof v === 'number'; } }
                ]
            });
        };
        // --- command impl
        ExtHostApiCommands.prototype._register = function (id, handler, description) {
            var disposable = this._commands.registerCommand(id, handler, this, description);
            this._disposables.push(disposable);
        };
        /**
         * Execute workspace symbol provider.
         *
         * @param query Search string to match query symbol names
         * @return A promise that resolves to an array of symbol information.
         */
        ExtHostApiCommands.prototype._executeWorkspaceSymbolProvider = function (query) {
            return this._commands.executeCommand('_executeWorkspaceSymbolProvider', { query: query }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(typeConverters.toSymbolInformation);
                }
            });
        };
        ExtHostApiCommands.prototype._executeDefinitionProvider = function (resource, position) {
            var args = {
                resource: resource,
                position: position && typeConverters.fromPosition(position)
            };
            return this._commands.executeCommand('_executeDefinitionProvider', args).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(typeConverters.location.to);
                }
            });
        };
        ExtHostApiCommands.prototype._executeHoverProvider = function (resource, position) {
            var args = {
                resource: resource,
                position: position && typeConverters.fromPosition(position)
            };
            return this._commands.executeCommand('_executeHoverProvider', args).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(typeConverters.toHover);
                }
            });
        };
        ExtHostApiCommands.prototype._executeDocumentHighlights = function (resource, position) {
            var args = {
                resource: resource,
                position: position && typeConverters.fromPosition(position)
            };
            return this._commands.executeCommand('_executeDocumentHighlights', args).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(typeConverters.toDocumentHighlight);
                }
            });
        };
        ExtHostApiCommands.prototype._executeReferenceProvider = function (resource, position) {
            var args = {
                resource: resource,
                position: position && typeConverters.fromPosition(position)
            };
            return this._commands.executeCommand('_executeReferenceProvider', args).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(typeConverters.location.to);
                }
            });
        };
        ExtHostApiCommands.prototype._executeDocumentRenameProvider = function (resource, position, newName) {
            var args = {
                resource: resource,
                position: position && typeConverters.fromPosition(position),
                newName: newName
            };
            return this._commands.executeCommand('_executeDocumentRenameProvider', args).then(function (value) {
                if (!value) {
                    return;
                }
                if (value.rejectReason) {
                    return winjs_base_1.TPromise.wrapError(value.rejectReason);
                }
                var workspaceEdit = new types.WorkspaceEdit();
                for (var _i = 0, _a = value.edits; _i < _a.length; _i++) {
                    var edit = _a[_i];
                    workspaceEdit.replace(edit.resource, typeConverters.toRange(edit.range), edit.newText);
                }
                return workspaceEdit;
            });
        };
        ExtHostApiCommands.prototype._executeSignatureHelpProvider = function (resource, position, triggerCharacter) {
            var args = {
                resource: resource,
                position: position && typeConverters.fromPosition(position),
                triggerCharacter: triggerCharacter
            };
            return this._commands.executeCommand('_executeSignatureHelpProvider', args).then(function (value) {
                if (value) {
                    return typeConverters.SignatureHelp.to(value);
                }
            });
        };
        ExtHostApiCommands.prototype._executeCompletionItemProvider = function (resource, position, triggerCharacter) {
            var args = {
                resource: resource,
                position: position && typeConverters.fromPosition(position),
                triggerCharacter: triggerCharacter
            };
            return this._commands.executeCommand('_executeCompletionItemProvider', args).then(function (values) {
                if (values) {
                    var items = [];
                    var incomplete = void 0;
                    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                        var item = values_1[_i];
                        incomplete = item.container.incomplete || incomplete;
                        items.push(typeConverters.Suggest.to(item.container, position, item.suggestion));
                    }
                    return new types.CompletionList(items, incomplete);
                }
            });
        };
        ExtHostApiCommands.prototype._executeDocumentSymbolProvider = function (resource) {
            var args = {
                resource: resource
            };
            return this._commands.executeCommand('_executeDocumentSymbolProvider', args).then(function (value) {
                if (value && Array.isArray(value.entries)) {
                    return value.entries.map(typeConverters.SymbolInformation.fromOutlineEntry);
                }
            });
        };
        ExtHostApiCommands.prototype._executeCodeActionProvider = function (resource, range) {
            var args = {
                resource: resource,
                range: typeConverters.fromRange(range)
            };
            return this._commands.executeCommand('_executeCodeActionProvider', args).then(function (value) {
                if (!Array.isArray(value)) {
                    return;
                }
                return value.map(function (quickFix) { return typeConverters.Command.to(quickFix.command); });
            });
        };
        ExtHostApiCommands.prototype._executeCodeLensProvider = function (resource) {
            var args = { resource: resource };
            return this._commands.executeCommand('_executeCodeLensProvider', args).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(function (item) {
                        return new types.CodeLens(typeConverters.toRange(item.symbol.range), typeConverters.Command.to(item.symbol.command));
                    });
                }
            });
        };
        ExtHostApiCommands.prototype._executeFormatDocumentProvider = function (resource, options) {
            var args = {
                resource: resource,
                options: options
            };
            return this._commands.executeCommand('_executeFormatDocumentProvider', args).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(function (edit) { return new types.TextEdit(typeConverters.toRange(edit.range), edit.text); });
                }
            });
        };
        ExtHostApiCommands.prototype._executeFormatRangeProvider = function (resource, range, options) {
            var args = {
                resource: resource,
                range: typeConverters.fromRange(range),
                options: options
            };
            return this._commands.executeCommand('_executeFormatRangeProvider', args).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(function (edit) { return new types.TextEdit(typeConverters.toRange(edit.range), edit.text); });
                }
            });
        };
        ExtHostApiCommands.prototype._executeFormatOnTypeProvider = function (resource, position, ch, options) {
            var args = {
                resource: resource,
                position: typeConverters.fromPosition(position),
                ch: ch,
                options: options
            };
            return this._commands.executeCommand('_executeFormatOnTypeProvider', args).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(function (edit) { return new types.TextEdit(typeConverters.toRange(edit.range), edit.text); });
                }
            });
        };
        ExtHostApiCommands.prototype._executeDocumentLinkProvider = function (resource) {
            return this._commands.executeCommand('_executeLinkProvider', resource).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(typeConverters.DocumentLink.to);
                }
            });
        };
        return ExtHostApiCommands;
    }());
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





define(__m[69], __M([0,1,53,14,21,13,3,36,8,44,12,62,63]), function (require, exports, nls, Platform, pfs, severity_1, winjs_base_1, collections_1, paths, json, Types, extensionValidator_1, semver) {
    'use strict';
    var MANIFEST_FILE = 'package.json';
    var devMode = !!process.env['VSCODE_DEV'];
    var nlsConfig = {
        locale: Platform.locale,
        pseudo: Platform.locale === 'pseudo'
    };
    var MessagesCollector = (function () {
        function MessagesCollector() {
            this._messages = [];
        }
        MessagesCollector.prototype.getMessages = function () {
            return this._messages;
        };
        MessagesCollector.prototype._msg = function (source, type, message) {
            this._messages.push({
                type: type,
                message: message,
                source: source
            });
        };
        MessagesCollector.prototype.error = function (source, message) {
            this._msg(source, severity_1.default.Error, message);
        };
        MessagesCollector.prototype.warn = function (source, message) {
            this._msg(source, severity_1.default.Warning, message);
        };
        MessagesCollector.prototype.info = function (source, message) {
            this._msg(source, severity_1.default.Info, message);
        };
        return MessagesCollector;
    }());
    exports.MessagesCollector = MessagesCollector;
    var ExtensionManifestHandler = (function () {
        function ExtensionManifestHandler(ourVersion, collector, absoluteFolderPath, isBuiltin) {
            this._ourVersion = ourVersion;
            this._collector = collector;
            this._absoluteFolderPath = absoluteFolderPath;
            this._isBuiltin = isBuiltin;
            this._absoluteManifestPath = paths.join(absoluteFolderPath, MANIFEST_FILE);
        }
        return ExtensionManifestHandler;
    }());
    var ExtensionManifestParser = (function (_super) {
        __extends(ExtensionManifestParser, _super);
        function ExtensionManifestParser() {
            _super.apply(this, arguments);
        }
        ExtensionManifestParser.prototype.parse = function () {
            var _this = this;
            return pfs.readFile(this._absoluteManifestPath).then(function (manifestContents) {
                var errors = [];
                var extensionDescription = json.parse(manifestContents.toString(), errors);
                if (errors.length > 0) {
                    errors.forEach(function (error) {
                        _this._collector.error(_this._absoluteFolderPath, nls.localize(0, null, _this._absoluteManifestPath, json.getParseErrorMessage(error.error)));
                    });
                    return null;
                }
                return extensionDescription;
            }, function (err) {
                _this._collector.error(_this._absoluteFolderPath, nls.localize(1, null, _this._absoluteManifestPath, err.message));
                return null;
            });
        };
        return ExtensionManifestParser;
    }(ExtensionManifestHandler));
    var ExtensionManifestNLSReplacer = (function (_super) {
        __extends(ExtensionManifestNLSReplacer, _super);
        function ExtensionManifestNLSReplacer() {
            _super.apply(this, arguments);
        }
        ExtensionManifestNLSReplacer.prototype.replaceNLS = function (extensionDescription) {
            var _this = this;
            var extension = paths.extname(this._absoluteManifestPath);
            var basename = this._absoluteManifestPath.substr(0, this._absoluteManifestPath.length - extension.length);
            return pfs.fileExists(basename + '.nls' + extension).then(function (exists) {
                if (!exists) {
                    return extensionDescription;
                }
                return ExtensionManifestNLSReplacer.findMessageBundle(basename).then(function (messageBundle) {
                    if (!messageBundle) {
                        return extensionDescription;
                    }
                    return pfs.readFile(messageBundle).then(function (messageBundleContent) {
                        var errors = [];
                        var messages = json.parse(messageBundleContent.toString(), errors);
                        if (errors.length > 0) {
                            errors.forEach(function (error) {
                                _this._collector.error(_this._absoluteFolderPath, nls.localize(2, null, messageBundle, json.getParseErrorMessage(error.error)));
                            });
                            return extensionDescription;
                        }
                        ExtensionManifestNLSReplacer._replaceNLStrings(extensionDescription, messages, _this._collector, _this._absoluteFolderPath);
                        return extensionDescription;
                    }, function (err) {
                        _this._collector.error(_this._absoluteFolderPath, nls.localize(3, null, messageBundle, err.message));
                        return null;
                    });
                });
            });
        };
        ExtensionManifestNLSReplacer.findMessageBundle = function (basename) {
            return new winjs_base_1.TPromise(function (c, e, p) {
                function loop(basename, locale) {
                    var toCheck = basename + ".nls." + locale + ".json";
                    pfs.fileExists(toCheck).then(function (exists) {
                        if (exists) {
                            c(toCheck);
                        }
                        var index = locale.lastIndexOf('-');
                        if (index === -1) {
                            c(basename + ".nls.json");
                        }
                        else {
                            locale = locale.substring(0, index);
                            loop(basename, locale);
                        }
                    });
                }
                if (devMode || nlsConfig.pseudo || !nlsConfig.locale) {
                    return c(basename + '.nls.json');
                }
                loop(basename, nlsConfig.locale);
            });
        };
        /**
         * This routine make the following assumptions:
         * The root element is a object literal
         * Strings to replace are one values of a key. So for example string[] are ignored.
         * This is done to speed things up.
         */
        ExtensionManifestNLSReplacer._replaceNLStrings = function (literal, messages, collector, messageScope) {
            Object.keys(literal).forEach(function (key) {
                if (literal.hasOwnProperty(key)) {
                    var value = literal[key];
                    if (Types.isString(value)) {
                        var str = value;
                        var length_1 = str.length;
                        if (length_1 > 1 && str[0] === '%' && str[length_1 - 1] === '%') {
                            var messageKey = str.substr(1, length_1 - 2);
                            var message = messages[messageKey];
                            if (message) {
                                if (nlsConfig.pseudo) {
                                    // FF3B and FF3D is the Unicode zenkaku representation for [ and ]
                                    message = '\uFF3B' + message.replace(/[aouei]/g, '$&$&') + '\uFF3D';
                                }
                                literal[key] = message;
                            }
                            else {
                                collector.warn(messageScope, nls.localize(4, null, messageKey));
                            }
                        }
                    }
                    else if (Types.isObject(value)) {
                        ExtensionManifestNLSReplacer._replaceNLStrings(value, messages, collector, messageScope);
                    }
                    else if (Types.isArray(value)) {
                        value.forEach(function (element) {
                            if (Types.isObject(element)) {
                                ExtensionManifestNLSReplacer._replaceNLStrings(element, messages, collector, messageScope);
                            }
                        });
                    }
                }
            });
        };
        return ExtensionManifestNLSReplacer;
    }(ExtensionManifestHandler));
    var ExtensionManifestValidator = (function (_super) {
        __extends(ExtensionManifestValidator, _super);
        function ExtensionManifestValidator() {
            _super.apply(this, arguments);
        }
        ExtensionManifestValidator.prototype.validate = function (extensionDescription) {
            var _this = this;
            extensionDescription.isBuiltin = this._isBuiltin;
            var notices = [];
            if (!extensionValidator_1.isValidExtensionDescription(this._ourVersion, this._absoluteFolderPath, extensionDescription, notices)) {
                notices.forEach(function (error) {
                    _this._collector.error(_this._absoluteFolderPath, error);
                });
                return null;
            }
            // in this case the notices are warnings
            notices.forEach(function (error) {
                _this._collector.warn(_this._absoluteFolderPath, error);
            });
            // id := `publisher.name`
            extensionDescription.id = extensionDescription.publisher + "." + extensionDescription.name;
            // main := absolutePath(`main`)
            if (extensionDescription.main) {
                extensionDescription.main = paths.normalize(paths.join(this._absoluteFolderPath, extensionDescription.main));
            }
            extensionDescription.extensionFolderPath = this._absoluteFolderPath;
            return extensionDescription;
        };
        return ExtensionManifestValidator;
    }(ExtensionManifestHandler));
    var ExtensionScanner = (function () {
        function ExtensionScanner() {
        }
        /**
         * Read the extension defined in `absoluteFolderPath`
         */
        ExtensionScanner.scanExtension = function (version, collector, absoluteFolderPath, isBuiltin) {
            absoluteFolderPath = paths.normalize(absoluteFolderPath);
            var parser = new ExtensionManifestParser(version, collector, absoluteFolderPath, isBuiltin);
            return parser.parse().then(function (extensionDescription) {
                if (extensionDescription === null) {
                    return null;
                }
                var nlsReplacer = new ExtensionManifestNLSReplacer(version, collector, absoluteFolderPath, isBuiltin);
                return nlsReplacer.replaceNLS(extensionDescription);
            }).then(function (extensionDescription) {
                if (extensionDescription === null) {
                    return null;
                }
                var validator = new ExtensionManifestValidator(version, collector, absoluteFolderPath, isBuiltin);
                return validator.validate(extensionDescription);
            });
        };
        /**
         * Scan a list of extensions defined in `absoluteFolderPath`
         */
        ExtensionScanner.scanExtensions = function (version, collector, absoluteFolderPath, isBuiltin) {
            var _this = this;
            var obsolete = winjs_base_1.TPromise.as({});
            if (!isBuiltin) {
                obsolete = pfs.readFile(paths.join(absoluteFolderPath, '.obsolete'), 'utf8')
                    .then(function (raw) { return JSON.parse(raw); })
                    .then(null, function (err) { return ({}); });
            }
            return obsolete.then(function (obsolete) {
                return pfs.readDirsInDir(absoluteFolderPath)
                    .then(function (folders) { return winjs_base_1.TPromise.join(folders.map(function (f) { return _this.scanExtension(version, collector, paths.join(absoluteFolderPath, f), isBuiltin); })); })
                    .then(function (extensionDescriptions) { return extensionDescriptions.filter(function (item) { return item !== null; }); })
                    .then(function (extensionDescriptions) { return extensionDescriptions.filter(function (p) { return !obsolete[(p.publisher + "." + p.name + "-" + p.version)]; }); })
                    .then(function (extensionDescriptions) {
                    var extensionDescriptionsById = collections_1.values(collections_1.groupBy(extensionDescriptions, function (p) { return p.id; }));
                    return extensionDescriptionsById.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.version, b.version); })[0]; });
                })
                    .then(null, function (err) {
                    collector.error(absoluteFolderPath, err);
                    return [];
                });
            });
        };
        /**
         * Combination of scanExtension and scanExtensions: If an extension manifest is found at root, we load just this extension,
         * otherwise we assume the folder contains multiple extensions.
         */
        ExtensionScanner.scanOneOrMultipleExtensions = function (version, collector, absoluteFolderPath, isBuiltin) {
            var _this = this;
            return pfs.fileExists(paths.join(absoluteFolderPath, MANIFEST_FILE)).then(function (exists) {
                if (exists) {
                    return _this.scanExtension(version, collector, absoluteFolderPath, isBuiltin).then(function (extensionDescription) {
                        if (extensionDescription === null) {
                            return [];
                        }
                        return [extensionDescription];
                    });
                }
                return _this.scanExtensions(version, collector, absoluteFolderPath, isBuiltin);
            }, function (err) {
                collector.error(absoluteFolderPath, err);
                return [];
            });
        };
        return ExtensionScanner;
    }());
    exports.ExtensionScanner = ExtensionScanner;
});

define(__m[70], __M([0,1]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // declare var Proxy:any; // TODO@TypeScript
    var AbstractThreadService = (function () {
        function AbstractThreadService(isMain) {
            this._proxies = Object.create(null);
            this._isMain = isMain;
            this._locals = Object.create(null);
            this._proxies = Object.create(null);
        }
        AbstractThreadService.prototype.handle = function (rpcId, methodName, args) {
            if (!this._locals[rpcId]) {
                throw new Error('Unknown actor ' + rpcId);
            }
            var actor = this._locals[rpcId];
            var method = actor[methodName];
            if (typeof method !== 'function') {
                throw new Error('Unknown method ' + methodName + ' on actor ' + rpcId);
            }
            return method.apply(actor, args);
        };
        AbstractThreadService.prototype.get = function (identifier) {
            if (!this._proxies[identifier.id]) {
                this._proxies[identifier.id] = this._createProxy(identifier.id, identifier.methodNames);
            }
            return this._proxies[identifier.id];
        };
        AbstractThreadService.prototype._createProxy = function (id, methodNames) {
            // Check below how to switch to native proxies
            var result = {};
            for (var i = 0; i < methodNames.length; i++) {
                var methodName = methodNames[i];
                result[methodName] = this.createMethodProxy(id, methodName);
            }
            return result;
            // let handler = {
            // 	get: (target, name) => {
            // 		return (...myArgs: any[]) => {
            // 			return this._callOnRemote(id, name, myArgs);
            // 		};
            // 	}
            // };
            // return new Proxy({}, handler);
        };
        AbstractThreadService.prototype.createMethodProxy = function (id, methodName) {
            var _this = this;
            return function () {
                var myArgs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    myArgs[_i - 0] = arguments[_i];
                }
                return _this._callOnRemote(id, methodName, myArgs);
            };
        };
        AbstractThreadService.prototype.set = function (identifier, value) {
            if (identifier.isMain !== this._isMain) {
                throw new Error('Mismatch in object registration!');
            }
            this._locals[identifier.id] = value;
        };
        return AbstractThreadService;
    }());
    exports.AbstractThreadService = AbstractThreadService;
});






define(__m[71], __M([0,1,70]), function (require, exports, abstractThreadService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ExtHostThreadService = (function (_super) {
        __extends(ExtHostThreadService, _super);
        function ExtHostThreadService(remoteCom) {
            _super.call(this, false);
            this._remoteCom = remoteCom;
            this._remoteCom.setManyHandler(this);
        }
        ExtHostThreadService.prototype._callOnRemote = function (proxyId, path, args) {
            return this._remoteCom.callOnRemote(proxyId, path, args);
        };
        return ExtHostThreadService;
    }(abstractThreadService_1.AbstractThreadService));
    exports.ExtHostThreadService = ExtHostThreadService;
});

define(__m[72], __M([0,1,19]), function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IThreadService = instantiation_1.createDecorator('threadService');
    var ProxyIdentifier = (function () {
        function ProxyIdentifier(isMain, id, ctor) {
            this.isMain = isMain;
            this.id = id;
            this.methodNames = [];
            for (var prop in ctor.prototype) {
                if (typeof ctor.prototype[prop] === 'function') {
                    this.methodNames.push(prop);
                }
            }
        }
        return ProxyIdentifier;
    }());
    exports.ProxyIdentifier = ProxyIdentifier;
    function createMainContextProxyIdentifier(identifier, ctor) {
        return new ProxyIdentifier(true, 'm' + identifier, ctor);
    }
    exports.createMainContextProxyIdentifier = createMainContextProxyIdentifier;
    function createExtHostContextProxyIdentifier(identifier, ctor) {
        return new ProxyIdentifier(false, 'e' + identifier, ctor);
    }
    exports.createExtHostContextProxyIdentifier = createExtHostContextProxyIdentifier;
});

define(__m[2], __M([0,1,72]), function (require, exports, threadService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var InstanceCollection = (function () {
        function InstanceCollection() {
            this._items = Object.create(null);
        }
        InstanceCollection.prototype.define = function (id) {
            var that = this;
            return new (function () {
                function class_1() {
                }
                class_1.prototype.set = function (value) {
                    that._set(id, value);
                    return value;
                };
                return class_1;
            }());
        };
        InstanceCollection.prototype._set = function (id, value) {
            this._items[id.id] = value;
        };
        InstanceCollection.prototype.finish = function (isMain, threadService) {
            var _this = this;
            var expected = (isMain ? exports.MainContext : exports.ExtHostContext);
            Object.keys(expected).forEach(function (key) {
                var id = expected[key];
                var value = _this._items[id.id];
                if (!value) {
                    throw new Error("Missing actor " + key + " (isMain: " + id.isMain + ", id:  " + id.id + ")");
                }
                threadService.set(id, value);
            });
        };
        return InstanceCollection;
    }());
    exports.InstanceCollection = InstanceCollection;
    function ni() { return new Error('Not implemented'); }
    // --- main thread
    var MainThreadCommandsShape = (function () {
        function MainThreadCommandsShape() {
        }
        MainThreadCommandsShape.prototype.$registerCommand = function (id) { throw ni(); };
        MainThreadCommandsShape.prototype.$executeCommand = function (id, args) { throw ni(); };
        MainThreadCommandsShape.prototype.$getCommands = function () { throw ni(); };
        return MainThreadCommandsShape;
    }());
    exports.MainThreadCommandsShape = MainThreadCommandsShape;
    var MainThreadDiagnosticsShape = (function () {
        function MainThreadDiagnosticsShape() {
        }
        MainThreadDiagnosticsShape.prototype.$changeMany = function (owner, entries) { throw ni(); };
        MainThreadDiagnosticsShape.prototype.$clear = function (owner) { throw ni(); };
        return MainThreadDiagnosticsShape;
    }());
    exports.MainThreadDiagnosticsShape = MainThreadDiagnosticsShape;
    var MainThreadDocumentsShape = (function () {
        function MainThreadDocumentsShape() {
        }
        MainThreadDocumentsShape.prototype.$tryOpenDocument = function (uri) { throw ni(); };
        MainThreadDocumentsShape.prototype.$registerTextContentProvider = function (handle, scheme) { throw ni(); };
        MainThreadDocumentsShape.prototype.$onVirtualDocumentChange = function (uri, value) { throw ni(); };
        MainThreadDocumentsShape.prototype.$unregisterTextContentProvider = function (handle) { throw ni(); };
        MainThreadDocumentsShape.prototype.$trySaveDocument = function (uri) { throw ni(); };
        return MainThreadDocumentsShape;
    }());
    exports.MainThreadDocumentsShape = MainThreadDocumentsShape;
    var MainThreadEditorsShape = (function () {
        function MainThreadEditorsShape() {
        }
        MainThreadEditorsShape.prototype.$tryShowTextDocument = function (resource, position, preserveFocus) { throw ni(); };
        MainThreadEditorsShape.prototype.$registerTextEditorDecorationType = function (key, options) { throw ni(); };
        MainThreadEditorsShape.prototype.$removeTextEditorDecorationType = function (key) { throw ni(); };
        MainThreadEditorsShape.prototype.$tryShowEditor = function (id, position) { throw ni(); };
        MainThreadEditorsShape.prototype.$tryHideEditor = function (id) { throw ni(); };
        MainThreadEditorsShape.prototype.$trySetOptions = function (id, options) { throw ni(); };
        MainThreadEditorsShape.prototype.$trySetDecorations = function (id, key, ranges) { throw ni(); };
        MainThreadEditorsShape.prototype.$tryRevealRange = function (id, range, revealType) { throw ni(); };
        MainThreadEditorsShape.prototype.$trySetSelections = function (id, selections) { throw ni(); };
        MainThreadEditorsShape.prototype.$tryApplyEdits = function (id, modelVersionId, edits, setEndOfLine) { throw ni(); };
        return MainThreadEditorsShape;
    }());
    exports.MainThreadEditorsShape = MainThreadEditorsShape;
    var MainThreadErrorsShape = (function () {
        function MainThreadErrorsShape() {
        }
        MainThreadErrorsShape.prototype.onUnexpectedExtHostError = function (err) { throw ni(); };
        return MainThreadErrorsShape;
    }());
    exports.MainThreadErrorsShape = MainThreadErrorsShape;
    var MainThreadLanguageFeaturesShape = (function () {
        function MainThreadLanguageFeaturesShape() {
        }
        MainThreadLanguageFeaturesShape.prototype.$unregister = function (handle) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerOutlineSupport = function (handle, selector) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerCodeLensSupport = function (handle, selector) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerDeclaractionSupport = function (handle, selector) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerHoverProvider = function (handle, selector) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerDocumentHighlightProvider = function (handle, selector) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerReferenceSupport = function (handle, selector) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerQuickFixSupport = function (handle, selector) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerDocumentFormattingSupport = function (handle, selector) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerRangeFormattingSupport = function (handle, selector) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerOnTypeFormattingSupport = function (handle, selector, autoFormatTriggerCharacters) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerNavigateTypeSupport = function (handle) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerRenameSupport = function (handle, selector) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerSuggestSupport = function (handle, selector, triggerCharacters) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerSignatureHelpProvider = function (handle, selector, triggerCharacter) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$registerDocumentLinkProvider = function (handle, selector) { throw ni(); };
        MainThreadLanguageFeaturesShape.prototype.$setLanguageConfiguration = function (handle, languageId, configuration) { throw ni(); };
        return MainThreadLanguageFeaturesShape;
    }());
    exports.MainThreadLanguageFeaturesShape = MainThreadLanguageFeaturesShape;
    var MainThreadLanguagesShape = (function () {
        function MainThreadLanguagesShape() {
        }
        MainThreadLanguagesShape.prototype.$getLanguages = function () { throw ni(); };
        return MainThreadLanguagesShape;
    }());
    exports.MainThreadLanguagesShape = MainThreadLanguagesShape;
    var MainThreadMessageServiceShape = (function () {
        function MainThreadMessageServiceShape() {
        }
        MainThreadMessageServiceShape.prototype.$showMessage = function (severity, message, commands) { throw ni(); };
        return MainThreadMessageServiceShape;
    }());
    exports.MainThreadMessageServiceShape = MainThreadMessageServiceShape;
    var MainThreadOutputServiceShape = (function () {
        function MainThreadOutputServiceShape() {
        }
        MainThreadOutputServiceShape.prototype.$append = function (channelId, label, value) { throw ni(); };
        MainThreadOutputServiceShape.prototype.$clear = function (channelId, label) { throw ni(); };
        MainThreadOutputServiceShape.prototype.$reveal = function (channelId, label, preserveFocus) { throw ni(); };
        MainThreadOutputServiceShape.prototype.$close = function (channelId) { throw ni(); };
        return MainThreadOutputServiceShape;
    }());
    exports.MainThreadOutputServiceShape = MainThreadOutputServiceShape;
    var MainThreadQuickOpenShape = (function () {
        function MainThreadQuickOpenShape() {
        }
        MainThreadQuickOpenShape.prototype.$show = function (options) { throw ni(); };
        MainThreadQuickOpenShape.prototype.$setItems = function (items) { throw ni(); };
        MainThreadQuickOpenShape.prototype.$setError = function (error) { throw ni(); };
        MainThreadQuickOpenShape.prototype.$input = function (options, validateInput) { throw ni(); };
        return MainThreadQuickOpenShape;
    }());
    exports.MainThreadQuickOpenShape = MainThreadQuickOpenShape;
    var MainThreadStatusBarShape = (function () {
        function MainThreadStatusBarShape() {
        }
        MainThreadStatusBarShape.prototype.$setEntry = function (id, text, tooltip, command, color, alignment, priority) { throw ni(); };
        MainThreadStatusBarShape.prototype.$dispose = function (id) { throw ni(); };
        return MainThreadStatusBarShape;
    }());
    exports.MainThreadStatusBarShape = MainThreadStatusBarShape;
    var MainThreadStorageShape = (function () {
        function MainThreadStorageShape() {
        }
        MainThreadStorageShape.prototype.$getValue = function (shared, key) { throw ni(); };
        MainThreadStorageShape.prototype.$setValue = function (shared, key, value) { throw ni(); };
        return MainThreadStorageShape;
    }());
    exports.MainThreadStorageShape = MainThreadStorageShape;
    var MainThreadTelemetryShape = (function () {
        function MainThreadTelemetryShape() {
        }
        MainThreadTelemetryShape.prototype.$publicLog = function (eventName, data) { throw ni(); };
        MainThreadTelemetryShape.prototype.$getTelemetryInfo = function () { throw ni(); };
        return MainThreadTelemetryShape;
    }());
    exports.MainThreadTelemetryShape = MainThreadTelemetryShape;
    var MainThreadWorkspaceShape = (function () {
        function MainThreadWorkspaceShape() {
        }
        MainThreadWorkspaceShape.prototype.$startSearch = function (include, exclude, maxResults, requestId) { throw ni(); };
        MainThreadWorkspaceShape.prototype.$cancelSearch = function (requestId) { throw ni(); };
        MainThreadWorkspaceShape.prototype.$saveAll = function (includeUntitled) { throw ni(); };
        MainThreadWorkspaceShape.prototype.$applyWorkspaceEdit = function (edits) { throw ni(); };
        return MainThreadWorkspaceShape;
    }());
    exports.MainThreadWorkspaceShape = MainThreadWorkspaceShape;
    var MainProcessExtensionServiceShape = (function () {
        function MainProcessExtensionServiceShape() {
        }
        MainProcessExtensionServiceShape.prototype.$onExtensionHostReady = function (extensionDescriptions, messages) { throw ni(); };
        MainProcessExtensionServiceShape.prototype.$localShowMessage = function (severity, msg) { throw ni(); };
        MainProcessExtensionServiceShape.prototype.$onExtensionActivated = function (extensionId) { throw ni(); };
        MainProcessExtensionServiceShape.prototype.$onExtensionActivationFailed = function (extensionId) { throw ni(); };
        return MainProcessExtensionServiceShape;
    }());
    exports.MainProcessExtensionServiceShape = MainProcessExtensionServiceShape;
    // -- extension host
    var ExtHostCommandsShape = (function () {
        function ExtHostCommandsShape() {
        }
        ExtHostCommandsShape.prototype.$executeContributedCommand = function (id) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            throw ni();
        };
        ExtHostCommandsShape.prototype.$getContributedCommandHandlerDescriptions = function () { throw ni(); };
        return ExtHostCommandsShape;
    }());
    exports.ExtHostCommandsShape = ExtHostCommandsShape;
    var ExtHostConfigurationShape = (function () {
        function ExtHostConfigurationShape() {
        }
        ExtHostConfigurationShape.prototype.$acceptConfigurationChanged = function (config) { throw ni(); };
        return ExtHostConfigurationShape;
    }());
    exports.ExtHostConfigurationShape = ExtHostConfigurationShape;
    var ExtHostDiagnosticsShape = (function () {
        function ExtHostDiagnosticsShape() {
        }
        return ExtHostDiagnosticsShape;
    }());
    exports.ExtHostDiagnosticsShape = ExtHostDiagnosticsShape;
    var ExtHostDocumentsShape = (function () {
        function ExtHostDocumentsShape() {
        }
        ExtHostDocumentsShape.prototype.$provideTextDocumentContent = function (handle, uri) { throw ni(); };
        ExtHostDocumentsShape.prototype.$acceptModelAdd = function (initData) { throw ni(); };
        ExtHostDocumentsShape.prototype.$acceptModelModeChanged = function (strURL, oldModeId, newModeId) { throw ni(); };
        ExtHostDocumentsShape.prototype.$acceptModelSaved = function (strURL) { throw ni(); };
        ExtHostDocumentsShape.prototype.$acceptModelDirty = function (strURL) { throw ni(); };
        ExtHostDocumentsShape.prototype.$acceptModelReverted = function (strURL) { throw ni(); };
        ExtHostDocumentsShape.prototype.$acceptModelRemoved = function (strURL) { throw ni(); };
        ExtHostDocumentsShape.prototype.$acceptModelChanged = function (strURL, events) { throw ni(); };
        return ExtHostDocumentsShape;
    }());
    exports.ExtHostDocumentsShape = ExtHostDocumentsShape;
    var ExtHostEditorsShape = (function () {
        function ExtHostEditorsShape() {
        }
        ExtHostEditorsShape.prototype.$acceptTextEditorAdd = function (data) { throw ni(); };
        ExtHostEditorsShape.prototype.$acceptOptionsChanged = function (id, opts) { throw ni(); };
        ExtHostEditorsShape.prototype.$acceptSelectionsChanged = function (id, event) { throw ni(); };
        ExtHostEditorsShape.prototype.$acceptActiveEditorAndVisibleEditors = function (id, visibleIds) { throw ni(); };
        ExtHostEditorsShape.prototype.$acceptEditorPositionData = function (data) { throw ni(); };
        ExtHostEditorsShape.prototype.$acceptTextEditorRemove = function (id) { throw ni(); };
        return ExtHostEditorsShape;
    }());
    exports.ExtHostEditorsShape = ExtHostEditorsShape;
    var ExtHostExtensionServiceShape = (function () {
        function ExtHostExtensionServiceShape() {
        }
        ExtHostExtensionServiceShape.prototype.$localShowMessage = function (severity, msg) { throw ni(); };
        ExtHostExtensionServiceShape.prototype.$activateExtension = function (extensionDescription) { throw ni(); };
        return ExtHostExtensionServiceShape;
    }());
    exports.ExtHostExtensionServiceShape = ExtHostExtensionServiceShape;
    var ExtHostFileSystemEventServiceShape = (function () {
        function ExtHostFileSystemEventServiceShape() {
        }
        ExtHostFileSystemEventServiceShape.prototype.$onFileEvent = function (events) { throw ni(); };
        return ExtHostFileSystemEventServiceShape;
    }());
    exports.ExtHostFileSystemEventServiceShape = ExtHostFileSystemEventServiceShape;
    var ExtHostLanguageFeaturesShape = (function () {
        function ExtHostLanguageFeaturesShape() {
        }
        ExtHostLanguageFeaturesShape.prototype.$provideDocumentSymbols = function (handle, resource) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$provideCodeLenses = function (handle, resource) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$resolveCodeLens = function (handle, resource, symbol) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$provideDefinition = function (handle, resource, position) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$provideHover = function (handle, resource, position) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$provideDocumentHighlights = function (handle, resource, position) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$provideReferences = function (handle, resource, position, context) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$provideCodeActions = function (handle, resource, range) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$provideDocumentFormattingEdits = function (handle, resource, options) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$provideDocumentRangeFormattingEdits = function (handle, resource, range, options) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$provideOnTypeFormattingEdits = function (handle, resource, position, ch, options) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$getNavigateToItems = function (handle, search) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$provideRenameEdits = function (handle, resource, position, newName) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$provideCompletionItems = function (handle, resource, position) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$resolveCompletionItem = function (handle, resource, position, suggestion) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$provideSignatureHelp = function (handle, resource, position) { throw ni(); };
        ExtHostLanguageFeaturesShape.prototype.$providDocumentLinks = function (handle, resource) { throw ni(); };
        return ExtHostLanguageFeaturesShape;
    }());
    exports.ExtHostLanguageFeaturesShape = ExtHostLanguageFeaturesShape;
    var ExtHostQuickOpenShape = (function () {
        function ExtHostQuickOpenShape() {
        }
        ExtHostQuickOpenShape.prototype.$onItemSelected = function (handle) { throw ni(); };
        ExtHostQuickOpenShape.prototype.$validateInput = function (input) { throw ni(); };
        return ExtHostQuickOpenShape;
    }());
    exports.ExtHostQuickOpenShape = ExtHostQuickOpenShape;
    // --- proxy identifiers
    exports.MainContext = {
        MainThreadCommands: threadService_1.createMainContextProxyIdentifier('MainThreadCommands', MainThreadCommandsShape),
        MainThreadDiagnostics: threadService_1.createMainContextProxyIdentifier('MainThreadDiagnostics', MainThreadDiagnosticsShape),
        MainThreadDocuments: threadService_1.createMainContextProxyIdentifier('MainThreadDocuments', MainThreadDocumentsShape),
        MainThreadEditors: threadService_1.createMainContextProxyIdentifier('MainThreadEditors', MainThreadEditorsShape),
        MainThreadErrors: threadService_1.createMainContextProxyIdentifier('MainThreadErrors', MainThreadErrorsShape),
        MainThreadLanguageFeatures: threadService_1.createMainContextProxyIdentifier('MainThreadLanguageFeatures', MainThreadLanguageFeaturesShape),
        MainThreadLanguages: threadService_1.createMainContextProxyIdentifier('MainThreadLanguages', MainThreadLanguagesShape),
        MainThreadMessageService: threadService_1.createMainContextProxyIdentifier('MainThreadMessageService', MainThreadMessageServiceShape),
        MainThreadOutputService: threadService_1.createMainContextProxyIdentifier('MainThreadOutputService', MainThreadOutputServiceShape),
        MainThreadQuickOpen: threadService_1.createMainContextProxyIdentifier('MainThreadQuickOpen', MainThreadQuickOpenShape),
        MainThreadStatusBar: threadService_1.createMainContextProxyIdentifier('MainThreadStatusBar', MainThreadStatusBarShape),
        MainThreadStorage: threadService_1.createMainContextProxyIdentifier('MainThreadStorage', MainThreadStorageShape),
        MainThreadTelemetry: threadService_1.createMainContextProxyIdentifier('MainThreadTelemetry', MainThreadTelemetryShape),
        MainThreadWorkspace: threadService_1.createMainContextProxyIdentifier('MainThreadWorkspace', MainThreadWorkspaceShape),
        MainProcessExtensionService: threadService_1.createMainContextProxyIdentifier('MainProcessExtensionService', MainProcessExtensionServiceShape),
    };
    exports.ExtHostContext = {
        ExtHostCommands: threadService_1.createExtHostContextProxyIdentifier('ExtHostCommands', ExtHostCommandsShape),
        ExtHostConfiguration: threadService_1.createExtHostContextProxyIdentifier('ExtHostConfiguration', ExtHostConfigurationShape),
        ExtHostDiagnostics: threadService_1.createExtHostContextProxyIdentifier('ExtHostDiagnostics', ExtHostDiagnosticsShape),
        ExtHostDocuments: threadService_1.createExtHostContextProxyIdentifier('ExtHostDocuments', ExtHostDocumentsShape),
        ExtHostEditors: threadService_1.createExtHostContextProxyIdentifier('ExtHostEditors', ExtHostEditorsShape),
        ExtHostFileSystemEventService: threadService_1.createExtHostContextProxyIdentifier('ExtHostFileSystemEventService', ExtHostFileSystemEventServiceShape),
        ExtHostLanguageFeatures: threadService_1.createExtHostContextProxyIdentifier('ExtHostLanguageFeatures', ExtHostLanguageFeaturesShape),
        ExtHostQuickOpen: threadService_1.createExtHostContextProxyIdentifier('ExtHostQuickOpen', ExtHostQuickOpenShape),
        ExtHostExtensionService: threadService_1.createExtHostContextProxyIdentifier('ExtHostExtensionService', ExtHostExtensionServiceShape),
    };
});






define(__m[74], __M([0,1,12,3,5,11,18,2]), function (require, exports, types_1, winjs_base_1, extHostTypes, extHostTypeConverter, objects_1, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ExtHostCommands = (function (_super) {
        __extends(ExtHostCommands, _super);
        function ExtHostCommands(threadService, extHostEditors) {
            _super.call(this);
            this._commands = Object.create(null);
            this._extHostEditors = extHostEditors;
            this._proxy = threadService.get(extHost_protocol_1.MainContext.MainThreadCommands);
        }
        ExtHostCommands.prototype.registerCommand = function (id, callback, thisArg, description) {
            var _this = this;
            if (!id.trim().length) {
                throw new Error('invalid id');
            }
            if (this._commands[id]) {
                throw new Error('command with id already exists');
            }
            this._commands[id] = { callback: callback, thisArg: thisArg, description: description };
            this._proxy.$registerCommand(id);
            return new extHostTypes.Disposable(function () { return delete _this._commands[id]; });
        };
        ExtHostCommands.prototype.executeCommand = function (id) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this._commands[id]) {
                // we stay inside the extension host and support
                // to pass any kind of parameters around
                return this.$executeContributedCommand.apply(this, [id].concat(args));
            }
            else {
                // automagically convert some argument types
                args = objects_1.cloneAndChange(args, function (value) {
                    if (value instanceof extHostTypes.Position) {
                        return extHostTypeConverter.fromPosition(value);
                    }
                    if (value instanceof extHostTypes.Range) {
                        return extHostTypeConverter.fromRange(value);
                    }
                    if (value instanceof extHostTypes.Location) {
                        return extHostTypeConverter.location.from(value);
                    }
                    if (!Array.isArray(value)) {
                        return value;
                    }
                });
                return this._proxy.$executeCommand(id, args);
            }
        };
        ExtHostCommands.prototype.$executeContributedCommand = function (id) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var command = this._commands[id];
            if (!command) {
                return Promise.reject("Contributed command '" + id + "' does not exist.");
            }
            var callback = command.callback, thisArg = command.thisArg, description = command.description;
            if (description) {
                for (var i = 0; i < description.args.length; i++) {
                    try {
                        types_1.validateConstraint(args[i], description.args[i].constraint);
                    }
                    catch (err) {
                        return Promise.reject("Running the contributed command:'" + id + "' failed. Illegal argument '" + description.args[i].name + "' - " + description.args[i].description);
                    }
                }
            }
            try {
                var result = callback.apply(thisArg, args);
                return Promise.resolve(result);
            }
            catch (err) {
                // console.log(err);
                // try {
                // 	console.log(toErrorMessage(err));
                // } catch (err) {
                // 	//
                // }
                return Promise.reject("Running the contributed command:'" + id + "' failed.");
            }
        };
        ExtHostCommands.prototype.getCommands = function (filterUnderscoreCommands) {
            if (filterUnderscoreCommands === void 0) { filterUnderscoreCommands = false; }
            return this._proxy.$getCommands().then(function (result) {
                if (filterUnderscoreCommands) {
                    result = result.filter(function (command) { return command[0] !== '_'; });
                }
                return result;
            });
        };
        ExtHostCommands.prototype.$getContributedCommandHandlerDescriptions = function () {
            var result = Object.create(null);
            for (var id in this._commands) {
                var description = this._commands[id].description;
                if (description) {
                    result[id] = description;
                }
            }
            return winjs_base_1.TPromise.as(result);
        };
        return ExtHostCommands;
    }(extHost_protocol_1.ExtHostCommandsShape));
    exports.ExtHostCommands = ExtHostCommands;
});






define(__m[75], __M([0,1,18,4,6,2]), function (require, exports, objects_1, errors_1, event_1, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ExtHostConfiguration = (function (_super) {
        __extends(ExtHostConfiguration, _super);
        function ExtHostConfiguration() {
            _super.call(this);
            this._onDidChangeConfiguration = new event_1.Emitter();
        }
        Object.defineProperty(ExtHostConfiguration.prototype, "onDidChangeConfiguration", {
            get: function () {
                return this._onDidChangeConfiguration && this._onDidChangeConfiguration.event;
            },
            enumerable: true,
            configurable: true
        });
        ExtHostConfiguration.prototype.$acceptConfigurationChanged = function (config) {
            this._config = config;
            this._hasConfig = true;
            this._onDidChangeConfiguration.fire(undefined);
        };
        ExtHostConfiguration.prototype.getConfiguration = function (section) {
            if (!this._hasConfig) {
                throw errors_1.illegalState('missing config');
            }
            var config = section
                ? ExtHostConfiguration._lookUp(section, this._config)
                : this._config;
            var result;
            if (typeof config !== 'object') {
                // this catches missing config and accessing values
                result = {};
            }
            else {
                result = objects_1.clone(config);
            }
            result.has = function (key) {
                return typeof ExtHostConfiguration._lookUp(key, config) !== 'undefined';
            };
            result.get = function (key, defaultValue) {
                var result = ExtHostConfiguration._lookUp(key, config);
                if (typeof result === 'undefined') {
                    result = defaultValue;
                }
                return result;
            };
            return result;
        };
        ExtHostConfiguration._lookUp = function (section, config) {
            if (!section) {
                return;
            }
            var parts = section.split('.');
            var node = config;
            while (node && parts.length) {
                node = node[parts.shift()];
            }
            return node;
        };
        return ExtHostConfiguration;
    }(extHost_protocol_1.ExtHostConfigurationShape));
    exports.ExtHostConfiguration = ExtHostConfiguration;
});






define(__m[76], __M([0,1,10,13,2]), function (require, exports, uri_1, severity_1, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var DiagnosticCollection = (function () {
        function DiagnosticCollection(name, proxy) {
            this._isDisposed = false;
            this._data = Object.create(null);
            this._name = name;
            this._proxy = proxy;
        }
        DiagnosticCollection.prototype.dispose = function () {
            if (!this._isDisposed) {
                this._proxy.$clear(this.name);
                this._proxy = undefined;
                this._data = undefined;
                this._isDisposed = true;
            }
        };
        Object.defineProperty(DiagnosticCollection.prototype, "name", {
            get: function () {
                this._checkDisposed();
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        DiagnosticCollection.prototype.set = function (first, diagnostics) {
            if (!first) {
                // this set-call is a clear-call
                this.clear();
                return;
            }
            // the actual implementation for #set
            this._checkDisposed();
            var toSync;
            if (first instanceof uri_1.default) {
                if (!diagnostics) {
                    // remove this entry
                    this.delete(first);
                    return;
                }
                // update single row
                this._data[first.toString()] = diagnostics;
                toSync = [first];
            }
            else if (Array.isArray(first)) {
                // update many rows
                toSync = [];
                for (var _i = 0, first_1 = first; _i < first_1.length; _i++) {
                    var entry = first_1[_i];
                    var uri = entry[0], diagnostics_1 = entry[1];
                    toSync.push(uri);
                    if (!diagnostics_1) {
                        // [Uri, undefined] means clear this
                        delete this._data[uri.toString()];
                    }
                    else {
                        // set or merge diagnostics
                        var existing = this._data[uri.toString()];
                        if (existing) {
                            existing.push.apply(existing, diagnostics_1);
                        }
                        else {
                            this._data[uri.toString()] = diagnostics_1;
                        }
                    }
                }
            }
            // compute change and send to main side
            var entries = [];
            for (var _a = 0, toSync_1 = toSync; _a < toSync_1.length; _a++) {
                var uri = toSync_1[_a];
                var marker = void 0;
                var diagnostics_2 = this._data[uri.toString()];
                if (diagnostics_2) {
                    // no more than 250 diagnostics per file
                    if (diagnostics_2.length > DiagnosticCollection._maxDiagnosticsPerFile) {
                        console.warn('diagnostics for %s will be capped to %d (actually is %d)', uri.toString(), DiagnosticCollection._maxDiagnosticsPerFile, diagnostics_2.length);
                        diagnostics_2 = diagnostics_2.slice(0, DiagnosticCollection._maxDiagnosticsPerFile);
                    }
                    marker = diagnostics_2.map(DiagnosticCollection._toMarkerData);
                }
                entries.push([uri, marker]);
            }
            this._proxy.$changeMany(this.name, entries);
        };
        DiagnosticCollection.prototype.delete = function (uri) {
            this._checkDisposed();
            delete this._data[uri.toString()];
            this._proxy.$changeMany(this.name, [[uri, undefined]]);
        };
        DiagnosticCollection.prototype.clear = function () {
            this._checkDisposed();
            this._data = Object.create(null);
            this._proxy.$clear(this.name);
        };
        DiagnosticCollection.prototype.forEach = function (callback, thisArg) {
            this._checkDisposed();
            for (var key in this._data) {
                var uri = uri_1.default.parse(key);
                callback.apply(thisArg, [uri, this.get(uri), this]);
            }
        };
        DiagnosticCollection.prototype.get = function (uri) {
            this._checkDisposed();
            var result = this._data[uri.toString()];
            if (Array.isArray(result)) {
                return Object.freeze(result.slice(0));
            }
        };
        DiagnosticCollection.prototype.has = function (uri) {
            this._checkDisposed();
            return Array.isArray(this._data[uri.toString()]);
        };
        DiagnosticCollection.prototype._checkDisposed = function () {
            if (this._isDisposed) {
                throw new Error('illegal state - object is disposed');
            }
        };
        DiagnosticCollection._toMarkerData = function (diagnostic) {
            var range = diagnostic.range;
            return {
                startLineNumber: range.start.line + 1,
                startColumn: range.start.character + 1,
                endLineNumber: range.end.line + 1,
                endColumn: range.end.character + 1,
                message: diagnostic.message,
                source: diagnostic.source,
                severity: DiagnosticCollection._convertDiagnosticsSeverity(diagnostic.severity),
                code: String(diagnostic.code)
            };
        };
        DiagnosticCollection._convertDiagnosticsSeverity = function (severity) {
            switch (severity) {
                case 0: return severity_1.default.Error;
                case 1: return severity_1.default.Warning;
                case 2: return severity_1.default.Info;
                case 3: return severity_1.default.Ignore;
                default: return severity_1.default.Error;
            }
        };
        DiagnosticCollection._maxDiagnosticsPerFile = 250;
        return DiagnosticCollection;
    }());
    exports.DiagnosticCollection = DiagnosticCollection;
    var ExtHostDiagnostics = (function (_super) {
        __extends(ExtHostDiagnostics, _super);
        function ExtHostDiagnostics(threadService) {
            _super.call(this);
            this._proxy = threadService.get(extHost_protocol_1.MainContext.MainThreadDiagnostics);
            this._collections = [];
        }
        ExtHostDiagnostics.prototype.createDiagnosticCollection = function (name) {
            if (!name) {
                name = '_generated_diagnostic_collection_name_#' + ExtHostDiagnostics._idPool++;
            }
            var _a = this, _collections = _a._collections, _proxy = _a._proxy;
            var result = new (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    _super.call(this, name, _proxy);
                    _collections.push(this);
                }
                class_1.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    var idx = _collections.indexOf(this);
                    if (idx !== -1) {
                        _collections.splice(idx, 1);
                    }
                };
                return class_1;
            }(DiagnosticCollection));
            return result;
        };
        ExtHostDiagnostics.prototype.forEach = function (callback) {
            this._collections.forEach(callback);
        };
        ExtHostDiagnostics._idPool = 0;
        return ExtHostDiagnostics;
    }(extHost_protocol_1.ExtHostDiagnosticsShape));
    exports.ExtHostDiagnostics = ExtHostDiagnostics;
});






define(__m[77], __M([0,1,4,56,6,5,11,3,20,38,2]), function (require, exports, errors_1, mirrorModel2_1, event_1, extHostTypes_1, TypeConverters, winjs_base_1, async_1, wordHelper_1, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var _modeId2WordDefinition = Object.create(null);
    function setWordDefinitionFor(modeId, wordDefinition) {
        _modeId2WordDefinition[modeId] = wordDefinition;
    }
    function getWordDefinitionFor(modeId) {
        return _modeId2WordDefinition[modeId];
    }
    var ExtHostDocuments = (function (_super) {
        __extends(ExtHostDocuments, _super);
        function ExtHostDocuments(threadService) {
            _super.call(this);
            this._proxy = threadService.get(extHost_protocol_1.MainContext.MainThreadDocuments);
            this._onDidAddDocumentEventEmitter = new event_1.Emitter();
            this.onDidAddDocument = this._onDidAddDocumentEventEmitter.event;
            this._onDidRemoveDocumentEventEmitter = new event_1.Emitter();
            this.onDidRemoveDocument = this._onDidRemoveDocumentEventEmitter.event;
            this._onDidChangeDocumentEventEmitter = new event_1.Emitter();
            this.onDidChangeDocument = this._onDidChangeDocumentEventEmitter.event;
            this._onDidSaveDocumentEventEmitter = new event_1.Emitter();
            this.onDidSaveDocument = this._onDidSaveDocumentEventEmitter.event;
            this._documentData = Object.create(null);
            this._documentLoader = Object.create(null);
            this._documentContentProviders = Object.create(null);
        }
        ExtHostDocuments.prototype.getAllDocumentData = function () {
            var result = [];
            for (var key in this._documentData) {
                result.push(this._documentData[key]);
            }
            return result;
        };
        ExtHostDocuments.prototype.getDocumentData = function (resource) {
            if (!resource) {
                return;
            }
            var data = this._documentData[resource.toString()];
            if (data) {
                return data;
            }
        };
        ExtHostDocuments.prototype.ensureDocumentData = function (uri) {
            var _this = this;
            var cached = this._documentData[uri.toString()];
            if (cached) {
                return winjs_base_1.TPromise.as(cached);
            }
            var promise = this._documentLoader[uri.toString()];
            if (!promise) {
                promise = this._proxy.$tryOpenDocument(uri).then(function () {
                    delete _this._documentLoader[uri.toString()];
                    return _this._documentData[uri.toString()];
                }, function (err) {
                    delete _this._documentLoader[uri.toString()];
                    return winjs_base_1.TPromise.wrapError(err);
                });
                this._documentLoader[uri.toString()] = promise;
            }
            return promise;
        };
        ExtHostDocuments.prototype.registerTextDocumentContentProvider = function (scheme, provider) {
            var _this = this;
            if (scheme === 'file' || scheme === 'untitled') {
                throw new Error("scheme '" + scheme + "' already registered");
            }
            var handle = ExtHostDocuments._handlePool++;
            this._documentContentProviders[handle] = provider;
            this._proxy.$registerTextContentProvider(handle, scheme);
            var subscription;
            if (typeof provider.onDidChange === 'function') {
                subscription = provider.onDidChange(function (uri) {
                    if (_this._documentData[uri.toString()]) {
                        _this.$provideTextDocumentContent(handle, uri).then(function (value) {
                            return _this._proxy.$onVirtualDocumentChange(uri, value);
                        }, errors_1.onUnexpectedError);
                    }
                });
            }
            return new extHostTypes_1.Disposable(function () {
                if (delete _this._documentContentProviders[handle]) {
                    _this._proxy.$unregisterTextContentProvider(handle);
                }
                if (subscription) {
                    subscription.dispose();
                    subscription = undefined;
                }
            });
        };
        ExtHostDocuments.prototype.$provideTextDocumentContent = function (handle, uri) {
            var provider = this._documentContentProviders[handle];
            if (!provider) {
                return winjs_base_1.TPromise.wrapError("unsupported uri-scheme: " + uri.scheme);
            }
            return async_1.asWinJsPromise(function (token) { return provider.provideTextDocumentContent(uri, token); });
        };
        ExtHostDocuments.prototype.$acceptModelAdd = function (initData) {
            var data = new ExtHostDocumentData(this._proxy, initData.url, initData.value.lines, initData.value.EOL, initData.modeId, initData.versionId, initData.isDirty);
            var key = data.document.uri.toString();
            if (this._documentData[key]) {
                throw new Error('Document `' + key + '` already exists.');
            }
            this._documentData[key] = data;
            this._onDidAddDocumentEventEmitter.fire(data.document);
        };
        ExtHostDocuments.prototype.$acceptModelModeChanged = function (strURL, oldModeId, newModeId) {
            var data = this._documentData[strURL];
            // Treat a mode change as a remove + add
            this._onDidRemoveDocumentEventEmitter.fire(data.document);
            data._acceptLanguageId(newModeId);
            this._onDidAddDocumentEventEmitter.fire(data.document);
        };
        ExtHostDocuments.prototype.$acceptModelSaved = function (strURL) {
            var data = this._documentData[strURL];
            data._acceptIsDirty(false);
            this._onDidSaveDocumentEventEmitter.fire(data.document);
        };
        ExtHostDocuments.prototype.$acceptModelDirty = function (strURL) {
            var document = this._documentData[strURL];
            document._acceptIsDirty(true);
        };
        ExtHostDocuments.prototype.$acceptModelReverted = function (strURL) {
            var document = this._documentData[strURL];
            document._acceptIsDirty(false);
        };
        ExtHostDocuments.prototype.$acceptModelRemoved = function (strURL) {
            if (!this._documentData[strURL]) {
                throw new Error('Document `' + strURL + '` does not exist.');
            }
            var data = this._documentData[strURL];
            delete this._documentData[strURL];
            this._onDidRemoveDocumentEventEmitter.fire(data.document);
            data.dispose();
        };
        ExtHostDocuments.prototype.$acceptModelChanged = function (strURL, events) {
            var data = this._documentData[strURL];
            data.onEvents(events);
            this._onDidChangeDocumentEventEmitter.fire({
                document: data.document,
                contentChanges: events.map(function (e) {
                    return {
                        range: TypeConverters.toRange(e.range),
                        rangeLength: e.rangeLength,
                        text: e.text
                    };
                })
            });
        };
        ExtHostDocuments.prototype.setWordDefinitionFor = function (modeId, wordDefinition) {
            setWordDefinitionFor(modeId, wordDefinition);
        };
        ExtHostDocuments._handlePool = 0;
        return ExtHostDocuments;
    }(extHost_protocol_1.ExtHostDocumentsShape));
    exports.ExtHostDocuments = ExtHostDocuments;
    var ExtHostDocumentData = (function (_super) {
        __extends(ExtHostDocumentData, _super);
        function ExtHostDocumentData(proxy, uri, lines, eol, languageId, versionId, isDirty) {
            _super.call(this, uri, lines, eol, versionId);
            this._proxy = proxy;
            this._languageId = languageId;
            this._isDirty = isDirty;
            this._textLines = [];
        }
        ExtHostDocumentData.prototype.dispose = function () {
            this._textLines.length = 0;
            this._isDirty = false;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(ExtHostDocumentData.prototype, "document", {
            get: function () {
                if (!this._document) {
                    var data_1 = this;
                    this._document = {
                        get uri() { return data_1._uri; },
                        get fileName() { return data_1._uri.fsPath; },
                        get isUntitled() { return data_1._uri.scheme !== 'file'; },
                        get languageId() { return data_1._languageId; },
                        get version() { return data_1._versionId; },
                        get isDirty() { return data_1._isDirty; },
                        save: function () { return data_1._proxy.$trySaveDocument(data_1._uri); },
                        getText: function (range) { return range ? data_1._getTextInRange(range) : data_1.getText(); },
                        get lineCount() { return data_1._lines.length; },
                        lineAt: function (lineOrPos) { return data_1.lineAt(lineOrPos); },
                        offsetAt: function (pos) { return data_1.offsetAt(pos); },
                        positionAt: function (offset) { return data_1.positionAt(offset); },
                        validateRange: function (ran) { return data_1.validateRange(ran); },
                        validatePosition: function (pos) { return data_1.validatePosition(pos); },
                        getWordRangeAtPosition: function (pos) { return data_1.getWordRangeAtPosition(pos); }
                    };
                }
                return this._document;
            },
            enumerable: true,
            configurable: true
        });
        ExtHostDocumentData.prototype._acceptLanguageId = function (newLanguageId) {
            this._languageId = newLanguageId;
        };
        ExtHostDocumentData.prototype._acceptIsDirty = function (isDirty) {
            this._isDirty = isDirty;
        };
        ExtHostDocumentData.prototype._getTextInRange = function (_range) {
            var range = this.validateRange(_range);
            if (range.isEmpty) {
                return '';
            }
            if (range.isSingleLine) {
                return this._lines[range.start.line].substring(range.start.character, range.end.character);
            }
            var lineEnding = this._eol, startLineIndex = range.start.line, endLineIndex = range.end.line, resultLines = [];
            resultLines.push(this._lines[startLineIndex].substring(range.start.character));
            for (var i = startLineIndex + 1; i < endLineIndex; i++) {
                resultLines.push(this._lines[i]);
            }
            resultLines.push(this._lines[endLineIndex].substring(0, range.end.character));
            return resultLines.join(lineEnding);
        };
        ExtHostDocumentData.prototype.lineAt = function (lineOrPosition) {
            var line;
            if (lineOrPosition instanceof extHostTypes_1.Position) {
                line = lineOrPosition.line;
            }
            else if (typeof lineOrPosition === 'number') {
                line = lineOrPosition;
            }
            if (line < 0 || line >= this._lines.length) {
                throw new Error('Illegal value for `line`');
            }
            var result = this._textLines[line];
            if (!result || result.lineNumber !== line || result.text !== this._lines[line]) {
                var text = this._lines[line];
                var firstNonWhitespaceCharacterIndex = /^(\s*)/.exec(text)[1].length;
                var range = new extHostTypes_1.Range(line, 0, line, text.length);
                var rangeIncludingLineBreak = line < this._lines.length - 1
                    ? new extHostTypes_1.Range(line, 0, line + 1, 0)
                    : range;
                result = Object.freeze({
                    lineNumber: line,
                    range: range,
                    rangeIncludingLineBreak: rangeIncludingLineBreak,
                    text: text,
                    firstNonWhitespaceCharacterIndex: firstNonWhitespaceCharacterIndex,
                    isEmptyOrWhitespace: firstNonWhitespaceCharacterIndex === text.length
                });
                this._textLines[line] = result;
            }
            return result;
        };
        ExtHostDocumentData.prototype.offsetAt = function (position) {
            position = this.validatePosition(position);
            this._ensureLineStarts();
            return this._lineStarts.getAccumulatedValue(position.line - 1) + position.character;
        };
        ExtHostDocumentData.prototype.positionAt = function (offset) {
            offset = Math.floor(offset);
            offset = Math.max(0, offset);
            this._ensureLineStarts();
            var out = this._lineStarts.getIndexOf(offset);
            var lineLength = this._lines[out.index].length;
            // Ensure we return a valid position
            return new extHostTypes_1.Position(out.index, Math.min(out.remainder, lineLength));
        };
        // ---- range math
        ExtHostDocumentData.prototype.validateRange = function (range) {
            if (!(range instanceof extHostTypes_1.Range)) {
                throw new Error('Invalid argument');
            }
            var start = this.validatePosition(range.start);
            var end = this.validatePosition(range.end);
            if (start === range.start && end === range.end) {
                return range;
            }
            return new extHostTypes_1.Range(start.line, start.character, end.line, end.character);
        };
        ExtHostDocumentData.prototype.validatePosition = function (position) {
            if (!(position instanceof extHostTypes_1.Position)) {
                throw new Error('Invalid argument');
            }
            var line = position.line, character = position.character;
            var hasChanged = false;
            if (line < 0) {
                line = 0;
                character = 0;
                hasChanged = true;
            }
            else if (line >= this._lines.length) {
                line = this._lines.length - 1;
                character = this._lines[line].length;
                hasChanged = true;
            }
            else {
                var maxCharacter = this._lines[line].length;
                if (character < 0) {
                    character = 0;
                    hasChanged = true;
                }
                else if (character > maxCharacter) {
                    character = maxCharacter;
                    hasChanged = true;
                }
            }
            if (!hasChanged) {
                return position;
            }
            return new extHostTypes_1.Position(line, character);
        };
        ExtHostDocumentData.prototype.getWordRangeAtPosition = function (_position) {
            var position = this.validatePosition(_position);
            var wordAtText = wordHelper_1.getWordAtText(position.character + 1, wordHelper_1.ensureValidWordDefinition(getWordDefinitionFor(this._languageId)), this._lines[position.line], 0);
            if (wordAtText) {
                return new extHostTypes_1.Range(position.line, wordAtText.startColumn - 1, position.line, wordAtText.endColumn - 1);
            }
        };
        return ExtHostDocumentData;
    }(mirrorModel2_1.MirrorModel2));
    exports.ExtHostDocumentData = ExtHostDocumentData;
});






var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(__m[78], __M([0,1,4,46,6,3,5,11,2]), function (require, exports, errors_1, idGenerator_1, event_1, winjs_base_1, extHostTypes_1, TypeConverters, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ExtHostEditors = (function (_super) {
        __extends(ExtHostEditors, _super);
        function ExtHostEditors(threadService, extHostDocuments) {
            _super.call(this);
            this._onDidChangeTextEditorSelection = new event_1.Emitter();
            this.onDidChangeTextEditorSelection = this._onDidChangeTextEditorSelection.event;
            this._onDidChangeTextEditorOptions = new event_1.Emitter();
            this.onDidChangeTextEditorOptions = this._onDidChangeTextEditorOptions.event;
            this._onDidChangeTextEditorViewColumn = new event_1.Emitter();
            this.onDidChangeTextEditorViewColumn = this._onDidChangeTextEditorViewColumn.event;
            this._extHostDocuments = extHostDocuments;
            this._proxy = threadService.get(extHost_protocol_1.MainContext.MainThreadEditors);
            this._onDidChangeActiveTextEditor = new event_1.Emitter();
            this._editors = Object.create(null);
            this._visibleEditorIds = [];
        }
        ExtHostEditors.prototype.getActiveTextEditor = function () {
            return this._editors[this._activeEditorId];
        };
        ExtHostEditors.prototype.getVisibleTextEditors = function () {
            var _this = this;
            return this._visibleEditorIds.map(function (id) { return _this._editors[id]; });
        };
        Object.defineProperty(ExtHostEditors.prototype, "onDidChangeActiveTextEditor", {
            get: function () {
                return this._onDidChangeActiveTextEditor && this._onDidChangeActiveTextEditor.event;
            },
            enumerable: true,
            configurable: true
        });
        ExtHostEditors.prototype.showTextDocument = function (document, column, preserveFocus) {
            var _this = this;
            return this._proxy.$tryShowTextDocument(document.uri, TypeConverters.fromViewColumn(column), preserveFocus).then(function (id) {
                var editor = _this._editors[id];
                if (editor) {
                    return editor;
                }
                else {
                    throw new Error("Failed to show text document " + document.uri.toString() + ", should show in editor #" + id);
                }
            });
        };
        ExtHostEditors.prototype.createTextEditorDecorationType = function (options) {
            return new TextEditorDecorationType(this._proxy, options);
        };
        // --- called from main thread
        ExtHostEditors.prototype.$acceptTextEditorAdd = function (data) {
            var document = this._extHostDocuments.getDocumentData(data.document);
            var newEditor = new ExtHostTextEditor(this._proxy, data.id, document, data.selections.map(TypeConverters.toSelection), data.options, TypeConverters.toViewColumn(data.editorPosition));
            this._editors[data.id] = newEditor;
        };
        ExtHostEditors.prototype.$acceptOptionsChanged = function (id, opts) {
            var editor = this._editors[id];
            editor._acceptOptions(opts);
            this._onDidChangeTextEditorOptions.fire({
                textEditor: editor,
                options: opts
            });
        };
        ExtHostEditors.prototype.$acceptSelectionsChanged = function (id, event) {
            var selections = event.selections.map(TypeConverters.toSelection);
            var editor = this._editors[id];
            editor._acceptSelections(selections);
            this._onDidChangeTextEditorSelection.fire({
                textEditor: editor,
                selections: selections
            });
        };
        ExtHostEditors.prototype.$acceptActiveEditorAndVisibleEditors = function (id, visibleIds) {
            this._visibleEditorIds = visibleIds;
            if (this._activeEditorId === id) {
                // nothing to do
                return;
            }
            this._activeEditorId = id;
            this._onDidChangeActiveTextEditor.fire(this.getActiveTextEditor());
        };
        ExtHostEditors.prototype.$acceptEditorPositionData = function (data) {
            for (var id in data) {
                var textEditor = this._editors[id];
                var viewColumn = TypeConverters.toViewColumn(data[id]);
                if (textEditor.viewColumn !== viewColumn) {
                    textEditor._acceptViewColumn(viewColumn);
                    this._onDidChangeTextEditorViewColumn.fire({ textEditor: textEditor, viewColumn: viewColumn });
                }
            }
        };
        ExtHostEditors.prototype.$acceptTextEditorRemove = function (id) {
            // make sure the removed editor is not visible
            var newVisibleEditors = this._visibleEditorIds.filter(function (visibleEditorId) { return visibleEditorId !== id; });
            if (this._activeEditorId === id) {
                // removing the current active editor
                this.$acceptActiveEditorAndVisibleEditors(undefined, newVisibleEditors);
            }
            else {
                this.$acceptActiveEditorAndVisibleEditors(this._activeEditorId, newVisibleEditors);
            }
            var editor = this._editors[id];
            editor.dispose();
            delete this._editors[id];
        };
        return ExtHostEditors;
    }(extHost_protocol_1.ExtHostEditorsShape));
    exports.ExtHostEditors = ExtHostEditors;
    var TextEditorDecorationType = (function () {
        function TextEditorDecorationType(proxy, options) {
            this.key = TextEditorDecorationType._Keys.nextId();
            this._proxy = proxy;
            this._proxy.$registerTextEditorDecorationType(this.key, options);
        }
        TextEditorDecorationType.prototype.dispose = function () {
            this._proxy.$removeTextEditorDecorationType(this.key);
        };
        TextEditorDecorationType._Keys = new idGenerator_1.IdGenerator('TextEditorDecorationType');
        return TextEditorDecorationType;
    }());
    var TextEditorEdit = (function () {
        function TextEditorEdit(document) {
            this._documentVersionId = document.version;
            this._collectedEdits = [];
            this._setEndOfLine = 0;
        }
        TextEditorEdit.prototype.finalize = function () {
            return {
                documentVersionId: this._documentVersionId,
                edits: this._collectedEdits,
                setEndOfLine: this._setEndOfLine
            };
        };
        TextEditorEdit.prototype.replace = function (location, value) {
            var range = null;
            if (location instanceof extHostTypes_1.Position) {
                range = new extHostTypes_1.Range(location, location);
            }
            else if (location instanceof extHostTypes_1.Range) {
                range = location;
            }
            else if (location instanceof extHostTypes_1.Selection) {
                range = new extHostTypes_1.Range(location.start, location.end);
            }
            else {
                throw new Error('Unrecognized location');
            }
            this._collectedEdits.push({
                range: range,
                text: value,
                forceMoveMarkers: false
            });
        };
        TextEditorEdit.prototype.insert = function (location, value) {
            this._collectedEdits.push({
                range: new extHostTypes_1.Range(location, location),
                text: value,
                forceMoveMarkers: true
            });
        };
        TextEditorEdit.prototype.delete = function (location) {
            var range = null;
            if (location instanceof extHostTypes_1.Range) {
                range = location;
            }
            else if (location instanceof extHostTypes_1.Selection) {
                range = new extHostTypes_1.Range(location.start, location.end);
            }
            else {
                throw new Error('Unrecognized location');
            }
            this._collectedEdits.push({
                range: range,
                text: null,
                forceMoveMarkers: true
            });
        };
        TextEditorEdit.prototype.setEndOfLine = function (endOfLine) {
            if (endOfLine !== extHostTypes_1.EndOfLine.LF && endOfLine !== extHostTypes_1.EndOfLine.CRLF) {
                throw errors_1.illegalArgument('endOfLine');
            }
            this._setEndOfLine = endOfLine;
        };
        return TextEditorEdit;
    }());
    exports.TextEditorEdit = TextEditorEdit;
    function deprecated(name, message) {
        if (message === void 0) { message = 'Refer to the documentation for further details.'; }
        return function (target, key, descriptor) {
            var originalMethod = descriptor.value;
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                console.warn("[Deprecation Warning] method '" + name + "' is deprecated and should no longer be used. " + message);
                return originalMethod.apply(this, args);
            };
            return descriptor;
        };
    }
    var ExtHostTextEditor = (function () {
        function ExtHostTextEditor(proxy, id, document, selections, options, viewColumn) {
            this._proxy = proxy;
            this._id = id;
            this._documentData = document;
            this._selections = selections;
            this._options = options;
            this._viewColumn = viewColumn;
        }
        ExtHostTextEditor.prototype.dispose = function () {
            this._documentData = null;
        };
        ExtHostTextEditor.prototype.show = function (column) {
            this._proxy.$tryShowEditor(this._id, TypeConverters.fromViewColumn(column));
        };
        ExtHostTextEditor.prototype.hide = function () {
            this._proxy.$tryHideEditor(this._id);
        };
        Object.defineProperty(ExtHostTextEditor.prototype, "document", {
            // ---- the document
            get: function () {
                return this._documentData.document;
            },
            set: function (value) {
                throw errors_1.readonly('document');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostTextEditor.prototype, "options", {
            // ---- options
            get: function () {
                return this._options;
            },
            set: function (value) {
                var _this = this;
                this._options = value;
                this._runOnProxy(function () {
                    return _this._proxy.$trySetOptions(_this._id, _this._options);
                }, true);
            },
            enumerable: true,
            configurable: true
        });
        ExtHostTextEditor.prototype._acceptOptions = function (options) {
            this._options = options;
        };
        Object.defineProperty(ExtHostTextEditor.prototype, "viewColumn", {
            // ---- view column
            get: function () {
                return this._viewColumn;
            },
            set: function (value) {
                throw errors_1.readonly('viewColumn');
            },
            enumerable: true,
            configurable: true
        });
        ExtHostTextEditor.prototype._acceptViewColumn = function (value) {
            this._viewColumn = value;
        };
        Object.defineProperty(ExtHostTextEditor.prototype, "selection", {
            // ---- selections
            get: function () {
                return this._selections && this._selections[0];
            },
            set: function (value) {
                if (!(value instanceof extHostTypes_1.Selection)) {
                    throw errors_1.illegalArgument('selection');
                }
                this._selections = [value];
                this._trySetSelection(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostTextEditor.prototype, "selections", {
            get: function () {
                return this._selections;
            },
            set: function (value) {
                if (!Array.isArray(value) || value.some(function (a) { return !(a instanceof extHostTypes_1.Selection); })) {
                    throw errors_1.illegalArgument('selections');
                }
                this._selections = value;
                this._trySetSelection(true);
            },
            enumerable: true,
            configurable: true
        });
        ExtHostTextEditor.prototype.setDecorations = function (decorationType, ranges) {
            var _this = this;
            this._runOnProxy(function () { return _this._proxy.$trySetDecorations(_this._id, decorationType.key, TypeConverters.fromRangeOrRangeWithMessage(ranges)); }, true);
        };
        ExtHostTextEditor.prototype.revealRange = function (range, revealType) {
            var _this = this;
            this._runOnProxy(function () { return _this._proxy.$tryRevealRange(_this._id, TypeConverters.fromRange(range), revealType || extHostTypes_1.TextEditorRevealType.Default); }, true);
        };
        ExtHostTextEditor.prototype._trySetSelection = function (silent) {
            var _this = this;
            var selection = this._selections.map(TypeConverters.fromSelection);
            return this._runOnProxy(function () { return _this._proxy.$trySetSelections(_this._id, selection); }, silent);
        };
        ExtHostTextEditor.prototype._acceptSelections = function (selections) {
            this._selections = selections;
        };
        // ---- editing
        ExtHostTextEditor.prototype.edit = function (callback) {
            var edit = new TextEditorEdit(this._documentData.document);
            callback(edit);
            return this._applyEdit(edit);
        };
        ExtHostTextEditor.prototype._applyEdit = function (editBuilder) {
            var editData = editBuilder.finalize();
            // prepare data for serialization
            var edits = editData.edits.map(function (edit) {
                return {
                    range: TypeConverters.fromRange(edit.range),
                    text: edit.text,
                    forceMoveMarkers: edit.forceMoveMarkers
                };
            });
            return this._proxy.$tryApplyEdits(this._id, editData.documentVersionId, edits, editData.setEndOfLine);
        };
        // ---- util
        ExtHostTextEditor.prototype._runOnProxy = function (callback, silent) {
            var _this = this;
            return callback().then(function () { return _this; }, function (err) {
                if (!silent) {
                    return winjs_base_1.TPromise.wrapError(silent);
                }
                console.warn(err);
            });
        };
        __decorate([
            deprecated('TextEditor.show')
        ], ExtHostTextEditor.prototype, "show", null);
        __decorate([
            deprecated('TextEditor.hide')
        ], ExtHostTextEditor.prototype, "hide", null);
        return ExtHostTextEditor;
    }());
});






define(__m[79], __M([0,1,6,5,23,2]), function (require, exports, event_1, extHostTypes_1, glob_1, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var FileSystemWatcher = (function () {
        function FileSystemWatcher(dispatcher, globPattern, ignoreCreateEvents, ignoreChangeEvents, ignoreDeleteEvents) {
            var _this = this;
            this._onDidCreate = new event_1.Emitter();
            this._onDidChange = new event_1.Emitter();
            this._onDidDelete = new event_1.Emitter();
            this._config = 0;
            if (!ignoreCreateEvents) {
                this._config += 1;
            }
            if (!ignoreChangeEvents) {
                this._config += 2;
            }
            if (!ignoreDeleteEvents) {
                this._config += 4;
            }
            var subscription = dispatcher(function (events) {
                if (!ignoreCreateEvents) {
                    for (var _i = 0, _a = events.created; _i < _a.length; _i++) {
                        var created = _a[_i];
                        if (glob_1.match(globPattern, created.fsPath)) {
                            _this._onDidCreate.fire(created);
                        }
                    }
                }
                if (!ignoreChangeEvents) {
                    for (var _b = 0, _c = events.changed; _b < _c.length; _b++) {
                        var changed = _c[_b];
                        if (glob_1.match(globPattern, changed.fsPath)) {
                            _this._onDidChange.fire(changed);
                        }
                    }
                }
                if (!ignoreDeleteEvents) {
                    for (var _d = 0, _e = events.deleted; _d < _e.length; _d++) {
                        var deleted = _e[_d];
                        if (glob_1.match(globPattern, deleted.fsPath)) {
                            _this._onDidDelete.fire(deleted);
                        }
                    }
                }
            });
            this._disposable = extHostTypes_1.Disposable.from(this._onDidCreate, this._onDidChange, this._onDidDelete, subscription);
        }
        Object.defineProperty(FileSystemWatcher.prototype, "ignoreCreateEvents", {
            get: function () {
                return Boolean(this._config & 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileSystemWatcher.prototype, "ignoreChangeEvents", {
            get: function () {
                return Boolean(this._config & 2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileSystemWatcher.prototype, "ignoreDeleteEvents", {
            get: function () {
                return Boolean(this._config & 4);
            },
            enumerable: true,
            configurable: true
        });
        FileSystemWatcher.prototype.dispose = function () {
            this._disposable.dispose();
        };
        Object.defineProperty(FileSystemWatcher.prototype, "onDidCreate", {
            get: function () {
                return this._onDidCreate.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileSystemWatcher.prototype, "onDidChange", {
            get: function () {
                return this._onDidChange.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileSystemWatcher.prototype, "onDidDelete", {
            get: function () {
                return this._onDidDelete.event;
            },
            enumerable: true,
            configurable: true
        });
        return FileSystemWatcher;
    }());
    exports.FileSystemWatcher = FileSystemWatcher;
    var ExtHostFileSystemEventService = (function (_super) {
        __extends(ExtHostFileSystemEventService, _super);
        function ExtHostFileSystemEventService() {
            _super.call(this);
            this._emitter = new event_1.Emitter();
        }
        ExtHostFileSystemEventService.prototype.createFileSystemWatcher = function (globPattern, ignoreCreateEvents, ignoreChangeEvents, ignoreDeleteEvents) {
            return new FileSystemWatcher(this._emitter.event, globPattern, ignoreCreateEvents, ignoreChangeEvents, ignoreDeleteEvents);
        };
        ExtHostFileSystemEventService.prototype.$onFileEvent = function (events) {
            this._emitter.fire(events);
        };
        return ExtHostFileSystemEventService;
    }(extHost_protocol_1.ExtHostFileSystemEventServiceShape));
    exports.ExtHostFileSystemEventService = ExtHostFileSystemEventService;
});






define(__m[80], __M([0,1,3,17,11,5,20,2,15]), function (require, exports, winjs_base_1, lifecycle_1, TypeConverters, extHostTypes_1, async_1, extHost_protocol_1, strings_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // --- adapter
    var OutlineAdapter = (function () {
        function OutlineAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        OutlineAdapter.prototype.provideDocumentSymbols = function (resource) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideDocumentSymbols(doc, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(TypeConverters.SymbolInformation.toOutlineEntry);
                }
            });
        };
        return OutlineAdapter;
    }());
    var CodeLensAdapter = (function () {
        function CodeLensAdapter(documents, commands, provider) {
            this._cache = Object.create(null);
            this._documents = documents;
            this._commands = commands;
            this._provider = provider;
        }
        CodeLensAdapter.prototype.provideCodeLenses = function (resource) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var version = doc.version;
            var key = resource.toString();
            // from cache
            var entry = this._cache[key];
            if (entry && entry.version === version) {
                return new async_1.ShallowCancelThenPromise(entry.data.then(function (cached) { return cached.symbols; }));
            }
            var newCodeLensData = async_1.asWinJsPromise(function (token) { return _this._provider.provideCodeLenses(doc, token); }).then(function (lenses) {
                if (!Array.isArray(lenses)) {
                    return;
                }
                var data = {
                    lenses: lenses,
                    symbols: [],
                    disposables: [],
                };
                lenses.forEach(function (lens, i) {
                    data.symbols.push({
                        id: String(i),
                        range: TypeConverters.fromRange(lens.range),
                        command: TypeConverters.Command.from(lens.command, data.disposables)
                    });
                });
                return data;
            });
            this._cache[key] = {
                version: version,
                data: newCodeLensData
            };
            return new async_1.ShallowCancelThenPromise(newCodeLensData.then(function (newCached) {
                if (entry) {
                    // only now dispose old commands et al
                    entry.data.then(function (oldCached) { return lifecycle_1.dispose(oldCached.disposables); });
                }
                return newCached && newCached.symbols;
            }));
        };
        CodeLensAdapter.prototype.resolveCodeLens = function (resource, symbol) {
            var _this = this;
            var entry = this._cache[resource.toString()];
            if (!entry) {
                return;
            }
            return entry.data.then(function (cachedData) {
                if (!cachedData) {
                    return;
                }
                var lens = cachedData.lenses[Number(symbol.id)];
                if (!lens) {
                    return;
                }
                var resolve;
                if (typeof _this._provider.resolveCodeLens !== 'function' || lens.isResolved) {
                    resolve = winjs_base_1.TPromise.as(lens);
                }
                else {
                    resolve = async_1.asWinJsPromise(function (token) { return _this._provider.resolveCodeLens(lens, token); });
                }
                return resolve.then(function (newLens) {
                    lens = newLens || lens;
                    var command = lens.command;
                    if (!command) {
                        command = {
                            title: '<<MISSING COMMAND>>',
                            command: 'missing',
                        };
                    }
                    symbol.command = TypeConverters.Command.from(command, cachedData.disposables);
                    return symbol;
                });
            });
        };
        return CodeLensAdapter;
    }());
    var DefinitionAdapter = (function () {
        function DefinitionAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        DefinitionAdapter.prototype.provideDefinition = function (resource, position) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideDefinition(doc, pos, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(DefinitionAdapter._convertLocation);
                }
                else if (value) {
                    return DefinitionAdapter._convertLocation(value);
                }
            });
        };
        DefinitionAdapter._convertLocation = function (location) {
            if (!location) {
                return;
            }
            return {
                uri: location.uri,
                range: TypeConverters.fromRange(location.range)
            };
        };
        return DefinitionAdapter;
    }());
    var HoverAdapter = (function () {
        function HoverAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        HoverAdapter.prototype.provideHover = function (resource, position) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideHover(doc, pos, token); }).then(function (value) {
                if (!value) {
                    return;
                }
                if (!value.range) {
                    value.range = doc.getWordRangeAtPosition(pos);
                }
                if (!value.range) {
                    value.range = new extHostTypes_1.Range(pos, pos);
                }
                return TypeConverters.fromHover(value);
            });
        };
        return HoverAdapter;
    }());
    var DocumentHighlightAdapter = (function () {
        function DocumentHighlightAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        DocumentHighlightAdapter.prototype.provideDocumentHighlights = function (resource, position) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideDocumentHighlights(doc, pos, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(DocumentHighlightAdapter._convertDocumentHighlight);
                }
            });
        };
        DocumentHighlightAdapter._convertDocumentHighlight = function (documentHighlight) {
            return {
                range: TypeConverters.fromRange(documentHighlight.range),
                kind: documentHighlight.kind
            };
        };
        return DocumentHighlightAdapter;
    }());
    var ReferenceAdapter = (function () {
        function ReferenceAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        ReferenceAdapter.prototype.provideReferences = function (resource, position, context) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideReferences(doc, pos, context, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(ReferenceAdapter._convertLocation);
                }
            });
        };
        ReferenceAdapter._convertLocation = function (location) {
            return {
                uri: location.uri,
                range: TypeConverters.fromRange(location.range)
            };
        };
        return ReferenceAdapter;
    }());
    var QuickFixAdapter = (function () {
        function QuickFixAdapter(documents, commands, diagnostics, provider) {
            this._cachedCommands = [];
            this._documents = documents;
            this._commands = commands;
            this._diagnostics = diagnostics;
            this._provider = provider;
        }
        QuickFixAdapter.prototype.provideCodeActions = function (resource, range) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var ran = TypeConverters.toRange(range);
            var allDiagnostics = [];
            this._diagnostics.forEach(function (collection) {
                if (collection.has(resource)) {
                    for (var _i = 0, _a = collection.get(resource); _i < _a.length; _i++) {
                        var diagnostic = _a[_i];
                        if (diagnostic.range.intersection(ran)) {
                            allDiagnostics.push(diagnostic);
                        }
                    }
                }
            });
            this._cachedCommands = lifecycle_1.dispose(this._cachedCommands);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideCodeActions(doc, ran, { diagnostics: allDiagnostics }, token); }).then(function (commands) {
                if (!Array.isArray(commands)) {
                    return;
                }
                return commands.map(function (command, i) {
                    return {
                        command: TypeConverters.Command.from(command, _this._cachedCommands),
                        score: i
                    };
                });
            });
        };
        return QuickFixAdapter;
    }());
    var DocumentFormattingAdapter = (function () {
        function DocumentFormattingAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        DocumentFormattingAdapter.prototype.provideDocumentFormattingEdits = function (resource, options) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideDocumentFormattingEdits(doc, options, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(TypeConverters.TextEdit.from);
                }
            });
        };
        return DocumentFormattingAdapter;
    }());
    var RangeFormattingAdapter = (function () {
        function RangeFormattingAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        RangeFormattingAdapter.prototype.provideDocumentRangeFormattingEdits = function (resource, range, options) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var ran = TypeConverters.toRange(range);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideDocumentRangeFormattingEdits(doc, ran, options, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(TypeConverters.TextEdit.from);
                }
            });
        };
        return RangeFormattingAdapter;
    }());
    var OnTypeFormattingAdapter = (function () {
        function OnTypeFormattingAdapter(documents, provider) {
            this.autoFormatTriggerCharacters = []; // not here
            this._documents = documents;
            this._provider = provider;
        }
        OnTypeFormattingAdapter.prototype.provideOnTypeFormattingEdits = function (resource, position, ch, options) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideOnTypeFormattingEdits(doc, pos, ch, options, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(TypeConverters.TextEdit.from);
                }
            });
        };
        return OnTypeFormattingAdapter;
    }());
    var NavigateTypeAdapter = (function () {
        function NavigateTypeAdapter(provider) {
            this._provider = provider;
        }
        NavigateTypeAdapter.prototype.getNavigateToItems = function (search) {
            var _this = this;
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideWorkspaceSymbols(search, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(TypeConverters.fromSymbolInformation);
                }
            });
        };
        return NavigateTypeAdapter;
    }());
    var RenameAdapter = (function () {
        function RenameAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        RenameAdapter.prototype.provideRenameEdits = function (resource, position, newName) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideRenameEdits(doc, pos, newName, token); }).then(function (value) {
                if (!value) {
                    return;
                }
                var result = {
                    edits: []
                };
                for (var _i = 0, _a = value.entries(); _i < _a.length; _i++) {
                    var entry = _a[_i];
                    var uri = entry[0], textEdits = entry[1];
                    for (var _b = 0, textEdits_1 = textEdits; _b < textEdits_1.length; _b++) {
                        var textEdit = textEdits_1[_b];
                        result.edits.push({
                            resource: uri,
                            newText: textEdit.newText,
                            range: TypeConverters.fromRange(textEdit.range)
                        });
                    }
                }
                return result;
            }, function (err) {
                if (typeof err === 'string') {
                    return {
                        edits: undefined,
                        rejectReason: err
                    };
                }
                return winjs_base_1.TPromise.wrapError(err);
            });
        };
        return RenameAdapter;
    }());
    var SuggestAdapter = (function () {
        function SuggestAdapter(documents, provider) {
            this._cache = Object.create(null);
            this._documents = documents;
            this._provider = provider;
        }
        SuggestAdapter.prototype.provideCompletionItems = function (resource, position) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            var ran = doc.getWordRangeAtPosition(pos);
            var key = resource.toString();
            delete this._cache[key];
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideCompletionItems(doc, pos, token); }).then(function (value) {
                var defaultSuggestions = {
                    suggestions: [],
                    currentWord: ran ? doc.getText(new extHostTypes_1.Range(ran.start.line, ran.start.character, pos.line, pos.character)) : '',
                };
                var allSuggestions = [defaultSuggestions];
                var list;
                if (Array.isArray(value)) {
                    list = new extHostTypes_1.CompletionList(value);
                }
                else if (value instanceof extHostTypes_1.CompletionList) {
                    list = value;
                    defaultSuggestions.incomplete = list.isIncomplete;
                }
                else if (!value) {
                    // undefined and null are valid results
                    return;
                }
                else {
                    // warn about everything else
                    console.warn('INVALID result from completion provider. expected CompletionItem-array or CompletionList but got:', value);
                    return;
                }
                for (var i = 0; i < list.items.length; i++) {
                    var item = list.items[i];
                    var suggestion = TypeConverters.Suggest.from(item);
                    if (item.textEdit) {
                        var editRange = item.textEdit.range;
                        // invalid text edit
                        if (!editRange.isSingleLine || editRange.start.line !== pos.line) {
                            console.warn('INVALID text edit, must be single line and on the same line');
                            continue;
                        }
                        // insert the text of the edit and create a dedicated
                        // suggestion-container with overwrite[Before|After]
                        suggestion.codeSnippet = item.textEdit.newText;
                        suggestion.overwriteBefore = pos.character - editRange.start.character;
                        suggestion.overwriteAfter = editRange.end.character - pos.character;
                        allSuggestions.push({
                            currentWord: doc.getText(editRange),
                            suggestions: [suggestion],
                            incomplete: list.isIncomplete
                        });
                    }
                    else {
                        defaultSuggestions.suggestions.push(suggestion);
                    }
                    // assign identifier to suggestion
                    suggestion.id = String(i);
                }
                // cache for details call
                _this._cache[key] = list;
                return allSuggestions;
            });
        };
        SuggestAdapter.prototype.resolveCompletionItem = function (resource, position, suggestion) {
            var _this = this;
            if (typeof this._provider.resolveCompletionItem !== 'function') {
                return winjs_base_1.TPromise.as(suggestion);
            }
            var list = this._cache[resource.toString()];
            if (!list) {
                return winjs_base_1.TPromise.as(suggestion);
            }
            var item = list.items[Number(suggestion.id)];
            if (!item) {
                return winjs_base_1.TPromise.as(suggestion);
            }
            return async_1.asWinJsPromise(function (token) { return _this._provider.resolveCompletionItem(item, token); }).then(function (resolvedItem) {
                return TypeConverters.Suggest.from(resolvedItem || item);
            });
        };
        return SuggestAdapter;
    }());
    var SignatureHelpAdapter = (function () {
        function SignatureHelpAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        SignatureHelpAdapter.prototype.provideSignatureHelp = function (resource, position) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideSignatureHelp(doc, pos, token); }).then(function (value) {
                if (value instanceof extHostTypes_1.SignatureHelp) {
                    return TypeConverters.SignatureHelp.from(value);
                }
            });
        };
        return SignatureHelpAdapter;
    }());
    var LinkProviderAdapter = (function () {
        function LinkProviderAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        LinkProviderAdapter.prototype.provideLinks = function (resource) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideDocumentLinks(doc, token); }).then(function (links) {
                if (Array.isArray(links)) {
                    return links.map(TypeConverters.DocumentLink.from);
                }
            });
        };
        return LinkProviderAdapter;
    }());
    var ExtHostLanguageFeatures = (function (_super) {
        __extends(ExtHostLanguageFeatures, _super);
        function ExtHostLanguageFeatures(threadService, documents, commands, diagnostics) {
            _super.call(this);
            this._adapter = Object.create(null);
            this._proxy = threadService.get(extHost_protocol_1.MainContext.MainThreadLanguageFeatures);
            this._documents = documents;
            this._commands = commands;
            this._diagnostics = diagnostics;
        }
        ExtHostLanguageFeatures.prototype._createDisposable = function (handle) {
            var _this = this;
            return new extHostTypes_1.Disposable(function () {
                delete _this._adapter[handle];
                _this._proxy.$unregister(handle);
            });
        };
        ExtHostLanguageFeatures.prototype._nextHandle = function () {
            return ExtHostLanguageFeatures._handlePool++;
        };
        ExtHostLanguageFeatures.prototype._withAdapter = function (handle, ctor, callback) {
            var adapter = this._adapter[handle];
            if (!(adapter instanceof ctor)) {
                return winjs_base_1.TPromise.wrapError(new Error('no adapter found'));
            }
            return callback(adapter);
        };
        // --- outline
        ExtHostLanguageFeatures.prototype.registerDocumentSymbolProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter[handle] = new OutlineAdapter(this._documents, provider);
            this._proxy.$registerOutlineSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideDocumentSymbols = function (handle, resource) {
            return this._withAdapter(handle, OutlineAdapter, function (adapter) { return adapter.provideDocumentSymbols(resource); });
        };
        // --- code lens
        ExtHostLanguageFeatures.prototype.registerCodeLensProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter[handle] = new CodeLensAdapter(this._documents, this._commands, provider);
            this._proxy.$registerCodeLensSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideCodeLenses = function (handle, resource) {
            return this._withAdapter(handle, CodeLensAdapter, function (adapter) { return adapter.provideCodeLenses(resource); });
        };
        ExtHostLanguageFeatures.prototype.$resolveCodeLens = function (handle, resource, symbol) {
            return this._withAdapter(handle, CodeLensAdapter, function (adapter) { return adapter.resolveCodeLens(resource, symbol); });
        };
        // --- declaration
        ExtHostLanguageFeatures.prototype.registerDefinitionProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter[handle] = new DefinitionAdapter(this._documents, provider);
            this._proxy.$registerDeclaractionSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideDefinition = function (handle, resource, position) {
            return this._withAdapter(handle, DefinitionAdapter, function (adapter) { return adapter.provideDefinition(resource, position); });
        };
        // --- extra info
        ExtHostLanguageFeatures.prototype.registerHoverProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter[handle] = new HoverAdapter(this._documents, provider);
            this._proxy.$registerHoverProvider(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideHover = function (handle, resource, position) {
            return this._withAdapter(handle, HoverAdapter, function (adpater) { return adpater.provideHover(resource, position); });
        };
        // --- occurrences
        ExtHostLanguageFeatures.prototype.registerDocumentHighlightProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter[handle] = new DocumentHighlightAdapter(this._documents, provider);
            this._proxy.$registerDocumentHighlightProvider(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideDocumentHighlights = function (handle, resource, position) {
            return this._withAdapter(handle, DocumentHighlightAdapter, function (adapter) { return adapter.provideDocumentHighlights(resource, position); });
        };
        // --- references
        ExtHostLanguageFeatures.prototype.registerReferenceProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter[handle] = new ReferenceAdapter(this._documents, provider);
            this._proxy.$registerReferenceSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideReferences = function (handle, resource, position, context) {
            return this._withAdapter(handle, ReferenceAdapter, function (adapter) { return adapter.provideReferences(resource, position, context); });
        };
        // --- quick fix
        ExtHostLanguageFeatures.prototype.registerCodeActionProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter[handle] = new QuickFixAdapter(this._documents, this._commands, this._diagnostics, provider);
            this._proxy.$registerQuickFixSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideCodeActions = function (handle, resource, range) {
            return this._withAdapter(handle, QuickFixAdapter, function (adapter) { return adapter.provideCodeActions(resource, range); });
        };
        // --- formatting
        ExtHostLanguageFeatures.prototype.registerDocumentFormattingEditProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter[handle] = new DocumentFormattingAdapter(this._documents, provider);
            this._proxy.$registerDocumentFormattingSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideDocumentFormattingEdits = function (handle, resource, options) {
            return this._withAdapter(handle, DocumentFormattingAdapter, function (adapter) { return adapter.provideDocumentFormattingEdits(resource, options); });
        };
        ExtHostLanguageFeatures.prototype.registerDocumentRangeFormattingEditProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter[handle] = new RangeFormattingAdapter(this._documents, provider);
            this._proxy.$registerRangeFormattingSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideDocumentRangeFormattingEdits = function (handle, resource, range, options) {
            return this._withAdapter(handle, RangeFormattingAdapter, function (adapter) { return adapter.provideDocumentRangeFormattingEdits(resource, range, options); });
        };
        ExtHostLanguageFeatures.prototype.registerOnTypeFormattingEditProvider = function (selector, provider, triggerCharacters) {
            var handle = this._nextHandle();
            this._adapter[handle] = new OnTypeFormattingAdapter(this._documents, provider);
            this._proxy.$registerOnTypeFormattingSupport(handle, selector, triggerCharacters);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideOnTypeFormattingEdits = function (handle, resource, position, ch, options) {
            return this._withAdapter(handle, OnTypeFormattingAdapter, function (adapter) { return adapter.provideOnTypeFormattingEdits(resource, position, ch, options); });
        };
        // --- navigate types
        ExtHostLanguageFeatures.prototype.registerWorkspaceSymbolProvider = function (provider) {
            var handle = this._nextHandle();
            this._adapter[handle] = new NavigateTypeAdapter(provider);
            this._proxy.$registerNavigateTypeSupport(handle);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$getNavigateToItems = function (handle, search) {
            return this._withAdapter(handle, NavigateTypeAdapter, function (adapter) { return adapter.getNavigateToItems(search); });
        };
        // --- rename
        ExtHostLanguageFeatures.prototype.registerRenameProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter[handle] = new RenameAdapter(this._documents, provider);
            this._proxy.$registerRenameSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideRenameEdits = function (handle, resource, position, newName) {
            return this._withAdapter(handle, RenameAdapter, function (adapter) { return adapter.provideRenameEdits(resource, position, newName); });
        };
        // --- suggestion
        ExtHostLanguageFeatures.prototype.registerCompletionItemProvider = function (selector, provider, triggerCharacters) {
            var handle = this._nextHandle();
            this._adapter[handle] = new SuggestAdapter(this._documents, provider);
            this._proxy.$registerSuggestSupport(handle, selector, triggerCharacters);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideCompletionItems = function (handle, resource, position) {
            return this._withAdapter(handle, SuggestAdapter, function (adapter) { return adapter.provideCompletionItems(resource, position); });
        };
        ExtHostLanguageFeatures.prototype.$resolveCompletionItem = function (handle, resource, position, suggestion) {
            return this._withAdapter(handle, SuggestAdapter, function (adapter) { return adapter.resolveCompletionItem(resource, position, suggestion); });
        };
        // --- parameter hints
        ExtHostLanguageFeatures.prototype.registerSignatureHelpProvider = function (selector, provider, triggerCharacters) {
            var handle = this._nextHandle();
            this._adapter[handle] = new SignatureHelpAdapter(this._documents, provider);
            this._proxy.$registerSignatureHelpProvider(handle, selector, triggerCharacters);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideSignatureHelp = function (handle, resource, position) {
            return this._withAdapter(handle, SignatureHelpAdapter, function (adapter) { return adapter.provideSignatureHelp(resource, position); });
        };
        // --- links
        ExtHostLanguageFeatures.prototype.registerDocumentLinkProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter[handle] = new LinkProviderAdapter(this._documents, provider);
            this._proxy.$registerDocumentLinkProvider(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$providDocumentLinks = function (handle, resource) {
            return this._withAdapter(handle, LinkProviderAdapter, function (adapter) { return adapter.provideLinks(resource); });
        };
        // --- configuration
        ExtHostLanguageFeatures.prototype.setLanguageConfiguration = function (languageId, configuration) {
            var wordPattern = configuration.wordPattern;
            // check for a valid word pattern
            if (wordPattern && strings_1.regExpLeadsToEndlessLoop(wordPattern)) {
                throw new Error("Invalid language configuration: wordPattern '" + wordPattern + "' is not allowed to match the empty string.");
            }
            // word definition
            if (wordPattern) {
                this._documents.setWordDefinitionFor(languageId, wordPattern);
            }
            else {
                this._documents.setWordDefinitionFor(languageId, null);
            }
            var handle = this._nextHandle();
            this._proxy.$setLanguageConfiguration(handle, languageId, configuration);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures._handlePool = 0;
        return ExtHostLanguageFeatures;
    }(extHost_protocol_1.ExtHostLanguageFeaturesShape));
    exports.ExtHostLanguageFeatures = ExtHostLanguageFeatures;
});

define(__m[81], __M([0,1,2]), function (require, exports, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ExtHostLanguages = (function () {
        function ExtHostLanguages(threadService) {
            this._proxy = threadService.get(extHost_protocol_1.MainContext.MainThreadLanguages);
        }
        ExtHostLanguages.prototype.getLanguages = function () {
            return this._proxy.$getLanguages();
        };
        return ExtHostLanguages;
    }());
    exports.ExtHostLanguages = ExtHostLanguages;
});

define(__m[82], __M([0,1,2]), function (require, exports, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ExtHostMessageService = (function () {
        function ExtHostMessageService(threadService) {
            this._proxy = threadService.get(extHost_protocol_1.MainContext.MainThreadMessageService);
        }
        ExtHostMessageService.prototype.showMessage = function (severity, message, commands) {
            var items = [];
            for (var handle = 0; handle < commands.length; handle++) {
                var command = commands[handle];
                if (typeof command === 'string') {
                    items.push({ title: command, handle: handle, isCloseAffordance: false });
                }
                else if (typeof command === 'object') {
                    var title = command.title, isCloseAffordance = command.isCloseAffordance;
                    items.push({ title: title, isCloseAffordance: isCloseAffordance, handle: handle });
                }
                else {
                    console.warn('Invalid message item:', command);
                }
            }
            return this._proxy.$showMessage(severity, message, items).then(function (handle) {
                if (typeof handle === 'number') {
                    return commands[handle];
                }
            });
        };
        return ExtHostMessageService;
    }());
    exports.ExtHostMessageService = ExtHostMessageService;
});

define(__m[83], __M([0,1,2]), function (require, exports, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ExtHostOutputChannel = (function () {
        function ExtHostOutputChannel(name, proxy) {
            this._name = name;
            this._id = 'extension-output-#' + (ExtHostOutputChannel._idPool++);
            this._proxy = proxy;
        }
        Object.defineProperty(ExtHostOutputChannel.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        ExtHostOutputChannel.prototype.dispose = function () {
            var _this = this;
            if (!this._disposed) {
                this._proxy.$clear(this._id, this._name).then(function () {
                    _this._disposed = true;
                });
            }
        };
        ExtHostOutputChannel.prototype.append = function (value) {
            this._proxy.$append(this._id, this._name, value);
        };
        ExtHostOutputChannel.prototype.appendLine = function (value) {
            this.append(value + '\n');
        };
        ExtHostOutputChannel.prototype.clear = function () {
            this._proxy.$clear(this._id, this._name);
        };
        ExtHostOutputChannel.prototype.show = function (columnOrPreserveFocus, preserveFocus) {
            if (typeof columnOrPreserveFocus === 'boolean') {
                preserveFocus = columnOrPreserveFocus;
            }
            this._proxy.$reveal(this._id, this._name, preserveFocus);
        };
        ExtHostOutputChannel.prototype.hide = function () {
            this._proxy.$close(this._id);
        };
        ExtHostOutputChannel._idPool = 1;
        return ExtHostOutputChannel;
    }());
    exports.ExtHostOutputChannel = ExtHostOutputChannel;
    var ExtHostOutputService = (function () {
        function ExtHostOutputService(threadService) {
            this._proxy = threadService.get(extHost_protocol_1.MainContext.MainThreadOutputService);
        }
        ExtHostOutputService.prototype.createOutputChannel = function (name) {
            name = name.trim();
            if (!name) {
                throw new Error('illegal argument `name`. must not be falsy');
            }
            else {
                return new ExtHostOutputChannel(name, this._proxy);
            }
        };
        return ExtHostOutputService;
    }());
    exports.ExtHostOutputService = ExtHostOutputService;
});






define(__m[84], __M([0,1,3,2]), function (require, exports, winjs_base_1, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ExtHostQuickOpen = (function (_super) {
        __extends(ExtHostQuickOpen, _super);
        function ExtHostQuickOpen(threadService) {
            _super.call(this);
            this._proxy = threadService.get(extHost_protocol_1.MainContext.MainThreadQuickOpen);
        }
        ExtHostQuickOpen.prototype.show = function (itemsOrItemsPromise, options) {
            var _this = this;
            // clear state from last invocation
            this._onDidSelectItem = undefined;
            var itemsPromise;
            if (!Array.isArray(itemsOrItemsPromise)) {
                itemsPromise = itemsOrItemsPromise;
            }
            else {
                itemsPromise = winjs_base_1.TPromise.as(itemsOrItemsPromise);
            }
            var quickPickWidget = this._proxy.$show({
                autoFocus: { autoFocusFirstEntry: true },
                placeHolder: options && options.placeHolder,
                matchOnDescription: options && options.matchOnDescription,
                matchOnDetail: options && options.matchOnDetail
            });
            return itemsPromise.then(function (items) {
                var pickItems = [];
                for (var handle = 0; handle < items.length; handle++) {
                    var item = items[handle];
                    var label = void 0;
                    var description = void 0;
                    var detail = void 0;
                    if (typeof item === 'string') {
                        label = item;
                    }
                    else {
                        label = item.label;
                        description = item.description;
                        detail = item.detail;
                    }
                    pickItems.push({
                        label: label,
                        description: description,
                        handle: handle,
                        detail: detail
                    });
                }
                // handle selection changes
                if (options && typeof options.onDidSelectItem === 'function') {
                    _this._onDidSelectItem = function (handle) {
                        options.onDidSelectItem(items[handle]);
                    };
                }
                // show items
                _this._proxy.$setItems(pickItems);
                return quickPickWidget.then(function (handle) {
                    if (typeof handle === 'number') {
                        return items[handle];
                    }
                });
            }, function (err) {
                _this._proxy.$setError(err);
                return winjs_base_1.TPromise.wrapError(err);
            });
        };
        ExtHostQuickOpen.prototype.$onItemSelected = function (handle) {
            if (this._onDidSelectItem) {
                this._onDidSelectItem(handle);
            }
        };
        // ---- input
        ExtHostQuickOpen.prototype.input = function (options) {
            this._validateInput = options && options.validateInput;
            return this._proxy.$input(options, options && typeof options.validateInput === 'function');
        };
        ExtHostQuickOpen.prototype.$validateInput = function (input) {
            if (this._validateInput) {
                return winjs_base_1.TPromise.as(this._validateInput(input));
            }
        };
        return ExtHostQuickOpen;
    }(extHost_protocol_1.ExtHostQuickOpenShape));
    exports.ExtHostQuickOpen = ExtHostQuickOpen;
});

define(__m[85], __M([0,1,64,5,2]), function (require, exports, statusbar_1, extHostTypes_1, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ExtHostStatusBarEntry = (function () {
        function ExtHostStatusBarEntry(proxy, alignment, priority) {
            if (alignment === void 0) { alignment = extHostTypes_1.StatusBarAlignment.Left; }
            this._id = ExtHostStatusBarEntry.ID_GEN++;
            this._proxy = proxy;
            this._alignment = alignment;
            this._priority = priority;
        }
        Object.defineProperty(ExtHostStatusBarEntry.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostStatusBarEntry.prototype, "alignment", {
            get: function () {
                return this._alignment;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostStatusBarEntry.prototype, "priority", {
            get: function () {
                return this._priority;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostStatusBarEntry.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (text) {
                this._text = text;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostStatusBarEntry.prototype, "tooltip", {
            get: function () {
                return this._tooltip;
            },
            set: function (tooltip) {
                this._tooltip = tooltip;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostStatusBarEntry.prototype, "color", {
            get: function () {
                return this._color;
            },
            set: function (color) {
                this._color = color;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostStatusBarEntry.prototype, "command", {
            get: function () {
                return this._command;
            },
            set: function (command) {
                this._command = command;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        ExtHostStatusBarEntry.prototype.show = function () {
            this._visible = true;
            this.update();
        };
        ExtHostStatusBarEntry.prototype.hide = function () {
            this._visible = false;
            this._proxy.$dispose(this.id);
        };
        ExtHostStatusBarEntry.prototype.update = function () {
            var _this = this;
            if (this._disposed || !this._visible) {
                return;
            }
            if (this._timeoutHandle) {
                clearTimeout(this._timeoutHandle);
            }
            // Defer the update so that multiple changes to setters dont cause a redraw each
            this._timeoutHandle = setTimeout(function () {
                _this._timeoutHandle = null;
                // Set to status bar
                _this._proxy.$setEntry(_this.id, _this.text, _this.tooltip, _this.command, _this.color, _this._alignment === extHostTypes_1.StatusBarAlignment.Left ? statusbar_1.StatusbarAlignment.LEFT : statusbar_1.StatusbarAlignment.RIGHT, _this._priority);
            }, 0);
        };
        ExtHostStatusBarEntry.prototype.dispose = function () {
            this.hide();
            this._disposed = true;
        };
        ExtHostStatusBarEntry.ID_GEN = 0;
        return ExtHostStatusBarEntry;
    }());
    exports.ExtHostStatusBarEntry = ExtHostStatusBarEntry;
    var StatusBarMessage = (function () {
        function StatusBarMessage(statusBar) {
            this._messages = [];
            this._item = statusBar.createStatusBarEntry(extHostTypes_1.StatusBarAlignment.Left, Number.MIN_VALUE);
        }
        StatusBarMessage.prototype.dispose = function () {
            this._messages.length = 0;
            this._item.dispose();
        };
        StatusBarMessage.prototype.setMessage = function (message) {
            var _this = this;
            var data = { message: message }; // use object to not confuse equal strings
            this._messages.unshift(data);
            this._update();
            return new extHostTypes_1.Disposable(function () {
                var idx = _this._messages.indexOf(data);
                if (idx >= 0) {
                    _this._messages.splice(idx, 1);
                    _this._update();
                }
            });
        };
        StatusBarMessage.prototype._update = function () {
            if (this._messages.length > 0) {
                this._item.text = this._messages[0].message;
                this._item.show();
            }
            else {
                this._item.hide();
            }
        };
        return StatusBarMessage;
    }());
    var ExtHostStatusBar = (function () {
        function ExtHostStatusBar(threadService) {
            this._proxy = threadService.get(extHost_protocol_1.MainContext.MainThreadStatusBar);
            this._statusMessage = new StatusBarMessage(this);
        }
        ExtHostStatusBar.prototype.createStatusBarEntry = function (alignment, priority) {
            return new ExtHostStatusBarEntry(this._proxy, alignment, priority);
        };
        ExtHostStatusBar.prototype.setStatusBarMessage = function (text, timeoutOrThenable) {
            var d = this._statusMessage.setMessage(text);
            var handle;
            if (typeof timeoutOrThenable === 'number') {
                handle = setTimeout(function () { return d.dispose(); }, timeoutOrThenable);
            }
            else if (typeof timeoutOrThenable !== 'undefined') {
                timeoutOrThenable.then(function () { return d.dispose(); }, function () { return d.dispose(); });
            }
            return new extHostTypes_1.Disposable(function () {
                d.dispose();
                clearTimeout(handle);
            });
        };
        return ExtHostStatusBar;
    }());
    exports.ExtHostStatusBar = ExtHostStatusBar;
});

define(__m[86], __M([0,1,2]), function (require, exports, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ExtHostStorage = (function () {
        function ExtHostStorage(threadService) {
            this._proxy = threadService.get(extHost_protocol_1.MainContext.MainThreadStorage);
        }
        ExtHostStorage.prototype.getValue = function (shared, key, defaultValue) {
            return this._proxy.$getValue(shared, key).then(function (value) { return value || defaultValue; });
        };
        ExtHostStorage.prototype.setValue = function (shared, key, value) {
            return this._proxy.$setValue(shared, key, value);
        };
        return ExtHostStorage;
    }());
    exports.ExtHostStorage = ExtHostStorage;
});






define(__m[87], __M([0,1,17,8,13,3,61,16,86,2]), function (require, exports, lifecycle_1, paths, severity_1, winjs_base_1, abstractExtensionService_1, extensionsRegistry_1, extHostStorage_1, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var hasOwnProperty = Object.hasOwnProperty;
    var ExtHostExtension = (function (_super) {
        __extends(ExtHostExtension, _super);
        function ExtHostExtension(activationFailed, module, exports, subscriptions) {
            _super.call(this, activationFailed);
            this.module = module;
            this.exports = exports;
            this.subscriptions = subscriptions;
        }
        return ExtHostExtension;
    }(abstractExtensionService_1.ActivatedExtension));
    exports.ExtHostExtension = ExtHostExtension;
    var ExtHostEmptyExtension = (function (_super) {
        __extends(ExtHostEmptyExtension, _super);
        function ExtHostEmptyExtension() {
            _super.call(this, false, { activate: undefined, deactivate: undefined }, undefined, []);
        }
        return ExtHostEmptyExtension;
    }(ExtHostExtension));
    exports.ExtHostEmptyExtension = ExtHostEmptyExtension;
    var ExtensionMemento = (function () {
        function ExtensionMemento(id, global, storage) {
            var _this = this;
            this._id = id;
            this._shared = global;
            this._storage = storage;
            this._init = this._storage.getValue(this._shared, this._id, Object.create(null)).then(function (value) {
                _this._value = value;
                return _this;
            });
        }
        Object.defineProperty(ExtensionMemento.prototype, "whenReady", {
            get: function () {
                return this._init;
            },
            enumerable: true,
            configurable: true
        });
        ExtensionMemento.prototype.get = function (key, defaultValue) {
            var value = this._value[key];
            if (typeof value === 'undefined') {
                value = defaultValue;
            }
            return value;
        };
        ExtensionMemento.prototype.update = function (key, value) {
            this._value[key] = value;
            return this._storage
                .setValue(this._shared, this._id, this._value)
                .then(function () { return true; });
        };
        return ExtensionMemento;
    }());
    var ExtHostExtensionService = (function (_super) {
        __extends(ExtHostExtensionService, _super);
        /**
         * This class is constructed manually because it is a service, so it doesn't use any ctor injection
         */
        function ExtHostExtensionService(threadService, telemetryService, args) {
            _super.call(this, false);
            this._threadService = threadService;
            this._storage = new extHostStorage_1.ExtHostStorage(threadService);
            this._proxy = this._threadService.get(extHost_protocol_1.MainContext.MainProcessExtensionService);
            this._telemetryService = telemetryService;
            this._workspaceStoragePath = args.workspaceStoragePath;
        }
        ExtHostExtensionService.prototype.$localShowMessage = function (severity, msg) {
            switch (severity) {
                case severity_1.default.Error:
                    console.error(msg);
                    break;
                case severity_1.default.Warning:
                    console.warn(msg);
                    break;
                default:
                    console.log(msg);
            }
        };
        ExtHostExtensionService.prototype.get = function (extensionId) {
            if (!hasOwnProperty.call(this._activatedExtensions, extensionId)) {
                throw new Error('Extension `' + extensionId + '` is not known or not activated');
            }
            return this._activatedExtensions[extensionId].exports;
        };
        ExtHostExtensionService.prototype.deactivate = function (extensionId) {
            var extension = this._activatedExtensions[extensionId];
            if (!extension) {
                return;
            }
            // call deactivate if available
            try {
                if (typeof extension.module.deactivate === 'function') {
                    extension.module.deactivate();
                }
            }
            catch (err) {
            }
            // clean up subscriptions
            try {
                lifecycle_1.dispose(extension.subscriptions);
            }
            catch (err) {
            }
        };
        ExtHostExtensionService.prototype.registrationDone = function (messages) {
            var _this = this;
            this._proxy.$onExtensionHostReady(extensionsRegistry_1.ExtensionsRegistry.getAllExtensionDescriptions(), messages).then(function () {
                // Wait for the main process to acknowledge its receival of the extensions descriptions
                // before allowing extensions to be activated
                _this._triggerOnReady();
            });
        };
        // -- overwriting AbstractExtensionService
        ExtHostExtensionService.prototype._showMessage = function (severity, msg) {
            this._proxy.$localShowMessage(severity, msg);
            this.$localShowMessage(severity, msg);
        };
        ExtHostExtensionService.prototype._createFailedExtension = function () {
            return new ExtHostExtension(true, { activate: undefined, deactivate: undefined }, undefined, []);
        };
        ExtHostExtensionService.prototype._loadExtensionContext = function (extensionDescription) {
            var globalState = new ExtensionMemento(extensionDescription.id, true, this._storage);
            var workspaceState = new ExtensionMemento(extensionDescription.id, false, this._storage);
            var storagePath = this._workspaceStoragePath ? paths.normalize(paths.join(this._workspaceStoragePath, extensionDescription.id)) : undefined;
            return winjs_base_1.TPromise.join([globalState.whenReady, workspaceState.whenReady]).then(function () {
                return Object.freeze({
                    globalState: globalState,
                    workspaceState: workspaceState,
                    subscriptions: [],
                    get extensionPath() { return extensionDescription.extensionFolderPath; },
                    storagePath: storagePath,
                    asAbsolutePath: function (relativePath) { return paths.normalize(paths.join(extensionDescription.extensionFolderPath, relativePath), true); }
                });
            });
        };
        ExtHostExtensionService.prototype._actualActivateExtension = function (extensionDescription) {
            var _this = this;
            return this._doActualActivateExtension(extensionDescription).then(function (activatedExtension) {
                _this._proxy.$onExtensionActivated(extensionDescription.id);
                return activatedExtension;
            }, function (err) {
                _this._proxy.$onExtensionActivationFailed(extensionDescription.id);
                throw err;
            });
        };
        ExtHostExtensionService.prototype._doActualActivateExtension = function (extensionDescription) {
            var _this = this;
            var event = getTelemetryActivationEvent(extensionDescription);
            this._telemetryService.publicLog('activatePlugin', event);
            if (!extensionDescription.main) {
                // Treat the extension as being empty => NOT AN ERROR CASE
                return winjs_base_1.TPromise.as(new ExtHostEmptyExtension());
            }
            return loadCommonJSModule(extensionDescription.main).then(function (extensionModule) {
                return _this._loadExtensionContext(extensionDescription).then(function (context) {
                    return ExtHostExtensionService._callActivate(extensionModule, context);
                });
            });
        };
        ExtHostExtensionService._callActivate = function (extensionModule, context) {
            // Make sure the extension's surface is not undefined
            extensionModule = extensionModule || {
                activate: undefined,
                deactivate: undefined
            };
            return this._callActivateOptional(extensionModule, context).then(function (extensionExports) {
                return new ExtHostExtension(false, extensionModule, extensionExports, context.subscriptions);
            });
        };
        ExtHostExtensionService._callActivateOptional = function (extensionModule, context) {
            if (typeof extensionModule.activate === 'function') {
                try {
                    return winjs_base_1.TPromise.as(extensionModule.activate.apply(global, [context]));
                }
                catch (err) {
                    return winjs_base_1.TPromise.wrapError(err);
                }
            }
            else {
                // No activate found => the module is the extension's exports
                return winjs_base_1.TPromise.as(extensionModule);
            }
        };
        // -- called by main thread
        ExtHostExtensionService.prototype.$activateExtension = function (extensionDescription) {
            return this._activateExtension(extensionDescription);
        };
        return ExtHostExtensionService;
    }(abstractExtensionService_1.AbstractExtensionService));
    exports.ExtHostExtensionService = ExtHostExtensionService;
    function loadCommonJSModule(modulePath) {
        var r = null;
        try {
            r = require.__$__nodeRequire(modulePath);
        }
        catch (e) {
            return winjs_base_1.TPromise.wrapError(e);
        }
        return winjs_base_1.TPromise.as(r);
    }
    function getTelemetryActivationEvent(extensionDescription) {
        var event = {
            id: extensionDescription.id,
            name: extensionDescription.name,
            publisherDisplayName: extensionDescription.publisher,
            activationEvents: extensionDescription.activationEvents ? extensionDescription.activationEvents.join(',') : null,
            isBuiltin: extensionDescription.isBuiltin
        };
        for (var contribution in extensionDescription.contributes) {
            var contributionDetails = extensionDescription.contributes[contribution];
            if (!contributionDetails) {
                continue;
            }
            switch (contribution) {
                case 'debuggers':
                    var types = contributionDetails.reduce(function (p, c) { return p ? p + ',' + c['type'] : c['type']; }, '');
                    event['contribution.debuggers'] = types;
                    break;
                case 'grammars':
                    var grammers = contributionDetails.reduce(function (p, c) { return p ? p + ',' + c['language'] : c['language']; }, '');
                    event['contribution.grammars'] = grammers;
                    break;
                case 'languages':
                    var languages = contributionDetails.reduce(function (p, c) { return p ? p + ',' + c['id'] : c['id']; }, '');
                    event['contribution.languages'] = languages;
                    break;
                case 'tmSnippets':
                    var tmSnippets = contributionDetails.reduce(function (p, c) { return p ? p + ',' + c['languageId'] : c['languageId']; }, '');
                    event['contribution.tmSnippets'] = tmSnippets;
                    break;
                default:
                    event[("contribution." + contribution)] = true;
            }
        }
        return event;
    }
});

define(__m[88], __M([0,1,4,3,2]), function (require, exports, errors_1, winjs_base_1, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var RemoteTelemetryService = (function () {
        function RemoteTelemetryService(name, threadService) {
            this._name = name;
            this._proxy = threadService.get(extHost_protocol_1.MainContext.MainThreadTelemetry);
        }
        Object.defineProperty(RemoteTelemetryService.prototype, "isOptedIn", {
            get: function () {
                throw errors_1.notImplemented();
            },
            enumerable: true,
            configurable: true
        });
        RemoteTelemetryService.prototype.getTelemetryInfo = function () {
            return this._proxy.$getTelemetryInfo();
        };
        RemoteTelemetryService.prototype.publicLog = function (eventName, data) {
            data = data || Object.create(null);
            data[this._name] = true;
            this._proxy.$publicLog(eventName, data);
            return winjs_base_1.TPromise.as(null);
        };
        RemoteTelemetryService.prototype.timedPublicLog = function () {
            throw errors_1.notImplemented();
        };
        RemoteTelemetryService.prototype.addTelemetryAppender = function () {
            throw errors_1.notImplemented();
        };
        return RemoteTelemetryService;
    }());
    exports.RemoteTelemetryService = RemoteTelemetryService;
});

define(__m[40], __M([0,1,11,2]), function (require, exports, extHostTypeConverters_1, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ExtHostWorkspace = (function () {
        function ExtHostWorkspace(threadService, workspacePath) {
            this._proxy = threadService.get(extHost_protocol_1.MainContext.MainThreadWorkspace);
            this._workspacePath = workspacePath;
        }
        ExtHostWorkspace.prototype.getPath = function () {
            return this._workspacePath;
        };
        ExtHostWorkspace.prototype.getRelativePath = function (pathOrUri) {
            var path;
            if (typeof pathOrUri === 'string') {
                path = pathOrUri;
            }
            else {
                path = pathOrUri.fsPath;
            }
            if (this._workspacePath && this._workspacePath.length < path.length) {
                // return relative(workspacePath, path);
                return path.substring(this._workspacePath.length);
            }
            return path;
        };
        ExtHostWorkspace.prototype.findFiles = function (include, exclude, maxResults, token) {
            var _this = this;
            var requestId = ExtHostWorkspace._requestIdPool++;
            var result = this._proxy.$startSearch(include, exclude, maxResults, requestId);
            if (token) {
                token.onCancellationRequested(function () { return _this._proxy.$cancelSearch(requestId); });
            }
            return result;
        };
        ExtHostWorkspace.prototype.saveAll = function (includeUntitled) {
            return this._proxy.$saveAll(includeUntitled);
        };
        ExtHostWorkspace.prototype.appyEdit = function (edit) {
            var resourceEdits = [];
            var entries = edit.entries();
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var entry = entries_1[_i];
                var uri = entry[0], edits = entry[1];
                for (var _a = 0, edits_1 = edits; _a < edits_1.length; _a++) {
                    var edit_1 = edits_1[_a];
                    resourceEdits.push({
                        resource: uri,
                        newText: edit_1.newText,
                        range: extHostTypeConverters_1.fromRange(edit_1.range)
                    });
                }
            }
            return this._proxy.$applyWorkspaceEdit(resourceEdits);
        };
        ExtHostWorkspace._requestIdPool = 0;
        return ExtHostWorkspace;
    }());
    exports.ExtHostWorkspace = ExtHostWorkspace;
});

define(__m[35], __M([0,1,6,25,14,4,79,77,75,76,40,84,85,74,83,82,78,81,80,11,68,5,42,10,13,48,16,24,8,2]), function (require, exports, event_1, languageSelector_1, Platform, errors, extHostFileSystemEventService_1, extHostDocuments_1, extHostConfiguration_1, extHostDiagnostics_1, extHostWorkspace_1, extHostQuickOpen_1, extHostStatusBar_1, extHostCommands_1, extHostOutputService_1, extHostMessageService_1, extHostEditors_1, extHostLanguages_1, extHostLanguageFeatures_1, ExtHostTypeConverters, extHostApiCommands_1, extHostTypes, Modes, uri_1, severity_1, EditorCommon, extensionsRegistry_1, cancellation_1, paths, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * This class implements the API described in vscode.d.ts,
     * for the case of the extensionHost host process
     */
    var ExtHostAPIImplementation = (function () {
        function ExtHostAPIImplementation(threadService, extensionService, contextService, telemetryService) {
            // Addressable instances
            var col = new extHost_protocol_1.InstanceCollection();
            var extHostDocuments = col.define(extHost_protocol_1.ExtHostContext.ExtHostDocuments).set(new extHostDocuments_1.ExtHostDocuments(threadService));
            var extHostEditors = col.define(extHost_protocol_1.ExtHostContext.ExtHostEditors).set(new extHostEditors_1.ExtHostEditors(threadService, extHostDocuments));
            var extHostCommands = col.define(extHost_protocol_1.ExtHostContext.ExtHostCommands).set(new extHostCommands_1.ExtHostCommands(threadService, extHostEditors));
            var extHostConfiguration = col.define(extHost_protocol_1.ExtHostContext.ExtHostConfiguration).set(new extHostConfiguration_1.ExtHostConfiguration());
            var extHostDiagnostics = col.define(extHost_protocol_1.ExtHostContext.ExtHostDiagnostics).set(new extHostDiagnostics_1.ExtHostDiagnostics(threadService));
            var languageFeatures = col.define(extHost_protocol_1.ExtHostContext.ExtHostLanguageFeatures).set(new extHostLanguageFeatures_1.ExtHostLanguageFeatures(threadService, extHostDocuments, extHostCommands, extHostDiagnostics));
            var extHostFileSystemEvent = col.define(extHost_protocol_1.ExtHostContext.ExtHostFileSystemEventService).set(new extHostFileSystemEventService_1.ExtHostFileSystemEventService());
            var extHostQuickOpen = col.define(extHost_protocol_1.ExtHostContext.ExtHostQuickOpen).set(new extHostQuickOpen_1.ExtHostQuickOpen(threadService));
            col.define(extHost_protocol_1.ExtHostContext.ExtHostExtensionService).set(extensionService);
            col.finish(false, threadService);
            // Others
            var mainThreadErrors = threadService.get(extHost_protocol_1.MainContext.MainThreadErrors);
            errors.setUnexpectedErrorHandler(function (err) {
                mainThreadErrors.onUnexpectedExtHostError(errors.transformErrorForSerialization(err));
            });
            var extHostMessageService = new extHostMessageService_1.ExtHostMessageService(threadService);
            var extHostStatusBar = new extHostStatusBar_1.ExtHostStatusBar(threadService);
            var extHostOutputService = new extHostOutputService_1.ExtHostOutputService(threadService);
            var workspacePath = contextService.getWorkspace() ? contextService.getWorkspace().resource.fsPath : undefined;
            var extHostWorkspace = new extHostWorkspace_1.ExtHostWorkspace(threadService, workspacePath);
            var languages = new extHostLanguages_1.ExtHostLanguages(threadService);
            // the converter might create delegate commands to avoid sending args
            // around all the time
            ExtHostTypeConverters.Command.initialize(extHostCommands);
            extHostApiCommands_1.registerApiCommands(extHostCommands);
            this.version = contextService.getConfiguration().env.version;
            this.Uri = uri_1.default;
            this.Location = extHostTypes.Location;
            this.Diagnostic = extHostTypes.Diagnostic;
            this.DiagnosticSeverity = extHostTypes.DiagnosticSeverity;
            this.EventEmitter = event_1.Emitter;
            this.Disposable = extHostTypes.Disposable;
            this.TextEdit = extHostTypes.TextEdit;
            this.WorkspaceEdit = extHostTypes.WorkspaceEdit;
            this.Position = extHostTypes.Position;
            this.Range = extHostTypes.Range;
            this.Selection = extHostTypes.Selection;
            this.CancellationTokenSource = cancellation_1.CancellationTokenSource;
            this.Hover = extHostTypes.Hover;
            this.SymbolKind = extHostTypes.SymbolKind;
            this.SymbolInformation = extHostTypes.SymbolInformation;
            this.DocumentHighlightKind = extHostTypes.DocumentHighlightKind;
            this.DocumentHighlight = extHostTypes.DocumentHighlight;
            this.CodeLens = extHostTypes.CodeLens;
            this.ParameterInformation = extHostTypes.ParameterInformation;
            this.SignatureInformation = extHostTypes.SignatureInformation;
            this.SignatureHelp = extHostTypes.SignatureHelp;
            this.CompletionItem = extHostTypes.CompletionItem;
            this.CompletionItemKind = extHostTypes.CompletionItemKind;
            this.CompletionList = extHostTypes.CompletionList;
            this.DocumentLink = extHostTypes.DocumentLink;
            this.ViewColumn = extHostTypes.ViewColumn;
            this.StatusBarAlignment = extHostTypes.StatusBarAlignment;
            this.IndentAction = Modes.IndentAction;
            this.OverviewRulerLane = EditorCommon.OverviewRulerLane;
            this.TextEditorRevealType = extHostTypes.TextEditorRevealType;
            this.EndOfLine = extHostTypes.EndOfLine;
            this.TextEditorCursorStyle = EditorCommon.TextEditorCursorStyle;
            // env namespace
            var telemetryInfo;
            this.env = Object.freeze({
                get machineId() { return telemetryInfo.machineId; },
                get sessionId() { return telemetryInfo.sessionId; },
                get language() { return Platform.language; },
                get appName() { return contextService.getConfiguration().env.appName; }
            });
            telemetryService.getTelemetryInfo().then(function (info) { return telemetryInfo = info; }, errors.onUnexpectedError);
            // commands namespace
            this.commands = {
                registerCommand: function (id, command, thisArgs) {
                    return extHostCommands.registerCommand(id, command, thisArgs);
                },
                registerTextEditorCommand: function (id, callback, thisArg) {
                    return extHostCommands.registerCommand(id, function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i - 0] = arguments[_i];
                        }
                        var activeTextEditor = extHostEditors.getActiveTextEditor();
                        if (!activeTextEditor) {
                            console.warn('Cannot execute ' + id + ' because there is no active text editor.');
                            return;
                        }
                        return activeTextEditor.edit(function (edit) {
                            args.unshift(activeTextEditor, edit);
                            callback.apply(thisArg, args);
                        }).then(function (result) {
                            if (!result) {
                                console.warn('Edits from command ' + id + ' were not applied.');
                            }
                        }, function (err) {
                            console.warn('An error occured while running command ' + id, err);
                        });
                    });
                },
                executeCommand: function (id) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    return extHostCommands.executeCommand.apply(extHostCommands, [id].concat(args));
                },
                getCommands: function (filterInternal) {
                    if (filterInternal === void 0) { filterInternal = false; }
                    return extHostCommands.getCommands(filterInternal);
                }
            };
            this.window = {
                get activeTextEditor() {
                    return extHostEditors.getActiveTextEditor();
                },
                get visibleTextEditors() {
                    return extHostEditors.getVisibleTextEditors();
                },
                showTextDocument: function (document, column, preserveFocus) {
                    return extHostEditors.showTextDocument(document, column, preserveFocus);
                },
                createTextEditorDecorationType: function (options) {
                    return extHostEditors.createTextEditorDecorationType(options);
                },
                onDidChangeActiveTextEditor: extHostEditors.onDidChangeActiveTextEditor.bind(extHostEditors),
                onDidChangeTextEditorSelection: function (listener, thisArgs, disposables) {
                    return extHostEditors.onDidChangeTextEditorSelection(listener, thisArgs, disposables);
                },
                onDidChangeTextEditorOptions: function (listener, thisArgs, disposables) {
                    return extHostEditors.onDidChangeTextEditorOptions(listener, thisArgs, disposables);
                },
                onDidChangeTextEditorViewColumn: function (listener, thisArg, disposables) {
                    return extHostEditors.onDidChangeTextEditorViewColumn(listener, thisArg, disposables);
                },
                showInformationMessage: function (message) {
                    var items = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        items[_i - 1] = arguments[_i];
                    }
                    return extHostMessageService.showMessage(severity_1.default.Info, message, items);
                },
                showWarningMessage: function (message) {
                    var items = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        items[_i - 1] = arguments[_i];
                    }
                    return extHostMessageService.showMessage(severity_1.default.Warning, message, items);
                },
                showErrorMessage: function (message) {
                    var items = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        items[_i - 1] = arguments[_i];
                    }
                    return extHostMessageService.showMessage(severity_1.default.Error, message, items);
                },
                showQuickPick: function (items, options) {
                    return extHostQuickOpen.show(items, options);
                },
                showInputBox: function (options) {
                    return extHostQuickOpen.input(options);
                },
                createStatusBarItem: function (position, priority) {
                    return extHostStatusBar.createStatusBarEntry(position, priority);
                },
                setStatusBarMessage: function (text, timeoutOrThenable) {
                    return extHostStatusBar.setStatusBarMessage(text, timeoutOrThenable);
                },
                createOutputChannel: function (name) {
                    return extHostOutputService.createOutputChannel(name);
                }
            };
            this.workspace = Object.freeze({
                get rootPath() {
                    return extHostWorkspace.getPath();
                },
                set rootPath(value) {
                    throw errors.readonly();
                },
                asRelativePath: function (pathOrUri) {
                    return extHostWorkspace.getRelativePath(pathOrUri);
                },
                findFiles: function (include, exclude, maxResults, token) {
                    return extHostWorkspace.findFiles(include, exclude, maxResults, token);
                },
                saveAll: function (includeUntitled) {
                    return extHostWorkspace.saveAll(includeUntitled);
                },
                applyEdit: function (edit) {
                    return extHostWorkspace.appyEdit(edit);
                },
                createFileSystemWatcher: function (pattern, ignoreCreate, ignoreChange, ignoreDelete) {
                    return extHostFileSystemEvent.createFileSystemWatcher(pattern, ignoreCreate, ignoreChange, ignoreDelete);
                },
                get textDocuments() {
                    return extHostDocuments.getAllDocumentData().map(function (data) { return data.document; });
                },
                set textDocuments(value) {
                    throw errors.readonly();
                },
                openTextDocument: function (uriOrFileName) {
                    var uri;
                    if (typeof uriOrFileName === 'string') {
                        uri = uri_1.default.file(uriOrFileName);
                    }
                    else if (uriOrFileName instanceof uri_1.default) {
                        uri = uriOrFileName;
                    }
                    else {
                        throw new Error('illegal argument - uriOrFileName');
                    }
                    return extHostDocuments.ensureDocumentData(uri).then(function () {
                        var data = extHostDocuments.getDocumentData(uri);
                        return data && data.document;
                    });
                },
                registerTextDocumentContentProvider: function (scheme, provider) {
                    return extHostDocuments.registerTextDocumentContentProvider(scheme, provider);
                },
                onDidOpenTextDocument: function (listener, thisArgs, disposables) {
                    return extHostDocuments.onDidAddDocument(listener, thisArgs, disposables);
                },
                onDidCloseTextDocument: function (listener, thisArgs, disposables) {
                    return extHostDocuments.onDidRemoveDocument(listener, thisArgs, disposables);
                },
                onDidChangeTextDocument: function (listener, thisArgs, disposables) {
                    return extHostDocuments.onDidChangeDocument(listener, thisArgs, disposables);
                },
                onDidSaveTextDocument: function (listener, thisArgs, disposables) {
                    return extHostDocuments.onDidSaveDocument(listener, thisArgs, disposables);
                },
                onDidChangeConfiguration: function (listener, thisArgs, disposables) {
                    return extHostConfiguration.onDidChangeConfiguration(listener, thisArgs, disposables);
                },
                getConfiguration: function (section) {
                    return extHostConfiguration.getConfiguration(section);
                }
            });
            this.languages = {
                createDiagnosticCollection: function (name) {
                    return extHostDiagnostics.createDiagnosticCollection(name);
                },
                getLanguages: function () {
                    return languages.getLanguages();
                },
                match: function (selector, document) {
                    return languageSelector_1.score(selector, document.uri, document.languageId);
                },
                registerCodeActionsProvider: function (selector, provider) {
                    return languageFeatures.registerCodeActionProvider(selector, provider);
                },
                registerCodeLensProvider: function (selector, provider) {
                    return languageFeatures.registerCodeLensProvider(selector, provider);
                },
                registerDefinitionProvider: function (selector, provider) {
                    return languageFeatures.registerDefinitionProvider(selector, provider);
                },
                registerHoverProvider: function (selector, provider) {
                    return languageFeatures.registerHoverProvider(selector, provider);
                },
                registerDocumentHighlightProvider: function (selector, provider) {
                    return languageFeatures.registerDocumentHighlightProvider(selector, provider);
                },
                registerReferenceProvider: function (selector, provider) {
                    return languageFeatures.registerReferenceProvider(selector, provider);
                },
                registerRenameProvider: function (selector, provider) {
                    return languageFeatures.registerRenameProvider(selector, provider);
                },
                registerDocumentSymbolProvider: function (selector, provider) {
                    return languageFeatures.registerDocumentSymbolProvider(selector, provider);
                },
                registerWorkspaceSymbolProvider: function (provider) {
                    return languageFeatures.registerWorkspaceSymbolProvider(provider);
                },
                registerDocumentFormattingEditProvider: function (selector, provider) {
                    return languageFeatures.registerDocumentFormattingEditProvider(selector, provider);
                },
                registerDocumentRangeFormattingEditProvider: function (selector, provider) {
                    return languageFeatures.registerDocumentRangeFormattingEditProvider(selector, provider);
                },
                registerOnTypeFormattingEditProvider: function (selector, provider, firstTriggerCharacter) {
                    var moreTriggerCharacters = [];
                    for (var _i = 3; _i < arguments.length; _i++) {
                        moreTriggerCharacters[_i - 3] = arguments[_i];
                    }
                    return languageFeatures.registerOnTypeFormattingEditProvider(selector, provider, [firstTriggerCharacter].concat(moreTriggerCharacters));
                },
                registerSignatureHelpProvider: function (selector, provider) {
                    var triggerCharacters = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        triggerCharacters[_i - 2] = arguments[_i];
                    }
                    return languageFeatures.registerSignatureHelpProvider(selector, provider, triggerCharacters);
                },
                registerCompletionItemProvider: function (selector, provider) {
                    var triggerCharacters = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        triggerCharacters[_i - 2] = arguments[_i];
                    }
                    return languageFeatures.registerCompletionItemProvider(selector, provider, triggerCharacters);
                },
                registerDocumentLinkProvider: function (selector, provider) {
                    return languageFeatures.registerDocumentLinkProvider(selector, provider);
                },
                setLanguageConfiguration: function (language, configuration) {
                    return languageFeatures.setLanguageConfiguration(language, configuration);
                }
            };
            this.extensions = {
                getExtension: function (extensionId) {
                    var desc = extensionsRegistry_1.ExtensionsRegistry.getExtensionDescription(extensionId);
                    if (desc) {
                        return new Extension(extensionService, desc);
                    }
                },
                get all() {
                    return extensionsRegistry_1.ExtensionsRegistry.getAllExtensionDescriptions().map(function (desc) { return new Extension(extensionService, desc); });
                }
            };
        }
        return ExtHostAPIImplementation;
    }());
    exports.ExtHostAPIImplementation = ExtHostAPIImplementation;
    var Extension = (function () {
        function Extension(extensionService, description) {
            this._extensionService = extensionService;
            this.id = description.id;
            this.extensionPath = paths.normalize(description.extensionFolderPath, true);
            this.packageJSON = description;
        }
        Object.defineProperty(Extension.prototype, "isActive", {
            get: function () {
                return this._extensionService.isActivated(this.id);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "exports", {
            get: function () {
                return this._extensionService.get(this.id);
            },
            enumerable: true,
            configurable: true
        });
        Extension.prototype.activate = function () {
            var _this = this;
            return this._extensionService.activateById(this.id).then(function () { return _this.exports; });
        };
        return Extension;
    }());
    function defineAPI(impl) {
        var node_module = require.__$__nodeRequire('module');
        var original = node_module._load;
        node_module._load = function load(request, parent, isMain) {
            if (request === 'vscode') {
                return impl;
            }
            return original.apply(this, arguments);
        };
        define('vscode', [], impl);
    }
    exports.defineAPI = defineAPI;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[32], __M([0,1,29,92,52,21,10,3,8,16,35,87,71,88,65,69,54]), function (require, exports, fs, crypto, nls, pfs, uri_1, winjs_base_1, paths, extensionsRegistry_1, extHost_api_impl_1, extHostExtensionService_1, extHostThreadService_1, extHostTelemetry_1, baseWorkspaceContextService_1, extensionPoints_1, extensionManagementIpc_1) {
    'use strict';
    var DIRNAME = uri_1.default.parse(require.toUrl('./')).fsPath;
    var BASE_PATH = paths.normalize(paths.join(DIRNAME, '../../../..'));
    var BUILTIN_EXTENSIONS_PATH = paths.join(BASE_PATH, 'extensions');
    var nativeExit = process.exit.bind(process);
    process.exit = function () {
        var err = new Error('An extension called process.exit() and this was prevented.');
        console.warn(err.stack);
    };
    function exit(code) {
        nativeExit(code);
    }
    exports.exit = exit;
    var ExtensionHostMain = (function () {
        function ExtensionHostMain(remoteCom, initData, sharedProcessClient) {
            this._isTerminating = false;
            this._contextService = new baseWorkspaceContextService_1.BaseWorkspaceContextService(initData.contextService.workspace, initData.contextService.configuration, initData.contextService.options);
            var workspaceStoragePath = this._getOrCreateWorkspaceStoragePath();
            var threadService = new extHostThreadService_1.ExtHostThreadService(remoteCom);
            var telemetryService = new extHostTelemetry_1.RemoteTelemetryService('pluginHostTelemetry', threadService);
            this._extensionService = new extHostExtensionService_1.ExtHostExtensionService(threadService, telemetryService, { _serviceBrand: 'optionalArgs', workspaceStoragePath: workspaceStoragePath });
            // Connect to shared process services
            var channel = sharedProcessClient.getChannel('extensions');
            var extensionsService = new extensionManagementIpc_1.ExtensionManagementChannelClient(channel);
            if (false && false) {
                // TODO: what to do with the ExtensionManagementChannelClient?
                console.log(extensionsService);
            }
            // Create the ext host API
            extHost_api_impl_1.defineAPI(new extHost_api_impl_1.ExtHostAPIImplementation(threadService, this._extensionService, this._contextService, telemetryService));
        }
        ExtensionHostMain.prototype._getOrCreateWorkspaceStoragePath = function () {
            var workspaceStoragePath;
            var workspace = this._contextService.getWorkspace();
            var env = this._contextService.getConfiguration().env;
            function rmkDir(directory) {
                console.log('Creating Directory ' + directory);
                try {
                    fs.mkdirSync(directory);
                    return true;
                }
                catch (err) {
                    if (err.code === 'ENOENT') {
                        if (rmkDir(paths.dirname(directory))) {
                            fs.mkdirSync(directory);
                            return true;
                        }
                    }
                    else {
                        return fs.statSync(directory).isDirectory();
                    }
                }
            }
            if (workspace) {
                var hash = crypto.createHash('md5');
                hash.update(workspace.resource.fsPath);
                if (workspace.uid) {
                    hash.update(workspace.uid.toString());
                }
                workspaceStoragePath = paths.join(env.appSettingsHome, 'workspaceStorage', hash.digest('hex'));
                if (!fs.existsSync(workspaceStoragePath)) {
                    try {
                        if (rmkDir(workspaceStoragePath)) {
                            fs.writeFileSync(paths.join(workspaceStoragePath, 'meta.json'), JSON.stringify({
                                workspacePath: workspace.resource.fsPath,
                                uid: workspace.uid ? workspace.uid : null
                            }, null, 4));
                        }
                        else {
                            workspaceStoragePath = undefined;
                        }
                    }
                    catch (err) {
                        workspaceStoragePath = undefined;
                    }
                }
            }
            return workspaceStoragePath;
        };
        ExtensionHostMain.prototype.start = function () {
            return this.readExtensions();
        };
        ExtensionHostMain.prototype.terminate = function () {
            var _this = this;
            if (this._isTerminating) {
                // we are already shutting down...
                return;
            }
            this._isTerminating = true;
            try {
                var allExtensions = extensionsRegistry_1.ExtensionsRegistry.getAllExtensionDescriptions();
                var allExtensionsIds = allExtensions.map(function (ext) { return ext.id; });
                var activatedExtensions = allExtensionsIds.filter(function (id) { return _this._extensionService.isActivated(id); });
                activatedExtensions.forEach(function (extensionId) {
                    _this._extensionService.deactivate(extensionId);
                });
            }
            catch (err) {
            }
            // Give extensions 1 second to wrap up any async dispose, then exit
            setTimeout(function () {
                exit();
            }, 1000);
        };
        ExtensionHostMain.prototype.readExtensions = function () {
            var _this = this;
            var collector = new extensionPoints_1.MessagesCollector();
            var env = this._contextService.getConfiguration().env;
            return ExtensionHostMain.scanExtensions(collector, BUILTIN_EXTENSIONS_PATH, !env.disableExtensions ? env.userExtensionsHome : void 0, !env.disableExtensions ? env.extensionDevelopmentPath : void 0, env.version)
                .then(null, function (err) {
                collector.error('', err);
                return [];
            })
                .then(function (extensions) {
                // Register & Signal done
                extensionsRegistry_1.ExtensionsRegistry.registerExtensions(extensions);
                _this._extensionService.registrationDone(collector.getMessages());
            })
                .then(function () { return _this.handleEagerExtensions(); })
                .then(function () { return _this.handleExtensionTests(); });
        };
        ExtensionHostMain.scanExtensions = function (collector, builtinExtensionsPath, userInstallPath, extensionDevelopmentPath, version) {
            var builtinExtensions = extensionPoints_1.ExtensionScanner.scanExtensions(version, collector, builtinExtensionsPath, true);
            var userExtensions = !userInstallPath ? winjs_base_1.TPromise.as([]) : extensionPoints_1.ExtensionScanner.scanExtensions(version, collector, userInstallPath, false);
            var developedExtensions = !extensionDevelopmentPath ? winjs_base_1.TPromise.as([]) : extensionPoints_1.ExtensionScanner.scanOneOrMultipleExtensions(version, collector, extensionDevelopmentPath, false);
            return winjs_base_1.TPromise.join([builtinExtensions, userExtensions, developedExtensions]).then(function (_) {
                var builtinExtensions = _[0];
                var userExtensions = _[1];
                var developedExtensions = _[2];
                var result = {};
                builtinExtensions.forEach(function (builtinExtension) {
                    result[builtinExtension.id] = builtinExtension;
                });
                userExtensions.forEach(function (userExtension) {
                    if (result.hasOwnProperty(userExtension.id)) {
                        collector.warn(userExtension.extensionFolderPath, nls.localize(0, null, result[userExtension.id].extensionFolderPath, userExtension.extensionFolderPath));
                    }
                    result[userExtension.id] = userExtension;
                });
                developedExtensions.forEach(function (developedExtension) {
                    collector.info('', nls.localize(1, null, developedExtension.extensionFolderPath));
                    if (result.hasOwnProperty(developedExtension.id)) {
                        collector.warn(developedExtension.extensionFolderPath, nls.localize(2, null, result[developedExtension.id].extensionFolderPath, developedExtension.extensionFolderPath));
                    }
                    result[developedExtension.id] = developedExtension;
                });
                return Object.keys(result).map(function (name) { return result[name]; });
            });
        };
        // Handle "eager" activation extensions
        ExtensionHostMain.prototype.handleEagerExtensions = function () {
            this._extensionService.activateByEvent('*').then(null, function (err) {
                console.error(err);
            });
            return this.handleWorkspaceContainsEagerExtensions();
        };
        ExtensionHostMain.prototype.handleWorkspaceContainsEagerExtensions = function () {
            var _this = this;
            var workspace = this._contextService.getWorkspace();
            if (!workspace || !workspace.resource) {
                return winjs_base_1.TPromise.as(null);
            }
            var folderPath = workspace.resource.fsPath;
            var desiredFilesMap = {};
            extensionsRegistry_1.ExtensionsRegistry.getAllExtensionDescriptions().forEach(function (desc) {
                var activationEvents = desc.activationEvents;
                if (!activationEvents) {
                    return;
                }
                for (var i = 0; i < activationEvents.length; i++) {
                    if (/^workspaceContains:/.test(activationEvents[i])) {
                        var fileName = activationEvents[i].substr('workspaceContains:'.length);
                        desiredFilesMap[fileName] = true;
                    }
                }
            });
            return winjs_base_1.TPromise.join(Object.keys(desiredFilesMap).map(function (fileName) { return pfs.fileExistsWithResult(paths.join(folderPath, fileName), fileName); })).then(function (fileNames) {
                fileNames.forEach(function (existingFileName) {
                    if (!existingFileName) {
                        return;
                    }
                    var activationEvent = 'workspaceContains:' + existingFileName;
                    _this._extensionService.activateByEvent(activationEvent).then(null, function (err) {
                        console.error(err);
                    });
                });
            });
        };
        ExtensionHostMain.prototype.handleExtensionTests = function () {
            var _this = this;
            var env = this._contextService.getConfiguration().env;
            if (!env.extensionTestsPath || !env.extensionDevelopmentPath) {
                return winjs_base_1.TPromise.as(null);
            }
            // Require the test runner via node require from the provided path
            var testRunner;
            var requireError;
            try {
                testRunner = require.__$__nodeRequire(env.extensionTestsPath);
            }
            catch (error) {
                requireError = error;
            }
            // Execute the runner if it follows our spec
            if (testRunner && typeof testRunner.run === 'function') {
                return new winjs_base_1.TPromise(function (c, e) {
                    testRunner.run(env.extensionTestsPath, function (error, failures) {
                        if (error) {
                            e(error.toString());
                        }
                        else {
                            c(null);
                        }
                        // after tests have run, we shutdown the host
                        _this.gracefulExit(failures && failures > 0 ? 1 /* ERROR */ : 0 /* OK */);
                    });
                });
            }
            else {
                this.gracefulExit(1 /* ERROR */);
            }
            return winjs_base_1.TPromise.wrapError(requireError ? requireError.toString() : nls.localize(3, null, env.extensionTestsPath));
        };
        ExtensionHostMain.prototype.gracefulExit = function (code) {
            // to give the PH process a chance to flush any outstanding console
            // messages to the main process, we delay the exit() by some time
            setTimeout(function () { return exit(code); }, 500);
        };
        return ExtensionHostMain;
    }());
    exports.ExtensionHostMain = ExtensionHostMain;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[93], __M([0,1,4,3,32,39,55,27]), function (require, exports, errors_1, winjs_base_1, extensionHostMain_1, ipc_net_1, ipcRemoteCom_1, marshalling) {
    'use strict';
    // This calls exit directly in case the initialization is not finished and we need to exit
    // Otherwise, if initialization completed we go to extensionHostMain.terminate()
    var onTerminate = function () {
        extensionHostMain_1.exit();
    };
    function connectToRenderer() {
        return new winjs_base_1.TPromise(function (c, e) {
            var stats = [];
            // Listen init data message
            process.once('message', function (raw) {
                var msg = marshalling.parse(raw);
                var remoteCom = ipcRemoteCom_1.create(function (data) {
                    process.send(data);
                    stats.push(data.length);
                });
                // Listen to all other messages
                process.on('message', function (msg) {
                    if (msg.type === '__$terminate') {
                        onTerminate();
                        return;
                    }
                    remoteCom.handle(msg);
                });
                // Print a console message when rejection isn't handled within N seconds. For details:
                // see https://nodejs.org/api/process.html#process_event_unhandledrejection
                // and https://nodejs.org/api/process.html#process_event_rejectionhandled
                var unhandledPromises = [];
                process.on('unhandledRejection', function (reason, promise) {
                    unhandledPromises.push(promise);
                    setTimeout(function () {
                        var idx = unhandledPromises.indexOf(promise);
                        if (idx >= 0) {
                            unhandledPromises.splice(idx, 1);
                            console.warn('rejected promise not handled with 1 second');
                            errors_1.onUnexpectedError(reason);
                        }
                    }, 1000);
                });
                process.on('rejectionHandled', function (promise) {
                    var idx = unhandledPromises.indexOf(promise);
                    if (idx >= 0) {
                        unhandledPromises.splice(idx, 1);
                    }
                });
                // Print a console message when an exception isn't handled.
                process.on('uncaughtException', function (err) {
                    errors_1.onUnexpectedError(err);
                });
                // Kill oneself if one's parent dies. Much drama.
                setInterval(function () {
                    try {
                        process.kill(msg.parentPid, 0); // throws an exception if the main process doesn't exist anymore.
                    }
                    catch (e) {
                        onTerminate();
                    }
                }, 5000);
                // Check stats
                setInterval(function () {
                    if (stats.length >= 250) {
                        var total = stats.reduce(function (prev, current) { return prev + current; }, 0);
                        console.warn("MANY messages are being SEND FROM the extension host!");
                        console.warn("SEND during 1sec: message_count=" + stats.length + ", total_len=" + total);
                    }
                    stats.length = 0;
                }, 1000);
                // Tell the outside that we are initialized
                process.send('initialized');
                c({ remoteCom: remoteCom, initData: msg });
            });
            // Tell the outside that we are ready to receive messages
            process.send('ready');
        });
    }
    function connectToSharedProcess() {
        return ipc_net_1.connect(process.env['VSCODE_SHARED_IPC_HOOK']);
    }
    winjs_base_1.TPromise.join([connectToRenderer(), connectToSharedProcess()])
        .done(function (result) {
        var renderer = result[0];
        var sharedProcessClient = result[1];
        var extensionHostMain = new extensionHostMain_1.ExtensionHostMain(renderer.remoteCom, renderer.initData, sharedProcessClient);
        onTerminate = function () {
            extensionHostMain.terminate();
        };
        extensionHostMain.start()
            .done(null, function (err) { return console.error(err); });
    });
});

}).call(this);
//# sourceMappingURL=extensionHostProcess.js.map
