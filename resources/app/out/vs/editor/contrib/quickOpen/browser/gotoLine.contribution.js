/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/nls', 'vs/editor/common/editorCommonExtensions', './gotoLine', 'vs/base/common/keyCodes'], function (require, exports, nls, editorCommonExtensions_1, GotoLine, keyCodes_1) {
    // Contribute Ctrl+G to "Go to line" using quick open
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(GotoLine.GotoLineAction, GotoLine.GotoLineAction.ID, nls.localize('label', "Go to Line..."), {
        context: editorCommonExtensions_1.ContextKey.EditorFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.KEY_G,
        mac: { primary: keyCodes_1.KeyMod.WinCtrl | keyCodes_1.KeyCode.KEY_G }
    }));
});
//# sourceMappingURL=gotoLine.contribution.js.map