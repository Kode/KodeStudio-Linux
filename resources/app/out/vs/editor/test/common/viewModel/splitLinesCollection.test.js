/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/editor/common/viewModel/splitLinesCollection', 'vs/editor/common/viewModel/characterHardWrappingLineMapper', 'vs/editor/common/viewModel/prefixSumComputer', 'vs/editor/common/core/position'], function (require, exports, assert, SplitLinesCollection, CharacterHardWrappingLineMapper, PrefixSumComputer, Position) {
    suite('Editor ViewModel - SplitLinesCollection', function () {
        test('SplitLine', function () {
            var model1 = createModel('My First LineMy Second LineAnd another one');
            var line1 = createSplitLine([13, 14, 15], '');
            assert.equal(line1.getOutputLineCount(), 3);
            assert.equal(line1.getOutputLineContent(model1, 1, 0), 'My First Line');
            assert.equal(line1.getOutputLineContent(model1, 1, 1), 'My Second Line');
            assert.equal(line1.getOutputLineContent(model1, 1, 2), 'And another one');
            assert.equal(line1.getOutputLineMaxColumn(model1, 1, 0), 14);
            assert.equal(line1.getOutputLineMaxColumn(model1, 1, 1), 15);
            assert.equal(line1.getOutputLineMaxColumn(model1, 1, 2), 16);
            for (var col = 1; col <= 14; col++) {
                assert.equal(line1.getInputColumnOfOutputPosition(0, col), col, 'getInputColumnOfOutputPosition(0, ' + col + ')');
            }
            for (var col = 1; col <= 15; col++) {
                assert.equal(line1.getInputColumnOfOutputPosition(1, col), 13 + col, 'getInputColumnOfOutputPosition(1, ' + col + ')');
            }
            for (var col = 1; col <= 16; col++) {
                assert.equal(line1.getInputColumnOfOutputPosition(2, col), 13 + 14 + col, 'getInputColumnOfOutputPosition(2, ' + col + ')');
            }
            for (var col = 1; col <= 13; col++) {
                assert.deepEqual(line1.getOutputPositionOfInputPosition(0, col), pos(0, col), 'getOutputPositionOfInputPosition(' + col + ')');
            }
            for (var col = 1 + 13; col <= 14 + 13; col++) {
                assert.deepEqual(line1.getOutputPositionOfInputPosition(0, col), pos(1, col - 13), 'getOutputPositionOfInputPosition(' + col + ')');
            }
            for (var col = 1 + 13 + 14; col <= 15 + 14 + 13; col++) {
                assert.deepEqual(line1.getOutputPositionOfInputPosition(0, col), pos(2, col - 13 - 14), 'getOutputPositionOfInputPosition(' + col + ')');
            }
            var model1 = createModel('My First LineMy Second LineAnd another one');
            var line1 = createSplitLine([13, 14, 15], '\t');
            assert.equal(line1.getOutputLineCount(), 3);
            assert.equal(line1.getOutputLineContent(model1, 1, 0), 'My First Line');
            assert.equal(line1.getOutputLineContent(model1, 1, 1), '\tMy Second Line');
            assert.equal(line1.getOutputLineContent(model1, 1, 2), '\tAnd another one');
            assert.equal(line1.getOutputLineMaxColumn(model1, 1, 0), 14);
            assert.equal(line1.getOutputLineMaxColumn(model1, 1, 1), 16);
            assert.equal(line1.getOutputLineMaxColumn(model1, 1, 2), 17);
            for (var col = 1; col <= 14; col++) {
                assert.equal(line1.getInputColumnOfOutputPosition(0, col), col, 'getInputColumnOfOutputPosition(0, ' + col + ')');
            }
            for (var col = 1; col <= 1; col++) {
                assert.equal(line1.getInputColumnOfOutputPosition(1, 1), 13 + col, 'getInputColumnOfOutputPosition(1, ' + col + ')');
            }
            for (var col = 2; col <= 16; col++) {
                assert.equal(line1.getInputColumnOfOutputPosition(1, col), 13 + col - 1, 'getInputColumnOfOutputPosition(1, ' + col + ')');
            }
            for (var col = 1; col <= 1; col++) {
                assert.equal(line1.getInputColumnOfOutputPosition(2, col), 13 + 14 + col, 'getInputColumnOfOutputPosition(2, ' + col + ')');
            }
            for (var col = 2; col <= 17; col++) {
                assert.equal(line1.getInputColumnOfOutputPosition(2, col), 13 + 14 + col - 1, 'getInputColumnOfOutputPosition(2, ' + col + ')');
            }
            for (var col = 1; col <= 13; col++) {
                assert.deepEqual(line1.getOutputPositionOfInputPosition(0, col), pos(0, col), 'getOutputPositionOfInputPosition(' + col + ')');
            }
            for (var col = 1 + 13; col <= 14 + 13; col++) {
                assert.deepEqual(line1.getOutputPositionOfInputPosition(0, col), pos(1, 1 + col - 13), 'getOutputPositionOfInputPosition(' + col + ')');
            }
            for (var col = 1 + 13 + 14; col <= 15 + 14 + 13; col++) {
                assert.deepEqual(line1.getOutputPositionOfInputPosition(0, col), pos(2, 1 + col - 13 - 14), 'getOutputPositionOfInputPosition(' + col + ')');
            }
        });
    });
    function pos(lineNumber, column) {
        return new Position.Position(lineNumber, column);
    }
    function createSplitLine(splitLengths, wrappedLinesPrefix) {
        return new SplitLinesCollection.SplitLine(createLineMapping(splitLengths, wrappedLinesPrefix));
    }
    function createLineMapping(breakingLengths, wrappedLinesPrefix) {
        return new CharacterHardWrappingLineMapper.CharacterHardWrappingLineMapping(new PrefixSumComputer.PrefixSumComputer(breakingLengths), wrappedLinesPrefix);
    }
    function createModel(text) {
        return {
            getLineTokens: function (lineNumber, inaccurateTokensAcceptable) {
                return null;
            },
            getLineContent: function (lineNumber) {
                return text;
            },
            getLineMinColumn: function (lineNumber) {
                return 1;
            },
            getLineMaxColumn: function (lineNumber) {
                return text.length + 1;
            }
        };
    }
});
//# sourceMappingURL=splitLinesCollection.test.js.map