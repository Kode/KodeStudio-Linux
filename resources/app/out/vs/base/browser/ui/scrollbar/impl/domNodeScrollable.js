/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/browser/dom', 'vs/base/browser/touch', 'vs/base/common/eventEmitter'], function (require, exports, DomUtils, touch_1, eventEmitter_1) {
    var DomNodeScrollable = (function () {
        function DomNodeScrollable(domNode) {
            this.eventEmitterHelper = new eventEmitter_1.EventEmitter();
            this.domNode = domNode;
            this.gestureHandler = new touch_1.Gesture(this.domNode);
        }
        DomNodeScrollable.prototype.getScrollHeight = function () {
            return this.domNode.scrollHeight;
        };
        DomNodeScrollable.prototype.getScrollWidth = function () {
            return this.domNode.scrollWidth;
        };
        DomNodeScrollable.prototype.getScrollLeft = function () {
            return this.domNode.scrollLeft;
        };
        DomNodeScrollable.prototype.setScrollLeft = function (scrollLeft) {
            this.domNode.scrollLeft = scrollLeft;
        };
        DomNodeScrollable.prototype.getScrollTop = function () {
            return this.domNode.scrollTop;
        };
        DomNodeScrollable.prototype.setScrollTop = function (scrollTop) {
            this.domNode.scrollTop = scrollTop;
        };
        DomNodeScrollable.prototype.addScrollListener = function (callback) {
            var _this = this;
            var localDisposable = this.eventEmitterHelper.addListener2('scroll', callback);
            var domDisposable = DomUtils.addDisposableListener(this.domNode, 'scroll', function (e) {
                _this.eventEmitterHelper.emit('scroll', { browserEvent: e });
            });
            return {
                dispose: function () {
                    domDisposable.dispose();
                    localDisposable.dispose();
                }
            };
        };
        DomNodeScrollable.prototype.dispose = function () {
            this.domNode = null;
            this.eventEmitterHelper.dispose();
            if (this.gestureHandler) {
                this.gestureHandler.dispose();
                this.gestureHandler = null;
            }
        };
        return DomNodeScrollable;
    })();
    exports.DomNodeScrollable = DomNodeScrollable;
});
//# sourceMappingURL=domNodeScrollable.js.map