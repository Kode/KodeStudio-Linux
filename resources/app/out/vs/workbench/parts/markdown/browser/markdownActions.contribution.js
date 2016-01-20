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
define(["require", "exports", 'vs/nls', 'vs/platform/platform', 'vs/platform/actions/common/actions', 'vs/workbench/browser/actionBarRegistry', 'vs/workbench/parts/files/browser/files', 'vs/workbench/parts/files/common/files', 'vs/base/common/strings', 'vs/workbench/parts/markdown/browser/markdownActions', 'vs/workbench/parts/markdown/common/markdown', 'vs/workbench/common/actionRegistry', 'vs/platform/instantiation/common/instantiation', 'vs/base/common/keyCodes'], function (require, exports, nls, platform_1, actions_1, actionBarRegistry_1, files_1, files_2, strings, markdownActions_1, markdown_1, actionRegistry_1, instantiation_1, keyCodes_1) {
    var ExplorerViewerActionContributor = (function (_super) {
        __extends(ExplorerViewerActionContributor, _super);
        function ExplorerViewerActionContributor(instantiationService) {
            _super.call(this);
            this.instantiationService = instantiationService;
        }
        ExplorerViewerActionContributor.prototype.hasSecondaryActions = function (context) {
            var element = context.element;
            // Contribute only on file resources
            var fileResource = files_2.asFileResource(element);
            if (!fileResource) {
                return false;
            }
            return !fileResource.isDirectory && (markdown_1.MARKDOWN_FILES.some(function (extension) { return strings.endsWith(fileResource.resource.fsPath, extension); }));
        };
        ExplorerViewerActionContributor.prototype.getSecondaryActions = function (context) {
            var actions = [];
            if (this.hasSecondaryActions(context)) {
                var fileResource = files_2.asFileResource(context.element);
                // Open Markdown
                var action = this.instantiationService.createInstance(markdownActions_1.PreviewMarkdownAction, fileResource.resource);
                action.order = 0; // on top of other actions
                actions.push(action);
            }
            return actions;
        };
        ExplorerViewerActionContributor = __decorate([
            __param(0, instantiation_1.IInstantiationService)
        ], ExplorerViewerActionContributor);
        return ExplorerViewerActionContributor;
    })(actionBarRegistry_1.ActionBarContributor);
    var MarkdownFilesActionContributor = (function (_super) {
        __extends(MarkdownFilesActionContributor, _super);
        function MarkdownFilesActionContributor(instantiationService) {
            _super.call(this, [markdown_1.MARKDOWN_MIME]);
            this.instantiationService = instantiationService;
        }
        MarkdownFilesActionContributor.prototype.hasActionsForEditorInput = function (context) {
            return true;
        };
        MarkdownFilesActionContributor.prototype.getActionsForEditorInput = function (context) {
            return [
                this.instantiationService.createInstance(markdownActions_1.PreviewMarkdownEditorInputAction)
            ];
        };
        MarkdownFilesActionContributor = __decorate([
            __param(0, instantiation_1.IInstantiationService)
        ], MarkdownFilesActionContributor);
        return MarkdownFilesActionContributor;
    })(files_1.FileEditorInputActionContributor);
    // Contribute to viewers and editors of markdown files
    var actionBarRegistry = platform_1.Registry.as(actionBarRegistry_1.Extensions.Actionbar);
    actionBarRegistry.registerActionBarContributor(actionBarRegistry_1.Scope.VIEWER, ExplorerViewerActionContributor);
    actionBarRegistry.registerActionBarContributor(actionBarRegistry_1.Scope.EDITOR, MarkdownFilesActionContributor);
    var category = nls.localize('markdown', "Markdown");
    var workbenchActionsRegistry = platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions);
    workbenchActionsRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(markdownActions_1.GlobalTogglePreviewMarkdownAction, markdownActions_1.GlobalTogglePreviewMarkdownAction.ID, markdownActions_1.GlobalTogglePreviewMarkdownAction.LABEL, { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_V }), category);
    workbenchActionsRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(markdownActions_1.OpenPreviewToSideAction, markdownActions_1.OpenPreviewToSideAction.ID, markdownActions_1.OpenPreviewToSideAction.LABEL, { primary: keyCodes_1.KeyMod.chord(keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.KEY_K, keyCodes_1.KeyCode.KEY_V) }), category);
    workbenchActionsRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(markdownActions_1.ShowWelcomeAction, markdownActions_1.ShowWelcomeAction.ID, markdownActions_1.ShowWelcomeAction.LABEL));
});
//# sourceMappingURL=markdownActions.contribution.js.map