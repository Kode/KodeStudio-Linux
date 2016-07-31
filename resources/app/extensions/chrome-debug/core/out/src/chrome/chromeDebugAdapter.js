/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var vscode_debugadapter_1 = require('vscode-debugadapter');
var ChromeUtils = require('./chromeUtils');
var utils = require('../utils');
var logger = require('../logger');
var consoleHelper_1 = require('./consoleHelper');
var child_process_1 = require('child_process');
var path = require('path');
var ChromeDebugAdapter = (function () {
    function ChromeDebugAdapter(chromeConnection) {
        this._chromeConnection = chromeConnection;
        this._variableHandles = new vscode_debugadapter_1.Handles();
        this._overlayHelper = new utils.DebounceHelper(/*timeoutMs=*/ 200);
        this.clearEverything();
    }
    Object.defineProperty(ChromeDebugAdapter.prototype, "paused", {
        get: function () {
            return !!this._currentStack;
        },
        enumerable: true,
        configurable: true
    });
    ChromeDebugAdapter.prototype.clearTargetContext = function () {
        this._scriptsById = new Map();
        this._scriptsByUrl = new Map();
        this._committedBreakpointsByUrl = new Map();
        this._setBreakpointsRequestQ = Promise.resolve();
        this.fireEvent(new vscode_debugadapter_1.Event('clearTargetContext'));
    };
    ChromeDebugAdapter.prototype.clearClientContext = function () {
        this._clientAttached = false;
        this.fireEvent(new vscode_debugadapter_1.Event('clearClientContext'));
    };
    ChromeDebugAdapter.prototype.registerEventHandler = function (eventHandler) {
        this._eventHandler = eventHandler;
    };
    ChromeDebugAdapter.prototype.initialize = function (args) {
        // This debug adapter supports two exception breakpoint filters
        return {
            exceptionBreakpointFilters: [
                {
                    label: 'All Exceptions',
                    filter: 'all',
                    default: false
                },
                {
                    label: 'Uncaught Exceptions',
                    filter: 'uncaught',
                    default: true
                }
            ]
        };
    };
    ChromeDebugAdapter.prototype.launch = function (args) {
        var _this = this;
        this.setupLogging(args);
        this.fireEvent(new vscode_debugadapter_1.OutputEvent('Using Kha from ' + args.kha + '\n', 'stdout'));
        return new Promise(function (resolve, reject) {
            var options = {
                from: args.cwd,
                to: path.join(args.cwd, 'build'),
                projectfile: 'khafile.js',
                target: 'debug-html5',
                vr: 'none',
                pch: false,
                intermediate: '',
                graphics: 'direct3d9',
                visualstudio: 'vs2015',
                kha: '',
                haxe: '',
                ogg: '',
                aac: '',
                mp3: '',
                h264: '',
                webm: '',
                wmv: '',
                theora: '',
                kfx: '',
                krafix: '',
                ffmpeg: args.ffmpeg,
                nokrafix: false,
                embedflashassets: false,
                compile: false,
                run: false,
                init: false,
                name: 'Project',
                server: false,
                port: 8080,
                debug: false,
                silent: false,
                watch: false
            };
            require(path.join(args.kha, 'Tools/khamake/out/main.js')).run(options, {
                info: function (message) {
                    _this.fireEvent(new vscode_debugadapter_1.OutputEvent(message + '\n', 'stdout'));
                }, error: function (message) {
                    _this.fireEvent(new vscode_debugadapter_1.OutputEvent(message + '\n', 'stderr'));
                }
            }).then(function (value) {
                // Check exists?
                var chromePath = args.runtimeExecutable;
                var chromeDir = chromePath;
                if (chromePath.lastIndexOf('/') >= 0)
                    chromeDir = chromePath.substring(0, chromePath.lastIndexOf('/'));
                else if (chromePath.lastIndexOf('\\') >= 0)
                    chromeDir = chromePath.substring(0, chromePath.lastIndexOf('\\'));
                // Start with remote debugging enabled
                var port = args.port || Math.floor((Math.random() * 10000) + 10000);
                var chromeArgs = ['--chromedebug', '--remote-debugging-port=' + port];
                chromeArgs.push(path.resolve(args.cwd, args.file));
                var launchUrl;
                if (args.file) {
                    launchUrl = utils.pathToFileURL(path.join(args.cwd, args.file, 'index.html'));
                }
                else if (args.url) {
                    launchUrl = args.url;
                }
                logger.log("spawn('" + chromePath + "', " + JSON.stringify(chromeArgs) + ")");
                _this._chromeProc = child_process_1.spawn(chromePath, chromeArgs, {
                    detached: true,
                    stdio: ['ignore'],
                    cwd: chromeDir
                });
                _this._chromeProc.unref();
                _this._chromeProc.on('error', function (err) {
                    logger.log('chrome error: ' + err);
                    _this.terminateSession();
                });
                _this._attach(port, launchUrl, args.address).then(function () {
                    resolve();
                });
            }, function (reason) {
                _this.fireEvent(new vscode_debugadapter_1.OutputEvent('Launch canceled.\n', 'stderr'));
                resolve();
                _this.fireEvent(new vscode_debugadapter_1.TerminatedEvent());
                _this.clearEverything();
            });
        });
    };
    ChromeDebugAdapter.prototype.attach = function (args) {
        if (args.port == null) {
            return utils.errP('The "port" field is required in the attach config.');
        }
        this.setupLogging(args);
        return this._attach(args.port, args.url, args.address);
    };
    ChromeDebugAdapter.prototype.setupLogging = function (args) {
        var minLogLevel = args.verboseDiagnosticLogging ?
            logger.LogLevel.Verbose :
            args.diagnosticLogging ?
                logger.LogLevel.Log :
                logger.LogLevel.Error;
        logger.setMinLogLevel(minLogLevel);
        if (!args.webRoot) {
            logger.log('WARNING: "webRoot" is not set - if resolving sourcemaps fails, please set the "webRoot" property in the launch config.');
        }
    };
    /**
     * Chrome is closing, or error'd somehow, stop the debug session
     */
    ChromeDebugAdapter.prototype.terminateSession = function () {
        if (this._clientAttached) {
            this.fireEvent(new vscode_debugadapter_1.TerminatedEvent());
        }
        this.clearEverything();
    };
    ChromeDebugAdapter.prototype.clearEverything = function () {
        this.clearClientContext();
        this.clearTargetContext();
        this._chromeProc = null;
        if (this._chromeConnection.isAttached) {
            this._chromeConnection.close();
        }
    };
    ChromeDebugAdapter.prototype._attach = function (port, url, address) {
        var _this = this;
        // Client is attaching - if not attached to the chrome target, create a connection and attach
        this._clientAttached = true;
        if (!this._chromeConnection.isAttached) {
            this._chromeConnection.on('Debugger.paused', function (params) { return _this.onDebuggerPaused(params); });
            this._chromeConnection.on('Debugger.resumed', function () { return _this.onDebuggerResumed(); });
            this._chromeConnection.on('Debugger.scriptParsed', function (params) { return _this.onScriptParsed(params); });
            this._chromeConnection.on('Debugger.globalObjectCleared', function () { return _this.onGlobalObjectCleared(); });
            this._chromeConnection.on('Debugger.breakpointResolved', function (params) { return _this.onBreakpointResolved(params); });
            this._chromeConnection.on('Console.messageAdded', function (params) { return _this.onConsoleMessage(params); });
            this._chromeConnection.on('Inspector.detached', function () { return _this.terminateSession(); });
            this._chromeConnection.on('close', function () { return _this.terminateSession(); });
            this._chromeConnection.on('error', function () { return _this.terminateSession(); });
            return this._chromeConnection.attach(port, url, address).then(function () { return _this.fireEvent(new vscode_debugadapter_1.InitializedEvent()); }, function (e) {
                _this.clearEverything();
                return utils.errP(e);
            });
        }
        else {
            return Promise.resolve();
        }
    };
    ChromeDebugAdapter.prototype.fireEvent = function (event) {
        if (this._eventHandler) {
            this._eventHandler(event);
        }
    };
    /**
     * e.g. the target navigated
     */
    ChromeDebugAdapter.prototype.onGlobalObjectCleared = function () {
        this.clearTargetContext();
    };
    ChromeDebugAdapter.prototype.onDebuggerPaused = function (notification) {
        var _this = this;
        this._overlayHelper.doAndCancel(function () { return _this._chromeConnection.page_setOverlayMessage(ChromeDebugAdapter.PAGE_PAUSE_MESSAGE); });
        this._currentStack = notification.callFrames;
        // We can tell when we've broken on an exception. Otherwise if hitBreakpoints is set, assume we hit a
        // breakpoint. If not set, assume it was a step. We can't tell the difference between step and 'break on anything'.
        var reason;
        var exceptionText;
        if (notification.reason === 'exception') {
            reason = 'exception';
            if (notification.data && this._currentStack.length) {
                // Insert a scope to wrap the exception object. exceptionText is unused by Code at the moment.
                var remoteObjValue = ChromeUtils.remoteObjectToValue(notification.data, /*stringify=*/ false);
                var scopeObject = void 0;
                if (remoteObjValue.variableHandleRef) {
                    // If the remote object is an object (probably an Error), treat the object like a scope.
                    exceptionText = notification.data.description;
                    scopeObject = notification.data;
                }
                else {
                    // If it's a value, use a special flag and save the value for later.
                    exceptionText = notification.data.value;
                    scopeObject = { objectId: ChromeDebugAdapter.EXCEPTION_VALUE_ID };
                    this._exceptionValueObject = notification.data;
                }
                this._currentStack[0].scopeChain.unshift({ type: 'Exception', object: scopeObject });
            }
        }
        else {
            reason = (notification.hitBreakpoints && notification.hitBreakpoints.length) ? 'breakpoint' : 'step';
        }
        this.fireEvent(new vscode_debugadapter_1.StoppedEvent(reason, /*threadId=*/ ChromeDebugAdapter.THREAD_ID, exceptionText));
    };
    ChromeDebugAdapter.prototype.onDebuggerResumed = function () {
        var _this = this;
        this._overlayHelper.wait(function () { return _this._chromeConnection.page_clearOverlayMessage(); });
        this._currentStack = null;
        if (!this._expectingResumedEvent) {
            // This is a private undocumented event provided by VS Code to support the 'continue' button on a paused Chrome page
            var resumedEvent = new vscode_debugadapter_1.Event('continued', { threadId: ChromeDebugAdapter.THREAD_ID });
            this.fireEvent(resumedEvent);
        }
        else {
            this._expectingResumedEvent = false;
        }
    };
    ChromeDebugAdapter.prototype.onScriptParsed = function (script) {
        // Totally ignore extension scripts, internal Chrome scripts, and so on
        if (this.shouldIgnoreScript(script)) {
            return;
        }
        if (!script.url) {
            script.url = ChromeDebugAdapter.PLACEHOLDER_URL_PROTOCOL + script.scriptId;
        }
        this._scriptsById.set(script.scriptId, script);
        this._scriptsByUrl.set(script.url, script);
        this.fireEvent(new vscode_debugadapter_1.Event('scriptParsed', { scriptUrl: script.url, sourceMapURL: script.sourceMapURL }));
    };
    ChromeDebugAdapter.prototype.onBreakpointResolved = function (params) {
        var script = this._scriptsById.get(params.location.scriptId);
        if (!script) {
            // Breakpoint resolved for a script we don't know about
            return;
        }
        var committedBps = this._committedBreakpointsByUrl.get(script.url) || [];
        committedBps.push(params.breakpointId);
        this._committedBreakpointsByUrl.set(script.url, committedBps);
    };
    ChromeDebugAdapter.prototype.onConsoleMessage = function (params) {
        var formattedMessage = consoleHelper_1.formatConsoleMessage(params.message);
        if (formattedMessage) {
            this.fireEvent(new vscode_debugadapter_1.OutputEvent(formattedMessage.text + '\n', formattedMessage.isError ? 'stderr' : 'stdout'));
        }
    };
    ChromeDebugAdapter.prototype.disconnect = function () {
        if (this._chromeProc) {
            this._chromeProc.kill('SIGINT');
            this._chromeProc = null;
        }
        this.clearEverything();
        return Promise.resolve();
    };
    ChromeDebugAdapter.prototype.setBreakpoints = function (args) {
        var _this = this;
        var targetScriptUrl;
        if (args.source.path) {
            targetScriptUrl = args.source.path;
        }
        else if (args.source.sourceReference) {
            var targetScript = this._scriptsById.get(sourceReferenceToScriptId(args.source.sourceReference));
            if (targetScript) {
                targetScriptUrl = targetScript.url;
            }
        }
        if (targetScriptUrl) {
            // DebugProtocol sends all current breakpoints for the script. Clear all scripts for the breakpoint then add all of them
            var setBreakpointsPFailOnError = this._setBreakpointsRequestQ
                .then(function () { return _this.clearAllBreakpoints(targetScriptUrl); })
                .then(function () { return _this.addBreakpoints(targetScriptUrl, args.lines, args.cols); })
                .then(function (responses) { return ({ breakpoints: _this.chromeBreakpointResponsesToODPBreakpoints(targetScriptUrl, responses, args.lines) }); });
            var setBreakpointsPTimeout = utils.promiseTimeout(setBreakpointsPFailOnError, /*timeoutMs*/ 2000, 'Set breakpoints request timed out');
            // Do just one setBreakpointsRequest at a time to avoid interleaving breakpoint removed/breakpoint added requests to Chrome.
            // Swallow errors in the promise queue chain so it doesn't get blocked, but return the failing promise for error handling.
            this._setBreakpointsRequestQ = setBreakpointsPTimeout.catch(function () { return undefined; });
            return setBreakpointsPTimeout;
        }
        else {
            return utils.errP("Can't find script for breakpoint request");
        }
    };
    ChromeDebugAdapter.prototype.setFunctionBreakpoints = function () {
        return Promise.resolve();
    };
    ChromeDebugAdapter.prototype.clearAllBreakpoints = function (url) {
        var _this = this;
        if (!this._committedBreakpointsByUrl.has(url)) {
            return Promise.resolve();
        }
        // Remove breakpoints one at a time. Seems like it would be ok to send the removes all at once,
        // but there is a chrome bug where when removing 5+ or so breakpoints at once, it gets into a weird
        // state where later adds on the same line will fail with 'breakpoint already exists' even though it
        // does not break there.
        return this._committedBreakpointsByUrl.get(url).reduce(function (p, bpId) {
            return p.then(function () { return _this._chromeConnection.debugger_removeBreakpoint(bpId); }).then(function () { });
        }, Promise.resolve()).then(function () {
            _this._committedBreakpointsByUrl.set(url, null);
        });
    };
    ChromeDebugAdapter.prototype.addBreakpoints = function (url, lines, cols) {
        var _this = this;
        var responsePs;
        if (url.startsWith(ChromeDebugAdapter.PLACEHOLDER_URL_PROTOCOL)) {
            // eval script with no real url - use debugger_setBreakpoint
            var scriptId_1 = utils.lstrip(url, ChromeDebugAdapter.PLACEHOLDER_URL_PROTOCOL);
            responsePs = lines.map(function (lineNumber, i) { return _this._chromeConnection.debugger_setBreakpoint({ scriptId: scriptId_1, lineNumber: lineNumber, columnNumber: cols ? cols[i] : 0 }); });
        }
        else {
            // script that has a url - use debugger_setBreakpointByUrl so that Chrome will rebind the breakpoint immediately
            // after refreshing the page. This is the only way to allow hitting breakpoints in code that runs immediately when
            // the page loads.
            var script_1 = this._scriptsByUrl.get(url);
            responsePs = lines.map(function (lineNumber, i) {
                return _this._chromeConnection.debugger_setBreakpointByUrl(url, lineNumber, cols ? cols[i] : 0).then(function (response) {
                    // Now convert the response to a SetBreakpointResponse so both response types can be handled the same
                    var locations = response.result.locations;
                    return {
                        id: response.id,
                        error: response.error,
                        result: {
                            breakpointId: response.result.breakpointId,
                            actualLocation: locations[0] && {
                                lineNumber: locations[0].lineNumber,
                                columnNumber: locations[0].columnNumber,
                                scriptId: script_1.scriptId
                            }
                        }
                    };
                });
            });
        }
        // Join all setBreakpoint requests to a single promise
        return Promise.all(responsePs);
    };
    ChromeDebugAdapter.prototype.chromeBreakpointResponsesToODPBreakpoints = function (url, responses, requestLines) {
        // Don't cache errored responses
        var committedBpIds = responses
            .filter(function (response) { return !response.error; })
            .map(function (response) { return response.result.breakpointId; });
        // Cache successfully set breakpoint ids from chrome in committedBreakpoints set
        this._committedBreakpointsByUrl.set(url, committedBpIds);
        // Map committed breakpoints to DebugProtocol response breakpoints
        return responses
            .map(function (response, i) {
            // The output list needs to be the same length as the input list, so map errors to
            // unverified breakpoints.
            if (response.error || !response.result.actualLocation) {
                return {
                    verified: false,
                    line: requestLines[i],
                    column: 0
                };
            }
            return {
                verified: true,
                line: response.result.actualLocation.lineNumber,
                column: response.result.actualLocation.columnNumber
            };
        });
    };
    ChromeDebugAdapter.prototype.setExceptionBreakpoints = function (args) {
        var state;
        if (args.filters.indexOf('all') >= 0) {
            state = 'all';
        }
        else if (args.filters.indexOf('uncaught') >= 0) {
            state = 'uncaught';
        }
        else {
            state = 'none';
        }
        return this._chromeConnection.debugger_setPauseOnExceptions(state)
            .then(function () { });
    };
    ChromeDebugAdapter.prototype.continue = function () {
        this._expectingResumedEvent = true;
        return this._chromeConnection.debugger_resume()
            .then(function () { });
    };
    ChromeDebugAdapter.prototype.next = function () {
        this._expectingResumedEvent = true;
        return this._chromeConnection.debugger_stepOver()
            .then(function () { });
    };
    ChromeDebugAdapter.prototype.stepIn = function () {
        this._expectingResumedEvent = true;
        return this._chromeConnection.debugger_stepIn()
            .then(function () { });
    };
    ChromeDebugAdapter.prototype.stepOut = function () {
        this._expectingResumedEvent = true;
        return this._chromeConnection.debugger_stepOut()
            .then(function () { });
    };
    ChromeDebugAdapter.prototype.pause = function () {
        return this._chromeConnection.debugger_pause()
            .then(function () { });
    };
    ChromeDebugAdapter.prototype.stackTrace = function (args) {
        var _this = this;
        // Only process at the requested number of frames, if 'levels' is specified
        var stack = this._currentStack;
        if (args.levels) {
            stack = this._currentStack.filter(function (_, i) { return i < args.levels; });
        }
        var stackFrames = stack
            .map(function (_a, i) {
            var location = _a.location, functionName = _a.functionName;
            var line = location.lineNumber;
            var column = location.columnNumber;
            var script = _this._scriptsById.get(location.scriptId);
            try {
                // When the script has a url and isn't one we're ignoring, send the name and path fields. PathTransformer will
                // attempt to resolve it to a script in the workspace. Otherwise, send the name and sourceReference fields.
                var source = script && !_this.shouldIgnoreScript(script) ?
                    {
                        name: path.basename(script.url),
                        path: script.url,
                        sourceReference: scriptIdToSourceReference(script.scriptId) // will be 0'd out by PathTransformer if not needed
                    } :
                    {
                        // Name should be undefined, work around VS Code bug 20274
                        name: 'eval: ' + location.scriptId,
                        path: ChromeDebugAdapter.PLACEHOLDER_URL_PROTOCOL + location.scriptId,
                        sourceReference: scriptIdToSourceReference(location.scriptId)
                    };
                // If the frame doesn't have a function name, it's either an anonymous function
                // or eval script. If its source has a name, it's probably an anonymous function.
                var frameName = functionName || (script.url ? '(anonymous function)' : '(eval code)');
                return {
                    id: i,
                    name: frameName,
                    source: source,
                    line: line,
                    column: column
                };
            }
            catch (e) {
                // Some targets such as the iOS simulator behave badly and return nonsense callFrames.
                // In these cases, return a dummy stack frame
                return {
                    id: i,
                    name: 'Unknown',
                    source: { name: 'eval:Unknown' },
                    line: line,
                    column: column
                };
            }
        });
        return { stackFrames: stackFrames };
    };
    ChromeDebugAdapter.prototype.scopes = function (args) {
        var _this = this;
        var scopes = this._currentStack[args.frameId].scopeChain.map(function (scope, i) {
            var scopeHandle = { objectId: scope.object.objectId };
            if (i === 0) {
                // The first scope should include 'this'. Keep the RemoteObject reference for use by the variables request
                scopeHandle.thisObj = _this._currentStack[args.frameId]['this'];
            }
            return {
                name: scope.type.substr(0, 1).toUpperCase() + scope.type.substr(1),
                variablesReference: _this._variableHandles.create(scopeHandle),
                expensive: scope.type === 'global'
            };
        });
        return { scopes: scopes };
    };
    ChromeDebugAdapter.prototype.variables = function (args) {
        var _this = this;
        var handle = this._variableHandles.get(args.variablesReference);
        if (handle.objectId === ChromeDebugAdapter.EXCEPTION_VALUE_ID) {
            // If this is the special marker for an exception value, create a fake property descriptor so the usual route can be used
            var excValuePropDescriptor = { name: 'exception', value: this._exceptionValueObject };
            return Promise.resolve({ variables: [this.propertyDescriptorToVariable(excValuePropDescriptor)] });
        }
        else if (handle != null) {
            return Promise.all([
                // Need to make two requests to get all properties
                this._chromeConnection.runtime_getProperties(handle.objectId, /*ownProperties=*/ false, /*accessorPropertiesOnly=*/ true),
                this._chromeConnection.runtime_getProperties(handle.objectId, /*ownProperties=*/ true, /*accessorPropertiesOnly=*/ false)
            ]).then(function (getPropsResponses) {
                // Sometimes duplicates will be returned - merge all property descriptors returned
                var propsByName = new Map();
                getPropsResponses.forEach(function (response) {
                    if (!response.error) {
                        response.result.result.forEach(function (propDesc) {
                            return propsByName.set(propDesc.name, propDesc);
                        });
                    }
                });
                // Convert Chrome prop descriptors to DebugProtocol vars, sort the result
                var variables = [];
                propsByName.forEach(function (propDesc) { return variables.push(_this.propertyDescriptorToVariable(propDesc)); });
                variables.sort(function (var1, var2) { return var1.name.localeCompare(var2.name); });
                // If this is a scope that should have the 'this', prop, insert it at the top of the list
                if (handle.thisObj) {
                    variables.unshift(_this.propertyDescriptorToVariable({ name: 'this', value: handle.thisObj }));
                }
                return { variables: variables };
            });
        }
        else {
            return Promise.resolve(undefined);
        }
    };
    ChromeDebugAdapter.prototype.source = function (args) {
        return this._chromeConnection.debugger_getScriptSource(sourceReferenceToScriptId(args.sourceReference)).then(function (chromeResponse) {
            return { content: chromeResponse.result.scriptSource };
        });
    };
    ChromeDebugAdapter.prototype.threads = function () {
        return {
            threads: [
                {
                    id: ChromeDebugAdapter.THREAD_ID,
                    name: 'Thread ' + ChromeDebugAdapter.THREAD_ID
                }
            ]
        };
    };
    ChromeDebugAdapter.prototype.evaluate = function (args) {
        var _this = this;
        var evalPromise;
        if (this.paused) {
            var callFrameId = this._currentStack[args.frameId].callFrameId;
            evalPromise = this._chromeConnection.debugger_evaluateOnCallFrame(callFrameId, args.expression);
        }
        else {
            evalPromise = this._chromeConnection.runtime_evaluate(args.expression);
        }
        return evalPromise.then(function (evalResponse) {
            if (evalResponse.result.wasThrown) {
                var evalResult = evalResponse.result;
                var errorMessage = 'Error';
                if (evalResult.exceptionDetails) {
                    errorMessage = evalResult.exceptionDetails.text;
                }
                else if (evalResult.result && evalResult.result.description) {
                    errorMessage = evalResult.result.description;
                }
                return utils.errP(errorMessage);
            }
            var _a = _this.remoteObjectToValueWithHandle(evalResponse.result.result), value = _a.value, variablesReference = _a.variablesReference;
            return { result: value, variablesReference: variablesReference };
        });
    };
    ChromeDebugAdapter.prototype.propertyDescriptorToVariable = function (propDesc) {
        if (propDesc.get || propDesc.set) {
            // A property doesn't have a value here, and we shouldn't evaluate the getter because it may have side effects.
            // Node adapter shows 'undefined', Chrome can eval the getter on demand.
            return { name: propDesc.name, value: 'property', variablesReference: 0 };
        }
        else {
            var _a = this.remoteObjectToValueWithHandle(propDesc.value), value = _a.value, variablesReference = _a.variablesReference;
            return { name: propDesc.name, value: value, variablesReference: variablesReference };
        }
    };
    /**
     * Run the object through ChromeUtilities.remoteObjectToValue, and if it returns a variableHandle reference,
     * use it with this instance's variableHandles to create a variable handle.
     */
    ChromeDebugAdapter.prototype.remoteObjectToValueWithHandle = function (object) {
        var _a = ChromeUtils.remoteObjectToValue(object), value = _a.value, variableHandleRef = _a.variableHandleRef;
        var result = { value: value, variablesReference: 0 };
        if (variableHandleRef) {
            result.variablesReference = this._variableHandles.create({ objectId: variableHandleRef });
        }
        return result;
    };
    ChromeDebugAdapter.prototype.shouldIgnoreScript = function (script) {
        return script.isContentScript || script.isInternalScript || script.url.startsWith('extensions::') || script.url.startsWith('chrome-extension://');
    };
    ChromeDebugAdapter.THREAD_ID = 1;
    ChromeDebugAdapter.PAGE_PAUSE_MESSAGE = 'Paused in Kode Studio';
    ChromeDebugAdapter.EXCEPTION_VALUE_ID = 'EXCEPTION_VALUE_ID';
    ChromeDebugAdapter.PLACEHOLDER_URL_PROTOCOL = 'debugadapter://';
    return ChromeDebugAdapter;
}());
exports.ChromeDebugAdapter = ChromeDebugAdapter;
function scriptIdToSourceReference(scriptId) {
    return parseInt(scriptId, 10);
}
function sourceReferenceToScriptId(sourceReference) {
    return '' + sourceReference;
}

//# sourceMappingURL=chromeDebugAdapter.js.map
