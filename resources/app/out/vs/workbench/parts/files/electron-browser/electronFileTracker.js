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
define(["require", "exports", 'vs/workbench/parts/files/common/files', 'vs/platform/files/common/files', 'vs/workbench/parts/files/browser/fileActions', 'vs/base/common/platform', 'vs/base/common/errors', 'vs/base/common/uri', 'vs/workbench/common/events', 'vs/workbench/services/untitled/common/untitledEditorService', 'vs/workbench/services/part/common/partService', 'vs/workbench/services/workspace/common/contextService', 'vs/platform/event/common/event', 'vs/platform/instantiation/common/instantiation', 'vs/platform/lifecycle/common/lifecycle', 'electron'], function (require, exports, files_1, files_2, fileActions_1, plat, errors, uri_1, events_1, untitledEditorService_1, partService_1, contextService_1, event_1, instantiation_1, lifecycle_1, electron_1) {
    // This extension decorates the window as dirty when auto save is disabled and a file is dirty (mac only) and handles opening of files in the instance.
    var FileTracker = (function () {
        function FileTracker(contextService, eventService, partService, fileService, textFileService, instantiationService, untitledEditorService, lifecycleService) {
            this.contextService = contextService;
            this.eventService = eventService;
            this.partService = partService;
            this.fileService = fileService;
            this.textFileService = textFileService;
            this.instantiationService = instantiationService;
            this.untitledEditorService = untitledEditorService;
            this.lifecycleService = lifecycleService;
            this.toUnbind = [];
            this.isDocumentedEdited = false;
            this.activeOutOfWorkspaceWatchers = Object.create(null);
            // Make sure to reset any previous state
            if (plat.platform === plat.Platform.Mac) {
                var win = electron_1.remote.getCurrentWindow();
                win.setDocumentEdited(false);
            }
            this.registerListeners();
            // Listen to out of workspace file changes
            this.updateOutOfWorkspaceFileListeners({ added: this.textFileService.getWorkingFilesModel().getEntries() });
        }
        FileTracker.prototype.registerListeners = function () {
            var _this = this;
            // Local text file changes
            this.toUnbind.push(this.eventService.addListener(events_1.EventType.UNTITLED_FILE_DELETED, function () { return _this.onUntitledDeletedEvent(); }));
            this.toUnbind.push(this.eventService.addListener(events_1.EventType.UNTITLED_FILE_DIRTY, function () { return _this.onUntitledDirtyEvent(); }));
            this.toUnbind.push(this.eventService.addListener(files_1.EventType.FILE_DIRTY, function (e) { return _this.onTextFileDirty(e); }));
            this.toUnbind.push(this.eventService.addListener(files_1.EventType.FILE_SAVED, function (e) { return _this.onTextFileSaved(e); }));
            this.toUnbind.push(this.eventService.addListener(files_1.EventType.FILE_SAVE_ERROR, function (e) { return _this.onTextFileSaveError(e); }));
            this.toUnbind.push(this.eventService.addListener(files_1.EventType.FILE_REVERTED, function (e) { return _this.onTextFileReverted(e); }));
            // Working Files Model Change
            var disposable = this.textFileService.getWorkingFilesModel().onModelChange(this.onWorkingFilesModelChange, this);
            this.toUnbind.push(function () { return disposable.dispose(); });
            // Support openFiles event for existing and new files
            electron_1.ipcRenderer.on('vscode:openFiles', function (event, request) {
                var inputs = [];
                if (request.filesToOpen) {
                    inputs.push.apply(inputs, _this.toInputs(request.filesToOpen, false));
                }
                if (request.filesToCreate) {
                    inputs.push.apply(inputs, _this.toInputs(request.filesToCreate, true));
                }
                if (inputs.length) {
                    var action = _this.instantiationService.createInstance(fileActions_1.OpenResourcesAction, inputs);
                    action.run().done(null, errors.onUnexpectedError);
                    action.dispose();
                }
            });
            this.lifecycleService.onShutdown(this.dispose, this);
        };
        FileTracker.prototype.toInputs = function (paths, isNew) {
            var _this = this;
            return paths.map(function (p) {
                var input = {
                    resource: isNew ? _this.untitledEditorService.createOrGet(uri_1.default.file(p.filePath)).getResource() : uri_1.default.file(p.filePath)
                };
                if (!isNew && p.lineNumber) {
                    input.options = {
                        selection: {
                            startLineNumber: p.lineNumber,
                            startColumn: p.columnNumber
                        }
                    };
                }
                return input;
            });
        };
        FileTracker.prototype.updateOutOfWorkspaceFileListeners = function (event) {
            var _this = this;
            var added = event.added ? event.added.map(function (e) { return e.resource; }).filter(function (r) { return r.scheme === 'file' && !_this.contextService.isInsideWorkspace(r); }) : [];
            var removed = event.removed ? event.removed.map(function (e) { return e.resource; }).filter(function (r) { return r.scheme === 'file' && !_this.contextService.isInsideWorkspace(r); }) : [];
            // Handle added
            added.forEach(function (resource) {
                if (!_this.activeOutOfWorkspaceWatchers[resource.toString()]) {
                    _this.fileService.watchFileChanges(resource);
                    _this.activeOutOfWorkspaceWatchers[resource.toString()] = true;
                }
            });
            // Handle removed
            removed.forEach(function (resource) {
                if (_this.activeOutOfWorkspaceWatchers[resource.toString()]) {
                    _this.fileService.unwatchFileChanges(resource);
                    delete _this.activeOutOfWorkspaceWatchers[resource.toString()];
                }
            });
        };
        FileTracker.prototype.onWorkingFilesModelChange = function (event) {
            this.updateOutOfWorkspaceFileListeners(event);
        };
        FileTracker.prototype.onUntitledDirtyEvent = function () {
            if (!this.isDocumentedEdited) {
                this.updateDocumentEdited();
            }
        };
        FileTracker.prototype.onUntitledDeletedEvent = function () {
            if (this.isDocumentedEdited) {
                this.updateDocumentEdited();
            }
        };
        FileTracker.prototype.onTextFileDirty = function (e) {
            if (!this.textFileService.isAutoSaveEnabled() && !this.isDocumentedEdited) {
                this.updateDocumentEdited(); // no indication needed when auto save is turned off and we didn't show dirty
            }
        };
        FileTracker.prototype.onTextFileSaved = function (e) {
            if (this.isDocumentedEdited) {
                this.updateDocumentEdited();
            }
        };
        FileTracker.prototype.onTextFileSaveError = function (e) {
            if (!this.isDocumentedEdited) {
                this.updateDocumentEdited();
            }
        };
        FileTracker.prototype.onTextFileReverted = function (e) {
            if (this.isDocumentedEdited) {
                this.updateDocumentEdited();
            }
        };
        FileTracker.prototype.updateDocumentEdited = function () {
            if (plat.platform === plat.Platform.Mac) {
                var win = electron_1.remote.getCurrentWindow();
                var isDirtyIndicated = win.isDocumentEdited();
                var hasDirtyFiles = this.textFileService.isDirty();
                this.isDocumentedEdited = hasDirtyFiles;
                if (hasDirtyFiles !== isDirtyIndicated) {
                    win.setDocumentEdited(hasDirtyFiles);
                }
            }
        };
        FileTracker.prototype.getId = function () {
            return 'vs.files.electronFileTracker';
        };
        FileTracker.prototype.dispose = function () {
            while (this.toUnbind.length) {
                this.toUnbind.pop()();
            }
            // Dispose watchers if any
            for (var key in this.activeOutOfWorkspaceWatchers) {
                this.fileService.unwatchFileChanges(key);
            }
            this.activeOutOfWorkspaceWatchers = Object.create(null);
        };
        FileTracker = __decorate([
            __param(0, contextService_1.IWorkspaceContextService),
            __param(1, event_1.IEventService),
            __param(2, partService_1.IPartService),
            __param(3, files_2.IFileService),
            __param(4, files_1.ITextFileService),
            __param(5, instantiation_1.IInstantiationService),
            __param(6, untitledEditorService_1.IUntitledEditorService),
            __param(7, lifecycle_1.ILifecycleService)
        ], FileTracker);
        return FileTracker;
    })();
    exports.FileTracker = FileTracker;
});
//# sourceMappingURL=electronFileTracker.js.map