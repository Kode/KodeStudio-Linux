/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/services/modelServiceImpl', 'vs/platform/instantiation/common/instantiationService', 'vs/platform/thread/common/mainThreadService', 'vs/platform/markers/common/markerService', 'vs/base/common/flags', 'vs/base/common/uri', 'vs/platform/telemetry/browser/mainTelemetryService', 'vs/editor/browser/standalone/simpleServices', 'vs/platform/contextview/browser/contextViewService', 'vs/platform/contextview/browser/contextMenuService', 'vs/platform/workspace/common/baseWorkspaceContextService', 'vs/platform/event/common/eventService', 'vs/editor/browser/services/codeEditorServiceImpl', 'vs/editor/common/services/modeServiceImpl'], function (require, exports, modelServiceImpl_1, InstantiationService, mainThreadService, MarkerService, Env, uri_1, MainTelemetryService, SimpleServices, ContextViewService, ContextMenuService, baseWorkspaceContextService_1, _eventService, codeEditorServiceImpl_1, modeServiceImpl_1) {
    function shallowClone(obj) {
        var r = {};
        if (obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    r[key] = obj[key];
                }
            }
        }
        return r;
    }
    function ensureStaticPlatformServices(services) {
        services = shallowClone(services);
        var statics = getOrCreateStaticServices(services);
        services.threadService = services.threadService || statics.threadService;
        services.pluginService = services.pluginService || statics.pluginService;
        services.modeService = services.modeService || statics.modeService;
        services.contextService = services.contextService || statics.contextService;
        services.telemetryService = services.telemetryService || statics.telemetryService;
        services.requestService = services.requestService || statics.requestService;
        services.messageService = services.messageService || statics.messageService;
        services.modelService = services.modelService || statics.modelService;
        services.codeEditorService = services.codeEditorService || statics.codeEditorService;
        services.eventService = services.eventService || statics.eventService;
        services.markerService = services.markerService || statics.markerService;
        services.instantiationService = statics.instantiationService;
        return services;
    }
    exports.ensureStaticPlatformServices = ensureStaticPlatformServices;
    function ensureDynamicPlatformServices(domElement, services) {
        var r = [];
        if (typeof services.keybindingService === 'undefined') {
            var keybindingService = new SimpleServices.StandaloneKeybindingService(domElement);
            r.push(keybindingService);
            services.keybindingService = keybindingService;
        }
        if (typeof services.contextViewService === 'undefined') {
            var contextViewService = new ContextViewService.ContextViewService(domElement, services.telemetryService, services.messageService);
            r.push(contextViewService);
            services.contextViewService = contextViewService;
        }
        if (typeof services.contextMenuService === 'undefined') {
            var contextMenuService = new ContextMenuService.ContextMenuService(domElement, services.telemetryService, services.messageService, contextViewService);
            r.push(contextMenuService);
            services.contextMenuService = contextMenuService;
        }
        return r;
    }
    exports.ensureDynamicPlatformServices = ensureDynamicPlatformServices;
    // The static services represents a map of services that once 1 editor has been created must be used for all subsequent editors
    var staticServices = null;
    function getOrCreateStaticServices(services) {
        if (staticServices) {
            return staticServices;
        }
        services = services || {};
        var contextService = services.contextService;
        if (!contextService) {
            var workspaceUri = uri_1.default.create('inmemory', 'model', '/');
            contextService = new baseWorkspaceContextService_1.BaseWorkspaceContextService({
                resource: workspaceUri,
                id: null,
                name: null,
                uid: null,
                mtime: null
            }, {});
        }
        var telemetryService = services.telemetryService;
        if (!telemetryService) {
            var config = contextService.getConfiguration();
            var enableTelemetry = config && config.env ? !!config.env.enableTelemetry : false;
            telemetryService = new MainTelemetryService.MainTelemetryService({ enableTelemetry: enableTelemetry });
        }
        // warn the user that standaloneEdiktorTelemetryEndpint is absolete
        if (Env.standaloneEditorTelemetryEndpoint) {
            console.warn('standaloneEditorTelemetryEndpoint is obsolete');
        }
        var threadService = services.threadService;
        if (!threadService) {
            threadService = new mainThreadService.MainThreadService(contextService, 'vs/editor/common/worker/editorWorkerServer');
        }
        var messageService = services.messageService || new SimpleServices.SimpleMessageService();
        var pluginService = services.pluginService || new SimpleServices.SimplePluginService();
        var markerService = services.markerService || new MarkerService.MarkerService(threadService);
        var requestService = services.requestService || new SimpleServices.SimpleEditorRequestService(contextService, telemetryService);
        var modelService = services.modelService || new modelServiceImpl_1.ModelServiceImpl(threadService, markerService);
        var modeService = services.modeService;
        if (!modeService) {
            modeService = new modeServiceImpl_1.MainThreadModeServiceImpl(threadService, pluginService, modelService);
        }
        var codeEditorService = services.codeEditorService || new codeEditorServiceImpl_1.CodeEditorServiceImpl();
        var eventService = services.eventService || new _eventService.EventService();
        staticServices = {
            pluginService: pluginService,
            modeService: modeService,
            threadService: threadService,
            markerService: markerService,
            contextService: contextService,
            telemetryService: telemetryService,
            requestService: requestService,
            messageService: messageService,
            modelService: modelService,
            codeEditorService: codeEditorService,
            eventService: eventService,
            instantiationService: void 0
        };
        var instantiationService = InstantiationService.create(staticServices);
        staticServices.instantiationService = InstantiationService.create(staticServices);
        if (threadService instanceof mainThreadService.MainThreadService) {
            threadService.setInstantiationService(instantiationService);
        }
        telemetryService.setInstantiationService(instantiationService);
        return staticServices;
    }
    exports.getOrCreateStaticServices = getOrCreateStaticServices;
});
//# sourceMappingURL=standaloneServices.js.map