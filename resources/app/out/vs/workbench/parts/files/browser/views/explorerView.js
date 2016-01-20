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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/browser/builder', 'vs/base/common/uri', 'vs/base/common/async', 'vs/base/common/errors', 'vs/base/common/paths', 'vs/workbench/browser/actionBarRegistry', 'vs/base/parts/tree/browser/treeImpl', 'vs/workbench/common/events', 'vs/platform/files/common/files', 'vs/workbench/parts/files/browser/fileActions', 'vs/workbench/parts/files/browser/editors/fileEditorInput', 'vs/workbench/parts/files/browser/views/explorerViewer', 'vs/base/common/lifecycle', 'vs/base/browser/dom', 'vs/workbench/browser/viewlet', 'vs/workbench/parts/files/common/explorerViewModel', 'vs/workbench/services/editor/common/editorService', 'vs/workbench/services/part/common/partService', 'vs/platform/storage/common/storage', 'vs/platform/configuration/common/configuration', 'vs/platform/event/common/event', 'vs/platform/instantiation/common/instantiation', 'vs/platform/progress/common/progress', 'vs/platform/workspace/common/workspace', 'vs/platform/contextview/browser/contextView', 'vs/platform/message/common/message'], function (require, exports, winjs_base_1, builder_1, uri_1, async_1, errors, paths, actionBarRegistry_1, treeImpl_1, events_1, files_1, fileActions_1, fileEditorInput_1, explorerViewer_1, lifecycle, DOM, viewlet_1, explorerViewModel_1, editorService_1, partService_1, storage_1, configuration_1, event_1, instantiation_1, progress_1, workspace_1, contextView_1, message_1) {
    var ExplorerView = (function (_super) {
        __extends(ExplorerView, _super);
        function ExplorerView(viewletState, actionRunner, settings, messageService, contextMenuService, instantiationService, eventService, storageService, contextService, progressService, editorService, fileService, partService, configurationService) {
            _super.call(this, actionRunner, false, 'explorerView', messageService, contextMenuService);
            this.instantiationService = instantiationService;
            this.eventService = eventService;
            this.storageService = storageService;
            this.contextService = contextService;
            this.progressService = progressService;
            this.editorService = editorService;
            this.fileService = fileService;
            this.partService = partService;
            this.configurationService = configurationService;
            this.workspace = contextService.getWorkspace();
            this.settings = settings;
            this.viewletState = viewletState;
            this.actionRunner = actionRunner;
            this.explorerRefreshDelayer = new async_1.ThrottledDelayer(ExplorerView.EXPLORER_FILE_CHANGES_REFRESH_DELAY);
            this.explorerImportDelayer = new async_1.ThrottledDelayer(ExplorerView.EXPLORER_IMPORT_REFRESH_DELAY);
        }
        ExplorerView.prototype.renderHeader = function (container) {
            _super.prototype.renderHeader.call(this, container);
            var titleDiv = builder_1.$('div.title').appendTo(container);
            builder_1.$('span').text(this.workspace.name).appendTo(titleDiv);
        };
        ExplorerView.prototype.renderBody = function (container) {
            this.treeContainer = _super.prototype.renderViewTree.call(this, container);
            DOM.addClass(this.treeContainer, 'explorer-folders-view');
            this.tree = this.createViewer(builder_1.$(this.treeContainer));
            this.fillToolBar();
        };
        ExplorerView.prototype.fillToolBar = function () {
            var actions = [];
            // New File
            actions.push(this.instantiationService.createInstance(fileActions_1.NewFileAction, this.getViewer(), null));
            // New Folder
            actions.push(this.instantiationService.createInstance(fileActions_1.NewFolderAction, this.getViewer(), null));
            // Refresh
            actions.push(this.instantiationService.createInstance(fileActions_1.RefreshViewExplorerAction, this, 'explorer-action refresh-explorer'));
            // Collapse
            actions.push(this.instantiationService.createInstance(viewlet_1.CollapseAction, this.getViewer(), true, 'explorer-action collapse-explorer'));
            // Set Order
            for (var i = 0; i < actions.length; i++) {
                var action = actions[i];
                action.order = 10 * (i + 1);
            }
            this.toolBar.setActions(actionBarRegistry_1.prepareActions(actions), [])();
        };
        ExplorerView.prototype.create = function () {
            var _this = this;
            // Load Config
            return this.configurationService.loadConfiguration().then(function (configuration) {
                // Update configuration
                _this.onConfigurationUpdated(configuration);
                // Load and Fill Viewer
                return _this.refresh(false, false).then(function () {
                    // When the explorer viewer is loaded, listen to changes to the editor input
                    _this.toDispose.push(_this.eventService.addListener2(events_1.EventType.EDITOR_INPUT_CHANGING, function (e) { return _this.onEditorInputChanging(e); }));
                    // Also handle configuration updates
                    _this.toDispose.push(_this.configurationService.addListener2(configuration_1.ConfigurationServiceEventTypes.UPDATED, function (e) { return _this.onConfigurationUpdated(e.config, true); }));
                });
            });
        };
        ExplorerView.prototype.onEditorInputChanging = function (e) {
            // During workbench startup, the editor area might restore more than one editor from a previous
            // session. When this happens there might be editor input changing events for side editors that
            // don't have focus. In these cases we do not adjust explorer selection for non-focused editors
            // because we only want to react for the editor that has focus.
            if (!this.partService.isCreated() && e.editorOptions && e.editorOptions.preserveFocus) {
                return;
            }
            var clearFocusAndSelection = true;
            // Handle File Input
            if (e.editorInput && e.editorInput instanceof fileEditorInput_1.FileEditorInput) {
                var fileInput = e.editorInput;
                // Always remember last opened file
                this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE] = fileInput.getResource().toString();
                // Reveal file if input is FileEditorInput
                if (this.isVisible) {
                    if (this.contextService.isInsideWorkspace(fileInput.getResource())) {
                        this.select(fileInput.getResource(), false /* Prevent reveal so that upon opening a file the tree does not jump around */).done(null, errors.onUnexpectedError);
                        clearFocusAndSelection = false;
                    }
                }
            }
            // Otherwise clear
            if (this.isVisible && clearFocusAndSelection) {
                this.explorerViewer.setSelection([]);
                this.explorerViewer.setFocus();
            }
        };
        ExplorerView.prototype.onConfigurationUpdated = function (configuration, refresh) {
            // Push down config updates to components of viewer
            var needsRefresh = false;
            if (this.filter) {
                needsRefresh = this.filter.updateConfiguration(configuration);
            }
            // Refresh viewer as needed
            if (refresh && needsRefresh) {
                this.refresh(false, false).done(null, errors.onUnexpectedError);
            }
        };
        ExplorerView.prototype.focus = function () {
            _super.prototype.focus.call(this);
            // Open the focused element in the editor if there is currently no file opened
            var input = this.editorService.getActiveEditorInput();
            if (!input || !(input instanceof fileEditorInput_1.FileEditorInput)) {
                this.openFocusedElement();
            }
        };
        ExplorerView.prototype.setVisible = function (visible) {
            var _this = this;
            return _super.prototype.setVisible.call(this, visible).then(function () {
                // Show
                if (visible) {
                    // If a refresh was requested and we are now visible, run it
                    var refreshPromise = winjs_base_1.Promise.as(null);
                    if (_this.shouldRefresh) {
                        refreshPromise = _this.refresh(false, false);
                        _this.shouldRefresh = false; // Reset flag
                    }
                    // Always reveal the current navigated file in explorer if input is file editor input
                    var activeResource = _this.getActiveEditorInputResource();
                    if (activeResource) {
                        return refreshPromise.then(function () {
                            return _this.select(activeResource);
                        });
                    }
                    // Return now if the workbench has not yet been created - in this case the workbench takes care of restoring last used editors
                    if (!_this.partService.isCreated()) {
                        return winjs_base_1.Promise.as(null);
                    }
                    // Otherwise restore last used file: By lastActiveFileResource
                    var root = _this.getInput();
                    var lastActiveFileResource;
                    if (_this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE]) {
                        lastActiveFileResource = uri_1.default.parse(_this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE]);
                    }
                    if (lastActiveFileResource && root && root.find(lastActiveFileResource)) {
                        var editorInput = _this.instantiationService.createInstance(fileEditorInput_1.FileEditorInput, lastActiveFileResource, void 0, void 0);
                        _this.openOrFocusEditor(editorInput).done(null, errors.onUnexpectedError);
                        return refreshPromise;
                    }
                    // Otherwise restore last used file: By Explorer selection
                    return refreshPromise.then(function () {
                        _this.openFocusedElement();
                    });
                }
            });
        };
        ExplorerView.prototype.openFocusedElement = function () {
            var stat = this.explorerViewer.getFocus();
            if (stat && !stat.isDirectory) {
                var editorInput = this.instantiationService.createInstance(fileEditorInput_1.FileEditorInput, stat.resource, stat.mime, void 0);
                this.openOrFocusEditor(editorInput).done(null, errors.onUnexpectedError);
                return true;
            }
            return false;
        };
        ExplorerView.prototype.openOrFocusEditor = function (input) {
            // First try to find if input already visible
            var editors = this.editorService.getVisibleEditors();
            if (editors) {
                for (var i = 0; i < editors.length; i++) {
                    var editor = editors[i];
                    if (input.matches(editor.input)) {
                        return this.editorService.focusEditor(editor);
                    }
                }
            }
            // Otherwise open in active slot
            return this.editorService.openEditor(input);
        };
        ExplorerView.prototype.getActiveEditorInputResource = function () {
            // Try with Editor Input
            var input = this.editorService.getActiveEditorInput();
            if (input && input instanceof fileEditorInput_1.FileEditorInput) {
                return input.getResource();
            }
            return null;
        };
        ExplorerView.prototype.getInput = function () {
            return this.explorerViewer ? this.explorerViewer.getInput() : null;
        };
        ExplorerView.prototype.createViewer = function (container) {
            var _this = this;
            var dataSource = this.instantiationService.createInstance(explorerViewer_1.FileDataSource);
            var renderer = this.instantiationService.createInstance(explorerViewer_1.FileRenderer, this.viewletState, this.actionRunner);
            var controller = this.instantiationService.createInstance(explorerViewer_1.FileController, this.viewletState);
            var sorter = new explorerViewer_1.FileSorter();
            this.filter = this.instantiationService.createInstance(explorerViewer_1.FileFilter);
            var dnd = this.instantiationService.createInstance(explorerViewer_1.FileDragAndDrop);
            this.explorerViewer = new treeImpl_1.Tree(container.getHTMLElement(), {
                dataSource: dataSource,
                renderer: renderer,
                controller: controller,
                sorter: sorter,
                filter: this.filter,
                dnd: dnd
            }, {
                autoExpandSingleChildren: true
            });
            this.toDispose.push(lifecycle.toDisposable(function () { return renderer.dispose(); }));
            // Update Viewer based on File Change Events
            this.toDispose.push(this.eventService.addListener2('files.internal:fileChanged', function (e) { return _this.onLocalFileChange(e); }));
            this.toDispose.push(this.eventService.addListener2(files_1.EventType.FILE_CHANGES, function (e) { return _this.onFileChanges(e); }));
            return this.explorerViewer;
        };
        ExplorerView.prototype.onLocalFileChange = function (e) {
            var _this = this;
            var modelElement;
            var parent;
            var parentResource;
            var parentElement;
            // Add
            if (e.gotAdded()) {
                var addedElement = e.getAfter();
                parentResource = uri_1.default.file(paths.dirname(addedElement.resource.fsPath));
                parentElement = this.getInput().find(parentResource);
                if (parentElement) {
                    // Add the new file to its parent (Model)
                    var childElement = explorerViewModel_1.FileStat.create(addedElement);
                    parentElement.addChild(childElement);
                    var refreshPromise = function () {
                        // Refresh the Parent (View)
                        return _this.explorerViewer.refresh(parentElement).then(function () {
                            return _this.reveal(childElement, 0.5).then(function () {
                                // Focus new element
                                _this.explorerViewer.setFocus(childElement);
                                // Open new file in editor
                                if (!childElement.isDirectory) {
                                    var editorInput = _this.instantiationService.createInstance(fileEditorInput_1.FileEditorInput, childElement.resource, childElement.mime, void 0);
                                    return _this.editorService.openEditor(editorInput);
                                }
                            });
                        });
                    };
                    // For file imports, use a delayer to not refresh too many times when multiple files are imported
                    if (e instanceof fileActions_1.FileImportedEvent) {
                        this.explorerImportDelayer.trigger(refreshPromise).done(null, errors.onUnexpectedError);
                    }
                    else {
                        refreshPromise().done(null, errors.onUnexpectedError);
                    }
                }
            }
            else if (e.gotMoved()) {
                var oldElement = e.getBefore();
                var newElement = e.getAfter();
                var oldParentResource = uri_1.default.file(paths.dirname(oldElement.resource.fsPath));
                var newParentResource = uri_1.default.file(paths.dirname(newElement.resource.fsPath));
                // Only update focus if renamed/moved element is selected
                var updateFocus = false;
                var focus_1 = this.explorerViewer.getFocus();
                if (focus_1 && focus_1.resource && focus_1.resource.toString() === oldElement.resource.toString()) {
                    updateFocus = true;
                }
                // Handle Rename
                if (oldParentResource && newParentResource && oldParentResource.toString() === newParentResource.toString()) {
                    modelElement = this.getInput().find(oldElement.resource);
                    if (modelElement) {
                        if (!modelElement.isDirectory && !modelElement.mime) {
                            return;
                        }
                        // Rename File (Model)
                        modelElement.rename(newElement);
                        // Update Parent (View)
                        parent = modelElement.parent;
                        if (parent) {
                            this.explorerViewer.refresh(parent).done(function () {
                                // Select in Viewer if set
                                if (updateFocus) {
                                    _this.explorerViewer.setFocus(modelElement);
                                }
                            }, errors.onUnexpectedError);
                        }
                    }
                }
                else if (oldParentResource && newParentResource) {
                    var oldParent = this.getInput().find(oldParentResource);
                    var newParent = this.getInput().find(newParentResource);
                    modelElement = this.getInput().find(oldElement.resource);
                    if (oldParent && newParent && modelElement) {
                        // Move in Model
                        modelElement.move(newParent, function (callback) {
                            // Update old parent
                            _this.explorerViewer.refresh(oldParent, true).done(callback, errors.onUnexpectedError);
                        }, function () {
                            // Update new parent
                            _this.explorerViewer.refresh(newParent, true).done(function () {
                                return _this.explorerViewer.expand(newParent);
                            }, errors.onUnexpectedError);
                        });
                    }
                }
            }
            else if (e.gotDeleted()) {
                var deletedElement = e.getBefore();
                modelElement = this.getInput().find(deletedElement.resource);
                if (modelElement && modelElement.parent) {
                    parent = modelElement.parent;
                    // Remove Element from Parent (Model)
                    parent.removeChild(modelElement);
                    // Refresh Parent (View)
                    this.explorerViewer.refresh(parent).done(function () {
                        // Ensure viewer has keyboard focus if event originates from viewer
                        _this.explorerViewer.DOMFocus();
                    }, errors.onUnexpectedError);
                }
            }
            else if (e instanceof fileActions_1.FileImportedEvent) {
                var importedElement = e.getAfter();
                parentResource = uri_1.default.file(paths.dirname(importedElement.resource.fsPath));
                parentElement = this.getInput().find(parentResource);
                if (parentElement) {
                    this.explorerViewer.refresh(parentElement).then(function () {
                        var editorInput = _this.instantiationService.createInstance(fileEditorInput_1.FileEditorInput, importedElement.resource, importedElement.mime, void 0);
                        return _this.editorService.openEditor(editorInput);
                    }).done(null, errors.onUnexpectedError);
                }
            }
            else if (this.workspace && e.gotUpdated() && e.getAfter().resource.toString() === this.workspace.resource.toString() && !this.explorerViewer.getHighlight()) {
                this.refreshFromEvent();
            }
        };
        ExplorerView.prototype.onFileChanges = function (e) {
            var _this = this;
            // Ensure memento state does not capture a deleted file
            var lastActiveResource = this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE];
            if (lastActiveResource && e.contains(uri_1.default.parse(lastActiveResource), files_1.FileChangeType.DELETED)) {
                this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE] = null;
            }
            // Check if an explorer refresh is necessary (delayed to give internal events a chance to react first)
            // Note: there is no guarantee when the internal events are fired vs real ones. Code has to deal with the fact that one might
            // be fired first over the other or not at all.
            winjs_base_1.Promise.timeout(ExplorerView.EXPLORER_FILE_CHANGES_REACT_DELAY).then(function () {
                if (!_this.shouldRefresh && _this.shouldRefreshFromEvent(e)) {
                    _this.refreshFromEvent();
                }
            });
        };
        ExplorerView.prototype.shouldRefreshFromEvent = function (e) {
            // Filter to the ones we care
            e = this.filterToAddRemovedOnWorkspacePath(e, function (event, segments) {
                if (segments[0] !== '.git') {
                    return true; // we like all things outside .git
                }
                return segments.length === 1; // we only care about the .git folder itself
            });
            // We only ever refresh from files/folders that got added or deleted
            if (e.gotAdded() || e.gotDeleted()) {
                var added = e.getAdded();
                var deleted = e.getDeleted();
                var root = this.getInput();
                if (!root) {
                    return false;
                }
                // Check added: Refresh if added file/folder is not part of resolved root and parent is part of it
                var ignoredPaths = {};
                for (var i = 0; i < added.length; i++) {
                    var change = added[i];
                    if (!this.contextService.isInsideWorkspace(change.resource)) {
                        continue; // out of workspace file
                    }
                    // Find parent
                    var parent_1 = paths.dirname(change.resource.fsPath);
                    // Continue if parent was already determined as to be ignored
                    if (ignoredPaths[parent_1]) {
                        continue;
                    }
                    // Compute if parent is visible and added file not yet part of it
                    var parentStat = root.find(uri_1.default.file(parent_1));
                    if (parentStat && parentStat.isDirectoryResolved && !root.find(change.resource)) {
                        return true;
                    }
                    // Keep track of path that can be ignored for faster lookup
                    if (!parentStat || !parentStat.isDirectoryResolved) {
                        ignoredPaths[parent_1] = true;
                    }
                }
                // Check deleted: Refresh if deleted file/folder part of resolved root
                for (var j = 0; j < deleted.length; j++) {
                    var del = deleted[j];
                    if (!this.contextService.isInsideWorkspace(del.resource)) {
                        continue; // out of workspace file
                    }
                    if (root.find(del.resource)) {
                        return true;
                    }
                }
            }
            return false;
        };
        ExplorerView.prototype.filterToAddRemovedOnWorkspacePath = function (e, fn) {
            var _this = this;
            return new files_1.FileChangesEvent(e.changes.filter(function (change) {
                if (change.type === files_1.FileChangeType.UPDATED) {
                    return false; // we only want added / removed
                }
                var workspacePath = _this.contextService.toWorkspaceRelativePath(change.resource);
                if (!workspacePath) {
                    return false; // not inside workspace
                }
                var segments = workspacePath.split(/\//);
                return fn(change, segments);
            }));
        };
        ExplorerView.prototype.refreshFromEvent = function () {
            var _this = this;
            if (this.isVisible) {
                this.explorerRefreshDelayer.trigger(function () {
                    if (!_this.explorerViewer.getHighlight()) {
                        return _this.refresh(false, false);
                    }
                    return winjs_base_1.Promise.as(null);
                }).done(null, errors.onUnexpectedError);
            }
            else {
                this.shouldRefresh = true;
            }
        };
        /**
         * Refresh the contents of the explorer to get up to date data from the disk about the file structure.
         *
         * @param focus if set to true, the explorer viewer will receive keyboard focus
         * @param reveal if set to true, the current active input will be revealed in the explorer
         */
        ExplorerView.prototype.refresh = function (focus, reveal, instantProgress) {
            var _this = this;
            var root = this.getInput();
            var targetsToResolve = [];
            var targetsToExpand = [];
            if (this.settings[ExplorerView.MEMENTO_EXPANDED_FOLDER_RESOURCES]) {
                targetsToExpand = this.settings[ExplorerView.MEMENTO_EXPANDED_FOLDER_RESOURCES].map(function (e) { return uri_1.default.parse(e); });
            }
            // First time refresh: Receive target through active editor input or selection and also include settings from previous session
            if (!root) {
                var activeResource = this.getActiveEditorInputResource();
                if (activeResource) {
                    targetsToResolve.push(activeResource);
                }
                if (targetsToExpand.length) {
                    targetsToResolve.push.apply(targetsToResolve, targetsToExpand);
                }
            }
            else {
                this.getResolvedDirectories(root, targetsToResolve);
            }
            // Determine the path to reveal if we are set to reveal
            var revealResource;
            if (reveal) {
                revealResource = this.getActiveEditorInputResource();
                if (!revealResource) {
                    var selection = this.explorerViewer.getSelection();
                    if (selection && selection.length === 1) {
                        revealResource = selection[0].resource;
                    }
                }
            }
            // Load Root Stat with given target path configured
            var options = { resolveTo: targetsToResolve };
            var promise = this.fileService.resolveFile(this.workspace.resource, options).then(function (stat) {
                var explorerPromise;
                // Convert to model
                var modelStat = explorerViewModel_1.FileStat.create(stat, options.resolveTo);
                // First time refresh: The stat becomes the input of the viewer
                if (!root) {
                    explorerPromise = _this.explorerViewer.setInput(modelStat).then(function () {
                        // Make sure to expand all folders that where expanded in the previous session
                        if (targetsToExpand) {
                            return _this.explorerViewer.expandAll(targetsToExpand.map(function (expand) { return _this.getInput().find(expand); }));
                        }
                        return winjs_base_1.Promise.as(null);
                    });
                }
                else {
                    explorerViewModel_1.FileStat.mergeLocalWithDisk(modelStat, root);
                    explorerPromise = _this.explorerViewer.refresh(root);
                }
                return explorerPromise.then(function () {
                    var revealPromise;
                    // Reveal if path is set
                    if (revealResource) {
                        revealPromise = _this.select(revealResource);
                    }
                    else {
                        revealPromise = winjs_base_1.Promise.as(null);
                    }
                    return revealPromise.then(function () {
                        // Focus if set
                        if (focus) {
                            _this.explorerViewer.DOMFocus();
                        }
                    });
                });
            }, function (e) { return winjs_base_1.Promise.wrapError(e); });
            this.progressService.showWhile(promise, instantProgress ? 0 : this.partService.isCreated() ? 800 : 3200 /* less ugly initial startup */);
            return promise;
        };
        /**
         * Given a stat, fills an array of path that make all folders below the stat that are resolved directories.
         */
        ExplorerView.prototype.getResolvedDirectories = function (stat, resolvedDirectories) {
            if (stat.isDirectoryResolved) {
                if (stat.resource.toString() !== this.workspace.resource.toString()) {
                    // Drop those path which are parents of the current one
                    for (var i = resolvedDirectories.length - 1; i >= 0; i--) {
                        var resource = resolvedDirectories[i];
                        if (stat.resource.toString().indexOf(resource.toString()) === 0) {
                            resolvedDirectories.splice(i);
                        }
                    }
                    // Add to the list of path to resolve
                    resolvedDirectories.push(stat.resource);
                }
                // Recurse into children
                for (var i = 0; i < stat.children.length; i++) {
                    var child = stat.children[i];
                    this.getResolvedDirectories(child, resolvedDirectories);
                }
            }
        };
        /**
         * Selects and reveal the file element provided by the given resource if its found in the explorer. Will try to
         * resolve the path from the disk in case the explorer is not yet expanded to the file yet.
         */
        ExplorerView.prototype.select = function (resource, reveal) {
            var _this = this;
            if (reveal === void 0) { reveal = true; }
            // Require valid path
            if (!resource || resource.toString() === this.workspace.resource.toString()) {
                return winjs_base_1.Promise.as(null);
            }
            // If path already selected, just reveal and return
            var currentSelection = this.explorerViewer.getSelection();
            for (var i = 0; i < currentSelection.length; i++) {
                if (currentSelection[i].resource.toString() === resource.toString()) {
                    return reveal ? this.reveal(currentSelection[i], 0.5) : winjs_base_1.Promise.as(null);
                }
            }
            // First try to get the stat object from the input to avoid a roundtrip
            var root = this.getInput();
            if (!root) {
                return winjs_base_1.Promise.as(null);
            }
            var fileStat = root.find(resource);
            if (fileStat) {
                return this.doRevealAndSelect(fileStat);
            }
            // Stat needs to be resolved first and then revealed
            var options = { resolveTo: [resource] };
            return this.fileService.resolveFile(this.workspace.resource, options).then(function (stat) {
                // Convert to model
                var modelStat = explorerViewModel_1.FileStat.create(stat, options.resolveTo);
                // Update Input with disk Stat
                explorerViewModel_1.FileStat.mergeLocalWithDisk(modelStat, root);
                // Select and Reveal
                return _this.explorerViewer.refresh(root).then(function () {
                    return _this.doRevealAndSelect(root.find(resource));
                });
            }, function (e) { return _this.messageService.show(message_1.Severity.Error, e); });
        };
        ExplorerView.prototype.doRevealAndSelect = function (fileStat) {
            var _this = this;
            if (!fileStat) {
                return winjs_base_1.Promise.as(null);
            }
            // Special case: we are asked to reveal and select an element that is not visible
            // In this case we take the parent element so that we are at least close to it.
            if (!this.filter.isVisible(this.tree, fileStat)) {
                fileStat = fileStat.parent;
                if (!fileStat) {
                    return winjs_base_1.Promise.as(null);
                }
            }
            return this.reveal(fileStat, 0.5).then(function () {
                if (!fileStat.isDirectory) {
                    _this.explorerViewer.setSelection([fileStat]); // Since folders can not be opened, only select files
                }
                _this.explorerViewer.setFocus(fileStat);
            });
        };
        ExplorerView.prototype.shutdown = function () {
            var _this = this;
            // Keep list of expanded folders to restore on next load
            var root = this.getInput();
            if (root) {
                var expanded = this.explorerViewer.getExpandedElements()
                    .filter(function (e) { return e.resource.toString() !== _this.workspace.resource.toString(); })
                    .map(function (e) { return e.resource.toString(); });
                this.settings[ExplorerView.MEMENTO_EXPANDED_FOLDER_RESOURCES] = expanded;
            }
            _super.prototype.shutdown.call(this);
        };
        ExplorerView.prototype.dispose = function () {
            if (this.toolBar) {
                this.toolBar.dispose();
            }
            _super.prototype.dispose.call(this);
        };
        ExplorerView.EXPLORER_FILE_CHANGES_REACT_DELAY = 500; // delay in ms to react to file changes to give our internal events a chance to react first
        ExplorerView.EXPLORER_FILE_CHANGES_REFRESH_DELAY = 100; // delay in ms to refresh the explorer from disk file changes
        ExplorerView.EXPLORER_IMPORT_REFRESH_DELAY = 300; // delay in ms to refresh the explorer from imports
        ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE = 'explorer.memento.lastActiveFileResource';
        ExplorerView.MEMENTO_EXPANDED_FOLDER_RESOURCES = 'explorer.memento.expandedFolderResources';
        ExplorerView = __decorate([
            __param(3, message_1.IMessageService),
            __param(4, contextView_1.IContextMenuService),
            __param(5, instantiation_1.IInstantiationService),
            __param(6, event_1.IEventService),
            __param(7, storage_1.IStorageService),
            __param(8, workspace_1.IWorkspaceContextService),
            __param(9, progress_1.IProgressService),
            __param(10, editorService_1.IWorkbenchEditorService),
            __param(11, files_1.IFileService),
            __param(12, partService_1.IPartService),
            __param(13, configuration_1.IConfigurationService)
        ], ExplorerView);
        return ExplorerView;
    })(viewlet_1.CollapsibleViewletView);
    exports.ExplorerView = ExplorerView;
});
//# sourceMappingURL=explorerView.js.map