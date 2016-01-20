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
define(["require", "exports", 'vs/platform/telemetry/common/abstractRemoteTelemetryService'], function (require, exports, abstractRemoteTelemetryService_1) {
    var WorkerTelemetryService = (function (_super) {
        __extends(WorkerTelemetryService, _super);
        function WorkerTelemetryService() {
            _super.apply(this, arguments);
        }
        WorkerTelemetryService.prototype.handleEvent = function (eventName, data) {
            var data = data || {};
            data['workerTelemetry'] = true;
            _super.prototype.handleEvent.call(this, eventName, data);
        };
        return WorkerTelemetryService;
    })(abstractRemoteTelemetryService_1.AbstractRemoteTelemetryService);
    exports.WorkerTelemetryService = WorkerTelemetryService;
});
//# sourceMappingURL=workerTelemetryService.js.map