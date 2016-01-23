/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
var v8Protocol_1 = require('../common/v8Protocol');
var debugSession_1 = require('../common/debugSession');
var handles_1 = require('../common/handles');
var webKitConnection_1 = require('./webKitConnection');
var utils = require('./utilities');
var utilities_1 = require('./utilities');
var consoleHelper_1 = require('./consoleHelper');
var child_process_1 = require('child_process');
var fs = require('fs');
var path = require('path');
var WebKitDebugAdapter = (function () {
    function WebKitDebugAdapter() {
        this._variableHandles = new handles_1.Handles();
        this._overlayHelper = new utils.DebounceHelper(/*timeoutMs=*/ 200);
        this.clearEverything();
    }
    Object.defineProperty(WebKitDebugAdapter.prototype, "paused", {
        get: function () {
            return !!this._currentStack;
        },
        enumerable: true,
        configurable: true
    });
    WebKitDebugAdapter.prototype.clearTargetContext = function () {
        this._scriptsById = new Map();
        this._committedBreakpointsByUrl = new Map();
        this._setBreakpointsRequestQ = Promise.resolve();
        this.fireEvent(new v8Protocol_1.Event('clearTargetContext'));
    };
    WebKitDebugAdapter.prototype.clearClientContext = function () {
        this._clientAttached = false;
        this.fireEvent(new v8Protocol_1.Event('clearClientContext'));
    };
    WebKitDebugAdapter.prototype.registerEventHandler = function (eventHandler) {
        this._eventHandler = eventHandler;
    };
    WebKitDebugAdapter.prototype.initialize = function (args) {
        // Cache to log if diagnostic logging is enabled later
        this._initArgs = args;
    };
    WebKitDebugAdapter.prototype.launch = function (args) {
        var _this = this;
        this.initDiagnosticLogging('launch', args);
        return new Promise(function (resolve, reject) {
            fs.stat(path.resolve(args.cwd, 'Kha'), function (err, stats) {
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
                    nokrafix: false,
                    embedflashassets: false,
                    compile: false,
                    run: false,
                    init: false,
                    name: 'Project',
                    server: false,
                    port: 8080,
                    debug: false,
                    silent: false
                };
                if (err == null) {
                    try {
                        require(path.join(args.cwd, 'Kha/Tools/khamake/main.js'))
                            .run(options, {
                            info: function (message) {
                                _this.fireEvent(new debugSession_1.OutputEvent(message + '\n', 'stdout'));
                            }, error: function (message) {
                                _this.fireEvent(new debugSession_1.OutputEvent(message + '\n', 'stderr'));
                            }
                        }, function (name) { });
                    }
                    catch (error) {
                        _this.fireEvent(new debugSession_1.OutputEvent('Error: ' + error.toString() + '\n', 'stderr'));
                    }
                }
                else {
                    try {
                        require(path.join(args.kha, 'Tools/khamake/main.js'))
                            .run(options, {
                            info: function (message) {
                                _this.fireEvent(new debugSession_1.OutputEvent(message + '\n', 'stdout'));
                            }, error: function (message) {
                                _this.fireEvent(new debugSession_1.OutputEvent(message + '\n', 'stderr'));
                            }
                        }, function (name) { });
                    }
                    catch (error) {
                        _this.fireEvent(new debugSession_1.OutputEvent('Error: ' + error.toString() + '\n', 'stderr'));
                    }
                }
                var electronPath = args.runtimeExecutable;
                var electronDir = electronPath;
                if (electronPath.lastIndexOf('/') >= 0)
                    electronDir = electronPath.substring(0, electronPath.lastIndexOf('/'));
                else if (electronPath.lastIndexOf('\\') >= 0)
                    electronDir = electronPath.substring(0, electronPath.lastIndexOf('\\'));
                // Start with remote debugging enabled
                var port = args.port || Math.floor((Math.random() * 10000) + 10000);
                ;
                var electronArgs = ['--remote-debugging-port=' + port];
                electronArgs.push(path.resolve(args.cwd, args.file));
                var launchUrl;
                if (args.file) {
                    launchUrl = 'file:///' + path.resolve(args.cwd, path.join(args.file, 'index.html'));
                }
                else if (args.url) {
                    launchUrl = args.url;
                }
                utilities_1.Logger.log("spawn('" + electronPath + "', " + JSON.stringify(electronArgs) + ")");
                _this._chromeProc = child_process_1.spawn(electronPath, electronArgs, {
                    detached: true,
                    stdio: ['ignore'],
                    cwd: electronDir
                });
                _this._chromeProc.unref();
                _this._chromeProc.on('error', function (err) {
                    utilities_1.Logger.log('chrome error: ' + err);
                    _this.terminateSession();
                });
                _this._attach(port, launchUrl).then(function () {
                    resolve();
                });
            });
        });
    };
    WebKitDebugAdapter.prototype.attach = function (args) {
        if (args.port == null) {
            return utils.errP('The "port" field is required in the attach config.');
        }
        this.initDiagnosticLogging('attach', args);
        return this._attach(args.port);
    };
    WebKitDebugAdapter.prototype.initDiagnosticLogging = function (name, args) {
        if (args.diagnosticLogging) {
            utilities_1.Logger.enableDiagnosticLogging();
            utils.Logger.log("initialize(" + JSON.stringify(this._initArgs) + ")");
            utils.Logger.log(name + "(" + JSON.stringify(args) + ")");
        }
    };
    WebKitDebugAdapter.prototype._attach = function (port, url) {
        var _this = this;
        // ODP client is attaching - if not attached to the webkit target, create a connection and attach
        this._clientAttached = true;
        if (!this._webKitConnection) {
            this._webKitConnection = new webKitConnection_1.WebKitConnection();
            this._webKitConnection.on('Debugger.paused', function (params) { return _this.onDebuggerPaused(params); });
            this._webKitConnection.on('Debugger.resumed', function () { return _this.onDebuggerResumed(); });
            this._webKitConnection.on('Debugger.scriptParsed', function (params) { return _this.onScriptParsed(params); });
            this._webKitConnection.on('Debugger.globalObjectCleared', function () { return _this.onGlobalObjectCleared(); });
            this._webKitConnection.on('Debugger.breakpointResolved', function (params) { return _this.onBreakpointResolved(params); });
            this._webKitConnection.on('Console.messageAdded', function (params) { return _this.onConsoleMessage(params); });
            this._webKitConnection.on('Inspector.detached', function () { return _this.terminateSession(); });
            this._webKitConnection.on('close', function () { return _this.terminateSession(); });
            this._webKitConnection.on('error', function () { return _this.terminateSession(); });
            return this._webKitConnection.attach(port, url)
                .then(function () { return _this.fireEvent(new debugSession_1.InitializedEvent()); }, function (e) {
                _this.clearEverything();
                return utils.errP(e);
            });
        }
        else {
            return Promise.resolve();
        }
    };
    WebKitDebugAdapter.prototype.fireEvent = function (event) {
        if (this._eventHandler) {
            this._eventHandler(event);
        }
    };
    /**
     * Chrome is closing, or error'd somehow, stop the debug session
     */
    WebKitDebugAdapter.prototype.terminateSession = function () {
        if (this._clientAttached) {
            this.fireEvent(new debugSession_1.TerminatedEvent());
        }
        this.clearEverything();
    };
    WebKitDebugAdapter.prototype.clearEverything = function () {
        this.clearClientContext();
        this.clearTargetContext();
        this._chromeProc = null;
        if (this._webKitConnection) {
            this._webKitConnection.close();
            this._webKitConnection = null;
        }
    };
    /**
     * e.g. the target navigated
     */
    WebKitDebugAdapter.prototype.onGlobalObjectCleared = function () {
        this.clearTargetContext();
    };
    WebKitDebugAdapter.prototype.onDebuggerPaused = function (notification) {
        var _this = this;
        this._overlayHelper.doAndCancel(function () { return _this._webKitConnection.page_setOverlayMessage(WebKitDebugAdapter.PAGE_PAUSE_MESSAGE); });
        this._currentStack = notification.callFrames;
        // We can tell when we've broken on an exception. Otherwise if hitBreakpoints is set, assume we hit a
        // breakpoint. If not set, assume it was a step. We can't tell the difference between step and 'break on anything'.
        var reason;
        var exceptionText;
        if (notification.reason === 'exception') {
            reason = 'exception';
            if (notification.data && this._currentStack.length) {
                // Insert a scope to wrap the exception object. exceptionText is unused by Code at the moment.
                var remoteObjValue = utils.remoteObjectToValue(notification.data, false);
                var scopeObject;
                if (remoteObjValue.variableHandleRef) {
                    // If the remote object is an object (probably an Error), treat the object like a scope.
                    exceptionText = notification.data.description;
                    scopeObject = notification.data;
                }
                else {
                    // If it's a value, use a special flag and save the value for later.
                    exceptionText = notification.data.value;
                    scopeObject = { objectId: WebKitDebugAdapter.EXCEPTION_VALUE_ID };
                    this._exceptionValueObject = notification.data;
                }
                this._currentStack[0].scopeChain.unshift({ type: 'Exception', object: scopeObject });
            }
        }
        else {
            reason = notification.hitBreakpoints.length ? 'breakpoint' : 'step';
        }
        this.fireEvent(new debugSession_1.StoppedEvent(reason, /*threadId=*/ WebKitDebugAdapter.THREAD_ID, exceptionText));
    };
    WebKitDebugAdapter.prototype.onDebuggerResumed = function () {
        var _this = this;
        this._overlayHelper.wait(function () { return _this._webKitConnection.page_clearOverlayMessage(); });
        this._currentStack = null;
        if (!this._expectingResumedEvent) {
            // This is a private undocumented event provided by VS Code to support the 'continue' button on a paused Chrome page
            var resumedEvent = new v8Protocol_1.Event('continued', { threadId: WebKitDebugAdapter.THREAD_ID });
            this.fireEvent(resumedEvent);
        }
        else {
            this._expectingResumedEvent = false;
        }
    };
    WebKitDebugAdapter.prototype.onScriptParsed = function (script) {
        this._scriptsById.set(script.scriptId, script);
        if (!this.isExtensionScript(script)) {
            this.fireEvent(new v8Protocol_1.Event('scriptParsed', { scriptUrl: script.url, sourceMapURL: script.sourceMapURL }));
        }
    };
    WebKitDebugAdapter.prototype.onBreakpointResolved = function (params) {
        var script = this._scriptsById.get(params.location.scriptId);
        if (!script) {
            // Breakpoint resolved for a script we don't know about
            return;
        }
        var committedBps = this._committedBreakpointsByUrl.get(script.url) || [];
        committedBps.push(params.breakpointId);
        this._committedBreakpointsByUrl.set(script.url, committedBps);
    };
    WebKitDebugAdapter.prototype.onConsoleMessage = function (params) {
        var formattedMessage = consoleHelper_1.formatConsoleMessage(params.message);
        if (formattedMessage) {
            this.fireEvent(new debugSession_1.OutputEvent(formattedMessage.text + '\n', formattedMessage.isError ? 'stderr' : 'stdout'));
        }
    };
    WebKitDebugAdapter.prototype.disconnect = function () {
        if (this._chromeProc) {
            this._chromeProc.kill('SIGINT');
            this._chromeProc = null;
        }
        this.clearEverything();
        return Promise.resolve();
    };
    WebKitDebugAdapter.prototype.setBreakpoints = function (args) {
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
                .then(function () { return _this._clearAllBreakpoints(targetScriptUrl); })
                .then(function () { return _this._addBreakpoints(targetScriptUrl, args.lines, args.cols); })
                .then(function (responses) { return ({ breakpoints: _this._webkitBreakpointResponsesToODPBreakpoints(targetScriptUrl, responses, args.lines) }); });
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
    WebKitDebugAdapter.prototype._clearAllBreakpoints = function (url) {
        var _this = this;
        if (!this._committedBreakpointsByUrl.has(url)) {
            return Promise.resolve();
        }
        // Remove breakpoints one at a time. Seems like it would be ok to send the removes all at once,
        // but there is a chrome bug where when removing 5+ or so breakpoints at once, it gets into a weird
        // state where later adds on the same line will fail with 'breakpoint already exists' even though it
        // does not break there.
        return this._committedBreakpointsByUrl.get(url).reduce(function (p, bpId) {
            return p.then(function () { return _this._webKitConnection.debugger_removeBreakpoint(bpId); }).then(function () { });
        }, Promise.resolve()).then(function () {
            _this._committedBreakpointsByUrl.set(url, null);
        });
    };
    WebKitDebugAdapter.prototype._addBreakpoints = function (url, lines, cols) {
        var _this = this;
        // Call setBreakpoint for all breakpoints in the script simultaneously
        var responsePs = lines
            .map(function (lineNumber, i) { return _this._webKitConnection.debugger_setBreakpointByUrl(url, lineNumber, cols ? cols[i] : 0); });
        // Join all setBreakpoint requests to a single promise
        return Promise.all(responsePs);
    };
    WebKitDebugAdapter.prototype._webkitBreakpointResponsesToODPBreakpoints = function (url, responses, requestLines) {
        // Don't cache errored responses
        var committedBpIds = responses
            .filter(function (response) { return !response.error; })
            .map(function (response) { return response.result.breakpointId; });
        // Cache successfully set breakpoint ids from webkit in committedBreakpoints set
        this._committedBreakpointsByUrl.set(url, committedBpIds);
        // Map committed breakpoints to DebugProtocol response breakpoints
        return responses
            .map(function (response, i) {
            // The output list needs to be the same length as the input list, so map errors to
            // unverified breakpoints.
            if (response.error || !response.result.locations.length) {
                return {
                    verified: false,
                    line: requestLines[i],
                    column: 0
                };
            }
            return {
                verified: true,
                line: response.result.locations[0].lineNumber,
                column: response.result.locations[0].columnNumber
            };
        });
    };
    WebKitDebugAdapter.prototype.setExceptionBreakpoints = function (args) {
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
        return this._webKitConnection.debugger_setPauseOnExceptions(state)
            .then(function () { });
    };
    WebKitDebugAdapter.prototype.continue = function () {
        this._expectingResumedEvent = true;
        return this._webKitConnection.debugger_resume()
            .then(function () { });
    };
    WebKitDebugAdapter.prototype.next = function () {
        this._expectingResumedEvent = true;
        return this._webKitConnection.debugger_stepOver()
            .then(function () { });
    };
    WebKitDebugAdapter.prototype.stepIn = function () {
        this._expectingResumedEvent = true;
        return this._webKitConnection.debugger_stepIn()
            .then(function () { });
    };
    WebKitDebugAdapter.prototype.stepOut = function () {
        this._expectingResumedEvent = true;
        return this._webKitConnection.debugger_stepOut()
            .then(function () { });
    };
    WebKitDebugAdapter.prototype.pause = function () {
        return this._webKitConnection.debugger_pause()
            .then(function () { });
    };
    WebKitDebugAdapter.prototype.stackTrace = function (args) {
        var _this = this;
        // Only process at the requested number of frames, if 'levels' is specified
        var stack = this._currentStack;
        if (args.levels) {
            stack = this._currentStack.filter(function (_, i) { return i < args.levels; });
        }
        var stackFrames = stack
            .map(function (callFrame, i) {
            var script = _this._scriptsById.get(callFrame.location.scriptId);
            var line = callFrame.location.lineNumber;
            var column = callFrame.location.columnNumber;
            // When the script has a url and isn't a content script, send the name and path fields. PathTransformer will
            // attempt to resolve it to a script in the workspace. Otherwise, send the name and sourceReference fields.
            var source = script.url && !_this.isExtensionScript(script) ?
                {
                    name: path.basename(script.url),
                    path: script.url,
                    sourceReference: scriptIdToSourceReference(script.scriptId) // will be 0'd out by PathTransformer if not needed
                } :
                {
                    // Name should be undefined, work around VS Code bug 20274
                    name: 'eval: ' + script.scriptId,
                    sourceReference: scriptIdToSourceReference(script.scriptId)
                };
            // If the frame doesn't have a function name, it's either an anonymous function
            // or eval script. If its source has a name, it's probably an anonymous function.
            var frameName = callFrame.functionName || (script.url ? '(anonymous function)' : '(eval code)');
            return {
                id: i,
                name: frameName,
                source: source,
                line: line,
                column: column
            };
        });
        return { stackFrames: stackFrames };
    };
    WebKitDebugAdapter.prototype.scopes = function (args) {
        var _this = this;
        var scopes = this._currentStack[args.frameId].scopeChain.map(function (scope, i) {
            var scopeHandle = { objectId: scope.object.objectId };
            if (i === 0) {
                // The first scope should include 'this'. Keep the RemoteObject reference for use by the variables request
                scopeHandle.thisObj = _this._currentStack[args.frameId]['this'];
            }
            return {
                name: scope.type,
                variablesReference: _this._variableHandles.create(scopeHandle),
                expensive: scope.type === 'global'
            };
        });
        return { scopes: scopes };
    };
    WebKitDebugAdapter.prototype.variables = function (args) {
        var _this = this;
        var handle = this._variableHandles.get(args.variablesReference);
        if (handle.objectId === WebKitDebugAdapter.EXCEPTION_VALUE_ID) {
            // If this is the special marker for an exception value, create a fake property descriptor so the usual route can be used
            var excValuePropDescriptor = { name: 'exception', value: this._exceptionValueObject };
            return Promise.resolve({ variables: [this.propertyDescriptorToVariable(excValuePropDescriptor)] });
        }
        else if (handle != null) {
            return Promise.all([
                // Need to make two requests to get all properties
                this._webKitConnection.runtime_getProperties(handle.objectId, /*ownProperties=*/ false, /*accessorPropertiesOnly=*/ true),
                this._webKitConnection.runtime_getProperties(handle.objectId, /*ownProperties=*/ true, /*accessorPropertiesOnly=*/ false)
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
                // Convert WebKitProtocol prop descriptors to DebugProtocol vars, sort the result
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
            return Promise.resolve();
        }
    };
    WebKitDebugAdapter.prototype.source = function (args) {
        return this._webKitConnection.debugger_getScriptSource(sourceReferenceToScriptId(args.sourceReference)).then(function (webkitResponse) {
            return { content: webkitResponse.result.scriptSource };
        });
    };
    WebKitDebugAdapter.prototype.threads = function () {
        return {
            threads: [
                {
                    id: WebKitDebugAdapter.THREAD_ID,
                    name: 'Thread ' + WebKitDebugAdapter.THREAD_ID
                }
            ]
        };
    };
    WebKitDebugAdapter.prototype.evaluate = function (args) {
        var _this = this;
        var evalPromise;
        if (this.paused) {
            var callFrameId = this._currentStack[args.frameId].callFrameId;
            evalPromise = this._webKitConnection.debugger_evaluateOnCallFrame(callFrameId, args.expression);
        }
        else {
            evalPromise = this._webKitConnection.runtime_evaluate(args.expression);
        }
        return evalPromise.then(function (evalResponse) {
            if (evalResponse.result.wasThrown) {
                var errorMessage = evalResponse.result.exceptionDetails ? evalResponse.result.exceptionDetails.text : 'Error';
                return utils.errP(errorMessage);
            }
            var _a = _this.remoteObjectToValue(evalResponse.result.result), value = _a.value, variablesReference = _a.variablesReference;
            return { result: value, variablesReference: variablesReference };
        });
    };
    WebKitDebugAdapter.prototype.propertyDescriptorToVariable = function (propDesc) {
        if (propDesc.get || propDesc.set) {
            // A property doesn't have a value here, and we shouldn't evaluate the getter because it may have side effects.
            // Node adapter shows 'undefined', Chrome can eval the getter on demand.
            return { name: propDesc.name, value: 'property', variablesReference: 0 };
        }
        else {
            var _a = this.remoteObjectToValue(propDesc.value), value = _a.value, variablesReference = _a.variablesReference;
            return { name: propDesc.name, value: value, variablesReference: variablesReference };
        }
    };
    /**
     * Run the object through Utilities.remoteObjectToValue, and if it returns a variableHandle reference,
     * use it with this instance's variableHandles to create a variable handle.
     */
    WebKitDebugAdapter.prototype.remoteObjectToValue = function (object) {
        var _a = utils.remoteObjectToValue(object), value = _a.value, variableHandleRef = _a.variableHandleRef;
        var result = { value: value, variablesReference: 0 };
        if (variableHandleRef) {
            result.variablesReference = this._variableHandles.create({ objectId: variableHandleRef });
        }
        return result;
    };
    WebKitDebugAdapter.prototype.isExtensionScript = function (script) {
        return script.isContentScript || !script.url || script.url.startsWith('extensions::') || script.url.startsWith('chrome-extension://');
    };
    WebKitDebugAdapter.THREAD_ID = 1;
    WebKitDebugAdapter.PAGE_PAUSE_MESSAGE = 'Paused in Kode Studio';
    WebKitDebugAdapter.EXCEPTION_VALUE_ID = 'EXCEPTION_VALUE_ID';
    return WebKitDebugAdapter;
})();
exports.WebKitDebugAdapter = WebKitDebugAdapter;
function scriptIdToSourceReference(scriptId) {
    return parseInt(scriptId, 10);
}
function sourceReferenceToScriptId(sourceReference) {
    return '' + sourceReference;
}

//# sourceMappingURL=webKitDebugAdapter.js.map
