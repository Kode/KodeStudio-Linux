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
define(["require", "exports", 'vs/nls', 'vs/base/common/arrays', 'vs/base/common/winjs.base', 'vs/base/common/errors', 'vs/base/common/strings', 'vs/base/common/filters', 'vs/base/parts/quickopen/browser/quickOpenModel', 'vs/base/parts/quickopen/common/quickOpen', './editorQuickOpen', 'vs/editor/common/editorAction', 'vs/platform/instantiation/common/instantiation', 'vs/css!./quickOutline'], function (require, exports, nls, Arrays, winjs_base_1, Errors, Strings, Filters, QuickOpenModel, QuickOpen, EditorQuickOpen, editorAction_1, instantiation_1) {
    var SCOPE_PREFIX = ':';
    var SymbolEntry = (function (_super) {
        __extends(SymbolEntry, _super);
        function SymbolEntry(name, type, description, range, highlights, editor, decorator) {
            _super.call(this);
            this.name = name;
            this.type = type;
            this.description = description;
            this.range = range;
            this.setHighlights(highlights);
            this.editor = editor;
            this.decorator = decorator;
        }
        SymbolEntry.prototype.getLabel = function () {
            return this.name;
        };
        SymbolEntry.prototype.getIcon = function () {
            return this.type;
        };
        SymbolEntry.prototype.getDescription = function () {
            return this.description;
        };
        SymbolEntry.prototype.getType = function () {
            return this.type;
        };
        SymbolEntry.prototype.getRange = function () {
            return this.range;
        };
        SymbolEntry.prototype.run = function (mode, context) {
            if (mode === QuickOpen.Mode.OPEN) {
                return this.runOpen(context);
            }
            return this.runPreview();
        };
        SymbolEntry.prototype.runOpen = function (context) {
            // Apply selection and focus
            var range = this.toSelection();
            this.editor.setSelection(range);
            this.editor.revealRangeInCenter(range);
            this.editor.focus();
            return true;
        };
        SymbolEntry.prototype.runPreview = function () {
            // Select Outline Position
            var range = this.toSelection();
            this.editor.revealRangeInCenter(range);
            // Decorate if possible
            this.decorator.decorateLine(this.range, this.editor);
            return false;
        };
        SymbolEntry.prototype.toSelection = function () {
            return {
                startLineNumber: this.range.startLineNumber,
                startColumn: this.range.startColumn || 1,
                endLineNumber: this.range.startLineNumber,
                endColumn: this.range.startColumn || 1
            };
        };
        return SymbolEntry;
    })(QuickOpenModel.QuickOpenEntryGroup);
    var QuickOutlineAction = (function (_super) {
        __extends(QuickOutlineAction, _super);
        function QuickOutlineAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, nls.localize('QuickOutlineAction.label', "Go to Symbol..."), editorAction_1.Behaviour.WidgetFocus | editorAction_1.Behaviour.ShowInContextMenu);
        }
        QuickOutlineAction.prototype.getGroupId = function () {
            return '1_goto/5_visitSymbol';
        };
        QuickOutlineAction.prototype.isSupported = function () {
            var mode = this.editor.getModel().getMode();
            return !!mode && !!mode.outlineSupport && _super.prototype.isSupported.call(this);
        };
        QuickOutlineAction.prototype.run = function () {
            var _this = this;
            var model = this.editor.getModel();
            var mode = model.getMode();
            var outlineSupport = mode.outlineSupport;
            // Only works for models with outline support
            if (!outlineSupport) {
                return null;
            }
            // Resolve outline
            var promise = outlineSupport.getOutline(model.getAssociatedResource());
            return promise.then(function (result) {
                if (Array.isArray(result) && result.length > 0) {
                    // Cache result
                    _this.cachedResult = result;
                    return _super.prototype.run.call(_this);
                }
                return winjs_base_1.TPromise.as(true);
            }, function (err) {
                Errors.onUnexpectedError(err);
                return false;
            });
        };
        QuickOutlineAction.prototype._getModel = function (value) {
            var model = new QuickOpenModel.QuickOpenModel();
            var entries = this.toQuickOpenEntries(this.cachedResult, value);
            model.addEntries(entries);
            return model;
        };
        QuickOutlineAction.prototype._getAutoFocus = function (searchValue) {
            // Remove any type pattern (:) from search value as needed
            if (searchValue.indexOf(SCOPE_PREFIX) === 0) {
                searchValue = searchValue.substr(SCOPE_PREFIX.length);
            }
            return {
                autoFocusPrefixMatch: searchValue,
                autoFocusFirstEntry: !!searchValue
            };
        };
        QuickOutlineAction.prototype._getInputAriaLabel = function () {
            return nls.localize('quickOutlineActionInput', "Type the name of an identifier you wish to navigate to");
        };
        QuickOutlineAction.prototype.toQuickOpenEntries = function (outline, searchValue) {
            var results = [];
            // Flatten
            var flattened = [];
            if (outline) {
                this.flatten(outline, flattened);
            }
            // Convert to Entries
            var normalizedSearchValue = searchValue;
            if (searchValue.indexOf(SCOPE_PREFIX) === 0) {
                normalizedSearchValue = normalizedSearchValue.substr(SCOPE_PREFIX.length);
            }
            for (var i = 0; i < flattened.length; i++) {
                var element = flattened[i];
                var label = Strings.trim(element.label);
                // Check for meatch
                var highlights = Filters.matchesFuzzy(normalizedSearchValue, label);
                if (highlights) {
                    // Show parent scope as description
                    var description = null;
                    if (element.parentScope) {
                        description = Arrays.tail(element.parentScope);
                    }
                    // Add
                    results.push(new SymbolEntry(label, element.type, description, element.range, highlights, this.editor, this));
                }
            }
            // Sort properly if actually searching
            if (searchValue) {
                if (searchValue.indexOf(SCOPE_PREFIX) === 0) {
                    results = results.sort(this.sortScoped.bind(this, searchValue.toLowerCase()));
                }
                else {
                    results = results.sort(this.sortNormal.bind(this, searchValue.toLowerCase()));
                }
            }
            // Mark all type groups
            if (results.length > 0 && searchValue.indexOf(SCOPE_PREFIX) === 0) {
                var currentType = null;
                var currentResult = null;
                var typeCounter = 0;
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    // Found new type
                    if (currentType !== result.getType()) {
                        // Update previous result with count
                        if (currentResult) {
                            currentResult.setGroupLabel(this.typeToLabel(currentType, typeCounter));
                        }
                        currentType = result.getType();
                        currentResult = result;
                        typeCounter = 1;
                        result.setShowBorder(i > 0);
                    }
                    else {
                        typeCounter++;
                    }
                }
                // Update previous result with count
                if (currentResult) {
                    currentResult.setGroupLabel(this.typeToLabel(currentType, typeCounter));
                }
            }
            else if (results.length > 0) {
                results[0].setGroupLabel(nls.localize('symbols', "symbols ({0})", results.length));
            }
            return results;
        };
        QuickOutlineAction.prototype.typeToLabel = function (type, count) {
            switch (type) {
                case 'module': return nls.localize('modules', "modules ({0})", count);
                case 'class': return nls.localize('class', "classes ({0})", count);
                case 'interface': return nls.localize('interface', "interfaces ({0})", count);
                case 'method': return nls.localize('method', "methods ({0})", count);
                case 'function': return nls.localize('function', "functions ({0})", count);
                case 'property': return nls.localize('property', "properties ({0})", count);
                case 'variable': return nls.localize('variable', "variables ({0})", count);
                case 'var': return nls.localize('variable2', "variables ({0})", count);
                case 'constructor': return nls.localize('_constructor', "constructors ({0})", count);
                case 'call': return nls.localize('call', "calls ({0})", count);
            }
            return type;
        };
        QuickOutlineAction.prototype.flatten = function (outline, flattened, parentScope) {
            for (var i = 0; i < outline.length; i++) {
                var element = outline[i];
                flattened.push(element);
                if (parentScope) {
                    element.parentScope = parentScope;
                }
                if (element.children) {
                    var elementScope = [];
                    if (parentScope) {
                        elementScope = parentScope.slice(0);
                    }
                    elementScope.push(element.label);
                    this.flatten(element.children, flattened, elementScope);
                }
            }
        };
        QuickOutlineAction.prototype.sortNormal = function (searchValue, elementA, elementB) {
            var elementAName = elementA.getLabel().toLowerCase();
            var elementBName = elementB.getLabel().toLowerCase();
            // Compare by name
            var r = Strings.localeCompare(elementAName, elementBName);
            if (r !== 0) {
                return r;
            }
            // If name identical sort by range instead
            var elementARange = elementA.getRange();
            var elementBRange = elementB.getRange();
            return elementARange.startLineNumber - elementBRange.startLineNumber;
        };
        QuickOutlineAction.prototype.sortScoped = function (searchValue, elementA, elementB) {
            // Remove scope char
            searchValue = searchValue.substr(SCOPE_PREFIX.length);
            // Sort by type first if scoped search
            var elementAType = elementA.getType();
            var elementBType = elementB.getType();
            var r = Strings.localeCompare(elementAType, elementBType);
            if (r !== 0) {
                return r;
            }
            // Special sort when searching in scoped mode
            if (searchValue) {
                var elementAName = elementA.getLabel().toLowerCase();
                var elementBName = elementB.getLabel().toLowerCase();
                // Compare by name
                var r = Strings.localeCompare(elementAName, elementBName);
                if (r !== 0) {
                    return r;
                }
            }
            // Default to sort by range
            var elementARange = elementA.getRange();
            var elementBRange = elementB.getRange();
            return elementARange.startLineNumber - elementBRange.startLineNumber;
        };
        QuickOutlineAction.prototype._onClose = function (canceled) {
            _super.prototype._onClose.call(this, canceled);
            // Clear Cache
            this.cachedResult = null;
        };
        QuickOutlineAction.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            // Clear Cache
            this.cachedResult = null;
        };
        QuickOutlineAction.ID = 'editor.action.quickOutline';
        QuickOutlineAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], QuickOutlineAction);
        return QuickOutlineAction;
    })(EditorQuickOpen.BaseEditorQuickOpenAction);
    exports.QuickOutlineAction = QuickOutlineAction;
});
//# sourceMappingURL=quickOutline.js.map