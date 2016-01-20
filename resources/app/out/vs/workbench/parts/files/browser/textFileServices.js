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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/errors', 'vs/base/common/event', 'vs/workbench/parts/files/browser/editors/fileEditorInput', 'vs/workbench/parts/files/common/editors/textFileEditorModel', 'vs/workbench/parts/files/common/files', 'vs/workbench/common/events', 'vs/workbench/parts/files/common/workingFilesModel', 'vs/workbench/services/workspace/common/contextService', 'vs/platform/files/common/files', 'vs/platform/instantiation/common/instantiation', 'vs/platform/lifecycle/common/lifecycle', 'vs/platform/event/common/event', 'vs/platform/configuration/common/configuration', 'vs/platform/telemetry/common/telemetry'], function (require, exports, winjs_base_1, errors, event_1, fileEditorInput_1, textFileEditorModel_1, files_1, events_1, workingFilesModel_1, contextService_1, files_2, instantiation_1, lifecycle_1, event_2, configuration_1, telemetry_1) {
    /**
     * The workbench file service implementation implements the raw file service spec and adds additional methods on top.
     *
     * It also adds diagnostics and logging around file system operations.
     */
    var TextFileService = (function () {
        function TextFileService(contextService, instantiationService, configurationService, telemetryService, lifecycleService, eventService) {
            this.contextService = contextService;
            this.instantiationService = instantiationService;
            this.configurationService = configurationService;
            this.telemetryService = telemetryService;
            this.lifecycleService = lifecycleService;
            this.eventService = eventService;
            this.serviceId = files_1.ITextFileService;
            this.listenerToUnbind = [];
            this._onAutoSaveConfigurationChange = new event_1.Emitter();
        }
        TextFileService.prototype.init = function () {
            this.registerListeners();
            this.loadConfiguration();
        };
        Object.defineProperty(TextFileService.prototype, "onAutoSaveConfigurationChange", {
            get: function () {
                return this._onAutoSaveConfigurationChange.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextFileService.prototype, "workingFilesModel", {
            get: function () {
                if (!this._workingFilesModel) {
                    this._workingFilesModel = this.instantiationService.createInstance(workingFilesModel_1.WorkingFilesModel);
                }
                return this._workingFilesModel;
            },
            enumerable: true,
            configurable: true
        });
        TextFileService.prototype.registerListeners = function () {
            var _this = this;
            // Lifecycle
            this.lifecycleService.addBeforeShutdownParticipant(this);
            this.lifecycleService.onShutdown(this.dispose, this);
            // Configuration changes
            this.listenerToUnbind.push(this.configurationService.addListener(configuration_1.ConfigurationServiceEventTypes.UPDATED, function (e) { return _this.onConfigurationChange(e.config); }));
            // Editor focus change
            window.addEventListener('blur', function () { return _this.onEditorFocusChange(); }, true);
            this.listenerToUnbind.push(this.eventService.addListener(events_1.EventType.EDITOR_INPUT_CHANGED, function () { return _this.onEditorFocusChange(); }));
        };
        TextFileService.prototype.onEditorFocusChange = function () {
            if (this.configuredAutoSaveOnFocusChange && this.getDirty().length) {
                this.saveAll().done(null, errors.onUnexpectedError); // save dirty files when we change focus in the editor area
            }
        };
        TextFileService.prototype.loadConfiguration = function () {
            var _this = this;
            this.configurationService.loadConfiguration().done(function (configuration) {
                _this.onConfigurationChange(configuration);
                // we want to find out about this setting from telemetry
                _this.telemetryService.publicLog('autoSave', _this.getAutoSaveConfiguration());
            }, errors.onUnexpectedError);
        };
        TextFileService.prototype.onConfigurationChange = function (configuration) {
            var wasAutoSaveEnabled = this.isAutoSaveEnabled();
            this.configuredAutoSaveDelay = configuration && configuration.files && configuration.files.autoSaveDelay;
            this.configuredAutoSaveOnFocusChange = configuration && configuration.files && configuration.files.autoSaveFocusChange;
            // Emit as event
            this._onAutoSaveConfigurationChange.fire(this.getAutoSaveConfiguration());
            // save all dirty when enabling auto save
            if (!wasAutoSaveEnabled && this.isAutoSaveEnabled()) {
                this.saveAll().done(null, errors.onUnexpectedError);
            }
        };
        TextFileService.prototype.getDirty = function (resource) {
            return this.getDirtyFileModels(resource).map(function (m) { return m.getResource(); });
        };
        TextFileService.prototype.isDirty = function (resource) {
            return textFileEditorModel_1.CACHE
                .getAll(resource)
                .some(function (model) { return model.isDirty(); });
        };
        TextFileService.prototype.save = function (resource) {
            return this.saveAll([resource]).then(function (result) { return result.results.length === 1 && result.results[0].success; });
        };
        TextFileService.prototype.saveAll = function (arg1 /* URI[] */) {
            var dirtyFileModels = this.getDirtyFileModels(Array.isArray(arg1) ? arg1 : void 0 /* Save All */);
            var mapResourceToResult = Object.create(null);
            dirtyFileModels.forEach(function (m) {
                mapResourceToResult[m.getResource().toString()] = {
                    source: m.getResource()
                };
            });
            return winjs_base_1.Promise.join(dirtyFileModels.map(function (model) {
                return model.save().then(function () {
                    if (!model.isDirty()) {
                        mapResourceToResult[model.getResource().toString()].success = true;
                    }
                });
            })).then(function (r) {
                return {
                    results: Object.keys(mapResourceToResult).map(function (k) { return mapResourceToResult[k]; })
                };
            });
        };
        TextFileService.prototype.getFileModels = function (arg1) {
            var _this = this;
            if (Array.isArray(arg1)) {
                var models = [];
                arg1.forEach(function (resource) {
                    models.push.apply(models, _this.getFileModels(resource));
                });
                return models;
            }
            return textFileEditorModel_1.CACHE.getAll(arg1);
        };
        TextFileService.prototype.getDirtyFileModels = function (arg1) {
            return this.getFileModels(arg1).filter(function (model) { return model.isDirty(); });
        };
        TextFileService.prototype.confirmSave = function (resource) {
            throw new Error('Unsupported');
        };
        TextFileService.prototype.revert = function (resource, force) {
            return this.revertAll([resource], force).then(function (result) { return result.results.length === 1 && result.results[0].success; });
        };
        TextFileService.prototype.revertAll = function (resources, force) {
            var _this = this;
            var fileModels = force ? this.getFileModels(resources) : this.getDirtyFileModels(resources);
            var mapResourceToResult = Object.create(null);
            fileModels.forEach(function (m) {
                mapResourceToResult[m.getResource().toString()] = {
                    source: m.getResource()
                };
            });
            return winjs_base_1.Promise.join(fileModels.map(function (model) {
                return model.revert().then(function () {
                    if (!model.isDirty()) {
                        mapResourceToResult[model.getResource().toString()].success = true;
                    }
                }, function (error) {
                    // FileNotFound means the file got deleted meanwhile, so dispose this model
                    if (error.fileOperationResult === files_2.FileOperationResult.FILE_NOT_FOUND) {
                        var clients = fileEditorInput_1.FileEditorInput.getAll(model.getResource());
                        clients.forEach(function (input) { return input.dispose(true); });
                        // also make sure to have it removed from any working files
                        _this.workingFilesModel.removeEntry(model.getResource());
                        // store as successful revert
                        mapResourceToResult[model.getResource().toString()].success = true;
                    }
                    else {
                        return winjs_base_1.Promise.wrapError(error);
                    }
                });
            })).then(function (r) {
                return {
                    results: Object.keys(mapResourceToResult).map(function (k) { return mapResourceToResult[k]; })
                };
            });
        };
        TextFileService.prototype.beforeShutdown = function () {
            // Propagate to working files model
            this.workingFilesModel.shutdown();
            return false; // no veto
        };
        TextFileService.prototype.getWorkingFilesModel = function () {
            return this.workingFilesModel;
        };
        TextFileService.prototype.isAutoSaveEnabled = function () {
            return this.configuredAutoSaveDelay && this.configuredAutoSaveDelay > 0 || this.configuredAutoSaveOnFocusChange;
        };
        TextFileService.prototype.getAutoSaveConfiguration = function () {
            return {
                autoSaveDelay: this.configuredAutoSaveDelay && this.configuredAutoSaveDelay > 0 ? this.configuredAutoSaveDelay : void 0,
                autoSaveFocusChange: this.configuredAutoSaveOnFocusChange
            };
        };
        TextFileService.prototype.dispose = function () {
            while (this.listenerToUnbind.length) {
                this.listenerToUnbind.pop()();
            }
            this.workingFilesModel.dispose();
            // Clear all caches
            textFileEditorModel_1.CACHE.clear();
        };
        TextFileService = __decorate([
            __param(0, contextService_1.IWorkspaceContextService),
            __param(1, instantiation_1.IInstantiationService),
            __param(2, configuration_1.IConfigurationService),
            __param(3, telemetry_1.ITelemetryService),
            __param(4, lifecycle_1.ILifecycleService),
            __param(5, event_2.IEventService)
        ], TextFileService);
        return TextFileService;
    })();
    exports.TextFileService = TextFileService;
});
//# sourceMappingURL=textFileServices.js.map