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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/workbench/common/editor', 'vs/workbench/common/editor/resourceEditorModel', 'vs/base/common/events', 'vs/platform/instantiation/common/instantiation', 'vs/editor/common/services/modelService'], function (require, exports, winjs_base_1, editor_1, resourceEditorModel_1, events_1, instantiation_1, modelService_1) {
    /**
     * A read-only text editor input whos contents are made of the provided resource that points to an existing
     * code editor model.
     */
    var ResourceEditorInput = (function (_super) {
        __extends(ResourceEditorInput, _super);
        function ResourceEditorInput(name, description, resource, modelService, instantiationService) {
            _super.call(this);
            this.modelService = modelService;
            this.instantiationService = instantiationService;
            this.name = name;
            this.description = description;
            this.resource = resource;
        }
        ResourceEditorInput.registerResourceContentProvider = function (scheme, provider) {
            ResourceEditorInput.registry[scheme] = provider;
            return { dispose: function () { delete ResourceEditorInput.registry[scheme]; } };
        };
        ResourceEditorInput.getOrCreateModel = function (modelService, resource) {
            var model = modelService.getModel(resource);
            if (model) {
                return winjs_base_1.TPromise.as(model);
            }
            var loadingModel = ResourceEditorInput.loadingModels[resource.toString()];
            if (!loadingModel) {
                // make sure we have a provider this scheme
                // the resource uses
                var provider = ResourceEditorInput.registry[resource.scheme];
                if (!provider) {
                    return winjs_base_1.TPromise.wrapError("No model with uri '" + resource + "' nor a resolver for the scheme '" + resource.scheme + "'.");
                }
                // load the model-content from the provider and cache
                // the loading such that we don't create the same model
                // twice
                ResourceEditorInput.loadingModels[resource.toString()] = loadingModel = new winjs_base_1.TPromise(function (resolve, reject) {
                    provider.provideTextContent(resource).then(resolve, reject);
                }, function () {
                    // no cancellation when caching promises
                });
                // remove the cached promise 'cos the model is now
                // known to the model service (see above)
                loadingModel.then(function () { return delete ResourceEditorInput.loadingModels[resource.toString()]; }, function () { return delete ResourceEditorInput.loadingModels[resource.toString()]; });
            }
            return loadingModel;
        };
        ResourceEditorInput.prototype.getId = function () {
            return ResourceEditorInput.ID;
        };
        ResourceEditorInput.prototype.getName = function () {
            return this.name;
        };
        ResourceEditorInput.prototype.getDescription = function () {
            return this.description;
        };
        ResourceEditorInput.prototype.resolve = function (refresh) {
            var _this = this;
            // Use Cached Model
            if (this.cachedModel) {
                return winjs_base_1.TPromise.as(this.cachedModel);
            }
            // Otherwise Create Model and handle dispose event
            return ResourceEditorInput.getOrCreateModel(this.modelService, this.resource).then(function () {
                var model = _this.instantiationService.createInstance(resourceEditorModel_1.ResourceEditorModel, _this.resource);
                var unbind = model.addListener(events_1.EventType.DISPOSE, function () {
                    _this.cachedModel = null; // make sure we do not dispose model again
                    unbind();
                    _this.dispose();
                });
                // Load it
                return model.load().then(function (resolvedModel) {
                    _this.cachedModel = resolvedModel;
                    return _this.cachedModel;
                });
            });
        };
        ResourceEditorInput.prototype.matches = function (otherInput) {
            if (_super.prototype.matches.call(this, otherInput) === true) {
                return true;
            }
            if (otherInput instanceof ResourceEditorInput) {
                var otherResourceEditorInput = otherInput;
                // Compare by properties
                return otherResourceEditorInput.resource.toString() === this.resource.toString();
            }
            return false;
        };
        ResourceEditorInput.prototype.dispose = function () {
            if (this.cachedModel) {
                this.cachedModel.dispose();
                this.cachedModel = null;
            }
            _super.prototype.dispose.call(this);
        };
        // --- registry logic
        // todo@joh,ben this should maybe be a service that is in charge of loading/resolving a uri from a scheme
        ResourceEditorInput.loadingModels = Object.create(null);
        ResourceEditorInput.registry = Object.create(null);
        ResourceEditorInput.ID = 'workbench.editors.resourceEditorInput';
        ResourceEditorInput = __decorate([
            __param(3, modelService_1.IModelService),
            __param(4, instantiation_1.IInstantiationService)
        ], ResourceEditorInput);
        return ResourceEditorInput;
    })(editor_1.EditorInput);
    exports.ResourceEditorInput = ResourceEditorInput;
});
//# sourceMappingURL=resourceEditorInput.js.map