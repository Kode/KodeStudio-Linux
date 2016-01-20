/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/browser/editorBrowser', 'vs/base/browser/dom', 'vs/editor/common/core/position'], function (require, exports, EditorBrowser, DomUtils, position_1) {
    var ContentHoverWidget = (function () {
        function ContentHoverWidget(id, editor) {
            // Editor.IContentWidget.allowEditorOverflow
            this.allowEditorOverflow = true;
            this._id = id;
            this._editor = editor;
            this._isVisible = false;
            this._containerDomNode = document.createElement('div');
            this._containerDomNode.className = 'monaco-editor-hover monaco-editor-background';
            this._domNode = document.createElement('div');
            this._domNode.style.display = 'inline-block';
            this._containerDomNode.appendChild(this._domNode);
            this._editor.addContentWidget(this);
            this._showAtPosition = null;
        }
        ContentHoverWidget.prototype.getId = function () {
            return this._id;
        };
        ContentHoverWidget.prototype.getDomNode = function () {
            return this._containerDomNode;
        };
        ContentHoverWidget.prototype.showAt = function (position) {
            // Position has changed
            this._showAtPosition = new position_1.Position(position.lineNumber, position.column);
            this._isVisible = true;
            var editorMaxWidth = Math.min(800, parseInt(this._containerDomNode.style.maxWidth, 10));
            // When scrolled horizontally, the div does not want to occupy entire visible area.
            DomUtils.StyleMutator.setWidth(this._containerDomNode, editorMaxWidth);
            DomUtils.StyleMutator.setHeight(this._containerDomNode, 0);
            DomUtils.StyleMutator.setLeft(this._containerDomNode, 0);
            var renderedWidth = Math.min(editorMaxWidth, this._domNode.clientWidth + 5);
            var renderedHeight = this._domNode.clientHeight + 1;
            DomUtils.StyleMutator.setWidth(this._containerDomNode, renderedWidth);
            DomUtils.StyleMutator.setHeight(this._containerDomNode, renderedHeight);
            this._editor.layoutContentWidget(this);
            // Simply force a synchronous render on the editor
            // such that the widget does not really render with left = '0px'
            this._editor.render();
        };
        ContentHoverWidget.prototype.hide = function () {
            if (!this._isVisible) {
                return;
            }
            this._isVisible = false;
            this._editor.layoutContentWidget(this);
        };
        ContentHoverWidget.prototype.getPosition = function () {
            if (this._isVisible) {
                return {
                    position: this._showAtPosition,
                    preference: [
                        EditorBrowser.ContentWidgetPositionPreference.ABOVE,
                        EditorBrowser.ContentWidgetPositionPreference.BELOW
                    ]
                };
            }
            return null;
        };
        ContentHoverWidget.prototype.dispose = function () {
            this.hide();
        };
        return ContentHoverWidget;
    })();
    exports.ContentHoverWidget = ContentHoverWidget;
    var GlyphHoverWidget = (function () {
        function GlyphHoverWidget(id, editor) {
            this._id = id;
            this._editor = editor;
            this._isVisible = false;
            this._domNode = document.createElement('div');
            this._domNode.className = 'monaco-editor-hover monaco-editor-background';
            this._domNode.style.display = 'none';
            this._domNode.setAttribute('aria-hidden', 'true');
            this._domNode.setAttribute('role', 'presentation');
            this._showAtLineNumber = -1;
            this._editor.addOverlayWidget(this);
        }
        GlyphHoverWidget.prototype.getId = function () {
            return this._id;
        };
        GlyphHoverWidget.prototype.getDomNode = function () {
            return this._domNode;
        };
        GlyphHoverWidget.prototype.showAt = function (lineNumber) {
            this._showAtLineNumber = lineNumber;
            if (!this._isVisible) {
                this._isVisible = true;
                this._domNode.style.display = 'block';
            }
            var editorLayout = this._editor.getLayoutInfo();
            var topForLineNumber = this._editor.getTopForLineNumber(this._showAtLineNumber);
            var editorScrollTop = this._editor.getScrollTop();
            this._domNode.style.left = (editorLayout.glyphMarginLeft + editorLayout.glyphMarginWidth) + 'px';
            this._domNode.style.top = (topForLineNumber - editorScrollTop) + 'px';
        };
        GlyphHoverWidget.prototype.hide = function () {
            if (!this._isVisible) {
                return;
            }
            this._isVisible = false;
            this._domNode.style.display = 'none';
        };
        GlyphHoverWidget.prototype.getPosition = function () {
            return null;
        };
        GlyphHoverWidget.prototype.dispose = function () {
            this.hide();
        };
        return GlyphHoverWidget;
    })();
    exports.GlyphHoverWidget = GlyphHoverWidget;
});
//# sourceMappingURL=hoverWidgets.js.map