/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["require","exports","vs/base/common/winjs.base","vs/platform/instantiation/common/instantiation","vs/base/common/event","vs/base/common/platform","vs/base/common/types","path","vs/base/common/objects","vs/nls!vs/code/electron-main/main","vs/nls","vs/platform/environment/common/environment","vs/platform/configuration/common/configuration","vs/base/common/lifecycle","electron","vs/platform/product","vs/base/common/strings","vs/base/common/arrays","vs/base/common/errors","vs/base/common/paths","vs/base/parts/ipc/common/ipc","vs/platform/platform","vs/base/common/uri","vs/code/electron-main/log","vs/code/electron-main/storage","fs","vs/base/node/event","vs/platform/configuration/common/configurationRegistry","original-fs","vs/platform/update/common/update","vs/base/common/uuid","os","vs/platform/telemetry/common/telemetry","vs/base/common/async","vs/code/electron-main/windows","vs/platform/package","vs/base/node/extfs","vs/base/node/request","crypto","vs/code/electron-main/lifecycle","vs/platform/request/node/request","vs/platform/url/common/url","vs/platform/jsonschemas/common/jsonContributionRegistry","vs/platform/instantiation/common/descriptors","vs/platform/backup/common/backup","vs/platform/environment/node/argv","child_process","vs/base/common/map","vs/code/electron-main/window","vs/code/electron-main/paths","vs/base/common/keyCodes","vs/base/node/pfs","vs/base/common/decorators","vs/base/common/assert","vs/platform/instantiation/common/serviceCollection","vs/platform/windows/common/windows","vs/nls!vs/base/common/json","vs/base/common/labels","vs/nls!vs/code/electron-main/menus","vs/base/common/json","vs/base/node/config","vs/nls!vs/base/common/keybinding","vs/base/common/keybinding","vs/nls!vs/base/common/severity","vs/base/common/severity","vs/base/common/glob","vs/nls!vs/code/electron-main/windows","vs/nls!vs/platform/configuration/common/configurationRegistry","vs/nls!vs/platform/environment/node/argv","vs/nls!vs/platform/extensions/common/extensionsRegistry","vs/nls!vs/platform/request/node/request","vs/nls!vs/platform/telemetry/common/telemetryService","vs/nls!vs/workbench/parts/git/electron-main/askpassService","vs/platform/backup/common/backupIpc","vs/base/node/flow","assert","vs/base/common/cancellation","vs/base/common/mime","vs/base/node/id","vs/platform/update/electron-main/auto-updater.win32","vs/base/common/events","vs/base/node/paths","vs/base/common/collections","vs/platform/backup/electron-main/backupMainService","vs/platform/files/common/files","vs/base/node/proxy","vs/platform/instantiation/common/instantiationService","vs/platform/keybinding/common/keybinding","vs/platform/lifecycle/common/lifecycle","url","vs/platform/environment/node/http","events","vs/platform/update/electron-main/auto-updater.linux","vs/platform/extensions/common/extensionsRegistry","vs/base/common/callbackList","vs/platform/configuration/common/model","vs/platform/configuration/node/configurationService","vs/base/parts/ipc/common/ipc.electron","vs/base/parts/ipc/electron-main/ipc.electron-main","vs/base/common/eventEmitter","vs/base/parts/ipc/node/ipc.net","vs/platform/environment/node/environmentService","vs/platform/request/node/requestService","vs/platform/update/electron-main/updateService","vs/platform/telemetry/common/telemetryIpc","vs/platform/telemetry/common/telemetryService","vs/platform/telemetry/node/commonProperties","vs/base/common/graph","vs/code/electron-main/menus","vs/platform/update/common/updateIpc","vs/code/node/sharedProcess","vs/code/electron-main/launch","vs/platform/url/electron-main/urlService","vs/base/node/crypto","vs/platform/url/common/urlIpc","vs/platform/windows/common/windowsIpc","vs/platform/windows/electron-main/windowsService","vs/workbench/parts/git/common/git","vs/workbench/parts/git/common/gitIpc","vs/workbench/parts/git/electron-main/askpassService","minimist","https","http","zlib","net","https-proxy-agent","http-proxy-agent","getmac","vs/base/common/winjs.base.raw","vs/code/electron-main/main"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[17/*vs/base/common/arrays*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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
        if (n === 0) {
            return [];
        }
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
    /**
     * Inserts an element into an array. Returns a function which, when
     * called, will remove that element from the array.
     */
    function insert(array, element) {
        array.push(element);
        return function () {
            var index = array.indexOf(element);
            if (index > -1) {
                array.splice(index, 1);
            }
        };
    }
    exports.insert = insert;
});

