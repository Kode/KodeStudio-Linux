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
    var ExtHostTelemetryService = (function (_super) {
        __extends(ExtHostTelemetryService, _super);
        function ExtHostTelemetryService() {
            _super.apply(this, arguments);
        }
        ExtHostTelemetryService.prototype.handleEvent = function (eventName, data) {
            data = data || {};
            data['pluginHostTelemetry'] = true;
            _super.prototype.handleEvent.call(this, eventName, data);
        };
        return ExtHostTelemetryService;
    })(abstractRemoteTelemetryService_1.AbstractRemoteTelemetryService);
    exports.ExtHostTelemetryService = ExtHostTelemetryService;
});
//# sourceMappingURL=extHostTelemetry.js.map