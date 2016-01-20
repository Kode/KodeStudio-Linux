/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/nls', 'vs/editor/common/editorCommonExtensions', './quickOutline', 'vs/base/common/keyCodes'], function (require, exports, nls, editorCommonExtensions_1, QuickOutline, keyCodes_1) {
    // Contribute "Quick Outline" to context menu
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(QuickOutline.QuickOutlineAction, QuickOutline.QuickOutlineAction.ID, nls.localize('label', "Go to Symbol..."), {
        context: editorCommonExtensions_1.ContextKey.EditorFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_O
    }));
});
//# sourceMappingURL=quickOutline.contribution.js.map