define(__m[53/*vs/base/common/assert*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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

define(__m[82/*vs/base/common/collections*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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
define(__m[52/*vs/base/common/decorators*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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
define(__m[80/*vs/base/common/events*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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
define(__m[50/*vs/base/common/keyCodes*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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
         * Please do not depend on this value!
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
            return 0 /* Unknown */;
        };
        return Mapping;
    }());
    exports.Mapping = Mapping;
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
        TO_STRING_MAP[0 /* Unknown */] = 'unknown';
        TO_STRING_MAP[1 /* Backspace */] = 'Backspace';
        TO_STRING_MAP[2 /* Tab */] = 'Tab';
        TO_STRING_MAP[3 /* Enter */] = 'Enter';
        TO_STRING_MAP[4 /* Shift */] = 'Shift';
        TO_STRING_MAP[5 /* Ctrl */] = 'Ctrl';
        TO_STRING_MAP[6 /* Alt */] = 'Alt';
        TO_STRING_MAP[7 /* PauseBreak */] = 'PauseBreak';
        TO_STRING_MAP[8 /* CapsLock */] = 'CapsLock';
        TO_STRING_MAP[9 /* Escape */] = 'Escape';
        TO_STRING_MAP[10 /* Space */] = 'Space';
        TO_STRING_MAP[11 /* PageUp */] = 'PageUp';
        TO_STRING_MAP[12 /* PageDown */] = 'PageDown';
        TO_STRING_MAP[13 /* End */] = 'End';
        TO_STRING_MAP[14 /* Home */] = 'Home';
        TO_STRING_MAP[15 /* LeftArrow */] = 'LeftArrow';
        TO_STRING_MAP[16 /* UpArrow */] = 'UpArrow';
        TO_STRING_MAP[17 /* RightArrow */] = 'RightArrow';
        TO_STRING_MAP[18 /* DownArrow */] = 'DownArrow';
        TO_STRING_MAP[19 /* Insert */] = 'Insert';
        TO_STRING_MAP[20 /* Delete */] = 'Delete';
        TO_STRING_MAP[21 /* KEY_0 */] = '0';
        TO_STRING_MAP[22 /* KEY_1 */] = '1';
        TO_STRING_MAP[23 /* KEY_2 */] = '2';
        TO_STRING_MAP[24 /* KEY_3 */] = '3';
        TO_STRING_MAP[25 /* KEY_4 */] = '4';
        TO_STRING_MAP[26 /* KEY_5 */] = '5';
        TO_STRING_MAP[27 /* KEY_6 */] = '6';
        TO_STRING_MAP[28 /* KEY_7 */] = '7';
        TO_STRING_MAP[29 /* KEY_8 */] = '8';
        TO_STRING_MAP[30 /* KEY_9 */] = '9';
        TO_STRING_MAP[31 /* KEY_A */] = 'A';
        TO_STRING_MAP[32 /* KEY_B */] = 'B';
        TO_STRING_MAP[33 /* KEY_C */] = 'C';
        TO_STRING_MAP[34 /* KEY_D */] = 'D';
        TO_STRING_MAP[35 /* KEY_E */] = 'E';
        TO_STRING_MAP[36 /* KEY_F */] = 'F';
        TO_STRING_MAP[37 /* KEY_G */] = 'G';
        TO_STRING_MAP[38 /* KEY_H */] = 'H';
        TO_STRING_MAP[39 /* KEY_I */] = 'I';
        TO_STRING_MAP[40 /* KEY_J */] = 'J';
        TO_STRING_MAP[41 /* KEY_K */] = 'K';
        TO_STRING_MAP[42 /* KEY_L */] = 'L';
        TO_STRING_MAP[43 /* KEY_M */] = 'M';
        TO_STRING_MAP[44 /* KEY_N */] = 'N';
        TO_STRING_MAP[45 /* KEY_O */] = 'O';
        TO_STRING_MAP[46 /* KEY_P */] = 'P';
        TO_STRING_MAP[47 /* KEY_Q */] = 'Q';
        TO_STRING_MAP[48 /* KEY_R */] = 'R';
        TO_STRING_MAP[49 /* KEY_S */] = 'S';
        TO_STRING_MAP[50 /* KEY_T */] = 'T';
        TO_STRING_MAP[51 /* KEY_U */] = 'U';
        TO_STRING_MAP[52 /* KEY_V */] = 'V';
        TO_STRING_MAP[53 /* KEY_W */] = 'W';
        TO_STRING_MAP[54 /* KEY_X */] = 'X';
        TO_STRING_MAP[55 /* KEY_Y */] = 'Y';
        TO_STRING_MAP[56 /* KEY_Z */] = 'Z';
        TO_STRING_MAP[58 /* ContextMenu */] = 'ContextMenu';
        TO_STRING_MAP[59 /* F1 */] = 'F1';
        TO_STRING_MAP[60 /* F2 */] = 'F2';
        TO_STRING_MAP[61 /* F3 */] = 'F3';
        TO_STRING_MAP[62 /* F4 */] = 'F4';
        TO_STRING_MAP[63 /* F5 */] = 'F5';
        TO_STRING_MAP[64 /* F6 */] = 'F6';
        TO_STRING_MAP[65 /* F7 */] = 'F7';
        TO_STRING_MAP[66 /* F8 */] = 'F8';
        TO_STRING_MAP[67 /* F9 */] = 'F9';
        TO_STRING_MAP[68 /* F10 */] = 'F10';
        TO_STRING_MAP[69 /* F11 */] = 'F11';
        TO_STRING_MAP[70 /* F12 */] = 'F12';
        TO_STRING_MAP[71 /* F13 */] = 'F13';
        TO_STRING_MAP[72 /* F14 */] = 'F14';
        TO_STRING_MAP[73 /* F15 */] = 'F15';
        TO_STRING_MAP[74 /* F16 */] = 'F16';
        TO_STRING_MAP[75 /* F17 */] = 'F17';
        TO_STRING_MAP[76 /* F18 */] = 'F18';
        TO_STRING_MAP[77 /* F19 */] = 'F19';
        TO_STRING_MAP[78 /* NumLock */] = 'NumLock';
        TO_STRING_MAP[79 /* ScrollLock */] = 'ScrollLock';
        TO_STRING_MAP[80 /* US_SEMICOLON */] = ';';
        TO_STRING_MAP[81 /* US_EQUAL */] = '=';
        TO_STRING_MAP[82 /* US_COMMA */] = ',';
        TO_STRING_MAP[83 /* US_MINUS */] = '-';
        TO_STRING_MAP[84 /* US_DOT */] = '.';
        TO_STRING_MAP[85 /* US_SLASH */] = '/';
        TO_STRING_MAP[86 /* US_BACKTICK */] = '`';
        TO_STRING_MAP[87 /* US_OPEN_SQUARE_BRACKET */] = '[';
        TO_STRING_MAP[88 /* US_BACKSLASH */] = '\\';
        TO_STRING_MAP[89 /* US_CLOSE_SQUARE_BRACKET */] = ']';
        TO_STRING_MAP[90 /* US_QUOTE */] = '\'';
        TO_STRING_MAP[91 /* OEM_8 */] = 'OEM_8';
        TO_STRING_MAP[92 /* OEM_102 */] = 'OEM_102';
        TO_STRING_MAP[93 /* NUMPAD_0 */] = 'NumPad0';
        TO_STRING_MAP[94 /* NUMPAD_1 */] = 'NumPad1';
        TO_STRING_MAP[95 /* NUMPAD_2 */] = 'NumPad2';
        TO_STRING_MAP[96 /* NUMPAD_3 */] = 'NumPad3';
        TO_STRING_MAP[97 /* NUMPAD_4 */] = 'NumPad4';
        TO_STRING_MAP[98 /* NUMPAD_5 */] = 'NumPad5';
        TO_STRING_MAP[99 /* NUMPAD_6 */] = 'NumPad6';
        TO_STRING_MAP[100 /* NUMPAD_7 */] = 'NumPad7';
        TO_STRING_MAP[101 /* NUMPAD_8 */] = 'NumPad8';
        TO_STRING_MAP[102 /* NUMPAD_9 */] = 'NumPad9';
        TO_STRING_MAP[103 /* NUMPAD_MULTIPLY */] = 'NumPad_Multiply';
        TO_STRING_MAP[104 /* NUMPAD_ADD */] = 'NumPad_Add';
        TO_STRING_MAP[105 /* NUMPAD_SEPARATOR */] = 'NumPad_Separator';
        TO_STRING_MAP[106 /* NUMPAD_SUBTRACT */] = 'NumPad_Subtract';
        TO_STRING_MAP[107 /* NUMPAD_DECIMAL */] = 'NumPad_Decimal';
        TO_STRING_MAP[108 /* NUMPAD_DIVIDE */] = 'NumPad_Divide';
        // for (let i = 0; i < KeyCode.MAX_VALUE; i++) {
        // 	if (!TO_STRING_MAP[i]) {
        // 		console.warn('Missing string representation for ' + KeyCode[i]);
        // 	}
        // }
    }, function (FROM_STRING_MAP) {
        FROM_STRING_MAP['\r'] = 3 /* Enter */;
    });
    exports.USER_SETTINGS = createMapping(function (TO_USER_SETTINGS_MAP) {
        for (var i = 0, len = STRING._fromKeyCode.length; i < len; i++) {
            TO_USER_SETTINGS_MAP[i] = STRING._fromKeyCode[i];
        }
        TO_USER_SETTINGS_MAP[15 /* LeftArrow */] = 'Left';
        TO_USER_SETTINGS_MAP[16 /* UpArrow */] = 'Up';
        TO_USER_SETTINGS_MAP[17 /* RightArrow */] = 'Right';
        TO_USER_SETTINGS_MAP[18 /* DownArrow */] = 'Down';
    }, function (FROM_USER_SETTINGS_MAP) {
        FROM_USER_SETTINGS_MAP['OEM_1'] = 80 /* US_SEMICOLON */;
        FROM_USER_SETTINGS_MAP['OEM_PLUS'] = 81 /* US_EQUAL */;
        FROM_USER_SETTINGS_MAP['OEM_COMMA'] = 82 /* US_COMMA */;
        FROM_USER_SETTINGS_MAP['OEM_MINUS'] = 83 /* US_MINUS */;
        FROM_USER_SETTINGS_MAP['OEM_PERIOD'] = 84 /* US_DOT */;
        FROM_USER_SETTINGS_MAP['OEM_2'] = 85 /* US_SLASH */;
        FROM_USER_SETTINGS_MAP['OEM_3'] = 86 /* US_BACKTICK */;
        FROM_USER_SETTINGS_MAP['OEM_4'] = 87 /* US_OPEN_SQUARE_BRACKET */;
        FROM_USER_SETTINGS_MAP['OEM_5'] = 88 /* US_BACKSLASH */;
        FROM_USER_SETTINGS_MAP['OEM_6'] = 89 /* US_CLOSE_SQUARE_BRACKET */;
        FROM_USER_SETTINGS_MAP['OEM_7'] = 90 /* US_QUOTE */;
        FROM_USER_SETTINGS_MAP['OEM_8'] = 91 /* OEM_8 */;
        FROM_USER_SETTINGS_MAP['OEM_102'] = 92 /* OEM_102 */;
    });
    var KeyCodeUtils;
    (function (KeyCodeUtils) {
        function toString(key) {
            return STRING.fromKeyCode(key);
        }
        KeyCodeUtils.toString = toString;
        function fromString(key) {
            return STRING.toKeyCode(key);
        }
        KeyCodeUtils.fromString = fromString;
    })(KeyCodeUtils = exports.KeyCodeUtils || (exports.KeyCodeUtils = {}));
    // Binary encoding strategy:
    // 15:  1 bit for ctrlCmd
    // 14:  1 bit for shift
    // 13:  1 bit for alt
    // 12:  1 bit for winCtrl
    //  0: 12 bits for keyCode (up to a maximum keyCode of 4096. Given we have 83 at this point thats good enough)
    var BinaryKeybindingsMask;
    (function (BinaryKeybindingsMask) {
        BinaryKeybindingsMask[BinaryKeybindingsMask["CtrlCmd"] = 32768] = "CtrlCmd";
        BinaryKeybindingsMask[BinaryKeybindingsMask["Shift"] = 16384] = "Shift";
        BinaryKeybindingsMask[BinaryKeybindingsMask["Alt"] = 8192] = "Alt";
        BinaryKeybindingsMask[BinaryKeybindingsMask["WinCtrl"] = 4096] = "WinCtrl";
        BinaryKeybindingsMask[BinaryKeybindingsMask["KeyCode"] = 4095] = "KeyCode";
        BinaryKeybindingsMask[BinaryKeybindingsMask["ModifierMask"] = 61440] = "ModifierMask";
    })(BinaryKeybindingsMask || (BinaryKeybindingsMask = {}));
    (function (KeyMod) {
        KeyMod[KeyMod["CtrlCmd"] = 32768] = "CtrlCmd";
        KeyMod[KeyMod["Shift"] = 16384] = "Shift";
        KeyMod[KeyMod["Alt"] = 8192] = "Alt";
        KeyMod[KeyMod["WinCtrl"] = 4096] = "WinCtrl";
    })(exports.KeyMod || (exports.KeyMod = {}));
    var KeyMod = exports.KeyMod;
    function KeyChord(firstPart, secondPart) {
        return firstPart | ((secondPart & 0x0000ffff) << 16);
    }
    exports.KeyChord = KeyChord;
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
            return (keybinding & 32768 /* CtrlCmd */ ? true : false);
        };
        BinaryKeybindings.hasShift = function (keybinding) {
            return (keybinding & 16384 /* Shift */ ? true : false);
        };
        BinaryKeybindings.hasAlt = function (keybinding) {
            return (keybinding & 8192 /* Alt */ ? true : false);
        };
        BinaryKeybindings.hasWinCtrl = function (keybinding) {
            return (keybinding & 4096 /* WinCtrl */ ? true : false);
        };
        BinaryKeybindings.isModifierKey = function (keybinding) {
            if ((keybinding & 61440 /* ModifierMask */) === keybinding) {
                return true;
            }
            var keyCode = this.extractKeyCode(keybinding);
            return (keyCode === 5 /* Ctrl */
                || keyCode === 57 /* Meta */
                || keyCode === 6 /* Alt */
                || keyCode === 4 /* Shift */);
        };
        BinaryKeybindings.extractKeyCode = function (keybinding) {
            return (keybinding & 4095 /* KeyCode */);
        };
        return BinaryKeybindings;
    }());
    exports.BinaryKeybindings = BinaryKeybindings;
    var Keybinding = (function () {
        function Keybinding(keybinding) {
            this.value = keybinding;
        }
        Keybinding.prototype.equals = function (other) {
            return this.value === other.value;
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
        Keybinding.prototype.isModifierKey = function () {
            return BinaryKeybindings.isModifierKey(this.value);
        };
        Keybinding.prototype.getKeyCode = function () {
            return BinaryKeybindings.extractKeyCode(this.value);
        };
        return Keybinding;
    }());
    exports.Keybinding = Keybinding;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





define(__m[47/*vs/base/common/map*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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

define(__m[5/*vs/base/common/platform*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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
        var rawNlsConfig = process.env['VSCODE_NLS_CONFIG'];
        if (rawNlsConfig) {
            try {
                var nlsConfig = JSON.parse(rawNlsConfig);
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

define(__m[19/*vs/base/common/paths*/], __M([0/*require*/,1/*exports*/,5/*vs/base/common/platform*/,17/*vs/base/common/arrays*/]), function (require, exports, platform_1, arrays_1) {
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

define(__m[16/*vs/base/common/strings*/], __M([0/*require*/,1/*exports*/,47/*vs/base/common/map*/]), function (require, exports, map_1) {
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

define(__m[65/*vs/base/common/glob*/], __M([0/*require*/,1/*exports*/,17/*vs/base/common/arrays*/,16/*vs/base/common/strings*/,19/*vs/base/common/paths*/,47/*vs/base/common/map*/]), function (require, exports, arrays, strings, paths, map_1) {
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

define(__m[6/*vs/base/common/types*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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
        // The method can't do a type cast since there are type (like strings) which
        // are subclasses of any put not positvely matched by the function. Hence type
        // narrowing results in wrong results.
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

define(__m[18/*vs/base/common/errors*/], __M([0/*require*/,1/*exports*/,5/*vs/base/common/platform*/,6/*vs/base/common/types*/]), function (require, exports, platform, types) {
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
        // For external errors, we don't want the listeners to be called
        ErrorHandler.prototype.onUnexpectedExternalError = function (e) {
            this.unexpectedErrorHandler(e);
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
    function onUnexpectedExternalError(e) {
        // ignore errors from cancelled promises
        if (!isPromiseCanceledError(e)) {
            exports.errorHandler.onUnexpectedExternalError(e);
        }
    }
    exports.onUnexpectedExternalError = onUnexpectedExternalError;
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
        return new Error('Not Implemented');
    }
    exports.notImplemented = notImplemented;
    function illegalArgument(name) {
        if (name) {
            return new Error("Illegal argument: " + name);
        }
        else {
            return new Error('Illegal argument');
        }
    }
    exports.illegalArgument = illegalArgument;
    function illegalState(name) {
        if (name) {
            return new Error("Illegal state: " + name);
        }
        else {
            return new Error('Illegal state');
        }
    }
    exports.illegalState = illegalState;
    function readonly(name) {
        return name
            ? new Error("readonly property '" + name + " cannot be changed'")
            : new Error('readonly property cannot be changed');
    }
    exports.readonly = readonly;
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
    function getErrorMessage(err) {
        if (!err) {
            return 'Error';
        }
        if (err.message) {
            return err.message;
        }
        if (err.stack) {
            return err.stack.split('\n')[0];
        }
        return String(err);
    }
    exports.getErrorMessage = getErrorMessage;
});

define(__m[94/*vs/base/common/callbackList*/], __M([0/*require*/,1/*exports*/,18/*vs/base/common/errors*/]), function (require, exports, errors_1) {
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






define(__m[99/*vs/base/common/eventEmitter*/], __M([0/*require*/,1/*exports*/,18/*vs/base/common/errors*/]), function (require, exports, Errors) {
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

define(__m[107/*vs/base/common/graph*/], __M([0/*require*/,1/*exports*/,6/*vs/base/common/types*/,82/*vs/base/common/collections*/]), function (require, exports, types_1, collections_1) {
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

define(__m[57/*vs/base/common/labels*/], __M([0/*require*/,1/*exports*/,5/*vs/base/common/platform*/,6/*vs/base/common/types*/,16/*vs/base/common/strings*/,19/*vs/base/common/paths*/]), function (require, exports, platform, types, strings, paths) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var PathLabelProvider = (function () {
        function PathLabelProvider(arg1) {
            this.root = arg1 && getPath(arg1);
        }
        PathLabelProvider.prototype.getLabel = function (arg1) {
            return getPathLabel(getPath(arg1), this.root);
        };
        return PathLabelProvider;
    }());
    exports.PathLabelProvider = PathLabelProvider;
    function getPathLabel(resource, basePathProvider) {
        var absolutePath = getPath(resource);
        if (!absolutePath) {
            return null;
        }
        var basepath = basePathProvider && getPath(basePathProvider);
        if (basepath && paths.isEqualOrParent(absolutePath, basepath)) {
            if (basepath === absolutePath) {
                return ''; // no label if pathes are identical
            }
            return paths.normalize(strings.ltrim(absolutePath.substr(basepath.length), paths.nativeSep), true);
        }
        if (platform.isWindows && absolutePath && absolutePath[1] === ':') {
            return paths.normalize(absolutePath.charAt(0).toUpperCase() + absolutePath.slice(1), true); // convert c:\something => C:\something
        }
        return paths.normalize(absolutePath, true);
    }
    exports.getPathLabel = getPathLabel;
    function getPath(arg1) {
        if (!arg1) {
            return null;
        }
        if (typeof arg1 === 'string') {
            return arg1;
        }
        if (types.isFunction(arg1.getWorkspace)) {
            var ws = arg1.getWorkspace();
            return ws ? ws.resource.fsPath : void 0;
        }
        return arg1.fsPath;
    }
});






define(__m[13/*vs/base/common/lifecycle*/], __M([0/*require*/,1/*exports*/,6/*vs/base/common/types*/]), function (require, exports, types_1) {
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

define(__m[4/*vs/base/common/event*/], __M([0/*require*/,1/*exports*/,13/*vs/base/common/lifecycle*/,94/*vs/base/common/callbackList*/]), function (require, exports, lifecycle_1, callbackList_1) {
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
define(__m[76/*vs/base/common/cancellation*/], __M([0/*require*/,1/*exports*/,4/*vs/base/common/event*/]), function (require, exports, event_1) {
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

define(__m[77/*vs/base/common/mime*/], __M([0/*require*/,1/*exports*/,19/*vs/base/common/paths*/,6/*vs/base/common/types*/,16/*vs/base/common/strings*/,65/*vs/base/common/glob*/]), function (require, exports, paths, types, strings, glob_1) {
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

define(__m[8/*vs/base/common/objects*/], __M([0/*require*/,1/*exports*/,6/*vs/base/common/types*/]), function (require, exports, Types) {
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
            // See https://github.com/Microsoft/TypeScript/issues/10990
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

define(__m[22/*vs/base/common/uri*/], __M([0/*require*/,1/*exports*/,5/*vs/base/common/platform*/]), function (require, exports, platform) {
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
        URI.isUri = function (thing) {
            if (thing instanceof URI) {
                return true;
            }
            if (!thing) {
                return false;
            }
            return typeof thing.authority === 'string'
                && typeof thing.fragment === 'string'
                && typeof thing.path === 'string'
                && typeof thing.query === 'string'
                && typeof thing.scheme === 'string';
        };
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
                    if (this._authority && this._path && this.scheme === 'file') {
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






define(__m[30/*vs/base/common/uuid*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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

define(__m[2/*vs/base/common/winjs.base*/], __M([128/*vs/base/common/winjs.base.raw*/,18/*vs/base/common/errors*/]), function (winjs, __Errors__) {
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





define(__m[33/*vs/base/common/async*/], __M([0/*require*/,1/*exports*/,18/*vs/base/common/errors*/,5/*vs/base/common/platform*/,2/*vs/base/common/winjs.base*/,76/*vs/base/common/cancellation*/,13/*vs/base/common/lifecycle*/,4/*vs/base/common/event*/]), function (require, exports, errors, platform, winjs_base_1, cancellation_1, lifecycle_1, event_1) {
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
define(__m[113/*vs/base/node/crypto*/], __M([0/*require*/,1/*exports*/,25/*fs*/,38/*crypto*/,2/*vs/base/common/winjs.base*/,33/*vs/base/common/async*/]), function (require, exports, fs, crypto, winjs_base_1, async_1) {
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
define(__m[26/*vs/base/node/event*/], __M([0/*require*/,1/*exports*/,4/*vs/base/common/event*/]), function (require, exports, event_1) {
    'use strict';
    function fromEventEmitter(emitter, eventName, map) {
        if (map === void 0) { map = function (id) { return id; }; }
        var fn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return result.fire(map.apply(void 0, args));
        };
        var onFirstListenerAdd = function () { return emitter.on(eventName, fn); };
        var onLastListenerRemove = function () { return emitter.removeListener(eventName, fn); };
        var result = new event_1.Emitter({ onFirstListenerAdd: onFirstListenerAdd, onLastListenerRemove: onLastListenerRemove });
        return result.event;
    }
    exports.fromEventEmitter = fromEventEmitter;
    ;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[74/*vs/base/node/flow*/], __M([0/*require*/,1/*exports*/,75/*assert*/]), function (require, exports, assert) {
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
define(__m[36/*vs/base/node/extfs*/], __M([0/*require*/,1/*exports*/,30/*vs/base/common/uuid*/,16/*vs/base/common/strings*/,5/*vs/base/common/platform*/,74/*vs/base/node/flow*/,25/*fs*/,7/*path*/]), function (require, exports, uuid, strings, platform, flow, fs, paths) {
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
define(__m[78/*vs/base/node/id*/], __M([0/*require*/,1/*exports*/,127/*getmac*/,38/*crypto*/,2/*vs/base/common/winjs.base*/,18/*vs/base/common/errors*/,30/*vs/base/common/uuid*/,31/*os*/]), function (require, exports, getmac, crypto, winjs_base_1, errors, uuid, os_1) {
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
define(__m[81/*vs/base/node/paths*/], __M([0/*require*/,1/*exports*/,22/*vs/base/common/uri*/]), function (require, exports, uri_1) {
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
define(__m[51/*vs/base/node/pfs*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,36/*vs/base/node/extfs*/,19/*vs/base/common/paths*/,7/*path*/,33/*vs/base/common/async*/,25/*fs*/,5/*vs/base/common/platform*/,4/*vs/base/common/event*/]), function (require, exports, winjs_base_1, extfs, paths, path_1, async_1, fs, platform, event_1) {
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
define(__m[85/*vs/base/node/proxy*/], __M([0/*require*/,1/*exports*/,89/*url*/,6/*vs/base/common/types*/,126/*http-proxy-agent*/,125/*https-proxy-agent*/]), function (require, exports, url_1, types_1, HttpProxyAgent, HttpsProxyAgent) {
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
define(__m[20/*vs/base/parts/ipc/common/ipc*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,13/*vs/base/common/lifecycle*/,4/*vs/base/common/event*/]), function (require, exports, winjs_base_1, lifecycle_1, event_1) {
    'use strict';
    var MessageType;
    (function (MessageType) {
        MessageType[MessageType["RequestCommon"] = 0] = "RequestCommon";
        MessageType[MessageType["RequestCancel"] = 1] = "RequestCancel";
        MessageType[MessageType["ResponseInitialize"] = 2] = "ResponseInitialize";
        MessageType[MessageType["ResponseSuccess"] = 3] = "ResponseSuccess";
        MessageType[MessageType["ResponseProgress"] = 4] = "ResponseProgress";
        MessageType[MessageType["ResponseError"] = 5] = "ResponseError";
        MessageType[MessageType["ResponseErrorObj"] = 6] = "ResponseErrorObj";
    })(MessageType || (MessageType = {}));
    function isResponse(messageType) {
        return messageType >= MessageType.ResponseInitialize;
    }
    var State;
    (function (State) {
        State[State["Uninitialized"] = 0] = "Uninitialized";
        State[State["Idle"] = 1] = "Idle";
    })(State || (State = {}));
    var ChannelServer = (function () {
        function ChannelServer(protocol) {
            var _this = this;
            this.protocol = protocol;
            this.channels = Object.create(null);
            this.activeRequests = Object.create(null);
            this.protocolListener = this.protocol.onMessage(function (r) { return _this.onMessage(r); });
            this.protocol.send({ type: MessageType.ResponseInitialize });
        }
        ChannelServer.prototype.registerChannel = function (channelName, channel) {
            this.channels[channelName] = channel;
        };
        ChannelServer.prototype.onMessage = function (request) {
            switch (request.type) {
                case MessageType.RequestCommon:
                    this.onCommonRequest(request);
                    break;
                case MessageType.RequestCancel:
                    this.onCancelRequest(request);
                    break;
            }
        };
        ChannelServer.prototype.onCommonRequest = function (request) {
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
                _this.protocol.send({ id: id, data: data, type: MessageType.ResponseSuccess });
                delete _this.activeRequests[request.id];
            }, function (data) {
                if (data instanceof Error) {
                    _this.protocol.send({
                        id: id, data: {
                            message: data.message,
                            name: data.name,
                            stack: data.stack ? data.stack.split('\n') : void 0
                        }, type: MessageType.ResponseError
                    });
                }
                else {
                    _this.protocol.send({ id: id, data: data, type: MessageType.ResponseErrorObj });
                }
                delete _this.activeRequests[request.id];
            }, function (data) {
                _this.protocol.send({ id: id, data: data, type: MessageType.ResponseProgress });
            });
            this.activeRequests[request.id] = lifecycle_1.toDisposable(function () { return requestPromise.cancel(); });
        };
        ChannelServer.prototype.onCancelRequest = function (request) {
            var disposable = this.activeRequests[request.id];
            if (disposable) {
                disposable.dispose();
                delete this.activeRequests[request.id];
            }
        };
        ChannelServer.prototype.dispose = function () {
            var _this = this;
            this.protocolListener.dispose();
            this.protocolListener = null;
            Object.keys(this.activeRequests).forEach(function (id) {
                _this.activeRequests[id].dispose();
            });
            this.activeRequests = null;
        };
        return ChannelServer;
    }());
    exports.ChannelServer = ChannelServer;
    var ChannelClient = (function () {
        function ChannelClient(protocol) {
            var _this = this;
            this.protocol = protocol;
            this.state = State.Uninitialized;
            this.activeRequests = [];
            this.bufferedRequests = [];
            this.handlers = Object.create(null);
            this.lastRequestId = 0;
            this.protocolListener = this.protocol.onMessage(function (r) { return _this.onMessage(r); });
        }
        ChannelClient.prototype.getChannel = function (channelName) {
            var _this = this;
            var call = function (command, arg) { return _this.request(channelName, command, arg); };
            return { call: call };
        };
        ChannelClient.prototype.request = function (channelName, name, arg) {
            var _this = this;
            var request = {
                raw: {
                    id: this.lastRequestId++,
                    type: MessageType.RequestCommon,
                    channelName: channelName,
                    name: name,
                    arg: arg
                }
            };
            var activeRequest = this.state === State.Uninitialized
                ? this.bufferRequest(request)
                : this.doRequest(request);
            this.activeRequests.push(activeRequest);
            activeRequest
                .then(null, function (_) { return null; })
                .done(function () { return _this.activeRequests = _this.activeRequests.filter(function (i) { return i !== activeRequest; }); });
            return activeRequest;
        };
        ChannelClient.prototype.doRequest = function (request) {
            var _this = this;
            var id = request.raw.id;
            return new winjs_base_1.Promise(function (c, e, p) {
                _this.handlers[id] = function (response) {
                    switch (response.type) {
                        case MessageType.ResponseSuccess:
                            delete _this.handlers[id];
                            c(response.data);
                            break;
                        case MessageType.ResponseError:
                            delete _this.handlers[id];
                            var error = new Error(response.data.message);
                            error.stack = response.data.stack;
                            error.name = response.data.name;
                            e(error);
                            break;
                        case MessageType.ResponseErrorObj:
                            delete _this.handlers[id];
                            e(response.data);
                            break;
                        case MessageType.ResponseProgress:
                            p(response.data);
                            break;
                    }
                };
                _this.send(request.raw);
            }, function () { return _this.send({ id: id, type: MessageType.RequestCancel }); });
        };
        ChannelClient.prototype.bufferRequest = function (request) {
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
        ChannelClient.prototype.onMessage = function (response) {
            if (!isResponse(response.type)) {
                return;
            }
            if (this.state === State.Uninitialized && response.type === MessageType.ResponseInitialize) {
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
        ChannelClient.prototype.send = function (raw) {
            try {
                this.protocol.send(raw);
            }
            catch (err) {
            }
        };
        ChannelClient.prototype.dispose = function () {
            this.protocolListener.dispose();
            this.protocolListener = null;
            this.activeRequests.forEach(function (r) { return r.cancel(); });
            this.activeRequests = [];
        };
        return ChannelClient;
    }());
    exports.ChannelClient = ChannelClient;
    /**
     * An `IPCServer` is both a channel server and a routing channel
     * client.
     *
     * As the owner of a protocol, you should extend both this
     * and the `IPCClient` classes to get IPC implementations
     * for your protocol.
     */
    var IPCServer = (function () {
        function IPCServer(onDidClientConnect) {
            var _this = this;
            this.channels = Object.create(null);
            this.channelClients = Object.create(null);
            this.onClientAdded = new event_1.Emitter();
            onDidClientConnect(function (_a) {
                var protocol = _a.protocol, onDidClientDisconnect = _a.onDidClientDisconnect;
                var onFirstMessage = event_1.once(protocol.onMessage);
                onFirstMessage(function (id) {
                    var channelServer = new ChannelServer(protocol);
                    var channelClient = new ChannelClient(protocol);
                    Object.keys(_this.channels)
                        .forEach(function (name) { return channelServer.registerChannel(name, _this.channels[name]); });
                    _this.channelClients[id] = channelClient;
                    _this.onClientAdded.fire(id);
                    onDidClientDisconnect(function () {
                        channelServer.dispose();
                        channelClient.dispose();
                        delete _this.channelClients[id];
                    });
                });
            });
        }
        IPCServer.prototype.getChannel = function (channelName, router) {
            var _this = this;
            var call = function (command, arg) {
                var id = router.route(command, arg);
                if (!id) {
                    return winjs_base_1.TPromise.wrapError('Client id should be provided');
                }
                return _this.getClient(id).then(function (client) { return client.getChannel(channelName).call(command, arg); });
            };
            return { call: call };
        };
        IPCServer.prototype.registerChannel = function (channelName, channel) {
            this.channels[channelName] = channel;
        };
        IPCServer.prototype.getClient = function (clientId) {
            var _this = this;
            var client = this.channelClients[clientId];
            if (client) {
                return winjs_base_1.TPromise.as(client);
            }
            return new winjs_base_1.TPromise(function (c) {
                var onClient = event_1.once(event_1.filterEvent(_this.onClientAdded.event, function (id) { return id === clientId; }));
                onClient(function () { return c(_this.channelClients[clientId]); });
            });
        };
        IPCServer.prototype.dispose = function () {
            this.channels = null;
            this.channelClients = null;
            this.onClientAdded.dispose();
        };
        return IPCServer;
    }());
    exports.IPCServer = IPCServer;
    /**
     * An `IPCClient` is both a channel client and a channel server.
     *
     * As the owner of a protocol, you should extend both this
     * and the `IPCClient` classes to get IPC implementations
     * for your protocol.
     */
    var IPCClient = (function () {
        function IPCClient(protocol, id) {
            protocol.send(id);
            this.channelClient = new ChannelClient(protocol);
            this.channelServer = new ChannelServer(protocol);
        }
        IPCClient.prototype.getChannel = function (channelName) {
            return this.channelClient.getChannel(channelName);
        };
        IPCClient.prototype.registerChannel = function (channelName, channel) {
            this.channelServer.registerChannel(channelName, channel);
        };
        IPCClient.prototype.dispose = function () {
            this.channelClient.dispose();
            this.channelClient = null;
            this.channelServer.dispose();
            this.channelServer = null;
        };
        return IPCClient;
    }());
    exports.IPCClient = IPCClient;
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
    function eventToCall(event, serializer) {
        if (serializer === void 0) { serializer = function (t) { return t; }; }
        var disposable;
        return new winjs_base_1.Promise(function (c, e, p) { return disposable = event(function (t) { return p(serializer(t)); }); }, function () { return disposable.dispose(); });
    }
    exports.eventToCall = eventToCall;
    function eventFromCall(channel, name, arg, deserializer) {
        if (arg === void 0) { arg = null; }
        if (deserializer === void 0) { deserializer = function (t) { return t; }; }
        var promise;
        var emitter = new event_1.Emitter({
            onFirstListenerAdd: function () {
                promise = channel.call(name, arg)
                    .then(null, function (err) { return null; }, function (e) { return emitter.fire(deserializer(e)); });
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
define(__m[97/*vs/base/parts/ipc/common/ipc.electron*/], __M([0/*require*/,1/*exports*/,13/*vs/base/common/lifecycle*/,4/*vs/base/common/event*/]), function (require, exports, lifecycle_1, event_1) {
    "use strict";
    var Protocol = (function () {
        function Protocol(sender, onMessageEvent) {
            this.sender = sender;
            this.onMessageEvent = onMessageEvent;
            var emitter = new event_1.Emitter();
            onMessageEvent(function (msg) { return emitter.fire(msg); });
            this._onMessage = emitter.event;
        }
        Object.defineProperty(Protocol.prototype, "onMessage", {
            get: function () { return this._onMessage; },
            enumerable: true,
            configurable: true
        });
        Protocol.prototype.send = function (message) {
            try {
                this.sender.send('ipc:message', message);
            }
            catch (e) {
            }
        };
        Protocol.prototype.dispose = function () {
            this.listener = lifecycle_1.dispose(this.listener);
        };
        return Protocol;
    }());
    exports.Protocol = Protocol;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





define(__m[98/*vs/base/parts/ipc/electron-main/ipc.electron-main*/], __M([0/*require*/,1/*exports*/,4/*vs/base/common/event*/,26/*vs/base/node/event*/,20/*vs/base/parts/ipc/common/ipc*/,97/*vs/base/parts/ipc/common/ipc.electron*/,14/*electron*/]), function (require, exports, event_1, event_2, ipc_1, ipc_electron_1, electron_1) {
    "use strict";
    function createScopedOnMessageEvent(senderId) {
        var onMessage = event_2.fromEventEmitter(electron_1.ipcMain, 'ipc:message', function (event, message) { return ({ event: event, message: message }); });
        var onMessageFromSender = event_1.filterEvent(onMessage, function (_a) {
            var event = _a.event;
            return event.sender.getId() === senderId;
        });
        return event_1.mapEvent(onMessageFromSender, function (_a) {
            var message = _a.message;
            return message;
        });
    }
    var Server = (function (_super) {
        __extends(Server, _super);
        function Server() {
            _super.call(this, Server.getOnDidClientConnect());
        }
        Server.getOnDidClientConnect = function () {
            var onHello = event_2.fromEventEmitter(electron_1.ipcMain, 'ipc:hello', function (_a) {
                var sender = _a.sender;
                return sender;
            });
            return event_1.mapEvent(onHello, function (webContents) {
                var onMessage = createScopedOnMessageEvent(webContents.getId());
                var protocol = new ipc_electron_1.Protocol(webContents, onMessage);
                var onDidClientDisconnect = event_2.fromEventEmitter(webContents, 'destroyed');
                return { protocol: protocol, onDidClientDisconnect: onDidClientDisconnect };
            });
        };
        return Server;
    }(ipc_1.IPCServer));
    exports.Server = Server;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





define(__m[100/*vs/base/parts/ipc/node/ipc.net*/], __M([0/*require*/,1/*exports*/,124/*net*/,2/*vs/base/common/winjs.base*/,4/*vs/base/common/event*/,26/*vs/base/node/event*/,20/*vs/base/parts/ipc/common/ipc*/]), function (require, exports, net_1, winjs_base_1, event_1, event_2, ipc_1) {
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
            var buffer = null;
            var emitter = new event_1.Emitter();
            var onRawData = event_2.fromEventEmitter(socket, 'data', function (data) { return data; });
            onRawData(function (data) {
                var lastIndex = 0;
                var index = 0;
                while ((index = bufferIndexOf(data, 0, lastIndex)) < data.length) {
                    var dataToParse = data.slice(lastIndex, index);
                    if (buffer) {
                        emitter.fire(JSON.parse(Buffer.concat([buffer, dataToParse]).toString('utf8')));
                        buffer = null;
                    }
                    else {
                        emitter.fire(JSON.parse(dataToParse.toString('utf8')));
                    }
                    lastIndex = index + 1;
                }
                if (index - lastIndex > 0) {
                    var dataToBuffer = data.slice(lastIndex, index);
                    if (buffer) {
                        buffer = Buffer.concat([buffer, dataToBuffer]);
                    }
                    else {
                        buffer = dataToBuffer;
                    }
                }
            });
            this._onMessage = emitter.event;
        }
        Object.defineProperty(Protocol.prototype, "onMessage", {
            get: function () { return this._onMessage; },
            enumerable: true,
            configurable: true
        });
        Protocol.prototype.send = function (message) {
            try {
                this.socket.write(JSON.stringify(message));
                this.socket.write(Protocol.Boundary);
            }
            catch (e) {
            }
        };
        Protocol.Boundary = new Buffer([0]);
        return Protocol;
    }());
    var Server = (function (_super) {
        __extends(Server, _super);
        function Server(server) {
            _super.call(this, Server.toClientConnectionEvent(server));
            this.server = server;
        }
        Server.toClientConnectionEvent = function (server) {
            var onConnection = event_2.fromEventEmitter(server, 'connection');
            return event_1.mapEvent(onConnection, function (socket) { return ({
                protocol: new Protocol(socket),
                onDidClientDisconnect: event_1.once(event_2.fromEventEmitter(socket, 'close'))
            }); });
        };
        Server.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.server.close();
            this.server = null;
        };
        return Server;
    }(ipc_1.IPCServer));
    exports.Server = Server;
    var Client = (function (_super) {
        __extends(Client, _super);
        function Client(socket, id) {
            var _this = this;
            _super.call(this, new Protocol(socket), id);
            this.socket = socket;
            this._onClose = new event_1.Emitter();
            socket.once('close', function () { return _this._onClose.fire(); });
        }
        Object.defineProperty(Client.prototype, "onClose", {
            get: function () { return this._onClose.event; },
            enumerable: true,
            configurable: true
        });
        Client.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.socket.end();
            this.socket = null;
        };
        return Client;
    }(ipc_1.IPCClient));
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
    function connect(hook, clientId) {
        return new winjs_base_1.TPromise(function (c, e) {
            var socket = net_1.createConnection(hook, function () {
                socket.removeListener('error', e);
                c(new Client(socket, clientId));
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
define(__m[49/*vs/code/electron-main/paths*/], __M([0/*require*/,1/*exports*/,28/*original-fs*/,7/*path*/,17/*vs/base/common/arrays*/,16/*vs/base/common/strings*/,19/*vs/base/common/paths*/,5/*vs/base/common/platform*/,6/*vs/base/common/types*/]), function (require, exports, fs, path, arrays, strings, paths, platform, types) {
    'use strict';
    function validatePaths(args) {
        // Realpath/normalize paths and watch out for goto line mode
        var paths = doValidatePaths(args._, args.goto);
        // Update environment
        args._ = paths;
        args.diff = args.diff && paths.length === 2;
        return args;
    }
    exports.validatePaths = validatePaths;
    function doValidatePaths(args, gotoLineMode) {
        var cwd = process.env['VSCODE_CWD'] || process.cwd();
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
                return toPath(parsedPath);
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
        if (!path) {
            throw new Error('Format for `--goto` should be: `FILE:LINE(:COLUMN)`');
        }
        return {
            path: path,
            line: line !== null ? line : void 0,
            column: column !== null ? column : line !== null ? 1 : void 0 // if we have a line, make sure column is also set
        };
    }
    exports.parseLineAndColumnAware = parseLineAndColumnAware;
    function toPath(p) {
        var segments = [p.path];
        if (types.isNumber(p.line)) {
            segments.push(String(p.line));
        }
        if (types.isNumber(p.column)) {
            segments.push(String(p.column));
        }
        return segments.join(':');
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[110/*vs/code/node/sharedProcess*/], __M([0/*require*/,1/*exports*/,46/*child_process*/,22/*vs/base/common/uri*/,8/*vs/base/common/objects*/,2/*vs/base/common/winjs.base*/]), function (require, exports, cp, uri_1, objects_1, winjs_base_1) {
    "use strict";
    var boostrapPath = uri_1.default.parse(require.toUrl('bootstrap')).fsPath;
    function _spawnSharedProcess(initData, options) {
        var execArgv = [];
        var env = objects_1.assign({}, process.env, {
            AMD_ENTRYPOINT: 'vs/code/node/sharedProcessMain',
            ELECTRON_NO_ASAR: '1'
        });
        if (options.allowOutput) {
            env['VSCODE_ALLOW_IO'] = 'true';
        }
        if (options.debugPort) {
            execArgv.push("--debug=" + options.debugPort);
        }
        var result = cp.fork(boostrapPath, ['--type=SharedProcess'], { env: env, execArgv: execArgv });
        return result;
    }
    function spawnSharedProcess(initData, options) {
        if (options === void 0) { options = {}; }
        var spawnCount = 0;
        var child;
        var promise;
        var spawn = function () {
            if (++spawnCount > 10) {
                return;
            }
            child = _spawnSharedProcess(initData, options);
            promise = new winjs_base_1.TPromise(function (c, e) {
                // handshake
                child.once('message', function () {
                    child.send(initData);
                    c({
                        dispose: function () {
                            if (child) {
                                child.removeListener('exit', spawn);
                                child.kill();
                                child = null;
                            }
                        }
                    });
                });
            });
            child.on('exit', spawn);
        };
        spawn();
        return promise;
    }
    exports.spawnSharedProcess = spawnSharedProcess;
});

define(__m[56/*vs/nls!vs/base/common/json*/], __M([10/*vs/nls*/,9/*vs/nls!vs/code/electron-main/main*/]), function(nls, data) { return nls.create("vs/base/common/json", data); });
define(__m[59/*vs/base/common/json*/], __M([0/*require*/,1/*exports*/,56/*vs/nls!vs/base/common/json*/]), function (require, exports, nls_1) {
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
define(__m[60/*vs/base/node/config*/], __M([0/*require*/,1/*exports*/,25/*fs*/,7/*path*/,8/*vs/base/common/objects*/,13/*vs/base/common/lifecycle*/,4/*vs/base/common/event*/,59/*vs/base/common/json*/]), function (require, exports, fs, path, objects, lifecycle_1, event_1, json) {
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

define(__m[61/*vs/nls!vs/base/common/keybinding*/], __M([10/*vs/nls*/,9/*vs/nls!vs/code/electron-main/main*/]), function(nls, data) { return nls.create("vs/base/common/keybinding", data); });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[62/*vs/base/common/keybinding*/], __M([0/*require*/,1/*exports*/,61/*vs/nls!vs/base/common/keybinding*/,5/*vs/base/common/platform*/,50/*vs/base/common/keyCodes*/]), function (require, exports, nls, defaultPlatform, keyCodes_1) {
    'use strict';
    var KeybindingLabels = (function () {
        function KeybindingLabels() {
        }
        /**
         * @internal
         */
        KeybindingLabels.getUserSettingsKeybindingRegex = function () {
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
         * @internal
         */
        KeybindingLabels.toUserSettingsLabel = function (value, Platform) {
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
        /**
         * @internal
         */
        KeybindingLabels.fromUserSettingsLabel = function (input, Platform) {
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
                chord = KeybindingLabels.fromUserSettingsLabel(input.substring(firstSpaceIdx), Platform);
            }
            else {
                key = input;
            }
            var keyCode = keyCodes_1.USER_SETTINGS.toKeyCode(key);
            var result = 0;
            if (ctrlCmd) {
                result |= 32768 /* CtrlCmd */;
            }
            if (shift) {
                result |= 16384 /* Shift */;
            }
            if (alt) {
                result |= 8192 /* Alt */;
            }
            if (winCtrl) {
                result |= 4096 /* WinCtrl */;
            }
            result |= keyCode;
            return keyCodes_1.KeyChord(result, chord);
        };
        /**
         * Format the binding to a format appropiate for rendering in the UI
         * @internal
         */
        KeybindingLabels._toUSLabel = function (keybinding, Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            return _asString(keybinding.value, (Platform.isMacintosh ? MacUIKeyLabelProvider.INSTANCE : ClassicUIKeyLabelProvider.INSTANCE), Platform);
        };
        /**
         * Format the binding to a format appropiate for placing in an aria-label.
         * @internal
         */
        KeybindingLabels._toUSAriaLabel = function (keybinding, Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            return _asString(keybinding.value, AriaKeyLabelProvider.INSTANCE, Platform);
        };
        /**
         * Format the binding to a format appropiate for rendering in the UI
         * @internal
         */
        KeybindingLabels._toUSHTMLLabel = function (keybinding, Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            return _asHTML(keybinding.value, (Platform.isMacintosh ? MacUIKeyLabelProvider.INSTANCE : ClassicUIKeyLabelProvider.INSTANCE), Platform);
        };
        /**
         * Format the binding to a format appropiate for rendering in the UI
         * @internal
         */
        KeybindingLabels.toCustomLabel = function (keybinding, labelProvider, Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            return _asString(keybinding.value, labelProvider, Platform);
        };
        /**
         * Format the binding to a format appropiate for rendering in the UI
         * @internal
         */
        KeybindingLabels.toCustomHTMLLabel = function (keybinding, labelProvider, Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            return _asHTML(keybinding.value, labelProvider, Platform);
        };
        /**
         * This prints the binding in a format suitable for electron's accelerators.
         * See https://github.com/electron/electron/blob/master/docs/api/accelerator.md
         * @internal
         */
        KeybindingLabels._toElectronAccelerator = function (keybinding, Platform) {
            if (Platform === void 0) { Platform = defaultPlatform; }
            if (keyCodes_1.BinaryKeybindings.hasChord(keybinding.value)) {
                // Electron cannot handle chords
                return null;
            }
            var keyCode = keyCodes_1.BinaryKeybindings.extractKeyCode(keybinding.value);
            if (keyCode >= 93 /* NUMPAD_0 */ && keyCode <= 108 /* NUMPAD_DIVIDE */) {
                // Electron cannot handle numpad keys
                return null;
            }
            return _asString(keybinding.value, ElectronAcceleratorLabelProvider.INSTANCE, Platform);
        };
        KeybindingLabels._cachedKeybindingRegex = null;
        return KeybindingLabels;
    }());
    exports.KeybindingLabels = KeybindingLabels;
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
                case 16 /* UpArrow */:
                    return 'Up';
                case 18 /* DownArrow */:
                    return 'Down';
                case 15 /* LeftArrow */:
                    return 'Left';
                case 17 /* RightArrow */:
                    return 'Right';
            }
            return keyCodes_1.KeyCodeUtils.toString(keyCode);
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
                case 15 /* LeftArrow */:
                    return MacUIKeyLabelProvider.leftArrowUnicodeLabel;
                case 16 /* UpArrow */:
                    return MacUIKeyLabelProvider.upArrowUnicodeLabel;
                case 17 /* RightArrow */:
                    return MacUIKeyLabelProvider.rightArrowUnicodeLabel;
                case 18 /* DownArrow */:
                    return MacUIKeyLabelProvider.downArrowUnicodeLabel;
            }
            return keyCodes_1.KeyCodeUtils.toString(keyCode);
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
            return keyCodes_1.KeyCodeUtils.toString(keyCode);
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
            return keyCodes_1.KeyCodeUtils.toString(keyCode);
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
            return keyCodes_1.USER_SETTINGS.fromKeyCode(keyCode);
        };
        UserSettingsKeyLabelProvider.INSTANCE = new UserSettingsKeyLabelProvider();
        return UserSettingsKeyLabelProvider;
    }());
    function _asString(keybinding, labelProvider, Platform) {
        var result = [], ctrlCmd = keyCodes_1.BinaryKeybindings.hasCtrlCmd(keybinding), shift = keyCodes_1.BinaryKeybindings.hasShift(keybinding), alt = keyCodes_1.BinaryKeybindings.hasAlt(keybinding), winCtrl = keyCodes_1.BinaryKeybindings.hasWinCtrl(keybinding), keyCode = keyCodes_1.BinaryKeybindings.extractKeyCode(keybinding);
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
        if (keyCodes_1.BinaryKeybindings.hasChord(keybinding)) {
            return actualResult + ' ' + _asString(keyCodes_1.BinaryKeybindings.extractChordPart(keybinding), labelProvider, Platform);
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
        var result = [], ctrlCmd = keyCodes_1.BinaryKeybindings.hasCtrlCmd(keybinding), shift = keyCodes_1.BinaryKeybindings.hasShift(keybinding), alt = keyCodes_1.BinaryKeybindings.hasAlt(keybinding), winCtrl = keyCodes_1.BinaryKeybindings.hasWinCtrl(keybinding), keyCode = keyCodes_1.BinaryKeybindings.extractKeyCode(keybinding);
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
        if (keyCodes_1.BinaryKeybindings.hasChord(keybinding)) {
            chordTo = _asHTML(keyCodes_1.BinaryKeybindings.extractChordPart(keybinding), labelProvider, Platform, true);
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

define(__m[63/*vs/nls!vs/base/common/severity*/], __M([10/*vs/nls*/,9/*vs/nls!vs/code/electron-main/main*/]), function(nls, data) { return nls.create("vs/base/common/severity", data); });
define(__m[64/*vs/base/common/severity*/], __M([0/*require*/,1/*exports*/,63/*vs/nls!vs/base/common/severity*/,16/*vs/base/common/strings*/]), function (require, exports, nls, strings) {
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

define(__m[58/*vs/nls!vs/code/electron-main/menus*/], __M([10/*vs/nls*/,9/*vs/nls!vs/code/electron-main/main*/]), function(nls, data) { return nls.create("vs/code/electron-main/menus", data); });
define(__m[66/*vs/nls!vs/code/electron-main/windows*/], __M([10/*vs/nls*/,9/*vs/nls!vs/code/electron-main/main*/]), function(nls, data) { return nls.create("vs/code/electron-main/windows", data); });
define(__m[67/*vs/nls!vs/platform/configuration/common/configurationRegistry*/], __M([10/*vs/nls*/,9/*vs/nls!vs/code/electron-main/main*/]), function(nls, data) { return nls.create("vs/platform/configuration/common/configurationRegistry", data); });
define(__m[68/*vs/nls!vs/platform/environment/node/argv*/], __M([10/*vs/nls*/,9/*vs/nls!vs/code/electron-main/main*/]), function(nls, data) { return nls.create("vs/platform/environment/node/argv", data); });
define(__m[69/*vs/nls!vs/platform/extensions/common/extensionsRegistry*/], __M([10/*vs/nls*/,9/*vs/nls!vs/code/electron-main/main*/]), function(nls, data) { return nls.create("vs/platform/extensions/common/extensionsRegistry", data); });
define(__m[70/*vs/nls!vs/platform/request/node/request*/], __M([10/*vs/nls*/,9/*vs/nls!vs/code/electron-main/main*/]), function(nls, data) { return nls.create("vs/platform/request/node/request", data); });
define(__m[71/*vs/nls!vs/platform/telemetry/common/telemetryService*/], __M([10/*vs/nls*/,9/*vs/nls!vs/code/electron-main/main*/]), function(nls, data) { return nls.create("vs/platform/telemetry/common/telemetryService", data); });
define(__m[72/*vs/nls!vs/workbench/parts/git/electron-main/askpassService*/], __M([10/*vs/nls*/,9/*vs/nls!vs/code/electron-main/main*/]), function(nls, data) { return nls.create("vs/workbench/parts/git/electron-main/askpassService", data); });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[73/*vs/platform/backup/common/backupIpc*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    'use strict';
    var BackupChannel = (function () {
        function BackupChannel(service) {
            this.service = service;
        }
        BackupChannel.prototype.call = function (command, arg) {
            switch (command) {
                case 'getBackupPath': return this.service.getBackupPath(arg);
            }
        };
        return BackupChannel;
    }());
    exports.BackupChannel = BackupChannel;
    var BackupChannelClient = (function () {
        function BackupChannelClient(channel) {
            this.channel = channel;
        }
        BackupChannelClient.prototype.getBackupPath = function (windowId) {
            return this.channel.call('getBackupPath', windowId);
        };
        return BackupChannelClient;
    }());
    exports.BackupChannelClient = BackupChannelClient;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[45/*vs/platform/environment/node/argv*/], __M([0/*require*/,1/*exports*/,31/*os*/,120/*minimist*/,75/*assert*/,17/*vs/base/common/arrays*/,68/*vs/nls!vs/platform/environment/node/argv*/]), function (require, exports, os, minimist, assert, arrays_1, nls_1) {
    "use strict";
    var options = {
        string: [
            'locale',
            'user-data-dir',
            'extensions-dir',
            'extensionDevelopmentPath',
            'extensionTestsPath',
            'install-extension',
            'uninstall-extension',
            'debugBrkPluginHost',
            'debugPluginHost',
            'open-url'
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
            'list-extensions',
            'show-versions',
            'nolazy'
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
            'disable-extensions': 'disableExtensions',
            'extensions-dir': 'extensionHomePath'
        }
    };
    function validate(args) {
        if (args.goto) {
            args._.forEach(function (arg) { return assert(/^(\w:)?[^:]+(:\d*){0,2}$/.test(arg), nls_1.localize(0, null)); });
        }
        return args;
    }
    function stripAppPath(argv) {
        var index = arrays_1.firstIndex(argv, function (a) { return !/^-/.test(a); });
        if (index > -1) {
            return argv.slice(0, index).concat(argv.slice(index + 1));
        }
    }
    /**
     * Use this to parse raw code process.argv such as: `Electron . --verbose --wait`
     */
    function parseMainProcessArgv(processArgv) {
        var args = processArgv.slice(1);
        // If dev, remove the first non-option argument: it's the app location
        if (process.env['VSCODE_DEV']) {
            args = stripAppPath(args);
        }
        return validate(parseArgs(args));
    }
    exports.parseMainProcessArgv = parseMainProcessArgv;
    /**
     * Use this to parse raw code CLI process.argv such as: `Electron cli.js . --verbose --wait`
     */
    function parseCLIProcessArgv(processArgv) {
        var args = processArgv.slice(2);
        if (process.env['VSCODE_DEV']) {
            args = stripAppPath(args);
        }
        return validate(parseArgs(args));
    }
    exports.parseCLIProcessArgv = parseCLIProcessArgv;
    /**
     * Use this to parse code arguments such as `--verbose --wait`
     */
    function parseArgs(args) {
        return minimist(args, options);
    }
    exports.parseArgs = parseArgs;
    exports.optionsHelp = {
        '-d, --diff': nls_1.localize(1, null),
        '-g, --goto': nls_1.localize(2, null),
        '--locale <locale>': nls_1.localize(3, null),
        '-n, --new-window': nls_1.localize(4, null),
        '-p, --performance': nls_1.localize(5, null),
        '-r, --reuse-window': nls_1.localize(6, null),
        '--user-data-dir <dir>': nls_1.localize(7, null),
        '--verbose': nls_1.localize(8, null),
        '-w, --wait': nls_1.localize(9, null),
        '--extensions-dir <dir>': nls_1.localize(10, null),
        '--list-extensions': nls_1.localize(11, null),
        '--show-versions': nls_1.localize(12, null),
        '--install-extension <ext>': nls_1.localize(13, null),
        '--uninstall-extension <ext>': nls_1.localize(14, null),
        '--disable-extensions': nls_1.localize(15, null),
        '--disable-gpu': nls_1.localize(16, null),
        '-v, --version': nls_1.localize(17, null),
        '-h, --help': nls_1.localize(18, null)
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
    function buildHelpMessage(fullName, name, version) {
        var columns = process.stdout.isTTY ? process.stdout.columns : 80;
        var executable = "" + name + (os.platform() === 'win32' ? '.exe' : '');
        return fullName + " " + version + "\n\n" + nls_1.localize(19, null) + ": " + executable + " [" + nls_1.localize(20, null) + "] [" + nls_1.localize(21, null) + "...]\n\n" + nls_1.localize(22, null) + ":\n" + formatOptions(exports.optionsHelp, columns);
    }
    exports.buildHelpMessage = buildHelpMessage;
});






define(__m[43/*vs/platform/instantiation/common/descriptors*/], __M([0/*require*/,1/*exports*/,18/*vs/base/common/errors*/]), function (require, exports, errors_1) {
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

define(__m[3/*vs/platform/instantiation/common/instantiation*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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
define(__m[44/*vs/platform/backup/common/backup*/], __M([0/*require*/,1/*exports*/,3/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
    "use strict";
    exports.IBackupMainService = instantiation_1.createDecorator('backupMainService');
    exports.IBackupService = instantiation_1.createDecorator('backupService');
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[12/*vs/platform/configuration/common/configuration*/], __M([0/*require*/,1/*exports*/,3/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
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
define(__m[11/*vs/platform/environment/common/environment*/], __M([0/*require*/,1/*exports*/,3/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
    "use strict";
    exports.IEnvironmentService = instantiation_1.createDecorator('environmentService');
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
define(__m[23/*vs/code/electron-main/log*/], __M([0/*require*/,1/*exports*/,3/*vs/platform/instantiation/common/instantiation*/,11/*vs/platform/environment/common/environment*/]), function (require, exports, instantiation_1, environment_1) {
    'use strict';
    exports.ILogService = instantiation_1.createDecorator('logService');
    var MainLogService = (function () {
        function MainLogService(environmentService) {
            this.environmentService = environmentService;
        }
        MainLogService.prototype.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (this.environmentService.verbose) {
                console.log.apply(console, ["\u001B[93m[main " + new Date().toLocaleTimeString() + "]\u001B[0m"].concat(args));
            }
        };
        MainLogService = __decorate([
            __param(0, environment_1.IEnvironmentService)
        ], MainLogService);
        return MainLogService;
    }());
    exports.MainLogService = MainLogService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[24/*vs/code/electron-main/storage*/], __M([0/*require*/,1/*exports*/,7/*path*/,28/*original-fs*/,11/*vs/platform/environment/common/environment*/,3/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, path, fs, environment_1, instantiation_1) {
    'use strict';
    exports.IStorageService = instantiation_1.createDecorator('storageService');
    var StorageService = (function () {
        function StorageService(environmentService) {
            this.environmentService = environmentService;
            this.database = null;
            this.dbPath = path.join(environmentService.userDataPath, 'storage.json');
        }
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
            this.database[key] = data;
            this.save();
        };
        StorageService.prototype.removeItem = function (key) {
            if (!this.database) {
                this.database = this.load();
            }
            if (this.database[key]) {
                delete this.database[key];
                this.save();
            }
        };
        StorageService.prototype.load = function () {
            try {
                return JSON.parse(fs.readFileSync(this.dbPath).toString()); // invalid JSON or permission issue can happen here
            }
            catch (error) {
                if (this.environmentService.verbose) {
                    console.error(error);
                }
                return {};
            }
        };
        StorageService.prototype.save = function () {
            try {
                fs.writeFileSync(this.dbPath, JSON.stringify(this.database, null, 4)); // permission issue can happen here
            }
            catch (error) {
                if (this.environmentService.verbose) {
                    console.error(error);
                }
            }
        };
        StorageService = __decorate([
            __param(0, environment_1.IEnvironmentService)
        ], StorageService);
        return StorageService;
    }());
    exports.StorageService = StorageService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[83/*vs/platform/backup/electron-main/backupMainService*/], __M([0/*require*/,1/*exports*/,17/*vs/base/common/arrays*/,25/*fs*/,7/*path*/,38/*crypto*/,5/*vs/base/common/platform*/,36/*vs/base/node/extfs*/,11/*vs/platform/environment/common/environment*/,2/*vs/base/common/winjs.base*/]), function (require, exports, arrays, fs, path, crypto, platform, extfs, environment_1, winjs_base_1) {
    "use strict";
    var BackupMainService = (function () {
        function BackupMainService(environmentService) {
            this.backupHome = environmentService.backupHome;
            this.workspacesJsonPath = environmentService.backupWorkspacesPath;
            this.mapWindowToBackupFolder = Object.create(null);
            this.loadSync();
        }
        BackupMainService.prototype.getWorkspaceBackupPaths = function () {
            return this.backups.folderWorkspaces.slice(0); // return a copy
        };
        BackupMainService.prototype.getEmptyWorkspaceBackupPaths = function () {
            return this.backups.emptyWorkspaces.slice(0); // return a copy
        };
        BackupMainService.prototype.getBackupPath = function (windowId) {
            if (!this.mapWindowToBackupFolder[windowId]) {
                throw new Error("Unknown backup workspace for window " + windowId);
            }
            return winjs_base_1.TPromise.as(path.join(this.backupHome, this.mapWindowToBackupFolder[windowId]));
        };
        BackupMainService.prototype.registerWindowForBackupsSync = function (windowId, isEmptyWorkspace, backupFolder, workspacePath) {
            // Generate a new folder if this is a new empty workspace
            if (isEmptyWorkspace && !backupFolder) {
                backupFolder = this.getRandomEmptyWorkspaceId();
            }
            this.mapWindowToBackupFolder[windowId] = isEmptyWorkspace ? backupFolder : this.getWorkspaceHash(workspacePath);
            this.pushBackupPathsSync(isEmptyWorkspace ? backupFolder : workspacePath, isEmptyWorkspace);
        };
        BackupMainService.prototype.pushBackupPathsSync = function (workspaceIdentifier, isEmptyWorkspace) {
            var array = isEmptyWorkspace ? this.backups.emptyWorkspaces : this.backups.folderWorkspaces;
            if (this.indexOf(workspaceIdentifier, isEmptyWorkspace) === -1) {
                array.push(workspaceIdentifier);
                this.saveSync();
            }
            return workspaceIdentifier;
        };
        BackupMainService.prototype.removeBackupPathSync = function (workspaceIdentifier, isEmptyWorkspace) {
            var array = isEmptyWorkspace ? this.backups.emptyWorkspaces : this.backups.folderWorkspaces;
            if (!array) {
                return;
            }
            var index = this.indexOf(workspaceIdentifier, isEmptyWorkspace);
            if (index === -1) {
                return;
            }
            array.splice(index, 1);
            this.saveSync();
        };
        BackupMainService.prototype.indexOf = function (workspaceIdentifier, isEmptyWorkspace) {
            var _this = this;
            var array = isEmptyWorkspace ? this.backups.emptyWorkspaces : this.backups.folderWorkspaces;
            if (!array) {
                return -1;
            }
            if (isEmptyWorkspace) {
                return array.indexOf(workspaceIdentifier);
            }
            // for backup workspaces, sanitize the workspace identifier to accomodate for case insensitive file systems
            var sanitizedWorkspaceIdentifier = this.sanitizePath(workspaceIdentifier);
            return arrays.firstIndex(array, function (id) { return _this.sanitizePath(id) === sanitizedWorkspaceIdentifier; });
        };
        BackupMainService.prototype.loadSync = function () {
            var backups;
            try {
                backups = JSON.parse(fs.readFileSync(this.workspacesJsonPath, 'utf8').toString()); // invalid JSON or permission issue can happen here
            }
            catch (error) {
                backups = Object.create(null);
            }
            // Ensure folderWorkspaces is a string[]
            if (backups.folderWorkspaces) {
                var fws = backups.folderWorkspaces;
                if (!Array.isArray(fws) || fws.some(function (f) { return typeof f !== 'string'; })) {
                    backups.folderWorkspaces = [];
                }
            }
            else {
                backups.folderWorkspaces = [];
            }
            // Ensure emptyWorkspaces is a string[]
            if (backups.emptyWorkspaces) {
                var fws = backups.emptyWorkspaces;
                if (!Array.isArray(fws) || fws.some(function (f) { return typeof f !== 'string'; })) {
                    backups.emptyWorkspaces = [];
                }
            }
            else {
                backups.emptyWorkspaces = [];
            }
            this.backups = this.dedupeFolderWorkspaces(backups);
            // Validate backup workspaces
            this.validateBackupWorkspaces(backups);
        };
        BackupMainService.prototype.dedupeFolderWorkspaces = function (backups) {
            var _this = this;
            // De-duplicate folder workspaces, don't worry about cleaning them up any duplicates as
            // they will be removed when there are no backups.
            backups.folderWorkspaces = arrays.distinct(backups.folderWorkspaces, function (ws) { return _this.sanitizePath(ws); });
            return backups;
        };
        BackupMainService.prototype.validateBackupWorkspaces = function (backups) {
            var _this = this;
            var staleBackupWorkspaces = [];
            // Validate Folder Workspaces
            backups.folderWorkspaces.forEach(function (workspacePath) {
                var backupPath = path.join(_this.backupHome, _this.getWorkspaceHash(workspacePath));
                var hasBackups = _this.hasBackupsSync(backupPath);
                var missingWorkspace = hasBackups && !fs.existsSync(workspacePath);
                // If the folder has no backups, make sure to delete it
                // If the folder has backups, but the target workspace is missing, convert backups to empty ones
                if (!hasBackups || missingWorkspace) {
                    staleBackupWorkspaces.push({ workspaceIdentifier: workspacePath, backupPath: backupPath, isEmptyWorkspace: false });
                    if (missingWorkspace) {
                        var identifier = _this.pushBackupPathsSync(_this.getRandomEmptyWorkspaceId(), true /* is empty workspace */);
                        var newEmptyWorkspaceBackupPath = path.join(path.dirname(backupPath), identifier);
                        try {
                            fs.renameSync(backupPath, newEmptyWorkspaceBackupPath);
                        }
                        catch (ex) {
                            console.error("Backup: Could not rename backup folder for missing workspace: " + ex.toString());
                            _this.removeBackupPathSync(identifier, true);
                        }
                    }
                }
            });
            // Validate Empty Workspaces
            backups.emptyWorkspaces.forEach(function (backupFolder) {
                var backupPath = path.join(_this.backupHome, backupFolder);
                if (!_this.hasBackupsSync(backupPath)) {
                    staleBackupWorkspaces.push({ workspaceIdentifier: backupFolder, backupPath: backupPath, isEmptyWorkspace: true });
                }
            });
            // Clean up stale backups
            staleBackupWorkspaces.forEach(function (staleBackupWorkspace) {
                var backupPath = staleBackupWorkspace.backupPath, workspaceIdentifier = staleBackupWorkspace.workspaceIdentifier, isEmptyWorkspace = staleBackupWorkspace.isEmptyWorkspace;
                try {
                    extfs.delSync(backupPath);
                }
                catch (ex) {
                    console.error("Backup: Could not delete stale backup: " + ex.toString());
                }
                _this.removeBackupPathSync(workspaceIdentifier, isEmptyWorkspace);
            });
        };
        BackupMainService.prototype.hasBackupsSync = function (backupPath) {
            try {
                var backupSchemas = extfs.readdirSync(backupPath);
                if (backupSchemas.length === 0) {
                    return false; // empty backups
                }
                return backupSchemas.some(function (backupSchema) {
                    try {
                        return extfs.readdirSync(path.join(backupPath, backupSchema)).length > 0;
                    }
                    catch (error) {
                        return false; // invalid folder
                    }
                });
            }
            catch (error) {
                return false; // backup path does not exist
            }
        };
        BackupMainService.prototype.saveSync = function () {
            try {
                // The user data directory must exist so only the Backup directory needs to be checked.
                if (!fs.existsSync(this.backupHome)) {
                    fs.mkdirSync(this.backupHome);
                }
                fs.writeFileSync(this.workspacesJsonPath, JSON.stringify(this.backups));
            }
            catch (ex) {
                console.error("Backup: Could not save workspaces.json: " + ex.toString());
            }
        };
        BackupMainService.prototype.getRandomEmptyWorkspaceId = function () {
            return (Date.now() + Math.round(Math.random() * 1000)).toString();
        };
        BackupMainService.prototype.sanitizePath = function (p) {
            return platform.isLinux ? p : p.toLowerCase();
        };
        BackupMainService.prototype.getWorkspaceHash = function (workspacePath) {
            return crypto.createHash('md5').update(this.sanitizePath(workspacePath)).digest('hex');
        };
        BackupMainService = __decorate([
            __param(0, environment_1.IEnvironmentService)
        ], BackupMainService);
        return BackupMainService;
    }());
    exports.BackupMainService = BackupMainService;
});






define(__m[84/*vs/platform/files/common/files*/], __M([0/*require*/,1/*exports*/,19/*vs/base/common/paths*/,80/*vs/base/common/events*/,5/*vs/base/common/platform*/,3/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, paths, events, platform_1, instantiation_1) {
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
            return this._changes.some(function (change) {
                if (change.type !== type) {
                    return false;
                }
                // For deleted also return true when deleted folder is parent of target path
                if (type === FileChangeType.DELETED) {
                    return isEqual(resource.fsPath, change.resource.fsPath) || isParent(resource.fsPath, change.resource.fsPath);
                }
                return isEqual(resource.fsPath, change.resource.fsPath);
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
    function isEqual(path1, path2) {
        var identityEquals = (path1 === path2);
        if (platform_1.isLinux || identityEquals) {
            return identityEquals;
        }
        return path1.toLowerCase() === path2.toLowerCase();
    }
    exports.isEqual = isEqual;
    function isParent(path, candidate) {
        if (!platform_1.isLinux) {
            path = path.toLowerCase();
            candidate = candidate.toLowerCase();
        }
        return path.indexOf(candidate + paths.nativeSep) === 0;
    }
    exports.isParent = isParent;
    (function (FileOperationResult) {
        FileOperationResult[FileOperationResult["FILE_IS_BINARY"] = 0] = "FILE_IS_BINARY";
        FileOperationResult[FileOperationResult["FILE_IS_DIRECTORY"] = 1] = "FILE_IS_DIRECTORY";
        FileOperationResult[FileOperationResult["FILE_NOT_FOUND"] = 2] = "FILE_NOT_FOUND";
        FileOperationResult[FileOperationResult["FILE_NOT_MODIFIED_SINCE"] = 3] = "FILE_NOT_MODIFIED_SINCE";
        FileOperationResult[FileOperationResult["FILE_MODIFIED_SINCE"] = 4] = "FILE_MODIFIED_SINCE";
        FileOperationResult[FileOperationResult["FILE_MOVE_CONFLICT"] = 5] = "FILE_MOVE_CONFLICT";
        FileOperationResult[FileOperationResult["FILE_READ_ONLY"] = 6] = "FILE_READ_ONLY";
        FileOperationResult[FileOperationResult["FILE_TOO_LARGE"] = 7] = "FILE_TOO_LARGE";
        FileOperationResult[FileOperationResult["FILE_INVALID_PATH"] = 8] = "FILE_INVALID_PATH";
    })(exports.FileOperationResult || (exports.FileOperationResult = {}));
    var FileOperationResult = exports.FileOperationResult;
    exports.MAX_FILE_SIZE = 50 * 1024 * 1024;
    exports.AutoSaveConfiguration = {
        OFF: 'off',
        AFTER_DELAY: 'afterDelay',
        ON_FOCUS_CHANGE: 'onFocusChange',
        ON_WINDOW_CHANGE: 'onWindowChange'
    };
    exports.CONTENT_CHANGE_EVENT_BUFFER_DELAY = 1000;
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
        cp852: {
            labelLong: 'Central European (CP 852)',
            labelShort: 'CP 852',
            order: 18
        },
        windows1251: {
            labelLong: 'Cyrillic (Windows 1251)',
            labelShort: 'Windows 1251',
            order: 19
        },
        cp866: {
            labelLong: 'Cyrillic (CP 866)',
            labelShort: 'CP 866',
            order: 20
        },
        iso88595: {
            labelLong: 'Cyrillic (ISO 8859-5)',
            labelShort: 'ISO 8859-5',
            order: 21
        },
        koi8r: {
            labelLong: 'Cyrillic (KOI8-R)',
            labelShort: 'KOI8-R',
            order: 22
        },
        koi8u: {
            labelLong: 'Cyrillic (KOI8-U)',
            labelShort: 'KOI8-U',
            order: 23
        },
        iso885913: {
            labelLong: 'Estonian (ISO 8859-13)',
            labelShort: 'ISO 8859-13',
            order: 24
        },
        windows1253: {
            labelLong: 'Greek (Windows 1253)',
            labelShort: 'Windows 1253',
            order: 25
        },
        iso88597: {
            labelLong: 'Greek (ISO 8859-7)',
            labelShort: 'ISO 8859-7',
            order: 26
        },
        windows1255: {
            labelLong: 'Hebrew (Windows 1255)',
            labelShort: 'Windows 1255',
            order: 27
        },
        iso88598: {
            labelLong: 'Hebrew (ISO 8859-8)',
            labelShort: 'ISO 8859-8',
            order: 28
        },
        iso885910: {
            labelLong: 'Nordic (ISO 8859-10)',
            labelShort: 'ISO 8859-10',
            order: 29
        },
        iso885916: {
            labelLong: 'Romanian (ISO 8859-16)',
            labelShort: 'ISO 8859-16',
            order: 30
        },
        windows1254: {
            labelLong: 'Turkish (Windows 1254)',
            labelShort: 'Windows 1254',
            order: 31
        },
        iso88599: {
            labelLong: 'Turkish (ISO 8859-9)',
            labelShort: 'ISO 8859-9',
            order: 32
        },
        windows1258: {
            labelLong: 'Vietnamese (Windows 1258)',
            labelShort: 'Windows 1258',
            order: 33
        },
        gbk: {
            labelLong: 'Chinese (GBK)',
            labelShort: 'GBK',
            order: 34
        },
        gb18030: {
            labelLong: 'Chinese (GB18030)',
            labelShort: 'GB18030',
            order: 35
        },
        cp950: {
            labelLong: 'Traditional Chinese (Big5)',
            labelShort: 'Big5',
            order: 36
        },
        big5hkscs: {
            labelLong: 'Traditional Chinese (Big5-HKSCS)',
            labelShort: 'Big5-HKSCS',
            order: 37
        },
        shiftjis: {
            labelLong: 'Japanese (Shift JIS)',
            labelShort: 'Shift JIS',
            order: 38
        },
        eucjp: {
            labelLong: 'Japanese (EUC-JP)',
            labelShort: 'EUC-JP',
            order: 39
        },
        euckr: {
            labelLong: 'Korean (EUC-KR)',
            labelShort: 'EUC-KR',
            order: 40
        },
        windows874: {
            labelLong: 'Thai (Windows 874)',
            labelShort: 'Windows 874',
            order: 41
        },
        iso885911: {
            labelLong: 'Latin/Thai (ISO 8859-11)',
            labelShort: 'ISO 8859-11',
            order: 42
        },
        'koi8-ru': {
            labelLong: 'Cyrillic (KOI8-RU)',
            labelShort: 'KOI8-RU',
            order: 43
        },
        'koi8-t': {
            labelLong: 'Tajik (KOI8-T)',
            labelShort: 'KOI8-T',
            order: 44
        },
        GB2312: {
            labelLong: 'Simplified Chinese (GB 2312)',
            labelShort: 'GB 2312',
            order: 45
        }
    };
});

define(__m[54/*vs/platform/instantiation/common/serviceCollection*/], __M([0/*require*/,1/*exports*/,17/*vs/base/common/arrays*/]), function (require, exports, arrays_1) {
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

define(__m[86/*vs/platform/instantiation/common/instantiationService*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,18/*vs/base/common/errors*/,6/*vs/base/common/types*/,53/*vs/base/common/assert*/,107/*vs/base/common/graph*/,43/*vs/platform/instantiation/common/descriptors*/,3/*vs/platform/instantiation/common/instantiation*/,54/*vs/platform/instantiation/common/serviceCollection*/]), function (require, exports, winjs_base_1, errors_1, types_1, assert, graph_1, descriptors_1, instantiation_1, serviceCollection_1) {
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

define(__m[87/*vs/platform/keybinding/common/keybinding*/], __M([0/*require*/,1/*exports*/,3/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
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

define(__m[88/*vs/platform/lifecycle/common/lifecycle*/], __M([0/*require*/,1/*exports*/,3/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[35/*vs/platform/package*/], __M([0/*require*/,1/*exports*/,7/*path*/,22/*vs/base/common/uri*/]), function (require, exports, path, uri_1) {
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
define(__m[90/*vs/platform/environment/node/http*/], __M([0/*require*/,1/*exports*/,78/*vs/base/node/id*/,35/*vs/platform/package*/]), function (require, exports, id_1, package_1) {
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

define(__m[21/*vs/platform/platform*/], __M([0/*require*/,1/*exports*/,6/*vs/base/common/types*/,53/*vs/base/common/assert*/]), function (require, exports, Types, Assert) {
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

define(__m[42/*vs/platform/jsonschemas/common/jsonContributionRegistry*/], __M([0/*require*/,1/*exports*/,21/*vs/platform/platform*/,99/*vs/base/common/eventEmitter*/]), function (require, exports, platform, eventEmitter_1) {
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

define(__m[93/*vs/platform/extensions/common/extensionsRegistry*/], __M([0/*require*/,1/*exports*/,69/*vs/nls!vs/platform/extensions/common/extensionsRegistry*/,18/*vs/base/common/errors*/,64/*vs/base/common/severity*/,42/*vs/platform/jsonschemas/common/jsonContributionRegistry*/,21/*vs/platform/platform*/,4/*vs/base/common/event*/]), function (require, exports, nls, errors_1, severity_1, jsonContributionRegistry_1, platform_1, event_1) {
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

define(__m[27/*vs/platform/configuration/common/configurationRegistry*/], __M([0/*require*/,1/*exports*/,67/*vs/nls!vs/platform/configuration/common/configurationRegistry*/,4/*vs/base/common/event*/,21/*vs/platform/platform*/,8/*vs/base/common/objects*/,6/*vs/base/common/types*/,93/*vs/platform/extensions/common/extensionsRegistry*/,42/*vs/platform/jsonschemas/common/jsonContributionRegistry*/]), function (require, exports, nls, event_1, platform_1, objects, types, extensionsRegistry_1, jsonContributionRegistry_1) {
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

define(__m[95/*vs/platform/configuration/common/model*/], __M([0/*require*/,1/*exports*/,21/*vs/platform/platform*/,27/*vs/platform/configuration/common/configurationRegistry*/]), function (require, exports, platform_1, configurationRegistry_1) {
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










define(__m[96/*vs/platform/configuration/node/configurationService*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,8/*vs/base/common/objects*/,95/*vs/platform/configuration/common/model*/,60/*vs/base/node/config*/,21/*vs/platform/platform*/,27/*vs/platform/configuration/common/configurationRegistry*/,13/*vs/base/common/lifecycle*/,12/*vs/platform/configuration/common/configuration*/,4/*vs/base/common/event*/,11/*vs/platform/environment/common/environment*/]), function (require, exports, winjs_base_1, objects, model_1, config_1, platform_1, configurationRegistry_1, lifecycle_1, configuration_1, event_1, environment_1) {
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
define(__m[15/*vs/platform/product*/], __M([0/*require*/,1/*exports*/,7/*path*/,22/*vs/base/common/uri*/]), function (require, exports, path, uri_1) {
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









define(__m[48/*vs/code/electron-main/window*/], __M([0/*require*/,1/*exports*/,7/*path*/,5/*vs/base/common/platform*/,8/*vs/base/common/objects*/,24/*vs/code/electron-main/storage*/,14/*electron*/,2/*vs/base/common/winjs.base*/,11/*vs/platform/environment/common/environment*/,23/*vs/code/electron-main/log*/,12/*vs/platform/configuration/common/configuration*/,45/*vs/platform/environment/node/argv*/,15/*vs/platform/product*/,90/*vs/platform/environment/node/http*/]), function (require, exports, path, platform, objects, storage_1, electron_1, winjs_base_1, environment_1, log_1, configuration_1, argv_1, product_1, http_1) {
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
        function VSCodeWindow(config, logService, environmentService, configurationService, storageService) {
            var _this = this;
            this.logService = logService;
            this.environmentService = environmentService;
            this.configurationService = configurationService;
            this.storageService = storageService;
            this.options = config;
            this._lastFocusTime = -1;
            this._readyState = ReadyState.NONE;
            this._extensionDevelopmentPath = config.extensionDevelopmentPath;
            this.whenReadyCallbacks = [];
            // Load window state
            this.restoreWindowState(config.state);
            // For VS theme we can show directly because background is white
            var themeId = this.storageService.getItem(VSCodeWindow.colorThemeStorageKey);
            var usesLightTheme = /vs($| )/.test(themeId);
            var usesHighContrastTheme = /hc-black($| )/.test(themeId) || (platform.isWindows && electron_1.systemPreferences.isInvertedColorScheme());
            // in case we are maximized or fullscreen, only show later after the call to maximize/fullscreen (see below)
            var isFullscreenOrMaximized = (this.currentWindowMode === WindowMode.Maximized || this.currentWindowMode === WindowMode.Fullscreen);
            var options = {
                width: this.windowState.width,
                height: this.windowState.height,
                x: this.windowState.x,
                y: this.windowState.y,
                backgroundColor: usesHighContrastTheme ? '#000000' : usesLightTheme ? '#FFFFFF' : platform.isMacintosh ? '#171717' : '#1E1E1E',
                minWidth: VSCodeWindow.MIN_WIDTH,
                minHeight: VSCodeWindow.MIN_HEIGHT,
                show: !isFullscreenOrMaximized,
                title: product_1.default.nameLong,
                webPreferences: {
                    'backgroundThrottling': false // by default if Code is in the background, intervals and timeouts get throttled
                }
            };
            if (platform.isLinux) {
                options.icon = path.join(this.environmentService.appRoot, 'resources/linux/code.png'); // Windows and Mac are better off using the embedded icon(s)
            }
            if (platform.isMacintosh && (!this.options.titleBarStyle || this.options.titleBarStyle === 'custom')) {
                var isDev = !this.environmentService.isBuilt || !!config.extensionDevelopmentPath;
                if (!isDev) {
                    options.titleBarStyle = 'hidden'; // not enabled when developing due to https://github.com/electron/electron/issues/3647
                    this.hiddenTitleBarStyle = true;
                }
            }
            // Create the browser window.
            this._win = new electron_1.BrowserWindow(options);
            this._id = this._win.id;
            // TODO@joao: hook this up to some initialization routine
            // this causes a race between setting the headers and doing
            // a request that needs them. chances are low
            http_1.getCommonHTTPHeaders().done(function (headers) {
                if (!_this._win) {
                    return;
                }
                var urls = ['https://marketplace.visualstudio.com/*', 'https://*.vsassets.io/*'];
                _this._win.webContents.session.webRequest.onBeforeSendHeaders({ urls: urls }, function (details, cb) {
                    cb({ cancel: false, requestHeaders: objects.assign(details.requestHeaders, headers) });
                });
            });
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
        VSCodeWindow.prototype.hasHiddenTitleBarStyle = function () {
            return this.hiddenTitleBarStyle;
        };
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
            // Window Fullscreen
            this._win.on('enter-full-screen', function () {
                _this.sendWhenReady('vscode:enterFullScreen');
            });
            this._win.on('leave-full-screen', function () {
                _this.sendWhenReady('vscode:leaveFullScreen');
            });
            // React to HC color scheme changes (Windows)
            if (platform.isWindows) {
                electron_1.systemPreferences.on('inverted-color-scheme-changed', function () {
                    if (electron_1.systemPreferences.isInvertedColorScheme()) {
                        _this.sendWhenReady('vscode:enterHighContrast');
                    }
                    else {
                        _this.sendWhenReady('vscode:leaveHighContrast');
                    }
                });
            }
            // Window Failed to load
            this._win.webContents.on('did-fail-load', function (event, errorCode, errorDescription) {
                console.warn('[electron event]: fail to load, ', errorDescription);
            });
            // Prevent any kind of navigation triggered by the user!
            // But do not touch this in dev version because it will prevent "Reload" from dev tools
            if (this.environmentService.isBuilt) {
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
            // Make sure to clear any previous edited state
            if (platform.isMacintosh && this._win.isDocumentEdited()) {
                this._win.setDocumentEdited(false);
            }
            // Load URL
            this._win.loadURL(this.getUrl(config));
            // Make window visible if it did not open in N seconds because this indicates an error
            if (!this.environmentService.isBuilt) {
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
            // Some configuration things get inherited if the window is being reloaded and we are
            // in plugin development mode. These options are all development related.
            if (this.isPluginDevelopmentHost && cli) {
                configuration.verbose = cli.verbose;
                configuration.debugPluginHost = cli.debugPluginHost;
                configuration.debugBrkPluginHost = cli.debugBrkPluginHost;
                configuration['extensions-dir'] = cli['extensions-dir'];
            }
            configuration.isInitialStartup = false; // since this is a reload
            // Load config
            this.load(configuration);
        };
        VSCodeWindow.prototype.getUrl = function (windowConfiguration) {
            var url = require.toUrl('vs/workbench/electron-browser/bootstrap/index.html');
            // Set zoomlevel
            var windowConfig = this.configurationService.getConfiguration('window');
            var zoomLevel = windowConfig && windowConfig.zoomLevel;
            if (typeof zoomLevel === 'number') {
                windowConfiguration.zoomLevel = zoomLevel;
            }
            // Set fullscreen state
            windowConfiguration.fullscreen = this._win.isFullScreen();
            // Set Accessibility Config
            windowConfiguration.highContrast = platform.isWindows && electron_1.systemPreferences.isInvertedColorScheme();
            windowConfiguration.accessibilitySupport = electron_1.app.isAccessibilitySupportEnabled();
            // Perf Counters
            windowConfiguration.perfStartTime = global.perfStartTime;
            windowConfiguration.perfWindowLoadTime = Date.now();
            // Config (combination of process.argv and window configuration)
            var environment = argv_1.parseArgs(process.argv);
            var config = objects.assign(environment, windowConfiguration);
            for (var key in config) {
                if (!config[key]) {
                    delete config[key]; // only send over properties that have a true value
                }
            }
            url += '?config=' + encodeURIComponent(JSON.stringify(config));
            return url;
        };
        VSCodeWindow.prototype.serializeWindowState = function () {
            if (this.win.isFullScreen()) {
                return {
                    mode: WindowMode.Fullscreen,
                    // still carry over window dimensions from previous sessions!
                    width: this.windowState.width,
                    height: this.windowState.height,
                    x: this.windowState.x,
                    y: this.windowState.y
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
                state.mode = WindowMode.Normal; // if we do not allow fullscreen, treat this state as normal window state
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
        VSCodeWindow.colorThemeStorageKey = 'theme';
        VSCodeWindow.MIN_WIDTH = 200;
        VSCodeWindow.MIN_HEIGHT = 120;
        VSCodeWindow = __decorate([
            __param(1, log_1.ILogService),
            __param(2, environment_1.IEnvironmentService),
            __param(3, configuration_1.IConfigurationService),
            __param(4, storage_1.IStorageService)
        ], VSCodeWindow);
        return VSCodeWindow;
    }());
    exports.VSCodeWindow = VSCodeWindow;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[39/*vs/code/electron-main/lifecycle*/], __M([0/*require*/,1/*exports*/,14/*electron*/,2/*vs/base/common/winjs.base*/,48/*vs/code/electron-main/window*/,11/*vs/platform/environment/common/environment*/,23/*vs/code/electron-main/log*/,24/*vs/code/electron-main/storage*/,4/*vs/base/common/event*/,3/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, electron_1, winjs_base_1, window_1, environment_1, log_1, storage_1, event_1, instantiation_1) {
    'use strict';
    exports.ILifecycleService = instantiation_1.createDecorator('lifecycleService');
    (function (UnloadReason) {
        UnloadReason[UnloadReason["CLOSE"] = 0] = "CLOSE";
        UnloadReason[UnloadReason["QUIT"] = 1] = "QUIT";
        UnloadReason[UnloadReason["RELOAD"] = 2] = "RELOAD";
        UnloadReason[UnloadReason["LOAD"] = 3] = "LOAD";
    })(exports.UnloadReason || (exports.UnloadReason = {}));
    var UnloadReason = exports.UnloadReason;
    var LifecycleService = (function () {
        function LifecycleService(environmentService, logService, storageService) {
            this.environmentService = environmentService;
            this.logService = logService;
            this.storageService = storageService;
            this._onBeforeQuit = new event_1.Emitter();
            this.onBeforeQuit = this._onBeforeQuit.event;
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
        LifecycleService.prototype.ready = function () {
            this.registerListeners();
        };
        LifecycleService.prototype.registerListeners = function () {
            var _this = this;
            // before-quit
            electron_1.app.on('before-quit', function (e) {
                _this.logService.log('Lifecycle#before-quit');
                if (!_this.quitRequested) {
                    _this._onBeforeQuit.fire(); // only send this if this is the first quit request we have
                }
                _this.quitRequested = true;
            });
            // window-all-closed
            electron_1.app.on('window-all-closed', function () {
                _this.logService.log('Lifecycle#window-all-closed');
                // Windows/Linux: we quit when all windows have closed
                // Mac: we only quit when quit was requested
                // --wait: we quit when all windows are closed
                if (_this.quitRequested || process.platform !== 'darwin' || _this.environmentService.wait) {
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
                _this.unload(vscodeWindow, UnloadReason.CLOSE).done(function (veto) {
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
        LifecycleService.prototype.unload = function (vscodeWindow, reason) {
            var _this = this;
            // Always allow to unload a window that is not yet ready
            if (vscodeWindow.readyState !== window_1.ReadyState.READY) {
                return winjs_base_1.TPromise.as(false);
            }
            this.logService.log('Lifecycle#unload()', vscodeWindow.id);
            return new winjs_base_1.TPromise(function (c) {
                var oneTimeEventToken = _this.oneTimeListenerTokenGenerator++;
                var okChannel = "vscode:ok" + oneTimeEventToken;
                var cancelChannel = "vscode:cancel" + oneTimeEventToken;
                electron_1.ipcMain.once(okChannel, function () {
                    c(false); // no veto
                });
                electron_1.ipcMain.once(cancelChannel, function () {
                    // Any cancellation also cancels a pending quit if present
                    if (_this.pendingQuitPromiseComplete) {
                        _this.pendingQuitPromiseComplete(true /* veto */);
                        _this.pendingQuitPromiseComplete = null;
                        _this.pendingQuitPromise = null;
                    }
                    c(true); // veto
                });
                vscodeWindow.send('vscode:beforeUnload', { okChannel: okChannel, cancelChannel: cancelChannel, reason: _this.quitRequested ? UnloadReason.QUIT : reason });
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
            __param(0, environment_1.IEnvironmentService),
            __param(1, log_1.ILogService),
            __param(2, storage_1.IStorageService)
        ], LifecycleService);
        return LifecycleService;
    }());
    exports.LifecycleService = LifecycleService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[34/*vs/code/electron-main/windows*/], __M([0/*require*/,1/*exports*/,7/*path*/,28/*original-fs*/,5/*vs/base/common/platform*/,66/*vs/nls!vs/code/electron-main/windows*/,19/*vs/base/common/paths*/,6/*vs/base/common/types*/,17/*vs/base/common/arrays*/,8/*vs/base/common/objects*/,44/*vs/platform/backup/common/backup*/,16/*vs/base/common/strings*/,11/*vs/platform/environment/common/environment*/,24/*vs/code/electron-main/storage*/,48/*vs/code/electron-main/window*/,14/*electron*/,49/*vs/code/electron-main/paths*/,39/*vs/code/electron-main/lifecycle*/,12/*vs/platform/configuration/common/configuration*/,23/*vs/code/electron-main/log*/,57/*vs/base/common/labels*/,3/*vs/platform/instantiation/common/instantiation*/,4/*vs/base/common/event*/,15/*vs/platform/product*/]), function (require, exports, path, fs, platform, nls, paths, types, arrays, objects_1, backup_1, strings_1, environment_1, storage_1, window_1, electron_1, paths_1, lifecycle_1, configuration_1, log_1, labels_1, instantiation_1, event_1, product_1) {
    'use strict';
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
    exports.IWindowsMainService = instantiation_1.createDecorator('windowsMainService');
    var WindowsManager = (function () {
        function WindowsManager(instantiationService, logService, storageService, environmentService, lifecycleService, backupService, configurationService) {
            this.instantiationService = instantiationService;
            this.logService = logService;
            this.storageService = storageService;
            this.environmentService = environmentService;
            this.lifecycleService = lifecycleService;
            this.backupService = backupService;
            this.configurationService = configurationService;
            this._onRecentPathsChange = new event_1.Emitter();
            this.onRecentPathsChange = this._onRecentPathsChange.event;
            this._onWindowReady = new event_1.Emitter();
            this.onWindowReady = this._onWindowReady.event;
            this._onWindowClose = new event_1.Emitter();
            this.onWindowClose = this._onWindowClose.event;
            this._onPathsOpen = new event_1.Emitter();
            this.onPathsOpen = this._onPathsOpen.event;
        }
        WindowsManager.prototype.ready = function (initialUserEnv) {
            this.registerListeners();
            this.initialUserEnv = initialUserEnv;
            this.windowsState = this.storageService.getItem(WindowsManager.windowsStateStorageKey) || { openedFolders: [] };
            this.updateWindowsJumpList();
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
                    _this.open({ cli: _this.environmentService.args, pathsToOpen: macOpenFiles, preferNewWindow: true /* dropping on the dock prefers to open in a new window */ });
                    macOpenFiles = [];
                    runningTimeout = null;
                }, 100);
            });
            electron_1.ipcMain.on('vscode:workbenchLoaded', function (event, windowId) {
                _this.logService.log('IPC#vscode-workbenchLoaded');
                var win = _this.getWindowById(windowId);
                if (win) {
                    win.setReady();
                    // Event
                    _this._onWindowReady.fire(win);
                }
            });
            electron_1.ipcMain.on('vscode:broadcast', function (event, windowId, target, broadcast) {
                if (broadcast.channel && !types.isUndefinedOrNull(broadcast.payload)) {
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
            // Update jump list when recent paths change
            this.onRecentPathsChange(function () { return _this.updateWindowsJumpList(); });
        };
        WindowsManager.prototype.onBroadcast = function (event, payload) {
            // Theme changes
            if (event === 'vscode:changeColorTheme' && typeof payload === 'string') {
                this.storageService.setItem(window_1.VSCodeWindow.colorThemeStorageKey, payload);
            }
        };
        WindowsManager.prototype.reload = function (win, cli) {
            // Only reload when the window has not vetoed this
            this.lifecycleService.unload(win, lifecycle_1.UnloadReason.RELOAD).done(function (veto) {
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
                    var iPath = _this.toIPath(pathToOpen, false, openConfig.cli && openConfig.cli.goto);
                    // Warn if the requested path to open does not exist
                    if (!iPath) {
                        var options = {
                            title: product_1.default.nameLong,
                            type: 'info',
                            buttons: [nls.localize(0, null)],
                            message: nls.localize(1, null),
                            detail: nls.localize(2, null, pathToOpen),
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
                var ignoreFileNotFound = openConfig.cli._.length > 0; // we assume the user wants to create this file from command line
                iPathsToOpen = this.cliToPaths(openConfig.cli, ignoreFileNotFound);
            }
            var foldersToOpen = arrays.distinct(iPathsToOpen.filter(function (iPath) { return iPath.workspacePath && !iPath.filePath; }).map(function (iPath) { return iPath.workspacePath; }), function (folder) { return platform.isLinux ? folder : folder.toLowerCase(); }); // prevent duplicates
            var foldersToRestore = (openConfig.initialStartup && !openConfig.cli.extensionDevelopmentPath) ? this.backupService.getWorkspaceBackupPaths() : [];
            var filesToOpen = [];
            var filesToDiff = [];
            var emptyToOpen = iPathsToOpen.filter(function (iPath) { return !iPath.workspacePath && !iPath.filePath; });
            var emptyToRestore = (openConfig.initialStartup && !openConfig.cli.extensionDevelopmentPath) ? this.backupService.getEmptyWorkspaceBackupPaths() : [];
            var filesToCreate = iPathsToOpen.filter(function (iPath) { return !!iPath.filePath && iPath.createFilePath; });
            // Diff mode needs special care
            var candidates = iPathsToOpen.filter(function (iPath) { return !!iPath.filePath && !iPath.createFilePath; });
            if (openConfig.diffMode) {
                if (candidates.length === 2) {
                    filesToDiff = candidates;
                }
                else {
                    emptyToOpen = [Object.create(null)]; // improper use of diffMode, open empty
                }
                foldersToOpen = []; // diff is always in empty workspace
                foldersToRestore = []; // diff is always in empty workspace
                filesToCreate = []; // diff ignores other files that do not exist
            }
            else {
                filesToOpen = candidates;
            }
            var openInNewWindow = openConfig.preferNewWindow || openConfig.forceNewWindow;
            // Handle files to open/diff or to create when we dont open a folder
            if (!foldersToOpen.length && (filesToOpen.length > 0 || filesToCreate.length > 0 || filesToDiff.length > 0)) {
                // const the user settings override how files are open in a new window or same window unless we are forced
                var openFilesInNewWindow = void 0;
                if (openConfig.forceNewWindow) {
                    openFilesInNewWindow = true;
                }
                else {
                    openFilesInNewWindow = openConfig.preferNewWindow;
                    if (openFilesInNewWindow && !openConfig.cli.extensionDevelopmentPath) {
                        var windowConfig = this.configurationService.getConfiguration('window');
                        if (windowConfig && !windowConfig.openFilesInNewWindow) {
                            openFilesInNewWindow = false; // do not open in new window if user configured this explicitly
                        }
                    }
                }
                // Open Files in last instance if any and flag tells us so
                var lastActiveWindow = this.getLastActiveWindow();
                if (!openFilesInNewWindow && lastActiveWindow) {
                    lastActiveWindow.focus();
                    lastActiveWindow.ready().then(function (readyWindow) {
                        readyWindow.send('vscode:openFiles', { filesToOpen: filesToOpen, filesToCreate: filesToCreate, filesToDiff: filesToDiff });
                    });
                    usedWindows.push(lastActiveWindow);
                }
                else {
                    var configuration = this.toConfiguration(openConfig, null, filesToOpen, filesToCreate, filesToDiff);
                    var browserWindow = this.openInBrowserWindow(configuration, true /* new window */);
                    usedWindows.push(browserWindow);
                    openInNewWindow = true; // any other folders to open must open in new window then
                }
                // Reset these because we handled them
                filesToOpen = [];
                filesToCreate = [];
                filesToDiff = [];
            }
            // Handle folders to open (instructed and to restore)
            var allFoldersToOpen = arrays.distinct(foldersToOpen.concat(foldersToRestore), function (folder) { return platform.isLinux ? folder : folder.toLowerCase(); }); // prevent duplicates
            if (allFoldersToOpen.length > 0) {
                // Check for existing instances
                var windowsOnWorkspacePath_1 = arrays.coalesce(allFoldersToOpen.map(function (folderToOpen) { return _this.findWindow(folderToOpen); }));
                if (windowsOnWorkspacePath_1.length > 0) {
                    var browserWindow = windowsOnWorkspacePath_1[0];
                    browserWindow.focus(); // just focus one of them
                    browserWindow.ready().then(function (readyWindow) {
                        readyWindow.send('vscode:openFiles', { filesToOpen: filesToOpen, filesToCreate: filesToCreate, filesToDiff: filesToDiff });
                    });
                    usedWindows.push(browserWindow);
                    // Reset these because we handled them
                    filesToOpen = [];
                    filesToCreate = [];
                    filesToDiff = [];
                    openInNewWindow = true; // any other folders to open must open in new window then
                }
                // Open remaining ones
                allFoldersToOpen.forEach(function (folderToOpen) {
                    if (windowsOnWorkspacePath_1.some(function (win) { return _this.isPathEqual(win.openedWorkspacePath, folderToOpen); })) {
                        return; // ignore folders that are already open
                    }
                    var configuration = _this.toConfiguration(openConfig, folderToOpen, filesToOpen, filesToCreate, filesToDiff);
                    var browserWindow = _this.openInBrowserWindow(configuration, openInNewWindow, openInNewWindow ? void 0 : openConfig.windowToUse);
                    usedWindows.push(browserWindow);
                    // Reset these because we handled them
                    filesToOpen = [];
                    filesToCreate = [];
                    filesToDiff = [];
                    openInNewWindow = true; // any other folders to open must open in new window then
                });
            }
            // Handle empty
            if (emptyToRestore.length > 0) {
                emptyToRestore.forEach(function (emptyWorkspaceBackupFolder) {
                    var configuration = _this.toConfiguration(openConfig);
                    var browserWindow = _this.openInBrowserWindow(configuration, true /* new window */, null, emptyWorkspaceBackupFolder);
                    usedWindows.push(browserWindow);
                    openInNewWindow = true; // any other folders to open must open in new window then
                });
            }
            else if (emptyToOpen.length > 0) {
                emptyToOpen.forEach(function () {
                    var configuration = _this.toConfiguration(openConfig);
                    var browserWindow = _this.openInBrowserWindow(configuration, openInNewWindow, openInNewWindow ? void 0 : openConfig.windowToUse);
                    usedWindows.push(browserWindow);
                    openInNewWindow = true; // any other folders to open must open in new window then
                });
            }
            // Remember in recent document list (unless this opens for extension development)
            // Also do not add paths when files are opened for diffing, only if opened individually
            if (!usedWindows.some(function (w) { return w.isPluginDevelopmentHost; }) && !openConfig.cli.diff) {
                var recentPaths_1 = [];
                iPathsToOpen.forEach(function (iPath) {
                    if (iPath.filePath || iPath.workspacePath) {
                        electron_1.app.addRecentDocument(iPath.filePath || iPath.workspacePath);
                        recentPaths_1.push({ path: iPath.filePath || iPath.workspacePath, isFile: !!iPath.filePath });
                    }
                });
                if (recentPaths_1.length) {
                    this.addToRecentPathsList(recentPaths_1);
                }
            }
            // Emit events
            this._onPathsOpen.fire(iPathsToOpen);
            return arrays.distinct(usedWindows);
        };
        WindowsManager.prototype.addToRecentPathsList = function (paths) {
            if (!paths || !paths.length) {
                return;
            }
            var mru = this.getRecentPathsList();
            paths.forEach(function (p) {
                var path = p.path, isFile = p.isFile;
                if (isFile) {
                    mru.files.unshift(path);
                    mru.files = arrays.distinct(mru.files, function (f) { return platform.isLinux ? f : f.toLowerCase(); });
                }
                else {
                    mru.folders.unshift(path);
                    mru.folders = arrays.distinct(mru.folders, function (f) { return platform.isLinux ? f : f.toLowerCase(); });
                }
                // Make sure its bounded
                mru.folders = mru.folders.slice(0, WindowsManager.MAX_TOTAL_RECENT_ENTRIES);
                mru.files = mru.files.slice(0, WindowsManager.MAX_TOTAL_RECENT_ENTRIES);
            });
            this.storageService.setItem(WindowsManager.recentPathsListStorageKey, mru);
            this._onRecentPathsChange.fire();
        };
        WindowsManager.prototype.removeFromRecentPathsList = function (arg1) {
            var paths;
            if (Array.isArray(arg1)) {
                paths = arg1;
            }
            else {
                paths = [arg1];
            }
            var mru = this.getRecentPathsList();
            var update = false;
            paths.forEach(function (path) {
                var index = mru.files.indexOf(path);
                if (index >= 0) {
                    mru.files.splice(index, 1);
                    update = true;
                }
                index = mru.folders.indexOf(path);
                if (index >= 0) {
                    mru.folders.splice(index, 1);
                    update = true;
                }
            });
            if (update) {
                this.storageService.setItem(WindowsManager.recentPathsListStorageKey, mru);
                this._onRecentPathsChange.fire();
            }
        };
        WindowsManager.prototype.clearRecentPathsList = function () {
            this.storageService.setItem(WindowsManager.recentPathsListStorageKey, { folders: [], files: [] });
            electron_1.app.clearRecentDocuments();
            // Event
            this._onRecentPathsChange.fire();
        };
        WindowsManager.prototype.getRecentPathsList = function (workspacePath, filesToOpen) {
            var files;
            var folders;
            // Get from storage
            var storedRecents = this.storageService.getItem(WindowsManager.recentPathsListStorageKey);
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
            return { files: files, folders: folders };
        };
        WindowsManager.prototype.getWindowUserEnv = function (openConfig) {
            return objects_1.assign({}, this.initialUserEnv, openConfig.userEnv || {});
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
            if (openConfig.cli._.length === 0 && !openConfig.cli.extensionTestsPath) {
                var workspaceToOpen = this.windowsState.lastPluginDevelopmentHostWindow && this.windowsState.lastPluginDevelopmentHostWindow.workspacePath;
                if (workspaceToOpen) {
                    openConfig.cli._ = [workspaceToOpen];
                }
            }
            // Make sure we are not asked to open a path that is already opened
            if (openConfig.cli._.length > 0) {
                res = WindowsManager.WINDOWS.filter(function (w) { return w.openedWorkspacePath && openConfig.cli._.indexOf(w.openedWorkspacePath) >= 0; });
                if (res.length) {
                    openConfig.cli._ = [];
                }
            }
            // Open it
            this.open({ cli: openConfig.cli, forceNewWindow: true, forceEmpty: openConfig.cli._.length === 0 });
        };
        WindowsManager.prototype.toConfiguration = function (config, workspacePath, filesToOpen, filesToCreate, filesToDiff) {
            var configuration = objects_1.mixin({}, config.cli); // inherit all properties from CLI
            configuration.appRoot = this.environmentService.appRoot;
            configuration.execPath = process.execPath;
            configuration.userEnv = this.getWindowUserEnv(config);
            configuration.isInitialStartup = config.initialStartup;
            configuration.workspacePath = workspacePath;
            configuration.filesToOpen = filesToOpen;
            configuration.filesToCreate = filesToCreate;
            configuration.filesToDiff = filesToDiff;
            configuration.nodeCachedDataDir = this.environmentService.isBuilt && this.environmentService.nodeCachedDataDir;
            return configuration;
        };
        WindowsManager.prototype.toIPath = function (anyPath, ignoreFileNotFound, gotoLineMode) {
            if (!anyPath) {
                return null;
            }
            var parsedPath;
            if (gotoLineMode) {
                parsedPath = paths_1.parseLineAndColumnAware(anyPath);
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
                            columnNumber: gotoLineMode ? parsedPath.column : void 0
                        } :
                        { workspacePath: candidate };
                }
            }
            catch (error) {
                this.removeFromRecentPathsList(candidate); // since file does not seem to exist anymore, remove from recent
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
            if (cli._.length > 0) {
                candidates = cli._;
            }
            else {
                var reopenFolders = void 0;
                if (this.lifecycleService.wasUpdated) {
                    reopenFolders = ReopenFoldersSetting.ALL; // always reopen all folders when an update was applied
                }
                else {
                    var windowConfig = this.configurationService.getConfiguration('window');
                    reopenFolders = (windowConfig && windowConfig.reopenFolders) || ReopenFoldersSetting.ONE;
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
            var iPaths = candidates.map(function (candidate) { return _this.toIPath(candidate, ignoreFileNotFound, cli.goto); }).filter(function (path) { return !!path; });
            if (iPaths.length > 0) {
                return iPaths;
            }
            // No path provided, return empty to open empty
            return [Object.create(null)];
        };
        WindowsManager.prototype.openInBrowserWindow = function (configuration, forceNewWindow, windowToUse, emptyWorkspaceBackupFolder) {
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
                var windowConfig = this.configurationService.getConfiguration('window');
                vscodeWindow = this.instantiationService.createInstance(window_1.VSCodeWindow, {
                    state: this.getNewWindowState(configuration),
                    extensionDevelopmentPath: configuration.extensionDevelopmentPath,
                    allowFullscreen: this.lifecycleService.wasUpdated || (windowConfig && windowConfig.restoreFullscreen),
                    titleBarStyle: windowConfig ? windowConfig.titleBarStyle : void 0
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
                    configuration.verbose = currentWindowConfig.verbose;
                    configuration.debugBrkPluginHost = currentWindowConfig.debugBrkPluginHost;
                    configuration.debugPluginHost = currentWindowConfig.debugPluginHost;
                    configuration['extensions-dir'] = currentWindowConfig['extensions-dir'];
                }
            }
            if (!configuration.extensionDevelopmentPath) {
                this.backupService.registerWindowForBackupsSync(vscodeWindow.id, !configuration.workspacePath, emptyWorkspaceBackupFolder, configuration.workspacePath);
            }
            // Only load when the window has not vetoed this
            this.lifecycleService.unload(vscodeWindow, lifecycle_1.UnloadReason.LOAD).done(function (veto) {
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
        WindowsManager.prototype.openFilePicker = function (forceNewWindow, path, window) {
            this.doPickAndOpen({ pickFiles: true, forceNewWindow: forceNewWindow, path: path, window: window });
        };
        WindowsManager.prototype.openFolderPicker = function (forceNewWindow, window) {
            this.doPickAndOpen({ pickFolders: true, forceNewWindow: forceNewWindow, window: window });
        };
        WindowsManager.prototype.openAccessibilityOptions = function () {
            var win = new electron_1.BrowserWindow({
                alwaysOnTop: true,
                skipTaskbar: true,
                resizable: false,
                width: 450,
                height: 300,
                show: true,
                title: nls.localize(3, null)
            });
            win.setMenuBarVisibility(false);
            win.loadURL('chrome://accessibility');
        };
        WindowsManager.prototype.doPickAndOpen = function (options) {
            var _this = this;
            this.getFileOrFolderPaths(options, function (paths) {
                if (paths && paths.length) {
                    _this.open({ cli: _this.environmentService.args, pathsToOpen: paths, forceNewWindow: options.forceNewWindow });
                }
            });
        };
        WindowsManager.prototype.getFileOrFolderPaths = function (options, clb) {
            var _this = this;
            var workingDir = options.path || this.storageService.getItem(WindowsManager.workingDirPickerStorageKey);
            var focussedWindow = options.window || this.getFocusedWindow();
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
            this.open({ cli: this.environmentService.args, forceNewWindow: true, forceEmpty: true });
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
                    title: product_1.default.nameLong,
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
                    title: product_1.default.nameLong,
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
            this._onWindowClose.fire(win.id);
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
        WindowsManager.prototype.toggleMenuBar = function (windowId) {
            // Update in settings
            var menuBarHidden = this.storageService.getItem(window_1.VSCodeWindow.menuBarHiddenKey, false);
            var newMenuBarHidden = !menuBarHidden;
            this.storageService.setItem(window_1.VSCodeWindow.menuBarHiddenKey, newMenuBarHidden);
            // Update across windows
            WindowsManager.WINDOWS.forEach(function (w) { return w.setMenuBarVisibility(!newMenuBarHidden); });
            // Inform user if menu bar is now hidden
            if (newMenuBarHidden) {
                var vscodeWindow = this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.send('vscode:showInfoMessage', nls.localize(13, null));
                }
            }
        };
        WindowsManager.prototype.updateWindowsJumpList = function () {
            if (!platform.isWindows) {
                return; // only on windows
            }
            var jumpList = [];
            // Tasks
            jumpList.push({
                type: 'tasks',
                items: [
                    {
                        type: 'task',
                        title: nls.localize(14, null),
                        description: nls.localize(15, null),
                        program: process.execPath,
                        args: '-n',
                        iconPath: process.execPath,
                        iconIndex: 0
                    }
                ]
            });
            // Recent Folders
            if (this.getRecentPathsList().folders.length > 0) {
                // The user might have meanwhile removed items from the jump list and we have to respect that
                // so we need to update our list of recent paths with the choice of the user to not add them again
                // Also: Windows will not show our custom category at all if there is any entry which was removed
                // by the user! See https://github.com/Microsoft/vscode/issues/15052
                this.removeFromRecentPathsList(electron_1.app.getJumpListSettings().removedItems.map(function (r) { return strings_1.trim(r.args, '"'); }));
                // Add entries
                jumpList.push({
                    type: 'custom',
                    name: nls.localize(16, null),
                    items: this.getRecentPathsList().folders.slice(0, 7 /* limit number of entries here */).map(function (folder) {
                        return {
                            type: 'task',
                            title: path.basename(folder) || folder,
                            description: nls.localize(17, null, path.basename(folder), labels_1.getPathLabel(path.dirname(folder))),
                            program: process.execPath,
                            args: "\"" + folder + "\"",
                            iconPath: 'explorer.exe',
                            iconIndex: 0
                        };
                    }).filter(function (i) { return !!i; })
                });
            }
            // Recent
            jumpList.push({
                type: 'recent' // this enables to show files in the "recent" category
            });
            try {
                electron_1.app.setJumpList(jumpList);
            }
            catch (error) {
                this.logService.log('#setJumpList', error); // since setJumpList is relatively new API, make sure to guard for errors
            }
        };
        WindowsManager.prototype.quit = function () {
            // If the user selected to exit from an extension development host window, do not quit, but just
            // close the window unless this is the last window that is opened.
            var vscodeWindow = this.getFocusedWindow();
            if (vscodeWindow && vscodeWindow.isPluginDevelopmentHost && this.getWindowCount() > 1) {
                vscodeWindow.win.close();
            }
            else {
                setTimeout(function () {
                    electron_1.app.quit();
                }, 10 /* delay to unwind callback stack (IPC) */);
            }
        };
        WindowsManager.MAX_TOTAL_RECENT_ENTRIES = 100;
        WindowsManager.recentPathsListStorageKey = 'openedPathsList';
        WindowsManager.workingDirPickerStorageKey = 'pickerWorkingDir';
        WindowsManager.windowsStateStorageKey = 'windowsState';
        WindowsManager.WINDOWS = [];
        WindowsManager = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, log_1.ILogService),
            __param(2, storage_1.IStorageService),
            __param(3, environment_1.IEnvironmentService),
            __param(4, lifecycle_1.ILifecycleService),
            __param(5, backup_1.IBackupMainService),
            __param(6, configuration_1.IConfigurationService)
        ], WindowsManager);
        return WindowsManager;
    }());
    exports.WindowsManager = WindowsManager;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/






define(__m[101/*vs/platform/environment/node/environmentService*/], __M([0/*require*/,1/*exports*/,38/*crypto*/,81/*vs/base/node/paths*/,31/*os*/,7/*path*/,22/*vs/base/common/uri*/,52/*vs/base/common/decorators*/,35/*vs/platform/package*/,15/*vs/platform/product*/]), function (require, exports, crypto, paths, os, path, uri_1, decorators_1, package_1, product_1) {
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

define(__m[40/*vs/platform/request/node/request*/], __M([0/*require*/,1/*exports*/,70/*vs/nls!vs/platform/request/node/request*/,3/*vs/platform/instantiation/common/instantiation*/,27/*vs/platform/configuration/common/configurationRegistry*/,21/*vs/platform/platform*/]), function (require, exports, nls_1, instantiation_1, configurationRegistry_1, platform_1) {
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

define(__m[32/*vs/platform/telemetry/common/telemetry*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,77/*vs/base/common/mime*/,19/*vs/base/common/paths*/,12/*vs/platform/configuration/common/configuration*/,3/*vs/platform/instantiation/common/instantiation*/,87/*vs/platform/keybinding/common/keybinding*/,88/*vs/platform/lifecycle/common/lifecycle*/]), function (require, exports, winjs_base_1, mime_1, paths, configuration_1, instantiation_1, keybinding_1, lifecycle_1) {
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
define(__m[104/*vs/platform/telemetry/common/telemetryIpc*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/]), function (require, exports, winjs_base_1) {
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









define(__m[105/*vs/platform/telemetry/common/telemetryService*/], __M([0/*require*/,1/*exports*/,71/*vs/nls!vs/platform/telemetry/common/telemetryService*/,16/*vs/base/common/strings*/,32/*vs/platform/telemetry/common/telemetry*/,3/*vs/platform/instantiation/common/instantiation*/,12/*vs/platform/configuration/common/configuration*/,27/*vs/platform/configuration/common/configurationRegistry*/,2/*vs/base/common/winjs.base*/,13/*vs/base/common/lifecycle*/,8/*vs/base/common/objects*/,21/*vs/platform/platform*/]), function (require, exports, nls_1, strings_1, telemetry_1, instantiation_1, configuration_1, configurationRegistry_1, winjs_base_1, lifecycle_1, objects_1, platform_1) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[106/*vs/platform/telemetry/node/commonProperties*/], __M([0/*require*/,1/*exports*/,5/*vs/base/common/platform*/,31/*os*/,2/*vs/base/common/winjs.base*/,30/*vs/base/common/uuid*/]), function (require, exports, Platform, os, winjs_base_1, uuid) {
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
define(__m[29/*vs/platform/update/common/update*/], __M([0/*require*/,1/*exports*/,3/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
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
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[108/*vs/code/electron-main/menus*/], __M([0/*require*/,1/*exports*/,58/*vs/nls!vs/code/electron-main/menus*/,5/*vs/base/common/platform*/,17/*vs/base/common/arrays*/,11/*vs/platform/environment/common/environment*/,14/*electron*/,34/*vs/code/electron-main/windows*/,12/*vs/platform/configuration/common/configuration*/,24/*vs/code/electron-main/storage*/,84/*vs/platform/files/common/files*/,32/*vs/platform/telemetry/common/telemetry*/,29/*vs/platform/update/common/update*/,50/*vs/base/common/keyCodes*/,62/*vs/base/common/keybinding*/,15/*vs/platform/product*/,33/*vs/base/common/async*/]), function (require, exports, nls, platform, arrays, environment_1, electron_1, windows_1, configuration_1, storage_1, files_1, telemetry_1, update_1, keyCodes_1, keybinding_1, product_1, async_1) {
    'use strict';
    var VSCodeMenu = (function () {
        function VSCodeMenu(storageService, updateService, configurationService, windowsService, environmentService, telemetryService) {
            var _this = this;
            this.storageService = storageService;
            this.updateService = updateService;
            this.configurationService = configurationService;
            this.windowsService = windowsService;
            this.environmentService = environmentService;
            this.telemetryService = telemetryService;
            this.actionIdKeybindingRequests = [];
            this.extensionViewlets = [];
            this.mapResolvedKeybindingToActionId = Object.create(null);
            this.mapLastKnownKeybindingToActionId = this.storageService.getItem(VSCodeMenu.lastKnownKeybindingsMapStorageKey) || Object.create(null);
            this.menuUpdater = new async_1.RunOnceScheduler(function () { return _this.doUpdateMenu(); }, 0);
            this.onConfigurationUpdated(this.configurationService.getConfiguration());
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
            // Listen to some events from window service
            this.windowsService.onPathsOpen(function (paths) { return _this.updateMenu(); });
            this.windowsService.onRecentPathsChange(function (paths) { return _this.updateMenu(); });
            this.windowsService.onWindowClose(function (_) { return _this.onClose(_this.windowsService.getWindowCount()); });
            // Resolve keybindings when any first workbench is loaded
            this.windowsService.onWindowReady(function (win) { return _this.resolveKeybindings(win); });
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
                    var accelerator = keybinding_1.KeybindingLabels._toElectronAccelerator(new keyCodes_1.Keybinding(keybinding.binding));
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
            // Listen to extension viewlets
            electron_1.ipcMain.on('vscode:extensionViewlets', function (event, rawExtensionViewlets) {
                var extensionViewlets = [];
                try {
                    extensionViewlets = JSON.parse(rawExtensionViewlets);
                }
                catch (error) {
                }
                if (extensionViewlets.length) {
                    _this.extensionViewlets = extensionViewlets;
                    _this.updateMenu();
                }
            });
            // Update when auto save config changes
            this.configurationService.onDidUpdateConfiguration(function (e) { return _this.onConfigurationUpdated(e.config, true /* update menu if changed */); });
            // Listen to update service
            this.updateService.onStateChange(function () { return _this.updateMenu(); });
        };
        VSCodeMenu.prototype.onConfigurationUpdated = function (config, handleMenu) {
            var updateMenu = false;
            var newAutoSaveSetting = config && config.files && config.files.autoSave;
            if (newAutoSaveSetting !== this.currentAutoSaveSetting) {
                this.currentAutoSaveSetting = newAutoSaveSetting;
                updateMenu = true;
            }
            var newSidebarLocation = config && config.workbench && config.workbench.sideBar && config.workbench.sideBar.location || 'left';
            if (newSidebarLocation !== this.currentSidebarLocation) {
                this.currentSidebarLocation = newSidebarLocation;
                updateMenu = true;
            }
            var newStatusbarVisible = config && config.workbench && config.workbench.statusBar && config.workbench.statusBar.visible;
            if (typeof newStatusbarVisible !== 'boolean') {
                newStatusbarVisible = true;
            }
            if (newStatusbarVisible !== this.currentStatusbarVisible) {
                this.currentStatusbarVisible = newStatusbarVisible;
                updateMenu = true;
            }
            var newActivityBarVisible = config && config.workbench && config.workbench.activityBar && config.workbench.activityBar.visible;
            if (typeof newActivityBarVisible !== 'boolean') {
                newActivityBarVisible = true;
            }
            if (newActivityBarVisible !== this.currentActivityBarVisible) {
                this.currentActivityBarVisible = newActivityBarVisible;
                updateMenu = true;
            }
            if (handleMenu && updateMenu) {
                this.updateMenu();
            }
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
            this.menuUpdater.schedule(); // buffer multiple attempts to update the menu
        };
        VSCodeMenu.prototype.doUpdateMenu = function () {
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
                macApplicationMenuItem = new electron_1.MenuItem({ label: product_1.default.nameShort, submenu: applicationMenu });
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
            // Selection
            var selectionMenu = new electron_1.Menu();
            var selectionMenuItem = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(2, null)), submenu: selectionMenu });
            this.setSelectionMenu(selectionMenu);
            // View
            var viewMenu = new electron_1.Menu();
            var viewMenuItem = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(3, null)), submenu: viewMenu });
            this.setViewMenu(viewMenu);
            // Goto
            var gotoMenu = new electron_1.Menu();
            var gotoMenuItem = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(4, null)), submenu: gotoMenu });
            this.setGotoMenu(gotoMenu);
            // Mac: Window
            var macWindowMenuItem;
            if (platform.isMacintosh) {
                var windowMenu = new electron_1.Menu();
                macWindowMenuItem = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(5, null)), submenu: windowMenu, role: 'window' });
                this.setMacWindowMenu(windowMenu);
            }
            // Help
            var helpMenu = new electron_1.Menu();
            var helpMenuItem = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(6, null)), submenu: helpMenu, role: 'help' });
            this.setHelpMenu(helpMenu);
            // Menu Structure
            if (macApplicationMenuItem) {
                menubar.append(macApplicationMenuItem);
            }
            menubar.append(fileMenuItem);
            menubar.append(editMenuItem);
            menubar.append(selectionMenuItem);
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
                dockMenu.append(new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(7, null)), click: function () { return _this.windowsService.openNewWindow(); } }));
                electron_1.app.dock.setMenu(dockMenu);
            }
        };
        VSCodeMenu.prototype.setMacApplicationMenu = function (macApplicationMenu) {
            var _this = this;
            var about = new electron_1.MenuItem({ label: nls.localize(8, null, product_1.default.nameLong), role: 'about' });
            var checkForUpdates = this.getUpdateMenuItems();
            var preferences = this.getPreferencesMenu();
            var hide = new electron_1.MenuItem({ label: nls.localize(9, null, product_1.default.nameLong), role: 'hide', accelerator: 'Command+H' });
            var hideOthers = new electron_1.MenuItem({ label: nls.localize(10, null), role: 'hideothers', accelerator: 'Command+Alt+H' });
            var showAll = new electron_1.MenuItem({ label: nls.localize(11, null), role: 'unhide' });
            var quit = new electron_1.MenuItem(this.likeAction('workbench.action.quit', { label: nls.localize(12, null, product_1.default.nameLong), click: function () { return _this.windowsService.quit(); }, accelerator: this.getAccelerator('workbench.action.quit', 'Command+Q') }));
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
                newFile = new electron_1.MenuItem(this.likeAction('workbench.action.files.newUntitledFile', { label: mnemonicLabel(nls.localize(13, null)), click: function () { return _this.windowsService.openNewWindow(); } }));
            }
            else {
                newFile = this.createMenuItem(nls.localize(14, null), 'workbench.action.files.newUntitledFile');
            }
            var open = new electron_1.MenuItem(this.likeAction('workbench.action.files.openFileFolder', { label: mnemonicLabel(nls.localize(15, null)), click: function () { return _this.windowsService.openFileFolderPicker(); } }));
            var openFolder = new electron_1.MenuItem(this.likeAction('workbench.action.files.openFolder', { label: mnemonicLabel(nls.localize(16, null)), click: function () { return _this.windowsService.openFolderPicker(); } }));
            var openFile;
            if (hasNoWindows) {
                openFile = new electron_1.MenuItem(this.likeAction('workbench.action.files.openFile', { label: mnemonicLabel(nls.localize(17, null)), click: function () { return _this.windowsService.openFilePicker(); } }));
            }
            else {
                openFile = this.createMenuItem(nls.localize(18, null), 'workbench.action.files.openFile');
            }
            var openRecentMenu = new electron_1.Menu();
            this.setOpenRecentMenu(openRecentMenu);
            var openRecent = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(19, null)), submenu: openRecentMenu, enabled: openRecentMenu.items.length > 0 });
            var saveFile = this.createMenuItem(nls.localize(20, null), 'workbench.action.files.save', this.windowsService.getWindowCount() > 0);
            var saveFileAs = this.createMenuItem(nls.localize(21, null), 'workbench.action.files.saveAs', this.windowsService.getWindowCount() > 0);
            var saveAllFiles = this.createMenuItem(nls.localize(22, null), 'workbench.action.files.saveAll', this.windowsService.getWindowCount() > 0);
            var autoSaveEnabled = [files_1.AutoSaveConfiguration.AFTER_DELAY, files_1.AutoSaveConfiguration.ON_FOCUS_CHANGE, files_1.AutoSaveConfiguration.ON_WINDOW_CHANGE].some(function (s) { return _this.currentAutoSaveSetting === s; });
            var autoSave = new electron_1.MenuItem(this.likeAction('vscode.toggleAutoSave', { label: mnemonicLabel(nls.localize(23, null)), type: 'checkbox', checked: autoSaveEnabled, enabled: this.windowsService.getWindowCount() > 0, click: function () { return _this.windowsService.sendToFocused('vscode.toggleAutoSave'); } }, false));
            var preferences = this.getPreferencesMenu();
            var newWindow = new electron_1.MenuItem(this.likeAction('workbench.action.newWindow', { label: mnemonicLabel(nls.localize(24, null)), click: function () { return _this.windowsService.openNewWindow(); } }));
            var revertFile = this.createMenuItem(nls.localize(25, null), 'workbench.action.files.revert', this.windowsService.getWindowCount() > 0);
            var closeWindow = new electron_1.MenuItem(this.likeAction('workbench.action.closeWindow', { label: mnemonicLabel(nls.localize(26, null)), click: function () { return _this.windowsService.getLastActiveWindow().win.close(); }, enabled: this.windowsService.getWindowCount() > 0 }));
            var closeFolder = this.createMenuItem(nls.localize(27, null), 'workbench.action.closeFolder');
            var closeEditor = this.createMenuItem(nls.localize(28, null), 'workbench.action.closeActiveEditor');
            var exit = new electron_1.MenuItem(this.likeAction('workbench.action.quit', { label: mnemonicLabel(nls.localize(29, null)), click: function () { return _this.windowsService.quit(); } }));
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
                autoSave,
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
            var userSettings = this.createMenuItem(nls.localize(30, null), 'workbench.action.openGlobalSettings');
            var workspaceSettings = this.createMenuItem(nls.localize(31, null), 'workbench.action.openWorkspaceSettings');
            var kebindingSettings = this.createMenuItem(nls.localize(32, null), 'workbench.action.openGlobalKeybindings');
            var keymapExtensions = this.createMenuItem(nls.localize(33, null), 'workbench.extensions.action.showRecommendedKeymapExtensions');
            var snippetsSettings = this.createMenuItem(nls.localize(34, null), 'workbench.action.openSnippets');
            var colorThemeSelection = this.createMenuItem(nls.localize(35, null), 'workbench.action.selectTheme');
            var iconThemeSelection = this.createMenuItem(nls.localize(36, null), 'workbench.action.selectIconTheme');
            var preferencesMenu = new electron_1.Menu();
            preferencesMenu.append(userSettings);
            preferencesMenu.append(workspaceSettings);
            preferencesMenu.append(__separator__());
            preferencesMenu.append(kebindingSettings);
            preferencesMenu.append(keymapExtensions);
            preferencesMenu.append(__separator__());
            preferencesMenu.append(snippetsSettings);
            preferencesMenu.append(__separator__());
            preferencesMenu.append(colorThemeSelection);
            preferencesMenu.append(iconThemeSelection);
            return new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(37, null)), submenu: preferencesMenu });
        };
        VSCodeMenu.prototype.setOpenRecentMenu = function (openRecentMenu) {
            var _this = this;
            openRecentMenu.append(this.createMenuItem(nls.localize(38, null), 'workbench.action.reopenClosedEditor'));
            var _a = this.windowsService.getRecentPathsList(), folders = _a.folders, files = _a.files;
            // Folders
            if (folders.length > 0) {
                openRecentMenu.append(__separator__());
                for (var i = 0; i < VSCodeMenu.MAX_MENU_RECENT_ENTRIES && i < folders.length; i++) {
                    openRecentMenu.append(this.createOpenRecentMenuItem(folders[i], 'openRecentFolder'));
                }
            }
            // Files
            if (files.length > 0) {
                openRecentMenu.append(__separator__());
                for (var i = 0; i < VSCodeMenu.MAX_MENU_RECENT_ENTRIES && i < files.length; i++) {
                    openRecentMenu.append(this.createOpenRecentMenuItem(files[i], 'openRecentFile'));
                }
            }
            if (folders.length || files.length) {
                openRecentMenu.append(__separator__());
                openRecentMenu.append(new electron_1.MenuItem(this.likeAction('clearRecentlyOpened', { label: mnemonicLabel(nls.localize(39, null)), click: function () { return _this.windowsService.clearRecentPathsList(); } }, false)));
            }
        };
        VSCodeMenu.prototype.createOpenRecentMenuItem = function (path, actionId) {
            var _this = this;
            return new electron_1.MenuItem(this.likeAction(actionId, {
                label: unMnemonicLabel(path), click: function (menuItem, win, event) {
                    var openInNewWindow = event && ((!platform.isMacintosh && event.ctrlKey) || (platform.isMacintosh && event.metaKey));
                    var success = !!_this.windowsService.open({ cli: _this.environmentService.args, pathsToOpen: [path], forceNewWindow: openInNewWindow });
                    if (!success) {
                        _this.windowsService.removeFromRecentPathsList(path);
                    }
                }
            }, false));
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
            if (platform.isMacintosh) {
                undo = this.createDevToolsAwareMenuItem(nls.localize(40, null), 'undo', function (devTools) { return devTools.undo(); });
                redo = this.createDevToolsAwareMenuItem(nls.localize(41, null), 'redo', function (devTools) { return devTools.redo(); });
                cut = this.createRoleMenuItem(nls.localize(42, null), 'editor.action.clipboardCutAction', 'cut');
                copy = this.createRoleMenuItem(nls.localize(43, null), 'editor.action.clipboardCopyAction', 'copy');
                paste = this.createRoleMenuItem(nls.localize(44, null), 'editor.action.clipboardPasteAction', 'paste');
            }
            else {
                undo = this.createMenuItem(nls.localize(45, null), 'undo');
                redo = this.createMenuItem(nls.localize(46, null), 'redo');
                cut = this.createMenuItem(nls.localize(47, null), 'editor.action.clipboardCutAction');
                copy = this.createMenuItem(nls.localize(48, null), 'editor.action.clipboardCopyAction');
                paste = this.createMenuItem(nls.localize(49, null), 'editor.action.clipboardPasteAction');
            }
            var find = this.createMenuItem(nls.localize(50, null), 'actions.find');
            var replace = this.createMenuItem(nls.localize(51, null), 'editor.action.startFindReplaceAction');
            var findInFiles = this.createMenuItem(nls.localize(52, null), 'workbench.action.findInFiles');
            var replaceInFiles = this.createMenuItem(nls.localize(53, null), 'workbench.action.replaceInFiles');
            var emmetExpandAbbreviation = this.createMenuItem(nls.localize(54, null), 'editor.emmet.action.expandAbbreviation');
            var showEmmetCommands = this.createMenuItem(nls.localize(55, null), 'workbench.action.showEmmetCommands');
            var toggleLineComment = this.createMenuItem(nls.localize(56, null), 'editor.action.commentLine');
            var toggleBlockComment = this.createMenuItem(nls.localize(57, null), 'editor.action.blockComment');
            [
                undo,
                redo,
                __separator__(),
                cut,
                copy,
                paste,
                __separator__(),
                find,
                replace,
                __separator__(),
                findInFiles,
                replaceInFiles,
                __separator__(),
                toggleLineComment,
                toggleBlockComment,
                emmetExpandAbbreviation,
                showEmmetCommands
            ].forEach(function (item) { return winLinuxEditMenu.append(item); });
        };
        VSCodeMenu.prototype.setSelectionMenu = function (winLinuxEditMenu) {
            var insertCursorAbove = this.createMenuItem(nls.localize(58, null), 'editor.action.insertCursorAbove');
            var insertCursorBelow = this.createMenuItem(nls.localize(59, null), 'editor.action.insertCursorBelow');
            var insertCursorAtEndOfEachLineSelected = this.createMenuItem(nls.localize(60, null), 'editor.action.insertCursorAtEndOfEachLineSelected');
            var addSelectionToNextFindMatch = this.createMenuItem(nls.localize(61, null), 'editor.action.addSelectionToNextFindMatch');
            var addSelectionToPreviousFindMatch = this.createMenuItem(nls.localize(62, null), 'editor.action.addSelectionToPreviousFindMatch');
            var selectHighlights = this.createMenuItem(nls.localize(63, null), 'editor.action.selectHighlights');
            var copyLinesUp = this.createMenuItem(nls.localize(64, null), 'editor.action.copyLinesUpAction');
            var copyLinesDown = this.createMenuItem(nls.localize(65, null), 'editor.action.copyLinesDownAction');
            var moveLinesUp = this.createMenuItem(nls.localize(66, null), 'editor.action.moveLinesUpAction');
            var moveLinesDown = this.createMenuItem(nls.localize(67, null), 'editor.action.moveLinesDownAction');
            var selectAll;
            if (platform.isMacintosh) {
                selectAll = this.createDevToolsAwareMenuItem(nls.localize(68, null), 'editor.action.selectAll', function (devTools) { return devTools.selectAll(); });
            }
            else {
                selectAll = this.createMenuItem(nls.localize(69, null), 'editor.action.selectAll');
            }
            var smartSelectGrow = this.createMenuItem(nls.localize(70, null), 'editor.action.smartSelect.grow');
            var smartSelectshrink = this.createMenuItem(nls.localize(71, null), 'editor.action.smartSelect.shrink');
            [
                selectAll,
                smartSelectGrow,
                smartSelectshrink,
                __separator__(),
                copyLinesUp,
                copyLinesDown,
                moveLinesUp,
                moveLinesDown,
                __separator__(),
                insertCursorAbove,
                insertCursorBelow,
                insertCursorAtEndOfEachLineSelected,
                addSelectionToNextFindMatch,
                addSelectionToPreviousFindMatch,
                selectHighlights,
            ].forEach(function (item) { return winLinuxEditMenu.append(item); });
        };
        VSCodeMenu.prototype.setViewMenu = function (viewMenu) {
            var _this = this;
            var explorer = this.createMenuItem(nls.localize(72, null), 'workbench.view.explorer');
            var search = this.createMenuItem(nls.localize(73, null), 'workbench.view.search');
            var git = this.createMenuItem(nls.localize(74, null), 'workbench.view.git');
            var debug = this.createMenuItem(nls.localize(75, null), 'workbench.view.debug');
            var extensions = this.createMenuItem(nls.localize(76, null), 'workbench.view.extensions');
            var output = this.createMenuItem(nls.localize(77, null), 'workbench.action.output.toggleOutput');
            var debugConsole = this.createMenuItem(nls.localize(78, null), 'workbench.debug.action.toggleRepl');
            var integratedTerminal = this.createMenuItem(nls.localize(79, null), 'workbench.action.terminal.toggleTerminal');
            var problems = this.createMenuItem(nls.localize(80, null), 'workbench.actions.view.problems');
            var additionalViewlets;
            if (this.extensionViewlets.length) {
                var additionalViewletsMenu_1 = new electron_1.Menu();
                this.extensionViewlets.forEach(function (viewlet) {
                    additionalViewletsMenu_1.append(_this.createMenuItem(viewlet.label, viewlet.id));
                });
                additionalViewlets = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(81, null)), submenu: additionalViewletsMenu_1, enabled: true });
            }
            var commands = this.createMenuItem(nls.localize(82, null), 'workbench.action.showCommands');
            var fullscreen = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(83, null)), accelerator: this.getAccelerator('workbench.action.toggleFullScreen'), click: function () { return _this.windowsService.getLastActiveWindow().toggleFullScreen(); }, enabled: this.windowsService.getWindowCount() > 0 });
            var toggleZenMode = this.createMenuItem(nls.localize(84, null), 'workbench.action.toggleZenMode', this.windowsService.getWindowCount() > 0);
            var toggleMenuBar = this.createMenuItem(nls.localize(85, null), 'workbench.action.toggleMenuBar');
            var splitEditor = this.createMenuItem(nls.localize(86, null), 'workbench.action.splitEditor');
            var toggleEditorLayout = this.createMenuItem(nls.localize(87, null), 'workbench.action.toggleEditorGroupLayout');
            var toggleSidebar = this.createMenuItem(nls.localize(88, null), 'workbench.action.toggleSidebarVisibility');
            var moveSideBarLabel;
            if (this.currentSidebarLocation !== 'right') {
                moveSideBarLabel = nls.localize(89, null);
            }
            else {
                moveSideBarLabel = nls.localize(90, null);
            }
            var moveSidebar = this.createMenuItem(moveSideBarLabel, 'workbench.action.toggleSidebarPosition');
            var togglePanel = this.createMenuItem(nls.localize(91, null), 'workbench.action.togglePanel');
            var statusBarLabel;
            if (this.currentStatusbarVisible) {
                statusBarLabel = nls.localize(92, null);
            }
            else {
                statusBarLabel = nls.localize(93, null);
            }
            var toggleStatusbar = this.createMenuItem(statusBarLabel, 'workbench.action.toggleStatusbarVisibility');
            var activityBarLabel;
            if (this.currentActivityBarVisible) {
                activityBarLabel = nls.localize(94, null);
            }
            else {
                activityBarLabel = nls.localize(95, null);
            }
            var toggleActivtyBar = this.createMenuItem(activityBarLabel, 'workbench.action.toggleActivityBarVisibility');
            var toggleWordWrap = this.createMenuItem(nls.localize(96, null), 'editor.action.toggleWordWrap');
            var toggleRenderWhitespace = this.createMenuItem(nls.localize(97, null), 'editor.action.toggleRenderWhitespace');
            var toggleRenderControlCharacters = this.createMenuItem(nls.localize(98, null), 'editor.action.toggleRenderControlCharacter');
            var zoomIn = this.createMenuItem(nls.localize(99, null), 'workbench.action.zoomIn');
            var zoomOut = this.createMenuItem(nls.localize(100, null), 'workbench.action.zoomOut');
            var resetZoom = this.createMenuItem(nls.localize(101, null), 'workbench.action.zoomReset');
            arrays.coalesce([
                commands,
                __separator__(),
                explorer,
                search,
                git,
                debug,
                extensions,
                additionalViewlets,
                __separator__(),
                output,
                problems,
                debugConsole,
                integratedTerminal,
                __separator__(),
                fullscreen,
                toggleZenMode,
                platform.isWindows || platform.isLinux ? toggleMenuBar : void 0,
                __separator__(),
                splitEditor,
                toggleEditorLayout,
                moveSidebar,
                toggleSidebar,
                togglePanel,
                toggleStatusbar,
                toggleActivtyBar,
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
            var back = this.createMenuItem(nls.localize(102, null), 'workbench.action.navigateBack');
            var forward = this.createMenuItem(nls.localize(103, null), 'workbench.action.navigateForward');
            var switchEditorMenu = new electron_1.Menu();
            var nextEditor = this.createMenuItem(nls.localize(104, null), 'workbench.action.nextEditor');
            var previousEditor = this.createMenuItem(nls.localize(105, null), 'workbench.action.previousEditor');
            var nextEditorInGroup = this.createMenuItem(nls.localize(106, null), 'workbench.action.openNextRecentlyUsedEditorInGroup');
            var previousEditorInGroup = this.createMenuItem(nls.localize(107, null), 'workbench.action.openPreviousRecentlyUsedEditorInGroup');
            [
                nextEditor,
                previousEditor,
                __separator__(),
                nextEditorInGroup,
                previousEditorInGroup
            ].forEach(function (item) { return switchEditorMenu.append(item); });
            var switchEditor = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(108, null)), submenu: switchEditorMenu, enabled: true });
            var switchGroupMenu = new electron_1.Menu();
            var focusFirstGroup = this.createMenuItem(nls.localize(109, null), 'workbench.action.focusFirstEditorGroup');
            var focusSecondGroup = this.createMenuItem(nls.localize(110, null), 'workbench.action.focusSecondEditorGroup');
            var focusThirdGroup = this.createMenuItem(nls.localize(111, null), 'workbench.action.focusThirdEditorGroup');
            var nextGroup = this.createMenuItem(nls.localize(112, null), 'workbench.action.focusNextGroup');
            var previousGroup = this.createMenuItem(nls.localize(113, null), 'workbench.action.focusPreviousGroup');
            [
                focusFirstGroup,
                focusSecondGroup,
                focusThirdGroup,
                __separator__(),
                nextGroup,
                previousGroup
            ].forEach(function (item) { return switchGroupMenu.append(item); });
            var switchGroup = new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(114, null)), submenu: switchGroupMenu, enabled: true });
            var gotoFile = this.createMenuItem(nls.localize(115, null), 'workbench.action.quickOpen');
            var gotoSymbolInFile = this.createMenuItem(nls.localize(116, null), 'workbench.action.gotoSymbol');
            var gotoSymbolInWorkspace = this.createMenuItem(nls.localize(117, null), 'workbench.action.showAllSymbols');
            var gotoDefinition = this.createMenuItem(nls.localize(118, null), 'editor.action.goToDeclaration');
            var gotoLine = this.createMenuItem(nls.localize(119, null), 'workbench.action.gotoLine');
            [
                back,
                forward,
                __separator__(),
                switchEditor,
                switchGroup,
                __separator__(),
                gotoFile,
                gotoSymbolInFile,
                gotoSymbolInWorkspace,
                gotoDefinition,
                gotoLine
            ].forEach(function (item) { return gotoMenu.append(item); });
        };
        VSCodeMenu.prototype.setMacWindowMenu = function (macWindowMenu) {
            var minimize = new electron_1.MenuItem({ label: nls.localize(120, null), role: 'minimize', accelerator: 'Command+M', enabled: this.windowsService.getWindowCount() > 0 });
            var close = new electron_1.MenuItem({ label: nls.localize(121, null), role: 'close', accelerator: 'Command+W', enabled: this.windowsService.getWindowCount() > 0 });
            var bringAllToFront = new electron_1.MenuItem({ label: nls.localize(122, null), role: 'front', enabled: this.windowsService.getWindowCount() > 0 });
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
                var contents = w.win.webContents;
                if (w.hasHiddenTitleBarStyle() && !w.win.isFullScreen() && !contents.isDevToolsOpened()) {
                    contents.openDevTools({ mode: 'undocked' }); // due to https://github.com/electron/electron/issues/3647
                }
                else {
                    contents.toggleDevTools();
                }
            }
        };
        VSCodeMenu.prototype.setHelpMenu = function (helpMenu) {
            var _this = this;
            var toggleDevToolsItem = new electron_1.MenuItem(this.likeAction('workbench.action.toggleDevTools', {
                label: mnemonicLabel(nls.localize(123, null)),
                click: function () { return _this.toggleDevTools(); },
                enabled: (this.windowsService.getWindowCount() > 0)
            }));
            var showAccessibilityOptions = new electron_1.MenuItem(this.likeAction('accessibilityOptions', {
                label: mnemonicLabel(nls.localize(124, null)),
                accelerator: null,
                click: function () {
                    _this.windowsService.openAccessibilityOptions();
                }
            }, false));
            var reportIssuesItem = null;
            if (product_1.default.reportIssueUrl) {
                var label = nls.localize(125, null);
                if (this.windowsService.getWindowCount() > 0) {
                    reportIssuesItem = this.createMenuItem(label, 'workbench.action.reportIssues');
                }
                else {
                    reportIssuesItem = new electron_1.MenuItem({ label: mnemonicLabel(label), click: function () { return _this.openUrl(product_1.default.reportIssueUrl, 'openReportIssues'); } });
                }
            }
            var keyboardShortcutsUrl = platform.isLinux ? product_1.default.keyboardShortcutsUrlLinux : platform.isMacintosh ? product_1.default.keyboardShortcutsUrlMac : product_1.default.keyboardShortcutsUrlWin;
            arrays.coalesce([
                product_1.default.documentationUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(126, null)), click: function () { return _this.openUrl(product_1.default.documentationUrl, 'openDocumentationUrl'); } }) : null,
                product_1.default.releaseNotesUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(127, null)), click: function () { return _this.windowsService.sendToFocused('vscode:runAction', 'update.showCurrentReleaseNotes'); } }) : null,
                (product_1.default.documentationUrl || product_1.default.releaseNotesUrl) ? __separator__() : null,
                keyboardShortcutsUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(128, null)), click: function () { return _this.windowsService.sendToFocused('vscode:runAction', 'workbench.action.keybindingsReference'); } }) : null,
                product_1.default.introductoryVideosUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(129, null)), click: function () { return _this.openUrl(product_1.default.introductoryVideosUrl, 'openIntroductoryVideosUrl'); } }) : null,
                (product_1.default.introductoryVideosUrl || keyboardShortcutsUrl) ? __separator__() : null,
                product_1.default.twitterUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(130, null)), click: function () { return _this.openUrl(product_1.default.twitterUrl, 'openTwitterUrl'); } }) : null,
                product_1.default.requestFeatureUrl ? new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(131, null)), click: function () { return _this.openUrl(product_1.default.requestFeatureUrl, 'openUserVoiceUrl'); } }) : null,
                reportIssuesItem,
                (product_1.default.twitterUrl || product_1.default.requestFeatureUrl || product_1.default.reportIssueUrl) ? __separator__() : null,
                product_1.default.licenseUrl ? new electron_1.MenuItem({
                    label: mnemonicLabel(nls.localize(132, null)), click: function () {
                        if (platform.language) {
                            var queryArgChar = product_1.default.licenseUrl.indexOf('?') > 0 ? '&' : '?';
                            _this.openUrl("" + product_1.default.licenseUrl + queryArgChar + "lang=" + platform.language, 'openLicenseUrl');
                        }
                        else {
                            _this.openUrl(product_1.default.licenseUrl, 'openLicenseUrl');
                        }
                    }
                }) : null,
                product_1.default.privacyStatementUrl ? new electron_1.MenuItem({
                    label: mnemonicLabel(nls.localize(133, null)), click: function () {
                        if (platform.language) {
                            var queryArgChar = product_1.default.licenseUrl.indexOf('?') > 0 ? '&' : '?';
                            _this.openUrl("" + product_1.default.privacyStatementUrl + queryArgChar + "lang=" + platform.language, 'openPrivacyStatement');
                        }
                        else {
                            _this.openUrl(product_1.default.privacyStatementUrl, 'openPrivacyStatement');
                        }
                    }
                }) : null,
                (product_1.default.licenseUrl || product_1.default.privacyStatementUrl) ? __separator__() : null,
                toggleDevToolsItem,
                platform.isWindows && product_1.default.quality !== 'stable' ? showAccessibilityOptions : null
            ]).forEach(function (item) { return helpMenu.append(item); });
            if (!platform.isMacintosh) {
                var updateMenuItems = this.getUpdateMenuItems();
                if (updateMenuItems.length) {
                    helpMenu.append(__separator__());
                    updateMenuItems.forEach(function (i) { return helpMenu.append(i); });
                }
                helpMenu.append(__separator__());
                helpMenu.append(new electron_1.MenuItem({ label: mnemonicLabel(nls.localize(134, null)), click: function () { return _this.openAboutDialog(); } }));
            }
        };
        VSCodeMenu.prototype.getUpdateMenuItems = function () {
            var _this = this;
            switch (this.updateService.state) {
                case update_1.State.Uninitialized:
                    return [];
                case update_1.State.UpdateDownloaded:
                    return [new electron_1.MenuItem({
                            label: nls.localize(135, null), click: function () {
                                _this.reportMenuActionTelemetry('RestartToUpdate');
                                _this.updateService.quitAndInstall();
                            }
                        })];
                case update_1.State.CheckingForUpdate:
                    return [new electron_1.MenuItem({ label: nls.localize(136, null), enabled: false })];
                case update_1.State.UpdateAvailable:
                    if (platform.isLinux) {
                        return [new electron_1.MenuItem({
                                label: nls.localize(137, null), click: function () {
                                    _this.updateService.quitAndInstall();
                                }
                            })];
                    }
                    var updateAvailableLabel = platform.isWindows
                        ? nls.localize(138, null)
                        : nls.localize(139, null);
                    return [new electron_1.MenuItem({ label: updateAvailableLabel, enabled: false })];
                default:
                    var result = [new electron_1.MenuItem({
                            label: nls.localize(140, null), click: function () { return setTimeout(function () {
                                _this.reportMenuActionTelemetry('CheckForUpdate');
                                _this.updateService.checkForUpdates(true);
                            }, 0); }
                        })];
                    return result;
            }
        };
        VSCodeMenu.prototype.createMenuItem = function (arg1, arg2, arg3, arg4) {
            var _this = this;
            var label = mnemonicLabel(arg1);
            var click = (typeof arg2 === 'function') ? arg2 : function () { return _this.windowsService.sendToFocused('vscode:runAction', arg2); };
            var enabled = typeof arg3 === 'boolean' ? arg3 : this.windowsService.getWindowCount() > 0;
            var checked = typeof arg4 === 'boolean' ? arg4 : false;
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
            if (checked) {
                options['type'] = 'checkbox';
                options['checked'] = checked;
            }
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
        VSCodeMenu.prototype.likeAction = function (actionId, options, setAccelerator) {
            var _this = this;
            if (setAccelerator === void 0) { setAccelerator = !options.accelerator; }
            if (setAccelerator) {
                options.accelerator = this.getAccelerator(actionId);
            }
            var originalClick = options.click;
            options.click = function (item, window, event) {
                _this.reportMenuActionTelemetry(actionId);
                if (originalClick) {
                    originalClick(item, window, event);
                }
            };
            return options;
        };
        VSCodeMenu.prototype.getAccelerator = function (actionId, fallback) {
            if (actionId) {
                var resolvedKeybinding = this.mapResolvedKeybindingToActionId[actionId];
                if (resolvedKeybinding) {
                    return resolvedKeybinding; // keybinding is fully resolved
                }
                if (!this.keybindingsResolved) {
                    this.actionIdKeybindingRequests.push(actionId); // keybinding needs to be resolved
                }
                var lastKnownKeybinding = this.mapLastKnownKeybindingToActionId[actionId];
                if (lastKnownKeybinding) {
                    return lastKnownKeybinding; // return the last known keybining (chance of mismatch is very low unless it changed)
                }
            }
            return fallback;
        };
        VSCodeMenu.prototype.openAboutDialog = function () {
            var lastActiveWindow = this.windowsService.getFocusedWindow() || this.windowsService.getLastActiveWindow();
            electron_1.dialog.showMessageBox(lastActiveWindow && lastActiveWindow.win, {
                title: product_1.default.nameLong,
                type: 'info',
                message: product_1.default.nameLong,
                detail: nls.localize(141, null, product_1.default.kodeStudioVersion, product_1.default.commit || 'Unknown', product_1.default.date || 'Unknown', process.versions['electron'], process.versions['chrome'], process.versions['node']),
                buttons: [nls.localize(142, null)],
                noLink: true
            }, function (result) { return null; });
            this.reportMenuActionTelemetry('showAboutDialog');
        };
        VSCodeMenu.prototype.openUrl = function (url, id) {
            electron_1.shell.openExternal(url);
            this.reportMenuActionTelemetry(id);
        };
        VSCodeMenu.prototype.reportMenuActionTelemetry = function (id) {
            this.telemetryService.publicLog('workbenchActionExecuted', { id: id, from: 'menu' });
        };
        VSCodeMenu.lastKnownKeybindingsMapStorageKey = 'lastKnownKeybindings';
        VSCodeMenu.MAX_MENU_RECENT_ENTRIES = 10;
        VSCodeMenu = __decorate([
            __param(0, storage_1.IStorageService),
            __param(1, update_1.IUpdateService),
            __param(2, configuration_1.IConfigurationService),
            __param(3, windows_1.IWindowsMainService),
            __param(4, environment_1.IEnvironmentService),
            __param(5, telemetry_1.ITelemetryService)
        ], VSCodeMenu);
        return VSCodeMenu;
    }());
    exports.VSCodeMenu = VSCodeMenu;
    function __separator__() {
        return new electron_1.MenuItem({ type: 'separator' });
    }
    function mnemonicLabel(label) {
        if (platform.isMacintosh) {
            return label.replace(/\(&&\w\)|&&/g, ''); // no mnemonic support on mac
        }
        return label.replace(/&&/g, '&');
    }
    function unMnemonicLabel(label) {
        if (platform.isMacintosh) {
            return label; // no mnemonic support on mac
        }
        return label.replace(/&/g, '&&');
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[109/*vs/platform/update/common/updateIpc*/], __M([0/*require*/,1/*exports*/,20/*vs/base/parts/ipc/common/ipc*/,29/*vs/platform/update/common/update*/]), function (require, exports, ipc_1, update_1) {
    'use strict';
    var UpdateChannel = (function () {
        function UpdateChannel(service) {
            this.service = service;
        }
        UpdateChannel.prototype.call = function (command, arg) {
            switch (command) {
                case 'event:onError': return ipc_1.eventToCall(this.service.onError);
                case 'event:onUpdateAvailable': return ipc_1.eventToCall(this.service.onUpdateAvailable);
                case 'event:onUpdateNotAvailable': return ipc_1.eventToCall(this.service.onUpdateNotAvailable);
                case 'event:onUpdateReady': return ipc_1.eventToCall(this.service.onUpdateReady);
                case 'event:onStateChange': return ipc_1.eventToCall(this.service.onStateChange);
                case 'checkForUpdates': return this.service.checkForUpdates(arg);
                case 'quitAndInstall': return this.service.quitAndInstall();
            }
        };
        return UpdateChannel;
    }());
    exports.UpdateChannel = UpdateChannel;
    var UpdateChannelClient = (function () {
        function UpdateChannelClient(channel) {
            var _this = this;
            this.channel = channel;
            this._onError = ipc_1.eventFromCall(this.channel, 'event:onError');
            this._onUpdateAvailable = ipc_1.eventFromCall(this.channel, 'event:onUpdateAvailable');
            this._onUpdateNotAvailable = ipc_1.eventFromCall(this.channel, 'event:onUpdateNotAvailable');
            this._onUpdateReady = ipc_1.eventFromCall(this.channel, 'event:onUpdateReady');
            this._onStateChange = ipc_1.eventFromCall(this.channel, 'event:onStateChange');
            this._state = update_1.State.Uninitialized;
            this.onStateChange(function (state) { return _this._state = state; });
        }
        Object.defineProperty(UpdateChannelClient.prototype, "onError", {
            get: function () { return this._onError; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateChannelClient.prototype, "onUpdateAvailable", {
            get: function () { return this._onUpdateAvailable; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateChannelClient.prototype, "onUpdateNotAvailable", {
            get: function () { return this._onUpdateNotAvailable; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateChannelClient.prototype, "onUpdateReady", {
            get: function () { return this._onUpdateReady; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateChannelClient.prototype, "onStateChange", {
            get: function () { return this._onStateChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateChannelClient.prototype, "state", {
            get: function () { return this._state; },
            enumerable: true,
            configurable: true
        });
        ;
        UpdateChannelClient.prototype.checkForUpdates = function (explicit) {
            return this.channel.call('checkForUpdates', explicit);
        };
        UpdateChannelClient.prototype.quitAndInstall = function () {
            return this.channel.call('quitAndInstall');
        };
        return UpdateChannelClient;
    }());
    exports.UpdateChannelClient = UpdateChannelClient;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[41/*vs/platform/url/common/url*/], __M([0/*require*/,1/*exports*/,3/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
    'use strict';
    exports.ID = 'urlService';
    exports.IURLService = instantiation_1.createDecorator(exports.ID);
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[111/*vs/code/electron-main/launch*/], __M([0/*require*/,1/*exports*/,34/*vs/code/electron-main/windows*/,2/*vs/base/common/winjs.base*/,23/*vs/code/electron-main/log*/,41/*vs/platform/url/common/url*/,3/*vs/platform/instantiation/common/instantiation*/,4/*vs/base/common/event*/]), function (require, exports, windows_1, winjs_base_1, log_1, url_1, instantiation_1, event_1) {
    'use strict';
    exports.ID = 'launchService';
    exports.ILaunchService = instantiation_1.createDecorator(exports.ID);
    var LaunchChannel = (function () {
        function LaunchChannel(service) {
            this.service = service;
        }
        LaunchChannel.prototype.call = function (command, arg) {
            switch (command) {
                case 'start':
                    var _a = arg, args = _a.args, userEnv = _a.userEnv;
                    return this.service.start(args, userEnv);
                case 'get-main-process-id':
                    return this.service.getMainProcessId();
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
            return this.channel.call('start', { args: args, userEnv: userEnv });
        };
        LaunchChannelClient.prototype.getMainProcessId = function () {
            return this.channel.call('get-main-process-id', null);
        };
        return LaunchChannelClient;
    }());
    exports.LaunchChannelClient = LaunchChannelClient;
    var LaunchService = (function () {
        function LaunchService(logService, windowsService, urlService) {
            this.logService = logService;
            this.windowsService = windowsService;
            this.urlService = urlService;
        }
        LaunchService.prototype.start = function (args, userEnv) {
            var _this = this;
            this.logService.log('Received data from other instance: ', args, userEnv);
            var openUrlArg = args['open-url'] || [];
            var openUrl = typeof openUrlArg === 'string' ? [openUrlArg] : openUrlArg;
            if (openUrl.length > 0) {
                openUrl.forEach(function (url) { return _this.urlService.open(url); });
                return winjs_base_1.TPromise.as(null);
            }
            // Otherwise handle in windows service
            var usedWindows;
            if (!!args.extensionDevelopmentPath) {
                this.windowsService.openPluginDevelopmentHostWindow({ cli: args, userEnv: userEnv });
            }
            else if (args._.length === 0 && args['new-window']) {
                usedWindows = this.windowsService.open({ cli: args, userEnv: userEnv, forceNewWindow: true, forceEmpty: true });
            }
            else if (args._.length === 0) {
                usedWindows = [this.windowsService.focusLastActive(args)];
            }
            else {
                usedWindows = this.windowsService.open({
                    cli: args,
                    userEnv: userEnv,
                    forceNewWindow: args.wait || args['new-window'],
                    preferNewWindow: !args['reuse-window'],
                    diffMode: args.diff
                });
            }
            // If the other instance is waiting to be killed, we hook up a window listener if one window
            // is being used and only then resolve the startup promise which will kill this second instance
            if (args.wait && usedWindows && usedWindows.length === 1 && usedWindows[0]) {
                var windowId_1 = usedWindows[0].id;
                return new winjs_base_1.TPromise(function (c, e) {
                    var onceWindowClose = event_1.once(_this.windowsService.onWindowClose);
                    onceWindowClose(function (id) {
                        if (id === windowId_1) {
                            c(null);
                        }
                    });
                });
            }
            return winjs_base_1.TPromise.as(null);
        };
        LaunchService.prototype.getMainProcessId = function () {
            this.logService.log('Received request for process ID from other instance.');
            return winjs_base_1.TPromise.as(process.pid);
        };
        LaunchService = __decorate([
            __param(0, log_1.ILogService),
            __param(1, windows_1.IWindowsMainService),
            __param(2, url_1.IURLService)
        ], LaunchService);
        return LaunchService;
    }());
    exports.LaunchService = LaunchService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[112/*vs/platform/url/electron-main/urlService*/], __M([0/*require*/,1/*exports*/,4/*vs/base/common/event*/,26/*vs/base/node/event*/,15/*vs/platform/product*/,14/*electron*/,22/*vs/base/common/uri*/]), function (require, exports, event_1, event_2, product_1, electron_1, uri_1) {
    'use strict';
    var URLService = (function () {
        function URLService(initial) {
            if (initial === void 0) { initial = []; }
            this.openUrlEmitter = new event_1.Emitter();
            var globalBuffer = (global.getOpenUrls() || []);
            var initialBuffer = (typeof initial === 'string' ? [initial] : initial).concat(globalBuffer);
            electron_1.app.setAsDefaultProtocolClient(product_1.default.urlProtocol, process.execPath, ['--open-url']);
            var rawOnOpenUrl = event_2.fromEventEmitter(electron_1.app, 'open-url', function (event, url) { return ({ event: event, url: url }); });
            // always prevent default and return the url as string
            var preventedOnOpenUrl = event_1.mapEvent(rawOnOpenUrl, function (_a) {
                var event = _a.event, url = _a.url;
                event.preventDefault();
                return url;
            });
            // buffer all `onOpenUrl` events until someone starts listening
            var bufferedOnOpenUrl = event_1.buffer(preventedOnOpenUrl, true, initialBuffer);
            this.onOpenURL = event_1.chain(event_1.any(bufferedOnOpenUrl, this.openUrlEmitter.event))
                .map(function (url) {
                try {
                    return uri_1.default.parse(url);
                }
                catch (e) {
                    return null;
                }
            })
                .filter(function (uri) { return !!uri; })
                .event;
        }
        URLService.prototype.open = function (url) {
            this.openUrlEmitter.fire(url);
        };
        return URLService;
    }());
    exports.URLService = URLService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[55/*vs/platform/windows/common/windows*/], __M([0/*require*/,1/*exports*/,3/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
    'use strict';
    exports.IWindowsService = instantiation_1.createDecorator('windowsService');
    exports.IWindowService = instantiation_1.createDecorator('windowService');
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[114/*vs/platform/url/common/urlIpc*/], __M([0/*require*/,1/*exports*/,20/*vs/base/parts/ipc/common/ipc*/,4/*vs/base/common/event*/,55/*vs/platform/windows/common/windows*/,22/*vs/base/common/uri*/]), function (require, exports, ipc_1, event_1, windows_1, uri_1) {
    'use strict';
    var URISerializer = function (uri) { return uri.toJSON(); };
    var URIDeserializer = function (raw) { return uri_1.default.revive(raw); };
    var URLChannel = (function () {
        function URLChannel(service, windowsService) {
            var _this = this;
            this.service = service;
            windowsService.onWindowFocus(function (id) { return _this.focusedWindowId = id; });
        }
        URLChannel.prototype.call = function (command, arg) {
            var _this = this;
            switch (command) {
                case 'event:onOpenURL': return ipc_1.eventToCall(event_1.filterEvent(this.service.onOpenURL, function () { return _this.isWindowFocused(arg); }), URISerializer);
            }
        };
        /**
         * We only want the focused window to get pinged with the onOpenUrl event.
         * The idea here is to filter the onOpenUrl event with the knowledge of which
         * was the last window to be focused. When first listening to the event,
         * each client sends its window ID via the arguments to `call(...)`.
         * When the event fires, the server has enough knowledge to filter the event
         * and fire it only to the focused window.
         */
        URLChannel.prototype.isWindowFocused = function (windowID) {
            return this.focusedWindowId === windowID;
        };
        URLChannel = __decorate([
            __param(1, windows_1.IWindowsService)
        ], URLChannel);
        return URLChannel;
    }());
    exports.URLChannel = URLChannel;
    var URLChannelClient = (function () {
        function URLChannelClient(channel, windowID) {
            this.channel = channel;
            this.windowID = windowID;
            this._onOpenURL = ipc_1.eventFromCall(this.channel, 'event:onOpenURL', this.windowID, URIDeserializer);
        }
        Object.defineProperty(URLChannelClient.prototype, "onOpenURL", {
            get: function () { return this._onOpenURL; },
            enumerable: true,
            configurable: true
        });
        URLChannelClient.prototype.open = function (url) {
            return; // not implemented
        };
        return URLChannelClient;
    }());
    exports.URLChannelClient = URLChannelClient;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[115/*vs/platform/windows/common/windowsIpc*/], __M([0/*require*/,1/*exports*/,4/*vs/base/common/event*/,20/*vs/base/parts/ipc/common/ipc*/]), function (require, exports, event_1, ipc_1) {
    'use strict';
    var WindowsChannel = (function () {
        function WindowsChannel(service) {
            this.service = service;
            this.onWindowOpen = event_1.buffer(service.onWindowOpen, true);
            this.onWindowFocus = event_1.buffer(service.onWindowFocus, true);
        }
        WindowsChannel.prototype.call = function (command, arg) {
            switch (command) {
                case 'event:onWindowOpen': return ipc_1.eventToCall(this.onWindowOpen);
                case 'event:onWindowFocus': return ipc_1.eventToCall(this.onWindowFocus);
                case 'openFileFolderPicker': return this.service.openFileFolderPicker(arg[0], arg[1]);
                case 'openFilePicker': return this.service.openFilePicker(arg[0], arg[1], arg[2]);
                case 'openFolderPicker': return this.service.openFolderPicker(arg[0], arg[1]);
                case 'reloadWindow': return this.service.reloadWindow(arg);
                case 'openDevTools': return this.service.openDevTools(arg);
                case 'toggleDevTools': return this.service.toggleDevTools(arg);
                case 'closeFolder': return this.service.closeFolder(arg);
                case 'toggleFullScreen': return this.service.toggleFullScreen(arg);
                case 'setRepresentedFilename': return this.service.setRepresentedFilename(arg[0], arg[1]);
                case 'addToRecentlyOpen': return this.service.addToRecentlyOpen(arg);
                case 'removeFromRecentlyOpen': return this.service.removeFromRecentlyOpen(arg);
                case 'getRecentlyOpen': return this.service.getRecentlyOpen(arg);
                case 'focusWindow': return this.service.focusWindow(arg);
                case 'isMaximized': return this.service.isMaximized(arg);
                case 'maximizeWindow': return this.service.maximizeWindow(arg);
                case 'unmaximizeWindow': return this.service.unmaximizeWindow(arg);
                case 'setDocumentEdited': return this.service.setDocumentEdited(arg[0], arg[1]);
                case 'toggleMenuBar': return this.service.toggleMenuBar(arg);
                case 'windowOpen': return this.service.windowOpen(arg[0], arg[1]);
                case 'openNewWindow': return this.service.openNewWindow();
                case 'showWindow': return this.service.showWindow(arg);
                case 'getWindows': return this.service.getWindows();
                case 'getWindowCount': return this.service.getWindowCount();
                case 'quit': return this.service.quit();
                case 'log': return this.service.log(arg[0], arg[1]);
                case 'closeExtensionHostWindow': return this.service.closeExtensionHostWindow(arg);
                case 'showItemInFolder': return this.service.showItemInFolder(arg);
                case 'openExternal': return this.service.openExternal(arg);
                case 'startCrashReporter': return this.service.startCrashReporter(arg);
            }
        };
        return WindowsChannel;
    }());
    exports.WindowsChannel = WindowsChannel;
    var WindowsChannelClient = (function () {
        function WindowsChannelClient(channel) {
            this.channel = channel;
            this._onWindowOpen = ipc_1.eventFromCall(this.channel, 'event:onWindowOpen');
            this._onWindowFocus = ipc_1.eventFromCall(this.channel, 'event:onWindowFocus');
        }
        Object.defineProperty(WindowsChannelClient.prototype, "onWindowOpen", {
            get: function () { return this._onWindowOpen; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WindowsChannelClient.prototype, "onWindowFocus", {
            get: function () { return this._onWindowFocus; },
            enumerable: true,
            configurable: true
        });
        WindowsChannelClient.prototype.openFileFolderPicker = function (windowId, forceNewWindow) {
            return this.channel.call('openFileFolderPicker', [windowId, forceNewWindow]);
        };
        WindowsChannelClient.prototype.openFilePicker = function (windowId, forceNewWindow, path) {
            return this.channel.call('openFilePicker', [windowId, forceNewWindow, path]);
        };
        WindowsChannelClient.prototype.openFolderPicker = function (windowId, forceNewWindow) {
            return this.channel.call('openFolderPicker', [windowId, forceNewWindow]);
        };
        WindowsChannelClient.prototype.reloadWindow = function (windowId) {
            return this.channel.call('reloadWindow', windowId);
        };
        WindowsChannelClient.prototype.openDevTools = function (windowId) {
            return this.channel.call('openDevTools', windowId);
        };
        WindowsChannelClient.prototype.toggleDevTools = function (windowId) {
            return this.channel.call('toggleDevTools', windowId);
        };
        WindowsChannelClient.prototype.closeFolder = function (windowId) {
            return this.channel.call('closeFolder', windowId);
        };
        WindowsChannelClient.prototype.toggleFullScreen = function (windowId) {
            return this.channel.call('toggleFullScreen', windowId);
        };
        WindowsChannelClient.prototype.setRepresentedFilename = function (windowId, fileName) {
            return this.channel.call('setRepresentedFilename', [windowId, fileName]);
        };
        WindowsChannelClient.prototype.addToRecentlyOpen = function (paths) {
            return this.channel.call('addToRecentlyOpen', paths);
        };
        WindowsChannelClient.prototype.removeFromRecentlyOpen = function (paths) {
            return this.channel.call('removeFromRecentlyOpen', paths);
        };
        WindowsChannelClient.prototype.getRecentlyOpen = function (windowId) {
            return this.channel.call('getRecentlyOpen', windowId);
        };
        WindowsChannelClient.prototype.focusWindow = function (windowId) {
            return this.channel.call('focusWindow', windowId);
        };
        WindowsChannelClient.prototype.isMaximized = function (windowId) {
            return this.channel.call('isMaximized', windowId);
        };
        WindowsChannelClient.prototype.maximizeWindow = function (windowId) {
            return this.channel.call('maximizeWindow', windowId);
        };
        WindowsChannelClient.prototype.unmaximizeWindow = function (windowId) {
            return this.channel.call('unmaximizeWindow', windowId);
        };
        WindowsChannelClient.prototype.setDocumentEdited = function (windowId, flag) {
            return this.channel.call('setDocumentEdited', [windowId, flag]);
        };
        WindowsChannelClient.prototype.toggleMenuBar = function (windowId) {
            return this.channel.call('toggleMenuBar', windowId);
        };
        WindowsChannelClient.prototype.quit = function () {
            return this.channel.call('quit');
        };
        WindowsChannelClient.prototype.windowOpen = function (paths, forceNewWindow) {
            return this.channel.call('windowOpen', [paths, forceNewWindow]);
        };
        WindowsChannelClient.prototype.openNewWindow = function () {
            return this.channel.call('openNewWindow');
        };
        WindowsChannelClient.prototype.showWindow = function (windowId) {
            return this.channel.call('showWindow', windowId);
        };
        WindowsChannelClient.prototype.getWindows = function () {
            return this.channel.call('getWindows');
        };
        WindowsChannelClient.prototype.getWindowCount = function () {
            return this.channel.call('getWindowCount');
        };
        WindowsChannelClient.prototype.log = function (severity) {
            var messages = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                messages[_i - 1] = arguments[_i];
            }
            return this.channel.call('log', [severity, messages]);
        };
        WindowsChannelClient.prototype.closeExtensionHostWindow = function (extensionDevelopmentPath) {
            return this.channel.call('closeExtensionHostWindow', extensionDevelopmentPath);
        };
        WindowsChannelClient.prototype.showItemInFolder = function (path) {
            return this.channel.call('showItemInFolder', path);
        };
        WindowsChannelClient.prototype.openExternal = function (url) {
            return this.channel.call('openExternal', url);
        };
        WindowsChannelClient.prototype.startCrashReporter = function (config) {
            return this.channel.call('startCrashReporter', config);
        };
        return WindowsChannelClient;
    }());
    exports.WindowsChannelClient = WindowsChannelClient;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[116/*vs/platform/windows/electron-main/windowsService*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,13/*vs/base/common/lifecycle*/,8/*vs/base/common/objects*/,11/*vs/platform/environment/common/environment*/,14/*electron*/,4/*vs/base/common/event*/,26/*vs/base/node/event*/,41/*vs/platform/url/common/url*/,34/*vs/code/electron-main/windows*/]), function (require, exports, winjs_base_1, lifecycle_1, objects_1, environment_1, electron_1, event_1, event_2, url_1, windows_1) {
    'use strict';
    var WindowsService = (function () {
        function WindowsService(windowsMainService, environmentService, urlService) {
            this.windowsMainService = windowsMainService;
            this.environmentService = environmentService;
            this.disposables = [];
            this.onWindowOpen = event_2.fromEventEmitter(electron_1.app, 'browser-window-created', function (_, w) { return w.id; });
            this.onWindowFocus = event_2.fromEventEmitter(electron_1.app, 'browser-window-focus', function (_, w) { return w.id; });
            event_1.chain(urlService.onOpenURL)
                .filter(function (uri) { return uri.authority === 'file' && !!uri.path; })
                .map(function (uri) { return uri.path; })
                .on(this.openFileForURI, this, this.disposables);
        }
        WindowsService.prototype.openFileFolderPicker = function (windowId, forceNewWindow) {
            this.windowsMainService.openFileFolderPicker(forceNewWindow);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.openFilePicker = function (windowId, forceNewWindow, path) {
            this.windowsMainService.openFilePicker(forceNewWindow, path);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.openFolderPicker = function (windowId, forceNewWindow) {
            var vscodeWindow = this.windowsMainService.getWindowById(windowId);
            this.windowsMainService.openFolderPicker(forceNewWindow, vscodeWindow);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.reloadWindow = function (windowId) {
            var vscodeWindow = this.windowsMainService.getWindowById(windowId);
            if (vscodeWindow) {
                this.windowsMainService.reload(vscodeWindow);
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.openDevTools = function (windowId) {
            var vscodeWindow = this.windowsMainService.getWindowById(windowId);
            if (vscodeWindow) {
                vscodeWindow.win.webContents.openDevTools();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.toggleDevTools = function (windowId) {
            var vscodeWindow = this.windowsMainService.getWindowById(windowId);
            if (vscodeWindow) {
                var contents = vscodeWindow.win.webContents;
                if (vscodeWindow.hasHiddenTitleBarStyle() && !vscodeWindow.win.isFullScreen() && !contents.isDevToolsOpened()) {
                    contents.openDevTools({ mode: 'undocked' }); // due to https://github.com/electron/electron/issues/3647
                }
                else {
                    contents.toggleDevTools();
                }
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.closeFolder = function (windowId) {
            var vscodeWindow = this.windowsMainService.getWindowById(windowId);
            if (vscodeWindow) {
                this.windowsMainService.open({ cli: this.environmentService.args, forceEmpty: true, windowToUse: vscodeWindow });
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.toggleFullScreen = function (windowId) {
            var vscodeWindow = this.windowsMainService.getWindowById(windowId);
            if (vscodeWindow) {
                vscodeWindow.toggleFullScreen();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.setRepresentedFilename = function (windowId, fileName) {
            var vscodeWindow = this.windowsMainService.getWindowById(windowId);
            if (vscodeWindow) {
                vscodeWindow.win.setRepresentedFilename(fileName);
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.addToRecentlyOpen = function (paths) {
            this.windowsMainService.addToRecentPathsList(paths);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.removeFromRecentlyOpen = function (paths) {
            this.windowsMainService.removeFromRecentPathsList(paths);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.getRecentlyOpen = function (windowId) {
            var vscodeWindow = this.windowsMainService.getWindowById(windowId);
            if (vscodeWindow) {
                var _a = this.windowsMainService.getRecentPathsList(vscodeWindow.config.workspacePath, vscodeWindow.config.filesToOpen), files = _a.files, folders = _a.folders;
                return winjs_base_1.TPromise.as({ files: files, folders: folders });
            }
            return winjs_base_1.TPromise.as({ files: [], folders: [] });
        };
        WindowsService.prototype.focusWindow = function (windowId) {
            var vscodeWindow = this.windowsMainService.getWindowById(windowId);
            if (vscodeWindow) {
                vscodeWindow.win.focus();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.isMaximized = function (windowId) {
            var vscodeWindow = this.windowsMainService.getWindowById(windowId);
            if (vscodeWindow) {
                return winjs_base_1.TPromise.as(vscodeWindow.win.isMaximized());
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.maximizeWindow = function (windowId) {
            var vscodeWindow = this.windowsMainService.getWindowById(windowId);
            if (vscodeWindow) {
                vscodeWindow.win.maximize();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.unmaximizeWindow = function (windowId) {
            var vscodeWindow = this.windowsMainService.getWindowById(windowId);
            if (vscodeWindow) {
                vscodeWindow.win.unmaximize();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.setDocumentEdited = function (windowId, flag) {
            var vscodeWindow = this.windowsMainService.getWindowById(windowId);
            if (vscodeWindow && vscodeWindow.win.isDocumentEdited() !== flag) {
                vscodeWindow.win.setDocumentEdited(flag);
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.toggleMenuBar = function (windowId) {
            this.windowsMainService.toggleMenuBar(windowId);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.windowOpen = function (paths, forceNewWindow) {
            if (!paths || !paths.length) {
                return winjs_base_1.TPromise.as(null);
            }
            this.windowsMainService.open({ cli: this.environmentService.args, pathsToOpen: paths, forceNewWindow: forceNewWindow });
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.openNewWindow = function () {
            this.windowsMainService.openNewWindow();
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.showWindow = function (windowId) {
            var vscodeWindow = this.windowsMainService.getWindowById(windowId);
            if (vscodeWindow) {
                vscodeWindow.win.show();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.getWindows = function () {
            var windows = this.windowsMainService.getWindows();
            var result = windows.map(function (w) { return ({ path: w.openedWorkspacePath, title: w.win.getTitle(), id: w.id }); });
            return winjs_base_1.TPromise.as(result);
        };
        WindowsService.prototype.getWindowCount = function () {
            return winjs_base_1.TPromise.as(this.windowsMainService.getWindows().length);
        };
        WindowsService.prototype.log = function (severity) {
            var messages = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                messages[_i - 1] = arguments[_i];
            }
            (_a = console[severity]).apply.apply(_a, [console].concat(messages));
            return winjs_base_1.TPromise.as(null);
            var _a;
        };
        WindowsService.prototype.closeExtensionHostWindow = function (extensionDevelopmentPath) {
            var windowOnExtension = this.windowsMainService.findWindow(null, null, extensionDevelopmentPath);
            if (windowOnExtension) {
                windowOnExtension.win.close();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.showItemInFolder = function (path) {
            electron_1.shell.showItemInFolder(path);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.openExternal = function (url) {
            electron_1.shell.openExternal(url);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.startCrashReporter = function (config) {
            electron_1.crashReporter.start(config);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.quit = function () {
            this.windowsMainService.quit();
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.openFileForURI = function (filePath) {
            var cli = objects_1.assign(Object.create(null), this.environmentService.args, { goto: true });
            var pathsToOpen = [filePath];
            this.windowsMainService.open({ cli: cli, pathsToOpen: pathsToOpen });
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        WindowsService = __decorate([
            __param(0, windows_1.IWindowsMainService),
            __param(1, environment_1.IEnvironmentService),
            __param(2, url_1.IURLService)
        ], WindowsService);
        return WindowsService;
    }());
    exports.WindowsService = WindowsService;
});

define(__m[117/*vs/workbench/parts/git/common/git*/], __M([0/*require*/,1/*exports*/,3/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
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
        REVERT: 'revert',
        COMMIT: 'commit',
        COMMAND: 'command',
        BACKGROUND_FETCH: 'backgroundfetch',
        PULL: 'pull',
        PUSH: 'push',
        SYNC: 'sync'
    };
    exports.GIT_SERVICE_ID = 'gitService';
    exports.IGitService = instantiation_1.createDecorator(exports.GIT_SERVICE_ID);
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[118/*vs/workbench/parts/git/common/gitIpc*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,20/*vs/base/parts/ipc/common/ipc*/,117/*vs/workbench/parts/git/common/git*/]), function (require, exports, winjs_base_1, ipc_1, git_1) {
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
                case 'commit': return this.service.then(function (s) { return s.commit(args[0], args[1], args[2], args[3]); }).then(RawStatusSerializer.to);
                case 'detectMimetypes': return this.service.then(function (s) { return s.detectMimetypes(args[0], args[1]); });
                case 'show': return this.service.then(function (s) { return s.show(args[0], args[1]); });
                case 'clone': return this.service.then(function (s) { return s.clone(args[0], args[1]); });
                case 'onOutput': return this.service.then(function (s) { return ipc_1.eventToCall(s.onOutput); });
                case 'getCommitTemplate': return this.service.then(function (s) { return s.getCommitTemplate(); });
                case 'getCommit': return this.service.then(function (s) { return s.getCommit(args); });
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
        GitChannelClient.prototype.commit = function (message, amend, stage, signoff) {
            return this.channel.call('commit', [message, amend, stage, signoff]).then(RawStatusSerializer.from);
        };
        GitChannelClient.prototype.detectMimetypes = function (path, treeish) {
            return this.channel.call('detectMimetypes', [path, treeish]);
        };
        GitChannelClient.prototype.show = function (path, treeish) {
            return this.channel.call('show', [path, treeish]);
        };
        GitChannelClient.prototype.clone = function (url, parentPath) {
            return this.channel.call('clone', [url, parentPath]);
        };
        GitChannelClient.prototype.getCommitTemplate = function () {
            return this.channel.call('getCommitTemplate');
        };
        GitChannelClient.prototype.getCommit = function (ref) {
            return this.channel.call('getCommit', ref);
        };
        return GitChannelClient;
    }());
    exports.GitChannelClient = GitChannelClient;
    var AskpassChannel = (function () {
        function AskpassChannel(service) {
            this.service = service;
        }
        AskpassChannel.prototype.call = function (command, args) {
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
            return this.channel.call('askpass', [id, host, command]);
        };
        return AskpassChannelClient;
    }());
    exports.AskpassChannelClient = AskpassChannelClient;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[119/*vs/workbench/parts/git/electron-main/askpassService*/], __M([0/*require*/,1/*exports*/,72/*vs/nls!vs/workbench/parts/git/electron-main/askpassService*/,14/*electron*/,5/*vs/base/common/platform*/,2/*vs/base/common/winjs.base*/]), function (require, exports, nls, electron_1, platform, winjs_base_1) {
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
define(__m[37/*vs/base/node/request*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,6/*vs/base/common/types*/,121/*https*/,122/*http*/,89/*url*/,25/*fs*/,8/*vs/base/common/objects*/,123/*zlib*/]), function (require, exports, winjs_base_1, types_1, https, http, url_1, fs_1, objects_1, zlib_1) {
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










define(__m[102/*vs/platform/request/node/requestService*/], __M([0/*require*/,1/*exports*/,8/*vs/base/common/objects*/,37/*vs/base/node/request*/,85/*vs/base/node/proxy*/,12/*vs/platform/configuration/common/configuration*/]), function (require, exports, objects_1, request_1, proxy_1, configuration_1) {
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














define(__m[92/*vs/platform/update/electron-main/auto-updater.linux*/], __M([0/*require*/,1/*exports*/,91/*events*/,6/*vs/base/common/types*/,37/*vs/base/node/request*/,40/*vs/platform/request/node/request*/,15/*vs/platform/product*/]), function (require, exports, events_1, types_1, request_1, request_2, product_1) {
    'use strict';
    var LinuxAutoUpdaterImpl = (function (_super) {
        __extends(LinuxAutoUpdaterImpl, _super);
        function LinuxAutoUpdaterImpl(requestService) {
            _super.call(this);
            this.requestService = requestService;
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
            this.currentRequest = this.requestService.request({ url: this.url })
                .then(request_1.asJson)
                .then(function (update) {
                if (!update || !update.url || !update.version || !update.productVersion) {
                    _this.emit('update-not-available');
                }
                else {
                    _this.emit('update-available', null, product_1.default.downloadUrl, update.productVersion);
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
        LinuxAutoUpdaterImpl.prototype.quitAndInstall = function () {
            // noop
        };
        LinuxAutoUpdaterImpl = __decorate([
            __param(0, request_2.IRequestService)
        ], LinuxAutoUpdaterImpl);
        return LinuxAutoUpdaterImpl;
    }(events_1.EventEmitter));
    exports.LinuxAutoUpdaterImpl = LinuxAutoUpdaterImpl;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[79/*vs/platform/update/electron-main/auto-updater.win32*/], __M([0/*require*/,1/*exports*/,7/*path*/,51/*vs/base/node/pfs*/,113/*vs/base/node/crypto*/,91/*events*/,31/*os*/,46/*child_process*/,36/*vs/base/node/extfs*/,6/*vs/base/common/types*/,2/*vs/base/common/winjs.base*/,37/*vs/base/node/request*/,40/*vs/platform/request/node/request*/,15/*vs/platform/product*/]), function (require, exports, path, pfs, crypto_1, events_1, os_1, child_process_1, extfs_1, types_1, winjs_base_1, request_1, request_2, product_1) {
    'use strict';
    var Win32AutoUpdaterImpl = (function (_super) {
        __extends(Win32AutoUpdaterImpl, _super);
        function Win32AutoUpdaterImpl(requestService) {
            _super.call(this);
            this.requestService = requestService;
            this.url = null;
            this.currentRequest = null;
            this.updatePackagePath = null;
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
            this.currentRequest = this.requestService.request({ url: this.url })
                .then(request_1.asJson)
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
                            return _this.requestService.request({ url: url })
                                .then(function (context) { return request_1.download(downloadPath, context); })
                                .then(hash ? function () { return crypto_1.checksum(downloadPath, update.hash); } : function () { return null; })
                                .then(function () { return pfs.rename(downloadPath, updatePackagePath); })
                                .then(function () { return updatePackagePath; });
                        });
                    }).then(function (updatePackagePath) {
                        _this.updatePackagePath = updatePackagePath;
                        _this.emit('update-downloaded', {}, update.releaseNotes, update.productVersion, new Date(), _this.url);
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
            return this.cachePath.then(function (cachePath) { return path.join(cachePath, "CodeSetup-" + product_1.default.quality + "-" + version + ".exe"); });
        };
        Win32AutoUpdaterImpl.prototype.cleanup = function (exceptVersion) {
            if (exceptVersion === void 0) { exceptVersion = null; }
            var filter = exceptVersion ? function (one) { return !(new RegExp(product_1.default.quality + "-" + exceptVersion + "\\.exe$").test(one)); } : function () { return true; };
            return this.cachePath
                .then(function (cachePath) { return pfs.readdir(cachePath)
                .then(function (all) { return winjs_base_1.Promise.join(all
                .filter(filter)
                .map(function (one) { return pfs.unlink(path.join(cachePath, one)).then(null, function () { return null; }); })); }); });
        };
        Win32AutoUpdaterImpl.prototype.quitAndInstall = function () {
            if (!this.updatePackagePath) {
                return;
            }
            child_process_1.spawn(this.updatePackagePath, ['/silent', '/mergetasks=runcode,!desktopicon,!quicklaunchicon'], {
                detached: true,
                stdio: ['ignore', 'ignore', 'ignore']
            });
        };
        Win32AutoUpdaterImpl = __decorate([
            __param(0, request_2.IRequestService)
        ], Win32AutoUpdaterImpl);
        return Win32AutoUpdaterImpl;
    }(events_1.EventEmitter));
    exports.Win32AutoUpdaterImpl = Win32AutoUpdaterImpl;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[103/*vs/platform/update/electron-main/updateService*/], __M([0/*require*/,1/*exports*/,28/*original-fs*/,7/*path*/,14/*electron*/,13/*vs/base/common/lifecycle*/,4/*vs/base/common/event*/,33/*vs/base/common/async*/,52/*vs/base/common/decorators*/,26/*vs/base/node/event*/,12/*vs/platform/configuration/common/configuration*/,79/*vs/platform/update/electron-main/auto-updater.win32*/,92/*vs/platform/update/electron-main/auto-updater.linux*/,39/*vs/code/electron-main/lifecycle*/,3/*vs/platform/instantiation/common/instantiation*/,15/*vs/platform/product*/,2/*vs/base/common/winjs.base*/,29/*vs/platform/update/common/update*/,32/*vs/platform/telemetry/common/telemetry*/]), function (require, exports, fs, path, electron, lifecycle_1, event_1, async_1, decorators_1, event_2, configuration_1, auto_updater_win32_1, auto_updater_linux_1, lifecycle_2, instantiation_1, product_1, winjs_base_1, update_1, telemetry_1) {
    'use strict';
    var UpdateService = (function () {
        function UpdateService(instantiationService, lifecycleService, configurationService, telemetryService) {
            this.lifecycleService = lifecycleService;
            this.configurationService = configurationService;
            this.telemetryService = telemetryService;
            this._state = update_1.State.Uninitialized;
            this._availableUpdate = null;
            this.throttler = new async_1.Throttler();
            this._onError = new event_1.Emitter();
            this._onCheckForUpdate = new event_1.Emitter();
            this._onUpdateAvailable = new event_1.Emitter();
            this._onUpdateNotAvailable = new event_1.Emitter();
            this._onUpdateReady = new event_1.Emitter();
            this._onStateChange = new event_1.Emitter();
            if (process.platform === 'win32') {
                this.raw = instantiationService.createInstance(auto_updater_win32_1.Win32AutoUpdaterImpl);
            }
            else if (process.platform === 'linux') {
                this.raw = instantiationService.createInstance(auto_updater_linux_1.LinuxAutoUpdaterImpl);
            }
            else if (process.platform === 'darwin') {
                this.raw = electron.autoUpdater;
            }
            else {
                return;
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
            this.state = update_1.State.Idle;
            // Start checking for updates after 30 seconds
            this.scheduleCheckForUpdates(30 * 1000)
                .done(null, function (err) { return console.error(err); });
        }
        Object.defineProperty(UpdateService.prototype, "onError", {
            get: function () { return this._onError.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onCheckForUpdate", {
            get: function () { return this._onCheckForUpdate.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onUpdateAvailable", {
            get: function () { return this._onUpdateAvailable.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onUpdateNotAvailable", {
            get: function () { return this._onUpdateNotAvailable.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onUpdateReady", {
            get: function () { return this._onUpdateReady.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onStateChange", {
            get: function () { return this._onStateChange.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onRawError", {
            get: function () {
                return event_2.fromEventEmitter(this.raw, 'error', function (_, message) { return message; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onRawUpdateNotAvailable", {
            get: function () {
                return event_2.fromEventEmitter(this.raw, 'update-not-available');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onRawUpdateAvailable", {
            get: function () {
                return event_1.filterEvent(event_2.fromEventEmitter(this.raw, 'update-available', function (_, url, version) { return ({ url: url, version: version }); }), function (_a) {
                    var url = _a.url;
                    return !!url;
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onRawUpdateDownloaded", {
            get: function () {
                return event_2.fromEventEmitter(this.raw, 'update-downloaded', function (_, releaseNotes, version, date, url) { return ({ releaseNotes: releaseNotes, version: version, date: date }); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "state", {
            get: function () {
                return this._state;
            },
            set: function (state) {
                this._state = state;
                this._onStateChange.fire(state);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "availableUpdate", {
            get: function () {
                return this._availableUpdate;
            },
            enumerable: true,
            configurable: true
        });
        UpdateService.prototype.scheduleCheckForUpdates = function (delay) {
            var _this = this;
            if (delay === void 0) { delay = 60 * 60 * 1000; }
            return winjs_base_1.TPromise.timeout(delay)
                .then(function () { return _this.checkForUpdates(); })
                .then(function (update) {
                if (update) {
                    // Update found, no need to check more
                    return winjs_base_1.TPromise.as(null);
                }
                // Check again after 1 hour
                return _this.scheduleCheckForUpdates(60 * 60 * 1000);
            });
        };
        UpdateService.prototype.checkForUpdates = function (explicit) {
            var _this = this;
            if (explicit === void 0) { explicit = false; }
            return this.throttler.queue(function () { return _this._checkForUpdates(explicit); })
                .then(null, function (err) { return _this._onError.fire(err); });
        };
        UpdateService.prototype._checkForUpdates = function (explicit) {
            var _this = this;
            if (this.state !== update_1.State.Idle) {
                return winjs_base_1.TPromise.as(null);
            }
            this._onCheckForUpdate.fire();
            this.state = update_1.State.CheckingForUpdate;
            var listeners = [];
            var result = new winjs_base_1.TPromise(function (c, e) {
                event_1.once(_this.onRawError)(e, null, listeners);
                event_1.once(_this.onRawUpdateNotAvailable)(function () { return c(null); }, null, listeners);
                event_1.once(_this.onRawUpdateAvailable)(function (_a) {
                    var url = _a.url, version = _a.version;
                    return url && c({ url: url, version: version });
                }, null, listeners);
                event_1.once(_this.onRawUpdateDownloaded)(function (_a) {
                    var version = _a.version, date = _a.date, releaseNotes = _a.releaseNotes;
                    return c({ version: version, date: date, releaseNotes: releaseNotes });
                }, null, listeners);
                _this.raw.checkForUpdates();
            }).then(function (update) {
                if (!update) {
                    _this._onUpdateNotAvailable.fire(explicit);
                    _this.state = update_1.State.Idle;
                    _this.telemetryService.publicLog('update:notAvailable', { explicit: explicit });
                }
                else if (update.url) {
                    var data = {
                        url: update.url,
                        releaseNotes: '',
                        version: update.version,
                        date: new Date()
                    };
                    _this._availableUpdate = data;
                    _this._onUpdateAvailable.fire({ url: update.url, version: update.version });
                    _this.state = update_1.State.UpdateAvailable;
                }
                else {
                    var data = {
                        releaseNotes: update.releaseNotes,
                        version: update.version,
                        date: update.date
                    };
                    _this._availableUpdate = data;
                    _this._onUpdateReady.fire(data);
                    _this.state = update_1.State.UpdateDownloaded;
                    _this.telemetryService.publicLog('update:downloaded', { version: update.version });
                }
                return update;
            }, function (err) {
                _this.state = update_1.State.Idle;
                return winjs_base_1.TPromise.wrapError(err);
            });
            return async_1.always(result, function () { return lifecycle_1.dispose(listeners); });
        };
        UpdateService.prototype.getUpdateChannel = function () {
            var config = this.configurationService.getConfiguration('update');
            var channel = config && config.channel;
            return channel === 'none' ? null : product_1.default.quality;
        };
        UpdateService.prototype.getUpdateFeedUrl = function (channel) {
            if (!channel) {
                return null;
            }
            if (process.platform === 'win32' && !fs.existsSync(path.join(path.dirname(process.execPath), 'unins000.exe'))) {
                return null;
            }
            if (!product_1.default.updateUrl || !product_1.default.commit) {
                return null;
            }
            var platform = process.platform === 'linux' ? "linux-" + process.arch : process.platform;
            return product_1.default.updateUrl + "/api/update/" + platform + "/" + channel + "/" + product_1.default.commit;
        };
        UpdateService.prototype.quitAndInstall = function () {
            var _this = this;
            if (!this._availableUpdate) {
                return winjs_base_1.TPromise.as(null);
            }
            if (this._availableUpdate.url) {
                electron.shell.openExternal(this._availableUpdate.url);
                return winjs_base_1.TPromise.as(null);
            }
            this.lifecycleService.quit(true /* from update */).done(function (vetod) {
                if (vetod) {
                    return;
                }
                // for some reason updating on Mac causes the local storage not to be flushed.
                // we workaround this issue by forcing an explicit flush of the storage data.
                // see also https://github.com/Microsoft/vscode/issues/172
                if (process.platform === 'darwin') {
                    electron.session.defaultSession.flushStorageData();
                }
                _this.raw.quitAndInstall();
            });
            return winjs_base_1.TPromise.as(null);
        };
        __decorate([
            decorators_1.memoize
        ], UpdateService.prototype, "onRawError", null);
        __decorate([
            decorators_1.memoize
        ], UpdateService.prototype, "onRawUpdateNotAvailable", null);
        __decorate([
            decorators_1.memoize
        ], UpdateService.prototype, "onRawUpdateAvailable", null);
        __decorate([
            decorators_1.memoize
        ], UpdateService.prototype, "onRawUpdateDownloaded", null);
        UpdateService = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, lifecycle_2.ILifecycleService),
            __param(2, configuration_1.IConfigurationService),
            __param(3, telemetry_1.ITelemetryService)
        ], UpdateService);
        return UpdateService;
    }());
    exports.UpdateService = UpdateService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[129/*vs/code/electron-main/main*/], __M([0/*require*/,1/*exports*/,14/*electron*/,8/*vs/base/common/objects*/,5/*vs/base/common/platform*/,45/*vs/platform/environment/node/argv*/,51/*vs/base/node/pfs*/,49/*vs/code/electron-main/paths*/,34/*vs/code/electron-main/windows*/,55/*vs/platform/windows/common/windows*/,115/*vs/platform/windows/common/windowsIpc*/,116/*vs/platform/windows/electron-main/windowsService*/,39/*vs/code/electron-main/lifecycle*/,108/*vs/code/electron-main/menus*/,29/*vs/platform/update/common/update*/,109/*vs/platform/update/common/updateIpc*/,103/*vs/platform/update/electron-main/updateService*/,98/*vs/base/parts/ipc/electron-main/ipc.electron-main*/,100/*vs/base/parts/ipc/node/ipc.net*/,2/*vs/base/common/winjs.base*/,118/*vs/workbench/parts/git/common/gitIpc*/,119/*vs/workbench/parts/git/electron-main/askpassService*/,110/*vs/code/node/sharedProcess*/,111/*vs/code/electron-main/launch*/,3/*vs/platform/instantiation/common/instantiation*/,86/*vs/platform/instantiation/common/instantiationService*/,54/*vs/platform/instantiation/common/serviceCollection*/,43/*vs/platform/instantiation/common/descriptors*/,23/*vs/code/electron-main/log*/,24/*vs/code/electron-main/storage*/,44/*vs/platform/backup/common/backup*/,73/*vs/platform/backup/common/backupIpc*/,83/*vs/platform/backup/electron-main/backupMainService*/,11/*vs/platform/environment/common/environment*/,101/*vs/platform/environment/node/environmentService*/,12/*vs/platform/configuration/common/configuration*/,96/*vs/platform/configuration/node/configurationService*/,40/*vs/platform/request/node/request*/,102/*vs/platform/request/node/requestService*/,30/*vs/base/common/uuid*/,41/*vs/platform/url/common/url*/,114/*vs/platform/url/common/urlIpc*/,112/*vs/platform/url/electron-main/urlService*/,32/*vs/platform/telemetry/common/telemetry*/,104/*vs/platform/telemetry/common/telemetryIpc*/,105/*vs/platform/telemetry/common/telemetryService*/,106/*vs/platform/telemetry/node/commonProperties*/,20/*vs/base/parts/ipc/common/ipc*/,15/*vs/platform/product*/,35/*vs/platform/package*/,28/*original-fs*/,46/*child_process*/]), function (require, exports, electron_1, objects_1, platform, argv_1, pfs_1, paths_1, windows_1, windows_2, windowsIpc_1, windowsService_1, lifecycle_1, menus_1, update_1, updateIpc_1, updateService_1, ipc_electron_main_1, ipc_net_1, winjs_base_1, gitIpc_1, askpassService_1, sharedProcess_1, launch_1, instantiation_1, instantiationService_1, serviceCollection_1, descriptors_1, log_1, storage_1, backup_1, backupIpc_1, backupMainService_1, environment_1, environmentService_1, configuration_1, configurationService_1, request_1, requestService_1, uuid_1, url_1, urlIpc_1, urlService_1, telemetry_1, telemetryIpc_1, telemetryService_1, commonProperties_1, ipc_1, product_1, package_1, fs, cp) {
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
    // TODO@Joao wow this is huge, clean up!
    function main(accessor, mainIpcServer, userEnv) {
        var instantiationService = accessor.get(instantiation_1.IInstantiationService);
        var logService = accessor.get(log_1.ILogService);
        var environmentService = accessor.get(environment_1.IEnvironmentService);
        var lifecycleService = accessor.get(lifecycle_1.ILifecycleService);
        var configurationService = accessor.get(configuration_1.IConfigurationService);
        var windowsMainService;
        // We handle uncaught exceptions here to prevent electron from opening a dialog to the user
        process.on('uncaughtException', function (err) {
            if (err) {
                // take only the message and stack property
                var friendlyError = {
                    message: err.message,
                    stack: err.stack
                };
                // handle on client side
                if (windowsMainService) {
                    windowsMainService.sendToFocused('vscode:reportError', JSON.stringify(friendlyError));
                }
            }
            console.error('[uncaught exception in main]: ' + err);
            if (err.stack) {
                console.error(err.stack);
            }
        });
        logService.log('Starting VS Code in verbose mode');
        logService.log("from: " + environmentService.appRoot);
        logService.log('args:', environmentService.args);
        // Setup Windows mutex
        var windowsMutex = null;
        if (platform.isWindows) {
            try {
                var Mutex_1 = require.__$__nodeRequire('windows-mutex').Mutex;
                windowsMutex = new Mutex_1(product_1.default.win32MutexName);
            }
            catch (e) {
            }
        }
        // Register Main IPC services
        var askpassService = new askpassService_1.GitAskpassService();
        var askpassChannel = new gitIpc_1.AskpassChannel(askpassService);
        mainIpcServer.registerChannel('askpass', askpassChannel);
        // Create Electron IPC Server
        var electronIpcServer = new ipc_electron_main_1.Server();
        // Spawn shared process
        var initData = { args: environmentService.args };
        var options = {
            allowOutput: !environmentService.isBuilt || environmentService.verbose,
            debugPort: environmentService.isBuilt ? null : 5871
        };
        var sharedProcessDisposable;
        var sharedProcess = sharedProcess_1.spawnSharedProcess(initData, options).then(function (disposable) {
            sharedProcessDisposable = disposable;
            return ipc_net_1.connect(environmentService.sharedIPCHandle, 'main');
        });
        // Create a new service collection, because the telemetry service
        // requires a connection to shared process, which was only established
        // now.
        var services = new serviceCollection_1.ServiceCollection();
        services.set(update_1.IUpdateService, new descriptors_1.SyncDescriptor(updateService_1.UpdateService));
        services.set(windows_1.IWindowsMainService, new descriptors_1.SyncDescriptor(windows_1.WindowsManager));
        services.set(windows_2.IWindowsService, new descriptors_1.SyncDescriptor(windowsService_1.WindowsService));
        services.set(launch_1.ILaunchService, new descriptors_1.SyncDescriptor(launch_1.LaunchService));
        if (environmentService.isBuilt && !environmentService.isExtensionDevelopment && !!product_1.default.enableTelemetry) {
            var channel = ipc_1.getDelayedChannel(sharedProcess.then(function (c) { return c.getChannel('telemetryAppender'); }));
            var appender = new telemetryIpc_1.TelemetryAppenderClient(channel);
            var commonProperties = commonProperties_1.resolveCommonProperties(product_1.default.commit, package_1.default.version);
            var piiPaths = [environmentService.appRoot, environmentService.extensionsPath];
            var config = { appender: appender, commonProperties: commonProperties, piiPaths: piiPaths };
            services.set(telemetry_1.ITelemetryService, new descriptors_1.SyncDescriptor(telemetryService_1.TelemetryService, config));
        }
        else {
            services.set(telemetry_1.ITelemetryService, telemetry_1.NullTelemetryService);
        }
        var instantiationService2 = instantiationService.createChild(services);
        instantiationService2.invokeFunction(function (accessor) {
            // TODO@Joao: unfold this
            windowsMainService = accessor.get(windows_1.IWindowsMainService);
            // Register more Main IPC services
            var launchService = accessor.get(launch_1.ILaunchService);
            var launchChannel = new launch_1.LaunchChannel(launchService);
            mainIpcServer.registerChannel('launch', launchChannel);
            // Register more Electron IPC services
            var updateService = accessor.get(update_1.IUpdateService);
            var updateChannel = new updateIpc_1.UpdateChannel(updateService);
            electronIpcServer.registerChannel('update', updateChannel);
            var urlService = accessor.get(url_1.IURLService);
            var urlChannel = instantiationService2.createInstance(urlIpc_1.URLChannel, urlService);
            electronIpcServer.registerChannel('url', urlChannel);
            var backupService = accessor.get(backup_1.IBackupMainService);
            var backupChannel = instantiationService2.createInstance(backupIpc_1.BackupChannel, backupService);
            electronIpcServer.registerChannel('backup', backupChannel);
            var windowsService = accessor.get(windows_2.IWindowsService);
            var windowsChannel = new windowsIpc_1.WindowsChannel(windowsService);
            electronIpcServer.registerChannel('windows', windowsChannel);
            sharedProcess.done(function (client) { return client.registerChannel('windows', windowsChannel); });
            // Make sure we associate the program with the app user model id
            // This will help Windows to associate the running program with
            // any shortcut that is pinned to the taskbar and prevent showing
            // two icons in the taskbar for the same app.
            if (platform.isWindows && product_1.default.win32AppUserModelId) {
                electron_1.app.setAppUserModelId(product_1.default.win32AppUserModelId);
            }
            function dispose() {
                if (mainIpcServer) {
                    mainIpcServer.dispose();
                    mainIpcServer = null;
                }
                if (sharedProcessDisposable) {
                    sharedProcessDisposable.dispose();
                }
                if (windowsMutex) {
                    windowsMutex.release();
                }
                configurationService.dispose();
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
            // Propagate to clients
            windowsMainService.ready(userEnv);
            // Install Menu
            var menu = instantiationService2.createInstance(menus_1.VSCodeMenu);
            menu.ready();
            // Open our first window
            if (environmentService.args['new-window'] && environmentService.args._.length === 0) {
                windowsMainService.open({ cli: environmentService.args, forceNewWindow: true, forceEmpty: true, initialStartup: true }); // new window if "-n" was used without paths
            }
            else if (global.macOpenFiles && global.macOpenFiles.length && (!environmentService.args._ || !environmentService.args._.length)) {
                windowsMainService.open({ cli: environmentService.args, pathsToOpen: global.macOpenFiles, initialStartup: true }); // mac: open-file event received on startup
            }
            else {
                windowsMainService.open({ cli: environmentService.args, forceNewWindow: environmentService.args['new-window'], diffMode: environmentService.args.diff, initialStartup: true }); // default: read paths from cli
            }
        });
    }
    function setupIPC(accessor) {
        var logService = accessor.get(log_1.ILogService);
        var environmentService = accessor.get(environment_1.IEnvironmentService);
        function allowSetForegroundWindow(service) {
            var promise = winjs_base_1.TPromise.as(null);
            if (platform.isWindows) {
                promise = service.getMainProcessId()
                    .then(function (processId) {
                    logService.log('Sending some foreground love to the running instance:', processId);
                    try {
                        var allowSetForegroundWindow_1 = require.__$__nodeRequire('windows-foreground-love').allowSetForegroundWindow;
                        allowSetForegroundWindow_1(processId);
                    }
                    catch (e) {
                    }
                });
            }
            return promise;
        }
        function setup(retry) {
            return ipc_net_1.serve(environmentService.mainIPCHandle).then(function (server) {
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
                return ipc_net_1.connect(environmentService.mainIPCHandle, 'main').then(function (client) {
                    // Tests from CLI require to be the only instance currently (TODO@Ben support multiple instances and output)
                    if (environmentService.extensionTestsPath && !environmentService.debugExtensionHost.break) {
                        var msg = 'Running extension tests from the command line is currently only supported if no other instance of Code is running.';
                        console.error(msg);
                        client.dispose();
                        return winjs_base_1.TPromise.wrapError(msg);
                    }
                    logService.log('Sending env to running instance...');
                    var channel = client.getChannel('launch');
                    var service = new launch_1.LaunchChannelClient(channel);
                    return allowSetForegroundWindow(service)
                        .then(function () { return service.start(environmentService.args, process.env); })
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
                        fs.unlinkSync(environmentService.mainIPCHandle);
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
    function getUnixShellEnvironment() {
        var promise = new winjs_base_1.TPromise(function (c, e) {
            var runAsNode = process.env['ELECTRON_RUN_AS_NODE'];
            var noAttach = process.env['ELECTRON_NO_ATTACH_CONSOLE'];
            var mark = uuid_1.generateUuid().replace(/-/g, '').substr(0, 12);
            var regex = new RegExp(mark + '(.*)' + mark);
            var env = objects_1.assign({}, process.env, {
                ELECTRON_RUN_AS_NODE: '1',
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
                    var env_1 = JSON.parse(rawStripped);
                    if (runAsNode) {
                        env_1['ELECTRON_RUN_AS_NODE'] = runAsNode;
                    }
                    else {
                        delete env_1['ELECTRON_RUN_AS_NODE'];
                    }
                    if (noAttach) {
                        env_1['ELECTRON_NO_ATTACH_CONSOLE'] = noAttach;
                    }
                    else {
                        delete env_1['ELECTRON_NO_ATTACH_CONSOLE'];
                    }
                    c(env_1);
                }
                catch (err) {
                    e(err);
                }
            });
        });
        // swallow errors
        return promise.then(null, function () { return ({}); });
    }
    /**
     * We eed to get the environment from a user's shell.
     * This should only be done when Code itself is not launched
     * from within a shell.
     */
    function getShellEnvironment() {
        if (process.env['VSCODE_CLI'] === '1') {
            return winjs_base_1.TPromise.as({});
        }
        if (platform.isWindows) {
            return winjs_base_1.TPromise.as({});
        }
        return getUnixShellEnvironment();
    }
    function createPaths(environmentService) {
        var paths = [
            environmentService.appSettingsHome,
            environmentService.userProductHome,
            environmentService.extensionsPath,
            environmentService.nodeCachedDataDir
        ];
        return winjs_base_1.TPromise.join(paths.map(function (p) { return pfs_1.mkdirp(p); }));
    }
    function createServices(args) {
        var services = new serviceCollection_1.ServiceCollection();
        services.set(environment_1.IEnvironmentService, new descriptors_1.SyncDescriptor(environmentService_1.EnvironmentService, args, process.execPath));
        services.set(log_1.ILogService, new descriptors_1.SyncDescriptor(log_1.MainLogService));
        services.set(lifecycle_1.ILifecycleService, new descriptors_1.SyncDescriptor(lifecycle_1.LifecycleService));
        services.set(storage_1.IStorageService, new descriptors_1.SyncDescriptor(storage_1.StorageService));
        services.set(configuration_1.IConfigurationService, new descriptors_1.SyncDescriptor(configurationService_1.ConfigurationService));
        services.set(request_1.IRequestService, new descriptors_1.SyncDescriptor(requestService_1.RequestService));
        services.set(url_1.IURLService, new descriptors_1.SyncDescriptor(urlService_1.URLService, args['open-url']));
        services.set(backup_1.IBackupMainService, new descriptors_1.SyncDescriptor(backupMainService_1.BackupMainService));
        return new instantiationService_1.InstantiationService(services, true);
    }
    function start() {
        var args;
        try {
            args = argv_1.parseMainProcessArgv(process.argv);
            args = paths_1.validatePaths(args);
        }
        catch (err) {
            console.error(err.message);
            process.exit(1);
            return;
        }
        var instantiationService = createServices(args);
        // On some platforms we need to manually read from the global environment variables
        // and assign them to the process environment (e.g. when doubleclick app on Mac)
        return getShellEnvironment().then(function (shellEnv) {
            // Patch `process.env` with the user's shell environment
            objects_1.assign(process.env, shellEnv);
            return instantiationService.invokeFunction(function (accessor) {
                var environmentService = accessor.get(environment_1.IEnvironmentService);
                var instanceEnv = {
                    VSCODE_PID: String(process.pid),
                    VSCODE_IPC_HOOK: environmentService.mainIPCHandle,
                    VSCODE_SHARED_IPC_HOOK: environmentService.sharedIPCHandle,
                    VSCODE_NLS_CONFIG: process.env['VSCODE_NLS_CONFIG']
                };
                // Patch `process.env` with the instance's environment
                objects_1.assign(process.env, instanceEnv);
                // Collect all environment patches to send to other processes
                var env = objects_1.assign({}, shellEnv, instanceEnv);
                return instantiationService.invokeFunction(function (a) { return createPaths(a.get(environment_1.IEnvironmentService)); })
                    .then(function () { return instantiationService.invokeFunction(setupIPC); })
                    .then(function (mainIpcServer) { return instantiationService.invokeFunction(main, mainIpcServer, env); });
            });
        }).done(null, function (err) { return instantiationService.invokeFunction(quit, err); });
    }
    start();
});

}).call(this);
//# sourceMappingURL=main.js.map
