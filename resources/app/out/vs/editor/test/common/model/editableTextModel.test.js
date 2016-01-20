/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/editor/common/core/range', 'vs/editor/common/editorCommon', 'vs/editor/common/model/editableTextModel', 'vs/editor/common/model/textModel', 'vs/editor/common/model/mirrorModel2', 'vs/editor/common/model/mirrorModel'], function (require, exports, assert, range_1, EditorCommon, editableTextModel_1, textModel_1, mirrorModel2_1, mirrorModel_1) {
    suite('EditorModel - EditableTextModel._getInverseEdits', function () {
        function editOp(startLineNumber, startColumn, endLineNumber, endColumn, text) {
            return {
                identifier: null,
                range: new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn),
                lines: text,
                forceMoveMarkers: false
            };
        }
        function inverseEditOp(startLineNumber, startColumn, endLineNumber, endColumn) {
            return new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn);
        }
        function assertInverseEdits(ops, expected) {
            var actual = editableTextModel_1.EditableTextModel._getInverseEditRanges(editableTextModel_1.EditableTextModel._toDeltaOperations(ops));
            assert.deepEqual(actual, expected);
        }
        test('single insert', function () {
            assertInverseEdits([
                editOp(1, 1, 1, 1, ['hello'])
            ], [
                inverseEditOp(1, 1, 1, 6)
            ]);
        });
        test('Bug 19872: Undo is funky', function () {
            assertInverseEdits([
                editOp(2, 1, 2, 2, ['']),
                editOp(3, 1, 4, 2, [''])
            ], [
                inverseEditOp(2, 1, 2, 1),
                inverseEditOp(3, 1, 3, 1)
            ]);
        });
        test('two single unrelated inserts', function () {
            assertInverseEdits([
                editOp(1, 1, 1, 1, ['hello']),
                editOp(2, 1, 2, 1, ['world'])
            ], [
                inverseEditOp(1, 1, 1, 6),
                inverseEditOp(2, 1, 2, 6)
            ]);
        });
        test('two single inserts 1', function () {
            assertInverseEdits([
                editOp(1, 1, 1, 1, ['hello']),
                editOp(1, 2, 1, 2, ['world'])
            ], [
                inverseEditOp(1, 1, 1, 6),
                inverseEditOp(1, 7, 1, 12)
            ]);
        });
        test('two single inserts 2', function () {
            assertInverseEdits([
                editOp(1, 1, 1, 1, ['hello']),
                editOp(1, 4, 1, 4, ['world'])
            ], [
                inverseEditOp(1, 1, 1, 6),
                inverseEditOp(1, 9, 1, 14)
            ]);
        });
        test('multiline insert', function () {
            assertInverseEdits([
                editOp(1, 1, 1, 1, ['hello', 'world'])
            ], [
                inverseEditOp(1, 1, 2, 6)
            ]);
        });
        test('two unrelated multiline inserts', function () {
            assertInverseEdits([
                editOp(1, 1, 1, 1, ['hello', 'world']),
                editOp(2, 1, 2, 1, ['how', 'are', 'you?']),
            ], [
                inverseEditOp(1, 1, 2, 6),
                inverseEditOp(3, 1, 5, 5),
            ]);
        });
        test('two multiline inserts 1', function () {
            assertInverseEdits([
                editOp(1, 1, 1, 1, ['hello', 'world']),
                editOp(1, 2, 1, 2, ['how', 'are', 'you?']),
            ], [
                inverseEditOp(1, 1, 2, 6),
                inverseEditOp(2, 7, 4, 5),
            ]);
        });
        test('single delete', function () {
            assertInverseEdits([
                editOp(1, 1, 1, 6, null)
            ], [
                inverseEditOp(1, 1, 1, 1)
            ]);
        });
        test('two single unrelated deletes', function () {
            assertInverseEdits([
                editOp(1, 1, 1, 6, null),
                editOp(2, 1, 2, 6, null)
            ], [
                inverseEditOp(1, 1, 1, 1),
                inverseEditOp(2, 1, 2, 1)
            ]);
        });
        test('two single deletes 1', function () {
            assertInverseEdits([
                editOp(1, 1, 1, 6, null),
                editOp(1, 7, 1, 12, null)
            ], [
                inverseEditOp(1, 1, 1, 1),
                inverseEditOp(1, 2, 1, 2)
            ]);
        });
        test('two single deletes 2', function () {
            assertInverseEdits([
                editOp(1, 1, 1, 6, null),
                editOp(1, 9, 1, 14, null)
            ], [
                inverseEditOp(1, 1, 1, 1),
                inverseEditOp(1, 4, 1, 4)
            ]);
        });
        test('multiline delete', function () {
            assertInverseEdits([
                editOp(1, 1, 2, 6, null)
            ], [
                inverseEditOp(1, 1, 1, 1)
            ]);
        });
        test('two unrelated multiline deletes', function () {
            assertInverseEdits([
                editOp(1, 1, 2, 6, null),
                editOp(3, 1, 5, 5, null),
            ], [
                inverseEditOp(1, 1, 1, 1),
                inverseEditOp(2, 1, 2, 1),
            ]);
        });
        test('two multiline deletes 1', function () {
            assertInverseEdits([
                editOp(1, 1, 2, 6, null),
                editOp(2, 7, 4, 5, null),
            ], [
                inverseEditOp(1, 1, 1, 1),
                inverseEditOp(1, 2, 1, 2),
            ]);
        });
        test('single replace', function () {
            assertInverseEdits([
                editOp(1, 1, 1, 6, ['Hello world'])
            ], [
                inverseEditOp(1, 1, 1, 12)
            ]);
        });
        test('two replaces', function () {
            assertInverseEdits([
                editOp(1, 1, 1, 6, ['Hello world']),
                editOp(1, 7, 1, 8, ['How are you?']),
            ], [
                inverseEditOp(1, 1, 1, 12),
                inverseEditOp(1, 13, 1, 25)
            ]);
        });
        test('many edits', function () {
            assertInverseEdits([
                editOp(1, 2, 1, 2, ['', '  ']),
                editOp(1, 5, 1, 6, ['']),
                editOp(1, 9, 1, 9, ['', ''])
            ], [
                inverseEditOp(1, 2, 2, 3),
                inverseEditOp(2, 6, 2, 6),
                inverseEditOp(2, 9, 3, 1)
            ]);
        });
    });
    suite('EditorModel - EditableTextModel._toSingleEditOperation', function () {
        function editOp(startLineNumber, startColumn, endLineNumber, endColumn, text) {
            return {
                identifier: null,
                range: new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn),
                lines: text,
                forceMoveMarkers: false
            };
        }
        function testApplyEdits(original, edits, expected) {
            var model = new editableTextModel_1.EditableTextModel([], textModel_1.TextModel.toRawText(original.join('\n')), null);
            model.setEOL(EditorCommon.EndOfLineSequence.LF);
            var actual = model._toSingleEditOperation(edits);
            assert.deepEqual(actual, expected);
            model.dispose();
        }
        test('one edit op is unchanged', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 3, 1, 3, [' new line', 'No longer'])
            ], editOp(1, 3, 1, 3, [' new line', 'No longer']));
        });
        test('two edits on one line', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 1, 1, 3, ['Your']),
                editOp(1, 4, 1, 4, ['Interesting ']),
                editOp(2, 3, 2, 6, null)
            ], editOp(1, 1, 2, 6, [
                'Your Interesting First Line',
                '\t\t'
            ]));
        });
        test('insert multiple newlines', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 3, 1, 3, ['', '', '', '', '']),
                editOp(3, 15, 3, 15, ['a', 'b'])
            ], editOp(1, 3, 3, 15, [
                '',
                '',
                '',
                '',
                ' First Line',
                '\t\tMy Second Line',
                '    Third Linea',
                'b'
            ]));
        });
        test('delete empty text', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 1, 1, 1, [''])
            ], editOp(1, 1, 1, 1, ['']));
        });
        test('two unrelated edits', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], [
                editOp(2, 1, 2, 3, ['\t']),
                editOp(3, 1, 3, 5, [''])
            ], editOp(2, 1, 3, 5, ['\tMy Second Line', '']));
        });
        test('many edits', function () {
            testApplyEdits([
                '{"x" : 1}'
            ], [
                editOp(1, 2, 1, 2, ['\n  ']),
                editOp(1, 5, 1, 6, ['']),
                editOp(1, 9, 1, 9, ['\n'])
            ], editOp(1, 2, 1, 9, [
                '',
                '  "x": 1',
                ''
            ]));
        });
        test('many edits reversed', function () {
            testApplyEdits([
                '{',
                '  "x": 1',
                '}'
            ], [
                editOp(1, 2, 2, 3, ['']),
                editOp(2, 6, 2, 6, [' ']),
                editOp(2, 9, 3, 1, [''])
            ], editOp(1, 2, 3, 1, ['"x" : 1']));
        });
        test('replacing newlines 1', function () {
            testApplyEdits([
                '{',
                '"a": true,',
                '',
                '"b": true',
                '}'
            ], [
                editOp(1, 2, 2, 1, ['', '\t']),
                editOp(2, 11, 4, 1, ['', '\t'])
            ], editOp(1, 2, 4, 1, [
                '',
                '\t"a": true,',
                '\t'
            ]));
        });
        test('replacing newlines 2', function () {
            testApplyEdits([
                'some text',
                'some more text',
                'now comes an empty line',
                '',
                'after empty line',
                'and the last line'
            ], [
                editOp(1, 5, 3, 1, [' text', 'some more text', 'some more text']),
                editOp(3, 2, 4, 1, ['o more lines', 'asd', 'asd', 'asd']),
                editOp(5, 1, 5, 6, ['zzzzzzzz']),
                editOp(5, 11, 6, 16, ['1', '2', '3', '4'])
            ], editOp(1, 5, 6, 16, [
                ' text',
                'some more text',
                'some more textno more lines',
                'asd',
                'asd',
                'asd',
                'zzzzzzzz empt1',
                '2',
                '3',
                '4'
            ]));
        });
        test('advanced', function () {
            testApplyEdits([
                ' {       "d": [',
                '             null',
                '        ] /*comment*/',
                '        ,"e": /*comment*/ [null] }',
            ], [
                editOp(1, 1, 1, 2, ['']),
                editOp(1, 3, 1, 10, ['', '  ']),
                editOp(1, 16, 2, 14, ['', '    ']),
                editOp(2, 18, 3, 9, ['', '  ']),
                editOp(3, 22, 4, 9, ['']),
                editOp(4, 10, 4, 10, ['', '  ']),
                editOp(4, 28, 4, 28, ['', '    ']),
                editOp(4, 32, 4, 32, ['', '  ']),
                editOp(4, 33, 4, 34, ['', ''])
            ], editOp(1, 1, 4, 34, [
                '{',
                '  "d": [',
                '    null',
                '  ] /*comment*/,',
                '  "e": /*comment*/ [',
                '    null',
                '  ]',
                ''
            ]));
        });
        test('advanced simplified', function () {
            testApplyEdits([
                '   abc',
                ' ,def'
            ], [
                editOp(1, 1, 1, 4, ['']),
                editOp(1, 7, 2, 2, ['']),
                editOp(2, 3, 2, 3, ['', ''])
            ], editOp(1, 1, 2, 3, [
                'abc,',
                ''
            ]));
        });
    });
    suite('EditorModel - EditableTextModel.applyEdits', function () {
        function editOp(startLineNumber, startColumn, endLineNumber, endColumn, text) {
            return {
                identifier: null,
                range: new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn),
                text: text.join('\n'),
                forceMoveMarkers: false
            };
        }
        function testApplyEdits(original, edits, expected) {
            var originalStr = original.join('\n');
            var expectedStr = expected.join('\n');
            assertSyncedModels(originalStr, function (model, assertMirrorModels) {
                // Apply edits & collect inverse edits
                var inverseEdits = model.applyEdits(edits);
                // Assert edits produced expected result
                assert.deepEqual(model.getValue(EditorCommon.EndOfLinePreference.LF), expectedStr);
                assertMirrorModels();
                // Apply the inverse edits
                var inverseInverseEdits = model.applyEdits(inverseEdits);
                // Assert the inverse edits brought back model to original state
                assert.deepEqual(model.getValue(EditorCommon.EndOfLinePreference.LF), originalStr);
                // Assert the inverse of the inverse edits are the original edits
                assert.deepEqual(inverseInverseEdits, edits);
                assertMirrorModels();
            });
        }
        test('Bug 19872: Undo is funky', function () {
            testApplyEdits([
                'something',
                ' A',
                '',
                ' B',
                'something else'
            ], [
                editOp(2, 1, 2, 2, ['']),
                editOp(3, 1, 4, 2, [''])
            ], [
                'something',
                'A',
                'B',
                'something else'
            ]);
        });
        test('Bug 19872: Undo is funky', function () {
            testApplyEdits([
                'something',
                'A',
                'B',
                'something else'
            ], [
                editOp(2, 1, 2, 1, [' ']),
                editOp(3, 1, 3, 1, ['', ' '])
            ], [
                'something',
                ' A',
                '',
                ' B',
                'something else'
            ]);
        });
        test('insert empty text', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 1, 1, 1, [''])
            ], [
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ]);
        });
        test('last op is no-op', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 1, 1, 2, ['']),
                editOp(4, 1, 4, 1, [''])
            ], [
                'y First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ]);
        });
        test('insert text without newline 1', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 1, 1, 1, ['foo '])
            ], [
                'foo My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ]);
        });
        test('insert text without newline 2', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 3, 1, 3, [' foo'])
            ], [
                'My foo First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ]);
        });
        test('insert one newline', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 4, 1, 4, ['', ''])
            ], [
                'My ',
                'First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ]);
        });
        test('insert text with one newline', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 3, 1, 3, [' new line', 'No longer'])
            ], [
                'My new line',
                'No longer First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ]);
        });
        test('insert text with two newlines', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 3, 1, 3, [' new line', 'One more line in the middle', 'No longer'])
            ], [
                'My new line',
                'One more line in the middle',
                'No longer First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ]);
        });
        test('insert text with many newlines', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 3, 1, 3, ['', '', '', '', ''])
            ], [
                'My',
                '',
                '',
                '',
                ' First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ]);
        });
        test('insert multiple newlines', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 3, 1, 3, ['', '', '', '', '']),
                editOp(3, 15, 3, 15, ['a', 'b'])
            ], [
                'My',
                '',
                '',
                '',
                ' First Line',
                '\t\tMy Second Line',
                '    Third Linea',
                'b',
                '',
                '1'
            ]);
        });
        test('delete empty text', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 1, 1, 1, [''])
            ], [
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ]);
        });
        test('delete text from one line', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 1, 1, 2, [''])
            ], [
                'y First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ]);
        });
        test('delete text from one line 2', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 1, 1, 3, ['a'])
            ], [
                'a First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ]);
        });
        test('delete all text from a line', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 1, 1, 14, [''])
            ], [
                '',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ]);
        });
        test('delete text from two lines', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 4, 2, 6, [''])
            ], [
                'My Second Line',
                '    Third Line',
                '',
                '1'
            ]);
        });
        test('delete text from many lines', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 4, 3, 5, [''])
            ], [
                'My Third Line',
                '',
                '1'
            ]);
        });
        test('delete everything', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '1'
            ], [
                editOp(1, 1, 5, 2, [''])
            ], [
                ''
            ]);
        });
        test('two unrelated edits', function () {
            testApplyEdits([
                'My First Line',
                '\t\tMy Second Line',
                '    Third Line',
                '',
                '123'
            ], [
                editOp(2, 1, 2, 3, ['\t']),
                editOp(3, 1, 3, 5, [''])
            ], [
                'My First Line',
                '\tMy Second Line',
                'Third Line',
                '',
                '123'
            ]);
        });
        test('two edits on one line', function () {
            testApplyEdits([
                '\t\tfirst\t    ',
                '\t\tsecond line',
                '\tthird line',
                'fourth line',
                '\t\t<!@#fifth#@!>\t\t'
            ], [
                editOp(5, 3, 5, 7, ['']),
                editOp(5, 12, 5, 16, [''])
            ], [
                '\t\tfirst\t    ',
                '\t\tsecond line',
                '\tthird line',
                'fourth line',
                '\t\tfifth\t\t'
            ]);
        });
        test('many edits', function () {
            testApplyEdits([
                '{"x" : 1}'
            ], [
                editOp(1, 2, 1, 2, ['\n  ']),
                editOp(1, 5, 1, 6, ['']),
                editOp(1, 9, 1, 9, ['\n'])
            ], [
                '{',
                '  "x": 1',
                '}'
            ]);
        });
        test('many edits reversed', function () {
            testApplyEdits([
                '{',
                '  "x": 1',
                '}'
            ], [
                editOp(1, 2, 2, 3, ['']),
                editOp(2, 6, 2, 6, [' ']),
                editOp(2, 9, 3, 1, [''])
            ], [
                '{"x" : 1}'
            ]);
        });
        test('replacing newlines 1', function () {
            testApplyEdits([
                '{',
                '"a": true,',
                '',
                '"b": true',
                '}'
            ], [
                editOp(1, 2, 2, 1, ['', '\t']),
                editOp(2, 11, 4, 1, ['', '\t'])
            ], [
                '{',
                '\t"a": true,',
                '\t"b": true',
                '}'
            ]);
        });
        test('replacing newlines 2', function () {
            testApplyEdits([
                'some text',
                'some more text',
                'now comes an empty line',
                '',
                'after empty line',
                'and the last line'
            ], [
                editOp(1, 5, 3, 1, [' text', 'some more text', 'some more text']),
                editOp(3, 2, 4, 1, ['o more lines', 'asd', 'asd', 'asd']),
                editOp(5, 1, 5, 6, ['zzzzzzzz']),
                editOp(5, 11, 6, 16, ['1', '2', '3', '4'])
            ], [
                'some text',
                'some more text',
                'some more textno more lines',
                'asd',
                'asd',
                'asd',
                'zzzzzzzz empt1',
                '2',
                '3',
                '4ne'
            ]);
        });
        test('advanced', function () {
            testApplyEdits([
                ' {       "d": [',
                '             null',
                '        ] /*comment*/',
                '        ,"e": /*comment*/ [null] }',
            ], [
                editOp(1, 1, 1, 2, ['']),
                editOp(1, 3, 1, 10, ['', '  ']),
                editOp(1, 16, 2, 14, ['', '    ']),
                editOp(2, 18, 3, 9, ['', '  ']),
                editOp(3, 22, 4, 9, ['']),
                editOp(4, 10, 4, 10, ['', '  ']),
                editOp(4, 28, 4, 28, ['', '    ']),
                editOp(4, 32, 4, 32, ['', '  ']),
                editOp(4, 33, 4, 34, ['', ''])
            ], [
                '{',
                '  "d": [',
                '    null',
                '  ] /*comment*/,',
                '  "e": /*comment*/ [',
                '    null',
                '  ]',
                '}',
            ]);
        });
        test('advanced simplified', function () {
            testApplyEdits([
                '   abc',
                ' ,def'
            ], [
                editOp(1, 1, 1, 4, ['']),
                editOp(1, 7, 2, 2, ['']),
                editOp(2, 3, 2, 3, ['', ''])
            ], [
                'abc,',
                'def'
            ]);
        });
        test('issue #144', function () {
            testApplyEdits([
                'package caddy',
                '',
                'func main() {',
                '\tfmt.Println("Hello World! :)")',
                '}',
                ''
            ], [
                editOp(1, 1, 6, 1, [
                    'package caddy',
                    '',
                    'import "fmt"',
                    '',
                    'func main() {',
                    '\tfmt.Println("Hello World! :)")',
                    '}',
                    ''
                ])
            ], [
                'package caddy',
                '',
                'import "fmt"',
                '',
                'func main() {',
                '\tfmt.Println("Hello World! :)")',
                '}',
                ''
            ]);
        });
        function assertSyncedModels(text, callback, setup) {
            if (setup === void 0) { setup = null; }
            var model = new editableTextModel_1.EditableTextModel([], textModel_1.TextModel.toRawText(text), null);
            model.setEOL(EditorCommon.EndOfLineSequence.LF);
            if (setup) {
                setup(model);
            }
            var mirrorModel1 = new mirrorModel_1.MirrorModel(null, model.getVersionId(), model.toRawText(), null);
            var mirrorModel1PrevVersionId = model.getVersionId();
            var mirrorModel2 = new mirrorModel2_1.MirrorModel2(null, model.toRawText().lines, model.toRawText().EOL, model.getVersionId());
            var mirrorModel2PrevVersionId = model.getVersionId();
            model.addListener(EditorCommon.EventType.ModelContentChanged, function (e) {
                var versionId = e.versionId;
                if (versionId < mirrorModel1PrevVersionId) {
                    console.warn('Model version id did not advance between edits (1)');
                }
                mirrorModel1PrevVersionId = versionId;
                var mirrorModelEvents = {
                    propertiesChanged: null,
                    contentChanged: [e]
                };
                mirrorModel1.onEvents(mirrorModelEvents);
            });
            model.addListener(EditorCommon.EventType.ModelContentChanged2, function (e) {
                var versionId = e.versionId;
                if (versionId < mirrorModel2PrevVersionId) {
                    console.warn('Model version id did not advance between edits (2)');
                }
                mirrorModel2PrevVersionId = versionId;
                mirrorModel2.onEvents([e]);
            });
            var assertMirrorModels = function () {
                model._assertLineNumbersOK();
                assert.equal(mirrorModel2.getText(), model.getValue(), 'mirror model 2 text OK');
                assert.equal(mirrorModel2.version, model.getVersionId(), 'mirror model 2 version OK');
                assert.equal(mirrorModel1.getValue(), model.getValue(), 'mirror model 1 text OK');
                assert.equal(mirrorModel1.getVersionId(), model.getVersionId(), 'mirror model 1 version OK');
            };
            callback(model, assertMirrorModels);
            model.dispose();
            mirrorModel1.dispose();
            mirrorModel2.dispose();
        }
        test('change while emitting events 1', function () {
            assertSyncedModels('Hello', function (model, assertMirrorModels) {
                model.applyEdits([{
                        identifier: null,
                        range: new range_1.Range(1, 6, 1, 6),
                        text: ' world!',
                        forceMoveMarkers: false
                    }]);
                assertMirrorModels();
            }, function (model) {
                var isFirstTime = true;
                model.addBulkListener(function (events) {
                    if (!isFirstTime) {
                        return;
                    }
                    isFirstTime = false;
                    model.applyEdits([{
                            identifier: null,
                            range: new range_1.Range(1, 13, 1, 13),
                            text: ' How are you?',
                            forceMoveMarkers: false
                        }]);
                });
            });
        });
        test('change while emitting events 2', function () {
            assertSyncedModels('Hello', function (model, assertMirrorModels) {
                model.applyEdits([{
                        identifier: null,
                        range: new range_1.Range(1, 6, 1, 6),
                        text: ' world!',
                        forceMoveMarkers: false
                    }]);
                assertMirrorModels();
            }, function (model) {
                var isFirstTime = true;
                model.addListener(EditorCommon.EventType.ModelContentChanged2, function (e) {
                    if (!isFirstTime) {
                        return;
                    }
                    isFirstTime = false;
                    model.applyEdits([{
                            identifier: null,
                            range: new range_1.Range(1, 13, 1, 13),
                            text: ' How are you?',
                            forceMoveMarkers: false
                        }]);
                });
            });
        });
        test('issue #1580: Changes in line endings are not correctly reflected in the extension host, leading to invalid offsets sent to external refactoring tools', function () {
            var model = new editableTextModel_1.EditableTextModel([], textModel_1.TextModel.toRawText('Hello\nWorld!'), null);
            assert.equal(model.getEOL(), '\n');
            var mirrorModel2 = new mirrorModel2_1.MirrorModel2(null, model.toRawText().lines, model.toRawText().EOL, model.getVersionId());
            var mirrorModel2PrevVersionId = model.getVersionId();
            model.addListener(EditorCommon.EventType.ModelContentChanged2, function (e) {
                var versionId = e.versionId;
                if (versionId < mirrorModel2PrevVersionId) {
                    console.warn('Model version id did not advance between edits (2)');
                }
                mirrorModel2PrevVersionId = versionId;
                mirrorModel2.onEvents([e]);
            });
            var assertMirrorModels = function () {
                model._assertLineNumbersOK();
                assert.equal(mirrorModel2.getText(), model.getValue(), 'mirror model 2 text OK');
                assert.equal(mirrorModel2.version, model.getVersionId(), 'mirror model 2 version OK');
            };
            model.setEOL(EditorCommon.EndOfLineSequence.CRLF);
            assertMirrorModels();
            model.dispose();
            mirrorModel2.dispose();
        });
    });
    suite('EditorModel - EditableTextModel.applyEdits & markers', function () {
        function editOp(startLineNumber, startColumn, endLineNumber, endColumn, text) {
            return {
                identifier: null,
                range: new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn),
                text: text.join('\n'),
                forceMoveMarkers: false
            };
        }
        function marker(id, lineNumber, column, stickToPreviousCharacter) {
            return {
                id: id,
                lineNumber: lineNumber,
                column: column,
                stickToPreviousCharacter: stickToPreviousCharacter
            };
        }
        function toMarkersMap(markers) {
            var result = {};
            markers.forEach(function (m) {
                result[m.id] = m;
            });
            return result;
        }
        function testApplyEditsAndMarkers(text, markers, edits, changedMarkers, expectedText, expectedMarkers) {
            var textStr = text.join('\n');
            var expectedTextStr = expectedText.join('\n');
            var markersMap = toMarkersMap(markers);
            // var expectedMarkersMap = toMarkersMap(expectedMarkers);
            var markerId2ModelMarkerId = Object.create(null);
            var model = new editableTextModel_1.EditableTextModel([], textModel_1.TextModel.toRawText(textStr), null);
            model.setEOL(EditorCommon.EndOfLineSequence.LF);
            // Add markers
            markers.forEach(function (m) {
                var modelMarkerId = model._addMarker(m.lineNumber, m.column, m.stickToPreviousCharacter);
                markerId2ModelMarkerId[m.id] = modelMarkerId;
            });
            // Apply edits & collect inverse edits
            model.applyEdits(edits);
            model._assertLineNumbersOK();
            // Assert edits produced expected result
            assert.deepEqual(model.getValue(EditorCommon.EndOfLinePreference.LF), expectedTextStr);
            var actualChangedMarkers = [];
            for (var i = 0, len = expectedMarkers.length; i < len; i++) {
                var expectedMarker = expectedMarkers[i];
                var initialMarker = markersMap[expectedMarker.id];
                var expectedMarkerModelMarkerId = markerId2ModelMarkerId[expectedMarker.id];
                var actualMarker = model._getMarker(expectedMarkerModelMarkerId);
                if (actualMarker.lineNumber !== initialMarker.lineNumber || actualMarker.column !== initialMarker.column) {
                    actualChangedMarkers.push(initialMarker.id);
                }
                assert.equal(actualMarker.lineNumber, expectedMarker.lineNumber, 'marker lineNumber of marker ' + expectedMarker.id);
                assert.equal(actualMarker.column, expectedMarker.column, 'marker column of marker ' + expectedMarker.id);
            }
            changedMarkers.sort();
            actualChangedMarkers.sort();
            assert.deepEqual(actualChangedMarkers, changedMarkers, 'changed markers');
            model.dispose();
        }
        test('no markers changed', function () {
            testApplyEditsAndMarkers([
                'Hello world,',
                'this is a short text',
                'that is used in testing'
            ], [
                marker('a', 1, 1, true),
                marker('b', 1, 1, false),
                marker('c', 1, 7, false),
                marker('d', 1, 12, true),
                marker('e', 2, 1, false),
                marker('f', 2, 16, true),
                marker('g', 2, 21, true),
                marker('h', 3, 24, false)
            ], [
                editOp(1, 13, 1, 13, [' how are you?'])
            ], [], [
                'Hello world, how are you?',
                'this is a short text',
                'that is used in testing'
            ], [
                marker('a', 1, 1, true),
                marker('b', 1, 1, false),
                marker('c', 1, 7, false),
                marker('d', 1, 12, true),
                marker('e', 2, 1, false),
                marker('f', 2, 16, true),
                marker('g', 2, 21, true),
                marker('h', 3, 24, false)
            ]);
        });
        test('first line changes', function () {
            testApplyEditsAndMarkers([
                'Hello world,',
                'this is a short text',
                'that is used in testing'
            ], [
                marker('a', 1, 1, true),
                marker('b', 1, 1, false),
                marker('c', 1, 7, false),
                marker('d', 1, 12, true),
                marker('e', 2, 1, false),
                marker('f', 2, 16, true),
                marker('g', 2, 21, true),
                marker('h', 3, 24, false)
            ], [
                editOp(1, 7, 1, 12, ['friends'])
            ], [], [
                'Hello friends,',
                'this is a short text',
                'that is used in testing'
            ], [
                marker('a', 1, 1, true),
                marker('b', 1, 1, false),
                marker('c', 1, 7, false),
                marker('d', 1, 12, true),
                marker('e', 2, 1, false),
                marker('f', 2, 16, true),
                marker('g', 2, 21, true),
                marker('h', 3, 24, false)
            ]);
        });
        test('inserting lines', function () {
            testApplyEditsAndMarkers([
                'Hello world,',
                'this is a short text',
                'that is used in testing'
            ], [
                marker('a', 1, 1, true),
                marker('b', 1, 1, false),
                marker('c', 1, 7, false),
                marker('d', 1, 12, true),
                marker('e', 2, 1, false),
                marker('f', 2, 16, true),
                marker('g', 2, 21, true),
                marker('h', 3, 24, false)
            ], [
                editOp(1, 7, 1, 12, ['friends']),
                editOp(1, 13, 1, 13, ['', 'this is an inserted line', 'and another one. By the way,'])
            ], ['e', 'f', 'g', 'h'], [
                'Hello friends,',
                'this is an inserted line',
                'and another one. By the way,',
                'this is a short text',
                'that is used in testing'
            ], [
                marker('a', 1, 1, true),
                marker('b', 1, 1, false),
                marker('c', 1, 7, false),
                marker('d', 1, 12, true),
                marker('e', 4, 1, false),
                marker('f', 4, 16, true),
                marker('g', 4, 21, true),
                marker('h', 5, 24, false)
            ]);
        });
        test('replacing a lot', function () {
            testApplyEditsAndMarkers([
                'Hello world,',
                'this is a short text',
                'that is used in testing',
                'more lines...',
                'more lines...',
                'more lines...',
                'more lines...'
            ], [
                marker('a', 1, 1, true),
                marker('b', 1, 1, false),
                marker('c', 1, 7, false),
                marker('d', 1, 12, true),
                marker('e', 2, 1, false),
                marker('f', 2, 16, true),
                marker('g', 2, 21, true),
                marker('h', 3, 24, false),
                marker('i', 5, 1, false),
                marker('j', 6, 1, false),
                marker('k', 7, 14, false),
            ], [
                editOp(1, 7, 1, 12, ['friends']),
                editOp(1, 13, 1, 13, ['', 'this is an inserted line', 'and another one. By the way,', 'This is another line']),
                editOp(2, 1, 7, 14, ['Some new text here'])
            ], ['e', 'f', 'g', 'h', 'i', 'j', 'k'], [
                'Hello friends,',
                'this is an inserted line',
                'and another one. By the way,',
                'This is another line',
                'Some new text here'
            ], [
                marker('a', 1, 1, true),
                marker('b', 1, 1, false),
                marker('c', 1, 7, false),
                marker('d', 1, 12, true),
                marker('e', 5, 1, false),
                marker('f', 5, 16, true),
                marker('g', 5, 19, true),
                marker('h', 5, 19, false),
                marker('i', 5, 19, false),
                marker('j', 5, 19, false),
                marker('k', 5, 19, false),
            ]);
        });
    });
});
//# sourceMappingURL=editableTextModel.test.js.map