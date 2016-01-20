/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/browser/dom', 'vs/base/common/lifecycle'], function (require, exports, DomUtils, Lifecycle) {
    var KeyboardController = (function () {
        function KeyboardController(domNode) {
            var _this = this;
            this._listeners = {};
            this._previousKeyDown = null;
            this._previousEventType = null;
            this._toDispose = [];
            this._toDispose.push(DomUtils.addStandardDisposableListener(domNode, 'keydown', function (e) { return _this._onKeyDown(e); }));
            this._toDispose.push(DomUtils.addStandardDisposableListener(domNode, 'keypress', function (e) { return _this._onKeyPress(e); }));
            this._toDispose.push(DomUtils.addStandardDisposableListener(domNode, 'keyup', function (e) { return _this._onKeyUp(e); }));
            this._toDispose.push(DomUtils.addDisposableListener(domNode, 'input', function (e) { return _this._onInput(e); }));
        }
        KeyboardController.prototype.dispose = function () {
            this._toDispose = Lifecycle.disposeAll(this._toDispose);
            this._listeners = null;
            this._previousKeyDown = null;
            this._previousEventType = null;
        };
        KeyboardController.prototype.addListener = function (type, callback) {
            var _this = this;
            this._listeners[type] = callback;
            return function () {
                _this._listeners[type] = null;
            };
        };
        KeyboardController.prototype._fire = function (type, event) {
            if (this._listeners.hasOwnProperty(type)) {
                this._listeners[type](event);
            }
        };
        KeyboardController.prototype._onKeyDown = function (e) {
            this._previousKeyDown = e.clone();
            this._previousEventType = 'keydown';
            this._fire('keydown', e);
        };
        KeyboardController.prototype._onKeyPress = function (e) {
            if (this._previousKeyDown) {
                if (e.shiftKey && this._previousKeyDown.asKeybinding() !== e.asKeybinding()) {
                    // Looks like Shift changed the resulting character, so eat it up!
                    e.shiftKey = false;
                }
                if (this._previousEventType === 'keypress') {
                    // Ensure a keydown is alwas fired before a keypress
                    this._fire('keydown', this._previousKeyDown);
                }
            }
            this._previousEventType = 'keypress';
            this._fire('keypress', e);
        };
        KeyboardController.prototype._onInput = function (e) {
            this._fire('input', e);
        };
        KeyboardController.prototype._onKeyUp = function (e) {
            this._fire('keyup', e);
        };
        return KeyboardController;
    })();
    exports.KeyboardController = KeyboardController;
});
//# sourceMappingURL=keyboardController.js.map