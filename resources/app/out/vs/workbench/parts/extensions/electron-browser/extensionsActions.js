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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/base/common/actions', 'vs/base/common/severity', 'vs/platform/instantiation/common/instantiation', 'vs/platform/telemetry/common/telemetry', 'vs/platform/message/common/message', 'vs/workbench/electron-browser/actions', 'vs/workbench/parts/extensions/common/extensions', 'vs/workbench/services/quickopen/common/quickOpenService'], function (require, exports, nls, winjs_base_1, actions_1, severity_1, instantiation_1, telemetry_1, message_1, actions_2, extensions_1, quickOpenService_1) {
    var ListExtensionsAction = (function (_super) {
        __extends(ListExtensionsAction, _super);
        function ListExtensionsAction(id, label, extensionsService, quickOpenService) {
            _super.call(this, id, label, null, true);
            this.extensionsService = extensionsService;
            this.quickOpenService = quickOpenService;
        }
        ListExtensionsAction.prototype.run = function () {
            return this.quickOpenService.show('ext ');
        };
        ListExtensionsAction.prototype.isEnabled = function () {
            return true;
        };
        ListExtensionsAction.ID = 'workbench.extensions.action.listExtensions';
        ListExtensionsAction.LABEL = nls.localize('showInstalledExtensions', "Show Installed Extensions");
        ListExtensionsAction = __decorate([
            __param(2, extensions_1.IExtensionsService),
            __param(3, quickOpenService_1.IQuickOpenService)
        ], ListExtensionsAction);
        return ListExtensionsAction;
    })(actions_1.Action);
    exports.ListExtensionsAction = ListExtensionsAction;
    var InstallExtensionAction = (function (_super) {
        __extends(InstallExtensionAction, _super);
        function InstallExtensionAction(id, label, extensionsService, quickOpenService) {
            _super.call(this, id, label, null, true);
            this.extensionsService = extensionsService;
            this.quickOpenService = quickOpenService;
        }
        InstallExtensionAction.prototype.run = function () {
            return this.quickOpenService.show('ext install ');
        };
        InstallExtensionAction.prototype.isEnabled = function () {
            return true;
        };
        InstallExtensionAction.ID = 'workbench.extensions.action.installExtension';
        InstallExtensionAction.LABEL = nls.localize('installExtension', "Install Extension");
        InstallExtensionAction = __decorate([
            __param(2, extensions_1.IExtensionsService),
            __param(3, quickOpenService_1.IQuickOpenService)
        ], InstallExtensionAction);
        return InstallExtensionAction;
    })(actions_1.Action);
    exports.InstallExtensionAction = InstallExtensionAction;
    var ListOutdatedExtensionsAction = (function (_super) {
        __extends(ListOutdatedExtensionsAction, _super);
        function ListOutdatedExtensionsAction(id, label, extensionsService, quickOpenService) {
            _super.call(this, id, label, null, true);
            this.extensionsService = extensionsService;
            this.quickOpenService = quickOpenService;
        }
        ListOutdatedExtensionsAction.prototype.run = function () {
            return this.quickOpenService.show('ext update ');
        };
        ListOutdatedExtensionsAction.prototype.isEnabled = function () {
            return true;
        };
        ListOutdatedExtensionsAction.ID = 'workbench.extensions.action.listOutdatedExtensions';
        ListOutdatedExtensionsAction.LABEL = nls.localize('showOutdatedExtensions', "Show Outdated Extensions");
        ListOutdatedExtensionsAction = __decorate([
            __param(2, extensions_1.IExtensionsService),
            __param(3, quickOpenService_1.IQuickOpenService)
        ], ListOutdatedExtensionsAction);
        return ListOutdatedExtensionsAction;
    })(actions_1.Action);
    exports.ListOutdatedExtensionsAction = ListOutdatedExtensionsAction;
    var InstallAction = (function (_super) {
        __extends(InstallAction, _super);
        function InstallAction(label, quickOpenService, extensionsService, messageService, telemetryService, instantiationService) {
            _super.call(this, 'extensions.install', label, 'octicon octicon-cloud-download', true);
            this.quickOpenService = quickOpenService;
            this.extensionsService = extensionsService;
            this.messageService = messageService;
            this.telemetryService = telemetryService;
            this.instantiationService = instantiationService;
        }
        InstallAction.prototype.run = function (extension) {
            var _this = this;
            this.enabled = false;
            return this.extensionsService
                .install(extension)
                .then(function () { return _this.onSuccess(extension); }, function (err) { return _this.onError(err, extension); })
                .then(function () { return _this.enabled = true; })
                .then(function () { return null; });
        };
        InstallAction.prototype.onSuccess = function (extension) {
            this.reportTelemetry(extension, true);
            this.messageService.show(severity_1.default.Info, {
                message: nls.localize('success', "{0} {1} was successfully installed. Restart to enable it.", extension.displayName, extension.version),
                actions: [this.instantiationService.createInstance(actions_2.ReloadWindowAction, actions_2.ReloadWindowAction.ID, nls.localize('restartNow', "Restart Now"))]
            });
        };
        InstallAction.prototype.onError = function (err, extension) {
            this.reportTelemetry(extension, false);
            this.messageService.show(severity_1.default.Error, err);
        };
        InstallAction.prototype.reportTelemetry = function (extension, success) {
            this.telemetryService.publicLog('extensionGallery:install', {
                success: success,
                id: extension.galleryInformation ? extension.galleryInformation.id : null,
                name: extension.name,
                publisherId: extension.galleryInformation ? extension.galleryInformation.publisherId : null,
                publisherName: extension.publisher,
                publisherDisplayName: extension.galleryInformation ? extension.galleryInformation.publisherDisplayName : null
            });
        };
        InstallAction = __decorate([
            __param(1, quickOpenService_1.IQuickOpenService),
            __param(2, extensions_1.IExtensionsService),
            __param(3, message_1.IMessageService),
            __param(4, telemetry_1.ITelemetryService),
            __param(5, instantiation_1.IInstantiationService)
        ], InstallAction);
        return InstallAction;
    })(actions_1.Action);
    exports.InstallAction = InstallAction;
    var UninstallAction = (function (_super) {
        __extends(UninstallAction, _super);
        function UninstallAction(quickOpenService, extensionsService, messageService, telemetryService, instantiationService) {
            _super.call(this, 'extensions.uninstall', nls.localize('uninstall', "Uninstall Extension"), 'octicon octicon-x', true);
            this.quickOpenService = quickOpenService;
            this.extensionsService = extensionsService;
            this.messageService = messageService;
            this.telemetryService = telemetryService;
            this.instantiationService = instantiationService;
        }
        UninstallAction.prototype.run = function (extension) {
            var _this = this;
            if (!window.confirm(nls.localize('deleteSure', "Are you sure you want to uninstall the '{0}' extension?", extension.displayName))) {
                return winjs_base_1.TPromise.as(null);
            }
            this.enabled = false;
            return this.extensionsService.uninstall(extension)
                .then(function () { return _this.onSuccess(extension); }, function (err) { return _this.onError(err, extension); })
                .then(function () { return _this.enabled = true; })
                .then(function () { return null; });
        };
        UninstallAction.prototype.onSuccess = function (extension) {
            this.reportTelemetry(extension, true);
            this.messageService.show(severity_1.default.Info, {
                message: nls.localize('success', "{0} was successfully uninstalled. Restart to deactivate it.", extension.displayName),
                actions: [this.instantiationService.createInstance(actions_2.ReloadWindowAction, actions_2.ReloadWindowAction.ID, nls.localize('restartNow2', "Restart Now"))]
            });
        };
        UninstallAction.prototype.onError = function (err, extension) {
            this.reportTelemetry(extension, false);
            this.messageService.show(severity_1.default.Error, err);
        };
        UninstallAction.prototype.reportTelemetry = function (extension, success) {
            this.telemetryService.publicLog('extensionGallery:uninstall', {
                success: success,
                id: extension.galleryInformation ? extension.galleryInformation.id : null,
                name: extension.name,
                publisherId: extension.galleryInformation ? extension.galleryInformation.publisherId : null,
                publisherName: extension.publisher,
                publisherDisplayName: extension.galleryInformation ? extension.galleryInformation.publisherDisplayName : null
            });
        };
        UninstallAction = __decorate([
            __param(0, quickOpenService_1.IQuickOpenService),
            __param(1, extensions_1.IExtensionsService),
            __param(2, message_1.IMessageService),
            __param(3, telemetry_1.ITelemetryService),
            __param(4, instantiation_1.IInstantiationService)
        ], UninstallAction);
        return UninstallAction;
    })(actions_1.Action);
    exports.UninstallAction = UninstallAction;
});
//# sourceMappingURL=extensionsActions.js.map