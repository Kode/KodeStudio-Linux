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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/base/browser/dom', 'vs/base/common/errors', 'vs/platform/platform', 'vs/base/browser/builder', 'vs/base/common/actions', 'vs/base/browser/ui/actionbar/actionbar', 'vs/workbench/common/component', 'vs/workbench/common/events', 'vs/workbench/browser/actionBarRegistry', 'vs/base/browser/ui/toolbar/toolbar', 'vs/base/browser/dnd', 'vs/base/common/lifecycle', 'vs/base/browser/ui/splitview/splitview', 'vs/workbench/services/viewlet/common/viewletService', 'vs/workbench/services/editor/common/editorService', 'vs/platform/contextview/browser/contextView', 'vs/platform/instantiation/common/descriptors', 'vs/platform/message/common/message', 'vs/platform/telemetry/common/telemetry', 'vs/platform/selection/common/selection', 'vs/platform/instantiation/common/instantiation'], function (require, exports, nls, winjs_base_1, DOM, errors, platform_1, builder_1, actions_1, actionbar_1, component_1, events_1, actionBarRegistry_1, toolbar_1, dnd_1, lifecycle_1, splitview_1, viewletService_1, editorService_1, contextView_1, descriptors_1, message_1, telemetry_1, selection_1, instantiation_1) {
    /**
     * Internal viewlet events to communicate with viewlet container.
     */
    exports.EventType = {
        INTERNAL_VIEWLET_TITLE_AREA_UPDATE: 'internalViewletTitleAreaUpdate'
    };
    /**
     * Viewlets are layed out in the sidebar part of the workbench. Only one viewlet can be open
     * at a time. Each viewlet has a minimized representation that is good enough to provide some
     * information about the state of the viewlet data.
     * The workbench will keep a viewlet alive after it has been created and show/hide it based on
     * user interaction. The lifecycle of a viewlet goes in the order create(), setVisible(true|false),
     * layout(), focus(), dispose(). During use of the workbench, a viewlet will often receive a setVisible,
     * layout and focus call, but only one create and dispose call.
     */
    var Viewlet = (function (_super) {
        __extends(Viewlet, _super);
        /**
         * Create a new viewlet with the given ID and context.
         */
        function Viewlet(id, _telemetryService) {
            _super.call(this, id);
            this._telemetryService = _telemetryService;
            this._telemetryData = {};
            this.visible = false;
        }
        Viewlet.prototype.getTitle = function () {
            return null;
        };
        Object.defineProperty(Viewlet.prototype, "telemetryService", {
            get: function () {
                return this._telemetryService;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewlet.prototype, "telemetryData", {
            get: function () {
                return this._telemetryData;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Note: Clients should not call this method, the monaco workbench calls this
         * method. Calling it otherwise may result in unexpected behavior.
         *
         * Called to create this viewlet on the provided builder. This method is only
         * called once during the lifetime of the workbench.
         * Note that DOM-dependent calculations should be performed from the setVisible()
         * call. Only then the viewlet will be part of the DOM.
         */
        Viewlet.prototype.create = function (parent) {
            this.parent = parent;
            return winjs_base_1.Promise.as(null);
        };
        /**
         * Returns the container this viewlet is being build in.
         */
        Viewlet.prototype.getContainer = function () {
            return this.parent;
        };
        /**
         * Note: Clients should not call this method, the monaco workbench calls this
         * method. Calling it otherwise may result in unexpected behavior.
         *
         * Called to indicate that the viewlet has become visible or hidden. This method
         * is called more than once during workbench lifecycle depending on the user interaction.
         * The viewlet will be on-DOM if visible is set to true and off-DOM otherwise.
         *
         * The returned promise is complete when the viewlet is visible. As such it is valid
         * to do a long running operation from this call. Typically this operation should be
         * fast though because setVisible might be called many times during a session.
         */
        Viewlet.prototype.setVisible = function (visible) {
            this.visible = visible;
            // Reset telemetry data when viewlet becomes visible
            if (visible) {
                this._telemetryData = {};
                this._telemetryData.startTime = new Date();
            }
            else {
                this._telemetryData.timeSpent = (Date.now() - this._telemetryData.startTime) / 1000;
                delete this._telemetryData.startTime;
                // Only submit telemetry data when not running from an integration test
                if (this._telemetryService && this._telemetryService.publicLog) {
                    var eventName = 'viewletShown';
                    this._telemetryData.viewlet = this.getId();
                    this._telemetryService.publicLog(eventName, this._telemetryData);
                }
            }
            return winjs_base_1.TPromise.as(null);
        };
        /**
         * Called when this viewlet should receive keyboard focus.
         */
        Viewlet.prototype.focus = function () {
            // Subclasses can implement
        };
        /**
         * Returns an array of actions to show in the action bar of the viewlet.
         */
        Viewlet.prototype.getActions = function () {
            return [];
        };
        /**
         * Returns an array of actions to show in the action bar of the viewlet
         * in a less prominent way then action from getActions.
         */
        Viewlet.prototype.getSecondaryActions = function () {
            return [];
        };
        /**
         * For any of the actions returned by this viewlet, provide an IActionItem in
         * cases where the implementor of the viewlet wants to override the presentation
         * of an action. Returns null to indicate that the action is not rendered through
         * an action item.
         */
        Viewlet.prototype.getActionItem = function (action) {
            return null;
        };
        /**
         * Returns the instance of IActionRunner to use with this viewlet for the viewlet
         * tool bar.
         */
        Viewlet.prototype.getActionRunner = function () {
            if (!this.actionRunner) {
                this.actionRunner = new actions_1.ActionRunner();
            }
            return this.actionRunner;
        };
        /**
         * Method for viewlet implementors to indicate to the viewlet container that the title or the actions
         * of the viewlet have changed. Calling this method will cause the container to ask for title (getTitle())
         * and actions (getActions(), getSecondaryActions()) if the viewlet is visible or the next time the viewlet
         * gets visible.
         */
        Viewlet.prototype.updateTitleArea = function () {
            this.emit(exports.EventType.INTERNAL_VIEWLET_TITLE_AREA_UPDATE, new events_1.ViewletEvent(this.getId()));
        };
        /**
         * Returns an array of elements that are selected in the viewlet.
         */
        Viewlet.prototype.getSelection = function () {
            return selection_1.Selection.EMPTY;
        };
        /**
         * Returns true if this viewlet is currently visible and false otherwise.
         */
        Viewlet.prototype.isVisible = function () {
            return this.visible;
        };
        /**
         * Returns the underlying viewlet control or null if it is not accessible.
         */
        Viewlet.prototype.getControl = function () {
            return null;
        };
        Viewlet = __decorate([
            __param(1, telemetry_1.ITelemetryService)
        ], Viewlet);
        return Viewlet;
    })(component_1.WorkbenchComponent);
    exports.Viewlet = Viewlet;
    /**
     * Helper subtype of viewlet for those that use a tree inside.
     */
    var ViewerViewlet = (function (_super) {
        __extends(ViewerViewlet, _super);
        function ViewerViewlet() {
            _super.apply(this, arguments);
        }
        ViewerViewlet.prototype.create = function (parent) {
            var _this = this;
            _super.prototype.create.call(this, parent);
            // Container for Viewer
            this.viewerContainer = parent.div();
            // Viewer
            this.viewer = this.createViewer(this.viewerContainer);
            // Eventing
            this.toUnbind.push(this.viewer.addListener('selection', function (e) { return _this.onSelection(e); }));
            this.toUnbind.push(this.viewer.addListener('focus', function (e) { return _this.onFocus(e); }));
            return winjs_base_1.Promise.as(null);
        };
        /**
         * Returns the viewer that is contained in this viewlet.
         */
        ViewerViewlet.prototype.getViewer = function () {
            return this.viewer;
        };
        ViewerViewlet.prototype.setVisible = function (visible) {
            var promise;
            if (visible) {
                promise = _super.prototype.setVisible.call(this, visible);
                this.getViewer().onVisible();
            }
            else {
                this.getViewer().onHidden();
                promise = _super.prototype.setVisible.call(this, visible);
            }
            return promise;
        };
        ViewerViewlet.prototype.focus = function () {
            if (!this.viewer) {
                return; // return early if viewlet has not yet been created
            }
            // Make sure the current selected element is revealed
            var selection = this.viewer.getSelection();
            if (selection.length > 0) {
                this.reveal(selection[0], 0.5).done(null, errors.onUnexpectedError);
            }
            // Pass Focus to Viewer
            this.viewer.DOMFocus();
        };
        ViewerViewlet.prototype.reveal = function (element, relativeTop) {
            if (!this.viewer) {
                return winjs_base_1.Promise.as(null); // return early if viewlet has not yet been created
            }
            // The viewer cannot properly reveal without being layed out, so force it if not yet done
            if (!this.wasLayouted) {
                this.viewer.layout();
            }
            // Now reveal
            return this.viewer.reveal(element, relativeTop);
        };
        ViewerViewlet.prototype.layout = function (dimension) {
            if (!this.viewer) {
                return; // return early if viewlet has not yet been created
            }
            // Pass on to Viewer
            this.wasLayouted = true;
            this.viewer.layout(dimension.height);
        };
        ViewerViewlet.prototype.getControl = function () {
            return this.viewer;
        };
        ViewerViewlet.prototype.getSelection = function () {
            if (!this.viewer) {
                return new selection_1.StructuredSelection([]); // return early if viewlet has not yet been created
            }
            return new selection_1.StructuredSelection(this.viewer.getSelection());
        };
        ViewerViewlet.prototype.dispose = function () {
            // Dispose Viewer
            if (this.viewer) {
                this.viewer.dispose();
            }
            _super.prototype.dispose.call(this);
        };
        return ViewerViewlet;
    })(Viewlet);
    exports.ViewerViewlet = ViewerViewlet;
    /**
     * A viewlet descriptor is a leightweight descriptor of a viewlet in the monaco workbench.
     */
    var ViewletDescriptor = (function (_super) {
        __extends(ViewletDescriptor, _super);
        function ViewletDescriptor(moduleId, ctorName, id, name, cssClass, order) {
            _super.call(this, moduleId, ctorName);
            this.id = id;
            this.name = name;
            this.cssClass = cssClass;
            this.order = order;
        }
        return ViewletDescriptor;
    })(descriptors_1.AsyncDescriptor);
    exports.ViewletDescriptor = ViewletDescriptor;
    exports.Extensions = {
        Viewlets: 'workbench.contributions.viewlets'
    };
    var ViewletRegistry = (function () {
        function ViewletRegistry() {
            this.viewlets = [];
        }
        ViewletRegistry.prototype.registerViewlet = function (descriptor) {
            if (this.viewletById(descriptor.id) !== null) {
                return;
            }
            this.viewlets.push(descriptor);
        };
        ViewletRegistry.prototype.getViewlet = function (id) {
            return this.viewletById(id);
        };
        ViewletRegistry.prototype.getViewlets = function () {
            return this.viewlets.slice(0);
        };
        ViewletRegistry.prototype.setViewlets = function (viewletsToSet) {
            this.viewlets = viewletsToSet;
        };
        ViewletRegistry.prototype.viewletById = function (id) {
            for (var i = 0; i < this.viewlets.length; i++) {
                if (this.viewlets[i].id === id) {
                    return this.viewlets[i];
                }
            }
            return null;
        };
        ViewletRegistry.prototype.setDefaultViewletId = function (id) {
            this.defaultViewletId = id;
        };
        ViewletRegistry.prototype.getDefaultViewletId = function () {
            return this.defaultViewletId;
        };
        return ViewletRegistry;
    })();
    platform_1.Registry.add(exports.Extensions.Viewlets, new ViewletRegistry());
    /**
     * A reusable action to toggle a viewlet with a specific id.
     */
    var ToggleViewletAction = (function (_super) {
        __extends(ToggleViewletAction, _super);
        function ToggleViewletAction(id, name, viewletId, viewletService, editorService) {
            _super.call(this, id, name);
            this.viewletService = viewletService;
            this.editorService = editorService;
            this.viewletId = viewletId;
            this.enabled = !!this.viewletService && !!this.editorService;
        }
        ToggleViewletAction.prototype.run = function () {
            // Pass focus to viewlet if not open or focussed
            if (this.otherViewletShowing() || !this.sidebarHasFocus()) {
                return this.viewletService.openViewlet(this.viewletId, true);
            }
            // Otherwise pass focus to editor if possible
            var editor = this.editorService.getActiveEditor();
            if (editor) {
                editor.focus();
            }
            return winjs_base_1.Promise.as(true);
        };
        ToggleViewletAction.prototype.otherViewletShowing = function () {
            var activeViewlet = this.viewletService.getActiveViewlet();
            return !activeViewlet || activeViewlet.getId() !== this.viewletId;
        };
        ToggleViewletAction.prototype.sidebarHasFocus = function () {
            var activeViewlet = this.viewletService.getActiveViewlet();
            var activeElement = document.activeElement;
            return activeViewlet && activeElement && DOM.isAncestor(activeElement, activeViewlet.getContainer().getHTMLElement());
        };
        ToggleViewletAction = __decorate([
            __param(3, viewletService_1.IViewletService),
            __param(4, editorService_1.IWorkbenchEditorService)
        ], ToggleViewletAction);
        return ToggleViewletAction;
    })(actions_1.Action);
    exports.ToggleViewletAction = ToggleViewletAction;
    // Collapse All action
    var CollapseAction = (function (_super) {
        __extends(CollapseAction, _super);
        function CollapseAction(viewer, enabled, clazz, ns) {
            _super.call(this, 'workbench.action.collapse', nls.localize('collapse', "Collapse"), clazz, enabled, function (context) {
                if (viewer.getHighlight()) {
                    return winjs_base_1.Promise.as(null); // Global action disabled if user is in edit mode from another action
                }
                viewer.collapseAll();
                viewer.clearSelection(); // Chance is high that element is now hidden, so unselect all
                viewer.DOMFocus(); // Pass keyboard focus back from action link to tree
                return winjs_base_1.Promise.as(null);
            });
        }
        CollapseAction = __decorate([
            __param(3, instantiation_1.INullService)
        ], CollapseAction);
        return CollapseAction;
    })(actions_1.Action);
    exports.CollapseAction = CollapseAction;
    /**
     * The AdaptiveCollapsibleViewletView can grow with the content inside dynamically.
     */
    var AdaptiveCollapsibleViewletView = (function (_super) {
        __extends(AdaptiveCollapsibleViewletView, _super);
        function AdaptiveCollapsibleViewletView(actionRunner, initialBodySize, collapsed, viewName, messageService, contextMenuService) {
            _super.call(this, {
                expandedBodySize: initialBodySize,
                headerSize: 22,
                initialState: collapsed ? splitview_1.CollapsibleState.COLLAPSED : splitview_1.CollapsibleState.EXPANDED
            });
            this.viewName = viewName;
            this.messageService = messageService;
            this.contextMenuService = contextMenuService;
            this.actionRunner = actionRunner;
            this.toDispose = [];
        }
        AdaptiveCollapsibleViewletView.prototype.create = function () {
            return winjs_base_1.Promise.as(null);
        };
        AdaptiveCollapsibleViewletView.prototype.renderHeader = function (container) {
            var _this = this;
            // Tool bar
            this.toolBar = new toolbar_1.ToolBar(builder_1.$('div.actions').appendTo(container).getHTMLElement(), this.contextMenuService, {
                orientation: actionbar_1.ActionsOrientation.HORIZONTAL,
                actionItemProvider: function (action) { return _this.getActionItem(action); }
            });
            this.toolBar.actionRunner = this.actionRunner;
            this.toolBar.setActions(actionBarRegistry_1.prepareActions(this.getActions()), actionBarRegistry_1.prepareActions(this.getSecondaryActions()))();
            // Expand on drag over
            new dnd_1.DelayedDragHandler(container, function () {
                if (!_this.isExpanded()) {
                    _this.expand();
                }
            });
        };
        AdaptiveCollapsibleViewletView.prototype.renderViewTree = function (container) {
            return renderViewTree(container);
        };
        AdaptiveCollapsibleViewletView.prototype.getViewer = function () {
            return this.tree;
        };
        AdaptiveCollapsibleViewletView.prototype.refresh = function (focus, reveal, instantProgress) {
            return winjs_base_1.Promise.as(null);
        };
        AdaptiveCollapsibleViewletView.prototype.setVisible = function (visible) {
            this.isVisible = visible;
            if (visible) {
                this.tree.onVisible();
            }
            else {
                this.tree.onHidden();
            }
            return winjs_base_1.Promise.as(null);
        };
        AdaptiveCollapsibleViewletView.prototype.focus = function () {
            focus(this.tree);
        };
        AdaptiveCollapsibleViewletView.prototype.getSelection = function () {
            return new selection_1.StructuredSelection(this.tree.getSelection());
        };
        AdaptiveCollapsibleViewletView.prototype.reveal = function (element, relativeTop) {
            return reveal(this.tree, element, relativeTop);
        };
        AdaptiveCollapsibleViewletView.prototype.layoutBody = function (size) {
            this.treeContainer.style.height = size + 'px';
            this.tree.layout(size);
        };
        AdaptiveCollapsibleViewletView.prototype.getActions = function () {
            return [];
        };
        AdaptiveCollapsibleViewletView.prototype.getSecondaryActions = function () {
            return [];
        };
        AdaptiveCollapsibleViewletView.prototype.getActionItem = function (action) {
            return null;
        };
        AdaptiveCollapsibleViewletView.prototype.shutdown = function () {
            // Subclass to implement
        };
        AdaptiveCollapsibleViewletView.prototype.dispose = function () {
            this.isDisposed = true;
            this.treeContainer = null;
            this.tree.dispose();
            this.toDispose = lifecycle_1.disposeAll(this.toDispose);
            if (this.toolBar) {
                this.toolBar.dispose();
            }
            _super.prototype.dispose.call(this);
        };
        AdaptiveCollapsibleViewletView = __decorate([
            __param(4, message_1.IMessageService),
            __param(5, contextView_1.IContextMenuService)
        ], AdaptiveCollapsibleViewletView);
        return AdaptiveCollapsibleViewletView;
    })(splitview_1.FixedCollapsibleView);
    exports.AdaptiveCollapsibleViewletView = AdaptiveCollapsibleViewletView;
    var CollapsibleViewletView = (function (_super) {
        __extends(CollapsibleViewletView, _super);
        function CollapsibleViewletView(actionRunner, collapsed, viewName, messageService, contextMenuService) {
            _super.call(this, {
                minimumSize: 2 * 22,
                initialState: collapsed ? splitview_1.CollapsibleState.COLLAPSED : splitview_1.CollapsibleState.EXPANDED
            });
            this.viewName = viewName;
            this.messageService = messageService;
            this.contextMenuService = contextMenuService;
            this.actionRunner = actionRunner;
            this.toDispose = [];
        }
        CollapsibleViewletView.prototype.create = function () {
            return winjs_base_1.Promise.as(null);
        };
        CollapsibleViewletView.prototype.renderHeader = function (container) {
            var _this = this;
            // Tool bar
            this.toolBar = new toolbar_1.ToolBar(builder_1.$('div.actions').appendTo(container).getHTMLElement(), this.contextMenuService, {
                orientation: actionbar_1.ActionsOrientation.HORIZONTAL,
                actionItemProvider: function (action) { return _this.getActionItem(action); }
            });
            this.toolBar.actionRunner = this.actionRunner;
            this.toolBar.setActions(actionBarRegistry_1.prepareActions(this.getActions()), actionBarRegistry_1.prepareActions(this.getSecondaryActions()))();
            // Expand on drag over
            new dnd_1.DelayedDragHandler(container, function () {
                if (!_this.isExpanded()) {
                    _this.expand();
                }
            });
        };
        CollapsibleViewletView.prototype.renderViewTree = function (container) {
            return renderViewTree(container);
        };
        CollapsibleViewletView.prototype.getViewer = function () {
            return this.tree;
        };
        CollapsibleViewletView.prototype.refresh = function (focus, reveal, instantProgress) {
            return winjs_base_1.Promise.as(null);
        };
        CollapsibleViewletView.prototype.setVisible = function (visible) {
            this.isVisible = visible;
            if (visible) {
                this.tree.onVisible();
            }
            else {
                this.tree.onHidden();
            }
            return winjs_base_1.Promise.as(null);
        };
        CollapsibleViewletView.prototype.focus = function () {
            focus(this.tree);
        };
        CollapsibleViewletView.prototype.getSelection = function () {
            return new selection_1.StructuredSelection(this.tree.getSelection());
        };
        CollapsibleViewletView.prototype.reveal = function (element, relativeTop) {
            return reveal(this.tree, element, relativeTop);
        };
        CollapsibleViewletView.prototype.layoutBody = function (size) {
            this.treeContainer.style.height = size + 'px';
            this.tree.layout(size);
        };
        CollapsibleViewletView.prototype.getActions = function () {
            return [];
        };
        CollapsibleViewletView.prototype.getSecondaryActions = function () {
            return [];
        };
        CollapsibleViewletView.prototype.getActionItem = function (action) {
            return null;
        };
        CollapsibleViewletView.prototype.shutdown = function () {
            // Subclass to implement
        };
        CollapsibleViewletView.prototype.dispose = function () {
            this.isDisposed = true;
            this.treeContainer = null;
            this.tree.dispose();
            this.toDispose = lifecycle_1.disposeAll(this.toDispose);
            if (this.toolBar) {
                this.toolBar.dispose();
            }
            _super.prototype.dispose.call(this);
        };
        CollapsibleViewletView = __decorate([
            __param(3, message_1.IMessageService),
            __param(4, contextView_1.IContextMenuService)
        ], CollapsibleViewletView);
        return CollapsibleViewletView;
    })(splitview_1.CollapsibleView);
    exports.CollapsibleViewletView = CollapsibleViewletView;
    function renderViewTree(container) {
        var treeContainer = document.createElement('div');
        DOM.addClass(treeContainer, 'explorer-view-content');
        container.appendChild(treeContainer);
        return treeContainer;
    }
    function focus(tree) {
        if (!tree) {
            return; // return early if viewlet has not yet been created
        }
        // Make sure the current selected element is revealed
        var selection = tree.getSelection();
        if (selection.length > 0) {
            reveal(tree, selection[0], 0.5);
        }
        // Pass Focus to Viewer
        tree.DOMFocus();
    }
    function reveal(tree, element, relativeTop) {
        if (!tree) {
            return winjs_base_1.Promise.as(null); // return early if viewlet has not yet been created
        }
        return tree.reveal(element, relativeTop);
    }
});
//# sourceMappingURL=viewlet.js.map