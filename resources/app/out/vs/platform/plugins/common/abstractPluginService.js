/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/nls', 'vs/platform/plugins/common/plugins', 'vs/base/common/winjs.base', 'vs/platform/plugins/common/pluginsRegistry', 'vs/base/common/severity'], function (require, exports, nls, plugins_1, WinJS, pluginsRegistry_1, severity_1) {
    var hasOwnProperty = Object.hasOwnProperty;
    var global = this;
    var ActivatedPlugin = (function () {
        function ActivatedPlugin(activationFailed, module, exports, subscriptions) {
            this.activationFailed = activationFailed;
            this.module = module;
            this.exports = exports;
            this.subscriptions = subscriptions;
        }
        return ActivatedPlugin;
    })();
    exports.ActivatedPlugin = ActivatedPlugin;
    var AbstractPluginService = (function () {
        function AbstractPluginService(isReadyByDefault) {
            var _this = this;
            this.serviceId = plugins_1.IPluginService;
            if (isReadyByDefault) {
                this._onReady = WinJS.TPromise.as(true);
                this._onReadyC = function (v) { };
            }
            else {
                this._onReady = new WinJS.TPromise(function (c, e, p) {
                    _this._onReadyC = c;
                }, function () {
                    console.warn('You should really not try to cancel this ready promise!');
                });
            }
            this.activatingPlugins = {};
            this.activatedPlugins = {};
        }
        AbstractPluginService.prototype.showMessage = function (severity, source, message) {
            this._showMessage(severity, (source ? '[' + source + ']: ' : '') + message);
        };
        AbstractPluginService.prototype.registrationDone = function (messages) {
            var _this = this;
            messages.forEach(function (entry) {
                _this.showMessage(entry.type, entry.source, entry.message);
            });
            this._onReadyC(true);
        };
        AbstractPluginService.prototype.registerOneTimeActivationEventListener = function (activationEvent, listener) {
            pluginsRegistry_1.PluginsRegistry.registerOneTimeActivationEventListener(activationEvent, listener);
        };
        AbstractPluginService.prototype.onReady = function () {
            return this._onReady;
        };
        AbstractPluginService.prototype.get = function (pluginId) {
            if (!hasOwnProperty.call(this.activatedPlugins, pluginId)) {
                throw new Error('Plugin `' + pluginId + '` is not known or not activated');
            }
            return this.activatedPlugins[pluginId].exports;
        };
        AbstractPluginService.prototype.getPluginsStatus = function () {
            return null;
        };
        AbstractPluginService.prototype.isActivated = function (pluginId) {
            return hasOwnProperty.call(this.activatedPlugins, pluginId);
        };
        AbstractPluginService.prototype.activateByEvent = function (activationEvent) {
            var _this = this;
            return this._onReady.then(function () {
                pluginsRegistry_1.PluginsRegistry.triggerActivationEventListeners(activationEvent);
                var activatePlugins = pluginsRegistry_1.PluginsRegistry.getPluginDescriptionsForActivationEvent(activationEvent);
                return _this._activatePlugins(activatePlugins, 0);
            });
        };
        AbstractPluginService.prototype.activateAndGet = function (pluginId) {
            var _this = this;
            return this._onReady.then(function () {
                var desc = pluginsRegistry_1.PluginsRegistry.getPluginDescription(pluginId);
                if (!desc) {
                    throw new Error('Plugin `' + pluginId + '` is not known');
                }
                return _this._activatePlugins([desc], 0).then(function () {
                    return _this.get(pluginId);
                });
            });
        };
        /**
         * Handle semantics related to dependencies for `currentPlugin`.
         * semantics: `redExtensions` must wait for `greenExtensions`.
         */
        AbstractPluginService.prototype._handleActivateRequest = function (currentPlugin, greenExtensions, redExtensions) {
            var depIds = (typeof currentPlugin.extensionDependencies === 'undefined' ? [] : currentPlugin.extensionDependencies);
            var currentPluginGetsGreenLight = true;
            for (var j = 0, lenJ = depIds.length; j < lenJ; j++) {
                var depId = depIds[j];
                var depDesc = pluginsRegistry_1.PluginsRegistry.getPluginDescription(depId);
                if (!depDesc) {
                    // Error condition 1: unknown dependency
                    this._showMessage(severity_1.default.Error, nls.localize('unknownDep', "Extension `{1}` failed to activate. Reason: unknown dependency `{0}`.", depId, currentPlugin.id));
                    this.activatedPlugins[currentPlugin.id] = new ActivatedPlugin(true, { activate: undefined, deactivate: undefined }, {}, []);
                    return;
                }
                if (hasOwnProperty.call(this.activatedPlugins, depId)) {
                    var dep = this.activatedPlugins[depId];
                    if (dep.activationFailed) {
                        // Error condition 2: a dependency has already failed activation
                        this._showMessage(severity_1.default.Error, nls.localize('failedDep', "Extension `{1}` failed to activate. Reason: dependency `{0}` failed to activate.", depId, currentPlugin.id));
                        this.activatedPlugins[currentPlugin.id] = new ActivatedPlugin(true, { activate: undefined, deactivate: undefined }, {}, []);
                        return;
                    }
                }
                else {
                    // must first wait for the dependency to activate
                    currentPluginGetsGreenLight = false;
                    greenExtensions[depId] = depDesc;
                }
            }
            if (currentPluginGetsGreenLight) {
                greenExtensions[currentPlugin.id] = currentPlugin;
            }
            else {
                redExtensions.push(currentPlugin);
            }
        };
        AbstractPluginService.prototype._activatePlugins = function (pluginDescriptions, recursionLevel) {
            var _this = this;
            // console.log(recursionLevel, '_activatePlugins: ', pluginDescriptions.map(p => p.id));
            if (pluginDescriptions.length === 0) {
                return WinJS.TPromise.as(void 0);
            }
            pluginDescriptions = pluginDescriptions.filter(function (p) { return !hasOwnProperty.call(_this.activatedPlugins, p.id); });
            if (pluginDescriptions.length === 0) {
                return WinJS.TPromise.as(void 0);
            }
            if (recursionLevel > 10) {
                // More than 10 dependencies deep => most likely a dependency loop
                for (var i = 0, len = pluginDescriptions.length; i < len; i++) {
                    // Error condition 3: dependency loop
                    this._showMessage(severity_1.default.Error, nls.localize('failedDep', "Extension `{0}` failed to activate. Reason: more than 10 levels of dependencies (most likely a dependency loop).", pluginDescriptions[i].id));
                    this.activatedPlugins[pluginDescriptions[i].id] = new ActivatedPlugin(true, { activate: undefined, deactivate: undefined }, {}, []);
                }
                return WinJS.TPromise.as(void 0);
            }
            var greenMap = Object.create(null), red = [];
            for (var i = 0, len = pluginDescriptions.length; i < len; i++) {
                this._handleActivateRequest(pluginDescriptions[i], greenMap, red);
            }
            // Make sure no red is also green
            for (var i = 0, len = red.length; i < len; i++) {
                if (greenMap[red[i].id]) {
                    delete greenMap[red[i].id];
                }
            }
            var green = Object.keys(greenMap).map(function (id) { return greenMap[id]; });
            // console.log('greenExtensions: ', green.map(p => p.id));
            // console.log('redExtensions: ', red.map(p => p.id));
            if (red.length === 0) {
                // Finally reached only leafs!
                return WinJS.TPromise.join(green.map(function (p) { return _this._activatePlugin(p); })).then(function (_) { return void 0; });
            }
            return this._activatePlugins(green, recursionLevel + 1).then(function (_) {
                return _this._activatePlugins(red, recursionLevel + 1);
            });
        };
        AbstractPluginService.prototype._activatePlugin = function (pluginDescription) {
            var _this = this;
            if (hasOwnProperty.call(this.activatedPlugins, pluginDescription.id)) {
                return WinJS.TPromise.as(this.activatedPlugins[pluginDescription.id].exports);
            }
            if (hasOwnProperty.call(this.activatingPlugins, pluginDescription.id)) {
                return this.activatingPlugins[pluginDescription.id];
            }
            this.activatingPlugins[pluginDescription.id] = this._actualActivatePlugin(pluginDescription).then(null, function (err) {
                _this._showMessage(severity_1.default.Error, nls.localize('activationError', "Activating extension `{0}` failed: {1}.", pluginDescription.id, err.message));
                console.error('Activating extension `' + pluginDescription.id + '` failed: ', err.message);
                console.log('Here is the error stack: ', err.stack);
                // Treat the plugin as being empty
                return new ActivatedPlugin(true, { activate: undefined, deactivate: undefined }, {}, []);
            }).then(function (x) {
                _this.activatedPlugins[pluginDescription.id] = x;
                delete _this.activatingPlugins[pluginDescription.id];
                return x.exports;
            });
            return this.activatingPlugins[pluginDescription.id];
        };
        AbstractPluginService.prototype._actualActivatePlugin = function (pluginDescription) {
            var _this = this;
            if (!pluginDescription.main) {
                // Treat the plugin as being empty => NOT AN ERROR CASE
                return WinJS.TPromise.as(new ActivatedPlugin(false, { activate: undefined, deactivate: undefined }, {}, []));
            }
            return this._loadPluginModule(pluginDescription).then(function (pluginModule) {
                return _this._loadPluginContext(pluginDescription).then(function (context) {
                    return AbstractPluginService._callActivate(pluginModule, context);
                });
            });
        };
        AbstractPluginService.prototype._loadPluginModule = function (pluginDescription) {
            return loadAMDModule(pluginDescription.main);
        };
        AbstractPluginService.prototype._loadPluginContext = function (pluginDescription) {
            return WinJS.TPromise.as(undefined);
        };
        AbstractPluginService._callActivate = function (pluginModule, context) {
            // Make sure the plugin's surface is not undefined
            pluginModule = pluginModule || {
                activate: undefined,
                deactivate: undefined
            };
            // let subscriptions:IDisposable[] = [];
            return this._callActivateOptional(pluginModule, context).then(function (pluginExports) {
                return new ActivatedPlugin(false, pluginModule, pluginExports, context.subscriptions);
            });
        };
        AbstractPluginService._callActivateOptional = function (pluginModule, context) {
            if (typeof pluginModule.activate === 'function') {
                try {
                    return WinJS.TPromise.as(pluginModule.activate.apply(global, [context]));
                }
                catch (err) {
                    return WinJS.TPromise.wrapError(err);
                }
            }
            else {
                // No activate found => the module is the plugin's exports
                return WinJS.TPromise.as(pluginModule);
            }
        };
        return AbstractPluginService;
    })();
    exports.AbstractPluginService = AbstractPluginService;
    function loadAMDModule(moduleId) {
        return new WinJS.TPromise(function (c, e, p) {
            require([moduleId], function (r) {
                c(r);
            }, e);
        });
    }
    exports.loadAMDModule = loadAMDModule;
});
//# sourceMappingURL=abstractPluginService.js.map