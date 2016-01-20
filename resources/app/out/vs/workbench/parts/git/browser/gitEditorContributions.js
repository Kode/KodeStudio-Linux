/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
define(["require", "exports", 'vs/editor/common/editorCommon', 'vs/workbench/parts/git/common/git', 'vs/platform/workspace/common/workspace'], function (require, exports, common, git, workspace_1) {
    var IGitService = git.IGitService;
    var MergeDecorator = (function () {
        function MergeDecorator(editor, gitService, contextService) {
            this.gitService = gitService;
            this.contextService = contextService;
            this.editor = editor;
            this.toUnbind = [this.editor.addListener(common.EventType.ModelChanged, this.onModelChanged.bind(this))];
            this.decorations = [];
            this.model = null;
            this.unbindModelListener = null;
        }
        MergeDecorator.prototype.getId = function () {
            return MergeDecorator.ID;
        };
        MergeDecorator.prototype.onModelChanged = function () {
            if (this.model) {
                this.decorations = this.model.deltaDecorations(this.decorations, []);
                this.unbindModelListener();
                this.unbindModelListener = null;
                this.model = null;
            }
            if (!this.contextService || !this.gitService) {
                return;
            }
            var model = this.editor.getModel();
            if (!model) {
                return;
            }
            var resource = model.getAssociatedResource();
            if (!resource) {
                return;
            }
            var path = this.contextService.toWorkspaceRelativePath(resource);
            if (!path) {
                return;
            }
            var gitModel = this.gitService.getModel();
            var mergeStatus = gitModel.getStatus().find(path, git.StatusType.MERGE);
            if (!mergeStatus) {
                return;
            }
            this.model = model;
            this.redecorate();
            this.unbindModelListener = this.model.addListener(common.EventType.ModelContentChanged, this.redecorate.bind(this));
        };
        MergeDecorator.prototype.redecorate = function () {
            var decorations = [];
            var lineCount = this.model.getLineCount();
            for (var i = 1; i <= lineCount; i++) {
                var start = this.model.getLineContent(i).substr(0, 7);
                switch (start) {
                    case '<<<<<<<':
                    case '=======':
                    case '>>>>>>>':
                        decorations.push({
                            range: { startLineNumber: i, startColumn: 1, endLineNumber: i, endColumn: 1 },
                            options: MergeDecorator.DECORATION_OPTIONS
                        });
                        break;
                }
            }
            this.decorations = this.model.deltaDecorations(this.decorations, decorations);
        };
        MergeDecorator.prototype.dispose = function () {
            while (this.toUnbind.length) {
                this.toUnbind.pop()();
            }
        };
        MergeDecorator.ID = 'Monaco.IDE.UI.Viewlets.GitViewlet.Editor.MergeDecorator';
        MergeDecorator.DECORATION_OPTIONS = {
            className: 'git-merge-control-decoration',
            isWholeLine: true,
            overviewRuler: {
                color: 'rgb(197, 118, 0)',
                darkColor: 'rgb(197, 118, 0)',
                position: common.OverviewRulerLane.Left
            }
        };
        MergeDecorator = __decorate([
            __param(1, IGitService),
            __param(2, workspace_1.IWorkspaceContextService)
        ], MergeDecorator);
        return MergeDecorator;
    })();
    exports.MergeDecorator = MergeDecorator;
});
//# sourceMappingURL=gitEditorContributions.js.map