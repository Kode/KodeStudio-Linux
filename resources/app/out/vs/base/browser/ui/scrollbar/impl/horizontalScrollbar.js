/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'vs/base/browser/ui/scrollbar/impl/abstractScrollbar', 'vs/base/browser/mouseEvent', 'vs/base/browser/dom', 'vs/base/browser/ui/scrollbar/impl/common', 'vs/base/browser/browser'], function (require, exports, abstractScrollbar_1, mouseEvent_1, DomUtils, common_1, Browser) {
    var HorizontalScrollbar = (function (_super) {
        __extends(HorizontalScrollbar, _super);
        function HorizontalScrollbar(scrollable, parent, options) {
            var _this = this;
            var s = new abstractScrollbar_1.ScrollbarState((options.horizontalHasArrows ? options.arrowSize : 0), (options.horizontal === common_1.Visibility.Hidden ? 0 : options.horizontalScrollbarSize), (options.vertical === common_1.Visibility.Hidden ? 0 : options.verticalScrollbarSize));
            _super.call(this, options.forbidTranslate3dUse, parent, s, options.horizontal, 'horizontal');
            this.scrollable = scrollable;
            this._createDomNode();
            if (options.horizontalHasArrows) {
                var arrowDelta = (options.arrowSize - abstractScrollbar_1.AbstractScrollbar.ARROW_IMG_SIZE) / 2;
                var scrollbarDelta = (options.horizontalScrollbarSize - abstractScrollbar_1.AbstractScrollbar.ARROW_IMG_SIZE) / 2;
                this._createArrow('left-arrow', scrollbarDelta, arrowDelta, null, null, options.arrowSize, options.horizontalScrollbarSize, function () { return _this._createMouseWheelEvent(1); });
                this._createArrow('right-arrow', scrollbarDelta, null, null, arrowDelta, options.arrowSize, options.horizontalScrollbarSize, function () { return _this._createMouseWheelEvent(-1); });
            }
            this._createSlider(Math.floor((options.horizontalScrollbarSize - options.horizontalSliderSize) / 2), 0, null, options.horizontalSliderSize);
        }
        HorizontalScrollbar.prototype._createMouseWheelEvent = function (sign) {
            return new mouseEvent_1.StandardMouseWheelEvent(null, sign, 0);
        };
        HorizontalScrollbar.prototype._updateSlider = function (sliderSize, sliderPosition) {
            DomUtils.StyleMutator.setWidth(this.slider, sliderSize);
            if (!this.forbidTranslate3dUse && Browser.canUseTranslate3d) {
                DomUtils.StyleMutator.setTransform(this.slider, 'translate3d(' + sliderPosition + 'px, 0px, 0px)');
            }
            else {
                DomUtils.StyleMutator.setLeft(this.slider, sliderPosition);
            }
        };
        HorizontalScrollbar.prototype._renderDomNode = function (largeSize, smallSize) {
            DomUtils.StyleMutator.setWidth(this.domNode, largeSize);
            DomUtils.StyleMutator.setHeight(this.domNode, smallSize);
            DomUtils.StyleMutator.setLeft(this.domNode, 0);
            DomUtils.StyleMutator.setBottom(this.domNode, 0);
        };
        HorizontalScrollbar.prototype._mouseDownRelativePosition = function (e, domNodePosition) {
            return e.posx - domNodePosition.left;
        };
        HorizontalScrollbar.prototype._sliderMousePosition = function (e) {
            return e.posx;
        };
        HorizontalScrollbar.prototype._sliderOrthogonalMousePosition = function (e) {
            return e.posy;
        };
        HorizontalScrollbar.prototype._getScrollPosition = function () {
            return this.scrollable.getScrollLeft();
        };
        HorizontalScrollbar.prototype._setScrollPosition = function (scrollPosition) {
            this.scrollable.setScrollLeft(scrollPosition);
        };
        return HorizontalScrollbar;
    })(abstractScrollbar_1.AbstractScrollbar);
    exports.HorizontalScrollbar = HorizontalScrollbar;
});
//# sourceMappingURL=horizontalScrollbar.js.map