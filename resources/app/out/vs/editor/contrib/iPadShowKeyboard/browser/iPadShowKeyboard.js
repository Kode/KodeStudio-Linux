/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", 'vs/base/browser/browser', 'vs/editor/browser/editorBrowserExtensions', 'vs/base/browser/dom', 'vs/editor/browser/editorBrowser', 'vs/editor/common/editorCommon', 'vs/base/common/lifecycle', 'vs/platform/instantiation/common/instantiation', 'vs/css!./iPadShowKeyboard'], function (require, exports, Browser, editorBrowserExtensions_1, DomUtils, EditorBrowser, EditorCommon, Lifecycle, instantiation_1) {
    var iPadShowKeyboard = (function () {
        function iPadShowKeyboard(editor, ns) {
            var _this = this;
            this.editor = editor;
            this.toDispose = [];
            if (Browser.isIPad) {
                this.toDispose.push(editor.addListener2(EditorCommon.EventType.ConfigurationChanged, function () { return _this.update(); }));
                this.update();
            }
        }
        iPadShowKeyboard.prototype.update = function () {
            var hasWidget = (!!this.widget);
            var shouldHaveWidget = (!this.editor.getConfiguration().readOnly);
            if (!hasWidget && shouldHaveWidget) {
                this.widget = new ShowKeyboardWidget(this.editor);
            }
            else if (hasWidget && !shouldHaveWidget) {
                this.widget.dispose();
                this.widget = null;
            }
        };
        iPadShowKeyboard.prototype.getId = function () {
            return iPadShowKeyboard.ID;
        };
        iPadShowKeyboard.prototype.dispose = function () {
            this.toDispose = Lifecycle.disposeAll(this.toDispose);
            if (this.widget) {
                this.widget.dispose();
                this.widget = null;
            }
        };
        iPadShowKeyboard.ID = 'editor.contrib.iPadShowKeyboard';
        iPadShowKeyboard = __decorate([
            __param(1, instantiation_1.INullService)
        ], iPadShowKeyboard);
        return iPadShowKeyboard;
    })();
    exports.iPadShowKeyboard = iPadShowKeyboard;
    var ShowKeyboardWidget = (function () {
        function ShowKeyboardWidget(editor) {
            var _this = this;
            this.editor = editor;
            this._domNode = document.createElement('textarea');
            this._domNode.className = 'iPadShowKeyboard';
            this._toDispose = [];
            this._toDispose.push(DomUtils.addDisposableListener(this._domNode, 'touchstart', function (e) {
                _this.editor.focus();
            }));
            this._toDispose.push(DomUtils.addDisposableListener(this._domNode, 'focus', function (e) {
                _this.editor.focus();
            }));
            this.editor.addOverlayWidget(this);
        }
        ShowKeyboardWidget.prototype.dispose = function () {
            this.editor.removeOverlayWidget(this);
            this._toDispose = Lifecycle.disposeAll(this._toDispose);
        };
        // ----- IOverlayWidget API
        ShowKeyboardWidget.prototype.getId = function () {
            return ShowKeyboardWidget.ID;
        };
        ShowKeyboardWidget.prototype.getDomNode = function () {
            return this._domNode;
        };
        ShowKeyboardWidget.prototype.getPosition = function () {
            return {
                preference: EditorBrowser.OverlayWidgetPositionPreference.BOTTOM_RIGHT_CORNER
            };
        };
        ShowKeyboardWidget.ID = 'editor.contrib.ShowKeyboardWidget';
        return ShowKeyboardWidget;
    })();
    editorBrowserExtensions_1.EditorBrowserRegistry.registerEditorContribution(iPadShowKeyboard);
});
//# sourceMappingURL=iPadShowKeyboard.js.map