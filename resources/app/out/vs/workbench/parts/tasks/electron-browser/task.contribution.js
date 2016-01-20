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
define(["require", "exports", 'vs/nls', 'vs/base/common/flags', 'vs/base/common/winjs.base', 'vs/base/common/severity', 'vs/base/common/objects', 'vs/base/common/actions', 'vs/base/browser/dom', 'vs/base/common/lifecycle', 'vs/base/common/eventEmitter', 'vs/base/browser/builder', 'vs/base/common/uri', 'vs/base/common/types', 'vs/base/common/keyCodes', 'vs/base/common/glob', 'vs/base/common/platform', 'vs/platform/platform', 'vs/platform/lifecycle/common/lifecycle', 'vs/platform/actions/common/actions', 'vs/platform/instantiation/common/extensions', 'vs/platform/event/common/event', 'vs/platform/message/common/message', 'vs/platform/markers/common/markers', 'vs/platform/telemetry/common/telemetry', 'vs/platform/configuration/common/configuration', 'vs/platform/files/common/files', 'vs/platform/instantiation/common/instantiation', 'vs/platform/plugins/common/plugins', 'vs/editor/common/services/modeService', 'vs/editor/common/services/modelService', 'vs/platform/jsonschemas/common/jsonContributionRegistry', 'vs/workbench/common/contributions', 'vs/workbench/common/actionRegistry', 'vs/workbench/browser/parts/statusbar/statusbar', 'vs/workbench/browser/quickopen', 'vs/workbench/services/quickopen/common/quickOpenService', 'vs/workbench/services/editor/common/editorService', 'vs/workbench/services/workspace/common/contextService', 'vs/workbench/parts/lib/node/systemVariables', 'vs/workbench/parts/files/common/files', 'vs/workbench/parts/output/common/output', 'vs/workbench/parts/tasks/common/taskSystem', 'vs/workbench/parts/tasks/common/taskService', 'vs/workbench/parts/tasks/common/languageServiceTaskSystem', 'vs/workbench/parts/tasks/node/processRunnerSystem', 'vs/workbench/parts/tasks/node/processRunnerDetector', 'vs/css!./media/task.contribution', 'vs/workbench/parts/tasks/browser/taskQuickOpen'], function (require, exports, nls, Env, winjs_base_1, severity_1, Objects, actions_1, Dom, lifecycle_1, eventEmitter_1, Builder, uri_1, Types, keyCodes_1, glob_1, platform_1, platform_2, lifecycle_2, actions_2, extensions_1, event_1, message_1, markers_1, telemetry_1, configuration_1, files_1, instantiation_1, plugins_1, modeService_1, modelService_1, jsonContributionRegistry, contributions_1, workbenchActionRegistry, statusbar, QuickOpen, quickOpenService_1, editorService_1, contextService_1, systemVariables_1, files_2, output_1, taskSystem_1, taskService_1, languageServiceTaskSystem_1, processRunnerSystem_1, processRunnerDetector_1) {
    var $ = Builder.$;
    var AbstractTaskAction = (function (_super) {
        __extends(AbstractTaskAction, _super);
        function AbstractTaskAction(id, label, taskService, telemetryService) {
            _super.call(this, id, label);
            this.taskService = taskService;
            this.telemetryService = telemetryService;
        }
        AbstractTaskAction = __decorate([
            __param(2, taskService_1.ITaskService),
            __param(3, telemetry_1.ITelemetryService)
        ], AbstractTaskAction);
        return AbstractTaskAction;
    })(actions_1.Action);
    var BuildAction = (function (_super) {
        __extends(BuildAction, _super);
        function BuildAction(id, label, taskService, telemetryService) {
            _super.call(this, id, label, taskService, telemetryService);
        }
        BuildAction.prototype.run = function () {
            return this.taskService.build();
        };
        BuildAction.ID = 'workbench.action.tasks.build';
        BuildAction.TEXT = nls.localize('BuildAction.label', 'Run Build Task');
        BuildAction = __decorate([
            __param(2, taskService_1.ITaskService),
            __param(3, telemetry_1.ITelemetryService)
        ], BuildAction);
        return BuildAction;
    })(AbstractTaskAction);
    var TestAction = (function (_super) {
        __extends(TestAction, _super);
        function TestAction(id, label, taskService, telemetryService) {
            _super.call(this, id, label, taskService, telemetryService);
        }
        TestAction.prototype.run = function () {
            return this.taskService.runTest();
        };
        TestAction.ID = 'workbench.action.tasks.test';
        TestAction.TEXT = nls.localize('TestAction.label', 'Run Test Task');
        TestAction = __decorate([
            __param(2, taskService_1.ITaskService),
            __param(3, telemetry_1.ITelemetryService)
        ], TestAction);
        return TestAction;
    })(AbstractTaskAction);
    var RebuildAction = (function (_super) {
        __extends(RebuildAction, _super);
        function RebuildAction(id, label, taskService, telemetryService) {
            _super.call(this, id, label, taskService, telemetryService);
        }
        RebuildAction.prototype.run = function () {
            return this.taskService.rebuild();
        };
        RebuildAction.ID = 'workbench.action.tasks.rebuild';
        RebuildAction.TEXT = nls.localize('RebuildAction.label', 'Run Rebuild Task');
        RebuildAction = __decorate([
            __param(2, taskService_1.ITaskService),
            __param(3, telemetry_1.ITelemetryService)
        ], RebuildAction);
        return RebuildAction;
    })(AbstractTaskAction);
    var CleanAction = (function (_super) {
        __extends(CleanAction, _super);
        function CleanAction(id, label, taskService, telemetryService) {
            _super.call(this, id, label, taskService, telemetryService);
        }
        CleanAction.prototype.run = function () {
            return this.taskService.clean();
        };
        CleanAction.ID = 'workbench.action.tasks.clean';
        CleanAction.TEXT = nls.localize('CleanAction.label', 'Run Clean Task');
        CleanAction = __decorate([
            __param(2, taskService_1.ITaskService),
            __param(3, telemetry_1.ITelemetryService)
        ], CleanAction);
        return CleanAction;
    })(AbstractTaskAction);
    var ConfigureTaskRunnerAction = (function (_super) {
        __extends(ConfigureTaskRunnerAction, _super);
        function ConfigureTaskRunnerAction(id, label, configurationService, editorService, fileService, contextService, outputService, messageService) {
            _super.call(this, id, label);
            this.configurationService = configurationService;
            this.editorService = editorService;
            this.fileService = fileService;
            this.contextService = contextService;
            this.outputService = outputService;
            this.messageService = messageService;
        }
        ConfigureTaskRunnerAction.prototype.run = function (event) {
            var _this = this;
            var sideBySide = !!(event && (event.ctrlKey || event.metaKey));
            var autoDetectFailed = false;
            return this.fileService.resolveFile(this.contextService.toResource('.vscode/tasks.json')).then(function (success) {
                return success;
            }, function (err) {
                var detector = new processRunnerDetector_1.ProcessRunnerDetector(_this.fileService, _this.contextService, new systemVariables_1.SystemVariables(_this.editorService, _this.contextService));
                return detector.detect(false).then(function (value) {
                    var config = value.config;
                    if (value.stderr && value.stderr.length > 0) {
                        value.stderr.forEach(function (line) {
                            _this.outputService.append(TaskService.OutputChannel, line + '\n');
                        });
                        autoDetectFailed = true;
                        _this.messageService.show(severity_1.default.Error, nls.localize('ConfigureTaskRunnerAction.autoDetect', 'Auto detecting the task system failed. Consult the task output for details'));
                    }
                    var contentPromise;
                    if (config) {
                        contentPromise = winjs_base_1.TPromise.as(JSON.stringify(config, null, 4));
                    }
                    else {
                        // TODO@Dirk: Converting double time here to get a wrong uri that is compatible with the rest of the system
                        var configSampleUri = uri_1.default.parse(require.toUrl('vs/workbench/parts/tasks/common/taskSampleConfig.json'));
                        contentPromise = _this.fileService.resolveContent(configSampleUri, { encoding: 'utf8' /* make sure to keep sample file encoding as we stored it! */ }).then(function (content) {
                            return content.value;
                        }, function (err) {
                            var config = {
                                version: '0.1.0',
                                command: 'msbuild.exe',
                                args: ['/property:GenerateFullPaths=true'],
                                problemMatcher: '$msCompile'
                            };
                            return JSON.stringify(config, null, 4);
                        });
                    }
                    return contentPromise.then(function (content) {
                        return _this.fileService.createFile(_this.contextService.toResource('.vscode/tasks.json'), content);
                    });
                });
            }).then(function (stat) {
                // (2) Open editor with configuration file
                return _this.editorService.openEditor({
                    resource: stat.resource,
                    options: {
                        forceOpen: true
                    }
                }, sideBySide).then(function (value) {
                    _this.outputService.showOutput(TaskService.OutputChannel, true, true);
                    return value;
                });
            }, function (error) {
                throw new Error(nls.localize('ConfigureTaskRunnerAction.failed', "Unable to create the 'tasks.json' file inside the '.vscode' folder. Consult the task output for details."));
            });
        };
        ConfigureTaskRunnerAction.ID = 'workbench.action.tasks.configureTaskRunner';
        ConfigureTaskRunnerAction.TEXT = nls.localize('ConfigureTaskRunnerAction.label', 'Configure Task Runner');
        ConfigureTaskRunnerAction = __decorate([
            __param(2, configuration_1.IConfigurationService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, files_1.IFileService),
            __param(5, contextService_1.IWorkspaceContextService),
            __param(6, output_1.IOutputService),
            __param(7, message_1.IMessageService)
        ], ConfigureTaskRunnerAction);
        return ConfigureTaskRunnerAction;
    })(actions_1.Action);
    var CloseMessageAction = (function (_super) {
        __extends(CloseMessageAction, _super);
        function CloseMessageAction() {
            _super.call(this, CloseMessageAction.ID, CloseMessageAction.TEXT);
        }
        CloseMessageAction.prototype.run = function () {
            if (this.closeFunction) {
                this.closeFunction();
            }
            return winjs_base_1.Promise.as(null);
        };
        CloseMessageAction.ID = 'workbench.action.build.closeMessage';
        CloseMessageAction.TEXT = nls.localize('CloseMessageAction.label', 'Close');
        return CloseMessageAction;
    })(actions_1.Action);
    var TerminateAction = (function (_super) {
        __extends(TerminateAction, _super);
        function TerminateAction(id, label, taskService, telemetryService) {
            _super.call(this, id, label, taskService, telemetryService);
        }
        TerminateAction.prototype.run = function () {
            var _this = this;
            return this.taskService.isActive().then(function (active) {
                if (active) {
                    return _this.taskService.terminate().then(function (response) {
                        if (response.success) {
                            return;
                        }
                        else {
                            return winjs_base_1.Promise.wrapError(nls.localize('TerminateAction.failed', 'Failed to terminate running task'));
                        }
                    });
                }
            });
        };
        TerminateAction.ID = 'workbench.action.tasks.terminate';
        TerminateAction.TEXT = nls.localize('TerminateAction.label', 'Terminate Running Task');
        TerminateAction = __decorate([
            __param(2, taskService_1.ITaskService),
            __param(3, telemetry_1.ITelemetryService)
        ], TerminateAction);
        return TerminateAction;
    })(AbstractTaskAction);
    var ShowLogAction = (function (_super) {
        __extends(ShowLogAction, _super);
        function ShowLogAction(id, label, taskService, telemetryService, outputService) {
            _super.call(this, id, label, taskService, telemetryService);
            this.outputService = outputService;
        }
        ShowLogAction.prototype.run = function () {
            return this.outputService.showOutput(TaskService.OutputChannel);
        };
        ShowLogAction.ID = 'workbench.action.tasks.showLog';
        ShowLogAction.TEXT = nls.localize('ShowLogAction.label', 'Show Task Log');
        ShowLogAction = __decorate([
            __param(2, taskService_1.ITaskService),
            __param(3, telemetry_1.ITelemetryService),
            __param(4, output_1.IOutputService)
        ], ShowLogAction);
        return ShowLogAction;
    })(AbstractTaskAction);
    var RunTaskAction = (function (_super) {
        __extends(RunTaskAction, _super);
        function RunTaskAction(id, label, quickOpenService) {
            _super.call(this, id, label);
            this.quickOpenService = quickOpenService;
        }
        RunTaskAction.prototype.run = function (event) {
            this.quickOpenService.show('task ');
            return winjs_base_1.Promise.as(null);
        };
        RunTaskAction.ID = 'workbench.action.tasks.runTask';
        RunTaskAction.TEXT = nls.localize('RunTaskAction.label', "Run Task");
        RunTaskAction = __decorate([
            __param(2, quickOpenService_1.IQuickOpenService)
        ], RunTaskAction);
        return RunTaskAction;
    })(actions_1.Action);
    var StatusBarItem = (function () {
        function StatusBarItem(quickOpenService, markerService, outputService, taskService) {
            this.quickOpenService = quickOpenService;
            this.markerService = markerService;
            this.outputService = outputService;
            this.taskService = taskService;
            this.activeCount = 0;
        }
        StatusBarItem.prototype.render = function (container) {
            var _this = this;
            var callOnDispose = [], element = document.createElement('div'), 
            // icon = document.createElement('a'),
            progress = document.createElement('div'), label = document.createElement('a'), error = document.createElement('div'), warning = document.createElement('div'), info = document.createElement('div');
            Dom.addClass(element, 'task-statusbar-item');
            // dom.addClass(icon, 'task-statusbar-item-icon');
            // element.appendChild(icon);
            Dom.addClass(progress, 'task-statusbar-item-progress');
            element.appendChild(progress);
            progress.innerHTML = StatusBarItem.progressChars[0];
            $(progress).hide();
            Dom.addClass(label, 'task-statusbar-item-label');
            element.appendChild(label);
            Dom.addClass(error, 'task-statusbar-item-label-error');
            error.innerHTML = '0';
            label.appendChild(error);
            Dom.addClass(warning, 'task-statusbar-item-label-warning');
            warning.innerHTML = '0';
            label.appendChild(warning);
            Dom.addClass(info, 'task-statusbar-item-label-info');
            label.appendChild(info);
            $(info).hide();
            //		callOnDispose.push(dom.addListener(icon, 'click', (e:MouseEvent) => {
            //			this.outputService.showOutput(TaskService.OutputChannel, e.ctrlKey || e.metaKey, true);
            //		}));
            callOnDispose.push(Dom.addListener(label, 'click', function (e) {
                _this.quickOpenService.show('!');
            }));
            var updateStatus = function (element, stats) {
                if (stats > 0) {
                    element.innerHTML = stats.toString();
                    $(element).show();
                    return true;
                }
                else {
                    $(element).hide();
                    return false;
                }
            };
            var manyMarkers = nls.localize('manyMarkers', "99+");
            var updateLabel = function (stats) {
                error.innerHTML = stats.errors < 100 ? stats.errors.toString() : manyMarkers;
                warning.innerHTML = stats.warnings < 100 ? stats.warnings.toString() : manyMarkers;
                updateStatus(info, stats.infos);
            };
            this.markerService.onMarkerChanged(function (changedResources) {
                updateLabel(_this.markerService.getStatistics());
            });
            callOnDispose.push(this.taskService.addListener(taskService_1.TaskServiceEvents.Active, function () {
                _this.activeCount++;
                if (_this.activeCount === 1) {
                    var index = 1;
                    var chars = StatusBarItem.progressChars;
                    progress.innerHTML = chars[0];
                    _this.intervalToken = setInterval(function () {
                        progress.innerHTML = chars[index];
                        index++;
                        if (index >= chars.length) {
                            index = 0;
                        }
                    }, 50);
                    $(progress).show();
                }
            }));
            callOnDispose.push(this.taskService.addListener(taskService_1.TaskServiceEvents.Inactive, function (data) {
                _this.activeCount--;
                if (_this.activeCount === 0) {
                    $(progress).hide();
                    clearInterval(_this.intervalToken);
                    _this.intervalToken = null;
                }
            }));
            callOnDispose.push(this.taskService.addListener(taskService_1.TaskServiceEvents.Terminated, function () {
                if (_this.activeCount !== 0) {
                    $(progress).hide();
                    if (_this.intervalToken) {
                        clearInterval(_this.intervalToken);
                        _this.intervalToken = null;
                    }
                    _this.activeCount = 0;
                }
            }));
            container.appendChild(element);
            return {
                dispose: function () { return lifecycle_1.cAll(callOnDispose); }
            };
        };
        StatusBarItem.progressChars = '|/-\\';
        StatusBarItem = __decorate([
            __param(0, quickOpenService_1.IQuickOpenService),
            __param(1, markers_1.IMarkerService),
            __param(2, output_1.IOutputService),
            __param(3, taskService_1.ITaskService)
        ], StatusBarItem);
        return StatusBarItem;
    })();
    var TaskService = (function (_super) {
        __extends(TaskService, _super);
        function TaskService(modeService, configurationService, markerService, outputService, messageService, editorService, fileService, contextService, telemetryService, textFileService, lifecycleService, eventService, modelService, pluginService) {
            var _this = this;
            _super.call(this);
            this.serviceId = taskService_1.ITaskService;
            this.modeService = modeService;
            this.configurationService = configurationService;
            this.markerService = markerService;
            this.outputService = outputService;
            this.messageService = messageService;
            this.editorService = editorService;
            this.fileService = fileService;
            this.contextService = contextService;
            this.telemetryService = telemetryService;
            this.textFileService = textFileService;
            this.eventService = eventService;
            this.modelService = modelService;
            this.pluginService = pluginService;
            this.taskSystemListeners = [];
            this.clearTaskSystemPromise = false;
            this.configurationService.addListener(configuration_1.ConfigurationServiceEventTypes.UPDATED, function () {
                _this.emit(taskService_1.TaskServiceEvents.ConfigChanged);
                if (_this._taskSystem && _this._taskSystem.isActiveSync()) {
                    _this.clearTaskSystemPromise = true;
                }
                else {
                    _this._taskSystem = null;
                    _this._taskSystemPromise = null;
                }
                _this.disposeTaskSystemListeners();
            });
            lifecycleService.addBeforeShutdownParticipant(this);
        }
        TaskService.prototype.disposeTaskSystemListeners = function () {
            this.taskSystemListeners.forEach(function (unbind) { return unbind(); });
            this.taskSystemListeners = [];
        };
        TaskService.prototype.disposeFileChangesListener = function () {
            if (this.fileChangesListener) {
                this.fileChangesListener();
                this.fileChangesListener = null;
            }
        };
        Object.defineProperty(TaskService.prototype, "taskSystemPromise", {
            get: function () {
                var _this = this;
                if (!this._taskSystemPromise) {
                    var variables = new systemVariables_1.SystemVariables(this.editorService, this.contextService);
                    var clearOutput = true;
                    this._taskSystemPromise = this.configurationService.loadConfiguration('tasks').then(function (config) {
                        var parseErrors = config ? config.$parseErrors : null;
                        if (parseErrors) {
                            var isAffected = false;
                            for (var i = 0; i < parseErrors.length; i++) {
                                if (/tasks\.json$/.test(parseErrors[i])) {
                                    isAffected = true;
                                    break;
                                }
                            }
                            if (isAffected) {
                                _this.outputService.append(TaskService.OutputChannel, nls.localize('TaskSystem.invalidTaskJson', 'Error: The content of the tasks.json file has syntax errors. Please correct them before executing a task.\n'));
                                _this.outputService.showOutput(TaskService.OutputChannel, true, true);
                                return winjs_base_1.TPromise.wrapError({});
                            }
                        }
                        var configPromise;
                        if (config) {
                            if (_this.isRunnerConfig(config) && _this.hasDetectorSupport(config)) {
                                var fileConfig = config;
                                configPromise = new processRunnerDetector_1.ProcessRunnerDetector(_this.fileService, _this.contextService, variables, fileConfig).detect(true).then(function (value) {
                                    clearOutput = _this.printStderr(value.stderr);
                                    var detectedConfig = value.config;
                                    if (!detectedConfig) {
                                        return config;
                                    }
                                    var result = Objects.clone(fileConfig);
                                    var configuredTasks = Object.create(null);
                                    if (!result.tasks) {
                                        if (detectedConfig.tasks) {
                                            result.tasks = detectedConfig.tasks;
                                        }
                                    }
                                    else {
                                        result.tasks.forEach(function (task) { return configuredTasks[task.taskName] = task; });
                                        detectedConfig.tasks.forEach(function (task) {
                                            if (!configuredTasks[task.taskName]) {
                                                result.tasks.push(task);
                                            }
                                        });
                                    }
                                    return result;
                                });
                            }
                            else {
                                configPromise = winjs_base_1.TPromise.as(config);
                            }
                        }
                        else {
                            configPromise = new processRunnerDetector_1.ProcessRunnerDetector(_this.fileService, _this.contextService, variables).detect(true).then(function (value) {
                                clearOutput = _this.printStderr(value.stderr);
                                return value.config;
                            });
                        }
                        return configPromise.then(function (config) {
                            if (!config) {
                                _this._taskSystemPromise = null;
                                throw new taskSystem_1.TaskError(severity_1.default.Info, nls.localize('TaskSystem.noConfiguration', 'No task runner configured.'), 1);
                            }
                            var result = null;
                            if (config.buildSystem === 'service') {
                                result = new languageServiceTaskSystem_1.LanguageServiceTaskSystem(config, _this.telemetryService, _this.modeService);
                            }
                            else if (_this.isRunnerConfig(config)) {
                                result = new processRunnerSystem_1.ProcessRunnerSystem(config, variables, _this.markerService, _this.modelService, _this.telemetryService, _this.outputService, TaskService.OutputChannel, clearOutput);
                            }
                            if (result === null) {
                                _this._taskSystemPromise = null;
                                throw new taskSystem_1.TaskError(severity_1.default.Info, nls.localize('TaskSystem.noBuildType', "No valid task runner configured. Supported task runners are 'service' and 'program'."));
                            }
                            _this.taskSystemListeners.push(result.addListener(taskSystem_1.TaskSystemEvents.Active, function (event) { return _this.emit(taskService_1.TaskServiceEvents.Active, event); }));
                            _this.taskSystemListeners.push(result.addListener(taskSystem_1.TaskSystemEvents.Inactive, function (event) { return _this.emit(taskService_1.TaskServiceEvents.Inactive, event); }));
                            _this._taskSystem = result;
                            return result;
                        }, function (err) {
                            _this.handleError(err);
                            return winjs_base_1.Promise.wrapError(err);
                        });
                    });
                }
                return this._taskSystemPromise;
            },
            enumerable: true,
            configurable: true
        });
        TaskService.prototype.printStderr = function (stderr) {
            var _this = this;
            var result = true;
            if (stderr && stderr.length > 0) {
                stderr.forEach(function (line) {
                    result = false;
                    _this.outputService.append(TaskService.OutputChannel, line + '\n');
                });
                this.outputService.showOutput(TaskService.OutputChannel, true, true);
            }
            return result;
        };
        TaskService.prototype.isRunnerConfig = function (config) {
            return !config.buildSystem || config.buildSystem === 'program';
        };
        TaskService.prototype.hasDetectorSupport = function (config) {
            if (!config.command) {
                return false;
            }
            return processRunnerDetector_1.ProcessRunnerDetector.supports(config.command);
        };
        TaskService.prototype.build = function () {
            return this.executeTarget(function (taskSystem) { return taskSystem.build(); });
        };
        TaskService.prototype.rebuild = function () {
            return this.executeTarget(function (taskSystem) { return taskSystem.rebuild(); });
        };
        TaskService.prototype.clean = function () {
            return this.executeTarget(function (taskSystem) { return taskSystem.clean(); });
        };
        TaskService.prototype.runTest = function () {
            return this.executeTarget(function (taskSystem) { return taskSystem.runTest(); });
        };
        TaskService.prototype.run = function (taskIdentifier) {
            return this.executeTarget(function (taskSystem) { return taskSystem.run(taskIdentifier); });
        };
        TaskService.prototype.executeTarget = function (fn) {
            var _this = this;
            return this.textFileService.saveAll().then(function (value) {
                return _this.taskSystemPromise.
                    then(function (taskSystem) {
                    return taskSystem.isActive().then(function (active) {
                        if (!active) {
                            return fn(taskSystem);
                        }
                        else {
                            throw new taskSystem_1.TaskError(severity_1.default.Warning, nls.localize('TaskSystem.active', 'There is an active running task right now. Terminate it first before executing another task.'), 2);
                        }
                    });
                }).
                    then(function (runResult) {
                    if (runResult.restartOnFileChanges) {
                        var pattern = runResult.restartOnFileChanges;
                        _this.fileChangesListener = _this.eventService.addListener(files_1.EventType.FILE_CHANGES, function (event) {
                            var needsRestart = event.changes.some(function (change) {
                                return (change.type === files_1.FileChangeType.ADDED || change.type === files_1.FileChangeType.DELETED) && !!glob_1.match(pattern, change.resource.fsPath);
                            });
                            if (needsRestart) {
                                _this.terminate().done(function () {
                                    // We need to give the child process a change to stop.
                                    platform_1.setTimeout(function () {
                                        _this.executeTarget(fn);
                                    }, 2000);
                                });
                            }
                        });
                    }
                    return runResult.promise.then(function (value) {
                        if (_this.clearTaskSystemPromise) {
                            _this._taskSystemPromise = null;
                            _this.clearTaskSystemPromise = false;
                        }
                        return value;
                    });
                }, function (err) {
                    _this.handleError(err);
                });
            });
        };
        TaskService.prototype.isActive = function () {
            if (this._taskSystemPromise) {
                return this.taskSystemPromise.then(function (taskSystem) { return taskSystem.isActive(); });
            }
            return winjs_base_1.TPromise.as(false);
        };
        TaskService.prototype.terminate = function () {
            var _this = this;
            if (this._taskSystemPromise) {
                return this.taskSystemPromise.then(function (taskSystem) {
                    return taskSystem.terminate();
                }).then(function (response) {
                    if (response.success) {
                        if (_this.clearTaskSystemPromise) {
                            _this._taskSystemPromise = null;
                            _this.clearTaskSystemPromise = false;
                        }
                        _this.emit(taskService_1.TaskServiceEvents.Terminated, {});
                        _this.disposeFileChangesListener();
                    }
                    return response;
                });
            }
            return winjs_base_1.TPromise.as({ success: true });
        };
        TaskService.prototype.tasks = function () {
            return this.taskSystemPromise.then(function (taskSystem) { return taskSystem.tasks(); });
        };
        TaskService.prototype.beforeShutdown = function () {
            var _this = this;
            if (this._taskSystem && this._taskSystem.isActiveSync()) {
                if (this._taskSystem.canAutoTerminate() || this.messageService.confirm({
                    message: nls.localize('TaskSystem.runningTask', 'There is a task running. Do you want to terminate it?'),
                    primaryButton: nls.localize('TaskSystem.terminateTask', "&&Terminate Task")
                })) {
                    return this._taskSystem.terminate().then(function (response) {
                        if (response.success) {
                            _this.emit(taskService_1.TaskServiceEvents.Terminated, {});
                            _this._taskSystem = null;
                            _this.disposeFileChangesListener();
                            _this.disposeTaskSystemListeners();
                            return false; // no veto
                        }
                        return true; // veto
                    }, function (err) {
                        return true; // veto
                    });
                }
                else {
                    return true; // veto
                }
            }
            return false; // Nothing to do here
        };
        TaskService.prototype.handleError = function (err) {
            var showOutput = true;
            if (err instanceof taskSystem_1.TaskError) {
                var buildError = err;
                if (buildError.code === 1 || buildError.code === 2) {
                    var closeAction = new CloseMessageAction();
                    var action = buildError.code === 1
                        ? new ConfigureTaskRunnerAction(ConfigureTaskRunnerAction.ID, ConfigureTaskRunnerAction.TEXT, this.configurationService, this.editorService, this.fileService, this.contextService, this.outputService, this.messageService)
                        : new TerminateAction(TerminateAction.ID, TerminateAction.TEXT, this, this.telemetryService);
                    closeAction.closeFunction = this.messageService.show(buildError.severity, { message: buildError.message, actions: [closeAction, action] });
                }
                else {
                    this.messageService.show(buildError.severity, buildError.message);
                }
            }
            else if (err instanceof Error) {
                var error = err;
                this.messageService.show(severity_1.default.Error, error.message);
            }
            else if (Types.isString(err)) {
                this.messageService.show(severity_1.default.Error, err);
            }
            else {
                this.messageService.show(severity_1.default.Error, nls.localize('TaskSystem.unknownError', 'An error has occurred while running a task. See task log for details.'));
            }
            if (showOutput) {
                this.outputService.showOutput(TaskService.OutputChannel, false, true);
            }
        };
        TaskService.SERVICE_ID = 'taskService';
        TaskService.OutputChannel = 'Tasks';
        TaskService = __decorate([
            __param(0, modeService_1.IModeService),
            __param(1, configuration_1.IConfigurationService),
            __param(2, markers_1.IMarkerService),
            __param(3, output_1.IOutputService),
            __param(4, message_1.IMessageService),
            __param(5, editorService_1.IWorkbenchEditorService),
            __param(6, files_1.IFileService),
            __param(7, contextService_1.IWorkspaceContextService),
            __param(8, telemetry_1.ITelemetryService),
            __param(9, files_2.ITextFileService),
            __param(10, lifecycle_2.ILifecycleService),
            __param(11, event_1.IEventService),
            __param(12, modelService_1.IModelService),
            __param(13, plugins_1.IPluginService)
        ], TaskService);
        return TaskService;
    })(eventEmitter_1.EventEmitter);
    var TaskServiceParticipant = (function () {
        function TaskServiceParticipant(instantiationService) {
            this.instantiationService = instantiationService;
            // Force loading the language worker service
            this.instantiationService.getInstance(taskService_1.ITaskService);
        }
        TaskServiceParticipant.prototype.getId = function () {
            return 'vs.taskService';
        };
        TaskServiceParticipant = __decorate([
            __param(0, instantiation_1.IInstantiationService)
        ], TaskServiceParticipant);
        return TaskServiceParticipant;
    })();
    exports.TaskServiceParticipant = TaskServiceParticipant;
    if (Env.enableTasks) {
        // Task Service
        extensions_1.registerSingleton(taskService_1.ITaskService, TaskService);
        // Actions
        var tasksCategory = nls.localize('tasksCategory', "Tasks");
        var workbenchActionsRegistry = platform_2.Registry.as(workbenchActionRegistry.Extensions.WorkbenchActions);
        workbenchActionsRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(BuildAction, BuildAction.ID, BuildAction.TEXT, { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_B }), tasksCategory);
        workbenchActionsRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(TestAction, TestAction.ID, TestAction.TEXT, { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_T }), tasksCategory);
        // workbenchActionsRegistry.registerWorkbenchAction(new SyncActionDescriptor(RebuildAction, RebuildAction.ID, RebuildAction.TEXT), tasksCategory);
        // workbenchActionsRegistry.registerWorkbenchAction(new SyncActionDescriptor(CleanAction, CleanAction.ID, CleanAction.TEXT), tasksCategory);
        workbenchActionsRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(TerminateAction, TerminateAction.ID, TerminateAction.TEXT), tasksCategory);
        workbenchActionsRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(ConfigureTaskRunnerAction, ConfigureTaskRunnerAction.ID, ConfigureTaskRunnerAction.TEXT), tasksCategory);
        workbenchActionsRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(ShowLogAction, ShowLogAction.ID, ShowLogAction.TEXT), tasksCategory);
        workbenchActionsRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(RunTaskAction, RunTaskAction.ID, RunTaskAction.TEXT), tasksCategory);
        // Register Quick Open
        platform_2.Registry.as(QuickOpen.Extensions.Quickopen).registerQuickOpenHandler(new QuickOpen.QuickOpenHandlerDescriptor('vs/workbench/parts/tasks/browser/taskQuickOpen', 'QuickOpenHandler', 'task ', nls.localize('taskCommands', "Run Task")));
        // Status bar
        var statusbarRegistry = platform_2.Registry.as(statusbar.Extensions.Statusbar);
        statusbarRegistry.registerStatusbarItem(new statusbar.StatusbarItemDescriptor(StatusBarItem, statusbar.StatusbarAlignment.LEFT, 50 /* Medium Priority */));
        // Output channel
        var outputChannelRegistry = platform_2.Registry.as(output_1.Extensions.OutputChannels);
        outputChannelRegistry.registerChannel(TaskService.OutputChannel);
        platform_2.Registry.as(contributions_1.Extensions.Workbench).registerWorkbenchContribution(TaskServiceParticipant);
        // tasks.json validation
        var schemaId = 'local://schemas/tasks';
        var schema = {
            'id': schemaId,
            'description': 'Task definition file',
            'type': 'object',
            'default': {
                'version': '0.1.0',
                'command': 'myCommand',
                'isShellCommand': false,
                'args': [],
                'showOutput': 'always',
                'tasks': [
                    {
                        'taskName': 'build',
                        'showOutput': 'silent',
                        'isBuildCommand': true,
                        'problemMatcher': ['$tsc', '$lessCompile']
                    }
                ]
            },
            'definitions': {
                'showOutputType': {
                    'type': 'string',
                    'enum': ['always', 'silent', 'never'],
                    'default': 'silent'
                },
                'patternType': {
                    'anyOf': [
                        {
                            'type': 'string',
                            'enum': ['$tsc', '$tsc-watch', '$msCompile', '$lessCompile', '$gulp-tsc', '$cpp', '$csc', '$vb', '$jshint', '$jshint-stylish', '$eslint-compact', '$eslint-stylish']
                        },
                        {
                            '$ref': '#/definitions/pattern'
                        },
                        {
                            'type': 'array',
                            'items': {
                                '$ref': '#/definitions/pattern'
                            }
                        }
                    ]
                },
                'pattern': {
                    'default': {
                        'regexp': '^([^\\\\s].*)\\\\((\\\\d+,\\\\d+)\\\\):\\\\s*(.*)$',
                        'file': 1,
                        'location': 2,
                        'message': 3
                    },
                    'additionalProperties': false,
                    'properties': {
                        'regexp': {
                            'type': 'string',
                            'description': nls.localize('JsonSchema.pattern.regexp', 'The regular expression to find an error, warning or info in the output.')
                        },
                        'file': {
                            'type': 'integer',
                            'description': nls.localize('JsonSchema.pattern.file', 'The match group index of the filename. If omitted 1 is used.')
                        },
                        'location': {
                            'type': 'integer',
                            'description': nls.localize('JsonSchema.pattern.location', 'The match group index of the problem\'s location. Valid location patterns are: (line), (line,column) and (startLine,startColumn,endLine,endColumn). If omitted line and column is assumed.')
                        },
                        'line': {
                            'type': 'integer',
                            'description': nls.localize('JsonSchema.pattern.line', 'The match group index of the problem\'s line. Defaults to 2')
                        },
                        'column': {
                            'type': 'integer',
                            'description': nls.localize('JsonSchema.pattern.column', 'The match group index of the problem\'s column. Defaults to 3')
                        },
                        'endLine': {
                            'type': 'integer',
                            'description': nls.localize('JsonSchema.pattern.endLine', 'The match group index of the problem\'s end line. Defaults to undefined')
                        },
                        'endColumn': {
                            'type': 'integer',
                            'description': nls.localize('JsonSchema.pattern.endColumn', 'The match group index of the problem\'s end column. Defaults to undefined')
                        },
                        'severity': {
                            'type': 'integer',
                            'description': nls.localize('JsonSchema.pattern.severity', 'The match group index of the problem\'s severity. Defaults to undefined')
                        },
                        'code': {
                            'type': 'integer',
                            'description': nls.localize('JsonSchema.pattern.code', 'The match group index of the problem\'s code. Defaults to undefined')
                        },
                        'message': {
                            'type': 'integer',
                            'description': nls.localize('JsonSchema.pattern.message', 'The match group index of the message. If omitted it defaults to 4 if location is specified. Otherwise it defaults to 5.')
                        },
                        'loop': {
                            'type': 'boolean',
                            'description': nls.localize('JsonSchema.pattern.loop', 'In a multi line matcher loop indicated whether this pattern is executed in a loop as long as it matches. Can only specified on a last pattern in a multi line pattern.')
                        }
                    }
                },
                'problemMatcherType': {
                    'oneOf': [
                        {
                            'type': 'string',
                            'enum': ['$tsc', '$tsc-watch', '$msCompile', '$lessCompile', '$gulp-tsc', '$jshint', '$jshint-stylish', '$eslint-compact', '$eslint-stylish']
                        },
                        {
                            '$ref': '#/definitions/problemMatcher'
                        },
                        {
                            'type': 'array',
                            'items': {
                                'anyOf': [
                                    {
                                        '$ref': '#/definitions/problemMatcher'
                                    },
                                    {
                                        'type': 'string',
                                        'enum': ['$tsc', '$tsc-watch', '$msCompile', '$lessCompile', '$gulp-tsc', '$jshint', '$jshint-stylish', '$eslint-compact', '$eslint-stylish']
                                    }
                                ]
                            }
                        }
                    ]
                },
                'watchingPattern': {
                    'type': 'object',
                    'additionalProperties': false,
                    'properties': {
                        'regexp': {
                            'type': 'string',
                            'description': nls.localize('JsonSchema.watchingPattern.regexp', 'The regular expression to detect the begin or end of a watching task.')
                        },
                        'file': {
                            'type': 'integer',
                            'description': nls.localize('JsonSchema.watchingPattern.file', 'The match group index of the filename. Can be omitted.')
                        },
                    }
                },
                'problemMatcher': {
                    'type': 'object',
                    'additionalProperties': false,
                    'properties': {
                        'base': {
                            'type': 'string',
                            'enum': ['$tsc', '$tsc-watch', '$msCompile', '$lessCompile', '$gulp-tsc', '$jshint', '$jshint-stylish', '$eslint-compact', '$eslint-stylish'],
                            'description': nls.localize('JsonSchema.problemMatcher.base', 'The name of a base problem matcher to use.')
                        },
                        'owner': {
                            'type': 'string',
                            'description': nls.localize('JsonSchema.problemMatcher.owner', 'The owner of the problem inside Code. Can be omitted if base is specified. Defaults to \'external\' if omitted and base is not specified.')
                        },
                        'severity': {
                            'type': 'string',
                            'enum': ['error', 'warning', 'info'],
                            'description': nls.localize('JsonSchema.problemMatcher.severity', 'The default severity for captures problems. Is used if the pattern doesn\' define a match group for severity.')
                        },
                        'pattern': {
                            '$ref': '#/definitions/patternType',
                            'description': nls.localize('JsonSchema.problemMatcher.pattern', 'A problem pattern or the name of a predefined problem pattern. Can be omitted if base is specified.')
                        },
                        'fileLocation': {
                            'oneOf': [
                                {
                                    'type': 'string',
                                    'enum': ['absolute', 'relative']
                                },
                                {
                                    'type': 'array',
                                    'items': {
                                        'type': 'string'
                                    }
                                }
                            ],
                            'description': nls.localize('JsonSchema.problemMatcher.fileLocation', 'Defines how file names reported in a problem pattern should be interpreted.')
                        },
                        'watching': {
                            'type': 'object',
                            'additionalProperties': false,
                            'properties': {
                                'activeOnStart': {
                                    'type': 'boolean',
                                    'description': nls.localize('JsonSchema.problemMatcher.watching.activeOnStart', 'If set to true the watcher is in active mode when the task starts. This is equals of issuing a line that matches the beginPattern')
                                },
                                'beginsPattern': {
                                    'oneOf': [
                                        {
                                            'type': 'string'
                                        },
                                        {
                                            'type': '#/definitions/watchingPattern'
                                        }
                                    ],
                                    'description': nls.localize('JsonSchema.problemMatcher.watching.beginsPattern', 'If matched in the output the start of a watching task is signaled.')
                                },
                                'endsPattern': {
                                    'oneOf': [
                                        {
                                            'type': 'string'
                                        },
                                        {
                                            'type': '#/definitions/watchingPattern'
                                        }
                                    ],
                                    'description': nls.localize('JsonSchema.problemMatcher.watching.endsPattern', 'If matched in the output the end of a watching task is signaled.')
                                }
                            }
                        },
                        'watchedTaskBeginsRegExp': {
                            'type': 'string',
                            'description': nls.localize('JsonSchema.problemMatcher.watchedBegin', 'A regular expression signaling that a watched tasks begins executing triggered through file watching.')
                        },
                        'watchedTaskEndsRegExp': {
                            'type': 'string',
                            'description': nls.localize('JsonSchema.problemMatcher.watchedEnd', 'A regular expression signaling that a watched tasks ends executing.')
                        }
                    }
                },
                'baseTaskRunnerConfiguration': {
                    'type': 'object',
                    'properties': {
                        'command': {
                            'type': 'string',
                            'description': nls.localize('JsonSchema.command', 'The command to be executed. Can be an external program or a shell command.')
                        },
                        'isShellCommand': {
                            'type': 'boolean',
                            'default': true,
                            'description': nls.localize('JsonSchema.shell', 'Specifies whether the command is a shell command or an external program. Defaults to false if omitted.')
                        },
                        'args': {
                            'type': 'array',
                            'description': nls.localize('JsonSchema.args', 'Additional arguments passed to the command.'),
                            'items': {
                                'type': 'string'
                            }
                        },
                        'options': {
                            'type': 'object',
                            'description': nls.localize('JsonSchema.options', 'Additional command options'),
                            'properties': {
                                'cwd': {
                                    'type': 'string',
                                    'description': nls.localize('JsonSchema.options.cwd', 'The current working directory of the executed program or script. If omitted Code\'s current workspace root is used.')
                                },
                                'env': {
                                    'type': 'object',
                                    'description': nls.localize('JsonSchema.options.env', 'The environment of the executed program or shell. If omitted the parent process\' environment is used.')
                                }
                            },
                            'additionalProperties': {
                                'type': ['string', 'array', 'object']
                            }
                        },
                        'showOutput': {
                            '$ref': '#/definitions/showOutputType',
                            'description': nls.localize('JsonSchema.showOutput', 'Controls whether the output of the running task is shown or not. If omitted \'always\' is used.')
                        },
                        'isWatching': {
                            'type': 'boolean',
                            'description': nls.localize('JsonSchema.watching', 'Whether the executed task is kept alive and is watching the file system.'),
                            'default': true
                        },
                        'promptOnClose': {
                            'type': 'boolean',
                            'description': nls.localize('JsonSchema.promptOnClose', 'Whether the user is prompted when VS Code closes with a running background task.'),
                            'default': false
                        },
                        'echoCommand': {
                            'type': 'boolean',
                            'description': nls.localize('JsonSchema.echoCommand', 'Controls whether the executed command is echoed to the output. Default is false.'),
                            'default': true
                        },
                        'suppressTaskName': {
                            'type': 'boolean',
                            'description': nls.localize('JsonSchema.suppressTaskName', 'Controls whether the task name is added as an argument to the command. Default is false.'),
                            'default': true
                        },
                        'taskSelector': {
                            'type': 'string',
                            'description': nls.localize('JsonSchema.taskSelector', 'Prefix to indicate that an argument is task.')
                        },
                        'problemMatcher': {
                            '$ref': '#/definitions/problemMatcherType',
                            'description': nls.localize('JsonSchema.matchers', 'The problem matcher(s) to use. Can either be a string or a problem matcher definition or an array of strings and problem matchers.')
                        },
                        'tasks': {
                            'type': 'array',
                            'description': nls.localize('JsonSchema.tasks', 'The task configurations. Usually these are enrichments of task already defined in the external task runner.'),
                            'items': {
                                'type': 'object',
                                '$ref': '#/definitions/taskDescription'
                            }
                        }
                    }
                },
                'taskDescription': {
                    'type': 'object',
                    'required': ['taskName'],
                    'additionalProperties': false,
                    'properties': {
                        'taskName': {
                            'type': 'string',
                            'description': nls.localize('JsonSchema.tasks.taskName', "The task's name")
                        },
                        'args': {
                            'type': 'array',
                            'description': nls.localize('JsonSchema.tasks.args', 'Additional arguments passed to the command when this task is invoked.'),
                            'items': {
                                'type': 'string'
                            }
                        },
                        'suppressTaskName': {
                            'type': 'boolean',
                            'description': nls.localize('JsonSchema.tasks.suppressTaskName', 'Controls whether the task name is added as an argument to the command. If omitted the globally defined value is used.'),
                            'default': true
                        },
                        'showOutput': {
                            '$ref': '#/definitions/showOutputType',
                            'description': nls.localize('JsonSchema.tasks.showOutput', 'Controls whether the output of the running task is shown or not. If omitted the globally defined value is used.')
                        },
                        'echoCommand': {
                            'type': 'boolean',
                            'description': nls.localize('JsonSchema.echoCommand', 'Controls whether the executed command is echoed to the output. Default is false.'),
                            'default': true
                        },
                        'isWatching': {
                            'type': 'boolean',
                            'description': nls.localize('JsonSchema.tasks.watching', 'Whether the executed task is kept alive and is watching the file system.'),
                            'default': true
                        },
                        'isBuildCommand': {
                            'type': 'boolean',
                            'description': nls.localize('JsonSchema.tasks.build', 'Maps this task to Code\'s default build command.'),
                            'default': true
                        },
                        'isTestCommand': {
                            'type': 'boolean',
                            'description': nls.localize('JsonSchema.tasks.test', 'Maps this task to Code\'s default test command.'),
                            'default': true
                        },
                        'problemMatcher': {
                            '$ref': '#/definitions/problemMatcherType',
                            'description': nls.localize('JsonSchema.tasks.matchers', 'The problem matcher(s) to use. Can either be a string or a problem matcher definition or an array of strings and problem matchers.')
                        }
                    }
                }
            },
            'allOf': [
                {
                    'type': 'object',
                    'required': ['version'],
                    'properties': {
                        'version': {
                            'type': 'string',
                            'enum': ['0.1.0'],
                            'description': nls.localize('JsonSchema.version', 'The config\'s version number')
                        },
                        'windows': {
                            '$ref': '#/definitions/baseTaskRunnerConfiguration',
                            'description': nls.localize('JsonSchema.windows', 'Windows specific build configuration')
                        },
                        'osx': {
                            '$ref': '#/definitions/baseTaskRunnerConfiguration',
                            'description': nls.localize('JsonSchema.mac', 'Mac specific build configuration')
                        },
                        'linux': {
                            '$ref': '#/definitions/baseTaskRunnerConfiguration',
                            'description': nls.localize('JsonSchema.linux', 'Linux specific build configuration')
                        }
                    }
                },
                {
                    '$ref': '#/definitions/baseTaskRunnerConfiguration'
                }
            ]
        };
        var jsonRegistry = platform_2.Registry.as(jsonContributionRegistry.Extensions.JSONContribution);
        jsonRegistry.registerSchema(schemaId, schema);
        jsonRegistry.addSchemaFileAssociation('/.vscode/tasks.json', schemaId);
    }
});
//# sourceMappingURL=task.contribution.js.map