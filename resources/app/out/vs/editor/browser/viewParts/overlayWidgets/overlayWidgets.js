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
define(["require", "exports", 'vs/base/browser/dom', 'vs/editor/browser/view/viewPart', 'vs/editor/browser/editorBrowser', 'vs/css!./overlayWidgets'], function (require, exports, DomUtils, viewPart_1, EditorBrowser) {
    var ViewOverlayWidgets = (function (_super) {
        __extends(ViewOverlayWidgets, _super);
        function ViewOverlayWidgets(context) {
            _super.call(this, context);
            this._widgets = {};
            this._verticalScrollbarWidth = 0;
            this._horizontalScrollbarHeight = 0;
            this._editorHeight = 0;
            this.domNode = document.createElement('div');
            this.domNode.className = EditorBrowser.ClassNames.OVERLAY_WIDGETS;
        }
        ViewOverlayWidgets.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._widgets = null;
        };
        // ---- begin view event handlers
        ViewOverlayWidgets.prototype.onLayoutChanged = function (layoutInfo) {
            var _this = this;
            this._verticalScrollbarWidth = layoutInfo.verticalScrollbarWidth;
            this._horizontalScrollbarHeight = layoutInfo.horizontalScrollbarHeight;
            this._editorHeight = layoutInfo.height;
            this._requestModificationFrame(function () {
                DomUtils.StyleMutator.setWidth(_this.domNode, layoutInfo.width);
            });
            return true;
        };
        // ---- end view event handlers
        ViewOverlayWidgets.prototype.addWidget = function (widget) {
            this._widgets[widget.getId()] = {
                widget: widget,
                preference: null
            };
            // This is sync because a widget wants to be in the dom
            var domNode = widget.getDomNode();
            domNode.style.position = 'absolute';
            domNode.setAttribute('widgetId', widget.getId());
            this.domNode.appendChild(domNode);
        };
        ViewOverlayWidgets.prototype.setWidgetPosition = function (widget, preference) {
            var _this = this;
            var widgetData = this._widgets[widget.getId()];
            widgetData.preference = preference;
            this._requestModificationFrame(function () {
                if (_this._widgets.hasOwnProperty(widget.getId())) {
                    _this._renderWidget(widgetData);
                }
            });
        };
        ViewOverlayWidgets.prototype.removeWidget = function (widget) {
            var widgetId = widget.getId();
            if (this._widgets.hasOwnProperty(widgetId)) {
                var widgetData = this._widgets[widgetId];
                var domNode = widgetData.widget.getDomNode();
                delete this._widgets[widgetId];
                domNode.parentNode.removeChild(domNode);
            }
        };
        ViewOverlayWidgets.prototype._renderWidget = function (widgetData) {
            var _RESTORE_STYLE_TOP = 'data-editor-restoreStyleTop', domNode = widgetData.widget.getDomNode();
            if (widgetData.preference === null) {
                if (domNode.hasAttribute(_RESTORE_STYLE_TOP)) {
                    var previousTop = domNode.getAttribute(_RESTORE_STYLE_TOP);
                    domNode.removeAttribute(_RESTORE_STYLE_TOP);
                    domNode.style.top = previousTop;
                }
                return;
            }
            if (widgetData.preference === EditorBrowser.OverlayWidgetPositionPreference.TOP_RIGHT_CORNER) {
                if (!domNode.hasAttribute(_RESTORE_STYLE_TOP)) {
                    domNode.setAttribute(_RESTORE_STYLE_TOP, domNode.style.top);
                }
                DomUtils.StyleMutator.setTop(domNode, 0);
                DomUtils.StyleMutator.setRight(domNode, (2 * this._verticalScrollbarWidth));
            }
            else if (widgetData.preference === EditorBrowser.OverlayWidgetPositionPreference.BOTTOM_RIGHT_CORNER) {
                if (!domNode.hasAttribute(_RESTORE_STYLE_TOP)) {
                    domNode.setAttribute(_RESTORE_STYLE_TOP, domNode.style.top);
                }
                var widgetHeight = domNode.clientHeight;
                DomUtils.StyleMutator.setTop(domNode, (this._editorHeight - widgetHeight - 2 * this._horizontalScrollbarHeight));
                DomUtils.StyleMutator.setRight(domNode, (2 * this._verticalScrollbarWidth));
            }
            else if (widgetData.preference === EditorBrowser.OverlayWidgetPositionPreference.TOP_CENTER) {
                if (!domNode.hasAttribute(_RESTORE_STYLE_TOP)) {
                    domNode.setAttribute(_RESTORE_STYLE_TOP, domNode.style.top);
                }
                DomUtils.StyleMutator.setTop(domNode, 0);
                domNode.style.right = '50%';
            }
        };
        ViewOverlayWidgets.prototype._render = function (ctx) {
            var _this = this;
            var widgetId;
            this._requestModificationFrame(function () {
                for (widgetId in _this._widgets) {
                    if (_this._widgets.hasOwnProperty(widgetId)) {
                        _this._renderWidget(_this._widgets[widgetId]);
                    }
                }
            });
        };
        ViewOverlayWidgets.prototype.onReadAfterForcedLayout = function (ctx) {
            // Overwriting to bypass `shouldRender` flag
            this._render(ctx);
            return null;
        };
        ViewOverlayWidgets.prototype.onWriteAfterForcedLayout = function () {
            // Overwriting to bypass `shouldRender` flag
            this._executeModificationRunners();
        };
        return ViewOverlayWidgets;
    })(viewPart_1.ViewPart);
    exports.ViewOverlayWidgets = ViewOverlayWidgets;
});
//# sourceMappingURL=overlayWidgets.js.map