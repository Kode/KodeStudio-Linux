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
define(["require", "exports", 'vs/nls', 'vs/platform/actions/common/actions', 'vs/workbench/common/actionRegistry', 'vs/platform/platform', 'vs/editor/common/editorCommonExtensions', 'vs/workbench/browser/actionBarRegistry', 'vs/workbench/browser/parts/editor/baseEditor', 'vs/workbench/parts/output/common/outputEditorInput', 'vs/workbench/parts/output/browser/outputActions', 'vs/platform/instantiation/common/instantiation', 'vs/base/common/keyCodes', 'vs/css!./media/outputactions.contribution'], function (require, exports, nls, actions_1, actionRegistry_1, platform_1, editorCommonExtensions_1, actionBarRegistry_1, baseEditor_1, outputEditorInput_1, outputActions_1, instantiation_1, keyCodes_1) {
    var OutputEditorActionContributor = (function (_super) {
        __extends(OutputEditorActionContributor, _super);
        function OutputEditorActionContributor(instantiationService) {
            _super.call(this);
            this.instantiationService = instantiationService;
        }
        OutputEditorActionContributor.prototype.hasActionsForEditorInput = function (context) {
            return context.input instanceof outputEditorInput_1.OutputEditorInput;
        };
        OutputEditorActionContributor.prototype.getActionsForEditorInput = function (context) {
            var actions = [];
            actions.push(this.instantiationService.createInstance(outputActions_1.SwitchOutputAction));
            actions.push(this.instantiationService.createInstance(outputActions_1.ClearOutputAction));
            return actions;
        };
        OutputEditorActionContributor.prototype.getActionItem = function (context, action) {
            if (action.id === outputActions_1.SwitchOutputAction.ID) {
                return this.instantiationService.createInstance(outputActions_1.SwitchOutputActionItem, action, context.input);
            }
            return _super.prototype.getActionItem.call(this, context, action);
        };
        OutputEditorActionContributor = __decorate([
            __param(0, instantiation_1.IInstantiationService)
        ], OutputEditorActionContributor);
        return OutputEditorActionContributor;
    })(baseEditor_1.EditorInputActionContributor);
    var actionRegistry = platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions);
    var actionBarRegistry = platform_1.Registry.as(actionBarRegistry_1.Extensions.Actionbar);
    // register show output action globally
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(outputActions_1.GlobalShowOutputAction, outputActions_1.GlobalShowOutputAction.ID, outputActions_1.GlobalShowOutputAction.LABEL), nls.localize('viewCategory', "View"));
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(outputActions_1.ToggleOutputAction, outputActions_1.ToggleOutputAction.ID, outputActions_1.ToggleOutputAction.LABEL, {
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_U,
        linux: {
            primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_H // On Ubuntu Ctrl+Shift+U is taken by some global OS command
        }
    }), nls.localize('viewCategory', "View"));
    // Contribute Output Editor Contributor
    actionBarRegistry.registerActionBarContributor(actionBarRegistry_1.Scope.EDITOR, OutputEditorActionContributor);
    // Contribute to Context Menu of Output Window
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(outputActions_1.ClearOutputEditorAction, outputActions_1.ClearOutputEditorAction.ID, nls.localize('clearOutput.label', "Clear Output")));
});
//# sourceMappingURL=outputActions.contribution.js.map