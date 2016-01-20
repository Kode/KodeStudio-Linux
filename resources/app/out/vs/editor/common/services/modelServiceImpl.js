/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
define(["require", "exports", 'vs/editor/common/services/modeService', 'vs/editor/common/model/mirrorModel', 'vs/editor/common/core/range', 'vs/editor/common/editorCommon', 'vs/editor/common/services/resourceService', 'vs/editor/common/services/modelService', 'vs/platform/thread/common/thread', 'vs/base/common/event', 'vs/base/common/uri', 'vs/base/common/severity', 'vs/base/common/errors', 'vs/platform/telemetry/common/telemetry', 'vs/editor/common/model/model'], function (require, exports, modeService_1, mirrorModel_1, range_1, EditorCommon, resourceService_1, modelService_1, thread_1, event_1, uri_1, severity_1, Errors, telemetry_1, model_1) {
    function MODEL_ID(resource) {
        return resource.toString();
    }
    var ModelData = (function () {
        function ModelData(model, eventsHandler) {
            var _this = this;
            this.model = model;
            this.isSyncedToWorkers = false;
            this._markerDecorations = [];
            this._modelEventsListener = model.addBulkListener2(function (events) { return eventsHandler(_this, events); });
        }
        ModelData.prototype.dispose = function () {
            this._markerDecorations = this.model.deltaDecorations(this._markerDecorations, []);
            this._modelEventsListener.dispose();
            this._modelEventsListener = null;
            this.model = null;
        };
        ModelData.prototype.getModelId = function () {
            return MODEL_ID(this.model.getAssociatedResource());
        };
        ModelData.prototype.acceptMarkerDecorations = function (newDecorations) {
            this._markerDecorations = this.model.deltaDecorations(this._markerDecorations, newDecorations);
        };
        return ModelData;
    })();
    var ModelMarkerHandler = (function () {
        function ModelMarkerHandler() {
        }
        ModelMarkerHandler.setMarkers = function (modelData, markers) {
            var _this = this;
            // Limit to the first 500 errors/warnings
            markers = markers.slice(0, 500);
            var newModelDecorations = markers.map(function (marker) {
                return {
                    range: _this._createDecorationRange(modelData.model, marker),
                    options: _this._createDecorationOption(marker)
                };
            });
            modelData.acceptMarkerDecorations(newModelDecorations);
        };
        ModelMarkerHandler._createDecorationRange = function (model, rawMarker) {
            var marker = model.validateRange(new range_1.Range(rawMarker.startLineNumber, rawMarker.startColumn, rawMarker.endLineNumber, rawMarker.endColumn));
            var ret = new range_1.Range(marker.startLineNumber, marker.startColumn, marker.endLineNumber, marker.endColumn);
            if (ret.isEmpty()) {
                var word = model.getWordAtPosition(ret.getStartPosition());
                if (word) {
                    ret.startColumn = word.startColumn;
                    ret.endColumn = word.endColumn;
                }
                else {
                    var maxColumn = model.getLineLastNonWhitespaceColumn(marker.startLineNumber) ||
                        model.getLineMaxColumn(marker.startLineNumber);
                    if (maxColumn === 1) {
                    }
                    else if (ret.endColumn >= maxColumn) {
                        // behind eol
                        ret.endColumn = maxColumn;
                        ret.startColumn = maxColumn - 1;
                    }
                    else {
                        // extend marker to width = 1
                        ret.endColumn += 1;
                    }
                }
            }
            else if (rawMarker.endColumn === Number.MAX_VALUE && rawMarker.startColumn === 1 && ret.startLineNumber === ret.endLineNumber) {
                var minColumn = model.getLineFirstNonWhitespaceColumn(rawMarker.startLineNumber);
                if (minColumn < ret.endColumn) {
                    ret.startColumn = minColumn;
                    rawMarker.startColumn = minColumn;
                }
            }
            return ret;
        };
        ModelMarkerHandler._createDecorationOption = function (marker) {
            var className;
            var color;
            var darkColor;
            var htmlMessage = null;
            switch (marker.severity) {
                case severity_1.default.Ignore:
                    // do something
                    break;
                case severity_1.default.Warning:
                case severity_1.default.Info:
                    className = EditorCommon.ClassName.EditorWarningDecoration;
                    color = 'rgba(18,136,18,0.7)';
                    darkColor = 'rgba(18,136,18,0.7)';
                    break;
                case severity_1.default.Error:
                default:
                    className = EditorCommon.ClassName.EditorErrorDecoration;
                    color = 'rgba(255,18,18,0.7)';
                    darkColor = 'rgba(255,18,18,0.7)';
                    break;
            }
            if (typeof marker.message === 'string') {
                htmlMessage = [{ isText: true, text: marker.message }];
            }
            else if (Array.isArray(marker.message)) {
                htmlMessage = marker.message;
            }
            else if (marker.message) {
                htmlMessage = [marker.message];
            }
            if (marker.source) {
                htmlMessage.unshift({ isText: true, text: "[" + marker.source + "] " });
            }
            return {
                stickiness: EditorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                className: className,
                htmlMessage: htmlMessage,
                overviewRuler: {
                    color: color,
                    darkColor: darkColor,
                    position: EditorCommon.OverviewRulerLane.Right
                }
            };
        };
        return ModelMarkerHandler;
    })();
    var ModelServiceImpl = (function () {
        function ModelServiceImpl(threadService, markerService) {
            this.serviceId = modelService_1.IModelService;
            this._threadService = threadService;
            this._markerService = markerService;
            this._workerHelper = this._threadService.getRemotable(ModelServiceWorkerHelper);
            this._models = {};
            this._onModelAdded = new event_1.Emitter();
            this._onModelRemoved = new event_1.Emitter();
            this._onModelModeChanged = new event_1.Emitter();
            if (this._markerService) {
                this._markerServiceSubscription = this._markerService.onMarkerChanged(this._handleMarkerChange, this);
            }
        }
        ModelServiceImpl.prototype.dispose = function () {
            if (this._markerServiceSubscription) {
                this._markerServiceSubscription.dispose();
            }
        };
        ModelServiceImpl.prototype._handleMarkerChange = function (changedResources) {
            var _this = this;
            changedResources.forEach(function (resource) {
                var modelId = MODEL_ID(resource);
                var modelData = _this._models[modelId];
                if (!modelData) {
                    return;
                }
                ModelMarkerHandler.setMarkers(modelData, _this._markerService.read({ resource: resource, take: 500 }));
            });
        };
        // --- begin IModelService
        ModelServiceImpl.prototype._createModelData = function (value, modeOrPromise, resource) {
            var _this = this;
            // create & save the model
            var model = new model_1.Model(value, modeOrPromise, resource);
            var modelId = MODEL_ID(model.getAssociatedResource());
            if (this._models[modelId]) {
                // There already exists a model with this id => this is a programmer error
                throw new Error('ModelService: Cannot add model ' + telemetry_1.anonymize(modelId) + ' because it already exists!');
            }
            var modelData = new ModelData(model, function (modelData, events) { return _this._onModelEvents(modelData, events); });
            this._models[modelId] = modelData;
            return modelData;
        };
        ModelServiceImpl.prototype.createModel = function (value, modeOrPromise, resource) {
            var modelData = this._createModelData(value, modeOrPromise, resource);
            var modelId = modelData.getModelId();
            // handle markers (marker service => model)
            if (this._markerService) {
                ModelMarkerHandler.setMarkers(modelData, this._markerService.read({ resource: modelData.model.getAssociatedResource() }));
            }
            if (!modelData.model.isTooLargeForHavingARichMode()) {
                // send this model to the workers
                modelData.isSyncedToWorkers = true;
                this._workerHelper.$_acceptNewModel(ModelServiceImpl._getBoundModelData(modelData.model));
            }
            this._onModelAdded.fire(modelData.model);
            return modelData.model;
        };
        ModelServiceImpl.prototype.destroyModel = function (resource) {
            // We need to support that not all models get disposed through this service (i.e. model.dispose() should work!)
            var modelData = this._models[MODEL_ID(resource)];
            if (!modelData) {
                return;
            }
            modelData.model.dispose();
        };
        ModelServiceImpl.prototype.getModels = function () {
            var ret = [];
            for (var modelId in this._models) {
                if (this._models.hasOwnProperty(modelId)) {
                    ret.push(this._models[modelId].model);
                }
            }
            return ret;
        };
        ModelServiceImpl.prototype.getModel = function (resource) {
            var modelId = MODEL_ID(resource);
            var modelData = this._models[modelId];
            if (!modelData) {
                return null;
            }
            return modelData.model;
        };
        Object.defineProperty(ModelServiceImpl.prototype, "onModelAdded", {
            get: function () {
                return this._onModelAdded ? this._onModelAdded.event : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelServiceImpl.prototype, "onModelRemoved", {
            get: function () {
                return this._onModelRemoved ? this._onModelRemoved.event : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelServiceImpl.prototype, "onModelModeChanged", {
            get: function () {
                return this._onModelModeChanged ? this._onModelModeChanged.event : null;
            },
            enumerable: true,
            configurable: true
        });
        // --- end IModelService
        ModelServiceImpl.prototype._onModelDisposing = function (model) {
            var _this = this;
            var modelId = MODEL_ID(model.getAssociatedResource());
            var modelData = this._models[modelId];
            // TODO@Joh why are we removing markers here?
            if (this._markerService) {
                var markers = this._markerService.read({ resource: model.getAssociatedResource() }), owners = Object.create(null);
                markers.forEach(function (marker) { return owners[marker.owner] = _this; });
                Object.keys(owners).forEach(function (owner) { return _this._markerService.changeOne(owner, model.getAssociatedResource(), []); });
            }
            if (modelData.isSyncedToWorkers) {
                // Dispose model in workers
                this._workerHelper.$_acceptDidDisposeModel(model.getAssociatedResource());
            }
            delete this._models[modelId];
            modelData.dispose();
            this._onModelRemoved.fire(model);
        };
        ModelServiceImpl._getBoundModelData = function (model) {
            return {
                url: model.getAssociatedResource(),
                versionId: model.getVersionId(),
                properties: model.getProperties(),
                value: model.toRawText(),
                modeId: model.getMode().getId()
            };
        };
        ModelServiceImpl.prototype._onModelEvents = function (modelData, events) {
            var eventsForWorkers = { contentChanged: [], propertiesChanged: null };
            for (var i = 0, len = events.length; i < len; i++) {
                var e = events[i];
                var data = e.getData();
                switch (e.getType()) {
                    case EditorCommon.EventType.ModelDispose:
                        this._onModelDisposing(modelData.model);
                        // no more event processing
                        return;
                    case EditorCommon.EventType.ModelContentChanged:
                        if (modelData.isSyncedToWorkers) {
                            eventsForWorkers.contentChanged.push(data);
                        }
                        break;
                    case EditorCommon.EventType.ModelPropertiesChanged:
                        if (modelData.isSyncedToWorkers) {
                            eventsForWorkers.propertiesChanged = data;
                        }
                        break;
                    case EditorCommon.EventType.ModelModeChanged:
                        var modeChangedEvent = data;
                        if (modelData.isSyncedToWorkers) {
                            // Forward mode change to all the workers
                            this._workerHelper.$_acceptDidChangeModelMode(modelData.getModelId(), modeChangedEvent.oldMode.getId(), modeChangedEvent.newMode.getId());
                        }
                        this._onModelModeChanged.fire({ model: modelData.model, oldModeId: modeChangedEvent.oldMode.getId() });
                        break;
                }
            }
            if (eventsForWorkers.contentChanged.length > 0 || eventsForWorkers.propertiesChanged) {
                // Forward events to all the workers
                this._workerHelper.$_acceptModelEvents(modelData.getModelId(), eventsForWorkers);
            }
        };
        return ModelServiceImpl;
    })();
    exports.ModelServiceImpl = ModelServiceImpl;
    var ModelServiceWorkerHelper = (function () {
        function ModelServiceWorkerHelper(resourceService, modeService) {
            this._resourceService = resourceService;
            this._modeService = modeService;
        }
        ModelServiceWorkerHelper.prototype.$_acceptNewModel = function (data) {
            var _this = this;
            // Create & insert the mirror model eagerly in the resource service
            var mirrorModel = new mirrorModel_1.MirrorModel(this._resourceService, data.versionId, data.value, null, data.url, data.properties);
            this._resourceService.insert(mirrorModel.getAssociatedResource(), mirrorModel);
            // Block worker execution until the mode is instantiated
            return this._modeService.getOrCreateMode(data.modeId).then(function (mode) {
                // Changing mode should trigger a remove & an add, therefore:
                // (1) Remove from resource service
                _this._resourceService.remove(mirrorModel.getAssociatedResource());
                // (2) Change mode
                mirrorModel.setMode(mode);
                // (3) Insert again to resource service (it will have the new mode)
                _this._resourceService.insert(mirrorModel.getAssociatedResource(), mirrorModel);
            });
        };
        ModelServiceWorkerHelper.prototype.$_acceptDidChangeModelMode = function (modelId, oldModeId, newModeId) {
            var _this = this;
            var mirrorModel = this._resourceService.get(uri_1.default.parse(modelId));
            // Block worker execution until the mode is instantiated
            return this._modeService.getOrCreateMode(newModeId).then(function (mode) {
                // Changing mode should trigger a remove & an add, therefore:
                // (1) Remove from resource service
                _this._resourceService.remove(mirrorModel.getAssociatedResource());
                // (2) Change mode
                mirrorModel.setMode(mode);
                // (3) Insert again to resource service (it will have the new mode)
                _this._resourceService.insert(mirrorModel.getAssociatedResource(), mirrorModel);
            });
        };
        ModelServiceWorkerHelper.prototype.$_acceptDidDisposeModel = function (url) {
            var model = this._resourceService.get(url);
            this._resourceService.remove(url);
            if (model) {
                model.dispose();
            }
        };
        ModelServiceWorkerHelper.prototype.$_acceptModelEvents = function (modelId, events) {
            var model = this._resourceService.get(uri_1.default.parse(modelId));
            if (!model) {
                throw new Error('Received model events for missing model ' + telemetry_1.anonymize(modelId));
            }
            try {
                model.onEvents(events);
            }
            catch (err) {
                Errors.onUnexpectedError(err);
            }
        };
        ModelServiceWorkerHelper = __decorate([
            thread_1.Remotable.WorkerContext('ModelServiceWorkerHelper', thread_1.ThreadAffinity.All),
            __param(0, resourceService_1.IResourceService),
            __param(1, modeService_1.IModeService)
        ], ModelServiceWorkerHelper);
        return ModelServiceWorkerHelper;
    })();
    exports.ModelServiceWorkerHelper = ModelServiceWorkerHelper;
});
//# sourceMappingURL=modelServiceImpl.js.map