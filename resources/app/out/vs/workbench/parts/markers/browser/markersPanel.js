/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["vs/workbench/parts/markers/common/markersModel","require","exports","vs/base/common/winjs.base","vs/workbench/parts/markers/common/messages","vs/base/common/severity","vs/css!vs/workbench/parts/markers/browser/media/markers","vs/workbench/parts/markers/browser/markersActionProvider","vs/nls!vs/workbench/parts/markers/browser/markersActionProvider","vs/platform/instantiation/common/instantiation","vs/workbench/parts/markers/browser/markersTreeController","vs/base/common/errors","vs/workbench/services/editor/common/editorService","vs/platform/telemetry/common/telemetry","vs/workbench/parts/markers/browser/markersTreeViewer","vs/base/browser/dom","vs/nls!vs/workbench/parts/markers/browser/markersPanel","vs/base/common/paths","vs/base/common/actions","vs/base/common/types","vs/base/common/map","vs/platform/configuration/common/configuration","vs/css!vs/workbench/parts/markers/browser/markersPanel","vs/base/common/uri","vs/editor/common/core/range","vs/base/common/filters","vs/nls","vs/workbench/services/workspace/common/contextService","vs/base/browser/ui/countBadge/countBadge","vs/base/browser/ui/fileLabel/fileLabel","vs/base/browser/ui/highlightedlabel/highlightedLabel","vs/workbench/parts/markers/browser/markersPanel","vs/base/common/set","vs/base/common/async","vs/base/common/lifecycle","vs/platform/markers/common/markers","vs/platform/event/common/event","vs/workbench/services/group/common/groupService","vs/workbench/parts/files/common/editors/fileEditorInput","vs/workbench/browser/panel","vs/workbench/parts/markers/common/constants","vs/base/parts/tree/browser/treeImpl","vs/workbench/parts/markers/browser/markersPanelActions","vs/base/parts/tree/browser/treeDefaults"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[6], __M([22]), {});
define(__m[8], __M([26,16]), function(nls, data) { return nls.create("vs/workbench/parts/markers/browser/markersActionProvider", data); });
define(__m[0], __M([1,2,17,19,20,5,23,24,25,4]), function (require, exports, paths, types, Map, severity_1, uri_1, range_1, filters_1, messages_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var Resource = (function () {
        function Resource(uri, markers, statistics, matches) {
            if (matches === void 0) { matches = []; }
            this.uri = uri;
            this.markers = markers;
            this.statistics = statistics;
            this.matches = matches;
            this.path = uri.fsPath;
            this.name = paths.basename(uri.fsPath);
        }
        return Resource;
    }());
    exports.Resource = Resource;
    var Marker = (function () {
        function Marker(id, marker, labelMatches, sourceMatches) {
            if (labelMatches === void 0) { labelMatches = []; }
            if (sourceMatches === void 0) { sourceMatches = []; }
            this.id = id;
            this.marker = marker;
            this.labelMatches = labelMatches;
            this.sourceMatches = sourceMatches;
        }
        return Marker;
    }());
    exports.Marker = Marker;
    var FilterOptions = (function () {
        function FilterOptions(filter) {
            if (filter === void 0) { filter = ''; }
            this._filterErrors = false;
            this._filterWarnings = false;
            this._filterInfos = false;
            this._filter = '';
            this._completeFilter = '';
            if (filter) {
                this.parse(filter);
            }
        }
        Object.defineProperty(FilterOptions.prototype, "filterErrors", {
            get: function () {
                return this._filterErrors;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilterOptions.prototype, "filterWarnings", {
            get: function () {
                return this._filterWarnings;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilterOptions.prototype, "filterInfos", {
            get: function () {
                return this._filterInfos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilterOptions.prototype, "filter", {
            get: function () {
                return this._filter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilterOptions.prototype, "completeFilter", {
            get: function () {
                return this._completeFilter;
            },
            enumerable: true,
            configurable: true
        });
        FilterOptions.prototype.hasFilters = function () {
            return !!this._filter;
        };
        FilterOptions.prototype.parse = function (filter) {
            this._completeFilter = filter;
            this._filter = filter.trim();
            this._filterErrors = this.matches(this._filter, messages_1.default.MARKERS_PANEL_FILTER_ERRORS);
            this._filterWarnings = this.matches(this._filter, messages_1.default.MARKERS_PANEL_FILTER_WARNINGS);
            this._filterInfos = this.matches(this._filter, messages_1.default.MARKERS_PANEL_FILTER_INFOS);
        };
        FilterOptions.prototype.matches = function (prefix, word) {
            var result = filters_1.matchesPrefix(prefix, word);
            return result && result.length > 0;
        };
        FilterOptions._filter = filters_1.or(filters_1.matchesPrefix, filters_1.matchesContiguousSubString);
        FilterOptions._fuzzyFilter = filters_1.or(filters_1.matchesPrefix, filters_1.matchesContiguousSubString, filters_1.matchesFuzzy);
        return FilterOptions;
    }());
    exports.FilterOptions = FilterOptions;
    var MarkersModel = (function () {
        function MarkersModel(markers) {
            if (markers === void 0) { markers = []; }
            this.markersByResource = new Map.SimpleMap();
            this._filterOptions = new FilterOptions();
            this.update(markers);
        }
        Object.defineProperty(MarkersModel.prototype, "filterOptions", {
            get: function () {
                return this._filterOptions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MarkersModel.prototype, "filteredResources", {
            get: function () {
                return this._filteredResources;
            },
            enumerable: true,
            configurable: true
        });
        MarkersModel.prototype.hasFilteredResources = function () {
            return this.filteredResources.length > 0;
        };
        MarkersModel.prototype.hasResources = function () {
            return this.markersByResource.size > 0;
        };
        MarkersModel.prototype.hasResource = function (resource) {
            return this.markersByResource.has(resource);
        };
        Object.defineProperty(MarkersModel.prototype, "nonFilteredResources", {
            get: function () {
                return this._nonFilteredResources;
            },
            enumerable: true,
            configurable: true
        });
        MarkersModel.prototype.update = function (arg1, arg2) {
            if (arg1 instanceof FilterOptions) {
                this._filterOptions = arg1;
            }
            if (arg1 instanceof uri_1.default) {
                this.updateResource(arg1, arg2);
            }
            if (types.isArray(arg1)) {
                this.updateMarkers(arg1);
            }
            this.refresh();
        };
        MarkersModel.prototype.refresh = function () {
            this.refreshResources();
        };
        MarkersModel.prototype.refreshResources = function () {
            var resources = this.markersByResource.entries().map(this.toFilteredResource.bind(this));
            this._nonFilteredResources = resources.filter(function (resource) { return resource.markers.length === 0; });
            this._filteredResources = resources.filter(function (resource) { return resource.markers.length > 0; });
            this._filteredResources.sort(function (a, b) {
                if (a.statistics.errors === 0 && b.statistics.errors > 0) {
                    return 1;
                }
                if (b.statistics.errors === 0 && a.statistics.errors > 0) {
                    return -1;
                }
                return a.path.localeCompare(b.path) || a.name.localeCompare(b.name);
            });
        };
        MarkersModel.prototype.updateResource = function (resourceUri, markers) {
            if (this.markersByResource.has(resourceUri)) {
                this.markersByResource.delete(resourceUri);
            }
            if (markers.length > 0) {
                this.markersByResource.set(resourceUri, markers);
            }
        };
        MarkersModel.prototype.updateMarkers = function (markers) {
            var _this = this;
            markers.forEach(function (marker) {
                var uri = marker.resource;
                var markers = _this.markersByResource.get(uri);
                if (!markers) {
                    markers = [];
                    _this.markersByResource.set(uri, markers);
                }
                markers.push(marker);
            });
        };
        MarkersModel.prototype.toFilteredResource = function (entry) {
            var _this = this;
            var markers = entry.value.filter(this.filterMarker.bind(this)).map(function (marker, index) {
                return _this.toMarker(marker, index);
            });
            markers.sort(this.compareMarkers.bind(this));
            var matches = FilterOptions._filter(this._filterOptions.filter, paths.basename(entry.key.fsPath));
            return new Resource(entry.key, markers, this.getStatistics(entry.value), matches || []);
        };
        MarkersModel.prototype.toMarker = function (marker, index) {
            var labelMatches = FilterOptions._fuzzyFilter(this._filterOptions.filter, marker.message);
            var sourceMatches = !!marker.source ? FilterOptions._filter(this._filterOptions.filter, marker.source) : [];
            return new Marker(marker.resource.toString() + index, marker, labelMatches || [], sourceMatches || []);
        };
        MarkersModel.prototype.filterMarker = function (marker) {
            if (this._filterOptions.filter) {
                if (this._filterOptions.filterErrors && severity_1.default.Error === marker.severity) {
                    return true;
                }
                if (this._filterOptions.filterWarnings && severity_1.default.Warning === marker.severity) {
                    return true;
                }
                if (this._filterOptions.filterInfos && severity_1.default.Info === marker.severity) {
                    return true;
                }
                if (!!FilterOptions._fuzzyFilter(this._filterOptions.filter, marker.message)) {
                    return true;
                }
                if (!!FilterOptions._filter(this._filterOptions.filter, paths.basename(marker.resource.fsPath))) {
                    return true;
                }
                if (!!marker.source && !!FilterOptions._filter(this._filterOptions.filter, marker.source)) {
                    return true;
                }
                return false;
            }
            return true;
        };
        MarkersModel.prototype.compareMarkers = function (a, b) {
            return range_1.Range.compareRangesUsingStarts({
                startLineNumber: a.marker.startLineNumber,
                startColumn: a.marker.startColumn,
                endLineNumber: a.marker.endLineNumber,
                endColumn: a.marker.endColumn
            }, {
                startLineNumber: b.marker.startLineNumber,
                startColumn: b.marker.startColumn,
                endLineNumber: b.marker.endLineNumber,
                endColumn: b.marker.endColumn
            });
        };
        MarkersModel.prototype.getStatistics = function (markers) {
            var errors = 0, warnings = 0, infos = 0, unknowns = 0;
            markers.forEach(function (marker) {
                switch (marker.severity) {
                    case severity_1.default.Error:
                        errors++;
                        return;
                    case severity_1.default.Warning:
                        warnings++;
                        return;
                    case severity_1.default.Info:
                        infos++;
                        return;
                    default:
                        unknowns++;
                        return;
                }
            });
            return { errors: errors, warnings: warnings, infos: infos, unknwons: unknowns };
        };
        MarkersModel.prototype.dispose = function () {
            this.markersByResource.clear();
            this._filteredResources = [];
            this._nonFilteredResources = [];
        };
        MarkersModel.prototype.getTitle = function (markerStatistics) {
            var title = MarkersModel.getStatisticsLabel(markerStatistics);
            return title ? title : messages_1.default.MARKERS_PANEL_TITLE_NO_PROBLEMS;
        };
        MarkersModel.prototype.getMessage = function () {
            if (this.hasFilteredResources()) {
                return '';
            }
            if (this.hasResources()) {
                if (this._filterOptions.hasFilters()) {
                    return messages_1.default.MARKERS_PANEL_NO_PROBLEMS_FILTERS;
                }
            }
            return messages_1.default.MARKERS_PANEL_NO_PROBLEMS_BUILT;
        };
        MarkersModel.getStatisticsLabel = function (markerStatistics, onlyErrors) {
            if (onlyErrors === void 0) { onlyErrors = false; }
            var label = this.getLabel('', markerStatistics.errors, messages_1.default.MARKERS_PANEL_SINGLE_ERROR_LABEL, messages_1.default.MARKERS_PANEL_MULTIPLE_ERRORS_LABEL);
            if (!onlyErrors) {
                label = this.getLabel(label, markerStatistics.warnings, messages_1.default.MARKERS_PANEL_SINGLE_WARNING_LABEL, messages_1.default.MARKERS_PANEL_MULTIPLE_WARNINGS_LABEL);
                label = this.getLabel(label, markerStatistics.infos, messages_1.default.MARKERS_PANEL_SINGLE_INFO_LABEL, messages_1.default.MARKERS_PANEL_MULTIPLE_INFOS_LABEL);
                label = this.getLabel(label, markerStatistics.unknwons, messages_1.default.MARKERS_PANEL_SINGLE_UNKNOWN_LABEL, messages_1.default.MARKERS_PANEL_MULTIPLE_UNKNOWNS_LABEL);
            }
            return label;
        };
        MarkersModel.getLabel = function (title, markersCount, singleMarkerString, multipleMarkersFunction) {
            if (markersCount <= 0) {
                return title;
            }
            title = title ? title + ', ' : '';
            title += markersCount === 1 ? singleMarkerString : multipleMarkersFunction(markersCount);
            return title;
        };
        return MarkersModel;
    }());
    exports.MarkersModel = MarkersModel;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(__m[7], __M([1,2,8,3,18,9,0]), function (require, exports, nls, winjs, actions, instantiation_1, markersModel_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var RemoveResourceAction = (function (_super) {
        __extends(RemoveResourceAction, _super);
        function RemoveResourceAction() {
            _super.call(this, 'remove', nls.localize(0, null), 'action-remove');
        }
        RemoveResourceAction.prototype.run = function (context) {
            return context['tree'].refresh();
        };
        return RemoveResourceAction;
    }(actions.Action));
    var ActionContainer = (function () {
        function ActionContainer(instantiationService) {
            this.cache = {};
            this.instantiationService = instantiationService;
        }
        ActionContainer.prototype.getAction = function (ctor) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var action = this.cache[ctor.ID];
            if (!action) {
                args.unshift(ctor);
                action = this.cache[ctor.ID] = this.instantiationService.createInstance.apply(this.instantiationService, args);
            }
            return action;
        };
        ActionContainer.prototype.dispose = function () {
            var _this = this;
            Object.keys(this.cache).forEach(function (k) {
                _this.cache[k].dispose();
            });
            this.cache = null;
        };
        return ActionContainer;
    }());
    exports.ActionContainer = ActionContainer;
    var ActionProvider = (function (_super) {
        __extends(ActionProvider, _super);
        function ActionProvider(instantiationService) {
            _super.call(this, instantiationService);
        }
        ActionProvider.prototype.hasActions = function (tree, element) {
            return element instanceof markersModel_1.Resource;
        };
        ActionProvider.prototype.getActions = function (tree, element) {
            return winjs.TPromise.as(this.getActionsForResource());
        };
        ActionProvider.prototype.getActionsForResource = function () {
            return [new RemoveResourceAction()];
        };
        ActionProvider.prototype.hasSecondaryActions = function (tree, element) {
            return false;
        };
        ActionProvider.prototype.getSecondaryActions = function (tree, element) {
            return winjs.TPromise.as([]);
        };
        ActionProvider.prototype.getActionItem = function (tree, element, action) {
            return null;
        };
        ActionProvider = __decorate([
            __param(0, instantiation_1.IInstantiationService)
        ], ActionProvider);
        return ActionProvider;
    }(ActionContainer));
    exports.ActionProvider = ActionProvider;
});















define(__m[10], __M([1,2,11,43,0,12,13]), function (require, exports, errors, treedefaults, markersModel_1, editorService_1, telemetry_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var Controller = (function (_super) {
        __extends(Controller, _super);
        function Controller(editorService, telemetryService) {
            _super.call(this);
            this.editorService = editorService;
            this.telemetryService = telemetryService;
        }
        Controller.prototype.onLeftClick = function (tree, element, event) {
            var currentFoucssed = tree.getFocus();
            if (_super.prototype.onLeftClick.call(this, tree, element, event)) {
                if (this.openFileAtElement(element, event.detail !== 2, event.ctrlKey || event.metaKey, event.detail === 2)) {
                    return true;
                }
                if (element instanceof markersModel_1.MarkersModel) {
                    if (currentFoucssed) {
                        tree.setFocus(currentFoucssed);
                    }
                    else {
                        tree.focusFirst();
                    }
                    return true;
                }
            }
            return false;
        };
        Controller.prototype.onEnter = function (tree, event) {
            if (_super.prototype.onEnter.call(this, tree, event)) {
                return this.openFileAtElement(tree.getFocus(), false, event.ctrlKey || event.metaKey, true);
            }
            return false;
        };
        Controller.prototype.onSpace = function (tree, event) {
            var element = tree.getFocus();
            if (element instanceof markersModel_1.Marker) {
                tree.setSelection([element]);
                return this.openFileAtElement(tree.getFocus(), true, false, false);
            }
            return _super.prototype.onSpace.call(this, tree, event);
        };
        Controller.prototype.openFileAtElement = function (element, preserveFocus, sideByside, pinned) {
            if (element instanceof markersModel_1.Marker) {
                this.telemetryService.publicLog('problems.marker.opened', { source: element.source });
                var marker = element.marker;
                this.editorService.openEditor({
                    resource: marker.resource,
                    options: {
                        selection: {
                            startLineNumber: marker.startLineNumber,
                            startColumn: marker.startColumn,
                            endLineNumber: marker.endLineNumber,
                            endColumn: marker.endColumn
                        },
                        preserveFocus: preserveFocus,
                        pinned: pinned,
                        revealIfVisible: true
                    },
                }, sideByside).done(null, errors.onUnexpectedError);
                return true;
            }
            return false;
        };
        Controller = __decorate([
            __param(0, editorService_1.IWorkbenchEditorService),
            __param(1, telemetry_1.ITelemetryService)
        ], Controller);
        return Controller;
    }(treedefaults.DefaultController));
    exports.Controller = Controller;
});










define(__m[14], __M([1,2,3,15,5,27,28,29,30,0,4]), function (require, exports, winjs_base_1, dom, severity_1, contextService_1, countBadge_1, fileLabel_1, highlightedLabel_1, markersModel_1, messages_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var DataSource = (function () {
        function DataSource() {
        }
        DataSource.prototype.getId = function (tree, element) {
            if (element instanceof markersModel_1.MarkersModel) {
                return 'root';
            }
            if (element instanceof markersModel_1.Resource) {
                return element.uri.toString();
            }
            if (element instanceof markersModel_1.Marker) {
                return element.id;
            }
            return '';
        };
        DataSource.prototype.hasChildren = function (tree, element) {
            return element instanceof markersModel_1.MarkersModel || element instanceof markersModel_1.Resource;
        };
        DataSource.prototype.getChildren = function (tree, element) {
            if (element instanceof markersModel_1.MarkersModel) {
                return winjs_base_1.TPromise.as(element.filteredResources);
            }
            if (element instanceof markersModel_1.Resource) {
                return winjs_base_1.TPromise.as(element.markers);
            }
            return null;
        };
        DataSource.prototype.getParent = function (tree, element) {
            return winjs_base_1.TPromise.as(null);
        };
        return DataSource;
    }());
    exports.DataSource = DataSource;
    var Renderer = (function () {
        function Renderer(actionRunner, actionProvider, contextService) {
            this.actionRunner = actionRunner;
            this.actionProvider = actionProvider;
            this.contextService = contextService;
        }
        Renderer.prototype.getHeight = function (tree, element) {
            return 22;
        };
        Renderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof markersModel_1.Resource) {
                return Renderer.RESOURCE_TEMPLATE_ID;
            }
            if (element instanceof markersModel_1.Marker) {
                return Renderer.MARKER_TEMPLATE_ID;
            }
            return '';
        };
        Renderer.prototype.renderTemplate = function (tree, templateId, container) {
            dom.addClass(container, 'markers-panel-tree-entry');
            switch (templateId) {
                case Renderer.RESOURCE_TEMPLATE_ID:
                    return this.renderResourceTemplate(container);
                case Renderer.MARKER_TEMPLATE_ID:
                    return this.renderMarkerTemplate(container);
            }
        };
        Renderer.prototype.renderResourceTemplate = function (container) {
            var data = Object.create(null);
            var resourceLabelContainer = dom.append(container, dom.emmet('.resource-label-container'));
            data.file = new fileLabel_1.FileLabel(resourceLabelContainer, null, this.contextService);
            // data.statistics= new MarkersStatisticsWidget(dom.append(container, dom.emmet('.marker-stats')));
            var badgeWrapper = dom.append(container, dom.emmet('.count-badge-wrapper'));
            data.count = new countBadge_1.CountBadge(badgeWrapper);
            return data;
        };
        Renderer.prototype.renderMarkerTemplate = function (container) {
            var data = Object.create(null);
            data.icon = dom.append(container, dom.emmet('.marker-icon'));
            data.source = new highlightedLabel_1.HighlightedLabel(dom.append(container, dom.emmet('')));
            data.description = new highlightedLabel_1.HighlightedLabel(dom.append(container, dom.emmet('.marker-description')));
            data.lnCol = dom.append(container, dom.emmet('span.marker-line'));
            return data;
        };
        Renderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            switch (templateId) {
                case Renderer.RESOURCE_TEMPLATE_ID:
                    return this.renderResourceElement(tree, element, templateData);
                case Renderer.MARKER_TEMPLATE_ID:
                    return this.renderMarkerElement(tree, element, templateData);
            }
        };
        Renderer.prototype.renderResourceElement = function (tree, element, templateData) {
            templateData.file.setValue(element.uri, element.matches);
            // templateData.statistics.setStatistics(element.statistics);
            templateData.count.setCount(element.markers.length);
        };
        Renderer.prototype.renderMarkerElement = function (tree, element, templateData) {
            var marker = element.marker;
            templateData.icon.className = 'icon ' + Renderer.iconClassNameFor(marker);
            templateData.description.set(marker.message, element.labelMatches);
            templateData.description.element.title = marker.message;
            dom.toggleClass(templateData.source.element, 'marker-source', !!marker.source);
            templateData.source.set(marker.source, element.sourceMatches);
            templateData.lnCol.textContent = messages_1.default.MARKERS_PANEL_AT_LINE_COL_NUMBER(marker.startLineNumber, marker.startColumn);
        };
        Renderer.iconClassNameFor = function (element) {
            switch (element.severity) {
                case severity_1.default.Ignore:
                    return 'info';
                case severity_1.default.Info:
                    return 'info';
                case severity_1.default.Warning:
                    return 'warning';
                case severity_1.default.Error:
                    return 'error';
            }
            return '';
        };
        Renderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
        };
        Renderer.RESOURCE_TEMPLATE_ID = 'resource-template';
        Renderer.MARKER_TEMPLATE_ID = 'marker-template';
        Renderer = __decorate([
            __param(2, contextService_1.IWorkspaceContextService)
        ], Renderer);
        return Renderer;
    }());
    exports.Renderer = Renderer;
    var MarkersTreeAccessibilityProvider = (function () {
        function MarkersTreeAccessibilityProvider() {
        }
        MarkersTreeAccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
            if (element instanceof markersModel_1.Resource) {
                return messages_1.default.MARKERS_TREE_ARIA_LABEL_RESOURCE(element.name, element.markers.length);
            }
            if (element instanceof markersModel_1.Marker) {
                return messages_1.default.MARKERS_TREE_ARIA_LABEL_MARKER(element.marker);
            }
            return null;
        };
        return MarkersTreeAccessibilityProvider;
    }());
    exports.MarkersTreeAccessibilityProvider = MarkersTreeAccessibilityProvider;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[31], __M([1,2,11,32,3,33,15,34,35,13,36,37,38,39,12,40,0,10,41,14,9,7,42,21,4,6]), function (require, exports, errors, Set, winjs_base_1, async_1, dom, lifecycle, markers_1, telemetry_1, event_1, groupService_1, fileEditorInput_1, panel_1, editorService_1, constants_1, markersModel_1, markersTreeController_1, TreeImpl, Viewer, instantiation_1, markersActionProvider_1, markersPanelActions_1, configuration_1, messages_1) {
    "use strict";
    var MarkersPanel = (function (_super) {
        __extends(MarkersPanel, _super);
        function MarkersPanel(instantiationService, markerService, editorGroupService, editorService, eventService, configurationService, telemetryService) {
            _super.call(this, constants_1.default.MARKERS_PANEL_ID, telemetryService);
            this.instantiationService = instantiationService;
            this.markerService = markerService;
            this.editorGroupService = editorGroupService;
            this.editorService = editorService;
            this.eventService = eventService;
            this.configurationService = configurationService;
            this.lastSelectedRelativeTop = 0;
            this.currentActiveFile = null;
            this.toDispose = [];
            this.delayedRefresh = new async_1.Delayer(500);
            this.autoExpanded = new Set.ArraySet();
        }
        MarkersPanel.prototype.create = function (parent) {
            _super.prototype.create.call(this, parent);
            this.markersModel = new markersModel_1.MarkersModel();
            dom.addClass(parent.getHTMLElement(), 'markers-panel');
            var conf = this.configurationService.getConfiguration();
            this.onConfigurationsUpdated(conf);
            var container = dom.append(parent.getHTMLElement(), dom.emmet('.markers-panel-container'));
            this.createMessageBox(container);
            this.createTree(container);
            this.createActions();
            this.createListeners();
            this.render();
            return winjs_base_1.TPromise.as(null);
        };
        MarkersPanel.prototype.getTitle = function () {
            var markerStatistics = this.markerService.getStatistics();
            return this.markersModel.getTitle(markerStatistics);
        };
        MarkersPanel.prototype.layout = function (dimension) {
            this.tree.layout(dimension.height);
        };
        MarkersPanel.prototype.focus = function () {
            if (this.tree.isDOMFocused()) {
                return;
            }
            if (this.markersModel.hasFilteredResources()) {
                this.tree.DOMFocus();
                if (this.tree.getSelection().length === 0) {
                    this.tree.focusFirst();
                }
                this.autoReveal(true);
            }
            else {
                this.messageBox.focus();
            }
        };
        MarkersPanel.prototype.getActions = function () {
            this.collapseAllAction.enabled = this.markersModel.hasFilteredResources();
            return this.actions;
        };
        MarkersPanel.prototype.refreshPanel = function (updateTitleArea) {
            var _this = this;
            if (updateTitleArea === void 0) { updateTitleArea = false; }
            this.collapseAllAction.enabled = this.markersModel.hasFilteredResources();
            if (updateTitleArea) {
                this.updateTitleArea();
            }
            dom.toggleClass(this.treeContainer, 'hidden', !this.markersModel.hasFilteredResources());
            this.renderMessage();
            if (this.markersModel.hasFilteredResources()) {
                return this.tree.refresh().then(function () {
                    _this.autoExpand();
                });
            }
            return winjs_base_1.TPromise.as(null);
        };
        MarkersPanel.prototype.updateFilter = function (filter) {
            this.markersModel.update(new markersModel_1.FilterOptions(filter));
            this.autoExpanded = new Set.ArraySet();
            this.refreshPanel();
            this.autoReveal();
        };
        MarkersPanel.prototype.createMessageBox = function (parent) {
            this.messageBoxContainer = dom.append(parent, dom.emmet('.message-box-container'));
            this.messageBox = dom.append(this.messageBoxContainer, dom.emmet('span'));
            this.messageBox.setAttribute('tabindex', '0');
        };
        MarkersPanel.prototype.createTree = function (parent) {
            this.treeContainer = dom.append(parent, dom.emmet('.tree-container'));
            var actionProvider = this.instantiationService.createInstance(markersActionProvider_1.ActionProvider);
            var renderer = this.instantiationService.createInstance(Viewer.Renderer, this.getActionRunner(), actionProvider);
            var controller = this.instantiationService.createInstance(markersTreeController_1.Controller);
            this.tree = new TreeImpl.Tree(this.treeContainer, {
                dataSource: new Viewer.DataSource(),
                renderer: renderer,
                controller: controller,
                accessibilityProvider: new Viewer.MarkersTreeAccessibilityProvider()
            }, {
                indentPixels: 0,
                twistiePixels: 20,
                ariaLabel: messages_1.default.MARKERS_PANEL_ARIA_LABEL_PROBLEMS_TREE
            });
        };
        MarkersPanel.prototype.createActions = function () {
            var _this = this;
            this.collapseAllAction = this.instantiationService.createInstance(markersPanelActions_1.CollapseAllAction, this.tree, true);
            this.filterAction = new markersPanelActions_1.FilterAction(this);
            this.actions = [
                this.filterAction,
                this.collapseAllAction
            ];
            this.actions.forEach(function (a) {
                _this.toDispose.push(a);
            });
        };
        MarkersPanel.prototype.createListeners = function () {
            var _this = this;
            this.toDispose.push(this.configurationService.onDidUpdateConfiguration(function (e) { return _this.onConfigurationsUpdated(e.config); }));
            this.toDispose.push(this.markerService.onMarkerChanged(this.onMarkerChanged, this));
            this.toDispose.push(this.editorGroupService.onEditorsChanged(this.onEditorsChanged, this));
            this.toDispose.push(this.tree.addListener2('selection', function () { return _this.onSelected(); }));
        };
        MarkersPanel.prototype.onMarkerChanged = function (changedResources) {
            var _this = this;
            this.updateResources(changedResources);
            this.delayedRefresh.trigger(function () {
                _this.refreshPanel(true);
                _this.autoReveal();
            });
        };
        MarkersPanel.prototype.onEditorsChanged = function () {
            var activeInput = this.editorService.getActiveEditorInput();
            this.currentActiveFile = activeInput instanceof fileEditorInput_1.FileEditorInput ? activeInput.getResource() : null;
            this.autoReveal();
        };
        MarkersPanel.prototype.onConfigurationsUpdated = function (conf) {
            this.hasToAutoReveal = conf && conf.problems && conf.problems.autoReveal;
        };
        MarkersPanel.prototype.onSelected = function () {
            var selection = this.tree.getSelection();
            if (selection && selection.length > 0) {
                this.lastSelectedRelativeTop = this.tree.getRelativeTop(selection[0]);
            }
        };
        MarkersPanel.prototype.updateResources = function (resources) {
            var _this = this;
            resources.forEach(function (resource) {
                var markers = _this.markerService.read({ resource: resource }).slice(0);
                _this.markersModel.update(resource, markers);
                if (!_this.markersModel.hasResource(resource)) {
                    _this.autoExpanded.unset(resource.toString());
                }
            });
        };
        MarkersPanel.prototype.render = function () {
            var allMarkers = this.markerService.read().slice(0);
            this.markersModel.update(allMarkers);
            this.tree.setInput(this.markersModel).then(this.autoExpand.bind(this));
            dom.toggleClass(this.treeContainer, 'hidden', !this.markersModel.hasFilteredResources());
            this.renderMessage();
        };
        MarkersPanel.prototype.renderMessage = function () {
            var message = this.markersModel.getMessage();
            this.messageBox.textContent = message;
            dom.toggleClass(this.messageBoxContainer, 'hidden', this.markersModel.hasFilteredResources());
        };
        MarkersPanel.prototype.autoExpand = function () {
            var _this = this;
            this.markersModel.filteredResources.forEach(function (resource) {
                if (_this.autoExpanded.contains(resource.uri.toString())) {
                    return;
                }
                _this.tree.expand(resource).done(null, errors.onUnexpectedError);
                _this.autoExpanded.set(resource.uri.toString());
            });
        };
        MarkersPanel.prototype.autoReveal = function (focus) {
            if (focus === void 0) { focus = false; }
            var conf = this.configurationService.getConfiguration();
            if (conf && conf.problems && conf.problems.autoReveal) {
                this.revealMarkersForCurrentActiveEditor(focus);
            }
        };
        MarkersPanel.prototype.revealMarkersForCurrentActiveEditor = function (focus) {
            if (focus === void 0) { focus = false; }
            var currentActiveResource = this.getResourceForCurrentActiveFile();
            if (currentActiveResource) {
                if (this.tree.isExpanded(currentActiveResource) && this.hasSelectedMarkerFor(currentActiveResource)) {
                    this.tree.reveal(this.tree.getSelection()[0], this.lastSelectedRelativeTop);
                    if (focus) {
                        this.tree.setFocus(this.tree.getSelection()[0]);
                    }
                }
                else {
                    this.tree.reveal(currentActiveResource, 0);
                    if (focus) {
                        this.tree.setFocus(currentActiveResource);
                        this.tree.setSelection([currentActiveResource]);
                    }
                }
            }
            else if (focus) {
                this.tree.setSelection([]);
                this.tree.focusFirst();
            }
        };
        MarkersPanel.prototype.getResourceForCurrentActiveFile = function () {
            var _this = this;
            if (this.currentActiveFile) {
                var resources = this.markersModel.filteredResources.filter(function (resource) {
                    return _this.currentActiveFile.toString() === resource.uri.toString();
                });
                return resources.length > 0 ? resources[0] : null;
            }
            return null;
        };
        MarkersPanel.prototype.hasSelectedMarkerFor = function (resource) {
            var selectedElement = this.tree.getSelection();
            if (selectedElement && selectedElement.length > 0) {
                if (selectedElement[0] instanceof markersModel_1.Marker) {
                    if (resource.uri.toString() === selectedElement[0].marker.resource.toString()) {
                        return true;
                    }
                }
            }
            return false;
        };
        MarkersPanel.prototype.getActionItem = function (action) {
            if (action.id === markersPanelActions_1.FilterAction.ID) {
                return this.instantiationService.createInstance(markersPanelActions_1.FilterInputBoxActionItem, this, action);
            }
            return _super.prototype.getActionItem.call(this, action);
        };
        MarkersPanel.prototype.dispose = function () {
            this.delayedRefresh.cancel();
            this.toDispose = lifecycle.dispose(this.toDispose);
            this.tree.dispose();
            this.markersModel.dispose();
            _super.prototype.dispose.call(this);
        };
        MarkersPanel = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, markers_1.IMarkerService),
            __param(2, groupService_1.IEditorGroupService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, event_1.IEventService),
            __param(5, configuration_1.IConfigurationService),
            __param(6, telemetry_1.ITelemetryService)
        ], MarkersPanel);
        return MarkersPanel;
    }(panel_1.Panel));
    exports.MarkersPanel = MarkersPanel;
});

}).call(this);
//# sourceMappingURL=markersPanel.js.map
