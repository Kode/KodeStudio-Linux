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
define(["require", "exports", 'vs/base/common/errors', 'vs/base/common/uri', 'vs/base/common/winjs.base', 'vs/workbench/parts/execution/common/execution', 'vs/platform/configuration/common/configuration', 'vs/platform/message/common/message', 'child_process'], function (require, exports, errors, uri_1, winjs_base_1, execution_1, configuration_1, message_1, cp) {
    var WinTerminalService = (function () {
        function WinTerminalService(_configurationService, _messageService) {
            this._configurationService = _configurationService;
            this._messageService = _messageService;
            this.serviceId = execution_1.ITerminalService;
        }
        WinTerminalService.prototype.openTerminal = function (path) {
            cp.spawn('cmd.exe', ['/c', 'start', '/wait'], { cwd: path });
        };
        WinTerminalService = __decorate([
            __param(0, configuration_1.IConfigurationService),
            __param(1, message_1.IMessageService)
        ], WinTerminalService);
        return WinTerminalService;
    })();
    exports.WinTerminalService = WinTerminalService;
    var MacTerminalService = (function () {
        function MacTerminalService() {
            this.serviceId = execution_1.ITerminalService;
        }
        MacTerminalService.prototype.openTerminal = function (path) {
            this.getTerminalHelperScriptPath().done(function (helperPath) {
                cp.spawn('/usr/bin/osascript', [helperPath, path]);
            }, errors.onUnexpectedError);
        };
        MacTerminalService.prototype.getTerminalHelperScriptPath = function () {
            if (this._terminalApplicationScriptPath) {
                return this._terminalApplicationScriptPath;
            }
            return this._terminalApplicationScriptPath = new winjs_base_1.TPromise(function (c, e) {
                var child = cp.spawn('/usr/bin/osascript', ['-e', 'exists application "iTerm"']);
                child.on('error', e);
                child.on('exit', function (code) {
                    c(code === 0 ? 'iterm.scpt' : 'terminal.scpt');
                });
            }).then(function (name) { return uri_1.default.parse(require.toUrl("vs/workbench/parts/execution/electron-browser/" + name)).fsPath; });
        };
        return MacTerminalService;
    })();
    exports.MacTerminalService = MacTerminalService;
    var LinuxTerminalService = (function () {
        function LinuxTerminalService() {
            this.serviceId = execution_1.ITerminalService;
        }
        LinuxTerminalService.prototype.openTerminal = function (path) {
            cp.spawn('x-terminal-emulator', [], { cwd: path });
        };
        return LinuxTerminalService;
    })();
    exports.LinuxTerminalService = LinuxTerminalService;
});
//# sourceMappingURL=terminalService.js.map