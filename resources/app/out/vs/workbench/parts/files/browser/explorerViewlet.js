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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/workbench/common/memento', 'vs/workbench/parts/files/common/files', 'vs/workbench/browser/viewlet', 'vs/base/browser/ui/splitview/splitview', 'vs/workbench/parts/files/browser/views/explorerViewer', 'vs/workbench/parts/files/browser/views/explorerView', 'vs/workbench/parts/files/browser/views/emptyView', 'vs/workbench/parts/files/browser/views/workingFilesView', 'vs/platform/storage/common/storage', 'vs/platform/instantiation/common/instantiation', 'vs/platform/workspace/common/workspace', 'vs/platform/telemetry/common/telemetry', 'vs/css!./media/explorerviewlet'], function (require, exports, winjs_base_1, memento_1, files_1, viewlet_1, splitview_1, explorerViewer_1, explorerView_1, emptyView_1, workingFilesView_1, storage_1, instantiation_1, workspace_1, telemetry_1) {
    var ExplorerViewlet = (function (_super) {
        __extends(ExplorerViewlet, _super);
        function ExplorerViewlet(telemetryService, contextService, storageService, instantiationService) {
            _super.call(this, files_1.VIEWLET_ID, telemetryService);
            this.contextService = contextService;
            this.storageService = storageService;
            this.instantiationService = instantiationService;
            this.views = [];
            this.viewletState = new explorerViewer_1.FileViewletState();
            this.viewletSettings = this.getMemento(storageService, memento_1.Scope.WORKSPACE);
        }
        ExplorerViewlet.prototype.create = function (parent) {
            _super.prototype.create.call(this, parent);
            this.viewletContainer = parent.div().addClass('explorer-viewlet');
            this.splitView = new splitview_1.SplitView(this.viewletContainer.getHTMLElement());
            // Working files view
            this.addWorkingFilesView();
            // Explorer view
            this.addExplorerView();
            return winjs_base_1.Promise.join(this.views.map(function (view) { return view.create(); }));
        };
        ExplorerViewlet.prototype.addWorkingFilesView = function () {
            this.workingFilesView = this.instantiationService.createInstance(workingFilesView_1.WorkingFilesView, this.getActionRunner(), this.viewletSettings);
            this.splitView.addView(this.workingFilesView);
            this.views.push(this.workingFilesView);
        };
        ExplorerViewlet.prototype.addExplorerView = function () {
            var explorerView;
            // With a Workspace
            if (this.contextService.getWorkspace()) {
                this.explorerView = explorerView = this.instantiationService.createInstance(explorerView_1.ExplorerView, this.viewletState, this.getActionRunner(), this.viewletSettings);
            }
            else {
                explorerView = this.instantiationService.createInstance(emptyView_1.EmptyView);
            }
            this.splitView.addView(explorerView);
            this.views.push(explorerView);
        };
        /**
         * Refresh the contents of the explorer to get up to date data from the disk about the file structure.
         *
         * @param focus if set to true, the explorer viewer will receive keyboard focus
         * @param reveal if set to true, the current active input will be revealed in the explorer
         */
        ExplorerViewlet.prototype.refresh = function (focus, reveal, instantProgress) {
            return winjs_base_1.Promise.join(this.views.map(function (view) { return view.refresh(focus, reveal, instantProgress); }));
        };
        ExplorerViewlet.prototype.getExplorerView = function () {
            return this.explorerView;
        };
        ExplorerViewlet.prototype.getWorkingFilesView = function () {
            return this.workingFilesView;
        };
        ExplorerViewlet.prototype.setVisible = function (visible) {
            var _this = this;
            return _super.prototype.setVisible.call(this, visible).then(function () {
                return winjs_base_1.Promise.join(_this.views.map(function (view) { return view.setVisible(visible); }));
            });
        };
        ExplorerViewlet.prototype.focus = function () {
            _super.prototype.focus.call(this);
            if (this.explorerView) {
                this.explorerView.focus();
            }
        };
        ExplorerViewlet.prototype.layout = function (dimension) {
            this.splitView.layout(dimension.height);
        };
        ExplorerViewlet.prototype.getSelection = function () {
            return this.explorerView ? this.explorerView.getSelection() : this.workingFilesView.getSelection();
        };
        ExplorerViewlet.prototype.getActionRunner = function () {
            if (!this.actionRunner) {
                this.actionRunner = new explorerViewer_1.ActionRunner(this.viewletState);
            }
            return this.actionRunner;
        };
        ExplorerViewlet.prototype.shutdown = function () {
            this.views.forEach(function (view) { return view.shutdown(); });
            _super.prototype.shutdown.call(this);
        };
        ExplorerViewlet.prototype.dispose = function () {
            if (this.splitView) {
                this.splitView.dispose();
            }
        };
        ExplorerViewlet = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, workspace_1.IWorkspaceContextService),
            __param(2, storage_1.IStorageService),
            __param(3, instantiation_1.IInstantiationService)
        ], ExplorerViewlet);
        return ExplorerViewlet;
    })(viewlet_1.Viewlet);
    exports.ExplorerViewlet = ExplorerViewlet;
});
//# sourceMappingURL=explorerViewlet.js.map