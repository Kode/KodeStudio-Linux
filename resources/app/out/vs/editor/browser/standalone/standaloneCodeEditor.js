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
define(["require", "exports", 'vs/editor/browser/widget/codeEditorWidget', 'vs/editor/browser/standalone/simpleServices', 'vs/editor/browser/standalone/standaloneServices', 'vs/base/common/uri', 'vs/base/common/lifecycle', 'vs/platform/instantiation/common/instantiationService', 'vs/editor/browser/widget/diffEditorWidget', 'vs/editor/common/config/defaultConfig', 'vs/platform/plugins/common/pluginsRegistry', 'vs/platform/telemetry/common/abstractRemoteTelemetryService', 'vs/platform/editor/common/editor', 'vs/platform/markers/common/markers', 'vs/platform/telemetry/common/telemetry', 'vs/platform/keybinding/common/keybindingService', 'vs/platform/instantiation/common/instantiation', 'vs/platform/contextview/browser/contextView', 'vs/editor/browser/standalone/colorizer', 'vs/editor/common/modes/modesRegistry', 'vs/platform/platform', 'vs/platform/instantiation/common/descriptors', 'vs/editor/common/modes/languageExtensionPoint', 'vs/platform/keybinding/browser/keybindingServiceImpl', 'vs/editor/common/services/codeEditorService', 'vs/platform/jsonschemas/common/jsonContributionRegistry'], function (require, exports, CodeEditorWidget, SimpleServices, standaloneServices, uri_1, Lifecycle, InstantiationService, DiffEditorWidget, defaultConfig_1, pluginsRegistry_1, abstractRemoteTelemetryService_1, editor_1, markers_1, telemetry_1, keybindingService_1, instantiation_1, contextView_1, colorizer, modesRegistry_1, platform_1, descriptors_1, languageExtensionPoint_1, keybindingServiceImpl_1, codeEditorService_1, JSONContributionRegistry) {
    // Set defaults for standalone editor
    defaultConfig_1.DefaultConfig.editor.wrappingIndent = 'none';
    var StandaloneEditor = (function (_super) {
        __extends(StandaloneEditor, _super);
        function StandaloneEditor(domElement, options, toDispose, instantiationService, codeEditorService, keybindingService, telemetryService, contextViewService, editorService, markerService) {
            if (keybindingService instanceof keybindingServiceImpl_1.AbstractKeybindingService) {
                keybindingService.setInstantiationService(instantiationService);
            }
            if (keybindingService instanceof SimpleServices.StandaloneKeybindingService) {
                this._standaloneKeybindingService = keybindingService;
            }
            this._contextViewService = contextViewService;
            this._editorService = editorService;
            this._markerService = markerService;
            this._toDispose2 = toDispose;
            options = options || {};
            if (typeof options.model === 'undefined') {
                options.model = self.Monaco.Editor.createModel(options.value || '', options.mode || 'text/plain');
                this._ownsModel = true;
            }
            else {
                this._ownsModel = false;
            }
            _super.call(this, domElement, options, instantiationService, codeEditorService, keybindingService, telemetryService);
        }
        StandaloneEditor.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._toDispose2 = Lifecycle.disposeAll(this._toDispose2);
        };
        StandaloneEditor.prototype.destroy = function () {
            this.dispose();
        };
        StandaloneEditor.prototype.getMarkerService = function () {
            return this._markerService;
        };
        StandaloneEditor.prototype.addCommand = function (keybinding, handler, context) {
            if (!this._standaloneKeybindingService) {
                console.warn('Cannot add command because the editor is configured with an unrecognized KeybindingService');
                return null;
            }
            return this._standaloneKeybindingService.addDynamicKeybinding(keybinding, handler, context);
        };
        StandaloneEditor.prototype.createContextKey = function (key, defaultValue) {
            if (!this._standaloneKeybindingService) {
                console.warn('Cannot create context key because the editor is configured with an unrecognized KeybindingService');
                return null;
            }
            return this._standaloneKeybindingService.createKey(key, defaultValue);
        };
        StandaloneEditor.prototype.addAction = function (descriptor) {
            var _this = this;
            _super.prototype.addAction.call(this, descriptor);
            if (!this._standaloneKeybindingService) {
                console.warn('Cannot add keybinding because the editor is configured with an unrecognized KeybindingService');
                return null;
            }
            if (Array.isArray(descriptor.keybindings)) {
                var handler = function (accessor) {
                    return _this.trigger('keyboard', descriptor.id, null);
                };
                descriptor.keybindings.forEach(function (kb) {
                    _this._standaloneKeybindingService.addDynamicKeybinding(kb, handler, descriptor.keybindingContext, descriptor.id);
                });
            }
        };
        StandaloneEditor.prototype.getTelemetryService = function () {
            return this._telemetryService;
        };
        StandaloneEditor.prototype.getEditorService = function () {
            return this._editorService;
        };
        StandaloneEditor.prototype._attachModel = function (model) {
            _super.prototype._attachModel.call(this, model);
            if (this._view) {
                this._contextViewService.setContainer(this._view.domNode);
            }
        };
        StandaloneEditor.prototype._postDetachModelCleanup = function (detachedModel) {
            _super.prototype._postDetachModelCleanup.call(this, detachedModel);
            if (detachedModel && this._ownsModel) {
                detachedModel.destroy();
                this._ownsModel = false;
            }
        };
        StandaloneEditor = __decorate([
            __param(3, instantiation_1.IInstantiationService),
            __param(4, codeEditorService_1.ICodeEditorService),
            __param(5, keybindingService_1.IKeybindingService),
            __param(6, telemetry_1.ITelemetryService),
            __param(7, contextView_1.IContextViewService),
            __param(8, editor_1.IEditorService),
            __param(9, markers_1.IMarkerService)
        ], StandaloneEditor);
        return StandaloneEditor;
    })(CodeEditorWidget.CodeEditorWidget);
    var StandaloneDiffEditor = (function (_super) {
        __extends(StandaloneDiffEditor, _super);
        function StandaloneDiffEditor(domElement, options, toDispose, instantiationService, keybindingService, contextViewService, editorService, markerService, telemetryService) {
            if (keybindingService instanceof keybindingServiceImpl_1.AbstractKeybindingService) {
                keybindingService.setInstantiationService(instantiationService);
            }
            if (keybindingService instanceof SimpleServices.StandaloneKeybindingService) {
                this._standaloneKeybindingService = keybindingService;
            }
            this._contextViewService = contextViewService;
            this._editorService = editorService;
            this._markerService = markerService;
            this._telemetryService = telemetryService;
            this._toDispose2 = toDispose;
            options = options || {};
            _super.call(this, domElement, options, instantiationService);
            this._contextViewService.setContainer(this._containerDomElement);
        }
        StandaloneDiffEditor.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._toDispose2 = Lifecycle.disposeAll(this._toDispose2);
        };
        StandaloneDiffEditor.prototype.destroy = function () {
            this.dispose();
        };
        StandaloneDiffEditor.prototype.getMarkerService = function () {
            return this._markerService;
        };
        StandaloneDiffEditor.prototype.addCommand = function (keybinding, handler, context) {
            if (!this._standaloneKeybindingService) {
                console.warn('Cannot add command because the editor is configured with an unrecognized KeybindingService');
                return null;
            }
            return this._standaloneKeybindingService.addDynamicKeybinding(keybinding, handler, context);
        };
        StandaloneDiffEditor.prototype.createContextKey = function (key, defaultValue) {
            if (!this._standaloneKeybindingService) {
                console.warn('Cannot create context key because the editor is configured with an unrecognized KeybindingService');
                return null;
            }
            return this._standaloneKeybindingService.createKey(key, defaultValue);
        };
        StandaloneDiffEditor.prototype.addAction = function (descriptor) {
            var _this = this;
            _super.prototype.addAction.call(this, descriptor);
            if (!this._standaloneKeybindingService) {
                console.warn('Cannot add keybinding because the editor is configured with an unrecognized KeybindingService');
                return null;
            }
            if (Array.isArray(descriptor.keybindings)) {
                var handler = function (ctx) {
                    return _this.trigger('keyboard', descriptor.id, null);
                };
                descriptor.keybindings.forEach(function (kb) {
                    _this._standaloneKeybindingService.addDynamicKeybinding(kb, handler, descriptor.keybindingContext, descriptor.id);
                });
            }
        };
        StandaloneDiffEditor.prototype.getTelemetryService = function () {
            return this._telemetryService;
        };
        StandaloneDiffEditor = __decorate([
            __param(3, instantiation_1.IInstantiationService),
            __param(4, keybindingService_1.IKeybindingService),
            __param(5, contextView_1.IContextViewService),
            __param(6, editor_1.IEditorService),
            __param(7, markers_1.IMarkerService),
            __param(8, telemetry_1.ITelemetryService)
        ], StandaloneDiffEditor);
        return StandaloneDiffEditor;
    })(DiffEditorWidget.DiffEditorWidget);
    var startup = (function () {
        var modesRegistryInitialized = false;
        var setupServicesCalled = false;
        return {
            initStaticServicesIfNecessary: function () {
                if (modesRegistryInitialized) {
                    return;
                }
                modesRegistryInitialized = true;
                var staticServices = standaloneServices.getOrCreateStaticServices();
                // Instantiate thread actors
                staticServices.threadService.getRemotable(abstractRemoteTelemetryService_1.RemoteTelemetryServiceHelper);
            },
            setupServices: function (services) {
                if (setupServicesCalled) {
                    console.error('Call to Monaco.Editor.setupServices is ignored because it was called before');
                    return;
                }
                setupServicesCalled = true;
                if (modesRegistryInitialized) {
                    console.error('Call to Monaco.Editor.setupServices is ignored because other API was called before');
                    return;
                }
                return standaloneServices.ensureStaticPlatformServices(services);
            }
        };
    })();
    function shallowClone(obj) {
        var r = {};
        if (obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    r[key] = obj[key];
                }
            }
        }
        return r;
    }
    exports.setupServices = startup.setupServices;
    function create(domElement, options, services) {
        startup.initStaticServicesIfNecessary();
        services = shallowClone(services);
        var editorService = null;
        if (!services || !services.editorService) {
            editorService = new SimpleServices.SimpleEditorService();
            services.editorService = editorService;
        }
        var t = prepareServices(domElement, services);
        var result = t.ctx.instantiationService.createInstance(StandaloneEditor, domElement, options, t.toDispose);
        if (editorService) {
            editorService.setEditor(result);
        }
        return result;
    }
    exports.create = create;
    function createDiffEditor(domElement, options, services) {
        startup.initStaticServicesIfNecessary();
        services = shallowClone(services);
        var editorService = null;
        if (!services || !services.editorService) {
            editorService = new SimpleServices.SimpleEditorService();
            services.editorService = editorService;
        }
        var t = prepareServices(domElement, services);
        var result = t.ctx.instantiationService.createInstance(StandaloneDiffEditor, domElement, options, t.toDispose);
        if (editorService) {
            editorService.setEditor(result);
        }
        return result;
    }
    exports.createDiffEditor = createDiffEditor;
    function prepareServices(domElement, services) {
        services = standaloneServices.ensureStaticPlatformServices(services);
        var toDispose = standaloneServices.ensureDynamicPlatformServices(domElement, services);
        services.instantiationService = InstantiationService.create(services);
        return {
            ctx: services,
            toDispose: toDispose
        };
    }
    function createModelWithRegistryMode(modelService, modeService, value, modeName, associatedResource) {
        var modeInformation = modeService.lookup(modeName);
        if (modeInformation.length > 0) {
            // Force usage of the first existing mode
            modeName = modeInformation[0].modeId;
        }
        else {
            // Fall back to plain/text
            modeName = 'plain/text';
        }
        var mode = modeService.getMode(modeName);
        if (mode) {
            return modelService.createModel(value, mode, associatedResource);
        }
        return modelService.createModel(value, modeService.getOrCreateMode(modeName), associatedResource);
    }
    function createModel(value, mode, associatedResource) {
        startup.initStaticServicesIfNecessary();
        var modelService = standaloneServices.ensureStaticPlatformServices(null).modelService;
        var resource;
        if (typeof associatedResource === 'string') {
            resource = uri_1.default.parse(associatedResource);
        }
        else {
            // must be a URL
            resource = associatedResource;
        }
        if (typeof mode.getId === 'function') {
            // mode is an IMode
            return modelService.createModel(value, mode, resource);
        }
        if (typeof mode === 'string') {
            // mode is a string
            var modeService = standaloneServices.ensureStaticPlatformServices(null).modeService;
            return createModelWithRegistryMode(modelService, modeService, value, mode, resource);
        }
        // mode must be an ILanguage
        return modelService.createModel(value, createCustomMode(mode), resource);
    }
    exports.createModel = createModel;
    function getOrCreateMode(mimetypes) {
        startup.initStaticServicesIfNecessary();
        var modeService = standaloneServices.ensureStaticPlatformServices(null).modeService;
        return modeService.getOrCreateMode(mimetypes);
    }
    exports.getOrCreateMode = getOrCreateMode;
    function configureMode(modeId, options) {
        startup.initStaticServicesIfNecessary();
        var modeService = standaloneServices.ensureStaticPlatformServices(null).modeService;
        modeService.configureModeById(modeId, options);
    }
    exports.configureMode = configureMode;
    function registerWorkerParticipant(modeId, moduleName, ctorName) {
        var modeRegistry = platform_1.Registry.as(modesRegistry_1.Extensions.EditorModes);
        modeRegistry.registerWorkerParticipant(modeId, descriptors_1.createAsyncDescriptor0(moduleName, ctorName));
    }
    exports.registerWorkerParticipant = registerWorkerParticipant;
    function getAPI() {
        startup.initStaticServicesIfNecessary();
        return require('vscode');
    }
    exports.getAPI = getAPI;
    function createCustomMode(language) {
        startup.initStaticServicesIfNecessary();
        var modeService = standaloneServices.ensureStaticPlatformServices(null).modeService;
        var modeId = language.name;
        var name = language.name;
        languageExtensionPoint_1.LanguageExtensions.registerLanguage({
            id: modeId,
            aliases: [name]
        });
        pluginsRegistry_1.PluginsRegistry.registerOneTimeActivationEventListener('onLanguage:' + modeId, function () {
            modeService.registerMonarchDefinition(modeId, language);
        });
        return modeService.getOrCreateMode(modeId);
    }
    exports.createCustomMode = createCustomMode;
    function registerStandaloneLanguage(language, defModule) {
        languageExtensionPoint_1.LanguageExtensions.registerLanguage(language);
        pluginsRegistry_1.PluginsRegistry.registerOneTimeActivationEventListener('onLanguage:' + language.id, function () {
            require([defModule], function (value) {
                if (!value.language) {
                    console.error('Expected ' + defModule + ' to export a `language`');
                    return;
                }
                startup.initStaticServicesIfNecessary();
                var modeService = standaloneServices.ensureStaticPlatformServices(null).modeService;
                modeService.registerMonarchDefinition(language.id, value.language);
            }, function (err) {
                console.error('Cannot find module ' + defModule, err);
            });
        });
    }
    exports.registerStandaloneLanguage = registerStandaloneLanguage;
    function registerStandaloneSchema(uri, schema) {
        var schemaRegistry = platform_1.Registry.as(JSONContributionRegistry.Extensions.JSONContribution);
        schemaRegistry.registerSchema(uri, schema);
    }
    exports.registerStandaloneSchema = registerStandaloneSchema;
    function colorizeElement(domNode, options) {
        startup.initStaticServicesIfNecessary();
        var modeService = standaloneServices.ensureStaticPlatformServices(null).modeService;
        return colorizer.colorizeElement(modeService, domNode, options);
    }
    exports.colorizeElement = colorizeElement;
    function colorize(text, mimeType, options) {
        startup.initStaticServicesIfNecessary();
        var modeService = standaloneServices.ensureStaticPlatformServices(null).modeService;
        return colorizer.colorize(modeService, text, mimeType, options);
    }
    exports.colorize = colorize;
});
//# sourceMappingURL=standaloneCodeEditor.js.map