/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", 'vs/nls', 'vs/editor/common/editorCommon', 'vs/base/parts/quickopen/browser/quickOpenModel', 'vs/base/parts/quickopen/common/quickOpen', './editorQuickOpen', 'vs/platform/instantiation/common/instantiation', 'vs/css!./gotoLine'], function (require, exports, nls, EditorCommon, QuickOpenModel, QuickOpen, EditorQuickOpen, instantiation_1) {
    var GotoLineEntry = (function (_super) {
        __extends(GotoLineEntry, _super);
        function GotoLineEntry(line, editor, decorator) {
            _super.call(this);
            this.editor = editor;
            this.decorator = decorator;
            this._parseResult = this._parseInput(line);
        }
        GotoLineEntry.prototype._parseInput = function (line) {
            var numbers = line.split(',').map(function (part) { return parseInt(part, 10); }).filter(function (part) { return !isNaN(part); }), position;
            if (numbers.length === 0) {
                position = { lineNumber: -1, column: -1 };
            }
            else if (numbers.length === 1) {
                position = { lineNumber: numbers[0], column: 1 };
            }
            else {
                position = { lineNumber: numbers[0], column: numbers[1] };
            }
            var editorType = this.editor.getEditorType(), model;
            switch (editorType) {
                case EditorCommon.EditorType.IDiffEditor:
                    model = this.editor.getModel().modified;
                    break;
                case EditorCommon.EditorType.ICodeEditor:
                    model = this.editor.getModel();
                    break;
                default:
                    throw new Error();
            }
            var isValid = model.validatePosition(position).equals(position), label;
            if (isValid) {
                if (position.column && position.column > 1) {
                    label = nls.localize('gotoLineLabelValidLineAndColumn', "Go to line {0} and column {1}", position.lineNumber, position.column);
                }
                else {
                    label = nls.localize('gotoLineLabelValidLine', "Go to line {0}", position.lineNumber, position.column);
                }
            }
            else if (position.lineNumber < 1 || position.lineNumber > model.getLineCount()) {
                label = nls.localize('gotoLineLabelEmptyWithLineLimit', "Type a line number between 1 and {0} to navigate to", model.getLineCount());
            }
            else {
                label = nls.localize('gotoLineLabelEmptyWithLineAndColumnLimit', "Type a column between 1 and {0} to navigate to", model.getLineMaxColumn(position.lineNumber));
            }
            return {
                position: position,
                isValid: isValid,
                label: label
            };
        };
        GotoLineEntry.prototype.getLabel = function () {
            return this._parseResult.label;
        };
        GotoLineEntry.prototype.run = function (mode, context) {
            if (mode === QuickOpen.Mode.OPEN) {
                return this.runOpen();
            }
            return this.runPreview();
        };
        GotoLineEntry.prototype.runOpen = function () {
            // No-op if range is not valid
            if (!this._parseResult.isValid) {
                return false;
            }
            // Apply selection and focus
            var range = this.toSelection();
            this.editor.setSelection(range);
            this.editor.revealRangeInCenter(range);
            this.editor.focus();
            return true;
        };
        GotoLineEntry.prototype.runPreview = function () {
            // No-op if range is not valid
            if (!this._parseResult.isValid) {
                this.decorator.clearDecorations();
                return false;
            }
            // Select Line Position
            var range = this.toSelection();
            this.editor.revealRangeInCenter(range);
            // Decorate if possible
            this.decorator.decorateLine(range, this.editor);
            return false;
        };
        GotoLineEntry.prototype.toSelection = function () {
            return {
                startLineNumber: this._parseResult.position.lineNumber,
                startColumn: this._parseResult.position.column,
                endLineNumber: this._parseResult.position.lineNumber,
                endColumn: this._parseResult.position.column
            };
        };
        return GotoLineEntry;
    })(QuickOpenModel.QuickOpenEntry);
    exports.GotoLineEntry = GotoLineEntry;
    var GotoLineAction = (function (_super) {
        __extends(GotoLineAction, _super);
        function GotoLineAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, nls.localize('GotoLineAction.label', "Go to Line..."));
        }
        GotoLineAction.prototype._getModel = function (value) {
            var model = new QuickOpenModel.QuickOpenModel();
            var entries = [new GotoLineEntry(value, this.editor, this)];
            model.addEntries(entries);
            return model;
        };
        GotoLineAction.prototype._getAutoFocus = function (searchValue) {
            return {
                autoFocusFirstEntry: searchValue.length > 0
            };
        };
        GotoLineAction.prototype._getInputAriaLabel = function () {
            return nls.localize('gotoLineActionInput', "Type a line number, followed by an optional colon and a column number to navigate to");
        };
        GotoLineAction.ID = 'editor.action.gotoLine';
        GotoLineAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], GotoLineAction);
        return GotoLineAction;
    })(EditorQuickOpen.BaseEditorQuickOpenAction);
    exports.GotoLineAction = GotoLineAction;
});
//# sourceMappingURL=gotoLine.js.map