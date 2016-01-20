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
define(["require", "exports", 'vs/base/common/platform', 'vs/base/common/objects', 'vs/base/common/uuid', 'vs/platform/telemetry/common/abstractTelemetryService', 'vs/base/browser/idleMonitor'], function (require, exports, Platform, Objects, uuid, abstractTelemetryService_1, idleMonitor_1) {
    var DefaultTelemetryServiceConfig = {
        enableTelemetry: true,
        enableHardIdle: true,
        enableSoftIdle: true
    };
    var MainTelemetryService = (function (_super) {
        __extends(MainTelemetryService, _super);
        function MainTelemetryService(config) {
            var _this = this;
            this.config = Objects.withDefaults(config, DefaultTelemetryServiceConfig);
            _super.call(this);
            this.sessionId = this.config.sessionID || (uuid.generateUuid() + Date.now());
            if (this.config.enableHardIdle) {
                this.hardIdleMonitor = new idleMonitor_1.IdleMonitor();
            }
            if (this.config.enableSoftIdle) {
                this.softIdleMonitor = new idleMonitor_1.IdleMonitor(MainTelemetryService.SOFT_IDLE_TIME);
                this.softIdleMonitor.addOneTimeActiveListener(function () { return _this.onUserActive(); });
                this.softIdleMonitor.addOneTimeIdleListener(function () { return _this.onUserIdle(); });
            }
            this.eventCount = 0;
            this.startTime = new Date();
        }
        MainTelemetryService.prototype.onUserIdle = function () {
            var _this = this;
            this.publicLog(MainTelemetryService.IDLE_START_EVENT_NAME);
            this.softIdleMonitor.addOneTimeIdleListener(function () { return _this.onUserIdle(); });
        };
        MainTelemetryService.prototype.onUserActive = function () {
            var _this = this;
            this.publicLog(MainTelemetryService.IDLE_STOP_EVENT_NAME);
            this.softIdleMonitor.addOneTimeActiveListener(function () { return _this.onUserActive(); });
        };
        MainTelemetryService.prototype.dispose = function () {
            if (this.hardIdleMonitor) {
                this.hardIdleMonitor.dispose();
            }
            if (this.softIdleMonitor) {
                this.softIdleMonitor.dispose();
            }
            _super.prototype.dispose.call(this);
        };
        MainTelemetryService.prototype.handleEvent = function (eventName, data) {
            if (this.hardIdleMonitor && this.hardIdleMonitor.getStatus() === idleMonitor_1.UserStatus.Idle) {
                return;
            }
            // don't send telemetry when not enabled
            if (!this.config.enableTelemetry) {
                return;
            }
            this.eventCount++;
            data = this.addCommonProperties(data);
            var allAppenders = this.getAppenders();
            for (var i = 0; i < allAppenders.length; i++) {
                allAppenders[i].log(eventName, data);
            }
        };
        MainTelemetryService.prototype.addCommonProperties = function (data) {
            data = data || {};
            var eventDate = new Date();
            data['sessionID'] = this.sessionId;
            data['timestamp'] = eventDate;
            data['version'] = this.config.version;
            data['userId'] = this.userIdHash;
            data['commitHash'] = this.config.commitHash;
            data['common.platform'] = Platform.Platform[Platform.platform];
            data['common.timesincesessionstart'] = (eventDate.getTime() - this.startTime.getTime());
            data['common.sequence'] = this.eventCount;
            data['common.instanceId'] = this.instanceId;
            data['common.machineId'] = this.machineId;
            return data;
        };
        // how long of inactivity before a user is considered 'inactive' - 2 minutes
        MainTelemetryService.SOFT_IDLE_TIME = 2 * 60 * 1000;
        MainTelemetryService.IDLE_START_EVENT_NAME = 'UserIdleStart';
        MainTelemetryService.IDLE_STOP_EVENT_NAME = 'UserIdleStop';
        return MainTelemetryService;
    })(abstractTelemetryService_1.AbstractTelemetryService);
    exports.MainTelemetryService = MainTelemetryService;
});
//# sourceMappingURL=mainTelemetryService.js.map