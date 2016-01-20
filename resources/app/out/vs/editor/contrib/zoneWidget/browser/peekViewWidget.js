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
define(["require", "exports", 'vs/nls', 'vs/base/browser/ui/actionbar/actionbar', 'vs/base/common/actions', 'vs/base/common/strings', 'vs/base/browser/builder', 'vs/base/browser/dom', './zoneWidget', 'vs/editor/common/services/codeEditorService', 'vs/platform/instantiation/common/instantiation', 'vs/css!./peekViewWidget'], function (require, exports, nls, actionbar, actions, strings, builder, dom, zoneWidget, codeEditorService_1, instantiation_1) {
    exports.IPeekViewService = instantiation_1.createDecorator('peekViewService');
    var Events;
    (function (Events) {
        Events.Closed = 'closed';
    })(Events = exports.Events || (exports.Events = {}));
    var CONTEXT_OUTER_EDITOR = 'outerEditorId';
    function getOuterEditor(accessor, args) {
        var outerEditorId = args.context[CONTEXT_OUTER_EDITOR];
        if (!outerEditorId) {
            return null;
        }
        return accessor.get(codeEditorService_1.ICodeEditorService).getCodeEditor(outerEditorId);
    }
    exports.getOuterEditor = getOuterEditor;
    var PeekViewWidget = (function (_super) {
        __extends(PeekViewWidget, _super);
        function PeekViewWidget(editor, keybindingService, contextKey, options) {
            if (options === void 0) { options = {}; }
            _super.call(this, editor, options);
            this.serviceId = exports.IPeekViewService;
            this.contextKey = contextKey;
            keybindingService.createKey(CONTEXT_OUTER_EDITOR, editor.getId());
        }
        PeekViewWidget.prototype.dispose = function () {
            this._isActive = false;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(PeekViewWidget.prototype, "isActive", {
            get: function () {
                return this._isActive;
            },
            enumerable: true,
            configurable: true
        });
        PeekViewWidget.prototype.getActiveWidget = function () {
            return this;
        };
        PeekViewWidget.prototype.show = function (where, heightInLines) {
            this._isActive = true;
            _super.prototype.show.call(this, where, heightInLines);
        };
        PeekViewWidget.prototype.fillContainer = function (container) {
            builder.$(container).addClass('peekview-widget');
            this._headElement = builder.$('.head').getHTMLElement();
            this._bodyElement = builder.$('.body').getHTMLElement();
            this._fillHead(this._headElement);
            this._fillBody(this._bodyElement);
            container.appendChild(this._headElement);
            container.appendChild(this._bodyElement);
        };
        PeekViewWidget.prototype._fillHead = function (container) {
            var _this = this;
            var titleElement = builder.$('.peekview-title').
                on(dom.EventType.CLICK, function (e) { return _this._onTitleClick(e); }).
                appendTo(this._headElement).
                getHTMLElement();
            this._primaryHeading = builder.$('span.filename').appendTo(titleElement).getHTMLElement();
            this._secondaryHeading = builder.$('span.dirname').appendTo(titleElement).getHTMLElement();
            this._actionbarWidget = new actionbar.ActionBar(builder.$('.peekview-actions').
                appendTo(this._headElement));
            this._actionbarWidget.push(new actions.Action('peekview.close', nls.localize('label.close', "Close"), 'close-peekview-action', true, function () {
                _this.dispose();
                _this.emit(Events.Closed, _this);
                return null;
            }), { label: false, icon: true });
        };
        PeekViewWidget.prototype._onTitleClick = function (event) {
            // implement me
        };
        PeekViewWidget.prototype.setTitle = function (primaryHeading, secondaryHeading) {
            builder.$(this._primaryHeading).safeInnerHtml(primaryHeading);
            if (secondaryHeading) {
                builder.$(this._secondaryHeading).safeInnerHtml(secondaryHeading);
            }
            else {
                dom.clearNode(this._secondaryHeading);
            }
        };
        PeekViewWidget.prototype._fillBody = function (container) {
            // implement me
        };
        PeekViewWidget.prototype.doLayout = function (heightInPixel) {
            var headHeight = Math.ceil(this.editor.getConfiguration().lineHeight * 1.2), bodyHeight = heightInPixel - (headHeight + 2 /* the border-top/bottom width*/);
            this._doLayoutHead(headHeight);
            this._doLayoutBody(bodyHeight);
        };
        PeekViewWidget.prototype._doLayoutHead = function (heightInPixel) {
            this._headElement.style.height = strings.format('{0}px', heightInPixel);
            this._headElement.style.lineHeight = this._headElement.style.height;
        };
        PeekViewWidget.prototype._doLayoutBody = function (heightInPixel) {
            this._bodyElement.style.height = strings.format('{0}px', heightInPixel);
        };
        return PeekViewWidget;
    })(zoneWidget.ZoneWidget);
    exports.PeekViewWidget = PeekViewWidget;
});
//# sourceMappingURL=peekViewWidget.js.map