/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/nls', 'vs/base/browser/browser', 'vs/editor/common/editorCommonExtensions', './quickCommand', 'vs/base/common/keyCodes'], function (require, exports, nls, Browser, editorCommonExtensions_1, QuickCommand, keyCodes_1) {
    // Contribute "Quick Command" to context menu
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(QuickCommand.QuickCommandAction, QuickCommand.QuickCommandAction.ID, nls.localize('label', "Command Palette"), {
        context: editorCommonExtensions_1.ContextKey.EditorFocus,
        primary: (Browser.isIE11orEarlier ? keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.F1 : keyCodes_1.KeyCode.F1)
    }));
});
//# sourceMappingURL=quickCommand.contribution.js.map