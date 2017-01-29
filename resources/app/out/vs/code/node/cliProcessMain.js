/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["require","exports","vs/base/common/winjs.base","vs/nls!vs/code/node/cliProcessMain","vs/nls","vs/platform/instantiation/common/instantiation","vs/base/common/event","vs/base/common/objects","vs/base/common/types","vs/base/common/errors","path","vs/platform/platform","vs/base/common/lifecycle","vs/platform/configuration/common/configuration","vs/base/common/strings","vs/base/common/paths","vs/base/common/platform","vs/base/common/arrays","fs","vs/base/common/async","vs/platform/configuration/common/configurationRegistry","vs/base/node/pfs","vs/platform/environment/common/environment","vs/platform/telemetry/common/telemetry","vs/base/common/eventEmitter","vs/base/common/uuid","os","vs/platform/extensionManagement/common/extensionManagement","vs/platform/package","vs/base/common/map","vs/platform/instantiation/common/descriptors","vs/base/node/request","vs/base/common/uri","vs/platform/instantiation/common/serviceCollection","vs/platform/message/common/message","vs/base/common/severity","vs/base/common/decorators","vs/platform/jsonschemas/common/jsonContributionRegistry","vs/base/common/collections","vs/platform/product","vs/platform/request/node/request","vs/base/common/assert","vs/nls!vs/base/common/json","vs/base/common/actions","vs/base/common/set","vs/base/common/json","vs/base/node/config","vs/base/common/graph","vs/nls!vs/base/common/severity","vs/base/node/flow","vs/nls!vs/base/node/zip","vs/nls!vs/platform/configuration/common/configurationRegistry","vs/platform/request/node/requestService","vs/nls!vs/platform/extensionManagement/node/extensionGalleryService","vs/nls!vs/platform/extensionManagement/node/extensionManagementService","vs/nls!vs/platform/extensions/common/extensionsRegistry","vs/nls!vs/platform/extensions/node/extensionValidator","vs/nls!vs/platform/message/common/message","vs/nls!vs/platform/request/node/request","vs/nls!vs/platform/telemetry/common/telemetryService","vs/platform/event/common/eventService","vs/platform/extensionManagement/common/extensionNls","vs/platform/extensionManagement/common/extensionTelemetry","vs/platform/extensions/node/extensionValidator","semver","vs/base/node/extfs","vs/nls!vs/platform/extensionManagement/common/extensionManagement","vs/base/common/glob","vs/base/node/id","vs/platform/event/common/event","vs/platform/extensionManagement/node/extensionGalleryService","crypto","vs/platform/instantiation/common/instantiationService","vs/platform/keybinding/common/keybinding","vs/platform/lifecycle/common/lifecycle","vs/base/common/callbackList","vs/platform/message/node/messageCli","vs/base/node/zip","vs/platform/environment/node/http","vs/base/node/paths","vs/base/common/cancellation","vs/base/common/mime","vs/platform/extensions/common/extensionsRegistry","vs/base/node/proxy","vs/platform/configuration/common/model","vs/platform/configuration/node/configurationService","vs/platform/environment/node/environmentService","url","vs/base/common/events","vs/platform/extensionManagement/node/extensionManagementService","vs/platform/telemetry/common/telemetryService","vs/platform/telemetry/node/appInsightsAppender","vs/platform/telemetry/node/commonProperties","https","applicationinsights","yauzl","https-proxy-agent","http-proxy-agent","readline","http","zlib","getmac","assert","vs/code/node/cliProcessMain"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[41/*vs/base/common/assert*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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

define(__m[38/*vs/base/common/collections*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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
define(__m[36/*vs/base/common/decorators*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    'use strict';
    function memoize(target, key, descriptor) {
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
        var memoizeKey = "$memoize$" + key;
        descriptor[fnKey] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
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
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(__m[88/*vs/base/common/events*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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





define(__m[29/*vs/base/common/map*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    'use strict';
    /**
     * A simple map to store value by a key object. Key can be any object that has toString() function to get
     * string value of the key.
     */
    var LinkedMap = (function () {
        function LinkedMap() {
            this.map = Object.create(null);
            this._size = 0;
        }
        Object.defineProperty(LinkedMap.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        LinkedMap.prototype.get = function (k) {
            var value = this.peek(k);
            return value ? value : null;
        };
        LinkedMap.prototype.getOrSet = function (k, t) {
            var res = this.get(k);
            if (res) {
                return res;
            }
            this.set(k, t);
            return t;
        };
        LinkedMap.prototype.keys = function () {
            var keys = [];
            for (var key in this.map) {
                keys.push(this.map[key].key);
            }
            return keys;
        };
        LinkedMap.prototype.values = function () {
            var values = [];
            for (var key in this.map) {
                values.push(this.map[key].value);
            }
            return values;
        };
        LinkedMap.prototype.entries = function () {
            var entries = [];
            for (var key in this.map) {
                entries.push(this.map[key]);
            }
            return entries;
        };
        LinkedMap.prototype.set = function (k, t) {
            if (this.get(k)) {
                return false; // already present!
            }
            this.push(k, t);
            return true;
        };
        LinkedMap.prototype.delete = function (k) {
            var value = this.get(k);
            if (value) {
                this.pop(k);
                return value;
            }
            return null;
        };
        LinkedMap.prototype.has = function (k) {
            return !!this.get(k);
        };
        LinkedMap.prototype.clear = function () {
            this.map = Object.create(null);
            this._size = 0;
        };
        LinkedMap.prototype.push = function (key, value) {
            var entry = { key: key, value: value };
            this.map[key.toString()] = entry;
            this._size++;
        };
        LinkedMap.prototype.pop = function (k) {
            delete this.map[k.toString()];
            this._size--;
        };
        LinkedMap.prototype.peek = function (k) {
            var entry = this.map[k.toString()];
            return entry ? entry.value : null;
        };
        return LinkedMap;
    }());
    exports.LinkedMap = LinkedMap;
    /**
     * A simple Map<T> that optionally allows to set a limit of entries to store. Once the limit is hit,
     * the cache will remove the entry that was last recently added. Or, if a ratio is provided below 1,
     * all elements will be removed until the ratio is full filled (e.g. 0.75 to remove 25% of old elements).
     */
    var BoundedLinkedMap = (function () {
        function BoundedLinkedMap(limit, ratio) {
            if (limit === void 0) { limit = Number.MAX_VALUE; }
            if (ratio === void 0) { ratio = 1; }
            this.limit = limit;
            this.map = Object.create(null);
            this._size = 0;
            this.ratio = limit * ratio;
        }
        Object.defineProperty(BoundedLinkedMap.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        BoundedLinkedMap.prototype.set = function (key, value) {
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
        BoundedLinkedMap.prototype.get = function (key) {
            var entry = this.map[key];
            return entry ? entry.value : null;
        };
        BoundedLinkedMap.prototype.getOrSet = function (k, t) {
            var res = this.get(k);
            if (res) {
                return res;
            }
            this.set(k, t);
            return t;
        };
        BoundedLinkedMap.prototype.delete = function (key) {
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
        BoundedLinkedMap.prototype.has = function (key) {
            return !!this.map[key];
        };
        BoundedLinkedMap.prototype.clear = function () {
            this.map = Object.create(null);
            this._size = 0;
            this.head = null;
            this.tail = null;
        };
        BoundedLinkedMap.prototype.push = function (entry) {
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
        BoundedLinkedMap.prototype.trim = function () {
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
        return BoundedLinkedMap;
    }());
    exports.BoundedLinkedMap = BoundedLinkedMap;
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
    }(BoundedLinkedMap));
    exports.LRUCache = LRUCache;
    /**
     * A trie map that allows for fast look up when keys are substrings
     * to the actual search keys (dir/subdir-problem).
     */
    var TrieMap = (function () {
        function TrieMap(splitter) {
            this._root = { children: Object.create(null) };
            this._splitter = splitter;
        }
        TrieMap.prototype.insert = function (path, element) {
            var parts = this._splitter(path);
            var i = 0;
            // find insertion node
            var node = this._root;
            for (; i < parts.length; i++) {
                var child = node.children[parts[i]];
                if (child) {
                    node = child;
                    continue;
                }
                break;
            }
            // create new nodes
            var newNode;
            for (; i < parts.length; i++) {
                newNode = { children: Object.create(null) };
                node.children[parts[i]] = newNode;
                node = newNode;
            }
            node.element = element;
        };
        TrieMap.prototype.lookUp = function (path) {
            var parts = this._splitter(path);
            var children = this._root.children;
            var node;
            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                var part = parts_1[_i];
                node = children[part];
                if (!node) {
                    return;
                }
                children = node.children;
            }
            return node.element;
        };
        TrieMap.prototype.findSubstr = function (path) {
            var parts = this._splitter(path);
            var lastNode;
            var children = this._root.children;
            for (var _i = 0, parts_2 = parts; _i < parts_2.length; _i++) {
                var part = parts_2[_i];
                var node = children[part];
                if (!node) {
                    break;
                }
                if (node.element) {
                    lastNode = node;
                }
                children = node.children;
            }
            // return the last matching node
            // that had an element
            if (lastNode) {
                return lastNode.element;
            }
        };
        TrieMap.prototype.findSuperstr = function (path) {
            var parts = this._splitter(path);
            var children = this._root.children;
            var node;
            for (var _i = 0, parts_3 = parts; _i < parts_3.length; _i++) {
                var part = parts_3[_i];
                node = children[part];
                if (!node) {
                    return;
                }
                children = node.children;
            }
            var result = new TrieMap(this._splitter);
            result._root = node;
            return result;
        };
        TrieMap.PathSplitter = function (s) { return s.split(/[\\/]/).filter(function (s) { return !!s; }); };
        return TrieMap;
    }());
    exports.TrieMap = TrieMap;
});

define(__m[15/*vs/base/common/paths*/], __M([0/*require*/,1/*exports*/,16/*vs/base/common/platform*/,17/*vs/base/common/arrays*/]), function (require, exports, platform_1, arrays_1) {
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
        var originalNormalizedFrom = normalize(from);
        var originalNormalizedTo = normalize(to);
        // we're assuming here that any non=linux OS is case insensitive
        // so we must compare each part in its lowercase form
        var normalizedFrom = platform_1.isLinux ? originalNormalizedFrom : originalNormalizedFrom.toLowerCase();
        var normalizedTo = platform_1.isLinux ? originalNormalizedTo : originalNormalizedTo.toLowerCase();
        var fromParts = normalizedFrom.split(exports.sep);
        var toParts = normalizedTo.split(exports.sep);
        var i = 0, max = Math.min(fromParts.length, toParts.length);
        for (; i < max; i++) {
            if (fromParts[i] !== toParts[i]) {
                break;
            }
        }
        var result = arrays_1.fill(fromParts.length - i, function () { return '..'; }).concat(originalNormalizedTo.split(exports.sep).slice(i));
        return result.join(exports.sep);
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
            if (end === len || path.charCodeAt(end) === 47 /* Slash */ || path.charCodeAt(end) === 92 /* Backslash */) {
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
        if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
            code = path.charCodeAt(1);
            if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                // UNC candidate \\localhost\shares\ddd
                //               ^^^^^^^^^^^^^^^^^^^
                code = path.charCodeAt(2);
                if (code !== 47 /* Slash */ && code !== 92 /* Backslash */) {
                    var pos_1 = 3;
                    var start = pos_1;
                    for (; pos_1 < len; pos_1++) {
                        code = path.charCodeAt(pos_1);
                        if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                            break;
                        }
                    }
                    code = path.charCodeAt(pos_1 + 1);
                    if (start !== pos_1 && code !== 47 /* Slash */ && code !== 92 /* Backslash */) {
                        pos_1 += 1;
                        for (; pos_1 < len; pos_1++) {
                            code = path.charCodeAt(pos_1);
                            if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
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
        else if ((code >= 65 /* A */ && code <= 90 /* Z */) || (code >= 97 /* a */ && code <= 122 /* z */)) {
            // check for windows drive letter c:\ or c:
            if (path.charCodeAt(1) === 58 /* Colon */) {
                code = path.charCodeAt(2);
                if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
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
                if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
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
                if (last !== 47 /* Slash */ && last !== 92 /* Backslash */) {
                    var next = part.charCodeAt(0);
                    if (next !== 47 /* Slash */ && next !== 92 /* Backslash */) {
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
        if (code !== 92 /* Backslash */) {
            return false;
        }
        code = path.charCodeAt(1);
        if (code !== 92 /* Backslash */) {
            return false;
        }
        var pos = 2;
        var start = pos;
        for (; pos < path.length; pos++) {
            code = path.charCodeAt(pos);
            if (code === 92 /* Backslash */) {
                break;
            }
        }
        if (start === pos) {
            return false;
        }
        code = path.charCodeAt(pos + 1);
        if (isNaN(code) || code === 92 /* Backslash */) {
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
    function isEqualOrParent(path, candidate) {
        if (path === candidate) {
            return true;
        }
        path = normalize(path);
        candidate = normalize(candidate);
        var candidateLen = candidate.length;
        var lastCandidateChar = candidate.charCodeAt(candidateLen - 1);
        if (lastCandidateChar === 47 /* Slash */) {
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
        return char === 47 /* Slash */;
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[44/*vs/base/common/set*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    var ArraySet = (function () {
        function ArraySet(elements) {
            if (elements === void 0) { elements = []; }
            this._elements = elements.slice();
        }
        Object.defineProperty(ArraySet.prototype, "size", {
            get: function () {
                return this._elements.length;
            },
            enumerable: true,
            configurable: true
        });
        ArraySet.prototype.set = function (element) {
            this.unset(element);
            this._elements.push(element);
        };
        ArraySet.prototype.contains = function (element) {
            return this._elements.indexOf(element) > -1;
        };
        ArraySet.prototype.unset = function (element) {
            var index = this._elements.indexOf(element);
            if (index > -1) {
                this._elements.splice(index, 1);
            }
        };
        Object.defineProperty(ArraySet.prototype, "elements", {
            get: function () {
                return this._elements.slice();
            },
            enumerable: true,
            configurable: true
        });
        return ArraySet;
    }());
    exports.ArraySet = ArraySet;
});

define(__m[14/*vs/base/common/strings*/], __M([0/*require*/,1/*exports*/,29/*vs/base/common/map*/]), function (require, exports, map_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * The empty string.
     */
    exports.empty = '';
    function isFalsyOrWhitespace(str) {
        if (!str || typeof str !== 'string') {
            return true;
        }
        return str.trim().length === 0;
    }
    exports.isFalsyOrWhitespace = isFalsyOrWhitespace;
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
            return haystack.indexOf(needle, diff) === diff;
        }
        else if (diff === 0) {
            return haystack === needle;
        }
        else {
            return false;
        }
    }
    exports.endsWith = endsWith;
    function indexOfIgnoreCase(haystack, needle, position) {
        if (position === void 0) { position = 0; }
        var index = haystack.indexOf(needle, position);
        if (index < 0) {
            if (position > 0) {
                haystack = haystack.substr(position);
            }
            needle = escapeRegExpCharacters(needle);
            index = haystack.search(new RegExp(needle, 'i'));
        }
        return index;
    }
    exports.indexOfIgnoreCase = indexOfIgnoreCase;
    function createRegExp(searchString, isRegex, options) {
        if (options === void 0) { options = {}; }
        if (searchString === '') {
            throw new Error('Cannot create regex from empty string');
        }
        if (!isRegex) {
            searchString = searchString.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&');
        }
        if (options.wholeWord) {
            if (!/\B/.test(searchString.charAt(0))) {
                searchString = '\\b' + searchString;
            }
            if (!/\B/.test(searchString.charAt(searchString.length - 1))) {
                searchString = searchString + '\\b';
            }
        }
        var modifiers = '';
        if (options.global) {
            modifiers += 'g';
        }
        if (!options.matchCase) {
            modifiers += 'i';
        }
        if (options.multiline) {
            modifiers += 'm';
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
    var normalizedCache = new map_1.BoundedLinkedMap(10000); // bounded to 10000 elements
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
            var chCode = str.charCodeAt(i);
            if (chCode !== 32 /* Space */ && chCode !== 9 /* Tab */) {
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
            var chCode = str.charCodeAt(i);
            if (chCode !== 32 /* Space */ && chCode !== 9 /* Tab */) {
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
            var chCode = str.charCodeAt(i);
            if (chCode !== 32 /* Space */ && chCode !== 9 /* Tab */) {
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
        return (code >= 97 /* a */ && code <= 122 /* z */) || (code >= 65 /* A */ && code <= 90 /* Z */);
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
    function isHighSurrogate(charCode) {
        return (0xD800 <= charCode && charCode <= 0xDBFF);
    }
    exports.isHighSurrogate = isHighSurrogate;
    function isLowSurrogate(charCode) {
        return (0xDC00 <= charCode && charCode <= 0xDFFF);
    }
    exports.isLowSurrogate = isLowSurrogate;
    /**
     * Generated using https://github.com/alexandrudima/unicode-utils/blob/master/generate-rtl-test.js
     */
    var CONTAINS_RTL = /(?:[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05F4\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u0710\u0712-\u072F\u074D-\u07A5\u07B1-\u07EA\u07F4\u07F5\u07FA-\u0815\u081A\u0824\u0828\u0830-\u0858\u085E-\u08BD\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFD3D\uFD50-\uFDFC\uFE70-\uFEFC]|\uD802[\uDC00-\uDD1B\uDD20-\uDE00\uDE10-\uDE33\uDE40-\uDEE4\uDEEB-\uDF35\uDF40-\uDFFF]|\uD803[\uDC00-\uDCFF]|\uD83A[\uDC00-\uDCCF\uDD00-\uDD43\uDD50-\uDFFF]|\uD83B[\uDC00-\uDEBB])/;
    /**
     * Returns true if `str` contains any Unicode character that is classified as "R" or "AL".
     */
    function containsRTL(str) {
        return CONTAINS_RTL.test(str);
    }
    exports.containsRTL = containsRTL;
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
    var COLOR_START = /\x1b\[\d+m/g; // Color
    var COLOR_END = /\x1b\[0?m/g; // Color
    function removeAnsiEscapeCodes(str) {
        if (str) {
            str = str.replace(EL, '');
            str = str.replace(COLOR_START, '');
            str = str.replace(COLOR_END, '');
        }
        return str;
    }
    exports.removeAnsiEscapeCodes = removeAnsiEscapeCodes;
    // -- UTF-8 BOM
    exports.UTF8_BOM_CHARACTER = String.fromCharCode(65279 /* UTF8_BOM */);
    function startsWithUTF8BOM(str) {
        return (str && str.length > 0 && str.charCodeAt(0) === 65279 /* UTF8_BOM */);
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

define(__m[67/*vs/base/common/glob*/], __M([0/*require*/,1/*exports*/,17/*vs/base/common/arrays*/,14/*vs/base/common/strings*/,15/*vs/base/common/paths*/,29/*vs/base/common/map*/]), function (require, exports, arrays, strings, paths, map_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
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
    var T2 = /^\*\*\/([\w\.-]+)\/?$/; // **/something
    var T3 = /^{\*\*\/[\*\.]?[\w\.-]+\/?(,\*\*\/[\*\.]?[\w\.-]+\/?)*}$/; // {**/*.something,**/*.else} or {**/package.json,**/project.json}
    var T3_2 = /^{\*\*\/[\*\.]?[\w\.-]+(\/(\*\*)?)?(,\*\*\/[\*\.]?[\w\.-]+(\/(\*\*)?)?)*}$/; // Like T3, with optional trailing /**
    var T4 = /^\*\*((\/[\w\.-]+)+)\/?$/; // **/something/else
    var T5 = /^([\w\.-]+(\/[\w\.-]+)*)\/?$/; // something/else
    var CACHE = new map_1.BoundedLinkedMap(10000); // bounded to 10000 elements
    var FALSE = function () {
        return false;
    };
    var NULL = function () {
        return null;
    };
    function parsePattern(pattern, options) {
        if (!pattern) {
            return NULL;
        }
        // Whitespace trimming
        pattern = pattern.trim();
        // Check cache
        var patternKey = pattern + "_" + !!options.trimForExclusions;
        var parsedPattern = CACHE.get(patternKey);
        if (parsedPattern) {
            return parsedPattern;
        }
        // Check for Trivias
        var match;
        if (T1.test(pattern)) {
            var base_1 = pattern.substr(4); // '**/*'.length === 4
            parsedPattern = function (path, basename) {
                return path && strings.endsWith(path, base_1) ? pattern : null;
            };
        }
        else if (match = T2.exec(trimForExclusions(pattern, options))) {
            parsedPattern = trivia2(match[1], pattern);
        }
        else if ((options.trimForExclusions ? T3_2 : T3).test(pattern)) {
            parsedPattern = trivia3(pattern, options);
        }
        else if (match = T4.exec(trimForExclusions(pattern, options))) {
            parsedPattern = trivia4and5(match[1].substr(1), pattern, true);
        }
        else if (match = T5.exec(trimForExclusions(pattern, options))) {
            parsedPattern = trivia4and5(match[1], pattern, false);
        }
        else {
            parsedPattern = toRegExp(pattern);
        }
        // Cache
        CACHE.set(patternKey, parsedPattern);
        return parsedPattern;
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
    function match(arg1, path, siblingsFn) {
        if (!arg1 || !path) {
            return false;
        }
        return parse(arg1)(path, undefined, siblingsFn);
    }
    exports.match = match;
    function parse(arg1, options) {
        if (options === void 0) { options = {}; }
        if (!arg1) {
            return FALSE;
        }
        // Glob with String
        if (typeof arg1 === 'string') {
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
            var resultExpression_1 = function (path, basename, siblingsFn) {
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
        var resultExpression = function (path, basename, siblingsFn) {
            var siblingsPattern;
            var siblingsResolved = !siblingsFn;
            function siblingsPatternFn() {
                // Resolve siblings only once
                if (!siblingsResolved) {
                    siblingsResolved = true;
                    var siblings = siblingsFn();
                    if (siblings && siblings.length) {
                        if (!basename) {
                            basename = paths.basename(path);
                        }
                        var name_1 = basename.substr(0, basename.length - paths.extname(path).length);
                        siblingsPattern = { siblings: siblings, name: name_1 };
                    }
                }
                return siblingsPattern;
            }
            for (var i = 0, n_3 = parsedPatterns.length; i < n_3; i++) {
                // Pattern matches path
                var result = parsedPatterns[i](path, basename, siblingsPatternFn);
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
                var result = function (path, basename, siblingsPatternFn) {
                    if (!parsedPattern(path, basename)) {
                        return null;
                    }
                    var siblingsPattern = siblingsPatternFn();
                    if (!siblingsPattern) {
                        return null; // pattern is malformed or we don't have siblings
                    }
                    var clausePattern = when_1.replace('$(basename)', siblingsPattern.name);
                    if (siblingsPattern.siblings.indexOf(clausePattern) !== -1) {
                        return pattern;
                    }
                    else {
                        return null; // pattern does not match in the end because the when clause is not satisfied
                    }
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

define(__m[75/*vs/base/common/callbackList*/], __M([0/*require*/,1/*exports*/,9/*vs/base/common/errors*/]), function (require, exports, errors_1) {
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
        CallbackList.prototype.entries = function () {
            var _this = this;
            if (!this._callbacks) {
                return [];
            }
            return this._callbacks.map(function (fn, index) { return [fn, _this._contexts[index]]; });
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






define(__m[24/*vs/base/common/eventEmitter*/], __M([0/*require*/,1/*exports*/,9/*vs/base/common/errors*/]), function (require, exports, Errors) {
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
        EventEmitter.prototype._beginDeferredEmit = function () {
            this._deferredCnt = this._deferredCnt + 1;
        };
        EventEmitter.prototype._endDeferredEmit = function () {
            this._deferredCnt = this._deferredCnt - 1;
            if (this._deferredCnt === 0) {
                this._emitCollected();
            }
        };
        EventEmitter.prototype.deferredEmit = function (callback) {
            this._beginDeferredEmit();
            var result = safeInvokeNoArg(callback);
            this._endDeferredEmit();
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

define(__m[47/*vs/base/common/graph*/], __M([0/*require*/,1/*exports*/,8/*vs/base/common/types*/,38/*vs/base/common/collections*/]), function (require, exports, types_1, collections_1) {
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






define(__m[12/*vs/base/common/lifecycle*/], __M([0/*require*/,1/*exports*/,8/*vs/base/common/types*/]), function (require, exports, types_1) {
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
    var ReferenceCollection = (function () {
        function ReferenceCollection() {
            this.references = Object.create(null);
        }
        ReferenceCollection.prototype.acquire = function (key) {
            var _this = this;
            var reference = this.references[key];
            if (!reference) {
                reference = this.references[key] = { counter: 0, object: this.createReferencedObject(key) };
            }
            var object = reference.object;
            var dispose = function () {
                if (--reference.counter === 0) {
                    _this.destroyReferencedObject(reference.object);
                    delete _this.references[key];
                }
            };
            reference.counter++;
            return { object: object, dispose: dispose };
        };
        return ReferenceCollection;
    }());
    exports.ReferenceCollection = ReferenceCollection;
    var ImmortalReference = (function () {
        function ImmortalReference(object) {
            this.object = object;
        }
        ImmortalReference.prototype.dispose = function () { };
        return ImmortalReference;
    }());
    exports.ImmortalReference = ImmortalReference;
});

define(__m[6/*vs/base/common/event*/], __M([0/*require*/,1/*exports*/,12/*vs/base/common/lifecycle*/,75/*vs/base/common/callbackList*/]), function (require, exports, lifecycle_1, callbackList_1) {
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
                        var firstListener = _this._callbacks.isEmpty();
                        if (firstListener && _this._options && _this._options.onFirstListenerAdd) {
                            _this._options.onFirstListenerAdd(_this);
                        }
                        _this._callbacks.add(listener, thisArgs);
                        if (firstListener && _this._options && _this._options.onFirstListenerDidAdd) {
                            _this._options.onFirstListenerDidAdd(_this);
                        }
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
        var emitter = new Emitter();
        var shouldEmit = false;
        promise
            .then(null, function () { return null; })
            .then(function () {
            if (!shouldEmit) {
                setTimeout(function () { return emitter.fire(); }, 0);
            }
            else {
                emitter.fire();
            }
        });
        shouldEmit = true;
        return emitter.event;
    }
    exports.fromPromise = fromPromise;
    function delayed(promise) {
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
    exports.delayed = delayed;
    function once(event) {
        return function (listener, thisArgs, disposables) {
            if (thisArgs === void 0) { thisArgs = null; }
            var result = event(function (e) {
                result.dispose();
                return listener.call(thisArgs, e);
            }, null, disposables);
            return result;
        };
    }
    exports.once = once;
    function any() {
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i - 0] = arguments[_i];
        }
        var listeners = [];
        var emitter = new Emitter({
            onFirstListenerAdd: function () {
                listeners = events.map(function (e) { return e(function (r) { return emitter.fire(r); }); });
            },
            onLastListenerRemove: function () {
                listeners = lifecycle_1.dispose(listeners);
            }
        });
        return emitter.event;
    }
    exports.any = any;
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
    /**
     * The EventDelayer is useful in situations in which you want
     * to delay firing your events during some code.
     * You can wrap that code and be sure that the event will not
     * be fired during that wrap.
     *
     * ```
     * const emitter: Emitter;
     * const delayer = new EventDelayer();
     * const delayedEvent = delayer.wrapEvent(emitter.event);
     *
     * delayedEvent(console.log);
     *
     * delayer.bufferEvents(() => {
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
    var ChainableEvent = (function () {
        function ChainableEvent(_event) {
            this._event = _event;
        }
        Object.defineProperty(ChainableEvent.prototype, "event", {
            get: function () { return this._event; },
            enumerable: true,
            configurable: true
        });
        ChainableEvent.prototype.map = function (fn) {
            return new ChainableEvent(mapEvent(this._event, fn));
        };
        ChainableEvent.prototype.filter = function (fn) {
            return new ChainableEvent(filterEvent(this._event, fn));
        };
        ChainableEvent.prototype.on = function (listener, thisArgs, disposables) {
            return this._event(listener, thisArgs, disposables);
        };
        return ChainableEvent;
    }());
    function chain(event) {
        return new ChainableEvent(event);
    }
    exports.chain = chain;
    function stopwatch(event) {
        var start = new Date().getTime();
        return mapEvent(once(event), function (_) { return new Date().getTime() - start; });
    }
    exports.stopwatch = stopwatch;
    /**
     * Buffers the provided event until a first listener comes
     * along, at which point fire all the events at once and
     * pipe the event from then on.
     *
     * ```typescript
     * const emitter = new Emitter<number>();
     * const event = emitter.event;
     * const bufferedEvent = buffer(event);
     *
     * emitter.fire(1);
     * emitter.fire(2);
     * emitter.fire(3);
     * // nothing...
     *
     * const listener = bufferedEvent(num => console.log(num));
     * // 1, 2, 3
     *
     * emitter.fire(4);
     * // 4
     * ```
     */
    function buffer(event, nextTick, buffer) {
        if (nextTick === void 0) { nextTick = false; }
        if (buffer === void 0) { buffer = []; }
        buffer = buffer.slice();
        var listener = event(function (e) {
            if (buffer) {
                buffer.push(e);
            }
            else {
                emitter.fire(e);
            }
        });
        var flush = function () {
            buffer.forEach(function (e) { return emitter.fire(e); });
            buffer = null;
        };
        var emitter = new Emitter({
            onFirstListenerAdd: function () {
                if (!listener) {
                    listener = event(function (e) { return emitter.fire(e); });
                }
            },
            onFirstListenerDidAdd: function () {
                if (buffer) {
                    if (nextTick) {
                        setTimeout(flush);
                    }
                    else {
                        flush();
                    }
                }
            },
            onLastListenerRemove: function () {
                listener.dispose();
                listener = null;
            }
        });
        return emitter.event;
    }
    exports.buffer = buffer;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[80/*vs/base/common/cancellation*/], __M([0/*require*/,1/*exports*/,6/*vs/base/common/event*/]), function (require, exports, event_1) {
    'use strict';
    var shortcutEvent = Object.freeze(function (callback, context) {
        var handle = setTimeout(callback.bind(context), 0);
        return { dispose: function () { clearTimeout(handle); } };
    });
    var CancellationToken;
    (function (CancellationToken) {
        CancellationToken.None = Object.freeze({
            isCancellationRequested: false,
            onCancellationRequested: event_1.default.None
        });
        CancellationToken.Cancelled = Object.freeze({
            isCancellationRequested: true,
            onCancellationRequested: shortcutEvent
        });
    })(CancellationToken = exports.CancellationToken || (exports.CancellationToken = {}));
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

define(__m[81/*vs/base/common/mime*/], __M([0/*require*/,1/*exports*/,15/*vs/base/common/paths*/,8/*vs/base/common/types*/,14/*vs/base/common/strings*/,67/*vs/base/common/glob*/]), function (require, exports, paths, types, strings, glob_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.MIME_TEXT = 'text/plain';
    exports.MIME_BINARY = 'application/octet-stream';
    exports.MIME_UNKNOWN = 'application/unknown';
    var registeredAssociations = [];
    var nonUserRegisteredAssociations = [];
    var userRegisteredAssociations = [];
    /**
     * Associate a text mime to the registry.
     */
    function registerTextMime(association) {
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
        if (!associationItem.userConfigured) {
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
        for (var i = 0; i < associations.length; i++) {
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
    function suggestFilename(langId, prefix) {
        for (var i = 0; i < registeredAssociations.length; i++) {
            var association = registeredAssociations[i];
            if (association.userConfigured) {
                continue; // only support registered ones
            }
            if (association.id === langId && association.extension) {
                return prefix + association.extension;
            }
        }
        return prefix; // without any known extension, just return the prefix
    }
    exports.suggestFilename = suggestFilename;
});






define(__m[25/*vs/base/common/uuid*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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
            return array[Math.floor(array.length * Math.random())];
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
    var _UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    function isUUID(value) {
        return _UUIDPattern.test(value);
    }
    exports.isUUID = isUUID;
    /**
     * Parses a UUID that is of the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.
     * @param value A uuid string.
     */
    function parse(value) {
        if (!isUUID(value)) {
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






define(__m[43/*vs/base/common/actions*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,24/*vs/base/common/eventEmitter*/,88/*vs/base/common/events*/,6/*vs/base/common/event*/]), function (require, exports, winjs_base_1, eventEmitter_1, Events, event_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * Checks if the provided object is compatible
     * with the IAction interface.
     * @param thing an object
     */
    function isAction(thing) {
        if (!thing) {
            return false;
        }
        else if (thing instanceof Action) {
            return true;
        }
        else if (typeof thing.id !== 'string') {
            return false;
        }
        else if (typeof thing.label !== 'string') {
            return false;
        }
        else if (typeof thing.class !== 'string') {
            return false;
        }
        else if (typeof thing.enabled !== 'boolean') {
            return false;
        }
        else if (typeof thing.checked !== 'boolean') {
            return false;
        }
        else if (typeof thing.run !== 'function') {
            return false;
        }
        else {
            return true;
        }
    }
    exports.isAction = isAction;
    var Action = (function () {
        function Action(id, label, cssClass, enabled, actionCallback) {
            if (label === void 0) { label = ''; }
            if (cssClass === void 0) { cssClass = ''; }
            if (enabled === void 0) { enabled = true; }
            this._onDidChange = new event_1.Emitter();
            this._id = id;
            this._label = label;
            this._cssClass = cssClass;
            this._enabled = enabled;
            this._actionCallback = actionCallback;
        }
        Action.prototype.dispose = function () {
            this._onDidChange.dispose();
        };
        Object.defineProperty(Action.prototype, "onDidChange", {
            get: function () {
                return this._onDidChange.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Action.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Action.prototype, "label", {
            get: function () {
                return this._label;
            },
            set: function (value) {
                this._setLabel(value);
            },
            enumerable: true,
            configurable: true
        });
        Action.prototype._setLabel = function (value) {
            if (this._label !== value) {
                this._label = value;
                this._onDidChange.fire({ label: value });
            }
        };
        Object.defineProperty(Action.prototype, "tooltip", {
            get: function () {
                return this._tooltip;
            },
            set: function (value) {
                this._setTooltip(value);
            },
            enumerable: true,
            configurable: true
        });
        Action.prototype._setTooltip = function (value) {
            if (this._tooltip !== value) {
                this._tooltip = value;
                this._onDidChange.fire({ tooltip: value });
            }
        };
        Object.defineProperty(Action.prototype, "class", {
            get: function () {
                return this._cssClass;
            },
            set: function (value) {
                this._setClass(value);
            },
            enumerable: true,
            configurable: true
        });
        Action.prototype._setClass = function (value) {
            if (this._cssClass !== value) {
                this._cssClass = value;
                this._onDidChange.fire({ class: value });
            }
        };
        Object.defineProperty(Action.prototype, "enabled", {
            get: function () {
                return this._enabled;
            },
            set: function (value) {
                this._setEnabled(value);
            },
            enumerable: true,
            configurable: true
        });
        Action.prototype._setEnabled = function (value) {
            if (this._enabled !== value) {
                this._enabled = value;
                this._onDidChange.fire({ enabled: value });
            }
        };
        Object.defineProperty(Action.prototype, "checked", {
            get: function () {
                return this._checked;
            },
            set: function (value) {
                this._setChecked(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Action.prototype, "radio", {
            get: function () {
                return this._radio;
            },
            set: function (value) {
                this._setRadio(value);
            },
            enumerable: true,
            configurable: true
        });
        Action.prototype._setChecked = function (value) {
            if (this._checked !== value) {
                this._checked = value;
                this._onDidChange.fire({ checked: value });
            }
        };
        Action.prototype._setRadio = function (value) {
            if (this._radio !== value) {
                this._radio = value;
                this._onDidChange.fire({ radio: value });
            }
        };
        Object.defineProperty(Action.prototype, "order", {
            get: function () {
                return this._order;
            },
            set: function (value) {
                this._order = value;
            },
            enumerable: true,
            configurable: true
        });
        Action.prototype.run = function (event) {
            if (this._actionCallback !== void 0) {
                return this._actionCallback(event);
            }
            return winjs_base_1.TPromise.as(true);
        };
        return Action;
    }());
    exports.Action = Action;
    var ActionRunner = (function (_super) {
        __extends(ActionRunner, _super);
        function ActionRunner() {
            _super.apply(this, arguments);
        }
        ActionRunner.prototype.run = function (action, context) {
            var _this = this;
            if (!action.enabled) {
                return winjs_base_1.TPromise.as(null);
            }
            this.emit(Events.EventType.BEFORE_RUN, { action: action });
            return winjs_base_1.TPromise.as(action.run(context)).then(function (result) {
                _this.emit(Events.EventType.RUN, { action: action, result: result });
            }, function (error) {
                _this.emit(Events.EventType.RUN, { action: action, error: error });
            });
        };
        return ActionRunner;
    }(eventEmitter_1.EventEmitter));
    exports.ActionRunner = ActionRunner;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





define(__m[19/*vs/base/common/async*/], __M([0/*require*/,1/*exports*/,9/*vs/base/common/errors*/,16/*vs/base/common/platform*/,2/*vs/base/common/winjs.base*/,80/*vs/base/common/cancellation*/,12/*vs/base/common/lifecycle*/,6/*vs/base/common/event*/]), function (require, exports, errors, platform, winjs_base_1, cancellation_1, lifecycle_1, event_1) {
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
        return new winjs_base_1.TPromise(function (resolve, reject, progress) {
            var item = callback(source.token);
            if (item instanceof winjs_base_1.TPromise) {
                item.then(resolve, reject, progress);
            }
            else if (isThenable(item)) {
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
    function wireCancellationToken(token, promise, resolveAsUndefinedWhenCancelled) {
        var subscription = token.onCancellationRequested(function () { return promise.cancel(); });
        if (resolveAsUndefinedWhenCancelled) {
            promise = promise.then(undefined, function (err) {
                if (!errors.isPromiseCanceledError(err)) {
                    return winjs_base_1.TPromise.wrapError(err);
                }
            });
        }
        return always(promise, function () { return subscription.dispose(); });
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
    function sequence(promiseFactories) {
        var results = [];
        // reverse since we start with last element using pop()
        promiseFactories = promiseFactories.reverse();
        function next() {
            if (promiseFactories.length) {
                return promiseFactories.pop()();
            }
            return null;
        }
        function thenHandler(result) {
            if (result !== undefined && result !== null) {
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
    function first(promiseFactories, shouldStop) {
        if (shouldStop === void 0) { shouldStop = function (t) { return !!t; }; }
        promiseFactories = promiseFactories.reverse().slice();
        var loop = function () {
            if (promiseFactories.length === 0) {
                return winjs_base_1.TPromise.as(null);
            }
            var factory = promiseFactories.pop();
            var promise = factory();
            return promise.then(function (result) {
                if (shouldStop(result)) {
                    return winjs_base_1.TPromise.as(result);
                }
                return loop();
            });
        };
        return loop();
    }
    exports.first = first;
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
            this._onFinished = new event_1.Emitter();
        }
        Object.defineProperty(Limiter.prototype, "onFinished", {
            get: function () {
                return this._onFinished.event;
            },
            enumerable: true,
            configurable: true
        });
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
            if (this.outstandingPromises.length > 0) {
                this.consume();
            }
            else {
                this._onFinished.fire();
            }
        };
        Limiter.prototype.dispose = function () {
            this._onFinished.dispose();
        };
        return Limiter;
    }());
    exports.Limiter = Limiter;
    /**
     * A queue is handles one promise at a time and guarantees that at any time only one promise is executing.
     */
    var Queue = (function (_super) {
        __extends(Queue, _super);
        function Queue() {
            _super.call(this, 1);
        }
        return Queue;
    }(Limiter));
    exports.Queue = Queue;
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
define(__m[49/*vs/base/node/flow*/], __M([0/*require*/,1/*exports*/,102/*assert*/]), function (require, exports, assert) {
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
define(__m[65/*vs/base/node/extfs*/], __M([0/*require*/,1/*exports*/,25/*vs/base/common/uuid*/,14/*vs/base/common/strings*/,16/*vs/base/common/platform*/,49/*vs/base/node/flow*/,18/*fs*/,10/*path*/]), function (require, exports, uuid, strings, platform, flow, fs, paths) {
    'use strict';
    var loop = flow.loop;
    function readdirSync(path) {
        // Mac: uses NFD unicode form on disk, but we want NFC
        // See also https://github.com/nodejs/node/issues/2165
        if (platform.isMacintosh) {
            return fs.readdirSync(path).map(function (c) { return strings.normalizeNFC(c); });
        }
        return fs.readdirSync(path);
    }
    exports.readdirSync = readdirSync;
    function readdir(path, callback) {
        // Mac: uses NFD unicode form on disk, but we want NFC
        // See also https://github.com/nodejs/node/issues/2165
        if (platform.isMacintosh) {
            return fs.readdir(path, function (error, children) {
                if (error) {
                    return callback(error, null);
                }
                return callback(null, children.map(function (c) { return strings.normalizeNFC(c); }));
            });
        }
        return fs.readdir(path, callback);
    }
    exports.readdir = readdir;
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
    function delSync(path) {
        try {
            var stat = fs.lstatSync(path);
            if (stat.isDirectory() && !stat.isSymbolicLink()) {
                readdirSync(path).forEach(function (child) { return delSync(paths.join(path, child)); });
                fs.rmdirSync(path);
            }
            else {
                fs.unlinkSync(path);
            }
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return; // not found
            }
            throw err;
        }
    }
    exports.delSync = delSync;
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
    // Calls fs.writeFile() followed by a fs.sync() call to flush the changes to disk
    // We do this in cases where we want to make sure the data is really on disk and
    // not in some cache.
    //
    // See https://github.com/nodejs/node/blob/v5.10.0/lib/fs.js#L1194
    var canFlush = true;
    function writeFileAndFlush(path, data, options, callback) {
        if (!canFlush) {
            return fs.writeFile(path, data, options, callback);
        }
        if (!options) {
            options = { encoding: 'utf8', mode: 438, flag: 'w' };
        }
        else if (typeof options === 'string') {
            options = { encoding: options, mode: 438, flag: 'w' };
        }
        // Open the file with same flags and mode as fs.writeFile()
        fs.open(path, options.flag, options.mode, function (openError, fd) {
            if (openError) {
                return callback(openError);
            }
            // It is valid to pass a fd handle to fs.writeFile() and this will keep the handle open!
            fs.writeFile(fd, data, options.encoding, function (writeError) {
                if (writeError) {
                    return fs.close(fd, function () { return callback(writeError); }); // still need to close the handle on error!
                }
                // Flush contents (not metadata) of the file to disk
                fs.fdatasync(fd, function (syncError) {
                    // In some exotic setups it is well possible that node fails to sync
                    // In that case we disable flushing and warn to the console
                    if (syncError) {
                        console.warn('[node.js fs] fdatasync is now disabled for this session because it failed: ', syncError);
                        canFlush = false;
                    }
                    return fs.close(fd, function (closeError) { return callback(closeError); });
                });
            });
        });
    }
    exports.writeFileAndFlush = writeFileAndFlush;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[68/*vs/base/node/id*/], __M([0/*require*/,1/*exports*/,101/*getmac*/,71/*crypto*/,2/*vs/base/common/winjs.base*/,9/*vs/base/common/errors*/,25/*vs/base/common/uuid*/,26/*os*/]), function (require, exports, getmac, crypto, winjs_base_1, errors, uuid, os_1) {
    "use strict";
    var mac = new (function () {
        function class_1() {
        }
        Object.defineProperty(class_1.prototype, "value", {
            get: function () {
                if (this._value === void 0) {
                    this._initValue();
                }
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        class_1.prototype._initValue = function () {
            this._value = null;
            var interfaces = os_1.networkInterfaces();
            for (var key in interfaces) {
                for (var _i = 0, _a = interfaces[key]; _i < _a.length; _i++) {
                    var i = _a[_i];
                    if (!i.internal) {
                        this._value = crypto.createHash('sha256').update(i.mac, 'utf8').digest('hex');
                        return;
                    }
                }
            }
            this._value = "missing-" + uuid.generateUuid();
        };
        return class_1;
    }());
    function _futureMachineIdExperiment() {
        return mac.value;
    }
    exports._futureMachineIdExperiment = _futureMachineIdExperiment;
    function getMachineId() {
        return new winjs_base_1.TPromise(function (resolve) {
            try {
                getmac.getMac(function (error, macAddress) {
                    if (!error) {
                        resolve(crypto.createHash('sha256').update(macAddress, 'utf8').digest('hex'));
                    }
                    else {
                        resolve(uuid.generateUuid()); // fallback, generate a UUID
                    }
                });
            }
            catch (err) {
                errors.onUnexpectedError(err);
                resolve(uuid.generateUuid()); // fallback, generate a UUID
            }
        });
    }
    exports.getMachineId = getMachineId;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[79/*vs/base/node/paths*/], __M([0/*require*/,1/*exports*/,32/*vs/base/common/uri*/]), function (require, exports, uri_1) {
    "use strict";
    var pathsPath = uri_1.default.parse(require.toUrl('paths')).fsPath;
    var paths = require.__$__nodeRequire(pathsPath);
    exports.getAppDataPath = paths.getAppDataPath;
    exports.getDefaultUserDataPath = paths.getDefaultUserDataPath;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[21/*vs/base/node/pfs*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,65/*vs/base/node/extfs*/,15/*vs/base/common/paths*/,10/*path*/,19/*vs/base/common/async*/,18/*fs*/,16/*vs/base/common/platform*/,6/*vs/base/common/event*/]), function (require, exports, winjs_base_1, extfs, paths, path_1, async_1, fs, platform, event_1) {
    'use strict';
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
        // is root?
        if (path === path_1.dirname(path)) {
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
                return void 0;
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
    function touch(path) {
        var now = Date.now() / 1000; // the value should be a Unix timestamp in seconds
        return async_1.nfcall(fs.utimes, path, now, now);
    }
    exports.touch = touch;
    function readFile(path, encoding) {
        return async_1.nfcall(fs.readFile, path, encoding);
    }
    exports.readFile = readFile;
    // According to node.js docs (https://nodejs.org/docs/v6.5.0/api/fs.html#fs_fs_writefile_file_data_options_callback)
    // it is not safe to call writeFile() on the same path multiple times without waiting for the callback to return.
    // Therefor we use a Queue on the path that is given to us to sequentialize calls to the same path properly.
    var writeFilePathQueue = Object.create(null);
    function writeFile(path, data, encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        var queueKey = toQueueKey(path);
        return ensureWriteFileQueue(queueKey).queue(function () { return async_1.nfcall(extfs.writeFileAndFlush, path, data, encoding); });
    }
    exports.writeFile = writeFile;
    function toQueueKey(path) {
        var queueKey = path;
        if (platform.isWindows || platform.isMacintosh) {
            queueKey = queueKey.toLowerCase(); // accomodate for case insensitive file systems
        }
        return queueKey;
    }
    function ensureWriteFileQueue(queueKey) {
        var writeFileQueue = writeFilePathQueue[queueKey];
        if (!writeFileQueue) {
            writeFileQueue = new async_1.Queue();
            writeFilePathQueue[queueKey] = writeFileQueue;
            var onFinish = event_1.once(writeFileQueue.onFinished);
            onFinish(function () {
                delete writeFilePathQueue[queueKey];
                writeFileQueue.dispose();
            });
        }
        return writeFileQueue;
    }
    /**
    * Read a dir and return only subfolders
    */
    function readDirsInDir(dirPath) {
        return readdir(dirPath).then(function (children) {
            return winjs_base_1.TPromise.join(children.map(function (c) { return dirExists(paths.join(dirPath, c)); })).then(function (exists) {
                return children.filter(function (_, i) { return exists[i]; });
            });
        });
    }
    exports.readDirsInDir = readDirsInDir;
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
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[83/*vs/base/node/proxy*/], __M([0/*require*/,1/*exports*/,87/*url*/,8/*vs/base/common/types*/,97/*http-proxy-agent*/,96/*https-proxy-agent*/]), function (require, exports, url_1, types_1, HttpProxyAgent, HttpsProxyAgent) {
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

define(__m[42/*vs/nls!vs/base/common/json*/], __M([4/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/base/common/json", data); });
define(__m[45/*vs/base/common/json*/], __M([0/*require*/,1/*exports*/,42/*vs/nls!vs/base/common/json*/]), function (require, exports, nls_1) {
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
            token = SyntaxKind.Unknown;
            scanError = ScanError.None;
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
                    scanError = ScanError.UnexpectedEndOfNumber;
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
                if (ch === 34 /* doubleQuote */) {
                    result += text.substring(start, pos);
                    pos++;
                    break;
                }
                if (ch === 92 /* backslash */) {
                    result += text.substring(start, pos);
                    pos++;
                    if (pos >= len) {
                        scanError = ScanError.UnexpectedEndOfString;
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
                if (code === 13 /* carriageReturn */ && text.charCodeAt(pos) === 10 /* lineFeed */) {
                    pos++;
                    value += '\n';
                }
                return token = SyntaxKind.LineBreakTrivia;
            }
            switch (code) {
                // tokens: []{}:,
                case 123 /* openBrace */:
                    pos++;
                    return token = SyntaxKind.OpenBraceToken;
                case 125 /* closeBrace */:
                    pos++;
                    return token = SyntaxKind.CloseBraceToken;
                case 91 /* openBracket */:
                    pos++;
                    return token = SyntaxKind.OpenBracketToken;
                case 93 /* closeBracket */:
                    pos++;
                    return token = SyntaxKind.CloseBracketToken;
                case 58 /* colon */:
                    pos++;
                    return token = SyntaxKind.ColonToken;
                case 44 /* comma */:
                    pos++;
                    return token = SyntaxKind.CommaToken;
                // strings
                case 34 /* doubleQuote */:
                    pos++;
                    value = scanString();
                    return token = SyntaxKind.StringLiteral;
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
                        return token = SyntaxKind.LineCommentTrivia;
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
                case 45 /* minus */:
                    value += String.fromCharCode(code);
                    pos++;
                    if (pos === len || !isDigit(text.charCodeAt(pos))) {
                        return token = SyntaxKind.Unknown;
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
                case 125 /* closeBrace */:
                case 93 /* closeBracket */:
                case 123 /* openBrace */:
                case 91 /* openBracket */:
                case 34 /* doubleQuote */:
                case 58 /* colon */:
                case 44 /* comma */:
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
define(__m[46/*vs/base/node/config*/], __M([0/*require*/,1/*exports*/,18/*fs*/,10/*path*/,7/*vs/base/common/objects*/,12/*vs/base/common/lifecycle*/,6/*vs/base/common/event*/,45/*vs/base/common/json*/]), function (require, exports, fs, path, objects, lifecycle_1, event_1, json) {
    'use strict';
    /**
     * A simple helper to watch a configured file for changes and process its contents as JSON object.
     * Supports:
     * - comments in JSON files and errors
     * - symlinks for the config file itself
     * - delayed processing of changes to accomodate for lots of changes
     * - configurable defaults
     */
    var ConfigWatcher = (function () {
        function ConfigWatcher(_path, options) {
            if (options === void 0) { options = { changeBufferDelay: 0, defaultConfig: Object.create(null) }; }
            this._path = _path;
            this.options = options;
            this.disposables = [];
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
                res = json.parse(raw, this.parseErrors);
            }
            catch (error) {
            }
            return res || this.options.defaultConfig;
        };
        ConfigWatcher.prototype.registerWatcher = function () {
            var _this = this;
            // Watch the parent of the path so that we detect ADD and DELETES
            var parentFolder = path.dirname(this._path);
            this.watch(parentFolder);
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
                        _this.watch(realPath);
                    });
                }
            });
        };
        ConfigWatcher.prototype.watch = function (path) {
            var _this = this;
            if (this.disposed) {
                return; // avoid watchers that will never get disposed by checking for being disposed
            }
            try {
                var watcher_1 = fs.watch(path);
                watcher_1.on('change', function () { return _this.onConfigFileChange(); });
                this.disposables.push(lifecycle_1.toDisposable(function () {
                    watcher_1.removeAllListeners();
                    watcher_1.close();
                }));
            }
            catch (error) {
                fs.exists(path, function (exists) {
                    if (exists) {
                        console.warn("Failed to watch " + path + " for configuration changes (" + error.toString() + ")");
                    }
                });
            }
        };
        ConfigWatcher.prototype.onConfigFileChange = function () {
            var _this = this;
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

define(__m[48/*vs/nls!vs/base/common/severity*/], __M([4/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/base/common/severity", data); });
define(__m[35/*vs/base/common/severity*/], __M([0/*require*/,1/*exports*/,48/*vs/nls!vs/base/common/severity*/,14/*vs/base/common/strings*/]), function (require, exports, nls, strings) {
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

define(__m[50/*vs/nls!vs/base/node/zip*/], __M([4/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/base/node/zip", data); });

define(__m[51/*vs/nls!vs/platform/configuration/common/configurationRegistry*/], __M([4/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/configuration/common/configurationRegistry", data); });
define(__m[66/*vs/nls!vs/platform/extensionManagement/common/extensionManagement*/], __M([4/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/extensionManagement/common/extensionManagement", data); });
define(__m[53/*vs/nls!vs/platform/extensionManagement/node/extensionGalleryService*/], __M([4/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/extensionManagement/node/extensionGalleryService", data); });
define(__m[54/*vs/nls!vs/platform/extensionManagement/node/extensionManagementService*/], __M([4/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/extensionManagement/node/extensionManagementService", data); });
define(__m[55/*vs/nls!vs/platform/extensions/common/extensionsRegistry*/], __M([4/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/extensions/common/extensionsRegistry", data); });
define(__m[56/*vs/nls!vs/platform/extensions/node/extensionValidator*/], __M([4/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/extensions/node/extensionValidator", data); });
define(__m[57/*vs/nls!vs/platform/message/common/message*/], __M([4/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/message/common/message", data); });
define(__m[58/*vs/nls!vs/platform/request/node/request*/], __M([4/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/request/node/request", data); });
define(__m[59/*vs/nls!vs/platform/telemetry/common/telemetryService*/], __M([4/*vs/nls*/,3/*vs/nls!vs/code/node/cliProcessMain*/]), function(nls, data) { return nls.create("vs/platform/telemetry/common/telemetryService", data); });





define(__m[60/*vs/platform/event/common/eventService*/], __M([0/*require*/,1/*exports*/,24/*vs/base/common/eventEmitter*/]), function (require, exports, eventEmitter_1) {
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
define(__m[61/*vs/platform/extensionManagement/common/extensionNls*/], __M([0/*require*/,1/*exports*/,7/*vs/base/common/objects*/]), function (require, exports, objects_1) {
    'use strict';
    var nlsRegex = /^%([\w\d.]+)%$/i;
    function localizeManifest(manifest, translations) {
        var patcher = function (value) {
            if (typeof value !== 'string') {
                return;
            }
            var match = nlsRegex.exec(value);
            if (!match) {
                return;
            }
            return translations[match[1]] || value;
        };
        return objects_1.cloneAndChange(manifest, patcher);
    }
    exports.localizeManifest = localizeManifest;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[62/*vs/platform/extensionManagement/common/extensionTelemetry*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    'use strict';
    function getLocalExtensionTelemetryData(extension) {
        return {
            id: extension.manifest.publisher + "." + extension.manifest.name,
            name: extension.manifest.name,
            galleryId: extension.metadata ? extension.metadata.id : null,
            publisherId: extension.metadata ? extension.metadata.publisherId : null,
            publisherName: extension.manifest.publisher,
            publisherDisplayName: extension.metadata ? extension.metadata.publisherDisplayName : null,
            dependencies: extension.manifest.extensionDependencies && extension.manifest.extensionDependencies.length > 0
        };
    }
    exports.getLocalExtensionTelemetryData = getLocalExtensionTelemetryData;
    function getGalleryExtensionTelemetryData(extension) {
        return {
            id: extension.publisher + "." + extension.name,
            name: extension.name,
            galleryId: extension.id,
            publisherId: extension.publisherId,
            publisherName: extension.publisher,
            publisherDisplayName: extension.publisherDisplayName,
            dependencies: extension.properties.dependencies.length > 0
        };
    }
    exports.getGalleryExtensionTelemetryData = getGalleryExtensionTelemetryData;
});

define(__m[63/*vs/platform/extensions/node/extensionValidator*/], __M([0/*require*/,1/*exports*/,56/*vs/nls!vs/platform/extensions/node/extensionValidator*/,64/*semver*/,15/*vs/base/common/paths*/]), function (require, exports, nls, semver_1, paths) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
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
    function baseIsValidExtensionDescription(extensionFolderPath, extensionDescription, notices) {
        if (!extensionDescription) {
            notices.push(nls.localize(4, null));
            return false;
        }
        if (typeof extensionDescription.publisher !== 'string') {
            notices.push(nls.localize(5, null, 'publisher'));
            return false;
        }
        if (typeof extensionDescription.name !== 'string') {
            notices.push(nls.localize(6, null, 'name'));
            return false;
        }
        if (typeof extensionDescription.version !== 'string') {
            notices.push(nls.localize(7, null, 'version'));
            return false;
        }
        if (!extensionDescription.engines) {
            notices.push(nls.localize(8, null, 'engines'));
            return false;
        }
        if (typeof extensionDescription.engines.vscode !== 'string') {
            notices.push(nls.localize(9, null, 'engines.vscode'));
            return false;
        }
        if (typeof extensionDescription.extensionDependencies !== 'undefined') {
            if (!_isStringArray(extensionDescription.extensionDependencies)) {
                notices.push(nls.localize(10, null, 'extensionDependencies'));
                return false;
            }
        }
        if (typeof extensionDescription.activationEvents !== 'undefined') {
            if (!_isStringArray(extensionDescription.activationEvents)) {
                notices.push(nls.localize(11, null, 'activationEvents'));
                return false;
            }
            if (typeof extensionDescription.main === 'undefined') {
                notices.push(nls.localize(12, null, 'activationEvents', 'main'));
                return false;
            }
        }
        if (typeof extensionDescription.main !== 'undefined') {
            if (typeof extensionDescription.main !== 'string') {
                notices.push(nls.localize(13, null, 'main'));
                return false;
            }
            else {
                var normalizedAbsolutePath = paths.normalize(paths.join(extensionFolderPath, extensionDescription.main));
                if (normalizedAbsolutePath.indexOf(extensionFolderPath)) {
                    notices.push(nls.localize(14, null, normalizedAbsolutePath, extensionFolderPath));
                }
            }
            if (typeof extensionDescription.activationEvents === 'undefined') {
                notices.push(nls.localize(15, null, 'activationEvents', 'main'));
                return false;
            }
        }
        return true;
    }
    function isValidExtensionDescription(version, extensionFolderPath, extensionDescription, notices) {
        if (!baseIsValidExtensionDescription(extensionFolderPath, extensionDescription, notices)) {
            return false;
        }
        if (!semver_1.valid(extensionDescription.version)) {
            notices.push(nls.localize(16, null));
            return false;
        }
        return isValidExtensionVersion(version, extensionDescription, notices);
    }
    exports.isValidExtensionDescription = isValidExtensionDescription;
});






define(__m[30/*vs/platform/instantiation/common/descriptors*/], __M([0/*require*/,1/*exports*/,9/*vs/base/common/errors*/]), function (require, exports, errors_1) {
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
});

define(__m[5/*vs/platform/instantiation/common/instantiation*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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
define(__m[13/*vs/platform/configuration/common/configuration*/], __M([0/*require*/,1/*exports*/,5/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
    "use strict";
    exports.IConfigurationService = instantiation_1.createDecorator('configurationService');
    (function (ConfigurationSource) {
        ConfigurationSource[ConfigurationSource["Default"] = 1] = "Default";
        ConfigurationSource[ConfigurationSource["User"] = 2] = "User";
        ConfigurationSource[ConfigurationSource["Workspace"] = 3] = "Workspace";
    })(exports.ConfigurationSource || (exports.ConfigurationSource = {}));
    var ConfigurationSource = exports.ConfigurationSource;
    /**
     * A helper function to get the configuration value with a specific settings path (e.g. config.some.setting)
     */
    function getConfigurationValue(config, settingPath, defaultValue) {
        function accessSetting(config, path) {
            var current = config;
            for (var i = 0; i < path.length; i++) {
                current = current[path[i]];
                if (typeof current === 'undefined') {
                    return undefined;
                }
            }
            return current;
        }
        var path = settingPath.split('.');
        var result = accessSetting(config, path);
        return typeof result === 'undefined' ? defaultValue : result;
    }
    exports.getConfigurationValue = getConfigurationValue;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[22/*vs/platform/environment/common/environment*/], __M([0/*require*/,1/*exports*/,5/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
    "use strict";
    exports.IEnvironmentService = instantiation_1.createDecorator('environmentService');
});

define(__m[69/*vs/platform/event/common/event*/], __M([0/*require*/,1/*exports*/,5/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
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
define(__m[27/*vs/platform/extensionManagement/common/extensionManagement*/], __M([0/*require*/,1/*exports*/,66/*vs/nls!vs/platform/extensionManagement/common/extensionManagement*/,5/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, nls_1, instantiation_1) {
    'use strict';
    exports.EXTENSION_IDENTIFIER_PATTERN = '^[a-z0-9A-Z][a-z0-9\-A-Z]*\\.[a-z0-9A-Z][a-z0-9\-A-Z]*$';
    exports.EXTENSION_IDENTIFIER_REGEX = new RegExp(exports.EXTENSION_IDENTIFIER_PATTERN);
    (function (LocalExtensionType) {
        LocalExtensionType[LocalExtensionType["System"] = 0] = "System";
        LocalExtensionType[LocalExtensionType["User"] = 1] = "User";
    })(exports.LocalExtensionType || (exports.LocalExtensionType = {}));
    var LocalExtensionType = exports.LocalExtensionType;
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
    exports.IExtensionEnablementService = instantiation_1.createDecorator('extensionEnablementService');
    exports.IExtensionTipsService = instantiation_1.createDecorator('extensionTipsService');
    exports.ExtensionsLabel = nls_1.localize(0, null);
    exports.ExtensionsChannelId = 'extensions';
    exports.PreferencesLabel = nls_1.localize(1, null);
});

define(__m[33/*vs/platform/instantiation/common/serviceCollection*/], __M([0/*require*/,1/*exports*/,17/*vs/base/common/arrays*/]), function (require, exports, arrays_1) {
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

define(__m[72/*vs/platform/instantiation/common/instantiationService*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,9/*vs/base/common/errors*/,8/*vs/base/common/types*/,41/*vs/base/common/assert*/,47/*vs/base/common/graph*/,30/*vs/platform/instantiation/common/descriptors*/,5/*vs/platform/instantiation/common/instantiation*/,33/*vs/platform/instantiation/common/serviceCollection*/]), function (require, exports, winjs_base_1, errors_1, types_1, assert, graph_1, descriptors_1, instantiation_1, serviceCollection_1) {
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

define(__m[73/*vs/platform/keybinding/common/keybinding*/], __M([0/*require*/,1/*exports*/,5/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    (function (KeybindingSource) {
        KeybindingSource[KeybindingSource["Default"] = 1] = "Default";
        KeybindingSource[KeybindingSource["User"] = 2] = "User";
    })(exports.KeybindingSource || (exports.KeybindingSource = {}));
    var KeybindingSource = exports.KeybindingSource;
    exports.IKeybindingService = instantiation_1.createDecorator('keybindingService');
});

define(__m[74/*vs/platform/lifecycle/common/lifecycle*/], __M([0/*require*/,1/*exports*/,5/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.ILifecycleService = instantiation_1.createDecorator('lifecycleService');
    (function (ShutdownReason) {
        /** Window is closed */
        ShutdownReason[ShutdownReason["CLOSE"] = 0] = "CLOSE";
        /** Application is quit */
        ShutdownReason[ShutdownReason["QUIT"] = 1] = "QUIT";
        /** Window is reloaded */
        ShutdownReason[ShutdownReason["RELOAD"] = 2] = "RELOAD";
        /** Other configuration loaded into window */
        ShutdownReason[ShutdownReason["LOAD"] = 3] = "LOAD";
    })(exports.ShutdownReason || (exports.ShutdownReason = {}));
    var ShutdownReason = exports.ShutdownReason;
    exports.NullLifecycleService = {
        _serviceBrand: null,
        willShutdown: false,
        onWillShutdown: function () { return ({ dispose: function () { } }); },
        onShutdown: function (reason) { return ({ dispose: function () { } }); }
    };
});

define(__m[34/*vs/platform/message/common/message*/], __M([0/*require*/,1/*exports*/,57/*vs/nls!vs/platform/message/common/message*/,2/*vs/base/common/winjs.base*/,35/*vs/base/common/severity*/,5/*vs/platform/instantiation/common/instantiation*/,43/*vs/base/common/actions*/]), function (require, exports, nls, winjs_base_1, severity_1, instantiation_1, actions_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.CloseAction = new actions_1.Action('close.message', nls.localize(0, null), null, true, function () { return winjs_base_1.TPromise.as(true); });
    exports.LaterAction = new actions_1.Action('later.message', nls.localize(1, null), null, true, function () { return winjs_base_1.TPromise.as(true); });
    exports.CancelAction = new actions_1.Action('cancel.message', nls.localize(2, null), null, true, function () { return winjs_base_1.TPromise.as(true); });
    exports.IMessageService = instantiation_1.createDecorator('messageService');
    exports.IChoiceService = instantiation_1.createDecorator('choiceService');
    exports.Severity = severity_1.default;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[76/*vs/platform/message/node/messageCli*/], __M([0/*require*/,1/*exports*/,98/*readline*/,2/*vs/base/common/winjs.base*/]), function (require, exports, readline, winjs_base_1) {
    "use strict";
    var ChoiceCliService = (function () {
        function ChoiceCliService() {
        }
        ChoiceCliService.prototype.choose = function (severity, message, options) {
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
                    promise.cancel();
                });
            });
            return promise;
        };
        ChoiceCliService.prototype.toQuestion = function (message, options) {
            return options.reduce(function (previousValue, currentValue, currentIndex) {
                return previousValue + currentValue + '(' + currentIndex + ')' + (currentIndex < options.length - 1 ? ' | ' : '\n');
            }, message + ' ');
        };
        ChoiceCliService.prototype.toOption = function (answer, options) {
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
        return ChoiceCliService;
    }());
    exports.ChoiceCliService = ChoiceCliService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[78/*vs/platform/environment/node/http*/], __M([0/*require*/,1/*exports*/,68/*vs/base/node/id*/,28/*vs/platform/package*/]), function (require, exports, id_1, package_1) {
    "use strict";
    function getCommonHTTPHeaders() {
        return id_1.getMachineId().then(function (machineId) { return ({
            'X-Market-Client-Id': "VSCode " + package_1.default.version,
            'User-Agent': "VSCode " + package_1.default.version,
            'X-Market-User-Id': machineId
        }); });
    }
    exports.getCommonHTTPHeaders = getCommonHTTPHeaders;
});

define(__m[11/*vs/platform/platform*/], __M([0/*require*/,1/*exports*/,8/*vs/base/common/types*/,41/*vs/base/common/assert*/]), function (require, exports, Types, Assert) {
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

define(__m[37/*vs/platform/jsonschemas/common/jsonContributionRegistry*/], __M([0/*require*/,1/*exports*/,11/*vs/platform/platform*/,24/*vs/base/common/eventEmitter*/]), function (require, exports, platform, eventEmitter_1) {
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

define(__m[82/*vs/platform/extensions/common/extensionsRegistry*/], __M([0/*require*/,1/*exports*/,55/*vs/nls!vs/platform/extensions/common/extensionsRegistry*/,9/*vs/base/common/errors*/,35/*vs/base/common/severity*/,37/*vs/platform/jsonschemas/common/jsonContributionRegistry*/,11/*vs/platform/platform*/,6/*vs/base/common/event*/]), function (require, exports, nls, errors_1, severity_1, jsonContributionRegistry_1, platform_1, event_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var hasOwnProperty = Object.hasOwnProperty;
    var schemaRegistry = platform_1.Registry.as(jsonContributionRegistry_1.Extensions.JSONContribution);
    exports.onWillActivate = new event_1.Emitter();
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
    exports.ExtensionMessageCollector = ExtensionMessageCollector;
    var ExtensionPoint = (function () {
        function ExtensionPoint(name) {
            this.name = name;
            this._handler = null;
            this._users = null;
            this._done = false;
        }
        ExtensionPoint.prototype.setHandler = function (handler) {
            if (this._handler !== null || this._done) {
                throw new Error('Handler already set!');
            }
            this._handler = handler;
            this._handle();
        };
        ExtensionPoint.prototype.acceptUsers = function (users) {
            if (this._users !== null || this._done) {
                throw new Error('Users already set!');
            }
            this._users = users;
            this._handle();
        };
        ExtensionPoint.prototype._handle = function () {
            if (this._handler === null || this._users === null) {
                return;
            }
            this._done = true;
            var handler = this._handler;
            this._handler = null;
            var users = this._users;
            this._users = null;
            try {
                handler(users);
            }
            catch (err) {
                errors_1.onUnexpectedError(err);
            }
        };
        return ExtensionPoint;
    }());
    exports.ExtensionPoint = ExtensionPoint;
    var schemaId = 'vscode://schemas/vscode-extensions';
    var schema = {
        properties: {
            engines: {
                type: 'object',
                properties: {
                    'vscode': {
                        type: 'string',
                        description: nls.localize(0, null),
                        default: '^0.10.0',
                    }
                }
            },
            publisher: {
                description: nls.localize(1, null),
                type: 'string'
            },
            displayName: {
                description: nls.localize(2, null),
                type: 'string'
            },
            categories: {
                description: nls.localize(3, null),
                type: 'array',
                uniqueItems: true,
                items: {
                    type: 'string',
                    enum: ['Languages', 'Snippets', 'Linters', 'Themes', 'Debuggers', 'Other', 'Keymaps', 'Formatters']
                }
            },
            galleryBanner: {
                type: 'object',
                description: nls.localize(4, null),
                properties: {
                    color: {
                        description: nls.localize(5, null),
                        type: 'string'
                    },
                    theme: {
                        description: nls.localize(6, null),
                        type: 'string',
                        enum: ['dark', 'light']
                    }
                }
            },
            contributes: {
                description: nls.localize(7, null),
                type: 'object',
                properties: {},
                default: {}
            },
            preview: {
                type: 'boolean',
                description: nls.localize(8, null),
            },
            activationEvents: {
                description: nls.localize(9, null),
                type: 'array',
                items: {
                    type: 'string',
                    defaultSnippets: [{ label: 'onLanguage', body: 'onLanguage:${1:languageId}' }, { label: 'onCommand', body: 'onCommand:${2:commandId}' }, { label: 'onDebug', body: 'onDebug:${3:type}' }, { label: 'workspaceContains', body: 'workspaceContains:${4:fileName}' }],
                }
            },
            badges: {
                type: 'array',
                description: nls.localize(10, null),
                items: {
                    type: 'object',
                    required: ['url', 'href', 'description'],
                    properties: {
                        url: {
                            type: 'string',
                            description: nls.localize(11, null)
                        },
                        href: {
                            type: 'string',
                            description: nls.localize(12, null)
                        },
                        description: {
                            type: 'string',
                            description: nls.localize(13, null)
                        }
                    }
                }
            },
            extensionDependencies: {
                description: nls.localize(14, null),
                type: 'array',
                uniqueItems: true,
                items: {
                    type: 'string'
                }
            },
            scripts: {
                type: 'object',
                properties: {
                    'vscode:prepublish': {
                        description: nls.localize(15, null),
                        type: 'string'
                    }
                }
            },
            icon: {
                type: 'string',
                description: nls.localize(16, null)
            }
        }
    };
    var ExtensionsRegistryImpl = (function () {
        function ExtensionsRegistryImpl() {
            this._extensionPoints = {};
        }
        ExtensionsRegistryImpl.prototype.registerExtensionPoint = function (extensionPoint, deps, jsonSchema) {
            if (hasOwnProperty.call(this._extensionPoints, extensionPoint)) {
                throw new Error('Duplicate extension point: ' + extensionPoint);
            }
            var result = new ExtensionPoint(extensionPoint);
            this._extensionPoints[extensionPoint] = result;
            schema.properties['contributes'].properties[extensionPoint] = jsonSchema;
            schemaRegistry.registerSchema(schemaId, schema);
            return result;
        };
        ExtensionsRegistryImpl.prototype.getExtensionPoints = function () {
            var _this = this;
            return Object.keys(this._extensionPoints).map(function (point) { return _this._extensionPoints[point]; });
        };
        return ExtensionsRegistryImpl;
    }());
    exports.ExtensionsRegistryImpl = ExtensionsRegistryImpl;
    var PRExtensions = {
        ExtensionsRegistry: 'ExtensionsRegistry'
    };
    platform_1.Registry.add(PRExtensions.ExtensionsRegistry, new ExtensionsRegistryImpl());
    exports.ExtensionsRegistry = platform_1.Registry.as(PRExtensions.ExtensionsRegistry);
    schemaRegistry.registerSchema(schemaId, schema);
});

define(__m[20/*vs/platform/configuration/common/configurationRegistry*/], __M([0/*require*/,1/*exports*/,51/*vs/nls!vs/platform/configuration/common/configurationRegistry*/,6/*vs/base/common/event*/,11/*vs/platform/platform*/,7/*vs/base/common/objects*/,8/*vs/base/common/types*/,82/*vs/platform/extensions/common/extensionsRegistry*/,37/*vs/platform/jsonschemas/common/jsonContributionRegistry*/]), function (require, exports, nls, event_1, platform_1, objects, types, extensionsRegistry_1, jsonContributionRegistry_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.Extensions = {
        Configuration: 'base.contributions.configuration'
    };
    var schemaId = 'vscode://schemas/settings';
    var contributionRegistry = platform_1.Registry.as(jsonContributionRegistry_1.Extensions.JSONContribution);
    var ConfigurationRegistry = (function () {
        function ConfigurationRegistry() {
            this.configurationContributors = [];
            this.configurationSchema = { properties: {}, additionalProperties: false, errorMessage: 'Unknown configuration setting' };
            this._onDidRegisterConfiguration = new event_1.Emitter();
            this.configurationProperties = {};
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
            this.registerConfigurations([configuration]);
        };
        ConfigurationRegistry.prototype.registerConfigurations = function (configurations) {
            var _this = this;
            configurations.forEach(function (configuration) {
                _this.registerProperties(configuration); // fills in defaults
                _this.configurationContributors.push(configuration);
                _this.registerJSONConfiguration(configuration);
            });
            this._onDidRegisterConfiguration.fire(this);
        };
        ConfigurationRegistry.prototype.registerProperties = function (configuration) {
            var properties = configuration.properties;
            if (properties) {
                for (var key in properties) {
                    // fill in default values
                    var property = properties[key];
                    var defaultValue = property.default;
                    if (types.isUndefined(defaultValue)) {
                        property.default = getDefaultValue(property.type);
                    }
                    // add to properties map
                    this.configurationProperties[key] = properties[key];
                }
            }
            var subNodes = configuration.allOf;
            if (subNodes) {
                for (var _i = 0, subNodes_1 = subNodes; _i < subNodes_1.length; _i++) {
                    var node = subNodes_1[_i];
                    this.registerProperties(node);
                }
            }
        };
        ConfigurationRegistry.prototype.getConfigurations = function () {
            return this.configurationContributors;
        };
        ConfigurationRegistry.prototype.getConfigurationProperties = function () {
            return this.configurationProperties;
        };
        ConfigurationRegistry.prototype.registerJSONConfiguration = function (configuration) {
            var configurationSchema = this.configurationSchema;
            function register(configuration) {
                var properties = configuration.properties;
                if (properties) {
                    for (var key in properties) {
                        configurationSchema.properties[key] = properties[key];
                    }
                }
                var subNodes = configuration.allOf;
                if (subNodes) {
                    subNodes.forEach(register);
                }
            }
            ;
            register(configuration);
            contributionRegistry.registerSchema(schemaId, configurationSchema);
        };
        return ConfigurationRegistry;
    }());
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
    var configurationExtPoint = extensionsRegistry_1.ExtensionsRegistry.registerExtensionPoint('configuration', [], {
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
        var configurations = [];
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
            configurations.push(clonedConfiguration);
        }
        configurationRegistry.registerConfigurations(configurations);
    });
});

define(__m[84/*vs/platform/configuration/common/model*/], __M([0/*require*/,1/*exports*/,11/*vs/platform/platform*/,20/*vs/platform/configuration/common/configurationRegistry*/]), function (require, exports, platform_1, configurationRegistry_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
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
        ;
        if (typeof curr === 'object') {
            curr[last] = value; // workaround https://github.com/Microsoft/vscode/issues/13606
        }
        else {
            conflictReporter("Ignoring " + key + " as " + segments.join('.') + " is " + JSON.stringify(curr));
        }
    }
    function getConfigurationKeys() {
        var properties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
        return Object.keys(properties);
    }
    exports.getConfigurationKeys = getConfigurationKeys;
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
define(__m[85/*vs/platform/configuration/node/configurationService*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,7/*vs/base/common/objects*/,84/*vs/platform/configuration/common/model*/,46/*vs/base/node/config*/,11/*vs/platform/platform*/,20/*vs/platform/configuration/common/configurationRegistry*/,12/*vs/base/common/lifecycle*/,13/*vs/platform/configuration/common/configuration*/,6/*vs/base/common/event*/,22/*vs/platform/environment/common/environment*/]), function (require, exports, winjs_base_1, objects, model_1, config_1, platform_1, configurationRegistry_1, lifecycle_1, configuration_1, event_1, environment_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var ConfigurationService = (function () {
        function ConfigurationService(environmentService) {
            var _this = this;
            this.disposables = [];
            this._onDidUpdateConfiguration = new event_1.Emitter();
            this.disposables.push(this._onDidUpdateConfiguration);
            this.rawConfig = new config_1.ConfigWatcher(environmentService.appSettingsPath, { changeBufferDelay: 300, defaultConfig: Object.create(null) });
            this.disposables.push(lifecycle_1.toDisposable(function () { return _this.rawConfig.dispose(); }));
            // Listeners
            this.disposables.push(this.rawConfig.onDidUpdateConfiguration(function () { return _this.onConfigurationChange(configuration_1.ConfigurationSource.User); }));
            this.disposables.push(platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).onDidRegisterConfiguration(function () { return _this.onConfigurationChange(configuration_1.ConfigurationSource.Default); }));
        }
        ConfigurationService.prototype.onConfigurationChange = function (source) {
            this.cache = void 0; // reset our caches
            var cache = this.getCache();
            this._onDidUpdateConfiguration.fire({
                config: this.getConfiguration(),
                source: source,
                sourceConfig: source === configuration_1.ConfigurationSource.Default ? cache.defaults : cache.user
            });
        };
        Object.defineProperty(ConfigurationService.prototype, "onDidUpdateConfiguration", {
            get: function () {
                return this._onDidUpdateConfiguration.event;
            },
            enumerable: true,
            configurable: true
        });
        ConfigurationService.prototype.reloadConfiguration = function (section) {
            var _this = this;
            return new winjs_base_1.TPromise(function (c) {
                _this.rawConfig.reload(function () {
                    _this.cache = void 0; // reset our caches
                    c(_this.getConfiguration(section));
                });
            });
        };
        ConfigurationService.prototype.getConfiguration = function (section) {
            var cache = this.getCache();
            return section ? cache.consolidated[section] : cache.consolidated;
        };
        ConfigurationService.prototype.getCache = function () {
            return this.cache || (this.cache = this.consolidateConfigurations());
        };
        ConfigurationService.prototype.lookup = function (key) {
            var cache = this.getCache();
            // make sure to clone the configuration so that the receiver does not tamper with the values
            return {
                default: objects.clone(configuration_1.getConfigurationValue(cache.defaults, key)),
                user: objects.clone(configuration_1.getConfigurationValue(cache.user, key)),
                value: objects.clone(configuration_1.getConfigurationValue(cache.consolidated, key))
            };
        };
        ConfigurationService.prototype.keys = function () {
            return {
                default: model_1.getConfigurationKeys(),
                user: Object.keys(this.rawConfig.getConfig())
            };
        };
        ConfigurationService.prototype.consolidateConfigurations = function () {
            var defaults = model_1.getDefaultValues(); // defaults coming from contributions to registries
            var user = model_1.toValuesTree(this.rawConfig.getConfig(), function (message) { return console.error("Conflict in user settings: " + message); }); // user configured settings
            var consolidated = objects.mixin(objects.clone(defaults), // target: default values (but dont modify!)
            user, // source: user settings
            true // overwrite
            );
            return { defaults: defaults, user: user, consolidated: consolidated };
        };
        ConfigurationService.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        ConfigurationService = __decorate([
            __param(0, environment_1.IEnvironmentService)
        ], ConfigurationService);
        return ConfigurationService;
    }());
    exports.ConfigurationService = ConfigurationService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/






define(__m[86/*vs/platform/environment/node/environmentService*/], __M([0/*require*/,1/*exports*/,71/*crypto*/,79/*vs/base/node/paths*/,26/*os*/,10/*path*/,32/*vs/base/common/uri*/,36/*vs/base/common/decorators*/,28/*vs/platform/package*/,39/*vs/platform/product*/]), function (require, exports, crypto, paths, os, path, uri_1, decorators_1, package_1, product_1) {
    "use strict";
    function getUniqueUserId() {
        var username;
        if (process.platform === 'win32') {
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
    function getIPCHandlePrefix() {
        var name = package_1.default.name;
        // Support to run VS Code multiple times as different user
        // by making the socket unique over the logged in user
        var userId = getUniqueUserId();
        if (userId) {
            name += "-" + userId;
        }
        if (process.platform === 'win32') {
            return "\\\\.\\pipe\\" + name;
        }
        return path.join(os.tmpdir(), name);
    }
    function getIPCHandleSuffix() {
        return process.platform === 'win32' ? '-sock' : '.sock';
    }
    var EnvironmentService = (function () {
        function EnvironmentService(_args, _execPath) {
            this._args = _args;
            this._execPath = _execPath;
        }
        Object.defineProperty(EnvironmentService.prototype, "args", {
            get: function () { return this._args; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appRoot", {
            get: function () { return path.dirname(uri_1.default.parse(require.toUrl('')).fsPath); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "execPath", {
            get: function () { return this._execPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "userHome", {
            get: function () { return os.homedir(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "userProductHome", {
            get: function () { return path.join(this.userHome, product_1.default.dataFolderName); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "userDataPath", {
            get: function () { return parseUserDataDir(this._args, process); },
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
        Object.defineProperty(EnvironmentService.prototype, "extensionsPath", {
            get: function () { return path.normalize(this._args['extensions-dir'] || path.join(this.userProductHome, 'extensions')); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "extensionDevelopmentPath", {
            get: function () { return this._args.extensionDevelopmentPath ? path.normalize(this._args.extensionDevelopmentPath) : this._args.extensionDevelopmentPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "extensionTestsPath", {
            get: function () { return this._args.extensionTestsPath ? path.normalize(this._args.extensionTestsPath) : this._args.extensionTestsPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "disableExtensions", {
            get: function () { return this._args['disable-extensions']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "debugExtensionHost", {
            get: function () { return parseExtensionHostPort(this._args, this.isBuilt); },
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
        Object.defineProperty(EnvironmentService.prototype, "wait", {
            get: function () { return this._args.wait; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "performance", {
            get: function () { return this._args.performance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "logExtensionHostCommunication", {
            get: function () { return this._args.logExtensionHostCommunication; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "mainIPCHandle", {
            get: function () { return getIPCHandlePrefix() + "-" + package_1.default.version + getIPCHandleSuffix(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "sharedIPCHandle", {
            get: function () { return getIPCHandlePrefix() + "-" + package_1.default.version + "-shared" + getIPCHandleSuffix(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "nodeCachedDataDir", {
            get: function () { return path.join(this.userDataPath, 'CachedData', package_1.default.version); },
            enumerable: true,
            configurable: true
        });
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "appRoot", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "userHome", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "userProductHome", null);
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
        ], EnvironmentService.prototype, "extensionsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "extensionDevelopmentPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "extensionTestsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "debugExtensionHost", null);
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
        var portStr = args.debugBrkPluginHost || args.debugPluginHost;
        var port = Number(portStr) || (!isBuild ? 5870 : null);
        var brk = port ? Boolean(!!args.debugBrkPluginHost) : false;
        return { port: port, break: brk };
    }
    exports.parseExtensionHostPort = parseExtensionHostPort;
    function parseUserDataDir(args, process) {
        var arg = args['user-data-dir'];
        if (arg) {
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
        return path.resolve(paths.getDefaultUserDataPath(process.platform));
    }
    exports.parseUserDataDir = parseUserDataDir;
});

define(__m[40/*vs/platform/request/node/request*/], __M([0/*require*/,1/*exports*/,58/*vs/nls!vs/platform/request/node/request*/,5/*vs/platform/instantiation/common/instantiation*/,20/*vs/platform/configuration/common/configurationRegistry*/,11/*vs/platform/platform*/]), function (require, exports, nls_1, instantiation_1, configurationRegistry_1, platform_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
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

define(__m[23/*vs/platform/telemetry/common/telemetry*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,81/*vs/base/common/mime*/,15/*vs/base/common/paths*/,13/*vs/platform/configuration/common/configuration*/,5/*vs/platform/instantiation/common/instantiation*/,73/*vs/platform/keybinding/common/keybinding*/,74/*vs/platform/lifecycle/common/lifecycle*/]), function (require, exports, winjs_base_1, mime_1, paths, configuration_1, instantiation_1, keybinding_1, lifecycle_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.ITelemetryService = instantiation_1.createDecorator('telemetryService');
    exports.defaultExperiments = {
        showNewUserWatermark: false,
        openUntitledFile: true
    };
    exports.NullTelemetryService = {
        _serviceBrand: undefined,
        _experiments: exports.defaultExperiments,
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
        },
        getExperiments: function () {
            return this._experiments;
        }
    };
    var beginGettingStartedExp = Date.UTC(2017, 0, 9);
    var endGettingStartedExp = Date.UTC(2017, 0, 16);
    function loadExperiments(contextService, storageService, configurationService) {
        var key = 'experiments.randomness';
        var valueString = storageService.get(key);
        if (!valueString) {
            valueString = Math.random().toString();
            storageService.store(key, valueString);
        }
        var random1 = parseFloat(valueString);
        var _a = splitRandom(random1), random2 = _a[0], showNewUserWatermark = _a[1];
        var _b = splitRandom(random2), random3 = _b[0], openUntitledFile = _b[1];
        var _c = splitRandom(random3), openGettingStarted = _c[1];
        var newUserDuration = 24 * 60 * 60 * 1000;
        var firstSessionDate = storageService.get('telemetry.firstSessionDate');
        var isNewUser = !firstSessionDate || Date.now() - Date.parse(firstSessionDate) < newUserDuration;
        if (!isNewUser || !!contextService.getWorkspace()) {
            showNewUserWatermark = exports.defaultExperiments.showNewUserWatermark;
            openUntitledFile = exports.defaultExperiments.openUntitledFile;
        }
        var isNewSession = !storageService.get('telemetry.lastSessionDate');
        var now = Date.now();
        if (!(isNewSession && now >= beginGettingStartedExp && now < endGettingStartedExp)) {
            openGettingStarted = undefined;
        }
        return applyOverrides(configurationService, {
            showNewUserWatermark: showNewUserWatermark,
            openUntitledFile: openUntitledFile,
            openGettingStarted: openGettingStarted
        });
    }
    exports.loadExperiments = loadExperiments;
    function applyOverrides(configurationService, experiments) {
        var config = configurationService.getConfiguration('telemetry');
        var experimentsConfig = config && config.experiments || {};
        Object.keys(experiments).forEach(function (key) {
            if (key in experimentsConfig) {
                experiments[key] = experimentsConfig[key];
            }
        });
        return experiments;
    }
    exports.applyOverrides = applyOverrides;
    function splitRandom(random) {
        var scaled = random * 2;
        var i = Math.floor(scaled);
        return [scaled - i, i === 1];
    }
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
    function telemetryURIDescriptor(uri) {
        var fsPath = uri && uri.fsPath;
        return fsPath ? { mimeType: mime_1.guessMimeTypes(fsPath).join(', '), ext: paths.extname(fsPath), path: anonymize(fsPath) } : {};
    }
    exports.telemetryURIDescriptor = telemetryURIDescriptor;
    var configurationValueWhitelist = [
        'window.zoomLevel',
        'editor.fontSize',
        'editor.fontFamily',
        'editor.tabSize',
        'files.autoSave',
        'files.hotExit',
        'typescript.check.tscVersion',
        'editor.renderWhitespace',
        'editor.cursorBlinking',
        'editor.cursorStyle',
        'files.associations',
        'workbench.statusBar.visible',
        'editor.wrappingColumn',
        'editor.insertSpaces',
        'editor.renderIndentGuides',
        'files.trimTrailingWhitespace',
        'git.confirmSync',
        'editor.rulers',
        'workbench.sideBar.location',
        'editor.fontLigatures',
        'editor.wordWrap',
        'editor.lineHeight',
        'editor.detectIndentation',
        'editor.formatOnType',
        'editor.formatOnSave',
        'window.openFilesInNewWindow',
        'javascript.validate.enable',
        'editor.mouseWheelZoom',
        'typescript.check.workspaceVersion',
        'editor.fontWeight',
        'editor.scrollBeyondLastLine',
        'editor.lineNumbers',
        'editor.wrappingIndent',
        'editor.renderControlCharacters',
        'editor.autoClosingBrackets',
        'window.reopenFolders',
        'extensions.autoUpdate',
        'editor.tabCompletion',
        'files.eol',
        'explorer.openEditors.visible',
        'workbench.editor.enablePreview',
        'files.autoSaveDelay',
        'editor.roundedSelection',
        'editor.quickSuggestions',
        'editor.acceptSuggestionOnEnter',
        'workbench.editor.showTabs',
        'files.encoding',
        'editor.quickSuggestionsDelay',
        'editor.snippetSuggestions',
        'editor.selectionHighlight',
        'editor.glyphMargin',
        'php.validate.run',
        'editor.wordSeparators',
        'editor.mouseWheelScrollSensitivity',
        'editor.suggestOnTriggerCharacters',
        'git.enabled',
        'http.proxyStrictSSL',
        'terminal.integrated.fontFamily',
        'editor.overviewRulerLanes',
        'editor.wordBasedSuggestions',
        'editor.hideCursorInOverviewRuler',
        'editor.trimAutoWhitespace',
        'editor.folding',
        'workbench.editor.enablePreviewFromQuickOpen',
        'php.validate.enable',
        'editor.parameterHints',
    ];
    function configurationTelemetry(telemetryService, configurationService) {
        return configurationService.onDidUpdateConfiguration(function (event) {
            if (event.source !== configuration_1.ConfigurationSource.Default) {
                telemetryService.publicLog('updateConfiguration', {
                    configurationSource: configuration_1.ConfigurationSource[event.source],
                    configurationKeys: flattenKeys(event.sourceConfig)
                });
                telemetryService.publicLog('updateConfigurationValues', {
                    configurationSource: configuration_1.ConfigurationSource[event.source],
                    configurationValues: flattenValues(event.sourceConfig, configurationValueWhitelist)
                });
            }
        });
    }
    exports.configurationTelemetry = configurationTelemetry;
    function lifecycleTelemetry(telemetryService, lifecycleService) {
        return lifecycleService.onShutdown(function (event) {
            telemetryService.publicLog('shutdown', { reason: lifecycle_1.ShutdownReason[event] });
        });
    }
    exports.lifecycleTelemetry = lifecycleTelemetry;
    function keybindingsTelemetry(telemetryService, keybindingService) {
        return keybindingService.onDidUpdateKeybindings(function (event) {
            if (event.source === keybinding_1.KeybindingSource.User && event.keybindings) {
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
            var v = key.split('.')
                .reduce(function (tmp, k) { return tmp && typeof tmp === 'object' ? tmp[k] : undefined; }, value);
            if (typeof v !== 'undefined') {
                array.push((_a = {}, _a[key] = v, _a));
            }
            return array;
            var _a;
        }, []);
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[90/*vs/platform/telemetry/common/telemetryService*/], __M([0/*require*/,1/*exports*/,59/*vs/nls!vs/platform/telemetry/common/telemetryService*/,14/*vs/base/common/strings*/,23/*vs/platform/telemetry/common/telemetry*/,5/*vs/platform/instantiation/common/instantiation*/,13/*vs/platform/configuration/common/configuration*/,20/*vs/platform/configuration/common/configurationRegistry*/,2/*vs/base/common/winjs.base*/,12/*vs/base/common/lifecycle*/,7/*vs/base/common/objects*/,11/*vs/platform/platform*/]), function (require, exports, nls_1, strings_1, telemetry_1, instantiation_1, configuration_1, configurationRegistry_1, winjs_base_1, lifecycle_1, objects_1, platform_1) {
    'use strict';
    var TelemetryService = (function () {
        function TelemetryService(config, _configurationService) {
            this._configurationService = _configurationService;
            this._disposables = [];
            this._cleanupPatterns = [];
            this._appender = config.appender;
            this._commonProperties = config.commonProperties || winjs_base_1.TPromise.as({});
            this._piiPaths = config.piiPaths || [];
            this._userOptIn = typeof config.userOptIn === 'undefined' ? true : config.userOptIn;
            this._experiments = config.experiments || telemetry_1.defaultExperiments;
            // static cleanup patterns for:
            // #1 `file:///DANGEROUS/PATH/resources/app/Useful/Information`
            // #2 // Any other file path that doesn't match the approved form above should be cleaned.
            // #3 "Error: ENOENT; no such file or directory" is often followed with PII, clean it
            this._cleanupPatterns.push([/file:\/\/\/.*?\/resources\/app\//gi, ''], [/file:\/\/\/.*/gi, ''], [/ENOENT: no such file or directory.*?\'([^\']+)\'/gi, 'ENOENT: no such file or directory']);
            for (var _i = 0, _a = this._piiPaths; _i < _a.length; _i++) {
                var piiPath = _a[_i];
                this._cleanupPatterns.push([new RegExp(strings_1.escapeRegExpCharacters(piiPath), 'gi'), '']);
            }
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
        Object.defineProperty(TelemetryService.prototype, "isOptedIn", {
            get: function () {
                return this._userOptIn;
            },
            enumerable: true,
            configurable: true
        });
        TelemetryService.prototype.getExperiments = function () {
            return this._experiments;
        };
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
        TelemetryService.prototype.publicLog = function (eventName, data) {
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
                'default': false
            }
        }
    });
});

define(__m[91/*vs/platform/telemetry/node/appInsightsAppender*/], __M([0/*require*/,1/*exports*/,94/*applicationinsights*/,8/*vs/base/common/types*/,7/*vs/base/common/objects*/,2/*vs/base/common/winjs.base*/]), function (require, exports, appInsights, types_1, objects_1, winjs_base_1) {
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
define(__m[92/*vs/platform/telemetry/node/commonProperties*/], __M([0/*require*/,1/*exports*/,16/*vs/base/common/platform*/,26/*os*/,2/*vs/base/common/winjs.base*/,25/*vs/base/common/uuid*/]), function (require, exports, Platform, os, winjs_base_1, uuid) {
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
define(__m[77/*vs/base/node/zip*/], __M([0/*require*/,1/*exports*/,50/*vs/nls!vs/base/node/zip*/,10/*path*/,18/*fs*/,19/*vs/base/common/async*/,21/*vs/base/node/pfs*/,2/*vs/base/common/winjs.base*/,95/*yauzl*/]), function (require, exports, nls, path, fs_1, async_1, pfs_1, winjs_base_1, yauzl_1) {
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









define(__m[89/*vs/platform/extensionManagement/node/extensionManagementService*/], __M([0/*require*/,1/*exports*/,54/*vs/nls!vs/platform/extensionManagement/node/extensionManagementService*/,10/*path*/,21/*vs/base/node/pfs*/,9/*vs/base/common/errors*/,7/*vs/base/common/objects*/,12/*vs/base/common/lifecycle*/,17/*vs/base/common/arrays*/,77/*vs/base/node/zip*/,2/*vs/base/common/winjs.base*/,27/*vs/platform/extensionManagement/common/extensionManagement*/,61/*vs/platform/extensionManagement/common/extensionNls*/,22/*vs/platform/environment/common/environment*/,19/*vs/base/common/async*/,6/*vs/base/common/event*/,64/*semver*/,38/*vs/base/common/collections*/,32/*vs/base/common/uri*/,34/*vs/platform/message/common/message*/]), function (require, exports, nls, path, pfs, errors, objects_1, lifecycle_1, arrays_1, zip_1, winjs_base_1, extensionManagement_1, extensionNls_1, environment_1, async_1, event_1, semver, collections_1, uri_1, message_1) {
    'use strict';
    var SystemExtensionsRoot = path.normalize(path.join(uri_1.default.parse(require.toUrl('')).fsPath, '..', 'extensions'));
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
    function getExtensionId(extension, version) {
        return extension.publisher + "." + extension.name + "-" + version;
    }
    var ExtensionManagementService = (function () {
        function ExtensionManagementService(environmentService, choiceService, galleryService) {
            this.environmentService = environmentService;
            this.choiceService = choiceService;
            this.galleryService = galleryService;
            this.disposables = [];
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
        ExtensionManagementService.prototype.install = function (zipPath) {
            var _this = this;
            zipPath = path.resolve(zipPath);
            return validate(zipPath).then(function (manifest) {
                var id = getExtensionId(manifest, manifest.version);
                return _this.isObsolete(id).then(function (isObsolete) {
                    if (isObsolete) {
                        return winjs_base_1.TPromise.wrapError(new Error(nls.localize(4, null, manifest.displayName || manifest.name)));
                    }
                    _this._onInstallExtension.fire({ id: id, zipPath: zipPath });
                    return _this.installExtension(zipPath, id)
                        .then(function (local) { return _this._onDidInstallExtension.fire({ id: id, zipPath: zipPath, local: local }); }, function (error) { _this._onDidInstallExtension.fire({ id: id, zipPath: zipPath, error: error }); return winjs_base_1.TPromise.wrapError(error); });
                });
            });
        };
        ExtensionManagementService.prototype.installFromGallery = function (extension, promptToInstallDependencies) {
            var _this = this;
            if (promptToInstallDependencies === void 0) { promptToInstallDependencies = true; }
            var id = getExtensionId(extension, extension.version);
            return this.isObsolete(id).then(function (isObsolete) {
                if (isObsolete) {
                    return winjs_base_1.TPromise.wrapError(new Error(nls.localize(5, null, extension.displayName || extension.name)));
                }
                _this._onInstallExtension.fire({ id: id, gallery: extension });
                return _this.installCompatibleVersion(extension, true, promptToInstallDependencies)
                    .then(function (local) { return _this._onDidInstallExtension.fire({ id: id, local: local, gallery: extension }); }, function (error) {
                    _this._onDidInstallExtension.fire({ id: id, gallery: extension, error: error });
                    return winjs_base_1.TPromise.wrapError(error);
                });
            });
        };
        ExtensionManagementService.prototype.installCompatibleVersion = function (extension, installDependencies, promptToInstallDependencies) {
            var _this = this;
            return this.galleryService.loadCompatibleVersion(extension)
                .then(function (compatibleVersion) { return _this.getDependenciesToInstall(extension, installDependencies)
                .then(function (dependencies) {
                if (!dependencies.length) {
                    return _this.downloadAndInstall(compatibleVersion);
                }
                if (promptToInstallDependencies) {
                    var message = nls.localize(6, null, extension.displayName);
                    var options = [
                        nls.localize(7, null),
                        nls.localize(8, null)
                    ];
                    return _this.choiceService.choose(message_1.Severity.Info, message, options)
                        .then(function (value) {
                        if (value === 0) {
                            return _this.installWithDependencies(compatibleVersion);
                        }
                        return winjs_base_1.TPromise.wrapError(errors.canceled());
                    }, function (error) { return winjs_base_1.TPromise.wrapError(errors.canceled()); });
                }
                else {
                    return _this.installWithDependencies(compatibleVersion);
                }
            }); });
        };
        ExtensionManagementService.prototype.getDependenciesToInstall = function (extension, checkDependecies) {
            if (!checkDependecies) {
                return winjs_base_1.TPromise.wrap([]);
            }
            // Filter out self
            var extensionName = extension.publisher + "." + extension.name;
            var dependencies = extension.properties.dependencies ? extension.properties.dependencies.filter(function (name) { return name !== extensionName; }) : [];
            if (!dependencies.length) {
                return winjs_base_1.TPromise.wrap([]);
            }
            // Filter out installed dependencies
            return this.getInstalled().then(function (installed) {
                return dependencies.filter(function (dep) { return installed.every(function (i) { return i.manifest.publisher + "." + i.manifest.name !== dep; }); });
            });
        };
        ExtensionManagementService.prototype.installWithDependencies = function (extension) {
            var _this = this;
            return this.galleryService.getAllDependencies(extension)
                .then(function (allDependencies) { return _this.filterDependenciesToInstall(extension, allDependencies); })
                .then(function (toInstall) { return _this.filterObsolete.apply(_this, toInstall.map(function (i) { return getExtensionId(i, i.version); }))
                .then(function (obsolete) {
                if (obsolete.length) {
                    return winjs_base_1.TPromise.wrapError(new Error(nls.localize(9, null, extension.displayName || extension.name)));
                }
                return _this.bulkInstallWithDependencies(extension, toInstall);
            }); });
        };
        ExtensionManagementService.prototype.bulkInstallWithDependencies = function (extension, dependecies) {
            var _this = this;
            for (var _i = 0, dependecies_1 = dependecies; _i < dependecies_1.length; _i++) {
                var dependency = dependecies_1[_i];
                var id = getExtensionId(dependency, dependency.version);
                this._onInstallExtension.fire({ id: id, gallery: dependency });
            }
            return this.downloadAndInstall(extension)
                .then(function (localExtension) {
                return winjs_base_1.TPromise.join(dependecies.map(function (dep) { return _this.installCompatibleVersion(dep, false, false); }))
                    .then(function (installedLocalExtensions) {
                    for (var _i = 0, installedLocalExtensions_1 = installedLocalExtensions; _i < installedLocalExtensions_1.length; _i++) {
                        var installedLocalExtension = installedLocalExtensions_1[_i];
                        var gallery = _this.getGalleryExtensionForLocalExtension(dependecies, installedLocalExtension);
                        _this._onDidInstallExtension.fire({ id: installedLocalExtension.id, local: installedLocalExtension, gallery: gallery });
                    }
                    return localExtension;
                }, function (error) {
                    return _this.rollback(localExtension, dependecies).then(function () {
                        return winjs_base_1.TPromise.wrapError(Array.isArray(error) ? error[error.length - 1] : error);
                    });
                });
            })
                .then(function (localExtension) { return localExtension; }, function (error) {
                for (var _i = 0, dependecies_2 = dependecies; _i < dependecies_2.length; _i++) {
                    var dependency = dependecies_2[_i];
                    _this._onDidInstallExtension.fire({ id: getExtensionId(dependency, dependency.version), gallery: dependency, error: error });
                }
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        ExtensionManagementService.prototype.rollback = function (localExtension, dependecies) {
            var _this = this;
            return this.doUninstall(localExtension.id)
                .then(function () { return _this.filterOutUninstalled(dependecies); })
                .then(function (installed) { return winjs_base_1.TPromise.join(installed.map(function (i) { return _this.doUninstall(i.id); })); })
                .then(function () { return null; });
        };
        ExtensionManagementService.prototype.filterDependenciesToInstall = function (extension, dependencies) {
            return this.getInstalled()
                .then(function (local) {
                return dependencies.filter(function (d) {
                    if (extension.id === d.id) {
                        return false;
                    }
                    var extensionId = getExtensionId(d, d.version);
                    return local.every(function (local) { return local.id !== extensionId; });
                });
            });
        };
        ExtensionManagementService.prototype.filterOutUninstalled = function (extensions) {
            var _this = this;
            return this.getInstalled()
                .then(function (installed) { return installed.filter(function (local) { return !!_this.getGalleryExtensionForLocalExtension(extensions, local); }); });
        };
        ExtensionManagementService.prototype.getGalleryExtensionForLocalExtension = function (galleryExtensions, localExtension) {
            var filtered = galleryExtensions.filter(function (galleryExtension) { return getExtensionId(galleryExtension, galleryExtension.version) === localExtension.id; });
            return filtered.length ? filtered[0] : null;
        };
        ExtensionManagementService.prototype.downloadAndInstall = function (extension) {
            var _this = this;
            var id = getExtensionId(extension, extension.version);
            var metadata = {
                id: extension.id,
                publisherId: extension.publisherId,
                publisherDisplayName: extension.publisherDisplayName,
            };
            return this.galleryService.download(extension)
                .then(function (zipPath) { return validate(zipPath).then(function () { return zipPath; }); })
                .then(function (zipPath) { return _this.installExtension(zipPath, id, metadata); });
        };
        ExtensionManagementService.prototype.installExtension = function (zipPath, id, metadata) {
            if (metadata === void 0) { metadata = null; }
            var extensionPath = path.join(this.extensionsPath, id);
            return zip_1.extract(zipPath, extensionPath, { sourcePath: 'extension', overwrite: true })
                .then(function () { return readManifest(extensionPath); })
                .then(function (_a) {
                var manifest = _a.manifest;
                return pfs.readdir(extensionPath).then(function (children) {
                    var readme = children.filter(function (child) { return /^readme(\.txt|\.md|)$/i.test(child); })[0];
                    var readmeUrl = readme ? uri_1.default.file(path.join(extensionPath, readme)).toString() : null;
                    var changelog = children.filter(function (child) { return /^changelog(\.txt|\.md|)$/i.test(child); })[0];
                    var changelogUrl = changelog ? uri_1.default.file(path.join(extensionPath, changelog)).toString() : null;
                    var type = extensionManagement_1.LocalExtensionType.User;
                    var local = { type: type, id: id, manifest: manifest, metadata: metadata, path: extensionPath, readmeUrl: readmeUrl, changelogUrl: changelogUrl };
                    var manifestPath = path.join(extensionPath, 'package.json');
                    return pfs.readFile(manifestPath, 'utf8')
                        .then(function (raw) { return parseManifest(raw); })
                        .then(function (_a) {
                        var manifest = _a.manifest;
                        return objects_1.assign(manifest, { __metadata: metadata });
                    })
                        .then(function (manifest) { return pfs.writeFile(manifestPath, JSON.stringify(manifest, null, '\t')); })
                        .then(function () { return local; });
                });
            });
        };
        ExtensionManagementService.prototype.uninstall = function (extension) {
            var _this = this;
            return this.removeOutdatedExtensions().then(function () {
                return _this.scanUserExtensions().then(function (installed) {
                    var promises = installed
                        .filter(function (e) { return e.manifest.publisher === extension.manifest.publisher && e.manifest.name === extension.manifest.name; })
                        .map(function (e) { return _this.checkForDependenciesAndUninstall(e, installed); });
                    return winjs_base_1.TPromise.join(promises);
                });
            });
        };
        ExtensionManagementService.prototype.checkForDependenciesAndUninstall = function (extension, installed) {
            var _this = this;
            return this.preUninstallExtension(extension.id)
                .then(function () { return _this.hasDependencies(extension, installed) ? _this.promptForDependenciesAndUninstall(extension, installed) : _this.promptAndUninstall(extension, installed); })
                .then(function () { return _this.postUninstallExtension(extension.id); }, function (error) {
                _this.postUninstallExtension(extension.id, error);
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        ExtensionManagementService.prototype.hasDependencies = function (extension, installed) {
            if (extension.manifest.extensionDependencies && extension.manifest.extensionDependencies.length) {
                return installed.some(function (i) { return extension.manifest.extensionDependencies.indexOf(i.manifest.publisher + "." + i.manifest.name) !== -1; });
            }
            return false;
        };
        ExtensionManagementService.prototype.promptForDependenciesAndUninstall = function (extension, installed) {
            var _this = this;
            var message = nls.localize(10, null, extension.manifest.displayName || extension.manifest.name);
            var options = [
                nls.localize(11, null),
                nls.localize(12, null),
                nls.localize(13, null)
            ];
            return this.choiceService.choose(message_1.Severity.Info, message, options, true)
                .then(function (value) {
                if (value === 0) {
                    return _this.uninstallWithDependencies(extension, [], installed);
                }
                if (value === 1) {
                    var dependencies = arrays_1.distinct(_this.getDependenciesToUninstallRecursively(extension, installed, [])).filter(function (e) { return e !== extension; });
                    return _this.uninstallWithDependencies(extension, dependencies, installed);
                }
                return winjs_base_1.TPromise.wrapError(errors.canceled());
            }, function (error) { return winjs_base_1.TPromise.wrapError(errors.canceled()); });
        };
        ExtensionManagementService.prototype.promptAndUninstall = function (extension, installed) {
            var _this = this;
            var message = nls.localize(14, null, extension.manifest.displayName || extension.manifest.name);
            var options = [
                nls.localize(15, null),
                nls.localize(16, null)
            ];
            return this.choiceService.choose(message_1.Severity.Info, message, options, true)
                .then(function (value) {
                if (value === 0) {
                    return _this.uninstallWithDependencies(extension, [], installed);
                }
                return winjs_base_1.TPromise.wrapError(errors.canceled());
            }, function (error) { return winjs_base_1.TPromise.wrapError(errors.canceled()); });
        };
        ExtensionManagementService.prototype.uninstallWithDependencies = function (extension, dependencies, installed) {
            var _this = this;
            var dependenciesToUninstall = this.filterDependents(extension, dependencies, installed);
            var dependents = this.getDependents(extension, installed).filter(function (dependent) { return extension !== dependent && dependenciesToUninstall.indexOf(dependent) === -1; });
            if (dependents.length) {
                return winjs_base_1.TPromise.wrapError(this.getDependentsErrorMessage(extension, dependents));
            }
            return winjs_base_1.TPromise.join([this.uninstallExtension(extension.id)].concat(dependenciesToUninstall.map(function (d) { return _this.doUninstall(d.id); }))).then(function () { return null; });
        };
        ExtensionManagementService.prototype.getDependentsErrorMessage = function (extension, dependents) {
            if (dependents.length === 1) {
                return nls.localize(17, null, extension.manifest.displayName || extension.manifest.name, dependents[0].manifest.displayName || dependents[0].manifest.name);
            }
            if (dependents.length === 2) {
                return nls.localize(18, null, extension.manifest.displayName || extension.manifest.name, dependents[0].manifest.displayName || dependents[0].manifest.name, dependents[1].manifest.displayName || dependents[1].manifest.name);
            }
            return nls.localize(19, null, extension.manifest.displayName || extension.manifest.name, dependents[0].manifest.displayName || dependents[0].manifest.name, dependents[1].manifest.displayName || dependents[1].manifest.name);
        };
        ExtensionManagementService.prototype.getDependenciesToUninstallRecursively = function (extension, installed, checked) {
            if (checked.indexOf(extension) !== -1) {
                return [];
            }
            checked.push(extension);
            if (!extension.manifest.extensionDependencies || extension.manifest.extensionDependencies.length === 0) {
                return [];
            }
            var dependenciesToUninstall = installed.filter(function (i) { return extension.manifest.extensionDependencies.indexOf(i.manifest.publisher + "." + i.manifest.name) !== -1; });
            var depsOfDeps = [];
            for (var _i = 0, dependenciesToUninstall_1 = dependenciesToUninstall; _i < dependenciesToUninstall_1.length; _i++) {
                var dep = dependenciesToUninstall_1[_i];
                depsOfDeps.push.apply(depsOfDeps, this.getDependenciesToUninstallRecursively(dep, installed, checked));
            }
            return dependenciesToUninstall.concat(depsOfDeps);
        };
        ExtensionManagementService.prototype.filterDependents = function (extension, dependencies, installed) {
            installed = installed.filter(function (i) { return i !== extension && i.manifest.extensionDependencies && i.manifest.extensionDependencies.length > 0; });
            var result = dependencies.slice(0);
            for (var i = 0; i < dependencies.length; i++) {
                var dep = dependencies[i];
                var dependents = this.getDependents(dep, installed).filter(function (e) { return dependencies.indexOf(e) === -1; });
                if (dependents.length) {
                    result.splice(i - (dependencies.length - result.length), 1);
                }
            }
            return result;
        };
        ExtensionManagementService.prototype.getDependents = function (extension, installed) {
            return installed.filter(function (e) { return e.manifest.extensionDependencies && e.manifest.extensionDependencies.indexOf(extension.manifest.publisher + "." + extension.manifest.name) !== -1; });
        };
        ExtensionManagementService.prototype.doUninstall = function (id) {
            var _this = this;
            return this.preUninstallExtension(id)
                .then(function () { return _this.uninstallExtension(id); })
                .then(function () { return _this.postUninstallExtension(id); }, function (error) {
                _this.postUninstallExtension(id, error);
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        ExtensionManagementService.prototype.preUninstallExtension = function (id) {
            var _this = this;
            var extensionPath = path.join(this.extensionsPath, id);
            return pfs.exists(extensionPath)
                .then(function (exists) { return exists ? null : winjs_base_1.Promise.wrapError(new Error(nls.localize(20, null))); })
                .then(function () { return _this._onUninstallExtension.fire(id); });
        };
        ExtensionManagementService.prototype.uninstallExtension = function (id) {
            var _this = this;
            var extensionPath = path.join(this.extensionsPath, id);
            return this.setObsolete(id)
                .then(function () { return pfs.rimraf(extensionPath); })
                .then(function () { return _this.unsetObsolete(id); });
        };
        ExtensionManagementService.prototype.postUninstallExtension = function (id, error) {
            return this._onDidUninstallExtension.fire({ id: id, error: error });
        };
        ExtensionManagementService.prototype.getInstalled = function (type) {
            if (type === void 0) { type = null; }
            var promises = [];
            if (type === null || type === extensionManagement_1.LocalExtensionType.System) {
                promises.push(this.scanSystemExtensions());
            }
            if (type === null || type === extensionManagement_1.LocalExtensionType.User) {
                promises.push(this.scanUserExtensions());
            }
            return winjs_base_1.TPromise.join(promises).then(arrays_1.flatten);
        };
        ExtensionManagementService.prototype.scanSystemExtensions = function () {
            return this.scanExtensions(SystemExtensionsRoot, extensionManagement_1.LocalExtensionType.System);
        };
        ExtensionManagementService.prototype.scanUserExtensions = function () {
            return this.scanExtensions(this.extensionsPath, extensionManagement_1.LocalExtensionType.User).then(function (extensions) {
                var byId = collections_1.values(collections_1.groupBy(extensions, function (p) { return (p.manifest.publisher + "." + p.manifest.name); }));
                return byId.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.manifest.version, b.manifest.version); })[0]; });
            });
        };
        ExtensionManagementService.prototype.scanExtensions = function (root, type) {
            var limiter = new async_1.Limiter(10);
            return this.scanExtensionFolders(root)
                .then(function (extensionIds) { return winjs_base_1.Promise.join(extensionIds.map(function (id) {
                var extensionPath = path.join(root, id);
                var each = function () { return pfs.readdir(extensionPath).then(function (children) {
                    var readme = children.filter(function (child) { return /^readme(\.txt|\.md|)$/i.test(child); })[0];
                    var readmeUrl = readme ? uri_1.default.file(path.join(extensionPath, readme)).toString() : null;
                    var changelog = children.filter(function (child) { return /^changelog(\.txt|\.md|)$/i.test(child); })[0];
                    var changelogUrl = changelog ? uri_1.default.file(path.join(extensionPath, changelog)).toString() : null;
                    return readManifest(extensionPath)
                        .then(function (_a) {
                        var manifest = _a.manifest, metadata = _a.metadata;
                        return ({ type: type, id: id, manifest: manifest, metadata: metadata, path: extensionPath, readmeUrl: readmeUrl, changelogUrl: changelogUrl });
                    });
                }).then(null, function () { return null; }); };
                return limiter.queue(each);
            })); })
                .then(function (result) { return result.filter(function (a) { return !!a; }); });
        };
        ExtensionManagementService.prototype.scanExtensionFolders = function (root) {
            return this.getObsoleteExtensions()
                .then(function (obsolete) { return pfs.readdir(root).then(function (extensions) { return extensions.filter(function (id) { return !obsolete[id]; }); }); });
        };
        ExtensionManagementService.prototype.removeDeprecatedExtensions = function () {
            return winjs_base_1.TPromise.join([
                this.removeOutdatedExtensions(),
                this.removeObsoleteExtensions()
            ]);
        };
        ExtensionManagementService.prototype.removeOutdatedExtensions = function () {
            var _this = this;
            return this.getOutdatedExtensionIds()
                .then(function (extensionIds) { return _this.removeExtensions(extensionIds); });
        };
        ExtensionManagementService.prototype.removeObsoleteExtensions = function () {
            var _this = this;
            return this.getObsoleteExtensions()
                .then(function (obsolete) { return Object.keys(obsolete); })
                .then(function (extensionIds) { return _this.removeExtensions(extensionIds); });
        };
        ExtensionManagementService.prototype.removeExtensions = function (extensionsIds) {
            var _this = this;
            return winjs_base_1.TPromise.join(extensionsIds.map(function (id) {
                return pfs.rimraf(path.join(_this.extensionsPath, id))
                    .then(function () { return _this.withObsoleteExtensions(function (obsolete) { return delete obsolete[id]; }); });
            }));
        };
        ExtensionManagementService.prototype.getOutdatedExtensionIds = function () {
            return this.scanExtensionFolders(this.extensionsPath)
                .then(function (folders) {
                var galleryFolders = folders
                    .map(function (folder) { return ({ folder: folder, match: /^([^.]+\..+)-(\d+\.\d+\.\d+)$/.exec(folder) }); })
                    .filter(function (_a) {
                    var match = _a.match;
                    return !!match;
                })
                    .map(function (_a) {
                    var folder = _a.folder, match = _a.match;
                    return ({ folder: folder, id: match[1], version: match[2] });
                });
                var byId = collections_1.values(collections_1.groupBy(galleryFolders, function (p) { return p.id; }));
                return arrays_1.flatten(byId.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.version, b.version); }).slice(1); }))
                    .map(function (a) { return a.folder; });
            });
        };
        ExtensionManagementService.prototype.isObsolete = function (id) {
            return this.filterObsolete(id).then(function (obsolete) { return obsolete.length === 1; });
        };
        ExtensionManagementService.prototype.filterObsolete = function () {
            var ids = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                ids[_i - 0] = arguments[_i];
            }
            return this.withObsoleteExtensions(function (allObsolete) {
                var obsolete = [];
                for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                    var id = ids_1[_i];
                    if (!!allObsolete[id]) {
                        obsolete.push(id);
                    }
                }
                return obsolete;
            });
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
                    .then(function (raw) { try {
                    return JSON.parse(raw);
                }
                catch (e) {
                    return {};
                } })
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
        ExtensionManagementService.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        ExtensionManagementService = __decorate([
            __param(0, environment_1.IEnvironmentService),
            __param(1, message_1.IChoiceService),
            __param(2, extensionManagement_1.IExtensionGalleryService)
        ], ExtensionManagementService);
        return ExtensionManagementService;
    }());
    exports.ExtensionManagementService = ExtensionManagementService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[31/*vs/base/node/request*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,8/*vs/base/common/types*/,93/*https*/,99/*http*/,87/*url*/,18/*fs*/,7/*vs/base/common/objects*/,100/*zlib*/]), function (require, exports, winjs_base_1, types_1, https, http, url_1, fs_1, objects_1, zlib_1) {
    'use strict';
    function request(options) {
        var req;
        return new winjs_base_1.TPromise(function (c, e) {
            var endpoint = url_1.parse(options.url);
            var rawRequest = endpoint.protocol === 'https:' ? https.request : http.request;
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
            req = rawRequest(opts, function (res) {
                var followRedirects = types_1.isNumber(options.followRedirects) ? options.followRedirects : 3;
                if (res.statusCode >= 300 && res.statusCode < 400 && followRedirects > 0 && res.headers['location']) {
                    request(objects_1.assign({}, options, {
                        url: res.headers['location'],
                        followRedirects: followRedirects - 1
                    })).done(c, e);
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
                req.write(options.data);
            }
            req.end();
        }, function () { return req && req.abort(); });
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
        return new winjs_base_1.Promise(function (c, e) {
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
        return new winjs_base_1.Promise(function (c, e) {
            if (!isSuccess(context)) {
                return e('Server returned ' + context.res.statusCode);
            }
            if (hasNoContent(context)) {
                return c(null);
            }
            if (!/application\/json/.test(context.res.headers['content-type'])) {
                return e('Response doesn\'t appear to be JSON');
            }
            var buffer = [];
            context.stream.on('data', function (d) { return buffer.push(d); });
            context.stream.on('end', function () { return c(JSON.parse(buffer.join(''))); });
            context.stream.on('error', e);
        });
    }
    exports.asJson = asJson;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[70/*vs/platform/extensionManagement/node/extensionGalleryService*/], __M([0/*require*/,1/*exports*/,53/*vs/nls!vs/platform/extensionManagement/node/extensionGalleryService*/,26/*os*/,10/*path*/,2/*vs/base/common/winjs.base*/,17/*vs/base/common/arrays*/,9/*vs/base/common/errors*/,36/*vs/base/common/decorators*/,44/*vs/base/common/set*/,27/*vs/platform/extensionManagement/common/extensionManagement*/,62/*vs/platform/extensionManagement/common/extensionTelemetry*/,7/*vs/base/common/objects*/,40/*vs/platform/request/node/request*/,23/*vs/platform/telemetry/common/telemetry*/,31/*vs/base/node/request*/,13/*vs/platform/configuration/common/configuration*/,28/*vs/platform/package*/,39/*vs/platform/product*/,63/*vs/platform/extensions/node/extensionValidator*/,78/*vs/platform/environment/node/http*/]), function (require, exports, nls_1, os_1, path, winjs_base_1, arrays_1, errors_1, decorators_1, set_1, extensionManagement_1, extensionTelemetry_1, objects_1, request_1, telemetry_1, request_2, configuration_1, package_1, product_1, extensionValidator_1, http_1) {
    "use strict";
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
            flags[_i - 0] = arguments[_i];
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
    };
    var PropertyType = {
        Dependency: 'Microsoft.VisualStudio.Code.ExtensionDependencies',
        Engine: 'Microsoft.VisualStudio.Code.Engine'
    };
    var DefaultPageSize = 10;
    var DefaultQueryState = {
        pageNumber: 1,
        pageSize: DefaultPageSize,
        sortBy: extensionManagement_1.SortBy.NoneOrRelevance,
        sortOrder: extensionManagement_1.SortOrder.Default,
        flags: Flags.None,
        criteria: [],
        assetTypes: []
    };
    var Query = (function () {
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
                flags[_i - 0] = arguments[_i];
            }
            return new Query(objects_1.assign({}, this.state, { flags: flags.reduce(function (r, f) { return r | f; }, 0) }));
        };
        Query.prototype.withAssetTypes = function () {
            var assetTypes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                assetTypes[_i - 0] = arguments[_i];
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
        return Query;
    }());
    function getStatistic(statistics, name) {
        var result = (statistics || []).filter(function (s) { return s.statisticName === name; })[0];
        return result ? result.value : 0;
    }
    function getVersionAsset(version, type) {
        var result = version.files.filter(function (f) { return f.assetType === type; })[0];
        if (!result) {
            if (type === AssetType.Icon) {
                var uri = require.toUrl('./media/defaultIcon.png');
                return { uri: uri, fallbackUri: uri };
            }
            return null;
        }
        if (type === AssetType.VSIX) {
            return {
                uri: version.fallbackAssetUri + "/" + type + "?redirect=true&install=true",
                fallbackUri: version.fallbackAssetUri + "/" + type + "?install=true"
            };
        }
        return {
            uri: version.assetUri + "/" + type,
            fallbackUri: version.fallbackAssetUri + "/" + type
        };
    }
    function getDependencies(version) {
        var values = version.properties ? version.properties.filter(function (p) { return p.key === PropertyType.Dependency; }) : [];
        var value = values.length > 0 && values[0].value;
        return value ? value.split(',') : [];
    }
    function getEngine(version) {
        var values = version.properties ? version.properties.filter(function (p) { return p.key === PropertyType.Engine; }) : [];
        return (values.length > 0 && values[0].value) || '';
    }
    function toExtension(galleryExtension, extensionsGalleryUrl) {
        var version = galleryExtension.versions[0];
        var assets = {
            manifest: getVersionAsset(version, AssetType.Manifest),
            readme: getVersionAsset(version, AssetType.Details),
            changelog: getVersionAsset(version, AssetType.Changelog),
            download: getVersionAsset(version, AssetType.VSIX),
            icon: getVersionAsset(version, AssetType.Icon),
            license: getVersionAsset(version, AssetType.License)
        };
        return {
            id: galleryExtension.extensionId,
            name: galleryExtension.extensionName,
            version: version.version,
            date: version.lastUpdated,
            displayName: galleryExtension.displayName,
            publisherId: galleryExtension.publisher.publisherId,
            publisher: galleryExtension.publisher.publisherName,
            publisherDisplayName: galleryExtension.publisher.displayName,
            description: galleryExtension.shortDescription || '',
            installCount: getStatistic(galleryExtension.statistics, 'install'),
            rating: getStatistic(galleryExtension.statistics, 'averagerating'),
            ratingCount: getStatistic(galleryExtension.statistics, 'ratingcount'),
            assets: assets,
            properties: {
                dependencies: getDependencies(version),
                engine: getEngine(version)
            }
        };
    }
    var ExtensionGalleryService = (function () {
        function ExtensionGalleryService(requestService, telemetryService, configurationService) {
            this.requestService = requestService;
            this.telemetryService = telemetryService;
            this.configurationService = configurationService;
            var config = product_1.default.extensionsGallery;
            this.extensionsGalleryUrl = config && config.serviceUrl;
        }
        Object.defineProperty(ExtensionGalleryService.prototype, "commonHTTPHeaders", {
            get: function () {
                return http_1.getCommonHTTPHeaders();
            },
            enumerable: true,
            configurable: true
        });
        ExtensionGalleryService.prototype.api = function (path) {
            if (path === void 0) { path = ''; }
            return "" + this.extensionsGalleryUrl + path;
        };
        ExtensionGalleryService.prototype.isEnabled = function () {
            return !!this.extensionsGalleryUrl;
        };
        ExtensionGalleryService.prototype.getRequestHeaders = function () {
            return this.commonHTTPHeaders;
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
            this.telemetryService.publicLog('galleryService:query', { type: type, text: text });
            var query = new Query()
                .withFlags(Flags.IncludeLatestVersionOnly, Flags.IncludeAssetUri, Flags.IncludeStatistics, Flags.IncludeFiles, Flags.IncludeVersionProperties)
                .withPage(1, pageSize)
                .withFilter(FilterType.Target, 'Microsoft.VisualStudio.Code')
                .withFilter(FilterType.ExcludeWithFlags, flagsToString(Flags.Unpublished))
                .withAssetTypes(AssetType.Icon, AssetType.License, AssetType.Details, AssetType.Manifest, AssetType.VSIX, AssetType.Changelog);
            if (text) {
                query = query.withFilter(FilterType.SearchText, text).withSortBy(extensionManagement_1.SortBy.NoneOrRelevance);
            }
            else if (options.ids) {
                query = query.withFilter.apply(query, [FilterType.ExtensionId].concat(options.ids));
            }
            else if (options.names) {
                query = query.withFilter.apply(query, [FilterType.ExtensionName].concat(options.names));
            }
            else {
                query = query.withSortBy(extensionManagement_1.SortBy.InstallCount);
            }
            if (typeof options.sortBy === 'number') {
                query = query.withSortBy(options.sortBy);
            }
            if (typeof options.sortOrder === 'number') {
                query = query.withSortOrder(options.sortOrder);
            }
            return this.queryGallery(query).then(function (_a) {
                var galleryExtensions = _a.galleryExtensions, total = _a.total;
                var extensions = galleryExtensions.map(function (e) { return toExtension(e, _this.extensionsGalleryUrl); });
                var pageSize = query.pageSize;
                var getPage = function (pageIndex) { return _this.queryGallery(query.withPage(pageIndex + 1))
                    .then(function (_a) {
                    var galleryExtensions = _a.galleryExtensions;
                    return galleryExtensions.map(function (e) { return toExtension(e, _this.extensionsGalleryUrl); });
                }); };
                return { firstPage: extensions, total: total, pageSize: pageSize, getPage: getPage };
            });
        };
        ExtensionGalleryService.prototype.queryGallery = function (query) {
            var _this = this;
            return this.commonHTTPHeaders
                .then(function (headers) {
                var data = JSON.stringify(query.raw);
                headers = objects_1.assign({}, headers, {
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
                });
            })
                .then(function (context) { return request_2.asJson(context); })
                .then(function (result) {
                var r = result.results[0];
                var galleryExtensions = r.extensions;
                var resultCount = r.resultMetadata && r.resultMetadata.filter(function (m) { return m.metadataType === 'ResultCount'; })[0];
                var total = resultCount && resultCount.metadataItems.filter(function (i) { return i.name === 'TotalCount'; })[0].count || 0;
                return { galleryExtensions: galleryExtensions, total: total };
            });
        };
        ExtensionGalleryService.prototype.download = function (extension) {
            var _this = this;
            return this.loadCompatibleVersion(extension).then(function (extension) {
                var zipPath = path.join(os_1.tmpdir(), extension.id);
                var data = extensionTelemetry_1.getGalleryExtensionTelemetryData(extension);
                var startTime = new Date().getTime();
                var log = function (duration) { return _this.telemetryService.publicLog('galleryService:downloadVSIX', objects_1.assign(data, { duration: duration })); };
                return _this.getAsset(extension.assets.download)
                    .then(function (context) { return request_2.download(zipPath, context); })
                    .then(function () { return log(new Date().getTime() - startTime); })
                    .then(function () { return zipPath; });
            });
        };
        ExtensionGalleryService.prototype.getReadme = function (extension) {
            return this.getAsset(extension.assets.readme)
                .then(request_2.asText);
        };
        ExtensionGalleryService.prototype.getManifest = function (extension) {
            return this.getAsset(extension.assets.manifest)
                .then(request_2.asText)
                .then(JSON.parse);
        };
        ExtensionGalleryService.prototype.getChangelog = function (extension) {
            return this.getAsset(extension.assets.changelog)
                .then(request_2.asText);
        };
        ExtensionGalleryService.prototype.getAllDependencies = function (extension) {
            var _this = this;
            return this.loadCompatibleVersion(extension)
                .then(function (compatible) { return _this.getDependenciesReccursively(compatible.properties.dependencies, [], extension); });
        };
        ExtensionGalleryService.prototype.loadCompatibleVersion = function (extension) {
            var _this = this;
            if (extension.properties.engine && this.isEngineValid(extension.properties.engine)) {
                return winjs_base_1.TPromise.wrap(extension);
            }
            var query = new Query()
                .withFlags(Flags.IncludeVersions, Flags.IncludeFiles, Flags.IncludeVersionProperties)
                .withPage(1, 1)
                .withFilter(FilterType.Target, 'Microsoft.VisualStudio.Code')
                .withFilter(FilterType.ExcludeWithFlags, flagsToString(Flags.Unpublished))
                .withAssetTypes(AssetType.Manifest, AssetType.VSIX)
                .withFilter(FilterType.ExtensionId, extension.id);
            return this.queryGallery(query).then(function (_a) {
                var galleryExtensions = _a.galleryExtensions;
                var rawExtension = galleryExtensions[0];
                if (!rawExtension) {
                    return winjs_base_1.TPromise.wrapError(new Error(nls_1.localize(0, null)));
                }
                return _this.getLastValidExtensionVersion(rawExtension, rawExtension.versions)
                    .then(function (rawVersion) {
                    extension.properties.dependencies = getDependencies(rawVersion);
                    extension.properties.engine = getEngine(rawVersion);
                    extension.assets.download = getVersionAsset(rawVersion, AssetType.VSIX);
                    extension.version = rawVersion.version;
                    return extension;
                });
            });
        };
        ExtensionGalleryService.prototype.loadDependencies = function (extensionNames) {
            var _this = this;
            extensionNames = extensionNames.filter(function (e) { return extensionManagement_1.EXTENSION_IDENTIFIER_REGEX.test(e); });
            var query = (_a = new Query()
                .withFlags(Flags.IncludeLatestVersionOnly, Flags.IncludeAssetUri, Flags.IncludeStatistics, Flags.IncludeFiles, Flags.IncludeVersionProperties)
                .withPage(1, extensionNames.length)
                .withFilter(FilterType.Target, 'Microsoft.VisualStudio.Code')
                .withFilter(FilterType.ExcludeWithFlags, flagsToString(Flags.Unpublished))
                .withAssetTypes(AssetType.Icon, AssetType.License, AssetType.Details, AssetType.Manifest, AssetType.VSIX)).withFilter.apply(_a, [FilterType.ExtensionName].concat(extensionNames));
            return this.queryGallery(query).then(function (result) {
                var dependencies = [];
                var ids = [];
                for (var _i = 0, _a = result.galleryExtensions; _i < _a.length; _i++) {
                    var rawExtension = _a[_i];
                    if (ids.indexOf(rawExtension.extensionId) === -1) {
                        dependencies.push(toExtension(rawExtension, _this.extensionsGalleryUrl));
                        ids.push(rawExtension.extensionId);
                    }
                }
                return dependencies;
            });
            var _a;
        };
        ExtensionGalleryService.prototype.getDependenciesReccursively = function (toGet, result, root) {
            var _this = this;
            if (!toGet || !toGet.length) {
                return winjs_base_1.TPromise.wrap(result);
            }
            if (toGet.indexOf(root.publisher + "." + root.name) !== -1 && result.indexOf(root) === -1) {
                result.push(root);
            }
            toGet = result.length ? toGet.filter(function (e) { return !ExtensionGalleryService.hasExtensionByName(result, e); }) : toGet;
            if (!toGet.length) {
                return winjs_base_1.TPromise.wrap(result);
            }
            return this.loadDependencies(toGet)
                .then(function (loadedDependencies) {
                var dependenciesSet = new set_1.ArraySet();
                for (var _i = 0, loadedDependencies_1 = loadedDependencies; _i < loadedDependencies_1.length; _i++) {
                    var dep = loadedDependencies_1[_i];
                    if (dep.properties.dependencies) {
                        dep.properties.dependencies.forEach(function (d) { return dependenciesSet.set(d); });
                    }
                }
                result = arrays_1.distinct(result.concat(loadedDependencies), function (d) { return d.id; });
                var dependencies = dependenciesSet.elements.filter(function (d) { return !ExtensionGalleryService.hasExtensionByName(result, d); });
                return _this.getDependenciesReccursively(dependencies, result, root);
            });
        };
        ExtensionGalleryService.prototype.getAsset = function (asset, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            var baseOptions = { type: 'GET' };
            return this.commonHTTPHeaders.then(function (headers) {
                headers = objects_1.assign({}, headers, options.headers || {});
                options = objects_1.assign({}, options, baseOptions, { headers: headers });
                var firstOptions = objects_1.assign({}, options, { url: asset.uri });
                return _this.requestService.request(firstOptions)
                    .then(function (context) { return context.res.statusCode === 200 ? context : winjs_base_1.TPromise.wrapError('expected 200'); })
                    .then(null, function (err) {
                    _this.telemetryService.publicLog('galleryService:requestError', { cdn: true, message: errors_1.getErrorMessage(err) });
                    _this.telemetryService.publicLog('galleryService:cdnFallback', { url: asset.uri });
                    var fallbackOptions = objects_1.assign({}, options, { url: asset.fallbackUri });
                    return _this.requestService.request(fallbackOptions).then(null, function (err) {
                        _this.telemetryService.publicLog('galleryService:requestError', { cdn: false, message: errors_1.getErrorMessage(err) });
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
                if (this.isEngineValid(engine)) {
                    return winjs_base_1.TPromise.wrap(version);
                }
            }
            return null;
        };
        ExtensionGalleryService.prototype.getLastValidExtensionVersionReccursively = function (extension, versions) {
            var _this = this;
            if (!versions.length) {
                return winjs_base_1.TPromise.wrapError(new Error(nls_1.localize(1, null, extension.displayName || extension.extensionName)));
            }
            var version = versions[0];
            var asset = getVersionAsset(version, AssetType.Manifest);
            var headers = { 'Accept-Encoding': 'gzip' };
            return this.getAsset(asset, { headers: headers })
                .then(function (context) { return request_2.asJson(context); })
                .then(function (manifest) {
                var engine = manifest.engines.vscode;
                if (!_this.isEngineValid(engine)) {
                    return _this.getLastValidExtensionVersionReccursively(extension, versions.slice(1));
                }
                version.properties = version.properties || [];
                version.properties.push({ key: PropertyType.Engine, value: manifest.engines.vscode });
                return version;
            });
        };
        ExtensionGalleryService.prototype.isEngineValid = function (engine) {
            // TODO@joao: discuss with alex '*' doesn't seem to be a valid engine version
            return engine === '*' || extensionValidator_1.isVersionValid(package_1.default.version, engine);
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
        __decorate([
            decorators_1.memoize
        ], ExtensionGalleryService.prototype, "commonHTTPHeaders", null);
        ExtensionGalleryService = __decorate([
            __param(0, request_1.IRequestService),
            __param(1, telemetry_1.ITelemetryService),
            __param(2, configuration_1.IConfigurationService)
        ], ExtensionGalleryService);
        return ExtensionGalleryService;
    }());
    exports.ExtensionGalleryService = ExtensionGalleryService;
});










define(__m[52/*vs/platform/request/node/requestService*/], __M([0/*require*/,1/*exports*/,7/*vs/base/common/objects*/,31/*vs/base/node/request*/,83/*vs/base/node/proxy*/,13/*vs/platform/configuration/common/configuration*/]), function (require, exports, objects_1, request_1, proxy_1, configuration_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    /**
     * This service exposes the `request` API, while using the global
     * or configured proxy settings.
     */
    var RequestService = (function () {
        function RequestService(configurationService) {
            this.disposables = [];
            this.configure(configurationService.getConfiguration());
            configurationService.onDidUpdateConfiguration(this.onDidUpdateConfiguration, this, this.disposables);
        }
        RequestService.prototype.onDidUpdateConfiguration = function (e) {
            this.configure(e.config);
        };
        RequestService.prototype.configure = function (config) {
            this.proxyUrl = config.http && config.http.proxy;
            this.strictSSL = config.http && config.http.proxyStrictSSL;
            this.authorization = config.http && config.http.proxyAuthorization;
        };
        RequestService.prototype.request = function (options, requestFn) {
            if (requestFn === void 0) { requestFn = request_1.request; }
            var _a = this, proxyUrl = _a.proxyUrl, strictSSL = _a.strictSSL;
            options.agent = options.agent || proxy_1.getProxyAgent(options.url, { proxyUrl: proxyUrl, strictSSL: strictSSL });
            options.strictSSL = strictSSL;
            if (this.authorization) {
                options.headers = objects_1.assign(options.headers || {}, { 'Proxy-Authorization': this.authorization });
            }
            return requestFn(options);
        };
        RequestService = __decorate([
            __param(0, configuration_1.IConfigurationService)
        ], RequestService);
        return RequestService;
    }());
    exports.RequestService = RequestService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[103/*vs/code/node/cliProcessMain*/], __M([0/*require*/,1/*exports*/,3/*vs/nls!vs/code/node/cliProcessMain*/,39/*vs/platform/product*/,28/*vs/platform/package*/,10/*path*/,2/*vs/base/common/winjs.base*/,19/*vs/base/common/async*/,33/*vs/platform/instantiation/common/serviceCollection*/,30/*vs/platform/instantiation/common/descriptors*/,72/*vs/platform/instantiation/common/instantiationService*/,22/*vs/platform/environment/common/environment*/,86/*vs/platform/environment/node/environmentService*/,69/*vs/platform/event/common/event*/,60/*vs/platform/event/common/eventService*/,27/*vs/platform/extensionManagement/common/extensionManagement*/,89/*vs/platform/extensionManagement/node/extensionManagementService*/,70/*vs/platform/extensionManagement/node/extensionGalleryService*/,23/*vs/platform/telemetry/common/telemetry*/,90/*vs/platform/telemetry/common/telemetryService*/,92/*vs/platform/telemetry/node/commonProperties*/,40/*vs/platform/request/node/request*/,52/*vs/platform/request/node/requestService*/,13/*vs/platform/configuration/common/configuration*/,85/*vs/platform/configuration/node/configurationService*/,91/*vs/platform/telemetry/node/appInsightsAppender*/,21/*vs/base/node/pfs*/,34/*vs/platform/message/common/message*/,76/*vs/platform/message/node/messageCli*/]), function (require, exports, nls_1, product_1, package_1, path, winjs_base_1, async_1, serviceCollection_1, descriptors_1, instantiationService_1, environment_1, environmentService_1, event_1, eventService_1, extensionManagement_1, extensionManagementService_1, extensionGalleryService_1, telemetry_1, telemetryService_1, commonProperties_1, request_1, requestService_1, configuration_1, configurationService_1, appInsightsAppender_1, pfs_1, message_1, messageCli_1) {
    "use strict";
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
    var Main = (function () {
        function Main(extensionManagementService, extensionGalleryService) {
            this.extensionManagementService = extensionManagementService;
            this.extensionGalleryService = extensionGalleryService;
        }
        Main.prototype.run = function (argv) {
            // TODO@joao - make this contributable
            if (argv['list-extensions']) {
                return this.listExtensions(argv['show-versions']);
            }
            else if (argv['install-extension']) {
                var arg = argv['install-extension'];
                var args = typeof arg === 'string' ? [arg] : arg;
                return this.installExtension(args);
            }
            else if (argv['uninstall-extension']) {
                var arg = argv['uninstall-extension'];
                var ids = typeof arg === 'string' ? [arg] : arg;
                return this.uninstallExtension(ids);
            }
        };
        Main.prototype.listExtensions = function (showVersions) {
            return this.extensionManagementService.getInstalled(extensionManagement_1.LocalExtensionType.User).then(function (extensions) {
                extensions.forEach(function (e) { return console.log(getId(e.manifest, showVersions)); });
            });
        };
        Main.prototype.installExtension = function (extensions) {
            var _this = this;
            var vsixTasks = extensions
                .filter(function (e) { return /\.vsix$/i.test(e); })
                .map(function (id) { return function () {
                var extension = path.isAbsolute(id) ? id : path.join(process.cwd(), id);
                return _this.extensionManagementService.install(extension).then(function () {
                    console.log(nls_1.localize(3, null, path.basename(extension)));
                });
            }; });
            var galleryTasks = extensions
                .filter(function (e) { return !/\.vsix$/i.test(e); })
                .map(function (id) { return function () {
                return _this.extensionManagementService.getInstalled(extensionManagement_1.LocalExtensionType.User).then(function (installed) {
                    var isInstalled = installed.some(function (e) { return getId(e.manifest) === id; });
                    if (isInstalled) {
                        console.log(nls_1.localize(4, null, id));
                        return winjs_base_1.TPromise.as(null);
                    }
                    return _this.extensionGalleryService.query({ names: [id] })
                        .then(null, function (err) {
                        if (err.responseText) {
                            try {
                                var response = JSON.parse(err.responseText);
                                return winjs_base_1.TPromise.wrapError(response.message);
                            }
                            catch (e) {
                            }
                        }
                        return winjs_base_1.TPromise.wrapError(err);
                    })
                        .then(function (result) {
                        var extension = result.firstPage[0];
                        if (!extension) {
                            return winjs_base_1.TPromise.wrapError(notFound(id) + "\n" + useId);
                        }
                        console.log(nls_1.localize(5, null, id));
                        console.log(nls_1.localize(6, null));
                        return _this.extensionManagementService.installFromGallery(extension)
                            .then(function () { return console.log(nls_1.localize(7, null, id, extension.version)); });
                    });
                });
            }; });
            return async_1.sequence(vsixTasks.concat(galleryTasks));
        };
        Main.prototype.uninstallExtension = function (ids) {
            var _this = this;
            return async_1.sequence(ids.map(function (id) { return function () {
                return _this.extensionManagementService.getInstalled(extensionManagement_1.LocalExtensionType.User).then(function (installed) {
                    var extension = installed.filter(function (e) { return getId(e.manifest) === id; })[0];
                    if (!extension) {
                        return winjs_base_1.TPromise.wrapError(notInstalled(id) + "\n" + useId);
                    }
                    console.log(nls_1.localize(8, null, id));
                    return _this.extensionManagementService.uninstall(extension)
                        .then(function () { return console.log(nls_1.localize(9, null, id)); });
                });
            }; }));
        };
        Main = __decorate([
            __param(0, extensionManagement_1.IExtensionManagementService),
            __param(1, extensionManagement_1.IExtensionGalleryService)
        ], Main);
        return Main;
    }());
    var eventPrefix = 'monacoworkbench';
    function main(argv) {
        var services = new serviceCollection_1.ServiceCollection();
        services.set(environment_1.IEnvironmentService, new descriptors_1.SyncDescriptor(environmentService_1.EnvironmentService, argv, process.execPath));
        var instantiationService = new instantiationService_1.InstantiationService(services);
        return instantiationService.invokeFunction(function (accessor) {
            var envService = accessor.get(environment_1.IEnvironmentService);
            return winjs_base_1.TPromise.join([envService.appSettingsHome, envService.userProductHome, envService.extensionsPath].map(function (p) { return pfs_1.mkdirp(p); })).then(function () {
                var appRoot = envService.appRoot, extensionsPath = envService.extensionsPath, extensionDevelopmentPath = envService.extensionDevelopmentPath, isBuilt = envService.isBuilt;
                var services = new serviceCollection_1.ServiceCollection();
                services.set(event_1.IEventService, new descriptors_1.SyncDescriptor(eventService_1.EventService));
                services.set(configuration_1.IConfigurationService, new descriptors_1.SyncDescriptor(configurationService_1.ConfigurationService));
                services.set(request_1.IRequestService, new descriptors_1.SyncDescriptor(requestService_1.RequestService));
                services.set(extensionManagement_1.IExtensionManagementService, new descriptors_1.SyncDescriptor(extensionManagementService_1.ExtensionManagementService));
                services.set(extensionManagement_1.IExtensionGalleryService, new descriptors_1.SyncDescriptor(extensionGalleryService_1.ExtensionGalleryService));
                services.set(message_1.IChoiceService, new descriptors_1.SyncDescriptor(messageCli_1.ChoiceCliService));
                if (isBuilt && !extensionDevelopmentPath && product_1.default.enableTelemetry) {
                    var appenders_1 = [];
                    if (product_1.default.aiConfig && product_1.default.aiConfig.key) {
                        appenders_1.push(new appInsightsAppender_1.AppInsightsAppender(eventPrefix, null, product_1.default.aiConfig.key));
                    }
                    if (product_1.default.aiConfig && product_1.default.aiConfig.asimovKey) {
                        appenders_1.push(new appInsightsAppender_1.AppInsightsAppender(eventPrefix, null, product_1.default.aiConfig.asimovKey));
                    }
                    // It is important to dispose the AI adapter properly because
                    // only then they flush remaining data.
                    process.once('exit', function () { return appenders_1.forEach(function (a) { return a.dispose(); }); });
                    var config = {
                        appender: telemetry_1.combinedAppender.apply(void 0, appenders_1),
                        commonProperties: commonProperties_1.resolveCommonProperties(product_1.default.commit, package_1.default.version),
                        piiPaths: [appRoot, extensionsPath]
                    };
                    services.set(telemetry_1.ITelemetryService, new descriptors_1.SyncDescriptor(telemetryService_1.TelemetryService, config));
                }
                else {
                    services.set(telemetry_1.ITelemetryService, telemetry_1.NullTelemetryService);
                }
                var instantiationService2 = instantiationService.createChild(services);
                var main = instantiationService2.createInstance(Main);
                return main.run(argv);
            });
        });
    }
    exports.main = main;
});

}).call(this);
//# sourceMappingURL=cliProcessMain.js.map
