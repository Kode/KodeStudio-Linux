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
define(["require", "exports", 'vs/nls', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', 'vs/editor/common/editorCommon', 'vs/platform/instantiation/common/instantiation', 'vs/base/common/keyCodes'], function (require, exports, nls, editorCommonExtensions_1, editorAction_1, EditorCommon, instantiation_1, keyCodes_1) {
    var InsertCursorAbove = (function (_super) {
        __extends(InsertCursorAbove, _super);
        function InsertCursorAbove(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, EditorCommon.Handler.AddCursorUp);
        }
        InsertCursorAbove.ID = 'editor.action.insertCursorAbove';
        InsertCursorAbove = __decorate([
            __param(2, instantiation_1.INullService)
        ], InsertCursorAbove);
        return InsertCursorAbove;
    })(editorAction_1.HandlerEditorAction);
    var InsertCursorBelow = (function (_super) {
        __extends(InsertCursorBelow, _super);
        function InsertCursorBelow(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, EditorCommon.Handler.AddCursorDown);
        }
        InsertCursorBelow.ID = 'editor.action.insertCursorBelow';
        InsertCursorBelow = __decorate([
            __param(2, instantiation_1.INullService)
        ], InsertCursorBelow);
        return InsertCursorBelow;
    })(editorAction_1.HandlerEditorAction);
    // register actions
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(InsertCursorAbove, InsertCursorAbove.ID, nls.localize('mutlicursor.insertAbove', "Add Cursor Above"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.UpArrow,
        linux: {
            primary: keyCodes_1.KeyMod.Shift | keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.UpArrow,
            secondary: [keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.UpArrow]
        }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(InsertCursorBelow, InsertCursorBelow.ID, nls.localize('mutlicursor.insertBelow', "Add Cursor Below"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.DownArrow,
        linux: {
            primary: keyCodes_1.KeyMod.Shift | keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.DownArrow,
            secondary: [keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.DownArrow]
        }
    }));
});
//# sourceMappingURL=multicursor.js.map