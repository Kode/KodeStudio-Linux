/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
define(["require", "exports", 'vs/base/common/errors', 'vs/base/common/types', 'vs/base/common/objects', 'vs/platform/storage/common/storage', 'vs/platform/workspace/common/workspace', 'winreg', 'os', 'applicationinsights'], function (require, exports, errors, types, objects_1, storage_1, workspace_1, winreg, os, appInsights) {
    var StorageKeys = (function () {
        function StorageKeys() {
        }
        StorageKeys.sqmUserId = 'telemetry.sqm.userId';
        StorageKeys.sqmMachineId = 'telemetry.sqm.machineId';
        StorageKeys.lastSessionDate = 'telemetry.lastSessionDate';
        StorageKeys.firstSessionDate = 'telemetry.firstSessionDate';
        return StorageKeys;
    })();
    var NodeAppInsightsTelemetryAppender = (function () {
        function NodeAppInsightsTelemetryAppender(storageService, contextService, 
            /* for test only */
            client) {
            this.addCommonMetrics = function (metrics) {
                for (var prop in this.commonMetrics) {
                    metrics['common.' + prop] = this.commonMetrics[prop];
                }
                return metrics;
            };
            this.commonProperties = {};
            this.commonMetrics = {};
            this.contextService = contextService;
            this.storageService = storageService;
            var config = this.contextService.getConfiguration().env.aiConfig;
            var key = config ? config.key : null;
            var asimovKey = config ? config.asimovKey : null;
            // for test
            if (client) {
                this.appInsights = client;
                if (asimovKey) {
                    this.appInsightsVortex = client;
                }
                return;
            }
            if (key) {
                this.appInsights = appInsights.setup(key)
                    .setAutoCollectRequests(false)
                    .setAutoCollectPerformance(false)
                    .setAutoCollectExceptions(false)
                    .setOfflineMode(true)
                    .start()
                    .client;
                this.setupAIClient(this.appInsights);
            }
            if (asimovKey) {
                this.appInsightsVortex = appInsights.getClient(asimovKey);
                this.appInsightsVortex.config.endpointUrl = "https://vortex.data.microsoft.com/collect/v1";
                this.setupAIClient(this.appInsightsVortex);
            }
            this.loadAddtionaProperties();
        }
        NodeAppInsightsTelemetryAppender.prototype.setupAIClient = function (client) {
            //prevent App Insights from reporting machine name
            if (client && client.context &&
                client.context.keys && client.context.tags) {
                var machineNameKey = client.context.keys.deviceMachineName;
                client.context.tags[machineNameKey] = '';
            }
        };
        NodeAppInsightsTelemetryAppender.prototype.loadAddtionaProperties = function () {
            var _this = this;
            // add shell & render version
            if (process.versions) {
                this.commonProperties['version.shell'] = process.versions['electron'];
                this.commonProperties['version.renderer'] = process.versions['chrome'];
            }
            // add SQM data for windows machines
            if (process.platform === 'win32') {
                var sqmUserId = this.storageService.get(StorageKeys.sqmUserId);
                if (sqmUserId) {
                    this.commonProperties['sqm.userid'] = sqmUserId;
                }
                else {
                    this.getWinRegKeyData(NodeAppInsightsTelemetryAppender.SQM_KEY, 'UserId', winreg.HKCU, function (error, result) {
                        if (!error && result) {
                            _this.commonProperties['sqm.userid'] = result;
                            _this.storageService.store(StorageKeys.sqmUserId, result);
                        }
                    });
                }
                var sqmMachineId = this.storageService.get(StorageKeys.sqmMachineId);
                if (sqmMachineId) {
                    this.commonProperties['sqm.machineid'] = sqmMachineId;
                }
                else {
                    this.getWinRegKeyData(NodeAppInsightsTelemetryAppender.SQM_KEY, 'MachineId', winreg.HKLM, function (error, result) {
                        if (!error && result) {
                            _this.commonProperties['sqm.machineid'] = result;
                            _this.storageService.store(StorageKeys.sqmMachineId, result);
                        }
                    });
                }
            }
            var firstSessionDate = this.storageService.get(StorageKeys.firstSessionDate);
            if (!firstSessionDate) {
                firstSessionDate = (new Date()).toUTCString();
                this.storageService.store(StorageKeys.firstSessionDate, firstSessionDate);
            }
            this.commonProperties['firstSessionDate'] = firstSessionDate;
            //report last session date and isNewSession flag
            var lastSessionDate = this.storageService.get(StorageKeys.lastSessionDate);
            if (!lastSessionDate) {
                this.commonMetrics['isNewSession'] = 1;
            }
            else {
                this.commonMetrics['isNewSession'] = 0;
                this.commonProperties['lastSessionDate'] = lastSessionDate;
            }
            this.storageService.store(StorageKeys.lastSessionDate, (new Date()).toUTCString());
            if (os) {
                this.commonProperties['osVersion'] = os.release();
            }
        };
        NodeAppInsightsTelemetryAppender.prototype.getWinRegKeyData = function (key, name, hive, callback) {
            if (process.platform === 'win32') {
                try {
                    var reg = new winreg({
                        hive: hive,
                        key: key
                    });
                    reg.get(name, function (e, result) {
                        if (e || !result) {
                            callback(e, null);
                        }
                        else {
                            callback(null, result.value);
                        }
                    });
                }
                catch (err) {
                    errors.onUnexpectedError(err);
                    callback(err, null);
                }
            }
            else {
                callback(null, null);
            }
        };
        NodeAppInsightsTelemetryAppender.prototype.getData = function (data) {
            var properties = {};
            var measurements = {};
            var event_data = this.flaten(data);
            for (var prop in event_data) {
                // enforce property names less than 150 char, take the last 150 char
                var propName = prop && prop.length > 150 ? prop.substr(prop.length - 149) : prop;
                var property = event_data[prop];
                if (types.isNumber(property)) {
                    measurements[propName] = property;
                }
                else if (types.isBoolean(property)) {
                    measurements[propName] = property ? 1 : 0;
                }
                else if (types.isString(property)) {
                    //enforce proeprty value to be less than 1024 char, take the first 1024 char
                    var propValue = property && property.length > 1024 ? property.substring(0, 1023) : property;
                    properties[propName] = propValue;
                }
                else if (!types.isUndefined(property) && property !== null) {
                    properties[propName] = property;
                }
            }
            properties = this.addCommonProperties(properties);
            measurements = this.addCommonMetrics(measurements);
            return {
                properties: properties,
                measurements: measurements
            };
        };
        NodeAppInsightsTelemetryAppender.prototype.flaten = function (obj, order, prefix) {
            if (order === void 0) { order = 0; }
            var result = {};
            var properties = obj ? Object.getOwnPropertyNames(obj) : [];
            for (var i = 0; i < properties.length; i++) {
                var item = properties[i];
                var index = prefix ? prefix + item : item;
                if (types.isArray(obj[item])) {
                    try {
                        result[index] = objects_1.safeStringify(obj[item]);
                    }
                    catch (e) {
                        // workaround for catching the edge case for #18383
                        // safe stringfy should never throw circular object exception
                        result[index] = '[Circular-Array]';
                    }
                }
                else if (obj[item] instanceof Date) {
                    result[index] = obj[item].toISOString();
                }
                else if (types.isObject(obj[item])) {
                    if (order < 2) {
                        var item_result = this.flaten(obj[item], order + 1, index + '.');
                        for (var prop in item_result) {
                            result[prop] = item_result[prop];
                        }
                    }
                    else {
                        try {
                            result[index] = objects_1.safeStringify(obj[item]);
                        }
                        catch (e) {
                            // workaround for catching the edge case for #18383
                            // safe stringfy should never throw circular object exception
                            result[index] = '[Circular]';
                        }
                    }
                }
                else {
                    result[index] = obj[item];
                }
            }
            return result;
        };
        NodeAppInsightsTelemetryAppender.prototype.log = function (eventName, data) {
            var result = this.getData(data);
            if (this.appInsights) {
                if (eventName === 'UnhandledError' && data) {
                    this.appInsights.trackException(data);
                }
                this.appInsights.trackEvent(NodeAppInsightsTelemetryAppender.EVENT_NAME_PREFIX + eventName, result.properties, result.measurements);
            }
            if (this.appInsightsVortex) {
                if (eventName === 'UnhandledError' && data) {
                    this.appInsightsVortex.trackException(data);
                }
                this.appInsightsVortex.trackEvent(NodeAppInsightsTelemetryAppender.EVENT_NAME_PREFIX + eventName, result.properties, result.measurements);
            }
        };
        NodeAppInsightsTelemetryAppender.prototype.dispose = function () {
            this.appInsights = null;
            this.appInsightsVortex = null;
        };
        NodeAppInsightsTelemetryAppender.prototype.addCommonProperties = function (properties) {
            for (var prop in this.commonProperties) {
                properties['common.' + prop] = this.commonProperties[prop];
            }
            return properties;
        };
        NodeAppInsightsTelemetryAppender.EVENT_NAME_PREFIX = 'monacoworkbench/';
        NodeAppInsightsTelemetryAppender.SQM_KEY = '\\Software\\Microsoft\\SQMClient';
        NodeAppInsightsTelemetryAppender = __decorate([
            __param(0, storage_1.IStorageService),
            __param(1, workspace_1.IWorkspaceContextService)
        ], NodeAppInsightsTelemetryAppender);
        return NodeAppInsightsTelemetryAppender;
    })();
    exports.NodeAppInsightsTelemetryAppender = NodeAppInsightsTelemetryAppender;
});
//# sourceMappingURL=nodeAppInsightsTelemetryAppender.js.map