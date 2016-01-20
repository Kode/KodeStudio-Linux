/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
define(["require", "exports", 'vs/nls', 'vs/editor/common/editorCommonExtensions', 'vs/base/common/keyCodes', 'vs/platform/actions/common/actions', 'vs/platform/instantiation/common/descriptors', 'vs/platform/platform', 'vs/platform/instantiation/common/extensions', 'vs/platform/keybinding/common/keybindingsRegistry', 'vs/platform/keybinding/common/keybindingService', 'vs/editor/browser/editorBrowserExtensions', 'vs/workbench/common/actionRegistry', 'vs/workbench/browser/actionBarRegistry', 'vs/workbench/browser/viewlet', 'vs/workbench/common/contributions', 'vs/workbench/browser/parts/editor/baseEditor', 'vs/workbench/parts/debug/common/debug', 'vs/workbench/parts/debug/browser/debugEditorModelManager', 'vs/workbench/parts/debug/electron-browser/debugActions', 'vs/workbench/parts/debug/browser/debugEditorInputs', 'vs/workbench/parts/debug/browser/replEditor', 'vs/workbench/parts/debug/browser/debugActionsWidget', 'vs/workbench/parts/debug/electron-browser/debugService', 'vs/workbench/parts/debug/browser/debugEditorContribution', 'vs/workbench/services/viewlet/common/viewletService', 'vs/workbench/services/editor/common/editorService', 'vs/css!../browser/media/debug.contribution', 'vs/css!../browser/media/debugHover'], function (require, exports, nls, editorCommonExtensions_1, keyCodes_1, actions_1, descriptors_1, platform, extensions_1, keybindingsRegistry_1, keybindingService_1, editorBrowserExtensions_1, wbaregistry, actionbarregistry, viewlet, wbext, baseeditor, debug, debugEditorModelManager_1, dbgactions, editorinputs, repleditor, debugwidget, service, debugEditorContribution_1, viewletService_1, editorService_1) {
    var IDebugService = debug.IDebugService;
    var OpenDebugViewletAction = (function (_super) {
        __extends(OpenDebugViewletAction, _super);
        function OpenDebugViewletAction(id, label, viewletService, editorService) {
            _super.call(this, id, label, debug.VIEWLET_ID, viewletService, editorService);
        }
        OpenDebugViewletAction.ID = debug.VIEWLET_ID;
        OpenDebugViewletAction.LABEL = nls.localize('toggleDebugViewlet', "Show Debug");
        OpenDebugViewletAction = __decorate([
            __param(2, viewletService_1.IViewletService),
            __param(3, editorService_1.IWorkbenchEditorService)
        ], OpenDebugViewletAction);
        return OpenDebugViewletAction;
    })(viewlet.ToggleViewletAction);
    editorBrowserExtensions_1.EditorBrowserRegistry.registerEditorContribution(debugEditorContribution_1.DebugEditorContribution);
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(dbgactions.ToggleBreakpointAction, dbgactions.ToggleBreakpointAction.ID, nls.localize('toggleBreakpointAction', "Debug: Toggle Breakpoint"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyCode.F9
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(dbgactions.SelectionToReplAction, dbgactions.SelectionToReplAction.ID, nls.localize('debugEvaluate', "Debug: Evaluate")));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(dbgactions.SelectionToWatchExpressionsAction, dbgactions.SelectionToWatchExpressionsAction.ID, nls.localize('addToWatch', "Debug: Add to Watch")));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(dbgactions.RunToCursorAction, dbgactions.RunToCursorAction.ID, nls.localize('runToCursor', "Debug: Run to Cursor")));
    // register viewlet
    platform.Registry.as(viewlet.Extensions.Viewlets).registerViewlet(new viewlet.ViewletDescriptor('vs/workbench/parts/debug/browser/debugViewlet', 'DebugViewlet', debug.VIEWLET_ID, nls.localize('debug', "Debug"), 'debug', 40));
    var openViewletKb = {
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_D
    };
    // register repl editor
    platform.Registry.as(baseeditor.Extensions.Editors).registerEditor(new baseeditor.EditorDescriptor(repleditor.Repl.ID, 'Repl', 'vs/workbench/parts/debug/browser/replEditor', 'Repl'), new descriptors_1.SyncDescriptor(editorinputs.ReplEditorInput));
    var actionBarRegistry = platform.Registry.as(actionbarregistry.Extensions.Actionbar);
    actionBarRegistry.registerActionBarContributor(actionbarregistry.Scope.EDITOR, repleditor.ReplEditorActionContributor);
    platform.Registry.as(baseeditor.Extensions.Editors).registerEditorInputFactory(editorinputs.ReplEditorInput.ID, repleditor.ReplInputFactory);
    // register action to open viewlet
    var registry = platform.Registry.as(wbaregistry.Extensions.WorkbenchActions);
    registry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(OpenDebugViewletAction, OpenDebugViewletAction.ID, OpenDebugViewletAction.LABEL, openViewletKb), nls.localize('view', "View"));
    platform.Registry.as(wbext.Extensions.Workbench).registerWorkbenchContribution(debugEditorModelManager_1.DebugEditorModelManager);
    platform.Registry.as(wbext.Extensions.Workbench).registerWorkbenchContribution(debugwidget.DebugActionsWidget);
    var debugCategory = nls.localize('debugCategory', "Debug");
    registry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(dbgactions.StartDebugAction, dbgactions.StartDebugAction.ID, dbgactions.StartDebugAction.LABEL, { primary: keyCodes_1.KeyCode.F5 }, keybindingService_1.KbExpr.not(debug.CONTEXT_IN_DEBUG_MODE)), debugCategory);
    registry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(dbgactions.StepOverDebugAction, dbgactions.StepOverDebugAction.ID, dbgactions.StepOverDebugAction.LABEL, { primary: keyCodes_1.KeyCode.F10 }, keybindingService_1.KbExpr.has(debug.CONTEXT_IN_DEBUG_MODE)), debugCategory);
    registry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(dbgactions.StepIntoDebugAction, dbgactions.StepIntoDebugAction.ID, dbgactions.StepIntoDebugAction.LABEL, { primary: keyCodes_1.KeyCode.F11 }, keybindingService_1.KbExpr.has(debug.CONTEXT_IN_DEBUG_MODE), keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(1)), debugCategory);
    registry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(dbgactions.StepOutDebugAction, dbgactions.StepOutDebugAction.ID, dbgactions.StepOutDebugAction.LABEL, { primary: keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.F11 }, keybindingService_1.KbExpr.has(debug.CONTEXT_IN_DEBUG_MODE)), debugCategory);
    registry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(dbgactions.RestartDebugAction, dbgactions.RestartDebugAction.ID, dbgactions.RestartDebugAction.LABEL), debugCategory);
    registry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(dbgactions.StopDebugAction, dbgactions.StopDebugAction.ID, dbgactions.StopDebugAction.LABEL, { primary: keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.F5 }, keybindingService_1.KbExpr.has(debug.CONTEXT_IN_DEBUG_MODE)), debugCategory);
    registry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(dbgactions.ContinueAction, dbgactions.ContinueAction.ID, dbgactions.ContinueAction.LABEL, { primary: keyCodes_1.KeyCode.F5 }, keybindingService_1.KbExpr.has(debug.CONTEXT_IN_DEBUG_MODE)), debugCategory);
    registry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(dbgactions.PauseAction, dbgactions.PauseAction.ID, dbgactions.PauseAction.LABEL), debugCategory);
    registry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(dbgactions.ConfigureAction, dbgactions.ConfigureAction.ID, dbgactions.ConfigureAction.LABEL), debugCategory);
    registry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(dbgactions.OpenReplAction, dbgactions.OpenReplAction.ID, dbgactions.OpenReplAction.LABEL), debugCategory);
    // register service
    extensions_1.registerSingleton(IDebugService, service.DebugService);
});
//# sourceMappingURL=debug.contribution.js.map