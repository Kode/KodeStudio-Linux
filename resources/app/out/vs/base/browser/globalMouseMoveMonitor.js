/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/lifecycle', 'vs/base/browser/dom', 'vs/base/browser/mouseEvent', 'vs/base/browser/iframe'], function (require, exports, Lifecycle, DomUtils, Mouse, IframeUtils) {
    function standardMouseMoveMerger(lastEvent, currentEvent) {
        var ev = new Mouse.StandardMouseEvent(currentEvent);
        ev.preventDefault();
        return {
            leftButton: ev.leftButton,
            posx: ev.posx,
            posy: ev.posy
        };
    }
    exports.standardMouseMoveMerger = standardMouseMoveMerger;
    var GlobalMouseMoveMonitor = (function () {
        function GlobalMouseMoveMonitor() {
            this.hooks = [];
            this.mouseMoveEventMerger = null;
            this.mouseMoveCallback = null;
            this.onStopCallback = null;
        }
        GlobalMouseMoveMonitor.prototype.dispose = function () {
            this.stopMonitoring(false);
        };
        GlobalMouseMoveMonitor.prototype.stopMonitoring = function (invokeStopCallback) {
            if (!this.isMonitoring()) {
                // Not monitoring
                return;
            }
            // Unhook
            this.hooks = Lifecycle.disposeAll(this.hooks);
            this.mouseMoveEventMerger = null;
            this.mouseMoveCallback = null;
            var onStopCallback = this.onStopCallback;
            this.onStopCallback = null;
            if (invokeStopCallback) {
                onStopCallback();
            }
        };
        GlobalMouseMoveMonitor.prototype.isMonitoring = function () {
            return this.hooks.length > 0;
        };
        GlobalMouseMoveMonitor.prototype.startMonitoring = function (mouseMoveEventMerger, mouseMoveCallback, onStopCallback) {
            var _this = this;
            if (this.isMonitoring()) {
                // I am already hooked
                return;
            }
            this.mouseMoveEventMerger = mouseMoveEventMerger;
            this.mouseMoveCallback = mouseMoveCallback;
            this.onStopCallback = onStopCallback;
            var windowChain = IframeUtils.getSameOriginWindowChain();
            for (var i = 0; i < windowChain.length; i++) {
                this.hooks.push(DomUtils.addDisposableThrottledListener(windowChain[i].window.document, 'mousemove', function (data) { return _this.mouseMoveCallback(data); }, function (lastEvent, currentEvent) { return _this.mouseMoveEventMerger(lastEvent, currentEvent); }));
                this.hooks.push(DomUtils.addDisposableListener(windowChain[i].window.document, 'mouseup', function (e) { return _this.stopMonitoring(true); }));
            }
            if (IframeUtils.hasDifferentOriginAncestor()) {
                var lastSameOriginAncestor = windowChain[windowChain.length - 1];
                // We might miss a mouse up if it happens outside the iframe
                // This one is for Chrome
                this.hooks.push(DomUtils.addDisposableListener(lastSameOriginAncestor.window.document, 'mouseout', function (browserEvent) {
                    var e = new Mouse.StandardMouseEvent(browserEvent);
                    if (e.target.tagName.toLowerCase() === 'html') {
                        _this.stopMonitoring(true);
                    }
                }));
                // This one is for FF
                this.hooks.push(DomUtils.addDisposableListener(lastSameOriginAncestor.window.document, 'mouseover', function (browserEvent) {
                    var e = new Mouse.StandardMouseEvent(browserEvent);
                    if (e.target.tagName.toLowerCase() === 'html') {
                        _this.stopMonitoring(true);
                    }
                }));
                // This one is for IE
                this.hooks.push(DomUtils.addDisposableListener(lastSameOriginAncestor.window.document.body, 'mouseleave', function (browserEvent) {
                    _this.stopMonitoring(true);
                }));
            }
        };
        return GlobalMouseMoveMonitor;
    })();
    exports.GlobalMouseMoveMonitor = GlobalMouseMoveMonitor;
});
//# sourceMappingURL=globalMouseMoveMonitor.js.map