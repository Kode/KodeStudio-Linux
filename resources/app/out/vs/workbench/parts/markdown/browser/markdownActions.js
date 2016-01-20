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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/actions', 'vs/base/common/uri', 'vs/base/common/errors', 'vs/base/common/paths', 'vs/nls', 'vs/workbench/browser/parts/editor/baseEditor', 'vs/workbench/common/editor', 'vs/workbench/parts/markdown/common/markdownEditorInput', 'vs/workbench/services/editor/common/editorService', 'vs/workbench/services/part/common/partService', 'vs/platform/instantiation/common/instantiation', 'vs/platform/message/common/message', 'vs/workbench/services/workspace/common/contextService', 'vs/css!./media/markdownactions'], function (require, exports, winjs_base_1, actions_1, uri_1, errors, paths, nls, baseEditor_1, editor_1, markdownEditorInput_1, editorService_1, partService_1, instantiation_1, message_1, contextService_1) {
    var GlobalTogglePreviewMarkdownAction = (function (_super) {
        __extends(GlobalTogglePreviewMarkdownAction, _super);
        function GlobalTogglePreviewMarkdownAction(id, label, instantiationService, editorService, messageService) {
            _super.call(this, id, label);
            this.instantiationService = instantiationService;
            this.editorService = editorService;
            this.messageService = messageService;
        }
        GlobalTogglePreviewMarkdownAction.prototype.run = function (event) {
            var activeInput = this.editorService.getActiveEditorInput();
            // View source if we are in a markdown file already
            if (activeInput instanceof markdownEditorInput_1.MarkdownEditorInput) {
                this.editorService.openEditor({
                    resource: activeInput.getResource()
                }).done(null, errors.onUnexpectedError);
            }
            else {
                var msg;
                var resource = editor_1.getUntitledOrFileResource(activeInput);
                if (resource) {
                    var action = this.instantiationService.createInstance(PreviewMarkdownAction, resource);
                    action.run().done(function () { return action.dispose(); }, errors.onUnexpectedError);
                }
                else {
                    msg = nls.localize('markdownPreviewNoFile', "Open a Markdown file first to show a preview.");
                }
                if (msg) {
                    this.messageService.show(message_1.Severity.Info, msg);
                }
            }
            return winjs_base_1.Promise.as(true);
        };
        GlobalTogglePreviewMarkdownAction.ID = 'workbench.action.markdown.togglePreview';
        GlobalTogglePreviewMarkdownAction.LABEL = nls.localize('toggleMarkdownPreview', "Toggle Preview");
        GlobalTogglePreviewMarkdownAction = __decorate([
            __param(2, instantiation_1.IInstantiationService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, message_1.IMessageService)
        ], GlobalTogglePreviewMarkdownAction);
        return GlobalTogglePreviewMarkdownAction;
    })(actions_1.Action);
    exports.GlobalTogglePreviewMarkdownAction = GlobalTogglePreviewMarkdownAction;
    var OpenPreviewToSideAction = (function (_super) {
        __extends(OpenPreviewToSideAction, _super);
        function OpenPreviewToSideAction(id, label, instantiationService, editorService, messageService) {
            _super.call(this, id, label);
            this.instantiationService = instantiationService;
            this.editorService = editorService;
            this.messageService = messageService;
        }
        OpenPreviewToSideAction.prototype.run = function (event) {
            var activeInput = this.editorService.getActiveEditorInput();
            // Do nothing if already in markdown preview
            if (activeInput instanceof markdownEditorInput_1.MarkdownEditorInput) {
                return winjs_base_1.Promise.as(true);
            }
            else {
                var msg;
                var resource = editor_1.getUntitledOrFileResource(activeInput);
                if (resource) {
                    var input = this.instantiationService.createInstance(markdownEditorInput_1.MarkdownEditorInput, resource, void 0, void 0);
                    return this.editorService.openEditor(input, null, true /* to the side */);
                }
                else {
                    msg = nls.localize('markdownPreviewNoFile', "Open a Markdown file first to show a preview.");
                }
                if (msg) {
                    this.messageService.show(message_1.Severity.Info, msg);
                }
            }
            return winjs_base_1.Promise.as(true);
        };
        OpenPreviewToSideAction.ID = 'workbench.action.markdown.openPreviewSideBySide';
        OpenPreviewToSideAction.LABEL = nls.localize('openPreviewSideBySide', "Open Preview to the Side");
        OpenPreviewToSideAction = __decorate([
            __param(2, instantiation_1.IInstantiationService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, message_1.IMessageService)
        ], OpenPreviewToSideAction);
        return OpenPreviewToSideAction;
    })(actions_1.Action);
    exports.OpenPreviewToSideAction = OpenPreviewToSideAction;
    var PreviewMarkdownAction = (function (_super) {
        __extends(PreviewMarkdownAction, _super);
        function PreviewMarkdownAction(markdownResource, instantiationService, editorService) {
            _super.call(this, 'workbench.markdown.action.previewFromExplorer', nls.localize('openPreview', "Open Preview"));
            this.instantiationService = instantiationService;
            this.editorService = editorService;
            this.markdownResource = markdownResource;
        }
        PreviewMarkdownAction.prototype.run = function (event) {
            var input = this.instantiationService.createInstance(markdownEditorInput_1.MarkdownEditorInput, this.markdownResource, void 0, void 0);
            return this.editorService.openEditor(input);
        };
        PreviewMarkdownAction = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, editorService_1.IWorkbenchEditorService)
        ], PreviewMarkdownAction);
        return PreviewMarkdownAction;
    })(actions_1.Action);
    exports.PreviewMarkdownAction = PreviewMarkdownAction;
    var PreviewMarkdownEditorInputAction = (function (_super) {
        __extends(PreviewMarkdownEditorInputAction, _super);
        function PreviewMarkdownEditorInputAction(instantiationService, editorService) {
            _super.call(this, 'workbench.markdown.action.previewFromEditor', nls.localize('openPreview', "Open Preview"));
            this.instantiationService = instantiationService;
            this.editorService = editorService;
            this.class = 'markdown-action action-preview';
            this.order = 100; // far end
        }
        PreviewMarkdownEditorInputAction.prototype.run = function (event) {
            var input = this.input;
            var sideBySide = !!(event && (event.ctrlKey || event.metaKey));
            var markdownInput = this.instantiationService.createInstance(markdownEditorInput_1.MarkdownEditorInput, input.getResource(), void 0, void 0);
            return this.editorService.openEditor(markdownInput, null, sideBySide);
        };
        PreviewMarkdownEditorInputAction = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, editorService_1.IWorkbenchEditorService)
        ], PreviewMarkdownEditorInputAction);
        return PreviewMarkdownEditorInputAction;
    })(baseEditor_1.EditorInputAction);
    exports.PreviewMarkdownEditorInputAction = PreviewMarkdownEditorInputAction;
    var ShowWelcomeAction = (function (_super) {
        __extends(ShowWelcomeAction, _super);
        function ShowWelcomeAction(id, label, instantiationService, editorService, partService, contextService) {
            _super.call(this, id, label);
            this.instantiationService = instantiationService;
            this.editorService = editorService;
            this.partService = partService;
            this.contextService = contextService;
            this.preserveFocus = false;
            var env = contextService.getConfiguration().env;
            if (env.welcomePage) {
                this.welcomePageResource = uri_1.default.file(paths.join(env.appRoot, env.welcomePage));
            }
            this.enabled = !!this.welcomePageResource;
        }
        ShowWelcomeAction.prototype.setPreserveFocus = function (preserveFocus) {
            this.preserveFocus = preserveFocus;
        };
        ShowWelcomeAction.prototype.run = function () {
            var _this = this;
            return this.partService.joinCreation().then(function () {
                var editorCount = _this.editorService.getVisibleEditors().length;
                var markdownInput = _this.instantiationService.createInstance(markdownEditorInput_1.MarkdownEditorInput, _this.welcomePageResource, nls.localize('welcome', "Welcome"), nls.localize('vscode', "Getting Started"));
                var options = new editor_1.EditorOptions();
                options.preserveFocus = _this.preserveFocus;
                return _this.editorService.openEditor(markdownInput, options, editorCount !== 0 && editorCount !== 3);
            });
        };
        ShowWelcomeAction.ID = 'workbench.action.markdown.showWelcome';
        ShowWelcomeAction.LABEL = nls.localize('showWelcome', "Show Welcome");
        ShowWelcomeAction = __decorate([
            __param(2, instantiation_1.IInstantiationService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, partService_1.IPartService),
            __param(5, contextService_1.IWorkspaceContextService)
        ], ShowWelcomeAction);
        return ShowWelcomeAction;
    })(actions_1.Action);
    exports.ShowWelcomeAction = ShowWelcomeAction;
});
//# sourceMappingURL=markdownActions.js.map