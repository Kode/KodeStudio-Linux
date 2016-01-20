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
define(["require", "exports", 'vs/base/common/paths', 'vs/base/common/winjs.base', 'vs/base/common/eventEmitter', 'vs/base/common/objects', 'vs/base/common/errors', './model', 'vs/base/common/lifecycle', 'vs/base/common/collections', './configuration', 'vs/platform/files/common/files', './configurationRegistry', 'vs/platform/platform', 'fs'], function (require, exports, paths, winjs, eventEmitter, objects, errors, model, lifecycle, collections, configuration_1, Files, configurationRegistry_1, platform_1, fs) {
    var ConfigurationService = (function (_super) {
        __extends(ConfigurationService, _super);
        function ConfigurationService(contextService, eventService, workspaceSettingsRootFolder) {
            var _this = this;
            if (workspaceSettingsRootFolder === void 0) { workspaceSettingsRootFolder = '.vscode'; }
            _super.call(this);
            this.serviceId = configuration_1.IConfigurationService;
            this.contextService = contextService;
            this.eventService = eventService;
            this.workspaceSettingsRootFolder = workspaceSettingsRootFolder;
            this.workspaceFilePathToConfiguration = Object.create(null);
            var unbind = this.eventService.addListener(Files.EventType.FILE_CHANGES, function (events) { return _this.handleFileEvents(events); });
            var subscription = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).onDidRegisterConfiguration(function () { return _this.reloadAndEmit(); });
            this.callOnDispose = function () {
                unbind();
                subscription.dispose();
            };
        }
        ConfigurationService.prototype.dispose = function () {
            this.callOnDispose = lifecycle.cAll(this.callOnDispose);
            _super.prototype.dispose.call(this);
        };
        ConfigurationService.prototype.loadConfiguration = function (section) {
            if (!this.loadConfigurationPromise) {
                this.loadConfigurationPromise = this.doLoadConfiguration();
            }
            return this.loadConfigurationPromise.then(function (res) {
                var result = section ? res.merged[section] : res.merged;
                var parseErrors = res.consolidated.parseErrors;
                if (res.globals.parseErrors) {
                    parseErrors.push.apply(parseErrors, res.globals.parseErrors);
                }
                if (parseErrors.length > 0) {
                    if (!result) {
                        result = {};
                    }
                    result.$parseErrors = parseErrors;
                }
                return result;
            });
        };
        ConfigurationService.prototype.doLoadConfiguration = function () {
            var _this = this;
            // Load globals
            return this.loadGlobalConfiguration().then(function (globals) {
                // Load workspace locals
                return _this.loadWorkspaceConfiguration().then(function (values) {
                    // Consolidate
                    var consolidated = model.consolidate(values);
                    // Override with workspace locals
                    var merged = objects.mixin(objects.clone(globals.contents), // target: global/default values (but dont modify!)
                    consolidated.contents, // source: workspace configured values
                    true // overwrite
                    );
                    try {
                        if (fs.statSync(_this.contextService.toResource('khafile.js').fsPath).isFile()) {
                            merged = objects.mixin(merged, {
                                launch: {
                                    configurations: [
                                        {
                                            name: "Launch",
                                            type: "chrome",
                                            request: "launch",
                                            file: "build/debug-html5",
                                            sourceMaps: true,
                                            runtimeExecutable: process.execPath
                                        }
                                    ]
                                }
                            }, true);
                        }
                    }
                    catch (error) {
                    }
                    return {
                        merged: merged,
                        consolidated: consolidated,
                        globals: globals
                    };
                });
            });
        };
        ConfigurationService.prototype.loadGlobalConfiguration = function () {
            return winjs.TPromise.as({
                contents: model.getDefaultValues()
            });
        };
        ConfigurationService.prototype.hasWorkspaceConfiguration = function () {
            return !!this.workspaceFilePathToConfiguration['.vscode/' + model.CONFIG_DEFAULT_NAME + '.json'];
        };
        ConfigurationService.prototype.loadWorkspaceConfiguration = function (section) {
            var _this = this;
            // once: when invoked for the first time we fetch *all* json
            // files using the bulk stats and content routes
            if (!this.bulkFetchFromWorkspacePromise) {
                this.bulkFetchFromWorkspacePromise = this.resolveStat(this.contextService.toResource(this.workspaceSettingsRootFolder)).then(function (stat) {
                    if (!stat.isDirectory) {
                        return winjs.TPromise.as([]);
                    }
                    return _this.resolveContents(stat.children.filter(function (stat) { return paths.extname(stat.resource.fsPath) === '.json'; }).map(function (stat) { return stat.resource; }));
                }, function (err) {
                    if (err) {
                        return []; // never fail this call
                    }
                }).then(function (contents) {
                    contents.forEach(function (content) { return _this.workspaceFilePathToConfiguration[_this.contextService.toWorkspaceRelativePath(content.resource)] = winjs.TPromise.as(model.newConfigFile(content.value)); });
                }, errors.onUnexpectedError);
            }
            // on change: join on *all* configuration file promises so that
            // we can merge them into a single configuration object. this
            // happens whenever a config file changes, is deleted, or added
            return this.bulkFetchFromWorkspacePromise.then(function () {
                return winjs.TPromise.join(_this.workspaceFilePathToConfiguration);
            });
        };
        ConfigurationService.prototype.reloadAndEmit = function () {
            var _this = this;
            return this.reloadConfiguration().then(function (config) { return _this.emit(configuration_1.ConfigurationServiceEventTypes.UPDATED, { config: config }); });
        };
        ConfigurationService.prototype.reloadConfiguration = function (section) {
            this.loadConfigurationPromise = null;
            return this.loadConfiguration(section);
        };
        ConfigurationService.prototype.handleFileEvents = function (event) {
            var events = event.changes;
            var affectedByChanges = false;
            for (var i = 0, len = events.length; i < len; i++) {
                var workspacePath = this.contextService.toWorkspaceRelativePath(events[i].resource);
                if (!workspacePath) {
                    continue; // event is not inside workspace
                }
                // Handle case where ".vscode" got deleted
                if (workspacePath === this.workspaceSettingsRootFolder && events[i].type === Files.FileChangeType.DELETED) {
                    this.workspaceFilePathToConfiguration = Object.create(null);
                    affectedByChanges = true;
                }
                // outside my folder or not a *.json file
                if (paths.extname(workspacePath) !== '.json' || !paths.isEqualOrParent(workspacePath, this.workspaceSettingsRootFolder)) {
                    continue;
                }
                // insert 'fetch-promises' for add and update events and
                // remove promises for delete events
                switch (events[i].type) {
                    case Files.FileChangeType.DELETED:
                        affectedByChanges = collections.remove(this.workspaceFilePathToConfiguration, workspacePath);
                        break;
                    case Files.FileChangeType.UPDATED:
                    case Files.FileChangeType.ADDED:
                        this.workspaceFilePathToConfiguration[workspacePath] = this.resolveContent(events[i].resource).then(function (content) { return model.newConfigFile(content.value); }, errors.onUnexpectedError);
                        affectedByChanges = true;
                }
            }
            if (affectedByChanges) {
                this.reloadAndEmit();
            }
        };
        return ConfigurationService;
    })(eventEmitter.EventEmitter);
    exports.ConfigurationService = ConfigurationService;
    var NullConfigurationService = (function (_super) {
        __extends(NullConfigurationService, _super);
        function NullConfigurationService() {
            _super.apply(this, arguments);
            this.serviceId = configuration_1.IConfigurationService;
        }
        NullConfigurationService.prototype.loadConfiguration = function (section) {
            return winjs.TPromise.as({});
        };
        NullConfigurationService.prototype.hasWorkspaceConfiguration = function () {
            return false;
        };
        return NullConfigurationService;
    })(eventEmitter.EventEmitter);
    exports.NullConfigurationService = NullConfigurationService;
    exports.nullService = new NullConfigurationService();
});
//# sourceMappingURL=configurationService.js.map