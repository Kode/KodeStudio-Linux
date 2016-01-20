/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/nls', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorCommon', './emmetActions', 'vs/platform/keybinding/common/keybindingsRegistry', 'vs/base/common/keyCodes', 'vs/platform/keybinding/common/keybindingService'], function (require, exports, nls, editorCommonExtensions_1, editorCommon, emmetActions_1, keybindingsRegistry_1, keyCodes_1, keybindingService_1) {
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(emmetActions_1.ExpandAbbreviationAction, emmetActions_1.ExpandAbbreviationAction.ID, nls.localize('expandAbbreviationAction', "Emmet: Expand Abbreviation")));
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandRule({
        id: emmetActions_1.ExpandAbbreviationAction.ID,
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.editorContrib(),
        context: keybindingService_1.KbExpr.and(keybindingService_1.KbExpr.has(editorCommon.KEYBINDING_CONTEXT_EDITOR_TEXT_FOCUS), keybindingService_1.KbExpr.not(editorCommon.KEYBINDING_CONTEXT_EDITOR_HAS_NON_EMPTY_SELECTION), keybindingService_1.KbExpr.not(editorCommon.KEYBINDING_CONTEXT_EDITOR_HAS_MULTIPLE_SELECTIONS), keybindingService_1.KbExpr.not(editorCommon.KEYBINDING_CONTEXT_EDITOR_TAB_MOVES_FOCUS)),
        primary: keyCodes_1.KeyCode.Tab
    });
});
//# sourceMappingURL=emmet.contribution.js.map