/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/browser/dom', 'vs/base/browser/mouseEvent', 'vs/base/browser/ui/scrollbar/impl/common', 'vs/base/common/lifecycle', 'vs/base/browser/globalMouseMoveMonitor', 'vs/base/browser/browser', 'vs/base/common/platform'], function (require, exports, DomUtils, mouseEvent_1, common_1, lifecycle_1, globalMouseMoveMonitor_1, Browser, Platform) {
    var ScrollbarState = (function () {
        function ScrollbarState(arrowSize, scrollbarSize, oppositeScrollbarSize) {
            this.visibleSize = 0;
            this.scrollSize = 0;
            this.scrollPosition = 0;
            this.scrollbarSize = scrollbarSize;
            this.oppositeScrollbarSize = oppositeScrollbarSize;
            this.arrowSize = arrowSize;
            this.refreshComputedValues();
        }
        ScrollbarState.prototype.setVisibleSize = function (visibleSize) {
            if (this.visibleSize !== visibleSize) {
                this.visibleSize = visibleSize;
                this.refreshComputedValues();
                return true;
            }
            return false;
        };
        ScrollbarState.prototype.setScrollSize = function (scrollSize) {
            if (this.scrollSize !== scrollSize) {
                this.scrollSize = scrollSize;
                this.refreshComputedValues();
                return true;
            }
            return false;
        };
        ScrollbarState.prototype.setScrollPosition = function (scrollPosition) {
            if (this.scrollPosition !== scrollPosition) {
                this.scrollPosition = scrollPosition;
                this.refreshComputedValues();
                return true;
            }
            return false;
        };
        ScrollbarState.prototype.refreshComputedValues = function () {
            this.computedAvailableSize = Math.max(0, this.visibleSize - this.oppositeScrollbarSize);
            this.computedRepresentableSize = Math.max(0, this.computedAvailableSize - 2 * this.arrowSize);
            this.computedRatio = this.scrollSize > 0 ? (this.computedRepresentableSize / this.scrollSize) : 0;
            this.computedIsNeeded = (this.scrollSize > this.visibleSize);
            if (!this.computedIsNeeded) {
                this.computedSliderSize = this.computedRepresentableSize;
                this.computedSliderPosition = 0;
            }
            else {
                this.computedSliderSize = Math.floor(this.visibleSize * this.computedRatio);
                this.computedSliderPosition = Math.floor(this.scrollPosition * this.computedRatio);
                if (this.computedSliderSize < ScrollbarState.MINIMUM_SLIDER_SIZE) {
                    // We must artificially increase the size of the slider, since the slider would be too small otherwise
                    // The effort is to keep the slider centered around the original position, but we must take into
                    // account the cases when the slider is too close to the top or too close to the bottom
                    var sliderArtificialOffset = (ScrollbarState.MINIMUM_SLIDER_SIZE - this.computedSliderSize) / 2;
                    this.computedSliderSize = ScrollbarState.MINIMUM_SLIDER_SIZE;
                    this.computedSliderPosition -= sliderArtificialOffset;
                    if (this.computedSliderPosition + this.computedSliderSize > this.computedRepresentableSize) {
                        // Slider is too close to the bottom, so we glue it to the bottom
                        this.computedSliderPosition = this.computedRepresentableSize - this.computedSliderSize;
                    }
                    if (this.computedSliderPosition < 0) {
                        // Slider is too close to the top, so we glue it to the top
                        this.computedSliderPosition = 0;
                    }
                }
            }
        };
        ScrollbarState.prototype.getArrowSize = function () {
            return this.arrowSize;
        };
        ScrollbarState.prototype.getRectangleLargeSize = function () {
            return this.computedAvailableSize;
        };
        ScrollbarState.prototype.getRectangleSmallSize = function () {
            return this.scrollbarSize;
        };
        ScrollbarState.prototype.isNeeded = function () {
            return this.computedIsNeeded;
        };
        ScrollbarState.prototype.getSliderSize = function () {
            return this.computedSliderSize;
        };
        ScrollbarState.prototype.getSliderPosition = function () {
            return this.computedSliderPosition;
        };
        ScrollbarState.prototype.convertSliderPositionToScrollPosition = function (desiredSliderPosition) {
            return desiredSliderPosition / this.computedRatio;
        };
        ScrollbarState.prototype.validateScrollPosition = function (desiredScrollPosition) {
            desiredScrollPosition = Math.round(desiredScrollPosition);
            desiredScrollPosition = Math.max(desiredScrollPosition, 0);
            desiredScrollPosition = Math.min(desiredScrollPosition, this.scrollSize - this.visibleSize);
            return desiredScrollPosition;
        };
        ScrollbarState.MINIMUM_SLIDER_SIZE = 20;
        return ScrollbarState;
    })();
    exports.ScrollbarState = ScrollbarState;
    var ScrollbarArrow = (function () {
        function ScrollbarArrow(className, top, left, bottom, right, bgWidth, bgHeight, mouseWheelEventFactory, parent) {
            var _this = this;
            this.parent = parent;
            this.mouseWheelEventFactory = mouseWheelEventFactory;
            this.bgDomNode = document.createElement('div');
            this.bgDomNode.className = 'arrow-background';
            this.bgDomNode.style.position = 'absolute';
            setSize(this.bgDomNode, bgWidth, bgHeight);
            setPosition(this.bgDomNode, (top !== null ? 0 : null), (left !== null ? 0 : null), (bottom !== null ? 0 : null), (right !== null ? 0 : null));
            this.domNode = document.createElement('div');
            this.domNode.className = className;
            this.domNode.style.position = 'absolute';
            setSize(this.domNode, AbstractScrollbar.ARROW_IMG_SIZE, AbstractScrollbar.ARROW_IMG_SIZE);
            setPosition(this.domNode, top, left, bottom, right);
            this.mouseMoveMonitor = new globalMouseMoveMonitor_1.GlobalMouseMoveMonitor();
            this.toDispose = [];
            this.toDispose.push(DomUtils.addDisposableListener(this.bgDomNode, 'mousedown', function (e) { return _this._arrowMouseDown(e); }));
            this.toDispose.push(DomUtils.addDisposableListener(this.domNode, 'mousedown', function (e) { return _this._arrowMouseDown(e); }));
            this.toDispose.push(this.mouseMoveMonitor);
            this.interval = -1;
            this.timeout = -1;
        }
        ScrollbarArrow.prototype.dispose = function () {
            this.toDispose = lifecycle_1.disposeAll(this.toDispose);
            this._clearArrowTimers();
        };
        ScrollbarArrow.prototype._arrowMouseDown = function (browserEvent) {
            var _this = this;
            var repeater = function () {
                _this.parent.onMouseWheel(_this.mouseWheelEventFactory());
            };
            var scheduleRepeater = function () {
                _this.interval = window.setInterval(repeater, 1000 / 24);
            };
            repeater();
            this._clearArrowTimers();
            this.timeout = window.setTimeout(scheduleRepeater, 200);
            this.mouseMoveMonitor.startMonitoring(globalMouseMoveMonitor_1.standardMouseMoveMerger, function (mouseMoveData) {
                /* Intentional empty */
            }, function () {
                _this._clearArrowTimers();
            });
            var mouseEvent = new mouseEvent_1.StandardMouseEvent(browserEvent);
            mouseEvent.preventDefault();
        };
        ScrollbarArrow.prototype._clearArrowTimers = function () {
            if (this.interval !== -1) {
                window.clearInterval(this.interval);
                this.interval = -1;
            }
            if (this.timeout !== -1) {
                window.clearTimeout(this.timeout);
                this.timeout = -1;
            }
        };
        return ScrollbarArrow;
    })();
    var VisibilityController = (function () {
        function VisibilityController(visibility, visibleClassName, invisibleClassName) {
            this._revealTimeout = -1;
            this.visibility = visibility;
            this.visibleClassName = visibleClassName;
            this.invisibleClassName = invisibleClassName;
            this.domNode = null;
            this.isVisible = false;
            this.isNeeded = false;
            this.shouldBeVisible = false;
            this.fadeAwayTimeout = -1;
        }
        VisibilityController.prototype.dispose = function () {
            if (this.fadeAwayTimeout !== -1) {
                window.clearTimeout(this.fadeAwayTimeout);
                this.fadeAwayTimeout = -1;
            }
            if (this._revealTimeout !== -1) {
                window.clearTimeout(this._revealTimeout);
                this._revealTimeout = -1;
            }
        };
        // ----------------- Hide / Reveal
        VisibilityController.prototype.applyVisibilitySetting = function (shouldBeVisible) {
            if (this.visibility === common_1.Visibility.Hidden) {
                return false;
            }
            if (this.visibility === common_1.Visibility.Visible) {
                return true;
            }
            return shouldBeVisible;
        };
        VisibilityController.prototype.setShouldBeVisible = function (rawShouldBeVisible) {
            var shouldBeVisible = this.applyVisibilitySetting(rawShouldBeVisible);
            if (this.shouldBeVisible !== shouldBeVisible) {
                this.shouldBeVisible = shouldBeVisible;
                this.ensureVisibility();
            }
        };
        VisibilityController.prototype.setIsNeeded = function (isNeeded) {
            if (this.isNeeded !== isNeeded) {
                this.isNeeded = isNeeded;
                this.ensureVisibility();
            }
        };
        VisibilityController.prototype.setDomNode = function (domNode) {
            this.domNode = domNode;
            this.domNode.className = this.invisibleClassName;
            // Now that the flags & the dom node are in a consistent state, ensure the Hidden/Visible configuration
            this.setShouldBeVisible(false);
        };
        VisibilityController.prototype.ensureVisibility = function () {
            if (!this.isNeeded) {
                // Nothing to be rendered
                this._hide(false);
                return;
            }
            if (this.shouldBeVisible) {
                this._reveal();
            }
            else {
                this._hide(true);
            }
        };
        VisibilityController.prototype._reveal = function () {
            var _this = this;
            if (this.isVisible) {
                return;
            }
            this.isVisible = true;
            // The CSS animation doesn't play otherwise
            if (this._revealTimeout === -1) {
                this._revealTimeout = window.setTimeout(function () {
                    _this._revealTimeout = -1;
                    _this.domNode.className = _this.visibleClassName;
                }, 0);
            }
            // Cancel the fade away timeout, if installed
            if (this.fadeAwayTimeout !== -1) {
                window.clearTimeout(this.fadeAwayTimeout);
                this.fadeAwayTimeout = -1;
            }
        };
        VisibilityController.prototype._hide = function (withFadeAway) {
            if (this._revealTimeout !== -1) {
                window.clearTimeout(this._revealTimeout);
                this._revealTimeout = -1;
            }
            if (!this.isVisible) {
                return;
            }
            this.isVisible = false;
            this.domNode.className = this.invisibleClassName + (withFadeAway ? ' fade' : '');
        };
        return VisibilityController;
    })();
    var AbstractScrollbar = (function () {
        function AbstractScrollbar(forbidTranslate3dUse, parent, scrollbarState, visibility, extraScrollbarClassName) {
            this.forbidTranslate3dUse = forbidTranslate3dUse;
            this.parent = parent;
            this.scrollbarState = scrollbarState;
            this.visibilityController = new VisibilityController(visibility, 'visible scrollbar ' + extraScrollbarClassName, 'invisible scrollbar ' + extraScrollbarClassName);
            this.mouseMoveMonitor = new globalMouseMoveMonitor_1.GlobalMouseMoveMonitor();
            this.toDispose = [];
            this.toDispose.push(this.visibilityController);
            this.toDispose.push(this.mouseMoveMonitor);
        }
        // ----------------- initialize & clean-up
        /**
         * Creates the container dom node for the scrollbar & hooks up the events
         */
        AbstractScrollbar.prototype._createDomNode = function () {
            var _this = this;
            this.domNode = document.createElement('div');
            if (!this.forbidTranslate3dUse && Browser.canUseTranslate3d) {
                // Put the worker reporter in its own layer
                this.domNode.style.transform = 'translate3d(0px, 0px, 0px)';
            }
            this.visibilityController.setDomNode(this.domNode);
            this.domNode.style.position = 'absolute';
            this.toDispose.push(DomUtils.addDisposableListener(this.domNode, 'mousedown', function (e) { return _this._domNodeMouseDown(e); }));
        };
        /**
         * Creates the dom node for an arrow & adds it to the container
         */
        AbstractScrollbar.prototype._createArrow = function (className, top, left, bottom, right, bgWidth, bgHeight, mouseWheelEventFactory) {
            var arrow = new ScrollbarArrow(className, top, left, bottom, right, bgWidth, bgHeight, mouseWheelEventFactory, this.parent);
            this.domNode.appendChild(arrow.bgDomNode);
            this.domNode.appendChild(arrow.domNode);
            this.toDispose.push(arrow);
        };
        /**
         * Creates the slider dom node, adds it to the container & hooks up the events
         */
        AbstractScrollbar.prototype._createSlider = function (top, left, width, height) {
            var _this = this;
            this.slider = document.createElement('div');
            this.slider.className = 'slider';
            this.slider.style.position = 'absolute';
            setPosition(this.slider, top, left, null, null);
            setSize(this.slider, width, height);
            this.domNode.appendChild(this.slider);
            this.toDispose.push(DomUtils.addDisposableListener(this.slider, 'mousedown', function (e) { return _this._sliderMouseDown(new mouseEvent_1.StandardMouseEvent(e)); }));
        };
        /**
         * Clean-up
         */
        AbstractScrollbar.prototype.destroy = function () {
            this.toDispose = lifecycle_1.disposeAll(this.toDispose);
        };
        // ----------------- Update state
        AbstractScrollbar.prototype.onElementSize = function (visibleSize) {
            if (this.scrollbarState.setVisibleSize(visibleSize)) {
                this._renderDomNode(this.scrollbarState.getRectangleLargeSize(), this.scrollbarState.getRectangleSmallSize());
                this._renderSlider();
                this.visibilityController.setIsNeeded(this.scrollbarState.isNeeded());
            }
        };
        AbstractScrollbar.prototype.onElementScrollSize = function (elementScrollSize) {
            if (this.scrollbarState.setScrollSize(elementScrollSize)) {
                this._renderSlider();
                this.visibilityController.setIsNeeded(this.scrollbarState.isNeeded());
            }
        };
        AbstractScrollbar.prototype.onElementScrollPosition = function (elementScrollPosition) {
            if (this.scrollbarState.setScrollPosition(elementScrollPosition)) {
                this._renderSlider();
                this.visibilityController.setIsNeeded(this.scrollbarState.isNeeded());
            }
        };
        // ----------------- rendering
        AbstractScrollbar.prototype.beginReveal = function () {
            this.visibilityController.setShouldBeVisible(true);
        };
        AbstractScrollbar.prototype.beginHide = function () {
            this.visibilityController.setShouldBeVisible(false);
        };
        AbstractScrollbar.prototype._renderSlider = function () {
            this._updateSlider(this.scrollbarState.getSliderSize(), this.scrollbarState.getArrowSize() + this.scrollbarState.getSliderPosition());
        };
        // ----------------- DOM events
        AbstractScrollbar.prototype._domNodeMouseDown = function (browserEvent) {
            var e = new mouseEvent_1.StandardMouseEvent(browserEvent);
            if (e.target !== this.domNode) {
                return;
            }
            this._onMouseDown(e);
        };
        AbstractScrollbar.prototype.delegateMouseDown = function (browserEvent) {
            var e = new mouseEvent_1.StandardMouseEvent(browserEvent);
            var domTop = this.domNode.getClientRects()[0].top;
            var sliderStart = domTop + this.scrollbarState.getSliderPosition();
            var sliderStop = domTop + this.scrollbarState.getSliderPosition() + this.scrollbarState.getSliderSize();
            var mousePos = this._sliderMousePosition(e);
            if (sliderStart <= mousePos && mousePos <= sliderStop) {
                // Act as if it was a mouse down on the slider
                this._sliderMouseDown(e);
            }
            else {
                // Act as if it was a mouse down on the scrollbar
                this._onMouseDown(e);
            }
        };
        AbstractScrollbar.prototype._onMouseDown = function (e) {
            var domNodePosition = DomUtils.getDomNodePosition(this.domNode);
            var desiredSliderPosition = this._mouseDownRelativePosition(e, domNodePosition) - this.scrollbarState.getArrowSize() - this.scrollbarState.getSliderSize() / 2;
            this.setDesiredScrollPosition(this.scrollbarState.convertSliderPositionToScrollPosition(desiredSliderPosition));
            this._sliderMouseDown(e);
        };
        AbstractScrollbar.prototype._sliderMouseDown = function (e) {
            var _this = this;
            if (e.leftButton) {
                var initialMouseOrthogonalPosition = this._sliderOrthogonalMousePosition(e);
                var initialScrollPosition = this._getScrollPosition();
                var draggingDelta = this._sliderMousePosition(e) - this.scrollbarState.getSliderPosition();
                DomUtils.toggleClass(this.slider, 'active', true);
                this.mouseMoveMonitor.startMonitoring(globalMouseMoveMonitor_1.standardMouseMoveMerger, function (mouseMoveData) {
                    var mouseOrthogonalPosition = _this._sliderOrthogonalMousePosition(mouseMoveData);
                    var mouseOrthogonalDelta = Math.abs(mouseOrthogonalPosition - initialMouseOrthogonalPosition);
                    // console.log(initialMouseOrthogonalPosition + ' -> ' + mouseOrthogonalPosition + ': ' + mouseOrthogonalDelta);
                    if (Platform.isWindows && mouseOrthogonalDelta > AbstractScrollbar.MOUSE_DRAG_RESET_DISTANCE) {
                        // The mouse has wondered away from the scrollbar => reset dragging
                        _this.setDesiredScrollPosition(initialScrollPosition);
                    }
                    else {
                        var desiredSliderPosition = _this._sliderMousePosition(mouseMoveData) - draggingDelta;
                        _this.setDesiredScrollPosition(_this.scrollbarState.convertSliderPositionToScrollPosition(desiredSliderPosition));
                    }
                }, function () {
                    DomUtils.toggleClass(_this.slider, 'active', false);
                    _this.parent.onDragEnd();
                });
                e.preventDefault();
                this.parent.onDragStart();
            }
        };
        AbstractScrollbar.prototype.validateScrollPosition = function (desiredScrollPosition) {
            return this.scrollbarState.validateScrollPosition(desiredScrollPosition);
        };
        AbstractScrollbar.prototype.setDesiredScrollPosition = function (desiredScrollPosition) {
            desiredScrollPosition = this.validateScrollPosition(desiredScrollPosition);
            this._setScrollPosition(desiredScrollPosition);
            this.onElementScrollPosition(desiredScrollPosition);
            this._renderSlider();
        };
        // ----------------- Overwrite these
        AbstractScrollbar.prototype._renderDomNode = function (largeSize, smallSize) {
        };
        AbstractScrollbar.prototype._updateSlider = function (sliderSize, sliderPosition) {
        };
        AbstractScrollbar.prototype._mouseDownRelativePosition = function (e, domNodePosition) {
            return 0;
        };
        AbstractScrollbar.prototype._sliderMousePosition = function (e) {
            return 0;
        };
        AbstractScrollbar.prototype._sliderOrthogonalMousePosition = function (e) {
            return 0;
        };
        AbstractScrollbar.prototype._getScrollPosition = function () {
            return 0;
        };
        AbstractScrollbar.prototype._setScrollPosition = function (elementScrollPosition) {
        };
        AbstractScrollbar.ARROW_IMG_SIZE = 11;
        /**
         * The orthogonal distance to the slider at which dragging "resets". This implements "snapping"
         */
        AbstractScrollbar.MOUSE_DRAG_RESET_DISTANCE = 140;
        return AbstractScrollbar;
    })();
    exports.AbstractScrollbar = AbstractScrollbar;
    function toPx(value) {
        return value + 'px';
    }
    function setPosition(domNode, top, left, bottom, right) {
        if (top !== null) {
            domNode.style.top = toPx(top);
        }
        if (left !== null) {
            domNode.style.left = toPx(left);
        }
        if (bottom !== null) {
            domNode.style.bottom = toPx(bottom);
        }
        if (right !== null) {
            domNode.style.right = toPx(right);
        }
    }
    function setSize(domNode, width, height) {
        if (width !== null) {
            domNode.style.width = toPx(width);
        }
        if (height !== null) {
            domNode.style.height = toPx(height);
        }
    }
});
//# sourceMappingURL=abstractScrollbar.js.map