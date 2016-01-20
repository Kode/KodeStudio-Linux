/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/errors', 'vs/base/common/types', 'vs/base/common/platform', 'vs/base/common/timer', 'vs/base/common/objects', 'vs/platform/platform', 'vs/platform/telemetry/common/telemetry'], function (require, exports, Errors, Types, Platform, timer_1, objects_1, platform_1, telemetry_1) {
    /**
     * Base class for main process telemetry services
     */
    var AbstractTelemetryService = (function () {
        function AbstractTelemetryService() {
            var _this = this;
            this.serviceId = telemetry_1.ITelemetryService;
            this.sessionId = 'SESSION_ID_NOT_SET';
            this.timeKeeper = new timer_1.TimeKeeper();
            this.toUnbind = [];
            this.appenders = [];
            this.timeKeeperListener = function (events) { return _this.onTelemetryTimerEventStop(events); };
            this.timeKeeper.addListener(this.timeKeeperListener);
            this.toUnbind.push(Errors.errorHandler.addListener(this.onErrorEvent.bind(this)));
            this.errorBuffer = Object.create(null);
            this.enableGlobalErrorHandler();
            this.errorFlushTimeout = -1;
        }
        AbstractTelemetryService.prototype._safeStringify = function (data) {
            return objects_1.safeStringify(data);
        };
        AbstractTelemetryService.prototype.onTelemetryTimerEventStop = function (events) {
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var data = event.data || {};
                data.duration = event.timeTaken();
                this.publicLog(event.name, data);
            }
        };
        AbstractTelemetryService.prototype.onErrorEvent = function (e) {
            var error = Object.create(null);
            // unwrap nested errors from loader
            if (e.detail && e.detail.stack) {
                e = e.detail;
            }
            // work around behavior in workerServer.ts that breaks up Error.stack
            var stack = Array.isArray(e.stack) ? e.stack.join('\n') : e.stack;
            var message = e.message ? e.message : this._safeStringify(e);
            // errors without a stack are not useful telemetry
            if (!stack) {
                return;
            }
            error['message'] = this.cleanupInfo(message);
            error['stack'] = this.cleanupInfo(stack);
            this.addErrortoBuffer(error);
        };
        AbstractTelemetryService.prototype.addErrortoBuffer = function (e) {
            if (this.errorBuffer[e.stack]) {
                this.errorBuffer[e.stack].count++;
            }
            else {
                e.count = 1;
                this.errorBuffer[e.stack] = e;
            }
            this.tryScheduleErrorFlush();
        };
        AbstractTelemetryService.prototype.tryScheduleErrorFlush = function () {
            var _this = this;
            if (this.errorFlushTimeout === -1) {
                this.errorFlushTimeout = setTimeout(function () { return _this.flushErrorBuffer(); }, AbstractTelemetryService.ERROR_FLUSH_TIMEOUT);
            }
        };
        AbstractTelemetryService.prototype.flushErrorBuffer = function () {
            if (this.errorBuffer) {
                for (var stack in this.errorBuffer) {
                    this.publicLog('UnhandledError', this.errorBuffer[stack]);
                }
            }
            this.errorBuffer = Object.create(null);
            this.errorFlushTimeout = -1;
        };
        AbstractTelemetryService.prototype.cleanupInfo = function (stack) {
            // `file:///DANGEROUS/PATH/resources/app/Useful/Information`
            var reg = /file:\/\/\/.*?\/resources\/app\//gi;
            stack = stack.replace(reg, '');
            // Any other file path that doesn't match the approved form above should be cleaned.
            reg = /file:\/\/\/.*/gi;
            stack = stack.replace(reg, '');
            // "Error: ENOENT; no such file or directory" is often followed with PII, clean it
            reg = /ENOENT: no such file or directory.*?\'([^\']+)\'/gi;
            stack = stack.replace(reg, 'ENOENT: no such file or directory');
            return stack;
        };
        AbstractTelemetryService.prototype.enableGlobalErrorHandler = function () {
            if (Types.isFunction(Platform.globals.onerror)) {
                this.oldOnError = Platform.globals.onerror;
            }
            var that = this;
            var newHandler = function (message, filename, line, column, e) {
                that.onUncaughtError(message, filename, line, column, e);
                if (that.oldOnError) {
                    that.oldOnError.apply(this, arguments);
                }
            };
            Platform.globals.onerror = newHandler;
        };
        AbstractTelemetryService.prototype.onUncaughtError = function (message, filename, line, column, e) {
            filename = this.cleanupInfo(filename);
            message = this.cleanupInfo(message);
            var data = {
                message: message,
                filename: filename,
                line: line,
                column: column
            };
            if (e) {
                data.error = {
                    name: e.name,
                    message: e.message
                };
                if (e.stack) {
                    if (Array.isArray(e.stack)) {
                        e.stack = e.stack.join('\n');
                    }
                    data.stack = this.cleanupInfo(e.stack);
                }
            }
            if (!data.stack) {
                data.stack = data.message;
            }
            this.addErrortoBuffer(data);
        };
        AbstractTelemetryService.prototype.loadTelemetryAppendersFromRegistery = function () {
            var appendersRegistry = platform_1.Registry.as(exports.Extenstions.TelemetryAppenders).getTelemetryAppenderDescriptors();
            for (var i = 0; i < appendersRegistry.length; i++) {
                var descriptor = appendersRegistry[i];
                var appender = this.instantiationService.createInstance(descriptor);
                this.addTelemetryAppender(appender);
            }
        };
        AbstractTelemetryService.prototype.getSessionId = function () {
            return this.sessionId;
        };
        AbstractTelemetryService.prototype.getMachineId = function () {
            return this.machineId;
        };
        AbstractTelemetryService.prototype.getInstanceId = function () {
            return this.instanceId;
        };
        AbstractTelemetryService.prototype.getTelemetryInfo = function () {
            return Promise.resolve({
                instanceId: this.instanceId,
                sessionId: this.sessionId,
                machineId: this.machineId
            });
        };
        AbstractTelemetryService.prototype.dispose = function () {
            if (this.errorFlushTimeout !== -1) {
                clearTimeout(this.errorFlushTimeout);
                this.flushErrorBuffer();
            }
            while (this.toUnbind.length) {
                this.toUnbind.pop()();
            }
            this.timeKeeper.removeListener(this.timeKeeperListener);
            this.timeKeeper.dispose();
            for (var i = 0; i < this.appenders.length; i++) {
                this.appenders[i].dispose();
            }
        };
        AbstractTelemetryService.prototype.start = function (name, data) {
            var topic = 'public';
            var event = this.timeKeeper.start(topic, name);
            if (data) {
                event.data = data;
            }
            return event;
        };
        AbstractTelemetryService.prototype.publicLog = function (eventName, data) {
            this.handleEvent(eventName, data);
        };
        AbstractTelemetryService.prototype.getAppendersCount = function () {
            return this.appenders.length;
        };
        AbstractTelemetryService.prototype.getAppenders = function () {
            return this.appenders;
        };
        AbstractTelemetryService.prototype.addTelemetryAppender = function (appender) {
            this.appenders.push(appender);
        };
        AbstractTelemetryService.prototype.removeTelemetryAppender = function (appender) {
            var index = this.appenders.indexOf(appender);
            if (index > -1) {
                this.appenders.splice(index, 1);
            }
        };
        AbstractTelemetryService.prototype.setInstantiationService = function (instantiationService) {
            this.instantiationService = instantiationService;
            if (this.instantiationService) {
                this.loadTelemetryAppendersFromRegistery();
            }
        };
        AbstractTelemetryService.prototype.handleEvent = function (eventName, data) {
            throw new Error('Not implemented!');
        };
        AbstractTelemetryService.ERROR_FLUSH_TIMEOUT = 5 * 1000;
        return AbstractTelemetryService;
    })();
    exports.AbstractTelemetryService = AbstractTelemetryService;
    exports.Extenstions = {
        TelemetryAppenders: 'telemetry.appenders'
    };
    var TelemetryAppendersRegistry = (function () {
        function TelemetryAppendersRegistry() {
            this.telemetryAppenderDescriptors = [];
        }
        TelemetryAppendersRegistry.prototype.registerTelemetryAppenderDescriptor = function (descriptor) {
            this.telemetryAppenderDescriptors.push(descriptor);
        };
        TelemetryAppendersRegistry.prototype.getTelemetryAppenderDescriptors = function () {
            return this.telemetryAppenderDescriptors;
        };
        return TelemetryAppendersRegistry;
    })();
    platform_1.Registry.add(exports.Extenstions.TelemetryAppenders, new TelemetryAppendersRegistry());
});
//# sourceMappingURL=abstractTelemetryService.js.map