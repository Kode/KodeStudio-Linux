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
define(["require", "exports", 'vs/base/browser/dom', 'vs/editor/browser/view/viewPart', 'vs/editor/browser/editorBrowser', 'vs/css!./scrollDecoration'], function (require, exports, DomUtils, viewPart_1, EditorBrowser) {
    var ScrollDecorationViewPart = (function (_super) {
        __extends(ScrollDecorationViewPart, _super);
        function ScrollDecorationViewPart(context) {
            _super.call(this, context);
            this._scrollTop = 0;
            this._width = 0;
            this._shouldShow = false;
            this._domNode = document.createElement('div');
        }
        ScrollDecorationViewPart.prototype._updateShouldShow = function () {
            var newShouldShow = (this._context.configuration.editor.scrollbar.useShadows && this._scrollTop > 0);
            if (this._shouldShow !== newShouldShow) {
                this._shouldShow = newShouldShow;
                return true;
            }
            return false;
        };
        ScrollDecorationViewPart.prototype.getDomNode = function () {
            return this._domNode;
        };
        // --- begin event handlers
        ScrollDecorationViewPart.prototype.onConfigurationChanged = function (e) {
            return this._updateShouldShow();
        };
        ScrollDecorationViewPart.prototype.onLayoutChanged = function (layoutInfo) {
            if (this._width !== layoutInfo.width) {
                this._width = layoutInfo.width;
                return true;
            }
            return false;
        };
        ScrollDecorationViewPart.prototype.onScrollChanged = function (e) {
            this._scrollTop = e.scrollTop;
            return this._updateShouldShow();
        };
        // --- end event handlers
        ScrollDecorationViewPart.prototype._render = function (ctx) {
            var _this = this;
            this._requestModificationFrame(function () {
                DomUtils.StyleMutator.setWidth(_this._domNode, _this._width);
                DomUtils.toggleClass(_this._domNode, EditorBrowser.ClassNames.SCROLL_DECORATION, _this._shouldShow);
            });
        };
        return ScrollDecorationViewPart;
    })(viewPart_1.ViewPart);
    exports.ScrollDecorationViewPart = ScrollDecorationViewPart;
});
//# sourceMappingURL=scrollDecoration.js.map