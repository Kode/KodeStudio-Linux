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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/nls', 'vs/base/common/errors', 'vs/base/parts/quickopen/browser/quickOpenModel', 'vs/base/parts/quickopen/common/quickOpen', 'vs/base/common/strings', 'vs/base/common/filters', 'vs/editor/common/editorAction', './editorQuickOpen', 'vs/platform/keybinding/common/keybindingService'], function (require, exports, winjs_base_1, nls, Errors, QuickOpenModel, QuickOpen, Strings, Filters, editorAction_1, EditorQuickOpen, keybindingService_1) {
    var EditorActionCommandEntry = (function (_super) {
        __extends(EditorActionCommandEntry, _super);
        function EditorActionCommandEntry(key, highlights, action, editor) {
            _super.call(this);
            this.key = key;
            this.setHighlights(highlights);
            this.action = action;
            this.editor = editor;
        }
        EditorActionCommandEntry.prototype.getLabel = function () {
            return this.action.label;
        };
        EditorActionCommandEntry.prototype.getGroupLabel = function () {
            return this.key;
        };
        EditorActionCommandEntry.prototype.run = function (mode, context) {
            var _this = this;
            if (mode === QuickOpen.Mode.OPEN) {
                // Use a timeout to give the quick open widget a chance to close itself first
                winjs_base_1.TPromise.timeout(50).done(function () {
                    // Some actions are enabled only when editor has focus
                    _this.editor.focus();
                    if (_this.action.enabled) {
                        try {
                            var promise = _this.action.run() || winjs_base_1.TPromise.as(null);
                            promise.done(null, Errors.onUnexpectedError);
                        }
                        catch (error) {
                            Errors.onUnexpectedError(error);
                        }
                    }
                }, Errors.onUnexpectedError);
                return true;
            }
            return false;
        };
        return EditorActionCommandEntry;
    })(QuickOpenModel.QuickOpenEntryGroup);
    exports.EditorActionCommandEntry = EditorActionCommandEntry;
    var QuickCommandAction = (function (_super) {
        __extends(QuickCommandAction, _super);
        function QuickCommandAction(descriptor, editor, keybindingService) {
            _super.call(this, descriptor, editor, nls.localize('QuickCommandAction.label', "Command Palette"), editorAction_1.Behaviour.WidgetFocus | editorAction_1.Behaviour.ShowInContextMenu);
            this._keybindingService = keybindingService;
        }
        QuickCommandAction.prototype._getModel = function (value) {
            var model = new QuickOpenModel.QuickOpenModel();
            var editorActions = this.editor.getActions();
            var entries = this._editorActionsToEntries(editorActions, value);
            model.addEntries(entries);
            return model;
        };
        QuickCommandAction.prototype.getGroupId = function () {
            return '4_tools/1_commands';
        };
        QuickCommandAction.prototype._sort = function (elementA, elementB) {
            var elementAName = elementA.getLabel().toLowerCase();
            var elementBName = elementB.getLabel().toLowerCase();
            return Strings.localeCompare(elementAName, elementBName);
        };
        QuickCommandAction.prototype._editorActionsToEntries = function (actions, searchValue) {
            var _this = this;
            var entries = [];
            for (var i = 0; i < actions.length; i++) {
                var action = actions[i];
                var editorAction = action;
                if (!editorAction.isSupported()) {
                    continue; // do not show actions that are not supported in this context
                }
                var keys = this._keybindingService.lookupKeybindings(editorAction.id).map(function (k) { return _this._keybindingService.getLabelFor(k); });
                if (action.label) {
                    var highlights = Filters.matchesFuzzy(searchValue, action.label);
                    if (highlights) {
                        entries.push(new EditorActionCommandEntry(keys.length > 0 ? keys.join(', ') : '', highlights, action, this.editor));
                    }
                }
            }
            // Sort by name
            entries = entries.sort(this._sort);
            return entries;
        };
        QuickCommandAction.prototype._getAutoFocus = function (searchValue) {
            return {
                autoFocusFirstEntry: true,
                autoFocusPrefixMatch: searchValue
            };
        };
        QuickCommandAction.prototype._getInputAriaLabel = function () {
            return nls.localize('quickCommandActionInput', "Type the name of an action you want to execute");
        };
        QuickCommandAction.ID = 'editor.action.quickCommand';
        QuickCommandAction = __decorate([
            __param(2, keybindingService_1.IKeybindingService)
        ], QuickCommandAction);
        return QuickCommandAction;
    })(EditorQuickOpen.BaseEditorQuickOpenAction);
    exports.QuickCommandAction = QuickCommandAction;
});
//# sourceMappingURL=quickCommand.js.map