/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/errors', 'vs/base/common/lifecycle', 'vs/editor/common/editorCommon', 'vs/editor/browser/editorBrowser', 'vs/editor/common/core/range', 'vs/css!./rename'], function (require, exports, winjs_base_1, errors, lifecycle, EditorCommon, EditorBrowser, range_1) {
    var RenameInputField = (function () {
        function RenameInputField(editor) {
            // Editor.IContentWidget.allowEditorOverflow
            this.allowEditorOverflow = true;
            this._currentAcceptInput = null;
            this._currentCancelInput = null;
            this._editor = editor;
            this._editor.addContentWidget(this);
        }
        RenameInputField.prototype.dispose = function () {
            this._editor.removeContentWidget(this);
        };
        RenameInputField.prototype.getId = function () {
            return '__renameInputWidget';
        };
        RenameInputField.prototype.getDomNode = function () {
            if (!this._domNode) {
                this._inputField = document.createElement('input');
                this._inputField.className = 'rename-input';
                this._domNode = document.createElement('div');
                this._domNode.style.height = this._editor.getConfiguration().lineHeight + "px";
                this._domNode.className = 'monaco-editor rename-box';
                this._domNode.appendChild(this._inputField);
            }
            return this._domNode;
        };
        RenameInputField.prototype.getPosition = function () {
            return this._visible
                ? { position: this._position, preference: [EditorBrowser.ContentWidgetPositionPreference.BELOW, EditorBrowser.ContentWidgetPositionPreference.ABOVE] }
                : null;
        };
        RenameInputField.prototype.acceptInput = function () {
            if (this._currentAcceptInput) {
                this._currentAcceptInput();
            }
        };
        RenameInputField.prototype.cancelInput = function () {
            if (this._currentCancelInput) {
                this._currentCancelInput();
            }
        };
        RenameInputField.prototype.getInput = function (where, value, selectionStart, selectionEnd) {
            var _this = this;
            this._position = { lineNumber: where.startLineNumber, column: where.startColumn };
            this._inputField.value = value;
            this._inputField.setAttribute('selectionStart', selectionStart.toString());
            this._inputField.setAttribute('selectionEnd', selectionEnd.toString());
            this._inputField.size = Math.max((where.endColumn - where.startColumn) * 1.1, 20);
            var disposeOnDone = [], always;
            always = function () {
                lifecycle.disposeAll(disposeOnDone);
                _this._hide();
            };
            return new winjs_base_1.TPromise(function (c, e) {
                _this._currentCancelInput = function () {
                    _this._currentAcceptInput = null;
                    _this._currentCancelInput = null;
                    e(errors.canceled());
                    return true;
                };
                _this._currentAcceptInput = function () {
                    if (_this._inputField.value.trim().length === 0 || _this._inputField.value === value) {
                        // empty or whitespace only or not changed
                        _this._currentCancelInput();
                        return;
                    }
                    _this._currentAcceptInput = null;
                    _this._currentCancelInput = null;
                    c(_this._inputField.value);
                };
                var onCursorChanged = function () {
                    if (!range_1.Range.containsPosition(where, _this._editor.getPosition())) {
                        _this._currentCancelInput();
                    }
                };
                disposeOnDone.push(_this._editor.addListener2(EditorCommon.EventType.CursorSelectionChanged, onCursorChanged));
                disposeOnDone.push(_this._editor.addListener2(EditorCommon.EventType.EditorBlur, _this._currentCancelInput));
                _this._show();
            }, this._currentCancelInput).then(function (value) {
                always();
                return value;
            }, function (err) {
                always();
                return winjs_base_1.TPromise.wrapError(err);
            });
        };
        RenameInputField.prototype._show = function () {
            var _this = this;
            this._visible = true;
            this._editor.layoutContentWidget(this);
            setTimeout(function () {
                _this._inputField.focus();
                _this._inputField.setSelectionRange(parseInt(_this._inputField.getAttribute('selectionStart')), parseInt(_this._inputField.getAttribute('selectionEnd')));
            }, 25);
        };
        RenameInputField.prototype._hide = function () {
            this._visible = false;
            this._editor.layoutContentWidget(this);
        };
        return RenameInputField;
    })();
    return RenameInputField;
});
//# sourceMappingURL=renameInputField.js.map