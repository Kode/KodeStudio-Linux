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
define(["require", "exports", 'vs/nls', 'vs/base/node/pfs', 'vs/base/common/uri', 'vs/base/common/winjs.base', 'vs/base/common/paths', 'vs/platform/plugins/common/plugins', 'vs/platform/plugins/common/pluginsRegistry', 'vs/workbench/api/node/extHost.api.impl', 'vs/workbench/api/node/extHostDocuments', 'vs/platform/instantiation/common/instantiation', 'vs/platform/instantiation/common/instantiationService', 'vs/platform/plugins/common/nativePluginService', 'vs/platform/thread/common/pluginHostThreadService', 'vs/base/common/marshalling', 'vs/workbench/api/node/extHostTelemetry', 'vs/platform/request/common/baseRequestService', 'vs/platform/workspace/common/baseWorkspaceContextService', 'vs/editor/common/services/modeServiceImpl', 'vs/workbench/node/extensionPoints', 'vs/platform/workspace/common/workspace', 'vs/workbench/parts/extensions/common/extensions', 'vs/workbench/parts/extensions/node/extensionsService', 'vs/base/common/async', 'vs/base/node/stdFork', 'vs/languages/lib/common/wireProtocol'], function (require, exports, nls, pfs, uri_1, winjs_base_1, paths, plugins_1, pluginsRegistry_1, extHost_api_impl_1, extHostDocuments_1, instantiation_1, InstantiationService, nativePluginService_1, pluginHostThreadService_1, marshalling, extHostTelemetry_1, baseRequestService_1, baseWorkspaceContextService_1, modeServiceImpl_1, extensionPoints_1, workspace_1, extensions_1, extensionsService_1) {
    var DIRNAME = uri_1.default.parse(require.toUrl('./')).fsPath;
    var BASE_PATH = paths.normalize(paths.join(DIRNAME, '../../../..'));
    var BUILTIN_PLUGINS_PATH = paths.join(BASE_PATH, 'extensions');
    var nativeExit = process.exit.bind(process);
    process.exit = function () {
        var err = new Error('An extension called process.exit() and this was prevented.');
        console.warn(err.stack);
    };
    function exit(code) {
        nativeExit(code);
    }
    exports.exit = exit;
    function createServices(remoteCom, initData, sharedProcessClient) {
        // the init data is not demarshalled
        initData = marshalling.deserialize(initData);
        var contextService = new baseWorkspaceContextService_1.BaseWorkspaceContextService(initData.contextService.workspace, initData.contextService.configuration, initData.contextService.options);
        var threadService = new pluginHostThreadService_1.PluginHostThreadService(remoteCom);
        threadService.setInstantiationService(InstantiationService.create({ threadService: threadService }));
        var telemetryServiceInstance = new extHostTelemetry_1.ExtHostTelemetryService(threadService);
        var requestService = new baseRequestService_1.BaseRequestService(contextService, telemetryServiceInstance);
        var modelService = threadService.getRemotable(extHostDocuments_1.ExtHostModelService);
        var pluginService = new nativePluginService_1.PluginHostPluginService(threadService);
        var modeService = new modeServiceImpl_1.ModeServiceImpl(threadService, pluginService);
        var _services = {
            contextService: contextService,
            requestService: requestService,
            modelService: modelService,
            threadService: threadService,
            modeService: modeService,
            pluginService: pluginService,
            telemetryService: extHostTelemetry_1.ExtHostTelemetryService
        };
        var instantiationService = InstantiationService.create(_services);
        threadService.setInstantiationService(instantiationService);
        // Create the monaco API
        instantiationService.createInstance(extHost_api_impl_1.ExtHostAPIImplementation);
        // Connect to shared process services
        instantiationService.addSingleton(extensions_1.IExtensionsService, sharedProcessClient.getService('ExtensionService', extensionsService_1.ExtensionsService));
        return instantiationService;
    }
    exports.createServices = createServices;
    var PluginHostMain = (function () {
        function PluginHostMain(contextService, pluginService, instantiationService) {
            this.contextService = contextService;
            this.pluginService = pluginService;
            this._isTerminating = false;
        }
        PluginHostMain.prototype.start = function () {
            return this.readPlugins();
        };
        PluginHostMain.prototype.terminate = function () {
            var _this = this;
            if (this._isTerminating) {
                // we are already shutting down...
                return;
            }
            this._isTerminating = true;
            try {
                var allExtensions = pluginsRegistry_1.PluginsRegistry.getAllPluginDescriptions();
                var allExtensionsIds = allExtensions.map(function (ext) { return ext.id; });
                var activatedExtensions = allExtensionsIds.filter(function (id) { return _this.pluginService.isActivated(id); });
                activatedExtensions.forEach(function (extensionId) {
                    _this.pluginService.deactivate(extensionId);
                });
            }
            catch (err) {
            }
            // Give extensions 1 second to wrap up any async dispose, then exit
            setTimeout(function () {
                exit();
            }, 1000);
        };
        PluginHostMain.prototype.readPlugins = function () {
            var _this = this;
            var collector = new pluginsRegistry_1.PluginsMessageCollector();
            var env = this.contextService.getConfiguration().env;
            return PluginHostMain.scanPlugins(collector, BUILTIN_PLUGINS_PATH, !env.disablePlugins ? env.userPluginsHome : void 0, !env.disablePlugins ? env.pluginDevelopmentPath : void 0, env.version)
                .then(null, function (err) {
                collector.error('', err);
                return [];
            })
                .then(function (extensions) {
                // Register & Signal done
                pluginsRegistry_1.PluginsRegistry.registerPlugins(extensions);
                _this.pluginService.registrationDone(collector.getMessages());
            })
                .then(function () { return _this.handleEagerPlugins(); })
                .then(function () { return _this.handlePluginTests(); });
        };
        PluginHostMain.scanPlugins = function (collector, builtinPluginsPath, userInstallPath, pluginDevelopmentPath, version) {
            var builtinPlugins = extensionPoints_1.PluginScanner.scanPlugins(version, collector, builtinPluginsPath, true);
            var userPlugins = !userInstallPath ? winjs_base_1.TPromise.as([]) : extensionPoints_1.PluginScanner.scanPlugins(version, collector, userInstallPath, false);
            var developedPlugins = !pluginDevelopmentPath ? winjs_base_1.TPromise.as([]) : extensionPoints_1.PluginScanner.scanOneOrMultiplePlugins(version, collector, pluginDevelopmentPath, false);
            return winjs_base_1.TPromise.join([builtinPlugins, userPlugins, developedPlugins]).then(function (_) {
                var builtinPlugins = _[0];
                var userPlugins = _[1];
                var extensionDevPlugins = _[2];
                var resultingPluginsMap = {};
                builtinPlugins.forEach(function (builtinPlugin) {
                    resultingPluginsMap[builtinPlugin.id] = builtinPlugin;
                });
                userPlugins.forEach(function (userPlugin) {
                    if (resultingPluginsMap.hasOwnProperty(userPlugin.id)) {
                        collector.warn(userPlugin.extensionFolderPath, 'Overwriting extension ' + resultingPluginsMap[userPlugin.id].extensionFolderPath + ' with ' + userPlugin.extensionFolderPath);
                    }
                    resultingPluginsMap[userPlugin.id] = userPlugin;
                });
                extensionDevPlugins.forEach(function (extensionDevPlugin) {
                    collector.info('', 'Loading development extension at ' + extensionDevPlugin.extensionFolderPath);
                    if (resultingPluginsMap.hasOwnProperty(extensionDevPlugin.id)) {
                        collector.warn(extensionDevPlugin.extensionFolderPath, 'Overwriting extension ' + resultingPluginsMap[extensionDevPlugin.id].extensionFolderPath + ' with ' + extensionDevPlugin.extensionFolderPath);
                    }
                    resultingPluginsMap[extensionDevPlugin.id] = extensionDevPlugin;
                });
                return Object.keys(resultingPluginsMap).map(function (name) { return resultingPluginsMap[name]; });
            });
        };
        // Handle "eager" activation plugins
        PluginHostMain.prototype.handleEagerPlugins = function () {
            this.pluginService.activateByEvent('*').then(null, function (err) {
                console.error(err);
            });
            return this.handleWorkspaceContainsEagerPlugins();
        };
        PluginHostMain.prototype.handleWorkspaceContainsEagerPlugins = function () {
            var _this = this;
            var workspace = this.contextService.getWorkspace();
            if (!workspace || !workspace.resource) {
                return winjs_base_1.TPromise.as(null);
            }
            var folderPath = workspace.resource.fsPath;
            var desiredFilesMap = {};
            pluginsRegistry_1.PluginsRegistry.getAllPluginDescriptions().forEach(function (desc) {
                var activationEvents = desc.activationEvents;
                if (!activationEvents) {
                    return;
                }
                for (var i = 0; i < activationEvents.length; i++) {
                    if (/^workspaceContains:/.test(activationEvents[i])) {
                        var fileName = activationEvents[i].substr('workspaceContains:'.length);
                        desiredFilesMap[fileName] = true;
                    }
                }
            });
            return winjs_base_1.TPromise.join(Object.keys(desiredFilesMap).map(function (fileName) { return pfs.fileExistsWithResult(paths.join(folderPath, fileName), fileName); })).then(function (fileNames) {
                fileNames.forEach(function (existingFileName) {
                    if (!existingFileName) {
                        return;
                    }
                    var activationEvent = 'workspaceContains:' + existingFileName;
                    _this.pluginService.activateByEvent(activationEvent).then(null, function (err) {
                        console.error(err);
                    });
                });
            });
        };
        PluginHostMain.prototype.handlePluginTests = function () {
            var _this = this;
            var env = this.contextService.getConfiguration().env;
            if (!env.pluginTestsPath || !env.pluginDevelopmentPath) {
                return winjs_base_1.TPromise.as(null);
            }
            // Require the test runner via node require from the provided path
            var testRunner;
            var requireError;
            try {
                testRunner = require.__$__nodeRequire(env.pluginTestsPath);
            }
            catch (error) {
                requireError = error;
            }
            // Execute the runner if it follows our spec
            if (testRunner && typeof testRunner.run === 'function') {
                return new winjs_base_1.TPromise(function (c, e) {
                    testRunner.run(env.pluginTestsPath, function (error, failures) {
                        if (error) {
                            e(error.toString());
                        }
                        else {
                            c(null);
                        }
                        // after tests have run, we shutdown the host
                        _this.gracefulExit(failures && failures > 0 ? 1 /* ERROR */ : 0 /* OK */);
                    });
                });
            }
            else {
                this.gracefulExit(1 /* ERROR */);
            }
            return winjs_base_1.TPromise.wrapError(requireError ? requireError.toString() : nls.localize('pluginTestError', "Path {0} does not point to a valid extension test runner.", env.pluginTestsPath));
        };
        PluginHostMain.prototype.gracefulExit = function (code) {
            // to give the PH process a chance to flush any outstanding console
            // messages to the main process, we delay the exit() by some time
            setTimeout(function () { return exit(code); }, 500);
        };
        PluginHostMain = __decorate([
            __param(0, workspace_1.IWorkspaceContextService),
            __param(1, plugins_1.IPluginService),
            __param(2, instantiation_1.IInstantiationService)
        ], PluginHostMain);
        return PluginHostMain;
    })();
    exports.PluginHostMain = PluginHostMain;
});
//# sourceMappingURL=pluginHostMain.js.map