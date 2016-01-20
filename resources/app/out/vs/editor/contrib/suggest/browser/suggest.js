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
define(["require", "exports", 'vs/nls', 'vs/base/common/lifecycle', 'vs/editor/contrib/snippet/common/snippet', './suggestWidget', './suggestModel', 'vs/base/common/errors', 'vs/base/common/winjs.base', 'vs/editor/browser/editorBrowserExtensions', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', 'vs/editor/common/editorCommon', 'vs/platform/keybinding/common/keybindingService', 'vs/editor/contrib/suggest/common/suggest', 'vs/platform/instantiation/common/instantiation', 'vs/base/common/keyCodes'], function (require, exports, nls, Lifecycle, Snippet, suggestWidget_1, suggestModel_1, Errors, winjs_base_1, editorBrowserExtensions_1, editorCommonExtensions_1, editorAction_1, EditorCommon, keybindingService_1, suggest_1, instantiation_1, keyCodes_1) {
    var SuggestController = (function () {
        function SuggestController(editor, keybindingService, instantiationService) {
            var _this = this;
            this.editor = editor;
            this.suggestWidgetVisible = keybindingService.createKey(suggest_1.CONTEXT_SUGGEST_WIDGET_VISIBLE, false);
            this.model = new suggestModel_1.SuggestModel(this.editor);
            this.widget = instantiationService.createInstance(suggestWidget_1.SuggestWidget, this.editor, this.model);
            this.triggerCharacterListeners = [];
            this.toDispose = [];
            this.toDispose.push(this.widget.onDidVisibilityChange(function (visible) { return visible ? _this.suggestWidgetVisible.set(true) : _this.suggestWidgetVisible.reset(); }));
            this.toDispose.push(editor.addListener2(EditorCommon.EventType.ConfigurationChanged, function () { return _this.update(); }));
            this.toDispose.push(editor.addListener2(EditorCommon.EventType.ModelChanged, function () { return _this.update(); }));
            this.toDispose.push(editor.addListener2(EditorCommon.EventType.ModelModeChanged, function () { return _this.update(); }));
            this.toDispose.push(editor.addListener2(EditorCommon.EventType.ModelModeSupportChanged, function (e) {
                if (e.suggestSupport) {
                    _this.update();
                }
            }));
            this.toDispose.push(suggest_1.SuggestRegistry.onDidChange(this.update, this));
            this.toDispose.push(this.model.onDidAccept(function (e) { return Snippet.get(_this.editor).run(e.snippet, e.overwriteBefore, e.overwriteAfter); }));
            this.update();
        }
        SuggestController.getSuggestController = function (editor) {
            return editor.getContribution(SuggestController.ID);
        };
        SuggestController.prototype.getId = function () {
            return SuggestController.ID;
        };
        SuggestController.prototype.dispose = function () {
            this.toDispose = Lifecycle.disposeAll(this.toDispose);
            this.triggerCharacterListeners = Lifecycle.cAll(this.triggerCharacterListeners);
            if (this.widget) {
                this.widget.dispose();
                this.widget = null;
            }
            if (this.model) {
                this.model.dispose();
                this.model = null;
            }
        };
        SuggestController.prototype.update = function () {
            var _this = this;
            this.triggerCharacterListeners = Lifecycle.cAll(this.triggerCharacterListeners);
            if (this.editor.getConfiguration().readOnly
                || !this.editor.getModel()
                || !this.editor.getConfiguration().suggestOnTriggerCharacters) {
                return;
            }
            var groups = suggest_1.SuggestRegistry.orderedGroups(this.editor.getModel());
            if (groups.length === 0) {
                return;
            }
            var triggerCharacters = Object.create(null);
            groups.forEach(function (group) {
                var groupTriggerCharacters = Object.create(null);
                group.forEach(function (support) {
                    var localTriggerCharacters = support.getTriggerCharacters();
                    if (localTriggerCharacters) {
                        for (var _i = 0; _i < localTriggerCharacters.length; _i++) {
                            var ch = localTriggerCharacters[_i];
                            var array = groupTriggerCharacters[ch];
                            if (array) {
                                array.push(support);
                            }
                            else {
                                array = [support];
                                groupTriggerCharacters[ch] = array;
                                if (triggerCharacters[ch]) {
                                    triggerCharacters[ch].push(array);
                                }
                                else {
                                    triggerCharacters[ch] = [array];
                                }
                            }
                        }
                    }
                });
            });
            Object.keys(triggerCharacters).forEach(function (ch) {
                _this.triggerCharacterListeners.push(_this.editor.addTypingListener(ch, function () {
                    _this.triggerCharacterHandler(ch, triggerCharacters[ch]);
                }));
            });
        };
        SuggestController.prototype.triggerCharacterHandler = function (character, groups) {
            var position = this.editor.getPosition();
            var lineContext = this.editor.getModel().getLineContext(position.lineNumber);
            groups = groups.map(function (supports) {
                return supports.filter(function (support) { return support.shouldAutotriggerSuggest(lineContext, position.column - 1, character); });
            });
            if (groups.length > 0) {
                this.triggerSuggest(character, groups).done(null, Errors.onUnexpectedError);
            }
        };
        SuggestController.prototype.triggerSuggest = function (triggerCharacter, groups) {
            this.model.trigger(false, triggerCharacter, false, groups);
            this.editor.focus();
            return winjs_base_1.TPromise.as(false);
        };
        SuggestController.prototype.acceptSelectedSuggestion = function () {
            if (this.widget) {
                this.widget.acceptSelectedSuggestion();
            }
        };
        SuggestController.prototype.cancelSuggestWidget = function () {
            if (this.widget) {
                this.widget.cancel();
            }
        };
        SuggestController.prototype.selectNextSuggestion = function () {
            if (this.widget) {
                this.widget.selectNext();
            }
        };
        SuggestController.prototype.selectNextPageSuggestion = function () {
            if (this.widget) {
                this.widget.selectNextPage();
            }
        };
        SuggestController.prototype.selectPrevSuggestion = function () {
            if (this.widget) {
                this.widget.selectPrevious();
            }
        };
        SuggestController.prototype.selectPrevPageSuggestion = function () {
            if (this.widget) {
                this.widget.selectPreviousPage();
            }
        };
        SuggestController.prototype.toggleSuggestionDetails = function () {
            if (this.widget) {
                this.widget.toggleDetails();
            }
        };
        SuggestController.ID = 'editor.contrib.suggestController';
        SuggestController = __decorate([
            __param(1, keybindingService_1.IKeybindingService),
            __param(2, instantiation_1.IInstantiationService)
        ], SuggestController);
        return SuggestController;
    })();
    exports.SuggestController = SuggestController;
    var TriggerSuggestAction = (function (_super) {
        __extends(TriggerSuggestAction, _super);
        function TriggerSuggestAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor);
        }
        TriggerSuggestAction.prototype.isSupported = function () {
            return suggest_1.SuggestRegistry.has(this.editor.getModel()) && !this.editor.getConfiguration().readOnly;
        };
        TriggerSuggestAction.prototype.run = function () {
            return SuggestController.getSuggestController(this.editor).triggerSuggest();
        };
        TriggerSuggestAction.ID = 'editor.action.triggerSuggest';
        TriggerSuggestAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], TriggerSuggestAction);
        return TriggerSuggestAction;
    })(editorAction_1.EditorAction);
    exports.TriggerSuggestAction = TriggerSuggestAction;
    var weight = editorCommonExtensions_1.CommonEditorRegistry.commandWeight(90);
    // register action
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(TriggerSuggestAction, TriggerSuggestAction.ID, nls.localize('suggest.trigger.label', "Trigger Suggest"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.Space,
        mac: { primary: keyCodes_1.KeyMod.WinCtrl | keyCodes_1.KeyCode.Space }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(suggest_1.ACCEPT_SELECTED_SUGGESTION_CMD, weight, { primary: keyCodes_1.KeyCode.Enter, secondary: [keyCodes_1.KeyCode.Tab] }, true, suggest_1.CONTEXT_SUGGEST_WIDGET_VISIBLE, function (ctx, editor, args) {
        var controller = SuggestController.getSuggestController(editor);
        controller.acceptSelectedSuggestion();
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand('hideSuggestWidget', weight, { primary: keyCodes_1.KeyCode.Escape }, true, suggest_1.CONTEXT_SUGGEST_WIDGET_VISIBLE, function (ctx, editor, args) {
        var controller = SuggestController.getSuggestController(editor);
        controller.cancelSuggestWidget();
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand('selectNextSuggestion', weight, { primary: keyCodes_1.KeyCode.DownArrow }, true, suggest_1.CONTEXT_SUGGEST_WIDGET_VISIBLE, function (ctx, editor, args) {
        var controller = SuggestController.getSuggestController(editor);
        controller.selectNextSuggestion();
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand('selectNextPageSuggestion', weight, { primary: keyCodes_1.KeyCode.PageDown }, true, suggest_1.CONTEXT_SUGGEST_WIDGET_VISIBLE, function (ctx, editor, args) {
        var controller = SuggestController.getSuggestController(editor);
        controller.selectNextPageSuggestion();
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand('selectPrevSuggestion', weight, { primary: keyCodes_1.KeyCode.UpArrow }, true, suggest_1.CONTEXT_SUGGEST_WIDGET_VISIBLE, function (ctx, editor, args) {
        var controller = SuggestController.getSuggestController(editor);
        controller.selectPrevSuggestion();
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand('selectPrevPageSuggestion', weight, { primary: keyCodes_1.KeyCode.PageUp }, true, suggest_1.CONTEXT_SUGGEST_WIDGET_VISIBLE, function (ctx, editor, args) {
        var controller = SuggestController.getSuggestController(editor);
        controller.selectPrevPageSuggestion();
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand('toggleSuggestionDetails', weight, { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.Space, mac: { primary: keyCodes_1.KeyMod.WinCtrl | keyCodes_1.KeyCode.Space } }, true, suggest_1.CONTEXT_SUGGEST_WIDGET_VISIBLE, function (ctx, editor, args) {
        var controller = SuggestController.getSuggestController(editor);
        controller.toggleSuggestionDetails();
    });
    editorBrowserExtensions_1.EditorBrowserRegistry.registerEditorContribution(SuggestController);
});
//# sourceMappingURL=suggest.js.map