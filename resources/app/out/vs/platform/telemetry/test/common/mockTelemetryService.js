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
define(["require", "exports", 'vs/platform/telemetry/common/abstractTelemetryService'], function (require, exports, abstractTelemetryService_1) {
    var MockTelemetryService = (function (_super) {
        __extends(MockTelemetryService, _super);
        function MockTelemetryService() {
            _super.apply(this, arguments);
        }
        return MockTelemetryService;
    })(abstractTelemetryService_1.AbstractTelemetryService);
    exports.MockTelemetryService = MockTelemetryService;
});
//# sourceMappingURL=mockTelemetryService.js.map