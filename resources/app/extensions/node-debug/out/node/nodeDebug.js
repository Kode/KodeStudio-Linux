/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vscode_debugadapter_1 = require('vscode-debugadapter');
var nodeV8Protocol_1 = require('./nodeV8Protocol');
var sourceMaps_1 = require('./sourceMaps');
var terminal_1 = require('./terminal');
var PathUtils = require('./pathUtilities');
var CP = require('child_process');
var Net = require('net');
var Path = require('path');
var FS = require('fs');
var nls = require('vscode-nls');
var localize = nls.config(process.env.VSCODE_NLS_CONFIG)(__filename);
var Expander = (function () {
    function Expander(func) {
        this._expanderFunction = func;
    }
    Expander.prototype.Expand = function (session) {
        return this._expanderFunction();
    };
    Expander.prototype.SetValue = function (session, name, value) {
        return Promise.reject(new Error(Expander.SET_VALUE_ERROR));
    };
    Expander.SET_VALUE_ERROR = localize(0, null);
    return Expander;
}());
exports.Expander = Expander;
var ArrayContainer = (function () {
    function ArrayContainer(array, length, chunkSize) {
        this._array = array;
        this._length = length;
        this._chunkSize = chunkSize;
    }
    ArrayContainer.prototype.Expand = function (session) {
        var _this = this;
        // first add named properties then add ranges
        return session._createProperties(this._array, 'named').then(function (variables) {
            for (var start = 0; start < _this._length; start += _this._chunkSize) {
                var end = Math.min(start + _this._chunkSize, _this._length) - 1;
                var count = end - start + 1;
                variables.push(new vscode_debugadapter_1.Variable("[" + start + ".." + end + "]", ' ', session._variableHandles.create(new RangeContainer(_this._array, start, count))));
            }
            return variables;
        });
    };
    ArrayContainer.prototype.SetValue = function (session, name, value) {
        return session._setPropertyValue(this._array.handle, name, value);
    };
    return ArrayContainer;
}());
exports.ArrayContainer = ArrayContainer;
var RangeContainer = (function () {
    function RangeContainer(array, start, count) {
        this._array = array;
        this._start = start;
        this._count = count;
    }
    RangeContainer.prototype.Expand = function (session) {
        // experimental support for long arrays not relying on code injection
        //return session._createLargeArrayElements(this._array, this._start, this._count);
        return session._createProperties(this._array, 'range', this._start, this._count);
    };
    RangeContainer.prototype.SetValue = function (session, name, value) {
        return session._setPropertyValue(this._array.handle, name, value);
    };
    return RangeContainer;
}());
exports.RangeContainer = RangeContainer;
var PropertyContainer = (function () {
    function PropertyContainer(obj, ths) {
        this._object = obj;
        this._this = ths;
    }
    PropertyContainer.prototype.Expand = function (session) {
        var _this = this;
        return session._createProperties(this._object, 'all').then(function (variables) {
            if (_this._this) {
                return session._createVariable('this', _this._this).then(function (variable) {
                    variables.push(variable);
                    return variables;
                });
            }
            else {
                return variables;
            }
        });
    };
    PropertyContainer.prototype.SetValue = function (session, name, value) {
        return session._setPropertyValue(this._object.handle, name, value);
    };
    return PropertyContainer;
}());
exports.PropertyContainer = PropertyContainer;
var ScopeContainer = (function () {
    function ScopeContainer(scope, obj, ths) {
        this._frame = scope.frameIndex;
        this._scope = scope.index;
        this._object = obj;
        this._this = ths;
    }
    ScopeContainer.prototype.Expand = function (session) {
        var _this = this;
        return session._createProperties(this._object, 'all').then(function (variables) {
            if (_this._this) {
                return session._createVariable('this', _this._this).then(function (variable) {
                    variables.push(variable);
                    return variables;
                });
            }
            else {
                return variables;
            }
        });
    };
    ScopeContainer.prototype.SetValue = function (session, name, value) {
        return session._setVariableValue(this._frame, this._scope, name, value);
    };
    return ScopeContainer;
}());
exports.ScopeContainer = ScopeContainer;
var Script = (function () {
    function Script(script) {
        this.contents = script.source;
    }
    return Script;
}());
var InternalSourceBreakpoint = (function () {
    function InternalSourceBreakpoint(line, column, condition) {
        if (column === void 0) { column = 0; }
        this.line = this.orgLine = line;
        this.column = this.orgColumn = column;
        this.condition = condition;
    }
    return InternalSourceBreakpoint;
}());
/**
 * A SourceSource represents the source contents of an internal module or of a source map with inlined contents.
 */
var SourceSource = (function () {
    function SourceSource(sid, content) {
        this.scriptId = sid;
        this.source = content;
    }
    return SourceSource;
}());
var NodeDebugSession = (function (_super) {
    __extends(NodeDebugSession, _super);
    function NodeDebugSession() {
        var _this = this;
        _super.call(this);
        this._traceAll = false;
        // options
        this._tryToInjectExtension = true;
        this._chunkSize = 100; // chunk size for large data structures
        this._smartStep = false; // try to automatically step over uninteresting source
        this._nodeProcessId = -1; // pid of the node runtime
        this._functionBreakpoints = new Array(); // node function breakpoint ids
        this._scripts = new Map();
        // session configurations
        this._noDebug = false;
        this._attachMode = false;
        this._restartMode = false;
        this._stepBack = false;
        // state valid between stop events
        this._variableHandles = new vscode_debugadapter_1.Handles();
        this._frameHandles = new vscode_debugadapter_1.Handles();
        this._sourceHandles = new vscode_debugadapter_1.Handles();
        this._refCache = new Map();
        this._pollForNodeProcess = false;
        this._nodeInjectionAvailable = false;
        this._smartStepCount = 0;
        // this debugger uses zero-based lines and columns which is the default
        // so the following two calls are not really necessary.
        this.setDebuggerLinesStartAt1(false);
        this.setDebuggerColumnsStartAt1(false);
        this._node = new nodeV8Protocol_1.NodeV8Protocol(function (response) {
            // if request successful, cache alls refs
            if (response.success && response.refs) {
                var oldSize = _this._refCache.size;
                for (var _i = 0, _a = response.refs; _i < _a.length; _i++) {
                    var r = _a[_i];
                    _this._cache(r.handle, r);
                }
                if (_this._refCache.size !== oldSize) {
                    _this.log('rc', "NodeV8Protocol hook: ref cache size: " + _this._refCache.size);
                }
            }
        });
        this._node.on('break', function (event) {
            _this._stopped('break');
            _this._handleNodeBreakEvent(event.body);
        });
        this._node.on('exception', function (event) {
            _this._stopped('exception');
            _this._handleNodeBreakEvent(event.body);
        });
        /*
        this._node.on('beforeCompile', (event: NodeV8Event) => {
            this.outLine(`beforeCompile ${event.body.name}`);
        });
        */
        this._node.on('afterCompile', function (event) {
            _this._handleNodeAfterCompileEvent(event.body);
        });
        this._node.on('close', function (event) {
            _this._terminated('node v8protocol close');
        });
        this._node.on('error', function (event) {
            _this._terminated('node v8protocol error');
        });
        /*
        this._node.on('diagnostic', (event: NodeV8Event) => {
            this.outLine(`diagnostic event ${event.body.reason}`);
        });
        */
    }
    /**
     * Experimental support for SystemJS module loader (https://github.com/systemjs/systemjs)
     *
     * Tries to figure out whether JavaScript code has been dynamically generated
     * and whether it contains a source map reference.
     * If this is the case try to reload breakpoints.
     */
    NodeDebugSession.prototype._handleNodeAfterCompileEvent = function (eventBody) {
        var _this = this;
        if (this._sourceMaps) {
            var path_1 = eventBody.script.name;
            if (path_1 && Path.extname(path_1) === '.js!transpiled' && path_1.indexOf('file://') === 0) {
                path_1 = path_1.substring('file://'.length);
                if (!FS.existsSync(path_1)) {
                    var script_id = eventBody.script.id;
                    this._loadScript(script_id).then(function (script) {
                        var sources = _this._sourceMaps.MapPathToSource(path_1, script.contents);
                        if (sources && sources.length >= 0) {
                            _this.outLine("afterCompile: " + path_1 + " maps to " + sources[0]);
                            // trigger resending breakpoints
                            _this.sendEvent(new vscode_debugadapter_1.InitializedEvent());
                        }
                    }).catch(function (err) {
                        // ignore
                    });
                }
            }
        }
    };
    /**
     * Analyse why node has stopped and sends StoppedEvent if necessary.
     */
    NodeDebugSession.prototype._handleNodeBreakEvent = function (eventBody) {
        /*
        // workaround: load sourcemap for this location to populate cache
        if (this._sourceMaps) {
            let path = body.script.name;
            if (path && PathUtils.isAbsolutePath(path)) {
                path = this._remoteToLocal(path);
                this._sourceMaps.MapToSource(path, null, 0, 0);
            }
        }
        */
        var isEntry = false;
        var reason;
        var exception_text;
        // is exception?
        if (eventBody.exception) {
            this._exception = eventBody.exception;
            exception_text = eventBody.exception.text;
            reason = localize(1, null);
        }
        // is breakpoint?
        if (!reason) {
            var breakpoints = eventBody.breakpoints;
            if (isArray(breakpoints) && breakpoints.length > 0) {
                var id = breakpoints[0];
                if (!this._gotEntryEvent && id === 1) {
                    isEntry = true;
                    this.log('la', '_analyzeBreak: suppressed stop-on-entry event');
                    reason = localize(2, null);
                    this._rememberEntryLocation(eventBody.script.name, eventBody.sourceLine, eventBody.sourceColumn);
                }
                else {
                    reason = localize(3, null);
                }
            }
        }
        // is debugger statement?
        if (!reason) {
            var sourceLine = eventBody.sourceLineText;
            if (sourceLine && sourceLine.indexOf('debugger') >= 0) {
                reason = localize(4, null);
            }
        }
        // no reason yet: must be the result of a 'step'
        if (!reason) {
            // should we continue until we find a better place to stop?
            if (this._smartStep && this._skipGenerated(eventBody)) {
                this._node.command('continue', { stepaction: 'in' });
                this._smartStepCount++;
                return null;
            }
            reason = localize(5, null);
        }
        this._lastStoppedEvent = new vscode_debugadapter_1.StoppedEvent(reason, NodeDebugSession.DUMMY_THREAD_ID, exception_text);
        if (!isEntry) {
            if (this._smartStepCount > 0) {
                this.log('ss', "_handleNodeBreakEvent: " + this._smartStepCount + " steps skipped");
                this._smartStepCount = 0;
            }
            this.sendEvent(this._lastStoppedEvent);
        }
    };
    /**
     * Returns true if a source location should be skipped.
     */
    NodeDebugSession.prototype._skipGenerated = function (event) {
        if (!this._sourceMaps) {
            // proceed as normal
            return false;
        }
        var line = event.sourceLine;
        var column = this._adjustColumn(line, event.sourceColumn);
        var remotePath = event.script.name;
        if (remotePath && PathUtils.isAbsolutePath(remotePath)) {
            // if launch.json defines localRoot and remoteRoot try to convert remote path back to a local path
            var localPath = this._remoteToLocal(remotePath);
            // try to map
            var mapresult = this._sourceMaps.MapToSource(localPath, null, line, column, sourceMaps_1.Bias.LEAST_UPPER_BOUND);
            if (!mapresult) {
                mapresult = this._sourceMaps.MapToSource(localPath, null, line, column, sourceMaps_1.Bias.GREATEST_LOWER_BOUND);
            }
            if (mapresult) {
                return false;
            }
        }
        // skip everything
        return true;
    };
    /**
     * clear everything that is no longer valid after a new stopped event.
     */
    NodeDebugSession.prototype._stopped = function (reason) {
        this._stoppedReason = reason;
        this.log('la', "_stopped: got " + reason + " event from node");
        this._exception = undefined;
        this._variableHandles.reset();
        this._frameHandles.reset();
        this._refCache = new Map();
        this.log('rc', "_stopped: new ref cache");
    };
    /**
     * The debug session has terminated.
     */
    NodeDebugSession.prototype._terminated = function (reason) {
        this.log('la', "_terminated: " + reason);
        if (this._terminalProcess) {
            // if the debug adapter owns a terminal,
            // we delay the TerminatedEvent so that the user can see the result of the process in the terminal.
            return;
        }
        if (!this._isTerminated) {
            this._isTerminated = true;
            if (this._restartMode && !this._inShutdown) {
                this.sendEvent(new vscode_debugadapter_1.TerminatedEvent(true));
            }
            else {
                this.sendEvent(new vscode_debugadapter_1.TerminatedEvent());
            }
        }
    };
    //---- initialize request -------------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.initializeRequest = function (response, args) {
        this.log('la', "initializeRequest: adapterID: " + args.adapterID);
        this._adapterID = args.adapterID;
        //---- Send back feature and their options
        // This debug adapter supports the configurationDoneRequest.
        response.body.supportsConfigurationDoneRequest = true;
        // This debug adapter supports function breakpoints.
        response.body.supportsFunctionBreakpoints = true;
        // This debug adapter supports conditional breakpoints.
        response.body.supportsConditionalBreakpoints = true;
        // This debug adapter does not support a side effect free evaluate request for data hovers.
        response.body.supportsEvaluateForHovers = false;
        // This debug adapter supports two exception breakpoint filters
        response.body.exceptionBreakpointFilters = [
            {
                label: localize(6, null),
                filter: 'all',
                default: false
            },
            {
                label: localize(7, null),
                filter: 'uncaught',
                default: true
            }
        ];
        response.body.supportsSetVariable = true;
        this.sendResponse(response);
    };
    //---- launch request -----------------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.launchRequest = function (response, args) {
        var _this = this;
        if (this._processCommonArgs(response, args)) {
            return;
        }
        this._noDebug = (typeof args.noDebug === 'boolean') && args.noDebug;
        this._externalConsole = (typeof args.externalConsole === 'boolean') && args.externalConsole;
        var port = args.port || random(3000, 50000);
        var address = args.address;
        var timeout = args.timeout;
        var runtimeExecutable = args.runtimeExecutable;
        if (runtimeExecutable) {
            if (!Path.isAbsolute(runtimeExecutable)) {
                this.sendRelativePathErrorResponse(response, 'runtimeExecutable', runtimeExecutable);
                return;
            }
            if (!FS.existsSync(runtimeExecutable)) {
                this.sendNotExistErrorResponse(response, 'runtimeExecutable', runtimeExecutable);
                return;
            }
        }
        else {
            if (!terminal_1.Terminal.isOnPath(NodeDebugSession.NODE)) {
                this.sendErrorResponse(response, 2001, localize(8, null, '{_runtime}'), { _runtime: NodeDebugSession.NODE });
                return;
            }
            runtimeExecutable = NodeDebugSession.NODE; // use node from PATH
        }
        var runtimeArgs = args.runtimeArgs || [];
        var programArgs = args.args || [];
        // special code for 'extensionHost' debugging
        if (this._adapterID === 'extensionHost') {
            // we always launch in 'debug-brk' mode, but we only show the break event if 'stopOnEntry' attribute is true.
            var launchArgs_1 = [runtimeExecutable];
            if (!this._noDebug) {
                launchArgs_1.push("--debugBrkPluginHost=" + port);
            }
            launchArgs_1 = launchArgs_1.concat(runtimeArgs, programArgs);
            this._sendLaunchCommandToConsole(launchArgs_1);
            var cmd = CP.spawn(runtimeExecutable, launchArgs_1.slice(1));
            cmd.on('error', function (err) {
                _this._terminated("failed to launch extensionHost (" + err + ")");
            });
            this._captureOutput(cmd);
            // we are done!
            this.sendResponse(response);
            return;
        }
        var programPath = args.program;
        if (programPath) {
            if (!Path.isAbsolute(programPath)) {
                this.sendRelativePathErrorResponse(response, 'program', programPath);
                return;
            }
            if (!FS.existsSync(programPath)) {
                this.sendNotExistErrorResponse(response, 'program', programPath);
                return;
            }
            programPath = Path.normalize(programPath);
            if (PathUtils.normalizeDriveLetter(programPath) !== PathUtils.realPath(programPath)) {
                this.outLine(localize(9, null));
            }
        }
        else {
            this.sendAttributeMissingErrorResponse(response, 'program');
            return;
        }
        if (NodeDebugSession.isJavaScript(programPath)) {
            if (this._sourceMaps) {
                // if programPath is a JavaScript file and sourceMaps are enabled, we don't know whether
                // programPath is the generated file or whether it is the source (and we need source mapping).
                // Typically this happens if a tool like 'babel' or 'uglify' is used (because they both transpile js to js).
                // We use the source maps to find a 'source' file for the given js file.
                var generatedPath = this._sourceMaps.MapPathFromSource(programPath);
                if (generatedPath && generatedPath !== programPath) {
                    // programPath must be source because there seems to be a generated file for it
                    this.log('sm', "launchRequest: program '" + programPath + "' seems to be the source; launch the generated file '" + generatedPath + "' instead");
                    programPath = generatedPath;
                }
                else {
                    this.log('sm', "launchRequest: program '" + programPath + "' seems to be the generated file");
                }
            }
        }
        else {
            // node cannot execute the program directly
            if (!this._sourceMaps) {
                this.sendErrorResponse(response, 2002, localize(10, null, '{path}'), { path: programPath });
                return;
            }
            var generatedPath = this._sourceMaps.MapPathFromSource(programPath);
            if (!generatedPath) {
                this.sendErrorResponse(response, 2003, localize(11, null, '{path}', 'outDir'), { path: programPath });
                return;
            }
            this.log('sm', "launchRequest: program '" + programPath + "' seems to be the source; launch the generated file '" + generatedPath + "' instead");
            programPath = generatedPath;
        }
        var program;
        var workingDirectory = args.cwd;
        if (workingDirectory) {
            if (!Path.isAbsolute(workingDirectory)) {
                this.sendRelativePathErrorResponse(response, 'cwd', workingDirectory);
                return;
            }
            if (!FS.existsSync(workingDirectory)) {
                this.sendNotExistErrorResponse(response, 'cwd', workingDirectory);
                return;
            }
            // if working dir is given and if the executable is within that folder, we make the executable path relative to the working dir
            program = Path.relative(workingDirectory, programPath);
        }
        else {
            // if no working dir given, we use the direct folder of the executable
            workingDirectory = Path.dirname(programPath);
            program = Path.basename(programPath);
        }
        // we always break on entry (but if user did not request this, we will not stop in the UI).
        var launchArgs = [runtimeExecutable];
        if (!this._noDebug) {
            launchArgs.push("--debug-brk=" + port);
        }
        launchArgs = launchArgs.concat(runtimeArgs, [program], programArgs);
        if (this._externalConsole) {
            terminal_1.Terminal.launchInTerminal(workingDirectory, launchArgs, args.env).then(function (term) {
                if (term) {
                    // if we got a terminal process, we will track it
                    _this._terminalProcess = term;
                    term.on('exit', function () {
                        _this._terminalProcess = null;
                        _this._terminated('terminal exited');
                    });
                }
                // since node starts in a terminal, we cannot track it with an 'exit' handler
                // plan for polling after we have gotten the process pid.
                _this._pollForNodeProcess = true;
                if (_this._noDebug) {
                    _this.sendResponse(response);
                }
                else {
                    _this._attach(response, port, address, timeout);
                }
            }).catch(function (error) {
                _this.sendErrorResponseWithInfoLink(response, 2011, localize(12, null, '{_error}'), { _error: error.message }, error.linkId);
                _this._terminated('terminal error: ' + error.message);
            });
        }
        else {
            this._sendLaunchCommandToConsole(launchArgs);
            // merge environment variables into a copy of the process.env
            var env = extendObject(extendObject({}, process.env), args.env);
            var options = {
                cwd: workingDirectory,
                env: env
            };
            var nodeProcess = CP.spawn(runtimeExecutable, launchArgs.slice(1), options);
            nodeProcess.on('error', function (error) {
                _this.sendErrorResponse(response, 2017, localize(13, null, '{_error}'), { _error: error.message }, vscode_debugadapter_1.ErrorDestination.Telemetry | vscode_debugadapter_1.ErrorDestination.User);
                _this._terminated("failed to launch target (" + error + ")");
            });
            nodeProcess.on('exit', function () {
                _this._terminated('target exited');
            });
            nodeProcess.on('close', function (code) {
                _this._terminated('target closed');
            });
            this._nodeProcessId = nodeProcess.pid;
            this._captureOutput(nodeProcess);
            if (this._noDebug) {
                this.sendResponse(response);
            }
            else {
                this._attach(response, port, address, timeout);
            }
        }
    };
    NodeDebugSession.prototype._sendLaunchCommandToConsole = function (args) {
        // print the command to launch the target to the debug console
        var cli = '';
        for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
            var a = args_1[_i];
            if (a.indexOf(' ') >= 0) {
                cli += '\'' + a + '\'';
            }
            else {
                cli += a;
            }
            cli += ' ';
        }
        this.outLine(cli);
    };
    NodeDebugSession.prototype._captureOutput = function (process) {
        var _this = this;
        process.stdout.on('data', function (data) {
            _this.sendEvent(new vscode_debugadapter_1.OutputEvent(data.toString(), 'stdout'));
        });
        process.stderr.on('data', function (data) {
            _this.sendEvent(new vscode_debugadapter_1.OutputEvent(data.toString(), 'stderr'));
        });
    };
    /**
     * returns true on error.
     */
    NodeDebugSession.prototype._processCommonArgs = function (response, args) {
        if (typeof args.trace === 'string') {
            this._trace = args.trace.split(',');
            this._traceAll = this._trace.indexOf('all') >= 0;
        }
        this._stepBack = (typeof args.stepBack === 'boolean') && args.stepBack;
        this._smartStep = (typeof args.smartStep === 'boolean') && args.smartStep;
        this._stopOnEntry = (typeof args.stopOnEntry === 'boolean') && args.stopOnEntry;
        if (!this._sourceMaps) {
            if (typeof args.sourceMaps === 'boolean' && args.sourceMaps) {
                var generatedCodeDirectory = args.outDir;
                if (generatedCodeDirectory) {
                    if (!Path.isAbsolute(generatedCodeDirectory)) {
                        this.sendRelativePathErrorResponse(response, 'outDir', generatedCodeDirectory);
                        return true;
                    }
                    if (!FS.existsSync(generatedCodeDirectory)) {
                        this.sendNotExistErrorResponse(response, 'outDir', generatedCodeDirectory);
                        return true;
                    }
                }
                this._sourceMaps = new sourceMaps_1.SourceMaps(this, generatedCodeDirectory);
            }
        }
        return false;
    };
    //---- attach request -----------------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.attachRequest = function (response, args) {
        if (this._processCommonArgs(response, args)) {
            return;
        }
        if (this._adapterID === 'extensionHost') {
            // in EH mode 'attach' means 'launch' mode
            this._attachMode = false;
        }
        else {
            this._attachMode = true;
        }
        if (typeof args.restart === 'boolean') {
            this._restartMode = args.restart;
        }
        if (args.localRoot) {
            var localRoot = args.localRoot;
            if (!Path.isAbsolute(localRoot)) {
                this.sendRelativePathErrorResponse(response, 'localRoot', localRoot);
                return;
            }
            if (!FS.existsSync(localRoot)) {
                this.sendNotExistErrorResponse(response, 'localRoot', localRoot);
                return;
            }
            this._localRoot = localRoot;
        }
        this._remoteRoot = args.remoteRoot;
        // if a processId is specified, try to bring the process into debug mode.
        if (typeof args.processId === 'string') {
            var pid_string = args.processId.trim();
            if (/^([0-9]+)$/.test(pid_string)) {
                var pid = Number(pid_string);
                try {
                    if (process.platform === 'win32') {
                        // regular node has an undocumented API function for forcing another node process into debug mode.
                        // 		(<any>process)._debugProcess(pid);
                        // But since we are running on Electron's node, process._debugProcess doesn't work (for unknown reasons).
                        // So we use a regular node instead:
                        var command = "node -e process._debugProcess(" + pid + ")";
                        CP.execSync(command);
                    }
                    else {
                        process.kill(pid, 'SIGUSR1');
                    }
                }
                catch (e) {
                    this.sendErrorResponse(response, 2021, localize(14, null, pid, e));
                    return;
                }
            }
            else {
                this.sendErrorResponse(response, 2006, localize(15, null, pid_string));
                return;
            }
        }
        this._attach(response, args.port, args.address, args.timeout);
    };
    /*
     * shared code used in launchRequest and attachRequest
     */
    NodeDebugSession.prototype._attach = function (response, port, address, timeout) {
        var _this = this;
        if (!port) {
            port = 5858;
        }
        if (!address || address === 'localhost') {
            address = '127.0.0.1';
        }
        if (!timeout) {
            timeout = NodeDebugSession.ATTACH_TIMEOUT;
        }
        this.log('la', "_attach: address: " + address + " port: " + port);
        var connected = false;
        var socket = new Net.Socket();
        socket.connect(port, address);
        socket.on('connect', function (err) {
            _this.log('la', '_attach: connected');
            connected = true;
            _this._node.startDispatch(socket, socket);
            _this._initialize(response);
        });
        var endTime = new Date().getTime() + timeout;
        socket.on('error', function (err) {
            if (connected) {
                // since we are connected this error is fatal
                _this._terminated('socket error');
            }
            else {
                // we are not yet connected so retry a few times
                if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
                    var now = new Date().getTime();
                    if (now < endTime) {
                        setTimeout(function () {
                            _this.log('la', '_attach: retry socket.connect');
                            socket.connect(port);
                        }, 200); // retry after 200 ms
                    }
                    else {
                        _this.sendErrorResponse(response, 2009, localize(16, null, '{_timeout}'), { _timeout: timeout });
                    }
                }
                else {
                    _this.sendErrorResponse(response, 2010, localize(17, null, '{_error}'), { _error: err.message });
                }
            }
        });
        socket.on('end', function (err) {
            _this._terminated('socket end');
        });
    };
    NodeDebugSession.prototype._initialize = function (response, retryCount) {
        var _this = this;
        if (retryCount === void 0) { retryCount = 0; }
        this._node.command('evaluate', { expression: 'process.pid', global: true }, function (resp) {
            var ok = resp.success;
            if (resp.success) {
                _this._nodeProcessId = +resp.body.value;
                _this.log('la', "_initialize: got process id " + _this._nodeProcessId + " from node");
            }
            else {
                if (resp.message.indexOf('process is not defined') >= 0) {
                    _this.log('la', '_initialize: process not defined error; got no pid');
                    ok = true; // continue and try to get process.pid later
                }
            }
            if (ok) {
                if (_this._pollForNodeProcess) {
                    _this._pollForNodeTermination();
                }
                setTimeout(function () {
                    _this._injectDebuggerExtensions().then(function (_) {
                        if (!_this._stepBack) {
                            // does runtime support 'step back'?
                            var v = _this._node.embeddedHostVersion; // x.y.z version represented as (x*100+y)*100+z
                            if (!_this._node.v8Version && v >= 70000) {
                                _this._stepBack = true;
                            }
                        }
                        if (_this._stepBack) {
                            response.body = {
                                supportsStepBack: true
                            };
                        }
                        _this.sendResponse(response);
                        _this._startInitialize(!resp.running);
                    });
                }, 10);
            }
            else {
                _this.log('la', '_initialize: retrieving process id from node failed');
                if (retryCount < 10) {
                    setTimeout(function () {
                        // recurse
                        _this._initialize(response, retryCount + 1);
                    }, 50);
                    return;
                }
                else {
                    _this._sendNodeResponse(response, resp);
                }
            }
        });
    };
    NodeDebugSession.prototype._pollForNodeTermination = function () {
        var _this = this;
        var id = setInterval(function () {
            try {
                if (_this._nodeProcessId > 0) {
                    process.kill(_this._nodeProcessId, 0); // node.d.ts doesn't like number argumnent
                }
                else {
                    clearInterval(id);
                }
            }
            catch (e) {
                clearInterval(id);
                _this._terminated('node process kill exception');
            }
        }, NodeDebugSession.NODE_TERMINATION_POLL_INTERVAL);
    };
    /*
     * Inject code into node.js to address slowness issues when inspecting large data structures.
     */
    NodeDebugSession.prototype._injectDebuggerExtensions = function () {
        var _this = this;
        if (this._tryToInjectExtension) {
            var v = this._node.embeddedHostVersion; // x.y.z version represented as (x*100+y)*100+z
            if (this._node.v8Version && (v >= 1200 && v < 10000) || (v >= 40301 && v < 50000) || (v >= 50600)) {
                try {
                    var contents = FS.readFileSync(Path.join(__dirname, NodeDebugSession.DEBUG_INJECTION), 'utf8');
                    var args_2 = {
                        expression: contents,
                        global: false,
                        disable_break: true
                    };
                    // first try evaluate against the current stack frame
                    return this._node.evaluate(args_2).then(function (resp) {
                        _this.log('la', "_injectDebuggerExtensions: frame based code injection successful");
                        _this._nodeInjectionAvailable = true;
                        return true;
                    }).catch(function (resp) {
                        _this.log('la', "_injectDebuggerExtensions: frame based code injection failed with error '" + resp.message + "'");
                        args_2.global = true;
                        // evaluate globally
                        return _this._node.evaluate(args_2).then(function (resp) {
                            _this.log('la', "_injectDebuggerExtensions: global code injection successful");
                            _this._nodeInjectionAvailable = true;
                            return true;
                        }).catch(function (resp) {
                            _this.log('la', "_injectDebuggerExtensions: global code injection failed with error '" + resp.message + "'");
                            return true;
                        });
                    });
                }
                catch (e) {
                }
            }
        }
        return Promise.resolve(true);
    };
    /*
     * start the initialization sequence:
     * 1. wait for 'break-on-entry' (with timeout)
     * 2. send 'inititialized' event in order to trigger setBreakpointEvents request from client
     * 3. prepare for sending 'break-on-entry' or 'continue' later in _finishInitialize()
     */
    NodeDebugSession.prototype._startInitialize = function (stopped, n) {
        var _this = this;
        if (n === void 0) { n = 0; }
        if (n === 0) {
            this.log('la', "_startInitialize: stopped: " + stopped);
        }
        // wait at most 500ms for receiving the break on entry event
        // (since in attach mode we cannot enforce that node is started with --debug-brk, we cannot assume that we receive this event)
        if (!this._gotEntryEvent && n < 10) {
            setTimeout(function () {
                // recurse
                _this._startInitialize(stopped, n + 1);
            }, 50);
            return;
        }
        if (this._gotEntryEvent) {
            this.log('la', "_startInitialize: got break on entry event after " + n + " retries");
            if (this._nodeProcessId <= 0) {
                // if we haven't gotten a process pid so far, we try it again
                this._node.command('evaluate', { expression: 'process.pid', global: true }, function (resp) {
                    if (resp.success) {
                        _this._nodeProcessId = +resp.body.value;
                        _this.log('la', "_initialize: got process id " + _this._nodeProcessId + " from node (2nd try)");
                    }
                    _this._startInitialize2(stopped);
                });
            }
            else {
                this._startInitialize2(stopped);
            }
        }
        else {
            this.log('la', "_startInitialize: no entry event after " + n + " retries; giving up");
            this._gotEntryEvent = true; // we pretend to got one so that no 'entry' event will show up later...
            this._node.command('frame', null, function (resp) {
                if (resp.success) {
                    var s = _this._getValueFromCache(resp.body.script);
                    _this._rememberEntryLocation(s.name, resp.body.line, resp.body.column);
                }
                _this._startInitialize2(stopped);
            });
        }
    };
    NodeDebugSession.prototype._startInitialize2 = function (stopped) {
        // request UI to send breakpoints
        this.log('la', '_startInitialize2: fire initialized event');
        this.sendEvent(new vscode_debugadapter_1.InitializedEvent());
        // in attach-mode we don't know whether the debuggee has been launched in 'stop on entry' mode
        // so we use the stopped state of the VM
        if (this._attachMode) {
            this.log('la', "_startInitialize2: in attach mode we guess stopOnEntry flag to be '" + stopped + "''");
            this._stopOnEntry = stopped;
        }
        if (this._stopOnEntry) {
            // user has requested 'stop on entry' so send out a stop-on-entry
            this.log('la', '_startInitialize2: fire stop-on-entry event');
            this.sendEvent(new vscode_debugadapter_1.StoppedEvent(localize(18, null), NodeDebugSession.DUMMY_THREAD_ID));
        }
        else {
            // since we are stopped but UI doesn't know about this, remember that we continue later in finishInitialize()
            this.log('la', "_startInitialize2: remember to do a 'Continue' later");
            this._needContinue = true;
        }
    };
    //---- disconnect request -------------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.disconnectRequest = function (response, args) {
        // special code for 'extensionHost' debugging
        if (this._adapterID === 'extensionHost') {
            // detect whether this disconnect request is part of a restart session
            if (this._nodeProcessId > 0 && args && typeof args.restart === 'boolean' && args.restart) {
                // do not kill extensionHost (since vscode will do this for us in a nicer way without killing the window)
                this._nodeProcessId = 0;
            }
        }
        _super.prototype.disconnectRequest.call(this, response, args);
    };
    /**
     * we rely on the generic implementation from DebugSession but we override 'Protocol.shutdown'
     * to disconnect from node and kill node & subprocesses
     */
    NodeDebugSession.prototype.shutdown = function () {
        var _this = this;
        if (!this._inShutdown) {
            this._inShutdown = true;
            if (this._attachMode) {
                // disconnect only in attach mode since otherwise node continues to run until it is killed
                this._node.command('disconnect'); // we don't wait for reponse
            }
            this._node.stop(); // stop socket connection (otherwise node.js dies with ECONNRESET on Windows)
            if (!this._attachMode) {
                // kill the whole process tree either starting with the terminal or with the node process
                var pid = this._terminalProcess ? this._terminalProcess.pid : this._nodeProcessId;
                if (pid > 0) {
                    this.log('la', 'shutdown: kill debugee and sub-processes');
                    terminal_1.Terminal.killTree(pid).then(function () {
                        _this._terminalProcess = null;
                        _this._nodeProcessId = -1;
                        _super.prototype.shutdown.call(_this);
                    }).catch(function (error) {
                        _this._terminalProcess = null;
                        _this._nodeProcessId = -1;
                        _super.prototype.shutdown.call(_this);
                    });
                    return;
                }
            }
            _super.prototype.shutdown.call(this);
        }
    };
    //--- set breakpoints request ---------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.setBreakPointsRequest = function (response, args) {
        var _this = this;
        this.log('bp', "setBreakPointsRequest: " + JSON.stringify(args.source) + " " + JSON.stringify(args.breakpoints));
        var sbs = new Array();
        // prefer the new API: array of breakpoints
        if (args.breakpoints) {
            for (var _i = 0, _a = args.breakpoints; _i < _a.length; _i++) {
                var b = _a[_i];
                sbs.push(new InternalSourceBreakpoint(this.convertClientLineToDebugger(b.line), typeof b.column === 'number' ? this.convertClientColumnToDebugger(b.column) : 0, b.condition));
            }
        }
        else {
            // deprecated API: convert line number array
            for (var _b = 0, _c = args.lines; _b < _c.length; _b++) {
                var l = _c[_b];
                sbs.push(new InternalSourceBreakpoint(this.convertClientLineToDebugger(l)));
            }
        }
        var source = args.source;
        if (source.adapterData) {
            if (source.adapterData.inlinePath) {
                // a breakpoint in inlined source: we need to source map
                this._mapSourceAndUpdateBreakpoints(response, source.adapterData.inlinePath, sbs);
                return;
            }
            if (source.adapterData.remotePath) {
                // a breakpoint in a remote file: don't try to source map
                this._updateBreakpoints(response, source.adapterData.remotePath, -1, sbs);
                return;
            }
        }
        if (source.sourceReference > 0) {
            var srcSource = this._sourceHandles.get(source.sourceReference);
            if (srcSource && srcSource.scriptId) {
                this._updateBreakpoints(response, null, srcSource.scriptId, sbs);
                return;
            }
        }
        if (source.path) {
            var path = this.convertClientPathToDebugger(source.path);
            this._mapSourceAndUpdateBreakpoints(response, path, sbs);
            return;
        }
        if (source.name) {
            // a core module
            this._findModule(source.name).then(function (scriptId) {
                if (scriptId >= 0) {
                    _this._updateBreakpoints(response, null, scriptId, sbs);
                }
                else {
                    _this.sendErrorResponse(response, 2019, localize(19, null, '{_module}'), { _module: source.name });
                }
                return;
            });
            return;
        }
        this.sendErrorResponse(response, 2012, 'No valid source specified.', null, vscode_debugadapter_1.ErrorDestination.Telemetry);
    };
    NodeDebugSession.prototype._mapSourceAndUpdateBreakpoints = function (response, path, lbs) {
        var sourcemap = false;
        var generated = null;
        if (this._sourceMaps) {
            generated = this._sourceMaps.MapPathFromSource(path);
            if (generated === path) {
                this.log('bp', "_mapSourceAndUpdateBreakpoints: source and generated are same -> ignore sourcemap");
                generated = null;
            }
        }
        if (generated) {
            sourcemap = true;
            // source map line numbers
            for (var _i = 0, lbs_1 = lbs; _i < lbs_1.length; _i++) {
                var lb = lbs_1[_i];
                var mapresult = this._sourceMaps.MapFromSource(path, lb.line, lb.column);
                if (mapresult) {
                    this.log('sm', "_mapSourceAndUpdateBreakpoints: src: '" + path + "' " + lb.line + ":" + lb.column + " -> gen: '" + mapresult.path + "' " + mapresult.line + ":" + mapresult.column);
                    if (mapresult.path !== generated) {
                        // this source line maps to a different destination file -> this is not supported, ignore breakpoint by setting line to -1
                        lb.line = -1;
                    }
                    else {
                        lb.line = mapresult.line;
                        lb.column = mapresult.column;
                    }
                }
                else {
                    this.log('sm', "_mapSourceAndUpdateBreakpoints: src: '" + path + "' " + lb.line + ":" + lb.column + " -> gen: couldn't be mapped; breakpoint ignored");
                    lb.line = -1;
                }
            }
            path = generated;
        }
        else if (!NodeDebugSession.isJavaScript(path)) {
            // ignore all breakpoints for this source
            for (var _a = 0, lbs_2 = lbs; _a < lbs_2.length; _a++) {
                var lb = lbs_2[_a];
                lb.line = -1;
            }
        }
        // try to convert local path to remote path
        path = this._localToRemote(path);
        this._updateBreakpoints(response, path, -1, lbs, sourcemap);
    };
    /*
     * clear and set all breakpoints of a given source.
     */
    NodeDebugSession.prototype._updateBreakpoints = function (response, path, scriptId, lbs, sourcemap) {
        var _this = this;
        if (sourcemap === void 0) { sourcemap = false; }
        // clear all existing breakpoints for the given path or script ID
        this._node.listBreakpoints().then(function (nodeResponse) {
            var toClear = new Array();
            var path_regexp = _this._pathToRegexp(path);
            // try to match breakpoints
            for (var _i = 0, _a = nodeResponse.body.breakpoints; _i < _a.length; _i++) {
                var breakpoint = _a[_i];
                switch (breakpoint.type) {
                    case 'scriptId':
                        if (scriptId === breakpoint.script_id) {
                            toClear.push(breakpoint.number);
                        }
                        break;
                    case 'scriptRegExp':
                        if (path_regexp === breakpoint.script_regexp) {
                            toClear.push(breakpoint.number);
                        }
                        break;
                }
            }
            return _this._clearBreakpoints(toClear);
        }).then(function () {
            return Promise.all(lbs.map(function (bp) { return _this._setBreakpoint(scriptId, path, bp, sourcemap); }));
        }).then(function (result) {
            response.body = {
                breakpoints: result
            };
            _this.sendResponse(response);
            _this.log('bp', "_updateBreakpoints: result " + JSON.stringify(result));
        }).catch(function (nodeResponse) {
            _this._sendNodeResponse(response, nodeResponse);
        });
    };
    /*
     * Clear breakpoints by their ids.
     */
    NodeDebugSession.prototype._clearBreakpoints = function (ids) {
        var _this = this;
        return Promise.all(ids.map(function (id) { return _this._node.clearBreakpoint({ breakpoint: id }); })).then(function (response) {
            return;
        }).catch(function (err) {
            return; // ignore errors
        });
    };
    /*
     * register a single breakpoint with node.
     */
    NodeDebugSession.prototype._setBreakpoint = function (scriptId, path, lb, sourcemap) {
        var _this = this;
        if (lb.line < 0) {
            // ignore this breakpoint because it couldn't be source mapped successfully
            var bp = new vscode_debugadapter_1.Breakpoint(false);
            bp.message = localize(20, null);
            return Promise.resolve(bp);
        }
        if (lb.line === 0) {
            lb.column += NodeDebugSession.FIRST_LINE_OFFSET;
        }
        var args;
        if (scriptId > 0) {
            args = {
                type: 'scriptId',
                target: scriptId,
                line: lb.line,
                column: lb.column,
                condition: lb.condition
            };
        }
        else {
            args = {
                type: 'scriptRegExp',
                target: this._pathToRegexp(path),
                line: lb.line,
                column: lb.column,
                condition: lb.condition
            };
        }
        return this._node.setBreakpoint(args).then(function (resp) {
            _this.log('bp', "_setBreakpoint: " + JSON.stringify(args));
            var actualLine = args.line;
            var actualColumn = args.column;
            var al = resp.body.actual_locations;
            if (al.length > 0) {
                actualLine = al[0].line;
                actualColumn = _this._adjustColumn(actualLine, al[0].column);
            }
            if (sourcemap) {
                if (actualLine !== args.line || actualColumn !== args.column) {
                    // breakpoint location was adjusted by node.js so we have to map the new location back to source
                    // first try to map the remote path back to local
                    var localpath = _this._remoteToLocal(path);
                    // then try to map js locations back to source locations
                    var mapresult = _this._sourceMaps.MapToSource(localpath, null, actualLine, actualColumn);
                    if (mapresult) {
                        _this.log('sm', "_setBreakpoint: bp verification gen: '" + localpath + "' " + actualLine + ":" + actualColumn + " -> src: '" + mapresult.path + "' " + mapresult.line + ":" + mapresult.column);
                        actualLine = mapresult.line;
                        actualColumn = mapresult.column;
                    }
                    else {
                        actualLine = lb.orgLine;
                        actualColumn = lb.orgColumn;
                    }
                }
                else {
                    actualLine = lb.orgLine;
                    actualColumn = lb.orgColumn;
                }
            }
            // nasty corner case: since we ignore the break-on-entry event we have to make sure that we
            // stop in the entry point line if the user has an explicit breakpoint there.
            // For this we check here whether a breakpoint is at the same location as the 'break-on-entry' location.
            // If yes, then we plan for hitting the breakpoint instead of 'continue' over it!
            if (!_this._stopOnEntry && _this._entryPath === path) {
                if (_this._entryLine === actualLine && _this._entryColumn === actualColumn) {
                    // we do not have to 'continue' but we have to generate a stopped event instead
                    _this._needContinue = false;
                    _this._needBreakpointEvent = true;
                    _this.log('la', '_setBreakpoint: remember to fire a breakpoint event later');
                }
            }
            return new vscode_debugadapter_1.Breakpoint(true, _this.convertDebuggerLineToClient(actualLine), _this.convertDebuggerColumnToClient(actualColumn));
        }).catch(function (error) {
            return new vscode_debugadapter_1.Breakpoint(false);
        });
    };
    /**
     * converts a path into a regular expression for use in the setbreakpoint request
     */
    NodeDebugSession.prototype._pathToRegexp = function (path) {
        if (!path) {
            return path;
        }
        var escPath = path.replace(/([/\\.?*()^${}|[\]])/g, '\\$1');
        // check for drive letter
        if (/^[a-zA-Z]:\\/.test(path)) {
            var u = escPath.substring(0, 1).toUpperCase();
            var l = u.toLowerCase();
            escPath = '[' + l + u + ']' + escPath.substring(1);
        }
        /*
        // support case-insensitive breakpoint paths
        const escPathUpper = escPath.toUpperCase();
        const escPathLower = escPath.toLowerCase();
        escPath = '';
        for (var i = 0; i < escPathUpper.length; i++) {
            const u = escPathUpper[i];
            const l = escPathLower[i];
            if (u === l) {
                escPath += u;
            } else {
                escPath += '[' + l + u + ']';
            }
        }
        */
        var pathRegex = '^(.*[\\/\\\\])?' + escPath + '$'; // skips drive letters
        return pathRegex;
    };
    //--- set function breakpoints request ------------------------------------------------------------------------------------
    NodeDebugSession.prototype.setFunctionBreakPointsRequest = function (response, args) {
        var _this = this;
        // clear all existing function breakpoints
        this._clearBreakpoints(this._functionBreakpoints).then(function () {
            _this._functionBreakpoints.length = 0; // clear array
            // set new function breakpoints
            return Promise.all(args.breakpoints.map(function (functionBreakpoint) { return _this._setFunctionBreakpoint(functionBreakpoint); }));
        }).then(function (results) {
            response.body = {
                breakpoints: results
            };
            _this.sendResponse(response);
            _this.log('bp', "setFunctionBreakPointsRequest: result " + JSON.stringify(results));
        }).catch(function (nodeResponse) {
            _this._sendNodeResponse(response, nodeResponse);
        });
    };
    /*
     * Register a single function breakpoint with node.
     * Returns verification info about the breakpoint.
     */
    NodeDebugSession.prototype._setFunctionBreakpoint = function (functionBreakpoint) {
        var _this = this;
        var args = {
            type: 'function',
            target: functionBreakpoint.name
        };
        if (functionBreakpoint.condition) {
            args.condition = functionBreakpoint.condition;
        }
        return this._node.setBreakpoint(args).then(function (resp) {
            _this._functionBreakpoints.push(resp.body.breakpoint); // remember function breakpoint ids
            var locations = resp.body.actual_locations;
            if (locations && locations.length > 0) {
                var actualLine = _this.convertDebuggerLineToClient(locations[0].line);
                var actualColumn = _this.convertDebuggerColumnToClient(_this._adjustColumn(actualLine, locations[0].column));
                return new vscode_debugadapter_1.Breakpoint(true, actualLine, actualColumn); // TODO@AW add source
            }
            else {
                return new vscode_debugadapter_1.Breakpoint(true);
            }
        }).catch(function (resp) {
            return {
                verified: false,
                message: resp.message
            };
        });
    };
    //--- set exception request -----------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.setExceptionBreakPointsRequest = function (response, args) {
        var _this = this;
        this.log('bp', "setExceptionBreakPointsRequest: " + JSON.stringify(args.filters));
        var nodeArgs = {
            type: 'all',
            enabled: false
        };
        var filters = args.filters;
        if (filters) {
            if (filters.indexOf('all') >= 0) {
                nodeArgs.enabled = true;
            }
            else if (filters.indexOf('uncaught') >= 0) {
                nodeArgs.type = 'uncaught';
                nodeArgs.enabled = true;
            }
        }
        this._node.setExceptionBreak(nodeArgs).then(function (nodeResponse) {
            _this.sendResponse(response);
        }).catch(function (err) {
            _this.sendErrorResponse(response, 2024, 'Configuring exception break options failed ({_nodeError}).', { _nodeError: err.message }, vscode_debugadapter_1.ErrorDestination.Telemetry);
        });
    };
    //--- set exception request -----------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.configurationDoneRequest = function (response, args) {
        // all breakpoints are configured now -> start debugging
        var info = 'nothing to do';
        if (this._needContinue) {
            this._needContinue = false;
            info = 'do a \'Continue\'';
            this._node.command('continue', null, function (nodeResponse) { });
        }
        if (this._needBreakpointEvent) {
            this._needBreakpointEvent = false;
            info = 'fire breakpoint event';
            this.sendEvent(new vscode_debugadapter_1.StoppedEvent(localize(21, null), NodeDebugSession.DUMMY_THREAD_ID));
        }
        this.log('la', "configurationDoneRequest: " + info);
        this.sendResponse(response);
    };
    //--- threads request -----------------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.threadsRequest = function (response) {
        var _this = this;
        this._node.command('threads', null, function (nodeResponse) {
            var threads = new Array();
            if (nodeResponse.success) {
                var ths = nodeResponse.body.threads;
                if (ths) {
                    for (var _i = 0, ths_1 = ths; _i < ths_1.length; _i++) {
                        var thread = ths_1[_i];
                        var id = thread.id;
                        if (id >= 0) {
                            threads.push(new vscode_debugadapter_1.Thread(id, "Thread (id: " + id + ")"));
                        }
                    }
                }
            }
            if (threads.length === 0) {
                threads.push(new vscode_debugadapter_1.Thread(NodeDebugSession.DUMMY_THREAD_ID, NodeDebugSession.DUMMY_THREAD_NAME));
            }
            response.body = {
                threads: threads
            };
            _this.sendResponse(response);
        });
    };
    //--- stacktrace request --------------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.stackTraceRequest = function (response, args) {
        var _this = this;
        var threadReference = args.threadId;
        var startFrame = typeof args.startFrame === 'number' ? args.startFrame : 0;
        var maxLevels = args.levels;
        var totalFrames = 0;
        if (threadReference !== NodeDebugSession.DUMMY_THREAD_ID) {
            this.sendErrorResponse(response, 2014, 'Unexpected thread reference {_thread}.', { _thread: threadReference }, vscode_debugadapter_1.ErrorDestination.Telemetry);
            return;
        }
        var backtraceArgs = {
            fromFrame: startFrame,
            toFrame: startFrame + maxLevels
        };
        var cmd = this._nodeInjectionAvailable ? 'vscode_backtrace' : 'backtrace';
        this.log('va', "stackTraceRequest: " + cmd + " " + startFrame + " " + maxLevels);
        this._node.command2(cmd, backtraceArgs).then(function (response) {
            if (response.body.totalFrames > 0 || response.body.frames) {
                var frames_1 = response.body.frames;
                totalFrames = response.body.totalFrames;
                return Promise.all(frames_1.map(function (frame) { return _this._createStackFrame(frame); }));
            }
            else {
                throw new Error('no stack');
            }
        }).then(function (stackframes) {
            response.body = {
                stackFrames: stackframes,
                totalFrames: totalFrames
            };
            _this.sendResponse(response);
        }).catch(function (error) {
            if (error.message === 'no stack') {
                if (_this._stoppedReason === 'pause') {
                    _this.sendErrorResponse(response, 2022, localize(22, null));
                }
                else {
                    _this.sendErrorResponse(response, 2023, localize(23, null));
                }
            }
            else {
                _this.sendErrorResponse(response, 2018, localize(24, null), { _command: error.command, _error: error.message });
            }
        });
    };
    /**
     * Create a single stack frame.
     */
    NodeDebugSession.prototype._createStackFrame = function (frame) {
        var _this = this;
        // resolve some refs
        return this._resolveValues([frame.script, frame.func, frame.receiver]).then(function () {
            var line = frame.line;
            var column = _this._adjustColumn(line, frame.column);
            var origin = localize(25, null);
            var script_val = _this._getValueFromCache(frame.script);
            if (script_val) {
                var name_1 = script_val.name;
                if (name_1) {
                    // system.js generates script names that are file urls
                    if (name_1.indexOf('file://') === 0) {
                        name_1 = name_1.replace('file://', '');
                    }
                    if (PathUtils.isAbsolutePath(name_1)) {
                        var remotePath_1 = name_1; // with remote debugging path might come from a different OS
                        // if launch.json defines localRoot and remoteRoot try to convert remote path back to a local path
                        var localPath_1 = _this._remoteToLocal(remotePath_1);
                        if (localPath_1 !== remotePath_1 && _this._attachMode) {
                            // assume attached to remote node process
                            origin = localize(26, null);
                        }
                        name_1 = Path.basename(localPath_1);
                        // source mapping
                        if (_this._sourceMaps) {
                            if (!FS.existsSync(localPath_1)) {
                                return _this._loadScript(script_val.id).then(function (script) {
                                    return _this._createStackFrameFromSourceMap(frame, script.contents, name_1, localPath_1, remotePath_1, origin, line, column);
                                });
                            }
                            return _this._createStackFrameFromSourceMap(frame, null, name_1, localPath_1, remotePath_1, origin, line, column);
                        }
                        return _this._createStackFrameFromPath(frame, name_1, localPath_1, remotePath_1, origin, line, column);
                    }
                    // if we end up here, 'name' is an internal module
                    origin = localize(27, null);
                }
                else {
                    // if a function is dynamically created from a string, its script has no name.
                    // create a name by using the script id and append ".js" so that JavaScript contents is detected.
                    name_1 = "VM" + script_val.id + ".js";
                }
                // source not found locally -> prepare to stream source content from node backend.
                var sourceHandle = _this._sourceHandles.create(new SourceSource(script_val.id));
                var src = new vscode_debugadapter_1.Source(name_1, null, sourceHandle, origin);
                return _this._createStackFrameFromSource(frame, src, line, column);
            }
            return _this._createStackFrameFromSource(frame, null, line, column);
        });
    };
    /**
     * Creates a StackFrame when source maps are involved.
     */
    NodeDebugSession.prototype._createStackFrameFromSourceMap = function (frame, content, name, localPath, remotePath, origin, line, column) {
        // try to map
        var mapresult = this._sourceMaps.MapToSource(localPath, content, line, column, sourceMaps_1.Bias.GREATEST_LOWER_BOUND);
        if (!mapresult) {
            mapresult = this._sourceMaps.MapToSource(localPath, content, line, column, sourceMaps_1.Bias.LEAST_UPPER_BOUND);
        }
        if (mapresult) {
            this.log('sm', "_createStackFrame: gen: '" + localPath + "' " + line + ":" + column + " -> src: '" + mapresult.path + "' " + mapresult.line + ":" + mapresult.column);
            // verify that a file exists at path
            if (FS.existsSync(mapresult.path)) {
                // use this mapping
                var src = new vscode_debugadapter_1.Source(Path.basename(mapresult.path), this.convertDebuggerPathToClient(mapresult.path));
                return this._createStackFrameFromSource(frame, src, mapresult.line, mapresult.column);
            }
            else {
                // file doesn't exist at path
                // if source map has inlined source use it
                if (mapresult.content) {
                    this.log('sm', "_createStackFrame: source '" + mapresult.path + "' doesn't exist -> use inlined source");
                    var sourceHandle = this._sourceHandles.create(new SourceSource(0, mapresult.content));
                    origin = localize(28, null);
                    var src = new vscode_debugadapter_1.Source(Path.basename(mapresult.path), null, sourceHandle, origin, { inlinePath: mapresult.path });
                    return this._createStackFrameFromSource(frame, src, mapresult.line, mapresult.column);
                }
                else {
                    this.log('sm', "_createStackFrame: source doesn't exist and no inlined source -> use generated file");
                    return this._createStackFrameFromPath(frame, name, localPath, remotePath, origin, line, column);
                }
            }
        }
        else {
            this.log('sm', "_createStackFrameFromSourceMap: gen: '" + localPath + "' " + line + ":" + column + " -> couldn't be mapped to source -> use generated file");
            return this._createStackFrameFromPath(frame, name, localPath, remotePath, origin, line, column);
        }
    };
    /**
     * Creates a StackFrame from the given local path.
     * The remote path is used if the local path doesn't exist.
     */
    NodeDebugSession.prototype._createStackFrameFromPath = function (frame, name, localPath, remotePath, origin, line, column) {
        var src;
        if (FS.existsSync(localPath)) {
            src = new vscode_debugadapter_1.Source(name, this.convertDebuggerPathToClient(localPath));
        }
        else {
            // fall back: source not found locally -> prepare to stream source content from remote node.
            var script_val = this._getValueFromCache(frame.script);
            var script_id = script_val.id;
            var sourceHandle = this._sourceHandles.create(new SourceSource(script_id));
            src = new vscode_debugadapter_1.Source(name, null, sourceHandle, origin, { remotePath: remotePath }); // assume it is a remote path
        }
        return this._createStackFrameFromSource(frame, src, line, column);
    };
    /**
     * Creates a StackFrame with the given source location information.
     * The name of the frame is extracted from the frame.
     */
    NodeDebugSession.prototype._createStackFrameFromSource = function (frame, src, line, column) {
        var func_name;
        var func_val = this._getValueFromCache(frame.func);
        if (func_val) {
            func_name = func_val.inferredName;
            if (!func_name || func_name.length === 0) {
                func_name = func_val.name;
            }
        }
        if (!func_name || func_name.length === 0) {
            func_name = localize(29, null);
        }
        var frameReference = this._frameHandles.create(frame);
        return new vscode_debugadapter_1.StackFrame(frameReference, func_name, src, this.convertDebuggerLineToClient(line), this.convertDebuggerColumnToClient(column));
    };
    NodeDebugSession.prototype.scopesRequest = function (response, args) {
        var _this = this;
        var frame = this._frameHandles.get(args.frameId);
        if (!frame) {
            this.sendErrorResponse(response, 2020, 'stack frame not valid', null, vscode_debugadapter_1.ErrorDestination.Telemetry);
            return;
        }
        var frameIx = frame.index;
        var frameThis = this._getValueFromCache(frame.receiver);
        var scopesArgs = {
            frame_index: frameIx,
            frameNumber: frameIx
        };
        var cmd = 'scopes';
        if (this._nodeInjectionAvailable) {
            cmd = 'vscode_scopes';
            scopesArgs.maxLocals = this._chunkSize;
        }
        this.log('va', "scopesRequest: scope " + frameIx);
        this._node.command2(cmd, scopesArgs).then(function (scopesResponse) {
            var scopes = scopesResponse.body.scopes;
            return Promise.all(scopes.map(function (scope) {
                var type = scope.type;
                var extra = type === 1 ? frameThis : null;
                var expensive = type === 0; // global scope is expensive
                var scopeName;
                if (type >= 0 && type < NodeDebugSession.SCOPE_NAMES.length) {
                    if (type === 1 && typeof scopesResponse.body.vscode_locals === 'number') {
                        expensive = true;
                        scopeName = localize(30, null, scopesArgs.maxLocals, scopesResponse.body.vscode_locals);
                    }
                    else {
                        scopeName = NodeDebugSession.SCOPE_NAMES[type];
                    }
                }
                else {
                    scopeName = localize(31, null, type);
                }
                return _this._resolveValues([scope.object]).then(function (resolved) {
                    return new vscode_debugadapter_1.Scope(scopeName, _this._variableHandles.create(new ScopeContainer(scope, resolved[0], extra)), expensive);
                }).catch(function (error) {
                    return new vscode_debugadapter_1.Scope(scopeName, 0);
                });
            }));
        }).then(function (scopes) {
            // exception scope
            if (frameIx === 0 && _this._exception) {
                scopes.unshift(new vscode_debugadapter_1.Scope(localize(32, null), _this._variableHandles.create(new PropertyContainer(_this._exception))));
            }
            response.body = {
                scopes: scopes
            };
            _this.sendResponse(response);
        }).catch(function (error) {
            // in case of error return empty scopes array
            response.body = { scopes: [] };
            _this.sendResponse(response);
        });
    };
    //--- variables request ---------------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.variablesRequest = function (response, args) {
        var _this = this;
        var reference = args.variablesReference;
        var variablesContainer = this._variableHandles.get(reference);
        if (variablesContainer) {
            variablesContainer.Expand(this).then(function (variables) {
                variables.sort(NodeDebugSession.compareVariableNames);
                response.body = {
                    variables: variables
                };
                _this.sendResponse(response);
            }).catch(function (err) {
                // in case of error return empty variables array
                response.body = {
                    variables: []
                };
                _this.sendResponse(response);
            });
        }
        else {
            // no container found: return empty variables array
            response.body = {
                variables: []
            };
            this.sendResponse(response);
        }
    };
    /*
     * Returns indexed or named properties for the given structured object as a variables array.
     * There are three modes:
     * 'all': add all properties (indexed and named)
     * 'range': add 'count' indexed properties starting at 'start'
     * 'named': add only the named properties.
     */
    NodeDebugSession.prototype._createProperties = function (obj, mode, start, count) {
        var _this = this;
        if (start === void 0) { start = 0; }
        if (count === void 0) { count = 0; }
        if (obj && !obj.properties) {
            // if properties are missing, this is an indication that we are running injected code which doesn't return the properties for large objects
            if (this._nodeInjectionAvailable) {
                var handle = obj.handle;
                switch (mode) {
                    case 'range':
                    case 'all':
                        // try to use "vscode_size" from injected code
                        if (typeof obj.vscode_size === 'number' && typeof handle === 'number' && handle !== 0) {
                            if (obj.vscode_size >= 0) {
                                this.log('va', "_createProperties: vscode_slice " + start + " " + count);
                                return this._node.command2('vscode_slice', { handle: handle, start: start, count: count }).then(function (resp) {
                                    var items = resp.body.result;
                                    return Promise.all(items.map(function (item) {
                                        return _this._createVariable("[" + item.name + "]", item.value);
                                    }));
                                });
                            }
                        }
                        break;
                    case 'named':
                        if (typeof obj.vscode_size === 'number' && typeof handle === 'number' && handle !== 0) {
                            this.log('va', "_createProperties: vscode_slice");
                            return this._node.command2('vscode_slice', { handle: handle, count: count }).then(function (resp) {
                                var items = resp.body.result;
                                return Promise.all(items.map(function (item) {
                                    return _this._createVariable(item.name, item.value);
                                }));
                            });
                        }
                        break;
                }
            }
            // if we end up here, something went wrong...
            return Promise.resolve([]);
        }
        var selectedProperties = new Array();
        var found_proto = false;
        for (var _i = 0, _a = obj.properties; _i < _a.length; _i++) {
            var property = _a[_i];
            if ('name' in property) {
                var name_2 = property.name;
                if (name_2 === NodeDebugSession.PROTO) {
                    found_proto = true;
                }
                switch (mode) {
                    case 'all':
                        selectedProperties.push(property);
                        break;
                    case 'named':
                        if (typeof name_2 === 'string') {
                            selectedProperties.push(property);
                        }
                        break;
                    case 'range':
                        if (typeof name_2 === 'number' && name_2 >= start && name_2 < start + count) {
                            selectedProperties.push(property);
                        }
                        break;
                }
            }
        }
        // do we have to add the protoObject to the list of properties?
        if (!found_proto && (mode === 'all' || mode === 'named')) {
            var h = obj.handle;
            if (h > 0) {
                obj.protoObject.name = NodeDebugSession.PROTO;
                selectedProperties.push(obj.protoObject);
            }
        }
        return this._createPropertyVariables(obj, selectedProperties);
    };
    /**
     * Resolves the given properties and returns them as an array of Variables.
     * If the properties are indexed (opposed to named), a value 'start' is added to the index number.
     * 'noBrackets' controls whether the index is enclosed in brackets.
     * If a value is undefined it probes for a getter.
     */
    NodeDebugSession.prototype._createPropertyVariables = function (obj, properties, start, noBrackets) {
        var _this = this;
        if (typeof start !== 'number') {
            start = 0;
        }
        return this._resolveValues(properties).then(function () {
            return Promise.all(properties.map(function (property) {
                var val = _this._getValueFromCache(property);
                // create 'name'
                var name;
                if (typeof property.name === 'number') {
                    var ix = +property.name;
                    name = noBrackets ? "" + (start + ix) : "[" + (start + ix) + "]";
                }
                else {
                    name = property.name;
                }
                // if value 'undefined' trigger a getter
                if (val.type === 'undefined' && !val.value && obj) {
                    var args = {
                        expression: "obj." + name,
                        additional_context: [
                            { name: 'obj', handle: obj.handle }
                        ],
                        disable_break: true,
                        maxStringLength: NodeDebugSession.MAX_STRING_LENGTH
                    };
                    _this.log('va', "_createPropertyVariables: trigger getter");
                    return _this._node.evaluate(args).then(function (response) {
                        return _this._createVariable(name, response.body);
                    }).catch(function (err) {
                        return new vscode_debugadapter_1.Variable(name, 'undefined');
                    });
                }
                else {
                    return _this._createVariable(name, val);
                }
            }));
        });
    };
    /**
     * Create a Variable with the given name and value.
     * For structured values the variable object will have a corresponding expander.
     */
    NodeDebugSession.prototype._createVariable = function (name, val) {
        var _this = this;
        if (!val) {
            return Promise.resolve(null);
        }
        switch (val.type) {
            case 'undefined':
            case 'null':
                return Promise.resolve(new vscode_debugadapter_1.Variable(name, val.type));
            case 'string':
                return this._createStringVariable(name, val);
            case 'number':
                return Promise.resolve(new vscode_debugadapter_1.Variable(name, val.value.toString()));
            case 'boolean':
                return Promise.resolve(new vscode_debugadapter_1.Variable(name, val.value.toString().toLowerCase())); // node returns these boolean values capitalized
            case 'object':
            case 'function':
            case 'regexp':
            case 'promise':
            case 'generator':
            case 'error':
                var object_1 = val;
                var value_1 = object_1.className;
                var text = object_1.text;
                switch (value_1) {
                    case 'Array':
                    case 'ArrayBuffer':
                    case 'Int8Array':
                    case 'Uint8Array':
                    case 'Uint8ClampedArray':
                    case 'Int16Array':
                    case 'Uint16Array':
                    case 'Int32Array':
                    case 'Uint32Array':
                    case 'Float32Array':
                    case 'Float64Array':
                        return this._createArrayVariable(name, val);
                    case 'RegExp':
                        return Promise.resolve(new vscode_debugadapter_1.Variable(name, text, this._variableHandles.create(new PropertyContainer(val))));
                    case 'Generator':
                    case 'Object':
                        return this._resolveValues([object_1.constructorFunction]).then(function (resolved) {
                            if (resolved[0]) {
                                var constructor_name = resolved[0].name;
                                if (constructor_name) {
                                    value_1 = constructor_name;
                                }
                            }
                            if (object_1.status) {
                                value_1 += " { " + object_1.status + " }";
                            }
                            return new vscode_debugadapter_1.Variable(name, value_1, _this._variableHandles.create(new PropertyContainer(val)));
                        });
                    case 'Function':
                    case 'Error':
                    default:
                        if (text) {
                            if (text.indexOf('\n') >= 0) {
                                // replace body of function with '...'
                                var pos = text.indexOf('{');
                                if (pos > 0) {
                                    text = text.substring(0, pos) + '{ … }';
                                }
                            }
                            value_1 = text;
                        }
                        break;
                }
                return Promise.resolve(new vscode_debugadapter_1.Variable(name, value_1, this._variableHandles.create(new PropertyContainer(val))));
            case 'set':
                return this._createSetVariable(name, val);
            case 'map':
                return this._createMapVariable(name, val);
            case 'frame':
            default:
                return Promise.resolve(new vscode_debugadapter_1.Variable(name, val.value ? val.value.toString() : 'undefined'));
        }
    };
    //--- long array support
    NodeDebugSession.prototype._createArrayVariable = function (name, array) {
        var _this = this;
        return this._getArraySize(array).then(function (length) {
            var expander;
            if (length > _this._chunkSize) {
                expander = new ArrayContainer(array, length, _this._chunkSize);
            }
            else {
                expander = new PropertyContainer(array);
            }
            return new vscode_debugadapter_1.Variable(name, array.className + "[" + ((length >= 0) ? length.toString() : '') + "]", _this._variableHandles.create(expander));
        });
    };
    NodeDebugSession.prototype._getArraySize = function (array) {
        if (typeof array.vscode_size === 'number') {
            return Promise.resolve(array.vscode_size);
        }
        var args = {
            expression: "array.length",
            disable_break: true,
            additional_context: [
                { name: 'array', handle: array.handle }
            ]
        };
        this.log('va', "_getArraySize: array.length");
        return this._node.evaluate(args).then(function (response) {
            return +response.body.value;
        });
    };
    /*
        private _createLargeArrayElements(array: any, start: number, count: number) : Promise<Variable[]> {
    
            const args = {
                expression: `array.slice(${start}, ${start+count})`,
                disable_break: true,
                additional_context: [
                    { name: 'array', handle: array.handle }
                ]
            };
    
            this.log('va', `_createLargeArrayElements: array.slice`);
            return this._node.evaluate(args).then(response => {
    
                const properties = response.body.properties;
                const selectedProperties = new Array<any>();
    
                for (let property of properties) {
                    const name = property.name;
                    if (typeof name === 'number' || (typeof name === 'string' && name[0] >= '0' && name[0] <= '9')) {
                        selectedProperties.push(property);
                    }
                }
    
                return this._createPropertyVariables(null, selectedProperties);
            });
        }
    */
    //--- ES6 Set support
    NodeDebugSession.prototype._createSetVariable = function (name, set) {
        var _this = this;
        var args = {
            // initially we need only the size of the set
            expression: "set.size",
            disable_break: true,
            additional_context: [
                { name: 'set', handle: set.handle }
            ]
        };
        this.log('va', "_createSetVariable: set.size");
        return this._node.evaluate(args).then(function (response) {
            var size = +response.body.value;
            var expandFunc;
            if (size > _this._chunkSize) {
                expandFunc = function () {
                    var variables = [];
                    var _loop_1 = function(start) {
                        var end = Math.min(start + _this._chunkSize, size) - 1;
                        var rangeExpander = new Expander(function () { return _this._createSetElements(set, start, end); });
                        variables.push(new vscode_debugadapter_1.Variable(start + ".." + end, ' ', _this._variableHandles.create(rangeExpander)));
                    };
                    for (var start = 0; start < size; start += _this._chunkSize) {
                        _loop_1(start);
                    }
                    return Promise.resolve(variables);
                };
            }
            else {
                expandFunc = function () { return _this._createSetElements(set, 0, size); };
            }
            return new vscode_debugadapter_1.Variable(name, "Set[" + size + "]", _this._variableHandles.create(new Expander(expandFunc)));
        });
    };
    NodeDebugSession.prototype._createSetElements = function (set, start, end) {
        var _this = this;
        var args = {
            expression: "var r = [], i = 0; set.forEach(v => { if (i >= " + start + " && i <= " + end + ") r.push(v); i++; }); r",
            disable_break: true,
            additional_context: [
                { name: 'set', handle: set.handle }
            ]
        };
        var length = end - start + 1;
        this.log('va', "_createSetElements: set.slice " + start + " " + length);
        return this._node.evaluate(args).then(function (response) {
            var properties = response.body.properties;
            var selectedProperties = new Array();
            for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
                var property = properties_1[_i];
                var name_3 = property.name;
                if (typeof name_3 === 'number' || (typeof name_3 === 'string' && name_3[0] >= '0' && name_3[0] <= '9')) {
                    selectedProperties.push(property);
                }
            }
            return _this._createPropertyVariables(null, selectedProperties, start, true);
        });
    };
    //--- ES6 map support
    NodeDebugSession.prototype._createMapVariable = function (name, map) {
        var _this = this;
        var args = {
            // initially we need only the size of the map
            expression: "map.size",
            disable_break: true,
            additional_context: [
                { name: 'map', handle: map.handle }
            ]
        };
        this.log('va', "_createMapVariable: map.size");
        return this._node.evaluate(args).then(function (response) {
            var size = +response.body.value;
            var expandFunc;
            if (size > _this._chunkSize) {
                expandFunc = function () {
                    var variables = [];
                    var _loop_2 = function(start) {
                        var end = Math.min(start + _this._chunkSize, size) - 1;
                        var rangeExpander = new Expander(function () { return _this._createMapElements(map, start, end); });
                        variables.push(new vscode_debugadapter_1.Variable(start + ".." + end, ' ', _this._variableHandles.create(rangeExpander)));
                    };
                    for (var start = 0; start < size; start += _this._chunkSize) {
                        _loop_2(start);
                    }
                    return Promise.resolve(variables);
                };
            }
            else {
                expandFunc = function () { return _this._createMapElements(map, 0, size); };
            }
            return new vscode_debugadapter_1.Variable(name, "Map[" + size + "]", _this._variableHandles.create(new Expander(expandFunc)));
        });
    };
    NodeDebugSession.prototype._createMapElements = function (map, start, end) {
        var _this = this;
        // for each slot of the map we create three slots in a helper array: label, key, value
        var args = {
            expression: "var r=[],i=0; map.forEach((v,k) => { if (i>=" + start + " && i<=" + end + ") { r.push(k+' \u2192 '+v); r.push(k); r.push(v);} i++; }); r",
            disable_break: true,
            additional_context: [
                { name: 'map', handle: map.handle }
            ]
        };
        var count = end - start + 1;
        this.log('va', "_createMapElements: map.slice " + start + " " + count);
        return this._node.evaluate(args).then(function (response) {
            var properties = response.body.properties;
            var selectedProperties = new Array();
            for (var _i = 0, properties_2 = properties; _i < properties_2.length; _i++) {
                var property = properties_2[_i];
                var name_4 = property.name;
                if (typeof name_4 === 'number' || (typeof name_4 === 'string' && name_4[0] >= '0' && name_4[0] <= '9')) {
                    selectedProperties.push(property);
                }
            }
            return _this._resolveValues(selectedProperties).then(function () {
                var variables = [];
                var _loop_3 = function(i) {
                    var key = _this._getValueFromCache(selectedProperties[i + 1]);
                    var val = _this._getValueFromCache(selectedProperties[i + 2]);
                    var expander = new Expander(function () {
                        return Promise.all([
                            _this._createVariable('key', key),
                            _this._createVariable('value', val)
                        ]);
                    });
                    var x = _this._getValueFromCache(selectedProperties[i]);
                    variables.push(new vscode_debugadapter_1.Variable((start + (i / 3)).toString(), x.value, _this._variableHandles.create(expander)));
                };
                for (var i = 0; i < selectedProperties.length; i += 3) {
                    _loop_3(i);
                }
                return variables;
            });
        });
    };
    //--- long string support
    NodeDebugSession.prototype._createStringVariable = function (name, val) {
        var _this = this;
        var str_val = val.value;
        if (NodeDebugSession.LONG_STRING_MATCHER.exec(str_val)) {
            var args = {
                expression: "str",
                disable_break: true,
                maxStringLength: NodeDebugSession.MAX_STRING_LENGTH,
                additional_context: [
                    { name: 'str', handle: val.handle }
                ]
            };
            this.log('va', "_createStringVariable: get full string");
            return this._node.evaluate(args).then(function (response) {
                str_val = response.body.value;
                return _this._createStringVariable2(name, str_val);
            });
        }
        else {
            return Promise.resolve(this._createStringVariable2(name, str_val));
        }
    };
    NodeDebugSession.prototype._createStringVariable2 = function (name, s) {
        if (s) {
            s = s.replace('\n', '\\n').replace('\r', '\\r');
        }
        return new vscode_debugadapter_1.Variable(name, "\"" + s + "\"");
    };
    //--- setVariable request -------------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.setVariableRequest = function (response, args) {
        var _this = this;
        var reference = args.variablesReference;
        var name = args.name;
        var value = args.value;
        var variablesContainer = this._variableHandles.get(reference);
        if (variablesContainer) {
            variablesContainer.SetValue(this, name, value).then(function (newValue) {
                response.body = {
                    value: newValue
                };
                _this.sendResponse(response);
            }).catch(function (err) {
                _this.sendErrorResponse(response, 2004, err.message);
            });
        }
        else {
            this.sendErrorResponse(response, 2025, Expander.SET_VALUE_ERROR);
        }
    };
    NodeDebugSession.prototype._setVariableValue = function (frame, scope, name, value) {
        var _this = this;
        var evalArgs = {
            expression: value,
            disable_break: true,
            maxStringLength: NodeDebugSession.MAX_STRING_LENGTH,
            frame: frame
        };
        return this._node.evaluate(evalArgs).then(function (evalResponse) {
            var args = {
                scope: {
                    frameNumber: frame,
                    number: scope
                },
                name: name,
                newValue: {
                    value: evalResponse.body.value,
                    type: evalResponse.body.type
                }
            };
            return _this._node.setVariableValue(args).then(function (response) {
                return _this._createVariable('_setVariableValue', response.body.newValue).then(function (variable) {
                    return variable.value;
                });
            });
        });
    };
    NodeDebugSession.prototype._setPropertyValue = function (objHandle, propName, value) {
        var _this = this;
        if (propName[0] !== '[') {
            propName = '.' + propName;
        }
        var args = {
            global: true,
            expression: "obj" + propName + " = " + value,
            disable_break: true,
            maxStringLength: NodeDebugSession.MAX_STRING_LENGTH,
            additional_context: [
                { name: 'obj', handle: objHandle }
            ]
        };
        return this._node.evaluate(args).then(function (response) {
            return _this._createVariable('_setpropertyvalue', response.body).then(function (variable) {
                return variable.value;
            });
        });
    };
    //--- pause request -------------------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.pauseRequest = function (response, args) {
        var _this = this;
        this._node.command('suspend', null, function (nodeResponse) {
            if (nodeResponse.success) {
                _this._stopped('pause');
                _this._lastStoppedEvent = new vscode_debugadapter_1.StoppedEvent(localize(33, null), NodeDebugSession.DUMMY_THREAD_ID);
                _this.sendResponse(response);
                _this.sendEvent(_this._lastStoppedEvent);
            }
            else {
                _this._sendNodeResponse(response, nodeResponse);
            }
        });
    };
    //--- continue request ----------------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.continueRequest = function (response, args) {
        var _this = this;
        this._node.command('continue', null, function (nodeResponse) {
            _this._sendNodeResponse(response, nodeResponse);
        });
    };
    //--- step request --------------------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.nextRequest = function (response, args) {
        var _this = this;
        this._node.command('continue', { stepaction: 'next' }, function (nodeResponse) {
            _this._sendNodeResponse(response, nodeResponse);
        });
    };
    NodeDebugSession.prototype.stepInRequest = function (response, args) {
        var _this = this;
        this._node.command('continue', { stepaction: 'in' }, function (nodeResponse) {
            _this._sendNodeResponse(response, nodeResponse);
        });
    };
    NodeDebugSession.prototype.stepOutRequest = function (response, args) {
        var _this = this;
        this._node.command('continue', { stepaction: 'out' }, function (nodeResponse) {
            _this._sendNodeResponse(response, nodeResponse);
        });
    };
    NodeDebugSession.prototype.stepBackRequest = function (response, args) {
        var _this = this;
        this._node.command('continue', { stepaction: 'back' }, function (nodeResponse) {
            _this._sendNodeResponse(response, nodeResponse);
        });
    };
    //--- evaluate request ----------------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.evaluateRequest = function (response, args) {
        var _this = this;
        var expression = args.expression;
        var evalArgs = {
            expression: expression,
            disable_break: true,
            maxStringLength: NodeDebugSession.MAX_STRING_LENGTH
        };
        if (args.frameId > 0) {
            var frame = this._frameHandles.get(args.frameId);
            if (!frame) {
                this.sendErrorResponse(response, 2020, 'stack frame not valid', null, vscode_debugadapter_1.ErrorDestination.Telemetry);
                return;
            }
            var frameIx = frame.index;
            evalArgs.frame = frameIx;
        }
        else {
            evalArgs.global = true;
        }
        this._node.command(this._nodeInjectionAvailable ? 'vscode_evaluate' : 'evaluate', evalArgs, function (resp) {
            if (resp.success) {
                _this._createVariable('evaluate', resp.body).then(function (v) {
                    if (v) {
                        response.body = {
                            result: v.value,
                            variablesReference: v.variablesReference
                        };
                    }
                    else {
                        response.success = false;
                        response.message = localize(34, null);
                    }
                    _this.sendResponse(response);
                });
            }
            else {
                response.success = false;
                if (resp.message.indexOf('ReferenceError: ') === 0 || resp.message === 'No frames') {
                    response.message = localize(35, null);
                }
                else if (resp.message.indexOf('SyntaxError: ') === 0) {
                    var m = resp.message.substring('SyntaxError: '.length).toLowerCase();
                    response.message = localize(36, null, m);
                }
                else {
                    response.message = resp.message;
                }
                _this.sendResponse(response);
            }
        });
    };
    //--- source request ------------------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.sourceRequest = function (response, args) {
        var _this = this;
        var sourceHandle = args.sourceReference;
        var srcSource = this._sourceHandles.get(sourceHandle);
        if (srcSource) {
            if (srcSource.source) {
                response.body = {
                    content: srcSource.source
                };
                this.sendResponse(response);
                return;
            }
            if (srcSource.scriptId) {
                this._loadScript(srcSource.scriptId).then(function (script) {
                    srcSource.source = script.contents;
                    response.body = {
                        content: srcSource.source
                    };
                    _this.sendResponse(response);
                }).catch(function (err) {
                    srcSource.source = localize(37, null);
                    response.body = {
                        content: srcSource.source
                    };
                    _this.sendResponse(response);
                });
                return;
            }
        }
        this.sendErrorResponse(response, 9999, 'sourceRequest error', null, vscode_debugadapter_1.ErrorDestination.Telemetry);
    };
    NodeDebugSession.prototype._loadScript = function (scriptId) {
        var _this = this;
        var script = this._scripts.get(scriptId);
        if (script) {
            return Promise.resolve(script);
        }
        var args = {
            types: 1 + 2 + 4,
            includeSource: true,
            ids: [scriptId]
        };
        this.log('ls', "_loadScript: " + scriptId);
        return this._node.scripts(args).then(function (nodeResponse) {
            var s = new Script(nodeResponse.body[0]);
            _this._scripts.set(scriptId, s);
            return s;
        });
    };
    //---- private helpers ----------------------------------------------------------------------------------------------------
    NodeDebugSession.prototype.log = function (traceCategory, message) {
        if (this._trace && (this._traceAll || this._trace.indexOf(traceCategory) >= 0)) {
            this.outLine(process.pid + ": " + message);
        }
    };
    /**
     * 'Attribute missing' error
     */
    NodeDebugSession.prototype.sendAttributeMissingErrorResponse = function (response, attribute) {
        this.sendErrorResponse(response, 2005, localize(38, null, attribute));
    };
    /**
     * 'Path does not exist' error
     */
    NodeDebugSession.prototype.sendNotExistErrorResponse = function (response, attribute, path) {
        this.sendErrorResponse(response, 2007, localize(39, null, attribute, '{path}'), { path: path });
    };
    /**
     * 'Path not absolute' error with 'More Information' link.
     */
    NodeDebugSession.prototype.sendRelativePathErrorResponse = function (response, attribute, path) {
        var format = localize(40, null, attribute, '{path}', '${workspaceRoot}/');
        this.sendErrorResponseWithInfoLink(response, 2008, format, { path: path }, 20003);
    };
    /**
     * Send error response with 'More Information' link.
     */
    NodeDebugSession.prototype.sendErrorResponseWithInfoLink = function (response, code, format, variables, infoId) {
        this.sendErrorResponse(response, {
            id: code,
            format: format,
            variables: variables,
            showUser: true,
            url: 'http://go.microsoft.com/fwlink/?linkID=534832#_' + infoId.toString(),
            urlLabel: localize(41, null)
        });
    };
    /**
     * send a line of text to an output channel.
     */
    NodeDebugSession.prototype.outLine = function (message, category) {
        this.sendEvent(new vscode_debugadapter_1.OutputEvent(message + '\n', category ? category : 'console'));
    };
    /**
     * Tries to map a (local) VSCode path to a corresponding path on a remote host (where node is running).
     * The remote host might use a different OS so we have to make sure to create correct file paths.
     */
    NodeDebugSession.prototype._localToRemote = function (localPath) {
        if (this._remoteRoot && this._localRoot) {
            var relPath = PathUtils.makeRelative2(this._localRoot, localPath);
            var remotePath = PathUtils.join(this._remoteRoot, relPath);
            if (/^[a-zA-Z]:[\/\\]/.test(this._remoteRoot)) {
                remotePath = PathUtils.toWindows(remotePath);
            }
            this.log('bp', "_localToRemote: " + localPath + " -> " + remotePath);
            return remotePath;
        }
        else {
            return localPath;
        }
    };
    /**
     * Tries to map a path from the remote host (where node is running) to a corresponding local path.
     * The remote host might use a different OS so we have to make sure to create correct file paths.
     */
    NodeDebugSession.prototype._remoteToLocal = function (remotePath) {
        if (this._remoteRoot && this._localRoot) {
            var relPath = PathUtils.makeRelative2(this._remoteRoot, remotePath);
            var localPath = PathUtils.join(this._localRoot, relPath);
            if (process.platform === 'win32') {
                localPath = PathUtils.toWindows(localPath);
            }
            this.log('bp', "_remoteToLocal: " + remotePath + " -> " + localPath);
            return localPath;
        }
        else {
            return remotePath;
        }
    };
    NodeDebugSession.prototype._sendNodeResponse = function (response, nodeResponse) {
        if (nodeResponse.success) {
            this.sendResponse(response);
        }
        else {
            var errmsg = nodeResponse.message;
            if (errmsg.indexOf('unresponsive') >= 0) {
                this.sendErrorResponse(response, 2015, localize(42, null), { _request: nodeResponse.command });
            }
            else if (errmsg.indexOf('timeout') >= 0) {
                this.sendErrorResponse(response, 2016, localize(43, null), { _request: nodeResponse.command });
            }
            else {
                this.sendErrorResponse(response, 2013, 'Node.js request \'{_request}\' failed (reason: {_error}).', { _request: nodeResponse.command, _error: errmsg }, vscode_debugadapter_1.ErrorDestination.Telemetry);
            }
        }
    };
    NodeDebugSession.prototype._cache = function (handle, obj) {
        this._refCache.set(handle, obj);
    };
    NodeDebugSession.prototype._getValueFromCache = function (container) {
        var value = this._refCache.get(container.ref);
        if (value) {
            return value;
        }
        // console.error('ref not found cache');
        return null;
    };
    NodeDebugSession.prototype._resolveValues = function (mirrors) {
        var _this = this;
        var needLookup = new Array();
        for (var _i = 0, mirrors_1 = mirrors; _i < mirrors_1.length; _i++) {
            var mirror = mirrors_1[_i];
            if (!mirror.value && mirror.ref) {
                if (needLookup.indexOf(mirror.ref) < 0) {
                    needLookup.push(mirror.ref);
                }
            }
        }
        if (needLookup.length > 0) {
            return this._resolveToCache(needLookup).then(function () {
                return mirrors.map(function (m) { return _this._refCache.get(m.ref || m.handle); });
            });
        }
        else {
            //return Promise.resolve(<V8Object[]>mirrors);
            return Promise.resolve(mirrors.map(function (m) { return _this._refCache.get(m.ref || m.handle); }));
        }
    };
    NodeDebugSession.prototype._resolveToCache = function (handles) {
        var _this = this;
        var lookup = new Array();
        for (var _i = 0, handles_1 = handles; _i < handles_1.length; _i++) {
            var handle = handles_1[_i];
            var val = this._refCache.get(handle);
            if (!val) {
                if (handle >= 0) {
                    lookup.push(handle);
                }
                else {
                }
            }
        }
        if (lookup.length > 0) {
            var cmd = this._nodeInjectionAvailable ? 'vscode_lookup' : 'lookup';
            this.log('va', "_resolveToCache: " + cmd + " " + lookup.length + " handles");
            return this._node.command2(cmd, { handles: lookup }).then(function (resp) {
                for (var key in resp.body) {
                    var obj = resp.body[key];
                    var handle = obj.handle;
                    _this._cache(handle, obj);
                }
                return handles.map(function (handle) { return _this._refCache.get(handle); });
            }).catch(function (resp) {
                var val;
                if (resp.message.indexOf('timeout') >= 0) {
                    val = { type: 'number', value: '<...>' };
                }
                else {
                    val = { type: 'number', value: "<data error: " + resp.message + ">" };
                }
                // store error value in cache
                for (var i = 0; i < handles.length; i++) {
                    var handle = handles[i];
                    var r = _this._refCache.get(handle);
                    if (!r) {
                        _this._cache(handle, val);
                    }
                }
                return handles.map(function (handle) { return _this._refCache.get(handle); });
            });
        }
        else {
            return Promise.resolve(handles.map(function (handle) { return _this._refCache.get(handle); }));
        }
    };
    NodeDebugSession.prototype._rememberEntryLocation = function (path, line, column) {
        if (path) {
            this._entryPath = path;
            this._entryLine = line;
            this._entryColumn = this._adjustColumn(line, column);
            this._gotEntryEvent = true;
        }
    };
    /**
     * workaround for column being off in the first line (because of a wrapped anonymous function)
     */
    NodeDebugSession.prototype._adjustColumn = function (line, column) {
        if (line === 0) {
            column -= NodeDebugSession.FIRST_LINE_OFFSET;
            if (column < 0) {
                column = 0;
            }
        }
        return column;
    };
    /**
     * Returns script id for the given script name or -1 if not found.
     */
    NodeDebugSession.prototype._findModule = function (name) {
        var args = {
            types: 1 + 2 + 4,
            filter: name
        };
        return this._node.scripts(args).then(function (resp) {
            for (var _i = 0, _a = resp.body; _i < _a.length; _i++) {
                var result = _a[_i];
                if (result.name === name) {
                    return result.id;
                }
            }
            return -1; // not found
        }).catch(function (err) {
            return -1; // error
        });
    };
    //---- private static ---------------------------------------------------------------
    NodeDebugSession.isJavaScript = function (path) {
        var name = Path.basename(path).toLowerCase();
        if (endsWith(name, '.js')) {
            return true;
        }
        try {
            var buffer = new Buffer(30);
            var fd = FS.openSync(path, 'r');
            FS.readSync(fd, buffer, 0, buffer.length, 0);
            FS.closeSync(fd);
            var line = buffer.toString();
            if (NodeDebugSession.NODE_SHEBANG_MATCHER.test(line)) {
                return true;
            }
        }
        catch (e) {
        }
        return false;
    };
    NodeDebugSession.compareVariableNames = function (v1, v2) {
        var n1 = v1.name;
        var n2 = v2.name;
        if (n1 === NodeDebugSession.PROTO) {
            return 1;
        }
        if (n2 === NodeDebugSession.PROTO) {
            return -1;
        }
        // convert [n], [n..m] -> n
        n1 = NodeDebugSession.extractNumber(n1);
        n2 = NodeDebugSession.extractNumber(n2);
        var i1 = parseInt(n1);
        var i2 = parseInt(n2);
        var isNum1 = !isNaN(i1);
        var isNum2 = !isNaN(i2);
        if (isNum1 && !isNum2) {
            return 1; // numbers after names
        }
        if (!isNum1 && isNum2) {
            return -1; // names before numbers
        }
        if (isNum1 && isNum2) {
            return i1 - i2;
        }
        return n1.localeCompare(n2);
    };
    NodeDebugSession.extractNumber = function (s) {
        if (s[0] === '[' && s[s.length - 1] === ']') {
            s = s.substring(1, s.length - 1);
            var p = s.indexOf('..');
            if (p >= 0) {
                s = s.substring(0, p);
            }
        }
        return s;
    };
    NodeDebugSession.MAX_STRING_LENGTH = 10000; // max string size to return in 'evaluate' request
    NodeDebugSession.NODE_TERMINATION_POLL_INTERVAL = 3000;
    NodeDebugSession.ATTACH_TIMEOUT = 10000;
    NodeDebugSession.NODE = 'node';
    NodeDebugSession.DUMMY_THREAD_ID = 1;
    NodeDebugSession.DUMMY_THREAD_NAME = 'Node';
    NodeDebugSession.FIRST_LINE_OFFSET = 62;
    NodeDebugSession.PROTO = '__proto__';
    NodeDebugSession.DEBUG_INJECTION = 'debugInjection.js';
    NodeDebugSession.NODE_SHEBANG_MATCHER = new RegExp('#! */usr/bin/env +node');
    NodeDebugSession.LONG_STRING_MATCHER = /\.\.\. \(length: [0-9]+\)$/;
    /*
        // verify that the file on disk is really the same as the executed content
        private _sameFile(path: string, contents: string) : Promise<boolean> {
    
            return new Promise((completeDispatch, errorDispatch) => {
                FS.readFile(path, 'utf8', (err, fileContents) => {
                    if (err) {
                        errorDispatch(err);
                    } else {
                        // remove an optional shebang
                        fileContents = fileContents.replace(/^#!.*\n/, '');
    
                        // try to locate the file contents in the executed contents
                        const pos = contents.indexOf(fileContents);
                        completeDispatch(pos >= 0);
                    }
                });
            });
        }
    
        // verify that the file on disk is really the same as the executed content
        private _sameFile2(path: string, contents: string) : boolean {
    
            let fileContents = FS.readFileSync(path, 'utf8');
            // remove an optional shebang
            fileContents = fileContents.replace(/^#!.*\n/, '');
    
            // try to locate the file contents in the executed contents
            const pos = contents.indexOf(fileContents);
            return pos >= 0;
        }
    */
    //--- scopes request ------------------------------------------------------------------------------------------------------
    NodeDebugSession.SCOPE_NAMES = [
        localize(44, null),
        localize(45, null),
        localize(46, null),
        localize(47, null),
        localize(48, null),
        localize(49, null),
        localize(50, null)
    ];
    return NodeDebugSession;
}(vscode_debugadapter_1.DebugSession));
exports.NodeDebugSession = NodeDebugSession;
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
function random(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}
function extendObject(objectCopy, object) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            objectCopy[key] = object[key];
        }
    }
    return objectCopy;
}
vscode_debugadapter_1.DebugSession.run(NodeDebugSession);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGUvbm9kZURlYnVnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Z0dBR2dHOzs7Ozs7O0FBRWhHLG9DQUlPLHFCQUFxQixDQUFDLENBQUE7QUFHN0IsK0JBTU8sa0JBQWtCLENBQUMsQ0FBQTtBQUMxQiwyQkFBNEMsY0FBYyxDQUFDLENBQUE7QUFDM0QseUJBQXNDLFlBQVksQ0FBQyxDQUFBO0FBQ25ELElBQVksU0FBUyxXQUFNLGlCQUFpQixDQUFDLENBQUE7QUFDN0MsSUFBWSxFQUFFLFdBQU0sZUFBZSxDQUFDLENBQUE7QUFDcEMsSUFBWSxHQUFHLFdBQU0sS0FBSyxDQUFDLENBQUE7QUFDM0IsSUFBWSxJQUFJLFdBQU0sTUFBTSxDQUFDLENBQUE7QUFDN0IsSUFBWSxFQUFFLFdBQU0sSUFBSSxDQUFDLENBQUE7QUFDekIsSUFBWSxHQUFHLFdBQU0sWUFBWSxDQUFDLENBQUE7QUFFbEMsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFlBQUUsQ0FBQztBQU83RDtJQU1DLGtCQUFtQixJQUErQjtRQUNqRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQy9CLENBQUM7SUFFTSx5QkFBTSxHQUFiLFVBQWMsT0FBeUI7UUFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFTSwyQkFBUSxHQUFmLFVBQWdCLE9BQXlCLEVBQUUsSUFBWSxFQUFFLEtBQWE7UUFDckUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQWRhLHdCQUFlLEdBQUcsUUFBUSxDQUFDLENBQW1CLEVBQUUsSUFBNkIsQ0FBQyxDQUFDO0lBZTlGLGVBQUM7QUFBRCxDQWpCQSxBQWlCQyxJQUFBO0FBakJZLGdCQUFRLFdBaUJw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QUFDLENBQUM7QUFDL0QsQ0FBQztBQUVELGdCQUFnQixHQUFXLEVBQUUsSUFBWTtJQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDdkQsQ0FBQztBQUVELGlCQUFpQixJQUFTO0lBQ3pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssZ0JBQWdCLENBQUM7QUFDbEUsQ0FBQztBQUVELHNCQUEwQixVQUFhLEVBQUUsTUFBUztJQUVqRCxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNGLENBQUM7SUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ25CLENBQUM7QUFHRCxrQ0FBWSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDIiwiZmlsZSI6Im5vZGUvbm9kZURlYnVnLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqICBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuIFNlZSBMaWNlbnNlLnR4dCBpbiB0aGUgcHJvamVjdCByb290IGZvciBsaWNlbnNlIGluZm9ybWF0aW9uLlxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmltcG9ydCB7XG5cdERlYnVnU2Vzc2lvbiwgVGhyZWFkLCBTb3VyY2UsIFN0YWNrRnJhbWUsIFNjb3BlLCBWYXJpYWJsZSwgQnJlYWtwb2ludCxcblx0VGVybWluYXRlZEV2ZW50LCBJbml0aWFsaXplZEV2ZW50LCBTdG9wcGVkRXZlbnQsIE91dHB1dEV2ZW50LFxuXHRIYW5kbGVzLCBFcnJvckRlc3RpbmF0aW9uXG59IGZyb20gJ3ZzY29kZS1kZWJ1Z2FkYXB0ZXInO1xuaW1wb3J0IHtEZWJ1Z1Byb3RvY29sfSBmcm9tICd2c2NvZGUtZGVidWdwcm90b2NvbCc7XG5cbmltcG9ydCB7XG5cdE5vZGVWOFByb3RvY29sLCBOb2RlVjhFdmVudCwgTm9kZVY4UmVzcG9uc2UsXG5cdFY4U2V0QnJlYWtwb2ludEFyZ3MsIFY4U2V0RXhjZXB0aW9uQnJlYWtBcmdzLFxuXHRWOEJhY2t0cmFjZVJlc3BvbnNlLCBWOFNjb3BlUmVzcG9uc2UsIFY4RXZhbHVhdGVSZXNwb25zZSwgVjhGcmFtZVJlc3BvbnNlLFxuXHRWOEV2ZW50Qm9keSxcblx0VjhSZWYsIFY4SGFuZGxlLCBWOFByb3BlcnR5LCBWOE9iamVjdCwgVjhTaW1wbGUsIFY4RnVuY3Rpb24sIFY4RnJhbWUsIFY4U2NvcGUsIFY4U2NyaXB0XG59IGZyb20gJy4vbm9kZVY4UHJvdG9jb2wnO1xuaW1wb3J0IHtJU291cmNlTWFwcywgU291cmNlTWFwcywgQmlhc30gZnJvbSAnLi9zb3VyY2VNYXBzJztcbmltcG9ydCB7VGVybWluYWwsIFRlcm1pbmFsRXJyb3J9IGZyb20gJy4vdGVybWluYWwnO1xuaW1wb3J0ICogYXMgUGF0aFV0aWxzIGZyb20gJy4vcGF0aFV0aWxpdGllcyc7XG5pbXBvcnQgKiBhcyBDUCBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCAqIGFzIE5ldCBmcm9tICduZXQnO1xuaW1wb3J0ICogYXMgUGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIEZTIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIG5scyBmcm9tICd2c2NvZGUtbmxzJztcblxuY29uc3QgbG9jYWxpemUgPSBubHMuY29uZmlnKHByb2Nlc3MuZW52LlZTQ09ERV9OTFNfQ09ORklHKSgpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFZhcmlhYmxlQ29udGFpbmVyIHtcblx0RXhwYW5kKHNlc3Npb246IE5vZGVEZWJ1Z1Nlc3Npb24pOiBQcm9taXNlPFZhcmlhYmxlW10+O1xuXHRTZXRWYWx1ZShzZXNzaW9uOiBOb2RlRGVidWdTZXNzaW9uLCBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz47XG59XG5cbmV4cG9ydCBjbGFzcyBFeHBhbmRlciBpbXBsZW1lbnRzIFZhcmlhYmxlQ29udGFpbmVyIHtcblxuXHRwdWJsaWMgc3RhdGljIFNFVF9WQUxVRV9FUlJPUiA9IGxvY2FsaXplKCdzZXRWYXJpYWJsZS5lcnJvcicsIFwiU2V0dGluZyB2YWx1ZSBub3Qgc3VwcG9ydGVkXCIpO1xuXG5cdHByaXZhdGUgX2V4cGFuZGVyRnVuY3Rpb24gOiAoKSA9PiBQcm9taXNlPFZhcmlhYmxlW10+O1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcihmdW5jOiAoKSA9PiBQcm9taXNlPFZhcmlhYmxlW10+KSB7XG5cdFx0dGhpcy5fZXhwYW5kZXJGdW5jdGlvbiA9IGZ1bmM7XG5cdH1cblxuXHRwdWJsaWMgRXhwYW5kKHNlc3Npb246IE5vZGVEZWJ1Z1Nlc3Npb24pIDogUHJvbWlzZTxWYXJpYWJsZVtdPiB7XG5cdFx0cmV0dXJuIHRoaXMuX2V4cGFuZGVyRnVuY3Rpb24oKTtcblx0fVxuXG5cdHB1YmxpYyBTZXRWYWx1ZShzZXNzaW9uOiBOb2RlRGVidWdTZXNzaW9uLCBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEV4cGFuZGVyLlNFVF9WQUxVRV9FUlJPUikpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBBcnJheUNvbnRhaW5lciBpbXBsZW1lbnRzIFZhcmlhYmxlQ29udGFpbmVyIHtcblxuXHRwcml2YXRlIF9hcnJheTogVjhPYmplY3Q7XG5cdHByaXZhdGUgX2xlbmd0aDogbnVtYmVyO1xuXHRwcml2YXRlIF9jaHVua1NpemU6IG51bWJlcjtcblxuXHRwdWJsaWMgY29uc3RydWN0b3IoYXJyYXk6IFY4T2JqZWN0LCBsZW5ndGg6IG51bWJlciwgY2h1bmtTaXplOiBudW1iZXIpIHtcblx0XHR0aGlzLl9hcnJheSA9IGFycmF5O1xuXHRcdHRoaXMuX2xlbmd0aCA9IGxlbmd0aDtcblx0XHR0aGlzLl9jaHVua1NpemUgPSBjaHVua1NpemU7XG5cdH1cblxuXHRwdWJsaWMgRXhwYW5kKHNlc3Npb246IE5vZGVEZWJ1Z1Nlc3Npb24pIDogUHJvbWlzZTxWYXJpYWJsZVtdPiB7XG5cdFx0Ly8gZmlyc3QgYWRkIG5hbWVkIHByb3BlcnRpZXMgdGhlbiBhZGQgcmFuZ2VzXG5cdFx0cmV0dXJuIHNlc3Npb24uX2NyZWF0ZVByb3BlcnRpZXModGhpcy5fYXJyYXksICduYW1lZCcpLnRoZW4odmFyaWFibGVzID0+IHtcblx0XHRcdGZvciAobGV0IHN0YXJ0ID0gMDsgc3RhcnQgPCB0aGlzLl9sZW5ndGg7IHN0YXJ0ICs9IHRoaXMuX2NodW5rU2l6ZSkge1xuXHRcdFx0XHRjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHRoaXMuX2NodW5rU2l6ZSwgdGhpcy5fbGVuZ3RoKS0xO1xuXHRcdFx0XHRjb25zdCBjb3VudCA9IGVuZC1zdGFydCsxO1xuXHRcdFx0XHR2YXJpYWJsZXMucHVzaChuZXcgVmFyaWFibGUoYFske3N0YXJ0fS4uJHtlbmR9XWAsICcgJywgc2Vzc2lvbi5fdmFyaWFibGVIYW5kbGVzLmNyZWF0ZShuZXcgUmFuZ2VDb250YWluZXIodGhpcy5fYXJyYXksIHN0YXJ0LCBjb3VudCkpKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdmFyaWFibGVzO1xuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIFNldFZhbHVlKHNlc3Npb246IE5vZGVEZWJ1Z1Nlc3Npb24sIG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykgOiBQcm9taXNlPHN0cmluZz4ge1xuXHRcdHJldHVybiBzZXNzaW9uLl9zZXRQcm9wZXJ0eVZhbHVlKHRoaXMuX2FycmF5LmhhbmRsZSwgbmFtZSwgdmFsdWUpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBSYW5nZUNvbnRhaW5lciBpbXBsZW1lbnRzIFZhcmlhYmxlQ29udGFpbmVyIHtcblxuXHRwcml2YXRlIF9hcnJheTogVjhPYmplY3Q7XG5cdHByaXZhdGUgX3N0YXJ0OiBudW1iZXI7XG5cdHByaXZhdGUgX2NvdW50OiBudW1iZXI7XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKGFycmF5LCBzdGFydDogbnVtYmVyLCBjb3VudDogbnVtYmVyKSB7XG5cdFx0dGhpcy5fYXJyYXkgPSBhcnJheTtcblx0XHR0aGlzLl9zdGFydCA9IHN0YXJ0O1xuXHRcdHRoaXMuX2NvdW50ID0gY291bnQ7XG5cdH1cblxuXHRwdWJsaWMgRXhwYW5kKHNlc3Npb246IE5vZGVEZWJ1Z1Nlc3Npb24pIDogUHJvbWlzZTxWYXJpYWJsZVtdPiB7XG5cdFx0Ly8gZXhwZXJpbWVudGFsIHN1cHBvcnQgZm9yIGxvbmcgYXJyYXlzIG5vdCByZWx5aW5nIG9uIGNvZGUgaW5qZWN0aW9uXG5cdFx0Ly9yZXR1cm4gc2Vzc2lvbi5fY3JlYXRlTGFyZ2VBcnJheUVsZW1lbnRzKHRoaXMuX2FycmF5LCB0aGlzLl9zdGFydCwgdGhpcy5fY291bnQpO1xuXHRcdHJldHVybiBzZXNzaW9uLl9jcmVhdGVQcm9wZXJ0aWVzKHRoaXMuX2FycmF5LCAncmFuZ2UnLCB0aGlzLl9zdGFydCwgdGhpcy5fY291bnQpO1xuXHR9XG5cblx0cHVibGljIFNldFZhbHVlKHNlc3Npb246IE5vZGVEZWJ1Z1Nlc3Npb24sIG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykgOiBQcm9taXNlPHN0cmluZz4ge1xuXHRcdHJldHVybiBzZXNzaW9uLl9zZXRQcm9wZXJ0eVZhbHVlKHRoaXMuX2FycmF5LmhhbmRsZSwgbmFtZSwgdmFsdWUpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBQcm9wZXJ0eUNvbnRhaW5lciBpbXBsZW1lbnRzIFZhcmlhYmxlQ29udGFpbmVyIHtcblxuXHRwcml2YXRlIF9vYmplY3Q6IFY4T2JqZWN0O1xuXHRwcml2YXRlIF90aGlzOiBWOE9iamVjdDtcblxuXHRwdWJsaWMgY29uc3RydWN0b3Iob2JqOiBWOE9iamVjdCwgdGhzPzogVjhPYmplY3QpIHtcblx0XHR0aGlzLl9vYmplY3QgPSBvYmo7XG5cdFx0dGhpcy5fdGhpcyA9IHRocztcblx0fVxuXG5cdHB1YmxpYyBFeHBhbmQoc2Vzc2lvbjogTm9kZURlYnVnU2Vzc2lvbikgOiBQcm9taXNlPFZhcmlhYmxlW10+IHtcblx0XHRyZXR1cm4gc2Vzc2lvbi5fY3JlYXRlUHJvcGVydGllcyh0aGlzLl9vYmplY3QsICdhbGwnKS50aGVuKHZhcmlhYmxlcyA9PiB7XG5cdFx0XHRpZiAodGhpcy5fdGhpcykge1xuXHRcdFx0XHRyZXR1cm4gc2Vzc2lvbi5fY3JlYXRlVmFyaWFibGUoJ3RoaXMnLCB0aGlzLl90aGlzKS50aGVuKHZhcmlhYmxlID0+IHtcblx0XHRcdFx0XHR2YXJpYWJsZXMucHVzaCh2YXJpYWJsZSk7XG5cdFx0XHRcdFx0cmV0dXJuIHZhcmlhYmxlcztcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdmFyaWFibGVzO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIFNldFZhbHVlKHNlc3Npb246IE5vZGVEZWJ1Z1Nlc3Npb24sIG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykgOiBQcm9taXNlPHN0cmluZz4ge1xuXHRcdHJldHVybiBzZXNzaW9uLl9zZXRQcm9wZXJ0eVZhbHVlKHRoaXMuX29iamVjdC5oYW5kbGUsIG5hbWUsIHZhbHVlKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgU2NvcGVDb250YWluZXIgaW1wbGVtZW50cyBWYXJpYWJsZUNvbnRhaW5lciB7XG5cblx0cHJpdmF0ZSBfZnJhbWU6IG51bWJlcjtcblx0cHJpdmF0ZSBfc2NvcGU6IG51bWJlcjtcblx0cHJpdmF0ZSBfb2JqZWN0OiBWOE9iamVjdDtcblx0cHJpdmF0ZSBfdGhpczogVjhPYmplY3Q7XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHNjb3BlOiBWOFNjb3BlLCBvYmo6IFY4T2JqZWN0LCB0aHM/OiBWOE9iamVjdCkge1xuXHRcdHRoaXMuX2ZyYW1lID0gc2NvcGUuZnJhbWVJbmRleDtcblx0XHR0aGlzLl9zY29wZSA9IHNjb3BlLmluZGV4O1xuXHRcdHRoaXMuX29iamVjdCA9IG9iajtcblx0XHR0aGlzLl90aGlzID0gdGhzO1xuXHR9XG5cblx0cHVibGljIEV4cGFuZChzZXNzaW9uOiBOb2RlRGVidWdTZXNzaW9uKSA6IFByb21pc2U8VmFyaWFibGVbXT4ge1xuXHRcdHJldHVybiBzZXNzaW9uLl9jcmVhdGVQcm9wZXJ0aWVzKHRoaXMuX29iamVjdCwgJ2FsbCcpLnRoZW4odmFyaWFibGVzID0+IHtcblx0XHRcdGlmICh0aGlzLl90aGlzKSB7XG5cdFx0XHRcdHJldHVybiBzZXNzaW9uLl9jcmVhdGVWYXJpYWJsZSgndGhpcycsIHRoaXMuX3RoaXMpLnRoZW4odmFyaWFibGUgPT4ge1xuXHRcdFx0XHRcdHZhcmlhYmxlcy5wdXNoKHZhcmlhYmxlKTtcblx0XHRcdFx0XHRyZXR1cm4gdmFyaWFibGVzO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB2YXJpYWJsZXM7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgU2V0VmFsdWUoc2Vzc2lvbjogTm9kZURlYnVnU2Vzc2lvbiwgbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSA6IFByb21pc2U8c3RyaW5nPiB7XG5cdFx0cmV0dXJuIHNlc3Npb24uX3NldFZhcmlhYmxlVmFsdWUodGhpcy5fZnJhbWUsIHRoaXMuX3Njb3BlLCBuYW1lLCB2YWx1ZSk7XG5cdH1cbn1cblxuY2xhc3MgU2NyaXB0IHtcblx0Y29udGVudHM6IHN0cmluZztcblxuXHRjb25zdHJ1Y3RvcihzY3JpcHQ6IFY4U2NyaXB0KSB7XG5cdFx0dGhpcy5jb250ZW50cyA9IHNjcmlwdC5zb3VyY2U7XG5cdH1cbn1cblxuY2xhc3MgSW50ZXJuYWxTb3VyY2VCcmVha3BvaW50IHtcblxuXHRsaW5lOiBudW1iZXI7XG5cdG9yZ0xpbmU6IG51bWJlcjtcblx0Y29sdW1uOiBudW1iZXI7XG5cdG9yZ0NvbHVtbjogbnVtYmVyO1xuXHRjb25kaXRpb246IHN0cmluZztcblxuXHRjb25zdHJ1Y3RvcihsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyID0gMCwgY29uZGl0aW9uPzogc3RyaW5nKSB7XG5cdFx0dGhpcy5saW5lID0gdGhpcy5vcmdMaW5lID0gbGluZTtcblx0XHR0aGlzLmNvbHVtbiA9IHRoaXMub3JnQ29sdW1uID0gY29sdW1uO1xuXHRcdHRoaXMuY29uZGl0aW9uID0gY29uZGl0aW9uO1xuXHR9XG59XG5cbi8qKlxuICogQSBTb3VyY2VTb3VyY2UgcmVwcmVzZW50cyB0aGUgc291cmNlIGNvbnRlbnRzIG9mIGFuIGludGVybmFsIG1vZHVsZSBvciBvZiBhIHNvdXJjZSBtYXAgd2l0aCBpbmxpbmVkIGNvbnRlbnRzLlxuICovXG5jbGFzcyBTb3VyY2VTb3VyY2Uge1xuXHRzY3JpcHRJZDogbnVtYmVyO1x0Ly8gaWYgMCB0aGVuIHNvdXJjZSBjb250YWlucyB0aGUgZmlsZSBjb250ZW50cyBvZiBhIHNvdXJjZSBtYXAsIG90aGVyd2lzZSBhIHNjcmlwdElELlxuXHRzb3VyY2U6IHN0cmluZztcblxuXHRjb25zdHJ1Y3RvcihzaWQ6IG51bWJlciwgY29udGVudD86IHN0cmluZykge1xuXHRcdHRoaXMuc2NyaXB0SWQgPSBzaWQ7XG5cdFx0dGhpcy5zb3VyY2UgPSBjb250ZW50O1xuXHR9XG59XG5cbi8qKlxuICogQXJndW1lbnRzIHNoYXJlZCBiZXR3ZWVuIExhdW5jaCBhbmQgQXR0YWNoIHJlcXVlc3RzLlxuICovXG5pbnRlcmZhY2UgQ29tbW9uQXJndW1lbnRzIHtcblx0LyoqIGNvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIHRyYWNlIHNlbGVjdG9ycy4gU3VwcG9ydGVkOlxuXHQgKiAnYWxsJzogYWxsXG5cdCAqICdsYSc6IGxhdW5jaC9hdHRhY2hcblx0ICogJ2xzJzogbG9hZCBzY3JpcHRzXG5cdCAqICdicCc6IGJyZWFrcG9pbnRzXG5cdCAqICdzbSc6IHNvdXJjZSBtYXBzXG5cdCAqICd2YSc6IGRhdGEgc3RydWN0dXJlIGFjY2Vzc1xuXHQgKiAnc3MnOiBzbWFydCBzdGVwc1xuXHQgKiAncmMnOiByZWYgY2FjaGluZ1xuXHQgKiAqL1xuXHR0cmFjZT86IHN0cmluZztcblx0LyoqIFRoZSBkZWJ1ZyBwb3J0IHRvIGF0dGFjaCB0by4gKi9cblx0cG9ydDogbnVtYmVyO1xuXHQvKiogVGhlIFRDUC9JUCBhZGRyZXNzIG9mIHRoZSBwb3J0IChyZW1vdGUgYWRkcmVzc2VzIG9ubHkgc3VwcG9ydGVkIGZvciBub2RlID49IDUuMCkuICovXG5cdGFkZHJlc3M/OiBzdHJpbmc7XG5cdC8qKiBSZXRyeSBmb3IgdGhpcyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGNvbm5lY3QgdG8gdGhlIG5vZGUgcnVudGltZS4gKi9cblx0dGltZW91dD86IG51bWJlcjtcblx0LyoqIEF1dG9tYXRpY2FsbHkgc3RvcCB0YXJnZXQgYWZ0ZXIgbGF1bmNoLiBJZiBub3Qgc3BlY2lmaWVkLCB0YXJnZXQgZG9lcyBub3Qgc3RvcC4gKi9cblx0c3RvcE9uRW50cnk/OiBib29sZWFuO1xuXHQvKiogQ29uZmlndXJlIHNvdXJjZSBtYXBzLiBCeSBkZWZhdWx0IHNvdXJjZSBtYXBzIGFyZSBkaXNhYmxlZC4gKi9cblx0c291cmNlTWFwcz86IGJvb2xlYW47XG5cdC8qKiBXaGVyZSB0byBsb29rIGZvciB0aGUgZ2VuZXJhdGVkIGNvZGUuIE9ubHkgdXNlZCBpZiBzb3VyY2VNYXBzIGlzIHRydWUuICovXG5cdG91dERpcj86IHN0cmluZztcblx0LyoqIFRyeSB0byBhdXRvbWF0aWNhbGx5IHN0ZXAgb3ZlciB1bmludGVyZXN0aW5nIHNvdXJjZS4gKi9cblx0c21hcnRTdGVwPzogYm9vbGVhbjtcblx0LyoqIFN0ZXAgYmFjayBzdXBwb3J0ZWQuICovXG5cdHN0ZXBCYWNrPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUaGlzIGludGVyZmFjZSBzaG91bGQgYWx3YXlzIG1hdGNoIHRoZSBzY2hlbWEgZm91bmQgaW4gdGhlIG5vZGUtZGVidWcgZXh0ZW5zaW9uIG1hbmlmZXN0LlxuICovXG5pbnRlcmZhY2UgTGF1bmNoUmVxdWVzdEFyZ3VtZW50cyBleHRlbmRzIERlYnVnUHJvdG9jb2wuTGF1bmNoUmVxdWVzdEFyZ3VtZW50cywgQ29tbW9uQXJndW1lbnRzIHtcblx0LyoqIEFuIGFic29sdXRlIHBhdGggdG8gdGhlIHByb2dyYW0gdG8gZGVidWcuICovXG5cdHByb2dyYW06IHN0cmluZztcblx0LyoqIE9wdGlvbmFsIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGRlYnVnZ2VlLiAqL1xuXHRhcmdzPzogc3RyaW5nW107XG5cdC8qKiBMYXVuY2ggdGhlIGRlYnVnZ2VlIGluIHRoaXMgd29ya2luZyBkaXJlY3RvcnkgKHNwZWNpZmllZCBhcyBhbiBhYnNvbHV0ZSBwYXRoKS4gSWYgb21pdHRlZCB0aGUgZGVidWdnZWUgaXMgbGF1Y2hlZCBpbiBpdHMgb3duIGRpcmVjdG9yeS4gKi9cblx0Y3dkPzogc3RyaW5nO1xuXHQvKiogQWJzb2x1dGUgcGF0aCB0byB0aGUgcnVudGltZSBleGVjdXRhYmxlIHRvIGJlIHVzZWQuIERlZmF1bHQgaXMgdGhlIHJ1bnRpbWUgZXhlY3V0YWJsZSBvbiB0aGUgUEFUSC4gKi9cblx0cnVudGltZUV4ZWN1dGFibGU/OiBzdHJpbmc7XG5cdC8qKiBPcHRpb25hbCBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBydW50aW1lIGV4ZWN1dGFibGUuICovXG5cdHJ1bnRpbWVBcmdzPzogc3RyaW5nW107XG5cdC8qKiBPcHRpb25hbCBlbnZpcm9ubWVudCB2YXJpYWJsZXMgdG8gcGFzcyB0byB0aGUgZGVidWdnZWUuIFRoZSBzdHJpbmcgdmFsdWVkIHByb3BlcnRpZXMgb2YgdGhlICdlbnZpcm9ubWVudFZhcmlhYmxlcycgYXJlIHVzZWQgYXMga2V5L3ZhbHVlIHBhaXJzLiAqL1xuXHRlbnY/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZzsgfTtcblx0LyoqIElmIHRydWUgbGF1bmNoIHRoZSB0YXJnZXQgaW4gYW4gZXh0ZXJuYWwgY29uc29sZS4gKi9cblx0ZXh0ZXJuYWxDb25zb2xlPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUaGlzIGludGVyZmFjZSBzaG91bGQgYWx3YXlzIG1hdGNoIHRoZSBzY2hlbWEgZm91bmQgaW4gdGhlIG5vZGUtZGVidWcgZXh0ZW5zaW9uIG1hbmlmZXN0LlxuICovXG5pbnRlcmZhY2UgQXR0YWNoUmVxdWVzdEFyZ3VtZW50cyBleHRlbmRzIERlYnVnUHJvdG9jb2wuQXR0YWNoUmVxdWVzdEFyZ3VtZW50cywgQ29tbW9uQXJndW1lbnRzIHtcblx0LyoqIFJlcXVlc3QgZnJvbnRlbmQgdG8gcmVzdGFydCBzZXNzaW9uIG9uIHRlcm1pbmF0aW9uLiAqL1xuXHRyZXN0YXJ0PzogYm9vbGVhbjtcblx0LyoqIE5vZGUncyByb290IGRpcmVjdG9yeS4gKi9cblx0cmVtb3RlUm9vdD86IHN0cmluZztcblx0LyoqIFZTIENvZGUncyByb290IGRpcmVjdG9yeS4gKi9cblx0bG9jYWxSb290Pzogc3RyaW5nO1xuXHQvKiogU2VuZCBhIFVTUjEgc2lnbmFsIHRvIHRoaXMgcHJvY2Vzcy4gKi9cblx0cHJvY2Vzc0lkPzogc3RyaW5nO1xufVxuXG5cbmV4cG9ydCBjbGFzcyBOb2RlRGVidWdTZXNzaW9uIGV4dGVuZHMgRGVidWdTZXNzaW9uIHtcblxuXHRwcml2YXRlIHN0YXRpYyBNQVhfU1RSSU5HX0xFTkdUSCA9IDEwMDAwO1x0Ly8gbWF4IHN0cmluZyBzaXplIHRvIHJldHVybiBpbiAnZXZhbHVhdGUnIHJlcXVlc3RcblxuXHRwcml2YXRlIHN0YXRpYyBOT0RFX1RFUk1JTkFUSU9OX1BPTExfSU5URVJWQUwgPSAzMDAwO1xuXHRwcml2YXRlIHN0YXRpYyBBVFRBQ0hfVElNRU9VVCA9IDEwMDAwO1xuXG5cdHByaXZhdGUgc3RhdGljIE5PREUgPSAnbm9kZSc7XG5cdHByaXZhdGUgc3RhdGljIERVTU1ZX1RIUkVBRF9JRCA9IDE7XG5cdHByaXZhdGUgc3RhdGljIERVTU1ZX1RIUkVBRF9OQU1FID0gJ05vZGUnO1xuXHRwcml2YXRlIHN0YXRpYyBGSVJTVF9MSU5FX09GRlNFVCA9IDYyO1xuXHRwcml2YXRlIHN0YXRpYyBQUk9UTyA9ICdfX3Byb3RvX18nO1xuXHRwcml2YXRlIHN0YXRpYyBERUJVR19JTkpFQ1RJT04gPSAnZGVidWdJbmplY3Rpb24uanMnO1xuXG5cdHByaXZhdGUgc3RhdGljIE5PREVfU0hFQkFOR19NQVRDSEVSID0gbmV3IFJlZ0V4cCgnIyEgKi91c3IvYmluL2VudiArbm9kZScpO1xuXHRwcml2YXRlIHN0YXRpYyBMT05HX1NUUklOR19NQVRDSEVSID0gL1xcLlxcLlxcLiBcXChsZW5ndGg6IFswLTldK1xcKSQvO1xuXG5cdC8vIHRyYWNpbmdcblx0cHJpdmF0ZSBfdHJhY2U6IHN0cmluZ1tdO1xuXHRwcml2YXRlIF90cmFjZUFsbCA9IGZhbHNlO1xuXG5cdC8vIG9wdGlvbnNcblx0cHJpdmF0ZSBfdHJ5VG9JbmplY3RFeHRlbnNpb24gPSB0cnVlO1xuXHRwcml2YXRlIF9jaHVua1NpemUgPSAxMDA7XHRcdC8vIGNodW5rIHNpemUgZm9yIGxhcmdlIGRhdGEgc3RydWN0dXJlc1xuXHRwcml2YXRlIF9zbWFydFN0ZXAgPSBmYWxzZTtcdFx0Ly8gdHJ5IHRvIGF1dG9tYXRpY2FsbHkgc3RlcCBvdmVyIHVuaW50ZXJlc3Rpbmcgc291cmNlXG5cblx0Ly8gc2Vzc2lvbiBzdGF0ZVxuXHRwcml2YXRlIF9hZGFwdGVySUQ6IHN0cmluZztcblx0cHJpdmF0ZSBfbm9kZTogTm9kZVY4UHJvdG9jb2w7XG5cdHByaXZhdGUgX25vZGVQcm9jZXNzSWQ6IG51bWJlciA9IC0xOyBcdFx0Ly8gcGlkIG9mIHRoZSBub2RlIHJ1bnRpbWVcblx0cHJpdmF0ZSBfZnVuY3Rpb25CcmVha3BvaW50cyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XHQvLyBub2RlIGZ1bmN0aW9uIGJyZWFrcG9pbnQgaWRzXG5cdHByaXZhdGUgX3NjcmlwdHMgPSBuZXcgTWFwPG51bWJlciwgU2NyaXB0PigpO1xuXG5cdC8vIHNlc3Npb24gY29uZmlndXJhdGlvbnNcblx0cHJpdmF0ZSBfbm9EZWJ1ZyA9IGZhbHNlO1xuXHRwcml2YXRlIF9hdHRhY2hNb2RlID0gZmFsc2U7XG5cdHByaXZhdGUgX2xvY2FsUm9vdDogc3RyaW5nO1xuXHRwcml2YXRlIF9yZW1vdGVSb290OiBzdHJpbmc7XG5cdHByaXZhdGUgX3Jlc3RhcnRNb2RlID0gZmFsc2U7XG5cdHByaXZhdGUgX3NvdXJjZU1hcHM6IElTb3VyY2VNYXBzO1xuXHRwcml2YXRlIF9leHRlcm5hbENvbnNvbGU6IGJvb2xlYW47XG5cdHByaXZhdGUgX3N0b3BPbkVudHJ5OiBib29sZWFuO1xuXHRwcml2YXRlIF9zdGVwQmFjayA9IGZhbHNlO1xuXG5cdC8vIHN0YXRlIHZhbGlkIGJldHdlZW4gc3RvcCBldmVudHNcblx0cHVibGljIF92YXJpYWJsZUhhbmRsZXMgPSBuZXcgSGFuZGxlczxWYXJpYWJsZUNvbnRhaW5lcj4oKTtcblx0cHJpdmF0ZSBfZnJhbWVIYW5kbGVzID0gbmV3IEhhbmRsZXM8VjhGcmFtZT4oKTtcblx0cHJpdmF0ZSBfc291cmNlSGFuZGxlcyA9IG5ldyBIYW5kbGVzPFNvdXJjZVNvdXJjZT4oKTtcblx0cHJpdmF0ZSBfcmVmQ2FjaGUgPSBuZXcgTWFwPG51bWJlciwgVjhIYW5kbGU+KCk7XG5cblx0Ly8gaW50ZXJuYWwgc3RhdGVcblx0cHJpdmF0ZSBfaXNUZXJtaW5hdGVkOiBib29sZWFuO1xuXHRwcml2YXRlIF9pblNodXRkb3duOiBib29sZWFuO1xuXHRwcml2YXRlIF90ZXJtaW5hbFByb2Nlc3M6IENQLkNoaWxkUHJvY2VzcztcdFx0Ly8gdGhlIHRlcm1pbmFsIHByb2Nlc3Mgb3IgdW5kZWZpbmVkXG5cdHByaXZhdGUgX3BvbGxGb3JOb2RlUHJvY2VzcyA9IGZhbHNlO1xuXHRwcml2YXRlIF9leGNlcHRpb246IFY4T2JqZWN0O1xuXHRwcml2YXRlIF9sYXN0U3RvcHBlZEV2ZW50OiBEZWJ1Z1Byb3RvY29sLlN0b3BwZWRFdmVudDtcblx0cHJpdmF0ZSBfc3RvcHBlZFJlYXNvbjogc3RyaW5nO1xuXHRwcml2YXRlIF9ub2RlSW5qZWN0aW9uQXZhaWxhYmxlID0gZmFsc2U7XG5cdHByaXZhdGUgX25lZWRDb250aW51ZTogYm9vbGVhbjtcblx0cHJpdmF0ZSBfbmVlZEJyZWFrcG9pbnRFdmVudDogYm9vbGVhbjtcblx0cHJpdmF0ZSBfZ290RW50cnlFdmVudDogYm9vbGVhbjtcblx0cHJpdmF0ZSBfZW50cnlQYXRoOiBzdHJpbmc7XG5cdHByaXZhdGUgX2VudHJ5TGluZTogbnVtYmVyO1x0XHQvLyBlbnRyeSBsaW5lIGluICouanMgZmlsZSAobm90IGluIHRoZSBzb3VyY2UgZmlsZSlcblx0cHJpdmF0ZSBfZW50cnlDb2x1bW46IG51bWJlcjtcdC8vIGVudHJ5IGNvbHVtbiBpbiAqLmpzIGZpbGUgKG5vdCBpbiB0aGUgc291cmNlIGZpbGUpXG5cdHByaXZhdGUgX3NtYXJ0U3RlcENvdW50ID0gMDtcblxuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0Ly8gdGhpcyBkZWJ1Z2dlciB1c2VzIHplcm8tYmFzZWQgbGluZXMgYW5kIGNvbHVtbnMgd2hpY2ggaXMgdGhlIGRlZmF1bHRcblx0XHQvLyBzbyB0aGUgZm9sbG93aW5nIHR3byBjYWxscyBhcmUgbm90IHJlYWxseSBuZWNlc3NhcnkuXG5cdFx0dGhpcy5zZXREZWJ1Z2dlckxpbmVzU3RhcnRBdDEoZmFsc2UpO1xuXHRcdHRoaXMuc2V0RGVidWdnZXJDb2x1bW5zU3RhcnRBdDEoZmFsc2UpO1xuXG5cdFx0dGhpcy5fbm9kZSA9IG5ldyBOb2RlVjhQcm90b2NvbChyZXNwb25zZSA9PiB7XG5cdFx0XHQvLyBpZiByZXF1ZXN0IHN1Y2Nlc3NmdWwsIGNhY2hlIGFsbHMgcmVmc1xuXHRcdFx0aWYgKHJlc3BvbnNlLnN1Y2Nlc3MgJiYgcmVzcG9uc2UucmVmcykge1xuXHRcdFx0XHRjb25zdCBvbGRTaXplID0gdGhpcy5fcmVmQ2FjaGUuc2l6ZTtcblx0XHRcdFx0Zm9yIChsZXQgciBvZiByZXNwb25zZS5yZWZzKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FjaGUoci5oYW5kbGUsIHIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl9yZWZDYWNoZS5zaXplICE9PSBvbGRTaXplKSB7XG5cdFx0XHRcdFx0dGhpcy5sb2coJ3JjJywgYE5vZGVWOFByb3RvY29sIGhvb2s6IHJlZiBjYWNoZSBzaXplOiAke3RoaXMuX3JlZkNhY2hlLnNpemV9YCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuX25vZGUub24oJ2JyZWFrJywgKGV2ZW50OiBOb2RlVjhFdmVudCkgPT4ge1xuXHRcdFx0dGhpcy5fc3RvcHBlZCgnYnJlYWsnKTtcblx0XHRcdHRoaXMuX2hhbmRsZU5vZGVCcmVha0V2ZW50KGV2ZW50LmJvZHkpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5fbm9kZS5vbignZXhjZXB0aW9uJywgKGV2ZW50OiBOb2RlVjhFdmVudCkgPT4ge1xuXHRcdFx0dGhpcy5fc3RvcHBlZCgnZXhjZXB0aW9uJyk7XG5cdFx0XHR0aGlzLl9oYW5kbGVOb2RlQnJlYWtFdmVudChldmVudC5ib2R5KTtcblx0XHR9KTtcblxuXHRcdC8qXG5cdFx0dGhpcy5fbm9kZS5vbignYmVmb3JlQ29tcGlsZScsIChldmVudDogTm9kZVY4RXZlbnQpID0+IHtcblx0XHRcdHRoaXMub3V0TGluZShgYmVmb3JlQ29tcGlsZSAke2V2ZW50LmJvZHkubmFtZX1gKTtcblx0XHR9KTtcblx0XHQqL1xuXG5cdFx0dGhpcy5fbm9kZS5vbignYWZ0ZXJDb21waWxlJywgKGV2ZW50OiBOb2RlVjhFdmVudCkgPT4ge1xuXHRcdFx0dGhpcy5faGFuZGxlTm9kZUFmdGVyQ29tcGlsZUV2ZW50KGV2ZW50LmJvZHkpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5fbm9kZS5vbignY2xvc2UnLCAoZXZlbnQ6IE5vZGVWOEV2ZW50KSA9PiB7XG5cdFx0XHR0aGlzLl90ZXJtaW5hdGVkKCdub2RlIHY4cHJvdG9jb2wgY2xvc2UnKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuX25vZGUub24oJ2Vycm9yJywgKGV2ZW50OiBOb2RlVjhFdmVudCkgPT4ge1xuXHRcdFx0dGhpcy5fdGVybWluYXRlZCgnbm9kZSB2OHByb3RvY29sIGVycm9yJyk7XG5cdFx0fSk7XG5cblx0XHQvKlxuXHRcdHRoaXMuX25vZGUub24oJ2RpYWdub3N0aWMnLCAoZXZlbnQ6IE5vZGVWOEV2ZW50KSA9PiB7XG5cdFx0XHR0aGlzLm91dExpbmUoYGRpYWdub3N0aWMgZXZlbnQgJHtldmVudC5ib2R5LnJlYXNvbn1gKTtcblx0XHR9KTtcblx0XHQqL1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4cGVyaW1lbnRhbCBzdXBwb3J0IGZvciBTeXN0ZW1KUyBtb2R1bGUgbG9hZGVyIChodHRwczovL2dpdGh1Yi5jb20vc3lzdGVtanMvc3lzdGVtanMpXG5cdCAqXG5cdCAqIFRyaWVzIHRvIGZpZ3VyZSBvdXQgd2hldGhlciBKYXZhU2NyaXB0IGNvZGUgaGFzIGJlZW4gZHluYW1pY2FsbHkgZ2VuZXJhdGVkXG5cdCAqIGFuZCB3aGV0aGVyIGl0IGNvbnRhaW5zIGEgc291cmNlIG1hcCByZWZlcmVuY2UuXG5cdCAqIElmIHRoaXMgaXMgdGhlIGNhc2UgdHJ5IHRvIHJlbG9hZCBicmVha3BvaW50cy5cblx0ICovXG5cdHByaXZhdGUgX2hhbmRsZU5vZGVBZnRlckNvbXBpbGVFdmVudChldmVudEJvZHk6IFY4RXZlbnRCb2R5KSB7XG5cblx0XHRpZiAodGhpcy5fc291cmNlTWFwcykge1x0XHQvLyB0aGlzIG9ubHkgYXBwbGllcyBpZiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZFxuXG5cdFx0XHRsZXQgcGF0aCA9IGV2ZW50Qm9keS5zY3JpcHQubmFtZTtcblx0XHRcdGlmIChwYXRoICYmIFBhdGguZXh0bmFtZShwYXRoKSA9PT0gJy5qcyF0cmFuc3BpbGVkJyAmJiBwYXRoLmluZGV4T2YoJ2ZpbGU6Ly8nKSA9PT0gMCkge1xuXG5cdFx0XHRcdHBhdGggPSBwYXRoLnN1YnN0cmluZygnZmlsZTovLycubGVuZ3RoKTtcblxuXHRcdFx0XHRpZiAoIUZTLmV4aXN0c1N5bmMocGF0aCkpIHtcdC8vIHBhdGggZG9lcyBub3QgZXhpc3QgbG9jYWxseS5cblxuXHRcdFx0XHRcdGNvbnN0IHNjcmlwdF9pZCA9IGV2ZW50Qm9keS5zY3JpcHQuaWQ7XG5cblx0XHRcdFx0XHR0aGlzLl9sb2FkU2NyaXB0KHNjcmlwdF9pZCkudGhlbihzY3JpcHQgPT4ge1xuXG5cdFx0XHRcdFx0XHRjb25zdCBzb3VyY2VzID0gdGhpcy5fc291cmNlTWFwcy5NYXBQYXRoVG9Tb3VyY2UocGF0aCwgc2NyaXB0LmNvbnRlbnRzKTtcblx0XHRcdFx0XHRcdGlmIChzb3VyY2VzICYmIHNvdXJjZXMubGVuZ3RoID49IDApIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5vdXRMaW5lKGBhZnRlckNvbXBpbGU6ICR7cGF0aH0gbWFwcyB0byAke3NvdXJjZXNbMF19YCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gdHJpZ2dlciByZXNlbmRpbmcgYnJlYWtwb2ludHNcblx0XHRcdFx0XHRcdFx0dGhpcy5zZW5kRXZlbnQobmV3IEluaXRpYWxpemVkRXZlbnQoKSk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9KS5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gaWdub3JlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQW5hbHlzZSB3aHkgbm9kZSBoYXMgc3RvcHBlZCBhbmQgc2VuZHMgU3RvcHBlZEV2ZW50IGlmIG5lY2Vzc2FyeS5cblx0ICovXG5cdHByaXZhdGUgX2hhbmRsZU5vZGVCcmVha0V2ZW50KGV2ZW50Qm9keTogVjhFdmVudEJvZHkpIDogdm9pZCB7XG5cblx0XHQvKlxuXHRcdC8vIHdvcmthcm91bmQ6IGxvYWQgc291cmNlbWFwIGZvciB0aGlzIGxvY2F0aW9uIHRvIHBvcHVsYXRlIGNhY2hlXG5cdFx0aWYgKHRoaXMuX3NvdXJjZU1hcHMpIHtcblx0XHRcdGxldCBwYXRoID0gYm9keS5zY3JpcHQubmFtZTtcblx0XHRcdGlmIChwYXRoICYmIFBhdGhVdGlscy5pc0Fic29sdXRlUGF0aChwYXRoKSkge1xuXHRcdFx0XHRwYXRoID0gdGhpcy5fcmVtb3RlVG9Mb2NhbChwYXRoKTtcblx0XHRcdFx0dGhpcy5fc291cmNlTWFwcy5NYXBUb1NvdXJjZShwYXRoLCBudWxsLCAwLCAwKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ki9cblxuXHRcdGxldCBpc0VudHJ5ID0gZmFsc2U7XG5cdFx0bGV0IHJlYXNvbjogc3RyaW5nO1xuXHRcdGxldCBleGNlcHRpb25fdGV4dDogc3RyaW5nO1xuXG5cdFx0Ly8gaXMgZXhjZXB0aW9uP1xuXHRcdGlmIChldmVudEJvZHkuZXhjZXB0aW9uKSB7XG5cdFx0XHR0aGlzLl9leGNlcHRpb24gPSBldmVudEJvZHkuZXhjZXB0aW9uO1xuXHRcdFx0ZXhjZXB0aW9uX3RleHQgPSBldmVudEJvZHkuZXhjZXB0aW9uLnRleHQ7XG5cdFx0XHRyZWFzb24gPSBsb2NhbGl6ZSh7IGtleTogJ3JlYXNvbi5leGNlcHRpb24nLCBjb21tZW50OiBbJ2h0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvdnNjb2RlL2lzc3Vlcy80NTY4J10gfSwgXCJleGNlcHRpb25cIik7XG5cdFx0fVxuXG5cdFx0Ly8gaXMgYnJlYWtwb2ludD9cblx0XHRpZiAoIXJlYXNvbikge1xuXHRcdFx0Y29uc3QgYnJlYWtwb2ludHMgPSBldmVudEJvZHkuYnJlYWtwb2ludHM7XG5cdFx0XHRpZiAoaXNBcnJheShicmVha3BvaW50cykgJiYgYnJlYWtwb2ludHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRjb25zdCBpZCA9IGJyZWFrcG9pbnRzWzBdO1xuXHRcdFx0XHRpZiAoIXRoaXMuX2dvdEVudHJ5RXZlbnQgJiYgaWQgPT09IDEpIHtcdC8vICdzdG9wIG9uIGVudHJ5IHBvaW50JyBpcyBpbXBsZW1lbnRlZCBhcyBhIGJyZWFrcG9pbnQgd2l0aCBpZCAxXG5cdFx0XHRcdFx0aXNFbnRyeSA9IHRydWU7XG5cdFx0XHRcdFx0dGhpcy5sb2coJ2xhJywgJ19hbmFseXplQnJlYWs6IHN1cHByZXNzZWQgc3RvcC1vbi1lbnRyeSBldmVudCcpO1xuXHRcdFx0XHRcdHJlYXNvbiA9IGxvY2FsaXplKHsga2V5OiAncmVhc29uLmVudHJ5JywgY29tbWVudDogWydodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L3ZzY29kZS9pc3N1ZXMvNDU2OCddIH0sIFwiZW50cnlcIik7XG5cdFx0XHRcdFx0dGhpcy5fcmVtZW1iZXJFbnRyeUxvY2F0aW9uKGV2ZW50Qm9keS5zY3JpcHQubmFtZSwgZXZlbnRCb2R5LnNvdXJjZUxpbmUsIGV2ZW50Qm9keS5zb3VyY2VDb2x1bW4pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJlYXNvbiA9IGxvY2FsaXplKHsga2V5OiAncmVhc29uLmJyZWFrcG9pbnQnLCBjb21tZW50OiBbJ2h0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvdnNjb2RlL2lzc3Vlcy80NTY4J10gfSwgXCJicmVha3BvaW50XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gaXMgZGVidWdnZXIgc3RhdGVtZW50P1xuXHRcdGlmICghcmVhc29uKSB7XG5cdFx0XHRjb25zdCBzb3VyY2VMaW5lID0gZXZlbnRCb2R5LnNvdXJjZUxpbmVUZXh0O1xuXHRcdFx0aWYgKHNvdXJjZUxpbmUgJiYgc291cmNlTGluZS5pbmRleE9mKCdkZWJ1Z2dlcicpID49IDApIHtcblx0XHRcdFx0cmVhc29uID0gbG9jYWxpemUoeyBrZXk6ICdyZWFzb24uZGVidWdnZXJfc3RhdGVtZW50JywgY29tbWVudDogWydodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L3ZzY29kZS9pc3N1ZXMvNDU2OCddIH0sIFwiZGVidWdnZXIgc3RhdGVtZW50XCIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIG5vIHJlYXNvbiB5ZXQ6IG11c3QgYmUgdGhlIHJlc3VsdCBvZiBhICdzdGVwJ1xuXHRcdGlmICghcmVhc29uKSB7XG5cblx0XHRcdC8vIHNob3VsZCB3ZSBjb250aW51ZSB1bnRpbCB3ZSBmaW5kIGEgYmV0dGVyIHBsYWNlIHRvIHN0b3A/XG5cdFx0XHRpZiAodGhpcy5fc21hcnRTdGVwICYmIHRoaXMuX3NraXBHZW5lcmF0ZWQoZXZlbnRCb2R5KSkge1xuXHRcdFx0XHR0aGlzLl9ub2RlLmNvbW1hbmQoJ2NvbnRpbnVlJywgeyBzdGVwYWN0aW9uOiAnaW4nIH0pO1xuXHRcdFx0XHR0aGlzLl9zbWFydFN0ZXBDb3VudCsrO1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0cmVhc29uID0gbG9jYWxpemUoeyBrZXk6ICdyZWFzb24uc3RlcCcsIGNvbW1lbnQ6IFsnaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC92c2NvZGUvaXNzdWVzLzQ1NjgnXSB9LCBcInN0ZXBcIik7XG5cdFx0fVxuXG5cdFx0dGhpcy5fbGFzdFN0b3BwZWRFdmVudCA9IG5ldyBTdG9wcGVkRXZlbnQocmVhc29uLCBOb2RlRGVidWdTZXNzaW9uLkRVTU1ZX1RIUkVBRF9JRCwgZXhjZXB0aW9uX3RleHQpO1xuXG5cdFx0aWYgKCFpc0VudHJ5KSB7XG5cdFx0XHRpZiAodGhpcy5fc21hcnRTdGVwQ291bnQgPiAwKSB7XG5cdFx0XHRcdHRoaXMubG9nKCdzcycsIGBfaGFuZGxlTm9kZUJyZWFrRXZlbnQ6ICR7dGhpcy5fc21hcnRTdGVwQ291bnR9IHN0ZXBzIHNraXBwZWRgKTtcblx0XHRcdFx0dGhpcy5fc21hcnRTdGVwQ291bnQgPSAwO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5zZW5kRXZlbnQodGhpcy5fbGFzdFN0b3BwZWRFdmVudCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdHJ1ZSBpZiBhIHNvdXJjZSBsb2NhdGlvbiBzaG91bGQgYmUgc2tpcHBlZC5cblx0ICovXG5cdHByaXZhdGUgX3NraXBHZW5lcmF0ZWQoZXZlbnQ6IFY4RXZlbnRCb2R5KSA6IGJvb2xlYW4ge1xuXG5cdFx0aWYgKCF0aGlzLl9zb3VyY2VNYXBzKSB7XG5cdFx0XHQvLyBwcm9jZWVkIGFzIG5vcm1hbFxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGxldCBsaW5lID0gZXZlbnQuc291cmNlTGluZTtcblx0XHRsZXQgY29sdW1uID0gdGhpcy5fYWRqdXN0Q29sdW1uKGxpbmUsIGV2ZW50LnNvdXJjZUNvbHVtbik7XG5cblx0XHRsZXQgcmVtb3RlUGF0aCA9IGV2ZW50LnNjcmlwdC5uYW1lO1xuXG5cdFx0aWYgKHJlbW90ZVBhdGggJiYgUGF0aFV0aWxzLmlzQWJzb2x1dGVQYXRoKHJlbW90ZVBhdGgpKSB7XG5cblx0XHRcdC8vIGlmIGxhdW5jaC5qc29uIGRlZmluZXMgbG9jYWxSb290IGFuZCByZW1vdGVSb290IHRyeSB0byBjb252ZXJ0IHJlbW90ZSBwYXRoIGJhY2sgdG8gYSBsb2NhbCBwYXRoXG5cdFx0XHRsZXQgbG9jYWxQYXRoID0gdGhpcy5fcmVtb3RlVG9Mb2NhbChyZW1vdGVQYXRoKTtcblxuXHRcdFx0Ly8gdHJ5IHRvIG1hcFxuXHRcdFx0bGV0IG1hcHJlc3VsdCA9IHRoaXMuX3NvdXJjZU1hcHMuTWFwVG9Tb3VyY2UobG9jYWxQYXRoLCBudWxsLCBsaW5lLCBjb2x1bW4sIEJpYXMuTEVBU1RfVVBQRVJfQk9VTkQpO1xuXHRcdFx0aWYgKCFtYXByZXN1bHQpIHtcdC8vIHRyeSB1c2luZyB0aGUgb3RoZXIgYmlhcyBvcHRpb25cblx0XHRcdFx0bWFwcmVzdWx0ID0gdGhpcy5fc291cmNlTWFwcy5NYXBUb1NvdXJjZShsb2NhbFBhdGgsIG51bGwsIGxpbmUsIGNvbHVtbiwgQmlhcy5HUkVBVEVTVF9MT1dFUl9CT1VORCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAobWFwcmVzdWx0KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBza2lwIGV2ZXJ5dGhpbmdcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBjbGVhciBldmVyeXRoaW5nIHRoYXQgaXMgbm8gbG9uZ2VyIHZhbGlkIGFmdGVyIGEgbmV3IHN0b3BwZWQgZXZlbnQuXG5cdCAqL1xuXHRwcml2YXRlIF9zdG9wcGVkKHJlYXNvbjogc3RyaW5nKTogdm9pZCB7XG5cdFx0dGhpcy5fc3RvcHBlZFJlYXNvbiA9IHJlYXNvbjtcblx0XHR0aGlzLmxvZygnbGEnLCBgX3N0b3BwZWQ6IGdvdCAke3JlYXNvbn0gZXZlbnQgZnJvbSBub2RlYCk7XG5cdFx0dGhpcy5fZXhjZXB0aW9uID0gdW5kZWZpbmVkO1xuXHRcdHRoaXMuX3ZhcmlhYmxlSGFuZGxlcy5yZXNldCgpO1xuXHRcdHRoaXMuX2ZyYW1lSGFuZGxlcy5yZXNldCgpO1xuXHRcdHRoaXMuX3JlZkNhY2hlID0gbmV3IE1hcDxudW1iZXIsIFY4T2JqZWN0PigpO1xuXHRcdHRoaXMubG9nKCdyYycsIGBfc3RvcHBlZDogbmV3IHJlZiBjYWNoZWApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBkZWJ1ZyBzZXNzaW9uIGhhcyB0ZXJtaW5hdGVkLlxuXHQgKi9cblx0cHJpdmF0ZSBfdGVybWluYXRlZChyZWFzb246IHN0cmluZyk6IHZvaWQge1xuXHRcdHRoaXMubG9nKCdsYScsIGBfdGVybWluYXRlZDogJHtyZWFzb259YCk7XG5cblx0XHRpZiAodGhpcy5fdGVybWluYWxQcm9jZXNzKSB7XG5cdFx0XHQvLyBpZiB0aGUgZGVidWcgYWRhcHRlciBvd25zIGEgdGVybWluYWwsXG5cdFx0XHQvLyB3ZSBkZWxheSB0aGUgVGVybWluYXRlZEV2ZW50IHNvIHRoYXQgdGhlIHVzZXIgY2FuIHNlZSB0aGUgcmVzdWx0IG9mIHRoZSBwcm9jZXNzIGluIHRoZSB0ZXJtaW5hbC5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuX2lzVGVybWluYXRlZCkge1xuXHRcdFx0dGhpcy5faXNUZXJtaW5hdGVkID0gdHJ1ZTtcblx0XHRcdGlmICh0aGlzLl9yZXN0YXJ0TW9kZSAmJiAhdGhpcy5faW5TaHV0ZG93bikge1xuXHRcdFx0XHR0aGlzLnNlbmRFdmVudChuZXcgVGVybWluYXRlZEV2ZW50KHRydWUpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuc2VuZEV2ZW50KG5ldyBUZXJtaW5hdGVkRXZlbnQoKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8tLS0tIGluaXRpYWxpemUgcmVxdWVzdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0cHJvdGVjdGVkIGluaXRpYWxpemVSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLkluaXRpYWxpemVSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5Jbml0aWFsaXplUmVxdWVzdEFyZ3VtZW50cyk6IHZvaWQge1xuXG5cdFx0dGhpcy5sb2coJ2xhJywgYGluaXRpYWxpemVSZXF1ZXN0OiBhZGFwdGVySUQ6ICR7YXJncy5hZGFwdGVySUR9YCk7XG5cblx0XHR0aGlzLl9hZGFwdGVySUQgPSBhcmdzLmFkYXB0ZXJJRDtcblxuXHRcdC8vLS0tLSBTZW5kIGJhY2sgZmVhdHVyZSBhbmQgdGhlaXIgb3B0aW9uc1xuXG5cdFx0Ly8gVGhpcyBkZWJ1ZyBhZGFwdGVyIHN1cHBvcnRzIHRoZSBjb25maWd1cmF0aW9uRG9uZVJlcXVlc3QuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c0NvbmZpZ3VyYXRpb25Eb25lUmVxdWVzdCA9IHRydWU7XG5cblx0XHQvLyBUaGlzIGRlYnVnIGFkYXB0ZXIgc3VwcG9ydHMgZnVuY3Rpb24gYnJlYWtwb2ludHMuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c0Z1bmN0aW9uQnJlYWtwb2ludHMgPSB0cnVlO1xuXG5cdFx0Ly8gVGhpcyBkZWJ1ZyBhZGFwdGVyIHN1cHBvcnRzIGNvbmRpdGlvbmFsIGJyZWFrcG9pbnRzLlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNDb25kaXRpb25hbEJyZWFrcG9pbnRzID0gdHJ1ZTtcblxuXHRcdC8vIFRoaXMgZGVidWcgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IGEgc2lkZSBlZmZlY3QgZnJlZSBldmFsdWF0ZSByZXF1ZXN0IGZvciBkYXRhIGhvdmVycy5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzRXZhbHVhdGVGb3JIb3ZlcnMgPSBmYWxzZTtcblxuXHRcdC8vIFRoaXMgZGVidWcgYWRhcHRlciBzdXBwb3J0cyB0d28gZXhjZXB0aW9uIGJyZWFrcG9pbnQgZmlsdGVyc1xuXHRcdHJlc3BvbnNlLmJvZHkuZXhjZXB0aW9uQnJlYWtwb2ludEZpbHRlcnMgPSBbXG5cdFx0XHR7XG5cdFx0XHRcdGxhYmVsOiBsb2NhbGl6ZSgnZXhjZXB0aW9ucy5hbGwnLCBcIkFsbCBFeGNlcHRpb25zXCIpLFxuXHRcdFx0XHRmaWx0ZXI6ICdhbGwnLFxuXHRcdFx0XHRkZWZhdWx0OiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bGFiZWw6IGxvY2FsaXplKCdleGNlcHRpb25zLnVuY2F1Z2h0JywgXCJVbmNhdWdodCBFeGNlcHRpb25zXCIpLFxuXHRcdFx0XHRmaWx0ZXI6ICd1bmNhdWdodCcsXG5cdFx0XHRcdGRlZmF1bHQ6IHRydWVcblx0XHRcdH1cblx0XHRdO1xuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c1NldFZhcmlhYmxlID0gdHJ1ZTtcblxuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdC8vLS0tLSBsYXVuY2ggcmVxdWVzdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdHByb3RlY3RlZCBsYXVuY2hSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLkxhdW5jaFJlc3BvbnNlLCBhcmdzOiBMYXVuY2hSZXF1ZXN0QXJndW1lbnRzKTogdm9pZCB7XG5cblx0XHRpZiAodGhpcy5fcHJvY2Vzc0NvbW1vbkFyZ3MocmVzcG9uc2UsIGFyZ3MpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fbm9EZWJ1ZyA9ICh0eXBlb2YgYXJncy5ub0RlYnVnID09PSAnYm9vbGVhbicpICYmIGFyZ3Mubm9EZWJ1ZztcblxuXHRcdHRoaXMuX2V4dGVybmFsQ29uc29sZSA9ICh0eXBlb2YgYXJncy5leHRlcm5hbENvbnNvbGUgPT09ICdib29sZWFuJykgJiYgYXJncy5leHRlcm5hbENvbnNvbGU7XG5cblx0XHRjb25zdCBwb3J0ID0gYXJncy5wb3J0IHx8IHJhbmRvbSgzMDAwLCA1MDAwMCk7XG5cdFx0Y29uc3QgYWRkcmVzcyA9IGFyZ3MuYWRkcmVzcztcblx0XHRjb25zdCB0aW1lb3V0ID0gYXJncy50aW1lb3V0O1xuXG5cdFx0bGV0IHJ1bnRpbWVFeGVjdXRhYmxlID0gYXJncy5ydW50aW1lRXhlY3V0YWJsZTtcblx0XHRpZiAocnVudGltZUV4ZWN1dGFibGUpIHtcblx0XHRcdGlmICghUGF0aC5pc0Fic29sdXRlKHJ1bnRpbWVFeGVjdXRhYmxlKSkge1xuXHRcdFx0XHR0aGlzLnNlbmRSZWxhdGl2ZVBhdGhFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAncnVudGltZUV4ZWN1dGFibGUnLCBydW50aW1lRXhlY3V0YWJsZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmICghRlMuZXhpc3RzU3luYyhydW50aW1lRXhlY3V0YWJsZSkpIHtcblx0XHRcdFx0dGhpcy5zZW5kTm90RXhpc3RFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAncnVudGltZUV4ZWN1dGFibGUnLCBydW50aW1lRXhlY3V0YWJsZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCFUZXJtaW5hbC5pc09uUGF0aChOb2RlRGVidWdTZXNzaW9uLk5PREUpKSB7XG5cdFx0XHRcdHRoaXMuc2VuZEVycm9yUmVzcG9uc2UocmVzcG9uc2UsIDIwMDEsIGxvY2FsaXplKCdWU05EMjAwMScsIFwiQ2Fubm90IGZpbmQgcnVudGltZSAnezB9JyBvbiBQQVRILlwiLCAne19ydW50aW1lfScpLCB7IF9ydW50aW1lOiBOb2RlRGVidWdTZXNzaW9uLk5PREUgfSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHJ1bnRpbWVFeGVjdXRhYmxlID0gTm9kZURlYnVnU2Vzc2lvbi5OT0RFOyAgICAgLy8gdXNlIG5vZGUgZnJvbSBQQVRIXG5cdFx0fVxuXG5cdFx0Y29uc3QgcnVudGltZUFyZ3MgPSBhcmdzLnJ1bnRpbWVBcmdzIHx8IFtdO1xuXHRcdGNvbnN0IHByb2dyYW1BcmdzID0gYXJncy5hcmdzIHx8IFtdO1xuXG5cdFx0Ly8gc3BlY2lhbCBjb2RlIGZvciAnZXh0ZW5zaW9uSG9zdCcgZGVidWdnaW5nXG5cdFx0aWYgKHRoaXMuX2FkYXB0ZXJJRCA9PT0gJ2V4dGVuc2lvbkhvc3QnKSB7XG5cblx0XHRcdC8vIHdlIGFsd2F5cyBsYXVuY2ggaW4gJ2RlYnVnLWJyaycgbW9kZSwgYnV0IHdlIG9ubHkgc2hvdyB0aGUgYnJlYWsgZXZlbnQgaWYgJ3N0b3BPbkVudHJ5JyBhdHRyaWJ1dGUgaXMgdHJ1ZS5cblx0XHRcdGxldCBsYXVuY2hBcmdzID0gWyBydW50aW1lRXhlY3V0YWJsZSBdO1xuXHRcdFx0aWYgKCF0aGlzLl9ub0RlYnVnKSB7XG5cdFx0XHRcdGxhdW5jaEFyZ3MucHVzaChgLS1kZWJ1Z0Jya1BsdWdpbkhvc3Q9JHtwb3J0fWApO1xuXHRcdFx0fVxuXHRcdFx0bGF1bmNoQXJncyA9IGxhdW5jaEFyZ3MuY29uY2F0KHJ1bnRpbWVBcmdzLCBwcm9ncmFtQXJncyk7XG5cblx0XHRcdHRoaXMuX3NlbmRMYXVuY2hDb21tYW5kVG9Db25zb2xlKGxhdW5jaEFyZ3MpO1xuXG5cdFx0XHRjb25zdCBjbWQgPSBDUC5zcGF3bihydW50aW1lRXhlY3V0YWJsZSwgbGF1bmNoQXJncy5zbGljZSgxKSk7XG5cdFx0XHRjbWQub24oJ2Vycm9yJywgKGVycikgPT4ge1xuXHRcdFx0XHR0aGlzLl90ZXJtaW5hdGVkKGBmYWlsZWQgdG8gbGF1bmNoIGV4dGVuc2lvbkhvc3QgKCR7ZXJyfSlgKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fY2FwdHVyZU91dHB1dChjbWQpO1xuXG5cdFx0XHQvLyB3ZSBhcmUgZG9uZSFcblx0XHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgcHJvZ3JhbVBhdGggPSBhcmdzLnByb2dyYW07XG5cdFx0aWYgKHByb2dyYW1QYXRoKSB7XG5cdFx0XHRpZiAoIVBhdGguaXNBYnNvbHV0ZShwcm9ncmFtUGF0aCkpIHtcblx0XHRcdFx0dGhpcy5zZW5kUmVsYXRpdmVQYXRoRXJyb3JSZXNwb25zZShyZXNwb25zZSwgJ3Byb2dyYW0nLCBwcm9ncmFtUGF0aCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmICghRlMuZXhpc3RzU3luYyhwcm9ncmFtUGF0aCkpIHtcblx0XHRcdFx0dGhpcy5zZW5kTm90RXhpc3RFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAncHJvZ3JhbScsIHByb2dyYW1QYXRoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0cHJvZ3JhbVBhdGggPSBQYXRoLm5vcm1hbGl6ZShwcm9ncmFtUGF0aCk7XG5cdFx0XHRpZiAoUGF0aFV0aWxzLm5vcm1hbGl6ZURyaXZlTGV0dGVyKHByb2dyYW1QYXRoKSAhPT0gUGF0aFV0aWxzLnJlYWxQYXRoKHByb2dyYW1QYXRoKSkge1xuXHRcdFx0XHR0aGlzLm91dExpbmUobG9jYWxpemUoJ3Byb2dyYW0ucGF0aC5jYXNlLm1pc21hdGNoLndhcm5pbmcnLCBcIlByb2dyYW0gcGF0aCB1c2VzIGRpZmZlcmVudGx5IGNhc2VkIGNoYXJhY3RlciBhcyBmaWxlIG9uIGRpc2s7IHRoaXMgbWlnaHQgcmVzdWx0IGluIGJyZWFrcG9pbnRzIG5vdCBiZWluZyBoaXQuXCIpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5zZW5kQXR0cmlidXRlTWlzc2luZ0Vycm9yUmVzcG9uc2UocmVzcG9uc2UsICdwcm9ncmFtJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKE5vZGVEZWJ1Z1Nlc3Npb24uaXNKYXZhU2NyaXB0KHByb2dyYW1QYXRoKSkge1xuXHRcdFx0aWYgKHRoaXMuX3NvdXJjZU1hcHMpIHtcblx0XHRcdFx0Ly8gaWYgcHJvZ3JhbVBhdGggaXMgYSBKYXZhU2NyaXB0IGZpbGUgYW5kIHNvdXJjZU1hcHMgYXJlIGVuYWJsZWQsIHdlIGRvbid0IGtub3cgd2hldGhlclxuXHRcdFx0XHQvLyBwcm9ncmFtUGF0aCBpcyB0aGUgZ2VuZXJhdGVkIGZpbGUgb3Igd2hldGhlciBpdCBpcyB0aGUgc291cmNlIChhbmQgd2UgbmVlZCBzb3VyY2UgbWFwcGluZykuXG5cdFx0XHRcdC8vIFR5cGljYWxseSB0aGlzIGhhcHBlbnMgaWYgYSB0b29sIGxpa2UgJ2JhYmVsJyBvciAndWdsaWZ5JyBpcyB1c2VkIChiZWNhdXNlIHRoZXkgYm90aCB0cmFuc3BpbGUganMgdG8ganMpLlxuXHRcdFx0XHQvLyBXZSB1c2UgdGhlIHNvdXJjZSBtYXBzIHRvIGZpbmQgYSAnc291cmNlJyBmaWxlIGZvciB0aGUgZ2l2ZW4ganMgZmlsZS5cblx0XHRcdFx0Y29uc3QgZ2VuZXJhdGVkUGF0aCA9IHRoaXMuX3NvdXJjZU1hcHMuTWFwUGF0aEZyb21Tb3VyY2UocHJvZ3JhbVBhdGgpO1xuXHRcdFx0XHRpZiAoZ2VuZXJhdGVkUGF0aCAmJiBnZW5lcmF0ZWRQYXRoICE9PSBwcm9ncmFtUGF0aCkge1xuXHRcdFx0XHRcdC8vIHByb2dyYW1QYXRoIG11c3QgYmUgc291cmNlIGJlY2F1c2UgdGhlcmUgc2VlbXMgdG8gYmUgYSBnZW5lcmF0ZWQgZmlsZSBmb3IgaXRcblx0XHRcdFx0XHR0aGlzLmxvZygnc20nLCBgbGF1bmNoUmVxdWVzdDogcHJvZ3JhbSAnJHtwcm9ncmFtUGF0aH0nIHNlZW1zIHRvIGJlIHRoZSBzb3VyY2U7IGxhdW5jaCB0aGUgZ2VuZXJhdGVkIGZpbGUgJyR7Z2VuZXJhdGVkUGF0aH0nIGluc3RlYWRgKTtcblx0XHRcdFx0XHRwcm9ncmFtUGF0aCA9IGdlbmVyYXRlZFBhdGg7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5sb2coJ3NtJywgYGxhdW5jaFJlcXVlc3Q6IHByb2dyYW0gJyR7cHJvZ3JhbVBhdGh9JyBzZWVtcyB0byBiZSB0aGUgZ2VuZXJhdGVkIGZpbGVgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBub2RlIGNhbm5vdCBleGVjdXRlIHRoZSBwcm9ncmFtIGRpcmVjdGx5XG5cdFx0XHRpZiAoIXRoaXMuX3NvdXJjZU1hcHMpIHtcblx0XHRcdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZShyZXNwb25zZSwgMjAwMiwgbG9jYWxpemUoJ1ZTTkQyMDAyJywgXCJDYW5ub3QgbGF1bmNoIHByb2dyYW0gJ3swfSc7IGNvbmZpZ3VyaW5nIHNvdXJjZSBtYXBzIG1pZ2h0IGhlbHAuXCIsICd7cGF0aH0nKSwgeyBwYXRoOiBwcm9ncmFtUGF0aCB9KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgZ2VuZXJhdGVkUGF0aCA9IHRoaXMuX3NvdXJjZU1hcHMuTWFwUGF0aEZyb21Tb3VyY2UocHJvZ3JhbVBhdGgpO1xuXHRcdFx0aWYgKCFnZW5lcmF0ZWRQYXRoKSB7XHQvLyBjYW5ub3QgZmluZCBnZW5lcmF0ZWQgZmlsZVxuXHRcdFx0XHR0aGlzLnNlbmRFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAyMDAzLCBsb2NhbGl6ZSgnVlNORDIwMDMnLCBcIkNhbm5vdCBsYXVuY2ggcHJvZ3JhbSAnezB9Jzsgc2V0dGluZyB0aGUgJ3sxfScgYXR0cmlidXRlIG1pZ2h0IGhlbHAuXCIsICd7cGF0aH0nLCAnb3V0RGlyJyksIHsgcGF0aDogcHJvZ3JhbVBhdGggfSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHRoaXMubG9nKCdzbScsIGBsYXVuY2hSZXF1ZXN0OiBwcm9ncmFtICcke3Byb2dyYW1QYXRofScgc2VlbXMgdG8gYmUgdGhlIHNvdXJjZTsgbGF1bmNoIHRoZSBnZW5lcmF0ZWQgZmlsZSAnJHtnZW5lcmF0ZWRQYXRofScgaW5zdGVhZGApO1xuXHRcdFx0cHJvZ3JhbVBhdGggPSBnZW5lcmF0ZWRQYXRoO1xuXHRcdH1cblxuXHRcdGxldCBwcm9ncmFtOiBzdHJpbmc7XG5cdFx0bGV0IHdvcmtpbmdEaXJlY3RvcnkgPSBhcmdzLmN3ZDtcblx0XHRpZiAod29ya2luZ0RpcmVjdG9yeSkge1xuXHRcdFx0aWYgKCFQYXRoLmlzQWJzb2x1dGUod29ya2luZ0RpcmVjdG9yeSkpIHtcblx0XHRcdFx0dGhpcy5zZW5kUmVsYXRpdmVQYXRoRXJyb3JSZXNwb25zZShyZXNwb25zZSwgJ2N3ZCcsIHdvcmtpbmdEaXJlY3RvcnkpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAoIUZTLmV4aXN0c1N5bmMod29ya2luZ0RpcmVjdG9yeSkpIHtcblx0XHRcdFx0dGhpcy5zZW5kTm90RXhpc3RFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAnY3dkJywgd29ya2luZ0RpcmVjdG9yeSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdC8vIGlmIHdvcmtpbmcgZGlyIGlzIGdpdmVuIGFuZCBpZiB0aGUgZXhlY3V0YWJsZSBpcyB3aXRoaW4gdGhhdCBmb2xkZXIsIHdlIG1ha2UgdGhlIGV4ZWN1dGFibGUgcGF0aCByZWxhdGl2ZSB0byB0aGUgd29ya2luZyBkaXJcblx0XHRcdHByb2dyYW0gPSBQYXRoLnJlbGF0aXZlKHdvcmtpbmdEaXJlY3RvcnksIHByb2dyYW1QYXRoKTtcblx0XHR9XG5cdFx0ZWxzZSB7XHQvLyBzaG91bGQgbm90IGhhcHBlblxuXHRcdFx0Ly8gaWYgbm8gd29ya2luZyBkaXIgZ2l2ZW4sIHdlIHVzZSB0aGUgZGlyZWN0IGZvbGRlciBvZiB0aGUgZXhlY3V0YWJsZVxuXHRcdFx0d29ya2luZ0RpcmVjdG9yeSA9IFBhdGguZGlybmFtZShwcm9ncmFtUGF0aCk7XG5cdFx0XHRwcm9ncmFtID0gUGF0aC5iYXNlbmFtZShwcm9ncmFtUGF0aCk7XG5cdFx0fVxuXG5cdFx0Ly8gd2UgYWx3YXlzIGJyZWFrIG9uIGVudHJ5IChidXQgaWYgdXNlciBkaWQgbm90IHJlcXVlc3QgdGhpcywgd2Ugd2lsbCBub3Qgc3RvcCBpbiB0aGUgVUkpLlxuXHRcdGxldCBsYXVuY2hBcmdzID0gWyBydW50aW1lRXhlY3V0YWJsZSBdO1xuXHRcdGlmICghIHRoaXMuX25vRGVidWcpIHtcblx0XHRcdGxhdW5jaEFyZ3MucHVzaChgLS1kZWJ1Zy1icms9JHtwb3J0fWApO1xuXHRcdH1cblx0XHRsYXVuY2hBcmdzID0gbGF1bmNoQXJncy5jb25jYXQocnVudGltZUFyZ3MsIFsgcHJvZ3JhbSBdLCBwcm9ncmFtQXJncyk7XG5cblx0XHRpZiAodGhpcy5fZXh0ZXJuYWxDb25zb2xlKSB7XG5cblx0XHRcdFRlcm1pbmFsLmxhdW5jaEluVGVybWluYWwod29ya2luZ0RpcmVjdG9yeSwgbGF1bmNoQXJncywgYXJncy5lbnYpLnRoZW4odGVybSA9PiB7XG5cblx0XHRcdFx0aWYgKHRlcm0pIHtcblx0XHRcdFx0XHQvLyBpZiB3ZSBnb3QgYSB0ZXJtaW5hbCBwcm9jZXNzLCB3ZSB3aWxsIHRyYWNrIGl0XG5cdFx0XHRcdFx0dGhpcy5fdGVybWluYWxQcm9jZXNzID0gdGVybTtcblx0XHRcdFx0XHR0ZXJtLm9uKCdleGl0JywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5fdGVybWluYWxQcm9jZXNzID0gbnVsbDtcblx0XHRcdFx0XHRcdHRoaXMuX3Rlcm1pbmF0ZWQoJ3Rlcm1pbmFsIGV4aXRlZCcpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gc2luY2Ugbm9kZSBzdGFydHMgaW4gYSB0ZXJtaW5hbCwgd2UgY2Fubm90IHRyYWNrIGl0IHdpdGggYW4gJ2V4aXQnIGhhbmRsZXJcblx0XHRcdFx0Ly8gcGxhbiBmb3IgcG9sbGluZyBhZnRlciB3ZSBoYXZlIGdvdHRlbiB0aGUgcHJvY2VzcyBwaWQuXG5cdFx0XHRcdHRoaXMuX3BvbGxGb3JOb2RlUHJvY2VzcyA9IHRydWU7XG5cblx0XHRcdFx0aWYgKHRoaXMuX25vRGVidWcpIHtcblx0XHRcdFx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fYXR0YWNoKHJlc3BvbnNlLCBwb3J0LCBhZGRyZXNzLCB0aW1lb3V0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9KS5jYXRjaCgoZXJyb3I6IFRlcm1pbmFsRXJyb3IpID0+IHtcblx0XHRcdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZVdpdGhJbmZvTGluayhyZXNwb25zZSwgMjAxMSwgbG9jYWxpemUoJ1ZTTkQyMDExJywgXCJDYW5ub3QgbGF1bmNoIGRlYnVnIHRhcmdldCBpbiB0ZXJtaW5hbCAoezB9KS5cIiwgJ3tfZXJyb3J9JyksIHsgX2Vycm9yOiBlcnJvci5tZXNzYWdlIH0sIGVycm9yLmxpbmtJZCApO1xuXHRcdFx0XHR0aGlzLl90ZXJtaW5hdGVkKCd0ZXJtaW5hbCBlcnJvcjogJyArIGVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0fSk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR0aGlzLl9zZW5kTGF1bmNoQ29tbWFuZFRvQ29uc29sZShsYXVuY2hBcmdzKTtcblxuXHRcdFx0Ly8gbWVyZ2UgZW52aXJvbm1lbnQgdmFyaWFibGVzIGludG8gYSBjb3B5IG9mIHRoZSBwcm9jZXNzLmVudlxuXHRcdFx0Y29uc3QgZW52ID0gZXh0ZW5kT2JqZWN0KGV4dGVuZE9iamVjdCggeyB9LCBwcm9jZXNzLmVudiksIGFyZ3MuZW52KTtcblxuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHtcblx0XHRcdFx0Y3dkOiB3b3JraW5nRGlyZWN0b3J5LFxuXHRcdFx0XHRlbnY6IGVudlxuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3Qgbm9kZVByb2Nlc3MgPSBDUC5zcGF3bihydW50aW1lRXhlY3V0YWJsZSwgbGF1bmNoQXJncy5zbGljZSgxKSwgb3B0aW9ucyk7XG5cdFx0XHRub2RlUHJvY2Vzcy5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcblx0XHRcdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZShyZXNwb25zZSwgMjAxNywgbG9jYWxpemUoJ1ZTTkQyMDE3JywgXCJDYW5ub3QgbGF1bmNoIGRlYnVnIHRhcmdldCAoezB9KS5cIiwgJ3tfZXJyb3J9JyksIHsgX2Vycm9yOiBlcnJvci5tZXNzYWdlIH0sIEVycm9yRGVzdGluYXRpb24uVGVsZW1ldHJ5IHwgRXJyb3JEZXN0aW5hdGlvbi5Vc2VyICk7XG5cdFx0XHRcdHRoaXMuX3Rlcm1pbmF0ZWQoYGZhaWxlZCB0byBsYXVuY2ggdGFyZ2V0ICgke2Vycm9yfSlgKTtcblx0XHRcdH0pO1xuXHRcdFx0bm9kZVByb2Nlc3Mub24oJ2V4aXQnLCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuX3Rlcm1pbmF0ZWQoJ3RhcmdldCBleGl0ZWQnKTtcblx0XHRcdH0pO1xuXHRcdFx0bm9kZVByb2Nlc3Mub24oJ2Nsb3NlJywgKGNvZGUpID0+IHtcblx0XHRcdFx0dGhpcy5fdGVybWluYXRlZCgndGFyZ2V0IGNsb3NlZCcpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuX25vZGVQcm9jZXNzSWQgPSBub2RlUHJvY2Vzcy5waWQ7XG5cblx0XHRcdHRoaXMuX2NhcHR1cmVPdXRwdXQobm9kZVByb2Nlc3MpO1xuXG5cdFx0XHRpZiAodGhpcy5fbm9EZWJ1Zykge1xuXHRcdFx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9hdHRhY2gocmVzcG9uc2UsIHBvcnQsIGFkZHJlc3MsIHRpbWVvdXQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX3NlbmRMYXVuY2hDb21tYW5kVG9Db25zb2xlKGFyZ3M6IHN0cmluZ1tdKSB7XG5cdFx0Ly8gcHJpbnQgdGhlIGNvbW1hbmQgdG8gbGF1bmNoIHRoZSB0YXJnZXQgdG8gdGhlIGRlYnVnIGNvbnNvbGVcblx0XHRsZXQgY2xpID0gJyc7XG5cdFx0Zm9yIChsZXQgYSBvZiBhcmdzKSB7XG5cdFx0XHRpZiAoYS5pbmRleE9mKCcgJykgPj0gMCkge1xuXHRcdFx0XHRjbGkgKz0gJ1xcJycgKyBhICsgJ1xcJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGkgKz0gYTtcblx0XHRcdH1cblx0XHRcdGNsaSArPSAnICc7XG5cdFx0fVxuXHRcdHRoaXMub3V0TGluZShjbGkpO1xuXHR9XG5cblx0cHJpdmF0ZSBfY2FwdHVyZU91dHB1dChwcm9jZXNzOiBDUC5DaGlsZFByb2Nlc3MpIHtcblx0XHRwcm9jZXNzLnN0ZG91dC5vbignZGF0YScsIChkYXRhOiBzdHJpbmcpID0+IHtcblx0XHRcdHRoaXMuc2VuZEV2ZW50KG5ldyBPdXRwdXRFdmVudChkYXRhLnRvU3RyaW5nKCksICdzdGRvdXQnKSk7XG5cdFx0fSk7XG5cdFx0cHJvY2Vzcy5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YTogc3RyaW5nKSA9PiB7XG5cdFx0XHR0aGlzLnNlbmRFdmVudChuZXcgT3V0cHV0RXZlbnQoZGF0YS50b1N0cmluZygpLCAnc3RkZXJyJykpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIHJldHVybnMgdHJ1ZSBvbiBlcnJvci5cblx0ICovXG5cdHByaXZhdGUgX3Byb2Nlc3NDb21tb25BcmdzKHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlJlc3BvbnNlLCBhcmdzOiBDb21tb25Bcmd1bWVudHMpOiBib29sZWFuIHtcblxuXHRcdGlmICh0eXBlb2YgYXJncy50cmFjZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHRoaXMuX3RyYWNlID0gYXJncy50cmFjZS5zcGxpdCgnLCcpO1xuXHRcdFx0dGhpcy5fdHJhY2VBbGwgPSB0aGlzLl90cmFjZS5pbmRleE9mKCdhbGwnKSA+PSAwO1xuXHRcdH1cblxuXHRcdHRoaXMuX3N0ZXBCYWNrID0gKHR5cGVvZiBhcmdzLnN0ZXBCYWNrID09PSAnYm9vbGVhbicpICYmIGFyZ3Muc3RlcEJhY2s7XG5cblx0XHR0aGlzLl9zbWFydFN0ZXAgPSAodHlwZW9mIGFyZ3Muc21hcnRTdGVwID09PSAnYm9vbGVhbicpICYmIGFyZ3Muc21hcnRTdGVwO1xuXG5cdFx0dGhpcy5fc3RvcE9uRW50cnkgPSAodHlwZW9mIGFyZ3Muc3RvcE9uRW50cnkgPT09ICdib29sZWFuJykgJiYgYXJncy5zdG9wT25FbnRyeTtcblxuXHRcdGlmICghdGhpcy5fc291cmNlTWFwcykge1xuXHRcdFx0aWYgKHR5cGVvZiBhcmdzLnNvdXJjZU1hcHMgPT09ICdib29sZWFuJyAmJiBhcmdzLnNvdXJjZU1hcHMpIHtcblx0XHRcdFx0Y29uc3QgZ2VuZXJhdGVkQ29kZURpcmVjdG9yeSA9IGFyZ3Mub3V0RGlyO1xuXHRcdFx0XHRpZiAoZ2VuZXJhdGVkQ29kZURpcmVjdG9yeSkge1xuXHRcdFx0XHRcdGlmICghUGF0aC5pc0Fic29sdXRlKGdlbmVyYXRlZENvZGVEaXJlY3RvcnkpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNlbmRSZWxhdGl2ZVBhdGhFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAnb3V0RGlyJywgZ2VuZXJhdGVkQ29kZURpcmVjdG9yeSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCFGUy5leGlzdHNTeW5jKGdlbmVyYXRlZENvZGVEaXJlY3RvcnkpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNlbmROb3RFeGlzdEVycm9yUmVzcG9uc2UocmVzcG9uc2UsICdvdXREaXInLCBnZW5lcmF0ZWRDb2RlRGlyZWN0b3J5KTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9zb3VyY2VNYXBzID0gbmV3IFNvdXJjZU1hcHModGhpcywgZ2VuZXJhdGVkQ29kZURpcmVjdG9yeSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8tLS0tIGF0dGFjaCByZXF1ZXN0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0cHJvdGVjdGVkIGF0dGFjaFJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuQXR0YWNoUmVzcG9uc2UsIGFyZ3M6IEF0dGFjaFJlcXVlc3RBcmd1bWVudHMpOiB2b2lkIHtcblxuXHRcdGlmICh0aGlzLl9wcm9jZXNzQ29tbW9uQXJncyhyZXNwb25zZSwgYXJncykpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fYWRhcHRlcklEID09PSAnZXh0ZW5zaW9uSG9zdCcpIHtcblx0XHRcdC8vIGluIEVIIG1vZGUgJ2F0dGFjaCcgbWVhbnMgJ2xhdW5jaCcgbW9kZVxuXHRcdFx0dGhpcy5fYXR0YWNoTW9kZSA9IGZhbHNlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9hdHRhY2hNb2RlID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIGFyZ3MucmVzdGFydCA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLl9yZXN0YXJ0TW9kZSA9IGFyZ3MucmVzdGFydDtcblx0XHR9XG5cblx0XHRpZiAoYXJncy5sb2NhbFJvb3QpIHtcblx0XHRcdGNvbnN0IGxvY2FsUm9vdCA9IGFyZ3MubG9jYWxSb290O1xuXHRcdFx0aWYgKCFQYXRoLmlzQWJzb2x1dGUobG9jYWxSb290KSkge1xuXHRcdFx0XHR0aGlzLnNlbmRSZWxhdGl2ZVBhdGhFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAnbG9jYWxSb290JywgbG9jYWxSb290KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFGUy5leGlzdHNTeW5jKGxvY2FsUm9vdCkpIHtcblx0XHRcdFx0dGhpcy5zZW5kTm90RXhpc3RFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAnbG9jYWxSb290JywgbG9jYWxSb290KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fbG9jYWxSb290ID0gbG9jYWxSb290O1xuXHRcdH1cblx0XHR0aGlzLl9yZW1vdGVSb290ID0gYXJncy5yZW1vdGVSb290O1xuXG5cdFx0Ly8gaWYgYSBwcm9jZXNzSWQgaXMgc3BlY2lmaWVkLCB0cnkgdG8gYnJpbmcgdGhlIHByb2Nlc3MgaW50byBkZWJ1ZyBtb2RlLlxuXHRcdGlmICh0eXBlb2YgYXJncy5wcm9jZXNzSWQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRjb25zdCBwaWRfc3RyaW5nID0gYXJncy5wcm9jZXNzSWQudHJpbSgpO1xuXHRcdFx0aWYgKC9eKFswLTldKykkLy50ZXN0KHBpZF9zdHJpbmcpKSB7XG5cdFx0XHRcdGNvbnN0IHBpZCA9IE51bWJlcihwaWRfc3RyaW5nKTtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuXHRcdFx0XHRcdFx0Ly8gcmVndWxhciBub2RlIGhhcyBhbiB1bmRvY3VtZW50ZWQgQVBJIGZ1bmN0aW9uIGZvciBmb3JjaW5nIGFub3RoZXIgbm9kZSBwcm9jZXNzIGludG8gZGVidWcgbW9kZS5cblx0XHRcdFx0XHRcdC8vIFx0XHQoPGFueT5wcm9jZXNzKS5fZGVidWdQcm9jZXNzKHBpZCk7XG5cdFx0XHRcdFx0XHQvLyBCdXQgc2luY2Ugd2UgYXJlIHJ1bm5pbmcgb24gRWxlY3Ryb24ncyBub2RlLCBwcm9jZXNzLl9kZWJ1Z1Byb2Nlc3MgZG9lc24ndCB3b3JrIChmb3IgdW5rbm93biByZWFzb25zKS5cblx0XHRcdFx0XHRcdC8vIFNvIHdlIHVzZSBhIHJlZ3VsYXIgbm9kZSBpbnN0ZWFkOlxuXHRcdFx0XHRcdFx0Y29uc3QgY29tbWFuZCA9IGBub2RlIC1lIHByb2Nlc3MuX2RlYnVnUHJvY2Vzcygke3BpZH0pYDtcblx0XHRcdFx0XHRcdENQLmV4ZWNTeW5jKGNvbW1hbmQpO1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHByb2Nlc3Mua2lsbChwaWQsICdTSUdVU1IxJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZShyZXNwb25zZSwgMjAyMSwgbG9jYWxpemUoJ1ZTTkQyMDIxJywgXCJBdHRhY2ggdG8gcHJvY2VzczogY2Fubm90IGVuYWJsZSBkZWJ1ZyBtb2RlIGZvciBwcm9jZXNzICd7MH0nICh7MX0pLlwiLCBwaWQsIGUpKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuc2VuZEVycm9yUmVzcG9uc2UocmVzcG9uc2UsIDIwMDYsIGxvY2FsaXplKCdWU05EMjAwNicsIFwiQXR0YWNoIHRvIHByb2Nlc3M6ICd7MH0nIGRvZXNuJ3QgbG9vayBsaWtlIGEgcHJvY2VzcyBpZC5cIiwgcGlkX3N0cmluZykpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fYXR0YWNoKHJlc3BvbnNlLCBhcmdzLnBvcnQsIGFyZ3MuYWRkcmVzcywgYXJncy50aW1lb3V0KTtcblx0fVxuXG5cdC8qXG5cdCAqIHNoYXJlZCBjb2RlIHVzZWQgaW4gbGF1bmNoUmVxdWVzdCBhbmQgYXR0YWNoUmVxdWVzdFxuXHQgKi9cblx0cHJpdmF0ZSBfYXR0YWNoKHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlJlc3BvbnNlLCBwb3J0OiBudW1iZXIsIGFkZHJlc3M6IHN0cmluZywgdGltZW91dDogbnVtYmVyKTogdm9pZCB7XG5cblx0XHRpZiAoIXBvcnQpIHtcblx0XHRcdHBvcnQgPSA1ODU4O1xuXHRcdH1cblxuXHRcdGlmICghYWRkcmVzcyB8fCBhZGRyZXNzID09PSAnbG9jYWxob3N0Jykge1xuXHRcdFx0YWRkcmVzcyA9ICcxMjcuMC4wLjEnO1xuXHRcdH1cblxuXHRcdGlmICghdGltZW91dCkge1xuXHRcdFx0dGltZW91dCA9IE5vZGVEZWJ1Z1Nlc3Npb24uQVRUQUNIX1RJTUVPVVQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5sb2coJ2xhJywgYF9hdHRhY2g6IGFkZHJlc3M6ICR7YWRkcmVzc30gcG9ydDogJHtwb3J0fWApO1xuXG5cdFx0bGV0IGNvbm5lY3RlZCA9IGZhbHNlO1xuXHRcdGNvbnN0IHNvY2tldCA9IG5ldyBOZXQuU29ja2V0KCk7XG5cdFx0c29ja2V0LmNvbm5lY3QocG9ydCwgYWRkcmVzcyk7XG5cblx0XHRzb2NrZXQub24oJ2Nvbm5lY3QnLCBlcnIgPT4ge1xuXHRcdFx0dGhpcy5sb2coJ2xhJywgJ19hdHRhY2g6IGNvbm5lY3RlZCcpO1xuXHRcdFx0Y29ubmVjdGVkID0gdHJ1ZTtcblx0XHRcdHRoaXMuX25vZGUuc3RhcnREaXNwYXRjaChzb2NrZXQsIHNvY2tldCk7XG5cdFx0XHR0aGlzLl9pbml0aWFsaXplKHJlc3BvbnNlKTtcblx0XHR9KTtcblxuXHRcdGNvbnN0IGVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIHRpbWVvdXQ7XG5cdFx0c29ja2V0Lm9uKCdlcnJvcicsIGVyciA9PiB7XG5cdFx0XHRpZiAoY29ubmVjdGVkKSB7XG5cdFx0XHRcdC8vIHNpbmNlIHdlIGFyZSBjb25uZWN0ZWQgdGhpcyBlcnJvciBpcyBmYXRhbFxuXHRcdFx0XHR0aGlzLl90ZXJtaW5hdGVkKCdzb2NrZXQgZXJyb3InKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIHdlIGFyZSBub3QgeWV0IGNvbm5lY3RlZCBzbyByZXRyeSBhIGZldyB0aW1lc1xuXHRcdFx0XHRpZiAoZXJyLmNvZGUgPT09ICdFQ09OTlJFRlVTRUQnIHx8IGVyci5jb2RlID09PSAnRUNPTk5SRVNFVCcpIHtcblx0XHRcdFx0XHRjb25zdCBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRcdFx0XHRpZiAobm93IDwgZW5kVGltZSkge1xuXHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHRoaXMubG9nKCdsYScsICdfYXR0YWNoOiByZXRyeSBzb2NrZXQuY29ubmVjdCcpO1xuXHRcdFx0XHRcdFx0XHRzb2NrZXQuY29ubmVjdChwb3J0KTtcblx0XHRcdFx0XHRcdH0sIDIwMCk7XHRcdC8vIHJldHJ5IGFmdGVyIDIwMCBtc1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNlbmRFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAyMDA5LCBsb2NhbGl6ZSgnVlNORDIwMDknLCBcIkNhbm5vdCBjb25uZWN0IHRvIHJ1bnRpbWUgcHJvY2VzcyAodGltZW91dCBhZnRlciB7MH0gbXMpLlwiLCAne190aW1lb3V0fScpLCB7IF90aW1lb3V0OiB0aW1lb3V0IH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLnNlbmRFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAyMDEwLCBsb2NhbGl6ZSgnVlNORDIwMTAnLCBcIkNhbm5vdCBjb25uZWN0IHRvIHJ1bnRpbWUgcHJvY2VzcyAocmVhc29uOiB7MH0pLlwiLCAne19lcnJvcn0nKSwgeyBfZXJyb3I6IGVyci5tZXNzYWdlIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRzb2NrZXQub24oJ2VuZCcsIGVyciA9PiB7XG5cdFx0XHR0aGlzLl90ZXJtaW5hdGVkKCdzb2NrZXQgZW5kJyk7XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIF9pbml0aWFsaXplKHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlJlc3BvbnNlLCByZXRyeUNvdW50OiBudW1iZXIgPSAwKSA6IHZvaWQge1xuXG5cdFx0dGhpcy5fbm9kZS5jb21tYW5kKCdldmFsdWF0ZScsIHsgZXhwcmVzc2lvbjogJ3Byb2Nlc3MucGlkJywgZ2xvYmFsOiB0cnVlIH0sIChyZXNwOiBWOEV2YWx1YXRlUmVzcG9uc2UpID0+IHtcblxuXHRcdFx0bGV0IG9rID0gcmVzcC5zdWNjZXNzO1xuXHRcdFx0aWYgKHJlc3Auc3VjY2Vzcykge1xuXHRcdFx0XHR0aGlzLl9ub2RlUHJvY2Vzc0lkID0gK3Jlc3AuYm9keS52YWx1ZTtcblx0XHRcdFx0dGhpcy5sb2coJ2xhJywgYF9pbml0aWFsaXplOiBnb3QgcHJvY2VzcyBpZCAke3RoaXMuX25vZGVQcm9jZXNzSWR9IGZyb20gbm9kZWApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHJlc3AubWVzc2FnZS5pbmRleE9mKCdwcm9jZXNzIGlzIG5vdCBkZWZpbmVkJykgPj0gMCkge1xuXHRcdFx0XHRcdHRoaXMubG9nKCdsYScsICdfaW5pdGlhbGl6ZTogcHJvY2VzcyBub3QgZGVmaW5lZCBlcnJvcjsgZ290IG5vIHBpZCcpO1xuXHRcdFx0XHRcdG9rID0gdHJ1ZTsgLy8gY29udGludWUgYW5kIHRyeSB0byBnZXQgcHJvY2Vzcy5waWQgbGF0ZXJcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAob2spIHtcblxuXHRcdFx0XHRpZiAodGhpcy5fcG9sbEZvck5vZGVQcm9jZXNzKSB7XG5cdFx0XHRcdFx0dGhpcy5fcG9sbEZvck5vZGVUZXJtaW5hdGlvbigpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5faW5qZWN0RGVidWdnZXJFeHRlbnNpb25zKCkudGhlbihfID0+IHtcblxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLl9zdGVwQmFjaykge1xuXHRcdFx0XHRcdFx0XHQvLyBkb2VzIHJ1bnRpbWUgc3VwcG9ydCAnc3RlcCBiYWNrJz9cblx0XHRcdFx0XHRcdFx0Y29uc3QgdiA9IHRoaXMuX25vZGUuZW1iZWRkZWRIb3N0VmVyc2lvbjtcdC8vIHgueS56IHZlcnNpb24gcmVwcmVzZW50ZWQgYXMgKHgqMTAwK3kpKjEwMCt6XG5cdFx0XHRcdFx0XHRcdGlmICghdGhpcy5fbm9kZS52OFZlcnNpb24gJiYgdiA+PSA3MDAwMCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3N0ZXBCYWNrID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5fc3RlcEJhY2spIHtcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2UuYm9keSA9IHtcblx0XHRcdFx0XHRcdFx0XHRzdXBwb3J0c1N0ZXBCYWNrOiB0cnVlXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0SW5pdGlhbGl6ZSghcmVzcC5ydW5uaW5nKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSwgMTApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmxvZygnbGEnLCAnX2luaXRpYWxpemU6IHJldHJpZXZpbmcgcHJvY2VzcyBpZCBmcm9tIG5vZGUgZmFpbGVkJyk7XG5cblx0XHRcdFx0aWYgKHJldHJ5Q291bnQgPCAxMCkge1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gcmVjdXJzZVxuXHRcdFx0XHRcdFx0dGhpcy5faW5pdGlhbGl6ZShyZXNwb25zZSwgcmV0cnlDb3VudCsxKTtcblx0XHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX3NlbmROb2RlUmVzcG9uc2UocmVzcG9uc2UsIHJlc3ApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIF9wb2xsRm9yTm9kZVRlcm1pbmF0aW9uKCkgOiB2b2lkIHtcblx0XHRjb25zdCBpZCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmICh0aGlzLl9ub2RlUHJvY2Vzc0lkID4gMCkge1xuXHRcdFx0XHRcdCg8YW55PnByb2Nlc3MpLmtpbGwodGhpcy5fbm9kZVByb2Nlc3NJZCwgMCk7XHQvLyBub2RlLmQudHMgZG9lc24ndCBsaWtlIG51bWJlciBhcmd1bW5lbnRcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjbGVhckludGVydmFsKGlkKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoaWQpO1xuXHRcdFx0XHR0aGlzLl90ZXJtaW5hdGVkKCdub2RlIHByb2Nlc3Mga2lsbCBleGNlcHRpb24nKTtcblx0XHRcdH1cblx0XHR9LCBOb2RlRGVidWdTZXNzaW9uLk5PREVfVEVSTUlOQVRJT05fUE9MTF9JTlRFUlZBTCk7XG5cdH1cblxuXHQvKlxuXHQgKiBJbmplY3QgY29kZSBpbnRvIG5vZGUuanMgdG8gYWRkcmVzcyBzbG93bmVzcyBpc3N1ZXMgd2hlbiBpbnNwZWN0aW5nIGxhcmdlIGRhdGEgc3RydWN0dXJlcy5cblx0ICovXG5cdHByaXZhdGUgX2luamVjdERlYnVnZ2VyRXh0ZW5zaW9ucygpIDogUHJvbWlzZTxib29sZWFuPiB7XG5cblx0XHRpZiAodGhpcy5fdHJ5VG9JbmplY3RFeHRlbnNpb24pIHtcblxuXHRcdFx0Y29uc3QgdiA9IHRoaXMuX25vZGUuZW1iZWRkZWRIb3N0VmVyc2lvbjtcdC8vIHgueS56IHZlcnNpb24gcmVwcmVzZW50ZWQgYXMgKHgqMTAwK3kpKjEwMCt6XG5cblx0XHRcdGlmICh0aGlzLl9ub2RlLnY4VmVyc2lvbiAmJiAodiA+PSAxMjAwICYmIHYgPCAxMDAwMCkgfHwgKHYgPj0gNDAzMDEgJiYgdiA8IDUwMDAwKSB8fCAodiA+PSA1MDYwMCkpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRjb25zdCBjb250ZW50cyA9IEZTLnJlYWRGaWxlU3luYyhQYXRoLmpvaW4oX19kaXJuYW1lLCBOb2RlRGVidWdTZXNzaW9uLkRFQlVHX0lOSkVDVElPTiksICd1dGY4Jyk7XG5cblx0XHRcdFx0XHRjb25zdCBhcmdzID0ge1xuXHRcdFx0XHRcdFx0ZXhwcmVzc2lvbjogY29udGVudHMsXG5cdFx0XHRcdFx0XHRnbG9iYWw6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ZGlzYWJsZV9icmVhazogdHJ1ZVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHQvLyBmaXJzdCB0cnkgZXZhbHVhdGUgYWdhaW5zdCB0aGUgY3VycmVudCBzdGFjayBmcmFtZVxuXHRcdFx0XHRcdHJldHVybiB0aGlzLl9ub2RlLmV2YWx1YXRlKGFyZ3MpLnRoZW4ocmVzcCA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLmxvZygnbGEnLCBgX2luamVjdERlYnVnZ2VyRXh0ZW5zaW9uczogZnJhbWUgYmFzZWQgY29kZSBpbmplY3Rpb24gc3VjY2Vzc2Z1bGApO1xuXHRcdFx0XHRcdFx0dGhpcy5fbm9kZUluamVjdGlvbkF2YWlsYWJsZSA9IHRydWU7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9KS5jYXRjaChyZXNwID0+IHtcblxuXHRcdFx0XHRcdFx0dGhpcy5sb2coJ2xhJywgYF9pbmplY3REZWJ1Z2dlckV4dGVuc2lvbnM6IGZyYW1lIGJhc2VkIGNvZGUgaW5qZWN0aW9uIGZhaWxlZCB3aXRoIGVycm9yICcke3Jlc3AubWVzc2FnZX0nYCk7XG5cblx0XHRcdFx0XHRcdGFyZ3MuZ2xvYmFsID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0Ly8gZXZhbHVhdGUgZ2xvYmFsbHlcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLl9ub2RlLmV2YWx1YXRlKGFyZ3MpLnRoZW4ocmVzcCA9PiB7XG5cdFx0XHRcdFx0XHRcdHRoaXMubG9nKCdsYScsIGBfaW5qZWN0RGVidWdnZXJFeHRlbnNpb25zOiBnbG9iYWwgY29kZSBpbmplY3Rpb24gc3VjY2Vzc2Z1bGApO1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9ub2RlSW5qZWN0aW9uQXZhaWxhYmxlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9KS5jYXRjaChyZXNwID0+IHtcblx0XHRcdFx0XHRcdFx0dGhpcy5sb2coJ2xhJywgYF9pbmplY3REZWJ1Z2dlckV4dGVuc2lvbnM6IGdsb2JhbCBjb2RlIGluamVjdGlvbiBmYWlsZWQgd2l0aCBlcnJvciAnJHtyZXNwLm1lc3NhZ2V9J2ApO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0Ly8gZmFsbCB0aHJvdWdoXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcblx0fVxuXG5cdC8qXG5cdCAqIHN0YXJ0IHRoZSBpbml0aWFsaXphdGlvbiBzZXF1ZW5jZTpcblx0ICogMS4gd2FpdCBmb3IgJ2JyZWFrLW9uLWVudHJ5JyAod2l0aCB0aW1lb3V0KVxuXHQgKiAyLiBzZW5kICdpbml0aXRpYWxpemVkJyBldmVudCBpbiBvcmRlciB0byB0cmlnZ2VyIHNldEJyZWFrcG9pbnRFdmVudHMgcmVxdWVzdCBmcm9tIGNsaWVudFxuXHQgKiAzLiBwcmVwYXJlIGZvciBzZW5kaW5nICdicmVhay1vbi1lbnRyeScgb3IgJ2NvbnRpbnVlJyBsYXRlciBpbiBfZmluaXNoSW5pdGlhbGl6ZSgpXG5cdCAqL1xuXHRwcml2YXRlIF9zdGFydEluaXRpYWxpemUoc3RvcHBlZDogYm9vbGVhbiwgbjogbnVtYmVyID0gMCk6IHZvaWQge1xuXG5cdFx0aWYgKG4gPT09IDApIHtcblx0XHRcdHRoaXMubG9nKCdsYScsIGBfc3RhcnRJbml0aWFsaXplOiBzdG9wcGVkOiAke3N0b3BwZWR9YCk7XG5cdFx0fVxuXG5cdFx0Ly8gd2FpdCBhdCBtb3N0IDUwMG1zIGZvciByZWNlaXZpbmcgdGhlIGJyZWFrIG9uIGVudHJ5IGV2ZW50XG5cdFx0Ly8gKHNpbmNlIGluIGF0dGFjaCBtb2RlIHdlIGNhbm5vdCBlbmZvcmNlIHRoYXQgbm9kZSBpcyBzdGFydGVkIHdpdGggLS1kZWJ1Zy1icmssIHdlIGNhbm5vdCBhc3N1bWUgdGhhdCB3ZSByZWNlaXZlIHRoaXMgZXZlbnQpXG5cblx0XHRpZiAoIXRoaXMuX2dvdEVudHJ5RXZlbnQgJiYgbiA8IDEwKSB7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0Ly8gcmVjdXJzZVxuXHRcdFx0XHR0aGlzLl9zdGFydEluaXRpYWxpemUoc3RvcHBlZCwgbisxKTtcblx0XHRcdH0sIDUwKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fZ290RW50cnlFdmVudCkge1xuXHRcdFx0dGhpcy5sb2coJ2xhJywgYF9zdGFydEluaXRpYWxpemU6IGdvdCBicmVhayBvbiBlbnRyeSBldmVudCBhZnRlciAke259IHJldHJpZXNgKTtcblx0XHRcdGlmICh0aGlzLl9ub2RlUHJvY2Vzc0lkIDw9IDApIHtcblx0XHRcdFx0Ly8gaWYgd2UgaGF2ZW4ndCBnb3R0ZW4gYSBwcm9jZXNzIHBpZCBzbyBmYXIsIHdlIHRyeSBpdCBhZ2FpblxuXHRcdFx0XHR0aGlzLl9ub2RlLmNvbW1hbmQoJ2V2YWx1YXRlJywgeyBleHByZXNzaW9uOiAncHJvY2Vzcy5waWQnLCBnbG9iYWw6IHRydWUgfSwgKHJlc3A6IFY4RXZhbHVhdGVSZXNwb25zZSkgPT4ge1xuXHRcdFx0XHRcdGlmIChyZXNwLnN1Y2Nlc3MpIHtcblx0XHRcdFx0XHRcdHRoaXMuX25vZGVQcm9jZXNzSWQgPSArcmVzcC5ib2R5LnZhbHVlO1xuXHRcdFx0XHRcdFx0dGhpcy5sb2coJ2xhJywgYF9pbml0aWFsaXplOiBnb3QgcHJvY2VzcyBpZCAke3RoaXMuX25vZGVQcm9jZXNzSWR9IGZyb20gbm9kZSAoMm5kIHRyeSlgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRJbml0aWFsaXplMihzdG9wcGVkKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9zdGFydEluaXRpYWxpemUyKHN0b3BwZWQpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmxvZygnbGEnLCBgX3N0YXJ0SW5pdGlhbGl6ZTogbm8gZW50cnkgZXZlbnQgYWZ0ZXIgJHtufSByZXRyaWVzOyBnaXZpbmcgdXBgKTtcblxuXHRcdFx0dGhpcy5fZ290RW50cnlFdmVudCA9IHRydWU7XHQvLyB3ZSBwcmV0ZW5kIHRvIGdvdCBvbmUgc28gdGhhdCBubyAnZW50cnknIGV2ZW50IHdpbGwgc2hvdyB1cCBsYXRlci4uLlxuXG5cdFx0XHR0aGlzLl9ub2RlLmNvbW1hbmQoJ2ZyYW1lJywgbnVsbCwgKHJlc3A6IFY4RnJhbWVSZXNwb25zZSkgPT4ge1xuXHRcdFx0XHRpZiAocmVzcC5zdWNjZXNzKSB7XG5cdFx0XHRcdFx0Y29uc3QgcyA9IDxWOFNjcmlwdD4gdGhpcy5fZ2V0VmFsdWVGcm9tQ2FjaGUocmVzcC5ib2R5LnNjcmlwdCk7XG5cdFx0XHRcdFx0dGhpcy5fcmVtZW1iZXJFbnRyeUxvY2F0aW9uKHMubmFtZSwgcmVzcC5ib2R5LmxpbmUsIHJlc3AuYm9keS5jb2x1bW4pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5fc3RhcnRJbml0aWFsaXplMihzdG9wcGVkKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX3N0YXJ0SW5pdGlhbGl6ZTIoc3RvcHBlZDogYm9vbGVhbik6IHZvaWQge1xuXHRcdC8vIHJlcXVlc3QgVUkgdG8gc2VuZCBicmVha3BvaW50c1xuXHRcdHRoaXMubG9nKCdsYScsICdfc3RhcnRJbml0aWFsaXplMjogZmlyZSBpbml0aWFsaXplZCBldmVudCcpO1xuXHRcdHRoaXMuc2VuZEV2ZW50KG5ldyBJbml0aWFsaXplZEV2ZW50KCkpO1xuXG5cdFx0Ly8gaW4gYXR0YWNoLW1vZGUgd2UgZG9uJ3Qga25vdyB3aGV0aGVyIHRoZSBkZWJ1Z2dlZSBoYXMgYmVlbiBsYXVuY2hlZCBpbiAnc3RvcCBvbiBlbnRyeScgbW9kZVxuXHRcdC8vIHNvIHdlIHVzZSB0aGUgc3RvcHBlZCBzdGF0ZSBvZiB0aGUgVk1cblx0XHRpZiAodGhpcy5fYXR0YWNoTW9kZSkge1xuXHRcdFx0dGhpcy5sb2coJ2xhJywgYF9zdGFydEluaXRpYWxpemUyOiBpbiBhdHRhY2ggbW9kZSB3ZSBndWVzcyBzdG9wT25FbnRyeSBmbGFnIHRvIGJlICcke3N0b3BwZWR9JydgKTtcblx0XHRcdHRoaXMuX3N0b3BPbkVudHJ5ID0gc3RvcHBlZDtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fc3RvcE9uRW50cnkpIHtcblx0XHRcdC8vIHVzZXIgaGFzIHJlcXVlc3RlZCAnc3RvcCBvbiBlbnRyeScgc28gc2VuZCBvdXQgYSBzdG9wLW9uLWVudHJ5XG5cdFx0XHR0aGlzLmxvZygnbGEnLCAnX3N0YXJ0SW5pdGlhbGl6ZTI6IGZpcmUgc3RvcC1vbi1lbnRyeSBldmVudCcpO1xuXHRcdFx0dGhpcy5zZW5kRXZlbnQobmV3IFN0b3BwZWRFdmVudChsb2NhbGl6ZSh7IGtleTogJ3JlYXNvbi5lbnRyeScsIGNvbW1lbnQ6IFsnaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC92c2NvZGUvaXNzdWVzLzQ1NjgnXSB9LCBcImVudHJ5XCIpLCBOb2RlRGVidWdTZXNzaW9uLkRVTU1ZX1RIUkVBRF9JRCkpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdC8vIHNpbmNlIHdlIGFyZSBzdG9wcGVkIGJ1dCBVSSBkb2Vzbid0IGtub3cgYWJvdXQgdGhpcywgcmVtZW1iZXIgdGhhdCB3ZSBjb250aW51ZSBsYXRlciBpbiBmaW5pc2hJbml0aWFsaXplKClcblx0XHRcdHRoaXMubG9nKCdsYScsIGBfc3RhcnRJbml0aWFsaXplMjogcmVtZW1iZXIgdG8gZG8gYSAnQ29udGludWUnIGxhdGVyYCk7XG5cdFx0XHR0aGlzLl9uZWVkQ29udGludWUgPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdC8vLS0tLSBkaXNjb25uZWN0IHJlcXVlc3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdHByb3RlY3RlZCBkaXNjb25uZWN0UmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5EaXNjb25uZWN0UmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuRGlzY29ubmVjdEFyZ3VtZW50cyk6IHZvaWQge1xuXG5cdFx0Ly8gc3BlY2lhbCBjb2RlIGZvciAnZXh0ZW5zaW9uSG9zdCcgZGVidWdnaW5nXG5cdFx0aWYgKHRoaXMuX2FkYXB0ZXJJRCA9PT0gJ2V4dGVuc2lvbkhvc3QnKSB7XG5cdFx0XHQvLyBkZXRlY3Qgd2hldGhlciB0aGlzIGRpc2Nvbm5lY3QgcmVxdWVzdCBpcyBwYXJ0IG9mIGEgcmVzdGFydCBzZXNzaW9uXG5cdFx0XHRpZiAodGhpcy5fbm9kZVByb2Nlc3NJZCA+IDAgJiYgYXJncyAmJiB0eXBlb2YgKDxhbnk+YXJncykucmVzdGFydCA9PT0gJ2Jvb2xlYW4nICYmICg8YW55PmFyZ3MpLnJlc3RhcnQpIHtcblx0XHRcdFx0Ly8gZG8gbm90IGtpbGwgZXh0ZW5zaW9uSG9zdCAoc2luY2UgdnNjb2RlIHdpbGwgZG8gdGhpcyBmb3IgdXMgaW4gYSBuaWNlciB3YXkgd2l0aG91dCBraWxsaW5nIHRoZSB3aW5kb3cpXG5cdFx0XHRcdHRoaXMuX25vZGVQcm9jZXNzSWQgPSAwO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHN1cGVyLmRpc2Nvbm5lY3RSZXF1ZXN0KHJlc3BvbnNlLCBhcmdzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiB3ZSByZWx5IG9uIHRoZSBnZW5lcmljIGltcGxlbWVudGF0aW9uIGZyb20gRGVidWdTZXNzaW9uIGJ1dCB3ZSBvdmVycmlkZSAnUHJvdG9jb2wuc2h1dGRvd24nXG5cdCAqIHRvIGRpc2Nvbm5lY3QgZnJvbSBub2RlIGFuZCBraWxsIG5vZGUgJiBzdWJwcm9jZXNzZXNcblx0ICovXG5cdHB1YmxpYyBzaHV0ZG93bigpOiB2b2lkIHtcblxuXHRcdGlmICghdGhpcy5faW5TaHV0ZG93bikge1xuXHRcdFx0dGhpcy5faW5TaHV0ZG93biA9IHRydWU7XG5cblx0XHRcdGlmICh0aGlzLl9hdHRhY2hNb2RlKSB7XG5cdFx0XHRcdC8vIGRpc2Nvbm5lY3Qgb25seSBpbiBhdHRhY2ggbW9kZSBzaW5jZSBvdGhlcndpc2Ugbm9kZSBjb250aW51ZXMgdG8gcnVuIHVudGlsIGl0IGlzIGtpbGxlZFxuXHRcdFx0XHR0aGlzLl9ub2RlLmNvbW1hbmQoJ2Rpc2Nvbm5lY3QnKTsgLy8gd2UgZG9uJ3Qgd2FpdCBmb3IgcmVwb25zZVxuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9ub2RlLnN0b3AoKTtcdC8vIHN0b3Agc29ja2V0IGNvbm5lY3Rpb24gKG90aGVyd2lzZSBub2RlLmpzIGRpZXMgd2l0aCBFQ09OTlJFU0VUIG9uIFdpbmRvd3MpXG5cblx0XHRcdGlmICghdGhpcy5fYXR0YWNoTW9kZSkge1xuXHRcdFx0XHQvLyBraWxsIHRoZSB3aG9sZSBwcm9jZXNzIHRyZWUgZWl0aGVyIHN0YXJ0aW5nIHdpdGggdGhlIHRlcm1pbmFsIG9yIHdpdGggdGhlIG5vZGUgcHJvY2Vzc1xuXHRcdFx0XHRsZXQgcGlkID0gdGhpcy5fdGVybWluYWxQcm9jZXNzID8gdGhpcy5fdGVybWluYWxQcm9jZXNzLnBpZCA6IHRoaXMuX25vZGVQcm9jZXNzSWQ7XG5cdFx0XHRcdGlmIChwaWQgPiAwKSB7XG5cdFx0XHRcdFx0dGhpcy5sb2coJ2xhJywgJ3NodXRkb3duOiBraWxsIGRlYnVnZWUgYW5kIHN1Yi1wcm9jZXNzZXMnKTtcblx0XHRcdFx0XHRUZXJtaW5hbC5raWxsVHJlZShwaWQpLnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5fdGVybWluYWxQcm9jZXNzID0gbnVsbDtcblx0XHRcdFx0XHRcdHRoaXMuX25vZGVQcm9jZXNzSWQgPSAtMTtcblx0XHRcdFx0XHRcdHN1cGVyLnNodXRkb3duKCk7XG5cdFx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5fdGVybWluYWxQcm9jZXNzID0gbnVsbDtcblx0XHRcdFx0XHRcdHRoaXMuX25vZGVQcm9jZXNzSWQgPSAtMTtcblx0XHRcdFx0XHRcdHN1cGVyLnNodXRkb3duKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHN1cGVyLnNodXRkb3duKCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8tLS0gc2V0IGJyZWFrcG9pbnRzIHJlcXVlc3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0cHJvdGVjdGVkIHNldEJyZWFrUG9pbnRzUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5TZXRCcmVha3BvaW50c1Jlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlNldEJyZWFrcG9pbnRzQXJndW1lbnRzKTogdm9pZCB7XG5cblx0XHR0aGlzLmxvZygnYnAnLCBgc2V0QnJlYWtQb2ludHNSZXF1ZXN0OiAke0pTT04uc3RyaW5naWZ5KGFyZ3Muc291cmNlKX0gJHtKU09OLnN0cmluZ2lmeShhcmdzLmJyZWFrcG9pbnRzKX1gKTtcblxuXHRcdGNvbnN0IHNicyA9IG5ldyBBcnJheTxJbnRlcm5hbFNvdXJjZUJyZWFrcG9pbnQ+KCk7XG5cdFx0Ly8gcHJlZmVyIHRoZSBuZXcgQVBJOiBhcnJheSBvZiBicmVha3BvaW50c1xuXHRcdGlmIChhcmdzLmJyZWFrcG9pbnRzKSB7XG5cdFx0XHRmb3IgKGxldCBiIG9mIGFyZ3MuYnJlYWtwb2ludHMpIHtcblx0XHRcdFx0c2JzLnB1c2gobmV3IEludGVybmFsU291cmNlQnJlYWtwb2ludChcblx0XHRcdFx0XHR0aGlzLmNvbnZlcnRDbGllbnRMaW5lVG9EZWJ1Z2dlcihiLmxpbmUpLFxuXHRcdFx0XHRcdHR5cGVvZiBiLmNvbHVtbiA9PT0gJ251bWJlcicgPyB0aGlzLmNvbnZlcnRDbGllbnRDb2x1bW5Ub0RlYnVnZ2VyKGIuY29sdW1uKSA6IDAsXG5cdFx0XHRcdFx0Yi5jb25kaXRpb24pXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIGRlcHJlY2F0ZWQgQVBJOiBjb252ZXJ0IGxpbmUgbnVtYmVyIGFycmF5XG5cdFx0XHRmb3IgKGxldCBsIG9mIGFyZ3MubGluZXMpIHtcblx0XHRcdFx0c2JzLnB1c2gobmV3IEludGVybmFsU291cmNlQnJlYWtwb2ludCh0aGlzLmNvbnZlcnRDbGllbnRMaW5lVG9EZWJ1Z2dlcihsKSkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnN0IHNvdXJjZSA9IGFyZ3Muc291cmNlO1xuXG5cdFx0aWYgKHNvdXJjZS5hZGFwdGVyRGF0YSkge1xuXG5cdFx0XHRpZiAoc291cmNlLmFkYXB0ZXJEYXRhLmlubGluZVBhdGgpIHtcblx0XHRcdFx0Ly8gYSBicmVha3BvaW50IGluIGlubGluZWQgc291cmNlOiB3ZSBuZWVkIHRvIHNvdXJjZSBtYXBcblx0XHRcdFx0dGhpcy5fbWFwU291cmNlQW5kVXBkYXRlQnJlYWtwb2ludHMocmVzcG9uc2UsIHNvdXJjZS5hZGFwdGVyRGF0YS5pbmxpbmVQYXRoLCBzYnMpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzb3VyY2UuYWRhcHRlckRhdGEucmVtb3RlUGF0aCkge1xuXHRcdFx0XHQvLyBhIGJyZWFrcG9pbnQgaW4gYSByZW1vdGUgZmlsZTogZG9uJ3QgdHJ5IHRvIHNvdXJjZSBtYXBcblx0XHRcdFx0dGhpcy5fdXBkYXRlQnJlYWtwb2ludHMocmVzcG9uc2UsIHNvdXJjZS5hZGFwdGVyRGF0YS5yZW1vdGVQYXRoLCAtMSwgc2JzKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChzb3VyY2Uuc291cmNlUmVmZXJlbmNlID4gMCkge1xuXHRcdFx0Y29uc3Qgc3JjU291cmNlID0gdGhpcy5fc291cmNlSGFuZGxlcy5nZXQoc291cmNlLnNvdXJjZVJlZmVyZW5jZSk7XG5cdFx0XHRpZiAoc3JjU291cmNlICYmIHNyY1NvdXJjZS5zY3JpcHRJZCkge1xuXHRcdFx0XHR0aGlzLl91cGRhdGVCcmVha3BvaW50cyhyZXNwb25zZSwgbnVsbCwgc3JjU291cmNlLnNjcmlwdElkLCBzYnMpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHNvdXJjZS5wYXRoKSB7XG5cdFx0XHRsZXQgcGF0aCA9IHRoaXMuY29udmVydENsaWVudFBhdGhUb0RlYnVnZ2VyKHNvdXJjZS5wYXRoKTtcblx0XHRcdHRoaXMuX21hcFNvdXJjZUFuZFVwZGF0ZUJyZWFrcG9pbnRzKHJlc3BvbnNlLCBwYXRoLCBzYnMpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChzb3VyY2UubmFtZSkge1xuXHRcdFx0Ly8gYSBjb3JlIG1vZHVsZVxuXHRcdFx0dGhpcy5fZmluZE1vZHVsZShzb3VyY2UubmFtZSkudGhlbihzY3JpcHRJZCA9PiB7XG5cdFx0XHRcdGlmIChzY3JpcHRJZCA+PSAwKSB7XG5cdFx0XHRcdFx0dGhpcy5fdXBkYXRlQnJlYWtwb2ludHMocmVzcG9uc2UsIG51bGwsIHNjcmlwdElkLCBzYnMpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuc2VuZEVycm9yUmVzcG9uc2UocmVzcG9uc2UsIDIwMTksIGxvY2FsaXplKCdWU05EMjAxOScsIFwiSW50ZXJuYWwgbW9kdWxlIHswfSBub3QgZm91bmQuXCIsICd7X21vZHVsZX0nKSwgeyBfbW9kdWxlOiBzb3VyY2UubmFtZSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLnNlbmRFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAyMDEyLCAnTm8gdmFsaWQgc291cmNlIHNwZWNpZmllZC4nLCBudWxsLCBFcnJvckRlc3RpbmF0aW9uLlRlbGVtZXRyeSk7XG5cdH1cblxuXHRwcml2YXRlIF9tYXBTb3VyY2VBbmRVcGRhdGVCcmVha3BvaW50cyhyZXNwb25zZTogRGVidWdQcm90b2NvbC5TZXRCcmVha3BvaW50c1Jlc3BvbnNlLCBwYXRoOiBzdHJpbmcsIGxiczogSW50ZXJuYWxTb3VyY2VCcmVha3BvaW50W10pIHtcblxuXHRcdGxldCBzb3VyY2VtYXAgPSBmYWxzZTtcblxuXHRcdGxldCBnZW5lcmF0ZWQ6IHN0cmluZyA9IG51bGw7XG5cdFx0aWYgKHRoaXMuX3NvdXJjZU1hcHMpIHtcblx0XHRcdGdlbmVyYXRlZCA9IHRoaXMuX3NvdXJjZU1hcHMuTWFwUGF0aEZyb21Tb3VyY2UocGF0aCk7XG5cdFx0XHRpZiAoZ2VuZXJhdGVkID09PSBwYXRoKSB7ICAgLy8gaWYgZ2VuZXJhdGVkIGFuZCBzb3VyY2UgYXJlIHRoZSBzYW1lIHdlIGRvbid0IG5lZWQgYSBzb3VyY2VtYXBcblx0XHRcdFx0dGhpcy5sb2coJ2JwJywgYF9tYXBTb3VyY2VBbmRVcGRhdGVCcmVha3BvaW50czogc291cmNlIGFuZCBnZW5lcmF0ZWQgYXJlIHNhbWUgLT4gaWdub3JlIHNvdXJjZW1hcGApO1xuXHRcdFx0XHRnZW5lcmF0ZWQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoZ2VuZXJhdGVkKSB7XG5cdFx0XHRzb3VyY2VtYXAgPSB0cnVlO1xuXHRcdFx0Ly8gc291cmNlIG1hcCBsaW5lIG51bWJlcnNcblx0XHRcdGZvciAobGV0IGxiIG9mIGxicykge1xuXHRcdFx0XHRjb25zdCBtYXByZXN1bHQgPSB0aGlzLl9zb3VyY2VNYXBzLk1hcEZyb21Tb3VyY2UocGF0aCwgbGIubGluZSwgbGIuY29sdW1uKTtcblx0XHRcdFx0aWYgKG1hcHJlc3VsdCkge1xuXHRcdFx0XHRcdHRoaXMubG9nKCdzbScsIGBfbWFwU291cmNlQW5kVXBkYXRlQnJlYWtwb2ludHM6IHNyYzogJyR7cGF0aH0nICR7bGIubGluZX06JHtsYi5jb2x1bW59IC0+IGdlbjogJyR7bWFwcmVzdWx0LnBhdGh9JyAke21hcHJlc3VsdC5saW5lfToke21hcHJlc3VsdC5jb2x1bW59YCk7XG5cdFx0XHRcdFx0aWYgKG1hcHJlc3VsdC5wYXRoICE9PSBnZW5lcmF0ZWQpIHtcblx0XHRcdFx0XHRcdC8vIHRoaXMgc291cmNlIGxpbmUgbWFwcyB0byBhIGRpZmZlcmVudCBkZXN0aW5hdGlvbiBmaWxlIC0+IHRoaXMgaXMgbm90IHN1cHBvcnRlZCwgaWdub3JlIGJyZWFrcG9pbnQgYnkgc2V0dGluZyBsaW5lIHRvIC0xXG5cdFx0XHRcdFx0XHRsYi5saW5lID0gLTE7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxiLmxpbmUgPSBtYXByZXN1bHQubGluZTtcblx0XHRcdFx0XHRcdGxiLmNvbHVtbiA9IG1hcHJlc3VsdC5jb2x1bW47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMubG9nKCdzbScsIGBfbWFwU291cmNlQW5kVXBkYXRlQnJlYWtwb2ludHM6IHNyYzogJyR7cGF0aH0nICR7bGIubGluZX06JHtsYi5jb2x1bW59IC0+IGdlbjogY291bGRuJ3QgYmUgbWFwcGVkOyBicmVha3BvaW50IGlnbm9yZWRgKTtcblx0XHRcdFx0XHRsYi5saW5lID0gLTE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHBhdGggPSBnZW5lcmF0ZWQ7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCFOb2RlRGVidWdTZXNzaW9uLmlzSmF2YVNjcmlwdChwYXRoKSkge1xuXHRcdFx0Ly8gaWdub3JlIGFsbCBicmVha3BvaW50cyBmb3IgdGhpcyBzb3VyY2Vcblx0XHRcdGZvciAobGV0IGxiIG9mIGxicykge1xuXHRcdFx0XHRsYi5saW5lID0gLTE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gdHJ5IHRvIGNvbnZlcnQgbG9jYWwgcGF0aCB0byByZW1vdGUgcGF0aFxuXHRcdHBhdGggPSB0aGlzLl9sb2NhbFRvUmVtb3RlKHBhdGgpO1xuXG5cdFx0dGhpcy5fdXBkYXRlQnJlYWtwb2ludHMocmVzcG9uc2UsIHBhdGgsIC0xLCBsYnMsIHNvdXJjZW1hcCk7XG5cdH1cblxuXHQvKlxuXHQgKiBjbGVhciBhbmQgc2V0IGFsbCBicmVha3BvaW50cyBvZiBhIGdpdmVuIHNvdXJjZS5cblx0ICovXG5cdHByaXZhdGUgX3VwZGF0ZUJyZWFrcG9pbnRzKHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlNldEJyZWFrcG9pbnRzUmVzcG9uc2UsIHBhdGg6IHN0cmluZywgc2NyaXB0SWQ6IG51bWJlciwgbGJzOiBJbnRlcm5hbFNvdXJjZUJyZWFrcG9pbnRbXSwgc291cmNlbWFwOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcblxuXHRcdC8vIGNsZWFyIGFsbCBleGlzdGluZyBicmVha3BvaW50cyBmb3IgdGhlIGdpdmVuIHBhdGggb3Igc2NyaXB0IElEXG5cdFx0dGhpcy5fbm9kZS5saXN0QnJlYWtwb2ludHMoKS50aGVuKG5vZGVSZXNwb25zZSA9PiB7XG5cblx0XHRcdGNvbnN0IHRvQ2xlYXIgPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXG5cdFx0XHRjb25zdCBwYXRoX3JlZ2V4cCA9IHRoaXMuX3BhdGhUb1JlZ2V4cChwYXRoKTtcblxuXHRcdFx0Ly8gdHJ5IHRvIG1hdGNoIGJyZWFrcG9pbnRzXG5cdFx0XHRmb3IgKGxldCBicmVha3BvaW50IG9mIG5vZGVSZXNwb25zZS5ib2R5LmJyZWFrcG9pbnRzKSB7XG5cdFx0XHRcdHN3aXRjaCAoYnJlYWtwb2ludC50eXBlKSB7XG5cdFx0XHRcdGNhc2UgJ3NjcmlwdElkJzpcblx0XHRcdFx0XHRpZiAoc2NyaXB0SWQgPT09IGJyZWFrcG9pbnQuc2NyaXB0X2lkKSB7XG5cdFx0XHRcdFx0XHR0b0NsZWFyLnB1c2goYnJlYWtwb2ludC5udW1iZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnc2NyaXB0UmVnRXhwJzpcblx0XHRcdFx0XHRpZiAocGF0aF9yZWdleHAgPT09IGJyZWFrcG9pbnQuc2NyaXB0X3JlZ2V4cCkge1xuXHRcdFx0XHRcdFx0dG9DbGVhci5wdXNoKGJyZWFrcG9pbnQubnVtYmVyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMuX2NsZWFyQnJlYWtwb2ludHModG9DbGVhcik7XG5cblx0XHR9KS50aGVuKCAoKSA9PiB7XG5cblx0XHRcdHJldHVybiBQcm9taXNlLmFsbChsYnMubWFwKGJwID0+IHRoaXMuX3NldEJyZWFrcG9pbnQoc2NyaXB0SWQsIHBhdGgsIGJwLCBzb3VyY2VtYXApKSk7XG5cblx0XHR9KS50aGVuKHJlc3VsdCA9PiB7XG5cblx0XHRcdHJlc3BvbnNlLmJvZHkgPSB7XG5cdFx0XHRcdGJyZWFrcG9pbnRzOiByZXN1bHRcblx0XHRcdH07XG5cdFx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdFx0XHR0aGlzLmxvZygnYnAnLCBgX3VwZGF0ZUJyZWFrcG9pbnRzOiByZXN1bHQgJHtKU09OLnN0cmluZ2lmeShyZXN1bHQpfWApO1xuXG5cdFx0fSkuY2F0Y2gobm9kZVJlc3BvbnNlID0+IHtcblx0XHRcdHRoaXMuX3NlbmROb2RlUmVzcG9uc2UocmVzcG9uc2UsIG5vZGVSZXNwb25zZSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKlxuXHQgKiBDbGVhciBicmVha3BvaW50cyBieSB0aGVpciBpZHMuXG5cdCAqL1xuXHRwcml2YXRlIF9jbGVhckJyZWFrcG9pbnRzKGlkczogQXJyYXk8bnVtYmVyPikgOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoaWRzLm1hcChpZCA9PiB0aGlzLl9ub2RlLmNsZWFyQnJlYWtwb2ludCh7IGJyZWFrcG9pbnQ6IGlkIH0pKSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fSkuY2F0Y2goZXJyID0+IHtcblx0XHRcdHJldHVybjtcdC8vIGlnbm9yZSBlcnJvcnNcblx0XHR9KTtcblx0fVxuXG5cdC8qXG5cdCAqIHJlZ2lzdGVyIGEgc2luZ2xlIGJyZWFrcG9pbnQgd2l0aCBub2RlLlxuXHQgKi9cblx0cHJpdmF0ZSBfc2V0QnJlYWtwb2ludChzY3JpcHRJZDogbnVtYmVyLCBwYXRoOiBzdHJpbmcsIGxiOiBJbnRlcm5hbFNvdXJjZUJyZWFrcG9pbnQsIHNvdXJjZW1hcDogYm9vbGVhbikgOiBQcm9taXNlPEJyZWFrcG9pbnQ+IHtcblxuXHRcdGlmIChsYi5saW5lIDwgMCkge1xuXHRcdFx0Ly8gaWdub3JlIHRoaXMgYnJlYWtwb2ludCBiZWNhdXNlIGl0IGNvdWxkbid0IGJlIHNvdXJjZSBtYXBwZWQgc3VjY2Vzc2Z1bGx5XG5cdFx0XHRjb25zdCBicCA9IG5ldyBCcmVha3BvaW50KGZhbHNlKTtcblx0XHRcdCg8YW55PmJwKS5tZXNzYWdlID0gbG9jYWxpemUoJ3NvdXJjZW1hcHBpbmcuZmFpbC5tZXNzYWdlJywgXCJCcmVha3BvaW50IGlnbm9yZWQgYmVjYXVzZSBnZW5lcmF0ZWQgY29kZSBub3QgZm91bmQgKHNvdXJjZSBtYXAgcHJvYmxlbT8pLlwiKTtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoYnApO1xuXHRcdH1cblxuXHRcdGlmIChsYi5saW5lID09PSAwKSB7XG5cdFx0XHRsYi5jb2x1bW4gKz0gTm9kZURlYnVnU2Vzc2lvbi5GSVJTVF9MSU5FX09GRlNFVDtcblx0XHR9XG5cblx0XHRsZXQgYXJnczogVjhTZXRCcmVha3BvaW50QXJncztcblxuXHRcdGlmIChzY3JpcHRJZCA+IDApIHtcblx0XHRcdGFyZ3MgPSB7XG5cdFx0XHRcdHR5cGU6ICdzY3JpcHRJZCcsXG5cdFx0XHRcdHRhcmdldDogc2NyaXB0SWQsXG5cdFx0XHRcdGxpbmU6IGxiLmxpbmUsXG5cdFx0XHRcdGNvbHVtbjogbGIuY29sdW1uLFxuXHRcdFx0XHRjb25kaXRpb246IGxiLmNvbmRpdGlvblxuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YXJncyA9IHtcblx0XHRcdFx0dHlwZTogJ3NjcmlwdFJlZ0V4cCcsXG5cdFx0XHRcdHRhcmdldDogdGhpcy5fcGF0aFRvUmVnZXhwKHBhdGgpLFxuXHRcdFx0XHRsaW5lOiBsYi5saW5lLFxuXHRcdFx0XHRjb2x1bW46IGxiLmNvbHVtbixcblx0XHRcdFx0Y29uZGl0aW9uOiBsYi5jb25kaXRpb25cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX25vZGUuc2V0QnJlYWtwb2ludChhcmdzKS50aGVuKHJlc3AgPT4ge1xuXG5cdFx0XHR0aGlzLmxvZygnYnAnLCBgX3NldEJyZWFrcG9pbnQ6ICR7SlNPTi5zdHJpbmdpZnkoYXJncyl9YCk7XG5cblx0XHRcdGxldCBhY3R1YWxMaW5lID0gYXJncy5saW5lO1xuXHRcdFx0bGV0IGFjdHVhbENvbHVtbiA9IGFyZ3MuY29sdW1uO1xuXG5cdFx0XHRjb25zdCBhbCA9IHJlc3AuYm9keS5hY3R1YWxfbG9jYXRpb25zO1xuXHRcdFx0aWYgKGFsLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0YWN0dWFsTGluZSA9IGFsWzBdLmxpbmU7XG5cdFx0XHRcdGFjdHVhbENvbHVtbiA9IHRoaXMuX2FkanVzdENvbHVtbihhY3R1YWxMaW5lLCBhbFswXS5jb2x1bW4pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc291cmNlbWFwKSB7XG5cblx0XHRcdFx0aWYgKGFjdHVhbExpbmUgIT09IGFyZ3MubGluZSB8fCBhY3R1YWxDb2x1bW4gIT09IGFyZ3MuY29sdW1uKSB7XG5cdFx0XHRcdFx0Ly8gYnJlYWtwb2ludCBsb2NhdGlvbiB3YXMgYWRqdXN0ZWQgYnkgbm9kZS5qcyBzbyB3ZSBoYXZlIHRvIG1hcCB0aGUgbmV3IGxvY2F0aW9uIGJhY2sgdG8gc291cmNlXG5cblx0XHRcdFx0XHQvLyBmaXJzdCB0cnkgdG8gbWFwIHRoZSByZW1vdGUgcGF0aCBiYWNrIHRvIGxvY2FsXG5cdFx0XHRcdFx0Y29uc3QgbG9jYWxwYXRoID0gdGhpcy5fcmVtb3RlVG9Mb2NhbChwYXRoKTtcblxuXHRcdFx0XHRcdC8vIHRoZW4gdHJ5IHRvIG1hcCBqcyBsb2NhdGlvbnMgYmFjayB0byBzb3VyY2UgbG9jYXRpb25zXG5cdFx0XHRcdFx0Y29uc3QgbWFwcmVzdWx0ID0gdGhpcy5fc291cmNlTWFwcy5NYXBUb1NvdXJjZShsb2NhbHBhdGgsIG51bGwsIGFjdHVhbExpbmUsIGFjdHVhbENvbHVtbik7XG5cdFx0XHRcdFx0aWYgKG1hcHJlc3VsdCkge1xuXHRcdFx0XHRcdFx0dGhpcy5sb2coJ3NtJywgYF9zZXRCcmVha3BvaW50OiBicCB2ZXJpZmljYXRpb24gZ2VuOiAnJHtsb2NhbHBhdGh9JyAke2FjdHVhbExpbmV9OiR7YWN0dWFsQ29sdW1ufSAtPiBzcmM6ICcke21hcHJlc3VsdC5wYXRofScgJHttYXByZXN1bHQubGluZX06JHttYXByZXN1bHQuY29sdW1ufWApO1xuXHRcdFx0XHRcdFx0YWN0dWFsTGluZSA9IG1hcHJlc3VsdC5saW5lO1xuXHRcdFx0XHRcdFx0YWN0dWFsQ29sdW1uID0gbWFwcmVzdWx0LmNvbHVtbjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YWN0dWFsTGluZSA9IGxiLm9yZ0xpbmU7XG5cdFx0XHRcdFx0XHRhY3R1YWxDb2x1bW4gPSBsYi5vcmdDb2x1bW47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YWN0dWFsTGluZSA9IGxiLm9yZ0xpbmU7XG5cdFx0XHRcdFx0YWN0dWFsQ29sdW1uID0gbGIub3JnQ29sdW1uO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIG5hc3R5IGNvcm5lciBjYXNlOiBzaW5jZSB3ZSBpZ25vcmUgdGhlIGJyZWFrLW9uLWVudHJ5IGV2ZW50IHdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgd2Vcblx0XHRcdC8vIHN0b3AgaW4gdGhlIGVudHJ5IHBvaW50IGxpbmUgaWYgdGhlIHVzZXIgaGFzIGFuIGV4cGxpY2l0IGJyZWFrcG9pbnQgdGhlcmUuXG5cdFx0XHQvLyBGb3IgdGhpcyB3ZSBjaGVjayBoZXJlIHdoZXRoZXIgYSBicmVha3BvaW50IGlzIGF0IHRoZSBzYW1lIGxvY2F0aW9uIGFzIHRoZSAnYnJlYWstb24tZW50cnknIGxvY2F0aW9uLlxuXHRcdFx0Ly8gSWYgeWVzLCB0aGVuIHdlIHBsYW4gZm9yIGhpdHRpbmcgdGhlIGJyZWFrcG9pbnQgaW5zdGVhZCBvZiAnY29udGludWUnIG92ZXIgaXQhXG5cblx0XHRcdGlmICghdGhpcy5fc3RvcE9uRW50cnkgJiYgdGhpcy5fZW50cnlQYXRoID09PSBwYXRoKSB7XHQvLyBvbmx5IHJlbGV2YW50IGlmIHdlIGRvIG5vdCBzdG9wIG9uIGVudHJ5IGFuZCBoYXZlIGEgbWF0Y2hpbmcgZmlsZVxuXHRcdFx0XHRpZiAodGhpcy5fZW50cnlMaW5lID09PSBhY3R1YWxMaW5lICYmIHRoaXMuX2VudHJ5Q29sdW1uID09PSBhY3R1YWxDb2x1bW4pIHtcblx0XHRcdFx0XHQvLyB3ZSBkbyBub3QgaGF2ZSB0byAnY29udGludWUnIGJ1dCB3ZSBoYXZlIHRvIGdlbmVyYXRlIGEgc3RvcHBlZCBldmVudCBpbnN0ZWFkXG5cdFx0XHRcdFx0dGhpcy5fbmVlZENvbnRpbnVlID0gZmFsc2U7XG5cdFx0XHRcdFx0dGhpcy5fbmVlZEJyZWFrcG9pbnRFdmVudCA9IHRydWU7XG5cdFx0XHRcdFx0dGhpcy5sb2coJ2xhJywgJ19zZXRCcmVha3BvaW50OiByZW1lbWJlciB0byBmaXJlIGEgYnJlYWtwb2ludCBldmVudCBsYXRlcicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBuZXcgQnJlYWtwb2ludCh0cnVlLCB0aGlzLmNvbnZlcnREZWJ1Z2dlckxpbmVUb0NsaWVudChhY3R1YWxMaW5lKSwgdGhpcy5jb252ZXJ0RGVidWdnZXJDb2x1bW5Ub0NsaWVudChhY3R1YWxDb2x1bW4pKTtcblxuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdHJldHVybiBuZXcgQnJlYWtwb2ludChmYWxzZSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogY29udmVydHMgYSBwYXRoIGludG8gYSByZWd1bGFyIGV4cHJlc3Npb24gZm9yIHVzZSBpbiB0aGUgc2V0YnJlYWtwb2ludCByZXF1ZXN0XG5cdCAqL1xuXHRwcml2YXRlIF9wYXRoVG9SZWdleHAocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcblxuXHRcdGlmICghcGF0aCkge1xuXHRcdFx0cmV0dXJuIHBhdGg7XG5cdFx0fVxuXG5cdFx0bGV0IGVzY1BhdGggPSBwYXRoLnJlcGxhY2UoLyhbL1xcXFwuPyooKV4ke318W1xcXV0pL2csICdcXFxcJDEnKTtcblxuIFx0XHQvLyBjaGVjayBmb3IgZHJpdmUgbGV0dGVyXG5cdFx0aWYgKC9eW2EtekEtWl06XFxcXC8udGVzdChwYXRoKSkge1xuXHRcdFx0Y29uc3QgdSA9IGVzY1BhdGguc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCk7XG5cdFx0XHRjb25zdCBsID0gdS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0ZXNjUGF0aCA9ICdbJyArIGwgKyB1ICsgJ10nICsgZXNjUGF0aC5zdWJzdHJpbmcoMSk7XG5cdFx0fVxuXG5cdFx0Lypcblx0XHQvLyBzdXBwb3J0IGNhc2UtaW5zZW5zaXRpdmUgYnJlYWtwb2ludCBwYXRoc1xuXHRcdGNvbnN0IGVzY1BhdGhVcHBlciA9IGVzY1BhdGgudG9VcHBlckNhc2UoKTtcblx0XHRjb25zdCBlc2NQYXRoTG93ZXIgPSBlc2NQYXRoLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRlc2NQYXRoID0gJyc7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBlc2NQYXRoVXBwZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHUgPSBlc2NQYXRoVXBwZXJbaV07XG5cdFx0XHRjb25zdCBsID0gZXNjUGF0aExvd2VyW2ldO1xuXHRcdFx0aWYgKHUgPT09IGwpIHtcblx0XHRcdFx0ZXNjUGF0aCArPSB1O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZXNjUGF0aCArPSAnWycgKyBsICsgdSArICddJztcblx0XHRcdH1cblx0XHR9XG5cdFx0Ki9cblxuXHRcdGNvbnN0IHBhdGhSZWdleCA9ICdeKC4qW1xcXFwvXFxcXFxcXFxdKT8nICsgZXNjUGF0aCArICckJztcdFx0Ly8gc2tpcHMgZHJpdmUgbGV0dGVyc1xuXHRcdHJldHVybiBwYXRoUmVnZXg7XG5cdH1cblxuXHQvLy0tLSBzZXQgZnVuY3Rpb24gYnJlYWtwb2ludHMgcmVxdWVzdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwcm90ZWN0ZWQgc2V0RnVuY3Rpb25CcmVha1BvaW50c1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuU2V0RnVuY3Rpb25CcmVha3BvaW50c1Jlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlNldEZ1bmN0aW9uQnJlYWtwb2ludHNBcmd1bWVudHMpOiB2b2lkIHtcblxuXHRcdC8vIGNsZWFyIGFsbCBleGlzdGluZyBmdW5jdGlvbiBicmVha3BvaW50c1xuXHRcdHRoaXMuX2NsZWFyQnJlYWtwb2ludHModGhpcy5fZnVuY3Rpb25CcmVha3BvaW50cykudGhlbigoKSA9PiB7XG5cblx0XHRcdHRoaXMuX2Z1bmN0aW9uQnJlYWtwb2ludHMubGVuZ3RoID0gMDtcdC8vIGNsZWFyIGFycmF5XG5cblx0XHRcdC8vIHNldCBuZXcgZnVuY3Rpb24gYnJlYWtwb2ludHNcblx0XHRcdHJldHVybiBQcm9taXNlLmFsbChhcmdzLmJyZWFrcG9pbnRzLm1hcChmdW5jdGlvbkJyZWFrcG9pbnQgPT4gdGhpcy5fc2V0RnVuY3Rpb25CcmVha3BvaW50KGZ1bmN0aW9uQnJlYWtwb2ludCkpKTtcblxuXHRcdH0pLnRoZW4ocmVzdWx0cyA9PiB7XG5cblx0XHRcdHJlc3BvbnNlLmJvZHkgPSB7XG5cdFx0XHRcdGJyZWFrcG9pbnRzOiByZXN1bHRzXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXG5cdFx0XHR0aGlzLmxvZygnYnAnLCBgc2V0RnVuY3Rpb25CcmVha1BvaW50c1JlcXVlc3Q6IHJlc3VsdCAke0pTT04uc3RyaW5naWZ5KHJlc3VsdHMpfWApO1xuXG5cdFx0fSkuY2F0Y2gobm9kZVJlc3BvbnNlID0+IHtcblxuXHRcdFx0dGhpcy5fc2VuZE5vZGVSZXNwb25zZShyZXNwb25zZSwgbm9kZVJlc3BvbnNlKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qXG5cdCAqIFJlZ2lzdGVyIGEgc2luZ2xlIGZ1bmN0aW9uIGJyZWFrcG9pbnQgd2l0aCBub2RlLlxuXHQgKiBSZXR1cm5zIHZlcmlmaWNhdGlvbiBpbmZvIGFib3V0IHRoZSBicmVha3BvaW50LlxuXHQgKi9cblx0cHJpdmF0ZSBfc2V0RnVuY3Rpb25CcmVha3BvaW50KGZ1bmN0aW9uQnJlYWtwb2ludDogRGVidWdQcm90b2NvbC5GdW5jdGlvbkJyZWFrcG9pbnQpOiBQcm9taXNlPEJyZWFrcG9pbnQ+IHtcblxuXHRcdGxldCBhcmdzOiBWOFNldEJyZWFrcG9pbnRBcmdzID0ge1xuXHRcdFx0dHlwZTogJ2Z1bmN0aW9uJyxcblx0XHRcdHRhcmdldDogZnVuY3Rpb25CcmVha3BvaW50Lm5hbWVcblx0XHR9O1xuXHRcdGlmIChmdW5jdGlvbkJyZWFrcG9pbnQuY29uZGl0aW9uKSB7XG5cdFx0XHRhcmdzLmNvbmRpdGlvbiA9IGZ1bmN0aW9uQnJlYWtwb2ludC5jb25kaXRpb247XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX25vZGUuc2V0QnJlYWtwb2ludChhcmdzKS50aGVuKHJlc3AgPT4ge1xuXHRcdFx0dGhpcy5fZnVuY3Rpb25CcmVha3BvaW50cy5wdXNoKHJlc3AuYm9keS5icmVha3BvaW50KTtcdC8vIHJlbWVtYmVyIGZ1bmN0aW9uIGJyZWFrcG9pbnQgaWRzXG5cdFx0XHRjb25zdCBsb2NhdGlvbnMgPSByZXNwLmJvZHkuYWN0dWFsX2xvY2F0aW9ucztcblx0XHRcdGlmIChsb2NhdGlvbnMgJiYgbG9jYXRpb25zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Y29uc3QgYWN0dWFsTGluZSA9IHRoaXMuY29udmVydERlYnVnZ2VyTGluZVRvQ2xpZW50KGxvY2F0aW9uc1swXS5saW5lKTtcblx0XHRcdFx0Y29uc3QgYWN0dWFsQ29sdW1uID0gdGhpcy5jb252ZXJ0RGVidWdnZXJDb2x1bW5Ub0NsaWVudCh0aGlzLl9hZGp1c3RDb2x1bW4oYWN0dWFsTGluZSwgbG9jYXRpb25zWzBdLmNvbHVtbikpO1xuXHRcdFx0XHRyZXR1cm4gbmV3IEJyZWFrcG9pbnQodHJ1ZSwgYWN0dWFsTGluZSwgYWN0dWFsQ29sdW1uKTtcdC8vIFRPRE9AQVcgYWRkIHNvdXJjZVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBCcmVha3BvaW50KHRydWUpO1xuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKChyZXNwOiBOb2RlVjhSZXNwb25zZSkgPT4ge1xuXHRcdFx0cmV0dXJuIDxEZWJ1Z1Byb3RvY29sLkJyZWFrcG9pbnQ+IHtcblx0XHRcdFx0dmVyaWZpZWQ6IGZhbHNlLFxuXHRcdFx0XHRtZXNzYWdlOiByZXNwLm1lc3NhZ2Vcblx0XHRcdH07XG5cdFx0fSk7XG5cdH1cblxuXHQvLy0tLSBzZXQgZXhjZXB0aW9uIHJlcXVlc3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwcm90ZWN0ZWQgc2V0RXhjZXB0aW9uQnJlYWtQb2ludHNSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlNldEV4Y2VwdGlvbkJyZWFrcG9pbnRzUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU2V0RXhjZXB0aW9uQnJlYWtwb2ludHNBcmd1bWVudHMpOiB2b2lkIHtcblxuXHRcdHRoaXMubG9nKCdicCcsIGBzZXRFeGNlcHRpb25CcmVha1BvaW50c1JlcXVlc3Q6ICR7SlNPTi5zdHJpbmdpZnkoYXJncy5maWx0ZXJzKX1gKTtcblxuXHRcdGxldCBub2RlQXJnczogVjhTZXRFeGNlcHRpb25CcmVha0FyZ3MgPSB7XG5cdFx0XHR0eXBlOiAnYWxsJyxcblx0XHRcdGVuYWJsZWQ6IGZhbHNlXG5cdFx0fTtcblx0XHRjb25zdCBmaWx0ZXJzID0gYXJncy5maWx0ZXJzO1xuXHRcdGlmIChmaWx0ZXJzKSB7XG5cdFx0XHRpZiAoZmlsdGVycy5pbmRleE9mKCdhbGwnKSA+PSAwKSB7XG5cdFx0XHRcdG5vZGVBcmdzLmVuYWJsZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJzLmluZGV4T2YoJ3VuY2F1Z2h0JykgPj0gMCkge1xuXHRcdFx0XHRub2RlQXJncy50eXBlID0gJ3VuY2F1Z2h0Jztcblx0XHRcdFx0bm9kZUFyZ3MuZW5hYmxlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fbm9kZS5zZXRFeGNlcHRpb25CcmVhayhub2RlQXJncykudGhlbihub2RlUmVzcG9uc2UgPT4ge1xuXHRcdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHRcdH0pLmNhdGNoKGVyciA9PiB7XG5cdFx0XHR0aGlzLnNlbmRFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAyMDI0LCAnQ29uZmlndXJpbmcgZXhjZXB0aW9uIGJyZWFrIG9wdGlvbnMgZmFpbGVkICh7X25vZGVFcnJvcn0pLicsIHsgX25vZGVFcnJvcjogZXJyLm1lc3NhZ2UgfSwgRXJyb3JEZXN0aW5hdGlvbi5UZWxlbWV0cnkpO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8tLS0gc2V0IGV4Y2VwdGlvbiByZXF1ZXN0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0cHJvdGVjdGVkIGNvbmZpZ3VyYXRpb25Eb25lUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5Db25maWd1cmF0aW9uRG9uZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLkNvbmZpZ3VyYXRpb25Eb25lQXJndW1lbnRzKTogdm9pZCB7XG5cblx0XHQvLyBhbGwgYnJlYWtwb2ludHMgYXJlIGNvbmZpZ3VyZWQgbm93IC0+IHN0YXJ0IGRlYnVnZ2luZ1xuXG5cdFx0bGV0IGluZm8gPSAnbm90aGluZyB0byBkbyc7XG5cblx0XHRpZiAodGhpcy5fbmVlZENvbnRpbnVlKSB7XHQvLyB3ZSBkbyBub3QgYnJlYWsgb24gZW50cnlcblx0XHRcdHRoaXMuX25lZWRDb250aW51ZSA9IGZhbHNlO1xuXHRcdFx0aW5mbyA9ICdkbyBhIFxcJ0NvbnRpbnVlXFwnJztcblx0XHRcdHRoaXMuX25vZGUuY29tbWFuZCgnY29udGludWUnLCBudWxsLCAobm9kZVJlc3BvbnNlKSA9PiB7IH0pO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9uZWVkQnJlYWtwb2ludEV2ZW50KSB7XHQvLyB3ZSBoYXZlIHRvIGJyZWFrIG9uIGVudHJ5XG5cdFx0XHR0aGlzLl9uZWVkQnJlYWtwb2ludEV2ZW50ID0gZmFsc2U7XG5cdFx0XHRpbmZvID0gJ2ZpcmUgYnJlYWtwb2ludCBldmVudCc7XG5cdFx0XHR0aGlzLnNlbmRFdmVudChuZXcgU3RvcHBlZEV2ZW50KGxvY2FsaXplKHsga2V5OiAncmVhc29uLmJyZWFrcG9pbnQnLCBjb21tZW50OiBbJ2h0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvdnNjb2RlL2lzc3Vlcy80NTY4J10gfSwgXCJicmVha3BvaW50XCIpLCBOb2RlRGVidWdTZXNzaW9uLkRVTU1ZX1RIUkVBRF9JRCkpO1xuXHRcdH1cblxuXHRcdHRoaXMubG9nKCdsYScsIGBjb25maWd1cmF0aW9uRG9uZVJlcXVlc3Q6ICR7aW5mb31gKTtcblxuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdC8vLS0tIHRocmVhZHMgcmVxdWVzdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdHByb3RlY3RlZCB0aHJlYWRzUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5UaHJlYWRzUmVzcG9uc2UpOiB2b2lkIHtcblx0XHR0aGlzLl9ub2RlLmNvbW1hbmQoJ3RocmVhZHMnLCBudWxsLCAobm9kZVJlc3BvbnNlOiBOb2RlVjhSZXNwb25zZSkgPT4ge1xuXHRcdFx0Y29uc3QgdGhyZWFkcyA9IG5ldyBBcnJheTxUaHJlYWQ+KCk7XG5cdFx0XHRpZiAobm9kZVJlc3BvbnNlLnN1Y2Nlc3MpIHtcblx0XHRcdFx0Y29uc3QgdGhzID0gbm9kZVJlc3BvbnNlLmJvZHkudGhyZWFkcztcblx0XHRcdFx0aWYgKHRocykge1xuXHRcdFx0XHRcdGZvciAobGV0IHRocmVhZCBvZiB0aHMpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGlkID0gdGhyZWFkLmlkO1xuXHRcdFx0XHRcdFx0aWYgKGlkID49IDApIHtcblx0XHRcdFx0XHRcdFx0dGhyZWFkcy5wdXNoKG5ldyBUaHJlYWQoaWQsIGBUaHJlYWQgKGlkOiAke2lkfSlgKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhyZWFkcy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0dGhyZWFkcy5wdXNoKG5ldyBUaHJlYWQoTm9kZURlYnVnU2Vzc2lvbi5EVU1NWV9USFJFQURfSUQsIE5vZGVEZWJ1Z1Nlc3Npb24uRFVNTVlfVEhSRUFEX05BTUUpKTtcblx0XHRcdH1cblx0XHRcdHJlc3BvbnNlLmJvZHkgPSB7XG5cdFx0XHRcdHRocmVhZHM6IHRocmVhZHNcblx0XHRcdH07XG5cdFx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLy0tLSBzdGFja3RyYWNlIHJlcXVlc3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwcm90ZWN0ZWQgc3RhY2tUcmFjZVJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuU3RhY2tUcmFjZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlN0YWNrVHJhY2VBcmd1bWVudHMpOiB2b2lkIHtcblxuXHRcdGNvbnN0IHRocmVhZFJlZmVyZW5jZSA9IGFyZ3MudGhyZWFkSWQ7XG5cdFx0Y29uc3Qgc3RhcnRGcmFtZSA9IHR5cGVvZiBhcmdzLnN0YXJ0RnJhbWUgPT09ICdudW1iZXInID8gYXJncy5zdGFydEZyYW1lIDogMDtcblx0XHRjb25zdCBtYXhMZXZlbHMgPSBhcmdzLmxldmVscztcblxuXHRcdGxldCB0b3RhbEZyYW1lcyA9IDA7XG5cblx0XHRpZiAodGhyZWFkUmVmZXJlbmNlICE9PSBOb2RlRGVidWdTZXNzaW9uLkRVTU1ZX1RIUkVBRF9JRCkge1xuXHRcdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZShyZXNwb25zZSwgMjAxNCwgJ1VuZXhwZWN0ZWQgdGhyZWFkIHJlZmVyZW5jZSB7X3RocmVhZH0uJywgeyBfdGhyZWFkOiB0aHJlYWRSZWZlcmVuY2UgfSwgRXJyb3JEZXN0aW5hdGlvbi5UZWxlbWV0cnkpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGJhY2t0cmFjZUFyZ3MgOiBhbnkgPSB7XG5cdFx0XHRmcm9tRnJhbWU6IHN0YXJ0RnJhbWUsXG5cdFx0XHR0b0ZyYW1lOiBzdGFydEZyYW1lK21heExldmVsc1xuXHRcdH07XG5cdFx0Y29uc3QgY21kID0gdGhpcy5fbm9kZUluamVjdGlvbkF2YWlsYWJsZSA/ICd2c2NvZGVfYmFja3RyYWNlJyA6ICdiYWNrdHJhY2UnO1xuXG5cdFx0dGhpcy5sb2coJ3ZhJywgYHN0YWNrVHJhY2VSZXF1ZXN0OiAke2NtZH0gJHtzdGFydEZyYW1lfSAke21heExldmVsc31gKTtcblx0XHR0aGlzLl9ub2RlLmNvbW1hbmQyKGNtZCwgYmFja3RyYWNlQXJncykudGhlbigocmVzcG9uc2U6IFY4QmFja3RyYWNlUmVzcG9uc2UpID0+IHtcblxuXHRcdFx0aWYgKHJlc3BvbnNlLmJvZHkudG90YWxGcmFtZXMgPiAwIHx8IHJlc3BvbnNlLmJvZHkuZnJhbWVzKSB7XG5cdFx0XHRcdGNvbnN0IGZyYW1lcyA9IHJlc3BvbnNlLmJvZHkuZnJhbWVzO1xuXHRcdFx0XHR0b3RhbEZyYW1lcyA9IHJlc3BvbnNlLmJvZHkudG90YWxGcmFtZXM7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLmFsbDxTdGFja0ZyYW1lPihmcmFtZXMubWFwKGZyYW1lID0+IHRoaXMuX2NyZWF0ZVN0YWNrRnJhbWUoZnJhbWUpKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ25vIHN0YWNrJyk7XG5cdFx0XHR9XG5cblx0XHR9KS50aGVuKHN0YWNrZnJhbWVzID0+IHtcblxuXHRcdFx0cmVzcG9uc2UuYm9keSA9IHtcblx0XHRcdFx0c3RhY2tGcmFtZXM6IHN0YWNrZnJhbWVzLFxuXHRcdFx0XHR0b3RhbEZyYW1lczogdG90YWxGcmFtZXNcblx0XHRcdH07XG5cdFx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cblx0XHRcdGlmIChlcnJvci5tZXNzYWdlID09PSAnbm8gc3RhY2snKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9zdG9wcGVkUmVhc29uID09PSAncGF1c2UnKSB7XG5cdFx0XHRcdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZShyZXNwb25zZSwgMjAyMiwgbG9jYWxpemUoJ1ZTTkQyMDIyJywgXCJObyBjYWxsIHN0YWNrIGJlY2F1c2UgcHJvZ3JhbSBwYXVzZWQgb3V0c2lkZSBvZiBKYXZhU2NyaXB0LlwiKSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZShyZXNwb25zZSwgMjAyMywgbG9jYWxpemUoJ1ZTTkQyMDIzJywgXCJObyBjYWxsIHN0YWNrIGF2YWlsYWJsZS5cIikpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnNlbmRFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAyMDE4LCBsb2NhbGl6ZSgnVlNORDIwMTgnLCBcIk5vIGNhbGwgc3RhY2sgYXZhaWxhYmxlICh7X2NvbW1hbmR9OiB7X2Vycm9yfSkuXCIpLCB7IF9jb21tYW5kOiBlcnJvci5jb21tYW5kLCBfZXJyb3I6IGVycm9yLm1lc3NhZ2UgfSApO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgc2luZ2xlIHN0YWNrIGZyYW1lLlxuXHQgKi9cblx0cHJpdmF0ZSBfY3JlYXRlU3RhY2tGcmFtZShmcmFtZTogVjhGcmFtZSkgOiBQcm9taXNlPFN0YWNrRnJhbWU+IHtcblxuXHRcdC8vIHJlc29sdmUgc29tZSByZWZzXG5cdFx0cmV0dXJuIHRoaXMuX3Jlc29sdmVWYWx1ZXMoWyBmcmFtZS5zY3JpcHQsIGZyYW1lLmZ1bmMsIGZyYW1lLnJlY2VpdmVyIF0pLnRoZW4oKCkgPT4ge1xuXG5cdFx0XHRsZXQgbGluZSA9IGZyYW1lLmxpbmU7XG5cdFx0XHRsZXQgY29sdW1uID0gdGhpcy5fYWRqdXN0Q29sdW1uKGxpbmUsIGZyYW1lLmNvbHVtbik7XG5cblx0XHRcdGxldCBvcmlnaW4gPSBsb2NhbGl6ZSgnb3JpZ2luLmZyb20ubm9kZScsIFwicmVhZC1vbmx5IGNvbnRlbnQgZnJvbSBOb2RlLmpzXCIpO1xuXG5cdFx0XHRjb25zdCBzY3JpcHRfdmFsID0gPFY4U2NyaXB0PiB0aGlzLl9nZXRWYWx1ZUZyb21DYWNoZShmcmFtZS5zY3JpcHQpO1xuXHRcdFx0aWYgKHNjcmlwdF92YWwpIHtcblx0XHRcdFx0bGV0IG5hbWUgPSBzY3JpcHRfdmFsLm5hbWU7XG5cblx0XHRcdFx0aWYgKG5hbWUpIHtcblxuXHRcdFx0XHRcdC8vIHN5c3RlbS5qcyBnZW5lcmF0ZXMgc2NyaXB0IG5hbWVzIHRoYXQgYXJlIGZpbGUgdXJsc1xuXHRcdFx0XHRcdGlmIChuYW1lLmluZGV4T2YoJ2ZpbGU6Ly8nKSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0bmFtZSA9IG5hbWUucmVwbGFjZSgnZmlsZTovLycsICcnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoUGF0aFV0aWxzLmlzQWJzb2x1dGVQYXRoKG5hbWUpKSB7XG5cblx0XHRcdFx0XHRcdGxldCByZW1vdGVQYXRoID0gbmFtZTtcdFx0Ly8gd2l0aCByZW1vdGUgZGVidWdnaW5nIHBhdGggbWlnaHQgY29tZSBmcm9tIGEgZGlmZmVyZW50IE9TXG5cblx0XHRcdFx0XHRcdC8vIGlmIGxhdW5jaC5qc29uIGRlZmluZXMgbG9jYWxSb290IGFuZCByZW1vdGVSb290IHRyeSB0byBjb252ZXJ0IHJlbW90ZSBwYXRoIGJhY2sgdG8gYSBsb2NhbCBwYXRoXG5cdFx0XHRcdFx0XHRsZXQgbG9jYWxQYXRoID0gdGhpcy5fcmVtb3RlVG9Mb2NhbChyZW1vdGVQYXRoKTtcblxuXHRcdFx0XHRcdFx0aWYgKGxvY2FsUGF0aCAhPT0gcmVtb3RlUGF0aCAmJiB0aGlzLl9hdHRhY2hNb2RlKSB7XG5cdFx0XHRcdFx0XHRcdC8vIGFzc3VtZSBhdHRhY2hlZCB0byByZW1vdGUgbm9kZSBwcm9jZXNzXG5cdFx0XHRcdFx0XHRcdG9yaWdpbiA9IGxvY2FsaXplKCdvcmlnaW4uZnJvbS5yZW1vdGUubm9kZScsIFwicmVhZC1vbmx5IGNvbnRlbnQgZnJvbSByZW1vdGUgTm9kZS5qc1wiKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bmFtZSA9IFBhdGguYmFzZW5hbWUobG9jYWxQYXRoKTtcblxuXHRcdFx0XHRcdFx0Ly8gc291cmNlIG1hcHBpbmdcblx0XHRcdFx0XHRcdGlmICh0aGlzLl9zb3VyY2VNYXBzKSB7XG5cblx0XHRcdFx0XHRcdFx0aWYgKCFGUy5leGlzdHNTeW5jKGxvY2FsUGF0aCkpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fbG9hZFNjcmlwdChzY3JpcHRfdmFsLmlkKS50aGVuKHNjcmlwdCA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlU3RhY2tGcmFtZUZyb21Tb3VyY2VNYXAoZnJhbWUsIHNjcmlwdC5jb250ZW50cywgbmFtZSwgbG9jYWxQYXRoLCByZW1vdGVQYXRoLCBvcmlnaW4sIGxpbmUsIGNvbHVtbik7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlU3RhY2tGcmFtZUZyb21Tb3VyY2VNYXAoZnJhbWUsIG51bGwsIG5hbWUsIGxvY2FsUGF0aCwgcmVtb3RlUGF0aCwgb3JpZ2luLCBsaW5lLCBjb2x1bW4pO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlU3RhY2tGcmFtZUZyb21QYXRoKGZyYW1lLCBuYW1lLCBsb2NhbFBhdGgsIHJlbW90ZVBhdGgsIG9yaWdpbiwgbGluZSwgY29sdW1uKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBpZiB3ZSBlbmQgdXAgaGVyZSwgJ25hbWUnIGlzIGFuIGludGVybmFsIG1vZHVsZVxuIFx0XHRcdFx0XHRvcmlnaW4gPSBsb2NhbGl6ZSgnb3JpZ2luLmNvcmUubW9kdWxlJywgXCJyZWFkLW9ubHkgY29yZSBtb2R1bGVcIik7XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBpZiBhIGZ1bmN0aW9uIGlzIGR5bmFtaWNhbGx5IGNyZWF0ZWQgZnJvbSBhIHN0cmluZywgaXRzIHNjcmlwdCBoYXMgbm8gbmFtZS5cblx0XHRcdFx0XHQvLyBjcmVhdGUgYSBuYW1lIGJ5IHVzaW5nIHRoZSBzY3JpcHQgaWQgYW5kIGFwcGVuZCBcIi5qc1wiIHNvIHRoYXQgSmF2YVNjcmlwdCBjb250ZW50cyBpcyBkZXRlY3RlZC5cblx0XHRcdFx0XHRuYW1lID0gYFZNJHtzY3JpcHRfdmFsLmlkfS5qc2A7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBzb3VyY2Ugbm90IGZvdW5kIGxvY2FsbHkgLT4gcHJlcGFyZSB0byBzdHJlYW0gc291cmNlIGNvbnRlbnQgZnJvbSBub2RlIGJhY2tlbmQuXG5cdFx0XHRcdGNvbnN0IHNvdXJjZUhhbmRsZSA9IHRoaXMuX3NvdXJjZUhhbmRsZXMuY3JlYXRlKG5ldyBTb3VyY2VTb3VyY2Uoc2NyaXB0X3ZhbC5pZCkpO1xuXHRcdFx0XHRjb25zdCBzcmMgPSBuZXcgU291cmNlKG5hbWUsIG51bGwsIHNvdXJjZUhhbmRsZSwgb3JpZ2luKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2NyZWF0ZVN0YWNrRnJhbWVGcm9tU291cmNlKGZyYW1lLCBzcmMsIGxpbmUsIGNvbHVtbik7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzLl9jcmVhdGVTdGFja0ZyYW1lRnJvbVNvdXJjZShmcmFtZSwgbnVsbCwgbGluZSwgY29sdW1uKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgU3RhY2tGcmFtZSB3aGVuIHNvdXJjZSBtYXBzIGFyZSBpbnZvbHZlZC5cblx0ICovXG5cdHByaXZhdGUgX2NyZWF0ZVN0YWNrRnJhbWVGcm9tU291cmNlTWFwKGZyYW1lOiBWOEZyYW1lLCBjb250ZW50OiBzdHJpbmcsIG5hbWU6IHN0cmluZywgbG9jYWxQYXRoOiBzdHJpbmcsIHJlbW90ZVBhdGg6IHN0cmluZywgb3JpZ2luOiBzdHJpbmcsIGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIpIDogU3RhY2tGcmFtZSB7XG5cblx0XHQvLyB0cnkgdG8gbWFwXG5cdFx0bGV0IG1hcHJlc3VsdCA9IHRoaXMuX3NvdXJjZU1hcHMuTWFwVG9Tb3VyY2UobG9jYWxQYXRoLCBjb250ZW50LCBsaW5lLCBjb2x1bW4sIEJpYXMuR1JFQVRFU1RfTE9XRVJfQk9VTkQpO1xuXHRcdGlmICghbWFwcmVzdWx0KSB7XHQvLyB0cnkgdXNpbmcgdGhlIG90aGVyIGJpYXMgb3B0aW9uXG5cdFx0XHRtYXByZXN1bHQgPSB0aGlzLl9zb3VyY2VNYXBzLk1hcFRvU291cmNlKGxvY2FsUGF0aCwgY29udGVudCwgbGluZSwgY29sdW1uLCBCaWFzLkxFQVNUX1VQUEVSX0JPVU5EKTtcblx0XHR9XG5cdFx0aWYgKG1hcHJlc3VsdCkge1xuXHRcdFx0dGhpcy5sb2coJ3NtJywgYF9jcmVhdGVTdGFja0ZyYW1lOiBnZW46ICcke2xvY2FsUGF0aH0nICR7bGluZX06JHtjb2x1bW59IC0+IHNyYzogJyR7bWFwcmVzdWx0LnBhdGh9JyAke21hcHJlc3VsdC5saW5lfToke21hcHJlc3VsdC5jb2x1bW59YCk7XG5cblx0XHRcdC8vIHZlcmlmeSB0aGF0IGEgZmlsZSBleGlzdHMgYXQgcGF0aFxuXHRcdFx0aWYgKEZTLmV4aXN0c1N5bmMobWFwcmVzdWx0LnBhdGgpKSB7XG5cblx0XHRcdFx0Ly8gdXNlIHRoaXMgbWFwcGluZ1xuXHRcdFx0XHRjb25zdCBzcmMgPSBuZXcgU291cmNlKFBhdGguYmFzZW5hbWUobWFwcmVzdWx0LnBhdGgpLCB0aGlzLmNvbnZlcnREZWJ1Z2dlclBhdGhUb0NsaWVudChtYXByZXN1bHQucGF0aCkpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlU3RhY2tGcmFtZUZyb21Tb3VyY2UoZnJhbWUsIHNyYywgbWFwcmVzdWx0LmxpbmUsIG1hcHJlc3VsdC5jb2x1bW4pO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBmaWxlIGRvZXNuJ3QgZXhpc3QgYXQgcGF0aFxuXHRcdFx0XHQvLyBpZiBzb3VyY2UgbWFwIGhhcyBpbmxpbmVkIHNvdXJjZSB1c2UgaXRcblx0XHRcdFx0aWYgKG1hcHJlc3VsdC5jb250ZW50KSB7XG5cblx0XHRcdFx0XHR0aGlzLmxvZygnc20nLCBgX2NyZWF0ZVN0YWNrRnJhbWU6IHNvdXJjZSAnJHttYXByZXN1bHQucGF0aH0nIGRvZXNuJ3QgZXhpc3QgLT4gdXNlIGlubGluZWQgc291cmNlYCk7XG5cdFx0XHRcdFx0Y29uc3Qgc291cmNlSGFuZGxlID0gdGhpcy5fc291cmNlSGFuZGxlcy5jcmVhdGUobmV3IFNvdXJjZVNvdXJjZSgwLCBtYXByZXN1bHQuY29udGVudCkpO1xuXHRcdFx0XHRcdG9yaWdpbiA9IGxvY2FsaXplKCdvcmlnaW4uaW5saW5lZC5zb3VyY2UubWFwJywgXCJyZWFkLW9ubHkgaW5saW5lZCBjb250ZW50IGZyb20gc291cmNlIG1hcFwiKTtcblx0XHRcdFx0XHRjb25zdCBzcmMgPSBuZXcgU291cmNlKFBhdGguYmFzZW5hbWUobWFwcmVzdWx0LnBhdGgpLCBudWxsLCBzb3VyY2VIYW5kbGUsIG9yaWdpbiwgeyBpbmxpbmVQYXRoOiBtYXByZXN1bHQucGF0aCB9KTtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlU3RhY2tGcmFtZUZyb21Tb3VyY2UoZnJhbWUsIHNyYywgbWFwcmVzdWx0LmxpbmUsIG1hcHJlc3VsdC5jb2x1bW4pO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5sb2coJ3NtJywgYF9jcmVhdGVTdGFja0ZyYW1lOiBzb3VyY2UgZG9lc24ndCBleGlzdCBhbmQgbm8gaW5saW5lZCBzb3VyY2UgLT4gdXNlIGdlbmVyYXRlZCBmaWxlYCk7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuX2NyZWF0ZVN0YWNrRnJhbWVGcm9tUGF0aChmcmFtZSwgbmFtZSwgbG9jYWxQYXRoLCByZW1vdGVQYXRoLCBvcmlnaW4sIGxpbmUsIGNvbHVtbik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHRoaXMubG9nKCdzbScsIGBfY3JlYXRlU3RhY2tGcmFtZUZyb21Tb3VyY2VNYXA6IGdlbjogJyR7bG9jYWxQYXRofScgJHtsaW5lfToke2NvbHVtbn0gLT4gY291bGRuJ3QgYmUgbWFwcGVkIHRvIHNvdXJjZSAtPiB1c2UgZ2VuZXJhdGVkIGZpbGVgKTtcblx0XHRcdHJldHVybiB0aGlzLl9jcmVhdGVTdGFja0ZyYW1lRnJvbVBhdGgoZnJhbWUsIG5hbWUsIGxvY2FsUGF0aCwgcmVtb3RlUGF0aCwgb3JpZ2luLCBsaW5lLCBjb2x1bW4pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgU3RhY2tGcmFtZSBmcm9tIHRoZSBnaXZlbiBsb2NhbCBwYXRoLlxuXHQgKiBUaGUgcmVtb3RlIHBhdGggaXMgdXNlZCBpZiB0aGUgbG9jYWwgcGF0aCBkb2Vzbid0IGV4aXN0LlxuXHQgKi9cblx0cHJpdmF0ZSBfY3JlYXRlU3RhY2tGcmFtZUZyb21QYXRoKGZyYW1lOiBWOEZyYW1lLCBuYW1lOiBzdHJpbmcsIGxvY2FsUGF0aDogc3RyaW5nLCByZW1vdGVQYXRoOiBzdHJpbmcsIG9yaWdpbjogc3RyaW5nLCBsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKcKgOiBTdGFja0ZyYW1lIHtcblx0XHRsZXQgc3JjOiBTb3VyY2U7XG5cdFx0aWYgKEZTLmV4aXN0c1N5bmMobG9jYWxQYXRoKSkge1xuXHRcdFx0c3JjID0gbmV3IFNvdXJjZShuYW1lLCB0aGlzLmNvbnZlcnREZWJ1Z2dlclBhdGhUb0NsaWVudChsb2NhbFBhdGgpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gZmFsbCBiYWNrOiBzb3VyY2Ugbm90IGZvdW5kIGxvY2FsbHkgLT4gcHJlcGFyZSB0byBzdHJlYW0gc291cmNlIGNvbnRlbnQgZnJvbSByZW1vdGUgbm9kZS5cblx0XHRcdGNvbnN0IHNjcmlwdF92YWwgPSA8VjhTY3JpcHQ+IHRoaXMuX2dldFZhbHVlRnJvbUNhY2hlKGZyYW1lLnNjcmlwdCk7XG5cdFx0XHRjb25zdCBzY3JpcHRfaWQgPSBzY3JpcHRfdmFsLmlkO1xuXHRcdFx0Y29uc3Qgc291cmNlSGFuZGxlID0gdGhpcy5fc291cmNlSGFuZGxlcy5jcmVhdGUobmV3IFNvdXJjZVNvdXJjZShzY3JpcHRfaWQpKTtcblx0XHRcdHNyYyA9IG5ldyBTb3VyY2UobmFtZSwgbnVsbCwgc291cmNlSGFuZGxlLCBvcmlnaW4sIHsgcmVtb3RlUGF0aDogcmVtb3RlUGF0aFx0fSk7XHQvLyBhc3N1bWUgaXQgaXMgYSByZW1vdGUgcGF0aFxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlU3RhY2tGcmFtZUZyb21Tb3VyY2UoZnJhbWUsIHNyYywgbGluZSwgY29sdW1uKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgU3RhY2tGcmFtZSB3aXRoIHRoZSBnaXZlbiBzb3VyY2UgbG9jYXRpb24gaW5mb3JtYXRpb24uXG5cdCAqIFRoZSBuYW1lIG9mIHRoZSBmcmFtZSBpcyBleHRyYWN0ZWQgZnJvbSB0aGUgZnJhbWUuXG5cdCAqL1xuXHRwcml2YXRlIF9jcmVhdGVTdGFja0ZyYW1lRnJvbVNvdXJjZShmcmFtZTogVjhGcmFtZSwgc3JjOiBTb3VyY2UsIGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIpwqA6IFN0YWNrRnJhbWUge1xuXG5cdFx0bGV0IGZ1bmNfbmFtZTogc3RyaW5nO1xuXHRcdGNvbnN0IGZ1bmNfdmFsID0gPFY4RnVuY3Rpb24+IHRoaXMuX2dldFZhbHVlRnJvbUNhY2hlKGZyYW1lLmZ1bmMpO1xuXHRcdGlmIChmdW5jX3ZhbCkge1xuXHRcdFx0ZnVuY19uYW1lID0gZnVuY192YWwuaW5mZXJyZWROYW1lO1xuXHRcdFx0aWYgKCFmdW5jX25hbWUgfHwgZnVuY19uYW1lLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRmdW5jX25hbWUgPSBmdW5jX3ZhbC5uYW1lO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoIWZ1bmNfbmFtZSB8fCBmdW5jX25hbWUubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRmdW5jX25hbWUgPSBsb2NhbGl6ZSgnYW5vbnltb3VzLmZ1bmN0aW9uJywgXCIoYW5vbnltb3VzIGZ1bmN0aW9uKVwiKTtcblx0XHR9XG5cblx0XHRjb25zdCBmcmFtZVJlZmVyZW5jZSA9IHRoaXMuX2ZyYW1lSGFuZGxlcy5jcmVhdGUoZnJhbWUpO1xuXHRcdHJldHVybiBuZXcgU3RhY2tGcmFtZShmcmFtZVJlZmVyZW5jZSwgZnVuY19uYW1lLCBzcmMsIHRoaXMuY29udmVydERlYnVnZ2VyTGluZVRvQ2xpZW50KGxpbmUpLCB0aGlzLmNvbnZlcnREZWJ1Z2dlckNvbHVtblRvQ2xpZW50KGNvbHVtbikpO1xuXHR9XG5cbi8qXG5cdC8vIHZlcmlmeSB0aGF0IHRoZSBmaWxlIG9uIGRpc2sgaXMgcmVhbGx5IHRoZSBzYW1lIGFzIHRoZSBleGVjdXRlZCBjb250ZW50XG5cdHByaXZhdGUgX3NhbWVGaWxlKHBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZykgOiBQcm9taXNlPGJvb2xlYW4+IHtcblxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgoY29tcGxldGVEaXNwYXRjaCwgZXJyb3JEaXNwYXRjaCkgPT4ge1xuXHRcdFx0RlMucmVhZEZpbGUocGF0aCwgJ3V0ZjgnLCAoZXJyLCBmaWxlQ29udGVudHMpID0+IHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdGVycm9yRGlzcGF0Y2goZXJyKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyByZW1vdmUgYW4gb3B0aW9uYWwgc2hlYmFuZ1xuXHRcdFx0XHRcdGZpbGVDb250ZW50cyA9IGZpbGVDb250ZW50cy5yZXBsYWNlKC9eIyEuKlxcbi8sICcnKTtcblxuXHRcdFx0XHRcdC8vIHRyeSB0byBsb2NhdGUgdGhlIGZpbGUgY29udGVudHMgaW4gdGhlIGV4ZWN1dGVkIGNvbnRlbnRzXG5cdFx0XHRcdFx0Y29uc3QgcG9zID0gY29udGVudHMuaW5kZXhPZihmaWxlQ29udGVudHMpO1xuXHRcdFx0XHRcdGNvbXBsZXRlRGlzcGF0Y2gocG9zID49IDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIHZlcmlmeSB0aGF0IHRoZSBmaWxlIG9uIGRpc2sgaXMgcmVhbGx5IHRoZSBzYW1lIGFzIHRoZSBleGVjdXRlZCBjb250ZW50XG5cdHByaXZhdGUgX3NhbWVGaWxlMihwYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcpIDogYm9vbGVhbiB7XG5cblx0XHRsZXQgZmlsZUNvbnRlbnRzID0gRlMucmVhZEZpbGVTeW5jKHBhdGgsICd1dGY4Jyk7XG5cdFx0Ly8gcmVtb3ZlIGFuIG9wdGlvbmFsIHNoZWJhbmdcblx0XHRmaWxlQ29udGVudHMgPSBmaWxlQ29udGVudHMucmVwbGFjZSgvXiMhLipcXG4vLCAnJyk7XG5cblx0XHQvLyB0cnkgdG8gbG9jYXRlIHRoZSBmaWxlIGNvbnRlbnRzIGluIHRoZSBleGVjdXRlZCBjb250ZW50c1xuXHRcdGNvbnN0IHBvcyA9IGNvbnRlbnRzLmluZGV4T2YoZmlsZUNvbnRlbnRzKTtcblx0XHRyZXR1cm4gcG9zID49IDA7XG5cdH1cbiovXG5cblx0Ly8tLS0gc2NvcGVzIHJlcXVlc3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0cHJpdmF0ZSBzdGF0aWMgU0NPUEVfTkFNRVMgPSBbXG5cdFx0bG9jYWxpemUoeyBrZXk6ICdzY29wZS5nbG9iYWwnLCBjb21tZW50OiBbJ2h0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvdnNjb2RlL2lzc3Vlcy80NTY5J10gfSwgXCJHbG9iYWxcIiksXG5cdFx0bG9jYWxpemUoeyBrZXk6ICdzY29wZS5sb2NhbCcsIGNvbW1lbnQ6IFsnaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC92c2NvZGUvaXNzdWVzLzQ1NjknXSB9LCBcIkxvY2FsXCIpLFxuXHRcdGxvY2FsaXplKHsga2V5OiAnc2NvcGUud2l0aCcsIGNvbW1lbnQ6IFsnaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC92c2NvZGUvaXNzdWVzLzQ1NjknXSB9LCBcIldpdGhcIiksXG5cdFx0bG9jYWxpemUoeyBrZXk6ICdzY29wZS5jbG9zdXJlJywgY29tbWVudDogWydodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L3ZzY29kZS9pc3N1ZXMvNDU2OSddIH0sIFwiQ2xvc3VyZVwiKSxcblx0XHRsb2NhbGl6ZSh7IGtleTogJ3Njb3BlLmNhdGNoJywgY29tbWVudDogWydodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L3ZzY29kZS9pc3N1ZXMvNDU2OSddIH0sIFwiQ2F0Y2hcIiksXG5cdFx0bG9jYWxpemUoeyBrZXk6ICdzY29wZS5ibG9jaycsIGNvbW1lbnQ6IFsnaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC92c2NvZGUvaXNzdWVzLzQ1NjknXSB9LCBcIkJsb2NrXCIpLFxuXHRcdGxvY2FsaXplKHsga2V5OiAnc2NvcGUuc2NyaXB0JywgY29tbWVudDogWydodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L3ZzY29kZS9pc3N1ZXMvNDU2OSddIH0sIFwiU2NyaXB0XCIpXG5cdF07XG5cblx0cHJvdGVjdGVkIHNjb3Blc1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuU2NvcGVzUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU2NvcGVzQXJndW1lbnRzKTogdm9pZCB7XG5cblx0XHRjb25zdCBmcmFtZSA9IHRoaXMuX2ZyYW1lSGFuZGxlcy5nZXQoYXJncy5mcmFtZUlkKTtcblx0XHRpZiAoIWZyYW1lKSB7XG5cdFx0XHR0aGlzLnNlbmRFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAyMDIwLCAnc3RhY2sgZnJhbWUgbm90IHZhbGlkJywgbnVsbCwgRXJyb3JEZXN0aW5hdGlvbi5UZWxlbWV0cnkpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCBmcmFtZUl4ID0gZnJhbWUuaW5kZXg7XG5cdFx0Y29uc3QgZnJhbWVUaGlzID0gPFY4T2JqZWN0PiB0aGlzLl9nZXRWYWx1ZUZyb21DYWNoZShmcmFtZS5yZWNlaXZlcik7XG5cblx0XHRjb25zdCBzY29wZXNBcmdzOiBhbnkgPSB7XG5cdFx0XHRmcmFtZV9pbmRleDogZnJhbWVJeCxcblx0XHRcdGZyYW1lTnVtYmVyOiBmcmFtZUl4XG5cdFx0fTtcblx0XHRsZXQgY21kID0gJ3Njb3Blcyc7XG5cblx0XHRpZiAodGhpcy5fbm9kZUluamVjdGlvbkF2YWlsYWJsZSkge1xuXHRcdFx0Y21kID0gJ3ZzY29kZV9zY29wZXMnO1xuXHRcdFx0c2NvcGVzQXJncy5tYXhMb2NhbHMgPSB0aGlzLl9jaHVua1NpemU7XG5cdFx0fVxuXG5cdFx0dGhpcy5sb2coJ3ZhJywgYHNjb3Blc1JlcXVlc3Q6IHNjb3BlICR7ZnJhbWVJeH1gKTtcblx0XHR0aGlzLl9ub2RlLmNvbW1hbmQyKGNtZCwgc2NvcGVzQXJncykudGhlbigoc2NvcGVzUmVzcG9uc2U6IFY4U2NvcGVSZXNwb25zZSkgPT4ge1xuXG5cdFx0XHRjb25zdCBzY29wZXMgOiBWOFNjb3BlW10gPSBzY29wZXNSZXNwb25zZS5ib2R5LnNjb3BlcztcblxuXHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKHNjb3Blcy5tYXAoc2NvcGUgPT4ge1xuXHRcdFx0XHRjb25zdCB0eXBlID0gc2NvcGUudHlwZTtcblx0XHRcdFx0Y29uc3QgZXh0cmEgPSB0eXBlID09PSAxID8gZnJhbWVUaGlzIDogbnVsbDtcblx0XHRcdFx0bGV0IGV4cGVuc2l2ZSA9IHR5cGUgPT09IDA7XHQvLyBnbG9iYWwgc2NvcGUgaXMgZXhwZW5zaXZlXG5cblx0XHRcdFx0bGV0IHNjb3BlTmFtZTogc3RyaW5nO1xuXHRcdFx0XHRpZiAodHlwZSA+PSAwICYmIHR5cGUgPCBOb2RlRGVidWdTZXNzaW9uLlNDT1BFX05BTUVTLmxlbmd0aCkge1xuXHRcdFx0XHRcdGlmICh0eXBlID09PSAxICYmIHR5cGVvZiBzY29wZXNSZXNwb25zZS5ib2R5LnZzY29kZV9sb2NhbHMgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0XHRleHBlbnNpdmUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0c2NvcGVOYW1lID0gbG9jYWxpemUoeyBrZXk6ICdzY29wZS5sb2NhbC53aXRoLmNvdW50JywgY29tbWVudDogWydodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L3ZzY29kZS9pc3N1ZXMvNDU2OSddIH0sXG5cdFx0XHRcdFx0XHRcdFwiTG9jYWwgKHswfSBvZiB7MX0pXCIsIHNjb3Blc0FyZ3MubWF4TG9jYWxzLCBzY29wZXNSZXNwb25zZS5ib2R5LnZzY29kZV9sb2NhbHMpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzY29wZU5hbWUgPSBOb2RlRGVidWdTZXNzaW9uLlNDT1BFX05BTUVTW3R5cGVdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzY29wZU5hbWUgPSBsb2NhbGl6ZSgnc2NvcGUudW5rbm93bicsIFwiVW5rbm93biBTY29wZSBUeXBlOiB7MH1cIiwgdHlwZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fcmVzb2x2ZVZhbHVlcyggWyBzY29wZS5vYmplY3QgXSApLnRoZW4ocmVzb2x2ZWQgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBuZXcgU2NvcGUoc2NvcGVOYW1lLCB0aGlzLl92YXJpYWJsZUhhbmRsZXMuY3JlYXRlKG5ldyBTY29wZUNvbnRhaW5lcihzY29wZSwgcmVzb2x2ZWRbMF0sIGV4dHJhKSksIGV4cGVuc2l2ZSk7XG5cdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gbmV3IFNjb3BlKHNjb3BlTmFtZSwgMCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSkpO1xuXG5cdFx0fSkudGhlbihzY29wZXMgPT4ge1xuXG5cdFx0XHQvLyBleGNlcHRpb24gc2NvcGVcblx0XHRcdGlmIChmcmFtZUl4ID09PSAwICYmIHRoaXMuX2V4Y2VwdGlvbikge1xuXHRcdFx0XHRzY29wZXMudW5zaGlmdChuZXcgU2NvcGUobG9jYWxpemUoeyBrZXk6ICdzY29wZS5leGNlcHRpb24nLCBjb21tZW50OiBbJ2h0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvdnNjb2RlL2lzc3Vlcy80NTY5J10gfSwgXCJFeGNlcHRpb25cIiksIHRoaXMuX3ZhcmlhYmxlSGFuZGxlcy5jcmVhdGUobmV3IFByb3BlcnR5Q29udGFpbmVyKHRoaXMuX2V4Y2VwdGlvbikpKSk7XG5cdFx0XHR9XG5cblx0XHRcdHJlc3BvbnNlLmJvZHkgPSB7XG5cdFx0XHRcdHNjb3Blczogc2NvcGVzXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0Ly8gaW4gY2FzZSBvZiBlcnJvciByZXR1cm4gZW1wdHkgc2NvcGVzIGFycmF5XG5cdFx0XHRyZXNwb25zZS5ib2R5ID0geyBzY29wZXM6IFtdIH07XG5cdFx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLy0tLSB2YXJpYWJsZXMgcmVxdWVzdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwcm90ZWN0ZWQgdmFyaWFibGVzUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5WYXJpYWJsZXNSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5WYXJpYWJsZXNBcmd1bWVudHMpOiB2b2lkIHtcblx0XHRjb25zdCByZWZlcmVuY2UgPSBhcmdzLnZhcmlhYmxlc1JlZmVyZW5jZTtcblx0XHRjb25zdCB2YXJpYWJsZXNDb250YWluZXIgPSB0aGlzLl92YXJpYWJsZUhhbmRsZXMuZ2V0KHJlZmVyZW5jZSk7XG5cdFx0aWYgKHZhcmlhYmxlc0NvbnRhaW5lcikge1xuXHRcdFx0dmFyaWFibGVzQ29udGFpbmVyLkV4cGFuZCh0aGlzKS50aGVuKHZhcmlhYmxlcyA9PiB7XG5cdFx0XHRcdHZhcmlhYmxlcy5zb3J0KE5vZGVEZWJ1Z1Nlc3Npb24uY29tcGFyZVZhcmlhYmxlTmFtZXMpO1xuXHRcdFx0XHRyZXNwb25zZS5ib2R5ID0ge1xuXHRcdFx0XHRcdHZhcmlhYmxlczogdmFyaWFibGVzXG5cdFx0XHRcdH07XG5cdFx0XHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0XHRcdH0pLmNhdGNoKGVyciA9PiB7XG5cdFx0XHRcdC8vIGluIGNhc2Ugb2YgZXJyb3IgcmV0dXJuIGVtcHR5IHZhcmlhYmxlcyBhcnJheVxuXHRcdFx0XHRyZXNwb25zZS5ib2R5ID0ge1xuXHRcdFx0XHRcdHZhcmlhYmxlczogW11cblx0XHRcdFx0fTtcblx0XHRcdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIG5vIGNvbnRhaW5lciBmb3VuZDogcmV0dXJuIGVtcHR5IHZhcmlhYmxlcyBhcnJheVxuXHRcdFx0cmVzcG9uc2UuYm9keSA9IHtcblx0XHRcdFx0dmFyaWFibGVzOiBbXVxuXHRcdFx0fTtcblx0XHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0XHR9XG5cdH1cblxuXHQvKlxuXHQgKiBSZXR1cm5zIGluZGV4ZWQgb3IgbmFtZWQgcHJvcGVydGllcyBmb3IgdGhlIGdpdmVuIHN0cnVjdHVyZWQgb2JqZWN0IGFzIGEgdmFyaWFibGVzIGFycmF5LlxuXHQgKiBUaGVyZSBhcmUgdGhyZWUgbW9kZXM6XG5cdCAqICdhbGwnOiBhZGQgYWxsIHByb3BlcnRpZXMgKGluZGV4ZWQgYW5kIG5hbWVkKVxuXHQgKiAncmFuZ2UnOiBhZGQgJ2NvdW50JyBpbmRleGVkIHByb3BlcnRpZXMgc3RhcnRpbmcgYXQgJ3N0YXJ0J1xuXHQgKiAnbmFtZWQnOiBhZGQgb25seSB0aGUgbmFtZWQgcHJvcGVydGllcy5cblx0ICovXG5cdHB1YmxpYyBfY3JlYXRlUHJvcGVydGllcyhvYmo6IFY4T2JqZWN0LCBtb2RlOiAnbmFtZWQnIHwgJ3JhbmdlJyB8ICdhbGwnLCBzdGFydCA9IDAsIGNvdW50ID0gMCkgOiBQcm9taXNlPFZhcmlhYmxlW10+IHtcblxuXHRcdGlmIChvYmogJiYgIW9iai5wcm9wZXJ0aWVzKSB7XG5cblx0XHRcdC8vIGlmIHByb3BlcnRpZXMgYXJlIG1pc3NpbmcsIHRoaXMgaXMgYW4gaW5kaWNhdGlvbiB0aGF0IHdlIGFyZSBydW5uaW5nIGluamVjdGVkIGNvZGUgd2hpY2ggZG9lc24ndCByZXR1cm4gdGhlIHByb3BlcnRpZXMgZm9yIGxhcmdlIG9iamVjdHNcblxuXHRcdFx0aWYgKHRoaXMuX25vZGVJbmplY3Rpb25BdmFpbGFibGUpIHtcblx0XHRcdFx0Y29uc3QgaGFuZGxlID0gb2JqLmhhbmRsZTtcblx0XHRcdFx0c3dpdGNoIChtb2RlKSB7XG5cdFx0XHRcdFx0Y2FzZSAncmFuZ2UnOlxuXHRcdFx0XHRcdGNhc2UgJ2FsbCc6XG5cdFx0XHRcdFx0XHQvLyB0cnkgdG8gdXNlIFwidnNjb2RlX3NpemVcIiBmcm9tIGluamVjdGVkIGNvZGVcblx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygb2JqLnZzY29kZV9zaXplID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgaGFuZGxlID09PSAnbnVtYmVyJyAmJiBoYW5kbGUgIT09IDApIHtcblx0XHRcdFx0XHRcdFx0aWYgKG9iai52c2NvZGVfc2l6ZSA+PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5sb2coJ3ZhJywgYF9jcmVhdGVQcm9wZXJ0aWVzOiB2c2NvZGVfc2xpY2UgJHtzdGFydH0gJHtjb3VudH1gKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fbm9kZS5jb21tYW5kMigndnNjb2RlX3NsaWNlJywgeyBoYW5kbGU6IGhhbmRsZSwgc3RhcnQ6IHN0YXJ0LCBjb3VudDogY291bnQgfSkudGhlbihyZXNwID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGl0ZW1zID0gcmVzcC5ib2R5LnJlc3VsdDtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLmFsbDxWYXJpYWJsZT4oaXRlbXMubWFwKGl0ZW0gPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlVmFyaWFibGUoYFske2l0ZW0ubmFtZX1dYCwgaXRlbS52YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9KSk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAnbmFtZWQnOlxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBvYmoudnNjb2RlX3NpemUgPT09ICdudW1iZXInICYmIHR5cGVvZiBoYW5kbGUgPT09ICdudW1iZXInICYmIGhhbmRsZSAhPT0gMCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmxvZygndmEnLCBgX2NyZWF0ZVByb3BlcnRpZXM6IHZzY29kZV9zbGljZWApO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fbm9kZS5jb21tYW5kMigndnNjb2RlX3NsaWNlJywgeyBoYW5kbGU6IGhhbmRsZSwgY291bnQ6IGNvdW50IH0pLnRoZW4ocmVzcCA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbXMgPSByZXNwLmJvZHkucmVzdWx0O1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLmFsbDxWYXJpYWJsZT4oaXRlbXMubWFwKGl0ZW0gPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuX2NyZWF0ZVZhcmlhYmxlKGl0ZW0ubmFtZSwgaXRlbS52YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0fSkpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGlmIHdlIGVuZCB1cCBoZXJlLCBzb21ldGhpbmcgd2VudCB3cm9uZy4uLlxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc2VsZWN0ZWRQcm9wZXJ0aWVzID0gbmV3IEFycmF5PFY4UHJvcGVydHk+KCk7XG5cblx0XHRsZXQgZm91bmRfcHJvdG8gPSBmYWxzZTtcblx0XHRmb3IgKGxldCBwcm9wZXJ0eSBvZiBvYmoucHJvcGVydGllcykge1xuXG5cdFx0XHRpZiAoJ25hbWUnIGluIHByb3BlcnR5KSB7XHQvLyBidWcgIzE5NjU0OiBvbmx5IGV4dHJhY3QgcHJvcGVydGllcyB3aXRoIGEgbmFtZVxuXG5cdFx0XHRcdGNvbnN0IG5hbWUgPSBwcm9wZXJ0eS5uYW1lO1xuXG5cdFx0XHRcdGlmIChuYW1lID09PSBOb2RlRGVidWdTZXNzaW9uLlBST1RPKSB7XG5cdFx0XHRcdFx0Zm91bmRfcHJvdG8gPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c3dpdGNoIChtb2RlKSB7XG5cdFx0XHRcdFx0Y2FzZSAnYWxsJzpcblx0XHRcdFx0XHRcdHNlbGVjdGVkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5KTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ25hbWVkJzpcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdFx0c2VsZWN0ZWRQcm9wZXJ0aWVzLnB1c2gocHJvcGVydHkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAncmFuZ2UnOlxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBuYW1lID09PSAnbnVtYmVyJyAmJiBuYW1lID49IHN0YXJ0ICYmIG5hbWUgPCBzdGFydCtjb3VudCkge1xuXHRcdFx0XHRcdFx0XHRzZWxlY3RlZFByb3BlcnRpZXMucHVzaChwcm9wZXJ0eSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGRvIHdlIGhhdmUgdG8gYWRkIHRoZSBwcm90b09iamVjdCB0byB0aGUgbGlzdCBvZiBwcm9wZXJ0aWVzP1xuXHRcdGlmICghZm91bmRfcHJvdG8gJiYgKG1vZGUgPT09ICdhbGwnIHx8IG1vZGUgPT09ICduYW1lZCcpKSB7XG5cdFx0XHRjb25zdCBoID0gb2JqLmhhbmRsZTtcblx0XHRcdGlmIChoID4gMCkgeyAgICAvLyBvbmx5IGFkZCBpZiBub3QgYW4gaW50ZXJuYWwgZGVidWdnZXIgb2JqZWN0XG5cdFx0XHRcdCg8YW55Pm9iai5wcm90b09iamVjdCkubmFtZSA9IE5vZGVEZWJ1Z1Nlc3Npb24uUFJPVE87XG5cdFx0XHRcdHNlbGVjdGVkUHJvcGVydGllcy5wdXNoKDxWOFByb3BlcnR5Pm9iai5wcm90b09iamVjdCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX2NyZWF0ZVByb3BlcnR5VmFyaWFibGVzKG9iaiwgc2VsZWN0ZWRQcm9wZXJ0aWVzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXNvbHZlcyB0aGUgZ2l2ZW4gcHJvcGVydGllcyBhbmQgcmV0dXJucyB0aGVtIGFzIGFuIGFycmF5IG9mIFZhcmlhYmxlcy5cblx0ICogSWYgdGhlIHByb3BlcnRpZXMgYXJlIGluZGV4ZWQgKG9wcG9zZWQgdG8gbmFtZWQpLCBhIHZhbHVlICdzdGFydCcgaXMgYWRkZWQgdG8gdGhlIGluZGV4IG51bWJlci5cblx0ICogJ25vQnJhY2tldHMnIGNvbnRyb2xzIHdoZXRoZXIgdGhlIGluZGV4IGlzIGVuY2xvc2VkIGluIGJyYWNrZXRzLlxuXHQgKiBJZiBhIHZhbHVlIGlzIHVuZGVmaW5lZCBpdCBwcm9iZXMgZm9yIGEgZ2V0dGVyLlxuXHQgKi9cblx0cHJpdmF0ZSBfY3JlYXRlUHJvcGVydHlWYXJpYWJsZXMob2JqOiBWOE9iamVjdCwgcHJvcGVydGllczogVjhQcm9wZXJ0eVtdLCBzdGFydD86IG51bWJlciwgbm9CcmFja2V0cz86IGJvb2xlYW4pIDogUHJvbWlzZTxWYXJpYWJsZVtdPiB7XG5cblx0XHRpZiAodHlwZW9mIHN0YXJ0ICE9PSAnbnVtYmVyJykge1xuXHRcdFx0c3RhcnQgPSAwO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9yZXNvbHZlVmFsdWVzKHByb3BlcnRpZXMpLnRoZW4oKCkgPT4ge1xuXHRcdFx0cmV0dXJuIFByb21pc2UuYWxsPFZhcmlhYmxlPihwcm9wZXJ0aWVzLm1hcChwcm9wZXJ0eSA9PiB7XG5cdFx0XHRcdGNvbnN0IHZhbCA9IDxWOE9iamVjdD4gdGhpcy5fZ2V0VmFsdWVGcm9tQ2FjaGUocHJvcGVydHkpO1xuXG5cdFx0XHRcdC8vIGNyZWF0ZSAnbmFtZSdcblx0XHRcdFx0bGV0IG5hbWU6IHN0cmluZztcblx0XHRcdFx0aWYgKHR5cGVvZiBwcm9wZXJ0eS5uYW1lID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdGNvbnN0IGl4ID0gK3Byb3BlcnR5Lm5hbWU7XG5cdFx0XHRcdFx0bmFtZSA9IG5vQnJhY2tldHMgPyBgJHtzdGFydCtpeH1gIDogYFske3N0YXJ0K2l4fV1gO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5hbWUgPSA8c3RyaW5nPiBwcm9wZXJ0eS5uYW1lO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gaWYgdmFsdWUgJ3VuZGVmaW5lZCcgdHJpZ2dlciBhIGdldHRlclxuXHRcdFx0XHRpZiAodmFsLnR5cGUgPT09ICd1bmRlZmluZWQnICYmICF2YWwudmFsdWUgJiYgb2JqKSB7XG5cblx0XHRcdFx0XHRjb25zdCBhcmdzID0ge1xuXHRcdFx0XHRcdFx0ZXhwcmVzc2lvbjogYG9iai4ke25hbWV9YCxcdC8vIHRyaWdnZXIgY2FsbCB0byBnZXR0ZXJcblx0XHRcdFx0XHRcdGFkZGl0aW9uYWxfY29udGV4dDogW1xuXHRcdFx0XHRcdFx0XHR7IG5hbWU6ICdvYmonLCBoYW5kbGU6IG9iai5oYW5kbGUgfVxuXHRcdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRcdGRpc2FibGVfYnJlYWs6IHRydWUsXG5cdFx0XHRcdFx0XHRtYXhTdHJpbmdMZW5ndGg6IE5vZGVEZWJ1Z1Nlc3Npb24uTUFYX1NUUklOR19MRU5HVEhcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0dGhpcy5sb2coJ3ZhJywgYF9jcmVhdGVQcm9wZXJ0eVZhcmlhYmxlczogdHJpZ2dlciBnZXR0ZXJgKTtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fbm9kZS5ldmFsdWF0ZShhcmdzKS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLl9jcmVhdGVWYXJpYWJsZShuYW1lLCByZXNwb25zZS5ib2R5KTtcblx0XHRcdFx0XHR9KS5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG5ldyBWYXJpYWJsZShuYW1lLCAndW5kZWZpbmVkJyk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlVmFyaWFibGUobmFtZSwgdmFsKTtcblx0XHRcdFx0fVxuXHRcdFx0fSkpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIFZhcmlhYmxlIHdpdGggdGhlIGdpdmVuIG5hbWUgYW5kIHZhbHVlLlxuXHQgKiBGb3Igc3RydWN0dXJlZCB2YWx1ZXMgdGhlIHZhcmlhYmxlIG9iamVjdCB3aWxsIGhhdmUgYSBjb3JyZXNwb25kaW5nIGV4cGFuZGVyLlxuXHQgKi9cblx0cHVibGljIF9jcmVhdGVWYXJpYWJsZShuYW1lOiBzdHJpbmcsIHZhbDogVjhIYW5kbGUpIDogUHJvbWlzZTxWYXJpYWJsZT4ge1xuXG5cdFx0aWYgKCF2YWwpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cdFx0fVxuXG5cdFx0c3dpdGNoICh2YWwudHlwZSkge1xuXG5cdFx0XHRjYXNlICd1bmRlZmluZWQnOlxuXHRcdFx0Y2FzZSAnbnVsbCc6XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IFZhcmlhYmxlKG5hbWUsIHZhbC50eXBlKSk7XG5cblx0XHRcdGNhc2UgJ3N0cmluZyc6XG5cdFx0XHRcdHJldHVybiB0aGlzLl9jcmVhdGVTdHJpbmdWYXJpYWJsZShuYW1lLCB2YWwpO1xuXHRcdFx0Y2FzZSAnbnVtYmVyJzpcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgVmFyaWFibGUobmFtZSwgKDxWOFNpbXBsZT4gdmFsKS52YWx1ZS50b1N0cmluZygpKSk7XG5cdFx0XHRjYXNlICdib29sZWFuJzpcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgVmFyaWFibGUobmFtZSwgKDxWOFNpbXBsZT4gdmFsKS52YWx1ZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpKTtcdC8vIG5vZGUgcmV0dXJucyB0aGVzZSBib29sZWFuIHZhbHVlcyBjYXBpdGFsaXplZFxuXG5cdFx0XHRjYXNlICdvYmplY3QnOlxuXHRcdFx0Y2FzZSAnZnVuY3Rpb24nOlxuXHRcdFx0Y2FzZSAncmVnZXhwJzpcblx0XHRcdGNhc2UgJ3Byb21pc2UnOlxuXHRcdFx0Y2FzZSAnZ2VuZXJhdG9yJzpcblx0XHRcdGNhc2UgJ2Vycm9yJzpcblxuXHRcdFx0XHRjb25zdCBvYmplY3QgPSA8VjhPYmplY3Q+IHZhbDtcblx0XHRcdFx0bGV0IHZhbHVlID0gb2JqZWN0LmNsYXNzTmFtZTtcblx0XHRcdFx0bGV0IHRleHQgPSBvYmplY3QudGV4dDtcblxuXHRcdFx0XHRzd2l0Y2ggKHZhbHVlKSB7XG5cblx0XHRcdFx0XHRjYXNlICdBcnJheSc6XG5cdFx0XHRcdFx0Y2FzZSAnQXJyYXlCdWZmZXInOlxuXHRcdFx0XHRcdGNhc2UgJ0ludDhBcnJheSc6IGNhc2UgJ1VpbnQ4QXJyYXknOiBjYXNlICdVaW50OENsYW1wZWRBcnJheSc6XG5cdFx0XHRcdFx0Y2FzZSAnSW50MTZBcnJheSc6IGNhc2UgJ1VpbnQxNkFycmF5Jzpcblx0XHRcdFx0XHRjYXNlICdJbnQzMkFycmF5JzogY2FzZSAnVWludDMyQXJyYXknOlxuXHRcdFx0XHRcdGNhc2UgJ0Zsb2F0MzJBcnJheSc6IGNhc2UgJ0Zsb2F0NjRBcnJheSc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlQXJyYXlWYXJpYWJsZShuYW1lLCB2YWwpO1xuXG5cdFx0XHRcdFx0Y2FzZSAnUmVnRXhwJzpcblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IFZhcmlhYmxlKG5hbWUsIHRleHQsIHRoaXMuX3ZhcmlhYmxlSGFuZGxlcy5jcmVhdGUobmV3IFByb3BlcnR5Q29udGFpbmVyKHZhbCkpKSk7XG5cblx0XHRcdFx0XHRjYXNlICdHZW5lcmF0b3InOlxuXHRcdFx0XHRcdGNhc2UgJ09iamVjdCc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fcmVzb2x2ZVZhbHVlcyggWyBvYmplY3QuY29uc3RydWN0b3JGdW5jdGlvbiBdICkudGhlbigocmVzb2x2ZWQ6IFY4RnVuY3Rpb25bXSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAocmVzb2x2ZWRbMF0pIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBjb25zdHJ1Y3Rvcl9uYW1lID0gPHN0cmluZz5yZXNvbHZlZFswXS5uYW1lO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChjb25zdHJ1Y3Rvcl9uYW1lKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IGNvbnN0cnVjdG9yX25hbWU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYgKG9iamVjdC5zdGF0dXMpIHtcdC8vIHByb21pc2VzIGFuZCBnZW5lcmF0b3JzIGhhdmUgYSBzdGF0dXMgYXR0cmlidXRlXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUgKz0gYCB7ICR7b2JqZWN0LnN0YXR1c30gfWA7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbmV3IFZhcmlhYmxlKG5hbWUsIHZhbHVlLCB0aGlzLl92YXJpYWJsZUhhbmRsZXMuY3JlYXRlKG5ldyBQcm9wZXJ0eUNvbnRhaW5lcih2YWwpKSk7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGNhc2UgJ0Z1bmN0aW9uJzpcblx0XHRcdFx0XHRjYXNlICdFcnJvcic6XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdGlmICh0ZXh0KSB7XG5cdFx0XHRcdFx0XHRcdGlmICh0ZXh0LmluZGV4T2YoJ1xcbicpID49IDApIHtcblx0XHRcdFx0XHRcdFx0XHQvLyByZXBsYWNlIGJvZHkgb2YgZnVuY3Rpb24gd2l0aCAnLi4uJ1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHBvcyA9IHRleHQuaW5kZXhPZigneycpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChwb3MgPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMCwgcG9zKSArICd7IOKApiB9Jztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dmFsdWUgPSB0ZXh0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgVmFyaWFibGUobmFtZSwgdmFsdWUsIHRoaXMuX3ZhcmlhYmxlSGFuZGxlcy5jcmVhdGUobmV3IFByb3BlcnR5Q29udGFpbmVyKHZhbCkpKSk7XG5cblx0XHRcdGNhc2UgJ3NldCc6XG5cdFx0XHRcdHJldHVybiB0aGlzLl9jcmVhdGVTZXRWYXJpYWJsZShuYW1lLCB2YWwpO1xuXG5cdFx0XHRjYXNlICdtYXAnOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlTWFwVmFyaWFibGUobmFtZSwgdmFsKTtcblxuXHRcdFx0Y2FzZSAnZnJhbWUnOlxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgVmFyaWFibGUobmFtZSwgKDxWOFNpbXBsZT4gdmFsKS52YWx1ZSA/ICg8VjhTaW1wbGU+IHZhbCkudmFsdWUudG9TdHJpbmcoKSA6ICd1bmRlZmluZWQnKSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8tLS0gbG9uZyBhcnJheSBzdXBwb3J0XG5cblx0cHJpdmF0ZSBfY3JlYXRlQXJyYXlWYXJpYWJsZShuYW1lOiBzdHJpbmcsIGFycmF5OiBWOE9iamVjdCkgOiBQcm9taXNlPFZhcmlhYmxlPiB7XG5cblx0XHRyZXR1cm4gdGhpcy5fZ2V0QXJyYXlTaXplKGFycmF5KS50aGVuKGxlbmd0aCA9PiB7XG5cblx0XHRcdGxldCBleHBhbmRlcjogVmFyaWFibGVDb250YWluZXI7XG5cblx0XHRcdGlmIChsZW5ndGggPiB0aGlzLl9jaHVua1NpemUpIHtcblx0XHRcdFx0ZXhwYW5kZXIgPSBuZXcgQXJyYXlDb250YWluZXIoYXJyYXksIGxlbmd0aCwgdGhpcy5fY2h1bmtTaXplKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGV4cGFuZGVyID0gbmV3IFByb3BlcnR5Q29udGFpbmVyKGFycmF5KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG5ldyBWYXJpYWJsZShuYW1lLCBgJHthcnJheS5jbGFzc05hbWV9WyR7KGxlbmd0aCA+PSAwKSA/IGxlbmd0aC50b1N0cmluZygpIDogJyd9XWAsIHRoaXMuX3ZhcmlhYmxlSGFuZGxlcy5jcmVhdGUoZXhwYW5kZXIpKTtcblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX2dldEFycmF5U2l6ZShhcnJheTogVjhPYmplY3QpIDogUHJvbWlzZTxudW1iZXI+IHtcblxuXHRcdGlmICh0eXBlb2YgYXJyYXkudnNjb2RlX3NpemUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGFycmF5LnZzY29kZV9zaXplKTtcblx0XHR9XG5cblx0XHRjb25zdCBhcmdzID0ge1xuXHRcdFx0ZXhwcmVzc2lvbjogYGFycmF5Lmxlbmd0aGAsXG5cdFx0XHRkaXNhYmxlX2JyZWFrOiB0cnVlLFxuXHRcdFx0YWRkaXRpb25hbF9jb250ZXh0OiBbXG5cdFx0XHRcdHsgbmFtZTogJ2FycmF5JywgaGFuZGxlOiBhcnJheS5oYW5kbGUgfVxuXHRcdFx0XVxuXHRcdH07XG5cblx0XHR0aGlzLmxvZygndmEnLCBgX2dldEFycmF5U2l6ZTogYXJyYXkubGVuZ3RoYCk7XG5cdFx0cmV0dXJuIHRoaXMuX25vZGUuZXZhbHVhdGUoYXJncykudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRyZXR1cm4gK3Jlc3BvbnNlLmJvZHkudmFsdWU7XG5cdFx0fSk7XG5cdH1cblxuLypcblx0cHJpdmF0ZSBfY3JlYXRlTGFyZ2VBcnJheUVsZW1lbnRzKGFycmF5OiBhbnksIHN0YXJ0OiBudW1iZXIsIGNvdW50OiBudW1iZXIpIDogUHJvbWlzZTxWYXJpYWJsZVtdPiB7XG5cblx0XHRjb25zdCBhcmdzID0ge1xuXHRcdFx0ZXhwcmVzc2lvbjogYGFycmF5LnNsaWNlKCR7c3RhcnR9LCAke3N0YXJ0K2NvdW50fSlgLFxuXHRcdFx0ZGlzYWJsZV9icmVhazogdHJ1ZSxcblx0XHRcdGFkZGl0aW9uYWxfY29udGV4dDogW1xuXHRcdFx0XHR7IG5hbWU6ICdhcnJheScsIGhhbmRsZTogYXJyYXkuaGFuZGxlIH1cblx0XHRcdF1cblx0XHR9O1xuXG5cdFx0dGhpcy5sb2coJ3ZhJywgYF9jcmVhdGVMYXJnZUFycmF5RWxlbWVudHM6IGFycmF5LnNsaWNlYCk7XG5cdFx0cmV0dXJuIHRoaXMuX25vZGUuZXZhbHVhdGUoYXJncykudGhlbihyZXNwb25zZSA9PiB7XG5cblx0XHRcdGNvbnN0IHByb3BlcnRpZXMgPSByZXNwb25zZS5ib2R5LnByb3BlcnRpZXM7XG5cdFx0XHRjb25zdCBzZWxlY3RlZFByb3BlcnRpZXMgPSBuZXcgQXJyYXk8YW55PigpO1xuXG5cdFx0XHRmb3IgKGxldCBwcm9wZXJ0eSBvZiBwcm9wZXJ0aWVzKSB7XG5cdFx0XHRcdGNvbnN0IG5hbWUgPSBwcm9wZXJ0eS5uYW1lO1xuXHRcdFx0XHRpZiAodHlwZW9mIG5hbWUgPT09ICdudW1iZXInIHx8ICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycgJiYgbmFtZVswXSA+PSAnMCcgJiYgbmFtZVswXSA8PSAnOScpKSB7XG5cdFx0XHRcdFx0c2VsZWN0ZWRQcm9wZXJ0aWVzLnB1c2gocHJvcGVydHkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzLl9jcmVhdGVQcm9wZXJ0eVZhcmlhYmxlcyhudWxsLCBzZWxlY3RlZFByb3BlcnRpZXMpO1xuXHRcdH0pO1xuXHR9XG4qL1xuXHQvLy0tLSBFUzYgU2V0IHN1cHBvcnRcblxuXHRwcml2YXRlIF9jcmVhdGVTZXRWYXJpYWJsZShuYW1lOiBzdHJpbmcsIHNldDogVjhIYW5kbGUpIDogUHJvbWlzZTxWYXJpYWJsZT4ge1xuXG5cdFx0Y29uc3QgYXJncyA9IHtcblx0XHRcdC8vIGluaXRpYWxseSB3ZSBuZWVkIG9ubHkgdGhlIHNpemUgb2YgdGhlIHNldFxuXHRcdFx0ZXhwcmVzc2lvbjogYHNldC5zaXplYCxcblx0XHRcdGRpc2FibGVfYnJlYWs6IHRydWUsXG5cdFx0XHRhZGRpdGlvbmFsX2NvbnRleHQ6IFtcblx0XHRcdFx0eyBuYW1lOiAnc2V0JywgaGFuZGxlOiBzZXQuaGFuZGxlIH1cblx0XHRcdF1cblx0XHR9O1xuXG5cdFx0dGhpcy5sb2coJ3ZhJywgYF9jcmVhdGVTZXRWYXJpYWJsZTogc2V0LnNpemVgKTtcblx0XHRyZXR1cm4gdGhpcy5fbm9kZS5ldmFsdWF0ZShhcmdzKS50aGVuKHJlc3BvbnNlID0+IHtcblxuXHRcdFx0Y29uc3Qgc2l6ZSA9ICtyZXNwb25zZS5ib2R5LnZhbHVlO1xuXG5cdFx0XHRsZXQgZXhwYW5kRnVuYztcblx0XHRcdGlmIChzaXplID4gdGhpcy5fY2h1bmtTaXplKSB7XG5cdFx0XHRcdGV4cGFuZEZ1bmMgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdmFyaWFibGVzID0gW107XG5cdFx0XHRcdFx0Zm9yIChsZXQgc3RhcnQgPSAwOyBzdGFydCA8IHNpemU7IHN0YXJ0ICs9IHRoaXMuX2NodW5rU2l6ZSkge1xuXHRcdFx0XHRcdFx0bGV0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgdGhpcy5fY2h1bmtTaXplLCBzaXplKS0xO1xuXHRcdFx0XHRcdFx0bGV0IHJhbmdlRXhwYW5kZXIgPSBuZXcgRXhwYW5kZXIoKCkgPT4gdGhpcy5fY3JlYXRlU2V0RWxlbWVudHMoc2V0LCBzdGFydCwgZW5kKSk7XG5cdFx0XHRcdFx0XHR2YXJpYWJsZXMucHVzaChuZXcgVmFyaWFibGUoYCR7c3RhcnR9Li4ke2VuZH1gLCAnICcsIHRoaXMuX3ZhcmlhYmxlSGFuZGxlcy5jcmVhdGUocmFuZ2VFeHBhbmRlcikpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YXJpYWJsZXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZXhwYW5kRnVuYyA9ICgpID0+IHRoaXMuX2NyZWF0ZVNldEVsZW1lbnRzKHNldCwgMCwgc2l6ZSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBuZXcgVmFyaWFibGUobmFtZSwgYFNldFske3NpemV9XWAsIHRoaXMuX3ZhcmlhYmxlSGFuZGxlcy5jcmVhdGUobmV3IEV4cGFuZGVyKGV4cGFuZEZ1bmMpKSk7XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIF9jcmVhdGVTZXRFbGVtZW50cyhzZXQ6IFY4SGFuZGxlLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlcikgOiBQcm9taXNlPFZhcmlhYmxlW10+IHtcblxuXHRcdGNvbnN0IGFyZ3MgPSB7XG5cdFx0XHRleHByZXNzaW9uOiBgdmFyIHIgPSBbXSwgaSA9IDA7IHNldC5mb3JFYWNoKHYgPT4geyBpZiAoaSA+PSAke3N0YXJ0fSAmJiBpIDw9ICR7ZW5kfSkgci5wdXNoKHYpOyBpKys7IH0pOyByYCxcblx0XHRcdGRpc2FibGVfYnJlYWs6IHRydWUsXG5cdFx0XHRhZGRpdGlvbmFsX2NvbnRleHQ6IFtcblx0XHRcdFx0eyBuYW1lOiAnc2V0JywgaGFuZGxlOiBzZXQuaGFuZGxlIH1cblx0XHRcdF1cblx0XHR9O1xuXG5cdFx0Y29uc3QgbGVuZ3RoID0gZW5kLXN0YXJ0KzE7XG5cdFx0dGhpcy5sb2coJ3ZhJywgYF9jcmVhdGVTZXRFbGVtZW50czogc2V0LnNsaWNlICR7c3RhcnR9ICR7bGVuZ3RofWApO1xuXHRcdHJldHVybiB0aGlzLl9ub2RlLmV2YWx1YXRlKGFyZ3MpLnRoZW4ocmVzcG9uc2UgPT4ge1xuXG5cdFx0XHRjb25zdCBwcm9wZXJ0aWVzID0gcmVzcG9uc2UuYm9keS5wcm9wZXJ0aWVzO1xuXHRcdFx0Y29uc3Qgc2VsZWN0ZWRQcm9wZXJ0aWVzID0gbmV3IEFycmF5PGFueT4oKTtcblxuXHRcdFx0Zm9yIChsZXQgcHJvcGVydHkgb2YgcHJvcGVydGllcykge1xuXHRcdFx0XHRjb25zdCBuYW1lID0gcHJvcGVydHkubmFtZTtcblx0XHRcdFx0aWYgKHR5cGVvZiBuYW1lID09PSAnbnVtYmVyJyB8fCAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnICYmIG5hbWVbMF0gPj0gJzAnICYmIG5hbWVbMF0gPD0gJzknKSkge1xuXHRcdFx0XHRcdHNlbGVjdGVkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlUHJvcGVydHlWYXJpYWJsZXMobnVsbCwgc2VsZWN0ZWRQcm9wZXJ0aWVzLCBzdGFydCwgdHJ1ZSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLy0tLSBFUzYgbWFwIHN1cHBvcnRcblxuXHRwcml2YXRlIF9jcmVhdGVNYXBWYXJpYWJsZShuYW1lOiBzdHJpbmcsIG1hcDogVjhIYW5kbGUpIDogUHJvbWlzZTxWYXJpYWJsZT4ge1xuXG5cdFx0Y29uc3QgYXJncyA9IHtcblx0XHRcdC8vIGluaXRpYWxseSB3ZSBuZWVkIG9ubHkgdGhlIHNpemUgb2YgdGhlIG1hcFxuXHRcdFx0ZXhwcmVzc2lvbjogYG1hcC5zaXplYCxcblx0XHRcdGRpc2FibGVfYnJlYWs6IHRydWUsXG5cdFx0XHRhZGRpdGlvbmFsX2NvbnRleHQ6IFtcblx0XHRcdFx0eyBuYW1lOiAnbWFwJywgaGFuZGxlOiBtYXAuaGFuZGxlIH1cblx0XHRcdF1cblx0XHR9O1xuXG5cdFx0dGhpcy5sb2coJ3ZhJywgYF9jcmVhdGVNYXBWYXJpYWJsZTogbWFwLnNpemVgKTtcblx0XHRyZXR1cm4gdGhpcy5fbm9kZS5ldmFsdWF0ZShhcmdzKS50aGVuKHJlc3BvbnNlID0+IHtcblxuXHRcdFx0Y29uc3Qgc2l6ZSA9ICtyZXNwb25zZS5ib2R5LnZhbHVlO1xuXG5cdFx0XHRsZXQgZXhwYW5kRnVuYztcblx0XHRcdGlmIChzaXplID4gdGhpcy5fY2h1bmtTaXplKSB7XG5cdFx0XHRcdGV4cGFuZEZ1bmMgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdmFyaWFibGVzID0gW107XG5cdFx0XHRcdFx0Zm9yIChsZXQgc3RhcnQgPSAwOyBzdGFydCA8IHNpemU7IHN0YXJ0ICs9IHRoaXMuX2NodW5rU2l6ZSkge1xuXHRcdFx0XHRcdFx0bGV0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgdGhpcy5fY2h1bmtTaXplLCBzaXplKS0xO1xuXHRcdFx0XHRcdFx0bGV0IHJhbmdlRXhwYW5kZXIgPSBuZXcgRXhwYW5kZXIoKCkgPT4gdGhpcy5fY3JlYXRlTWFwRWxlbWVudHMobWFwLCBzdGFydCwgZW5kKSk7XG5cdFx0XHRcdFx0XHR2YXJpYWJsZXMucHVzaChuZXcgVmFyaWFibGUoYCR7c3RhcnR9Li4ke2VuZH1gLCAnICcsIHRoaXMuX3ZhcmlhYmxlSGFuZGxlcy5jcmVhdGUocmFuZ2VFeHBhbmRlcikpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YXJpYWJsZXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZXhwYW5kRnVuYyA9ICgpID0+IHRoaXMuX2NyZWF0ZU1hcEVsZW1lbnRzKG1hcCwgMCwgc2l6ZSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBuZXcgVmFyaWFibGUobmFtZSwgYE1hcFske3NpemV9XWAsIHRoaXMuX3ZhcmlhYmxlSGFuZGxlcy5jcmVhdGUobmV3IEV4cGFuZGVyKGV4cGFuZEZ1bmMpKSk7XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIF9jcmVhdGVNYXBFbGVtZW50cyhtYXA6IFY4SGFuZGxlLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlcikgOiBQcm9taXNlPFZhcmlhYmxlW10+IHtcblxuXHRcdC8vIGZvciBlYWNoIHNsb3Qgb2YgdGhlIG1hcCB3ZSBjcmVhdGUgdGhyZWUgc2xvdHMgaW4gYSBoZWxwZXIgYXJyYXk6IGxhYmVsLCBrZXksIHZhbHVlXG5cdFx0Y29uc3QgYXJncyA9IHtcblx0XHRcdGV4cHJlc3Npb246IGB2YXIgcj1bXSxpPTA7IG1hcC5mb3JFYWNoKCh2LGspID0+IHsgaWYgKGk+PSR7c3RhcnR9ICYmIGk8PSR7ZW5kfSkgeyByLnB1c2goaysnIOKGkiAnK3YpOyByLnB1c2goayk7IHIucHVzaCh2KTt9IGkrKzsgfSk7IHJgLFxuXHRcdFx0ZGlzYWJsZV9icmVhazogdHJ1ZSxcblx0XHRcdGFkZGl0aW9uYWxfY29udGV4dDogW1xuXHRcdFx0XHR7IG5hbWU6ICdtYXAnLCBoYW5kbGU6IG1hcC5oYW5kbGUgfVxuXHRcdFx0XVxuXHRcdH07XG5cblx0XHRjb25zdCBjb3VudCA9IGVuZC1zdGFydCsxO1xuXHRcdHRoaXMubG9nKCd2YScsIGBfY3JlYXRlTWFwRWxlbWVudHM6IG1hcC5zbGljZSAke3N0YXJ0fSAke2NvdW50fWApO1xuXHRcdHJldHVybiB0aGlzLl9ub2RlLmV2YWx1YXRlKGFyZ3MpLnRoZW4ocmVzcG9uc2UgPT4ge1xuXG5cdFx0XHRjb25zdCBwcm9wZXJ0aWVzID0gcmVzcG9uc2UuYm9keS5wcm9wZXJ0aWVzO1xuXHRcdFx0Y29uc3Qgc2VsZWN0ZWRQcm9wZXJ0aWVzID0gbmV3IEFycmF5PGFueT4oKTtcblxuXHRcdFx0Zm9yIChsZXQgcHJvcGVydHkgb2YgcHJvcGVydGllcykge1xuXHRcdFx0XHRjb25zdCBuYW1lID0gcHJvcGVydHkubmFtZTtcblx0XHRcdFx0aWYgKHR5cGVvZiBuYW1lID09PSAnbnVtYmVyJyB8fCAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnICYmIG5hbWVbMF0gPj0gJzAnICYmIG5hbWVbMF0gPD0gJzknKSkge1xuXHRcdFx0XHRcdHNlbGVjdGVkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcy5fcmVzb2x2ZVZhbHVlcyhzZWxlY3RlZFByb3BlcnRpZXMpLnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRjb25zdCB2YXJpYWJsZXMgPSBbXTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZFByb3BlcnRpZXMubGVuZ3RoOyBpICs9IDMpIHtcblxuXHRcdFx0XHRcdGNvbnN0IGtleSA9IDxWOE9iamVjdD4gdGhpcy5fZ2V0VmFsdWVGcm9tQ2FjaGUoc2VsZWN0ZWRQcm9wZXJ0aWVzW2krMV0pO1xuXHRcdFx0XHRcdGNvbnN0IHZhbCA9IDxWOE9iamVjdD4gdGhpcy5fZ2V0VmFsdWVGcm9tQ2FjaGUoc2VsZWN0ZWRQcm9wZXJ0aWVzW2krMl0pO1xuXG5cdFx0XHRcdFx0Y29uc3QgZXhwYW5kZXIgPSBuZXcgRXhwYW5kZXIoKCkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKFtcblx0XHRcdFx0XHRcdFx0dGhpcy5fY3JlYXRlVmFyaWFibGUoJ2tleScsIGtleSksXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2NyZWF0ZVZhcmlhYmxlKCd2YWx1ZScsIHZhbClcblx0XHRcdFx0XHRcdF0pO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Y29uc3QgeCA9IDxWOE9iamVjdD4gdGhpcy5fZ2V0VmFsdWVGcm9tQ2FjaGUoc2VsZWN0ZWRQcm9wZXJ0aWVzW2ldKTtcblx0XHRcdFx0XHR2YXJpYWJsZXMucHVzaChuZXcgVmFyaWFibGUoKHN0YXJ0ICsgKGkvMykpLnRvU3RyaW5nKCksIDxzdHJpbmc+IHgudmFsdWUsIHRoaXMuX3ZhcmlhYmxlSGFuZGxlcy5jcmVhdGUoZXhwYW5kZXIpKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHZhcmlhYmxlcztcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8tLS0gbG9uZyBzdHJpbmcgc3VwcG9ydFxuXG5cdHByaXZhdGUgX2NyZWF0ZVN0cmluZ1ZhcmlhYmxlKG5hbWU6IHN0cmluZywgdmFsOiBWOFNpbXBsZSkgOiBQcm9taXNlPFZhcmlhYmxlPiB7XG5cblx0XHRsZXQgc3RyX3ZhbCA9IDxzdHJpbmc+dmFsLnZhbHVlO1xuXG5cdFx0aWYgKE5vZGVEZWJ1Z1Nlc3Npb24uTE9OR19TVFJJTkdfTUFUQ0hFUi5leGVjKHN0cl92YWwpKSB7XG5cblx0XHRcdGNvbnN0IGFyZ3MgPSB7XG5cdFx0XHRcdGV4cHJlc3Npb246IGBzdHJgLFxuXHRcdFx0XHRkaXNhYmxlX2JyZWFrOiB0cnVlLFxuXHRcdFx0XHRtYXhTdHJpbmdMZW5ndGg6IE5vZGVEZWJ1Z1Nlc3Npb24uTUFYX1NUUklOR19MRU5HVEgsXG5cdFx0XHRcdGFkZGl0aW9uYWxfY29udGV4dDogW1xuXHRcdFx0XHRcdHsgbmFtZTogJ3N0cicsIGhhbmRsZTogdmFsLmhhbmRsZSB9XG5cdFx0XHRcdF1cblx0XHRcdH07XG5cblx0XHRcdHRoaXMubG9nKCd2YScsIGBfY3JlYXRlU3RyaW5nVmFyaWFibGU6IGdldCBmdWxsIHN0cmluZ2ApO1xuXHRcdFx0cmV0dXJuIHRoaXMuX25vZGUuZXZhbHVhdGUoYXJncykudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRcdHN0cl92YWwgPSA8c3RyaW5nPiByZXNwb25zZS5ib2R5LnZhbHVlO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlU3RyaW5nVmFyaWFibGUyKG5hbWUsIHN0cl92YWwpO1xuXHRcdFx0fSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9jcmVhdGVTdHJpbmdWYXJpYWJsZTIobmFtZSwgc3RyX3ZhbCkpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX2NyZWF0ZVN0cmluZ1ZhcmlhYmxlMihuYW1lLCBzOiBzdHJpbmcpIHtcblx0XHRpZiAocykge1xuXHRcdFx0cyA9IHMucmVwbGFjZSgnXFxuJywgJ1xcXFxuJykucmVwbGFjZSgnXFxyJywgJ1xcXFxyJyk7XG5cdFx0fVxuXHRcdHJldHVybiBuZXcgVmFyaWFibGUobmFtZSwgYFwiJHtzfVwiYCk7XG5cdH1cblxuXHQvLy0tLSBzZXRWYXJpYWJsZSByZXF1ZXN0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwcm90ZWN0ZWQgc2V0VmFyaWFibGVSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlNldFZhcmlhYmxlUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU2V0VmFyaWFibGVBcmd1bWVudHMpOiB2b2lkIHtcblx0XHRjb25zdCByZWZlcmVuY2UgPSBhcmdzLnZhcmlhYmxlc1JlZmVyZW5jZTtcblx0XHRjb25zdCBuYW1lID0gYXJncy5uYW1lO1xuXHRcdGNvbnN0IHZhbHVlID0gYXJncy52YWx1ZTtcblx0XHRjb25zdCB2YXJpYWJsZXNDb250YWluZXIgPSB0aGlzLl92YXJpYWJsZUhhbmRsZXMuZ2V0KHJlZmVyZW5jZSk7XG5cdFx0aWYgKHZhcmlhYmxlc0NvbnRhaW5lcikge1xuXHRcdFx0dmFyaWFibGVzQ29udGFpbmVyLlNldFZhbHVlKHRoaXMsIG5hbWUsIHZhbHVlKS50aGVuKG5ld1ZhbHVlID0+IHtcblx0XHRcdFx0cmVzcG9uc2UuYm9keSA9IHtcblx0XHRcdFx0XHR2YWx1ZTogbmV3VmFsdWVcblx0XHRcdFx0fTtcblx0XHRcdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHRcdFx0fSkuY2F0Y2goZXJyID0+IHtcblx0XHRcdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZShyZXNwb25zZSwgMjAwNCwgZXJyLm1lc3NhZ2UpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc2VuZEVycm9yUmVzcG9uc2UocmVzcG9uc2UsIDIwMjUsIEV4cGFuZGVyLlNFVF9WQUxVRV9FUlJPUik7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIF9zZXRWYXJpYWJsZVZhbHVlKGZyYW1lOiBudW1iZXIsIHNjb3BlOiBudW1iZXIsIG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykgOiBQcm9taXNlPHN0cmluZz4ge1xuXG5cdFx0Y29uc3QgZXZhbEFyZ3MgPSB7XG5cdFx0XHRleHByZXNzaW9uOiB2YWx1ZSxcblx0XHRcdGRpc2FibGVfYnJlYWs6IHRydWUsXG5cdFx0XHRtYXhTdHJpbmdMZW5ndGg6IE5vZGVEZWJ1Z1Nlc3Npb24uTUFYX1NUUklOR19MRU5HVEgsXG5cdFx0XHRmcmFtZTogZnJhbWVcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHRoaXMuX25vZGUuZXZhbHVhdGUoZXZhbEFyZ3MpLnRoZW4oZXZhbFJlc3BvbnNlID0+IHtcblxuXHRcdFx0Y29uc3QgYXJncyA9IHtcblx0XHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0XHRmcmFtZU51bWJlcjogZnJhbWUsXG5cdFx0XHRcdFx0bnVtYmVyOiBzY29wZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRuYW1lOiBuYW1lLFxuXHRcdFx0XHRuZXdWYWx1ZToge1xuXHRcdFx0XHRcdHZhbHVlOiBldmFsUmVzcG9uc2UuYm9keS52YWx1ZSxcblx0XHRcdFx0XHR0eXBlOiBldmFsUmVzcG9uc2UuYm9keS50eXBlXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdHJldHVybiB0aGlzLl9ub2RlLnNldFZhcmlhYmxlVmFsdWUoYXJncykudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9jcmVhdGVWYXJpYWJsZSgnX3NldFZhcmlhYmxlVmFsdWUnLCByZXNwb25zZS5ib2R5Lm5ld1ZhbHVlKS50aGVuKHZhcmlhYmxlID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gdmFyaWFibGUudmFsdWU7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgX3NldFByb3BlcnR5VmFsdWUob2JqSGFuZGxlOiBudW1iZXIsIHByb3BOYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcblxuXHRcdGlmIChwcm9wTmFtZVswXSAhPT0gJ1snKSB7XG5cdFx0XHRwcm9wTmFtZSA9ICcuJyArIHByb3BOYW1lO1xuXHRcdH1cblxuXHRcdGNvbnN0IGFyZ3MgPSB7XG5cdFx0XHRnbG9iYWw6IHRydWUsXG5cdFx0XHRleHByZXNzaW9uOiBgb2JqJHtwcm9wTmFtZX0gPSAke3ZhbHVlfWAsXG5cdFx0XHRkaXNhYmxlX2JyZWFrOiB0cnVlLFxuXHRcdFx0bWF4U3RyaW5nTGVuZ3RoOiBOb2RlRGVidWdTZXNzaW9uLk1BWF9TVFJJTkdfTEVOR1RILFxuXHRcdFx0YWRkaXRpb25hbF9jb250ZXh0OiBbXG5cdFx0XHRcdHsgbmFtZTogJ29iaicsIGhhbmRsZTogb2JqSGFuZGxlIH1cblx0XHRcdF1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIHRoaXMuX25vZGUuZXZhbHVhdGUoYXJncykudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlVmFyaWFibGUoJ19zZXRwcm9wZXJ0eXZhbHVlJywgcmVzcG9uc2UuYm9keSkudGhlbih2YXJpYWJsZSA9PiB7XG5cdFx0XHRcdHJldHVybiB2YXJpYWJsZS52YWx1ZTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8tLS0gcGF1c2UgcmVxdWVzdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0cHJvdGVjdGVkIHBhdXNlUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5QYXVzZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlBhdXNlQXJndW1lbnRzKSA6IHZvaWQge1xuXHRcdHRoaXMuX25vZGUuY29tbWFuZCgnc3VzcGVuZCcsIG51bGwsIChub2RlUmVzcG9uc2UpID0+IHtcblx0XHRcdGlmIChub2RlUmVzcG9uc2Uuc3VjY2Vzcykge1xuXHRcdFx0XHR0aGlzLl9zdG9wcGVkKCdwYXVzZScpO1xuXHRcdFx0XHR0aGlzLl9sYXN0U3RvcHBlZEV2ZW50ID0gbmV3IFN0b3BwZWRFdmVudChsb2NhbGl6ZSh7IGtleTogJ3JlYXNvbi51c2VyX3JlcXVlc3QnLCBjb21tZW50OiBbJ2h0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvdnNjb2RlL2lzc3Vlcy80NTY4J10gfSwgXCJ1c2VyIHJlcXVlc3RcIiksIE5vZGVEZWJ1Z1Nlc3Npb24uRFVNTVlfVEhSRUFEX0lEKTtcblx0XHRcdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHRcdFx0XHR0aGlzLnNlbmRFdmVudCh0aGlzLl9sYXN0U3RvcHBlZEV2ZW50KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX3NlbmROb2RlUmVzcG9uc2UocmVzcG9uc2UsIG5vZGVSZXNwb25zZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvLy0tLSBjb250aW51ZSByZXF1ZXN0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwcm90ZWN0ZWQgY29udGludWVSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLkNvbnRpbnVlUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuQ29udGludWVBcmd1bWVudHMpOiB2b2lkIHtcblx0XHR0aGlzLl9ub2RlLmNvbW1hbmQoJ2NvbnRpbnVlJywgbnVsbCwgbm9kZVJlc3BvbnNlID0+IHtcblx0XHRcdHRoaXMuX3NlbmROb2RlUmVzcG9uc2UocmVzcG9uc2UsIG5vZGVSZXNwb25zZSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLy0tLSBzdGVwIHJlcXVlc3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwcm90ZWN0ZWQgbmV4dFJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuTmV4dFJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLk5leHRBcmd1bWVudHMpOiB2b2lkIHtcblx0XHR0aGlzLl9ub2RlLmNvbW1hbmQoJ2NvbnRpbnVlJywgeyBzdGVwYWN0aW9uOiAnbmV4dCcgfSwgbm9kZVJlc3BvbnNlID0+IHtcblx0XHRcdHRoaXMuX3NlbmROb2RlUmVzcG9uc2UocmVzcG9uc2UsIG5vZGVSZXNwb25zZSk7XG5cdFx0fSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgc3RlcEluUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5TdGVwSW5SZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5TdGVwSW5Bcmd1bWVudHMpIDogdm9pZCB7XG5cdFx0dGhpcy5fbm9kZS5jb21tYW5kKCdjb250aW51ZScsIHsgc3RlcGFjdGlvbjogJ2luJyB9LCBub2RlUmVzcG9uc2UgPT4ge1xuXHRcdFx0dGhpcy5fc2VuZE5vZGVSZXNwb25zZShyZXNwb25zZSwgbm9kZVJlc3BvbnNlKTtcblx0XHR9KTtcblx0fVxuXG5cdHByb3RlY3RlZCBzdGVwT3V0UmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5TdGVwT3V0UmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU3RlcE91dEFyZ3VtZW50cykgOiB2b2lkIHtcblx0XHR0aGlzLl9ub2RlLmNvbW1hbmQoJ2NvbnRpbnVlJywgeyBzdGVwYWN0aW9uOiAnb3V0JyB9LCBub2RlUmVzcG9uc2UgPT4ge1xuXHRcdFx0dGhpcy5fc2VuZE5vZGVSZXNwb25zZShyZXNwb25zZSwgbm9kZVJlc3BvbnNlKTtcblx0XHR9KTtcblx0fVxuXG5cdHByb3RlY3RlZCBzdGVwQmFja1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuU3RlcEJhY2tSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5TdGVwQmFja0FyZ3VtZW50cykgOiB2b2lkIHtcbiBcdFx0dGhpcy5fbm9kZS5jb21tYW5kKCdjb250aW51ZScsIHsgc3RlcGFjdGlvbjogJ2JhY2snIH0sIChub2RlUmVzcG9uc2UpID0+IHtcbiBcdFx0XHR0aGlzLl9zZW5kTm9kZVJlc3BvbnNlKHJlc3BvbnNlLCBub2RlUmVzcG9uc2UpO1xuIFx0XHR9KTtcbiBcdH1cblxuXHQvLy0tLSBldmFsdWF0ZSByZXF1ZXN0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwcm90ZWN0ZWQgZXZhbHVhdGVSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLkV2YWx1YXRlUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuRXZhbHVhdGVBcmd1bWVudHMpOiB2b2lkIHtcblxuXHRcdGNvbnN0IGV4cHJlc3Npb24gPSBhcmdzLmV4cHJlc3Npb247XG5cblx0XHRjb25zdCBldmFsQXJncyA9IHtcblx0XHRcdGV4cHJlc3Npb246IGV4cHJlc3Npb24sXG5cdFx0XHRkaXNhYmxlX2JyZWFrOiB0cnVlLFxuXHRcdFx0bWF4U3RyaW5nTGVuZ3RoOiBOb2RlRGVidWdTZXNzaW9uLk1BWF9TVFJJTkdfTEVOR1RIXG5cdFx0fTtcblx0XHRpZiAoYXJncy5mcmFtZUlkID4gMCkge1xuXHRcdFx0Y29uc3QgZnJhbWUgPSB0aGlzLl9mcmFtZUhhbmRsZXMuZ2V0KGFyZ3MuZnJhbWVJZCk7XG5cdFx0XHRpZiAoIWZyYW1lKSB7XG5cdFx0XHRcdHRoaXMuc2VuZEVycm9yUmVzcG9uc2UocmVzcG9uc2UsIDIwMjAsICdzdGFjayBmcmFtZSBub3QgdmFsaWQnLCBudWxsLCBFcnJvckRlc3RpbmF0aW9uLlRlbGVtZXRyeSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGNvbnN0IGZyYW1lSXggPSBmcmFtZS5pbmRleDtcblx0XHRcdCg8YW55PmV2YWxBcmdzKS5mcmFtZSA9IGZyYW1lSXg7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCg8YW55PmV2YWxBcmdzKS5nbG9iYWwgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHRoaXMuX25vZGUuY29tbWFuZCh0aGlzLl9ub2RlSW5qZWN0aW9uQXZhaWxhYmxlID8gJ3ZzY29kZV9ldmFsdWF0ZScgOiAnZXZhbHVhdGUnLCBldmFsQXJncywgKHJlc3A6IFY4RXZhbHVhdGVSZXNwb25zZSkgPT4ge1xuXHRcdFx0aWYgKHJlc3Auc3VjY2Vzcykge1xuXHRcdFx0XHR0aGlzLl9jcmVhdGVWYXJpYWJsZSgnZXZhbHVhdGUnLCByZXNwLmJvZHkpLnRoZW4oKHY6IFZhcmlhYmxlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHYpIHtcblx0XHRcdFx0XHRcdHJlc3BvbnNlLmJvZHkgPSB7XG5cdFx0XHRcdFx0XHRcdHJlc3VsdDogdi52YWx1ZSxcblx0XHRcdFx0XHRcdFx0dmFyaWFibGVzUmVmZXJlbmNlOiB2LnZhcmlhYmxlc1JlZmVyZW5jZVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmVzcG9uc2Uuc3VjY2VzcyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0cmVzcG9uc2UubWVzc2FnZSA9IGxvY2FsaXplKCdldmFsLm5vdC5hdmFpbGFibGUnLCBcIm5vdCBhdmFpbGFibGVcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXNwb25zZS5zdWNjZXNzID0gZmFsc2U7XG5cdFx0XHRcdGlmIChyZXNwLm1lc3NhZ2UuaW5kZXhPZignUmVmZXJlbmNlRXJyb3I6ICcpID09PSAwIHx8IHJlc3AubWVzc2FnZSA9PT0gJ05vIGZyYW1lcycpIHtcblx0XHRcdFx0XHRyZXNwb25zZS5tZXNzYWdlID0gbG9jYWxpemUoJ2V2YWwubm90LmF2YWlsYWJsZScsIFwibm90IGF2YWlsYWJsZVwiKTtcblx0XHRcdFx0fSBlbHNlIGlmIChyZXNwLm1lc3NhZ2UuaW5kZXhPZignU3ludGF4RXJyb3I6ICcpID09PSAwKSB7XG5cdFx0XHRcdFx0Y29uc3QgbSA9IHJlc3AubWVzc2FnZS5zdWJzdHJpbmcoJ1N5bnRheEVycm9yOiAnLmxlbmd0aCkudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRyZXNwb25zZS5tZXNzYWdlID0gbG9jYWxpemUoJ2V2YWwuaW52YWxpZC5leHByZXNzaW9uJywgXCJpbnZhbGlkIGV4cHJlc3Npb246IHswfVwiLCBtKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXNwb25zZS5tZXNzYWdlID0gcmVzcC5tZXNzYWdlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8vLS0tIHNvdXJjZSByZXF1ZXN0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdHByb3RlY3RlZCBzb3VyY2VSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlNvdXJjZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlNvdXJjZUFyZ3VtZW50cyk6IHZvaWQge1xuXG5cdFx0Y29uc3Qgc291cmNlSGFuZGxlID0gYXJncy5zb3VyY2VSZWZlcmVuY2U7XG5cdFx0Y29uc3Qgc3JjU291cmNlID0gdGhpcy5fc291cmNlSGFuZGxlcy5nZXQoc291cmNlSGFuZGxlKTtcblxuXHRcdGlmIChzcmNTb3VyY2UpIHtcblxuXHRcdFx0aWYgKHNyY1NvdXJjZS5zb3VyY2UpIHtcblx0XHRcdFx0cmVzcG9uc2UuYm9keSA9IHtcblx0XHRcdFx0XHRjb250ZW50OiBzcmNTb3VyY2Uuc291cmNlXG5cdFx0XHRcdH07XG5cdFx0XHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc3JjU291cmNlLnNjcmlwdElkKSB7XG5cblx0XHRcdFx0dGhpcy5fbG9hZFNjcmlwdChzcmNTb3VyY2Uuc2NyaXB0SWQpLnRoZW4oc2NyaXB0ID0+IHtcblx0XHRcdFx0XHRzcmNTb3VyY2Uuc291cmNlID0gc2NyaXB0LmNvbnRlbnRzO1xuXHRcdFx0XHRcdHJlc3BvbnNlLmJvZHkgPSB7XG5cdFx0XHRcdFx0XHRjb250ZW50OiBzcmNTb3VyY2Uuc291cmNlXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdFx0XHRcdH0pLmNhdGNoKGVyciA9PiB7XG5cdFx0XHRcdFx0c3JjU291cmNlLnNvdXJjZSA9IGxvY2FsaXplKCdzb3VyY2Uubm90LmZvdW5kJywgXCI8c291cmNlIG5vdCBmb3VuZD5cIik7XG5cdFx0XHRcdFx0cmVzcG9uc2UuYm9keSA9IHtcblx0XHRcdFx0XHRcdGNvbnRlbnQ6IHNyY1NvdXJjZS5zb3VyY2Vcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLnNlbmRFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCA5OTk5LCAnc291cmNlUmVxdWVzdCBlcnJvcicsIG51bGwsIEVycm9yRGVzdGluYXRpb24uVGVsZW1ldHJ5KTtcblx0fVxuXG5cdHByaXZhdGUgX2xvYWRTY3JpcHQoc2NyaXB0SWQ6IG51bWJlcikgOiBQcm9taXNlPFNjcmlwdD4gIHtcblxuXHRcdGNvbnN0IHNjcmlwdCA9IHRoaXMuX3NjcmlwdHMuZ2V0KHNjcmlwdElkKTtcblxuXHRcdGlmIChzY3JpcHQpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoc2NyaXB0KTtcblx0XHR9XG5cblx0XHRjb25zdCBhcmdzID0ge1xuXHRcdFx0dHlwZXM6IDErMis0LFxuXHRcdFx0aW5jbHVkZVNvdXJjZTogdHJ1ZSxcblx0XHRcdGlkczogWyBzY3JpcHRJZCBdXG5cdFx0fTtcblxuXHRcdHRoaXMubG9nKCdscycsIGBfbG9hZFNjcmlwdDogJHtzY3JpcHRJZH1gKTtcblxuXHRcdHJldHVybiB0aGlzLl9ub2RlLnNjcmlwdHMoYXJncykudGhlbihub2RlUmVzcG9uc2UgPT4ge1xuXHRcdFx0Y29uc3QgcyA9IG5ldyBTY3JpcHQobm9kZVJlc3BvbnNlLmJvZHlbMF0pO1xuXHRcdFx0dGhpcy5fc2NyaXB0cy5zZXQoc2NyaXB0SWQsIHMpO1xuXHRcdFx0cmV0dXJuIHM7XG5cdFx0fSk7XG5cdH1cblxuXHQvLy0tLS0gcHJpdmF0ZSBoZWxwZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwdWJsaWMgbG9nKHRyYWNlQ2F0ZWdvcnk6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nKSB7XG5cdFx0aWYgKHRoaXMuX3RyYWNlICYmICh0aGlzLl90cmFjZUFsbCB8fCB0aGlzLl90cmFjZS5pbmRleE9mKHRyYWNlQ2F0ZWdvcnkpID49IDApKSB7XG5cdFx0XHR0aGlzLm91dExpbmUoYCR7cHJvY2Vzcy5waWR9OiAke21lc3NhZ2V9YCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqICdBdHRyaWJ1dGUgbWlzc2luZycgZXJyb3Jcblx0ICovXG5cdHByaXZhdGUgc2VuZEF0dHJpYnV0ZU1pc3NpbmdFcnJvclJlc3BvbnNlKHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlJlc3BvbnNlLCBhdHRyaWJ1dGU6IHN0cmluZykge1xuXHRcdHRoaXMuc2VuZEVycm9yUmVzcG9uc2UocmVzcG9uc2UsIDIwMDUsIGxvY2FsaXplKCdhdHRyaWJ1dGUubWlzc2luZycsIFwiQXR0cmlidXRlICd7MH0nIGlzIG1pc3Npbmcgb3IgZW1wdHkuXCIsIGF0dHJpYnV0ZSkpO1xuXHR9XG5cblx0LyoqXG5cdCAqICdQYXRoIGRvZXMgbm90IGV4aXN0JyBlcnJvclxuXHQgKi9cblx0cHJpdmF0ZSBzZW5kTm90RXhpc3RFcnJvclJlc3BvbnNlKHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlJlc3BvbnNlLCBhdHRyaWJ1dGU6IHN0cmluZywgcGF0aDogc3RyaW5nKSB7XG5cdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZShyZXNwb25zZSwgMjAwNywgbG9jYWxpemUoJ2F0dHJpYnV0ZS5wYXRoLm5vdC5leGlzdCcsIFwiQXR0cmlidXRlICd7MH0nIGRvZXMgbm90IGV4aXN0ICgnezF9JykuXCIsIGF0dHJpYnV0ZSwgJ3twYXRofScpLCB7IHBhdGg6IHBhdGggfSk7XG5cdH1cblxuXHQvKipcblx0ICogJ1BhdGggbm90IGFic29sdXRlJyBlcnJvciB3aXRoICdNb3JlIEluZm9ybWF0aW9uJyBsaW5rLlxuXHQgKi9cblx0cHJpdmF0ZSBzZW5kUmVsYXRpdmVQYXRoRXJyb3JSZXNwb25zZShyZXNwb25zZTogRGVidWdQcm90b2NvbC5SZXNwb25zZSwgYXR0cmlidXRlOiBzdHJpbmcsIHBhdGg6IHN0cmluZykge1xuXG5cdFx0Y29uc3QgZm9ybWF0ID0gbG9jYWxpemUoJ2F0dHJpYnV0ZS5wYXRoLm5vdC5hYnNvbHV0ZScsIFwiQXR0cmlidXRlICd7MH0nIGlzIG5vdCBhYnNvbHV0ZSAoJ3sxfScpOyBjb25zaWRlciBhZGRpbmcgJ3syfScgYXMgYSBwcmVmaXggdG8gbWFrZSBpdCBhYnNvbHV0ZS5cIiwgYXR0cmlidXRlLCAne3BhdGh9JywgJyR7d29ya3NwYWNlUm9vdH0vJyk7XG5cdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZVdpdGhJbmZvTGluayhyZXNwb25zZSwgMjAwOCwgZm9ybWF0LCB7IHBhdGg6IHBhdGggfSwgMjAwMDMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNlbmQgZXJyb3IgcmVzcG9uc2Ugd2l0aCAnTW9yZSBJbmZvcm1hdGlvbicgbGluay5cblx0ICovXG5cdHByaXZhdGUgc2VuZEVycm9yUmVzcG9uc2VXaXRoSW5mb0xpbmsocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuUmVzcG9uc2UsIGNvZGU6IG51bWJlciwgZm9ybWF0OiBzdHJpbmcsIHZhcmlhYmxlczogYW55LCBpbmZvSWQ6IG51bWJlcikge1xuXG5cdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZShyZXNwb25zZSwgPERlYnVnUHJvdG9jb2wuTWVzc2FnZT4ge1xuXHRcdFx0aWQ6IGNvZGUsXG5cdFx0XHRmb3JtYXQ6IGZvcm1hdCxcblx0XHRcdHZhcmlhYmxlczogdmFyaWFibGVzLFxuXHRcdFx0c2hvd1VzZXI6IHRydWUsXG5cdFx0XHR1cmw6ICdodHRwOi8vZ28ubWljcm9zb2Z0LmNvbS9md2xpbmsvP2xpbmtJRD01MzQ4MzIjXycgKyBpbmZvSWQudG9TdHJpbmcoKSxcblx0XHRcdHVybExhYmVsOiBsb2NhbGl6ZSgnbW9yZS5pbmZvcm1hdGlvbicsIFwiTW9yZSBJbmZvcm1hdGlvblwiKVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIHNlbmQgYSBsaW5lIG9mIHRleHQgdG8gYW4gb3V0cHV0IGNoYW5uZWwuXG5cdCAqL1xuXHRwcml2YXRlIG91dExpbmUobWVzc2FnZTogc3RyaW5nLCBjYXRlZ29yeT86IHN0cmluZykge1xuXHRcdHRoaXMuc2VuZEV2ZW50KG5ldyBPdXRwdXRFdmVudChtZXNzYWdlICsgJ1xcbicsIGNhdGVnb3J5ID8gY2F0ZWdvcnkgOiAnY29uc29sZScpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUcmllcyB0byBtYXAgYSAobG9jYWwpIFZTQ29kZSBwYXRoIHRvIGEgY29ycmVzcG9uZGluZyBwYXRoIG9uIGEgcmVtb3RlIGhvc3QgKHdoZXJlIG5vZGUgaXMgcnVubmluZykuXG5cdCAqIFRoZSByZW1vdGUgaG9zdCBtaWdodCB1c2UgYSBkaWZmZXJlbnQgT1Mgc28gd2UgaGF2ZSB0byBtYWtlIHN1cmUgdG8gY3JlYXRlIGNvcnJlY3QgZmlsZSBwYXRocy5cblx0ICovXG5cdHByaXZhdGUgX2xvY2FsVG9SZW1vdGUobG9jYWxQYXRoOiBzdHJpbmcpIDogc3RyaW5nIHtcblx0XHRpZiAodGhpcy5fcmVtb3RlUm9vdCAmJiB0aGlzLl9sb2NhbFJvb3QpIHtcblxuXHRcdFx0bGV0IHJlbFBhdGggPSBQYXRoVXRpbHMubWFrZVJlbGF0aXZlMih0aGlzLl9sb2NhbFJvb3QsIGxvY2FsUGF0aCk7XG5cdFx0XHRsZXQgcmVtb3RlUGF0aCA9IFBhdGhVdGlscy5qb2luKHRoaXMuX3JlbW90ZVJvb3QsIHJlbFBhdGgpO1xuXG5cdFx0XHRpZiAoL15bYS16QS1aXTpbXFwvXFxcXF0vLnRlc3QodGhpcy5fcmVtb3RlUm9vdCkpIHtcdC8vIFdpbmRvd3Ncblx0XHRcdFx0cmVtb3RlUGF0aCA9IFBhdGhVdGlscy50b1dpbmRvd3MocmVtb3RlUGF0aCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubG9nKCdicCcsIGBfbG9jYWxUb1JlbW90ZTogJHtsb2NhbFBhdGh9IC0+ICR7cmVtb3RlUGF0aH1gKTtcblxuXHRcdFx0cmV0dXJuIHJlbW90ZVBhdGg7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBsb2NhbFBhdGg7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRyaWVzIHRvIG1hcCBhIHBhdGggZnJvbSB0aGUgcmVtb3RlIGhvc3QgKHdoZXJlIG5vZGUgaXMgcnVubmluZykgdG8gYSBjb3JyZXNwb25kaW5nIGxvY2FsIHBhdGguXG5cdCAqIFRoZSByZW1vdGUgaG9zdCBtaWdodCB1c2UgYSBkaWZmZXJlbnQgT1Mgc28gd2UgaGF2ZSB0byBtYWtlIHN1cmUgdG8gY3JlYXRlIGNvcnJlY3QgZmlsZSBwYXRocy5cblx0ICovXG5cdHByaXZhdGUgX3JlbW90ZVRvTG9jYWwocmVtb3RlUGF0aDogc3RyaW5nKSA6IHN0cmluZyB7XG5cdFx0aWYgKHRoaXMuX3JlbW90ZVJvb3QgJiYgdGhpcy5fbG9jYWxSb290KSB7XG5cblx0XHRcdGxldCByZWxQYXRoID0gUGF0aFV0aWxzLm1ha2VSZWxhdGl2ZTIodGhpcy5fcmVtb3RlUm9vdCwgcmVtb3RlUGF0aCk7XG5cdFx0XHRsZXQgbG9jYWxQYXRoID0gUGF0aFV0aWxzLmpvaW4odGhpcy5fbG9jYWxSb290LCByZWxQYXRoKTtcblxuXHRcdFx0aWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcdC8vIGxvY2FsIGlzIFdpbmRvd3Ncblx0XHRcdFx0bG9jYWxQYXRoID0gUGF0aFV0aWxzLnRvV2luZG93cyhsb2NhbFBhdGgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmxvZygnYnAnLCBgX3JlbW90ZVRvTG9jYWw6ICR7cmVtb3RlUGF0aH0gLT4gJHtsb2NhbFBhdGh9YCk7XG5cblx0XHRcdHJldHVybiBsb2NhbFBhdGg7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiByZW1vdGVQYXRoO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX3NlbmROb2RlUmVzcG9uc2UocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuUmVzcG9uc2UsIG5vZGVSZXNwb25zZTogTm9kZVY4UmVzcG9uc2UpOiB2b2lkIHtcblx0XHRpZiAobm9kZVJlc3BvbnNlLnN1Y2Nlc3MpIHtcblx0XHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZXJybXNnID0gbm9kZVJlc3BvbnNlLm1lc3NhZ2U7XG5cdFx0XHRpZiAoZXJybXNnLmluZGV4T2YoJ3VucmVzcG9uc2l2ZScpID49IDApIHtcblx0XHRcdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZShyZXNwb25zZSwgMjAxNSwgbG9jYWxpemUoJ1ZTTkQyMDE1JywgXCJSZXF1ZXN0ICd7X3JlcXVlc3R9JyB3YXMgY2FuY2VsbGVkIGJlY2F1c2UgTm9kZS5qcyBpcyB1bnJlc3BvbnNpdmUuXCIpLCB7IF9yZXF1ZXN0OiBub2RlUmVzcG9uc2UuY29tbWFuZCB9ICk7XG5cdFx0XHR9IGVsc2UgaWYgKGVycm1zZy5pbmRleE9mKCd0aW1lb3V0JykgPj0gMCkge1xuXHRcdFx0XHR0aGlzLnNlbmRFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAyMDE2LCBsb2NhbGl6ZSgnVlNORDIwMTYnLCBcIk5vZGUuanMgZGlkIG5vdCByZXBvbmQgdG8gcmVxdWVzdCAne19yZXF1ZXN0fScgaW4gYSByZWFzb25hYmxlIGFtb3VudCBvZiB0aW1lLlwiKSwgeyBfcmVxdWVzdDogbm9kZVJlc3BvbnNlLmNvbW1hbmQgfSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZShyZXNwb25zZSwgMjAxMywgJ05vZGUuanMgcmVxdWVzdCBcXCd7X3JlcXVlc3R9XFwnIGZhaWxlZCAocmVhc29uOiB7X2Vycm9yfSkuJywgeyBfcmVxdWVzdDogbm9kZVJlc3BvbnNlLmNvbW1hbmQsIF9lcnJvcjogZXJybXNnIH0sIEVycm9yRGVzdGluYXRpb24uVGVsZW1ldHJ5KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9jYWNoZShoYW5kbGU6IG51bWJlciwgb2JqOiBWOE9iamVjdCk6IHZvaWQge1xuXHRcdHRoaXMuX3JlZkNhY2hlLnNldChoYW5kbGUsIG9iaik7XG5cdH1cblxuXHRwcml2YXRlIF9nZXRWYWx1ZUZyb21DYWNoZShjb250YWluZXI6IFY4UmVmKTogVjhIYW5kbGUge1xuXHRcdGNvbnN0IHZhbHVlID0gdGhpcy5fcmVmQ2FjaGUuZ2V0KGNvbnRhaW5lci5yZWYpO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH1cblx0XHQvLyBjb25zb2xlLmVycm9yKCdyZWYgbm90IGZvdW5kIGNhY2hlJyk7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRwcml2YXRlIF9yZXNvbHZlVmFsdWVzKG1pcnJvcnM6IFY4UmVmW10pIDogUHJvbWlzZTxWOE9iamVjdFtdPiB7XG5cblx0XHRjb25zdCBuZWVkTG9va3VwID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblx0XHRmb3IgKGxldCBtaXJyb3Igb2YgbWlycm9ycykge1xuXHRcdFx0aWYgKCFtaXJyb3IudmFsdWUgJiYgbWlycm9yLnJlZikge1xuXHRcdFx0XHRpZiAobmVlZExvb2t1cC5pbmRleE9mKG1pcnJvci5yZWYpIDwgMCkge1xuXHRcdFx0XHRcdG5lZWRMb29rdXAucHVzaChtaXJyb3IucmVmKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChuZWVkTG9va3VwLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiB0aGlzLl9yZXNvbHZlVG9DYWNoZShuZWVkTG9va3VwKS50aGVuKCgpID0+IHtcblx0XHRcdFx0cmV0dXJuIG1pcnJvcnMubWFwKG0gPT4gdGhpcy5fcmVmQ2FjaGUuZ2V0KG0ucmVmIHx8IG0uaGFuZGxlKSk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly9yZXR1cm4gUHJvbWlzZS5yZXNvbHZlKDxWOE9iamVjdFtdPm1pcnJvcnMpO1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShtaXJyb3JzLm1hcChtID0+IHRoaXMuX3JlZkNhY2hlLmdldChtLnJlZiB8fCBtLmhhbmRsZSkpKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9yZXNvbHZlVG9DYWNoZShoYW5kbGVzOiBudW1iZXJbXSkgOiBQcm9taXNlPFY4T2JqZWN0W10+IHtcblxuXHRcdGNvbnN0IGxvb2t1cCA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cblx0XHRmb3IgKGxldCBoYW5kbGUgb2YgaGFuZGxlcykge1xuXHRcdFx0Y29uc3QgdmFsID0gdGhpcy5fcmVmQ2FjaGUuZ2V0KGhhbmRsZSk7XG5cdFx0XHRpZiAoIXZhbCkge1xuXHRcdFx0XHRpZiAoaGFuZGxlID49IDApIHtcblx0XHRcdFx0XHRsb29rdXAucHVzaChoYW5kbGUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIGNvbnNvbGUuZXJyb3IoJ3Nob3VsZG4ndCBoYXBwZW46IGNhbm5vdCBsb29rdXAgdHJhbnNpZW50IG9iamVjdHMnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChsb29rdXAubGVuZ3RoID4gMCkge1xuXHRcdFx0Y29uc3QgY21kID0gdGhpcy5fbm9kZUluamVjdGlvbkF2YWlsYWJsZSA/ICd2c2NvZGVfbG9va3VwJyA6ICdsb29rdXAnO1xuXHRcdFx0dGhpcy5sb2coJ3ZhJywgYF9yZXNvbHZlVG9DYWNoZTogJHtjbWR9ICR7bG9va3VwLmxlbmd0aH0gaGFuZGxlc2ApO1xuXHRcdFx0cmV0dXJuIHRoaXMuX25vZGUuY29tbWFuZDIoY21kLCB7IGhhbmRsZXM6IGxvb2t1cCB9KS50aGVuKHJlc3AgPT4ge1xuXG5cdFx0XHRcdGZvciAobGV0IGtleSBpbiByZXNwLmJvZHkpIHtcblx0XHRcdFx0XHRjb25zdCBvYmogPSByZXNwLmJvZHlba2V5XTtcblx0XHRcdFx0XHRjb25zdCBoYW5kbGU6IG51bWJlciA9IG9iai5oYW5kbGU7XG5cdFx0XHRcdFx0dGhpcy5fY2FjaGUoaGFuZGxlLCBvYmopO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGhhbmRsZXMubWFwKGhhbmRsZSA9PiB0aGlzLl9yZWZDYWNoZS5nZXQoaGFuZGxlKSk7XG5cblx0XHRcdH0pLmNhdGNoKHJlc3AgPT4ge1xuXG5cdFx0XHRcdGxldCB2YWw6IGFueTtcblx0XHRcdFx0aWYgKHJlc3AubWVzc2FnZS5pbmRleE9mKCd0aW1lb3V0JykgPj0gMCkge1xuXHRcdFx0XHRcdHZhbCA9IHsgdHlwZTogJ251bWJlcicsIHZhbHVlOiAnPC4uLj4nIH07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFsID0geyB0eXBlOiAnbnVtYmVyJywgdmFsdWU6IGA8ZGF0YSBlcnJvcjogJHtyZXNwLm1lc3NhZ2V9PmAgfTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHN0b3JlIGVycm9yIHZhbHVlIGluIGNhY2hlXG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaGFuZGxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGNvbnN0IGhhbmRsZSA9IGhhbmRsZXNbaV07XG5cdFx0XHRcdFx0Y29uc3QgciA9IHRoaXMuX3JlZkNhY2hlLmdldChoYW5kbGUpO1xuXHRcdFx0XHRcdGlmICghcikge1xuXHRcdFx0XHRcdFx0dGhpcy5fY2FjaGUoaGFuZGxlLCB2YWwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBoYW5kbGVzLm1hcChoYW5kbGUgPT4gdGhpcy5fcmVmQ2FjaGUuZ2V0KGhhbmRsZSkpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoaGFuZGxlcy5tYXAoaGFuZGxlID0+IHRoaXMuX3JlZkNhY2hlLmdldChoYW5kbGUpKSk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfcmVtZW1iZXJFbnRyeUxvY2F0aW9uKHBhdGg6IHN0cmluZywgbGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlcik6IHZvaWQge1xuXHRcdGlmIChwYXRoKSB7XG5cdFx0XHR0aGlzLl9lbnRyeVBhdGggPSBwYXRoO1xuXHRcdFx0dGhpcy5fZW50cnlMaW5lID0gbGluZTtcblx0XHRcdHRoaXMuX2VudHJ5Q29sdW1uID0gdGhpcy5fYWRqdXN0Q29sdW1uKGxpbmUsIGNvbHVtbik7XG5cdFx0XHR0aGlzLl9nb3RFbnRyeUV2ZW50ID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogd29ya2Fyb3VuZCBmb3IgY29sdW1uIGJlaW5nIG9mZiBpbiB0aGUgZmlyc3QgbGluZSAoYmVjYXVzZSBvZiBhIHdyYXBwZWQgYW5vbnltb3VzIGZ1bmN0aW9uKVxuXHQgKi9cblx0cHJpdmF0ZSBfYWRqdXN0Q29sdW1uKGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIpOiBudW1iZXIge1xuXHRcdGlmIChsaW5lID09PSAwKSB7XG5cdFx0XHRjb2x1bW4gLT0gTm9kZURlYnVnU2Vzc2lvbi5GSVJTVF9MSU5FX09GRlNFVDtcblx0XHRcdGlmIChjb2x1bW4gPCAwKSB7XG5cdFx0XHRcdGNvbHVtbiA9IDA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBjb2x1bW47XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBzY3JpcHQgaWQgZm9yIHRoZSBnaXZlbiBzY3JpcHQgbmFtZSBvciAtMSBpZiBub3QgZm91bmQuXG5cdCAqL1xuXHRwcml2YXRlIF9maW5kTW9kdWxlKG5hbWU6IHN0cmluZykgOiBQcm9taXNlPG51bWJlcj4ge1xuXG5cdFx0Y29uc3QgYXJncyA9IHtcblx0XHRcdHR5cGVzOiAxICsgMiArIDQsXG5cdFx0XHRmaWx0ZXI6IG5hbWVcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHRoaXMuX25vZGUuc2NyaXB0cyhhcmdzKS50aGVuKHJlc3AgPT4ge1xuXHRcdFx0Zm9yIChsZXQgcmVzdWx0IG9mIHJlc3AuYm9keSkge1xuXHRcdFx0XHRpZiAocmVzdWx0Lm5hbWUgPT09IG5hbWUpIHtcdC8vIHJldHVybiB0aGUgZmlyc3QgZXhhY3QgbWF0Y2hcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0LmlkO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gLTE7XHQvLyBub3QgZm91bmRcblx0XHR9KS5jYXRjaChlcnIgPT4ge1xuXHRcdFx0cmV0dXJuIC0xO1x0Ly8gZXJyb3Jcblx0XHR9KTtcblx0fVxuXG5cdC8vLS0tLSBwcml2YXRlIHN0YXRpYyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwcml2YXRlIHN0YXRpYyBpc0phdmFTY3JpcHQocGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG5cblx0XHRjb25zdCBuYW1lID0gUGF0aC5iYXNlbmFtZShwYXRoKS50b0xvd2VyQ2FzZSgpO1xuXHRcdGlmIChlbmRzV2l0aChuYW1lLCAnLmpzJykpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBidWZmZXIgPSBuZXcgQnVmZmVyKDMwKTtcblx0XHRcdGNvbnN0IGZkID0gRlMub3BlblN5bmMocGF0aCwgJ3InKTtcblx0XHRcdEZTLnJlYWRTeW5jKGZkLCBidWZmZXIsIDAsIGJ1ZmZlci5sZW5ndGgsIDApO1xuXHRcdFx0RlMuY2xvc2VTeW5jKGZkKTtcblx0XHRcdGNvbnN0IGxpbmUgPSBidWZmZXIudG9TdHJpbmcoKTtcblx0XHRcdGlmIChOb2RlRGVidWdTZXNzaW9uLk5PREVfU0hFQkFOR19NQVRDSEVSLnRlc3QobGluZSkpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHQvLyBzaWxlbnRseSBpZ25vcmUgcHJvYmxlbXNcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBjb21wYXJlVmFyaWFibGVOYW1lcyh2MTogVmFyaWFibGUsIHYyOiBWYXJpYWJsZSk6IG51bWJlciB7XG5cdFx0bGV0IG4xID0gdjEubmFtZTtcblx0XHRsZXQgbjIgPSB2Mi5uYW1lO1xuXG5cdFx0aWYgKG4xID09PSBOb2RlRGVidWdTZXNzaW9uLlBST1RPKSB7XG5cdFx0XHRyZXR1cm4gMTtcblx0XHR9XG5cdFx0aWYgKG4yID09PSBOb2RlRGVidWdTZXNzaW9uLlBST1RPKSB7XG5cdFx0XHRyZXR1cm4gLTE7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCBbbl0sIFtuLi5tXSAtPiBuXG5cdFx0bjEgPSBOb2RlRGVidWdTZXNzaW9uLmV4dHJhY3ROdW1iZXIobjEpO1xuXHRcdG4yID0gTm9kZURlYnVnU2Vzc2lvbi5leHRyYWN0TnVtYmVyKG4yKTtcblxuXHRcdGNvbnN0IGkxID0gcGFyc2VJbnQobjEpO1xuXHRcdGNvbnN0IGkyID0gcGFyc2VJbnQobjIpO1xuXHRcdGNvbnN0IGlzTnVtMSA9ICFpc05hTihpMSk7XG5cdFx0Y29uc3QgaXNOdW0yID0gIWlzTmFOKGkyKTtcblxuXHRcdGlmIChpc051bTEgJiYgIWlzTnVtMikge1xuXHRcdFx0cmV0dXJuIDE7XHRcdC8vIG51bWJlcnMgYWZ0ZXIgbmFtZXNcblx0XHR9XG5cdFx0aWYgKCFpc051bTEgJiYgaXNOdW0yKSB7XG5cdFx0XHRyZXR1cm4gLTE7XHRcdC8vIG5hbWVzIGJlZm9yZSBudW1iZXJzXG5cdFx0fVxuXHRcdGlmIChpc051bTEgJiYgaXNOdW0yKSB7XG5cdFx0XHRyZXR1cm4gaTEgLSBpMjtcblx0XHR9XG5cdFx0cmV0dXJuIG4xLmxvY2FsZUNvbXBhcmUobjIpO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgZXh0cmFjdE51bWJlcihzOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdGlmIChzWzBdID09PSAnWycgJiYgc1tzLmxlbmd0aC0xXSA9PT0gJ10nKSB7XG5cdFx0XHRzID0gcy5zdWJzdHJpbmcoMSwgcy5sZW5ndGggLSAxKTtcblx0XHRcdGNvbnN0IHAgPSBzLmluZGV4T2YoJy4uJyk7XG5cdFx0XHRpZiAocCA+PSAwKSB7XG5cdFx0XHRcdHMgPSBzLnN1YnN0cmluZygwLCBwKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHM7XG5cdH1cbn1cblxuZnVuY3Rpb24gZW5kc1dpdGgoc3RyLCBzdWZmaXgpOiBib29sZWFuIHtcblx0cmV0dXJuIHN0ci5pbmRleE9mKHN1ZmZpeCwgc3RyLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcbn1cblxuZnVuY3Rpb24gcmFuZG9tKGxvdzogbnVtYmVyLCBoaWdoOiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGhpZ2ggLSBsb3cpICsgbG93KTtcbn1cblxuZnVuY3Rpb24gaXNBcnJheSh3aGF0OiBhbnkpOiBib29sZWFuIHtcblx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh3aGF0KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuZnVuY3Rpb24gZXh0ZW5kT2JqZWN0PFQ+IChvYmplY3RDb3B5OiBULCBvYmplY3Q6IFQpOiBUIHtcblxuXHRmb3IgKGxldCBrZXkgaW4gb2JqZWN0KSB7XG5cdFx0aWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRvYmplY3RDb3B5W2tleV0gPSBvYmplY3Rba2V5XTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG9iamVjdENvcHk7XG59XG5cblxuRGVidWdTZXNzaW9uLnJ1bihOb2RlRGVidWdTZXNzaW9uKTtcbiJdfQ==
