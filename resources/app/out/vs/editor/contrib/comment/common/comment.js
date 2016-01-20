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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', './lineCommentCommand', './blockCommentCommand', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', 'vs/platform/instantiation/common/instantiation', 'vs/base/common/keyCodes'], function (require, exports, nls, winjs_base_1, LineCommentCommand, BlockCommentCommand, editorCommonExtensions_1, editorAction_1, instantiation_1, keyCodes_1) {
    var CommentLineAction = (function (_super) {
        __extends(CommentLineAction, _super);
        function CommentLineAction(descriptor, editor, type, ns) {
            _super.call(this, descriptor, editor);
            this._type = type;
        }
        CommentLineAction.prototype.run = function () {
            var commands = [];
            var selections = this.editor.getSelections();
            var opts = this.editor.getIndentationOptions();
            for (var i = 0; i < selections.length; i++) {
                commands.push(new LineCommentCommand.LineCommentCommand(selections[i], opts.tabSize, this._type));
            }
            this.editor.executeCommands(this.id, commands);
            return winjs_base_1.TPromise.as(null);
        };
        CommentLineAction.ID = 'editor.action.commentLine';
        CommentLineAction = __decorate([
            __param(3, instantiation_1.INullService)
        ], CommentLineAction);
        return CommentLineAction;
    })(editorAction_1.EditorAction);
    var ToggleCommentLineAction = (function (_super) {
        __extends(ToggleCommentLineAction, _super);
        function ToggleCommentLineAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, LineCommentCommand.Type.Toggle, ns);
        }
        ToggleCommentLineAction.ID = 'editor.action.commentLine';
        ToggleCommentLineAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], ToggleCommentLineAction);
        return ToggleCommentLineAction;
    })(CommentLineAction);
    var AddLineCommentAction = (function (_super) {
        __extends(AddLineCommentAction, _super);
        function AddLineCommentAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, LineCommentCommand.Type.ForceAdd, ns);
        }
        AddLineCommentAction.ID = 'editor.action.addCommentLine';
        AddLineCommentAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], AddLineCommentAction);
        return AddLineCommentAction;
    })(CommentLineAction);
    var RemoveLineCommentAction = (function (_super) {
        __extends(RemoveLineCommentAction, _super);
        function RemoveLineCommentAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, LineCommentCommand.Type.ForceRemove, ns);
        }
        RemoveLineCommentAction.ID = 'editor.action.removeCommentLine';
        RemoveLineCommentAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], RemoveLineCommentAction);
        return RemoveLineCommentAction;
    })(CommentLineAction);
    var BlockCommentAction = (function (_super) {
        __extends(BlockCommentAction, _super);
        function BlockCommentAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor);
        }
        BlockCommentAction.prototype.run = function () {
            var commands = [];
            var selections = this.editor.getSelections();
            for (var i = 0; i < selections.length; i++) {
                commands.push(new BlockCommentCommand.BlockCommentCommand(selections[i]));
            }
            this.editor.executeCommands(this.id, commands);
            return winjs_base_1.TPromise.as(null);
        };
        BlockCommentAction.ID = 'editor.action.blockComment';
        BlockCommentAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], BlockCommentAction);
        return BlockCommentAction;
    })(editorAction_1.EditorAction);
    // register actions
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(ToggleCommentLineAction, ToggleCommentLineAction.ID, nls.localize('comment.line', "Toggle Line Comment"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.US_SLASH
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(AddLineCommentAction, AddLineCommentAction.ID, nls.localize('comment.line.add', "Add Line Comment"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.chord(keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.KEY_K, keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.KEY_C)
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(RemoveLineCommentAction, RemoveLineCommentAction.ID, nls.localize('comment.line.remove', "Remove Line Comment"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.chord(keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.KEY_K, keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.KEY_U)
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(BlockCommentAction, BlockCommentAction.ID, nls.localize('comment.block', "Toggle Block Comment"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.Shift | keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.KEY_A,
        linux: { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_A }
    }));
});
//# sourceMappingURL=comment.js.map