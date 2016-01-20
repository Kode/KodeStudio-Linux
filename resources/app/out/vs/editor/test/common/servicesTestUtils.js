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
define(["require", "exports", 'vs/editor/common/services/modeServiceImpl', 'vs/editor/common/services/modelServiceImpl', 'vs/platform/test/common/nullThreadService', 'vs/platform/plugins/common/abstractPluginService', 'vs/platform/instantiation/common/instantiationService', 'vs/base/common/severity'], function (require, exports, modeServiceImpl_1, modelServiceImpl_1, nullThreadService_1, abstractPluginService_1, InstantiationService, severity_1) {
    function createMockPlatformServices(mockPlatformServices) {
        if (mockPlatformServices === void 0) { mockPlatformServices = {}; }
        return {
            threadService: mockPlatformServices.threadService,
            pluginService: mockPlatformServices.pluginService,
            instantiationService: mockPlatformServices.instantiationService,
            lifecycleService: mockPlatformServices.lifecycleService,
            messageService: mockPlatformServices.messageService,
            markerService: mockPlatformServices.markerService,
            editorService: mockPlatformServices.editorService,
            requestService: mockPlatformServices.requestService,
            keybindingService: mockPlatformServices.keybindingService,
            contextService: mockPlatformServices.contextService,
            contextViewService: mockPlatformServices.contextViewService,
            contextMenuService: mockPlatformServices.contextMenuService,
            telemetryService: mockPlatformServices.telemetryService,
            eventService: mockPlatformServices.eventService,
            storageService: mockPlatformServices.storageService,
            configurationService: mockPlatformServices.configurationService,
            searchService: mockPlatformServices.searchService,
            progressService: mockPlatformServices.progressService,
            fileService: mockPlatformServices.fileService
        };
    }
    exports.createMockPlatformServices = createMockPlatformServices;
    function createMockEditorServices(mockEditorServices) {
        if (mockEditorServices === void 0) { mockEditorServices = {}; }
        var ret = createMockPlatformServices(mockEditorServices);
        ret['modelService'] = mockEditorServices.modelService;
        ret['modeService'] = mockEditorServices.modeService;
        return ret;
    }
    exports.createMockEditorServices = createMockEditorServices;
    function createMockEditorWorkerServices(mockEditorWorkerServices) {
        if (mockEditorWorkerServices === void 0) { mockEditorWorkerServices = {}; }
        var ret = createMockPlatformServices(mockEditorWorkerServices);
        ret['resourceService'] = mockEditorWorkerServices.resourceService;
        return ret;
    }
    exports.createMockEditorWorkerServices = createMockEditorWorkerServices;
    var MockModeService = (function (_super) {
        __extends(MockModeService, _super);
        function MockModeService() {
            _super.apply(this, arguments);
        }
        return MockModeService;
    })(modeServiceImpl_1.ModeServiceImpl);
    var MockPluginService = (function (_super) {
        __extends(MockPluginService, _super);
        function MockPluginService() {
            _super.call(this, true);
        }
        MockPluginService.prototype._showMessage = function (severity, msg) {
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
        MockPluginService.prototype.deactivate = function (pluginId) {
            // nothing to do
        };
        return MockPluginService;
    })(abstractPluginService_1.AbstractPluginService);
    var MockModelService = (function (_super) {
        __extends(MockModelService, _super);
        function MockModelService() {
            _super.apply(this, arguments);
        }
        return MockModelService;
    })(modelServiceImpl_1.ModelServiceImpl);
    function createMockModeService() {
        var threadService = nullThreadService_1.NULL_THREAD_SERVICE;
        var pluginService = new MockPluginService();
        var modeService = new MockModeService(threadService, pluginService);
        var inst = InstantiationService.create({
            threadService: threadService,
            pluginService: pluginService,
            modeService: modeService
        });
        threadService.setInstantiationService(inst);
        return modeService;
    }
    exports.createMockModeService = createMockModeService;
    function createMockModelService() {
        var threadService = nullThreadService_1.NULL_THREAD_SERVICE;
        var modelService = new MockModelService(threadService, null);
        return modelService;
    }
    exports.createMockModelService = createMockModelService;
});
//# sourceMappingURL=servicesTestUtils.js.map