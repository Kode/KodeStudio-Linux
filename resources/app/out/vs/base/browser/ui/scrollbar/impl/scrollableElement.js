/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/browser/dom', 'vs/base/browser/mouseEvent', 'vs/base/common/platform', 'vs/base/browser/ui/scrollbar/impl/common', 'vs/base/browser/ui/scrollbar/impl/domNodeScrollable', 'vs/base/browser/ui/scrollbar/impl/horizontalScrollbar', 'vs/base/browser/ui/scrollbar/impl/verticalScrollbar', 'vs/base/common/lifecycle', 'vs/css!./scrollbars'], function (require, exports, DomUtils, mouseEvent_1, Platform, common_1, domNodeScrollable_1, horizontalScrollbar_1, verticalScrollbar_1, lifecycle_1) {
    var HIDE_TIMEOUT = 500;
    var SCROLL_WHEEL_SENSITIVITY = 50;
    var ScrollableElement = (function () {
        function ScrollableElement(element, options, dimensions) {
            var _this = this;
            if (dimensions === void 0) { dimensions = null; }
            this.originalElement = element;
            this.originalElement.style.overflow = 'hidden';
            this.options = this._createOptions(options);
            if (this.options.scrollable) {
                this.scrollable = this.options.scrollable;
            }
            else {
                this.scrollable = new domNodeScrollable_1.DomNodeScrollable(this.originalElement);
            }
            this.verticalScrollbarWidth = this.options.verticalScrollbarSize;
            this.horizontalScrollbarHeight = this.options.horizontalScrollbarSize;
            this.verticalScrollbar = new verticalScrollbar_1.VerticalScrollbar(this.scrollable, this, this.options);
            this.horizontalScrollbar = new horizontalScrollbar_1.HorizontalScrollbar(this.scrollable, this, this.options);
            this.domNode = document.createElement('div');
            this.domNode.className = 'monaco-scrollable-element ' + this.options.className;
            this.domNode.setAttribute('aria-hidden', 'true');
            this.domNode.setAttribute('role', 'presentation');
            this.domNode.style.position = 'relative';
            this.domNode.style.overflow = 'hidden';
            this.domNode.appendChild(this.originalElement);
            this.domNode.appendChild(this.horizontalScrollbar.domNode);
            this.domNode.appendChild(this.verticalScrollbar.domNode);
            if (this.options.useShadows) {
                this.leftShadowDomNode = document.createElement('div');
                this.leftShadowDomNode.className = 'shadow';
                this.domNode.appendChild(this.leftShadowDomNode);
            }
            if (this.options.useShadows) {
                this.topShadowDomNode = document.createElement('div');
                this.topShadowDomNode.className = 'shadow';
                this.domNode.appendChild(this.topShadowDomNode);
                this.topLeftShadowDomNode = document.createElement('div');
                this.topLeftShadowDomNode.className = 'shadow top-left-corner';
                this.domNode.appendChild(this.topLeftShadowDomNode);
            }
            this.listenOnDomNode = this.options.listenOnDomNode || this.domNode;
            this.toDispose = [];
            this.toDispose.push(this.scrollable.addScrollListener(function () { return _this._onScroll(); }));
            this._mouseWheelToDispose = [];
            this._setListeningToMouseWheel(this.options.handleMouseWheel);
            this.toDispose.push(DomUtils.addDisposableListener(this.listenOnDomNode, 'mouseover', function (e) { return _this._onMouseOver(e); }));
            this.toDispose.push(DomUtils.addDisposableNonBubblingMouseOutListener(this.listenOnDomNode, function (e) { return _this._onMouseOut(e); }));
            this.onElementDimensionsTimeout = -1;
            this.onElementInternalDimensionsTimeout = -1;
            this.hideTimeout = -1;
            this.isDragging = false;
            this.mouseIsOver = false;
            this.onElementDimensions(dimensions, true);
            this.onElementInternalDimensions(true);
        }
        ScrollableElement.prototype.dispose = function () {
            this.toDispose = lifecycle_1.disposeAll(this.toDispose);
            this._mouseWheelToDispose = lifecycle_1.disposeAll(this._mouseWheelToDispose);
            this.verticalScrollbar.destroy();
            this.horizontalScrollbar.destroy();
            if (this.onElementDimensionsTimeout !== -1) {
                window.clearTimeout(this.onElementDimensionsTimeout);
                this.onElementDimensionsTimeout = -1;
            }
            if (this.onElementInternalDimensionsTimeout !== -1) {
                window.clearTimeout(this.onElementInternalDimensionsTimeout);
                this.onElementInternalDimensionsTimeout = -1;
            }
        };
        ScrollableElement.prototype.getDomNode = function () {
            return this.domNode;
        };
        ScrollableElement.prototype.getOverviewRulerLayoutInfo = function () {
            return {
                parent: this.domNode,
                insertBefore: this.verticalScrollbar.domNode,
            };
        };
        ScrollableElement.prototype.getVerticalSliderDomNode = function () {
            return this.verticalScrollbar.slider;
        };
        ScrollableElement.prototype.delegateVerticalScrollbarMouseDown = function (browserEvent) {
            this.verticalScrollbar.delegateMouseDown(browserEvent);
        };
        ScrollableElement.prototype.onElementDimensions = function (dimensions, synchronous) {
            var _this = this;
            if (dimensions === void 0) { dimensions = null; }
            if (synchronous === void 0) { synchronous = false; }
            if (synchronous) {
                this.actualElementDimensions(dimensions);
            }
            else {
                if (this.onElementDimensionsTimeout === -1) {
                    this.onElementDimensionsTimeout = window.setTimeout(function () { return _this.actualElementDimensions(dimensions); }, 0);
                }
            }
        };
        ScrollableElement.prototype.actualElementDimensions = function (dimensions) {
            if (dimensions === void 0) { dimensions = null; }
            this.onElementDimensionsTimeout = -1;
            if (!dimensions) {
                dimensions = {
                    width: this.domNode.clientWidth,
                    height: this.domNode.clientHeight
                };
            }
            this.dimensions = this._computeDimensions(dimensions.width, dimensions.height);
            this.verticalScrollbar.onElementSize(this.dimensions.height);
            this.horizontalScrollbar.onElementSize(this.dimensions.width);
        };
        ScrollableElement.prototype.onElementInternalDimensions = function (synchronous) {
            var _this = this;
            if (synchronous === void 0) { synchronous = false; }
            if (synchronous) {
                this.actualElementInternalDimensions();
            }
            else {
                if (this.onElementInternalDimensionsTimeout === -1) {
                    this.onElementInternalDimensionsTimeout = window.setTimeout(function () { return _this.actualElementInternalDimensions(); }, 0);
                }
            }
        };
        ScrollableElement.prototype.actualElementInternalDimensions = function () {
            this.onElementInternalDimensionsTimeout = -1;
            this.horizontalScrollbar.onElementScrollSize(this.scrollable.getScrollWidth());
            this.verticalScrollbar.onElementScrollSize(this.scrollable.getScrollHeight());
        };
        ScrollableElement.prototype.updateClassName = function (newClassName) {
            this.options.className = newClassName;
            // Defaults are different on Macs
            if (Platform.isMacintosh) {
                this.options.className += ' mac';
            }
            this.domNode.className = 'monaco-scrollable-element ' + this.options.className;
        };
        ScrollableElement.prototype.updateOptions = function (newOptions) {
            // only support handleMouseWheel changes for now
            var massagedOptions = this._createOptions(newOptions);
            this.options.handleMouseWheel = massagedOptions.handleMouseWheel;
            this.options.mouseWheelScrollSensitivity = massagedOptions.mouseWheelScrollSensitivity;
            this._setListeningToMouseWheel(this.options.handleMouseWheel);
        };
        // -------------------- mouse wheel scrolling --------------------
        ScrollableElement.prototype._setListeningToMouseWheel = function (shouldListen) {
            var _this = this;
            var isListening = (this._mouseWheelToDispose.length > 0);
            if (isListening === shouldListen) {
                // No change
                return;
            }
            // Stop listening (if necessary)
            this._mouseWheelToDispose = lifecycle_1.disposeAll(this._mouseWheelToDispose);
            // Start listening (if necessary)
            if (shouldListen) {
                var onMouseWheel = function (browserEvent) {
                    var e = new mouseEvent_1.StandardMouseWheelEvent(browserEvent);
                    _this.onMouseWheel(e);
                };
                this._mouseWheelToDispose.push(DomUtils.addDisposableListener(this.listenOnDomNode, 'mousewheel', onMouseWheel));
                this._mouseWheelToDispose.push(DomUtils.addDisposableListener(this.listenOnDomNode, 'DOMMouseScroll', onMouseWheel));
            }
        };
        ScrollableElement.prototype.onMouseWheel = function (e) {
            if (Platform.isMacintosh && e.browserEvent && this.options.saveLastScrollTimeOnClassName) {
                // Mark dom node with timestamp of wheel event
                var target = e.browserEvent.target;
                if (target && target.nodeType === 1) {
                    var r = DomUtils.findParentWithClass(target, this.options.saveLastScrollTimeOnClassName);
                    if (r) {
                        r.setAttribute('last-scroll-time', String(new Date().getTime()));
                    }
                }
            }
            var desiredScrollTop = -1;
            var desiredScrollLeft = -1;
            if (e.deltaY || e.deltaX) {
                var deltaY = e.deltaY * this.options.mouseWheelScrollSensitivity;
                var deltaX = e.deltaX * this.options.mouseWheelScrollSensitivity;
                if (this.options.flipAxes) {
                    deltaY = e.deltaX;
                    deltaX = e.deltaY;
                }
                if (Platform.isMacintosh) {
                    // Give preference to vertical scrolling
                    if (deltaY && Math.abs(deltaX) < 0.2) {
                        deltaX = 0;
                    }
                    if (Math.abs(deltaY) > Math.abs(deltaX) * 0.5) {
                        deltaX = 0;
                    }
                }
                if (deltaY) {
                    var currentScrollTop = this.scrollable.getScrollTop();
                    desiredScrollTop = this.verticalScrollbar.validateScrollPosition((desiredScrollTop !== -1 ? desiredScrollTop : currentScrollTop) - SCROLL_WHEEL_SENSITIVITY * deltaY);
                    if (desiredScrollTop === currentScrollTop) {
                        desiredScrollTop = -1;
                    }
                }
                if (deltaX) {
                    var currentScrollLeft = this.scrollable.getScrollLeft();
                    desiredScrollLeft = this.horizontalScrollbar.validateScrollPosition((desiredScrollLeft !== -1 ? desiredScrollLeft : currentScrollLeft) - SCROLL_WHEEL_SENSITIVITY * deltaX);
                    if (desiredScrollLeft === currentScrollLeft) {
                        desiredScrollLeft = -1;
                    }
                }
                if (desiredScrollTop !== -1 || desiredScrollLeft !== -1) {
                    if (desiredScrollTop !== -1) {
                        this.verticalScrollbar.setDesiredScrollPosition(desiredScrollTop);
                        desiredScrollTop = -1;
                    }
                    if (desiredScrollLeft !== -1) {
                        this.horizontalScrollbar.setDesiredScrollPosition(desiredScrollLeft);
                        desiredScrollLeft = -1;
                    }
                }
            }
            e.preventDefault();
            e.stopPropagation();
        };
        ScrollableElement.prototype._onScroll = function () {
            var scrollHeight = this.scrollable.getScrollHeight();
            var scrollTop = this.scrollable.getScrollTop();
            var scrollWidth = this.scrollable.getScrollWidth();
            var scrollLeft = this.scrollable.getScrollLeft();
            this.verticalScrollbar.onElementScrollPosition(scrollTop);
            this.horizontalScrollbar.onElementScrollPosition(scrollLeft);
            if (this.options.useShadows) {
                var enableTop = scrollHeight > 0 && scrollTop > 0;
                var enableLeft = this.options.useShadows && scrollWidth > 0 && scrollLeft > 0;
                if (this.topShadowDomNode) {
                    DomUtils.toggleClass(this.topShadowDomNode, 'top', enableTop);
                }
                if (this.topLeftShadowDomNode) {
                    DomUtils.toggleClass(this.topLeftShadowDomNode, 'top', enableTop);
                }
                if (this.leftShadowDomNode) {
                    DomUtils.toggleClass(this.leftShadowDomNode, 'left', enableLeft);
                }
                if (this.topLeftShadowDomNode) {
                    DomUtils.toggleClass(this.topLeftShadowDomNode, 'left', enableLeft);
                }
            }
            this._reveal();
        };
        // -------------------- fade in / fade out --------------------
        ScrollableElement.prototype.onDragStart = function () {
            this.isDragging = true;
            this._reveal();
        };
        ScrollableElement.prototype.onDragEnd = function () {
            this.isDragging = false;
            this._hide();
        };
        ScrollableElement.prototype._onMouseOut = function (e) {
            this.mouseIsOver = false;
            this._hide();
        };
        ScrollableElement.prototype._onMouseOver = function (e) {
            this.mouseIsOver = true;
            this._reveal();
        };
        ScrollableElement.prototype._reveal = function () {
            this.verticalScrollbar.beginReveal();
            this.horizontalScrollbar.beginReveal();
            this._scheduleHide();
        };
        ScrollableElement.prototype._hide = function () {
            if (!this.mouseIsOver && !this.isDragging) {
                this.verticalScrollbar.beginHide();
                this.horizontalScrollbar.beginHide();
            }
        };
        ScrollableElement.prototype._scheduleHide = function () {
            if (this.hideTimeout !== -1) {
                window.clearTimeout(this.hideTimeout);
            }
            this.hideTimeout = window.setTimeout(this._hide.bind(this), HIDE_TIMEOUT);
        };
        // -------------------- size & layout --------------------
        ScrollableElement.prototype._computeDimensions = function (clientWidth, clientHeight) {
            var width = clientWidth;
            var height = clientHeight;
            return {
                width: width,
                height: height
            };
        };
        ScrollableElement.prototype._createOptions = function (options) {
            function ensureValue(source, prop, value) {
                if (source.hasOwnProperty(prop)) {
                    return source[prop];
                }
                return value;
            }
            var result = {
                forbidTranslate3dUse: ensureValue(options, 'forbidTranslate3dUse', false),
                className: ensureValue(options, 'className', ''),
                useShadows: ensureValue(options, 'useShadows', true),
                handleMouseWheel: ensureValue(options, 'handleMouseWheel', true),
                flipAxes: ensureValue(options, 'flipAxes', false),
                mouseWheelScrollSensitivity: ensureValue(options, 'mouseWheelScrollSensitivity', 1),
                arrowSize: ensureValue(options, 'arrowSize', 11),
                scrollable: ensureValue(options, 'scrollable', null),
                listenOnDomNode: ensureValue(options, 'listenOnDomNode', null),
                horizontal: common_1.visibilityFromString(ensureValue(options, 'horizontal', 'auto')),
                horizontalScrollbarSize: ensureValue(options, 'horizontalScrollbarSize', 10),
                horizontalSliderSize: 0,
                horizontalHasArrows: ensureValue(options, 'horizontalHasArrows', false),
                vertical: common_1.visibilityFromString(ensureValue(options, 'vertical', 'auto')),
                verticalScrollbarSize: ensureValue(options, 'verticalScrollbarSize', 10),
                verticalHasArrows: ensureValue(options, 'verticalHasArrows', false),
                verticalSliderSize: 0,
                saveLastScrollTimeOnClassName: ensureValue(options, 'saveLastScrollTimeOnClassName', null)
            };
            result.horizontalSliderSize = ensureValue(options, 'horizontalSliderSize', result.horizontalScrollbarSize);
            result.verticalSliderSize = ensureValue(options, 'verticalSliderSize', result.verticalScrollbarSize);
            // Defaults are different on Macs
            if (Platform.isMacintosh) {
                result.className += ' mac';
            }
            return result;
        };
        return ScrollableElement;
    })();
    exports.ScrollableElement = ScrollableElement;
});
//# sourceMappingURL=scrollableElement.js.map