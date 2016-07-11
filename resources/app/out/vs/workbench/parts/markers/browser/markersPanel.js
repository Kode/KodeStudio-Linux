/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["vs/workbench/parts/markers/common/markersModel","require","exports","vs/base/common/winjs.base","vs/workbench/parts/markers/browser/markersActionProvider","vs/css!vs/workbench/parts/markers/browser/media/markers","vs/platform/instantiation/common/instantiation","vs/nls!vs/workbench/parts/markers/browser/markersActionProvider","vs/workbench/parts/markers/browser/markersTreeController","vs/base/common/errors","vs/workbench/services/editor/common/editorService","vs/platform/telemetry/common/telemetry","vs/workbench/parts/markers/browser/markersTreeViewer","vs/base/browser/dom","vs/workbench/parts/markers/common/messages","vs/nls","vs/nls!vs/workbench/parts/markers/browser/markersPanel","vs/platform/configuration/common/configuration","vs/base/common/actions","vs/css!vs/workbench/parts/markers/browser/markersPanel","vs/workbench/services/workspace/common/contextService","vs/base/browser/ui/countBadge/countBadge","vs/base/browser/ui/fileLabel/fileLabel","vs/base/browser/ui/highlightedlabel/highlightedLabel","vs/base/parts/tree/browser/treeDefaults","vs/workbench/parts/markers/browser/markersPanel","vs/base/common/set","vs/base/common/async","vs/base/common/lifecycle","vs/platform/markers/common/markers","vs/platform/event/common/event","vs/workbench/services/group/common/groupService","vs/workbench/parts/files/browser/editors/fileEditorInput","vs/workbench/browser/panel","vs/workbench/parts/markers/common/constants","vs/base/parts/tree/browser/treeImpl","vs/workbench/parts/markers/browser/markersPanelActions","vs/base/common/severity"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[5], __M([19]), {});
define(__m[7], __M([15,16]), function(nls, data) { return nls.create("vs/workbench/parts/markers/browser/markersActionProvider", data); });
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
define(__m[4], __M([1,2,7,3,18,6,0]), function (require, exports, nls, winjs, actions, instantiation_1, markersModel_1) {
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















define(__m[8], __M([1,2,9,24,0,10,11]), function (require, exports, errors, treedefaults, markersModel_1, editorService_1, telemetry_1) {
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
                if (this.openFileAtElement(element, event.detail !== 2, event.ctrlKey, event.detail === 2)) {
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
                return this.openFileAtElement(tree.getFocus(), false, false, false);
            }
            return false;
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
                        pinned: pinned
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










define(__m[12], __M([1,2,3,13,37,20,21,22,23,0,14]), function (require, exports, winjs_base_1, dom, severity_1, contextService_1, countBadge_1, fileLabel_1, highlightedLabel_1, markersModel_1, messages_1) {
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
    var ProblemsTreeAccessibilityProvider = (function () {
        function ProblemsTreeAccessibilityProvider() {
        }
        ProblemsTreeAccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
            if (element instanceof markersModel_1.Resource) {
                return messages_1.default.PROBLEMS_TREE_ARIA_LABEL_RESOURCE(element.name, element.markers.length);
            }
            if (element instanceof markersModel_1.Marker) {
                return messages_1.default.PROBLEMS_TREE_ARIA_LABEL_MARKER(element.marker);
            }
            return null;
        };
        return ProblemsTreeAccessibilityProvider;
    }());
    exports.ProblemsTreeAccessibilityProvider = ProblemsTreeAccessibilityProvider;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[25], __M([1,2,9,26,3,27,13,28,29,11,30,31,32,33,10,34,0,8,35,12,6,4,36,17,14,5]), function (require, exports, errors, Set, winjs_base_1, async_1, dom, lifecycle, markers_1, telemetry_1, event_1, groupService_1, fileEditorInput_1, panel_1, editorService_1, constants_1, markersModel_1, markersTreeController_1, TreeImpl, Viewer, instantiation_1, markersActionProvider_1, markersPanelActions_1, configuration_1, messages_1) {
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
            this.delayedRefresh = new async_1.Delayer(1000);
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
            this.refreshAutoExpanded();
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
                accessibilityProvider: new Viewer.ProblemsTreeAccessibilityProvider()
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
            this.updateResources(changedResources);
            // this.delayedRefresh.trigger(() => {this.refreshPanel(true);});
            this.refreshPanel(true);
            this.autoReveal();
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
        MarkersPanel.prototype.refreshAutoExpanded = function () {
            var _this = this;
            this.markersModel.nonFilteredResources.forEach(function (resource) {
                if (_this.tree.isExpanded(resource)) {
                    _this.autoExpanded.unset(resource.uri.toString());
                }
            });
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
                this.revealProblemsForCurrentActiveEditor(focus);
            }
        };
        MarkersPanel.prototype.revealProblemsForCurrentActiveEditor = function (focus) {
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
