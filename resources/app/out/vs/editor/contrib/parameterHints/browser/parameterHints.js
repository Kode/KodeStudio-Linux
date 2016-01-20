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
define(["require", "exports", 'vs/nls', './parameterHintsModel', './parameterHintsWidget', 'vs/base/common/winjs.base', 'vs/editor/browser/editorBrowserExtensions', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', 'vs/platform/keybinding/common/keybindingService', 'vs/platform/instantiation/common/instantiation', 'vs/base/common/keyCodes', '../common/parameterHints'], function (require, exports, nls, Model, Widget, winjs_base_1, editorBrowserExtensions_1, editorCommonExtensions_1, editorAction_1, keybindingService_1, instantiation_1, keyCodes_1, parameterHints_1) {
    var ParameterHintsController = (function () {
        function ParameterHintsController(editor, keybindingService) {
            var _this = this;
            this.editor = editor;
            this.model = new Model.ParameterHintsModel(this.editor);
            this.parameterHintsVisible = keybindingService.createKey(CONTEXT_PARAMETER_HINTS_VISIBLE, false);
            this.widget = new Widget.ParameterHintsWidget(this.model, this.editor, function () {
                _this.parameterHintsVisible.set(true);
            }, function () {
                _this.parameterHintsVisible.reset();
            });
        }
        ParameterHintsController.get = function (editor) {
            return editor.getContribution(ParameterHintsController.ID);
        };
        ParameterHintsController.prototype.dispose = function () {
            this.model.dispose();
            this.model = null;
            this.widget.destroy();
            this.widget = null;
        };
        ParameterHintsController.prototype.getId = function () {
            return ParameterHintsController.ID;
        };
        ParameterHintsController.prototype.closeWidget = function () {
            this.widget.cancel();
        };
        ParameterHintsController.prototype.showPrevHint = function () {
            this.widget.selectPrevious();
        };
        ParameterHintsController.prototype.showNextHint = function () {
            this.widget.selectNext();
        };
        ParameterHintsController.prototype.trigger = function () {
            this.model.trigger(undefined, 0);
        };
        ParameterHintsController.ID = 'editor.controller.parameterHints';
        ParameterHintsController = __decorate([
            __param(1, keybindingService_1.IKeybindingService)
        ], ParameterHintsController);
        return ParameterHintsController;
    })();
    var TriggerParameterHintsAction = (function (_super) {
        __extends(TriggerParameterHintsAction, _super);
        function TriggerParameterHintsAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor);
        }
        TriggerParameterHintsAction.prototype.isSupported = function () {
            return parameterHints_1.ParameterHintsRegistry.has(this.editor.getModel()) && _super.prototype.isSupported.call(this);
        };
        TriggerParameterHintsAction.prototype.run = function () {
            ParameterHintsController.get(this.editor).trigger();
            return winjs_base_1.TPromise.as(true);
        };
        TriggerParameterHintsAction.ID = 'editor.action.triggerParameterHints';
        TriggerParameterHintsAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], TriggerParameterHintsAction);
        return TriggerParameterHintsAction;
    })(editorAction_1.EditorAction);
    exports.TriggerParameterHintsAction = TriggerParameterHintsAction;
    var CONTEXT_PARAMETER_HINTS_VISIBLE = 'parameterHintsVisible';
    var weight = editorCommonExtensions_1.CommonEditorRegistry.commandWeight(75);
    editorBrowserExtensions_1.EditorBrowserRegistry.registerEditorContribution(ParameterHintsController);
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(TriggerParameterHintsAction, TriggerParameterHintsAction.ID, nls.localize('parameterHints.trigger.label', "Trigger Parameter Hints"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.Space
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand('closeParameterHints', weight, { primary: keyCodes_1.KeyCode.Escape }, true, CONTEXT_PARAMETER_HINTS_VISIBLE, function (ctx, editor, args) {
        ParameterHintsController.get(editor).closeWidget();
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand('showPrevParameterHint', weight, { primary: keyCodes_1.KeyCode.UpArrow }, true, CONTEXT_PARAMETER_HINTS_VISIBLE, function (ctx, editor, args) {
        ParameterHintsController.get(editor).showPrevHint();
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand('showNextParameterHint', weight, { primary: keyCodes_1.KeyCode.DownArrow }, true, CONTEXT_PARAMETER_HINTS_VISIBLE, function (ctx, editor, args) {
        ParameterHintsController.get(editor).showNextHint();
    });
});
//# sourceMappingURL=parameterHints.js.map