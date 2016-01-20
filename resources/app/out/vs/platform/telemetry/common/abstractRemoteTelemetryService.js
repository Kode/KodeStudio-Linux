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
define(["require", "exports", 'vs/platform/telemetry/common/abstractTelemetryService', 'vs/platform/telemetry/common/telemetry', 'vs/platform/thread/common/thread'], function (require, exports, AbstractTelemetryService, telemetry_1, thread_1) {
    /**
     * Helper always instantiated in the main process to receive telemetry events from remote telemetry services
     */
    var RemoteTelemetryServiceHelper = (function () {
        function RemoteTelemetryServiceHelper(telemetryService) {
            this._telemetryService = telemetryService;
        }
        RemoteTelemetryServiceHelper.prototype._handleRemoteTelemetryEvent = function (eventName, data) {
            this._telemetryService.publicLog(eventName, data);
        };
        RemoteTelemetryServiceHelper.prototype.getTelemetryInfo = function () {
            return this._telemetryService.getTelemetryInfo();
        };
        RemoteTelemetryServiceHelper = __decorate([
            thread_1.Remotable.MainContext('RemoteTelemetryServiceHelper'),
            __param(0, telemetry_1.ITelemetryService)
        ], RemoteTelemetryServiceHelper);
        return RemoteTelemetryServiceHelper;
    })();
    exports.RemoteTelemetryServiceHelper = RemoteTelemetryServiceHelper;
    /**
     * Base class for remote telemetry services (instantiated in plugin host or in web workers)
     */
    var AbstractRemoteTelemetryService = (function (_super) {
        __extends(AbstractRemoteTelemetryService, _super);
        function AbstractRemoteTelemetryService(threadService) {
            // Log all events including public, since they will be forwarded to the main which will do the real filtering
            _super.call(this);
            this._proxy = threadService.getRemotable(RemoteTelemetryServiceHelper);
        }
        AbstractRemoteTelemetryService.prototype.getTelemetryInfo = function () {
            return this._proxy.getTelemetryInfo();
        };
        AbstractRemoteTelemetryService.prototype.addTelemetryAppender = function (appender) {
            throw new Error('Telemetry appenders are not supported in this execution envirnoment');
        };
        AbstractRemoteTelemetryService.prototype.handleEvent = function (eventName, data) {
            this._proxy._handleRemoteTelemetryEvent(eventName, data);
        };
        return AbstractRemoteTelemetryService;
    })(AbstractTelemetryService.AbstractTelemetryService);
    exports.AbstractRemoteTelemetryService = AbstractRemoteTelemetryService;
});
//# sourceMappingURL=abstractRemoteTelemetryService.js.map