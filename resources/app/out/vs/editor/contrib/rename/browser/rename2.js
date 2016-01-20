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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/nls', 'vs/base/common/errors', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', 'vs/editor/common/services/bulkEdit', 'vs/editor/common/modes/supports', './renameInputField', 'vs/base/common/severity', 'vs/platform/message/common/message', 'vs/platform/keybinding/common/keybindingService', 'vs/platform/event/common/event', 'vs/platform/editor/common/editor', 'vs/base/common/keyCodes', '../common/rename', 'vs/css!./rename'], function (require, exports, winjs_base_1, nls, errors, editorCommonExtensions_1, editorAction_1, bulkEdit_1, supports, RenameInputField, severity_1, message_1, keybindingService_1, event_1, editor_1, keyCodes_1, rename_1) {
    var RenameAction = (function (_super) {
        __extends(RenameAction, _super);
        function RenameAction(descriptor, editor, messageService, keybindingService, eventService, editorService) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.WidgetFocus | editorAction_1.Behaviour.Writeable | editorAction_1.Behaviour.ShowInContextMenu | editorAction_1.Behaviour.UpdateOnCursorPositionChange);
            this._messageService = messageService;
            this._eventService = eventService;
            this._editorService = editorService;
            this._renameInputField = new RenameInputField(editor);
            this._renameInputVisible = keybindingService.createKey(CONTEXT_RENAME_INPUT_VISIBLE, false);
        }
        RenameAction.prototype.getGroupId = function () {
            return '2_change/1_rename2';
        };
        RenameAction.prototype.isSupported = function () {
            return rename_1.RenameRegistry.has(this.editor.getModel()) && !this.editor.getModel().hasEditableRange() && _super.prototype.isSupported.call(this);
        };
        RenameAction.prototype.getEnablementState = function () {
            var model = this.editor.getModel();
            var position = this.editor.getSelection().getStartPosition();
            var lineContext = model.getLineContext(position.lineNumber);
            return rename_1.RenameRegistry.ordered(model).some(function (support) {
                if (!support.filter) {
                    return true;
                }
                if (supports.isLineToken(lineContext, position.column - 1, support.filter)) {
                    return true;
                }
                if (position.column > 1 && supports.isLineToken(lineContext, position.column - 2, support.filter)) {
                    // in case we are in between two tokens
                    return true;
                }
            });
        };
        RenameAction.prototype.run = function (event) {
            var _this = this;
            var selection = this.editor.getSelection(), word = this.editor.getModel().getWordAtPosition(selection.getStartPosition());
            if (!word) {
                return;
            }
            var lineNumber = selection.startLineNumber, selectionStart = 0, selectionEnd = word.word.length, wordRange;
            wordRange = {
                startLineNumber: lineNumber,
                startColumn: word.startColumn,
                endLineNumber: lineNumber,
                endColumn: word.endColumn
            };
            if (!selection.isEmpty() && selection.startLineNumber === selection.endLineNumber) {
                selectionStart = Math.max(0, selection.startColumn - word.startColumn);
                selectionEnd = Math.min(word.endColumn, selection.endColumn) - word.startColumn;
            }
            this._renameInputVisible.set(true);
            return this._renameInputField.getInput(wordRange, word.word, selectionStart, selectionEnd).then(function (newName) {
                _this._renameInputVisible.reset();
                return _this._prepareRename(newName).then(function (edit) {
                    return edit.finish().then(function (selection) {
                        _this.editor.focus();
                        if (selection) {
                            _this.editor.setSelection(selection);
                        }
                    });
                }, function (err) {
                    if (typeof err === 'string') {
                        _this._messageService.show(severity_1.default.Info, err);
                    }
                    else {
                        return winjs_base_1.TPromise.wrapError(err);
                    }
                });
            }, function (err) {
                _this._renameInputVisible.reset();
                _this.editor.focus();
                if (!errors.isPromiseCanceledError(err)) {
                    return winjs_base_1.TPromise.wrapError(err);
                }
            });
        };
        RenameAction.prototype.acceptRenameInput = function () {
            this._renameInputField.acceptInput();
        };
        RenameAction.prototype.cancelRenameInput = function () {
            this._renameInputField.cancelInput();
        };
        RenameAction.prototype._prepareRename = function (newName) {
            // start recording of file changes so that we can figure out if a file that
            // is to be renamed conflicts with another (concurrent) modification
            var edit = bulkEdit_1.createBulkEdit(this._eventService, this._editorService, this.editor);
            return rename_1.rename(this.editor.getModel(), this.editor.getPosition(), newName).then(function (result) {
                if (result.rejectReason) {
                    return winjs_base_1.TPromise.wrapError(result.rejectReason);
                }
                edit.add(result.edits);
                return edit;
            });
        };
        RenameAction.ID = 'editor.action.rename';
        RenameAction = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, keybindingService_1.IKeybindingService),
            __param(4, event_1.IEventService),
            __param(5, editor_1.IEditorService)
        ], RenameAction);
        return RenameAction;
    })(editorAction_1.EditorAction);
    exports.RenameAction = RenameAction;
    var CONTEXT_RENAME_INPUT_VISIBLE = 'renameInputVisible';
    // register actions
    var weight = editorCommonExtensions_1.CommonEditorRegistry.commandWeight(99);
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(RenameAction, RenameAction.ID, nls.localize('rename.label', "Rename Symbol"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyCode.F2
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand('acceptRenameInput', weight, { primary: keyCodes_1.KeyCode.Enter }, false, CONTEXT_RENAME_INPUT_VISIBLE, function (ctx, editor, args) {
        var action = editor.getAction(RenameAction.ID);
        action.acceptRenameInput();
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand('cancelRenameInput', weight, { primary: keyCodes_1.KeyCode.Escape }, false, CONTEXT_RENAME_INPUT_VISIBLE, function (ctx, editor, args) {
        var action = editor.getAction(RenameAction.ID);
        action.cancelRenameInput();
    });
});
//# sourceMappingURL=rename2.js.map