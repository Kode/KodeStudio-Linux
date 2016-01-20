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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', './copyLinesCommand', './deleteLinesCommand', './moveLinesCommand', 'vs/editor/common/editorCommon', 'vs/editor/common/commands/trimTrailingWhitespaceCommand', 'vs/platform/instantiation/common/instantiation', 'vs/base/common/keyCodes'], function (require, exports, nls, winjs_base_1, editorCommonExtensions_1, editorAction_1, CopyLinesCommand, DeleteLinesCommand, MoveLinesCommand, EditorCommon, trimTrailingWhitespaceCommand_1, instantiation_1, keyCodes_1) {
    // copy lines
    var CopyLinesAction = (function (_super) {
        __extends(CopyLinesAction, _super);
        function CopyLinesAction(descriptor, editor, down) {
            _super.call(this, descriptor, editor);
            this.down = down;
        }
        CopyLinesAction.prototype.run = function () {
            var commands = [];
            var selections = this.editor.getSelections();
            for (var i = 0; i < selections.length; i++) {
                commands.push(new CopyLinesCommand.CopyLinesCommand(selections[i], this.down));
            }
            this.editor.executeCommands(this.id, commands);
            return winjs_base_1.TPromise.as(true);
        };
        return CopyLinesAction;
    })(editorAction_1.EditorAction);
    var CopyLinesUpAction = (function (_super) {
        __extends(CopyLinesUpAction, _super);
        function CopyLinesUpAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, false);
        }
        CopyLinesUpAction.ID = 'editor.action.copyLinesUpAction';
        CopyLinesUpAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], CopyLinesUpAction);
        return CopyLinesUpAction;
    })(CopyLinesAction);
    var CopyLinesDownAction = (function (_super) {
        __extends(CopyLinesDownAction, _super);
        function CopyLinesDownAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, true);
        }
        CopyLinesDownAction.ID = 'editor.action.copyLinesDownAction';
        CopyLinesDownAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], CopyLinesDownAction);
        return CopyLinesDownAction;
    })(CopyLinesAction);
    // move lines
    var MoveLinesAction = (function (_super) {
        __extends(MoveLinesAction, _super);
        function MoveLinesAction(descriptor, editor, down) {
            _super.call(this, descriptor, editor);
            this.down = down;
        }
        MoveLinesAction.prototype.run = function () {
            var commands = [];
            var selections = this.editor.getSelections();
            for (var i = 0; i < selections.length; i++) {
                commands.push(new MoveLinesCommand.MoveLinesCommand(selections[i], this.down));
            }
            this.editor.executeCommands(this.id, commands);
            return winjs_base_1.TPromise.as(true);
        };
        return MoveLinesAction;
    })(editorAction_1.EditorAction);
    var MoveLinesUpAction = (function (_super) {
        __extends(MoveLinesUpAction, _super);
        function MoveLinesUpAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, false);
        }
        MoveLinesUpAction.ID = 'editor.action.moveLinesUpAction';
        MoveLinesUpAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], MoveLinesUpAction);
        return MoveLinesUpAction;
    })(MoveLinesAction);
    var MoveLinesDownAction = (function (_super) {
        __extends(MoveLinesDownAction, _super);
        function MoveLinesDownAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, true);
        }
        MoveLinesDownAction.ID = 'editor.action.moveLinesDownAction';
        MoveLinesDownAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], MoveLinesDownAction);
        return MoveLinesDownAction;
    })(MoveLinesAction);
    var TrimTrailingWhitespaceAction = (function (_super) {
        __extends(TrimTrailingWhitespaceAction, _super);
        function TrimTrailingWhitespaceAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor);
        }
        TrimTrailingWhitespaceAction.prototype.run = function () {
            var command = new trimTrailingWhitespaceCommand_1.TrimTrailingWhitespaceCommand(this.editor.getSelection());
            this.editor.executeCommands(this.id, [command]);
            return winjs_base_1.TPromise.as(true);
        };
        TrimTrailingWhitespaceAction.ID = 'editor.action.trimTrailingWhitespace';
        TrimTrailingWhitespaceAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], TrimTrailingWhitespaceAction);
        return TrimTrailingWhitespaceAction;
    })(editorAction_1.EditorAction);
    var AbstractRemoveLinesAction = (function (_super) {
        __extends(AbstractRemoveLinesAction, _super);
        function AbstractRemoveLinesAction(descriptor, editor) {
            _super.call(this, descriptor, editor);
        }
        AbstractRemoveLinesAction.prototype._getLinesToRemove = function () {
            // Construct delete operations
            var operations = this.editor.getSelections().map(function (s) {
                var endLineNumber = s.endLineNumber;
                if (s.startLineNumber < s.endLineNumber && s.endColumn === 1) {
                    endLineNumber -= 1;
                }
                return {
                    startLineNumber: s.startLineNumber,
                    endLineNumber: endLineNumber,
                    positionColumn: s.positionColumn
                };
            });
            // Sort delete operations
            operations.sort(function (a, b) {
                return a.startLineNumber - b.startLineNumber;
            });
            // Merge delete operations on consecutive lines
            var mergedOperations = [];
            var previousOperation = operations[0];
            for (var i = 1; i < operations.length; i++) {
                if (previousOperation.endLineNumber + 1 === operations[i].startLineNumber) {
                    // Merge current operations into the previous one
                    previousOperation.endLineNumber = operations[i].endLineNumber;
                }
                else {
                    // Push previous operation
                    mergedOperations.push(previousOperation);
                    previousOperation = operations[i];
                }
            }
            // Push the last operation
            mergedOperations.push(previousOperation);
            return mergedOperations;
        };
        return AbstractRemoveLinesAction;
    })(editorAction_1.EditorAction);
    var DeleteLinesAction = (function (_super) {
        __extends(DeleteLinesAction, _super);
        function DeleteLinesAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor);
        }
        DeleteLinesAction.prototype.run = function () {
            var ops = this._getLinesToRemove();
            // Finally, construct the delete lines commands
            var commands = ops.map(function (op) {
                return new DeleteLinesCommand.DeleteLinesCommand(op.startLineNumber, op.endLineNumber, op.positionColumn);
            });
            this.editor.executeCommands(this.id, commands);
            return winjs_base_1.TPromise.as(true);
        };
        DeleteLinesAction.ID = 'editor.action.deleteLines';
        DeleteLinesAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], DeleteLinesAction);
        return DeleteLinesAction;
    })(AbstractRemoveLinesAction);
    var IndentLinesAction = (function (_super) {
        __extends(IndentLinesAction, _super);
        function IndentLinesAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, EditorCommon.Handler.Indent);
        }
        IndentLinesAction.ID = 'editor.action.indentLines';
        IndentLinesAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], IndentLinesAction);
        return IndentLinesAction;
    })(editorAction_1.HandlerEditorAction);
    var OutdentLinesAction = (function (_super) {
        __extends(OutdentLinesAction, _super);
        function OutdentLinesAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, EditorCommon.Handler.Outdent);
        }
        OutdentLinesAction.ID = 'editor.action.outdentLines';
        OutdentLinesAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], OutdentLinesAction);
        return OutdentLinesAction;
    })(editorAction_1.HandlerEditorAction);
    var InsertLineBeforeAction = (function (_super) {
        __extends(InsertLineBeforeAction, _super);
        function InsertLineBeforeAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, EditorCommon.Handler.LineInsertBefore);
        }
        InsertLineBeforeAction.ID = 'editor.action.insertLineBefore';
        InsertLineBeforeAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], InsertLineBeforeAction);
        return InsertLineBeforeAction;
    })(editorAction_1.HandlerEditorAction);
    var InsertLineAfterAction = (function (_super) {
        __extends(InsertLineAfterAction, _super);
        function InsertLineAfterAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, EditorCommon.Handler.LineInsertAfter);
        }
        InsertLineAfterAction.ID = 'editor.action.insertLineAfter';
        InsertLineAfterAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], InsertLineAfterAction);
        return InsertLineAfterAction;
    })(editorAction_1.HandlerEditorAction);
    // register actions
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(DeleteLinesAction, DeleteLinesAction.ID, nls.localize('lines.delete', "Delete Line"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_K
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(TrimTrailingWhitespaceAction, TrimTrailingWhitespaceAction.ID, nls.localize('lines.trimTrailingWhitespace', "Trim Trailing Whitespace"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_X
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(MoveLinesDownAction, MoveLinesDownAction.ID, nls.localize('lines.moveDown', "Move Line Down"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.DownArrow,
        linux: { primary: keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.DownArrow }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(MoveLinesUpAction, MoveLinesUpAction.ID, nls.localize('lines.moveUp', "Move Line Up"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.UpArrow,
        linux: { primary: keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.UpArrow }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(CopyLinesDownAction, CopyLinesDownAction.ID, nls.localize('lines.copyDown', "Copy Line Down"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.Alt | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.DownArrow,
        linux: { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Alt | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.DownArrow }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(CopyLinesUpAction, CopyLinesUpAction.ID, nls.localize('lines.copyUp', "Copy Line Up"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.Alt | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.UpArrow,
        linux: { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Alt | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.UpArrow }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(IndentLinesAction, IndentLinesAction.ID, nls.localize('lines.indent', "Indent Line"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.US_CLOSE_SQUARE_BRACKET
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(OutdentLinesAction, OutdentLinesAction.ID, nls.localize('lines.outdent', "Outdent Line"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.US_OPEN_SQUARE_BRACKET
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(InsertLineBeforeAction, InsertLineBeforeAction.ID, nls.localize('lines.insertBefore', "Insert Line Above"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.Enter
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(InsertLineAfterAction, InsertLineAfterAction.ID, nls.localize('lines.insertAfter', "Insert Line Below"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.Enter
    }));
});
//# sourceMappingURL=linesOperations.js.map