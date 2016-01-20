/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
define(["require", "exports", 'vs/nls', 'vs/base/common/lifecycle', 'vs/base/common/mime', 'vs/base/common/eventEmitter', 'vs/base/common/uri', 'vs/base/common/arrays', 'vs/base/common/types', 'vs/base/common/errors', 'vs/base/common/severity', 'vs/base/common/winjs.base', 'vs/workbench/common/editor', 'vs/workbench/parts/debug/common/debug', 'vs/workbench/parts/debug/node/rawDebugSession', 'vs/workbench/parts/debug/common/debugModel', 'vs/workbench/parts/debug/browser/debugEditorInputs', 'vs/workbench/parts/debug/common/debugViewModel', 'vs/workbench/parts/debug/electron-browser/debugActions', 'vs/workbench/parts/debug/browser/breakpointWidget', 'vs/workbench/parts/debug/node/debugConfigurationManager', 'vs/workbench/parts/debug/common/debugSource', 'vs/platform/editor/common/editor', 'vs/workbench/parts/tasks/common/taskService', 'vs/workbench/services/viewlet/common/viewletService', 'vs/workbench/services/part/common/partService', 'vs/workbench/parts/files/common/files', 'vs/workbench/services/workspace/common/contextService', 'vs/platform/instantiation/common/instantiation', 'vs/platform/files/common/files', 'vs/platform/event/common/event', 'vs/platform/message/common/message', 'vs/platform/telemetry/common/telemetry', 'vs/platform/storage/common/storage', 'vs/workbench/services/editor/common/editorService', 'vs/platform/lifecycle/common/lifecycle', 'vs/platform/plugins/common/plugins', 'vs/workbench/parts/output/common/output', 'vs/platform/keybinding/common/keybindingService', 'vs/workbench/services/window/electron-browser/windowService', 'vs/workbench/services/thread/electron-browser/threadService'], function (require, exports, nls, lifecycle, mime, ee, uri_1, arrays, types, errors, severity_1, winjs_base_1, wbeditorcommon, debug, session, model, debuginputs, viewmodel, debugactions, breakpointWidget_1, debugConfigurationManager_1, debugSource_1, editor_1, taskService_1, viewletService_1, partService_1, files_1, contextService_1, instantiation_1, files_2, event_1, message_1, telemetry_1, storage_1, editorService_1, lifecycle_1, plugins_1, output_1, keybindingService_1, windowService_1, threadService_1) {
    var DEBUG_BREAKPOINTS_KEY = 'debug.breakpoint';
    var DEBUG_BREAKPOINTS_ACTIVATED_KEY = 'debug.breakpointactivated';
    var DEBUG_FUNCTION_BREAKPOINTS_KEY = 'debug.functionbreakpoint';
    var DEBUG_EXCEPTION_BREAKPOINTS_KEY = 'debug.exceptionbreakpoint';
    var DEBUG_WATCH_EXPRESSIONS_KEY = 'debug.watchexpressions';
    var DEBUG_SELECTED_CONFIG_NAME_KEY = 'debug.selectedconfigname';
    var DebugService = (function (_super) {
        __extends(DebugService, _super);
        function DebugService(storageService, editorService, textFileService, viewletService, fileService, messageService, partService, windowService, telemetryService, contextService, keybindingService, eventService, lifecycleService, instantiationService, pluginService, outputService) {
            _super.call(this);
            this.storageService = storageService;
            this.editorService = editorService;
            this.textFileService = textFileService;
            this.viewletService = viewletService;
            this.fileService = fileService;
            this.messageService = messageService;
            this.partService = partService;
            this.windowService = windowService;
            this.telemetryService = telemetryService;
            this.contextService = contextService;
            this.lifecycleService = lifecycleService;
            this.instantiationService = instantiationService;
            this.pluginService = pluginService;
            this.outputService = outputService;
            this.serviceId = debug.IDebugService;
            this.toDispose = [];
            this.debugStringEditorInputs = [];
            this.session = null;
            this.state = debug.State.Inactive;
            // there is a cycle if taskService gets injected, use a workaround.
            this.taskService = this.instantiationService.getInstance(taskService_1.ITaskService);
            if (!this.contextService.getWorkspace()) {
                this.state = debug.State.Disabled;
            }
            this.configurationManager = this.instantiationService.createInstance(debugConfigurationManager_1.ConfigurationManager, this.storageService.get(DEBUG_SELECTED_CONFIG_NAME_KEY, storage_1.StorageScope.WORKSPACE, 'null'));
            this.inDebugMode = keybindingService.createKey(debug.CONTEXT_IN_DEBUG_MODE, false);
            this.model = new model.Model(this.loadBreakpoints(), this.storageService.getBoolean(DEBUG_BREAKPOINTS_ACTIVATED_KEY, storage_1.StorageScope.WORKSPACE, true), this.loadFunctionBreakpoints(), this.loadExceptionBreakpoints(), this.loadWatchExpressions());
            this.viewModel = new viewmodel.ViewModel();
            this.registerListeners(eventService, lifecycleService);
        }
        DebugService.prototype.registerListeners = function (eventService, lifecycleService) {
            var _this = this;
            this.toDispose.push(eventService.addListener2(files_2.EventType.FILE_CHANGES, function (e) { return _this.onFileChanges(e); }));
            if (this.taskService) {
                this.toDispose.push(this.taskService.addListener2(taskService_1.TaskServiceEvents.Active, function (e) {
                    _this.lastTaskEvent = e;
                }));
                this.toDispose.push(this.taskService.addListener2(taskService_1.TaskServiceEvents.Inactive, function (e) {
                    if (e.type === taskService_1.TaskType.SingleRun) {
                        _this.lastTaskEvent = null;
                    }
                }));
                this.toDispose.push(this.taskService.addListener2(taskService_1.TaskServiceEvents.Terminated, function (e) {
                    _this.lastTaskEvent = null;
                }));
            }
            lifecycleService.onShutdown(this.store, this);
            lifecycleService.onShutdown(this.dispose, this);
            this.windowService.onBroadcast(this.onBroadcast, this);
        };
        DebugService.prototype.onBroadcast = function (broadcast) {
            // attach: PH is ready to be attached to
            if (broadcast.channel === threadService_1.PLUGIN_ATTACH_BROADCAST_CHANNEL) {
                this.rawAttach(broadcast.payload.port);
                return;
            }
            // from this point on we require an active session
            var session = this.getActiveSession();
            if (!session || session.getType() !== 'extensionHost') {
                return; // we are only intersted if we have an active debug session for extensionHost
            }
            // a plugin logged output, show it inside the REPL
            if (broadcast.channel === threadService_1.PLUGIN_LOG_BROADCAST_CHANNEL) {
                var extensionOutput = broadcast.payload;
                var sev = extensionOutput.severity === 'warn' ? severity_1.default.Warning : extensionOutput.severity === 'error' ? severity_1.default.Error : severity_1.default.Info;
                var args = [];
                try {
                    var parsed = JSON.parse(extensionOutput.arguments);
                    args.push.apply(args, Object.getOwnPropertyNames(parsed).map(function (o) { return parsed[o]; }));
                }
                catch (error) {
                    args.push(extensionOutput.arguments);
                }
                // add output for each argument logged
                var simpleVals = [];
                for (var i = 0; i < args.length; i++) {
                    var a = args[i];
                    // undefined gets printed as 'undefined'
                    if (typeof a === 'undefined') {
                        simpleVals.push('undefined');
                    }
                    else if (a === null) {
                        simpleVals.push('null');
                    }
                    else if (types.isObject(a) || Array.isArray(a)) {
                        // flush any existing simple values logged
                        if (simpleVals.length) {
                            this.logToRepl(simpleVals.join(' '), sev);
                            simpleVals = [];
                        }
                        // show object
                        this.logToRepl(a, sev);
                    }
                    else if (typeof a === 'string') {
                        var buf = '';
                        for (var j = 0, len = a.length; j < len; j++) {
                            if (a[j] === '%' && (a[j + 1] === 's' || a[j + 1] === 'i' || a[j + 1] === 'd')) {
                                i++; // read over substitution
                                buf += !types.isUndefinedOrNull(args[i]) ? args[i] : ''; // replace
                                j++; // read over directive
                            }
                            else {
                                buf += a[j];
                            }
                        }
                        simpleVals.push(buf);
                    }
                    else {
                        simpleVals.push(a);
                    }
                }
                // flush simple values
                if (simpleVals.length) {
                    this.logToRepl(simpleVals.join(' '), sev);
                }
                // show repl
                this.revealRepl(true /* in background */).done(null, errors.onUnexpectedError);
            }
        };
        DebugService.prototype.registerSessionListeners = function () {
            var _this = this;
            this.toDispose.push(this.session.addListener2(debug.SessionEvents.INITIALIZED, function (event) {
                _this.sendAllBreakpoints().then(function () { return _this.sendExceptionBreakpoints(); }).then(function () {
                    return _this.session.configurationDone();
                }).done(null, errors.onUnexpectedError);
            }));
            this.toDispose.push(this.session.addListener2(debug.SessionEvents.STOPPED, function (event) {
                _this.setStateAndEmit(debug.State.Stopped);
                var threadId = event.body.threadId;
                _this.getThreadData(threadId).then(function () {
                    _this.session.stackTrace({ threadId: threadId, levels: 20 }).done(function (result) {
                        _this.model.rawUpdate({ threadId: threadId, callStack: result.body.stackFrames, stoppedReason: event.body.reason });
                        _this.windowService.getWindow().focus();
                        var callStack = _this.model.getThreads()[threadId].callStack;
                        if (callStack.length > 0) {
                            _this.setFocusedStackFrameAndEvaluate(callStack[0]);
                            _this.openOrRevealEditor(callStack[0].source, callStack[0].lineNumber, false, false).done(null, errors.onUnexpectedError);
                        }
                        else {
                            _this.setFocusedStackFrameAndEvaluate(null);
                        }
                    });
                }, errors.onUnexpectedError);
            }));
            this.toDispose.push(this.session.addListener2(debug.SessionEvents.CONTINUED, function () {
                _this.model.clearThreads(false);
                _this.setFocusedStackFrameAndEvaluate(null);
                _this.setStateAndEmit(debug.State.Running);
            }));
            this.toDispose.push(this.session.addListener2(debug.SessionEvents.THREAD, function (event) {
                if (event.body.reason === 'started') {
                    _this.session.threads().done(function (result) {
                        var thread = result.body.threads.filter(function (thread) { return thread.id === event.body.threadId; }).pop();
                        if (thread) {
                            _this.model.rawUpdate({
                                threadId: thread.id,
                                thread: thread
                            });
                        }
                    }, errors.onUnexpectedError);
                }
                else if (event.body.reason === 'exited') {
                    _this.model.clearThreads(true, event.body.threadId);
                }
            }));
            this.toDispose.push(this.session.addListener2(debug.SessionEvents.DEBUGEE_TERMINATED, function (event) {
                if (_this.session && _this.session.getId() === event.sessionId) {
                    _this.session.disconnect().done(null, errors.onUnexpectedError);
                }
            }));
            this.toDispose.push(this.session.addListener2(debug.SessionEvents.OUTPUT, function (event) {
                if (event.body && typeof event.body.output === 'string' && event.body.output.length > 0) {
                    _this.onOutput(event);
                }
            }));
            this.toDispose.push(this.session.addListener2(debug.SessionEvents.SERVER_EXIT, function (event) {
                if (_this.session && _this.session.getId() === event.sessionId) {
                    _this.onSessionEnd();
                }
            }));
        };
        DebugService.prototype.onOutput = function (event) {
            var outputSeverity = event.body.category === 'stderr' ? severity_1.default.Error : severity_1.default.Info;
            this.appendReplOutput(event.body.output, outputSeverity);
            this.revealRepl(true /* in background */).done(null, errors.onUnexpectedError);
        };
        DebugService.prototype.getThreadData = function (threadId) {
            var _this = this;
            return this.model.getThreads()[threadId] ? winjs_base_1.Promise.as(true) :
                this.session.threads().then(function (response) {
                    var thread = response.body.threads.filter(function (t) { return t.id === threadId; }).pop();
                    if (!thread) {
                        throw new Error(nls.localize('debugNoThread', "Did not get a thread from debug adapter with id {0}.", threadId));
                    }
                    _this.model.rawUpdate({
                        threadId: thread.id,
                        thread: thread
                    });
                });
        };
        DebugService.prototype.loadBreakpoints = function () {
            try {
                return JSON.parse(this.storageService.get(DEBUG_BREAKPOINTS_KEY, storage_1.StorageScope.WORKSPACE, '[]')).map(function (breakpoint) {
                    return new model.Breakpoint(new debugSource_1.Source(breakpoint.source.raw ? breakpoint.source.raw : { path: uri_1.default.parse(breakpoint.source.uri).fsPath, name: breakpoint.source.name }), breakpoint.desiredLineNumber || breakpoint.lineNumber, breakpoint.enabled, breakpoint.condition);
                });
            }
            catch (e) {
                return [];
            }
        };
        DebugService.prototype.loadFunctionBreakpoints = function () {
            try {
                return JSON.parse(this.storageService.get(DEBUG_FUNCTION_BREAKPOINTS_KEY, storage_1.StorageScope.WORKSPACE, '[]')).map(function (fb) {
                    return new model.FunctionBreakpoint(fb.name, fb.enabled);
                });
            }
            catch (e) {
                return [];
            }
        };
        DebugService.prototype.loadExceptionBreakpoints = function () {
            var result = null;
            try {
                result = JSON.parse(this.storageService.get(DEBUG_EXCEPTION_BREAKPOINTS_KEY, storage_1.StorageScope.WORKSPACE, '[]')).map(function (exBreakpoint) {
                    return new model.ExceptionBreakpoint(exBreakpoint.name, exBreakpoint.enabled);
                });
            }
            catch (e) {
                result = [];
            }
            return result.length > 0 ? result : [new model.ExceptionBreakpoint('all', false), new model.ExceptionBreakpoint('uncaught', true)];
        };
        DebugService.prototype.loadWatchExpressions = function () {
            try {
                return JSON.parse(this.storageService.get(DEBUG_WATCH_EXPRESSIONS_KEY, storage_1.StorageScope.WORKSPACE, '[]')).map(function (watch) {
                    return new model.Expression(watch.name, false, watch.id);
                });
            }
            catch (e) {
                return [];
            }
        };
        DebugService.prototype.getState = function () {
            return this.state;
        };
        DebugService.prototype.setStateAndEmit = function (newState) {
            this.state = newState;
            this.emit(debug.ServiceEvents.STATE_CHANGED);
        };
        Object.defineProperty(DebugService.prototype, "enabled", {
            get: function () {
                return !!this.contextService.getWorkspace();
            },
            enumerable: true,
            configurable: true
        });
        DebugService.prototype.setFocusedStackFrameAndEvaluate = function (focusedStackFrame) {
            this.viewModel.setFocusedStackFrame(focusedStackFrame);
            if (focusedStackFrame) {
                this.model.evaluateWatchExpressions(this.session, focusedStackFrame);
            }
            else {
                this.model.clearWatchExpressionValues();
            }
        };
        DebugService.prototype.setBreakpointsForModel = function (modelUri, rawData) {
            this.model.removeBreakpoints(this.model.getBreakpoints().filter(function (bp) { return bp.source.uri.toString() === modelUri.toString(); }));
            this.model.addBreakpoints(rawData);
            return this.sendBreakpoints(modelUri);
        };
        DebugService.prototype.toggleBreakpoint = function (rawBreakpoint) {
            var breakpoint = this.model.getBreakpoints().filter(function (bp) { return bp.lineNumber === rawBreakpoint.lineNumber && bp.source.uri.toString() === rawBreakpoint.uri.toString(); }).pop();
            if (breakpoint) {
                this.model.removeBreakpoints([breakpoint]);
            }
            else {
                this.model.addBreakpoints([rawBreakpoint]);
            }
            return this.sendBreakpoints(rawBreakpoint.uri);
        };
        DebugService.prototype.enableOrDisableAllBreakpoints = function (enabled) {
            this.model.enableOrDisableAllBreakpoints(enabled);
            return this.sendAllBreakpoints();
        };
        DebugService.prototype.toggleEnablement = function (element) {
            this.model.toggleEnablement(element);
            if (element instanceof model.Breakpoint) {
                var breakpoint = element;
                return this.sendBreakpoints(breakpoint.source.uri);
            }
            else if (element instanceof model.FunctionBreakpoint) {
            }
            return this.sendExceptionBreakpoints();
        };
        DebugService.prototype.removeAllBreakpoints = function () {
            var _this = this;
            var urisToClear = arrays.distinct(this.model.getBreakpoints(), function (bp) { return bp.source.uri.toString(); }).map(function (bp) { return bp.source.uri; });
            this.model.removeBreakpoints(this.model.getBreakpoints());
            return winjs_base_1.Promise.join(urisToClear.map(function (uri) { return _this.sendBreakpoints(uri); }));
        };
        DebugService.prototype.toggleBreakpointsActivated = function () {
            this.model.toggleBreakpointsActivated();
            return this.sendAllBreakpoints();
        };
        DebugService.prototype.editBreakpoint = function (editor, lineNumber) {
            if (breakpointWidget_1.BreakpointWidget.INSTANCE) {
                breakpointWidget_1.BreakpointWidget.INSTANCE.dispose();
            }
            this.instantiationService.createInstance(breakpointWidget_1.BreakpointWidget, editor, lineNumber);
            breakpointWidget_1.BreakpointWidget.INSTANCE.show({ lineNumber: lineNumber, column: 1 }, 2);
            return winjs_base_1.Promise.as(true);
        };
        DebugService.prototype.addFunctionBreakpoint = function (functionName) {
            this.model.addFunctionBreakpoint(functionName);
            // TODO@Isidor send updated function breakpoints
            return winjs_base_1.Promise.as(true);
        };
        DebugService.prototype.renameFunctionBreakpoint = function (id, newFunctionName) {
            this.model.renameFunctionBreakpoint(id, newFunctionName);
            // TODO@Isidor send updated function breakpoints
            return winjs_base_1.Promise.as(true);
        };
        DebugService.prototype.removeFunctionBreakpoints = function (id) {
            this.model.removeFunctionBreakpoints(id);
            // TODO@Isidor send updated function breakpoints
            return winjs_base_1.Promise.as(true);
        };
        DebugService.prototype.addReplExpression = function (name) {
            return this.model.addReplExpression(this.session, this.viewModel.getFocusedStackFrame(), name);
        };
        DebugService.prototype.logToRepl = function (value, severity) {
            this.model.logToRepl(value, severity);
        };
        DebugService.prototype.appendReplOutput = function (value, severity) {
            this.model.appendReplOutput(value, severity);
        };
        DebugService.prototype.clearReplExpressions = function () {
            this.model.clearReplExpressions();
        };
        DebugService.prototype.addWatchExpression = function (name) {
            return this.model.addWatchExpression(this.session, this.viewModel.getFocusedStackFrame(), name);
        };
        DebugService.prototype.renameWatchExpression = function (id, newName) {
            return this.model.renameWatchExpression(this.session, this.viewModel.getFocusedStackFrame(), id, newName);
        };
        DebugService.prototype.clearWatchExpressions = function (id) {
            this.model.clearWatchExpressions(id);
        };
        DebugService.prototype.createSession = function (openViewlet) {
            var _this = this;
            if (openViewlet === void 0) { openViewlet = true; }
            this.textFileService.saveAll().done(null, errors.onUnexpectedError);
            this.clearReplExpressions();
            return this.pluginService.onReady().then(function () { return _this.configurationManager.setConfiguration(_this.configurationManager.getConfigurationName()); }).then(function () {
                var configuration = _this.configurationManager.getConfiguration();
                if (!configuration) {
                    return _this.configurationManager.openConfigFile(false).then(function (openend) {
                        if (openend) {
                            _this.messageService.show(severity_1.default.Info, nls.localize('NewLaunchConfig', "Please set up the launch configuration file to debug your application."));
                        }
                    });
                }
                if (!_this.configurationManager.getAdapter()) {
                    return winjs_base_1.Promise.wrapError(new Error(nls.localize('debugTypeNotSupported', "Configured debug type {0} is not supported.", configuration.type)));
                }
                return _this.runPreLaunchTask(configuration).then(function () { return _this.doCreateSession(configuration, openViewlet); });
            });
        };
        DebugService.prototype.doCreateSession = function (configuration, openViewlet) {
            var _this = this;
            this.session = new session.RawDebugSession(this.messageService, this.telemetryService, configuration.debugServer, this.configurationManager.getAdapter());
            this.registerSessionListeners();
            return this.session.initialize({
                adapterID: configuration.type,
                linesStartAt1: true,
                pathFormat: 'path'
            }).then(function (result) {
                if (!_this.session) {
                    return winjs_base_1.Promise.wrapError(new Error(nls.localize('debugAdapterCrash', "Debug adapter process has terminated unexpectedly")));
                }
                _this.setStateAndEmit(debug.State.Initializing);
                return configuration.request === 'attach' ? _this.session.attach(configuration) : _this.session.launch(configuration);
            }).then(function (result) {
                if (openViewlet) {
                    _this.viewletService.openViewlet(debug.VIEWLET_ID);
                }
                _this.partService.addClass('debugging');
                _this.contextService.updateOptions('editor', {
                    glyphMargin: true
                });
                _this.inDebugMode.set(true);
                _this.telemetryService.publicLog('debugSessionStart', { type: configuration.type, breakpointCount: _this.model.getBreakpoints().length, exceptionBreakpoints: _this.model.getExceptionBreakpoints() });
            }).then(undefined, function (error) {
                _this.telemetryService.publicLog('debugMisconfiguration', { type: configuration ? configuration.type : undefined });
                if (_this.session) {
                    _this.session.disconnect();
                }
                return winjs_base_1.Promise.wrapError(errors.create(error.message, { actions: [message_1.CloseAction, _this.instantiationService.createInstance(debugactions.ConfigureAction, debugactions.ConfigureAction.ID, debugactions.ConfigureAction.LABEL)] }));
            });
        };
        DebugService.prototype.runPreLaunchTask = function (config) {
            var _this = this;
            if (!config.preLaunchTask) {
                return winjs_base_1.Promise.as(true);
            }
            // run a build task before starting a debug session
            return this.taskService.tasks().then(function (descriptions) {
                var filteredTasks = descriptions.filter(function (task) { return task.name === config.preLaunchTask; });
                if (filteredTasks.length !== 1) {
                    _this.messageService.show(severity_1.default.Warning, nls.localize('DebugTaskNotFound', "Could not find a unique task \'{0}\'. Make sure the task exists and that it has a unique name.", config.preLaunchTask));
                    return winjs_base_1.Promise.as(true);
                }
                // task is already running - nothing to do.
                if (_this.lastTaskEvent && _this.lastTaskEvent.taskName === config.preLaunchTask) {
                    return winjs_base_1.Promise.as(true);
                }
                if (_this.lastTaskEvent) {
                    // there is a different task running currently.
                    return winjs_base_1.Promise.wrapError(errors.create(nls.localize('differentTaskRunning', "There is a task {0} running. Can not run pre launch task {1}.", _this.lastTaskEvent.taskName, config.preLaunchTask)));
                }
                // no task running, execute the preLaunchTask.
                _this.outputService.showOutput('Tasks', true, true);
                var taskPromise = _this.taskService.run(filteredTasks[0].id).then(function (result) {
                    _this.lastTaskEvent = null;
                }, function (err) {
                    _this.lastTaskEvent = null;
                });
                return filteredTasks[0].isWatching ? winjs_base_1.Promise.as(true) : taskPromise;
            });
        };
        DebugService.prototype.rawAttach = function (port) {
            if (this.session) {
                if (!this.session.isAttach) {
                    return this.session.attach({ port: port });
                }
                this.session.disconnect().done(null, errors.onUnexpectedError);
            }
            var configuration = this.configurationManager.getConfiguration();
            return this.doCreateSession({
                type: configuration.type,
                request: 'attach',
                port: port,
                sourceMaps: configuration.sourceMaps,
                outDir: configuration.outDir,
                debugServer: configuration.debugServer
            }, true);
        };
        DebugService.prototype.restartSession = function () {
            var _this = this;
            return this.session ? this.session.disconnect(true).then(function () {
                return new winjs_base_1.Promise(function (c) {
                    setTimeout(function () {
                        _this.createSession(false).then(function () { return c(true); });
                    }, 300);
                });
            }) : this.createSession(false);
        };
        DebugService.prototype.getActiveSession = function () {
            return this.session;
        };
        DebugService.prototype.onSessionEnd = function () {
            try {
                this.debugStringEditorInputs = lifecycle.disposeAll(this.debugStringEditorInputs);
            }
            catch (e) {
            }
            if (this.session) {
                var bpsExist = this.model.getBreakpoints().length > 0;
                this.telemetryService.publicLog('debugSessionStop', { type: this.session.getType(), success: this.session.emittedStopped || !bpsExist, sessionLengthInSeconds: this.session.getLengthInSeconds(), breakpointCount: this.model.getBreakpoints().length });
            }
            this.session = null;
            this.partService.removeClass('debugging');
            this.editorService.focusEditor();
            this.model.clearThreads(true);
            this.setFocusedStackFrameAndEvaluate(null);
            this.setStateAndEmit(debug.State.Inactive);
            // set breakpoints back to unverified since the session ended.
            // source reference changes across sessions, so we do not use it to persist the source.
            var data = {};
            this.model.getBreakpoints().forEach(function (bp) {
                delete bp.source.raw.sourceReference;
                data[bp.getId()] = { line: bp.lineNumber, verified: false };
            });
            this.model.updateBreakpoints(data);
            this.inDebugMode.reset();
        };
        DebugService.prototype.getModel = function () {
            return this.model;
        };
        DebugService.prototype.getViewModel = function () {
            return this.viewModel;
        };
        DebugService.prototype.openOrRevealEditor = function (source, lineNumber, preserveFocus, sideBySide) {
            var _this = this;
            var visibleEditors = this.editorService.getVisibleEditors();
            for (var i = 0; i < visibleEditors.length; i++) {
                var fileInput = wbeditorcommon.asFileEditorInput(visibleEditors[i].input);
                if (fileInput && fileInput.getResource().toString() === source.uri.toString()) {
                    var control = visibleEditors[i].getControl();
                    if (control) {
                        control.revealLineInCenterIfOutsideViewport(lineNumber);
                        control.setSelection({ startLineNumber: lineNumber, startColumn: 1, endLineNumber: lineNumber, endColumn: 1 });
                        return this.editorService.openEditor(visibleEditors[i].input, wbeditorcommon.TextEditorOptions.create({ preserveFocus: preserveFocus, forceActive: true }), visibleEditors[i].position);
                    }
                    return winjs_base_1.Promise.as(null);
                }
            }
            if (source.inMemory) {
                // internal module
                if (source.reference !== 0 && this.session) {
                    return this.session.source({ sourceReference: source.reference }).then(function (response) {
                        var editorInput = _this.getDebugStringEditorInput(source, response.body.content, mime.guessMimeTypes(source.name)[0]);
                        return _this.editorService.openEditor(editorInput, wbeditorcommon.TextEditorOptions.create({
                            selection: {
                                startLineNumber: lineNumber,
                                startColumn: 1,
                                endLineNumber: lineNumber,
                                endColumn: 1
                            },
                            preserveFocus: preserveFocus
                        }), sideBySide);
                    });
                }
                return this.sourceIsUnavailable(source, sideBySide);
            }
            return this.fileService.resolveFile(source.uri).then(function () {
                return _this.editorService.openEditor({
                    resource: source.uri,
                    options: {
                        selection: {
                            startLineNumber: lineNumber,
                            startColumn: 1,
                            endLineNumber: lineNumber,
                            endColumn: 1
                        },
                        preserveFocus: preserveFocus
                    }
                }, sideBySide);
            }, function (err) { return _this.sourceIsUnavailable(source, sideBySide); });
        };
        DebugService.prototype.sourceIsUnavailable = function (source, sideBySide) {
            this.model.sourceIsUnavailable(source);
            var editorInput = this.getDebugStringEditorInput(source, nls.localize('debugSourceNotAvailable', "Source is not available."), 'text/plain');
            return this.editorService.openEditor(editorInput, wbeditorcommon.TextEditorOptions.create({ preserveFocus: true }), sideBySide);
        };
        DebugService.prototype.revealRepl = function (inBackground) {
            var _this = this;
            if (inBackground === void 0) { inBackground = false; }
            var editors = this.editorService.getVisibleEditors();
            // first check if repl is already opened
            for (var i = 0; i < editors.length; i++) {
                var editor_2 = editors[i];
                if (editor_2.input instanceof debuginputs.ReplEditorInput) {
                    if (!inBackground) {
                        return this.editorService.focusEditor(editor_2);
                    }
                    return winjs_base_1.Promise.as(null);
                }
            }
            // then find a position but try to not replace an existing file editor in any of the positions
            var position = editor_1.Position.LEFT;
            var lastIndex = editors.length - 1;
            if (editors.length === 3) {
                position = wbeditorcommon.asFileEditorInput(editors[lastIndex].input, true) ? null : editor_1.Position.RIGHT;
            }
            else if (editors.length === 2) {
                position = wbeditorcommon.asFileEditorInput(editors[lastIndex].input, true) ? editor_1.Position.RIGHT : editor_1.Position.CENTER;
            }
            else if (editors.length) {
                position = wbeditorcommon.asFileEditorInput(editors[lastIndex].input, true) ? editor_1.Position.CENTER : editor_1.Position.LEFT;
            }
            if (position === null) {
                return winjs_base_1.Promise.as(null); // could not find a good position, return
            }
            // open repl
            return this.editorService.openEditor(debuginputs.ReplEditorInput.getInstance(), wbeditorcommon.TextEditorOptions.create({ preserveFocus: inBackground }), position).then(function (editor) {
                var elements = _this.model.getReplElements();
                if (!inBackground && elements.length > 0) {
                    return editor.reveal(elements[elements.length - 1]);
                }
            });
        };
        DebugService.prototype.canSetBreakpointsIn = function (model, lineNumber) {
            return this.configurationManager.canSetBreakpointsIn(model, lineNumber);
        };
        DebugService.prototype.getConfigurationName = function () {
            return this.configurationManager.getConfigurationName();
        };
        DebugService.prototype.setConfiguration = function (name) {
            return this.configurationManager.setConfiguration(name);
        };
        DebugService.prototype.openConfigFile = function (sideBySide) {
            return this.configurationManager.openConfigFile(sideBySide);
        };
        DebugService.prototype.loadLaunchConfig = function () {
            return this.configurationManager.loadLaunchConfig();
        };
        DebugService.prototype.getDebugStringEditorInput = function (source, value, mtype) {
            var filtered = this.debugStringEditorInputs.filter(function (input) { return input.getResource().toString() === source.uri.toString(); });
            if (filtered.length === 0) {
                var result = this.instantiationService.createInstance(debuginputs.DebugStringEditorInput, source.name, source.uri, source.origin, value, mtype, void 0);
                this.debugStringEditorInputs.push(result);
                return result;
            }
            else {
                return filtered[0];
            }
        };
        DebugService.prototype.sendAllBreakpoints = function () {
            var _this = this;
            return winjs_base_1.Promise.join(arrays.distinct(this.model.getBreakpoints(), function (bp) { return bp.source.uri.toString(); }).map(function (bp) { return _this.sendBreakpoints(bp.source.uri); }));
        };
        DebugService.prototype.sendBreakpoints = function (modelUri) {
            var _this = this;
            if (!this.session || !this.session.readyForBreakpoints) {
                return winjs_base_1.Promise.as(null);
            }
            var breakpointsToSend = arrays.distinct(this.model.getBreakpoints().filter(function (bp) { return _this.model.areBreakpointsActivated() && bp.enabled && bp.source.uri.toString() === modelUri.toString(); }), function (bp) { return ("" + bp.desiredLineNumber); });
            var rawSource = breakpointsToSend.length > 0 ? breakpointsToSend[0].source.raw : debugSource_1.Source.toRawSource(modelUri, null);
            return this.session.setBreakpoints({ source: rawSource, lines: breakpointsToSend.map(function (bp) { return bp.desiredLineNumber; }),
                breakpoints: breakpointsToSend.map(function (bp) { return ({ line: bp.desiredLineNumber, condition: bp.condition }); }) }).then(function (response) {
                var data = {};
                for (var i = 0; i < breakpointsToSend.length; i++) {
                    data[breakpointsToSend[i].getId()] = response.body.breakpoints[i];
                }
                _this.model.updateBreakpoints(data);
            });
        };
        DebugService.prototype.sendExceptionBreakpoints = function () {
            if (!this.session || !this.session.readyForBreakpoints) {
                return winjs_base_1.Promise.as(null);
            }
            var enabledExBreakpoints = this.model.getExceptionBreakpoints().filter(function (exb) { return exb.enabled; });
            return this.session.setExceptionBreakpoints({ filters: enabledExBreakpoints.map(function (exb) { return exb.name; }) });
        };
        DebugService.prototype.onFileChanges = function (fileChangesEvent) {
            this.model.removeBreakpoints(this.model.getBreakpoints().filter(function (bp) {
                return fileChangesEvent.contains(bp.source.uri, files_2.FileChangeType.DELETED);
            }));
        };
        DebugService.prototype.store = function () {
            this.storageService.store(DEBUG_BREAKPOINTS_KEY, JSON.stringify(this.model.getBreakpoints()), storage_1.StorageScope.WORKSPACE);
            this.storageService.store(DEBUG_BREAKPOINTS_ACTIVATED_KEY, this.model.areBreakpointsActivated() ? 'true' : 'false', storage_1.StorageScope.WORKSPACE);
            this.storageService.store(DEBUG_FUNCTION_BREAKPOINTS_KEY, JSON.stringify(this.model.getFunctionBreakpoints()), storage_1.StorageScope.WORKSPACE);
            this.storageService.store(DEBUG_EXCEPTION_BREAKPOINTS_KEY, JSON.stringify(this.model.getExceptionBreakpoints()), storage_1.StorageScope.WORKSPACE);
            this.storageService.store(DEBUG_SELECTED_CONFIG_NAME_KEY, this.configurationManager.getConfigurationName(), storage_1.StorageScope.WORKSPACE);
            this.storageService.store(DEBUG_WATCH_EXPRESSIONS_KEY, JSON.stringify(this.model.getWatchExpressions()), storage_1.StorageScope.WORKSPACE);
        };
        DebugService.prototype.dispose = function () {
            if (this.session) {
                this.session.disconnect();
                this.session = null;
            }
            this.model.dispose();
            this.toDispose = lifecycle.disposeAll(this.toDispose);
        };
        DebugService = __decorate([
            __param(0, storage_1.IStorageService),
            __param(1, editorService_1.IWorkbenchEditorService),
            __param(2, files_1.ITextFileService),
            __param(3, viewletService_1.IViewletService),
            __param(4, files_2.IFileService),
            __param(5, message_1.IMessageService),
            __param(6, partService_1.IPartService),
            __param(7, windowService_1.IWindowService),
            __param(8, telemetry_1.ITelemetryService),
            __param(9, contextService_1.IWorkspaceContextService),
            __param(10, keybindingService_1.IKeybindingService),
            __param(11, event_1.IEventService),
            __param(12, lifecycle_1.ILifecycleService),
            __param(13, instantiation_1.IInstantiationService),
            __param(14, plugins_1.IPluginService),
            __param(15, output_1.IOutputService)
        ], DebugService);
        return DebugService;
    })(ee.EventEmitter);
    exports.DebugService = DebugService;
});
//# sourceMappingURL=debugService.js.map