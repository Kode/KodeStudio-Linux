/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/browser/builder', 'vs/base/common/objects', 'vs/base/browser/dom', 'vs/base/common/event', 'vs/base/common/errors', 'vs/platform/contextview/browser/contextViewService', 'vs/workbench/services/contextview/electron-browser/contextmenuService', 'vs/workbench/common/constants', 'vs/base/common/timer', 'vs/workbench/browser/workbench', 'vs/workbench/common/storage', 'vs/platform/telemetry/common/telemetry', 'vs/platform/telemetry/electron-browser/electronTelemetryService', 'vs/workbench/electron-browser/integration', 'vs/workbench/electron-browser/update', 'vs/platform/telemetry/common/workspaceStats', 'vs/workbench/services/window/electron-browser/windowService', 'vs/workbench/services/message/electron-browser/messageService', 'vs/workbench/services/request/node/requestService', 'vs/platform/configuration/common/configuration', 'vs/workbench/services/configuration/node/configurationService', 'vs/workbench/services/files/electron-browser/fileService', 'vs/workbench/services/search/node/searchService', 'vs/workbench/services/lifecycle/electron-browser/lifecycleService', 'vs/workbench/services/keybinding/electron-browser/keybindingService', 'vs/workbench/services/thread/electron-browser/threadService', 'vs/platform/markers/common/markerService', 'vs/platform/actions/common/actions', 'vs/platform/actions/common/actionsService', 'vs/editor/common/services/modelService', 'vs/editor/common/services/modelServiceImpl', 'vs/editor/browser/services/codeEditorServiceImpl', 'vs/editor/common/services/codeEditorService', 'vs/workbench/api/node/extHost.api.impl', 'vs/platform/plugins/common/nativePluginService', 'vs/workbench/api/node/extHostDocuments', 'vs/editor/node/textMate/TMSyntax', 'vs/editor/node/textMate/TMSnippets', 'vs/platform/jsonschemas/common/jsonValidationExtensionPoint', 'vs/editor/node/languageConfiguration', 'vs/workbench/api/node/extHostFileSystemEventService', 'vs/workbench/api/node/extHostQuickOpen', 'vs/workbench/api/node/extHostStatusBar', 'vs/workbench/api/node/extHostCommands', 'vs/platform/telemetry/common/abstractRemoteTelemetryService', 'vs/workbench/api/node/extHostDiagnostics', 'vs/workbench/api/node/extHostOutputService', 'vs/workbench/api/node/extHostMessageService', 'vs/workbench/api/node/extHostLanguages', 'vs/workbench/api/node/extHostEditors', 'vs/workbench/api/node/extHostWorkspace', 'vs/workbench/api/node/extHostConfiguration', 'vs/workbench/api/node/extHostLanguageFeatures', 'vs/platform/event/common/eventService', 'vs/platform/theme/common/themes', 'vs/workbench/services/workspace/common/contextService', 'vs/platform/storage/common/storage', 'vs/platform/storage/common/remotable.storage', 'vs/platform/instantiation/common/instantiationService', 'vs/platform/contextview/browser/contextView', 'vs/platform/event/common/event', 'vs/platform/files/common/files', 'vs/platform/keybinding/common/keybindingService', 'vs/platform/lifecycle/common/lifecycle', 'vs/platform/markers/common/markers', 'vs/platform/message/common/message', 'vs/platform/request/common/request', 'vs/platform/search/common/search', 'vs/platform/thread/common/thread', 'vs/platform/workspace/common/workspace', 'vs/platform/plugins/common/plugins', 'vs/editor/common/services/modeServiceImpl', 'vs/editor/common/services/modeService', 'vs/workbench/services/untitled/common/untitledEditorService', 'vs/workbench/electron-browser/crashReporter', 'vs/workbench/services/themes/node/themeService', 'vs/base/common/service', 'vs/base/node/service.net', 'vs/workbench/parts/extensions/common/extensions', 'vs/workbench/parts/extensions/node/extensionsService', 'vs/css!./media/shell', 'vs/css!vs/editor/css/vs-theme', 'vs/css!vs/editor/css/vs-dark-theme', 'vs/css!vs/editor/css/hc-black-theme', 'vs/css!vs/workbench/browser/media/vs-theme', 'vs/css!vs/workbench/browser/media/vs-dark-theme', 'vs/css!vs/workbench/browser/media/hc-black-theme'], function (require, exports, builder_1, objects, dom, event_1, errors, contextViewService_1, contextmenuService_1, constants_1, timer, workbench_1, storage_1, telemetry_1, electronTelemetryService_1, integration_1, update_1, workspaceStats_1, windowService_1, messageService_1, requestService_1, configuration_1, configurationService_1, fileService_1, searchService_1, lifecycleService_1, keybindingService_1, threadService_1, markerService_1, actions_1, actionsService_1, modelService_1, modelServiceImpl_1, codeEditorServiceImpl_1, codeEditorService_1, extHost_api_impl_1, nativePluginService_1, extHostDocuments_1, TMSyntax_1, TMSnippets_1, jsonValidationExtensionPoint_1, languageConfiguration_1, extHostFileSystemEventService_1, extHostQuickOpen_1, extHostStatusBar_1, extHostCommands_1, abstractRemoteTelemetryService_1, extHostDiagnostics_1, extHostOutputService_1, extHostMessageService_1, extHostLanguages_1, extHostEditors_1, extHostWorkspace_1, extHostConfiguration_1, extHostLanguageFeatures_1, eventService_1, themes, contextService_1, storage_2, remotable_storage_1, instantiationService_1, contextView_1, event_2, files_1, keybindingService_2, lifecycle_1, markers_1, message_1, request_1, search_1, thread_1, workspace_1, plugins_1, modeServiceImpl_1, modeService_1, untitledEditorService_1, crashReporter_1, themeService_1, service_1, service_net_1, extensions_1, extensionsService_1) {
    /**
     * This ugly code is needed because at the point when we need shared services
     * in the instantiation service, the connection to the shared process is not yet
     * completed. This create a delayed service wrapper that waits on that connection
     * and then relays all requests to the shared services.
     *
     * TODO@Joao remove
     */
    function getDelayedService(clientPromise, serviceName, serviceCtor) {
        var _servicePromise;
        var servicePromise = function () {
            if (!_servicePromise) {
                _servicePromise = clientPromise.then(function (client) { return client.getService(serviceName, serviceCtor); });
            }
            return _servicePromise;
        };
        return Object.keys(serviceCtor.prototype)
            .filter(function (key) { return key !== 'constructor'; })
            .reduce(function (result, key) {
            if (service_1.isServiceEvent(serviceCtor.prototype[key])) {
                var promise;
                var disposable;
                var emitter = new event_1.Emitter({
                    onFirstListenerAdd: function () {
                        promise = servicePromise().then(function (service) {
                            disposable = service[key](function (e) { return emitter.fire(e); });
                        });
                    },
                    onLastListenerRemove: function () {
                        if (disposable) {
                            disposable.dispose();
                            disposable = null;
                        }
                        promise.cancel();
                        promise = null;
                    }
                });
                return objects.assign(result, (_a = {}, _a[key] = emitter.event, _a));
            }
            return objects.assign(result, (_b = {},
                _b[key] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    return servicePromise().then(function (service) { return service[key].apply(service, args); });
                },
                _b
            ));
            var _a, _b;
        }, {});
    }
    exports.getDelayedService = getDelayedService;
    /**
     * The Monaco Workbench Shell contains the Monaco workbench with a rich header containing navigation and the activity bar.
     * With the Shell being the top level element in the page, it is also responsible for driving the layouting.
     */
    var WorkbenchShell = (function () {
        function WorkbenchShell(container, workspace, configuration, options) {
            this.container = container;
            this.workspace = workspace;
            this.configuration = configuration;
            this.options = objects.mixin({}, options);
            this.toUnbind = [];
            this.previousErrorTime = 0;
        }
        WorkbenchShell.prototype.createContents = function (parent) {
            var _this = this;
            // Workbench Container
            var workbenchContainer = builder_1.$(parent).div();
            // Instantiation service with services
            var service = this.initInstantiationService();
            //crash reporting
            if (!!this.configuration.env.crashReporter) {
                var crashReporter = service.createInstance(crashReporter_1.CrashReporter, this.configuration.env.version, this.configuration.env.commitHash);
                crashReporter.start(this.configuration.env.crashReporter);
            }
            var sharedProcessClientPromise = service_net_1.connect(process.env['VSCODE_SHARED_IPC_HOOK']);
            sharedProcessClientPromise.done(null, errors.onUnexpectedError);
            service.addSingleton(extensions_1.IExtensionsService, getDelayedService(sharedProcessClientPromise, 'ExtensionService', extensionsService_1.ExtensionsService));
            // Workbench
            this.workbench = new workbench_1.Workbench(workbenchContainer.getHTMLElement(), this.workspace, this.configuration, this.options, service);
            this.workbench.startup({
                onServicesCreated: function () {
                    _this.initPluginSystem();
                },
                onWorkbenchStarted: function () {
                    _this.onWorkbenchStarted();
                }
            });
            // Electron integration
            this.workbench.getInstantiationService().createInstance(integration_1.ElectronIntegration).integrate(this.container);
            // Update
            this.workbench.getInstantiationService().createInstance(update_1.Update);
            // Handle case where workbench is not starting up properly
            var timeoutHandle = setTimeout(function () {
                console.warn('Workbench did not finish loading in 10 seconds, that might be a problem that should be reported.');
            }, 10000);
            this.workbench.joinCreation().then(function () {
                clearTimeout(timeoutHandle);
            });
            return workbenchContainer;
        };
        WorkbenchShell.prototype.onWorkbenchStarted = function () {
            // Log to telemetry service
            var windowSize = {
                innerHeight: window.innerHeight,
                innerWidth: window.innerWidth,
                outerHeight: window.outerHeight,
                outerWidth: window.outerWidth
            };
            this.telemetryService.publicLog('workspaceLoad', {
                userAgent: navigator.userAgent,
                windowSize: windowSize,
                emptyWorkbench: !this.contextService.getWorkspace(),
                customKeybindingsCount: this.keybindingService.customKeybindingsCount(),
                theme: this.currentTheme
            });
            var workspaceStats = this.workbench.getInstantiationService().createInstance(workspaceStats_1.WorkspaceStats);
            workspaceStats.reportWorkspaceTags();
        };
        WorkbenchShell.prototype.initInstantiationService = function () {
            var _this = this;
            var eventService = new eventService_1.EventService();
            this.contextService = new contextService_1.WorkspaceContextService(eventService, this.workspace, this.configuration, this.options);
            this.contextService.getConfiguration().additionalWorkerServices = [
                { serviceId: 'requestService', moduleName: 'vs/workbench/services/request/common/requestService', ctorName: 'WorkerRequestService' }
            ];
            this.windowService = new windowService_1.WindowService();
            var disableWorkspaceStorage = this.configuration.env.pluginTestsPath || (!this.workspace && !this.configuration.env.pluginDevelopmentPath); // without workspace or in any plugin test, we use inMemory storage unless we develop a plugin where we want to preserve state
            this.storageService = new storage_1.Storage(this.contextService, window.localStorage, disableWorkspaceStorage ? storage_1.inMemoryLocalStorageInstance : window.localStorage);
            // no telemetry in a window for plugin development!
            var enableTelemetry = this.configuration.env.isBuilt && !this.configuration.env.pluginDevelopmentPath ? !!this.configuration.env.enableTelemetry : false;
            this.telemetryService = new electronTelemetryService_1.ElectronTelemetryService(this.storageService, { enableTelemetry: enableTelemetry, version: this.configuration.env.version, commitHash: this.configuration.env.commitHash });
            this.keybindingService = new keybindingService_1.WorkbenchKeybindingService(this.contextService, eventService, this.telemetryService, window);
            this.messageService = new messageService_1.MessageService(this.contextService, this.windowService, this.telemetryService, this.keybindingService);
            this.keybindingService.setMessageService(this.messageService);
            var configService = new configurationService_1.ConfigurationService(this.contextService, eventService);
            var fileService = new fileService_1.FileService(configService, eventService, this.contextService);
            this.contextViewService = new contextViewService_1.ContextViewService(this.container, this.telemetryService, this.messageService);
            var lifecycleService = new lifecycleService_1.LifecycleService(this.messageService, this.windowService);
            lifecycleService.onShutdown(function () { return fileService.dispose(); });
            this.threadService = new threadService_1.MainThreadService(this.contextService, this.messageService, this.windowService);
            lifecycleService.onShutdown(function () { return _this.threadService.dispose(); });
            var requestService = new requestService_1.RequestService(this.contextService, configService, this.telemetryService);
            this.threadService.registerInstance(requestService);
            lifecycleService.onShutdown(function () { return requestService.dispose(); });
            var markerService = new markerService_1.MarkerService(this.threadService);
            var pluginService = new nativePluginService_1.MainProcessPluginService(this.contextService, this.threadService, this.messageService, this.telemetryService);
            this.keybindingService.setPluginService(pluginService);
            var modelService = new modelServiceImpl_1.ModelServiceImpl(this.threadService, markerService);
            var modeService = new modeServiceImpl_1.MainThreadModeServiceImpl(this.threadService, pluginService, modelService);
            var untitledEditorService = new untitledEditorService_1.UntitledEditorService();
            this.themeService = new themeService_1.ThemeService(pluginService);
            var result = instantiationService_1.create();
            result.addSingleton(telemetry_1.ITelemetryService, this.telemetryService);
            result.addSingleton(event_2.IEventService, eventService);
            result.addSingleton(request_1.IRequestService, requestService);
            result.addSingleton(workspace_1.IWorkspaceContextService, this.contextService);
            result.addSingleton(contextView_1.IContextViewService, this.contextViewService);
            result.addSingleton(contextView_1.IContextMenuService, new contextmenuService_1.ContextMenuService(this.messageService, this.telemetryService, this.keybindingService));
            result.addSingleton(message_1.IMessageService, this.messageService);
            result.addSingleton(storage_2.IStorageService, this.storageService);
            result.addSingleton(lifecycle_1.ILifecycleService, lifecycleService);
            result.addSingleton(thread_1.IThreadService, this.threadService);
            result.addSingleton(plugins_1.IPluginService, pluginService);
            result.addSingleton(modeService_1.IModeService, modeService);
            result.addSingleton(files_1.IFileService, fileService);
            result.addSingleton(untitledEditorService_1.IUntitledEditorService, untitledEditorService);
            result.addSingleton(search_1.ISearchService, new searchService_1.SearchService(modelService, untitledEditorService, this.contextService, configService));
            result.addSingleton(windowService_1.IWindowService, this.windowService);
            result.addSingleton(configuration_1.IConfigurationService, configService);
            result.addSingleton(keybindingService_2.IKeybindingService, this.keybindingService);
            result.addSingleton(markers_1.IMarkerService, markerService);
            result.addSingleton(modelService_1.IModelService, modelService);
            result.addSingleton(codeEditorService_1.ICodeEditorService, new codeEditorServiceImpl_1.CodeEditorServiceImpl());
            result.addSingleton(themeService_1.IThemeService, this.themeService);
            result.addSingleton(actions_1.IActionsService, new actionsService_1.default(pluginService, this.keybindingService));
            return result;
        };
        // TODO@Alex, TODO@Joh move this out of here?
        WorkbenchShell.prototype.initPluginSystem = function () {
            this.threadService.getRemotable(extHost_api_impl_1.MainProcessVSCodeAPIHelper);
            this.threadService.getRemotable(extHostDocuments_1.MainThreadDocuments);
            this.threadService.getRemotable(abstractRemoteTelemetryService_1.RemoteTelemetryServiceHelper);
            this.workbench.getInstantiationService().createInstance(TMSyntax_1.MainProcessTextMateSyntax);
            this.workbench.getInstantiationService().createInstance(TMSnippets_1.MainProcessTextMateSnippet);
            this.workbench.getInstantiationService().createInstance(jsonValidationExtensionPoint_1.JSONValidationExtensionPoint);
            this.workbench.getInstantiationService().createInstance(languageConfiguration_1.LanguageConfigurationFileHandler);
            this.threadService.getRemotable(extHostConfiguration_1.MainThreadConfiguration);
            this.threadService.getRemotable(extHostQuickOpen_1.MainThreadQuickOpen);
            this.threadService.getRemotable(extHostStatusBar_1.MainThreadStatusBar);
            this.workbench.getInstantiationService().createInstance(extHostFileSystemEventService_1.MainThreadFileSystemEventService);
            this.threadService.getRemotable(extHostCommands_1.MainThreadCommands);
            this.threadService.getRemotable(extHostOutputService_1.MainThreadOutputService);
            this.threadService.getRemotable(extHostDiagnostics_1.MainThreadDiagnostics);
            this.threadService.getRemotable(extHostMessageService_1.MainThreadMessageService);
            this.threadService.getRemotable(extHostLanguages_1.MainThreadLanguages);
            this.threadService.getRemotable(extHostWorkspace_1.MainThreadWorkspace);
            this.threadService.getRemotable(extHostEditors_1.MainThreadEditors);
            this.threadService.getRemotable(remotable_storage_1.MainThreadStorage);
            this.threadService.getRemotable(extHostLanguageFeatures_1.MainThreadLanguageFeatures);
        };
        WorkbenchShell.prototype.open = function () {
            var _this = this;
            // Listen on unexpected errors
            errors.setUnexpectedErrorHandler(function (error) {
                _this.onUnexpectedError(error);
            });
            // Shell Class for CSS Scoping
            builder_1.$(this.container).addClass('monaco-shell');
            // Controls
            this.content = builder_1.$('.monaco-shell-content').appendTo(this.container).getHTMLElement();
            // Handle Load Performance Timers
            this.writeTimers();
            // Create Contents
            this.contentsContainer = this.createContents(builder_1.$(this.content));
            // Layout
            this.layout();
            // Listeners
            this.registerListeners();
            // Enable theme support
            var themeId = this.storageService.get(constants_1.Preferences.THEME, storage_2.StorageScope.GLOBAL, null);
            if (!themeId) {
                themeId = themes.toId(themes.BaseTheme.VS_DARK);
                this.storageService.store(constants_1.Preferences.THEME, themeId, storage_2.StorageScope.GLOBAL);
            }
            this.setTheme(themeId, false);
            this.toUnbind.push(this.storageService.addListener(storage_2.StorageEventType.STORAGE, function (e) {
                if (e.key === constants_1.Preferences.THEME) {
                    _this.setTheme(e.newValue);
                }
            }));
        };
        WorkbenchShell.prototype.setTheme = function (themeId, layout) {
            var _this = this;
            if (layout === void 0) { layout = true; }
            if (!themeId) {
                return;
            }
            var applyTheme = function () {
                if (_this.currentTheme) {
                    builder_1.$(_this.container).removeClass(_this.currentTheme);
                }
                _this.currentTheme = themeId;
                builder_1.$(_this.container).addClass(_this.currentTheme);
                if (layout) {
                    _this.layout();
                }
            };
            if (!themes.getSyntaxThemeId(themeId)) {
                applyTheme();
            }
            else {
                this.themeService.getTheme(themeId).then(function (theme) {
                    if (theme) {
                        _this.themeService.loadThemeCSS(themeId);
                        applyTheme();
                    }
                }, function (error) {
                    errors.onUnexpectedError(error);
                });
            }
        };
        WorkbenchShell.prototype.registerListeners = function () {
            var _this = this;
            // Resize
            builder_1.$(window).on(dom.EventType.RESIZE, function () { return _this.layout(); }, this.toUnbind);
        };
        WorkbenchShell.prototype.writeTimers = function () {
            var timers = window.MonacoEnvironment.timers;
            if (timers) {
                var events = [];
                // Program
                if (timers.beforeProgram) {
                    events.push({
                        startTime: timers.beforeProgram,
                        stopTime: timers.afterProgram,
                        topic: 'Startup',
                        name: 'Program Start',
                        description: 'Time it takes to pass control to VSCodes main method'
                    });
                }
                // Window
                if (timers.vscodeStart) {
                    events.push({
                        startTime: timers.vscodeStart,
                        stopTime: timers.beforeLoad,
                        topic: 'Startup',
                        name: 'VSCode Startup',
                        description: 'Time it takes to create a window and startup VSCode'
                    });
                }
                // Load
                events.push({
                    startTime: timers.beforeLoad,
                    stopTime: timers.afterLoad,
                    topic: 'Startup',
                    name: 'Load Modules',
                    description: 'Time it takes to load VSCodes main modules'
                });
                // Ready
                events.push({
                    startTime: timers.beforeReady,
                    stopTime: timers.afterReady,
                    topic: 'Startup',
                    name: 'Event DOMContentLoaded',
                    description: 'Time it takes for the DOM to emit DOMContentLoaded event'
                });
                // Write to Timer
                timer.getTimeKeeper().setInitialCollectedEvents(events, timers.start);
            }
        };
        WorkbenchShell.prototype.onUnexpectedError = function (error) {
            var errorMsg = errors.toErrorMessage(error, true);
            if (!errorMsg) {
                return;
            }
            var now = new Date().getTime();
            if (errorMsg === this.previousErrorValue && now - this.previousErrorTime <= 1000) {
                return; // Return if error message identical to previous and shorter than 1 second
            }
            this.previousErrorTime = now;
            this.previousErrorValue = errorMsg;
            // Log to console
            console.error(errorMsg);
            // Show to user if friendly message provided
            if (error && error.friendlyMessage && this.messageService) {
                this.messageService.show(message_1.Severity.Error, error.friendlyMessage);
            }
        };
        WorkbenchShell.prototype.layout = function () {
            var clArea = builder_1.$(this.container).getClientArea();
            var contentsSize = new builder_1.Dimension(clArea.width, clArea.height);
            this.contentsContainer.size(contentsSize.width, contentsSize.height);
            this.contextViewService.layout();
            this.workbench.layout();
        };
        WorkbenchShell.prototype.joinCreation = function () {
            return this.workbench.joinCreation();
        };
        WorkbenchShell.prototype.dispose = function (force) {
            // Workbench
            if (this.workbench) {
                var veto = this.workbench.shutdown(force);
                // If Workbench vetos dispose, return early
                if (veto) {
                    return;
                }
            }
            this.contextViewService.dispose();
            this.storageService.dispose();
            // Listeners
            while (this.toUnbind.length) {
                this.toUnbind.pop()();
            }
            // Container
            builder_1.$(this.container).empty();
        };
        return WorkbenchShell;
    })();
    exports.WorkbenchShell = WorkbenchShell;
});
//# sourceMappingURL=shell.js.map