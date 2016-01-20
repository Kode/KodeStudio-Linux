/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/platform/platform', 'vs/base/common/errors', 'vs/platform/jsonschemas/common/jsonContributionRegistry', 'vs/nls', 'vs/base/common/paths', 'vs/base/common/severity'], function (require, exports, platform_1, Errors, JSONContributionRegistry, nls, paths, severity_1) {
    var ScopedMessageCollector = (function () {
        function ScopedMessageCollector(scope, actual) {
            this._scope = scope;
            this._actual = actual;
        }
        ScopedMessageCollector.prototype.error = function (message) {
            this._actual.error(this._scope, message);
        };
        ScopedMessageCollector.prototype.warn = function (message) {
            this._actual.warn(this._scope, message);
        };
        ScopedMessageCollector.prototype.info = function (message) {
            this._actual.info(this._scope, message);
        };
        return ScopedMessageCollector;
    })();
    var PluginsMessageForwarder = (function () {
        function PluginsMessageForwarder(handler) {
            this._handler = handler;
        }
        PluginsMessageForwarder.prototype._pushMessage = function (type, source, message) {
            this._handler(type, source, this._ensureString(message));
        };
        PluginsMessageForwarder.prototype._ensureString = function (e) {
            if (e && e.message && e.stack) {
                return e.message + '\n\n' + e.stack;
            }
            return String(e);
        };
        PluginsMessageForwarder.prototype.error = function (source, message) {
            this._pushMessage(severity_1.default.Error, source, message);
        };
        PluginsMessageForwarder.prototype.warn = function (source, message) {
            this._pushMessage(severity_1.default.Warning, source, message);
        };
        PluginsMessageForwarder.prototype.info = function (source, message) {
            this._pushMessage(severity_1.default.Info, source, message);
        };
        PluginsMessageForwarder.prototype.scopeTo = function (source) {
            return new ScopedMessageCollector(source, this);
        };
        return PluginsMessageForwarder;
    })();
    var PluginsMessageCollector = (function () {
        function PluginsMessageCollector() {
            this._messages = [];
        }
        PluginsMessageCollector.prototype.getMessages = function () {
            return this._messages;
        };
        PluginsMessageCollector.prototype._pushMessage = function (type, source, message) {
            this._messages.push({
                type: type,
                message: this._ensureString(message),
                source: source
            });
        };
        PluginsMessageCollector.prototype._ensureString = function (e) {
            if (e && e.message && e.stack) {
                return e.message + '\n\n' + e.stack;
            }
            return String(e);
        };
        PluginsMessageCollector.prototype.error = function (source, message) {
            this._pushMessage(severity_1.default.Error, source, message);
        };
        PluginsMessageCollector.prototype.warn = function (source, message) {
            this._pushMessage(severity_1.default.Warning, source, message);
        };
        PluginsMessageCollector.prototype.info = function (source, message) {
            this._pushMessage(severity_1.default.Info, source, message);
        };
        PluginsMessageCollector.prototype.scopeTo = function (source) {
            return new ScopedMessageCollector(source, this);
        };
        return PluginsMessageCollector;
    })();
    exports.PluginsMessageCollector = PluginsMessageCollector;
    function isValidPluginDescription(extensionFolderPath, pluginDescription, notices) {
        if (!pluginDescription) {
            notices.push(nls.localize('pluginDescription.empty', "Got empty extension description"));
            return false;
        }
        if (typeof pluginDescription.publisher !== 'string') {
            notices.push(nls.localize('pluginDescription.publisher', "property `{0}` is mandatory and must be of type `string`", 'publisher'));
            return false;
        }
        if (typeof pluginDescription.name !== 'string') {
            notices.push(nls.localize('pluginDescription.name', "property `{0}` is mandatory and must be of type `string`", 'name'));
            return false;
        }
        if (typeof pluginDescription.version !== 'string') {
            notices.push(nls.localize('pluginDescription.version', "property `{0}` is mandatory and must be of type `string`", 'version'));
            return false;
        }
        if (!pluginDescription.engines) {
            notices.push(nls.localize('pluginDescription.engines', "property `{0}` is mandatory and must be of type `object`", 'engines'));
            return false;
        }
        if (typeof pluginDescription.engines.vscode !== 'string') {
            notices.push(nls.localize('pluginDescription.engines.vscode', "property `{0}` is mandatory and must be of type `string`", 'engines.vscode'));
            return false;
        }
        if (typeof pluginDescription.extensionDependencies !== 'undefined') {
            if (!_isStringArray(pluginDescription.extensionDependencies)) {
                notices.push(nls.localize('pluginDescription.extensionDependencies', "property `{0}` can be omitted or must be of type `string[]`", 'extensionDependencies'));
                return false;
            }
        }
        if (typeof pluginDescription.activationEvents !== 'undefined') {
            if (!_isStringArray(pluginDescription.activationEvents)) {
                notices.push(nls.localize('pluginDescription.activationEvents1', "property `{0}` can be omitted or must be of type `string[]`", 'activationEvents'));
                return false;
            }
            if (typeof pluginDescription.main === 'undefined') {
                notices.push(nls.localize('pluginDescription.activationEvents2', "properties `{0}` and `{1}` must both be specified or must both be omitted", 'activationEvents', 'main'));
                return false;
            }
        }
        if (typeof pluginDescription.main !== 'undefined') {
            if (typeof pluginDescription.main !== 'string') {
                notices.push(nls.localize('pluginDescription.main1', "property `{0}` can be omitted or must be of type `string`", 'main'));
                return false;
            }
            else {
                var normalizedAbsolutePath = paths.normalize(paths.join(extensionFolderPath, pluginDescription.main));
                if (normalizedAbsolutePath.indexOf(extensionFolderPath)) {
                    notices.push(nls.localize('pluginDescription.main2', "Expected `main` ({0}) to be included inside extension's folder ({1}). This might make the extension non-portable.", normalizedAbsolutePath, extensionFolderPath));
                }
            }
            if (typeof pluginDescription.activationEvents === 'undefined') {
                notices.push(nls.localize('pluginDescription.main3', "properties `{0}` and `{1}` must both be specified or must both be omitted", 'activationEvents', 'main'));
                return false;
            }
        }
        return true;
    }
    exports.isValidPluginDescription = isValidPluginDescription;
    var hasOwnProperty = Object.hasOwnProperty;
    var schemaRegistry = platform_1.Registry.as(JSONContributionRegistry.Extensions.JSONContribution);
    var ExtensionPoint = (function () {
        function ExtensionPoint(name, registry) {
            this.name = name;
            this._registry = registry;
            this._handler = null;
            this._collector = null;
        }
        ExtensionPoint.prototype.setHandler = function (handler) {
            if (this._handler) {
                throw new Error('Handler already set!');
            }
            this._handler = handler;
            this._handle();
        };
        ExtensionPoint.prototype.handle = function (collector) {
            this._collector = collector;
            this._handle();
        };
        ExtensionPoint.prototype._handle = function () {
            var _this = this;
            if (!this._handler || !this._collector) {
                return;
            }
            this._registry.registerPointListener(this.name, function (descriptions) {
                var users = descriptions.map(function (desc) {
                    return {
                        description: desc,
                        value: desc.contributes[_this.name],
                        collector: _this._collector.scopeTo(desc.extensionFolderPath)
                    };
                });
                _this._handler(users);
            });
        };
        return ExtensionPoint;
    })();
    var PluginsRegistryImpl = (function () {
        function PluginsRegistryImpl() {
            this._pluginsMap = {};
            this._pluginsArr = [];
            this._activationMap = {};
            this._pointListeners = [];
            this._extensionPoints = {};
            this._oneTimeActivationEventListeners = {};
        }
        PluginsRegistryImpl.prototype.registerPointListener = function (point, handler) {
            var entry = {
                extensionPoint: point,
                listener: handler
            };
            this._pointListeners.push(entry);
            this._triggerPointListener(entry, PluginsRegistryImpl._filterWithExtPoint(this.getAllPluginDescriptions(), point));
        };
        PluginsRegistryImpl.prototype.registerExtensionPoint = function (extensionPoint, jsonSchema) {
            if (hasOwnProperty.call(this._extensionPoints, extensionPoint)) {
                throw new Error('Duplicate extension point: ' + extensionPoint);
            }
            var result = new ExtensionPoint(extensionPoint, this);
            this._extensionPoints[extensionPoint] = result;
            schema.properties.contributes.properties[extensionPoint] = jsonSchema;
            schemaRegistry.registerSchema(schemaId, schema);
            return result;
        };
        PluginsRegistryImpl.prototype.handleExtensionPoints = function (messageHandler) {
            var _this = this;
            var collector = new PluginsMessageForwarder(messageHandler);
            Object.keys(this._extensionPoints).forEach(function (extensionPointName) {
                _this._extensionPoints[extensionPointName].handle(collector);
            });
        };
        PluginsRegistryImpl.prototype._triggerPointListener = function (handler, desc) {
            // console.log('_triggerPointListeners: ' + desc.length + ' OF ' + handler.extensionPoint);
            if (!desc || desc.length === 0) {
                return;
            }
            try {
                handler.listener(desc);
            }
            catch (e) {
                Errors.onUnexpectedError(e);
            }
        };
        PluginsRegistryImpl.prototype.registerPlugins = function (pluginDescriptions) {
            for (var i = 0, len = pluginDescriptions.length; i < len; i++) {
                var pluginDescription = pluginDescriptions[i];
                if (hasOwnProperty.call(this._pluginsMap, pluginDescription.id)) {
                    // No overwriting allowed!
                    console.error('Plugin `' + pluginDescription.id + '` is already registered');
                    continue;
                }
                this._pluginsMap[pluginDescription.id] = pluginDescription;
                this._pluginsArr.push(pluginDescription);
                if (Array.isArray(pluginDescription.activationEvents)) {
                    for (var j = 0, lenJ = pluginDescription.activationEvents.length; j < lenJ; j++) {
                        var activationEvent = pluginDescription.activationEvents[j];
                        this._activationMap[activationEvent] = this._activationMap[activationEvent] || [];
                        this._activationMap[activationEvent].push(pluginDescription);
                    }
                }
            }
            for (var i = 0, len = this._pointListeners.length; i < len; i++) {
                var listenerEntry = this._pointListeners[i];
                var descriptions = PluginsRegistryImpl._filterWithExtPoint(pluginDescriptions, listenerEntry.extensionPoint);
                this._triggerPointListener(listenerEntry, descriptions);
            }
        };
        PluginsRegistryImpl._filterWithExtPoint = function (input, point) {
            return input.filter(function (desc) {
                return (desc.contributes && hasOwnProperty.call(desc.contributes, point));
            });
        };
        PluginsRegistryImpl.prototype.getPluginDescriptionsForActivationEvent = function (activationEvent) {
            if (!hasOwnProperty.call(this._activationMap, activationEvent)) {
                return [];
            }
            return this._activationMap[activationEvent].slice(0);
        };
        PluginsRegistryImpl.prototype.getAllPluginDescriptions = function () {
            return this._pluginsArr.slice(0);
        };
        PluginsRegistryImpl.prototype.getPluginDescription = function (pluginId) {
            if (!hasOwnProperty.call(this._pluginsMap, pluginId)) {
                return null;
            }
            return this._pluginsMap[pluginId];
        };
        PluginsRegistryImpl.prototype.registerOneTimeActivationEventListener = function (activationEvent, listener) {
            if (!hasOwnProperty.call(this._oneTimeActivationEventListeners, activationEvent)) {
                this._oneTimeActivationEventListeners[activationEvent] = [];
            }
            this._oneTimeActivationEventListeners[activationEvent].push(listener);
        };
        PluginsRegistryImpl.prototype.triggerActivationEventListeners = function (activationEvent) {
            if (hasOwnProperty.call(this._oneTimeActivationEventListeners, activationEvent)) {
                var listeners = this._oneTimeActivationEventListeners[activationEvent];
                delete this._oneTimeActivationEventListeners[activationEvent];
                for (var i = 0, len = listeners.length; i < len; i++) {
                    var listener = listeners[i];
                    try {
                        listener();
                    }
                    catch (e) {
                        Errors.onUnexpectedError(e);
                    }
                }
            }
        };
        return PluginsRegistryImpl;
    })();
    function _isStringArray(arr) {
        if (!Array.isArray(arr)) {
            return false;
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            if (typeof arr[i] !== 'string') {
                return false;
            }
        }
        return true;
    }
    var Extensions = {
        PluginsRegistry: 'PluginsRegistry'
    };
    platform_1.Registry.add(Extensions.PluginsRegistry, new PluginsRegistryImpl());
    exports.PluginsRegistry = platform_1.Registry.as(Extensions.PluginsRegistry);
    var schemaId = 'local://schemas/vscode-extension';
    var schema = {
        default: {
            'name': '{{name}}',
            'description': '{{description}}',
            'author': '{{author}}',
            'version': '{{1.0.0}}',
            'main': '{{pathToMain}}',
            'dependencies': {}
        },
        properties: {
            // engines: {
            // 	required: [ 'vscode' ],
            // 	properties: {
            // 		'vscode': {
            // 			type: 'string',
            // 			description: nls.localize('vscode.extension.engines.vscode', 'Specifies that this package only runs inside VSCode of the given version.'),
            // 		}
            // 	}
            // },
            displayName: {
                description: nls.localize('vscode.extension.displayName', 'The display name for the extension used in the VS Code gallery.'),
                type: 'string'
            },
            categories: {
                description: nls.localize('vscode.extension.categories', 'The categories used by the VS Code gallery to categorize the extension.'),
                type: 'array',
                items: {
                    type: 'string',
                    enum: ['Languages', 'Snippets', 'Linters', 'Themes', 'Debuggers', 'Other']
                }
            },
            galleryBanner: {
                type: 'object',
                description: nls.localize('vscode.extension.galleryBanner', 'Banner used in the VS Code marketplace.'),
                properties: {
                    color: {
                        description: nls.localize('vscode.extension.galleryBanner.color', 'The banner color on the VS Code marketplace page header.'),
                        type: 'string'
                    },
                    theme: {
                        description: nls.localize('vscode.extension.galleryBanner.theme', 'The color theme for the font used in the banner.'),
                        type: 'string',
                        enum: ['dark', 'light']
                    }
                }
            },
            publisher: {
                description: nls.localize('vscode.extension.publisher', 'The publisher of the VS Code extension.'),
                type: 'string'
            },
            activationEvents: {
                description: nls.localize('vscode.extension.activationEvents', 'Activation events for the VS Code extension.'),
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            extensionDependencies: {
                description: nls.localize('vscode.extension.extensionDependencies', 'Dependencies to other extensions. The id of an extension is always ${publisher}.${name}. For example: vscode.csharp.'),
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            scripts: {
                type: 'object',
                properties: {
                    'vscode:prepublish': {
                        description: nls.localize('vscode.extension.scripts.prepublish', 'Script executed before the package is published as a VS Code extension.'),
                        type: 'string'
                    }
                }
            },
            contributes: {
                description: nls.localize('vscode.extension.contributes', 'All contributions of the VS Code extension represented by this package.'),
                type: 'object',
                properties: {},
                default: {}
            },
            isAMD: {
                description: nls.localize('vscode.extension.isAMD', 'Indicated whether VS Code should load your code as AMD or CommonJS. Default: false.'),
                type: 'boolean'
            }
        }
    };
    schemaRegistry.registerSchema(schemaId, schema);
    schemaRegistry.addSchemaFileAssociation('/package.json', schemaId);
});
//# sourceMappingURL=pluginsRegistry.js.map