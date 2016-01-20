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
define(["require", "exports", 'vs/platform/plugins/common/pluginsRegistry', 'vs/base/common/winjs.base', 'vs/platform/thread/common/thread', 'vs/platform/plugins/common/abstractPluginService', 'vs/base/common/severity', 'vs/platform/storage/common/remotable.storage', 'vs/base/common/paths', 'vs/base/common/lifecycle'], function (require, exports, pluginsRegistry_1, WinJS, thread_1, abstractPluginService_1, severity_1, remotable_storage_1, paths, lifecycle_1) {
    var PluginMemento = (function () {
        function PluginMemento(id, global, storage) {
            var _this = this;
            this._id = id;
            this._shared = global;
            this._storage = storage;
            this._init = this._storage.getValue(this._shared, this._id, Object.create(null)).then(function (value) {
                _this._value = value;
                return _this;
            });
        }
        Object.defineProperty(PluginMemento.prototype, "whenReady", {
            get: function () {
                return this._init;
            },
            enumerable: true,
            configurable: true
        });
        PluginMemento.prototype.get = function (key, defaultValue) {
            var value = this._value[key];
            if (typeof value === 'undefined') {
                value = defaultValue;
            }
            return value;
        };
        PluginMemento.prototype.update = function (key, value) {
            this._value[key] = value;
            return this._storage
                .setValue(this._shared, this._id, this._value)
                .then(function () { return true; });
        };
        return PluginMemento;
    })();
    var MainProcessPluginService = (function (_super) {
        __extends(MainProcessPluginService, _super);
        /**
         * This class is constructed manually because it is a service, so it doesn't use any ctor injection
         */
        function MainProcessPluginService(contextService, threadService, messageService, telemetryService) {
            var _this = this;
            var config = contextService.getConfiguration();
            this._isDev = !config.env.isBuilt || !!config.env.pluginDevelopmentPath;
            this._messageService = messageService;
            threadService.registerRemotableInstance(MainProcessPluginService, this);
            _super.call(this, false);
            this._threadService = threadService;
            this._telemetryService = telemetryService;
            this._proxy = this._threadService.getRemotable(PluginHostPluginService);
            this._pluginsStatus = {};
            pluginsRegistry_1.PluginsRegistry.handleExtensionPoints(function (severity, source, message) {
                _this.showMessage(severity, source, message);
            });
        }
        MainProcessPluginService.prototype.getTelemetryActivationEvent = function (pluginDescription) {
            var event = {
                id: pluginDescription.id,
                name: pluginDescription.name,
                publisherDisplayName: pluginDescription.publisher,
                activationEvents: pluginDescription.activationEvents ? pluginDescription.activationEvents.join(',') : null
            };
            for (var contribution in pluginDescription.contributes) {
                var contributionDetails = pluginDescription.contributes[contribution];
                if (!contributionDetails) {
                    continue;
                }
                switch (contribution) {
                    case 'debuggers':
                        var types = contributionDetails.reduce(function (p, c) { return p ? p + ',' + c['type'] : c['type']; }, '');
                        event['contribution.debuggers'] = types;
                        break;
                    case 'grammars':
                        var grammers = contributionDetails.reduce(function (p, c) { return p ? p + ',' + c['language'] : c['language']; }, '');
                        event['contribution.grammars'] = grammers;
                        break;
                    case 'languages':
                        var languages = contributionDetails.reduce(function (p, c) { return p ? p + ',' + c['id'] : c['id']; }, '');
                        event['contribution.languages'] = languages;
                        break;
                    case 'tmSnippets':
                        var tmSnippets = contributionDetails.reduce(function (p, c) { return p ? p + ',' + c['languageId'] : c['languageId']; }, '');
                        event['contribution.tmSnippets'] = tmSnippets;
                        break;
                    default:
                        event[("contribution." + contribution)] = true;
                }
            }
            return event;
        };
        MainProcessPluginService.prototype._showMessage = function (severity, msg) {
            this._proxy.$doShowMessage(severity, msg);
            this.$doShowMessage(severity, msg);
        };
        MainProcessPluginService.prototype.showMessage = function (severity, source, message) {
            _super.prototype.showMessage.call(this, severity, source, message);
            if (!this._pluginsStatus[source]) {
                this._pluginsStatus[source] = { messages: [] };
            }
            this._pluginsStatus[source].messages.push({ type: severity, source: source, message: message });
        };
        MainProcessPluginService.prototype.$doShowMessage = function (severity, msg) {
            var messageShown = false;
            if (severity === severity_1.default.Error || severity === severity_1.default.Warning) {
                if (this._isDev) {
                    // Only show nasty intrusive messages if doing extension development.
                    this._messageService.show(severity, msg);
                    messageShown = true;
                }
            }
            if (!messageShown) {
                switch (severity) {
                    case severity_1.default.Error:
                        console.error(msg);
                        break;
                    case severity_1.default.Warning:
                        console.warn(msg);
                        break;
                    default:
                        console.log(msg);
                }
            }
        };
        MainProcessPluginService.prototype.getPluginsStatus = function () {
            return this._pluginsStatus;
        };
        MainProcessPluginService.prototype.deactivate = function (pluginId) {
            this._proxy.deactivate(pluginId);
        };
        // -- overwriting AbstractPluginService
        MainProcessPluginService.prototype._actualActivatePlugin = function (pluginDescription) {
            var _this = this;
            var event = this.getTelemetryActivationEvent(pluginDescription);
            this._telemetryService.publicLog('activatePlugin', event);
            // redirect plugin activation to the plugin host
            return this._proxy.$activatePluginInPluginHost(pluginDescription).then(function (_) {
                // the plugin host calls $onPluginActivatedInPluginHost, where we write to `activatedPlugins`
                return _this.activatedPlugins[pluginDescription.id];
            });
        };
        // -- called by plugin host
        MainProcessPluginService.prototype.$onPluginHostReady = function (pluginDescriptions, messages) {
            pluginsRegistry_1.PluginsRegistry.registerPlugins(pluginDescriptions);
            this.registrationDone(messages);
        };
        MainProcessPluginService.prototype.$onPluginActivatedInPluginHost = function (pluginId, pluginExports) {
            this.activatedPlugins[pluginId] = new abstractPluginService_1.ActivatedPlugin(false, { activate: undefined, deactivate: undefined }, pluginExports, []);
        };
        MainProcessPluginService.prototype.$onPluginActivationFailedInPluginHost = function (pluginId, err) {
            this.activatedPlugins[pluginId] = new abstractPluginService_1.ActivatedPlugin(true, { activate: undefined, deactivate: undefined }, {}, []);
        };
        MainProcessPluginService = __decorate([
            thread_1.Remotable.MainContext('MainProcessPluginService')
        ], MainProcessPluginService);
        return MainProcessPluginService;
    })(abstractPluginService_1.AbstractPluginService);
    exports.MainProcessPluginService = MainProcessPluginService;
    var PluginHostPluginService = (function (_super) {
        __extends(PluginHostPluginService, _super);
        /**
         * This class is constructed manually because it is a service, so it doesn't use any ctor injection
         */
        function PluginHostPluginService(threadService) {
            threadService.registerRemotableInstance(PluginHostPluginService, this);
            _super.call(this, true);
            this._threadService = threadService;
            this._storage = new remotable_storage_1.PluginHostStorage(threadService);
            this._proxy = this._threadService.getRemotable(MainProcessPluginService);
        }
        PluginHostPluginService.prototype._showMessage = function (severity, msg) {
            this._proxy.$doShowMessage(severity, msg);
            this.$doShowMessage(severity, msg);
        };
        PluginHostPluginService.prototype.$doShowMessage = function (severity, msg) {
            switch (severity) {
                case severity_1.default.Error:
                    console.error(msg);
                    break;
                case severity_1.default.Warning:
                    console.warn(msg);
                    break;
                default:
                    console.log(msg);
            }
        };
        PluginHostPluginService.prototype.deactivate = function (pluginId) {
            var plugin = this.activatedPlugins[pluginId];
            if (!plugin) {
                return;
            }
            // call deactivate if available
            try {
                if (typeof plugin.module.deactivate === 'function') {
                    plugin.module.deactivate();
                }
            }
            catch (err) {
            }
            // clean up subscriptions
            try {
                lifecycle_1.disposeAll(plugin.subscriptions);
            }
            catch (err) {
            }
        };
        // -- overwriting AbstractPluginService
        PluginHostPluginService.prototype.registrationDone = function (messages) {
            _super.prototype.registrationDone.call(this, []);
            this._proxy.$onPluginHostReady(pluginsRegistry_1.PluginsRegistry.getAllPluginDescriptions(), messages);
        };
        PluginHostPluginService.prototype._loadPluginModule = function (pluginDescription) {
            if (pluginDescription.isAMD) {
                return abstractPluginService_1.loadAMDModule(uriFromPath(pluginDescription.main));
            }
            return loadCommonJSModule(pluginDescription.main);
        };
        PluginHostPluginService.prototype._loadPluginContext = function (pluginDescription) {
            var globalState = new PluginMemento(pluginDescription.id, true, this._storage);
            var workspaceState = new PluginMemento(pluginDescription.id, false, this._storage);
            return WinJS.TPromise.join([globalState.whenReady, workspaceState.whenReady]).then(function () {
                return Object.freeze({
                    globalState: globalState,
                    workspaceState: workspaceState,
                    subscriptions: [],
                    get extensionPath() { return pluginDescription.extensionFolderPath; },
                    asAbsolutePath: function (relativePath) { return paths.normalize(paths.join(pluginDescription.extensionFolderPath, relativePath), true); }
                });
            });
        };
        PluginHostPluginService.prototype._actualActivatePlugin = function (pluginDescription) {
            var _this = this;
            return _super.prototype._actualActivatePlugin.call(this, pluginDescription).then(function (activatedPlugin) {
                var proxyObj = _this._threadService.createDynamicProxyFromMethods(activatedPlugin.exports);
                activatedPlugin.subscriptions.push(proxyObj);
                _this._proxy.$onPluginActivatedInPluginHost(pluginDescription.id, proxyObj.getProxyDefinition());
                return activatedPlugin;
            }, function (err) {
                _this._proxy.$onPluginActivationFailedInPluginHost(pluginDescription.id, err);
                throw err;
            });
        };
        // -- called by main thread
        PluginHostPluginService.prototype.$activatePluginInPluginHost = function (pluginDescription) {
            return this._activatePlugin(pluginDescription).then(function () {
                return null;
            });
        };
        PluginHostPluginService = __decorate([
            thread_1.Remotable.PluginHostContext('PluginHostPluginService')
        ], PluginHostPluginService);
        return PluginHostPluginService;
    })(abstractPluginService_1.AbstractPluginService);
    exports.PluginHostPluginService = PluginHostPluginService;
    function loadCommonJSModule(modulePath) {
        var r = null;
        try {
            r = require.__$__nodeRequire(modulePath);
        }
        catch (e) {
            return WinJS.TPromise.wrapError(e);
        }
        return WinJS.TPromise.as(r);
    }
    // TODO@Alex: Duplicated in:
    // * src\bootstrap.js
    // * src\vs\workbench\electron-main\bootstrap.js
    // * src\vs\platform\plugins\common\nativePluginService.ts
    function uriFromPath(_path) {
        var pathName = _path.replace(/\\/g, '/');
        if (pathName.length > 0 && pathName.charAt(0) !== '/') {
            pathName = '/' + pathName;
        }
        return encodeURI('file://' + pathName);
    }
});
//# sourceMappingURL=nativePluginService.js.map