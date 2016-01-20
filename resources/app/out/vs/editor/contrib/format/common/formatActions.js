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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/editor/common/editorCommon', 'vs/base/common/lifecycle', 'vs/base/common/arrays', 'vs/nls', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', './formatCommand', 'vs/platform/instantiation/common/instantiation', 'vs/base/common/keyCodes', '../common/format'], function (require, exports, winjs_base_1, EditorCommon, lifecycle, arrays, nls, editorCommonExtensions_1, editorAction_1, formatCommand, instantiation_1, keyCodes_1, format_1) {
    var FormatOnType = (function () {
        function FormatOnType(editor, ns) {
            var _this = this;
            this.editor = editor;
            this.callOnDispose = [];
            this.callOnModel = [];
            this.callOnDispose.push(editor.addListener2(EditorCommon.EventType.ConfigurationChanged, function () { return _this.update(); }));
            this.callOnDispose.push(editor.addListener2(EditorCommon.EventType.ModelChanged, function () { return _this.update(); }));
            this.callOnDispose.push(editor.addListener2(EditorCommon.EventType.ModelModeChanged, function () { return _this.update(); }));
            this.callOnDispose.push(editor.addListener2(EditorCommon.EventType.ModelModeSupportChanged, function (e) {
                if (e.formattingSupport) {
                    _this.update();
                }
            }));
            this.callOnDispose.push(format_1.FormatOnTypeRegistry.onDidChange(this.update, this));
        }
        FormatOnType.prototype.update = function () {
            var _this = this;
            // clean up
            this.callOnModel = lifecycle.cAll(this.callOnModel);
            // we are disabled
            if (!this.editor.getConfiguration().formatOnType) {
                return;
            }
            // no model
            if (!this.editor.getModel()) {
                return;
            }
            var model = this.editor.getModel();
            // no support
            var support = format_1.FormatOnTypeRegistry.ordered(model)[0];
            if (!support || !support.autoFormatTriggerCharacters) {
                return;
            }
            // remember options
            this.formattingOptions = this.editor.getIndentationOptions();
            // register typing listeners that will trigger the format
            support.autoFormatTriggerCharacters.forEach(function (ch) {
                _this.callOnModel.push(_this.editor.addTypingListener(ch, _this.trigger.bind(_this, ch)));
            });
        };
        FormatOnType.prototype.trigger = function (ch) {
            var _this = this;
            if (this.editor.getSelections().length > 1) {
                return;
            }
            var model = this.editor.getModel(), position = this.editor.getPosition(), canceled = false;
            // install a listener that checks if edits happens before the
            // position on which we format right now. Iff so, we won't
            // apply the format edits
            var unbind = this.editor.addListener(EditorCommon.EventType.ModelContentChanged, function (e) {
                if (e.changeType === EditorCommon.EventType.ModelContentChangedFlush) {
                    // a model.setValue() was called
                    canceled = true;
                }
                else if (e.changeType === EditorCommon.EventType.ModelContentChangedLineChanged) {
                    var changedLine = e.lineNumber;
                    canceled = changedLine <= position.lineNumber;
                }
                else if (e.changeType === EditorCommon.EventType.ModelContentChangedLinesInserted) {
                    var insertLine = e.fromLineNumber;
                    canceled = insertLine <= position.lineNumber;
                }
                else if (e.changeType === EditorCommon.EventType.ModelContentChangedLinesDeleted) {
                    var deleteLine2 = e.toLineNumber;
                    canceled = deleteLine2 <= position.lineNumber;
                }
                if (canceled) {
                    // cancel only once
                    unbind();
                }
            });
            format_1.formatAfterKeystroke(model, position, ch, this.formattingOptions).then(function (edits) {
                unbind();
                if (canceled || arrays.isFalsyOrEmpty(edits)) {
                    return;
                }
                _this.editor.executeCommand(_this.getId(), new formatCommand.EditOperationsCommand(edits, _this.editor.getSelection()));
            }, function (err) {
                unbind();
                throw err;
            });
        };
        FormatOnType.prototype.getId = function () {
            return FormatOnType.ID;
        };
        FormatOnType.prototype.dispose = function () {
            this.callOnDispose = lifecycle.disposeAll(this.callOnDispose);
            while (this.callOnModel.length > 0) {
                this.callOnModel.pop()();
            }
        };
        FormatOnType.ID = 'editor.contrib.autoFormat';
        FormatOnType = __decorate([
            __param(1, instantiation_1.INullService)
        ], FormatOnType);
        return FormatOnType;
    })();
    var FormatAction = (function (_super) {
        __extends(FormatAction, _super);
        function FormatAction(descriptor, editor, ns) {
            var _this = this;
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.WidgetFocus | editorAction_1.Behaviour.Writeable | editorAction_1.Behaviour.UpdateOnModelChange | editorAction_1.Behaviour.ShowInContextMenu);
            this._disposable = format_1.FormatRegistry.onDidChange(function () { return _this.resetEnablementState(); });
        }
        FormatAction.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._disposable.dispose();
        };
        FormatAction.prototype.getGroupId = function () {
            return '2_change/2_format';
        };
        FormatAction.prototype.isSupported = function () {
            return format_1.FormatRegistry.has(this.editor.getModel()) && _super.prototype.isSupported.call(this);
        };
        FormatAction.prototype.run = function () {
            var _this = this;
            var model = this.editor.getModel(), editorSelection = this.editor.getSelection(), options = this.editor.getIndentationOptions();
            var formattingPromise;
            if (editorSelection.isEmpty()) {
                formattingPromise = format_1.formatDocument(model, options);
            }
            else {
                formattingPromise = format_1.formatRange(model, editorSelection, options);
            }
            if (!formattingPromise) {
                return winjs_base_1.TPromise.as(false);
            }
            // Capture the state of the editor
            var state = this.editor.captureState(EditorCommon.CodeEditorStateFlag.Value, EditorCommon.CodeEditorStateFlag.Position);
            // Receive formatted value from worker
            return formattingPromise.then(function (result) {
                if (!state.validate(_this.editor)) {
                    return false;
                }
                if (!result || result.length === 0) {
                    return false;
                }
                _this.apply(_this.editor, editorSelection, result);
                _this.editor.focus();
                return true;
            });
        };
        FormatAction.prototype.apply = function (editor, editorSelection, value) {
            var state = null;
            if (editorSelection.isEmpty()) {
                state = editor.saveViewState();
            }
            var command = new formatCommand.EditOperationsCommand(value, editorSelection);
            editor.executeCommand(this.id, command);
            if (state) {
                editor.restoreViewState(state);
            }
        };
        FormatAction.ID = 'editor.action.format';
        FormatAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], FormatAction);
        return FormatAction;
    })(editorAction_1.EditorAction);
    exports.FormatAction = FormatAction;
    // register action
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(FormatAction, FormatAction.ID, nls.localize('formatAction.label', "Format Code"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.Shift | keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.KEY_F,
        linux: { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_I }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorContribution(FormatOnType);
});
//# sourceMappingURL=formatActions.js.map