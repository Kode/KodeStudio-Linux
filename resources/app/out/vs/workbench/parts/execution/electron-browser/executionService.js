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
define(["require", "exports", 'vs/nls', 'vs/base/common/errors', 'vs/base/common/hash', 'vs/base/common/winjs.base', 'vs/base/common/objects', 'vs/base/common/strings', 'vs/workbench/parts/execution/common/execution', 'vs/base/common/uri', 'child_process'], function (require, exports, nls, errors, hash, winjs_base_1, objects, strings, exec, uri_1, cp) {
    var AbstractExecutionService = (function () {
        function AbstractExecutionService() {
            this.serviceId = exec.IExecutionService;
            this._executions = Object.create(null);
        }
        AbstractExecutionService.prototype.exec = function (file, args, cwdOrOptions) {
            var options, allEnv = objects.clone(process.env);
            if (typeof cwdOrOptions === 'string') {
                options = {
                    cwd: cwdOrOptions,
                    env: allEnv
                };
            }
            else {
                objects.mixin(allEnv, cwdOrOptions.env);
                cwdOrOptions.env = allEnv;
                options = cwdOrOptions;
            }
            var key = args.concat([file, options.cwd]).reduce(function (p, c) { return hash.combine(hash.computeMurmur2StringHashCode(c), p); }, 17);
            if (this._executions[key]) {
                this._executions[key].cancel();
                delete this._executions[key];
            }
            var ret = this.doExec(file, args, options);
            this._executions[key] = ret;
            return ret.then(function (val) { return val; }, function (err) {
                if (!errors.isPromiseCanceledError(err)) {
                    throw err;
                }
            });
        };
        AbstractExecutionService.prototype.doExec = function (file, args, options) {
            throw errors.notImplemented();
        };
        return AbstractExecutionService;
    })();
    exports.AbstractExecutionService = AbstractExecutionService;
    var WinExecutionService = (function (_super) {
        __extends(WinExecutionService, _super);
        function WinExecutionService() {
            _super.apply(this, arguments);
        }
        WinExecutionService.prototype.doExec = function (file, args, options) {
            var childProcess;
            return new winjs_base_1.TPromise(function (c, e, p) {
                // we use `start` to get another cmd.exe where `& pause` can be handled
                args = [
                    '/c',
                    'start',
                    '/wait',
                    'cmd.exe',
                    '/c',
                    strings.format('"{0} {1} & pause"', file, args.join(' '))
                ];
                options = options || {};
                options.windowsVerbatimArguments = true;
                childProcess = cp.spawn('cmd.exe', args, options);
                childProcess.on('exit', c);
                childProcess.on('error', e);
                // send out the process once
                p(childProcess);
            }, function () {
                if (!childProcess) {
                    return;
                }
                cp.exec("taskkill /F /T /PID " + childProcess.pid, function (err, stdout, stderr) {
                    if (err) {
                        console.error(err);
                    }
                });
            });
        };
        return WinExecutionService;
    })(AbstractExecutionService);
    exports.WinExecutionService = WinExecutionService;
    var MacExecutionService = (function (_super) {
        __extends(MacExecutionService, _super);
        function MacExecutionService() {
            _super.apply(this, arguments);
        }
        MacExecutionService.prototype.doExec = function (file, args, options) {
            var childProcess;
            return new winjs_base_1.TPromise(function (c, e, p) {
                args = [
                    uri_1.default.parse(require.toUrl('vs/workbench/parts/execution/electron-browser/macHelper.scpt')).fsPath,
                    'cd', ("'" + options.cwd + "'"), ';',
                    file
                ].concat(args);
                childProcess = cp.spawn('/usr/bin/osascript', args, options);
                childProcess.on('exit', c);
                childProcess.on('error', e);
                // send out the process once
                p(childProcess);
            }, function () {
                if (childProcess) {
                    childProcess.kill('SIGTERM');
                }
            });
        };
        return MacExecutionService;
    })(AbstractExecutionService);
    exports.MacExecutionService = MacExecutionService;
    var LinuxExecutionService = (function (_super) {
        __extends(LinuxExecutionService, _super);
        function LinuxExecutionService() {
            _super.apply(this, arguments);
        }
        LinuxExecutionService.prototype.doExec = function (file, args, options) {
            var childProcess;
            return new winjs_base_1.TPromise(function (c, e, p) {
                var flattenedArgs = '';
                if (args.length > 0) {
                    flattenedArgs = '"' + args.join('" "') + '"';
                }
                var cdCommand = '';
                if (options.cwd) {
                    cdCommand = strings.format('cd "{0}"', options.cwd);
                }
                var bashCommand = strings.format('{0}; "{1}" {2} ; echo; read -p "{3}" -n1;', cdCommand, file, flattenedArgs, LinuxExecutionService.WAIT_MESSAGE);
                args = [
                    '-x',
                    'bash',
                    '-c',
                    // wrapping argument in two sets of ' because node is so "friendly" that it removes one set...
                    strings.format('\'\'{0}\'\'', bashCommand)
                ];
                childProcess = cp.spawn(LinuxExecutionService.LINUX_TERM, args, options);
                childProcess.on('exit', c);
                childProcess.on('error', e);
                // send out the process once
                p(childProcess);
            }, function () {
                console.log('SENDING KILL');
                if (childProcess) {
                    childProcess.kill('SIGTERM');
                }
            });
        };
        LinuxExecutionService.LINUX_TERM = '/usr/bin/gnome-terminal'; // '/usr/bin/x-terminal-emulator'
        LinuxExecutionService.WAIT_MESSAGE = nls.localize('linux.wait', "Press any key to continue...");
        return LinuxExecutionService;
    })(AbstractExecutionService);
    exports.LinuxExecutionService = LinuxExecutionService;
});
//# sourceMappingURL=executionService.js.map