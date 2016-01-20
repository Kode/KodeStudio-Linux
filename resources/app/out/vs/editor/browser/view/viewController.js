/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/core/position', 'vs/editor/common/editorCommon'], function (require, exports, Position, EditorCommon) {
    var ViewController = (function () {
        function ViewController(viewModel, configuration, outgoingEventBus) {
            this.viewModel = viewModel;
            this.configuration = configuration;
            this.outgoingEventBus = outgoingEventBus;
        }
        ViewController.prototype.paste = function (source, text, pasteOnNewLine) {
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.Paste, {
                text: text,
                pasteOnNewLine: pasteOnNewLine,
            });
        };
        ViewController.prototype.type = function (source, text) {
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.Type, {
                text: text
            });
        };
        ViewController.prototype.replacePreviousChar = function (source, text) {
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.ReplacePreviousChar, {
                text: text
            });
        };
        ViewController.prototype.cut = function (source) {
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.Cut, null);
        };
        ViewController.prototype._validateViewColumn = function (lineNumber, column) {
            var minColumn = this.viewModel.getLineMinColumn(lineNumber);
            if (column < minColumn) {
                return minColumn;
            }
            return column;
        };
        ViewController.prototype.moveTo = function (source, lineNumber, column) {
            column = this._validateViewColumn(lineNumber, column);
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.MoveTo, {
                position: this.convertViewToModelPosition(lineNumber, column),
                viewPosition: new Position.Position(lineNumber, column)
            });
        };
        ViewController.prototype.moveToSelect = function (source, lineNumber, column) {
            column = this._validateViewColumn(lineNumber, column);
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.MoveToSelect, {
                position: this.convertViewToModelPosition(lineNumber, column),
                viewPosition: new Position.Position(lineNumber, column)
            });
        };
        ViewController.prototype.createCursor = function (source, lineNumber, column, wholeLine) {
            column = this._validateViewColumn(lineNumber, column);
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.CreateCursor, {
                position: this.convertViewToModelPosition(lineNumber, column),
                viewPosition: new Position.Position(lineNumber, column),
                wholeLine: wholeLine
            });
        };
        ViewController.prototype.lastCursorMoveToSelect = function (source, lineNumber, column) {
            column = this._validateViewColumn(lineNumber, column);
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.LastCursorMoveToSelect, {
                position: this.convertViewToModelPosition(lineNumber, column),
                viewPosition: new Position.Position(lineNumber, column)
            });
        };
        ViewController.prototype.wordSelect = function (source, lineNumber, column, preference) {
            column = this._validateViewColumn(lineNumber, column);
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.WordSelect, {
                position: this.convertViewToModelPosition(lineNumber, column),
                preference: preference
            });
        };
        ViewController.prototype.wordSelectDrag = function (source, lineNumber, column, preference) {
            column = this._validateViewColumn(lineNumber, column);
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.WordSelectDrag, {
                position: this.convertViewToModelPosition(lineNumber, column),
                preference: preference
            });
        };
        ViewController.prototype.lastCursorWordSelect = function (source, lineNumber, column, preference) {
            column = this._validateViewColumn(lineNumber, column);
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.LastCursorWordSelect, {
                position: this.convertViewToModelPosition(lineNumber, column),
                preference: preference
            });
        };
        ViewController.prototype.lineSelect = function (source, lineNumber, column) {
            column = this._validateViewColumn(lineNumber, column);
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.LineSelect, {
                position: this.convertViewToModelPosition(lineNumber, column),
                viewPosition: new Position.Position(lineNumber, column)
            });
        };
        ViewController.prototype.lineSelectDrag = function (source, lineNumber, column) {
            column = this._validateViewColumn(lineNumber, column);
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.LineSelectDrag, {
                position: this.convertViewToModelPosition(lineNumber, column),
                viewPosition: new Position.Position(lineNumber, column)
            });
        };
        ViewController.prototype.lastCursorLineSelect = function (source, lineNumber, column) {
            column = this._validateViewColumn(lineNumber, column);
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.LastCursorLineSelect, {
                position: this.convertViewToModelPosition(lineNumber, column),
                viewPosition: new Position.Position(lineNumber, column)
            });
        };
        ViewController.prototype.lastCursorLineSelectDrag = function (source, lineNumber, column) {
            column = this._validateViewColumn(lineNumber, column);
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.LastCursorLineSelectDrag, {
                position: this.convertViewToModelPosition(lineNumber, column),
                viewPosition: new Position.Position(lineNumber, column)
            });
        };
        ViewController.prototype.selectAll = function (source) {
            this.configuration.handlerDispatcher.trigger(source, EditorCommon.Handler.SelectAll, null);
        };
        // ----------------------
        ViewController.prototype.convertViewToModelPosition = function (lineNumber, column) {
            return this.viewModel.convertViewPositionToModelPosition(lineNumber, column);
        };
        ViewController.prototype.convertViewToModelRange = function (viewRange) {
            return this.viewModel.convertViewRangeToModelRange(viewRange);
        };
        ViewController.prototype.convertViewToModelMouseEvent = function (e) {
            if (e.target) {
                if (e.target.position) {
                    e.target.position = this.convertViewToModelPosition(e.target.position.lineNumber, e.target.position.column);
                }
                if (e.target.range) {
                    e.target.range = this.convertViewToModelRange(e.target.range);
                }
            }
        };
        ViewController.prototype.emitKeyDown = function (e) {
            this.outgoingEventBus.emit(EditorCommon.EventType.KeyDown, e);
        };
        ViewController.prototype.emitKeyUp = function (e) {
            this.outgoingEventBus.emit(EditorCommon.EventType.KeyUp, e);
        };
        ViewController.prototype.emitContextMenu = function (e) {
            this.convertViewToModelMouseEvent(e);
            this.outgoingEventBus.emit(EditorCommon.EventType.ContextMenu, e);
        };
        ViewController.prototype.emitMouseMove = function (e) {
            this.convertViewToModelMouseEvent(e);
            this.outgoingEventBus.emit(EditorCommon.EventType.MouseMove, e);
        };
        ViewController.prototype.emitMouseLeave = function (e) {
            this.convertViewToModelMouseEvent(e);
            this.outgoingEventBus.emit(EditorCommon.EventType.MouseLeave, e);
        };
        ViewController.prototype.emitMouseUp = function (e) {
            this.convertViewToModelMouseEvent(e);
            this.outgoingEventBus.emit(EditorCommon.EventType.MouseUp, e);
        };
        ViewController.prototype.emitMouseDown = function (e) {
            this.convertViewToModelMouseEvent(e);
            this.outgoingEventBus.emit(EditorCommon.EventType.MouseDown, e);
        };
        return ViewController;
    })();
    exports.ViewController = ViewController;
});
//# sourceMappingURL=viewController.js.map