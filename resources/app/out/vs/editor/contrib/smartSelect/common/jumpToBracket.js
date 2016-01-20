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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', 'vs/editor/common/editorCommon', 'vs/platform/instantiation/common/instantiation', 'vs/base/common/keyCodes'], function (require, exports, nls, winjs_base_1, editorCommonExtensions_1, editorAction_1, EditorCommon, instantiation_1, keyCodes_1) {
    var SelectBracketAction = (function (_super) {
        __extends(SelectBracketAction, _super);
        function SelectBracketAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.TextFocus);
        }
        SelectBracketAction.prototype.run = function () {
            this.editor.trigger(this.id, EditorCommon.Handler.JumpToBracket, {});
            return winjs_base_1.TPromise.as(true);
        };
        SelectBracketAction.ID = 'editor.action.jumpToBracket';
        SelectBracketAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], SelectBracketAction);
        return SelectBracketAction;
    })(editorAction_1.EditorAction);
    // register actions
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(SelectBracketAction, SelectBracketAction.ID, nls.localize('smartSelect.jumpBracket', "Go to Bracket"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.US_CLOSE_SQUARE_BRACKET
    }));
});
//# sourceMappingURL=jumpToBracket.js.map