/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports"], function (require, exports) {
    exports.empty = Object.freeze({
        dispose: function () { }
    });
    function disposeAll(arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i]) {
                arr[i].dispose();
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
    })();
    exports.Disposable = Disposable;
});
//# sourceMappingURL=lifecycle.js.map