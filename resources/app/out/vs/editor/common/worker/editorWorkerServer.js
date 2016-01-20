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
define(["require", "exports", 'vs/platform/markers/common/markerService', 'vs/platform/thread/common/workerThreadService', 'vs/platform/instantiation/common/instantiationService', 'vs/platform/event/common/eventService', 'vs/platform/telemetry/common/workerTelemetryService', 'vs/base/common/winjs.base', 'vs/editor/common/services/resourceServiceImpl', 'vs/platform/workspace/common/baseWorkspaceContextService', 'vs/editor/common/services/modelServiceImpl', 'vs/base/common/async', 'vs/platform/instantiation/common/descriptors', 'vs/platform/request/common/baseRequestService', 'vs/platform/plugins/common/abstractPluginService', 'vs/editor/common/services/modeServiceImpl', 'vs/base/common/severity', 'vs/editor/common/modes/abstractModeWorker', 'vs/editor/common/languages.common'], function (require, exports, markerService_1, workerThreadService_1, InstantiationService, eventService_1, workerTelemetryService_1, winjs_base_1, resourceServiceImpl_1, baseWorkspaceContextService_1, modelServiceImpl_1, async_1, descriptors_1, baseRequestService_1, abstractPluginService_1, modeServiceImpl_1, severity_1) {
    var WorkerPluginService = (function (_super) {
        __extends(WorkerPluginService, _super);
        function WorkerPluginService() {
            _super.call(this, true);
        }
        WorkerPluginService.prototype._showMessage = function (severity, msg) {
            switch (severity) {
                case severity_1.default.Error:
                    console.error(msg);
                    break;
                case severity_1.default.Warning:
                    console.warn(msg);
                    break;
                case severity_1.default.Info:
                    console.info(msg);
                    break;
                default:
                    console.log(msg);
            }
        };
        WorkerPluginService.prototype.deactivate = function (pluginId) {
            // nothing to do
        };
        return WorkerPluginService;
    })(abstractPluginService_1.AbstractPluginService);
    var EditorWorkerServer = (function () {
        function EditorWorkerServer() {
        }
        EditorWorkerServer.prototype.initialize = function (mainThread, complete, error, progress, initData) {
            var _this = this;
            var pluginService = new WorkerPluginService();
            var contextService = new baseWorkspaceContextService_1.BaseWorkspaceContextService(initData.contextService.workspace, initData.contextService.configuration, initData.contextService.options);
            this.threadService = new workerThreadService_1.WorkerThreadService(initData.threadService, mainThread.getRemoteCom(), function (messageName, payload) {
                return mainThread.request(messageName, payload);
            });
            this.threadService.setInstantiationService(InstantiationService.create({ threadService: this.threadService }));
            var telemetryServiceInstance = new workerTelemetryService_1.WorkerTelemetryService(this.threadService);
            var resourceService = new resourceServiceImpl_1.ResourceService();
            var markerService = new markerService_1.MarkerService(this.threadService);
            var modeService = new modeServiceImpl_1.ModeServiceImpl(this.threadService, pluginService);
            var modesRegistryPromise = new async_1.PromiseSource();
            var requestService = new baseRequestService_1.BaseRequestService(contextService, telemetryServiceInstance);
            var _services = {
                threadService: this.threadService,
                pluginService: pluginService,
                modeService: modeService,
                contextService: contextService,
                eventService: new eventService_1.EventService(),
                resourceService: resourceService,
                markerService: markerService,
                telemetryService: telemetryServiceInstance,
                requestService: requestService
            };
            var servicePromise = winjs_base_1.TPromise.as(null);
            var additionalWorkerServices = contextService.getConfiguration().additionalWorkerServices;
            if (additionalWorkerServices) {
                additionalWorkerServices.forEach(function (additionalWorkerService) {
                    servicePromise = servicePromise.then(function (_) {
                        var descriptor = descriptors_1.AsyncDescriptor.create(additionalWorkerService.moduleName, additionalWorkerService.ctorName);
                        return InstantiationService.create(_services).createInstance(descriptor).then(function (serviceInstance) {
                            _services[additionalWorkerService.serviceId] = serviceInstance;
                        });
                    });
                });
            }
            servicePromise.then(function (_) {
                var instantiationService = InstantiationService.create(_services);
                _this.threadService.setInstantiationService(instantiationService);
                // Instantiate thread actors
                _this.threadService.getRemotable(modeServiceImpl_1.ModeServiceWorkerHelper);
                _this.threadService.getRemotable(modelServiceImpl_1.ModelServiceWorkerHelper);
                // Set to modes registry (ensure the synchronized object is constructed)
                modesRegistryPromise.complete();
                complete(undefined);
            });
        };
        EditorWorkerServer.prototype.request = function (mainThread, complete, error, progress, data) {
            this.threadService.dispatch(data).then(complete, error, progress);
        };
        return EditorWorkerServer;
    })();
    exports.EditorWorkerServer = EditorWorkerServer;
    exports.value = new EditorWorkerServer();
});
//# sourceMappingURL=editorWorkerServer.js.map