/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/browser/editorBrowser', 'vs/base/browser/dom'], function (require, exports, EditorBrowser, DomUtils) {
    var LightBulpWidget = (function () {
        function LightBulpWidget(editor, onclick) {
            // Editor.IContentWidget.allowEditorOverflow
            this.allowEditorOverflow = true;
            this.editor = editor;
            this.onclick = onclick;
            this.listenersToRemove = [];
            this.editor.addContentWidget(this);
        }
        LightBulpWidget.prototype.dispose = function () {
            this.editor.removeContentWidget(this);
            this.listenersToRemove.forEach(function (element) {
                element();
            });
            this.listenersToRemove = [];
        };
        LightBulpWidget.prototype.getId = function () {
            return '__lightBulpWidget';
        };
        LightBulpWidget.prototype.getDomNode = function () {
            var _this = this;
            if (!this.domNode) {
                this.domNode = document.createElement('div');
                this.domNode.style.width = '20px';
                this.domNode.style.height = '20px';
                this.domNode.className = 'lightbulp-glyph';
                this.listenersToRemove.push(DomUtils.addListener(this.domNode, 'click', function (e) {
                    _this.editor.focus();
                    _this.onclick(_this.position);
                }));
            }
            return this.domNode;
        };
        LightBulpWidget.prototype.getPosition = function () {
            return this.visible
                ? { position: this.position, preference: [EditorBrowser.ContentWidgetPositionPreference.BELOW, EditorBrowser.ContentWidgetPositionPreference.ABOVE] }
                : null;
        };
        LightBulpWidget.prototype.show = function (where) {
            this.position = where;
            this.visible = true;
            this.editor.layoutContentWidget(this);
        };
        LightBulpWidget.prototype.hide = function () {
            this.visible = false;
            this.editor.layoutContentWidget(this);
        };
        return LightBulpWidget;
    })();
    return LightBulpWidget;
});
//# sourceMappingURL=lightBulpWidget.js.map