/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/editor/test/common/commands/commandTestUtils', 'vs/editor/common/commands/trimTrailingWhitespaceCommand', 'vs/editor/common/core/selection', 'vs/editor/test/common/editorTestUtils'], function (require, exports, assert, TU, TrimTrailingWhitespaceCommand, selection_1, editorTestUtils_1) {
    function assertTrimTrailingWhitespaceCommand(text, expected) {
        return editorTestUtils_1.withEditorModel(text, function (model) {
            var op = new TrimTrailingWhitespaceCommand.TrimTrailingWhitespaceCommand(selection_1.Selection.createSelection(1, 1, 1, 1));
            var actual = TU.getEditOperation(model, op);
            assert.deepEqual(actual, expected);
        });
    }
    function assertTrimTrailingWhitespace(text, cursors, expected) {
        return editorTestUtils_1.withEditorModel(text, function (model) {
            var actual = TrimTrailingWhitespaceCommand.trimTrailingWhitespace(model, cursors);
            assert.deepEqual(actual, expected);
        });
    }
    suite('Editor Commands - Trim Trailing Whitespace Command', function () {
        test('remove trailing whitespace', function () {
            assertTrimTrailingWhitespaceCommand([''], []);
            assertTrimTrailingWhitespaceCommand(['text'], []);
            assertTrimTrailingWhitespaceCommand(['text   '], [TU.createSingleEditOp(null, 1, 5, 1, 8)]);
            assertTrimTrailingWhitespaceCommand(['text\t   '], [TU.createSingleEditOp(null, 1, 5, 1, 9)]);
            assertTrimTrailingWhitespaceCommand(['\t   '], [TU.createSingleEditOp(null, 1, 1, 1, 5)]);
            assertTrimTrailingWhitespaceCommand(['text\t'], [TU.createSingleEditOp(null, 1, 5, 1, 6)]);
            assertTrimTrailingWhitespaceCommand([
                'some text\t',
                'some more text',
                '\t  ',
                'even more text  ',
                'and some mixed\t   \t'
            ], [
                TU.createSingleEditOp(null, 1, 10, 1, 11),
                TU.createSingleEditOp(null, 3, 1, 3, 4),
                TU.createSingleEditOp(null, 4, 15, 4, 17),
                TU.createSingleEditOp(null, 5, 15, 5, 20)
            ]);
            assertTrimTrailingWhitespace(['text   '], [editorTestUtils_1.pos(1, 1), editorTestUtils_1.pos(1, 2), editorTestUtils_1.pos(1, 3)], [TU.createInsertDeleteSingleEditOp(null, 1, 5, 1, 8)]);
            assertTrimTrailingWhitespace(['text   '], [editorTestUtils_1.pos(1, 1), editorTestUtils_1.pos(1, 5)], [TU.createInsertDeleteSingleEditOp(null, 1, 5, 1, 8)]);
            assertTrimTrailingWhitespace(['text   '], [editorTestUtils_1.pos(1, 1), editorTestUtils_1.pos(1, 5), editorTestUtils_1.pos(1, 6)], [TU.createInsertDeleteSingleEditOp(null, 1, 6, 1, 8)]);
            assertTrimTrailingWhitespace([
                'some text\t',
                'some more text',
                '\t  ',
                'even more text  ',
                'and some mixed\t   \t'
            ], [], [
                TU.createInsertDeleteSingleEditOp(null, 1, 10, 1, 11),
                TU.createInsertDeleteSingleEditOp(null, 3, 1, 3, 4),
                TU.createInsertDeleteSingleEditOp(null, 4, 15, 4, 17),
                TU.createInsertDeleteSingleEditOp(null, 5, 15, 5, 20)
            ]);
            assertTrimTrailingWhitespace([
                'some text\t',
                'some more text',
                '\t  ',
                'even more text  ',
                'and some mixed\t   \t'
            ], [editorTestUtils_1.pos(1, 11), editorTestUtils_1.pos(3, 2), editorTestUtils_1.pos(5, 1), editorTestUtils_1.pos(4, 1), editorTestUtils_1.pos(5, 10)], [
                TU.createInsertDeleteSingleEditOp(null, 3, 2, 3, 4),
                TU.createInsertDeleteSingleEditOp(null, 4, 15, 4, 17),
                TU.createInsertDeleteSingleEditOp(null, 5, 15, 5, 20)
            ]);
        });
    });
});
//# sourceMappingURL=trimTrailingWhitespaceCommand.test.js.map