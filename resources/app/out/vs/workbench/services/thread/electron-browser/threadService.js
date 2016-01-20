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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/nls', 'vs/platform/thread/common/mainThreadService', 'vs/platform/plugins/common/ipcRemoteCom', 'vs/base/common/marshalling', 'vs/base/common/strings', 'vs/base/common/objects', 'vs/base/common/uri', 'vs/base/common/errors', 'vs/platform/message/common/message', 'vs/base/node/ports', 'child_process', 'electron'], function (require, exports, winjs_base_1, nls, mainThreadService_1, pluginsIPC, marshalling, strings, objects, uri_1, errors, message_1, ports, cp, electron_1) {
    exports.PLUGIN_LOG_BROADCAST_CHANNEL = 'vscode:pluginLog';
    exports.PLUGIN_ATTACH_BROADCAST_CHANNEL = 'vscode:pluginAttach';
    // Enable to see detailed message communication between window and plugin host
    var logPluginHostCommunication = false;
    var MainThreadService = (function (_super) {
        __extends(MainThreadService, _super);
        function MainThreadService(contextService, messageService, windowService) {
            var _this = this;
            _super.call(this, contextService, 'vs/editor/common/worker/editorWorkerServer');
            this.pluginHostProcessManager = new PluginHostProcessManager(contextService, messageService, windowService);
            var logCommunication = logPluginHostCommunication || contextService.getConfiguration().env.logPluginHostCommunication;
            // Message: Window --> Plugin Host
            this.remoteCom = pluginsIPC.create(function (msg) {
                if (logCommunication) {
                    console.log('%c[Window \u2192 Plugin]%c[len: ' + strings.pad(msg.length, 5, ' ') + ']', 'color: darkgreen', 'color: grey', JSON.parse(msg));
                }
                _this.pluginHostProcessManager.postMessage(msg);
            });
            // Message: Plugin Host --> Window
            this.pluginHostProcessManager.startPluginHostProcess(function (msg) {
                if (logCommunication) {
                    console.log('%c[Plugin \u2192 Window]%c[len: ' + strings.pad(msg.length, 5, ' ') + ']', 'color: darkgreen', 'color: grey', JSON.parse(msg));
                }
                _this.remoteCom.handle(msg);
            });
            this.remoteCom.registerBigHandler(this);
        }
        MainThreadService.prototype.dispose = function () {
            this.pluginHostProcessManager.terminate();
        };
        MainThreadService.prototype._registerAndInstantiatePluginHostActor = function (id, descriptor) {
            return this._getOrCreateProxyInstance(this.remoteCom, id, descriptor);
        };
        return MainThreadService;
    })(mainThreadService_1.MainThreadService);
    exports.MainThreadService = MainThreadService;
    var PluginHostProcessManager = (function () {
        function PluginHostProcessManager(contextService, messageService, windowService) {
            this.messageService = messageService;
            this.contextService = contextService;
            this.windowService = windowService;
            // handle plugin host lifecycle a bit special when we know we are developing an extension that runs inside
            this.isPluginDevelopmentHost = !!this.contextService.getConfiguration().env.pluginDevelopmentPath;
            this.unsentMessages = [];
        }
        PluginHostProcessManager.prototype.startPluginHostProcess = function (onPluginHostMessage) {
            var _this = this;
            var config = this.contextService.getConfiguration();
            var isDev = !config.env.isBuilt || !!config.env.pluginDevelopmentPath;
            var isTestingFromCli = !!config.env.pluginTestsPath && !config.env.debugBrkPluginHost;
            var opts = {
                env: objects.mixin(objects.clone(process.env), { AMD_ENTRYPOINT: 'vs/workbench/node/pluginHostProcess', PIPE_LOGGING: 'true', VERBOSE_LOGGING: true })
            };
            // Help in case we fail to start it
            if (isDev) {
                this.initializeTimer = setTimeout(function () {
                    var msg = config.env.debugBrkPluginHost ? nls.localize('pluginHostProcess.startupFailDebug', "Plugin host did not start in 10 seconds, it might be stopped on the first line and needs a debugger to continue.") : nls.localize('pluginHostProcess.startupFail', "Plugin host did not start in 10 seconds, that might be a problem.");
                    _this.messageService.show(message_1.Severity.Warning, msg);
                }, 10000);
            }
            // Initialize plugin host process with hand shakes
            this.initializePluginHostProcess = new winjs_base_1.TPromise(function (c, e) {
                // Resolve additional execution args (e.g. debug)
                return _this.resolveDebugPort(config, function (port) {
                    if (port) {
                        opts.execArgv = ['--nolazy', (config.env.debugBrkPluginHost ? '--debug-brk=' : '--debug=') + port];
                    }
                    // Run Plugin Host as fork of current process
                    _this.pluginHostProcessHandle = cp.fork(uri_1.default.parse(require.toUrl('bootstrap')).fsPath, ['--type=pluginHost'], opts);
                    // Notify debugger that we are ready to attach to the process if we run a development plugin
                    if (config.env.pluginDevelopmentPath && port) {
                        _this.windowService.broadcast({
                            channel: exports.PLUGIN_ATTACH_BROADCAST_CHANNEL,
                            payload: {
                                port: port
                            }
                        }, config.env.pluginDevelopmentPath /* target */);
                    }
                    // Messages from Plugin host
                    _this.pluginHostProcessHandle.on('message', function (msg) {
                        // 1) Host is ready to receive messages, initialize it
                        if (msg === 'ready') {
                            if (_this.initializeTimer) {
                                window.clearTimeout(_this.initializeTimer);
                            }
                            var initPayload = marshalling.serialize({
                                parentPid: process.pid,
                                contextService: {
                                    workspace: _this.contextService.getWorkspace(),
                                    configuration: _this.contextService.getConfiguration(),
                                    options: _this.contextService.getOptions()
                                },
                            });
                            _this.pluginHostProcessHandle.send(initPayload);
                        }
                        else if (msg === 'initialized') {
                            _this.unsentMessages.forEach(function (m) { return _this.postMessage(m); });
                            _this.unsentMessages = [];
                            c(_this.pluginHostProcessHandle);
                        }
                        else if (msg && msg.type === '__$console') {
                            var logEntry = msg;
                            var args = [];
                            try {
                                var parsed = JSON.parse(logEntry.arguments);
                                args.push.apply(args, Object.getOwnPropertyNames(parsed).map(function (o) { return parsed[o]; }));
                            }
                            catch (error) {
                                args.push(logEntry.arguments);
                            }
                            // If the first argument is a string, check for % which indicates that the message
                            // uses substitution for variables. In this case, we cannot just inject our colored
                            // [Plugin Host] to the front because it breaks substitution.
                            var consoleArgs = [];
                            if (typeof args[0] === 'string' && args[0].indexOf('%') >= 0) {
                                consoleArgs = [("%c[Plugin Host]%c " + args[0]), 'color: blue', 'color: black'].concat(args.slice(1));
                            }
                            else {
                                consoleArgs = ['%c[Plugin Host]', 'color: blue'].concat(args);
                            }
                            // Send to local console unless we run tests from cli
                            if (!isTestingFromCli) {
                                console[logEntry.severity].apply(console, consoleArgs);
                            }
                            // Log on main side if running tests from cli
                            if (isTestingFromCli) {
                                electron_1.ipcRenderer.send('vscode:log', logEntry);
                            }
                            else if (isDev) {
                                _this.windowService.broadcast({
                                    channel: exports.PLUGIN_LOG_BROADCAST_CHANNEL,
                                    payload: logEntry
                                }, config.env.pluginDevelopmentPath /* target */);
                            }
                        }
                        else {
                            onPluginHostMessage(msg);
                        }
                    });
                    // Lifecycle
                    var onExit = function () { return _this.terminate(); };
                    process.once('exit', onExit);
                    _this.pluginHostProcessHandle.on('error', function (err) {
                        var errorMessage = errors.toErrorMessage(err);
                        if (errorMessage === _this.lastPluginHostError) {
                            return; // prevent error spam
                        }
                        _this.lastPluginHostError = errorMessage;
                        _this.messageService.show(message_1.Severity.Error, nls.localize('pluginHostProcess.error', "Error from the plugin host: {0}", errorMessage));
                    });
                    _this.pluginHostProcessHandle.on('exit', function (code, signal) {
                        process.removeListener('exit', onExit);
                        if (!_this.terminating) {
                            // Unexpected termination
                            if (!_this.isPluginDevelopmentHost) {
                                _this.messageService.show(message_1.Severity.Error, nls.localize('pluginHostProcess.crash', "Plugin host terminated unexpectedly. Please restart VSCode to recover."));
                                console.error('Plugin host terminated unexpectedly. Code: ', code, ' Signal: ', signal);
                            }
                            else if (!isTestingFromCli) {
                                _this.windowService.getWindow().close();
                            }
                            else {
                                electron_1.ipcRenderer.send('vscode:exit', code);
                            }
                        }
                    });
                });
            }, function () { return _this.terminate(); });
        };
        PluginHostProcessManager.prototype.resolveDebugPort = function (config, clb) {
            // Check for a free debugging port
            if (typeof config.env.debugPluginHostPort === 'number') {
                return ports.findFreePort(config.env.debugPluginHostPort, 10 /* try 10 ports */, function (port) {
                    if (!port) {
                        console.warn('%c[Plugin Host] %cCould not find a free port for debugging', 'color: blue', 'color: black');
                        return clb(void 0);
                    }
                    if (port !== config.env.debugPluginHostPort) {
                        console.warn('%c[Plugin Host] %cProvided debugging port ' + config.env.debugPluginHostPort + ' is not free, using ' + port + ' instead.', 'color: blue', 'color: black');
                    }
                    if (config.env.debugBrkPluginHost) {
                        console.warn('%c[Plugin Host] %cSTOPPED on first line for debugging on port ' + port, 'color: blue', 'color: black');
                    }
                    else {
                        console.info('%c[Plugin Host] %cdebugger listening on port ' + port, 'color: blue', 'color: black');
                    }
                    return clb(port);
                });
            }
            else {
                return clb(void 0);
            }
        };
        PluginHostProcessManager.prototype.postMessage = function (msg) {
            if (this.initializePluginHostProcess) {
                this.initializePluginHostProcess.done(function (p) { return p.send(msg); });
            }
            else {
                this.unsentMessages.push(msg);
            }
        };
        PluginHostProcessManager.prototype.terminate = function () {
            this.terminating = true;
            if (this.pluginHostProcessHandle) {
                this.pluginHostProcessHandle.send({
                    type: '__$terminate'
                });
            }
        };
        return PluginHostProcessManager;
    })();
});
//# sourceMappingURL=threadService.js.map