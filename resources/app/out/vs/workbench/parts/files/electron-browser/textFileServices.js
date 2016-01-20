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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/platform/platform', 'vs/editor/common/modes/modesRegistry', 'vs/base/common/paths', 'vs/base/common/strings', 'vs/base/common/platform', 'vs/base/common/uri', 'vs/platform/event/common/event', 'vs/workbench/parts/files/browser/textFileServices', 'vs/workbench/parts/files/common/editors/textFileEditorModel', 'vs/workbench/parts/files/common/files', 'vs/workbench/services/untitled/common/untitledEditorService', 'vs/platform/files/common/files', 'vs/platform/instantiation/common/instantiation', 'vs/workbench/services/workspace/common/contextService', 'vs/platform/lifecycle/common/lifecycle', 'vs/platform/telemetry/common/telemetry', 'vs/platform/configuration/common/configuration', 'electron'], function (require, exports, nls, winjs_base_1, platform_1, modesRegistry_1, paths, strings, platform_2, uri_1, event_1, textFileServices_1, textFileEditorModel_1, files_1, untitledEditorService_1, files_2, instantiation_1, contextService_1, lifecycle_1, telemetry_1, configuration_1, electron_1) {
    var TextFileService = (function (_super) {
        __extends(TextFileService, _super);
        function TextFileService(contextService, instantiationService, fileService, untitledEditorService, lifecycleService, telemetryService, configurationService, eventService) {
            _super.call(this, contextService, instantiationService, configurationService, telemetryService, lifecycleService, eventService);
            this.fileService = fileService;
            this.untitledEditorService = untitledEditorService;
            this.init();
        }
        TextFileService.prototype.beforeShutdown = function () {
            var _this = this;
            _super.prototype.beforeShutdown.call(this);
            // Dirty files need treatment on shutdown
            if (this.getDirty().length) {
                // If auto save is enabled, save all files and then check again for dirty files
                if (this.isAutoSaveEnabled()) {
                    return this.saveAll(false /* files only */).then(function () {
                        if (_this.getDirty().length) {
                            return _this.confirmBeforeShutdown(); // we still have dirty files around, so confirm normally
                        }
                        return false; // all good, no veto
                    });
                }
                // Otherwise just confirm what to do
                return this.confirmBeforeShutdown();
            }
            return false; // no veto
        };
        TextFileService.prototype.confirmBeforeShutdown = function () {
            var confirm = this.confirmSave();
            // Save
            if (confirm === files_1.ConfirmResult.SAVE) {
                return this.saveAll(true /* includeUntitled */).then(function (result) {
                    if (result.results.some(function (r) { return !r.success; })) {
                        return true; // veto if some saves failed
                    }
                    return false; // no veto
                });
            }
            else if (confirm === files_1.ConfirmResult.DONT_SAVE) {
                return false; // no veto
            }
            else if (confirm === files_1.ConfirmResult.CANCEL) {
                return true; // veto
            }
        };
        TextFileService.prototype.revertAll = function (resources, force) {
            var _this = this;
            // Revert files
            return _super.prototype.revertAll.call(this, resources, force).then(function (r) {
                // Revert untitled
                var untitledInputs = _this.untitledEditorService.getAll(resources);
                untitledInputs.forEach(function (input) {
                    if (input) {
                        input.dispose();
                        r.results.push({
                            source: input.getResource(),
                            success: true
                        });
                    }
                });
                return r;
            });
        };
        TextFileService.prototype.getDirty = function (resource) {
            // Collect files
            var dirty = _super.prototype.getDirty.call(this, resource);
            // Add untitled ones
            if (!resource) {
                dirty.push.apply(dirty, this.untitledEditorService.getDirty());
            }
            else {
                var input = this.untitledEditorService.get(resource);
                if (input && input.isDirty()) {
                    dirty.push(input.getResource());
                }
            }
            return dirty;
        };
        TextFileService.prototype.isDirty = function (resource) {
            if (_super.prototype.isDirty.call(this, resource)) {
                return true;
            }
            return this.untitledEditorService.getDirty().some(function (dirty) { return !resource || dirty.toString() === resource.toString(); });
        };
        TextFileService.prototype.confirmSave = function (resource) {
            if (!!this.contextService.getConfiguration().env.pluginDevelopmentPath) {
                return files_1.ConfirmResult.DONT_SAVE; // no veto when we are in plugin dev mode because we cannot assum we run interactive (e.g. tests)
            }
            var resourcesToConfirm = this.getDirty(resource);
            if (resourcesToConfirm.length === 0) {
                return files_1.ConfirmResult.DONT_SAVE;
            }
            var message = [
                resourcesToConfirm.length === 1 ? nls.localize('saveChangesMessage', "Do you want to save the changes you made to {0}?", paths.basename(resourcesToConfirm[0].fsPath)) : nls.localize('saveChangesMessages', "Do you want to save the changes to the following files?")
            ];
            if (resourcesToConfirm.length > 1) {
                message.push('');
                message.push.apply(message, resourcesToConfirm.map(function (r) { return paths.basename(r.fsPath); }));
                message.push('');
            }
            // Button order
            // Windows: Save | Don't Save | Cancel
            // Mac/Linux: Save | Cancel | Don't
            var save = { label: resourcesToConfirm.length > 1 ? this.mnemonicLabel(nls.localize('saveAll', "&&Save All")) : this.mnemonicLabel(nls.localize('save', "&&Save")), result: files_1.ConfirmResult.SAVE };
            var dontSave = { label: this.mnemonicLabel(nls.localize('dontSave', "Do&&n't Save")), result: files_1.ConfirmResult.DONT_SAVE };
            var cancel = { label: nls.localize('cancel', "Cancel"), result: files_1.ConfirmResult.CANCEL };
            var buttons = [save];
            if (platform_2.isWindows) {
                buttons.push(dontSave, cancel);
            }
            else {
                buttons.push(cancel, dontSave);
            }
            var opts = {
                title: this.contextService.getConfiguration().env.appName,
                message: message.join('\n'),
                type: 'warning',
                detail: nls.localize('saveChangesDetail', "Your changes will be lost if you don't save them."),
                buttons: buttons.map(function (b) { return b.label; }),
                noLink: true,
                cancelId: buttons.indexOf(cancel)
            };
            var choice = electron_1.remote.dialog.showMessageBox(electron_1.remote.getCurrentWindow(), opts);
            return buttons[choice].result;
        };
        TextFileService.prototype.mnemonicLabel = function (label) {
            if (!platform_2.isWindows) {
                return label.replace(/&&/g, ''); // no mnemonic support on mac/linux in buttons yet
            }
            return label.replace(/&&/g, '&');
        };
        TextFileService.prototype.saveAll = function (arg1) {
            var _this = this;
            // get all dirty
            var toSave = [];
            if (Array.isArray(arg1)) {
                arg1.forEach(function (r) {
                    toSave.push.apply(toSave, _this.getDirty(r));
                });
            }
            else {
                toSave = this.getDirty();
            }
            // split up between files and untitled
            var filesToSave = [];
            var untitledToSave = [];
            toSave.forEach(function (s) {
                if (s.scheme === 'file') {
                    filesToSave.push(s);
                }
                else if ((Array.isArray(arg1) || arg1 === true /* includeUntitled */) && s.scheme === 'untitled') {
                    untitledToSave.push(s);
                }
            });
            return this.doSaveAll(filesToSave, untitledToSave);
        };
        TextFileService.prototype.doSaveAll = function (fileResources, untitledResources) {
            var _this = this;
            // Preflight for untitled to handle cancellation from the dialog
            var targetsForUntitled = [];
            for (var i = 0; i < untitledResources.length; i++) {
                var untitled = this.untitledEditorService.get(untitledResources[i]);
                if (untitled) {
                    var targetPath = void 0;
                    // Untitled with associated file path don't need to prompt
                    if (this.untitledEditorService.hasAssociatedFilePath(untitled.getResource())) {
                        targetPath = untitled.getResource().fsPath;
                    }
                    else {
                        targetPath = this.promptForPathSync(this.suggestFileName(untitledResources[i]));
                        if (!targetPath) {
                            return winjs_base_1.Promise.as({
                                results: fileResources.concat(untitledResources).map(function (r) {
                                    return {
                                        source: r
                                    };
                                })
                            });
                        }
                    }
                    targetsForUntitled.push(uri_1.default.file(targetPath));
                }
            }
            // Handle files
            return _super.prototype.saveAll.call(this, fileResources).then(function (result) {
                // Handle untitled
                var untitledSaveAsPromises = [];
                targetsForUntitled.forEach(function (target, index) {
                    var untitledSaveAsPromise = _this.saveAs(untitledResources[index], target).then(function (uri) {
                        result.results.push({
                            source: untitledResources[index],
                            target: uri,
                            success: !!uri
                        });
                    });
                    untitledSaveAsPromises.push(untitledSaveAsPromise);
                });
                return winjs_base_1.Promise.join(untitledSaveAsPromises).then(function () {
                    return result;
                });
            });
        };
        TextFileService.prototype.saveAs = function (resource, target) {
            var _this = this;
            // Get to target resource
            var targetPromise;
            if (target) {
                targetPromise = winjs_base_1.Promise.as(target);
            }
            else {
                var dialogPath = resource.fsPath;
                if (resource.scheme === 'untitled') {
                    dialogPath = this.suggestFileName(resource);
                }
                targetPromise = this.promptForPathAsync(dialogPath).then(function (path) { return path ? uri_1.default.file(path) : null; });
            }
            return targetPromise.then(function (target) {
                if (!target) {
                    return null; // user canceled
                }
                // Just save if target is same as models own resource
                if (resource.toString() === target.toString()) {
                    return _this.save(resource).then(function () { return resource; });
                }
                // Do it
                return _this.doSaveAs(resource, target);
            });
        };
        TextFileService.prototype.doSaveAs = function (resource, target) {
            var _this = this;
            // Retrieve text model from provided resource if any
            var modelPromise = winjs_base_1.TPromise.as(null);
            if (resource.scheme === 'file') {
                modelPromise = winjs_base_1.TPromise.as(textFileEditorModel_1.CACHE.get(resource));
            }
            else if (resource.scheme === 'untitled') {
                var untitled = this.untitledEditorService.get(resource);
                if (untitled) {
                    modelPromise = untitled.resolve();
                }
            }
            return modelPromise.then(function (model) {
                // We have a model: Use it (can be null e.g. if this file is binary and not a text file or was never opened before)
                if (model) {
                    return _this.fileService.updateContent(target, model.getValue(), { charset: model.getEncoding() });
                }
                // Otherwise we can only copy
                return _this.fileService.copyFile(resource, target);
            }).then(function () {
                // Add target to working files because this is an operation that indicates activity
                _this.getWorkingFilesModel().addEntry(target);
                // Revert the source
                return _this.revert(resource).then(function () {
                    // Done: return target
                    return target;
                });
            });
        };
        TextFileService.prototype.suggestFileName = function (untitledResource) {
            var workspace = this.contextService.getWorkspace();
            if (workspace) {
                return uri_1.default.file(paths.join(workspace.resource.fsPath, this.untitledEditorService.get(untitledResource).suggestFileName())).fsPath;
            }
            return this.untitledEditorService.get(untitledResource).suggestFileName();
        };
        TextFileService.prototype.promptForPathAsync = function (defaultPath) {
            var _this = this;
            return new winjs_base_1.TPromise(function (c, e) {
                electron_1.remote.dialog.showSaveDialog(electron_1.remote.getCurrentWindow(), _this.getSaveDialogOptions(defaultPath ? paths.normalize(defaultPath, true) : void 0), function (path) {
                    c(path);
                });
            });
        };
        TextFileService.prototype.promptForPathSync = function (defaultPath) {
            return electron_1.remote.dialog.showSaveDialog(electron_1.remote.getCurrentWindow(), this.getSaveDialogOptions(defaultPath ? paths.normalize(defaultPath, true) : void 0));
        };
        TextFileService.prototype.getSaveDialogOptions = function (defaultPath) {
            var options = {
                defaultPath: defaultPath
            };
            // Filters are working flaky in Electron and there are bugs. On Windows they are working
            // somewhat but we see issues:
            // - https://github.com/atom/electron/issues/3556
            // - https://github.com/Microsoft/vscode/issues/451
            // - Bug on Windows: When "All Files" is picked, the path gets an extra ".*"
            // Until these issues are resolved, we disable the dialog file extension filtering.
            if (true) {
                return options;
            }
            ;
            // Build the file filter by using our known languages
            var ext = paths.extname(defaultPath);
            var matchingFilter;
            var modesRegistry = platform_1.Registry.as(modesRegistry_1.Extensions.EditorModes);
            var filters = modesRegistry.getRegisteredLanguageNames().map(function (languageName) {
                var extensions = modesRegistry.getExtensions(languageName);
                if (!extensions || !extensions.length) {
                    return null;
                }
                var filter = { name: languageName, extensions: extensions.map(function (e) { return strings.trim(e, '.'); }) };
                if (ext && extensions.indexOf(ext) >= 0) {
                    matchingFilter = filter;
                    return null; // matching filter will be added last to the top
                }
                return filter;
            }).filter(function (f) { return !!f; });
            // Filters are a bit weird on Windows, based on having a match or not:
            // Match: we put the matching filter first so that it shows up selected and the all files last
            // No match: we put the all files filter first
            var allFilesFilter = { name: nls.localize('allFiles', "All Files"), extensions: ['*'] };
            if (matchingFilter) {
                filters.unshift(matchingFilter);
                filters.push(allFilesFilter);
            }
            else {
                filters.unshift(allFilesFilter);
            }
            options.filters = filters;
            return options;
        };
        TextFileService = __decorate([
            __param(0, contextService_1.IWorkspaceContextService),
            __param(1, instantiation_1.IInstantiationService),
            __param(2, files_2.IFileService),
            __param(3, untitledEditorService_1.IUntitledEditorService),
            __param(4, lifecycle_1.ILifecycleService),
            __param(5, telemetry_1.ITelemetryService),
            __param(6, configuration_1.IConfigurationService),
            __param(7, event_1.IEventService)
        ], TextFileService);
        return TextFileService;
    })(textFileServices_1.TextFileService);
    exports.TextFileService = TextFileService;
});
//# sourceMappingURL=textFileServices.js.map