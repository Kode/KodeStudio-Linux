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
define(["require", "exports", 'vs/nls', 'vs/platform/configuration/common/configurationRegistry', 'vs/platform/configuration/common/configuration', 'vs/platform/telemetry/common/telemetry', 'vs/platform/platform', 'electron'], function (require, exports, nls, configurationRegistry_1, configuration_1, telemetry_1, platform_1, electron_1) {
    var TELEMETRY_SECTION_ID = 'telemetry';
    var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration);
    configurationRegistry.registerConfiguration({
        'id': TELEMETRY_SECTION_ID,
        'order': 20,
        'type': 'object',
        'title': nls.localize('telemetryConfigurationTitle', "Telemetry configuration"),
        'properties': {
            'telemetry.enableCrashReporter': {
                'type': 'boolean',
                'description': nls.localize('telemetry.enableCrashReporting', "Enable crash reports to be sent to Microsoft.\n\t// This option requires restart of VSCode to take effect."),
                'default': false
            }
        }
    });
    var CrashReporter = (function () {
        function CrashReporter(version, commit, telemetryService, configurationService) {
            this.telemetryService = telemetryService;
            this.configurationService = configurationService;
            this.configurationService = configurationService;
            this.telemetryService = telemetryService;
            this.sessionId = this.telemetryService ? this.telemetryService.getSessionId() : null;
            this.version = version;
            this.commit = commit;
            this.isStarted = false;
            this.config = null;
        }
        CrashReporter.prototype.start = function (rawConfiguration) {
            var _this = this;
            if (!this.isStarted) {
                if (!this.config) {
                    this.configurationService.loadConfiguration(TELEMETRY_SECTION_ID).done(function (c) {
                        _this.config = c;
                        if (_this.config && _this.config.enableCrashReporter) {
                            _this.doStart(rawConfiguration);
                        }
                    });
                }
                else {
                    if (this.config.enableCrashReporter) {
                        this.doStart(rawConfiguration);
                    }
                }
            }
        };
        CrashReporter.prototype.doStart = function (rawConfiguration) {
            var config = this.toConfiguration(rawConfiguration);
            electron_1.crashReporter.start(config);
            //notify the main process to start the crash reporter
            electron_1.ipcRenderer.send('vscode:startCrashReporter', config);
        };
        CrashReporter.prototype.toConfiguration = function (rawConfiguration) {
            var _this = this;
            return JSON.parse(JSON.stringify(rawConfiguration, function (key, value) {
                if (value === '$(sessionId)') {
                    return _this.sessionId;
                }
                if (value === '$(version)') {
                    return _this.version;
                }
                if (value === '$(commit)') {
                    return _this.commit;
                }
                return value;
            }));
        };
        CrashReporter = __decorate([
            __param(2, telemetry_1.ITelemetryService),
            __param(3, configuration_1.IConfigurationService)
        ], CrashReporter);
        return CrashReporter;
    })();
    exports.CrashReporter = CrashReporter;
});
//# sourceMappingURL=crashReporter.js.map