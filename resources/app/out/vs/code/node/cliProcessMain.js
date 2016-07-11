/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["exports","require","vs/base/common/winjs.base","vs/nls!vs/code/node/cliProcessMain","vs/nls","vs/base/common/types","vs/platform/instantiation/common/instantiation","vs/base/common/objects","path","vs/base/common/errors","vs/base/common/lifecycle","vs/base/common/event","vs/base/common/async","fs","vs/base/common/platform","vs/platform/configuration/common/configuration","vs/platform/environment/common/environment","vs/platform/platform","vs/base/common/json","vs/base/node/pfs","vs/platform/request/common/request","vs/platform/package","vs/platform/extensionManagement/common/extensionManagement","vs/platform/product","vs/platform/telemetry/common/telemetry","vs/platform/instantiation/common/serviceCollection","vs/base/common/jsonFormatter","vs/platform/instantiation/common/descriptors","vs/base/common/timer","vs/base/common/eventEmitter","vs/base/node/proxy","vs/platform/event/common/event","vs/base/common/uri","vs/base/node/request","vs/base/common/strings","vs/platform/jsonschemas/common/jsonContributionRegistry","vs/platform/extensions/common/extensionsRegistry","vs/base/common/uuid","vs/base/common/paths","os","vs/base/common/collections","vs/base/common/assert","vs/base/common/jsonEdit","vs/nls!vs/base/common/severity","vs/base/common/cancellation","vs/nls!vs/base/node/zip","vs/nls!vs/platform/configuration/common/configurationRegistry","vs/nls!vs/platform/extensionManagement/common/extensionManagement","vs/nls!vs/platform/extensionManagement/node/extensionManagementService","vs/nls!vs/platform/extensions/common/extensionsRegistry","vs/nls!vs/platform/extensions/node/extensionValidator","vs/nls!vs/platform/jsonschemas/common/jsonContributionRegistry","vs/nls!vs/platform/telemetry/common/telemetryService","vs/base/common/stopwatch","vs/base/common/graph","vs/base/node/paths","vs/base/node/flow","vs/platform/configuration/node/nodeConfigurationService","vs/base/common/network","vs/platform/event/common/eventService","vs/platform/request/node/nodeRequestService","url","vs/base/common/arrays","vs/platform/instantiation/common/instantiationService","vs/workbench/node/userSettings","vs/platform/telemetry/node/commonProperties","vs/platform/extensionManagement/node/extensionManagementService","vs/platform/configuration/common/configurationRegistry","vs/platform/extensions/node/extensionValidator","semver","vs/nls!vs/base/common/json","vs/platform/environment/node/environmentService","vs/base/node/zip","vs/base/common/callbackList","vs/platform/telemetry/node/appInsightsAppender","vs/base/node/extfs","vs/base/common/severity","vs/platform/extensionManagement/node/extensionGalleryService","vs/platform/telemetry/common/telemetryService","vs/code/node/argv","applicationinsights","http","https","https-proxy-agent","yauzl","http-proxy-agent","assert","zlib","vs/code/node/cliProcessMain"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[41], __M([1,0]), function (require, exports) {
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

define(__m[40], __M([1,0]), function (require, exports) {
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

define(__m[38], __M([1,0,14]), function (require, exports, platform_1) {
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

define(__m[53], __M([1,0,14]), function (require, exports, platform_1) {
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

define(__m[54], __M([1,0,5,40]), function (require, exports, types_1, collections_1) {
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(__m[10], __M([1,0,5]), function (require, exports, types_1) {
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






define(__m[37], __M([1,0]), function (require, exports) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[56], __M([1,0,86]), function (require, exports, assert) {
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
define(__m[75], __M([1,0,37,34,14,56,13,8]), function (require, exports, uuid, strings, platform, flow, fs, paths) {
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
define(__m[55], __M([1,0,32]), function (require, exports, uri_1) {
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
define(__m[30], __M([1,0,61,5,85,83]), function (require, exports, url_1, types_1, HttpProxyAgent, HttpsProxyAgent) {
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

define(__m[73], __M([1,0,9]), function (require, exports, errors_1) {
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

define(__m[11], __M([1,0,73]), function (require, exports, callbackList_1) {
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
                        emitter.fire(output);
                        output = undefined;
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
define(__m[44], __M([1,0,11]), function (require, exports, event_1) {
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






define(__m[29], __M([1,0,9]), function (require, exports, Errors) {
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

define(__m[28], __M([1,0,14,9,53]), function (require, exports, Platform, errors, precision) {
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





define(__m[12], __M([1,0,9,14,2,44,10]), function (require, exports, errors, platform, winjs_base_1, cancellation_1, lifecycle_1) {
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

define(__m[58], __M([1,0,2]), function (require, exports, winjs_base_1) {
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
        /**
         * A schema that is used for setting files
         */
        Schemas.vscode = 'vscode';
        /**
         * A schema that is used for internal private files
         */
        Schemas.internal = 'private';
        Schemas.http = 'http';
        Schemas.https = 'https';
        Schemas.file = 'file';
    })(Schemas = exports.Schemas || (exports.Schemas = {}));
    function xhr(options) {
        var req = null;
        var canceled = false;
        return new winjs_base_1.TPromise(function (c, e, p) {
            req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (canceled) {
                    return;
                }
                if (req.readyState === 4) {
                    // Handle 1223: http://bugs.jquery.com/ticket/1450
                    if ((req.status >= 200 && req.status < 300) || req.status === 1223) {
                        c(req);
                    }
                    else {
                        e(req);
                    }
                    req.onreadystatechange = function () { };
                }
                else {
                    p(req);
                }
            };
            req.open(options.type || 'GET', options.url, 
            // Promise based XHR does not support sync.
            //
            true, options.user, options.password);
            req.responseType = options.responseType || '';
            Object.keys(options.headers || {}).forEach(function (k) {
                req.setRequestHeader(k, options.headers[k]);
            });
            if (options.customRequestInitializer) {
                options.customRequestInitializer(req);
            }
            req.send(options.data);
        }, function () {
            canceled = true;
            req.abort();
        });
    }
    exports.xhr = xhr;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[19], __M([1,0,2,75,38,8,12,13]), function (require, exports, winjs_base_1, extfs, paths, path_1, async_1, fs) {
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
define(__m[33], __M([1,0,2,5,82,81,61,13,7]), function (require, exports, winjs_base_1, types_1, https, http, url_1, fs_1, objects_1) {
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
    function text(opts) {
        return request(opts).then(function (pair) { return new winjs_base_1.Promise(function (c, e) {
            if (!((pair.res.statusCode >= 200 && pair.res.statusCode < 300) || pair.res.statusCode === 1223)) {
                return e('Server returned ' + pair.res.statusCode);
            }
            if (pair.res.statusCode === 204) {
                return c(null);
            }
            var buffer = [];
            pair.res.on('data', function (d) { return buffer.push(d); });
            pair.res.on('end', function () { return c(buffer.join('')); });
            pair.res.on('error', e);
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
            pair.res.on('data', function (d) { return buffer.push(d); });
            pair.res.on('end', function () { return c(JSON.parse(buffer.join(''))); });
            pair.res.on('error', e);
        }); });
    }
    exports.json = json;
});

define(__m[70], __M([4,3]), function(nls, data) { return nls.create("vs/base/common/json", data); });
define(__m[18], __M([1,0,70]), function (require, exports, nls_1) {
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

define(__m[26], __M([1,0,18]), function (require, exports, Json) {
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

define(__m[42], __M([1,0,18,26]), function (require, exports, json_1, jsonFormatter_1) {
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

define(__m[43], __M([4,3]), function(nls, data) { return nls.create("vs/base/common/severity", data); });
define(__m[76], __M([1,0,43,34]), function (require, exports, nls, strings) {
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

define(__m[45], __M([4,3]), function(nls, data) { return nls.create("vs/base/node/zip", data); });

define(__m[46], __M([4,3]), function(nls, data) { return nls.create("vs/platform/configuration/common/configurationRegistry", data); });
define(__m[47], __M([4,3]), function(nls, data) { return nls.create("vs/platform/extensionManagement/common/extensionManagement", data); });
define(__m[48], __M([4,3]), function(nls, data) { return nls.create("vs/platform/extensionManagement/node/extensionManagementService", data); });
define(__m[49], __M([4,3]), function(nls, data) { return nls.create("vs/platform/extensions/common/extensionsRegistry", data); });
define(__m[50], __M([4,3]), function(nls, data) { return nls.create("vs/platform/extensions/node/extensionValidator", data); });
define(__m[51], __M([4,3]), function(nls, data) { return nls.create("vs/platform/jsonschemas/common/jsonContributionRegistry", data); });
define(__m[52], __M([4,3]), function(nls, data) { return nls.create("vs/platform/telemetry/common/telemetryService", data); });





define(__m[27], __M([1,0,9]), function (require, exports, errors_1) {
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

define(__m[6], __M([1,0]), function (require, exports) {
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
define(__m[15], __M([1,0,6]), function (require, exports, instantiation_1) {
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
define(__m[16], __M([1,0,6]), function (require, exports, instantiation_1) {
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
define(__m[57], __M([1,0,19,13,8,2,12,18,26,42,10,15,11,16]), function (require, exports, pfs_1, fs_1, path, winjs_base_1, async_1, json_1, jsonFormatter_1, jsonEdit_1, lifecycle_1, configuration_1, event_1, environment_1) {
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
            this.serviceId = configuration_1.IConfigurationService;
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

define(__m[31], __M([1,0,6]), function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IEventService = instantiation_1.createDecorator('eventService');
});






define(__m[59], __M([1,0,29,31]), function (require, exports, eventEmitter_1, event_1) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[22], __M([1,0,47,6]), function (require, exports, nls, instantiation_1) {
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

define(__m[25], __M([1,0,62]), function (require, exports, arrays_1) {
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

define(__m[63], __M([1,0,2,9,5,41,54,27,6,25]), function (require, exports, winjs_base_1, errors_1, types_1, assert, graph_1, descriptors_1, instantiation_1, serviceCollection_1) {
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

define(__m[17], __M([1,0,5,41]), function (require, exports, Types, Assert) {
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

define(__m[35], __M([1,0,51,17,29]), function (require, exports, nls, platform, eventEmitter_1) {
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

define(__m[36], __M([1,0,49,9,38,76,35,17]), function (require, exports, nls, errors_1, paths, severity_1, jsonContributionRegistry_1, platform_1) {
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
});

define(__m[67], __M([1,0,46,11,17,7,36,35]), function (require, exports, nls, event_1, platform, objects, extensionsRegistry_1, JSONContributionRegistry) {
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

define(__m[68], __M([1,0,50,36,69]), function (require, exports, nls, extensionsRegistry_1, semver_1) {
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
define(__m[23], __M([1,0,8,32]), function (require, exports, path, uri_1) {
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
define(__m[71], __M([1,0,16,55,23,21,39,8,79,32]), function (require, exports, environment_1, paths, product_1, package_1, os, path, argv_1, uri_1) {
    "use strict";
    var EnvironmentService = (function () {
        function EnvironmentService() {
            this.serviceId = environment_1.IEnvironmentService;
            var argv = argv_1.parseArgs(process.argv);
            this._appRoot = path.dirname(uri_1.default.parse(require.toUrl('')).fsPath);
            this._userDataPath = paths.getUserDataPath(process.platform, package_1.default.name, process.argv);
            var userHome = path.join(os.homedir(), product_1.default.dataFolderName);
            this._extensionsPath = argv.extensionHomePath || path.join(userHome, 'extensions');
            this._extensionsPath = path.normalize(this._extensionsPath);
            this._extensionDevelopmentPath = argv.extensionDevelopmentPath;
        }
        Object.defineProperty(EnvironmentService.prototype, "appRoot", {
            get: function () { return this._appRoot; },
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
        return EnvironmentService;
    }());
    exports.EnvironmentService = EnvironmentService;
});

define(__m[20], __M([1,0,6]), function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.IRequestService = instantiation_1.createDecorator('requestService');
});

define(__m[24], __M([1,0,2,28,6]), function (require, exports, winjs_base_1, timer_1, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.ITelemetryService = instantiation_1.createDecorator('telemetryService');
    exports.NullTelemetryService = {
        serviceId: undefined,
        timedPublicLog: function (name, data) { return timer_1.nullEvent; },
        publicLog: function (eventName, data) { return winjs_base_1.TPromise.as(null); },
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









define(__m[77], __M([1,0,2,22,5,7,20,24,21,23]), function (require, exports, winjs_base_1, extensionManagement_1, types_1, objects_1, request_1, telemetry_1, package_1, product_1) {
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
    })(Flags || (Flags = {}));
    var FilterType;
    (function (FilterType) {
        FilterType[FilterType["Tag"] = 1] = "Tag";
        FilterType[FilterType["ExtensionId"] = 4] = "ExtensionId";
        FilterType[FilterType["Category"] = 5] = "Category";
        FilterType[FilterType["ExtensionName"] = 7] = "ExtensionName";
        FilterType[FilterType["Target"] = 8] = "Target";
        FilterType[FilterType["Featured"] = 9] = "Featured";
        FilterType[FilterType["SearchText"] = 10] = "SearchText";
    })(FilterType || (FilterType = {}));
    var DefaultPageSize = 10;
    var DefaultQueryState = {
        pageNumber: 1,
        pageSize: DefaultPageSize,
        sortBy: extensionManagement_1.SortBy.NoneOrRelevance,
        sortOrder: extensionManagement_1.SortOrder.Default,
        flags: Flags.None,
        criteria: []
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
        Query.prototype.withFilter = function (filterType, value) {
            var criterium = { filterType: filterType };
            if (!types_1.isUndefined(value)) {
                criterium.value = value;
            }
            var criteria = this.state.criteria.slice();
            criteria.push(criterium);
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
        Object.defineProperty(Query.prototype, "raw", {
            get: function () {
                return {
                    filters: [{
                            criteria: this.state.criteria,
                            pageNumber: this.state.pageNumber,
                            pageSize: this.state.pageSize,
                            sortBy: this.state.sortBy,
                            sortOrder: this.state.sortOrder
                        }],
                    flags: this.state.flags
                };
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
    function toExtension(galleryExtension, extensionsGalleryUrl, downloadHeaders) {
        var versions = galleryExtension.versions.map(function (v) { return ({
            version: v.version,
            date: v.lastUpdated,
            downloadHeaders: downloadHeaders,
            downloadUrl: v.assetUri + "/Microsoft.VisualStudio.Services.VSIXPackage?install=true",
            manifestUrl: v.assetUri + "/Microsoft.VisualStudio.Code.Manifest",
            readmeUrl: v.assetUri + "/Microsoft.VisualStudio.Services.Content.Details",
            iconUrl: v.assetUri + "/Microsoft.VisualStudio.Services.Icons.Default"
        }); });
        return {
            id: galleryExtension.extensionId,
            name: galleryExtension.extensionName,
            displayName: galleryExtension.displayName,
            publisherId: galleryExtension.publisher.publisherId,
            publisher: galleryExtension.publisher.publisherName,
            publisherDisplayName: galleryExtension.publisher.displayName,
            description: galleryExtension.shortDescription || '',
            installCount: getStatistic(galleryExtension.statistics, 'install'),
            rating: getStatistic(galleryExtension.statistics, 'averagerating'),
            ratingCount: getStatistic(galleryExtension.statistics, 'ratingcount'),
            versions: versions
        };
    }
    var ExtensionGalleryService = (function () {
        function ExtensionGalleryService(requestService, telemetryService) {
            this.requestService = requestService;
            this.telemetryService = telemetryService;
            this.serviceId = extensionManagement_1.IExtensionGalleryService;
            var config = product_1.default.extensionsGallery;
            this.extensionsGalleryUrl = config && config.serviceUrl;
            this.machineId = telemetryService.getTelemetryInfo().then(function (_a) {
                var machineId = _a.machineId;
                return machineId;
            });
        }
        ExtensionGalleryService.prototype.api = function (path) {
            if (path === void 0) { path = ''; }
            return "" + this.extensionsGalleryUrl + path;
        };
        ExtensionGalleryService.prototype.isEnabled = function () {
            return !!this.extensionsGalleryUrl;
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
                .withFlags(Flags.IncludeVersions, Flags.IncludeCategoryAndTags, Flags.IncludeAssetUri, Flags.IncludeStatistics)
                .withPage(1, pageSize)
                .withFilter(FilterType.Target, 'Microsoft.VisualStudio.Code');
            if (text) {
                query = query.withFilter(FilterType.SearchText, text).withSortBy(extensionManagement_1.SortBy.NoneOrRelevance);
            }
            else if (options.ids) {
                query = options.ids.reduce(function (query, id) { return query.withFilter(FilterType.ExtensionId, id); }, query);
            }
            else if (options.names) {
                query = options.names.reduce(function (query, name) { return query.withFilter(FilterType.ExtensionName, name); }, query);
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
                return _this.getRequestHeaders().then(function (downloadHeaders) {
                    var extensions = galleryExtensions.map(function (e) { return toExtension(e, _this.extensionsGalleryUrl, downloadHeaders); });
                    var pageSize = query.pageSize;
                    var getPage = function (pageIndex) { return _this.queryGallery(query.withPage(pageIndex + 1))
                        .then(function (_a) {
                        var galleryExtensions = _a.galleryExtensions;
                        return galleryExtensions.map(function (e) { return toExtension(e, _this.extensionsGalleryUrl, downloadHeaders); });
                    }); };
                    return { firstPage: extensions, total: total, pageSize: pageSize, getPage: getPage };
                });
            });
        };
        ExtensionGalleryService.prototype.queryGallery = function (query) {
            var _this = this;
            var data = JSON.stringify(query.raw);
            return this.getRequestHeaders()
                .then(function (headers) {
                headers = objects_1.assign(headers, {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json;api-version=3.0-preview.1',
                    'Content-Length': data.length
                });
                var request = {
                    type: 'POST',
                    url: _this.api('/extensionquery'),
                    data: data,
                    headers: headers
                };
                return _this.requestService.makeRequest(request);
            })
                .then(function (r) { return JSON.parse(r.responseText).results[0]; })
                .then(function (r) {
                var galleryExtensions = r.extensions;
                var resultCount = r.resultMetadata && r.resultMetadata.filter(function (m) { return m.metadataType === 'ResultCount'; })[0];
                var total = resultCount && resultCount.metadataItems.filter(function (i) { return i.name === 'TotalCount'; })[0].count || 0;
                return { galleryExtensions: galleryExtensions, total: total };
            });
        };
        ExtensionGalleryService.prototype.getRequestHeaders = function () {
            return this.machineId.then(function (machineId) {
                var result = {
                    'X-Market-Client-Id': "VSCode " + package_1.default.version,
                    'User-Agent': "VSCode " + package_1.default.version
                };
                if (machineId) {
                    result['X-Market-User-Id'] = machineId;
                }
                return result;
            });
        };
        ExtensionGalleryService = __decorate([
            __param(0, request_1.IRequestService),
            __param(1, telemetry_1.ITelemetryService)
        ], ExtensionGalleryService);
        return ExtensionGalleryService;
    }());
    exports.ExtensionGalleryService = ExtensionGalleryService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[78], __M([1,0,52,34,24,6,15,67,2,10,28,7,17]), function (require, exports, nls_1, strings_1, telemetry_1, instantiation_1, configuration_1, configurationRegistry_1, winjs_base_1, lifecycle_1, timer_1, objects_1, platform_1) {
    'use strict';
    var TelemetryService = (function () {
        function TelemetryService(config, _configurationService) {
            var _this = this;
            this._configurationService = _configurationService;
            this.serviceId = telemetry_1.ITelemetryService;
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

define(__m[74], __M([1,0,80,5,7,2]), function (require, exports, appInsights, types_1, objects_1, winjs_base_1) {
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
define(__m[65], __M([1,0,14,39,2,37]), function (require, exports, Platform, os, winjs_base_1, uuid) {
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
define(__m[64], __M([1,0,13,8,18,7,2,11]), function (require, exports, fs, path, json, objects, winjs_base_1, event_1) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[72], __M([1,0,45,8,13,12,19,2,84]), function (require, exports, nls, path, fs_1, async_1, pfs_1, winjs_base_1, yauzl_1) {
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
                var stream = async_1.ninvoke(zipfile, zipfile.openReadStream, entry);
                var fileName = entry.fileName.replace(options.sourcePathRegex, '');
                var mode = modeFromEntry(entry);
                last = throttler.queue(function () { return stream.then(function (stream) { return extractEntry(stream, fileName, mode, targetPath, options); }); });
            });
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









define(__m[66], __M([1,0,48,39,8,5,19,7,10,62,72,2,22,33,30,16,12,11,64,69,40,68,21]), function (require, exports, nls, os_1, path, types, pfs, objects_1, lifecycle_1, arrays_1, zip_1, winjs_base_1, extensionManagement_1, request_1, proxy_1, environment_1, async_1, event_1, userSettings_1, semver, collections_1, extensionValidator_1, package_1) {
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
            this.serviceId = extensionManagement_1.IExtensionManagementService;
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
            // this.disposables = [
            // 	this.onDidInstallExtension(({ extension, isUpdate, error }) => telemetryService.publicLog(
            // 		isUpdate ? 'extensionGallery2:update' : 'extensionGallery2:install',
            // 		assign(getTelemetryData(extension), { success: !error })
            // 	)),
            // 	this.onDidUninstallExtension(extension => telemetryService.publicLog(
            // 		'extensionGallery2:uninstall',
            // 		assign(getTelemetryData(extension), { success: true })
            // 	))
            // ];
        }
        ExtensionManagementService.prototype.install = function (arg) {
            var _this = this;
            if (types.isString(arg)) {
                var zipPath_1 = arg;
                return validate(zipPath_1).then(function (manifest) {
                    var id = getExtensionId(manifest, manifest.version);
                    _this._onInstallExtension.fire({ id: id });
                    return _this.installValidExtension(zipPath_1, id);
                });
            }
            var extension = arg;
            var id = getExtensionId(extension, extension.versions[0].version);
            this._onInstallExtension.fire({ id: id, gallery: extension });
            return this.isObsolete(id).then(function (obsolete) {
                if (obsolete) {
                    return winjs_base_1.TPromise.wrapError(new Error(nls.localize(4, null, extension.displayName || extension.name)));
                }
                return _this.installFromGallery(arg);
            });
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
            var version = versions[0];
            return this.request(version.manifestUrl)
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
            var _this = this;
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
                        .then(function () { return _this._onDidInstallExtension.fire({ id: id, local: local }); });
                });
            })
                .then(null, function (error) { _this._onDidInstallExtension.fire({ id: id, error: error }); return winjs_base_1.TPromise.wrapError(error); });
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









define(__m[60], __M([1,0,2,58,10,15,20,7,33,30,87]), function (require, exports, winjs_base_1, network_1, lifecycle_1, configuration_1, request_1, objects_1, request_2, proxy_1, zlib_1) {
    'use strict';
    /**
     * TODO@joao: this is sort of duplicate to the existing request services...
     * we need to compose, not extend!!
     */
    var NodeRequestService = (function () {
        function NodeRequestService(configurationService) {
            var _this = this;
            this.serviceId = request_1.IRequestService;
            this.proxyUrl = null;
            this.strictSSL = true;
            this.disposables = [];
            var config = configurationService.getConfiguration();
            this.configure(config);
            var disposable = configurationService.onDidUpdateConfiguration(function (e) { return _this.configure(e.config); });
            this.disposables.push(disposable);
        }
        NodeRequestService.prototype.configure = function (config) {
            this.proxyUrl = config.http && config.http.proxy;
            this.strictSSL = config.http && config.http.proxyStrictSSL;
        };
        NodeRequestService.prototype.makeRequest = function (options) {
            var url = options.url;
            if (!url) {
                throw new Error('IRequestService.makeRequest: Url is required.');
            }
            var _a = this, proxyUrl = _a.proxyUrl, strictSSL = _a.strictSSL;
            var agent = proxy_1.getProxyAgent(options.url, { proxyUrl: proxyUrl, strictSSL: strictSSL });
            options = objects_1.assign({}, options);
            options = objects_1.assign(options, { agent: agent, strictSSL: strictSSL });
            return request_2.request(options).then(function (result) { return new winjs_base_1.TPromise(function (c, e, p) {
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
                            network_1.xhr(newOptions).done(c, e, p);
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
        };
        NodeRequestService.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        NodeRequestService = __decorate([
            __param(0, configuration_1.IConfigurationService)
        ], NodeRequestService);
        return NodeRequestService;
    }());
    exports.NodeRequestService = NodeRequestService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[88], __M([1,0,3,23,21,2,12,25,27,63,16,71,31,59,22,66,77,24,78,65,20,60,15,57,74]), function (require, exports, nls_1, product_1, package_1, winjs_base_1, async_1, serviceCollection_1, descriptors_1, instantiationService_1, environment_1, environmentService_1, event_1, eventService_1, extensionManagement_1, extensionManagementService_1, extensionGalleryService_1, telemetry_1, telemetryService_1, commonProperties_1, request_1, nodeRequestService_1, configuration_1, nodeConfigurationService_1, appInsightsAppender_1) {
    "use strict";
    var notFound = function (id) { return nls_1.localize(0, null, id); };
    var notInstalled = function (id) { return nls_1.localize(1, null, id); };
    var useId = nls_1.localize(2, null, 'ms-vscode.csharp');
    function getId(manifest) {
        return manifest.publisher + "." + manifest.name;
    }
    var Main = (function () {
        function Main(extensionManagementService, extensionGalleryService) {
            this.extensionManagementService = extensionManagementService;
            this.extensionGalleryService = extensionGalleryService;
        }
        Main.prototype.run = function (argv) {
            // TODO@joao - make this contributable
            if (argv['list-extensions']) {
                return this.listExtensions();
            }
            else if (argv['install-extension']) {
                var arg = argv['install-extension'];
                var ids = typeof arg === 'string' ? [arg] : arg;
                return this.installExtension(ids);
            }
            else if (argv['uninstall-extension']) {
                var arg = argv['uninstall-extension'];
                var ids = typeof arg === 'string' ? [arg] : arg;
                return this.uninstallExtension(ids);
            }
        };
        Main.prototype.listExtensions = function () {
            return this.extensionManagementService.getInstalled().then(function (extensions) {
                extensions.forEach(function (e) { return console.log(getId(e.manifest)); });
            });
        };
        Main.prototype.installExtension = function (ids) {
            var _this = this;
            return async_1.sequence(ids.map(function (id) { return function () {
                return _this.extensionManagementService.getInstalled().then(function (installed) {
                    var isInstalled = installed.some(function (e) { return getId(e.manifest) === id; });
                    if (isInstalled) {
                        console.log(nls_1.localize(3, null, id));
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
                                return winjs_base_1.TPromise.wrapError(err);
                            }
                        }
                    })
                        .then(function (result) {
                        var extension = result.firstPage[0];
                        if (!extension) {
                            return winjs_base_1.TPromise.wrapError(notFound(id) + "\n" + useId);
                        }
                        console.log(nls_1.localize(4, null, id));
                        console.log(nls_1.localize(5, null));
                        return _this.extensionManagementService.install(extension).then(function () {
                            console.log(nls_1.localize(6, null, id, extension.versions[0].version));
                        });
                    });
                });
            }; }));
        };
        Main.prototype.uninstallExtension = function (ids) {
            var _this = this;
            return async_1.sequence(ids.map(function (id) { return function () {
                return _this.extensionManagementService.getInstalled().then(function (installed) {
                    var extension = installed.filter(function (e) { return getId(e.manifest) === id; })[0];
                    if (!extension) {
                        return winjs_base_1.TPromise.wrapError(notInstalled(id) + "\n" + useId);
                    }
                    console.log(nls_1.localize(7, null, id));
                    return _this.extensionManagementService.uninstall(extension).then(function () {
                        console.log(nls_1.localize(8, null, id));
                    });
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
        services.set(environment_1.IEnvironmentService, new descriptors_1.SyncDescriptor(environmentService_1.EnvironmentService));
        var instantiationService = new instantiationService_1.InstantiationService(services);
        return instantiationService.invokeFunction(function (accessor) {
            var services = new serviceCollection_1.ServiceCollection();
            services.set(event_1.IEventService, new descriptors_1.SyncDescriptor(eventService_1.EventService));
            services.set(configuration_1.IConfigurationService, new descriptors_1.SyncDescriptor(nodeConfigurationService_1.NodeConfigurationService));
            services.set(request_1.IRequestService, new descriptors_1.SyncDescriptor(nodeRequestService_1.NodeRequestService));
            services.set(extensionManagement_1.IExtensionManagementService, new descriptors_1.SyncDescriptor(extensionManagementService_1.ExtensionManagementService));
            services.set(extensionManagement_1.IExtensionGalleryService, new descriptors_1.SyncDescriptor(extensionGalleryService_1.ExtensionGalleryService));
            var _a = accessor.get(environment_1.IEnvironmentService), appRoot = _a.appRoot, extensionsPath = _a.extensionsPath, extensionDevelopmentPath = _a.extensionDevelopmentPath, isBuilt = _a.isBuilt;
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
    }
    exports.main = main;
});

}).call(this);
//# sourceMappingURL=cliProcessMain.js.map
