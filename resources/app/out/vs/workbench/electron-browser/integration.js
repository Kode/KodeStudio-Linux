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
define(["require", "exports", 'vs/nls', 'vs/base/common/errors', 'vs/base/common/arrays', 'vs/base/common/severity', 'vs/workbench/browser/actions/openSettings', 'vs/workbench/services/part/common/partService', 'vs/platform/storage/common/storage', 'vs/platform/message/common/message', 'vs/platform/instantiation/common/instantiation', 'vs/platform/telemetry/common/telemetry', 'vs/platform/keybinding/common/keybindingService', 'vs/workbench/services/workspace/common/contextService', 'vs/workbench/services/window/electron-browser/windowService', 'vs/platform/configuration/common/configuration', 'vs/workbench/electron-browser/window', 'electron'], function (require, exports, nls, errors, arrays, severity_1, openSettings_1, partService_1, storage_1, message_1, instantiation_1, telemetry_1, keybindingService_1, contextService_1, windowService_1, configuration_1, win, electron_1) {
    var ElectronIntegration = (function () {
        function ElectronIntegration(instantiationService, windowService, partService, contextService, telemetryService, configurationService, keybindingService, storageService, messageService) {
            this.instantiationService = instantiationService;
            this.windowService = windowService;
            this.partService = partService;
            this.contextService = contextService;
            this.telemetryService = telemetryService;
            this.configurationService = configurationService;
            this.keybindingService = keybindingService;
            this.storageService = storageService;
            this.messageService = messageService;
        }
        ElectronIntegration.prototype.integrate = function (shellContainer) {
            var _this = this;
            // Register the active window
            var activeWindow = this.instantiationService.createInstance(win.ElectronWindow, electron_1.remote.getCurrentWindow(), shellContainer);
            this.windowService.registerWindow(activeWindow);
            // Support runAction event
            electron_1.ipcRenderer.on('vscode:runAction', function (event, actionId) {
                _this.keybindingService.executeCommand(actionId, { from: 'menu' }).done(undefined, function (err) { return _this.messageService.show(severity_1.default.Error, err); });
            });
            // Support options change
            electron_1.ipcRenderer.on('vscode:optionsChange', function (event, options) {
                var optionsData = JSON.parse(options);
                for (var key in optionsData) {
                    if (optionsData.hasOwnProperty(key)) {
                        var value = optionsData[key];
                        _this.contextService.updateOptions(key, value);
                    }
                }
            });
            // Support resolve keybindings event
            electron_1.ipcRenderer.on('vscode:resolveKeybindings', function (event, rawActionIds) {
                var actionIds = [];
                try {
                    actionIds = JSON.parse(rawActionIds);
                }
                catch (error) {
                }
                // Resolve keys using the keybinding service and send back to browser process
                _this.resolveKeybindings(actionIds).done(function (keybindings) {
                    if (keybindings.length) {
                        electron_1.ipcRenderer.send('vscode:keybindingsResolved', JSON.stringify(keybindings));
                    }
                }, function () { return errors.onUnexpectedError; });
            });
            electron_1.ipcRenderer.on('vscode:telemetry', function (event, _a) {
                var eventName = _a.eventName, data = _a.data;
                _this.telemetryService.publicLog(eventName, data);
            });
            electron_1.ipcRenderer.on('vscode:reportError', function (event, error) {
                if (error) {
                    var errorParsed = JSON.parse(error);
                    errorParsed.mainProcess = true;
                    errors.onUnexpectedError(errorParsed);
                }
            });
            // Emit event when vscode has loaded
            this.partService.joinCreation().then(function () {
                electron_1.ipcRenderer.send('vscode:workbenchLoaded', _this.windowService.getWindowId());
            });
            // Theme changes
            electron_1.ipcRenderer.on('vscode:changeTheme', function (event, theme) {
                _this.storageService.store('workbench.theme', theme, storage_1.StorageScope.GLOBAL);
            });
            // Configuration changes
            var previousConfiguredZoomLevel;
            this.configurationService.addListener(configuration_1.ConfigurationServiceEventTypes.UPDATED, function (e) {
                var windowConfig = e.config;
                var newZoomLevel = 0;
                if (windowConfig.window && typeof windowConfig.window.zoomLevel === 'number') {
                    newZoomLevel = windowConfig.window.zoomLevel;
                    // Leave early if the configured zoom level did not change (https://github.com/Microsoft/vscode/issues/1536)
                    if (previousConfiguredZoomLevel === newZoomLevel) {
                        return;
                    }
                    previousConfiguredZoomLevel = newZoomLevel;
                }
                if (electron_1.webFrame.getZoomLevel() !== newZoomLevel) {
                    electron_1.webFrame.setZoomLevel(newZoomLevel);
                }
            });
            // Auto Save Info (TODO@Ben remove me in a couple of versions)
            electron_1.ipcRenderer.on('vscode:showAutoSaveInfo', function () {
                _this.messageService.show(severity_1.default.Info, {
                    message: nls.localize('autoSaveInfo', "The **File | Auto Save** option moved into settings and **files.autoSaveDelay: 1** will be added to preserve it."),
                    actions: [
                        message_1.CloseAction,
                        _this.instantiationService.createInstance(openSettings_1.OpenGlobalSettingsAction, openSettings_1.OpenGlobalSettingsAction.ID, openSettings_1.OpenGlobalSettingsAction.LABEL)
                    ]
                });
            });
            electron_1.ipcRenderer.on('vscode:showAutoSaveError', function () {
                _this.messageService.show(severity_1.default.Warning, {
                    message: nls.localize('autoSaveError', "Unable to write to settings. Please add **files.autoSaveDelay: 1** to settings.json."),
                    actions: [
                        message_1.CloseAction,
                        _this.instantiationService.createInstance(openSettings_1.OpenGlobalSettingsAction, openSettings_1.OpenGlobalSettingsAction.ID, openSettings_1.OpenGlobalSettingsAction.LABEL)
                    ]
                });
            });
        };
        ElectronIntegration.prototype.resolveKeybindings = function (actionIds) {
            var _this = this;
            return this.partService.joinCreation().then(function () {
                return arrays.coalesce(actionIds.map(function (id) {
                    var bindings = _this.keybindingService.lookupKeybindings(id);
                    // return the first binding that can be represented by electron
                    for (var i = 0; i < bindings.length; i++) {
                        var binding = bindings[i];
                        var electronAccelerator = _this.keybindingService.getElectronAcceleratorFor(binding);
                        if (electronAccelerator) {
                            return {
                                id: id,
                                binding: binding.value
                            };
                        }
                    }
                    return null;
                }));
            });
        };
        ElectronIntegration = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, windowService_1.IWindowService),
            __param(2, partService_1.IPartService),
            __param(3, contextService_1.IWorkspaceContextService),
            __param(4, telemetry_1.ITelemetryService),
            __param(5, configuration_1.IConfigurationService),
            __param(6, keybindingService_1.IKeybindingService),
            __param(7, storage_1.IStorageService),
            __param(8, message_1.IMessageService)
        ], ElectronIntegration);
        return ElectronIntegration;
    })();
    exports.ElectronIntegration = ElectronIntegration;
});
//# sourceMappingURL=integration.js.map