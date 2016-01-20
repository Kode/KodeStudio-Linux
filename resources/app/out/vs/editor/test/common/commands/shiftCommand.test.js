/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/editor/test/common/commands/commandTestUtils', 'vs/editor/common/commands/shiftCommand', 'vs/editor/test/common/editorTestUtils', 'vs/editor/common/core/selection', 'vs/editor/common/modes', 'vs/editor/common/modes/supports/onEnter'], function (require, exports, assert, TU, shiftCommand_1, editorTestUtils_1, selection_1, Modes, onEnter_1) {
    function testShiftCommand(lines, selection, expectedLines, expectedSelection) {
        TU.testCommand(lines, null, selection, function (sel) { return new shiftCommand_1.ShiftCommand(sel, {
            isUnshift: false,
            tabSize: 4,
            oneIndent: '\t'
        }); }, expectedLines, expectedSelection);
    }
    function testUnshiftCommand(lines, selection, expectedLines, expectedSelection) {
        TU.testCommand(lines, null, selection, function (sel) { return new shiftCommand_1.ShiftCommand(sel, {
            isUnshift: true,
            tabSize: 4,
            oneIndent: '\t'
        }); }, expectedLines, expectedSelection);
    }
    var DocBlockCommentMode = (function () {
        function DocBlockCommentMode() {
            this.onEnterSupport = new onEnter_1.OnEnterSupport(this.getId(), {
                brackets: [
                    { open: '(', close: ')' },
                    { open: '{', close: '}' },
                    { open: '[', close: ']' }
                ],
                regExpRules: [
                    {
                        // e.g. /** | */
                        beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                        afterText: /^\s*\*\/$/,
                        action: { indentAction: Modes.IndentAction.IndentOutdent, appendText: ' * ' }
                    },
                    {
                        // e.g. /** ...|
                        beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                        action: { indentAction: Modes.IndentAction.None, appendText: ' * ' }
                    },
                    {
                        // e.g.  * ...|
                        beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
                        action: { indentAction: Modes.IndentAction.None, appendText: '* ' }
                    },
                    {
                        // e.g.  */|
                        beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
                        action: { indentAction: Modes.IndentAction.None, removeText: 1 }
                    }
                ]
            });
        }
        DocBlockCommentMode.prototype.getId = function () {
            return 'docBlockCommentMode';
        };
        DocBlockCommentMode.prototype.toSimplifiedMode = function () {
            return this;
        };
        return DocBlockCommentMode;
    })();
    function testShiftCommandInDocBlockCommentMode(lines, selection, expectedLines, expectedSelection) {
        TU.testCommand(lines, new DocBlockCommentMode(), selection, function (sel) { return new shiftCommand_1.ShiftCommand(sel, {
            isUnshift: false,
            tabSize: 4,
            oneIndent: '\t'
        }); }, expectedLines, expectedSelection);
    }
    function testUnshiftCommandInDocBlockCommentMode(lines, selection, expectedLines, expectedSelection) {
        TU.testCommand(lines, new DocBlockCommentMode(), selection, function (sel) { return new shiftCommand_1.ShiftCommand(sel, {
            isUnshift: true,
            tabSize: 4,
            oneIndent: '\t'
        }); }, expectedLines, expectedSelection);
    }
    suite('Editor Commands - ShiftCommand', function () {
        // --------- shift
        test('Bug 9503: Shifting without any selection', function () {
            testShiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 1, 1, 1), [
                '\tMy First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 2, 1, 2));
        });
        test('shift on single line selection 1', function () {
            testShiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 3, 1, 1), [
                '\tMy First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 4, 1, 2));
        });
        test('shift on single line selection 2', function () {
            testShiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 1, 1, 3), [
                '\tMy First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 2, 1, 4));
        });
        test('simple shift', function () {
            testShiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 1, 2, 1), [
                '\tMy First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 2, 2, 1));
        });
        test('shifting on two separate lines', function () {
            testShiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 1, 2, 1), [
                '\tMy First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 2, 2, 1));
            testShiftCommand([
                '\tMy First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(2, 1, 3, 1), [
                '\tMy First Line',
                '\t\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(2, 1, 3, 1));
        });
        test('shifting on two lines', function () {
            testShiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 2, 2, 2), [
                '\tMy First Line',
                '\t\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 3, 2, 2));
        });
        test('shifting on two lines again', function () {
            testShiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(2, 2, 1, 2), [
                '\tMy First Line',
                '\t\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(2, 2, 1, 3));
        });
        test('shifting at end of file', function () {
            testShiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(4, 1, 5, 2), [
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '\t123'
            ], new selection_1.Selection(4, 1, 5, 3));
        });
        test('issue #1120 TAB should not indent empty lines in a multi-line selection', function () {
            testShiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 1, 5, 2), [
                '\tMy First Line',
                '\t\t\tMy Second Line',
                '\t\tThird Line',
                '',
                '\t123'
            ], new selection_1.Selection(1, 2, 5, 3));
            testShiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(4, 1, 5, 1), [
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '\t',
                '123'
            ], new selection_1.Selection(4, 2, 5, 1));
        });
        // --------- unshift
        test('unshift on single line selection 1', function () {
            testShiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(2, 3, 2, 1), [
                'My First Line',
                '\t\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(2, 3, 2, 1));
        });
        test('unshift on single line selection 2', function () {
            testShiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(2, 1, 2, 3), [
                'My First Line',
                '\t\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(2, 1, 2, 3));
        });
        test('simple unshift', function () {
            testUnshiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 1, 2, 1), [
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 1, 2, 1));
        });
        test('unshifting on two lines 1', function () {
            testUnshiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 2, 2, 2), [
                'My First Line',
                '\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 2, 2, 2));
        });
        test('unshifting on two lines 2', function () {
            testUnshiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(2, 3, 2, 1), [
                'My First Line',
                '\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(2, 2, 2, 1));
        });
        test('unshifting at the end of the file', function () {
            testUnshiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(4, 1, 5, 2), [
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(4, 1, 5, 2));
        });
        test('unshift many times + shift', function () {
            testUnshiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 1, 5, 4), [
                'My First Line',
                '\tMy Second Line',
                'Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 1, 5, 4));
            testUnshiftCommand([
                'My First Line',
                '\tMy Second Line',
                'Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 1, 5, 4), [
                'My First Line',
                'My Second Line',
                'Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 1, 5, 4));
            testShiftCommand([
                'My First Line',
                'My Second Line',
                'Third Line',
                '',
                '123'
            ], new selection_1.Selection(1, 1, 5, 4), [
                '\tMy First Line',
                '\tMy Second Line',
                '\tThird Line',
                '',
                '\t123'
            ], new selection_1.Selection(1, 2, 5, 5));
        });
        test('Bug 9119: Unshift from first column doesn\'t work', function () {
            testUnshiftCommand([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(2, 1, 2, 1), [
                'My First Line',
                '\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], new selection_1.Selection(2, 1, 2, 1));
        });
        test('issue #348: indenting around doc block comments', function () {
            testShiftCommandInDocBlockCommentMode([
                '',
                '/**',
                ' * a doc comment',
                ' */',
                'function hello() {}'
            ], new selection_1.Selection(1, 1, 5, 20), [
                '',
                '\t/**',
                '\t * a doc comment',
                '\t */',
                '\tfunction hello() {}'
            ], new selection_1.Selection(1, 1, 5, 21));
            testUnshiftCommandInDocBlockCommentMode([
                '',
                '/**',
                ' * a doc comment',
                ' */',
                'function hello() {}'
            ], new selection_1.Selection(1, 1, 5, 20), [
                '',
                '/**',
                ' * a doc comment',
                ' */',
                'function hello() {}'
            ], new selection_1.Selection(1, 1, 5, 20));
            testUnshiftCommandInDocBlockCommentMode([
                '\t',
                '\t/**',
                '\t * a doc comment',
                '\t */',
                '\tfunction hello() {}'
            ], new selection_1.Selection(1, 1, 5, 21), [
                '',
                '/**',
                ' * a doc comment',
                ' */',
                'function hello() {}'
            ], new selection_1.Selection(1, 1, 5, 20));
        });
        test('issue #1609: Wrong indentation of block comments', function () {
            testShiftCommandInDocBlockCommentMode([
                '',
                '/**',
                ' * test',
                ' *',
                ' * @type {number}',
                ' */',
                'var foo = 0;'
            ], new selection_1.Selection(1, 1, 7, 13), [
                '',
                '\t/**',
                '\t * test',
                '\t *',
                '\t * @type {number}',
                '\t */',
                '\tvar foo = 0;'
            ], new selection_1.Selection(1, 1, 7, 14));
        });
        test('bug #16815:Shift+Tab doesn\'t go back to tabstop', function () {
            var repeatStr = function (str, cnt) {
                var r = '';
                for (var i = 0; i < cnt; i++) {
                    r += str;
                }
                return r;
            };
            var testOutdent = function (tabSize, oneIndent, lineText, expectedIndents) {
                var expectedIndent = repeatStr(oneIndent, expectedIndents);
                if (lineText.length > 0) {
                    _assertUnshiftCommand(tabSize, oneIndent, [lineText + 'aaa'], [TU.createSingleEditOp(expectedIndent, 1, 1, 1, lineText.length + 1)]);
                }
                else {
                    _assertUnshiftCommand(tabSize, oneIndent, [lineText + 'aaa'], []);
                }
            };
            var testIndent = function (tabSize, oneIndent, lineText, expectedIndents) {
                var expectedIndent = repeatStr(oneIndent, expectedIndents);
                _assertShiftCommand(tabSize, oneIndent, [lineText + 'aaa'], [TU.createSingleEditOp(expectedIndent, 1, 1, 1, lineText.length + 1)]);
            };
            var testIndentation = function (tabSize, lineText, expectedOnOutdent, expectedOnIndent) {
                var spaceIndent = '';
                for (var i = 0; i < tabSize; i++) {
                    spaceIndent += ' ';
                }
                testOutdent(tabSize, spaceIndent, lineText, expectedOnOutdent);
                testOutdent(tabSize, '\t', lineText, expectedOnOutdent);
                testIndent(tabSize, spaceIndent, lineText, expectedOnIndent);
                testIndent(tabSize, '\t', lineText, expectedOnIndent);
            };
            // insertSpaces: true
            // 0 => 0
            testIndentation(4, '', 0, 1);
            // 1 => 0
            testIndentation(4, '\t', 0, 2);
            testIndentation(4, ' ', 0, 1);
            testIndentation(4, ' \t', 0, 2);
            testIndentation(4, '  ', 0, 1);
            testIndentation(4, '  \t', 0, 2);
            testIndentation(4, '   ', 0, 1);
            testIndentation(4, '   \t', 0, 2);
            testIndentation(4, '    ', 0, 2);
            // 2 => 1
            testIndentation(4, '\t\t', 1, 3);
            testIndentation(4, '\t ', 1, 2);
            testIndentation(4, '\t \t', 1, 3);
            testIndentation(4, '\t  ', 1, 2);
            testIndentation(4, '\t  \t', 1, 3);
            testIndentation(4, '\t   ', 1, 2);
            testIndentation(4, '\t   \t', 1, 3);
            testIndentation(4, '\t    ', 1, 3);
            testIndentation(4, ' \t\t', 1, 3);
            testIndentation(4, ' \t ', 1, 2);
            testIndentation(4, ' \t \t', 1, 3);
            testIndentation(4, ' \t  ', 1, 2);
            testIndentation(4, ' \t  \t', 1, 3);
            testIndentation(4, ' \t   ', 1, 2);
            testIndentation(4, ' \t   \t', 1, 3);
            testIndentation(4, ' \t    ', 1, 3);
            testIndentation(4, '  \t\t', 1, 3);
            testIndentation(4, '  \t ', 1, 2);
            testIndentation(4, '  \t \t', 1, 3);
            testIndentation(4, '  \t  ', 1, 2);
            testIndentation(4, '  \t  \t', 1, 3);
            testIndentation(4, '  \t   ', 1, 2);
            testIndentation(4, '  \t   \t', 1, 3);
            testIndentation(4, '  \t    ', 1, 3);
            testIndentation(4, '   \t\t', 1, 3);
            testIndentation(4, '   \t ', 1, 2);
            testIndentation(4, '   \t \t', 1, 3);
            testIndentation(4, '   \t  ', 1, 2);
            testIndentation(4, '   \t  \t', 1, 3);
            testIndentation(4, '   \t   ', 1, 2);
            testIndentation(4, '   \t   \t', 1, 3);
            testIndentation(4, '   \t    ', 1, 3);
            testIndentation(4, '    \t', 1, 3);
            testIndentation(4, '     ', 1, 2);
            testIndentation(4, '     \t', 1, 3);
            testIndentation(4, '      ', 1, 2);
            testIndentation(4, '      \t', 1, 3);
            testIndentation(4, '       ', 1, 2);
            testIndentation(4, '       \t', 1, 3);
            testIndentation(4, '        ', 1, 3);
            // 3 => 2
            testIndentation(4, '         ', 2, 3);
        });
        function _assertUnshiftCommand(tabSize, oneIndent, text, expected) {
            return editorTestUtils_1.withEditorModel(text, function (model) {
                var op = new shiftCommand_1.ShiftCommand(new selection_1.Selection(1, 1, text.length + 1, 1), {
                    isUnshift: true,
                    tabSize: tabSize,
                    oneIndent: oneIndent
                });
                var actual = TU.getEditOperation(model, op);
                assert.deepEqual(actual, expected);
            });
        }
        function _assertShiftCommand(tabSize, oneIndent, text, expected) {
            return editorTestUtils_1.withEditorModel(text, function (model) {
                var op = new shiftCommand_1.ShiftCommand(new selection_1.Selection(1, 1, text.length + 1, 1), {
                    isUnshift: false,
                    tabSize: tabSize,
                    oneIndent: oneIndent
                });
                var actual = TU.getEditOperation(model, op);
                assert.deepEqual(actual, expected);
            });
        }
    });
});
//# sourceMappingURL=shiftCommand.test.js.map