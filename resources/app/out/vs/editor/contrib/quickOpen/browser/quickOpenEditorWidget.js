/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/browser/editorBrowser', 'vs/base/browser/builder', 'vs/base/parts/quickopen/browser/quickOpenWidget'], function (require, exports, EditorBrowser, Builder, QuickOpenWidget) {
    var $ = Builder.$;
    var QuickOpenEditorWidget = (function () {
        function QuickOpenEditorWidget(codeEditor, onOk, onCancel, onType, configuration) {
            this.codeEditor = codeEditor;
            this.create(onOk, onCancel, onType, configuration);
        }
        QuickOpenEditorWidget.prototype.create = function (onOk, onCancel, onType, configuration) {
            this.domNode = $().div().getHTMLElement();
            this.quickOpenWidget = new QuickOpenWidget.QuickOpenWidget(this.domNode, {
                onOk: onOk,
                onCancel: onCancel,
                onType: onType
            }, {
                inputPlaceHolder: null,
                inputAriaLabel: configuration.inputAriaLabel
            }, null);
            this.quickOpenWidget.create();
            this.codeEditor.addOverlayWidget(this);
        };
        QuickOpenEditorWidget.prototype.setInput = function (model, focus) {
            this.quickOpenWidget.setInput(model, focus);
        };
        QuickOpenEditorWidget.prototype.getId = function () {
            return QuickOpenEditorWidget.ID;
        };
        QuickOpenEditorWidget.prototype.getDomNode = function () {
            return this.domNode;
        };
        QuickOpenEditorWidget.prototype.destroy = function () {
            this.codeEditor.removeOverlayWidget(this);
            this.quickOpenWidget.dispose();
        };
        QuickOpenEditorWidget.prototype.isVisible = function () {
            return this.visible;
        };
        QuickOpenEditorWidget.prototype.show = function (value) {
            this.visible = true;
            var editorLayout = this.codeEditor.getLayoutInfo();
            if (editorLayout) {
                this.quickOpenWidget.layout(new Builder.Dimension(editorLayout.width, editorLayout.height));
            }
            this.quickOpenWidget.show(value);
            this.codeEditor.layoutOverlayWidget(this);
        };
        QuickOpenEditorWidget.prototype.hide = function () {
            this.visible = false;
            this.quickOpenWidget.hide();
            this.codeEditor.layoutOverlayWidget(this);
        };
        QuickOpenEditorWidget.prototype.getPosition = function () {
            if (this.visible) {
                return {
                    preference: EditorBrowser.OverlayWidgetPositionPreference.TOP_CENTER
                };
            }
            return null;
        };
        QuickOpenEditorWidget.ID = 'editor.contrib.quickOpenEditorWidget';
        return QuickOpenEditorWidget;
    })();
    exports.QuickOpenEditorWidget = QuickOpenEditorWidget;
});
//# sourceMappingURL=quickOpenEditorWidget.js.map