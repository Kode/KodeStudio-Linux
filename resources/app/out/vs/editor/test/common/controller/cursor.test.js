/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/editor/common/model/model', 'vs/editor/common/controller/cursor', 'vs/editor/common/core/position', 'vs/editor/common/core/range', 'vs/editor/test/common/testModes', 'vs/editor/common/editorCommon', 'vs/editor/test/common/mocks/mockConfiguration', 'vs/editor/common/core/editOperation'], function (require, exports, assert, Model, Cursor, Position, Range, ModelModes, EditorCommon, mockConfiguration_1, editOperation_1) {
    var H = EditorCommon.Handler;
    // --------- utils
    function cursorCommand(cursor, command, extraData, sizeProvider, overwriteSource) {
        if (sizeProvider) {
            cursor.configuration.editor.pageSize = sizeProvider.pageSize;
        }
        cursor.configuration.handlerDispatcher.trigger(overwriteSource || 'tests', command, extraData);
    }
    function moveTo(cursor, lineNumber, column, inSelectionMode) {
        if (inSelectionMode === void 0) { inSelectionMode = false; }
        cursorCommand(cursor, inSelectionMode ? H.MoveToSelect : H.MoveTo, { position: new Position.Position(lineNumber, column) });
    }
    function moveLeft(cursor, inSelectionMode) {
        if (inSelectionMode === void 0) { inSelectionMode = false; }
        cursorCommand(cursor, inSelectionMode ? H.CursorLeftSelect : H.CursorLeft);
    }
    function moveWordLeft(cursor, inSelectionMode) {
        if (inSelectionMode === void 0) { inSelectionMode = false; }
        cursorCommand(cursor, inSelectionMode ? H.CursorWordLeftSelect : H.CursorWordLeft);
    }
    function moveRight(cursor, inSelectionMode) {
        if (inSelectionMode === void 0) { inSelectionMode = false; }
        cursorCommand(cursor, inSelectionMode ? H.CursorRightSelect : H.CursorRight);
    }
    function moveWordRight(cursor, inSelectionMode) {
        if (inSelectionMode === void 0) { inSelectionMode = false; }
        cursorCommand(cursor, inSelectionMode ? H.CursorWordRightSelect : H.CursorWordRight);
    }
    function moveDown(cursor, linesCount, inSelectionMode) {
        if (inSelectionMode === void 0) { inSelectionMode = false; }
        if (linesCount === 1) {
            cursorCommand(cursor, inSelectionMode ? H.CursorDownSelect : H.CursorDown);
        }
        else {
            cursorCommand(cursor, inSelectionMode ? H.CursorPageDownSelect : H.CursorPageDown, null, { pageSize: linesCount });
        }
    }
    function moveUp(cursor, linesCount, inSelectionMode) {
        if (inSelectionMode === void 0) { inSelectionMode = false; }
        if (linesCount === 1) {
            cursorCommand(cursor, inSelectionMode ? H.CursorUpSelect : H.CursorUp);
        }
        else {
            cursorCommand(cursor, inSelectionMode ? H.CursorPageUpSelect : H.CursorPageUp, null, { pageSize: linesCount });
        }
    }
    function moveToBeginningOfLine(cursor, inSelectionMode) {
        if (inSelectionMode === void 0) { inSelectionMode = false; }
        cursorCommand(cursor, inSelectionMode ? H.CursorHomeSelect : H.CursorHome);
    }
    function moveToEndOfLine(cursor, inSelectionMode) {
        if (inSelectionMode === void 0) { inSelectionMode = false; }
        cursorCommand(cursor, inSelectionMode ? H.CursorEndSelect : H.CursorEnd);
    }
    function moveToBeginningOfBuffer(cursor, inSelectionMode) {
        if (inSelectionMode === void 0) { inSelectionMode = false; }
        cursorCommand(cursor, inSelectionMode ? H.CursorTopSelect : H.CursorTop);
    }
    function moveToEndOfBuffer(cursor, inSelectionMode) {
        if (inSelectionMode === void 0) { inSelectionMode = false; }
        cursorCommand(cursor, inSelectionMode ? H.CursorBottomSelect : H.CursorBottom);
    }
    function deleteWordLeft(cursor) {
        cursorCommand(cursor, H.DeleteWordLeft);
    }
    function deleteWordRight(cursor) {
        cursorCommand(cursor, H.DeleteWordRight);
    }
    function positionEqual(position, lineNumber, column) {
        assert.deepEqual({
            lineNumber: position.lineNumber,
            column: position.column
        }, {
            lineNumber: lineNumber,
            column: column
        }, 'position equal');
    }
    function selectionEqual(selection, posLineNumber, posColumn, selLineNumber, selColumn) {
        assert.deepEqual({
            selectionStartLineNumber: selection.selectionStartLineNumber,
            selectionStartColumn: selection.selectionStartColumn,
            positionLineNumber: selection.positionLineNumber,
            positionColumn: selection.positionColumn
        }, {
            selectionStartLineNumber: selLineNumber,
            selectionStartColumn: selColumn,
            positionLineNumber: posLineNumber,
            positionColumn: posColumn
        }, 'selection equal');
    }
    function cursorEqual(cursor, posLineNumber, posColumn, selLineNumber, selColumn) {
        if (selLineNumber === void 0) { selLineNumber = posLineNumber; }
        if (selColumn === void 0) { selColumn = posColumn; }
        positionEqual(cursor.getPosition(), posLineNumber, posColumn);
        selectionEqual(cursor.getSelection(), posLineNumber, posColumn, selLineNumber, selColumn);
    }
    suite('Editor Controller - Cursor', function () {
        var LINE1 = '    \tMy First Line\t ';
        var LINE2 = '\tMy Second Line';
        var LINE3 = '    Third Line';
        var LINE4 = '';
        var LINE5 = '1';
        var thisHighlighter = new ModelModes.CursorMode();
        var thisModel;
        var thisConfiguration;
        var thisCursor;
        setup(function () {
            var text = LINE1 + '\r\n' +
                LINE2 + '\n' +
                LINE3 + '\n' +
                LINE4 + '\r\n' +
                LINE5;
            thisModel = new Model.Model(text, thisHighlighter);
            thisConfiguration = new mockConfiguration_1.MockConfiguration(null);
            thisCursor = new Cursor.Cursor(1, thisConfiguration, thisModel, null, false);
        });
        teardown(function () {
            thisCursor.dispose();
            thisModel.dispose();
            thisConfiguration.dispose();
        });
        test('cursor initialized', function () {
            cursorEqual(thisCursor, 1, 1);
        });
        // --------- absolute move
        test('no move', function () {
            moveTo(thisCursor, 1, 1);
            cursorEqual(thisCursor, 1, 1);
        });
        test('move', function () {
            moveTo(thisCursor, 1, 2);
            cursorEqual(thisCursor, 1, 2);
        });
        test('move in selection mode', function () {
            moveTo(thisCursor, 1, 2, true);
            cursorEqual(thisCursor, 1, 2, 1, 1);
        });
        test('move beyond line end', function () {
            moveTo(thisCursor, 1, 25);
            cursorEqual(thisCursor, 1, LINE1.length + 1);
        });
        test('move empty line', function () {
            moveTo(thisCursor, 4, 20);
            cursorEqual(thisCursor, 4, 1);
        });
        test('move one char line', function () {
            moveTo(thisCursor, 5, 20);
            cursorEqual(thisCursor, 5, 2);
        });
        test('selection down', function () {
            moveTo(thisCursor, 2, 1, true);
            cursorEqual(thisCursor, 2, 1, 1, 1);
        });
        test('move and then select', function () {
            moveTo(thisCursor, 2, 3);
            cursorEqual(thisCursor, 2, 3);
            moveTo(thisCursor, 2, 15, true);
            cursorEqual(thisCursor, 2, 15, 2, 3);
            moveTo(thisCursor, 1, 2, true);
            cursorEqual(thisCursor, 1, 2, 2, 3);
        });
        // --------- move left
        test('move left on top left position', function () {
            moveLeft(thisCursor);
            cursorEqual(thisCursor, 1, 1);
        });
        test('move left', function () {
            moveTo(thisCursor, 1, 3);
            cursorEqual(thisCursor, 1, 3);
            moveLeft(thisCursor);
            cursorEqual(thisCursor, 1, 2);
        });
        test('move left goes to previous row', function () {
            moveTo(thisCursor, 2, 1);
            cursorEqual(thisCursor, 2, 1);
            moveLeft(thisCursor);
            cursorEqual(thisCursor, 1, 21);
        });
        test('move left selection', function () {
            moveTo(thisCursor, 2, 1);
            cursorEqual(thisCursor, 2, 1);
            moveLeft(thisCursor, true);
            cursorEqual(thisCursor, 1, 21, 2, 1);
        });
        // --------- move word left
        test('move word left', function () {
            moveTo(thisCursor, 5, 2);
            var expectedStops = [
                [5, 1],
                [4, 1],
                [3, 11],
                [3, 5],
                [3, 1],
                [2, 12],
                [2, 5],
                [2, 2],
                [2, 1],
                [1, 15],
                [1, 9],
                [1, 6],
                [1, 1],
                [1, 1],
            ];
            var actualStops = [];
            for (var i = 0; i < expectedStops.length; i++) {
                moveWordLeft(thisCursor);
                var pos = thisCursor.getPosition();
                actualStops.push([pos.lineNumber, pos.column]);
            }
            assert.deepEqual(actualStops, expectedStops);
        });
        test('move word left selection', function () {
            moveTo(thisCursor, 5, 2);
            cursorEqual(thisCursor, 5, 2);
            moveWordLeft(thisCursor, true);
            cursorEqual(thisCursor, 5, 1, 5, 2);
        });
        // --------- move right
        test('move right on bottom right position', function () {
            moveTo(thisCursor, 5, 2);
            cursorEqual(thisCursor, 5, 2);
            moveRight(thisCursor);
            cursorEqual(thisCursor, 5, 2);
        });
        test('move right', function () {
            moveTo(thisCursor, 1, 3);
            cursorEqual(thisCursor, 1, 3);
            moveRight(thisCursor);
            cursorEqual(thisCursor, 1, 4);
        });
        test('move right goes to next row', function () {
            moveTo(thisCursor, 1, 21);
            cursorEqual(thisCursor, 1, 21);
            moveRight(thisCursor);
            cursorEqual(thisCursor, 2, 1);
        });
        test('move right selection', function () {
            moveTo(thisCursor, 1, 21);
            cursorEqual(thisCursor, 1, 21);
            moveRight(thisCursor, true);
            cursorEqual(thisCursor, 2, 1, 1, 21);
        });
        // --------- move word right
        test('move word right', function () {
            moveTo(thisCursor, 1, 1);
            var expectedStops = [
                [1, 8],
                [1, 14],
                [1, 19],
                [1, 21],
                [2, 4],
                [2, 11],
                [2, 16],
                [3, 10],
                [3, 15],
                [4, 1],
                [5, 2],
                [5, 2],
            ];
            var actualStops = [];
            for (var i = 0; i < expectedStops.length; i++) {
                moveWordRight(thisCursor);
                var pos = thisCursor.getPosition();
                actualStops.push([pos.lineNumber, pos.column]);
            }
            assert.deepEqual(actualStops, expectedStops);
        });
        test('move word right selection', function () {
            moveTo(thisCursor, 1, 1);
            cursorEqual(thisCursor, 1, 1);
            moveWordRight(thisCursor, true);
            cursorEqual(thisCursor, 1, 8, 1, 1);
        });
        // --------- move down
        test('move down', function () {
            moveDown(thisCursor, 1);
            cursorEqual(thisCursor, 2, 1);
            moveDown(thisCursor, 1);
            cursorEqual(thisCursor, 3, 1);
            moveDown(thisCursor, 1);
            cursorEqual(thisCursor, 4, 1);
            moveDown(thisCursor, 1);
            cursorEqual(thisCursor, 5, 1);
            moveDown(thisCursor, 1);
            cursorEqual(thisCursor, 5, 2);
        });
        test('move down with selection', function () {
            moveDown(thisCursor, 1, true);
            cursorEqual(thisCursor, 2, 1, 1, 1);
            moveDown(thisCursor, 1, true);
            cursorEqual(thisCursor, 3, 1, 1, 1);
            moveDown(thisCursor, 1, true);
            cursorEqual(thisCursor, 4, 1, 1, 1);
            moveDown(thisCursor, 1, true);
            cursorEqual(thisCursor, 5, 1, 1, 1);
            moveDown(thisCursor, 1, true);
            cursorEqual(thisCursor, 5, 2, 1, 1);
        });
        test('move down with tabs', function () {
            moveTo(thisCursor, 1, 5);
            cursorEqual(thisCursor, 1, 5);
            moveDown(thisCursor, 1);
            cursorEqual(thisCursor, 2, 2);
            moveDown(thisCursor, 1);
            cursorEqual(thisCursor, 3, 5);
            moveDown(thisCursor, 1);
            cursorEqual(thisCursor, 4, 1);
            moveDown(thisCursor, 1);
            cursorEqual(thisCursor, 5, 2);
        });
        // --------- move up
        test('move up', function () {
            moveTo(thisCursor, 3, 5);
            cursorEqual(thisCursor, 3, 5);
            moveUp(thisCursor, 1);
            cursorEqual(thisCursor, 2, 2);
            moveUp(thisCursor, 1);
            cursorEqual(thisCursor, 1, 5);
        });
        test('move up with selection', function () {
            moveTo(thisCursor, 3, 5);
            cursorEqual(thisCursor, 3, 5);
            moveUp(thisCursor, 1, true);
            cursorEqual(thisCursor, 2, 2, 3, 5);
            moveUp(thisCursor, 1, true);
            cursorEqual(thisCursor, 1, 5, 3, 5);
        });
        test('move up and down with tabs', function () {
            moveTo(thisCursor, 1, 5);
            cursorEqual(thisCursor, 1, 5);
            moveDown(thisCursor, 4);
            cursorEqual(thisCursor, 5, 2);
            moveUp(thisCursor, 1);
            cursorEqual(thisCursor, 4, 1);
            moveUp(thisCursor, 1);
            cursorEqual(thisCursor, 3, 5);
            moveUp(thisCursor, 1);
            cursorEqual(thisCursor, 2, 2);
            moveUp(thisCursor, 1);
            cursorEqual(thisCursor, 1, 5);
        });
        test('move up and down with end of lines starting from a long one', function () {
            moveToEndOfLine(thisCursor);
            cursorEqual(thisCursor, 1, LINE1.length - 1);
            moveToEndOfLine(thisCursor);
            cursorEqual(thisCursor, 1, LINE1.length + 1);
            moveDown(thisCursor, 1);
            cursorEqual(thisCursor, 2, LINE2.length + 1);
            moveDown(thisCursor, 1);
            cursorEqual(thisCursor, 3, LINE3.length + 1);
            moveDown(thisCursor, 1);
            cursorEqual(thisCursor, 4, LINE4.length + 1);
            moveDown(thisCursor, 1);
            cursorEqual(thisCursor, 5, LINE5.length + 1);
            moveUp(thisCursor, 4);
            cursorEqual(thisCursor, 1, LINE1.length + 1);
        });
        // --------- move to beginning of line
        test('move to beginning of line', function () {
            moveToBeginningOfLine(thisCursor);
            cursorEqual(thisCursor, 1, 6);
            moveToBeginningOfLine(thisCursor);
            cursorEqual(thisCursor, 1, 1);
        });
        test('move to beginning of line from within line', function () {
            moveTo(thisCursor, 1, 8);
            moveToBeginningOfLine(thisCursor);
            cursorEqual(thisCursor, 1, 6);
            moveToBeginningOfLine(thisCursor);
            cursorEqual(thisCursor, 1, 1);
        });
        test('move to beginning of line from whitespace at beginning of line', function () {
            moveTo(thisCursor, 1, 2);
            moveToBeginningOfLine(thisCursor);
            cursorEqual(thisCursor, 1, 1);
            moveToBeginningOfLine(thisCursor);
            cursorEqual(thisCursor, 1, 6);
        });
        test('move to beginning of line from within line selection', function () {
            moveTo(thisCursor, 1, 8);
            moveToBeginningOfLine(thisCursor, true);
            cursorEqual(thisCursor, 1, 6, 1, 8);
            moveToBeginningOfLine(thisCursor, true);
            cursorEqual(thisCursor, 1, 1, 1, 8);
        });
        // --------- move to end of line
        test('move to end of line', function () {
            moveToEndOfLine(thisCursor);
            cursorEqual(thisCursor, 1, LINE1.length - 1);
            moveToEndOfLine(thisCursor);
            cursorEqual(thisCursor, 1, LINE1.length + 1);
        });
        test('move to end of line from within line', function () {
            moveTo(thisCursor, 1, 6);
            moveToEndOfLine(thisCursor);
            cursorEqual(thisCursor, 1, LINE1.length - 1);
            moveToEndOfLine(thisCursor);
            cursorEqual(thisCursor, 1, LINE1.length + 1);
        });
        test('move to end of line from whitespace at end of line', function () {
            moveTo(thisCursor, 1, 20);
            moveToEndOfLine(thisCursor);
            cursorEqual(thisCursor, 1, LINE1.length + 1);
            moveToEndOfLine(thisCursor);
            cursorEqual(thisCursor, 1, LINE1.length - 1);
        });
        test('move to end of line from within line selection', function () {
            moveTo(thisCursor, 1, 6);
            moveToEndOfLine(thisCursor, true);
            cursorEqual(thisCursor, 1, LINE1.length - 1, 1, 6);
            moveToEndOfLine(thisCursor, true);
            cursorEqual(thisCursor, 1, LINE1.length + 1, 1, 6);
        });
        // --------- move to beginning of buffer
        test('move to beginning of buffer', function () {
            moveToBeginningOfBuffer(thisCursor);
            cursorEqual(thisCursor, 1, 1);
        });
        test('move to beginning of buffer from within first line', function () {
            moveTo(thisCursor, 1, 3);
            moveToBeginningOfBuffer(thisCursor);
            cursorEqual(thisCursor, 1, 1);
        });
        test('move to beginning of buffer from within another line', function () {
            moveTo(thisCursor, 3, 3);
            moveToBeginningOfBuffer(thisCursor);
            cursorEqual(thisCursor, 1, 1);
        });
        test('move to beginning of buffer from within first line selection', function () {
            moveTo(thisCursor, 1, 3);
            moveToBeginningOfBuffer(thisCursor, true);
            cursorEqual(thisCursor, 1, 1, 1, 3);
        });
        test('move to beginning of buffer from within another line selection', function () {
            moveTo(thisCursor, 3, 3);
            moveToBeginningOfBuffer(thisCursor, true);
            cursorEqual(thisCursor, 1, 1, 3, 3);
        });
        // --------- move to end of buffer
        test('move to end of buffer', function () {
            moveToEndOfBuffer(thisCursor);
            cursorEqual(thisCursor, 5, LINE5.length + 1);
        });
        test('move to end of buffer from within last line', function () {
            moveTo(thisCursor, 5, 1);
            moveToEndOfBuffer(thisCursor);
            cursorEqual(thisCursor, 5, LINE5.length + 1);
        });
        test('move to end of buffer from within another line', function () {
            moveTo(thisCursor, 3, 3);
            moveToEndOfBuffer(thisCursor);
            cursorEqual(thisCursor, 5, LINE5.length + 1);
        });
        test('move to end of buffer from within last line selection', function () {
            moveTo(thisCursor, 5, 1);
            moveToEndOfBuffer(thisCursor, true);
            cursorEqual(thisCursor, 5, LINE5.length + 1, 5, 1);
        });
        test('move to end of buffer from within another line selection', function () {
            moveTo(thisCursor, 3, 3);
            moveToEndOfBuffer(thisCursor, true);
            cursorEqual(thisCursor, 5, LINE5.length + 1, 3, 3);
        });
        // --------- delete word left/right
        //	Model looks like:
        //	var LINE1 = '    \tMy First Line\t ';
        //	var LINE2 = '\tMy Second Line';
        //	var LINE3 = '    Third Line';
        //	var LINE4 = '';
        //	var LINE5 = '1';
        test('delete word left for non-empty selection', function () {
            moveTo(thisCursor, 3, 7);
            moveRight(thisCursor, true);
            moveRight(thisCursor, true);
            deleteWordLeft(thisCursor);
            assert.equal(thisModel.getLineContent(3), '    Thd Line');
            cursorEqual(thisCursor, 3, 7);
        });
        test('delete word left for caret at beginning of document', function () {
            moveTo(thisCursor, 1, 1);
            deleteWordLeft(thisCursor);
            assert.equal(thisModel.getLineContent(1), '    \tMy First Line\t ');
            cursorEqual(thisCursor, 1, 1);
        });
        test('delete word left for caret at end of whitespace', function () {
            moveTo(thisCursor, 3, 11);
            deleteWordLeft(thisCursor);
            assert.equal(thisModel.getLineContent(3), '    ThirdLine');
            cursorEqual(thisCursor, 3, 10);
        });
        test('delete word left for caret just behind a word', function () {
            moveTo(thisCursor, 2, 11);
            deleteWordLeft(thisCursor);
            assert.equal(thisModel.getLineContent(2), '\tMy  Line');
            cursorEqual(thisCursor, 2, 5);
        });
        test('delete word left for caret inside of a word', function () {
            moveTo(thisCursor, 1, 12);
            deleteWordLeft(thisCursor);
            assert.equal(thisModel.getLineContent(1), '    \tMy st Line\t ');
            cursorEqual(thisCursor, 1, 9);
        });
        test('delete word right for non-empty selection', function () {
            moveTo(thisCursor, 3, 7);
            moveRight(thisCursor, true);
            moveRight(thisCursor, true);
            deleteWordRight(thisCursor);
            assert.equal(thisModel.getLineContent(3), '    Thd Line');
            cursorEqual(thisCursor, 3, 7);
        });
        test('delete word right for caret at end of document', function () {
            moveTo(thisCursor, 5, 3);
            deleteWordRight(thisCursor);
            assert.equal(thisModel.getLineContent(5), '1');
            cursorEqual(thisCursor, 5, 2);
        });
        test('delete word right for caret at beggining of whitespace', function () {
            moveTo(thisCursor, 3, 1);
            deleteWordRight(thisCursor);
            assert.equal(thisModel.getLineContent(3), 'Third Line');
            cursorEqual(thisCursor, 3, 1);
        });
        test('delete word right for caret just before a word', function () {
            moveTo(thisCursor, 2, 5);
            deleteWordRight(thisCursor);
            assert.equal(thisModel.getLineContent(2), '\tMy  Line');
            cursorEqual(thisCursor, 2, 5);
        });
        test('delete word right for caret inside of a word', function () {
            moveTo(thisCursor, 1, 11);
            deleteWordRight(thisCursor);
            assert.equal(thisModel.getLineContent(1), '    \tMy Fi Line\t ');
            cursorEqual(thisCursor, 1, 11);
        });
        // --------- misc
        test('select all', function () {
            cursorCommand(thisCursor, H.SelectAll);
            cursorEqual(thisCursor, 5, LINE5.length + 1, 1, 1);
        });
        test('expandLineSelection', function () {
            //              0          1         2
            //              01234 56789012345678 0
            // var LINE1 = '    \tMy First Line\t ';
            moveTo(thisCursor, 1, 1);
            cursorCommand(thisCursor, H.ExpandLineSelection);
            cursorEqual(thisCursor, 1, LINE1.length + 1, 1, 1);
            moveTo(thisCursor, 1, 2);
            cursorCommand(thisCursor, H.ExpandLineSelection);
            cursorEqual(thisCursor, 1, LINE1.length + 1, 1, 1);
            moveTo(thisCursor, 1, 5);
            cursorCommand(thisCursor, H.ExpandLineSelection);
            cursorEqual(thisCursor, 1, LINE1.length + 1, 1, 1);
            moveTo(thisCursor, 1, 19);
            cursorCommand(thisCursor, H.ExpandLineSelection);
            cursorEqual(thisCursor, 1, LINE1.length + 1, 1, 1);
            moveTo(thisCursor, 1, 20);
            cursorCommand(thisCursor, H.ExpandLineSelection);
            cursorEqual(thisCursor, 1, LINE1.length + 1, 1, 1);
            moveTo(thisCursor, 1, 21);
            cursorCommand(thisCursor, H.ExpandLineSelection);
            cursorEqual(thisCursor, 1, LINE1.length + 1, 1, 1);
            cursorCommand(thisCursor, H.ExpandLineSelection);
            cursorEqual(thisCursor, 2, LINE2.length + 1, 1, 1);
            cursorCommand(thisCursor, H.ExpandLineSelection);
            cursorEqual(thisCursor, 3, LINE3.length + 1, 1, 1);
            cursorCommand(thisCursor, H.ExpandLineSelection);
            cursorEqual(thisCursor, 4, LINE4.length + 1, 1, 1);
            cursorCommand(thisCursor, H.ExpandLineSelection);
            cursorEqual(thisCursor, 5, LINE5.length + 1, 1, 1);
            cursorCommand(thisCursor, H.ExpandLineSelection);
            cursorEqual(thisCursor, 5, LINE5.length + 1, 1, 1);
        });
        // --------- eventing
        test('no move doesn\'t trigger event', function () {
            thisCursor.addListener(EditorCommon.EventType.CursorPositionChanged, function (e) {
                assert.ok(false, 'was not expecting event');
            });
            thisCursor.addListener(EditorCommon.EventType.CursorSelectionChanged, function (e) {
                assert.ok(false, 'was not expecting event');
            });
            moveTo(thisCursor, 1, 1);
        });
        test('move eventing', function () {
            var events = 0;
            thisCursor.addListener(EditorCommon.EventType.CursorPositionChanged, function (e) {
                events++;
                positionEqual(e.position, 1, 2);
            });
            thisCursor.addListener(EditorCommon.EventType.CursorSelectionChanged, function (e) {
                events++;
                selectionEqual(e.selection, 1, 2, 1, 2);
            });
            moveTo(thisCursor, 1, 2);
            assert.equal(events, 2, 'receives 2 events');
        });
        test('move in selection mode eventing', function () {
            var events = 0;
            thisCursor.addListener(EditorCommon.EventType.CursorPositionChanged, function (e) {
                events++;
                positionEqual(e.position, 1, 2);
            });
            thisCursor.addListener(EditorCommon.EventType.CursorSelectionChanged, function (e) {
                events++;
                selectionEqual(e.selection, 1, 2, 1, 1);
            });
            moveTo(thisCursor, 1, 2, true);
            assert.equal(events, 2, 'receives 2 events');
        });
        // --------- state save & restore
        test('saveState & restoreState', function () {
            moveTo(thisCursor, 2, 1, true);
            cursorEqual(thisCursor, 2, 1, 1, 1);
            var savedState = JSON.stringify(thisCursor.saveState());
            moveTo(thisCursor, 1, 1, false);
            cursorEqual(thisCursor, 1, 1);
            thisCursor.restoreState(JSON.parse(savedState));
            cursorEqual(thisCursor, 2, 1, 1, 1);
        });
        // --------- updating cursor
        test('Independent model edit 1', function () {
            moveTo(thisCursor, 2, 16, true);
            thisModel.applyEdits([editOperation_1.EditOperation.delete(new Range.Range(2, 1, 2, 2))]);
            cursorEqual(thisCursor, 2, 15, 1, 1);
        });
        // --------- bugs
        test('Bug 9121: Auto indent + undo + redo is funky', function () {
            var model = new Model.Model('', thisHighlighter);
            var cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration({
                tabSize: 4,
                insertSpaces: false
            }), model, null, false);
            cursorCommand(cursor, H.Type, { text: '\n' }, null, 'keyboard');
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), '\n', 'assert1');
            cursorCommand(cursor, H.Tab, {});
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), '\n\t', 'assert2');
            cursorCommand(cursor, H.Type, { text: '\n' }, null, 'keyboard');
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), '\n\t\n\t', 'assert3');
            cursorCommand(cursor, H.Type, { text: 'x' });
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), '\n\t\n\tx', 'assert4');
            cursorCommand(cursor, H.CursorLeft, {});
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), '\n\t\n\tx', 'assert5');
            cursorCommand(cursor, H.DeleteLeft, {});
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), '\n\t\nx', 'assert6');
            cursorCommand(cursor, H.DeleteLeft, {});
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), '\n\tx', 'assert7');
            cursorCommand(cursor, H.DeleteLeft, {});
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), '\nx', 'assert8');
            cursorCommand(cursor, H.DeleteLeft, {});
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), 'x', 'assert9');
            cursorCommand(cursor, H.Undo, {});
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), '\nx', 'assert10');
            cursorCommand(cursor, H.Undo, {});
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), '\n\t\nx', 'assert11');
            cursorCommand(cursor, H.Undo, {});
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), '\n\t\n\tx', 'assert12');
            cursorCommand(cursor, H.Redo, {});
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), '\n\t\nx', 'assert13');
            cursorCommand(cursor, H.Redo, {});
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), '\nx', 'assert14');
            cursorCommand(cursor, H.Redo, {});
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.LF), 'x', 'assert15');
            cursor.dispose();
            model.dispose();
        });
    });
    suite('Editor Controller - Cursor Configuration', function () {
        var thisHighlighter = new ModelModes.CursorMode();
        test('issue #183: jump to matching bracket position', function () {
            var mode = new ModelModes.BracketMode();
            var model = new Model.Model([
                'var x = (3 + (5-7));'
            ].join('\n'), mode);
            var cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration(null), model, null, false);
            // ensure is tokenized
            model.getLineContext(1);
            moveTo(cursor, 1, 20);
            cursorCommand(cursor, H.JumpToBracket, null, null, 'keyboard');
            cursorEqual(cursor, 1, 10);
            cursorCommand(cursor, H.JumpToBracket, null, null, 'keyboard');
            cursorEqual(cursor, 1, 20);
            cursorCommand(cursor, H.JumpToBracket, null, null, 'keyboard');
            cursorEqual(cursor, 1, 10);
            cursor.dispose();
            model.dispose();
        });
        test('Cursor honors insertSpaces configuration on new line', function () {
            var text = '    \tMy First Line\t \n' + '\tMy Second Line\n' + '    Third Line\n' + '\n' + '1';
            var model = new Model.Model(text, thisHighlighter);
            var cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration({ insertSpaces: true, tabSize: 4 }), model, null, false);
            cursorCommand(cursor, H.MoveTo, { position: new Position.Position(1, 21) }, null, 'keyboard');
            cursorCommand(cursor, H.Type, { text: '\n' }, null, 'keyboard');
            assert.equal(model.getLineContent(1), '    \tMy First Line\t ');
            assert.equal(model.getLineContent(2), '        ');
            cursor.dispose();
            model.dispose();
        });
        test('bug #16543: Tab should indent to correct indentation spot immediately', function () {
            var text = [
                'function baz() {',
                '\tfunction hello() { // something here',
                '\t',
                '',
                '\t}',
                '}'
            ];
            var mode = new ModelModes.IndentingMode();
            var model = new Model.Model(text.join('\n'), mode);
            var cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration({ insertSpaces: false, tabSize: 4 }), model, null, false);
            moveTo(cursor, 4, 1, false);
            cursorEqual(cursor, 4, 1, 4, 1);
            cursorCommand(cursor, H.Tab, null, null, 'keyboard');
            assert.equal(model.getLineContent(4), '\t\t');
            cursor.dispose();
            model.dispose();
        });
        test('Bug 18276:[editor] Indentation broken when selection is empty', function () {
            var text = [
                'function baz() {'
            ];
            var model = new Model.Model(text.join('\n'), null);
            var cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration({ insertSpaces: false, tabSize: 4 }), model, null, false);
            moveTo(cursor, 1, 2, false);
            cursorEqual(cursor, 1, 2, 1, 2);
            cursorCommand(cursor, H.Indent, null, null, 'keyboard');
            assert.equal(model.getLineContent(1), '\tfunction baz() {');
            cursorEqual(cursor, 1, 3, 1, 3);
            cursorCommand(cursor, H.Tab, null, null, 'keyboard');
            assert.equal(model.getLineContent(1), '\tf\tunction baz() {');
            cursor.dispose();
            model.dispose();
        });
        test('bug #16815:Shift+Tab doesn\'t go back to tabstop', function () {
            var text = [
                '     function baz() {'
            ];
            var model = new Model.Model(text.join('\n'), null);
            var cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration({ insertSpaces: true, tabSize: 4 }), model, null, false);
            moveTo(cursor, 1, 6, false);
            cursorEqual(cursor, 1, 6, 1, 6);
            cursorCommand(cursor, H.Outdent, null, null, 'keyboard');
            assert.equal(model.getLineContent(1), '    function baz() {');
            cursorEqual(cursor, 1, 5, 1, 5);
            cursor.dispose();
            model.dispose();
        });
        test('Bug #18293:[regression][editor] Can\'t outdent whitespace line', function () {
            var text = [
                '      '
            ];
            var model = new Model.Model(text.join('\n'), null);
            var cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration({ insertSpaces: true, tabSize: 4 }), model, null, false);
            moveTo(cursor, 1, 7, false);
            cursorEqual(cursor, 1, 7, 1, 7);
            cursorCommand(cursor, H.Outdent, null, null, 'keyboard');
            assert.equal(model.getLineContent(1), '    ');
            cursorEqual(cursor, 1, 5, 1, 5);
            cursor.dispose();
            model.dispose();
        });
        test('Bug #16657: [editor] Tab on empty line of zero indentation moves cursor to position (1,1)', function () {
            var text = [
                'function baz() {',
                '\tfunction hello() { // something here',
                '\t',
                '',
                '\t}',
                '}',
                ''
            ];
            var model = new Model.Model(text.join('\n'), null);
            var cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration({ insertSpaces: false, tabSize: 4 }), model, null, false);
            moveTo(cursor, 7, 1, false);
            cursorEqual(cursor, 7, 1, 7, 1);
            cursorCommand(cursor, H.Tab, null, null, 'keyboard');
            assert.equal(model.getLineContent(7), '\t');
            cursorEqual(cursor, 7, 2, 7, 2);
            cursor.dispose();
            model.dispose();
        });
        test('bug #16740: [editor] Cut line doesn\'t quite cut the last line', function () {
            // Part 1 => there is text on the last line
            var text = [
                'asdasd',
                'qwerty'
            ];
            var model = new Model.Model(text.join('\n'), null);
            var cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration({ insertSpaces: false, tabSize: 4 }), model, null, true);
            moveTo(cursor, 2, 1, false);
            cursorEqual(cursor, 2, 1, 2, 1);
            cursorCommand(cursor, H.Cut, null, null, 'keyboard');
            assert.equal(model.getLineCount(), 1);
            assert.equal(model.getLineContent(1), 'asdasd');
            cursor.dispose();
            model.dispose();
            // Part 2 => there is no text on the last line
            text = [
                'asdasd',
                ''
            ];
            model = new Model.Model(text.join('\n'), null);
            cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration({ insertSpaces: false, tabSize: 4 }), model, null, true);
            moveTo(cursor, 2, 1, false);
            cursorEqual(cursor, 2, 1, 2, 1);
            cursorCommand(cursor, H.Cut, null, null, 'keyboard');
            assert.equal(model.getLineCount(), 1);
            assert.equal(model.getLineContent(1), 'asdasd');
            cursorCommand(cursor, H.Cut, null, null, 'keyboard');
            assert.equal(model.getLineCount(), 1);
            assert.equal(model.getLineContent(1), '');
            cursor.dispose();
            model.dispose();
        });
        test('Cursor honors insertSpaces configuration on tab', function () {
            var text = '    \tMy First Line\t \n' + 'My Second Line123\n' + '    Third Line\n' + '\n' + '1';
            var model = new Model.Model(text, thisHighlighter);
            var cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration({ insertSpaces: true, tabSize: 13 }), model, null, false);
            // Tab on column 1
            cursorCommand(cursor, H.MoveTo, { position: new Position.Position(2, 1) }, null, 'keyboard');
            cursorCommand(cursor, H.Tab, null, null, 'keyboard');
            assert.equal(model.getLineContent(2), '             My Second Line123');
            cursorCommand(cursor, H.Undo, null, null, 'keyboard');
            // Tab on column 2
            assert.equal(model.getLineContent(2), 'My Second Line123');
            cursorCommand(cursor, H.MoveTo, { position: new Position.Position(2, 2) }, null, 'keyboard');
            cursorCommand(cursor, H.Tab, null, null, 'keyboard');
            assert.equal(model.getLineContent(2), 'M            y Second Line123');
            cursorCommand(cursor, H.Undo, null, null, 'keyboard');
            // Tab on column 3
            assert.equal(model.getLineContent(2), 'My Second Line123');
            cursorCommand(cursor, H.MoveTo, { position: new Position.Position(2, 3) }, null, 'keyboard');
            cursorCommand(cursor, H.Tab, null, null, 'keyboard');
            assert.equal(model.getLineContent(2), 'My            Second Line123');
            cursorCommand(cursor, H.Undo, null, null, 'keyboard');
            // Tab on column 4
            assert.equal(model.getLineContent(2), 'My Second Line123');
            cursorCommand(cursor, H.MoveTo, { position: new Position.Position(2, 4) }, null, 'keyboard');
            cursorCommand(cursor, H.Tab, null, null, 'keyboard');
            assert.equal(model.getLineContent(2), 'My           Second Line123');
            cursorCommand(cursor, H.Undo, null, null, 'keyboard');
            // Tab on column 5
            assert.equal(model.getLineContent(2), 'My Second Line123');
            cursorCommand(cursor, H.MoveTo, { position: new Position.Position(2, 5) }, null, 'keyboard');
            cursorCommand(cursor, H.Tab, null, null, 'keyboard');
            assert.equal(model.getLineContent(2), 'My S         econd Line123');
            cursorCommand(cursor, H.Undo, null, null, 'keyboard');
            // Tab on column 5
            assert.equal(model.getLineContent(2), 'My Second Line123');
            cursorCommand(cursor, H.MoveTo, { position: new Position.Position(2, 5) }, null, 'keyboard');
            cursorCommand(cursor, H.Tab, null, null, 'keyboard');
            assert.equal(model.getLineContent(2), 'My S         econd Line123');
            cursorCommand(cursor, H.Undo, null, null, 'keyboard');
            // Tab on column 13
            assert.equal(model.getLineContent(2), 'My Second Line123');
            cursorCommand(cursor, H.MoveTo, { position: new Position.Position(2, 13) }, null, 'keyboard');
            cursorCommand(cursor, H.Tab, null, null, 'keyboard');
            assert.equal(model.getLineContent(2), 'My Second Li ne123');
            cursorCommand(cursor, H.Undo, null, null, 'keyboard');
            // Tab on column 14
            assert.equal(model.getLineContent(2), 'My Second Line123');
            cursorCommand(cursor, H.MoveTo, { position: new Position.Position(2, 14) }, null, 'keyboard');
            cursorCommand(cursor, H.Tab, null, null, 'keyboard');
            assert.equal(model.getLineContent(2), 'My Second Lin             e123');
            cursor.dispose();
            model.dispose();
        });
        test('Bug #11476: Double bracket surrounding + undo is broken', function () {
            var text = 'hello';
            var model = new Model.Model(text, new ModelModes.SurroundingMode());
            var cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration({ insertSpaces: true }), model, null, false);
            moveTo(cursor, 1, 3, false);
            moveTo(cursor, 1, 5, true);
            cursorEqual(cursor, 1, 5, 1, 3);
            cursorCommand(cursor, H.Type, { text: '(' }, null, 'keyboard');
            cursorEqual(cursor, 1, 6, 1, 4);
            cursorCommand(cursor, H.Type, { text: '(' }, null, 'keyboard');
            cursorEqual(cursor, 1, 7, 1, 5);
            cursor.dispose();
            model.dispose();
        });
        test('Enter auto-indents with insertSpaces setting 1', function () {
            var text = '\thello';
            var mode = new ModelModes.IndentingMode();
            var model = new Model.Model(text, mode);
            var cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration({ insertSpaces: true, tabSize: 4 }), model, null, false);
            moveTo(cursor, 1, 7, false);
            cursorEqual(cursor, 1, 7, 1, 7);
            cursorCommand(cursor, H.Type, { text: '\n' }, null, 'keyboard');
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.CRLF), '\thello\r\n        ');
            cursor.dispose();
            model.dispose();
        });
        test('Enter auto-indents with insertSpaces setting 2', function () {
            var text = '\thello';
            var mode = new ModelModes.NonIndentingMode();
            var model = new Model.Model(text, mode);
            var cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration({ insertSpaces: true, tabSize: 4 }), model, null, false);
            moveTo(cursor, 1, 7, false);
            cursorEqual(cursor, 1, 7, 1, 7);
            cursorCommand(cursor, H.Type, { text: '\n' }, null, 'keyboard');
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.CRLF), '\thello\r\n    ');
            cursor.dispose();
            model.dispose();
        });
        test('Enter auto-indents with insertSpaces setting 3', function () {
            var text = '\thell()';
            var mode = new ModelModes.IndentOutdentMode();
            var model = new Model.Model(text, mode);
            var cursor = new Cursor.Cursor(1, new mockConfiguration_1.MockConfiguration({ insertSpaces: true, tabSize: 4 }), model, null, false);
            moveTo(cursor, 1, 7, false);
            cursorEqual(cursor, 1, 7, 1, 7);
            cursorCommand(cursor, H.Type, { text: '\n' }, null, 'keyboard');
            assert.equal(model.getValue(EditorCommon.EndOfLinePreference.CRLF), '\thell(\r\n        \r\n    )');
            cursor.dispose();
            model.dispose();
        });
        test('Insert line before', function () {
            var testInsertLineBefore = function (lineNumber, column, callback) {
                usingCursor([
                    'First line',
                    'Second line',
                    'Third line'
                ], null, function (model, cursor) {
                    moveTo(cursor, lineNumber, column, false);
                    cursorEqual(cursor, lineNumber, column, lineNumber, column);
                    cursorCommand(cursor, H.LineInsertBefore, null, null, 'keyboard');
                    callback(model, cursor);
                });
            };
            testInsertLineBefore(1, 3, function (model, cursor) {
                cursorEqual(cursor, 1, 1, 1, 1);
                assert.equal(model.getLineContent(1), '');
                assert.equal(model.getLineContent(2), 'First line');
                assert.equal(model.getLineContent(3), 'Second line');
                assert.equal(model.getLineContent(4), 'Third line');
            });
            testInsertLineBefore(2, 3, function (model, cursor) {
                cursorEqual(cursor, 2, 1, 2, 1);
                assert.equal(model.getLineContent(1), 'First line');
                assert.equal(model.getLineContent(2), '');
                assert.equal(model.getLineContent(3), 'Second line');
                assert.equal(model.getLineContent(4), 'Third line');
            });
            testInsertLineBefore(3, 3, function (model, cursor) {
                cursorEqual(cursor, 3, 1, 3, 1);
                assert.equal(model.getLineContent(1), 'First line');
                assert.equal(model.getLineContent(2), 'Second line');
                assert.equal(model.getLineContent(3), '');
                assert.equal(model.getLineContent(4), 'Third line');
            });
        });
        test('Insert line after', function () {
            var testInsertLineAfter = function (lineNumber, column, callback) {
                usingCursor([
                    'First line',
                    'Second line',
                    'Third line'
                ], null, function (model, cursor) {
                    moveTo(cursor, lineNumber, column, false);
                    cursorEqual(cursor, lineNumber, column, lineNumber, column);
                    cursorCommand(cursor, H.LineInsertAfter, null, null, 'keyboard');
                    callback(model, cursor);
                });
            };
            testInsertLineAfter(1, 3, function (model, cursor) {
                cursorEqual(cursor, 2, 1, 2, 1);
                assert.equal(model.getLineContent(1), 'First line');
                assert.equal(model.getLineContent(2), '');
                assert.equal(model.getLineContent(3), 'Second line');
                assert.equal(model.getLineContent(4), 'Third line');
            });
            testInsertLineAfter(2, 3, function (model, cursor) {
                cursorEqual(cursor, 3, 1, 3, 1);
                assert.equal(model.getLineContent(1), 'First line');
                assert.equal(model.getLineContent(2), 'Second line');
                assert.equal(model.getLineContent(3), '');
                assert.equal(model.getLineContent(4), 'Third line');
            });
            testInsertLineAfter(3, 3, function (model, cursor) {
                cursorEqual(cursor, 4, 1, 4, 1);
                assert.equal(model.getLineContent(1), 'First line');
                assert.equal(model.getLineContent(2), 'Second line');
                assert.equal(model.getLineContent(3), 'Third line');
                assert.equal(model.getLineContent(4), '');
            });
        });
    });
    function usingCursor(text, opts, callback) {
        opts = opts || {};
        var model = new Model.Model(text.join('\n'), opts.mode);
        var config = new mockConfiguration_1.MockConfiguration(opts.config);
        var cursor = new Cursor.Cursor(1, config, model, null, false);
        callback(model, cursor);
        cursor.dispose();
        config.dispose();
        model.dispose();
    }
});
//# sourceMappingURL=cursor.test.js.map