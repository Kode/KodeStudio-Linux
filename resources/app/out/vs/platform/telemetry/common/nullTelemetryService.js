/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/platform/telemetry/common/telemetry'], function (require, exports, telemetry_1) {
    var NullTelemetryService = (function () {
        function NullTelemetryService() {
            this.serviceId = telemetry_1.ITelemetryService;
            this.sessionId = null;
            this.instanceId = null;
            this.machineId = null;
        }
        NullTelemetryService.prototype.publicLog = function (eventName, data) {
        };
        NullTelemetryService.prototype.start = function (name, data) {
            return null;
        };
        NullTelemetryService.prototype.getAppendersCount = function () {
            return -1;
        };
        NullTelemetryService.prototype.getAppenders = function () {
            return [];
        };
        NullTelemetryService.prototype.addTelemetryAppender = function (appender) {
        };
        NullTelemetryService.prototype.removeTelemetryAppender = function (appender) {
        };
        NullTelemetryService.prototype.dispose = function () {
        };
        NullTelemetryService.prototype.getSessionId = function () {
            return this.sessionId;
        };
        NullTelemetryService.prototype.getMachineId = function () {
            return this.machineId;
        };
        NullTelemetryService.prototype.getInstanceId = function () {
            return this.instanceId;
        };
        NullTelemetryService.prototype.getTelemetryInfo = function () {
            return Promise.resolve({
                instanceId: this.instanceId,
                sessionId: this.sessionId,
                machineId: this.machineId
            });
        };
        NullTelemetryService.prototype.setInstantiationService = function (instantiationService) {
        };
        return NullTelemetryService;
    })();
    exports.NullTelemetryService = NullTelemetryService;
});
//# sourceMappingURL=nullTelemetryService.js.map