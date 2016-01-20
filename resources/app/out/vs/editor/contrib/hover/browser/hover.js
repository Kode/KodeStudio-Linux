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
define(["require", "exports", 'vs/editor/browser/editorBrowserExtensions', 'vs/editor/common/editorCommon', 'vs/base/common/platform', './modesContentHover', './modesGlyphHover', 'vs/platform/instantiation/common/instantiation', 'vs/base/common/keyCodes', 'vs/css!./hover'], function (require, exports, editorBrowserExtensions_1, EditorCommon, Platform, ModesContentHover, ModesGlyphHover, instantiation_1, keyCodes_1) {
    var ModesHoverController = (function () {
        function ModesHoverController(editor, ns) {
            var _this = this;
            this._editor = editor;
            this._toUnhook = [];
            if (editor.getConfiguration().hover) {
                this._toUnhook.push(this._editor.addListener(EditorCommon.EventType.MouseDown, function (e) { return _this._onEditorMouseDown(e); }));
                this._toUnhook.push(this._editor.addListener(EditorCommon.EventType.MouseMove, function (e) { return _this._onEditorMouseMove(e); }));
                this._toUnhook.push(this._editor.addListener(EditorCommon.EventType.MouseLeave, function (e) { return _this._hideWidgets(); }));
                this._toUnhook.push(this._editor.addListener(EditorCommon.EventType.KeyDown, function (e) { return _this._onKeyDown(e); }));
                this._toUnhook.push(this._editor.addListener(EditorCommon.EventType.ModelChanged, function () { return _this._hideWidgets(); }));
                this._toUnhook.push(this._editor.addListener(EditorCommon.EventType.ModelDecorationsChanged, function () { return _this._onModelDecorationsChanged(); }));
                this._toUnhook.push(this._editor.addListener('scroll', function () { return _this._hideWidgets(); }));
                this._contentWidget = new ModesContentHover.ModesContentHoverWidget(editor);
                this._glyphWidget = new ModesGlyphHover.ModesGlyphHoverWidget(editor);
            }
        }
        ModesHoverController.prototype._onModelDecorationsChanged = function () {
            this._contentWidget.onModelDecorationsChanged();
            this._glyphWidget.onModelDecorationsChanged();
        };
        ModesHoverController.prototype._onEditorMouseDown = function (mouseEvent) {
            var targetType = mouseEvent.target.type;
            if (targetType === EditorCommon.MouseTargetType.CONTENT_WIDGET && mouseEvent.target.detail === ModesContentHover.ModesContentHoverWidget.ID) {
                // mouse down on top of content hover widget
                return;
            }
            if (targetType === EditorCommon.MouseTargetType.OVERLAY_WIDGET && mouseEvent.target.detail === ModesGlyphHover.ModesGlyphHoverWidget.ID) {
                // mouse down on top of overlay hover widget
                return;
            }
            this._hideWidgets();
        };
        ModesHoverController.prototype._onEditorMouseMove = function (mouseEvent) {
            var targetType = mouseEvent.target.type;
            var stopKey = Platform.isMacintosh ? 'metaKey' : 'ctrlKey';
            if (targetType === EditorCommon.MouseTargetType.CONTENT_WIDGET && mouseEvent.target.detail === ModesContentHover.ModesContentHoverWidget.ID && !mouseEvent.event[stopKey]) {
                // mouse moved on top of content hover widget
                return;
            }
            if (targetType === EditorCommon.MouseTargetType.OVERLAY_WIDGET && mouseEvent.target.detail === ModesGlyphHover.ModesGlyphHoverWidget.ID && !mouseEvent.event[stopKey]) {
                // mouse moved on top of overlay hover widget
                return;
            }
            if (this._editor.getConfiguration().hover && targetType === EditorCommon.MouseTargetType.CONTENT_TEXT) {
                this._glyphWidget.hide();
                this._contentWidget.startShowingAt(mouseEvent.target.range);
            }
            else if (this._editor.getConfiguration().hover && targetType === EditorCommon.MouseTargetType.GUTTER_GLYPH_MARGIN) {
                this._contentWidget.hide();
                this._glyphWidget.startShowingAt(mouseEvent.target.position.lineNumber);
            }
            else {
                this._hideWidgets();
            }
        };
        ModesHoverController.prototype._onKeyDown = function (e) {
            var stopKey = Platform.isMacintosh ? keyCodes_1.KeyCode.Meta : keyCodes_1.KeyCode.Ctrl;
            if (e.keyCode !== stopKey) {
                // Do not hide hover when Ctrl/Meta is pressed
                this._hideWidgets();
            }
        };
        ModesHoverController.prototype._hideWidgets = function () {
            this._glyphWidget.hide();
            this._contentWidget.hide();
        };
        ModesHoverController.prototype.getId = function () {
            return ModesHoverController.ID;
        };
        ModesHoverController.prototype.dispose = function () {
            while (this._toUnhook.length > 0) {
                this._toUnhook.pop()();
            }
            if (this._glyphWidget) {
                this._glyphWidget.dispose();
                this._glyphWidget = null;
            }
            if (this._contentWidget) {
                this._contentWidget.dispose();
                this._contentWidget = null;
            }
        };
        ModesHoverController.ID = 'editor.contrib.hover';
        ModesHoverController = __decorate([
            __param(1, instantiation_1.INullService)
        ], ModesHoverController);
        return ModesHoverController;
    })();
    editorBrowserExtensions_1.EditorBrowserRegistry.registerEditorContribution(ModesHoverController);
});
//# sourceMappingURL=hover.js.map