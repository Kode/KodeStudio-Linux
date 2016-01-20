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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', 'vs/platform/instantiation/common/instantiation', 'vs/base/common/keyCodes'], function (require, exports, nls, winjs_base_1, editorCommonExtensions_1, editorAction_1, instantiation_1, keyCodes_1) {
    var ToggleTabFocusModeAction = (function (_super) {
        __extends(ToggleTabFocusModeAction, _super);
        function ToggleTabFocusModeAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.TextFocus);
        }
        ToggleTabFocusModeAction.prototype.run = function () {
            if (this.editor.getConfiguration().tabFocusMode) {
                this.editor.updateOptions({ tabFocusMode: false });
            }
            else {
                this.editor.updateOptions({ tabFocusMode: true });
            }
            return winjs_base_1.TPromise.as(true);
        };
        ToggleTabFocusModeAction.ID = 'editor.action.toggleTabFocusMode';
        ToggleTabFocusModeAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], ToggleTabFocusModeAction);
        return ToggleTabFocusModeAction;
    })(editorAction_1.EditorAction);
    // register actions
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(ToggleTabFocusModeAction, ToggleTabFocusModeAction.ID, nls.localize('toggle.tabfocusmode', "Toggle Use of Tab Key for Setting Focus"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.KEY_M,
        mac: { primary: keyCodes_1.KeyMod.WinCtrl | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_M }
    }));
});
//# sourceMappingURL=toggleTabFocusMode.js.map